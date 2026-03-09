// 使用 Chrome 原生 API
const browser = chrome;

// 翻译卡片元素
let translationPopup = null;
let translateButton = null;
let isPopupVisible = false;
let currentSelection = null;
let isConfigLoaded = false;
let isTranslating = false;
let popupCloseTimer = null;

// 配置选项
let config = {
  enabled: true,
  targetLang: 'zh-CN',
  sourceLang: 'en',
  showButton: true,
  autoHideDelay: 5000,
  autoTranslate: false
};

// 加载配置
function loadConfig() {
  return new Promise((resolve) => {
    try {
      if (!chrome || !chrome.storage || !chrome.storage.local) {
        console.error('[Translator] 浏览器扩展API不可用');
        config = {
          enabled: true,
          targetLang: 'zh-CN',
          sourceLang: 'en',
          showButton: true,
          autoHideDelay: 5000,
          autoTranslate: false
        };
        isConfigLoaded = true;
        resolve();
        return;
      }
      
      chrome.storage.local.get([
        'enabled',
        'targetLang',
        'sourceLang',
        'showButton',
        'autoHideDelay',
        'autoTranslate'
      ], (stored) => {
        try {
          config = {
            enabled: stored.enabled !== false,
            targetLang: stored.targetLang || 'zh-CN',
            sourceLang: stored.sourceLang || 'en',
            showButton: stored.showButton !== false,
            autoHideDelay: stored.autoHideDelay || 5000,
            autoTranslate: stored.autoTranslate || false
          };
          
          isConfigLoaded = true;
          console.log('[Translator] 配置已加载:', config);
        } catch (error) {
          console.error('[Translator] 加载配置失败:', error);
          config = {
            enabled: true,
            targetLang: 'zh-CN',
            sourceLang: 'en',
            showButton: true,
            autoHideDelay: 5000,
            autoTranslate: false
          };
          isConfigLoaded = true;
        }
        resolve();
      });
    } catch (error) {
      console.error('[Translator] 加载配置失败:', error);
      config = {
        enabled: true,
        targetLang: 'zh-CN',
        sourceLang: 'en',
        showButton: true,
        autoHideDelay: 5000,
        autoTranslate: false
      };
      isConfigLoaded = true;
      resolve();
    }
  });
}

// 初始化配置
loadConfig();

// 监听配置变化
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    loadConfig();
  }
});

