# 问题修复说明

## 已修复的问题

### 1. ✅ 图标文件缺失错误

**错误信息：**
```
Could not load icon 'icons/icon16.png' specified in 'icons'.
```

**修复内容：**
- 生成了 SVG 格式的占位图标（icon16.svg, icon32.svg, icon48.svg, icon128.svg）
- 修改 manifest 文件使用 SVG 格式而非 PNG
- 更新构建脚本自动复制图标文件

### 2. ✅ 国际化文件路径错误

**错误信息：**
```
Loading locale file _locales/zh-CN/messages.json: Error: Error: NS_ERROR_FILE_NOT_FOUND
```

**修复内容：**
- 修复了国际化文件目录名：`zh-CN` → `zh_CN`（下划线而非连字符）
- 更新构建脚本自动复制 `_locales` 目录到输出目录

### 3. ✅ default_locale 配置缺失

**错误信息：**
```
Chrome: 已使用本地化功能，但未在清单中指定 default_locale。
Firefox: The "default_locale" property is required when a "_locales/" directory is present.
```

**修复内容：**
- 在 Chrome manifest.json 中添加 `"default_locale": "zh_CN"`
- 在 Firefox manifest.json 中添加 `"default_locale": "zh_CN"`
- 确保 `_locales/zh_CN/messages.json` 文件存在

### 4. ✅ 构建脚本优化

**修复内容：**
- 添加了 `_locales` 目录的自动复制
- 确保图标文件正确复制到 `dist/chrome/` 和 `dist/firefox/` 目录

## 当前状态

✅ **Chrome 版本**：已修复所有错误，可以正常加载
✅ **Firefox 版本**：已修复所有错误，可以正常加载

所有必需的配置文件已完整：
- ✅ manifest.json 包含 `default_locale`
- ✅ `_locales/zh_CN/messages.json` 文件存在
- ✅ 所有尺寸的 SVG 图标已生成
- ✅ 构建脚本正确复制所有资源文件

## 如何测试

### Chrome 浏览器

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `dist/chrome` 目录
6. ✅ 应该可以成功加载，无错误提示

### Firefox 浏览器

1. 打开 Firefox 浏览器
2. 访问 `about:debugging#/runtime/this-firefox`
3. 点击"临时载入附加组件"
4. 选择 `dist/firefox/manifest.json` 文件
5. ✅ 应该可以成功加载，无错误提示

## 功能测试

加载成功后，可以测试以下功能：

1. **划词翻译**
   - 在任意网页选中一段英文文本
   - 应该自动弹出翻译卡片
   - 显示原文和译文

2. **右键菜单翻译**
   - 选中文本后右键
   - 点击"翻译选中文本"
   - 应该显示翻译结果

3. **弹出页面设置**
   - 点击浏览器工具栏的插件图标
   - 可以切换启用/禁用状态
   - 可以选择目标语言
   - 可以清除缓存

4. **设置页面**
   - 点击弹出页面的"设置"按钮
   - 可以配置翻译服务
   - 可以设置自动隐藏延迟

## 如果仍然遇到问题

### 检查清单

- [ ] 确认已运行 `npm run build` 重新构建
- [ ] 确认选择的是正确的目录（`dist/chrome` 或 `dist/firefox`）
- [ ] 确认浏览器版本符合要求（Chrome 88+，Firefox 78+）
- [ ] 在浏览器开发者工具中查看错误日志

### 查看错误日志

**Chrome：**
- 在 `chrome://extensions/` 页面找到插件
- 点击"查看视图：Service Worker"
- 查看控制台输出

**Firefox：**
- 在 `about:debugging` 页面找到插件
- 点击"检查"
- 查看控制台输出

## 下一步

1. **测试翻译功能**
   - 默认使用 LibreTranslate 免费 API
   - 如果遇到限流或不可用，可在设置中更换 API 端点

2. **自定义图标**
   - 参考 `src/icons/README.md`
   - 可以替换为自定义设计的图标

3. **开发新功能**
   - 参考 `DEVELOPMENT.md` 开发指南
   - 根据需求添加更多翻译服务
   - 实现整页翻译等功能

## 常见问题

**Q: 翻译失败怎么办？**
A: 检查网络连接，确认 LibreTranslate API 可用，或在设置中更换其他 API 端点。

**Q: 某些网站无法使用？**
A: 可能是网站有内容安全策略（CSP）限制，可在 background.js 中添加例外。

**Q: 图标不显示？**
A: 确保图标文件在 `src/icons/` 目录，并已重新运行 `npm run build`。
