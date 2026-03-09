# 开发指南

## 项目结构

```
浏览器翻译插件开发/
├── src/                      # 源代码目录
│   ├── background/           # 后台脚本（Service Worker / Background Page）
│   │   └── background.js
│   ├── content/              # 内容脚本（注入到网页）
│   │   └── content.js
│   ├── popup/                # 弹出页面
│   │   ├── popup.html
│   │   └── popup.js
│   ├── options/              # 设置页面
│   │   ├── options.html
│   │   └── options.js
│   ├── styles/               # 样式文件
│   │   ├── popup.css
│   │   ├── options.css
│   │   └── content.css
│   ├── utils/                # 工具函数
│   ├── api/                  # API 调用模块
│   ├── icons/                # 图标文件
│   ├── manifest.chrome.json  # Chrome manifest (MV3)
│   └── manifest.firefox.json # Firefox manifest (MV2)
├── dist/                     # 构建输出目录
│   ├── chrome/               # Chrome 版本
│   └── firefox/              # Firefox 版本
├── scripts/                  # 构建脚本
│   └── build.js
├── _locales/                 # 国际化文件
│   └── zh_CN/
│       └── messages.json
├── package.json
├── .eslintrc.json
└── .prettierrc
```

## 开发环境要求

- Node.js v16+
- npm 或 yarn
- Chrome 浏览器（用于测试 Chrome 扩展）
- Firefox 浏览器（用于测试 Firefox 扩展）

## 安装依赖

```bash
npm install
```

## 开发命令

### 构建两个浏览器版本
```bash
npm run build
```

### 仅构建 Chrome 版本
```bash
npm run build:chrome
```

### 仅构建 Firefox 版本
```bash
npm run build:firefox
```

### 代码检查
```bash
npm run lint
```

### 代码格式化
```bash
npm run format
```

## 加载扩展进行测试

### Chrome
1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `dist/chrome` 目录

### Firefox
1. 打开 Firefox 浏览器
2. 访问 `about:debugging#/runtime/this-firefox`
3. 点击"临时载入附加组件"
4. 选择 `dist/firefox/manifest.json` 文件

## 核心功能说明

### 1. 划词翻译
- 监听网页中的 `mouseup` 事件
- 获取选中的文本内容
- 调用后台脚本的翻译 API
- 显示翻译结果卡片

### 2. 后台脚本
- 处理翻译请求
- 管理本地缓存
- 创建右键菜单
- 监听菜单点击事件

### 3. 弹出页面（Popup）
- 快速开关插件
- 选择目标语言
- 清除缓存
- 打开设置页面

### 4. 设置页面（Options）
- 完整的配置选项
- 翻译服务选择
- API 端点配置
- 关于信息

## 跨浏览器兼容性

### Chrome (Manifest V3)
- 使用 Service Worker 作为后台脚本
- 使用 `chrome.action` API
- 支持 ES6 模块

### Firefox (Manifest V2)
- 使用持久化 Background Page
- 使用 `browser.browserAction` API
- 通过 `webextension-polyfill` 统一 API

## 翻译 API

当前默认使用 LibreTranslate 免费实例：
- 端点：`https://libretranslate.com/translate`
- 支持自定义 API 端点
- 后续可扩展其他翻译服务（百度、谷歌等）

## 下一步开发建议

1. **图标设计**：添加合适的插件图标（16x16, 32x32, 48x48, 128x128）
2. **更多翻译服务**：集成百度翻译、谷歌翻译等
3. **整页翻译**：实现整页翻译功能
4. **单元测试**：添加 Jest 测试
5. **自动化构建**：使用 Webpack 或 Vite 优化构建流程
6. **自动发布**：配置 CI/CD 自动发布到应用商店

## 常见问题

### Q: 翻译失败怎么办？
A: 检查网络连接，确认翻译 API 端点可用，或在设置中更换其他 API。

### Q: 某些网站无法使用？
A: 可能是网站有内容安全策略（CSP）限制，可在 background.js 中添加例外。

### Q: 如何调试？
A: 
- Content Script: 在网页中按 F12 打开开发者工具
- Background: Chrome 在 `chrome://extensions/` 点击 Service Worker，Firefox 在 `about:debugging` 检查
- Popup: 右键点击插件图标选择"检查弹出视图"

## 许可证

MIT License