// 创建翻译按钮
function createTranslateButton() {
  if (translateButton) {
    return;
  }
  
  const button = document.createElement('div');
  button.id = 'translator-button';
  button.className = 'translator-button';
  button.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.87 15.07L10.33 12.56L10.36 12.53C12.1 10.59 13.34 8.36 14.07 6H17V4H14V2H12V4H8.93C9.66 6.36 10.9 8.59 12.64 10.53L12.67 10.56L10.13 13.07L12.87 15.07ZM17 18H19V20H17V22H15V20H13V18H15V16H17V18ZM1 13H3V11H1V13ZM1 9H3V7H1V9ZM5 17H7V15H5V17ZM5 13H7V11H5V13ZM5 9H7V7H5V9ZM9 17H11V15H9V17ZM9 13H11V11H9V13ZM9 9H11V7H9V9Z" fill="white"/>
    </svg>
  `;
  button.title = '点击翻译';
  button.style.cssText = `
    position: fixed;
    z-index: 1000000;
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    pointer-events: auto;
    opacity: 0;
    left: 100px;
    top: 100px;
  `;
  
  document.body.appendChild(button);
  translateButton = button;
  
  console.log('[Translator] 翻译按钮已创建');
  
  // 绑定点击事件
  button.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log('[Translator] 按钮被点击');
      if (currentSelection) {
        // 保存当前选择
        const selection = window.getSelection();
        let savedRange = null;
        if (selection && selection.rangeCount > 0) {
          savedRange = selection.getRangeAt(0);
        }
        
        await performTranslation(currentSelection.text, currentSelection.position);
        
        // 恢复选择
        if (savedRange) {
          setTimeout(() => {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(savedRange);
          }, 100);
        }
      }
    } catch (error) {
      console.error('[Translator] 按钮点击处理错误:', error);
    }
  });
  
  // 鼠标悬停时保持显示
  button.addEventListener('mouseenter', () => {
    console.log('[Translator] 鼠标悬停在按钮上');
    if (window.buttonHideTimeout) {
      clearTimeout(window.buttonHideTimeout);
    }
  });
}

// 显示翻译按钮
function showButton(position) {
  if (!translateButton) {
    createTranslateButton();
  }
  
  console.log('[Translator] 显示按钮在位置:', position);
  
  // 计算按钮位置
  let buttonX = position.x;
  let buttonY = position.y;
  
  // 确保按钮在视窗内
  if (buttonX + 40 > window.innerWidth) {
    buttonX = window.innerWidth - 40;
  }
  if (buttonY + 40 > window.innerHeight) {
    buttonY = window.innerHeight - 40;
  }
  
  // 设置按钮位置和样式
  translateButton.style.left = `${buttonX}px`;
  translateButton.style.top = `${buttonY}px`;
  translateButton.style.display = 'flex';
  translateButton.style.opacity = '1';
  
  console.log('[Translator] 按钮显示完成');
}

// 隐藏翻译按钮
function hideButton() {
  if (translateButton) {
    translateButton.style.opacity = '0';
    setTimeout(() => {
      translateButton.style.display = 'none';
    }, 200);
  }
  console.log('[Translator] 按钮已隐藏');
}

// 创建翻译卡片
function createPopup() {
  if (translationPopup) {
    return;
  }
  
  const popup = document.createElement('div');
  popup.id = 'translator-popup';
  popup.className = 'translator-popup';
  popup.innerHTML = `
    <div class="translator-popup-header">
      <h3 style="margin: 0; font-size: 14px; color: #666;">翻译结果</h3>
      <button class="translator-popup-close" style="background: none; border: none; font-size: 16px; cursor: pointer; color: #999; padding: 0; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">×</button>
    </div>
    <div class="translator-popup-content">
      <div class="translator-popup-original"></div>
      <div class="translator-popup-divider"></div>
      <div class="translator-popup-translated"></div>
    </div>
    <div class="translator-popup-loading" style="display: none;">
      <div class="translator-spinner"></div>
      <span>翻译中...</span>
    </div>
  `;
  
  popup.style.cssText = `
    position: fixed;
    z-index: 1000000;
    max-width: 400px;
    min-width: 200px;
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    padding: 12px;
    display: none;
    opacity: 0;
    transition: opacity 0.2s ease;
  `;
  
  const header = popup.querySelector('.translator-popup-header');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  `;
  
  const originalEl = popup.querySelector('.translator-popup-original');
  originalEl.style.cssText = `
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
    padding: 6px;
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    white-space: pre-wrap;
    word-break: break-word;
  `;
  
  const dividerEl = popup.querySelector('.translator-popup-divider');
  dividerEl.style.cssText = `
    height: 1px;
    background-color: #e9ecef;
    margin: 4px 0;
  `;
  
  const translatedEl = popup.querySelector('.translator-popup-translated');
  translatedEl.style.cssText = `
    font-size: 13px;
    color: #333;
    padding: 6px;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    white-space: pre-wrap;
    word-break: break-word;
  `;
  
  const closeButton = popup.querySelector('.translator-popup-close');
  closeButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    hidePopup();
  });
  
  document.body.appendChild(popup);
  translationPopup = popup;
  
  makeDraggable(popup);
  
  console.log('[Translator] 翻译卡片已创建');
}

// 显示翻译卡片
function showPopup(position, originalText, translatedText) {
  if (!translationPopup) {
    createPopup();
  }
  
  // 清除之前的关闭定时器
  if (popupCloseTimer) {
    clearTimeout(popupCloseTimer);
    popupCloseTimer = null;
  }
  
  const popup = translationPopup;
  const originalEl = popup.querySelector('.translator-popup-original');
  const translatedEl = popup.querySelector('.translator-popup-translated');
  const loadingEl = popup.querySelector('.translator-popup-loading');
  
  originalEl.textContent = originalText || '';
  translatedEl.textContent = translatedText || '';
  loadingEl.style.display = translatedText ? 'none' : 'flex';
  
  // 设置位置 - 计算居中位置
  let popupX, popupY;
  
  // 对于长难句，尝试居中显示
  if (originalText && originalText.length > 50) {
    // 居中显示
    popupX = (window.innerWidth - 400) / 2; // 400是popup的最大宽度
    popupY = (window.innerHeight - 200) / 2; // 200是估计的popup高度
  } else {
    // 对于短文本，显示在选中文本附近
    popupX = position.x;
    popupY = position.y + 40;
  }
  
  // 确保popup在视窗内
  if (popupX < 10) {
    popupX = 10;
  } else if (popupX + 400 > window.innerWidth) {
    popupX = window.innerWidth - 410;
  }
  
  if (popupY < 10) {
    popupY = 10;
  } else if (popupY + 300 > window.innerHeight) {
    popupY = window.innerHeight - 310;
  }
  
  popup.style.left = `${popupX}px`;
  popup.style.top = `${popupY}px`;
  popup.style.display = 'block';
  popup.style.opacity = '0';
  
  // 强制重排
  popup.offsetHeight;
  
  // 动画显示
  setTimeout(() => {
    popup.style.opacity = '1';
  }, 10);
  
  isPopupVisible = true;
  console.log('[Translator] 显示翻译卡片');
}

