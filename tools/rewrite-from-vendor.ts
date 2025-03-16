// rewrite file(s) from remote vendored packages (using vendor import_map)
// note: idempotent if/when run multiple times

// spell-checker:ignore (people) rivy

import {
	dirname,
	fromFileUrl,
	join,
	relative,
	resolve,
	toFileUrl,
} from 'https://deno.land/std@0.224.0/path/mod.ts';
import { toText } from 'https://deno.land/std@0.224.0/streams/mod.ts';
import ts from 'https://esm.sh/typescript@5.7.3';

import * as $lib from 'https://cdn.jsdelivr.net/gh/rivy/deno.dxx@89a9a3084a/src/lib/$shared.ts';
// $lib.intoPlatformPath();
import { traversal } from 'https://cdn.jsdelivr.net/gh/rivy/deno.dxx@89a9a3084a/src/lib/$shared.ts';

const scriptDirURL = new URL('./', import.meta.url);

// const vendorDirURL = new URL('../vendor/deno@1.44.4-vendor/', scriptDirURL);
const vendorDirURL = new URL(
	'https://cdn.jsdelivr.net/gh/rivy-t/deno.vendor-storage@c049d09659/vendor/deno@1.44.4-vendor/',
);
const importMapURL = new URL('import_map.json', vendorDirURL);

console.warn({ scriptDirURL, vendorDirURL, importMapURL });

// Load the import map
// const importMapText = await Deno.readTextFile(importMapURL);
const importMapText = await fetchText(importMapURL);
const importMap = JSON.parse(importMapText);
const globalImports = importMap.imports || {};
const scopes = importMap.scopes || {};

/**
 * Creates a transformer that replaces module specifiers using both global imports
 * and scope-specific mappings.
 *
 * @param fileURL - The URL corresponding to the current file (aka, the parent module).
 * @!param parentURL - The URL corresponding to the current file (aka, the parent module).
 * @param importMapURL - The URL corresponding to the *import_map.json* file.
 * @param imports - Global imports mapping from the import map.
 * @param scopes - Scopes mapping from the import map.
 */
