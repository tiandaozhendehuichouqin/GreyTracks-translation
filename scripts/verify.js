const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');
let hasErrors = false;

console.log('🔍 验证扩展程序文件...\n');

// 验证 Chrome 版本
function verifyChrome() {
  console.log('📦 Chrome 版本验证:');
  const chromeDir = path.join(DIST_DIR, 'chrome');
  
  const requiredFiles = [
    'manifest.json',
    '_locales/zh_CN/messages.json',
    'background/background.js',
    'content/content.js',
    'popup/popup.html',
    'popup/popup.js',
    'icons/icon16.svg',
    'icons/icon32.svg',
    'icons/icon48.svg',
    'icons/icon128.svg'
  ];
  
  for (const file of requiredFiles) {
    const filePath = path.join(chromeDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file} - 缺失!`);
      hasErrors = true;
    }
  }
  
  // 验证 manifest
  const manifestPath = path.join(chromeDir, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  
  if (manifest.default_locale === 'zh_CN') {
    console.log(`  ✅ manifest.json: default_locale = "zh_CN"`);
  } else {
    console.log(`  ❌ manifest.json: default_locale 缺失或错误`);
    hasErrors = true;
  }
  
  console.log('');
}

// 验证 Firefox 版本
function verifyFirefox() {
  console.log('📦 Firefox 版本验证:');
  const firefoxDir = path.join(DIST_DIR, 'firefox');
  
  const requiredFiles = [
    'manifest.json',
    '_locales/zh_CN/messages.json',
    'background/background.js',
    'content/content.js',
    'popup/popup.html',
    'popup/popup.js',
    'icons/icon16.svg',
    'icons/icon32.svg',
    'icons/icon48.svg',
    'icons/icon128.svg'
  ];
  
  for (const file of requiredFiles) {
    const filePath = path.join(firefoxDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file} - 缺失!`);
      hasErrors = true;
    }
  }
  
  // 验证 manifest
  const manifestPath = path.join(firefoxDir, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  
  if (manifest.default_locale === 'zh_CN') {
    console.log(`  ✅ manifest.json: default_locale = "zh_CN"`);
  } else {
    console.log(`  ❌ manifest.json: default_locale 缺失或错误`);
    hasErrors = true;
  }
  
  console.log('');
}

// 运行验证
verifyChrome();
verifyFirefox();

if (hasErrors) {
  console.log('❌ 验证失败：发现文件缺失或配置错误\n');
  process.exit(1);
} else {
  console.log('✅ 验证通过：所有文件完整且配置正确\n');
  console.log('现在可以加载扩展程序到浏览器进行测试！');
  console.log('\nChrome: 加载 dist/chrome 目录');
  console.log('Firefox: 加载 dist/firefox/manifest.json 文件\n');
}
