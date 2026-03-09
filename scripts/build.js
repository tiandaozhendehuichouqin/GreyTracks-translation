const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(__dirname, '..', 'dist');
const TARGET = process.argv[2] || 'both';

// 需要复制的文件和目录
const FILES_TO_COPY = [
  'background/background.js',
  'content/content.js',
  'popup/popup.html',
  'popup/popup.js',
  'options/options.html',
  'options/options.js',
  'styles/popup.css',
  'styles/options.css',
  'styles/content.css'
];

// 需要复制的目录
const DIRS_TO_COPY = [];

// 清理目标目录
function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

// 复制文件
function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

// 复制整个目录
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

// 构建 Chrome 版本
function buildChrome() {
  console.log('Building for Chrome...');
  const chromeDir = path.join(DIST_DIR, 'chrome');
  cleanDir(chromeDir);
  
  // 复制 manifest
  copyFile(
    path.join(SRC_DIR, 'manifest.chrome.json'),
    path.join(chromeDir, 'manifest.json')
  );
  
  // 复制其他文件
  for (const file of FILES_TO_COPY) {
    const srcPath = path.join(SRC_DIR, file);
    const destPath = path.join(chromeDir, file);
    if (fs.existsSync(srcPath)) {
      copyFile(srcPath, destPath);
    }
  }
  
  // 复制 icons 目录（如果存在）
  const iconsSrc = path.join(SRC_DIR, 'icons');
  const iconsDest = path.join(chromeDir, 'icons');
  copyDir(iconsSrc, iconsDest);
  
  // 复制 _locales 目录（如果存在）
  const localesSrc = path.join(ROOT_DIR, '_locales');
  const localesDest = path.join(chromeDir, '_locales');
  copyDir(localesSrc, localesDest);
  
  // 复制 webextension-polyfill 目录
  for (const dir of DIRS_TO_COPY) {
    const srcPath = path.join(ROOT_DIR, dir);
    const destPath = path.join(chromeDir, dir);
    if (fs.existsSync(srcPath)) {
      copyDir(srcPath, destPath);
    }
  }
  
  console.log('✓ Chrome build completed');
}

// 构建 Firefox 版本
function buildFirefox() {
  console.log('Building for Firefox...');
  const firefoxDir = path.join(DIST_DIR, 'firefox');
  cleanDir(firefoxDir);
  
  // 复制 manifest
  copyFile(
    path.join(SRC_DIR, 'manifest.firefox.json'),
    path.join(firefoxDir, 'manifest.json')
  );
  
  // 复制其他文件
  for (const file of FILES_TO_COPY) {
    const srcPath = path.join(SRC_DIR, file);
    const destPath = path.join(firefoxDir, file);
    if (fs.existsSync(srcPath)) {
      copyFile(srcPath, destPath);
    }
  }
  
  // 复制 icons 目录（如果存在）
  const iconsSrc = path.join(SRC_DIR, 'icons');
  const iconsDest = path.join(firefoxDir, 'icons');
  copyDir(iconsSrc, iconsDest);
  
  // 复制 _locales 目录（如果存在）
  const localesSrc = path.join(ROOT_DIR, '_locales');
  const localesDest = path.join(firefoxDir, '_locales');
  copyDir(localesSrc, localesDest);
  
  // 复制 webextension-polyfill 目录
  for (const dir of DIRS_TO_COPY) {
    const srcPath = path.join(ROOT_DIR, dir);
    const destPath = path.join(firefoxDir, dir);
    if (fs.existsSync(srcPath)) {
      copyDir(srcPath, destPath);
    }
  }
  
  console.log('✓ Firefox build completed');
}

// 主函数
function main() {
  console.log('Starting build process...\n');
  
  // 确保 dist 目录存在
  fs.mkdirSync(DIST_DIR, { recursive: true });
  
  if (TARGET === 'chrome') {
    buildChrome();
  } else if (TARGET === 'firefox') {
    buildFirefox();
  } else {
    buildChrome();
    buildFirefox();
  }
  
  console.log('\n✓ Build completed successfully!');
  console.log('\nOutput directories:');
  if (TARGET !== 'firefox') {
    console.log('  - Chrome: dist/chrome/');
  }
  if (TARGET !== 'chrome') {
    console.log('  - Firefox: dist/firefox/');
  }
}

main();
