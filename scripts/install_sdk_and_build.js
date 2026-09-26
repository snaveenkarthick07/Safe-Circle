const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sdkRoot = 'C:\\Users\\Naveen Karthick S\\AppData\\Local\\Android\\Sdk';
const jdkPath = 'C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.12.101-hotspot';
const licensesDir = path.join(sdkRoot, 'licenses');
const sdkManager = path.join(sdkRoot, 'cmdline-tools', 'latest', 'bin', 'sdkmanager.bat');
const projectDir = path.resolve(__dirname, '..');
const androidDir = path.join(projectDir, 'android');

console.log('==> Step 1: Setting up Android SDK licenses...');
if (!fs.existsSync(licensesDir)) {
  fs.mkdirSync(licensesDir, { recursive: true });
}

const licenses = {
  'android-sdk-license': [
    '24333f8a63c61ba97213b72a12f1508a73d123a6',
    '8933bad161af4178b1185d1a37fbf41ea5269c55',
    'd56f5187479451eabf01fb78af6dfcb131a6481e'
  ].join('\n'),
  'android-sdk-preview-license': '84831b9409646a918e30573bab4c9c91346d8abd',
  'android-googletv-license': '601085b94cd77f0b54ff86406957099fed4b2d54',
  'google-gdk-license': '33b6a2b6490882ea6828f47ae102149c47303d7d',
  'intel-android-extra-license': 'd975f751698a77b662f1254ddbeed3901e976f5a'
};

for (const [name, content] of Object.entries(licenses)) {
  fs.writeFileSync(path.join(licensesDir, name), content + '\n', 'utf8');
}
console.log('==> Licenses created successfully.');

console.log('==> Step 2: Configuring android/local.properties...');
const localPropertiesPath = path.join(androidDir, 'local.properties');
const escapedSdk = sdkRoot.replace(/\\/g, '\\\\');
fs.writeFileSync(localPropertiesPath, `sdk.dir=${escapedSdk}\n`, 'utf8');
console.log(`==> local.properties set with sdk.dir=${escapedSdk}`);

console.log('==> Step 3: Installing platform-tools, platforms;android-34, build-tools;34.0.0...');
const env = {
  ...process.env,
  JAVA_HOME: jdkPath,
  ANDROID_HOME: sdkRoot,
  ANDROID_SDK_ROOT: sdkRoot,
  PATH: `${jdkPath}\\bin;${path.join(sdkRoot, 'cmdline-tools', 'latest', 'bin')};${path.join(sdkRoot, 'platform-tools')};${process.env.PATH}`
};
delete env.ANDROID_PREFS_ROOT;

try {
  execSync(`"${sdkManager}" "platform-tools" "platforms;android-34" "build-tools;34.0.0"`, {
    env,
    stdio: 'inherit'
  });
  console.log('==> Android SDK components installed successfully!');
} catch (err) {
  console.error('Error installing SDK components:', err.message);
  process.exit(1);
}

console.log('==> Step 4: Compiling SafeCircle Android APK via Gradle...');
try {
  execSync(`gradlew.bat assembleDebug`, {
    cwd: androidDir,
    env,
    stdio: 'inherit'
  });
  console.log('==> BUILD SUCCESSFUL!');
  
  const apkPath = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
  if (fs.existsSync(apkPath)) {
    const stats = fs.statSync(apkPath);
    const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`\n========================================`);
    console.log(`  APK GENERATED SUCCESSFULLY!`);
    console.log(`  Path: ${apkPath}`);
    console.log(`  Size: ${sizeMb} MB`);
    console.log(`========================================\n`);
  }
} catch (err) {
  console.error('Gradle assembleDebug failed:', err.message);
  process.exit(1);
}
