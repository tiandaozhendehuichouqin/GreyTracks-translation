const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '..', 'src', 'icons');

// 确保图标目录存在
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// 生成简单的 PNG 图标（使用 base64 编码的简单紫色方块）
// 这是一个 1x1 像素的紫色 PNG，实际应该使用真正的图标
function generatePlaceholderIcon(size) {
  // 创建一个简单的 SVG 并转换为 PNG 的占位符
  // 这里使用一个 base64 编码的简单紫色圆形图标
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#grad)"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">译</text>
    </svg>
  `;
  
  const svgPath = path.join(ICONS_DIR, `icon${size}.svg`);
  fs.writeFileSync(svgPath, svgContent.trim());
  console.log(`✓ Generated placeholder SVG: icon${size}.svg`);
}

// 生成所有尺寸的 SVG 占位图标
const sizes = [16, 32, 48, 128];
sizes.forEach(size => generatePlaceholderIcon(size));

console.log('\n✓ Placeholder icons generated successfully!');
console.log('\n注意：这些是 SVG 格式的占位图标，浏览器应该可以识别。');
console.log('如需 PNG 格式，请使用图形编辑工具或在线转换器。');
