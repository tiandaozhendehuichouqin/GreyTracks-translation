// 使用 Chrome 原生 API
const browser = chrome;

// 保存设置的引用
let settings = {};

// 初始化页面
function init() {
  // 加载当前配置
  browser.storage.local.get([
    'enabled',
    'targetLang',
    'sourceLang',
    'showButton',
    'autoHideDelay',
    'autoTranslate',
    'translationService',
    'apiEndpoint',
    'baiduAppId',
    'baiduApiKey'
  ], (storedSettings) => {
    settings = storedSettings;
    
    // 设置表单值
    document.getElementById('opt-enabled').checked = settings.enabled !== false;
    document.getElementById('opt-targetLang').value = settings.targetLang || 'zh-CN';
    document.getElementById('opt-sourceLang').value = settings.sourceLang || 'en';
    document.getElementById('opt-showButton').checked = settings.showButton || false;
    document.getElementById('opt-autoHideDelay').value = settings.autoHideDelay || 5000;
    document.getElementById('opt-autoTranslate').checked = settings.autoTranslate || false;
    document.getElementById('opt-translationService').value = settings.translationService || 'libre';
    document.getElementById('opt-apiEndpoint').value = settings.apiEndpoint || '';
    document.getElementById('opt-baiduAppId').value = settings.baiduAppId || '';
    document.getElementById('opt-baiduApiKey').value = settings.baiduApiKey || '';
    
    // 监听翻译服务选择变化
    document.getElementById('opt-translationService').addEventListener('change', (e) => {
      const endpointGroup = document.getElementById('apiEndpointGroup');
      const baiduApiGroup = document.getElementById('baiduApiGroup');
      const baiduApiKeyGroup = document.getElementById('baiduApiKeyGroup');
      
      endpointGroup.style.display = e.target.value === 'custom' ? 'block' : 'none';
      baiduApiGroup.style.display = e.target.value === 'baidu' ? 'block' : 'none';
      baiduApiKeyGroup.style.display = e.target.value === 'baidu' ? 'block' : 'none';
    });
    
    // 显示/隐藏相应的输入框
    if (settings.translationService === 'custom') {
      document.getElementById('apiEndpointGroup').style.display = 'block';
    } else if (settings.translationService === 'baidu') {
      document.getElementById('baiduApiGroup').style.display = 'block';
      document.getElementById('baiduApiKeyGroup').style.display = 'block';
    }
    
    // 绑定事件
    bindEvents();
  });
}

// 绑定事件处理
function bindEvents() {
  // 保存按钮
  document.getElementById('opt-save').addEventListener('click', saveSettings);
  
  // 清除缓存按钮
  document.getElementById('opt-clearCache').addEventListener('click', () => {
    browser.runtime.sendMessage({ action: 'clearCache' }, (response) => {
      if (browser.runtime.lastError) {
        showSaveStatus('清除缓存失败：' + browser.runtime.lastError.message, 'error');
        return;
      }
      showSaveStatus('缓存已清除', 'success');
    });
  });
}

// 保存设置
function saveSettings() {
  const newSettings = {
    enabled: document.getElementById('opt-enabled').checked,
    targetLang: document.getElementById('opt-targetLang').value,
    sourceLang: document.getElementById('opt-sourceLang').value,
    showButton: document.getElementById('opt-showButton').checked,
    autoHideDelay: parseInt(document.getElementById('opt-autoHideDelay').value) || 5000,
    autoTranslate: document.getElementById('opt-autoTranslate').checked,
    translationService: document.getElementById('opt-translationService').value,
    apiEndpoint: document.getElementById('opt-apiEndpoint').value.trim(),
    baiduAppId: document.getElementById('opt-baiduAppId').value.trim(),
    baiduApiKey: document.getElementById('opt-baiduApiKey').value.trim()
  };
  
  browser.storage.local.set(newSettings, () => {
    if (browser.runtime.lastError) {
      showSaveStatus('保存失败：' + browser.runtime.lastError.message, 'error');
      return;
    }
    showSaveStatus('设置已保存', 'success');
  });
}

// 显示保存状态
function showSaveStatus(message, type) {
  const statusEl = document.getElementById('opt-saveStatus');
  statusEl.textContent = message;
  statusEl.className = `save-status ${type}`;
  statusEl.style.display = 'block';
  
  setTimeout(() => {
    statusEl.style.display = 'none';
  }, 3000);
}

// 监听存储变化
function listenForStorageChanges() {
  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      // 更新显示翻译按钮状态
      if (changes.showButton !== undefined) {
        document.getElementById('opt-showButton').checked = changes.showButton.newValue;
      }
      
      // 更新自动翻译状态
      if (changes.autoTranslate !== undefined) {
        document.getElementById('opt-autoTranslate').checked = changes.autoTranslate.newValue;
      }
      
      // 更新其他设置
      if (changes.enabled !== undefined) {
        document.getElementById('opt-enabled').checked = changes.enabled.newValue;
      }
      
      if (changes.targetLang !== undefined) {
        document.getElementById('opt-targetLang').value = changes.targetLang.newValue;
      }
      
      if (changes.sourceLang !== undefined) {
        document.getElementById('opt-sourceLang').value = changes.sourceLang.newValue;
      }
    }
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  init();
  listenForStorageChanges();
});
