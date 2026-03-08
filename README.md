# GreyTracks 划词翻译插件(开源免费)

## 项目介绍

GreyTracks 是一款跨浏览器的划词翻译插件，支持 Chrome 和 Firefox 浏览器。该插件允许用户通过选择文本并点击翻译按钮或使用快捷键来快速获取翻译结果，为用户提供便捷的翻译体验。

## 主要功能

- 划词自动翻译：开启后，选中文本会自动进行翻译，无需点击按钮
- 点击小蓝标翻译：选中英文文本后，点击出现的蓝色翻译按钮即可获得翻译结果
- 快捷键翻译：使用 Alt+Z 快捷键可以快速翻译选中的文本
- 百度翻译 API 配置：可配置使用百度翻译 API 获得更准确的翻译结果

## 安装方法  (安装包在Releases里下载)
谷歌浏览器加载方法：
1. 下载插件的 ZIP 包
2. 在 Chrome 浏览器中，打开 `chrome://extensions/`
3. 开启右上角的 "开发者模式"
4. 解压压缩包
5. 点击 "加载已解压的扩展程序" ，选择reytracks-chrome\chrome 加载即可
6. #选择插件的 `dist/chrome` 目录

-------------------------------------------------------------------------------

Firefox浏览器加载方法：
4. 解压压缩包
5. 点击 "加载已解压的扩展程序" ，选择reytracks-chrome\chrome 加载即可
6. #选择插件的 `dist/chrome` 目录

7. 对于 Firefox 浏览器，打开 `about:debugging#/runtime/this-firefox`
8. 点击 "临时载入附加组件"
9. 选择插件的 `dist/firefox` 目录中的 `manifest.json` 文件


## 百度翻译 API 配置方法

1. 访问 [百度翻译开放平台](https://fanyi-api.baidu.com/)
2. 注册并登录百度账号
3. 创建一个新的应用，获取 APP ID 和 API Key
4. 在插件的设置页面中，选择 "翻译服务" 为 "百度翻译 API"
5. 输入获取到的 APP ID 和 API Key
6. 点击 "保存设置" 按钮

## 配置选项说明

- **启用插件**：开启或关闭划词翻译功能
- **我的语言**：设置翻译目标语言
- **需要翻译的语言**：设置需要翻译的源语言
- **显示翻译按钮**：开启后，选中文本时会显示翻译按钮
- **自动翻译**：开启后，选中文本会自动进行翻译
- **自动隐藏延迟**：设置翻译结果自动消失的时间
- **翻译引擎**：选择使用的翻译服务（百度翻译 API）

## 快捷键

- **Alt + Z**：翻译选中的文本或关闭翻译结果

## 项目结构

```
src/
├── content/         # 内容脚本
├── background/      # 后台脚本
├── popup/           # 弹出菜单
├── options/         # 设置页面
└── styles/          # 样式文件
dist/                # 构建输出目录
```

## 构建方法

1. 克隆项目到本地
2. 安装依赖：`npm install`
3. 构建插件：`npm run build`
4. 构建后的文件会生成在 `dist` 目录中

## 打包成ZIP方法

1. 构建项目：`npm run build`
2. 打包成ZIP：`npm run package`
3. 打包后的ZIP文件会生成在 `dist` 目录中：
   - Chrome版本：`dist/greytracks-chrome.zip`
   - Firefox版本：`dist/greytracks-firefox.zip`

   也可以单独打包某个浏览器版本：
   - 只打包Chrome版本：`npm run package:chrome`
   - 只打包Firefox版本：`npm run package:firefox`

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个插件！

## 许可证

本项目采用 MIT 许可证。

## 未来新版本展望

1、新增LibreTranslate API接口
2、谷歌API接口 (可能需要魔法)
3、支持 其他语言翻译，目前只支持英文--->中文
4、修改更好看的图标
6、英语学习

7、开发全英文版本，共享开源世界， 噢耶斯！
