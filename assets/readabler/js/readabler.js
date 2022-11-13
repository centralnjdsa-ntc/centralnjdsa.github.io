/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/cross-fetch/dist/browser-ponyfill.js":
/*!***********************************************************!*\
  !*** ./node_modules/cross-fetch/dist/browser-ponyfill.js ***!
  \***********************************************************/
/***/ (function(module, exports) {

var global = typeof self !== 'undefined' ? self : this;
var __self__ = (function () {
function F() {
this.fetch = false;
this.DOMException = global.DOMException
}
F.prototype = global;
return new F();
})();
(function(self) {

var irrelevant = (function (exports) {

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob:
      'FileReader' in self &&
      'Blob' in self &&
      (function() {
        try {
          new Blob();
          return true
        } catch (e) {
          return false
        }
      })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj)
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isArrayBufferView =
      ArrayBuffer.isView ||
      function(obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
      };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ', ' + value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push(name);
    });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) {
      items.push(value);
    });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        this._bodyText = body = Object.prototype.toString.call(body);
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      };
    }

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'same-origin';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);
  }

  Request.prototype.clone = function() {
    return new Request(this, {body: this._bodyInit})
  };

  function decode(body) {
    var form = new FormData();
    body
      .trim()
      .split('&')
      .forEach(function(bytes) {
        if (bytes) {
          var split = bytes.split('=');
          var name = split.shift().replace(/\+/g, ' ');
          var value = split.join('=').replace(/\+/g, ' ');
          form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
      });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''});
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  exports.DOMException = self.DOMException;
  try {
    new exports.DOMException();
  } catch (err) {
    exports.DOMException = function(message, name) {
      this.message = message;
      this.name = name;
      var error = Error(message);
      this.stack = error.stack;
    };
    exports.DOMException.prototype = Object.create(Error.prototype);
    exports.DOMException.prototype.constructor = exports.DOMException;
  }

  function fetch(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);

      if (request.signal && request.signal.aborted) {
        return reject(new exports.DOMException('Aborted', 'AbortError'))
      }

      var xhr = new XMLHttpRequest();

      function abortXhr() {
        xhr.abort();
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.onabort = function() {
        reject(new exports.DOMException('Aborted', 'AbortError'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });

      if (request.signal) {
        request.signal.addEventListener('abort', abortXhr);

        xhr.onreadystatechange = function() {
          // DONE (success or failure)
          if (xhr.readyState === 4) {
            request.signal.removeEventListener('abort', abortXhr);
          }
        };
      }

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  }

  fetch.polyfill = true;

  if (!self.fetch) {
    self.fetch = fetch;
    self.Headers = Headers;
    self.Request = Request;
    self.Response = Response;
  }

  exports.Headers = Headers;
  exports.Request = Request;
  exports.Response = Response;
  exports.fetch = fetch;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
})(__self__);
__self__.fetch.ponyfill = true;
// Remove "polyfill" property added by whatwg-fetch
delete __self__.fetch.polyfill;
// Choose between native implementation (global) or custom implementation (__self__)
// var ctx = global.fetch ? global : __self__;
var ctx = __self__; // this line disable service worker support temporarily
exports = ctx.fetch // To enable: import fetch from 'cross-fetch'
exports["default"] = ctx.fetch // For TypeScript consumers without esModuleInterop.
exports.fetch = ctx.fetch // To enable: import {fetch} from 'cross-fetch'
exports.Headers = ctx.Headers
exports.Request = ctx.Request
exports.Response = ctx.Response
module.exports = exports


/***/ }),

/***/ "./node_modules/hotkeys-js/dist/hotkeys.esm.js":
/*!*****************************************************!*\
  !*** ./node_modules/hotkeys-js/dist/hotkeys.esm.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ hotkeys)
/* harmony export */ });
/**! 
 * hotkeys-js v3.9.0 
 * A simple micro-library for defining and dispatching keyboard shortcuts. It has no dependencies. 
 * 
 * Copyright (c) 2022 kenny wong <wowohoo@qq.com> 
 * http://jaywcjlove.github.io/hotkeys 
 * Licensed under the MIT license 
 */

var isff = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase().indexOf('firefox') > 0 : false; // 绑定事件

function addEvent(object, event, method) {
  if (object.addEventListener) {
    object.addEventListener(event, method, false);
  } else if (object.attachEvent) {
    object.attachEvent("on".concat(event), function () {
      method(window.event);
    });
  }
} // 修饰键转换成对应的键码


function getMods(modifier, key) {
  var mods = key.slice(0, key.length - 1);

  for (var i = 0; i < mods.length; i++) {
    mods[i] = modifier[mods[i].toLowerCase()];
  }

  return mods;
} // 处理传的key字符串转换成数组


function getKeys(key) {
  if (typeof key !== 'string') key = '';
  key = key.replace(/\s/g, ''); // 匹配任何空白字符,包括空格、制表符、换页符等等

  var keys = key.split(','); // 同时设置多个快捷键，以','分割

  var index = keys.lastIndexOf(''); // 快捷键可能包含','，需特殊处理

  for (; index >= 0;) {
    keys[index - 1] += ',';
    keys.splice(index, 1);
    index = keys.lastIndexOf('');
  }

  return keys;
} // 比较修饰键的数组


function compareArray(a1, a2) {
  var arr1 = a1.length >= a2.length ? a1 : a2;
  var arr2 = a1.length >= a2.length ? a2 : a1;
  var isIndex = true;

  for (var i = 0; i < arr1.length; i++) {
    if (arr2.indexOf(arr1[i]) === -1) isIndex = false;
  }

  return isIndex;
}

var _keyMap = {
  backspace: 8,
  tab: 9,
  clear: 12,
  enter: 13,
  return: 13,
  esc: 27,
  escape: 27,
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  del: 46,
  delete: 46,
  ins: 45,
  insert: 45,
  home: 36,
  end: 35,
  pageup: 33,
  pagedown: 34,
  capslock: 20,
  num_0: 96,
  num_1: 97,
  num_2: 98,
  num_3: 99,
  num_4: 100,
  num_5: 101,
  num_6: 102,
  num_7: 103,
  num_8: 104,
  num_9: 105,
  num_multiply: 106,
  num_add: 107,
  num_enter: 108,
  num_subtract: 109,
  num_decimal: 110,
  num_divide: 111,
  '⇪': 20,
  ',': 188,
  '.': 190,
  '/': 191,
  '`': 192,
  '-': isff ? 173 : 189,
  '=': isff ? 61 : 187,
  ';': isff ? 59 : 186,
  '\'': 222,
  '[': 219,
  ']': 221,
  '\\': 220
}; // Modifier Keys

var _modifier = {
  // shiftKey
  '⇧': 16,
  shift: 16,
  // altKey
  '⌥': 18,
  alt: 18,
  option: 18,
  // ctrlKey
  '⌃': 17,
  ctrl: 17,
  control: 17,
  // metaKey
  '⌘': 91,
  cmd: 91,
  command: 91
};
var modifierMap = {
  16: 'shiftKey',
  18: 'altKey',
  17: 'ctrlKey',
  91: 'metaKey',
  shiftKey: 16,
  ctrlKey: 17,
  altKey: 18,
  metaKey: 91
};
var _mods = {
  16: false,
  18: false,
  17: false,
  91: false
};
var _handlers = {}; // F1~F12 special key

for (var k = 1; k < 20; k++) {
  _keyMap["f".concat(k)] = 111 + k;
}

var _downKeys = []; // 记录摁下的绑定键

var winListendFocus = false; // window是否已经监听了focus事件

var _scope = 'all'; // 默认热键范围

var elementHasBindEvent = []; // 已绑定事件的节点记录
// 返回键码

var code = function code(x) {
  return _keyMap[x.toLowerCase()] || _modifier[x.toLowerCase()] || x.toUpperCase().charCodeAt(0);
}; // 设置获取当前范围（默认为'所有'）


function setScope(scope) {
  _scope = scope || 'all';
} // 获取当前范围


function getScope() {
  return _scope || 'all';
} // 获取摁下绑定键的键值


function getPressedKeyCodes() {
  return _downKeys.slice(0);
} // 表单控件控件判断 返回 Boolean
// hotkey is effective only when filter return true


function filter(event) {
  var target = event.target || event.srcElement;
  var tagName = target.tagName;
  var flag = true; // ignore: isContentEditable === 'true', <input> and <textarea> when readOnly state is false, <select>

  if (target.isContentEditable || (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') && !target.readOnly) {
    flag = false;
  }

  return flag;
} // 判断摁下的键是否为某个键，返回true或者false


function isPressed(keyCode) {
  if (typeof keyCode === 'string') {
    keyCode = code(keyCode); // 转换成键码
  }

  return _downKeys.indexOf(keyCode) !== -1;
} // 循环删除handlers中的所有 scope(范围)


function deleteScope(scope, newScope) {
  var handlers;
  var i; // 没有指定scope，获取scope

  if (!scope) scope = getScope();

  for (var key in _handlers) {
    if (Object.prototype.hasOwnProperty.call(_handlers, key)) {
      handlers = _handlers[key];

      for (i = 0; i < handlers.length;) {
        if (handlers[i].scope === scope) handlers.splice(i, 1);else i++;
      }
    }
  } // 如果scope被删除，将scope重置为all


  if (getScope() === scope) setScope(newScope || 'all');
} // 清除修饰键


function clearModifier(event) {
  var key = event.keyCode || event.which || event.charCode;

  var i = _downKeys.indexOf(key); // 从列表中清除按压过的键


  if (i >= 0) {
    _downKeys.splice(i, 1);
  } // 特殊处理 cmmand 键，在 cmmand 组合快捷键 keyup 只执行一次的问题


  if (event.key && event.key.toLowerCase() === 'meta') {
    _downKeys.splice(0, _downKeys.length);
  } // 修饰键 shiftKey altKey ctrlKey (command||metaKey) 清除


  if (key === 93 || key === 224) key = 91;

  if (key in _mods) {
    _mods[key] = false; // 将修饰键重置为false

    for (var k in _modifier) {
      if (_modifier[k] === key) hotkeys[k] = false;
    }
  }
}

function unbind(keysInfo) {
  // unbind(), unbind all keys
  if (!keysInfo) {
    Object.keys(_handlers).forEach(function (key) {
      return delete _handlers[key];
    });
  } else if (Array.isArray(keysInfo)) {
    // support like : unbind([{key: 'ctrl+a', scope: 's1'}, {key: 'ctrl-a', scope: 's2', splitKey: '-'}])
    keysInfo.forEach(function (info) {
      if (info.key) eachUnbind(info);
    });
  } else if (typeof keysInfo === 'object') {
    // support like unbind({key: 'ctrl+a, ctrl+b', scope:'abc'})
    if (keysInfo.key) eachUnbind(keysInfo);
  } else if (typeof keysInfo === 'string') {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    // support old method
    // eslint-disable-line
    var scope = args[0],
        method = args[1];

    if (typeof scope === 'function') {
      method = scope;
      scope = '';
    }

    eachUnbind({
      key: keysInfo,
      scope: scope,
      method: method,
      splitKey: '+'
    });
  }
} // 解除绑定某个范围的快捷键


var eachUnbind = function eachUnbind(_ref) {
  var key = _ref.key,
      scope = _ref.scope,
      method = _ref.method,
      _ref$splitKey = _ref.splitKey,
      splitKey = _ref$splitKey === void 0 ? '+' : _ref$splitKey;
  var multipleKeys = getKeys(key);
  multipleKeys.forEach(function (originKey) {
    var unbindKeys = originKey.split(splitKey);
    var len = unbindKeys.length;
    var lastKey = unbindKeys[len - 1];
    var keyCode = lastKey === '*' ? '*' : code(lastKey);
    if (!_handlers[keyCode]) return; // 判断是否传入范围，没有就获取范围

    if (!scope) scope = getScope();
    var mods = len > 1 ? getMods(_modifier, unbindKeys) : [];
    _handlers[keyCode] = _handlers[keyCode].filter(function (record) {
      // 通过函数判断，是否解除绑定，函数相等直接返回
      var isMatchingMethod = method ? record.method === method : true;
      return !(isMatchingMethod && record.scope === scope && compareArray(record.mods, mods));
    });
  });
}; // 对监听对应快捷键的回调函数进行处理


function eventHandler(event, handler, scope, element) {
  if (handler.element !== element) {
    return;
  }

  var modifiersMatch; // 看它是否在当前范围

  if (handler.scope === scope || handler.scope === 'all') {
    // 检查是否匹配修饰符（如果有返回true）
    modifiersMatch = handler.mods.length > 0;

    for (var y in _mods) {
      if (Object.prototype.hasOwnProperty.call(_mods, y)) {
        if (!_mods[y] && handler.mods.indexOf(+y) > -1 || _mods[y] && handler.mods.indexOf(+y) === -1) {
          modifiersMatch = false;
        }
      }
    } // 调用处理程序，如果是修饰键不做处理


    if (handler.mods.length === 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91] || modifiersMatch || handler.shortcut === '*') {
      if (handler.method(event, handler) === false) {
        if (event.preventDefault) event.preventDefault();else event.returnValue = false;
        if (event.stopPropagation) event.stopPropagation();
        if (event.cancelBubble) event.cancelBubble = true;
      }
    }
  }
} // 处理keydown事件


function dispatch(event, element) {
  var asterisk = _handlers['*'];
  var key = event.keyCode || event.which || event.charCode; // 表单控件过滤 默认表单控件不触发快捷键

  if (!hotkeys.filter.call(this, event)) return; // Gecko(Firefox)的command键值224，在Webkit(Chrome)中保持一致
  // Webkit左右 command 键值不一样

  if (key === 93 || key === 224) key = 91;
  /**
   * Collect bound keys
   * If an Input Method Editor is processing key input and the event is keydown, return 229.
   * https://stackoverflow.com/questions/25043934/is-it-ok-to-ignore-keydown-events-with-keycode-229
   * http://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
   */

  if (_downKeys.indexOf(key) === -1 && key !== 229) _downKeys.push(key);
  /**
   * Jest test cases are required.
   * ===============================
   */

  ['ctrlKey', 'altKey', 'shiftKey', 'metaKey'].forEach(function (keyName) {
    var keyNum = modifierMap[keyName];

    if (event[keyName] && _downKeys.indexOf(keyNum) === -1) {
      _downKeys.push(keyNum);
    } else if (!event[keyName] && _downKeys.indexOf(keyNum) > -1) {
      _downKeys.splice(_downKeys.indexOf(keyNum), 1);
    } else if (keyName === 'metaKey' && event[keyName] && _downKeys.length === 3) {
      /**
       * Fix if Command is pressed:
       * ===============================
       */
      if (!(event.ctrlKey || event.shiftKey || event.altKey)) {
        _downKeys = _downKeys.slice(_downKeys.indexOf(keyNum));
      }
    }
  });
  /**
   * -------------------------------
   */

  if (key in _mods) {
    _mods[key] = true; // 将特殊字符的key注册到 hotkeys 上

    for (var k in _modifier) {
      if (_modifier[k] === key) hotkeys[k] = true;
    }

    if (!asterisk) return;
  } // 将 modifierMap 里面的修饰键绑定到 event 中


  for (var e in _mods) {
    if (Object.prototype.hasOwnProperty.call(_mods, e)) {
      _mods[e] = event[modifierMap[e]];
    }
  }
  /**
   * https://github.com/jaywcjlove/hotkeys/pull/129
   * This solves the issue in Firefox on Windows where hotkeys corresponding to special characters would not trigger.
   * An example of this is ctrl+alt+m on a Swedish keyboard which is used to type μ.
   * Browser support: https://caniuse.com/#feat=keyboardevent-getmodifierstate
   */


  if (event.getModifierState && !(event.altKey && !event.ctrlKey) && event.getModifierState('AltGraph')) {
    if (_downKeys.indexOf(17) === -1) {
      _downKeys.push(17);
    }

    if (_downKeys.indexOf(18) === -1) {
      _downKeys.push(18);
    }

    _mods[17] = true;
    _mods[18] = true;
  } // 获取范围 默认为 `all`


  var scope = getScope(); // 对任何快捷键都需要做的处理

  if (asterisk) {
    for (var i = 0; i < asterisk.length; i++) {
      if (asterisk[i].scope === scope && (event.type === 'keydown' && asterisk[i].keydown || event.type === 'keyup' && asterisk[i].keyup)) {
        eventHandler(event, asterisk[i], scope, element);
      }
    }
  } // key 不在 _handlers 中返回


  if (!(key in _handlers)) return;

  for (var _i = 0; _i < _handlers[key].length; _i++) {
    if (event.type === 'keydown' && _handlers[key][_i].keydown || event.type === 'keyup' && _handlers[key][_i].keyup) {
      if (_handlers[key][_i].key) {
        var record = _handlers[key][_i];
        var splitKey = record.splitKey;
        var keyShortcut = record.key.split(splitKey);
        var _downKeysCurrent = []; // 记录当前按键键值

        for (var a = 0; a < keyShortcut.length; a++) {
          _downKeysCurrent.push(code(keyShortcut[a]));
        }

        if (_downKeysCurrent.sort().join('') === _downKeys.sort().join('')) {
          // 找到处理内容
          eventHandler(event, record, scope, element);
        }
      }
    }
  }
} // 判断 element 是否已经绑定事件


function isElementBind(element) {
  return elementHasBindEvent.indexOf(element) > -1;
}

function hotkeys(key, option, method) {
  _downKeys = [];
  var keys = getKeys(key); // 需要处理的快捷键列表

  var mods = [];
  var scope = 'all'; // scope默认为all，所有范围都有效

  var element = document; // 快捷键事件绑定节点

  var i = 0;
  var keyup = false;
  var keydown = true;
  var splitKey = '+'; // 对为设定范围的判断

  if (method === undefined && typeof option === 'function') {
    method = option;
  }

  if (Object.prototype.toString.call(option) === '[object Object]') {
    if (option.scope) scope = option.scope; // eslint-disable-line

    if (option.element) element = option.element; // eslint-disable-line

    if (option.keyup) keyup = option.keyup; // eslint-disable-line

    if (option.keydown !== undefined) keydown = option.keydown; // eslint-disable-line

    if (typeof option.splitKey === 'string') splitKey = option.splitKey; // eslint-disable-line
  }

  if (typeof option === 'string') scope = option; // 对于每个快捷键进行处理

  for (; i < keys.length; i++) {
    key = keys[i].split(splitKey); // 按键列表

    mods = []; // 如果是组合快捷键取得组合快捷键

    if (key.length > 1) mods = getMods(_modifier, key); // 将非修饰键转化为键码

    key = key[key.length - 1];
    key = key === '*' ? '*' : code(key); // *表示匹配所有快捷键
    // 判断key是否在_handlers中，不在就赋一个空数组

    if (!(key in _handlers)) _handlers[key] = [];

    _handlers[key].push({
      keyup: keyup,
      keydown: keydown,
      scope: scope,
      mods: mods,
      shortcut: keys[i],
      method: method,
      key: keys[i],
      splitKey: splitKey,
      element: element
    });
  } // 在全局document上设置快捷键


  if (typeof element !== 'undefined' && !isElementBind(element) && window) {
    elementHasBindEvent.push(element);
    addEvent(element, 'keydown', function (e) {
      dispatch(e, element);
    });

    if (!winListendFocus) {
      winListendFocus = true;
      addEvent(window, 'focus', function () {
        _downKeys = [];
      });
    }

    addEvent(element, 'keyup', function (e) {
      dispatch(e, element);
      clearModifier(e);
    });
  }
}

function trigger(shortcut) {
  var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'all';
  Object.keys(_handlers).forEach(function (key) {
    var data = _handlers[key].find(function (item) {
      return item.scope === scope && item.shortcut === shortcut;
    });

    if (data && data.method) {
      data.method();
    }
  });
}

var _api = {
  setScope: setScope,
  getScope: getScope,
  deleteScope: deleteScope,
  getPressedKeyCodes: getPressedKeyCodes,
  isPressed: isPressed,
  filter: filter,
  trigger: trigger,
  unbind: unbind,
  keyMap: _keyMap,
  modifier: _modifier,
  modifierMap: modifierMap
};

for (var a in _api) {
  if (Object.prototype.hasOwnProperty.call(_api, a)) {
    hotkeys[a] = _api[a];
  }
}

if (typeof window !== 'undefined') {
  var _hotkeys = window.hotkeys;

  hotkeys.noConflict = function (deep) {
    if (deep && window.hotkeys === hotkeys) {
      window.hotkeys = _hotkeys;
    }

    return hotkeys;
  };

  window.hotkeys = hotkeys;
}




/***/ }),

/***/ "./node_modules/i18next-browser-languagedetector/dist/esm/i18nextBrowserLanguageDetector.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/i18next-browser-languagedetector/dist/esm/i18nextBrowserLanguageDetector.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Browser)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");



var arr = [];
var each = arr.forEach;
var slice = arr.slice;
function defaults(obj) {
  each.call(slice.call(arguments, 1), function (source) {
    if (source) {
      for (var prop in source) {
        if (obj[prop] === undefined) obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

// eslint-disable-next-line no-control-regex
var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

var serializeCookie = function serializeCookie(name, val, options) {
  var opt = options || {};
  opt.path = opt.path || '/';
  var value = encodeURIComponent(val);
  var str = name + '=' + value;

  if (opt.maxAge > 0) {
    var maxAge = opt.maxAge - 0;
    if (isNaN(maxAge)) throw new Error('maxAge should be a Number');
    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== 'function') {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + opt.expires.toUTCString();
  }

  if (opt.httpOnly) str += '; HttpOnly';
  if (opt.secure) str += '; Secure';

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string' ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;

      case 'lax':
        str += '; SameSite=Lax';
        break;

      case 'strict':
        str += '; SameSite=Strict';
        break;

      case 'none':
        str += '; SameSite=None';
        break;

      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
};

var cookie = {
  create: function create(name, value, minutes, domain) {
    var cookieOptions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
      path: '/',
      sameSite: 'strict'
    };

    if (minutes) {
      cookieOptions.expires = new Date();
      cookieOptions.expires.setTime(cookieOptions.expires.getTime() + minutes * 60 * 1000);
    }

    if (domain) cookieOptions.domain = domain;
    document.cookie = serializeCookie(name, encodeURIComponent(value), cookieOptions);
  },
  read: function read(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];

      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }

      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }

    return null;
  },
  remove: function remove(name) {
    this.create(name, '', -1);
  }
};
var cookie$1 = {
  name: 'cookie',
  lookup: function lookup(options) {
    var found;

    if (options.lookupCookie && typeof document !== 'undefined') {
      var c = cookie.read(options.lookupCookie);
      if (c) found = c;
    }

    return found;
  },
  cacheUserLanguage: function cacheUserLanguage(lng, options) {
    if (options.lookupCookie && typeof document !== 'undefined') {
      cookie.create(options.lookupCookie, lng, options.cookieMinutes, options.cookieDomain, options.cookieOptions);
    }
  }
};

var querystring = {
  name: 'querystring',
  lookup: function lookup(options) {
    var found;

    if (typeof window !== 'undefined') {
      var search = window.location.search;

      if (!window.location.search && window.location.hash && window.location.hash.indexOf('?') > -1) {
        search = window.location.hash.substring(window.location.hash.indexOf('?'));
      }

      var query = search.substring(1);
      var params = query.split('&');

      for (var i = 0; i < params.length; i++) {
        var pos = params[i].indexOf('=');

        if (pos > 0) {
          var key = params[i].substring(0, pos);

          if (key === options.lookupQuerystring) {
            found = params[i].substring(pos + 1);
          }
        }
      }
    }

    return found;
  }
};

var hasLocalStorageSupport = null;

var localStorageAvailable = function localStorageAvailable() {
  if (hasLocalStorageSupport !== null) return hasLocalStorageSupport;

  try {
    hasLocalStorageSupport = window !== 'undefined' && window.localStorage !== null;
    var testKey = 'i18next.translate.boo';
    window.localStorage.setItem(testKey, 'foo');
    window.localStorage.removeItem(testKey);
  } catch (e) {
    hasLocalStorageSupport = false;
  }

  return hasLocalStorageSupport;
};

var localStorage = {
  name: 'localStorage',
  lookup: function lookup(options) {
    var found;

    if (options.lookupLocalStorage && localStorageAvailable()) {
      var lng = window.localStorage.getItem(options.lookupLocalStorage);
      if (lng) found = lng;
    }

    return found;
  },
  cacheUserLanguage: function cacheUserLanguage(lng, options) {
    if (options.lookupLocalStorage && localStorageAvailable()) {
      window.localStorage.setItem(options.lookupLocalStorage, lng);
    }
  }
};

var hasSessionStorageSupport = null;

var sessionStorageAvailable = function sessionStorageAvailable() {
  if (hasSessionStorageSupport !== null) return hasSessionStorageSupport;

  try {
    hasSessionStorageSupport = window !== 'undefined' && window.sessionStorage !== null;
    var testKey = 'i18next.translate.boo';
    window.sessionStorage.setItem(testKey, 'foo');
    window.sessionStorage.removeItem(testKey);
  } catch (e) {
    hasSessionStorageSupport = false;
  }

  return hasSessionStorageSupport;
};

var sessionStorage = {
  name: 'sessionStorage',
  lookup: function lookup(options) {
    var found;

    if (options.lookupSessionStorage && sessionStorageAvailable()) {
      var lng = window.sessionStorage.getItem(options.lookupSessionStorage);
      if (lng) found = lng;
    }

    return found;
  },
  cacheUserLanguage: function cacheUserLanguage(lng, options) {
    if (options.lookupSessionStorage && sessionStorageAvailable()) {
      window.sessionStorage.setItem(options.lookupSessionStorage, lng);
    }
  }
};

var navigator$1 = {
  name: 'navigator',
  lookup: function lookup(options) {
    var found = [];

    if (typeof navigator !== 'undefined') {
      if (navigator.languages) {
        // chrome only; not an array, so can't use .push.apply instead of iterating
        for (var i = 0; i < navigator.languages.length; i++) {
          found.push(navigator.languages[i]);
        }
      }

      if (navigator.userLanguage) {
        found.push(navigator.userLanguage);
      }

      if (navigator.language) {
        found.push(navigator.language);
      }
    }

    return found.length > 0 ? found : undefined;
  }
};

var htmlTag = {
  name: 'htmlTag',
  lookup: function lookup(options) {
    var found;
    var htmlTag = options.htmlTag || (typeof document !== 'undefined' ? document.documentElement : null);

    if (htmlTag && typeof htmlTag.getAttribute === 'function') {
      found = htmlTag.getAttribute('lang');
    }

    return found;
  }
};

var path = {
  name: 'path',
  lookup: function lookup(options) {
    var found;

    if (typeof window !== 'undefined') {
      var language = window.location.pathname.match(/\/([a-zA-Z-]*)/g);

      if (language instanceof Array) {
        if (typeof options.lookupFromPathIndex === 'number') {
          if (typeof language[options.lookupFromPathIndex] !== 'string') {
            return undefined;
          }

          found = language[options.lookupFromPathIndex].replace('/', '');
        } else {
          found = language[0].replace('/', '');
        }
      }
    }

    return found;
  }
};

var subdomain = {
  name: 'subdomain',
  lookup: function lookup(options) {
    var found;

    if (typeof window !== 'undefined') {
      var language = window.location.href.match(/(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,5})/gi);

      if (language instanceof Array) {
        if (typeof options.lookupFromSubdomainIndex === 'number') {
          found = language[options.lookupFromSubdomainIndex].replace('http://', '').replace('https://', '').replace('.', '');
        } else {
          found = language[0].replace('http://', '').replace('https://', '').replace('.', '');
        }
      }
    }

    return found;
  }
};

function getDefaults() {
  return {
    order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    lookupSessionStorage: 'i18nextLng',
    // cache user language
    caches: ['localStorage'],
    excludeCacheFor: ['cimode'] //cookieMinutes: 10,
    //cookieDomain: 'myDomain'

  };
}

var Browser = /*#__PURE__*/function () {
  function Browser(services) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Browser);

    this.type = 'languageDetector';
    this.detectors = {};
    this.init(services, options);
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Browser, [{
    key: "init",
    value: function init(services) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var i18nOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      this.services = services;
      this.options = defaults(options, this.options || {}, getDefaults()); // backwards compatibility

      if (this.options.lookupFromUrlIndex) this.options.lookupFromPathIndex = this.options.lookupFromUrlIndex;
      this.i18nOptions = i18nOptions;
      this.addDetector(cookie$1);
      this.addDetector(querystring);
      this.addDetector(localStorage);
      this.addDetector(sessionStorage);
      this.addDetector(navigator$1);
      this.addDetector(htmlTag);
      this.addDetector(path);
      this.addDetector(subdomain);
    }
  }, {
    key: "addDetector",
    value: function addDetector(detector) {
      this.detectors[detector.name] = detector;
    }
  }, {
    key: "detect",
    value: function detect(detectionOrder) {
      var _this = this;

      if (!detectionOrder) detectionOrder = this.options.order;
      var detected = [];
      detectionOrder.forEach(function (detectorName) {
        if (_this.detectors[detectorName]) {
          var lookup = _this.detectors[detectorName].lookup(_this.options);

          if (lookup && typeof lookup === 'string') lookup = [lookup];
          if (lookup) detected = detected.concat(lookup);
        }
      });
      if (this.services.languageUtils.getBestMatchFromCodes) return detected; // new i18next v19.5.0

      return detected.length > 0 ? detected[0] : null; // a little backward compatibility
    }
  }, {
    key: "cacheUserLanguage",
    value: function cacheUserLanguage(lng, caches) {
      var _this2 = this;

      if (!caches) caches = this.options.caches;
      if (!caches) return;
      if (this.options.excludeCacheFor && this.options.excludeCacheFor.indexOf(lng) > -1) return;
      caches.forEach(function (cacheName) {
        if (_this2.detectors[cacheName]) _this2.detectors[cacheName].cacheUserLanguage(lng, _this2.options);
      });
    }
  }]);

  return Browser;
}();

Browser.type = 'languageDetector';




/***/ }),

/***/ "./node_modules/i18next-chained-backend/dist/esm/i18nextChainedBackend.js":
/*!********************************************************************************!*\
  !*** ./node_modules/i18next-chained-backend/dist/esm/i18nextChainedBackend.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");



var arr = [];
var each = arr.forEach;
var slice = arr.slice;
function defaults(obj) {
  each.call(slice.call(arguments, 1), function (source) {
    if (source) {
      for (var prop in source) {
        if (obj[prop] === undefined) obj[prop] = source[prop];
      }
    }
  });
  return obj;
}
function createClassOnDemand(ClassOrObject) {
  if (!ClassOrObject) return null;
  if (typeof ClassOrObject === 'function') return new ClassOrObject();
  return ClassOrObject;
}

function getDefaults() {
  return {
    handleEmptyResourcesAsFailed: true
  };
}

var Backend = /*#__PURE__*/function () {
  function Backend(services) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Backend);

    this.backends = [];
    this.type = 'backend';
    this.init(services, options);
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(Backend, [{
    key: "init",
    value: function init(services) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var i18nextOptions = arguments.length > 2 ? arguments[2] : undefined;
      this.services = services;
      this.options = defaults(options, this.options || {}, getDefaults());
      this.options.backends && this.options.backends.forEach(function (b, i) {
        _this.backends[i] = _this.backends[i] || createClassOnDemand(b);

        _this.backends[i].init(services, _this.options.backendOptions && _this.options.backendOptions[i] || {}, i18nextOptions);
      });
    }
  }, {
    key: "read",
    value: function read(language, namespace, callback) {
      var _this2 = this;

      var bLen = this.backends.length;

      var loadPosition = function loadPosition(pos) {
        if (pos >= bLen) return callback(new Error('non of the backend loaded data;', true)); // failed pass retry flag

        var isLastBackend = pos === bLen - 1;
        var lengthCheckAmount = _this2.options.handleEmptyResourcesAsFailed && !isLastBackend ? 0 : -1;
        var backend = _this2.backends[pos];

        if (backend.read) {
          backend.read(language, namespace, function (err, data) {
            if (!err && data && Object.keys(data).length > lengthCheckAmount) {
              callback(null, data, pos);
              savePosition(pos - 1, data); // save one in front
            } else {
              loadPosition(pos + 1); // try load from next
            }
          });
        } else {
          loadPosition(pos + 1); // try load from next
        }
      };

      var savePosition = function savePosition(pos, data) {
        if (pos < 0) return;
        var backend = _this2.backends[pos];

        if (backend.save) {
          backend.save(language, namespace, data);
          savePosition(pos - 1, data);
        } else {
          savePosition(pos - 1, data);
        }
      };

      loadPosition(0);
    }
  }, {
    key: "create",
    value: function create(languages, namespace, key, fallbackValue) {
      this.backends.forEach(function (b) {
        if (b.create) b.create(languages, namespace, key, fallbackValue);
      });
    }
  }]);

  return Backend;
}();

Backend.type = 'backend';

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Backend);


/***/ }),

/***/ "./node_modules/micromodal/dist/micromodal.es.js":
/*!*******************************************************!*\
  !*** ./node_modules/micromodal/dist/micromodal.es.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function e(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function t(e){return function(e){if(Array.isArray(e))return o(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return o(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return o(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(e,t){(null==t||t>e.length)&&(t=e.length);for(var o=0,n=new Array(t);o<t;o++)n[o]=e[o];return n}var n,i,a,r,s,l=(n=["a[href]","area[href]",'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',"select:not([disabled]):not([aria-hidden])","textarea:not([disabled]):not([aria-hidden])","button:not([disabled]):not([aria-hidden])","iframe","object","embed","[contenteditable]",'[tabindex]:not([tabindex^="-"])'],i=function(){function o(e){var n=e.targetModal,i=e.triggers,a=void 0===i?[]:i,r=e.onShow,s=void 0===r?function(){}:r,l=e.onClose,c=void 0===l?function(){}:l,d=e.openTrigger,u=void 0===d?"data-micromodal-trigger":d,f=e.closeTrigger,h=void 0===f?"data-micromodal-close":f,v=e.openClass,g=void 0===v?"is-open":v,m=e.disableScroll,b=void 0!==m&&m,y=e.disableFocus,p=void 0!==y&&y,w=e.awaitCloseAnimation,E=void 0!==w&&w,k=e.awaitOpenAnimation,M=void 0!==k&&k,A=e.debugMode,C=void 0!==A&&A;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o),this.modal=document.getElementById(n),this.config={debugMode:C,disableScroll:b,openTrigger:u,closeTrigger:h,openClass:g,onShow:s,onClose:c,awaitCloseAnimation:E,awaitOpenAnimation:M,disableFocus:p},a.length>0&&this.registerTriggers.apply(this,t(a)),this.onClick=this.onClick.bind(this),this.onKeydown=this.onKeydown.bind(this)}var i,a,r;return i=o,(a=[{key:"registerTriggers",value:function(){for(var e=this,t=arguments.length,o=new Array(t),n=0;n<t;n++)o[n]=arguments[n];o.filter(Boolean).forEach((function(t){t.addEventListener("click",(function(t){return e.showModal(t)}))}))}},{key:"showModal",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;if(this.activeElement=document.activeElement,this.modal.setAttribute("aria-hidden","false"),this.modal.classList.add(this.config.openClass),this.scrollBehaviour("disable"),this.addEventListeners(),this.config.awaitOpenAnimation){var o=function t(){e.modal.removeEventListener("animationend",t,!1),e.setFocusToFirstNode()};this.modal.addEventListener("animationend",o,!1)}else this.setFocusToFirstNode();this.config.onShow(this.modal,this.activeElement,t)}},{key:"closeModal",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=this.modal;if(this.modal.setAttribute("aria-hidden","true"),this.removeEventListeners(),this.scrollBehaviour("enable"),this.activeElement&&this.activeElement.focus&&this.activeElement.focus(),this.config.onClose(this.modal,this.activeElement,e),this.config.awaitCloseAnimation){var o=this.config.openClass;this.modal.addEventListener("animationend",(function e(){t.classList.remove(o),t.removeEventListener("animationend",e,!1)}),!1)}else t.classList.remove(this.config.openClass)}},{key:"closeModalById",value:function(e){this.modal=document.getElementById(e),this.modal&&this.closeModal()}},{key:"scrollBehaviour",value:function(e){if(this.config.disableScroll){var t=document.querySelector("body");switch(e){case"enable":Object.assign(t.style,{overflow:""});break;case"disable":Object.assign(t.style,{overflow:"hidden"})}}}},{key:"addEventListeners",value:function(){this.modal.addEventListener("touchstart",this.onClick),this.modal.addEventListener("click",this.onClick),document.addEventListener("keydown",this.onKeydown)}},{key:"removeEventListeners",value:function(){this.modal.removeEventListener("touchstart",this.onClick),this.modal.removeEventListener("click",this.onClick),document.removeEventListener("keydown",this.onKeydown)}},{key:"onClick",value:function(e){(e.target.hasAttribute(this.config.closeTrigger)||e.target.parentNode.hasAttribute(this.config.closeTrigger))&&(e.preventDefault(),e.stopPropagation(),this.closeModal(e))}},{key:"onKeydown",value:function(e){27===e.keyCode&&this.closeModal(e),9===e.keyCode&&this.retainFocus(e)}},{key:"getFocusableNodes",value:function(){var e=this.modal.querySelectorAll(n);return Array.apply(void 0,t(e))}},{key:"setFocusToFirstNode",value:function(){var e=this;if(!this.config.disableFocus){var t=this.getFocusableNodes();if(0!==t.length){var o=t.filter((function(t){return!t.hasAttribute(e.config.closeTrigger)}));o.length>0&&o[0].focus(),0===o.length&&t[0].focus()}}}},{key:"retainFocus",value:function(e){var t=this.getFocusableNodes();if(0!==t.length)if(t=t.filter((function(e){return null!==e.offsetParent})),this.modal.contains(document.activeElement)){var o=t.indexOf(document.activeElement);e.shiftKey&&0===o&&(t[t.length-1].focus(),e.preventDefault()),!e.shiftKey&&t.length>0&&o===t.length-1&&(t[0].focus(),e.preventDefault())}else t[0].focus()}}])&&e(i.prototype,a),r&&e(i,r),o}(),a=null,r=function(e){if(!document.getElementById(e))return console.warn("MicroModal: ❗Seems like you have missed %c'".concat(e,"'"),"background-color: #f8f9fa;color: #50596c;font-weight: bold;","ID somewhere in your code. Refer example below to resolve it."),console.warn("%cExample:","background-color: #f8f9fa;color: #50596c;font-weight: bold;",'<div class="modal" id="'.concat(e,'"></div>')),!1},s=function(e,t){if(function(e){e.length<=0&&(console.warn("MicroModal: ❗Please specify at least one %c'micromodal-trigger'","background-color: #f8f9fa;color: #50596c;font-weight: bold;","data attribute."),console.warn("%cExample:","background-color: #f8f9fa;color: #50596c;font-weight: bold;",'<a href="#" data-micromodal-trigger="my-modal"></a>'))}(e),!t)return!0;for(var o in t)r(o);return!0},{init:function(e){var o=Object.assign({},{openTrigger:"data-micromodal-trigger"},e),n=t(document.querySelectorAll("[".concat(o.openTrigger,"]"))),r=function(e,t){var o=[];return e.forEach((function(e){var n=e.attributes[t].value;void 0===o[n]&&(o[n]=[]),o[n].push(e)})),o}(n,o.openTrigger);if(!0!==o.debugMode||!1!==s(n,r))for(var l in r){var c=r[l];o.targetModal=l,o.triggers=t(c),a=new i(o)}},show:function(e,t){var o=t||{};o.targetModal=e,!0===o.debugMode&&!1===r(e)||(a&&a.removeEventListeners(),(a=new i(o)).showModal())},close:function(e){e?a.closeModalById(e):a.closeModal()}});"undefined"!=typeof window&&(window.MicroModal=l);/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (l);


/***/ }),

/***/ "./node_modules/simple-keyboard-layouts/build/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/simple-keyboard-layouts/build/index.js ***!
  \*************************************************************/
/***/ ((module) => {

/*!
 * 
 *   simple-keyboard-layouts v3.1.96
 *   https://github.com/hodgef/simple-keyboard-layouts
 *
 *   Copyright (c) Francisco Hodge (https://github.com/hodgef) and project contributors.
 *
 *   This source code is licensed under the MIT license found in the
 *   LICENSE file in the root directory of this source tree.
 *
 */
!function(t,a){ true?module.exports=a():0}(self,(function(){return function(){"use strict";var t={d:function(a,e){for(var s in e)t.o(e,s)&&!t.o(a,s)&&Object.defineProperty(a,s,{enumerable:!0,get:e[s]})},o:function(t,a){return Object.prototype.hasOwnProperty.call(t,a)},r:function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},a={};t.r(a),t.d(a,{default:function(){return D}});var e={layout:{default:["ذ 1 2 3 4 5 6 7 8 9 0 - = {bksp}","{tab} ض ص ث ق ف غ ع ه خ ح ج د \\","{lock} ش س ي ب ل ا ت ن م ك ط {enter}","{shift} ئ ء ؤ ر لا ى ة و ز ظ {shift}",".com @ {space}"],shift:["ّ ! @ # $ % ^ & * ) ( _ + {bksp}","{tab} َ ً ُ ٌ لإ إ ‘ ÷ × ؛ < > |",'{lock} ِ ٍ ] [ لأ أ ـ ، / : " {enter}',"{shift} ~ ْ } { لآ آ ’ , . ؟ {shift}",".com @ {space}"]}},s={layout:{default:["॥ ১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯ ০ - ৃ {bksp}","{tab} ৌ ৈ া ী ূ ব হ গ দ জ ড ়","ো ে ্ ি ু প ৰ ক ত চ ট {enter}","{shift} ং ম ন ৱ ল স , . য় {shift}",".com @ {space}"],shift:["! @ ( ) ঃ ঋ {bksp}","{tab} ঔ ঐ আ ঘ ঊ ভ ঙ ঘ ধ ঝ ঢ ঞ","ও এ অ ই উ ফ  খ থ ছ ছ ঠ {enter}","{shift} ঁ ণ শ ষ । য {shift}",".com @ {space}"]}},i={layout:{default:["ё ` 1 2 3 4 5 6 7 8 9 0 - = {bksp}","{tab} й ц у к е н г ш ў з х [ ] \\","{lock} ф ы в а п р о л д ж э ; ' {enter}","{shift} я ч с м і т ь б ю , . / {shift}",".com @ {space}"],shift:["Ё ~ ! @ # $ % ^ & * ( ) _ + {bksp}","{tab} Й Ц У К Е Н Г Ш Ў З Х { } |",'{lock} Ф Ы В А П Р О Л Д Ж Э : " {enter}',"{shift} Я Ч С М І Т Ь Б Ю < > ? {shift}",".com @ {space}"]}},n={layout:{default:["‌ ১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯ ০ - = {bksp}","{tab} স হ ে া ি ু ো ক গ ঙ য ং ্","{lock} অ ই উ ট ড ন ত দ প ; ' {enter}","{shift} ব ম চ জ র ল শ , . / {shift}",".com @ {space}"],shift:["‍ ! ্য ্র ৳ % । র্ × ( ) ঁ + {bksp}","{tab} ও ঔ ৈ ৃ ী ূ ৌ খ ঘ ঋ য় ৎ ঃ",'{lock} আ ঈ ঊ ঠ ঢ ণ থ ধ ফ : " {enter}',"{shift} ভ ঞ ছ ঝ ড় ঢ় ষ এ ঐ ? {shift}",".com @ {space}"]}},o={layout:{default:["ၐ ၁ ၂ ၃ ၄ ၅ ၆ ၇ ၈ ၉ ၀ - = {bksp}","{tab} ဆ တ န မ အ ပ က င သ စ ဟ ဩ ၏","{lock} ေ ် ိ ္ ါ ့ ျ ု ူ း ' {enter}","{shift} ဖ ထ ခ လ ဘ ည ာ , . / {shift}",".com @ {space}"],shift:["ဎ ဍ ၒ ဋ ၓ ၔ ၕ ရ * ( ) _ + {bksp}","{tab} ဈ ဝ ဣ ၎ ဤ ၌ ဥ ၍ ဿ ဏ ဧ ဪ ၑ",'{lock} ဗ ွ ီ ၤ ြ ံ ဲ ဒ ဓ ဂ " {enter}',"{shift} ဇ ဌ ဃ ဠ ယ ဉ ဦ ၊ ။ ? {shift}",".com @ {space}"]}},c={layout:{default:["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}","{tab} q w e r t y u i o p [ ] \\","{lock} a s d f g h j k l ; ' {enter}","{shift} z x c v b n m . - / {shift}",".com @ {space}"],shift:["~ ! @ # $ % ^ & * ) ( _ + {bksp}","{tab} Q W E R T Y U I O P { } |",'{lock} A S D F G H J K L : " {enter}',"{shift} Z X C V B N M < > ? {shift}",".com @ {space}"]},layoutCandidates:{a:"阿 啊 呵 腌 嗄 吖 锕",e:"额 阿 俄 恶 鹅 遏 鄂 厄 饿 峨 扼 娥 鳄 哦 蛾 噩 愕 讹 锷 垩 婀 鹗 萼 谔 莪 腭 锇 颚 呃 阏 屙 苊 轭",ai:"爱 埃 艾 碍 癌 哀 挨 矮 隘 蔼 唉 皑 哎 霭 捱 暧 嫒 嗳 瑷 嗌 锿 砹",ei:"诶",xi:"系 西 席 息 希 习 吸 喜 细 析 戏 洗 悉 锡 溪 惜 稀 袭 夕 洒 晰 昔 牺 腊 烯 熙 媳 栖 膝 隙 犀 蹊 硒 兮 熄 曦 禧 嬉 玺 奚 汐 徙 羲 铣 淅 嘻 歙 熹 矽 蟋 郗 唏 皙 隰 樨 浠 忾 蜥 檄 郄 翕 阋 鳃 舾 屣 葸 螅 咭 粞 觋 欷 僖 醯 鼷 裼 穸 饩 舄 禊 诶 菥 蓰",yi:"一 以 已 意 议 义 益 亿 易 医 艺 食 依 移 衣 异 伊 仪 宜 射 遗 疑 毅 谊 亦 疫 役 忆 抑 尾 乙 译 翼 蛇 溢 椅 沂 泄 逸 蚁 夷 邑 怡 绎 彝 裔 姨 熠 贻 矣 屹 颐 倚 诣 胰 奕 翌 疙 弈 轶 蛾 驿 壹 猗 臆 弋 铱 旖 漪 迤 佚 翊 诒 怿 痍 懿 饴 峄 揖 眙 镒 仡 黟 肄 咿 翳 挹 缢 呓 刈 咦 嶷 羿 钇 殪 荑 薏 蜴 镱 噫 癔 苡 悒 嗌 瘗 衤 佾 埸 圯 舣 酏 劓",an:"安 案 按 岸 暗 鞍 氨 俺 胺 铵 谙 庵 黯 鹌 桉 埯 犴 揞 厂 广",han:"厂 汉 韩 含 旱 寒 汗 涵 函 喊 憾 罕 焊 翰 邯 撼 瀚 憨 捍 酣 悍 鼾 邗 颔 蚶 晗 菡 旰 顸 犴 焓 撖",ang:"昂 仰 盎 肮",ao:"奥 澳 傲 熬 凹 鳌 敖 遨 鏖 袄 坳 翱 嗷 拗 懊 岙 螯 骜 獒 鏊 艹 媪 廒 聱",wa:"瓦 挖 娃 洼 袜 蛙 凹 哇 佤 娲 呙 腽",yu:"于 与 育 余 预 域 予 遇 奥 语 誉 玉 鱼 雨 渔 裕 愈 娱 欲 吁 舆 宇 羽 逾 豫 郁 寓 吾 狱 喻 御 浴 愉 禹 俞 邪 榆 愚 渝 尉 淤 虞 屿 峪 粥 驭 瑜 禺 毓 钰 隅 芋 熨 瘀 迂 煜 昱 汩 於 臾 盂 聿 竽 萸 妪 腴 圄 谕 觎 揄 龉 谀 俣 馀 庾 妤 瘐 鬻 欤 鹬 阈 嵛 雩 鹆 圉 蜮 伛 纡 窬 窳 饫 蓣 狳 肀 舁 蝓 燠",niu:"牛 纽 扭 钮 拗 妞 忸 狃",o:"哦 噢 喔",ba:"把 八 巴 拔 伯 吧 坝 爸 霸 罢 芭 跋 扒 叭 靶 疤 笆 耙 鲅 粑 岜 灞 钯 捌 菝 魃 茇",pa:"怕 帕 爬 扒 趴 琶 啪 葩 耙 杷 钯 筢",pi:"被 批 副 否 皮 坏 辟 啤 匹 披 疲 罢 僻 毗 坯 脾 譬 劈 媲 屁 琵 邳 裨 痞 癖 陂 丕 枇 噼 霹 吡 纰 砒 铍 淠 郫 埤 濞 睥 芘 蚍 圮 鼙 罴 蜱 疋 貔 仳 庀 擗 甓 陴",bi:"比 必 币 笔 毕 秘 避 闭 佛 辟 壁 弊 彼 逼 碧 鼻 臂 蔽 拂 泌 璧 庇 痹 毙 弼 匕 鄙 陛 裨 贲 敝 蓖 吡 篦 纰 俾 铋 毖 筚 荸 薜 婢 哔 跸 濞 秕 荜 愎 睥 妣 芘 箅 髀 畀 滗 狴 萆 嬖 襞 舭",bai:"百 白 败 摆 伯 拜 柏 佰 掰 呗 擘 捭 稗",bo:"波 博 播 勃 拨 薄 佛 伯 玻 搏 柏 泊 舶 剥 渤 卜 驳 簿 脖 膊 簸 菠 礴 箔 铂 亳 钵 帛 擘 饽 跛 钹 趵 檗 啵 鹁 擗 踣",bei:"北 被 备 倍 背 杯 勃 贝 辈 悲 碑 臂 卑 悖 惫 蓓 陂 钡 狈 呗 焙 碚 褙 庳 鞴 孛 鹎 邶 鐾",ban:"办 版 半 班 般 板 颁 伴 搬 斑 扮 拌 扳 瓣 坂 阪 绊 钣 瘢 舨 癍",pan:"判 盘 番 潘 攀 盼 拚 畔 胖 叛 拌 蹒 磐 爿 蟠 泮 袢 襻 丬",bin:"份 宾 频 滨 斌 彬 濒 殡 缤 鬓 槟 摈 膑 玢 镔 豳 髌 傧",bang:"帮 邦 彭 旁 榜 棒 膀 镑 绑 傍 磅 蚌 谤 梆 浜 蒡",pang:"旁 庞 乓 磅 螃 彷 滂 逄 耪",beng:"泵 崩 蚌 蹦 迸 绷 甭 嘣 甏 堋",bao:"报 保 包 宝 暴 胞 薄 爆 炮 饱 抱 堡 剥 鲍 曝 葆 瀑 豹 刨 褒 雹 孢 苞 煲 褓 趵 鸨 龅 勹",bu:"不 部 步 布 补 捕 堡 埔 卜 埠 簿 哺 怖 钚 卟 瓿 逋 晡 醭 钸",pu:"普 暴 铺 浦 朴 堡 葡 谱 埔 扑 仆 蒲 曝 瀑 溥 莆 圃 璞 濮 菩 蹼 匍 噗 氆 攵 镨 攴 镤",mian:"面 棉 免 绵 缅 勉 眠 冕 娩 腼 渑 湎 沔 黾 宀 眄",po:"破 繁 坡 迫 颇 朴 泊 婆 泼 魄 粕 鄱 珀 陂 叵 笸 泺 皤 钋 钷",fan:"反 范 犯 繁 饭 泛 翻 凡 返 番 贩 烦 拚 帆 樊 藩 矾 梵 蕃 钒 幡 畈 蘩 蹯 燔",fu:"府 服 副 负 富 复 福 夫 妇 幅 付 扶 父 符 附 腐 赴 佛 浮 覆 辅 傅 伏 抚 赋 辐 腹 弗 肤 阜 袱 缚 甫 氟 斧 孚 敷 俯 拂 俘 咐 腑 孵 芙 涪 釜 脯 茯 馥 宓 绂 讣 呋 罘 麸 蝠 匐 芾 蜉 跗 凫 滏 蝮 驸 绋 蚨 砩 桴 赙 菔 呒 趺 苻 拊 阝 鲋 怫 稃 郛 莩 幞 祓 艴 黻 黼 鳆",ben:"本 体 奔 苯 笨 夯 贲 锛 畚 坌",feng:"风 丰 封 峰 奉 凤 锋 冯 逢 缝 蜂 枫 疯 讽 烽 俸 沣 酆 砜 葑 唪",bian:"变 便 边 编 遍 辩 鞭 辨 贬 匾 扁 卞 汴 辫 砭 苄 蝙 鳊 弁 窆 笾 煸 褊 碥 忭 缏",pian:"便 片 篇 偏 骗 翩 扁 骈 胼 蹁 谝 犏 缏",zhen:"镇 真 针 圳 振 震 珍 阵 诊 填 侦 臻 贞 枕 桢 赈 祯 帧 甄 斟 缜 箴 疹 砧 榛 鸩 轸 稹 溱 蓁 胗 椹 朕 畛 浈",biao:"表 标 彪 镖 裱 飚 膘 飙 镳 婊 骠 飑 杓 髟 鳔 灬 瘭",piao:"票 朴 漂 飘 嫖 瓢 剽 缥 殍 瞟 骠 嘌 莩 螵",huo:"和 活 或 货 获 火 伙 惑 霍 祸 豁 嚯 藿 锪 蠖 钬 耠 镬 夥 灬 劐 攉",bie:"别 鳖 憋 瘪 蹩",min:"民 敏 闽 闵 皿 泯 岷 悯 珉 抿 黾 缗 玟 愍 苠 鳘",fen:"分 份 纷 奋 粉 氛 芬 愤 粪 坟 汾 焚 酚 吩 忿 棼 玢 鼢 瀵 偾 鲼",bing:"并 病 兵 冰 屏 饼 炳 秉 丙 摒 柄 槟 禀 枋 邴 冫",geng:"更 耕 颈 庚 耿 梗 埂 羹 哽 赓 绠 鲠",fang:"方 放 房 防 访 纺 芳 仿 坊 妨 肪 邡 舫 彷 枋 鲂 匚 钫",xian:"现 先 县 见 线 限 显 险 献 鲜 洗 宪 纤 陷 闲 贤 仙 衔 掀 咸 嫌 掺 羡 弦 腺 痫 娴 舷 馅 酰 铣 冼 涎 暹 籼 锨 苋 蚬 跹 岘 藓 燹 鹇 氙 莶 霰 跣 猃 彡 祆 筅",fou:"不 否 缶",ca:"拆 擦 嚓 礤",cha:"查 察 差 茶 插 叉 刹 茬 楂 岔 诧 碴 嚓 喳 姹 杈 汊 衩 搽 槎 镲 苴 檫 馇 锸 猹",cai:"才 采 财 材 菜 彩 裁 蔡 猜 踩 睬",can:"参 残 餐 灿 惨 蚕 掺 璨 惭 粲 孱 骖 黪",shen:"信 深 参 身 神 什 审 申 甚 沈 伸 慎 渗 肾 绅 莘 呻 婶 娠 砷 蜃 哂 椹 葚 吲 糁 渖 诜 谂 矧 胂",cen:"参 岑 涔",san:"三 参 散 伞 叁 糁 馓 毵",cang:"藏 仓 苍 沧 舱 臧 伧",zang:"藏 脏 葬 赃 臧 奘 驵",chen:"称 陈 沈 沉 晨 琛 臣 尘 辰 衬 趁 忱 郴 宸 谌 碜 嗔 抻 榇 伧 谶 龀 肜",cao:"草 操 曹 槽 糙 嘈 漕 螬 艚 屮",ce:"策 测 册 侧 厕 栅 恻",ze:"责 则 泽 择 侧 咋 啧 仄 箦 赜 笮 舴 昃 迮 帻",zhai:"债 择 齐 宅 寨 侧 摘 窄 斋 祭 翟 砦 瘵 哜",dao:"到 道 导 岛 倒 刀 盗 稻 蹈 悼 捣 叨 祷 焘 氘 纛 刂 帱 忉",ceng:"层 曾 蹭 噌",zha:"查 扎 炸 诈 闸 渣 咋 乍 榨 楂 札 栅 眨 咤 柞 喳 喋 铡 蚱 吒 怍 砟 揸 痄 哳 齄",chai:"差 拆 柴 钗 豺 侪 虿 瘥",ci:"次 此 差 词 辞 刺 瓷 磁 兹 慈 茨 赐 祠 伺 雌 疵 鹚 糍 呲 粢",zi:"资 自 子 字 齐 咨 滋 仔 姿 紫 兹 孜 淄 籽 梓 鲻 渍 姊 吱 秭 恣 甾 孳 訾 滓 锱 辎 趑 龇 赀 眦 缁 呲 笫 谘 嵫 髭 茈 粢 觜 耔",cuo:"措 错 磋 挫 搓 撮 蹉 锉 厝 嵯 痤 矬 瘥 脞 鹾",chan:"产 单 阐 崭 缠 掺 禅 颤 铲 蝉 搀 潺 蟾 馋 忏 婵 孱 觇 廛 谄 谗 澶 骣 羼 躔 蒇 冁",shan:"山 单 善 陕 闪 衫 擅 汕 扇 掺 珊 禅 删 膳 缮 赡 鄯 栅 煽 姗 跚 鳝 嬗 潸 讪 舢 苫 疝 掸 膻 钐 剡 蟮 芟 埏 彡 骟",zhan:"展 战 占 站 崭 粘 湛 沾 瞻 颤 詹 斩 盏 辗 绽 毡 栈 蘸 旃 谵 搌",xin:"新 心 信 辛 欣 薪 馨 鑫 芯 锌 忻 莘 昕 衅 歆 囟 忄 镡",lian:"联 连 练 廉 炼 脸 莲 恋 链 帘 怜 涟 敛 琏 镰 濂 楝 鲢 殓 潋 裢 裣 臁 奁 莶 蠊 蔹",chang:"场 长 厂 常 偿 昌 唱 畅 倡 尝 肠 敞 倘 猖 娼 淌 裳 徜 昶 怅 嫦 菖 鲳 阊 伥 苌 氅 惝 鬯",zhang:"长 张 章 障 涨 掌 帐 胀 彰 丈 仗 漳 樟 账 杖 璋 嶂 仉 瘴 蟑 獐 幛 鄣 嫜",chao:"超 朝 潮 炒 钞 抄 巢 吵 剿 绰 嘲 晁 焯 耖 怊",zhao:"着 照 招 找 召 朝 赵 兆 昭 肇 罩 钊 沼 嘲 爪 诏 濯 啁 棹 笊",zhou:"调 州 周 洲 舟 骤 轴 昼 宙 粥 皱 肘 咒 帚 胄 绉 纣 妯 啁 诌 繇 碡 籀 酎 荮",che:"车 彻 撤 尺 扯 澈 掣 坼 砗 屮",ju:"车 局 据 具 举 且 居 剧 巨 聚 渠 距 句 拒 俱 柜 菊 拘 炬 桔 惧 矩 鞠 驹 锯 踞 咀 瞿 枸 掬 沮 莒 橘 飓 疽 钜 趄 踽 遽 琚 龃 椐 苣 裾 榘 狙 倨 榉 苴 讵 雎 锔 窭 鞫 犋 屦 醵",cheng:"成 程 城 承 称 盛 抢 乘 诚 呈 净 惩 撑 澄 秤 橙 骋 逞 瞠 丞 晟 铛 埕 塍 蛏 柽 铖 酲 裎 枨",rong:"容 荣 融 绒 溶 蓉 熔 戎 榕 茸 冗 嵘 肜 狨 蝾",sheng:"生 声 升 胜 盛 乘 圣 剩 牲 甸 省 绳 笙 甥 嵊 晟 渑 眚",deng:"等 登 邓 灯 澄 凳 瞪 蹬 噔 磴 嶝 镫 簦 戥",zhi:"制 之 治 质 职 只 志 至 指 织 支 值 知 识 直 致 执 置 止 植 纸 拓 智 殖 秩 旨 址 滞 氏 枝 芝 脂 帜 汁 肢 挚 稚 酯 掷 峙 炙 栉 侄 芷 窒 咫 吱 趾 痔 蜘 郅 桎 雉 祉 郦 陟 痣 蛭 帙 枳 踯 徵 胝 栀 贽 祗 豸 鸷 摭 轵 卮 轾 彘 觯 絷 跖 埴 夂 黹 忮 骘 膣 踬",zheng:"政 正 证 争 整 征 郑 丁 症 挣 蒸 睁 铮 筝 拯 峥 怔 诤 狰 徵 钲",tang:"堂 唐 糖 汤 塘 躺 趟 倘 棠 烫 淌 膛 搪 镗 傥 螳 溏 帑 羰 樘 醣 螗 耥 铴 瑭",chi:"持 吃 池 迟 赤 驰 尺 斥 齿 翅 匙 痴 耻 炽 侈 弛 叱 啻 坻 眙 嗤 墀 哧 茌 豉 敕 笞 饬 踟 蚩 柢 媸 魑 篪 褫 彳 鸱 螭 瘛 眵 傺",shi:"是 时 实 事 市 十 使 世 施 式 势 视 识 师 史 示 石 食 始 士 失 适 试 什 泽 室 似 诗 饰 殖 释 驶 氏 硕 逝 湿 蚀 狮 誓 拾 尸 匙 仕 柿 矢 峙 侍 噬 嗜 栅 拭 嘘 屎 恃 轼 虱 耆 舐 莳 铈 谥 炻 豕 鲥 饣 螫 酾 筮 埘 弑 礻 蓍 鲺 贳",qi:"企 其 起 期 气 七 器 汽 奇 齐 启 旗 棋 妻 弃 揭 枝 歧 欺 骑 契 迄 亟 漆 戚 岂 稽 岐 琦 栖 缉 琪 泣 乞 砌 祁 崎 绮 祺 祈 凄 淇 杞 脐 麒 圻 憩 芪 伎 俟 畦 耆 葺 沏 萋 骐 鳍 綦 讫 蕲 屺 颀 亓 碛 柒 啐 汔 綮 萁 嘁 蛴 槭 欹 芑 桤 丌 蜞",chuai:"揣 踹 啜 搋 膪",tuo:"托 脱 拓 拖 妥 驼 陀 沱 鸵 驮 唾 椭 坨 佗 砣 跎 庹 柁 橐 乇 铊 沲 酡 鼍 箨 柝",duo:"多 度 夺 朵 躲 铎 隋 咄 堕 舵 垛 惰 哆 踱 跺 掇 剁 柁 缍 沲 裰 哚 隳",xue:"学 血 雪 削 薛 穴 靴 谑 噱 鳕 踅 泶 彐",chong:"重 种 充 冲 涌 崇 虫 宠 忡 憧 舂 茺 铳 艟",chou:"筹 抽 绸 酬 愁 丑 臭 仇 畴 稠 瞅 踌 惆 俦 瘳 雠 帱",qiu:"求 球 秋 丘 邱 仇 酋 裘 龟 囚 遒 鳅 虬 蚯 泅 楸 湫 犰 逑 巯 艽 俅 蝤 赇 鼽 糗",xiu:"修 秀 休 宿 袖 绣 臭 朽 锈 羞 嗅 岫 溴 庥 馐 咻 髹 鸺 貅",chu:"出 处 础 初 助 除 储 畜 触 楚 厨 雏 矗 橱 锄 滁 躇 怵 绌 搐 刍 蜍 黜 杵 蹰 亍 樗 憷 楮",tuan:"团 揣 湍 疃 抟 彖",zhui:"追 坠 缀 揣 椎 锥 赘 惴 隹 骓 缒",chuan:"传 川 船 穿 串 喘 椽 舛 钏 遄 氚 巛 舡",zhuan:"专 转 传 赚 砖 撰 篆 馔 啭 颛",yuan:"元 员 院 原 源 远 愿 园 援 圆 缘 袁 怨 渊 苑 宛 冤 媛 猿 垣 沅 塬 垸 鸳 辕 鸢 瑗 圜 爰 芫 鼋 橼 螈 眢 箢 掾",cuan:"窜 攒 篡 蹿 撺 爨 汆 镩",chuang:"创 床 窗 闯 幢 疮 怆",zhuang:"装 状 庄 壮 撞 妆 幢 桩 奘 僮 戆",chui:"吹 垂 锤 炊 椎 陲 槌 捶 棰",chun:"春 纯 醇 淳 唇 椿 蠢 鹑 朐 莼 肫 蝽",zhun:"准 屯 淳 谆 肫 窀",cu:"促 趋 趣 粗 簇 醋 卒 蹴 猝 蹙 蔟 殂 徂",dun:"吨 顿 盾 敦 蹲 墩 囤 沌 钝 炖 盹 遁 趸 砘 礅",qu:"区 去 取 曲 趋 渠 趣 驱 屈 躯 衢 娶 祛 瞿 岖 龋 觑 朐 蛐 癯 蛆 苣 阒 诎 劬 蕖 蘧 氍 黢 蠼 璩 麴 鸲 磲",xu:"需 许 续 须 序 徐 休 蓄 畜 虚 吁 绪 叙 旭 邪 恤 墟 栩 絮 圩 婿 戌 胥 嘘 浒 煦 酗 诩 朐 盱 蓿 溆 洫 顼 勖 糈 砉 醑",chuo:"辍 绰 戳 淖 啜 龊 踔 辶",zu:"组 族 足 祖 租 阻 卒 俎 诅 镞 菹",ji:"济 机 其 技 基 记 计 系 期 际 及 集 级 几 给 积 极 己 纪 即 继 击 既 激 绩 急 奇 吉 季 齐 疾 迹 鸡 剂 辑 籍 寄 挤 圾 冀 亟 寂 暨 脊 跻 肌 稽 忌 饥 祭 缉 棘 矶 汲 畸 姬 藉 瘠 骥 羁 妓 讥 稷 蓟 悸 嫉 岌 叽 伎 鲫 诘 楫 荠 戟 箕 霁 嵇 觊 麂 畿 玑 笈 犄 芨 唧 屐 髻 戢 佶 偈 笄 跽 蒺 乩 咭 赍 嵴 虮 掎 齑 殛 鲚 剞 洎 丌 墼 蕺 彐 芰 哜",cong:"从 丛 匆 聪 葱 囱 琮 淙 枞 骢 苁 璁",zong:"总 从 综 宗 纵 踪 棕 粽 鬃 偬 枞 腙",cou:"凑 辏 腠 楱",cui:"衰 催 崔 脆 翠 萃 粹 摧 璀 瘁 悴 淬 啐 隹 毳 榱",wei:"为 位 委 未 维 卫 围 违 威 伟 危 味 微 唯 谓 伪 慰 尾 魏 韦 胃 畏 帷 喂 巍 萎 蔚 纬 潍 尉 渭 惟 薇 苇 炜 圩 娓 诿 玮 崴 桅 偎 逶 倭 猥 囗 葳 隗 痿 猬 涠 嵬 韪 煨 艉 隹 帏 闱 洧 沩 隈 鲔 軎",cun:"村 存 寸 忖 皴",zuo:"作 做 座 左 坐 昨 佐 琢 撮 祚 柞 唑 嘬 酢 怍 笮 阼 胙",zuan:"钻 纂 攥 缵 躜",da:"大 达 打 答 搭 沓 瘩 惮 嗒 哒 耷 鞑 靼 褡 笪 怛 妲",dai:"大 代 带 待 贷 毒 戴 袋 歹 呆 隶 逮 岱 傣 棣 怠 殆 黛 甙 埭 诒 绐 玳 呔 迨",tai:"大 台 太 态 泰 抬 胎 汰 钛 苔 薹 肽 跆 邰 鲐 酞 骀 炱",ta:"他 它 她 拓 塔 踏 塌 榻 沓 漯 獭 嗒 挞 蹋 趿 遢 铊 鳎 溻 闼",dan:"但 单 石 担 丹 胆 旦 弹 蛋 淡 诞 氮 郸 耽 殚 惮 儋 眈 疸 澹 掸 膻 啖 箪 聃 萏 瘅 赕",lu:"路 六 陆 录 绿 露 鲁 卢 炉 鹿 禄 赂 芦 庐 碌 麓 颅 泸 卤 潞 鹭 辘 虏 璐 漉 噜 戮 鲈 掳 橹 轳 逯 渌 蓼 撸 鸬 栌 氇 胪 镥 簏 舻 辂 垆",tan:"谈 探 坦 摊 弹 炭 坛 滩 贪 叹 谭 潭 碳 毯 瘫 檀 痰 袒 坍 覃 忐 昙 郯 澹 钽 锬",ren:"人 任 认 仁 忍 韧 刃 纫 饪 妊 荏 稔 壬 仞 轫 亻 衽",jie:"家 结 解 价 界 接 节 她 届 介 阶 街 借 杰 洁 截 姐 揭 捷 劫 戒 皆 竭 桔 诫 楷 秸 睫 藉 拮 芥 诘 碣 嗟 颉 蚧 孑 婕 疖 桀 讦 疥 偈 羯 袷 哜 喈 卩 鲒 骱",yan:"研 严 验 演 言 眼 烟 沿 延 盐 炎 燕 岩 宴 艳 颜 殷 彦 掩 淹 阎 衍 铅 雁 咽 厌 焰 堰 砚 唁 焉 晏 檐 蜒 奄 俨 腌 妍 谚 兖 筵 焱 偃 闫 嫣 鄢 湮 赝 胭 琰 滟 阉 魇 酽 郾 恹 崦 芫 剡 鼹 菸 餍 埏 谳 讠 厣 罨",dang:"当 党 档 荡 挡 宕 砀 铛 裆 凼 菪 谠",tao:"套 讨 跳 陶 涛 逃 桃 萄 淘 掏 滔 韬 叨 洮 啕 绦 饕 鼗",tiao:"条 调 挑 跳 迢 眺 苕 窕 笤 佻 啁 粜 髫 铫 祧 龆 蜩 鲦",te:"特 忑 忒 铽 慝",de:"的 地 得 德 底 锝",dei:"得",di:"的 地 第 提 低 底 抵 弟 迪 递 帝 敌 堤 蒂 缔 滴 涤 翟 娣 笛 棣 荻 谛 狄 邸 嘀 砥 坻 诋 嫡 镝 碲 骶 氐 柢 籴 羝 睇 觌",ti:"体 提 题 弟 替 梯 踢 惕 剔 蹄 棣 啼 屉 剃 涕 锑 倜 悌 逖 嚏 荑 醍 绨 鹈 缇 裼",tui:"推 退 弟 腿 褪 颓 蜕 忒 煺",you:"有 由 又 优 游 油 友 右 邮 尤 忧 幼 犹 诱 悠 幽 佑 釉 柚 铀 鱿 囿 酉 攸 黝 莠 猷 蝣 疣 呦 蚴 莸 莜 铕 宥 繇 卣 牖 鼬 尢 蚰 侑",dian:"电 点 店 典 奠 甸 碘 淀 殿 垫 颠 滇 癫 巅 惦 掂 癜 玷 佃 踮 靛 钿 簟 坫 阽",tian:"天 田 添 填 甜 甸 恬 腆 佃 舔 钿 阗 忝 殄 畋 栝 掭",zhu:"主 术 住 注 助 属 逐 宁 著 筑 驻 朱 珠 祝 猪 诸 柱 竹 铸 株 瞩 嘱 贮 煮 烛 苎 褚 蛛 拄 铢 洙 竺 蛀 渚 伫 杼 侏 澍 诛 茱 箸 炷 躅 翥 潴 邾 槠 舳 橥 丶 瘃 麈 疰",nian:"年 念 酿 辗 碾 廿 捻 撵 拈 蔫 鲶 埝 鲇 辇 黏",diao:"调 掉 雕 吊 钓 刁 貂 凋 碉 鲷 叼 铫 铞",yao:"要 么 约 药 邀 摇 耀 腰 遥 姚 窑 瑶 咬 尧 钥 谣 肴 夭 侥 吆 疟 妖 幺 杳 舀 窕 窈 曜 鹞 爻 繇 徭 轺 铫 鳐 崾 珧",die:"跌 叠 蝶 迭 碟 爹 谍 牒 耋 佚 喋 堞 瓞 鲽 垤 揲 蹀",she:"设 社 摄 涉 射 折 舍 蛇 拾 舌 奢 慑 赦 赊 佘 麝 歙 畲 厍 猞 揲 滠",ye:"业 也 夜 叶 射 野 液 冶 喝 页 爷 耶 邪 咽 椰 烨 掖 拽 曳 晔 谒 腋 噎 揶 靥 邺 铘 揲",xie:"些 解 协 写 血 叶 谢 械 鞋 胁 斜 携 懈 契 卸 谐 泄 蟹 邪 歇 泻 屑 挟 燮 榭 蝎 撷 偕 亵 楔 颉 缬 邂 鲑 瀣 勰 榍 薤 绁 渫 廨 獬 躞",zhe:"这 者 着 著 浙 折 哲 蔗 遮 辙 辄 柘 锗 褶 蜇 蛰 鹧 谪 赭 摺 乇 磔 螫",ding:"定 订 顶 丁 鼎 盯 钉 锭 叮 仃 铤 町 酊 啶 碇 腚 疔 玎 耵",diu:"丢 铥",ting:"听 庭 停 厅 廷 挺 亭 艇 婷 汀 铤 烃 霆 町 蜓 葶 梃 莛",dong:"动 东 董 冬 洞 懂 冻 栋 侗 咚 峒 氡 恫 胴 硐 垌 鸫 岽 胨",tong:"同 通 统 童 痛 铜 桶 桐 筒 彤 侗 佟 潼 捅 酮 砼 瞳 恸 峒 仝 嗵 僮 垌 茼",zhong:"中 重 种 众 终 钟 忠 仲 衷 肿 踵 冢 盅 蚣 忪 锺 舯 螽 夂",dou:"都 斗 读 豆 抖 兜 陡 逗 窦 渎 蚪 痘 蔸 钭 篼",du:"度 都 独 督 读 毒 渡 杜 堵 赌 睹 肚 镀 渎 笃 竺 嘟 犊 妒 牍 蠹 椟 黩 芏 髑",duan:"断 段 短 端 锻 缎 煅 椴 簖",dui:"对 队 追 敦 兑 堆 碓 镦 怼 憝",rui:"瑞 兑 锐 睿 芮 蕊 蕤 蚋 枘",yue:"月 说 约 越 乐 跃 兑 阅 岳 粤 悦 曰 钥 栎 钺 樾 瀹 龠 哕 刖",tun:"吞 屯 囤 褪 豚 臀 饨 暾 氽",hui:"会 回 挥 汇 惠 辉 恢 徽 绘 毁 慧 灰 贿 卉 悔 秽 溃 荟 晖 彗 讳 诲 珲 堕 诙 蕙 晦 睢 麾 烩 茴 喙 桧 蛔 洄 浍 虺 恚 蟪 咴 隳 缋 哕",wu:"务 物 无 五 武 午 吴 舞 伍 污 乌 误 亡 恶 屋 晤 悟 吾 雾 芜 梧 勿 巫 侮 坞 毋 诬 呜 钨 邬 捂 鹜 兀 婺 妩 於 戊 鹉 浯 蜈 唔 骛 仵 焐 芴 鋈 庑 鼯 牾 怃 圬 忤 痦 迕 杌 寤 阢",ya:"亚 压 雅 牙 押 鸭 呀 轧 涯 崖 邪 芽 哑 讶 鸦 娅 衙 丫 蚜 碣 垭 伢 氩 桠 琊 揠 吖 睚 痖 疋 迓 岈 砑",he:"和 合 河 何 核 盖 贺 喝 赫 荷 盒 鹤 吓 呵 苛 禾 菏 壑 褐 涸 阂 阖 劾 诃 颌 嗬 貉 曷 翮 纥 盍",wo:"我 握 窝 沃 卧 挝 涡 斡 渥 幄 蜗 喔 倭 莴 龌 肟 硪",en:"恩 摁 蒽",n:"嗯 唔",er:"而 二 尔 儿 耳 迩 饵 洱 贰 铒 珥 佴 鸸 鲕",fa:"发 法 罚 乏 伐 阀 筏 砝 垡 珐",quan:"全 权 券 泉 圈 拳 劝 犬 铨 痊 诠 荃 醛 蜷 颧 绻 犭 筌 鬈 悛 辁 畎",fei:"费 非 飞 肥 废 菲 肺 啡 沸 匪 斐 蜚 妃 诽 扉 翡 霏 吠 绯 腓 痱 芾 淝 悱 狒 榧 砩 鲱 篚 镄",pei:"配 培 坏 赔 佩 陪 沛 裴 胚 妃 霈 淠 旆 帔 呸 醅 辔 锫",ping:"平 评 凭 瓶 冯 屏 萍 苹 乒 坪 枰 娉 俜 鲆",fo:"佛",hu:"和 护 许 户 核 湖 互 乎 呼 胡 戏 忽 虎 沪 糊 壶 葫 狐 蝴 弧 瑚 浒 鹄 琥 扈 唬 滹 惚 祜 囫 斛 笏 芴 醐 猢 怙 唿 戽 槲 觳 煳 鹕 冱 瓠 虍 岵 鹱 烀 轷",ga:"夹 咖 嘎 尬 噶 旮 伽 尕 钆 尜",ge:"个 合 各 革 格 歌 哥 盖 隔 割 阁 戈 葛 鸽 搁 胳 舸 疙 铬 骼 蛤 咯 圪 镉 颌 仡 硌 嗝 鬲 膈 纥 袼 搿 塥 哿 虼",ha:"哈 蛤 铪",xia:"下 夏 峡 厦 辖 霞 夹 虾 狭 吓 侠 暇 遐 瞎 匣 瑕 唬 呷 黠 硖 罅 狎 瘕 柙",gai:"改 该 盖 概 溉 钙 丐 芥 赅 垓 陔 戤",hai:"海 还 害 孩 亥 咳 骸 骇 氦 嗨 胲 醢",gan:"干 感 赶 敢 甘 肝 杆 赣 乾 柑 尴 竿 秆 橄 矸 淦 苷 擀 酐 绀 泔 坩 旰 疳 澉",gang:"港 钢 刚 岗 纲 冈 杠 缸 扛 肛 罡 戆 筻",jiang:"将 强 江 港 奖 讲 降 疆 蒋 姜 浆 匠 酱 僵 桨 绛 缰 犟 豇 礓 洚 茳 糨 耩",hang:"行 航 杭 巷 夯 吭 桁 沆 绗 颃",gong:"工 公 共 供 功 红 贡 攻 宫 巩 龚 恭 拱 躬 弓 汞 蚣 珙 觥 肱 廾",hong:"红 宏 洪 轰 虹 鸿 弘 哄 烘 泓 訇 蕻 闳 讧 荭 黉 薨",guang:"广 光 逛 潢 犷 胱 咣 桄",qiong:"穷 琼 穹 邛 茕 筇 跫 蛩 銎",gao:"高 告 搞 稿 膏 糕 镐 皋 羔 锆 杲 郜 睾 诰 藁 篙 缟 槁 槔",hao:"好 号 毫 豪 耗 浩 郝 皓 昊 皋 蒿 壕 灏 嚎 濠 蚝 貉 颢 嗥 薅 嚆",li:"理 力 利 立 里 李 历 例 离 励 礼 丽 黎 璃 厉 厘 粒 莉 梨 隶 栗 荔 沥 犁 漓 哩 狸 藜 罹 篱 鲤 砺 吏 澧 俐 骊 溧 砾 莅 锂 笠 蠡 蛎 痢 雳 俪 傈 醴 栎 郦 俚 枥 喱 逦 娌 鹂 戾 砬 唳 坜 疠 蜊 黧 猁 鬲 粝 蓠 呖 跞 疬 缡 鲡 鳢 嫠 詈 悝 苈 篥 轹",jia:"家 加 价 假 佳 架 甲 嘉 贾 驾 嫁 夹 稼 钾 挟 拮 迦 伽 颊 浃 枷 戛 荚 痂 颉 镓 笳 珈 岬 胛 袈 郏 葭 袷 瘕 铗 跏 蛱 恝 哿",luo:"落 罗 络 洛 逻 螺 锣 骆 萝 裸 漯 烙 摞 骡 咯 箩 珞 捋 荦 硌 雒 椤 镙 跞 瘰 泺 脶 猡 倮 蠃",ke:"可 科 克 客 刻 课 颗 渴 壳 柯 棵 呵 坷 恪 苛 咳 磕 珂 稞 瞌 溘 轲 窠 嗑 疴 蝌 岢 铪 颏 髁 蚵 缂 氪 骒 钶 锞",qia:"卡 恰 洽 掐 髂 袷 咭 葜",gei:"给",gen:"根 跟 亘 艮 哏 茛",hen:"很 狠 恨 痕 哏",gou:"构 购 够 句 沟 狗 钩 拘 勾 苟 垢 枸 篝 佝 媾 诟 岣 彀 缑 笱 鞲 觏 遘",kou:"口 扣 寇 叩 抠 佝 蔻 芤 眍 筘",gu:"股 古 顾 故 固 鼓 骨 估 谷 贾 姑 孤 雇 辜 菇 沽 咕 呱 锢 钴 箍 汩 梏 痼 崮 轱 鸪 牯 蛊 诂 毂 鹘 菰 罟 嘏 臌 觚 瞽 蛄 酤 牿 鲴",pai:"牌 排 派 拍 迫 徘 湃 俳 哌 蒎",gua:"括 挂 瓜 刮 寡 卦 呱 褂 剐 胍 诖 鸹 栝 呙",tou:"投 头 透 偷 愉 骰 亠",guai:"怪 拐 乖",kuai:"会 快 块 筷 脍 蒯 侩 浍 郐 蒉 狯 哙",guan:"关 管 观 馆 官 贯 冠 惯 灌 罐 莞 纶 棺 斡 矜 倌 鹳 鳏 盥 掼 涫",wan:"万 完 晚 湾 玩 碗 顽 挽 弯 蔓 丸 莞 皖 宛 婉 腕 蜿 惋 烷 琬 畹 豌 剜 纨 绾 脘 菀 芄 箢",ne:"呢 哪 呐 讷 疒",gui:"规 贵 归 轨 桂 柜 圭 鬼 硅 瑰 跪 龟 匮 闺 诡 癸 鳜 桧 皈 鲑 刽 晷 傀 眭 妫 炅 庋 簋 刿 宄 匦",jun:"军 均 俊 君 峻 菌 竣 钧 骏 龟 浚 隽 郡 筠 皲 麇 捃",jiong:"窘 炯 迥 炅 冂 扃",jue:"决 绝 角 觉 掘 崛 诀 獗 抉 爵 嚼 倔 厥 蕨 攫 珏 矍 蹶 谲 镢 鳜 噱 桷 噘 撅 橛 孓 觖 劂 爝",gun:"滚 棍 辊 衮 磙 鲧 绲 丨",hun:"婚 混 魂 浑 昏 棍 珲 荤 馄 诨 溷 阍",guo:"国 过 果 郭 锅 裹 帼 涡 椁 囗 蝈 虢 聒 埚 掴 猓 崞 蜾 呙 馘",hei:"黑 嘿 嗨",kan:"看 刊 勘 堪 坎 砍 侃 嵌 槛 瞰 阚 龛 戡 凵 莰",heng:"衡 横 恒 亨 哼 珩 桁 蘅",mo:"万 没 么 模 末 冒 莫 摩 墨 默 磨 摸 漠 脉 膜 魔 沫 陌 抹 寞 蘑 摹 蓦 馍 茉 嘿 谟 秣 蟆 貉 嫫 镆 殁 耱 嬷 麽 瘼 貊 貘",peng:"鹏 朋 彭 膨 蓬 碰 苹 棚 捧 亨 烹 篷 澎 抨 硼 怦 砰 嘭 蟛 堋",hou:"后 候 厚 侯 猴 喉 吼 逅 篌 糇 骺 後 鲎 瘊 堠",hua:"化 华 划 话 花 画 滑 哗 豁 骅 桦 猾 铧 砉",huai:"怀 坏 淮 徊 槐 踝",huan:"还 环 换 欢 患 缓 唤 焕 幻 痪 桓 寰 涣 宦 垸 洹 浣 豢 奂 郇 圜 獾 鲩 鬟 萑 逭 漶 锾 缳 擐",xun:"讯 训 迅 孙 寻 询 循 旬 巡 汛 勋 逊 熏 徇 浚 殉 驯 鲟 薰 荀 浔 洵 峋 埙 巽 郇 醺 恂 荨 窨 蕈 曛 獯",huang:"黄 荒 煌 皇 凰 慌 晃 潢 谎 惶 簧 璜 恍 幌 湟 蝗 磺 隍 徨 遑 肓 篁 鳇 蟥 癀",nai:"能 乃 奶 耐 奈 鼐 萘 氖 柰 佴 艿",luan:"乱 卵 滦 峦 鸾 栾 銮 挛 孪 脔 娈",qie:"切 且 契 窃 茄 砌 锲 怯 伽 惬 妾 趄 挈 郄 箧 慊",jian:"建 间 件 见 坚 检 健 监 减 简 艰 践 兼 鉴 键 渐 柬 剑 尖 肩 舰 荐 箭 浅 剪 俭 碱 茧 奸 歼 拣 捡 煎 贱 溅 槛 涧 堑 笺 谏 饯 锏 缄 睑 謇 蹇 腱 菅 翦 戬 毽 笕 犍 硷 鞯 牮 枧 湔 鲣 囝 裥 踺 搛 缣 鹣 蒹 谫 僭 戋 趼 楗",nan:"南 难 男 楠 喃 囡 赧 腩 囝 蝻",qian:"前 千 钱 签 潜 迁 欠 纤 牵 浅 遣 谦 乾 铅 歉 黔 谴 嵌 倩 钳 茜 虔 堑 钎 骞 阡 掮 钤 扦 芊 犍 荨 仟 芡 悭 缱 佥 愆 褰 凵 肷 岍 搴 箝 慊 椠",qiang:"强 抢 疆 墙 枪 腔 锵 呛 羌 蔷 襁 羟 跄 樯 戕 嫱 戗 炝 镪 锖 蜣",xiang:"向 项 相 想 乡 象 响 香 降 像 享 箱 羊 祥 湘 详 橡 巷 翔 襄 厢 镶 飨 饷 缃 骧 芗 庠 鲞 葙 蟓",jiao:"教 交 较 校 角 觉 叫 脚 缴 胶 轿 郊 焦 骄 浇 椒 礁 佼 蕉 娇 矫 搅 绞 酵 剿 嚼 饺 窖 跤 蛟 侥 狡 姣 皎 茭 峤 铰 醮 鲛 湫 徼 鹪 僬 噍 艽 挢 敫",zhuo:"着 著 缴 桌 卓 捉 琢 灼 浊 酌 拙 茁 涿 镯 淖 啄 濯 焯 倬 擢 斫 棹 诼 浞 禚",qiao:"桥 乔 侨 巧 悄 敲 俏 壳 雀 瞧 翘 窍 峭 锹 撬 荞 跷 樵 憔 鞘 橇 峤 诮 谯 愀 鞒 硗 劁 缲",xiao:"小 效 销 消 校 晓 笑 肖 削 孝 萧 俏 潇 硝 宵 啸 嚣 霄 淆 哮 筱 逍 姣 箫 骁 枭 哓 绡 蛸 崤 枵 魈",si:"司 四 思 斯 食 私 死 似 丝 饲 寺 肆 撕 泗 伺 嗣 祀 厮 驷 嘶 锶 俟 巳 蛳 咝 耜 笥 纟 糸 鸶 缌 澌 姒 汜 厶 兕",kai:"开 凯 慨 岂 楷 恺 揩 锴 铠 忾 垲 剀 锎 蒈",jin:"进 金 今 近 仅 紧 尽 津 斤 禁 锦 劲 晋 谨 筋 巾 浸 襟 靳 瑾 烬 缙 钅 矜 觐 堇 馑 荩 噤 廑 妗 槿 赆 衿 卺",qin:"亲 勤 侵 秦 钦 琴 禽 芹 沁 寝 擒 覃 噙 矜 嗪 揿 溱 芩 衾 廑 锓 吣 檎 螓",jing:"经 京 精 境 竞 景 警 竟 井 惊 径 静 劲 敬 净 镜 睛 晶 颈 荆 兢 靖 泾 憬 鲸 茎 腈 菁 胫 阱 旌 粳 靓 痉 箐 儆 迳 婧 肼 刭 弪 獍",ying:"应 营 影 英 景 迎 映 硬 盈 赢 颖 婴 鹰 荧 莹 樱 瑛 蝇 萦 莺 颍 膺 缨 瀛 楹 罂 荥 萤 鹦 滢 蓥 郢 茔 嘤 璎 嬴 瘿 媵 撄 潆",jiu:"就 究 九 酒 久 救 旧 纠 舅 灸 疚 揪 咎 韭 玖 臼 柩 赳 鸠 鹫 厩 啾 阄 桕 僦 鬏",zui:"最 罪 嘴 醉 咀 蕞 觜",juan:"卷 捐 圈 眷 娟 倦 绢 隽 镌 涓 鹃 鄄 蠲 狷 锩 桊",suan:"算 酸 蒜 狻",yun:"员 运 云 允 孕 蕴 韵 酝 耘 晕 匀 芸 陨 纭 郧 筠 恽 韫 郓 氲 殒 愠 昀 菀 狁",qun:"群 裙 逡 麇",ka:"卡 喀 咖 咔 咯 佧 胩",kang:"康 抗 扛 慷 炕 亢 糠 伉 钪 闶",keng:"坑 铿 吭",kao:"考 靠 烤 拷 铐 栲 尻 犒",ken:"肯 垦 恳 啃 龈 裉",yin:"因 引 银 印 音 饮 阴 隐 姻 殷 淫 尹 荫 吟 瘾 寅 茵 圻 垠 鄞 湮 蚓 氤 胤 龈 窨 喑 铟 洇 狺 夤 廴 吲 霪 茚 堙",kong:"空 控 孔 恐 倥 崆 箜",ku:"苦 库 哭 酷 裤 枯 窟 挎 骷 堀 绔 刳 喾",kua:"跨 夸 垮 挎 胯 侉",kui:"亏 奎 愧 魁 馈 溃 匮 葵 窥 盔 逵 睽 馗 聩 喟 夔 篑 岿 喹 揆 隗 傀 暌 跬 蒉 愦 悝 蝰",kuan:"款 宽 髋",kuang:"况 矿 框 狂 旷 眶 匡 筐 邝 圹 哐 贶 夼 诳 诓 纩",que:"确 却 缺 雀 鹊 阙 瘸 榷 炔 阕 悫",kun:"困 昆 坤 捆 琨 锟 鲲 醌 髡 悃 阃",kuo:"扩 括 阔 廓 蛞",la:"拉 落 垃 腊 啦 辣 蜡 喇 剌 旯 砬 邋 瘌",lai:"来 莱 赖 睐 徕 籁 涞 赉 濑 癞 崃 疠 铼",lan:"兰 览 蓝 篮 栏 岚 烂 滥 缆 揽 澜 拦 懒 榄 斓 婪 阑 褴 罱 啉 谰 镧 漤",lin:"林 临 邻 赁 琳 磷 淋 麟 霖 鳞 凛 拎 遴 蔺 吝 粼 嶙 躏 廪 檩 啉 辚 膦 瞵 懔",lang:"浪 朗 郎 廊 狼 琅 榔 螂 阆 锒 莨 啷 蒗 稂",liang:"量 两 粮 良 辆 亮 梁 凉 谅 粱 晾 靓 踉 莨 椋 魉 墚",lao:"老 劳 落 络 牢 捞 涝 烙 姥 佬 崂 唠 酪 潦 痨 醪 铑 铹 栳 耢",mu:"目 模 木 亩 幕 母 牧 莫 穆 姆 墓 慕 牟 牡 募 睦 缪 沐 暮 拇 姥 钼 苜 仫 毪 坶",le:"了 乐 勒 肋 叻 鳓 嘞 仂 泐",lei:"类 累 雷 勒 泪 蕾 垒 磊 擂 镭 肋 羸 耒 儡 嫘 缧 酹 嘞 诔 檑",sui:"随 岁 虽 碎 尿 隧 遂 髓 穗 绥 隋 邃 睢 祟 濉 燧 谇 眭 荽",lie:"列 烈 劣 裂 猎 冽 咧 趔 洌 鬣 埒 捩 躐",leng:"冷 愣 棱 楞 塄",ling:"领 令 另 零 灵 龄 陵 岭 凌 玲 铃 菱 棱 伶 羚 苓 聆 翎 泠 瓴 囹 绫 呤 棂 蛉 酃 鲮 柃",lia:"俩",liao:"了 料 疗 辽 廖 聊 寥 缪 僚 燎 缭 撂 撩 嘹 潦 镣 寮 蓼 獠 钌 尥 鹩",liu:"流 刘 六 留 柳 瘤 硫 溜 碌 浏 榴 琉 馏 遛 鎏 骝 绺 镏 旒 熘 鹨 锍",lun:"论 轮 伦 仑 纶 沦 抡 囵",lv:"率 律 旅 绿 虑 履 吕 铝 屡 氯 缕 滤 侣 驴 榈 闾 偻 褛 捋 膂 稆",lou:"楼 露 漏 陋 娄 搂 篓 喽 镂 偻 瘘 髅 耧 蝼 嵝 蒌",mao:"贸 毛 矛 冒 貌 茂 茅 帽 猫 髦 锚 懋 袤 牦 卯 铆 耄 峁 瑁 蟊 茆 蝥 旄 泖 昴 瞀",long:"龙 隆 弄 垄 笼 拢 聋 陇 胧 珑 窿 茏 咙 砻 垅 泷 栊 癃",nong:"农 浓 弄 脓 侬 哝",shuang:"双 爽 霜 孀 泷",shu:"术 书 数 属 树 输 束 述 署 朱 熟 殊 蔬 舒 疏 鼠 淑 叔 暑 枢 墅 俞 曙 抒 竖 蜀 薯 梳 戍 恕 孰 沭 赎 庶 漱 塾 倏 澍 纾 姝 菽 黍 腧 秫 毹 殳 疋 摅",shuai:"率 衰 帅 摔 甩 蟀",lve:"略 掠 锊",ma:"么 马 吗 摩 麻 码 妈 玛 嘛 骂 抹 蚂 唛 蟆 犸 杩",me:"么 麽",mai:"买 卖 麦 迈 脉 埋 霾 荬 劢",man:"满 慢 曼 漫 埋 蔓 瞒 蛮 鳗 馒 幔 谩 螨 熳 缦 镘 颟 墁 鞔",mi:"米 密 秘 迷 弥 蜜 谜 觅 靡 泌 眯 麋 猕 谧 咪 糜 宓 汨 醚 嘧 弭 脒 冖 幂 祢 縻 蘼 芈 糸 敉",men:"们 门 闷 瞒 汶 扪 焖 懑 鞔 钔",mang:"忙 盲 茫 芒 氓 莽 蟒 邙 硭 漭",meng:"蒙 盟 梦 猛 孟 萌 氓 朦 锰 檬 勐 懵 蟒 蜢 虻 黾 蠓 艨 甍 艋 瞢 礞",miao:"苗 秒 妙 描 庙 瞄 缪 渺 淼 藐 缈 邈 鹋 杪 眇 喵",mou:"某 谋 牟 缪 眸 哞 鍪 蛑 侔 厶",miu:"缪 谬",mei:"美 没 每 煤 梅 媒 枚 妹 眉 魅 霉 昧 媚 玫 酶 镁 湄 寐 莓 袂 楣 糜 嵋 镅 浼 猸 鹛",wen:"文 问 闻 稳 温 纹 吻 蚊 雯 紊 瘟 汶 韫 刎 璺 玟 阌",mie:"灭 蔑 篾 乜 咩 蠛",ming:"明 名 命 鸣 铭 冥 茗 溟 酩 瞑 螟 暝",na:"内 南 那 纳 拿 哪 娜 钠 呐 捺 衲 镎 肭",nei:"内 那 哪 馁",nuo:"难 诺 挪 娜 糯 懦 傩 喏 搦 锘",ruo:"若 弱 偌 箬",nang:"囊 馕 囔 曩 攮",nao:"脑 闹 恼 挠 瑙 淖 孬 垴 铙 桡 呶 硇 猱 蛲",ni:"你 尼 呢 泥 疑 拟 逆 倪 妮 腻 匿 霓 溺 旎 昵 坭 铌 鲵 伲 怩 睨 猊",nen:"嫩 恁",neng:"能",nin:"您 恁",niao:"鸟 尿 溺 袅 脲 茑 嬲",nie:"摄 聂 捏 涅 镍 孽 捻 蘖 啮 蹑 嗫 臬 镊 颞 乜 陧",niang:"娘 酿",ning:"宁 凝 拧 泞 柠 咛 狞 佞 聍 甯",nu:"努 怒 奴 弩 驽 帑 孥 胬",nv:"女 钕 衄 恧",ru:"入 如 女 乳 儒 辱 汝 茹 褥 孺 濡 蠕 嚅 缛 溽 铷 洳 薷 襦 颥 蓐",nuan:"暖",nve:"虐 疟",re:"热 若 惹 喏",ou:"区 欧 偶 殴 呕 禺 藕 讴 鸥 瓯 沤 耦 怄",pao:"跑 炮 泡 抛 刨 袍 咆 疱 庖 狍 匏 脬",pou:"剖 掊 裒",pen:"喷 盆 湓",pie:"瞥 撇 苤 氕 丿",pin:"品 贫 聘 频 拼 拚 颦 姘 嫔 榀 牝",se:"色 塞 瑟 涩 啬 穑 铯 槭",qing:"情 青 清 请 亲 轻 庆 倾 顷 卿 晴 氢 擎 氰 罄 磬 蜻 箐 鲭 綮 苘 黥 圊 檠 謦",zan:"赞 暂 攒 堑 昝 簪 糌 瓒 錾 趱 拶",shao:"少 绍 召 烧 稍 邵 哨 韶 捎 勺 梢 鞘 芍 苕 劭 艄 筲 杓 潲",sao:"扫 骚 嫂 梢 缫 搔 瘙 臊 埽 缲 鳋",sha:"沙 厦 杀 纱 砂 啥 莎 刹 杉 傻 煞 鲨 霎 嗄 痧 裟 挲 铩 唼 歃",xuan:"县 选 宣 券 旋 悬 轩 喧 玄 绚 渲 璇 炫 萱 癣 漩 眩 暄 煊 铉 楦 泫 谖 痃 碹 揎 镟 儇",ran:"然 染 燃 冉 苒 髯 蚺",rang:"让 壤 攘 嚷 瓤 穰 禳",rao:"绕 扰 饶 娆 桡 荛",reng:"仍 扔",ri:"日",rou:"肉 柔 揉 糅 鞣 蹂",ruan:"软 阮 朊",run:"润 闰",sa:"萨 洒 撒 飒 卅 仨 脎",suo:"所 些 索 缩 锁 莎 梭 琐 嗦 唆 唢 娑 蓑 羧 挲 桫 嗍 睃",sai:"思 赛 塞 腮 噻 鳃",shui:"说 水 税 谁 睡 氵",sang:"桑 丧 嗓 搡 颡 磉",sen:"森",seng:"僧",shai:"筛 晒",shang:"上 商 尚 伤 赏 汤 裳 墒 晌 垧 觞 殇 熵 绱",xing:"行 省 星 腥 猩 惺 兴 刑 型 形 邢 饧 醒 幸 杏 性 姓 陉 荇 荥 擤 悻 硎",shou:"收 手 受 首 售 授 守 寿 瘦 兽 狩 绶 艏 扌",shuo:"说 数 硕 烁 朔 铄 妁 槊 蒴 搠",su:"速 素 苏 诉 缩 塑 肃 俗 宿 粟 溯 酥 夙 愫 簌 稣 僳 谡 涑 蔌 嗉 觫",shua:"刷 耍 唰",shuan:"栓 拴 涮 闩",shun:"顺 瞬 舜 吮",song:"送 松 宋 讼 颂 耸 诵 嵩 淞 怂 悚 崧 凇 忪 竦 菘",sou:"艘 搜 擞 嗽 嗖 叟 馊 薮 飕 嗾 溲 锼 螋 瞍",sun:"损 孙 笋 荪 榫 隼 狲 飧",teng:"腾 疼 藤 滕 誊",tie:"铁 贴 帖 餮 萜",tu:"土 突 图 途 徒 涂 吐 屠 兔 秃 凸 荼 钍 菟 堍 酴",wai:"外 歪 崴",wang:"王 望 往 网 忘 亡 旺 汪 枉 妄 惘 罔 辋 魍",weng:"翁 嗡 瓮 蓊 蕹",zhua:"抓 挝 爪",yang:"样 养 央 阳 洋 扬 杨 羊 详 氧 仰 秧 痒 漾 疡 泱 殃 恙 鸯 徉 佯 怏 炀 烊 鞅 蛘",xiong:"雄 兄 熊 胸 凶 匈 汹 芎",yo:"哟 唷",yong:"用 永 拥 勇 涌 泳 庸 俑 踊 佣 咏 雍 甬 镛 臃 邕 蛹 恿 慵 壅 痈 鳙 墉 饔 喁",za:"杂 扎 咱 砸 咋 匝 咂 拶",zai:"在 再 灾 载 栽 仔 宰 哉 崽 甾",zao:"造 早 遭 枣 噪 灶 燥 糟 凿 躁 藻 皂 澡 蚤 唣",zei:"贼",zen:"怎 谮",zeng:"增 曾 综 赠 憎 锃 甑 罾 缯",zhei:"这",zou:"走 邹 奏 揍 诹 驺 陬 楱 鄹 鲰",zhuai:"转 拽",zun:"尊 遵 鳟 樽 撙",dia:"嗲",nou:"耨"}},h={layout:{default:["; + ě š č ř ž ý á í é ´ {bksp}","{tab} q w e r t y u i o p ú ) ¨","{lock} a s d f g h j k l ů § {enter}","{shift} \\ z x c v b n m , . - {shift}",".com @ {space}"],shift:["° 1 2 3 4 5 6 7 8 9 0 % ˇ {bksp}","{tab} Q W E R T Y U I O P / ( '",'{lock} A S D F G H J K L " ! {enter}',"{shift} | Z X C V B N M ? : _ {shift}",".com @ {space}"]}},f={layout:{default:["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}","{tab} q w e r t y u i o p [ ] \\","{lock} a s d f g h j k l ; ' {enter}","{shift} z x c v b n m , . / {shift}",".com @ {space}"],shift:["~ ! @ # $ % ^ & * ( ) _ + {bksp}","{tab} Q W E R T Y U I O P { } |",'{lock} A S D F G H J K L : " {enter}',"{shift} Z X C V B N M < > ? {shift}",".com @ {space}"]}},u={layout:{default:["` ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹ ۰ - = {bksp}","{tab} ض ص ث ق ف غ ع ه خ ح ج چ \\","{lock} ش س ی ب ل ا ت ن م ک گ {enter}","{shift} ظ ط ز ر ذ د پ و . / {shift}",".com @ {space}"],shift:["÷ ! ٬ ٫ ﷼ ٪ × ۷ * ) ( ـ + {bksp}","{tab} ْ ٌ ٍ ً ُ ِ َ ّ ] [ } {","{lock} ؤ ئ ي إ أ آ ة » « : ؛ {enter}","{shift} ك ٓ ژ ٰ ‌ ٔ ء < > ؟ {shift}",".com @ {space}"]}},l={layout:{default:["` 1 2 3 4 5 6 7 8 9 0 ° + {bksp}","{tab} a z e r t y u i o p ^ $","{lock} q s d f g h j k l m ù * {enter}","{shift} < w x c v b n , ; : ! {shift}",".com @ {space}"],shift:["² & é \" ' ( - è _ ç à ) = {bksp}","{tab} A Z E R T Y U I O P ¨ £","{lock} Q S D F G H J K L M % µ {enter}","{shift} > W X C V B N ? . / § {shift}",".com @ {space}"]}},b={layout:{default:["„ 1 2 3 4 5 6 7 8 9 0 - = {bksp}","{tab} ქ წ ე რ ტ ყ უ ი ო პ [ ] \\","{lock} ა ს დ ფ გ ჰ ჯ კ ლ ; ' {enter}","{shift} ზ ხ ც ვ ბ ნ მ , . / {shift}",".com @ {space}"],shift:["“ ! @ # $ % ^ & * ( ) _ + {bksp}","{tab} ქ ჭ ე ღ თ ყ უ ი ო პ { } | ~",'{lock} ა შ დ ფ გ ჰ ჟ კ ₾ : " {enter}',"{shift} ძ ხ ჩ ვ ბ ნ მ < > ? {shift}",".com @ {space}"]}},p={layout:{default:["^ 1 2 3 4 5 6 7 8 9 0 ß ´ {bksp}","{tab} q w e r t z u i o p ü +","{lock} a s d f g h j k l ö ä # {enter}","{shift} < y x c v b n m , . - {shift}",".com @ {space}"],shift:['° ! " § $ % & / ( ) = ? ` {bksp}',"{tab} Q W E R T Z U I O P Ü *","{lock} A S D F G H J K L Ö Ä ' {enter}","{shift} > Y X C V B N M ; : _ {shift}",".com @ {space}"]}},r={layout:{default:["ٚ ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹ ۰ - = {bksp}","{tab} ض ص ئ ق ف غ ع ه خ ح ج چ أ","{lock} ش س ي ب ل ا ت ن م ک گ {enter}","{shift} ؤ ۊ ز ر ذ د پ و . / {shift}",".com @ {space}"],shift:["ˇ ! @ # ﷼ ٪ × ، * ) ( ـ + {bksp}","{tab} ك ة ث َ ^ ° ُ ÷ ] [ } { ٰ","{lock} ۋ ً ی ِ ' آ ى , \\ : ؛ {enter}",'{shift} ظ ط ژ " ٔ » « < > ؟ {shift}',".com @ {space}"]}},k={layout:{default:["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}","{tab} ; ς ε ρ τ υ θ ι ο π [ ] \\","{lock} α σ δ φ γ η ξ κ λ ΄ ' {enter}","{shift} < ζ χ ψ ω β ν μ , . / {shift}",".com @ {space}"],shift:["~ ! @ # $ % ^ & * ( ) _ + {bksp}","{tab} : ΅ Ε Ρ Τ Υ Θ Ι Ο Π { } |",'{lock} Α Σ Δ Φ Γ Η Ξ Κ Λ ¨ " {enter}',"{shift} > Ζ Χ Ψ Ω Β Ν Μ < > ? {shift}",".com @ {space}"]}},g={layout:{default:[" 1 2 3 4 5 6 7 8 9 0 - = {bksp}","{tab} / ' ק ר א ט ו ן ם פ ] [ :","{lock} ש ד ג כ ע י ח ל ך ף , {enter}","{shift} ז ס ב ה נ מ צ ת ץ . {shift}",".com @ {space}"],shift:["~ ! @ # $ % ^ & * ( ) _ + {bksp}","{tab} Q W E R T Y U I O P { } |",'{lock} A S D F G H J K L : " {enter}',"{shift} Z X C V B N M < > ? {shift}",".com @ {space}"]}},m={layout:{default:["` ऍ ॅ ्र र् ज्ञ त्र क्ष श्र ९ ० - ृ {bksp}","{tab} ौ ै ा ी ू ब ह ग द ज ड ़ ॉ \\","{lock} ो े ् ि ु प र क त च ट {enter}","{shift} ं म न व ल स , . य {shift}",".com @ {space}"],shift:["~ १ २ ३ ४ ५ ६ ७ ८ ९ ० ः ऋ {bksp}","{tab} औ ऐ आ ई ऊ भ ङ घ ध झ ढ ञ ऑ","{lock} ओ ए अ इ उ फ ऱ ख थ छ ठ {enter}",'{shift} "" ँ ण न व ळ श ष । य़ {shift}',".com @ {space}"]}},d={layout:{default:["0 1 2 3 4 5 6 7 8 9 ö ü ó {bksp}","{tab} q w e r t z u i o p ő ú","{lock} a s d f g h j k l é á ű {enter}","{shift} í y x c v b n m , . - {shift}",".com @ {space}"],shift:["§ ' \" + ! % / = ( ) Ö Ü Ó {bksp}","{tab} Q W E R T Z U I O P Ő Ú","{lock} A S D F G H J K L É Á Ű {enter}","{shift} Í Y X C V B N M ? : _ {shift}",".com @ {space}"]}},y={layout:{default:["\\ 1 2 3 4 5 6 7 8 9 0 ' ì {bksp}","{tab} q w e r t y u i o p è +","{lock} a s d f g h j k l ò à ù {enter}","{shift} < z x c v b n m , . - {shift}",".com @ {space}"],shift:['| ! " £ $ % & / ( ) = ? ^ {bksp}',"{tab} Q W E R T Y U I O P é *","{lock} A S D F G H J K L ç ° § {enter}","{shift} > Z X C V B N M ; : _ {shift}",".com @ {space}"]}},z={layout:{default:["1 2 3 4 5 6 7 8 9 0 - ^ ¥ {bksp}","{tab} た て い す か ん な に ら せ ゛ ゜ む","{lock} ち と し は き く ま の り れ け {enter}","{shift} つ さ そ ひ こ み も ね る め {shift}",".com @ {space}"],shift:["! \" # $ % & ' ( ) ́ = ~ | {bksp}","{tab} た て ぃ す か ん な に ら せ 「 」 む","{lock} ち と し は き く ま の り れ け {enter}","{shift} っ さ そ ひ こ み も 、 。 ・ {shift}",".com @ {space}"]}},j={layout:{default:["ೊ 1 2 3 4 5 6 7 8 9 0 - ೃ {bksp}","{tab} ೌ ೈ ಾ ೀ ೂ ಬ ಹ ಗ ದ ಜ ಡ","ೋ ೇ ್ ಿ ು ಪ ರ ಕ ತ ಚ ಟ {enter}","{shift} ೆ ಂ ಮ ನ ವ ಲ ಸ , . / {shift}",".com @ {space}"],shift:["ಒ ್ರ ರ್ ಜ್ಞ ತ್ರ ಕ್ಷ ಶ್ರ ( ) ಃ ಋ {bksp}","{tab} ಔ ಐ ಆ ಈ ಊ ಭ ಙ ಘ ಧ ಝ ಢ ಞ","ಓ ಏ ಅ ಇ ಉ ಫ ಱ ಖ ಥ ಛ ಠ {enter}","{shift} ಎ ಣ ಳ ಶ ಷ | / {shift}",".com @ {space}"]}},w={layout:{default:["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}","{tab} ᄇ ᄌ ᄃ ᄀ ᄉ ᅭ ᅧ ᅣ ᅢ ᅦ [ ] \\","{lock} ᄆ ᄂ ᄋ ᄅ ᄒ ᅩ ᅥ ᅡ ᅵ ; ' {enter}","{shift} ᄏ ᄐ ᄎ ᄑ ᅲ ᅮ ᅳ , . / {shift}",".com @ {space}"],shift:["~ ! @ # $ % ^ & * ( ) _ + {bksp}","{tab} ᄈ ᄍ ᄄ ᄁ ᄊ ᅭ ᅧ ᅣ ᅤ ᅨ { } |",'{lock} ᄆ ᄂ ᄋ ᄅ ᄒ ᅩ ᅥ ᅡ ᅵ : " {enter}',"{shift} ᄏ ᄐ ᄎ ᄑ ᅲ ᅮ ᅳ < > ? {shift}",".com @ {space}"]},layoutCandidates:{"가":"가","가ᄀ":"각","가ᄁ":"갂","가ᄀᄉ":"갃","가ᄂ":"간","가ᄂᄌ":"갅","가ᄂᄒ":"갆","가ᄃ":"갇","가ᄅ":"갈","가ᄅᄀ":"갉","가ᄅᄆ":"갊","가ᄅᄇ":"갋","가ᄅᄉ":"갌","가ᄅᄐ":"갍","가ᄅᄑ":"갎","가ᄅᄒ":"갏","가ᄆ":"감","가ᄇ":"갑","가ᄇᄉ":"값","가ᄉ":"갓","가ᄊ":"갔","가ᄋ":"강","가ᄌ":"갖","가ᄎ":"갗","가ᄏ":"갘","가ᄐ":"같","가ᄑ":"갚","가ᄒ":"갛","개":"개","개ᄀ":"객","개ᄁ":"갞","개ᄀᄉ":"갟","개ᄂ":"갠","개ᄂᄌ":"갡","개ᄂᄒ":"갢","개ᄃ":"갣","개ᄅ":"갤","개ᄅᄀ":"갥","개ᄅᄆ":"갦","개ᄅᄇ":"갧","개ᄅᄉ":"갨","개ᄅᄐ":"갩","개ᄅᄑ":"갪","개ᄅᄒ":"갫","개ᄆ":"갬","개ᄇ":"갭","개ᄇᄉ":"갮","개ᄉ":"갯","개ᄊ":"갰","개ᄋ":"갱","개ᄌ":"갲","개ᄎ":"갳","개ᄏ":"갴","개ᄐ":"갵","개ᄑ":"갶","개ᄒ":"갷","갸":"갸","갸ᄀ":"갹","갸ᄁ":"갺","갸ᄀᄉ":"갻","갸ᄂ":"갼","갸ᄂᄌ":"갽","갸ᄂᄒ":"갾","갸ᄃ":"갿","갸ᄅ":"걀","갸ᄅᄀ":"걁","갸ᄅᄆ":"걂","갸ᄅᄇ":"걃","갸ᄅᄉ":"걄","갸ᄅᄐ":"걅","갸ᄅᄑ":"걆","갸ᄅᄒ":"걇","갸ᄆ":"걈","갸ᄇ":"걉","갸ᄇᄉ":"걊","갸ᄉ":"걋","갸ᄊ":"걌","갸ᄋ":"걍","갸ᄌ":"걎","갸ᄎ":"걏","갸ᄏ":"걐","갸ᄐ":"걑","갸ᄑ":"걒","갸ᄒ":"걓","걔":"걔","걔ᄀ":"걕","걔ᄁ":"걖","걔ᄀᄉ":"걗","걔ᄂ":"걘","걔ᄂᄌ":"걙","걔ᄂᄒ":"걚","걔ᄃ":"걛","걔ᄅ":"걜","걔ᄅᄀ":"걝","걔ᄅᄆ":"걞","걔ᄅᄇ":"걟","걔ᄅᄉ":"걠","걔ᄅᄐ":"걡","걔ᄅᄑ":"걢","걔ᄅᄒ":"걣","걔ᄆ":"걤","걔ᄇ":"걥","걔ᄇᄉ":"걦","걔ᄉ":"걧","걔ᄊ":"걨","걔ᄋ":"걩","걔ᄌ":"걪","걔ᄎ":"걫","걔ᄏ":"걬","걔ᄐ":"걭","걔ᄑ":"걮","걔ᄒ":"걯","거":"거","거ᄀ":"걱","거ᄁ":"걲","거ᄀᄉ":"걳","거ᄂ":"건","거ᄂᄌ":"걵","거ᄂᄒ":"걶","거ᄃ":"걷","거ᄅ":"걸","거ᄅᄀ":"걹","거ᄅᄆ":"걺","거ᄅᄇ":"걻","거ᄅᄉ":"걼","거ᄅᄐ":"걽","거ᄅᄑ":"걾","거ᄅᄒ":"걿","거ᄆ":"검","거ᄇ":"겁","거ᄇᄉ":"겂","거ᄉ":"것","거ᄊ":"겄","거ᄋ":"겅","거ᄌ":"겆","거ᄎ":"겇","거ᄏ":"겈","거ᄐ":"겉","거ᄑ":"겊","거ᄒ":"겋","게":"게","게ᄀ":"겍","게ᄁ":"겎","게ᄀᄉ":"겏","게ᄂ":"겐","게ᄂᄌ":"겑","게ᄂᄒ":"겒","게ᄃ":"겓","게ᄅ":"겔","게ᄅᄀ":"겕","게ᄅᄆ":"겖","게ᄅᄇ":"겗","게ᄅᄉ":"겘","게ᄅᄐ":"겙","게ᄅᄑ":"겚","게ᄅᄒ":"겛","게ᄆ":"겜","게ᄇ":"겝","게ᄇᄉ":"겞","게ᄉ":"겟","게ᄊ":"겠","게ᄋ":"겡","게ᄌ":"겢","게ᄎ":"겣","게ᄏ":"겤","게ᄐ":"겥","게ᄑ":"겦","게ᄒ":"겧","겨":"겨","겨ᄀ":"격","겨ᄁ":"겪","겨ᄀᄉ":"겫","겨ᄂ":"견","겨ᄂᄌ":"겭","겨ᄂᄒ":"겮","겨ᄃ":"겯","겨ᄅ":"결","겨ᄅᄀ":"겱","겨ᄅᄆ":"겲","겨ᄅᄇ":"겳","겨ᄅᄉ":"겴","겨ᄅᄐ":"겵","겨ᄅᄑ":"겶","겨ᄅᄒ":"겷","겨ᄆ":"겸","겨ᄇ":"겹","겨ᄇᄉ":"겺","겨ᄉ":"겻","겨ᄊ":"겼","겨ᄋ":"경","겨ᄌ":"겾","겨ᄎ":"겿","겨ᄏ":"곀","겨ᄐ":"곁","겨ᄑ":"곂","겨ᄒ":"곃","계":"계","계ᄀ":"곅","계ᄁ":"곆","계ᄀᄉ":"곇","계ᄂ":"곈","계ᄂᄌ":"곉","계ᄂᄒ":"곊","계ᄃ":"곋","계ᄅ":"곌","계ᄅᄀ":"곍","계ᄅᄆ":"곎","계ᄅᄇ":"곏","계ᄅᄉ":"곐","계ᄅᄐ":"곑","계ᄅᄑ":"곒","계ᄅᄒ":"곓","계ᄆ":"곔","계ᄇ":"곕","계ᄇᄉ":"곖","계ᄉ":"곗","계ᄊ":"곘","계ᄋ":"곙","계ᄌ":"곚","계ᄎ":"곛","계ᄏ":"곜","계ᄐ":"곝","계ᄑ":"곞","계ᄒ":"곟","고":"고","고ᄀ":"곡","고ᄁ":"곢","고ᄀᄉ":"곣","고ᄂ":"곤","고ᄂᄌ":"곥","고ᄂᄒ":"곦","고ᄃ":"곧","고ᄅ":"골","고ᄅᄀ":"곩","고ᄅᄆ":"곪","고ᄅᄇ":"곫","고ᄅᄉ":"곬","고ᄅᄐ":"곭","고ᄅᄑ":"곮","고ᄅᄒ":"곯","고ᄆ":"곰","고ᄇ":"곱","고ᄇᄉ":"곲","고ᄉ":"곳","고ᄊ":"곴","고ᄋ":"공","고ᄌ":"곶","고ᄎ":"곷","고ᄏ":"곸","고ᄐ":"곹","고ᄑ":"곺","고ᄒ":"곻","고ᅡ":"과","고ᅡᄀ":"곽","고ᅡᄁ":"곾","고ᅡᄀᄉ":"곿","고ᅡᄂ":"관","고ᅡᄂᄌ":"괁","고ᅡᄂᄒ":"괂","고ᅡᄃ":"괃","고ᅡᄅ":"괄","고ᅡᄅᄀ":"괅","고ᅡᄅᄆ":"괆","고ᅡᄅᄇ":"괇","고ᅡᄅᄉ":"괈","고ᅡᄅᄐ":"괉","고ᅡᄅᄑ":"괊","고ᅡᄅᄒ":"괋","고ᅡᄆ":"괌","고ᅡᄇ":"괍","고ᅡᄇᄉ":"괎","고ᅡᄉ":"괏","고ᅡᄊ":"괐","고ᅡᄋ":"광","고ᅡᄌ":"괒","고ᅡᄎ":"괓","고ᅡᄏ":"괔","고ᅡᄐ":"괕","고ᅡᄑ":"괖","고ᅡᄒ":"괗","고ᅢ":"괘","고ᅢᄀ":"괙","고ᅢᄁ":"괚","고ᅢᄀᄉ":"괛","고ᅢᄂ":"괜","고ᅢᄂᄌ":"괝","고ᅢᄂᄒ":"괞","고ᅢᄃ":"괟","고ᅢᄅ":"괠","고ᅢᄅᄀ":"괡","고ᅢᄅᄆ":"괢","고ᅢᄅᄇ":"괣","고ᅢᄅᄉ":"괤","고ᅢᄅᄐ":"괥","고ᅢᄅᄑ":"괦","고ᅢᄅᄒ":"괧","고ᅢᄆ":"괨","고ᅢᄇ":"괩","고ᅢᄇᄉ":"괪","고ᅢᄉ":"괫","고ᅢᄊ":"괬","고ᅢᄋ":"괭","고ᅢᄌ":"괮","고ᅢᄎ":"괯","고ᅢᄏ":"괰","고ᅢᄐ":"괱","고ᅢᄑ":"괲","고ᅢᄒ":"괳","고ᅵ":"괴","고ᅵᄀ":"괵","고ᅵᄁ":"괶","고ᅵᄀᄉ":"괷","고ᅵᄂ":"괸","고ᅵᄂᄌ":"괹","고ᅵᄂᄒ":"괺","고ᅵᄃ":"괻","고ᅵᄅ":"괼","고ᅵᄅᄀ":"괽","고ᅵᄅᄆ":"괾","고ᅵᄅᄇ":"괿","고ᅵᄅᄉ":"굀","고ᅵᄅᄐ":"굁","고ᅵᄅᄑ":"굂","고ᅵᄅᄒ":"굃","고ᅵᄆ":"굄","고ᅵᄇ":"굅","고ᅵᄇᄉ":"굆","고ᅵᄉ":"굇","고ᅵᄊ":"굈","고ᅵᄋ":"굉","고ᅵᄌ":"굊","고ᅵᄎ":"굋","고ᅵᄏ":"굌","고ᅵᄐ":"굍","고ᅵᄑ":"굎","고ᅵᄒ":"굏","교":"교","교ᄀ":"굑","교ᄁ":"굒","교ᄀᄉ":"굓","교ᄂ":"굔","교ᄂᄌ":"굕","교ᄂᄒ":"굖","교ᄃ":"굗","교ᄅ":"굘","교ᄅᄀ":"굙","교ᄅᄆ":"굚","교ᄅᄇ":"굛","교ᄅᄉ":"굜","교ᄅᄐ":"굝","교ᄅᄑ":"굞","교ᄅᄒ":"굟","교ᄆ":"굠","교ᄇ":"굡","교ᄇᄉ":"굢","교ᄉ":"굣","교ᄊ":"굤","교ᄋ":"굥","교ᄌ":"굦","교ᄎ":"굧","교ᄏ":"굨","교ᄐ":"굩","교ᄑ":"굪","교ᄒ":"굫","구":"구","구ᄀ":"국","구ᄁ":"굮","구ᄀᄉ":"굯","구ᄂ":"군","구ᄂᄌ":"굱","구ᄂᄒ":"굲","구ᄃ":"굳","구ᄅ":"굴","구ᄅᄀ":"굵","구ᄅᄆ":"굶","구ᄅᄇ":"굷","구ᄅᄉ":"굸","구ᄅᄐ":"굹","구ᄅᄑ":"굺","구ᄅᄒ":"굻","구ᄆ":"굼","구ᄇ":"굽","구ᄇᄉ":"굾","구ᄉ":"굿","구ᄊ":"궀","구ᄋ":"궁","구ᄌ":"궂","구ᄎ":"궃","구ᄏ":"궄","구ᄐ":"궅","구ᄑ":"궆","구ᄒ":"궇","구ᅥ":"궈","구ᅥᄀ":"궉","구ᅥᄁ":"궊","구ᅥᄀᄉ":"궋","구ᅥᄂ":"권","구ᅥᄂᄌ":"궍","구ᅥᄂᄒ":"궎","구ᅥᄃ":"궏","구ᅥᄅ":"궐","구ᅥᄅᄀ":"궑","구ᅥᄅᄆ":"궒","구ᅥᄅᄇ":"궓","구ᅥᄅᄉ":"궔","구ᅥᄅᄐ":"궕","구ᅥᄅᄑ":"궖","구ᅥᄅᄒ":"궗","구ᅥᄆ":"궘","구ᅥᄇ":"궙","구ᅥᄇᄉ":"궚","구ᅥᄉ":"궛","구ᅥᄊ":"궜","구ᅥᄋ":"궝","구ᅥᄌ":"궞","구ᅥᄎ":"궟","구ᅥᄏ":"궠","구ᅥᄐ":"궡","구ᅥᄑ":"궢","구ᅥᄒ":"궣","구ᅦ":"궤","구ᅦᄀ":"궥","구ᅦᄁ":"궦","구ᅦᄀᄉ":"궧","구ᅦᄂ":"궨","구ᅦᄂᄌ":"궩","구ᅦᄂᄒ":"궪","구ᅦᄃ":"궫","구ᅦᄅ":"궬","구ᅦᄅᄀ":"궭","구ᅦᄅᄆ":"궮","구ᅦᄅᄇ":"궯","구ᅦᄅᄉ":"궰","구ᅦᄅᄐ":"궱","구ᅦᄅᄑ":"궲","구ᅦᄅᄒ":"궳","구ᅦᄆ":"궴","구ᅦᄇ":"궵","구ᅦᄇᄉ":"궶","구ᅦᄉ":"궷","구ᅦᄊ":"궸","구ᅦᄋ":"궹","구ᅦᄌ":"궺","구ᅦᄎ":"궻","구ᅦᄏ":"궼","구ᅦᄐ":"궽","구ᅦᄑ":"궾","구ᅦᄒ":"궿","구ᅵ":"귀","구ᅵᄀ":"귁","구ᅵᄁ":"귂","구ᅵᄀᄉ":"귃","구ᅵᄂ":"귄","구ᅵᄂᄌ":"귅","구ᅵᄂᄒ":"귆","구ᅵᄃ":"귇","구ᅵᄅ":"귈","구ᅵᄅᄀ":"귉","구ᅵᄅᄆ":"귊","구ᅵᄅᄇ":"귋","구ᅵᄅᄉ":"귌","구ᅵᄅᄐ":"귍","구ᅵᄅᄑ":"귎","구ᅵᄅᄒ":"귏","구ᅵᄆ":"귐","구ᅵᄇ":"귑","구ᅵᄇᄉ":"귒","구ᅵᄉ":"귓","구ᅵᄊ":"귔","구ᅵᄋ":"귕","구ᅵᄌ":"귖","구ᅵᄎ":"귗","구ᅵᄏ":"귘","구ᅵᄐ":"귙","구ᅵᄑ":"귚","구ᅵᄒ":"귛","규":"규","규ᄀ":"귝","규ᄁ":"귞","규ᄀᄉ":"귟","규ᄂ":"균","규ᄂᄌ":"귡","규ᄂᄒ":"귢","규ᄃ":"귣","규ᄅ":"귤","규ᄅᄀ":"귥","규ᄅᄆ":"귦","규ᄅᄇ":"귧","규ᄅᄉ":"귨","규ᄅᄐ":"귩","규ᄅᄑ":"귪","규ᄅᄒ":"귫","규ᄆ":"귬","규ᄇ":"귭","규ᄇᄉ":"귮","규ᄉ":"귯","규ᄊ":"귰","규ᄋ":"귱","규ᄌ":"귲","규ᄎ":"귳","규ᄏ":"귴","규ᄐ":"귵","규ᄑ":"귶","규ᄒ":"귷","그":"그","그ᄀ":"극","그ᄁ":"귺","그ᄀᄉ":"귻","그ᄂ":"근","그ᄂᄌ":"귽","그ᄂᄒ":"귾","그ᄃ":"귿","그ᄅ":"글","그ᄅᄀ":"긁","그ᄅᄆ":"긂","그ᄅᄇ":"긃","그ᄅᄉ":"긄","그ᄅᄐ":"긅","그ᄅᄑ":"긆","그ᄅᄒ":"긇","그ᄆ":"금","그ᄇ":"급","그ᄇᄉ":"긊","그ᄉ":"긋","그ᄊ":"긌","그ᄋ":"긍","그ᄌ":"긎","그ᄎ":"긏","그ᄏ":"긐","그ᄐ":"긑","그ᄑ":"긒","그ᄒ":"긓","그ᅵ":"긔","그ᅵᄀ":"긕","그ᅵᄁ":"긖","그ᅵᄀᄉ":"긗","그ᅵᄂ":"긘","그ᅵᄂᄌ":"긙","그ᅵᄂᄒ":"긚","그ᅵᄃ":"긛","그ᅵᄅ":"긜","그ᅵᄅᄀ":"긝","그ᅵᄅᄆ":"긞","그ᅵᄅᄇ":"긟","그ᅵᄅᄉ":"긠","그ᅵᄅᄐ":"긡","그ᅵᄅᄑ":"긢","그ᅵᄅᄒ":"긣","그ᅵᄆ":"긤","그ᅵᄇ":"긥","그ᅵᄇᄉ":"긦","그ᅵᄉ":"긧","그ᅵᄊ":"긨","그ᅵᄋ":"긩","그ᅵᄌ":"긪","그ᅵᄎ":"긫","그ᅵᄏ":"긬","그ᅵᄐ":"긭","그ᅵᄑ":"긮","그ᅵᄒ":"긯","기":"기","기ᄀ":"긱","기ᄁ":"긲","기ᄀᄉ":"긳","기ᄂ":"긴","기ᄂᄌ":"긵","기ᄂᄒ":"긶","기ᄃ":"긷","기ᄅ":"길","기ᄅᄀ":"긹","기ᄅᄆ":"긺","기ᄅᄇ":"긻","기ᄅᄉ":"긼","기ᄅᄐ":"긽","기ᄅᄑ":"긾","기ᄅᄒ":"긿","기ᄆ":"김","기ᄇ":"깁","기ᄇᄉ":"깂","기ᄉ":"깃","기ᄊ":"깄","기ᄋ":"깅","기ᄌ":"깆","기ᄎ":"깇","기ᄏ":"깈","기ᄐ":"깉","기ᄑ":"깊","기ᄒ":"깋","까":"까","까ᄀ":"깍","까ᄁ":"깎","까ᄀᄉ":"깏","까ᄂ":"깐","까ᄂᄌ":"깑","까ᄂᄒ":"깒","까ᄃ":"깓","까ᄅ":"깔","까ᄅᄀ":"깕","까ᄅᄆ":"깖","까ᄅᄇ":"깗","까ᄅᄉ":"깘","까ᄅᄐ":"깙","까ᄅᄑ":"깚","까ᄅᄒ":"깛","까ᄆ":"깜","까ᄇ":"깝","까ᄇᄉ":"깞","까ᄉ":"깟","까ᄊ":"깠","까ᄋ":"깡","까ᄌ":"깢","까ᄎ":"깣","까ᄏ":"깤","까ᄐ":"깥","까ᄑ":"깦","까ᄒ":"깧","깨":"깨","깨ᄀ":"깩","깨ᄁ":"깪","깨ᄀᄉ":"깫","깨ᄂ":"깬","깨ᄂᄌ":"깭","깨ᄂᄒ":"깮","깨ᄃ":"깯","깨ᄅ":"깰","깨ᄅᄀ":"깱","깨ᄅᄆ":"깲","깨ᄅᄇ":"깳","깨ᄅᄉ":"깴","깨ᄅᄐ":"깵","깨ᄅᄑ":"깶","깨ᄅᄒ":"깷","깨ᄆ":"깸","깨ᄇ":"깹","깨ᄇᄉ":"깺","깨ᄉ":"깻","깨ᄊ":"깼","깨ᄋ":"깽","깨ᄌ":"깾","깨ᄎ":"깿","깨ᄏ":"꺀","깨ᄐ":"꺁","깨ᄑ":"꺂","깨ᄒ":"꺃","꺄":"꺄","꺄ᄀ":"꺅","꺄ᄁ":"꺆","꺄ᄀᄉ":"꺇","꺄ᄂ":"꺈","꺄ᄂᄌ":"꺉","꺄ᄂᄒ":"꺊","꺄ᄃ":"꺋","꺄ᄅ":"꺌","꺄ᄅᄀ":"꺍","꺄ᄅᄆ":"꺎","꺄ᄅᄇ":"꺏","꺄ᄅᄉ":"꺐","꺄ᄅᄐ":"꺑","꺄ᄅᄑ":"꺒","꺄ᄅᄒ":"꺓","꺄ᄆ":"꺔","꺄ᄇ":"꺕","꺄ᄇᄉ":"꺖","꺄ᄉ":"꺗","꺄ᄊ":"꺘","꺄ᄋ":"꺙","꺄ᄌ":"꺚","꺄ᄎ":"꺛","꺄ᄏ":"꺜","꺄ᄐ":"꺝","꺄ᄑ":"꺞","꺄ᄒ":"꺟","꺠":"꺠","꺠ᄀ":"꺡","꺠ᄁ":"꺢","꺠ᄀᄉ":"꺣","꺠ᄂ":"꺤","꺠ᄂᄌ":"꺥","꺠ᄂᄒ":"꺦","꺠ᄃ":"꺧","꺠ᄅ":"꺨","꺠ᄅᄀ":"꺩","꺠ᄅᄆ":"꺪","꺠ᄅᄇ":"꺫","꺠ᄅᄉ":"꺬","꺠ᄅᄐ":"꺭","꺠ᄅᄑ":"꺮","꺠ᄅᄒ":"꺯","꺠ᄆ":"꺰","꺠ᄇ":"꺱","꺠ᄇᄉ":"꺲","꺠ᄉ":"꺳","꺠ᄊ":"꺴","꺠ᄋ":"꺵","꺠ᄌ":"꺶","꺠ᄎ":"꺷","꺠ᄏ":"꺸","꺠ᄐ":"꺹","꺠ᄑ":"꺺","꺠ᄒ":"꺻","꺼":"꺼","꺼ᄀ":"꺽","꺼ᄁ":"꺾","꺼ᄀᄉ":"꺿","꺼ᄂ":"껀","꺼ᄂᄌ":"껁","꺼ᄂᄒ":"껂","꺼ᄃ":"껃","꺼ᄅ":"껄","꺼ᄅᄀ":"껅","꺼ᄅᄆ":"껆","꺼ᄅᄇ":"껇","꺼ᄅᄉ":"껈","꺼ᄅᄐ":"껉","꺼ᄅᄑ":"껊","꺼ᄅᄒ":"껋","꺼ᄆ":"껌","꺼ᄇ":"껍","꺼ᄇᄉ":"껎","꺼ᄉ":"껏","꺼ᄊ":"껐","꺼ᄋ":"껑","꺼ᄌ":"껒","꺼ᄎ":"껓","꺼ᄏ":"껔","꺼ᄐ":"껕","꺼ᄑ":"껖","꺼ᄒ":"껗","께":"께","께ᄀ":"껙","께ᄁ":"껚","께ᄀᄉ":"껛","께ᄂ":"껜","께ᄂᄌ":"껝","께ᄂᄒ":"껞","께ᄃ":"껟","께ᄅ":"껠","께ᄅᄀ":"껡","께ᄅᄆ":"껢","께ᄅᄇ":"껣","께ᄅᄉ":"껤","께ᄅᄐ":"껥","께ᄅᄑ":"껦","께ᄅᄒ":"껧","께ᄆ":"껨","께ᄇ":"껩","께ᄇᄉ":"껪","께ᄉ":"껫","께ᄊ":"껬","께ᄋ":"껭","께ᄌ":"껮","께ᄎ":"껯","께ᄏ":"껰","께ᄐ":"껱","께ᄑ":"껲","께ᄒ":"껳","껴":"껴","껴ᄀ":"껵","껴ᄁ":"껶","껴ᄀᄉ":"껷","껴ᄂ":"껸","껴ᄂᄌ":"껹","껴ᄂᄒ":"껺","껴ᄃ":"껻","껴ᄅ":"껼","껴ᄅᄀ":"껽","껴ᄅᄆ":"껾","껴ᄅᄇ":"껿","껴ᄅᄉ":"꼀","껴ᄅᄐ":"꼁","껴ᄅᄑ":"꼂","껴ᄅᄒ":"꼃","껴ᄆ":"꼄","껴ᄇ":"꼅","껴ᄇᄉ":"꼆","껴ᄉ":"꼇","껴ᄊ":"꼈","껴ᄋ":"꼉","껴ᄌ":"꼊","껴ᄎ":"꼋","껴ᄏ":"꼌","껴ᄐ":"꼍","껴ᄑ":"꼎","껴ᄒ":"꼏","꼐":"꼐","꼐ᄀ":"꼑","꼐ᄁ":"꼒","꼐ᄀᄉ":"꼓","꼐ᄂ":"꼔","꼐ᄂᄌ":"꼕","꼐ᄂᄒ":"꼖","꼐ᄃ":"꼗","꼐ᄅ":"꼘","꼐ᄅᄀ":"꼙","꼐ᄅᄆ":"꼚","꼐ᄅᄇ":"꼛","꼐ᄅᄉ":"꼜","꼐ᄅᄐ":"꼝","꼐ᄅᄑ":"꼞","꼐ᄅᄒ":"꼟","꼐ᄆ":"꼠","꼐ᄇ":"꼡","꼐ᄇᄉ":"꼢","꼐ᄉ":"꼣","꼐ᄊ":"꼤","꼐ᄋ":"꼥","꼐ᄌ":"꼦","꼐ᄎ":"꼧","꼐ᄏ":"꼨","꼐ᄐ":"꼩","꼐ᄑ":"꼪","꼐ᄒ":"꼫","꼬":"꼬","꼬ᄀ":"꼭","꼬ᄁ":"꼮","꼬ᄀᄉ":"꼯","꼬ᄂ":"꼰","꼬ᄂᄌ":"꼱","꼬ᄂᄒ":"꼲","꼬ᄃ":"꼳","꼬ᄅ":"꼴","꼬ᄅᄀ":"꼵","꼬ᄅᄆ":"꼶","꼬ᄅᄇ":"꼷","꼬ᄅᄉ":"꼸","꼬ᄅᄐ":"꼹","꼬ᄅᄑ":"꼺","꼬ᄅᄒ":"꼻","꼬ᄆ":"꼼","꼬ᄇ":"꼽","꼬ᄇᄉ":"꼾","꼬ᄉ":"꼿","꼬ᄊ":"꽀","꼬ᄋ":"꽁","꼬ᄌ":"꽂","꼬ᄎ":"꽃","꼬ᄏ":"꽄","꼬ᄐ":"꽅","꼬ᄑ":"꽆","꼬ᄒ":"꽇","꼬ᅡ":"꽈","꼬ᅡᄀ":"꽉","꼬ᅡᄁ":"꽊","꼬ᅡᄀᄉ":"꽋","꼬ᅡᄂ":"꽌","꼬ᅡᄂᄌ":"꽍","꼬ᅡᄂᄒ":"꽎","꼬ᅡᄃ":"꽏","꼬ᅡᄅ":"꽐","꼬ᅡᄅᄀ":"꽑","꼬ᅡᄅᄆ":"꽒","꼬ᅡᄅᄇ":"꽓","꼬ᅡᄅᄉ":"꽔","꼬ᅡᄅᄐ":"꽕","꼬ᅡᄅᄑ":"꽖","꼬ᅡᄅᄒ":"꽗","꼬ᅡᄆ":"꽘","꼬ᅡᄇ":"꽙","꼬ᅡᄇᄉ":"꽚","꼬ᅡᄉ":"꽛","꼬ᅡᄊ":"꽜","꼬ᅡᄋ":"꽝","꼬ᅡᄌ":"꽞","꼬ᅡᄎ":"꽟","꼬ᅡᄏ":"꽠","꼬ᅡᄐ":"꽡","꼬ᅡᄑ":"꽢","꼬ᅡᄒ":"꽣","꼬ᅢ":"꽤","꼬ᅢᄀ":"꽥","꼬ᅢᄁ":"꽦","꼬ᅢᄀᄉ":"꽧","꼬ᅢᄂ":"꽨","꼬ᅢᄂᄌ":"꽩","꼬ᅢᄂᄒ":"꽪","꼬ᅢᄃ":"꽫","꼬ᅢᄅ":"꽬","꼬ᅢᄅᄀ":"꽭","꼬ᅢᄅᄆ":"꽮","꼬ᅢᄅᄇ":"꽯","꼬ᅢᄅᄉ":"꽰","꼬ᅢᄅᄐ":"꽱","꼬ᅢᄅᄑ":"꽲","꼬ᅢᄅᄒ":"꽳","꼬ᅢᄆ":"꽴","꼬ᅢᄇ":"꽵","꼬ᅢᄇᄉ":"꽶","꼬ᅢᄉ":"꽷","꼬ᅢᄊ":"꽸","꼬ᅢᄋ":"꽹","꼬ᅢᄌ":"꽺","꼬ᅢᄎ":"꽻","꼬ᅢᄏ":"꽼","꼬ᅢᄐ":"꽽","꼬ᅢᄑ":"꽾","꼬ᅢᄒ":"꽿","꼬ᅵ":"꾀","꼬ᅵᄀ":"꾁","꼬ᅵᄁ":"꾂","꼬ᅵᄀᄉ":"꾃","꼬ᅵᄂ":"꾄","꼬ᅵᄂᄌ":"꾅","꼬ᅵᄂᄒ":"꾆","꼬ᅵᄃ":"꾇","꼬ᅵᄅ":"꾈","꼬ᅵᄅᄀ":"꾉","꼬ᅵᄅᄆ":"꾊","꼬ᅵᄅᄇ":"꾋","꼬ᅵᄅᄉ":"꾌","꼬ᅵᄅᄐ":"꾍","꼬ᅵᄅᄑ":"꾎","꼬ᅵᄅᄒ":"꾏","꼬ᅵᄆ":"꾐","꼬ᅵᄇ":"꾑","꼬ᅵᄇᄉ":"꾒","꼬ᅵᄉ":"꾓","꼬ᅵᄊ":"꾔","꼬ᅵᄋ":"꾕","꼬ᅵᄌ":"꾖","꼬ᅵᄎ":"꾗","꼬ᅵᄏ":"꾘","꼬ᅵᄐ":"꾙","꼬ᅵᄑ":"꾚","꼬ᅵᄒ":"꾛","꾜":"꾜","꾜ᄀ":"꾝","꾜ᄁ":"꾞","꾜ᄀᄉ":"꾟","꾜ᄂ":"꾠","꾜ᄂᄌ":"꾡","꾜ᄂᄒ":"꾢","꾜ᄃ":"꾣","꾜ᄅ":"꾤","꾜ᄅᄀ":"꾥","꾜ᄅᄆ":"꾦","꾜ᄅᄇ":"꾧","꾜ᄅᄉ":"꾨","꾜ᄅᄐ":"꾩","꾜ᄅᄑ":"꾪","꾜ᄅᄒ":"꾫","꾜ᄆ":"꾬","꾜ᄇ":"꾭","꾜ᄇᄉ":"꾮","꾜ᄉ":"꾯","꾜ᄊ":"꾰","꾜ᄋ":"꾱","꾜ᄌ":"꾲","꾜ᄎ":"꾳","꾜ᄏ":"꾴","꾜ᄐ":"꾵","꾜ᄑ":"꾶","꾜ᄒ":"꾷","꾸":"꾸","꾸ᄀ":"꾹","꾸ᄁ":"꾺","꾸ᄀᄉ":"꾻","꾸ᄂ":"꾼","꾸ᄂᄌ":"꾽","꾸ᄂᄒ":"꾾","꾸ᄃ":"꾿","꾸ᄅ":"꿀","꾸ᄅᄀ":"꿁","꾸ᄅᄆ":"꿂","꾸ᄅᄇ":"꿃","꾸ᄅᄉ":"꿄","꾸ᄅᄐ":"꿅","꾸ᄅᄑ":"꿆","꾸ᄅᄒ":"꿇","꾸ᄆ":"꿈","꾸ᄇ":"꿉","꾸ᄇᄉ":"꿊","꾸ᄉ":"꿋","꾸ᄊ":"꿌","꾸ᄋ":"꿍","꾸ᄌ":"꿎","꾸ᄎ":"꿏","꾸ᄏ":"꿐","꾸ᄐ":"꿑","꾸ᄑ":"꿒","꾸ᄒ":"꿓","꾸ᅥ":"꿔","꾸ᅥᄀ":"꿕","꾸ᅥᄁ":"꿖","꾸ᅥᄀᄉ":"꿗","꾸ᅥᄂ":"꿘","꾸ᅥᄂᄌ":"꿙","꾸ᅥᄂᄒ":"꿚","꾸ᅥᄃ":"꿛","꾸ᅥᄅ":"꿜","꾸ᅥᄅᄀ":"꿝","꾸ᅥᄅᄆ":"꿞","꾸ᅥᄅᄇ":"꿟","꾸ᅥᄅᄉ":"꿠","꾸ᅥᄅᄐ":"꿡","꾸ᅥᄅᄑ":"꿢","꾸ᅥᄅᄒ":"꿣","꾸ᅥᄆ":"꿤","꾸ᅥᄇ":"꿥","꾸ᅥᄇᄉ":"꿦","꾸ᅥᄉ":"꿧","꾸ᅥᄊ":"꿨","꾸ᅥᄋ":"꿩","꾸ᅥᄌ":"꿪","꾸ᅥᄎ":"꿫","꾸ᅥᄏ":"꿬","꾸ᅥᄐ":"꿭","꾸ᅥᄑ":"꿮","꾸ᅥᄒ":"꿯","꾸ᅦ":"꿰","꾸ᅦᄀ":"꿱","꾸ᅦᄁ":"꿲","꾸ᅦᄀᄉ":"꿳","꾸ᅦᄂ":"꿴","꾸ᅦᄂᄌ":"꿵","꾸ᅦᄂᄒ":"꿶","꾸ᅦᄃ":"꿷","꾸ᅦᄅ":"꿸","꾸ᅦᄅᄀ":"꿹","꾸ᅦᄅᄆ":"꿺","꾸ᅦᄅᄇ":"꿻","꾸ᅦᄅᄉ":"꿼","꾸ᅦᄅᄐ":"꿽","꾸ᅦᄅᄑ":"꿾","꾸ᅦᄅᄒ":"꿿","꾸ᅦᄆ":"뀀","꾸ᅦᄇ":"뀁","꾸ᅦᄇᄉ":"뀂","꾸ᅦᄉ":"뀃","꾸ᅦᄊ":"뀄","꾸ᅦᄋ":"뀅","꾸ᅦᄌ":"뀆","꾸ᅦᄎ":"뀇","꾸ᅦᄏ":"뀈","꾸ᅦᄐ":"뀉","꾸ᅦᄑ":"뀊","꾸ᅦᄒ":"뀋","꾸ᅵ":"뀌","꾸ᅵᄀ":"뀍","꾸ᅵᄁ":"뀎","꾸ᅵᄀᄉ":"뀏","꾸ᅵᄂ":"뀐","꾸ᅵᄂᄌ":"뀑","꾸ᅵᄂᄒ":"뀒","꾸ᅵᄃ":"뀓","꾸ᅵᄅ":"뀔","꾸ᅵᄅᄀ":"뀕","꾸ᅵᄅᄆ":"뀖","꾸ᅵᄅᄇ":"뀗","꾸ᅵᄅᄉ":"뀘","꾸ᅵᄅᄐ":"뀙","꾸ᅵᄅᄑ":"뀚","꾸ᅵᄅᄒ":"뀛","꾸ᅵᄆ":"뀜","꾸ᅵᄇ":"뀝","꾸ᅵᄇᄉ":"뀞","꾸ᅵᄉ":"뀟","꾸ᅵᄊ":"뀠","꾸ᅵᄋ":"뀡","꾸ᅵᄌ":"뀢","꾸ᅵᄎ":"뀣","꾸ᅵᄏ":"뀤","꾸ᅵᄐ":"뀥","꾸ᅵᄑ":"뀦","꾸ᅵᄒ":"뀧","뀨":"뀨","뀨ᄀ":"뀩","뀨ᄁ":"뀪","뀨ᄀᄉ":"뀫","뀨ᄂ":"뀬","뀨ᄂᄌ":"뀭","뀨ᄂᄒ":"뀮","뀨ᄃ":"뀯","뀨ᄅ":"뀰","뀨ᄅᄀ":"뀱","뀨ᄅᄆ":"뀲","뀨ᄅᄇ":"뀳","뀨ᄅᄉ":"뀴","뀨ᄅᄐ":"뀵","뀨ᄅᄑ":"뀶","뀨ᄅᄒ":"뀷","뀨ᄆ":"뀸","뀨ᄇ":"뀹","뀨ᄇᄉ":"뀺","뀨ᄉ":"뀻","뀨ᄊ":"뀼","뀨ᄋ":"뀽","뀨ᄌ":"뀾","뀨ᄎ":"뀿","뀨ᄏ":"끀","뀨ᄐ":"끁","뀨ᄑ":"끂","뀨ᄒ":"끃","끄":"끄","끄ᄀ":"끅","끄ᄁ":"끆","끄ᄀᄉ":"끇","끄ᄂ":"끈","끄ᄂᄌ":"끉","끄ᄂᄒ":"끊","끄ᄃ":"끋","끄ᄅ":"끌","끄ᄅᄀ":"끍","끄ᄅᄆ":"끎","끄ᄅᄇ":"끏","끄ᄅᄉ":"끐","끄ᄅᄐ":"끑","끄ᄅᄑ":"끒","끄ᄅᄒ":"끓","끄ᄆ":"끔","끄ᄇ":"끕","끄ᄇᄉ":"끖","끄ᄉ":"끗","끄ᄊ":"끘","끄ᄋ":"끙","끄ᄌ":"끚","끄ᄎ":"끛","끄ᄏ":"끜","끄ᄐ":"끝","끄ᄑ":"끞","끄ᄒ":"끟","끄ᅵ":"끠","끄ᅵᄀ":"끡","끄ᅵᄁ":"끢","끄ᅵᄀᄉ":"끣","끄ᅵᄂ":"끤","끄ᅵᄂᄌ":"끥","끄ᅵᄂᄒ":"끦","끄ᅵᄃ":"끧","끄ᅵᄅ":"끨","끄ᅵᄅᄀ":"끩","끄ᅵᄅᄆ":"끪","끄ᅵᄅᄇ":"끫","끄ᅵᄅᄉ":"끬","끄ᅵᄅᄐ":"끭","끄ᅵᄅᄑ":"끮","끄ᅵᄅᄒ":"끯","끄ᅵᄆ":"끰","끄ᅵᄇ":"끱","끄ᅵᄇᄉ":"끲","끄ᅵᄉ":"끳","끄ᅵᄊ":"끴","끄ᅵᄋ":"끵","끄ᅵᄌ":"끶","끄ᅵᄎ":"끷","끄ᅵᄏ":"끸","끄ᅵᄐ":"끹","끄ᅵᄑ":"끺","끄ᅵᄒ":"끻","끼":"끼","끼ᄀ":"끽","끼ᄁ":"끾","끼ᄀᄉ":"끿","끼ᄂ":"낀","끼ᄂᄌ":"낁","끼ᄂᄒ":"낂","끼ᄃ":"낃","끼ᄅ":"낄","끼ᄅᄀ":"낅","끼ᄅᄆ":"낆","끼ᄅᄇ":"낇","끼ᄅᄉ":"낈","끼ᄅᄐ":"낉","끼ᄅᄑ":"낊","끼ᄅᄒ":"낋","끼ᄆ":"낌","끼ᄇ":"낍","끼ᄇᄉ":"낎","끼ᄉ":"낏","끼ᄊ":"낐","끼ᄋ":"낑","끼ᄌ":"낒","끼ᄎ":"낓","끼ᄏ":"낔","끼ᄐ":"낕","끼ᄑ":"낖","끼ᄒ":"낗","나":"나","나ᄀ":"낙","나ᄁ":"낚","나ᄀᄉ":"낛","나ᄂ":"난","나ᄂᄌ":"낝","나ᄂᄒ":"낞","나ᄃ":"낟","나ᄅ":"날","나ᄅᄀ":"낡","나ᄅᄆ":"낢","나ᄅᄇ":"낣","나ᄅᄉ":"낤","나ᄅᄐ":"낥","나ᄅᄑ":"낦","나ᄅᄒ":"낧","나ᄆ":"남","나ᄇ":"납","나ᄇᄉ":"낪","나ᄉ":"낫","나ᄊ":"났","나ᄋ":"낭","나ᄌ":"낮","나ᄎ":"낯","나ᄏ":"낰","나ᄐ":"낱","나ᄑ":"낲","나ᄒ":"낳","내":"내","내ᄀ":"낵","내ᄁ":"낶","내ᄀᄉ":"낷","내ᄂ":"낸","내ᄂᄌ":"낹","내ᄂᄒ":"낺","내ᄃ":"낻","내ᄅ":"낼","내ᄅᄀ":"낽","내ᄅᄆ":"낾","내ᄅᄇ":"낿","내ᄅᄉ":"냀","내ᄅᄐ":"냁","내ᄅᄑ":"냂","내ᄅᄒ":"냃","내ᄆ":"냄","내ᄇ":"냅","내ᄇᄉ":"냆","내ᄉ":"냇","내ᄊ":"냈","내ᄋ":"냉","내ᄌ":"냊","내ᄎ":"냋","내ᄏ":"냌","내ᄐ":"냍","내ᄑ":"냎","내ᄒ":"냏","냐":"냐","냐ᄀ":"냑","냐ᄁ":"냒","냐ᄀᄉ":"냓","냐ᄂ":"냔","냐ᄂᄌ":"냕","냐ᄂᄒ":"냖","냐ᄃ":"냗","냐ᄅ":"냘","냐ᄅᄀ":"냙","냐ᄅᄆ":"냚","냐ᄅᄇ":"냛","냐ᄅᄉ":"냜","냐ᄅᄐ":"냝","냐ᄅᄑ":"냞","냐ᄅᄒ":"냟","냐ᄆ":"냠","냐ᄇ":"냡","냐ᄇᄉ":"냢","냐ᄉ":"냣","냐ᄊ":"냤","냐ᄋ":"냥","냐ᄌ":"냦","냐ᄎ":"냧","냐ᄏ":"냨","냐ᄐ":"냩","냐ᄑ":"냪","냐ᄒ":"냫","냬":"냬","냬ᄀ":"냭","냬ᄁ":"냮","냬ᄀᄉ":"냯","냬ᄂ":"냰","냬ᄂᄌ":"냱","냬ᄂᄒ":"냲","냬ᄃ":"냳","냬ᄅ":"냴","냬ᄅᄀ":"냵","냬ᄅᄆ":"냶","냬ᄅᄇ":"냷","냬ᄅᄉ":"냸","냬ᄅᄐ":"냹","냬ᄅᄑ":"냺","냬ᄅᄒ":"냻","냬ᄆ":"냼","냬ᄇ":"냽","냬ᄇᄉ":"냾","냬ᄉ":"냿","냬ᄊ":"넀","냬ᄋ":"넁","냬ᄌ":"넂","냬ᄎ":"넃","냬ᄏ":"넄","냬ᄐ":"넅","냬ᄑ":"넆","냬ᄒ":"넇","너":"너","너ᄀ":"넉","너ᄁ":"넊","너ᄀᄉ":"넋","너ᄂ":"넌","너ᄂᄌ":"넍","너ᄂᄒ":"넎","너ᄃ":"넏","너ᄅ":"널","너ᄅᄀ":"넑","너ᄅᄆ":"넒","너ᄅᄇ":"넓","너ᄅᄉ":"넔","너ᄅᄐ":"넕","너ᄅᄑ":"넖","너ᄅᄒ":"넗","너ᄆ":"넘","너ᄇ":"넙","너ᄇᄉ":"넚","너ᄉ":"넛","너ᄊ":"넜","너ᄋ":"넝","너ᄌ":"넞","너ᄎ":"넟","너ᄏ":"넠","너ᄐ":"넡","너ᄑ":"넢","너ᄒ":"넣","네":"네","네ᄀ":"넥","네ᄁ":"넦","네ᄀᄉ":"넧","네ᄂ":"넨","네ᄂᄌ":"넩","네ᄂᄒ":"넪","네ᄃ":"넫","네ᄅ":"넬","네ᄅᄀ":"넭","네ᄅᄆ":"넮","네ᄅᄇ":"넯","네ᄅᄉ":"넰","네ᄅᄐ":"넱","네ᄅᄑ":"넲","네ᄅᄒ":"넳","네ᄆ":"넴","네ᄇ":"넵","네ᄇᄉ":"넶","네ᄉ":"넷","네ᄊ":"넸","네ᄋ":"넹","네ᄌ":"넺","네ᄎ":"넻","네ᄏ":"넼","네ᄐ":"넽","네ᄑ":"넾","네ᄒ":"넿","녀":"녀","녀ᄀ":"녁","녀ᄁ":"녂","녀ᄀᄉ":"녃","녀ᄂ":"년","녀ᄂᄌ":"녅","녀ᄂᄒ":"녆","녀ᄃ":"녇","녀ᄅ":"녈","녀ᄅᄀ":"녉","녀ᄅᄆ":"녊","녀ᄅᄇ":"녋","녀ᄅᄉ":"녌","녀ᄅᄐ":"녍","녀ᄅᄑ":"녎","녀ᄅᄒ":"녏","녀ᄆ":"념","녀ᄇ":"녑","녀ᄇᄉ":"녒","녀ᄉ":"녓","녀ᄊ":"녔","녀ᄋ":"녕","녀ᄌ":"녖","녀ᄎ":"녗","녀ᄏ":"녘","녀ᄐ":"녙","녀ᄑ":"녚","녀ᄒ":"녛","녜":"녜","녜ᄀ":"녝","녜ᄁ":"녞","녜ᄀᄉ":"녟","녜ᄂ":"녠","녜ᄂᄌ":"녡","녜ᄂᄒ":"녢","녜ᄃ":"녣","녜ᄅ":"녤","녜ᄅᄀ":"녥","녜ᄅᄆ":"녦","녜ᄅᄇ":"녧","녜ᄅᄉ":"녨","녜ᄅᄐ":"녩","녜ᄅᄑ":"녪","녜ᄅᄒ":"녫","녜ᄆ":"녬","녜ᄇ":"녭","녜ᄇᄉ":"녮","녜ᄉ":"녯","녜ᄊ":"녰","녜ᄋ":"녱","녜ᄌ":"녲","녜ᄎ":"녳","녜ᄏ":"녴","녜ᄐ":"녵","녜ᄑ":"녶","녜ᄒ":"녷","노":"노","노ᄀ":"녹","노ᄁ":"녺","노ᄀᄉ":"녻","노ᄂ":"논","노ᄂᄌ":"녽","노ᄂᄒ":"녾","노ᄃ":"녿","노ᄅ":"놀","노ᄅᄀ":"놁","노ᄅᄆ":"놂","노ᄅᄇ":"놃","노ᄅᄉ":"놄","노ᄅᄐ":"놅","노ᄅᄑ":"놆","노ᄅᄒ":"놇","노ᄆ":"놈","노ᄇ":"놉","노ᄇᄉ":"놊","노ᄉ":"놋","노ᄊ":"놌","노ᄋ":"농","노ᄌ":"놎","노ᄎ":"놏","노ᄏ":"놐","노ᄐ":"놑","노ᄑ":"높","노ᄒ":"놓","노ᅡ":"놔","노ᅡᄀ":"놕","노ᅡᄁ":"놖","노ᅡᄀᄉ":"놗","노ᅡᄂ":"놘","노ᅡᄂᄌ":"놙","노ᅡᄂᄒ":"놚","노ᅡᄃ":"놛","노ᅡᄅ":"놜","노ᅡᄅᄀ":"놝","노ᅡᄅᄆ":"놞","노ᅡᄅᄇ":"놟","노ᅡᄅᄉ":"놠","노ᅡᄅᄐ":"놡","노ᅡᄅᄑ":"놢","노ᅡᄅᄒ":"놣","노ᅡᄆ":"놤","노ᅡᄇ":"놥","노ᅡᄇᄉ":"놦","노ᅡᄉ":"놧","노ᅡᄊ":"놨","노ᅡᄋ":"놩","노ᅡᄌ":"놪","노ᅡᄎ":"놫","노ᅡᄏ":"놬","노ᅡᄐ":"놭","노ᅡᄑ":"놮","노ᅡᄒ":"놯","노ᅢ":"놰","노ᅢᄀ":"놱","노ᅢᄁ":"놲","노ᅢᄀᄉ":"놳","노ᅢᄂ":"놴","노ᅢᄂᄌ":"놵","노ᅢᄂᄒ":"놶","노ᅢᄃ":"놷","노ᅢᄅ":"놸","노ᅢᄅᄀ":"놹","노ᅢᄅᄆ":"놺","노ᅢᄅᄇ":"놻","노ᅢᄅᄉ":"놼","노ᅢᄅᄐ":"놽","노ᅢᄅᄑ":"놾","노ᅢᄅᄒ":"놿","노ᅢᄆ":"뇀","노ᅢᄇ":"뇁","노ᅢᄇᄉ":"뇂","노ᅢᄉ":"뇃","노ᅢᄊ":"뇄","노ᅢᄋ":"뇅","노ᅢᄌ":"뇆","노ᅢᄎ":"뇇","노ᅢᄏ":"뇈","노ᅢᄐ":"뇉","노ᅢᄑ":"뇊","노ᅢᄒ":"뇋","노ᅵ":"뇌","노ᅵᄀ":"뇍","노ᅵᄁ":"뇎","노ᅵᄀᄉ":"뇏","노ᅵᄂ":"뇐","노ᅵᄂᄌ":"뇑","노ᅵᄂᄒ":"뇒","노ᅵᄃ":"뇓","노ᅵᄅ":"뇔","노ᅵᄅᄀ":"뇕","노ᅵᄅᄆ":"뇖","노ᅵᄅᄇ":"뇗","노ᅵᄅᄉ":"뇘","노ᅵᄅᄐ":"뇙","노ᅵᄅᄑ":"뇚","노ᅵᄅᄒ":"뇛","노ᅵᄆ":"뇜","노ᅵᄇ":"뇝","노ᅵᄇᄉ":"뇞","노ᅵᄉ":"뇟","노ᅵᄊ":"뇠","노ᅵᄋ":"뇡","노ᅵᄌ":"뇢","노ᅵᄎ":"뇣","노ᅵᄏ":"뇤","노ᅵᄐ":"뇥","노ᅵᄑ":"뇦","노ᅵᄒ":"뇧","뇨":"뇨","뇨ᄀ":"뇩","뇨ᄁ":"뇪","뇨ᄀᄉ":"뇫","뇨ᄂ":"뇬","뇨ᄂᄌ":"뇭","뇨ᄂᄒ":"뇮","뇨ᄃ":"뇯","뇨ᄅ":"뇰","뇨ᄅᄀ":"뇱","뇨ᄅᄆ":"뇲","뇨ᄅᄇ":"뇳","뇨ᄅᄉ":"뇴","뇨ᄅᄐ":"뇵","뇨ᄅᄑ":"뇶","뇨ᄅᄒ":"뇷","뇨ᄆ":"뇸","뇨ᄇ":"뇹","뇨ᄇᄉ":"뇺","뇨ᄉ":"뇻","뇨ᄊ":"뇼","뇨ᄋ":"뇽","뇨ᄌ":"뇾","뇨ᄎ":"뇿","뇨ᄏ":"눀","뇨ᄐ":"눁","뇨ᄑ":"눂","뇨ᄒ":"눃","누":"누","누ᄀ":"눅","누ᄁ":"눆","누ᄀᄉ":"눇","누ᄂ":"눈","누ᄂᄌ":"눉","누ᄂᄒ":"눊","누ᄃ":"눋","누ᄅ":"눌","누ᄅᄀ":"눍","누ᄅᄆ":"눎","누ᄅᄇ":"눏","누ᄅᄉ":"눐","누ᄅᄐ":"눑","누ᄅᄑ":"눒","누ᄅᄒ":"눓","누ᄆ":"눔","누ᄇ":"눕","누ᄇᄉ":"눖","누ᄉ":"눗","누ᄊ":"눘","누ᄋ":"눙","누ᄌ":"눚","누ᄎ":"눛","누ᄏ":"눜","누ᄐ":"눝","누ᄑ":"눞","누ᄒ":"눟","누ᅥ":"눠","누ᅥᄀ":"눡","누ᅥᄁ":"눢","누ᅥᄀᄉ":"눣","누ᅥᄂ":"눤","누ᅥᄂᄌ":"눥","누ᅥᄂᄒ":"눦","누ᅥᄃ":"눧","누ᅥᄅ":"눨","누ᅥᄅᄀ":"눩","누ᅥᄅᄆ":"눪","누ᅥᄅᄇ":"눫","누ᅥᄅᄉ":"눬","누ᅥᄅᄐ":"눭","누ᅥᄅᄑ":"눮","누ᅥᄅᄒ":"눯","누ᅥᄆ":"눰","누ᅥᄇ":"눱","누ᅥᄇᄉ":"눲","누ᅥᄉ":"눳","누ᅥᄊ":"눴","누ᅥᄋ":"눵","누ᅥᄌ":"눶","누ᅥᄎ":"눷","누ᅥᄏ":"눸","누ᅥᄐ":"눹","누ᅥᄑ":"눺","누ᅥᄒ":"눻","누ᅦ":"눼","누ᅦᄀ":"눽","누ᅦᄁ":"눾","누ᅦᄀᄉ":"눿","누ᅦᄂ":"뉀","누ᅦᄂᄌ":"뉁","누ᅦᄂᄒ":"뉂","누ᅦᄃ":"뉃","누ᅦᄅ":"뉄","누ᅦᄅᄀ":"뉅","누ᅦᄅᄆ":"뉆","누ᅦᄅᄇ":"뉇","누ᅦᄅᄉ":"뉈","누ᅦᄅᄐ":"뉉","누ᅦᄅᄑ":"뉊","누ᅦᄅᄒ":"뉋","누ᅦᄆ":"뉌","누ᅦᄇ":"뉍","누ᅦᄇᄉ":"뉎","누ᅦᄉ":"뉏","누ᅦᄊ":"뉐","누ᅦᄋ":"뉑","누ᅦᄌ":"뉒","누ᅦᄎ":"뉓","누ᅦᄏ":"뉔","누ᅦᄐ":"뉕","누ᅦᄑ":"뉖","누ᅦᄒ":"뉗","누ᅵ":"뉘","누ᅵᄀ":"뉙","누ᅵᄁ":"뉚","누ᅵᄀᄉ":"뉛","누ᅵᄂ":"뉜","누ᅵᄂᄌ":"뉝","누ᅵᄂᄒ":"뉞","누ᅵᄃ":"뉟","누ᅵᄅ":"뉠","누ᅵᄅᄀ":"뉡","누ᅵᄅᄆ":"뉢","누ᅵᄅᄇ":"뉣","누ᅵᄅᄉ":"뉤","누ᅵᄅᄐ":"뉥","누ᅵᄅᄑ":"뉦","누ᅵᄅᄒ":"뉧","누ᅵᄆ":"뉨","누ᅵᄇ":"뉩","누ᅵᄇᄉ":"뉪","누ᅵᄉ":"뉫","누ᅵᄊ":"뉬","누ᅵᄋ":"뉭","누ᅵᄌ":"뉮","누ᅵᄎ":"뉯","누ᅵᄏ":"뉰","누ᅵᄐ":"뉱","누ᅵᄑ":"뉲","누ᅵᄒ":"뉳","뉴":"뉴","뉴ᄀ":"뉵","뉴ᄁ":"뉶","뉴ᄀᄉ":"뉷","뉴ᄂ":"뉸","뉴ᄂᄌ":"뉹","뉴ᄂᄒ":"뉺","뉴ᄃ":"뉻","뉴ᄅ":"뉼","뉴ᄅᄀ":"뉽","뉴ᄅᄆ":"뉾","뉴ᄅᄇ":"뉿","뉴ᄅᄉ":"늀","뉴ᄅᄐ":"늁","뉴ᄅᄑ":"늂","뉴ᄅᄒ":"늃","뉴ᄆ":"늄","뉴ᄇ":"늅","뉴ᄇᄉ":"늆","뉴ᄉ":"늇","뉴ᄊ":"늈","뉴ᄋ":"늉","뉴ᄌ":"늊","뉴ᄎ":"늋","뉴ᄏ":"늌","뉴ᄐ":"늍","뉴ᄑ":"늎","뉴ᄒ":"늏","느":"느","느ᄀ":"늑","느ᄁ":"늒","느ᄀᄉ":"늓","느ᄂ":"는","느ᄂᄌ":"늕","느ᄂᄒ":"늖","느ᄃ":"늗","느ᄅ":"늘","느ᄅᄀ":"늙","느ᄅᄆ":"늚","느ᄅᄇ":"늛","느ᄅᄉ":"늜","느ᄅᄐ":"늝","느ᄅᄑ":"늞","느ᄅᄒ":"늟","느ᄆ":"늠","느ᄇ":"늡","느ᄇᄉ":"늢","느ᄉ":"늣","느ᄊ":"늤","느ᄋ":"능","느ᄌ":"늦","느ᄎ":"늧","느ᄏ":"늨","느ᄐ":"늩","느ᄑ":"늪","느ᄒ":"늫","느ᅵ":"늬","느ᅵᄀ":"늭","느ᅵᄁ":"늮","느ᅵᄀᄉ":"늯","느ᅵᄂ":"늰","느ᅵᄂᄌ":"늱","느ᅵᄂᄒ":"늲","느ᅵᄃ":"늳","느ᅵᄅ":"늴","느ᅵᄅᄀ":"늵","느ᅵᄅᄆ":"늶","느ᅵᄅᄇ":"늷","느ᅵᄅᄉ":"늸","느ᅵᄅᄐ":"늹","느ᅵᄅᄑ":"늺","느ᅵᄅᄒ":"늻","느ᅵᄆ":"늼","느ᅵᄇ":"늽","느ᅵᄇᄉ":"늾","느ᅵᄉ":"늿","느ᅵᄊ":"닀","느ᅵᄋ":"닁","느ᅵᄌ":"닂","느ᅵᄎ":"닃","느ᅵᄏ":"닄","느ᅵᄐ":"닅","느ᅵᄑ":"닆","느ᅵᄒ":"닇","니":"니","니ᄀ":"닉","니ᄁ":"닊","니ᄀᄉ":"닋","니ᄂ":"닌","니ᄂᄌ":"닍","니ᄂᄒ":"닎","니ᄃ":"닏","니ᄅ":"닐","니ᄅᄀ":"닑","니ᄅᄆ":"닒","니ᄅᄇ":"닓","니ᄅᄉ":"닔","니ᄅᄐ":"닕","니ᄅᄑ":"닖","니ᄅᄒ":"닗","니ᄆ":"님","니ᄇ":"닙","니ᄇᄉ":"닚","니ᄉ":"닛","니ᄊ":"닜","니ᄋ":"닝","니ᄌ":"닞","니ᄎ":"닟","니ᄏ":"닠","니ᄐ":"닡","니ᄑ":"닢","니ᄒ":"닣","다":"다","다ᄀ":"닥","다ᄁ":"닦","다ᄀᄉ":"닧","다ᄂ":"단","다ᄂᄌ":"닩","다ᄂᄒ":"닪","다ᄃ":"닫","다ᄅ":"달","다ᄅᄀ":"닭","다ᄅᄆ":"닮","다ᄅᄇ":"닯","다ᄅᄉ":"닰","다ᄅᄐ":"닱","다ᄅᄑ":"닲","다ᄅᄒ":"닳","다ᄆ":"담","다ᄇ":"답","다ᄇᄉ":"닶","다ᄉ":"닷","다ᄊ":"닸","다ᄋ":"당","다ᄌ":"닺","다ᄎ":"닻","다ᄏ":"닼","다ᄐ":"닽","다ᄑ":"닾","다ᄒ":"닿","대":"대","대ᄀ":"댁","대ᄁ":"댂","대ᄀᄉ":"댃","대ᄂ":"댄","대ᄂᄌ":"댅","대ᄂᄒ":"댆","대ᄃ":"댇","대ᄅ":"댈","대ᄅᄀ":"댉","대ᄅᄆ":"댊","대ᄅᄇ":"댋","대ᄅᄉ":"댌","대ᄅᄐ":"댍","대ᄅᄑ":"댎","대ᄅᄒ":"댏","대ᄆ":"댐","대ᄇ":"댑","대ᄇᄉ":"댒","대ᄉ":"댓","대ᄊ":"댔","대ᄋ":"댕","대ᄌ":"댖","대ᄎ":"댗","대ᄏ":"댘","대ᄐ":"댙","대ᄑ":"댚","대ᄒ":"댛","댜":"댜","댜ᄀ":"댝","댜ᄁ":"댞","댜ᄀᄉ":"댟","댜ᄂ":"댠","댜ᄂᄌ":"댡","댜ᄂᄒ":"댢","댜ᄃ":"댣","댜ᄅ":"댤","댜ᄅᄀ":"댥","댜ᄅᄆ":"댦","댜ᄅᄇ":"댧","댜ᄅᄉ":"댨","댜ᄅᄐ":"댩","댜ᄅᄑ":"댪","댜ᄅᄒ":"댫","댜ᄆ":"댬","댜ᄇ":"댭","댜ᄇᄉ":"댮","댜ᄉ":"댯","댜ᄊ":"댰","댜ᄋ":"댱","댜ᄌ":"댲","댜ᄎ":"댳","댜ᄏ":"댴","댜ᄐ":"댵","댜ᄑ":"댶","댜ᄒ":"댷","댸":"댸","댸ᄀ":"댹","댸ᄁ":"댺","댸ᄀᄉ":"댻","댸ᄂ":"댼","댸ᄂᄌ":"댽","댸ᄂᄒ":"댾","댸ᄃ":"댿","댸ᄅ":"덀","댸ᄅᄀ":"덁","댸ᄅᄆ":"덂","댸ᄅᄇ":"덃","댸ᄅᄉ":"덄","댸ᄅᄐ":"덅","댸ᄅᄑ":"덆","댸ᄅᄒ":"덇","댸ᄆ":"덈","댸ᄇ":"덉","댸ᄇᄉ":"덊","댸ᄉ":"덋","댸ᄊ":"덌","댸ᄋ":"덍","댸ᄌ":"덎","댸ᄎ":"덏","댸ᄏ":"덐","댸ᄐ":"덑","댸ᄑ":"덒","댸ᄒ":"덓","더":"더","더ᄀ":"덕","더ᄁ":"덖","더ᄀᄉ":"덗","더ᄂ":"던","더ᄂᄌ":"덙","더ᄂᄒ":"덚","더ᄃ":"덛","더ᄅ":"덜","더ᄅᄀ":"덝","더ᄅᄆ":"덞","더ᄅᄇ":"덟","더ᄅᄉ":"덠","더ᄅᄐ":"덡","더ᄅᄑ":"덢","더ᄅᄒ":"덣","더ᄆ":"덤","더ᄇ":"덥","더ᄇᄉ":"덦","더ᄉ":"덧","더ᄊ":"덨","더ᄋ":"덩","더ᄌ":"덪","더ᄎ":"덫","더ᄏ":"덬","더ᄐ":"덭","더ᄑ":"덮","더ᄒ":"덯","데":"데","데ᄀ":"덱","데ᄁ":"덲","데ᄀᄉ":"덳","데ᄂ":"덴","데ᄂᄌ":"덵","데ᄂᄒ":"덶","데ᄃ":"덷","데ᄅ":"델","데ᄅᄀ":"덹","데ᄅᄆ":"덺","데ᄅᄇ":"덻","데ᄅᄉ":"덼","데ᄅᄐ":"덽","데ᄅᄑ":"덾","데ᄅᄒ":"덿","데ᄆ":"뎀","데ᄇ":"뎁","데ᄇᄉ":"뎂","데ᄉ":"뎃","데ᄊ":"뎄","데ᄋ":"뎅","데ᄌ":"뎆","데ᄎ":"뎇","데ᄏ":"뎈","데ᄐ":"뎉","데ᄑ":"뎊","데ᄒ":"뎋","뎌":"뎌","뎌ᄀ":"뎍","뎌ᄁ":"뎎","뎌ᄀᄉ":"뎏","뎌ᄂ":"뎐","뎌ᄂᄌ":"뎑","뎌ᄂᄒ":"뎒","뎌ᄃ":"뎓","뎌ᄅ":"뎔","뎌ᄅᄀ":"뎕","뎌ᄅᄆ":"뎖","뎌ᄅᄇ":"뎗","뎌ᄅᄉ":"뎘","뎌ᄅᄐ":"뎙","뎌ᄅᄑ":"뎚","뎌ᄅᄒ":"뎛","뎌ᄆ":"뎜","뎌ᄇ":"뎝","뎌ᄇᄉ":"뎞","뎌ᄉ":"뎟","뎌ᄊ":"뎠","뎌ᄋ":"뎡","뎌ᄌ":"뎢","뎌ᄎ":"뎣","뎌ᄏ":"뎤","뎌ᄐ":"뎥","뎌ᄑ":"뎦","뎌ᄒ":"뎧","뎨":"뎨","뎨ᄀ":"뎩","뎨ᄁ":"뎪","뎨ᄀᄉ":"뎫","뎨ᄂ":"뎬","뎨ᄂᄌ":"뎭","뎨ᄂᄒ":"뎮","뎨ᄃ":"뎯","뎨ᄅ":"뎰","뎨ᄅᄀ":"뎱","뎨ᄅᄆ":"뎲","뎨ᄅᄇ":"뎳","뎨ᄅᄉ":"뎴","뎨ᄅᄐ":"뎵","뎨ᄅᄑ":"뎶","뎨ᄅᄒ":"뎷","뎨ᄆ":"뎸","뎨ᄇ":"뎹","뎨ᄇᄉ":"뎺","뎨ᄉ":"뎻","뎨ᄊ":"뎼","뎨ᄋ":"뎽","뎨ᄌ":"뎾","뎨ᄎ":"뎿","뎨ᄏ":"돀","뎨ᄐ":"돁","뎨ᄑ":"돂","뎨ᄒ":"돃","도":"도","도ᄀ":"독","도ᄁ":"돆","도ᄀᄉ":"돇","도ᄂ":"돈","도ᄂᄌ":"돉","도ᄂᄒ":"돊","도ᄃ":"돋","도ᄅ":"돌","도ᄅᄀ":"돍","도ᄅᄆ":"돎","도ᄅᄇ":"돏","도ᄅᄉ":"돐","도ᄅᄐ":"돑","도ᄅᄑ":"돒","도ᄅᄒ":"돓","도ᄆ":"돔","도ᄇ":"돕","도ᄇᄉ":"돖","도ᄉ":"돗","도ᄊ":"돘","도ᄋ":"동","도ᄌ":"돚","도ᄎ":"돛","도ᄏ":"돜","도ᄐ":"돝","도ᄑ":"돞","도ᄒ":"돟","도ᅡ":"돠","도ᅡᄀ":"돡","도ᅡᄁ":"돢","도ᅡᄀᄉ":"돣","도ᅡᄂ":"돤","도ᅡᄂᄌ":"돥","도ᅡᄂᄒ":"돦","도ᅡᄃ":"돧","도ᅡᄅ":"돨","도ᅡᄅᄀ":"돩","도ᅡᄅᄆ":"돪","도ᅡᄅᄇ":"돫","도ᅡᄅᄉ":"돬","도ᅡᄅᄐ":"돭","도ᅡᄅᄑ":"돮","도ᅡᄅᄒ":"돯","도ᅡᄆ":"돰","도ᅡᄇ":"돱","도ᅡᄇᄉ":"돲","도ᅡᄉ":"돳","도ᅡᄊ":"돴","도ᅡᄋ":"돵","도ᅡᄌ":"돶","도ᅡᄎ":"돷","도ᅡᄏ":"돸","도ᅡᄐ":"돹","도ᅡᄑ":"돺","도ᅡᄒ":"돻","도ᅢ":"돼","도ᅢᄀ":"돽","도ᅢᄁ":"돾","도ᅢᄀᄉ":"돿","도ᅢᄂ":"됀","도ᅢᄂᄌ":"됁","도ᅢᄂᄒ":"됂","도ᅢᄃ":"됃","도ᅢᄅ":"됄","도ᅢᄅᄀ":"됅","도ᅢᄅᄆ":"됆","도ᅢᄅᄇ":"됇","도ᅢᄅᄉ":"됈","도ᅢᄅᄐ":"됉","도ᅢᄅᄑ":"됊","도ᅢᄅᄒ":"됋","도ᅢᄆ":"됌","도ᅢᄇ":"됍","도ᅢᄇᄉ":"됎","도ᅢᄉ":"됏","도ᅢᄊ":"됐","도ᅢᄋ":"됑","도ᅢᄌ":"됒","도ᅢᄎ":"됓","도ᅢᄏ":"됔","도ᅢᄐ":"됕","도ᅢᄑ":"됖","도ᅢᄒ":"됗","도ᅵ":"되","도ᅵᄀ":"됙","도ᅵᄁ":"됚","도ᅵᄀᄉ":"됛","도ᅵᄂ":"된","도ᅵᄂᄌ":"됝","도ᅵᄂᄒ":"됞","도ᅵᄃ":"됟","도ᅵᄅ":"될","도ᅵᄅᄀ":"됡","도ᅵᄅᄆ":"됢","도ᅵᄅᄇ":"됣","도ᅵᄅᄉ":"됤","도ᅵᄅᄐ":"됥","도ᅵᄅᄑ":"됦","도ᅵᄅᄒ":"됧","도ᅵᄆ":"됨","도ᅵᄇ":"됩","도ᅵᄇᄉ":"됪","도ᅵᄉ":"됫","도ᅵᄊ":"됬","도ᅵᄋ":"됭","도ᅵᄌ":"됮","도ᅵᄎ":"됯","도ᅵᄏ":"됰","도ᅵᄐ":"됱","도ᅵᄑ":"됲","도ᅵᄒ":"됳","됴":"됴","됴ᄀ":"됵","됴ᄁ":"됶","됴ᄀᄉ":"됷","됴ᄂ":"됸","됴ᄂᄌ":"됹","됴ᄂᄒ":"됺","됴ᄃ":"됻","됴ᄅ":"됼","됴ᄅᄀ":"됽","됴ᄅᄆ":"됾","됴ᄅᄇ":"됿","됴ᄅᄉ":"둀","됴ᄅᄐ":"둁","됴ᄅᄑ":"둂","됴ᄅᄒ":"둃","됴ᄆ":"둄","됴ᄇ":"둅","됴ᄇᄉ":"둆","됴ᄉ":"둇","됴ᄊ":"둈","됴ᄋ":"둉","됴ᄌ":"둊","됴ᄎ":"둋","됴ᄏ":"둌","됴ᄐ":"둍","됴ᄑ":"둎","됴ᄒ":"둏","두":"두","두ᄀ":"둑","두ᄁ":"둒","두ᄀᄉ":"둓","두ᄂ":"둔","두ᄂᄌ":"둕","두ᄂᄒ":"둖","두ᄃ":"둗","두ᄅ":"둘","두ᄅᄀ":"둙","두ᄅᄆ":"둚","두ᄅᄇ":"둛","두ᄅᄉ":"둜","두ᄅᄐ":"둝","두ᄅᄑ":"둞","두ᄅᄒ":"둟","두ᄆ":"둠","두ᄇ":"둡","두ᄇᄉ":"둢","두ᄉ":"둣","두ᄊ":"둤","두ᄋ":"둥","두ᄌ":"둦","두ᄎ":"둧","두ᄏ":"둨","두ᄐ":"둩","두ᄑ":"둪","두ᄒ":"둫","두ᅥ":"둬","두ᅥᄀ":"둭","두ᅥᄁ":"둮","두ᅥᄀᄉ":"둯","두ᅥᄂ":"둰","두ᅥᄂᄌ":"둱","두ᅥᄂᄒ":"둲","두ᅥᄃ":"둳","두ᅥᄅ":"둴","두ᅥᄅᄀ":"둵","두ᅥᄅᄆ":"둶","두ᅥᄅᄇ":"둷","두ᅥᄅᄉ":"둸","두ᅥᄅᄐ":"둹","두ᅥᄅᄑ":"둺","두ᅥᄅᄒ":"둻","두ᅥᄆ":"둼","두ᅥᄇ":"둽","두ᅥᄇᄉ":"둾","두ᅥᄉ":"둿","두ᅥᄊ":"뒀","두ᅥᄋ":"뒁","두ᅥᄌ":"뒂","두ᅥᄎ":"뒃","두ᅥᄏ":"뒄","두ᅥᄐ":"뒅","두ᅥᄑ":"뒆","두ᅥᄒ":"뒇","두ᅦ":"뒈","두ᅦᄀ":"뒉","두ᅦᄁ":"뒊","두ᅦᄀᄉ":"뒋","두ᅦᄂ":"뒌","두ᅦᄂᄌ":"뒍","두ᅦᄂᄒ":"뒎","두ᅦᄃ":"뒏","두ᅦᄅ":"뒐","두ᅦᄅᄀ":"뒑","두ᅦᄅᄆ":"뒒","두ᅦᄅᄇ":"뒓","두ᅦᄅᄉ":"뒔","두ᅦᄅᄐ":"뒕","두ᅦᄅᄑ":"뒖","두ᅦᄅᄒ":"뒗","두ᅦᄆ":"뒘","두ᅦᄇ":"뒙","두ᅦᄇᄉ":"뒚","두ᅦᄉ":"뒛","두ᅦᄊ":"뒜","두ᅦᄋ":"뒝","두ᅦᄌ":"뒞","두ᅦᄎ":"뒟","두ᅦᄏ":"뒠","두ᅦᄐ":"뒡","두ᅦᄑ":"뒢","두ᅦᄒ":"뒣","두ᅵ":"뒤","두ᅵᄀ":"뒥","두ᅵᄁ":"뒦","두ᅵᄀᄉ":"뒧","두ᅵᄂ":"뒨","두ᅵᄂᄌ":"뒩","두ᅵᄂᄒ":"뒪","두ᅵᄃ":"뒫","두ᅵᄅ":"뒬","두ᅵᄅᄀ":"뒭","두ᅵᄅᄆ":"뒮","두ᅵᄅᄇ":"뒯","두ᅵᄅᄉ":"뒰","두ᅵᄅᄐ":"뒱","두ᅵᄅᄑ":"뒲","두ᅵᄅᄒ":"뒳","두ᅵᄆ":"뒴","두ᅵᄇ":"뒵","두ᅵᄇᄉ":"뒶","두ᅵᄉ":"뒷","두ᅵᄊ":"뒸","두ᅵᄋ":"뒹","두ᅵᄌ":"뒺","두ᅵᄎ":"뒻","두ᅵᄏ":"뒼","두ᅵᄐ":"뒽","두ᅵᄑ":"뒾","두ᅵᄒ":"뒿","듀":"듀","듀ᄀ":"듁","듀ᄁ":"듂","듀ᄀᄉ":"듃","듀ᄂ":"듄","듀ᄂᄌ":"듅","듀ᄂᄒ":"듆","듀ᄃ":"듇","듀ᄅ":"듈","듀ᄅᄀ":"듉","듀ᄅᄆ":"듊","듀ᄅᄇ":"듋","듀ᄅᄉ":"듌","듀ᄅᄐ":"듍","듀ᄅᄑ":"듎","듀ᄅᄒ":"듏","듀ᄆ":"듐","듀ᄇ":"듑","듀ᄇᄉ":"듒","듀ᄉ":"듓","듀ᄊ":"듔","듀ᄋ":"듕","듀ᄌ":"듖","듀ᄎ":"듗","듀ᄏ":"듘","듀ᄐ":"듙","듀ᄑ":"듚","듀ᄒ":"듛","드":"드","드ᄀ":"득","드ᄁ":"듞","드ᄀᄉ":"듟","드ᄂ":"든","드ᄂᄌ":"듡","드ᄂᄒ":"듢","드ᄃ":"듣","드ᄅ":"들","드ᄅᄀ":"듥","드ᄅᄆ":"듦","드ᄅᄇ":"듧","드ᄅᄉ":"듨","드ᄅᄐ":"듩","드ᄅᄑ":"듪","드ᄅᄒ":"듫","드ᄆ":"듬","드ᄇ":"듭","드ᄇᄉ":"듮","드ᄉ":"듯","드ᄊ":"듰","드ᄋ":"등","드ᄌ":"듲","드ᄎ":"듳","드ᄏ":"듴","드ᄐ":"듵","드ᄑ":"듶","드ᄒ":"듷","드ᅵ":"듸","드ᅵᄀ":"듹","드ᅵᄁ":"듺","드ᅵᄀᄉ":"듻","드ᅵᄂ":"듼","드ᅵᄂᄌ":"듽","드ᅵᄂᄒ":"듾","드ᅵᄃ":"듿","드ᅵᄅ":"딀","드ᅵᄅᄀ":"딁","드ᅵᄅᄆ":"딂","드ᅵᄅᄇ":"딃","드ᅵᄅᄉ":"딄","드ᅵᄅᄐ":"딅","드ᅵᄅᄑ":"딆","드ᅵᄅᄒ":"딇","드ᅵᄆ":"딈","드ᅵᄇ":"딉","드ᅵᄇᄉ":"딊","드ᅵᄉ":"딋","드ᅵᄊ":"딌","드ᅵᄋ":"딍","드ᅵᄌ":"딎","드ᅵᄎ":"딏","드ᅵᄏ":"딐","드ᅵᄐ":"딑","드ᅵᄑ":"딒","드ᅵᄒ":"딓","디":"디","디ᄀ":"딕","디ᄁ":"딖","디ᄀᄉ":"딗","디ᄂ":"딘","디ᄂᄌ":"딙","디ᄂᄒ":"딚","디ᄃ":"딛","디ᄅ":"딜","디ᄅᄀ":"딝","디ᄅᄆ":"딞","디ᄅᄇ":"딟","디ᄅᄉ":"딠","디ᄅᄐ":"딡","디ᄅᄑ":"딢","디ᄅᄒ":"딣","디ᄆ":"딤","디ᄇ":"딥","디ᄇᄉ":"딦","디ᄉ":"딧","디ᄊ":"딨","디ᄋ":"딩","디ᄌ":"딪","디ᄎ":"딫","디ᄏ":"딬","디ᄐ":"딭","디ᄑ":"딮","디ᄒ":"딯","따":"따","따ᄀ":"딱","따ᄁ":"딲","따ᄀᄉ":"딳","따ᄂ":"딴","따ᄂᄌ":"딵","따ᄂᄒ":"딶","따ᄃ":"딷","따ᄅ":"딸","따ᄅᄀ":"딹","따ᄅᄆ":"딺","따ᄅᄇ":"딻","따ᄅᄉ":"딼","따ᄅᄐ":"딽","따ᄅᄑ":"딾","따ᄅᄒ":"딿","따ᄆ":"땀","따ᄇ":"땁","따ᄇᄉ":"땂","따ᄉ":"땃","따ᄊ":"땄","따ᄋ":"땅","따ᄌ":"땆","따ᄎ":"땇","따ᄏ":"땈","따ᄐ":"땉","따ᄑ":"땊","따ᄒ":"땋","때":"때","때ᄀ":"땍","때ᄁ":"땎","때ᄀᄉ":"땏","때ᄂ":"땐","때ᄂᄌ":"땑","때ᄂᄒ":"땒","때ᄃ":"땓","때ᄅ":"땔","때ᄅᄀ":"땕","때ᄅᄆ":"땖","때ᄅᄇ":"땗","때ᄅᄉ":"땘","때ᄅᄐ":"땙","때ᄅᄑ":"땚","때ᄅᄒ":"땛","때ᄆ":"땜","때ᄇ":"땝","때ᄇᄉ":"땞","때ᄉ":"땟","때ᄊ":"땠","때ᄋ":"땡","때ᄌ":"땢","때ᄎ":"땣","때ᄏ":"땤","때ᄐ":"땥","때ᄑ":"땦","때ᄒ":"땧","땨":"땨","땨ᄀ":"땩","땨ᄁ":"땪","땨ᄀᄉ":"땫","땨ᄂ":"땬","땨ᄂᄌ":"땭","땨ᄂᄒ":"땮","땨ᄃ":"땯","땨ᄅ":"땰","땨ᄅᄀ":"땱","땨ᄅᄆ":"땲","땨ᄅᄇ":"땳","땨ᄅᄉ":"땴","땨ᄅᄐ":"땵","땨ᄅᄑ":"땶","땨ᄅᄒ":"땷","땨ᄆ":"땸","땨ᄇ":"땹","땨ᄇᄉ":"땺","땨ᄉ":"땻","땨ᄊ":"땼","땨ᄋ":"땽","땨ᄌ":"땾","땨ᄎ":"땿","땨ᄏ":"떀","땨ᄐ":"떁","땨ᄑ":"떂","땨ᄒ":"떃","떄":"떄","떄ᄀ":"떅","떄ᄁ":"떆","떄ᄀᄉ":"떇","떄ᄂ":"떈","떄ᄂᄌ":"떉","떄ᄂᄒ":"떊","떄ᄃ":"떋","떄ᄅ":"떌","떄ᄅᄀ":"떍","떄ᄅᄆ":"떎","떄ᄅᄇ":"떏","떄ᄅᄉ":"떐","떄ᄅᄐ":"떑","떄ᄅᄑ":"떒","떄ᄅᄒ":"떓","떄ᄆ":"떔","떄ᄇ":"떕","떄ᄇᄉ":"떖","떄ᄉ":"떗","떄ᄊ":"떘","떄ᄋ":"떙","떄ᄌ":"떚","떄ᄎ":"떛","떄ᄏ":"떜","떄ᄐ":"떝","떄ᄑ":"떞","떄ᄒ":"떟","떠":"떠","떠ᄀ":"떡","떠ᄁ":"떢","떠ᄀᄉ":"떣","떠ᄂ":"떤","떠ᄂᄌ":"떥","떠ᄂᄒ":"떦","떠ᄃ":"떧","떠ᄅ":"떨","떠ᄅᄀ":"떩","떠ᄅᄆ":"떪","떠ᄅᄇ":"떫","떠ᄅᄉ":"떬","떠ᄅᄐ":"떭","떠ᄅᄑ":"떮","떠ᄅᄒ":"떯","떠ᄆ":"떰","떠ᄇ":"떱","떠ᄇᄉ":"떲","떠ᄉ":"떳","떠ᄊ":"떴","떠ᄋ":"떵","떠ᄌ":"떶","떠ᄎ":"떷","떠ᄏ":"떸","떠ᄐ":"떹","떠ᄑ":"떺","떠ᄒ":"떻","떼":"떼","떼ᄀ":"떽","떼ᄁ":"떾","떼ᄀᄉ":"떿","떼ᄂ":"뗀","떼ᄂᄌ":"뗁","떼ᄂᄒ":"뗂","떼ᄃ":"뗃","떼ᄅ":"뗄","떼ᄅᄀ":"뗅","떼ᄅᄆ":"뗆","떼ᄅᄇ":"뗇","떼ᄅᄉ":"뗈","떼ᄅᄐ":"뗉","떼ᄅᄑ":"뗊","떼ᄅᄒ":"뗋","떼ᄆ":"뗌","떼ᄇ":"뗍","떼ᄇᄉ":"뗎","떼ᄉ":"뗏","떼ᄊ":"뗐","떼ᄋ":"뗑","떼ᄌ":"뗒","떼ᄎ":"뗓","떼ᄏ":"뗔","떼ᄐ":"뗕","떼ᄑ":"뗖","떼ᄒ":"뗗","뗘":"뗘","뗘ᄀ":"뗙","뗘ᄁ":"뗚","뗘ᄀᄉ":"뗛","뗘ᄂ":"뗜","뗘ᄂᄌ":"뗝","뗘ᄂᄒ":"뗞","뗘ᄃ":"뗟","뗘ᄅ":"뗠","뗘ᄅᄀ":"뗡","뗘ᄅᄆ":"뗢","뗘ᄅᄇ":"뗣","뗘ᄅᄉ":"뗤","뗘ᄅᄐ":"뗥","뗘ᄅᄑ":"뗦","뗘ᄅᄒ":"뗧","뗘ᄆ":"뗨","뗘ᄇ":"뗩","뗘ᄇᄉ":"뗪","뗘ᄉ":"뗫","뗘ᄊ":"뗬","뗘ᄋ":"뗭","뗘ᄌ":"뗮","뗘ᄎ":"뗯","뗘ᄏ":"뗰","뗘ᄐ":"뗱","뗘ᄑ":"뗲","뗘ᄒ":"뗳","뗴":"뗴","뗴ᄀ":"뗵","뗴ᄁ":"뗶","뗴ᄀᄉ":"뗷","뗴ᄂ":"뗸","뗴ᄂᄌ":"뗹","뗴ᄂᄒ":"뗺","뗴ᄃ":"뗻","뗴ᄅ":"뗼","뗴ᄅᄀ":"뗽","뗴ᄅᄆ":"뗾","뗴ᄅᄇ":"뗿","뗴ᄅᄉ":"똀","뗴ᄅᄐ":"똁","뗴ᄅᄑ":"똂","뗴ᄅᄒ":"똃","뗴ᄆ":"똄","뗴ᄇ":"똅","뗴ᄇᄉ":"똆","뗴ᄉ":"똇","뗴ᄊ":"똈","뗴ᄋ":"똉","뗴ᄌ":"똊","뗴ᄎ":"똋","뗴ᄏ":"똌","뗴ᄐ":"똍","뗴ᄑ":"똎","뗴ᄒ":"똏","또":"또","또ᄀ":"똑","또ᄁ":"똒","또ᄀᄉ":"똓","또ᄂ":"똔","또ᄂᄌ":"똕","또ᄂᄒ":"똖","또ᄃ":"똗","또ᄅ":"똘","또ᄅᄀ":"똙","또ᄅᄆ":"똚","또ᄅᄇ":"똛","또ᄅᄉ":"똜","또ᄅᄐ":"똝","또ᄅᄑ":"똞","또ᄅᄒ":"똟","또ᄆ":"똠","또ᄇ":"똡","또ᄇᄉ":"똢","또ᄉ":"똣","또ᄊ":"똤","또ᄋ":"똥","또ᄌ":"똦","또ᄎ":"똧","또ᄏ":"똨","또ᄐ":"똩","또ᄑ":"똪","또ᄒ":"똫","또ᅡ":"똬","또ᅡᄀ":"똭","또ᅡᄁ":"똮","또ᅡᄀᄉ":"똯","또ᅡᄂ":"똰","또ᅡᄂᄌ":"똱","또ᅡᄂᄒ":"똲","또ᅡᄃ":"똳","또ᅡᄅ":"똴","또ᅡᄅᄀ":"똵","또ᅡᄅᄆ":"똶","또ᅡᄅᄇ":"똷","또ᅡᄅᄉ":"똸","또ᅡᄅᄐ":"똹","또ᅡᄅᄑ":"똺","또ᅡᄅᄒ":"똻","또ᅡᄆ":"똼","또ᅡᄇ":"똽","또ᅡᄇᄉ":"똾","또ᅡᄉ":"똿","또ᅡᄊ":"뙀","또ᅡᄋ":"뙁","또ᅡᄌ":"뙂","또ᅡᄎ":"뙃","또ᅡᄏ":"뙄","또ᅡᄐ":"뙅","또ᅡᄑ":"뙆","또ᅡᄒ":"뙇","또ᅢ":"뙈","또ᅢᄀ":"뙉","또ᅢᄁ":"뙊","또ᅢᄀᄉ":"뙋","또ᅢᄂ":"뙌","또ᅢᄂᄌ":"뙍","또ᅢᄂᄒ":"뙎","또ᅢᄃ":"뙏","또ᅢᄅ":"뙐","또ᅢᄅᄀ":"뙑","또ᅢᄅᄆ":"뙒","또ᅢᄅᄇ":"뙓","또ᅢᄅᄉ":"뙔","또ᅢᄅᄐ":"뙕","또ᅢᄅᄑ":"뙖","또ᅢᄅᄒ":"뙗","또ᅢᄆ":"뙘","또ᅢᄇ":"뙙","또ᅢᄇᄉ":"뙚","또ᅢᄉ":"뙛","또ᅢᄊ":"뙜","또ᅢᄋ":"뙝","또ᅢᄌ":"뙞","또ᅢᄎ":"뙟","또ᅢᄏ":"뙠","또ᅢᄐ":"뙡","또ᅢᄑ":"뙢","또ᅢᄒ":"뙣","또ᅵ":"뙤","또ᅵᄀ":"뙥","또ᅵᄁ":"뙦","또ᅵᄀᄉ":"뙧","또ᅵᄂ":"뙨","또ᅵᄂᄌ":"뙩","또ᅵᄂᄒ":"뙪","또ᅵᄃ":"뙫","또ᅵᄅ":"뙬","또ᅵᄅᄀ":"뙭","또ᅵᄅᄆ":"뙮","또ᅵᄅᄇ":"뙯","또ᅵᄅᄉ":"뙰","또ᅵᄅᄐ":"뙱","또ᅵᄅᄑ":"뙲","또ᅵᄅᄒ":"뙳","또ᅵᄆ":"뙴","또ᅵᄇ":"뙵","또ᅵᄇᄉ":"뙶","또ᅵᄉ":"뙷","또ᅵᄊ":"뙸","또ᅵᄋ":"뙹","또ᅵᄌ":"뙺","또ᅵᄎ":"뙻","또ᅵᄏ":"뙼","또ᅵᄐ":"뙽","또ᅵᄑ":"뙾","또ᅵᄒ":"뙿","뚀":"뚀","뚀ᄀ":"뚁","뚀ᄁ":"뚂","뚀ᄀᄉ":"뚃","뚀ᄂ":"뚄","뚀ᄂᄌ":"뚅","뚀ᄂᄒ":"뚆","뚀ᄃ":"뚇","뚀ᄅ":"뚈","뚀ᄅᄀ":"뚉","뚀ᄅᄆ":"뚊","뚀ᄅᄇ":"뚋","뚀ᄅᄉ":"뚌","뚀ᄅᄐ":"뚍","뚀ᄅᄑ":"뚎","뚀ᄅᄒ":"뚏","뚀ᄆ":"뚐","뚀ᄇ":"뚑","뚀ᄇᄉ":"뚒","뚀ᄉ":"뚓","뚀ᄊ":"뚔","뚀ᄋ":"뚕","뚀ᄌ":"뚖","뚀ᄎ":"뚗","뚀ᄏ":"뚘","뚀ᄐ":"뚙","뚀ᄑ":"뚚","뚀ᄒ":"뚛","뚜":"뚜","뚜ᄀ":"뚝","뚜ᄁ":"뚞","뚜ᄀᄉ":"뚟","뚜ᄂ":"뚠","뚜ᄂᄌ":"뚡","뚜ᄂᄒ":"뚢","뚜ᄃ":"뚣","뚜ᄅ":"뚤","뚜ᄅᄀ":"뚥","뚜ᄅᄆ":"뚦","뚜ᄅᄇ":"뚧","뚜ᄅᄉ":"뚨","뚜ᄅᄐ":"뚩","뚜ᄅᄑ":"뚪","뚜ᄅᄒ":"뚫","뚜ᄆ":"뚬","뚜ᄇ":"뚭","뚜ᄇᄉ":"뚮","뚜ᄉ":"뚯","뚜ᄊ":"뚰","뚜ᄋ":"뚱","뚜ᄌ":"뚲","뚜ᄎ":"뚳","뚜ᄏ":"뚴","뚜ᄐ":"뚵","뚜ᄑ":"뚶","뚜ᄒ":"뚷","뚜ᅥ":"뚸","뚜ᅥᄀ":"뚹","뚜ᅥᄁ":"뚺","뚜ᅥᄀᄉ":"뚻","뚜ᅥᄂ":"뚼","뚜ᅥᄂᄌ":"뚽","뚜ᅥᄂᄒ":"뚾","뚜ᅥᄃ":"뚿","뚜ᅥᄅ":"뛀","뚜ᅥᄅᄀ":"뛁","뚜ᅥᄅᄆ":"뛂","뚜ᅥᄅᄇ":"뛃","뚜ᅥᄅᄉ":"뛄","뚜ᅥᄅᄐ":"뛅","뚜ᅥᄅᄑ":"뛆","뚜ᅥᄅᄒ":"뛇","뚜ᅥᄆ":"뛈","뚜ᅥᄇ":"뛉","뚜ᅥᄇᄉ":"뛊","뚜ᅥᄉ":"뛋","뚜ᅥᄊ":"뛌","뚜ᅥᄋ":"뛍","뚜ᅥᄌ":"뛎","뚜ᅥᄎ":"뛏","뚜ᅥᄏ":"뛐","뚜ᅥᄐ":"뛑","뚜ᅥᄑ":"뛒","뚜ᅥᄒ":"뛓","뚜ᅦ":"뛔","뚜ᅦᄀ":"뛕","뚜ᅦᄁ":"뛖","뚜ᅦᄀᄉ":"뛗","뚜ᅦᄂ":"뛘","뚜ᅦᄂᄌ":"뛙","뚜ᅦᄂᄒ":"뛚","뚜ᅦᄃ":"뛛","뚜ᅦᄅ":"뛜","뚜ᅦᄅᄀ":"뛝","뚜ᅦᄅᄆ":"뛞","뚜ᅦᄅᄇ":"뛟","뚜ᅦᄅᄉ":"뛠","뚜ᅦᄅᄐ":"뛡","뚜ᅦᄅᄑ":"뛢","뚜ᅦᄅᄒ":"뛣","뚜ᅦᄆ":"뛤","뚜ᅦᄇ":"뛥","뚜ᅦᄇᄉ":"뛦","뚜ᅦᄉ":"뛧","뚜ᅦᄊ":"뛨","뚜ᅦᄋ":"뛩","뚜ᅦᄌ":"뛪","뚜ᅦᄎ":"뛫","뚜ᅦᄏ":"뛬","뚜ᅦᄐ":"뛭","뚜ᅦᄑ":"뛮","뚜ᅦᄒ":"뛯","뚜ᅵ":"뛰","뚜ᅵᄀ":"뛱","뚜ᅵᄁ":"뛲","뚜ᅵᄀᄉ":"뛳","뚜ᅵᄂ":"뛴","뚜ᅵᄂᄌ":"뛵","뚜ᅵᄂᄒ":"뛶","뚜ᅵᄃ":"뛷","뚜ᅵᄅ":"뛸","뚜ᅵᄅᄀ":"뛹","뚜ᅵᄅᄆ":"뛺","뚜ᅵᄅᄇ":"뛻","뚜ᅵᄅᄉ":"뛼","뚜ᅵᄅᄐ":"뛽","뚜ᅵᄅᄑ":"뛾","뚜ᅵᄅᄒ":"뛿","뚜ᅵᄆ":"뜀","뚜ᅵᄇ":"뜁","뚜ᅵᄇᄉ":"뜂","뚜ᅵᄉ":"뜃","뚜ᅵᄊ":"뜄","뚜ᅵᄋ":"뜅","뚜ᅵᄌ":"뜆","뚜ᅵᄎ":"뜇","뚜ᅵᄏ":"뜈","뚜ᅵᄐ":"뜉","뚜ᅵᄑ":"뜊","뚜ᅵᄒ":"뜋","뜌":"뜌","뜌ᄀ":"뜍","뜌ᄁ":"뜎","뜌ᄀᄉ":"뜏","뜌ᄂ":"뜐","뜌ᄂᄌ":"뜑","뜌ᄂᄒ":"뜒","뜌ᄃ":"뜓","뜌ᄅ":"뜔","뜌ᄅᄀ":"뜕","뜌ᄅᄆ":"뜖","뜌ᄅᄇ":"뜗","뜌ᄅᄉ":"뜘","뜌ᄅᄐ":"뜙","뜌ᄅᄑ":"뜚","뜌ᄅᄒ":"뜛","뜌ᄆ":"뜜","뜌ᄇ":"뜝","뜌ᄇᄉ":"뜞","뜌ᄉ":"뜟","뜌ᄊ":"뜠","뜌ᄋ":"뜡","뜌ᄌ":"뜢","뜌ᄎ":"뜣","뜌ᄏ":"뜤","뜌ᄐ":"뜥","뜌ᄑ":"뜦","뜌ᄒ":"뜧","뜨":"뜨","뜨ᄀ":"뜩","뜨ᄁ":"뜪","뜨ᄀᄉ":"뜫","뜨ᄂ":"뜬","뜨ᄂᄌ":"뜭","뜨ᄂᄒ":"뜮","뜨ᄃ":"뜯","뜨ᄅ":"뜰","뜨ᄅᄀ":"뜱","뜨ᄅᄆ":"뜲","뜨ᄅᄇ":"뜳","뜨ᄅᄉ":"뜴","뜨ᄅᄐ":"뜵","뜨ᄅᄑ":"뜶","뜨ᄅᄒ":"뜷","뜨ᄆ":"뜸","뜨ᄇ":"뜹","뜨ᄇᄉ":"뜺","뜨ᄉ":"뜻","뜨ᄊ":"뜼","뜨ᄋ":"뜽","뜨ᄌ":"뜾","뜨ᄎ":"뜿","뜨ᄏ":"띀","뜨ᄐ":"띁","뜨ᄑ":"띂","뜨ᄒ":"띃","뜨ᅵ":"띄","뜨ᅵᄀ":"띅","뜨ᅵᄁ":"띆","뜨ᅵᄀᄉ":"띇","뜨ᅵᄂ":"띈","뜨ᅵᄂᄌ":"띉","뜨ᅵᄂᄒ":"띊","뜨ᅵᄃ":"띋","뜨ᅵᄅ":"띌","뜨ᅵᄅᄀ":"띍","뜨ᅵᄅᄆ":"띎","뜨ᅵᄅᄇ":"띏","뜨ᅵᄅᄉ":"띐","뜨ᅵᄅᄐ":"띑","뜨ᅵᄅᄑ":"띒","뜨ᅵᄅᄒ":"띓","뜨ᅵᄆ":"띔","뜨ᅵᄇ":"띕","뜨ᅵᄇᄉ":"띖","뜨ᅵᄉ":"띗","뜨ᅵᄊ":"띘","뜨ᅵᄋ":"띙","뜨ᅵᄌ":"띚","뜨ᅵᄎ":"띛","뜨ᅵᄏ":"띜","뜨ᅵᄐ":"띝","뜨ᅵᄑ":"띞","뜨ᅵᄒ":"띟","띠":"띠","띠ᄀ":"띡","띠ᄁ":"띢","띠ᄀᄉ":"띣","띠ᄂ":"띤","띠ᄂᄌ":"띥","띠ᄂᄒ":"띦","띠ᄃ":"띧","띠ᄅ":"띨","띠ᄅᄀ":"띩","띠ᄅᄆ":"띪","띠ᄅᄇ":"띫","띠ᄅᄉ":"띬","띠ᄅᄐ":"띭","띠ᄅᄑ":"띮","띠ᄅᄒ":"띯","띠ᄆ":"띰","띠ᄇ":"띱","띠ᄇᄉ":"띲","띠ᄉ":"띳","띠ᄊ":"띴","띠ᄋ":"띵","띠ᄌ":"띶","띠ᄎ":"띷","띠ᄏ":"띸","띠ᄐ":"띹","띠ᄑ":"띺","띠ᄒ":"띻","라":"라","라ᄀ":"락","라ᄁ":"띾","라ᄀᄉ":"띿","라ᄂ":"란","라ᄂᄌ":"랁","라ᄂᄒ":"랂","라ᄃ":"랃","라ᄅ":"랄","라ᄅᄀ":"랅","라ᄅᄆ":"랆","라ᄅᄇ":"랇","라ᄅᄉ":"랈","라ᄅᄐ":"랉","라ᄅᄑ":"랊","라ᄅᄒ":"랋","라ᄆ":"람","라ᄇ":"랍","라ᄇᄉ":"랎","라ᄉ":"랏","라ᄊ":"랐","라ᄋ":"랑","라ᄌ":"랒","라ᄎ":"랓","라ᄏ":"랔","라ᄐ":"랕","라ᄑ":"랖","라ᄒ":"랗","래":"래","래ᄀ":"랙","래ᄁ":"랚","래ᄀᄉ":"랛","래ᄂ":"랜","래ᄂᄌ":"랝","래ᄂᄒ":"랞","래ᄃ":"랟","래ᄅ":"랠","래ᄅᄀ":"랡","래ᄅᄆ":"랢","래ᄅᄇ":"랣","래ᄅᄉ":"랤","래ᄅᄐ":"랥","래ᄅᄑ":"랦","래ᄅᄒ":"랧","래ᄆ":"램","래ᄇ":"랩","래ᄇᄉ":"랪","래ᄉ":"랫","래ᄊ":"랬","래ᄋ":"랭","래ᄌ":"랮","래ᄎ":"랯","래ᄏ":"랰","래ᄐ":"랱","래ᄑ":"랲","래ᄒ":"랳","랴":"랴","랴ᄀ":"략","랴ᄁ":"랶","랴ᄀᄉ":"랷","랴ᄂ":"랸","랴ᄂᄌ":"랹","랴ᄂᄒ":"랺","랴ᄃ":"랻","랴ᄅ":"랼","랴ᄅᄀ":"랽","랴ᄅᄆ":"랾","랴ᄅᄇ":"랿","랴ᄅᄉ":"럀","랴ᄅᄐ":"럁","랴ᄅᄑ":"럂","랴ᄅᄒ":"럃","랴ᄆ":"럄","랴ᄇ":"럅","랴ᄇᄉ":"럆","랴ᄉ":"럇","랴ᄊ":"럈","랴ᄋ":"량","랴ᄌ":"럊","랴ᄎ":"럋","랴ᄏ":"럌","랴ᄐ":"럍","랴ᄑ":"럎","랴ᄒ":"럏","럐":"럐","럐ᄀ":"럑","럐ᄁ":"럒","럐ᄀᄉ":"럓","럐ᄂ":"럔","럐ᄂᄌ":"럕","럐ᄂᄒ":"럖","럐ᄃ":"럗","럐ᄅ":"럘","럐ᄅᄀ":"럙","럐ᄅᄆ":"럚","럐ᄅᄇ":"럛","럐ᄅᄉ":"럜","럐ᄅᄐ":"럝","럐ᄅᄑ":"럞","럐ᄅᄒ":"럟","럐ᄆ":"럠","럐ᄇ":"럡","럐ᄇᄉ":"럢","럐ᄉ":"럣","럐ᄊ":"럤","럐ᄋ":"럥","럐ᄌ":"럦","럐ᄎ":"럧","럐ᄏ":"럨","럐ᄐ":"럩","럐ᄑ":"럪","럐ᄒ":"럫","러":"러","러ᄀ":"럭","러ᄁ":"럮","러ᄀᄉ":"럯","러ᄂ":"런","러ᄂᄌ":"럱","러ᄂᄒ":"럲","러ᄃ":"럳","러ᄅ":"럴","러ᄅᄀ":"럵","러ᄅᄆ":"럶","러ᄅᄇ":"럷","러ᄅᄉ":"럸","러ᄅᄐ":"럹","러ᄅᄑ":"럺","러ᄅᄒ":"럻","러ᄆ":"럼","러ᄇ":"럽","러ᄇᄉ":"럾","러ᄉ":"럿","러ᄊ":"렀","러ᄋ":"렁","러ᄌ":"렂","러ᄎ":"렃","러ᄏ":"렄","러ᄐ":"렅","러ᄑ":"렆","러ᄒ":"렇","레":"레","레ᄀ":"렉","레ᄁ":"렊","레ᄀᄉ":"렋","레ᄂ":"렌","레ᄂᄌ":"렍","레ᄂᄒ":"렎","레ᄃ":"렏","레ᄅ":"렐","레ᄅᄀ":"렑","레ᄅᄆ":"렒","레ᄅᄇ":"렓","레ᄅᄉ":"렔","레ᄅᄐ":"렕","레ᄅᄑ":"렖","레ᄅᄒ":"렗","레ᄆ":"렘","레ᄇ":"렙","레ᄇᄉ":"렚","레ᄉ":"렛","레ᄊ":"렜","레ᄋ":"렝","레ᄌ":"렞","레ᄎ":"렟","레ᄏ":"렠","레ᄐ":"렡","레ᄑ":"렢","레ᄒ":"렣","려":"려","려ᄀ":"력","려ᄁ":"렦","려ᄀᄉ":"렧","려ᄂ":"련","려ᄂᄌ":"렩","려ᄂᄒ":"렪","려ᄃ":"렫","려ᄅ":"렬","려ᄅᄀ":"렭","려ᄅᄆ":"렮","려ᄅᄇ":"렯","려ᄅᄉ":"렰","려ᄅᄐ":"렱","려ᄅᄑ":"렲","려ᄅᄒ":"렳","려ᄆ":"렴","려ᄇ":"렵","려ᄇᄉ":"렶","려ᄉ":"렷","려ᄊ":"렸","려ᄋ":"령","려ᄌ":"렺","려ᄎ":"렻","려ᄏ":"렼","려ᄐ":"렽","려ᄑ":"렾","려ᄒ":"렿","례":"례","례ᄀ":"롁","례ᄁ":"롂","례ᄀᄉ":"롃","례ᄂ":"롄","례ᄂᄌ":"롅","례ᄂᄒ":"롆","례ᄃ":"롇","례ᄅ":"롈","례ᄅᄀ":"롉","례ᄅᄆ":"롊","례ᄅᄇ":"롋","례ᄅᄉ":"롌","례ᄅᄐ":"롍","례ᄅᄑ":"롎","례ᄅᄒ":"롏","례ᄆ":"롐","례ᄇ":"롑","례ᄇᄉ":"롒","례ᄉ":"롓","례ᄊ":"롔","례ᄋ":"롕","례ᄌ":"롖","례ᄎ":"롗","례ᄏ":"롘","례ᄐ":"롙","례ᄑ":"롚","례ᄒ":"롛","로":"로","로ᄀ":"록","로ᄁ":"롞","로ᄀᄉ":"롟","로ᄂ":"론","로ᄂᄌ":"롡","로ᄂᄒ":"롢","로ᄃ":"롣","로ᄅ":"롤","로ᄅᄀ":"롥","로ᄅᄆ":"롦","로ᄅᄇ":"롧","로ᄅᄉ":"롨","로ᄅᄐ":"롩","로ᄅᄑ":"롪","로ᄅᄒ":"롫","로ᄆ":"롬","로ᄇ":"롭","로ᄇᄉ":"롮","로ᄉ":"롯","로ᄊ":"롰","로ᄋ":"롱","로ᄌ":"롲","로ᄎ":"롳","로ᄏ":"롴","로ᄐ":"롵","로ᄑ":"롶","로ᄒ":"롷","로ᅡ":"롸","로ᅡᄀ":"롹","로ᅡᄁ":"롺","로ᅡᄀᄉ":"롻","로ᅡᄂ":"롼","로ᅡᄂᄌ":"롽","로ᅡᄂᄒ":"롾","로ᅡᄃ":"롿","로ᅡᄅ":"뢀","로ᅡᄅᄀ":"뢁","로ᅡᄅᄆ":"뢂","로ᅡᄅᄇ":"뢃","로ᅡᄅᄉ":"뢄","로ᅡᄅᄐ":"뢅","로ᅡᄅᄑ":"뢆","로ᅡᄅᄒ":"뢇","로ᅡᄆ":"뢈","로ᅡᄇ":"뢉","로ᅡᄇᄉ":"뢊","로ᅡᄉ":"뢋","로ᅡᄊ":"뢌","로ᅡᄋ":"뢍","로ᅡᄌ":"뢎","로ᅡᄎ":"뢏","로ᅡᄏ":"뢐","로ᅡᄐ":"뢑","로ᅡᄑ":"뢒","로ᅡᄒ":"뢓","로ᅢ":"뢔","로ᅢᄀ":"뢕","로ᅢᄁ":"뢖","로ᅢᄀᄉ":"뢗","로ᅢᄂ":"뢘","로ᅢᄂᄌ":"뢙","로ᅢᄂᄒ":"뢚","로ᅢᄃ":"뢛","로ᅢᄅ":"뢜","로ᅢᄅᄀ":"뢝","로ᅢᄅᄆ":"뢞","로ᅢᄅᄇ":"뢟","로ᅢᄅᄉ":"뢠","로ᅢᄅᄐ":"뢡","로ᅢᄅᄑ":"뢢","로ᅢᄅᄒ":"뢣","로ᅢᄆ":"뢤","로ᅢᄇ":"뢥","로ᅢᄇᄉ":"뢦","로ᅢᄉ":"뢧","로ᅢᄊ":"뢨","로ᅢᄋ":"뢩","로ᅢᄌ":"뢪","로ᅢᄎ":"뢫","로ᅢᄏ":"뢬","로ᅢᄐ":"뢭","로ᅢᄑ":"뢮","로ᅢᄒ":"뢯","로ᅵ":"뢰","로ᅵᄀ":"뢱","로ᅵᄁ":"뢲","로ᅵᄀᄉ":"뢳","로ᅵᄂ":"뢴","로ᅵᄂᄌ":"뢵","로ᅵᄂᄒ":"뢶","로ᅵᄃ":"뢷","로ᅵᄅ":"뢸","로ᅵᄅᄀ":"뢹","로ᅵᄅᄆ":"뢺","로ᅵᄅᄇ":"뢻","로ᅵᄅᄉ":"뢼","로ᅵᄅᄐ":"뢽","로ᅵᄅᄑ":"뢾","로ᅵᄅᄒ":"뢿","로ᅵᄆ":"룀","로ᅵᄇ":"룁","로ᅵᄇᄉ":"룂","로ᅵᄉ":"룃","로ᅵᄊ":"룄","로ᅵᄋ":"룅","로ᅵᄌ":"룆","로ᅵᄎ":"룇","로ᅵᄏ":"룈","로ᅵᄐ":"룉","로ᅵᄑ":"룊","로ᅵᄒ":"룋","료":"료","료ᄀ":"룍","료ᄁ":"룎","료ᄀᄉ":"룏","료ᄂ":"룐","료ᄂᄌ":"룑","료ᄂᄒ":"룒","료ᄃ":"룓","료ᄅ":"룔","료ᄅᄀ":"룕","료ᄅᄆ":"룖","료ᄅᄇ":"룗","료ᄅᄉ":"룘","료ᄅᄐ":"룙","료ᄅᄑ":"룚","료ᄅᄒ":"룛","료ᄆ":"룜","료ᄇ":"룝","료ᄇᄉ":"룞","료ᄉ":"룟","료ᄊ":"룠","료ᄋ":"룡","료ᄌ":"룢","료ᄎ":"룣","료ᄏ":"룤","료ᄐ":"룥","료ᄑ":"룦","료ᄒ":"룧","루":"루","루ᄀ":"룩","루ᄁ":"룪","루ᄀᄉ":"룫","루ᄂ":"룬","루ᄂᄌ":"룭","루ᄂᄒ":"룮","루ᄃ":"룯","루ᄅ":"룰","루ᄅᄀ":"룱","루ᄅᄆ":"룲","루ᄅᄇ":"룳","루ᄅᄉ":"룴","루ᄅᄐ":"룵","루ᄅᄑ":"룶","루ᄅᄒ":"룷","루ᄆ":"룸","루ᄇ":"룹","루ᄇᄉ":"룺","루ᄉ":"룻","루ᄊ":"룼","루ᄋ":"룽","루ᄌ":"룾","루ᄎ":"룿","루ᄏ":"뤀","루ᄐ":"뤁","루ᄑ":"뤂","루ᄒ":"뤃","루ᅥ":"뤄","루ᅥᄀ":"뤅","루ᅥᄁ":"뤆","루ᅥᄀᄉ":"뤇","루ᅥᄂ":"뤈","루ᅥᄂᄌ":"뤉","루ᅥᄂᄒ":"뤊","루ᅥᄃ":"뤋","루ᅥᄅ":"뤌","루ᅥᄅᄀ":"뤍","루ᅥᄅᄆ":"뤎","루ᅥᄅᄇ":"뤏","루ᅥᄅᄉ":"뤐","루ᅥᄅᄐ":"뤑","루ᅥᄅᄑ":"뤒","루ᅥᄅᄒ":"뤓","루ᅥᄆ":"뤔","루ᅥᄇ":"뤕","루ᅥᄇᄉ":"뤖","루ᅥᄉ":"뤗","루ᅥᄊ":"뤘","루ᅥᄋ":"뤙","루ᅥᄌ":"뤚","루ᅥᄎ":"뤛","루ᅥᄏ":"뤜","루ᅥᄐ":"뤝","루ᅥᄑ":"뤞","루ᅥᄒ":"뤟","루ᅦ":"뤠","루ᅦᄀ":"뤡","루ᅦᄁ":"뤢","루ᅦᄀᄉ":"뤣","루ᅦᄂ":"뤤","루ᅦᄂᄌ":"뤥","루ᅦᄂᄒ":"뤦","루ᅦᄃ":"뤧","루ᅦᄅ":"뤨","루ᅦᄅᄀ":"뤩","루ᅦᄅᄆ":"뤪","루ᅦᄅᄇ":"뤫","루ᅦᄅᄉ":"뤬","루ᅦᄅᄐ":"뤭","루ᅦᄅᄑ":"뤮","루ᅦᄅᄒ":"뤯","루ᅦᄆ":"뤰","루ᅦᄇ":"뤱","루ᅦᄇᄉ":"뤲","루ᅦᄉ":"뤳","루ᅦᄊ":"뤴","루ᅦᄋ":"뤵","루ᅦᄌ":"뤶","루ᅦᄎ":"뤷","루ᅦᄏ":"뤸","루ᅦᄐ":"뤹","루ᅦᄑ":"뤺","루ᅦᄒ":"뤻","루ᅵ":"뤼","루ᅵᄀ":"뤽","루ᅵᄁ":"뤾","루ᅵᄀᄉ":"뤿","루ᅵᄂ":"륀","루ᅵᄂᄌ":"륁","루ᅵᄂᄒ":"륂","루ᅵᄃ":"륃","루ᅵᄅ":"륄","루ᅵᄅᄀ":"륅","루ᅵᄅᄆ":"륆","루ᅵᄅᄇ":"륇","루ᅵᄅᄉ":"륈","루ᅵᄅᄐ":"륉","루ᅵᄅᄑ":"륊","루ᅵᄅᄒ":"륋","루ᅵᄆ":"륌","루ᅵᄇ":"륍","루ᅵᄇᄉ":"륎","루ᅵᄉ":"륏","루ᅵᄊ":"륐","루ᅵᄋ":"륑","루ᅵᄌ":"륒","루ᅵᄎ":"륓","루ᅵᄏ":"륔","루ᅵᄐ":"륕","루ᅵᄑ":"륖","루ᅵᄒ":"륗","류":"류","류ᄀ":"륙","류ᄁ":"륚","류ᄀᄉ":"륛","류ᄂ":"륜","류ᄂᄌ":"륝","류ᄂᄒ":"륞","류ᄃ":"륟","류ᄅ":"률","류ᄅᄀ":"륡","류ᄅᄆ":"륢","류ᄅᄇ":"륣","류ᄅᄉ":"륤","류ᄅᄐ":"륥","류ᄅᄑ":"륦","류ᄅᄒ":"륧","류ᄆ":"륨","류ᄇ":"륩","류ᄇᄉ":"륪","류ᄉ":"륫","류ᄊ":"륬","류ᄋ":"륭","류ᄌ":"륮","류ᄎ":"륯","류ᄏ":"륰","류ᄐ":"륱","류ᄑ":"륲","류ᄒ":"륳","르":"르","르ᄀ":"륵","르ᄁ":"륶","르ᄀᄉ":"륷","르ᄂ":"른","르ᄂᄌ":"륹","르ᄂᄒ":"륺","르ᄃ":"륻","르ᄅ":"를","르ᄅᄀ":"륽","르ᄅᄆ":"륾","르ᄅᄇ":"륿","르ᄅᄉ":"릀","르ᄅᄐ":"릁","르ᄅᄑ":"릂","르ᄅᄒ":"릃","르ᄆ":"름","르ᄇ":"릅","르ᄇᄉ":"릆","르ᄉ":"릇","르ᄊ":"릈","르ᄋ":"릉","르ᄌ":"릊","르ᄎ":"릋","르ᄏ":"릌","르ᄐ":"릍","르ᄑ":"릎","르ᄒ":"릏","르ᅵ":"릐","르ᅵᄀ":"릑","르ᅵᄁ":"릒","르ᅵᄀᄉ":"릓","르ᅵᄂ":"릔","르ᅵᄂᄌ":"릕","르ᅵᄂᄒ":"릖","르ᅵᄃ":"릗","르ᅵᄅ":"릘","르ᅵᄅᄀ":"릙","르ᅵᄅᄆ":"릚","르ᅵᄅᄇ":"릛","르ᅵᄅᄉ":"릜","르ᅵᄅᄐ":"릝","르ᅵᄅᄑ":"릞","르ᅵᄅᄒ":"릟","르ᅵᄆ":"릠","르ᅵᄇ":"릡","르ᅵᄇᄉ":"릢","르ᅵᄉ":"릣","르ᅵᄊ":"릤","르ᅵᄋ":"릥","르ᅵᄌ":"릦","르ᅵᄎ":"릧","르ᅵᄏ":"릨","르ᅵᄐ":"릩","르ᅵᄑ":"릪","르ᅵᄒ":"릫","리":"리","리ᄀ":"릭","리ᄁ":"릮","리ᄀᄉ":"릯","리ᄂ":"린","리ᄂᄌ":"릱","리ᄂᄒ":"릲","리ᄃ":"릳","리ᄅ":"릴","리ᄅᄀ":"릵","리ᄅᄆ":"릶","리ᄅᄇ":"릷","리ᄅᄉ":"릸","리ᄅᄐ":"릹","리ᄅᄑ":"릺","리ᄅᄒ":"릻","리ᄆ":"림","리ᄇ":"립","리ᄇᄉ":"릾","리ᄉ":"릿","리ᄊ":"맀","리ᄋ":"링","리ᄌ":"맂","리ᄎ":"맃","리ᄏ":"맄","리ᄐ":"맅","리ᄑ":"맆","리ᄒ":"맇","마":"마","마ᄀ":"막","마ᄁ":"맊","마ᄀᄉ":"맋","마ᄂ":"만","마ᄂᄌ":"맍","마ᄂᄒ":"많","마ᄃ":"맏","마ᄅ":"말","마ᄅᄀ":"맑","마ᄅᄆ":"맒","마ᄅᄇ":"맓","마ᄅᄉ":"맔","마ᄅᄐ":"맕","마ᄅᄑ":"맖","마ᄅᄒ":"맗","마ᄆ":"맘","마ᄇ":"맙","마ᄇᄉ":"맚","마ᄉ":"맛","마ᄊ":"맜","마ᄋ":"망","마ᄌ":"맞","마ᄎ":"맟","마ᄏ":"맠","마ᄐ":"맡","마ᄑ":"맢","마ᄒ":"맣","매":"매","매ᄀ":"맥","매ᄁ":"맦","매ᄀᄉ":"맧","매ᄂ":"맨","매ᄂᄌ":"맩","매ᄂᄒ":"맪","매ᄃ":"맫","매ᄅ":"맬","매ᄅᄀ":"맭","매ᄅᄆ":"맮","매ᄅᄇ":"맯","매ᄅᄉ":"맰","매ᄅᄐ":"맱","매ᄅᄑ":"맲","매ᄅᄒ":"맳","매ᄆ":"맴","매ᄇ":"맵","매ᄇᄉ":"맶","매ᄉ":"맷","매ᄊ":"맸","매ᄋ":"맹","매ᄌ":"맺","매ᄎ":"맻","매ᄏ":"맼","매ᄐ":"맽","매ᄑ":"맾","매ᄒ":"맿","먀":"먀","먀ᄀ":"먁","먀ᄁ":"먂","먀ᄀᄉ":"먃","먀ᄂ":"먄","먀ᄂᄌ":"먅","먀ᄂᄒ":"먆","먀ᄃ":"먇","먀ᄅ":"먈","먀ᄅᄀ":"먉","먀ᄅᄆ":"먊","먀ᄅᄇ":"먋","먀ᄅᄉ":"먌","먀ᄅᄐ":"먍","먀ᄅᄑ":"먎","먀ᄅᄒ":"먏","먀ᄆ":"먐","먀ᄇ":"먑","먀ᄇᄉ":"먒","먀ᄉ":"먓","먀ᄊ":"먔","먀ᄋ":"먕","먀ᄌ":"먖","먀ᄎ":"먗","먀ᄏ":"먘","먀ᄐ":"먙","먀ᄑ":"먚","먀ᄒ":"먛","먜":"먜","먜ᄀ":"먝","먜ᄁ":"먞","먜ᄀᄉ":"먟","먜ᄂ":"먠","먜ᄂᄌ":"먡","먜ᄂᄒ":"먢","먜ᄃ":"먣","먜ᄅ":"먤","먜ᄅᄀ":"먥","먜ᄅᄆ":"먦","먜ᄅᄇ":"먧","먜ᄅᄉ":"먨","먜ᄅᄐ":"먩","먜ᄅᄑ":"먪","먜ᄅᄒ":"먫","먜ᄆ":"먬","먜ᄇ":"먭","먜ᄇᄉ":"먮","먜ᄉ":"먯","먜ᄊ":"먰","먜ᄋ":"먱","먜ᄌ":"먲","먜ᄎ":"먳","먜ᄏ":"먴","먜ᄐ":"먵","먜ᄑ":"먶","먜ᄒ":"먷","머":"머","머ᄀ":"먹","머ᄁ":"먺","머ᄀᄉ":"먻","머ᄂ":"먼","머ᄂᄌ":"먽","머ᄂᄒ":"먾","머ᄃ":"먿","머ᄅ":"멀","머ᄅᄀ":"멁","머ᄅᄆ":"멂","머ᄅᄇ":"멃","머ᄅᄉ":"멄","머ᄅᄐ":"멅","머ᄅᄑ":"멆","머ᄅᄒ":"멇","머ᄆ":"멈","머ᄇ":"멉","머ᄇᄉ":"멊","머ᄉ":"멋","머ᄊ":"멌","머ᄋ":"멍","머ᄌ":"멎","머ᄎ":"멏","머ᄏ":"멐","머ᄐ":"멑","머ᄑ":"멒","머ᄒ":"멓","메":"메","메ᄀ":"멕","메ᄁ":"멖","메ᄀᄉ":"멗","메ᄂ":"멘","메ᄂᄌ":"멙","메ᄂᄒ":"멚","메ᄃ":"멛","메ᄅ":"멜","메ᄅᄀ":"멝","메ᄅᄆ":"멞","메ᄅᄇ":"멟","메ᄅᄉ":"멠","메ᄅᄐ":"멡","메ᄅᄑ":"멢","메ᄅᄒ":"멣","메ᄆ":"멤","메ᄇ":"멥","메ᄇᄉ":"멦","메ᄉ":"멧","메ᄊ":"멨","메ᄋ":"멩","메ᄌ":"멪","메ᄎ":"멫","메ᄏ":"멬","메ᄐ":"멭","메ᄑ":"멮","메ᄒ":"멯","며":"며","며ᄀ":"멱","며ᄁ":"멲","며ᄀᄉ":"멳","며ᄂ":"면","며ᄂᄌ":"멵","며ᄂᄒ":"멶","며ᄃ":"멷","며ᄅ":"멸","며ᄅᄀ":"멹","며ᄅᄆ":"멺","며ᄅᄇ":"멻","며ᄅᄉ":"멼","며ᄅᄐ":"멽","며ᄅᄑ":"멾","며ᄅᄒ":"멿","며ᄆ":"몀","며ᄇ":"몁","며ᄇᄉ":"몂","며ᄉ":"몃","며ᄊ":"몄","며ᄋ":"명","며ᄌ":"몆","며ᄎ":"몇","며ᄏ":"몈","며ᄐ":"몉","며ᄑ":"몊","며ᄒ":"몋","몌":"몌","몌ᄀ":"몍","몌ᄁ":"몎","몌ᄀᄉ":"몏","몌ᄂ":"몐","몌ᄂᄌ":"몑","몌ᄂᄒ":"몒","몌ᄃ":"몓","몌ᄅ":"몔","몌ᄅᄀ":"몕","몌ᄅᄆ":"몖","몌ᄅᄇ":"몗","몌ᄅᄉ":"몘","몌ᄅᄐ":"몙","몌ᄅᄑ":"몚","몌ᄅᄒ":"몛","몌ᄆ":"몜","몌ᄇ":"몝","몌ᄇᄉ":"몞","몌ᄉ":"몟","몌ᄊ":"몠","몌ᄋ":"몡","몌ᄌ":"몢","몌ᄎ":"몣","몌ᄏ":"몤","몌ᄐ":"몥","몌ᄑ":"몦","몌ᄒ":"몧","모":"모","모ᄀ":"목","모ᄁ":"몪","모ᄀᄉ":"몫","모ᄂ":"몬","모ᄂᄌ":"몭","모ᄂᄒ":"몮","모ᄃ":"몯","모ᄅ":"몰","모ᄅᄀ":"몱","모ᄅᄆ":"몲","모ᄅᄇ":"몳","모ᄅᄉ":"몴","모ᄅᄐ":"몵","모ᄅᄑ":"몶","모ᄅᄒ":"몷","모ᄆ":"몸","모ᄇ":"몹","모ᄇᄉ":"몺","모ᄉ":"못","모ᄊ":"몼","모ᄋ":"몽","모ᄌ":"몾","모ᄎ":"몿","모ᄏ":"뫀","모ᄐ":"뫁","모ᄑ":"뫂","모ᄒ":"뫃","모ᅡ":"뫄","모ᅡᄀ":"뫅","모ᅡᄁ":"뫆","모ᅡᄀᄉ":"뫇","모ᅡᄂ":"뫈","모ᅡᄂᄌ":"뫉","모ᅡᄂᄒ":"뫊","모ᅡᄃ":"뫋","모ᅡᄅ":"뫌","모ᅡᄅᄀ":"뫍","모ᅡᄅᄆ":"뫎","모ᅡᄅᄇ":"뫏","모ᅡᄅᄉ":"뫐","모ᅡᄅᄐ":"뫑","모ᅡᄅᄑ":"뫒","모ᅡᄅᄒ":"뫓","모ᅡᄆ":"뫔","모ᅡᄇ":"뫕","모ᅡᄇᄉ":"뫖","모ᅡᄉ":"뫗","모ᅡᄊ":"뫘","모ᅡᄋ":"뫙","모ᅡᄌ":"뫚","모ᅡᄎ":"뫛","모ᅡᄏ":"뫜","모ᅡᄐ":"뫝","모ᅡᄑ":"뫞","모ᅡᄒ":"뫟","모ᅢ":"뫠","모ᅢᄀ":"뫡","모ᅢᄁ":"뫢","모ᅢᄀᄉ":"뫣","모ᅢᄂ":"뫤","모ᅢᄂᄌ":"뫥","모ᅢᄂᄒ":"뫦","모ᅢᄃ":"뫧","모ᅢᄅ":"뫨","모ᅢᄅᄀ":"뫩","모ᅢᄅᄆ":"뫪","모ᅢᄅᄇ":"뫫","모ᅢᄅᄉ":"뫬","모ᅢᄅᄐ":"뫭","모ᅢᄅᄑ":"뫮","모ᅢᄅᄒ":"뫯","모ᅢᄆ":"뫰","모ᅢᄇ":"뫱","모ᅢᄇᄉ":"뫲","모ᅢᄉ":"뫳","모ᅢᄊ":"뫴","모ᅢᄋ":"뫵","모ᅢᄌ":"뫶","모ᅢᄎ":"뫷","모ᅢᄏ":"뫸","모ᅢᄐ":"뫹","모ᅢᄑ":"뫺","모ᅢᄒ":"뫻","모ᅵ":"뫼","모ᅵᄀ":"뫽","모ᅵᄁ":"뫾","모ᅵᄀᄉ":"뫿","모ᅵᄂ":"묀","모ᅵᄂᄌ":"묁","모ᅵᄂᄒ":"묂","모ᅵᄃ":"묃","모ᅵᄅ":"묄","모ᅵᄅᄀ":"묅","모ᅵᄅᄆ":"묆","모ᅵᄅᄇ":"묇","모ᅵᄅᄉ":"묈","모ᅵᄅᄐ":"묉","모ᅵᄅᄑ":"묊","모ᅵᄅᄒ":"묋","모ᅵᄆ":"묌","모ᅵᄇ":"묍","모ᅵᄇᄉ":"묎","모ᅵᄉ":"묏","모ᅵᄊ":"묐","모ᅵᄋ":"묑","모ᅵᄌ":"묒","모ᅵᄎ":"묓","모ᅵᄏ":"묔","모ᅵᄐ":"묕","모ᅵᄑ":"묖","모ᅵᄒ":"묗","묘":"묘","묘ᄀ":"묙","묘ᄁ":"묚","묘ᄀᄉ":"묛","묘ᄂ":"묜","묘ᄂᄌ":"묝","묘ᄂᄒ":"묞","묘ᄃ":"묟","묘ᄅ":"묠","묘ᄅᄀ":"묡","묘ᄅᄆ":"묢","묘ᄅᄇ":"묣","묘ᄅᄉ":"묤","묘ᄅᄐ":"묥","묘ᄅᄑ":"묦","묘ᄅᄒ":"묧","묘ᄆ":"묨","묘ᄇ":"묩","묘ᄇᄉ":"묪","묘ᄉ":"묫","묘ᄊ":"묬","묘ᄋ":"묭","묘ᄌ":"묮","묘ᄎ":"묯","묘ᄏ":"묰","묘ᄐ":"묱","묘ᄑ":"묲","묘ᄒ":"묳","무":"무","무ᄀ":"묵","무ᄁ":"묶","무ᄀᄉ":"묷","무ᄂ":"문","무ᄂᄌ":"묹","무ᄂᄒ":"묺","무ᄃ":"묻","무ᄅ":"물","무ᄅᄀ":"묽","무ᄅᄆ":"묾","무ᄅᄇ":"묿","무ᄅᄉ":"뭀","무ᄅᄐ":"뭁","무ᄅᄑ":"뭂","무ᄅᄒ":"뭃","무ᄆ":"뭄","무ᄇ":"뭅","무ᄇᄉ":"뭆","무ᄉ":"뭇","무ᄊ":"뭈","무ᄋ":"뭉","무ᄌ":"뭊","무ᄎ":"뭋","무ᄏ":"뭌","무ᄐ":"뭍","무ᄑ":"뭎","무ᄒ":"뭏","무ᅥ":"뭐","무ᅥᄀ":"뭑","무ᅥᄁ":"뭒","무ᅥᄀᄉ":"뭓","무ᅥᄂ":"뭔","무ᅥᄂᄌ":"뭕","무ᅥᄂᄒ":"뭖","무ᅥᄃ":"뭗","무ᅥᄅ":"뭘","무ᅥᄅᄀ":"뭙","무ᅥᄅᄆ":"뭚","무ᅥᄅᄇ":"뭛","무ᅥᄅᄉ":"뭜","무ᅥᄅᄐ":"뭝","무ᅥᄅᄑ":"뭞","무ᅥᄅᄒ":"뭟","무ᅥᄆ":"뭠","무ᅥᄇ":"뭡","무ᅥᄇᄉ":"뭢","무ᅥᄉ":"뭣","무ᅥᄊ":"뭤","무ᅥᄋ":"뭥","무ᅥᄌ":"뭦","무ᅥᄎ":"뭧","무ᅥᄏ":"뭨","무ᅥᄐ":"뭩","무ᅥᄑ":"뭪","무ᅥᄒ":"뭫","무ᅦ":"뭬","무ᅦᄀ":"뭭","무ᅦᄁ":"뭮","무ᅦᄀᄉ":"뭯","무ᅦᄂ":"뭰","무ᅦᄂᄌ":"뭱","무ᅦᄂᄒ":"뭲","무ᅦᄃ":"뭳","무ᅦᄅ":"뭴","무ᅦᄅᄀ":"뭵","무ᅦᄅᄆ":"뭶","무ᅦᄅᄇ":"뭷","무ᅦᄅᄉ":"뭸","무ᅦᄅᄐ":"뭹","무ᅦᄅᄑ":"뭺","무ᅦᄅᄒ":"뭻","무ᅦᄆ":"뭼","무ᅦᄇ":"뭽","무ᅦᄇᄉ":"뭾","무ᅦᄉ":"뭿","무ᅦᄊ":"뮀","무ᅦᄋ":"뮁","무ᅦᄌ":"뮂","무ᅦᄎ":"뮃","무ᅦᄏ":"뮄","무ᅦᄐ":"뮅","무ᅦᄑ":"뮆","무ᅦᄒ":"뮇","무ᅵ":"뮈","무ᅵᄀ":"뮉","무ᅵᄁ":"뮊","무ᅵᄀᄉ":"뮋","무ᅵᄂ":"뮌","무ᅵᄂᄌ":"뮍","무ᅵᄂᄒ":"뮎","무ᅵᄃ":"뮏","무ᅵᄅ":"뮐","무ᅵᄅᄀ":"뮑","무ᅵᄅᄆ":"뮒","무ᅵᄅᄇ":"뮓","무ᅵᄅᄉ":"뮔","무ᅵᄅᄐ":"뮕","무ᅵᄅᄑ":"뮖","무ᅵᄅᄒ":"뮗","무ᅵᄆ":"뮘","무ᅵᄇ":"뮙","무ᅵᄇᄉ":"뮚","무ᅵᄉ":"뮛","무ᅵᄊ":"뮜","무ᅵᄋ":"뮝","무ᅵᄌ":"뮞","무ᅵᄎ":"뮟","무ᅵᄏ":"뮠","무ᅵᄐ":"뮡","무ᅵᄑ":"뮢","무ᅵᄒ":"뮣","뮤":"뮤","뮤ᄀ":"뮥","뮤ᄁ":"뮦","뮤ᄀᄉ":"뮧","뮤ᄂ":"뮨","뮤ᄂᄌ":"뮩","뮤ᄂᄒ":"뮪","뮤ᄃ":"뮫","뮤ᄅ":"뮬","뮤ᄅᄀ":"뮭","뮤ᄅᄆ":"뮮","뮤ᄅᄇ":"뮯","뮤ᄅᄉ":"뮰","뮤ᄅᄐ":"뮱","뮤ᄅᄑ":"뮲","뮤ᄅᄒ":"뮳","뮤ᄆ":"뮴","뮤ᄇ":"뮵","뮤ᄇᄉ":"뮶","뮤ᄉ":"뮷","뮤ᄊ":"뮸","뮤ᄋ":"뮹","뮤ᄌ":"뮺","뮤ᄎ":"뮻","뮤ᄏ":"뮼","뮤ᄐ":"뮽","뮤ᄑ":"뮾","뮤ᄒ":"뮿","므":"므","므ᄀ":"믁","므ᄁ":"믂","므ᄀᄉ":"믃","므ᄂ":"믄","므ᄂᄌ":"믅","므ᄂᄒ":"믆","므ᄃ":"믇","므ᄅ":"믈","므ᄅᄀ":"믉","므ᄅᄆ":"믊","므ᄅᄇ":"믋","므ᄅᄉ":"믌","므ᄅᄐ":"믍","므ᄅᄑ":"믎","므ᄅᄒ":"믏","므ᄆ":"믐","므ᄇ":"믑","므ᄇᄉ":"믒","므ᄉ":"믓","므ᄊ":"믔","므ᄋ":"믕","므ᄌ":"믖","므ᄎ":"믗","므ᄏ":"믘","므ᄐ":"믙","므ᄑ":"믚","므ᄒ":"믛","므ᅵ":"믜","므ᅵᄀ":"믝","므ᅵᄁ":"믞","므ᅵᄀᄉ":"믟","므ᅵᄂ":"믠","므ᅵᄂᄌ":"믡","므ᅵᄂᄒ":"믢","므ᅵᄃ":"믣","므ᅵᄅ":"믤","므ᅵᄅᄀ":"믥","므ᅵᄅᄆ":"믦","므ᅵᄅᄇ":"믧","므ᅵᄅᄉ":"믨","므ᅵᄅᄐ":"믩","므ᅵᄅᄑ":"믪","므ᅵᄅᄒ":"믫","므ᅵᄆ":"믬","므ᅵᄇ":"믭","므ᅵᄇᄉ":"믮","므ᅵᄉ":"믯","므ᅵᄊ":"믰","므ᅵᄋ":"믱","므ᅵᄌ":"믲","므ᅵᄎ":"믳","므ᅵᄏ":"믴","므ᅵᄐ":"믵","므ᅵᄑ":"믶","므ᅵᄒ":"믷","미":"미","미ᄀ":"믹","미ᄁ":"믺","미ᄀᄉ":"믻","미ᄂ":"민","미ᄂᄌ":"믽","미ᄂᄒ":"믾","미ᄃ":"믿","미ᄅ":"밀","미ᄅᄀ":"밁","미ᄅᄆ":"밂","미ᄅᄇ":"밃","미ᄅᄉ":"밄","미ᄅᄐ":"밅","미ᄅᄑ":"밆","미ᄅᄒ":"밇","미ᄆ":"밈","미ᄇ":"밉","미ᄇᄉ":"밊","미ᄉ":"밋","미ᄊ":"밌","미ᄋ":"밍","미ᄌ":"밎","미ᄎ":"및","미ᄏ":"밐","미ᄐ":"밑","미ᄑ":"밒","미ᄒ":"밓","바":"바","바ᄀ":"박","바ᄁ":"밖","바ᄀᄉ":"밗","바ᄂ":"반","바ᄂᄌ":"밙","바ᄂᄒ":"밚","바ᄃ":"받","바ᄅ":"발","바ᄅᄀ":"밝","바ᄅᄆ":"밞","바ᄅᄇ":"밟","바ᄅᄉ":"밠","바ᄅᄐ":"밡","바ᄅᄑ":"밢","바ᄅᄒ":"밣","바ᄆ":"밤","바ᄇ":"밥","바ᄇᄉ":"밦","바ᄉ":"밧","바ᄊ":"밨","바ᄋ":"방","바ᄌ":"밪","바ᄎ":"밫","바ᄏ":"밬","바ᄐ":"밭","바ᄑ":"밮","바ᄒ":"밯","배":"배","배ᄀ":"백","배ᄁ":"밲","배ᄀᄉ":"밳","배ᄂ":"밴","배ᄂᄌ":"밵","배ᄂᄒ":"밶","배ᄃ":"밷","배ᄅ":"밸","배ᄅᄀ":"밹","배ᄅᄆ":"밺","배ᄅᄇ":"밻","배ᄅᄉ":"밼","배ᄅᄐ":"밽","배ᄅᄑ":"밾","배ᄅᄒ":"밿","배ᄆ":"뱀","배ᄇ":"뱁","배ᄇᄉ":"뱂","배ᄉ":"뱃","배ᄊ":"뱄","배ᄋ":"뱅","배ᄌ":"뱆","배ᄎ":"뱇","배ᄏ":"뱈","배ᄐ":"뱉","배ᄑ":"뱊","배ᄒ":"뱋","뱌":"뱌","뱌ᄀ":"뱍","뱌ᄁ":"뱎","뱌ᄀᄉ":"뱏","뱌ᄂ":"뱐","뱌ᄂᄌ":"뱑","뱌ᄂᄒ":"뱒","뱌ᄃ":"뱓","뱌ᄅ":"뱔","뱌ᄅᄀ":"뱕","뱌ᄅᄆ":"뱖","뱌ᄅᄇ":"뱗","뱌ᄅᄉ":"뱘","뱌ᄅᄐ":"뱙","뱌ᄅᄑ":"뱚","뱌ᄅᄒ":"뱛","뱌ᄆ":"뱜","뱌ᄇ":"뱝","뱌ᄇᄉ":"뱞","뱌ᄉ":"뱟","뱌ᄊ":"뱠","뱌ᄋ":"뱡","뱌ᄌ":"뱢","뱌ᄎ":"뱣","뱌ᄏ":"뱤","뱌ᄐ":"뱥","뱌ᄑ":"뱦","뱌ᄒ":"뱧","뱨":"뱨","뱨ᄀ":"뱩","뱨ᄁ":"뱪","뱨ᄀᄉ":"뱫","뱨ᄂ":"뱬","뱨ᄂᄌ":"뱭","뱨ᄂᄒ":"뱮","뱨ᄃ":"뱯","뱨ᄅ":"뱰","뱨ᄅᄀ":"뱱","뱨ᄅᄆ":"뱲","뱨ᄅᄇ":"뱳","뱨ᄅᄉ":"뱴","뱨ᄅᄐ":"뱵","뱨ᄅᄑ":"뱶","뱨ᄅᄒ":"뱷","뱨ᄆ":"뱸","뱨ᄇ":"뱹","뱨ᄇᄉ":"뱺","뱨ᄉ":"뱻","뱨ᄊ":"뱼","뱨ᄋ":"뱽","뱨ᄌ":"뱾","뱨ᄎ":"뱿","뱨ᄏ":"벀","뱨ᄐ":"벁","뱨ᄑ":"벂","뱨ᄒ":"벃","버":"버","버ᄀ":"벅","버ᄁ":"벆","버ᄀᄉ":"벇","버ᄂ":"번","버ᄂᄌ":"벉","버ᄂᄒ":"벊","버ᄃ":"벋","버ᄅ":"벌","버ᄅᄀ":"벍","버ᄅᄆ":"벎","버ᄅᄇ":"벏","버ᄅᄉ":"벐","버ᄅᄐ":"벑","버ᄅᄑ":"벒","버ᄅᄒ":"벓","버ᄆ":"범","버ᄇ":"법","버ᄇᄉ":"벖","버ᄉ":"벗","버ᄊ":"벘","버ᄋ":"벙","버ᄌ":"벚","버ᄎ":"벛","버ᄏ":"벜","버ᄐ":"벝","버ᄑ":"벞","버ᄒ":"벟","베":"베","베ᄀ":"벡","베ᄁ":"벢","베ᄀᄉ":"벣","베ᄂ":"벤","베ᄂᄌ":"벥","베ᄂᄒ":"벦","베ᄃ":"벧","베ᄅ":"벨","베ᄅᄀ":"벩","베ᄅᄆ":"벪","베ᄅᄇ":"벫","베ᄅᄉ":"벬","베ᄅᄐ":"벭","베ᄅᄑ":"벮","베ᄅᄒ":"벯","베ᄆ":"벰","베ᄇ":"벱","베ᄇᄉ":"벲","베ᄉ":"벳","베ᄊ":"벴","베ᄋ":"벵","베ᄌ":"벶","베ᄎ":"벷","베ᄏ":"벸","베ᄐ":"벹","베ᄑ":"벺","베ᄒ":"벻","벼":"벼","벼ᄀ":"벽","벼ᄁ":"벾","벼ᄀᄉ":"벿","벼ᄂ":"변","벼ᄂᄌ":"볁","벼ᄂᄒ":"볂","벼ᄃ":"볃","벼ᄅ":"별","벼ᄅᄀ":"볅","벼ᄅᄆ":"볆","벼ᄅᄇ":"볇","벼ᄅᄉ":"볈","벼ᄅᄐ":"볉","벼ᄅᄑ":"볊","벼ᄅᄒ":"볋","벼ᄆ":"볌","벼ᄇ":"볍","벼ᄇᄉ":"볎","벼ᄉ":"볏","벼ᄊ":"볐","벼ᄋ":"병","벼ᄌ":"볒","벼ᄎ":"볓","벼ᄏ":"볔","벼ᄐ":"볕","벼ᄑ":"볖","벼ᄒ":"볗","볘":"볘","볘ᄀ":"볙","볘ᄁ":"볚","볘ᄀᄉ":"볛","볘ᄂ":"볜","볘ᄂᄌ":"볝","볘ᄂᄒ":"볞","볘ᄃ":"볟","볘ᄅ":"볠","볘ᄅᄀ":"볡","볘ᄅᄆ":"볢","볘ᄅᄇ":"볣","볘ᄅᄉ":"볤","볘ᄅᄐ":"볥","볘ᄅᄑ":"볦","볘ᄅᄒ":"볧","볘ᄆ":"볨","볘ᄇ":"볩","볘ᄇᄉ":"볪","볘ᄉ":"볫","볘ᄊ":"볬","볘ᄋ":"볭","볘ᄌ":"볮","볘ᄎ":"볯","볘ᄏ":"볰","볘ᄐ":"볱","볘ᄑ":"볲","볘ᄒ":"볳","보":"보","보ᄀ":"복","보ᄁ":"볶","보ᄀᄉ":"볷","보ᄂ":"본","보ᄂᄌ":"볹","보ᄂᄒ":"볺","보ᄃ":"볻","보ᄅ":"볼","보ᄅᄀ":"볽","보ᄅᄆ":"볾","보ᄅᄇ":"볿","보ᄅᄉ":"봀","보ᄅᄐ":"봁","보ᄅᄑ":"봂","보ᄅᄒ":"봃","보ᄆ":"봄","보ᄇ":"봅","보ᄇᄉ":"봆","보ᄉ":"봇","보ᄊ":"봈","보ᄋ":"봉","보ᄌ":"봊","보ᄎ":"봋","보ᄏ":"봌","보ᄐ":"봍","보ᄑ":"봎","보ᄒ":"봏","보ᅡ":"봐","보ᅡᄀ":"봑","보ᅡᄁ":"봒","보ᅡᄀᄉ":"봓","보ᅡᄂ":"봔","보ᅡᄂᄌ":"봕","보ᅡᄂᄒ":"봖","보ᅡᄃ":"봗","보ᅡᄅ":"봘","보ᅡᄅᄀ":"봙","보ᅡᄅᄆ":"봚","보ᅡᄅᄇ":"봛","보ᅡᄅᄉ":"봜","보ᅡᄅᄐ":"봝","보ᅡᄅᄑ":"봞","보ᅡᄅᄒ":"봟","보ᅡᄆ":"봠","보ᅡᄇ":"봡","보ᅡᄇᄉ":"봢","보ᅡᄉ":"봣","보ᅡᄊ":"봤","보ᅡᄋ":"봥","보ᅡᄌ":"봦","보ᅡᄎ":"봧","보ᅡᄏ":"봨","보ᅡᄐ":"봩","보ᅡᄑ":"봪","보ᅡᄒ":"봫","보ᅢ":"봬","보ᅢᄀ":"봭","보ᅢᄁ":"봮","보ᅢᄀᄉ":"봯","보ᅢᄂ":"봰","보ᅢᄂᄌ":"봱","보ᅢᄂᄒ":"봲","보ᅢᄃ":"봳","보ᅢᄅ":"봴","보ᅢᄅᄀ":"봵","보ᅢᄅᄆ":"봶","보ᅢᄅᄇ":"봷","보ᅢᄅᄉ":"봸","보ᅢᄅᄐ":"봹","보ᅢᄅᄑ":"봺","보ᅢᄅᄒ":"봻","보ᅢᄆ":"봼","보ᅢᄇ":"봽","보ᅢᄇᄉ":"봾","보ᅢᄉ":"봿","보ᅢᄊ":"뵀","보ᅢᄋ":"뵁","보ᅢᄌ":"뵂","보ᅢᄎ":"뵃","보ᅢᄏ":"뵄","보ᅢᄐ":"뵅","보ᅢᄑ":"뵆","보ᅢᄒ":"뵇","보ᅵ":"뵈","보ᅵᄀ":"뵉","보ᅵᄁ":"뵊","보ᅵᄀᄉ":"뵋","보ᅵᄂ":"뵌","보ᅵᄂᄌ":"뵍","보ᅵᄂᄒ":"뵎","보ᅵᄃ":"뵏","보ᅵᄅ":"뵐","보ᅵᄅᄀ":"뵑","보ᅵᄅᄆ":"뵒","보ᅵᄅᄇ":"뵓","보ᅵᄅᄉ":"뵔","보ᅵᄅᄐ":"뵕","보ᅵᄅᄑ":"뵖","보ᅵᄅᄒ":"뵗","보ᅵᄆ":"뵘","보ᅵᄇ":"뵙","보ᅵᄇᄉ":"뵚","보ᅵᄉ":"뵛","보ᅵᄊ":"뵜","보ᅵᄋ":"뵝","보ᅵᄌ":"뵞","보ᅵᄎ":"뵟","보ᅵᄏ":"뵠","보ᅵᄐ":"뵡","보ᅵᄑ":"뵢","보ᅵᄒ":"뵣","뵤":"뵤","뵤ᄀ":"뵥","뵤ᄁ":"뵦","뵤ᄀᄉ":"뵧","뵤ᄂ":"뵨","뵤ᄂᄌ":"뵩","뵤ᄂᄒ":"뵪","뵤ᄃ":"뵫","뵤ᄅ":"뵬","뵤ᄅᄀ":"뵭","뵤ᄅᄆ":"뵮","뵤ᄅᄇ":"뵯","뵤ᄅᄉ":"뵰","뵤ᄅᄐ":"뵱","뵤ᄅᄑ":"뵲","뵤ᄅᄒ":"뵳","뵤ᄆ":"뵴","뵤ᄇ":"뵵","뵤ᄇᄉ":"뵶","뵤ᄉ":"뵷","뵤ᄊ":"뵸","뵤ᄋ":"뵹","뵤ᄌ":"뵺","뵤ᄎ":"뵻","뵤ᄏ":"뵼","뵤ᄐ":"뵽","뵤ᄑ":"뵾","뵤ᄒ":"뵿","부":"부","부ᄀ":"북","부ᄁ":"붂","부ᄀᄉ":"붃","부ᄂ":"분","부ᄂᄌ":"붅","부ᄂᄒ":"붆","부ᄃ":"붇","부ᄅ":"불","부ᄅᄀ":"붉","부ᄅᄆ":"붊","부ᄅᄇ":"붋","부ᄅᄉ":"붌","부ᄅᄐ":"붍","부ᄅᄑ":"붎","부ᄅᄒ":"붏","부ᄆ":"붐","부ᄇ":"붑","부ᄇᄉ":"붒","부ᄉ":"붓","부ᄊ":"붔","부ᄋ":"붕","부ᄌ":"붖","부ᄎ":"붗","부ᄏ":"붘","부ᄐ":"붙","부ᄑ":"붚","부ᄒ":"붛","부ᅥ":"붜","부ᅥᄀ":"붝","부ᅥᄁ":"붞","부ᅥᄀᄉ":"붟","부ᅥᄂ":"붠","부ᅥᄂᄌ":"붡","부ᅥᄂᄒ":"붢","부ᅥᄃ":"붣","부ᅥᄅ":"붤","부ᅥᄅᄀ":"붥","부ᅥᄅᄆ":"붦","부ᅥᄅᄇ":"붧","부ᅥᄅᄉ":"붨","부ᅥᄅᄐ":"붩","부ᅥᄅᄑ":"붪","부ᅥᄅᄒ":"붫","부ᅥᄆ":"붬","부ᅥᄇ":"붭","부ᅥᄇᄉ":"붮","부ᅥᄉ":"붯","부ᅥᄊ":"붰","부ᅥᄋ":"붱","부ᅥᄌ":"붲","부ᅥᄎ":"붳","부ᅥᄏ":"붴","부ᅥᄐ":"붵","부ᅥᄑ":"붶","부ᅥᄒ":"붷","부ᅦ":"붸","부ᅦᄀ":"붹","부ᅦᄁ":"붺","부ᅦᄀᄉ":"붻","부ᅦᄂ":"붼","부ᅦᄂᄌ":"붽","부ᅦᄂᄒ":"붾","부ᅦᄃ":"붿","부ᅦᄅ":"뷀","부ᅦᄅᄀ":"뷁","부ᅦᄅᄆ":"뷂","부ᅦᄅᄇ":"뷃","부ᅦᄅᄉ":"뷄","부ᅦᄅᄐ":"뷅","부ᅦᄅᄑ":"뷆","부ᅦᄅᄒ":"뷇","부ᅦᄆ":"뷈","부ᅦᄇ":"뷉","부ᅦᄇᄉ":"뷊","부ᅦᄉ":"뷋","부ᅦᄊ":"뷌","부ᅦᄋ":"뷍","부ᅦᄌ":"뷎","부ᅦᄎ":"뷏","부ᅦᄏ":"뷐","부ᅦᄐ":"뷑","부ᅦᄑ":"뷒","부ᅦᄒ":"뷓","부ᅵ":"뷔","부ᅵᄀ":"뷕","부ᅵᄁ":"뷖","부ᅵᄀᄉ":"뷗","부ᅵᄂ":"뷘","부ᅵᄂᄌ":"뷙","부ᅵᄂᄒ":"뷚","부ᅵᄃ":"뷛","부ᅵᄅ":"뷜","부ᅵᄅᄀ":"뷝","부ᅵᄅᄆ":"뷞","부ᅵᄅᄇ":"뷟","부ᅵᄅᄉ":"뷠","부ᅵᄅᄐ":"뷡","부ᅵᄅᄑ":"뷢","부ᅵᄅᄒ":"뷣","부ᅵᄆ":"뷤","부ᅵᄇ":"뷥","부ᅵᄇᄉ":"뷦","부ᅵᄉ":"뷧","부ᅵᄊ":"뷨","부ᅵᄋ":"뷩","부ᅵᄌ":"뷪","부ᅵᄎ":"뷫","부ᅵᄏ":"뷬","부ᅵᄐ":"뷭","부ᅵᄑ":"뷮","부ᅵᄒ":"뷯","뷰":"뷰","뷰ᄀ":"뷱","뷰ᄁ":"뷲","뷰ᄀᄉ":"뷳","뷰ᄂ":"뷴","뷰ᄂᄌ":"뷵","뷰ᄂᄒ":"뷶","뷰ᄃ":"뷷","뷰ᄅ":"뷸","뷰ᄅᄀ":"뷹","뷰ᄅᄆ":"뷺","뷰ᄅᄇ":"뷻","뷰ᄅᄉ":"뷼","뷰ᄅᄐ":"뷽","뷰ᄅᄑ":"뷾","뷰ᄅᄒ":"뷿","뷰ᄆ":"븀","뷰ᄇ":"븁","뷰ᄇᄉ":"븂","뷰ᄉ":"븃","뷰ᄊ":"븄","뷰ᄋ":"븅","뷰ᄌ":"븆","뷰ᄎ":"븇","뷰ᄏ":"븈","뷰ᄐ":"븉","뷰ᄑ":"븊","뷰ᄒ":"븋","브":"브","브ᄀ":"븍","브ᄁ":"븎","브ᄀᄉ":"븏","브ᄂ":"븐","브ᄂᄌ":"븑","브ᄂᄒ":"븒","브ᄃ":"븓","브ᄅ":"블","브ᄅᄀ":"븕","브ᄅᄆ":"븖","브ᄅᄇ":"븗","브ᄅᄉ":"븘","브ᄅᄐ":"븙","브ᄅᄑ":"븚","브ᄅᄒ":"븛","브ᄆ":"븜","브ᄇ":"븝","브ᄇᄉ":"븞","브ᄉ":"븟","브ᄊ":"븠","브ᄋ":"븡","브ᄌ":"븢","브ᄎ":"븣","브ᄏ":"븤","브ᄐ":"븥","브ᄑ":"븦","브ᄒ":"븧","브ᅵ":"븨","브ᅵᄀ":"븩","브ᅵᄁ":"븪","브ᅵᄀᄉ":"븫","브ᅵᄂ":"븬","브ᅵᄂᄌ":"븭","브ᅵᄂᄒ":"븮","브ᅵᄃ":"븯","브ᅵᄅ":"븰","브ᅵᄅᄀ":"븱","브ᅵᄅᄆ":"븲","브ᅵᄅᄇ":"븳","브ᅵᄅᄉ":"븴","브ᅵᄅᄐ":"븵","브ᅵᄅᄑ":"븶","브ᅵᄅᄒ":"븷","브ᅵᄆ":"븸","브ᅵᄇ":"븹","브ᅵᄇᄉ":"븺","브ᅵᄉ":"븻","브ᅵᄊ":"븼","브ᅵᄋ":"븽","브ᅵᄌ":"븾","브ᅵᄎ":"븿","브ᅵᄏ":"빀","브ᅵᄐ":"빁","브ᅵᄑ":"빂","브ᅵᄒ":"빃","비":"비","비ᄀ":"빅","비ᄁ":"빆","비ᄀᄉ":"빇","비ᄂ":"빈","비ᄂᄌ":"빉","비ᄂᄒ":"빊","비ᄃ":"빋","비ᄅ":"빌","비ᄅᄀ":"빍","비ᄅᄆ":"빎","비ᄅᄇ":"빏","비ᄅᄉ":"빐","비ᄅᄐ":"빑","비ᄅᄑ":"빒","비ᄅᄒ":"빓","비ᄆ":"빔","비ᄇ":"빕","비ᄇᄉ":"빖","비ᄉ":"빗","비ᄊ":"빘","비ᄋ":"빙","비ᄌ":"빚","비ᄎ":"빛","비ᄏ":"빜","비ᄐ":"빝","비ᄑ":"빞","비ᄒ":"빟","빠":"빠","빠ᄀ":"빡","빠ᄁ":"빢","빠ᄀᄉ":"빣","빠ᄂ":"빤","빠ᄂᄌ":"빥","빠ᄂᄒ":"빦","빠ᄃ":"빧","빠ᄅ":"빨","빠ᄅᄀ":"빩","빠ᄅᄆ":"빪","빠ᄅᄇ":"빫","빠ᄅᄉ":"빬","빠ᄅᄐ":"빭","빠ᄅᄑ":"빮","빠ᄅᄒ":"빯","빠ᄆ":"빰","빠ᄇ":"빱","빠ᄇᄉ":"빲","빠ᄉ":"빳","빠ᄊ":"빴","빠ᄋ":"빵","빠ᄌ":"빶","빠ᄎ":"빷","빠ᄏ":"빸","빠ᄐ":"빹","빠ᄑ":"빺","빠ᄒ":"빻","빼":"빼","빼ᄀ":"빽","빼ᄁ":"빾","빼ᄀᄉ":"빿","빼ᄂ":"뺀","빼ᄂᄌ":"뺁","빼ᄂᄒ":"뺂","빼ᄃ":"뺃","빼ᄅ":"뺄","빼ᄅᄀ":"뺅","빼ᄅᄆ":"뺆","빼ᄅᄇ":"뺇","빼ᄅᄉ":"뺈","빼ᄅᄐ":"뺉","빼ᄅᄑ":"뺊","빼ᄅᄒ":"뺋","빼ᄆ":"뺌","빼ᄇ":"뺍","빼ᄇᄉ":"뺎","빼ᄉ":"뺏","빼ᄊ":"뺐","빼ᄋ":"뺑","빼ᄌ":"뺒","빼ᄎ":"뺓","빼ᄏ":"뺔","빼ᄐ":"뺕","빼ᄑ":"뺖","빼ᄒ":"뺗","뺘":"뺘","뺘ᄀ":"뺙","뺘ᄁ":"뺚","뺘ᄀᄉ":"뺛","뺘ᄂ":"뺜","뺘ᄂᄌ":"뺝","뺘ᄂᄒ":"뺞","뺘ᄃ":"뺟","뺘ᄅ":"뺠","뺘ᄅᄀ":"뺡","뺘ᄅᄆ":"뺢","뺘ᄅᄇ":"뺣","뺘ᄅᄉ":"뺤","뺘ᄅᄐ":"뺥","뺘ᄅᄑ":"뺦","뺘ᄅᄒ":"뺧","뺘ᄆ":"뺨","뺘ᄇ":"뺩","뺘ᄇᄉ":"뺪","뺘ᄉ":"뺫","뺘ᄊ":"뺬","뺘ᄋ":"뺭","뺘ᄌ":"뺮","뺘ᄎ":"뺯","뺘ᄏ":"뺰","뺘ᄐ":"뺱","뺘ᄑ":"뺲","뺘ᄒ":"뺳","뺴":"뺴","뺴ᄀ":"뺵","뺴ᄁ":"뺶","뺴ᄀᄉ":"뺷","뺴ᄂ":"뺸","뺴ᄂᄌ":"뺹","뺴ᄂᄒ":"뺺","뺴ᄃ":"뺻","뺴ᄅ":"뺼","뺴ᄅᄀ":"뺽","뺴ᄅᄆ":"뺾","뺴ᄅᄇ":"뺿","뺴ᄅᄉ":"뻀","뺴ᄅᄐ":"뻁","뺴ᄅᄑ":"뻂","뺴ᄅᄒ":"뻃","뺴ᄆ":"뻄","뺴ᄇ":"뻅","뺴ᄇᄉ":"뻆","뺴ᄉ":"뻇","뺴ᄊ":"뻈","뺴ᄋ":"뻉","뺴ᄌ":"뻊","뺴ᄎ":"뻋","뺴ᄏ":"뻌","뺴ᄐ":"뻍","뺴ᄑ":"뻎","뺴ᄒ":"뻏","뻐":"뻐","뻐ᄀ":"뻑","뻐ᄁ":"뻒","뻐ᄀᄉ":"뻓","뻐ᄂ":"뻔","뻐ᄂᄌ":"뻕","뻐ᄂᄒ":"뻖","뻐ᄃ":"뻗","뻐ᄅ":"뻘","뻐ᄅᄀ":"뻙","뻐ᄅᄆ":"뻚","뻐ᄅᄇ":"뻛","뻐ᄅᄉ":"뻜","뻐ᄅᄐ":"뻝","뻐ᄅᄑ":"뻞","뻐ᄅᄒ":"뻟","뻐ᄆ":"뻠","뻐ᄇ":"뻡","뻐ᄇᄉ":"뻢","뻐ᄉ":"뻣","뻐ᄊ":"뻤","뻐ᄋ":"뻥","뻐ᄌ":"뻦","뻐ᄎ":"뻧","뻐ᄏ":"뻨","뻐ᄐ":"뻩","뻐ᄑ":"뻪","뻐ᄒ":"뻫","뻬":"뻬","뻬ᄀ":"뻭","뻬ᄁ":"뻮","뻬ᄀᄉ":"뻯","뻬ᄂ":"뻰","뻬ᄂᄌ":"뻱","뻬ᄂᄒ":"뻲","뻬ᄃ":"뻳","뻬ᄅ":"뻴","뻬ᄅᄀ":"뻵","뻬ᄅᄆ":"뻶","뻬ᄅᄇ":"뻷","뻬ᄅᄉ":"뻸","뻬ᄅᄐ":"뻹","뻬ᄅᄑ":"뻺","뻬ᄅᄒ":"뻻","뻬ᄆ":"뻼","뻬ᄇ":"뻽","뻬ᄇᄉ":"뻾","뻬ᄉ":"뻿","뻬ᄊ":"뼀","뻬ᄋ":"뼁","뻬ᄌ":"뼂","뻬ᄎ":"뼃","뻬ᄏ":"뼄","뻬ᄐ":"뼅","뻬ᄑ":"뼆","뻬ᄒ":"뼇","뼈":"뼈","뼈ᄀ":"뼉","뼈ᄁ":"뼊","뼈ᄀᄉ":"뼋","뼈ᄂ":"뼌","뼈ᄂᄌ":"뼍","뼈ᄂᄒ":"뼎","뼈ᄃ":"뼏","뼈ᄅ":"뼐","뼈ᄅᄀ":"뼑","뼈ᄅᄆ":"뼒","뼈ᄅᄇ":"뼓","뼈ᄅᄉ":"뼔","뼈ᄅᄐ":"뼕","뼈ᄅᄑ":"뼖","뼈ᄅᄒ":"뼗","뼈ᄆ":"뼘","뼈ᄇ":"뼙","뼈ᄇᄉ":"뼚","뼈ᄉ":"뼛","뼈ᄊ":"뼜","뼈ᄋ":"뼝","뼈ᄌ":"뼞","뼈ᄎ":"뼟","뼈ᄏ":"뼠","뼈ᄐ":"뼡","뼈ᄑ":"뼢","뼈ᄒ":"뼣","뼤":"뼤","뼤ᄀ":"뼥","뼤ᄁ":"뼦","뼤ᄀᄉ":"뼧","뼤ᄂ":"뼨","뼤ᄂᄌ":"뼩","뼤ᄂᄒ":"뼪","뼤ᄃ":"뼫","뼤ᄅ":"뼬","뼤ᄅᄀ":"뼭","뼤ᄅᄆ":"뼮","뼤ᄅᄇ":"뼯","뼤ᄅᄉ":"뼰","뼤ᄅᄐ":"뼱","뼤ᄅᄑ":"뼲","뼤ᄅᄒ":"뼳","뼤ᄆ":"뼴","뼤ᄇ":"뼵","뼤ᄇᄉ":"뼶","뼤ᄉ":"뼷","뼤ᄊ":"뼸","뼤ᄋ":"뼹","뼤ᄌ":"뼺","뼤ᄎ":"뼻","뼤ᄏ":"뼼","뼤ᄐ":"뼽","뼤ᄑ":"뼾","뼤ᄒ":"뼿","뽀":"뽀","뽀ᄀ":"뽁","뽀ᄁ":"뽂","뽀ᄀᄉ":"뽃","뽀ᄂ":"뽄","뽀ᄂᄌ":"뽅","뽀ᄂᄒ":"뽆","뽀ᄃ":"뽇","뽀ᄅ":"뽈","뽀ᄅᄀ":"뽉","뽀ᄅᄆ":"뽊","뽀ᄅᄇ":"뽋","뽀ᄅᄉ":"뽌","뽀ᄅᄐ":"뽍","뽀ᄅᄑ":"뽎","뽀ᄅᄒ":"뽏","뽀ᄆ":"뽐","뽀ᄇ":"뽑","뽀ᄇᄉ":"뽒","뽀ᄉ":"뽓","뽀ᄊ":"뽔","뽀ᄋ":"뽕","뽀ᄌ":"뽖","뽀ᄎ":"뽗","뽀ᄏ":"뽘","뽀ᄐ":"뽙","뽀ᄑ":"뽚","뽀ᄒ":"뽛","뽀ᅡ":"뽜","뽀ᅡᄀ":"뽝","뽀ᅡᄁ":"뽞","뽀ᅡᄀᄉ":"뽟","뽀ᅡᄂ":"뽠","뽀ᅡᄂᄌ":"뽡","뽀ᅡᄂᄒ":"뽢","뽀ᅡᄃ":"뽣","뽀ᅡᄅ":"뽤","뽀ᅡᄅᄀ":"뽥","뽀ᅡᄅᄆ":"뽦","뽀ᅡᄅᄇ":"뽧","뽀ᅡᄅᄉ":"뽨","뽀ᅡᄅᄐ":"뽩","뽀ᅡᄅᄑ":"뽪","뽀ᅡᄅᄒ":"뽫","뽀ᅡᄆ":"뽬","뽀ᅡᄇ":"뽭","뽀ᅡᄇᄉ":"뽮","뽀ᅡᄉ":"뽯","뽀ᅡᄊ":"뽰","뽀ᅡᄋ":"뽱","뽀ᅡᄌ":"뽲","뽀ᅡᄎ":"뽳","뽀ᅡᄏ":"뽴","뽀ᅡᄐ":"뽵","뽀ᅡᄑ":"뽶","뽀ᅡᄒ":"뽷","뽀ᅢ":"뽸","뽀ᅢᄀ":"뽹","뽀ᅢᄁ":"뽺","뽀ᅢᄀᄉ":"뽻","뽀ᅢᄂ":"뽼","뽀ᅢᄂᄌ":"뽽","뽀ᅢᄂᄒ":"뽾","뽀ᅢᄃ":"뽿","뽀ᅢᄅ":"뾀","뽀ᅢᄅᄀ":"뾁","뽀ᅢᄅᄆ":"뾂","뽀ᅢᄅᄇ":"뾃","뽀ᅢᄅᄉ":"뾄","뽀ᅢᄅᄐ":"뾅","뽀ᅢᄅᄑ":"뾆","뽀ᅢᄅᄒ":"뾇","뽀ᅢᄆ":"뾈","뽀ᅢᄇ":"뾉","뽀ᅢᄇᄉ":"뾊","뽀ᅢᄉ":"뾋","뽀ᅢᄊ":"뾌","뽀ᅢᄋ":"뾍","뽀ᅢᄌ":"뾎","뽀ᅢᄎ":"뾏","뽀ᅢᄏ":"뾐","뽀ᅢᄐ":"뾑","뽀ᅢᄑ":"뾒","뽀ᅢᄒ":"뾓","뽀ᅵ":"뾔","뽀ᅵᄀ":"뾕","뽀ᅵᄁ":"뾖","뽀ᅵᄀᄉ":"뾗","뽀ᅵᄂ":"뾘","뽀ᅵᄂᄌ":"뾙","뽀ᅵᄂᄒ":"뾚","뽀ᅵᄃ":"뾛","뽀ᅵᄅ":"뾜","뽀ᅵᄅᄀ":"뾝","뽀ᅵᄅᄆ":"뾞","뽀ᅵᄅᄇ":"뾟","뽀ᅵᄅᄉ":"뾠","뽀ᅵᄅᄐ":"뾡","뽀ᅵᄅᄑ":"뾢","뽀ᅵᄅᄒ":"뾣","뽀ᅵᄆ":"뾤","뽀ᅵᄇ":"뾥","뽀ᅵᄇᄉ":"뾦","뽀ᅵᄉ":"뾧","뽀ᅵᄊ":"뾨","뽀ᅵᄋ":"뾩","뽀ᅵᄌ":"뾪","뽀ᅵᄎ":"뾫","뽀ᅵᄏ":"뾬","뽀ᅵᄐ":"뾭","뽀ᅵᄑ":"뾮","뽀ᅵᄒ":"뾯","뾰":"뾰","뾰ᄀ":"뾱","뾰ᄁ":"뾲","뾰ᄀᄉ":"뾳","뾰ᄂ":"뾴","뾰ᄂᄌ":"뾵","뾰ᄂᄒ":"뾶","뾰ᄃ":"뾷","뾰ᄅ":"뾸","뾰ᄅᄀ":"뾹","뾰ᄅᄆ":"뾺","뾰ᄅᄇ":"뾻","뾰ᄅᄉ":"뾼","뾰ᄅᄐ":"뾽","뾰ᄅᄑ":"뾾","뾰ᄅᄒ":"뾿","뾰ᄆ":"뿀","뾰ᄇ":"뿁","뾰ᄇᄉ":"뿂","뾰ᄉ":"뿃","뾰ᄊ":"뿄","뾰ᄋ":"뿅","뾰ᄌ":"뿆","뾰ᄎ":"뿇","뾰ᄏ":"뿈","뾰ᄐ":"뿉","뾰ᄑ":"뿊","뾰ᄒ":"뿋","뿌":"뿌","뿌ᄀ":"뿍","뿌ᄁ":"뿎","뿌ᄀᄉ":"뿏","뿌ᄂ":"뿐","뿌ᄂᄌ":"뿑","뿌ᄂᄒ":"뿒","뿌ᄃ":"뿓","뿌ᄅ":"뿔","뿌ᄅᄀ":"뿕","뿌ᄅᄆ":"뿖","뿌ᄅᄇ":"뿗","뿌ᄅᄉ":"뿘","뿌ᄅᄐ":"뿙","뿌ᄅᄑ":"뿚","뿌ᄅᄒ":"뿛","뿌ᄆ":"뿜","뿌ᄇ":"뿝","뿌ᄇᄉ":"뿞","뿌ᄉ":"뿟","뿌ᄊ":"뿠","뿌ᄋ":"뿡","뿌ᄌ":"뿢","뿌ᄎ":"뿣","뿌ᄏ":"뿤","뿌ᄐ":"뿥","뿌ᄑ":"뿦","뿌ᄒ":"뿧","뿌ᅥ":"뿨","뿌ᅥᄀ":"뿩","뿌ᅥᄁ":"뿪","뿌ᅥᄀᄉ":"뿫","뿌ᅥᄂ":"뿬","뿌ᅥᄂᄌ":"뿭","뿌ᅥᄂᄒ":"뿮","뿌ᅥᄃ":"뿯","뿌ᅥᄅ":"뿰","뿌ᅥᄅᄀ":"뿱","뿌ᅥᄅᄆ":"뿲","뿌ᅥᄅᄇ":"뿳","뿌ᅥᄅᄉ":"뿴","뿌ᅥᄅᄐ":"뿵","뿌ᅥᄅᄑ":"뿶","뿌ᅥᄅᄒ":"뿷","뿌ᅥᄆ":"뿸","뿌ᅥᄇ":"뿹","뿌ᅥᄇᄉ":"뿺","뿌ᅥᄉ":"뿻","뿌ᅥᄊ":"뿼","뿌ᅥᄋ":"뿽","뿌ᅥᄌ":"뿾","뿌ᅥᄎ":"뿿","뿌ᅥᄏ":"쀀","뿌ᅥᄐ":"쀁","뿌ᅥᄑ":"쀂","뿌ᅥᄒ":"쀃","뿌ᅦ":"쀄","뿌ᅦᄀ":"쀅","뿌ᅦᄁ":"쀆","뿌ᅦᄀᄉ":"쀇","뿌ᅦᄂ":"쀈","뿌ᅦᄂᄌ":"쀉","뿌ᅦᄂᄒ":"쀊","뿌ᅦᄃ":"쀋","뿌ᅦᄅ":"쀌","뿌ᅦᄅᄀ":"쀍","뿌ᅦᄅᄆ":"쀎","뿌ᅦᄅᄇ":"쀏","뿌ᅦᄅᄉ":"쀐","뿌ᅦᄅᄐ":"쀑","뿌ᅦᄅᄑ":"쀒","뿌ᅦᄅᄒ":"쀓","뿌ᅦᄆ":"쀔","뿌ᅦᄇ":"쀕","뿌ᅦᄇᄉ":"쀖","뿌ᅦᄉ":"쀗","뿌ᅦᄊ":"쀘","뿌ᅦᄋ":"쀙","뿌ᅦᄌ":"쀚","뿌ᅦᄎ":"쀛","뿌ᅦᄏ":"쀜","뿌ᅦᄐ":"쀝","뿌ᅦᄑ":"쀞","뿌ᅦᄒ":"쀟","뿌ᅵ":"쀠","뿌ᅵᄀ":"쀡","뿌ᅵᄁ":"쀢","뿌ᅵᄀᄉ":"쀣","뿌ᅵᄂ":"쀤","뿌ᅵᄂᄌ":"쀥","뿌ᅵᄂᄒ":"쀦","뿌ᅵᄃ":"쀧","뿌ᅵᄅ":"쀨","뿌ᅵᄅᄀ":"쀩","뿌ᅵᄅᄆ":"쀪","뿌ᅵᄅᄇ":"쀫","뿌ᅵᄅᄉ":"쀬","뿌ᅵᄅᄐ":"쀭","뿌ᅵᄅᄑ":"쀮","뿌ᅵᄅᄒ":"쀯","뿌ᅵᄆ":"쀰","뿌ᅵᄇ":"쀱","뿌ᅵᄇᄉ":"쀲","뿌ᅵᄉ":"쀳","뿌ᅵᄊ":"쀴","뿌ᅵᄋ":"쀵","뿌ᅵᄌ":"쀶","뿌ᅵᄎ":"쀷","뿌ᅵᄏ":"쀸","뿌ᅵᄐ":"쀹","뿌ᅵᄑ":"쀺","뿌ᅵᄒ":"쀻","쀼":"쀼","쀼ᄀ":"쀽","쀼ᄁ":"쀾","쀼ᄀᄉ":"쀿","쀼ᄂ":"쁀","쀼ᄂᄌ":"쁁","쀼ᄂᄒ":"쁂","쀼ᄃ":"쁃","쀼ᄅ":"쁄","쀼ᄅᄀ":"쁅","쀼ᄅᄆ":"쁆","쀼ᄅᄇ":"쁇","쀼ᄅᄉ":"쁈","쀼ᄅᄐ":"쁉","쀼ᄅᄑ":"쁊","쀼ᄅᄒ":"쁋","쀼ᄆ":"쁌","쀼ᄇ":"쁍","쀼ᄇᄉ":"쁎","쀼ᄉ":"쁏","쀼ᄊ":"쁐","쀼ᄋ":"쁑","쀼ᄌ":"쁒","쀼ᄎ":"쁓","쀼ᄏ":"쁔","쀼ᄐ":"쁕","쀼ᄑ":"쁖","쀼ᄒ":"쁗","쁘":"쁘","쁘ᄀ":"쁙","쁘ᄁ":"쁚","쁘ᄀᄉ":"쁛","쁘ᄂ":"쁜","쁘ᄂᄌ":"쁝","쁘ᄂᄒ":"쁞","쁘ᄃ":"쁟","쁘ᄅ":"쁠","쁘ᄅᄀ":"쁡","쁘ᄅᄆ":"쁢","쁘ᄅᄇ":"쁣","쁘ᄅᄉ":"쁤","쁘ᄅᄐ":"쁥","쁘ᄅᄑ":"쁦","쁘ᄅᄒ":"쁧","쁘ᄆ":"쁨","쁘ᄇ":"쁩","쁘ᄇᄉ":"쁪","쁘ᄉ":"쁫","쁘ᄊ":"쁬","쁘ᄋ":"쁭","쁘ᄌ":"쁮","쁘ᄎ":"쁯","쁘ᄏ":"쁰","쁘ᄐ":"쁱","쁘ᄑ":"쁲","쁘ᄒ":"쁳","쁘ᅵ":"쁴","쁘ᅵᄀ":"쁵","쁘ᅵᄁ":"쁶","쁘ᅵᄀᄉ":"쁷","쁘ᅵᄂ":"쁸","쁘ᅵᄂᄌ":"쁹","쁘ᅵᄂᄒ":"쁺","쁘ᅵᄃ":"쁻","쁘ᅵᄅ":"쁼","쁘ᅵᄅᄀ":"쁽","쁘ᅵᄅᄆ":"쁾","쁘ᅵᄅᄇ":"쁿","쁘ᅵᄅᄉ":"삀","쁘ᅵᄅᄐ":"삁","쁘ᅵᄅᄑ":"삂","쁘ᅵᄅᄒ":"삃","쁘ᅵᄆ":"삄","쁘ᅵᄇ":"삅","쁘ᅵᄇᄉ":"삆","쁘ᅵᄉ":"삇","쁘ᅵᄊ":"삈","쁘ᅵᄋ":"삉","쁘ᅵᄌ":"삊","쁘ᅵᄎ":"삋","쁘ᅵᄏ":"삌","쁘ᅵᄐ":"삍","쁘ᅵᄑ":"삎","쁘ᅵᄒ":"삏","삐":"삐","삐ᄀ":"삑","삐ᄁ":"삒","삐ᄀᄉ":"삓","삐ᄂ":"삔","삐ᄂᄌ":"삕","삐ᄂᄒ":"삖","삐ᄃ":"삗","삐ᄅ":"삘","삐ᄅᄀ":"삙","삐ᄅᄆ":"삚","삐ᄅᄇ":"삛","삐ᄅᄉ":"삜","삐ᄅᄐ":"삝","삐ᄅᄑ":"삞","삐ᄅᄒ":"삟","삐ᄆ":"삠","삐ᄇ":"삡","삐ᄇᄉ":"삢","삐ᄉ":"삣","삐ᄊ":"삤","삐ᄋ":"삥","삐ᄌ":"삦","삐ᄎ":"삧","삐ᄏ":"삨","삐ᄐ":"삩","삐ᄑ":"삪","삐ᄒ":"삫","사":"사","사ᄀ":"삭","사ᄁ":"삮","사ᄀᄉ":"삯","사ᄂ":"산","사ᄂᄌ":"삱","사ᄂᄒ":"삲","사ᄃ":"삳","사ᄅ":"살","사ᄅᄀ":"삵","사ᄅᄆ":"삶","사ᄅᄇ":"삷","사ᄅᄉ":"삸","사ᄅᄐ":"삹","사ᄅᄑ":"삺","사ᄅᄒ":"삻","사ᄆ":"삼","사ᄇ":"삽","사ᄇᄉ":"삾","사ᄉ":"삿","사ᄊ":"샀","사ᄋ":"상","사ᄌ":"샂","사ᄎ":"샃","사ᄏ":"샄","사ᄐ":"샅","사ᄑ":"샆","사ᄒ":"샇","새":"새","새ᄀ":"색","새ᄁ":"샊","새ᄀᄉ":"샋","새ᄂ":"샌","새ᄂᄌ":"샍","새ᄂᄒ":"샎","새ᄃ":"샏","새ᄅ":"샐","새ᄅᄀ":"샑","새ᄅᄆ":"샒","새ᄅᄇ":"샓","새ᄅᄉ":"샔","새ᄅᄐ":"샕","새ᄅᄑ":"샖","새ᄅᄒ":"샗","새ᄆ":"샘","새ᄇ":"샙","새ᄇᄉ":"샚","새ᄉ":"샛","새ᄊ":"샜","새ᄋ":"생","새ᄌ":"샞","새ᄎ":"샟","새ᄏ":"샠","새ᄐ":"샡","새ᄑ":"샢","새ᄒ":"샣","샤":"샤","샤ᄀ":"샥","샤ᄁ":"샦","샤ᄀᄉ":"샧","샤ᄂ":"샨","샤ᄂᄌ":"샩","샤ᄂᄒ":"샪","샤ᄃ":"샫","샤ᄅ":"샬","샤ᄅᄀ":"샭","샤ᄅᄆ":"샮","샤ᄅᄇ":"샯","샤ᄅᄉ":"샰","샤ᄅᄐ":"샱","샤ᄅᄑ":"샲","샤ᄅᄒ":"샳","샤ᄆ":"샴","샤ᄇ":"샵","샤ᄇᄉ":"샶","샤ᄉ":"샷","샤ᄊ":"샸","샤ᄋ":"샹","샤ᄌ":"샺","샤ᄎ":"샻","샤ᄏ":"샼","샤ᄐ":"샽","샤ᄑ":"샾","샤ᄒ":"샿","섀":"섀","섀ᄀ":"섁","섀ᄁ":"섂","섀ᄀᄉ":"섃","섀ᄂ":"섄","섀ᄂᄌ":"섅","섀ᄂᄒ":"섆","섀ᄃ":"섇","섀ᄅ":"섈","섀ᄅᄀ":"섉","섀ᄅᄆ":"섊","섀ᄅᄇ":"섋","섀ᄅᄉ":"섌","섀ᄅᄐ":"섍","섀ᄅᄑ":"섎","섀ᄅᄒ":"섏","섀ᄆ":"섐","섀ᄇ":"섑","섀ᄇᄉ":"섒","섀ᄉ":"섓","섀ᄊ":"섔","섀ᄋ":"섕","섀ᄌ":"섖","섀ᄎ":"섗","섀ᄏ":"섘","섀ᄐ":"섙","섀ᄑ":"섚","섀ᄒ":"섛","서":"서","서ᄀ":"석","서ᄁ":"섞","서ᄀᄉ":"섟","서ᄂ":"선","서ᄂᄌ":"섡","서ᄂᄒ":"섢","서ᄃ":"섣","서ᄅ":"설","서ᄅᄀ":"섥","서ᄅᄆ":"섦","서ᄅᄇ":"섧","서ᄅᄉ":"섨","서ᄅᄐ":"섩","서ᄅᄑ":"섪","서ᄅᄒ":"섫","서ᄆ":"섬","서ᄇ":"섭","서ᄇᄉ":"섮","서ᄉ":"섯","서ᄊ":"섰","서ᄋ":"성","서ᄌ":"섲","서ᄎ":"섳","서ᄏ":"섴","서ᄐ":"섵","서ᄑ":"섶","서ᄒ":"섷","세":"세","세ᄀ":"섹","세ᄁ":"섺","세ᄀᄉ":"섻","세ᄂ":"센","세ᄂᄌ":"섽","세ᄂᄒ":"섾","세ᄃ":"섿","세ᄅ":"셀","세ᄅᄀ":"셁","세ᄅᄆ":"셂","세ᄅᄇ":"셃","세ᄅᄉ":"셄","세ᄅᄐ":"셅","세ᄅᄑ":"셆","세ᄅᄒ":"셇","세ᄆ":"셈","세ᄇ":"셉","세ᄇᄉ":"셊","세ᄉ":"셋","세ᄊ":"셌","세ᄋ":"셍","세ᄌ":"셎","세ᄎ":"셏","세ᄏ":"셐","세ᄐ":"셑","세ᄑ":"셒","세ᄒ":"셓","셔":"셔","셔ᄀ":"셕","셔ᄁ":"셖","셔ᄀᄉ":"셗","셔ᄂ":"션","셔ᄂᄌ":"셙","셔ᄂᄒ":"셚","셔ᄃ":"셛","셔ᄅ":"셜","셔ᄅᄀ":"셝","셔ᄅᄆ":"셞","셔ᄅᄇ":"셟","셔ᄅᄉ":"셠","셔ᄅᄐ":"셡","셔ᄅᄑ":"셢","셔ᄅᄒ":"셣","셔ᄆ":"셤","셔ᄇ":"셥","셔ᄇᄉ":"셦","셔ᄉ":"셧","셔ᄊ":"셨","셔ᄋ":"셩","셔ᄌ":"셪","셔ᄎ":"셫","셔ᄏ":"셬","셔ᄐ":"셭","셔ᄑ":"셮","셔ᄒ":"셯","셰":"셰","셰ᄀ":"셱","셰ᄁ":"셲","셰ᄀᄉ":"셳","셰ᄂ":"셴","셰ᄂᄌ":"셵","셰ᄂᄒ":"셶","셰ᄃ":"셷","셰ᄅ":"셸","셰ᄅᄀ":"셹","셰ᄅᄆ":"셺","셰ᄅᄇ":"셻","셰ᄅᄉ":"셼","셰ᄅᄐ":"셽","셰ᄅᄑ":"셾","셰ᄅᄒ":"셿","셰ᄆ":"솀","셰ᄇ":"솁","셰ᄇᄉ":"솂","셰ᄉ":"솃","셰ᄊ":"솄","셰ᄋ":"솅","셰ᄌ":"솆","셰ᄎ":"솇","셰ᄏ":"솈","셰ᄐ":"솉","셰ᄑ":"솊","셰ᄒ":"솋","소":"소","소ᄀ":"속","소ᄁ":"솎","소ᄀᄉ":"솏","소ᄂ":"손","소ᄂᄌ":"솑","소ᄂᄒ":"솒","소ᄃ":"솓","소ᄅ":"솔","소ᄅᄀ":"솕","소ᄅᄆ":"솖","소ᄅᄇ":"솗","소ᄅᄉ":"솘","소ᄅᄐ":"솙","소ᄅᄑ":"솚","소ᄅᄒ":"솛","소ᄆ":"솜","소ᄇ":"솝","소ᄇᄉ":"솞","소ᄉ":"솟","소ᄊ":"솠","소ᄋ":"송","소ᄌ":"솢","소ᄎ":"솣","소ᄏ":"솤","소ᄐ":"솥","소ᄑ":"솦","소ᄒ":"솧","소ᅡ":"솨","소ᅡᄀ":"솩","소ᅡᄁ":"솪","소ᅡᄀᄉ":"솫","소ᅡᄂ":"솬","소ᅡᄂᄌ":"솭","소ᅡᄂᄒ":"솮","소ᅡᄃ":"솯","소ᅡᄅ":"솰","소ᅡᄅᄀ":"솱","소ᅡᄅᄆ":"솲","소ᅡᄅᄇ":"솳","소ᅡᄅᄉ":"솴","소ᅡᄅᄐ":"솵","소ᅡᄅᄑ":"솶","소ᅡᄅᄒ":"솷","소ᅡᄆ":"솸","소ᅡᄇ":"솹","소ᅡᄇᄉ":"솺","소ᅡᄉ":"솻","소ᅡᄊ":"솼","소ᅡᄋ":"솽","소ᅡᄌ":"솾","소ᅡᄎ":"솿","소ᅡᄏ":"쇀","소ᅡᄐ":"쇁","소ᅡᄑ":"쇂","소ᅡᄒ":"쇃","소ᅢ":"쇄","소ᅢᄀ":"쇅","소ᅢᄁ":"쇆","소ᅢᄀᄉ":"쇇","소ᅢᄂ":"쇈","소ᅢᄂᄌ":"쇉","소ᅢᄂᄒ":"쇊","소ᅢᄃ":"쇋","소ᅢᄅ":"쇌","소ᅢᄅᄀ":"쇍","소ᅢᄅᄆ":"쇎","소ᅢᄅᄇ":"쇏","소ᅢᄅᄉ":"쇐","소ᅢᄅᄐ":"쇑","소ᅢᄅᄑ":"쇒","소ᅢᄅᄒ":"쇓","소ᅢᄆ":"쇔","소ᅢᄇ":"쇕","소ᅢᄇᄉ":"쇖","소ᅢᄉ":"쇗","소ᅢᄊ":"쇘","소ᅢᄋ":"쇙","소ᅢᄌ":"쇚","소ᅢᄎ":"쇛","소ᅢᄏ":"쇜","소ᅢᄐ":"쇝","소ᅢᄑ":"쇞","소ᅢᄒ":"쇟","소ᅵ":"쇠","소ᅵᄀ":"쇡","소ᅵᄁ":"쇢","소ᅵᄀᄉ":"쇣","소ᅵᄂ":"쇤","소ᅵᄂᄌ":"쇥","소ᅵᄂᄒ":"쇦","소ᅵᄃ":"쇧","소ᅵᄅ":"쇨","소ᅵᄅᄀ":"쇩","소ᅵᄅᄆ":"쇪","소ᅵᄅᄇ":"쇫","소ᅵᄅᄉ":"쇬","소ᅵᄅᄐ":"쇭","소ᅵᄅᄑ":"쇮","소ᅵᄅᄒ":"쇯","소ᅵᄆ":"쇰","소ᅵᄇ":"쇱","소ᅵᄇᄉ":"쇲","소ᅵᄉ":"쇳","소ᅵᄊ":"쇴","소ᅵᄋ":"쇵","소ᅵᄌ":"쇶","소ᅵᄎ":"쇷","소ᅵᄏ":"쇸","소ᅵᄐ":"쇹","소ᅵᄑ":"쇺","소ᅵᄒ":"쇻","쇼":"쇼","쇼ᄀ":"쇽","쇼ᄁ":"쇾","쇼ᄀᄉ":"쇿","쇼ᄂ":"숀","쇼ᄂᄌ":"숁","쇼ᄂᄒ":"숂","쇼ᄃ":"숃","쇼ᄅ":"숄","쇼ᄅᄀ":"숅","쇼ᄅᄆ":"숆","쇼ᄅᄇ":"숇","쇼ᄅᄉ":"숈","쇼ᄅᄐ":"숉","쇼ᄅᄑ":"숊","쇼ᄅᄒ":"숋","쇼ᄆ":"숌","쇼ᄇ":"숍","쇼ᄇᄉ":"숎","쇼ᄉ":"숏","쇼ᄊ":"숐","쇼ᄋ":"숑","쇼ᄌ":"숒","쇼ᄎ":"숓","쇼ᄏ":"숔","쇼ᄐ":"숕","쇼ᄑ":"숖","쇼ᄒ":"숗","수":"수","수ᄀ":"숙","수ᄁ":"숚","수ᄀᄉ":"숛","수ᄂ":"순","수ᄂᄌ":"숝","수ᄂᄒ":"숞","수ᄃ":"숟","수ᄅ":"술","수ᄅᄀ":"숡","수ᄅᄆ":"숢","수ᄅᄇ":"숣","수ᄅᄉ":"숤","수ᄅᄐ":"숥","수ᄅᄑ":"숦","수ᄅᄒ":"숧","수ᄆ":"숨","수ᄇ":"숩","수ᄇᄉ":"숪","수ᄉ":"숫","수ᄊ":"숬","수ᄋ":"숭","수ᄌ":"숮","수ᄎ":"숯","수ᄏ":"숰","수ᄐ":"숱","수ᄑ":"숲","수ᄒ":"숳","수ᅥ":"숴","수ᅥᄀ":"숵","수ᅥᄁ":"숶","수ᅥᄀᄉ":"숷","수ᅥᄂ":"숸","수ᅥᄂᄌ":"숹","수ᅥᄂᄒ":"숺","수ᅥᄃ":"숻","수ᅥᄅ":"숼","수ᅥᄅᄀ":"숽","수ᅥᄅᄆ":"숾","수ᅥᄅᄇ":"숿","수ᅥᄅᄉ":"쉀","수ᅥᄅᄐ":"쉁","수ᅥᄅᄑ":"쉂","수ᅥᄅᄒ":"쉃","수ᅥᄆ":"쉄","수ᅥᄇ":"쉅","수ᅥᄇᄉ":"쉆","수ᅥᄉ":"쉇","수ᅥᄊ":"쉈","수ᅥᄋ":"쉉","수ᅥᄌ":"쉊","수ᅥᄎ":"쉋","수ᅥᄏ":"쉌","수ᅥᄐ":"쉍","수ᅥᄑ":"쉎","수ᅥᄒ":"쉏","수ᅦ":"쉐","수ᅦᄀ":"쉑","수ᅦᄁ":"쉒","수ᅦᄀᄉ":"쉓","수ᅦᄂ":"쉔","수ᅦᄂᄌ":"쉕","수ᅦᄂᄒ":"쉖","수ᅦᄃ":"쉗","수ᅦᄅ":"쉘","수ᅦᄅᄀ":"쉙","수ᅦᄅᄆ":"쉚","수ᅦᄅᄇ":"쉛","수ᅦᄅᄉ":"쉜","수ᅦᄅᄐ":"쉝","수ᅦᄅᄑ":"쉞","수ᅦᄅᄒ":"쉟","수ᅦᄆ":"쉠","수ᅦᄇ":"쉡","수ᅦᄇᄉ":"쉢","수ᅦᄉ":"쉣","수ᅦᄊ":"쉤","수ᅦᄋ":"쉥","수ᅦᄌ":"쉦","수ᅦᄎ":"쉧","수ᅦᄏ":"쉨","수ᅦᄐ":"쉩","수ᅦᄑ":"쉪","수ᅦᄒ":"쉫","수ᅵ":"쉬","수ᅵᄀ":"쉭","수ᅵᄁ":"쉮","수ᅵᄀᄉ":"쉯","수ᅵᄂ":"쉰","수ᅵᄂᄌ":"쉱","수ᅵᄂᄒ":"쉲","수ᅵᄃ":"쉳","수ᅵᄅ":"쉴","수ᅵᄅᄀ":"쉵","수ᅵᄅᄆ":"쉶","수ᅵᄅᄇ":"쉷","수ᅵᄅᄉ":"쉸","수ᅵᄅᄐ":"쉹","수ᅵᄅᄑ":"쉺","수ᅵᄅᄒ":"쉻","수ᅵᄆ":"쉼","수ᅵᄇ":"쉽","수ᅵᄇᄉ":"쉾","수ᅵᄉ":"쉿","수ᅵᄊ":"슀","수ᅵᄋ":"슁","수ᅵᄌ":"슂","수ᅵᄎ":"슃","수ᅵᄏ":"슄","수ᅵᄐ":"슅","수ᅵᄑ":"슆","수ᅵᄒ":"슇","슈":"슈","슈ᄀ":"슉","슈ᄁ":"슊","슈ᄀᄉ":"슋","슈ᄂ":"슌","슈ᄂᄌ":"슍","슈ᄂᄒ":"슎","슈ᄃ":"슏","슈ᄅ":"슐","슈ᄅᄀ":"슑","슈ᄅᄆ":"슒","슈ᄅᄇ":"슓","슈ᄅᄉ":"슔","슈ᄅᄐ":"슕","슈ᄅᄑ":"슖","슈ᄅᄒ":"슗","슈ᄆ":"슘","슈ᄇ":"슙","슈ᄇᄉ":"슚","슈ᄉ":"슛","슈ᄊ":"슜","슈ᄋ":"슝","슈ᄌ":"슞","슈ᄎ":"슟","슈ᄏ":"슠","슈ᄐ":"슡","슈ᄑ":"슢","슈ᄒ":"슣","스":"스","스ᄀ":"슥","스ᄁ":"슦","스ᄀᄉ":"슧","스ᄂ":"슨","스ᄂᄌ":"슩","스ᄂᄒ":"슪","스ᄃ":"슫","스ᄅ":"슬","스ᄅᄀ":"슭","스ᄅᄆ":"슮","스ᄅᄇ":"슯","스ᄅᄉ":"슰","스ᄅᄐ":"슱","스ᄅᄑ":"슲","스ᄅᄒ":"슳","스ᄆ":"슴","스ᄇ":"습","스ᄇᄉ":"슶","스ᄉ":"슷","스ᄊ":"슸","스ᄋ":"승","스ᄌ":"슺","스ᄎ":"슻","스ᄏ":"슼","스ᄐ":"슽","스ᄑ":"슾","스ᄒ":"슿","스ᅵ":"싀","스ᅵᄀ":"싁","스ᅵᄁ":"싂","스ᅵᄀᄉ":"싃","스ᅵᄂ":"싄","스ᅵᄂᄌ":"싅","스ᅵᄂᄒ":"싆","스ᅵᄃ":"싇","스ᅵᄅ":"싈","스ᅵᄅᄀ":"싉","스ᅵᄅᄆ":"싊","스ᅵᄅᄇ":"싋","스ᅵᄅᄉ":"싌","스ᅵᄅᄐ":"싍","스ᅵᄅᄑ":"싎","스ᅵᄅᄒ":"싏","스ᅵᄆ":"싐","스ᅵᄇ":"싑","스ᅵᄇᄉ":"싒","스ᅵᄉ":"싓","스ᅵᄊ":"싔","스ᅵᄋ":"싕","스ᅵᄌ":"싖","스ᅵᄎ":"싗","스ᅵᄏ":"싘","스ᅵᄐ":"싙","스ᅵᄑ":"싚","스ᅵᄒ":"싛","시":"시","시ᄀ":"식","시ᄁ":"싞","시ᄀᄉ":"싟","시ᄂ":"신","시ᄂᄌ":"싡","시ᄂᄒ":"싢","시ᄃ":"싣","시ᄅ":"실","시ᄅᄀ":"싥","시ᄅᄆ":"싦","시ᄅᄇ":"싧","시ᄅᄉ":"싨","시ᄅᄐ":"싩","시ᄅᄑ":"싪","시ᄅᄒ":"싫","시ᄆ":"심","시ᄇ":"십","시ᄇᄉ":"싮","시ᄉ":"싯","시ᄊ":"싰","시ᄋ":"싱","시ᄌ":"싲","시ᄎ":"싳","시ᄏ":"싴","시ᄐ":"싵","시ᄑ":"싶","시ᄒ":"싷","싸":"싸","싸ᄀ":"싹","싸ᄁ":"싺","싸ᄀᄉ":"싻","싸ᄂ":"싼","싸ᄂᄌ":"싽","싸ᄂᄒ":"싾","싸ᄃ":"싿","싸ᄅ":"쌀","싸ᄅᄀ":"쌁","싸ᄅᄆ":"쌂","싸ᄅᄇ":"쌃","싸ᄅᄉ":"쌄","싸ᄅᄐ":"쌅","싸ᄅᄑ":"쌆","싸ᄅᄒ":"쌇","싸ᄆ":"쌈","싸ᄇ":"쌉","싸ᄇᄉ":"쌊","싸ᄉ":"쌋","싸ᄊ":"쌌","싸ᄋ":"쌍","싸ᄌ":"쌎","싸ᄎ":"쌏","싸ᄏ":"쌐","싸ᄐ":"쌑","싸ᄑ":"쌒","싸ᄒ":"쌓","쌔":"쌔","쌔ᄀ":"쌕","쌔ᄁ":"쌖","쌔ᄀᄉ":"쌗","쌔ᄂ":"쌘","쌔ᄂᄌ":"쌙","쌔ᄂᄒ":"쌚","쌔ᄃ":"쌛","쌔ᄅ":"쌜","쌔ᄅᄀ":"쌝","쌔ᄅᄆ":"쌞","쌔ᄅᄇ":"쌟","쌔ᄅᄉ":"쌠","쌔ᄅᄐ":"쌡","쌔ᄅᄑ":"쌢","쌔ᄅᄒ":"쌣","쌔ᄆ":"쌤","쌔ᄇ":"쌥","쌔ᄇᄉ":"쌦","쌔ᄉ":"쌧","쌔ᄊ":"쌨","쌔ᄋ":"쌩","쌔ᄌ":"쌪","쌔ᄎ":"쌫","쌔ᄏ":"쌬","쌔ᄐ":"쌭","쌔ᄑ":"쌮","쌔ᄒ":"쌯","쌰":"쌰","쌰ᄀ":"쌱","쌰ᄁ":"쌲","쌰ᄀᄉ":"쌳","쌰ᄂ":"쌴","쌰ᄂᄌ":"쌵","쌰ᄂᄒ":"쌶","쌰ᄃ":"쌷","쌰ᄅ":"쌸","쌰ᄅᄀ":"쌹","쌰ᄅᄆ":"쌺","쌰ᄅᄇ":"쌻","쌰ᄅᄉ":"쌼","쌰ᄅᄐ":"쌽","쌰ᄅᄑ":"쌾","쌰ᄅᄒ":"쌿","쌰ᄆ":"썀","쌰ᄇ":"썁","쌰ᄇᄉ":"썂","쌰ᄉ":"썃","쌰ᄊ":"썄","쌰ᄋ":"썅","쌰ᄌ":"썆","쌰ᄎ":"썇","쌰ᄏ":"썈","쌰ᄐ":"썉","쌰ᄑ":"썊","쌰ᄒ":"썋","썌":"썌","썌ᄀ":"썍","썌ᄁ":"썎","썌ᄀᄉ":"썏","썌ᄂ":"썐","썌ᄂᄌ":"썑","썌ᄂᄒ":"썒","썌ᄃ":"썓","썌ᄅ":"썔","썌ᄅᄀ":"썕","썌ᄅᄆ":"썖","썌ᄅᄇ":"썗","썌ᄅᄉ":"썘","썌ᄅᄐ":"썙","썌ᄅᄑ":"썚","썌ᄅᄒ":"썛","썌ᄆ":"썜","썌ᄇ":"썝","썌ᄇᄉ":"썞","썌ᄉ":"썟","썌ᄊ":"썠","썌ᄋ":"썡","썌ᄌ":"썢","썌ᄎ":"썣","썌ᄏ":"썤","썌ᄐ":"썥","썌ᄑ":"썦","썌ᄒ":"썧","써":"써","써ᄀ":"썩","써ᄁ":"썪","써ᄀᄉ":"썫","써ᄂ":"썬","써ᄂᄌ":"썭","써ᄂᄒ":"썮","써ᄃ":"썯","써ᄅ":"썰","써ᄅᄀ":"썱","써ᄅᄆ":"썲","써ᄅᄇ":"썳","써ᄅᄉ":"썴","써ᄅᄐ":"썵","써ᄅᄑ":"썶","써ᄅᄒ":"썷","써ᄆ":"썸","써ᄇ":"썹","써ᄇᄉ":"썺","써ᄉ":"썻","써ᄊ":"썼","써ᄋ":"썽","써ᄌ":"썾","써ᄎ":"썿","써ᄏ":"쎀","써ᄐ":"쎁","써ᄑ":"쎂","써ᄒ":"쎃","쎄":"쎄","쎄ᄀ":"쎅","쎄ᄁ":"쎆","쎄ᄀᄉ":"쎇","쎄ᄂ":"쎈","쎄ᄂᄌ":"쎉","쎄ᄂᄒ":"쎊","쎄ᄃ":"쎋","쎄ᄅ":"쎌","쎄ᄅᄀ":"쎍","쎄ᄅᄆ":"쎎","쎄ᄅᄇ":"쎏","쎄ᄅᄉ":"쎐","쎄ᄅᄐ":"쎑","쎄ᄅᄑ":"쎒","쎄ᄅᄒ":"쎓","쎄ᄆ":"쎔","쎄ᄇ":"쎕","쎄ᄇᄉ":"쎖","쎄ᄉ":"쎗","쎄ᄊ":"쎘","쎄ᄋ":"쎙","쎄ᄌ":"쎚","쎄ᄎ":"쎛","쎄ᄏ":"쎜","쎄ᄐ":"쎝","쎄ᄑ":"쎞","쎄ᄒ":"쎟","쎠":"쎠","쎠ᄀ":"쎡","쎠ᄁ":"쎢","쎠ᄀᄉ":"쎣","쎠ᄂ":"쎤","쎠ᄂᄌ":"쎥","쎠ᄂᄒ":"쎦","쎠ᄃ":"쎧","쎠ᄅ":"쎨","쎠ᄅᄀ":"쎩","쎠ᄅᄆ":"쎪","쎠ᄅᄇ":"쎫","쎠ᄅᄉ":"쎬","쎠ᄅᄐ":"쎭","쎠ᄅᄑ":"쎮","쎠ᄅᄒ":"쎯","쎠ᄆ":"쎰","쎠ᄇ":"쎱","쎠ᄇᄉ":"쎲","쎠ᄉ":"쎳","쎠ᄊ":"쎴","쎠ᄋ":"쎵","쎠ᄌ":"쎶","쎠ᄎ":"쎷","쎠ᄏ":"쎸","쎠ᄐ":"쎹","쎠ᄑ":"쎺","쎠ᄒ":"쎻","쎼":"쎼","쎼ᄀ":"쎽","쎼ᄁ":"쎾","쎼ᄀᄉ":"쎿","쎼ᄂ":"쏀","쎼ᄂᄌ":"쏁","쎼ᄂᄒ":"쏂","쎼ᄃ":"쏃","쎼ᄅ":"쏄","쎼ᄅᄀ":"쏅","쎼ᄅᄆ":"쏆","쎼ᄅᄇ":"쏇","쎼ᄅᄉ":"쏈","쎼ᄅᄐ":"쏉","쎼ᄅᄑ":"쏊","쎼ᄅᄒ":"쏋","쎼ᄆ":"쏌","쎼ᄇ":"쏍","쎼ᄇᄉ":"쏎","쎼ᄉ":"쏏","쎼ᄊ":"쏐","쎼ᄋ":"쏑","쎼ᄌ":"쏒","쎼ᄎ":"쏓","쎼ᄏ":"쏔","쎼ᄐ":"쏕","쎼ᄑ":"쏖","쎼ᄒ":"쏗","쏘":"쏘","쏘ᄀ":"쏙","쏘ᄁ":"쏚","쏘ᄀᄉ":"쏛","쏘ᄂ":"쏜","쏘ᄂᄌ":"쏝","쏘ᄂᄒ":"쏞","쏘ᄃ":"쏟","쏘ᄅ":"쏠","쏘ᄅᄀ":"쏡","쏘ᄅᄆ":"쏢","쏘ᄅᄇ":"쏣","쏘ᄅᄉ":"쏤","쏘ᄅᄐ":"쏥","쏘ᄅᄑ":"쏦","쏘ᄅᄒ":"쏧","쏘ᄆ":"쏨","쏘ᄇ":"쏩","쏘ᄇᄉ":"쏪","쏘ᄉ":"쏫","쏘ᄊ":"쏬","쏘ᄋ":"쏭","쏘ᄌ":"쏮","쏘ᄎ":"쏯","쏘ᄏ":"쏰","쏘ᄐ":"쏱","쏘ᄑ":"쏲","쏘ᄒ":"쏳","쏘ᅡ":"쏴","쏘ᅡᄀ":"쏵","쏘ᅡᄁ":"쏶","쏘ᅡᄀᄉ":"쏷","쏘ᅡᄂ":"쏸","쏘ᅡᄂᄌ":"쏹","쏘ᅡᄂᄒ":"쏺","쏘ᅡᄃ":"쏻","쏘ᅡᄅ":"쏼","쏘ᅡᄅᄀ":"쏽","쏘ᅡᄅᄆ":"쏾","쏘ᅡᄅᄇ":"쏿","쏘ᅡᄅᄉ":"쐀","쏘ᅡᄅᄐ":"쐁","쏘ᅡᄅᄑ":"쐂","쏘ᅡᄅᄒ":"쐃","쏘ᅡᄆ":"쐄","쏘ᅡᄇ":"쐅","쏘ᅡᄇᄉ":"쐆","쏘ᅡᄉ":"쐇","쏘ᅡᄊ":"쐈","쏘ᅡᄋ":"쐉","쏘ᅡᄌ":"쐊","쏘ᅡᄎ":"쐋","쏘ᅡᄏ":"쐌","쏘ᅡᄐ":"쐍","쏘ᅡᄑ":"쐎","쏘ᅡᄒ":"쐏","쏘ᅢ":"쐐","쏘ᅢᄀ":"쐑","쏘ᅢᄁ":"쐒","쏘ᅢᄀᄉ":"쐓","쏘ᅢᄂ":"쐔","쏘ᅢᄂᄌ":"쐕","쏘ᅢᄂᄒ":"쐖","쏘ᅢᄃ":"쐗","쏘ᅢᄅ":"쐘","쏘ᅢᄅᄀ":"쐙","쏘ᅢᄅᄆ":"쐚","쏘ᅢᄅᄇ":"쐛","쏘ᅢᄅᄉ":"쐜","쏘ᅢᄅᄐ":"쐝","쏘ᅢᄅᄑ":"쐞","쏘ᅢᄅᄒ":"쐟","쏘ᅢᄆ":"쐠","쏘ᅢᄇ":"쐡","쏘ᅢᄇᄉ":"쐢","쏘ᅢᄉ":"쐣","쏘ᅢᄊ":"쐤","쏘ᅢᄋ":"쐥","쏘ᅢᄌ":"쐦","쏘ᅢᄎ":"쐧","쏘ᅢᄏ":"쐨","쏘ᅢᄐ":"쐩","쏘ᅢᄑ":"쐪","쏘ᅢᄒ":"쐫","쏘ᅵ":"쐬","쏘ᅵᄀ":"쐭","쏘ᅵᄁ":"쐮","쏘ᅵᄀᄉ":"쐯","쏘ᅵᄂ":"쐰","쏘ᅵᄂᄌ":"쐱","쏘ᅵᄂᄒ":"쐲","쏘ᅵᄃ":"쐳","쏘ᅵᄅ":"쐴","쏘ᅵᄅᄀ":"쐵","쏘ᅵᄅᄆ":"쐶","쏘ᅵᄅᄇ":"쐷","쏘ᅵᄅᄉ":"쐸","쏘ᅵᄅᄐ":"쐹","쏘ᅵᄅᄑ":"쐺","쏘ᅵᄅᄒ":"쐻","쏘ᅵᄆ":"쐼","쏘ᅵᄇ":"쐽","쏘ᅵᄇᄉ":"쐾","쏘ᅵᄉ":"쐿","쏘ᅵᄊ":"쑀","쏘ᅵᄋ":"쑁","쏘ᅵᄌ":"쑂","쏘ᅵᄎ":"쑃","쏘ᅵᄏ":"쑄","쏘ᅵᄐ":"쑅","쏘ᅵᄑ":"쑆","쏘ᅵᄒ":"쑇","쑈":"쑈","쑈ᄀ":"쑉","쑈ᄁ":"쑊","쑈ᄀᄉ":"쑋","쑈ᄂ":"쑌","쑈ᄂᄌ":"쑍","쑈ᄂᄒ":"쑎","쑈ᄃ":"쑏","쑈ᄅ":"쑐","쑈ᄅᄀ":"쑑","쑈ᄅᄆ":"쑒","쑈ᄅᄇ":"쑓","쑈ᄅᄉ":"쑔","쑈ᄅᄐ":"쑕","쑈ᄅᄑ":"쑖","쑈ᄅᄒ":"쑗","쑈ᄆ":"쑘","쑈ᄇ":"쑙","쑈ᄇᄉ":"쑚","쑈ᄉ":"쑛","쑈ᄊ":"쑜","쑈ᄋ":"쑝","쑈ᄌ":"쑞","쑈ᄎ":"쑟","쑈ᄏ":"쑠","쑈ᄐ":"쑡","쑈ᄑ":"쑢","쑈ᄒ":"쑣","쑤":"쑤","쑤ᄀ":"쑥","쑤ᄁ":"쑦","쑤ᄀᄉ":"쑧","쑤ᄂ":"쑨","쑤ᄂᄌ":"쑩","쑤ᄂᄒ":"쑪","쑤ᄃ":"쑫","쑤ᄅ":"쑬","쑤ᄅᄀ":"쑭","쑤ᄅᄆ":"쑮","쑤ᄅᄇ":"쑯","쑤ᄅᄉ":"쑰","쑤ᄅᄐ":"쑱","쑤ᄅᄑ":"쑲","쑤ᄅᄒ":"쑳","쑤ᄆ":"쑴","쑤ᄇ":"쑵","쑤ᄇᄉ":"쑶","쑤ᄉ":"쑷","쑤ᄊ":"쑸","쑤ᄋ":"쑹","쑤ᄌ":"쑺","쑤ᄎ":"쑻","쑤ᄏ":"쑼","쑤ᄐ":"쑽","쑤ᄑ":"쑾","쑤ᄒ":"쑿","쑤ᅥ":"쒀","쑤ᅥᄀ":"쒁","쑤ᅥᄁ":"쒂","쑤ᅥᄀᄉ":"쒃","쑤ᅥᄂ":"쒄","쑤ᅥᄂᄌ":"쒅","쑤ᅥᄂᄒ":"쒆","쑤ᅥᄃ":"쒇","쑤ᅥᄅ":"쒈","쑤ᅥᄅᄀ":"쒉","쑤ᅥᄅᄆ":"쒊","쑤ᅥᄅᄇ":"쒋","쑤ᅥᄅᄉ":"쒌","쑤ᅥᄅᄐ":"쒍","쑤ᅥᄅᄑ":"쒎","쑤ᅥᄅᄒ":"쒏","쑤ᅥᄆ":"쒐","쑤ᅥᄇ":"쒑","쑤ᅥᄇᄉ":"쒒","쑤ᅥᄉ":"쒓","쑤ᅥᄊ":"쒔","쑤ᅥᄋ":"쒕","쑤ᅥᄌ":"쒖","쑤ᅥᄎ":"쒗","쑤ᅥᄏ":"쒘","쑤ᅥᄐ":"쒙","쑤ᅥᄑ":"쒚","쑤ᅥᄒ":"쒛","쑤ᅦ":"쒜","쑤ᅦᄀ":"쒝","쑤ᅦᄁ":"쒞","쑤ᅦᄀᄉ":"쒟","쑤ᅦᄂ":"쒠","쑤ᅦᄂᄌ":"쒡","쑤ᅦᄂᄒ":"쒢","쑤ᅦᄃ":"쒣","쑤ᅦᄅ":"쒤","쑤ᅦᄅᄀ":"쒥","쑤ᅦᄅᄆ":"쒦","쑤ᅦᄅᄇ":"쒧","쑤ᅦᄅᄉ":"쒨","쑤ᅦᄅᄐ":"쒩","쑤ᅦᄅᄑ":"쒪","쑤ᅦᄅᄒ":"쒫","쑤ᅦᄆ":"쒬","쑤ᅦᄇ":"쒭","쑤ᅦᄇᄉ":"쒮","쑤ᅦᄉ":"쒯","쑤ᅦᄊ":"쒰","쑤ᅦᄋ":"쒱","쑤ᅦᄌ":"쒲","쑤ᅦᄎ":"쒳","쑤ᅦᄏ":"쒴","쑤ᅦᄐ":"쒵","쑤ᅦᄑ":"쒶","쑤ᅦᄒ":"쒷","쑤ᅵ":"쒸","쑤ᅵᄀ":"쒹","쑤ᅵᄁ":"쒺","쑤ᅵᄀᄉ":"쒻","쑤ᅵᄂ":"쒼","쑤ᅵᄂᄌ":"쒽","쑤ᅵᄂᄒ":"쒾","쑤ᅵᄃ":"쒿","쑤ᅵᄅ":"쓀","쑤ᅵᄅᄀ":"쓁","쑤ᅵᄅᄆ":"쓂","쑤ᅵᄅᄇ":"쓃","쑤ᅵᄅᄉ":"쓄","쑤ᅵᄅᄐ":"쓅","쑤ᅵᄅᄑ":"쓆","쑤ᅵᄅᄒ":"쓇","쑤ᅵᄆ":"쓈","쑤ᅵᄇ":"쓉","쑤ᅵᄇᄉ":"쓊","쑤ᅵᄉ":"쓋","쑤ᅵᄊ":"쓌","쑤ᅵᄋ":"쓍","쑤ᅵᄌ":"쓎","쑤ᅵᄎ":"쓏","쑤ᅵᄏ":"쓐","쑤ᅵᄐ":"쓑","쑤ᅵᄑ":"쓒","쑤ᅵᄒ":"쓓","쓔":"쓔","쓔ᄀ":"쓕","쓔ᄁ":"쓖","쓔ᄀᄉ":"쓗","쓔ᄂ":"쓘","쓔ᄂᄌ":"쓙","쓔ᄂᄒ":"쓚","쓔ᄃ":"쓛","쓔ᄅ":"쓜","쓔ᄅᄀ":"쓝","쓔ᄅᄆ":"쓞","쓔ᄅᄇ":"쓟","쓔ᄅᄉ":"쓠","쓔ᄅᄐ":"쓡","쓔ᄅᄑ":"쓢","쓔ᄅᄒ":"쓣","쓔ᄆ":"쓤","쓔ᄇ":"쓥","쓔ᄇᄉ":"쓦","쓔ᄉ":"쓧","쓔ᄊ":"쓨","쓔ᄋ":"쓩","쓔ᄌ":"쓪","쓔ᄎ":"쓫","쓔ᄏ":"쓬","쓔ᄐ":"쓭","쓔ᄑ":"쓮","쓔ᄒ":"쓯","쓰":"쓰","쓰ᄀ":"쓱","쓰ᄁ":"쓲","쓰ᄀᄉ":"쓳","쓰ᄂ":"쓴","쓰ᄂᄌ":"쓵","쓰ᄂᄒ":"쓶","쓰ᄃ":"쓷","쓰ᄅ":"쓸","쓰ᄅᄀ":"쓹","쓰ᄅᄆ":"쓺","쓰ᄅᄇ":"쓻","쓰ᄅᄉ":"쓼","쓰ᄅᄐ":"쓽","쓰ᄅᄑ":"쓾","쓰ᄅᄒ":"쓿","쓰ᄆ":"씀","쓰ᄇ":"씁","쓰ᄇᄉ":"씂","쓰ᄉ":"씃","쓰ᄊ":"씄","쓰ᄋ":"씅","쓰ᄌ":"씆","쓰ᄎ":"씇","쓰ᄏ":"씈","쓰ᄐ":"씉","쓰ᄑ":"씊","쓰ᄒ":"씋","쓰ᅵ":"씌","쓰ᅵᄀ":"씍","쓰ᅵᄁ":"씎","쓰ᅵᄀᄉ":"씏","쓰ᅵᄂ":"씐","쓰ᅵᄂᄌ":"씑","쓰ᅵᄂᄒ":"씒","쓰ᅵᄃ":"씓","쓰ᅵᄅ":"씔","쓰ᅵᄅᄀ":"씕","쓰ᅵᄅᄆ":"씖","쓰ᅵᄅᄇ":"씗","쓰ᅵᄅᄉ":"씘","쓰ᅵᄅᄐ":"씙","쓰ᅵᄅᄑ":"씚","쓰ᅵᄅᄒ":"씛","쓰ᅵᄆ":"씜","쓰ᅵᄇ":"씝","쓰ᅵᄇᄉ":"씞","쓰ᅵᄉ":"씟","쓰ᅵᄊ":"씠","쓰ᅵᄋ":"씡","쓰ᅵᄌ":"씢","쓰ᅵᄎ":"씣","쓰ᅵᄏ":"씤","쓰ᅵᄐ":"씥","쓰ᅵᄑ":"씦","쓰ᅵᄒ":"씧","씨":"씨","씨ᄀ":"씩","씨ᄁ":"씪","씨ᄀᄉ":"씫","씨ᄂ":"씬","씨ᄂᄌ":"씭","씨ᄂᄒ":"씮","씨ᄃ":"씯","씨ᄅ":"씰","씨ᄅᄀ":"씱","씨ᄅᄆ":"씲","씨ᄅᄇ":"씳","씨ᄅᄉ":"씴","씨ᄅᄐ":"씵","씨ᄅᄑ":"씶","씨ᄅᄒ":"씷","씨ᄆ":"씸","씨ᄇ":"씹","씨ᄇᄉ":"씺","씨ᄉ":"씻","씨ᄊ":"씼","씨ᄋ":"씽","씨ᄌ":"씾","씨ᄎ":"씿","씨ᄏ":"앀","씨ᄐ":"앁","씨ᄑ":"앂","씨ᄒ":"앃","아":"아","아ᄀ":"악","아ᄁ":"앆","아ᄀᄉ":"앇","아ᄂ":"안","아ᄂᄌ":"앉","아ᄂᄒ":"않","아ᄃ":"앋","아ᄅ":"알","아ᄅᄀ":"앍","아ᄅᄆ":"앎","아ᄅᄇ":"앏","아ᄅᄉ":"앐","아ᄅᄐ":"앑","아ᄅᄑ":"앒","아ᄅᄒ":"앓","아ᄆ":"암","아ᄇ":"압","아ᄇᄉ":"앖","아ᄉ":"앗","아ᄊ":"았","아ᄋ":"앙","아ᄌ":"앚","아ᄎ":"앛","아ᄏ":"앜","아ᄐ":"앝","아ᄑ":"앞","아ᄒ":"앟","애":"애","애ᄀ":"액","애ᄁ":"앢","애ᄀᄉ":"앣","애ᄂ":"앤","애ᄂᄌ":"앥","애ᄂᄒ":"앦","애ᄃ":"앧","애ᄅ":"앨","애ᄅᄀ":"앩","애ᄅᄆ":"앪","애ᄅᄇ":"앫","애ᄅᄉ":"앬","애ᄅᄐ":"앭","애ᄅᄑ":"앮","애ᄅᄒ":"앯","애ᄆ":"앰","애ᄇ":"앱","애ᄇᄉ":"앲","애ᄉ":"앳","애ᄊ":"앴","애ᄋ":"앵","애ᄌ":"앶","애ᄎ":"앷","애ᄏ":"앸","애ᄐ":"앹","애ᄑ":"앺","애ᄒ":"앻","야":"야","야ᄀ":"약","야ᄁ":"앾","야ᄀᄉ":"앿","야ᄂ":"얀","야ᄂᄌ":"얁","야ᄂᄒ":"얂","야ᄃ":"얃","야ᄅ":"얄","야ᄅᄀ":"얅","야ᄅᄆ":"얆","야ᄅᄇ":"얇","야ᄅᄉ":"얈","야ᄅᄐ":"얉","야ᄅᄑ":"얊","야ᄅᄒ":"얋","야ᄆ":"얌","야ᄇ":"얍","야ᄇᄉ":"얎","야ᄉ":"얏","야ᄊ":"얐","야ᄋ":"양","야ᄌ":"얒","야ᄎ":"얓","야ᄏ":"얔","야ᄐ":"얕","야ᄑ":"얖","야ᄒ":"얗","얘":"얘","얘ᄀ":"얙","얘ᄁ":"얚","얘ᄀᄉ":"얛","얘ᄂ":"얜","얘ᄂᄌ":"얝","얘ᄂᄒ":"얞","얘ᄃ":"얟","얘ᄅ":"얠","얘ᄅᄀ":"얡","얘ᄅᄆ":"얢","얘ᄅᄇ":"얣","얘ᄅᄉ":"얤","얘ᄅᄐ":"얥","얘ᄅᄑ":"얦","얘ᄅᄒ":"얧","얘ᄆ":"얨","얘ᄇ":"얩","얘ᄇᄉ":"얪","얘ᄉ":"얫","얘ᄊ":"얬","얘ᄋ":"얭","얘ᄌ":"얮","얘ᄎ":"얯","얘ᄏ":"얰","얘ᄐ":"얱","얘ᄑ":"얲","얘ᄒ":"얳","어":"어","어ᄀ":"억","어ᄁ":"얶","어ᄀᄉ":"얷","어ᄂ":"언","어ᄂᄌ":"얹","어ᄂᄒ":"얺","어ᄃ":"얻","어ᄅ":"얼","어ᄅᄀ":"얽","어ᄅᄆ":"얾","어ᄅᄇ":"얿","어ᄅᄉ":"엀","어ᄅᄐ":"엁","어ᄅᄑ":"엂","어ᄅᄒ":"엃","어ᄆ":"엄","어ᄇ":"업","어ᄇᄉ":"없","어ᄉ":"엇","어ᄊ":"었","어ᄋ":"엉","어ᄌ":"엊","어ᄎ":"엋","어ᄏ":"엌","어ᄐ":"엍","어ᄑ":"엎","어ᄒ":"엏","에":"에","에ᄀ":"엑","에ᄁ":"엒","에ᄀᄉ":"엓","에ᄂ":"엔","에ᄂᄌ":"엕","에ᄂᄒ":"엖","에ᄃ":"엗","에ᄅ":"엘","에ᄅᄀ":"엙","에ᄅᄆ":"엚","에ᄅᄇ":"엛","에ᄅᄉ":"엜","에ᄅᄐ":"엝","에ᄅᄑ":"엞","에ᄅᄒ":"엟","에ᄆ":"엠","에ᄇ":"엡","에ᄇᄉ":"엢","에ᄉ":"엣","에ᄊ":"엤","에ᄋ":"엥","에ᄌ":"엦","에ᄎ":"엧","에ᄏ":"엨","에ᄐ":"엩","에ᄑ":"엪","에ᄒ":"엫","여":"여","여ᄀ":"역","여ᄁ":"엮","여ᄀᄉ":"엯","여ᄂ":"연","여ᄂᄌ":"엱","여ᄂᄒ":"엲","여ᄃ":"엳","여ᄅ":"열","여ᄅᄀ":"엵","여ᄅᄆ":"엶","여ᄅᄇ":"엷","여ᄅᄉ":"엸","여ᄅᄐ":"엹","여ᄅᄑ":"엺","여ᄅᄒ":"엻","여ᄆ":"염","여ᄇ":"엽","여ᄇᄉ":"엾","여ᄉ":"엿","여ᄊ":"였","여ᄋ":"영","여ᄌ":"옂","여ᄎ":"옃","여ᄏ":"옄","여ᄐ":"옅","여ᄑ":"옆","여ᄒ":"옇","예":"예","예ᄀ":"옉","예ᄁ":"옊","예ᄀᄉ":"옋","예ᄂ":"옌","예ᄂᄌ":"옍","예ᄂᄒ":"옎","예ᄃ":"옏","예ᄅ":"옐","예ᄅᄀ":"옑","예ᄅᄆ":"옒","예ᄅᄇ":"옓","예ᄅᄉ":"옔","예ᄅᄐ":"옕","예ᄅᄑ":"옖","예ᄅᄒ":"옗","예ᄆ":"옘","예ᄇ":"옙","예ᄇᄉ":"옚","예ᄉ":"옛","예ᄊ":"옜","예ᄋ":"옝","예ᄌ":"옞","예ᄎ":"옟","예ᄏ":"옠","예ᄐ":"옡","예ᄑ":"옢","예ᄒ":"옣","오":"오","오ᄀ":"옥","오ᄁ":"옦","오ᄀᄉ":"옧","오ᄂ":"온","오ᄂᄌ":"옩","오ᄂᄒ":"옪","오ᄃ":"옫","오ᄅ":"올","오ᄅᄀ":"옭","오ᄅᄆ":"옮","오ᄅᄇ":"옯","오ᄅᄉ":"옰","오ᄅᄐ":"옱","오ᄅᄑ":"옲","오ᄅᄒ":"옳","오ᄆ":"옴","오ᄇ":"옵","오ᄇᄉ":"옶","오ᄉ":"옷","오ᄊ":"옸","오ᄋ":"옹","오ᄌ":"옺","오ᄎ":"옻","오ᄏ":"옼","오ᄐ":"옽","오ᄑ":"옾","오ᄒ":"옿","오ᅡ":"와","오ᅡᄀ":"왁","오ᅡᄁ":"왂","오ᅡᄀᄉ":"왃","오ᅡᄂ":"완","오ᅡᄂᄌ":"왅","오ᅡᄂᄒ":"왆","오ᅡᄃ":"왇","오ᅡᄅ":"왈","오ᅡᄅᄀ":"왉","오ᅡᄅᄆ":"왊","오ᅡᄅᄇ":"왋","오ᅡᄅᄉ":"왌","오ᅡᄅᄐ":"왍","오ᅡᄅᄑ":"왎","오ᅡᄅᄒ":"왏","오ᅡᄆ":"왐","오ᅡᄇ":"왑","오ᅡᄇᄉ":"왒","오ᅡᄉ":"왓","오ᅡᄊ":"왔","오ᅡᄋ":"왕","오ᅡᄌ":"왖","오ᅡᄎ":"왗","오ᅡᄏ":"왘","오ᅡᄐ":"왙","오ᅡᄑ":"왚","오ᅡᄒ":"왛","오ᅢ":"왜","오ᅢᄀ":"왝","오ᅢᄁ":"왞","오ᅢᄀᄉ":"왟","오ᅢᄂ":"왠","오ᅢᄂᄌ":"왡","오ᅢᄂᄒ":"왢","오ᅢᄃ":"왣","오ᅢᄅ":"왤","오ᅢᄅᄀ":"왥","오ᅢᄅᄆ":"왦","오ᅢᄅᄇ":"왧","오ᅢᄅᄉ":"왨","오ᅢᄅᄐ":"왩","오ᅢᄅᄑ":"왪","오ᅢᄅᄒ":"왫","오ᅢᄆ":"왬","오ᅢᄇ":"왭","오ᅢᄇᄉ":"왮","오ᅢᄉ":"왯","오ᅢᄊ":"왰","오ᅢᄋ":"왱","오ᅢᄌ":"왲","오ᅢᄎ":"왳","오ᅢᄏ":"왴","오ᅢᄐ":"왵","오ᅢᄑ":"왶","오ᅢᄒ":"왷","오ᅵ":"외","오ᅵᄀ":"왹","오ᅵᄁ":"왺","오ᅵᄀᄉ":"왻","오ᅵᄂ":"왼","오ᅵᄂᄌ":"왽","오ᅵᄂᄒ":"왾","오ᅵᄃ":"왿","오ᅵᄅ":"욀","오ᅵᄅᄀ":"욁","오ᅵᄅᄆ":"욂","오ᅵᄅᄇ":"욃","오ᅵᄅᄉ":"욄","오ᅵᄅᄐ":"욅","오ᅵᄅᄑ":"욆","오ᅵᄅᄒ":"욇","오ᅵᄆ":"욈","오ᅵᄇ":"욉","오ᅵᄇᄉ":"욊","오ᅵᄉ":"욋","오ᅵᄊ":"욌","오ᅵᄋ":"욍","오ᅵᄌ":"욎","오ᅵᄎ":"욏","오ᅵᄏ":"욐","오ᅵᄐ":"욑","오ᅵᄑ":"욒","오ᅵᄒ":"욓","요":"요","요ᄀ":"욕","요ᄁ":"욖","요ᄀᄉ":"욗","요ᄂ":"욘","요ᄂᄌ":"욙","요ᄂᄒ":"욚","요ᄃ":"욛","요ᄅ":"욜","요ᄅᄀ":"욝","요ᄅᄆ":"욞","요ᄅᄇ":"욟","요ᄅᄉ":"욠","요ᄅᄐ":"욡","요ᄅᄑ":"욢","요ᄅᄒ":"욣","요ᄆ":"욤","요ᄇ":"욥","요ᄇᄉ":"욦","요ᄉ":"욧","요ᄊ":"욨","요ᄋ":"용","요ᄌ":"욪","요ᄎ":"욫","요ᄏ":"욬","요ᄐ":"욭","요ᄑ":"욮","요ᄒ":"욯","우":"우","우ᄀ":"욱","우ᄁ":"욲","우ᄀᄉ":"욳","우ᄂ":"운","우ᄂᄌ":"욵","우ᄂᄒ":"욶","우ᄃ":"욷","우ᄅ":"울","우ᄅᄀ":"욹","우ᄅᄆ":"욺","우ᄅᄇ":"욻","우ᄅᄉ":"욼","우ᄅᄐ":"욽","우ᄅᄑ":"욾","우ᄅᄒ":"욿","우ᄆ":"움","우ᄇ":"웁","우ᄇᄉ":"웂","우ᄉ":"웃","우ᄊ":"웄","우ᄋ":"웅","우ᄌ":"웆","우ᄎ":"웇","우ᄏ":"웈","우ᄐ":"웉","우ᄑ":"웊","우ᄒ":"웋","우ᅥ":"워","우ᅥᄀ":"웍","우ᅥᄁ":"웎","우ᅥᄀᄉ":"웏","우ᅥᄂ":"원","우ᅥᄂᄌ":"웑","우ᅥᄂᄒ":"웒","우ᅥᄃ":"웓","우ᅥᄅ":"월","우ᅥᄅᄀ":"웕","우ᅥᄅᄆ":"웖","우ᅥᄅᄇ":"웗","우ᅥᄅᄉ":"웘","우ᅥᄅᄐ":"웙","우ᅥᄅᄑ":"웚","우ᅥᄅᄒ":"웛","우ᅥᄆ":"웜","우ᅥᄇ":"웝","우ᅥᄇᄉ":"웞","우ᅥᄉ":"웟","우ᅥᄊ":"웠","우ᅥᄋ":"웡","우ᅥᄌ":"웢","우ᅥᄎ":"웣","우ᅥᄏ":"웤","우ᅥᄐ":"웥","우ᅥᄑ":"웦","우ᅥᄒ":"웧","우ᅦ":"웨","우ᅦᄀ":"웩","우ᅦᄁ":"웪","우ᅦᄀᄉ":"웫","우ᅦᄂ":"웬","우ᅦᄂᄌ":"웭","우ᅦᄂᄒ":"웮","우ᅦᄃ":"웯","우ᅦᄅ":"웰","우ᅦᄅᄀ":"웱","우ᅦᄅᄆ":"웲","우ᅦᄅᄇ":"웳","우ᅦᄅᄉ":"웴","우ᅦᄅᄐ":"웵","우ᅦᄅᄑ":"웶","우ᅦᄅᄒ":"웷","우ᅦᄆ":"웸","우ᅦᄇ":"웹","우ᅦᄇᄉ":"웺","우ᅦᄉ":"웻","우ᅦᄊ":"웼","우ᅦᄋ":"웽","우ᅦᄌ":"웾","우ᅦᄎ":"웿","우ᅦᄏ":"윀","우ᅦᄐ":"윁","우ᅦᄑ":"윂","우ᅦᄒ":"윃","우ᅵ":"위","우ᅵᄀ":"윅","우ᅵᄁ":"윆","우ᅵᄀᄉ":"윇","우ᅵᄂ":"윈","우ᅵᄂᄌ":"윉","우ᅵᄂᄒ":"윊","우ᅵᄃ":"윋","우ᅵᄅ":"윌","우ᅵᄅᄀ":"윍","우ᅵᄅᄆ":"윎","우ᅵᄅᄇ":"윏","우ᅵᄅᄉ":"윐","우ᅵᄅᄐ":"윑","우ᅵᄅᄑ":"윒","우ᅵᄅᄒ":"윓","우ᅵᄆ":"윔","우ᅵᄇ":"윕","우ᅵᄇᄉ":"윖","우ᅵᄉ":"윗","우ᅵᄊ":"윘","우ᅵᄋ":"윙","우ᅵᄌ":"윚","우ᅵᄎ":"윛","우ᅵᄏ":"윜","우ᅵᄐ":"윝","우ᅵᄑ":"윞","우ᅵᄒ":"윟","유":"유","유ᄀ":"육","유ᄁ":"윢","유ᄀᄉ":"윣","유ᄂ":"윤","유ᄂᄌ":"윥","유ᄂᄒ":"윦","유ᄃ":"윧","유ᄅ":"율","유ᄅᄀ":"윩","유ᄅᄆ":"윪","유ᄅᄇ":"윫","유ᄅᄉ":"윬","유ᄅᄐ":"윭","유ᄅᄑ":"윮","유ᄅᄒ":"윯","유ᄆ":"윰","유ᄇ":"윱","유ᄇᄉ":"윲","유ᄉ":"윳","유ᄊ":"윴","유ᄋ":"융","유ᄌ":"윶","유ᄎ":"윷","유ᄏ":"윸","유ᄐ":"윹","유ᄑ":"윺","유ᄒ":"윻","으":"으","으ᄀ":"윽","으ᄁ":"윾","으ᄀᄉ":"윿","으ᄂ":"은","으ᄂᄌ":"읁","으ᄂᄒ":"읂","으ᄃ":"읃","으ᄅ":"을","으ᄅᄀ":"읅","으ᄅᄆ":"읆","으ᄅᄇ":"읇","으ᄅᄉ":"읈","으ᄅᄐ":"읉","으ᄅᄑ":"읊","으ᄅᄒ":"읋","으ᄆ":"음","으ᄇ":"읍","으ᄇᄉ":"읎","으ᄉ":"읏","으ᄊ":"읐","으ᄋ":"응","으ᄌ":"읒","으ᄎ":"읓","으ᄏ":"읔","으ᄐ":"읕","으ᄑ":"읖","으ᄒ":"읗","으ᅵ":"의","으ᅵᄀ":"읙","으ᅵᄁ":"읚","으ᅵᄀᄉ":"읛","으ᅵᄂ":"읜","으ᅵᄂᄌ":"읝","으ᅵᄂᄒ":"읞","으ᅵᄃ":"읟","으ᅵᄅ":"읠","으ᅵᄅᄀ":"읡","으ᅵᄅᄆ":"읢","으ᅵᄅᄇ":"읣","으ᅵᄅᄉ":"읤","으ᅵᄅᄐ":"읥","으ᅵᄅᄑ":"읦","으ᅵᄅᄒ":"읧","으ᅵᄆ":"읨","으ᅵᄇ":"읩","으ᅵᄇᄉ":"읪","으ᅵᄉ":"읫","으ᅵᄊ":"읬","으ᅵᄋ":"읭","으ᅵᄌ":"읮","으ᅵᄎ":"읯","으ᅵᄏ":"읰","으ᅵᄐ":"읱","으ᅵᄑ":"읲","으ᅵᄒ":"읳","이":"이","이ᄀ":"익","이ᄁ":"읶","이ᄀᄉ":"읷","이ᄂ":"인","이ᄂᄌ":"읹","이ᄂᄒ":"읺","이ᄃ":"읻","이ᄅ":"일","이ᄅᄀ":"읽","이ᄅᄆ":"읾","이ᄅᄇ":"읿","이ᄅᄉ":"잀","이ᄅᄐ":"잁","이ᄅᄑ":"잂","이ᄅᄒ":"잃","이ᄆ":"임","이ᄇ":"입","이ᄇᄉ":"잆","이ᄉ":"잇","이ᄊ":"있","이ᄋ":"잉","이ᄌ":"잊","이ᄎ":"잋","이ᄏ":"잌","이ᄐ":"잍","이ᄑ":"잎","이ᄒ":"잏","자":"자","자ᄀ":"작","자ᄁ":"잒","자ᄀᄉ":"잓","자ᄂ":"잔","자ᄂᄌ":"잕","자ᄂᄒ":"잖","자ᄃ":"잗","자ᄅ":"잘","자ᄅᄀ":"잙","자ᄅᄆ":"잚","자ᄅᄇ":"잛","자ᄅᄉ":"잜","자ᄅᄐ":"잝","자ᄅᄑ":"잞","자ᄅᄒ":"잟","자ᄆ":"잠","자ᄇ":"잡","자ᄇᄉ":"잢","자ᄉ":"잣","자ᄊ":"잤","자ᄋ":"장","자ᄌ":"잦","자ᄎ":"잧","자ᄏ":"잨","자ᄐ":"잩","자ᄑ":"잪","자ᄒ":"잫","재":"재","재ᄀ":"잭","재ᄁ":"잮","재ᄀᄉ":"잯","재ᄂ":"잰","재ᄂᄌ":"잱","재ᄂᄒ":"잲","재ᄃ":"잳","재ᄅ":"잴","재ᄅᄀ":"잵","재ᄅᄆ":"잶","재ᄅᄇ":"잷","재ᄅᄉ":"잸","재ᄅᄐ":"잹","재ᄅᄑ":"잺","재ᄅᄒ":"잻","재ᄆ":"잼","재ᄇ":"잽","재ᄇᄉ":"잾","재ᄉ":"잿","재ᄊ":"쟀","재ᄋ":"쟁","재ᄌ":"쟂","재ᄎ":"쟃","재ᄏ":"쟄","재ᄐ":"쟅","재ᄑ":"쟆","재ᄒ":"쟇","쟈":"쟈","쟈ᄀ":"쟉","쟈ᄁ":"쟊","쟈ᄀᄉ":"쟋","쟈ᄂ":"쟌","쟈ᄂᄌ":"쟍","쟈ᄂᄒ":"쟎","쟈ᄃ":"쟏","쟈ᄅ":"쟐","쟈ᄅᄀ":"쟑","쟈ᄅᄆ":"쟒","쟈ᄅᄇ":"쟓","쟈ᄅᄉ":"쟔","쟈ᄅᄐ":"쟕","쟈ᄅᄑ":"쟖","쟈ᄅᄒ":"쟗","쟈ᄆ":"쟘","쟈ᄇ":"쟙","쟈ᄇᄉ":"쟚","쟈ᄉ":"쟛","쟈ᄊ":"쟜","쟈ᄋ":"쟝","쟈ᄌ":"쟞","쟈ᄎ":"쟟","쟈ᄏ":"쟠","쟈ᄐ":"쟡","쟈ᄑ":"쟢","쟈ᄒ":"쟣","쟤":"쟤","쟤ᄀ":"쟥","쟤ᄁ":"쟦","쟤ᄀᄉ":"쟧","쟤ᄂ":"쟨","쟤ᄂᄌ":"쟩","쟤ᄂᄒ":"쟪","쟤ᄃ":"쟫","쟤ᄅ":"쟬","쟤ᄅᄀ":"쟭","쟤ᄅᄆ":"쟮","쟤ᄅᄇ":"쟯","쟤ᄅᄉ":"쟰","쟤ᄅᄐ":"쟱","쟤ᄅᄑ":"쟲","쟤ᄅᄒ":"쟳","쟤ᄆ":"쟴","쟤ᄇ":"쟵","쟤ᄇᄉ":"쟶","쟤ᄉ":"쟷","쟤ᄊ":"쟸","쟤ᄋ":"쟹","쟤ᄌ":"쟺","쟤ᄎ":"쟻","쟤ᄏ":"쟼","쟤ᄐ":"쟽","쟤ᄑ":"쟾","쟤ᄒ":"쟿","저":"저","저ᄀ":"적","저ᄁ":"젂","저ᄀᄉ":"젃","저ᄂ":"전","저ᄂᄌ":"젅","저ᄂᄒ":"젆","저ᄃ":"젇","저ᄅ":"절","저ᄅᄀ":"젉","저ᄅᄆ":"젊","저ᄅᄇ":"젋","저ᄅᄉ":"젌","저ᄅᄐ":"젍","저ᄅᄑ":"젎","저ᄅᄒ":"젏","저ᄆ":"점","저ᄇ":"접","저ᄇᄉ":"젒","저ᄉ":"젓","저ᄊ":"젔","저ᄋ":"정","저ᄌ":"젖","저ᄎ":"젗","저ᄏ":"젘","저ᄐ":"젙","저ᄑ":"젚","저ᄒ":"젛","제":"제","제ᄀ":"젝","제ᄁ":"젞","제ᄀᄉ":"젟","제ᄂ":"젠","제ᄂᄌ":"젡","제ᄂᄒ":"젢","제ᄃ":"젣","제ᄅ":"젤","제ᄅᄀ":"젥","제ᄅᄆ":"젦","제ᄅᄇ":"젧","제ᄅᄉ":"젨","제ᄅᄐ":"젩","제ᄅᄑ":"젪","제ᄅᄒ":"젫","제ᄆ":"젬","제ᄇ":"젭","제ᄇᄉ":"젮","제ᄉ":"젯","제ᄊ":"젰","제ᄋ":"젱","제ᄌ":"젲","제ᄎ":"젳","제ᄏ":"젴","제ᄐ":"젵","제ᄑ":"젶","제ᄒ":"젷","져":"져","져ᄀ":"젹","져ᄁ":"젺","져ᄀᄉ":"젻","져ᄂ":"젼","져ᄂᄌ":"젽","져ᄂᄒ":"젾","져ᄃ":"젿","져ᄅ":"졀","져ᄅᄀ":"졁","져ᄅᄆ":"졂","져ᄅᄇ":"졃","져ᄅᄉ":"졄","져ᄅᄐ":"졅","져ᄅᄑ":"졆","져ᄅᄒ":"졇","져ᄆ":"졈","져ᄇ":"졉","져ᄇᄉ":"졊","져ᄉ":"졋","져ᄊ":"졌","져ᄋ":"졍","져ᄌ":"졎","져ᄎ":"졏","져ᄏ":"졐","져ᄐ":"졑","져ᄑ":"졒","져ᄒ":"졓","졔":"졔","졔ᄀ":"졕","졔ᄁ":"졖","졔ᄀᄉ":"졗","졔ᄂ":"졘","졔ᄂᄌ":"졙","졔ᄂᄒ":"졚","졔ᄃ":"졛","졔ᄅ":"졜","졔ᄅᄀ":"졝","졔ᄅᄆ":"졞","졔ᄅᄇ":"졟","졔ᄅᄉ":"졠","졔ᄅᄐ":"졡","졔ᄅᄑ":"졢","졔ᄅᄒ":"졣","졔ᄆ":"졤","졔ᄇ":"졥","졔ᄇᄉ":"졦","졔ᄉ":"졧","졔ᄊ":"졨","졔ᄋ":"졩","졔ᄌ":"졪","졔ᄎ":"졫","졔ᄏ":"졬","졔ᄐ":"졭","졔ᄑ":"졮","졔ᄒ":"졯","조":"조","조ᄀ":"족","조ᄁ":"졲","조ᄀᄉ":"졳","조ᄂ":"존","조ᄂᄌ":"졵","조ᄂᄒ":"졶","조ᄃ":"졷","조ᄅ":"졸","조ᄅᄀ":"졹","조ᄅᄆ":"졺","조ᄅᄇ":"졻","조ᄅᄉ":"졼","조ᄅᄐ":"졽","조ᄅᄑ":"졾","조ᄅᄒ":"졿","조ᄆ":"좀","조ᄇ":"좁","조ᄇᄉ":"좂","조ᄉ":"좃","조ᄊ":"좄","조ᄋ":"종","조ᄌ":"좆","조ᄎ":"좇","조ᄏ":"좈","조ᄐ":"좉","조ᄑ":"좊","조ᄒ":"좋","조ᅡ":"좌","조ᅡᄀ":"좍","조ᅡᄁ":"좎","조ᅡᄀᄉ":"좏","조ᅡᄂ":"좐","조ᅡᄂᄌ":"좑","조ᅡᄂᄒ":"좒","조ᅡᄃ":"좓","조ᅡᄅ":"좔","조ᅡᄅᄀ":"좕","조ᅡᄅᄆ":"좖","조ᅡᄅᄇ":"좗","조ᅡᄅᄉ":"좘","조ᅡᄅᄐ":"좙","조ᅡᄅᄑ":"좚","조ᅡᄅᄒ":"좛","조ᅡᄆ":"좜","조ᅡᄇ":"좝","조ᅡᄇᄉ":"좞","조ᅡᄉ":"좟","조ᅡᄊ":"좠","조ᅡᄋ":"좡","조ᅡᄌ":"좢","조ᅡᄎ":"좣","조ᅡᄏ":"좤","조ᅡᄐ":"좥","조ᅡᄑ":"좦","조ᅡᄒ":"좧","조ᅢ":"좨","조ᅢᄀ":"좩","조ᅢᄁ":"좪","조ᅢᄀᄉ":"좫","조ᅢᄂ":"좬","조ᅢᄂᄌ":"좭","조ᅢᄂᄒ":"좮","조ᅢᄃ":"좯","조ᅢᄅ":"좰","조ᅢᄅᄀ":"좱","조ᅢᄅᄆ":"좲","조ᅢᄅᄇ":"좳","조ᅢᄅᄉ":"좴","조ᅢᄅᄐ":"좵","조ᅢᄅᄑ":"좶","조ᅢᄅᄒ":"좷","조ᅢᄆ":"좸","조ᅢᄇ":"좹","조ᅢᄇᄉ":"좺","조ᅢᄉ":"좻","조ᅢᄊ":"좼","조ᅢᄋ":"좽","조ᅢᄌ":"좾","조ᅢᄎ":"좿","조ᅢᄏ":"죀","조ᅢᄐ":"죁","조ᅢᄑ":"죂","조ᅢᄒ":"죃","조ᅵ":"죄","조ᅵᄀ":"죅","조ᅵᄁ":"죆","조ᅵᄀᄉ":"죇","조ᅵᄂ":"죈","조ᅵᄂᄌ":"죉","조ᅵᄂᄒ":"죊","조ᅵᄃ":"죋","조ᅵᄅ":"죌","조ᅵᄅᄀ":"죍","조ᅵᄅᄆ":"죎","조ᅵᄅᄇ":"죏","조ᅵᄅᄉ":"죐","조ᅵᄅᄐ":"죑","조ᅵᄅᄑ":"죒","조ᅵᄅᄒ":"죓","조ᅵᄆ":"죔","조ᅵᄇ":"죕","조ᅵᄇᄉ":"죖","조ᅵᄉ":"죗","조ᅵᄊ":"죘","조ᅵᄋ":"죙","조ᅵᄌ":"죚","조ᅵᄎ":"죛","조ᅵᄏ":"죜","조ᅵᄐ":"죝","조ᅵᄑ":"죞","조ᅵᄒ":"죟","죠":"죠","죠ᄀ":"죡","죠ᄁ":"죢","죠ᄀᄉ":"죣","죠ᄂ":"죤","죠ᄂᄌ":"죥","죠ᄂᄒ":"죦","죠ᄃ":"죧","죠ᄅ":"죨","죠ᄅᄀ":"죩","죠ᄅᄆ":"죪","죠ᄅᄇ":"죫","죠ᄅᄉ":"죬","죠ᄅᄐ":"죭","죠ᄅᄑ":"죮","죠ᄅᄒ":"죯","죠ᄆ":"죰","죠ᄇ":"죱","죠ᄇᄉ":"죲","죠ᄉ":"죳","죠ᄊ":"죴","죠ᄋ":"죵","죠ᄌ":"죶","죠ᄎ":"죷","죠ᄏ":"죸","죠ᄐ":"죹","죠ᄑ":"죺","죠ᄒ":"죻","주":"주","주ᄀ":"죽","주ᄁ":"죾","주ᄀᄉ":"죿","주ᄂ":"준","주ᄂᄌ":"줁","주ᄂᄒ":"줂","주ᄃ":"줃","주ᄅ":"줄","주ᄅᄀ":"줅","주ᄅᄆ":"줆","주ᄅᄇ":"줇","주ᄅᄉ":"줈","주ᄅᄐ":"줉","주ᄅᄑ":"줊","주ᄅᄒ":"줋","주ᄆ":"줌","주ᄇ":"줍","주ᄇᄉ":"줎","주ᄉ":"줏","주ᄊ":"줐","주ᄋ":"중","주ᄌ":"줒","주ᄎ":"줓","주ᄏ":"줔","주ᄐ":"줕","주ᄑ":"줖","주ᄒ":"줗","주ᅥ":"줘","주ᅥᄀ":"줙","주ᅥᄁ":"줚","주ᅥᄀᄉ":"줛","주ᅥᄂ":"줜","주ᅥᄂᄌ":"줝","주ᅥᄂᄒ":"줞","주ᅥᄃ":"줟","주ᅥᄅ":"줠","주ᅥᄅᄀ":"줡","주ᅥᄅᄆ":"줢","주ᅥᄅᄇ":"줣","주ᅥᄅᄉ":"줤","주ᅥᄅᄐ":"줥","주ᅥᄅᄑ":"줦","주ᅥᄅᄒ":"줧","주ᅥᄆ":"줨","주ᅥᄇ":"줩","주ᅥᄇᄉ":"줪","주ᅥᄉ":"줫","주ᅥᄊ":"줬","주ᅥᄋ":"줭","주ᅥᄌ":"줮","주ᅥᄎ":"줯","주ᅥᄏ":"줰","주ᅥᄐ":"줱","주ᅥᄑ":"줲","주ᅥᄒ":"줳","주ᅦ":"줴","주ᅦᄀ":"줵","주ᅦᄁ":"줶","주ᅦᄀᄉ":"줷","주ᅦᄂ":"줸","주ᅦᄂᄌ":"줹","주ᅦᄂᄒ":"줺","주ᅦᄃ":"줻","주ᅦᄅ":"줼","주ᅦᄅᄀ":"줽","주ᅦᄅᄆ":"줾","주ᅦᄅᄇ":"줿","주ᅦᄅᄉ":"쥀","주ᅦᄅᄐ":"쥁","주ᅦᄅᄑ":"쥂","주ᅦᄅᄒ":"쥃","주ᅦᄆ":"쥄","주ᅦᄇ":"쥅","주ᅦᄇᄉ":"쥆","주ᅦᄉ":"쥇","주ᅦᄊ":"쥈","주ᅦᄋ":"쥉","주ᅦᄌ":"쥊","주ᅦᄎ":"쥋","주ᅦᄏ":"쥌","주ᅦᄐ":"쥍","주ᅦᄑ":"쥎","주ᅦᄒ":"쥏","주ᅵ":"쥐","주ᅵᄀ":"쥑","주ᅵᄁ":"쥒","주ᅵᄀᄉ":"쥓","주ᅵᄂ":"쥔","주ᅵᄂᄌ":"쥕","주ᅵᄂᄒ":"쥖","주ᅵᄃ":"쥗","주ᅵᄅ":"쥘","주ᅵᄅᄀ":"쥙","주ᅵᄅᄆ":"쥚","주ᅵᄅᄇ":"쥛","주ᅵᄅᄉ":"쥜","주ᅵᄅᄐ":"쥝","주ᅵᄅᄑ":"쥞","주ᅵᄅᄒ":"쥟","주ᅵᄆ":"쥠","주ᅵᄇ":"쥡","주ᅵᄇᄉ":"쥢","주ᅵᄉ":"쥣","주ᅵᄊ":"쥤","주ᅵᄋ":"쥥","주ᅵᄌ":"쥦","주ᅵᄎ":"쥧","주ᅵᄏ":"쥨","주ᅵᄐ":"쥩","주ᅵᄑ":"쥪","주ᅵᄒ":"쥫","쥬":"쥬","쥬ᄀ":"쥭","쥬ᄁ":"쥮","쥬ᄀᄉ":"쥯","쥬ᄂ":"쥰","쥬ᄂᄌ":"쥱","쥬ᄂᄒ":"쥲","쥬ᄃ":"쥳","쥬ᄅ":"쥴","쥬ᄅᄀ":"쥵","쥬ᄅᄆ":"쥶","쥬ᄅᄇ":"쥷","쥬ᄅᄉ":"쥸","쥬ᄅᄐ":"쥹","쥬ᄅᄑ":"쥺","쥬ᄅᄒ":"쥻","쥬ᄆ":"쥼","쥬ᄇ":"쥽","쥬ᄇᄉ":"쥾","쥬ᄉ":"쥿","쥬ᄊ":"즀","쥬ᄋ":"즁","쥬ᄌ":"즂","쥬ᄎ":"즃","쥬ᄏ":"즄","쥬ᄐ":"즅","쥬ᄑ":"즆","쥬ᄒ":"즇","즈":"즈","즈ᄀ":"즉","즈ᄁ":"즊","즈ᄀᄉ":"즋","즈ᄂ":"즌","즈ᄂᄌ":"즍","즈ᄂᄒ":"즎","즈ᄃ":"즏","즈ᄅ":"즐","즈ᄅᄀ":"즑","즈ᄅᄆ":"즒","즈ᄅᄇ":"즓","즈ᄅᄉ":"즔","즈ᄅᄐ":"즕","즈ᄅᄑ":"즖","즈ᄅᄒ":"즗","즈ᄆ":"즘","즈ᄇ":"즙","즈ᄇᄉ":"즚","즈ᄉ":"즛","즈ᄊ":"즜","즈ᄋ":"증","즈ᄌ":"즞","즈ᄎ":"즟","즈ᄏ":"즠","즈ᄐ":"즡","즈ᄑ":"즢","즈ᄒ":"즣","즈ᅵ":"즤","즈ᅵᄀ":"즥","즈ᅵᄁ":"즦","즈ᅵᄀᄉ":"즧","즈ᅵᄂ":"즨","즈ᅵᄂᄌ":"즩","즈ᅵᄂᄒ":"즪","즈ᅵᄃ":"즫","즈ᅵᄅ":"즬","즈ᅵᄅᄀ":"즭","즈ᅵᄅᄆ":"즮","즈ᅵᄅᄇ":"즯","즈ᅵᄅᄉ":"즰","즈ᅵᄅᄐ":"즱","즈ᅵᄅᄑ":"즲","즈ᅵᄅᄒ":"즳","즈ᅵᄆ":"즴","즈ᅵᄇ":"즵","즈ᅵᄇᄉ":"즶","즈ᅵᄉ":"즷","즈ᅵᄊ":"즸","즈ᅵᄋ":"즹","즈ᅵᄌ":"즺","즈ᅵᄎ":"즻","즈ᅵᄏ":"즼","즈ᅵᄐ":"즽","즈ᅵᄑ":"즾","즈ᅵᄒ":"즿","지":"지","지ᄀ":"직","지ᄁ":"짂","지ᄀᄉ":"짃","지ᄂ":"진","지ᄂᄌ":"짅","지ᄂᄒ":"짆","지ᄃ":"짇","지ᄅ":"질","지ᄅᄀ":"짉","지ᄅᄆ":"짊","지ᄅᄇ":"짋","지ᄅᄉ":"짌","지ᄅᄐ":"짍","지ᄅᄑ":"짎","지ᄅᄒ":"짏","지ᄆ":"짐","지ᄇ":"집","지ᄇᄉ":"짒","지ᄉ":"짓","지ᄊ":"짔","지ᄋ":"징","지ᄌ":"짖","지ᄎ":"짗","지ᄏ":"짘","지ᄐ":"짙","지ᄑ":"짚","지ᄒ":"짛","짜":"짜","짜ᄀ":"짝","짜ᄁ":"짞","짜ᄀᄉ":"짟","짜ᄂ":"짠","짜ᄂᄌ":"짡","짜ᄂᄒ":"짢","짜ᄃ":"짣","짜ᄅ":"짤","짜ᄅᄀ":"짥","짜ᄅᄆ":"짦","짜ᄅᄇ":"짧","짜ᄅᄉ":"짨","짜ᄅᄐ":"짩","짜ᄅᄑ":"짪","짜ᄅᄒ":"짫","짜ᄆ":"짬","짜ᄇ":"짭","짜ᄇᄉ":"짮","짜ᄉ":"짯","짜ᄊ":"짰","짜ᄋ":"짱","짜ᄌ":"짲","짜ᄎ":"짳","짜ᄏ":"짴","짜ᄐ":"짵","짜ᄑ":"짶","짜ᄒ":"짷","째":"째","째ᄀ":"짹","째ᄁ":"짺","째ᄀᄉ":"짻","째ᄂ":"짼","째ᄂᄌ":"짽","째ᄂᄒ":"짾","째ᄃ":"짿","째ᄅ":"쨀","째ᄅᄀ":"쨁","째ᄅᄆ":"쨂","째ᄅᄇ":"쨃","째ᄅᄉ":"쨄","째ᄅᄐ":"쨅","째ᄅᄑ":"쨆","째ᄅᄒ":"쨇","째ᄆ":"쨈","째ᄇ":"쨉","째ᄇᄉ":"쨊","째ᄉ":"쨋","째ᄊ":"쨌","째ᄋ":"쨍","째ᄌ":"쨎","째ᄎ":"쨏","째ᄏ":"쨐","째ᄐ":"쨑","째ᄑ":"쨒","째ᄒ":"쨓","쨔":"쨔","쨔ᄀ":"쨕","쨔ᄁ":"쨖","쨔ᄀᄉ":"쨗","쨔ᄂ":"쨘","쨔ᄂᄌ":"쨙","쨔ᄂᄒ":"쨚","쨔ᄃ":"쨛","쨔ᄅ":"쨜","쨔ᄅᄀ":"쨝","쨔ᄅᄆ":"쨞","쨔ᄅᄇ":"쨟","쨔ᄅᄉ":"쨠","쨔ᄅᄐ":"쨡","쨔ᄅᄑ":"쨢","쨔ᄅᄒ":"쨣","쨔ᄆ":"쨤","쨔ᄇ":"쨥","쨔ᄇᄉ":"쨦","쨔ᄉ":"쨧","쨔ᄊ":"쨨","쨔ᄋ":"쨩","쨔ᄌ":"쨪","쨔ᄎ":"쨫","쨔ᄏ":"쨬","쨔ᄐ":"쨭","쨔ᄑ":"쨮","쨔ᄒ":"쨯","쨰":"쨰","쨰ᄀ":"쨱","쨰ᄁ":"쨲","쨰ᄀᄉ":"쨳","쨰ᄂ":"쨴","쨰ᄂᄌ":"쨵","쨰ᄂᄒ":"쨶","쨰ᄃ":"쨷","쨰ᄅ":"쨸","쨰ᄅᄀ":"쨹","쨰ᄅᄆ":"쨺","쨰ᄅᄇ":"쨻","쨰ᄅᄉ":"쨼","쨰ᄅᄐ":"쨽","쨰ᄅᄑ":"쨾","쨰ᄅᄒ":"쨿","쨰ᄆ":"쩀","쨰ᄇ":"쩁","쨰ᄇᄉ":"쩂","쨰ᄉ":"쩃","쨰ᄊ":"쩄","쨰ᄋ":"쩅","쨰ᄌ":"쩆","쨰ᄎ":"쩇","쨰ᄏ":"쩈","쨰ᄐ":"쩉","쨰ᄑ":"쩊","쨰ᄒ":"쩋","쩌":"쩌","쩌ᄀ":"쩍","쩌ᄁ":"쩎","쩌ᄀᄉ":"쩏","쩌ᄂ":"쩐","쩌ᄂᄌ":"쩑","쩌ᄂᄒ":"쩒","쩌ᄃ":"쩓","쩌ᄅ":"쩔","쩌ᄅᄀ":"쩕","쩌ᄅᄆ":"쩖","쩌ᄅᄇ":"쩗","쩌ᄅᄉ":"쩘","쩌ᄅᄐ":"쩙","쩌ᄅᄑ":"쩚","쩌ᄅᄒ":"쩛","쩌ᄆ":"쩜","쩌ᄇ":"쩝","쩌ᄇᄉ":"쩞","쩌ᄉ":"쩟","쩌ᄊ":"쩠","쩌ᄋ":"쩡","쩌ᄌ":"쩢","쩌ᄎ":"쩣","쩌ᄏ":"쩤","쩌ᄐ":"쩥","쩌ᄑ":"쩦","쩌ᄒ":"쩧","쩨":"쩨","쩨ᄀ":"쩩","쩨ᄁ":"쩪","쩨ᄀᄉ":"쩫","쩨ᄂ":"쩬","쩨ᄂᄌ":"쩭","쩨ᄂᄒ":"쩮","쩨ᄃ":"쩯","쩨ᄅ":"쩰","쩨ᄅᄀ":"쩱","쩨ᄅᄆ":"쩲","쩨ᄅᄇ":"쩳","쩨ᄅᄉ":"쩴","쩨ᄅᄐ":"쩵","쩨ᄅᄑ":"쩶","쩨ᄅᄒ":"쩷","쩨ᄆ":"쩸","쩨ᄇ":"쩹","쩨ᄇᄉ":"쩺","쩨ᄉ":"쩻","쩨ᄊ":"쩼","쩨ᄋ":"쩽","쩨ᄌ":"쩾","쩨ᄎ":"쩿","쩨ᄏ":"쪀","쩨ᄐ":"쪁","쩨ᄑ":"쪂","쩨ᄒ":"쪃","쪄":"쪄","쪄ᄀ":"쪅","쪄ᄁ":"쪆","쪄ᄀᄉ":"쪇","쪄ᄂ":"쪈","쪄ᄂᄌ":"쪉","쪄ᄂᄒ":"쪊","쪄ᄃ":"쪋","쪄ᄅ":"쪌","쪄ᄅᄀ":"쪍","쪄ᄅᄆ":"쪎","쪄ᄅᄇ":"쪏","쪄ᄅᄉ":"쪐","쪄ᄅᄐ":"쪑","쪄ᄅᄑ":"쪒","쪄ᄅᄒ":"쪓","쪄ᄆ":"쪔","쪄ᄇ":"쪕","쪄ᄇᄉ":"쪖","쪄ᄉ":"쪗","쪄ᄊ":"쪘","쪄ᄋ":"쪙","쪄ᄌ":"쪚","쪄ᄎ":"쪛","쪄ᄏ":"쪜","쪄ᄐ":"쪝","쪄ᄑ":"쪞","쪄ᄒ":"쪟","쪠":"쪠","쪠ᄀ":"쪡","쪠ᄁ":"쪢","쪠ᄀᄉ":"쪣","쪠ᄂ":"쪤","쪠ᄂᄌ":"쪥","쪠ᄂᄒ":"쪦","쪠ᄃ":"쪧","쪠ᄅ":"쪨","쪠ᄅᄀ":"쪩","쪠ᄅᄆ":"쪪","쪠ᄅᄇ":"쪫","쪠ᄅᄉ":"쪬","쪠ᄅᄐ":"쪭","쪠ᄅᄑ":"쪮","쪠ᄅᄒ":"쪯","쪠ᄆ":"쪰","쪠ᄇ":"쪱","쪠ᄇᄉ":"쪲","쪠ᄉ":"쪳","쪠ᄊ":"쪴","쪠ᄋ":"쪵","쪠ᄌ":"쪶","쪠ᄎ":"쪷","쪠ᄏ":"쪸","쪠ᄐ":"쪹","쪠ᄑ":"쪺","쪠ᄒ":"쪻","쪼":"쪼","쪼ᄀ":"쪽","쪼ᄁ":"쪾","쪼ᄀᄉ":"쪿","쪼ᄂ":"쫀","쪼ᄂᄌ":"쫁","쪼ᄂᄒ":"쫂","쪼ᄃ":"쫃","쪼ᄅ":"쫄","쪼ᄅᄀ":"쫅","쪼ᄅᄆ":"쫆","쪼ᄅᄇ":"쫇","쪼ᄅᄉ":"쫈","쪼ᄅᄐ":"쫉","쪼ᄅᄑ":"쫊","쪼ᄅᄒ":"쫋","쪼ᄆ":"쫌","쪼ᄇ":"쫍","쪼ᄇᄉ":"쫎","쪼ᄉ":"쫏","쪼ᄊ":"쫐","쪼ᄋ":"쫑","쪼ᄌ":"쫒","쪼ᄎ":"쫓","쪼ᄏ":"쫔","쪼ᄐ":"쫕","쪼ᄑ":"쫖","쪼ᄒ":"쫗","쪼ᅡ":"쫘","쪼ᅡᄀ":"쫙","쪼ᅡᄁ":"쫚","쪼ᅡᄀᄉ":"쫛","쪼ᅡᄂ":"쫜","쪼ᅡᄂᄌ":"쫝","쪼ᅡᄂᄒ":"쫞","쪼ᅡᄃ":"쫟","쪼ᅡᄅ":"쫠","쪼ᅡᄅᄀ":"쫡","쪼ᅡᄅᄆ":"쫢","쪼ᅡᄅᄇ":"쫣","쪼ᅡᄅᄉ":"쫤","쪼ᅡᄅᄐ":"쫥","쪼ᅡᄅᄑ":"쫦","쪼ᅡᄅᄒ":"쫧","쪼ᅡᄆ":"쫨","쪼ᅡᄇ":"쫩","쪼ᅡᄇᄉ":"쫪","쪼ᅡᄉ":"쫫","쪼ᅡᄊ":"쫬","쪼ᅡᄋ":"쫭","쪼ᅡᄌ":"쫮","쪼ᅡᄎ":"쫯","쪼ᅡᄏ":"쫰","쪼ᅡᄐ":"쫱","쪼ᅡᄑ":"쫲","쪼ᅡᄒ":"쫳","쪼ᅢ":"쫴","쪼ᅢᄀ":"쫵","쪼ᅢᄁ":"쫶","쪼ᅢᄀᄉ":"쫷","쪼ᅢᄂ":"쫸","쪼ᅢᄂᄌ":"쫹","쪼ᅢᄂᄒ":"쫺","쪼ᅢᄃ":"쫻","쪼ᅢᄅ":"쫼","쪼ᅢᄅᄀ":"쫽","쪼ᅢᄅᄆ":"쫾","쪼ᅢᄅᄇ":"쫿","쪼ᅢᄅᄉ":"쬀","쪼ᅢᄅᄐ":"쬁","쪼ᅢᄅᄑ":"쬂","쪼ᅢᄅᄒ":"쬃","쪼ᅢᄆ":"쬄","쪼ᅢᄇ":"쬅","쪼ᅢᄇᄉ":"쬆","쪼ᅢᄉ":"쬇","쪼ᅢᄊ":"쬈","쪼ᅢᄋ":"쬉","쪼ᅢᄌ":"쬊","쪼ᅢᄎ":"쬋","쪼ᅢᄏ":"쬌","쪼ᅢᄐ":"쬍","쪼ᅢᄑ":"쬎","쪼ᅢᄒ":"쬏","쪼ᅵ":"쬐","쪼ᅵᄀ":"쬑","쪼ᅵᄁ":"쬒","쪼ᅵᄀᄉ":"쬓","쪼ᅵᄂ":"쬔","쪼ᅵᄂᄌ":"쬕","쪼ᅵᄂᄒ":"쬖","쪼ᅵᄃ":"쬗","쪼ᅵᄅ":"쬘","쪼ᅵᄅᄀ":"쬙","쪼ᅵᄅᄆ":"쬚","쪼ᅵᄅᄇ":"쬛","쪼ᅵᄅᄉ":"쬜","쪼ᅵᄅᄐ":"쬝","쪼ᅵᄅᄑ":"쬞","쪼ᅵᄅᄒ":"쬟","쪼ᅵᄆ":"쬠","쪼ᅵᄇ":"쬡","쪼ᅵᄇᄉ":"쬢","쪼ᅵᄉ":"쬣","쪼ᅵᄊ":"쬤","쪼ᅵᄋ":"쬥","쪼ᅵᄌ":"쬦","쪼ᅵᄎ":"쬧","쪼ᅵᄏ":"쬨","쪼ᅵᄐ":"쬩","쪼ᅵᄑ":"쬪","쪼ᅵᄒ":"쬫","쬬":"쬬","쬬ᄀ":"쬭","쬬ᄁ":"쬮","쬬ᄀᄉ":"쬯","쬬ᄂ":"쬰","쬬ᄂᄌ":"쬱","쬬ᄂᄒ":"쬲","쬬ᄃ":"쬳","쬬ᄅ":"쬴","쬬ᄅᄀ":"쬵","쬬ᄅᄆ":"쬶","쬬ᄅᄇ":"쬷","쬬ᄅᄉ":"쬸","쬬ᄅᄐ":"쬹","쬬ᄅᄑ":"쬺","쬬ᄅᄒ":"쬻","쬬ᄆ":"쬼","쬬ᄇ":"쬽","쬬ᄇᄉ":"쬾","쬬ᄉ":"쬿","쬬ᄊ":"쭀","쬬ᄋ":"쭁","쬬ᄌ":"쭂","쬬ᄎ":"쭃","쬬ᄏ":"쭄","쬬ᄐ":"쭅","쬬ᄑ":"쭆","쬬ᄒ":"쭇","쭈":"쭈","쭈ᄀ":"쭉","쭈ᄁ":"쭊","쭈ᄀᄉ":"쭋","쭈ᄂ":"쭌","쭈ᄂᄌ":"쭍","쭈ᄂᄒ":"쭎","쭈ᄃ":"쭏","쭈ᄅ":"쭐","쭈ᄅᄀ":"쭑","쭈ᄅᄆ":"쭒","쭈ᄅᄇ":"쭓","쭈ᄅᄉ":"쭔","쭈ᄅᄐ":"쭕","쭈ᄅᄑ":"쭖","쭈ᄅᄒ":"쭗","쭈ᄆ":"쭘","쭈ᄇ":"쭙","쭈ᄇᄉ":"쭚","쭈ᄉ":"쭛","쭈ᄊ":"쭜","쭈ᄋ":"쭝","쭈ᄌ":"쭞","쭈ᄎ":"쭟","쭈ᄏ":"쭠","쭈ᄐ":"쭡","쭈ᄑ":"쭢","쭈ᄒ":"쭣","쭈ᅥ":"쭤","쭈ᅥᄀ":"쭥","쭈ᅥᄁ":"쭦","쭈ᅥᄀᄉ":"쭧","쭈ᅥᄂ":"쭨","쭈ᅥᄂᄌ":"쭩","쭈ᅥᄂᄒ":"쭪","쭈ᅥᄃ":"쭫","쭈ᅥᄅ":"쭬","쭈ᅥᄅᄀ":"쭭","쭈ᅥᄅᄆ":"쭮","쭈ᅥᄅᄇ":"쭯","쭈ᅥᄅᄉ":"쭰","쭈ᅥᄅᄐ":"쭱","쭈ᅥᄅᄑ":"쭲","쭈ᅥᄅᄒ":"쭳","쭈ᅥᄆ":"쭴","쭈ᅥᄇ":"쭵","쭈ᅥᄇᄉ":"쭶","쭈ᅥᄉ":"쭷","쭈ᅥᄊ":"쭸","쭈ᅥᄋ":"쭹","쭈ᅥᄌ":"쭺","쭈ᅥᄎ":"쭻","쭈ᅥᄏ":"쭼","쭈ᅥᄐ":"쭽","쭈ᅥᄑ":"쭾","쭈ᅥᄒ":"쭿","쭈ᅦ":"쮀","쭈ᅦᄀ":"쮁","쭈ᅦᄁ":"쮂","쭈ᅦᄀᄉ":"쮃","쭈ᅦᄂ":"쮄","쭈ᅦᄂᄌ":"쮅","쭈ᅦᄂᄒ":"쮆","쭈ᅦᄃ":"쮇","쭈ᅦᄅ":"쮈","쭈ᅦᄅᄀ":"쮉","쭈ᅦᄅᄆ":"쮊","쭈ᅦᄅᄇ":"쮋","쭈ᅦᄅᄉ":"쮌","쭈ᅦᄅᄐ":"쮍","쭈ᅦᄅᄑ":"쮎","쭈ᅦᄅᄒ":"쮏","쭈ᅦᄆ":"쮐","쭈ᅦᄇ":"쮑","쭈ᅦᄇᄉ":"쮒","쭈ᅦᄉ":"쮓","쭈ᅦᄊ":"쮔","쭈ᅦᄋ":"쮕","쭈ᅦᄌ":"쮖","쭈ᅦᄎ":"쮗","쭈ᅦᄏ":"쮘","쭈ᅦᄐ":"쮙","쭈ᅦᄑ":"쮚","쭈ᅦᄒ":"쮛","쭈ᅵ":"쮜","쭈ᅵᄀ":"쮝","쭈ᅵᄁ":"쮞","쭈ᅵᄀᄉ":"쮟","쭈ᅵᄂ":"쮠","쭈ᅵᄂᄌ":"쮡","쭈ᅵᄂᄒ":"쮢","쭈ᅵᄃ":"쮣","쭈ᅵᄅ":"쮤","쭈ᅵᄅᄀ":"쮥","쭈ᅵᄅᄆ":"쮦","쭈ᅵᄅᄇ":"쮧","쭈ᅵᄅᄉ":"쮨","쭈ᅵᄅᄐ":"쮩","쭈ᅵᄅᄑ":"쮪","쭈ᅵᄅᄒ":"쮫","쭈ᅵᄆ":"쮬","쭈ᅵᄇ":"쮭","쭈ᅵᄇᄉ":"쮮","쭈ᅵᄉ":"쮯","쭈ᅵᄊ":"쮰","쭈ᅵᄋ":"쮱","쭈ᅵᄌ":"쮲","쭈ᅵᄎ":"쮳","쭈ᅵᄏ":"쮴","쭈ᅵᄐ":"쮵","쭈ᅵᄑ":"쮶","쭈ᅵᄒ":"쮷","쮸":"쮸","쮸ᄀ":"쮹","쮸ᄁ":"쮺","쮸ᄀᄉ":"쮻","쮸ᄂ":"쮼","쮸ᄂᄌ":"쮽","쮸ᄂᄒ":"쮾","쮸ᄃ":"쮿","쮸ᄅ":"쯀","쮸ᄅᄀ":"쯁","쮸ᄅᄆ":"쯂","쮸ᄅᄇ":"쯃","쮸ᄅᄉ":"쯄","쮸ᄅᄐ":"쯅","쮸ᄅᄑ":"쯆","쮸ᄅᄒ":"쯇","쮸ᄆ":"쯈","쮸ᄇ":"쯉","쮸ᄇᄉ":"쯊","쮸ᄉ":"쯋","쮸ᄊ":"쯌","쮸ᄋ":"쯍","쮸ᄌ":"쯎","쮸ᄎ":"쯏","쮸ᄏ":"쯐","쮸ᄐ":"쯑","쮸ᄑ":"쯒","쮸ᄒ":"쯓","쯔":"쯔","쯔ᄀ":"쯕","쯔ᄁ":"쯖","쯔ᄀᄉ":"쯗","쯔ᄂ":"쯘","쯔ᄂᄌ":"쯙","쯔ᄂᄒ":"쯚","쯔ᄃ":"쯛","쯔ᄅ":"쯜","쯔ᄅᄀ":"쯝","쯔ᄅᄆ":"쯞","쯔ᄅᄇ":"쯟","쯔ᄅᄉ":"쯠","쯔ᄅᄐ":"쯡","쯔ᄅᄑ":"쯢","쯔ᄅᄒ":"쯣","쯔ᄆ":"쯤","쯔ᄇ":"쯥","쯔ᄇᄉ":"쯦","쯔ᄉ":"쯧","쯔ᄊ":"쯨","쯔ᄋ":"쯩","쯔ᄌ":"쯪","쯔ᄎ":"쯫","쯔ᄏ":"쯬","쯔ᄐ":"쯭","쯔ᄑ":"쯮","쯔ᄒ":"쯯","쯔ᅵ":"쯰","쯔ᅵᄀ":"쯱","쯔ᅵᄁ":"쯲","쯔ᅵᄀᄉ":"쯳","쯔ᅵᄂ":"쯴","쯔ᅵᄂᄌ":"쯵","쯔ᅵᄂᄒ":"쯶","쯔ᅵᄃ":"쯷","쯔ᅵᄅ":"쯸","쯔ᅵᄅᄀ":"쯹","쯔ᅵᄅᄆ":"쯺","쯔ᅵᄅᄇ":"쯻","쯔ᅵᄅᄉ":"쯼","쯔ᅵᄅᄐ":"쯽","쯔ᅵᄅᄑ":"쯾","쯔ᅵᄅᄒ":"쯿","쯔ᅵᄆ":"찀","쯔ᅵᄇ":"찁","쯔ᅵᄇᄉ":"찂","쯔ᅵᄉ":"찃","쯔ᅵᄊ":"찄","쯔ᅵᄋ":"찅","쯔ᅵᄌ":"찆","쯔ᅵᄎ":"찇","쯔ᅵᄏ":"찈","쯔ᅵᄐ":"찉","쯔ᅵᄑ":"찊","쯔ᅵᄒ":"찋","찌":"찌","찌ᄀ":"찍","찌ᄁ":"찎","찌ᄀᄉ":"찏","찌ᄂ":"찐","찌ᄂᄌ":"찑","찌ᄂᄒ":"찒","찌ᄃ":"찓","찌ᄅ":"찔","찌ᄅᄀ":"찕","찌ᄅᄆ":"찖","찌ᄅᄇ":"찗","찌ᄅᄉ":"찘","찌ᄅᄐ":"찙","찌ᄅᄑ":"찚","찌ᄅᄒ":"찛","찌ᄆ":"찜","찌ᄇ":"찝","찌ᄇᄉ":"찞","찌ᄉ":"찟","찌ᄊ":"찠","찌ᄋ":"찡","찌ᄌ":"찢","찌ᄎ":"찣","찌ᄏ":"찤","찌ᄐ":"찥","찌ᄑ":"찦","찌ᄒ":"찧","차":"차","차ᄀ":"착","차ᄁ":"찪","차ᄀᄉ":"찫","차ᄂ":"찬","차ᄂᄌ":"찭","차ᄂᄒ":"찮","차ᄃ":"찯","차ᄅ":"찰","차ᄅᄀ":"찱","차ᄅᄆ":"찲","차ᄅᄇ":"찳","차ᄅᄉ":"찴","차ᄅᄐ":"찵","차ᄅᄑ":"찶","차ᄅᄒ":"찷","차ᄆ":"참","차ᄇ":"찹","차ᄇᄉ":"찺","차ᄉ":"찻","차ᄊ":"찼","차ᄋ":"창","차ᄌ":"찾","차ᄎ":"찿","차ᄏ":"챀","차ᄐ":"챁","차ᄑ":"챂","차ᄒ":"챃","채":"채","채ᄀ":"책","채ᄁ":"챆","채ᄀᄉ":"챇","채ᄂ":"챈","채ᄂᄌ":"챉","채ᄂᄒ":"챊","채ᄃ":"챋","채ᄅ":"챌","채ᄅᄀ":"챍","채ᄅᄆ":"챎","채ᄅᄇ":"챏","채ᄅᄉ":"챐","채ᄅᄐ":"챑","채ᄅᄑ":"챒","채ᄅᄒ":"챓","채ᄆ":"챔","채ᄇ":"챕","채ᄇᄉ":"챖","채ᄉ":"챗","채ᄊ":"챘","채ᄋ":"챙","채ᄌ":"챚","채ᄎ":"챛","채ᄏ":"챜","채ᄐ":"챝","채ᄑ":"챞","채ᄒ":"챟","챠":"챠","챠ᄀ":"챡","챠ᄁ":"챢","챠ᄀᄉ":"챣","챠ᄂ":"챤","챠ᄂᄌ":"챥","챠ᄂᄒ":"챦","챠ᄃ":"챧","챠ᄅ":"챨","챠ᄅᄀ":"챩","챠ᄅᄆ":"챪","챠ᄅᄇ":"챫","챠ᄅᄉ":"챬","챠ᄅᄐ":"챭","챠ᄅᄑ":"챮","챠ᄅᄒ":"챯","챠ᄆ":"챰","챠ᄇ":"챱","챠ᄇᄉ":"챲","챠ᄉ":"챳","챠ᄊ":"챴","챠ᄋ":"챵","챠ᄌ":"챶","챠ᄎ":"챷","챠ᄏ":"챸","챠ᄐ":"챹","챠ᄑ":"챺","챠ᄒ":"챻","챼":"챼","챼ᄀ":"챽","챼ᄁ":"챾","챼ᄀᄉ":"챿","챼ᄂ":"첀","챼ᄂᄌ":"첁","챼ᄂᄒ":"첂","챼ᄃ":"첃","챼ᄅ":"첄","챼ᄅᄀ":"첅","챼ᄅᄆ":"첆","챼ᄅᄇ":"첇","챼ᄅᄉ":"첈","챼ᄅᄐ":"첉","챼ᄅᄑ":"첊","챼ᄅᄒ":"첋","챼ᄆ":"첌","챼ᄇ":"첍","챼ᄇᄉ":"첎","챼ᄉ":"첏","챼ᄊ":"첐","챼ᄋ":"첑","챼ᄌ":"첒","챼ᄎ":"첓","챼ᄏ":"첔","챼ᄐ":"첕","챼ᄑ":"첖","챼ᄒ":"첗","처":"처","처ᄀ":"척","처ᄁ":"첚","처ᄀᄉ":"첛","처ᄂ":"천","처ᄂᄌ":"첝","처ᄂᄒ":"첞","처ᄃ":"첟","처ᄅ":"철","처ᄅᄀ":"첡","처ᄅᄆ":"첢","처ᄅᄇ":"첣","처ᄅᄉ":"첤","처ᄅᄐ":"첥","처ᄅᄑ":"첦","처ᄅᄒ":"첧","처ᄆ":"첨","처ᄇ":"첩","처ᄇᄉ":"첪","처ᄉ":"첫","처ᄊ":"첬","처ᄋ":"청","처ᄌ":"첮","처ᄎ":"첯","처ᄏ":"첰","처ᄐ":"첱","처ᄑ":"첲","처ᄒ":"첳","체":"체","체ᄀ":"첵","체ᄁ":"첶","체ᄀᄉ":"첷","체ᄂ":"첸","체ᄂᄌ":"첹","체ᄂᄒ":"첺","체ᄃ":"첻","체ᄅ":"첼","체ᄅᄀ":"첽","체ᄅᄆ":"첾","체ᄅᄇ":"첿","체ᄅᄉ":"쳀","체ᄅᄐ":"쳁","체ᄅᄑ":"쳂","체ᄅᄒ":"쳃","체ᄆ":"쳄","체ᄇ":"쳅","체ᄇᄉ":"쳆","체ᄉ":"쳇","체ᄊ":"쳈","체ᄋ":"쳉","체ᄌ":"쳊","체ᄎ":"쳋","체ᄏ":"쳌","체ᄐ":"쳍","체ᄑ":"쳎","체ᄒ":"쳏","쳐":"쳐","쳐ᄀ":"쳑","쳐ᄁ":"쳒","쳐ᄀᄉ":"쳓","쳐ᄂ":"쳔","쳐ᄂᄌ":"쳕","쳐ᄂᄒ":"쳖","쳐ᄃ":"쳗","쳐ᄅ":"쳘","쳐ᄅᄀ":"쳙","쳐ᄅᄆ":"쳚","쳐ᄅᄇ":"쳛","쳐ᄅᄉ":"쳜","쳐ᄅᄐ":"쳝","쳐ᄅᄑ":"쳞","쳐ᄅᄒ":"쳟","쳐ᄆ":"쳠","쳐ᄇ":"쳡","쳐ᄇᄉ":"쳢","쳐ᄉ":"쳣","쳐ᄊ":"쳤","쳐ᄋ":"쳥","쳐ᄌ":"쳦","쳐ᄎ":"쳧","쳐ᄏ":"쳨","쳐ᄐ":"쳩","쳐ᄑ":"쳪","쳐ᄒ":"쳫","쳬":"쳬","쳬ᄀ":"쳭","쳬ᄁ":"쳮","쳬ᄀᄉ":"쳯","쳬ᄂ":"쳰","쳬ᄂᄌ":"쳱","쳬ᄂᄒ":"쳲","쳬ᄃ":"쳳","쳬ᄅ":"쳴","쳬ᄅᄀ":"쳵","쳬ᄅᄆ":"쳶","쳬ᄅᄇ":"쳷","쳬ᄅᄉ":"쳸","쳬ᄅᄐ":"쳹","쳬ᄅᄑ":"쳺","쳬ᄅᄒ":"쳻","쳬ᄆ":"쳼","쳬ᄇ":"쳽","쳬ᄇᄉ":"쳾","쳬ᄉ":"쳿","쳬ᄊ":"촀","쳬ᄋ":"촁","쳬ᄌ":"촂","쳬ᄎ":"촃","쳬ᄏ":"촄","쳬ᄐ":"촅","쳬ᄑ":"촆","쳬ᄒ":"촇","초":"초","초ᄀ":"촉","초ᄁ":"촊","초ᄀᄉ":"촋","초ᄂ":"촌","초ᄂᄌ":"촍","초ᄂᄒ":"촎","초ᄃ":"촏","초ᄅ":"촐","초ᄅᄀ":"촑","초ᄅᄆ":"촒","초ᄅᄇ":"촓","초ᄅᄉ":"촔","초ᄅᄐ":"촕","초ᄅᄑ":"촖","초ᄅᄒ":"촗","초ᄆ":"촘","초ᄇ":"촙","초ᄇᄉ":"촚","초ᄉ":"촛","초ᄊ":"촜","초ᄋ":"총","초ᄌ":"촞","초ᄎ":"촟","초ᄏ":"촠","초ᄐ":"촡","초ᄑ":"촢","초ᄒ":"촣","초ᅡ":"촤","초ᅡᄀ":"촥","초ᅡᄁ":"촦","초ᅡᄀᄉ":"촧","초ᅡᄂ":"촨","초ᅡᄂᄌ":"촩","초ᅡᄂᄒ":"촪","초ᅡᄃ":"촫","초ᅡᄅ":"촬","초ᅡᄅᄀ":"촭","초ᅡᄅᄆ":"촮","초ᅡᄅᄇ":"촯","초ᅡᄅᄉ":"촰","초ᅡᄅᄐ":"촱","초ᅡᄅᄑ":"촲","초ᅡᄅᄒ":"촳","초ᅡᄆ":"촴","초ᅡᄇ":"촵","초ᅡᄇᄉ":"촶","초ᅡᄉ":"촷","초ᅡᄊ":"촸","초ᅡᄋ":"촹","초ᅡᄌ":"촺","초ᅡᄎ":"촻","초ᅡᄏ":"촼","초ᅡᄐ":"촽","초ᅡᄑ":"촾","초ᅡᄒ":"촿","초ᅢ":"쵀","초ᅢᄀ":"쵁","초ᅢᄁ":"쵂","초ᅢᄀᄉ":"쵃","초ᅢᄂ":"쵄","초ᅢᄂᄌ":"쵅","초ᅢᄂᄒ":"쵆","초ᅢᄃ":"쵇","초ᅢᄅ":"쵈","초ᅢᄅᄀ":"쵉","초ᅢᄅᄆ":"쵊","초ᅢᄅᄇ":"쵋","초ᅢᄅᄉ":"쵌","초ᅢᄅᄐ":"쵍","초ᅢᄅᄑ":"쵎","초ᅢᄅᄒ":"쵏","초ᅢᄆ":"쵐","초ᅢᄇ":"쵑","초ᅢᄇᄉ":"쵒","초ᅢᄉ":"쵓","초ᅢᄊ":"쵔","초ᅢᄋ":"쵕","초ᅢᄌ":"쵖","초ᅢᄎ":"쵗","초ᅢᄏ":"쵘","초ᅢᄐ":"쵙","초ᅢᄑ":"쵚","초ᅢᄒ":"쵛","초ᅵ":"최","초ᅵᄀ":"쵝","초ᅵᄁ":"쵞","초ᅵᄀᄉ":"쵟","초ᅵᄂ":"쵠","초ᅵᄂᄌ":"쵡","초ᅵᄂᄒ":"쵢","초ᅵᄃ":"쵣","초ᅵᄅ":"쵤","초ᅵᄅᄀ":"쵥","초ᅵᄅᄆ":"쵦","초ᅵᄅᄇ":"쵧","초ᅵᄅᄉ":"쵨","초ᅵᄅᄐ":"쵩","초ᅵᄅᄑ":"쵪","초ᅵᄅᄒ":"쵫","초ᅵᄆ":"쵬","초ᅵᄇ":"쵭","초ᅵᄇᄉ":"쵮","초ᅵᄉ":"쵯","초ᅵᄊ":"쵰","초ᅵᄋ":"쵱","초ᅵᄌ":"쵲","초ᅵᄎ":"쵳","초ᅵᄏ":"쵴","초ᅵᄐ":"쵵","초ᅵᄑ":"쵶","초ᅵᄒ":"쵷","쵸":"쵸","쵸ᄀ":"쵹","쵸ᄁ":"쵺","쵸ᄀᄉ":"쵻","쵸ᄂ":"쵼","쵸ᄂᄌ":"쵽","쵸ᄂᄒ":"쵾","쵸ᄃ":"쵿","쵸ᄅ":"춀","쵸ᄅᄀ":"춁","쵸ᄅᄆ":"춂","쵸ᄅᄇ":"춃","쵸ᄅᄉ":"춄","쵸ᄅᄐ":"춅","쵸ᄅᄑ":"춆","쵸ᄅᄒ":"춇","쵸ᄆ":"춈","쵸ᄇ":"춉","쵸ᄇᄉ":"춊","쵸ᄉ":"춋","쵸ᄊ":"춌","쵸ᄋ":"춍","쵸ᄌ":"춎","쵸ᄎ":"춏","쵸ᄏ":"춐","쵸ᄐ":"춑","쵸ᄑ":"춒","쵸ᄒ":"춓","추":"추","추ᄀ":"축","추ᄁ":"춖","추ᄀᄉ":"춗","추ᄂ":"춘","추ᄂᄌ":"춙","추ᄂᄒ":"춚","추ᄃ":"춛","추ᄅ":"출","추ᄅᄀ":"춝","추ᄅᄆ":"춞","추ᄅᄇ":"춟","추ᄅᄉ":"춠","추ᄅᄐ":"춡","추ᄅᄑ":"춢","추ᄅᄒ":"춣","추ᄆ":"춤","추ᄇ":"춥","추ᄇᄉ":"춦","추ᄉ":"춧","추ᄊ":"춨","추ᄋ":"충","추ᄌ":"춪","추ᄎ":"춫","추ᄏ":"춬","추ᄐ":"춭","추ᄑ":"춮","추ᄒ":"춯","추ᅥ":"춰","추ᅥᄀ":"춱","추ᅥᄁ":"춲","추ᅥᄀᄉ":"춳","추ᅥᄂ":"춴","추ᅥᄂᄌ":"춵","추ᅥᄂᄒ":"춶","추ᅥᄃ":"춷","추ᅥᄅ":"춸","추ᅥᄅᄀ":"춹","추ᅥᄅᄆ":"춺","추ᅥᄅᄇ":"춻","추ᅥᄅᄉ":"춼","추ᅥᄅᄐ":"춽","추ᅥᄅᄑ":"춾","추ᅥᄅᄒ":"춿","추ᅥᄆ":"췀","추ᅥᄇ":"췁","추ᅥᄇᄉ":"췂","추ᅥᄉ":"췃","추ᅥᄊ":"췄","추ᅥᄋ":"췅","추ᅥᄌ":"췆","추ᅥᄎ":"췇","추ᅥᄏ":"췈","추ᅥᄐ":"췉","추ᅥᄑ":"췊","추ᅥᄒ":"췋","추ᅦ":"췌","추ᅦᄀ":"췍","추ᅦᄁ":"췎","추ᅦᄀᄉ":"췏","추ᅦᄂ":"췐","추ᅦᄂᄌ":"췑","추ᅦᄂᄒ":"췒","추ᅦᄃ":"췓","추ᅦᄅ":"췔","추ᅦᄅᄀ":"췕","추ᅦᄅᄆ":"췖","추ᅦᄅᄇ":"췗","추ᅦᄅᄉ":"췘","추ᅦᄅᄐ":"췙","추ᅦᄅᄑ":"췚","추ᅦᄅᄒ":"췛","추ᅦᄆ":"췜","추ᅦᄇ":"췝","추ᅦᄇᄉ":"췞","추ᅦᄉ":"췟","추ᅦᄊ":"췠","추ᅦᄋ":"췡","추ᅦᄌ":"췢","추ᅦᄎ":"췣","추ᅦᄏ":"췤","추ᅦᄐ":"췥","추ᅦᄑ":"췦","추ᅦᄒ":"췧","추ᅵ":"취","추ᅵᄀ":"췩","추ᅵᄁ":"췪","추ᅵᄀᄉ":"췫","추ᅵᄂ":"췬","추ᅵᄂᄌ":"췭","추ᅵᄂᄒ":"췮","추ᅵᄃ":"췯","추ᅵᄅ":"췰","추ᅵᄅᄀ":"췱","추ᅵᄅᄆ":"췲","추ᅵᄅᄇ":"췳","추ᅵᄅᄉ":"췴","추ᅵᄅᄐ":"췵","추ᅵᄅᄑ":"췶","추ᅵᄅᄒ":"췷","추ᅵᄆ":"췸","추ᅵᄇ":"췹","추ᅵᄇᄉ":"췺","추ᅵᄉ":"췻","추ᅵᄊ":"췼","추ᅵᄋ":"췽","추ᅵᄌ":"췾","추ᅵᄎ":"췿","추ᅵᄏ":"츀","추ᅵᄐ":"츁","추ᅵᄑ":"츂","추ᅵᄒ":"츃","츄":"츄","츄ᄀ":"츅","츄ᄁ":"츆","츄ᄀᄉ":"츇","츄ᄂ":"츈","츄ᄂᄌ":"츉","츄ᄂᄒ":"츊","츄ᄃ":"츋","츄ᄅ":"츌","츄ᄅᄀ":"츍","츄ᄅᄆ":"츎","츄ᄅᄇ":"츏","츄ᄅᄉ":"츐","츄ᄅᄐ":"츑","츄ᄅᄑ":"츒","츄ᄅᄒ":"츓","츄ᄆ":"츔","츄ᄇ":"츕","츄ᄇᄉ":"츖","츄ᄉ":"츗","츄ᄊ":"츘","츄ᄋ":"츙","츄ᄌ":"츚","츄ᄎ":"츛","츄ᄏ":"츜","츄ᄐ":"츝","츄ᄑ":"츞","츄ᄒ":"츟","츠":"츠","츠ᄀ":"측","츠ᄁ":"츢","츠ᄀᄉ":"츣","츠ᄂ":"츤","츠ᄂᄌ":"츥","츠ᄂᄒ":"츦","츠ᄃ":"츧","츠ᄅ":"츨","츠ᄅᄀ":"츩","츠ᄅᄆ":"츪","츠ᄅᄇ":"츫","츠ᄅᄉ":"츬","츠ᄅᄐ":"츭","츠ᄅᄑ":"츮","츠ᄅᄒ":"츯","츠ᄆ":"츰","츠ᄇ":"츱","츠ᄇᄉ":"츲","츠ᄉ":"츳","츠ᄊ":"츴","츠ᄋ":"층","츠ᄌ":"츶","츠ᄎ":"츷","츠ᄏ":"츸","츠ᄐ":"츹","츠ᄑ":"츺","츠ᄒ":"츻","츠ᅵ":"츼","츠ᅵᄀ":"츽","츠ᅵᄁ":"츾","츠ᅵᄀᄉ":"츿","츠ᅵᄂ":"칀","츠ᅵᄂᄌ":"칁","츠ᅵᄂᄒ":"칂","츠ᅵᄃ":"칃","츠ᅵᄅ":"칄","츠ᅵᄅᄀ":"칅","츠ᅵᄅᄆ":"칆","츠ᅵᄅᄇ":"칇","츠ᅵᄅᄉ":"칈","츠ᅵᄅᄐ":"칉","츠ᅵᄅᄑ":"칊","츠ᅵᄅᄒ":"칋","츠ᅵᄆ":"칌","츠ᅵᄇ":"칍","츠ᅵᄇᄉ":"칎","츠ᅵᄉ":"칏","츠ᅵᄊ":"칐","츠ᅵᄋ":"칑","츠ᅵᄌ":"칒","츠ᅵᄎ":"칓","츠ᅵᄏ":"칔","츠ᅵᄐ":"칕","츠ᅵᄑ":"칖","츠ᅵᄒ":"칗","치":"치","치ᄀ":"칙","치ᄁ":"칚","치ᄀᄉ":"칛","치ᄂ":"친","치ᄂᄌ":"칝","치ᄂᄒ":"칞","치ᄃ":"칟","치ᄅ":"칠","치ᄅᄀ":"칡","치ᄅᄆ":"칢","치ᄅᄇ":"칣","치ᄅᄉ":"칤","치ᄅᄐ":"칥","치ᄅᄑ":"칦","치ᄅᄒ":"칧","치ᄆ":"침","치ᄇ":"칩","치ᄇᄉ":"칪","치ᄉ":"칫","치ᄊ":"칬","치ᄋ":"칭","치ᄌ":"칮","치ᄎ":"칯","치ᄏ":"칰","치ᄐ":"칱","치ᄑ":"칲","치ᄒ":"칳","카":"카","카ᄀ":"칵","카ᄁ":"칶","카ᄀᄉ":"칷","카ᄂ":"칸","카ᄂᄌ":"칹","카ᄂᄒ":"칺","카ᄃ":"칻","카ᄅ":"칼","카ᄅᄀ":"칽","카ᄅᄆ":"칾","카ᄅᄇ":"칿","카ᄅᄉ":"캀","카ᄅᄐ":"캁","카ᄅᄑ":"캂","카ᄅᄒ":"캃","카ᄆ":"캄","카ᄇ":"캅","카ᄇᄉ":"캆","카ᄉ":"캇","카ᄊ":"캈","카ᄋ":"캉","카ᄌ":"캊","카ᄎ":"캋","카ᄏ":"캌","카ᄐ":"캍","카ᄑ":"캎","카ᄒ":"캏","캐":"캐","캐ᄀ":"캑","캐ᄁ":"캒","캐ᄀᄉ":"캓","캐ᄂ":"캔","캐ᄂᄌ":"캕","캐ᄂᄒ":"캖","캐ᄃ":"캗","캐ᄅ":"캘","캐ᄅᄀ":"캙","캐ᄅᄆ":"캚","캐ᄅᄇ":"캛","캐ᄅᄉ":"캜","캐ᄅᄐ":"캝","캐ᄅᄑ":"캞","캐ᄅᄒ":"캟","캐ᄆ":"캠","캐ᄇ":"캡","캐ᄇᄉ":"캢","캐ᄉ":"캣","캐ᄊ":"캤","캐ᄋ":"캥","캐ᄌ":"캦","캐ᄎ":"캧","캐ᄏ":"캨","캐ᄐ":"캩","캐ᄑ":"캪","캐ᄒ":"캫","캬":"캬","캬ᄀ":"캭","캬ᄁ":"캮","캬ᄀᄉ":"캯","캬ᄂ":"캰","캬ᄂᄌ":"캱","캬ᄂᄒ":"캲","캬ᄃ":"캳","캬ᄅ":"캴","캬ᄅᄀ":"캵","캬ᄅᄆ":"캶","캬ᄅᄇ":"캷","캬ᄅᄉ":"캸","캬ᄅᄐ":"캹","캬ᄅᄑ":"캺","캬ᄅᄒ":"캻","캬ᄆ":"캼","캬ᄇ":"캽","캬ᄇᄉ":"캾","캬ᄉ":"캿","캬ᄊ":"컀","캬ᄋ":"컁","캬ᄌ":"컂","캬ᄎ":"컃","캬ᄏ":"컄","캬ᄐ":"컅","캬ᄑ":"컆","캬ᄒ":"컇","컈":"컈","컈ᄀ":"컉","컈ᄁ":"컊","컈ᄀᄉ":"컋","컈ᄂ":"컌","컈ᄂᄌ":"컍","컈ᄂᄒ":"컎","컈ᄃ":"컏","컈ᄅ":"컐","컈ᄅᄀ":"컑","컈ᄅᄆ":"컒","컈ᄅᄇ":"컓","컈ᄅᄉ":"컔","컈ᄅᄐ":"컕","컈ᄅᄑ":"컖","컈ᄅᄒ":"컗","컈ᄆ":"컘","컈ᄇ":"컙","컈ᄇᄉ":"컚","컈ᄉ":"컛","컈ᄊ":"컜","컈ᄋ":"컝","컈ᄌ":"컞","컈ᄎ":"컟","컈ᄏ":"컠","컈ᄐ":"컡","컈ᄑ":"컢","컈ᄒ":"컣","커":"커","커ᄀ":"컥","커ᄁ":"컦","커ᄀᄉ":"컧","커ᄂ":"컨","커ᄂᄌ":"컩","커ᄂᄒ":"컪","커ᄃ":"컫","커ᄅ":"컬","커ᄅᄀ":"컭","커ᄅᄆ":"컮","커ᄅᄇ":"컯","커ᄅᄉ":"컰","커ᄅᄐ":"컱","커ᄅᄑ":"컲","커ᄅᄒ":"컳","커ᄆ":"컴","커ᄇ":"컵","커ᄇᄉ":"컶","커ᄉ":"컷","커ᄊ":"컸","커ᄋ":"컹","커ᄌ":"컺","커ᄎ":"컻","커ᄏ":"컼","커ᄐ":"컽","커ᄑ":"컾","커ᄒ":"컿","케":"케","케ᄀ":"켁","케ᄁ":"켂","케ᄀᄉ":"켃","케ᄂ":"켄","케ᄂᄌ":"켅","케ᄂᄒ":"켆","케ᄃ":"켇","케ᄅ":"켈","케ᄅᄀ":"켉","케ᄅᄆ":"켊","케ᄅᄇ":"켋","케ᄅᄉ":"켌","케ᄅᄐ":"켍","케ᄅᄑ":"켎","케ᄅᄒ":"켏","케ᄆ":"켐","케ᄇ":"켑","케ᄇᄉ":"켒","케ᄉ":"켓","케ᄊ":"켔","케ᄋ":"켕","케ᄌ":"켖","케ᄎ":"켗","케ᄏ":"켘","케ᄐ":"켙","케ᄑ":"켚","케ᄒ":"켛","켜":"켜","켜ᄀ":"켝","켜ᄁ":"켞","켜ᄀᄉ":"켟","켜ᄂ":"켠","켜ᄂᄌ":"켡","켜ᄂᄒ":"켢","켜ᄃ":"켣","켜ᄅ":"켤","켜ᄅᄀ":"켥","켜ᄅᄆ":"켦","켜ᄅᄇ":"켧","켜ᄅᄉ":"켨","켜ᄅᄐ":"켩","켜ᄅᄑ":"켪","켜ᄅᄒ":"켫","켜ᄆ":"켬","켜ᄇ":"켭","켜ᄇᄉ":"켮","켜ᄉ":"켯","켜ᄊ":"켰","켜ᄋ":"켱","켜ᄌ":"켲","켜ᄎ":"켳","켜ᄏ":"켴","켜ᄐ":"켵","켜ᄑ":"켶","켜ᄒ":"켷","켸":"켸","켸ᄀ":"켹","켸ᄁ":"켺","켸ᄀᄉ":"켻","켸ᄂ":"켼","켸ᄂᄌ":"켽","켸ᄂᄒ":"켾","켸ᄃ":"켿","켸ᄅ":"콀","켸ᄅᄀ":"콁","켸ᄅᄆ":"콂","켸ᄅᄇ":"콃","켸ᄅᄉ":"콄","켸ᄅᄐ":"콅","켸ᄅᄑ":"콆","켸ᄅᄒ":"콇","켸ᄆ":"콈","켸ᄇ":"콉","켸ᄇᄉ":"콊","켸ᄉ":"콋","켸ᄊ":"콌","켸ᄋ":"콍","켸ᄌ":"콎","켸ᄎ":"콏","켸ᄏ":"콐","켸ᄐ":"콑","켸ᄑ":"콒","켸ᄒ":"콓","코":"코","코ᄀ":"콕","코ᄁ":"콖","코ᄀᄉ":"콗","코ᄂ":"콘","코ᄂᄌ":"콙","코ᄂᄒ":"콚","코ᄃ":"콛","코ᄅ":"콜","코ᄅᄀ":"콝","코ᄅᄆ":"콞","코ᄅᄇ":"콟","코ᄅᄉ":"콠","코ᄅᄐ":"콡","코ᄅᄑ":"콢","코ᄅᄒ":"콣","코ᄆ":"콤","코ᄇ":"콥","코ᄇᄉ":"콦","코ᄉ":"콧","코ᄊ":"콨","코ᄋ":"콩","코ᄌ":"콪","코ᄎ":"콫","코ᄏ":"콬","코ᄐ":"콭","코ᄑ":"콮","코ᄒ":"콯","코ᅡ":"콰","코ᅡᄀ":"콱","코ᅡᄁ":"콲","코ᅡᄀᄉ":"콳","코ᅡᄂ":"콴","코ᅡᄂᄌ":"콵","코ᅡᄂᄒ":"콶","코ᅡᄃ":"콷","코ᅡᄅ":"콸","코ᅡᄅᄀ":"콹","코ᅡᄅᄆ":"콺","코ᅡᄅᄇ":"콻","코ᅡᄅᄉ":"콼","코ᅡᄅᄐ":"콽","코ᅡᄅᄑ":"콾","코ᅡᄅᄒ":"콿","코ᅡᄆ":"쾀","코ᅡᄇ":"쾁","코ᅡᄇᄉ":"쾂","코ᅡᄉ":"쾃","코ᅡᄊ":"쾄","코ᅡᄋ":"쾅","코ᅡᄌ":"쾆","코ᅡᄎ":"쾇","코ᅡᄏ":"쾈","코ᅡᄐ":"쾉","코ᅡᄑ":"쾊","코ᅡᄒ":"쾋","코ᅢ":"쾌","코ᅢᄀ":"쾍","코ᅢᄁ":"쾎","코ᅢᄀᄉ":"쾏","코ᅢᄂ":"쾐","코ᅢᄂᄌ":"쾑","코ᅢᄂᄒ":"쾒","코ᅢᄃ":"쾓","코ᅢᄅ":"쾔","코ᅢᄅᄀ":"쾕","코ᅢᄅᄆ":"쾖","코ᅢᄅᄇ":"쾗","코ᅢᄅᄉ":"쾘","코ᅢᄅᄐ":"쾙","코ᅢᄅᄑ":"쾚","코ᅢᄅᄒ":"쾛","코ᅢᄆ":"쾜","코ᅢᄇ":"쾝","코ᅢᄇᄉ":"쾞","코ᅢᄉ":"쾟","코ᅢᄊ":"쾠","코ᅢᄋ":"쾡","코ᅢᄌ":"쾢","코ᅢᄎ":"쾣","코ᅢᄏ":"쾤","코ᅢᄐ":"쾥","코ᅢᄑ":"쾦","코ᅢᄒ":"쾧","코ᅵ":"쾨","코ᅵᄀ":"쾩","코ᅵᄁ":"쾪","코ᅵᄀᄉ":"쾫","코ᅵᄂ":"쾬","코ᅵᄂᄌ":"쾭","코ᅵᄂᄒ":"쾮","코ᅵᄃ":"쾯","코ᅵᄅ":"쾰","코ᅵᄅᄀ":"쾱","코ᅵᄅᄆ":"쾲","코ᅵᄅᄇ":"쾳","코ᅵᄅᄉ":"쾴","코ᅵᄅᄐ":"쾵","코ᅵᄅᄑ":"쾶","코ᅵᄅᄒ":"쾷","코ᅵᄆ":"쾸","코ᅵᄇ":"쾹","코ᅵᄇᄉ":"쾺","코ᅵᄉ":"쾻","코ᅵᄊ":"쾼","코ᅵᄋ":"쾽","코ᅵᄌ":"쾾","코ᅵᄎ":"쾿","코ᅵᄏ":"쿀","코ᅵᄐ":"쿁","코ᅵᄑ":"쿂","코ᅵᄒ":"쿃","쿄":"쿄","쿄ᄀ":"쿅","쿄ᄁ":"쿆","쿄ᄀᄉ":"쿇","쿄ᄂ":"쿈","쿄ᄂᄌ":"쿉","쿄ᄂᄒ":"쿊","쿄ᄃ":"쿋","쿄ᄅ":"쿌","쿄ᄅᄀ":"쿍","쿄ᄅᄆ":"쿎","쿄ᄅᄇ":"쿏","쿄ᄅᄉ":"쿐","쿄ᄅᄐ":"쿑","쿄ᄅᄑ":"쿒","쿄ᄅᄒ":"쿓","쿄ᄆ":"쿔","쿄ᄇ":"쿕","쿄ᄇᄉ":"쿖","쿄ᄉ":"쿗","쿄ᄊ":"쿘","쿄ᄋ":"쿙","쿄ᄌ":"쿚","쿄ᄎ":"쿛","쿄ᄏ":"쿜","쿄ᄐ":"쿝","쿄ᄑ":"쿞","쿄ᄒ":"쿟","쿠":"쿠","쿠ᄀ":"쿡","쿠ᄁ":"쿢","쿠ᄀᄉ":"쿣","쿠ᄂ":"쿤","쿠ᄂᄌ":"쿥","쿠ᄂᄒ":"쿦","쿠ᄃ":"쿧","쿠ᄅ":"쿨","쿠ᄅᄀ":"쿩","쿠ᄅᄆ":"쿪","쿠ᄅᄇ":"쿫","쿠ᄅᄉ":"쿬","쿠ᄅᄐ":"쿭","쿠ᄅᄑ":"쿮","쿠ᄅᄒ":"쿯","쿠ᄆ":"쿰","쿠ᄇ":"쿱","쿠ᄇᄉ":"쿲","쿠ᄉ":"쿳","쿠ᄊ":"쿴","쿠ᄋ":"쿵","쿠ᄌ":"쿶","쿠ᄎ":"쿷","쿠ᄏ":"쿸","쿠ᄐ":"쿹","쿠ᄑ":"쿺","쿠ᄒ":"쿻","쿠ᅥ":"쿼","쿠ᅥᄀ":"쿽","쿠ᅥᄁ":"쿾","쿠ᅥᄀᄉ":"쿿","쿠ᅥᄂ":"퀀","쿠ᅥᄂᄌ":"퀁","쿠ᅥᄂᄒ":"퀂","쿠ᅥᄃ":"퀃","쿠ᅥᄅ":"퀄","쿠ᅥᄅᄀ":"퀅","쿠ᅥᄅᄆ":"퀆","쿠ᅥᄅᄇ":"퀇","쿠ᅥᄅᄉ":"퀈","쿠ᅥᄅᄐ":"퀉","쿠ᅥᄅᄑ":"퀊","쿠ᅥᄅᄒ":"퀋","쿠ᅥᄆ":"퀌","쿠ᅥᄇ":"퀍","쿠ᅥᄇᄉ":"퀎","쿠ᅥᄉ":"퀏","쿠ᅥᄊ":"퀐","쿠ᅥᄋ":"퀑","쿠ᅥᄌ":"퀒","쿠ᅥᄎ":"퀓","쿠ᅥᄏ":"퀔","쿠ᅥᄐ":"퀕","쿠ᅥᄑ":"퀖","쿠ᅥᄒ":"퀗","쿠ᅦ":"퀘","쿠ᅦᄀ":"퀙","쿠ᅦᄁ":"퀚","쿠ᅦᄀᄉ":"퀛","쿠ᅦᄂ":"퀜","쿠ᅦᄂᄌ":"퀝","쿠ᅦᄂᄒ":"퀞","쿠ᅦᄃ":"퀟","쿠ᅦᄅ":"퀠","쿠ᅦᄅᄀ":"퀡","쿠ᅦᄅᄆ":"퀢","쿠ᅦᄅᄇ":"퀣","쿠ᅦᄅᄉ":"퀤","쿠ᅦᄅᄐ":"퀥","쿠ᅦᄅᄑ":"퀦","쿠ᅦᄅᄒ":"퀧","쿠ᅦᄆ":"퀨","쿠ᅦᄇ":"퀩","쿠ᅦᄇᄉ":"퀪","쿠ᅦᄉ":"퀫","쿠ᅦᄊ":"퀬","쿠ᅦᄋ":"퀭","쿠ᅦᄌ":"퀮","쿠ᅦᄎ":"퀯","쿠ᅦᄏ":"퀰","쿠ᅦᄐ":"퀱","쿠ᅦᄑ":"퀲","쿠ᅦᄒ":"퀳","쿠ᅵ":"퀴","쿠ᅵᄀ":"퀵","쿠ᅵᄁ":"퀶","쿠ᅵᄀᄉ":"퀷","쿠ᅵᄂ":"퀸","쿠ᅵᄂᄌ":"퀹","쿠ᅵᄂᄒ":"퀺","쿠ᅵᄃ":"퀻","쿠ᅵᄅ":"퀼","쿠ᅵᄅᄀ":"퀽","쿠ᅵᄅᄆ":"퀾","쿠ᅵᄅᄇ":"퀿","쿠ᅵᄅᄉ":"큀","쿠ᅵᄅᄐ":"큁","쿠ᅵᄅᄑ":"큂","쿠ᅵᄅᄒ":"큃","쿠ᅵᄆ":"큄","쿠ᅵᄇ":"큅","쿠ᅵᄇᄉ":"큆","쿠ᅵᄉ":"큇","쿠ᅵᄊ":"큈","쿠ᅵᄋ":"큉","쿠ᅵᄌ":"큊","쿠ᅵᄎ":"큋","쿠ᅵᄏ":"큌","쿠ᅵᄐ":"큍","쿠ᅵᄑ":"큎","쿠ᅵᄒ":"큏","큐":"큐","큐ᄀ":"큑","큐ᄁ":"큒","큐ᄀᄉ":"큓","큐ᄂ":"큔","큐ᄂᄌ":"큕","큐ᄂᄒ":"큖","큐ᄃ":"큗","큐ᄅ":"큘","큐ᄅᄀ":"큙","큐ᄅᄆ":"큚","큐ᄅᄇ":"큛","큐ᄅᄉ":"큜","큐ᄅᄐ":"큝","큐ᄅᄑ":"큞","큐ᄅᄒ":"큟","큐ᄆ":"큠","큐ᄇ":"큡","큐ᄇᄉ":"큢","큐ᄉ":"큣","큐ᄊ":"큤","큐ᄋ":"큥","큐ᄌ":"큦","큐ᄎ":"큧","큐ᄏ":"큨","큐ᄐ":"큩","큐ᄑ":"큪","큐ᄒ":"큫","크":"크","크ᄀ":"큭","크ᄁ":"큮","크ᄀᄉ":"큯","크ᄂ":"큰","크ᄂᄌ":"큱","크ᄂᄒ":"큲","크ᄃ":"큳","크ᄅ":"클","크ᄅᄀ":"큵","크ᄅᄆ":"큶","크ᄅᄇ":"큷","크ᄅᄉ":"큸","크ᄅᄐ":"큹","크ᄅᄑ":"큺","크ᄅᄒ":"큻","크ᄆ":"큼","크ᄇ":"큽","크ᄇᄉ":"큾","크ᄉ":"큿","크ᄊ":"킀","크ᄋ":"킁","크ᄌ":"킂","크ᄎ":"킃","크ᄏ":"킄","크ᄐ":"킅","크ᄑ":"킆","크ᄒ":"킇","크ᅵ":"킈","크ᅵᄀ":"킉","크ᅵᄁ":"킊","크ᅵᄀᄉ":"킋","크ᅵᄂ":"킌","크ᅵᄂᄌ":"킍","크ᅵᄂᄒ":"킎","크ᅵᄃ":"킏","크ᅵᄅ":"킐","크ᅵᄅᄀ":"킑","크ᅵᄅᄆ":"킒","크ᅵᄅᄇ":"킓","크ᅵᄅᄉ":"킔","크ᅵᄅᄐ":"킕","크ᅵᄅᄑ":"킖","크ᅵᄅᄒ":"킗","크ᅵᄆ":"킘","크ᅵᄇ":"킙","크ᅵᄇᄉ":"킚","크ᅵᄉ":"킛","크ᅵᄊ":"킜","크ᅵᄋ":"킝","크ᅵᄌ":"킞","크ᅵᄎ":"킟","크ᅵᄏ":"킠","크ᅵᄐ":"킡","크ᅵᄑ":"킢","크ᅵᄒ":"킣","키":"키","키ᄀ":"킥","키ᄁ":"킦","키ᄀᄉ":"킧","키ᄂ":"킨","키ᄂᄌ":"킩","키ᄂᄒ":"킪","키ᄃ":"킫","키ᄅ":"킬","키ᄅᄀ":"킭","키ᄅᄆ":"킮","키ᄅᄇ":"킯","키ᄅᄉ":"킰","키ᄅᄐ":"킱","키ᄅᄑ":"킲","키ᄅᄒ":"킳","키ᄆ":"킴","키ᄇ":"킵","키ᄇᄉ":"킶","키ᄉ":"킷","키ᄊ":"킸","키ᄋ":"킹","키ᄌ":"킺","키ᄎ":"킻","키ᄏ":"킼","키ᄐ":"킽","키ᄑ":"킾","키ᄒ":"킿","타":"타","타ᄀ":"탁","타ᄁ":"탂","타ᄀᄉ":"탃","타ᄂ":"탄","타ᄂᄌ":"탅","타ᄂᄒ":"탆","타ᄃ":"탇","타ᄅ":"탈","타ᄅᄀ":"탉","타ᄅᄆ":"탊","타ᄅᄇ":"탋","타ᄅᄉ":"탌","타ᄅᄐ":"탍","타ᄅᄑ":"탎","타ᄅᄒ":"탏","타ᄆ":"탐","타ᄇ":"탑","타ᄇᄉ":"탒","타ᄉ":"탓","타ᄊ":"탔","타ᄋ":"탕","타ᄌ":"탖","타ᄎ":"탗","타ᄏ":"탘","타ᄐ":"탙","타ᄑ":"탚","타ᄒ":"탛","태":"태","태ᄀ":"택","태ᄁ":"탞","태ᄀᄉ":"탟","태ᄂ":"탠","태ᄂᄌ":"탡","태ᄂᄒ":"탢","태ᄃ":"탣","태ᄅ":"탤","태ᄅᄀ":"탥","태ᄅᄆ":"탦","태ᄅᄇ":"탧","태ᄅᄉ":"탨","태ᄅᄐ":"탩","태ᄅᄑ":"탪","태ᄅᄒ":"탫","태ᄆ":"탬","태ᄇ":"탭","태ᄇᄉ":"탮","태ᄉ":"탯","태ᄊ":"탰","태ᄋ":"탱","태ᄌ":"탲","태ᄎ":"탳","태ᄏ":"탴","태ᄐ":"탵","태ᄑ":"탶","태ᄒ":"탷","탸":"탸","탸ᄀ":"탹","탸ᄁ":"탺","탸ᄀᄉ":"탻","탸ᄂ":"탼","탸ᄂᄌ":"탽","탸ᄂᄒ":"탾","탸ᄃ":"탿","탸ᄅ":"턀","탸ᄅᄀ":"턁","탸ᄅᄆ":"턂","탸ᄅᄇ":"턃","탸ᄅᄉ":"턄","탸ᄅᄐ":"턅","탸ᄅᄑ":"턆","탸ᄅᄒ":"턇","탸ᄆ":"턈","탸ᄇ":"턉","탸ᄇᄉ":"턊","탸ᄉ":"턋","탸ᄊ":"턌","탸ᄋ":"턍","탸ᄌ":"턎","탸ᄎ":"턏","탸ᄏ":"턐","탸ᄐ":"턑","탸ᄑ":"턒","탸ᄒ":"턓","턔":"턔","턔ᄀ":"턕","턔ᄁ":"턖","턔ᄀᄉ":"턗","턔ᄂ":"턘","턔ᄂᄌ":"턙","턔ᄂᄒ":"턚","턔ᄃ":"턛","턔ᄅ":"턜","턔ᄅᄀ":"턝","턔ᄅᄆ":"턞","턔ᄅᄇ":"턟","턔ᄅᄉ":"턠","턔ᄅᄐ":"턡","턔ᄅᄑ":"턢","턔ᄅᄒ":"턣","턔ᄆ":"턤","턔ᄇ":"턥","턔ᄇᄉ":"턦","턔ᄉ":"턧","턔ᄊ":"턨","턔ᄋ":"턩","턔ᄌ":"턪","턔ᄎ":"턫","턔ᄏ":"턬","턔ᄐ":"턭","턔ᄑ":"턮","턔ᄒ":"턯","터":"터","터ᄀ":"턱","터ᄁ":"턲","터ᄀᄉ":"턳","터ᄂ":"턴","터ᄂᄌ":"턵","터ᄂᄒ":"턶","터ᄃ":"턷","터ᄅ":"털","터ᄅᄀ":"턹","터ᄅᄆ":"턺","터ᄅᄇ":"턻","터ᄅᄉ":"턼","터ᄅᄐ":"턽","터ᄅᄑ":"턾","터ᄅᄒ":"턿","터ᄆ":"텀","터ᄇ":"텁","터ᄇᄉ":"텂","터ᄉ":"텃","터ᄊ":"텄","터ᄋ":"텅","터ᄌ":"텆","터ᄎ":"텇","터ᄏ":"텈","터ᄐ":"텉","터ᄑ":"텊","터ᄒ":"텋","테":"테","테ᄀ":"텍","테ᄁ":"텎","테ᄀᄉ":"텏","테ᄂ":"텐","테ᄂᄌ":"텑","테ᄂᄒ":"텒","테ᄃ":"텓","테ᄅ":"텔","테ᄅᄀ":"텕","테ᄅᄆ":"텖","테ᄅᄇ":"텗","테ᄅᄉ":"텘","테ᄅᄐ":"텙","테ᄅᄑ":"텚","테ᄅᄒ":"텛","테ᄆ":"템","테ᄇ":"텝","테ᄇᄉ":"텞","테ᄉ":"텟","테ᄊ":"텠","테ᄋ":"텡","테ᄌ":"텢","테ᄎ":"텣","테ᄏ":"텤","테ᄐ":"텥","테ᄑ":"텦","테ᄒ":"텧","텨":"텨","텨ᄀ":"텩","텨ᄁ":"텪","텨ᄀᄉ":"텫","텨ᄂ":"텬","텨ᄂᄌ":"텭","텨ᄂᄒ":"텮","텨ᄃ":"텯","텨ᄅ":"텰","텨ᄅᄀ":"텱","텨ᄅᄆ":"텲","텨ᄅᄇ":"텳","텨ᄅᄉ":"텴","텨ᄅᄐ":"텵","텨ᄅᄑ":"텶","텨ᄅᄒ":"텷","텨ᄆ":"텸","텨ᄇ":"텹","텨ᄇᄉ":"텺","텨ᄉ":"텻","텨ᄊ":"텼","텨ᄋ":"텽","텨ᄌ":"텾","텨ᄎ":"텿","텨ᄏ":"톀","텨ᄐ":"톁","텨ᄑ":"톂","텨ᄒ":"톃","톄":"톄","톄ᄀ":"톅","톄ᄁ":"톆","톄ᄀᄉ":"톇","톄ᄂ":"톈","톄ᄂᄌ":"톉","톄ᄂᄒ":"톊","톄ᄃ":"톋","톄ᄅ":"톌","톄ᄅᄀ":"톍","톄ᄅᄆ":"톎","톄ᄅᄇ":"톏","톄ᄅᄉ":"톐","톄ᄅᄐ":"톑","톄ᄅᄑ":"톒","톄ᄅᄒ":"톓","톄ᄆ":"톔","톄ᄇ":"톕","톄ᄇᄉ":"톖","톄ᄉ":"톗","톄ᄊ":"톘","톄ᄋ":"톙","톄ᄌ":"톚","톄ᄎ":"톛","톄ᄏ":"톜","톄ᄐ":"톝","톄ᄑ":"톞","톄ᄒ":"톟","토":"토","토ᄀ":"톡","토ᄁ":"톢","토ᄀᄉ":"톣","토ᄂ":"톤","토ᄂᄌ":"톥","토ᄂᄒ":"톦","토ᄃ":"톧","토ᄅ":"톨","토ᄅᄀ":"톩","토ᄅᄆ":"톪","토ᄅᄇ":"톫","토ᄅᄉ":"톬","토ᄅᄐ":"톭","토ᄅᄑ":"톮","토ᄅᄒ":"톯","토ᄆ":"톰","토ᄇ":"톱","토ᄇᄉ":"톲","토ᄉ":"톳","토ᄊ":"톴","토ᄋ":"통","토ᄌ":"톶","토ᄎ":"톷","토ᄏ":"톸","토ᄐ":"톹","토ᄑ":"톺","토ᄒ":"톻","토ᅡ":"톼","토ᅡᄀ":"톽","토ᅡᄁ":"톾","토ᅡᄀᄉ":"톿","토ᅡᄂ":"퇀","토ᅡᄂᄌ":"퇁","토ᅡᄂᄒ":"퇂","토ᅡᄃ":"퇃","토ᅡᄅ":"퇄","토ᅡᄅᄀ":"퇅","토ᅡᄅᄆ":"퇆","토ᅡᄅᄇ":"퇇","토ᅡᄅᄉ":"퇈","토ᅡᄅᄐ":"퇉","토ᅡᄅᄑ":"퇊","토ᅡᄅᄒ":"퇋","토ᅡᄆ":"퇌","토ᅡᄇ":"퇍","토ᅡᄇᄉ":"퇎","토ᅡᄉ":"퇏","토ᅡᄊ":"퇐","토ᅡᄋ":"퇑","토ᅡᄌ":"퇒","토ᅡᄎ":"퇓","토ᅡᄏ":"퇔","토ᅡᄐ":"퇕","토ᅡᄑ":"퇖","토ᅡᄒ":"퇗","토ᅢ":"퇘","토ᅢᄀ":"퇙","토ᅢᄁ":"퇚","토ᅢᄀᄉ":"퇛","토ᅢᄂ":"퇜","토ᅢᄂᄌ":"퇝","토ᅢᄂᄒ":"퇞","토ᅢᄃ":"퇟","토ᅢᄅ":"퇠","토ᅢᄅᄀ":"퇡","토ᅢᄅᄆ":"퇢","토ᅢᄅᄇ":"퇣","토ᅢᄅᄉ":"퇤","토ᅢᄅᄐ":"퇥","토ᅢᄅᄑ":"퇦","토ᅢᄅᄒ":"퇧","토ᅢᄆ":"퇨","토ᅢᄇ":"퇩","토ᅢᄇᄉ":"퇪","토ᅢᄉ":"퇫","토ᅢᄊ":"퇬","토ᅢᄋ":"퇭","토ᅢᄌ":"퇮","토ᅢᄎ":"퇯","토ᅢᄏ":"퇰","토ᅢᄐ":"퇱","토ᅢᄑ":"퇲","토ᅢᄒ":"퇳","토ᅵ":"퇴","토ᅵᄀ":"퇵","토ᅵᄁ":"퇶","토ᅵᄀᄉ":"퇷","토ᅵᄂ":"퇸","토ᅵᄂᄌ":"퇹","토ᅵᄂᄒ":"퇺","토ᅵᄃ":"퇻","토ᅵᄅ":"퇼","토ᅵᄅᄀ":"퇽","토ᅵᄅᄆ":"퇾","토ᅵᄅᄇ":"퇿","토ᅵᄅᄉ":"툀","토ᅵᄅᄐ":"툁","토ᅵᄅᄑ":"툂","토ᅵᄅᄒ":"툃","토ᅵᄆ":"툄","토ᅵᄇ":"툅","토ᅵᄇᄉ":"툆","토ᅵᄉ":"툇","토ᅵᄊ":"툈","토ᅵᄋ":"툉","토ᅵᄌ":"툊","토ᅵᄎ":"툋","토ᅵᄏ":"툌","토ᅵᄐ":"툍","토ᅵᄑ":"툎","토ᅵᄒ":"툏","툐":"툐","툐ᄀ":"툑","툐ᄁ":"툒","툐ᄀᄉ":"툓","툐ᄂ":"툔","툐ᄂᄌ":"툕","툐ᄂᄒ":"툖","툐ᄃ":"툗","툐ᄅ":"툘","툐ᄅᄀ":"툙","툐ᄅᄆ":"툚","툐ᄅᄇ":"툛","툐ᄅᄉ":"툜","툐ᄅᄐ":"툝","툐ᄅᄑ":"툞","툐ᄅᄒ":"툟","툐ᄆ":"툠","툐ᄇ":"툡","툐ᄇᄉ":"툢","툐ᄉ":"툣","툐ᄊ":"툤","툐ᄋ":"툥","툐ᄌ":"툦","툐ᄎ":"툧","툐ᄏ":"툨","툐ᄐ":"툩","툐ᄑ":"툪","툐ᄒ":"툫","투":"투","투ᄀ":"툭","투ᄁ":"툮","투ᄀᄉ":"툯","투ᄂ":"툰","투ᄂᄌ":"툱","투ᄂᄒ":"툲","투ᄃ":"툳","투ᄅ":"툴","투ᄅᄀ":"툵","투ᄅᄆ":"툶","투ᄅᄇ":"툷","투ᄅᄉ":"툸","투ᄅᄐ":"툹","투ᄅᄑ":"툺","투ᄅᄒ":"툻","투ᄆ":"툼","투ᄇ":"툽","투ᄇᄉ":"툾","투ᄉ":"툿","투ᄊ":"퉀","투ᄋ":"퉁","투ᄌ":"퉂","투ᄎ":"퉃","투ᄏ":"퉄","투ᄐ":"퉅","투ᄑ":"퉆","투ᄒ":"퉇","투ᅥ":"퉈","투ᅥᄀ":"퉉","투ᅥᄁ":"퉊","투ᅥᄀᄉ":"퉋","투ᅥᄂ":"퉌","투ᅥᄂᄌ":"퉍","투ᅥᄂᄒ":"퉎","투ᅥᄃ":"퉏","투ᅥᄅ":"퉐","투ᅥᄅᄀ":"퉑","투ᅥᄅᄆ":"퉒","투ᅥᄅᄇ":"퉓","투ᅥᄅᄉ":"퉔","투ᅥᄅᄐ":"퉕","투ᅥᄅᄑ":"퉖","투ᅥᄅᄒ":"퉗","투ᅥᄆ":"퉘","투ᅥᄇ":"퉙","투ᅥᄇᄉ":"퉚","투ᅥᄉ":"퉛","투ᅥᄊ":"퉜","투ᅥᄋ":"퉝","투ᅥᄌ":"퉞","투ᅥᄎ":"퉟","투ᅥᄏ":"퉠","투ᅥᄐ":"퉡","투ᅥᄑ":"퉢","투ᅥᄒ":"퉣","투ᅦ":"퉤","투ᅦᄀ":"퉥","투ᅦᄁ":"퉦","투ᅦᄀᄉ":"퉧","투ᅦᄂ":"퉨","투ᅦᄂᄌ":"퉩","투ᅦᄂᄒ":"퉪","투ᅦᄃ":"퉫","투ᅦᄅ":"퉬","투ᅦᄅᄀ":"퉭","투ᅦᄅᄆ":"퉮","투ᅦᄅᄇ":"퉯","투ᅦᄅᄉ":"퉰","투ᅦᄅᄐ":"퉱","투ᅦᄅᄑ":"퉲","투ᅦᄅᄒ":"퉳","투ᅦᄆ":"퉴","투ᅦᄇ":"퉵","투ᅦᄇᄉ":"퉶","투ᅦᄉ":"퉷","투ᅦᄊ":"퉸","투ᅦᄋ":"퉹","투ᅦᄌ":"퉺","투ᅦᄎ":"퉻","투ᅦᄏ":"퉼","투ᅦᄐ":"퉽","투ᅦᄑ":"퉾","투ᅦᄒ":"퉿","투ᅵ":"튀","투ᅵᄀ":"튁","투ᅵᄁ":"튂","투ᅵᄀᄉ":"튃","투ᅵᄂ":"튄","투ᅵᄂᄌ":"튅","투ᅵᄂᄒ":"튆","투ᅵᄃ":"튇","투ᅵᄅ":"튈","투ᅵᄅᄀ":"튉","투ᅵᄅᄆ":"튊","투ᅵᄅᄇ":"튋","투ᅵᄅᄉ":"튌","투ᅵᄅᄐ":"튍","투ᅵᄅᄑ":"튎","투ᅵᄅᄒ":"튏","투ᅵᄆ":"튐","투ᅵᄇ":"튑","투ᅵᄇᄉ":"튒","투ᅵᄉ":"튓","투ᅵᄊ":"튔","투ᅵᄋ":"튕","투ᅵᄌ":"튖","투ᅵᄎ":"튗","투ᅵᄏ":"튘","투ᅵᄐ":"튙","투ᅵᄑ":"튚","투ᅵᄒ":"튛","튜":"튜","튜ᄀ":"튝","튜ᄁ":"튞","튜ᄀᄉ":"튟","튜ᄂ":"튠","튜ᄂᄌ":"튡","튜ᄂᄒ":"튢","튜ᄃ":"튣","튜ᄅ":"튤","튜ᄅᄀ":"튥","튜ᄅᄆ":"튦","튜ᄅᄇ":"튧","튜ᄅᄉ":"튨","튜ᄅᄐ":"튩","튜ᄅᄑ":"튪","튜ᄅᄒ":"튫","튜ᄆ":"튬","튜ᄇ":"튭","튜ᄇᄉ":"튮","튜ᄉ":"튯","튜ᄊ":"튰","튜ᄋ":"튱","튜ᄌ":"튲","튜ᄎ":"튳","튜ᄏ":"튴","튜ᄐ":"튵","튜ᄑ":"튶","튜ᄒ":"튷","트":"트","트ᄀ":"특","트ᄁ":"튺","트ᄀᄉ":"튻","트ᄂ":"튼","트ᄂᄌ":"튽","트ᄂᄒ":"튾","트ᄃ":"튿","트ᄅ":"틀","트ᄅᄀ":"틁","트ᄅᄆ":"틂","트ᄅᄇ":"틃","트ᄅᄉ":"틄","트ᄅᄐ":"틅","트ᄅᄑ":"틆","트ᄅᄒ":"틇","트ᄆ":"틈","트ᄇ":"틉","트ᄇᄉ":"틊","트ᄉ":"틋","트ᄊ":"틌","트ᄋ":"틍","트ᄌ":"틎","트ᄎ":"틏","트ᄏ":"틐","트ᄐ":"틑","트ᄑ":"틒","트ᄒ":"틓","트ᅵ":"틔","트ᅵᄀ":"틕","트ᅵᄁ":"틖","트ᅵᄀᄉ":"틗","트ᅵᄂ":"틘","트ᅵᄂᄌ":"틙","트ᅵᄂᄒ":"틚","트ᅵᄃ":"틛","트ᅵᄅ":"틜","트ᅵᄅᄀ":"틝","트ᅵᄅᄆ":"틞","트ᅵᄅᄇ":"틟","트ᅵᄅᄉ":"틠","트ᅵᄅᄐ":"틡","트ᅵᄅᄑ":"틢","트ᅵᄅᄒ":"틣","트ᅵᄆ":"틤","트ᅵᄇ":"틥","트ᅵᄇᄉ":"틦","트ᅵᄉ":"틧","트ᅵᄊ":"틨","트ᅵᄋ":"틩","트ᅵᄌ":"틪","트ᅵᄎ":"틫","트ᅵᄏ":"틬","트ᅵᄐ":"틭","트ᅵᄑ":"틮","트ᅵᄒ":"틯","티":"티","티ᄀ":"틱","티ᄁ":"틲","티ᄀᄉ":"틳","티ᄂ":"틴","티ᄂᄌ":"틵","티ᄂᄒ":"틶","티ᄃ":"틷","티ᄅ":"틸","티ᄅᄀ":"틹","티ᄅᄆ":"틺","티ᄅᄇ":"틻","티ᄅᄉ":"틼","티ᄅᄐ":"틽","티ᄅᄑ":"틾","티ᄅᄒ":"틿","티ᄆ":"팀","티ᄇ":"팁","티ᄇᄉ":"팂","티ᄉ":"팃","티ᄊ":"팄","티ᄋ":"팅","티ᄌ":"팆","티ᄎ":"팇","티ᄏ":"팈","티ᄐ":"팉","티ᄑ":"팊","티ᄒ":"팋","파":"파","파ᄀ":"팍","파ᄁ":"팎","파ᄀᄉ":"팏","파ᄂ":"판","파ᄂᄌ":"팑","파ᄂᄒ":"팒","파ᄃ":"팓","파ᄅ":"팔","파ᄅᄀ":"팕","파ᄅᄆ":"팖","파ᄅᄇ":"팗","파ᄅᄉ":"팘","파ᄅᄐ":"팙","파ᄅᄑ":"팚","파ᄅᄒ":"팛","파ᄆ":"팜","파ᄇ":"팝","파ᄇᄉ":"팞","파ᄉ":"팟","파ᄊ":"팠","파ᄋ":"팡","파ᄌ":"팢","파ᄎ":"팣","파ᄏ":"팤","파ᄐ":"팥","파ᄑ":"팦","파ᄒ":"팧","패":"패","패ᄀ":"팩","패ᄁ":"팪","패ᄀᄉ":"팫","패ᄂ":"팬","패ᄂᄌ":"팭","패ᄂᄒ":"팮","패ᄃ":"팯","패ᄅ":"팰","패ᄅᄀ":"팱","패ᄅᄆ":"팲","패ᄅᄇ":"팳","패ᄅᄉ":"팴","패ᄅᄐ":"팵","패ᄅᄑ":"팶","패ᄅᄒ":"팷","패ᄆ":"팸","패ᄇ":"팹","패ᄇᄉ":"팺","패ᄉ":"팻","패ᄊ":"팼","패ᄋ":"팽","패ᄌ":"팾","패ᄎ":"팿","패ᄏ":"퍀","패ᄐ":"퍁","패ᄑ":"퍂","패ᄒ":"퍃","퍄":"퍄","퍄ᄀ":"퍅","퍄ᄁ":"퍆","퍄ᄀᄉ":"퍇","퍄ᄂ":"퍈","퍄ᄂᄌ":"퍉","퍄ᄂᄒ":"퍊","퍄ᄃ":"퍋","퍄ᄅ":"퍌","퍄ᄅᄀ":"퍍","퍄ᄅᄆ":"퍎","퍄ᄅᄇ":"퍏","퍄ᄅᄉ":"퍐","퍄ᄅᄐ":"퍑","퍄ᄅᄑ":"퍒","퍄ᄅᄒ":"퍓","퍄ᄆ":"퍔","퍄ᄇ":"퍕","퍄ᄇᄉ":"퍖","퍄ᄉ":"퍗","퍄ᄊ":"퍘","퍄ᄋ":"퍙","퍄ᄌ":"퍚","퍄ᄎ":"퍛","퍄ᄏ":"퍜","퍄ᄐ":"퍝","퍄ᄑ":"퍞","퍄ᄒ":"퍟","퍠":"퍠","퍠ᄀ":"퍡","퍠ᄁ":"퍢","퍠ᄀᄉ":"퍣","퍠ᄂ":"퍤","퍠ᄂᄌ":"퍥","퍠ᄂᄒ":"퍦","퍠ᄃ":"퍧","퍠ᄅ":"퍨","퍠ᄅᄀ":"퍩","퍠ᄅᄆ":"퍪","퍠ᄅᄇ":"퍫","퍠ᄅᄉ":"퍬","퍠ᄅᄐ":"퍭","퍠ᄅᄑ":"퍮","퍠ᄅᄒ":"퍯","퍠ᄆ":"퍰","퍠ᄇ":"퍱","퍠ᄇᄉ":"퍲","퍠ᄉ":"퍳","퍠ᄊ":"퍴","퍠ᄋ":"퍵","퍠ᄌ":"퍶","퍠ᄎ":"퍷","퍠ᄏ":"퍸","퍠ᄐ":"퍹","퍠ᄑ":"퍺","퍠ᄒ":"퍻","퍼":"퍼","퍼ᄀ":"퍽","퍼ᄁ":"퍾","퍼ᄀᄉ":"퍿","퍼ᄂ":"펀","퍼ᄂᄌ":"펁","퍼ᄂᄒ":"펂","퍼ᄃ":"펃","퍼ᄅ":"펄","퍼ᄅᄀ":"펅","퍼ᄅᄆ":"펆","퍼ᄅᄇ":"펇","퍼ᄅᄉ":"펈","퍼ᄅᄐ":"펉","퍼ᄅᄑ":"펊","퍼ᄅᄒ":"펋","퍼ᄆ":"펌","퍼ᄇ":"펍","퍼ᄇᄉ":"펎","퍼ᄉ":"펏","퍼ᄊ":"펐","퍼ᄋ":"펑","퍼ᄌ":"펒","퍼ᄎ":"펓","퍼ᄏ":"펔","퍼ᄐ":"펕","퍼ᄑ":"펖","퍼ᄒ":"펗","페":"페","페ᄀ":"펙","페ᄁ":"펚","페ᄀᄉ":"펛","페ᄂ":"펜","페ᄂᄌ":"펝","페ᄂᄒ":"펞","페ᄃ":"펟","페ᄅ":"펠","페ᄅᄀ":"펡","페ᄅᄆ":"펢","페ᄅᄇ":"펣","페ᄅᄉ":"펤","페ᄅᄐ":"펥","페ᄅᄑ":"펦","페ᄅᄒ":"펧","페ᄆ":"펨","페ᄇ":"펩","페ᄇᄉ":"펪","페ᄉ":"펫","페ᄊ":"펬","페ᄋ":"펭","페ᄌ":"펮","페ᄎ":"펯","페ᄏ":"펰","페ᄐ":"펱","페ᄑ":"펲","페ᄒ":"펳","펴":"펴","펴ᄀ":"펵","펴ᄁ":"펶","펴ᄀᄉ":"펷","펴ᄂ":"편","펴ᄂᄌ":"펹","펴ᄂᄒ":"펺","펴ᄃ":"펻","펴ᄅ":"펼","펴ᄅᄀ":"펽","펴ᄅᄆ":"펾","펴ᄅᄇ":"펿","펴ᄅᄉ":"폀","펴ᄅᄐ":"폁","펴ᄅᄑ":"폂","펴ᄅᄒ":"폃","펴ᄆ":"폄","펴ᄇ":"폅","펴ᄇᄉ":"폆","펴ᄉ":"폇","펴ᄊ":"폈","펴ᄋ":"평","펴ᄌ":"폊","펴ᄎ":"폋","펴ᄏ":"폌","펴ᄐ":"폍","펴ᄑ":"폎","펴ᄒ":"폏","폐":"폐","폐ᄀ":"폑","폐ᄁ":"폒","폐ᄀᄉ":"폓","폐ᄂ":"폔","폐ᄂᄌ":"폕","폐ᄂᄒ":"폖","폐ᄃ":"폗","폐ᄅ":"폘","폐ᄅᄀ":"폙","폐ᄅᄆ":"폚","폐ᄅᄇ":"폛","폐ᄅᄉ":"폜","폐ᄅᄐ":"폝","폐ᄅᄑ":"폞","폐ᄅᄒ":"폟","폐ᄆ":"폠","폐ᄇ":"폡","폐ᄇᄉ":"폢","폐ᄉ":"폣","폐ᄊ":"폤","폐ᄋ":"폥","폐ᄌ":"폦","폐ᄎ":"폧","폐ᄏ":"폨","폐ᄐ":"폩","폐ᄑ":"폪","폐ᄒ":"폫","포":"포","포ᄀ":"폭","포ᄁ":"폮","포ᄀᄉ":"폯","포ᄂ":"폰","포ᄂᄌ":"폱","포ᄂᄒ":"폲","포ᄃ":"폳","포ᄅ":"폴","포ᄅᄀ":"폵","포ᄅᄆ":"폶","포ᄅᄇ":"폷","포ᄅᄉ":"폸","포ᄅᄐ":"폹","포ᄅᄑ":"폺","포ᄅᄒ":"폻","포ᄆ":"폼","포ᄇ":"폽","포ᄇᄉ":"폾","포ᄉ":"폿","포ᄊ":"퐀","포ᄋ":"퐁","포ᄌ":"퐂","포ᄎ":"퐃","포ᄏ":"퐄","포ᄐ":"퐅","포ᄑ":"퐆","포ᄒ":"퐇","포ᅡ":"퐈","포ᅡᄀ":"퐉","포ᅡᄁ":"퐊","포ᅡᄀᄉ":"퐋","포ᅡᄂ":"퐌","포ᅡᄂᄌ":"퐍","포ᅡᄂᄒ":"퐎","포ᅡᄃ":"퐏","포ᅡᄅ":"퐐","포ᅡᄅᄀ":"퐑","포ᅡᄅᄆ":"퐒","포ᅡᄅᄇ":"퐓","포ᅡᄅᄉ":"퐔","포ᅡᄅᄐ":"퐕","포ᅡᄅᄑ":"퐖","포ᅡᄅᄒ":"퐗","포ᅡᄆ":"퐘","포ᅡᄇ":"퐙","포ᅡᄇᄉ":"퐚","포ᅡᄉ":"퐛","포ᅡᄊ":"퐜","포ᅡᄋ":"퐝","포ᅡᄌ":"퐞","포ᅡᄎ":"퐟","포ᅡᄏ":"퐠","포ᅡᄐ":"퐡","포ᅡᄑ":"퐢","포ᅡᄒ":"퐣","포ᅢ":"퐤","포ᅢᄀ":"퐥","포ᅢᄁ":"퐦","포ᅢᄀᄉ":"퐧","포ᅢᄂ":"퐨","포ᅢᄂᄌ":"퐩","포ᅢᄂᄒ":"퐪","포ᅢᄃ":"퐫","포ᅢᄅ":"퐬","포ᅢᄅᄀ":"퐭","포ᅢᄅᄆ":"퐮","포ᅢᄅᄇ":"퐯","포ᅢᄅᄉ":"퐰","포ᅢᄅᄐ":"퐱","포ᅢᄅᄑ":"퐲","포ᅢᄅᄒ":"퐳","포ᅢᄆ":"퐴","포ᅢᄇ":"퐵","포ᅢᄇᄉ":"퐶","포ᅢᄉ":"퐷","포ᅢᄊ":"퐸","포ᅢᄋ":"퐹","포ᅢᄌ":"퐺","포ᅢᄎ":"퐻","포ᅢᄏ":"퐼","포ᅢᄐ":"퐽","포ᅢᄑ":"퐾","포ᅢᄒ":"퐿","포ᅵ":"푀","포ᅵᄀ":"푁","포ᅵᄁ":"푂","포ᅵᄀᄉ":"푃","포ᅵᄂ":"푄","포ᅵᄂᄌ":"푅","포ᅵᄂᄒ":"푆","포ᅵᄃ":"푇","포ᅵᄅ":"푈","포ᅵᄅᄀ":"푉","포ᅵᄅᄆ":"푊","포ᅵᄅᄇ":"푋","포ᅵᄅᄉ":"푌","포ᅵᄅᄐ":"푍","포ᅵᄅᄑ":"푎","포ᅵᄅᄒ":"푏","포ᅵᄆ":"푐","포ᅵᄇ":"푑","포ᅵᄇᄉ":"푒","포ᅵᄉ":"푓","포ᅵᄊ":"푔","포ᅵᄋ":"푕","포ᅵᄌ":"푖","포ᅵᄎ":"푗","포ᅵᄏ":"푘","포ᅵᄐ":"푙","포ᅵᄑ":"푚","포ᅵᄒ":"푛","표":"표","표ᄀ":"푝","표ᄁ":"푞","표ᄀᄉ":"푟","표ᄂ":"푠","표ᄂᄌ":"푡","표ᄂᄒ":"푢","표ᄃ":"푣","표ᄅ":"푤","표ᄅᄀ":"푥","표ᄅᄆ":"푦","표ᄅᄇ":"푧","표ᄅᄉ":"푨","표ᄅᄐ":"푩","표ᄅᄑ":"푪","표ᄅᄒ":"푫","표ᄆ":"푬","표ᄇ":"푭","표ᄇᄉ":"푮","표ᄉ":"푯","표ᄊ":"푰","표ᄋ":"푱","표ᄌ":"푲","표ᄎ":"푳","표ᄏ":"푴","표ᄐ":"푵","표ᄑ":"푶","표ᄒ":"푷","푸":"푸","푸ᄀ":"푹","푸ᄁ":"푺","푸ᄀᄉ":"푻","푸ᄂ":"푼","푸ᄂᄌ":"푽","푸ᄂᄒ":"푾","푸ᄃ":"푿","푸ᄅ":"풀","푸ᄅᄀ":"풁","푸ᄅᄆ":"풂","푸ᄅᄇ":"풃","푸ᄅᄉ":"풄","푸ᄅᄐ":"풅","푸ᄅᄑ":"풆","푸ᄅᄒ":"풇","푸ᄆ":"품","푸ᄇ":"풉","푸ᄇᄉ":"풊","푸ᄉ":"풋","푸ᄊ":"풌","푸ᄋ":"풍","푸ᄌ":"풎","푸ᄎ":"풏","푸ᄏ":"풐","푸ᄐ":"풑","푸ᄑ":"풒","푸ᄒ":"풓","푸ᅥ":"풔","푸ᅥᄀ":"풕","푸ᅥᄁ":"풖","푸ᅥᄀᄉ":"풗","푸ᅥᄂ":"풘","푸ᅥᄂᄌ":"풙","푸ᅥᄂᄒ":"풚","푸ᅥᄃ":"풛","푸ᅥᄅ":"풜","푸ᅥᄅᄀ":"풝","푸ᅥᄅᄆ":"풞","푸ᅥᄅᄇ":"풟","푸ᅥᄅᄉ":"풠","푸ᅥᄅᄐ":"풡","푸ᅥᄅᄑ":"풢","푸ᅥᄅᄒ":"풣","푸ᅥᄆ":"풤","푸ᅥᄇ":"풥","푸ᅥᄇᄉ":"풦","푸ᅥᄉ":"풧","푸ᅥᄊ":"풨","푸ᅥᄋ":"풩","푸ᅥᄌ":"풪","푸ᅥᄎ":"풫","푸ᅥᄏ":"풬","푸ᅥᄐ":"풭","푸ᅥᄑ":"풮","푸ᅥᄒ":"풯","푸ᅦ":"풰","푸ᅦᄀ":"풱","푸ᅦᄁ":"풲","푸ᅦᄀᄉ":"풳","푸ᅦᄂ":"풴","푸ᅦᄂᄌ":"풵","푸ᅦᄂᄒ":"풶","푸ᅦᄃ":"풷","푸ᅦᄅ":"풸","푸ᅦᄅᄀ":"풹","푸ᅦᄅᄆ":"풺","푸ᅦᄅᄇ":"풻","푸ᅦᄅᄉ":"풼","푸ᅦᄅᄐ":"풽","푸ᅦᄅᄑ":"풾","푸ᅦᄅᄒ":"풿","푸ᅦᄆ":"퓀","푸ᅦᄇ":"퓁","푸ᅦᄇᄉ":"퓂","푸ᅦᄉ":"퓃","푸ᅦᄊ":"퓄","푸ᅦᄋ":"퓅","푸ᅦᄌ":"퓆","푸ᅦᄎ":"퓇","푸ᅦᄏ":"퓈","푸ᅦᄐ":"퓉","푸ᅦᄑ":"퓊","푸ᅦᄒ":"퓋","푸ᅵ":"퓌","푸ᅵᄀ":"퓍","푸ᅵᄁ":"퓎","푸ᅵᄀᄉ":"퓏","푸ᅵᄂ":"퓐","푸ᅵᄂᄌ":"퓑","푸ᅵᄂᄒ":"퓒","푸ᅵᄃ":"퓓","푸ᅵᄅ":"퓔","푸ᅵᄅᄀ":"퓕","푸ᅵᄅᄆ":"퓖","푸ᅵᄅᄇ":"퓗","푸ᅵᄅᄉ":"퓘","푸ᅵᄅᄐ":"퓙","푸ᅵᄅᄑ":"퓚","푸ᅵᄅᄒ":"퓛","푸ᅵᄆ":"퓜","푸ᅵᄇ":"퓝","푸ᅵᄇᄉ":"퓞","푸ᅵᄉ":"퓟","푸ᅵᄊ":"퓠","푸ᅵᄋ":"퓡","푸ᅵᄌ":"퓢","푸ᅵᄎ":"퓣","푸ᅵᄏ":"퓤","푸ᅵᄐ":"퓥","푸ᅵᄑ":"퓦","푸ᅵᄒ":"퓧","퓨":"퓨","퓨ᄀ":"퓩","퓨ᄁ":"퓪","퓨ᄀᄉ":"퓫","퓨ᄂ":"퓬","퓨ᄂᄌ":"퓭","퓨ᄂᄒ":"퓮","퓨ᄃ":"퓯","퓨ᄅ":"퓰","퓨ᄅᄀ":"퓱","퓨ᄅᄆ":"퓲","퓨ᄅᄇ":"퓳","퓨ᄅᄉ":"퓴","퓨ᄅᄐ":"퓵","퓨ᄅᄑ":"퓶","퓨ᄅᄒ":"퓷","퓨ᄆ":"퓸","퓨ᄇ":"퓹","퓨ᄇᄉ":"퓺","퓨ᄉ":"퓻","퓨ᄊ":"퓼","퓨ᄋ":"퓽","퓨ᄌ":"퓾","퓨ᄎ":"퓿","퓨ᄏ":"픀","퓨ᄐ":"픁","퓨ᄑ":"픂","퓨ᄒ":"픃","프":"프","프ᄀ":"픅","프ᄁ":"픆","프ᄀᄉ":"픇","프ᄂ":"픈","프ᄂᄌ":"픉","프ᄂᄒ":"픊","프ᄃ":"픋","프ᄅ":"플","프ᄅᄀ":"픍","프ᄅᄆ":"픎","프ᄅᄇ":"픏","프ᄅᄉ":"픐","프ᄅᄐ":"픑","프ᄅᄑ":"픒","프ᄅᄒ":"픓","프ᄆ":"픔","프ᄇ":"픕","프ᄇᄉ":"픖","프ᄉ":"픗","프ᄊ":"픘","프ᄋ":"픙","프ᄌ":"픚","프ᄎ":"픛","프ᄏ":"픜","프ᄐ":"픝","프ᄑ":"픞","프ᄒ":"픟","프ᅵ":"픠","프ᅵᄀ":"픡","프ᅵᄁ":"픢","프ᅵᄀᄉ":"픣","프ᅵᄂ":"픤","프ᅵᄂᄌ":"픥","프ᅵᄂᄒ":"픦","프ᅵᄃ":"픧","프ᅵᄅ":"픨","프ᅵᄅᄀ":"픩","프ᅵᄅᄆ":"픪","프ᅵᄅᄇ":"픫","프ᅵᄅᄉ":"픬","프ᅵᄅᄐ":"픭","프ᅵᄅᄑ":"픮","프ᅵᄅᄒ":"픯","프ᅵᄆ":"픰","프ᅵᄇ":"픱","프ᅵᄇᄉ":"픲","프ᅵᄉ":"픳","프ᅵᄊ":"픴","프ᅵᄋ":"픵","프ᅵᄌ":"픶","프ᅵᄎ":"픷","프ᅵᄏ":"픸","프ᅵᄐ":"픹","프ᅵᄑ":"픺","프ᅵᄒ":"픻","피":"피","피ᄀ":"픽","피ᄁ":"픾","피ᄀᄉ":"픿","피ᄂ":"핀","피ᄂᄌ":"핁","피ᄂᄒ":"핂","피ᄃ":"핃","피ᄅ":"필","피ᄅᄀ":"핅","피ᄅᄆ":"핆","피ᄅᄇ":"핇","피ᄅᄉ":"핈","피ᄅᄐ":"핉","피ᄅᄑ":"핊","피ᄅᄒ":"핋","피ᄆ":"핌","피ᄇ":"핍","피ᄇᄉ":"핎","피ᄉ":"핏","피ᄊ":"핐","피ᄋ":"핑","피ᄌ":"핒","피ᄎ":"핓","피ᄏ":"핔","피ᄐ":"핕","피ᄑ":"핖","피ᄒ":"핗","하":"하","하ᄀ":"학","하ᄁ":"핚","하ᄀᄉ":"핛","하ᄂ":"한","하ᄂᄌ":"핝","하ᄂᄒ":"핞","하ᄃ":"핟","하ᄅ":"할","하ᄅᄀ":"핡","하ᄅᄆ":"핢","하ᄅᄇ":"핣","하ᄅᄉ":"핤","하ᄅᄐ":"핥","하ᄅᄑ":"핦","하ᄅᄒ":"핧","하ᄆ":"함","하ᄇ":"합","하ᄇᄉ":"핪","하ᄉ":"핫","하ᄊ":"핬","하ᄋ":"항","하ᄌ":"핮","하ᄎ":"핯","하ᄏ":"핰","하ᄐ":"핱","하ᄑ":"핲","하ᄒ":"핳","해":"해","해ᄀ":"핵","해ᄁ":"핶","해ᄀᄉ":"핷","해ᄂ":"핸","해ᄂᄌ":"핹","해ᄂᄒ":"핺","해ᄃ":"핻","해ᄅ":"핼","해ᄅᄀ":"핽","해ᄅᄆ":"핾","해ᄅᄇ":"핿","해ᄅᄉ":"햀","해ᄅᄐ":"햁","해ᄅᄑ":"햂","해ᄅᄒ":"햃","해ᄆ":"햄","해ᄇ":"햅","해ᄇᄉ":"햆","해ᄉ":"햇","해ᄊ":"했","해ᄋ":"행","해ᄌ":"햊","해ᄎ":"햋","해ᄏ":"햌","해ᄐ":"햍","해ᄑ":"햎","해ᄒ":"햏","햐":"햐","햐ᄀ":"햑","햐ᄁ":"햒","햐ᄀᄉ":"햓","햐ᄂ":"햔","햐ᄂᄌ":"햕","햐ᄂᄒ":"햖","햐ᄃ":"햗","햐ᄅ":"햘","햐ᄅᄀ":"햙","햐ᄅᄆ":"햚","햐ᄅᄇ":"햛","햐ᄅᄉ":"햜","햐ᄅᄐ":"햝","햐ᄅᄑ":"햞","햐ᄅᄒ":"햟","햐ᄆ":"햠","햐ᄇ":"햡","햐ᄇᄉ":"햢","햐ᄉ":"햣","햐ᄊ":"햤","햐ᄋ":"향","햐ᄌ":"햦","햐ᄎ":"햧","햐ᄏ":"햨","햐ᄐ":"햩","햐ᄑ":"햪","햐ᄒ":"햫","햬":"햬","햬ᄀ":"햭","햬ᄁ":"햮","햬ᄀᄉ":"햯","햬ᄂ":"햰","햬ᄂᄌ":"햱","햬ᄂᄒ":"햲","햬ᄃ":"햳","햬ᄅ":"햴","햬ᄅᄀ":"햵","햬ᄅᄆ":"햶","햬ᄅᄇ":"햷","햬ᄅᄉ":"햸","햬ᄅᄐ":"햹","햬ᄅᄑ":"햺","햬ᄅᄒ":"햻","햬ᄆ":"햼","햬ᄇ":"햽","햬ᄇᄉ":"햾","햬ᄉ":"햿","햬ᄊ":"헀","햬ᄋ":"헁","햬ᄌ":"헂","햬ᄎ":"헃","햬ᄏ":"헄","햬ᄐ":"헅","햬ᄑ":"헆","햬ᄒ":"헇","허":"허","허ᄀ":"헉","허ᄁ":"헊","허ᄀᄉ":"헋","허ᄂ":"헌","허ᄂᄌ":"헍","허ᄂᄒ":"헎","허ᄃ":"헏","허ᄅ":"헐","허ᄅᄀ":"헑","허ᄅᄆ":"헒","허ᄅᄇ":"헓","허ᄅᄉ":"헔","허ᄅᄐ":"헕","허ᄅᄑ":"헖","허ᄅᄒ":"헗","허ᄆ":"험","허ᄇ":"헙","허ᄇᄉ":"헚","허ᄉ":"헛","허ᄊ":"헜","허ᄋ":"헝","허ᄌ":"헞","허ᄎ":"헟","허ᄏ":"헠","허ᄐ":"헡","허ᄑ":"헢","허ᄒ":"헣","헤":"헤","헤ᄀ":"헥","헤ᄁ":"헦","헤ᄀᄉ":"헧","헤ᄂ":"헨","헤ᄂᄌ":"헩","헤ᄂᄒ":"헪","헤ᄃ":"헫","헤ᄅ":"헬","헤ᄅᄀ":"헭","헤ᄅᄆ":"헮","헤ᄅᄇ":"헯","헤ᄅᄉ":"헰","헤ᄅᄐ":"헱","헤ᄅᄑ":"헲","헤ᄅᄒ":"헳","헤ᄆ":"헴","헤ᄇ":"헵","헤ᄇᄉ":"헶","헤ᄉ":"헷","헤ᄊ":"헸","헤ᄋ":"헹","헤ᄌ":"헺","헤ᄎ":"헻","헤ᄏ":"헼","헤ᄐ":"헽","헤ᄑ":"헾","헤ᄒ":"헿","혀":"혀","혀ᄀ":"혁","혀ᄁ":"혂","혀ᄀᄉ":"혃","혀ᄂ":"현","혀ᄂᄌ":"혅","혀ᄂᄒ":"혆","혀ᄃ":"혇","혀ᄅ":"혈","혀ᄅᄀ":"혉","혀ᄅᄆ":"혊","혀ᄅᄇ":"혋","혀ᄅᄉ":"혌","혀ᄅᄐ":"혍","혀ᄅᄑ":"혎","혀ᄅᄒ":"혏","혀ᄆ":"혐","혀ᄇ":"협","혀ᄇᄉ":"혒","혀ᄉ":"혓","혀ᄊ":"혔","혀ᄋ":"형","혀ᄌ":"혖","혀ᄎ":"혗","혀ᄏ":"혘","혀ᄐ":"혙","혀ᄑ":"혚","혀ᄒ":"혛","혜":"혜","혜ᄀ":"혝","혜ᄁ":"혞","혜ᄀᄉ":"혟","혜ᄂ":"혠","혜ᄂᄌ":"혡","혜ᄂᄒ":"혢","혜ᄃ":"혣","혜ᄅ":"혤","혜ᄅᄀ":"혥","혜ᄅᄆ":"혦","혜ᄅᄇ":"혧","혜ᄅᄉ":"혨","혜ᄅᄐ":"혩","혜ᄅᄑ":"혪","혜ᄅᄒ":"혫","혜ᄆ":"혬","혜ᄇ":"혭","혜ᄇᄉ":"혮","혜ᄉ":"혯","혜ᄊ":"혰","혜ᄋ":"혱","혜ᄌ":"혲","혜ᄎ":"혳","혜ᄏ":"혴","혜ᄐ":"혵","혜ᄑ":"혶","혜ᄒ":"혷","호":"호","호ᄀ":"혹","호ᄁ":"혺","호ᄀᄉ":"혻","호ᄂ":"혼","호ᄂᄌ":"혽","호ᄂᄒ":"혾","호ᄃ":"혿","호ᄅ":"홀","호ᄅᄀ":"홁","호ᄅᄆ":"홂","호ᄅᄇ":"홃","호ᄅᄉ":"홄","호ᄅᄐ":"홅","호ᄅᄑ":"홆","호ᄅᄒ":"홇","호ᄆ":"홈","호ᄇ":"홉","호ᄇᄉ":"홊","호ᄉ":"홋","호ᄊ":"홌","호ᄋ":"홍","호ᄌ":"홎","호ᄎ":"홏","호ᄏ":"홐","호ᄐ":"홑","호ᄑ":"홒","호ᄒ":"홓","호ᅡ":"화","호ᅡᄀ":"확","호ᅡᄁ":"홖","호ᅡᄀᄉ":"홗","호ᅡᄂ":"환","호ᅡᄂᄌ":"홙","호ᅡᄂᄒ":"홚","호ᅡᄃ":"홛","호ᅡᄅ":"활","호ᅡᄅᄀ":"홝","호ᅡᄅᄆ":"홞","호ᅡᄅᄇ":"홟","호ᅡᄅᄉ":"홠","호ᅡᄅᄐ":"홡","호ᅡᄅᄑ":"홢","호ᅡᄅᄒ":"홣","호ᅡᄆ":"홤","호ᅡᄇ":"홥","호ᅡᄇᄉ":"홦","호ᅡᄉ":"홧","호ᅡᄊ":"홨","호ᅡᄋ":"황","호ᅡᄌ":"홪","호ᅡᄎ":"홫","호ᅡᄏ":"홬","호ᅡᄐ":"홭","호ᅡᄑ":"홮","호ᅡᄒ":"홯","호ᅢ":"홰","호ᅢᄀ":"홱","호ᅢᄁ":"홲","호ᅢᄀᄉ":"홳","호ᅢᄂ":"홴","호ᅢᄂᄌ":"홵","호ᅢᄂᄒ":"홶","호ᅢᄃ":"홷","호ᅢᄅ":"홸","호ᅢᄅᄀ":"홹","호ᅢᄅᄆ":"홺","호ᅢᄅᄇ":"홻","호ᅢᄅᄉ":"홼","호ᅢᄅᄐ":"홽","호ᅢᄅᄑ":"홾","호ᅢᄅᄒ":"홿","호ᅢᄆ":"횀","호ᅢᄇ":"횁","호ᅢᄇᄉ":"횂","호ᅢᄉ":"횃","호ᅢᄊ":"횄","호ᅢᄋ":"횅","호ᅢᄌ":"횆","호ᅢᄎ":"횇","호ᅢᄏ":"횈","호ᅢᄐ":"횉","호ᅢᄑ":"횊","호ᅢᄒ":"횋","호ᅵ":"회","호ᅵᄀ":"획","호ᅵᄁ":"횎","호ᅵᄀᄉ":"횏","호ᅵᄂ":"횐","호ᅵᄂᄌ":"횑","호ᅵᄂᄒ":"횒","호ᅵᄃ":"횓","호ᅵᄅ":"횔","호ᅵᄅᄀ":"횕","호ᅵᄅᄆ":"횖","호ᅵᄅᄇ":"횗","호ᅵᄅᄉ":"횘","호ᅵᄅᄐ":"횙","호ᅵᄅᄑ":"횚","호ᅵᄅᄒ":"횛","호ᅵᄆ":"횜","호ᅵᄇ":"횝","호ᅵᄇᄉ":"횞","호ᅵᄉ":"횟","호ᅵᄊ":"횠","호ᅵᄋ":"횡","호ᅵᄌ":"횢","호ᅵᄎ":"횣","호ᅵᄏ":"횤","호ᅵᄐ":"횥","호ᅵᄑ":"횦","호ᅵᄒ":"횧","효":"효","효ᄀ":"횩","효ᄁ":"횪","효ᄀᄉ":"횫","효ᄂ":"횬","효ᄂᄌ":"횭","효ᄂᄒ":"횮","효ᄃ":"횯","효ᄅ":"횰","효ᄅᄀ":"횱","효ᄅᄆ":"횲","효ᄅᄇ":"횳","효ᄅᄉ":"횴","효ᄅᄐ":"횵","효ᄅᄑ":"횶","효ᄅᄒ":"횷","효ᄆ":"횸","효ᄇ":"횹","효ᄇᄉ":"횺","효ᄉ":"횻","효ᄊ":"횼","효ᄋ":"횽","효ᄌ":"횾","효ᄎ":"횿","효ᄏ":"훀","효ᄐ":"훁","효ᄑ":"훂","효ᄒ":"훃","후":"후","후ᄀ":"훅","후ᄁ":"훆","후ᄀᄉ":"훇","후ᄂ":"훈","후ᄂᄌ":"훉","후ᄂᄒ":"훊","후ᄃ":"훋","후ᄅ":"훌","후ᄅᄀ":"훍","후ᄅᄆ":"훎","후ᄅᄇ":"훏","후ᄅᄉ":"훐","후ᄅᄐ":"훑","후ᄅᄑ":"훒","후ᄅᄒ":"훓","후ᄆ":"훔","후ᄇ":"훕","후ᄇᄉ":"훖","후ᄉ":"훗","후ᄊ":"훘","후ᄋ":"훙","후ᄌ":"훚","후ᄎ":"훛","후ᄏ":"훜","후ᄐ":"훝","후ᄑ":"훞","후ᄒ":"훟","후ᅥ":"훠","후ᅥᄀ":"훡","후ᅥᄁ":"훢","후ᅥᄀᄉ":"훣","후ᅥᄂ":"훤","후ᅥᄂᄌ":"훥","후ᅥᄂᄒ":"훦","후ᅥᄃ":"훧","후ᅥᄅ":"훨","후ᅥᄅᄀ":"훩","후ᅥᄅᄆ":"훪","후ᅥᄅᄇ":"훫","후ᅥᄅᄉ":"훬","후ᅥᄅᄐ":"훭","후ᅥᄅᄑ":"훮","후ᅥᄅᄒ":"훯","후ᅥᄆ":"훰","후ᅥᄇ":"훱","후ᅥᄇᄉ":"훲","후ᅥᄉ":"훳","후ᅥᄊ":"훴","후ᅥᄋ":"훵","후ᅥᄌ":"훶","후ᅥᄎ":"훷","후ᅥᄏ":"훸","후ᅥᄐ":"훹","후ᅥᄑ":"훺","후ᅥᄒ":"훻","후ᅦ":"훼","후ᅦᄀ":"훽","후ᅦᄁ":"훾","후ᅦᄀᄉ":"훿","후ᅦᄂ":"휀","후ᅦᄂᄌ":"휁","후ᅦᄂᄒ":"휂","후ᅦᄃ":"휃","후ᅦᄅ":"휄","후ᅦᄅᄀ":"휅","후ᅦᄅᄆ":"휆","후ᅦᄅᄇ":"휇","후ᅦᄅᄉ":"휈","후ᅦᄅᄐ":"휉","후ᅦᄅᄑ":"휊","후ᅦᄅᄒ":"휋","후ᅦᄆ":"휌","후ᅦᄇ":"휍","후ᅦᄇᄉ":"휎","후ᅦᄉ":"휏","후ᅦᄊ":"휐","후ᅦᄋ":"휑","후ᅦᄌ":"휒","후ᅦᄎ":"휓","후ᅦᄏ":"휔","후ᅦᄐ":"휕","후ᅦᄑ":"휖","후ᅦᄒ":"휗","후ᅵ":"휘","후ᅵᄀ":"휙","후ᅵᄁ":"휚","후ᅵᄀᄉ":"휛","후ᅵᄂ":"휜","후ᅵᄂᄌ":"휝","후ᅵᄂᄒ":"휞","후ᅵᄃ":"휟","후ᅵᄅ":"휠","후ᅵᄅᄀ":"휡","후ᅵᄅᄆ":"휢","후ᅵᄅᄇ":"휣","후ᅵᄅᄉ":"휤","후ᅵᄅᄐ":"휥","후ᅵᄅᄑ":"휦","후ᅵᄅᄒ":"휧","후ᅵᄆ":"휨","후ᅵᄇ":"휩","후ᅵᄇᄉ":"휪","후ᅵᄉ":"휫","후ᅵᄊ":"휬","후ᅵᄋ":"휭","후ᅵᄌ":"휮","후ᅵᄎ":"휯","후ᅵᄏ":"휰","후ᅵᄐ":"휱","후ᅵᄑ":"휲","후ᅵᄒ":"휳","휴":"휴","휴ᄀ":"휵","휴ᄁ":"휶","휴ᄀᄉ":"휷","휴ᄂ":"휸","휴ᄂᄌ":"휹","휴ᄂᄒ":"휺","휴ᄃ":"휻","휴ᄅ":"휼","휴ᄅᄀ":"휽","휴ᄅᄆ":"휾","휴ᄅᄇ":"휿","휴ᄅᄉ":"흀","휴ᄅᄐ":"흁","휴ᄅᄑ":"흂","휴ᄅᄒ":"흃","휴ᄆ":"흄","휴ᄇ":"흅","휴ᄇᄉ":"흆","휴ᄉ":"흇","휴ᄊ":"흈","휴ᄋ":"흉","휴ᄌ":"흊","휴ᄎ":"흋","휴ᄏ":"흌","휴ᄐ":"흍","휴ᄑ":"흎","휴ᄒ":"흏","흐":"흐","흐ᄀ":"흑","흐ᄁ":"흒","흐ᄀᄉ":"흓","흐ᄂ":"흔","흐ᄂᄌ":"흕","흐ᄂᄒ":"흖","흐ᄃ":"흗","흐ᄅ":"흘","흐ᄅᄀ":"흙","흐ᄅᄆ":"흚","흐ᄅᄇ":"흛","흐ᄅᄉ":"흜","흐ᄅᄐ":"흝","흐ᄅᄑ":"흞","흐ᄅᄒ":"흟","흐ᄆ":"흠","흐ᄇ":"흡","흐ᄇᄉ":"흢","흐ᄉ":"흣","흐ᄊ":"흤","흐ᄋ":"흥","흐ᄌ":"흦","흐ᄎ":"흧","흐ᄏ":"흨","흐ᄐ":"흩","흐ᄑ":"흪","흐ᄒ":"흫","흐ᅵ":"희","흐ᅵᄀ":"흭","흐ᅵᄁ":"흮","흐ᅵᄀᄉ":"흯","흐ᅵᄂ":"흰","흐ᅵᄂᄌ":"흱","흐ᅵᄂᄒ":"흲","흐ᅵᄃ":"흳","흐ᅵᄅ":"흴","흐ᅵᄅᄀ":"흵","흐ᅵᄅᄆ":"흶","흐ᅵᄅᄇ":"흷","흐ᅵᄅᄉ":"흸","흐ᅵᄅᄐ":"흹","흐ᅵᄅᄑ":"흺","흐ᅵᄅᄒ":"흻","흐ᅵᄆ":"흼","흐ᅵᄇ":"흽","흐ᅵᄇᄉ":"흾","흐ᅵᄉ":"흿","흐ᅵᄊ":"힀","흐ᅵᄋ":"힁","흐ᅵᄌ":"힂","흐ᅵᄎ":"힃","흐ᅵᄏ":"힄","흐ᅵᄐ":"힅","흐ᅵᄑ":"힆","흐ᅵᄒ":"힇","히":"히","히ᄀ":"힉","히ᄁ":"힊","히ᄀᄉ":"힋","히ᄂ":"힌","히ᄂᄌ":"힍","히ᄂᄒ":"힎","히ᄃ":"힏","히ᄅ":"힐","히ᄅᄀ":"힑","히ᄅᄆ":"힒","히ᄅᄇ":"힓","히ᄅᄉ":"힔","히ᄅᄐ":"힕","히ᄅᄑ":"힖","히ᄅᄒ":"힗","히ᄆ":"힘","히ᄇ":"힙","히ᄇᄉ":"힚","히ᄉ":"힛","히ᄊ":"힜","히ᄋ":"힝","히ᄌ":"힞","히ᄎ":"힟","히ᄏ":"힠","히ᄐ":"힡","히ᄑ":"힢","히ᄒ":"힣"}},x={layout:{default:["ഒ ൧ ൨ ൩ ൪ ൫ ൬ ൭ ൮ ൯ ൦ - ഋ {bksp}","{tab} ഔ ഐ ആ ഈ ഊ ഭ ങ ഘ ധ ഝ ഢ ഞ \\","{lock} ഓ ഏ അ ഇ ഉ ഫ റ ഖ ഥ ഛ ഠ {enter}","{shift} എ ഃ ണ ഴ ള ശ ഷ . യ {shift}",".com @ {space}"],shift:["ൊ ! @ # $ % ^ & * ) ( _ ൃ {bksp}","{tab} ൌ ൈ ാ ീ ൂ ബ ഹ ഗ ദ ജ ഡ ൎ \\","{lock} ോ േ ് ി ു പ ര ക ത ച ട {enter}","{shift} െ ം മ ന വ ല സ . യ {shift}",".com @ {space}"]}},v={layout:{default:["ˊ 1 2 3 4 5 6 7 8 9 0 ɗ ƙ {bksp}","{tab} q w e r t y u i o p ụ ị","{lock} a s d f g h j k l ọ ẹ ǝ {enter}","{shift} z y x c v b n m , . ṣ {shift}",".com @ {space}"],shift:['ˆ ! " / _ ₦ % = - | ( ) Ɗ Ƙ {bksp}',"{tab} Q W E R T Y U I O P Ụ Ị","{lock} A S D F G H J K L Ọ Ẹ Ǝ {enter}","{shift} Z Ɓ C V B N M ; : Ṣ {shift}",".com @ {space}"]}},_={layout:{default:["§ 1 2 3 4 5 6 7 8 9 0 + ´ {bksp}","{tab} q w e r t y u i o p å ¨","{lock} a s d f g h j k l ø æ ' {enter}","{shift} < z x c v b n m , . - {shift}",".com @ {space}"],shift:['° ! " # $ % & / ( ) = ? ` {bksp}',"{tab} Q W E R T Y U I O P Å ^","{lock} A S D F G H J K L Ø Æ * {enter}","{shift} > Z X C V B N M ; : _ {shift}",".com @ {space}"]}},q={layout:{default:["˛ 1 2 3 4 5 6 7 8 9 0 + ' {bksp}","{tab} q w e r t z u i o p ż ś","{lock} a s d f g h j k l ł ą ó {enter}","{shift} < y x c v b n m , . - {shift}",".com @ {space}"],shift:['· ! " # ¤ % & / ( ) = ? * {bksp}',"{tab} Q W E R T Z U I O P ń ć","{lock} A S D F G H J K L Ł ę ź {enter}","{shift} > Y X C V B N M ; : _ {shift}",".com @ {space}"]}},O={layout:{default:["ё 1 2 3 4 5 6 7 8 9 0 - = {bksp}","{tab} й ц у к е н г ш щ з х ъ \\","{lock} ф ы в а п р о л д ж э {enter}","{shift} / я ч с м и т ь б ю . {shift}",".com @ {space}"],shift:['Ё ! " № ; % : ? * ( ) _ + {bksp}',"{tab} Й Ц У К Е Н Г Ш Щ З Х Ъ /","{lock} Ф Ы В А П Р О Л Д Ж Э {enter}","{shift} | Я Ч С М И Т Ь Б Ю , {shift}",".com @ {space}"]}},P={layout:{default:["ё 1 2 3 4 5 6 7 8 9 0 ц э {bksp}","{tab} й i у к е н г ш щ з х ѳ \\","{lock} ф ы в ъ а п р о л д ж ѵ {enter}","{shift} / я ѣ ч с м и т ь б ю . {shift}",".com @ {space}"],shift:['Ё ! " № ; % : ? * ( ) Ц Э {bksp}',"{tab} Й I У К Е Н Г Ш Щ З Х Ѳ /","{lock} Ф Ы В Ъ А П Р О Л Д Ж Ѵ {enter}","{shift} | Я Ѣ Ч С М И Т Ь Б Ю , {shift}",".com @ {space}"]}},S={layout:{default:["` ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩ ٠ - = {bksp}","{tab} ق و ع ر ت ڀ ء ي ہ پ [ ]","{lock} ا س د ف گ ھ ج ک ل ؛ ، {enter}","{shift} ز ش چ ط ب ن م ڇ , . / {shift}",".com @ {space}"],shift:["~ ! @ # $ ٪ ^ & * ( ) _ + {bksp}","{tab} ﹰ ڌ ڪ ڙ ٽ ﹺ ﻻ ﺋ ڦ | { }","{lock} ٻ ص ڊ ؍ غ ح ض خ ۔ ܃ ״ {enter}","{shift} ذ ٿ ث ظ ٺ ٫ ـ < > ؟ {shift}",".com @ {space}"]}},$={layout:{default:["| 1 2 3 4 5 6 7 8 9 0 ' ¿ {bksp}","{tab} q w e r t y u i o p ́ +","{lock} a s d f g h j k l ñ { } {enter}","{shift} < z x c v b n m , . - {shift}",".com @ {space}"],shift:['° ! " # $ % & / ( ) = ? ¡ {bksp}',"{tab} Q W E R T Y U I O P ̈ *","{lock} A S D F G H J K L Ñ [ ] {enter}","{shift} > Z X C V B N M ; : _ {shift}",".com @ {space}"]}},C={layout:{default:["§ 1 2 3 4 5 6 7 8 9 0 + ´ {bksp}","{tab} q w e r t y u i o p å ¨","{lock} a s d f g h j k l ö ä ' {enter}","{shift} < z x c v b n m , . - {shift}",".com @ {space}"],shift:['° ! " # $ % & / ( ) = ? ` {bksp}',"{tab} Q W E R T Y U I O P Å ^","{lock} A S D F G H J K L Ö Ä * {enter}","{shift} > Z X C V B N M ; : _ {shift}",".com @ {space}"]}},T={layout:{default:["_ ๅ / - ภ ถ ุ ึ ค ฅ จ ข ช {bksp}","{tab} ๆ ไ ำ พ ะ ั ี ร น ย บ ล ฃ","{lock} ฟ ห ก ด เ ้ ่ า ส ว ง {enter}","{shift} ผ ป แ อ ิ ื ท ม ใ ฝ {shift}",".com @ {space}"],shift:["% + ๑ ๒ ๓ ๔ ู ฿ ๕ ๖ ๗ ๘ ๙ {bksp}",'{tab} ๐ " ฎ ฑ ธ ํ ๊ ณ ฯ ญ ฐ , ฅ',"{lock} ฤ ฆ ฏ โ ฌ ็ ๋ ษ ศ ซ . {enter}","{shift} ( ) ฉ ฮ ฺ ์ ? ฒ ฬ ฦ {shift}",".com @ {space}"]}},K={layout:{default:['" 1 2 3 4 5 6 7 8 9 0 * - # {bksp}',"{tab} q w e r t y u ı o p ğ ü [ ]","{lock} a s d f g h j k l ş i , {enter}","{shift} < z x c v b n m ö ç . | $ € {shift}",".com @ {space}"],shift:["é ! ' ^ + % & / ( ) = ? _ ~ {bksp}","{tab} Q W E R T Y U I O P Ğ Ü { }","{lock} A S D F G H J K L Ş İ ; {enter}","{shift} > Z X C V B N M Ö Ç : \\ ` ´ {shift}",".com @ {space}"]}},L={layout:{default:["' 1 2 3 4 5 6 7 8 9 0 - = {bksp}","{tab} й ц у к е н г ш щ з х ї ґ \\","{lock} ф і в а п р о л д ж є {enter}","{shift} / я ч с м и т ь б ю . {shift}",".com @ {space}"],shift:['₴ ! " № ; % : ? * ( ) _ + {bksp}',"{tab} Й Ц У К Е Н Г Ш Щ З Х Ї Ґ /","{lock} Ф І В А П Р О Л Д Ж Є {enter}","{shift} | Я Ч С М И Т Ь Б Ю , {shift}",".com @ {space}"]}},M={layout:{default:["` ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩ ٠ - = {bksp}","{tab} ق و ع ر ت ے ء ى ہ پ [ ]","{lock} ا س د ف گ ھ ج ک ل ؛ ، {enter}","{shift} ز ش چ ط ب ن م ۤ , . / {shift}",".com @ {space}"],shift:["~ ! @ # $ ٪ ^ & * ( ) _ + {bksp}","{tab} ﹰ ﹷ ﹹ ڑ ٹ ﹺ ﻻ ﺋ ة | { }","{lock} آ ص ڈ ؍ غ ح ض خ ۔ ܃ ״ {enter}","{shift} ذ ژ ث ظ ں ٫ ـ < > ؟ {shift}",".com @ {space}"]}},E={layout:{default:["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}","{tab} چ ۋ ې ر ت ي ۇ ڭ و پ ] [ /","{lock} ھ س د ا ە ى ق ك ل ؛ : {enter}","{shift} ز ش غ ۈ ب ن م ، . ئ {shift}",".com @ {space}"],shift:["~ ! @ # $ % ^ & * ) ( - + {bksp}","{tab} چ ۋ ې ر ت ي ۇ ڭ و » « \\","{lock} ھ س ژ ف گ خ ج ۆ ل ؛ | {enter}","{shift} ز ش غ ۈ ب ن م ‹ › ؟ {shift}",".com @ {space}"]}};function I(t,a){for(var e=0;e<a.length;e++){var s=a[e];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}function A(t,a,e){return a&&I(t.prototype,a),e&&I(t,e),Object.defineProperty(t,"prototype",{writable:!1}),t}function B(t,a,e){return a in t?Object.defineProperty(t,a,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[a]=e,t}var D=A((function t(){var a=this;!function(t,a){if(!(t instanceof a))throw new TypeError("Cannot call a class as a function")}(this,t),B(this,"layouts",{arabic:e,assamese:s,belarusian:i,bengali:n,burmese:o,chinese:c,czech:h,english:f,farsi:u,french:l,georgian:b,german:p,gilaki:r,greek:k,hebrew:g,hindi:m,hungarian:d,italian:y,japanese:z,kannada:j,korean:w,nigerian:v,norwegian:_,malayalam:x,polish:q,russian:O,russianOld:P,sindhi:S,spanish:$,swedish:C,thai:T,turkish:K,ukrainian:L,urdu:M,uyghur:E}),B(this,"get",(function(t){return t?a.layouts[t]:a.layouts}))}));return a}()}));

/***/ }),

/***/ "./node_modules/simple-keyboard/build/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/simple-keyboard/build/index.js ***!
  \*****************************************************/
/***/ (function(module) {

/*!
 * 
 *   simple-keyboard v3.4.89
 *   https://github.com/hodgef/simple-keyboard
 *
 *   Copyright (c) Francisco Hodge (https://github.com/hodgef) and project contributors.
 *
 *   This source code is licensed under the MIT license found in the
 *   LICENSE file in the root directory of this source tree.
 *
 */
!function(t,e){ true?module.exports=e():0}(this,(function(){return function(){var t={9662:function(t,e,n){var o=n(7854),r=n(614),i=n(6330),a=o.TypeError;t.exports=function(t){if(r(t))return t;throw a(i(t)+" is not a function")}},9483:function(t,e,n){var o=n(7854),r=n(4411),i=n(6330),a=o.TypeError;t.exports=function(t){if(r(t))return t;throw a(i(t)+" is not a constructor")}},6077:function(t,e,n){var o=n(7854),r=n(614),i=o.String,a=o.TypeError;t.exports=function(t){if("object"==typeof t||r(t))return t;throw a("Can't set "+i(t)+" as a prototype")}},1223:function(t,e,n){var o=n(5112),r=n(30),i=n(3070),a=o("unscopables"),s=Array.prototype;null==s[a]&&i.f(s,a,{configurable:!0,value:r(null)}),t.exports=function(t){s[a][t]=!0}},1530:function(t,e,n){"use strict";var o=n(8710).charAt;t.exports=function(t,e,n){return e+(n?o(t,e).length:1)}},9670:function(t,e,n){var o=n(7854),r=n(111),i=o.String,a=o.TypeError;t.exports=function(t){if(r(t))return t;throw a(i(t)+" is not an object")}},8533:function(t,e,n){"use strict";var o=n(2092).forEach,r=n(9341)("forEach");t.exports=r?[].forEach:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}},8457:function(t,e,n){"use strict";var o=n(7854),r=n(9974),i=n(6916),a=n(7908),s=n(3411),u=n(7659),c=n(4411),l=n(6244),f=n(6135),d=n(8554),p=n(1246),h=o.Array;t.exports=function(t){var e=a(t),n=c(this),o=arguments.length,v=o>1?arguments[1]:void 0,g=void 0!==v;g&&(v=r(v,o>2?arguments[2]:void 0));var y,m,b,x,w,E,O=p(e),S=0;if(!O||this==h&&u(O))for(y=l(e),m=n?new this(y):h(y);y>S;S++)E=g?v(e[S],S):e[S],f(m,S,E);else for(w=(x=d(e,O)).next,m=n?new this:[];!(b=i(w,x)).done;S++)E=g?s(x,v,[b.value,S],!0):b.value,f(m,S,E);return m.length=S,m}},1318:function(t,e,n){var o=n(5656),r=n(1400),i=n(6244),a=function(t){return function(e,n,a){var s,u=o(e),c=i(u),l=r(a,c);if(t&&n!=n){for(;c>l;)if((s=u[l++])!=s)return!0}else for(;c>l;l++)if((t||l in u)&&u[l]===n)return t||l||0;return!t&&-1}};t.exports={includes:a(!0),indexOf:a(!1)}},2092:function(t,e,n){var o=n(9974),r=n(1702),i=n(8361),a=n(7908),s=n(6244),u=n(5417),c=r([].push),l=function(t){var e=1==t,n=2==t,r=3==t,l=4==t,f=6==t,d=7==t,p=5==t||f;return function(h,v,g,y){for(var m,b,x=a(h),w=i(x),E=o(v,g),O=s(w),S=0,k=y||u,I=e?k(h,O):n||d?k(h,0):void 0;O>S;S++)if((p||S in w)&&(b=E(m=w[S],S,x),t))if(e)I[S]=b;else if(b)switch(t){case 3:return!0;case 5:return m;case 6:return S;case 2:c(I,m)}else switch(t){case 4:return!1;case 7:c(I,m)}return f?-1:r||l?l:I}};t.exports={forEach:l(0),map:l(1),filter:l(2),some:l(3),every:l(4),find:l(5),findIndex:l(6),filterReject:l(7)}},1194:function(t,e,n){var o=n(7293),r=n(5112),i=n(7392),a=r("species");t.exports=function(t){return i>=51||!o((function(){var e=[];return(e.constructor={})[a]=function(){return{foo:1}},1!==e[t](Boolean).foo}))}},9341:function(t,e,n){"use strict";var o=n(7293);t.exports=function(t,e){var n=[][t];return!!n&&o((function(){n.call(null,e||function(){return 1},1)}))}},3671:function(t,e,n){var o=n(7854),r=n(9662),i=n(7908),a=n(8361),s=n(6244),u=o.TypeError,c=function(t){return function(e,n,o,c){r(n);var l=i(e),f=a(l),d=s(l),p=t?d-1:0,h=t?-1:1;if(o<2)for(;;){if(p in f){c=f[p],p+=h;break}if(p+=h,t?p<0:d<=p)throw u("Reduce of empty array with no initial value")}for(;t?p>=0:d>p;p+=h)p in f&&(c=n(c,f[p],p,l));return c}};t.exports={left:c(!1),right:c(!0)}},1589:function(t,e,n){var o=n(7854),r=n(1400),i=n(6244),a=n(6135),s=o.Array,u=Math.max;t.exports=function(t,e,n){for(var o=i(t),c=r(e,o),l=r(void 0===n?o:n,o),f=s(u(l-c,0)),d=0;c<l;c++,d++)a(f,d,t[c]);return f.length=d,f}},206:function(t,e,n){var o=n(1702);t.exports=o([].slice)},4362:function(t,e,n){var o=n(1589),r=Math.floor,i=function(t,e){var n=t.length,u=r(n/2);return n<8?a(t,e):s(t,i(o(t,0,u),e),i(o(t,u),e),e)},a=function(t,e){for(var n,o,r=t.length,i=1;i<r;){for(o=i,n=t[i];o&&e(t[o-1],n)>0;)t[o]=t[--o];o!==i++&&(t[o]=n)}return t},s=function(t,e,n,o){for(var r=e.length,i=n.length,a=0,s=0;a<r||s<i;)t[a+s]=a<r&&s<i?o(e[a],n[s])<=0?e[a++]:n[s++]:a<r?e[a++]:n[s++];return t};t.exports=i},7475:function(t,e,n){var o=n(7854),r=n(3157),i=n(4411),a=n(111),s=n(5112)("species"),u=o.Array;t.exports=function(t){var e;return r(t)&&(e=t.constructor,(i(e)&&(e===u||r(e.prototype))||a(e)&&null===(e=e[s]))&&(e=void 0)),void 0===e?u:e}},5417:function(t,e,n){var o=n(7475);t.exports=function(t,e){return new(o(t))(0===e?0:e)}},3411:function(t,e,n){var o=n(9670),r=n(9212);t.exports=function(t,e,n,i){try{return i?e(o(n)[0],n[1]):e(n)}catch(e){r(t,"throw",e)}}},7072:function(t,e,n){var o=n(5112)("iterator"),r=!1;try{var i=0,a={next:function(){return{done:!!i++}},return:function(){r=!0}};a[o]=function(){return this},Array.from(a,(function(){throw 2}))}catch(t){}t.exports=function(t,e){if(!e&&!r)return!1;var n=!1;try{var i={};i[o]=function(){return{next:function(){return{done:n=!0}}}},t(i)}catch(t){}return n}},4326:function(t,e,n){var o=n(1702),r=o({}.toString),i=o("".slice);t.exports=function(t){return i(r(t),8,-1)}},648:function(t,e,n){var o=n(7854),r=n(1694),i=n(614),a=n(4326),s=n(5112)("toStringTag"),u=o.Object,c="Arguments"==a(function(){return arguments}());t.exports=r?a:function(t){var e,n,o;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=function(t,e){try{return t[e]}catch(t){}}(e=u(t),s))?n:c?a(e):"Object"==(o=a(e))&&i(e.callee)?"Arguments":o}},9920:function(t,e,n){var o=n(2597),r=n(3887),i=n(1236),a=n(3070);t.exports=function(t,e,n){for(var s=r(e),u=a.f,c=i.f,l=0;l<s.length;l++){var f=s[l];o(t,f)||n&&o(n,f)||u(t,f,c(e,f))}}},4964:function(t,e,n){var o=n(5112)("match");t.exports=function(t){var e=/./;try{"/./"[t](e)}catch(n){try{return e[o]=!1,"/./"[t](e)}catch(t){}}return!1}},8544:function(t,e,n){var o=n(7293);t.exports=!o((function(){function t(){}return t.prototype.constructor=null,Object.getPrototypeOf(new t)!==t.prototype}))},4994:function(t,e,n){"use strict";var o=n(3383).IteratorPrototype,r=n(30),i=n(9114),a=n(8003),s=n(7497),u=function(){return this};t.exports=function(t,e,n,c){var l=e+" Iterator";return t.prototype=r(o,{next:i(+!c,n)}),a(t,l,!1,!0),s[l]=u,t}},8880:function(t,e,n){var o=n(9781),r=n(3070),i=n(9114);t.exports=o?function(t,e,n){return r.f(t,e,i(1,n))}:function(t,e,n){return t[e]=n,t}},9114:function(t){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},6135:function(t,e,n){"use strict";var o=n(4948),r=n(3070),i=n(9114);t.exports=function(t,e,n){var a=o(e);a in t?r.f(t,a,i(0,n)):t[a]=n}},654:function(t,e,n){"use strict";var o=n(2109),r=n(6916),i=n(1913),a=n(6530),s=n(614),u=n(4994),c=n(9518),l=n(7674),f=n(8003),d=n(8880),p=n(1320),h=n(5112),v=n(7497),g=n(3383),y=a.PROPER,m=a.CONFIGURABLE,b=g.IteratorPrototype,x=g.BUGGY_SAFARI_ITERATORS,w=h("iterator"),E="keys",O="values",S="entries",k=function(){return this};t.exports=function(t,e,n,a,h,g,I){u(n,e,a);var C,P,A,M=function(t){if(t===h&&L)return L;if(!x&&t in j)return j[t];switch(t){case E:case O:case S:return function(){return new n(this,t)}}return function(){return new n(this)}},T=e+" Iterator",D=!1,j=t.prototype,N=j[w]||j["@@iterator"]||h&&j[h],L=!x&&N||M(h),R="Array"==e&&j.entries||N;if(R&&(C=c(R.call(new t)))!==Object.prototype&&C.next&&(i||c(C)===b||(l?l(C,b):s(C[w])||p(C,w,k)),f(C,T,!0,!0),i&&(v[T]=k)),y&&h==O&&N&&N.name!==O&&(!i&&m?d(j,"name",O):(D=!0,L=function(){return r(N,this)})),h)if(P={values:M(O),keys:g?L:M(E),entries:M(S)},I)for(A in P)(x||D||!(A in j))&&p(j,A,P[A]);else o({target:e,proto:!0,forced:x||D},P);return i&&!I||j[w]===L||p(j,w,L,{name:h}),v[e]=L,P}},7235:function(t,e,n){var o=n(857),r=n(2597),i=n(6061),a=n(3070).f;t.exports=function(t){var e=o.Symbol||(o.Symbol={});r(e,t)||a(e,t,{value:i.f(t)})}},9781:function(t,e,n){var o=n(7293);t.exports=!o((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]}))},317:function(t,e,n){var o=n(7854),r=n(111),i=o.document,a=r(i)&&r(i.createElement);t.exports=function(t){return a?i.createElement(t):{}}},8324:function(t){t.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}},8509:function(t,e,n){var o=n(317)("span").classList,r=o&&o.constructor&&o.constructor.prototype;t.exports=r===Object.prototype?void 0:r},8886:function(t,e,n){var o=n(8113).match(/firefox\/(\d+)/i);t.exports=!!o&&+o[1]},256:function(t,e,n){var o=n(8113);t.exports=/MSIE|Trident/.test(o)},5268:function(t,e,n){var o=n(4326),r=n(7854);t.exports="process"==o(r.process)},8113:function(t,e,n){var o=n(5005);t.exports=o("navigator","userAgent")||""},7392:function(t,e,n){var o,r,i=n(7854),a=n(8113),s=i.process,u=i.Deno,c=s&&s.versions||u&&u.version,l=c&&c.v8;l&&(r=(o=l.split("."))[0]>0&&o[0]<4?1:+(o[0]+o[1])),!r&&a&&(!(o=a.match(/Edge\/(\d+)/))||o[1]>=74)&&(o=a.match(/Chrome\/(\d+)/))&&(r=+o[1]),t.exports=r},8008:function(t,e,n){var o=n(8113).match(/AppleWebKit\/(\d+)\./);t.exports=!!o&&+o[1]},748:function(t){t.exports=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"]},2109:function(t,e,n){var o=n(7854),r=n(1236).f,i=n(8880),a=n(1320),s=n(3505),u=n(9920),c=n(4705);t.exports=function(t,e){var n,l,f,d,p,h=t.target,v=t.global,g=t.stat;if(n=v?o:g?o[h]||s(h,{}):(o[h]||{}).prototype)for(l in e){if(d=e[l],f=t.noTargetGet?(p=r(n,l))&&p.value:n[l],!c(v?l:h+(g?".":"#")+l,t.forced)&&void 0!==f){if(typeof d==typeof f)continue;u(d,f)}(t.sham||f&&f.sham)&&i(d,"sham",!0),a(n,l,d,t)}}},7293:function(t){t.exports=function(t){try{return!!t()}catch(t){return!0}}},7007:function(t,e,n){"use strict";n(4916);var o=n(1702),r=n(1320),i=n(2261),a=n(7293),s=n(5112),u=n(8880),c=s("species"),l=RegExp.prototype;t.exports=function(t,e,n,f){var d=s(t),p=!a((function(){var e={};return e[d]=function(){return 7},7!=""[t](e)})),h=p&&!a((function(){var e=!1,n=/a/;return"split"===t&&((n={}).constructor={},n.constructor[c]=function(){return n},n.flags="",n[d]=/./[d]),n.exec=function(){return e=!0,null},n[d](""),!e}));if(!p||!h||n){var v=o(/./[d]),g=e(d,""[t],(function(t,e,n,r,a){var s=o(t),u=e.exec;return u===i||u===l.exec?p&&!a?{done:!0,value:v(e,n,r)}:{done:!0,value:s(n,e,r)}:{done:!1}}));r(String.prototype,t,g[0]),r(l,d,g[1])}f&&u(l[d],"sham",!0)}},2104:function(t,e,n){var o=n(4374),r=Function.prototype,i=r.apply,a=r.call;t.exports="object"==typeof Reflect&&Reflect.apply||(o?a.bind(i):function(){return a.apply(i,arguments)})},9974:function(t,e,n){var o=n(1702),r=n(9662),i=n(4374),a=o(o.bind);t.exports=function(t,e){return r(t),void 0===e?t:i?a(t,e):function(){return t.apply(e,arguments)}}},4374:function(t,e,n){var o=n(7293);t.exports=!o((function(){var t=function(){}.bind();return"function"!=typeof t||t.hasOwnProperty("prototype")}))},6916:function(t,e,n){var o=n(4374),r=Function.prototype.call;t.exports=o?r.bind(r):function(){return r.apply(r,arguments)}},6530:function(t,e,n){var o=n(9781),r=n(2597),i=Function.prototype,a=o&&Object.getOwnPropertyDescriptor,s=r(i,"name"),u=s&&"something"===function(){}.name,c=s&&(!o||o&&a(i,"name").configurable);t.exports={EXISTS:s,PROPER:u,CONFIGURABLE:c}},1702:function(t,e,n){var o=n(4374),r=Function.prototype,i=r.bind,a=r.call,s=o&&i.bind(a,a);t.exports=o?function(t){return t&&s(t)}:function(t){return t&&function(){return a.apply(t,arguments)}}},5005:function(t,e,n){var o=n(7854),r=n(614),i=function(t){return r(t)?t:void 0};t.exports=function(t,e){return arguments.length<2?i(o[t]):o[t]&&o[t][e]}},1246:function(t,e,n){var o=n(648),r=n(8173),i=n(7497),a=n(5112)("iterator");t.exports=function(t){if(null!=t)return r(t,a)||r(t,"@@iterator")||i[o(t)]}},8554:function(t,e,n){var o=n(7854),r=n(6916),i=n(9662),a=n(9670),s=n(6330),u=n(1246),c=o.TypeError;t.exports=function(t,e){var n=arguments.length<2?u(t):e;if(i(n))return a(r(n,t));throw c(s(t)+" is not iterable")}},8173:function(t,e,n){var o=n(9662);t.exports=function(t,e){var n=t[e];return null==n?void 0:o(n)}},647:function(t,e,n){var o=n(1702),r=n(7908),i=Math.floor,a=o("".charAt),s=o("".replace),u=o("".slice),c=/\$([$&'`]|\d{1,2}|<[^>]*>)/g,l=/\$([$&'`]|\d{1,2})/g;t.exports=function(t,e,n,o,f,d){var p=n+t.length,h=o.length,v=l;return void 0!==f&&(f=r(f),v=c),s(d,v,(function(r,s){var c;switch(a(s,0)){case"$":return"$";case"&":return t;case"`":return u(e,0,n);case"'":return u(e,p);case"<":c=f[u(s,1,-1)];break;default:var l=+s;if(0===l)return r;if(l>h){var d=i(l/10);return 0===d?r:d<=h?void 0===o[d-1]?a(s,1):o[d-1]+a(s,1):r}c=o[l-1]}return void 0===c?"":c}))}},7854:function(t,e,n){var o=function(t){return t&&t.Math==Math&&t};t.exports=o("object"==typeof globalThis&&globalThis)||o("object"==typeof window&&window)||o("object"==typeof self&&self)||o("object"==typeof n.g&&n.g)||function(){return this}()||Function("return this")()},2597:function(t,e,n){var o=n(1702),r=n(7908),i=o({}.hasOwnProperty);t.exports=Object.hasOwn||function(t,e){return i(r(t),e)}},3501:function(t){t.exports={}},490:function(t,e,n){var o=n(5005);t.exports=o("document","documentElement")},4664:function(t,e,n){var o=n(9781),r=n(7293),i=n(317);t.exports=!o&&!r((function(){return 7!=Object.defineProperty(i("div"),"a",{get:function(){return 7}}).a}))},8361:function(t,e,n){var o=n(7854),r=n(1702),i=n(7293),a=n(4326),s=o.Object,u=r("".split);t.exports=i((function(){return!s("z").propertyIsEnumerable(0)}))?function(t){return"String"==a(t)?u(t,""):s(t)}:s},9587:function(t,e,n){var o=n(614),r=n(111),i=n(7674);t.exports=function(t,e,n){var a,s;return i&&o(a=e.constructor)&&a!==n&&r(s=a.prototype)&&s!==n.prototype&&i(t,s),t}},2788:function(t,e,n){var o=n(1702),r=n(614),i=n(5465),a=o(Function.toString);r(i.inspectSource)||(i.inspectSource=function(t){return a(t)}),t.exports=i.inspectSource},9909:function(t,e,n){var o,r,i,a=n(8536),s=n(7854),u=n(1702),c=n(111),l=n(8880),f=n(2597),d=n(5465),p=n(6200),h=n(3501),v="Object already initialized",g=s.TypeError,y=s.WeakMap;if(a||d.state){var m=d.state||(d.state=new y),b=u(m.get),x=u(m.has),w=u(m.set);o=function(t,e){if(x(m,t))throw new g(v);return e.facade=t,w(m,t,e),e},r=function(t){return b(m,t)||{}},i=function(t){return x(m,t)}}else{var E=p("state");h[E]=!0,o=function(t,e){if(f(t,E))throw new g(v);return e.facade=t,l(t,E,e),e},r=function(t){return f(t,E)?t[E]:{}},i=function(t){return f(t,E)}}t.exports={set:o,get:r,has:i,enforce:function(t){return i(t)?r(t):o(t,{})},getterFor:function(t){return function(e){var n;if(!c(e)||(n=r(e)).type!==t)throw g("Incompatible receiver, "+t+" required");return n}}}},7659:function(t,e,n){var o=n(5112),r=n(7497),i=o("iterator"),a=Array.prototype;t.exports=function(t){return void 0!==t&&(r.Array===t||a[i]===t)}},3157:function(t,e,n){var o=n(4326);t.exports=Array.isArray||function(t){return"Array"==o(t)}},614:function(t){t.exports=function(t){return"function"==typeof t}},4411:function(t,e,n){var o=n(1702),r=n(7293),i=n(614),a=n(648),s=n(5005),u=n(2788),c=function(){},l=[],f=s("Reflect","construct"),d=/^\s*(?:class|function)\b/,p=o(d.exec),h=!d.exec(c),v=function(t){if(!i(t))return!1;try{return f(c,l,t),!0}catch(t){return!1}},g=function(t){if(!i(t))return!1;switch(a(t)){case"AsyncFunction":case"GeneratorFunction":case"AsyncGeneratorFunction":return!1}try{return h||!!p(d,u(t))}catch(t){return!0}};g.sham=!0,t.exports=!f||r((function(){var t;return v(v.call)||!v(Object)||!v((function(){t=!0}))||t}))?g:v},4705:function(t,e,n){var o=n(7293),r=n(614),i=/#|\.prototype\./,a=function(t,e){var n=u[s(t)];return n==l||n!=c&&(r(e)?o(e):!!e)},s=a.normalize=function(t){return String(t).replace(i,".").toLowerCase()},u=a.data={},c=a.NATIVE="N",l=a.POLYFILL="P";t.exports=a},5988:function(t,e,n){var o=n(111),r=Math.floor;t.exports=Number.isInteger||function(t){return!o(t)&&isFinite(t)&&r(t)===t}},111:function(t,e,n){var o=n(614);t.exports=function(t){return"object"==typeof t?null!==t:o(t)}},1913:function(t){t.exports=!1},7850:function(t,e,n){var o=n(111),r=n(4326),i=n(5112)("match");t.exports=function(t){var e;return o(t)&&(void 0!==(e=t[i])?!!e:"RegExp"==r(t))}},2190:function(t,e,n){var o=n(7854),r=n(5005),i=n(614),a=n(7976),s=n(3307),u=o.Object;t.exports=s?function(t){return"symbol"==typeof t}:function(t){var e=r("Symbol");return i(e)&&a(e.prototype,u(t))}},9212:function(t,e,n){var o=n(6916),r=n(9670),i=n(8173);t.exports=function(t,e,n){var a,s;r(t);try{if(!(a=i(t,"return"))){if("throw"===e)throw n;return n}a=o(a,t)}catch(t){s=!0,a=t}if("throw"===e)throw n;if(s)throw a;return r(a),n}},3383:function(t,e,n){"use strict";var o,r,i,a=n(7293),s=n(614),u=n(30),c=n(9518),l=n(1320),f=n(5112),d=n(1913),p=f("iterator"),h=!1;[].keys&&("next"in(i=[].keys())?(r=c(c(i)))!==Object.prototype&&(o=r):h=!0),null==o||a((function(){var t={};return o[p].call(t)!==t}))?o={}:d&&(o=u(o)),s(o[p])||l(o,p,(function(){return this})),t.exports={IteratorPrototype:o,BUGGY_SAFARI_ITERATORS:h}},7497:function(t){t.exports={}},6244:function(t,e,n){var o=n(7466);t.exports=function(t){return o(t.length)}},735:function(t,e,n){var o=n(133);t.exports=o&&!!Symbol.for&&!!Symbol.keyFor},133:function(t,e,n){var o=n(7392),r=n(7293);t.exports=!!Object.getOwnPropertySymbols&&!r((function(){var t=Symbol();return!String(t)||!(Object(t)instanceof Symbol)||!Symbol.sham&&o&&o<41}))},8536:function(t,e,n){var o=n(7854),r=n(614),i=n(2788),a=o.WeakMap;t.exports=r(a)&&/native code/.test(i(a))},3929:function(t,e,n){var o=n(7854),r=n(7850),i=o.TypeError;t.exports=function(t){if(r(t))throw i("The method doesn't accept regular expressions");return t}},1574:function(t,e,n){"use strict";var o=n(9781),r=n(1702),i=n(6916),a=n(7293),s=n(1956),u=n(5181),c=n(5296),l=n(7908),f=n(8361),d=Object.assign,p=Object.defineProperty,h=r([].concat);t.exports=!d||a((function(){if(o&&1!==d({b:1},d(p({},"a",{enumerable:!0,get:function(){p(this,"b",{value:3,enumerable:!1})}}),{b:2})).b)return!0;var t={},e={},n=Symbol(),r="abcdefghijklmnopqrst";return t[n]=7,r.split("").forEach((function(t){e[t]=t})),7!=d({},t)[n]||s(d({},e)).join("")!=r}))?function(t,e){for(var n=l(t),r=arguments.length,a=1,d=u.f,p=c.f;r>a;)for(var v,g=f(arguments[a++]),y=d?h(s(g),d(g)):s(g),m=y.length,b=0;m>b;)v=y[b++],o&&!i(p,g,v)||(n[v]=g[v]);return n}:d},30:function(t,e,n){var o,r=n(9670),i=n(6048),a=n(748),s=n(3501),u=n(490),c=n(317),l=n(6200),f=l("IE_PROTO"),d=function(){},p=function(t){return"<script>"+t+"</"+"script>"},h=function(t){t.write(p("")),t.close();var e=t.parentWindow.Object;return t=null,e},v=function(){try{o=new ActiveXObject("htmlfile")}catch(t){}var t,e;v="undefined"!=typeof document?document.domain&&o?h(o):((e=c("iframe")).style.display="none",u.appendChild(e),e.src=String("javascript:"),(t=e.contentWindow.document).open(),t.write(p("document.F=Object")),t.close(),t.F):h(o);for(var n=a.length;n--;)delete v.prototype[a[n]];return v()};s[f]=!0,t.exports=Object.create||function(t,e){var n;return null!==t?(d.prototype=r(t),n=new d,d.prototype=null,n[f]=t):n=v(),void 0===e?n:i.f(n,e)}},6048:function(t,e,n){var o=n(9781),r=n(3353),i=n(3070),a=n(9670),s=n(5656),u=n(1956);e.f=o&&!r?Object.defineProperties:function(t,e){a(t);for(var n,o=s(e),r=u(e),c=r.length,l=0;c>l;)i.f(t,n=r[l++],o[n]);return t}},3070:function(t,e,n){var o=n(7854),r=n(9781),i=n(4664),a=n(3353),s=n(9670),u=n(4948),c=o.TypeError,l=Object.defineProperty,f=Object.getOwnPropertyDescriptor,d="enumerable",p="configurable",h="writable";e.f=r?a?function(t,e,n){if(s(t),e=u(e),s(n),"function"==typeof t&&"prototype"===e&&"value"in n&&h in n&&!n.writable){var o=f(t,e);o&&o.writable&&(t[e]=n.value,n={configurable:p in n?n.configurable:o.configurable,enumerable:d in n?n.enumerable:o.enumerable,writable:!1})}return l(t,e,n)}:l:function(t,e,n){if(s(t),e=u(e),s(n),i)try{return l(t,e,n)}catch(t){}if("get"in n||"set"in n)throw c("Accessors not supported");return"value"in n&&(t[e]=n.value),t}},1236:function(t,e,n){var o=n(9781),r=n(6916),i=n(5296),a=n(9114),s=n(5656),u=n(4948),c=n(2597),l=n(4664),f=Object.getOwnPropertyDescriptor;e.f=o?f:function(t,e){if(t=s(t),e=u(e),l)try{return f(t,e)}catch(t){}if(c(t,e))return a(!r(i.f,t,e),t[e])}},1156:function(t,e,n){var o=n(4326),r=n(5656),i=n(8006).f,a=n(1589),s="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];t.exports.f=function(t){return s&&"Window"==o(t)?function(t){try{return i(t)}catch(t){return a(s)}}(t):i(r(t))}},8006:function(t,e,n){var o=n(6324),r=n(748).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return o(t,r)}},5181:function(t,e){e.f=Object.getOwnPropertySymbols},9518:function(t,e,n){var o=n(7854),r=n(2597),i=n(614),a=n(7908),s=n(6200),u=n(8544),c=s("IE_PROTO"),l=o.Object,f=l.prototype;t.exports=u?l.getPrototypeOf:function(t){var e=a(t);if(r(e,c))return e[c];var n=e.constructor;return i(n)&&e instanceof n?n.prototype:e instanceof l?f:null}},7976:function(t,e,n){var o=n(1702);t.exports=o({}.isPrototypeOf)},6324:function(t,e,n){var o=n(1702),r=n(2597),i=n(5656),a=n(1318).indexOf,s=n(3501),u=o([].push);t.exports=function(t,e){var n,o=i(t),c=0,l=[];for(n in o)!r(s,n)&&r(o,n)&&u(l,n);for(;e.length>c;)r(o,n=e[c++])&&(~a(l,n)||u(l,n));return l}},1956:function(t,e,n){var o=n(6324),r=n(748);t.exports=Object.keys||function(t){return o(t,r)}},5296:function(t,e){"use strict";var n={}.propertyIsEnumerable,o=Object.getOwnPropertyDescriptor,r=o&&!n.call({1:2},1);e.f=r?function(t){var e=o(this,t);return!!e&&e.enumerable}:n},9026:function(t,e,n){"use strict";var o=n(1913),r=n(7854),i=n(7293),a=n(8008);t.exports=o||!i((function(){if(!(a&&a<535)){var t=Math.random();__defineSetter__.call(null,t,(function(){})),delete r[t]}}))},7674:function(t,e,n){var o=n(1702),r=n(9670),i=n(6077);t.exports=Object.setPrototypeOf||("__proto__"in{}?function(){var t,e=!1,n={};try{(t=o(Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set))(n,[]),e=n instanceof Array}catch(t){}return function(n,o){return r(n),i(o),e?t(n,o):n.__proto__=o,n}}():void 0)},288:function(t,e,n){"use strict";var o=n(1694),r=n(648);t.exports=o?{}.toString:function(){return"[object "+r(this)+"]"}},2140:function(t,e,n){var o=n(7854),r=n(6916),i=n(614),a=n(111),s=o.TypeError;t.exports=function(t,e){var n,o;if("string"===e&&i(n=t.toString)&&!a(o=r(n,t)))return o;if(i(n=t.valueOf)&&!a(o=r(n,t)))return o;if("string"!==e&&i(n=t.toString)&&!a(o=r(n,t)))return o;throw s("Can't convert object to primitive value")}},3887:function(t,e,n){var o=n(5005),r=n(1702),i=n(8006),a=n(5181),s=n(9670),u=r([].concat);t.exports=o("Reflect","ownKeys")||function(t){var e=i.f(s(t)),n=a.f;return n?u(e,n(t)):e}},857:function(t,e,n){var o=n(7854);t.exports=o},2626:function(t,e,n){var o=n(3070).f;t.exports=function(t,e,n){n in t||o(t,n,{configurable:!0,get:function(){return e[n]},set:function(t){e[n]=t}})}},1320:function(t,e,n){var o=n(7854),r=n(614),i=n(2597),a=n(8880),s=n(3505),u=n(2788),c=n(9909),l=n(6530).CONFIGURABLE,f=c.get,d=c.enforce,p=String(String).split("String");(t.exports=function(t,e,n,u){var c,f=!!u&&!!u.unsafe,h=!!u&&!!u.enumerable,v=!!u&&!!u.noTargetGet,g=u&&void 0!==u.name?u.name:e;r(n)&&("Symbol("===String(g).slice(0,7)&&(g="["+String(g).replace(/^Symbol\(([^)]*)\)/,"$1")+"]"),(!i(n,"name")||l&&n.name!==g)&&a(n,"name",g),(c=d(n)).source||(c.source=p.join("string"==typeof g?g:""))),t!==o?(f?!v&&t[e]&&(h=!0):delete t[e],h?t[e]=n:a(t,e,n)):h?t[e]=n:s(e,n)})(Function.prototype,"toString",(function(){return r(this)&&f(this).source||u(this)}))},7651:function(t,e,n){var o=n(7854),r=n(6916),i=n(9670),a=n(614),s=n(4326),u=n(2261),c=o.TypeError;t.exports=function(t,e){var n=t.exec;if(a(n)){var o=r(n,t,e);return null!==o&&i(o),o}if("RegExp"===s(t))return r(u,t,e);throw c("RegExp#exec called on incompatible receiver")}},2261:function(t,e,n){"use strict";var o,r,i=n(6916),a=n(1702),s=n(1340),u=n(7066),c=n(2999),l=n(2309),f=n(30),d=n(9909).get,p=n(9441),h=n(7168),v=l("native-string-replace",String.prototype.replace),g=RegExp.prototype.exec,y=g,m=a("".charAt),b=a("".indexOf),x=a("".replace),w=a("".slice),E=(r=/b*/g,i(g,o=/a/,"a"),i(g,r,"a"),0!==o.lastIndex||0!==r.lastIndex),O=c.BROKEN_CARET,S=void 0!==/()??/.exec("")[1];(E||S||O||p||h)&&(y=function(t){var e,n,o,r,a,c,l,p=this,h=d(p),k=s(t),I=h.raw;if(I)return I.lastIndex=p.lastIndex,e=i(y,I,k),p.lastIndex=I.lastIndex,e;var C=h.groups,P=O&&p.sticky,A=i(u,p),M=p.source,T=0,D=k;if(P&&(A=x(A,"y",""),-1===b(A,"g")&&(A+="g"),D=w(k,p.lastIndex),p.lastIndex>0&&(!p.multiline||p.multiline&&"\n"!==m(k,p.lastIndex-1))&&(M="(?: "+M+")",D=" "+D,T++),n=new RegExp("^(?:"+M+")",A)),S&&(n=new RegExp("^"+M+"$(?!\\s)",A)),E&&(o=p.lastIndex),r=i(g,P?n:p,D),P?r?(r.input=w(r.input,T),r[0]=w(r[0],T),r.index=p.lastIndex,p.lastIndex+=r[0].length):p.lastIndex=0:E&&r&&(p.lastIndex=p.global?r.index+r[0].length:o),S&&r&&r.length>1&&i(v,r[0],n,(function(){for(a=1;a<arguments.length-2;a++)void 0===arguments[a]&&(r[a]=void 0)})),r&&C)for(r.groups=c=f(null),a=0;a<C.length;a++)c[(l=C[a])[0]]=r[l[1]];return r}),t.exports=y},7066:function(t,e,n){"use strict";var o=n(9670);t.exports=function(){var t=o(this),e="";return t.hasIndices&&(e+="d"),t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.dotAll&&(e+="s"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e}},4706:function(t,e,n){var o=n(6916),r=n(2597),i=n(7976),a=n(7066),s=RegExp.prototype;t.exports=function(t){var e=t.flags;return void 0!==e||"flags"in s||r(t,"flags")||!i(s,t)?e:o(a,t)}},2999:function(t,e,n){var o=n(7293),r=n(7854).RegExp,i=o((function(){var t=r("a","y");return t.lastIndex=2,null!=t.exec("abcd")})),a=i||o((function(){return!r("a","y").sticky})),s=i||o((function(){var t=r("^r","gy");return t.lastIndex=2,null!=t.exec("str")}));t.exports={BROKEN_CARET:s,MISSED_STICKY:a,UNSUPPORTED_Y:i}},9441:function(t,e,n){var o=n(7293),r=n(7854).RegExp;t.exports=o((function(){var t=r(".","s");return!(t.dotAll&&t.exec("\n")&&"s"===t.flags)}))},7168:function(t,e,n){var o=n(7293),r=n(7854).RegExp;t.exports=o((function(){var t=r("(?<a>b)","g");return"b"!==t.exec("b").groups.a||"bc"!=="b".replace(t,"$<a>c")}))},4488:function(t,e,n){var o=n(7854).TypeError;t.exports=function(t){if(null==t)throw o("Can't call method on "+t);return t}},3505:function(t,e,n){var o=n(7854),r=Object.defineProperty;t.exports=function(t,e){try{r(o,t,{value:e,configurable:!0,writable:!0})}catch(n){o[t]=e}return e}},6340:function(t,e,n){"use strict";var o=n(5005),r=n(3070),i=n(5112),a=n(9781),s=i("species");t.exports=function(t){var e=o(t),n=r.f;a&&e&&!e[s]&&n(e,s,{configurable:!0,get:function(){return this}})}},8003:function(t,e,n){var o=n(3070).f,r=n(2597),i=n(5112)("toStringTag");t.exports=function(t,e,n){t&&!n&&(t=t.prototype),t&&!r(t,i)&&o(t,i,{configurable:!0,value:e})}},6200:function(t,e,n){var o=n(2309),r=n(9711),i=o("keys");t.exports=function(t){return i[t]||(i[t]=r(t))}},5465:function(t,e,n){var o=n(7854),r=n(3505),i="__core-js_shared__",a=o[i]||r(i,{});t.exports=a},2309:function(t,e,n){var o=n(1913),r=n(5465);(t.exports=function(t,e){return r[t]||(r[t]=void 0!==e?e:{})})("versions",[]).push({version:"3.22.2",mode:o?"pure":"global",copyright:"© 2014-2022 Denis Pushkarev (zloirock.ru)",license:"https://github.com/zloirock/core-js/blob/v3.22.2/LICENSE",source:"https://github.com/zloirock/core-js"})},6707:function(t,e,n){var o=n(9670),r=n(9483),i=n(5112)("species");t.exports=function(t,e){var n,a=o(t).constructor;return void 0===a||null==(n=o(a)[i])?e:r(n)}},8710:function(t,e,n){var o=n(1702),r=n(9303),i=n(1340),a=n(4488),s=o("".charAt),u=o("".charCodeAt),c=o("".slice),l=function(t){return function(e,n){var o,l,f=i(a(e)),d=r(n),p=f.length;return d<0||d>=p?t?"":void 0:(o=u(f,d))<55296||o>56319||d+1===p||(l=u(f,d+1))<56320||l>57343?t?s(f,d):o:t?c(f,d,d+2):l-56320+(o-55296<<10)+65536}};t.exports={codeAt:l(!1),charAt:l(!0)}},6091:function(t,e,n){var o=n(6530).PROPER,r=n(7293),i=n(1361);t.exports=function(t){return r((function(){return!!i[t]()||"​᠎"!=="​᠎"[t]()||o&&i[t].name!==t}))}},3111:function(t,e,n){var o=n(1702),r=n(4488),i=n(1340),a=n(1361),s=o("".replace),u="["+a+"]",c=RegExp("^"+u+u+"*"),l=RegExp(u+u+"*$"),f=function(t){return function(e){var n=i(r(e));return 1&t&&(n=s(n,c,"")),2&t&&(n=s(n,l,"")),n}};t.exports={start:f(1),end:f(2),trim:f(3)}},6532:function(t,e,n){var o=n(6916),r=n(5005),i=n(5112),a=n(1320);t.exports=function(){var t=r("Symbol"),e=t&&t.prototype,n=e&&e.valueOf,s=i("toPrimitive");e&&!e[s]&&a(e,s,(function(t){return o(n,this)}))}},863:function(t,e,n){var o=n(1702);t.exports=o(1..valueOf)},1400:function(t,e,n){var o=n(9303),r=Math.max,i=Math.min;t.exports=function(t,e){var n=o(t);return n<0?r(n+e,0):i(n,e)}},5656:function(t,e,n){var o=n(8361),r=n(4488);t.exports=function(t){return o(r(t))}},9303:function(t){var e=Math.ceil,n=Math.floor;t.exports=function(t){var o=+t;return o!=o||0===o?0:(o>0?n:e)(o)}},7466:function(t,e,n){var o=n(9303),r=Math.min;t.exports=function(t){return t>0?r(o(t),9007199254740991):0}},7908:function(t,e,n){var o=n(7854),r=n(4488),i=o.Object;t.exports=function(t){return i(r(t))}},7593:function(t,e,n){var o=n(7854),r=n(6916),i=n(111),a=n(2190),s=n(8173),u=n(2140),c=n(5112),l=o.TypeError,f=c("toPrimitive");t.exports=function(t,e){if(!i(t)||a(t))return t;var n,o=s(t,f);if(o){if(void 0===e&&(e="default"),n=r(o,t,e),!i(n)||a(n))return n;throw l("Can't convert object to primitive value")}return void 0===e&&(e="number"),u(t,e)}},4948:function(t,e,n){var o=n(7593),r=n(2190);t.exports=function(t){var e=o(t,"string");return r(e)?e:e+""}},1694:function(t,e,n){var o={};o[n(5112)("toStringTag")]="z",t.exports="[object z]"===String(o)},1340:function(t,e,n){var o=n(7854),r=n(648),i=o.String;t.exports=function(t){if("Symbol"===r(t))throw TypeError("Cannot convert a Symbol value to a string");return i(t)}},6330:function(t,e,n){var o=n(7854).String;t.exports=function(t){try{return o(t)}catch(t){return"Object"}}},9711:function(t,e,n){var o=n(1702),r=0,i=Math.random(),a=o(1..toString);t.exports=function(t){return"Symbol("+(void 0===t?"":t)+")_"+a(++r+i,36)}},3307:function(t,e,n){var o=n(133);t.exports=o&&!Symbol.sham&&"symbol"==typeof Symbol.iterator},3353:function(t,e,n){var o=n(9781),r=n(7293);t.exports=o&&r((function(){return 42!=Object.defineProperty((function(){}),"prototype",{value:42,writable:!1}).prototype}))},6061:function(t,e,n){var o=n(5112);e.f=o},5112:function(t,e,n){var o=n(7854),r=n(2309),i=n(2597),a=n(9711),s=n(133),u=n(3307),c=r("wks"),l=o.Symbol,f=l&&l.for,d=u?l:l&&l.withoutSetter||a;t.exports=function(t){if(!i(c,t)||!s&&"string"!=typeof c[t]){var e="Symbol."+t;s&&i(l,t)?c[t]=l[t]:c[t]=u&&f?f(e):d(e)}return c[t]}},1361:function(t){t.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},2222:function(t,e,n){"use strict";var o=n(2109),r=n(7854),i=n(7293),a=n(3157),s=n(111),u=n(7908),c=n(6244),l=n(6135),f=n(5417),d=n(1194),p=n(5112),h=n(7392),v=p("isConcatSpreadable"),g=9007199254740991,y="Maximum allowed index exceeded",m=r.TypeError,b=h>=51||!i((function(){var t=[];return t[v]=!1,t.concat()[0]!==t})),x=d("concat"),w=function(t){if(!s(t))return!1;var e=t[v];return void 0!==e?!!e:a(t)};o({target:"Array",proto:!0,forced:!b||!x},{concat:function(t){var e,n,o,r,i,a=u(this),s=f(a,0),d=0;for(e=-1,o=arguments.length;e<o;e++)if(w(i=-1===e?a:arguments[e])){if(d+(r=c(i))>g)throw m(y);for(n=0;n<r;n++,d++)n in i&&l(s,d,i[n])}else{if(d>=g)throw m(y);l(s,d++,i)}return s.length=d,s}})},7327:function(t,e,n){"use strict";var o=n(2109),r=n(2092).filter;o({target:"Array",proto:!0,forced:!n(1194)("filter")},{filter:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}})},1038:function(t,e,n){var o=n(2109),r=n(8457);o({target:"Array",stat:!0,forced:!n(7072)((function(t){Array.from(t)}))},{from:r})},6699:function(t,e,n){"use strict";var o=n(2109),r=n(1318).includes,i=n(1223);o({target:"Array",proto:!0},{includes:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}}),i("includes")},2772:function(t,e,n){"use strict";var o=n(2109),r=n(1702),i=n(1318).indexOf,a=n(9341),s=r([].indexOf),u=!!s&&1/s([1],1,-0)<0,c=a("indexOf");o({target:"Array",proto:!0,forced:u||!c},{indexOf:function(t){var e=arguments.length>1?arguments[1]:void 0;return u?s(this,t,e)||0:i(this,t,e)}})},6992:function(t,e,n){"use strict";var o=n(5656),r=n(1223),i=n(7497),a=n(9909),s=n(3070).f,u=n(654),c=n(1913),l=n(9781),f="Array Iterator",d=a.set,p=a.getterFor(f);t.exports=u(Array,"Array",(function(t,e){d(this,{type:f,target:o(t),index:0,kind:e})}),(function(){var t=p(this),e=t.target,n=t.kind,o=t.index++;return!e||o>=e.length?(t.target=void 0,{value:void 0,done:!0}):"keys"==n?{value:o,done:!1}:"values"==n?{value:e[o],done:!1}:{value:[o,e[o]],done:!1}}),"values");var h=i.Arguments=i.Array;if(r("keys"),r("values"),r("entries"),!c&&l&&"values"!==h.name)try{s(h,"name",{value:"values"})}catch(t){}},9600:function(t,e,n){"use strict";var o=n(2109),r=n(1702),i=n(8361),a=n(5656),s=n(9341),u=r([].join),c=i!=Object,l=s("join",",");o({target:"Array",proto:!0,forced:c||!l},{join:function(t){return u(a(this),void 0===t?",":t)}})},1249:function(t,e,n){"use strict";var o=n(2109),r=n(2092).map;o({target:"Array",proto:!0,forced:!n(1194)("map")},{map:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}})},5827:function(t,e,n){"use strict";var o=n(2109),r=n(3671).left,i=n(9341),a=n(7392),s=n(5268);o({target:"Array",proto:!0,forced:!i("reduce")||!s&&a>79&&a<83},{reduce:function(t){var e=arguments.length;return r(this,t,e,e>1?arguments[1]:void 0)}})},7042:function(t,e,n){"use strict";var o=n(2109),r=n(7854),i=n(3157),a=n(4411),s=n(111),u=n(1400),c=n(6244),l=n(5656),f=n(6135),d=n(5112),p=n(1194),h=n(206),v=p("slice"),g=d("species"),y=r.Array,m=Math.max;o({target:"Array",proto:!0,forced:!v},{slice:function(t,e){var n,o,r,d=l(this),p=c(d),v=u(t,p),b=u(void 0===e?p:e,p);if(i(d)&&(n=d.constructor,(a(n)&&(n===y||i(n.prototype))||s(n)&&null===(n=n[g]))&&(n=void 0),n===y||void 0===n))return h(d,v,b);for(o=new(void 0===n?y:n)(m(b-v,0)),r=0;v<b;v++,r++)v in d&&f(o,r,d[v]);return o.length=r,o}})},2707:function(t,e,n){"use strict";var o=n(2109),r=n(1702),i=n(9662),a=n(7908),s=n(6244),u=n(1340),c=n(7293),l=n(4362),f=n(9341),d=n(8886),p=n(256),h=n(7392),v=n(8008),g=[],y=r(g.sort),m=r(g.push),b=c((function(){g.sort(void 0)})),x=c((function(){g.sort(null)})),w=f("sort"),E=!c((function(){if(h)return h<70;if(!(d&&d>3)){if(p)return!0;if(v)return v<603;var t,e,n,o,r="";for(t=65;t<76;t++){switch(e=String.fromCharCode(t),t){case 66:case 69:case 70:case 72:n=3;break;case 68:case 71:n=4;break;default:n=2}for(o=0;o<47;o++)g.push({k:e+o,v:n})}for(g.sort((function(t,e){return e.v-t.v})),o=0;o<g.length;o++)e=g[o].k.charAt(0),r.charAt(r.length-1)!==e&&(r+=e);return"DGBEFHACIJK"!==r}}));o({target:"Array",proto:!0,forced:b||!x||!w||!E},{sort:function(t){void 0!==t&&i(t);var e=a(this);if(E)return void 0===t?y(e):y(e,t);var n,o,r=[],c=s(e);for(o=0;o<c;o++)o in e&&m(r,e[o]);for(l(r,function(t){return function(e,n){return void 0===n?-1:void 0===e?1:void 0!==t?+t(e,n)||0:u(e)>u(n)?1:-1}}(t)),n=r.length,o=0;o<n;)e[o]=r[o++];for(;o<c;)delete e[o++];return e}})},561:function(t,e,n){"use strict";var o=n(2109),r=n(7854),i=n(1400),a=n(9303),s=n(6244),u=n(7908),c=n(5417),l=n(6135),f=n(1194)("splice"),d=r.TypeError,p=Math.max,h=Math.min,v=9007199254740991,g="Maximum allowed length exceeded";o({target:"Array",proto:!0,forced:!f},{splice:function(t,e){var n,o,r,f,y,m,b=u(this),x=s(b),w=i(t,x),E=arguments.length;if(0===E?n=o=0:1===E?(n=0,o=x-w):(n=E-2,o=h(p(a(e),0),x-w)),x+n-o>v)throw d(g);for(r=c(b,o),f=0;f<o;f++)(y=w+f)in b&&l(r,f,b[y]);if(r.length=o,n<o){for(f=w;f<x-o;f++)m=f+n,(y=f+o)in b?b[m]=b[y]:delete b[m];for(f=x;f>x-o+n;f--)delete b[f-1]}else if(n>o)for(f=x-o;f>w;f--)m=f+n-1,(y=f+o-1)in b?b[m]=b[y]:delete b[m];for(f=0;f<n;f++)b[f+w]=arguments[f+2];return b.length=x-o+n,r}})},8309:function(t,e,n){var o=n(9781),r=n(6530).EXISTS,i=n(1702),a=n(3070).f,s=Function.prototype,u=i(s.toString),c=/function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/,l=i(c.exec);o&&!r&&a(s,"name",{configurable:!0,get:function(){try{return l(c,u(this))[1]}catch(t){return""}}})},8862:function(t,e,n){var o=n(2109),r=n(5005),i=n(2104),a=n(6916),s=n(1702),u=n(7293),c=n(3157),l=n(614),f=n(111),d=n(2190),p=n(206),h=n(133),v=r("JSON","stringify"),g=s(/./.exec),y=s("".charAt),m=s("".charCodeAt),b=s("".replace),x=s(1..toString),w=/[\uD800-\uDFFF]/g,E=/^[\uD800-\uDBFF]$/,O=/^[\uDC00-\uDFFF]$/,S=!h||u((function(){var t=r("Symbol")();return"[null]"!=v([t])||"{}"!=v({a:t})||"{}"!=v(Object(t))})),k=u((function(){return'"\\udf06\\ud834"'!==v("\udf06\ud834")||'"\\udead"'!==v("\udead")})),I=function(t,e){var n=p(arguments),o=e;if((f(e)||void 0!==t)&&!d(t))return c(e)||(e=function(t,e){if(l(o)&&(e=a(o,this,t,e)),!d(e))return e}),n[1]=e,i(v,null,n)},C=function(t,e,n){var o=y(n,e-1),r=y(n,e+1);return g(E,t)&&!g(O,r)||g(O,t)&&!g(E,o)?"\\u"+x(m(t,0),16):t};v&&o({target:"JSON",stat:!0,forced:S||k},{stringify:function(t,e,n){var o=p(arguments),r=i(S?I:v,null,o);return k&&"string"==typeof r?b(r,w,C):r}})},9653:function(t,e,n){"use strict";var o=n(9781),r=n(7854),i=n(1702),a=n(4705),s=n(1320),u=n(2597),c=n(9587),l=n(7976),f=n(2190),d=n(7593),p=n(7293),h=n(8006).f,v=n(1236).f,g=n(3070).f,y=n(863),m=n(3111).trim,b="Number",x=r.Number,w=x.prototype,E=r.TypeError,O=i("".slice),S=i("".charCodeAt),k=function(t){var e=d(t,"number");return"bigint"==typeof e?e:I(e)},I=function(t){var e,n,o,r,i,a,s,u,c=d(t,"number");if(f(c))throw E("Cannot convert a Symbol value to a number");if("string"==typeof c&&c.length>2)if(c=m(c),43===(e=S(c,0))||45===e){if(88===(n=S(c,2))||120===n)return NaN}else if(48===e){switch(S(c,1)){case 66:case 98:o=2,r=49;break;case 79:case 111:o=8,r=55;break;default:return+c}for(a=(i=O(c,2)).length,s=0;s<a;s++)if((u=S(i,s))<48||u>r)return NaN;return parseInt(i,o)}return+c};if(a(b,!x(" 0o1")||!x("0b1")||x("+0x1"))){for(var C,P=function(t){var e=arguments.length<1?0:x(k(t)),n=this;return l(w,n)&&p((function(){y(n)}))?c(Object(e),n,P):e},A=o?h(x):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,fromString,range".split(","),M=0;A.length>M;M++)u(x,C=A[M])&&!u(P,C)&&g(P,C,v(x,C));P.prototype=w,w.constructor=P,s(r,b,P)}},3161:function(t,e,n){n(2109)({target:"Number",stat:!0},{isInteger:n(5988)})},9601:function(t,e,n){var o=n(2109),r=n(1574);o({target:"Object",stat:!0,forced:Object.assign!==r},{assign:r})},9595:function(t,e,n){"use strict";var o=n(2109),r=n(9781),i=n(9026),a=n(9662),s=n(7908),u=n(3070);r&&o({target:"Object",proto:!0,forced:i},{__defineGetter__:function(t,e){u.f(s(this),t,{get:a(e),enumerable:!0,configurable:!0})}})},5003:function(t,e,n){var o=n(2109),r=n(7293),i=n(5656),a=n(1236).f,s=n(9781),u=r((function(){a(1)}));o({target:"Object",stat:!0,forced:!s||u,sham:!s},{getOwnPropertyDescriptor:function(t,e){return a(i(t),e)}})},9337:function(t,e,n){var o=n(2109),r=n(9781),i=n(3887),a=n(5656),s=n(1236),u=n(6135);o({target:"Object",stat:!0,sham:!r},{getOwnPropertyDescriptors:function(t){for(var e,n,o=a(t),r=s.f,c=i(o),l={},f=0;c.length>f;)void 0!==(n=r(o,e=c[f++]))&&u(l,e,n);return l}})},6210:function(t,e,n){var o=n(2109),r=n(7293),i=n(1156).f;o({target:"Object",stat:!0,forced:r((function(){return!Object.getOwnPropertyNames(1)}))},{getOwnPropertyNames:i})},9660:function(t,e,n){var o=n(2109),r=n(133),i=n(7293),a=n(5181),s=n(7908);o({target:"Object",stat:!0,forced:!r||i((function(){a.f(1)}))},{getOwnPropertySymbols:function(t){var e=a.f;return e?e(s(t)):[]}})},7941:function(t,e,n){var o=n(2109),r=n(7908),i=n(1956);o({target:"Object",stat:!0,forced:n(7293)((function(){i(1)}))},{keys:function(t){return i(r(t))}})},1539:function(t,e,n){var o=n(1694),r=n(1320),i=n(288);o||r(Object.prototype,"toString",i,{unsafe:!0})},4603:function(t,e,n){var o=n(9781),r=n(7854),i=n(1702),a=n(4705),s=n(9587),u=n(8880),c=n(8006).f,l=n(7976),f=n(7850),d=n(1340),p=n(4706),h=n(2999),v=n(2626),g=n(1320),y=n(7293),m=n(2597),b=n(9909).enforce,x=n(6340),w=n(5112),E=n(9441),O=n(7168),S=w("match"),k=r.RegExp,I=k.prototype,C=r.SyntaxError,P=i(I.exec),A=i("".charAt),M=i("".replace),T=i("".indexOf),D=i("".slice),j=/^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/,N=/a/g,L=/a/g,R=new k(N)!==N,B=h.MISSED_STICKY,F=h.UNSUPPORTED_Y,_=o&&(!R||B||E||O||y((function(){return L[S]=!1,k(N)!=N||k(L)==L||"/a/i"!=k(N,"i")})));if(a("RegExp",_)){for(var K=function(t,e){var n,o,r,i,a,c,h=l(I,this),v=f(t),g=void 0===e,y=[],x=t;if(!h&&v&&g&&t.constructor===K)return t;if((v||l(I,t))&&(t=t.source,g&&(e=p(x))),t=void 0===t?"":d(t),e=void 0===e?"":d(e),x=t,E&&"dotAll"in N&&(o=!!e&&T(e,"s")>-1)&&(e=M(e,/s/g,"")),n=e,B&&"sticky"in N&&(r=!!e&&T(e,"y")>-1)&&F&&(e=M(e,/y/g,"")),O&&(t=(i=function(t){for(var e,n=t.length,o=0,r="",i=[],a={},s=!1,u=!1,c=0,l="";o<=n;o++){if("\\"===(e=A(t,o)))e+=A(t,++o);else if("]"===e)s=!1;else if(!s)switch(!0){case"["===e:s=!0;break;case"("===e:P(j,D(t,o+1))&&(o+=2,u=!0),r+=e,c++;continue;case">"===e&&u:if(""===l||m(a,l))throw new C("Invalid capture group name");a[l]=!0,i[i.length]=[l,c],u=!1,l="";continue}u?l+=e:r+=e}return[r,i]}(t))[0],y=i[1]),a=s(k(t,e),h?this:I,K),(o||r||y.length)&&(c=b(a),o&&(c.dotAll=!0,c.raw=K(function(t){for(var e,n=t.length,o=0,r="",i=!1;o<=n;o++)"\\"!==(e=A(t,o))?i||"."!==e?("["===e?i=!0:"]"===e&&(i=!1),r+=e):r+="[\\s\\S]":r+=e+A(t,++o);return r}(t),n)),r&&(c.sticky=!0),y.length&&(c.groups=y)),t!==x)try{u(a,"source",""===x?"(?:)":x)}catch(t){}return a},U=c(k),H=0;U.length>H;)v(K,k,U[H++]);I.constructor=K,K.prototype=I,g(r,"RegExp",K)}x("RegExp")},4916:function(t,e,n){"use strict";var o=n(2109),r=n(2261);o({target:"RegExp",proto:!0,forced:/./.exec!==r},{exec:r})},9714:function(t,e,n){"use strict";var o=n(6530).PROPER,r=n(1320),i=n(9670),a=n(1340),s=n(7293),u=n(4706),c="toString",l=RegExp.prototype.toString,f=s((function(){return"/a/b"!=l.call({source:"a",flags:"b"})})),d=o&&l.name!=c;(f||d)&&r(RegExp.prototype,c,(function(){var t=i(this);return"/"+a(t.source)+"/"+a(u(t))}),{unsafe:!0})},2023:function(t,e,n){"use strict";var o=n(2109),r=n(1702),i=n(3929),a=n(4488),s=n(1340),u=n(4964),c=r("".indexOf);o({target:"String",proto:!0,forced:!u("includes")},{includes:function(t){return!!~c(s(a(this)),s(i(t)),arguments.length>1?arguments[1]:void 0)}})},8783:function(t,e,n){"use strict";var o=n(8710).charAt,r=n(1340),i=n(9909),a=n(654),s="String Iterator",u=i.set,c=i.getterFor(s);a(String,"String",(function(t){u(this,{type:s,string:r(t),index:0})}),(function(){var t,e=c(this),n=e.string,r=e.index;return r>=n.length?{value:void 0,done:!0}:(t=o(n,r),e.index+=t.length,{value:t,done:!1})}))},6373:function(t,e,n){"use strict";var o=n(2109),r=n(7854),i=n(6916),a=n(1702),s=n(4994),u=n(4488),c=n(7466),l=n(1340),f=n(9670),d=n(4326),p=n(7850),h=n(4706),v=n(8173),g=n(1320),y=n(7293),m=n(5112),b=n(6707),x=n(1530),w=n(7651),E=n(9909),O=n(1913),S=m("matchAll"),k="RegExp String",I="RegExp String Iterator",C=E.set,P=E.getterFor(I),A=RegExp.prototype,M=r.TypeError,T=a("".indexOf),D=a("".matchAll),j=!!D&&!y((function(){D("a",/./)})),N=s((function(t,e,n,o){C(this,{type:I,regexp:t,string:e,global:n,unicode:o,done:!1})}),k,(function(){var t=P(this);if(t.done)return{value:void 0,done:!0};var e=t.regexp,n=t.string,o=w(e,n);return null===o?{value:void 0,done:t.done=!0}:t.global?(""===l(o[0])&&(e.lastIndex=x(n,c(e.lastIndex),t.unicode)),{value:o,done:!1}):(t.done=!0,{value:o,done:!1})})),L=function(t){var e,n,o,r=f(this),i=l(t),a=b(r,RegExp),s=l(h(r));return e=new a(a===RegExp?r.source:r,s),n=!!~T(s,"g"),o=!!~T(s,"u"),e.lastIndex=c(r.lastIndex),new N(e,i,n,o)};o({target:"String",proto:!0,forced:j},{matchAll:function(t){var e,n,o,r,a=u(this);if(null!=t){if(p(t)&&(e=l(u(h(t))),!~T(e,"g")))throw M("`.matchAll` does not allow non-global regexes");if(j)return D(a,t);if(void 0===(o=v(t,S))&&O&&"RegExp"==d(t)&&(o=L),o)return i(o,t,a)}else if(j)return D(a,t);return n=l(a),r=new RegExp(t,"g"),O?i(L,r,n):r[S](n)}}),O||S in A||g(A,S,L)},4723:function(t,e,n){"use strict";var o=n(6916),r=n(7007),i=n(9670),a=n(7466),s=n(1340),u=n(4488),c=n(8173),l=n(1530),f=n(7651);r("match",(function(t,e,n){return[function(e){var n=u(this),r=null==e?void 0:c(e,t);return r?o(r,e,n):new RegExp(e)[t](s(n))},function(t){var o=i(this),r=s(t),u=n(e,o,r);if(u.done)return u.value;if(!o.global)return f(o,r);var c=o.unicode;o.lastIndex=0;for(var d,p=[],h=0;null!==(d=f(o,r));){var v=s(d[0]);p[h]=v,""===v&&(o.lastIndex=l(r,a(o.lastIndex),c)),h++}return 0===h?null:p}]}))},5306:function(t,e,n){"use strict";var o=n(2104),r=n(6916),i=n(1702),a=n(7007),s=n(7293),u=n(9670),c=n(614),l=n(9303),f=n(7466),d=n(1340),p=n(4488),h=n(1530),v=n(8173),g=n(647),y=n(7651),m=n(5112)("replace"),b=Math.max,x=Math.min,w=i([].concat),E=i([].push),O=i("".indexOf),S=i("".slice),k="$0"==="a".replace(/./,"$0"),I=!!/./[m]&&""===/./[m]("a","$0");a("replace",(function(t,e,n){var i=I?"$":"$0";return[function(t,n){var o=p(this),i=null==t?void 0:v(t,m);return i?r(i,t,o,n):r(e,d(o),t,n)},function(t,r){var a=u(this),s=d(t);if("string"==typeof r&&-1===O(r,i)&&-1===O(r,"$<")){var p=n(e,a,s,r);if(p.done)return p.value}var v=c(r);v||(r=d(r));var m=a.global;if(m){var k=a.unicode;a.lastIndex=0}for(var I=[];;){var C=y(a,s);if(null===C)break;if(E(I,C),!m)break;""===d(C[0])&&(a.lastIndex=h(s,f(a.lastIndex),k))}for(var P,A="",M=0,T=0;T<I.length;T++){for(var D=d((C=I[T])[0]),j=b(x(l(C.index),s.length),0),N=[],L=1;L<C.length;L++)E(N,void 0===(P=C[L])?P:String(P));var R=C.groups;if(v){var B=w([D],N,j,s);void 0!==R&&E(B,R);var F=d(o(r,void 0,B))}else F=g(D,s,j,N,R,r);j>=M&&(A+=S(s,M,j)+F,M=j+D.length)}return A+S(s,M)}]}),!!s((function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")}))||!k||I)},3123:function(t,e,n){"use strict";var o=n(2104),r=n(6916),i=n(1702),a=n(7007),s=n(7850),u=n(9670),c=n(4488),l=n(6707),f=n(1530),d=n(7466),p=n(1340),h=n(8173),v=n(1589),g=n(7651),y=n(2261),m=n(2999),b=n(7293),x=m.UNSUPPORTED_Y,w=4294967295,E=Math.min,O=[].push,S=i(/./.exec),k=i(O),I=i("".slice);a("split",(function(t,e,n){var i;return i="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||".".split(/()()/).length>1||"".split(/.?/).length?function(t,n){var i=p(c(this)),a=void 0===n?w:n>>>0;if(0===a)return[];if(void 0===t)return[i];if(!s(t))return r(e,i,t,a);for(var u,l,f,d=[],h=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),g=0,m=new RegExp(t.source,h+"g");(u=r(y,m,i))&&!((l=m.lastIndex)>g&&(k(d,I(i,g,u.index)),u.length>1&&u.index<i.length&&o(O,d,v(u,1)),f=u[0].length,g=l,d.length>=a));)m.lastIndex===u.index&&m.lastIndex++;return g===i.length?!f&&S(m,"")||k(d,""):k(d,I(i,g)),d.length>a?v(d,0,a):d}:"0".split(void 0,0).length?function(t,n){return void 0===t&&0===n?[]:r(e,this,t,n)}:e,[function(e,n){var o=c(this),a=null==e?void 0:h(e,t);return a?r(a,e,o,n):r(i,p(o),e,n)},function(t,o){var r=u(this),a=p(t),s=n(i,r,a,o,i!==e);if(s.done)return s.value;var c=l(r,RegExp),h=r.unicode,v=(r.ignoreCase?"i":"")+(r.multiline?"m":"")+(r.unicode?"u":"")+(x?"g":"y"),y=new c(x?"^(?:"+r.source+")":r,v),m=void 0===o?w:o>>>0;if(0===m)return[];if(0===a.length)return null===g(y,a)?[a]:[];for(var b=0,O=0,S=[];O<a.length;){y.lastIndex=x?0:O;var C,P=g(y,x?I(a,O):a);if(null===P||(C=E(d(y.lastIndex+(x?O:0)),a.length))===b)O=f(a,O,h);else{if(k(S,I(a,b,O)),S.length===m)return S;for(var A=1;A<=P.length-1;A++)if(k(S,P[A]),S.length===m)return S;O=b=C}}return k(S,I(a,b)),S}]}),!!b((function(){var t=/(?:)/,e=t.exec;t.exec=function(){return e.apply(this,arguments)};var n="ab".split(t);return 2!==n.length||"a"!==n[0]||"b"!==n[1]})),x)},3210:function(t,e,n){"use strict";var o=n(2109),r=n(3111).trim;o({target:"String",proto:!0,forced:n(6091)("trim")},{trim:function(){return r(this)}})},4032:function(t,e,n){"use strict";var o=n(2109),r=n(7854),i=n(6916),a=n(1702),s=n(1913),u=n(9781),c=n(133),l=n(7293),f=n(2597),d=n(7976),p=n(9670),h=n(5656),v=n(4948),g=n(1340),y=n(9114),m=n(30),b=n(1956),x=n(8006),w=n(1156),E=n(5181),O=n(1236),S=n(3070),k=n(6048),I=n(5296),C=n(1320),P=n(2309),A=n(6200),M=n(3501),T=n(9711),D=n(5112),j=n(6061),N=n(7235),L=n(6532),R=n(8003),B=n(9909),F=n(2092).forEach,_=A("hidden"),K="Symbol",U=B.set,H=B.getterFor(K),$=Object.prototype,G=r.Symbol,V=G&&G.prototype,z=r.TypeError,Y=r.QObject,W=O.f,X=S.f,J=w.f,q=I.f,Q=a([].push),Z=P("symbols"),tt=P("op-symbols"),et=P("wks"),nt=!Y||!Y.prototype||!Y.prototype.findChild,ot=u&&l((function(){return 7!=m(X({},"a",{get:function(){return X(this,"a",{value:7}).a}})).a}))?function(t,e,n){var o=W($,e);o&&delete $[e],X(t,e,n),o&&t!==$&&X($,e,o)}:X,rt=function(t,e){var n=Z[t]=m(V);return U(n,{type:K,tag:t,description:e}),u||(n.description=e),n},it=function(t,e,n){t===$&&it(tt,e,n),p(t);var o=v(e);return p(n),f(Z,o)?(n.enumerable?(f(t,_)&&t[_][o]&&(t[_][o]=!1),n=m(n,{enumerable:y(0,!1)})):(f(t,_)||X(t,_,y(1,{})),t[_][o]=!0),ot(t,o,n)):X(t,o,n)},at=function(t,e){p(t);var n=h(e),o=b(n).concat(lt(n));return F(o,(function(e){u&&!i(st,n,e)||it(t,e,n[e])})),t},st=function(t){var e=v(t),n=i(q,this,e);return!(this===$&&f(Z,e)&&!f(tt,e))&&(!(n||!f(this,e)||!f(Z,e)||f(this,_)&&this[_][e])||n)},ut=function(t,e){var n=h(t),o=v(e);if(n!==$||!f(Z,o)||f(tt,o)){var r=W(n,o);return!r||!f(Z,o)||f(n,_)&&n[_][o]||(r.enumerable=!0),r}},ct=function(t){var e=J(h(t)),n=[];return F(e,(function(t){f(Z,t)||f(M,t)||Q(n,t)})),n},lt=function(t){var e=t===$,n=J(e?tt:h(t)),o=[];return F(n,(function(t){!f(Z,t)||e&&!f($,t)||Q(o,Z[t])})),o};c||(C(V=(G=function(){if(d(V,this))throw z("Symbol is not a constructor");var t=arguments.length&&void 0!==arguments[0]?g(arguments[0]):void 0,e=T(t),n=function(t){this===$&&i(n,tt,t),f(this,_)&&f(this[_],e)&&(this[_][e]=!1),ot(this,e,y(1,t))};return u&&nt&&ot($,e,{configurable:!0,set:n}),rt(e,t)}).prototype,"toString",(function(){return H(this).tag})),C(G,"withoutSetter",(function(t){return rt(T(t),t)})),I.f=st,S.f=it,k.f=at,O.f=ut,x.f=w.f=ct,E.f=lt,j.f=function(t){return rt(D(t),t)},u&&(X(V,"description",{configurable:!0,get:function(){return H(this).description}}),s||C($,"propertyIsEnumerable",st,{unsafe:!0}))),o({global:!0,wrap:!0,forced:!c,sham:!c},{Symbol:G}),F(b(et),(function(t){N(t)})),o({target:K,stat:!0,forced:!c},{useSetter:function(){nt=!0},useSimple:function(){nt=!1}}),o({target:"Object",stat:!0,forced:!c,sham:!u},{create:function(t,e){return void 0===e?m(t):at(m(t),e)},defineProperty:it,defineProperties:at,getOwnPropertyDescriptor:ut}),o({target:"Object",stat:!0,forced:!c},{getOwnPropertyNames:ct}),L(),R(G,K),M[_]=!0},1817:function(t,e,n){"use strict";var o=n(2109),r=n(9781),i=n(7854),a=n(1702),s=n(2597),u=n(614),c=n(7976),l=n(1340),f=n(3070).f,d=n(9920),p=i.Symbol,h=p&&p.prototype;if(r&&u(p)&&(!("description"in h)||void 0!==p().description)){var v={},g=function(){var t=arguments.length<1||void 0===arguments[0]?void 0:l(arguments[0]),e=c(h,this)?new p(t):void 0===t?p():p(t);return""===t&&(v[e]=!0),e};d(g,p),g.prototype=h,h.constructor=g;var y="Symbol(test)"==String(p("test")),m=a(h.toString),b=a(h.valueOf),x=/^Symbol\((.*)\)[^)]+$/,w=a("".replace),E=a("".slice);f(h,"description",{configurable:!0,get:function(){var t=b(this),e=m(t);if(s(v,t))return"";var n=y?E(e,7,-1):w(e,x,"$1");return""===n?void 0:n}}),o({global:!0,forced:!0},{Symbol:g})}},763:function(t,e,n){var o=n(2109),r=n(5005),i=n(2597),a=n(1340),s=n(2309),u=n(735),c=s("string-to-symbol-registry"),l=s("symbol-to-string-registry");o({target:"Symbol",stat:!0,forced:!u},{for:function(t){var e=a(t);if(i(c,e))return c[e];var n=r("Symbol")(e);return c[e]=n,l[n]=e,n}})},2165:function(t,e,n){n(7235)("iterator")},2526:function(t,e,n){n(4032),n(763),n(6620),n(8862),n(9660)},6620:function(t,e,n){var o=n(2109),r=n(2597),i=n(2190),a=n(6330),s=n(2309),u=n(735),c=s("symbol-to-string-registry");o({target:"Symbol",stat:!0,forced:!u},{keyFor:function(t){if(!i(t))throw TypeError(a(t)+" is not a symbol");if(r(c,t))return c[t]}})},3728:function(t,e,n){n(6373)},4747:function(t,e,n){var o=n(7854),r=n(8324),i=n(8509),a=n(8533),s=n(8880),u=function(t){if(t&&t.forEach!==a)try{s(t,"forEach",a)}catch(e){t.forEach=a}};for(var c in r)r[c]&&u(o[c]&&o[c].prototype);u(i)},3948:function(t,e,n){var o=n(7854),r=n(8324),i=n(8509),a=n(6992),s=n(8880),u=n(5112),c=u("iterator"),l=u("toStringTag"),f=a.values,d=function(t,e){if(t){if(t[c]!==f)try{s(t,c,f)}catch(e){t[c]=f}if(t[l]||s(t,l,e),r[e])for(var n in a)if(t[n]!==a[n])try{s(t,n,a[n])}catch(e){t[n]=a[n]}}};for(var p in r)d(o[p]&&o[p].prototype,p);d(i,"DOMTokenList")}},e={};function n(o){var r=e[o];if(void 0!==r)return r.exports;var i=e[o]={exports:{}};return t[o](i,i.exports,n),i.exports}n.d=function(t,e){for(var o in e)n.o(e,o)&&!n.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:e[o]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var o={};return function(){"use strict";n.r(o),n.d(o,{default:function(){return x}});n(3210),n(4916),n(5306),n(2772),n(8309),n(3123),n(1539),n(9714),n(561),n(9600),n(9595),n(7042);"undefined"==typeof Element||"remove"in Element.prototype||(Element.prototype.remove=function(){this.parentNode&&this.parentNode.removeChild(this)}),"undefined"!=typeof self&&"document"in self&&((!("classList"in document.createElement("_"))||document.createElementNS&&!("classList"in document.createElementNS("http://www.w3.org/2000/svg","g")))&&function(t){if("Element"in t){var e="classList",n=t.Element.prototype,o=Object,r=String.prototype.trim||function(){return this.replace(/^\s+|\s+$/g,"")},i=Array.prototype.indexOf||function(t){for(var e=0,n=this.length;e<n;e++)if(e in this&&this[e]===t)return e;return-1},a=function(t,e){this.name=t,this.code=DOMException[t],this.message=e},s=function(t,e){if(""===e)throw new a("SYNTAX_ERR","The token must not be empty.");if(/\s/.test(e))throw new a("INVALID_CHARACTER_ERR","The token must not contain space characters.");return i.call(t,e)},u=function(t){for(var e=r.call(t.getAttribute("class")||""),n=e?e.split(/\s+/):[],o=0,i=n.length;o<i;o++)this.push(n[o]);this._updateClassName=function(){t.setAttribute("class",this.toString())}},c=u.prototype=[],l=function(){return new u(this)};if(a.prototype=Error.prototype,c.item=function(t){return this[t]||null},c.contains=function(t){return~s(this,t+"")},c.add=function(){var t,e=arguments,n=0,o=e.length,r=!1;do{t=e[n]+"",~s(this,t)||(this.push(t),r=!0)}while(++n<o);r&&this._updateClassName()},c.remove=function(){var t,e,n=arguments,o=0,r=n.length,i=!1;do{for(t=n[o]+"",e=s(this,t);~e;)this.splice(e,1),i=!0,e=s(this,t)}while(++o<r);i&&this._updateClassName()},c.toggle=function(t,e){var n=this.contains(t),o=n?!0!==e&&"remove":!1!==e&&"add";return o&&this[o](t),!0===e||!1===e?e:!n},c.replace=function(t,e){var n=s(t+"");~n&&(this.splice(n,1,e),this._updateClassName())},c.toString=function(){return this.join(" ")},o.defineProperty){var f={get:l,enumerable:!0,configurable:!0};try{o.defineProperty(n,e,f)}catch(t){void 0!==t.number&&-2146823252!==t.number||(f.enumerable=!1,o.defineProperty(n,e,f))}}else o.prototype.__defineGetter__&&n.__defineGetter__(e,l)}}(self),function(){var t=document.createElement("_");if(t.classList.add("c1","c2"),!t.classList.contains("c2")){var e=function(t){var e=DOMTokenList.prototype[t];DOMTokenList.prototype[t]=function(t){var n,o=arguments.length;for(n=0;n<o;n++)t=arguments[n],e.call(this,t)}};e("add"),e("remove")}if(t.classList.toggle("c3",!1),t.classList.contains("c3")){var n=DOMTokenList.prototype.toggle;DOMTokenList.prototype.toggle=function(t,e){return 1 in arguments&&!this.contains(t)==!e?e:n.call(this,t)}}"replace"in document.createElement("_").classList||(DOMTokenList.prototype.replace=function(t,e){var n=this.toString().split(" "),o=n.indexOf(t+"");~o&&(n=n.slice(o),this.remove.apply(this,n),this.add(e),this.add.apply(this,n.slice(1)))}),t=null}());n(7327),n(2222),n(7941),n(4603),n(3728),n(2707),n(6699),n(2023),n(4747),n(9601),n(1249),n(1038),n(8783),n(2526),n(5003),n(9337),n(1817),n(2165),n(6992),n(3948),n(3161),n(9653),n(4723),n(5827),n(6210);function t(t){return function(t){if(Array.isArray(t))return r(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||e(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function e(t,e){if(t){if("string"==typeof t)return r(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(t,e):void 0}}function r(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,o=new Array(e);n<e;n++)o[n]=t[n];return o}function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function a(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function s(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var u=function(){function n(t){var e=t.getOptions,o=t.getCaretPosition,r=t.getCaretPositionEnd,i=t.dispatch;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),s(this,"isStandardButton",(function(t){return t&&!("{"===t[0]&&"}"===t[t.length-1])})),this.getOptions=e,this.getCaretPosition=o,this.getCaretPositionEnd=r,this.dispatch=i,n.bindMethods(n,this)}var o,r,u;return o=n,u=[{key:"bindMethods",value:function(t,n){var o,r=function(t,n){var o="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!o){if(Array.isArray(t)||(o=e(t))||n&&t&&"number"==typeof t.length){o&&(t=o);var r=0,i=function(){};return{s:i,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,s=!0,u=!1;return{s:function(){o=o.call(t)},n:function(){var t=o.next();return s=t.done,t},e:function(t){u=!0,a=t},f:function(){try{s||null==o.return||o.return()}finally{if(u)throw a}}}}(Object.getOwnPropertyNames(t.prototype));try{for(r.s();!(o=r.n()).done;){var i=o.value;"constructor"===i||"bindMethods"===i||(n[i]=n[i].bind(n))}}catch(t){r.e(t)}finally{r.f()}}}],(r=[{key:"getButtonType",value:function(t){return t.includes("{")&&t.includes("}")&&"{//}"!==t?"functionBtn":"standardBtn"}},{key:"getButtonClass",value:function(t){var e=this.getButtonType(t),n=t.replace("{","").replace("}",""),o="";return"standardBtn"!==e&&(o=" hg-button-".concat(n)),"hg-".concat(e).concat(o)}},{key:"getDefaultDiplay",value:function(){return{"{bksp}":"backspace","{backspace}":"backspace","{enter}":"< enter","{shift}":"shift","{shiftleft}":"shift","{shiftright}":"shift","{alt}":"alt","{s}":"shift","{tab}":"tab","{lock}":"caps","{capslock}":"caps","{accept}":"Submit","{space}":" ","{//}":" ","{esc}":"esc","{escape}":"esc","{f1}":"f1","{f2}":"f2","{f3}":"f3","{f4}":"f4","{f5}":"f5","{f6}":"f6","{f7}":"f7","{f8}":"f8","{f9}":"f9","{f10}":"f10","{f11}":"f11","{f12}":"f12","{numpaddivide}":"/","{numlock}":"lock","{arrowup}":"↑","{arrowleft}":"←","{arrowdown}":"↓","{arrowright}":"→","{prtscr}":"print","{scrolllock}":"scroll","{pause}":"pause","{insert}":"ins","{home}":"home","{pageup}":"up","{delete}":"del","{forwarddelete}":"del","{end}":"end","{pagedown}":"down","{numpadmultiply}":"*","{numpadsubtract}":"-","{numpadadd}":"+","{numpadenter}":"enter","{period}":".","{numpaddecimal}":".","{numpad0}":"0","{numpad1}":"1","{numpad2}":"2","{numpad3}":"3","{numpad4}":"4","{numpad5}":"5","{numpad6}":"6","{numpad7}":"7","{numpad8}":"8","{numpad9}":"9"}}},{key:"getButtonDisplayName",value:function(t,e,n){return(e=n?Object.assign({},this.getDefaultDiplay(),e):e||this.getDefaultDiplay())[t]||t}},{key:"getUpdatedInput",value:function(t,e,n){var o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:n,r=arguments.length>4&&void 0!==arguments[4]&&arguments[4],i=this.getOptions(),a=[n,o,r],s=e;return("{bksp}"===t||"{backspace}"===t)&&s.length>0?s=this.removeAt.apply(this,[s].concat(a)):("{delete}"===t||"{forwarddelete}"===t)&&s.length>0?s=this.removeForwardsAt.apply(this,[s].concat(a)):"{space}"===t?s=this.addStringAt.apply(this,[s," "].concat(a)):"{tab}"!==t||"boolean"==typeof i.tabCharOnTab&&!1===i.tabCharOnTab?"{enter}"!==t&&"{numpadenter}"!==t||!i.newLineOnEnter?t.includes("numpad")&&Number.isInteger(Number(t[t.length-2]))?s=this.addStringAt.apply(this,[s,t[t.length-2]].concat(a)):"{numpaddivide}"===t?s=this.addStringAt.apply(this,[s,"/"].concat(a)):"{numpadmultiply}"===t?s=this.addStringAt.apply(this,[s,"*"].concat(a)):"{numpadsubtract}"===t?s=this.addStringAt.apply(this,[s,"-"].concat(a)):"{numpadadd}"===t?s=this.addStringAt.apply(this,[s,"+"].concat(a)):"{numpaddecimal}"===t?s=this.addStringAt.apply(this,[s,"."].concat(a)):"{"===t||"}"===t?s=this.addStringAt.apply(this,[s,t].concat(a)):t.includes("{")||t.includes("}")||(s=this.addStringAt.apply(this,[s,t].concat(a))):s=this.addStringAt.apply(this,[s,"\n"].concat(a)):s=this.addStringAt.apply(this,[s,"\t"].concat(a)),s}},{key:"updateCaretPos",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=this.updateCaretPosAction(t,e);this.dispatch((function(t){t.setCaretPosition(n)}))}},{key:"updateCaretPosAction",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=this.getOptions(),o=this.getCaretPosition();return null!=o&&(e?o>0&&(o-=t):o+=t),n.debug&&console.log("Caret at:",o),o}},{key:"addStringAt",value:function(t,e){var n,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:t.length,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:t.length,i=arguments.length>4&&void 0!==arguments[4]&&arguments[4];return o||0===o?(n=[t.slice(0,o),e,t.slice(r)].join(""),this.isMaxLengthReached()||i&&this.updateCaretPos(e.length)):n=t+e,n}},{key:"removeAt",value:function(t){var e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:t.length,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:t.length,r=arguments.length>3&&void 0!==arguments[3]&&arguments[3];if(0===n&&0===o)return t;if(n===o){var i=/([\uD800-\uDBFF][\uDC00-\uDFFF])/g;n&&n>=0?t.substring(n-2,n).match(i)?(e=t.substr(0,n-2)+t.substr(n),r&&this.updateCaretPos(2,!0)):(e=t.substr(0,n-1)+t.substr(n),r&&this.updateCaretPos(1,!0)):t.slice(-2).match(i)?(e=t.slice(0,-2),r&&this.updateCaretPos(2,!0)):(e=t.slice(0,-1),r&&this.updateCaretPos(1,!0))}else e=t.slice(0,n)+t.slice(o),r&&this.dispatch((function(t){t.setCaretPosition(n)}));return e}},{key:"removeForwardsAt",value:function(t){var e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:t.length,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:t.length,r=arguments.length>3&&void 0!==arguments[3]&&arguments[3];if(null==t||!t.length||null===n)return t;if(n===o){var i=/([\uD800-\uDBFF][\uDC00-\uDFFF])/g,a=t.substring(n,n+2),s=a.match(i);e=s?t.substr(0,n)+t.substr(n+2):t.substr(0,n)+t.substr(n+1)}else e=t.slice(0,n)+t.slice(o),r&&this.dispatch((function(t){t.setCaretPosition(n)}));return e}},{key:"handleMaxLength",value:function(t,e){var n=this.getOptions(),o=n.maxLength,r=t[n.inputName||"default"],a=e.length-1>=o;if(e.length<=r.length)return!1;if(Number.isInteger(o))return n.debug&&console.log("maxLength (num) reached:",a),a?(this.maxLengthReached=!0,!0):(this.maxLengthReached=!1,!1);if("object"===i(o)){var s=e.length-1>=o[n.inputName||"default"];return n.debug&&console.log("maxLength (obj) reached:",s),s?(this.maxLengthReached=!0,!0):(this.maxLengthReached=!1,!1)}}},{key:"isMaxLengthReached",value:function(){return Boolean(this.maxLengthReached)}},{key:"isTouchDevice",value:function(){return"ontouchstart"in window||navigator.maxTouchPoints}},{key:"pointerEventsSupported",value:function(){return!!window.PointerEvent}},{key:"camelCase",value:function(t){return t?t.toLowerCase().trim().split(/[.\-_\s]/g).reduce((function(t,e){return e.length?t+e[0].toUpperCase()+e.slice(1):t})):""}},{key:"chunkArray",value:function(e,n){return t(Array(Math.ceil(e.length/n))).map((function(t,o){return e.slice(n*o,n+n*o)}))}}])&&a(o.prototype,r),u&&a(o,u),Object.defineProperty(o,"prototype",{writable:!1}),n}();s(u,"noop",(function(){}));var c=u;function l(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}var f=function(){function t(e){var n=e.dispatch,o=e.getOptions;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.dispatch=n,this.getOptions=o,c.bindMethods(t,this)}var e,n,o;return e=t,(n=[{key:"handleHighlightKeyDown",value:function(t){var e=this.getOptions(),n=this.getSimpleKeyboardLayoutKey(t);this.dispatch((function(o){var r,i,a=o.getButtonElement(n),s=o.getButtonElement("{".concat(n,"}"));if(a)r=a,i=n;else{if(!s)return;r=s,i="{".concat(n,"}")}r&&(r.style.backgroundColor=e.physicalKeyboardHighlightBgColor||"#dadce4",r.style.color=e.physicalKeyboardHighlightTextColor||"black",e.physicalKeyboardHighlightPress&&(e.physicalKeyboardHighlightPressUsePointerEvents?r.onpointerdown():e.physicalKeyboardHighlightPressUseClick?r.click():o.handleButtonClicked(i,t)))}))}},{key:"handleHighlightKeyUp",value:function(t){var e=this.getOptions(),n=this.getSimpleKeyboardLayoutKey(t);this.dispatch((function(t){var o=t.getButtonElement(n)||t.getButtonElement("{".concat(n,"}"));o&&o.removeAttribute&&(o.removeAttribute("style"),e.physicalKeyboardHighlightPressUsePointerEvents&&o.onpointerup())}))}},{key:"getSimpleKeyboardLayoutKey",value:function(t){var e,n="",o=t.code||t.key||this.keyCodeToKey(null==t?void 0:t.keyCode);return(n=null!=o&&o.includes("Numpad")||null!=o&&o.includes("Shift")||null!=o&&o.includes("Space")||null!=o&&o.includes("Backspace")||null!=o&&o.includes("Control")||null!=o&&o.includes("Alt")||null!=o&&o.includes("Meta")?t.code||"":t.key||this.keyCodeToKey(null==t?void 0:t.keyCode)||"").length>1?null===(e=n)||void 0===e?void 0:e.toLowerCase():n}},{key:"keyCodeToKey",value:function(t){return{8:"Backspace",9:"Tab",13:"Enter",16:"Shift",17:"Ctrl",18:"Alt",19:"Pause",20:"CapsLock",27:"Esc",32:"Space",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",65:"A",66:"B",67:"C",68:"D",69:"E",70:"F",71:"G",72:"H",73:"I",74:"J",75:"K",76:"L",77:"M",78:"N",79:"O",80:"P",81:"Q",82:"R",83:"S",84:"T",85:"U",86:"V",87:"W",88:"X",89:"Y",90:"Z",91:"Meta",96:"Numpad0",97:"Numpad1",98:"Numpad2",99:"Numpad3",100:"Numpad4",101:"Numpad5",102:"Numpad6",103:"Numpad7",104:"Numpad8",105:"Numpad9",106:"NumpadMultiply",107:"NumpadAdd",109:"NumpadSubtract",110:"NumpadDecimal",111:"NumpadDivide",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"}[t]}}])&&l(e.prototype,n),o&&l(e,o),Object.defineProperty(e,"prototype",{writable:!1}),t}();function d(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}var p=function(){function t(e){var n,o,r,i=e.utilities;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),r=0,(o="pageIndex")in(n=this)?Object.defineProperty(n,o,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[o]=r,this.utilities=i,c.bindMethods(t,this),this.pageSize=this.utilities.getOptions().layoutCandidatesPageSize||5}var e,n,o;return e=t,(n=[{key:"destroy",value:function(){this.candidateBoxElement&&(this.candidateBoxElement.remove(),this.pageIndex=0)}},{key:"show",value:function(t){var e=this,n=t.candidateValue,o=t.targetElement,r=t.onSelect;if(n&&n.length){var i=this.utilities.chunkArray(n.split(" "),this.pageSize);this.renderPage({candidateListPages:i,targetElement:o,pageIndex:this.pageIndex,nbPages:i.length,onItemSelected:function(t,n){r(t,n),e.destroy()}})}}},{key:"renderPage",value:function(t){var e,n=this,o=t.candidateListPages,r=t.targetElement,i=t.pageIndex,a=t.nbPages,s=t.onItemSelected;null===(e=this.candidateBoxElement)||void 0===e||e.remove(),this.candidateBoxElement=document.createElement("div"),this.candidateBoxElement.className="hg-candidate-box";var u=document.createElement("ul");u.className="hg-candidate-box-list",o[i].forEach((function(t){var e=document.createElement("li"),n=function(){var t=new MouseEvent("click");return Object.defineProperty(t,"target",{value:e}),t};e.className="hg-candidate-box-list-item",e.textContent=t,e.onclick=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:n();return s(t,e)},u.appendChild(e)}));var c=i>0,l=document.createElement("div");l.classList.add("hg-candidate-box-prev"),c&&l.classList.add("hg-candidate-box-btn-active"),l.onclick=function(){c&&n.renderPage({candidateListPages:o,targetElement:r,pageIndex:i-1,nbPages:a,onItemSelected:s})},this.candidateBoxElement.appendChild(l),this.candidateBoxElement.appendChild(u);var f=i<a-1,d=document.createElement("div");d.classList.add("hg-candidate-box-next"),f&&d.classList.add("hg-candidate-box-btn-active"),d.onclick=function(){f&&n.renderPage({candidateListPages:o,targetElement:r,pageIndex:i+1,nbPages:a,onItemSelected:s})},this.candidateBoxElement.appendChild(d),r.prepend(this.candidateBoxElement)}}])&&d(e.prototype,n),o&&d(e,o),Object.defineProperty(e,"prototype",{writable:!1}),t}();function h(t){return function(t){if(Array.isArray(t))return v(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return v(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return v(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function v(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,o=new Array(e);n<e;n++)o[n]=t[n];return o}function g(t){return(g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function y(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,o)}return n}function m(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function b(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var x=function(){function t(e,n){var o=this;if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),b(this,"defaultName","default"),b(this,"activeInputElement",null),b(this,"handleParams",(function(t,e){var n,o,r;if("string"==typeof t)n=t.split(".").join(""),o=document.querySelector(".".concat(n)),r=e;else if(t instanceof HTMLDivElement){if(!t.className)throw console.warn("Any DOM element passed as parameter must have a class."),new Error("KEYBOARD_DOM_CLASS_ERROR");n=t.className.split(" ")[0],o=t,r=e}else n="simple-keyboard",o=document.querySelector(".".concat(n)),r=t;return{keyboardDOMClass:n,keyboardDOM:o,options:r}})),b(this,"getOptions",(function(){return o.options})),b(this,"getCaretPosition",(function(){return o.caretPosition})),b(this,"getCaretPositionEnd",(function(){return o.caretPositionEnd})),b(this,"registerModule",(function(t,e){o.modules[t]||(o.modules[t]={}),e(o.modules[t])})),b(this,"getKeyboardClassString",(function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];var r=[o.keyboardDOMClass].concat(e).filter((function(t){return!!t}));return r.join(" ")})),"undefined"!=typeof window){var r=this.handleParams(e,n),i=r.keyboardDOMClass,a=r.keyboardDOM,s=r.options,u=void 0===s?{}:s;this.utilities=new c({getOptions:this.getOptions,getCaretPosition:this.getCaretPosition,getCaretPositionEnd:this.getCaretPositionEnd,dispatch:this.dispatch}),this.caretPosition=null,this.caretPositionEnd=null,this.keyboardDOM=a,this.options=function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?y(Object(n),!0).forEach((function(e){b(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):y(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}({layoutName:"default",theme:"hg-theme-default",inputName:"default",preventMouseDownDefault:!1,enableLayoutCandidates:!0,excludeFromLayout:{}},u),this.keyboardPluginClasses="",c.bindMethods(t,this);var l=this.options.inputName,d=void 0===l?this.defaultName:l;if(this.input={},this.input[d]="",this.keyboardDOMClass=i,this.buttonElements={},window.SimpleKeyboardInstances||(window.SimpleKeyboardInstances={}),this.currentInstanceName=this.utilities.camelCase(this.keyboardDOMClass),window.SimpleKeyboardInstances[this.currentInstanceName]=this,this.allKeyboardInstances=window.SimpleKeyboardInstances,this.keyboardInstanceNames=Object.keys(window.SimpleKeyboardInstances),this.isFirstKeyboardInstance=this.keyboardInstanceNames[0]===this.currentInstanceName,this.physicalKeyboard=new f({dispatch:this.dispatch,getOptions:this.getOptions}),this.candidateBox=this.options.enableLayoutCandidates?new p({utilities:this.utilities}):null,!this.keyboardDOM)throw console.warn('".'.concat(i,'" was not found in the DOM.')),new Error("KEYBOARD_DOM_ERROR");this.render(),this.modules={},this.loadModules()}}var e,n,o;return e=t,(n=[{key:"setCaretPosition",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:t;this.caretPosition=t,this.caretPositionEnd=e}},{key:"getInputCandidates",value:function(t){var e=this,n=this.options,o=n.layoutCandidates,r=n.layoutCandidatesCaseSensitiveMatch;if(!o||"object"!==g(o))return{};var i=Object.keys(o).filter((function(n){var o=t.substring(0,e.getCaretPositionEnd()||0)||t,i=new RegExp("".concat(n,"$"),r?"g":"gi");return!!h(o.matchAll(i)).length}));if(i.length>1){var a=i.sort((function(t,e){return e.length-t.length}))[0];return{candidateKey:a,candidateValue:o[a]}}if(i.length){var s=i[0];return{candidateKey:s,candidateValue:o[s]}}return{}}},{key:"showCandidatesBox",value:function(t,e,n){var o=this;this.candidateBox&&this.candidateBox.show({candidateValue:e,targetElement:n,onSelect:function(e,n){var r=o.options.layoutCandidatesCaseSensitiveMatch,i=e.normalize("NFD"),a=o.getInput(o.options.inputName,!0),s=o.getCaretPositionEnd()||0,u=a.substring(0,s||0)||a,c=new RegExp("".concat(t,"$"),r?"g":"gi"),l=u.replace(c,i),f=a.replace(u,l),d=l.length-u.length,p=(s||a.length)+d;p<0&&(p=0),o.setInput(f,o.options.inputName,!0),o.setCaretPosition(p),"function"==typeof o.options.onChange&&o.options.onChange(o.getInput(o.options.inputName,!0),n),"function"==typeof o.options.onChangeAll&&o.options.onChangeAll(o.getAllInputs(),n)}})}},{key:"handleButtonClicked",value:function(t,e){var n=this.options,o=n.inputName,r=void 0===o?this.defaultName:o,i=n.debug;if("{//}"!==t){this.input[r]||(this.input[r]="");var a=this.utilities.getUpdatedInput(t,this.input[r],this.caretPosition,this.caretPositionEnd);if(this.utilities.isStandardButton(t)&&this.activeInputElement&&this.input[r]&&this.input[r]===a&&0===this.caretPosition&&this.caretPositionEnd===a.length)return this.setInput("",this.options.inputName,!0),this.setCaretPosition(0),this.activeInputElement.value="",this.activeInputElement.setSelectionRange(0,0),void this.handleButtonClicked(t,e);if("function"==typeof this.options.onKeyPress&&this.options.onKeyPress(t,e),this.input[r]!==a&&(!this.options.inputPattern||this.options.inputPattern&&this.inputPatternIsValid(a))){if(this.options.maxLength&&this.utilities.handleMaxLength(this.input,a))return;var s=this.utilities.getUpdatedInput(t,this.input[r],this.caretPosition,this.caretPositionEnd,!0);if(this.setInput(s,this.options.inputName,!0),i&&console.log("Input changed:",this.getAllInputs()),this.options.debug&&console.log("Caret at: ",this.getCaretPosition(),this.getCaretPositionEnd(),"(".concat(this.keyboardDOMClass,")")),this.options.syncInstanceInputs&&this.syncInstanceInputs(),"function"==typeof this.options.onChange&&this.options.onChange(this.getInput(this.options.inputName,!0),e),"function"==typeof this.options.onChangeAll&&this.options.onChangeAll(this.getAllInputs(),e),null!=e&&e.target&&this.options.enableLayoutCandidates){var u,c=this.getInputCandidates(a),l=c.candidateKey,f=c.candidateValue;l&&f?this.showCandidatesBox(l,f,this.keyboardDOM):null===(u=this.candidateBox)||void 0===u||u.destroy()}}i&&console.log("Key pressed:",t)}}},{key:"getMouseHold",value:function(){return this.isMouseHold}},{key:"setMouseHold",value:function(t){this.options.syncInstanceInputs?this.dispatch((function(e){e.isMouseHold=t})):this.isMouseHold=t}},{key:"handleButtonMouseDown",value:function(t,e){var n=this;e&&(this.options.preventMouseDownDefault&&e.preventDefault(),this.options.stopMouseDownPropagation&&e.stopPropagation(),e.target.classList.add(this.activeButtonClass)),this.holdInteractionTimeout&&clearTimeout(this.holdInteractionTimeout),this.holdTimeout&&clearTimeout(this.holdTimeout),this.setMouseHold(!0),this.options.disableButtonHold||(this.holdTimeout=window.setTimeout((function(){(n.getMouseHold()&&(!t.includes("{")&&!t.includes("}")||"{delete}"===t||"{backspace}"===t||"{bksp}"===t||"{space}"===t||"{tab}"===t)||"{arrowright}"===t||"{arrowleft}"===t||"{arrowup}"===t||"{arrowdown}"===t)&&(n.options.debug&&console.log("Button held:",t),n.handleButtonHold(t)),clearTimeout(n.holdTimeout)}),500))}},{key:"handleButtonMouseUp",value:function(t,e){var n=this;e&&(this.options.preventMouseUpDefault&&e.preventDefault&&e.preventDefault(),this.options.stopMouseUpPropagation&&e.stopPropagation&&e.stopPropagation(),!(e.target===this.keyboardDOM||e.target&&this.keyboardDOM.contains(e.target)||this.candidateBox&&this.candidateBox.candidateBoxElement&&(e.target===this.candidateBox.candidateBoxElement||e.target&&this.candidateBox.candidateBoxElement.contains(e.target)))&&this.candidateBox&&this.candidateBox.destroy()),this.recurseButtons((function(t){t.classList.remove(n.activeButtonClass)})),this.setMouseHold(!1),this.holdInteractionTimeout&&clearTimeout(this.holdInteractionTimeout),t&&"function"==typeof this.options.onKeyReleased&&this.options.onKeyReleased(t)}},{key:"handleKeyboardContainerMouseDown",value:function(t){this.options.preventMouseDownDefault&&t.preventDefault()}},{key:"handleButtonHold",value:function(t){var e=this;this.holdInteractionTimeout&&clearTimeout(this.holdInteractionTimeout),this.holdInteractionTimeout=window.setTimeout((function(){e.getMouseHold()?(e.handleButtonClicked(t),e.handleButtonHold(t)):clearTimeout(e.holdInteractionTimeout)}),100)}},{key:"syncInstanceInputs",value:function(){var t=this;this.dispatch((function(e){e.replaceInput(t.input),e.setCaretPosition(t.caretPosition,t.caretPositionEnd)}))}},{key:"clearInput",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.options.inputName||this.defaultName;this.input[t]="",this.setCaretPosition(0),this.options.syncInstanceInputs&&this.syncInstanceInputs()}},{key:"getInput",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.options.inputName||this.defaultName,e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(this.options.syncInstanceInputs&&!e&&this.syncInstanceInputs(),this.options.rtl){var n=this.input[t].replace("‫","").replace("‬","");return"‫"+n+"‬"}return this.input[t]}},{key:"getAllInputs",value:function(){var t=this,e={};return Object.keys(this.input).forEach((function(n){e[n]=t.getInput(n,!0)})),e}},{key:"setInput",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.options.inputName||this.defaultName,n=arguments.length>2?arguments[2]:void 0;this.input[e]=t,!n&&this.options.syncInstanceInputs&&this.syncInstanceInputs()}},{key:"replaceInput",value:function(t){this.input=t}},{key:"setOptions",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=this.changedOptions(t);this.options=Object.assign(this.options,t),e.length&&(this.options.debug&&console.log("changedOptions",e),this.onSetOptions(e),this.render())}},{key:"changedOptions",value:function(t){var e=this;return Object.keys(t).filter((function(n){return JSON.stringify(t[n])!==JSON.stringify(e.options[n])}))}},{key:"onSetOptions",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];t.includes("layoutName")&&this.candidateBox&&this.candidateBox.destroy(),(t.includes("layoutCandidatesPageSize")||t.includes("layoutCandidates"))&&this.candidateBox&&(this.candidateBox.destroy(),this.candidateBox=new p({utilities:this.utilities}))}},{key:"resetRows",value:function(){this.keyboardRowsDOM&&this.keyboardRowsDOM.remove(),this.keyboardDOM.className=this.keyboardDOMClass,this.buttonElements={}}},{key:"dispatch",value:function(t){if(!window.SimpleKeyboardInstances)throw console.warn("SimpleKeyboardInstances is not defined. Dispatch cannot be called."),new Error("INSTANCES_VAR_ERROR");return Object.keys(window.SimpleKeyboardInstances).forEach((function(e){t(window.SimpleKeyboardInstances[e],e)}))}},{key:"addButtonTheme",value:function(t,e){var n=this;e&&t&&(t.split(" ").forEach((function(o){e.split(" ").forEach((function(e){n.options.buttonTheme||(n.options.buttonTheme=[]);var r=!1;n.options.buttonTheme.map((function(t){if(null!=t&&t.class.split(" ").includes(e)){r=!0;var n=t.buttons.split(" ");n.includes(o)||(r=!0,n.push(o),t.buttons=n.join(" "))}return t})),r||n.options.buttonTheme.push({class:e,buttons:t})}))})),this.render())}},{key:"removeButtonTheme",value:function(t,e){var n=this;if(!t&&!e)return this.options.buttonTheme=[],void this.render();t&&Array.isArray(this.options.buttonTheme)&&this.options.buttonTheme.length&&(t.split(" ").forEach((function(t){var o,r;null===(o=n.options)||void 0===o||null===(r=o.buttonTheme)||void 0===r||r.map((function(o,r){if(o&&e&&e.includes(o.class)||!e){var i,a,s=null===(i=o)||void 0===i?void 0:i.buttons.split(" ").filter((function(e){return e!==t}));o&&null!=s&&s.length?o.buttons=s.join(" "):(null===(a=n.options.buttonTheme)||void 0===a||a.splice(r,1),o=null)}return o}))})),this.render())}},{key:"getButtonElement",value:function(t){var e,n=this.buttonElements[t];return n&&(e=n.length>1?n:n[0]),e}},{key:"inputPatternIsValid",value:function(t){var e,n=this.options.inputPattern;if((e=n instanceof RegExp?n:n[this.options.inputName||this.defaultName])&&t){var o=e.test(t);return this.options.debug&&console.log('inputPattern ("'.concat(e,'"): ').concat(o?"passed":"did not pass!")),o}return!0}},{key:"setEventListeners",value:function(){!this.isFirstKeyboardInstance&&this.allKeyboardInstances||(this.options.debug&&console.log("Caret handling started (".concat(this.keyboardDOMClass,")")),document.addEventListener("keyup",this.handleKeyUp),document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("mouseup",this.handleMouseUp),document.addEventListener("touchend",this.handleTouchEnd),document.addEventListener("select",this.handleSelect),document.addEventListener("selectionchange",this.handleSelectionChange))}},{key:"handleKeyUp",value:function(t){this.caretEventHandler(t),this.options.physicalKeyboardHighlight&&this.physicalKeyboard.handleHighlightKeyUp(t)}},{key:"handleKeyDown",value:function(t){this.options.physicalKeyboardHighlight&&this.physicalKeyboard.handleHighlightKeyDown(t)}},{key:"handleMouseUp",value:function(t){this.caretEventHandler(t)}},{key:"handleTouchEnd",value:function(t){this.caretEventHandler(t)}},{key:"handleSelect",value:function(t){this.caretEventHandler(t)}},{key:"handleSelectionChange",value:function(t){this.caretEventHandler(t)}},{key:"caretEventHandler",value:function(t){var e,n=this;t.target.tagName&&(e=t.target.tagName.toLowerCase()),this.dispatch((function(o){var r=t.target===o.keyboardDOM||t.target&&o.keyboardDOM.contains(t.target);("textarea"===e||"input"===e&&["text","search","url","tel","password"].includes(t.target.type))&&!o.options.disableCaretPositioning?(o.setCaretPosition(t.target.selectionStart,t.target.selectionEnd),n.activeInputElement=t.target,o.options.debug&&console.log("Caret at: ",o.getCaretPosition(),o.getCaretPositionEnd(),t&&t.target.tagName.toLowerCase(),"(".concat(o.keyboardDOMClass,")"))):!o.options.disableCaretPositioning&&r||"selectionchange"===(null==t?void 0:t.type)||(o.setCaretPosition(null),n.activeInputElement=null,o.options.debug&&console.log('Caret position reset due to "'.concat(null==t?void 0:t.type,'" event'),t))}))}},{key:"recurseButtons",value:function(t){var e=this;t&&Object.keys(this.buttonElements).forEach((function(n){return e.buttonElements[n].forEach(t)}))}},{key:"destroy",value:function(){this.options.debug&&console.log("Destroying simple-keyboard instance: ".concat(this.currentInstanceName)),document.removeEventListener("keyup",this.handleKeyUp),document.removeEventListener("keydown",this.handleKeyDown),document.removeEventListener("mouseup",this.handleMouseUp),document.removeEventListener("touchend",this.handleTouchEnd),document.removeEventListener("select",this.handleSelect),document.removeEventListener("selectionchange",this.handleSelectionChange),document.onpointerup=null,document.ontouchend=null,document.ontouchcancel=null,document.onmouseup=null,this.recurseButtons((function(t){t&&(t.onpointerdown=null,t.onpointerup=null,t.onpointercancel=null,t.ontouchstart=null,t.ontouchend=null,t.ontouchcancel=null,t.onclick=null,t.onmousedown=null,t.onmouseup=null,t.remove(),t=null)})),this.keyboardDOM.onpointerdown=null,this.keyboardDOM.ontouchstart=null,this.keyboardDOM.onmousedown=null,this.resetRows(),this.candidateBox&&(this.candidateBox.destroy(),this.candidateBox=null),this.activeInputElement=null,this.keyboardDOM.innerHTML="",window.SimpleKeyboardInstances[this.currentInstanceName]=null,delete window.SimpleKeyboardInstances[this.currentInstanceName],this.initialized=!1}},{key:"getButtonThemeClasses",value:function(t){var e=this.options.buttonTheme,n=[];return Array.isArray(e)&&e.forEach((function(e){if(e&&e.class&&"string"==typeof e.class&&e.buttons&&"string"==typeof e.buttons){var o=e.class.split(" ");e.buttons.split(" ").includes(t)&&(n=[].concat(h(n),h(o)))}else console.warn('Incorrect "buttonTheme". Please check the documentation.',e)})),n}},{key:"setDOMButtonAttributes",value:function(t,e){var n=this.options.buttonAttributes;Array.isArray(n)&&n.forEach((function(n){n.attribute&&"string"==typeof n.attribute&&n.value&&"string"==typeof n.value&&n.buttons&&"string"==typeof n.buttons?n.buttons.split(" ").includes(t)&&e(n.attribute,n.value):console.warn('Incorrect "buttonAttributes". Please check the documentation.',n)}))}},{key:"onTouchDeviceDetected",value:function(){this.processAutoTouchEvents(),this.disableContextualWindow()}},{key:"disableContextualWindow",value:function(){window.oncontextmenu=function(t){if(t.target.classList.contains("hg-button"))return t.preventDefault(),t.stopPropagation(),!1}}},{key:"processAutoTouchEvents",value:function(){this.options.autoUseTouchEvents&&(this.options.useTouchEvents=!0,this.options.debug&&console.log("autoUseTouchEvents: Touch device detected, useTouchEvents enabled."))}},{key:"onInit",value:function(){this.options.debug&&console.log("".concat(this.keyboardDOMClass," Initialized")),this.setEventListeners(),"function"==typeof this.options.onInit&&this.options.onInit(this)}},{key:"beforeFirstRender",value:function(){this.utilities.isTouchDevice()&&this.onTouchDeviceDetected(),"function"==typeof this.options.beforeFirstRender&&this.options.beforeFirstRender(this),this.isFirstKeyboardInstance&&this.utilities.pointerEventsSupported()&&!this.options.useTouchEvents&&!this.options.useMouseEvents&&this.options.debug&&console.log("Using PointerEvents as it is supported by this browser"),this.options.useTouchEvents&&this.options.debug&&console.log("useTouchEvents has been enabled. Only touch events will be used.")}},{key:"beforeRender",value:function(){"function"==typeof this.options.beforeRender&&this.options.beforeRender(this)}},{key:"onRender",value:function(){"function"==typeof this.options.onRender&&this.options.onRender(this)}},{key:"onModulesLoaded",value:function(){"function"==typeof this.options.onModulesLoaded&&this.options.onModulesLoaded(this)}},{key:"loadModules",value:function(){var t=this;Array.isArray(this.options.modules)&&(this.options.modules.forEach((function(e){var n=new e(t);n.init&&n.init(t)})),this.keyboardPluginClasses="modules-loaded",this.render(),this.onModulesLoaded())}},{key:"getModuleProp",value:function(t,e){return!!this.modules[t]&&this.modules[t][e]}},{key:"getModulesList",value:function(){return Object.keys(this.modules)}},{key:"parseRowDOMContainers",value:function(t,e,n,o){var r=this,i=Array.from(t.children),a=0;return i.length&&n.forEach((function(n,s){var u=o[s];if(!(u&&u>n))return!1;var c=n-a,l=u-a,f=document.createElement("div");f.className+="hg-button-container";var d="".concat(r.options.layoutName,"-r").concat(e,"c").concat(s);f.setAttribute("data-skUID",d);var p=i.splice(c,l-c+1);a=l-c,p.forEach((function(t){return f.appendChild(t)})),i.splice(c,0,f),t.innerHTML="",i.forEach((function(e){return t.appendChild(e)})),r.options.debug&&console.log("rowDOMContainer",p,c,l,a+1)})),t}},{key:"render",value:function(){var t=this;this.resetRows(),this.initialized||this.beforeFirstRender(),this.beforeRender();var e="hg-layout-".concat(this.options.layoutName),n=this.options.layout||{default:["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}","{tab} q w e r t y u i o p [ ] \\","{lock} a s d f g h j k l ; ' {enter}","{shift} z x c v b n m , . / {shift}",".com @ {space}"],shift:["~ ! @ # $ % ^ & * ( ) _ + {bksp}","{tab} Q W E R T Y U I O P { } |",'{lock} A S D F G H J K L : " {enter}',"{shift} Z X C V B N M < > ? {shift}",".com @ {space}"]},o=this.options.useTouchEvents||!1,r=o?"hg-touch-events":"",i=this.options.useMouseEvents||!1,a=this.options.disableRowButtonContainers;this.keyboardDOM.className=this.getKeyboardClassString(this.options.theme,e,this.keyboardPluginClasses,r),this.keyboardRowsDOM=document.createElement("div"),this.keyboardRowsDOM.className="hg-rows",n[this.options.layoutName||this.defaultName].forEach((function(e,n){var r=e.split(" ");t.options.excludeFromLayout&&t.options.excludeFromLayout[t.options.layoutName||t.defaultName]&&(r=r.filter((function(e){return t.options.excludeFromLayout&&!t.options.excludeFromLayout[t.options.layoutName||t.defaultName].includes(e)})));var s=document.createElement("div");s.className+="hg-row";var u=[],c=[];r.forEach((function(e,r){var l,f=!a&&"string"==typeof e&&e.length>1&&0===e.indexOf("["),d=!a&&"string"==typeof e&&e.length>1&&e.indexOf("]")===e.length-1;f&&(u.push(r),e=e.replace(/\[/g,"")),d&&(c.push(r),e=e.replace(/\]/g,""));var p=t.utilities.getButtonClass(e),v=t.utilities.getButtonDisplayName(e,t.options.display,t.options.mergeDisplay),g=t.options.useButtonTag?"button":"div",y=document.createElement(g);y.className+="hg-button ".concat(p),(l=y.classList).add.apply(l,h(t.getButtonThemeClasses(e))),t.setDOMButtonAttributes(e,(function(t,e){y.setAttribute(t,e)})),t.activeButtonClass="hg-activeButton",!t.utilities.pointerEventsSupported()||o||i?o?(y.ontouchstart=function(n){t.handleButtonClicked(e,n),t.handleButtonMouseDown(e,n)},y.ontouchend=function(n){t.handleButtonMouseUp(e,n)},y.ontouchcancel=function(n){t.handleButtonMouseUp(e,n)}):(y.onclick=function(n){t.setMouseHold(!1),t.handleButtonClicked(e,n)},y.onmousedown=function(n){t.handleButtonMouseDown(e,n)},y.onmouseup=function(n){t.handleButtonMouseUp(e,n)}):(y.onpointerdown=function(n){t.handleButtonClicked(e,n),t.handleButtonMouseDown(e,n)},y.onpointerup=function(n){t.handleButtonMouseUp(e,n)},y.onpointercancel=function(n){t.handleButtonMouseUp(e,n)}),y.setAttribute("data-skBtn",e);var m="".concat(t.options.layoutName,"-r").concat(n,"b").concat(r);y.setAttribute("data-skBtnUID",m);var b=document.createElement("span");b.innerHTML=v,y.appendChild(b),t.buttonElements[e]||(t.buttonElements[e]=[]),t.buttonElements[e].push(y),s.appendChild(y)})),s=t.parseRowDOMContainers(s,n,u,c),t.keyboardRowsDOM.appendChild(s)})),this.keyboardDOM.appendChild(this.keyboardRowsDOM),this.onRender(),this.initialized||(this.initialized=!0,!this.utilities.pointerEventsSupported()||o||i?o?(document.ontouchend=function(e){return t.handleButtonMouseUp(void 0,e)},document.ontouchcancel=function(e){return t.handleButtonMouseUp(void 0,e)},this.keyboardDOM.ontouchstart=function(e){return t.handleKeyboardContainerMouseDown(e)}):o||(document.onmouseup=function(e){return t.handleButtonMouseUp(void 0,e)},this.keyboardDOM.onmousedown=function(e){return t.handleKeyboardContainerMouseDown(e)}):(document.onpointerup=function(e){return t.handleButtonMouseUp(void 0,e)},this.keyboardDOM.onpointerdown=function(e){return t.handleKeyboardContainerMouseDown(e)}),this.onInit())}}])&&m(e.prototype,n),o&&m(e,o),Object.defineProperty(e,"prototype",{writable:!1}),t}()}(),o}()}));

/***/ }),

/***/ "./source/js/action/AccessibilityProfiles.js":
/*!***************************************************!*\
  !*** ./source/js/action/AccessibilityProfiles.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AccessibilityProfiles": () => (/* binding */ AccessibilityProfiles)
/* harmony export */ });
/* harmony import */ var _import_tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../import/tools */ "./source/js/import/tools.js");


class AccessibilityProfiles {

    /** Initialise Accessibility Profiles. */
    static init() {

        /** Process only if we have at least one enabled profile. */
        if ( ! AccessibilityProfiles.isProfiles ) { return; }

        const profiles = document.querySelectorAll( '#mdp-readabler-accessibility-profiles-box .mdp-readabler-accessibility-profile-item' );

        /** Enable/Disable profile by click. */
        profiles.forEach( profileItem => profileItem.addEventListener( 'click', (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.delay)( AccessibilityProfiles.toggleProfile, 100 ) ) );

        /** Enable/Disable profile by keydown. */
        profiles.forEach( profileItem => profileItem.addEventListener( 'keydown', (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.delay)( AccessibilityProfiles.toggleProfile, 100 ) ) );

    }

    /**
     * Enable/Disable profile by click and keydown.
     **/
    static toggleProfile( e ) {

        if ( e.type === 'keydown' && e.keyCode !== 13 ) { return }

        let profileItem = this.closest( '.mdp-readabler-accessibility-profile-item' );
        let switcher = profileItem.querySelector( 'input[type="checkbox"]' );

        /** Select profile. */
        if ( ! profileItem.classList.contains( 'mdp-active' ) ) {

            /** Disable previously enabled profile. */
            let prevProfile = document.querySelector( '#mdp-readabler-accessibility-profiles-box .mdp-readabler-accessibility-profile-item.mdp-active' );
            if ( prevProfile ) { prevProfile.click(); }

            /** Enable current profile. */
            profileItem.classList.add( 'mdp-active' );
            switcher.checked = true;

            /** Save current profile to localStorage. */
            (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.setLocal)( profileItem.id, '1' );

            /** Get current profile name. */
            let profileName = profileItem.id.replace( 'mdp-readabler-accessibility-profile-', '' );
            profileName = (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.toCamelCase)( profileName, '-' );
            profileName = profileName.replace( '-', '' );
            profileName = 'profile' + profileName;

            /** Enable profile. */
            AccessibilityProfiles[profileName]( true );

            /** Deselect profile. */
        } else {

            profileItem.classList.remove( 'mdp-active' );
            switcher.checked = false;

            /** Disable profile to localStorage. */
            (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.setLocal)( profileItem.id, '0' );

            /** Get current profile name. */
            let profileName = profileItem.id.replace( 'mdp-readabler-accessibility-profile-', '' );
            profileName = (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.toCamelCase)( profileName, '-' );
            profileName = profileName.replace( '-', '' );
            profileName = 'profile' + profileName;

            /** Disable profile. */
            AccessibilityProfiles[profileName]( false );

        }

    }

    /**
     * Enable profile from localstorage.
     **/
    static loadSaved() {

        const profiles = document.querySelectorAll( '#mdp-readabler-accessibility-profiles-box .mdp-readabler-accessibility-profile-item' );
        profiles.forEach( profileItem => {

            let value = (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.getLocal)( profileItem.id );

            if ( '1' !== value ) { return; }

            let switcher = profileItem.querySelector( 'input[type="checkbox"]' );
            switcher.checked = true;
            profileItem.click();

        } );

    }

    /**
     * Enable selected profile.
     **/
    static profileEpilepsy( enable ) {

        let fClass = 'mdp-readabler-profile-epilepsy';

        /** Enable Epilepsy Profile. */
        if ( enable ) {

            /** Add class to body as flag. */
            document.body.classList.add( fClass );

            let lowSaturation = document.querySelector( '#mdp-readabler-action-low-saturation:not(.mdp-active)' );
            if ( lowSaturation ) { lowSaturation.click(); }

            let stopAnimations = document.querySelector( '#mdp-readabler-action-stop-animations:not(.mdp-active)' );
            if ( stopAnimations ) { stopAnimations.click(); }

        }

        /** Disable Epilepsy Profile. */
        else {

            document.body.classList.remove( fClass );

            let lowSaturation = document.querySelector( '#mdp-readabler-action-low-saturation.mdp-active' );
            if ( lowSaturation ) { lowSaturation.click(); }

            let stopAnimations = document.querySelector( '#mdp-readabler-action-stop-animations.mdp-active' );
            if ( stopAnimations ) { stopAnimations.click(); }

        }

    }

    static profileVisuallyImpaired( enable ) {

        let fClass = 'mdp-readabler-profile-visually-impaired';

        /** Enable Visually Impaired Profile. */
        if ( enable ) {

            /** Add class to body as flag. */
            document.body.classList.add( fClass );

            let readableFont = document.querySelector( '#mdp-readabler-action-readable-font:not(.mdp-active)' );
            if ( readableFont ) { readableFont.click(); }

            let highSaturation = document.querySelector( '#mdp-readabler-action-high-saturation:not(.mdp-active)' );
            if ( highSaturation ) { highSaturation.click(); }

        }

        /** Disable Visually Impaired Profile. */
        else {

            document.body.classList.remove( fClass );

            let readableFont = document.querySelector( '#mdp-readabler-action-readable-font.mdp-active' );
            if ( readableFont ) { readableFont.click(); }

            let highSaturation = document.querySelector( '#mdp-readabler-action-high-saturation.mdp-active' );
            if ( highSaturation ) { highSaturation.click(); }

        }

    }

    static profileCognitiveDisability( enable ) {

        let fClass = 'mdp-readabler-profile-cognitive-disability';

        /** Enable Cognitive Disability Profile. */
        if ( enable ) {

            /** Add class to body as flag. */
            document.body.classList.add( fClass );

            let highlightTitles = document.querySelector( '#mdp-readabler-action-highlight-titles:not(.mdp-active)' );
            if ( highlightTitles ) { highlightTitles.click(); }

            let highlightLinks = document.querySelector( '#mdp-readabler-action-highlight-links:not(.mdp-active)' );
            if ( highlightLinks ) { highlightLinks.click(); }

            let stopAnimations = document.querySelector( '#mdp-readabler-action-stop-animations:not(.mdp-active)' );
            if ( stopAnimations ) { stopAnimations.click(); }

        }

        /** Disable Cognitive Disability Profile. */
        else {

            document.body.classList.remove( fClass );

            let highlightTitles = document.querySelector( '#mdp-readabler-action-highlight-titles.mdp-active' );
            if ( highlightTitles ) { highlightTitles.click(); }

            let highlightLinks = document.querySelector( '#mdp-readabler-action-highlight-links.mdp-active' );
            if ( highlightLinks ) { highlightLinks.click(); }

            let stopAnimations = document.querySelector( '#mdp-readabler-action-stop-animations.mdp-active' );
            if ( stopAnimations ) { stopAnimations.click(); }

        }

    }

    static profileAdhdFriendly( enable ) {

        let fClass = 'mdp-readabler-profile-adhd-friendly';

        /** Enable ADHD Friendly Profile. */
        if ( enable ) {

            /** Add class to body as flag. */
            document.body.classList.add( fClass );

            let highSaturation = document.querySelector( '#mdp-readabler-action-high-saturation:not(.mdp-active)' );
            if ( highSaturation ) { highSaturation.click(); }

            let stopAnimations = document.querySelector( '#mdp-readabler-action-stop-animations:not(.mdp-active)' );
            if ( stopAnimations ) { stopAnimations.click(); }

            let readingMask = document.querySelector( '#mdp-readabler-action-reading-mask:not(.mdp-active)' );
            if ( readingMask ) { readingMask.click(); }

        }

        /** Disable ADHD Friendly Profile. */
        else {

            document.body.classList.remove( fClass );

            let highSaturation = document.querySelector( '#mdp-readabler-action-high-saturation.mdp-active' );
            if ( highSaturation ) { highSaturation.click(); }

            let stopAnimations = document.querySelector( '#mdp-readabler-action-stop-animations.mdp-active' );
            if ( stopAnimations ) { stopAnimations.click(); }

            let readingMask = document.querySelector( '#mdp-readabler-action-reading-mask.mdp-active' );
            if ( readingMask ) { readingMask.click(); }

        }

    }

    static profileBlindUsers( enable ) {

        let fClass = 'mdp-readabler-profile-blind-users';

        /** Enable Blind Users Profile. */
        if ( enable ) {

            /** Add class to body as flag. */
            document.body.classList.add( fClass );

            let readableFont = document.querySelector( '#mdp-readabler-action-readable-font:not(.mdp-active)' );
            if ( readableFont ) { readableFont.click(); }

            let virtualKeyboard = document.querySelector( '#mdp-readabler-action-virtual-keyboard:not(.mdp-active)' );
            if ( virtualKeyboard ) { virtualKeyboard.click(); }

            let textToSpeech = document.querySelector( '#mdp-readabler-action-text-to-speech:not(.mdp-active)' );
            if ( textToSpeech ) { textToSpeech.click(); }

            let keyboardNavigation = document.querySelector( '#mdp-readabler-action-keyboard-navigation:not(.mdp-active)' );
            if ( keyboardNavigation ) { keyboardNavigation.click(); }

        }

        /** Disable Blind Users Profile. */
        else {

            document.body.classList.remove( fClass );

            let readableFont = document.querySelector( '#mdp-readabler-action-readable-font.mdp-active' );
            if ( readableFont ) { readableFont.click(); }

            let virtualKeyboard = document.querySelector( '#mdp-readabler-action-virtual-keyboard.mdp-active' );
            if ( virtualKeyboard ) { virtualKeyboard.click(); }

            let textToSpeech = document.querySelector( '#mdp-readabler-action-text-to-speech.mdp-active' );
            if ( textToSpeech ) { textToSpeech.click(); }

            let keyboardNavigation = document.querySelector( '#mdp-readabler-action-keyboard-navigation.mdp-active' );
            if ( keyboardNavigation ) { keyboardNavigation.click(); }

        }

    }

    /**
     * Check do we have enabled any profile.
     **/
    static isProfiles() {

        return !! (
            readablerOptions.profileEpilepsy ||
            readablerOptions.profileVisuallyImpaired ||
            readablerOptions.profileCognitiveDisability ||
            readablerOptions.profileAdhdFriendly ||
            readablerOptions.profileBlindUsers
        );

    }

}


/***/ }),

/***/ "./source/js/action/ActionAccessibilityStatement.js":
/*!**********************************************************!*\
  !*** ./source/js/action/ActionAccessibilityStatement.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionAccessibilityStatement": () => (/* binding */ ActionAccessibilityStatement)
/* harmony export */ });
class ActionAccessibilityStatement {

    /**
     * Initialise Accessibility Statement action.
     **/
    static init( options ) {

        if ( options.accessibilityStatement && [ 'iframe', 'html' ].includes( options.accessibilityStatementType ) ) {

            // Exit if link is disabled
            if ( null === document.getElementById( 'mdp-readabler-statement-btn' ) ) { return; }

            /** Listen for show statement button click. */
            let btn = document.getElementById( 'mdp-readabler-statement-btn' );
            btn.addEventListener( 'click', ActionAccessibilityStatement.show );

            let closeBtn = document.getElementById( 'mdp-readabler-close-statement-btn' );
            closeBtn.addEventListener( 'click', ActionAccessibilityStatement.close );

        }

    }

    static show( e ) {

        e.preventDefault();

        let box = document.getElementById( 'mdp-readabler-accessibility-statement-box' );
        box.classList.add( 'mdp-open' );

    }

    static close( e ) {

        e.preventDefault();

        let box = document.getElementById( 'mdp-readabler-accessibility-statement-box' );
        box.classList.remove( 'mdp-open' );

    }

}


/***/ }),

/***/ "./source/js/action/ActionAlignCenter.js":
/*!***********************************************!*\
  !*** ./source/js/action/ActionAlignCenter.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionAlignCenter": () => (/* binding */ ActionAlignCenter)
/* harmony export */ });
class ActionAlignCenter {

    /**
     * Initialise Align Center action.
     **/
    static init() {

        /** Listen for Align Center change. */
        let alignCenter = document.querySelector( '#mdp-readabler-action-align-center' );
        alignCenter.addEventListener( 'ReadablerToggleBoxChanged', ActionAlignCenter.alignCenter );

    }

    /**
     * Toggle Align Center styles.
     **/
    static alignCenter( e ) {

        /** Remove class from body to reset align to default values. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-align-center' );
            return;

        }

        /** Disable other buttons in button group. */
        ActionAlignCenter.disableOthers();

        /** Add class to body, to apply to align styles. */
        document.body.classList.add( 'mdp-readabler-align-center' );

        /** Add CSS to header. */
        const alignCenterStyle = document.createElement( 'style' );
        alignCenterStyle.innerHTML = `
                /*noinspection CssUnusedSymbol*/
                body.mdp-readabler-align-center,
                body.mdp-readabler-align-center h1,
                body.mdp-readabler-align-center h1 span,
                body.mdp-readabler-align-center h2,
                body.mdp-readabler-align-center h2 span,
                body.mdp-readabler-align-center h3,
                body.mdp-readabler-align-center h3 span,
                body.mdp-readabler-align-center h4,
                body.mdp-readabler-align-center h4 span,
                body.mdp-readabler-align-center h5,
                body.mdp-readabler-align-center h5 span,
                body.mdp-readabler-align-center h6,
                body.mdp-readabler-align-center h6 span,

                body.mdp-readabler-align-center p,
                body.mdp-readabler-align-center li,
                body.mdp-readabler-align-center label,
                body.mdp-readabler-align-center input,
                body.mdp-readabler-align-center select,
                body.mdp-readabler-align-center textarea,
                body.mdp-readabler-align-center legend,
                body.mdp-readabler-align-center code,
                body.mdp-readabler-align-center pre,
                body.mdp-readabler-align-center dd,
                body.mdp-readabler-align-center dt,
                body.mdp-readabler-align-center span,
                body.mdp-readabler-align-center blockquote {
                    text-align: center !important;
                }
            `;

        document.head.appendChild( alignCenterStyle );

    }

    /**
     * Disable other buttons in button group.
     **/
    static disableOthers() {

        /** Disable Align Left if enabled. */
        let left = document.getElementById( 'mdp-readabler-action-align-left' );

        if ( null !== left ) {

            if ( left.classList.contains( 'mdp-active') ) {
                left.click();
            }

        }

        /** Disable Align Right if enabled. */
        let right = document.getElementById( 'mdp-readabler-action-align-right' );

        if ( null !== right ) {

            if ( right.classList.contains( 'mdp-active') ) {
                right.click();
            }

        }

    }

}


/***/ }),

/***/ "./source/js/action/ActionAlignLeft.js":
/*!*********************************************!*\
  !*** ./source/js/action/ActionAlignLeft.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionAlignLeft": () => (/* binding */ ActionAlignLeft)
/* harmony export */ });
class ActionAlignLeft {

    /**
     * Initialise Align Left action.
     **/
    static init() {

        /** Listen for Align Left change. */
        let alignLeft = document.querySelector( '#mdp-readabler-action-align-left' );
        alignLeft.addEventListener( 'ReadablerToggleBoxChanged', ActionAlignLeft.alignLeft );

    }

    /**
     * Toggle Align Left styles.
     **/
    static alignLeft( e ) {

        /** Remove class from body to reset align to default values. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-align-left' );
            return;

        }

        /** Disable other buttons in button group. */
        ActionAlignLeft.disableOthers();

        /** Add class to body, to apply to align styles. */
        document.body.classList.add( 'mdp-readabler-align-left' );

        /** Add CSS to header. */
        const alignLeftStyle = document.createElement( 'style' );
        alignLeftStyle.innerHTML = `
                /*noinspection CssUnusedSymbol*/
                body.mdp-readabler-align-left,
                body.mdp-readabler-align-left h1,
                body.mdp-readabler-align-left h1 span,
                body.mdp-readabler-align-left h2,
                body.mdp-readabler-align-left h2 span,
                body.mdp-readabler-align-left h3,
                body.mdp-readabler-align-left h3 span,
                body.mdp-readabler-align-left h4,
                body.mdp-readabler-align-left h4 span,
                body.mdp-readabler-align-left h5,
                body.mdp-readabler-align-left h5 span,
                body.mdp-readabler-align-left h6,
                body.mdp-readabler-align-left h6 span,

                body.mdp-readabler-align-left p,
                body.mdp-readabler-align-left li,
                body.mdp-readabler-align-left label,
                body.mdp-readabler-align-left input,
                body.mdp-readabler-align-left select,
                body.mdp-readabler-align-left textarea,
                body.mdp-readabler-align-left legend,
                body.mdp-readabler-align-left code,
                body.mdp-readabler-align-left pre,
                body.mdp-readabler-align-left dd,
                body.mdp-readabler-align-left dt,
                body.mdp-readabler-align-left span,
                body.mdp-readabler-align-left blockquote {
                    text-align: left !important;
                }
            `;

        document.head.appendChild( alignLeftStyle );

    }

    /**
     * Disable other buttons in button group.
     **/
    static disableOthers() {

        /** Disable Align Center if enabled. */
        let center = document.getElementById( 'mdp-readabler-action-align-center' );

        if ( null !== center ) {

            if ( center.classList.contains( 'mdp-active') ) {
                center.click();
            }

        }

        /** Disable Align Right if enabled. */
        let right = document.getElementById( 'mdp-readabler-action-align-right' );

        if ( null !== right ) {

            if ( right.classList.contains( 'mdp-active') ) {
                right.click();
            }

        }

    }

}


/***/ }),

/***/ "./source/js/action/ActionAlignRight.js":
/*!**********************************************!*\
  !*** ./source/js/action/ActionAlignRight.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionAlignRight": () => (/* binding */ ActionAlignRight)
/* harmony export */ });
class ActionAlignRight {

    /**
     * Initialise Align Right action.
     **/
    static init() {

        /** Listen for Align Right change. */
        let alignRight = document.querySelector( '#mdp-readabler-action-align-right' );
        alignRight.addEventListener( 'ReadablerToggleBoxChanged', ActionAlignRight.alignRight );

    }

    /**
     * Toggle Align Right styles.
     **/
    static alignRight( e ) {

        /** Remove class from body to reset align to default values. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-align-right' );
            return;

        }

        /** Disable other buttons in button group. */
        ActionAlignRight.disableOthers();

        /** Add class to body, to apply to align styles. */
        document.body.classList.add( 'mdp-readabler-align-right' );

        /** Add CSS to header. */
        const alignRightStyle = document.createElement( 'style' );
        alignRightStyle.innerHTML = `
                /*noinspection CssUnusedSymbol*/
                body.mdp-readabler-align-right,
                body.mdp-readabler-align-right h1,
                body.mdp-readabler-align-right h1 span,
                body.mdp-readabler-align-right h2,
                body.mdp-readabler-align-right h2 span,
                body.mdp-readabler-align-right h3,
                body.mdp-readabler-align-right h3 span,
                body.mdp-readabler-align-right h4,
                body.mdp-readabler-align-right h4 span,
                body.mdp-readabler-align-right h5,
                body.mdp-readabler-align-right h5 span,
                body.mdp-readabler-align-right h6,
                body.mdp-readabler-align-right h6 span,

                body.mdp-readabler-align-right p,
                body.mdp-readabler-align-right li,
                body.mdp-readabler-align-right label,
                body.mdp-readabler-align-right input,
                body.mdp-readabler-align-right select,
                body.mdp-readabler-align-right textarea,
                body.mdp-readabler-align-right legend,
                body.mdp-readabler-align-right code,
                body.mdp-readabler-align-right pre,
                body.mdp-readabler-align-right dd,
                body.mdp-readabler-align-right dt,
                body.mdp-readabler-align-right span,
                body.mdp-readabler-align-right blockquote {
                    text-align: right !important;
                }
            `;

        document.head.appendChild( alignRightStyle );

    }

    /**
     * Disable other buttons in button group.
     **/
    static disableOthers() {

        /** Disable Align Center if enabled. */
        let center = document.getElementById( 'mdp-readabler-action-align-center' );

        if ( null !== center ) {

            if ( center.classList.contains( 'mdp-active') ) {
                center.click();
            }

        }

        /** Disable Align Left if enabled. */
        let left = document.getElementById( 'mdp-readabler-action-align-left' );

        if ( null !== left ) {

            if ( left.classList.contains( 'mdp-active') ) {
                left.click();
            }

        }

    }

}


/***/ }),

/***/ "./source/js/action/ActionBackgroundColors.js":
/*!****************************************************!*\
  !*** ./source/js/action/ActionBackgroundColors.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionBackgroundColors": () => (/* binding */ ActionBackgroundColors)
/* harmony export */ });
class ActionBackgroundColors {

    /**
     * Initialise Background Colors action.
     **/
    static init() {

        /** Listen for Background Colors change. */
        let backgroundColors = document.querySelector( '#mdp-readabler-action-background-colors' );
        backgroundColors.addEventListener( 'ReadablerPaletteChanged', ActionBackgroundColors.backgroundColors );

    }

    /**
     * Change Background Color action.
     **/
    static backgroundColors( e ) {

        let color = e.detail.color;

        /** Remove class from body to reset Background colors to default state. */
        if ( null === color ) {

            /** Add class to body, to apply styles. */
            document.body.classList.remove( 'mdp-readabler-background-colors' );
            return;

        }

        /** Add class to body, to apply styles. */
        document.body.classList.add( 'mdp-readabler-background-colors' );

        /** Add CSS to header. */
        const backgroundColorsStyle = document.createElement( 'style' );
        backgroundColorsStyle.innerHTML = `
                /*noinspection CssUnusedSymbol*/
                body.mdp-readabler-background-colors,
                body.mdp-readabler-background-colors h1,
                body.mdp-readabler-background-colors h1 span,
                body.mdp-readabler-background-colors h2,
                body.mdp-readabler-background-colors h2 span,
                body.mdp-readabler-background-colors h3,
                body.mdp-readabler-background-colors h3 span,
                body.mdp-readabler-background-colors h4,
                body.mdp-readabler-background-colors h4 span,
                body.mdp-readabler-background-colors h5,
                body.mdp-readabler-background-colors h5 span,
                body.mdp-readabler-background-colors h6,
                body.mdp-readabler-background-colors h6 span,

                body.mdp-readabler-background-colors p,
                body.mdp-readabler-background-colors li,
                body.mdp-readabler-background-colors label,
                body.mdp-readabler-background-colors input,
                body.mdp-readabler-background-colors select,
                body.mdp-readabler-background-colors textarea,
                body.mdp-readabler-background-colors legend,
                body.mdp-readabler-background-colors code,
                body.mdp-readabler-background-colors pre,
                body.mdp-readabler-background-colors dd,
                body.mdp-readabler-background-colors dt,
                body.mdp-readabler-background-colors span,
                body.mdp-readabler-background-colors blockquote {
                    background-color: ${color} !important;
                }
            `;

        document.head.appendChild( backgroundColorsStyle );

    }

}


/***/ }),

/***/ "./source/js/action/ActionBigBlackCursor.js":
/*!**************************************************!*\
  !*** ./source/js/action/ActionBigBlackCursor.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionBigBlackCursor": () => (/* binding */ ActionBigBlackCursor)
/* harmony export */ });
class ActionBigBlackCursor {

    /**
     * Initialise Big Black Cursor action.
     **/
    static init() {

        /** Listen for Big Black Cursor change. */
        let bigBlackCursor = document.querySelector( '#mdp-readabler-action-big-black-cursor' );

        bigBlackCursor.addEventListener( 'ReadablerToggleBoxChanged', ActionBigBlackCursor.bigBlackCursor );

    }

    static bigBlackCursor( e ) {

        /** Remove class from body to reset to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-big-black-cursor' );
            return;

        }

        /** Disable Big White Cursor if  it's enabled. */
        ActionBigBlackCursor.disableWhite();

        /** Add class to body as flag. */
        document.body.classList.add( 'mdp-readabler-big-black-cursor' );

        /** Add CSS to header. */
        const bigBlackCursorStyle = document.createElement( 'style' );
        bigBlackCursorStyle.innerHTML = `

                /*noinspection CssUnusedSymbol*/
                body.mdp-readabler-big-black-cursor,
                body.mdp-readabler-big-black-cursor * {
                    /*noinspection CssUnknownTarget*/
                    cursor: url("${ readablerOptions.path }/img/cursor/black-cursor.svg"), default !important
                }
                
                body.mdp-readabler-big-black-cursor * input, 
                body.mdp-readabler-big-black-cursor * textarea, 
                body.mdp-readabler-big-black-cursor * select, 
                body.mdp-readabler-big-black-cursor * a, 
                body.mdp-readabler-big-black-cursor * button, 
                body.mdp-readabler-big-black-cursor * [role=button] {
                    /*noinspection CssUnknownTarget*/
                    cursor: url("${ readablerOptions.path }/img/cursor/black-pointer.svg"), default !important;
                }
                
            `;

        document.head.appendChild( bigBlackCursorStyle );

    }

    static disableWhite() {

        /** Disable Big White Cursor if it's enabled. */
        let bigWhiteCursorBtn = document.getElementById( 'mdp-readabler-action-big-white-cursor' );

        if ( null === bigWhiteCursorBtn ) { return; }

        if ( bigWhiteCursorBtn.classList.contains( 'mdp-active') ) {
            bigWhiteCursorBtn.click();
        }

    }

}


/***/ }),

/***/ "./source/js/action/ActionBigWhiteCursor.js":
/*!**************************************************!*\
  !*** ./source/js/action/ActionBigWhiteCursor.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionBigWhiteCursor": () => (/* binding */ ActionBigWhiteCursor)
/* harmony export */ });
class ActionBigWhiteCursor {

    /**
     * Initialise Big White Cursor action.
     **/
    static init() {

        /** Listen for Big White Cursor change. */
        let bigWhiteCursor = document.querySelector( '#mdp-readabler-action-big-white-cursor' );
        bigWhiteCursor.addEventListener( 'ReadablerToggleBoxChanged', ActionBigWhiteCursor.bigWhiteCursor );

    }

    static bigWhiteCursor( e ) {

        /** Remove class from body to reset to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-big-white-cursor' );
            return;

        }

        /** Disable black cursor. */
        ActionBigWhiteCursor.disableBlack();

        /** Add class to body as flag. */
        document.body.classList.add( 'mdp-readabler-big-white-cursor' );

        /** Add CSS to header. */
        const bigWhiteCursorStyle = document.createElement( 'style' );
        bigWhiteCursorStyle.innerHTML = `

                /*noinspection CssUnusedSymbol*/
                body.mdp-readabler-big-white-cursor,
                body.mdp-readabler-big-white-cursor * {
                    /*noinspection CssUnknownTarget*/
                    cursor: url("${ readablerOptions.path }/img/cursor/white-cursor.svg"), default !important
                }
                
                body.mdp-readabler-big-white-cursor * input, 
                body.mdp-readabler-big-white-cursor * textarea, 
                body.mdp-readabler-big-white-cursor * select, 
                body.mdp-readabler-big-white-cursor * a, 
                body.mdp-readabler-big-white-cursor * button, 
                body.mdp-readabler-big-white-cursor * [role=button] {
                    /*noinspection CssUnknownTarget*/
                    cursor: url("${ readablerOptions.path }/img/cursor/white-pointer.svg"), default !important;
                }
                
            `;

        document.head.appendChild( bigWhiteCursorStyle );

    }

    static disableBlack() {

        /** Disable Big Black Cursor if it's enabled. */
        let bigBlackCursorBtn = document.getElementById( 'mdp-readabler-action-big-black-cursor' );

        if ( null === bigBlackCursorBtn ) { return; }

        if ( bigBlackCursorBtn.classList.contains( 'mdp-active') ) {
            bigBlackCursorBtn.click();
        }

    }

}


/***/ }),

/***/ "./source/js/action/ActionContentScaling.js":
/*!**************************************************!*\
  !*** ./source/js/action/ActionContentScaling.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionContentScaling": () => (/* binding */ ActionContentScaling)
/* harmony export */ });
/* harmony import */ var _import_tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../import/tools */ "./source/js/import/tools.js");


class ActionContentScaling {

    /**
     * Initialise Content Scaling action.
     **/
    static init() {

        /** Listen for Content Scaling change. */
        let contentScaling = document.querySelector( '#mdp-readabler-action-content-scaling .mdp-readabler-value' );

        contentScaling.addEventListener( 'ReadablerInputSpinnerChanged', this.scaleContent );

    }

    /**
     * Scale site content.
     **/
    static scaleContent( e ) {

        /** Scale factor. */
        let scale = parseInt( e.target.dataset.value );

        if ( navigator.userAgent.toLowerCase().indexOf( 'firefox' ) > 0 ){

            // Zoom for firefox
            ActionContentScaling.setFirefoxProperty( scale, 'body', '-moz-transform', '' );

        } else {

            // Zoom for Chrome
            ActionContentScaling.setElementProperty( scale, 'body > *', 'zoom', '' );

        }

    }

    /**
     * Set css property to all elements by selector.
     **/
    static setFirefoxProperty( scale, selector, CSSProperty, unit ) {

        /** Prepare dataset key based on css property name. */
        let camelProperty = (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.toCamelCase)( CSSProperty, '-' ).replace( '-', '' );
        camelProperty = 'readabler' + camelProperty;

        /** Set a new css property value for all elements in selector. */
        let el = document.querySelector( selector );

        /** Get property value from attribute. */
        let propertyValue = parseFloat( el.dataset[camelProperty] );

        if ( ! propertyValue || isNaN( propertyValue ) ) {

            /** Get element property. */
            let style = window.getComputedStyle( el, null ).getPropertyValue( CSSProperty );

            style === 'none' ?
                propertyValue = 1 :
                propertyValue = parseFloat( style.split( '(' )[ 1 ].split( ')' )[ 0 ] );

            /** Remember for future uses. */
            el.dataset[camelProperty] = propertyValue.toString();

        }

        /** Calculate new property value. */
        if ( 0 === propertyValue ) { propertyValue = 1; }
        let newPropertyVal = ( propertyValue + Math.abs( propertyValue / 100 ) * scale ).toFixed( 2 );

        /** Set value or none. */
        if ( parseFloat( newPropertyVal ) === 1 ) {

            el.style.setProperty( CSSProperty, `none`, 'important');
            el.style.removeProperty( '-moz-transform-origin' );

        } else {

            el.style.setProperty( CSSProperty, `scale(${ newPropertyVal.toString() })`, 'important');
            el.style.setProperty( '-moz-transform-origin', `top left`, 'important' );

        }

    }

    /**
     * Set css property to all elements by selector.
     **/
    static setElementProperty( scale, selector, CSSProperty, unit ) {

        /** Prepare dataset key based on css property name. */
        let camelProperty = (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.toCamelCase)( CSSProperty, '-' ).replace( '-', '' );
        camelProperty = 'readabler' + camelProperty;

        /** Set a new css property value for all elements in selector. */
        let elements = document.querySelectorAll( selector );
        elements.forEach( el  => {

            /** Get property value from attribute. */
            let propertyValue = parseFloat( el.dataset[camelProperty] );
            if ( ! propertyValue ) {

                /** Get element property. */
                let style = window.getComputedStyle( el, null ).getPropertyValue( CSSProperty );

                propertyValue = parseFloat( style );

                /** Special case: letter-spacing: normal. */
                if ( 'normal' === style ) { propertyValue = 0; }

                /** Remember for future uses. */
                el.dataset[camelProperty] = propertyValue.toString();

            }

            /** Calculate new property value. */
            if ( 0 === propertyValue ) { propertyValue = 1; }
            let newPropertyVal = ( propertyValue + Math.abs( propertyValue / 100 ) * scale ).toFixed( 2 );

            /** Set value. */
            el.style.setProperty( CSSProperty, newPropertyVal.toString() + unit, 'important');

        } );

    }

}


/***/ }),

/***/ "./source/js/action/ActionDarkContrast.js":
/*!************************************************!*\
  !*** ./source/js/action/ActionDarkContrast.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionDarkContrast": () => (/* binding */ ActionDarkContrast)
/* harmony export */ });
/* harmony import */ var _import_tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../import/tools */ "./source/js/import/tools.js");


class ActionDarkContrast {

    /**
     * Initialise DarkContrast action.
     **/
    static init() {

        /** Listen for Dark Contrast change. */
        let darkContrast = document.querySelector( '#mdp-readabler-action-dark-contrast' );
        darkContrast.addEventListener( 'ReadablerToggleBoxChanged', ActionDarkContrast.darkContrast );

    }

    /**
     * Toggle Dark Contrast styles.
     **/
    static darkContrast( e ) {

        /** Remove class from body to reset Dark Contrast to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-dark-contrast' );
            return;

        }

        /** Disable other buttons in button group. */
        (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.disableOthers)( e.target );

        /** Add class to body, to apply to align styles. */
        document.body.classList.add( 'mdp-readabler-dark-contrast' );

    }

}


/***/ }),

/***/ "./source/js/action/ActionDyslexiaFriendly.js":
/*!****************************************************!*\
  !*** ./source/js/action/ActionDyslexiaFriendly.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionDyslexiaFriendly": () => (/* binding */ ActionDyslexiaFriendly)
/* harmony export */ });
const dyslexiaFriendlyStyle = document.createElement( 'style' );

class ActionDyslexiaFriendly {

    /**
     * Initialise Dyslexia Friendly action.
     **/
    static init() {

        /** Listen for Dyslexia Friendly change. */
        let dyslexiaFriendly = document.querySelector( '#mdp-readabler-action-dyslexia-font' );
        dyslexiaFriendly.addEventListener( 'ReadablerToggleBoxChanged', ActionDyslexiaFriendly.dyslexiaFriendly );

    }

    /**
     * Toggle Dyslexia Friendly font.
     **/
    static dyslexiaFriendly( e ) {

        /** Remove class from body to reset font family to default values. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-dyslexia-font' );
            return;

        }

        /** Disable other buttons in button group. */
        ActionDyslexiaFriendly.disableOthers();

        /** Add class to body, to apply styles. */
        document.body.classList.add( 'mdp-readabler-dyslexia-font' );

        /** Add CSS to header. */
        //language=CSS
        dyslexiaFriendlyStyle.innerHTML = `
                /*noinspection CssUnknownTarget*/
                @font-face {
                    font-family: 'OpenDyslexic';
                    src: url("${ readablerOptions.path }font/OpenDyslexic-Italic.eot");
                    src: local("OpenDyslexic Italic"), local("OpenDyslexic-Italic"), 
                         url("${ readablerOptions.path }font/OpenDyslexic-Italic.eot?#iefix") format("embedded-opentype"), 
                         url("${ readablerOptions.path }font/OpenDyslexic-Italic.woff2") format("woff2"), 
                         url("${ readablerOptions.path }font/OpenDyslexic-Italic.woff") format("woff"), 
                         url("${ readablerOptions.path }font/OpenDyslexic-Italic.ttf") format("truetype"), 
                         url("${ readablerOptions.path }font/OpenDyslexic-Italic.svg#OpenDyslexic-Italic") format("svg");
                    font-weight: normal;
                    font-style: italic;
                    font-display: swap; 
                }

                /*noinspection CssUnknownTarget*/
                @font-face {
                    font-family: 'OpenDyslexic';
                    src: url("${ readablerOptions.path }font/OpenDyslexic-BoldItalic.eot");
                    src: local("OpenDyslexic Bold Italic"), local("OpenDyslexic-BoldItalic"), 
                         url("${ readablerOptions.path }font/OpenDyslexic-BoldItalic.eot?#iefix") format("embedded-opentype"), 
                         url("${ readablerOptions.path }font/OpenDyslexic-BoldItalic.woff2") format("woff2"), 
                         url("${ readablerOptions.path }font/OpenDyslexic-BoldItalic.woff") format("woff"), 
                         url("${ readablerOptions.path }font/OpenDyslexic-BoldItalic.ttf") format("truetype"), 
                         url("${ readablerOptions.path }font/OpenDyslexic-BoldItalic.svg#OpenDyslexic-BoldItalic") format("svg");
                    font-weight: bold;
                    font-style: italic;
                    font-display: swap; 
                }

                /*noinspection CssUnknownTarget*/
                @font-face {
                    font-family: 'OpenDyslexic';
                    src: url("${ readablerOptions.path }font/OpenDyslexic-Bold.eot");
                    src: local("OpenDyslexic Bold"), local("OpenDyslexic-Bold"), 
                         url("${ readablerOptions.path }font/OpenDyslexic-Bold.eot?#iefix") format("embedded-opentype"), 
                         url("${ readablerOptions.path }font/OpenDyslexic-Bold.woff2") format("woff2"), 
                         url("${ readablerOptions.path }font/OpenDyslexic-Bold.woff") format("woff"), 
                         url("${ readablerOptions.path }font/OpenDyslexic-Bold.ttf") format("truetype"), 
                         url("${ readablerOptions.path }font/OpenDyslexic-Bold.svg#OpenDyslexic-Bold") format("svg");
                    font-weight: bold;
                    font-style: normal;
                    font-display: swap; 
                }

                /*noinspection CssUnknownTarget*/
                @font-face {
                    font-family: 'OpenDyslexic';
                    src: url("${ readablerOptions.path }font/OpenDyslexic-Regular.eot");
                    src: local("OpenDyslexic Regular"), local("OpenDyslexic-Regular"), 
                         url("${ readablerOptions.path }font/OpenDyslexic-Regular.eot?#iefix") format("embedded-opentype"), 
                         url("${ readablerOptions.path }font/OpenDyslexic-Regular.woff2") format("woff2"), 
                         url("${ readablerOptions.path }font/OpenDyslexic-Regular.woff") format("woff"), 
                         url("${ readablerOptions.path }font/OpenDyslexic-Regular.ttf") format("truetype"), 
                         url("${ readablerOptions.path }font/OpenDyslexic-Regular.svg#OpenDyslexic-Regular") format("svg");
                    font-weight: normal;
                    font-style: normal;
                    font-display: swap; 
                }
                    
                /*noinspection CssUnusedSymbol*/
                body.mdp-readabler-dyslexia-font,
                body.mdp-readabler-dyslexia-font h1,
                body.mdp-readabler-dyslexia-font h1 span,
                body.mdp-readabler-dyslexia-font h2,
                body.mdp-readabler-dyslexia-font h2 span,
                body.mdp-readabler-dyslexia-font h3,
                body.mdp-readabler-dyslexia-font h3 span,
                body.mdp-readabler-dyslexia-font h4,
                body.mdp-readabler-dyslexia-font h4 span,
                body.mdp-readabler-dyslexia-font h5,
                body.mdp-readabler-dyslexia-font h5 span,
                body.mdp-readabler-dyslexia-font h6,
                body.mdp-readabler-dyslexia-font h6 span,

                body.mdp-readabler-dyslexia-font a,
                body.mdp-readabler-dyslexia-font p,
                body.mdp-readabler-dyslexia-font li a,
                body.mdp-readabler-dyslexia-font label,
                body.mdp-readabler-dyslexia-font input,
                body.mdp-readabler-dyslexia-font select,
                body.mdp-readabler-dyslexia-font textarea,
                body.mdp-readabler-dyslexia-font legend,
                body.mdp-readabler-dyslexia-font code,
                body.mdp-readabler-dyslexia-font pre,
                body.mdp-readabler-dyslexia-font dd,
                body.mdp-readabler-dyslexia-font dt,
                body.mdp-readabler-dyslexia-font span,
                body.mdp-readabler-dyslexia-font blockquote {
                    font-family: 'OpenDyslexic', serif !important;
                }
            `;

        document.head.appendChild( dyslexiaFriendlyStyle );

    }

    /**
     * Disable other buttons in button group.
     **/
    static disableOthers() {

        /** Disable Readable Font if enabled. */
        let readable = document.getElementById( 'mdp-readabler-action-readable-font' );
        if ( readable.classList.contains( 'mdp-active') ) {
            readable.click();
        }

    }

}


/***/ }),

/***/ "./source/js/action/ActionFontSizing.js":
/*!**********************************************!*\
  !*** ./source/js/action/ActionFontSizing.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionFontSizing": () => (/* binding */ ActionFontSizing)
/* harmony export */ });
class ActionFontSizing {

    /**
     * Initialise Font Sizing action.
     **/
    static init() {

        /** Listen for Font Sizing change. */
        let fontSizing = document.querySelector( '#mdp-readabler-action-font-sizing .mdp-readabler-value' );
        fontSizing.addEventListener( 'ReadablerInputSpinnerChanged', ActionFontSizing.fontSizing );

    }

    /**
     * Scaling font by inline element CSS
     * @param tags - Tags for processing
     * @param scale - Scale value in percents but without %
     */
    static fontScaling( tags, scale ) {

        for ( let tag of tags ) {

            if ( document.getElementsByTagName( tag ).length > 0 ) {

                for ( let textElement of document.getElementsByTagName( tag ) ) {

                    // Get original font size
                    let originalSize = window.getComputedStyle( textElement ).fontSize.split( 'px', 1 )[ 0 ];

                    // Update original size from data attribute
                    textElement.getAttribute( 'original-size' ) === null ?
                        textElement.setAttribute( 'original-size', originalSize ) :
                        originalSize = textElement.getAttribute( 'original-size' );

                    // Set new font size
                    textElement.style.fontSize = `${ parseInt( originalSize ) + originalSize * ( scale * .01 ) }px`;

                }

            }

        }

    }

    /**
     * Increase/Decrease Font Size.
     **/
    static fontSizing( e ) {

        let scale = parseInt( e.target.dataset.value );
        const textTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'p', 'a', 'li', 'label', 'input', 'select', 'textarea', 'legend', 'code', 'pre', 'dd', 'dt', 'span', 'blockquote'];

        /** Remove class from body to reset font size to default values. */
        if ( 0 === scale ) {
            document.body.classList.remove( 'mdp-readabler-font-sizing' );
            return;
        }

        /** Add class to body, to apply styles. */
        document.body.classList.add( 'mdp-readabler-font-sizing' );

        /** Add inline css */
        ActionFontSizing.fontScaling( textTags, scale );

    }

}


/***/ }),

/***/ "./source/js/action/ActionHideAccessibility.js":
/*!*****************************************************!*\
  !*** ./source/js/action/ActionHideAccessibility.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionHideAccessibility": () => (/* binding */ ActionHideAccessibility)
/* harmony export */ });
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");


class ActionHideAccessibility {

    /**
     * Initialise Hide Accessibility action.
     **/
    static init() {

        /** Listen for Hide button click. */
        let btn = document.getElementById( 'mdp-readabler-hide-btn' );

        if ( btn ) {

            btn.addEventListener( 'click', ActionHideAccessibility.hide );

        }

    }

    static hide( e ) {

        e.preventDefault();

        if ( window.confirm( i18next__WEBPACK_IMPORTED_MODULE_0__["default"].t( 'hide-forever-message' ) ) ) {

            ActionHideAccessibility.writeCookie( 'mdp-readabler-hide', '1', 365 );

            /** Reload page to hide interface. */
            window.location.reload();

        }

    }

    static writeCookie( key, value, days ) {

        let date = new Date();

        /** Default at 365 days. */
        days = days || 365;

        /** Get unix milliseconds at current time plus number of days. */
        date.setTime( +date + (days * 86400000) ); // 24 * 60 * 60 * 1000

        // noinspection JSUnresolvedFunction
        window.document.cookie = key + "=" + value + "; expires=" + date.toGMTString() + "; path=/";

        return value;

    }

}


/***/ }),

/***/ "./source/js/action/ActionHideImages.js":
/*!**********************************************!*\
  !*** ./source/js/action/ActionHideImages.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionHideImages": () => (/* binding */ ActionHideImages)
/* harmony export */ });
class ActionHideImages {

    /**
     * Initialise Hide Images action.
     **/
    static init() {

        /** Listen for Hide Images change. */
        let hideImages = document.querySelector( '#mdp-readabler-action-hide-images' );
        hideImages.addEventListener( 'ReadablerToggleBoxChanged', ActionHideImages.hideImages );

    }

    /**
     * Toggle Hide Images.
     **/
    static hideImages( e ) {

        /** Remove class from body to reset to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-hide-images' );
            return;

        }

        /** Add class to body as flag. */
        document.body.classList.add( 'mdp-readabler-hide-images' );

        /** Add CSS to header. */
        const hideImagesStyle = document.createElement( 'style' );
        hideImagesStyle.innerHTML = `
                body.mdp-readabler-hide-images img,
                body.mdp-readabler-hide-images video {
                    opacity: 0 !important;
                    visibility: hidden !important
                }

                body.mdp-readabler-hide-images * {
                    background-image: none !important
                }

            `;

        document.head.appendChild( hideImagesStyle );

    }

}


/***/ }),

/***/ "./source/js/action/ActionHighContrast.js":
/*!************************************************!*\
  !*** ./source/js/action/ActionHighContrast.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionHighContrast": () => (/* binding */ ActionHighContrast)
/* harmony export */ });
/* harmony import */ var _import_tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../import/tools */ "./source/js/import/tools.js");


class ActionHighContrast {

    /**
     * Initialise High Contrast action.
     **/
    static init() {

        /** Listen for High Contrast change. */
        let highContrast = document.querySelector( '#mdp-readabler-action-high-contrast' );
        highContrast.addEventListener( 'ReadablerToggleBoxChanged', ActionHighContrast.highContrast );

    }

    /**
     * Toggle High Contrast styles.
     **/
    static highContrast( e ) {

        /** Remove class from body to reset High Contrast to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-high-contrast' );
            return;

        }

        /** Disable other buttons in button group. */
        (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.disableOthers)( e.target );

        /** Add class to body, to apply to align styles. */
        document.body.classList.add( 'mdp-readabler-high-contrast' );

    }

}


/***/ }),

/***/ "./source/js/action/ActionHighSaturation.js":
/*!**************************************************!*\
  !*** ./source/js/action/ActionHighSaturation.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionHighSaturation": () => (/* binding */ ActionHighSaturation)
/* harmony export */ });
/* harmony import */ var _import_tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../import/tools */ "./source/js/import/tools.js");


class ActionHighSaturation {

    /**
     * Initialise High Saturation action.
     **/
    static init() {

        /** Listen for High Saturation change. */
        let highSaturation = document.querySelector( '#mdp-readabler-action-high-saturation' );
        highSaturation.addEventListener( 'ReadablerToggleBoxChanged', ActionHighSaturation.highSaturation );

    }

    /**
     * Toggle High Saturation styles.
     **/
    static highSaturation( e ) {

        /** Remove class from body to reset High Saturation to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-high-saturation' );
            return;

        }

        /** Disable other buttons in button group. */
        (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.disableOthers)( e.target );

        /** Add class to body, to apply to align styles. */
        document.body.classList.add( 'mdp-readabler-high-saturation' );

    }

}


/***/ }),

/***/ "./source/js/action/ActionHighlightFocus.js":
/*!**************************************************!*\
  !*** ./source/js/action/ActionHighlightFocus.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionHighlightFocus": () => (/* binding */ ActionHighlightFocus)
/* harmony export */ });
class ActionHighlightFocus {

    /**
     * Initialise Highlight Focus action.
     **/
    static init() {

        /** Listen for Highlight Focus change. */
        let highlightFocus = document.querySelector( '#mdp-readabler-action-highlight-focus' );
        highlightFocus.addEventListener( 'ReadablerToggleBoxChanged', ActionHighlightFocus.highlightFocus );

    }

    static highlightFocus( e ) {

        /** Remove class from body to reset to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-highlight-focus' );
            return;

        }

        /** Add class to body as flag. */
        document.body.classList.add( 'mdp-readabler-highlight-focus' );

    }

}


/***/ }),

/***/ "./source/js/action/ActionHighlightHover.js":
/*!**************************************************!*\
  !*** ./source/js/action/ActionHighlightHover.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionHighlightHover": () => (/* binding */ ActionHighlightHover)
/* harmony export */ });
class ActionHighlightHover {

    /**
     * Initialise Highlight Hover action.
     **/
    static init() {

        /** Listen for Highlight Hover change. */
        let highlightHover = document.querySelector( '#mdp-readabler-action-highlight-hover' );
        highlightHover.addEventListener( 'ReadablerToggleBoxChanged', ActionHighlightHover.highlightHover );

    }

    static highlightHover( e ) {

        /** Remove class from body to reset to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-highlight-hover' );
            return;

        }

        /** Add class to body as flag. */
        document.body.classList.add( 'mdp-readabler-highlight-hover' );

    }

}


/***/ }),

/***/ "./source/js/action/ActionHighlightLinks.js":
/*!**************************************************!*\
  !*** ./source/js/action/ActionHighlightLinks.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionHighlightLinks": () => (/* binding */ ActionHighlightLinks)
/* harmony export */ });
class ActionHighlightLinks {

    /**
     * Initialise Highlight Links action.
     **/
    static init() {

        /** Listen for Highlight Links change. */
        let highlightLinks = document.querySelector( '#mdp-readabler-action-highlight-links' );
        highlightLinks.addEventListener( 'ReadablerToggleBoxChanged', ActionHighlightLinks.highlightLinks );

    }

    /**
     * Toggle Highlight Links styles.
     **/
    static highlightLinks( e ) {

        /** Remove class from body to reset links to default values. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-highlight-links' );
            return;

        }

        /** Add class to body, to apply styles. */
        document.body.classList.add( 'mdp-readabler-highlight-links' );

    }

}


/***/ }),

/***/ "./source/js/action/ActionHighlightTitles.js":
/*!***************************************************!*\
  !*** ./source/js/action/ActionHighlightTitles.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionHighlightTitles": () => (/* binding */ ActionHighlightTitles)
/* harmony export */ });
class ActionHighlightTitles {

    /**
     * Initialise Highlight Titles action.
     **/
    static init() {

        /** Listen for Highlight Titles change. */
        let highlightTitles = document.querySelector( '#mdp-readabler-action-highlight-titles' );
        highlightTitles.addEventListener( 'ReadablerToggleBoxChanged', ActionHighlightTitles.highlightTitles );

    }

    /**
     * Toggle Highlight Titles styles.
     **/
    static highlightTitles( e ) {

        /** Remove class from body to reset titles to default values. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-highlight-titles' );
            return;

        }

        /** Add class to body, to apply styles. */
        document.body.classList.add( 'mdp-readabler-highlight-titles' );

    }

}


/***/ }),

/***/ "./source/js/action/ActionKeyboardNavigation.js":
/*!******************************************************!*\
  !*** ./source/js/action/ActionKeyboardNavigation.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionKeyboardNavigation": () => (/* binding */ ActionKeyboardNavigation)
/* harmony export */ });
/* harmony import */ var _import_tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../import/tools */ "./source/js/import/tools.js");


class ActionKeyboardNavigation {

    /**
     * Initialise Keyboard Navigation action.
     **/
    static init() {

        /** Listen for Keyboard Navigation change. */
        let keyboardNavigation = document.querySelector( '#mdp-readabler-action-keyboard-navigation' );
        keyboardNavigation.addEventListener( 'ReadablerToggleBoxChanged', ActionKeyboardNavigation.keyboardNavigation );

    }

    static keyboardNavigation( e ) {

        /** Remove class from body to reset to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-keyboard-navigation' );

            /** Restore original tabIndexes. */
            ActionKeyboardNavigation.restoreOriginalTabIndex();

            /** Disable Focus Snail. */
            _import_tools__WEBPACK_IMPORTED_MODULE_0__.focusSnail.enabled = false;

            return;

        }

        /** Add class to body as flag. */
        document.body.classList.add( 'mdp-readabler-keyboard-navigation' );

        /** Make all elements focusable. */
        ActionKeyboardNavigation.makeFocusable();

        /** Enable Focus Snail. */
        _import_tools__WEBPACK_IMPORTED_MODULE_0__.focusSnail.enabled = true;

    }

    /**
     * Make all elements focusable.
     **/
    static makeFocusable() {

        document.querySelectorAll(
            'nav, [role="navigation"], ' +                          // Make all Menus focusable.
            'h1, h2, h3, h4, h5, h6, [role="heading"], ' +                  // Make all Headings focusable.
            'form:not([disabled]), ' +                                      // Make all Forms focusable.
            'button:not([disabled]), [role="button"]:not([disabled]), ' +   // Make all Buttons focusable.
            'img, picture, svg'                                             // Make all Graphics focusable.
        ).forEach((element) => {

            /** Don't change tabIndex if element already has it. */
            if ( element.tabIndex < 0 ) {
                element.dataset.readablerOriginalTabIndex = element.tabIndex;
                element.tabIndex = 0;
            }

        } );

    }

    /**
     * Restore original tabIndex value.
     **/
    static restoreOriginalTabIndex() {

        document.querySelectorAll(
            'nav, [role="navigation"], ' +                          // Make all Menus focusable.
            'h1, h2, h3, h4, h5, h6, [role="heading"], ' +                  // Make all Headings focusable.
            'form:not([disabled]), ' +                                      // Make all Forms focusable.
            'button:not([disabled]), [role="button"]:not([disabled]), ' +   // Make all Buttons focusable.
            'img, picture, svg'                                             // Make all Graphics focusable.
        ).forEach( ( element ) => {

            /** If element has original tabIndex - set it. */
            if ( null != element.dataset.readablerOriginalTabIndex ) {
                element.tabIndex = element.dataset.readablerOriginalTabIndex;
                delete element.dataset.readablerOriginalTabIndex;
            }

        } );

    }

    /**
     * Set focus to next/prev element.
     **/
    static setFocus( focusableElements, next = true ) {

        if ( document.activeElement ) {

            let focusable = Array.prototype.filter.call( document.querySelectorAll( focusableElements ),
                function ( element ) {

                    /** Check for visibility while always include the current activeElement. */
                    return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement

                } );
            if ( focusable.length === 0 ) { return; }

            let index = focusable.indexOf( document.activeElement );

            if ( index > -1 ) {

                let nextElement;

                /** Next element. */
                if ( next ) {

                    nextElement = focusable[index + 1] || focusable[0];

                }

                /** Prev element. */
                else {

                    nextElement = focusable[index - 1] || focusable[focusable.length - 1];

                }

                nextElement.focus();

            } else {

                /** Next element. */
                if ( next ) {

                    focusable[0].focus();

                }

                /** Prev element. */
                else {
                    focusable[focusable.length - 1].focus();
                }

            }

        }

    }

}


/***/ }),

/***/ "./source/js/action/ActionLetterSpacing.js":
/*!*************************************************!*\
  !*** ./source/js/action/ActionLetterSpacing.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionLetterSpacing": () => (/* binding */ ActionLetterSpacing)
/* harmony export */ });
class ActionLetterSpacing {

    /**
     * Initialise Letter Spacing action.
     **/
    static init() {

        /** Listen for Letter Spacing change. */
        let letterSpacing = document.querySelector( '#mdp-readabler-action-letter-spacing .mdp-readabler-value' );
        letterSpacing.addEventListener( 'ReadablerInputSpinnerChanged', this.letterSpacing );

    }

    /**
     * Increase/Decrease Letter Spacing.
     **/
    static letterSpacing( e ) {

        /** Scale factor. */
        let scale = parseInt( e.target.dataset.value );

        /** Remove class from body to reset font size to default values. */
        if ( 0 === scale ) {
            document.body.classList.remove( 'mdp-readabler-letter-spacing' );
            return;
        }

        /** Add class to body, to apply styles. */
        document.body.classList.add( 'mdp-readabler-letter-spacing' );

        /** Calculate font sizes. */
        let letterSpacing = (scale / 100);

        /** Add CSS to header. */
        const letterSpacingStyle = document.createElement( 'style' );
        letterSpacingStyle.innerHTML = `
                /*noinspection CssUnusedSymbol*/
                body.mdp-readabler-letter-spacing,
                body.mdp-readabler-letter-spacing h1,
                body.mdp-readabler-letter-spacing h1 span,
                body.mdp-readabler-letter-spacing h2,
                body.mdp-readabler-letter-spacing h2 span,
                body.mdp-readabler-letter-spacing h3,
                body.mdp-readabler-letter-spacing h3 span,
                body.mdp-readabler-letter-spacing h4,
                body.mdp-readabler-letter-spacing h4 span,
                body.mdp-readabler-letter-spacing h5,
                body.mdp-readabler-letter-spacing h5 span,
                body.mdp-readabler-letter-spacing h6,
                body.mdp-readabler-letter-spacing h6 span,
                
                body.mdp-readabler-letter-spacing p,
                body.mdp-readabler-letter-spacing li,
                body.mdp-readabler-letter-spacing label,
                body.mdp-readabler-letter-spacing input,
                body.mdp-readabler-letter-spacing select,
                body.mdp-readabler-letter-spacing textarea,
                body.mdp-readabler-letter-spacing legend,
                body.mdp-readabler-letter-spacing code,
                body.mdp-readabler-letter-spacing pre,
                body.mdp-readabler-letter-spacing dd,
                body.mdp-readabler-letter-spacing dt,
                body.mdp-readabler-letter-spacing span,
                body.mdp-readabler-letter-spacing blockquote {
                    letter-spacing: ${letterSpacing}px !important;    
                }
            `;

        document.head.appendChild( letterSpacingStyle );

    }

}


/***/ }),

/***/ "./source/js/action/ActionLightContrast.js":
/*!*************************************************!*\
  !*** ./source/js/action/ActionLightContrast.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionLightContrast": () => (/* binding */ ActionLightContrast)
/* harmony export */ });
/* harmony import */ var _import_tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../import/tools */ "./source/js/import/tools.js");


class ActionLightContrast {

    /**
     * Initialise Light Contrast action.
     **/
    static init() {

        /** Listen for Light Contrast change. */
        let lightContrast = document.querySelector( '#mdp-readabler-action-light-contrast' );
        lightContrast.addEventListener( 'ReadablerToggleBoxChanged', ActionLightContrast.lightContrast );

    }

    /**
     * Toggle Light Contrast styles.
     **/
    static lightContrast( e ) {

        /** Remove class from body to reset Light Contrast to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-light-contrast' );
            return;

        }

        /** Disable other buttons in button group. */
        (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.disableOthers)( e.target );

        /** Add class to body, to apply to align styles. */
        document.body.classList.add( 'mdp-readabler-light-contrast' );

    }

}


/***/ }),

/***/ "./source/js/action/ActionLineHeight.js":
/*!**********************************************!*\
  !*** ./source/js/action/ActionLineHeight.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionLineHeight": () => (/* binding */ ActionLineHeight)
/* harmony export */ });
class ActionLineHeight {

    /**
     * Initialise Line Height action.
     **/
    static init() {

        /** Listen for Line Height change. */
        let lineHeight = document.querySelector( '#mdp-readabler-action-line-height .mdp-readabler-value' );
        lineHeight.addEventListener( 'ReadablerInputSpinnerChanged', this.lineHeight );

    }

    /**
     * Scaling line-height by inline element CSS
     * @param tags - Tags for processing
     * @param scale - Scale value in percents but without %
     */
    static fontLeading( tags, scale ) {

        for ( let tag of tags ) {

            if ( document.getElementsByTagName( tag ).length > 0 ) {

                for ( let textElement of document.getElementsByTagName( tag ) ) {

                    // Get original font size
                    let originalSize = window.getComputedStyle( textElement ).lineHeight.split( 'px', 1 )[ 0 ];

                    // Update original size from data attribute
                    textElement.getAttribute( 'original-leading' ) === null ?
                        textElement.setAttribute( 'original-leading', originalSize ) :
                        originalSize = textElement.getAttribute( 'original-leading' );

                    // Set new font size
                    textElement.style.lineHeight = `${ parseInt( originalSize ) + originalSize * ( scale * .01 ) }px`;

                }

            }

        }

    }

    /**
     * Increase/Decrease Line Height.
     **/
    static lineHeight( e ) {

        /** Scale factor. */
        let scale = parseInt( e.target.dataset.value );
        const textTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'p', 'a', 'li', 'label', 'input', 'select', 'textarea', 'legend', 'code', 'pre', 'dd', 'dt', 'span', 'blockquote'];

        /** Remove class from body to reset line-height to default values. */
        if ( 0 === scale ) {
            document.body.classList.remove( 'mdp-readabler-line-height' );
            return;
        }

        /** Add class to body, to apply styles. */
        document.body.classList.add( 'mdp-readabler-line-height' );

        /** Add inline css */
        ActionLineHeight.fontLeading( textTags, scale );

    }

}


/***/ }),

/***/ "./source/js/action/ActionLowSaturation.js":
/*!*************************************************!*\
  !*** ./source/js/action/ActionLowSaturation.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionLowSaturation": () => (/* binding */ ActionLowSaturation)
/* harmony export */ });
/* harmony import */ var _import_tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../import/tools */ "./source/js/import/tools.js");


class ActionLowSaturation {

    /**
     * Initialise Low Saturation action.
     **/
    static init() {

        /** Listen for Low Saturation change. */
        let lowSaturation = document.querySelector( '#mdp-readabler-action-low-saturation' );
        lowSaturation.addEventListener( 'ReadablerToggleBoxChanged', ActionLowSaturation.lowSaturation );

    }

    /**
     * Toggle Low Saturation styles.
     **/
    static lowSaturation( e ) {

        /** Remove class from body to reset Low Saturation to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-low-saturation' );
            return;

        }

        /** Disable other buttons in button group. */
        (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.disableOthers)( e.target );

        /** Add class to body, to apply to align styles. */
        document.body.classList.add( 'mdp-readabler-low-saturation' );

    }

}


/***/ }),

/***/ "./source/js/action/ActionMonochrome.js":
/*!**********************************************!*\
  !*** ./source/js/action/ActionMonochrome.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionMonochrome": () => (/* binding */ ActionMonochrome)
/* harmony export */ });
/* harmony import */ var _import_tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../import/tools */ "./source/js/import/tools.js");


class ActionMonochrome {

    /**
     * Initialise Monochrome action.
     **/
    static init() {

        /** Listen for Monochrome change. */
        let monochrome = document.querySelector( '#mdp-readabler-action-monochrome' );
        monochrome.addEventListener( 'ReadablerToggleBoxChanged', ActionMonochrome.monochrome );

    }

    /**
     * Toggle Monochrome styles.
     **/
    static monochrome( e ) {

        /** Remove class from body to reset Monochrome to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-monochrome' );
            return;

        }

        /** Disable other buttons in button group. */
        (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.disableOthers)( e.target );

        /** Add class to body, to apply to align styles. */
        document.body.classList.add( 'mdp-readabler-monochrome' );

    }

}


/***/ }),

/***/ "./source/js/action/ActionMuteSounds.js":
/*!**********************************************!*\
  !*** ./source/js/action/ActionMuteSounds.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionMuteSounds": () => (/* binding */ ActionMuteSounds)
/* harmony export */ });
class ActionMuteSounds {

    /**
     * Initialise Mute Sounds action.
     **/
    static init() {

        /** Listen for Mute Sounds change. */
        let muteSounds = document.querySelector( '#mdp-readabler-action-mute-sounds' );
        muteSounds.addEventListener( 'ReadablerToggleBoxChanged', ActionMuteSounds.muteSounds );

    }

    /**
     * Toggle Mute Sounds.
     **/
    static muteSounds( e ) {

        /** Remove class from body to reset Low Saturation to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            /** UnMute all elements. */
            ActionMuteSounds.mute( false );

            document.documentElement.classList.remove( 'mdp-readabler-mute-sounds' );

            return;

        }

        /** Mute all elements. */
        ActionMuteSounds.mute( true );

        /** Add class to body as flag. */
        document.documentElement.classList.add( 'mdp-readabler-mute-sounds' );

    }

    /**
     * Mute/UnMute all elements.
     **/
    static mute( mute ) {

        /** Mute/UnMute all video and audio elements on the page. */
        document.querySelectorAll( 'video, audio' ).forEach( elem => {
            elem.muted = mute;
        } );

        /** Mute/UnMute YouTube and Vimeo. */
        document.querySelectorAll( 'iframe' ).forEach( elem => {

            if (
                elem.src.toLowerCase().includes( 'youtube.com' ) ||
                elem.src.toLowerCase().includes( 'vimeo.com' )
            ) {

                let newSrc = new URL( elem.src );

                /** Mute. */
                if ( mute ) {

                    newSrc.searchParams.append( 'mute', '1' );
                    newSrc.searchParams.append( 'muted', '1' );

                    /** Unmute. */
                } else {

                    newSrc.searchParams.delete( 'mute' );
                    newSrc.searchParams.delete( 'muted' );

                }

                elem.src = newSrc.href;

            }

        } );

    }

}


/***/ }),

/***/ "./source/js/action/ActionReadableFont.js":
/*!************************************************!*\
  !*** ./source/js/action/ActionReadableFont.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionReadableFont": () => (/* binding */ ActionReadableFont)
/* harmony export */ });
const readableFontStyle = document.createElement('style');

class ActionReadableFont {

    /**
     * Initialise Readable Font action.
     **/
    static init() {

        /** Listen for Readable Font change. */
        let readableFont = document.querySelector( '#mdp-readabler-action-readable-font' );
        readableFont.addEventListener( 'ReadablerToggleBoxChanged', ActionReadableFont.readableFont );

    }

    /**
     * Toggle readable font.
     **/
    static readableFont( e ) {

        /** Remove class from body to reset font family to default values. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-readable-font' );
            return;

        }

        /** Disable other buttons in button group. */
        ActionReadableFont.disableOthers();

        /** Add class to body, to apply styles. */
        document.body.classList.add( 'mdp-readabler-readable-font' );

        /** Add CSS to header. */
        //language=CSS
        readableFontStyle.innerHTML = `
                /*noinspection CssUnusedSymbol*/
                body.mdp-readabler-readable-font *:not(i){
                    font-family: Arial, Helvetica, sans-serif !important;
                }
            `;

        document.head.appendChild( readableFontStyle );

    }

    /**
     * Disable other buttons in button group.
     **/
    static disableOthers() {

        /** Disable Dyslexia Font if enabled. */
        let dyslexia = document.getElementById( 'mdp-readabler-action-dyslexia-font' );

        if ( ! dyslexia ) { return; }

        if ( dyslexia.classList.contains( 'mdp-active') ) {
            dyslexia.click();
        }

    }

}


/***/ }),

/***/ "./source/js/action/ActionReadingGuide.js":
/*!************************************************!*\
  !*** ./source/js/action/ActionReadingGuide.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionReadingGuide": () => (/* binding */ ActionReadingGuide)
/* harmony export */ });
let readingGuideEl = null;

class ActionReadingGuide {

    /**
     * Initialise Reading Guide action.
     **/
    static init() {

        /** Listen for Reading Guide change. */
        let readingGuide = document.querySelector( '#mdp-readabler-action-reading-guide' );
        readingGuide.addEventListener( 'ReadablerToggleBoxChanged', ActionReadingGuide.readingGuide );

    }

    /**
     * Initialise Reading Guide action.
     **/
    static readingGuide( e ) {

        /** Remove class from body to reset to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            /** Remove Reading Guide. */
            ActionReadingGuide.removeReadingGuide();
            return;

        }

        /** Create Reading Guide element. */
        ActionReadingGuide.createReadingGuide();

    }

    /**
     * Create Reading Guide on page.
     **/
    static createReadingGuide() {

        /** Exit if reading guide already exist. */
        if ( document.querySelectorAll( '.mdp-readabler-reading-guide-element' ).length ) { return; }

        /** Add CSS for Reading Guide. */
        ActionReadingGuide.addCSS();

        /** Create reading guide element. */
        readingGuideEl = document.createElement( 'div' );
        readingGuideEl.classList.add( 'mdp-readabler-reading-guide-element' );
        document.body.appendChild( readingGuideEl );

        /** Listen mouse events. */
        document.addEventListener( 'mousemove', ActionReadingGuide.moveReadingGuide );
        document.addEventListener( 'click', ActionReadingGuide.moveReadingGuide );

    }

    /**
     * Move Reading Guide with mouse.
     **/
    static moveReadingGuide( e ) {

        let newPosX = e.clientX - ( Math.round( readingGuideEl.clientWidth / 2 ) );
        let newPosY = e.clientY;

        readingGuideEl.style.transform = "translate3d(" + newPosX + "px," + newPosY + "px,0px)";

    }

    /**
     * Remove Reading Guide on page.
     **/
    static removeReadingGuide() {

        document.body.classList.remove( 'mdp-readabler-reading-guide' );

        /** Remove element from page. */
        readingGuideEl.remove();

        /** Remove listeners for mouse events. */
        document.removeEventListener( 'mousemove', ActionReadingGuide.moveReadingGuide );
        document.removeEventListener( 'click', ActionReadingGuide.moveReadingGuide );

    }

    /**
     * Add CSS for Reading Guide.
     **/
    static addCSS() {

        /** Add class to body as flag. */
        document.body.classList.add( 'mdp-readabler-reading-guide' );

    }

}


/***/ }),

/***/ "./source/js/action/ActionReadingMask.js":
/*!***********************************************!*\
  !*** ./source/js/action/ActionReadingMask.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionReadingMask": () => (/* binding */ ActionReadingMask)
/* harmony export */ });
let readingMaskTop = null;
let readingMaskBottom = null;

class ActionReadingMask {

    /**
     * Initialise Reading Mask action.
     **/
    static init() {

        /** Listen for Reading Mask change. */
        let readingMask = document.querySelector( '#mdp-readabler-action-reading-mask' );
        readingMask.addEventListener( 'ReadablerToggleBoxChanged', ActionReadingMask.readingMask );

    }

    /**
     * Toggle Reading Mask.
     **/
    static readingMask( e ) {

        /** Remove class from body to reset to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            /** Remove Reading Mask. */
            ActionReadingMask.removeReadingMask();
            return;

        }

        /** Create Reading Mask elements. */
        ActionReadingMask.createReadingMask();

    }

    /**
     * Create Reading Mask on page.
     **/
    static createReadingMask() {

        /** Exit if reading mask already exist. */
        if ( document.querySelectorAll( '.mdp-readabler-reading-mask-top' ).length ) { return; }

        /** Add class to body as flag. */
        document.body.classList.add( 'mdp-readabler-reading-mask' );

        /** Create reading mask top element. */
        readingMaskTop = document.createElement( 'div' );
        readingMaskTop.classList.add( 'mdp-readabler-reading-mask-top' );
        document.body.appendChild( readingMaskTop );

        /** Create reading mask bottom element. */
        readingMaskBottom = document.createElement( 'div' );
        readingMaskBottom.classList.add( 'mdp-readabler-reading-mask-bottom' );
        document.body.appendChild( readingMaskBottom );

        /** Listen mouse events. */
        document.addEventListener( 'mousemove', ActionReadingMask.moveReadingMask );

    }

    /**
     * Move Reading Mask with mouse.
     **/
    static moveReadingMask( e ) {

        let newPosY = e.clientY;
        let delta = Math.round( readablerOptions.readingMaskHeight / 2 );

        readingMaskTop.style.height = `${ newPosY - delta }px`;
        readingMaskBottom.style.top = `${ newPosY + delta }px`;

    }

    /**
     * Remove Reading Mask on page.
     **/
    static removeReadingMask() {

        /** Remove flag-class */
        document.body.classList.remove( 'mdp-readabler-reading-mask' );

        /** Remove elements from page. */
        readingMaskTop.remove();
        readingMaskBottom.remove();

        /** Remove listeners for mouse events. */
        document.removeEventListener( 'mousemove', ActionReadingMask.moveReadingMask );

    }

}


/***/ }),

/***/ "./source/js/action/ActionResetSettings.js":
/*!*************************************************!*\
  !*** ./source/js/action/ActionResetSettings.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionResetSettings": () => (/* binding */ ActionResetSettings)
/* harmony export */ });
class ActionResetSettings {

    /**
     * Initialise Reset Settings action.
     **/
    static init() {

        /** Listen for Reset Settings button click. */
        let btn = document.getElementById( 'mdp-readabler-reset-btn' );

        if ( btn ) {
            btn.addEventListener( 'click', ActionResetSettings.reset );
        }

    }

    static reset( e ) {

        e.preventDefault();

        /** Get all keys in localStorage. */
        let keys = Object.keys( localStorage );

        /** Remove all items which starts with 'mdpReadabler' */
        for ( const key in keys ) {

            if ( keys[key].toString().startsWith( 'mdpReadabler' ) ) {
                localStorage.removeItem( keys[key] );
            }

        }

        /** Reload page to reset all. */
        location.reload();

    }

}


/***/ }),

/***/ "./source/js/action/ActionStopAnimations.js":
/*!**************************************************!*\
  !*** ./source/js/action/ActionStopAnimations.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionStopAnimations": () => (/* binding */ ActionStopAnimations)
/* harmony export */ });
class ActionStopAnimations {

    /**
     * Initialise Stop Animations action.
     **/
    static init() {

        /** Listen for Stop Animations change. */
        let stopAnimations = document.querySelector( '#mdp-readabler-action-stop-animations' );
        stopAnimations.addEventListener( 'ReadablerToggleBoxChanged', ActionStopAnimations.stopAnimations );

    }

    /**
     * Toggle Animations.
     **/
    static stopAnimations( e ) {

        /** Remove class from body to reset to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-stop-animations' );

            /** Play all videos. */
            clearInterval( redadblerStopVideoInterval );
            document.querySelectorAll('video').forEach(vid => {

                if ( vid.paused === true ) {

                    if ( vid.dataset.pausedByReadabler === 'true' ) {

                        vid.play();
                        vid.dataset.pausedByReadabler = 'false';

                    }

                }

            } );

            return;

        }

        /** Add class to body as flag. */
        document.body.classList.add( 'mdp-readabler-stop-animations' );

        /** Add CSS to header. */
        const stopAnimationsStyle = document.createElement( 'style' );
        stopAnimationsStyle.innerHTML = `

                /*noinspection CssUnusedSymbol,CssUnknownProperty*/
                body.mdp-readabler-stop-animations *{
                    -webkit-transition: none !important;
                    -moz-transition: none !important;
                    -ms-transition: none !important;
                    -o-transition: none !important;
                    transition: none !important;
                    -webkit-animation-fill-mode: forwards !important;
                    -moz-animation-fill-mode: forwards !important;
                    -ms-animation-fill-mode: forwards !important;
                    -o-animation-fill-mode: forwards !important;
                    animation-fill-mode: forwards !important;
                    -webkit-animation-iteration-count: 1 !important;
                    -moz-animation-iteration-count: 1 !important;
                    -ms-animation-iteration-count: 1 !important;
                    -o-animation-iteration-count: 1 !important;
                    animation-iteration-count: 1 !important;
                    -webkit-animation-duration: .01s !important;
                    -moz-animation-duration: .01s !important;
                    -ms-animation-duration: .01s !important;
                    -o-animation-duration: .01s !important;
                    animation-duration: .01s !important;
                }

            `;

        document.head.appendChild( stopAnimationsStyle );

        /** Pause all videos from video tag. */
        ActionStopAnimations.stopVideo();
        window.redadblerStopVideoInterval = setInterval( ActionStopAnimations.stopVideo,1000 );

        /** Stop all youtube videos */
        ActionStopAnimations.stopYouTubeVideo();

    }

    /**
     * Pause self-hosted video players
     */
    static stopVideo() {

        document.querySelectorAll( 'video' ).forEach( vid => {

            // Pause video if it played now
            if ( vid.paused === false ) {

                if ( vid.dataset.pausedByReadabler !== 'true' ) {
                    vid.pause();
                    vid.dataset.pausedByReadabler = 'true';
                }

            }

        } );

    }

    /**
     * Pause YouTube videos
     */
    static stopYouTubeVideo() {

        document.querySelectorAll( 'iframe' ).forEach( iframe => {

            if ( iframe.dataset.pausedByReadabler === 'undefined' ) {

                iframe.dataset.pausedByReadabler = 'true';

            } else {

                setTimeout( function () {

                    let iframeSrc = iframe.src;

                    if ( iframeSrc.includes( 'www.youtube.com/embed' ) ){

                        iframe.src = iframeSrc;
                        iframe.dataset.pausedByReadabler = 'true';

                    }

                }, 300 );

            }

        } );

    }

}


/***/ }),

/***/ "./source/js/action/ActionTextColors.js":
/*!**********************************************!*\
  !*** ./source/js/action/ActionTextColors.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionTextColors": () => (/* binding */ ActionTextColors)
/* harmony export */ });
class ActionTextColors {

    /**
     * Initialise Text Colors action.
     **/
    static init() {

        /** Listen for Text Colors change. */
        let textColors = document.querySelector( '#mdp-readabler-action-text-colors' );
        textColors.addEventListener( 'ReadablerPaletteChanged', ActionTextColors.textColors );

    }

    /**
     * Change Text Color action.
     **/
    static textColors( e ) {

        let color = e.detail.color;

        /** Remove class from body to reset text colors to default state. */
        if ( null === color ) {

            /** Add class to body, to apply styles. */
            document.body.classList.remove( 'mdp-readabler-text-colors' );
            return;

        }

        /** Add class to body, to apply styles. */
        document.body.classList.add( 'mdp-readabler-text-colors' );

        /** Add CSS to header. */
        const textColorsStyle = document.createElement( 'style' );
        textColorsStyle.innerHTML = `
                body.mdp-readabler-text-colors p,
                body.mdp-readabler-text-colors li,
                body.mdp-readabler-text-colors label,
                body.mdp-readabler-text-colors input,
                body.mdp-readabler-text-colors select,
                body.mdp-readabler-text-colors textarea,
                body.mdp-readabler-text-colors legend,
                body.mdp-readabler-text-colors code,
                body.mdp-readabler-text-colors pre,
                body.mdp-readabler-text-colors dd,
                body.mdp-readabler-text-colors dt,
                body.mdp-readabler-text-colors span,
                body.mdp-readabler-text-colors blockquote {
                    color: ${color} !important;
                }
            `;

        document.head.appendChild( textColorsStyle );

    }

}


/***/ }),

/***/ "./source/js/action/ActionTextMagnifier.js":
/*!*************************************************!*\
  !*** ./source/js/action/ActionTextMagnifier.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionTextMagnifier": () => (/* binding */ ActionTextMagnifier)
/* harmony export */ });
const tooltip = document.createElement( 'div' );

class ActionTextMagnifier {

    /**
     * Initialise Text Magnifier action.
     **/
    static init() {

        /** Listen for Text Magnifier change. */
        let textMagnifier = document.querySelector( '#mdp-readabler-action-text-magnifier' );
        textMagnifier.addEventListener( 'ReadablerToggleBoxChanged', ActionTextMagnifier.textMagnifier );

        /** Set id for tooltip. */
        tooltip.id = 'mdp-readabler-text-magnifier-tooltip';

    }

    /**
     * Toggle Text Magnifier.
     **/
    static textMagnifier( e ) {

        /** Disable. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            /** Remove class from body. */
            document.body.classList.remove( 'mdp-readabler-text-magnifier' );

            /** Remove mousemove listener. */
            document.removeEventListener( 'mousemove', ActionTextMagnifier.updateTooltip, false );

            /** Remove tooltip from DOM. */
            document.body.removeChild( tooltip );

            /** Remove events for Show/hide tooltip on mouse leave page. */
            document.removeEventListener( 'mouseleave', ActionTextMagnifier.hideTooltip, false );
            document.removeEventListener( 'mouseenter', ActionTextMagnifier.showTooltip, false );

            return;

        }

        /** Enable. */

        /** Add class to body. */
        document.body.classList.add( 'mdp-readabler-text-magnifier' );

        /** Add tooltip into DOM. */
        document.body.appendChild( tooltip );

        /** Update tooltip on mouse move. */
        document.addEventListener( 'mousemove', ActionTextMagnifier.updateTooltip , false );

        /** Show/hide tooltip on mouse leave page. */
        document.addEventListener( 'mouseleave', ActionTextMagnifier.hideTooltip, false );
        document.addEventListener( 'mouseenter', ActionTextMagnifier.showTooltip, false );

    }

    /** Add tooltip with zoomed content on mouse move. */
    static updateTooltip( e ) {

        /** Show zoomed tooltip only for content tags. */
        let contentElements = [
            'H1',
            'H2',
            'H3',
            'H4',
            'H5',
            'H6',
            'SPAN',
            'P',
            'LI',
            'LABEL',
            'INPUT',
            'SELECT',
            'TEXTAREA',
            'LEGEND',
            'CODE',
            'PRE',
            'DD',
            'DT',
            'A',
            'STRONG',
            'B',
            'BLOCKQUOTE'
        ];

        /** Hide tooltip for non-content tags. */
        if ( ! contentElements.includes( e.target.nodeName ) ) {

            ActionTextMagnifier.hideTooltip();
            return;

        }

        /** Hide tooltip without text. */
        if ( '' === e.target.innerText.trim() ) {

            ActionTextMagnifier.hideTooltip();
            return;

        }

        /** Show tooltip. */
        ActionTextMagnifier.showTooltip();

        /** Set text from under mouse to tooltip. */
        tooltip.innerHTML = e.target.innerText;

        /** Move tooltip to cursor. */
        const shift = 15;
        let maxWidth = window.innerWidth;
        tooltip.style.top = `${ e.clientY + shift }px`;

        /** Stick popup to right if cursor on the right 50% */
        if ( e.clientX > window.innerWidth * 0.5 ) {

            maxWidth = e.clientX - shift <= 680 ? e.clientX - shift : 680;

            tooltip.style.left = `unset`;
            tooltip.style.right = `${ window.innerWidth - e.clientX - shift }px`;
            tooltip.style.maxWidth = `${ maxWidth }px`;

        } else {

            maxWidth = window.innerWidth - e.clientX - 3 * shift < 680 ? window.innerWidth - e.clientX - 3 * shift : 680;

            tooltip.style.right = `unset`;
            tooltip.style.left = `${ e.clientX + shift }px`;
            tooltip.style.maxWidth = `${ maxWidth }px`;

        }

    }

    /** Hide tooltip. */
    static hideTooltip() {
        tooltip.style.visibility = 'hidden';
    }

    /** Show tooltip. */
    static showTooltip() {
        tooltip.style.visibility = 'visible';
    }

}


/***/ }),

/***/ "./source/js/action/ActionTextToSpeech.js":
/*!************************************************!*\
  !*** ./source/js/action/ActionTextToSpeech.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionTextToSpeech": () => (/* binding */ ActionTextToSpeech)
/* harmony export */ });
/* harmony import */ var _TextToSpeechSelection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TextToSpeechSelection */ "./source/js/action/TextToSpeechSelection.js");
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");



const menu = {
    gspeak: true,
    disable: false
};

let readablerTTS = null;
let AudioContext = window.AudioContext || window.webkitAudioContext || false;
let mdp_readabler_context = null;

let selection = '';
let selectionHTML = '';
let text = '';

let _icons = {};
let top = 0;
let left = 0;

let USER_IS_TOUCHING = false; //Detect touch device

const synth = window.speechSynthesis;

class ActionTextToSpeech {

    /** Voicing */
    static voicing( text ) {

        //Stop all speaker before start new speech
        if ( synth.speaking ) {

            synth.pause();
            synth.cancel();
            synth.resume();

        }

        let utterThis = ActionTextToSpeech.utterance( text );
        synth.speak( utterThis );

    }

    /**
     * Utterance
     * @param text
     * @returns {SpeechSynthesisUtterance}
     */
    static utterance( text ) {

        let utterThis = new SpeechSynthesisUtterance();

        utterThis.text = text;

        // Set language
        if ( readablerOptions.ttsLang !== '' ) {

            utterThis.lang = readablerOptions.ttsLang;

        }

        // Set voice name
        if ( readablerOptions.ttsVoiceName !== '' ) {

            utterThis.lang = readablerOptions.ttsVoiceName;

        }

        utterThis.pitch = readablerOptions.ttsPitch;
        utterThis.rate = readablerOptions.ttsRate;
        utterThis.volume = readablerOptions.ttsVolume;

        utterThis.addEventListener( 'start', ActionTextToSpeech.setStopIcon );
        utterThis.addEventListener( 'end', ActionTextToSpeech.onVoiceEnded );

        return utterThis;

    }

    /**
     * Initialise Text To Speech action.
     **/
    static init() {

        if ( synth.getVoices().length > 0 ) {

            if ( document.querySelectorAll( '#mdp-readabler-action-text-to-speech' ).length < 1 ) { return }

            /** Listen for Text To Speech change. */
            let textToSpeech = document.querySelector( '#mdp-readabler-action-text-to-speech' );
            textToSpeech.addEventListener( 'ReadablerToggleBoxChanged', ActionTextToSpeech.textToSpeech );

        }

    }

    /** Unlocking Web Audio for f#cking Safari. */
    static webAudioTouchUnlock() {

        if ( null !== mdp_readabler_context ) { return; }

        mdp_readabler_context = new AudioContext();
        mdp_readabler_context.resume();

    }

    /**
     * Toggle Text To Speech.
     **/
    static textToSpeech( e ) {

        /** Remove class from body to reset to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-text-to-speech' );
            return;

        }

        /** Add class to body as flag. */
        document.body.classList.add( 'mdp-readabler-text-to-speech' );

        /** Init Text to Speech */
        readablerTTS = new _TextToSpeechSelection__WEBPACK_IMPORTED_MODULE_0__.TextToSpeechSelection();
        readablerTTS.init();

        ActionTextToSpeech.webAudioTouchUnlock();
        ActionTextToSpeech.voiceGuide( i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'text-to-speech-guide' ) );

    }

    /**
     * Voice guide
     * @param {string} msg - Voice guide message
     */
    static voiceGuide( msg ) {

        setTimeout(() => {

            ActionTextToSpeech.voicing( msg );

        }, 500 );

    }

    /**
     * Voice button
     * @returns {HTMLDivElement}
     */
    static voiceButton() {

        return ActionTextToSpeech.Button( readablerOptions.ttsPlayIcon, function ( ) {

            ActionTextToSpeech.voicing( text );

        } );

    }

    /**
     * On Playback Finished
     * Hide tooltip, if new selection wasn't made
     */
    static onVoiceEnded() {

        const $tssWrapper = document.querySelector( '.mdp-readabler-tts.stop' );

        if ( $tssWrapper ) {
            $tssWrapper.remove();
        }

    }

    /**
     * Stop the active one if any.
     */
    static stopActiveSource() {

        synth.pause();
        synth.cancel();

    }

    /**
     * Set Play Icon
     */
    static setPlayIcon() {

        /** Select old icon that will be replaced. */
        const el = document.querySelector('.mdp-readabler-tts .selection__icon');

        /** Create a new icon that will take the place of "el". */
        const newEl = document.createElement('div');
        newEl.innerHTML = readablerOptions.ttsPlayIcon;

        /** Replace el with newEL. */
        el.parentNode.replaceChild( newEl, el );

        /** Mark tooltip as 'Play' button. */
        const stop_popup = document.querySelector('.mdp-readabler-tts');
        stop_popup.classList.remove( 'stop' );

        stop_popup.removeEventListener( 'click', ActionTextToSpeech.stopActiveSource );
        stop_popup.removeEventListener( 'click',  ActionTextToSpeech.onVoiceEnded );

    }

    /** Set Stop Icon. */
    static setStopIcon() {

        /** Select old icon that will be replaced. */
        const el = document.querySelector('.mdp-readabler-tts-button svg');

        if ( el ) {

            /** Create a new icon that will take the place of "el". */
            const newEl = document.createElement('div');
            newEl.innerHTML = readablerOptions.ttsStopIcon;

            /** Replace el with newEL. */
            el.parentNode.replaceChild(newEl, el);

            /** Mark tooltip as 'Stop' button. */
            const popup = document.querySelector('.mdp-readabler-tts');
            popup.classList.add( 'stop' );

            const stop_popup = document.querySelector('.mdp-readabler-tts.stop');
            stop_popup.addEventListener( 'click', ActionTextToSpeech.stopActiveSource );
            stop_popup.addEventListener( 'click',  ActionTextToSpeech.onVoiceEnded );

        }

    }

    /**
     * Append icon
     * @returns {{length: number, icons: HTMLDivElement}}
     */
    static appendIcons() {

        const myitems = [
            { feature: 'gspeak', call: ActionTextToSpeech.voiceButton() }
        ];
        const div = document.createElement('div');
        let count = 0;
        myitems.forEach( function ( item) {
            if ( menu[item.feature] ) {
                div.appendChild(item.call);
                count++;
            }
        });

        return {
            icons: div,
            length: count
        };

    }

    /**
     * Set tooltip position
     */
    static setTooltipPosition() {

        const position = selection.getRangeAt(0).getBoundingClientRect();
        const DOCUMENT_SCROLL_TOP = window.pageXOffset || document.documentElement.scrollTop || document.body.scrollTop;

        left = position.left + (position.width - readablerOptions.ttsIconSize * _icons.length) / 2;

        /** Set position for desktop **/
        if ( ! USER_IS_TOUCHING ) {

            top = position.top + DOCUMENT_SCROLL_TOP - readablerOptions.ttsIconSize - 10;

            /** Set position for mobile **/
        } else {

            top = position.bottom + DOCUMENT_SCROLL_TOP + readablerOptions.ttsIconSize + 10;

        }

    }

    /**
     * Change tooltip position
     */
    static moveTooltip() {

        if ( !!document.querySelector('.mdp-readabler-tts') ) {

            ActionTextToSpeech.setTooltipPosition();
            let tooltip = document.querySelector('.mdp-readabler-tts');
            tooltip.style.top = ( top - readablerOptions.ttsIconSize / 2 ) + 'px';
            tooltip.style.left = ( left - readablerOptions.ttsIconSize / 2 ) + 'px';

        }

    }

    /**
     * Draw tooltip
     */
    static drawTooltip() {

        _icons = ActionTextToSpeech.appendIcons();
        ActionTextToSpeech.setTooltipPosition();

        /** Set transition for mobile **/
        let mobileTransform = '';
        if ( USER_IS_TOUCHING ) {
            mobileTransform = 'transform-origin: top; transform: scale(1,-1)';
        }

        const div = document.createElement('div');
        div.className = 'mdp-readabler-tts';
        // noinspection JSValidateTypes
        div.style =
            'top:' + ( top - readablerOptions.ttsIconSize / 2 ) + 'px;' +
            'left:' + ( left - readablerOptions.ttsIconSize / 2 ) + 'px;' +
            mobileTransform;

        div.appendChild( _icons.icons );

        const arrow = document.createElement( 'div' );
        arrow.classList.add( 'mdp-readabler-tts-arrow' )
        // noinspection JSValidateTypes
        arrow.style =
            'left:' + ( readablerOptions.ttsIconSize * _icons.length / 2 + 2 ) + 'px;';

        if ( ! menu.disable ) {
            div.appendChild( arrow );
        }

        document.body.appendChild( div );
    }

    /**
     * Attach events
     */
    static attachEvents() {

        /**
         * Return selection or false if TTS of
         * @return {boolean}
         */
        function hasSelection() {

            return null !== readablerTTS ?
                !!window.getSelection().toString() :
                false;

        }

        function hasTooltipDrawn() {
            return !!document.querySelector('.mdp-readabler-tts');
        }

        /** Return HTML of selected text. */
        function getHTMLOfSelection () {
            let range;
            if ( document.selection && document.selection.createRange ) {

                range = document.selection.createRange();

                // noinspection JSUnresolvedVariable
                return range.text;

            }
            else if (window.getSelection) {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    range = selection.getRangeAt(0);
                    const clonedSelection = range.cloneContents();
                    const div = document.createElement('div');
                    div.appendChild(clonedSelection);
                    return div.innerText;
                }
                else {
                    return '';
                }
            }
            else {
                return '';
            }
        }

        /** Selecting the full word if only its parts are selected. */
        function snapSelectionToWord() {
            let sel;

            /** Do not Modify Selection for Touch devices. */
            if ( USER_IS_TOUCHING ) {
                if( window.getSelection ) {
                    sel = window.getSelection();
                } else if ( document.getSelection ) {
                    sel = document.getSelection();
                } else if ( document.selection ) {
                    sel = document.selection.createRange().text;
                }
                return sel;
            }

            /**
             * Check for existence of window.getSelection() and that it has a
             * modify() method. IE 9 has both selection APIs but no modify() method.
             **/
            // noinspection JSUnresolvedVariable
            if ( window.getSelection && (sel = window.getSelection()).modify ) {
                sel = window.getSelection();
                if ( ! sel.isCollapsed ) {

                    /** Detect if selection is backwards. */
                    const range = document.createRange();
                    range.setStart(sel.anchorNode, sel.anchorOffset);
                    range.setEnd(sel.focusNode, sel.focusOffset);
                    const backwards = range.collapsed;
                    range.detach();

                    /** Modify() works on the focus of the selection. */
                    const endNode = sel.focusNode, endOffset = sel.focusOffset;
                    sel.collapse(sel.anchorNode, sel.anchorOffset);

                    let direction;
                    if (backwards) {
                        direction = ['backward', 'forward'];
                    } else {
                        direction = ['forward', 'backward'];
                    }

                    // noinspection JSUnresolvedFunction
                    sel.modify( 'move', direction[0], 'character' );
                    // noinspection JSUnresolvedFunction
                    sel.modify( 'move', direction[1], 'word' );
                    sel.extend( endNode, endOffset);
                    // noinspection JSUnresolvedFunction
                    sel.modify( 'extend', direction[1], 'character' );
                    // noinspection JSUnresolvedFunction
                    sel.modify( 'extend', direction[0], 'word' );
                }
            } else if ( ( sel = document.selection ) && sel.type !== 'Control' ) {
                const textRange = sel.createRange();
                if ( textRange.text ) {
                    textRange.expand( 'word' );

                    /** Move the end back to not include the word's trailing space(s), if necessary. */
                    while ( /\s$/.test( textRange.text ) ) {
                        // noinspection JSUnresolvedFunction
                        textRange.moveEnd( 'character', -1 );
                    }
                    textRange.select();
                }
            }

            return sel;
        }

        const onMouseUp = function () {

            setTimeout( function mouseTimeout() {

                if ( hasTooltipDrawn() ) {

                    if (hasSelection()) {

                        selection = snapSelectionToWord();

                        selectionHTML = getHTMLOfSelection();
                        text = selectionHTML;

                        ActionTextToSpeech.moveTooltip();

                        /** If now playing, set icon to play. */
                        if ( document.querySelector('.mdp-readabler-tts.stop') ) {

                            /** Set ion Play. */
                            ActionTextToSpeech.setPlayIcon();

                        }

                    }

                } else if ( hasSelection() ) {

                    selection = snapSelectionToWord();
                    selectionHTML = getHTMLOfSelection();
                    text = selectionHTML;
                    ActionTextToSpeech.drawTooltip();

                }
            }, 10 );

        };

        window.addEventListener( 'mouseup', onMouseUp, true );
        window.addEventListener( 'touchend', onMouseUp, false );
        window.addEventListener( 'touchcancel', onMouseUp, false );
        window.addEventListener( 'selectionchange', onMouseUp, false );

        window.addEventListener( 'resize', ActionTextToSpeech.moveTooltip, false );

        /** We want to detect human touch, not device touch. */
        window.addEventListener( 'touchstart', function onFirstTouch() {

            /** Set global flag. */
            USER_IS_TOUCHING = true;

            document.addEventListener( 'selectionchange', onMouseUp, true );

            /** We only need to know once that a human touched the screen, so we can stop listening now. */
            window.removeEventListener( 'touchstart', onFirstTouch, false );
        } );

    }

    /**
     * Render button.
     * @param icon - SVG icon
     * @param clickFn - Click event handler
     * @return {HTMLDivElement}
     * @constructor
     */
    static Button( icon, clickFn ) {

        const btn = document.createElement('div');
        btn.classList.add( 'mdp-readabler-tts-button' );
        btn.innerHTML = icon;
        btn.onclick = clickFn;

        if ( btn.id === 'mdp-readabler-tts-preloader' ) {

            btn.style.transition = 'none';

        } else {

            btn.onmouseover = function () {
                this.style.transform = 'scale(1.2)';
            };
            btn.onmouseout = function () {
                this.style.transform = 'scale(1)';
            };

        }

        return btn;
    }

}


/***/ }),

/***/ "./source/js/action/ActionTitleColors.js":
/*!***********************************************!*\
  !*** ./source/js/action/ActionTitleColors.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionTitleColors": () => (/* binding */ ActionTitleColors)
/* harmony export */ });
class ActionTitleColors {

    /**
     * Initialise Title Colors action.
     **/
    static init() {

        /** Listen for Title Colors change. */
        let titleColors = document.querySelector( '#mdp-readabler-action-title-colors' );
        titleColors.addEventListener( 'ReadablerPaletteChanged', ActionTitleColors.titleColors );

    }

    /**
     * Change Title Color action.
     **/
    static titleColors( e ) {

        let color = e.detail.color;

        /** Remove class from body to reset Title colors to default state. */
        if ( null === color ) {

            /** Add class to body, to apply styles. */
            document.body.classList.remove( 'mdp-readabler-title-colors' );
            return;

        }

        /** Add class to body, to apply styles. */
        document.body.classList.add( 'mdp-readabler-title-colors' );

        /** Add CSS to header. */
        const titleColorsStyle = document.createElement( 'style' );
        titleColorsStyle.innerHTML = `
                body.mdp-readabler-title-colors h1,
                body.mdp-readabler-title-colors h1 *,
                body.mdp-readabler-title-colors h2,
                body.mdp-readabler-title-colors h2 *,
                body.mdp-readabler-title-colors h3,
                body.mdp-readabler-title-colors h3 *,
                body.mdp-readabler-title-colors h4,
                body.mdp-readabler-title-colors h4 *,
                body.mdp-readabler-title-colors h5,
                body.mdp-readabler-title-colors h5 *,
                body.mdp-readabler-title-colors h6,
                body.mdp-readabler-title-colors h6 * {
                    color: ${color} !important;
                }
            `;

        document.head.appendChild( titleColorsStyle );

    }

}


/***/ }),

/***/ "./source/js/action/ActionUsefulLinks.js":
/*!***********************************************!*\
  !*** ./source/js/action/ActionUsefulLinks.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionUsefulLinks": () => (/* binding */ ActionUsefulLinks)
/* harmony export */ });
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");


class ActionUsefulLinks {

    /**
     * Initialise Useful Links action.
     **/
    static init() {

        /** Build select. */
        ActionUsefulLinks.buildSelect();

        /** Go to link on select change. */
        let select = document.querySelector( '#mdp-readabler-useful-links' );
        select.addEventListener('change', ( e ) => {

            // noinspection JSUnresolvedVariable
            window.location.href = e.target.value;

        } );

    }

    /**
     * Collect and filter all links on page
     **/
    static grabLinks() {

        /** Grab links on page. */
        let x = document.querySelectorAll( 'a' );
        let links = []

        /** Add home link first. */
        links.push( [ i18next__WEBPACK_IMPORTED_MODULE_0__["default"].t( 'home' ) , window.location.origin] );
        for ( let i = 0; i < x.length; i++ ) {

            /** Get text from link. */
            let text = x[i].innerText;
            text = text.replace( /\s+/g, ' ' ).trim();
            if ( '' === text ) { continue; }
            text = text.substring( 0, 42 ); // Trim long text.

            /** Get link. */
            let link = x[i].href;
            link = link.trim();
            if ( '' === link ) { continue; } // Skip empty links.
            if ( '#' === link ) { continue; } // Skip # links.
            if ( link.toLowerCase().startsWith( 'javascript:' ) ) { continue; } // Skip javascript processed links.

            /** Check for duplicates. */
            if ( links.some( function( item ) {
                return item[1] === link;
            } ) ) {
                continue;
            }

            links.push( [text, link] );

        }

        return  links;

    }

    /**
     * Build Useful links select.
     * Add options to select.
     **/
    static buildSelect() {

        /** Collect all links. */
        let links = ActionUsefulLinks.grabLinks();
        let select = document.querySelector( '#mdp-readabler-useful-links' );

        /** Add links to select. */
        for ( let i = 0; i < links.length; i++ ) {

            let optionEl = document.createElement( 'option' );
            optionEl.textContent = links[i][0];
            optionEl.value = links[i][1];

            select.appendChild( optionEl );

        }

    }

}


/***/ }),

/***/ "./source/js/action/ActionVirtualKeyboard.js":
/*!***************************************************!*\
  !*** ./source/js/action/ActionVirtualKeyboard.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionVirtualKeyboard": () => (/* binding */ ActionVirtualKeyboard)
/* harmony export */ });
/* harmony import */ var simple_keyboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! simple-keyboard */ "./node_modules/simple-keyboard/build/index.js");
/* harmony import */ var simple_keyboard__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(simple_keyboard__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var simple_keyboard_layouts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! simple-keyboard-layouts */ "./node_modules/simple-keyboard-layouts/build/index.js");
/* harmony import */ var simple_keyboard_layouts__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(simple_keyboard_layouts__WEBPACK_IMPORTED_MODULE_1__);



let keyboard = null;
let selectedInput = null;

class ActionVirtualKeyboard {

    /**
     * Initialise Virtual Keyboard action.
     **/
    static init() {

        /** Listen for Virtual Keyboard change. */
        let virtualKeyboard = document.querySelector( '#mdp-readabler-action-virtual-keyboard' );
        virtualKeyboard.addEventListener( 'ReadablerToggleBoxChanged', ActionVirtualKeyboard.virtualKeyboard );

        /**
         * Attach events to input and textarea.
         **/
        document.querySelectorAll( 'textarea, input[type]:not([type=radio]):not([type=checkbox]):not([type=hidden])' ).forEach( input  => {

            input.addEventListener( 'focus', ActionVirtualKeyboard.onInputFocus );
            input.addEventListener( 'input', ActionVirtualKeyboard.onInputChange );

        } );

        /**
         * Hide Keyboard on click outside.
         **/
        document.addEventListener( 'click', event => {

            // noinspection JSUnresolvedVariable
            let elType = event.target.nodeName.toLowerCase();

            // noinspection JSUnresolvedFunction
            if (

                /** Target is not keyboard element. */
                null === event.target.closest( '#mdp-readabler-keyboard-box' ) &&
                /** And not input. */
                elType !== 'input' &&
                /** And not textarea. */
                elType !== 'textarea'

            ) {

                /** Hide keyboard. */
                const keyboardBox = document.getElementById( 'mdp-readabler-keyboard-box' );
                keyboardBox.style.display = 'none';

            }

        } );

        /** Make Keyboard Box draggable. */
        ActionVirtualKeyboard.makeKeyboardDraggable();

    }

    /**
     * Show keyboard when input get focus.
     **/
    static onInputFocus( event ) {

        /** Work only with enabled keyboard. */
        if ( ! document.body.classList.contains( 'mdp-readabler-virtual-keyboard' ) ) { return; }

        /** Show keyboard. */
        const keyboardBox = document.getElementById( 'mdp-readabler-keyboard-box' );
        keyboardBox.style.display = 'block';

        /** We need id for each input. */
        if ( ! event.target.id ) {
            event.target.id = ActionVirtualKeyboard.uid();
        }

        selectedInput = `#${event.target.id}`;

        keyboard.setOptions( { inputName: event.target.id } );

    }

    /**
     * Update virtual keyboard when input is changed directly.
     **/
    static onInputChange( event ) {

        /** Work only with enabled keyboard. */
        if ( ! document.body.classList.contains( 'mdp-readabler-virtual-keyboard' ) ) { return; }

        keyboard.setInput( event.target.value, event.target.id );

    }

    /**
     * Toggle Virtual Keyboard.
     **/
    static virtualKeyboard( e ) {

        /** Remove class from body to flag state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-virtual-keyboard' );

            /** Destroy keyboard. */
            keyboard.destroy();

            return;

        }

        /** Add class to body as flag. */
        document.body.classList.add( 'mdp-readabler-virtual-keyboard' );

        /** Set selected layout for keyboard. */
        const KeyboardLayouts = new (simple_keyboard_layouts__WEBPACK_IMPORTED_MODULE_1___default())();
        const layout = KeyboardLayouts.get( readablerOptions.virtualKeyboardLayout );

        /** Create keyboard. */
        keyboard = new (simple_keyboard__WEBPACK_IMPORTED_MODULE_0___default())( {
            newLineOnEnter: true,
            onChange: input => ActionVirtualKeyboard.onChange( input ),
            onKeyPress: button => ActionVirtualKeyboard.onKeyPress( button ),
            layout: layout.layout,
            theme: 'mdp-readabler-simple-keyboard',
            physicalKeyboardHighlight: true
        } );

    }

    /**
     * onChange handler for keyboard.
     **/
    static onChange( input ) {

        document.querySelector( selectedInput ).value = input;

    }

    /**
     * onKeyPress handler for keyboard.
     **/
    static onKeyPress( button ) {

        /** Shift functionality. */
        if ( button === '{lock}' || button === '{shift}' ) {
            ActionVirtualKeyboard.handleShiftButton();
        }

    }

    /**
     * Change keys case on shift key.
     **/
    static handleShiftButton() {

        let currentLayout = keyboard.options.layoutName;
        let shiftToggle = currentLayout === "default" ? "shift" : "default";

        keyboard.setOptions( {
            layoutName: shiftToggle
        } );

    }

    /**
     * Generates unique IDs that are sorted by its generated Date.
     **/
    static uid() {

        return 'mdp-' + Date.now().toString( 36 ) + Math.random().toString( 36 ).substr( 2 );

    }

    /**
     * Make keyboard box draggable.
     **/
    static makeKeyboardDraggable() {

        let dragItem = document.getElementById( 'mdp-readabler-keyboard-box' );;
        let container = document.documentElement;

        let active = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        container.addEventListener("touchstart", dragStart, { passive: true } );
        container.addEventListener("touchend", dragEnd, false);
        container.addEventListener("touchmove", drag, false);

        container.addEventListener("mousedown", dragStart, false);
        container.addEventListener("mouseup", dragEnd, false);
        container.addEventListener("mousemove", drag, false);

        function dragStart( e ) {

            if ( e.type === "touchstart" ) {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }

            if ( e.target === dragItem ) {
                active = true;
            }

        }

        function dragEnd() {

            initialX = currentX;
            initialY = currentY;

            active = false;

        }

        function drag( e ) {

            if ( active ) {

                if (e.type === "touchmove") {
                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                } else {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                }

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, dragItem);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
        }

    }

}


/***/ }),

/***/ "./source/js/action/TextToSpeechSelection.js":
/*!***************************************************!*\
  !*** ./source/js/action/TextToSpeechSelection.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TextToSpeechSelection": () => (/* binding */ TextToSpeechSelection)
/* harmony export */ });
/* harmony import */ var _ActionTextToSpeech__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ActionTextToSpeech */ "./source/js/action/ActionTextToSpeech.js");


const TextToSpeechSelection = (function () {

    function _selection() {

        function init() {

            _ActionTextToSpeech__WEBPACK_IMPORTED_MODULE_0__.ActionTextToSpeech.attachEvents();
            return this;

        }

        return {
            init: init
        };
    }

    return _selection;

})();


/***/ }),

/***/ "./source/js/import/defaultOptions.js":
/*!********************************************!*\
  !*** ./source/js/import/defaultOptions.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "defaultOptions": () => (/* binding */ defaultOptions)
/* harmony export */ });
/* harmony import */ var _palette__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./palette */ "./source/js/import/palette.js");


let defaultOptions = {

    'path'                          : './readabler',
    'locale'                        : '',
    'supportedLanguages'            : [ 'en', 'uk' ],       /** NEW */
    'palette'                       : _palette__WEBPACK_IMPORTED_MODULE_0__.palette,
    'headingTag'                    : 'h3',
    'subHeadingTag'                 : 'h4',

    // Templates
    'template'                      : 'popup',              /** NEW */ // popup, off-canvas, aside
    'sidebarAlign'                  : 'left',               /** NEW */

    // Open Button
    'showOpenButton'                : true,
    'buttonTabulationIndex'         : 0,
    'buttonPosition'                : 'bottom-right',
    'buttonCaption'                 : '',
    'buttonIcon'                    : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 293.05 349.63"><path d="M95.37,51.29a51.23,51.23,0,1,1,51.29,51.16h-.07A51.19,51.19,0,0,1,95.37,51.29ZM293,134.59A25.61,25.61,0,0,0,265.49,111h-.13l-89.64,8c-3.06.28-6.13.42-9.19.42H126.65q-4.59,0-9.16-.41L27.7,111a25.58,25.58,0,0,0-4.23,51l.22,0,72.45,6.56a8.55,8.55,0,0,1,7.77,8.48v19.62a33.82,33.82,0,0,1-2.36,12.45L60.48,313.66a25.61,25.61,0,1,0,46.85,20.71h0l39.14-95.61L186,334.63A25.61,25.61,0,0,0,232.86,314L191.63,209.14a34.14,34.14,0,0,1-2.35-12.44V177.09a8.55,8.55,0,0,1,7.77-8.49l72.33-6.55A25.61,25.61,0,0,0,293,134.59Z"/></svg>',
    'buttonIconPosition'            : 'before',
    'buttonEntranceAnimation'       : 'fade',
    'buttonHoverAnimation'          : 'none',

    // Popup
    'popupOverlay'                  : true,
    'popupAnimation'                : 'fade',
    'popupScroll'                   : false,
    'closeAnywhere'                 : true,
    'closeButton'                   : true,
    'popupDraggable'                : true,
    'popupShadow'                   : true,                 /** NEW */

    // Accessibility Profiles
    'accessibilityProfiles'         : true,
    'profileEpilepsy'               : true,
    'profileVisuallyImpaired'       : true,
    'profileCognitiveDisability'    : true,
    'profileAdhdFriendly'           : true,
    'profileBlindUsers'             : true,

    // Online Dictionary
    'onlineDictionary'              : true,
    'language'                      : 'auto',

    // Readable Experience
    'readableExperience'            : true,
    'contentScaling'                : true,
    'textMagnifier'                 : true,
    'readableFont'                  : true,
    'dyslexiaFont'                  : true,
    'highlightTitles'               : true,
    'highlightLinks'                : true,
    'fontSizing'                    : true,
    'lineHeight'                    : true,
    'letterSpacing'                 : true,
    'alignCenter'                   : true,
    'alignLeft'                     : true,
    'alignRight'                    : true,

    // Visually Pleasing Experience
    'visuallyPleasingExperience'    : true,
    'darkContrast'                  : true,
    'lightContrast'                 : true,
    'monochrome'                    : true,
    'highSaturation'                : true,
    'highContrast'                  : true,
    'lowSaturation'                 : true,
    'textColors'                    : true,
    'titleColors'                   : true,
    'backgroundColors'              : true,

    // Easy Orientation
    'easyOrientation'               : true,
    'muteSounds'                    : true,
    'hideImages'                    : true,
    'virtualKeyboard'               : true,
    'readingGuide'                  : true,
    'usefulLinks'                   : true,
    'stopAnimations'                : true,
    'readingMask'                   : true,
    'highlightHover'                : true,
    'highlightFocus'                : true,
    'bigBlackCursor'                : true,
    'bigWhiteCursor'                : true,
    'textToSpeech'                  : true,
    'keyboardNavigation'            : true,

    // Footer
    'resetButton'                   : true,
    'hideButton'                    : true,
    'accessibilityStatement'        : true,
    'accessibilityStatementType'    : 'iframe', // iframe, html, link
    'accessibilityStatementLink'    : '../assets/readabler/accessibility-statement.html',
    'accessibilityStatementHtml'    : '',

    // Reading Mask
    'readingMaskHeight'             : 100,

    // Virtual Keyboard
    'virtualKeyboardLayout'         : 'english',

    // Hot Keys
    'hotKeyOpenInterface'           : 'Alt+9',
    'hotKeyMenu'                    : 'M',
    'hotKeyHeadings'                : 'H',
    'hotKeyForms'                   : 'F',
    'hotKeyButtons'                 : 'B',
    'hotKeyGraphics'                : 'G',

    // Text to Speech
    'ttsPlayIcon'                   : '<svg class="selection__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M19.3,10.7L9.1,4.2C8.8,4,8.4,4,8.1,4C7,4,7,4.9,7,5.1v13.4c0,0.2,0,1.1,1.1,1.1c0.3,0,0.7,0,1-0.2l10.2-6.5c0.8-0.5,0.7-1.1,0.7-1.1S20.1,11.2,19.3,10.7z"/></svg>',
    'ttsStopIcon'                   : '<svg class="selection__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M18.001 4.2H6A1.8 1.8 0 0 0 4.2 5.999V18A1.8 1.8 0 0 0 5.999 19.8H18a1.8 1.8 0 0 0 1.799-1.799V6c0-.992-.807-1.799-1.799-1.799z"/></svg>',
    'ttsIconSize'                   : 32,
    'ttsLang'                       : '',
    'ttsPitch'                      : 1,  // 0 - 2 (float)
    'ttsRate'                       : 1,  // 0.1 - 10 (float)
    'ttsVoiceName'                  : '',
    'ttsVolume'                     : 1   // 0 - 1 (float)

};


/***/ }),

/***/ "./source/js/import/palette.js":
/*!*************************************!*\
  !*** ./source/js/import/palette.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "palette": () => (/* binding */ palette)
/* harmony export */ });
const palette = [
    {
        'name' : 'Maroon',
        'value' : 'maroon',
    },
    {
        'name' : 'Red',
        'value' : 'red',
    },
    {
        'name' : 'Orange',
        'value' : 'orange',
    },
    {
        'name' : 'Yellow',
        'value' : 'yellow',
    },
    {
        'name' : 'Olive',
        'value' : 'olive',
    },
    {
        'name' : 'Green',
        'value' : 'green',
    },
    {
        'name' : 'Purple',
        'value' : 'purple',
    },
    {
        'name' : 'Fuchsia',
        'value' : 'fuchsia',
    },
    {
        'name' : 'Lime',
        'value' : 'lime',
    },
    {
        'name' : 'Teal',
        'value' : 'teal',
    },
    {
        'name' : 'Aqua',
        'value' : 'aqua',
    },
    {
        'name' : 'Blue',
        'value' : 'blue',
    },
    {
        'name' : 'Navy',
        'value' : 'navy',
    },
    {
        'name' : 'Black',
        'value' : 'black',
    },
    {
        'name' : 'White',
        'value' : 'white',
    }
];


/***/ }),

/***/ "./source/js/import/tools.js":
/*!***********************************!*\
  !*** ./source/js/import/tools.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "delay": () => (/* binding */ delay),
/* harmony export */   "disableOthers": () => (/* binding */ disableOthers),
/* harmony export */   "focusSnail": () => (/* binding */ focusSnail),
/* harmony export */   "getLocal": () => (/* binding */ getLocal),
/* harmony export */   "setLocal": () => (/* binding */ setLocal),
/* harmony export */   "toCamelCase": () => (/* binding */ toCamelCase)
/* harmony export */ });
/**
 * Convert phrase to CamelCase.
 *
 * @param phrase
 * @param separator
 *
 * @return {string}
 **/
function toCamelCase ( phrase, separator = ' ' ) {

    return phrase
        .toLowerCase()
        .split( separator )
        .map( word => word.charAt( 0 ).toUpperCase() + word.slice( 1 ) )
        .join( separator );

}

/**
 * Wrapper for localStorage.getItem, add prefix to all keys.
 *
 * @param key
 **/
function getLocal( key ) {

    /** Prefix for all localStorage keys. */
    let prefix = 'mdpReadabler';

    try {

        return localStorage.getItem( prefix + key );

    } catch ( e ) {

        return null;

    }

}

/**
* Wrapper for localStorage.setItem, add prefix to all keys.
*
* @param key
* @param value
**/
function setLocal( key, value ) {

    /** Prefix for all localStorage keys. */
    let prefix = 'mdpReadabler';

    try {

        return localStorage.setItem( prefix + key, value );

    } catch ( e ) {

        return false;

    }

}

/**
 * Executing a function after delay for a specified amount of time.
 * Example: the user has stopped typing.
 **/
function delay( fn, ms ) {

    let timer = 0

    return function ( ...args ) {

        clearTimeout( timer )

        timer = setTimeout( fn.bind( this, ...args ), ms || 0 )

    }

}

/**
 * Disable other buttons in button group.
 **/
function disableOthers( el ) {

    let activeBtn = document.querySelectorAll('#mdp-readabler-visually-pleasing-experience-box .mdp-readabler-toggle-box.mdp-active');
    activeBtn.forEach( btn  => {

        if ( el.id !== btn.id ) {
            btn.click();
        }

    } );

}

/**
 * Focus Snail.
 * @see https://github.com/NV/focus-snail/
 *
 * Update with care, changes have been made.
 **/
let focusSnail = (function() {
    'use strict';

    const OFFSET_PX = 0;
    const MIN_WIDTH = 12;
    const MIN_HEIGHT = 8;

    const START_FRACTION = 0.4;
    const MIDDLE_FRACTION = 0.8;

    const focusSnail = {
        enabled: false,
        trigger: trigger
    };

    /**
     * @param {Element} prevFocused
     * @param {Element|EventTarget} target
     */
    function trigger(prevFocused, target) {
        if (svg) {
            onEnd();
        } else {
            initialize();
        }

        const prev = dimensionsOf( prevFocused );
        const current = dimensionsOf( target );

        let left = 0;
        let prevLeft = 0;
        let top = 0;
        let prevTop = 0;

        const distance = dist( prev.left, prev.top, current.left, current.top );
        const duration = animationDuration( distance );

        function setup() {
            const scroll = scrollOffset();
            svg.style.left = scroll.left + 'px';
            svg.style.top = scroll.top + 'px';
            svg.setAttribute('width', win.innerWidth.toString());
            svg.setAttribute('height', win.innerHeight.toString());
            svg.classList.add('focus-snail_visible');
            left = current.left - scroll.left;
            prevLeft = prev.left - scroll.left;
            top = current.top - scroll.top;
            prevTop = prev.top - scroll.top;
        }

        let isFirstCall = true;

        animate(function(fraction) {
            if (isFirstCall) {
                setup();
                setGradientAngle(gradient, prevLeft, prevTop, prev.width, prev.height, left, top, current.width, current.height);
                const list = getPointsList( {
                    top: prevTop,
                    right: prevLeft + prev.width,
                    bottom: prevTop + prev.height,
                    left: prevLeft
                }, {
                    top: top,
                    right: left + current.width,
                    bottom: top + current.height,
                    left: left
                } );
                enclose(list, polygon);
            }

            const startOffset = fraction > START_FRACTION ? easeOutQuad( (fraction - START_FRACTION) / (1 - START_FRACTION) ) : 0;
            const middleOffset = fraction < MIDDLE_FRACTION ? easeOutQuad( fraction / MIDDLE_FRACTION ) : 1;
            start.setAttribute('offset', startOffset * 100 + '%');
            middle.setAttribute('offset', middleOffset * 100 + '%');

            if (fraction >= 1) {
                onEnd();
            }

            isFirstCall = false;
        }, duration);
    }

    function animationDuration(distance) {
        return Math.pow(constrain(distance, 32, 1024), 1/3) * 50;
    }

    function easeOutQuad(x) {
        return 2*x - x*x;
    }

    let win = window;
    const doc = document;
    const docElement = doc.documentElement;
    const body = doc.body;

    let prevFocused = null;
    let animationId = 0;
    let keyDownTime = 0;

    // noinspection JSUnusedLocalSymbols
    docElement.addEventListener('keydown', function(event) {
        if (!focusSnail.enabled) {
            return;
        }
        keyDownTime = Date.now();
    }, false);

    docElement.addEventListener('blur', function(e) {
        if (!focusSnail.enabled) {
            return;
        }
        onEnd();
        if (isJustPressed()) {
            prevFocused = e.target;
        } else {
            prevFocused = null;
        }
    }, true);

    docElement.addEventListener('focus', function(event) {

        if (!prevFocused) {
            return;
        }
        if (!isJustPressed()) {
            return;
        }

        trigger( prevFocused, event.target );

    }, true);

    function setGradientAngle(gradient, ax, ay, aWidth, aHeight, bx, by, bWidth, bHeight) {

        const centroidA = rectCentroid( ax, ay, aWidth, aHeight );
        const centroidB = rectCentroid( bx, by, bWidth, bHeight );
        const angle = Math.atan2( centroidA.y - centroidB.y, centroidA.x - centroidB.x );
        const line = angleToLine( angle );

        gradient.setAttribute( 'x1', line.x1 );
        gradient.setAttribute( 'y1', line.y1 );
        gradient.setAttribute( 'x2', !isNaN( line.x2 ) ? line.x2 : 0 );
        gradient.setAttribute( 'y2', !isNaN( line.y2 ) ? line.y2 : 0 );

    }

    function rectCentroid(x, y, width, height) {
        return {
            x: x + width / 2,
            y: y + height / 2
        };
    }

    function angleToLine(angle) {
        const segment = Math.floor( angle / Math.PI * 2 ) + 2;
        const diagonal = Math.PI / 4 + Math.PI / 2 * segment;

        const od = Math.sqrt( 2 );
        const op = Math.cos( Math.abs( diagonal - angle ) ) * od;
        const x = op * Math.cos( angle );
        const y = op * Math.sin( angle );

        return {
            x1: x < 0 ? 1 : 0,
            y1: y < 0 ? 1 : 0,
            x2: x >= 0 ? x : x + 1,
            y2: y >= 0 ? y : y + 1
        };
    }

    /** @type {SVGSVGElement} */
    let svg = null;

    /** @type {SVGPolygonElement} */
    let polygon = null;

    /** @type SVGStopElement */
    let start = null;

    /** @type SVGStopElement */
    let middle = null;

    /** @type SVGStopElement */
    let end = null;

    /** @type SVGLinearGradientElement */
    let gradient = null;

    function htmlFragment() {
        const div = doc.createElement( 'div' );
        // noinspection RequiredAttributes
        div.innerHTML = '<svg id="focus-snail_svg" width="1000" height="800">\
		<linearGradient id="focus-snail_gradient">\
			<stop id="focus-snail_start" offset="0%" stop-color="' + readablerOptions.highlightFocusColor + '" stop-opacity="0"/>\
			<stop id="focus-snail_middle" offset="80%" stop-color="' + readablerOptions.highlightFocusColor + '" stop-opacity="0.8"/>\
			<stop id="focus-snail_end" offset="100%" stop-color="' + readablerOptions.highlightFocusColor + '" stop-opacity="0"/>\
		</linearGradient>\
		<polygon id="focus-snail_polygon" fill="url(#focus-snail_gradient)"/>\
	</svg>';
        return div;
    }

    function initialize() {
        const html = htmlFragment();
        svg = getId(html, 'svg');
        polygon = getId(html, 'polygon');
        start = getId(html, 'start');
        middle = getId(html, 'middle');
        end = getId(html, 'end');
        gradient = getId(html, 'gradient');
        body.appendChild(svg);
    }

    function getId(elem, name) {
        return elem.querySelector('#focus-snail_' + name);
    }

    function onEnd() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = 0;
            svg.classList.remove('focus-snail_visible');
        }
    }

    function isJustPressed() {
        return Date.now() - keyDownTime < 42
    }

    function animate(onStep, duration) {
        const start = Date.now();
        (function loop() {
            animationId = requestAnimationFrame(function() {
                const diff = Date.now() - start;
                const fraction = diff / duration;
                onStep(fraction);
                if (diff < duration) {
                    loop();
                }
            });
        })();
    }

    function getPointsList(a, b) {
        let x = 0;

        if (a.top < b.top)
            x = 1;

        if (a.right > b.right)
            x += 2;

        if (a.bottom > b.bottom)
            x += 4;

        if (a.left < b.left)
            x += 8;

        const dict = [
            [],
            [0, 1],
            [1, 2],
            [0, 1, 2],
            [2, 3],
            [0, 1], // FIXME: do two polygons
            [1, 2, 3],
            [0, 1, 2, 3],
            [3, 0],
            [3, 0, 1],
            [3, 0], // FIXME: do two polygons
            [3, 0, 1, 2],
            [2, 3, 0],
            [2, 3, 0, 1],
            [1, 2, 3, 0],
            [0, 1, 2, 3, 0]
        ];

        const points = rectPoints( a ).concat( rectPoints( b ) );
        const list = [];
        const indexes = dict[x];
        let i;
        for ( i = 0; i < indexes.length; i++) {
            list.push(points[indexes[i]]);
        }
        while (i--) {
            list.push(points[indexes[i] + 4]);
        }
        return list;
    }

    function enclose(list, polygon) {
        polygon.points.clear();
        for ( let i = 0; i < list.length; i++) {
            const p = list[i];
            addPoint(polygon, p);
        }
    }

    function addPoint(polygon, point) {

        const pt = polygon.ownerSVGElement.createSVGPoint();
        pt.x = !isNaN( point.x ) ? point.x : 0;
        pt.y = !isNaN( point.y ) ? point.y : 0;
        polygon.points.appendItem(pt);

    }

    function rectPoints(rect) {
        return [
            {
                x: rect.left,
                y: rect.top
            },
            {
                x: rect.right,
                y: rect.top
            },
            {
                x: rect.right,
                y: rect.bottom
            },
            {
                x: rect.left,
                y: rect.bottom
            }
        ];
    }

    function dimensionsOf(element) {
        const offset = offsetOf( element );
        return {
            left: offset.left - OFFSET_PX,
            top: offset.top - OFFSET_PX,
            width: Math.max(MIN_WIDTH, element.offsetWidth) + 2*OFFSET_PX,
            height: Math.max(MIN_HEIGHT, element.offsetHeight) + 2*OFFSET_PX
        };
    }

    function offsetOf(elem) {
        const rect = elem.getBoundingClientRect();
        const scroll = scrollOffset();

        const clientTop = docElement.clientTop || body.clientTop,
            clientLeft = docElement.clientLeft || body.clientLeft,
            top = rect.top + scroll.top - clientTop,
            left = rect.left + scroll.left - clientLeft;

        return {
            top: top || 0,
            left: left || 0
        };
    }

    function scrollOffset() {
        const top = win.pageYOffset || docElement.scrollTop;
        const left = win.pageXOffset || docElement.scrollLeft;
        return {
            top: top || 0,
            left: left || 0
        };
    }

    function dist(x1, y1, x2, y2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return Math.sqrt(dx*dx + dy*dy);
    }

    function constrain(amt, low, high) {
        if (amt <= low) {
            return low;
        }
        if (amt >= high) {
            return high;
        }
        return amt;
    }

    const style = doc.createElement( 'style' );
    style.textContent = "#focus-snail_svg {\
	position: absolute;\
	top: 0;\
	right: 0;\
	bottom: 0;\
	left: 0;\
	margin: 0;\
	background: transparent;\
	visibility: hidden;\
	pointer-events: none;\
	-webkit-transform: translateZ(0);\
}\
\
#focus-snail_svg.focus-snail_visible {\
	visibility: visible;\
	z-index: 999;\
}\
\
#focus-snail_polygon {\
	stroke-width: 0;\
}\
";
    body.appendChild(style);

    return focusSnail;

})();


/***/ }),

/***/ "./source/js/module/EasyOrientation.js":
/*!*********************************************!*\
  !*** ./source/js/module/EasyOrientation.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EasyOrientation": () => (/* binding */ EasyOrientation)
/* harmony export */ });
/* harmony import */ var _action_ActionMuteSounds__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../action/ActionMuteSounds */ "./source/js/action/ActionMuteSounds.js");
/* harmony import */ var _action_ActionHideImages__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../action/ActionHideImages */ "./source/js/action/ActionHideImages.js");
/* harmony import */ var _action_ActionVirtualKeyboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../action/ActionVirtualKeyboard */ "./source/js/action/ActionVirtualKeyboard.js");
/* harmony import */ var _action_ActionReadingGuide__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../action/ActionReadingGuide */ "./source/js/action/ActionReadingGuide.js");
/* harmony import */ var _action_ActionStopAnimations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../action/ActionStopAnimations */ "./source/js/action/ActionStopAnimations.js");
/* harmony import */ var _action_ActionReadingMask__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../action/ActionReadingMask */ "./source/js/action/ActionReadingMask.js");
/* harmony import */ var _action_ActionHighlightHover__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../action/ActionHighlightHover */ "./source/js/action/ActionHighlightHover.js");
/* harmony import */ var _action_ActionHighlightFocus__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../action/ActionHighlightFocus */ "./source/js/action/ActionHighlightFocus.js");
/* harmony import */ var _action_ActionBigBlackCursor__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../action/ActionBigBlackCursor */ "./source/js/action/ActionBigBlackCursor.js");
/* harmony import */ var _action_ActionBigWhiteCursor__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../action/ActionBigWhiteCursor */ "./source/js/action/ActionBigWhiteCursor.js");
/* harmony import */ var _action_ActionKeyboardNavigation__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../action/ActionKeyboardNavigation */ "./source/js/action/ActionKeyboardNavigation.js");
/* harmony import */ var _action_ActionUsefulLinks__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../action/ActionUsefulLinks */ "./source/js/action/ActionUsefulLinks.js");
/* harmony import */ var _action_ActionTextToSpeech__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../action/ActionTextToSpeech */ "./source/js/action/ActionTextToSpeech.js");














class EasyOrientation {

    static init( options ) {

        if ( options.easyOrientation ) {

            /** Initialise Mute Sounds action. */
            if (options.muteSounds) {

                _action_ActionMuteSounds__WEBPACK_IMPORTED_MODULE_0__.ActionMuteSounds.init();

            }

            /** Initialise Hide Images action. */
            if (options.hideImages) {

                _action_ActionHideImages__WEBPACK_IMPORTED_MODULE_1__.ActionHideImages.init();

            }

            /** Initialise Virtual Keyboard action. */
            if (
                options.virtualKeyboard ||
                options.profileBlindUsers
            ) {

                _action_ActionVirtualKeyboard__WEBPACK_IMPORTED_MODULE_2__.ActionVirtualKeyboard.init();

            }

            /** Initialise Reading Guide action. */
            if (options.readingGuide) {

                _action_ActionReadingGuide__WEBPACK_IMPORTED_MODULE_3__.ActionReadingGuide.init();

            }

            /** Initialise Stop Animations action. */
            if (
                options.stopAnimations ||
                options.profileEpilepsy ||
                options.profileCognitiveDisability ||
                options.profileAdhdFriendly
            ) {

                _action_ActionStopAnimations__WEBPACK_IMPORTED_MODULE_4__.ActionStopAnimations.init();

            }

            /** Initialise Reading Mask action. */
            if (
                options.readingMask ||
                options.profileAdhdFriendly
            ) {

                _action_ActionReadingMask__WEBPACK_IMPORTED_MODULE_5__.ActionReadingMask.init();

            }

            /** Initialise Highlight Hover action. */
            if (options.highlightHover) {

                _action_ActionHighlightHover__WEBPACK_IMPORTED_MODULE_6__.ActionHighlightHover.init();

            }

            /** Initialise Highlight Focus action. */
            if (options.highlightFocus) {

                _action_ActionHighlightFocus__WEBPACK_IMPORTED_MODULE_7__.ActionHighlightFocus.init();

            }

            /** Initialise Big Black Cursor action. */
            if (options.bigBlackCursor) {

                _action_ActionBigBlackCursor__WEBPACK_IMPORTED_MODULE_8__.ActionBigBlackCursor.init();

            }

            /** Initialise Big White Cursor action. */
            if (options.bigWhiteCursor) {

                _action_ActionBigWhiteCursor__WEBPACK_IMPORTED_MODULE_9__.ActionBigWhiteCursor.init();

            }

            /** Initialise Keyboard Navigation action. */
            if (
                options.keyboardNavigation ||
                options.profileBlindUsers
            ) {

                _action_ActionKeyboardNavigation__WEBPACK_IMPORTED_MODULE_10__.ActionKeyboardNavigation.init();

            }

            /** Initialise Useful Links action. */
            if (options.usefulLinks) {

                _action_ActionUsefulLinks__WEBPACK_IMPORTED_MODULE_11__.ActionUsefulLinks.init();

            }

            /** Init Text to Speech */
            if ( options.textToSpeech && window.speechSynthesis.getVoices().length > 0 ) {

                _action_ActionTextToSpeech__WEBPACK_IMPORTED_MODULE_12__.ActionTextToSpeech.init();

            }

        }

    }

}


/***/ }),

/***/ "./source/js/module/HotKeyHelper.js":
/*!******************************************!*\
  !*** ./source/js/module/HotKeyHelper.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HotKeyHelper": () => (/* binding */ HotKeyHelper)
/* harmony export */ });
/* harmony import */ var _PopupHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PopupHelper */ "./source/js/module/PopupHelper.js");
/* harmony import */ var _action_ActionKeyboardNavigation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../action/ActionKeyboardNavigation */ "./source/js/action/ActionKeyboardNavigation.js");
/* harmony import */ var hotkeys_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! hotkeys-js */ "./node_modules/hotkeys-js/dist/hotkeys.esm.js");




class HotKeyHelper {

    /** Initialise hotkeys. */
    static init() {

        /** Open popup by hotkey. */
        HotKeyHelper.OpenInterface();

        /** Navigate to next/prev Menu. */
        HotKeyHelper.focusElements( readablerOptions.hotKeyMenu, 'nav, [role="navigation"]' );

        /** Navigate to next/prev Heading. */
        HotKeyHelper.focusElements( readablerOptions.hotKeyHeadings, 'h1, h2, h3, h4, h5, h6, [role="heading"]' );

        /** Navigate to next/prev Form. */
        HotKeyHelper.focusElements( readablerOptions.hotKeyForms, 'form:not([disabled])' );

        /** Navigate to next/prev Button. */
        HotKeyHelper.focusElements( readablerOptions.hotKeyButtons, 'button:not([disabled]), [role="button"]:not([disabled])' );

        /** Navigate to next/prev Graphic. */
        HotKeyHelper.focusElements( readablerOptions.hotKeyGraphics, 'img, picture, svg' );

        /** Enable/Disable controls by space-bar. */
        document.body.onkeydown = function ( e ) {

            let key = e.keyCode || e.charCode || e.which;

            /** Space-bar pressed. */
            if ( key === 32 ) {
                HotKeyHelper.spacePressed( e );
            }

        }

    }

    /**
     * Run when Space-bar pressed.
     **/
    static spacePressed( e ) {

        let activeElement = document.activeElement;

        if ( activeElement.classList.contains( 'mdp-readabler-accessibility-profile-item' ) ) {

            /** Profile switchers. */
            e.preventDefault();
            activeElement.click();

        } else if ( activeElement.classList.contains( 'mdp-readabler-toggle-box' ) ) {

            /** Toggle boxes. */
            e.preventDefault();
            activeElement.click();

        } else if ( activeElement.classList.contains( 'mdp-readabler-color' ) ) {

            /** Palette boxes. */
            e.preventDefault();
            activeElement.click();

        }

    }

    /**
     * Open popup by hotkey.
     **/
    static OpenInterface() {

        (0,hotkeys_js__WEBPACK_IMPORTED_MODULE_2__["default"])( readablerOptions.hotKeyOpenInterface, function ( event ) {

            /** Prevent the default behavior. */
            event.preventDefault();

            /** Open/Close popup. */
            _PopupHelper__WEBPACK_IMPORTED_MODULE_0__.PopupHelper.togglePopup();

        } );

    }

    /**
     * Set focus on next/prev elements.
     **/
    static focusElements( shortcutKey, selector ) {

        /** Navigate to next/prev element. */
        (0,hotkeys_js__WEBPACK_IMPORTED_MODULE_2__["default"])( shortcutKey + ',' + 'shift+' + shortcutKey, function ( event, handler ) {

            /** Check if Keyboard Navigation is enabled. */
            if ( ! document.body.classList.contains( 'mdp-readabler-keyboard-navigation' ) ) { return; }

            /** Prevent the default behavior. */
            event.preventDefault();

            /** Focus previously element if shift is pressed. */
            let next = true;
            if ( handler.key.startsWith( 'shift+' ) ) { next = false; }

            /** Set focus to next heading element. */
            _action_ActionKeyboardNavigation__WEBPACK_IMPORTED_MODULE_1__.ActionKeyboardNavigation.setFocus( selector, next );

        } );

    }

}


/***/ }),

/***/ "./source/js/module/InputSpinner.js":
/*!******************************************!*\
  !*** ./source/js/module/InputSpinner.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InputSpinner": () => (/* binding */ InputSpinner)
/* harmony export */ });
/* harmony import */ var _import_tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../import/tools */ "./source/js/import/tools.js");
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");



class InputSpinner {

    /**
     * Initialise Input Spinner.
     **/
    static init() {

        /** Plus Button click. */
        let plusBtn = document.querySelectorAll( '.mdp-readabler-input-spinner-box .mdp-readabler-plus' );
        plusBtn.forEach( plusButton => plusButton.addEventListener( 'click', ( e ) => InputSpinner.step( e ) ) );

        /** Minus Button click. */
        let minusBtn = document.querySelectorAll( '.mdp-readabler-input-spinner-box .mdp-readabler-minus' );
        minusBtn.forEach( minusButton => minusButton.addEventListener( 'click', ( e ) => InputSpinner.step( e ) ) );

        let interval;

        /** Continuous mouse click event. */
        /** Plus button. */
        plusBtn.forEach( plusButton => plusButton.addEventListener( 'mousedown', ( e ) => {
            interval = setInterval( function () {
                InputSpinner.step( e );
            }, 500 );
        } ) );

        plusBtn.forEach( plusButton => plusButton.addEventListener( 'mouseup', () => {
            clearInterval( interval );
        } ) );

        plusBtn.forEach( plusButton => plusButton.addEventListener( 'mouseleave', () => {
            clearInterval( interval );
        } ) );

        /** Minus button. */
        minusBtn.forEach( minusButton => minusButton.addEventListener( 'mousedown', ( e ) => {
            interval = setInterval( function () {
                InputSpinner.step( e );
            }, 500 );
        } ) );

        minusBtn.forEach( minusButton => minusButton.addEventListener( 'mouseup', () => {
            clearInterval( interval );
        } ) );

        minusBtn.forEach( minusButton => minusButton.addEventListener( 'mouseleave', () => {
            clearInterval( interval );
        } ) );

    }

    /**
     * Increase/Decrease value.
     **/
    static step( e ) {

        let valueElement = e.target.closest( '.mdp-readabler-control' ).querySelector( '.mdp-readabler-value' );
        let value = parseInt( valueElement.dataset.value );

        let step = parseInt( e.target.closest( '.mdp-readabler-input-spinner-box' ).dataset.step );

        /** Increase/Decrease value by step. */
        if ( e.target.classList.contains( 'mdp-readabler-minus' ) ) {
            value = value - step;
        } else {
            value = value + step;
        }

        /** Save new value. */
        valueElement.dataset.value = value.toString();

        /** Set label by value. */
        InputSpinner.setLabel( valueElement, value );

        /** Save value to localStorage. */
        (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.setLocal)( e.target.closest( '.mdp-readabler-action-box').id, valueElement.dataset.value )

        /** Create the event. */
        const event = new CustomEvent( 'ReadablerInputSpinnerChanged', {} );

        /** Fire custom event ReadablerInputSpinnerChanged. */
        valueElement.dispatchEvent( event );

    }

    /**
     * Set label by value.
     **/
    static setLabel( element, value ) {

        /** Now we for sure work with int. */
        value = parseInt( value );

        if ( 0 === value ) {
            element.innerHTML = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'default' );
        } else {
            let sign = value > 0 ? '+' : '';
            element.innerHTML = sign + value + '%';
        }

    }

    /**
     * Set value to some spinner box from localstorage.
     **/
    static loadSaved() {

        /** All spinner Boxes. */
        let spinnerBoxes = document.querySelectorAll( '.mdp-readabler-spinner-box' );

        spinnerBoxes.forEach( box => {

            let value = (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.getLocal)( box.id );

            if ( ! value ) { return; }

            value = parseInt( value );

            if ( 0 === value ) { return; }

            let valueElement = box.querySelector( '.mdp-readabler-value' );
            valueElement.dataset.value = value.toString();

            /** Set label by value. */
            InputSpinner.setLabel( valueElement, value );

            /** Fire change event. */
            const event = new CustomEvent( 'ReadablerInputSpinnerChanged', {} );

            /** Fire custom event ReadablerInputSpinnerChanged. */
            valueElement.dispatchEvent( event );


        } );

    }

}


/***/ }),

/***/ "./source/js/module/OnlineDictionary.js":
/*!**********************************************!*\
  !*** ./source/js/module/OnlineDictionary.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OnlineDictionary": () => (/* binding */ OnlineDictionary)
/* harmony export */ });
/* harmony import */ var _import_tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../import/tools */ "./source/js/import/tools.js");
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");



class OnlineDictionary {

    /** Initialise Online Dictionary. */
    static init( options ) {

        if ( options.onlineDictionary ) {

            /** Add change listener to search input. */
            const $searchInput = document.getElementById('mdp-readabler-online-dictionary-search');
            $searchInput.addEventListener('input', (e) => {
                (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.delay)(OnlineDictionary.searchQuery(e), 800)
            });

            /** Clear search results button click. */
            const $clearResultsBtn = document.querySelector('#mdp-readabler-online-dictionary-search-close');
            $clearResultsBtn.addEventListener('click', OnlineDictionary.clearSearchResults);

        }

    }

    /** Get language code from page html */
    static getLang() {

        if ( 'auto' === readablerOptions.language ) {

            const html = document.querySelector( 'html' );

            // Return English in no lang code for the page
            if ( ! html.getAttribute( 'lang' ) ) { return 'en' }

            // Return lang code from <html>
            return html.getAttribute( 'lang' ).split( '-', 1 )[ 0 ];

        } else {

            // Returns language from the page settings
            return readablerOptions.language;

        }

    }

    /**
     * Process search request to Wiki.
     **/
    static searchQuery( e ) {

        const $searchResultsUL = document.getElementById( 'mdp-readabler-online-dictionary-search-results' );
        const $clearResultsBtn = document.querySelector( '#mdp-readabler-online-dictionary-search-close' );

        /** Search query. */
        let search = e.target.value;

        /** Exit if delete search string value */
        if ( search.trim().length === 0 ) {
            return;
        }

        /** Process only 3+ letter phrases long. */
        if ( search.trim().length < 3 ) {

            /** Clear old results. */
            $searchResultsUL.innerHTML = '';

            return;

        }

        /** Encode search query. */
        let encodedSearchQuery = encodeURI( search );
        let apiUrl = `https://${ OnlineDictionary.getLang() }.wikipedia.org/w/api.php?action=query&format=json&utf8=&explaintext=&exlimit=3&generator=prefixsearch&prop=pageprops|extracts|extracts|description&redirects=&gpssearch=${ encodedSearchQuery }&gpslimit=3&origin=*`;

        /** Make search request to wikipedia.org. */
        fetch( apiUrl )
            .then( response => response.json() )
            .then( data => {

                /** Clear old results. */
                $searchResultsUL.innerHTML = '';

                /** Parse each founded page. */
                for ( let key in data.query.pages ) {

                    /** Skip loop if the property is from prototype. */
                    if ( ! data.query.pages.hasOwnProperty( key ) ) { continue; }

                    OnlineDictionary.addResultToList( data.query.pages[key] );

                }

                /** Show clear results button. */
                $clearResultsBtn.style.display = 'block';

            } )
            .catch( ( error ) => {} );

    }

    /**
     * Add search result to list.
     **/
    static addResultToList( page ) {

        const $searchResultsUL = document.getElementById( 'mdp-readabler-online-dictionary-search-results' );
        const wikiText = typeof page.description !== "undefined" ? page.description : '';

        /** Create li item. */
        let li = document.createElement( 'li' );
        li.innerHTML = `
                    <h5 class="mdp-readabler-online-dictionary-title">${page.title}</h5>
                    <p class="mdp-readabler-online-dictionary-text">${wikiText}</p>
                    <a target="_blank" rel="nofollow" class="mdp-readabler-online-dictionary-link" href="https://${ this.getLang() }.wikipedia.org/wiki/${ page.title }">${ i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'lear-more-wikipedia' ) }</a>
                    `;

        /** Add result to UL. */
        $searchResultsUL.appendChild( li );

    }

    /**
     * Clear Search results.
     **/
    static clearSearchResults() {

        /** Clear search results button. */
        const $clearResultsBtn = document.querySelector( '#mdp-readabler-online-dictionary-search-close' );

        /** Search input. */
        const $searchInput = document.getElementById( 'mdp-readabler-online-dictionary-search' );

        /** Search results UL. */
        const $searchResultsUL = document.getElementById( 'mdp-readabler-online-dictionary-search-results' );

        /** Clear Input */
        $searchInput.setAttribute( 'value','' );

        /** Clear results. */
        $searchResultsUL.innerHTML = '';

        /** Hide clear results button. */
        $clearResultsBtn.style.display = 'none';

    }

}


/***/ }),

/***/ "./source/js/module/PaletteBox.js":
/*!****************************************!*\
  !*** ./source/js/module/PaletteBox.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PaletteBox": () => (/* binding */ PaletteBox)
/* harmony export */ });
/* harmony import */ var _import_tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../import/tools */ "./source/js/import/tools.js");


class PaletteBox {

    /**
     * Initialise Palette.
     **/
    static init() {

        let palettes = document.querySelectorAll( '.mdp-readabler-palette-box' );

        /** Color click. */
        palettes.forEach( palette => palette.addEventListener( 'click', ( e ) => PaletteBox.selectColor( e ) ) );

        /** Color keydown. */
        palettes.forEach( palette => palette.addEventListener( 'keydown', ( e ) => PaletteBox.selectColor( e ) ) );

    }

    /**
     * Select color by click.
     **/
    static selectColor( e ) {

        if ( e.type === 'keydown' && e.keyCode !== 13 ) { return }

        /** Process only color click. */
        if ( ! e.target.classList.contains( 'mdp-readabler-color' )  ) { return; }

        let currentPalette = e.target.closest( '.mdp-readabler-palette-box' );

        /** If clicked same color disable all colors. */
        if ( e.target.classList.contains( 'mdp-active' ) ) {

            /** Deactivate current color. */
            e.target.classList.remove( 'mdp-active' );

            /** Fire ReadablerPaletteChanged event. */
            PaletteBox.firePaletteChange( currentPalette, null );

            /** Save value to localStorage. */
            (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.setLocal)( e.target.closest( '.mdp-readabler-palette-box' ).id, null );

            /** Disable prev color and enable current. */
        } else {

            /** Deactivate another previous color. */
            let prevColor = currentPalette.querySelector( '.mdp-readabler-color.mdp-active' );
            if ( null !== prevColor ) {
                prevColor.classList.remove( 'mdp-active' );
            }

            /** Activate current color. */
            e.target.classList.add( 'mdp-active' );

            /** Fire ReadablerPaletteChanged event. */
            PaletteBox.firePaletteChange( currentPalette, e.target.dataset.color );

            /** Save value to localStorage. */
            (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.setLocal)( e.target.closest( '.mdp-readabler-palette-box' ).id, e.target.dataset.color );

        }

    }

    /**
     * Enable some colors from localstorage.
     **/
    static loadSaved() {

        /** All palette Boxes. */
        let paletteBoxes = document.querySelectorAll( '.mdp-readabler-palette-box' );

        paletteBoxes.forEach( box => {

            let colorValue = (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.getLocal)( box.id );
            if ( null === colorValue ) { return; }

            let colors = box.querySelectorAll( '.mdp-readabler-color' );

            colors.forEach( color => {

                if ( color.dataset.color === colorValue ) {
                    color.click();
                }

            } );

        } );

    }

    /**
     * Create and trigger custom event ReadablerPaletteChanged.
     **/
    static firePaletteChange( element, color ) {

        /** Create the event. */
        const event = new CustomEvent( 'ReadablerPaletteChanged', { detail: { color: color } } );

        /** Fire custom event ReadablerPaletteChanged. */
        element.dispatchEvent( event );

    }

}


/***/ }),

/***/ "./source/js/module/PopupHelper.js":
/*!*****************************************!*\
  !*** ./source/js/module/PopupHelper.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PopupHelper": () => (/* binding */ PopupHelper)
/* harmony export */ });
/* harmony import */ var micromodal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromodal */ "./node_modules/micromodal/dist/micromodal.es.js");
/* harmony import */ var _import_tools_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../import/tools.js */ "./source/js/import/tools.js");



/** Popup modal window. */
const popup = document.getElementById( 'mdp-readabler-popup' );

/** Popup position */
let pos1 = 0;
let pos2 = 0;
let pos3 = 0;
let pos4 = 0;

// noinspection DuplicatedCode
/**
 * @param Readabler.delay
 */
class PopupHelper {

    /** Initialise Popup modal. */
    static init() {

        /** Draggable popup */
        if ( readablerOptions.template === 'popup' && readablerOptions.popupDraggable ) {

            /** Make popup draggable. */
            PopupHelper.draggablePopup();

            /** Set popup position if we have it in localstorage. */
            PopupHelper.setPopupPosition();

        }

        /** Close popup by cross. */
        if ( readablerOptions.closeButton ) {

            document.getElementById( 'mdp-readabler-popup-close' ).addEventListener( 'click',  PopupHelper.closePopupCross );

        }

        /** Start to listen click event to find "data-readabler-trigger" click. */
        if ( readablerOptions.template === 'popup' ) {

            document.addEventListener( 'click', PopupHelper.togglePopup );

            /** Fix popup position on resize. */
            window.addEventListener('resize', ( e ) => { (0,_import_tools_js__WEBPACK_IMPORTED_MODULE_1__.delay)( PopupHelper.setPopupPosition( e ), 300 ) } );

        }

    }

    /**
     * Set popup position, if we have it in localstorage.
     **/
    static setPopupPosition( e = undefined ) {

        let top = (0,_import_tools_js__WEBPACK_IMPORTED_MODULE_1__.getLocal)( 'popupTop' );
        let left = (0,_import_tools_js__WEBPACK_IMPORTED_MODULE_1__.getLocal)( 'popupLeft' );

        if ( null === top || null === left ) { return; }

        /** Apply popup position. */
        PopupHelper.applyPopupPosition( top, left, e );

    }

    /**
     * Apply popup position.
     **/
    static applyPopupPosition( top, left, e = undefined ) {

        const popup = document.getElementById( 'mdp-readabler-popup' );

        top = PopupHelper.topInBound( top );
        left = PopupHelper.leftInBound( left );

        /** Set popup new position. */
        popup.style.top = top + 'px';
        popup.style.left = left + 'px';

        /** If we have event then we here from resize event and need small animation. */
        if ( 'undefined' !== typeof e ) {
            popup.style.transition = 'top 0.3s ease, left 0.3s ease';
        } else {
            popup.style.transition = 'none';
        }

        (0,_import_tools_js__WEBPACK_IMPORTED_MODULE_1__.setLocal)( 'popupTop', top );
        (0,_import_tools_js__WEBPACK_IMPORTED_MODULE_1__.setLocal)( 'popupLeft', left );

        popup.removeAttribute( 'data-start' );

    }

    /**
     * Fix top position if it's out of view.
     **/
    static topInBound( top ) {

        const popup = document.getElementById( 'mdp-readabler-popup' );
        let vh = Math.max( document.documentElement.clientHeight || 0, window.innerHeight || 0 )

        /** Don't allow popup out of bounds. */
        if ( top < 0 ) { top = 0; }
        if ( top > ( vh - popup.offsetHeight ) ) { top = vh - popup.offsetHeight; }

        return top;

    }

    /**
     * Fix left position if it's out of view.
     **/
    static leftInBound( left ) {

        const popup = document.getElementById( 'mdp-readabler-popup' );
        let vw = Math.max( document.documentElement.clientWidth || 0, window.innerWidth || 0 );

        /** Don't allow popup out of bounds. */
        if ( left < 0 ) { left = 0; }
        if ( left > ( vw - popup.offsetWidth ) ) { left = vw - popup.offsetWidth; }

        return left;

    }

    /**
     * Close popup by cross.
     **/
    static closePopupCross( e ) {

        e.preventDefault();

        if ( readablerOptions.template === 'popup' ) {

            /** Close Popup */
            micromodal__WEBPACK_IMPORTED_MODULE_0__["default"].close( 'mdp-readabler-popup-box' );

        } else {

            /** Close Side block */
            PopupHelper.toggleOffCanvas();

        }

        /** Release all trigger buttons. */
        PopupHelper.releaseTriggerButtons();

    }

    /**
     * Toggle off-canvas
     */
    static toggleOffCanvas() {

        const bodyClasses = document.body.classList;
        let bodyClassTarget = `mdp-readabler-${ readablerOptions.template }-is-open`;

        if ( readablerOptions.template === 'off-canvas' ) {

            bodyClassTarget += `-${ readablerOptions.sidebarAlign }`;

        }

        if ( bodyClasses.contains( bodyClassTarget ) ) {

            bodyClasses.remove( bodyClassTarget );

            // Overlay
            if ( readablerOptions.popupOverlay ) {

                document.querySelector('#mdp-readabler-overlay').remove();

            }

        } else {

            bodyClasses.add( bodyClassTarget );

            // Overlay
            if ( readablerOptions.popupOverlay ) {

                const $overlay = document.createElement( 'div' );
                $overlay.id = 'mdp-readabler-overlay';

                if ( readablerOptions.closeAnywhere ) {
                    $overlay.removeEventListener( 'click', PopupHelper.toggleOffCanvas );
                    $overlay.addEventListener( 'click', PopupHelper.toggleOffCanvas );
                }

                document.body.appendChild( $overlay );

            }

        }

    }

    /**
     * Show/Hide Accessibility Popup.
     **/
    static togglePopup( e ) {

        if ( 'undefined' !== typeof e ) {

            let element = e.target;
            let button = null;

            /** If no element, nothing to do. */
            if ( ! element ) { return; }

            /** Click on button child elements. */
            button = ( null !== element.closest( '[data-readabler-trigger]' ) ) ?
                element.closest( '[data-readabler-trigger]' ) :
                element.closest( '.readabler-trigger' );

            /** Exit if no one trigger on the page */
            if ( null === button ) { return }

            /** Prevent a link from opening the URL. */
            e.preventDefault();

        }

        /** Accessibility Popup. */
        let popup = document.getElementById( 'mdp-readabler-popup-box' );

        /** Toggle popup state. */
        if ( ! popup.classList.contains( 'mdp-is-open' ) ) {

            /** Show Popup. */
            micromodal__WEBPACK_IMPORTED_MODULE_0__["default"].show( 'mdp-readabler-popup-box', {
                onClose: () => { PopupHelper.onClosePopup(); },
                openClass: 'mdp-is-open',
                disableScroll: ! readablerOptions.popupScroll,
                disableFocus: false,
            } );

            /** Hold all trigger buttons. */
            PopupHelper.holdTriggerButtons();

            /** Set popup position if we have it in localstorage. */
            PopupHelper.setPopupPosition();

        } else {

            /** Hide Popup. */
            micromodal__WEBPACK_IMPORTED_MODULE_0__["default"].close( 'mdp-readabler-popup-box' );

            /** Release all trigger buttons. */
            PopupHelper.releaseTriggerButtons();

        }

    }

    /**
     * Add class .mdp-opened to all trigger buttons.
     **/
    static holdTriggerButtons() {

        document.querySelectorAll( '[data-readabler-trigger]' ).forEach( el  => {
            el.classList.add( 'mdp-opened' );
        } );

    }

    /**
     * Remove class .mdp-opened from all trigger buttons.
     **/
    static releaseTriggerButtons() {

        document.querySelectorAll( '[data-readabler-trigger]' ).forEach( el  => {
            el.classList.remove( 'mdp-opened' );
        } );

        /** Close Accessibility Statement. */
        let statementBox = document.getElementById( 'mdp-readabler-accessibility-statement-box' );

        if ( statementBox !== null && statementBox.classList.contains( 'mdp-open' ) ) {
            statementBox.classList.remove( 'mdp-open' );
        }

    }

    /**
     * Release Trigger Buttons on modal close.
     **/
    static onClosePopup() {

        PopupHelper.releaseTriggerButtons();

    }

    /**
     * Calculate dragging position.
     **/
    static startDragging( e ) {

        const popup = document.getElementById( 'mdp-readabler-popup' );

        // noinspection JSDeprecatedSymbols
        e = e || window.event;

        e.preventDefault();

        /** Calculate the new cursor position. */
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        /** Calculate popup new position. */
        let top = popup.offsetTop - pos2;
        let left = popup.offsetLeft - pos1;

        /** Apply popup position. */
        PopupHelper.applyPopupPosition( top, left );

        /** Save popup position in local storage. */
        (0,_import_tools_js__WEBPACK_IMPORTED_MODULE_1__.setLocal)( 'popupTop', top.toString() );
        (0,_import_tools_js__WEBPACK_IMPORTED_MODULE_1__.setLocal)( 'popupLeft', left.toString() );

    }

    /**
     * Stop moving when mouse button is released.
     **/
    static stopDragging() {

        document.removeEventListener('mousemove', PopupHelper.startDragging );
        document.removeEventListener('mouseup', PopupHelper.stopDragging );

    }

    /**
     * Detect if the left and only the left mouse button is pressed.
     *
     * @param event
     *
     * @return {boolean}
     **/
    static detectLeftButton( event ) {

        if ( 'buttons' in event ) { return event.buttons === 1; }

        let button = event.which || event.button;

        return button === 1;

    }

    /**
     * Make popup draggable.
     **/
    static draggablePopup() {

        let dragZoneElement = document.getElementById( 'mdp-readabler-popup-header' );

        dragZoneElement.addEventListener( 'mousedown', ( e ) => {

            // noinspection JSDeprecatedSymbols
            e = e || window.event;

            /** Drag popup only on left mouse. */
            if ( ! PopupHelper.detectLeftButton( e ) ) { return; }

            e.preventDefault();

            /** Get the mouse cursor position at startup. */
            pos3 = e.clientX;
            pos4 = e.clientY;

            /** Call a function whenever the cursor moves. */
            document.addEventListener( 'mousemove', PopupHelper.startDragging );

            /** Stop dragging on mouseup. */
            document.addEventListener( 'mouseup', PopupHelper.stopDragging );

        } );

    }

}


/***/ }),

/***/ "./source/js/module/ReadableExperience.js":
/*!************************************************!*\
  !*** ./source/js/module/ReadableExperience.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ReadableExperience": () => (/* binding */ ReadableExperience)
/* harmony export */ });
/* harmony import */ var _action_ActionContentScaling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../action/ActionContentScaling */ "./source/js/action/ActionContentScaling.js");
/* harmony import */ var _action_ActionTextMagnifier__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../action/ActionTextMagnifier */ "./source/js/action/ActionTextMagnifier.js");
/* harmony import */ var _action_ActionReadableFont__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../action/ActionReadableFont */ "./source/js/action/ActionReadableFont.js");
/* harmony import */ var _action_ActionDyslexiaFriendly__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../action/ActionDyslexiaFriendly */ "./source/js/action/ActionDyslexiaFriendly.js");
/* harmony import */ var _action_ActionHighlightTitles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../action/ActionHighlightTitles */ "./source/js/action/ActionHighlightTitles.js");
/* harmony import */ var _action_ActionHighlightLinks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../action/ActionHighlightLinks */ "./source/js/action/ActionHighlightLinks.js");
/* harmony import */ var _action_ActionFontSizing__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../action/ActionFontSizing */ "./source/js/action/ActionFontSizing.js");
/* harmony import */ var _action_ActionLineHeight__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../action/ActionLineHeight */ "./source/js/action/ActionLineHeight.js");
/* harmony import */ var _action_ActionLetterSpacing__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../action/ActionLetterSpacing */ "./source/js/action/ActionLetterSpacing.js");
/* harmony import */ var _action_ActionAlignLeft__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../action/ActionAlignLeft */ "./source/js/action/ActionAlignLeft.js");
/* harmony import */ var _action_ActionAlignCenter__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../action/ActionAlignCenter */ "./source/js/action/ActionAlignCenter.js");
/* harmony import */ var _action_ActionAlignRight__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../action/ActionAlignRight */ "./source/js/action/ActionAlignRight.js");













class ReadableExperience {

    static init( options ) {

        if ( options.readableExperience ) {

            /** Initialise Content Scaling action. */
            if (options.contentScaling) {

                _action_ActionContentScaling__WEBPACK_IMPORTED_MODULE_0__.ActionContentScaling.init();

            }

            /** Initialise Text Magnifier action. */
            if (options.textMagnifier) {

                _action_ActionTextMagnifier__WEBPACK_IMPORTED_MODULE_1__.ActionTextMagnifier.init();

            }

            /** Initialise Readable Font action. */
            if (
                options.readableFont ||
                options.profileVisuallyImpaired ||
                options.profileBlindUsers
            ) {

                _action_ActionReadableFont__WEBPACK_IMPORTED_MODULE_2__.ActionReadableFont.init();

            }

            /** Initialise Dyslexia Friendly action. */
            if (options.dyslexiaFont) {

                _action_ActionDyslexiaFriendly__WEBPACK_IMPORTED_MODULE_3__.ActionDyslexiaFriendly.init();

            }

            /** Initialise Highlight Titles action. */
            if (
                options.highlightTitles ||
                options.profileCognitiveDisability
            ) {

                _action_ActionHighlightTitles__WEBPACK_IMPORTED_MODULE_4__.ActionHighlightTitles.init();

            }

            /** Initialise Highlight Links action. */
            if (
                options.highlightLinks ||
                options.profileCognitiveDisability
            ) {

                _action_ActionHighlightLinks__WEBPACK_IMPORTED_MODULE_5__.ActionHighlightLinks.init();

            }

            /** Initialise Font Sizing action. */
            if (options.fontSizing) {

                _action_ActionFontSizing__WEBPACK_IMPORTED_MODULE_6__.ActionFontSizing.init();

            }

            /** Initialise Line Height action. */
            if (options.lineHeight) {

                _action_ActionLineHeight__WEBPACK_IMPORTED_MODULE_7__.ActionLineHeight.init();

            }

            /** Initialise Letter Spacing action. */
            if (options.letterSpacing) {

                _action_ActionLetterSpacing__WEBPACK_IMPORTED_MODULE_8__.ActionLetterSpacing.init();

            }

            /** Initialise Text Align Left action. */
            if (options.alignLeft) {

                _action_ActionAlignLeft__WEBPACK_IMPORTED_MODULE_9__.ActionAlignLeft.init();

            }

            /** Initialise Text Align Center action. */
            if (options.alignCenter) {

                _action_ActionAlignCenter__WEBPACK_IMPORTED_MODULE_10__.ActionAlignCenter.init();

            }

            /** Initialise Text Align Right action. */
            if (options.alignRight) {

                _action_ActionAlignRight__WEBPACK_IMPORTED_MODULE_11__.ActionAlignRight.init();

            }

        }

    }

}


/***/ }),

/***/ "./source/js/module/ToggleBox.js":
/*!***************************************!*\
  !*** ./source/js/module/ToggleBox.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ToggleBox": () => (/* binding */ ToggleBox)
/* harmony export */ });
/* harmony import */ var _import_tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../import/tools */ "./source/js/import/tools.js");



class ToggleBox {

    /**
     * Initialise Toggle Box.
     **/
    static init() {

        /** Toggle Button click. */
        let toggleBoxes = document.querySelectorAll( '.mdp-readabler-toggle-box' );

        /** Listen click. */
        toggleBoxes.forEach( box => box.addEventListener( 'click', ( e ) => ToggleBox.toggle( e ) ) );

        /** Listen keydown. */
        toggleBoxes.forEach( box => box.addEventListener( 'keydown', ( e ) => ToggleBox.toggle( e ) ) );

    }

    /**
     * Toggle control state.
     **/
    static toggle( e ) {

        if ( e.type === 'keydown' && e.keyCode !== 13 ) { return; }

        /** All Toggle Boxes. */
        let toggleBox = e.target.closest( '.mdp-readabler-toggle-box' );

        /** Activate/Deactivate control. */
        toggleBox.classList.toggle( 'mdp-active' );

        /** Save value in localStorage. */
        (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.setLocal)( toggleBox.id, toggleBox.classList.contains( 'mdp-active' ) );

        /** Create the event. */
        const event = new CustomEvent( 'ReadablerToggleBoxChanged', {} );

        /** Fire custom event ReadablerToggleBoxChanged. */
        toggleBox.dispatchEvent( event );

    }

    /**
     * Enable some toggleBoxes from localstorage.
     **/
    static loadSaved() {

        /** All Toggle Boxes. */
        let toggleBoxes = document.querySelectorAll( '.mdp-readabler-toggle-box' );

        toggleBoxes.forEach( box => {

            if ( 'true' === (0,_import_tools__WEBPACK_IMPORTED_MODULE_0__.getLocal)( box.id ) ) {
                box.click();
            }

        } );

    }

}


/***/ }),

/***/ "./source/js/module/VisuallyPleasingExperience.js":
/*!********************************************************!*\
  !*** ./source/js/module/VisuallyPleasingExperience.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VisuallyPleasingExperience": () => (/* binding */ VisuallyPleasingExperience)
/* harmony export */ });
/* harmony import */ var _action_ActionDarkContrast__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../action/ActionDarkContrast */ "./source/js/action/ActionDarkContrast.js");
/* harmony import */ var _action_ActionLightContrast__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../action/ActionLightContrast */ "./source/js/action/ActionLightContrast.js");
/* harmony import */ var _action_ActionMonochrome__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../action/ActionMonochrome */ "./source/js/action/ActionMonochrome.js");
/* harmony import */ var _action_ActionHighContrast__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../action/ActionHighContrast */ "./source/js/action/ActionHighContrast.js");
/* harmony import */ var _action_ActionHighSaturation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../action/ActionHighSaturation */ "./source/js/action/ActionHighSaturation.js");
/* harmony import */ var _action_ActionLowSaturation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../action/ActionLowSaturation */ "./source/js/action/ActionLowSaturation.js");
/* harmony import */ var _action_ActionTextColors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../action/ActionTextColors */ "./source/js/action/ActionTextColors.js");
/* harmony import */ var _action_ActionTitleColors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../action/ActionTitleColors */ "./source/js/action/ActionTitleColors.js");
/* harmony import */ var _action_ActionBackgroundColors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../action/ActionBackgroundColors */ "./source/js/action/ActionBackgroundColors.js");










class VisuallyPleasingExperience {

    static init( options ) {

        if ( options.visuallyPleasingExperience ) {

            /** Initialise Dark Contrast action. */
            if (options.darkContrast) {

                _action_ActionDarkContrast__WEBPACK_IMPORTED_MODULE_0__.ActionDarkContrast.init();

            }

            /** Initialise Light Contrast action. */
            if (options.lightContrast) {

                _action_ActionLightContrast__WEBPACK_IMPORTED_MODULE_1__.ActionLightContrast.init();

            }

            /** Initialise Monochrome action. */
            if (options.monochrome) {

                _action_ActionMonochrome__WEBPACK_IMPORTED_MODULE_2__.ActionMonochrome.init();

            }

            /** Initialise High Contrast action. */
            if (options.highContrast) {

                _action_ActionHighContrast__WEBPACK_IMPORTED_MODULE_3__.ActionHighContrast.init();

            }

            /** Initialise High Saturation action. */
            if (
                options.highSaturation ||
                options.profileVisuallyImpaired ||
                options.profileAdhdFriendly
            ) {

                _action_ActionHighSaturation__WEBPACK_IMPORTED_MODULE_4__.ActionHighSaturation.init();

            }

            /** Initialise Low Saturation action. */
            if (
                options.lowSaturation ||
                options.profileEpilepsy
            ) {

                _action_ActionLowSaturation__WEBPACK_IMPORTED_MODULE_5__.ActionLowSaturation.init();

            }

            /** Initialise Text Colors action. */
            if (options.textColors) {

                _action_ActionTextColors__WEBPACK_IMPORTED_MODULE_6__.ActionTextColors.init();

            }

            /** Initialise Title Colors action. */
            if (options.titleColors) {

                _action_ActionTitleColors__WEBPACK_IMPORTED_MODULE_7__.ActionTitleColors.init();

            }

            /** Initialise Background Colors action. */
            if (options.backgroundColors) {

                _action_ActionBackgroundColors__WEBPACK_IMPORTED_MODULE_8__.ActionBackgroundColors.init();

            }

        }

    }

}


/***/ }),

/***/ "./source/js/ui/Button.js":
/*!********************************!*\
  !*** ./source/js/ui/Button.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Button": () => (/* binding */ Button)
/* harmony export */ });
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");
/* harmony import */ var _module_PopupHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../module/PopupHelper */ "./source/js/module/PopupHelper.js");



class Button {

    constructor( options ) {

        if ( options.showOpenButton === false ) { return; }
        this.renderButton( options );

    }

    $commentStart = document.createComment('Start Readabler Button');
    $commentEnd = document.createComment('End Readabler Button');

    /**
     * Render buttons
     * @param options
     */
    renderButton( options ) {

        const $buttonBox = this.$buttonBox( options );
        const $button = this.$button( options );

        if ( options.template === 'off-canvas' || options.template === 'aside' ) {

            $button.addEventListener( 'click', _module_PopupHelper__WEBPACK_IMPORTED_MODULE_1__.PopupHelper.toggleOffCanvas );

        }

        $buttonBox.appendChild( $button );

        document.body.appendChild( this.$commentStart );
        document.body.appendChild( $buttonBox );
        document.body.appendChild( this.$commentEnd );

    }

    /**
     * Button box
     * @param options
     * @returns {HTMLDivElement}
     */
    $buttonBox( options ) {

        const $buttonBox = document.createElement( 'div' );

        $buttonBox.classList.add( 'mdp-readabler-trigger-button-box' );
        $buttonBox.classList.add( options.buttonPosition );
        $buttonBox.classList.add( `mdp-entrance-${ options.buttonEntranceAnimation }` );
        $buttonBox.classList.add( `mdp-hover-${ options.buttonHoverAnimation }` );

        $buttonBox.setAttribute( 'data-nosnippet', '' );

        return $buttonBox;

    }

    /**
     * Button
     * @param options
     * @returns {HTMLButtonElement}
     */
    $button( options ) {

        const $button = document.createElement( 'button' );

        $button.id = 'mdp-readabler-trigger-button';
        $button.classList.add( `mdp-icon-position-${ options.buttonIconPosition }` );
        $button.setAttribute( 'aria-label', i18next__WEBPACK_IMPORTED_MODULE_0__["default"].t('open-accessibility-panel') );
        $button.setAttribute( 'data-readabler-trigger','' );

        // Add tabindex only if it was modified to improve site validation score
        if ( options.buttonTabulationIndex !== 0 ) {
            $button.tabIndex = options.buttonTabulationIndex;
        }

        // Button icon
        if ( options.buttonIcon !== '' ) {

            const $icon = document.createElement('span');

            $icon.classList.add('mdp-readabler-trigger-button-icon');

            // Set icon as HTML or path to icon
            const htmlTagRegEx = /(<)/g;
            $icon.innerHTML = options.buttonIcon.match( htmlTagRegEx ) ?
                options.buttonIcon : `<img src="${ options.buttonIcon }" alt="${ i18next__WEBPACK_IMPORTED_MODULE_0__["default"].t('open-accessibility-panel') }">`;

            $button.appendChild( $icon );

        }

        // Button caption
        if ( options.buttonCaption !== '' ) {

            const $caption = document.createElement( 'span' );

            $caption.classList.add( 'mdp-readabler-trigger-button-caption' );
            $caption.innerHTML = options.buttonCaption;

            $button.appendChild( $caption );

        }

        return $button;

    }

}


/***/ }),

/***/ "./source/js/ui/Control.js":
/*!*********************************!*\
  !*** ./source/js/ui/Control.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Control": () => (/* binding */ Control)
/* harmony export */ });
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");


class Control {

    static $inputSpinner( key, title, label, step = 5 ) {

        const $actionBox = document.createElement( 'div' );
        $actionBox.id = `mdp-readabler-action-${ key }`;
        $actionBox.className = 'mdp-readabler-action-box mdp-readabler-spinner-box';

        $actionBox.innerHTML = `
        <div class="mdp-readabler-action-box-content">
            <span class="mdp-readabler-title">${ title }</span>
        </div>`;

        $actionBox.innerHTML += `
        <div class="mdp-readabler-input-spinner-box" data-step="${ step }">
            <div class="mdp-readabler-control">
                <button class="mdp-readabler-plus"
                        role="button"
                        tabindex="0"
                        aria-label="${ i18next__WEBPACK_IMPORTED_MODULE_0__["default"].t( 'increase' ) } ${ label }" ></button>
                <div class="mdp-readabler-value" data-value="0">${ i18next__WEBPACK_IMPORTED_MODULE_0__["default"].t( 'default' ) }</div>
                <button class="mdp-readabler-minus"
                        role="button"
                        tabindex="0"
                        aria-label="${ i18next__WEBPACK_IMPORTED_MODULE_0__["default"].t( 'decrease' ) } ${ label }" ></button>
            </div>
        </div>`;

        return $actionBox;

    }

    static $toggle( key, hide = false ) {

        const $actionBox = document.createElement( 'div' );
        $actionBox.id = `mdp-readabler-action-${ key }`;
        $actionBox.className = 'mdp-readabler-action-box mdp-readabler-toggle-box';
        hide ? $actionBox.classList.add( 'mdp-hidden' ) : '';
        $actionBox.tabIndex = 0;

        $actionBox.innerHTML = `
        <div class="mdp-readabler-action-box-content">
            <span class="mdp-readabler-icon"></span>
            <span class="mdp-readabler-title">${ i18next__WEBPACK_IMPORTED_MODULE_0__["default"].t( key ) }</span>
        </div>
        `;

        return $actionBox;

    }

    static $palette( key ) {

        const colors = readablerOptions.palette;

        const $actionBox = document.createElement( 'div' );
        $actionBox.id = `mdp-readabler-action-${ key }`;
        $actionBox.className = 'mdp-readabler-action-box mdp-readabler-palette-box';

        const $actionBoxContainer = document.createElement( 'div' );
        $actionBoxContainer.className = 'mdp-readabler-action-box-content';

        const $actionBoxTitle = document.createElement( 'div' );
        $actionBoxTitle.className = 'mdp-readabler-title';
        $actionBoxTitle.innerHTML = i18next__WEBPACK_IMPORTED_MODULE_0__["default"].t( key );

        $actionBoxContainer.appendChild( $actionBoxTitle );

        const $colorBox = document.createElement( 'div' );
        $colorBox.className = 'mdp-readabler-color-box';

        colors.forEach( color => {

            const $color = document.createElement( 'span' );
            const colorClass = color.value === '#ffffff' ? ' mdp-white' : '';

            $color.className = `mdp-readabler-color${ colorClass }`
            $color.tabIndex = 0;
            $color.setAttribute( 'role', 'button' );
            $color.setAttribute( 'data-color', color.value );
            $color.setAttribute( 'aria-label', `${ i18next__WEBPACK_IMPORTED_MODULE_0__["default"].t( 'change-color' ) } ${ color.name }` );
            $color.setAttribute( 'style', `background: ${ color.value } !important` );

            $colorBox.appendChild( $color );

        } );

        $actionBoxContainer.appendChild( $colorBox );

        $actionBox.appendChild( $actionBoxContainer );

        return $actionBox;

    }

    static $usefulLinks( key ) {

        const $actionBox = document.createElement( 'div' );
        $actionBox.id = `mdp-readabler-action-${ key }`;
        $actionBox.className = 'mdp-readabler-action-box mdp-readabler-useful-links-box';

        $actionBox.innerHTML = `
        <div class="mdp-readabler-action-box-content">
            <label for="mdp-readabler-useful-links" class="mdp-readabler-title">${ i18next__WEBPACK_IMPORTED_MODULE_0__["default"].t( key ) }</label>
            <div class="mdp-readabler-select-box">
                <select id="mdp-readabler-useful-links" aria-label="Useful Links">
                    <option selected="" disabled="" value="mdp-default">${ i18next__WEBPACK_IMPORTED_MODULE_0__["default"].t( 'select' ) }</option>
                </select>
            </div>
        </div>
        `;

        return $actionBox;

    }

    static $switch( key, title, short, description ) {

        const $actionBox = document.createElement( 'div' );
        $actionBox.id = `mdp-readabler-accessibility-${ key }`;
        $actionBox.className = 'mdp-readabler-accessibility-profile-item';
        $actionBox.tabIndex = 0;

        $actionBox.innerHTML = `
        <div class="mdp-readabler-row">
            <div class="mdp-readabler-switch-box">
                <label class="mdp-switch">
                    ${ title }
                    <input type="checkbox" name="mdp-readabler-accessibility-${ key }" value="on" tabindex="-1">
                    <span class="mdp-slider"></span>
                </label>
            </div>
            <div class="mdp-readabler-title-box">
                <div class="mdp-readabler-profile-title">${ title }</div>
                <div class="mdp-readabler-profile-short">${ short }</div>
            </div>
        </div>
        <div class="mdp-readabler-profile-description">${ description }</div>`;

        return $actionBox;

    }

}


/***/ }),

/***/ "./source/js/ui/Popup.js":
/*!*******************************!*\
  !*** ./source/js/ui/Popup.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Popup": () => (/* binding */ Popup)
/* harmony export */ });
/* harmony import */ var _SectionOnlineDictionary__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SectionOnlineDictionary */ "./source/js/ui/SectionOnlineDictionary.js");
/* harmony import */ var _Typography__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Typography */ "./source/js/ui/Typography.js");
/* harmony import */ var _SectionReadableExperience__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SectionReadableExperience */ "./source/js/ui/SectionReadableExperience.js");
/* harmony import */ var _SectionVisuallyPleasingExperience__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SectionVisuallyPleasingExperience */ "./source/js/ui/SectionVisuallyPleasingExperience.js");
/* harmony import */ var _SectionEasyOrientation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SectionEasyOrientation */ "./source/js/ui/SectionEasyOrientation.js");
/* harmony import */ var _SectionAccessibilityProfiles__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SectionAccessibilityProfiles */ "./source/js/ui/SectionAccessibilityProfiles.js");
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");








class Popup {

    $commentStart = document.createComment('Start Readabler Accessibility Popup');
    $commentEnd = document.createComment('End Readabler Accessibility Popup');

    constructor( options ) {

        document.body.appendChild( this.$commentStart );

        options.template === 'off-canvas' || options.template === 'aside' ?
            this.renderOffCanvas( options ) :
            this.renderPopup( options );

        this.renderKeyboard( options );
        document.body.appendChild( this.$commentEnd );

    }

    /**
     * Render Accessibility Popup
     * @param options
     */
    renderPopup( options ) {

        const $popupBox = document.createElement( 'div' );
        $popupBox.id = 'mdp-readabler-popup-box';
        $popupBox.classList.add( `mdp-readabler-modal-animation-${ options.popupAnimation }` );
        $popupBox.classList.add( 'mdp-readabler-modal-fixed' );
        if ( options.popupShadow ) {
            $popupBox.classList.add( 'mdp-readabler-modal-shadow' );
        }
        $popupBox.setAttribute( 'aria-hidden', 'true' );
        $popupBox.setAttribute( 'data-nosnippet', '' );

        const $popup = document.createElement( 'div' );
        $popup.id = 'mdp-readabler-popup';
        $popup.setAttribute( 'role','dialog' );
        $popup.setAttribute( 'aria-modal','true' );
        $popup.setAttribute( 'data-start','top' );
        $popup.setAttribute( 'aria-labelledby', 'mdp-readabler-popup-box' );

        $popup.appendChild( this.$header( options ) );
        $popup.appendChild( this.$section( options ) );
        $popup.appendChild( this.$footer( options ) );

        // Inline statement box
        if ( options.accessibilityStatement && [ 'iframe', 'html' ].includes( options.accessibilityStatementType ) ) {

            $popup.appendChild( this.$statement( options ) );

        }

        $popupBox.appendChild( $popup );

        // Popup overlay
        if ( options.popupOverlay ) {

            const $overlay = document.createElement( 'div' );
            $overlay.id = 'mdp-readabler-overlay';

            if ( options.closeAnywhere ) {
                $overlay.setAttribute( 'data-micromodal-close', '' );
            }

            $popupBox.appendChild( $overlay );

        }

        document.body.appendChild( $popupBox );

    }

    /**
     * Render Accessibility OffCanvas
     * @param options
     */
    renderOffCanvas( options ) {

        const $sidenav = document.createElement( 'div' );
        $sidenav.id = 'mdp-readabler-sidebar';
        $sidenav.classList.add( `mdp-readabler-sidebar-${ options.sidebarAlign }` );
        if ( options.popupShadow ) {
            $sidenav.classList.add( 'mdp-readabler-sidebar-shadow' );
        }
        $sidenav.setAttribute( 'aria-hidden', 'true' );
        $sidenav.setAttribute( 'data-nosnippet', '' );
        $sidenav.setAttribute( 'role','dialog' );
        $sidenav.setAttribute( 'aria-modal','true' );
        $sidenav.setAttribute( 'data-start','top' );

        $sidenav.appendChild( this.$header( options ) );
        $sidenav.appendChild( this.$section( options ) );
        $sidenav.appendChild( this.$footer( options ) );

        // Inline statement box
        if ( options.accessibilityStatement && [ 'iframe', 'html' ].includes( options.accessibilityStatementType ) ) {

            $sidenav.appendChild( this.$statement( options ) );

        }

        document.body.appendChild( $sidenav );

    }

    /**
     * Header HTML element
     */
    $header( options ) {

        const $header = document.createElement( 'header' );
        $header.id = 'mdp-readabler-popup-header';

        const $heading = document.createElement( readablerOptions.headingTag );
        $heading.innerHTML = i18next__WEBPACK_IMPORTED_MODULE_6__["default"].t( 'popup-title' );
        $header.appendChild( $heading );

        if ( options.closeButton ) {

            const $closeButton = document.createElement( 'button' );

            $closeButton.id = 'mdp-readabler-popup-close';
            $closeButton.setAttribute( 'aria-label', i18next__WEBPACK_IMPORTED_MODULE_6__["default"].t( 'close-accessibility-panel' ) );

            $header.appendChild( $closeButton );

        }

        return $header;

    }

    /**
     * Sections HTML element
     * @returns {HTMLElement}
     */
    $section( options ) {

        const $section = document.createElement( 'section' );
        $section.id = 'mdp-readabler-popup-main';

        /** Accessibility Profiles */
        if ( options.accessibilityProfiles &&
            (
                options.profileEpilepsy ||
                options.profileVisuallyImpaired ||
                options.profileCognitiveDisability ||
                options.profileAdhdFriendly ||
                options.profileBlindUsers
            )
        ) {

            $section.appendChild( _Typography__WEBPACK_IMPORTED_MODULE_1__.Typography.$heading( i18next__WEBPACK_IMPORTED_MODULE_6__["default"].t( 'section-accessibility-modes' ) ) );
            $section.appendChild( _SectionAccessibilityProfiles__WEBPACK_IMPORTED_MODULE_5__.SectionAccessibilityProfiles.$section( options ) );

        }

        /** Online Dictionary */
        if ( options.onlineDictionary ) {

            $section.appendChild( _Typography__WEBPACK_IMPORTED_MODULE_1__.Typography.$heading( i18next__WEBPACK_IMPORTED_MODULE_6__["default"].t( 'section-online-dictionary' ) ) );
            $section.appendChild( _SectionOnlineDictionary__WEBPACK_IMPORTED_MODULE_0__.SectionOnlineDictionary.$section( options ) );

        }

        /** Readable Experience */
        if ( options.readableExperience ) {

            $section.appendChild( _Typography__WEBPACK_IMPORTED_MODULE_1__.Typography.$heading( i18next__WEBPACK_IMPORTED_MODULE_6__["default"].t( 'section-readable-experience' ) ) );
            $section.appendChild( _SectionReadableExperience__WEBPACK_IMPORTED_MODULE_2__.SectionReadableExperience.$section( options ) );

        }

        /** Visually Pleasing Experience */
        if ( options.visuallyPleasingExperience ) {

            $section.appendChild( _Typography__WEBPACK_IMPORTED_MODULE_1__.Typography.$heading( i18next__WEBPACK_IMPORTED_MODULE_6__["default"].t( 'section-visually-pleasing-experience' ) ) );
            $section.appendChild( _SectionVisuallyPleasingExperience__WEBPACK_IMPORTED_MODULE_3__.SectionVisuallyPleasingExperience.$section( options ) );

        }

        /** Easy Orientation */
        if ( options.easyOrientation ) {

            $section.appendChild( _Typography__WEBPACK_IMPORTED_MODULE_1__.Typography.$heading( i18next__WEBPACK_IMPORTED_MODULE_6__["default"].t( 'section-easy-orientation' ) ) );
            $section.appendChild( _SectionEasyOrientation__WEBPACK_IMPORTED_MODULE_4__.SectionEasyOrientation.$section( options ) );

        }

        return $section;

    }

    /**
     * Footer HTML element
     * @returns {HTMLElement}
     */
    $footer( options ) {

        const $footer = document.createElement( 'footer' );
        $footer.id = "mdp-readabler-popup-footer";

        if ( options.resetButton ) {

            const $buttonReset = document.createElement( 'button' );

            $buttonReset.id = 'mdp-readabler-reset-btn';
            $buttonReset.setAttribute( 'aria-label', i18next__WEBPACK_IMPORTED_MODULE_6__["default"].t( 'reset-button' ) );
            $buttonReset.innerHTML = `<span>${ i18next__WEBPACK_IMPORTED_MODULE_6__["default"].t( 'reset-button' ) }</span>`;

            $footer.appendChild( $buttonReset );

        }

        if ( options.hideButton ) {

            const $buttonHide = document.createElement( 'button' );

            $buttonHide.id = 'mdp-readabler-hide-btn';
            $buttonHide.setAttribute( 'aria-label', i18next__WEBPACK_IMPORTED_MODULE_6__["default"].t( 'hide-button' ) );
            $buttonHide.innerHTML = `<span>${ i18next__WEBPACK_IMPORTED_MODULE_6__["default"].t( 'hide-button' ) }</span>`;

            $footer.appendChild( $buttonHide );

        }

        if ( options.accessibilityStatement ) {

            const $accessibilityStatement = document.createElement( 'p' );
            $accessibilityStatement.classList.add( 'mdp-readabler-statement' );
            $accessibilityStatement.innerHTML = `<a href="${ options.accessibilityStatementLink }" aria-label="${ i18next__WEBPACK_IMPORTED_MODULE_6__["default"].t( 'accessibility-statement' ) }" id="mdp-readabler-statement-btn" target="_blank" rel="noopener">${ i18next__WEBPACK_IMPORTED_MODULE_6__["default"].t( i18next__WEBPACK_IMPORTED_MODULE_6__["default"].t( 'accessibility-statement' ) ) }</a>`;

            $footer.appendChild( $accessibilityStatement );

        }

        return $footer

    }

    /**
     * Inline statement content
     * @returns {HTMLDivElement}
     */
    $statement( options  ) {

        const $inlineAccessibilityStatement = document.createElement( 'div' );
        $inlineAccessibilityStatement.id = 'mdp-readabler-accessibility-statement-box';
        if ( options.accessibilityStatementType === 'iframe' ) { $inlineAccessibilityStatement.className = 'mdp-readabler-accessibility-statement-iframe'; }

        $inlineAccessibilityStatement.innerHTML = `
        <button id="mdp-readabler-close-statement-btn" aria-label="${ i18next__WEBPACK_IMPORTED_MODULE_6__["default"].t( 'close-accessibility-panel' ) }"></button>
        <div class="mdp-readabler-statement-content">
        `;

        // Iframe statement
        if ( options.accessibilityStatementType === 'iframe' ) {

            $inlineAccessibilityStatement.innerHTML += `<iframe src="${ readablerOptions.accessibilityStatementLink }" title="${ i18next__WEBPACK_IMPORTED_MODULE_6__["default"].t( 'accessibility-statement' ) }"></iframe>`

        }

        // HTML statement
        if ( options.accessibilityStatementType === 'html' ) {

            $inlineAccessibilityStatement.innerHTML += options.accessibilityStatementHtml;

        }

        $inlineAccessibilityStatement.innerHTML += `
        </div>
        `;

        return $inlineAccessibilityStatement;

    }

    /**
     * Render Simple Keyboard
     * @param options
     */
    renderKeyboard( options ) {

        const $keyboard = document.createElement( 'div' );
        $keyboard.id = 'mdp-readabler-keyboard-box';
        $keyboard.innerHTML = '<div class="simple-keyboard"></div>'

        document.body.appendChild( $keyboard );

    }

}



/***/ }),

/***/ "./source/js/ui/SectionAccessibilityProfiles.js":
/*!******************************************************!*\
  !*** ./source/js/ui/SectionAccessibilityProfiles.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SectionAccessibilityProfiles": () => (/* binding */ SectionAccessibilityProfiles)
/* harmony export */ });
/* harmony import */ var _Control__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Control */ "./source/js/ui/Control.js");
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");



class SectionAccessibilityProfiles {

    static $section( options ) {

        const { accessibilityProfiles, profileEpilepsy, profileVisuallyImpaired, profileCognitiveDisability, profileAdhdFriendly, profileBlindUsers } = options;
        const $section = document.createElement( 'div' );
        $section.id = 'mdp-readabler-accessibility-profiles-box';

        /** Epilepsy Safe Profile. */
        if ( profileEpilepsy && accessibilityProfiles ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$switch(
                'profile-epilepsy',
                i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'profile-epilepsy-title' ),
                i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'profile-epilepsy-short' ),
                i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'profile-epilepsy-description' ),
            ) );

        }

        /** Visually Impaired Profile. */
        if ( profileVisuallyImpaired && accessibilityProfiles ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$switch(
                'profile-visually-impaired',
                i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'profile-visually-impaired-title' ),
                i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'profile-visually-impaired-short' ),
                i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'profile-visually-impaired-description' ),
            ) );

        }

        /** Cognitive Disability Profile. */
        if ( profileCognitiveDisability && accessibilityProfiles ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$switch(
                'profile-cognitive-disability',
                i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'profile-cognitive-disability-title' ),
                i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'profile-cognitive-disability-short' ),
                i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'profile-cognitive-disability-description' ),
            ) );

        }

        /** ADHD Friendly Profile. */
        if ( profileAdhdFriendly && accessibilityProfiles ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$switch(
                'profile-adhd-friendly',
                i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'profile-adhd-friendly-title' ),
                i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'profile-adhd-friendly-short' ),
                i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'profile-adhd-friendly-description' ),
            ) );

        }

        /** Blind Users. */
        if ( profileBlindUsers && accessibilityProfiles ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$switch(
                'profile-blind-users',
                i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'profile-blind-users-title' ),
                i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'profile-blind-users-short' ),
                i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'profile-blind-users-description' ),
            ) );

        }

        return $section;

    }

}


/***/ }),

/***/ "./source/js/ui/SectionEasyOrientation.js":
/*!************************************************!*\
  !*** ./source/js/ui/SectionEasyOrientation.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SectionEasyOrientation": () => (/* binding */ SectionEasyOrientation)
/* harmony export */ });
/* harmony import */ var _Control__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Control */ "./source/js/ui/Control.js");


class SectionEasyOrientation {

    static $section( options ) {

        const $section = document.createElement( 'div' );
        $section.id = 'mdp-readabler-easy-orientation-box';

        /** Mute Sounds. */
        if ( options.muteSounds ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'mute-sounds'
            ) );

        }

        /** Hide Images. */
        if ( options.hideImages ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'hide-images'
            ) );

        }

        /** Virtual Keyboard. */
        if ( options.virtualKeyboard || options.profileBlindUsers ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'virtual-keyboard',
                ! options.virtualKeyboard
            ) );

        }

        /** Reading Guide. */
        if ( options.readingGuide ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'reading-guide'
            ) );

        }

        /** Stop Animations. */
        if ( options.stopAnimations || options.profileEpilepsy || options.profileCognitiveDisability || options.profileAdhdFriendly ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'stop-animations',
                ! options.stopAnimations
            ) );

        }

        /** Reading Mask. */
        if ( options.readingMask || options.profileAdhdFriendly ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'reading-mask',
                ! options.readingMask
            ) );

        }

        /** Highlight Hover. */
        if ( options.highlightHover ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'highlight-hover'
            ) );

        }

        /** Highlight Focus. */
        if ( options.highlightFocus ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'highlight-focus'
            ) );

        }

        /** Big Black Cursor. */
         if ( options.bigBlackCursor ) {

             $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                 'big-black-cursor'
             ) );

         }

        /** Big White Cursor. */
        if ( options.bigWhiteCursor ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'big-white-cursor'
            ) );

        }

        /** Keyboard Navigation. */
        if ( options.keyboardNavigation || options.profileBlindUsers ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'keyboard-navigation',
                ! options.keyboardNavigation
            ) );

        }

        /** Text to Speech. */
        if ( options.textToSpeech && window.speechSynthesis.getVoices().length > 0 ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'text-to-speech',
                ! options.textToSpeech
            ) );

        }

        /** Useful Links. */
        if ( options.usefulLinks ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$usefulLinks(
                'useful-links'
            ) );

        }

        return $section;

    }

}


/***/ }),

/***/ "./source/js/ui/SectionOnlineDictionary.js":
/*!*************************************************!*\
  !*** ./source/js/ui/SectionOnlineDictionary.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SectionOnlineDictionary": () => (/* binding */ SectionOnlineDictionary)
/* harmony export */ });
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");


class SectionOnlineDictionary {

    static $section( options ) {

        const $section = document.createElement( 'div' );
        $section.id = 'mdp-readabler-online-dictionary-box';
        $section.innerHTML = `
        <form id="mdp-readabler-online-dictionary-form" enctype="multipart/form-data" action="#" method="POST">
        <input type="text"
               tabindex="0"
               id="mdp-readabler-online-dictionary-search"
               name="mdp-readabler-online-dictionary-search"
               autocomplete="off"
               placeholder="${ i18next__WEBPACK_IMPORTED_MODULE_0__["default"].t( 'search-placeholder-wikipedia' ) }"
               aria-label="${ i18next__WEBPACK_IMPORTED_MODULE_0__["default"].t( 'search-placeholder-wikipedia' ) }">
            <label for="mdp-readabler-online-dictionary-search">${ i18next__WEBPACK_IMPORTED_MODULE_0__["default"].t( 'start-typing-wikipedia' ) }</label>
        </form>
        <button role="button" tabindex="0" aria-label="Clear search results" id="mdp-readabler-online-dictionary-search-close"></button>
        <div id="mdp-readabler-online-dictionary-search-results-box">
            <ul id="mdp-readabler-online-dictionary-search-results"></ul>
        </div>`;

        return $section;

    }

}


/***/ }),

/***/ "./source/js/ui/SectionReadableExperience.js":
/*!***************************************************!*\
  !*** ./source/js/ui/SectionReadableExperience.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SectionReadableExperience": () => (/* binding */ SectionReadableExperience)
/* harmony export */ });
/* harmony import */ var _Control__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Control */ "./source/js/ui/Control.js");
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");



class SectionReadableExperience {

    static $section( options ) {

        const $section = document.createElement( 'div' );
        $section.id = 'mdp-readabler-readable-experience-box';

        /** Content Scaling. */
        if ( options.contentScaling ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$inputSpinner(
                'content-scaling',
                i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'content-size' ),
                5
            ) );

        }

        /** Text Magnifier. */
        if ( options.textMagnifier ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'text-magnifier'
            ) );

        }

        /** Readable Font. */
        if ( options.readableFont || options.profileVisuallyImpaired || options.profileBlindUsers ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'readable-font',
                ! options.readableFont
            ) );

        }

        /** Dyslexia Friendly. */
        if ( options.dyslexiaFont ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'dyslexia-font'
            ) );

        }

        /** Highlight Titles. */
        if ( options.highlightTitles || options.profileCognitiveDisability ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'highlight-titles',
                ! options.highlightTitles
            ) );

        }

        /** Highlight Links. */
        if ( options.highlightLinks || options.profileCognitiveDisability ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'highlight-links',
                ! options.highlightLinks
            ) );

        }

        /** Font Sizing. */
        if ( options.fontSizing ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$inputSpinner(
                'font-sizing',
                i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'font-size' ),
                5
            ) );

        }

        /** Line Height. */
        if ( options.lineHeight ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$inputSpinner(
                'line-height',
                i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'line-height' ),
                5
            ) );

        }

        /** Letter Spacing. */
        if ( options.letterSpacing ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$inputSpinner(
                'letter-spacing',
                i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t( 'letter-space' ),
                5
            ) );

        }

        /** Align Left. */
        if ( options.alignLeft ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'align-left',
            ) );

        }

        /** Align Center. */
        if ( options.alignCenter ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'align-center',
            ) );

        }

        /** Align Right. */
        if ( options.alignRight ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'align-right',
            ) );

        }

        return $section;

    }

}


/***/ }),

/***/ "./source/js/ui/SectionVisuallyPleasingExperience.js":
/*!***********************************************************!*\
  !*** ./source/js/ui/SectionVisuallyPleasingExperience.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SectionVisuallyPleasingExperience": () => (/* binding */ SectionVisuallyPleasingExperience)
/* harmony export */ });
/* harmony import */ var _Control__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Control */ "./source/js/ui/Control.js");


class SectionVisuallyPleasingExperience {

    static $section( options ) {

        const $section = document.createElement( 'div' );
        $section.id = 'mdp-readabler-visually-pleasing-experience-box';

        /** Dark Contrast. */
        if ( options.darkContrast ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'dark-contrast'
            ) );

        }

        /** Light Contrast. */
        if ( options.lightContrast ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'light-contrast'
            ) );

        }

        /** Monochrome. */
        if ( options.monochrome ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'monochrome'
            ) );

        }

        /** High Contrast. */
        if ( options.highContrast ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'high-contrast'
            ) );

        }

        /** High Saturation. */
        if ( options.highSaturation || options.profileVisuallyImpaired || options.profileAdhdFriendly ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'high-saturation',
                ! options.highSaturation
            ) );

        }

        /** Low Saturation. */
        if ( options.lowSaturation || options.profileEpilepsy ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$toggle(
                'low-saturation',
                ! options.lowSaturation
            ) );

        }

        /** Text Colors. */
        if ( options.textColors ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$palette(
                'text-colors'
            ) );

        }

        /** Title Colors. */
        if ( options.titleColors ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$palette(
                'title-colors'
            ) );

        }

        /** Background Colors. */
        if ( options.backgroundColors ) {

            $section.appendChild( _Control__WEBPACK_IMPORTED_MODULE_0__.Control.$palette(
                'background-colors'
            ) );

        }

        return $section;

    }

}


/***/ }),

/***/ "./source/js/ui/Typography.js":
/*!************************************!*\
  !*** ./source/js/ui/Typography.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Typography": () => (/* binding */ Typography)
/* harmony export */ });
class Typography {

    static $heading( text = '', tagName = readablerOptions.subHeadingTag ) {

        const $heading = document.createElement( 'div' );
        $heading.classList.add( 'mdp-readabler-subheader' );

        if ( typeof text === 'string' && text !== '' ) {

            const $headingTag = document.createElement( tagName );
            $headingTag.innerHTML = text;

            $heading.appendChild( $headingTag );

        }

        return $heading;

    }

}


/***/ }),

/***/ "./node_modules/i18next-http-backend/esm/getFetch.cjs":
/*!************************************************************!*\
  !*** ./node_modules/i18next-http-backend/esm/getFetch.cjs ***!
  \************************************************************/
/***/ ((module, exports, __webpack_require__) => {

var fetchApi
if (typeof fetch === 'function') {
  if (typeof __webpack_require__.g !== 'undefined' && __webpack_require__.g.fetch) {
    fetchApi = __webpack_require__.g.fetch
  } else if (typeof window !== 'undefined' && window.fetch) {
    fetchApi = window.fetch
  }
}

if ( true && (typeof window === 'undefined' || typeof window.document === 'undefined')) {
  var f = fetchApi || __webpack_require__(/*! cross-fetch */ "./node_modules/cross-fetch/dist/browser-ponyfill.js")
  if (f.default) f = f.default
  exports["default"] = f
  module.exports = exports.default
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayLikeToArray)
/* harmony export */ });
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayWithHoles)
/* harmony export */ });
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _assertThisInitialized)
/* harmony export */ });
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _classCallCheck)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _createClass)
/* harmony export */ });
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _defineProperty)
/* harmony export */ });
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _getPrototypeOf)
/* harmony export */ });
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inherits.js":
/*!*************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inherits.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inherits)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _iterableToArray)
/* harmony export */ });
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _nonIterableRest)
/* harmony export */ });
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _possibleConstructorReturn)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assertThisInitialized.js */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");


function _possibleConstructorReturn(self, call) {
  if (call && ((0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return (0,_assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__["default"])(self);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toArray.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toArray.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _toArray)
/* harmony export */ });
/* harmony import */ var _arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js");
/* harmony import */ var _iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableRest.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js");




function _toArray(arr) {
  return (0,_arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr) || (0,_nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _unsupportedIterableToArray)
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
}

/***/ }),

/***/ "./node_modules/i18next-http-backend/esm/index.js":
/*!********************************************************!*\
  !*** ./node_modules/i18next-http-backend/esm/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/i18next-http-backend/esm/utils.js");
/* harmony import */ var _request_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./request.js */ "./node_modules/i18next-http-backend/esm/request.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




var getDefaults = function getDefaults() {
  return {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
    addPath: '/locales/add/{{lng}}/{{ns}}',
    allowMultiLoading: false,
    parse: function parse(data) {
      return JSON.parse(data);
    },
    stringify: JSON.stringify,
    parsePayload: function parsePayload(namespace, key, fallbackValue) {
      return _defineProperty({}, key, fallbackValue || '');
    },
    request: _request_js__WEBPACK_IMPORTED_MODULE_1__["default"],
    reloadInterval: typeof window !== 'undefined' ? false : 60 * 60 * 1000,
    customHeaders: {},
    queryStringParams: {},
    crossDomain: false,
    withCredentials: false,
    overrideMimeType: false,
    requestOptions: {
      mode: 'cors',
      credentials: 'same-origin',
      cache: 'default'
    }
  };
};

var Backend = function () {
  function Backend(services) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var allOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, Backend);

    this.services = services;
    this.options = options;
    this.allOptions = allOptions;
    this.type = 'backend';
    this.init(services, options, allOptions);
  }

  _createClass(Backend, [{
    key: "init",
    value: function init(services) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var allOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      this.services = services;
      this.options = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.defaults)(options, this.options || {}, getDefaults());
      this.allOptions = allOptions;

      if (this.services && this.options.reloadInterval) {
        setInterval(function () {
          return _this.reload();
        }, this.options.reloadInterval);
      }
    }
  }, {
    key: "readMulti",
    value: function readMulti(languages, namespaces, callback) {
      this._readAny(languages, languages, namespaces, namespaces, callback);
    }
  }, {
    key: "read",
    value: function read(language, namespace, callback) {
      this._readAny([language], language, [namespace], namespace, callback);
    }
  }, {
    key: "_readAny",
    value: function _readAny(languages, loadUrlLanguages, namespaces, loadUrlNamespaces, callback) {
      var _this2 = this;

      var loadPath = this.options.loadPath;

      if (typeof this.options.loadPath === 'function') {
        loadPath = this.options.loadPath(languages, namespaces);
      }

      loadPath = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.makePromise)(loadPath);
      loadPath.then(function (resolvedLoadPath) {
        if (!resolvedLoadPath) return callback(null, {});

        var url = _this2.services.interpolator.interpolate(resolvedLoadPath, {
          lng: languages.join('+'),
          ns: namespaces.join('+')
        });

        _this2.loadUrl(url, callback, loadUrlLanguages, loadUrlNamespaces);
      });
    }
  }, {
    key: "loadUrl",
    value: function loadUrl(url, callback, languages, namespaces) {
      var _this3 = this;

      this.options.request(this.options, url, undefined, function (err, res) {
        if (res && (res.status >= 500 && res.status < 600 || !res.status)) return callback('failed loading ' + url + '; status code: ' + res.status, true);
        if (res && res.status >= 400 && res.status < 500) return callback('failed loading ' + url + '; status code: ' + res.status, false);
        if (!res && err && err.message && err.message.indexOf('Failed to fetch') > -1) return callback('failed loading ' + url + ': ' + err.message, true);
        if (err) return callback(err, false);
        var ret, parseErr;

        try {
          if (typeof res.data === 'string') {
            ret = _this3.options.parse(res.data, languages, namespaces);
          } else {
            ret = res.data;
          }
        } catch (e) {
          parseErr = 'failed parsing ' + url + ' to json';
        }

        if (parseErr) return callback(parseErr, false);
        callback(null, ret);
      });
    }
  }, {
    key: "create",
    value: function create(languages, namespace, key, fallbackValue, callback) {
      var _this4 = this;

      if (!this.options.addPath) return;
      if (typeof languages === 'string') languages = [languages];
      var payload = this.options.parsePayload(namespace, key, fallbackValue);
      var finished = 0;
      var dataArray = [];
      var resArray = [];
      languages.forEach(function (lng) {
        var addPath = _this4.options.addPath;

        if (typeof _this4.options.addPath === 'function') {
          addPath = _this4.options.addPath(lng, namespace);
        }

        var url = _this4.services.interpolator.interpolate(addPath, {
          lng: lng,
          ns: namespace
        });

        _this4.options.request(_this4.options, url, payload, function (data, res) {
          finished += 1;
          dataArray.push(data);
          resArray.push(res);

          if (finished === languages.length) {
            if (callback) callback(dataArray, resArray);
          }
        });
      });
    }
  }, {
    key: "reload",
    value: function reload() {
      var _this5 = this;

      var _this$services = this.services,
          backendConnector = _this$services.backendConnector,
          languageUtils = _this$services.languageUtils,
          logger = _this$services.logger;
      var currentLanguage = backendConnector.language;
      if (currentLanguage && currentLanguage.toLowerCase() === 'cimode') return;
      var toLoad = [];

      var append = function append(lng) {
        var lngs = languageUtils.toResolveHierarchy(lng);
        lngs.forEach(function (l) {
          if (toLoad.indexOf(l) < 0) toLoad.push(l);
        });
      };

      append(currentLanguage);
      if (this.allOptions.preload) this.allOptions.preload.forEach(function (l) {
        return append(l);
      });
      toLoad.forEach(function (lng) {
        _this5.allOptions.ns.forEach(function (ns) {
          backendConnector.read(lng, ns, 'read', null, null, function (err, data) {
            if (err) logger.warn("loading namespace ".concat(ns, " for language ").concat(lng, " failed"), err);
            if (!err && data) logger.log("loaded namespace ".concat(ns, " for language ").concat(lng), data);
            backendConnector.loaded("".concat(lng, "|").concat(ns), err, data);
          });
        });
      });
    }
  }]);

  return Backend;
}();

Backend.type = 'backend';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Backend);

/***/ }),

/***/ "./node_modules/i18next-http-backend/esm/request.js":
/*!**********************************************************!*\
  !*** ./node_modules/i18next-http-backend/esm/request.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
var _getFetch_cjs__WEBPACK_IMPORTED_MODULE_1___namespace_cache;
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/i18next-http-backend/esm/utils.js");
/* harmony import */ var _getFetch_cjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getFetch.cjs */ "./node_modules/i18next-http-backend/esm/getFetch.cjs");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }



var fetchApi;

if (typeof fetch === 'function') {
  if (typeof global !== 'undefined' && global.fetch) {
    fetchApi = global.fetch;
  } else if (typeof window !== 'undefined' && window.fetch) {
    fetchApi = window.fetch;
  }
}

var XmlHttpRequestApi;

if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.hasXMLHttpRequest) {
  if (typeof global !== 'undefined' && global.XMLHttpRequest) {
    XmlHttpRequestApi = global.XMLHttpRequest;
  } else if (typeof window !== 'undefined' && window.XMLHttpRequest) {
    XmlHttpRequestApi = window.XMLHttpRequest;
  }
}

var ActiveXObjectApi;

if (typeof ActiveXObject === 'function') {
  if (typeof global !== 'undefined' && global.ActiveXObject) {
    ActiveXObjectApi = global.ActiveXObject;
  } else if (typeof window !== 'undefined' && window.ActiveXObject) {
    ActiveXObjectApi = window.ActiveXObject;
  }
}

if (!fetchApi && /*#__PURE__*/ (_getFetch_cjs__WEBPACK_IMPORTED_MODULE_1___namespace_cache || (_getFetch_cjs__WEBPACK_IMPORTED_MODULE_1___namespace_cache = __webpack_require__.t(_getFetch_cjs__WEBPACK_IMPORTED_MODULE_1__, 2))) && !XmlHttpRequestApi && !ActiveXObjectApi) fetchApi = _getFetch_cjs__WEBPACK_IMPORTED_MODULE_1__ || /*#__PURE__*/ (_getFetch_cjs__WEBPACK_IMPORTED_MODULE_1___namespace_cache || (_getFetch_cjs__WEBPACK_IMPORTED_MODULE_1___namespace_cache = __webpack_require__.t(_getFetch_cjs__WEBPACK_IMPORTED_MODULE_1__, 2)));
if (typeof fetchApi !== 'function') fetchApi = undefined;

var addQueryString = function addQueryString(url, params) {
  if (params && _typeof(params) === 'object') {
    var queryString = '';

    for (var paramName in params) {
      queryString += '&' + encodeURIComponent(paramName) + '=' + encodeURIComponent(params[paramName]);
    }

    if (!queryString) return url;
    url = url + (url.indexOf('?') !== -1 ? '&' : '?') + queryString.slice(1);
  }

  return url;
};

var requestWithFetch = function requestWithFetch(options, url, payload, callback) {
  if (options.queryStringParams) {
    url = addQueryString(url, options.queryStringParams);
  }

  var headers = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.defaults)({}, typeof options.customHeaders === 'function' ? options.customHeaders() : options.customHeaders);
  if (payload) headers['Content-Type'] = 'application/json';
  fetchApi(url, (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.defaults)({
    method: payload ? 'POST' : 'GET',
    body: payload ? options.stringify(payload) : undefined,
    headers: headers
  }, typeof options.requestOptions === 'function' ? options.requestOptions(payload) : options.requestOptions)).then(function (response) {
    if (!response.ok) return callback(response.statusText || 'Error', {
      status: response.status
    });
    response.text().then(function (data) {
      callback(null, {
        status: response.status,
        data: data
      });
    }).catch(callback);
  }).catch(callback);
};

var requestWithXmlHttpRequest = function requestWithXmlHttpRequest(options, url, payload, callback) {
  if (payload && _typeof(payload) === 'object') {
    payload = addQueryString('', payload).slice(1);
  }

  if (options.queryStringParams) {
    url = addQueryString(url, options.queryStringParams);
  }

  try {
    var x;

    if (XmlHttpRequestApi) {
      x = new XmlHttpRequestApi();
    } else {
      x = new ActiveXObjectApi('MSXML2.XMLHTTP.3.0');
    }

    x.open(payload ? 'POST' : 'GET', url, 1);

    if (!options.crossDomain) {
      x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    }

    x.withCredentials = !!options.withCredentials;

    if (payload) {
      x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    if (x.overrideMimeType) {
      x.overrideMimeType('application/json');
    }

    var h = options.customHeaders;
    h = typeof h === 'function' ? h() : h;

    if (h) {
      for (var i in h) {
        x.setRequestHeader(i, h[i]);
      }
    }

    x.onreadystatechange = function () {
      x.readyState > 3 && callback(x.status >= 400 ? x.statusText : null, {
        status: x.status,
        data: x.responseText
      });
    };

    x.send(payload);
  } catch (e) {
    console && console.log(e);
  }
};

var request = function request(options, url, payload, callback) {
  if (typeof payload === 'function') {
    callback = payload;
    payload = undefined;
  }

  callback = callback || function () {};

  if (fetchApi) {
    return requestWithFetch(options, url, payload, callback);
  }

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__.hasXMLHttpRequest || typeof ActiveXObject === 'function') {
    return requestWithXmlHttpRequest(options, url, payload, callback);
  }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (request);

/***/ }),

/***/ "./node_modules/i18next-http-backend/esm/utils.js":
/*!********************************************************!*\
  !*** ./node_modules/i18next-http-backend/esm/utils.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "defaults": () => (/* binding */ defaults),
/* harmony export */   "hasXMLHttpRequest": () => (/* binding */ hasXMLHttpRequest),
/* harmony export */   "makePromise": () => (/* binding */ makePromise)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var arr = [];
var each = arr.forEach;
var slice = arr.slice;
function defaults(obj) {
  each.call(slice.call(arguments, 1), function (source) {
    if (source) {
      for (var prop in source) {
        if (obj[prop] === undefined) obj[prop] = source[prop];
      }
    }
  });
  return obj;
}
function hasXMLHttpRequest() {
  return typeof XMLHttpRequest === 'function' || (typeof XMLHttpRequest === "undefined" ? "undefined" : _typeof(XMLHttpRequest)) === 'object';
}

function isPromise(maybePromise) {
  return !!maybePromise && typeof maybePromise.then === 'function';
}

function makePromise(maybePromise) {
  if (isPromise(maybePromise)) {
    return maybePromise;
  }

  return Promise.resolve(maybePromise);
}

/***/ }),

/***/ "./node_modules/i18next-resources-to-backend/dist/esm/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/i18next-resources-to-backend/dist/esm/index.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var resourcesToBackend = function resourcesToBackend(res) {
  return {
    type: 'backend',
    init: function init(services, backendOptions, i18nextOptions) {},
    read: function read(language, namespace, callback) {
      if (typeof res === 'function') {
        res(language, namespace, callback);
        return;
      }

      callback(null, res && res[language] && res[language][namespace]);
    }
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (resourcesToBackend);


/***/ }),

/***/ "./node_modules/i18next/dist/esm/i18next.js":
/*!**************************************************!*\
  !*** ./node_modules/i18next/dist/esm/i18next.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "changeLanguage": () => (/* binding */ changeLanguage),
/* harmony export */   "createInstance": () => (/* binding */ createInstance),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "exists": () => (/* binding */ exists),
/* harmony export */   "getFixedT": () => (/* binding */ getFixedT),
/* harmony export */   "hasLoadedNamespace": () => (/* binding */ hasLoadedNamespace),
/* harmony export */   "init": () => (/* binding */ init),
/* harmony export */   "loadLanguages": () => (/* binding */ loadLanguages),
/* harmony export */   "loadNamespaces": () => (/* binding */ loadNamespaces),
/* harmony export */   "loadResources": () => (/* binding */ loadResources),
/* harmony export */   "reloadResources": () => (/* binding */ reloadResources),
/* harmony export */   "setDefaultNamespace": () => (/* binding */ setDefaultNamespace),
/* harmony export */   "t": () => (/* binding */ t),
/* harmony export */   "use": () => (/* binding */ use)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_esm_toArray__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime/helpers/esm/toArray */ "./node_modules/@babel/runtime/helpers/esm/toArray.js");










function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var consoleLogger = {
  type: 'logger',
  log: function log(args) {
    this.output('log', args);
  },
  warn: function warn(args) {
    this.output('warn', args);
  },
  error: function error(args) {
    this.output('error', args);
  },
  output: function output(type, args) {
    if (console && console[type]) console[type].apply(console, args);
  }
};

var Logger = function () {
  function Logger(concreteLogger) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, Logger);

    this.init(concreteLogger, options);
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(Logger, [{
    key: "init",
    value: function init(concreteLogger) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.prefix = options.prefix || 'i18next:';
      this.logger = concreteLogger || consoleLogger;
      this.options = options;
      this.debug = options.debug;
    }
  }, {
    key: "setDebug",
    value: function setDebug(bool) {
      this.debug = bool;
    }
  }, {
    key: "log",
    value: function log() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this.forward(args, 'log', '', true);
    }
  }, {
    key: "warn",
    value: function warn() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return this.forward(args, 'warn', '', true);
    }
  }, {
    key: "error",
    value: function error() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return this.forward(args, 'error', '');
    }
  }, {
    key: "deprecate",
    value: function deprecate() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return this.forward(args, 'warn', 'WARNING DEPRECATED: ', true);
    }
  }, {
    key: "forward",
    value: function forward(args, lvl, prefix, debugOnly) {
      if (debugOnly && !this.debug) return null;
      if (typeof args[0] === 'string') args[0] = "".concat(prefix).concat(this.prefix, " ").concat(args[0]);
      return this.logger[lvl](args);
    }
  }, {
    key: "create",
    value: function create(moduleName) {
      return new Logger(this.logger, _objectSpread(_objectSpread({}, {
        prefix: "".concat(this.prefix, ":").concat(moduleName, ":")
      }), this.options));
    }
  }]);

  return Logger;
}();

var baseLogger = new Logger();

var EventEmitter = function () {
  function EventEmitter() {
    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, EventEmitter);

    this.observers = {};
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(EventEmitter, [{
    key: "on",
    value: function on(events, listener) {
      var _this = this;

      events.split(' ').forEach(function (event) {
        _this.observers[event] = _this.observers[event] || [];

        _this.observers[event].push(listener);
      });
      return this;
    }
  }, {
    key: "off",
    value: function off(event, listener) {
      if (!this.observers[event]) return;

      if (!listener) {
        delete this.observers[event];
        return;
      }

      this.observers[event] = this.observers[event].filter(function (l) {
        return l !== listener;
      });
    }
  }, {
    key: "emit",
    value: function emit(event) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (this.observers[event]) {
        var cloned = [].concat(this.observers[event]);
        cloned.forEach(function (observer) {
          observer.apply(void 0, args);
        });
      }

      if (this.observers['*']) {
        var _cloned = [].concat(this.observers['*']);

        _cloned.forEach(function (observer) {
          observer.apply(observer, [event].concat(args));
        });
      }
    }
  }]);

  return EventEmitter;
}();

function defer() {
  var res;
  var rej;
  var promise = new Promise(function (resolve, reject) {
    res = resolve;
    rej = reject;
  });
  promise.resolve = res;
  promise.reject = rej;
  return promise;
}
function makeString(object) {
  if (object == null) return '';
  return '' + object;
}
function copy(a, s, t) {
  a.forEach(function (m) {
    if (s[m]) t[m] = s[m];
  });
}

function getLastOfPath(object, path, Empty) {
  function cleanKey(key) {
    return key && key.indexOf('###') > -1 ? key.replace(/###/g, '.') : key;
  }

  function canNotTraverseDeeper() {
    return !object || typeof object === 'string';
  }

  var stack = typeof path !== 'string' ? [].concat(path) : path.split('.');

  while (stack.length > 1) {
    if (canNotTraverseDeeper()) return {};
    var key = cleanKey(stack.shift());
    if (!object[key] && Empty) object[key] = new Empty();

    if (Object.prototype.hasOwnProperty.call(object, key)) {
      object = object[key];
    } else {
      object = {};
    }
  }

  if (canNotTraverseDeeper()) return {};
  return {
    obj: object,
    k: cleanKey(stack.shift())
  };
}

function setPath(object, path, newValue) {
  var _getLastOfPath = getLastOfPath(object, path, Object),
      obj = _getLastOfPath.obj,
      k = _getLastOfPath.k;

  obj[k] = newValue;
}
function pushPath(object, path, newValue, concat) {
  var _getLastOfPath2 = getLastOfPath(object, path, Object),
      obj = _getLastOfPath2.obj,
      k = _getLastOfPath2.k;

  obj[k] = obj[k] || [];
  if (concat) obj[k] = obj[k].concat(newValue);
  if (!concat) obj[k].push(newValue);
}
function getPath(object, path) {
  var _getLastOfPath3 = getLastOfPath(object, path),
      obj = _getLastOfPath3.obj,
      k = _getLastOfPath3.k;

  if (!obj) return undefined;
  return obj[k];
}
function getPathWithDefaults(data, defaultData, key) {
  var value = getPath(data, key);

  if (value !== undefined) {
    return value;
  }

  return getPath(defaultData, key);
}
function deepExtend(target, source, overwrite) {
  for (var prop in source) {
    if (prop !== '__proto__' && prop !== 'constructor') {
      if (prop in target) {
        if (typeof target[prop] === 'string' || target[prop] instanceof String || typeof source[prop] === 'string' || source[prop] instanceof String) {
          if (overwrite) target[prop] = source[prop];
        } else {
          deepExtend(target[prop], source[prop], overwrite);
        }
      } else {
        target[prop] = source[prop];
      }
    }
  }

  return target;
}
function regexEscape(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}
var _entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};
function escape(data) {
  if (typeof data === 'string') {
    return data.replace(/[&<>"'\/]/g, function (s) {
      return _entityMap[s];
    });
  }

  return data;
}
var isIE10 = typeof window !== 'undefined' && window.navigator && window.navigator.userAgent && window.navigator.userAgent.indexOf('MSIE') > -1;
var chars = [' ', ',', '?', '!', ';'];
function looksLikeObjectPath(key, nsSeparator, keySeparator) {
  nsSeparator = nsSeparator || '';
  keySeparator = keySeparator || '';
  var possibleChars = chars.filter(function (c) {
    return nsSeparator.indexOf(c) < 0 && keySeparator.indexOf(c) < 0;
  });
  if (possibleChars.length === 0) return true;
  var r = new RegExp("(".concat(possibleChars.map(function (c) {
    return c === '?' ? '\\?' : c;
  }).join('|'), ")"));
  var matched = !r.test(key);

  if (!matched) {
    var ki = key.indexOf(keySeparator);

    if (ki > 0 && !r.test(key.substring(0, ki))) {
      matched = true;
    }
  }

  return matched;
}

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function deepFind(obj, path) {
  var keySeparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';
  if (!obj) return undefined;
  if (obj[path]) return obj[path];
  var paths = path.split(keySeparator);
  var current = obj;

  for (var i = 0; i < paths.length; ++i) {
    if (!current) return undefined;

    if (typeof current[paths[i]] === 'string' && i + 1 < paths.length) {
      return undefined;
    }

    if (current[paths[i]] === undefined) {
      var j = 2;
      var p = paths.slice(i, i + j).join(keySeparator);
      var mix = current[p];

      while (mix === undefined && paths.length > i + j) {
        j++;
        p = paths.slice(i, i + j).join(keySeparator);
        mix = current[p];
      }

      if (mix === undefined) return undefined;

      if (path.endsWith(p)) {
        if (typeof mix === 'string') return mix;
        if (p && typeof mix[p] === 'string') return mix[p];
      }

      var joinedPath = paths.slice(i + j).join(keySeparator);
      if (joinedPath) return deepFind(mix, joinedPath, keySeparator);
      return undefined;
    }

    current = current[paths[i]];
  }

  return current;
}

var ResourceStore = function (_EventEmitter) {
  (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(ResourceStore, _EventEmitter);

  var _super = _createSuper(ResourceStore);

  function ResourceStore(data) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      ns: ['translation'],
      defaultNS: 'translation'
    };

    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, ResourceStore);

    _this = _super.call(this);

    if (isIE10) {
      EventEmitter.call((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    }

    _this.data = data || {};
    _this.options = options;

    if (_this.options.keySeparator === undefined) {
      _this.options.keySeparator = '.';
    }

    if (_this.options.ignoreJSONStructure === undefined) {
      _this.options.ignoreJSONStructure = true;
    }

    return _this;
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(ResourceStore, [{
    key: "addNamespaces",
    value: function addNamespaces(ns) {
      if (this.options.ns.indexOf(ns) < 0) {
        this.options.ns.push(ns);
      }
    }
  }, {
    key: "removeNamespaces",
    value: function removeNamespaces(ns) {
      var index = this.options.ns.indexOf(ns);

      if (index > -1) {
        this.options.ns.splice(index, 1);
      }
    }
  }, {
    key: "getResource",
    value: function getResource(lng, ns, key) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
      var ignoreJSONStructure = options.ignoreJSONStructure !== undefined ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
      var path = [lng, ns];
      if (key && typeof key !== 'string') path = path.concat(key);
      if (key && typeof key === 'string') path = path.concat(keySeparator ? key.split(keySeparator) : key);

      if (lng.indexOf('.') > -1) {
        path = lng.split('.');
      }

      var result = getPath(this.data, path);
      if (result || !ignoreJSONStructure || typeof key !== 'string') return result;
      return deepFind(this.data && this.data[lng] && this.data[lng][ns], key, keySeparator);
    }
  }, {
    key: "addResource",
    value: function addResource(lng, ns, key, value) {
      var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
        silent: false
      };
      var keySeparator = this.options.keySeparator;
      if (keySeparator === undefined) keySeparator = '.';
      var path = [lng, ns];
      if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);

      if (lng.indexOf('.') > -1) {
        path = lng.split('.');
        value = ns;
        ns = path[1];
      }

      this.addNamespaces(ns);
      setPath(this.data, path, value);
      if (!options.silent) this.emit('added', lng, ns, key, value);
    }
  }, {
    key: "addResources",
    value: function addResources(lng, ns, resources) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
        silent: false
      };

      for (var m in resources) {
        if (typeof resources[m] === 'string' || Object.prototype.toString.apply(resources[m]) === '[object Array]') this.addResource(lng, ns, m, resources[m], {
          silent: true
        });
      }

      if (!options.silent) this.emit('added', lng, ns, resources);
    }
  }, {
    key: "addResourceBundle",
    value: function addResourceBundle(lng, ns, resources, deep, overwrite) {
      var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {
        silent: false
      };
      var path = [lng, ns];

      if (lng.indexOf('.') > -1) {
        path = lng.split('.');
        deep = resources;
        resources = ns;
        ns = path[1];
      }

      this.addNamespaces(ns);
      var pack = getPath(this.data, path) || {};

      if (deep) {
        deepExtend(pack, resources, overwrite);
      } else {
        pack = _objectSpread$1(_objectSpread$1({}, pack), resources);
      }

      setPath(this.data, path, pack);
      if (!options.silent) this.emit('added', lng, ns, resources);
    }
  }, {
    key: "removeResourceBundle",
    value: function removeResourceBundle(lng, ns) {
      if (this.hasResourceBundle(lng, ns)) {
        delete this.data[lng][ns];
      }

      this.removeNamespaces(ns);
      this.emit('removed', lng, ns);
    }
  }, {
    key: "hasResourceBundle",
    value: function hasResourceBundle(lng, ns) {
      return this.getResource(lng, ns) !== undefined;
    }
  }, {
    key: "getResourceBundle",
    value: function getResourceBundle(lng, ns) {
      if (!ns) ns = this.options.defaultNS;
      if (this.options.compatibilityAPI === 'v1') return _objectSpread$1(_objectSpread$1({}, {}), this.getResource(lng, ns));
      return this.getResource(lng, ns);
    }
  }, {
    key: "getDataByLanguage",
    value: function getDataByLanguage(lng) {
      return this.data[lng];
    }
  }, {
    key: "hasLanguageSomeTranslations",
    value: function hasLanguageSomeTranslations(lng) {
      var data = this.getDataByLanguage(lng);
      var n = data && Object.keys(data) || [];
      return !!n.find(function (v) {
        return data[v] && Object.keys(data[v]).length > 0;
      });
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.data;
    }
  }]);

  return ResourceStore;
}(EventEmitter);

var postProcessor = {
  processors: {},
  addPostProcessor: function addPostProcessor(module) {
    this.processors[module.name] = module;
  },
  handle: function handle(processors, value, key, options, translator) {
    var _this = this;

    processors.forEach(function (processor) {
      if (_this.processors[processor]) value = _this.processors[processor].process(value, key, options, translator);
    });
    return value;
  }
};

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(this, result); }; }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var checkedLoadedFor = {};

var Translator = function (_EventEmitter) {
  (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Translator, _EventEmitter);

  var _super = _createSuper$1(Translator);

  function Translator(services) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, Translator);

    _this = _super.call(this);

    if (isIE10) {
      EventEmitter.call((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    }

    copy(['resourceStore', 'languageUtils', 'pluralResolver', 'interpolator', 'backendConnector', 'i18nFormat', 'utils'], services, (0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.options = options;

    if (_this.options.keySeparator === undefined) {
      _this.options.keySeparator = '.';
    }

    _this.logger = baseLogger.create('translator');
    return _this;
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(Translator, [{
    key: "changeLanguage",
    value: function changeLanguage(lng) {
      if (lng) this.language = lng;
    }
  }, {
    key: "exists",
    value: function exists(key) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        interpolation: {}
      };

      if (key === undefined || key === null) {
        return false;
      }

      var resolved = this.resolve(key, options);
      return resolved && resolved.res !== undefined;
    }
  }, {
    key: "extractFromKey",
    value: function extractFromKey(key, options) {
      var nsSeparator = options.nsSeparator !== undefined ? options.nsSeparator : this.options.nsSeparator;
      if (nsSeparator === undefined) nsSeparator = ':';
      var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
      var namespaces = options.ns || this.options.defaultNS || [];
      var wouldCheckForNsInKey = nsSeparator && key.indexOf(nsSeparator) > -1;
      var seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !options.keySeparator && !this.options.userDefinedNsSeparator && !options.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);

      if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
        var m = key.match(this.interpolator.nestingRegexp);

        if (m && m.length > 0) {
          return {
            key: key,
            namespaces: namespaces
          };
        }

        var parts = key.split(nsSeparator);
        if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
        key = parts.join(keySeparator);
      }

      if (typeof namespaces === 'string') namespaces = [namespaces];
      return {
        key: key,
        namespaces: namespaces
      };
    }
  }, {
    key: "translate",
    value: function translate(keys, options, lastKey) {
      var _this2 = this;

      if ((0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(options) !== 'object' && this.options.overloadTranslationOptionHandler) {
        options = this.options.overloadTranslationOptionHandler(arguments);
      }

      if (!options) options = {};
      if (keys === undefined || keys === null) return '';
      if (!Array.isArray(keys)) keys = [String(keys)];
      var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;

      var _this$extractFromKey = this.extractFromKey(keys[keys.length - 1], options),
          key = _this$extractFromKey.key,
          namespaces = _this$extractFromKey.namespaces;

      var namespace = namespaces[namespaces.length - 1];
      var lng = options.lng || this.language;
      var appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;

      if (lng && lng.toLowerCase() === 'cimode') {
        if (appendNamespaceToCIMode) {
          var nsSeparator = options.nsSeparator || this.options.nsSeparator;
          return namespace + nsSeparator + key;
        }

        return key;
      }

      var resolved = this.resolve(keys, options);
      var res = resolved && resolved.res;
      var resUsedKey = resolved && resolved.usedKey || key;
      var resExactUsedKey = resolved && resolved.exactUsedKey || key;
      var resType = Object.prototype.toString.apply(res);
      var noObject = ['[object Number]', '[object Function]', '[object RegExp]'];
      var joinArrays = options.joinArrays !== undefined ? options.joinArrays : this.options.joinArrays;
      var handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
      var handleAsObject = typeof res !== 'string' && typeof res !== 'boolean' && typeof res !== 'number';

      if (handleAsObjectInI18nFormat && res && handleAsObject && noObject.indexOf(resType) < 0 && !(typeof joinArrays === 'string' && resType === '[object Array]')) {
        if (!options.returnObjects && !this.options.returnObjects) {
          if (!this.options.returnedObjectHandler) {
            this.logger.warn('accessing an object - but returnObjects options is not enabled!');
          }

          return this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, res, _objectSpread$2(_objectSpread$2({}, options), {}, {
            ns: namespaces
          })) : "key '".concat(key, " (").concat(this.language, ")' returned an object instead of string.");
        }

        if (keySeparator) {
          var resTypeIsArray = resType === '[object Array]';
          var copy = resTypeIsArray ? [] : {};
          var newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;

          for (var m in res) {
            if (Object.prototype.hasOwnProperty.call(res, m)) {
              var deepKey = "".concat(newKeyToUse).concat(keySeparator).concat(m);
              copy[m] = this.translate(deepKey, _objectSpread$2(_objectSpread$2({}, options), {
                joinArrays: false,
                ns: namespaces
              }));
              if (copy[m] === deepKey) copy[m] = res[m];
            }
          }

          res = copy;
        }
      } else if (handleAsObjectInI18nFormat && typeof joinArrays === 'string' && resType === '[object Array]') {
        res = res.join(joinArrays);
        if (res) res = this.extendTranslation(res, keys, options, lastKey);
      } else {
        var usedDefault = false;
        var usedKey = false;
        var needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';
        var hasDefaultValue = Translator.hasDefaultValue(options);
        var defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, options) : '';
        var defaultValue = options["defaultValue".concat(defaultValueSuffix)] || options.defaultValue;

        if (!this.isValidLookup(res) && hasDefaultValue) {
          usedDefault = true;
          res = defaultValue;
        }

        if (!this.isValidLookup(res)) {
          usedKey = true;
          res = key;
        }

        var missingKeyNoValueFallbackToKey = options.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey;
        var resForMissing = missingKeyNoValueFallbackToKey && usedKey ? undefined : res;
        var updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;

        if (usedKey || usedDefault || updateMissing) {
          this.logger.log(updateMissing ? 'updateKey' : 'missingKey', lng, namespace, key, updateMissing ? defaultValue : res);

          if (keySeparator) {
            var fk = this.resolve(key, _objectSpread$2(_objectSpread$2({}, options), {}, {
              keySeparator: false
            }));
            if (fk && fk.res) this.logger.warn('Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.');
          }

          var lngs = [];
          var fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);

          if (this.options.saveMissingTo === 'fallback' && fallbackLngs && fallbackLngs[0]) {
            for (var i = 0; i < fallbackLngs.length; i++) {
              lngs.push(fallbackLngs[i]);
            }
          } else if (this.options.saveMissingTo === 'all') {
            lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
          } else {
            lngs.push(options.lng || this.language);
          }

          var send = function send(l, k, specificDefaultValue) {
            var defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;

            if (_this2.options.missingKeyHandler) {
              _this2.options.missingKeyHandler(l, namespace, k, defaultForMissing, updateMissing, options);
            } else if (_this2.backendConnector && _this2.backendConnector.saveMissing) {
              _this2.backendConnector.saveMissing(l, namespace, k, defaultForMissing, updateMissing, options);
            }

            _this2.emit('missingKey', l, namespace, k, res);
          };

          if (this.options.saveMissing) {
            if (this.options.saveMissingPlurals && needsPluralHandling) {
              lngs.forEach(function (language) {
                _this2.pluralResolver.getSuffixes(language, options).forEach(function (suffix) {
                  send([language], key + suffix, options["defaultValue".concat(suffix)] || defaultValue);
                });
              });
            } else {
              send(lngs, key, defaultValue);
            }
          }
        }

        res = this.extendTranslation(res, keys, options, resolved, lastKey);
        if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = "".concat(namespace, ":").concat(key);

        if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) {
          if (this.options.compatibilityAPI !== 'v1') {
            res = this.options.parseMissingKeyHandler(key, usedDefault ? res : undefined);
          } else {
            res = this.options.parseMissingKeyHandler(res);
          }
        }
      }

      return res;
    }
  }, {
    key: "extendTranslation",
    value: function extendTranslation(res, key, options, resolved, lastKey) {
      var _this3 = this;

      if (this.i18nFormat && this.i18nFormat.parse) {
        res = this.i18nFormat.parse(res, _objectSpread$2(_objectSpread$2({}, this.options.interpolation.defaultVariables), options), resolved.usedLng, resolved.usedNS, resolved.usedKey, {
          resolved: resolved
        });
      } else if (!options.skipInterpolation) {
        if (options.interpolation) this.interpolator.init(_objectSpread$2(_objectSpread$2({}, options), {
          interpolation: _objectSpread$2(_objectSpread$2({}, this.options.interpolation), options.interpolation)
        }));
        var skipOnVariables = typeof res === 'string' && (options && options.interpolation && options.interpolation.skipOnVariables !== undefined ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
        var nestBef;

        if (skipOnVariables) {
          var nb = res.match(this.interpolator.nestingRegexp);
          nestBef = nb && nb.length;
        }

        var data = options.replace && typeof options.replace !== 'string' ? options.replace : options;
        if (this.options.interpolation.defaultVariables) data = _objectSpread$2(_objectSpread$2({}, this.options.interpolation.defaultVariables), data);
        res = this.interpolator.interpolate(res, data, options.lng || this.language, options);

        if (skipOnVariables) {
          var na = res.match(this.interpolator.nestingRegexp);
          var nestAft = na && na.length;
          if (nestBef < nestAft) options.nest = false;
        }

        if (options.nest !== false) res = this.interpolator.nest(res, function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          if (lastKey && lastKey[0] === args[0] && !options.context) {
            _this3.logger.warn("It seems you are nesting recursively key: ".concat(args[0], " in key: ").concat(key[0]));

            return null;
          }

          return _this3.translate.apply(_this3, args.concat([key]));
        }, options);
        if (options.interpolation) this.interpolator.reset();
      }

      var postProcess = options.postProcess || this.options.postProcess;
      var postProcessorNames = typeof postProcess === 'string' ? [postProcess] : postProcess;

      if (res !== undefined && res !== null && postProcessorNames && postProcessorNames.length && options.applyPostProcessor !== false) {
        res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? _objectSpread$2({
          i18nResolved: resolved
        }, options) : options, this);
      }

      return res;
    }
  }, {
    key: "resolve",
    value: function resolve(keys) {
      var _this4 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var found;
      var usedKey;
      var exactUsedKey;
      var usedLng;
      var usedNS;
      if (typeof keys === 'string') keys = [keys];
      keys.forEach(function (k) {
        if (_this4.isValidLookup(found)) return;

        var extracted = _this4.extractFromKey(k, options);

        var key = extracted.key;
        usedKey = key;
        var namespaces = extracted.namespaces;
        if (_this4.options.fallbackNS) namespaces = namespaces.concat(_this4.options.fallbackNS);
        var needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';

        var needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0 && _this4.pluralResolver.shouldUseIntlApi();

        var needsContextHandling = options.context !== undefined && (typeof options.context === 'string' || typeof options.context === 'number') && options.context !== '';
        var codes = options.lngs ? options.lngs : _this4.languageUtils.toResolveHierarchy(options.lng || _this4.language, options.fallbackLng);
        namespaces.forEach(function (ns) {
          if (_this4.isValidLookup(found)) return;
          usedNS = ns;

          if (!checkedLoadedFor["".concat(codes[0], "-").concat(ns)] && _this4.utils && _this4.utils.hasLoadedNamespace && !_this4.utils.hasLoadedNamespace(usedNS)) {
            checkedLoadedFor["".concat(codes[0], "-").concat(ns)] = true;

            _this4.logger.warn("key \"".concat(usedKey, "\" for languages \"").concat(codes.join(', '), "\" won't get resolved as namespace \"").concat(usedNS, "\" was not yet loaded"), 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!');
          }

          codes.forEach(function (code) {
            if (_this4.isValidLookup(found)) return;
            usedLng = code;
            var finalKeys = [key];

            if (_this4.i18nFormat && _this4.i18nFormat.addLookupKeys) {
              _this4.i18nFormat.addLookupKeys(finalKeys, key, code, ns, options);
            } else {
              var pluralSuffix;
              if (needsPluralHandling) pluralSuffix = _this4.pluralResolver.getSuffix(code, options.count, options);
              var zeroSuffix = '_zero';

              if (needsPluralHandling) {
                finalKeys.push(key + pluralSuffix);

                if (needsZeroSuffixLookup) {
                  finalKeys.push(key + zeroSuffix);
                }
              }

              if (needsContextHandling) {
                var contextKey = "".concat(key).concat(_this4.options.contextSeparator).concat(options.context);
                finalKeys.push(contextKey);

                if (needsPluralHandling) {
                  finalKeys.push(contextKey + pluralSuffix);

                  if (needsZeroSuffixLookup) {
                    finalKeys.push(contextKey + zeroSuffix);
                  }
                }
              }
            }

            var possibleKey;

            while (possibleKey = finalKeys.pop()) {
              if (!_this4.isValidLookup(found)) {
                exactUsedKey = possibleKey;
                found = _this4.getResource(code, ns, possibleKey, options);
              }
            }
          });
        });
      });
      return {
        res: found,
        usedKey: usedKey,
        exactUsedKey: exactUsedKey,
        usedLng: usedLng,
        usedNS: usedNS
      };
    }
  }, {
    key: "isValidLookup",
    value: function isValidLookup(res) {
      return res !== undefined && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === '');
    }
  }, {
    key: "getResource",
    value: function getResource(code, ns, key) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      if (this.i18nFormat && this.i18nFormat.getResource) return this.i18nFormat.getResource(code, ns, key, options);
      return this.resourceStore.getResource(code, ns, key, options);
    }
  }], [{
    key: "hasDefaultValue",
    value: function hasDefaultValue(options) {
      var prefix = 'defaultValue';

      for (var option in options) {
        if (Object.prototype.hasOwnProperty.call(options, option) && prefix === option.substring(0, prefix.length) && undefined !== options[option]) {
          return true;
        }
      }

      return false;
    }
  }]);

  return Translator;
}(EventEmitter);

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var LanguageUtil = function () {
  function LanguageUtil(options) {
    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, LanguageUtil);

    this.options = options;
    this.supportedLngs = this.options.supportedLngs || false;
    this.logger = baseLogger.create('languageUtils');
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(LanguageUtil, [{
    key: "getScriptPartFromCode",
    value: function getScriptPartFromCode(code) {
      if (!code || code.indexOf('-') < 0) return null;
      var p = code.split('-');
      if (p.length === 2) return null;
      p.pop();
      if (p[p.length - 1].toLowerCase() === 'x') return null;
      return this.formatLanguageCode(p.join('-'));
    }
  }, {
    key: "getLanguagePartFromCode",
    value: function getLanguagePartFromCode(code) {
      if (!code || code.indexOf('-') < 0) return code;
      var p = code.split('-');
      return this.formatLanguageCode(p[0]);
    }
  }, {
    key: "formatLanguageCode",
    value: function formatLanguageCode(code) {
      if (typeof code === 'string' && code.indexOf('-') > -1) {
        var specialCases = ['hans', 'hant', 'latn', 'cyrl', 'cans', 'mong', 'arab'];
        var p = code.split('-');

        if (this.options.lowerCaseLng) {
          p = p.map(function (part) {
            return part.toLowerCase();
          });
        } else if (p.length === 2) {
          p[0] = p[0].toLowerCase();
          p[1] = p[1].toUpperCase();
          if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
        } else if (p.length === 3) {
          p[0] = p[0].toLowerCase();
          if (p[1].length === 2) p[1] = p[1].toUpperCase();
          if (p[0] !== 'sgn' && p[2].length === 2) p[2] = p[2].toUpperCase();
          if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
          if (specialCases.indexOf(p[2].toLowerCase()) > -1) p[2] = capitalize(p[2].toLowerCase());
        }

        return p.join('-');
      }

      return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
    }
  }, {
    key: "isSupportedCode",
    value: function isSupportedCode(code) {
      if (this.options.load === 'languageOnly' || this.options.nonExplicitSupportedLngs) {
        code = this.getLanguagePartFromCode(code);
      }

      return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code) > -1;
    }
  }, {
    key: "getBestMatchFromCodes",
    value: function getBestMatchFromCodes(codes) {
      var _this = this;

      if (!codes) return null;
      var found;
      codes.forEach(function (code) {
        if (found) return;

        var cleanedLng = _this.formatLanguageCode(code);

        if (!_this.options.supportedLngs || _this.isSupportedCode(cleanedLng)) found = cleanedLng;
      });

      if (!found && this.options.supportedLngs) {
        codes.forEach(function (code) {
          if (found) return;

          var lngOnly = _this.getLanguagePartFromCode(code);

          if (_this.isSupportedCode(lngOnly)) return found = lngOnly;
          found = _this.options.supportedLngs.find(function (supportedLng) {
            if (supportedLng.indexOf(lngOnly) === 0) return supportedLng;
          });
        });
      }

      if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
      return found;
    }
  }, {
    key: "getFallbackCodes",
    value: function getFallbackCodes(fallbacks, code) {
      if (!fallbacks) return [];
      if (typeof fallbacks === 'function') fallbacks = fallbacks(code);
      if (typeof fallbacks === 'string') fallbacks = [fallbacks];
      if (Object.prototype.toString.apply(fallbacks) === '[object Array]') return fallbacks;
      if (!code) return fallbacks["default"] || [];
      var found = fallbacks[code];
      if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
      if (!found) found = fallbacks[this.formatLanguageCode(code)];
      if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
      if (!found) found = fallbacks["default"];
      return found || [];
    }
  }, {
    key: "toResolveHierarchy",
    value: function toResolveHierarchy(code, fallbackCode) {
      var _this2 = this;

      var fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);
      var codes = [];

      var addCode = function addCode(c) {
        if (!c) return;

        if (_this2.isSupportedCode(c)) {
          codes.push(c);
        } else {
          _this2.logger.warn("rejecting language code not found in supportedLngs: ".concat(c));
        }
      };

      if (typeof code === 'string' && code.indexOf('-') > -1) {
        if (this.options.load !== 'languageOnly') addCode(this.formatLanguageCode(code));
        if (this.options.load !== 'languageOnly' && this.options.load !== 'currentOnly') addCode(this.getScriptPartFromCode(code));
        if (this.options.load !== 'currentOnly') addCode(this.getLanguagePartFromCode(code));
      } else if (typeof code === 'string') {
        addCode(this.formatLanguageCode(code));
      }

      fallbackCodes.forEach(function (fc) {
        if (codes.indexOf(fc) < 0) addCode(_this2.formatLanguageCode(fc));
      });
      return codes;
    }
  }]);

  return LanguageUtil;
}();

var sets = [{
  lngs: ['ach', 'ak', 'am', 'arn', 'br', 'fil', 'gun', 'ln', 'mfe', 'mg', 'mi', 'oc', 'pt', 'pt-BR', 'tg', 'tl', 'ti', 'tr', 'uz', 'wa'],
  nr: [1, 2],
  fc: 1
}, {
  lngs: ['af', 'an', 'ast', 'az', 'bg', 'bn', 'ca', 'da', 'de', 'dev', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fi', 'fo', 'fur', 'fy', 'gl', 'gu', 'ha', 'hi', 'hu', 'hy', 'ia', 'it', 'kk', 'kn', 'ku', 'lb', 'mai', 'ml', 'mn', 'mr', 'nah', 'nap', 'nb', 'ne', 'nl', 'nn', 'no', 'nso', 'pa', 'pap', 'pms', 'ps', 'pt-PT', 'rm', 'sco', 'se', 'si', 'so', 'son', 'sq', 'sv', 'sw', 'ta', 'te', 'tk', 'ur', 'yo'],
  nr: [1, 2],
  fc: 2
}, {
  lngs: ['ay', 'bo', 'cgg', 'fa', 'ht', 'id', 'ja', 'jbo', 'ka', 'km', 'ko', 'ky', 'lo', 'ms', 'sah', 'su', 'th', 'tt', 'ug', 'vi', 'wo', 'zh'],
  nr: [1],
  fc: 3
}, {
  lngs: ['be', 'bs', 'cnr', 'dz', 'hr', 'ru', 'sr', 'uk'],
  nr: [1, 2, 5],
  fc: 4
}, {
  lngs: ['ar'],
  nr: [0, 1, 2, 3, 11, 100],
  fc: 5
}, {
  lngs: ['cs', 'sk'],
  nr: [1, 2, 5],
  fc: 6
}, {
  lngs: ['csb', 'pl'],
  nr: [1, 2, 5],
  fc: 7
}, {
  lngs: ['cy'],
  nr: [1, 2, 3, 8],
  fc: 8
}, {
  lngs: ['fr'],
  nr: [1, 2],
  fc: 9
}, {
  lngs: ['ga'],
  nr: [1, 2, 3, 7, 11],
  fc: 10
}, {
  lngs: ['gd'],
  nr: [1, 2, 3, 20],
  fc: 11
}, {
  lngs: ['is'],
  nr: [1, 2],
  fc: 12
}, {
  lngs: ['jv'],
  nr: [0, 1],
  fc: 13
}, {
  lngs: ['kw'],
  nr: [1, 2, 3, 4],
  fc: 14
}, {
  lngs: ['lt'],
  nr: [1, 2, 10],
  fc: 15
}, {
  lngs: ['lv'],
  nr: [1, 2, 0],
  fc: 16
}, {
  lngs: ['mk'],
  nr: [1, 2],
  fc: 17
}, {
  lngs: ['mnk'],
  nr: [0, 1, 2],
  fc: 18
}, {
  lngs: ['mt'],
  nr: [1, 2, 11, 20],
  fc: 19
}, {
  lngs: ['or'],
  nr: [2, 1],
  fc: 2
}, {
  lngs: ['ro'],
  nr: [1, 2, 20],
  fc: 20
}, {
  lngs: ['sl'],
  nr: [5, 1, 2, 3],
  fc: 21
}, {
  lngs: ['he', 'iw'],
  nr: [1, 2, 20, 21],
  fc: 22
}];
var _rulesPluralsTypes = {
  1: function _(n) {
    return Number(n > 1);
  },
  2: function _(n) {
    return Number(n != 1);
  },
  3: function _(n) {
    return 0;
  },
  4: function _(n) {
    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
  },
  5: function _(n) {
    return Number(n == 0 ? 0 : n == 1 ? 1 : n == 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5);
  },
  6: function _(n) {
    return Number(n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2);
  },
  7: function _(n) {
    return Number(n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
  },
  8: function _(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : n != 8 && n != 11 ? 2 : 3);
  },
  9: function _(n) {
    return Number(n >= 2);
  },
  10: function _(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : n < 7 ? 2 : n < 11 ? 3 : 4);
  },
  11: function _(n) {
    return Number(n == 1 || n == 11 ? 0 : n == 2 || n == 12 ? 1 : n > 2 && n < 20 ? 2 : 3);
  },
  12: function _(n) {
    return Number(n % 10 != 1 || n % 100 == 11);
  },
  13: function _(n) {
    return Number(n !== 0);
  },
  14: function _(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : n == 3 ? 2 : 3);
  },
  15: function _(n) {
    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
  },
  16: function _(n) {
    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n !== 0 ? 1 : 2);
  },
  17: function _(n) {
    return Number(n == 1 || n % 10 == 1 && n % 100 != 11 ? 0 : 1);
  },
  18: function _(n) {
    return Number(n == 0 ? 0 : n == 1 ? 1 : 2);
  },
  19: function _(n) {
    return Number(n == 1 ? 0 : n == 0 || n % 100 > 1 && n % 100 < 11 ? 1 : n % 100 > 10 && n % 100 < 20 ? 2 : 3);
  },
  20: function _(n) {
    return Number(n == 1 ? 0 : n == 0 || n % 100 > 0 && n % 100 < 20 ? 1 : 2);
  },
  21: function _(n) {
    return Number(n % 100 == 1 ? 1 : n % 100 == 2 ? 2 : n % 100 == 3 || n % 100 == 4 ? 3 : 0);
  },
  22: function _(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : (n < 0 || n > 10) && n % 10 == 0 ? 2 : 3);
  }
};
var deprecatedJsonVersions = ['v1', 'v2', 'v3'];
var suffixesOrder = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
};

function createRules() {
  var rules = {};
  sets.forEach(function (set) {
    set.lngs.forEach(function (l) {
      rules[l] = {
        numbers: set.nr,
        plurals: _rulesPluralsTypes[set.fc]
      };
    });
  });
  return rules;
}

var PluralResolver = function () {
  function PluralResolver(languageUtils) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, PluralResolver);

    this.languageUtils = languageUtils;
    this.options = options;
    this.logger = baseLogger.create('pluralResolver');

    if ((!this.options.compatibilityJSON || this.options.compatibilityJSON === 'v4') && (typeof Intl === 'undefined' || !Intl.PluralRules)) {
      this.options.compatibilityJSON = 'v3';
      this.logger.error('Your environment seems not to be Intl API compatible, use an Intl.PluralRules polyfill. Will fallback to the compatibilityJSON v3 format handling.');
    }

    this.rules = createRules();
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(PluralResolver, [{
    key: "addRule",
    value: function addRule(lng, obj) {
      this.rules[lng] = obj;
    }
  }, {
    key: "getRule",
    value: function getRule(code) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (this.shouldUseIntlApi()) {
        try {
          return new Intl.PluralRules(code, {
            type: options.ordinal ? 'ordinal' : 'cardinal'
          });
        } catch (_unused) {
          return;
        }
      }

      return this.rules[code] || this.rules[this.languageUtils.getLanguagePartFromCode(code)];
    }
  }, {
    key: "needsPlural",
    value: function needsPlural(code) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var rule = this.getRule(code, options);

      if (this.shouldUseIntlApi()) {
        return rule && rule.resolvedOptions().pluralCategories.length > 1;
      }

      return rule && rule.numbers.length > 1;
    }
  }, {
    key: "getPluralFormsOfKey",
    value: function getPluralFormsOfKey(code, key) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.getSuffixes(code, options).map(function (suffix) {
        return "".concat(key).concat(suffix);
      });
    }
  }, {
    key: "getSuffixes",
    value: function getSuffixes(code) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var rule = this.getRule(code, options);

      if (!rule) {
        return [];
      }

      if (this.shouldUseIntlApi()) {
        return rule.resolvedOptions().pluralCategories.sort(function (pluralCategory1, pluralCategory2) {
          return suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2];
        }).map(function (pluralCategory) {
          return "".concat(_this.options.prepend).concat(pluralCategory);
        });
      }

      return rule.numbers.map(function (number) {
        return _this.getSuffix(code, number, options);
      });
    }
  }, {
    key: "getSuffix",
    value: function getSuffix(code, count) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var rule = this.getRule(code, options);

      if (rule) {
        if (this.shouldUseIntlApi()) {
          return "".concat(this.options.prepend).concat(rule.select(count));
        }

        return this.getSuffixRetroCompatible(rule, count);
      }

      this.logger.warn("no plural rule found for: ".concat(code));
      return '';
    }
  }, {
    key: "getSuffixRetroCompatible",
    value: function getSuffixRetroCompatible(rule, count) {
      var _this2 = this;

      var idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count));
      var suffix = rule.numbers[idx];

      if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
        if (suffix === 2) {
          suffix = 'plural';
        } else if (suffix === 1) {
          suffix = '';
        }
      }

      var returnSuffix = function returnSuffix() {
        return _this2.options.prepend && suffix.toString() ? _this2.options.prepend + suffix.toString() : suffix.toString();
      };

      if (this.options.compatibilityJSON === 'v1') {
        if (suffix === 1) return '';
        if (typeof suffix === 'number') return "_plural_".concat(suffix.toString());
        return returnSuffix();
      } else if (this.options.compatibilityJSON === 'v2') {
        return returnSuffix();
      } else if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
        return returnSuffix();
      }

      return this.options.prepend && idx.toString() ? this.options.prepend + idx.toString() : idx.toString();
    }
  }, {
    key: "shouldUseIntlApi",
    value: function shouldUseIntlApi() {
      return !deprecatedJsonVersions.includes(this.options.compatibilityJSON);
    }
  }]);

  return PluralResolver;
}();

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Interpolator = function () {
  function Interpolator() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, Interpolator);

    this.logger = baseLogger.create('interpolator');
    this.options = options;

    this.format = options.interpolation && options.interpolation.format || function (value) {
      return value;
    };

    this.init(options);
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(Interpolator, [{
    key: "init",
    value: function init() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (!options.interpolation) options.interpolation = {
        escapeValue: true
      };
      var iOpts = options.interpolation;
      this.escape = iOpts.escape !== undefined ? iOpts.escape : escape;
      this.escapeValue = iOpts.escapeValue !== undefined ? iOpts.escapeValue : true;
      this.useRawValueToEscape = iOpts.useRawValueToEscape !== undefined ? iOpts.useRawValueToEscape : false;
      this.prefix = iOpts.prefix ? regexEscape(iOpts.prefix) : iOpts.prefixEscaped || '{{';
      this.suffix = iOpts.suffix ? regexEscape(iOpts.suffix) : iOpts.suffixEscaped || '}}';
      this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ',';
      this.unescapePrefix = iOpts.unescapeSuffix ? '' : iOpts.unescapePrefix || '-';
      this.unescapeSuffix = this.unescapePrefix ? '' : iOpts.unescapeSuffix || '';
      this.nestingPrefix = iOpts.nestingPrefix ? regexEscape(iOpts.nestingPrefix) : iOpts.nestingPrefixEscaped || regexEscape('$t(');
      this.nestingSuffix = iOpts.nestingSuffix ? regexEscape(iOpts.nestingSuffix) : iOpts.nestingSuffixEscaped || regexEscape(')');
      this.nestingOptionsSeparator = iOpts.nestingOptionsSeparator ? iOpts.nestingOptionsSeparator : iOpts.nestingOptionsSeparator || ',';
      this.maxReplaces = iOpts.maxReplaces ? iOpts.maxReplaces : 1000;
      this.alwaysFormat = iOpts.alwaysFormat !== undefined ? iOpts.alwaysFormat : false;
      this.resetRegExp();
    }
  }, {
    key: "reset",
    value: function reset() {
      if (this.options) this.init(this.options);
    }
  }, {
    key: "resetRegExp",
    value: function resetRegExp() {
      var regexpStr = "".concat(this.prefix, "(.+?)").concat(this.suffix);
      this.regexp = new RegExp(regexpStr, 'g');
      var regexpUnescapeStr = "".concat(this.prefix).concat(this.unescapePrefix, "(.+?)").concat(this.unescapeSuffix).concat(this.suffix);
      this.regexpUnescape = new RegExp(regexpUnescapeStr, 'g');
      var nestingRegexpStr = "".concat(this.nestingPrefix, "(.+?)").concat(this.nestingSuffix);
      this.nestingRegexp = new RegExp(nestingRegexpStr, 'g');
    }
  }, {
    key: "interpolate",
    value: function interpolate(str, data, lng, options) {
      var _this = this;

      var match;
      var value;
      var replaces;
      var defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};

      function regexSafe(val) {
        return val.replace(/\$/g, '$$$$');
      }

      var handleFormat = function handleFormat(key) {
        if (key.indexOf(_this.formatSeparator) < 0) {
          var path = getPathWithDefaults(data, defaultData, key);
          return _this.alwaysFormat ? _this.format(path, undefined, lng, _objectSpread$3(_objectSpread$3(_objectSpread$3({}, options), data), {}, {
            interpolationkey: key
          })) : path;
        }

        var p = key.split(_this.formatSeparator);
        var k = p.shift().trim();
        var f = p.join(_this.formatSeparator).trim();
        return _this.format(getPathWithDefaults(data, defaultData, k), f, lng, _objectSpread$3(_objectSpread$3(_objectSpread$3({}, options), data), {}, {
          interpolationkey: k
        }));
      };

      this.resetRegExp();
      var missingInterpolationHandler = options && options.missingInterpolationHandler || this.options.missingInterpolationHandler;
      var skipOnVariables = options && options.interpolation && options.interpolation.skipOnVariables !== undefined ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
      var todos = [{
        regex: this.regexpUnescape,
        safeValue: function safeValue(val) {
          return regexSafe(val);
        }
      }, {
        regex: this.regexp,
        safeValue: function safeValue(val) {
          return _this.escapeValue ? regexSafe(_this.escape(val)) : regexSafe(val);
        }
      }];
      todos.forEach(function (todo) {
        replaces = 0;

        while (match = todo.regex.exec(str)) {
          var matchedVar = match[1].trim();
          value = handleFormat(matchedVar);

          if (value === undefined) {
            if (typeof missingInterpolationHandler === 'function') {
              var temp = missingInterpolationHandler(str, match, options);
              value = typeof temp === 'string' ? temp : '';
            } else if (options && options.hasOwnProperty(matchedVar)) {
              value = '';
            } else if (skipOnVariables) {
              value = match[0];
              continue;
            } else {
              _this.logger.warn("missed to pass in variable ".concat(matchedVar, " for interpolating ").concat(str));

              value = '';
            }
          } else if (typeof value !== 'string' && !_this.useRawValueToEscape) {
            value = makeString(value);
          }

          var safeValue = todo.safeValue(value);
          str = str.replace(match[0], safeValue);

          if (skipOnVariables) {
            todo.regex.lastIndex += safeValue.length;
            todo.regex.lastIndex -= match[0].length;
          } else {
            todo.regex.lastIndex = 0;
          }

          replaces++;

          if (replaces >= _this.maxReplaces) {
            break;
          }
        }
      });
      return str;
    }
  }, {
    key: "nest",
    value: function nest(str, fc) {
      var _this2 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var match;
      var value;

      var clonedOptions = _objectSpread$3({}, options);

      clonedOptions.applyPostProcessor = false;
      delete clonedOptions.defaultValue;

      function handleHasOptions(key, inheritedOptions) {
        var sep = this.nestingOptionsSeparator;
        if (key.indexOf(sep) < 0) return key;
        var c = key.split(new RegExp("".concat(sep, "[ ]*{")));
        var optionsString = "{".concat(c[1]);
        key = c[0];
        optionsString = this.interpolate(optionsString, clonedOptions);
        optionsString = optionsString.replace(/'/g, '"');

        try {
          clonedOptions = JSON.parse(optionsString);
          if (inheritedOptions) clonedOptions = _objectSpread$3(_objectSpread$3({}, inheritedOptions), clonedOptions);
        } catch (e) {
          this.logger.warn("failed parsing options string in nesting for key ".concat(key), e);
          return "".concat(key).concat(sep).concat(optionsString);
        }

        delete clonedOptions.defaultValue;
        return key;
      }

      while (match = this.nestingRegexp.exec(str)) {
        var formatters = [];
        var doReduce = false;

        if (match[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(match[1])) {
          var r = match[1].split(this.formatSeparator).map(function (elem) {
            return elem.trim();
          });
          match[1] = r.shift();
          formatters = r;
          doReduce = true;
        }

        value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
        if (value && match[0] === str && typeof value !== 'string') return value;
        if (typeof value !== 'string') value = makeString(value);

        if (!value) {
          this.logger.warn("missed to resolve ".concat(match[1], " for nesting ").concat(str));
          value = '';
        }

        if (doReduce) {
          value = formatters.reduce(function (v, f) {
            return _this2.format(v, f, options.lng, _objectSpread$3(_objectSpread$3({}, options), {}, {
              interpolationkey: match[1].trim()
            }));
          }, value.trim());
        }

        str = str.replace(match[0], value);
        this.regexp.lastIndex = 0;
      }

      return str;
    }
  }]);

  return Interpolator;
}();

function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(Object(source), true).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function parseFormatStr(formatStr) {
  var formatName = formatStr.toLowerCase().trim();
  var formatOptions = {};

  if (formatStr.indexOf('(') > -1) {
    var p = formatStr.split('(');
    formatName = p[0].toLowerCase().trim();
    var optStr = p[1].substring(0, p[1].length - 1);

    if (formatName === 'currency' && optStr.indexOf(':') < 0) {
      if (!formatOptions.currency) formatOptions.currency = optStr.trim();
    } else if (formatName === 'relativetime' && optStr.indexOf(':') < 0) {
      if (!formatOptions.range) formatOptions.range = optStr.trim();
    } else {
      var opts = optStr.split(';');
      opts.forEach(function (opt) {
        if (!opt) return;

        var _opt$split = opt.split(':'),
            _opt$split2 = (0,_babel_runtime_helpers_esm_toArray__WEBPACK_IMPORTED_MODULE_8__["default"])(_opt$split),
            key = _opt$split2[0],
            rest = _opt$split2.slice(1);

        var val = rest.join(':');
        if (!formatOptions[key.trim()]) formatOptions[key.trim()] = val.trim();
        if (val.trim() === 'false') formatOptions[key.trim()] = false;
        if (val.trim() === 'true') formatOptions[key.trim()] = true;
        if (!isNaN(val.trim())) formatOptions[key.trim()] = parseInt(val.trim(), 10);
      });
    }
  }

  return {
    formatName: formatName,
    formatOptions: formatOptions
  };
}

var Formatter = function () {
  function Formatter() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, Formatter);

    this.logger = baseLogger.create('formatter');
    this.options = options;
    this.formats = {
      number: function number(val, lng, options) {
        return new Intl.NumberFormat(lng, options).format(val);
      },
      currency: function currency(val, lng, options) {
        return new Intl.NumberFormat(lng, _objectSpread$4(_objectSpread$4({}, options), {}, {
          style: 'currency'
        })).format(val);
      },
      datetime: function datetime(val, lng, options) {
        return new Intl.DateTimeFormat(lng, _objectSpread$4({}, options)).format(val);
      },
      relativetime: function relativetime(val, lng, options) {
        return new Intl.RelativeTimeFormat(lng, _objectSpread$4({}, options)).format(val, options.range || 'day');
      },
      list: function list(val, lng, options) {
        return new Intl.ListFormat(lng, _objectSpread$4({}, options)).format(val);
      }
    };
    this.init(options);
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(Formatter, [{
    key: "init",
    value: function init(services) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        interpolation: {}
      };
      var iOpts = options.interpolation;
      this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ',';
    }
  }, {
    key: "add",
    value: function add(name, fc) {
      this.formats[name.toLowerCase().trim()] = fc;
    }
  }, {
    key: "format",
    value: function format(value, _format, lng, options) {
      var _this = this;

      var formats = _format.split(this.formatSeparator);

      var result = formats.reduce(function (mem, f) {
        var _parseFormatStr = parseFormatStr(f),
            formatName = _parseFormatStr.formatName,
            formatOptions = _parseFormatStr.formatOptions;

        if (_this.formats[formatName]) {
          var formatted = mem;

          try {
            var valOptions = options && options.formatParams && options.formatParams[options.interpolationkey] || {};
            var l = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
            formatted = _this.formats[formatName](mem, l, _objectSpread$4(_objectSpread$4(_objectSpread$4({}, formatOptions), options), valOptions));
          } catch (error) {
            _this.logger.warn(error);
          }

          return formatted;
        } else {
          _this.logger.warn("there was no format function for ".concat(formatName));
        }

        return mem;
      }, value);
      return result;
    }
  }]);

  return Formatter;
}();

function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$5(Object(source), true).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(this, result); }; }

function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function remove(arr, what) {
  var found = arr.indexOf(what);

  while (found !== -1) {
    arr.splice(found, 1);
    found = arr.indexOf(what);
  }
}

var Connector = function (_EventEmitter) {
  (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Connector, _EventEmitter);

  var _super = _createSuper$2(Connector);

  function Connector(backend, store, services) {
    var _this;

    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, Connector);

    _this = _super.call(this);

    if (isIE10) {
      EventEmitter.call((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    }

    _this.backend = backend;
    _this.store = store;
    _this.services = services;
    _this.languageUtils = services.languageUtils;
    _this.options = options;
    _this.logger = baseLogger.create('backendConnector');
    _this.state = {};
    _this.queue = [];

    if (_this.backend && _this.backend.init) {
      _this.backend.init(services, options.backend, options);
    }

    return _this;
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(Connector, [{
    key: "queueLoad",
    value: function queueLoad(languages, namespaces, options, callback) {
      var _this2 = this;

      var toLoad = [];
      var pending = [];
      var toLoadLanguages = [];
      var toLoadNamespaces = [];
      languages.forEach(function (lng) {
        var hasAllNamespaces = true;
        namespaces.forEach(function (ns) {
          var name = "".concat(lng, "|").concat(ns);

          if (!options.reload && _this2.store.hasResourceBundle(lng, ns)) {
            _this2.state[name] = 2;
          } else if (_this2.state[name] < 0) ; else if (_this2.state[name] === 1) {
            if (pending.indexOf(name) < 0) pending.push(name);
          } else {
            _this2.state[name] = 1;
            hasAllNamespaces = false;
            if (pending.indexOf(name) < 0) pending.push(name);
            if (toLoad.indexOf(name) < 0) toLoad.push(name);
            if (toLoadNamespaces.indexOf(ns) < 0) toLoadNamespaces.push(ns);
          }
        });
        if (!hasAllNamespaces) toLoadLanguages.push(lng);
      });

      if (toLoad.length || pending.length) {
        this.queue.push({
          pending: pending,
          loaded: {},
          errors: [],
          callback: callback
        });
      }

      return {
        toLoad: toLoad,
        pending: pending,
        toLoadLanguages: toLoadLanguages,
        toLoadNamespaces: toLoadNamespaces
      };
    }
  }, {
    key: "loaded",
    value: function loaded(name, err, data) {
      var s = name.split('|');
      var lng = s[0];
      var ns = s[1];
      if (err) this.emit('failedLoading', lng, ns, err);

      if (data) {
        this.store.addResourceBundle(lng, ns, data);
      }

      this.state[name] = err ? -1 : 2;
      var loaded = {};
      this.queue.forEach(function (q) {
        pushPath(q.loaded, [lng], ns);
        remove(q.pending, name);
        if (err) q.errors.push(err);

        if (q.pending.length === 0 && !q.done) {
          Object.keys(q.loaded).forEach(function (l) {
            if (!loaded[l]) loaded[l] = [];

            if (q.loaded[l].length) {
              q.loaded[l].forEach(function (ns) {
                if (loaded[l].indexOf(ns) < 0) loaded[l].push(ns);
              });
            }
          });
          q.done = true;

          if (q.errors.length) {
            q.callback(q.errors);
          } else {
            q.callback();
          }
        }
      });
      this.emit('loaded', loaded);
      this.queue = this.queue.filter(function (q) {
        return !q.done;
      });
    }
  }, {
    key: "read",
    value: function read(lng, ns, fcName) {
      var _this3 = this;

      var tried = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var wait = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 350;
      var callback = arguments.length > 5 ? arguments[5] : undefined;
      if (!lng.length) return callback(null, {});
      return this.backend[fcName](lng, ns, function (err, data) {
        if (err && data && tried < 5) {
          setTimeout(function () {
            _this3.read.call(_this3, lng, ns, fcName, tried + 1, wait * 2, callback);
          }, wait);
          return;
        }

        callback(err, data);
      });
    }
  }, {
    key: "prepareLoading",
    value: function prepareLoading(languages, namespaces) {
      var _this4 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var callback = arguments.length > 3 ? arguments[3] : undefined;

      if (!this.backend) {
        this.logger.warn('No backend was added via i18next.use. Will not load resources.');
        return callback && callback();
      }

      if (typeof languages === 'string') languages = this.languageUtils.toResolveHierarchy(languages);
      if (typeof namespaces === 'string') namespaces = [namespaces];
      var toLoad = this.queueLoad(languages, namespaces, options, callback);

      if (!toLoad.toLoad.length) {
        if (!toLoad.pending.length) callback();
        return null;
      }

      toLoad.toLoad.forEach(function (name) {
        _this4.loadOne(name);
      });
    }
  }, {
    key: "load",
    value: function load(languages, namespaces, callback) {
      this.prepareLoading(languages, namespaces, {}, callback);
    }
  }, {
    key: "reload",
    value: function reload(languages, namespaces, callback) {
      this.prepareLoading(languages, namespaces, {
        reload: true
      }, callback);
    }
  }, {
    key: "loadOne",
    value: function loadOne(name) {
      var _this5 = this;

      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var s = name.split('|');
      var lng = s[0];
      var ns = s[1];
      this.read(lng, ns, 'read', undefined, undefined, function (err, data) {
        if (err) _this5.logger.warn("".concat(prefix, "loading namespace ").concat(ns, " for language ").concat(lng, " failed"), err);
        if (!err && data) _this5.logger.log("".concat(prefix, "loaded namespace ").concat(ns, " for language ").concat(lng), data);

        _this5.loaded(name, err, data);
      });
    }
  }, {
    key: "saveMissing",
    value: function saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
      var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

      if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(namespace)) {
        this.logger.warn("did not save key \"".concat(key, "\" as the namespace \"").concat(namespace, "\" was not yet loaded"), 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!');
        return;
      }

      if (key === undefined || key === null || key === '') return;

      if (this.backend && this.backend.create) {
        this.backend.create(languages, namespace, key, fallbackValue, null, _objectSpread$5(_objectSpread$5({}, options), {}, {
          isUpdate: isUpdate
        }));
      }

      if (!languages || !languages[0]) return;
      this.store.addResource(languages[0], namespace, key, fallbackValue);
    }
  }]);

  return Connector;
}(EventEmitter);

function get() {
  return {
    debug: false,
    initImmediate: true,
    ns: ['translation'],
    defaultNS: ['translation'],
    fallbackLng: ['dev'],
    fallbackNS: false,
    supportedLngs: false,
    nonExplicitSupportedLngs: false,
    load: 'all',
    preload: false,
    simplifyPluralSuffix: true,
    keySeparator: '.',
    nsSeparator: ':',
    pluralSeparator: '_',
    contextSeparator: '_',
    partialBundledLanguages: false,
    saveMissing: false,
    updateMissing: false,
    saveMissingTo: 'fallback',
    saveMissingPlurals: true,
    missingKeyHandler: false,
    missingInterpolationHandler: false,
    postProcess: false,
    postProcessPassResolved: false,
    returnNull: true,
    returnEmptyString: true,
    returnObjects: false,
    joinArrays: false,
    returnedObjectHandler: false,
    parseMissingKeyHandler: false,
    appendNamespaceToMissingKey: false,
    appendNamespaceToCIMode: false,
    overloadTranslationOptionHandler: function handle(args) {
      var ret = {};
      if ((0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(args[1]) === 'object') ret = args[1];
      if (typeof args[1] === 'string') ret.defaultValue = args[1];
      if (typeof args[2] === 'string') ret.tDescription = args[2];

      if ((0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(args[2]) === 'object' || (0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(args[3]) === 'object') {
        var options = args[3] || args[2];
        Object.keys(options).forEach(function (key) {
          ret[key] = options[key];
        });
      }

      return ret;
    },
    interpolation: {
      escapeValue: true,
      format: function format(value, _format, lng, options) {
        return value;
      },
      prefix: '{{',
      suffix: '}}',
      formatSeparator: ',',
      unescapePrefix: '-',
      nestingPrefix: '$t(',
      nestingSuffix: ')',
      nestingOptionsSeparator: ',',
      maxReplaces: 1000,
      skipOnVariables: true
    }
  };
}
function transformOptions(options) {
  if (typeof options.ns === 'string') options.ns = [options.ns];
  if (typeof options.fallbackLng === 'string') options.fallbackLng = [options.fallbackLng];
  if (typeof options.fallbackNS === 'string') options.fallbackNS = [options.fallbackNS];

  if (options.supportedLngs && options.supportedLngs.indexOf('cimode') < 0) {
    options.supportedLngs = options.supportedLngs.concat(['cimode']);
  }

  return options;
}

function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$6(Object(source), true).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper$3(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(this, result); }; }

function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function noop() {}

function bindMemberFunctions(inst) {
  var mems = Object.getOwnPropertyNames(Object.getPrototypeOf(inst));
  mems.forEach(function (mem) {
    if (typeof inst[mem] === 'function') {
      inst[mem] = inst[mem].bind(inst);
    }
  });
}

var I18n = function (_EventEmitter) {
  (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(I18n, _EventEmitter);

  var _super = _createSuper$3(I18n);

  function I18n() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var callback = arguments.length > 1 ? arguments[1] : undefined;

    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, I18n);

    _this = _super.call(this);

    if (isIE10) {
      EventEmitter.call((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    }

    _this.options = transformOptions(options);
    _this.services = {};
    _this.logger = baseLogger;
    _this.modules = {
      external: []
    };
    bindMemberFunctions((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));

    if (callback && !_this.isInitialized && !options.isClone) {
      if (!_this.options.initImmediate) {
        _this.init(options, callback);

        return (0,_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(_this, (0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
      }

      setTimeout(function () {
        _this.init(options, callback);
      }, 0);
    }

    return _this;
  }

  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(I18n, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments.length > 1 ? arguments[1] : undefined;

      if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      if (!options.defaultNS && options.ns) {
        if (typeof options.ns === 'string') {
          options.defaultNS = options.ns;
        } else if (options.ns.indexOf('translation') < 0) {
          options.defaultNS = options.ns[0];
        }
      }

      var defOpts = get();
      this.options = _objectSpread$6(_objectSpread$6(_objectSpread$6({}, defOpts), this.options), transformOptions(options));

      if (this.options.compatibilityAPI !== 'v1') {
        this.options.interpolation = _objectSpread$6(_objectSpread$6({}, defOpts.interpolation), this.options.interpolation);
      }

      if (options.keySeparator !== undefined) {
        this.options.userDefinedKeySeparator = options.keySeparator;
      }

      if (options.nsSeparator !== undefined) {
        this.options.userDefinedNsSeparator = options.nsSeparator;
      }

      function createClassOnDemand(ClassOrObject) {
        if (!ClassOrObject) return null;
        if (typeof ClassOrObject === 'function') return new ClassOrObject();
        return ClassOrObject;
      }

      if (!this.options.isClone) {
        if (this.modules.logger) {
          baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
        } else {
          baseLogger.init(null, this.options);
        }

        var formatter;

        if (this.modules.formatter) {
          formatter = this.modules.formatter;
        } else if (typeof Intl !== 'undefined') {
          formatter = Formatter;
        }

        var lu = new LanguageUtil(this.options);
        this.store = new ResourceStore(this.options.resources, this.options);
        var s = this.services;
        s.logger = baseLogger;
        s.resourceStore = this.store;
        s.languageUtils = lu;
        s.pluralResolver = new PluralResolver(lu, {
          prepend: this.options.pluralSeparator,
          compatibilityJSON: this.options.compatibilityJSON,
          simplifyPluralSuffix: this.options.simplifyPluralSuffix
        });

        if (formatter && (!this.options.interpolation.format || this.options.interpolation.format === defOpts.interpolation.format)) {
          s.formatter = createClassOnDemand(formatter);
          s.formatter.init(s, this.options);
          this.options.interpolation.format = s.formatter.format.bind(s.formatter);
        }

        s.interpolator = new Interpolator(this.options);
        s.utils = {
          hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
        };
        s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
        s.backendConnector.on('*', function (event) {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          _this2.emit.apply(_this2, [event].concat(args));
        });

        if (this.modules.languageDetector) {
          s.languageDetector = createClassOnDemand(this.modules.languageDetector);
          s.languageDetector.init(s, this.options.detection, this.options);
        }

        if (this.modules.i18nFormat) {
          s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
          if (s.i18nFormat.init) s.i18nFormat.init(this);
        }

        this.translator = new Translator(this.services, this.options);
        this.translator.on('*', function (event) {
          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          _this2.emit.apply(_this2, [event].concat(args));
        });
        this.modules.external.forEach(function (m) {
          if (m.init) m.init(_this2);
        });
      }

      this.format = this.options.interpolation.format;
      if (!callback) callback = noop;

      if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
        var codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
        if (codes.length > 0 && codes[0] !== 'dev') this.options.lng = codes[0];
      }

      if (!this.services.languageDetector && !this.options.lng) {
        this.logger.warn('init: no languageDetector is used and no lng is defined');
      }

      var storeApi = ['getResource', 'hasResourceBundle', 'getResourceBundle', 'getDataByLanguage'];
      storeApi.forEach(function (fcName) {
        _this2[fcName] = function () {
          var _this2$store;

          return (_this2$store = _this2.store)[fcName].apply(_this2$store, arguments);
        };
      });
      var storeApiChained = ['addResource', 'addResources', 'addResourceBundle', 'removeResourceBundle'];
      storeApiChained.forEach(function (fcName) {
        _this2[fcName] = function () {
          var _this2$store2;

          (_this2$store2 = _this2.store)[fcName].apply(_this2$store2, arguments);

          return _this2;
        };
      });
      var deferred = defer();

      var load = function load() {
        var finish = function finish(err, t) {
          if (_this2.isInitialized && !_this2.initializedStoreOnce) _this2.logger.warn('init: i18next is already initialized. You should call init just once!');
          _this2.isInitialized = true;
          if (!_this2.options.isClone) _this2.logger.log('initialized', _this2.options);

          _this2.emit('initialized', _this2.options);

          deferred.resolve(t);
          callback(err, t);
        };

        if (_this2.languages && _this2.options.compatibilityAPI !== 'v1' && !_this2.isInitialized) return finish(null, _this2.t.bind(_this2));

        _this2.changeLanguage(_this2.options.lng, finish);
      };

      if (this.options.resources || !this.options.initImmediate) {
        load();
      } else {
        setTimeout(load, 0);
      }

      return deferred;
    }
  }, {
    key: "loadResources",
    value: function loadResources(language) {
      var _this3 = this;

      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
      var usedCallback = callback;
      var usedLng = typeof language === 'string' ? language : this.language;
      if (typeof language === 'function') usedCallback = language;

      if (!this.options.resources || this.options.partialBundledLanguages) {
        if (usedLng && usedLng.toLowerCase() === 'cimode') return usedCallback();
        var toLoad = [];

        var append = function append(lng) {
          if (!lng) return;

          var lngs = _this3.services.languageUtils.toResolveHierarchy(lng);

          lngs.forEach(function (l) {
            if (toLoad.indexOf(l) < 0) toLoad.push(l);
          });
        };

        if (!usedLng) {
          var fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
          fallbacks.forEach(function (l) {
            return append(l);
          });
        } else {
          append(usedLng);
        }

        if (this.options.preload) {
          this.options.preload.forEach(function (l) {
            return append(l);
          });
        }

        this.services.backendConnector.load(toLoad, this.options.ns, function (e) {
          if (!e && !_this3.resolvedLanguage && _this3.language) _this3.setResolvedLanguage(_this3.language);
          usedCallback(e);
        });
      } else {
        usedCallback(null);
      }
    }
  }, {
    key: "reloadResources",
    value: function reloadResources(lngs, ns, callback) {
      var deferred = defer();
      if (!lngs) lngs = this.languages;
      if (!ns) ns = this.options.ns;
      if (!callback) callback = noop;
      this.services.backendConnector.reload(lngs, ns, function (err) {
        deferred.resolve();
        callback(err);
      });
      return deferred;
    }
  }, {
    key: "use",
    value: function use(module) {
      if (!module) throw new Error('You are passing an undefined module! Please check the object you are passing to i18next.use()');
      if (!module.type) throw new Error('You are passing a wrong module! Please check the object you are passing to i18next.use()');

      if (module.type === 'backend') {
        this.modules.backend = module;
      }

      if (module.type === 'logger' || module.log && module.warn && module.error) {
        this.modules.logger = module;
      }

      if (module.type === 'languageDetector') {
        this.modules.languageDetector = module;
      }

      if (module.type === 'i18nFormat') {
        this.modules.i18nFormat = module;
      }

      if (module.type === 'postProcessor') {
        postProcessor.addPostProcessor(module);
      }

      if (module.type === 'formatter') {
        this.modules.formatter = module;
      }

      if (module.type === '3rdParty') {
        this.modules.external.push(module);
      }

      return this;
    }
  }, {
    key: "setResolvedLanguage",
    value: function setResolvedLanguage(l) {
      if (!l || !this.languages) return;
      if (['cimode', 'dev'].indexOf(l) > -1) return;

      for (var li = 0; li < this.languages.length; li++) {
        var lngInLngs = this.languages[li];
        if (['cimode', 'dev'].indexOf(lngInLngs) > -1) continue;

        if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
          this.resolvedLanguage = lngInLngs;
          break;
        }
      }
    }
  }, {
    key: "changeLanguage",
    value: function changeLanguage(lng, callback) {
      var _this4 = this;

      this.isLanguageChangingTo = lng;
      var deferred = defer();
      this.emit('languageChanging', lng);

      var setLngProps = function setLngProps(l) {
        _this4.language = l;
        _this4.languages = _this4.services.languageUtils.toResolveHierarchy(l);
        _this4.resolvedLanguage = undefined;

        _this4.setResolvedLanguage(l);
      };

      var done = function done(err, l) {
        if (l) {
          setLngProps(l);

          _this4.translator.changeLanguage(l);

          _this4.isLanguageChangingTo = undefined;

          _this4.emit('languageChanged', l);

          _this4.logger.log('languageChanged', l);
        } else {
          _this4.isLanguageChangingTo = undefined;
        }

        deferred.resolve(function () {
          return _this4.t.apply(_this4, arguments);
        });
        if (callback) callback(err, function () {
          return _this4.t.apply(_this4, arguments);
        });
      };

      var setLng = function setLng(lngs) {
        if (!lng && !lngs && _this4.services.languageDetector) lngs = [];
        var l = typeof lngs === 'string' ? lngs : _this4.services.languageUtils.getBestMatchFromCodes(lngs);

        if (l) {
          if (!_this4.language) {
            setLngProps(l);
          }

          if (!_this4.translator.language) _this4.translator.changeLanguage(l);
          if (_this4.services.languageDetector) _this4.services.languageDetector.cacheUserLanguage(l);
        }

        _this4.loadResources(l, function (err) {
          done(err, l);
        });
      };

      if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
        setLng(this.services.languageDetector.detect());
      } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
        this.services.languageDetector.detect(setLng);
      } else {
        setLng(lng);
      }

      return deferred;
    }
  }, {
    key: "getFixedT",
    value: function getFixedT(lng, ns, keyPrefix) {
      var _this5 = this;

      var fixedT = function fixedT(key, opts) {
        var options;

        if ((0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(opts) !== 'object') {
          for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
            rest[_key3 - 2] = arguments[_key3];
          }

          options = _this5.options.overloadTranslationOptionHandler([key, opts].concat(rest));
        } else {
          options = _objectSpread$6({}, opts);
        }

        options.lng = options.lng || fixedT.lng;
        options.lngs = options.lngs || fixedT.lngs;
        options.ns = options.ns || fixedT.ns;
        var keySeparator = _this5.options.keySeparator || '.';
        var resultKey = keyPrefix ? "".concat(keyPrefix).concat(keySeparator).concat(key) : key;
        return _this5.t(resultKey, options);
      };

      if (typeof lng === 'string') {
        fixedT.lng = lng;
      } else {
        fixedT.lngs = lng;
      }

      fixedT.ns = ns;
      fixedT.keyPrefix = keyPrefix;
      return fixedT;
    }
  }, {
    key: "t",
    value: function t() {
      var _this$translator;

      return this.translator && (_this$translator = this.translator).translate.apply(_this$translator, arguments);
    }
  }, {
    key: "exists",
    value: function exists() {
      var _this$translator2;

      return this.translator && (_this$translator2 = this.translator).exists.apply(_this$translator2, arguments);
    }
  }, {
    key: "setDefaultNamespace",
    value: function setDefaultNamespace(ns) {
      this.options.defaultNS = ns;
    }
  }, {
    key: "hasLoadedNamespace",
    value: function hasLoadedNamespace(ns) {
      var _this6 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!this.isInitialized) {
        this.logger.warn('hasLoadedNamespace: i18next was not initialized', this.languages);
        return false;
      }

      if (!this.languages || !this.languages.length) {
        this.logger.warn('hasLoadedNamespace: i18n.languages were undefined or empty', this.languages);
        return false;
      }

      var lng = this.resolvedLanguage || this.languages[0];
      var fallbackLng = this.options ? this.options.fallbackLng : false;
      var lastLng = this.languages[this.languages.length - 1];
      if (lng.toLowerCase() === 'cimode') return true;

      var loadNotPending = function loadNotPending(l, n) {
        var loadState = _this6.services.backendConnector.state["".concat(l, "|").concat(n)];

        return loadState === -1 || loadState === 2;
      };

      if (options.precheck) {
        var preResult = options.precheck(this, loadNotPending);
        if (preResult !== undefined) return preResult;
      }

      if (this.hasResourceBundle(lng, ns)) return true;
      if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages) return true;
      if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
      return false;
    }
  }, {
    key: "loadNamespaces",
    value: function loadNamespaces(ns, callback) {
      var _this7 = this;

      var deferred = defer();

      if (!this.options.ns) {
        callback && callback();
        return Promise.resolve();
      }

      if (typeof ns === 'string') ns = [ns];
      ns.forEach(function (n) {
        if (_this7.options.ns.indexOf(n) < 0) _this7.options.ns.push(n);
      });
      this.loadResources(function (err) {
        deferred.resolve();
        if (callback) callback(err);
      });
      return deferred;
    }
  }, {
    key: "loadLanguages",
    value: function loadLanguages(lngs, callback) {
      var deferred = defer();
      if (typeof lngs === 'string') lngs = [lngs];
      var preloaded = this.options.preload || [];
      var newLngs = lngs.filter(function (lng) {
        return preloaded.indexOf(lng) < 0;
      });

      if (!newLngs.length) {
        if (callback) callback();
        return Promise.resolve();
      }

      this.options.preload = preloaded.concat(newLngs);
      this.loadResources(function (err) {
        deferred.resolve();
        if (callback) callback(err);
      });
      return deferred;
    }
  }, {
    key: "dir",
    value: function dir(lng) {
      if (!lng) lng = this.resolvedLanguage || (this.languages && this.languages.length > 0 ? this.languages[0] : this.language);
      if (!lng) return 'rtl';
      var rtlLngs = ['ar', 'shu', 'sqr', 'ssh', 'xaa', 'yhd', 'yud', 'aao', 'abh', 'abv', 'acm', 'acq', 'acw', 'acx', 'acy', 'adf', 'ads', 'aeb', 'aec', 'afb', 'ajp', 'apc', 'apd', 'arb', 'arq', 'ars', 'ary', 'arz', 'auz', 'avl', 'ayh', 'ayl', 'ayn', 'ayp', 'bbz', 'pga', 'he', 'iw', 'ps', 'pbt', 'pbu', 'pst', 'prp', 'prd', 'ug', 'ur', 'ydd', 'yds', 'yih', 'ji', 'yi', 'hbo', 'men', 'xmn', 'fa', 'jpr', 'peo', 'pes', 'prs', 'dv', 'sam', 'ckb'];
      return rtlLngs.indexOf(this.services.languageUtils.getLanguagePartFromCode(lng)) > -1 || lng.toLowerCase().indexOf('-arab') > 1 ? 'rtl' : 'ltr';
    }
  }, {
    key: "cloneInstance",
    value: function cloneInstance() {
      var _this8 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

      var mergedOptions = _objectSpread$6(_objectSpread$6(_objectSpread$6({}, this.options), options), {
        isClone: true
      });

      var clone = new I18n(mergedOptions);
      var membersToCopy = ['store', 'services', 'language'];
      membersToCopy.forEach(function (m) {
        clone[m] = _this8[m];
      });
      clone.services = _objectSpread$6({}, this.services);
      clone.services.utils = {
        hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
      };
      clone.translator = new Translator(clone.services, clone.options);
      clone.translator.on('*', function (event) {
        for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }

        clone.emit.apply(clone, [event].concat(args));
      });
      clone.init(mergedOptions, callback);
      clone.translator.options = clone.options;
      clone.translator.backendConnector.services.utils = {
        hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
      };
      return clone;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        options: this.options,
        store: this.store,
        language: this.language,
        languages: this.languages,
        resolvedLanguage: this.resolvedLanguage
      };
    }
  }]);

  return I18n;
}(EventEmitter);

(0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(I18n, "createInstance", function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var callback = arguments.length > 1 ? arguments[1] : undefined;
  return new I18n(options, callback);
});

var instance = I18n.createInstance();
instance.createInstance = I18n.createInstance;

var createInstance = instance.createInstance;
var init = instance.init;
var loadResources = instance.loadResources;
var reloadResources = instance.reloadResources;
var use = instance.use;
var changeLanguage = instance.changeLanguage;
var getFixedT = instance.getFixedT;
var t = instance.t;
var exists = instance.exists;
var setDefaultNamespace = instance.setDefaultNamespace;
var hasLoadedNamespace = instance.hasLoadedNamespace;
var loadNamespaces = instance.loadNamespaces;
var loadLanguages = instance.loadLanguages;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (instance);



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!****************************!*\
  !*** ./source/js/index.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");
/* harmony import */ var i18next_browser_languagedetector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! i18next-browser-languagedetector */ "./node_modules/i18next-browser-languagedetector/dist/esm/i18nextBrowserLanguageDetector.js");
/* harmony import */ var i18next_chained_backend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! i18next-chained-backend */ "./node_modules/i18next-chained-backend/dist/esm/i18nextChainedBackend.js");
/* harmony import */ var i18next_http_backend__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! i18next-http-backend */ "./node_modules/i18next-http-backend/esm/index.js");
/* harmony import */ var i18next_resources_to_backend__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! i18next-resources-to-backend */ "./node_modules/i18next-resources-to-backend/dist/esm/index.js");
/* harmony import */ var _import_defaultOptions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./import/defaultOptions */ "./source/js/import/defaultOptions.js");
/* harmony import */ var _ui_Button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ui/Button */ "./source/js/ui/Button.js");
/* harmony import */ var _ui_Popup__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ui/Popup */ "./source/js/ui/Popup.js");
/* harmony import */ var _module_PopupHelper_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./module/PopupHelper.js */ "./source/js/module/PopupHelper.js");
/* harmony import */ var _module_HotKeyHelper_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./module/HotKeyHelper.js */ "./source/js/module/HotKeyHelper.js");
/* harmony import */ var _module_OnlineDictionary__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./module/OnlineDictionary */ "./source/js/module/OnlineDictionary.js");
/* harmony import */ var _module_InputSpinner__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./module/InputSpinner */ "./source/js/module/InputSpinner.js");
/* harmony import */ var _module_ToggleBox__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./module/ToggleBox */ "./source/js/module/ToggleBox.js");
/* harmony import */ var _module_PaletteBox__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./module/PaletteBox */ "./source/js/module/PaletteBox.js");
/* harmony import */ var _action_ActionAccessibilityStatement__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./action/ActionAccessibilityStatement */ "./source/js/action/ActionAccessibilityStatement.js");
/* harmony import */ var _action_ActionResetSettings__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./action/ActionResetSettings */ "./source/js/action/ActionResetSettings.js");
/* harmony import */ var _action_ActionHideAccessibility__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./action/ActionHideAccessibility */ "./source/js/action/ActionHideAccessibility.js");
/* harmony import */ var _module_ReadableExperience__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./module/ReadableExperience */ "./source/js/module/ReadableExperience.js");
/* harmony import */ var _module_VisuallyPleasingExperience__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./module/VisuallyPleasingExperience */ "./source/js/module/VisuallyPleasingExperience.js");
/* harmony import */ var _module_EasyOrientation__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./module/EasyOrientation */ "./source/js/module/EasyOrientation.js");
/* harmony import */ var _action_AccessibilityProfiles__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./action/AccessibilityProfiles */ "./source/js/action/AccessibilityProfiles.js");
/**
 * Readabler
 * Web accessibility for your site.
 * Exclusively on https://1.envato.market/readabler-js
 *
 * @encoding        UTF-8
 * @version         1.0
 * @copyright       (C) 2018 - 2022 Merkulove ( https://merkulov.design/ ). All rights reserved.
 * @license         Envato License https://1.envato.market/KYbje
 * @support         help@merkulov.design
 * @license         Envato License https://1.envato.market/KYbje
 **/
























const bundledResources = {
    en: {
        translations: {
            "open-accessibility-panel": "Open Accessibility Panel",
            "close-accessibility-panel": "Close Accessibility Panel",

            "popup-title": "Accessibility",

            "section-accessibility-modes": "Accessibility Modes",

            "profile-epilepsy-title": "Epilepsy Safe Mode",
            "profile-epilepsy-short": "Dampens color and removes blinks",
            "profile-epilepsy-description": "This mode enables people with epilepsy to use the website safely by eliminating the risk of seizures that result from flashing or blinking animations and risky color combinations.",

            "profile-visually-impaired-title": "Visually Impaired Mode",
            "profile-visually-impaired-short": "Improves websites visuals",
            "profile-visually-impaired-description": "This mode adjusts the website for the convenience of users with visual impairments such as Degrading Eyesight, Tunnel Vision, Cataract, Glaucoma, and others.",

            "profile-cognitive-disability-title": "Cognitive Disability Mode",
            "profile-cognitive-disability-short": "Helps to focus on specific content",
            "profile-cognitive-disability-description": "This mode provides different assistive options to help users with cognitive impairments such as Dyslexia, Autism, CVA, and others, to focus on the essential elements of the website more easily.",

            "profile-adhd-friendly-title": "ADHD Friendly Mode",
            "profile-adhd-friendly-short": "Reduces distractions and improve focus",
            "profile-adhd-friendly-description": "This mode helps users with ADHD and Neurodevelopmental disorders to read, browse, and focus on the main website elements more easily while significantly reducing distractions.",

            "profile-blind-users-title": "Blindness Mode",
            "profile-blind-users-short": "Allows using the site with your screen-reader",
            "profile-blind-users-description": "This mode configures the website to be compatible with screen-readers such as JAWS, NVDA, VoiceOver, and TalkBack. A screen-reader is software for blind users that is installed on a computer and smartphone, and websites must be compatible with it.",

            "section-online-dictionary": "Online Dictionary",
            "lear-more-wikipedia": "Learn more in Wikipedia",
            "start-typing-wikipedia": "Start typing to search in Wikipedia",
            "search-placeholder-wikipedia": "Search the online dictionary...",

            "section-readable-experience": "Readable Experience",
            "content-scaling": "Content Scaling",
            "content-size": "Content Size",
            "text-magnifier": "Text Magnifier",
            "readable-font": "Readable Font",
            "dyslexia-font": "Dyslexia Friendly",
            "highlight-titles": "Highlight Titles",
            "highlight-links": "Highlight Links",
            "font-sizing": "Font Sizing",
            "font-size": "Font Size",
            "line-height": "Line Height",
            "letter-spacing": "Letter Spacing",
            "letter-space": "Letter Space",
            "align-left": "Left Aligned",
            "align-center": "Center Aligned",
            "align-right": "Right Aligned",

            "section-visually-pleasing-experience": "Visually Pleasing Experience",
            "dark-contrast": "Dark Contrast",
            "light-contrast": "Light Contrast",
            "monochrome": "Monochrome",
            "high-contrast": "High Contrast",
            "high-saturation": "High Saturation",
            "low-saturation": "Low Saturation",
            "text-colors": "Adjust Text Colors",
            "title-colors": "Adjust Title Colors",
            "background-colors": "Adjust Background Colors",

            "section-easy-orientation": "Easy Orientation",
            "mute-sounds": "Mute Sounds",
            "hide-images": "Hide Images",
            "virtual-keyboard": "Virtual Keyboard",
            "reading-guide": "Reading Guide",
            "stop-animations": "Stop Animations",
            "reading-mask": "Reading Mask",
            "highlight-hover": "Highlight Hover",
            "highlight-focus": "Highlight Focus",
            "big-black-cursor": "Big Dark Cursor",
            "big-white-cursor": "Big Light Cursor",
            "keyboard-navigation": "Navigation Keys",
            "text-to-speech": "Text to Speech",
            "useful-links": "Link navigator",

            "text-to-speech-guide": "Highlight a piece of text and click Play to listen",

            "reset-button": "Reset Settings",
            "hide-button": "Hide Forever",
            "hide-forever-message"  : "Hide Accessibility Interface? Please note: If you choose to hide the accessibility interface, you won\"t be able to see it anymore, unless you clear clear cookies for this site. Are you sure that you wish to hide the interface?",

            "accessibility-statement": "Accessibility Statement",

            "home": "Home",
            "default": "Default",
            "increase": "Increase",
            "decrease": "Decrease",
            "change-color": "Change Color to",
            "select": "Select an option"
        }
    }
};

window.Readabler = class Readabler {

    /**
     * Readabler init
     * @param options Readabler options
     * @param css Readabler CSS variables
     */
    constructor( options = {}, css = {} ) {

        /** Merge default options with new options */
        this.mergeOptions( options );

        /** Change CSS styles through JS */
        this.addStyle( css );

        /** Exit if mdp-readabler-hide cookie is set */
        if ( window.document.cookie.indexOf( 'mdp-readabler-hide=1' ) > -1 ) { return; }

        /** Add locale */
        const i18nConfig = {
            fallbackLng: 'en',
            supportedLngs: readablerOptions.supportedLanguages,
            backend: {
                backends: [
                    i18next_http_backend__WEBPACK_IMPORTED_MODULE_3__["default"],
                    (0,i18next_resources_to_backend__WEBPACK_IMPORTED_MODULE_4__["default"])(bundledResources)
                ],
                backendOptions: [{
                    loadPath: `${ readablerOptions.path }/locales/{{lng}}/{{lng}}-{{ns}}.json`
                }]
            }

        }
        if ( readablerOptions.locale.length > 0 ) { i18nConfig.lng = _import_defaultOptions__WEBPACK_IMPORTED_MODULE_5__.defaultOptions.locale; }
        i18next__WEBPACK_IMPORTED_MODULE_0__["default"].use(i18next_browser_languagedetector__WEBPACK_IMPORTED_MODULE_1__["default"]).use(i18next_chained_backend__WEBPACK_IMPORTED_MODULE_2__["default"]).init( i18nConfig ).then( r => {

            /** Render accessibility button */
            new _ui_Button__WEBPACK_IMPORTED_MODULE_6__.Button( readablerOptions );

            /** Render accessibility popup */
            new _ui_Popup__WEBPACK_IMPORTED_MODULE_7__.Popup( readablerOptions );

            /** Initialise popup on page load. */
            _module_PopupHelper_js__WEBPACK_IMPORTED_MODULE_8__.PopupHelper.init();

            /** Enable hotkey functionality. */
            _module_HotKeyHelper_js__WEBPACK_IMPORTED_MODULE_9__.HotKeyHelper.init();

            /** Initialise Input Spinner controls. */
            _module_InputSpinner__WEBPACK_IMPORTED_MODULE_11__.InputSpinner.init();

            /** Initialise Toggle controls. */
            _module_ToggleBox__WEBPACK_IMPORTED_MODULE_12__.ToggleBox.init();

            /** Initialise Palette controls. */
            _module_PaletteBox__WEBPACK_IMPORTED_MODULE_13__.PaletteBox.init();

            /** Actions for Accessibility Profiles. */
            _action_AccessibilityProfiles__WEBPACK_IMPORTED_MODULE_20__.AccessibilityProfiles.init();

            /** Actions for Popup Sections */
            _module_OnlineDictionary__WEBPACK_IMPORTED_MODULE_10__.OnlineDictionary.init( readablerOptions );
            _module_ReadableExperience__WEBPACK_IMPORTED_MODULE_17__.ReadableExperience.init( readablerOptions );
            _module_VisuallyPleasingExperience__WEBPACK_IMPORTED_MODULE_18__.VisuallyPleasingExperience.init( readablerOptions );
            _module_EasyOrientation__WEBPACK_IMPORTED_MODULE_19__.EasyOrientation.init( readablerOptions );

            /** Actions for Footer Button. */
            _action_ActionResetSettings__WEBPACK_IMPORTED_MODULE_15__.ActionResetSettings.init( readablerOptions );
            _action_ActionHideAccessibility__WEBPACK_IMPORTED_MODULE_16__.ActionHideAccessibility.init( readablerOptions );

            /** Initialise Accessibility Statement. */
            _action_ActionAccessibilityStatement__WEBPACK_IMPORTED_MODULE_14__.ActionAccessibilityStatement.init( readablerOptions );

            /** Load values from local storage for Toggle boxes. */
            _module_ToggleBox__WEBPACK_IMPORTED_MODULE_12__.ToggleBox.loadSaved();

            /** Load values from local storage for Spinner boxes. */
            _module_InputSpinner__WEBPACK_IMPORTED_MODULE_11__.InputSpinner.loadSaved();

            /** Load values from local storage for Palette boxes. */
            _module_PaletteBox__WEBPACK_IMPORTED_MODULE_13__.PaletteBox.loadSaved();

            /** Load profile from local storage. */
            _action_AccessibilityProfiles__WEBPACK_IMPORTED_MODULE_20__.AccessibilityProfiles.loadSaved();

        } );

    }

    /**
     * Merge options
     * @param options
     */
    mergeOptions( options ) {

        // Wrong options type
        if ( ! this.isObject( options ) ) { return; }

        // Check single option format
        for ( const [ key, value ] of Object.entries( options ) ) {

            if ( typeof value !== typeof _import_defaultOptions__WEBPACK_IMPORTED_MODULE_5__.defaultOptions[ key ] ) {
                console.warn( `Readabler: Wrong '${ key }' options type. Expected '${ typeof _import_defaultOptions__WEBPACK_IMPORTED_MODULE_5__.defaultOptions[ key ] }' but given '${ typeof value }'` );
                options[ key ] = _import_defaultOptions__WEBPACK_IMPORTED_MODULE_5__.defaultOptions[ key ];
            }

        }

        /** Merge default options with new options */
        window.readablerOptions = Object.assign( _import_defaultOptions__WEBPACK_IMPORTED_MODULE_5__.defaultOptions, options );

    }

    /**
     * Add or change styles through JS
     * @param css
     */
    addStyle( css ) {

        // Wrong options type
        if ( ! this.isObject( css ) ) { return; }

        // Empty
        if ( Object.keys( css ).length === 0 && css.constructor === Object ) { return; }

        const $style = document.createElement( 'style' );
        $style.id = 'readabler-css';

        $style.innerHTML = `html{`

        for ( const [ prop, value ] of Object.entries( css ) ) {

            $style.innerHTML += `${ prop }: ${ value }`;

        }

        $style.innerHTML += `};`;

        document.head.appendChild( $style );

    }

    /**
     * Check is provided variable type is object ot throw console error
     * @param options
     * @returns {boolean}
     */
    isObject( options ) {

        // Wrong options type
        if ( typeof options !== 'object' ) {

            console.error( `Readabler: Wrong options type. Expected 'object' but given '${ typeof options }'` );
            return false;

        } else {

            return true;

        }

    }

    /**
     * Hide popup window
     */
    closePopup() {

        const el = document.querySelector( '#mdp-readabler-popup-box' );
        el.classList.remove( 'mdp-is-open' );
        el.setAttribute( 'aria-hidden', 'true' );

    }

    /**
     * Show popup window
     */
    openPopup() {

        const el = document.querySelector( '#mdp-readabler-popup-box' );
        el.classList.add( 'mdp-is-open' );
        el.setAttribute( 'aria-hidden', 'false' );

    }

    /**
     * Remove popup button
     */
    removeButton() {

        const el = document.querySelector( '.mdp-readabler-trigger-button-box' );
        if ( el ) {

            el.remove();

        }

    }

    /** Add button */
    addButton() {

        if ( ! document.querySelector( '.mdp-readabler-trigger-button-box' ) ) {

            new _ui_Button__WEBPACK_IMPORTED_MODULE_6__.Button( readablerOptions );

        }

    }

    /**
     * Get options
     * @returns {*}
     */
    get getOptions() {

        return window.readablerOptions;

    }

    /**
     * Set options
     * @param options
     */
    set setOptions( options ) {

        this.mergeOptions( options );

    }

}

})();

/******/ })()
;