function createTransformer(
	fileURL: URL,
	// parentURL: URL,
	importMapURL: URL,
	imports: Record<string, string>,
	scopes: Record<string, Record<string, string>>,
) {
	// ref: [JS Import Maps, Part 1](https://spidermonkey.dev/blog/2023/02/23/javascript-import-maps-part-1-introduction.html) @@ <https://archive.is/EkKuc>
	// ref: [JS Import Maps, Part 2 (In-Depth Exploration)](https://spidermonkey.dev/blog/2023/03/02/javascript-import-maps-part-2-in-depth-exploration.html) @@ <https://archive.is/1z1NO>

	// Helper: Given a module specifier string, return its rewritten version if applicable.
	function resolveSpecifier(specifier: string): string {
		console.warn(`resolveSpecifier(${specifier}) for file='${fileURL.href}'`);

		let finalSpecifier = specifier;

		let scopeMatch = false;
		// Check scope mappings first: if the file's URL starts with a scope key,
		// then check that scope's mapping for a matching prefix.
		for (const [scope, scopeImports] of Object.entries(scopes)) {
			const scopeURL = new URL(scope, importMapURL);
			// console.warn(`scope=${scopeURL.href}`);
			// const scopePath = resolve(join(dirname(resolve(importMapURL)), scope));
			// const scopePrefixURL = new URL(scopePrefix, importMapURL);
			// console.warn(`scopePrefix=${scopePrefixURL.href}`);
			if (fileURL.href.startsWith(scopeURL.href)) {
				scopeMatch = true;
			}
			// console.warn({ scope: scopeURL.href, scopeMatch });
			if (scopeMatch) {
				// entries sorted by longest common prefix
				for (const [remote, local] of Object.entries(scopeImports).sort(
					([a], [b]) => b.length - a.length,
				)) {
					if (finalSpecifier.startsWith(remote)) {
						finalSpecifier = finalSpecifier.replace(remote, local);
					}
				}
			}
		}
		if (!scopeMatch) {
			// Fall back to the global imports mapping.
			for (const [remote, local] of Object.entries(imports).sort(
				([a], [b]) => b.length - a.length,
			)) {
				if (finalSpecifier.startsWith(remote)) {
					finalSpecifier = finalSpecifier.replace(remote, local);
				}
			}
		}

		// console.warn(`...finalSpecifier=${finalSpecifier}`);
		// Now, if the final specifier is a replacement and still relative, resolve it relative to the import map base.
		if (
			finalSpecifier !== specifier &&
			(finalSpecifier.startsWith('./') || finalSpecifier.startsWith('../'))
		) {
			// const prefix = dirname(relative(resolve(fileURL), dirname(resolve(importMapURL))));
			const f = fileURL.protocol === 'file:' ? fromFileUrl(fileURL) : fileURL.pathname;
			const i =
				importMapURL.protocol === 'file:' ? fromFileUrl(importMapURL) : importMapURL.pathname;
			const prefix =
				fileURL.protocol === 'file:' && fileURL.origin === importMapURL.origin
					? dirname(relative(dirname(f), i))
					: undefined;
			console.warn({
				finalSpecifier,
				prefix,
				file: f,
				importMap: i,
				importMap_href: importMapURL.href,
				traversal_ifromf: traversal(importMapURL, fileURL),
				traversal_sfrom: new URL(
					finalSpecifier,
					new URL('./', $lib.intoURL(traversal(importMapURL, fileURL))),
				),
				i_join_fs: new URL(finalSpecifier, importMapURL),
			});
			finalSpecifier = prefix
				? `${join(prefix.startsWith('.') ? '' : '/', prefix, finalSpecifier)}`
				: new URL(finalSpecifier, importMapURL).href;
			// if (!finalSpecifier.startsWith('.')) {
			// 	// ensure that the finalSpecifier is relative
			// 	finalSpecifier = `./${finalSpecifier}`;
			// }
		}
		finalSpecifier = $lib.pathToPOSIX(finalSpecifier); // as POSIX-style path
		console.warn(
			`resolveSpecifier(${specifier}) => ${
				finalSpecifier === specifier ? 'NO-CHANGE ' : ''
			}${finalSpecifier}`,
		);
		return finalSpecifier; // as POSIX-style path
	}

	return (context: ts.TransformationContext) => {
		const visit /* : ts.Visitor */ = (node: ts.Node): ts.Node => {
			// Process both import and export declarations with a module specifier.
			if (
				(ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
				node.moduleSpecifier &&
				ts.isStringLiteral(node.moduleSpecifier)
			) {
				const moduleText = node.moduleSpecifier.text;
				const newModuleText = resolveSpecifier(moduleText);
				if (newModuleText !== moduleText) {
					if (ts.isImportDeclaration(node)) {
						return ts.factory.updateImportDeclaration(
							node,
							node.modifiers,
							node.importClause,
							ts.factory.createStringLiteral(newModuleText),
							node.attributes,
						);
					} else if (ts.isExportDeclaration(node)) {
						return ts.factory.updateExportDeclaration(
							node,
							node.modifiers,
							node.isTypeOnly,
							node.exportClause,
							ts.factory.createStringLiteral(newModuleText),
							node.attributes,
						);
					}
				}
			}
			return ts.visitEachChild(node, visit, context);
		};
		return (node: ts.Node) => ts.visitNode(node, visit);
	};
}

async function fetchText(url: URL): Promise<string> {
	// ToDO: add support for non-['file:','http:','https:'] protocols to `fetch` by using `curl`
	const href = url.href;
	const response = await fetch(url).catch((e) => {
		throw new Error(e.message);
	});
	// note: response status codes >= 200 < 300 should be ok
	if (!response.ok) {
		const msg = [response.statusText, `[status: ${response.status}]`].filter(Boolean).join(' ');
		if (response.status === 404) {
			throw new Deno.errors.NotFound(`'${href}' not found; ${msg}`);
		}
		throw new Error(`'${href}' fetch failed; ${msg}`);
	}
	if (response.body == null) {
		throw new Deno.errors.NotFound(`'${href}' content not found`);
	}
	const readableStream = response.body;
	return toText(readableStream);
}

/**
 * Processes a single file: parses it, applies the AST transformation, and writes back
 * the updated file.
 */
async function processFile(file: string | URL) {
	const fileURL = typeof file === 'string' ? toFileUrl(file) : file;
	// const href = fileURL.href;
	const filePath =
		fileURL.protocol === 'file:'
			? fromFileUrl(fileURL)
			: fileURL.pathname /* path without search/fragment pieces */;
	if (!(filePath.endsWith('.ts') || filePath.endsWith('.js') || filePath.endsWith('.mjs'))) {
		return;
	}

	// const content = await Deno.readTextFile(file);
	const content = await fetchText(fileURL);

	// Compute the parent's remote URL by removing the vendor folder prefix.
	// const relativePath = filePath.replace(new RegExp(`^${vendorDirURL.href}`), '');
	// const parentUrl = "https://" + relativePath.replace(/\\/g, "/");
	// const parentPath = resolve(relativePath.replace(/\\/g, '/'));

	const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
	const transformer = createTransformer(
		fileURL,
		/* parentURL, */ importMapURL,
		globalImports,
		scopes,
	);
	const result = ts.transform(sourceFile, [transformer]);
	const transformedSourceFile = result.transformed[0] as ts.SourceFile;
	const printer = ts.createPrinter();
	const newContent = printer.printFile(transformedSourceFile);
	if (fileURL.protocol === 'file:') {
		await Deno.writeTextFile(fromFileUrl(fileURL), newContent);
		console.info(`Updated imports in ${file}`);
	} else {
		console.log(newContent);
	}
	result.dispose();
}

/**
 * Recursively processes all .ts and .js (including .mjs) files in the given directory.
 */
async function processDir(dir: string) {
	for await (const entry of Deno.readDir(dir)) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory) {
			await processDir(fullPath);
		} else if (
			entry.isFile &&
			(fullPath.endsWith('.ts') || fullPath.endsWith('.js') || fullPath.endsWith('.mjs'))
		) {
			await processFile(fullPath);
		}
	}
}

async function processArgs(args: string[]) {
	for (const arg of args) {
		const path = resolve(arg);
		const stat = await Deno.lstat(path);
		console.warn({ path, stat });
		if (stat.isDirectory) {
			await processDir(path);
		} else if (stat.isFile) {
			processFile(toFileUrl(path));
		} else {
			console.error(`Unsupported file type: ${arg}`);
		}
	}
}

await processArgs(Deno.args);
