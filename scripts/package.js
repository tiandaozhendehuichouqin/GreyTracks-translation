const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const TARGET = process.argv[2] || 'both';

// 打包成zip文件
function packageToZip(sourceDir, zipName) {
  console.log(`Packaging ${sourceDir} to ${zipName}...`);
  
  // 切换到dist目录
  const cwd = process.cwd();
  process.chdir(DIST_DIR);
  
  try {
    // 使用PowerShell命令打包成zip
    execSync(`Compress-Archive -Path "${path.basename(sourceDir)}\*" -DestinationPath "${zipName}" -Force`, {
      shell: 'powershell.exe',
      stdio: 'inherit'
    });
    console.log(`✓ ${zipName} created successfully`);
  } catch (error) {
    console.error(`✗ Failed to create ${zipName}:`, error.message);
  } finally {
    // 切换回原目录
    process.chdir(cwd);
  }
}

// 主函数
function main() {
  console.log('Starting packaging process...\n');
  
  // 检查dist目录是否存在
  if (!fs.existsSync(DIST_DIR)) {
    console.error('✗ dist directory does not exist. Please run "npm run build" first.');
    process.exit(1);
  }
  
  if (TARGET === 'chrome' || TARGET === 'both') {
    const chromeDir = path.join(DIST_DIR, 'chrome');
    if (fs.existsSync(chromeDir)) {
      packageToZip(chromeDir, 'greytracks-chrome.zip');
    } else {
      console.warn('⚠ Chrome build directory not found. Skipping Chrome packaging.');
    }
  }
  
  if (TARGET === 'firefox' || TARGET === 'both') {
    const firefoxDir = path.join(DIST_DIR, 'firefox');
    if (fs.existsSync(firefoxDir)) {
      packageToZip(firefoxDir, 'greytracks-firefox.zip');
    } else {
      console.warn('⚠ Firefox build directory not found. Skipping Firefox packaging.');
    }
  }
  
  console.log('\n✓ Packaging completed!');
  console.log('\nOutput zip files:');
  if (TARGET !== 'firefox') {
    console.log('  - Chrome: dist/greytracks-chrome.zip');
  }
  if (TARGET !== 'chrome') {
    console.log('  - Firefox: dist/greytracks-firefox.zip');
  }
}

main();