// 隐藏翻译卡片
function hidePopup() {
  if (!isTranslating && translationPopup) {
    translationPopup.style.opacity = '0';
    setTimeout(() => {
      translationPopup.style.display = 'none';
    }, 200);
    isPopupVisible = false;
    console.log('[Translator] 翻译卡片已隐藏');
  }
}

// 更新翻译内容
function updatePopupContent(translatedText, originalText = '') {
  try {
    if (!translationPopup) return;
    
    const originalEl = translationPopup.querySelector('.translator-popup-original');
    const translatedEl = translationPopup.querySelector('.translator-popup-translated');
    const dividerEl = translationPopup.querySelector('.translator-popup-divider');
    const loadingEl = translationPopup.querySelector('.translator-popup-loading');
    
    if (originalEl && translatedEl && loadingEl) {
      originalEl.textContent = originalText;
      originalEl.style.display = originalText ? 'block' : 'none';
      
      if (dividerEl) {
        dividerEl.style.display = originalText ? 'block' : 'none';
      }
      
      translatedEl.textContent = translatedText;
      loadingEl.style.display = 'none';
      console.log('[Translator] 翻译内容已更新');
      
          // 移除定时关闭功能，改为只在点击其他地方时关闭
    }
  } catch (error) {
    console.error('[Translator] 更新翻译内容失败:', error);
  }
}

// 使卡片可拖动
function makeDraggable(element) {
  let isDragging = false;
  let startX, startY, initialLeft, initialTop;
  
  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialLeft = element.offsetLeft;
    initialTop = element.offsetTop;
    e.preventDefault();
    e.stopPropagation();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    
    element.style.left = `${initialLeft + dx}px`;
    element.style.top = `${initialTop + dy}px`;
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

// 获取选中文本
function getSelectedText() {
  try {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    console.log('[Translator] 检测到选中文字:', text);
    
    if (!text || text.length === 0) {
      console.log('[Translator] 无选中文本');
      return null;
    }
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    console.log('[Translator] 选中区域位置:', rect);
    
    const activeElement = document.activeElement;
    if (activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.isContentEditable
    )) {
      console.log('[Translator] 在输入框内，跳过');
      return null;
    }
    
    return {
      text,
      position: {
        x: rect.right + 10,
        y: rect.top
      }
    };
  } catch (error) {
    console.error('[Translator] 获取选中文本失败:', error);
    return null;
  }
}

// 检查扩展上下文是否有效
function isExtensionContextValid() {
  try {
    return chrome && chrome.runtime && chrome.runtime.id !== undefined;
  } catch (e) {
    return false;
  }
}

// 显示扩展上下文失效提示
function showContextInvalidError() {
  if (!translationPopup) {
    createPopup();
  }
  
  const popup = translationPopup;
  const translatedEl = popup.querySelector('.translator-popup-translated');
  const loadingEl = popup.querySelector('.translator-popup-loading');
  
  if (translatedEl && loadingEl) {
    translatedEl.innerHTML = '<div style="color: #e74c3c; font-weight: bold;">扩展已更新，请刷新页面</div><div style="color: #666; font-size: 12px; margin-top: 8px;">检测到扩展上下文已失效，请刷新当前页面后重试。</div>';
    loadingEl.style.display = 'none';
    
    popup.style.left = '50%';
    popup.style.top = '100px';
    popup.style.transform = 'translateX(-50%)';
    popup.style.display = 'block';
    popup.style.opacity = '1';
    isPopupVisible = true;
    
    // 移除自动隐藏，让错误信息一直显示直到用户手动关闭
  }
}

