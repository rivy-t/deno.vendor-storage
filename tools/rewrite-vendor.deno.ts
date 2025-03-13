// expand vendor import_map (allows direct local and remote CDN use of vendored modules)
// note: idempotent if/when run multiple times

// spell-checker:ignore (people) rivy

// ToDO: [2023-11-22; rivy] ~ add vendor location corrections for `// @deno-types=...` lines
// ToDO: [2023-11-22; rivy] ~ improve uses of path/URLs
// ToDO: [2023-11-22; rivy] ~ improve robustness, allowing possible use of non-vendor import mappings

import {
	dirname,
	fromFileUrl,
	/* toFileUrl, */ join,
	relative,
	resolve,
} from 'https://deno.land/std@0.224.0/path/mod.ts';
import ts from 'https://esm.sh/typescript@5.7.3';

const scriptDirPath = dirname(fromFileUrl(import.meta.url));
const vendorDirPath = join(scriptDirPath, '../vendor/deno@1.44.4-vendor');
const importMapPath = join(vendorDirPath, 'import_map.json');

console.log({ scriptDirPath, vendorDirPath, importMapPath });

// Load the import map.
const importMapText = await Deno.readTextFile(importMapPath);
const importMap = JSON.parse(importMapText);
const globalImports = importMap.imports || {};
const scopes = importMap.scopes || {};

/**
 * Creates a transformer that replaces module specifiers using both global imports
 * and scope-specific mappings.
 *
 * @param parentPath - The remote URL corresponding to the current file (parent module).
 * @param imports - Global imports mapping from the import map.
 * @param scopes - Scopes mapping from the import map.
 */
function createTransformerWithParentPath(
	filePath: string,
	parentPath: string,
	importMapPath: string,
	imports: Record<string, string>,
	scopes: Record<string, Record<string, string>>,
) {
	// Helper: Given a module specifier string, return its rewritten version if applicable.
	function resolveSpecifier(specifier: string): string {
		// console.log(`resolveSpecifier(${specifier}) for filePath='${filePath}', parentUrl='${parentPath}'`);

		let finalSpecifier = specifier;

		// Check scope mappings first: if the parent's remote URL starts with a scope key,
		// then check that scope's mapping for a matching prefix.
		for (const [scopePrefix, scopeImports] of Object.entries(scopes)) {
			const scopePrefixPath = resolve(
				join(dirname(resolve(importMapPath)), scopePrefix),
			);
			// console.log(`scopePrefixUrl=${scopePrefixPath}`);
			if (parentPath.startsWith(scopePrefixPath)) {
				for (const [remote, local] of Object.entries(scopeImports)) {
					if (finalSpecifier.startsWith(remote)) {
						finalSpecifier = finalSpecifier.replace(remote, local);
					}
				}
			}
		}
		// Fall back to the global imports mapping.
		for (const [remote, local] of Object.entries(imports)) {
			if (finalSpecifier.startsWith(remote)) {
				finalSpecifier = finalSpecifier.replace(remote, local);
			}
		}

		// Now, if the final specifier is a replacement and still relative, resolve it relative to the import map base.
		if (
			finalSpecifier !== specifier &&
			(finalSpecifier.startsWith('./') || finalSpecifier.startsWith('../'))
		) {
			const prefix = dirname(
				relative(resolve(filePath), dirname(resolve(importMapPath))),
			);
			finalSpecifier = join(prefix, finalSpecifier);
		}
		console.log(
			`resolveSpecifier(${specifier}) => ${
				finalSpecifier === specifier ? 'NO-CHANGE ' : ''
			}${finalSpecifier}`,
		);
		return finalSpecifier.replace(/\\/g, '/'); // as POSIX-style path
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

/**
 * Processes a single file: parses it, applies the AST transformation, and writes back
 * the updated file.
 */
async function processFile(filePath: string) {
	const content = await Deno.readTextFile(filePath);
	// Compute the parent's remote URL by removing the vendor folder prefix.
	// E.g., "vendor/deno.land/x/foo/bar.ts" becomes "https://deno.land/x/foo/bar.ts"
	const relativePath = filePath.replace(
		new RegExp(`^${vendorDirPath}[\\/\\\\]`),
		'',
	);
	// const parentUrl = "https://" + relativePath.replace(/\\/g, "/");
	const parentPath = resolve(relativePath.replace(/\\/g, '/'));

	const sourceFile = ts.createSourceFile(
		filePath,
		content,
		ts.ScriptTarget.Latest,
		true,
	);
	const transformer = createTransformerWithParentPath(
		filePath,
		parentPath,
		importMapPath,
		globalImports,
		scopes,
	);
	const result = ts.transform(sourceFile, [transformer]);
	const transformedSourceFile = result.transformed[0] as ts.SourceFile;
	const printer = ts.createPrinter();
	const newContent = printer.printFile(transformedSourceFile);
	await Deno.writeTextFile(filePath, newContent);
	console.log(`Updated imports in ${filePath}`);
	result.dispose();
}

/**
 * Recursively processes all .ts and .js files in the given directory.
 */
async function processDir(dir: string) {
	for await (const entry of Deno.readDir(dir)) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory) {
			await processDir(fullPath);
		} else if (
			entry.isFile &&
			(fullPath.endsWith('.ts') || fullPath.endsWith('.js') ||
				fullPath.endsWith('.mjs'))
		) {
			await processFile(fullPath);
		}
	}
}

await processDir(vendorDirPath);
