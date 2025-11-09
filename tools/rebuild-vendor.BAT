@setLocal
@rem rebuild-vendor [FILES_WITH_DEPS..]
@rem :: spell-checker:ignore () denonext
@if NOT DEFINED REPO @if EXIST ".git\" set "REPO=."
@if NOT DEFINED REPO @if EXIST "..\.git\" set "REPO=.."
@if NOT EXIST "%REPO%" printf "ERR!: Missing REPO (`%REPO%`)" 1>&2 && exit /b 1
@if NOT DEFINED VENDOR_FOLDER set "VENDOR_FOLDER=%REPO%/vendor"
@if NOT DEFINED DENO_VENDOR_EXEC set "DENO_VENDOR_EXEC=deno-v1.46.3" &:: deno-v1.46.3 needed for `node:...` imports (plz ignore the unsuppressible deprecation warning 😠)
@if NOT DEFINED DENO_VENDOR_FOLDER set "DENO_VENDOR_FOLDER=%VENDOR_FOLDER%/%DENO_VENDOR_EXEC:deno-v=deno@%-vendor"
@set args=%*
@if NOT DEFINED args (
    @set "args=$deps.ts bench\*.ts eg\*.ts src\*.ts tests\*.ts tools\*.ts"
)
@cd "%REPO%"
@if EXIST "%DENO_VENDOR_FOLDER%" (
    @rm -r "%DENO_VENDOR_FOLDER%"
    @uu mkdir -p "%DENO_VENDOR_FOLDER%"
)
@call xx call "%DENO_VENDOR_EXEC%" vendor --no-config --output "%DENO_VENDOR_FOLDER%" %args%%*
@if EXIST "%VENDOR_FOLDER%/.patch" (
    @cp -r "%VENDOR_FOLDER%/.patch"/* "%DENO_VENDOR_FOLDER%"
)
@sleep 10 &:: *import-map.json* can have a delayed write due to antivirus
call deno run -A tools/rewrite-from-vendor.deno.ts --vendor-from "%DENO_VENDOR_FOLDER%" "%DENO_VENDOR_FOLDER%"
call deno fmt --no-config "%DENO_VENDOR_FOLDER%" --ignore="%DENO_VENDOR_FOLDER%"\esm.sh\typescript@5.7.3\denonext\typescript.mjs
