// 使用浏览器原生 API
const browser = (typeof window !== 'undefined' ? window.browser : self.browser) || (typeof window !== 'undefined' ? window.chrome : self.chrome);

// 缓存管理
const cache = {
  async get(key) {
    return new Promise((resolve) => {
      browser.storage.local.get([key], (result) => {
        resolve(result[key]);
      });
    });
  },
  async set(key, value) {
    return new Promise((resolve) => {
      browser.storage.local.set({ [key]: value }, resolve);
    });
  },
  async clear() {
    return new Promise((resolve) => {
      browser.storage.local.clear(resolve);
    });
  }
};

// 语言代码转换（将 zh-CN 转换为 libretranslate 使用的 zh）
function convertLanguageCode(langCode, service = 'libre') {
  const libreLangMap = {
    'zh-CN': 'zh',
    'zh-TW': 'zh-TW',
    'en': 'en',
    'ja': 'ja',
    'ko': 'ko',
    'fr': 'fr',
    'de': 'de',
    'es': 'es',
    'ru': 'ru',
    'auto': 'auto'
  };
  
  const baiduLangMap = {
    'zh-CN': 'zh',
    'zh-TW': 'cht',
    'en': 'en',
    'ja': 'jp',
    'ko': 'kor',
    'fr': 'fra',
    'de': 'de',
    'es': 'spa',
    'ru': 'ru'
  };
  
  if (service === 'baidu') {
    return baiduLangMap[langCode] || 'en';
  }
  return libreLangMap[langCode] || 'en';
}

// MD5 哈希函数（用于百度翻译签名）- 支持UTF-8
function md5(string) {
  function md5cycle(x, k) {
    var a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }

  function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }

  function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }

  function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }

  function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

  function md5blk(s) {
    var md5blks = [], i;
    for (i = 0; i < 64; i += 4) {
      md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }

  function md5blk_array(a) {
    var md5blks = [], i;
    for (i = 0; i < 64; i += 4) {
      md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
    }
    return md5blks;
  }

  function rhex(n) {
    var s = '', j = 0;
    for (; j < 4; j++) {
      var byte = (n >> (j * 8)) & 255;
      s += ('0' + byte.toString(16)).slice(-2);
    }
    return s;
  }

  function hex(x) {
    for (var i = 0; i < x.length; i++)
      x[i] = rhex(x[i]);
    return x.join('');
  }

  function add32(a, b) {
    return (a + b) & 0xFFFFFFFF;
  }

  function md5_1(s) {
    var n = s.length,
      state = [1732584193, -271733879, -1732584194, 271733878], i;
    for (i = 64; i <= s.length; i += 64) {
      md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++)
      tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }

  function md5_array(a) {
    var n = a.length,
      state = [1732584193, -271733879, -1732584194, 271733878], i;
    for (i = 64; i <= a.length; i += 64) {
      md5cycle(state, md5blk_array(a.slice(i - 64, i)));
    }
    a = (i - 64) < a.length ? a.slice(i - 64) : [];
    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < a.length; i++)
      tail[i >> 2] |= a[i] << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }

  // 将字符串转换为UTF-8字节数组
  function utf8_encode(str) {
    var utf8 = [];
    for (var i = 0; i < str.length; i++) {
      var charcode = str.charCodeAt(i);
      if (charcode < 0x80) utf8.push(charcode);
      else if (charcode < 0x800) {
        utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
      }
      else if (charcode < 0xd800 || charcode >= 0xe000) {
        utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
      }
      else {
        i++;
        charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
        utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
      }
    }
    return utf8;
  }

  // 使用UTF-8编码计算MD5
  var utf8Bytes = utf8_encode(string);
  return hex(md5_array(utf8Bytes));
}

// 识别语言
async function detectLanguage(text, baiduAppId, baiduApiKey) {
  const endpoint = 'https://fanyi-api.baidu.com/api/trans/vip/language';
  const salt = new Date().getTime();
  const signStr = baiduAppId + text + salt + baiduApiKey;
  const sign = md5(signStr);
  
  console.log('[Background] 调用百度语言识别 API');
  console.log('[Background] Text:', text);
  
  const url = new URL(endpoint);
  url.searchParams.append('q', text);
  url.searchParams.append('appid', baiduAppId);
  url.searchParams.append('salt', salt);
  url.searchParams.append('sign', sign);
  
  console.log('[Background] 语言识别 URL:', url.toString());
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('[Background] 语言识别 API 响应错误:', errorData);
    throw new Error(`语言识别请求失败：${errorData.error_msg || response.status}`);
  }
  
  const data = await response.json();
  console.log('[Background] 语言识别成功:', data);
  
  if (!data.language) {
    throw new Error(`语言识别API返回格式错误：${JSON.stringify(data)}`);
  }
  
  return data.language;
}

