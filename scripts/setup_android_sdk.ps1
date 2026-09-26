# SafeCircle Android SDK Setup & Automated APK Builder
$ErrorActionPreference = "Stop"

$SdkRoot = "C:\Users\Naveen Karthick S\AppData\Local\Android\Sdk"
$ZipPath = "C:\Users\Naveen Karthick S\AppData\Local\Android\commandlinetools.zip"
$JdkPath = "C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
$CmdLineToolsLatest = "$SdkRoot\cmdline-tools\latest"

Write-Host "==> Checking Android Commandline Tools ZIP..."
if (-not (Test-Path $ZipPath)) {
    Write-Error "commandlinetools.zip not found at $ZipPath"
}

Write-Host "==> Extracting cmdline-tools to $CmdLineToolsLatest..."
$TempExtract = "C:\Users\Naveen Karthick S\AppData\Local\Android\temp_extract"
if (Test-Path $TempExtract) { Remove-Item -Recurse -Force $TempExtract }
Expand-Archive -LiteralPath $ZipPath -DestinationPath $TempExtract -Force

if (-not (Test-Path "$SdkRoot\cmdline-tools")) {
    New-Item -ItemType Directory -Force -Path "$SdkRoot\cmdline-tools" | Out-Null
}
if (Test-Path $CmdLineToolsLatest) {
    Remove-Item -Recurse -Force $CmdLineToolsLatest
}

# The zip extracts to $TempExtract\cmdline-tools\...
Move-Item -Path "$TempExtract\cmdline-tools" -Destination $CmdLineToolsLatest -Force
Remove-Item -Recurse -Force $TempExtract

Write-Host "==> cmdline-tools successfully deployed to $CmdLineToolsLatest"

# Configure local.properties
$LocalPropertiesPath = "$PSScriptRoot\..\android\local.properties"
$SdkDirEscaped = $SdkRoot.Replace("\", "\\")
"sdk.dir=$SdkDirEscaped" | Set-Content -Path $LocalPropertiesPath -Encoding ASCII
Write-Host "==> Generated android/local.properties with sdk.dir=$SdkDirEscaped"

# Set Environment Variables for this session
$env:JAVA_HOME = $JdkPath
$env:ANDROID_HOME = $SdkRoot
$env:ANDROID_SDK_ROOT = $SdkRoot
$env:PATH = "$JdkPath\bin;$CmdLineToolsLatest\bin;$SdkRoot\platform-tools;$env:PATH"

$SdkManager = "$CmdLineToolsLatest\bin\sdkmanager.bat"
Write-Host "==> Accepting Android SDK Licenses..."
cmd.exe /c "echo y | `"$SdkManager`" --licenses"

Write-Host "==> Installing platform-tools, platforms;android-34, and build-tools;34.0.0..."
cmd.exe /c "`"$SdkManager`" `"platform-tools`" `"platforms;android-34`" `"build-tools;34.0.0`""

Write-Host "==> Verifying Android SDK installation..."
Get-ChildItem $SdkRoot | Select-Object Name

Write-Host "==> Building SafeCircle Android APK via Gradle..."
Set-Location "$PSScriptRoot\..\android"
cmd.exe /c "set JAVA_HOME=$JdkPath&& gradlew.bat assembleDebug"

$ApkPath = "$PSScriptRoot\..\android\app\build\outputs\apk\debug\app-debug.apk"
if (Test-Path $ApkPath) {
    $ApkItem = Get-Item $ApkPath
    Write-Host "SUCCESS! Android APK built at: $($ApkItem.FullName) ($([math]::Round($ApkItem.Length / 1MB, 2)) MB)"
} else {
    Write-Host "Checking build output directories..."
    Get-ChildItem -Recurse "$PSScriptRoot\..\android\app\build\outputs"
}
