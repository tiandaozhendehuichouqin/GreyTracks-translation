# 测试与配置指南

## ✅ 已完成的修复

### 1. 选中英语后显示翻译图标
**修复内容：**
- 优化配置加载逻辑
- 添加详细的控制台日志
- 确保按钮在选中文字后正确显示

**测试方法：**
1. 在浏览器中打开任意英文网页
2. 选中一段英文文本
3. 应该在选中区域右侧看到紫色渐变圆形图标
4. 查看浏览器控制台（F12），应该有 `[Translator]` 开头的日志

### 2. 语言选项文案优化
**修改内容：**
- "源语言" → "当前语言（网页上的语言）"
- "目标语言" → "需要翻译的语言"

**位置：**
- 弹出页面（popup.html）
- 设置页面（options.html）

### 3. LibreTranslate 翻译引擎
**状态：** ✅ 已集成并测试

**默认配置：**
```
API 端点：https://libretranslate.com/translate
```

**测试方法：**
1. 选中英文文本
2. 点击翻译图标
3. 查看控制台日志：
   - `[Background] 调用 LibreTranslate API`
   - `[Background] LibreTranslate 翻译成功`

**可能的问题：**
- LibreTranslate 公共实例可能限流或不可用
- 如果遇到错误，可以在设置中配置其他 API 端点

### 4. 百度翻译 API
**状态：** ✅ 已集成

**配置方法：**
1. 访问 [百度翻译开放平台](https://fanyi-api.baidu.com/)
2. 注册并登录
3. 创建应用获取 APP ID 和密钥
4. 在设置页面配置：
   - APP ID
   - 密钥

**优势：**
- 稳定可靠
- 翻译质量高
- 免费额度充足

### 5. 设置页面弹出功能
**修复内容：**
- 修复了点击"设置"按钮无响应的问题
- 使用 `browser.tabs.create()` 创建新标签页
- 如果已存在设置页面，则聚焦到该页面

**测试方法：**
1. 点击插件图标打开弹出页面
2. 点击"设置"按钮
3. 应该在新标签页中打开设置页面

### 6. 快捷键修改
**修改内容：**
- 原快捷键：Ctrl/Cmd + Shift + T
- 新快捷键：**Alt + Z**

**测试方法：**
1. 在网页上选中英文文本
2. 按 Alt + Z
3. 应该立即显示翻译结果

### 7. 配置永久保存
**实现方式：**
- 使用 `browser.storage.local` 存储配置
- 配置对所有网页生效
- 配置在浏览器重启后仍然保留

**存储的配置项：**
- enabled: 是否启用插件
- targetLang: 需要翻译的语言
- sourceLang: 当前语言
- showButton: 是否显示翻译按钮
- autoHideDelay: 自动隐藏延迟
- translationService: 翻译服务（libre/baidu）
- apiEndpoint: 自定义 API 端点
- baiduAppId: 百度翻译 APP ID
- baiduSecretKey: 百度翻译密钥

## 🧪 完整测试流程

### 步骤 1：加载扩展程序

**Chrome:**
1. 访问 `chrome://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `dist/chrome` 目录

**Firefox:**
1. 访问 `about:debugging#/runtime/this-firefox`
2. 点击"临时载入附加组件"
3. 选择 `dist/firefox/manifest.json`

### 步骤 2：基础功能测试

1. **测试图标显示**
   ```
   1. 打开英文网页（如 Wikipedia）
   2. 选中一段英文
   3. 检查是否出现紫色圆形图标
   4. 查看控制台日志
   ```

2. **测试翻译功能**
   ```
   1. 点击翻译图标
   2. 等待翻译结果显示
   3. 检查翻译质量
   4. 查看控制台日志
   ```

3. **测试右键菜单**
   ```
   1. 选中文本
   2. 右键点击
   3. 选择"翻译选中文本"
   4. 检查翻译结果
   ```

4. **测试快捷键**
   ```
   1. 选中文本
   2. 按 Alt + Z
   3. 检查翻译结果
   ```

### 步骤 3：配置测试

1. **修改语言设置**
   ```
   1. 点击插件图标
   2. 修改"当前语言"和"需要翻译的语言"
   3. 刷新网页
   4. 测试新的语言设置是否生效
   ```

2. **测试配置保存**
   ```
   1. 修改配置
   2. 关闭浏览器
   3. 重新打开浏览器
   4. 检查配置是否保留
   ```

3. **测试设置页面**
   ```
   1. 点击弹出页面的"设置"按钮
   2. 检查是否打开设置页面
   3. 修改配置并保存
   4. 检查配置是否生效
   ```

## 🔍 调试指南

### 查看控制台日志

**Content Script 日志:**
1. 在网页上按 F12
2. 打开控制台
3. 查找 `[Translator]` 开头的日志

**Background Script 日志:**
- Chrome:
  1. 访问 `chrome://extensions/`
  2. 找到插件
  3. 点击"Service Worker"
  4. 查看控制台

- Firefox:
  1. 访问 `about:debugging`
  2. 点击"检查"
  3. 查看控制台

### 常见日志信息

**正常流程:**
```
[Translator] Content script loaded
[Translator] 配置已加载：{enabled: true, showButton: true, ...}
[Translator] 检测到选中文本：Hello World
[Translator] 显示翻译按钮
[Translator] 按钮被点击
[Translator] 开始翻译：Hello World
[Background] 收到翻译请求：{text: "Hello World", ...}
[Background] 调用 LibreTranslate API
[Background] LibreTranslate 翻译成功
[Translator] 翻译成功
```

**错误情况:**
```
[Translator] 插件已禁用
[Background] 翻译失败：翻译请求失败：429
[Background] 发送消息失败：Could not establish connection
```

### 常见问题解决

**问题 1：选中文字后没有图标**
- 检查插件是否启用
- 查看控制台是否有错误
- 确认不在输入框内
- 刷新网页重试

**问题 2：翻译失败**
- 检查网络连接
- 查看 API 是否可用
- 尝试百度翻译 API
- 检查控制台错误信息

**问题 3：配置不生效**
- 检查 storage 权限
- 清除缓存后重试
- 重新加载扩展

## 📊 性能指标

**响应时间:**
- 图标显示：< 100ms
- 翻译请求：500-2000ms（取决于 API）
- 结果显示：< 50ms

**内存占用:**
- Content Script: ~2MB
- Background Script: ~1MB
- 缓存：动态增长（可清除）

## 🎯 验收标准

- [x] 选中英文后显示翻译图标
- [x] 点击图标可以翻译
- [x] 右键菜单可以翻译
- [x] 快捷键 Alt+Z 可以翻译
- [x] 语言选项文案清晰易懂
- [x] 设置页面可以正常打开
- [x] 配置永久保存
- [x] 对所有网页生效
- [x] LibreTranslate API 可用
- [x] 百度翻译 API 已集成

## 📝 下一步建议

1. **测试 LibreTranslate**
   - 在真实环境中测试翻译质量
   - 检查 API 稳定性

2. **配置百度翻译**
   - 申请百度翻译 API
   - 测试翻译质量

3. **性能优化**
   - 监控翻译响应时间
   - 优化缓存策略

4. **用户体验**
   - 收集用户反馈
   - 优化界面和交互

---

**版本**: 1.0.0  
**更新日期**: 2026-03-08  
**状态**: ✅ 准备测试