// 翻译 API 调用
async function translateText(text, targetLang, sourceLang = 'en') {
  const cacheKey = `translate_${sourceLang}_${targetLang}_${text}`;
  
  // 检查缓存
  const cached = await cache.get(cacheKey);
  if (cached) {
    console.log('[Background] 从缓存获取翻译');
    return cached.translated;
  }
  
  // 获取用户配置的翻译服务
  const storageResult = await new Promise((resolve) => {
    browser.storage.local.get([
      'translationService', 
      'apiEndpoint',
      'baiduAppId',
      'baiduApiKey'
    ], resolve);
  });
  const translationService = storageResult.translationService || 'libre';
  const apiEndpoint = storageResult.apiEndpoint || '';
  const baiduAppId = storageResult.baiduAppId || '';
  const baiduApiKey = storageResult.baiduApiKey || '';
  
  try {
    let result;
    
    // 使用 LibreTranslate
    if (translationService === 'libre') {
      const endpoint = apiEndpoint || 'https://libretranslate.com/translate';
      console.log('[Background] 调用 LibreTranslate API:', endpoint);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: convertLanguageCode(sourceLang, 'libre'),
          target: convertLanguageCode(targetLang, 'libre'),
          format: 'text',
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Background] LibreTranslate API 响应错误:', response.status, errorText);
        throw new Error(`翻译请求失败：${response.status}`);
      }
      
      const data = await response.json();
      console.log('[Background] LibreTranslate 翻译成功');
      result = data.translatedText;
      
    } else if (translationService === 'baidu') {
      // 使用百度翻译
      if (!baiduAppId || !baiduApiKey) {
        throw new Error('请先配置百度翻译的 APP ID 和 API Key');
      }
      
      // 先进行语言识别
      let detectedSourceLang = sourceLang;
      if (sourceLang === 'auto') {
        try {
          detectedSourceLang = await detectLanguage(text, baiduAppId, baiduApiKey);
          console.log('[Background] 自动检测到语言:', detectedSourceLang);
        } catch (error) {
          console.error('[Background] 语言识别失败，使用默认语言:', sourceLang, error);
          detectedSourceLang = 'en';
        }
      }
      
      const endpoint = 'https://fanyi-api.baidu.com/api/trans/vip/translate';
      const salt = new Date().getTime();
      const signStr = baiduAppId + text + salt + baiduApiKey;
      const sign = md5(signStr);
      
      console.log('[Background] 调用百度翻译 API');
      console.log('[Background] APP ID:', baiduAppId);
      console.log('[Background] API Key:', baiduApiKey.substring(0, 4) + '...' + baiduApiKey.substring(baiduApiKey.length - 4));
      console.log('[Background] Text:', text);
      console.log('[Background] Source Lang:', detectedSourceLang);
      console.log('[Background] Target Lang:', targetLang);
      console.log('[Background] Salt:', salt);
      console.log('[Background] Sign string:', signStr.substring(0, 20) + '...' + signStr.substring(signStr.length - 20));
      console.log('[Background] Sign:', sign);
      
      const url = new URL(endpoint);
      url.searchParams.append('q', text);
      url.searchParams.append('from', convertLanguageCode(detectedSourceLang, 'baidu'));
      url.searchParams.append('to', convertLanguageCode(targetLang, 'baidu'));
      url.searchParams.append('appid', baiduAppId);
      url.searchParams.append('salt', salt);
      url.searchParams.append('sign', sign);
      
      console.log('[Background] API URL:', url.toString());
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[Background] 百度翻译 API 响应错误:', errorData);
        throw new Error(`翻译请求失败：${errorData.error_msg || response.status}`);
      }
      
      const data = await response.json();
      console.log('[Background] 百度翻译成功:', data);
      
      // 检查是否有翻译结果
      if (!data.trans_result || !Array.isArray(data.trans_result)) {
        throw new Error(`百度翻译API返回格式错误：${JSON.stringify(data)}`);
      }
      
      // 百度翻译返回的结果可能包含多个段落
      result = data.trans_result.map(item => item.dst).join('\n');
      
    } else {
      // 默认返回示例文本
      result = `[待实现] ${text} (${sourceLang} -> ${targetLang})`;
    }
    
    // 缓存翻译结果
    await cache.set(cacheKey, {
      text,
      translated: result,
      sourceLang,
      targetLang,
      timestamp: Date.now()
    });
    
    return result;
  } catch (error) {
    console.error('[Background] 翻译错误:', error);
    throw error;
  }
}

// 监听来自 content script 的消息
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'translate') {
    (async () => {
      try {
        const { text, targetLang, sourceLang } = message;
        console.log('[Background] 收到翻译请求:', { text, targetLang, sourceLang });
        
        const translatedText = await translateText(text, targetLang, sourceLang);
        
        sendResponse({
          success: true,
          translatedText,
          originalText: text
        });
      } catch (error) {
        console.error('[Background] 翻译失败:', error);
        sendResponse({
          success: false,
          error: error.message
        });
      }
    })();
    return true; // 表示异步响应
  }
  
  if (message.action === 'clearCache') {
    (async () => {
      await cache.clear();
      sendResponse({ success: true });
    })();
    return true; // 表示异步响应
  }
});

// 创建右键菜单
browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: 'translate-selection',
    title: '使用GreyTracks翻译',
    contexts: ['selection']
  });
});

// 监听右键菜单点击
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'translate-selection' && info.selectionText) {
    browser.storage.local.get(['targetLang'], (result) => {
      const targetLang = result.targetLang || 'zh-CN';
      
      console.log('[Background] 右键菜单翻译:', info.selectionText);
      
      // 向 content script 发送消息
      browser.tabs.sendMessage(tab.id, {
        action: 'translateSelectedText',
        text: info.selectionText,
        targetLang
      }, (response) => {
        if (browser.runtime.lastError) {
          console.error('[Background] 发送消息失败:', browser.runtime.lastError);
        }
      });
    });
  }
});

console.log('[Background] Background service worker initialized');