// 执行翻译
function performTranslation(text, position, showOriginal = true) {
  try {
    if (!config.enabled) {
      return;
    }
    
    if (!isExtensionContextValid()) {
      try {
        showContextInvalidError();
      } catch (e) {
        // 静默处理错误
      }
      return;
    }
    
    isTranslating = true;
    
    try {
      showPopup(position, showOriginal ? text : '', null);
    } catch (e) {
      // 静默处理错误
      isTranslating = false;
      return;
    }
    
    const currentChrome = chrome;
    
    try {
      currentChrome.runtime.sendMessage({
        action: 'translate',
        text,
        targetLang: config.targetLang,
        sourceLang: config.sourceLang
      }, (response) => {
        try {
          if (!isExtensionContextValid()) {
            try {
              showContextInvalidError();
            } catch (e) {
              // 静默处理错误
            }
            isTranslating = false;
            return;
          }
          
          if (currentChrome.runtime.lastError) {
            const errorMessage = currentChrome.runtime.lastError.message || '未知错误';
            if (errorMessage.includes('Extension context invalidated')) {
              try {
                showContextInvalidError();
              } catch (e) {
                // 静默处理错误
              }
            } else {
              try {
                updatePopupContent(`翻译错误：${errorMessage}`);
              } catch (e) {
                // 静默处理错误
              }
            }
            isTranslating = false;
            return;
          }
          
          if (!response) {
            try {
              updatePopupContent('翻译错误：未收到响应');
            } catch (e) {
              // 静默处理错误
            }
            isTranslating = false;
            return;
          }
          
          if (response.success) {
            try {
              updatePopupContent(response.translatedText, showOriginal ? text : '');
            } catch (e) {
              // 静默处理错误
            }
          } else {
            try {
              updatePopupContent(`翻译失败：${response.error || '未知错误'}`);
            } catch (e) {
              // 静默处理错误
            }
          }
          
          isTranslating = false;
        } catch (callbackError) {
          // 静默处理错误
          isTranslating = false;
        }
      });
    } catch (e) {
      // 静默处理错误
      isTranslating = false;
    }
  } catch (error) {
    // 静默处理错误
    isTranslating = false;
  }
}

// 监听鼠标按下事件
document.addEventListener('mousedown', (e) => {
  if ((translationPopup && translationPopup.contains(e.target)) ||
      (translateButton && translateButton.contains(e.target))) {
    return;
  }
  
  // 点击其他地方时隐藏翻译按钮和弹窗
  if (translateButton && translateButton.style.display === 'flex') {
    hideButton();
  }
  
  if (isPopupVisible && translationPopup && !translationPopup.contains(e.target)) {
    if (!isTranslating) {
      hidePopup();
    }
  }
});

// 监听鼠标松开事件
document.addEventListener('mouseup', (e) => {
  try {
    console.log('[Translator] 鼠标松开事件:', e);
    
    if ((translationPopup && translationPopup.contains(e.target)) ||
        (translateButton && translateButton.contains(e.target))) {
      console.log('[Translator] 点击了翻译组件，跳过');
      return;
    }
    
    if (isTranslating) {
      console.log('[Translator] 正在翻译，跳过');
      return;
    }
    
    if (!isConfigLoaded) {
      console.log('[Translator] 等待配置加载');
      loadConfig().then(() => {
        try {
          handleMouseUp(e);
        } catch (error) {
          console.error('[Translator] 处理鼠标事件失败:', error);
        }
      });
    } else {
      handleMouseUp(e);
    }
  } catch (error) {
    console.error('[Translator] 鼠标事件处理错误:', error);
  }
});

// 处理鼠标松开事件
function handleMouseUp(e) {
  if (!config.enabled) {
    console.log('[Translator] 插件已禁用，跳过');
    return;
  }
  
  setTimeout(() => {
    const selection = getSelectedText();
    
    if (selection && selection.text.length > 0) {
      console.log('[Translator] 检测到选中文本:', selection.text, '长度:', selection.text.length);
      console.log('[Translator] 选中文本位置:', selection.position);
      currentSelection = selection;
      
      if (config.autoTranslate) {
        console.log('[Translator] 自动翻译已启用，立即进行翻译');
        performTranslation(selection.text, selection.position, false);
      } else {
        console.log('[Translator] 显示翻译按钮');
        showButton(selection.position);
        
        if (window.buttonHideTimeout) {
          clearTimeout(window.buttonHideTimeout);
        }
        
        window.buttonHideTimeout = setTimeout(() => {
          if (!isPopupVisible) {
            console.log('[Translator] 10秒后隐藏按钮');
            hideButton();
          }
        }, 10000);
      }
    }
  }, 100);
}

// 监听来自 background 的消息
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'translateSelectedText') {
    console.log('[Translator] 收到翻译消息:', message);
    const selection = getSelectedText();
    const text = message.text || (selection ? selection.text : '');
    const position = selection ? selection.position : { x: 100, y: 100 };
    
    if (text) {
      currentSelection = { text, position };
      performTranslation(text, position);
    }
  }
});

// 监听键盘快捷键
document.addEventListener('keydown', (e) => {
  try {
    if (e.altKey && e.key === 'z') {
      e.preventDefault();
      
      if (isPopupVisible) {
          console.log('[Translator] 快捷键关闭翻译框');
          hidePopup();
        } else {
          console.log('[Translator] 快捷键触发翻译');
          const selection = getSelectedText();
          if (selection && selection.text) {
            currentSelection = selection;
            performTranslation(selection.text, selection.position, false);
          }
        }
    }
  } catch (error) {
    console.error('[Translator] 快捷键处理错误:', error);
  }
});

// 初始化
console.log('[Translator] 初始化...');
createTranslateButton();

console.log('[Translator] Content script loaded');
