// 使用 Chrome 原生 API
const browser = chrome;

// 初始化页面
function init() {
  console.log('[Popup] 初始化...');
  
  // 加载当前配置
  browser.storage.local.get([
    'enabled',
    'targetLang',
    'sourceLang'
  ], (config) => {
    console.log('[Popup] 加载的配置:', config);
    
    // 设置表单值
    document.getElementById('enabledToggle').checked = config.enabled !== false;
    document.getElementById('targetLang').value = config.targetLang || 'zh-CN';
    document.getElementById('sourceLang').value = config.sourceLang || 'en';
    
    // 绑定事件
    bindEvents();
  });
}

// 绑定事件处理
function bindEvents() {
  console.log('[Popup] 绑定事件...');
  
  // 启用/禁用开关
  document.getElementById('enabledToggle').addEventListener('change', (e) => {
    const value = e.target.checked;
    console.log('[Popup] 启用状态变更:', value);
    browser.storage.local.set({ enabled: value });
  });
  
  // 当前语言选择
  document.getElementById('sourceLang').addEventListener('change', (e) => {
    const value = e.target.value;
    console.log('[Popup] 当前语言变更:', value);
    browser.storage.local.set({ sourceLang: value });
  });
  
  // 需要翻译的语言选择
  document.getElementById('targetLang').addEventListener('change', (e) => {
    const value = e.target.value;
    console.log('[Popup] 目标语言变更:', value);
    browser.storage.local.set({ targetLang: value });
  });
  

  
  // 保存配置按钮
  document.getElementById('saveConfigBtn').addEventListener('click', () => {
    // 获取当前表单值
    const enabled = document.getElementById('enabledToggle').checked;
    const targetLang = document.getElementById('targetLang').value;
    const sourceLang = document.getElementById('sourceLang').value;
    
    // 保存配置
    browser.storage.local.set({
      enabled,
      targetLang,
      sourceLang
    }, () => {
      if (browser.runtime.lastError) {
        alert('保存配置失败：' + browser.runtime.lastError.message);
        return;
      }
      alert('配置已保存');
    });
  });
  
  // 打开设置页面 - 修复版本
  document.getElementById('openOptionsBtn').addEventListener('click', () => {
    console.log('[Popup] 点击设置按钮');
    try {
      // 尝试使用标准的打开选项页面方法
      browser.runtime.openOptionsPage(() => {
        if (browser.runtime.lastError) {
          console.log('[Popup] runtime.openOptionsPage 失败:', browser.runtime.lastError);
          // 如果失败，使用备用方法
          const optionsUrl = browser.runtime.getURL('options/options.html');
          browser.tabs.create({ url: optionsUrl });
          console.log('[Popup] 使用 tabs.create 打开设置页面');
        } else {
          console.log('[Popup] 使用 runtime.openOptionsPage 打开设置页面');
        }
      });
    } catch (error) {
      console.log('[Popup] runtime.openOptionsPage 失败:', error);
      // 如果失败，使用备用方法
      const optionsUrl = browser.runtime.getURL('options/options.html');
      browser.tabs.create({ url: optionsUrl });
      console.log('[Popup] 使用 tabs.create 打开设置页面');
    }
  });
}

// 监听存储变化
function listenForStorageChanges() {
  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      // 更新其他设置
      if (changes.enabled !== undefined) {
        document.getElementById('enabledToggle').checked = changes.enabled.newValue;
      }
      
      if (changes.targetLang !== undefined) {
        document.getElementById('targetLang').value = changes.targetLang.newValue;
      }
      
      if (changes.sourceLang !== undefined) {
        document.getElementById('sourceLang').value = changes.sourceLang.newValue;
      }
    }
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  init();
  listenForStorageChanges();
});
