!function e(t,r,n){function i(s,a){if(!r[s]){if(!t[s]){var c="function"==typeof require&&require
if(!a&&c)return c(s,!0)
if(o)return o(s,!0)
var u=new Error("Cannot find module '"+s+"'")
throw u.code="MODULE_NOT_FOUND",u}var l=r[s]={exports:{}}
t[s][0].call(l.exports,function(e){var r=t[s][1][e]
return i(r?r:e)},l,l.exports,e,t,r,n)}return r[s].exports}for(var o="function"==typeof require&&require,s=0;s<n.length;s++)i(n[s])
return i}({1:[function(e,t,r){var n=e("levelup"),i=e("fruitdown")
t.exports={clearCache:function(){var e=n("noddity-content",{db:i})
e.createKeyStream().on("data",function(t){e.del(t)})}}},{fruitdown:7,levelup:25}],2:[function(e,t,r){var n=e("noddity-butler"),i=e("levelup"),o=e("noddity-linkifier"),s=e("fruitdown"),a=e("./mainViewModel"),c=e("subleveldown"),u=noddityConfig,l=i("noddity-content",{db:s})
u.title=u.name=u.title||u.name
var h=u.title.replace(/[^\w]+/g,""),f=u.debug?{refreshEvery:3e4}:{cacheCheckIntervalMs:6e4},p=new n(u.noddityRoot,c(l,h),f),d=new o(u.pathPrefix+u.pagePathPrefix)
a(p,d),u.sidebar&&console.warn('The "sidebar" config.js setting is not supported any more - you should add ::'+u.sidebar+":: to your "+u.template+" template"),u.debug&&(debug=e("./debug"))},{"./debug":1,"./mainViewModel":3,fruitdown:7,levelup:25,"noddity-butler":51,"noddity-linkifier":117,subleveldown:193}],3:[function(e,t,r){function n(e,t,r){e.findAll("a[href]").forEach(function(e){var n=e.getAttribute("href")
n&&"#"===n[0]&&0!==n.indexOf(t)&&e.setAttribute("href",t+r+n)})}var i=e("noddity-render-dom"),o=e("./routing"),s=e("ractive"),a=noddityConfig
s.DEBUG=a.debug,t.exports=function(e,t){function r(e,t){l.reset(a),!e&&t&&l.set("current",t)}var c="",u={butler:e,linkifier:t,el:"body",data:a},l=new s({el:"title",template:"{{name}}{{#current.metadata.title}} | {{current.metadata.title}}{{/current.metadata.title}}"})
e.on("post change",function(e){e.filename===c&&r(null,e)}),t.on("link",function(t){e.getPost(t,function(){})}),i("post",u,function(t,i){t&&(console.error(t),document.body.innerHTML="<h1>ERROR</h1>"+t.message)
var s=o()
s.on("current",function(t,o){var c={parameters:o||{}}
i(t,c,function(o){o?t!==a.errorPage&&s.emit("404"):(n(i.ractive,"#!/"+a.pagePathPrefix,t),s.emit("loaded",t)),e.getPost(t,r),e.refreshPost(t)})}),i.on("error",console.error.bind(console,"setCurrent error"))})}},{"./routing":4,"noddity-render-dom":118,ractive:192}],4:[function(e,t,r){function n(e){var t=document.getElementById(e)
t&&scrollTo(0,t.offsetTop)}var i=e("events").EventEmitter,o=e("hash-brown-router"),s=noddityConfig
t.exports=function(){var e=o(),t=new i,r=null
return t.on("404",function(){e.replace("!/"+s.pagePathPrefix+s.errorPage)}),t.on("current",function(e){scrollTo(0,0)}),e.add("!/",function(e){t.emit("current","index.md",e)}),e.add("!/"+s.pagePathPrefix+":name([^#]+)#:anchor",function(e){r===e.name?n(e.anchor):(t.emit("current",e.name,e),r=e.name,t.once("loaded",function(){n(e.anchor)}))}),e.add("!/"+s.pagePathPrefix+":name([^#]+)",function(e){t.emit("current",e.name,e)}),e.setDefault(function(e){t.emit("404",e)}),setTimeout(e.evaluateCurrent.bind(null,"!/"),0),t}},{events:208,"hash-brown-router":19}],5:[function(e,t,r){(function(e,r){"use strict"
function n(e){this._dbName=e}function i(e,t){if(c[e])return a(function(){t(null,c[e])})
var r=indexedDB.open(e,1)
u[e]=r,r.onupgradeneeded=function(e){var t=e.target.result
1!==e.oldVersion&&t.createObjectStore(s).createIndex("fakeKey","fakeKey")},r.onsuccess=function(r){var n=c[e]=r.target.result
t(null,n)},r.onerror=function(e){var r="Failed to open indexedDB, are you in private browsing mode?"
console.error(r),t(e)}}function o(e,t){try{return{txn:e.transaction(s,t)}}catch(r){return{error:r}}}var s="fruitdown",a=r.setImmediate||e.nextTick,c={},u={}
n.prototype.getKeys=function(e){i(this._dbName,function(t,r){if(t)return e(t)
var n=o(r,"readonly")
if(n.error)return e(n.error)
var i=n.txn,a=i.objectStore(s)
i.onerror=e
var c=[]
i.oncomplete=function(){e(null,c.sort())}
var u=a.index("fakeKey").openKeyCursor()
u.onsuccess=function(e){var t=e.target.result
t&&(c.push(t.primaryKey),t["continue"]())}})},n.prototype.put=function(e,t,r){i(this._dbName,function(n,i){if(n)return r(n)
var a=o(i,"readwrite")
if(a.error)return r(a.error)
var c=a.txn,u=c.objectStore(s),l="string"==typeof t?t:t.toString()
c.onerror=r,c.oncomplete=function(){r()},u.put({value:l,fakeKey:0},e)})},n.prototype.get=function(e,t){i(this._dbName,function(r,n){if(r)return t(r)
var i=o(n,"readonly")
if(i.error)return t(i.error)
var a,c=i.txn,u=c.objectStore(s),l=u.get(e)
l.onsuccess=function(e){e.target.result&&(a=e.target.result.value)},c.onerror=t,c.oncomplete=function(){t(null,a)}})},n.prototype.remove=function(e,t){i(this._dbName,function(r,n){if(r)return t(r)
var i=o(n,"readwrite")
if(i.error)return t(i.error)
var a=i.txn,c=a.objectStore(s)
c["delete"](e),a.onerror=t,a.oncomplete=function(){t()}})},n.destroy=function(e,t){a(function(){u[e]&&u[e].result&&(u[e].result.close(),delete c[e])
var r=indexedDB.deleteDatabase(e)
r.onsuccess=function(){u[e]&&(u[e]=null),t(null)},r.onerror=t})},t.exports=n}).call(this,e("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{_process:211}],6:[function(e,t,r){(function(r){"use strict"
function n(e){this._store=new h(e),this._queue=new f}var i="ArrayBuffer:",o=new RegExp("^"+i),s="Uint8Array:",a=new RegExp("^"+s),c="Buff:",u=new RegExp("^"+c),l=e("./utils"),h=e("./database-core"),f=e("./taskqueue"),p=e("d64")
n.prototype.sequentialize=function(e,t){this._queue.add(t,e)},n.prototype.init=function(e){var t=this
t.sequentialize(e,function(e){t._store.getKeys(function(r,n){return r?e(r):(t._keys=n,e())})})},n.prototype.keys=function(e){var t=this
t.sequentialize(e,function(e){e(null,t._keys.slice())})},n.prototype.setItem=function(e,t,n){var i=this
i.sequentialize(n,function(n){r.isBuffer(t)&&(t=c+p.encode(t))
var o=l.sortedIndexOf(i._keys,e)
i._keys[o]!==e&&i._keys.splice(o,0,e),i._store.put(e,t,n)})},n.prototype.getItem=function(e,t){var r=this
r.sequentialize(t,function(t){r._store.get(e,function(e,r){return e?t(e):"undefined"==typeof r||null===r?t(new Error("NotFound")):("undefined"!=typeof r&&(u.test(r)?r=p.decode(r.substring(c.length)):o.test(r)?(r=r.substring(i.length),r=new ArrayBuffer(atob(r).split("").map(function(e){return e.charCodeAt(0)}))):a.test(r)&&(r=r.substring(s.length),r=new Uint8Array(atob(r).split("").map(function(e){return e.charCodeAt(0)})))),void t(null,r))})})},n.prototype.removeItem=function(e,t){var r=this
r.sequentialize(t,function(t){var n=l.sortedIndexOf(r._keys,e)
r._keys[n]===e?(r._keys.splice(n,1),r._store.remove(e,function(e){return e?t(e):void t()})):t()})},n.prototype.length=function(e){var t=this
t.sequentialize(e,function(e){e(null,t._keys.length)})},t.exports=n}).call(this,e("buffer").Buffer)},{"./database-core":5,"./taskqueue":16,"./utils":17,buffer:204,d64:13}],7:[function(e,t,r){(function(r,n,i){"use strict"
function o(e,t){l.call(this,e),this._reverse=!!t.reverse,this._endkey=t.end,this._startkey=t.start,this._gt=t.gt,this._gte=t.gte,this._lt=t.lt,this._lte=t.lte,this._exclusiveStart=t.exclusiveStart,this._limit=t.limit,this._count=0,this.onInitCompleteListeners=[]}function s(e){return this instanceof s?(u.call(this,e),void(this.container=new h(e))):new s(e)}function a(e,t){if(null===e||void 0===e)return new Error(t+" cannot be `null` or `undefined`")
if(null===e||void 0===e)return new Error(t+" cannot be `null` or `undefined`")
if("key"===t){if(e instanceof Boolean)return new Error(t+" cannot be `null` or `undefined`")
if(""===e)return new Error(t+" cannot be empty")}if(0===e.toString().indexOf("[object ArrayBuffer]")&&(0===e.byteLength||void 0===e.byteLength))return new Error(t+" cannot be an empty Buffer")
if(i.isBuffer(e)){if(0===e.length)return new Error(t+" cannot be an empty Buffer")}else if(""===String(e))return new Error(t+" cannot be an empty String")}var c=e("inherits"),u=e("abstract-leveldown").AbstractLevelDOWN,l=e("abstract-leveldown").AbstractIterator,h=e("./database"),f=e("./database-core"),p=e("./utils"),d=n.setImmediate||r.nextTick
c(o,l),o.prototype._init=function(e){d(function(){e()})},o.prototype._next=function(e){function t(){if(r._pos===r._keys.length||r._pos<0)return e()
var t=r._keys[r._pos]
return r._endkey&&(r._reverse?t<r._endkey:t>r._endkey)?e():r._limit&&r._limit>0&&r._count++>=r._limit?e():r._lt&&t>=r._lt||r._lte&&t>r._lte||r._gt&&t<=r._gt||r._gte&&t<r._gte?e():(r._pos+=r._reverse?-1:1,void r.db.container.getItem(t,function(n,i){return n?"NotFound"===n.message?d(function(){r._next(e)}):e(n):void e(null,t,i)}))}var r=this
r.initStarted?r.initCompleted?t():r.onInitCompleteListeners.push(t):(r.initStarted=!0,r._init(function(n){return n?e(n):void r.db.container.keys(function(n,i){if(n)return e(n)
if(r._keys=i,r._startkey){var o=p.sortedIndexOf(r._keys,r._startkey),s=o>=r._keys.length||0>o?void 0:r._keys[o]
r._pos=o,r._reverse?(r._exclusiveStart||s!==r._startkey)&&r._pos--:r._exclusiveStart&&s===r._startkey&&r._pos++}else r._pos=r._reverse?r._keys.length-1:0
t(),r.initCompleted=!0
for(var a=-1;++a<r.onInitCompleteListeners;)d(r.onInitCompleteListeners[a])})}))},c(s,u),s.prototype._open=function(e,t){this.container.init(t)},s.prototype._put=function(e,t,r,n){var o=a(e,"key")
if(o)return d(function(){n(o)})
if(o=a(t,"value"))return d(function(){n(o)})
if("object"==typeof t&&!i.isBuffer(t)&&void 0===t.buffer){var s={}
s.storetype="json",s.data=t,t=JSON.stringify(s)}this.container.setItem(e,t,n)},s.prototype._get=function(e,t,r){var n=a(e,"key")
return n?d(function(){r(n)}):(i.isBuffer(e)||(e=String(e)),void this.container.getItem(e,function(e,n){if(e)return r(e)
if(t.asBuffer===!1||i.isBuffer(n)||(n=new i(n)),t.asBuffer===!1&&n.indexOf('{"storetype":"json","data"')>-1){var o=JSON.parse(n)
n=o.data}r(null,n)}))},s.prototype._del=function(e,t,r){var n=a(e,"key")
return n?d(function(){r(n)}):(i.isBuffer(e)||(e=String(e)),void this.container.removeItem(e,r))},s.prototype._batch=function(e,t,r){var n=this
d(function(){function o(){++h===e.length&&r(l)}var s,c,u,l,h=0
if(Array.isArray(e)&&e.length)for(var f=0;f<e.length;f++){var p=e[f]
p?(c=i.isBuffer(p.key)?p.key:String(p.key),s=a(c,"key"),s?(l=s,o()):"del"===p.type?n._del(p.key,t,o):"put"===p.type&&(u=i.isBuffer(p.value)?p.value:String(p.value),s=a(u,"value"),s?(l=s,o()):n._put(c,u,t,o))):o()}else r()})},s.prototype._iterator=function(e){return new o(this,e)},s.destroy=function(e,t){f.destroy(e,t)},t.exports=s}).call(this,e("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},e("buffer").Buffer)},{"./database":6,"./database-core":5,"./utils":17,_process:211,"abstract-leveldown":10,buffer:204,inherits:14}],8:[function(e,t,r){(function(e){function r(e){this._db=e,this._operations=[],this._written=!1}r.prototype._checkWritten=function(){if(this._written)throw new Error("write() already called on this batch")},r.prototype.put=function(e,t){this._checkWritten()
var r=this._db._checkKeyValue(e,"key",this._db._isBuffer)
if(r)throw r
if(r=this._db._checkKeyValue(t,"value",this._db._isBuffer))throw r
return this._db._isBuffer(e)||(e=String(e)),this._db._isBuffer(t)||(t=String(t)),"function"==typeof this._put?this._put(e,t):this._operations.push({type:"put",key:e,value:t}),this},r.prototype.del=function(e){this._checkWritten()
var t=this._db._checkKeyValue(e,"key",this._db._isBuffer)
if(t)throw t
return this._db._isBuffer(e)||(e=String(e)),"function"==typeof this._del?this._del(e):this._operations.push({type:"del",key:e}),this},r.prototype.clear=function(){return this._checkWritten(),this._operations=[],"function"==typeof this._clear&&this._clear(),this},r.prototype.write=function(t,r){if(this._checkWritten(),"function"==typeof t&&(r=t),"function"!=typeof r)throw new Error("write() requires a callback argument")
return"object"!=typeof t&&(t={}),this._written=!0,"function"==typeof this._write?this._write(r):"function"==typeof this._db._batch?this._db._batch(this._operations,t,r):void e.nextTick(r)},t.exports=r}).call(this,e("_process"))},{_process:211}],9:[function(e,t,r){(function(e){function r(e){this.db=e,this._ended=!1,this._nexting=!1}r.prototype.next=function(t){var r=this
if("function"!=typeof t)throw new Error("next() requires a callback argument")
return r._ended?t(new Error("cannot call next() after end()")):r._nexting?t(new Error("cannot call next() before previous next() has completed")):(r._nexting=!0,"function"==typeof r._next?r._next(function(){r._nexting=!1,t.apply(null,arguments)}):void e.nextTick(function(){r._nexting=!1,t()}))},r.prototype.end=function(t){if("function"!=typeof t)throw new Error("end() requires a callback argument")
return this._ended?t(new Error("end() already called on iterator")):(this._ended=!0,"function"==typeof this._end?this._end(t):void e.nextTick(t))},t.exports=r}).call(this,e("_process"))},{_process:211}],10:[function(e,t,r){(function(r,n){function i(e){if(!arguments.length||void 0===e)throw new Error("constructor requires at least a location argument")
if("string"!=typeof e)throw new Error("constructor requires a location string argument")
this.location=e}var o=e("xtend"),s=e("./abstract-iterator"),a=e("./abstract-chained-batch")
i.prototype.open=function(e,t){if("function"==typeof e&&(t=e),"function"!=typeof t)throw new Error("open() requires a callback argument")
return"object"!=typeof e&&(e={}),"function"==typeof this._open?this._open(e,t):void r.nextTick(t)},i.prototype.close=function(e){if("function"!=typeof e)throw new Error("close() requires a callback argument")
return"function"==typeof this._close?this._close(e):void r.nextTick(e)},i.prototype.get=function(e,t,n){var i
if("function"==typeof t&&(n=t),"function"!=typeof n)throw new Error("get() requires a callback argument")
return(i=this._checkKeyValue(e,"key",this._isBuffer))?n(i):(this._isBuffer(e)||(e=String(e)),"object"!=typeof t&&(t={}),"function"==typeof this._get?this._get(e,t,n):void r.nextTick(function(){n(new Error("NotFound"))}))},i.prototype.put=function(e,t,n,i){var o
if("function"==typeof n&&(i=n),"function"!=typeof i)throw new Error("put() requires a callback argument")
return(o=this._checkKeyValue(e,"key",this._isBuffer))?i(o):(o=this._checkKeyValue(t,"value",this._isBuffer))?i(o):(this._isBuffer(e)||(e=String(e)),this._isBuffer(t)||r.browser||(t=String(t)),"object"!=typeof n&&(n={}),"function"==typeof this._put?this._put(e,t,n,i):void r.nextTick(i))},i.prototype.del=function(e,t,n){var i
if("function"==typeof t&&(n=t),"function"!=typeof n)throw new Error("del() requires a callback argument")
return(i=this._checkKeyValue(e,"key",this._isBuffer))?n(i):(this._isBuffer(e)||(e=String(e)),"object"!=typeof t&&(t={}),"function"==typeof this._del?this._del(e,t,n):void r.nextTick(n))},i.prototype.batch=function(e,t,n){if(!arguments.length)return this._chainedBatch()
if("function"==typeof t&&(n=t),"function"!=typeof n)throw new Error("batch(array) requires a callback argument")
if(!Array.isArray(e))return n(new Error("batch(array) requires an array argument"))
"object"!=typeof t&&(t={})
for(var i,o,s=0,a=e.length;a>s;s++)if(i=e[s],"object"==typeof i){if(o=this._checkKeyValue(i.type,"type",this._isBuffer))return n(o)
if(o=this._checkKeyValue(i.key,"key",this._isBuffer))return n(o)
if("put"==i.type&&(o=this._checkKeyValue(i.value,"value",this._isBuffer)))return n(o)}return"function"==typeof this._batch?this._batch(e,t,n):void r.nextTick(n)},i.prototype.approximateSize=function(e,t,n){if(null==e||null==t||"function"==typeof e||"function"==typeof t)throw new Error("approximateSize() requires valid `start`, `end` and `callback` arguments")
if("function"!=typeof n)throw new Error("approximateSize() requires a callback argument")
return this._isBuffer(e)||(e=String(e)),this._isBuffer(t)||(t=String(t)),"function"==typeof this._approximateSize?this._approximateSize(e,t,n):void r.nextTick(function(){n(null,0)})},i.prototype._setupIteratorOptions=function(e){var t=this
return e=o(e),["start","end","gt","gte","lt","lte"].forEach(function(r){e[r]&&t._isBuffer(e[r])&&0===e[r].length&&delete e[r]}),e.reverse=!!e.reverse,e.reverse&&e.lt&&(e.start=e.lt),e.reverse&&e.lte&&(e.start=e.lte),!e.reverse&&e.gt&&(e.start=e.gt),!e.reverse&&e.gte&&(e.start=e.gte),(e.reverse&&e.lt&&!e.lte||!e.reverse&&e.gt&&!e.gte)&&(e.exclusiveStart=!0),e},i.prototype.iterator=function(e){return"object"!=typeof e&&(e={}),e=this._setupIteratorOptions(e),"function"==typeof this._iterator?this._iterator(e):new s(this)},i.prototype._chainedBatch=function(){return new a(this)},i.prototype._isBuffer=function(e){return n.isBuffer(e)},i.prototype._checkKeyValue=function(e,t){if(null===e||void 0===e)return new Error(t+" cannot be `null` or `undefined`")
if(null===e||void 0===e)return new Error(t+" cannot be `null` or `undefined`")
if(this._isBuffer(e)){if(0===e.length)return new Error(t+" cannot be an empty Buffer")}else if(""===String(e))return new Error(t+" cannot be an empty String")},t.exports.AbstractLevelDOWN=i,t.exports.AbstractIterator=s,t.exports.AbstractChainedBatch=a}).call(this,e("_process"),e("buffer").Buffer)},{"./abstract-chained-batch":8,"./abstract-iterator":9,_process:211,buffer:204,xtend:11}],11:[function(e,t,r){function n(){for(var e={},t=0;t<arguments.length;t++){var r=arguments[t]
for(var n in r)r.hasOwnProperty(n)&&(e[n]=r[n])}return e}t.exports=n},{}],12:[function(e,t,r){"use strict"
function n(e){return function(){var t=arguments.length
if(t){for(var r=[],n=-1;++n<t;)r[n]=arguments[n]
return e.call(this,r)}return e.call(this,[])}}t.exports=n},{}],13:[function(e,t,r){var n=e("buffer").Buffer,i=".PYFGCRLAOEUIDHTNSQJKXBMWVZ_pyfgcrlaoeuidhtnsqjkxbmwvz1234567890".split("").sort().join("")
t.exports=function(e,t){if(e=e||i,t=t||{},64!==e.length)throw new Error("a base 64 encoding requires 64 chars")
var r=new n(128)
r.fill()
for(var o=0;64>o;o++){var s=e.charCodeAt(o)
r[s]=o}return t.encode=function(t){for(var r="",n=t.length,i=0,o=0;n>o;o++){var s=t[o]
switch(o%3){case 0:r+=e[s>>2],i=(3&s)<<4
break
case 1:r+=e[i|s>>4],i=(15&s)<<2
break
case 2:r+=e[i|s>>6],r+=e[63&s],i=0}}return n%3&&(r+=e[i]),r},t.decode=function(e){for(var t=e.length,i=0,o=new n(~~(t/4*3)),s=0,a=0;t>a;a++){var c=r[e.charCodeAt(a)]
switch(a%4){case 0:s=c<<2
break
case 1:o[i++]=s|c>>4,s=c<<4&255
break
case 2:o[i++]=s|c>>2,s=c<<6&255
break
case 3:o[i++]=s|c}}return o},t},t.exports(i,t.exports)},{buffer:204}],14:[function(e,t,r){"function"==typeof Object.create?t.exports=function(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}:t.exports=function(e,t){e.super_=t
var r=function(){}
r.prototype=t.prototype,e.prototype=new r,e.prototype.constructor=e}},{}],15:[function(e,t,r){"use strict"
function n(){this.length=0}n.prototype.push=function(e){var t={item:e}
this.last?this.last=this.last.next=t:this.last=this.first=t,this.length++},n.prototype.shift=function(){var e=this.first
return e?(this.first=e.next,--this.length||(this.last=void 0),e.item):void 0},n.prototype.slice=function(e,t){e="undefined"==typeof e?0:e,t="undefined"==typeof t?1/0:t
for(var r=[],n=0,i=this.first;i&&!(--t<0);i=i.next)++n>e&&r.push(i.item)
return r},t.exports=n},{}],16:[function(e,t,r){(function(r,n){"use strict"
function i(){this.queue=new s,this.running=!1}var o=e("argsarray"),s=e("tiny-queue"),a=n.setImmediate||r.nextTick
i.prototype.add=function(e,t){this.queue.push({fun:e,callback:t}),this.processNext()},i.prototype.processNext=function(){var e=this
if(!e.running&&e.queue.length){e.running=!0
var t=e.queue.shift()
a(function(){t.fun(o(function(r){t.callback.apply(null,r),e.running=!1,e.processNext()}))})}},t.exports=i}).call(this,e("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{_process:211,argsarray:12,"tiny-queue":15}],17:[function(e,t,r){"use strict"
r.sortedIndexOf=function(e,t){for(var r,n=0,i=e.length;i>n;)r=n+i>>>1,e[r]<t?n=r+1:i=r
return n}},{}],18:[function(e,t,r){function n(e,t){e.location.replace(i(e.location.href)+"#"+t)}function i(e){var t=e.indexOf("#")
return-1===t?e:e.substring(0,t)}function o(e,t){e.location.hash=t}function s(e){return a(e.location.hash)}function a(e){return e&&"#"===e[0]?e.substr(1):e}var c=e("events").EventEmitter
t.exports=function(e){var t=new c,r=""
return e.addEventListener("hashchange",function(){r!==t.get()&&(r=t.get(),t.emit("hashchange"))}),t.go=o.bind(null,e),t.replace=n.bind(null,e),t.get=s.bind(null,e),t}},{events:208}],19:[function(e,t,r){function n(e,t,r){o(e,t.get(),r)}function i(e){var t=e.split("?")
return{path:t.shift(),queryString:p.parse(t.join(""))}}function o(e,t,r){var n=i(t)
t=n.path
var o=n.queryString,c=(r?s(e):e).find("".match,t)
if(c){var u=c.exec(t),l=a(c.keys,u),h=d(o,l)
c.fn(h)}else e.defaultFn&&e.defaultFn(t,o)}function s(e){return e.slice().reverse()}function a(e,t){return e.reduce(function(e,r,n){return e[r.name]=t[n+1],e},{})}function c(e,t,r){if("function"!=typeof r)throw new Error("The router add function must be passed a callback function")
var n=f(t)
n.fn=r,e.push(n)}function u(e,t,r){if(t.get()){var i=e.slice()
i.defaultFn=function(){t.go(r)},n(i,t)}else t.go(r)}function l(e,t){e.defaultFn=t}function h(e){return e&&e.go&&e.replace&&e.on}var f=e("path-to-regexp-with-reversible-keys"),p=e("querystring"),d=e("xtend"),g=e("./hash-location.js")
e("array.prototype.find"),t.exports=function(e,t){function r(){t.removeListener("hashchange",o)}h(e)&&(t=e,e=null),e=e||{},t||(t=g(window))
var i=[],o=n.bind(null,i,t,!!e.reverse)
return t.on("hashchange",o),{add:c.bind(null,i),stop:r,evaluateCurrent:u.bind(null,i,t),setDefault:l.bind(null,i),replace:t.replace,go:t.go,location:t}}},{"./hash-location.js":18,"array.prototype.find":20,"path-to-regexp-with-reversible-keys":21,querystring:215,xtend:23}],20:[function(e,t,r){!function(e){if(!Array.prototype.find){var t=function(e){var t=Object(this),r=t.length<0?0:t.length>>>0
if(0===r)return void 0
if("function"!=typeof e||"[object Function]"!==Object.prototype.toString.call(e))throw new TypeError("Array#find: predicate must be a function")
for(var n,i=arguments[1],o=0;r>o;o++)if(n=t[o],e.call(i,n,o,t))return n
return void 0}
if(Object.defineProperty)try{Object.defineProperty(Array.prototype,"find",{value:t,configurable:!0,enumerable:!1,writable:!0})}catch(r){}Array.prototype.find||(Array.prototype.find=t)}}(this)},{}],21:[function(e,t,r){function n(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function i(e,t,r){return e.keys=t,e.allTokens=r,e}function o(e){return e.sensitive?"":"i"}function s(e,t,r){var n=e.source.match(/\((?!\?)/g)
if(n)for(var o=0;o<n.length;o++)t.push({name:o,delimiter:null,optional:!1,repeat:!1})
return i(e,t,r)}function a(e,t,r,n){for(var s=[],a=0;a<e.length;a++)s.push(u(e[a],t,r,n).source)
var c=new RegExp("(?:"+s.join("|")+")",o(r))
return i(c,t,n)}function c(e,t,r){function i(e){0===a&&"/"!==e[0]&&(e="/"+e),r.push({string:e})}function o(o,c,u,l,h,f,p,d,g){if(c)return c
if(d)return"\\"+d
var m="+"===p||"*"===p,v="?"===p||"*"===p
g>a&&i(e.substring(a,g)),a=g+o.length
var b={name:l||s++,delimiter:u||"/",optional:v,repeat:m}
return t.push(b),r.push(b),u=u?"\\"+u:"",h=n(h||f||"[^"+(u||"\\/")+"]+?"),m&&(h=h+"(?:"+u+h+")*"),v?"(?:"+u+"("+h+"))?":u+"("+h+")"}var s=0,a=0,c=e.replace(h,o)
return a<e.length&&i(e.substring(a)),c}function u(e,t,r,n){if(t=t||[],n=n||[],l(t)?r||(r={}):(r=t,t=[]),e instanceof RegExp)return s(e,t,r,n)
if(l(e))return a(e,t,r,n)
var u=r.strict,h=r.end!==!1,f=c(e,t,n),p="/"===e.charAt(e.length-1)
return u||(f=(p?f.slice(0,-2):f)+"(?:\\/(?=$))?"),f+=h?"$":u&&p?"":"(?=\\/|$)",i(new RegExp("^"+f,o(r)),t,n)}var l=e("isarray")
t.exports=u
var h=new RegExp(["(\\\\.)","([\\/.])?(?:\\:(\\w+)(?:\\(((?:\\\\.|[^)])*)\\))?|\\(((?:\\\\.|[^)])*)\\))([+*?])?","([.+*?=^!:${}()[\\]|\\/])"].join("|"),"g")},{isarray:22}],22:[function(e,t,r){t.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},{}],23:[function(e,t,r){function n(){for(var e={},t=0;t<arguments.length;t++){var r=arguments[t]
for(var n in r)i.call(r,n)&&(e[n]=r[n])}return e}t.exports=n
var i=Object.prototype.hasOwnProperty},{}],24:[function(e,t,r){function n(e,t){this._levelup=e,this._codec=t,this.batch=e.db.batch(),this.ops=[]}var i=e("./util"),o=e("level-errors").WriteError,s=i.getOptions,a=i.dispatchError
n.prototype.put=function(e,t,r){r=s(r)
var n=this._codec.encodeKey(e,r),i=this._codec.encodeValue(t,r)
try{this.batch.put(n,i)}catch(a){throw new o(a)}return this.ops.push({type:"put",key:n,value:i}),this},n.prototype.del=function(e,t){t=s(t)
var r=this._codec.encodeKey(e,t)
try{this.batch.del(r)}catch(n){throw new o(n)}return this.ops.push({type:"del",key:r}),this},n.prototype.clear=function(){try{this.batch.clear()}catch(e){throw new o(e)}return this.ops=[],this},n.prototype.write=function(e){var t=this._levelup,r=this.ops
try{this.batch.write(function(n){return n?a(t,new o(n),e):(t.emit("batch",r),void(e&&e()))})}catch(n){throw new o(n)}},t.exports=n},{"./util":26,"level-errors":33}],25:[function(e,t,r){(function(r){function n(e,t){return"function"==typeof e?e:t}function i(e,t,n){if(!(this instanceof i))return new i(e,t,n)
var o
if(u.call(this),this.setMaxListeners(1/0),"function"==typeof e?(t="object"==typeof t?t:{},t.db=e,e=null):"object"==typeof e&&"function"==typeof e.db&&(t=e,e=null),"function"==typeof t&&(n=t,t={}),(!t||"function"!=typeof t.db)&&"string"!=typeof e){if(o=new k("Must provide a location for the database"),n)return r.nextTick(function(){n(o)})
throw o}t=S(t),this.options=f(C,t),this._codec=new A(this.options),this._status="new",p(this,"location",e,"e"),this.open(n)}function o(e,t,r){return e._isOpening()||e.isOpen()?void 0:(q(e,new b("Database is not open"),r),!0)}function s(e,t,r){q(e,new v(t),r)}function a(e,t,r){q(e,new b(t),r)}function c(e){return function(t,r){T()[e](t,r||function(){})}}var u=e("events").EventEmitter,l=e("util").inherits,h=e("util").deprecate,f=e("xtend"),p=e("prr"),d=e("deferred-leveldown"),g=e("level-iterator-stream"),m=e("level-errors"),v=m.WriteError,b=m.ReadError,y=m.NotFoundError,w=m.OpenError,_=m.EncodingError,k=m.InitializationError,x=e("./util"),E=e("./batch"),A=e("level-codec"),S=x.getOptions,C=x.defaultOptions,T=x.getLevelDOWN,q=x.dispatchError
x.isDefined
l(i,u),i.prototype.open=function(e){var t,n,i=this
return this.isOpen()?(e&&r.nextTick(function(){e(null,i)}),this):this._isOpening()?e&&this.once("open",function(){e(null,i)}):(this.emit("opening"),this._status="opening",this.db=new d(this.location),t=this.options.db||T(),n=t(this.location),void n.open(this.options,function(t){return t?q(i,new w(t),e):(i.db.setDb(n),i.db=n,i._status="open",e&&e(null,i),i.emit("open"),i.emit("ready"),void 0)}))},i.prototype.close=function(e){var t=this
if(this.isOpen())this._status="closing",this.db.close(function(){t._status="closed",t.emit("closed"),e&&e.apply(null,arguments)}),this.emit("closing"),this.db=new d(this.location)
else{if("closed"==this._status&&e)return r.nextTick(e)
"closing"==this._status&&e?this.once("closed",e):this._isOpening()&&this.once("open",function(){t.close(e)})}},i.prototype.isOpen=function(){return"open"==this._status},i.prototype._isOpening=function(){return"opening"==this._status},i.prototype.isClosed=function(){return/^clos/.test(this._status)},i.prototype.get=function(e,t,r){var i,s=this
if(r=n(t,r),!o(this,t,r)){if(null===e||void 0===e||"function"!=typeof r)return a(this,"get() requires key and callback arguments",r)
t=x.getOptions(t),i=this._codec.encodeKey(e,t),t.asBuffer=this._codec.valueAsBuffer(t),this.db.get(i,t,function(n,i){if(n)return n=/notfound/i.test(n)||n.notFound?new y("Key not found in database ["+e+"]",n):new b(n),q(s,n,r)
if(r){try{i=s._codec.decodeValue(i,t)}catch(o){return r(new _(o))}r(null,i)}})}},i.prototype.put=function(e,t,r,i){var a,c,u=this
return i=n(r,i),null===e||void 0===e?s(this,"put() requires a key argument",i):void(o(this,r,i)||(r=S(r),a=this._codec.encodeKey(e,r),c=this._codec.encodeValue(t,r),this.db.put(a,c,r,function(r){return r?q(u,new v(r),i):(u.emit("put",e,t),void(i&&i()))})))},i.prototype.del=function(e,t,r){var i,a=this
return r=n(t,r),null===e||void 0===e?s(this,"del() requires a key argument",r):void(o(this,t,r)||(t=S(t),i=this._codec.encodeKey(e,t),this.db.del(i,t,function(t){return t?q(a,new v(t),r):(a.emit("del",e),void(r&&r()))})))},i.prototype.batch=function(e,t,r){var i,a=this
return arguments.length?(r=n(t,r),Array.isArray(e)?void(o(this,t,r)||(t=S(t),i=a._codec.encodeBatch(e,t),i=i.map(function(e){return e.type||void 0===e.key||void 0===e.value||(e.type="put"),e}),this.db.batch(i,t,function(t){return t?q(a,new v(t),r):(a.emit("batch",e),void(r&&r()))}))):s(this,"batch() requires an array argument",r)):new E(this,this._codec)},i.prototype.approximateSize=h(function(e,t,r,i){var o,s,c=this
return i=n(r,i),r=S(r),null===e||void 0===e||null===t||void 0===t||"function"!=typeof i?a(this,"approximateSize() requires start, end and callback arguments",i):(o=this._codec.encodeKey(e,r),s=this._codec.encodeKey(t,r),void this.db.approximateSize(o,s,function(e,t){return e?q(c,new w(e),i):void(i&&i(null,t))}))},"db.approximateSize() is deprecated. Use db.db.approximateSize() instead"),i.prototype.readStream=i.prototype.createReadStream=function(e){return e=f({keys:!0,values:!0},this.options,e),e.keyEncoding=e.keyEncoding,e.valueEncoding=e.valueEncoding,e=this._codec.encodeLtgt(e),e.keyAsBuffer=this._codec.keyAsBuffer(e),e.valueAsBuffer=this._codec.valueAsBuffer(e),"number"!=typeof e.limit&&(e.limit=-1),new g(this.db.iterator(e),f(e,{decoder:this._codec.createStreamDecoder(e)}))},i.prototype.keyStream=i.prototype.createKeyStream=function(e){return this.createReadStream(f(e,{keys:!0,values:!1}))},i.prototype.valueStream=i.prototype.createValueStream=function(e){return this.createReadStream(f(e,{keys:!1,values:!0}))},i.prototype.toString=function(){return"LevelUP"},t.exports=i,t.exports.errors=e("level-errors"),t.exports.destroy=h(c("destroy"),"levelup.destroy() is deprecated. Use leveldown.destroy() instead"),t.exports.repair=h(c("repair"),"levelup.repair() is deprecated. Use leveldown.repair() instead")}).call(this,e("_process"))},{"./batch":24,"./util":26,_process:211,"deferred-leveldown":27,events:208,"level-codec":31,"level-errors":33,"level-iterator-stream":37,prr:48,util:231,xtend:49}],26:[function(e,t,r){function n(e){return"string"==typeof e&&(e={valueEncoding:e}),"object"!=typeof e&&(e={}),e}function i(){if(c)return c
var t,r=e("../package.json").devDependencies.leveldown
try{t=e("leveldown/package").version}catch(n){throw o(n)}if(!e("semver").satisfies(t,r))throw new u("Installed version of LevelDOWN ("+t+") does not match required version ("+r+")")
try{return c=e("leveldown")}catch(n){throw o(n)}}function o(e){var t="Failed to require LevelDOWN (%s). Try `npm install leveldown` if it's missing"
return new u(l(t,e.message))}function s(e,t,r){"function"==typeof r?r(t):e.emit("error",t)}function a(e){return"undefined"!=typeof e}var c,u=(e("xtend"),e("level-errors").LevelUPError),l=e("util").format,h={createIfMissing:!0,errorIfExists:!1,keyEncoding:"utf8",valueEncoding:"utf8",compression:!0}
t.exports={defaultOptions:h,getOptions:n,getLevelDOWN:i,dispatchError:s,isDefined:a}},{"../package.json":50,"level-errors":33,leveldown:203,"leveldown/package":203,semver:203,util:231,xtend:49}],27:[function(e,t,r){(function(r,n){function i(e){a.call(this,"string"==typeof e?e:""),this._db=void 0,this._operations=[],this._iterators=[]}function o(e){c.call(this,e),this._options=e,this._iterator=null,this._operations=[]}var s=e("util"),a=e("abstract-leveldown").AbstractLevelDOWN,c=e("abstract-leveldown").AbstractIterator
s.inherits(i,a),i.prototype.setDb=function(e){this._db=e,this._operations.forEach(function(t){e[t.method].apply(e,t.args)}),this._iterators.forEach(function(t){t.setDb(e)})},i.prototype._open=function(e,t){return r.nextTick(t)},i.prototype._operation=function(e,t){return this._db?this._db[e].apply(this._db,t):void this._operations.push({method:e,args:t})},"put get del batch approximateSize".split(" ").forEach(function(e){i.prototype["_"+e]=function(){this._operation(e,arguments)}}),i.prototype._isBuffer=function(e){return n.isBuffer(e)},i.prototype._iterator=function(e){var t=new o(e)
return this._iterators.push(t),t},s.inherits(o,c),o.prototype.setDb=function(e){var t=this._iterator=e.iterator(this._options)
this._operations.forEach(function(e){t[e.method].apply(t,e.args)})},o.prototype._operation=function(e,t){return this._iterator?this._iterator[e].apply(this._iterator,t):void this._operations.push({method:e,args:t})},"next end".split(" ").forEach(function(e){o.prototype["_"+e]=function(){this._operation(e,arguments)}}),t.exports=i}).call(this,e("_process"),e("buffer").Buffer)},{_process:211,"abstract-leveldown":30,buffer:204,util:231}],28:[function(e,t,r){(function(e){function r(e){this._db=e,this._operations=[],this._written=!1}r.prototype._checkWritten=function(){if(this._written)throw new Error("write() already called on this batch")},r.prototype.put=function(e,t){this._checkWritten()
var r=this._db._checkKey(e,"key",this._db._isBuffer)
if(r)throw r
return this._db._isBuffer(e)||(e=String(e)),this._db._isBuffer(t)||(t=String(t)),"function"==typeof this._put?this._put(e,t):this._operations.push({type:"put",key:e,value:t}),this},r.prototype.del=function(e){this._checkWritten()
var t=this._db._checkKey(e,"key",this._db._isBuffer)
if(t)throw t
return this._db._isBuffer(e)||(e=String(e)),"function"==typeof this._del?this._del(e):this._operations.push({type:"del",key:e}),this},r.prototype.clear=function(){return this._checkWritten(),this._operations=[],"function"==typeof this._clear&&this._clear(),this},r.prototype.write=function(t,r){if(this._checkWritten(),"function"==typeof t&&(r=t),"function"!=typeof r)throw new Error("write() requires a callback argument")
return"object"!=typeof t&&(t={}),this._written=!0,"function"==typeof this._write?this._write(r):"function"==typeof this._db._batch?this._db._batch(this._operations,t,r):void e.nextTick(r)},t.exports=r}).call(this,e("_process"))},{_process:211}],29:[function(e,t,r){arguments[4][9][0].apply(r,arguments)},{_process:211,dup:9}],30:[function(e,t,r){(function(r,n){function i(e){if(!arguments.length||void 0===e)throw new Error("constructor requires at least a location argument")
if("string"!=typeof e)throw new Error("constructor requires a location string argument")
this.location=e}var o=e("xtend"),s=e("./abstract-iterator"),a=e("./abstract-chained-batch")
i.prototype.open=function(e,t){if("function"==typeof e&&(t=e),"function"!=typeof t)throw new Error("open() requires a callback argument")
return"object"!=typeof e&&(e={}),e.createIfMissing=0!=e.createIfMissing,e.errorIfExists=!!e.errorIfExists,"function"==typeof this._open?this._open(e,t):void r.nextTick(t)},i.prototype.close=function(e){if("function"!=typeof e)throw new Error("close() requires a callback argument")
return"function"==typeof this._close?this._close(e):void r.nextTick(e)},i.prototype.get=function(e,t,n){var i
if("function"==typeof t&&(n=t),"function"!=typeof n)throw new Error("get() requires a callback argument")
return(i=this._checkKey(e,"key",this._isBuffer))?n(i):(this._isBuffer(e)||(e=String(e)),"object"!=typeof t&&(t={}),t.asBuffer=0!=t.asBuffer,"function"==typeof this._get?this._get(e,t,n):void r.nextTick(function(){n(new Error("NotFound"))}))},i.prototype.put=function(e,t,n,i){var o
if("function"==typeof n&&(i=n),"function"!=typeof i)throw new Error("put() requires a callback argument")
return(o=this._checkKey(e,"key",this._isBuffer))?i(o):(this._isBuffer(e)||(e=String(e)),null==t||this._isBuffer(t)||r.browser||(t=String(t)),"object"!=typeof n&&(n={}),"function"==typeof this._put?this._put(e,t,n,i):void r.nextTick(i))},i.prototype.del=function(e,t,n){var i
if("function"==typeof t&&(n=t),"function"!=typeof n)throw new Error("del() requires a callback argument")
return(i=this._checkKey(e,"key",this._isBuffer))?n(i):(this._isBuffer(e)||(e=String(e)),"object"!=typeof t&&(t={}),"function"==typeof this._del?this._del(e,t,n):void r.nextTick(n))},i.prototype.batch=function(e,t,n){if(!arguments.length)return this._chainedBatch()
if("function"==typeof t&&(n=t),"function"==typeof e&&(n=e),"function"!=typeof n)throw new Error("batch(array) requires a callback argument")
if(!Array.isArray(e))return n(new Error("batch(array) requires an array argument"))
t&&"object"==typeof t||(t={})
for(var i,o,s=0,a=e.length;a>s;s++)if(i=e[s],"object"==typeof i){if(o=this._checkKey(i.type,"type",this._isBuffer))return n(o)
if(o=this._checkKey(i.key,"key",this._isBuffer))return n(o)}return"function"==typeof this._batch?this._batch(e,t,n):void r.nextTick(n)},i.prototype.approximateSize=function(e,t,n){if(null==e||null==t||"function"==typeof e||"function"==typeof t)throw new Error("approximateSize() requires valid `start`, `end` and `callback` arguments")
if("function"!=typeof n)throw new Error("approximateSize() requires a callback argument")
return this._isBuffer(e)||(e=String(e)),this._isBuffer(t)||(t=String(t)),"function"==typeof this._approximateSize?this._approximateSize(e,t,n):void r.nextTick(function(){n(null,0)})},i.prototype._setupIteratorOptions=function(e){var t=this
return e=o(e),["start","end","gt","gte","lt","lte"].forEach(function(r){e[r]&&t._isBuffer(e[r])&&0===e[r].length&&delete e[r]}),e.reverse=!!e.reverse,e.keys=0!=e.keys,e.values=0!=e.values,e.limit="limit"in e?e.limit:-1,e.keyAsBuffer=0!=e.keyAsBuffer,e.valueAsBuffer=0!=e.valueAsBuffer,e},i.prototype.iterator=function(e){return"object"!=typeof e&&(e={}),e=this._setupIteratorOptions(e),"function"==typeof this._iterator?this._iterator(e):new s(this)},i.prototype._chainedBatch=function(){return new a(this)},i.prototype._isBuffer=function(e){return n.isBuffer(e)},i.prototype._checkKey=function(e,t){if(null===e||void 0===e)return new Error(t+" cannot be `null` or `undefined`")
if(this._isBuffer(e)){if(0===e.length)return new Error(t+" cannot be an empty Buffer")}else if(""===String(e))return new Error(t+" cannot be an empty String")},t.exports.AbstractLevelDOWN=i,t.exports.AbstractIterator=s,t.exports.AbstractChainedBatch=a}).call(this,e("_process"),e("buffer").Buffer)},{"./abstract-chained-batch":28,"./abstract-iterator":29,_process:211,buffer:204,xtend:49}],31:[function(e,t,r){function n(e){this.opts=e||{},this.encodings=i}var i=e("./lib/encodings")
t.exports=n,n.prototype._encoding=function(e){return"string"==typeof e&&(e=i[e]),e||(e=i.id),e},n.prototype._keyEncoding=function(e,t){return this._encoding(t&&t.keyEncoding||e&&e.keyEncoding||this.opts.keyEncoding)},n.prototype._valueEncoding=function(e,t){return this._encoding(t&&t.valueEncoding||e&&e.valueEncoding||this.opts.valueEncoding)},n.prototype.encodeKey=function(e,t,r){return this._keyEncoding(t,r).encode(e)},n.prototype.encodeValue=function(e,t,r){return this._valueEncoding(t,r).encode(e)},n.prototype.decodeKey=function(e,t){return this._keyEncoding(t).decode(e)},n.prototype.decodeValue=function(e,t){return this._valueEncoding(t).decode(e)},n.prototype.encodeBatch=function(e,t){var r=this
return e.map(function(e){var n={type:e.type,key:r.encodeKey(e.key,t,e)}
return r.keyAsBuffer(t,e)&&(n.keyEncoding="binary"),e.prefix&&(n.prefix=e.prefix),"value"in e&&(n.value=r.encodeValue(e.value,t,e),r.valueAsBuffer(t,e)&&(n.valueEncoding="binary")),n})}
var o=["lt","gt","lte","gte","start","end"]
n.prototype.encodeLtgt=function(e){var t=this,r={}
return Object.keys(e).forEach(function(n){r[n]=o.indexOf(n)>-1?t.encodeKey(e[n],e):e[n]}),r},n.prototype.createStreamDecoder=function(e){var t=this
return e.keys&&e.values?function(r,n){return{key:t.decodeKey(r,e),value:t.decodeValue(n,e)}}:e.keys?function(r){return t.decodeKey(r,e)}:e.values?function(r,n){return t.decodeValue(n,e)}:function(){}},n.prototype.keyAsBuffer=function(e){return this._keyEncoding(e).buffer},n.prototype.valueAsBuffer=function(e){return this._valueEncoding(e).buffer}},{"./lib/encodings":32}],32:[function(e,t,r){(function(e){function t(e){return e}function n(t){return void 0===t||null===t||e.isBuffer(t)}r.utf8=r["utf-8"]={encode:function(e){return n(e)?e:String(e)},decode:t,buffer:!1,type:"utf8"},r.json={encode:JSON.stringify,decode:JSON.parse,buffer:!1,type:"json"},r.binary={encode:function(t){return n(t)?t:new e(t)},decode:t,buffer:!0,type:"binary"},r.id={encode:function(e){return e},decode:function(e){return e},buffer:!1,type:"id"}
var i=["hex","ascii","base64","ucs2","ucs-2","utf16le","utf-16le"]
i.forEach(function(t){r[t]={encode:function(r){return n(r)?r:new e(r,t)},decode:function(e){return e.toString(t)},buffer:!0,type:t}})}).call(this,e("buffer").Buffer)},{buffer:204}],33:[function(e,t,r){var n=e("errno").create,i=n("LevelUPError"),o=n("NotFoundError",i)
o.prototype.notFound=!0,o.prototype.status=404,t.exports={LevelUPError:i,InitializationError:n("InitializationError",i),OpenError:n("OpenError",i),ReadError:n("ReadError",i),WriteError:n("WriteError",i),NotFoundError:o,EncodingError:n("EncodingError",i)}},{errno:35}],34:[function(e,t,r){function n(e,t,r){s(this,{type:e,name:e,cause:"string"!=typeof t?t:r,message:t&&"string"!=typeof t?t.message:t},"ewr")}function i(e,t){Error.call(this),Error.captureStackTrace&&Error.captureStackTrace(this,arguments.callee),n.call(this,"CustomError",e,t)}function o(e,t,r){var o=function(r,i){n.call(this,t,r,i),"FilesystemError"==t&&(this.code=this.cause.code,this.path=this.cause.path,this.errno=this.cause.errno,this.message=(e.errno[this.cause.errno]?e.errno[this.cause.errno].description:this.cause.message)+(this.cause.path?" ["+this.cause.path+"]":"")),Error.call(this),Error.captureStackTrace&&Error.captureStackTrace(this,arguments.callee)}
return o.prototype=r?new r:new i,o}var s=e("prr")
i.prototype=new Error,t.exports=function(e){var t=function(t,r){return o(e,t,r)}
return{CustomError:i,FilesystemError:t("FilesystemError"),createError:t}}},{prr:36}],35:[function(e,t,r){var n=t.exports.all=[{errno:-2,code:"ENOENT",description:"no such file or directory"},{errno:-1,code:"UNKNOWN",description:"unknown error"},{errno:0,code:"OK",description:"success"},{errno:1,code:"EOF",description:"end of file"},{errno:2,code:"EADDRINFO",description:"getaddrinfo error"},{errno:3,code:"EACCES",description:"permission denied"},{errno:4,code:"EAGAIN",description:"resource temporarily unavailable"},{errno:5,code:"EADDRINUSE",description:"address already in use"},{errno:6,code:"EADDRNOTAVAIL",description:"address not available"},{errno:7,code:"EAFNOSUPPORT",description:"address family not supported"},{errno:8,code:"EALREADY",description:"connection already in progress"},{errno:9,code:"EBADF",description:"bad file descriptor"},{errno:10,code:"EBUSY",description:"resource busy or locked"},{errno:11,code:"ECONNABORTED",description:"software caused connection abort"},{errno:12,code:"ECONNREFUSED",description:"connection refused"},{errno:13,code:"ECONNRESET",description:"connection reset by peer"},{errno:14,code:"EDESTADDRREQ",description:"destination address required"},{errno:15,code:"EFAULT",description:"bad address in system call argument"},{errno:16,code:"EHOSTUNREACH",description:"host is unreachable"},{errno:17,code:"EINTR",description:"interrupted system call"},{errno:18,code:"EINVAL",description:"invalid argument"},{errno:19,code:"EISCONN",description:"socket is already connected"},{errno:20,code:"EMFILE",description:"too many open files"},{errno:21,code:"EMSGSIZE",description:"message too long"},{errno:22,code:"ENETDOWN",description:"network is down"},{errno:23,code:"ENETUNREACH",description:"network is unreachable"},{errno:24,code:"ENFILE",description:"file table overflow"},{errno:25,code:"ENOBUFS",description:"no buffer space available"},{errno:26,code:"ENOMEM",description:"not enough memory"},{errno:27,code:"ENOTDIR",description:"not a directory"},{errno:28,code:"EISDIR",description:"illegal operation on a directory"},{errno:29,code:"ENONET",description:"machine is not on the network"},{errno:31,code:"ENOTCONN",description:"socket is not connected"},{errno:32,code:"ENOTSOCK",description:"socket operation on non-socket"},{errno:33,code:"ENOTSUP",description:"operation not supported on socket"},{errno:34,code:"ENOENT",description:"no such file or directory"},{errno:35,code:"ENOSYS",description:"function not implemented"},{errno:36,code:"EPIPE",description:"broken pipe"},{errno:37,code:"EPROTO",description:"protocol error"},{errno:38,code:"EPROTONOSUPPORT",description:"protocol not supported"},{errno:39,code:"EPROTOTYPE",description:"protocol wrong type for socket"},{errno:40,code:"ETIMEDOUT",description:"connection timed out"},{errno:41,code:"ECHARSET",description:"invalid Unicode character"},{errno:42,code:"EAIFAMNOSUPPORT",description:"address family for hostname not supported"},{errno:44,code:"EAISERVICE",description:"servname not supported for ai_socktype"},{errno:45,code:"EAISOCKTYPE",description:"ai_socktype not supported"},{errno:46,code:"ESHUTDOWN",description:"cannot send after transport endpoint shutdown"},{errno:47,code:"EEXIST",description:"file already exists"},{errno:48,code:"ESRCH",description:"no such process"},{errno:49,code:"ENAMETOOLONG",description:"name too long"},{errno:50,code:"EPERM",description:"operation not permitted"},{errno:51,code:"ELOOP",description:"too many symbolic links encountered"},{errno:52,code:"EXDEV",description:"cross-device link not permitted"},{errno:53,code:"ENOTEMPTY",description:"directory not empty"},{errno:54,code:"ENOSPC",description:"no space left on device"},{errno:55,code:"EIO",description:"i/o error"},{errno:56,code:"EROFS",description:"read-only file system"},{errno:57,code:"ENODEV",description:"no such device"},{errno:58,code:"ESPIPE",description:"invalid seek"},{errno:59,code:"ECANCELED",description:"operation canceled"}]
t.exports.errno={},t.exports.code={},n.forEach(function(e){t.exports.errno[e.errno]=e,t.exports.code[e.code]=e}),t.exports.custom=e("./custom")(t.exports),t.exports.create=t.exports.custom.createError},{"./custom":34}],36:[function(e,t,r){!function(e,r,n){"undefined"!=typeof t&&t.exports?t.exports=n():r[e]=n()}("prr",this,function(){var e="function"==typeof Object.defineProperty?function(e,t,r){return Object.defineProperty(e,t,r),e}:function(e,t,r){return e[t]=r.value,e},t=function(e,t){var r="object"==typeof t,n=!r&&"string"==typeof t,i=function(e){return r?!!t[e]:n?t.indexOf(e[0])>-1:!1}
return{enumerable:i("enumerable"),configurable:i("configurable"),writable:i("writable"),value:e}},r=function(r,n,i,o){var s
if(o=t(i,o),"object"==typeof n){for(s in n)Object.hasOwnProperty.call(n,s)&&(o.value=n[s],e(r,s,o))
return r}return e(r,n,o)}
return r})},{}],37:[function(e,t,r){function n(e,t){return this instanceof n?(o.call(this,s(t,{objectMode:!0})),this._iterator=e,this._destroyed=!1,this._decoder=null,t&&t.decoder&&(this._decoder=t.decoder),void this.on("end",this._cleanup.bind(this))):new n(e,t)}var i=e("inherits"),o=e("readable-stream").Readable,s=e("xtend"),a=e("level-errors").EncodingError
t.exports=n,i(n,o),n.prototype._read=function(){var e=this
this._destroyed||this._iterator.next(function(t,r,n){if(!e._destroyed){if(t)return e.emit("error",t)
if(void 0===r&&void 0===n)e.push(null)
else{if(!e._decoder)return e.push({key:r,value:n})
try{var n=e._decoder(r,n)}catch(t){return e.emit("error",new a(t)),void e.push(null)}e.push(n)}}})},n.prototype.destroy=n.prototype._cleanup=function(){var e=this
this._destroyed||(this._destroyed=!0,this._iterator.end(function(t){return t?e.emit("error",t):void e.emit("close")}))}},{inherits:38,"level-errors":33,"readable-stream":47,xtend:49}],38:[function(e,t,r){arguments[4][14][0].apply(r,arguments)},{dup:14}],39:[function(e,t,r){(function(r){function n(e){return this instanceof n?(c.call(this,e),u.call(this,e),e&&e.readable===!1&&(this.readable=!1),e&&e.writable===!1&&(this.writable=!1),this.allowHalfOpen=!0,e&&e.allowHalfOpen===!1&&(this.allowHalfOpen=!1),void this.once("end",i)):new n(e)}function i(){this.allowHalfOpen||this._writableState.ended||r.nextTick(this.end.bind(this))}function o(e,t){for(var r=0,n=e.length;n>r;r++)t(e[r],r)}t.exports=n
var s=Object.keys||function(e){var t=[]
for(var r in e)t.push(r)
return t},a=e("core-util-is")
a.inherits=e("inherits")
var c=e("./_stream_readable"),u=e("./_stream_writable")
a.inherits(n,c),o(s(u.prototype),function(e){n.prototype[e]||(n.prototype[e]=u.prototype[e])})}).call(this,e("_process"))},{"./_stream_readable":41,"./_stream_writable":43,_process:211,"core-util-is":44,inherits:38}],40:[function(e,t,r){function n(e){return this instanceof n?void i.call(this,e):new n(e)}t.exports=n
var i=e("./_stream_transform"),o=e("core-util-is")
o.inherits=e("inherits"),o.inherits(n,i),n.prototype._transform=function(e,t,r){r(null,e)}},{"./_stream_transform":42,"core-util-is":44,inherits:38}],41:[function(e,t,r){(function(r){function n(t,r){var n=e("./_stream_duplex")
t=t||{}
var i=t.highWaterMark,o=t.objectMode?16:16384
this.highWaterMark=i||0===i?i:o,this.highWaterMark=~~this.highWaterMark,this.buffer=[],this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.objectMode=!!t.objectMode,r instanceof n&&(this.objectMode=this.objectMode||!!t.readableObjectMode),this.defaultEncoding=t.defaultEncoding||"utf8",this.ranOut=!1,this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,t.encoding&&(T||(T=e("string_decoder/").StringDecoder),this.decoder=new T(t.encoding),this.encoding=t.encoding)}function i(t){e("./_stream_duplex")
return this instanceof i?(this._readableState=new n(t,this),this.readable=!0,void S.call(this)):new i(t)}function o(e,t,r,n,i){var o=u(t,r)
if(o)e.emit("error",o)
else if(C.isNullOrUndefined(r))t.reading=!1,t.ended||l(e,t)
else if(t.objectMode||r&&r.length>0)if(t.ended&&!i){var a=new Error("stream.push() after EOF")
e.emit("error",a)}else if(t.endEmitted&&i){var a=new Error("stream.unshift() after end event")
e.emit("error",a)}else!t.decoder||i||n||(r=t.decoder.write(r)),i||(t.reading=!1),t.flowing&&0===t.length&&!t.sync?(e.emit("data",r),e.read(0)):(t.length+=t.objectMode?1:r.length,i?t.buffer.unshift(r):t.buffer.push(r),t.needReadable&&h(e)),p(e,t)
else i||(t.reading=!1)
return s(t)}function s(e){return!e.ended&&(e.needReadable||e.length<e.highWaterMark||0===e.length)}function a(e){if(e>=j)e=j
else{e--
for(var t=1;32>t;t<<=1)e|=e>>t
e++}return e}function c(e,t){return 0===t.length&&t.ended?0:t.objectMode?0===e?0:1:isNaN(e)||C.isNull(e)?t.flowing&&t.buffer.length?t.buffer[0].length:t.length:0>=e?0:(e>t.highWaterMark&&(t.highWaterMark=a(e)),e>t.length?t.ended?t.length:(t.needReadable=!0,0):e)}function u(e,t){var r=null
return C.isBuffer(t)||C.isString(t)||C.isNullOrUndefined(t)||e.objectMode||(r=new TypeError("Invalid non-string/buffer chunk")),r}function l(e,t){if(t.decoder&&!t.ended){var r=t.decoder.end()
r&&r.length&&(t.buffer.push(r),t.length+=t.objectMode?1:r.length)}t.ended=!0,h(e)}function h(e){var t=e._readableState
t.needReadable=!1,t.emittedReadable||(q("emitReadable",t.flowing),t.emittedReadable=!0,t.sync?r.nextTick(function(){f(e)}):f(e))}function f(e){q("emit readable"),e.emit("readable"),b(e)}function p(e,t){t.readingMore||(t.readingMore=!0,r.nextTick(function(){d(e,t)}))}function d(e,t){for(var r=t.length;!t.reading&&!t.flowing&&!t.ended&&t.length<t.highWaterMark&&(q("maybeReadMore read 0"),e.read(0),r!==t.length);)r=t.length
t.readingMore=!1}function g(e){return function(){var t=e._readableState
q("pipeOnDrain",t.awaitDrain),t.awaitDrain&&t.awaitDrain--,0===t.awaitDrain&&A.listenerCount(e,"data")&&(t.flowing=!0,b(e))}}function m(e,t){t.resumeScheduled||(t.resumeScheduled=!0,r.nextTick(function(){v(e,t)}))}function v(e,t){t.resumeScheduled=!1,e.emit("resume"),b(e),t.flowing&&!t.reading&&e.read(0)}function b(e){var t=e._readableState
if(q("flow",t.flowing),t.flowing)do var r=e.read()
while(null!==r&&t.flowing)}function y(e,t){var r,n=t.buffer,i=t.length,o=!!t.decoder,s=!!t.objectMode
if(0===n.length)return null
if(0===i)r=null
else if(s)r=n.shift()
else if(!e||e>=i)r=o?n.join(""):E.concat(n,i),n.length=0
else if(e<n[0].length){var a=n[0]
r=a.slice(0,e),n[0]=a.slice(e)}else if(e===n[0].length)r=n.shift()
else{r=o?"":new E(e)
for(var c=0,u=0,l=n.length;l>u&&e>c;u++){var a=n[0],h=Math.min(e-c,a.length)
o?r+=a.slice(0,h):a.copy(r,c,0,h),h<a.length?n[0]=a.slice(h):n.shift(),c+=h}}return r}function w(e){var t=e._readableState
if(t.length>0)throw new Error("endReadable called on non-empty stream")
t.endEmitted||(t.ended=!0,r.nextTick(function(){t.endEmitted||0!==t.length||(t.endEmitted=!0,e.readable=!1,e.emit("end"))}))}function _(e,t){for(var r=0,n=e.length;n>r;r++)t(e[r],r)}function k(e,t){for(var r=0,n=e.length;n>r;r++)if(e[r]===t)return r
return-1}t.exports=i
var x=e("isarray"),E=e("buffer").Buffer
i.ReadableState=n
var A=e("events").EventEmitter
A.listenerCount||(A.listenerCount=function(e,t){return e.listeners(t).length})
var S=e("stream"),C=e("core-util-is")
C.inherits=e("inherits")
var T,q=e("util")
q=q&&q.debuglog?q.debuglog("stream"):function(){},C.inherits(i,S),i.prototype.push=function(e,t){var r=this._readableState
return C.isString(e)&&!r.objectMode&&(t=t||r.defaultEncoding,t!==r.encoding&&(e=new E(e,t),t="")),o(this,r,e,t,!1)},i.prototype.unshift=function(e){var t=this._readableState
return o(this,t,e,"",!0)},i.prototype.setEncoding=function(t){return T||(T=e("string_decoder/").StringDecoder),this._readableState.decoder=new T(t),this._readableState.encoding=t,this}
var j=8388608
i.prototype.read=function(e){q("read",e)
var t=this._readableState,r=e
if((!C.isNumber(e)||e>0)&&(t.emittedReadable=!1),0===e&&t.needReadable&&(t.length>=t.highWaterMark||t.ended))return q("read: emitReadable",t.length,t.ended),0===t.length&&t.ended?w(this):h(this),null
if(e=c(e,t),0===e&&t.ended)return 0===t.length&&w(this),null
var n=t.needReadable
q("need readable",n),(0===t.length||t.length-e<t.highWaterMark)&&(n=!0,q("length less than watermark",n)),(t.ended||t.reading)&&(n=!1,q("reading or ended",n)),n&&(q("do read"),t.reading=!0,t.sync=!0,0===t.length&&(t.needReadable=!0),this._read(t.highWaterMark),t.sync=!1),n&&!t.reading&&(e=c(r,t))
var i
return i=e>0?y(e,t):null,C.isNull(i)&&(t.needReadable=!0,e=0),t.length-=e,0!==t.length||t.ended||(t.needReadable=!0),r!==e&&t.ended&&0===t.length&&w(this),C.isNull(i)||this.emit("data",i),i},i.prototype._read=function(e){this.emit("error",new Error("not implemented"))},i.prototype.pipe=function(e,t){function n(e){q("onunpipe"),e===h&&o()}function i(){q("onend"),e.end()}function o(){q("cleanup"),e.removeListener("close",c),e.removeListener("finish",u),e.removeListener("drain",m),e.removeListener("error",a),e.removeListener("unpipe",n),h.removeListener("end",i),h.removeListener("end",o),h.removeListener("data",s),!f.awaitDrain||e._writableState&&!e._writableState.needDrain||m()}function s(t){q("ondata")
var r=e.write(t)
!1===r&&(q("false write response, pause",h._readableState.awaitDrain),h._readableState.awaitDrain++,h.pause())}function a(t){q("onerror",t),l(),e.removeListener("error",a),0===A.listenerCount(e,"error")&&e.emit("error",t)}function c(){e.removeListener("finish",u),l()}function u(){q("onfinish"),e.removeListener("close",c),l()}function l(){q("unpipe"),h.unpipe(e)}var h=this,f=this._readableState
switch(f.pipesCount){case 0:f.pipes=e
break
case 1:f.pipes=[f.pipes,e]
break
default:f.pipes.push(e)}f.pipesCount+=1,q("pipe count=%d opts=%j",f.pipesCount,t)
var p=(!t||t.end!==!1)&&e!==r.stdout&&e!==r.stderr,d=p?i:o
f.endEmitted?r.nextTick(d):h.once("end",d),e.on("unpipe",n)
var m=g(h)
return e.on("drain",m),h.on("data",s),e._events&&e._events.error?x(e._events.error)?e._events.error.unshift(a):e._events.error=[a,e._events.error]:e.on("error",a),e.once("close",c),e.once("finish",u),e.emit("pipe",h),f.flowing||(q("pipe resume"),h.resume()),e},i.prototype.unpipe=function(e){var t=this._readableState
if(0===t.pipesCount)return this
if(1===t.pipesCount)return e&&e!==t.pipes?this:(e||(e=t.pipes),t.pipes=null,t.pipesCount=0,t.flowing=!1,e&&e.emit("unpipe",this),this)
if(!e){var r=t.pipes,n=t.pipesCount
t.pipes=null,t.pipesCount=0,t.flowing=!1
for(var i=0;n>i;i++)r[i].emit("unpipe",this)
return this}var i=k(t.pipes,e)
return-1===i?this:(t.pipes.splice(i,1),t.pipesCount-=1,1===t.pipesCount&&(t.pipes=t.pipes[0]),e.emit("unpipe",this),this)},i.prototype.on=function(e,t){var n=S.prototype.on.call(this,e,t)
if("data"===e&&!1!==this._readableState.flowing&&this.resume(),"readable"===e&&this.readable){var i=this._readableState
if(!i.readableListening)if(i.readableListening=!0,i.emittedReadable=!1,i.needReadable=!0,i.reading)i.length&&h(this,i)
else{var o=this
r.nextTick(function(){q("readable nexttick read 0"),o.read(0)})}}return n},i.prototype.addListener=i.prototype.on,i.prototype.resume=function(){var e=this._readableState
return e.flowing||(q("resume"),e.flowing=!0,e.reading||(q("resume read 0"),this.read(0)),m(this,e)),this},i.prototype.pause=function(){return q("call pause flowing=%j",this._readableState.flowing),!1!==this._readableState.flowing&&(q("pause"),this._readableState.flowing=!1,this.emit("pause")),this},i.prototype.wrap=function(e){var t=this._readableState,r=!1,n=this
e.on("end",function(){if(q("wrapped end"),t.decoder&&!t.ended){var e=t.decoder.end()
e&&e.length&&n.push(e)}n.push(null)}),e.on("data",function(i){if(q("wrapped data"),t.decoder&&(i=t.decoder.write(i)),i&&(t.objectMode||i.length)){var o=n.push(i)
o||(r=!0,e.pause())}})
for(var i in e)C.isFunction(e[i])&&C.isUndefined(this[i])&&(this[i]=function(t){return function(){return e[t].apply(e,arguments)}}(i))
var o=["error","close","destroy","pause","resume"]
return _(o,function(t){e.on(t,n.emit.bind(n,t))}),n._read=function(t){q("wrapped _read",t),r&&(r=!1,e.resume())},n},i._fromList=y}).call(this,e("_process"))},{"./_stream_duplex":39,_process:211,buffer:204,"core-util-is":44,events:208,inherits:38,isarray:45,stream:227,"string_decoder/":46,util:203}],42:[function(e,t,r){function n(e,t){this.afterTransform=function(e,r){return i(t,e,r)},this.needTransform=!1,this.transforming=!1,this.writecb=null,this.writechunk=null}function i(e,t,r){var n=e._transformState
n.transforming=!1
var i=n.writecb
if(!i)return e.emit("error",new Error("no writecb in Transform class"))
n.writechunk=null,n.writecb=null,c.isNullOrUndefined(r)||e.push(r),i&&i(t)
var o=e._readableState
o.reading=!1,(o.needReadable||o.length<o.highWaterMark)&&e._read(o.highWaterMark)}function o(e){if(!(this instanceof o))return new o(e)
a.call(this,e),this._transformState=new n(e,this)
var t=this
this._readableState.needReadable=!0,this._readableState.sync=!1,this.once("prefinish",function(){c.isFunction(this._flush)?this._flush(function(e){s(t,e)}):s(t)})}function s(e,t){if(t)return e.emit("error",t)
var r=e._writableState,n=e._transformState
if(r.length)throw new Error("calling transform done when ws.length != 0")
if(n.transforming)throw new Error("calling transform done when still transforming")
return e.push(null)}t.exports=o
var a=e("./_stream_duplex"),c=e("core-util-is")
c.inherits=e("inherits"),c.inherits(o,a),o.prototype.push=function(e,t){return this._transformState.needTransform=!1,a.prototype.push.call(this,e,t)},o.prototype._transform=function(e,t,r){throw new Error("not implemented")},o.prototype._write=function(e,t,r){var n=this._transformState
if(n.writecb=r,n.writechunk=e,n.writeencoding=t,!n.transforming){var i=this._readableState;(n.needTransform||i.needReadable||i.length<i.highWaterMark)&&this._read(i.highWaterMark)}},o.prototype._read=function(e){var t=this._transformState
c.isNull(t.writechunk)||!t.writecb||t.transforming?t.needTransform=!0:(t.transforming=!0,this._transform(t.writechunk,t.writeencoding,t.afterTransform))}},{"./_stream_duplex":39,"core-util-is":44,inherits:38}],43:[function(e,t,r){(function(r){function n(e,t,r){this.chunk=e,this.encoding=t,this.callback=r}function i(t,r){var n=e("./_stream_duplex")
t=t||{}
var i=t.highWaterMark,o=t.objectMode?16:16384
this.highWaterMark=i||0===i?i:o,this.objectMode=!!t.objectMode,r instanceof n&&(this.objectMode=this.objectMode||!!t.writableObjectMode),this.highWaterMark=~~this.highWaterMark,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1
var s=t.decodeStrings===!1
this.decodeStrings=!s,this.defaultEncoding=t.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(e){p(r,e)},this.writecb=null,this.writelen=0,this.buffer=[],this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1}function o(t){var r=e("./_stream_duplex")
return this instanceof o||this instanceof r?(this._writableState=new i(t,this),this.writable=!0,void x.call(this)):new o(t)}function s(e,t,n){var i=new Error("write after end")
e.emit("error",i),r.nextTick(function(){n(i)})}function a(e,t,n,i){var o=!0
if(!(k.isBuffer(n)||k.isString(n)||k.isNullOrUndefined(n)||t.objectMode)){var s=new TypeError("Invalid non-string/buffer chunk")
e.emit("error",s),r.nextTick(function(){i(s)}),o=!1}return o}function c(e,t,r){return!e.objectMode&&e.decodeStrings!==!1&&k.isString(t)&&(t=new _(t,r)),t}function u(e,t,r,i,o){r=c(t,r,i),k.isBuffer(r)&&(i="buffer")
var s=t.objectMode?1:r.length
t.length+=s
var a=t.length<t.highWaterMark
return a||(t.needDrain=!0),t.writing||t.corked?t.buffer.push(new n(r,i,o)):l(e,t,!1,s,r,i,o),a}function l(e,t,r,n,i,o,s){t.writelen=n,t.writecb=s,t.writing=!0,t.sync=!0,r?e._writev(i,t.onwrite):e._write(i,o,t.onwrite),t.sync=!1}function h(e,t,n,i,o){n?r.nextTick(function(){t.pendingcb--,o(i)}):(t.pendingcb--,o(i)),e._writableState.errorEmitted=!0,e.emit("error",i)}function f(e){e.writing=!1,e.writecb=null,e.length-=e.writelen,e.writelen=0}function p(e,t){var n=e._writableState,i=n.sync,o=n.writecb
if(f(n),t)h(e,n,i,t,o)
else{var s=v(e,n)
s||n.corked||n.bufferProcessing||!n.buffer.length||m(e,n),i?r.nextTick(function(){d(e,n,s,o)}):d(e,n,s,o)}}function d(e,t,r,n){r||g(e,t),t.pendingcb--,n(),y(e,t)}function g(e,t){0===t.length&&t.needDrain&&(t.needDrain=!1,e.emit("drain"))}function m(e,t){if(t.bufferProcessing=!0,e._writev&&t.buffer.length>1){for(var r=[],n=0;n<t.buffer.length;n++)r.push(t.buffer[n].callback)
t.pendingcb++,l(e,t,!0,t.length,t.buffer,"",function(e){for(var n=0;n<r.length;n++)t.pendingcb--,r[n](e)}),t.buffer=[]}else{for(var n=0;n<t.buffer.length;n++){var i=t.buffer[n],o=i.chunk,s=i.encoding,a=i.callback,c=t.objectMode?1:o.length
if(l(e,t,!1,c,o,s,a),t.writing){n++
break}}n<t.buffer.length?t.buffer=t.buffer.slice(n):t.buffer.length=0}t.bufferProcessing=!1}function v(e,t){return t.ending&&0===t.length&&!t.finished&&!t.writing}function b(e,t){t.prefinished||(t.prefinished=!0,e.emit("prefinish"))}function y(e,t){var r=v(e,t)
return r&&(0===t.pendingcb?(b(e,t),t.finished=!0,e.emit("finish")):b(e,t)),r}function w(e,t,n){t.ending=!0,y(e,t),n&&(t.finished?r.nextTick(n):e.once("finish",n)),t.ended=!0}t.exports=o
var _=e("buffer").Buffer
o.WritableState=i
var k=e("core-util-is")
k.inherits=e("inherits")
var x=e("stream")
k.inherits(o,x),o.prototype.pipe=function(){this.emit("error",new Error("Cannot pipe. Not readable."))},o.prototype.write=function(e,t,r){var n=this._writableState,i=!1
return k.isFunction(t)&&(r=t,t=null),k.isBuffer(e)?t="buffer":t||(t=n.defaultEncoding),k.isFunction(r)||(r=function(){}),n.ended?s(this,n,r):a(this,n,e,r)&&(n.pendingcb++,i=u(this,n,e,t,r)),i},o.prototype.cork=function(){var e=this._writableState
e.corked++},o.prototype.uncork=function(){var e=this._writableState
e.corked&&(e.corked--,e.writing||e.corked||e.finished||e.bufferProcessing||!e.buffer.length||m(this,e))},o.prototype._write=function(e,t,r){r(new Error("not implemented"))},o.prototype._writev=null,o.prototype.end=function(e,t,r){var n=this._writableState
k.isFunction(e)?(r=e,e=null,t=null):k.isFunction(t)&&(r=t,t=null),k.isNullOrUndefined(e)||this.write(e,t),n.corked&&(n.corked=1,this.uncork()),n.ending||n.finished||w(this,n,r)}}).call(this,e("_process"))},{"./_stream_duplex":39,_process:211,buffer:204,"core-util-is":44,inherits:38,stream:227}],44:[function(e,t,r){(function(e){function t(e){return Array.isArray?Array.isArray(e):"[object Array]"===m(e)}function n(e){return"boolean"==typeof e}function i(e){return null===e}function o(e){return null==e}function s(e){return"number"==typeof e}function a(e){return"string"==typeof e}function c(e){return"symbol"==typeof e}function u(e){return void 0===e}function l(e){return"[object RegExp]"===m(e)}function h(e){return"object"==typeof e&&null!==e}function f(e){return"[object Date]"===m(e)}function p(e){return"[object Error]"===m(e)||e instanceof Error}function d(e){return"function"==typeof e}function g(e){return null===e||"boolean"==typeof e||"number"==typeof e||"string"==typeof e||"symbol"==typeof e||"undefined"==typeof e}function m(e){return Object.prototype.toString.call(e)}r.isArray=t,r.isBoolean=n,r.isNull=i,r.isNullOrUndefined=o,r.isNumber=s,r.isString=a,r.isSymbol=c,r.isUndefined=u,r.isRegExp=l,r.isObject=h,r.isDate=f,r.isError=p,r.isFunction=d,r.isPrimitive=g,r.isBuffer=e.isBuffer}).call(this,e("buffer").Buffer)},{buffer:204}],45:[function(e,t,r){arguments[4][22][0].apply(r,arguments)},{dup:22}],46:[function(e,t,r){function n(e){if(e&&!c(e))throw new Error("Unknown encoding: "+e)}function i(e){return e.toString(this.encoding)}function o(e){this.charReceived=e.length%2,this.charLength=this.charReceived?2:0}function s(e){this.charReceived=e.length%3,this.charLength=this.charReceived?3:0}var a=e("buffer").Buffer,c=a.isEncoding||function(e){switch(e&&e.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0
default:return!1}},u=r.StringDecoder=function(e){switch(this.encoding=(e||"utf8").toLowerCase().replace(/[-_]/,""),n(e),this.encoding){case"utf8":this.surrogateSize=3
break
case"ucs2":case"utf16le":this.surrogateSize=2,this.detectIncompleteChar=o
break
case"base64":this.surrogateSize=3,this.detectIncompleteChar=s
break
default:return void(this.write=i)}this.charBuffer=new a(6),this.charReceived=0,this.charLength=0}
u.prototype.write=function(e){for(var t="";this.charLength;){var r=e.length>=this.charLength-this.charReceived?this.charLength-this.charReceived:e.length
if(e.copy(this.charBuffer,this.charReceived,0,r),this.charReceived+=r,this.charReceived<this.charLength)return""
e=e.slice(r,e.length),t=this.charBuffer.slice(0,this.charLength).toString(this.encoding)
var n=t.charCodeAt(t.length-1)
if(!(n>=55296&&56319>=n)){if(this.charReceived=this.charLength=0,0===e.length)return t
break}this.charLength+=this.surrogateSize,t=""}this.detectIncompleteChar(e)
var i=e.length
this.charLength&&(e.copy(this.charBuffer,0,e.length-this.charReceived,i),i-=this.charReceived),t+=e.toString(this.encoding,0,i)
var i=t.length-1,n=t.charCodeAt(i)
if(n>=55296&&56319>=n){var o=this.surrogateSize
return this.charLength+=o,this.charReceived+=o,this.charBuffer.copy(this.charBuffer,o,0,o),e.copy(this.charBuffer,0,0,o),t.substring(0,i)}return t},u.prototype.detectIncompleteChar=function(e){for(var t=e.length>=3?3:e.length;t>0;t--){var r=e[e.length-t]
if(1==t&&r>>5==6){this.charLength=2
break}if(2>=t&&r>>4==14){this.charLength=3
break}if(3>=t&&r>>3==30){this.charLength=4
break}}this.charReceived=t},u.prototype.end=function(e){var t=""
if(e&&e.length&&(t=this.write(e)),this.charReceived){var r=this.charReceived,n=this.charBuffer,i=this.encoding
t+=n.slice(0,r).toString(i)}return t}},{buffer:204}],47:[function(e,t,r){r=t.exports=e("./lib/_stream_readable.js"),r.Stream=e("stream"),r.Readable=r,r.Writable=e("./lib/_stream_writable.js"),r.Duplex=e("./lib/_stream_duplex.js"),r.Transform=e("./lib/_stream_transform.js"),r.PassThrough=e("./lib/_stream_passthrough.js")},{"./lib/_stream_duplex.js":39,"./lib/_stream_passthrough.js":40,"./lib/_stream_readable.js":41,"./lib/_stream_transform.js":42,"./lib/_stream_writable.js":43,stream:227}],48:[function(e,t,r){arguments[4][36][0].apply(r,arguments)},{dup:36}],49:[function(e,t,r){arguments[4][23][0].apply(r,arguments)},{dup:23}],50:[function(e,t,r){t.exports={name:"levelup",description:"Fast & simple storage - a Node.js-style LevelDB wrapper",version:"1.2.1",contributors:[{name:"Rod Vagg",email:"r@va.gg",url:"https://github.com/rvagg"},{name:"John Chesley",email:"john@chesl.es",url:"https://github.com/chesles/"},{name:"Jake Verbaten",email:"raynos2@gmail.com",url:"https://github.com/raynos"},{name:"Dominic Tarr",email:"dominic.tarr@gmail.com",url:"https://github.com/dominictarr"},{name:"Max Ogden",email:"max@maxogden.com",url:"https://github.com/maxogden"},{name:"Lars-Magnus Skog",email:"ralphtheninja@riseup.net",url:"https://github.com/ralphtheninja"},{name:"David Björklund",email:"david.bjorklund@gmail.com",url:"https://github.com/kesla"},{name:"Julian Gruber",email:"julian@juliangruber.com",url:"https://github.com/juliangruber"},{name:"Paolo Fragomeni",email:"paolo@async.ly",url:"https://github.com/hij1nx"},{name:"Anton Whalley",email:"anton.whalley@nearform.com",url:"https://github.com/No9"},{name:"Matteo Collina",email:"matteo.collina@gmail.com",url:"https://github.com/mcollina"},{name:"Pedro Teixeira",email:"pedro.teixeira@gmail.com",url:"https://github.com/pgte"},{name:"James Halliday",email:"mail@substack.net",url:"https://github.com/substack"},{name:"Jarrett Cruger",email:"jcrugzz@gmail.com",url:"https://github.com/jcrugzz"}],repository:{type:"git",url:"git+https://github.com/level/levelup.git"},homepage:"https://github.com/level/levelup",keywords:["leveldb","stream","database","db","store","storage","json"],main:"lib/levelup.js",dependencies:{"deferred-leveldown":"~1.0.0","level-codec":"~6.0.0","level-errors":"~1.0.3","level-iterator-stream":"~1.3.0",prr:"~1.0.1",semver:"~4.3.3",xtend:"~4.0.0"},devDependencies:{async:"~0.9.0",bustermove:"~1.0.0",delayed:"~1.0.1",faucet:"~0.0.1",leveldown:"^1.1.0",memdown:"~1.0.0","msgpack-js":"~0.3.0",referee:"~1.1.1",rimraf:"~2.3.2","slow-stream":"0.0.4",tape:"~4.0.0"},browser:{leveldown:!1,"leveldown/package":!1,semver:!1},scripts:{test:"tape test/*-test.js | faucet"},license:"MIT",gitHead:"8f442f77baea1cdb1b7af844e3374380c2bb015f",bugs:{url:"https://github.com/level/levelup/issues"},_id:"levelup@1.2.1",_shasum:"13b537deb4a7536c3aa6fbe008a1af4a0350dbd5",_from:"levelup@>=1.2.1 <1.3.0",_npmVersion:"2.11.0",_nodeVersion:"2.2.1",_npmUser:{name:"ralphtheninja",email:"ralphtheninja@riseup.net"},maintainers:[{name:"rvagg",email:"rod@vagg.org"},{name:"ralphtheninja",email:"ralphtheninja@riseup.net"},{name:"juliangruber",email:"julian@juliangruber.com"}],dist:{shasum:"13b537deb4a7536c3aa6fbe008a1af4a0350dbd5",tarball:"http://127.0.0.1:5080/tarballs/levelup/1.2.1.tgz"},_resolved:"http://127.0.0.1:5080/tarballs/levelup/1.2.1.tgz",readme:"ERROR: No README data found!"}},{}],51:[function(e,t,r){var n=e("events").EventEmitter,i=e("subleveldown"),o=e("weak-type-wizard"),s=e("noddity-retrieval"),a=e("xtend"),c=e("./lib/reflect.js"),u=e("./lib/index_manager.js"),l=e("./lib/post_manager.js"),h=new o({postMetadata:"metadata",string:["content","filename"],"default":{content:"",filename:""},cast:{postMetadata:new o({date:"date",markdown:"boolean"})}})
t.exports=function(e,t,r){function o(e,t){"function"==typeof e&&(t=e),"object"!=typeof e&&(e={})
var r=e.local||!1,n="number"==typeof e.mostRecent?-e.mostRecent:void 0,i=r?v.getLocalPosts:v.getPosts
i(n,void 0,t)}function f(){m.stop(),v.stop()}var p="string"==typeof e?new s(e):e,d=new n
r=a(r)
var g=Object.create(d),m=new l(p,i(t,"posts",{valueEncoding:h.getLevelUpEncoding()}),{refreshEvery:r.refreshEvery,checkToSeeIfItemsNeedToBeRefreshedEvery:r.cacheCheckIntervalMs}),v=new u(p,m,i(t,"index",{valueEncoding:"json"}),{refreshEvery:r.refreshEvery,checkToSeeIfItemsNeedToBeRefreshedEvery:r.cacheCheckIntervalMs})
return c("change",m,d,"post changed"),c("change",v,d,"index changed"),v.on("change",v.getPosts),g.getPost=m.getPost,g.getPosts=o,g.allPostsAreLoaded=v.allPostsAreLoaded,g.stop=f,g.refreshPost=m.refresh,g}},{"./lib/index_manager.js":52,"./lib/post_manager.js":53,"./lib/reflect.js":54,events:208,"noddity-retrieval":58,subleveldown:193,"weak-type-wizard":115,xtend:116}],52:[function(e,t,r){function n(e,t){var r=e&&t&&e.metadata&&t.metadata&&e.metadata.date&&t.metadata.date
return r&&e.metadata.date!=t.metadata.date?e.metadata.date<t.metadata.date?-1:1:0}function i(e,t){return e.length===t.length&&e.every(function(e,r){return t[r]===e})}function o(e,t,r,i){function o(e,t,r,i){"function"==typeof t&&(i=t),"function"!=typeof i&&(i=function(){}),p(function(o,s){o?i(o):e(s,function(e,o){e||(o=o.sort(n),"number"==typeof t&&(o=o.slice(t,r))),i(e,o)})})}i=a(l,i)
var h=Object.create(new c),f=s(r,function(t,r){e.getIndex(r)},i)
f.on("change",function(e,t){h.emit("change",t)})
var p=f.get.bind(f,u)
p()
var d=o.bind(null,t.getPosts),g=o.bind(null,t.getLocalPosts)
return h.getPosts=d,h.getLocalPosts=g,h.allPostsAreLoaded=function(e){"function"!=typeof e&&(e=function(){}),p(function(t,r){t?e(!1,!1):g(function(t,n){e(t,t||n.length===r.length)})})},h.stop=f.stop,h}var s=e("levelup-cache"),a=e("xtend"),c=e("events").EventEmitter,u="index",l={refreshEvery:6e5,comparison:i}
t.exports=o},{events:208,"levelup-cache":55,xtend:116}],53:[function(e,t,r){function n(e,t){return"undefined"!=typeof t&&l(e)?e.toString()===t.toString():e===t}function i(e,t){return e.content===t.content&&e.metadata.length===t.metadata.length&&e.filename===t.filename&&Object.keys(e.metadata).every(function(r){return n(e.metadata[r],t.metadata[r])})}function o(e,t,r){function n(e,t){d.get(e,t)}function o(e,t){var r=e.map(function(e){return function(t){n(e,t)}})
s(r,t)}function l(e,t){var r=e.map(function(e){return function(t){d.getLocal(e,function(e,r){e&&!e.notFound?t(e):t(null,r)})}})
s(r,function(e,r){var n=r.filter(Boolean)
t(e,n)})}r=r||{}
var f=Object.create(new c),p=u({refreshEvery:432e5},r,{comparison:i}),d=new a(t,e.getPost,p)
return h("change",d,f),f.getPost=n,f.getPosts=o,f.getLocalPosts=l,f.stop=d.stop,f.refresh=d.refresh,f}var s=e("run-parallel"),a=e("levelup-cache"),c=e("events").EventEmitter,u=e("xtend"),l=e("util").isDate,h=e("./reflect.js")
t.exports=o},{"./reflect.js":54,events:208,"levelup-cache":55,"run-parallel":114,util:231,xtend:116}],54:[function(e,t,r){t.exports=function(e,t,r,n){t.on(e,r.emit.bind(r,n||e))}},{}],55:[function(e,t,r){(function(r){var n=e("subleveldown"),i=e("events").EventEmitter,o=e("expire-unused-keys"),s=e("xtend")
t.exports=function(e,t,a){function c(){g.stop(),d.stop(),f=!0}function u(e){p.del(e),g.forget(e)
var t=m[e]
t&&delete m[e]}function l(e,n){function i(t,n){m[e]&&!f&&m[e].forEach(function(e){r.nextTick(function(){e(t,n)})}),delete m[e]}g.touch(e),m[e]||(m[e]=[],t(e,function(t,r){p.get(e,function(n,o){return t?i(t):void(t||!m[e]||f||p.put(e,r,function(){m[e]&&!f&&(v.emit("load",e,r),(n&&n.notFound||!a.comparison(o,r))&&v.emit("change",e,r,o),i(t,r))}))})})),"function"==typeof n&&m[e].push(n)}function h(e,t){return function(r,n){d.touch(e),"function"==typeof t&&t(r,n)}}var f=!1
a=a||{},a=s({refreshEvery:432e5,checkToSeeIfItemsNeedToBeRefreshedEvery:1e3,ttl:6048e5,comparison:function(e,t){return e===t}},a)
var p=e,d=new o(a.ttl,n(e,"item-expirations",{valueEncoding:"utf8"}),a.checkToSeeIfItemsNeedToBeRefreshedEvery),g=new o(a.refreshEvery,n(e,"refresh",{valueEncoding:"utf8"}),a.checkToSeeIfItemsNeedToBeRefreshedEvery),m={},v=new i
return g.on("expire",l),d.on("expire",u),v.stop=c,v.get=function(e,t){p.get(e,function(r,n){r&&r.notFound?l(e,h(e,t)):t&&h(e,t)(r,n)})},v.getLocal=function(e,t){p.get(e,h(e,t))},v.refresh=function(e,t){l(e,h(e,t))},v}}).call(this,e("_process"))},{_process:211,events:208,"expire-unused-keys":56,subleveldown:193,xtend:57}],56:[function(e,t,r){(function(r){function n(e){function t(){r=!1}var r=!1
return function(){r||(r=!0,e(t))}}var i=e("events").EventEmitter
t.exports=function(e,t,o){function s(e){return e.filter(function(e){return-1===c.indexOf(e)})}var a=new i,c=[],u=n(function(r){var n=(new Date).getTime(),i=[]
t.createReadStream().on("data",function(t){parseInt(t.value)+e<n&&i.push(t.key)}).on("end",function(){var e=s(i),n=e.map(function(e){return{type:"del",key:e}})
t.batch(n,function(t){t||s(e).forEach(function(e){a.emit("expire",e)}),c=[],r(t)})})})
a.on("touch",function(e){t.put(e,(new Date).getTime())}),a.on("forget",function(e){c.push(e),t.del(e)})
var l=setInterval(u,o||1e3)
return l.unref&&l.unref(),a.touch=a.emit.bind(a,"touch"),a.forget=a.emit.bind(a,"forget"),a.stop=function(){clearInterval(l)},r.nextTick(u),a}}).call(this,e("_process"))},{_process:211,events:208}],57:[function(e,t,r){arguments[4][11][0].apply(r,arguments)},{dup:11}],58:[function(e,t,r){(function(r){var n=e("superagent"),i=e("url"),o=e("text-metadata-parser"),s=e("urlencode")
t.exports=function(e){function t(t,o,a){if("string"!=typeof t)r.nextTick(function(){a(new TypeError("Parameter 'file' must be a string, not "+typeof t))})
else{var c=t.split("/").map(function(e){return s(e)}).join("/"),u=i.resolve(e,c)
n.get(u).end(function(e,t){if(e)a(new Error("Lookup of "+u+" failed\n========\n"+e.message))
else if(200!==t.status)a(new Error("Lookup of "+u+" returned status "+t.status+"\n==========\n"+t.text))
else{var r
try{r=[null,o(t.text)]}catch(n){r=[n]}a.apply(null,r)}})}}return{getIndex:function(e){t("index.json",JSON.parse,e)},getPost:function(e,r){t(e,function(t){var r=o(t,{date:"date","boolean":"markdown"})
return r.filename=e,r},r)}}}}).call(this,e("_process"))},{_process:211,superagent:59,"text-metadata-parser":93,url:229,urlencode:94}],59:[function(e,t,r){function n(){}function i(e){var t={}.toString.call(e)
switch(t){case"[object File]":case"[object Blob]":case"[object FormData]":return!0
default:return!1}}function o(e){return e===Object(e)}function s(e){if(!o(e))return e
var t=[]
for(var r in e)null!=e[r]&&a(t,r,e[r])
return t.join("&")}function a(e,t,r){return Array.isArray(r)?r.forEach(function(r){a(e,t,r)}):void e.push(encodeURIComponent(t)+"="+encodeURIComponent(r))}function c(e){for(var t,r,n={},i=e.split("&"),o=0,s=i.length;s>o;++o)r=i[o],t=r.split("="),n[decodeURIComponent(t[0])]=decodeURIComponent(t[1])
return n}function u(e){var t,r,n,i,o=e.split(/\r?\n/),s={}
o.pop()
for(var a=0,c=o.length;c>a;++a)r=o[a],t=r.indexOf(":"),n=r.slice(0,t).toLowerCase(),i=w(r.slice(t+1)),s[n]=i
return s}function l(e){return/[\/+]json\b/.test(e)}function h(e){return e.split(/ *; */).shift()}function f(e){return y(e.split(/ *; */),function(e,t){var r=t.split(/ *= */),n=r.shift(),i=r.shift()
return n&&i&&(e[n]=i),e},{})}function p(e,t){t=t||{},this.req=e,this.xhr=this.req.xhr,this.text="HEAD"!=this.req.method&&(""===this.xhr.responseType||"text"===this.xhr.responseType)||"undefined"==typeof this.xhr.responseType?this.xhr.responseText:null,this.statusText=this.req.xhr.statusText,this.setStatusProperties(this.xhr.status),this.header=this.headers=u(this.xhr.getAllResponseHeaders()),this.header["content-type"]=this.xhr.getResponseHeader("content-type"),this.setHeaderProperties(this.header),this.body="HEAD"!=this.req.method?this.parseBody(this.text?this.text:this.xhr.response):null}function d(e,t){var r=this
b.call(this),this._query=this._query||[],this.method=e,this.url=t,this.header={},this._header={},this.on("end",function(){var e=null,t=null
try{t=new p(r)}catch(n){return e=new Error("Parser is unable to parse the response"),e.parse=!0,e.original=n,e.rawResponse=r.xhr&&r.xhr.responseText?r.xhr.responseText:null,r.callback(e)}if(r.emit("response",t),e)return r.callback(e,t)
if(t.status>=200&&t.status<300)return r.callback(e,t)
var i=new Error(t.statusText||"Unsuccessful HTTP response")
i.original=e,i.response=t,i.status=t.status,r.callback(i,t)})}function g(e,t){return"function"==typeof t?new d("GET",e).end(t):1==arguments.length?new d("GET",e):new d(e,t)}function m(e,t){var r=g("DELETE",e)
return t&&r.end(t),r}var v,b=e("emitter"),y=e("reduce")
v="undefined"!=typeof window?window:"undefined"!=typeof self?self:this,g.getXHR=function(){if(!(!v.XMLHttpRequest||v.location&&"file:"==v.location.protocol&&v.ActiveXObject))return new XMLHttpRequest
try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(e){}return!1}
var w="".trim?function(e){return e.trim()}:function(e){return e.replace(/(^\s*|\s*$)/g,"")}
g.serializeObject=s,g.parseString=c,g.types={html:"text/html",json:"application/json",xml:"application/xml",urlencoded:"application/x-www-form-urlencoded",form:"application/x-www-form-urlencoded","form-data":"application/x-www-form-urlencoded"},g.serialize={"application/x-www-form-urlencoded":s,"application/json":JSON.stringify},g.parse={"application/x-www-form-urlencoded":c,"application/json":JSON.parse},p.prototype.get=function(e){return this.header[e.toLowerCase()]},p.prototype.setHeaderProperties=function(e){var t=this.header["content-type"]||""
this.type=h(t)
var r=f(t)
for(var n in r)this[n]=r[n]},p.prototype.parseBody=function(e){var t=g.parse[this.type]
return t&&e&&(e.length||e instanceof Object)?t(e):null},p.prototype.setStatusProperties=function(e){1223===e&&(e=204)
var t=e/100|0
this.status=this.statusCode=e,this.statusType=t,this.info=1==t,this.ok=2==t,this.clientError=4==t,this.serverError=5==t,this.error=4==t||5==t?this.toError():!1,this.accepted=202==e,this.noContent=204==e,this.badRequest=400==e,this.unauthorized=401==e,this.notAcceptable=406==e,this.notFound=404==e,this.forbidden=403==e},p.prototype.toError=function(){var e=this.req,t=e.method,r=e.url,n="cannot "+t+" "+r+" ("+this.status+")",i=new Error(n)
return i.status=this.status,i.method=t,i.url=r,i},g.Response=p,b(d.prototype),d.prototype.use=function(e){return e(this),this},d.prototype.timeout=function(e){return this._timeout=e,this},d.prototype.clearTimeout=function(){return this._timeout=0,clearTimeout(this._timer),this},d.prototype.abort=function(){return this.aborted?void 0:(this.aborted=!0,this.xhr.abort(),this.clearTimeout(),this.emit("abort"),this)},d.prototype.set=function(e,t){if(o(e)){for(var r in e)this.set(r,e[r])
return this}return this._header[e.toLowerCase()]=t,this.header[e]=t,this},d.prototype.unset=function(e){return delete this._header[e.toLowerCase()],delete this.header[e],this},d.prototype.getHeader=function(e){return this._header[e.toLowerCase()]},d.prototype.type=function(e){return this.set("Content-Type",g.types[e]||e),this},d.prototype.parse=function(e){return this._parser=e,this},d.prototype.accept=function(e){return this.set("Accept",g.types[e]||e),this},d.prototype.auth=function(e,t){var r=btoa(e+":"+t)
return this.set("Authorization","Basic "+r),this},d.prototype.query=function(e){return"string"!=typeof e&&(e=s(e)),e&&this._query.push(e),this},d.prototype.field=function(e,t){return this._formData||(this._formData=new v.FormData),this._formData.append(e,t),this},d.prototype.attach=function(e,t,r){return this._formData||(this._formData=new v.FormData),this._formData.append(e,t,r||t.name),this},d.prototype.send=function(e){var t=o(e),r=this.getHeader("Content-Type")
if(t&&o(this._data))for(var n in e)this._data[n]=e[n]
else"string"==typeof e?(r||this.type("form"),r=this.getHeader("Content-Type"),"application/x-www-form-urlencoded"==r?this._data=this._data?this._data+"&"+e:e:this._data=(this._data||"")+e):this._data=e
return!t||i(e)?this:(r||this.type("json"),this)},d.prototype.callback=function(e,t){var r=this._callback
this.clearTimeout(),r(e,t)},d.prototype.crossDomainError=function(){var e=new Error("Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.")
e.crossDomain=!0,e.status=this.status,e.method=this.method,e.url=this.url,this.callback(e)},d.prototype.timeoutError=function(){var e=this._timeout,t=new Error("timeout of "+e+"ms exceeded")
t.timeout=e,this.callback(t)},d.prototype.withCredentials=function(){return this._withCredentials=!0,this},d.prototype.end=function(e){var t=this,r=this.xhr=g.getXHR(),o=this._query.join("&"),s=this._timeout,a=this._formData||this._data
this._callback=e||n,r.onreadystatechange=function(){if(4==r.readyState){var e
try{e=r.status}catch(n){e=0}if(0==e){if(t.timedout)return t.timeoutError()
if(t.aborted)return
return t.crossDomainError()}t.emit("end")}}
var c=function(e){e.total>0&&(e.percent=e.loaded/e.total*100),e.direction="download",t.emit("progress",e)}
this.hasListeners("progress")&&(r.onprogress=c)
try{r.upload&&this.hasListeners("progress")&&(r.upload.onprogress=c)}catch(u){}if(s&&!this._timer&&(this._timer=setTimeout(function(){t.timedout=!0,t.abort()},s)),o&&(o=g.serializeObject(o),this.url+=~this.url.indexOf("?")?"&"+o:"?"+o),r.open(this.method,this.url,!0),this._withCredentials&&(r.withCredentials=!0),"GET"!=this.method&&"HEAD"!=this.method&&"string"!=typeof a&&!i(a)){var h=this.getHeader("Content-Type"),f=this._parser||g.serialize[h?h.split(";")[0]:""]
!f&&l(h)&&(f=g.serialize["application/json"]),f&&(a=f(a))}for(var p in this.header)null!=this.header[p]&&r.setRequestHeader(p,this.header[p])
return this.emit("request",this),r.send("undefined"!=typeof a?a:null),this},d.prototype.then=function(e,t){return this.end(function(r,n){r?t(r):e(n)})},g.Request=d,g.get=function(e,t,r){var n=g("GET",e)
return"function"==typeof t&&(r=t,t=null),t&&n.query(t),r&&n.end(r),n},g.head=function(e,t,r){var n=g("HEAD",e)
return"function"==typeof t&&(r=t,t=null),t&&n.send(t),r&&n.end(r),n},g.del=m,g["delete"]=m,g.patch=function(e,t,r){var n=g("PATCH",e)
return"function"==typeof t&&(r=t,t=null),t&&n.send(t),r&&n.end(r),n},g.post=function(e,t,r){var n=g("POST",e)
return"function"==typeof t&&(r=t,t=null),t&&n.send(t),r&&n.end(r),n},g.put=function(e,t,r){var n=g("PUT",e)
return"function"==typeof t&&(r=t,t=null),t&&n.send(t),r&&n.end(r),n},t.exports=g},{emitter:60,reduce:61}],60:[function(e,t,r){function n(e){return e?i(e):void 0}function i(e){for(var t in n.prototype)e[t]=n.prototype[t]
return e}t.exports=n,n.prototype.on=n.prototype.addEventListener=function(e,t){return this._callbacks=this._callbacks||{},(this._callbacks["$"+e]=this._callbacks["$"+e]||[]).push(t),this},n.prototype.once=function(e,t){function r(){this.off(e,r),t.apply(this,arguments)}return r.fn=t,this.on(e,r),this},n.prototype.off=n.prototype.removeListener=n.prototype.removeAllListeners=n.prototype.removeEventListener=function(e,t){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this
var r=this._callbacks["$"+e]
if(!r)return this
if(1==arguments.length)return delete this._callbacks["$"+e],this
for(var n,i=0;i<r.length;i++)if(n=r[i],n===t||n.fn===t){r.splice(i,1)
break}return this},n.prototype.emit=function(e){this._callbacks=this._callbacks||{}
var t=[].slice.call(arguments,1),r=this._callbacks["$"+e]
if(r){r=r.slice(0)
for(var n=0,i=r.length;i>n;++n)r[n].apply(this,t)}return this},n.prototype.listeners=function(e){return this._callbacks=this._callbacks||{},this._callbacks["$"+e]||[]},n.prototype.hasListeners=function(e){return!!this.listeners(e).length}},{}],61:[function(e,t,r){t.exports=function(e,t,r){for(var n=0,i=e.length,o=3==arguments.length?r:e[n++];i>n;)o=t.call(null,o,e[n],++n,e)
return o}},{}],62:[function(e,t,r){var n=e("js-yaml"),i=/^(-{3}(?:\r?\n)([\w\W]+?)(?:\r?\n)-{3})?([\w\W]*)*/
t.exports=function(e,t){t=t||"__content"
var r=i.exec(e),o=r[2]?n.load(r[2]):{}
return o[t]=r[3]||"",o}},{"js-yaml":63}],63:[function(e,t,r){"use strict"
var n=e("./lib/js-yaml.js")
t.exports=n},{"./lib/js-yaml.js":64}],64:[function(e,t,r){"use strict"
function n(e){return function(){throw new Error("Function "+e+" is deprecated and cannot be used.")}}var i=e("./js-yaml/loader"),o=e("./js-yaml/dumper")
t.exports.Type=e("./js-yaml/type"),t.exports.Schema=e("./js-yaml/schema"),t.exports.FAILSAFE_SCHEMA=e("./js-yaml/schema/failsafe"),t.exports.JSON_SCHEMA=e("./js-yaml/schema/json"),t.exports.CORE_SCHEMA=e("./js-yaml/schema/core"),t.exports.DEFAULT_SAFE_SCHEMA=e("./js-yaml/schema/default_safe"),t.exports.DEFAULT_FULL_SCHEMA=e("./js-yaml/schema/default_full"),t.exports.load=i.load,t.exports.loadAll=i.loadAll,t.exports.safeLoad=i.safeLoad,t.exports.safeLoadAll=i.safeLoadAll,t.exports.dump=o.dump,t.exports.safeDump=o.safeDump,t.exports.YAMLException=e("./js-yaml/exception"),t.exports.MINIMAL_SCHEMA=e("./js-yaml/schema/failsafe"),t.exports.SAFE_SCHEMA=e("./js-yaml/schema/default_safe"),t.exports.DEFAULT_SCHEMA=e("./js-yaml/schema/default_full"),t.exports.scan=n("scan"),t.exports.parse=n("parse"),t.exports.compose=n("compose"),t.exports.addConstructor=n("addConstructor")},{"./js-yaml/dumper":66,"./js-yaml/exception":67,"./js-yaml/loader":68,"./js-yaml/schema":70,"./js-yaml/schema/core":71,"./js-yaml/schema/default_full":72,"./js-yaml/schema/default_safe":73,"./js-yaml/schema/failsafe":74,"./js-yaml/schema/json":75,"./js-yaml/type":76}],65:[function(e,t,r){"use strict"
function n(e){return"undefined"==typeof e||null===e}function i(e){return"object"==typeof e&&null!==e}function o(e){return Array.isArray(e)?e:n(e)?[]:[e]}function s(e,t){var r,n,i,o
if(t)for(o=Object.keys(t),r=0,n=o.length;n>r;r+=1)i=o[r],e[i]=t[i]
return e}function a(e,t){var r,n=""
for(r=0;t>r;r+=1)n+=e
return n}function c(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e}t.exports.isNothing=n,t.exports.isObject=i,t.exports.toArray=o,t.exports.repeat=a,t.exports.isNegativeZero=c,t.exports.extend=s},{}],66:[function(e,t,r){"use strict"
function n(e,t){var r,n,i,o,s,a,c
if(null===t)return{}
for(r={},n=Object.keys(t),i=0,o=n.length;o>i;i+=1)s=n[i],a=String(t[s]),"!!"===s.slice(0,2)&&(s="tag:yaml.org,2002:"+s.slice(2)),c=e.compiledTypeMap[s],c&&j.call(c.styleAliases,a)&&(a=c.styleAliases[a]),r[s]=a
return r}function i(e){var t,r,n
if(t=e.toString(16).toUpperCase(),255>=e)r="x",n=2
else if(65535>=e)r="u",n=4
else{if(!(4294967295>=e))throw new S("code point within a string may not be greater than 0xFFFFFFFF")
r="U",n=8}return"\\"+r+A.repeat("0",n-t.length)+t}function o(e){this.schema=e.schema||C,this.indent=Math.max(1,e.indent||2),this.skipInvalid=e.skipInvalid||!1,this.flowLevel=A.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=n(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function s(e,t){for(var r,n=A.repeat(" ",t),i=0,o=-1,s="",a=e.length;a>i;)o=e.indexOf("\n",i),-1===o?(r=e.slice(i),i=a):(r=e.slice(i,o+1),i=o+1),r.length&&"\n"!==r&&(s+=n),s+=r
return s}function a(e,t){return"\n"+A.repeat(" ",e.indent*t)}function c(e,t){var r,n,i
for(r=0,n=e.implicitTypes.length;n>r;r+=1)if(i=e.implicitTypes[r],i.resolve(t))return!0
return!1}function u(e){this.source=e,this.result="",this.checkpoint=0}function l(e,t,r,n){var i,o,a,l,f,g,m,v,b,y,w,_,k,x,E,A,S,C,T,q,j
if(0===t.length)return void(e.dump="''")
if(-1!==te.indexOf(t))return void(e.dump="'"+t+"'")
for(i=!0,o=t.length?t.charCodeAt(0):0,a=I===o||I===t.charCodeAt(t.length-1),(V===o||G===o||$===o||Z===o)&&(i=!1),a||e.flowLevel>-1&&e.flowLevel<=r?(a&&(i=!1),l=!1,f=!1):(l=!n,f=!n),g=!0,m=new u(t),v=!1,b=0,y=0,w=e.indent*r,_=e.lineWidth,-1===_&&(_=9007199254740991),40>w?_-=w:_=40,x=0;x<t.length;x++){if(k=t.charCodeAt(x),i){if(p(k))continue
i=!1}g&&k===U&&(g=!1),E=ee[k],A=d(k),(E||A)&&(k!==L&&k!==B&&k!==U?(l=!1,f=!1):k===L&&(v=!0,g=!1,x>0&&(S=t.charCodeAt(x-1),S===I&&(f=!1,l=!1)),l&&(C=x-b,b=x,C>y&&(y=C))),k!==B&&(g=!1),m.takeUpTo(x),m.escapeChar())}if(i&&c(e,t)&&(i=!1),T="",(l||f)&&(q=0,t.charCodeAt(t.length-1)===L&&(q+=1,t.charCodeAt(t.length-2)===L&&(q+=1)),0===q?T="-":2===q&&(T="+")),(f&&_>y||null!==e.tag)&&(l=!1),v||(f=!1),i)e.dump=t
else if(g)e.dump="'"+t+"'"
else if(l)j=h(t,_),e.dump=">"+T+"\n"+s(j,w)
else if(f)T||(t=t.replace(/\n$/,"")),e.dump="|"+T+"\n"+s(t,w)
else{if(!m)throw new Error("Failed to dump scalar value")
m.finish(),e.dump='"'+m.result+'"'}}function h(e,t){var r,n="",i=0,o=e.length,s=/\n+$/.exec(e)
for(s&&(o=s.index+1);o>i;)r=e.indexOf("\n",i),r>o||-1===r?(n&&(n+="\n\n"),n+=f(e.slice(i,o),t),i=o):(n&&(n+="\n\n"),n+=f(e.slice(i,r),t),i=r+1)
return s&&"\n"!==s[0]&&(n+=s[0]),n}function f(e,t){if(""===e)return e
for(var r,n,i,o=/[^\s] [^\s]/g,s="",a=0,c=0,u=o.exec(e);u;)r=u.index,r-c>t&&(n=a!==c?a:r,s&&(s+="\n"),i=e.slice(c,n),s+=i,c=n+1),a=r+1,u=o.exec(e)
return s&&(s+="\n"),s+=c!==a&&e.length-c>t?e.slice(c,a)+"\n"+e.slice(a+1):e.slice(c)}function p(e){return O!==e&&L!==e&&R!==e&&z!==e&&K!==e&&Y!==e&&J!==e&&X!==e&&D!==e&&M!==e&&F!==e&&N!==e&&Q!==e&&W!==e&&U!==e&&B!==e&&P!==e&&H!==e&&!ee[e]&&!d(e)}function d(e){return!(e>=32&&126>=e||133===e||e>=160&&55295>=e||e>=57344&&65533>=e||e>=65536&&1114111>=e)}function g(e,t,r){var n,i,o="",s=e.tag
for(n=0,i=r.length;i>n;n+=1)w(e,t,r[n],!1,!1)&&(0!==n&&(o+=", "),o+=e.dump)
e.tag=s,e.dump="["+o+"]"}function m(e,t,r,n){var i,o,s="",c=e.tag
for(i=0,o=r.length;o>i;i+=1)w(e,t+1,r[i],!0,!0)&&(n&&0===i||(s+=a(e,t)),s+="- "+e.dump)
e.tag=c,e.dump=s||"[]"}function v(e,t,r){var n,i,o,s,a,c="",u=e.tag,l=Object.keys(r)
for(n=0,i=l.length;i>n;n+=1)a="",0!==n&&(a+=", "),o=l[n],s=r[o],w(e,t,o,!1,!1)&&(e.dump.length>1024&&(a+="? "),a+=e.dump+": ",w(e,t,s,!1,!1)&&(a+=e.dump,c+=a))
e.tag=u,e.dump="{"+c+"}"}function b(e,t,r,n){var i,o,s,c,u,l,h="",f=e.tag,p=Object.keys(r)
if(e.sortKeys===!0)p.sort()
else if("function"==typeof e.sortKeys)p.sort(e.sortKeys)
else if(e.sortKeys)throw new S("sortKeys must be a boolean or a function")
for(i=0,o=p.length;o>i;i+=1)l="",n&&0===i||(l+=a(e,t)),s=p[i],c=r[s],w(e,t+1,s,!0,!0,!0)&&(u=null!==e.tag&&"?"!==e.tag||e.dump&&e.dump.length>1024,u&&(l+=e.dump&&L===e.dump.charCodeAt(0)?"?":"? "),l+=e.dump,u&&(l+=a(e,t)),w(e,t+1,c,!0,u)&&(l+=e.dump&&L===e.dump.charCodeAt(0)?":":": ",l+=e.dump,h+=l))
e.tag=f,e.dump=h||"{}"}function y(e,t,r){var n,i,o,s,a,c
for(i=r?e.explicitTypes:e.implicitTypes,o=0,s=i.length;s>o;o+=1)if(a=i[o],(a.instanceOf||a.predicate)&&(!a.instanceOf||"object"==typeof t&&t instanceof a.instanceOf)&&(!a.predicate||a.predicate(t))){if(e.tag=r?a.tag:"?",a.represent){if(c=e.styleMap[a.tag]||a.defaultStyle,"[object Function]"===q.call(a.represent))n=a.represent(t,c)
else{if(!j.call(a.represent,c))throw new S("!<"+a.tag+'> tag resolver accepts not "'+c+'" style')
n=a.represent[c](t,c)}e.dump=n}return!0}return!1}function w(e,t,r,n,i,o){e.tag=null,e.dump=r,y(e,r,!1)||y(e,r,!0)
var s=q.call(e.dump)
n&&(n=e.flowLevel<0||e.flowLevel>t)
var a,c,u="[object Object]"===s||"[object Array]"===s
if(u&&(a=e.duplicates.indexOf(r),c=-1!==a),(null!==e.tag&&"?"!==e.tag||c||2!==e.indent&&t>0)&&(i=!1),c&&e.usedDuplicates[a])e.dump="*ref_"+a
else{if(u&&c&&!e.usedDuplicates[a]&&(e.usedDuplicates[a]=!0),"[object Object]"===s)n&&0!==Object.keys(e.dump).length?(b(e,t,e.dump,i),c&&(e.dump="&ref_"+a+e.dump)):(v(e,t,e.dump),c&&(e.dump="&ref_"+a+" "+e.dump))
else if("[object Array]"===s)n&&0!==e.dump.length?(m(e,t,e.dump,i),c&&(e.dump="&ref_"+a+e.dump)):(g(e,t,e.dump),c&&(e.dump="&ref_"+a+" "+e.dump))
else{if("[object String]"!==s){if(e.skipInvalid)return!1
throw new S("unacceptable kind of an object to dump "+s)}"?"!==e.tag&&l(e,e.dump,t,o)}null!==e.tag&&"?"!==e.tag&&(e.dump="!<"+e.tag+"> "+e.dump)}return!0}function _(e,t){var r,n,i=[],o=[]
for(k(e,i,o),r=0,n=o.length;n>r;r+=1)t.duplicates.push(i[o[r]])
t.usedDuplicates=new Array(n)}function k(e,t,r){var n,i,o
if(null!==e&&"object"==typeof e)if(i=t.indexOf(e),-1!==i)-1===r.indexOf(i)&&r.push(i)
else if(t.push(e),Array.isArray(e))for(i=0,o=e.length;o>i;i+=1)k(e[i],t,r)
else for(n=Object.keys(e),i=0,o=n.length;o>i;i+=1)k(e[n[i]],t,r)}function x(e,t){t=t||{}
var r=new o(t)
return r.noRefs||_(e,r),w(r,0,e,!0,!0)?r.dump+"\n":""}function E(e,t){return x(e,A.extend({schema:T},t))}var A=e("./common"),S=e("./exception"),C=e("./schema/default_full"),T=e("./schema/default_safe"),q=Object.prototype.toString,j=Object.prototype.hasOwnProperty,O=9,L=10,R=13,I=32,N=33,B=34,D=35,P=37,M=38,U=39,F=42,z=44,V=45,H=58,W=62,G=63,$=64,K=91,Y=93,Z=96,J=123,Q=124,X=125,ee={}
ee[0]="\\0",ee[7]="\\a",ee[8]="\\b",ee[9]="\\t",ee[10]="\\n",ee[11]="\\v",ee[12]="\\f",ee[13]="\\r",ee[27]="\\e",ee[34]='\\"',ee[92]="\\\\",ee[133]="\\N",ee[160]="\\_",ee[8232]="\\L",ee[8233]="\\P"
var te=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"]
u.prototype.takeUpTo=function(e){var t
if(e<this.checkpoint)throw t=new Error("position should be > checkpoint"),t.position=e,t.checkpoint=this.checkpoint,t
return this.result+=this.source.slice(this.checkpoint,e),this.checkpoint=e,this},u.prototype.escapeChar=function(){var e,t
return e=this.source.charCodeAt(this.checkpoint),t=ee[e]||i(e),this.result+=t,this.checkpoint+=1,this},u.prototype.finish=function(){this.source.length>this.checkpoint&&this.takeUpTo(this.source.length)},t.exports.dump=x,t.exports.safeDump=E},{"./common":65,"./exception":67,"./schema/default_full":72,"./schema/default_safe":73}],67:[function(e,t,r){"use strict"
function n(e,t){Error.call(this),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||"",this.name="YAMLException",this.reason=e,this.mark=t,this.message=(this.reason||"(unknown reason)")+(this.mark?" "+this.mark.toString():"")}n.prototype=Object.create(Error.prototype),n.prototype.constructor=n,n.prototype.toString=function(e){var t=this.name+": "
return t+=this.reason||"(unknown reason)",!e&&this.mark&&(t+=" "+this.mark.toString()),t},t.exports=n},{}],68:[function(e,t,r){"use strict"
function n(e){return 10===e||13===e}function i(e){return 9===e||32===e}function o(e){return 9===e||32===e||10===e||13===e}function s(e){return 44===e||91===e||93===e||123===e||125===e}function a(e){var t
return e>=48&&57>=e?e-48:(t=32|e,t>=97&&102>=t?t-97+10:-1)}function c(e){return 120===e?2:117===e?4:85===e?8:0}function u(e){return e>=48&&57>=e?e-48:-1}function l(e){return 48===e?"\x00":97===e?"":98===e?"\b":116===e?"	":9===e?"	":110===e?"\n":118===e?"":102===e?"\f":114===e?"\r":101===e?"":32===e?" ":34===e?'"':47===e?"/":92===e?"\\":78===e?"":95===e?" ":76===e?"\u2028":80===e?"\u2029":""}function h(e){return 65535>=e?String.fromCharCode(e):String.fromCharCode((e-65536>>10)+55296,(e-65536&1023)+56320)}function f(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||H,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.documents=[]}function p(e,t){return new F(t,new z(e.filename,e.input,e.position,e.line,e.position-e.lineStart))}function d(e,t){throw p(e,t)}function g(e,t){e.onWarning&&e.onWarning.call(null,p(e,t))}function m(e,t,r,n){var i,o,s,a
if(r>t){if(a=e.input.slice(t,r),n)for(i=0,o=a.length;o>i;i+=1)s=a.charCodeAt(i),9===s||s>=32&&1114111>=s||d(e,"expected valid JSON character")
else X.test(a)&&d(e,"the stream contains non-printable characters")
e.result+=a}}function v(e,t,r,n){var i,o,s,a
for(U.isObject(r)||d(e,"cannot merge mappings; the provided source object is unacceptable"),i=Object.keys(r),s=0,a=i.length;a>s;s+=1)o=i[s],W.call(t,o)||(t[o]=r[o],n[o]=!0)}function b(e,t,r,n,i,o){var s,a
if(i=String(i),null===t&&(t={}),"tag:yaml.org,2002:merge"===n)if(Array.isArray(o))for(s=0,a=o.length;a>s;s+=1)v(e,t,o[s],r)
else v(e,t,o,r)
else e.json||W.call(r,i)||!W.call(t,i)||d(e,"duplicated mapping key"),t[i]=o,delete r[i]
return t}function y(e){var t
t=e.input.charCodeAt(e.position),10===t?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):d(e,"a line break is expected"),e.line+=1,e.lineStart=e.position}function w(e,t,r){for(var o=0,s=e.input.charCodeAt(e.position);0!==s;){for(;i(s);)s=e.input.charCodeAt(++e.position)
if(t&&35===s)do s=e.input.charCodeAt(++e.position)
while(10!==s&&13!==s&&0!==s)
if(!n(s))break
for(y(e),s=e.input.charCodeAt(e.position),o++,e.lineIndent=0;32===s;)e.lineIndent++,s=e.input.charCodeAt(++e.position)}return-1!==r&&0!==o&&e.lineIndent<r&&g(e,"deficient indentation"),o}function _(e){var t,r=e.position
return t=e.input.charCodeAt(r),45!==t&&46!==t||t!==e.input.charCodeAt(r+1)||t!==e.input.charCodeAt(r+2)||(r+=3,t=e.input.charCodeAt(r),0!==t&&!o(t))?!1:!0}function k(e,t){1===t?e.result+=" ":t>1&&(e.result+=U.repeat("\n",t-1))}function x(e,t,r){var a,c,u,l,h,f,p,d,g,v=e.kind,b=e.result
if(g=e.input.charCodeAt(e.position),o(g)||s(g)||35===g||38===g||42===g||33===g||124===g||62===g||39===g||34===g||37===g||64===g||96===g)return!1
if((63===g||45===g)&&(c=e.input.charCodeAt(e.position+1),o(c)||r&&s(c)))return!1
for(e.kind="scalar",e.result="",u=l=e.position,h=!1;0!==g;){if(58===g){if(c=e.input.charCodeAt(e.position+1),o(c)||r&&s(c))break}else if(35===g){if(a=e.input.charCodeAt(e.position-1),o(a))break}else{if(e.position===e.lineStart&&_(e)||r&&s(g))break
if(n(g)){if(f=e.line,p=e.lineStart,d=e.lineIndent,w(e,!1,-1),e.lineIndent>=t){h=!0,g=e.input.charCodeAt(e.position)
continue}e.position=l,e.line=f,e.lineStart=p,e.lineIndent=d
break}}h&&(m(e,u,l,!1),k(e,e.line-f),u=l=e.position,h=!1),i(g)||(l=e.position+1),g=e.input.charCodeAt(++e.position)}return m(e,u,l,!1),e.result?!0:(e.kind=v,e.result=b,!1)}function E(e,t){var r,i,o
if(r=e.input.charCodeAt(e.position),39!==r)return!1
for(e.kind="scalar",e.result="",e.position++,i=o=e.position;0!==(r=e.input.charCodeAt(e.position));)if(39===r){if(m(e,i,e.position,!0),r=e.input.charCodeAt(++e.position),39!==r)return!0
i=o=e.position,e.position++}else n(r)?(m(e,i,o,!0),k(e,w(e,!1,t)),i=o=e.position):e.position===e.lineStart&&_(e)?d(e,"unexpected end of the document within a single quoted scalar"):(e.position++,o=e.position)
d(e,"unexpected end of the stream within a single quoted scalar")}function A(e,t){var r,i,o,s,u,l
if(l=e.input.charCodeAt(e.position),34!==l)return!1
for(e.kind="scalar",e.result="",e.position++,r=i=e.position;0!==(l=e.input.charCodeAt(e.position));){if(34===l)return m(e,r,e.position,!0),e.position++,!0
if(92===l){if(m(e,r,e.position,!0),l=e.input.charCodeAt(++e.position),n(l))w(e,!1,t)
else if(256>l&&ie[l])e.result+=oe[l],e.position++
else if((u=c(l))>0){for(o=u,s=0;o>0;o--)l=e.input.charCodeAt(++e.position),(u=a(l))>=0?s=(s<<4)+u:d(e,"expected hexadecimal character")
e.result+=h(s),e.position++}else d(e,"unknown escape sequence")
r=i=e.position}else n(l)?(m(e,r,i,!0),k(e,w(e,!1,t)),r=i=e.position):e.position===e.lineStart&&_(e)?d(e,"unexpected end of the document within a double quoted scalar"):(e.position++,i=e.position)}d(e,"unexpected end of the stream within a double quoted scalar")}function S(e,t){var r,n,i,s,a,c,u,l,h,f,p,g=!0,m=e.tag,v=e.anchor,y={}
if(p=e.input.charCodeAt(e.position),91===p)s=93,u=!1,n=[]
else{if(123!==p)return!1
s=125,u=!0,n={}}for(null!==e.anchor&&(e.anchorMap[e.anchor]=n),p=e.input.charCodeAt(++e.position);0!==p;){if(w(e,!0,t),p=e.input.charCodeAt(e.position),p===s)return e.position++,e.tag=m,e.anchor=v,e.kind=u?"mapping":"sequence",e.result=n,!0
g||d(e,"missed comma between flow collection entries"),h=l=f=null,a=c=!1,63===p&&(i=e.input.charCodeAt(e.position+1),o(i)&&(a=c=!0,e.position++,w(e,!0,t))),r=e.line,R(e,t,G,!1,!0),h=e.tag,l=e.result,w(e,!0,t),p=e.input.charCodeAt(e.position),!c&&e.line!==r||58!==p||(a=!0,p=e.input.charCodeAt(++e.position),w(e,!0,t),R(e,t,G,!1,!0),f=e.result),u?b(e,n,y,h,l,f):a?n.push(b(e,null,y,h,l,f)):n.push(l),w(e,!0,t),p=e.input.charCodeAt(e.position),44===p?(g=!0,p=e.input.charCodeAt(++e.position)):g=!1}d(e,"unexpected end of the stream within a flow collection")}function C(e,t){var r,o,s,a,c=Z,l=!1,h=t,f=0,p=!1
if(a=e.input.charCodeAt(e.position),124===a)o=!1
else{if(62!==a)return!1
o=!0}for(e.kind="scalar",e.result="";0!==a;)if(a=e.input.charCodeAt(++e.position),43===a||45===a)Z===c?c=43===a?Q:J:d(e,"repeat of a chomping mode identifier")
else{if(!((s=u(a))>=0))break
0===s?d(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):l?d(e,"repeat of an indentation width identifier"):(h=t+s-1,l=!0)}if(i(a)){do a=e.input.charCodeAt(++e.position)
while(i(a))
if(35===a)do a=e.input.charCodeAt(++e.position)
while(!n(a)&&0!==a)}for(;0!==a;){for(y(e),e.lineIndent=0,a=e.input.charCodeAt(e.position);(!l||e.lineIndent<h)&&32===a;)e.lineIndent++,a=e.input.charCodeAt(++e.position)
if(!l&&e.lineIndent>h&&(h=e.lineIndent),n(a))f++
else{if(e.lineIndent<h){c===Q?e.result+=U.repeat("\n",f):c===Z&&l&&(e.result+="\n")
break}for(o?i(a)?(p=!0,e.result+=U.repeat("\n",f+1)):p?(p=!1,e.result+=U.repeat("\n",f+1)):0===f?l&&(e.result+=" "):e.result+=U.repeat("\n",f):l?e.result+=U.repeat("\n",f+1):e.result+=U.repeat("\n",f),l=!0,f=0,r=e.position;!n(a)&&0!==a;)a=e.input.charCodeAt(++e.position)
m(e,r,e.position,!1)}}return!0}function T(e,t){var r,n,i,s=e.tag,a=e.anchor,c=[],u=!1
for(null!==e.anchor&&(e.anchorMap[e.anchor]=c),i=e.input.charCodeAt(e.position);0!==i&&45===i&&(n=e.input.charCodeAt(e.position+1),o(n));)if(u=!0,e.position++,w(e,!0,-1)&&e.lineIndent<=t)c.push(null),i=e.input.charCodeAt(e.position)
else if(r=e.line,R(e,t,K,!1,!0),c.push(e.result),w(e,!0,-1),i=e.input.charCodeAt(e.position),(e.line===r||e.lineIndent>t)&&0!==i)d(e,"bad indentation of a sequence entry")
else if(e.lineIndent<t)break
return u?(e.tag=s,e.anchor=a,e.kind="sequence",e.result=c,!0):!1}function q(e,t,r){var n,s,a,c,u=e.tag,l=e.anchor,h={},f={},p=null,g=null,m=null,v=!1,y=!1
for(null!==e.anchor&&(e.anchorMap[e.anchor]=h),c=e.input.charCodeAt(e.position);0!==c;){if(n=e.input.charCodeAt(e.position+1),a=e.line,63!==c&&58!==c||!o(n)){if(!R(e,r,$,!1,!0))break
if(e.line===a){for(c=e.input.charCodeAt(e.position);i(c);)c=e.input.charCodeAt(++e.position)
if(58===c)c=e.input.charCodeAt(++e.position),o(c)||d(e,"a whitespace character is expected after the key-value separator within a block mapping"),v&&(b(e,h,f,p,g,null),p=g=m=null),y=!0,v=!1,s=!1,p=e.tag,g=e.result
else{if(!y)return e.tag=u,e.anchor=l,!0
d(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!y)return e.tag=u,e.anchor=l,!0
d(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===c?(v&&(b(e,h,f,p,g,null),p=g=m=null),y=!0,v=!0,s=!0):v?(v=!1,s=!0):d(e,"incomplete explicit mapping pair; a key node is missed"),e.position+=1,c=n
if((e.line===a||e.lineIndent>t)&&(R(e,t,Y,!0,s)&&(v?g=e.result:m=e.result),v||(b(e,h,f,p,g,m),p=g=m=null),w(e,!0,-1),c=e.input.charCodeAt(e.position)),e.lineIndent>t&&0!==c)d(e,"bad indentation of a mapping entry")
else if(e.lineIndent<t)break}return v&&b(e,h,f,p,g,null),y&&(e.tag=u,e.anchor=l,e.kind="mapping",e.result=h),y}function j(e){var t,r,n,i,s=!1,a=!1
if(i=e.input.charCodeAt(e.position),33!==i)return!1
if(null!==e.tag&&d(e,"duplication of a tag property"),i=e.input.charCodeAt(++e.position),60===i?(s=!0,i=e.input.charCodeAt(++e.position)):33===i?(a=!0,r="!!",i=e.input.charCodeAt(++e.position)):r="!",t=e.position,s){do i=e.input.charCodeAt(++e.position)
while(0!==i&&62!==i)
e.position<e.length?(n=e.input.slice(t,e.position),i=e.input.charCodeAt(++e.position)):d(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==i&&!o(i);)33===i&&(a?d(e,"tag suffix cannot contain exclamation marks"):(r=e.input.slice(t-1,e.position+1),re.test(r)||d(e,"named tag handle cannot contain such characters"),a=!0,t=e.position+1)),i=e.input.charCodeAt(++e.position)
n=e.input.slice(t,e.position),te.test(n)&&d(e,"tag suffix cannot contain flow indicator characters")}return n&&!ne.test(n)&&d(e,"tag name cannot contain such characters: "+n),s?e.tag=n:W.call(e.tagMap,r)?e.tag=e.tagMap[r]+n:"!"===r?e.tag="!"+n:"!!"===r?e.tag="tag:yaml.org,2002:"+n:d(e,'undeclared tag handle "'+r+'"'),!0}function O(e){var t,r
if(r=e.input.charCodeAt(e.position),38!==r)return!1
for(null!==e.anchor&&d(e,"duplication of an anchor property"),r=e.input.charCodeAt(++e.position),t=e.position;0!==r&&!o(r)&&!s(r);)r=e.input.charCodeAt(++e.position)
return e.position===t&&d(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function L(e){var t,r,n
if(n=e.input.charCodeAt(e.position),42!==n)return!1
for(n=e.input.charCodeAt(++e.position),t=e.position;0!==n&&!o(n)&&!s(n);)n=e.input.charCodeAt(++e.position)
return e.position===t&&d(e,"name of an alias node must contain at least one character"),r=e.input.slice(t,e.position),e.anchorMap.hasOwnProperty(r)||d(e,'unidentified alias "'+r+'"'),e.result=e.anchorMap[r],w(e,!0,-1),!0}function R(e,t,r,n,i){var o,s,a,c,u,l,h,f,p=1,g=!1,m=!1
if(null!==e.listener&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,o=s=a=Y===r||K===r,n&&w(e,!0,-1)&&(g=!0,e.lineIndent>t?p=1:e.lineIndent===t?p=0:e.lineIndent<t&&(p=-1)),1===p)for(;j(e)||O(e);)w(e,!0,-1)?(g=!0,a=o,e.lineIndent>t?p=1:e.lineIndent===t?p=0:e.lineIndent<t&&(p=-1)):a=!1
if(a&&(a=g||i),(1===p||Y===r)&&(h=G===r||$===r?t:t+1,f=e.position-e.lineStart,1===p?a&&(T(e,f)||q(e,f,h))||S(e,h)?m=!0:(s&&C(e,h)||E(e,h)||A(e,h)?m=!0:L(e)?(m=!0,(null!==e.tag||null!==e.anchor)&&d(e,"alias node should not have any properties")):x(e,h,G===r)&&(m=!0,null===e.tag&&(e.tag="?")),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):0===p&&(m=a&&T(e,f))),null!==e.tag&&"!"!==e.tag)if("?"===e.tag){for(c=0,u=e.implicitTypes.length;u>c;c+=1)if(l=e.implicitTypes[c],l.resolve(e.result)){e.result=l.construct(e.result),e.tag=l.tag,null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)
break}}else W.call(e.typeMap,e.tag)?(l=e.typeMap[e.tag],null!==e.result&&l.kind!==e.kind&&d(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+l.kind+'", not "'+e.kind+'"'),l.resolve(e.result)?(e.result=l.construct(e.result),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):d(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")):d(e,"unknown tag !<"+e.tag+">")
return null!==e.listener&&e.listener("close",e),null!==e.tag||null!==e.anchor||m}function I(e){var t,r,s,a,c=e.position,u=!1
for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap={},e.anchorMap={};0!==(a=e.input.charCodeAt(e.position))&&(w(e,!0,-1),a=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==a));){for(u=!0,a=e.input.charCodeAt(++e.position),t=e.position;0!==a&&!o(a);)a=e.input.charCodeAt(++e.position)
for(r=e.input.slice(t,e.position),s=[],r.length<1&&d(e,"directive name must not be less than one character in length");0!==a;){for(;i(a);)a=e.input.charCodeAt(++e.position)
if(35===a){do a=e.input.charCodeAt(++e.position)
while(0!==a&&!n(a))
break}if(n(a))break
for(t=e.position;0!==a&&!o(a);)a=e.input.charCodeAt(++e.position)
s.push(e.input.slice(t,e.position))}0!==a&&y(e),W.call(ae,r)?ae[r](e,r,s):g(e,'unknown document directive "'+r+'"')}return w(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,w(e,!0,-1)):u&&d(e,"directives end mark is expected"),R(e,e.lineIndent-1,Y,!1,!0),w(e,!0,-1),e.checkLineBreaks&&ee.test(e.input.slice(c,e.position))&&g(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&_(e)?void(46===e.input.charCodeAt(e.position)&&(e.position+=3,w(e,!0,-1))):void(e.position<e.length-1&&d(e,"end of the stream or a document separator is expected"))}function N(e,t){e=String(e),t=t||{},0!==e.length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)))
var r=new f(e,t)
for(r.input+="\x00";32===r.input.charCodeAt(r.position);)r.lineIndent+=1,r.position+=1
for(;r.position<r.length-1;)I(r)
return r.documents}function B(e,t,r){var n,i,o=N(e,r)
for(n=0,i=o.length;i>n;n+=1)t(o[n])}function D(e,t){var r=N(e,t)
if(0===r.length)return void 0
if(1===r.length)return r[0]
throw new F("expected a single document in the stream, but found more")}function P(e,t,r){B(e,t,U.extend({schema:V},r))}function M(e,t){return D(e,U.extend({schema:V},t))}for(var U=e("./common"),F=e("./exception"),z=e("./mark"),V=e("./schema/default_safe"),H=e("./schema/default_full"),W=Object.prototype.hasOwnProperty,G=1,$=2,K=3,Y=4,Z=1,J=2,Q=3,X=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,ee=/[\x85\u2028\u2029]/,te=/[,\[\]\{\}]/,re=/^(?:!|!!|![a-z\-]+!)$/i,ne=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i,ie=new Array(256),oe=new Array(256),se=0;256>se;se++)ie[se]=l(se)?1:0,oe[se]=l(se)
var ae={YAML:function(e,t,r){var n,i,o
null!==e.version&&d(e,"duplication of %YAML directive"),1!==r.length&&d(e,"YAML directive accepts exactly one argument"),n=/^([0-9]+)\.([0-9]+)$/.exec(r[0]),null===n&&d(e,"ill-formed argument of the YAML directive"),i=parseInt(n[1],10),o=parseInt(n[2],10),1!==i&&d(e,"unacceptable YAML version of the document"),e.version=r[0],e.checkLineBreaks=2>o,1!==o&&2!==o&&g(e,"unsupported YAML version of the document")},TAG:function(e,t,r){var n,i
2!==r.length&&d(e,"TAG directive accepts exactly two arguments"),n=r[0],i=r[1],re.test(n)||d(e,"ill-formed tag handle (first argument) of the TAG directive"),W.call(e.tagMap,n)&&d(e,'there is a previously declared suffix for "'+n+'" tag handle'),ne.test(i)||d(e,"ill-formed tag prefix (second argument) of the TAG directive"),e.tagMap[n]=i}}
t.exports.loadAll=B,t.exports.load=D,t.exports.safeLoadAll=P,t.exports.safeLoad=M},{"./common":65,"./exception":67,"./mark":69,"./schema/default_full":72,"./schema/default_safe":73}],69:[function(e,t,r){"use strict"
function n(e,t,r,n,i){this.name=e,this.buffer=t,this.position=r,this.line=n,this.column=i}var i=e("./common")
n.prototype.getSnippet=function(e,t){var r,n,o,s,a
if(!this.buffer)return null
for(e=e||4,t=t||75,r="",n=this.position;n>0&&-1==="\x00\r\n\u2028\u2029".indexOf(this.buffer.charAt(n-1));)if(n-=1,this.position-n>t/2-1){r=" ... ",n+=5
break}for(o="",s=this.position;s<this.buffer.length&&-1==="\x00\r\n\u2028\u2029".indexOf(this.buffer.charAt(s));)if(s+=1,s-this.position>t/2-1){o=" ... ",s-=5
break}return a=this.buffer.slice(n,s),i.repeat(" ",e)+r+a+o+"\n"+i.repeat(" ",e+this.position-n+r.length)+"^"},n.prototype.toString=function(e){var t,r=""
return this.name&&(r+='in "'+this.name+'" '),r+="at line "+(this.line+1)+", column "+(this.column+1),e||(t=this.getSnippet(),t&&(r+=":\n"+t)),r},t.exports=n},{"./common":65}],70:[function(e,t,r){"use strict"
function n(e,t,r){var i=[]
return e.include.forEach(function(e){r=n(e,t,r)}),e[t].forEach(function(e){r.forEach(function(t,r){t.tag===e.tag&&i.push(r)}),r.push(e)}),r.filter(function(e,t){return-1===i.indexOf(t)})}function i(){function e(e){n[e.tag]=e}var t,r,n={}
for(t=0,r=arguments.length;r>t;t+=1)arguments[t].forEach(e)
return n}function o(e){this.include=e.include||[],this.implicit=e.implicit||[],this.explicit=e.explicit||[],this.implicit.forEach(function(e){if(e.loadKind&&"scalar"!==e.loadKind)throw new a("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.")}),this.compiledImplicit=n(this,"implicit",[]),this.compiledExplicit=n(this,"explicit",[]),this.compiledTypeMap=i(this.compiledImplicit,this.compiledExplicit)}var s=e("./common"),a=e("./exception"),c=e("./type")
o.DEFAULT=null,o.create=function(){var e,t
switch(arguments.length){case 1:e=o.DEFAULT,t=arguments[0]
break
case 2:e=arguments[0],t=arguments[1]
break
default:throw new a("Wrong number of arguments for Schema.create function")}if(e=s.toArray(e),t=s.toArray(t),!e.every(function(e){return e instanceof o}))throw new a("Specified list of super schemas (or a single Schema object) contains a non-Schema object.")
if(!t.every(function(e){return e instanceof c}))throw new a("Specified list of YAML types (or a single Type object) contains a non-Type object.")
return new o({include:e,explicit:t})},t.exports=o},{"./common":65,"./exception":67,"./type":76}],71:[function(e,t,r){"use strict"
var n=e("../schema")
t.exports=new n({include:[e("./json")]})},{"../schema":70,"./json":75}],72:[function(e,t,r){"use strict"
var n=e("../schema")
t.exports=n.DEFAULT=new n({include:[e("./default_safe")],explicit:[e("../type/js/undefined"),e("../type/js/regexp"),e("../type/js/function")]})},{"../schema":70,"../type/js/function":81,"../type/js/regexp":82,"../type/js/undefined":83,"./default_safe":73}],73:[function(e,t,r){"use strict"
var n=e("../schema")
t.exports=new n({include:[e("./core")],implicit:[e("../type/timestamp"),e("../type/merge")],explicit:[e("../type/binary"),e("../type/omap"),e("../type/pairs"),e("../type/set")]})},{"../schema":70,"../type/binary":77,"../type/merge":85,"../type/omap":87,"../type/pairs":88,"../type/set":90,"../type/timestamp":92,"./core":71}],74:[function(e,t,r){"use strict"
var n=e("../schema")
t.exports=new n({explicit:[e("../type/str"),e("../type/seq"),e("../type/map")]})},{"../schema":70,"../type/map":84,"../type/seq":89,"../type/str":91}],75:[function(e,t,r){"use strict"
var n=e("../schema")
t.exports=new n({include:[e("./failsafe")],implicit:[e("../type/null"),e("../type/bool"),e("../type/int"),e("../type/float")]})},{"../schema":70,"../type/bool":78,"../type/float":79,"../type/int":80,"../type/null":86,"./failsafe":74}],76:[function(e,t,r){"use strict"
function n(e){var t={}
return null!==e&&Object.keys(e).forEach(function(r){e[r].forEach(function(e){t[String(e)]=r})}),t}function i(e,t){if(t=t||{},Object.keys(t).forEach(function(t){if(-1===s.indexOf(t))throw new o('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')}),this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(e){return e},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.defaultStyle=t.defaultStyle||null,this.styleAliases=n(t.styleAliases||null),-1===a.indexOf(this.kind))throw new o('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')}var o=e("./exception"),s=["kind","resolve","construct","instanceOf","predicate","represent","defaultStyle","styleAliases"],a=["scalar","sequence","mapping"]
t.exports=i},{"./exception":67}],77:[function(e,t,r){"use strict"
function n(e){if(null===e)return!1
var t,r,n=0,i=e.length,o=u
for(r=0;i>r;r++)if(t=o.indexOf(e.charAt(r)),!(t>64)){if(0>t)return!1
n+=6}return n%8===0}function i(e){var t,r,n=e.replace(/[\r\n=]/g,""),i=n.length,o=u,s=0,c=[]
for(t=0;i>t;t++)t%4===0&&t&&(c.push(s>>16&255),c.push(s>>8&255),c.push(255&s)),s=s<<6|o.indexOf(n.charAt(t))
return r=i%4*6,0===r?(c.push(s>>16&255),c.push(s>>8&255),c.push(255&s)):18===r?(c.push(s>>10&255),c.push(s>>2&255)):12===r&&c.push(s>>4&255),a?new a(c):c}function o(e){var t,r,n="",i=0,o=e.length,s=u
for(t=0;o>t;t++)t%3===0&&t&&(n+=s[i>>18&63],n+=s[i>>12&63],n+=s[i>>6&63],n+=s[63&i]),i=(i<<8)+e[t]
return r=o%3,0===r?(n+=s[i>>18&63],n+=s[i>>12&63],n+=s[i>>6&63],n+=s[63&i]):2===r?(n+=s[i>>10&63],n+=s[i>>4&63],n+=s[i<<2&63],n+=s[64]):1===r&&(n+=s[i>>2&63],n+=s[i<<4&63],n+=s[64],n+=s[64]),n}function s(e){return a&&a.isBuffer(e)}var a=e("buffer").Buffer,c=e("../type"),u="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r"
t.exports=new c("tag:yaml.org,2002:binary",{kind:"scalar",resolve:n,construct:i,predicate:s,represent:o})},{"../type":76,buffer:203}],78:[function(e,t,r){"use strict"
function n(e){if(null===e)return!1
var t=e.length
return 4===t&&("true"===e||"True"===e||"TRUE"===e)||5===t&&("false"===e||"False"===e||"FALSE"===e)}function i(e){return"true"===e||"True"===e||"TRUE"===e}function o(e){return"[object Boolean]"===Object.prototype.toString.call(e)}var s=e("../type")
t.exports=new s("tag:yaml.org,2002:bool",{kind:"scalar",resolve:n,construct:i,predicate:o,represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"})},{"../type":76}],79:[function(e,t,r){"use strict"
function n(e){return null===e?!1:u.test(e)?!0:!1}function i(e){var t,r,n,i
return t=e.replace(/_/g,"").toLowerCase(),r="-"===t[0]?-1:1,i=[],"+-".indexOf(t[0])>=0&&(t=t.slice(1)),".inf"===t?1===r?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===t?NaN:t.indexOf(":")>=0?(t.split(":").forEach(function(e){i.unshift(parseFloat(e,10))}),t=0,n=1,i.forEach(function(e){t+=e*n,n*=60}),r*t):r*parseFloat(t,10)}function o(e,t){var r
if(isNaN(e))switch(t){case"lowercase":return".nan"
case"uppercase":return".NAN"
case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(t){case"lowercase":return".inf"
case"uppercase":return".INF"
case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(t){case"lowercase":return"-.inf"
case"uppercase":return"-.INF"
case"camelcase":return"-.Inf"}else if(a.isNegativeZero(e))return"-0.0"
return r=e.toString(10),l.test(r)?r.replace("e",".e"):r}function s(e){return"[object Number]"===Object.prototype.toString.call(e)&&(e%1!==0||a.isNegativeZero(e))}var a=e("../common"),c=e("../type"),u=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)\\.[0-9_]*(?:[eE][-+][0-9]+)?|\\.[0-9_]+(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),l=/^[-+]?[0-9]+e/
t.exports=new c("tag:yaml.org,2002:float",{kind:"scalar",resolve:n,construct:i,predicate:s,represent:o,defaultStyle:"lowercase"})},{"../common":65,"../type":76}],80:[function(e,t,r){"use strict"
function n(e){return e>=48&&57>=e||e>=65&&70>=e||e>=97&&102>=e}function i(e){return e>=48&&55>=e}function o(e){return e>=48&&57>=e}function s(e){if(null===e)return!1
var t,r=e.length,s=0,a=!1
if(!r)return!1
if(t=e[s],("-"===t||"+"===t)&&(t=e[++s]),"0"===t){if(s+1===r)return!0
if(t=e[++s],"b"===t){for(s++;r>s;s++)if(t=e[s],"_"!==t){if("0"!==t&&"1"!==t)return!1
a=!0}return a}if("x"===t){for(s++;r>s;s++)if(t=e[s],"_"!==t){if(!n(e.charCodeAt(s)))return!1
a=!0}return a}for(;r>s;s++)if(t=e[s],"_"!==t){if(!i(e.charCodeAt(s)))return!1
a=!0}return a}for(;r>s;s++)if(t=e[s],"_"!==t){if(":"===t)break
if(!o(e.charCodeAt(s)))return!1
a=!0}return a?":"!==t?!0:/^(:[0-5]?[0-9])+$/.test(e.slice(s)):!1}function a(e){var t,r,n=e,i=1,o=[]
return-1!==n.indexOf("_")&&(n=n.replace(/_/g,"")),t=n[0],("-"===t||"+"===t)&&("-"===t&&(i=-1),n=n.slice(1),t=n[0]),"0"===n?0:"0"===t?"b"===n[1]?i*parseInt(n.slice(2),2):"x"===n[1]?i*parseInt(n,16):i*parseInt(n,8):-1!==n.indexOf(":")?(n.split(":").forEach(function(e){o.unshift(parseInt(e,10))}),n=0,r=1,o.forEach(function(e){n+=e*r,r*=60}),i*n):i*parseInt(n,10)}function c(e){return"[object Number]"===Object.prototype.toString.call(e)&&e%1===0&&!u.isNegativeZero(e)}var u=e("../common"),l=e("../type")
t.exports=new l("tag:yaml.org,2002:int",{kind:"scalar",resolve:s,construct:a,predicate:c,represent:{binary:function(e){return"0b"+e.toString(2)},octal:function(e){return"0"+e.toString(8)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return"0x"+e.toString(16).toUpperCase()}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}})},{"../common":65,"../type":76}],81:[function(e,t,r){"use strict"
function n(e){if(null===e)return!1
try{var t="("+e+")",r=a.parse(t,{range:!0})
return"Program"!==r.type||1!==r.body.length||"ExpressionStatement"!==r.body[0].type||"FunctionExpression"!==r.body[0].expression.type?!1:!0}catch(n){return!1}}function i(e){var t,r="("+e+")",n=a.parse(r,{range:!0}),i=[]
if("Program"!==n.type||1!==n.body.length||"ExpressionStatement"!==n.body[0].type||"FunctionExpression"!==n.body[0].expression.type)throw new Error("Failed to resolve function")
return n.body[0].expression.params.forEach(function(e){i.push(e.name)}),t=n.body[0].expression.body.range,new Function(i,r.slice(t[0]+1,t[1]-1))}function o(e){return e.toString()}function s(e){return"[object Function]"===Object.prototype.toString.call(e)}var a
try{var c=e
a=c("esprima")}catch(u){"undefined"!=typeof window&&(a=window.esprima)}var l=e("../../type")
t.exports=new l("tag:yaml.org,2002:js/function",{kind:"scalar",resolve:n,construct:i,predicate:s,represent:o})},{"../../type":76}],82:[function(e,t,r){"use strict"
function n(e){if(null===e)return!1
if(0===e.length)return!1
var t=e,r=/\/([gim]*)$/.exec(e),n=""
if("/"===t[0]){if(r&&(n=r[1]),n.length>3)return!1
if("/"!==t[t.length-n.length-1])return!1}return!0}function i(e){var t=e,r=/\/([gim]*)$/.exec(e),n=""
return"/"===t[0]&&(r&&(n=r[1]),t=t.slice(1,t.length-n.length-1)),new RegExp(t,n)}function o(e){var t="/"+e.source+"/"
return e.global&&(t+="g"),e.multiline&&(t+="m"),e.ignoreCase&&(t+="i"),t}function s(e){return"[object RegExp]"===Object.prototype.toString.call(e)}var a=e("../../type")
t.exports=new a("tag:yaml.org,2002:js/regexp",{kind:"scalar",resolve:n,construct:i,predicate:s,represent:o})},{"../../type":76}],83:[function(e,t,r){"use strict"
function n(){return!0}function i(){return void 0}function o(){return""}function s(e){return"undefined"==typeof e}var a=e("../../type")
t.exports=new a("tag:yaml.org,2002:js/undefined",{kind:"scalar",resolve:n,construct:i,predicate:s,represent:o})},{"../../type":76}],84:[function(e,t,r){"use strict"
var n=e("../type")
t.exports=new n("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}})},{"../type":76}],85:[function(e,t,r){"use strict"
function n(e){return"<<"===e||null===e}var i=e("../type")
t.exports=new i("tag:yaml.org,2002:merge",{kind:"scalar",resolve:n})},{"../type":76}],86:[function(e,t,r){"use strict"
function n(e){if(null===e)return!0
var t=e.length
return 1===t&&"~"===e||4===t&&("null"===e||"Null"===e||"NULL"===e)}function i(){return null}function o(e){return null===e}var s=e("../type")
t.exports=new s("tag:yaml.org,2002:null",{kind:"scalar",resolve:n,construct:i,predicate:o,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"}},defaultStyle:"lowercase"})},{"../type":76}],87:[function(e,t,r){"use strict"
function n(e){if(null===e)return!0
var t,r,n,i,o,c=[],u=e
for(t=0,r=u.length;r>t;t+=1){if(n=u[t],o=!1,"[object Object]"!==a.call(n))return!1
for(i in n)if(s.call(n,i)){if(o)return!1
o=!0}if(!o)return!1
if(-1!==c.indexOf(i))return!1
c.push(i)}return!0}function i(e){return null!==e?e:[]}var o=e("../type"),s=Object.prototype.hasOwnProperty,a=Object.prototype.toString
t.exports=new o("tag:yaml.org,2002:omap",{kind:"sequence",resolve:n,construct:i})},{"../type":76}],88:[function(e,t,r){"use strict"
function n(e){if(null===e)return!0
var t,r,n,i,o,a=e
for(o=new Array(a.length),t=0,r=a.length;r>t;t+=1){if(n=a[t],"[object Object]"!==s.call(n))return!1
if(i=Object.keys(n),1!==i.length)return!1
o[t]=[i[0],n[i[0]]]}return!0}function i(e){if(null===e)return[]
var t,r,n,i,o,s=e
for(o=new Array(s.length),t=0,r=s.length;r>t;t+=1)n=s[t],i=Object.keys(n),o[t]=[i[0],n[i[0]]]
return o}var o=e("../type"),s=Object.prototype.toString
t.exports=new o("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:n,construct:i})},{"../type":76}],89:[function(e,t,r){"use strict"
var n=e("../type")
t.exports=new n("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}})},{"../type":76}],90:[function(e,t,r){"use strict"
function n(e){if(null===e)return!0
var t,r=e
for(t in r)if(s.call(r,t)&&null!==r[t])return!1
return!0}function i(e){return null!==e?e:{}}var o=e("../type"),s=Object.prototype.hasOwnProperty
t.exports=new o("tag:yaml.org,2002:set",{kind:"mapping",resolve:n,construct:i})},{"../type":76}],91:[function(e,t,r){"use strict"
var n=e("../type")
t.exports=new n("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return null!==e?e:""}})},{"../type":76}],92:[function(e,t,r){"use strict"
function n(e){return null===e?!1:null===a.exec(e)?!1:!0}function i(e){var t,r,n,i,o,s,c,u,l,h,f=0,p=null
if(t=a.exec(e),null===t)throw new Error("Date resolve error")
if(r=+t[1],n=+t[2]-1,i=+t[3],!t[4])return new Date(Date.UTC(r,n,i))
if(o=+t[4],s=+t[5],c=+t[6],t[7]){for(f=t[7].slice(0,3);f.length<3;)f+="0"
f=+f}return t[9]&&(u=+t[10],l=+(t[11]||0),p=6e4*(60*u+l),"-"===t[9]&&(p=-p)),h=new Date(Date.UTC(r,n,i,o,s,c,f)),p&&h.setTime(h.getTime()-p),h}function o(e){return e.toISOString()}var s=e("../type"),a=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?)?$")
t.exports=new s("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:n,construct:i,instanceOf:Date,represent:o})},{"../type":76}],93:[function(e,t,r){function n(e,t){return e+": "+(t.indexOf(":")>=0?'"'+t+'"':t)}function i(e){return e.replace(/^[\s\uFEFF\xA0]*\n/,"")}function o(e){for(var t=e.split("\n"),r=!1,i=!1,o=[],s=0;s<t.length&&!i;s++)if(r)i||(i=!/^\s*$/.test(t[s]))
else{var a=/^([^:]+):\s*([^\r\n]+)\s*$/.exec(t[s])
if(a&&3===a.length){var c=a[1].trim(),u=a[2].trim()
o.push(n(c,u))}else s>=0&&(r=!0)}var l=t.slice(s-1).join("\n")
if(0===o.length)return l
var h="---\n"+o.join("\n")+"\n---\n"
return h+l}function s(e){0!==e.indexOf("---")&&(e=o(e))
var t=u(e),r={content:i(t.__content)}
return delete t.__content,r.metadata=t,r}function a(e,t){var r=s(t)
return r.metadata=e(r.metadata),r}var c=e("weak-type-wizard"),u=e("./js-yaml-front.js")
t.exports=function(e,t){var r=new c(t||{})
return a(r,e)}},{"./js-yaml-front.js":62,"weak-type-wizard":115}],94:[function(e,t,r){(function(r){"use strict"
function n(e){return e?(e=e.toLowerCase(),"utf8"===e||"utf-8"===e):!0}function i(e,t){if(n(t))return encodeURIComponent(e)
for(var r=p.encode(e,t),i="",o="",s=0;s<r.length;s++)o=r[s].toString("16"),1===o.length&&(o="0"+o),i+="%"+o
return i=i.toUpperCase()}function o(e,t){if(n(t))return decodeURIComponent(e)
for(var i=[],o=0;o<e.length;)"%"===e[o]?(o++,i.push(parseInt(e.substring(o,o+2),16)),o+=2):(i.push(e.charCodeAt(o)),o++)
var s=new r(i)
return p.decode(s,t)}function s(e,t,r,n){"object"==typeof t&&(n=t,t=null),t=t||"&",r=r||"="
var i={}
if("string"!=typeof e||0===e.length)return i
var s=/\+/g
e=e.split(t)
var c=1e3,u=null
n&&("number"==typeof n.maxKeys&&(c=n.maxKeys),"string"==typeof n.charset&&(u=n.charset))
var l=e.length
c>0&&l>c&&(l=c)
for(var h=0;l>h;++h){var f,p,d,g,m=e[h].replace(s,"%20"),v=m.indexOf(r)
if(v>=0?(f=m.substr(0,v),p=m.substr(v+1)):(f=m,p=""),f&&f.indexOf("%")>=0)try{d=o(f,u)}catch(b){d=f}else d=f
if(p&&p.indexOf("%")>=0)try{g=o(p,u)}catch(b){g=p}else g=p
a(i,d)?Array.isArray(i[d])?i[d].push(g):i[d]=[i[d],g]:i[d]=g}return i}function a(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function c(e){return/^[\x00-\x7F]*$/.test(e)}function u(e,t){return e=String(e),e=c(e)?encodeURIComponent(e):i(e,t)}function l(e,t,r){if(!t)throw new TypeError("stringify expects an object")
var n=r.charset
return t+"="+u(e,n)}function h(e,t,r){var n=[]
if(!t)throw new TypeError("stringify expects an object")
for(var i=0;i<e.length;i++)n.push(d(e[i],t+"["+i+"]",r))
return n.join("&")}function f(e,t,r){for(var n,o=[],s=Object.keys(e),a=r.charset,c=0,l=s.length;l>c;++c)n=s[c],""!==n&&(null===e[n]?o.push(i(n,a)+"="):o.push(d(e[n],t?t+"["+u(n,a)+"]":u(n,a),r)))
return o.join("&")}var p=e("iconv-lite"),d=function(e,t,r){"string"!=typeof t&&(r=t||{},t=null)
var n=r.charset||"utf-8"
return Array.isArray(e)?h(e,t,r):"[object Object]"==={}.toString.call(e)?f(e,t,r):"string"==typeof e?l(e,t,r):t+"="+u(String(e),n)}
t.exports=i,t.exports.encode=i,t.exports.decode=o,t.exports.parse=s,t.exports.stringify=d}).call(this,e("buffer").Buffer)},{buffer:204,"iconv-lite":113}],95:[function(e,t,r){(function(e){"use strict"
function t(e,t){if(this.encodingName=e.encodingName,!e)throw new Error("DBCS codec is called without the data.")
if(!e.table)throw new Error("Encoding '"+this.encodingName+"' has no data.")
var r=e.table()
this.decodeTables=[],this.decodeTables[0]=l.slice(0),this.decodeTableSeq=[]
for(var n=0;n<r.length;n++)this._addDecodeChunk(r[n])
this.defaultCharUnicode=t.defaultCharUnicode,this.encodeTable=[],this.encodeTableSeq=[]
var i={}
if(e.encodeSkipVals)for(var n=0;n<e.encodeSkipVals.length;n++){var o=e.encodeSkipVals[n]
if("number"==typeof o)i[o]=!0
else for(var c=o.from;c<=o.to;c++)i[c]=!0}if(this._fillEncodeTable(0,0,i),e.encodeAdd)for(var h in e.encodeAdd)Object.prototype.hasOwnProperty.call(e.encodeAdd,h)&&this._setEncodeChar(h.charCodeAt(0),e.encodeAdd[h])
if(this.defCharSB=this.encodeTable[0][t.defaultCharSingleByte.charCodeAt(0)],this.defCharSB===s&&(this.defCharSB=this.encodeTable[0]["?"]),this.defCharSB===s&&(this.defCharSB="?".charCodeAt(0)),"function"==typeof e.gb18030){this.gb18030=e.gb18030()
for(var f=this.decodeTables.length,p=this.decodeTables[f]=l.slice(0),d=this.decodeTables.length,g=this.decodeTables[d]=l.slice(0),n=129;254>=n;n++)for(var m=u-this.decodeTables[0][n],v=this.decodeTables[m],c=48;57>=c;c++)v[c]=u-f
for(var n=129;254>=n;n++)p[n]=u-d
for(var n=48;57>=n;n++)g[n]=a}}function n(e,t){this.leadSurrogate=-1,this.seqObj=void 0,this.encodeTable=t.encodeTable,this.encodeTableSeq=t.encodeTableSeq,this.defaultCharSingleByte=t.defCharSB,this.gb18030=t.gb18030}function i(t,r){this.nodeIdx=0,this.prevBuf=new e(0),this.decodeTables=r.decodeTables,this.decodeTableSeq=r.decodeTableSeq,this.defaultCharUnicode=r.defaultCharUnicode,this.gb18030=r.gb18030}function o(e,t){if(e[0]>t)return-1
for(var r=0,n=e.length;n-1>r;){var i=r+Math.floor((n-r+1)/2)
e[i]<=t?r=i:n=i}return r}r._dbcs=t
for(var s=-1,a=-2,c=-10,u=-1e3,l=new Array(256),h=-1,f=0;256>f;f++)l[f]=s
t.prototype.encoder=n,t.prototype.decoder=i,t.prototype._getDecodeTrieNode=function(e){for(var t=[];e>0;e>>=8)t.push(255&e)
0==t.length&&t.push(0)
for(var r=this.decodeTables[0],n=t.length-1;n>0;n--){var i=r[t[n]]
if(i==s)r[t[n]]=u-this.decodeTables.length,this.decodeTables.push(r=l.slice(0))
else{if(!(u>=i))throw new Error("Overwrite byte in "+this.encodingName+", addr: "+e.toString(16))
r=this.decodeTables[u-i]}}return r},t.prototype._addDecodeChunk=function(e){var t=parseInt(e[0],16),r=this._getDecodeTrieNode(t)
t=255&t
for(var n=1;n<e.length;n++){var i=e[n]
if("string"==typeof i)for(var o=0;o<i.length;){var s=i.charCodeAt(o++)
if(s>=55296&&56320>s){var a=i.charCodeAt(o++)
if(!(a>=56320&&57344>a))throw new Error("Incorrect surrogate pair in "+this.encodingName+" at chunk "+e[0])
r[t++]=65536+1024*(s-55296)+(a-56320)}else if(s>4080&&4095>=s){for(var u=4095-s+2,l=[],h=0;u>h;h++)l.push(i.charCodeAt(o++))
r[t++]=c-this.decodeTableSeq.length,this.decodeTableSeq.push(l)}else r[t++]=s}else{if("number"!=typeof i)throw new Error("Incorrect type '"+typeof i+"' given in "+this.encodingName+" at chunk "+e[0])
for(var f=r[t-1]+1,o=0;i>o;o++)r[t++]=f++}}if(t>255)throw new Error("Incorrect chunk in "+this.encodingName+" at addr "+e[0]+": too long"+t)},t.prototype._getEncodeBucket=function(e){var t=e>>8
return void 0===this.encodeTable[t]&&(this.encodeTable[t]=l.slice(0)),this.encodeTable[t]},t.prototype._setEncodeChar=function(e,t){var r=this._getEncodeBucket(e),n=255&e
r[n]<=c?this.encodeTableSeq[c-r[n]][h]=t:r[n]==s&&(r[n]=t)},t.prototype._setEncodeSequence=function(e,t){var r,n=e[0],i=this._getEncodeBucket(n),o=255&n
i[o]<=c?r=this.encodeTableSeq[c-i[o]]:(r={},i[o]!==s&&(r[h]=i[o]),i[o]=c-this.encodeTableSeq.length,this.encodeTableSeq.push(r))
for(var a=1;a<e.length-1;a++){var u=r[n]
"object"==typeof u?r=u:(r=r[n]={},void 0!==u&&(r[h]=u))}n=e[e.length-1],r[n]=t},t.prototype._fillEncodeTable=function(e,t,r){for(var n=this.decodeTables[e],i=0;256>i;i++){var o=n[i],s=t+i
r[s]||(o>=0?this._setEncodeChar(o,s):u>=o?this._fillEncodeTable(u-o,s<<8,r):c>=o&&this._setEncodeSequence(this.decodeTableSeq[c-o],s))}},n.prototype.write=function(t){for(var r=new e(t.length*(this.gb18030?4:3)),n=this.leadSurrogate,i=this.seqObj,a=-1,u=0,l=0;;){if(-1===a){if(u==t.length)break
var f=t.charCodeAt(u++)}else{var f=a
a=-1}if(f>=55296&&57344>f)if(56320>f){if(-1===n){n=f
continue}n=f,f=s}else-1!==n?(f=65536+1024*(n-55296)+(f-56320),n=-1):f=s
else-1!==n&&(a=f,f=s,n=-1)
var p=s
if(void 0!==i&&f!=s){var d=i[f]
if("object"==typeof d){i=d
continue}"number"==typeof d?p=d:void 0==d&&(d=i[h],void 0!==d&&(p=d,a=f)),i=void 0}else if(f>=0){var g=this.encodeTable[f>>8]
if(void 0!==g&&(p=g[255&f]),c>=p){i=this.encodeTableSeq[c-p]
continue}if(p==s&&this.gb18030){var m=o(this.gb18030.uChars,f)
if(-1!=m){var p=this.gb18030.gbChars[m]+(f-this.gb18030.uChars[m])
r[l++]=129+Math.floor(p/12600),p%=12600,r[l++]=48+Math.floor(p/1260),p%=1260,r[l++]=129+Math.floor(p/10),p%=10,r[l++]=48+p
continue}}}p===s&&(p=this.defaultCharSingleByte),256>p?r[l++]=p:65536>p?(r[l++]=p>>8,r[l++]=255&p):(r[l++]=p>>16,r[l++]=p>>8&255,r[l++]=255&p)}return this.seqObj=i,this.leadSurrogate=n,r.slice(0,l)},n.prototype.end=function(){if(-1!==this.leadSurrogate||void 0!==this.seqObj){var t=new e(10),r=0
if(this.seqObj){var n=this.seqObj[h]
void 0!==n&&(256>n?t[r++]=n:(t[r++]=n>>8,t[r++]=255&n)),this.seqObj=void 0}return-1!==this.leadSurrogate&&(t[r++]=this.defaultCharSingleByte,this.leadSurrogate=-1),t.slice(0,r)}},n.prototype.findIdx=o,i.prototype.write=function(t){var r,n=new e(2*t.length),i=this.nodeIdx,l=this.prevBuf,h=this.prevBuf.length,f=-this.prevBuf.length
h>0&&(l=e.concat([l,t.slice(0,10)]))
for(var p=0,d=0;p<t.length;p++){var g=p>=0?t[p]:l[p+h],r=this.decodeTables[i][g]
if(r>=0);else if(r===s)p=f,r=this.defaultCharUnicode.charCodeAt(0)
else if(r===a){var m=f>=0?t.slice(f,p+1):l.slice(f+h,p+1+h),v=12600*(m[0]-129)+1260*(m[1]-48)+10*(m[2]-129)+(m[3]-48),b=o(this.gb18030.gbChars,v)
r=this.gb18030.uChars[b]+v-this.gb18030.gbChars[b]}else{if(u>=r){i=u-r
continue}if(!(c>=r))throw new Error("iconv-lite internal error: invalid decoding table value "+r+" at "+i+"/"+g)
for(var y=this.decodeTableSeq[c-r],w=0;w<y.length-1;w++)r=y[w],n[d++]=255&r,n[d++]=r>>8
r=y[y.length-1]}if(r>65535){r-=65536
var _=55296+Math.floor(r/1024)
n[d++]=255&_,n[d++]=_>>8,r=56320+r%1024}n[d++]=255&r,n[d++]=r>>8,i=0,f=p+1}return this.nodeIdx=i,this.prevBuf=f>=0?t.slice(f):l.slice(f+h),n.slice(0,d).toString("ucs2")},i.prototype.end=function(){for(var t="";this.prevBuf.length>0;){t+=this.defaultCharUnicode
var r=this.prevBuf.slice(1)
this.prevBuf=new e(0),this.nodeIdx=0,r.length>0&&(t+=this.write(r))}return this.nodeIdx=0,t}}).call(this,e("buffer").Buffer)},{buffer:204}],96:[function(e,t,r){"use strict"
t.exports={shiftjis:{type:"_dbcs",table:function(){return e("./tables/shiftjis.json")},encodeAdd:{"¥":92,"‾":126},encodeSkipVals:[{from:60736,to:63808}]},csshiftjis:"shiftjis",mskanji:"shiftjis",sjis:"shiftjis",windows31j:"shiftjis",xsjis:"shiftjis",windows932:"shiftjis",932:"shiftjis",cp932:"shiftjis",eucjp:{type:"_dbcs",table:function(){return e("./tables/eucjp.json")},encodeAdd:{"¥":92,"‾":126}},gb2312:"cp936",gb231280:"cp936",gb23121980:"cp936",csgb2312:"cp936",csiso58gb231280:"cp936",euccn:"cp936",isoir58:"gbk",windows936:"cp936",936:"cp936",cp936:{type:"_dbcs",table:function(){return e("./tables/cp936.json")}},gbk:{type:"_dbcs",table:function(){return e("./tables/cp936.json").concat(e("./tables/gbk-added.json"))}},xgbk:"gbk",gb18030:{type:"_dbcs",table:function(){return e("./tables/cp936.json").concat(e("./tables/gbk-added.json"))},gb18030:function(){return e("./tables/gb18030-ranges.json")}},chinese:"gb18030",windows949:"cp949",949:"cp949",cp949:{type:"_dbcs",table:function(){return e("./tables/cp949.json")}},cseuckr:"cp949",csksc56011987:"cp949",euckr:"cp949",isoir149:"cp949",korean:"cp949",ksc56011987:"cp949",ksc56011989:"cp949",ksc5601:"cp949",windows950:"cp950",950:"cp950",cp950:{type:"_dbcs",table:function(){return e("./tables/cp950.json")}},big5:"big5hkscs",big5hkscs:{type:"_dbcs",table:function(){return e("./tables/cp950.json").concat(e("./tables/big5-added.json"))},encodeSkipVals:[41676]},cnbig5:"big5hkscs",csbig5:"big5hkscs",xxbig5:"big5hkscs"}},{"./tables/big5-added.json":102,"./tables/cp936.json":103,"./tables/cp949.json":104,"./tables/cp950.json":105,"./tables/eucjp.json":106,"./tables/gb18030-ranges.json":107,"./tables/gbk-added.json":108,"./tables/shiftjis.json":109}],97:[function(e,t,r){"use strict"
for(var n=[e("./internal"),e("./utf16"),e("./utf7"),e("./sbcs-codec"),e("./sbcs-data"),e("./sbcs-data-generated"),e("./dbcs-codec"),e("./dbcs-data")],i=0;i<n.length;i++){var t=n[i]
for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(r[o]=t[o])}},{"./dbcs-codec":95,"./dbcs-data":96,"./internal":98,"./sbcs-codec":99,"./sbcs-data":101,"./sbcs-data-generated":100,"./utf16":110,"./utf7":111}],98:[function(e,t,r){(function(r){"use strict"
function n(e,t){this.enc=e.encodingName,this.bomAware=e.bomAware,"base64"===this.enc?this.encoder=s:"cesu8"===this.enc&&(this.enc="utf8",this.encoder=a,3==new r("eda080","hex").toString().length&&(this.decoder=c,this.defaultCharUnicode=t.defaultCharUnicode))}function i(e,t){u.call(this,t.enc)}function o(e,t){this.enc=t.enc}function s(e,t){this.prevStr=""}function a(e,t){}function c(e,t){this.acc=0,this.contBytes=0,this.accBytes=0,this.defaultCharUnicode=t.defaultCharUnicode}t.exports={utf8:{type:"_internal",bomAware:!0},cesu8:{type:"_internal",bomAware:!0},unicode11utf8:"utf8",ucs2:{type:"_internal",bomAware:!0},utf16le:"ucs2",binary:{type:"_internal"},base64:{type:"_internal"},hex:{type:"_internal"},_internal:n},n.prototype.encoder=o,n.prototype.decoder=i
var u=e("string_decoder").StringDecoder
u.prototype.end||(u.prototype.end=function(){}),i.prototype=u.prototype,o.prototype.write=function(e){return new r(e,this.enc)},o.prototype.end=function(){},s.prototype.write=function(e){e=this.prevStr+e
var t=e.length-e.length%4
return this.prevStr=e.slice(t),e=e.slice(0,t),new r(e,"base64")},s.prototype.end=function(){return new r(this.prevStr,"base64")},a.prototype.write=function(e){for(var t=new r(3*e.length),n=0,i=0;i<e.length;i++){var o=e.charCodeAt(i)
128>o?t[n++]=o:2048>o?(t[n++]=192+(o>>>6),t[n++]=128+(63&o)):(t[n++]=224+(o>>>12),t[n++]=128+(o>>>6&63),t[n++]=128+(63&o))}return t.slice(0,n)},a.prototype.end=function(){},c.prototype.write=function(e){for(var t=this.acc,r=this.contBytes,n=this.accBytes,i="",o=0;o<e.length;o++){var s=e[o]
128!==(192&s)?(r>0&&(i+=this.defaultCharUnicode,r=0),128>s?i+=String.fromCharCode(s):224>s?(t=31&s,r=1,n=1):240>s?(t=15&s,r=2,n=1):i+=this.defaultCharUnicode):r>0?(t=t<<6|63&s,r--,n++,0===r&&(i+=2===n&&128>t&&t>0?this.defaultCharUnicode:3===n&&2048>t?this.defaultCharUnicode:String.fromCharCode(t))):i+=this.defaultCharUnicode}return this.acc=t,this.contBytes=r,this.accBytes=n,i},c.prototype.end=function(){var e=0
return this.contBytes>0&&(e+=this.defaultCharUnicode),e}}).call(this,e("buffer").Buffer)},{buffer:204,string_decoder:228}],99:[function(e,t,r){(function(e){"use strict"
function t(t,r){if(!t)throw new Error("SBCS codec is called without the data.")
if(!t.chars||128!==t.chars.length&&256!==t.chars.length)throw new Error("Encoding '"+t.type+"' has incorrect 'chars' (must be of len 128 or 256)")
if(128===t.chars.length){for(var n="",i=0;128>i;i++)n+=String.fromCharCode(i)
t.chars=n+t.chars}this.decodeBuf=new e(t.chars,"ucs2")
var o=new e(65536)
o.fill(r.defaultCharSingleByte.charCodeAt(0))
for(var i=0;i<t.chars.length;i++)o[t.chars.charCodeAt(i)]=i
this.encodeBuf=o}function n(e,t){this.encodeBuf=t.encodeBuf}function i(e,t){this.decodeBuf=t.decodeBuf}r._sbcs=t,t.prototype.encoder=n,t.prototype.decoder=i,n.prototype.write=function(t){for(var r=new e(t.length),n=0;n<t.length;n++)r[n]=this.encodeBuf[t.charCodeAt(n)]
return r},n.prototype.end=function(){},i.prototype.write=function(t){for(var r=this.decodeBuf,n=new e(2*t.length),i=0,o=0,s=0;s<t.length;s++)i=2*t[s],o=2*s,n[o]=r[i],n[o+1]=r[i+1]
return n.toString("ucs2")},i.prototype.end=function(){}}).call(this,e("buffer").Buffer)},{buffer:204}],100:[function(e,t,r){"use strict"
t.exports={437:"cp437",737:"cp737",775:"cp775",850:"cp850",852:"cp852",855:"cp855",856:"cp856",857:"cp857",858:"cp858",860:"cp860",861:"cp861",862:"cp862",863:"cp863",864:"cp864",865:"cp865",866:"cp866",869:"cp869",874:"windows874",922:"cp922",1046:"cp1046",1124:"cp1124",1125:"cp1125",1129:"cp1129",1133:"cp1133",1161:"cp1161",1162:"cp1162",1163:"cp1163",1250:"windows1250",1251:"windows1251",1252:"windows1252",1253:"windows1253",1254:"windows1254",1255:"windows1255",1256:"windows1256",1257:"windows1257",1258:"windows1258",28591:"iso88591",28592:"iso88592",28593:"iso88593",28594:"iso88594",28595:"iso88595",28596:"iso88596",28597:"iso88597",28598:"iso88598",28599:"iso88599",28600:"iso885910",28601:"iso885911",28603:"iso885913",28604:"iso885914",28605:"iso885915",28606:"iso885916",windows874:{type:"_sbcs",chars:"€����…�����������‘’“”•–—�������� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"},win874:"windows874",cp874:"windows874",windows1250:{type:"_sbcs",chars:"€�‚�„…†‡�‰Š‹ŚŤŽŹ�‘’“”•–—�™š›śťžź ˇ˘Ł¤Ą¦§¨©Ş«¬­®Ż°±˛ł´µ¶·¸ąş»Ľ˝ľżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"},win1250:"windows1250",cp1250:"windows1250",windows1251:{type:"_sbcs",chars:"ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—�™љ›њќћџ ЎўЈ¤Ґ¦§Ё©Є«¬­®Ї°±Ііґµ¶·ё№є»јЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"},win1251:"windows1251",cp1251:"windows1251",windows1252:{type:"_sbcs",chars:"€�‚ƒ„…†‡ˆ‰Š‹Œ�Ž��‘’“”•–—˜™š›œ�žŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"},win1252:"windows1252",cp1252:"windows1252",windows1253:{type:"_sbcs",chars:"€�‚ƒ„…†‡�‰�‹�����‘’“”•–—�™�›���� ΅Ά£¤¥¦§¨©�«¬­®―°±²³΄µ¶·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"},win1253:"windows1253",cp1253:"windows1253",windows1254:{type:"_sbcs",chars:"€�‚ƒ„…†‡ˆ‰Š‹Œ����‘’“”•–—˜™š›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"},win1254:"windows1254",cp1254:"windows1254",windows1255:{type:"_sbcs",chars:"€�‚ƒ„…†‡ˆ‰�‹�����‘’“”•–—˜™�›���� ¡¢£₪¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾¿ְֱֲֳִֵֶַָֹ�ֻּֽ־ֿ׀ׁׂ׃װױײ׳״�������אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"},win1255:"windows1255",cp1255:"windows1255",windows1256:{type:"_sbcs",chars:"€پ‚ƒ„…†‡ˆ‰ٹ‹Œچژڈگ‘’“”•–—ک™ڑ›œ‌‍ں ،¢£¤¥¦§¨©ھ«¬­®¯°±²³´µ¶·¸¹؛»¼½¾؟ہءآأؤإئابةتثجحخدذرزسشصض×طظعغـفقكàلâمنهوçèéêëىيîïًٌٍَôُِ÷ّùْûü‎‏ے"},win1256:"windows1256",cp1256:"windows1256",windows1257:{type:"_sbcs",chars:"€�‚�„…†‡�‰�‹�¨ˇ¸�‘’“”•–—�™�›�¯˛� �¢£¤�¦§Ø©Ŗ«¬­®Æ°±²³´µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž˙"},win1257:"windows1257",cp1257:"windows1257",windows1258:{type:"_sbcs",chars:"€�‚ƒ„…†‡ˆ‰�‹Œ����‘’“”•–—˜™�›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"},win1258:"windows1258",cp1258:"windows1258",iso88591:{type:"_sbcs",chars:" ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"},cp28591:"iso88591",iso88592:{type:"_sbcs",chars:" Ą˘Ł¤ĽŚ§¨ŠŞŤŹ­ŽŻ°ą˛ł´ľśˇ¸šşťź˝žżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"},cp28592:"iso88592",iso88593:{type:"_sbcs",chars:" Ħ˘£¤�Ĥ§¨İŞĞĴ­�Ż°ħ²³´µĥ·¸ışğĵ½�żÀÁÂ�ÄĊĈÇÈÉÊËÌÍÎÏ�ÑÒÓÔĠÖ×ĜÙÚÛÜŬŜßàáâ�äċĉçèéêëìíîï�ñòóôġö÷ĝùúûüŭŝ˙"},cp28593:"iso88593",iso88594:{type:"_sbcs",chars:" ĄĸŖ¤ĨĻ§¨ŠĒĢŦ­Ž¯°ą˛ŗ´ĩļˇ¸šēģŧŊžŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎĪĐŅŌĶÔÕÖ×ØŲÚÛÜŨŪßāáâãäåæįčéęëėíîīđņōķôõö÷øųúûüũū˙"},cp28594:"iso88594",iso88595:{type:"_sbcs",chars:" ЁЂЃЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђѓєѕіїјљњћќ§ўџ"},cp28595:"iso88595",iso88596:{type:"_sbcs",chars:" ���¤�������،­�������������؛���؟�ءآأؤإئابةتثجحخدذرزسشصضطظعغ�����ـفقكلمنهوىيًٌٍَُِّْ�������������"},cp28596:"iso88596",iso88597:{type:"_sbcs",chars:" ‘’£€₯¦§¨©ͺ«¬­�―°±²³΄΅Ά·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"},cp28597:"iso88597",iso88598:{type:"_sbcs",chars:" �¢£¤¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾��������������������������������‗אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"},cp28598:"iso88598",iso88599:{type:"_sbcs",chars:" ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"},cp28599:"iso88599",iso885910:{type:"_sbcs",chars:" ĄĒĢĪĨĶ§ĻĐŠŦŽ­ŪŊ°ąēģīĩķ·ļđšŧž―ūŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎÏÐŅŌÓÔÕÖŨØŲÚÛÜÝÞßāáâãäåæįčéęëėíîïðņōóôõöũøųúûüýþĸ"},cp28600:"iso885910",iso885911:{type:"_sbcs",chars:" กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"},cp28601:"iso885911",iso885913:{type:"_sbcs",chars:" ”¢£¤„¦§Ø©Ŗ«¬­®Æ°±²³“µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž’"},cp28603:"iso885913",iso885914:{type:"_sbcs",chars:" Ḃḃ£ĊċḊ§Ẁ©ẂḋỲ­®ŸḞḟĠġṀṁ¶ṖẁṗẃṠỳẄẅṡÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŴÑÒÓÔÕÖṪØÙÚÛÜÝŶßàáâãäåæçèéêëìíîïŵñòóôõöṫøùúûüýŷÿ"},cp28604:"iso885914",iso885915:{type:"_sbcs",chars:" ¡¢£€¥Š§š©ª«¬­®¯°±²³Žµ¶·ž¹º»ŒœŸ¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"},cp28605:"iso885915",iso885916:{type:"_sbcs",chars:" ĄąŁ€„Š§š©Ș«Ź­źŻ°±ČłŽ”¶·žčș»ŒœŸżÀÁÂĂÄĆÆÇÈÉÊËÌÍÎÏĐŃÒÓÔŐÖŚŰÙÚÛÜĘȚßàáâăäćæçèéêëìíîïđńòóôőöśűùúûüęțÿ"},cp28606:"iso885916",cp437:{type:"_sbcs",chars:"ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},ibm437:"cp437",csibm437:"cp437",cp737:{type:"_sbcs",chars:"ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρσςτυφχψ░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀ωάέήϊίόύϋώΆΈΉΊΌΎΏ±≥≤ΪΫ÷≈°∙·√ⁿ²■ "},ibm737:"cp737",csibm737:"cp737",cp775:{type:"_sbcs",chars:"ĆüéāäģåćłēŖŗīŹÄÅÉæÆōöĢ¢ŚśÖÜø£Ø×¤ĀĪóŻżź”¦©®¬½¼Ł«»░▒▓│┤ĄČĘĖ╣║╗╝ĮŠ┐└┴┬├─┼ŲŪ╚╔╩╦╠═╬Žąčęėįšųūž┘┌█▄▌▐▀ÓßŌŃõÕµńĶķĻļņĒŅ’­±“¾¶§÷„°∙·¹³²■ "},ibm775:"cp775",csibm775:"cp775",cp850:{type:"_sbcs",chars:"ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "},ibm850:"cp850",csibm850:"cp850",cp852:{type:"_sbcs",chars:"ÇüéâäůćçłëŐőîŹÄĆÉĹĺôöĽľŚśÖÜŤťŁ×čáíóúĄąŽžĘę¬źČş«»░▒▓│┤ÁÂĚŞ╣║╗╝Żż┐└┴┬├─┼Ăă╚╔╩╦╠═╬¤đĐĎËďŇÍÎě┘┌█▄ŢŮ▀ÓßÔŃńňŠšŔÚŕŰýÝţ´­˝˛ˇ˘§÷¸°¨˙űŘř■ "},ibm852:"cp852",csibm852:"cp852",cp855:{type:"_sbcs",chars:"ђЂѓЃёЁєЄѕЅіІїЇјЈљЉњЊћЋќЌўЎџЏюЮъЪаАбБцЦдДеЕфФгГ«»░▒▓│┤хХиИ╣║╗╝йЙ┐└┴┬├─┼кК╚╔╩╦╠═╬¤лЛмМнНоОп┘┌█▄Пя▀ЯрРсСтТуУжЖвВьЬ№­ыЫзЗшШэЭщЩчЧ§■ "},ibm855:"cp855",csibm855:"cp855",cp856:{type:"_sbcs",chars:"אבגדהוזחטיךכלםמןנסעףפץצקרשת�£�×����������®¬½¼�«»░▒▓│┤���©╣║╗╝¢¥┐└┴┬├─┼��╚╔╩╦╠═╬¤���������┘┌█▄¦�▀������µ�������¯´­±‗¾¶§÷¸°¨·¹³²■ "},ibm856:"cp856",csibm856:"cp856",cp857:{type:"_sbcs",chars:"ÇüéâäàåçêëèïîıÄÅÉæÆôöòûùİÖÜø£ØŞşáíóúñÑĞğ¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ºªÊËÈ�ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµ�×ÚÛÙìÿ¯´­±�¾¶§÷¸°¨·¹³²■ "},ibm857:"cp857",csibm857:"cp857",cp858:{type:"_sbcs",chars:"ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈ€ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "},ibm858:"cp858",csibm858:"cp858",cp860:{type:"_sbcs",chars:"ÇüéâãàÁçêÊèÍÔìÃÂÉÀÈôõòÚùÌÕÜ¢£Ù₧ÓáíóúñÑªº¿Ò¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},ibm860:"cp860",csibm860:"cp860",cp861:{type:"_sbcs",chars:"ÇüéâäàåçêëèÐðÞÄÅÉæÆôöþûÝýÖÜø£Ø₧ƒáíóúÁÍÓÚ¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},ibm861:"cp861",csibm861:"cp861",cp862:{type:"_sbcs",chars:"אבגדהוזחטיךכלםמןנסעףפץצקרשת¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},ibm862:"cp862",csibm862:"cp862",cp863:{type:"_sbcs",chars:"ÇüéâÂà¶çêëèïî‗À§ÉÈÊôËÏûù¤ÔÜ¢£ÙÛƒ¦´óú¨¸³¯Î⌐¬½¼¾«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},ibm863:"cp863",csibm863:"cp863",cp864:{type:"_sbcs",chars:"\x00\b	\n\f\r !\"#$٪&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~°·∙√▒─│┼┤┬├┴┐┌└┘β∞φ±½¼≈«»ﻷﻸ��ﻻﻼ� ­ﺂ£¤ﺄ��ﺎﺏﺕﺙ،ﺝﺡﺥ٠١٢٣٤٥٦٧٨٩ﻑ؛ﺱﺵﺹ؟¢ﺀﺁﺃﺅﻊﺋﺍﺑﺓﺗﺛﺟﺣﺧﺩﺫﺭﺯﺳﺷﺻﺿﻁﻅﻋﻏ¦¬÷×ﻉـﻓﻗﻛﻟﻣﻧﻫﻭﻯﻳﺽﻌﻎﻍﻡﹽّﻥﻩﻬﻰﻲﻐﻕﻵﻶﻝﻙﻱ■�"},ibm864:"cp864",csibm864:"cp864",cp865:{type:"_sbcs",chars:"ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø₧ƒáíóúñÑªº¿⌐¬½¼¡«¤░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},ibm865:"cp865",csibm865:"cp865",cp866:{type:"_sbcs",chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№¤■ "},ibm866:"cp866",csibm866:"cp866",cp869:{type:"_sbcs",chars:"������Ά�·¬¦‘’Έ―ΉΊΪΌ��ΎΫ©Ώ²³ά£έήίϊΐόύΑΒΓΔΕΖΗ½ΘΙ«»░▒▓│┤ΚΛΜΝ╣║╗╝ΞΟ┐└┴┬├─┼ΠΡ╚╔╩╦╠═╬ΣΤΥΦΧΨΩαβγ┘┌█▄δε▀ζηθικλμνξοπρσςτ΄­±υφχ§ψ΅°¨ωϋΰώ■ "},ibm869:"cp869",csibm869:"cp869",cp922:{type:"_sbcs",chars:" ¡¢£¤¥¦§¨©ª«¬­®‾°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŠÑÒÓÔÕÖ×ØÙÚÛÜÝŽßàáâãäåæçèéêëìíîïšñòóôõö÷øùúûüýžÿ"},ibm922:"cp922",csibm922:"cp922",cp1046:{type:"_sbcs",chars:"ﺈ×÷ﹱ■│─┐┌└┘ﹹﹻﹽﹿﹷﺊﻰﻳﻲﻎﻏﻐﻶﻸﻺﻼ ¤ﺋﺑﺗﺛﺟﺣ،­ﺧﺳ٠١٢٣٤٥٦٧٨٩ﺷ؛ﺻﺿﻊ؟ﻋءآأؤإئابةتثجحخدذرزسشصضطﻇعغﻌﺂﺄﺎﻓـفقكلمنهوىيًٌٍَُِّْﻗﻛﻟﻵﻷﻹﻻﻣﻧﻬﻩ�"},ibm1046:"cp1046",csibm1046:"cp1046",cp1124:{type:"_sbcs",chars:" ЁЂҐЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђґєѕіїјљњћќ§ўџ"},ibm1124:"cp1124",csibm1124:"cp1124",cp1125:{type:"_sbcs",chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёҐґЄєІіЇї·√№¤■ "},ibm1125:"cp1125",csibm1125:"cp1125",cp1129:{type:"_sbcs",chars:" ¡¢£¤¥¦§œ©ª«¬­®¯°±²³Ÿµ¶·Œ¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"},ibm1129:"cp1129",csibm1129:"cp1129",cp1133:{type:"_sbcs",chars:" ກຂຄງຈສຊຍດຕຖທນບປຜຝພຟມຢຣລວຫອຮ���ຯະາຳິີຶືຸູຼັົຽ���ເແໂໃໄ່້໊໋໌ໍໆ�ໜໝ₭����������������໐໑໒໓໔໕໖໗໘໙��¢¬¦�"},ibm1133:"cp1133",csibm1133:"cp1133",cp1161:{type:"_sbcs",chars:"��������������������������������่กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู้๊๋€฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛¢¬¦ "},ibm1161:"cp1161",csibm1161:"cp1161",cp1162:{type:"_sbcs",chars:"€…‘’“”•–— กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"},ibm1162:"cp1162",csibm1162:"cp1162",cp1163:{type:"_sbcs",chars:" ¡¢£€¥¦§œ©ª«¬­®¯°±²³Ÿµ¶·Œ¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"},ibm1163:"cp1163",csibm1163:"cp1163",maccroatian:{type:"_sbcs",chars:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊�©⁄¤‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ"},maccyrillic:{type:"_sbcs",chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°¢£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµ∂ЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю¤"},macgreek:{type:"_sbcs",chars:"Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦­ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩάΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ�"},maciceland:{type:"_sbcs",chars:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"},macroman:{type:"_sbcs",chars:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"},macromania:{type:"_sbcs",chars:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂŞ∞±≤≥¥µ∂∑∏π∫ªºΩăş¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›Ţţ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"},macthai:{type:"_sbcs",chars:"«»…“”�•‘’� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู\ufeff​–—฿เแโใไๅๆ็่้๊๋์ํ™๏๐๑๒๓๔๕๖๗๘๙®©����"},macturkish:{type:"_sbcs",chars:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙ�ˆ˜¯˘˙˚¸˝˛ˇ"},macukraine:{type:"_sbcs",chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю¤"},koi8r:{type:"_sbcs",chars:"─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ё╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡Ё╢╣╤╥╦╧╨╩╪╫╬©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"},koi8u:{type:"_sbcs",chars:"─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ёє╔ії╗╘╙╚╛ґ╝╞╟╠╡ЁЄ╣ІЇ╦╧╨╩╪Ґ╬©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"},koi8ru:{type:"_sbcs",chars:"─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ёє╔ії╗╘╙╚╛ґў╞╟╠╡ЁЄ╣ІЇ╦╧╨╩╪ҐЎ©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"},koi8t:{type:"_sbcs",chars:"қғ‚Ғ„…†‡�‰ҳ‹ҲҷҶ�Қ‘’“”•–—�™�›�����ӯӮё¤ӣ¦§���«¬­®�°±²Ё�Ӣ¶·�№�»���©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"},armscii8:{type:"_sbcs",chars:" �և։)(»«—.՝,-֊…՜՛՞ԱաԲբԳգԴդԵեԶզԷէԸըԹթԺժԻիԼլԽխԾծԿկՀհՁձՂղՃճՄմՅյՆնՇշՈոՉչՊպՋջՌռՍսՎվՏտՐրՑցՒւՓփՔքՕօՖֆ՚�"},rk1048:{type:"_sbcs",chars:"ЂЃ‚ѓ„…†‡€‰Љ‹ЊҚҺЏђ‘’“”•–—�™љ›њқһџ ҰұӘ¤Ө¦§Ё©Ғ«¬­®Ү°±Ііөµ¶·ё№ғ»әҢңүАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"},tcvn:{type:"_sbcs",chars:"\x00ÚỤỪỬỮ\b	\n\f\rỨỰỲỶỸÝỴ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ÀẢÃÁẠẶẬÈẺẼÉẸỆÌỈĨÍỊÒỎÕÓỌỘỜỞỠỚỢÙỦŨ ĂÂÊÔƠƯĐăâêôơưđẶ̀̀̉̃́àảãáạẲằẳẵắẴẮẦẨẪẤỀặầẩẫấậèỂẻẽéẹềểễếệìỉỄẾỒĩíịòỔỏõóọồổỗốộờởỡớợùỖủũúụừửữứựỳỷỹýỵỐ"},georgianacademy:{type:"_sbcs",chars:"‚ƒ„…†‡ˆ‰Š‹Œ‘’“”•–—˜™š›œŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰჱჲჳჴჵჶçèéêëìíîïðñòóôõö÷øùúûüýþÿ"},georgianps:{type:"_sbcs",chars:"‚ƒ„…†‡ˆ‰Š‹Œ‘’“”•–—˜™š›œŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿აბგდევზჱთიკლმნჲოპჟრსტჳუფქღყშჩცძწჭხჴჯჰჵæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"},pt154:{type:"_sbcs",chars:"ҖҒӮғ„…ҶҮҲүҠӢҢҚҺҸҗ‘’“”•–—ҳҷҡӣңқһҹ ЎўЈӨҘҰ§Ё©Ә«¬ӯ®Ҝ°ұІіҙө¶·ё№ә»јҪҫҝАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"},viscii:{type:"_sbcs",chars:"\x00ẲẴẪ\b	\n\f\rỶỸỴ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ẠẮẰẶẤẦẨẬẼẸẾỀỂỄỆỐỒỔỖỘỢỚỜỞỊỎỌỈỦŨỤỲÕắằặấầẩậẽẹếềểễệốồổỗỠƠộờởịỰỨỪỬơớƯÀÁÂÃẢĂẳẵÈÉÊẺÌÍĨỳĐứÒÓÔạỷừửÙÚỹỵÝỡưàáâãảăữẫèéêẻìíĩỉđựòóôõỏọụùúũủýợỮ"},iso646cn:{type:"_sbcs",chars:"\x00\b	\n\f\r !\"#¥%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}‾��������������������������������������������������������������������������������������������������������������������������������"},iso646jp:{type:"_sbcs",chars:"\x00\b	\n\f\r !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[¥]^_`abcdefghijklmnopqrstuvwxyz{|}‾��������������������������������������������������������������������������������������������������������������������������������"},hproman8:{type:"_sbcs",chars:" ÀÂÈÊËÎÏ´ˋˆ¨˜ÙÛ₤¯Ýý°ÇçÑñ¡¿¤£¥§ƒ¢âêôûáéóúàèòùäëöüÅîØÆåíøæÄìÖÜÉïßÔÁÃãÐðÍÌÓÒÕõŠšÚŸÿÞþ·µ¶¾—¼½ªº«■»±�"},macintosh:{type:"_sbcs",chars:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"},ascii:{type:"_sbcs",chars:"��������������������������������������������������������������������������������������������������������������������������������"},tis620:{type:"_sbcs",chars:"���������������������������������กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"}}},{}],101:[function(e,t,r){"use strict"
t.exports={10029:"maccenteuro",maccenteuro:{type:"_sbcs",chars:"ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ"},808:"cp808",ibm808:"cp808",cp808:{type:"_sbcs",chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№€■ "},ascii8bit:"ascii",usascii:"ascii",ansix34:"ascii",ansix341968:"ascii",ansix341986:"ascii",csascii:"ascii",cp367:"ascii",ibm367:"ascii",isoir6:"ascii",iso646us:"ascii",iso646irv:"ascii",us:"ascii",latin1:"iso88591",latin2:"iso88592",latin3:"iso88593",latin4:"iso88594",latin5:"iso88599",latin6:"iso885910",latin7:"iso885913",latin8:"iso885914",latin9:"iso885915",latin10:"iso885916",csisolatin1:"iso88591",csisolatin2:"iso88592",csisolatin3:"iso88593",csisolatin4:"iso88594",csisolatincyrillic:"iso88595",csisolatinarabic:"iso88596",csisolatingreek:"iso88597",csisolatinhebrew:"iso88598",csisolatin5:"iso88599",csisolatin6:"iso885910",l1:"iso88591",l2:"iso88592",l3:"iso88593",l4:"iso88594",l5:"iso88599",l6:"iso885910",l7:"iso885913",l8:"iso885914",l9:"iso885915",l10:"iso885916",isoir14:"iso646jp",isoir57:"iso646cn",isoir100:"iso88591",isoir101:"iso88592",isoir109:"iso88593",isoir110:"iso88594",isoir144:"iso88595",isoir127:"iso88596",isoir126:"iso88597",isoir138:"iso88598",isoir148:"iso88599",isoir157:"iso885910",isoir166:"tis620",isoir179:"iso885913",isoir199:"iso885914",isoir203:"iso885915",isoir226:"iso885916",cp819:"iso88591",ibm819:"iso88591",cyrillic:"iso88595",arabic:"iso88596",arabic8:"iso88596",ecma114:"iso88596",asmo708:"iso88596",greek:"iso88597",greek8:"iso88597",ecma118:"iso88597",elot928:"iso88597",hebrew:"iso88598",hebrew8:"iso88598",turkish:"iso88599",turkish8:"iso88599",thai:"iso885911",thai8:"iso885911",celtic:"iso885914",celtic8:"iso885914",isoceltic:"iso885914",tis6200:"tis620",tis62025291:"tis620",tis62025330:"tis620",10000:"macroman",10006:"macgreek",10007:"maccyrillic",10079:"maciceland",10081:"macturkish",cspc8codepage437:"cp437",cspc775baltic:"cp775",cspc850multilingual:"cp850",cspcp852:"cp852",cspc862latinhebrew:"cp862",cpgr:"cp869",msee:"cp1250",mscyrl:"cp1251",msansi:"cp1252",msgreek:"cp1253",msturk:"cp1254",mshebr:"cp1255",msarab:"cp1256",winbaltrim:"cp1257",cp20866:"koi8r",20866:"koi8r",ibm878:"koi8r",cskoi8r:"koi8r",cp21866:"koi8u",21866:"koi8u",ibm1168:"koi8u",strk10482002:"rk1048",tcvn5712:"tcvn",tcvn57121:"tcvn",gb198880:"iso646cn",cn:"iso646cn",csiso14jisc6220ro:"iso646jp",jisc62201969ro:"iso646jp",jp:"iso646jp",cshproman8:"hproman8",r8:"hproman8",roman8:"hproman8",xroman8:"hproman8",ibm1051:"hproman8",mac:"macintosh",csmacintosh:"macintosh"}},{}],102:[function(e,t,r){t.exports=[["8740","䏰䰲䘃䖦䕸𧉧䵷䖳𧲱䳢𧳅㮕䜶䝄䱇䱀𤊿𣘗𧍒𦺋𧃒䱗𪍑䝏䗚䲅𧱬䴇䪤䚡𦬣爥𥩔𡩣𣸆𣽡晍囻"],["8767","綕夝𨮹㷴霴𧯯寛𡵞媤㘥𩺰嫑宷峼杮薓𩥅瑡璝㡵𡵓𣚞𦀡㻬"],["87a1","𥣞㫵竼龗𤅡𨤍𣇪𠪊𣉞䌊蒄龖鐯䤰蘓墖靊鈘秐稲晠権袝瑌篅枂稬剏遆㓦珄𥶹瓆鿇垳䤯呌䄱𣚎堘穲𧭥讏䚮𦺈䆁𥶙箮𢒼鿈𢓁𢓉𢓌鿉蔄𣖻䂴鿊䓡𪷿拁灮鿋"],["8840","㇀",4,"𠄌㇅𠃑𠃍㇆㇇𠃋𡿨㇈𠃊㇉㇊㇋㇌𠄎㇍㇎ĀÁǍÀĒÉĚÈŌÓǑÒ࿿Ê̄Ế࿿Ê̌ỀÊāáǎàɑēéěèīíǐìōóǒòūúǔùǖǘǚ"],["88a1","ǜü࿿ê̄ế࿿ê̌ềêɡ⏚⏛"],["8940","𪎩𡅅"],["8943","攊"],["8946","丽滝鵎釟"],["894c","𧜵撑会伨侨兖兴农凤务动医华发变团声处备夲头学实実岚庆总斉柾栄桥济炼电纤纬纺织经统缆缷艺苏药视设询车轧轮"],["89a1","琑糼緍楆竉刧"],["89ab","醌碸酞肼"],["89b0","贋胶𠧧"],["89b5","肟黇䳍鷉鸌䰾𩷶𧀎鸊𪄳㗁"],["89c1","溚舾甙"],["89c5","䤑马骏龙禇𨑬𡷊𠗐𢫦两亁亀亇亿仫伷㑌侽㹈倃傈㑽㒓㒥円夅凛凼刅争剹劐匧㗇厩㕑厰㕓参吣㕭㕲㚁咓咣咴咹哐哯唘唣唨㖘唿㖥㖿嗗㗅"],["8a40","𧶄唥"],["8a43","𠱂𠴕𥄫喐𢳆㧬𠍁蹆𤶸𩓥䁓𨂾睺𢰸㨴䟕𨅝𦧲𤷪擝𠵼𠾴𠳕𡃴撍蹾𠺖𠰋𠽤𢲩𨉖𤓓"],["8a64","𠵆𩩍𨃩䟴𤺧𢳂骲㩧𩗴㿭㔆𥋇𩟔𧣈𢵄鵮頕"],["8a76","䏙𦂥撴哣𢵌𢯊𡁷㧻𡁯"],["8aa1","𦛚𦜖𧦠擪𥁒𠱃蹨𢆡𨭌𠜱"],["8aac","䠋𠆩㿺塳𢶍"],["8ab2","𤗈𠓼𦂗𠽌𠶖啹䂻䎺"],["8abb","䪴𢩦𡂝膪飵𠶜捹㧾𢝵跀嚡摼㹃"],["8ac9","𪘁𠸉𢫏𢳉"],["8ace","𡃈𣧂㦒㨆𨊛㕸𥹉𢃇噒𠼱𢲲𩜠㒼氽𤸻"],["8adf","𧕴𢺋𢈈𪙛𨳍𠹺𠰴𦠜羓𡃏𢠃𢤹㗻𥇣𠺌𠾍𠺪㾓𠼰𠵇𡅏𠹌"],["8af6","𠺫𠮩𠵈𡃀𡄽㿹𢚖搲𠾭"],["8b40","𣏴𧘹𢯎𠵾𠵿𢱑𢱕㨘𠺘𡃇𠼮𪘲𦭐𨳒𨶙𨳊閪哌苄喹"],["8b55","𩻃鰦骶𧝞𢷮煀腭胬尜𦕲脴㞗卟𨂽醶𠻺𠸏𠹷𠻻㗝𤷫㘉𠳖嚯𢞵𡃉𠸐𠹸𡁸𡅈𨈇𡑕𠹹𤹐𢶤婔𡀝𡀞𡃵𡃶垜𠸑"],["8ba1","𧚔𨋍𠾵𠹻𥅾㜃𠾶𡆀𥋘𪊽𤧚𡠺𤅷𨉼墙剨㘚𥜽箲孨䠀䬬鼧䧧鰟鮍𥭴𣄽嗻㗲嚉丨夂𡯁屮靑𠂆乛亻㔾尣彑忄㣺扌攵歺氵氺灬爫丬犭𤣩罒礻糹罓𦉪㓁"],["8bde","𦍋耂肀𦘒𦥑卝衤见𧢲讠贝钅镸长门𨸏韦页风飞饣𩠐鱼鸟黄歯龜丷𠂇阝户钢"],["8c40","倻淾𩱳龦㷉袏𤅎灷峵䬠𥇍㕙𥴰愢𨨲辧釶熑朙玺𣊁𪄇㲋𡦀䬐磤琂冮𨜏䀉橣𪊺䈣蘏𠩯稪𩥇𨫪靕灍匤𢁾鏴盙𨧣龧矝亣俰傼丯众龨吴綋墒壐𡶶庒庙忂𢜒斋"],["8ca1","𣏹椙橃𣱣泿"],["8ca7","爀𤔅玌㻛𤨓嬕璹讃𥲤𥚕窓篬糃繬苸薗龩袐龪躹龫迏蕟駠鈡龬𨶹𡐿䁱䊢娚"],["8cc9","顨杫䉶圽"],["8cce","藖𤥻芿𧄍䲁𦵴嵻𦬕𦾾龭龮宖龯曧繛湗秊㶈䓃𣉖𢞖䎚䔶"],["8ce6","峕𣬚諹屸㴒𣕑嵸龲煗䕘𤃬𡸣䱷㥸㑊𠆤𦱁諌侴𠈹妿腬顖𩣺弻"],["8d40","𠮟"],["8d42","𢇁𨥭䄂䚻𩁹㼇龳𪆵䃸㟖䛷𦱆䅼𨚲𧏿䕭㣔𥒚䕡䔛䶉䱻䵶䗪㿈𤬏㙡䓞䒽䇭崾嵈嵖㷼㠏嶤嶹㠠㠸幂庽弥徃㤈㤔㤿㥍惗愽峥㦉憷憹懏㦸戬抐拥挘㧸嚱"],["8da1","㨃揢揻搇摚㩋擀崕嘡龟㪗斆㪽旿晓㫲暒㬢朖㭂枤栀㭘桊梄㭲㭱㭻椉楃牜楤榟榅㮼槖㯝橥橴橱檂㯬檙㯲檫檵櫔櫶殁毁毪汵沪㳋洂洆洦涁㳯涤涱渕渘温溆𨧀溻滢滚齿滨滩漤漴㵆𣽁澁澾㵪㵵熷岙㶊瀬㶑灐灔灯灿炉𠌥䏁㗱𠻘"],["8e40","𣻗垾𦻓焾𥟠㙎榢𨯩孴穉𥣡𩓙穥穽𥦬窻窰竂竃燑𦒍䇊竚竝竪䇯咲𥰁笋筕笩𥌎𥳾箢筯莜𥮴𦱿篐萡箒箸𥴠㶭𥱥蒒篺簆簵𥳁籄粃𤢂粦晽𤕸糉糇糦籴糳糵糎"],["8ea1","繧䔝𦹄絝𦻖璍綉綫焵綳緒𤁗𦀩緤㴓緵𡟹緥𨍭縝𦄡𦅚繮纒䌫鑬縧罀罁罇礶𦋐駡羗𦍑羣𡙡𠁨䕜𣝦䔃𨌺翺𦒉者耈耝耨耯𪂇𦳃耻耼聡𢜔䦉𦘦𣷣𦛨朥肧𨩈脇脚墰𢛶汿𦒘𤾸擧𡒊舘𡡞橓𤩥𤪕䑺舩𠬍𦩒𣵾俹𡓽蓢荢𦬊𤦧𣔰𡝳𣷸芪椛芳䇛"],["8f40","蕋苐茚𠸖𡞴㛁𣅽𣕚艻苢茘𣺋𦶣𦬅𦮗𣗎㶿茝嗬莅䔋𦶥莬菁菓㑾𦻔橗蕚㒖𦹂𢻯葘𥯤葱㷓䓤檧葊𣲵祘蒨𦮖𦹷𦹃蓞萏莑䒠蒓蓤𥲑䉀𥳀䕃蔴嫲𦺙䔧蕳䔖枿蘖"],["8fa1","𨘥𨘻藁𧂈蘂𡖂𧃍䕫䕪蘨㙈𡢢号𧎚虾蝱𪃸蟮𢰧螱蟚蠏噡虬桖䘏衅衆𧗠𣶹𧗤衞袜䙛袴袵揁装睷𧜏覇覊覦覩覧覼𨨥觧𧤤𧪽誜瞓釾誐𧩙竩𧬺𣾏䜓𧬸煼謌謟𥐰𥕥謿譌譍誩𤩺讐讛誯𡛟䘕衏貛𧵔𧶏貫㜥𧵓賖𧶘𧶽贒贃𡤐賛灜贑𤳉㻐起"],["9040","趩𨀂𡀔𤦊㭼𨆼𧄌竧躭躶軃鋔輙輭𨍥𨐒辥錃𪊟𠩐辳䤪𨧞𨔽𣶻廸𣉢迹𪀔𨚼𨔁𢌥㦀𦻗逷𨔼𧪾遡𨕬𨘋邨𨜓郄𨛦邮都酧㫰醩釄粬𨤳𡺉鈎沟鉁鉢𥖹銹𨫆𣲛𨬌𥗛"],["90a1","𠴱錬鍫𨫡𨯫炏嫃𨫢𨫥䥥鉄𨯬𨰹𨯿鍳鑛躼閅閦鐦閠濶䊹𢙺𨛘𡉼𣸮䧟氜陻隖䅬隣𦻕懚隶磵𨫠隽双䦡𦲸𠉴𦐐𩂯𩃥𤫑𡤕𣌊霱虂霶䨏䔽䖅𤫩灵孁霛靜𩇕靗孊𩇫靟鐥僐𣂷𣂼鞉鞟鞱鞾韀韒韠𥑬韮琜𩐳響韵𩐝𧥺䫑頴頳顋顦㬎𧅵㵑𠘰𤅜"],["9140","𥜆飊颷飈飇䫿𦴧𡛓喰飡飦飬鍸餹𤨩䭲𩡗𩤅駵騌騻騐驘𥜥㛄𩂱𩯕髠髢𩬅髴䰎鬔鬭𨘀倴鬴𦦨㣃𣁽魐魀𩴾婅𡡣鮎𤉋鰂鯿鰌𩹨鷔𩾷𪆒𪆫𪃡𪄣𪇟鵾鶃𪄴鸎梈"],["91a1","鷄𢅛𪆓𪈠𡤻𪈳鴹𪂹𪊴麐麕麞麢䴴麪麯𤍤黁㭠㧥㴝伲㞾𨰫鼂鼈䮖鐤𦶢鼗鼖鼹嚟嚊齅馸𩂋韲葿齢齩竜龎爖䮾𤥵𤦻煷𤧸𤍈𤩑玞𨯚𡣺禟𨥾𨸶鍩鏳𨩄鋬鎁鏋𨥬𤒹爗㻫睲穃烐𤑳𤏸煾𡟯炣𡢾𣖙㻇𡢅𥐯𡟸㜢𡛻𡠹㛡𡝴𡣑𥽋㜣𡛀坛𤨥𡏾𡊨"],["9240","𡏆𡒶蔃𣚦蔃葕𤦔𧅥𣸱𥕜𣻻𧁒䓴𣛮𩦝𦼦柹㜳㰕㷧塬𡤢栐䁗𣜿𤃡𤂋𤄏𦰡哋嚞𦚱嚒𠿟𠮨𠸍鏆𨬓鎜仸儫㠙𤐶亼𠑥𠍿佋侊𥙑婨𠆫𠏋㦙𠌊𠐔㐵伩𠋀𨺳𠉵諚𠈌亘"],["92a1","働儍侢伃𤨎𣺊佂倮偬傁俌俥偘僼兙兛兝兞湶𣖕𣸹𣺿浲𡢄𣺉冨凃𠗠䓝𠒣𠒒𠒑赺𨪜𠜎剙劤𠡳勡鍮䙺熌𤎌𠰠𤦬𡃤槑𠸝瑹㻞璙琔瑖玘䮎𤪼𤂍叐㖄爏𤃉喴𠍅响𠯆圝鉝雴鍦埝垍坿㘾壋媙𨩆𡛺𡝯𡜐娬妸銏婾嫏娒𥥆𡧳𡡡𤊕㛵洅瑃娡𥺃"],["9340","媁𨯗𠐓鏠璌𡌃焅䥲鐈𨧻鎽㞠尞岞幞幈𡦖𡥼𣫮廍孏𡤃𡤄㜁𡢠㛝𡛾㛓脪𨩇𡶺𣑲𨦨弌弎𡤧𡞫婫𡜻孄蘔𧗽衠恾𢡠𢘫忛㺸𢖯𢖾𩂈𦽳懀𠀾𠁆𢘛憙憘恵𢲛𢴇𤛔𩅍"],["93a1","摱𤙥𢭪㨩𢬢𣑐𩣪𢹸挷𪑛撶挱揑𤧣𢵧护𢲡搻敫楲㯴𣂎𣊭𤦉𣊫唍𣋠𡣙𩐿曎𣊉𣆳㫠䆐𥖄𨬢𥖏𡛼𥕛𥐥磮𣄃𡠪𣈴㑤𣈏𣆂𤋉暎𦴤晫䮓昰𧡰𡷫晣𣋒𣋡昞𥡲㣑𣠺𣞼㮙𣞢𣏾瓐㮖枏𤘪梶栞㯄檾㡣𣟕𤒇樳橒櫉欅𡤒攑梘橌㯗橺歗𣿀𣲚鎠鋲𨯪𨫋"],["9440","銉𨀞𨧜鑧涥漋𤧬浧𣽿㶏渄𤀼娽渊塇洤硂焻𤌚𤉶烱牐犇犔𤞏𤜥兹𤪤𠗫瑺𣻸𣙟𤩊𤤗𥿡㼆㺱𤫟𨰣𣼵悧㻳瓌琼鎇琷䒟𦷪䕑疃㽣𤳙𤴆㽘畕癳𪗆㬙瑨𨫌𤦫𤦎㫻"],["94a1","㷍𤩎㻿𤧅𤣳釺圲鍂𨫣𡡤僟𥈡𥇧睸𣈲眎眏睻𤚗𣞁㩞𤣰琸璛㺿𤪺𤫇䃈𤪖𦆮錇𥖁砞碍碈磒珐祙𧝁𥛣䄎禛蒖禥樭𣻺稺秴䅮𡛦䄲鈵秱𠵌𤦌𠊙𣶺𡝮㖗啫㕰㚪𠇔𠰍竢婙𢛵𥪯𥪜娍𠉛磰娪𥯆竾䇹籝籭䈑𥮳𥺼𥺦糍𤧹𡞰粎籼粮檲緜縇緓罎𦉡"],["9540","𦅜𧭈綗𥺂䉪𦭵𠤖柖𠁎𣗏埄𦐒𦏸𤥢翝笧𠠬𥫩𥵃笌𥸎駦虅驣樜𣐿㧢𤧷𦖭騟𦖠蒀𧄧𦳑䓪脷䐂胆脉腂𦞴飃𦩂艢艥𦩑葓𦶧蘐𧈛媆䅿𡡀嬫𡢡嫤𡣘蚠蜨𣶏蠭𧐢娂"],["95a1","衮佅袇袿裦襥襍𥚃襔𧞅𧞄𨯵𨯙𨮜𨧹㺭蒣䛵䛏㟲訽訜𩑈彍鈫𤊄旔焩烄𡡅鵭貟賩𧷜妚矃姰䍮㛔踪躧𤰉輰轊䋴汘澻𢌡䢛潹溋𡟚鯩㚵𤤯邻邗啱䤆醻鐄𨩋䁢𨫼鐧𨰝𨰻蓥訫閙閧閗閖𨴴瑅㻂𤣿𤩂𤏪㻧𣈥随𨻧𨹦𨹥㻌𤧭𤩸𣿮琒瑫㻼靁𩂰"],["9640","桇䨝𩂓𥟟靝鍨𨦉𨰦𨬯𦎾銺嬑譩䤼珹𤈛鞛靱餸𠼦巁𨯅𤪲頟𩓚鋶𩗗釥䓀𨭐𤩧𨭤飜𨩅㼀鈪䤥萔餻饍𧬆㷽馛䭯馪驜𨭥𥣈檏騡嫾騯𩣱䮐𩥈馼䮽䮗鍽塲𡌂堢𤦸"],["96a1","𡓨硄𢜟𣶸棅㵽鑘㤧慐𢞁𢥫愇鱏鱓鱻鰵鰐魿鯏𩸭鮟𪇵𪃾鴡䲮𤄄鸘䲰鴌𪆴𪃭𪃳𩤯鶥蒽𦸒𦿟𦮂藼䔳𦶤𦺄𦷰萠藮𦸀𣟗𦁤秢𣖜𣙀䤭𤧞㵢鏛銾鍈𠊿碹鉷鑍俤㑀遤𥕝砽硔碶硋𡝗𣇉𤥁㚚佲濚濙瀞瀞吔𤆵垻壳垊鴖埗焴㒯𤆬燫𦱀𤾗嬨𡞵𨩉"],["9740","愌嫎娋䊼𤒈㜬䭻𨧼鎻鎸𡣖𠼝葲𦳀𡐓𤋺𢰦𤏁妔𣶷𦝁綨𦅛𦂤𤦹𤦋𨧺鋥珢㻩璴𨭣𡢟㻡𤪳櫘珳珻㻖𤨾𤪔𡟙𤩦𠎧𡐤𤧥瑈𤤖炥𤥶銄珦鍟𠓾錱𨫎𨨖鎆𨯧𥗕䤵𨪂煫"],["97a1","𤥃𠳿嚤𠘚𠯫𠲸唂秄𡟺緾𡛂𤩐𡡒䔮鐁㜊𨫀𤦭妰𡢿𡢃𧒄媡㛢𣵛㚰鉟婹𨪁𡡢鍴㳍𠪴䪖㦊僴㵩㵌𡎜煵䋻𨈘渏𩃤䓫浗𧹏灧沯㳖𣿭𣸭渂漌㵯𠏵畑㚼㓈䚀㻚䡱姄鉮䤾轁𨰜𦯀堒埈㛖𡑒烾𤍢𤩱𢿣𡊰𢎽梹楧𡎘𣓥𧯴𣛟𨪃𣟖𣏺𤲟樚𣚭𦲷萾䓟䓎"],["9840","𦴦𦵑𦲂𦿞漗𧄉茽𡜺菭𦲀𧁓𡟛妉媂𡞳婡婱𡤅𤇼㜭姯𡜼㛇熎鎐暚𤊥婮娫𤊓樫𣻹𧜶𤑛𤋊焝𤉙𨧡侰𦴨峂𤓎𧹍𤎽樌𤉖𡌄炦焳𤏩㶥泟勇𤩏繥姫崯㷳彜𤩝𡟟綤萦"],["98a1","咅𣫺𣌀𠈔坾𠣕𠘙㿥𡾞𪊶瀃𩅛嵰玏糓𨩙𩐠俈翧狍猐𧫴猸猹𥛶獁獈㺩𧬘遬燵𤣲珡臶㻊県㻑沢国琙琞琟㻢㻰㻴㻺瓓㼎㽓畂畭畲疍㽼痈痜㿀癍㿗癴㿜発𤽜熈嘣覀塩䀝睃䀹条䁅㗛瞘䁪䁯属瞾矋売砘点砜䂨砹硇硑硦葈𥔵礳栃礲䄃"],["9940","䄉禑禙辻稆込䅧窑䆲窼艹䇄竏竛䇏両筢筬筻簒簛䉠䉺类粜䊌粸䊔糭输烀𠳏総緔緐緽羮羴犟䎗耠耥笹耮耱联㷌垴炠肷胩䏭脌猪脎脒畠脔䐁㬹腖腙腚"],["99a1","䐓堺腼膄䐥膓䐭膥埯臁臤艔䒏芦艶苊苘苿䒰荗险榊萅烵葤惣蒈䔄蒾蓡蓸蔐蔸蕒䔻蕯蕰藠䕷虲蚒蚲蛯际螋䘆䘗袮裿褤襇覑𧥧訩訸誔誴豑賔賲贜䞘塟跃䟭仮踺嗘坔蹱嗵躰䠷軎転軤軭軲辷迁迊迌逳駄䢭飠鈓䤞鈨鉘鉫銱銮銿"],["9a40","鋣鋫鋳鋴鋽鍃鎄鎭䥅䥑麿鐗匁鐝鐭鐾䥪鑔鑹锭関䦧间阳䧥枠䨤靀䨵鞲韂噔䫤惨颹䬙飱塄餎餙冴餜餷饂饝饢䭰駅䮝騼鬏窃魩鮁鯝鯱鯴䱭鰠㝯𡯂鵉鰺"],["9aa1","黾噐鶓鶽鷀鷼银辶鹻麬麱麽黆铜黢黱黸竈齄𠂔𠊷𠎠椚铃妬𠓗塀铁㞹𠗕𠘕𠙶𡚺块煳𠫂𠫍𠮿呪吆𠯋咞𠯻𠰻𠱓𠱥𠱼惧𠲍噺𠲵𠳝𠳭𠵯𠶲𠷈楕鰯螥𠸄𠸎𠻗𠾐𠼭𠹳尠𠾼帋𡁜𡁏𡁶朞𡁻𡂈𡂖㙇𡂿𡃓𡄯𡄻卤蒭𡋣𡍵𡌶讁𡕷𡘙𡟃𡟇乸炻𡠭𡥪"],["9b40","𡨭𡩅𡰪𡱰𡲬𡻈拃𡻕𡼕熘桕𢁅槩㛈𢉼𢏗𢏺𢜪𢡱𢥏苽𢥧𢦓𢫕覥𢫨辠𢬎鞸𢬿顇骽𢱌"],["9b62","𢲈𢲷𥯨𢴈𢴒𢶷𢶕𢹂𢽴𢿌𣀳𣁦𣌟𣏞徱晈暿𧩹𣕧𣗳爁𤦺矗𣘚𣜖纇𠍆墵朎"],["9ba1","椘𣪧𧙗𥿢𣸑𣺹𧗾𢂚䣐䪸𤄙𨪚𤋮𤌍𤀻𤌴𤎖𤩅𠗊凒𠘑妟𡺨㮾𣳿𤐄𤓖垈𤙴㦛𤜯𨗨𩧉㝢𢇃譞𨭎駖𤠒𤣻𤨕爉𤫀𠱸奥𤺥𤾆𠝹軚𥀬劏圿煱𥊙𥐙𣽊𤪧喼𥑆𥑮𦭒釔㑳𥔿𧘲𥕞䜘𥕢𥕦𥟇𤤿𥡝偦㓻𣏌惞𥤃䝼𨥈𥪮𥮉𥰆𡶐垡煑澶𦄂𧰒遖𦆲𤾚譢𦐂𦑊"],["9c40","嵛𦯷輶𦒄𡤜諪𤧶𦒈𣿯𦔒䯀𦖿𦚵𢜛鑥𥟡憕娧晉侻嚹𤔡𦛼乪𤤴陖涏𦲽㘘襷𦞙𦡮𦐑𦡞營𦣇筂𩃀𠨑𦤦鄄𦤹穅鷰𦧺騦𦨭㙟𦑩𠀡禃𦨴𦭛崬𣔙菏𦮝䛐𦲤画补𦶮墶"],["9ca1","㜜𢖍𧁋𧇍㱔𧊀𧊅銁𢅺𧊋錰𧋦𤧐氹钟𧑐𠻸蠧裵𢤦𨑳𡞱溸𤨪𡠠㦤㚹尐秣䔿暶𩲭𩢤襃𧟌𧡘囖䃟𡘊㦡𣜯𨃨𡏅熭荦𧧝𩆨婧䲷𧂯𨦫𧧽𧨊𧬋𧵦𤅺筃祾𨀉澵𪋟樃𨌘厢𦸇鎿栶靝𨅯𨀣𦦵𡏭𣈯𨁈嶅𨰰𨂃圕頣𨥉嶫𤦈斾槕叒𤪥𣾁㰑朶𨂐𨃴𨄮𡾡𨅏"],["9d40","𨆉𨆯𨈚𨌆𨌯𨎊㗊𨑨𨚪䣺揦𨥖砈鉕𨦸䏲𨧧䏟𨧨𨭆𨯔姸𨰉輋𨿅𩃬筑𩄐𩄼㷷𩅞𤫊运犏嚋𩓧𩗩𩖰𩖸𩜲𩣑𩥉𩥪𩧃𩨨𩬎𩵚𩶛纟𩻸𩼣䲤镇𪊓熢𪋿䶑递𪗋䶜𠲜达嗁"],["9da1","辺𢒰边𤪓䔉繿潖檱仪㓤𨬬𧢝㜺躀𡟵𨀤𨭬𨮙𧨾𦚯㷫𧙕𣲷𥘵𥥖亚𥺁𦉘嚿𠹭踎孭𣺈𤲞揞拐𡟶𡡻攰嘭𥱊吚𥌑㷆𩶘䱽嘢嘞罉𥻘奵𣵀蝰东𠿪𠵉𣚺脗鵞贘瘻鱅癎瞹鍅吲腈苷嘥脲萘肽嗪祢噃吖𠺝㗎嘅嗱曱𨋢㘭甴嗰喺咗啲𠱁𠲖廐𥅈𠹶𢱢"],["9e40","𠺢麫絚嗞𡁵抝靭咔賍燶酶揼掹揾啩𢭃鱲𢺳冚㓟𠶧冧呍唞唓癦踭𦢊疱肶蠄螆裇膶萜𡃁䓬猄𤜆宐茋𦢓噻𢛴𧴯𤆣𧵳𦻐𧊶酰𡇙鈈𣳼𪚩𠺬𠻹牦𡲢䝎𤿂𧿹𠿫䃺"],["9ea1","鱝攟𢶠䣳𤟠𩵼𠿬𠸊恢𧖣𠿭"],["9ead","𦁈𡆇熣纎鵐业丄㕷嬍沲卧㚬㧜卽㚥𤘘墚𤭮舭呋垪𥪕𠥹"],["9ec5","㩒𢑥獴𩺬䴉鯭𣳾𩼰䱛𤾩𩖞𩿞葜𣶶𧊲𦞳𣜠挮紥𣻷𣸬㨪逈勌㹴㙺䗩𠒎癀嫰𠺶硺𧼮墧䂿噼鮋嵴癔𪐴麅䳡痹㟻愙𣃚𤏲"],["9ef5","噝𡊩垧𤥣𩸆刴𧂮㖭汊鵼"],["9f40","籖鬹埞𡝬屓擓𩓐𦌵𧅤蚭𠴨𦴢𤫢𠵱"],["9f4f","凾𡼏嶎霃𡷑麁遌笟鬂峑箣扨挵髿篏鬪籾鬮籂粆鰕篼鬉鼗鰛𤤾齚啳寃俽麘俲剠㸆勑坧偖妷帒韈鶫轜呩鞴饀鞺匬愰"],["9fa1","椬叚鰊鴂䰻陁榀傦畆𡝭駚剳"],["9fae","酙隁酜"],["9fb2","酑𨺗捿𦴣櫊嘑醎畺抅𠏼獏籰𥰡𣳽"],["9fc1","𤤙盖鮝个𠳔莾衂"],["9fc9","届槀僭坺刟巵从氱𠇲伹咜哚劚趂㗾弌㗳"],["9fdb","歒酼龥鮗頮颴骺麨麄煺笔"],["9fe7","毺蠘罸"],["9feb","嘠𪙊蹷齓"],["9ff0","跔蹏鸜踁抂𨍽踨蹵竓𤩷稾磘泪詧瘇"],["a040","𨩚鼦泎蟖痃𪊲硓咢贌狢獱謭猂瓱賫𤪻蘯徺袠䒷"],["a055","𡠻𦸅"],["a058","詾𢔛"],["a05b","惽癧髗鵄鍮鮏蟵"],["a063","蠏賷猬霡鮰㗖犲䰇籑饊𦅙慙䰄麖慽"],["a073","坟慯抦戹拎㩜懢厪𣏵捤栂㗒"],["a0a1","嵗𨯂迚𨸹"],["a0a6","僙𡵆礆匲阸𠼻䁥"],["a0ae","矾"],["a0b0","糂𥼚糚稭聦聣絍甅瓲覔舚朌聢𧒆聛瓰脃眤覉𦟌畓𦻑螩蟎臈螌詉貭譃眫瓸蓚㘵榲趦"],["a0d4","覩瑨涹蟁𤀑瓧㷛煶悤憜㳑煢恷"],["a0e2","罱𨬭牐惩䭾删㰘𣳇𥻗𧙖𥔱𡥄𡋾𩤃𦷜𧂭峁𦆭𨨏𣙷𠃮𦡆𤼎䕢嬟𦍌齐麦𦉫"],["a3c0","␀",31,"␡"],["c6a1","①",9,"⑴",9,"ⅰ",9,"丶丿亅亠冂冖冫勹匸卩厶夊宀巛⼳广廴彐彡攴无疒癶辵隶¨ˆヽヾゝゞ〃仝々〆〇ー［］✽ぁ",23],["c740","す",58,"ァアィイ"],["c7a1","ゥ",81,"А",5,"ЁЖ",4],["c840","Л",26,"ёж",25,"⇧↸↹㇏𠃌乚𠂊刂䒑"],["c8a1","龰冈龱𧘇"],["c8cd","￢￤＇＂㈱№℡゛゜⺀⺄⺆⺇⺈⺊⺌⺍⺕⺜⺝⺥⺧⺪⺬⺮⺶⺼⺾⻆⻊⻌⻍⻏⻖⻗⻞⻣"],["c8f5","ʃɐɛɔɵœøŋʊɪ"],["f9fe","￭"],["fa40","𠕇鋛𠗟𣿅蕌䊵珯况㙉𤥂𨧤鍄𡧛苮𣳈砼杄拟𤤳𨦪𠊠𦮳𡌅侫𢓭倈𦴩𧪄𣘀𤪱𢔓倩𠍾徤𠎀𠍇滛𠐟偽儁㑺儎顬㝃萖𤦤𠒇兠𣎴兪𠯿𢃼𠋥𢔰𠖎𣈳𡦃宂蝽𠖳𣲙冲冸"],["faa1","鴴凉减凑㳜凓𤪦决凢卂凭菍椾𣜭彻刋刦刼劵剗劔効勅簕蕂勠蘍𦬓包𨫞啉滙𣾀𠥔𣿬匳卄𠯢泋𡜦栛珕恊㺪㣌𡛨燝䒢卭却𨚫卾卿𡖖𡘓矦厓𨪛厠厫厮玧𥝲㽙玜叁叅汉义埾叙㪫𠮏叠𣿫𢶣叶𠱷吓灹唫晗浛呭𦭓𠵴啝咏咤䞦𡜍𠻝㶴𠵍"],["fb40","𨦼𢚘啇䳭启琗喆喩嘅𡣗𤀺䕒𤐵暳𡂴嘷曍𣊊暤暭噍噏磱囱鞇叾圀囯园𨭦㘣𡉏坆𤆥汮炋坂㚱𦱾埦𡐖堃𡑔𤍣堦𤯵塜墪㕡壠壜𡈼壻寿坃𪅐𤉸鏓㖡够梦㛃湙"],["fba1","𡘾娤啓𡚒蔅姉𠵎𦲁𦴪𡟜姙𡟻𡞲𦶦浱𡠨𡛕姹𦹅媫婣㛦𤦩婷㜈媖瑥嫓𦾡𢕔㶅𡤑㜲𡚸広勐孶斈孼𧨎䀄䡝𠈄寕慠𡨴𥧌𠖥寳宝䴐尅𡭄尓珎尔𡲥𦬨屉䣝岅峩峯嶋𡷹𡸷崐崘嵆𡺤岺巗苼㠭𤤁𢁉𢅳芇㠶㯂帮檊幵幺𤒼𠳓厦亷廐厨𡝱帉廴𨒂"],["fc40","廹廻㢠廼栾鐛弍𠇁弢㫞䢮𡌺强𦢈𢏐彘𢑱彣鞽𦹮彲鍀𨨶徧嶶㵟𥉐𡽪𧃸𢙨釖𠊞𨨩怱暅𡡷㥣㷇㘹垐𢞴祱㹀悞悤悳𤦂𤦏𧩓璤僡媠慤萤慂慈𦻒憁凴𠙖憇宪𣾷"],["fca1","𢡟懓𨮝𩥝懐㤲𢦀𢣁怣慜攞掋𠄘担𡝰拕𢸍捬𤧟㨗搸揸𡎎𡟼撐澊𢸶頔𤂌𥜝擡擥鑻㩦携㩗敍漖𤨨𤨣斅敭敟𣁾斵𤥀䬷旑䃘𡠩无旣忟𣐀昘𣇷𣇸晄𣆤𣆥晋𠹵晧𥇦晳晴𡸽𣈱𨗴𣇈𥌓矅𢣷馤朂𤎜𤨡㬫槺𣟂杞杧杢𤇍𩃭柗䓩栢湐鈼栁𣏦𦶠桝"],["fd40","𣑯槡樋𨫟楳棃𣗍椁椀㴲㨁𣘼㮀枬楡𨩊䋼椶榘㮡𠏉荣傐槹𣙙𢄪橅𣜃檝㯳枱櫈𩆜㰍欝𠤣惞欵歴𢟍溵𣫛𠎵𡥘㝀吡𣭚毡𣻼毜氷𢒋𤣱𦭑汚舦汹𣶼䓅𣶽𤆤𤤌𤤀"],["fda1","𣳉㛥㳫𠴲鮃𣇹𢒑羏样𦴥𦶡𦷫涖浜湼漄𤥿𤂅𦹲蔳𦽴凇沜渝萮𨬡港𣸯瑓𣾂秌湏媑𣁋濸㜍澝𣸰滺𡒗𤀽䕕鏰潄潜㵎潴𩅰㴻澟𤅄濓𤂑𤅕𤀹𣿰𣾴𤄿凟𤅖𤅗𤅀𦇝灋灾炧炁烌烕烖烟䄄㷨熴熖𤉷焫煅媈煊煮岜𤍥煏鍢𤋁焬𤑚𤨧𤨢熺𨯨炽爎"],["fe40","鑂爕夑鑃爤鍁𥘅爮牀𤥴梽牕牗㹕𣁄栍漽犂猪猫𤠣𨠫䣭𨠄猨献珏玪𠰺𦨮珉瑉𤇢𡛧𤨤昣㛅𤦷𤦍𤧻珷琕椃𤨦琹𠗃㻗瑜𢢭瑠𨺲瑇珤瑶莹瑬㜰瑴鏱樬璂䥓𤪌"],["fea1","𤅟𤩹𨮏孆𨰃𡢞瓈𡦈甎瓩甞𨻙𡩋寗𨺬鎅畍畊畧畮𤾂㼄𤴓疎瑝疞疴瘂瘬癑癏癯癶𦏵皐臯㟸𦤑𦤎皡皥皷盌𦾟葢𥂝𥅽𡸜眞眦着撯𥈠睘𣊬瞯𨥤𨥨𡛁矴砉𡍶𤨒棊碯磇磓隥礮𥗠磗礴碱𧘌辸袄𨬫𦂃𢘜禆褀椂禀𥡗禝𧬹礼禩渪𧄦㺨秆𩄍秔"]]},{}],103:[function(e,t,r){t.exports=[["0","\x00",127,"€"],["8140","丂丄丅丆丏丒丗丟丠両丣並丩丮丯丱丳丵丷丼乀乁乂乄乆乊乑乕乗乚乛乢乣乤乥乧乨乪",5,"乲乴",9,"乿",6,"亇亊"],["8180","亐亖亗亙亜亝亞亣亪亯亰亱亴亶亷亸亹亼亽亾仈仌仏仐仒仚仛仜仠仢仦仧仩仭仮仯仱仴仸仹仺仼仾伀伂",6,"伋伌伒",4,"伜伝伡伣伨伩伬伭伮伱伳伵伷伹伻伾",4,"佄佅佇",5,"佒佔佖佡佢佦佨佪佫佭佮佱佲併佷佸佹佺佽侀侁侂侅來侇侊侌侎侐侒侓侕侖侘侙侚侜侞侟価侢"],["8240","侤侫侭侰",4,"侶",8,"俀俁係俆俇俈俉俋俌俍俒",4,"俙俛俠俢俤俥俧俫俬俰俲俴俵俶俷俹俻俼俽俿",11],["8280","個倎倐們倓倕倖倗倛倝倞倠倢倣値倧倫倯",10,"倻倽倿偀偁偂偄偅偆偉偊偋偍偐",4,"偖偗偘偙偛偝",7,"偦",5,"偭",8,"偸偹偺偼偽傁傂傃傄傆傇傉傊傋傌傎",20,"傤傦傪傫傭",4,"傳",6,"傼"],["8340","傽",17,"僐",5,"僗僘僙僛",10,"僨僩僪僫僯僰僱僲僴僶",4,"僼",9,"儈"],["8380","儉儊儌",5,"儓",13,"儢",28,"兂兇兊兌兎兏児兒兓兗兘兙兛兝",4,"兣兤兦內兩兪兯兲兺兾兿冃冄円冇冊冋冎冏冐冑冓冔冘冚冝冞冟冡冣冦",4,"冭冮冴冸冹冺冾冿凁凂凃凅凈凊凍凎凐凒",5],["8440","凘凙凚凜凞凟凢凣凥",5,"凬凮凱凲凴凷凾刄刅刉刋刌刏刐刓刔刕刜刞刟刡刢刣別刦刧刪刬刯刱刲刴刵刼刾剄",5,"剋剎剏剒剓剕剗剘"],["8480","剙剚剛剝剟剠剢剣剤剦剨剫剬剭剮剰剱剳",9,"剾劀劃",4,"劉",6,"劑劒劔",6,"劜劤劥劦劧劮劯劰労",9,"勀勁勂勄勅勆勈勊勌勍勎勏勑勓勔動勗務",5,"勠勡勢勣勥",10,"勱",7,"勻勼勽匁匂匃匄匇匉匊匋匌匎"],["8540","匑匒匓匔匘匛匜匞匟匢匤匥匧匨匩匫匬匭匯",9,"匼匽區卂卄卆卋卌卍卐協単卙卛卝卥卨卪卬卭卲卶卹卻卼卽卾厀厁厃厇厈厊厎厏"],["8580","厐",4,"厖厗厙厛厜厞厠厡厤厧厪厫厬厭厯",6,"厷厸厹厺厼厽厾叀參",4,"収叏叐叒叓叕叚叜叝叞叡叢叧叴叺叾叿吀吂吅吇吋吔吘吙吚吜吢吤吥吪吰吳吶吷吺吽吿呁呂呄呅呇呉呌呍呎呏呑呚呝",4,"呣呥呧呩",7,"呴呹呺呾呿咁咃咅咇咈咉咊咍咑咓咗咘咜咞咟咠咡"],["8640","咢咥咮咰咲咵咶咷咹咺咼咾哃哅哊哋哖哘哛哠",4,"哫哬哯哰哱哴",5,"哻哾唀唂唃唄唅唈唊",4,"唒唓唕",5,"唜唝唞唟唡唥唦"],["8680","唨唩唫唭唲唴唵唶唸唹唺唻唽啀啂啅啇啈啋",4,"啑啒啓啔啗",4,"啝啞啟啠啢啣啨啩啫啯",5,"啹啺啽啿喅喆喌喍喎喐喒喓喕喖喗喚喛喞喠",6,"喨",8,"喲喴営喸喺喼喿",4,"嗆嗇嗈嗊嗋嗎嗏嗐嗕嗗",4,"嗞嗠嗢嗧嗩嗭嗮嗰嗱嗴嗶嗸",4,"嗿嘂嘃嘄嘅"],["8740","嘆嘇嘊嘋嘍嘐",7,"嘙嘚嘜嘝嘠嘡嘢嘥嘦嘨嘩嘪嘫嘮嘯嘰嘳嘵嘷嘸嘺嘼嘽嘾噀",11,"噏",4,"噕噖噚噛噝",4],["8780","噣噥噦噧噭噮噯噰噲噳噴噵噷噸噹噺噽",7,"嚇",6,"嚐嚑嚒嚔",14,"嚤",10,"嚰",6,"嚸嚹嚺嚻嚽",12,"囋",8,"囕囖囘囙囜団囥",5,"囬囮囯囲図囶囷囸囻囼圀圁圂圅圇國",6],["8840","園",9,"圝圞圠圡圢圤圥圦圧圫圱圲圴",4,"圼圽圿坁坃坄坅坆坈坉坋坒",4,"坘坙坢坣坥坧坬坮坰坱坲坴坵坸坹坺坽坾坿垀"],["8880","垁垇垈垉垊垍",4,"垔",6,"垜垝垞垟垥垨垪垬垯垰垱垳垵垶垷垹",8,"埄",6,"埌埍埐埑埓埖埗埛埜埞埡埢埣埥",7,"埮埰埱埲埳埵埶執埻埼埾埿堁堃堄堅堈堉堊堌堎堏堐堒堓堔堖堗堘堚堛堜堝堟堢堣堥",4,"堫",4,"報堲堳場堶",7],["8940","堾",5,"塅",6,"塎塏塐塒塓塕塖塗塙",4,"塟",5,"塦",4,"塭",16,"塿墂墄墆墇墈墊墋墌"],["8980","墍",4,"墔",4,"墛墜墝墠",7,"墪",17,"墽墾墿壀壂壃壄壆",10,"壒壓壔壖",13,"壥",5,"壭壯壱売壴壵壷壸壺",7,"夃夅夆夈",4,"夎夐夑夒夓夗夘夛夝夞夠夡夢夣夦夨夬夰夲夳夵夶夻"],["8a40","夽夾夿奀奃奅奆奊奌奍奐奒奓奙奛",4,"奡奣奤奦",12,"奵奷奺奻奼奾奿妀妅妉妋妌妎妏妐妑妔妕妘妚妛妜妝妟妠妡妢妦"],["8a80","妧妬妭妰妱妳",5,"妺妼妽妿",6,"姇姈姉姌姍姎姏姕姖姙姛姞",4,"姤姦姧姩姪姫姭",11,"姺姼姽姾娀娂娊娋娍娎娏娐娒娔娕娖娗娙娚娛娝娞娡娢娤娦娧娨娪",6,"娳娵娷",4,"娽娾娿婁",4,"婇婈婋",9,"婖婗婘婙婛",5],["8b40","婡婣婤婥婦婨婩婫",8,"婸婹婻婼婽婾媀",17,"媓",6,"媜",13,"媫媬"],["8b80","媭",4,"媴媶媷媹",4,"媿嫀嫃",5,"嫊嫋嫍",4,"嫓嫕嫗嫙嫚嫛嫝嫞嫟嫢嫤嫥嫧嫨嫪嫬",4,"嫲",22,"嬊",11,"嬘",25,"嬳嬵嬶嬸",7,"孁",6],["8c40","孈",7,"孒孖孞孠孡孧孨孫孭孮孯孲孴孶孷學孹孻孼孾孿宂宆宊宍宎宐宑宒宔宖実宧宨宩宬宭宮宯宱宲宷宺宻宼寀寁寃寈寉寊寋寍寎寏"],["8c80","寑寔",8,"寠寢寣實寧審",4,"寯寱",6,"寽対尀専尃尅將專尋尌對導尐尒尓尗尙尛尞尟尠尡尣尦尨尩尪尫尭尮尯尰尲尳尵尶尷屃屄屆屇屌屍屒屓屔屖屗屘屚屛屜屝屟屢層屧",6,"屰屲",6,"屻屼屽屾岀岃",4,"岉岊岋岎岏岒岓岕岝",4,"岤",4],["8d40","岪岮岯岰岲岴岶岹岺岻岼岾峀峂峃峅",5,"峌",5,"峓",5,"峚",6,"峢峣峧峩峫峬峮峯峱",9,"峼",4],["8d80","崁崄崅崈",5,"崏",4,"崕崗崘崙崚崜崝崟",4,"崥崨崪崫崬崯",4,"崵",7,"崿",7,"嵈嵉嵍",10,"嵙嵚嵜嵞",10,"嵪嵭嵮嵰嵱嵲嵳嵵",12,"嶃",21,"嶚嶛嶜嶞嶟嶠"],["8e40","嶡",21,"嶸",12,"巆",6,"巎",12,"巜巟巠巣巤巪巬巭"],["8e80","巰巵巶巸",4,"巿帀帄帇帉帊帋帍帎帒帓帗帞",7,"帨",4,"帯帰帲",4,"帹帺帾帿幀幁幃幆",5,"幍",6,"幖",4,"幜幝幟幠幣",14,"幵幷幹幾庁庂広庅庈庉庌庍庎庒庘庛庝庡庢庣庤庨",4,"庮",4,"庴庺庻庼庽庿",6],["8f40","廆廇廈廋",5,"廔廕廗廘廙廚廜",11,"廩廫",8,"廵廸廹廻廼廽弅弆弇弉弌弍弎弐弒弔弖弙弚弜弝弞弡弢弣弤"],["8f80","弨弫弬弮弰弲",6,"弻弽弾弿彁",14,"彑彔彙彚彛彜彞彟彠彣彥彧彨彫彮彯彲彴彵彶彸彺彽彾彿徃徆徍徎徏徑従徔徖徚徛徝從徟徠徢",5,"復徫徬徯",5,"徶徸徹徺徻徾",4,"忇忈忊忋忎忓忔忕忚忛応忞忟忢忣忥忦忨忩忬忯忰忲忳忴忶忷忹忺忼怇"],["9040","怈怉怋怌怐怑怓怗怘怚怞怟怢怣怤怬怭怮怰",4,"怶",4,"怽怾恀恄",6,"恌恎恏恑恓恔恖恗恘恛恜恞恟恠恡恥恦恮恱恲恴恵恷恾悀"],["9080","悁悂悅悆悇悈悊悋悎悏悐悑悓悕悗悘悙悜悞悡悢悤悥悧悩悪悮悰悳悵悶悷悹悺悽",7,"惇惈惉惌",4,"惒惓惔惖惗惙惛惞惡",4,"惪惱惲惵惷惸惻",4,"愂愃愄愅愇愊愋愌愐",4,"愖愗愘愙愛愜愝愞愡愢愥愨愩愪愬",18,"慀",6],["9140","慇慉態慍慏慐慒慓慔慖",6,"慞慟慠慡慣慤慥慦慩",6,"慱慲慳慴慶慸",18,"憌憍憏",4,"憕"],["9180","憖",6,"憞",8,"憪憫憭",9,"憸",5,"憿懀懁懃",4,"應懌",4,"懓懕",16,"懧",13,"懶",8,"戀",5,"戇戉戓戔戙戜戝戞戠戣戦戧戨戩戫戭戯戰戱戲戵戶戸",4,"扂扄扅扆扊"],["9240","扏扐払扖扗扙扚扜",6,"扤扥扨扱扲扴扵扷扸扺扻扽抁抂抃抅抆抇抈抋",5,"抔抙抜抝択抣抦抧抩抪抭抮抯抰抲抳抴抶抷抸抺抾拀拁"],["9280","拃拋拏拑拕拝拞拠拡拤拪拫拰拲拵拸拹拺拻挀挃挄挅挆挊挋挌挍挏挐挒挓挔挕挗挘挙挜挦挧挩挬挭挮挰挱挳",5,"挻挼挾挿捀捁捄捇捈捊捑捒捓捔捖",7,"捠捤捥捦捨捪捫捬捯捰捲捳捴捵捸捹捼捽捾捿掁掃掄掅掆掋掍掑掓掔掕掗掙",6,"採掤掦掫掯掱掲掵掶掹掻掽掿揀"],["9340","揁揂揃揅揇揈揊揋揌揑揓揔揕揗",6,"揟揢揤",4,"揫揬揮揯揰揱揳揵揷揹揺揻揼揾搃搄搆",4,"損搎搑搒搕",5,"搝搟搢搣搤"],["9380","搥搧搨搩搫搮",5,"搵",4,"搻搼搾摀摂摃摉摋",6,"摓摕摖摗摙",4,"摟",7,"摨摪摫摬摮",9,"摻",6,"撃撆撈",8,"撓撔撗撘撚撛撜撝撟",4,"撥撦撧撨撪撫撯撱撲撳撴撶撹撻撽撾撿擁擃擄擆",6,"擏擑擓擔擕擖擙據"],["9440","擛擜擝擟擠擡擣擥擧",24,"攁",7,"攊",7,"攓",4,"攙",8],["9480","攢攣攤攦",4,"攬攭攰攱攲攳攷攺攼攽敀",4,"敆敇敊敋敍敎敐敒敓敔敗敘敚敜敟敠敡敤敥敧敨敩敪敭敮敯敱敳敵敶數",14,"斈斉斊斍斎斏斒斔斕斖斘斚斝斞斠斢斣斦斨斪斬斮斱",7,"斺斻斾斿旀旂旇旈旉旊旍旐旑旓旔旕旘",7,"旡旣旤旪旫"],["9540","旲旳旴旵旸旹旻",4,"昁昄昅昇昈昉昋昍昐昑昒昖昗昘昚昛昜昞昡昢昣昤昦昩昪昫昬昮昰昲昳昷",4,"昽昿晀時晄",6,"晍晎晐晑晘"],["9580","晙晛晜晝晞晠晢晣晥晧晩",4,"晱晲晳晵晸晹晻晼晽晿暀暁暃暅暆暈暉暊暋暍暎暏暐暒暓暔暕暘",4,"暞",8,"暩",4,"暯",4,"暵暶暷暸暺暻暼暽暿",25,"曚曞",7,"曧曨曪",5,"曱曵曶書曺曻曽朁朂會"],["9640","朄朅朆朇朌朎朏朑朒朓朖朘朙朚朜朞朠",5,"朧朩朮朰朲朳朶朷朸朹朻朼朾朿杁杄杅杇杊杋杍杒杔杕杗",4,"杝杢杣杤杦杧杫杬杮東杴杶"],["9680","杸杹杺杻杽枀枂枃枅枆枈枊枌枍枎枏枑枒枓枔枖枙枛枟枠枡枤枦枩枬枮枱枲枴枹",7,"柂柅",9,"柕柖柗柛柟柡柣柤柦柧柨柪柫柭柮柲柵",7,"柾栁栂栃栄栆栍栐栒栔栕栘",4,"栞栟栠栢",6,"栫",6,"栴栵栶栺栻栿桇桋桍桏桒桖",5],["9740","桜桝桞桟桪桬",7,"桵桸",8,"梂梄梇",7,"梐梑梒梔梕梖梘",9,"梣梤梥梩梪梫梬梮梱梲梴梶梷梸"],["9780","梹",6,"棁棃",5,"棊棌棎棏棐棑棓棔棖棗棙棛",4,"棡棢棤",9,"棯棲棳棴棶棷棸棻棽棾棿椀椂椃椄椆",4,"椌椏椑椓",11,"椡椢椣椥",7,"椮椯椱椲椳椵椶椷椸椺椻椼椾楀楁楃",16,"楕楖楘楙楛楜楟"],["9840","楡楢楤楥楧楨楩楪楬業楯楰楲",4,"楺楻楽楾楿榁榃榅榊榋榌榎",5,"榖榗榙榚榝",9,"榩榪榬榮榯榰榲榳榵榶榸榹榺榼榽"],["9880","榾榿槀槂",7,"構槍槏槑槒槓槕",5,"槜槝槞槡",11,"槮槯槰槱槳",9,"槾樀",9,"樋",11,"標",5,"樠樢",5,"権樫樬樭樮樰樲樳樴樶",6,"樿",4,"橅橆橈",7,"橑",6,"橚"],["9940","橜",4,"橢橣橤橦",10,"橲",6,"橺橻橽橾橿檁檂檃檅",8,"檏檒",4,"檘",7,"檡",5],["9980","檧檨檪檭",114,"欥欦欨",6],["9a40","欯欰欱欳欴欵欶欸欻欼欽欿歀歁歂歄歅歈歊歋歍",11,"歚",7,"歨歩歫",13,"歺歽歾歿殀殅殈"],["9a80","殌殎殏殐殑殔殕殗殘殙殜",4,"殢",7,"殫",7,"殶殸",6,"毀毃毄毆",4,"毌毎毐毑毘毚毜",4,"毢",7,"毬毭毮毰毱毲毴毶毷毸毺毻毼毾",6,"氈",4,"氎氒気氜氝氞氠氣氥氫氬氭氱氳氶氷氹氺氻氼氾氿汃汄汅汈汋",4,"汑汒汓汖汘"],["9b40","汙汚汢汣汥汦汧汫",4,"汱汳汵汷汸決汻汼汿沀沄沇沊沋沍沎沑沒沕沖沗沘沚沜沝沞沠沢沨沬沯沰沴沵沶沷沺泀況泂泃泆泇泈泋泍泎泏泑泒泘"],["9b80","泙泚泜泝泟泤泦泧泩泬泭泲泴泹泿洀洂洃洅洆洈洉洊洍洏洐洑洓洔洕洖洘洜洝洟",5,"洦洨洩洬洭洯洰洴洶洷洸洺洿浀浂浄浉浌浐浕浖浗浘浛浝浟浡浢浤浥浧浨浫浬浭浰浱浲浳浵浶浹浺浻浽",4,"涃涄涆涇涊涋涍涏涐涒涖",4,"涜涢涥涬涭涰涱涳涴涶涷涹",5,"淁淂淃淈淉淊"],["9c40","淍淎淏淐淒淓淔淕淗淚淛淜淟淢淣淥淧淨淩淪淭淯淰淲淴淵淶淸淺淽",7,"渆渇済渉渋渏渒渓渕渘渙減渜渞渟渢渦渧渨渪測渮渰渱渳渵"],["9c80","渶渷渹渻",7,"湅",7,"湏湐湑湒湕湗湙湚湜湝湞湠",10,"湬湭湯",14,"満溁溂溄溇溈溊",4,"溑",6,"溙溚溛溝溞溠溡溣溤溦溨溩溫溬溭溮溰溳溵溸溹溼溾溿滀滃滄滅滆滈滉滊滌滍滎滐滒滖滘滙滛滜滝滣滧滪",5],["9d40","滰滱滲滳滵滶滷滸滺",7,"漃漄漅漇漈漊",4,"漐漑漒漖",9,"漡漢漣漥漦漧漨漬漮漰漲漴漵漷",6,"漿潀潁潂"],["9d80","潃潄潅潈潉潊潌潎",9,"潙潚潛潝潟潠潡潣潤潥潧",5,"潯潰潱潳潵潶潷潹潻潽",6,"澅澆澇澊澋澏",12,"澝澞澟澠澢",4,"澨",10,"澴澵澷澸澺",5,"濁濃",5,"濊",6,"濓",10,"濟濢濣濤濥"],["9e40","濦",7,"濰",32,"瀒",7,"瀜",6,"瀤",6],["9e80","瀫",9,"瀶瀷瀸瀺",17,"灍灎灐",13,"灟",11,"灮灱灲灳灴灷灹灺灻災炁炂炃炄炆炇炈炋炌炍炏炐炑炓炗炘炚炛炞",12,"炰炲炴炵炶為炾炿烄烅烆烇烉烋",12,"烚"],["9f40","烜烝烞烠烡烢烣烥烪烮烰",6,"烸烺烻烼烾",10,"焋",4,"焑焒焔焗焛",10,"焧",7,"焲焳焴"],["9f80","焵焷",13,"煆煇煈煉煋煍煏",12,"煝煟",4,"煥煩",4,"煯煰煱煴煵煶煷煹煻煼煾",5,"熅",4,"熋熌熍熎熐熑熒熓熕熖熗熚",4,"熡",6,"熩熪熫熭",5,"熴熶熷熸熺",8,"燄",9,"燏",4],["a040","燖",9,"燡燢燣燤燦燨",5,"燯",9,"燺",11,"爇",19],["a080","爛爜爞",9,"爩爫爭爮爯爲爳爴爺爼爾牀",6,"牉牊牋牎牏牐牑牓牔牕牗牘牚牜牞牠牣牤牥牨牪牫牬牭牰牱牳牴牶牷牸牻牼牽犂犃犅",4,"犌犎犐犑犓",11,"犠",11,"犮犱犲犳犵犺",6,"狅狆狇狉狊狋狌狏狑狓狔狕狖狘狚狛"],["a1a1","　、。·ˉˇ¨〃々—～‖…‘’“”〔〕〈",7,"〖〗【】±×÷∶∧∨∑∏∪∩∈∷√⊥∥∠⌒⊙∫∮≡≌≈∽∝≠≮≯≤≥∞∵∴♂♀°′″℃＄¤￠￡‰§№☆★○●◎◇◆□■△▲※→←↑↓〓"],["a2a1","ⅰ",9],["a2b1","⒈",19,"⑴",19,"①",9],["a2e5","㈠",9],["a2f1","Ⅰ",11],["a3a1","！＂＃￥％",88,"￣"],["a4a1","ぁ",82],["a5a1","ァ",85],["a6a1","Α",16,"Σ",6],["a6c1","α",16,"σ",6],["a6e0","︵︶︹︺︿﹀︽︾﹁﹂﹃﹄"],["a6ee","︻︼︷︸︱"],["a6f4","︳︴"],["a7a1","А",5,"ЁЖ",25],["a7d1","а",5,"ёж",25],["a840","ˊˋ˙–―‥‵℅℉↖↗↘↙∕∟∣≒≦≧⊿═",35,"▁",6],["a880","█",7,"▓▔▕▼▽◢◣◤◥☉⊕〒〝〞"],["a8a1","āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüêɑ"],["a8bd","ńň"],["a8c0","ɡ"],["a8c5","ㄅ",36],["a940","〡",8,"㊣㎎㎏㎜㎝㎞㎡㏄㏎㏑㏒㏕︰￢￤"],["a959","℡㈱"],["a95c","‐"],["a960","ー゛゜ヽヾ〆ゝゞ﹉",9,"﹔﹕﹖﹗﹙",8],["a980","﹢",4,"﹨﹩﹪﹫"],["a996","〇"],["a9a4","─",75],["aa40","狜狝狟狢",5,"狪狫狵狶狹狽狾狿猀猂猄",5,"猋猌猍猏猐猑猒猔猘猙猚猟猠猣猤猦猧猨猭猯猰猲猳猵猶猺猻猼猽獀",8],["aa80","獉獊獋獌獎獏獑獓獔獕獖獘",7,"獡",10,"獮獰獱"],["ab40","獲",11,"獿",4,"玅玆玈玊玌玍玏玐玒玓玔玕玗玘玙玚玜玝玞玠玡玣",5,"玪玬玭玱玴玵玶玸玹玼玽玾玿珁珃",4],["ab80","珋珌珎珒",6,"珚珛珜珝珟珡珢珣珤珦珨珪珫珬珮珯珰珱珳",4],["ac40","珸",10,"琄琇琈琋琌琍琎琑",8,"琜",5,"琣琤琧琩琫琭琯琱琲琷",4,"琽琾琿瑀瑂",11],["ac80","瑎",6,"瑖瑘瑝瑠",12,"瑮瑯瑱",4,"瑸瑹瑺"],["ad40","瑻瑼瑽瑿璂璄璅璆璈璉璊璌璍璏璑",10,"璝璟",7,"璪",15,"璻",12],["ad80","瓈",9,"瓓",8,"瓝瓟瓡瓥瓧",6,"瓰瓱瓲"],["ae40","瓳瓵瓸",6,"甀甁甂甃甅",7,"甎甐甒甔甕甖甗甛甝甞甠",4,"甦甧甪甮甴甶甹甼甽甿畁畂畃畄畆畇畉畊畍畐畑畒畓畕畖畗畘"],["ae80","畝",7,"畧畨畩畫",6,"畳畵當畷畺",4,"疀疁疂疄疅疇"],["af40","疈疉疊疌疍疎疐疓疕疘疛疜疞疢疦",4,"疭疶疷疺疻疿痀痁痆痋痌痎痏痐痑痓痗痙痚痜痝痟痠痡痥痩痬痭痮痯痲痳痵痶痷痸痺痻痽痾瘂瘄瘆瘇"],["af80","瘈瘉瘋瘍瘎瘏瘑瘒瘓瘔瘖瘚瘜瘝瘞瘡瘣瘧瘨瘬瘮瘯瘱瘲瘶瘷瘹瘺瘻瘽癁療癄"],["b040","癅",6,"癎",5,"癕癗",4,"癝癟癠癡癢癤",6,"癬癭癮癰",7,"癹発發癿皀皁皃皅皉皊皌皍皏皐皒皔皕皗皘皚皛"],["b080","皜",7,"皥",8,"皯皰皳皵",9,"盀盁盃啊阿埃挨哎唉哀皑癌蔼矮艾碍爱隘鞍氨安俺按暗岸胺案肮昂盎凹敖熬翱袄傲奥懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸白柏百摆佰败拜稗斑班搬扳般颁板版扮拌伴瓣半办绊邦帮梆榜膀绑棒磅蚌镑傍谤苞胞包褒剥"],["b140","盄盇盉盋盌盓盕盙盚盜盝盞盠",4,"盦",7,"盰盳盵盶盷盺盻盽盿眀眂眃眅眆眊県眎",10,"眛眜眝眞眡眣眤眥眧眪眫"],["b180","眬眮眰",4,"眹眻眽眾眿睂睄睅睆睈",7,"睒",7,"睜薄雹保堡饱宝抱报暴豹鲍爆杯碑悲卑北辈背贝钡倍狈备惫焙被奔苯本笨崩绷甭泵蹦迸逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛鞭边编贬扁便变卞辨辩辫遍标彪膘表鳖憋别瘪彬斌濒滨宾摈兵冰柄丙秉饼炳"],["b240","睝睞睟睠睤睧睩睪睭",11,"睺睻睼瞁瞂瞃瞆",5,"瞏瞐瞓",11,"瞡瞣瞤瞦瞨瞫瞭瞮瞯瞱瞲瞴瞶",4],["b280","瞼瞾矀",12,"矎",8,"矘矙矚矝",4,"矤病并玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳捕卜哺补埠不布步簿部怖擦猜裁材才财睬踩采彩菜蔡餐参蚕残惭惨灿苍舱仓沧藏操糙槽曹草厕策侧册测层蹭插叉茬茶查碴搽察岔差诧拆柴豺搀掺蝉馋谗缠铲产阐颤昌猖"],["b340","矦矨矪矯矰矱矲矴矵矷矹矺矻矼砃",5,"砊砋砎砏砐砓砕砙砛砞砠砡砢砤砨砪砫砮砯砱砲砳砵砶砽砿硁硂硃硄硆硈硉硊硋硍硏硑硓硔硘硙硚"],["b380","硛硜硞",11,"硯",7,"硸硹硺硻硽",6,"场尝常长偿肠厂敞畅唱倡超抄钞朝嘲潮巢吵炒车扯撤掣彻澈郴臣辰尘晨忱沉陈趁衬撑称城橙成呈乘程惩澄诚承逞骋秤吃痴持匙池迟弛驰耻齿侈尺赤翅斥炽充冲虫崇宠抽酬畴踌稠愁筹仇绸瞅丑臭初出橱厨躇锄雏滁除楚"],["b440","碄碅碆碈碊碋碏碐碒碔碕碖碙碝碞碠碢碤碦碨",7,"碵碶碷碸確碻碼碽碿磀磂磃磄磆磇磈磌磍磎磏磑磒磓磖磗磘磚",9],["b480","磤磥磦磧磩磪磫磭",4,"磳磵磶磸磹磻",5,"礂礃礄礆",6,"础储矗搐触处揣川穿椽传船喘串疮窗幢床闯创吹炊捶锤垂春椿醇唇淳纯蠢戳绰疵茨磁雌辞慈瓷词此刺赐次聪葱囱匆从丛凑粗醋簇促蹿篡窜摧崔催脆瘁粹淬翠村存寸磋撮搓措挫错搭达答瘩打大呆歹傣戴带殆代贷袋待逮"],["b540","礍",5,"礔",9,"礟",4,"礥",14,"礵",4,"礽礿祂祃祄祅祇祊",8,"祔祕祘祙祡祣"],["b580","祤祦祩祪祫祬祮祰",6,"祹祻",4,"禂禃禆禇禈禉禋禌禍禎禐禑禒怠耽担丹单郸掸胆旦氮但惮淡诞弹蛋当挡党荡档刀捣蹈倒岛祷导到稻悼道盗德得的蹬灯登等瞪凳邓堤低滴迪敌笛狄涤翟嫡抵底地蒂第帝弟递缔颠掂滇碘点典靛垫电佃甸店惦奠淀殿碉叼雕凋刁掉吊钓调跌爹碟蝶迭谍叠"],["b640","禓",6,"禛",11,"禨",10,"禴",4,"禼禿秂秄秅秇秈秊秌秎秏秐秓秔秖秗秙",5,"秠秡秢秥秨秪"],["b680","秬秮秱",6,"秹秺秼秾秿稁稄稅稇稈稉稊稌稏",4,"稕稖稘稙稛稜丁盯叮钉顶鼎锭定订丢东冬董懂动栋侗恫冻洞兜抖斗陡豆逗痘都督毒犊独读堵睹赌杜镀肚度渡妒端短锻段断缎堆兑队对墩吨蹲敦顿囤钝盾遁掇哆多夺垛躲朵跺舵剁惰堕蛾峨鹅俄额讹娥恶厄扼遏鄂饿恩而儿耳尔饵洱二"],["b740","稝稟稡稢稤",14,"稴稵稶稸稺稾穀",5,"穇",9,"穒",4,"穘",16],["b780","穩",6,"穱穲穳穵穻穼穽穾窂窅窇窉窊窋窌窎窏窐窓窔窙窚窛窞窡窢贰发罚筏伐乏阀法珐藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛坊芳方肪房防妨仿访纺放菲非啡飞肥匪诽吠肺废沸费芬酚吩氛分纷坟焚汾粉奋份忿愤粪丰封枫蜂峰锋风疯烽逢冯缝讽奉凤佛否夫敷肤孵扶拂辐幅氟符伏俘服"],["b840","窣窤窧窩窪窫窮",4,"窴",10,"竀",10,"竌",9,"竗竘竚竛竜竝竡竢竤竧",5,"竮竰竱竲竳"],["b880","竴",4,"竻竼竾笀笁笂笅笇笉笌笍笎笐笒笓笖笗笘笚笜笝笟笡笢笣笧笩笭浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐噶嘎该改概钙盖溉干甘杆柑竿肝赶感秆敢赣冈刚钢缸肛纲岗港杠篙皋高膏羔糕搞镐稿告哥歌搁戈鸽胳疙割革葛格蛤阁隔铬个各给根跟耕更庚羹"],["b940","笯笰笲笴笵笶笷笹笻笽笿",5,"筆筈筊筍筎筓筕筗筙筜筞筟筡筣",10,"筯筰筳筴筶筸筺筼筽筿箁箂箃箄箆",6,"箎箏"],["b980","箑箒箓箖箘箙箚箛箞箟箠箣箤箥箮箯箰箲箳箵箶箷箹",7,"篂篃範埂耿梗工攻功恭龚供躬公宫弓巩汞拱贡共钩勾沟苟狗垢构购够辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇刮瓜剐寡挂褂乖拐怪棺关官冠观管馆罐惯灌贯光广逛瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽辊滚棍锅郭国果裹过哈"],["ba40","篅篈築篊篋篍篎篏篐篒篔",4,"篛篜篞篟篠篢篣篤篧篨篩篫篬篭篯篰篲",4,"篸篹篺篻篽篿",7,"簈簉簊簍簎簐",5,"簗簘簙"],["ba80","簚",4,"簠",5,"簨簩簫",12,"簹",5,"籂骸孩海氦亥害骇酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉夯杭航壕嚎豪毫郝好耗号浩呵喝荷菏核禾和何合盒貉阂河涸赫褐鹤贺嘿黑痕很狠恨哼亨横衡恒轰哄烘虹鸿洪宏弘红喉侯猴吼厚候后呼乎忽瑚壶葫胡蝴狐糊湖"],["bb40","籃",9,"籎",36,"籵",5,"籾",9],["bb80","粈粊",6,"粓粔粖粙粚粛粠粡粣粦粧粨粩粫粬粭粯粰粴",4,"粺粻弧虎唬护互沪户花哗华猾滑画划化话槐徊怀淮坏欢环桓还缓换患唤痪豢焕涣宦幻荒慌黄磺蝗簧皇凰惶煌晃幌恍谎灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘荤昏婚魂浑混豁活伙火获或惑霍货祸击圾基机畸稽积箕"],["bc40","粿糀糂糃糄糆糉糋糎",6,"糘糚糛糝糞糡",6,"糩",5,"糰",7,"糹糺糼",13,"紋",5],["bc80","紑",14,"紡紣紤紥紦紨紩紪紬紭紮細",6,"肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际妓继纪嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁歼监坚尖笺间煎兼肩艰奸缄茧检柬碱硷拣捡简俭剪减荐槛鉴践贱见键箭件"],["bd40","紷",54,"絯",7],["bd80","絸",32,"健舰剑饯渐溅涧建僵姜将浆江疆蒋桨奖讲匠酱降蕉椒礁焦胶交郊浇骄娇嚼搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖揭接皆秸街阶截劫节桔杰捷睫竭洁结解姐戒藉芥界借介疥诫届巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸"],["be40","継",12,"綧",6,"綯",42],["be80","線",32,"尽劲荆兢茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净炯窘揪究纠玖韭久灸九酒厩救旧臼舅咎就疚鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧捐鹃娟倦眷卷绢撅攫抉掘倔爵觉决诀绝均菌钧军君峻"],["bf40","緻",62],["bf80","縺縼",4,"繂",4,"繈",21,"俊竣浚郡骏喀咖卡咯开揩楷凯慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕颗科壳咳可渴克刻客课肯啃垦恳坑吭空恐孔控抠口扣寇枯哭窟苦酷库裤夸垮挎跨胯块筷侩快宽款匡筐狂框矿眶旷况亏盔岿窥葵奎魁傀"],["c040","繞",35,"纃",23,"纜纝纞"],["c080","纮纴纻纼绖绤绬绹缊缐缞缷缹缻",6,"罃罆",9,"罒罓馈愧溃坤昆捆困括扩廓阔垃拉喇蜡腊辣啦莱来赖蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥琅榔狼廊郎朗浪捞劳牢老佬姥酪烙涝勒乐雷镭蕾磊累儡垒擂肋类泪棱楞冷厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐"],["c140","罖罙罛罜罝罞罠罣",4,"罫罬罭罯罰罳罵罶罷罸罺罻罼罽罿羀羂",7,"羋羍羏",4,"羕",4,"羛羜羠羢羣羥羦羨",6,"羱"],["c180","羳",4,"羺羻羾翀翂翃翄翆翇翈翉翋翍翏",4,"翖翗翙",5,"翢翣痢立粒沥隶力璃哩俩联莲连镰廉怜涟帘敛脸链恋炼练粮凉梁粱良两辆量晾亮谅撩聊僚疗燎寥辽潦了撂镣廖料列裂烈劣猎琳林磷霖临邻鳞淋凛赁吝拎玲菱零龄铃伶羚凌灵陵岭领另令溜琉榴硫馏留刘瘤流柳六龙聋咙笼窿"],["c240","翤翧翨翪翫翬翭翯翲翴",6,"翽翾翿耂耇耈耉耊耎耏耑耓耚耛耝耞耟耡耣耤耫",5,"耲耴耹耺耼耾聀聁聄聅聇聈聉聎聏聐聑聓聕聖聗"],["c280","聙聛",13,"聫",5,"聲",11,"隆垄拢陇楼娄搂篓漏陋芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮驴吕铝侣旅履屡缕虑氯律率滤绿峦挛孪滦卵乱掠略抡轮伦仑沦纶论萝螺罗逻锣箩骡裸落洛骆络妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫"],["c340","聾肁肂肅肈肊肍",5,"肔肕肗肙肞肣肦肧肨肬肰肳肵肶肸肹肻胅胇",4,"胏",6,"胘胟胠胢胣胦胮胵胷胹胻胾胿脀脁脃脄脅脇脈脋"],["c380","脌脕脗脙脛脜脝脟",12,"脭脮脰脳脴脵脷脹",4,"脿谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸么玫枚梅酶霉煤没眉媒镁每美昧寐妹媚门闷们萌蒙檬盟锰猛梦孟眯醚靡糜迷谜弥米秘觅泌蜜密幂棉眠绵冕免勉娩缅面苗描瞄藐秒渺庙妙蔑灭民抿皿敏悯闽明螟鸣铭名命谬摸"],["c440","腀",5,"腇腉腍腎腏腒腖腗腘腛",4,"腡腢腣腤腦腨腪腫腬腯腲腳腵腶腷腸膁膃",4,"膉膋膌膍膎膐膒",5,"膙膚膞",4,"膤膥"],["c480","膧膩膫",7,"膴",5,"膼膽膾膿臄臅臇臈臉臋臍",6,"摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某拇牡亩姆母墓暮幕募慕木目睦牧穆拿哪呐钠那娜纳氖乃奶耐奈南男难囊挠脑恼闹淖呢馁内嫩能妮霓倪泥尼拟你匿腻逆溺蔫拈年碾撵捻念娘酿鸟尿捏聂孽啮镊镍涅您柠狞凝宁"],["c540","臔",14,"臤臥臦臨臩臫臮",4,"臵",5,"臽臿舃與",4,"舎舏舑舓舕",5,"舝舠舤舥舦舧舩舮舲舺舼舽舿"],["c580","艀艁艂艃艅艆艈艊艌艍艎艐",7,"艙艛艜艝艞艠",7,"艩拧泞牛扭钮纽脓浓农弄奴努怒女暖虐疟挪懦糯诺哦欧鸥殴藕呕偶沤啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡呸胚培裴赔陪配佩沛喷盆砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯砒霹批披劈琵毗"],["c640","艪艫艬艭艱艵艶艷艸艻艼芀芁芃芅芆芇芉芌芐芓芔芕芖芚芛芞芠芢芣芧芲芵芶芺芻芼芿苀苂苃苅苆苉苐苖苙苚苝苢苧苨苩苪苬苭苮苰苲苳苵苶苸"],["c680","苺苼",4,"茊茋茍茐茒茓茖茘茙茝",9,"茩茪茮茰茲茷茻茽啤脾疲皮匹痞僻屁譬篇偏片骗飘漂瓢票撇瞥拼频贫品聘乒坪苹萍平凭瓶评屏坡泼颇婆破魄迫粕剖扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫掐"],["c740","茾茿荁荂荄荅荈荊",4,"荓荕",4,"荝荢荰",6,"荹荺荾",6,"莇莈莊莋莌莍莏莐莑莔莕莖莗莙莚莝莟莡",6,"莬莭莮"],["c780","莯莵莻莾莿菂菃菄菆菈菉菋菍菎菐菑菒菓菕菗菙菚菛菞菢菣菤菦菧菨菫菬菭恰洽牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉枪呛腔羌墙蔷强抢橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍切茄且怯窃钦侵亲秦琴勤芹擒禽寝沁青轻氢倾卿清擎晴氰情顷请庆琼穷秋丘邱球求囚酋泅趋区蛆曲躯屈驱渠"],["c840","菮華菳",4,"菺菻菼菾菿萀萂萅萇萈萉萊萐萒",5,"萙萚萛萞",5,"萩",7,"萲",5,"萹萺萻萾",7,"葇葈葉"],["c880","葊",6,"葒",4,"葘葝葞葟葠葢葤",4,"葪葮葯葰葲葴葷葹葻葼取娶龋趣去圈颧权醛泉全痊拳犬券劝缺炔瘸却鹊榷确雀裙群然燃冉染瓤壤攘嚷让饶扰绕惹热壬仁人忍韧任认刃妊纫扔仍日戎茸蓉荣融熔溶容绒冗揉柔肉茹蠕儒孺如辱乳汝入褥软阮蕊瑞锐闰润若弱撒洒萨腮鳃塞赛三叁"],["c940","葽",4,"蒃蒄蒅蒆蒊蒍蒏",7,"蒘蒚蒛蒝蒞蒟蒠蒢",12,"蒰蒱蒳蒵蒶蒷蒻蒼蒾蓀蓂蓃蓅蓆蓇蓈蓋蓌蓎蓏蓒蓔蓕蓗"],["c980","蓘",4,"蓞蓡蓢蓤蓧",4,"蓭蓮蓯蓱",10,"蓽蓾蔀蔁蔂伞散桑嗓丧搔骚扫嫂瑟色涩森僧莎砂杀刹沙纱傻啥煞筛晒珊苫杉山删煽衫闪陕擅赡膳善汕扇缮墒伤商赏晌上尚裳梢捎稍烧芍勺韶少哨邵绍奢赊蛇舌舍赦摄射慑涉社设砷申呻伸身深娠绅神沈审婶甚肾慎渗声生甥牲升绳"],["ca40","蔃",8,"蔍蔎蔏蔐蔒蔔蔕蔖蔘蔙蔛蔜蔝蔞蔠蔢",8,"蔭",9,"蔾",4,"蕄蕅蕆蕇蕋",10],["ca80","蕗蕘蕚蕛蕜蕝蕟",4,"蕥蕦蕧蕩",8,"蕳蕵蕶蕷蕸蕼蕽蕿薀薁省盛剩胜圣师失狮施湿诗尸虱十石拾时什食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试收手首守寿授售受瘦兽蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱"],["cb40","薂薃薆薈",6,"薐",10,"薝",6,"薥薦薧薩薫薬薭薱",5,"薸薺",6,"藂",6,"藊",4,"藑藒"],["cb80","藔藖",5,"藝",6,"藥藦藧藨藪",14,"恕刷耍摔衰甩帅栓拴霜双爽谁水睡税吮瞬顺舜说硕朔烁斯撕嘶思私司丝死肆寺嗣四伺似饲巳松耸怂颂送宋讼诵搜艘擞嗽苏酥俗素速粟僳塑溯宿诉肃酸蒜算虽隋随绥髓碎岁穗遂隧祟孙损笋蓑梭唆缩琐索锁所塌他它她塔"],["cc40","藹藺藼藽藾蘀",4,"蘆",10,"蘒蘓蘔蘕蘗",15,"蘨蘪",13,"蘹蘺蘻蘽蘾蘿虀"],["cc80","虁",11,"虒虓處",4,"虛虜虝號虠虡虣",7,"獭挞蹋踏胎苔抬台泰酞太态汰坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭汤塘搪堂棠膛唐糖倘躺淌趟烫掏涛滔绦萄桃逃淘陶讨套特藤腾疼誊梯剔踢锑提题蹄啼体替嚏惕涕剃屉天添填田甜恬舔腆挑条迢眺跳贴铁帖厅听烃"],["cd40","虭虯虰虲",6,"蚃",6,"蚎",4,"蚔蚖",5,"蚞",4,"蚥蚦蚫蚭蚮蚲蚳蚷蚸蚹蚻",4,"蛁蛂蛃蛅蛈蛌蛍蛒蛓蛕蛖蛗蛚蛜"],["cd80","蛝蛠蛡蛢蛣蛥蛦蛧蛨蛪蛫蛬蛯蛵蛶蛷蛺蛻蛼蛽蛿蜁蜄蜅蜆蜋蜌蜎蜏蜐蜑蜔蜖汀廷停亭庭挺艇通桐酮瞳同铜彤童桶捅筒统痛偷投头透凸秃突图徒途涂屠土吐兔湍团推颓腿蜕褪退吞屯臀拖托脱鸵陀驮驼椭妥拓唾挖哇蛙洼娃瓦袜歪外豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕汪王亡枉网往旺望忘妄威"],["ce40","蜙蜛蜝蜟蜠蜤蜦蜧蜨蜪蜫蜬蜭蜯蜰蜲蜳蜵蜶蜸蜹蜺蜼蜽蝀",6,"蝊蝋蝍蝏蝐蝑蝒蝔蝕蝖蝘蝚",5,"蝡蝢蝦",7,"蝯蝱蝲蝳蝵"],["ce80","蝷蝸蝹蝺蝿螀螁螄螆螇螉螊螌螎",4,"螔螕螖螘",6,"螠",4,"巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫瘟温蚊文闻纹吻稳紊问嗡翁瓮挝蜗涡窝我斡卧握沃巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误昔熙析西硒矽晰嘻吸锡牺"],["cf40","螥螦螧螩螪螮螰螱螲螴螶螷螸螹螻螼螾螿蟁",4,"蟇蟈蟉蟌",4,"蟔",6,"蟜蟝蟞蟟蟡蟢蟣蟤蟦蟧蟨蟩蟫蟬蟭蟯",9],["cf80","蟺蟻蟼蟽蟿蠀蠁蠂蠄",5,"蠋",7,"蠔蠗蠘蠙蠚蠜",4,"蠣稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细瞎虾匣霞辖暇峡侠狭下厦夏吓掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象萧硝霄削哮嚣销消宵淆晓"],["d040","蠤",13,"蠳",5,"蠺蠻蠽蠾蠿衁衂衃衆",5,"衎",5,"衕衖衘衚",6,"衦衧衪衭衯衱衳衴衵衶衸衹衺"],["d080","衻衼袀袃袆袇袉袊袌袎袏袐袑袓袔袕袗",4,"袝",4,"袣袥",5,"小孝校肖啸笑效楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑薪芯锌欣辛新忻心信衅星腥猩惺兴刑型形邢行醒幸杏性姓兄凶胸匈汹雄熊休修羞朽嗅锈秀袖绣墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续轩喧宣悬旋玄"],["d140","袬袮袯袰袲",4,"袸袹袺袻袽袾袿裀裃裄裇裈裊裋裌裍裏裐裑裓裖裗裚",4,"裠裡裦裧裩",6,"裲裵裶裷裺裻製裿褀褁褃",5],["d180","褉褋",4,"褑褔",4,"褜",4,"褢褣褤褦褧褨褩褬褭褮褯褱褲褳褵褷选癣眩绚靴薛学穴雪血勋熏循旬询寻驯巡殉汛训讯逊迅压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾邀腰妖瑶"],["d240","褸",8,"襂襃襅",24,"襠",5,"襧",19,"襼"],["d280","襽襾覀覂覄覅覇",26,"摇尧遥窑谣姚咬舀药要耀椰噎耶爷野冶也页掖业叶曳腋夜液一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎茵荫因殷音阴姻吟银淫寅饮尹引隐"],["d340","覢",30,"觃觍觓觔觕觗觘觙觛觝觟觠觡觢觤觧觨觩觪觬觭觮觰觱觲觴",6],["d380","觻",4,"訁",5,"計",21,"印英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映哟拥佣臃痈庸雍踊蛹咏泳涌永恿勇用幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉"],["d440","訞",31,"訿",8,"詉",21],["d480","詟",25,"詺",6,"浴寓裕预豫驭鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院曰约越跃钥岳粤月悦阅耘云郧匀陨允运蕴酝晕韵孕匝砸杂栽哉灾宰载再在咱攒暂赞赃脏葬遭糟凿藻枣早澡蚤躁噪造皂灶燥责择则泽贼怎增憎曾赠扎喳渣札轧"],["d540","誁",7,"誋",7,"誔",46],["d580","諃",32,"铡闸眨栅榨咋乍炸诈摘斋宅窄债寨瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽樟章彰漳张掌涨杖丈帐账仗胀瘴障招昭找沼赵照罩兆肇召遮折哲蛰辙者锗蔗这浙珍斟真甄砧臻贞针侦枕疹诊震振镇阵蒸挣睁征狰争怔整拯正政"],["d640","諤",34,"謈",27],["d680","謤謥謧",30,"帧症郑证芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒中盅忠钟衷终种肿重仲众舟周州洲诌粥轴肘帚咒皱宙昼骤珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑"],["d740","譆",31,"譧",4,"譭",25],["d780","讇",24,"讬讱讻诇诐诪谉谞住注祝驻抓爪拽专砖转撰赚篆桩庄装妆撞壮状椎锥追赘坠缀谆准捉拙卓桌琢茁酌啄着灼浊兹咨资姿滋淄孜紫仔籽滓子自渍字鬃棕踪宗综总纵邹走奏揍租足卒族祖诅阻组钻纂嘴醉最罪尊遵昨左佐柞做作坐座"],["d840","谸",8,"豂豃豄豅豈豊豋豍",7,"豖豗豘豙豛",5,"豣",6,"豬",6,"豴豵豶豷豻",6,"貃貄貆貇"],["d880","貈貋貍",6,"貕貖貗貙",20,"亍丌兀丐廿卅丕亘丞鬲孬噩丨禺丿匕乇夭爻卮氐囟胤馗毓睾鼗丶亟鼐乜乩亓芈孛啬嘏仄厍厝厣厥厮靥赝匚叵匦匮匾赜卦卣刂刈刎刭刳刿剀剌剞剡剜蒯剽劂劁劐劓冂罔亻仃仉仂仨仡仫仞伛仳伢佤仵伥伧伉伫佞佧攸佚佝"],["d940","貮",62],["d980","賭",32,"佟佗伲伽佶佴侑侉侃侏佾佻侪佼侬侔俦俨俪俅俚俣俜俑俟俸倩偌俳倬倏倮倭俾倜倌倥倨偾偃偕偈偎偬偻傥傧傩傺僖儆僭僬僦僮儇儋仝氽佘佥俎龠汆籴兮巽黉馘冁夔勹匍訇匐凫夙兕亠兖亳衮袤亵脔裒禀嬴蠃羸冫冱冽冼"],["da40","贎",14,"贠赑赒赗赟赥赨赩赪赬赮赯赱赲赸",8,"趂趃趆趇趈趉趌",4,"趒趓趕",9,"趠趡"],["da80","趢趤",12,"趲趶趷趹趻趽跀跁跂跅跇跈跉跊跍跐跒跓跔凇冖冢冥讠讦讧讪讴讵讷诂诃诋诏诎诒诓诔诖诘诙诜诟诠诤诨诩诮诰诳诶诹诼诿谀谂谄谇谌谏谑谒谔谕谖谙谛谘谝谟谠谡谥谧谪谫谮谯谲谳谵谶卩卺阝阢阡阱阪阽阼陂陉陔陟陧陬陲陴隈隍隗隰邗邛邝邙邬邡邴邳邶邺"],["db40","跕跘跙跜跠跡跢跥跦跧跩跭跮跰跱跲跴跶跼跾",6,"踆踇踈踋踍踎踐踑踒踓踕",7,"踠踡踤",4,"踫踭踰踲踳踴踶踷踸踻踼踾"],["db80","踿蹃蹅蹆蹌",4,"蹓",5,"蹚",11,"蹧蹨蹪蹫蹮蹱邸邰郏郅邾郐郄郇郓郦郢郜郗郛郫郯郾鄄鄢鄞鄣鄱鄯鄹酃酆刍奂劢劬劭劾哿勐勖勰叟燮矍廴凵凼鬯厶弁畚巯坌垩垡塾墼壅壑圩圬圪圳圹圮圯坜圻坂坩垅坫垆坼坻坨坭坶坳垭垤垌垲埏垧垴垓垠埕埘埚埙埒垸埴埯埸埤埝"],["dc40","蹳蹵蹷",4,"蹽蹾躀躂躃躄躆躈",6,"躑躒躓躕",6,"躝躟",11,"躭躮躰躱躳",6,"躻",7],["dc80","軃",10,"軏",21,"堋堍埽埭堀堞堙塄堠塥塬墁墉墚墀馨鼙懿艹艽艿芏芊芨芄芎芑芗芙芫芸芾芰苈苊苣芘芷芮苋苌苁芩芴芡芪芟苄苎芤苡茉苷苤茏茇苜苴苒苘茌苻苓茑茚茆茔茕苠苕茜荑荛荜茈莒茼茴茱莛荞茯荏荇荃荟荀茗荠茭茺茳荦荥"],["dd40","軥",62],["dd80","輤",32,"荨茛荩荬荪荭荮莰荸莳莴莠莪莓莜莅荼莶莩荽莸荻莘莞莨莺莼菁萁菥菘堇萘萋菝菽菖萜萸萑萆菔菟萏萃菸菹菪菅菀萦菰菡葜葑葚葙葳蒇蒈葺蒉葸萼葆葩葶蒌蒎萱葭蓁蓍蓐蓦蒽蓓蓊蒿蒺蓠蒡蒹蒴蒗蓥蓣蔌甍蔸蓰蔹蔟蔺"],["de40","轅",32,"轪辀辌辒辝辠辡辢辤辥辦辧辪辬辭辮辯農辳辴辵辷辸辺辻込辿迀迃迆"],["de80","迉",4,"迏迒迖迗迚迠迡迣迧迬迯迱迲迴迵迶迺迻迼迾迿逇逈逌逎逓逕逘蕖蔻蓿蓼蕙蕈蕨蕤蕞蕺瞢蕃蕲蕻薤薨薇薏蕹薮薜薅薹薷薰藓藁藜藿蘧蘅蘩蘖蘼廾弈夼奁耷奕奚奘匏尢尥尬尴扌扪抟抻拊拚拗拮挢拶挹捋捃掭揶捱捺掎掴捭掬掊捩掮掼揲揸揠揿揄揞揎摒揆掾摅摁搋搛搠搌搦搡摞撄摭撖"],["df40","這逜連逤逥逧",5,"逰",4,"逷逹逺逽逿遀遃遅遆遈",4,"過達違遖遙遚遜",5,"遤遦遧適遪遫遬遯",4,"遶",6,"遾邁"],["df80","還邅邆邇邉邊邌",4,"邒邔邖邘邚邜邞邟邠邤邥邧邨邩邫邭邲邷邼邽邿郀摺撷撸撙撺擀擐擗擤擢攉攥攮弋忒甙弑卟叱叽叩叨叻吒吖吆呋呒呓呔呖呃吡呗呙吣吲咂咔呷呱呤咚咛咄呶呦咝哐咭哂咴哒咧咦哓哔呲咣哕咻咿哌哙哚哜咩咪咤哝哏哞唛哧唠哽唔哳唢唣唏唑唧唪啧喏喵啉啭啁啕唿啐唼"],["e040","郂郃郆郈郉郋郌郍郒郔郕郖郘郙郚郞郟郠郣郤郥郩郪郬郮郰郱郲郳郵郶郷郹郺郻郼郿鄀鄁鄃鄅",19,"鄚鄛鄜"],["e080","鄝鄟鄠鄡鄤",10,"鄰鄲",6,"鄺",8,"酄唷啖啵啶啷唳唰啜喋嗒喃喱喹喈喁喟啾嗖喑啻嗟喽喾喔喙嗪嗷嗉嘟嗑嗫嗬嗔嗦嗝嗄嗯嗥嗲嗳嗌嗍嗨嗵嗤辔嘞嘈嘌嘁嘤嘣嗾嘀嘧嘭噘嘹噗嘬噍噢噙噜噌噔嚆噤噱噫噻噼嚅嚓嚯囔囗囝囡囵囫囹囿圄圊圉圜帏帙帔帑帱帻帼"],["e140","酅酇酈酑酓酔酕酖酘酙酛酜酟酠酦酧酨酫酭酳酺酻酼醀",4,"醆醈醊醎醏醓",6,"醜",5,"醤",5,"醫醬醰醱醲醳醶醷醸醹醻"],["e180","醼",10,"釈釋釐釒",9,"針",8,"帷幄幔幛幞幡岌屺岍岐岖岈岘岙岑岚岜岵岢岽岬岫岱岣峁岷峄峒峤峋峥崂崃崧崦崮崤崞崆崛嵘崾崴崽嵬嵛嵯嵝嵫嵋嵊嵩嵴嶂嶙嶝豳嶷巅彳彷徂徇徉後徕徙徜徨徭徵徼衢彡犭犰犴犷犸狃狁狎狍狒狨狯狩狲狴狷猁狳猃狺"],["e240","釦",62],["e280","鈥",32,"狻猗猓猡猊猞猝猕猢猹猥猬猸猱獐獍獗獠獬獯獾舛夥飧夤夂饣饧",5,"饴饷饽馀馄馇馊馍馐馑馓馔馕庀庑庋庖庥庠庹庵庾庳赓廒廑廛廨廪膺忄忉忖忏怃忮怄忡忤忾怅怆忪忭忸怙怵怦怛怏怍怩怫怊怿怡恸恹恻恺恂"],["e340","鉆",45,"鉵",16],["e380","銆",7,"銏",24,"恪恽悖悚悭悝悃悒悌悛惬悻悱惝惘惆惚悴愠愦愕愣惴愀愎愫慊慵憬憔憧憷懔懵忝隳闩闫闱闳闵闶闼闾阃阄阆阈阊阋阌阍阏阒阕阖阗阙阚丬爿戕氵汔汜汊沣沅沐沔沌汨汩汴汶沆沩泐泔沭泷泸泱泗沲泠泖泺泫泮沱泓泯泾"],["e440","銨",5,"銯",24,"鋉",31],["e480","鋩",32,"洹洧洌浃浈洇洄洙洎洫浍洮洵洚浏浒浔洳涑浯涞涠浞涓涔浜浠浼浣渚淇淅淞渎涿淠渑淦淝淙渖涫渌涮渫湮湎湫溲湟溆湓湔渲渥湄滟溱溘滠漭滢溥溧溽溻溷滗溴滏溏滂溟潢潆潇漤漕滹漯漶潋潴漪漉漩澉澍澌潸潲潼潺濑"],["e540","錊",51,"錿",10],["e580","鍊",31,"鍫濉澧澹澶濂濡濮濞濠濯瀚瀣瀛瀹瀵灏灞宀宄宕宓宥宸甯骞搴寤寮褰寰蹇謇辶迓迕迥迮迤迩迦迳迨逅逄逋逦逑逍逖逡逵逶逭逯遄遑遒遐遨遘遢遛暹遴遽邂邈邃邋彐彗彖彘尻咫屐屙孱屣屦羼弪弩弭艴弼鬻屮妁妃妍妩妪妣"],["e640","鍬",34,"鎐",27],["e680","鎬",29,"鏋鏌鏍妗姊妫妞妤姒妲妯姗妾娅娆姝娈姣姘姹娌娉娲娴娑娣娓婀婧婊婕娼婢婵胬媪媛婷婺媾嫫媲嫒嫔媸嫠嫣嫱嫖嫦嫘嫜嬉嬗嬖嬲嬷孀尕尜孚孥孳孑孓孢驵驷驸驺驿驽骀骁骅骈骊骐骒骓骖骘骛骜骝骟骠骢骣骥骧纟纡纣纥纨纩"],["e740","鏎",7,"鏗",54],["e780","鐎",32,"纭纰纾绀绁绂绉绋绌绐绔绗绛绠绡绨绫绮绯绱绲缍绶绺绻绾缁缂缃缇缈缋缌缏缑缒缗缙缜缛缟缡",6,"缪缫缬缭缯",4,"缵幺畿巛甾邕玎玑玮玢玟珏珂珑玷玳珀珉珈珥珙顼琊珩珧珞玺珲琏琪瑛琦琥琨琰琮琬"],["e840","鐯",14,"鐿",43,"鑬鑭鑮鑯"],["e880","鑰",20,"钑钖钘铇铏铓铔铚铦铻锜锠琛琚瑁瑜瑗瑕瑙瑷瑭瑾璜璎璀璁璇璋璞璨璩璐璧瓒璺韪韫韬杌杓杞杈杩枥枇杪杳枘枧杵枨枞枭枋杷杼柰栉柘栊柩枰栌柙枵柚枳柝栀柃枸柢栎柁柽栲栳桠桡桎桢桄桤梃栝桕桦桁桧桀栾桊桉栩梵梏桴桷梓桫棂楮棼椟椠棹"],["e940","锧锳锽镃镈镋镕镚镠镮镴镵長",7,"門",42],["e980","閫",32,"椤棰椋椁楗棣椐楱椹楠楂楝榄楫榀榘楸椴槌榇榈槎榉楦楣楹榛榧榻榫榭槔榱槁槊槟榕槠榍槿樯槭樗樘橥槲橄樾檠橐橛樵檎橹樽樨橘橼檑檐檩檗檫猷獒殁殂殇殄殒殓殍殚殛殡殪轫轭轱轲轳轵轶轸轷轹轺轼轾辁辂辄辇辋"],["ea40","闌",27,"闬闿阇阓阘阛阞阠阣",6,"阫阬阭阯阰阷阸阹阺阾陁陃陊陎陏陑陒陓陖陗"],["ea80","陘陙陚陜陝陞陠陣陥陦陫陭",4,"陳陸",12,"隇隉隊辍辎辏辘辚軎戋戗戛戟戢戡戥戤戬臧瓯瓴瓿甏甑甓攴旮旯旰昊昙杲昃昕昀炅曷昝昴昱昶昵耆晟晔晁晏晖晡晗晷暄暌暧暝暾曛曜曦曩贲贳贶贻贽赀赅赆赈赉赇赍赕赙觇觊觋觌觎觏觐觑牮犟牝牦牯牾牿犄犋犍犏犒挈挲掰"],["eb40","隌階隑隒隓隕隖隚際隝",9,"隨",7,"隱隲隴隵隷隸隺隻隿雂雃雈雊雋雐雑雓雔雖",9,"雡",6,"雫"],["eb80","雬雭雮雰雱雲雴雵雸雺電雼雽雿霂霃霅霊霋霌霐霑霒霔霕霗",4,"霝霟霠搿擘耄毪毳毽毵毹氅氇氆氍氕氘氙氚氡氩氤氪氲攵敕敫牍牒牖爰虢刖肟肜肓肼朊肽肱肫肭肴肷胧胨胩胪胛胂胄胙胍胗朐胝胫胱胴胭脍脎胲胼朕脒豚脶脞脬脘脲腈腌腓腴腙腚腱腠腩腼腽腭腧塍媵膈膂膑滕膣膪臌朦臊膻"],["ec40","霡",8,"霫霬霮霯霱霳",4,"霺霻霼霽霿",18,"靔靕靗靘靚靜靝靟靣靤靦靧靨靪",7],["ec80","靲靵靷",4,"靽",7,"鞆",4,"鞌鞎鞏鞐鞓鞕鞖鞗鞙",4,"臁膦欤欷欹歃歆歙飑飒飓飕飙飚殳彀毂觳斐齑斓於旆旄旃旌旎旒旖炀炜炖炝炻烀炷炫炱烨烊焐焓焖焯焱煳煜煨煅煲煊煸煺熘熳熵熨熠燠燔燧燹爝爨灬焘煦熹戾戽扃扈扉礻祀祆祉祛祜祓祚祢祗祠祯祧祺禅禊禚禧禳忑忐"],["ed40","鞞鞟鞡鞢鞤",6,"鞬鞮鞰鞱鞳鞵",46],["ed80","韤韥韨韮",4,"韴韷",23,"怼恝恚恧恁恙恣悫愆愍慝憩憝懋懑戆肀聿沓泶淼矶矸砀砉砗砘砑斫砭砜砝砹砺砻砟砼砥砬砣砩硎硭硖硗砦硐硇硌硪碛碓碚碇碜碡碣碲碹碥磔磙磉磬磲礅磴礓礤礞礴龛黹黻黼盱眄眍盹眇眈眚眢眙眭眦眵眸睐睑睇睃睚睨"],["ee40","頏",62],["ee80","顎",32,"睢睥睿瞍睽瞀瞌瞑瞟瞠瞰瞵瞽町畀畎畋畈畛畲畹疃罘罡罟詈罨罴罱罹羁罾盍盥蠲钅钆钇钋钊钌钍钏钐钔钗钕钚钛钜钣钤钫钪钭钬钯钰钲钴钶",4,"钼钽钿铄铈",6,"铐铑铒铕铖铗铙铘铛铞铟铠铢铤铥铧铨铪"],["ef40","顯",5,"颋颎颒颕颙颣風",37,"飏飐飔飖飗飛飜飝飠",4],["ef80","飥飦飩",30,"铩铫铮铯铳铴铵铷铹铼铽铿锃锂锆锇锉锊锍锎锏锒",4,"锘锛锝锞锟锢锪锫锩锬锱锲锴锶锷锸锼锾锿镂锵镄镅镆镉镌镎镏镒镓镔镖镗镘镙镛镞镟镝镡镢镤",8,"镯镱镲镳锺矧矬雉秕秭秣秫稆嵇稃稂稞稔"],["f040","餈",4,"餎餏餑",28,"餯",26],["f080","饊",9,"饖",12,"饤饦饳饸饹饻饾馂馃馉稹稷穑黏馥穰皈皎皓皙皤瓞瓠甬鸠鸢鸨",4,"鸲鸱鸶鸸鸷鸹鸺鸾鹁鹂鹄鹆鹇鹈鹉鹋鹌鹎鹑鹕鹗鹚鹛鹜鹞鹣鹦",6,"鹱鹭鹳疒疔疖疠疝疬疣疳疴疸痄疱疰痃痂痖痍痣痨痦痤痫痧瘃痱痼痿瘐瘀瘅瘌瘗瘊瘥瘘瘕瘙"],["f140","馌馎馚",10,"馦馧馩",47],["f180","駙",32,"瘛瘼瘢瘠癀瘭瘰瘿瘵癃瘾瘳癍癞癔癜癖癫癯翊竦穸穹窀窆窈窕窦窠窬窨窭窳衤衩衲衽衿袂袢裆袷袼裉裢裎裣裥裱褚裼裨裾裰褡褙褓褛褊褴褫褶襁襦襻疋胥皲皴矜耒耔耖耜耠耢耥耦耧耩耨耱耋耵聃聆聍聒聩聱覃顸颀颃"],["f240","駺",62],["f280","騹",32,"颉颌颍颏颔颚颛颞颟颡颢颥颦虍虔虬虮虿虺虼虻蚨蚍蚋蚬蚝蚧蚣蚪蚓蚩蚶蛄蚵蛎蚰蚺蚱蚯蛉蛏蚴蛩蛱蛲蛭蛳蛐蜓蛞蛴蛟蛘蛑蜃蜇蛸蜈蜊蜍蜉蜣蜻蜞蜥蜮蜚蜾蝈蜴蜱蜩蜷蜿螂蜢蝽蝾蝻蝠蝰蝌蝮螋蝓蝣蝼蝤蝙蝥螓螯螨蟒"],["f340","驚",17,"驲骃骉骍骎骔骕骙骦骩",6,"骲骳骴骵骹骻骽骾骿髃髄髆",4,"髍髎髏髐髒體髕髖髗髙髚髛髜"],["f380","髝髞髠髢髣髤髥髧髨髩髪髬髮髰",8,"髺髼",6,"鬄鬅鬆蟆螈螅螭螗螃螫蟥螬螵螳蟋蟓螽蟑蟀蟊蟛蟪蟠蟮蠖蠓蟾蠊蠛蠡蠹蠼缶罂罄罅舐竺竽笈笃笄笕笊笫笏筇笸笪笙笮笱笠笥笤笳笾笞筘筚筅筵筌筝筠筮筻筢筲筱箐箦箧箸箬箝箨箅箪箜箢箫箴篑篁篌篝篚篥篦篪簌篾篼簏簖簋"],["f440","鬇鬉",5,"鬐鬑鬒鬔",10,"鬠鬡鬢鬤",10,"鬰鬱鬳",7,"鬽鬾鬿魀魆魊魋魌魎魐魒魓魕",5],["f480","魛",32,"簟簪簦簸籁籀臾舁舂舄臬衄舡舢舣舭舯舨舫舸舻舳舴舾艄艉艋艏艚艟艨衾袅袈裘裟襞羝羟羧羯羰羲籼敉粑粝粜粞粢粲粼粽糁糇糌糍糈糅糗糨艮暨羿翎翕翥翡翦翩翮翳糸絷綦綮繇纛麸麴赳趄趔趑趱赧赭豇豉酊酐酎酏酤"],["f540","魼",62],["f580","鮻",32,"酢酡酰酩酯酽酾酲酴酹醌醅醐醍醑醢醣醪醭醮醯醵醴醺豕鹾趸跫踅蹙蹩趵趿趼趺跄跖跗跚跞跎跏跛跆跬跷跸跣跹跻跤踉跽踔踝踟踬踮踣踯踺蹀踹踵踽踱蹉蹁蹂蹑蹒蹊蹰蹶蹼蹯蹴躅躏躔躐躜躞豸貂貊貅貘貔斛觖觞觚觜"],["f640","鯜",62],["f680","鰛",32,"觥觫觯訾謦靓雩雳雯霆霁霈霏霎霪霭霰霾龀龃龅",5,"龌黾鼋鼍隹隼隽雎雒瞿雠銎銮鋈錾鍪鏊鎏鐾鑫鱿鲂鲅鲆鲇鲈稣鲋鲎鲐鲑鲒鲔鲕鲚鲛鲞",5,"鲥",4,"鲫鲭鲮鲰",7,"鲺鲻鲼鲽鳄鳅鳆鳇鳊鳋"],["f740","鰼",62],["f780","鱻鱽鱾鲀鲃鲄鲉鲊鲌鲏鲓鲖鲗鲘鲙鲝鲪鲬鲯鲹鲾",4,"鳈鳉鳑鳒鳚鳛鳠鳡鳌",4,"鳓鳔鳕鳗鳘鳙鳜鳝鳟鳢靼鞅鞑鞒鞔鞯鞫鞣鞲鞴骱骰骷鹘骶骺骼髁髀髅髂髋髌髑魅魃魇魉魈魍魑飨餍餮饕饔髟髡髦髯髫髻髭髹鬈鬏鬓鬟鬣麽麾縻麂麇麈麋麒鏖麝麟黛黜黝黠黟黢黩黧黥黪黯鼢鼬鼯鼹鼷鼽鼾齄"],["f840","鳣",62],["f880","鴢",32],["f940","鵃",62],["f980","鶂",32],["fa40","鶣",62],["fa80","鷢",32],["fb40","鸃",27,"鸤鸧鸮鸰鸴鸻鸼鹀鹍鹐鹒鹓鹔鹖鹙鹝鹟鹠鹡鹢鹥鹮鹯鹲鹴",9,"麀"],["fb80","麁麃麄麅麆麉麊麌",5,"麔",8,"麞麠",5,"麧麨麩麪"],["fc40","麫",8,"麵麶麷麹麺麼麿",4,"黅黆黇黈黊黋黌黐黒黓黕黖黗黙黚點黡黣黤黦黨黫黬黭黮黰",8,"黺黽黿",6],["fc80","鼆",4,"鼌鼏鼑鼒鼔鼕鼖鼘鼚",5,"鼡鼣",8,"鼭鼮鼰鼱"],["fd40","鼲",4,"鼸鼺鼼鼿",4,"齅",10,"齒",38],["fd80","齹",5,"龁龂龍",11,"龜龝龞龡",4,"郎凉秊裏隣"],["fe40","兀嗀﨎﨏﨑﨓﨔礼﨟蘒﨡﨣﨤﨧﨨﨩"]]},{}],104:[function(e,t,r){t.exports=[["0","\x00",127],["8141","갂갃갅갆갋",4,"갘갞갟갡갢갣갥",6,"갮갲갳갴"],["8161","갵갶갷갺갻갽갾갿걁",9,"걌걎",5,"걕"],["8181","걖걗걙걚걛걝",18,"걲걳걵걶걹걻",4,"겂겇겈겍겎겏겑겒겓겕",6,"겞겢",5,"겫겭겮겱",6,"겺겾겿곀곂곃곅곆곇곉곊곋곍",7,"곖곘",7,"곢곣곥곦곩곫곭곮곲곴곷",4,"곾곿괁괂괃괅괇",4,"괎괐괒괓"],["8241","괔괕괖괗괙괚괛괝괞괟괡",7,"괪괫괮",5],["8261","괶괷괹괺괻괽",6,"굆굈굊",5,"굑굒굓굕굖굗"],["8281","굙",7,"굢굤",7,"굮굯굱굲굷굸굹굺굾궀궃",4,"궊궋궍궎궏궑",10,"궞",5,"궥",17,"궸",7,"귂귃귅귆귇귉",6,"귒귔",7,"귝귞귟귡귢귣귥",18],["8341","귺귻귽귾긂",5,"긊긌긎",5,"긕",7],["8361","긝",18,"긲긳긵긶긹긻긼"],["8381","긽긾긿깂깄깇깈깉깋깏깑깒깓깕깗",4,"깞깢깣깤깦깧깪깫깭깮깯깱",6,"깺깾",5,"꺆",5,"꺍",46,"꺿껁껂껃껅",6,"껎껒",5,"껚껛껝",8],["8441","껦껧껩껪껬껮",5,"껵껶껷껹껺껻껽",8],["8461","꼆꼉꼊꼋꼌꼎꼏꼑",18],["8481","꼤",7,"꼮꼯꼱꼳꼵",6,"꼾꽀꽄꽅꽆꽇꽊",5,"꽑",10,"꽞",5,"꽦",18,"꽺",5,"꾁꾂꾃꾅꾆꾇꾉",6,"꾒꾓꾔꾖",5,"꾝",26,"꾺꾻꾽꾾"],["8541","꾿꿁",5,"꿊꿌꿏",4,"꿕",6,"꿝",4],["8561","꿢",5,"꿪",5,"꿲꿳꿵꿶꿷꿹",6,"뀂뀃"],["8581","뀅",6,"뀍뀎뀏뀑뀒뀓뀕",6,"뀞",9,"뀩",26,"끆끇끉끋끍끏끐끑끒끖끘끚끛끜끞",29,"끾끿낁낂낃낅",6,"낎낐낒",5,"낛낝낞낣낤"],["8641","낥낦낧낪낰낲낶낷낹낺낻낽",6,"냆냊",5,"냒"],["8661","냓냕냖냗냙",6,"냡냢냣냤냦",10],["8681","냱",22,"넊넍넎넏넑넔넕넖넗넚넞",4,"넦넧넩넪넫넭",6,"넶넺",5,"녂녃녅녆녇녉",6,"녒녓녖녗녙녚녛녝녞녟녡",22,"녺녻녽녾녿놁놃",4,"놊놌놎놏놐놑놕놖놗놙놚놛놝"],["8741","놞",9,"놩",15],["8761","놹",18,"뇍뇎뇏뇑뇒뇓뇕"],["8781","뇖",5,"뇞뇠",7,"뇪뇫뇭뇮뇯뇱",7,"뇺뇼뇾",5,"눆눇눉눊눍",6,"눖눘눚",5,"눡",18,"눵",6,"눽",26,"뉙뉚뉛뉝뉞뉟뉡",6,"뉪",4],["8841","뉯",4,"뉶",5,"뉽",6,"늆늇늈늊",4],["8861","늏늒늓늕늖늗늛",4,"늢늤늧늨늩늫늭늮늯늱늲늳늵늶늷"],["8881","늸",15,"닊닋닍닎닏닑닓",4,"닚닜닞닟닠닡닣닧닩닪닰닱닲닶닼닽닾댂댃댅댆댇댉",6,"댒댖",5,"댝",54,"덗덙덚덝덠덡덢덣"],["8941","덦덨덪덬덭덯덲덳덵덶덷덹",6,"뎂뎆",5,"뎍"],["8961","뎎뎏뎑뎒뎓뎕",10,"뎢",5,"뎩뎪뎫뎭"],["8981","뎮",21,"돆돇돉돊돍돏돑돒돓돖돘돚돜돞돟돡돢돣돥돦돧돩",18,"돽",18,"됑",6,"됙됚됛됝됞됟됡",6,"됪됬",7,"됵",15],["8a41","둅",10,"둒둓둕둖둗둙",6,"둢둤둦"],["8a61","둧",4,"둭",18,"뒁뒂"],["8a81","뒃",4,"뒉",19,"뒞",5,"뒥뒦뒧뒩뒪뒫뒭",7,"뒶뒸뒺",5,"듁듂듃듅듆듇듉",6,"듑듒듓듔듖",5,"듞듟듡듢듥듧",4,"듮듰듲",5,"듹",26,"딖딗딙딚딝"],["8b41","딞",5,"딦딫",4,"딲딳딵딶딷딹",6,"땂땆"],["8b61","땇땈땉땊땎땏땑땒땓땕",6,"땞땢",8],["8b81","땫",52,"떢떣떥떦떧떩떬떭떮떯떲떶",4,"떾떿뗁뗂뗃뗅",6,"뗎뗒",5,"뗙",18,"뗭",18],["8c41","똀",15,"똒똓똕똖똗똙",4],["8c61","똞",6,"똦",5,"똭",6,"똵",5],["8c81","똻",12,"뙉",26,"뙥뙦뙧뙩",50,"뚞뚟뚡뚢뚣뚥",5,"뚭뚮뚯뚰뚲",16],["8d41","뛃",16,"뛕",8],["8d61","뛞",17,"뛱뛲뛳뛵뛶뛷뛹뛺"],["8d81","뛻",4,"뜂뜃뜄뜆",33,"뜪뜫뜭뜮뜱",6,"뜺뜼",7,"띅띆띇띉띊띋띍",6,"띖",9,"띡띢띣띥띦띧띩",6,"띲띴띶",5,"띾띿랁랂랃랅",6,"랎랓랔랕랚랛랝랞"],["8e41","랟랡",6,"랪랮",5,"랶랷랹",8],["8e61","럂",4,"럈럊",19],["8e81","럞",13,"럮럯럱럲럳럵",6,"럾렂",4,"렊렋렍렎렏렑",6,"렚렜렞",5,"렦렧렩렪렫렭",6,"렶렺",5,"롁롂롃롅",11,"롒롔",7,"롞롟롡롢롣롥",6,"롮롰롲",5,"롹롺롻롽",7],["8f41","뢅",7,"뢎",17],["8f61","뢠",7,"뢩",6,"뢱뢲뢳뢵뢶뢷뢹",4],["8f81","뢾뢿룂룄룆",5,"룍룎룏룑룒룓룕",7,"룞룠룢",5,"룪룫룭룮룯룱",6,"룺룼룾",5,"뤅",18,"뤙",6,"뤡",26,"뤾뤿륁륂륃륅",6,"륍륎륐륒",5],["9041","륚륛륝륞륟륡",6,"륪륬륮",5,"륶륷륹륺륻륽"],["9061","륾",5,"릆릈릋릌릏",15],["9081","릟",12,"릮릯릱릲릳릵",6,"릾맀맂",5,"맊맋맍맓",4,"맚맜맟맠맢맦맧맩맪맫맭",6,"맶맻",4,"먂",5,"먉",11,"먖",33,"먺먻먽먾먿멁멃멄멅멆"],["9141","멇멊멌멏멐멑멒멖멗멙멚멛멝",6,"멦멪",5],["9161","멲멳멵멶멷멹",9,"몆몈몉몊몋몍",5],["9181","몓",20,"몪몭몮몯몱몳",4,"몺몼몾",5,"뫅뫆뫇뫉",14,"뫚",33,"뫽뫾뫿묁묂묃묅",7,"묎묐묒",5,"묙묚묛묝묞묟묡",6],["9241","묨묪묬",7,"묷묹묺묿",4,"뭆뭈뭊뭋뭌뭎뭑뭒"],["9261","뭓뭕뭖뭗뭙",7,"뭢뭤",7,"뭭",4],["9281","뭲",21,"뮉뮊뮋뮍뮎뮏뮑",18,"뮥뮦뮧뮩뮪뮫뮭",6,"뮵뮶뮸",7,"믁믂믃믅믆믇믉",6,"믑믒믔",35,"믺믻믽믾밁"],["9341","밃",4,"밊밎밐밒밓밙밚밠밡밢밣밦밨밪밫밬밮밯밲밳밵"],["9361","밶밷밹",6,"뱂뱆뱇뱈뱊뱋뱎뱏뱑",8],["9381","뱚뱛뱜뱞",37,"벆벇벉벊벍벏",4,"벖벘벛",4,"벢벣벥벦벩",6,"벲벶",5,"벾벿볁볂볃볅",7,"볎볒볓볔볖볗볙볚볛볝",22,"볷볹볺볻볽"],["9441","볾",5,"봆봈봊",5,"봑봒봓봕",8],["9461","봞",5,"봥",6,"봭",12],["9481","봺",5,"뵁",6,"뵊뵋뵍뵎뵏뵑",6,"뵚",9,"뵥뵦뵧뵩",22,"붂붃붅붆붋",4,"붒붔붖붗붘붛붝",6,"붥",10,"붱",6,"붹",24],["9541","뷒뷓뷖뷗뷙뷚뷛뷝",11,"뷪",5,"뷱"],["9561","뷲뷳뷵뷶뷷뷹",6,"븁븂븄븆",5,"븎븏븑븒븓"],["9581","븕",6,"븞븠",35,"빆빇빉빊빋빍빏",4,"빖빘빜빝빞빟빢빣빥빦빧빩빫",4,"빲빶",4,"빾빿뺁뺂뺃뺅",6,"뺎뺒",5,"뺚",13,"뺩",14],["9641","뺸",23,"뻒뻓"],["9661","뻕뻖뻙",6,"뻡뻢뻦",5,"뻭",8],["9681","뻶",10,"뼂",5,"뼊",13,"뼚뼞",33,"뽂뽃뽅뽆뽇뽉",6,"뽒뽓뽔뽖",44],["9741","뾃",16,"뾕",8],["9761","뾞",17,"뾱",7],["9781","뾹",11,"뿆",5,"뿎뿏뿑뿒뿓뿕",6,"뿝뿞뿠뿢",89,"쀽쀾쀿"],["9841","쁀",16,"쁒",5,"쁙쁚쁛"],["9861","쁝쁞쁟쁡",6,"쁪",15],["9881","쁺",21,"삒삓삕삖삗삙",6,"삢삤삦",5,"삮삱삲삷",4,"삾샂샃샄샆샇샊샋샍샎샏샑",6,"샚샞",5,"샦샧샩샪샫샭",6,"샶샸샺",5,"섁섂섃섅섆섇섉",6,"섑섒섓섔섖",5,"섡섢섥섨섩섪섫섮"],["9941","섲섳섴섵섷섺섻섽섾섿셁",6,"셊셎",5,"셖셗"],["9961","셙셚셛셝",6,"셦셪",5,"셱셲셳셵셶셷셹셺셻"],["9981","셼",8,"솆",5,"솏솑솒솓솕솗",4,"솞솠솢솣솤솦솧솪솫솭솮솯솱",11,"솾",5,"쇅쇆쇇쇉쇊쇋쇍",6,"쇕쇖쇙",6,"쇡쇢쇣쇥쇦쇧쇩",6,"쇲쇴",7,"쇾쇿숁숂숃숅",6,"숎숐숒",5,"숚숛숝숞숡숢숣"],["9a41","숤숥숦숧숪숬숮숰숳숵",16],["9a61","쉆쉇쉉",6,"쉒쉓쉕쉖쉗쉙",6,"쉡쉢쉣쉤쉦"],["9a81","쉧",4,"쉮쉯쉱쉲쉳쉵",6,"쉾슀슂",5,"슊",5,"슑",6,"슙슚슜슞",5,"슦슧슩슪슫슮",5,"슶슸슺",33,"싞싟싡싢싥",5,"싮싰싲싳싴싵싷싺싽싾싿쌁",6,"쌊쌋쌎쌏"],["9b41","쌐쌑쌒쌖쌗쌙쌚쌛쌝",6,"쌦쌧쌪",8],["9b61","쌳",17,"썆",7],["9b81","썎",25,"썪썫썭썮썯썱썳",4,"썺썻썾",5,"쎅쎆쎇쎉쎊쎋쎍",50,"쏁",22,"쏚"],["9c41","쏛쏝쏞쏡쏣",4,"쏪쏫쏬쏮",5,"쏶쏷쏹",5],["9c61","쏿",8,"쐉",6,"쐑",9],["9c81","쐛",8,"쐥",6,"쐭쐮쐯쐱쐲쐳쐵",6,"쐾",9,"쑉",26,"쑦쑧쑩쑪쑫쑭",6,"쑶쑷쑸쑺",5,"쒁",18,"쒕",6,"쒝",12],["9d41","쒪",13,"쒹쒺쒻쒽",8],["9d61","쓆",25],["9d81","쓠",8,"쓪",5,"쓲쓳쓵쓶쓷쓹쓻쓼쓽쓾씂",9,"씍씎씏씑씒씓씕",6,"씝",10,"씪씫씭씮씯씱",6,"씺씼씾",5,"앆앇앋앏앐앑앒앖앚앛앜앟앢앣앥앦앧앩",6,"앲앶",5,"앾앿얁얂얃얅얆얈얉얊얋얎얐얒얓얔"],["9e41","얖얙얚얛얝얞얟얡",7,"얪",9,"얶"],["9e61","얷얺얿",4,"엋엍엏엒엓엕엖엗엙",6,"엢엤엦엧"],["9e81","엨엩엪엫엯엱엲엳엵엸엹엺엻옂옃옄옉옊옋옍옎옏옑",6,"옚옝",6,"옦옧옩옪옫옯옱옲옶옸옺옼옽옾옿왂왃왅왆왇왉",6,"왒왖",5,"왞왟왡",10,"왭왮왰왲",5,"왺왻왽왾왿욁",6,"욊욌욎",5,"욖욗욙욚욛욝",6,"욦"],["9f41","욨욪",5,"욲욳욵욶욷욻",4,"웂웄웆",5,"웎"],["9f61","웏웑웒웓웕",6,"웞웟웢",5,"웪웫웭웮웯웱웲"],["9f81","웳",4,"웺웻웼웾",5,"윆윇윉윊윋윍",6,"윖윘윚",5,"윢윣윥윦윧윩",6,"윲윴윶윸윹윺윻윾윿읁읂읃읅",4,"읋읎읐읙읚읛읝읞읟읡",6,"읩읪읬",7,"읶읷읹읺읻읿잀잁잂잆잋잌잍잏잒잓잕잙잛",4,"잢잧",4,"잮잯잱잲잳잵잶잷"],["a041","잸잹잺잻잾쟂",5,"쟊쟋쟍쟏쟑",6,"쟙쟚쟛쟜"],["a061","쟞",5,"쟥쟦쟧쟩쟪쟫쟭",13],["a081","쟻",4,"젂젃젅젆젇젉젋",4,"젒젔젗",4,"젞젟젡젢젣젥",6,"젮젰젲",5,"젹젺젻젽젾젿졁",6,"졊졋졎",5,"졕",26,"졲졳졵졶졷졹졻",4,"좂좄좈좉좊좎",5,"좕",7,"좞좠좢좣좤"],["a141","좥좦좧좩",18,"좾좿죀죁"],["a161","죂죃죅죆죇죉죊죋죍",6,"죖죘죚",5,"죢죣죥"],["a181","죦",14,"죶",5,"죾죿줁줂줃줇",4,"줎　、。·‥…¨〃­―∥＼∼‘’“”〔〕〈",9,"±×÷≠≤≥∞∴°′″℃Å￠￡￥♂♀∠⊥⌒∂∇≡≒§※☆★○●◎◇◆□■△▲▽▼→←↑↓↔〓≪≫√∽∝∵∫∬∈∋⊆⊇⊂⊃∪∩∧∨￢"],["a241","줐줒",5,"줙",18],["a261","줭",6,"줵",18],["a281","쥈",7,"쥒쥓쥕쥖쥗쥙",6,"쥢쥤",7,"쥭쥮쥯⇒⇔∀∃´～ˇ˘˝˚˙¸˛¡¿ː∮∑∏¤℉‰◁◀▷▶♤♠♡♥♧♣⊙◈▣◐◑▒▤▥▨▧▦▩♨☏☎☜☞¶†‡↕↗↙↖↘♭♩♪♬㉿㈜№㏇™㏂㏘℡€®"],["a341","쥱쥲쥳쥵",6,"쥽",10,"즊즋즍즎즏"],["a361","즑",6,"즚즜즞",16],["a381","즯",16,"짂짃짅짆짉짋",4,"짒짔짗짘짛！",58,"￦］",32,"￣"],["a441","짞짟짡짣짥짦짨짩짪짫짮짲",5,"짺짻짽짾짿쨁쨂쨃쨄"],["a461","쨅쨆쨇쨊쨎",5,"쨕쨖쨗쨙",12],["a481","쨦쨧쨨쨪",28,"ㄱ",93],["a541","쩇",4,"쩎쩏쩑쩒쩓쩕",6,"쩞쩢",5,"쩩쩪"],["a561","쩫",17,"쩾",5,"쪅쪆"],["a581","쪇",16,"쪙",14,"ⅰ",9],["a5b0","Ⅰ",9],["a5c1","Α",16,"Σ",6],["a5e1","α",16,"σ",6],["a641","쪨",19,"쪾쪿쫁쫂쫃쫅"],["a661","쫆",5,"쫎쫐쫒쫔쫕쫖쫗쫚",5,"쫡",6],["a681","쫨쫩쫪쫫쫭",6,"쫵",18,"쬉쬊─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂┒┑┚┙┖┕┎┍┞┟┡┢┦┧┩┪┭┮┱┲┵┶┹┺┽┾╀╁╃",7],["a741","쬋",4,"쬑쬒쬓쬕쬖쬗쬙",6,"쬢",7],["a761","쬪",22,"쭂쭃쭄"],["a781","쭅쭆쭇쭊쭋쭍쭎쭏쭑",6,"쭚쭛쭜쭞",5,"쭥",7,"㎕㎖㎗ℓ㎘㏄㎣㎤㎥㎦㎙",9,"㏊㎍㎎㎏㏏㎈㎉㏈㎧㎨㎰",9,"㎀",4,"㎺",5,"㎐",4,"Ω㏀㏁㎊㎋㎌㏖㏅㎭㎮㎯㏛㎩㎪㎫㎬㏝㏐㏓㏃㏉㏜㏆"],["a841","쭭",10,"쭺",14],["a861","쮉",18,"쮝",6],["a881","쮤",19,"쮹",11,"ÆÐªĦ"],["a8a6","Ĳ"],["a8a8","ĿŁØŒºÞŦŊ"],["a8b1","㉠",27,"ⓐ",25,"①",14,"½⅓⅔¼¾⅛⅜⅝⅞"],["a941","쯅",14,"쯕",10],["a961","쯠쯡쯢쯣쯥쯦쯨쯪",18],["a981","쯽",14,"찎찏찑찒찓찕",6,"찞찟찠찣찤æđðħıĳĸŀłøœßþŧŋŉ㈀",27,"⒜",25,"⑴",14,"¹²³⁴ⁿ₁₂₃₄"],["aa41","찥찦찪찫찭찯찱",6,"찺찿",4,"챆챇챉챊챋챍챎"],["aa61","챏",4,"챖챚",5,"챡챢챣챥챧챩",6,"챱챲"],["aa81","챳챴챶",29,"ぁ",82],["ab41","첔첕첖첗첚첛첝첞첟첡",6,"첪첮",5,"첶첷첹"],["ab61","첺첻첽",6,"쳆쳈쳊",5,"쳑쳒쳓쳕",5],["ab81","쳛",8,"쳥",6,"쳭쳮쳯쳱",12,"ァ",85],["ac41","쳾쳿촀촂",5,"촊촋촍촎촏촑",6,"촚촜촞촟촠"],["ac61","촡촢촣촥촦촧촩촪촫촭",11,"촺",4],["ac81","촿",28,"쵝쵞쵟А",5,"ЁЖ",25],["acd1","а",5,"ёж",25],["ad41","쵡쵢쵣쵥",6,"쵮쵰쵲",5,"쵹",7],["ad61","춁",6,"춉",10,"춖춗춙춚춛춝춞춟"],["ad81","춠춡춢춣춦춨춪",5,"춱",18,"췅"],["ae41","췆",5,"췍췎췏췑",16],["ae61","췢",5,"췩췪췫췭췮췯췱",6,"췺췼췾",4],["ae81","츃츅츆츇츉츊츋츍",6,"츕츖츗츘츚",5,"츢츣츥츦츧츩츪츫"],["af41","츬츭츮츯츲츴츶",19],["af61","칊",13,"칚칛칝칞칢",5,"칪칬"],["af81","칮",5,"칶칷칹칺칻칽",6,"캆캈캊",5,"캒캓캕캖캗캙"],["b041","캚",5,"캢캦",5,"캮",12],["b061","캻",5,"컂",19],["b081","컖",13,"컦컧컩컪컭",6,"컶컺",5,"가각간갇갈갉갊감",7,"같",4,"갠갤갬갭갯갰갱갸갹갼걀걋걍걔걘걜거걱건걷걸걺검겁것겄겅겆겉겊겋게겐겔겜겝겟겠겡겨격겪견겯결겸겹겻겼경곁계곈곌곕곗고곡곤곧골곪곬곯곰곱곳공곶과곽관괄괆"],["b141","켂켃켅켆켇켉",6,"켒켔켖",5,"켝켞켟켡켢켣"],["b161","켥",6,"켮켲",5,"켹",11],["b181","콅",14,"콖콗콙콚콛콝",6,"콦콨콪콫콬괌괍괏광괘괜괠괩괬괭괴괵괸괼굄굅굇굉교굔굘굡굣구국군굳굴굵굶굻굼굽굿궁궂궈궉권궐궜궝궤궷귀귁귄귈귐귑귓규균귤그극근귿글긁금급긋긍긔기긱긴긷길긺김깁깃깅깆깊까깍깎깐깔깖깜깝깟깠깡깥깨깩깬깰깸"],["b241","콭콮콯콲콳콵콶콷콹",6,"쾁쾂쾃쾄쾆",5,"쾍"],["b261","쾎",18,"쾢",5,"쾩"],["b281","쾪",5,"쾱",18,"쿅",6,"깹깻깼깽꺄꺅꺌꺼꺽꺾껀껄껌껍껏껐껑께껙껜껨껫껭껴껸껼꼇꼈꼍꼐꼬꼭꼰꼲꼴꼼꼽꼿꽁꽂꽃꽈꽉꽐꽜꽝꽤꽥꽹꾀꾄꾈꾐꾑꾕꾜꾸꾹꾼꿀꿇꿈꿉꿋꿍꿎꿔꿜꿨꿩꿰꿱꿴꿸뀀뀁뀄뀌뀐뀔뀜뀝뀨끄끅끈끊끌끎끓끔끕끗끙"],["b341","쿌",19,"쿢쿣쿥쿦쿧쿩"],["b361","쿪",5,"쿲쿴쿶",5,"쿽쿾쿿퀁퀂퀃퀅",5],["b381","퀋",5,"퀒",5,"퀙",19,"끝끼끽낀낄낌낍낏낑나낙낚난낟날낡낢남납낫",4,"낱낳내낵낸낼냄냅냇냈냉냐냑냔냘냠냥너넉넋넌널넒넓넘넙넛넜넝넣네넥넨넬넴넵넷넸넹녀녁년녈념녑녔녕녘녜녠노녹논놀놂놈놉놋농높놓놔놘놜놨뇌뇐뇔뇜뇝"],["b441","퀮",5,"퀶퀷퀹퀺퀻퀽",6,"큆큈큊",5],["b461","큑큒큓큕큖큗큙",6,"큡",10,"큮큯"],["b481","큱큲큳큵",6,"큾큿킀킂",18,"뇟뇨뇩뇬뇰뇹뇻뇽누눅눈눋눌눔눕눗눙눠눴눼뉘뉜뉠뉨뉩뉴뉵뉼늄늅늉느늑는늘늙늚늠늡늣능늦늪늬늰늴니닉닌닐닒님닙닛닝닢다닥닦단닫",4,"닳담답닷",4,"닿대댁댄댈댐댑댓댔댕댜더덕덖던덛덜덞덟덤덥"],["b541","킕",14,"킦킧킩킪킫킭",5],["b561","킳킶킸킺",5,"탂탃탅탆탇탊",5,"탒탖",4],["b581","탛탞탟탡탢탣탥",6,"탮탲",5,"탹",11,"덧덩덫덮데덱덴델뎀뎁뎃뎄뎅뎌뎐뎔뎠뎡뎨뎬도독돈돋돌돎돐돔돕돗동돛돝돠돤돨돼됐되된될됨됩됫됴두둑둔둘둠둡둣둥둬뒀뒈뒝뒤뒨뒬뒵뒷뒹듀듄듈듐듕드득든듣들듦듬듭듯등듸디딕딘딛딜딤딥딧딨딩딪따딱딴딸"],["b641","턅",7,"턎",17],["b661","턠",15,"턲턳턵턶턷턹턻턼턽턾"],["b681","턿텂텆",5,"텎텏텑텒텓텕",6,"텞텠텢",5,"텩텪텫텭땀땁땃땄땅땋때땍땐땔땜땝땟땠땡떠떡떤떨떪떫떰떱떳떴떵떻떼떽뗀뗄뗌뗍뗏뗐뗑뗘뗬또똑똔똘똥똬똴뙈뙤뙨뚜뚝뚠뚤뚫뚬뚱뛔뛰뛴뛸뜀뜁뜅뜨뜩뜬뜯뜰뜸뜹뜻띄띈띌띔띕띠띤띨띰띱띳띵라락란랄람랍랏랐랑랒랖랗"],["b741","텮",13,"텽",6,"톅톆톇톉톊"],["b761","톋",20,"톢톣톥톦톧"],["b781","톩",6,"톲톴톶톷톸톹톻톽톾톿퇁",14,"래랙랜랠램랩랫랬랭랴략랸럇량러럭런럴럼럽럿렀렁렇레렉렌렐렘렙렛렝려력련렬렴렵렷렸령례롄롑롓로록론롤롬롭롯롱롸롼뢍뢨뢰뢴뢸룀룁룃룅료룐룔룝룟룡루룩룬룰룸룹룻룽뤄뤘뤠뤼뤽륀륄륌륏륑류륙륜률륨륩"],["b841","퇐",7,"퇙",17],["b861","퇫",8,"퇵퇶퇷퇹",13],["b881","툈툊",5,"툑",24,"륫륭르륵른를름릅릇릉릊릍릎리릭린릴림립릿링마막만많",4,"맘맙맛망맞맡맣매맥맨맬맴맵맷맸맹맺먀먁먈먕머먹먼멀멂멈멉멋멍멎멓메멕멘멜멤멥멧멨멩며멱면멸몃몄명몇몌모목몫몬몰몲몸몹못몽뫄뫈뫘뫙뫼"],["b941","툪툫툮툯툱툲툳툵",6,"툾퉀퉂",5,"퉉퉊퉋퉌"],["b961","퉍",14,"퉝",6,"퉥퉦퉧퉨"],["b981","퉩",22,"튂튃튅튆튇튉튊튋튌묀묄묍묏묑묘묜묠묩묫무묵묶문묻물묽묾뭄뭅뭇뭉뭍뭏뭐뭔뭘뭡뭣뭬뮈뮌뮐뮤뮨뮬뮴뮷므믄믈믐믓미믹민믿밀밂밈밉밋밌밍및밑바",4,"받",4,"밤밥밧방밭배백밴밸뱀뱁뱃뱄뱅뱉뱌뱍뱐뱝버벅번벋벌벎범법벗"],["ba41","튍튎튏튒튓튔튖",5,"튝튞튟튡튢튣튥",6,"튭"],["ba61","튮튯튰튲",5,"튺튻튽튾틁틃",4,"틊틌",5],["ba81","틒틓틕틖틗틙틚틛틝",6,"틦",9,"틲틳틵틶틷틹틺벙벚베벡벤벧벨벰벱벳벴벵벼벽변별볍볏볐병볕볘볜보복볶본볼봄봅봇봉봐봔봤봬뵀뵈뵉뵌뵐뵘뵙뵤뵨부북분붇불붉붊붐붑붓붕붙붚붜붤붰붸뷔뷕뷘뷜뷩뷰뷴뷸븀븃븅브븍븐블븜븝븟비빅빈빌빎빔빕빗빙빚빛빠빡빤"],["bb41","틻",4,"팂팄팆",5,"팏팑팒팓팕팗",4,"팞팢팣"],["bb61","팤팦팧팪팫팭팮팯팱",6,"팺팾",5,"퍆퍇퍈퍉"],["bb81","퍊",31,"빨빪빰빱빳빴빵빻빼빽뺀뺄뺌뺍뺏뺐뺑뺘뺙뺨뻐뻑뻔뻗뻘뻠뻣뻤뻥뻬뼁뼈뼉뼘뼙뼛뼜뼝뽀뽁뽄뽈뽐뽑뽕뾔뾰뿅뿌뿍뿐뿔뿜뿟뿡쀼쁑쁘쁜쁠쁨쁩삐삑삔삘삠삡삣삥사삭삯산삳살삵삶삼삽삿샀상샅새색샌샐샘샙샛샜생샤"],["bc41","퍪",17,"퍾퍿펁펂펃펅펆펇"],["bc61","펈펉펊펋펎펒",5,"펚펛펝펞펟펡",6,"펪펬펮"],["bc81","펯",4,"펵펶펷펹펺펻펽",6,"폆폇폊",5,"폑",5,"샥샨샬샴샵샷샹섀섄섈섐섕서",4,"섣설섦섧섬섭섯섰성섶세섹센셀셈셉셋셌셍셔셕션셜셤셥셧셨셩셰셴셸솅소속솎손솔솖솜솝솟송솥솨솩솬솰솽쇄쇈쇌쇔쇗쇘쇠쇤쇨쇰쇱쇳쇼쇽숀숄숌숍숏숑수숙순숟술숨숩숫숭"],["bd41","폗폙",7,"폢폤",7,"폮폯폱폲폳폵폶폷"],["bd61","폸폹폺폻폾퐀퐂",5,"퐉",13],["bd81","퐗",5,"퐞",25,"숯숱숲숴쉈쉐쉑쉔쉘쉠쉥쉬쉭쉰쉴쉼쉽쉿슁슈슉슐슘슛슝스슥슨슬슭슴습슷승시식신싣실싫심십싯싱싶싸싹싻싼쌀쌈쌉쌌쌍쌓쌔쌕쌘쌜쌤쌥쌨쌩썅써썩썬썰썲썸썹썼썽쎄쎈쎌쏀쏘쏙쏜쏟쏠쏢쏨쏩쏭쏴쏵쏸쐈쐐쐤쐬쐰"],["be41","퐸",7,"푁푂푃푅",14],["be61","푔",7,"푝푞푟푡푢푣푥",7,"푮푰푱푲"],["be81","푳",4,"푺푻푽푾풁풃",4,"풊풌풎",5,"풕",8,"쐴쐼쐽쑈쑤쑥쑨쑬쑴쑵쑹쒀쒔쒜쒸쒼쓩쓰쓱쓴쓸쓺쓿씀씁씌씐씔씜씨씩씬씰씸씹씻씽아악안앉않알앍앎앓암압앗았앙앝앞애액앤앨앰앱앳앴앵야약얀얄얇얌얍얏양얕얗얘얜얠얩어억언얹얻얼얽얾엄",6,"엌엎"],["bf41","풞",10,"풪",14],["bf61","풹",18,"퓍퓎퓏퓑퓒퓓퓕"],["bf81","퓖",5,"퓝퓞퓠",7,"퓩퓪퓫퓭퓮퓯퓱",6,"퓹퓺퓼에엑엔엘엠엡엣엥여역엮연열엶엷염",5,"옅옆옇예옌옐옘옙옛옜오옥온올옭옮옰옳옴옵옷옹옻와왁완왈왐왑왓왔왕왜왝왠왬왯왱외왹왼욀욈욉욋욍요욕욘욜욤욥욧용우욱운울욹욺움웁웃웅워웍원월웜웝웠웡웨"],["c041","퓾",5,"픅픆픇픉픊픋픍",6,"픖픘",5],["c061","픞",25],["c081","픸픹픺픻픾픿핁핂핃핅",6,"핎핐핒",5,"핚핛핝핞핟핡핢핣웩웬웰웸웹웽위윅윈윌윔윕윗윙유육윤율윰윱윳융윷으윽은을읊음읍읏응",7,"읜읠읨읫이익인일읽읾잃임입잇있잉잊잎자작잔잖잗잘잚잠잡잣잤장잦재잭잰잴잼잽잿쟀쟁쟈쟉쟌쟎쟐쟘쟝쟤쟨쟬저적전절젊"],["c141","핤핦핧핪핬핮",5,"핶핷핹핺핻핽",6,"햆햊햋"],["c161","햌햍햎햏햑",19,"햦햧"],["c181","햨",31,"점접젓정젖제젝젠젤젬젭젯젱져젼졀졈졉졌졍졔조족존졸졺좀좁좃종좆좇좋좌좍좔좝좟좡좨좼좽죄죈죌죔죕죗죙죠죡죤죵주죽준줄줅줆줌줍줏중줘줬줴쥐쥑쥔쥘쥠쥡쥣쥬쥰쥴쥼즈즉즌즐즘즙즛증지직진짇질짊짐집짓"],["c241","헊헋헍헎헏헑헓",4,"헚헜헞",5,"헦헧헩헪헫헭헮"],["c261","헯",4,"헶헸헺",5,"혂혃혅혆혇혉",6,"혒"],["c281","혖",5,"혝혞혟혡혢혣혥",7,"혮",9,"혺혻징짖짙짚짜짝짠짢짤짧짬짭짯짰짱째짹짼쨀쨈쨉쨋쨌쨍쨔쨘쨩쩌쩍쩐쩔쩜쩝쩟쩠쩡쩨쩽쪄쪘쪼쪽쫀쫄쫌쫍쫏쫑쫓쫘쫙쫠쫬쫴쬈쬐쬔쬘쬠쬡쭁쭈쭉쭌쭐쭘쭙쭝쭤쭸쭹쮜쮸쯔쯤쯧쯩찌찍찐찔찜찝찡찢찧차착찬찮찰참찹찻"],["c341","혽혾혿홁홂홃홄홆홇홊홌홎홏홐홒홓홖홗홙홚홛홝",4],["c361","홢",4,"홨홪",5,"홲홳홵",11],["c381","횁횂횄횆",5,"횎횏횑횒횓횕",7,"횞횠횢",5,"횩횪찼창찾채책챈챌챔챕챗챘챙챠챤챦챨챰챵처척천철첨첩첫첬청체첵첸첼쳄쳅쳇쳉쳐쳔쳤쳬쳰촁초촉촌촐촘촙촛총촤촨촬촹최쵠쵤쵬쵭쵯쵱쵸춈추축춘출춤춥춧충춰췄췌췐취췬췰췸췹췻췽츄츈츌츔츙츠측츤츨츰츱츳층"],["c441","횫횭횮횯횱",7,"횺횼",7,"훆훇훉훊훋"],["c461","훍훎훏훐훒훓훕훖훘훚",5,"훡훢훣훥훦훧훩",4],["c481","훮훯훱훲훳훴훶",5,"훾훿휁휂휃휅",11,"휒휓휔치칙친칟칠칡침칩칫칭카칵칸칼캄캅캇캉캐캑캔캘캠캡캣캤캥캬캭컁커컥컨컫컬컴컵컷컸컹케켁켄켈켐켑켓켕켜켠켤켬켭켯켰켱켸코콕콘콜콤콥콧콩콰콱콴콸쾀쾅쾌쾡쾨쾰쿄쿠쿡쿤쿨쿰쿱쿳쿵쿼퀀퀄퀑퀘퀭퀴퀵퀸퀼"],["c541","휕휖휗휚휛휝휞휟휡",6,"휪휬휮",5,"휶휷휹"],["c561","휺휻휽",6,"흅흆흈흊",5,"흒흓흕흚",4],["c581","흟흢흤흦흧흨흪흫흭흮흯흱흲흳흵",6,"흾흿힀힂",5,"힊힋큄큅큇큉큐큔큘큠크큭큰클큼큽킁키킥킨킬킴킵킷킹타탁탄탈탉탐탑탓탔탕태택탠탤탬탭탯탰탱탸턍터턱턴털턺텀텁텃텄텅테텍텐텔템텝텟텡텨텬텼톄톈토톡톤톨톰톱톳통톺톼퇀퇘퇴퇸툇툉툐투툭툰툴툼툽툿퉁퉈퉜"],["c641","힍힎힏힑",6,"힚힜힞",5],["c6a1","퉤튀튁튄튈튐튑튕튜튠튤튬튱트특튼튿틀틂틈틉틋틔틘틜틤틥티틱틴틸팀팁팃팅파팍팎판팔팖팜팝팟팠팡팥패팩팬팰팸팹팻팼팽퍄퍅퍼퍽펀펄펌펍펏펐펑페펙펜펠펨펩펫펭펴편펼폄폅폈평폐폘폡폣포폭폰폴폼폽폿퐁"],["c7a1","퐈퐝푀푄표푠푤푭푯푸푹푼푿풀풂품풉풋풍풔풩퓌퓐퓔퓜퓟퓨퓬퓰퓸퓻퓽프픈플픔픕픗피픽핀필핌핍핏핑하학한할핥함합핫항해핵핸핼햄햅햇했행햐향허헉헌헐헒험헙헛헝헤헥헨헬헴헵헷헹혀혁현혈혐협혓혔형혜혠"],["c8a1","혤혭호혹혼홀홅홈홉홋홍홑화확환활홧황홰홱홴횃횅회획횐횔횝횟횡효횬횰횹횻후훅훈훌훑훔훗훙훠훤훨훰훵훼훽휀휄휑휘휙휜휠휨휩휫휭휴휵휸휼흄흇흉흐흑흔흖흗흘흙흠흡흣흥흩희흰흴흼흽힁히힉힌힐힘힙힛힝"],["caa1","伽佳假價加可呵哥嘉嫁家暇架枷柯歌珂痂稼苛茄街袈訶賈跏軻迦駕刻却各恪慤殼珏脚覺角閣侃刊墾奸姦干幹懇揀杆柬桿澗癎看磵稈竿簡肝艮艱諫間乫喝曷渴碣竭葛褐蝎鞨勘坎堪嵌感憾戡敢柑橄減甘疳監瞰紺邯鑑鑒龕"],["cba1","匣岬甲胛鉀閘剛堈姜岡崗康强彊慷江畺疆糠絳綱羌腔舡薑襁講鋼降鱇介价個凱塏愷愾慨改槪漑疥皆盖箇芥蓋豈鎧開喀客坑更粳羹醵倨去居巨拒据據擧渠炬祛距踞車遽鉅鋸乾件健巾建愆楗腱虔蹇鍵騫乞傑杰桀儉劍劒檢"],["cca1","瞼鈐黔劫怯迲偈憩揭擊格檄激膈覡隔堅牽犬甄絹繭肩見譴遣鵑抉決潔結缺訣兼慊箝謙鉗鎌京俓倞傾儆勁勍卿坰境庚徑慶憬擎敬景暻更梗涇炅烱璟璥瓊痙硬磬竟競絅經耕耿脛莖警輕逕鏡頃頸驚鯨係啓堺契季屆悸戒桂械"],["cda1","棨溪界癸磎稽系繫繼計誡谿階鷄古叩告呱固姑孤尻庫拷攷故敲暠枯槁沽痼皐睾稿羔考股膏苦苽菰藁蠱袴誥賈辜錮雇顧高鼓哭斛曲梏穀谷鵠困坤崑昆梱棍滾琨袞鯤汨滑骨供公共功孔工恐恭拱控攻珙空蚣貢鞏串寡戈果瓜"],["cea1","科菓誇課跨過鍋顆廓槨藿郭串冠官寬慣棺款灌琯瓘管罐菅觀貫關館刮恝括适侊光匡壙廣曠洸炚狂珖筐胱鑛卦掛罫乖傀塊壞怪愧拐槐魁宏紘肱轟交僑咬喬嬌嶠巧攪敎校橋狡皎矯絞翹膠蕎蛟較轎郊餃驕鮫丘久九仇俱具勾"],["cfa1","區口句咎嘔坵垢寇嶇廐懼拘救枸柩構歐毆毬求溝灸狗玖球瞿矩究絿耉臼舅舊苟衢謳購軀逑邱鉤銶駒驅鳩鷗龜國局菊鞠鞫麴君窘群裙軍郡堀屈掘窟宮弓穹窮芎躬倦券勸卷圈拳捲權淃眷厥獗蕨蹶闕机櫃潰詭軌饋句晷歸貴"],["d0a1","鬼龜叫圭奎揆槻珪硅窺竅糾葵規赳逵閨勻均畇筠菌鈞龜橘克剋劇戟棘極隙僅劤勤懃斤根槿瑾筋芹菫覲謹近饉契今妗擒昑檎琴禁禽芩衾衿襟金錦伋及急扱汲級給亘兢矜肯企伎其冀嗜器圻基埼夔奇妓寄岐崎己幾忌技旗旣"],["d1a1","朞期杞棋棄機欺氣汽沂淇玘琦琪璂璣畸畿碁磯祁祇祈祺箕紀綺羈耆耭肌記譏豈起錡錤飢饑騎騏驥麒緊佶吉拮桔金喫儺喇奈娜懦懶拏拿癩",5,"那樂",4,"諾酪駱亂卵暖欄煖爛蘭難鸞捏捺南嵐枏楠湳濫男藍襤拉"],["d2a1","納臘蠟衲囊娘廊",4,"乃來內奈柰耐冷女年撚秊念恬拈捻寧寗努勞奴弩怒擄櫓爐瑙盧",5,"駑魯",10,"濃籠聾膿農惱牢磊腦賂雷尿壘",7,"嫩訥杻紐勒",5,"能菱陵尼泥匿溺多茶"],["d3a1","丹亶但單團壇彖斷旦檀段湍短端簞緞蛋袒鄲鍛撻澾獺疸達啖坍憺擔曇淡湛潭澹痰聃膽蕁覃談譚錟沓畓答踏遝唐堂塘幢戇撞棠當糖螳黨代垈坮大對岱帶待戴擡玳臺袋貸隊黛宅德悳倒刀到圖堵塗導屠島嶋度徒悼挑掉搗桃"],["d4a1","棹櫂淘渡滔濤燾盜睹禱稻萄覩賭跳蹈逃途道都鍍陶韜毒瀆牘犢獨督禿篤纛讀墩惇敦旽暾沌焞燉豚頓乭突仝冬凍動同憧東桐棟洞潼疼瞳童胴董銅兜斗杜枓痘竇荳讀豆逗頭屯臀芚遁遯鈍得嶝橙燈登等藤謄鄧騰喇懶拏癩羅"],["d5a1","蘿螺裸邏樂洛烙珞絡落諾酪駱丹亂卵欄欒瀾爛蘭鸞剌辣嵐擥攬欖濫籃纜藍襤覽拉臘蠟廊朗浪狼琅瑯螂郞來崍徠萊冷掠略亮倆兩凉梁樑粮粱糧良諒輛量侶儷勵呂廬慮戾旅櫚濾礪藜蠣閭驢驪麗黎力曆歷瀝礫轢靂憐戀攣漣"],["d6a1","煉璉練聯蓮輦連鍊冽列劣洌烈裂廉斂殮濂簾獵令伶囹寧岺嶺怜玲笭羚翎聆逞鈴零靈領齡例澧禮醴隷勞怒撈擄櫓潞瀘爐盧老蘆虜路輅露魯鷺鹵碌祿綠菉錄鹿麓論壟弄朧瀧瓏籠聾儡瀨牢磊賂賚賴雷了僚寮廖料燎療瞭聊蓼"],["d7a1","遼鬧龍壘婁屢樓淚漏瘻累縷蔞褸鏤陋劉旒柳榴流溜瀏琉瑠留瘤硫謬類六戮陸侖倫崙淪綸輪律慄栗率隆勒肋凜凌楞稜綾菱陵俚利厘吏唎履悧李梨浬犁狸理璃異痢籬罹羸莉裏裡里釐離鯉吝潾燐璘藺躪隣鱗麟林淋琳臨霖砬"],["d8a1","立笠粒摩瑪痲碼磨馬魔麻寞幕漠膜莫邈万卍娩巒彎慢挽晩曼滿漫灣瞞萬蔓蠻輓饅鰻唜抹末沫茉襪靺亡妄忘忙望網罔芒茫莽輞邙埋妹媒寐昧枚梅每煤罵買賣邁魅脈貊陌驀麥孟氓猛盲盟萌冪覓免冕勉棉沔眄眠綿緬面麵滅"],["d9a1","蔑冥名命明暝椧溟皿瞑茗蓂螟酩銘鳴袂侮冒募姆帽慕摸摹暮某模母毛牟牡瑁眸矛耗芼茅謀謨貌木沐牧目睦穆鶩歿沒夢朦蒙卯墓妙廟描昴杳渺猫竗苗錨務巫憮懋戊拇撫无楙武毋無珷畝繆舞茂蕪誣貿霧鵡墨默們刎吻問文"],["daa1","汶紊紋聞蚊門雯勿沕物味媚尾嵋彌微未梶楣渼湄眉米美薇謎迷靡黴岷悶愍憫敏旻旼民泯玟珉緡閔密蜜謐剝博拍搏撲朴樸泊珀璞箔粕縛膊舶薄迫雹駁伴半反叛拌搬攀斑槃泮潘班畔瘢盤盼磐磻礬絆般蟠返頒飯勃拔撥渤潑"],["dba1","發跋醱鉢髮魃倣傍坊妨尨幇彷房放方旁昉枋榜滂磅紡肪膀舫芳蒡蚌訪謗邦防龐倍俳北培徘拜排杯湃焙盃背胚裴裵褙賠輩配陪伯佰帛柏栢白百魄幡樊煩燔番磻繁蕃藩飜伐筏罰閥凡帆梵氾汎泛犯範范法琺僻劈壁擘檗璧癖"],["dca1","碧蘗闢霹便卞弁變辨辯邊別瞥鱉鼈丙倂兵屛幷昞昺柄棅炳甁病秉竝輧餠騈保堡報寶普步洑湺潽珤甫菩補褓譜輔伏僕匐卜宓復服福腹茯蔔複覆輹輻馥鰒本乶俸奉封峯峰捧棒烽熢琫縫蓬蜂逢鋒鳳不付俯傅剖副否咐埠夫婦"],["dda1","孚孵富府復扶敷斧浮溥父符簿缶腐腑膚艀芙莩訃負賦賻赴趺部釜阜附駙鳧北分吩噴墳奔奮忿憤扮昐汾焚盆粉糞紛芬賁雰不佛弗彿拂崩朋棚硼繃鵬丕備匕匪卑妃婢庇悲憊扉批斐枇榧比毖毗毘沸泌琵痺砒碑秕秘粃緋翡肥"],["dea1","脾臂菲蜚裨誹譬費鄙非飛鼻嚬嬪彬斌檳殯浜濱瀕牝玭貧賓頻憑氷聘騁乍事些仕伺似使俟僿史司唆嗣四士奢娑寫寺射巳師徙思捨斜斯柶査梭死沙泗渣瀉獅砂社祀祠私篩紗絲肆舍莎蓑蛇裟詐詞謝賜赦辭邪飼駟麝削數朔索"],["dfa1","傘刪山散汕珊産疝算蒜酸霰乷撒殺煞薩三參杉森渗芟蔘衫揷澁鈒颯上傷像償商喪嘗孀尙峠常床庠廂想桑橡湘爽牀狀相祥箱翔裳觴詳象賞霜塞璽賽嗇塞穡索色牲生甥省笙墅壻嶼序庶徐恕抒捿敍暑曙書栖棲犀瑞筮絮緖署"],["e0a1","胥舒薯西誓逝鋤黍鼠夕奭席惜昔晳析汐淅潟石碩蓆釋錫仙僊先善嬋宣扇敾旋渲煽琁瑄璇璿癬禪線繕羨腺膳船蘚蟬詵跣選銑鐥饍鮮卨屑楔泄洩渫舌薛褻設說雪齧剡暹殲纖蟾贍閃陝攝涉燮葉城姓宬性惺成星晟猩珹盛省筬"],["e1a1","聖聲腥誠醒世勢歲洗稅笹細說貰召嘯塑宵小少巢所掃搔昭梳沼消溯瀟炤燒甦疏疎瘙笑篠簫素紹蔬蕭蘇訴逍遡邵銷韶騷俗屬束涑粟續謖贖速孫巽損蓀遜飡率宋悚松淞訟誦送頌刷殺灑碎鎖衰釗修受嗽囚垂壽嫂守岫峀帥愁"],["e2a1","戍手授搜收數樹殊水洙漱燧狩獸琇璲瘦睡秀穗竪粹綏綬繡羞脩茱蒐蓚藪袖誰讐輸遂邃酬銖銹隋隧隨雖需須首髓鬚叔塾夙孰宿淑潚熟琡璹肅菽巡徇循恂旬栒楯橓殉洵淳珣盾瞬筍純脣舜荀蓴蕣詢諄醇錞順馴戌術述鉥崇崧"],["e3a1","嵩瑟膝蝨濕拾習褶襲丞乘僧勝升承昇繩蠅陞侍匙嘶始媤尸屎屍市弑恃施是時枾柴猜矢示翅蒔蓍視試詩諡豕豺埴寔式息拭植殖湜熄篒蝕識軾食飾伸侁信呻娠宸愼新晨燼申神紳腎臣莘薪藎蜃訊身辛辰迅失室實悉審尋心沁"],["e4a1","沈深瀋甚芯諶什十拾雙氏亞俄兒啞娥峨我牙芽莪蛾衙訝阿雅餓鴉鵝堊岳嶽幄惡愕握樂渥鄂鍔顎鰐齷安岸按晏案眼雁鞍顔鮟斡謁軋閼唵岩巖庵暗癌菴闇壓押狎鴨仰央怏昻殃秧鴦厓哀埃崖愛曖涯碍艾隘靄厄扼掖液縊腋額"],["e5a1","櫻罌鶯鸚也倻冶夜惹揶椰爺耶若野弱掠略約若葯蒻藥躍亮佯兩凉壤孃恙揚攘敭暘梁楊樣洋瀁煬痒瘍禳穰糧羊良襄諒讓釀陽量養圄御於漁瘀禦語馭魚齬億憶抑檍臆偃堰彦焉言諺孼蘖俺儼嚴奄掩淹嶪業円予余勵呂女如廬"],["e6a1","旅歟汝濾璵礖礪與艅茹輿轝閭餘驪麗黎亦力域役易曆歷疫繹譯轢逆驛嚥堧姸娟宴年延憐戀捐挻撚椽沇沿涎涓淵演漣烟然煙煉燃燕璉硏硯秊筵緣練縯聯衍軟輦蓮連鉛鍊鳶列劣咽悅涅烈熱裂說閱厭廉念捻染殮炎焰琰艶苒"],["e7a1","簾閻髥鹽曄獵燁葉令囹塋寧嶺嶸影怜映暎楹榮永泳渶潁濚瀛瀯煐營獰玲瑛瑩瓔盈穎纓羚聆英詠迎鈴鍈零霙靈領乂倪例刈叡曳汭濊猊睿穢芮藝蘂禮裔詣譽豫醴銳隸霓預五伍俉傲午吾吳嗚塢墺奧娛寤悟惡懊敖旿晤梧汚澳"],["e8a1","烏熬獒筽蜈誤鰲鼇屋沃獄玉鈺溫瑥瘟穩縕蘊兀壅擁瓮甕癰翁邕雍饔渦瓦窩窪臥蛙蝸訛婉完宛梡椀浣玩琓琬碗緩翫脘腕莞豌阮頑曰往旺枉汪王倭娃歪矮外嵬巍猥畏了僚僥凹堯夭妖姚寥寮尿嶢拗搖撓擾料曜樂橈燎燿瑤療"],["e9a1","窈窯繇繞耀腰蓼蟯要謠遙遼邀饒慾欲浴縟褥辱俑傭冗勇埇墉容庸慂榕涌湧溶熔瑢用甬聳茸蓉踊鎔鏞龍于佑偶優又友右宇寓尤愚憂旴牛玗瑀盂祐禑禹紆羽芋藕虞迂遇郵釪隅雨雩勖彧旭昱栯煜稶郁頊云暈橒殞澐熉耘芸蕓"],["eaa1","運隕雲韻蔚鬱亐熊雄元原員圓園垣媛嫄寃怨愿援沅洹湲源爰猿瑗苑袁轅遠阮院願鴛月越鉞位偉僞危圍委威尉慰暐渭爲瑋緯胃萎葦蔿蝟衛褘謂違韋魏乳侑儒兪劉唯喩孺宥幼幽庾悠惟愈愉揄攸有杻柔柚柳楡楢油洧流游溜"],["eba1","濡猶猷琉瑜由留癒硫紐維臾萸裕誘諛諭踰蹂遊逾遺酉釉鍮類六堉戮毓肉育陸倫允奫尹崙淪潤玧胤贇輪鈗閏律慄栗率聿戎瀜絨融隆垠恩慇殷誾銀隱乙吟淫蔭陰音飮揖泣邑凝應膺鷹依倚儀宜意懿擬椅毅疑矣義艤薏蟻衣誼"],["eca1","議醫二以伊利吏夷姨履已弛彛怡易李梨泥爾珥理異痍痢移罹而耳肄苡荑裏裡貽貳邇里離飴餌匿溺瀷益翊翌翼謚人仁刃印吝咽因姻寅引忍湮燐璘絪茵藺蚓認隣靭靷鱗麟一佚佾壹日溢逸鎰馹任壬妊姙恁林淋稔臨荏賃入卄"],["eda1","立笠粒仍剩孕芿仔刺咨姉姿子字孜恣慈滋炙煮玆瓷疵磁紫者自茨蔗藉諮資雌作勺嚼斫昨灼炸爵綽芍酌雀鵲孱棧殘潺盞岑暫潛箴簪蠶雜丈仗匠場墻壯奬將帳庄張掌暲杖樟檣欌漿牆狀獐璋章粧腸臟臧莊葬蔣薔藏裝贓醬長"],["eea1","障再哉在宰才材栽梓渽滓災縡裁財載齋齎爭箏諍錚佇低儲咀姐底抵杵楮樗沮渚狙猪疽箸紵苧菹著藷詛貯躇這邸雎齟勣吊嫡寂摘敵滴狄炙的積笛籍績翟荻謫賊赤跡蹟迪迹適鏑佃佺傳全典前剪塡塼奠專展廛悛戰栓殿氈澱"],["efa1","煎琠田甸畑癲筌箋箭篆纏詮輾轉鈿銓錢鐫電顚顫餞切截折浙癤竊節絶占岾店漸点粘霑鮎點接摺蝶丁井亭停偵呈姃定幀庭廷征情挺政整旌晶晸柾楨檉正汀淀淨渟湞瀞炡玎珽町睛碇禎程穽精綎艇訂諪貞鄭酊釘鉦鋌錠霆靖"],["f0a1","靜頂鼎制劑啼堤帝弟悌提梯濟祭第臍薺製諸蹄醍除際霽題齊俎兆凋助嘲弔彫措操早晁曺曹朝條棗槽漕潮照燥爪璪眺祖祚租稠窕粗糟組繰肇藻蚤詔調趙躁造遭釣阻雕鳥族簇足鏃存尊卒拙猝倧宗從悰慫棕淙琮種終綜縱腫"],["f1a1","踪踵鍾鐘佐坐左座挫罪主住侏做姝胄呪周嗾奏宙州廚晝朱柱株注洲湊澍炷珠疇籌紂紬綢舟蛛註誅走躊輳週酎酒鑄駐竹粥俊儁准埈寯峻晙樽浚準濬焌畯竣蠢逡遵雋駿茁中仲衆重卽櫛楫汁葺增憎曾拯烝甑症繒蒸證贈之只"],["f2a1","咫地址志持指摯支旨智枝枳止池沚漬知砥祉祗紙肢脂至芝芷蜘誌識贄趾遲直稙稷織職唇嗔塵振搢晉晋桭榛殄津溱珍瑨璡畛疹盡眞瞋秦縉縝臻蔯袗診賑軫辰進鎭陣陳震侄叱姪嫉帙桎瓆疾秩窒膣蛭質跌迭斟朕什執潗緝輯"],["f3a1","鏶集徵懲澄且侘借叉嗟嵯差次此磋箚茶蹉車遮捉搾着窄錯鑿齪撰澯燦璨瓚竄簒纂粲纘讚贊鑽餐饌刹察擦札紮僭參塹慘慙懺斬站讒讖倉倡創唱娼廠彰愴敞昌昶暢槍滄漲猖瘡窓脹艙菖蒼債埰寀寨彩採砦綵菜蔡采釵冊柵策"],["f4a1","責凄妻悽處倜刺剔尺慽戚拓擲斥滌瘠脊蹠陟隻仟千喘天川擅泉淺玔穿舛薦賤踐遷釧闡阡韆凸哲喆徹撤澈綴輟轍鐵僉尖沾添甛瞻簽籤詹諂堞妾帖捷牒疊睫諜貼輒廳晴淸聽菁請靑鯖切剃替涕滯締諦逮遞體初剿哨憔抄招梢"],["f5a1","椒楚樵炒焦硝礁礎秒稍肖艸苕草蕉貂超酢醋醮促囑燭矗蜀觸寸忖村邨叢塚寵悤憁摠總聰蔥銃撮催崔最墜抽推椎楸樞湫皺秋芻萩諏趨追鄒酋醜錐錘鎚雛騶鰍丑畜祝竺筑築縮蓄蹙蹴軸逐春椿瑃出朮黜充忠沖蟲衝衷悴膵萃"],["f6a1","贅取吹嘴娶就炊翠聚脆臭趣醉驟鷲側仄厠惻測層侈値嗤峙幟恥梔治淄熾痔痴癡稚穉緇緻置致蚩輜雉馳齒則勅飭親七柒漆侵寢枕沈浸琛砧針鍼蟄秤稱快他咤唾墮妥惰打拖朶楕舵陀馱駝倬卓啄坼度托拓擢晫柝濁濯琢琸託"],["f7a1","鐸呑嘆坦彈憚歎灘炭綻誕奪脫探眈耽貪塔搭榻宕帑湯糖蕩兌台太怠態殆汰泰笞胎苔跆邰颱宅擇澤撑攄兎吐土討慟桶洞痛筒統通堆槌腿褪退頹偸套妬投透鬪慝特闖坡婆巴把播擺杷波派爬琶破罷芭跛頗判坂板版瓣販辦鈑"],["f8a1","阪八叭捌佩唄悖敗沛浿牌狽稗覇貝彭澎烹膨愎便偏扁片篇編翩遍鞭騙貶坪平枰萍評吠嬖幣廢弊斃肺蔽閉陛佈包匍匏咆哺圃布怖抛抱捕暴泡浦疱砲胞脯苞葡蒲袍褒逋鋪飽鮑幅暴曝瀑爆輻俵剽彪慓杓標漂瓢票表豹飇飄驃"],["f9a1","品稟楓諷豊風馮彼披疲皮被避陂匹弼必泌珌畢疋筆苾馝乏逼下何厦夏廈昰河瑕荷蝦賀遐霞鰕壑學虐謔鶴寒恨悍旱汗漢澣瀚罕翰閑閒限韓割轄函含咸啣喊檻涵緘艦銜陷鹹合哈盒蛤閤闔陜亢伉姮嫦巷恒抗杭桁沆港缸肛航"],["faa1","行降項亥偕咳垓奚孩害懈楷海瀣蟹解該諧邂駭骸劾核倖幸杏荇行享向嚮珦鄕響餉饗香噓墟虛許憲櫶獻軒歇險驗奕爀赫革俔峴弦懸晛泫炫玄玹現眩睍絃絢縣舷衒見賢鉉顯孑穴血頁嫌俠協夾峽挾浹狹脅脇莢鋏頰亨兄刑型"],["fba1","形泂滎瀅灐炯熒珩瑩荊螢衡逈邢鎣馨兮彗惠慧暳蕙蹊醯鞋乎互呼壕壺好岵弧戶扈昊晧毫浩淏湖滸澔濠濩灝狐琥瑚瓠皓祜糊縞胡芦葫蒿虎號蝴護豪鎬頀顥惑或酷婚昏混渾琿魂忽惚笏哄弘汞泓洪烘紅虹訌鴻化和嬅樺火畵"],["fca1","禍禾花華話譁貨靴廓擴攫確碻穫丸喚奐宦幻患換歡晥桓渙煥環紈還驩鰥活滑猾豁闊凰幌徨恍惶愰慌晃晄榥況湟滉潢煌璜皇篁簧荒蝗遑隍黃匯回廻徊恢悔懷晦會檜淮澮灰獪繪膾茴蛔誨賄劃獲宖橫鐄哮嚆孝效斅曉梟涍淆"],["fda1","爻肴酵驍侯候厚后吼喉嗅帿後朽煦珝逅勛勳塤壎焄熏燻薰訓暈薨喧暄煊萱卉喙毁彙徽揮暉煇諱輝麾休携烋畦虧恤譎鷸兇凶匈洶胸黑昕欣炘痕吃屹紇訖欠欽歆吸恰洽翕興僖凞喜噫囍姬嬉希憙憘戱晞曦熙熹熺犧禧稀羲詰"]]

},{}],105:[function(e,t,r){t.exports=[["0","\x00",127],["a140","　，、。．‧；：？！︰…‥﹐﹑﹒·﹔﹕﹖﹗｜–︱—︳╴︴﹏（）︵︶｛｝︷︸〔〕︹︺【】︻︼《》︽︾〈〉︿﹀「」﹁﹂『』﹃﹄﹙﹚"],["a1a1","﹛﹜﹝﹞‘’“”〝〞‵′＃＆＊※§〃○●△▲◎☆★◇◆□■▽▼㊣℅¯￣＿ˍ﹉﹊﹍﹎﹋﹌﹟﹠﹡＋－×÷±√＜＞＝≦≧≠∞≒≡﹢",4,"～∩∪⊥∠∟⊿㏒㏑∫∮∵∴♀♂⊕⊙↑↓←→↖↗↙↘∥∣／"],["a240","＼∕﹨＄￥〒￠￡％＠℃℉﹩﹪﹫㏕㎜㎝㎞㏎㎡㎎㎏㏄°兙兛兞兝兡兣嗧瓩糎▁",7,"▏▎▍▌▋▊▉┼┴┬┤├▔─│▕┌┐└┘╭"],["a2a1","╮╰╯═╞╪╡◢◣◥◤╱╲╳０",9,"Ⅰ",9,"〡",8,"十卄卅Ａ",25,"ａ",21],["a340","ｗｘｙｚΑ",16,"Σ",6,"α",16,"σ",6,"ㄅ",10],["a3a1","ㄐ",25,"˙ˉˊˇˋ"],["a3e1","€"],["a440","一乙丁七乃九了二人儿入八几刀刁力匕十卜又三下丈上丫丸凡久么也乞于亡兀刃勺千叉口土士夕大女子孑孓寸小尢尸山川工己已巳巾干廾弋弓才"],["a4a1","丑丐不中丰丹之尹予云井互五亢仁什仃仆仇仍今介仄元允內六兮公冗凶分切刈勻勾勿化匹午升卅卞厄友及反壬天夫太夭孔少尤尺屯巴幻廿弔引心戈戶手扎支文斗斤方日曰月木欠止歹毋比毛氏水火爪父爻片牙牛犬王丙"],["a540","世丕且丘主乍乏乎以付仔仕他仗代令仙仞充兄冉冊冬凹出凸刊加功包匆北匝仟半卉卡占卯卮去可古右召叮叩叨叼司叵叫另只史叱台句叭叻四囚外"],["a5a1","央失奴奶孕它尼巨巧左市布平幼弁弘弗必戊打扔扒扑斥旦朮本未末札正母民氐永汁汀氾犯玄玉瓜瓦甘生用甩田由甲申疋白皮皿目矛矢石示禾穴立丞丟乒乓乩亙交亦亥仿伉伙伊伕伍伐休伏仲件任仰仳份企伋光兇兆先全"],["a640","共再冰列刑划刎刖劣匈匡匠印危吉吏同吊吐吁吋各向名合吃后吆吒因回囝圳地在圭圬圯圩夙多夷夸妄奸妃好她如妁字存宇守宅安寺尖屹州帆并年"],["a6a1","式弛忙忖戎戌戍成扣扛托收早旨旬旭曲曳有朽朴朱朵次此死氖汝汗汙江池汐汕污汛汍汎灰牟牝百竹米糸缶羊羽老考而耒耳聿肉肋肌臣自至臼舌舛舟艮色艾虫血行衣西阡串亨位住佇佗佞伴佛何估佐佑伽伺伸佃佔似但佣"],["a740","作你伯低伶余佝佈佚兌克免兵冶冷別判利刪刨劫助努劬匣即卵吝吭吞吾否呎吧呆呃吳呈呂君吩告吹吻吸吮吵吶吠吼呀吱含吟听囪困囤囫坊坑址坍"],["a7a1","均坎圾坐坏圻壯夾妝妒妨妞妣妙妖妍妤妓妊妥孝孜孚孛完宋宏尬局屁尿尾岐岑岔岌巫希序庇床廷弄弟彤形彷役忘忌志忍忱快忸忪戒我抄抗抖技扶抉扭把扼找批扳抒扯折扮投抓抑抆改攻攸旱更束李杏材村杜杖杞杉杆杠"],["a840","杓杗步每求汞沙沁沈沉沅沛汪決沐汰沌汨沖沒汽沃汲汾汴沆汶沍沔沘沂灶灼災灸牢牡牠狄狂玖甬甫男甸皂盯矣私秀禿究系罕肖肓肝肘肛肚育良芒"],["a8a1","芋芍見角言谷豆豕貝赤走足身車辛辰迂迆迅迄巡邑邢邪邦那酉釆里防阮阱阪阬並乖乳事些亞享京佯依侍佳使佬供例來侃佰併侈佩佻侖佾侏侑佺兔兒兕兩具其典冽函刻券刷刺到刮制剁劾劻卒協卓卑卦卷卸卹取叔受味呵"],["a940","咖呸咕咀呻呷咄咒咆呼咐呱呶和咚呢周咋命咎固垃坷坪坩坡坦坤坼夜奉奇奈奄奔妾妻委妹妮姑姆姐姍始姓姊妯妳姒姅孟孤季宗定官宜宙宛尚屈居"],["a9a1","屆岷岡岸岩岫岱岳帘帚帖帕帛帑幸庚店府底庖延弦弧弩往征彿彼忝忠忽念忿怏怔怯怵怖怪怕怡性怩怫怛或戕房戾所承拉拌拄抿拂抹拒招披拓拔拋拈抨抽押拐拙拇拍抵拚抱拘拖拗拆抬拎放斧於旺昔易昌昆昂明昀昏昕昊"],["aa40","昇服朋杭枋枕東果杳杷枇枝林杯杰板枉松析杵枚枓杼杪杲欣武歧歿氓氛泣注泳沱泌泥河沽沾沼波沫法泓沸泄油況沮泗泅泱沿治泡泛泊沬泯泜泖泠"],["aaa1","炕炎炒炊炙爬爭爸版牧物狀狎狙狗狐玩玨玟玫玥甽疝疙疚的盂盲直知矽社祀祁秉秈空穹竺糾罔羌羋者肺肥肢肱股肫肩肴肪肯臥臾舍芳芝芙芭芽芟芹花芬芥芯芸芣芰芾芷虎虱初表軋迎返近邵邸邱邶采金長門阜陀阿阻附"],["ab40","陂隹雨青非亟亭亮信侵侯便俠俑俏保促侶俘俟俊俗侮俐俄係俚俎俞侷兗冒冑冠剎剃削前剌剋則勇勉勃勁匍南卻厚叛咬哀咨哎哉咸咦咳哇哂咽咪品"],["aba1","哄哈咯咫咱咻咩咧咿囿垂型垠垣垢城垮垓奕契奏奎奐姜姘姿姣姨娃姥姪姚姦威姻孩宣宦室客宥封屎屏屍屋峙峒巷帝帥帟幽庠度建弈弭彥很待徊律徇後徉怒思怠急怎怨恍恰恨恢恆恃恬恫恪恤扁拜挖按拼拭持拮拽指拱拷"],["ac40","拯括拾拴挑挂政故斫施既春昭映昧是星昨昱昤曷柿染柱柔某柬架枯柵柩柯柄柑枴柚查枸柏柞柳枰柙柢柝柒歪殃殆段毒毗氟泉洋洲洪流津洌洱洞洗"],["aca1","活洽派洶洛泵洹洧洸洩洮洵洎洫炫為炳炬炯炭炸炮炤爰牲牯牴狩狠狡玷珊玻玲珍珀玳甚甭畏界畎畋疫疤疥疢疣癸皆皇皈盈盆盃盅省盹相眉看盾盼眇矜砂研砌砍祆祉祈祇禹禺科秒秋穿突竿竽籽紂紅紀紉紇約紆缸美羿耄"],["ad40","耐耍耑耶胖胥胚胃胄背胡胛胎胞胤胝致舢苧范茅苣苛苦茄若茂茉苒苗英茁苜苔苑苞苓苟苯茆虐虹虻虺衍衫要觔計訂訃貞負赴赳趴軍軌述迦迢迪迥"],["ada1","迭迫迤迨郊郎郁郃酋酊重閂限陋陌降面革韋韭音頁風飛食首香乘亳倌倍倣俯倦倥俸倩倖倆值借倚倒們俺倀倔倨俱倡個候倘俳修倭倪俾倫倉兼冤冥冢凍凌准凋剖剜剔剛剝匪卿原厝叟哨唐唁唷哼哥哲唆哺唔哩哭員唉哮哪"],["ae40","哦唧唇哽唏圃圄埂埔埋埃堉夏套奘奚娑娘娜娟娛娓姬娠娣娩娥娌娉孫屘宰害家宴宮宵容宸射屑展屐峭峽峻峪峨峰島崁峴差席師庫庭座弱徒徑徐恙"],["aea1","恣恥恐恕恭恩息悄悟悚悍悔悌悅悖扇拳挈拿捎挾振捕捂捆捏捉挺捐挽挪挫挨捍捌效敉料旁旅時晉晏晃晒晌晅晁書朔朕朗校核案框桓根桂桔栩梳栗桌桑栽柴桐桀格桃株桅栓栘桁殊殉殷氣氧氨氦氤泰浪涕消涇浦浸海浙涓"],["af40","浬涉浮浚浴浩涌涊浹涅浥涔烊烘烤烙烈烏爹特狼狹狽狸狷玆班琉珮珠珪珞畔畝畜畚留疾病症疲疳疽疼疹痂疸皋皰益盍盎眩真眠眨矩砰砧砸砝破砷"],["afa1","砥砭砠砟砲祕祐祠祟祖神祝祗祚秤秣秧租秦秩秘窄窈站笆笑粉紡紗紋紊素索純紐紕級紜納紙紛缺罟羔翅翁耆耘耕耙耗耽耿胱脂胰脅胭胴脆胸胳脈能脊胼胯臭臬舀舐航舫舨般芻茫荒荔荊茸荐草茵茴荏茲茹茶茗荀茱茨荃"],["b040","虔蚊蚪蚓蚤蚩蚌蚣蚜衰衷袁袂衽衹記訐討訌訕訊託訓訖訏訑豈豺豹財貢起躬軒軔軏辱送逆迷退迺迴逃追逅迸邕郡郝郢酒配酌釘針釗釜釙閃院陣陡"],["b0a1","陛陝除陘陞隻飢馬骨高鬥鬲鬼乾偺偽停假偃偌做偉健偶偎偕偵側偷偏倏偯偭兜冕凰剪副勒務勘動匐匏匙匿區匾參曼商啪啦啄啞啡啃啊唱啖問啕唯啤唸售啜唬啣唳啁啗圈國圉域堅堊堆埠埤基堂堵執培夠奢娶婁婉婦婪婀"],["b140","娼婢婚婆婊孰寇寅寄寂宿密尉專將屠屜屝崇崆崎崛崖崢崑崩崔崙崤崧崗巢常帶帳帷康庸庶庵庾張強彗彬彩彫得徙從徘御徠徜恿患悉悠您惋悴惦悽"],["b1a1","情悻悵惜悼惘惕惆惟悸惚惇戚戛扈掠控捲掖探接捷捧掘措捱掩掉掃掛捫推掄授掙採掬排掏掀捻捩捨捺敝敖救教敗啟敏敘敕敔斜斛斬族旋旌旎晝晚晤晨晦晞曹勗望梁梯梢梓梵桿桶梱梧梗械梃棄梭梆梅梔條梨梟梡梂欲殺"],["b240","毫毬氫涎涼淳淙液淡淌淤添淺清淇淋涯淑涮淞淹涸混淵淅淒渚涵淚淫淘淪深淮淨淆淄涪淬涿淦烹焉焊烽烯爽牽犁猜猛猖猓猙率琅琊球理現琍瓠瓶"],["b2a1","瓷甜產略畦畢異疏痔痕疵痊痍皎盔盒盛眷眾眼眶眸眺硫硃硎祥票祭移窒窕笠笨笛第符笙笞笮粒粗粕絆絃統紮紹紼絀細紳組累終紲紱缽羞羚翌翎習耜聊聆脯脖脣脫脩脰脤舂舵舷舶船莎莞莘荸莢莖莽莫莒莊莓莉莠荷荻荼"],["b340","莆莧處彪蛇蛀蚶蛄蚵蛆蛋蚱蚯蛉術袞袈被袒袖袍袋覓規訪訝訣訥許設訟訛訢豉豚販責貫貨貪貧赧赦趾趺軛軟這逍通逗連速逝逐逕逞造透逢逖逛途"],["b3a1","部郭都酗野釵釦釣釧釭釩閉陪陵陳陸陰陴陶陷陬雀雪雩章竟頂頃魚鳥鹵鹿麥麻傢傍傅備傑傀傖傘傚最凱割剴創剩勞勝勛博厥啻喀喧啼喊喝喘喂喜喪喔喇喋喃喳單喟唾喲喚喻喬喱啾喉喫喙圍堯堪場堤堰報堡堝堠壹壺奠"],["b440","婷媚婿媒媛媧孳孱寒富寓寐尊尋就嵌嵐崴嵇巽幅帽幀幃幾廊廁廂廄弼彭復循徨惑惡悲悶惠愜愣惺愕惰惻惴慨惱愎惶愉愀愒戟扉掣掌描揀揩揉揆揍"],["b4a1","插揣提握揖揭揮捶援揪換摒揚揹敞敦敢散斑斐斯普晰晴晶景暑智晾晷曾替期朝棺棕棠棘棗椅棟棵森棧棹棒棲棣棋棍植椒椎棉棚楮棻款欺欽殘殖殼毯氮氯氬港游湔渡渲湧湊渠渥渣減湛湘渤湖湮渭渦湯渴湍渺測湃渝渾滋"],["b540","溉渙湎湣湄湲湩湟焙焚焦焰無然煮焜牌犄犀猶猥猴猩琺琪琳琢琥琵琶琴琯琛琦琨甥甦畫番痢痛痣痙痘痞痠登發皖皓皴盜睏短硝硬硯稍稈程稅稀窘"],["b5a1","窗窖童竣等策筆筐筒答筍筋筏筑粟粥絞結絨絕紫絮絲絡給絢絰絳善翔翕耋聒肅腕腔腋腑腎脹腆脾腌腓腴舒舜菩萃菸萍菠菅萋菁華菱菴著萊菰萌菌菽菲菊萸萎萄菜萇菔菟虛蛟蛙蛭蛔蛛蛤蛐蛞街裁裂袱覃視註詠評詞証詁"],["b640","詔詛詐詆訴診訶詖象貂貯貼貳貽賁費賀貴買貶貿貸越超趁跎距跋跚跑跌跛跆軻軸軼辜逮逵週逸進逶鄂郵鄉郾酣酥量鈔鈕鈣鈉鈞鈍鈐鈇鈑閔閏開閑"],["b6a1","間閒閎隊階隋陽隅隆隍陲隄雁雅雄集雇雯雲韌項順須飧飪飯飩飲飭馮馭黃黍黑亂傭債傲傳僅傾催傷傻傯僇剿剷剽募勦勤勢勣匯嗟嗨嗓嗦嗎嗜嗇嗑嗣嗤嗯嗚嗡嗅嗆嗥嗉園圓塞塑塘塗塚塔填塌塭塊塢塒塋奧嫁嫉嫌媾媽媼"],["b740","媳嫂媲嵩嵯幌幹廉廈弒彙徬微愚意慈感想愛惹愁愈慎慌慄慍愾愴愧愍愆愷戡戢搓搾搞搪搭搽搬搏搜搔損搶搖搗搆敬斟新暗暉暇暈暖暄暘暍會榔業"],["b7a1","楚楷楠楔極椰概楊楨楫楞楓楹榆楝楣楛歇歲毀殿毓毽溢溯滓溶滂源溝滇滅溥溘溼溺溫滑準溜滄滔溪溧溴煎煙煩煤煉照煜煬煦煌煥煞煆煨煖爺牒猷獅猿猾瑯瑚瑕瑟瑞瑁琿瑙瑛瑜當畸瘀痰瘁痲痱痺痿痴痳盞盟睛睫睦睞督"],["b840","睹睪睬睜睥睨睢矮碎碰碗碘碌碉硼碑碓硿祺祿禁萬禽稜稚稠稔稟稞窟窠筷節筠筮筧粱粳粵經絹綑綁綏絛置罩罪署義羨群聖聘肆肄腱腰腸腥腮腳腫"],["b8a1","腹腺腦舅艇蒂葷落萱葵葦葫葉葬葛萼萵葡董葩葭葆虞虜號蛹蜓蜈蜇蜀蛾蛻蜂蜃蜆蜊衙裟裔裙補裘裝裡裊裕裒覜解詫該詳試詩詰誇詼詣誠話誅詭詢詮詬詹詻訾詨豢貊貉賊資賈賄貲賃賂賅跡跟跨路跳跺跪跤跦躲較載軾輊"],["b940","辟農運遊道遂達逼違遐遇遏過遍遑逾遁鄒鄗酬酪酩釉鈷鉗鈸鈽鉀鈾鉛鉋鉤鉑鈴鉉鉍鉅鈹鈿鉚閘隘隔隕雍雋雉雊雷電雹零靖靴靶預頑頓頊頒頌飼飴"],["b9a1","飽飾馳馱馴髡鳩麂鼎鼓鼠僧僮僥僖僭僚僕像僑僱僎僩兢凳劃劂匱厭嗾嘀嘛嘗嗽嘔嘆嘉嘍嘎嗷嘖嘟嘈嘐嗶團圖塵塾境墓墊塹墅塽壽夥夢夤奪奩嫡嫦嫩嫗嫖嫘嫣孵寞寧寡寥實寨寢寤察對屢嶄嶇幛幣幕幗幔廓廖弊彆彰徹慇"],["ba40","愿態慷慢慣慟慚慘慵截撇摘摔撤摸摟摺摑摧搴摭摻敲斡旗旖暢暨暝榜榨榕槁榮槓構榛榷榻榫榴槐槍榭槌榦槃榣歉歌氳漳演滾漓滴漩漾漠漬漏漂漢"],["baa1","滿滯漆漱漸漲漣漕漫漯澈漪滬漁滲滌滷熔熙煽熊熄熒爾犒犖獄獐瑤瑣瑪瑰瑭甄疑瘧瘍瘋瘉瘓盡監瞄睽睿睡磁碟碧碳碩碣禎福禍種稱窪窩竭端管箕箋筵算箝箔箏箸箇箄粹粽精綻綰綜綽綾綠緊綴網綱綺綢綿綵綸維緒緇綬"],["bb40","罰翠翡翟聞聚肇腐膀膏膈膊腿膂臧臺與舔舞艋蓉蒿蓆蓄蒙蒞蒲蒜蓋蒸蓀蓓蒐蒼蓑蓊蜿蜜蜻蜢蜥蜴蜘蝕蜷蜩裳褂裴裹裸製裨褚裯誦誌語誣認誡誓誤"],["bba1","說誥誨誘誑誚誧豪貍貌賓賑賒赫趙趕跼輔輒輕輓辣遠遘遜遣遙遞遢遝遛鄙鄘鄞酵酸酷酴鉸銀銅銘銖鉻銓銜銨鉼銑閡閨閩閣閥閤隙障際雌雒需靼鞅韶頗領颯颱餃餅餌餉駁骯骰髦魁魂鳴鳶鳳麼鼻齊億儀僻僵價儂儈儉儅凜"],["bc40","劇劈劉劍劊勰厲嘮嘻嘹嘲嘿嘴嘩噓噎噗噴嘶嘯嘰墀墟增墳墜墮墩墦奭嬉嫻嬋嫵嬌嬈寮寬審寫層履嶝嶔幢幟幡廢廚廟廝廣廠彈影德徵慶慧慮慝慕憂"],["bca1","慼慰慫慾憧憐憫憎憬憚憤憔憮戮摩摯摹撞撲撈撐撰撥撓撕撩撒撮播撫撚撬撙撢撳敵敷數暮暫暴暱樣樟槨樁樞標槽模樓樊槳樂樅槭樑歐歎殤毅毆漿潼澄潑潦潔澆潭潛潸潮澎潺潰潤澗潘滕潯潠潟熟熬熱熨牖犛獎獗瑩璋璃"],["bd40","瑾璀畿瘠瘩瘟瘤瘦瘡瘢皚皺盤瞎瞇瞌瞑瞋磋磅確磊碾磕碼磐稿稼穀稽稷稻窯窮箭箱範箴篆篇篁箠篌糊締練緯緻緘緬緝編緣線緞緩綞緙緲緹罵罷羯"],["bda1","翩耦膛膜膝膠膚膘蔗蔽蔚蓮蔬蔭蔓蔑蔣蔡蔔蓬蔥蓿蔆螂蝴蝶蝠蝦蝸蝨蝙蝗蝌蝓衛衝褐複褒褓褕褊誼諒談諄誕請諸課諉諂調誰論諍誶誹諛豌豎豬賠賞賦賤賬賭賢賣賜質賡赭趟趣踫踐踝踢踏踩踟踡踞躺輝輛輟輩輦輪輜輞"],["be40","輥適遮遨遭遷鄰鄭鄧鄱醇醉醋醃鋅銻銷鋪銬鋤鋁銳銼鋒鋇鋰銲閭閱霄霆震霉靠鞍鞋鞏頡頫頜颳養餓餒餘駝駐駟駛駑駕駒駙骷髮髯鬧魅魄魷魯鴆鴉"],["bea1","鴃麩麾黎墨齒儒儘儔儐儕冀冪凝劑劓勳噙噫噹噩噤噸噪器噥噱噯噬噢噶壁墾壇壅奮嬝嬴學寰導彊憲憑憩憊懍憶憾懊懈戰擅擁擋撻撼據擄擇擂操撿擒擔撾整曆曉暹曄曇暸樽樸樺橙橫橘樹橄橢橡橋橇樵機橈歙歷氅濂澱澡"],["bf40","濃澤濁澧澳激澹澶澦澠澴熾燉燐燒燈燕熹燎燙燜燃燄獨璜璣璘璟璞瓢甌甍瘴瘸瘺盧盥瞠瞞瞟瞥磨磚磬磧禦積穎穆穌穋窺篙簑築篤篛篡篩篦糕糖縊"],["bfa1","縑縈縛縣縞縝縉縐罹羲翰翱翮耨膳膩膨臻興艘艙蕊蕙蕈蕨蕩蕃蕉蕭蕪蕞螃螟螞螢融衡褪褲褥褫褡親覦諦諺諫諱謀諜諧諮諾謁謂諷諭諳諶諼豫豭貓賴蹄踱踴蹂踹踵輻輯輸輳辨辦遵遴選遲遼遺鄴醒錠錶鋸錳錯錢鋼錫錄錚"],["c040","錐錦錡錕錮錙閻隧隨險雕霎霑霖霍霓霏靛靜靦鞘頰頸頻頷頭頹頤餐館餞餛餡餚駭駢駱骸骼髻髭鬨鮑鴕鴣鴦鴨鴒鴛默黔龍龜優償儡儲勵嚎嚀嚐嚅嚇"],["c0a1","嚏壕壓壑壎嬰嬪嬤孺尷屨嶼嶺嶽嶸幫彌徽應懂懇懦懋戲戴擎擊擘擠擰擦擬擱擢擭斂斃曙曖檀檔檄檢檜櫛檣橾檗檐檠歜殮毚氈濘濱濟濠濛濤濫濯澀濬濡濩濕濮濰燧營燮燦燥燭燬燴燠爵牆獰獲璩環璦璨癆療癌盪瞳瞪瞰瞬"],["c140","瞧瞭矯磷磺磴磯礁禧禪穗窿簇簍篾篷簌篠糠糜糞糢糟糙糝縮績繆縷縲繃縫總縱繅繁縴縹繈縵縿縯罄翳翼聱聲聰聯聳臆臃膺臂臀膿膽臉膾臨舉艱薪"],["c1a1","薄蕾薜薑薔薯薛薇薨薊虧蟀蟑螳蟒蟆螫螻螺蟈蟋褻褶襄褸褽覬謎謗謙講謊謠謝謄謐豁谿豳賺賽購賸賻趨蹉蹋蹈蹊轄輾轂轅輿避遽還邁邂邀鄹醣醞醜鍍鎂錨鍵鍊鍥鍋錘鍾鍬鍛鍰鍚鍔闊闋闌闈闆隱隸雖霜霞鞠韓顆颶餵騁"],["c240","駿鮮鮫鮪鮭鴻鴿麋黏點黜黝黛鼾齋叢嚕嚮壙壘嬸彝懣戳擴擲擾攆擺擻擷斷曜朦檳檬櫃檻檸櫂檮檯歟歸殯瀉瀋濾瀆濺瀑瀏燻燼燾燸獷獵璧璿甕癖癘"],["c2a1","癒瞽瞿瞻瞼礎禮穡穢穠竄竅簫簧簪簞簣簡糧織繕繞繚繡繒繙罈翹翻職聶臍臏舊藏薩藍藐藉薰薺薹薦蟯蟬蟲蟠覆覲觴謨謹謬謫豐贅蹙蹣蹦蹤蹟蹕軀轉轍邇邃邈醫醬釐鎔鎊鎖鎢鎳鎮鎬鎰鎘鎚鎗闔闖闐闕離雜雙雛雞霤鞣鞦"],["c340","鞭韹額顏題顎顓颺餾餿餽餮馥騎髁鬃鬆魏魎魍鯊鯉鯽鯈鯀鵑鵝鵠黠鼕鼬儳嚥壞壟壢寵龐廬懲懷懶懵攀攏曠曝櫥櫝櫚櫓瀛瀟瀨瀚瀝瀕瀘爆爍牘犢獸"],["c3a1","獺璽瓊瓣疇疆癟癡矇礙禱穫穩簾簿簸簽簷籀繫繭繹繩繪羅繳羶羹羸臘藩藝藪藕藤藥藷蟻蠅蠍蟹蟾襠襟襖襞譁譜識證譚譎譏譆譙贈贊蹼蹲躇蹶蹬蹺蹴轔轎辭邊邋醱醮鏡鏑鏟鏃鏈鏜鏝鏖鏢鏍鏘鏤鏗鏨關隴難霪霧靡韜韻類"],["c440","願顛颼饅饉騖騙鬍鯨鯧鯖鯛鶉鵡鵲鵪鵬麒麗麓麴勸嚨嚷嚶嚴嚼壤孀孃孽寶巉懸懺攘攔攙曦朧櫬瀾瀰瀲爐獻瓏癢癥礦礪礬礫竇競籌籃籍糯糰辮繽繼"],["c4a1","纂罌耀臚艦藻藹蘑藺蘆蘋蘇蘊蠔蠕襤覺觸議譬警譯譟譫贏贍躉躁躅躂醴釋鐘鐃鏽闡霰飄饒饑馨騫騰騷騵鰓鰍鹹麵黨鼯齟齣齡儷儸囁囀囂夔屬巍懼懾攝攜斕曩櫻欄櫺殲灌爛犧瓖瓔癩矓籐纏續羼蘗蘭蘚蠣蠢蠡蠟襪襬覽譴"],["c540","護譽贓躊躍躋轟辯醺鐮鐳鐵鐺鐸鐲鐫闢霸霹露響顧顥饗驅驃驀騾髏魔魑鰭鰥鶯鶴鷂鶸麝黯鼙齜齦齧儼儻囈囊囉孿巔巒彎懿攤權歡灑灘玀瓤疊癮癬"],["c5a1","禳籠籟聾聽臟襲襯觼讀贖贗躑躓轡酈鑄鑑鑒霽霾韃韁顫饕驕驍髒鬚鱉鰱鰾鰻鷓鷗鼴齬齪龔囌巖戀攣攫攪曬欐瓚竊籤籣籥纓纖纔臢蘸蘿蠱變邐邏鑣鑠鑤靨顯饜驚驛驗髓體髑鱔鱗鱖鷥麟黴囑壩攬灞癱癲矗罐羈蠶蠹衢讓讒"],["c640","讖艷贛釀鑪靂靈靄韆顰驟鬢魘鱟鷹鷺鹼鹽鼇齷齲廳欖灣籬籮蠻觀躡釁鑲鑰顱饞髖鬣黌灤矚讚鑷韉驢驥纜讜躪釅鑽鑾鑼鱷鱸黷豔鑿鸚爨驪鬱鸛鸞籲"],["c940","乂乜凵匚厂万丌乇亍囗兀屮彳丏冇与丮亓仂仉仈冘勼卬厹圠夃夬尐巿旡殳毌气爿丱丼仨仜仩仡仝仚刌匜卌圢圣夗夯宁宄尒尻屴屳帄庀庂忉戉扐氕"],["c9a1","氶汃氿氻犮犰玊禸肊阞伎优伬仵伔仱伀价伈伝伂伅伢伓伄仴伒冱刓刉刐劦匢匟卍厊吇囡囟圮圪圴夼妀奼妅奻奾奷奿孖尕尥屼屺屻屾巟幵庄异弚彴忕忔忏扜扞扤扡扦扢扙扠扚扥旯旮朾朹朸朻机朿朼朳氘汆汒汜汏汊汔汋"],["ca40","汌灱牞犴犵玎甪癿穵网艸艼芀艽艿虍襾邙邗邘邛邔阢阤阠阣佖伻佢佉体佤伾佧佒佟佁佘伭伳伿佡冏冹刜刞刡劭劮匉卣卲厎厏吰吷吪呔呅吙吜吥吘"],["caa1","吽呏呁吨吤呇囮囧囥坁坅坌坉坋坒夆奀妦妘妠妗妎妢妐妏妧妡宎宒尨尪岍岏岈岋岉岒岊岆岓岕巠帊帎庋庉庌庈庍弅弝彸彶忒忑忐忭忨忮忳忡忤忣忺忯忷忻怀忴戺抃抌抎抏抔抇扱扻扺扰抁抈扷扽扲扴攷旰旴旳旲旵杅杇"],["cb40","杙杕杌杈杝杍杚杋毐氙氚汸汧汫沄沋沏汱汯汩沚汭沇沕沜汦汳汥汻沎灴灺牣犿犽狃狆狁犺狅玕玗玓玔玒町甹疔疕皁礽耴肕肙肐肒肜芐芏芅芎芑芓"],["cba1","芊芃芄豸迉辿邟邡邥邞邧邠阰阨阯阭丳侘佼侅佽侀侇佶佴侉侄佷佌侗佪侚佹侁佸侐侜侔侞侒侂侕佫佮冞冼冾刵刲刳剆刱劼匊匋匼厒厔咇呿咁咑咂咈呫呺呾呥呬呴呦咍呯呡呠咘呣呧呤囷囹坯坲坭坫坱坰坶垀坵坻坳坴坢"],["cc40","坨坽夌奅妵妺姏姎妲姌姁妶妼姃姖妱妽姀姈妴姇孢孥宓宕屄屇岮岤岠岵岯岨岬岟岣岭岢岪岧岝岥岶岰岦帗帔帙弨弢弣弤彔徂彾彽忞忥怭怦怙怲怋"],["cca1","怴怊怗怳怚怞怬怢怍怐怮怓怑怌怉怜戔戽抭抴拑抾抪抶拊抮抳抯抻抩抰抸攽斨斻昉旼昄昒昈旻昃昋昍昅旽昑昐曶朊枅杬枎枒杶杻枘枆构杴枍枌杺枟枑枙枃杽极杸杹枔欥殀歾毞氝沓泬泫泮泙沶泔沭泧沷泐泂沺泃泆泭泲"],["cd40","泒泝沴沊沝沀泞泀洰泍泇沰泹泏泩泑炔炘炅炓炆炄炑炖炂炚炃牪狖狋狘狉狜狒狔狚狌狑玤玡玭玦玢玠玬玝瓝瓨甿畀甾疌疘皯盳盱盰盵矸矼矹矻矺"],["cda1","矷祂礿秅穸穻竻籵糽耵肏肮肣肸肵肭舠芠苀芫芚芘芛芵芧芮芼芞芺芴芨芡芩苂芤苃芶芢虰虯虭虮豖迒迋迓迍迖迕迗邲邴邯邳邰阹阽阼阺陃俍俅俓侲俉俋俁俔俜俙侻侳俛俇俖侺俀侹俬剄剉勀勂匽卼厗厖厙厘咺咡咭咥哏"],["ce40","哃茍咷咮哖咶哅哆咠呰咼咢咾呲哞咰垵垞垟垤垌垗垝垛垔垘垏垙垥垚垕壴复奓姡姞姮娀姱姝姺姽姼姶姤姲姷姛姩姳姵姠姾姴姭宨屌峐峘峌峗峋峛"],["cea1","峞峚峉峇峊峖峓峔峏峈峆峎峟峸巹帡帢帣帠帤庰庤庢庛庣庥弇弮彖徆怷怹恔恲恞恅恓恇恉恛恌恀恂恟怤恄恘恦恮扂扃拏挍挋拵挎挃拫拹挏挌拸拶挀挓挔拺挕拻拰敁敃斪斿昶昡昲昵昜昦昢昳昫昺昝昴昹昮朏朐柁柲柈枺"],["cf40","柜枻柸柘柀枷柅柫柤柟枵柍枳柷柶柮柣柂枹柎柧柰枲柼柆柭柌枮柦柛柺柉柊柃柪柋欨殂殄殶毖毘毠氠氡洨洴洭洟洼洿洒洊泚洳洄洙洺洚洑洀洝浂"],["cfa1","洁洘洷洃洏浀洇洠洬洈洢洉洐炷炟炾炱炰炡炴炵炩牁牉牊牬牰牳牮狊狤狨狫狟狪狦狣玅珌珂珈珅玹玶玵玴珫玿珇玾珃珆玸珋瓬瓮甮畇畈疧疪癹盄眈眃眄眅眊盷盻盺矧矨砆砑砒砅砐砏砎砉砃砓祊祌祋祅祄秕种秏秖秎窀"],["d040","穾竑笀笁籺籸籹籿粀粁紃紈紁罘羑羍羾耇耎耏耔耷胘胇胠胑胈胂胐胅胣胙胜胊胕胉胏胗胦胍臿舡芔苙苾苹茇苨茀苕茺苫苖苴苬苡苲苵茌苻苶苰苪"],["d0a1","苤苠苺苳苭虷虴虼虳衁衎衧衪衩觓訄訇赲迣迡迮迠郱邽邿郕郅邾郇郋郈釔釓陔陏陑陓陊陎倞倅倇倓倢倰倛俵俴倳倷倬俶俷倗倜倠倧倵倯倱倎党冔冓凊凄凅凈凎剡剚剒剞剟剕剢勍匎厞唦哢唗唒哧哳哤唚哿唄唈哫唑唅哱"],["d140","唊哻哷哸哠唎唃唋圁圂埌堲埕埒垺埆垽垼垸垶垿埇埐垹埁夎奊娙娖娭娮娕娏娗娊娞娳孬宧宭宬尃屖屔峬峿峮峱峷崀峹帩帨庨庮庪庬弳弰彧恝恚恧"],["d1a1","恁悢悈悀悒悁悝悃悕悛悗悇悜悎戙扆拲挐捖挬捄捅挶捃揤挹捋捊挼挩捁挴捘捔捙挭捇挳捚捑挸捗捀捈敊敆旆旃旄旂晊晟晇晑朒朓栟栚桉栲栳栻桋桏栖栱栜栵栫栭栯桎桄栴栝栒栔栦栨栮桍栺栥栠欬欯欭欱欴歭肂殈毦毤"],["d240","毨毣毢毧氥浺浣浤浶洍浡涒浘浢浭浯涑涍淯浿涆浞浧浠涗浰浼浟涂涘洯浨涋浾涀涄洖涃浻浽浵涐烜烓烑烝烋缹烢烗烒烞烠烔烍烅烆烇烚烎烡牂牸"],["d2a1","牷牶猀狺狴狾狶狳狻猁珓珙珥珖玼珧珣珩珜珒珛珔珝珚珗珘珨瓞瓟瓴瓵甡畛畟疰痁疻痄痀疿疶疺皊盉眝眛眐眓眒眣眑眕眙眚眢眧砣砬砢砵砯砨砮砫砡砩砳砪砱祔祛祏祜祓祒祑秫秬秠秮秭秪秜秞秝窆窉窅窋窌窊窇竘笐"],["d340","笄笓笅笏笈笊笎笉笒粄粑粊粌粈粍粅紞紝紑紎紘紖紓紟紒紏紌罜罡罞罠罝罛羖羒翃翂翀耖耾耹胺胲胹胵脁胻脀舁舯舥茳茭荄茙荑茥荖茿荁茦茜茢"],["d3a1","荂荎茛茪茈茼荍茖茤茠茷茯茩荇荅荌荓茞茬荋茧荈虓虒蚢蚨蚖蚍蚑蚞蚇蚗蚆蚋蚚蚅蚥蚙蚡蚧蚕蚘蚎蚝蚐蚔衃衄衭衵衶衲袀衱衿衯袃衾衴衼訒豇豗豻貤貣赶赸趵趷趶軑軓迾迵适迿迻逄迼迶郖郠郙郚郣郟郥郘郛郗郜郤酐"],["d440","酎酏釕釢釚陜陟隼飣髟鬯乿偰偪偡偞偠偓偋偝偲偈偍偁偛偊偢倕偅偟偩偫偣偤偆偀偮偳偗偑凐剫剭剬剮勖勓匭厜啵啶唼啍啐唴唪啑啢唶唵唰啒啅"],["d4a1","唌唲啥啎唹啈唭唻啀啋圊圇埻堔埢埶埜埴堀埭埽堈埸堋埳埏堇埮埣埲埥埬埡堎埼堐埧堁堌埱埩埰堍堄奜婠婘婕婧婞娸娵婭婐婟婥婬婓婤婗婃婝婒婄婛婈媎娾婍娹婌婰婩婇婑婖婂婜孲孮寁寀屙崞崋崝崚崠崌崨崍崦崥崏"],["d540","崰崒崣崟崮帾帴庱庴庹庲庳弶弸徛徖徟悊悐悆悾悰悺惓惔惏惤惙惝惈悱惛悷惊悿惃惍惀挲捥掊掂捽掽掞掭掝掗掫掎捯掇掐据掯捵掜捭掮捼掤挻掟"],["d5a1","捸掅掁掑掍捰敓旍晥晡晛晙晜晢朘桹梇梐梜桭桮梮梫楖桯梣梬梩桵桴梲梏桷梒桼桫桲梪梀桱桾梛梖梋梠梉梤桸桻梑梌梊桽欶欳欷欸殑殏殍殎殌氪淀涫涴涳湴涬淩淢涷淶淔渀淈淠淟淖涾淥淜淝淛淴淊涽淭淰涺淕淂淏淉"],["d640","淐淲淓淽淗淍淣涻烺焍烷焗烴焌烰焄烳焐烼烿焆焓焀烸烶焋焂焎牾牻牼牿猝猗猇猑猘猊猈狿猏猞玈珶珸珵琄琁珽琇琀珺珼珿琌琋珴琈畤畣痎痒痏"],["d6a1","痋痌痑痐皏皉盓眹眯眭眱眲眴眳眽眥眻眵硈硒硉硍硊硌砦硅硐祤祧祩祪祣祫祡离秺秸秶秷窏窔窐笵筇笴笥笰笢笤笳笘笪笝笱笫笭笯笲笸笚笣粔粘粖粣紵紽紸紶紺絅紬紩絁絇紾紿絊紻紨罣羕羜羝羛翊翋翍翐翑翇翏翉耟"],["d740","耞耛聇聃聈脘脥脙脛脭脟脬脞脡脕脧脝脢舑舸舳舺舴舲艴莐莣莨莍荺荳莤荴莏莁莕莙荵莔莩荽莃莌莝莛莪莋荾莥莯莈莗莰荿莦莇莮荶莚虙虖蚿蚷"],["d7a1","蛂蛁蛅蚺蚰蛈蚹蚳蚸蛌蚴蚻蚼蛃蚽蚾衒袉袕袨袢袪袚袑袡袟袘袧袙袛袗袤袬袌袓袎覂觖觙觕訰訧訬訞谹谻豜豝豽貥赽赻赹趼跂趹趿跁軘軞軝軜軗軠軡逤逋逑逜逌逡郯郪郰郴郲郳郔郫郬郩酖酘酚酓酕釬釴釱釳釸釤釹釪"],["d840","釫釷釨釮镺閆閈陼陭陫陱陯隿靪頄飥馗傛傕傔傞傋傣傃傌傎傝偨傜傒傂傇兟凔匒匑厤厧喑喨喥喭啷噅喢喓喈喏喵喁喣喒喤啽喌喦啿喕喡喎圌堩堷"],["d8a1","堙堞堧堣堨埵塈堥堜堛堳堿堶堮堹堸堭堬堻奡媯媔媟婺媢媞婸媦婼媥媬媕媮娷媄媊媗媃媋媩婻婽媌媜媏媓媝寪寍寋寔寑寊寎尌尰崷嵃嵫嵁嵋崿崵嵑嵎嵕崳崺嵒崽崱嵙嵂崹嵉崸崼崲崶嵀嵅幄幁彘徦徥徫惉悹惌惢惎惄愔"],["d940","惲愊愖愅惵愓惸惼惾惁愃愘愝愐惿愄愋扊掔掱掰揎揥揨揯揃撝揳揊揠揶揕揲揵摡揟掾揝揜揄揘揓揂揇揌揋揈揰揗揙攲敧敪敤敜敨敥斌斝斞斮旐旒"],["d9a1","晼晬晻暀晱晹晪晲朁椌棓椄棜椪棬棪棱椏棖棷棫棤棶椓椐棳棡椇棌椈楰梴椑棯棆椔棸棐棽棼棨椋椊椗棎棈棝棞棦棴棑椆棔棩椕椥棇欹欻欿欼殔殗殙殕殽毰毲毳氰淼湆湇渟湉溈渼渽湅湢渫渿湁湝湳渜渳湋湀湑渻渃渮湞"],["da40","湨湜湡渱渨湠湱湫渹渢渰湓湥渧湸湤湷湕湹湒湦渵渶湚焠焞焯烻焮焱焣焥焢焲焟焨焺焛牋牚犈犉犆犅犋猒猋猰猢猱猳猧猲猭猦猣猵猌琮琬琰琫琖"],["daa1","琚琡琭琱琤琣琝琩琠琲瓻甯畯畬痧痚痡痦痝痟痤痗皕皒盚睆睇睄睍睅睊睎睋睌矞矬硠硤硥硜硭硱硪确硰硩硨硞硢祴祳祲祰稂稊稃稌稄窙竦竤筊笻筄筈筌筎筀筘筅粢粞粨粡絘絯絣絓絖絧絪絏絭絜絫絒絔絩絑絟絎缾缿罥"],["db40","罦羢羠羡翗聑聏聐胾胔腃腊腒腏腇脽腍脺臦臮臷臸臹舄舼舽舿艵茻菏菹萣菀菨萒菧菤菼菶萐菆菈菫菣莿萁菝菥菘菿菡菋菎菖菵菉萉萏菞萑萆菂菳"],["dba1","菕菺菇菑菪萓菃菬菮菄菻菗菢萛菛菾蛘蛢蛦蛓蛣蛚蛪蛝蛫蛜蛬蛩蛗蛨蛑衈衖衕袺裗袹袸裀袾袶袼袷袽袲褁裉覕覘覗觝觚觛詎詍訹詙詀詗詘詄詅詒詈詑詊詌詏豟貁貀貺貾貰貹貵趄趀趉跘跓跍跇跖跜跏跕跙跈跗跅軯軷軺"],["dc40","軹軦軮軥軵軧軨軶軫軱軬軴軩逭逴逯鄆鄬鄄郿郼鄈郹郻鄁鄀鄇鄅鄃酡酤酟酢酠鈁鈊鈥鈃鈚鈦鈏鈌鈀鈒釿釽鈆鈄鈧鈂鈜鈤鈙鈗鈅鈖镻閍閌閐隇陾隈"],["dca1","隉隃隀雂雈雃雱雰靬靰靮頇颩飫鳦黹亃亄亶傽傿僆傮僄僊傴僈僂傰僁傺傱僋僉傶傸凗剺剸剻剼嗃嗛嗌嗐嗋嗊嗝嗀嗔嗄嗩喿嗒喍嗏嗕嗢嗖嗈嗲嗍嗙嗂圔塓塨塤塏塍塉塯塕塎塝塙塥塛堽塣塱壼嫇嫄嫋媺媸媱媵媰媿嫈媻嫆"],["dd40","媷嫀嫊媴媶嫍媹媐寖寘寙尟尳嵱嵣嵊嵥嵲嵬嵞嵨嵧嵢巰幏幎幊幍幋廅廌廆廋廇彀徯徭惷慉慊愫慅愶愲愮慆愯慏愩慀戠酨戣戥戤揅揱揫搐搒搉搠搤"],["dda1","搳摃搟搕搘搹搷搢搣搌搦搰搨摁搵搯搊搚摀搥搧搋揧搛搮搡搎敯斒旓暆暌暕暐暋暊暙暔晸朠楦楟椸楎楢楱椿楅楪椹楂楗楙楺楈楉椵楬椳椽楥棰楸椴楩楀楯楄楶楘楁楴楌椻楋椷楜楏楑椲楒椯楻椼歆歅歃歂歈歁殛嗀毻毼"],["de40","毹毷毸溛滖滈溏滀溟溓溔溠溱溹滆滒溽滁溞滉溷溰滍溦滏溲溾滃滜滘溙溒溎溍溤溡溿溳滐滊溗溮溣煇煔煒煣煠煁煝煢煲煸煪煡煂煘煃煋煰煟煐煓"],["dea1","煄煍煚牏犍犌犑犐犎猼獂猻猺獀獊獉瑄瑊瑋瑒瑑瑗瑀瑏瑐瑎瑂瑆瑍瑔瓡瓿瓾瓽甝畹畷榃痯瘏瘃痷痾痼痹痸瘐痻痶痭痵痽皙皵盝睕睟睠睒睖睚睩睧睔睙睭矠碇碚碔碏碄碕碅碆碡碃硹碙碀碖硻祼禂祽祹稑稘稙稒稗稕稢稓"],["df40","稛稐窣窢窞竫筦筤筭筴筩筲筥筳筱筰筡筸筶筣粲粴粯綈綆綀綍絿綅絺綎絻綃絼綌綔綄絽綒罭罫罧罨罬羦羥羧翛翜耡腤腠腷腜腩腛腢腲朡腞腶腧腯"],["dfa1","腄腡舝艉艄艀艂艅蓱萿葖葶葹蒏蒍葥葑葀蒆葧萰葍葽葚葙葴葳葝蔇葞萷萺萴葺葃葸萲葅萩菙葋萯葂萭葟葰萹葎葌葒葯蓅蒎萻葇萶萳葨葾葄萫葠葔葮葐蜋蜄蛷蜌蛺蛖蛵蝍蛸蜎蜉蜁蛶蜍蜅裖裋裍裎裞裛裚裌裐覅覛觟觥觤"],["e040","觡觠觢觜触詶誆詿詡訿詷誂誄詵誃誁詴詺谼豋豊豥豤豦貆貄貅賌赨赩趑趌趎趏趍趓趔趐趒跰跠跬跱跮跐跩跣跢跧跲跫跴輆軿輁輀輅輇輈輂輋遒逿"],["e0a1","遄遉逽鄐鄍鄏鄑鄖鄔鄋鄎酮酯鉈鉒鈰鈺鉦鈳鉥鉞銃鈮鉊鉆鉭鉬鉏鉠鉧鉯鈶鉡鉰鈱鉔鉣鉐鉲鉎鉓鉌鉖鈲閟閜閞閛隒隓隑隗雎雺雽雸雵靳靷靸靲頏頍頎颬飶飹馯馲馰馵骭骫魛鳪鳭鳧麀黽僦僔僗僨僳僛僪僝僤僓僬僰僯僣僠"],["e140","凘劀劁勩勫匰厬嘧嘕嘌嘒嗼嘏嘜嘁嘓嘂嗺嘝嘄嗿嗹墉塼墐墘墆墁塿塴墋塺墇墑墎塶墂墈塻墔墏壾奫嫜嫮嫥嫕嫪嫚嫭嫫嫳嫢嫠嫛嫬嫞嫝嫙嫨嫟孷寠"],["e1a1","寣屣嶂嶀嵽嶆嵺嶁嵷嶊嶉嶈嵾嵼嶍嵹嵿幘幙幓廘廑廗廎廜廕廙廒廔彄彃彯徶愬愨慁慞慱慳慒慓慲慬憀慴慔慺慛慥愻慪慡慖戩戧戫搫摍摛摝摴摶摲摳摽摵摦撦摎撂摞摜摋摓摠摐摿搿摬摫摙摥摷敳斠暡暠暟朅朄朢榱榶槉"],["e240","榠槎榖榰榬榼榑榙榎榧榍榩榾榯榿槄榽榤槔榹槊榚槏榳榓榪榡榞槙榗榐槂榵榥槆歊歍歋殞殟殠毃毄毾滎滵滱漃漥滸漷滻漮漉潎漙漚漧漘漻漒滭漊"],["e2a1","漶潳滹滮漭潀漰漼漵滫漇漎潃漅滽滶漹漜滼漺漟漍漞漈漡熇熐熉熀熅熂熏煻熆熁熗牄牓犗犕犓獃獍獑獌瑢瑳瑱瑵瑲瑧瑮甀甂甃畽疐瘖瘈瘌瘕瘑瘊瘔皸瞁睼瞅瞂睮瞀睯睾瞃碲碪碴碭碨硾碫碞碥碠碬碢碤禘禊禋禖禕禔禓"],["e340","禗禈禒禐稫穊稰稯稨稦窨窫窬竮箈箜箊箑箐箖箍箌箛箎箅箘劄箙箤箂粻粿粼粺綧綷緂綣綪緁緀緅綝緎緄緆緋緌綯綹綖綼綟綦綮綩綡緉罳翢翣翥翞"],["e3a1","耤聝聜膉膆膃膇膍膌膋舕蒗蒤蒡蒟蒺蓎蓂蒬蒮蒫蒹蒴蓁蓍蒪蒚蒱蓐蒝蒧蒻蒢蒔蓇蓌蒛蒩蒯蒨蓖蒘蒶蓏蒠蓗蓔蓒蓛蒰蒑虡蜳蜣蜨蝫蝀蜮蜞蜡蜙蜛蝃蜬蝁蜾蝆蜠蜲蜪蜭蜼蜒蜺蜱蜵蝂蜦蜧蜸蜤蜚蜰蜑裷裧裱裲裺裾裮裼裶裻"],["e440","裰裬裫覝覡覟覞觩觫觨誫誙誋誒誏誖谽豨豩賕賏賗趖踉踂跿踍跽踊踃踇踆踅跾踀踄輐輑輎輍鄣鄜鄠鄢鄟鄝鄚鄤鄡鄛酺酲酹酳銥銤鉶銛鉺銠銔銪銍"],["e4a1","銦銚銫鉹銗鉿銣鋮銎銂銕銢鉽銈銡銊銆銌銙銧鉾銇銩銝銋鈭隞隡雿靘靽靺靾鞃鞀鞂靻鞄鞁靿韎韍頖颭颮餂餀餇馝馜駃馹馻馺駂馽駇骱髣髧鬾鬿魠魡魟鳱鳲鳵麧僿儃儰僸儆儇僶僾儋儌僽儊劋劌勱勯噈噂噌嘵噁噊噉噆噘"],["e540","噚噀嘳嘽嘬嘾嘸嘪嘺圚墫墝墱墠墣墯墬墥墡壿嫿嫴嫽嫷嫶嬃嫸嬂嫹嬁嬇嬅嬏屧嶙嶗嶟嶒嶢嶓嶕嶠嶜嶡嶚嶞幩幝幠幜緳廛廞廡彉徲憋憃慹憱憰憢憉"],["e5a1","憛憓憯憭憟憒憪憡憍慦憳戭摮摰撖撠撅撗撜撏撋撊撌撣撟摨撱撘敶敺敹敻斲斳暵暰暩暲暷暪暯樀樆樗槥槸樕槱槤樠槿槬槢樛樝槾樧槲槮樔槷槧橀樈槦槻樍槼槫樉樄樘樥樏槶樦樇槴樖歑殥殣殢殦氁氀毿氂潁漦潾澇濆澒"],["e640","澍澉澌潢潏澅潚澖潶潬澂潕潲潒潐潗澔澓潝漀潡潫潽潧澐潓澋潩潿澕潣潷潪潻熲熯熛熰熠熚熩熵熝熥熞熤熡熪熜熧熳犘犚獘獒獞獟獠獝獛獡獚獙"],["e6a1","獢璇璉璊璆璁瑽璅璈瑼瑹甈甇畾瘥瘞瘙瘝瘜瘣瘚瘨瘛皜皝皞皛瞍瞏瞉瞈磍碻磏磌磑磎磔磈磃磄磉禚禡禠禜禢禛歶稹窲窴窳箷篋箾箬篎箯箹篊箵糅糈糌糋緷緛緪緧緗緡縃緺緦緶緱緰緮緟罶羬羰羭翭翫翪翬翦翨聤聧膣膟"],["e740","膞膕膢膙膗舖艏艓艒艐艎艑蔤蔻蔏蔀蔩蔎蔉蔍蔟蔊蔧蔜蓻蔫蓺蔈蔌蓴蔪蓲蔕蓷蓫蓳蓼蔒蓪蓩蔖蓾蔨蔝蔮蔂蓽蔞蓶蔱蔦蓧蓨蓰蓯蓹蔘蔠蔰蔋蔙蔯虢"],["e7a1","蝖蝣蝤蝷蟡蝳蝘蝔蝛蝒蝡蝚蝑蝞蝭蝪蝐蝎蝟蝝蝯蝬蝺蝮蝜蝥蝏蝻蝵蝢蝧蝩衚褅褌褔褋褗褘褙褆褖褑褎褉覢覤覣觭觰觬諏諆誸諓諑諔諕誻諗誾諀諅諘諃誺誽諙谾豍貏賥賟賙賨賚賝賧趠趜趡趛踠踣踥踤踮踕踛踖踑踙踦踧"],["e840","踔踒踘踓踜踗踚輬輤輘輚輠輣輖輗遳遰遯遧遫鄯鄫鄩鄪鄲鄦鄮醅醆醊醁醂醄醀鋐鋃鋄鋀鋙銶鋏鋱鋟鋘鋩鋗鋝鋌鋯鋂鋨鋊鋈鋎鋦鋍鋕鋉鋠鋞鋧鋑鋓"],["e8a1","銵鋡鋆銴镼閬閫閮閰隤隢雓霅霈霂靚鞊鞎鞈韐韏頞頝頦頩頨頠頛頧颲餈飺餑餔餖餗餕駜駍駏駓駔駎駉駖駘駋駗駌骳髬髫髳髲髱魆魃魧魴魱魦魶魵魰魨魤魬鳼鳺鳽鳿鳷鴇鴀鳹鳻鴈鴅鴄麃黓鼏鼐儜儓儗儚儑凞匴叡噰噠噮"],["e940","噳噦噣噭噲噞噷圜圛壈墽壉墿墺壂墼壆嬗嬙嬛嬡嬔嬓嬐嬖嬨嬚嬠嬞寯嶬嶱嶩嶧嶵嶰嶮嶪嶨嶲嶭嶯嶴幧幨幦幯廩廧廦廨廥彋徼憝憨憖懅憴懆懁懌憺"],["e9a1","憿憸憌擗擖擐擏擉撽撉擃擛擳擙攳敿敼斢曈暾曀曊曋曏暽暻暺曌朣樴橦橉橧樲橨樾橝橭橶橛橑樨橚樻樿橁橪橤橐橏橔橯橩橠樼橞橖橕橍橎橆歕歔歖殧殪殫毈毇氄氃氆澭濋澣濇澼濎濈潞濄澽澞濊澨瀄澥澮澺澬澪濏澿澸"],["ea40","澢濉澫濍澯澲澰燅燂熿熸燖燀燁燋燔燊燇燏熽燘熼燆燚燛犝犞獩獦獧獬獥獫獪瑿璚璠璔璒璕璡甋疀瘯瘭瘱瘽瘳瘼瘵瘲瘰皻盦瞚瞝瞡瞜瞛瞢瞣瞕瞙"],["eaa1","瞗磝磩磥磪磞磣磛磡磢磭磟磠禤穄穈穇窶窸窵窱窷篞篣篧篝篕篥篚篨篹篔篪篢篜篫篘篟糒糔糗糐糑縒縡縗縌縟縠縓縎縜縕縚縢縋縏縖縍縔縥縤罃罻罼罺羱翯耪耩聬膱膦膮膹膵膫膰膬膴膲膷膧臲艕艖艗蕖蕅蕫蕍蕓蕡蕘"],["eb40","蕀蕆蕤蕁蕢蕄蕑蕇蕣蔾蕛蕱蕎蕮蕵蕕蕧蕠薌蕦蕝蕔蕥蕬虣虥虤螛螏螗螓螒螈螁螖螘蝹螇螣螅螐螑螝螄螔螜螚螉褞褦褰褭褮褧褱褢褩褣褯褬褟觱諠"],["eba1","諢諲諴諵諝謔諤諟諰諈諞諡諨諿諯諻貑貒貐賵賮賱賰賳赬赮趥趧踳踾踸蹀蹅踶踼踽蹁踰踿躽輶輮輵輲輹輷輴遶遹遻邆郺鄳鄵鄶醓醐醑醍醏錧錞錈錟錆錏鍺錸錼錛錣錒錁鍆錭錎錍鋋錝鋺錥錓鋹鋷錴錂錤鋿錩錹錵錪錔錌"],["ec40","錋鋾錉錀鋻錖閼闍閾閹閺閶閿閵閽隩雔霋霒霐鞙鞗鞔韰韸頵頯頲餤餟餧餩馞駮駬駥駤駰駣駪駩駧骹骿骴骻髶髺髹髷鬳鮀鮅鮇魼魾魻鮂鮓鮒鮐魺鮕"],["eca1","魽鮈鴥鴗鴠鴞鴔鴩鴝鴘鴢鴐鴙鴟麈麆麇麮麭黕黖黺鼒鼽儦儥儢儤儠儩勴嚓嚌嚍嚆嚄嚃噾嚂噿嚁壖壔壏壒嬭嬥嬲嬣嬬嬧嬦嬯嬮孻寱寲嶷幬幪徾徻懃憵憼懧懠懥懤懨懞擯擩擣擫擤擨斁斀斶旚曒檍檖檁檥檉檟檛檡檞檇檓檎"],["ed40","檕檃檨檤檑橿檦檚檅檌檒歛殭氉濌澩濴濔濣濜濭濧濦濞濲濝濢濨燡燱燨燲燤燰燢獳獮獯璗璲璫璐璪璭璱璥璯甐甑甒甏疄癃癈癉癇皤盩瞵瞫瞲瞷瞶"],["eda1","瞴瞱瞨矰磳磽礂磻磼磲礅磹磾礄禫禨穜穛穖穘穔穚窾竀竁簅簏篲簀篿篻簎篴簋篳簂簉簃簁篸篽簆篰篱簐簊糨縭縼繂縳顈縸縪繉繀繇縩繌縰縻縶繄縺罅罿罾罽翴翲耬膻臄臌臊臅臇膼臩艛艚艜薃薀薏薧薕薠薋薣蕻薤薚薞"],["ee40","蕷蕼薉薡蕺蕸蕗薎薖薆薍薙薝薁薢薂薈薅蕹蕶薘薐薟虨螾螪螭蟅螰螬螹螵螼螮蟉蟃蟂蟌螷螯蟄蟊螴螶螿螸螽蟞螲褵褳褼褾襁襒褷襂覭覯覮觲觳謞"],["eea1","謘謖謑謅謋謢謏謒謕謇謍謈謆謜謓謚豏豰豲豱豯貕貔賹赯蹎蹍蹓蹐蹌蹇轃轀邅遾鄸醚醢醛醙醟醡醝醠鎡鎃鎯鍤鍖鍇鍼鍘鍜鍶鍉鍐鍑鍠鍭鎏鍌鍪鍹鍗鍕鍒鍏鍱鍷鍻鍡鍞鍣鍧鎀鍎鍙闇闀闉闃闅閷隮隰隬霠霟霘霝霙鞚鞡鞜"],["ef40","鞞鞝韕韔韱顁顄顊顉顅顃餥餫餬餪餳餲餯餭餱餰馘馣馡騂駺駴駷駹駸駶駻駽駾駼騃骾髾髽鬁髼魈鮚鮨鮞鮛鮦鮡鮥鮤鮆鮢鮠鮯鴳鵁鵧鴶鴮鴯鴱鴸鴰"],["efa1","鵅鵂鵃鴾鴷鵀鴽翵鴭麊麉麍麰黈黚黻黿鼤鼣鼢齔龠儱儭儮嚘嚜嚗嚚嚝嚙奰嬼屩屪巀幭幮懘懟懭懮懱懪懰懫懖懩擿攄擽擸攁攃擼斔旛曚曛曘櫅檹檽櫡櫆檺檶檷櫇檴檭歞毉氋瀇瀌瀍瀁瀅瀔瀎濿瀀濻瀦濼濷瀊爁燿燹爃燽獶"],["f040","璸瓀璵瓁璾璶璻瓂甔甓癜癤癙癐癓癗癚皦皽盬矂瞺磿礌礓礔礉礐礒礑禭禬穟簜簩簙簠簟簭簝簦簨簢簥簰繜繐繖繣繘繢繟繑繠繗繓羵羳翷翸聵臑臒"],["f0a1","臐艟艞薴藆藀藃藂薳薵薽藇藄薿藋藎藈藅薱薶藒蘤薸薷薾虩蟧蟦蟢蟛蟫蟪蟥蟟蟳蟤蟔蟜蟓蟭蟘蟣螤蟗蟙蠁蟴蟨蟝襓襋襏襌襆襐襑襉謪謧謣謳謰謵譇謯謼謾謱謥謷謦謶謮謤謻謽謺豂豵貙貘貗賾贄贂贀蹜蹢蹠蹗蹖蹞蹥蹧"],["f140","蹛蹚蹡蹝蹩蹔轆轇轈轋鄨鄺鄻鄾醨醥醧醯醪鎵鎌鎒鎷鎛鎝鎉鎧鎎鎪鎞鎦鎕鎈鎙鎟鎍鎱鎑鎲鎤鎨鎴鎣鎥闒闓闑隳雗雚巂雟雘雝霣霢霥鞬鞮鞨鞫鞤鞪"],["f1a1","鞢鞥韗韙韖韘韺顐顑顒颸饁餼餺騏騋騉騍騄騑騊騅騇騆髀髜鬈鬄鬅鬩鬵魊魌魋鯇鯆鯃鮿鯁鮵鮸鯓鮶鯄鮹鮽鵜鵓鵏鵊鵛鵋鵙鵖鵌鵗鵒鵔鵟鵘鵚麎麌黟鼁鼀鼖鼥鼫鼪鼩鼨齌齕儴儵劖勷厴嚫嚭嚦嚧嚪嚬壚壝壛夒嬽嬾嬿巃幰"],["f240","徿懻攇攐攍攉攌攎斄旞旝曞櫧櫠櫌櫑櫙櫋櫟櫜櫐櫫櫏櫍櫞歠殰氌瀙瀧瀠瀖瀫瀡瀢瀣瀩瀗瀤瀜瀪爌爊爇爂爅犥犦犤犣犡瓋瓅璷瓃甖癠矉矊矄矱礝礛"],["f2a1","礡礜礗礞禰穧穨簳簼簹簬簻糬糪繶繵繸繰繷繯繺繲繴繨罋罊羃羆羷翽翾聸臗臕艤艡艣藫藱藭藙藡藨藚藗藬藲藸藘藟藣藜藑藰藦藯藞藢蠀蟺蠃蟶蟷蠉蠌蠋蠆蟼蠈蟿蠊蠂襢襚襛襗襡襜襘襝襙覈覷覶觶譐譈譊譀譓譖譔譋譕"],["f340","譑譂譒譗豃豷豶貚贆贇贉趬趪趭趫蹭蹸蹳蹪蹯蹻軂轒轑轏轐轓辴酀鄿醰醭鏞鏇鏏鏂鏚鏐鏹鏬鏌鏙鎩鏦鏊鏔鏮鏣鏕鏄鏎鏀鏒鏧镽闚闛雡霩霫霬霨霦"],["f3a1","鞳鞷鞶韝韞韟顜顙顝顗颿颽颻颾饈饇饃馦馧騚騕騥騝騤騛騢騠騧騣騞騜騔髂鬋鬊鬎鬌鬷鯪鯫鯠鯞鯤鯦鯢鯰鯔鯗鯬鯜鯙鯥鯕鯡鯚鵷鶁鶊鶄鶈鵱鶀鵸鶆鶋鶌鵽鵫鵴鵵鵰鵩鶅鵳鵻鶂鵯鵹鵿鶇鵨麔麑黀黼鼭齀齁齍齖齗齘匷嚲"],["f440","嚵嚳壣孅巆巇廮廯忀忁懹攗攖攕攓旟曨曣曤櫳櫰櫪櫨櫹櫱櫮櫯瀼瀵瀯瀷瀴瀱灂瀸瀿瀺瀹灀瀻瀳灁爓爔犨獽獼璺皫皪皾盭矌矎矏矍矲礥礣礧礨礤礩"],["f4a1","禲穮穬穭竷籉籈籊籇籅糮繻繾纁纀羺翿聹臛臙舋艨艩蘢藿蘁藾蘛蘀藶蘄蘉蘅蘌藽蠙蠐蠑蠗蠓蠖襣襦覹觷譠譪譝譨譣譥譧譭趮躆躈躄轙轖轗轕轘轚邍酃酁醷醵醲醳鐋鐓鏻鐠鐏鐔鏾鐕鐐鐨鐙鐍鏵鐀鏷鐇鐎鐖鐒鏺鐉鏸鐊鏿"],["f540","鏼鐌鏶鐑鐆闞闠闟霮霯鞹鞻韽韾顠顢顣顟飁飂饐饎饙饌饋饓騲騴騱騬騪騶騩騮騸騭髇髊髆鬐鬒鬑鰋鰈鯷鰅鰒鯸鱀鰇鰎鰆鰗鰔鰉鶟鶙鶤鶝鶒鶘鶐鶛"],["f5a1","鶠鶔鶜鶪鶗鶡鶚鶢鶨鶞鶣鶿鶩鶖鶦鶧麙麛麚黥黤黧黦鼰鼮齛齠齞齝齙龑儺儹劘劗囃嚽嚾孈孇巋巏廱懽攛欂櫼欃櫸欀灃灄灊灈灉灅灆爝爚爙獾甗癪矐礭礱礯籔籓糲纊纇纈纋纆纍罍羻耰臝蘘蘪蘦蘟蘣蘜蘙蘧蘮蘡蘠蘩蘞蘥"],["f640","蠩蠝蠛蠠蠤蠜蠫衊襭襩襮襫觺譹譸譅譺譻贐贔趯躎躌轞轛轝酆酄酅醹鐿鐻鐶鐩鐽鐼鐰鐹鐪鐷鐬鑀鐱闥闤闣霵霺鞿韡顤飉飆飀饘饖騹騽驆驄驂驁騺"],["f6a1","騿髍鬕鬗鬘鬖鬺魒鰫鰝鰜鰬鰣鰨鰩鰤鰡鶷鶶鶼鷁鷇鷊鷏鶾鷅鷃鶻鶵鷎鶹鶺鶬鷈鶱鶭鷌鶳鷍鶲鹺麜黫黮黭鼛鼘鼚鼱齎齥齤龒亹囆囅囋奱孋孌巕巑廲攡攠攦攢欋欈欉氍灕灖灗灒爞爟犩獿瓘瓕瓙瓗癭皭礵禴穰穱籗籜籙籛籚"],["f740","糴糱纑罏羇臞艫蘴蘵蘳蘬蘲蘶蠬蠨蠦蠪蠥襱覿覾觻譾讄讂讆讅譿贕躕躔躚躒躐躖躗轠轢酇鑌鑐鑊鑋鑏鑇鑅鑈鑉鑆霿韣顪顩飋饔饛驎驓驔驌驏驈驊"],["f7a1","驉驒驐髐鬙鬫鬻魖魕鱆鱈鰿鱄鰹鰳鱁鰼鰷鰴鰲鰽鰶鷛鷒鷞鷚鷋鷐鷜鷑鷟鷩鷙鷘鷖鷵鷕鷝麶黰鼵鼳鼲齂齫龕龢儽劙壨壧奲孍巘蠯彏戁戃戄攩攥斖曫欑欒欏毊灛灚爢玂玁玃癰矔籧籦纕艬蘺虀蘹蘼蘱蘻蘾蠰蠲蠮蠳襶襴襳觾"],["f840","讌讎讋讈豅贙躘轤轣醼鑢鑕鑝鑗鑞韄韅頀驖驙鬞鬟鬠鱒鱘鱐鱊鱍鱋鱕鱙鱌鱎鷻鷷鷯鷣鷫鷸鷤鷶鷡鷮鷦鷲鷰鷢鷬鷴鷳鷨鷭黂黐黲黳鼆鼜鼸鼷鼶齃齏"],["f8a1","齱齰齮齯囓囍孎屭攭曭曮欓灟灡灝灠爣瓛瓥矕礸禷禶籪纗羉艭虃蠸蠷蠵衋讔讕躞躟躠躝醾醽釂鑫鑨鑩雥靆靃靇韇韥驞髕魙鱣鱧鱦鱢鱞鱠鸂鷾鸇鸃鸆鸅鸀鸁鸉鷿鷽鸄麠鼞齆齴齵齶囔攮斸欘欙欗欚灢爦犪矘矙礹籩籫糶纚"],["f940","纘纛纙臠臡虆虇虈襹襺襼襻觿讘讙躥躤躣鑮鑭鑯鑱鑳靉顲饟鱨鱮鱭鸋鸍鸐鸏鸒鸑麡黵鼉齇齸齻齺齹圞灦籯蠼趲躦釃鑴鑸鑶鑵驠鱴鱳鱱鱵鸔鸓黶鼊"],["f9a1","龤灨灥糷虪蠾蠽蠿讞貜躩軉靋顳顴飌饡馫驤驦驧鬤鸕鸗齈戇欞爧虌躨钂钀钁驩驨鬮鸙爩虋讟钃鱹麷癵驫鱺鸝灩灪麤齾齉龘碁銹裏墻恒粧嫺╔╦╗╠╬╣╚╩╝╒╤╕╞╪╡╘╧╛╓╥╖╟╫╢╙╨╜║═╭╮╰╯▓"]]},{}],106:[function(e,t,r){t.exports=[["0","\x00",127],["8ea1","｡",62],["a1a1","　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈",9,"＋－±×÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇"],["a2a1","◆□■△▲▽▼※〒→←↑↓〓"],["a2ba","∈∋⊆⊇⊂⊃∪∩"],["a2ca","∧∨￢⇒⇔∀∃"],["a2dc","∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬"],["a2f2","Å‰♯♭♪†‡¶"],["a2fe","◯"],["a3b0","０",9],["a3c1","Ａ",25],["a3e1","ａ",25],["a4a1","ぁ",82],["a5a1","ァ",85],["a6a1","Α",16,"Σ",6],["a6c1","α",16,"σ",6],["a7a1","А",5,"ЁЖ",25],["a7d1","а",5,"ёж",25],["a8a1","─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂"],["ada1","①",19,"Ⅰ",9],["adc0","㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡"],["addf","㍻〝〟№㏍℡㊤",4,"㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪"],["b0a1","亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭"],["b1a1","院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応"],["b2a1","押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改"],["b3a1","魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱"],["b4a1","粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄"],["b5a1","機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京"],["b6a1","供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈"],["b7a1","掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲"],["b8a1","検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向"],["b9a1","后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込"],["baa1","此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷"],["bba1","察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時"],["bca1","次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周"],["bda1","宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償"],["bea1","勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾"],["bfa1","拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾"],["c0a1","澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線"],["c1a1","繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎"],["c2a1","臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只"],["c3a1","叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵"],["c4a1","帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓"],["c5a1","邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到"],["c6a1","董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入"],["c7a1","如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦"],["c8a1","函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美"],["c9a1","鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服"],["caa1","福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋"],["cba1","法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満"],["cca1","漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒"],["cda1","諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃"],["cea1","痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯"],["cfa1","蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕"],["d0a1","弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲"],["d1a1","僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨"],["d2a1","辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨"],["d3a1","咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉"],["d4a1","圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩"],["d5a1","奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓"],["d6a1","屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏"],["d7a1","廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚"],["d8a1","悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛"],["d9a1","戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼"],["daa1","據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼"],["dba1","曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍"],["dca1","棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣"],["dda1","檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾"],["dea1","沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌"],["dfa1","漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼"],["e0a1","燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱"],["e1a1","瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰"],["e2a1","癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬"],["e3a1","磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐"],["e4a1","筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆"],["e5a1","紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺"],["e6a1","罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋"],["e7a1","隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙"],["e8a1","茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈"],["e9a1","蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙"],["eaa1","蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞"],["eba1","襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫"],["eca1","譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊"],["eda1","蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸"],["eea1","遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮"],["efa1","錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞"],["f0a1","陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰"],["f1a1","顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷"],["f2a1","髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈"],["f3a1","鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠"],["f4a1","堯槇遙瑤凜熙"],["f9a1","纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德"],["faa1","忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱"],["fba1","犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚"],["fca1","釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"],["fcf1","ⅰ",9,"￢￤＇＂"],["8fa2af","˘ˇ¸˙˝¯˛˚～΄΅"],["8fa2c2","¡¦¿"],["8fa2eb","ºª©®™¤№"],["8fa6e1","ΆΈΉΊΪ"],["8fa6e7","Ό"],["8fa6e9","ΎΫ"],["8fa6ec","Ώ"],["8fa6f1","άέήίϊΐόςύϋΰώ"],["8fa7c2","Ђ",10,"ЎЏ"],["8fa7f2","ђ",10,"ўџ"],["8fa9a1","ÆĐ"],["8fa9a4","Ħ"],["8fa9a6","Ĳ"],["8fa9a8","ŁĿ"],["8fa9ab","ŊØŒ"],["8fa9af","ŦÞ"],["8fa9c1","æđðħıĳĸłŀŉŋøœßŧþ"],["8faaa1","ÁÀÄÂĂǍĀĄÅÃĆĈČÇĊĎÉÈËÊĚĖĒĘ"],["8faaba","ĜĞĢĠĤÍÌÏÎǏİĪĮĨĴĶĹĽĻŃŇŅÑÓÒÖÔǑŐŌÕŔŘŖŚŜŠŞŤŢÚÙÜÛŬǓŰŪŲŮŨǗǛǙǕŴÝŸŶŹŽŻ"],["8faba1","áàäâăǎāąåãćĉčçċďéèëêěėēęǵĝğ"],["8fabbd","ġĥíìïîǐ"],["8fabc5","īįĩĵķĺľļńňņñóòöôǒőōõŕřŗśŝšşťţúùüûŭǔűūųůũǘǜǚǖŵýÿŷźžż"],["8fb0a1","丂丄丅丌丒丟丣两丨丫丮丯丰丵乀乁乄乇乑乚乜乣乨乩乴乵乹乿亍亖亗亝亯亹仃仐仚仛仠仡仢仨仯仱仳仵份仾仿伀伂伃伈伋伌伒伕伖众伙伮伱你伳伵伷伹伻伾佀佂佈佉佋佌佒佔佖佘佟佣佪佬佮佱佷佸佹佺佽佾侁侂侄"],["8fb1a1","侅侉侊侌侎侐侒侓侔侗侙侚侞侟侲侷侹侻侼侽侾俀俁俅俆俈俉俋俌俍俏俒俜俠俢俰俲俼俽俿倀倁倄倇倊倌倎倐倓倗倘倛倜倝倞倢倧倮倰倲倳倵偀偁偂偅偆偊偌偎偑偒偓偗偙偟偠偢偣偦偧偪偭偰偱倻傁傃傄傆傊傎傏傐"],["8fb2a1","傒傓傔傖傛傜傞",4,"傪傯傰傹傺傽僀僃僄僇僌僎僐僓僔僘僜僝僟僢僤僦僨僩僯僱僶僺僾儃儆儇儈儋儌儍儎僲儐儗儙儛儜儝儞儣儧儨儬儭儯儱儳儴儵儸儹兂兊兏兓兕兗兘兟兤兦兾冃冄冋冎冘冝冡冣冭冸冺冼冾冿凂"],["8fb3a1","凈减凑凒凓凕凘凞凢凥凮凲凳凴凷刁刂刅划刓刕刖刘刢刨刱刲刵刼剅剉剕剗剘剚剜剟剠剡剦剮剷剸剹劀劂劅劊劌劓劕劖劗劘劚劜劤劥劦劧劯劰劶劷劸劺劻劽勀勄勆勈勌勏勑勔勖勛勜勡勥勨勩勪勬勰勱勴勶勷匀匃匊匋"],["8fb4a1","匌匑匓匘匛匜匞匟匥匧匨匩匫匬匭匰匲匵匼匽匾卂卌卋卙卛卡卣卥卬卭卲卹卾厃厇厈厎厓厔厙厝厡厤厪厫厯厲厴厵厷厸厺厽叀叅叏叒叓叕叚叝叞叠另叧叵吂吓吚吡吧吨吪启吱吴吵呃呄呇呍呏呞呢呤呦呧呩呫呭呮呴呿"],["8fb5a1","咁咃咅咈咉咍咑咕咖咜咟咡咦咧咩咪咭咮咱咷咹咺咻咿哆哊响哎哠哪哬哯哶哼哾哿唀唁唅唈唉唌唍唎唕唪唫唲唵唶唻唼唽啁啇啉啊啍啐啑啘啚啛啞啠啡啤啦啿喁喂喆喈喎喏喑喒喓喔喗喣喤喭喲喿嗁嗃嗆嗉嗋嗌嗎嗑嗒"],["8fb6a1","嗓嗗嗘嗛嗞嗢嗩嗶嗿嘅嘈嘊嘍",5,"嘙嘬嘰嘳嘵嘷嘹嘻嘼嘽嘿噀噁噃噄噆噉噋噍噏噔噞噠噡噢噣噦噩噭噯噱噲噵嚄嚅嚈嚋嚌嚕嚙嚚嚝嚞嚟嚦嚧嚨嚩嚫嚬嚭嚱嚳嚷嚾囅囉囊囋囏囐囌囍囙囜囝囟囡囤",4,"囱囫园"],["8fb7a1","囶囷圁圂圇圊圌圑圕圚圛圝圠圢圣圤圥圩圪圬圮圯圳圴圽圾圿坅坆坌坍坒坢坥坧坨坫坭",4,"坳坴坵坷坹坺坻坼坾垁垃垌垔垗垙垚垜垝垞垟垡垕垧垨垩垬垸垽埇埈埌埏埕埝埞埤埦埧埩埭埰埵埶埸埽埾埿堃堄堈堉埡"],["8fb8a1","堌堍堛堞堟堠堦堧堭堲堹堿塉塌塍塏塐塕塟塡塤塧塨塸塼塿墀墁墇墈墉墊墌墍墏墐墔墖墝墠墡墢墦墩墱墲壄墼壂壈壍壎壐壒壔壖壚壝壡壢壩壳夅夆夋夌夒夓夔虁夝夡夣夤夨夯夰夳夵夶夿奃奆奒奓奙奛奝奞奟奡奣奫奭"],["8fb9a1","奯奲奵奶她奻奼妋妌妎妒妕妗妟妤妧妭妮妯妰妳妷妺妼姁姃姄姈姊姍姒姝姞姟姣姤姧姮姯姱姲姴姷娀娄娌娍娎娒娓娞娣娤娧娨娪娭娰婄婅婇婈婌婐婕婞婣婥婧婭婷婺婻婾媋媐媓媖媙媜媞媟媠媢媧媬媱媲媳媵媸媺媻媿"],["8fbaa1","嫄嫆嫈嫏嫚嫜嫠嫥嫪嫮嫵嫶嫽嬀嬁嬈嬗嬴嬙嬛嬝嬡嬥嬭嬸孁孋孌孒孖孞孨孮孯孼孽孾孿宁宄宆宊宎宐宑宓宔宖宨宩宬宭宯宱宲宷宺宼寀寁寍寏寖",4,"寠寯寱寴寽尌尗尞尟尣尦尩尫尬尮尰尲尵尶屙屚屜屢屣屧屨屩"],["8fbba1","屭屰屴屵屺屻屼屽岇岈岊岏岒岝岟岠岢岣岦岪岲岴岵岺峉峋峒峝峗峮峱峲峴崁崆崍崒崫崣崤崦崧崱崴崹崽崿嵂嵃嵆嵈嵕嵑嵙嵊嵟嵠嵡嵢嵤嵪嵭嵰嵹嵺嵾嵿嶁嶃嶈嶊嶒嶓嶔嶕嶙嶛嶟嶠嶧嶫嶰嶴嶸嶹巃巇巋巐巎巘巙巠巤"],["8fbca1","巩巸巹帀帇帍帒帔帕帘帟帠帮帨帲帵帾幋幐幉幑幖幘幛幜幞幨幪",4,"幰庀庋庎庢庤庥庨庪庬庱庳庽庾庿廆廌廋廎廑廒廔廕廜廞廥廫异弆弇弈弎弙弜弝弡弢弣弤弨弫弬弮弰弴弶弻弽弿彀彄彅彇彍彐彔彘彛彠彣彤彧"],["8fbda1","彯彲彴彵彸彺彽彾徉徍徏徖徜徝徢徧徫徤徬徯徰徱徸忄忇忈忉忋忐",4,"忞忡忢忨忩忪忬忭忮忯忲忳忶忺忼怇怊怍怓怔怗怘怚怟怤怭怳怵恀恇恈恉恌恑恔恖恗恝恡恧恱恾恿悂悆悈悊悎悑悓悕悘悝悞悢悤悥您悰悱悷"],["8fbea1","悻悾惂惄惈惉惊惋惎惏惔惕惙惛惝惞惢惥惲惵惸惼惽愂愇愊愌愐",4,"愖愗愙愜愞愢愪愫愰愱愵愶愷愹慁慅慆慉慞慠慬慲慸慻慼慿憀憁憃憄憋憍憒憓憗憘憜憝憟憠憥憨憪憭憸憹憼懀懁懂懎懏懕懜懝懞懟懡懢懧懩懥"],["8fbfa1","懬懭懯戁戃戄戇戓戕戜戠戢戣戧戩戫戹戽扂扃扄扆扌扐扑扒扔扖扚扜扤扭扯扳扺扽抍抎抏抐抦抨抳抶抷抺抾抿拄拎拕拖拚拪拲拴拼拽挃挄挊挋挍挐挓挖挘挩挪挭挵挶挹挼捁捂捃捄捆捊捋捎捒捓捔捘捛捥捦捬捭捱捴捵"],["8fc0a1","捸捼捽捿掂掄掇掊掐掔掕掙掚掞掤掦掭掮掯掽揁揅揈揎揑揓揔揕揜揠揥揪揬揲揳揵揸揹搉搊搐搒搔搘搞搠搢搤搥搩搪搯搰搵搽搿摋摏摑摒摓摔摚摛摜摝摟摠摡摣摭摳摴摻摽撅撇撏撐撑撘撙撛撝撟撡撣撦撨撬撳撽撾撿"],["8fc1a1","擄擉擊擋擌擎擐擑擕擗擤擥擩擪擭擰擵擷擻擿攁攄攈攉攊攏攓攔攖攙攛攞攟攢攦攩攮攱攺攼攽敃敇敉敐敒敔敟敠敧敫敺敽斁斅斊斒斕斘斝斠斣斦斮斲斳斴斿旂旈旉旎旐旔旖旘旟旰旲旴旵旹旾旿昀昄昈昉昍昑昒昕昖昝"],["8fc2a1","昞昡昢昣昤昦昩昪昫昬昮昰昱昳昹昷晀晅晆晊晌晑晎晗晘晙晛晜晠晡曻晪晫晬晾晳晵晿晷晸晹晻暀晼暋暌暍暐暒暙暚暛暜暟暠暤暭暱暲暵暻暿曀曂曃曈曌曎曏曔曛曟曨曫曬曮曺朅朇朎朓朙朜朠朢朳朾杅杇杈杌杔杕杝"],["8fc3a1","杦杬杮杴杶杻极构枎枏枑枓枖枘枙枛枰枱枲枵枻枼枽柹柀柂柃柅柈柉柒柗柙柜柡柦柰柲柶柷桒栔栙栝栟栨栧栬栭栯栰栱栳栻栿桄桅桊桌桕桗桘桛桫桮",4,"桵桹桺桻桼梂梄梆梈梖梘梚梜梡梣梥梩梪梮梲梻棅棈棌棏"],["8fc4a1","棐棑棓棖棙棜棝棥棨棪棫棬棭棰棱棵棶棻棼棽椆椉椊椐椑椓椖椗椱椳椵椸椻楂楅楉楎楗楛楣楤楥楦楨楩楬楰楱楲楺楻楿榀榍榒榖榘榡榥榦榨榫榭榯榷榸榺榼槅槈槑槖槗槢槥槮槯槱槳槵槾樀樁樃樏樑樕樚樝樠樤樨樰樲"],["8fc5a1","樴樷樻樾樿橅橆橉橊橎橐橑橒橕橖橛橤橧橪橱橳橾檁檃檆檇檉檋檑檛檝檞檟檥檫檯檰檱檴檽檾檿櫆櫉櫈櫌櫐櫔櫕櫖櫜櫝櫤櫧櫬櫰櫱櫲櫼櫽欂欃欆欇欉欏欐欑欗欛欞欤欨欫欬欯欵欶欻欿歆歊歍歒歖歘歝歠歧歫歮歰歵歽"],["8fc6a1","歾殂殅殗殛殟殠殢殣殨殩殬殭殮殰殸殹殽殾毃毄毉毌毖毚毡毣毦毧毮毱毷毹毿氂氄氅氉氍氎氐氒氙氟氦氧氨氬氮氳氵氶氺氻氿汊汋汍汏汒汔汙汛汜汫汭汯汴汶汸汹汻沅沆沇沉沔沕沗沘沜沟沰沲沴泂泆泍泏泐泑泒泔泖"],["8fc7a1","泚泜泠泧泩泫泬泮泲泴洄洇洊洎洏洑洓洚洦洧洨汧洮洯洱洹洼洿浗浞浟浡浥浧浯浰浼涂涇涑涒涔涖涗涘涪涬涴涷涹涽涿淄淈淊淎淏淖淛淝淟淠淢淥淩淯淰淴淶淼渀渄渞渢渧渲渶渹渻渼湄湅湈湉湋湏湑湒湓湔湗湜湝湞"],["8fc8a1","湢湣湨湳湻湽溍溓溙溠溧溭溮溱溳溻溿滀滁滃滇滈滊滍滎滏滫滭滮滹滻滽漄漈漊漌漍漖漘漚漛漦漩漪漯漰漳漶漻漼漭潏潑潒潓潗潙潚潝潞潡潢潨潬潽潾澃澇澈澋澌澍澐澒澓澔澖澚澟澠澥澦澧澨澮澯澰澵澶澼濅濇濈濊"],["8fc9a1","濚濞濨濩濰濵濹濼濽瀀瀅瀆瀇瀍瀗瀠瀣瀯瀴瀷瀹瀼灃灄灈灉灊灋灔灕灝灞灎灤灥灬灮灵灶灾炁炅炆炔",4,"炛炤炫炰炱炴炷烊烑烓烔烕烖烘烜烤烺焃",4,"焋焌焏焞焠焫焭焯焰焱焸煁煅煆煇煊煋煐煒煗煚煜煞煠"],["8fcaa1","煨煹熀熅熇熌熒熚熛熠熢熯熰熲熳熺熿燀燁燄燋燌燓燖燙燚燜燸燾爀爇爈爉爓爗爚爝爟爤爫爯爴爸爹牁牂牃牅牎牏牐牓牕牖牚牜牞牠牣牨牫牮牯牱牷牸牻牼牿犄犉犍犎犓犛犨犭犮犱犴犾狁狇狉狌狕狖狘狟狥狳狴狺狻"],["8fcba1","狾猂猄猅猇猋猍猒猓猘猙猞猢猤猧猨猬猱猲猵猺猻猽獃獍獐獒獖獘獝獞獟獠獦獧獩獫獬獮獯獱獷獹獼玀玁玃玅玆玎玐玓玕玗玘玜玞玟玠玢玥玦玪玫玭玵玷玹玼玽玿珅珆珉珋珌珏珒珓珖珙珝珡珣珦珧珩珴珵珷珹珺珻珽"],["8fcca1","珿琀琁琄琇琊琑琚琛琤琦琨",9,"琹瑀瑃瑄瑆瑇瑋瑍瑑瑒瑗瑝瑢瑦瑧瑨瑫瑭瑮瑱瑲璀璁璅璆璇璉璏璐璑璒璘璙璚璜璟璠璡璣璦璨璩璪璫璮璯璱璲璵璹璻璿瓈瓉瓌瓐瓓瓘瓚瓛瓞瓟瓤瓨瓪瓫瓯瓴瓺瓻瓼瓿甆"],["8fcda1","甒甖甗甠甡甤甧甩甪甯甶甹甽甾甿畀畃畇畈畎畐畒畗畞畟畡畯畱畹",5,"疁疅疐疒疓疕疙疜疢疤疴疺疿痀痁痄痆痌痎痏痗痜痟痠痡痤痧痬痮痯痱痹瘀瘂瘃瘄瘇瘈瘊瘌瘏瘒瘓瘕瘖瘙瘛瘜瘝瘞瘣瘥瘦瘩瘭瘲瘳瘵瘸瘹"],["8fcea1","瘺瘼癊癀癁癃癄癅癉癋癕癙癟癤癥癭癮癯癱癴皁皅皌皍皕皛皜皝皟皠皢",6,"皪皭皽盁盅盉盋盌盎盔盙盠盦盨盬盰盱盶盹盼眀眆眊眎眒眔眕眗眙眚眜眢眨眭眮眯眴眵眶眹眽眾睂睅睆睊睍睎睏睒睖睗睜睞睟睠睢"],["8fcfa1","睤睧睪睬睰睲睳睴睺睽瞀瞄瞌瞍瞔瞕瞖瞚瞟瞢瞧瞪瞮瞯瞱瞵瞾矃矉矑矒矕矙矞矟矠矤矦矪矬矰矱矴矸矻砅砆砉砍砎砑砝砡砢砣砭砮砰砵砷硃硄硇硈硌硎硒硜硞硠硡硣硤硨硪确硺硾碊碏碔碘碡碝碞碟碤碨碬碭碰碱碲碳"],["8fd0a1","碻碽碿磇磈磉磌磎磒磓磕磖磤磛磟磠磡磦磪磲磳礀磶磷磺磻磿礆礌礐礚礜礞礟礠礥礧礩礭礱礴礵礻礽礿祄祅祆祊祋祏祑祔祘祛祜祧祩祫祲祹祻祼祾禋禌禑禓禔禕禖禘禛禜禡禨禩禫禯禱禴禸离秂秄秇秈秊秏秔秖秚秝秞"],["8fd1a1","秠秢秥秪秫秭秱秸秼稂稃稇稉稊稌稑稕稛稞稡稧稫稭稯稰稴稵稸稹稺穄穅穇穈穌穕穖穙穜穝穟穠穥穧穪穭穵穸穾窀窂窅窆窊窋窐窑窔窞窠窣窬窳窵窹窻窼竆竉竌竎竑竛竨竩竫竬竱竴竻竽竾笇笔笟笣笧笩笪笫笭笮笯笰"],["8fd2a1","笱笴笽笿筀筁筇筎筕筠筤筦筩筪筭筯筲筳筷箄箉箎箐箑箖箛箞箠箥箬箯箰箲箵箶箺箻箼箽篂篅篈篊篔篖篗篙篚篛篨篪篲篴篵篸篹篺篼篾簁簂簃簄簆簉簋簌簎簏簙簛簠簥簦簨簬簱簳簴簶簹簺籆籊籕籑籒籓籙",5],["8fd3a1","籡籣籧籩籭籮籰籲籹籼籽粆粇粏粔粞粠粦粰粶粷粺粻粼粿糄糇糈糉糍糏糓糔糕糗糙糚糝糦糩糫糵紃紇紈紉紏紑紒紓紖紝紞紣紦紪紭紱紼紽紾絀絁絇絈絍絑絓絗絙絚絜絝絥絧絪絰絸絺絻絿綁綂綃綅綆綈綋綌綍綑綖綗綝"],["8fd4a1","綞綦綧綪綳綶綷綹緂",4,"緌緍緎緗緙縀緢緥緦緪緫緭緱緵緶緹緺縈縐縑縕縗縜縝縠縧縨縬縭縯縳縶縿繄繅繇繎繐繒繘繟繡繢繥繫繮繯繳繸繾纁纆纇纊纍纑纕纘纚纝纞缼缻缽缾缿罃罄罇罏罒罓罛罜罝罡罣罤罥罦罭"],["8fd5a1","罱罽罾罿羀羋羍羏羐羑羖羗羜羡羢羦羪羭羴羼羿翀翃翈翎翏翛翟翣翥翨翬翮翯翲翺翽翾翿耇耈耊耍耎耏耑耓耔耖耝耞耟耠耤耦耬耮耰耴耵耷耹耺耼耾聀聄聠聤聦聭聱聵肁肈肎肜肞肦肧肫肸肹胈胍胏胒胔胕胗胘胠胭胮"],["8fd6a1","胰胲胳胶胹胺胾脃脋脖脗脘脜脞脠脤脧脬脰脵脺脼腅腇腊腌腒腗腠腡腧腨腩腭腯腷膁膐膄膅膆膋膎膖膘膛膞膢膮膲膴膻臋臃臅臊臎臏臕臗臛臝臞臡臤臫臬臰臱臲臵臶臸臹臽臿舀舃舏舓舔舙舚舝舡舢舨舲舴舺艃艄艅艆"],["8fd7a1","艋艎艏艑艖艜艠艣艧艭艴艻艽艿芀芁芃芄芇芉芊芎芑芔芖芘芚芛芠芡芣芤芧芨芩芪芮芰芲芴芷芺芼芾芿苆苐苕苚苠苢苤苨苪苭苯苶苷苽苾茀茁茇茈茊茋荔茛茝茞茟茡茢茬茭茮茰茳茷茺茼茽荂荃荄荇荍荎荑荕荖荗荰荸"],["8fd8a1","荽荿莀莂莄莆莍莒莔莕莘莙莛莜莝莦莧莩莬莾莿菀菇菉菏菐菑菔菝荓菨菪菶菸菹菼萁萆萊萏萑萕萙莭萯萹葅葇葈葊葍葏葑葒葖葘葙葚葜葠葤葥葧葪葰葳葴葶葸葼葽蒁蒅蒒蒓蒕蒞蒦蒨蒩蒪蒯蒱蒴蒺蒽蒾蓀蓂蓇蓈蓌蓏蓓"],["8fd9a1","蓜蓧蓪蓯蓰蓱蓲蓷蔲蓺蓻蓽蔂蔃蔇蔌蔎蔐蔜蔞蔢蔣蔤蔥蔧蔪蔫蔯蔳蔴蔶蔿蕆蕏",4,"蕖蕙蕜",6,"蕤蕫蕯蕹蕺蕻蕽蕿薁薅薆薉薋薌薏薓薘薝薟薠薢薥薧薴薶薷薸薼薽薾薿藂藇藊藋藎薭藘藚藟藠藦藨藭藳藶藼"],["8fdaa1","藿蘀蘄蘅蘍蘎蘐蘑蘒蘘蘙蘛蘞蘡蘧蘩蘶蘸蘺蘼蘽虀虂虆虒虓虖虗虘虙虝虠",4,"虩虬虯虵虶虷虺蚍蚑蚖蚘蚚蚜蚡蚦蚧蚨蚭蚱蚳蚴蚵蚷蚸蚹蚿蛀蛁蛃蛅蛑蛒蛕蛗蛚蛜蛠蛣蛥蛧蚈蛺蛼蛽蜄蜅蜇蜋蜎蜏蜐蜓蜔蜙蜞蜟蜡蜣"],["8fdba1","蜨蜮蜯蜱蜲蜹蜺蜼蜽蜾蝀蝃蝅蝍蝘蝝蝡蝤蝥蝯蝱蝲蝻螃",6,"螋螌螐螓螕螗螘螙螞螠螣螧螬螭螮螱螵螾螿蟁蟈蟉蟊蟎蟕蟖蟙蟚蟜蟟蟢蟣蟤蟪蟫蟭蟱蟳蟸蟺蟿蠁蠃蠆蠉蠊蠋蠐蠙蠒蠓蠔蠘蠚蠛蠜蠞蠟蠨蠭蠮蠰蠲蠵"],["8fdca1","蠺蠼衁衃衅衈衉衊衋衎衑衕衖衘衚衜衟衠衤衩衱衹衻袀袘袚袛袜袟袠袨袪袺袽袾裀裊",4,"裑裒裓裛裞裧裯裰裱裵裷褁褆褍褎褏褕褖褘褙褚褜褠褦褧褨褰褱褲褵褹褺褾襀襂襅襆襉襏襒襗襚襛襜襡襢襣襫襮襰襳襵襺"],["8fdda1","襻襼襽覉覍覐覔覕覛覜覟覠覥覰覴覵覶覷覼觔",4,"觥觩觫觭觱觳觶觹觽觿訄訅訇訏訑訒訔訕訞訠訢訤訦訫訬訯訵訷訽訾詀詃詅詇詉詍詎詓詖詗詘詜詝詡詥詧詵詶詷詹詺詻詾詿誀誃誆誋誏誐誒誖誗誙誟誧誩誮誯誳"],["8fdea1","誶誷誻誾諃諆諈諉諊諑諓諔諕諗諝諟諬諰諴諵諶諼諿謅謆謋謑謜謞謟謊謭謰謷謼譂",4,"譈譒譓譔譙譍譞譣譭譶譸譹譼譾讁讄讅讋讍讏讔讕讜讞讟谸谹谽谾豅豇豉豋豏豑豓豔豗豘豛豝豙豣豤豦豨豩豭豳豵豶豻豾貆"],["8fdfa1","貇貋貐貒貓貙貛貜貤貹貺賅賆賉賋賏賖賕賙賝賡賨賬賯賰賲賵賷賸賾賿贁贃贉贒贗贛赥赩赬赮赿趂趄趈趍趐趑趕趞趟趠趦趫趬趯趲趵趷趹趻跀跅跆跇跈跊跎跑跔跕跗跙跤跥跧跬跰趼跱跲跴跽踁踄踅踆踋踑踔踖踠踡踢"],["8fe0a1","踣踦踧踱踳踶踷踸踹踽蹀蹁蹋蹍蹎蹏蹔蹛蹜蹝蹞蹡蹢蹩蹬蹭蹯蹰蹱蹹蹺蹻躂躃躉躐躒躕躚躛躝躞躢躧躩躭躮躳躵躺躻軀軁軃軄軇軏軑軔軜軨軮軰軱軷軹軺軭輀輂輇輈輏輐輖輗輘輞輠輡輣輥輧輨輬輭輮輴輵輶輷輺轀轁"],["8fe1a1","轃轇轏轑",4,"轘轝轞轥辝辠辡辤辥辦辵辶辸达迀迁迆迊迋迍运迒迓迕迠迣迤迨迮迱迵迶迻迾适逄逈逌逘逛逨逩逯逪逬逭逳逴逷逿遃遄遌遛遝遢遦遧遬遰遴遹邅邈邋邌邎邐邕邗邘邙邛邠邡邢邥邰邲邳邴邶邽郌邾郃"],["8fe2a1","郄郅郇郈郕郗郘郙郜郝郟郥郒郶郫郯郰郴郾郿鄀鄄鄅鄆鄈鄍鄐鄔鄖鄗鄘鄚鄜鄞鄠鄥鄢鄣鄧鄩鄮鄯鄱鄴鄶鄷鄹鄺鄼鄽酃酇酈酏酓酗酙酚酛酡酤酧酭酴酹酺酻醁醃醅醆醊醎醑醓醔醕醘醞醡醦醨醬醭醮醰醱醲醳醶醻醼醽醿"],["8fe3a1","釂釃釅釓釔釗釙釚釞釤釥釩釪釬",5,"釷釹釻釽鈀鈁鈄鈅鈆鈇鈉鈊鈌鈐鈒鈓鈖鈘鈜鈝鈣鈤鈥鈦鈨鈮鈯鈰鈳鈵鈶鈸鈹鈺鈼鈾鉀鉂鉃鉆鉇鉊鉍鉎鉏鉑鉘鉙鉜鉝鉠鉡鉥鉧鉨鉩鉮鉯鉰鉵",4,"鉻鉼鉽鉿銈銉銊銍銎銒銗"],["8fe4a1","銙銟銠銤銥銧銨銫銯銲銶銸銺銻銼銽銿",4,"鋅鋆鋇鋈鋋鋌鋍鋎鋐鋓鋕鋗鋘鋙鋜鋝鋟鋠鋡鋣鋥鋧鋨鋬鋮鋰鋹鋻鋿錀錂錈錍錑錔錕錜錝錞錟錡錤錥錧錩錪錳錴錶錷鍇鍈鍉鍐鍑鍒鍕鍗鍘鍚鍞鍤鍥鍧鍩鍪鍭鍯鍰鍱鍳鍴鍶"],["8fe5a1","鍺鍽鍿鎀鎁鎂鎈鎊鎋鎍鎏鎒鎕鎘鎛鎞鎡鎣鎤鎦鎨鎫鎴鎵鎶鎺鎩鏁鏄鏅鏆鏇鏉",4,"鏓鏙鏜鏞鏟鏢鏦鏧鏹鏷鏸鏺鏻鏽鐁鐂鐄鐈鐉鐍鐎鐏鐕鐖鐗鐟鐮鐯鐱鐲鐳鐴鐻鐿鐽鑃鑅鑈鑊鑌鑕鑙鑜鑟鑡鑣鑨鑫鑭鑮鑯鑱鑲钄钃镸镹"],["8fe6a1","镾閄閈閌閍閎閝閞閟閡閦閩閫閬閴閶閺閽閿闆闈闉闋闐闑闒闓闙闚闝闞闟闠闤闦阝阞阢阤阥阦阬阱阳阷阸阹阺阼阽陁陒陔陖陗陘陡陮陴陻陼陾陿隁隂隃隄隉隑隖隚隝隟隤隥隦隩隮隯隳隺雊雒嶲雘雚雝雞雟雩雯雱雺霂"],["8fe7a1","霃霅霉霚霛霝霡霢霣霨霱霳靁靃靊靎靏靕靗靘靚靛靣靧靪靮靳靶靷靸靻靽靿鞀鞉鞕鞖鞗鞙鞚鞞鞟鞢鞬鞮鞱鞲鞵鞶鞸鞹鞺鞼鞾鞿韁韄韅韇韉韊韌韍韎韐韑韔韗韘韙韝韞韠韛韡韤韯韱韴韷韸韺頇頊頙頍頎頔頖頜頞頠頣頦"],["8fe8a1","頫頮頯頰頲頳頵頥頾顄顇顊顑顒顓顖顗顙顚顢顣顥顦顪顬颫颭颮颰颴颷颸颺颻颿飂飅飈飌飡飣飥飦飧飪飳飶餂餇餈餑餕餖餗餚餛餜餟餢餦餧餫餱",4,"餹餺餻餼饀饁饆饇饈饍饎饔饘饙饛饜饞饟饠馛馝馟馦馰馱馲馵"],["8fe9a1","馹馺馽馿駃駉駓駔駙駚駜駞駧駪駫駬駰駴駵駹駽駾騂騃騄騋騌騐騑騖騞騠騢騣騤騧騭騮騳騵騶騸驇驁驄驊驋驌驎驑驔驖驝骪骬骮骯骲骴骵骶骹骻骾骿髁髃髆髈髎髐髒髕髖髗髛髜髠髤髥髧髩髬髲髳髵髹髺髽髿",4],["8feaa1","鬄鬅鬈鬉鬋鬌鬍鬎鬐鬒鬖鬙鬛鬜鬠鬦鬫鬭鬳鬴鬵鬷鬹鬺鬽魈魋魌魕魖魗魛魞魡魣魥魦魨魪",4,"魳魵魷魸魹魿鮀鮄鮅鮆鮇鮉鮊鮋鮍鮏鮐鮔鮚鮝鮞鮦鮧鮩鮬鮰鮱鮲鮷鮸鮻鮼鮾鮿鯁鯇鯈鯎鯐鯗鯘鯝鯟鯥鯧鯪鯫鯯鯳鯷鯸"],["8feba1","鯹鯺鯽鯿鰀鰂鰋鰏鰑鰖鰘鰙鰚鰜鰞鰢鰣鰦",4,"鰱鰵鰶鰷鰽鱁鱃鱄鱅鱉鱊鱎鱏鱐鱓鱔鱖鱘鱛鱝鱞鱟鱣鱩鱪鱜鱫鱨鱮鱰鱲鱵鱷鱻鳦鳲鳷鳹鴋鴂鴑鴗鴘鴜鴝鴞鴯鴰鴲鴳鴴鴺鴼鵅鴽鵂鵃鵇鵊鵓鵔鵟鵣鵢鵥鵩鵪鵫鵰鵶鵷鵻"],["8feca1","鵼鵾鶃鶄鶆鶊鶍鶎鶒鶓鶕鶖鶗鶘鶡鶪鶬鶮鶱鶵鶹鶼鶿鷃鷇鷉鷊鷔鷕鷖鷗鷚鷞鷟鷠鷥鷧鷩鷫鷮鷰鷳鷴鷾鸊鸂鸇鸎鸐鸑鸒鸕鸖鸙鸜鸝鹺鹻鹼麀麂麃麄麅麇麎麏麖麘麛麞麤麨麬麮麯麰麳麴麵黆黈黋黕黟黤黧黬黭黮黰黱黲黵"],["8feda1","黸黿鼂鼃鼉鼏鼐鼑鼒鼔鼖鼗鼙鼚鼛鼟鼢鼦鼪鼫鼯鼱鼲鼴鼷鼹鼺鼼鼽鼿齁齃",4,"齓齕齖齗齘齚齝齞齨齩齭",4,"齳齵齺齽龏龐龑龒龔龖龗龞龡龢龣龥"]]},{}],107:[function(e,t,r){t.exports={uChars:[128,165,169,178,184,216,226,235,238,244,248,251,253,258,276,284,300,325,329,334,364,463,465,467,469,471,473,475,477,506,594,610,712,716,730,930,938,962,970,1026,1104,1106,8209,8215,8218,8222,8231,8241,8244,8246,8252,8365,8452,8454,8458,8471,8482,8556,8570,8596,8602,8713,8720,8722,8726,8731,8737,8740,8742,8748,8751,8760,8766,8777,8781,8787,8802,8808,8816,8854,8858,8870,8896,8979,9322,9372,9548,9588,9616,9622,9634,9652,9662,9672,9676,9680,9702,9735,9738,9793,9795,11906,11909,11913,11917,11928,11944,11947,11951,11956,11960,11964,11979,12284,12292,12312,12319,12330,12351,12436,12447,12535,12543,12586,12842,12850,12964,13200,13215,13218,13253,13263,13267,13270,13384,13428,13727,13839,13851,14617,14703,14801,14816,14964,15183,15471,15585,16471,16736,17208,17325,17330,17374,17623,17997,18018,18212,18218,18301,18318,18760,18811,18814,18820,18823,18844,18848,18872,19576,19620,19738,19887,40870,59244,59336,59367,59413,59417,59423,59431,59437,59443,59452,59460,59478,59493,63789,63866,63894,63976,63986,64016,64018,64021,64025,64034,64037,64042,65074,65093,65107,65112,65127,65132,65375,65510,65536],
gbChars:[0,36,38,45,50,81,89,95,96,100,103,104,105,109,126,133,148,172,175,179,208,306,307,308,309,310,311,312,313,341,428,443,544,545,558,741,742,749,750,805,819,820,7922,7924,7925,7927,7934,7943,7944,7945,7950,8062,8148,8149,8152,8164,8174,8236,8240,8262,8264,8374,8380,8381,8384,8388,8390,8392,8393,8394,8396,8401,8406,8416,8419,8424,8437,8439,8445,8482,8485,8496,8521,8603,8936,8946,9046,9050,9063,9066,9076,9092,9100,9108,9111,9113,9131,9162,9164,9218,9219,11329,11331,11334,11336,11346,11361,11363,11366,11370,11372,11375,11389,11682,11686,11687,11692,11694,11714,11716,11723,11725,11730,11736,11982,11989,12102,12336,12348,12350,12384,12393,12395,12397,12510,12553,12851,12962,12973,13738,13823,13919,13933,14080,14298,14585,14698,15583,15847,16318,16434,16438,16481,16729,17102,17122,17315,17320,17402,17418,17859,17909,17911,17915,17916,17936,17939,17961,18664,18703,18814,18962,19043,33469,33470,33471,33484,33485,33490,33497,33501,33505,33513,33520,33536,33550,37845,37921,37948,38029,38038,38064,38065,38066,38069,38075,38076,38078,39108,39109,39113,39114,39115,39116,39265,39394,189e3]}},{}],108:[function(e,t,r){t.exports=[["a140","",62],["a180","",32],["a240","",62],["a280","",32],["a2ab","",5],["a2e3","€"],["a2ef",""],["a2fd",""],["a340","",62],["a380","",31,"　"],["a440","",62],["a480","",32],["a4f4","",10],["a540","",62],["a580","",32],["a5f7","",7],["a640","",62],["a680","",32],["a6b9","",7],["a6d9","",6],["a6ec",""],["a6f3",""],["a6f6","",8],["a740","",62],["a780","",32],["a7c2","",14],["a7f2","",12],["a896","",10],["a8bc",""],["a8bf","ǹ"],["a8c1",""],["a8ea","",20],["a958",""],["a95b",""],["a95d",""],["a989","〾⿰",11],["a997","",12],["a9f0","",14],["aaa1","",93],["aba1","",93],["aca1","",93],["ada1","",93],["aea1","",93],["afa1","",93],["d7fa","",4],["f8a1","",93],["f9a1","",93],["faa1","",93],["fba1","",93],["fca1","",93],["fda1","",93],["fe50","⺁⺄㑳㑇⺈⺋㖞㘚㘎⺌⺗㥮㤘㧏㧟㩳㧐㭎㱮㳠⺧⺪䁖䅟⺮䌷⺳⺶⺷䎱䎬⺻䏝䓖䙡䙌"],["fe80","䜣䜩䝼䞍⻊䥇䥺䥽䦂䦃䦅䦆䦟䦛䦷䦶䲣䲟䲠䲡䱷䲢䴓",6,"䶮",93]]},{}],109:[function(e,t,r){t.exports=[["0","\x00",128],["a1","｡",62],["8140","　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈",9,"＋－±×"],["8180","÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇◆□■△▲▽▼※〒→←↑↓〓"],["81b8","∈∋⊆⊇⊂⊃∪∩"],["81c8","∧∨￢⇒⇔∀∃"],["81da","∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬"],["81f0","Å‰♯♭♪†‡¶"],["81fc","◯"],["824f","０",9],["8260","Ａ",25],["8281","ａ",25],["829f","ぁ",82],["8340","ァ",62],["8380","ム",22],["839f","Α",16,"Σ",6],["83bf","α",16,"σ",6],["8440","А",5,"ЁЖ",25],["8470","а",5,"ёж",7],["8480","о",17],["849f","─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂"],["8740","①",19,"Ⅰ",9],["875f","㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡"],["877e","㍻"],["8780","〝〟№㏍℡㊤",4,"㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪"],["889f","亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭"],["8940","院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円"],["8980","園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改"],["8a40","魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫"],["8a80","橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄"],["8b40","機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救"],["8b80","朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈"],["8c40","掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨"],["8c80","劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向"],["8d40","后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降"],["8d80","項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷"],["8e40","察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止"],["8e80","死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周"],["8f40","宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳"],["8f80","準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾"],["9040","拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨"],["9080","逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線"],["9140","繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻"],["9180","操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只"],["9240","叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄"],["9280","逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓"],["9340","邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬"],["9380","凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入"],["9440","如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅"],["9480","楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美"],["9540","鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷"],["9580","斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋"],["9640","法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆"],["9680","摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒"],["9740","諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲"],["9780","沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯"],["9840","蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕"],["989f","弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲"],["9940","僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭"],["9980","凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨"],["9a40","咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸"],["9a80","噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩"],["9b40","奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀"],["9b80","它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏"],["9c40","廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠"],["9c80","怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛"],["9d40","戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫"],["9d80","捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼"],["9e40","曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎"],["9e80","梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣"],["9f40","檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯"],["9f80","麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌"],["e040","漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝"],["e080","烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱"],["e140","瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿"],["e180","痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬"],["e240","磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰"],["e280","窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆"],["e340","紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷"],["e380","縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋"],["e440","隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤"],["e480","艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈"],["e540","蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬"],["e580","蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞"],["e640","襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧"],["e680","諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊"],["e740","蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜"],["e780","轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮"],["e840","錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙"],["e880","閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰"],["e940","顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃"],["e980","騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈"],["ea40","鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯"],["ea80","黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠堯槇遙瑤凜熙"],["ed40","纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏"],["ed80","塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱"],["ee40","犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙"],["ee80","蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"],["eeef","ⅰ",9,"￢￤＇＂"],["f040","",62],["f080","",124],["f140","",62],["f180","",124],["f240","",62],["f280","",124],["f340","",62],["f380","",124],["f440","",62],["f480","",124],["f540","",62],["f580","",124],["f640","",62],["f680","",124],["f740","",62],["f780","",124],["f840","",62],["f880","",124],["f940",""],["fa40","ⅰ",9,"Ⅰ",9,"￢￤＇＂㈱№℡∵纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊"],["fa80","兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯"],["fb40","涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神"],["fb80","祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙"],["fc40","髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"]]},{}],110:[function(e,t,r){(function(e){"use strict"
function t(){}function n(){}function i(){this.overflowByte=-1}function o(e,t){this.iconv=t}function s(e,t){e=e||{},void 0===e.addBOM&&(e.addBOM=!0),this.encoder=t.iconv.getEncoder("utf-16le",e)}function a(e,t){this.decoder=null,this.initialBytes=[],this.initialBytesLen=0,this.options=e||{},this.iconv=t.iconv}function c(e,t){var r=t||"utf-16le"
if(e.length>=2)if(254==e[0]&&255==e[1])r="utf-16be"
else if(255==e[0]&&254==e[1])r="utf-16le"
else{for(var n=0,i=0,o=Math.min(e.length-e.length%2,64),s=0;o>s;s+=2)0===e[s]&&0!==e[s+1]&&i++,0!==e[s]&&0===e[s+1]&&n++
i>n?r="utf-16be":n>i&&(r="utf-16le")}return r}r.utf16be=t,t.prototype.encoder=n,t.prototype.decoder=i,t.prototype.bomAware=!0,n.prototype.write=function(t){for(var r=new e(t,"ucs2"),n=0;n<r.length;n+=2){var i=r[n]
r[n]=r[n+1],r[n+1]=i}return r},n.prototype.end=function(){},i.prototype.write=function(t){if(0==t.length)return""
var r=new e(t.length+1),n=0,i=0
for(-1!==this.overflowByte&&(r[0]=t[0],r[1]=this.overflowByte,n=1,i=2);n<t.length-1;n+=2,i+=2)r[i]=t[n+1],r[i+1]=t[n]
return this.overflowByte=n==t.length-1?t[t.length-1]:-1,r.slice(0,i).toString("ucs2")},i.prototype.end=function(){},r.utf16=o,o.prototype.encoder=s,o.prototype.decoder=a,s.prototype.write=function(e){return this.encoder.write(e)},s.prototype.end=function(){return this.encoder.end()},a.prototype.write=function(t){if(!this.decoder){if(this.initialBytes.push(t),this.initialBytesLen+=t.length,this.initialBytesLen<16)return""
var t=e.concat(this.initialBytes),r=c(t,this.options.defaultEncoding)
this.decoder=this.iconv.getDecoder(r,this.options),this.initialBytes.length=this.initialBytesLen=0}return this.decoder.write(t)},a.prototype.end=function(){if(!this.decoder){var t=e.concat(this.initialBytes),r=c(t,this.options.defaultEncoding)
this.decoder=this.iconv.getDecoder(r,this.options)
var n=this.decoder.write(t),i=this.decoder.end()
return i?n+i:n}return this.decoder.end()}}).call(this,e("buffer").Buffer)},{buffer:204}],111:[function(e,t,r){(function(e){"use strict"
function t(e,t){this.iconv=t}function n(e,t){this.iconv=t.iconv}function i(e,t){this.iconv=t.iconv,this.inBase64=!1,this.base64Accum=""}function o(e,t){this.iconv=t}function s(t,r){this.iconv=r.iconv,this.inBase64=!1,this.base64Accum=new e(6),this.base64AccumIdx=0}function a(e,t){this.iconv=t.iconv,this.inBase64=!1,this.base64Accum=""}r.utf7=t,r.unicode11utf7="utf7",t.prototype.encoder=n,t.prototype.decoder=i,t.prototype.bomAware=!0
var c=/[^A-Za-z0-9'\(\),-\.\/:\? \n\r\t]+/g
n.prototype.write=function(t){return new e(t.replace(c,function(e){return"+"+("+"===e?"":this.iconv.encode(e,"utf16-be").toString("base64").replace(/=+$/,""))+"-"}.bind(this)))},n.prototype.end=function(){}
for(var u=/[A-Za-z0-9\/+]/,l=[],h=0;256>h;h++)l[h]=u.test(String.fromCharCode(h))
var f="+".charCodeAt(0),p="-".charCodeAt(0),d="&".charCodeAt(0)
i.prototype.write=function(t){for(var r="",n=0,i=this.inBase64,o=this.base64Accum,s=0;s<t.length;s++)if(i){if(!l[t[s]]){if(s==n&&t[s]==p)r+="+"
else{var a=o+t.slice(n,s).toString()
r+=this.iconv.decode(new e(a,"base64"),"utf16-be")}t[s]!=p&&s--,n=s+1,i=!1,o=""}}else t[s]==f&&(r+=this.iconv.decode(t.slice(n,s),"ascii"),n=s+1,i=!0)
if(i){var a=o+t.slice(n).toString(),c=a.length-a.length%8
o=a.slice(c),a=a.slice(0,c),r+=this.iconv.decode(new e(a,"base64"),"utf16-be")}else r+=this.iconv.decode(t.slice(n),"ascii")
return this.inBase64=i,this.base64Accum=o,r},i.prototype.end=function(){var t=""
return this.inBase64&&this.base64Accum.length>0&&(t=this.iconv.decode(new e(this.base64Accum,"base64"),"utf16-be")),this.inBase64=!1,this.base64Accum="",t},r.utf7imap=o,o.prototype.encoder=s,o.prototype.decoder=a,o.prototype.bomAware=!0,s.prototype.write=function(t){for(var r=this.inBase64,n=this.base64Accum,i=this.base64AccumIdx,o=new e(5*t.length+10),s=0,a=0;a<t.length;a++){var c=t.charCodeAt(a)
c>=32&&126>=c?(r&&(i>0&&(s+=o.write(n.slice(0,i).toString("base64").replace(/\//g,",").replace(/=+$/,""),s),i=0),o[s++]=p,r=!1),r||(o[s++]=c,c===d&&(o[s++]=p))):(r||(o[s++]=d,r=!0),r&&(n[i++]=c>>8,n[i++]=255&c,i==n.length&&(s+=o.write(n.toString("base64").replace(/\//g,","),s),i=0)))}return this.inBase64=r,this.base64AccumIdx=i,o.slice(0,s)},s.prototype.end=function(){var t=new e(10),r=0
return this.inBase64&&(this.base64AccumIdx>0&&(r+=t.write(this.base64Accum.slice(0,this.base64AccumIdx).toString("base64").replace(/\//g,",").replace(/=+$/,""),r),this.base64AccumIdx=0),t[r++]=p,this.inBase64=!1),t.slice(0,r)}
var g=l.slice()
g[",".charCodeAt(0)]=!0,a.prototype.write=function(t){for(var r="",n=0,i=this.inBase64,o=this.base64Accum,s=0;s<t.length;s++)if(i){if(!g[t[s]]){if(s==n&&t[s]==p)r+="&"
else{var a=o+t.slice(n,s).toString().replace(/,/g,"/")
r+=this.iconv.decode(new e(a,"base64"),"utf16-be")}t[s]!=p&&s--,n=s+1,i=!1,o=""}}else t[s]==d&&(r+=this.iconv.decode(t.slice(n,s),"ascii"),n=s+1,i=!0)
if(i){var a=o+t.slice(n).toString().replace(/,/g,"/"),c=a.length-a.length%8
o=a.slice(c),a=a.slice(0,c),r+=this.iconv.decode(new e(a,"base64"),"utf16-be")}else r+=this.iconv.decode(t.slice(n),"ascii")
return this.inBase64=i,this.base64Accum=o,r},a.prototype.end=function(){var t=""
return this.inBase64&&this.base64Accum.length>0&&(t=this.iconv.decode(new e(this.base64Accum,"base64"),"utf16-be")),this.inBase64=!1,this.base64Accum="",t}}).call(this,e("buffer").Buffer)},{buffer:204}],112:[function(e,t,r){"use strict"
function n(e,t){this.encoder=e,this.addBOM=!0}function i(e,t){this.decoder=e,this.pass=!1,this.options=t||{}}var o="\ufeff"
r.PrependBOM=n,n.prototype.write=function(e){return this.addBOM&&(e=o+e,this.addBOM=!1),this.encoder.write(e)},n.prototype.end=function(){return this.encoder.end()},r.StripBOM=i,i.prototype.write=function(e){var t=this.decoder.write(e)
return this.pass||!t?t:(t[0]===o&&(t=t.slice(1),"function"==typeof this.options.stripBOM&&this.options.stripBOM()),this.pass=!0,t)},i.prototype.end=function(){return this.decoder.end()}},{}],113:[function(e,t,r){(function(r,n){"use strict"
var i=e("./bom-handling"),o=t.exports
o.encodings=null,o.defaultCharUnicode="�",o.defaultCharSingleByte="?",o.encode=function(e,t,r){e=""+(e||"")
var i=o.getEncoder(t,r),s=i.write(e),a=i.end()
return a&&a.length>0?n.concat([s,a]):s},o.decode=function(e,t,r){"string"==typeof e&&(o.skipDecodeWarning||(console.error("Iconv-lite warning: decode()-ing strings is deprecated. Refer to https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding"),o.skipDecodeWarning=!0),e=new n(""+(e||""),"binary"))
var i=o.getDecoder(t,r),s=i.write(e),a=i.end()
return a?s+a:s},o.encodingExists=function(e){try{return o.getCodec(e),!0}catch(t){return!1}},o.toEncoding=o.encode,o.fromEncoding=o.decode,o._codecDataCache={},o.getCodec=function(t){o.encodings||(o.encodings=e("../encodings"))
for(var r=(""+t).toLowerCase().replace(/[^0-9a-z]|:\d{4}$/g,""),n={};;){var i=o._codecDataCache[r]
if(i)return i
var s=o.encodings[r]
switch(typeof s){case"string":r=s
break
case"object":for(var a in s)n[a]=s[a]
n.encodingName||(n.encodingName=r),r=s.type
break
case"function":return n.encodingName||(n.encodingName=r),i=new s(n,o),o._codecDataCache[n.encodingName]=i,i
default:throw new Error("Encoding not recognized: '"+t+"' (searched as: '"+r+"')")}}},o.getEncoder=function(e,t){var r=o.getCodec(e),n=new r.encoder(t,r)
return r.bomAware&&t&&t.addBOM&&(n=new i.PrependBOM(n,t)),n},o.getDecoder=function(e,t){var r=o.getCodec(e),n=new r.decoder(t,r)
return!r.bomAware||t&&t.stripBOM===!1||(n=new i.StripBOM(n,t)),n}
var s="undefined"!=typeof r&&r.versions&&r.versions.node
if(s){var a=s.split(".").map(Number);(a[0]>0||a[1]>=10)&&e("./streams")(o),e("./extend-node")(o)}}).call(this,e("_process"),e("buffer").Buffer)},{"../encodings":97,"./bom-handling":112,"./extend-node":203,"./streams":203,_process:211,buffer:204}],114:[function(e,t,r){(function(e){t.exports=function(t,r){function n(t){function n(){r&&r(t,o),r=null}c?e.nextTick(n):n()}function i(e,t,r){o[e]=r,(0===--s||t)&&n(t)}var o,s,a,c=!0
Array.isArray(t)?(o=[],s=t.length):(a=Object.keys(t),o={},s=a.length),s?a?a.forEach(function(e){t[e](i.bind(void 0,e))}):t.forEach(function(e,t){e(i.bind(void 0,t))}):n(null),c=!1}}).call(this,e("_process"))},{_process:211}],115:[function(e,t,r){function n(e){return e!==e}function i(e){return Object.keys(e).reduce(function(t,r){return u(t,o(e[r],r))},{})}function o(e,t){return"string"==typeof e?o([e],t):Array.isArray(e)?e.reduce(function(e,r){return e[r]=t,e},{}):{}}function s(e,t,r,n,i){var o=u(n,t)
return Object.keys(o).forEach(function(t){var n=e[t]
if(n&&"function"==typeof r[n]){var s=r[n]
try{o[t]=s(o[t])}catch(a){delete o[t],i||console.error(a)}}}),o}function a(e,t){return"function"==typeof t?t:e.extend(t)}function c(e,t,r,n){function o(i){return s(e,i,r,t,n)}return o.extend=function(s,l){var h=u(s.cast||{})
"object"==typeof h&&Object.keys(h).forEach(function(e){h[e]=a(o,h[e])})
var f=i(u(s))
return delete f["default"],delete f.cast,new c(u(e,f),u(t,s["default"]),u(r,h),l||n)},o.getLevelUpEncoding=function(){return{buffer:!1,type:"weak-type-wizard",encode:JSON.stringify,decode:function(e){return o(JSON.parse(e))}}},o}var u=e("xtend"),l={"boolean":function(e){return"false"!==e.toString().toLowerCase()&&!(/^\d+$/.test(e)&&0!==parseInt(e))},number:function(e){return parseFloat(e)},string:function(e){return e.toString()},date:function(e){var t=new Date(e)
return n(t.valueOf())?void 0:t}},h=new c({},{},l,!1)
t.exports=function(e,t){return h.extend(e,t||!1)}},{xtend:116}],116:[function(e,t,r){arguments[4][23][0].apply(r,arguments)},{dup:23}],117:[function(e,t,r){function n(e,t){for(var r=0,n=t.indexOf(e);-1!==n;)r++,n=t.indexOf(e,n+1)
return r}function i(e,t,r){return r.replace(s,function(r,i,o,s,a){var c=n("<code",a.substr(0,s)),u=n("</code",a.substr(0,s))
return c!==u?r:(o=o||i,e.emit("link",i),'<a href="'+t+i+'">'+o+"</a>")})}var o=e("events").EventEmitter,s=/\[\[([\/\w.-]+)(?:\|([^\]>\n]+))?\]\]/gm
t.exports=function(e){var t=Object.create(new o)
return t.linkify=i.bind(null,t,e),t}},{events:208}],118:[function(e,t,r){(function(r){function n(e,t){var r={},n={},i=l(t,e),s=i.map(function(e){if("template"===e.type){var t=d()
return r[e.filename]||(r[e.filename]=[]),r[e.filename].push(t),n[t]=e.arguments,o(t)}return"string"===e.type?e.value:void 0}).join("")
return{templateString:s,filenameUuidsMap:r,uuidArgumentsMap:n}}function i(e,t,r,n){var a=t.renderPost(e)
t.resetPartial(e.filename,a.templateString.replace("{{{html}}}","{{>current}}")),s(r.filenameUuidsMap,a.filenameUuidsMap),p(r.uuidArgumentsMap,a.uuidArgumentsMap),(r.filenameUuidsMap[e.filename]||[]).filter(function(e){return n||!t.partialExists(e)}).forEach(function(n){var i=r.uuidArgumentsMap[n],s=f(e.metadata,i)
t.resetPartial(n,o(e.filename,s))}),Object.keys(a.filenameUuidsMap).map(function(e){t.getPost(e,function(e,n){e?t.emit("error",e):n&&i(n,t,r)})})}function o(e,t){return t=t?JSON.stringify(t):"","{{>'"+e+"' "+t+"}}"}function s(e,t){Object.keys(e).concat(Object.keys(t)).forEach(function(r){e[r]=(e[r]||[]).concat(t[r]||[])})}function a(e,t,n){"string"==typeof e?t.getPost(e,n):r.nextTick(function(){n(null,e)})}function c(e,t,r){t.getPosts(function(t,n){t?r(t):r(null,f(e.metadata,{postList:n.reverse().filter(function(e){return"string"==typeof e.metadata.title&&e.metadata.date}).map(function(e){return f(e,e.metadata)}),posts:n.reduce(function(e,t){return e[u(t.filename)]=t,e},{}),metadata:e.metadata,current:e.filename}))})}function u(e){return e.replace(/\./g,"")}var l=e("noddity-template-parser"),h=e("ractive"),f=e("xtend"),p=e("xtend/mutable"),d=e("random-uuid-v4"),g=e("onetime"),m=e("make-object-an-emitter")
h.DEBUG=!1,t.exports=function(e,t,r){if(!t||!t.linkifier||!t.butler)throw new Error("Expected linkifier and butler properties on options object.")
var s={postList:[],posts:{}},l=t.butler
r=g(r),a(e,l,function(e,p){function d(e,t){w.resetPartial(e,"[[=[[static]] [[/static]]=]]\n"+t)}function g(e){return e&&!!w.partials[e]}function v(e,r,n){"function"==typeof r&&(n=r,r={}),n||(n=function(e){if(e)throw e}),r||(r={}),a(e,l,function(e,o){return e?n(e):void c(o,l,function(e,a){return e?n(e):(a.removeDots=u,w.reset(f(s,t.data||{},r,a)),i(o,_,b,y===o.filename),y=o.filename,void n(null))})})}if(e)return r(e)
var b={filenameUuidsMap:{},uuidArgumentsMap:{}},y="",w=new h({el:t.el,data:s,template:o(p.filename)})
m(v),v.ractive=w
var _={getPost:l.getPost,renderPost:n.bind(null,t.linkifier),emit:v.emit.bind(v),partialExists:g,resetPartial:d}
l.on("post changed",function(e,t){g(e)&&(e===y?v(t):i(t,_,b,!0))}),i(p,_,b),r(null,v)})}}).call(this,e("_process"))},{_process:211,"make-object-an-emitter":119,"noddity-template-parser":121,onetime:188,ractive:192,"random-uuid-v4":189,xtend:190,"xtend/mutable":191}],119:[function(e,t,r){var n=e("events").EventEmitter
t.exports=function(e){var t=new n
Object.keys(n.prototype).filter(function(e){return"function"==typeof n.prototype[e]}).forEach(function(r){e[r]=n.prototype[r].bind(t)})}},{events:208}],120:[function(e,t,r){function n(e){return e.replace(/\{\{(.+?)\}\}/g,function(e,t){return"{{"+o(t)+"}}"})}var i=e("remarkable"),o=e("ent/decode"),s=new i("full",{html:!0,linkify:!0})
t.exports=function(e){var t=e.metadata.markdown!==!1,r=t?n(s.render(e.content)):e.content
return r}},{"ent/decode":123,remarkable:126}],121:[function(e,t,r){var n=e("./htmlify.js"),i=e("./noddity-template-transformer.js")
t.exports=function(e,t,r){var o=!0
r&&r.convertToHtml===!1&&(o=!1)
var s=o?n(e):e.content
return s=t.linkify(s),i(s)}},{"./htmlify.js":120,"./noddity-template-transformer.js":122}],122:[function(e,t,r){function n(e,t){return e.replace(a,function(e){return e.replace(t,function(e){return"&#"+e.charCodeAt()+";"})})}var i=e("./parse-template-arguments.js"),o=e("regexp.execall"),s=/[\{\}]/g,a=/<code>[\s\S]*?<\/code>/g
t.exports=function(e){var t=/((?:<code>[\s\S]*?<\/code>|[\s\S])*?)(?:::(.+?)::|$)/g
return o(t,e).reduce(function(e,t){var r=t[1],o=t[2]
if(r&&e.push({type:"string",value:n(r,s)}),o){var a=o.split("|"),c=a.shift(),u=i(a)
e.push({type:"template",filename:c,arguments:u})}return e},[])}},{"./parse-template-arguments.js":187,"regexp.execall":125}],123:[function(e,t,r){function n(e){if("string"!=typeof e)throw new TypeError("Expected a String")
return e.replace(/&(#?[^;\W]+;?)/g,function(e,t){var r
if(r=/^#(\d+);?$/.exec(t))return i.ucs2.encode([parseInt(r[1],10)])
if(r=/^#[Xx]([A-Fa-f0-9]+);?/.exec(t))return i.ucs2.encode([parseInt(r[1],16)])
var n=/;$/.test(t),s=n?t.replace(/;$/,""):t,a=o[s]||n&&o[t]
return"number"==typeof a?i.ucs2.encode([a]):"string"==typeof a?a:"&"+t})}var i=e("punycode"),o=e("./entities.json")
t.exports=n},{"./entities.json":124,punycode:212}],124:[function(e,t,r){t.exports={"Aacute;":"Á",Aacute:"Á","aacute;":"á",aacute:"á","Abreve;":"Ă","abreve;":"ă","ac;":"∾","acd;":"∿","acE;":"∾̳","Acirc;":"Â",Acirc:"Â","acirc;":"â",acirc:"â","acute;":"´",acute:"´","Acy;":"А","acy;":"а","AElig;":"Æ",AElig:"Æ","aelig;":"æ",aelig:"æ","af;":"⁡","Afr;":"𝔄","afr;":"𝔞","Agrave;":"À",Agrave:"À","agrave;":"à",agrave:"à","alefsym;":"ℵ","aleph;":"ℵ","Alpha;":"Α","alpha;":"α","Amacr;":"Ā","amacr;":"ā","amalg;":"⨿","AMP;":"&",AMP:"&","amp;":"&",amp:"&","And;":"⩓","and;":"∧","andand;":"⩕","andd;":"⩜","andslope;":"⩘","andv;":"⩚","ang;":"∠","ange;":"⦤","angle;":"∠","angmsd;":"∡","angmsdaa;":"⦨","angmsdab;":"⦩","angmsdac;":"⦪","angmsdad;":"⦫","angmsdae;":"⦬","angmsdaf;":"⦭","angmsdag;":"⦮","angmsdah;":"⦯","angrt;":"∟","angrtvb;":"⊾","angrtvbd;":"⦝","angsph;":"∢","angst;":"Å","angzarr;":"⍼","Aogon;":"Ą","aogon;":"ą","Aopf;":"𝔸","aopf;":"𝕒","ap;":"≈","apacir;":"⩯","apE;":"⩰","ape;":"≊","apid;":"≋","apos;":"'","ApplyFunction;":"⁡","approx;":"≈","approxeq;":"≊","Aring;":"Å",Aring:"Å","aring;":"å",aring:"å","Ascr;":"𝒜","ascr;":"𝒶","Assign;":"≔","ast;":"*","asymp;":"≈","asympeq;":"≍","Atilde;":"Ã",Atilde:"Ã","atilde;":"ã",atilde:"ã","Auml;":"Ä",Auml:"Ä","auml;":"ä",auml:"ä","awconint;":"∳","awint;":"⨑","backcong;":"≌","backepsilon;":"϶","backprime;":"‵","backsim;":"∽","backsimeq;":"⋍","Backslash;":"∖","Barv;":"⫧","barvee;":"⊽","Barwed;":"⌆","barwed;":"⌅","barwedge;":"⌅","bbrk;":"⎵","bbrktbrk;":"⎶","bcong;":"≌","Bcy;":"Б","bcy;":"б","bdquo;":"„","becaus;":"∵","Because;":"∵","because;":"∵","bemptyv;":"⦰","bepsi;":"϶","bernou;":"ℬ","Bernoullis;":"ℬ","Beta;":"Β","beta;":"β","beth;":"ℶ","between;":"≬","Bfr;":"𝔅","bfr;":"𝔟","bigcap;":"⋂","bigcirc;":"◯","bigcup;":"⋃","bigodot;":"⨀","bigoplus;":"⨁","bigotimes;":"⨂","bigsqcup;":"⨆","bigstar;":"★","bigtriangledown;":"▽","bigtriangleup;":"△","biguplus;":"⨄","bigvee;":"⋁","bigwedge;":"⋀","bkarow;":"⤍","blacklozenge;":"⧫","blacksquare;":"▪","blacktriangle;":"▴","blacktriangledown;":"▾","blacktriangleleft;":"◂","blacktriangleright;":"▸","blank;":"␣","blk12;":"▒","blk14;":"░","blk34;":"▓","block;":"█","bne;":"=⃥","bnequiv;":"≡⃥","bNot;":"⫭","bnot;":"⌐","Bopf;":"𝔹","bopf;":"𝕓","bot;":"⊥","bottom;":"⊥","bowtie;":"⋈","boxbox;":"⧉","boxDL;":"╗","boxDl;":"╖","boxdL;":"╕","boxdl;":"┐","boxDR;":"╔","boxDr;":"╓","boxdR;":"╒","boxdr;":"┌","boxH;":"═","boxh;":"─","boxHD;":"╦","boxHd;":"╤","boxhD;":"╥","boxhd;":"┬","boxHU;":"╩","boxHu;":"╧","boxhU;":"╨","boxhu;":"┴","boxminus;":"⊟","boxplus;":"⊞","boxtimes;":"⊠","boxUL;":"╝","boxUl;":"╜","boxuL;":"╛","boxul;":"┘","boxUR;":"╚","boxUr;":"╙","boxuR;":"╘","boxur;":"└","boxV;":"║","boxv;":"│","boxVH;":"╬","boxVh;":"╫","boxvH;":"╪","boxvh;":"┼","boxVL;":"╣","boxVl;":"╢","boxvL;":"╡","boxvl;":"┤","boxVR;":"╠","boxVr;":"╟","boxvR;":"╞","boxvr;":"├","bprime;":"‵","Breve;":"˘","breve;":"˘","brvbar;":"¦",brvbar:"¦","Bscr;":"ℬ","bscr;":"𝒷","bsemi;":"⁏","bsim;":"∽","bsime;":"⋍","bsol;":"\\","bsolb;":"⧅","bsolhsub;":"⟈","bull;":"•","bullet;":"•","bump;":"≎","bumpE;":"⪮","bumpe;":"≏","Bumpeq;":"≎","bumpeq;":"≏","Cacute;":"Ć","cacute;":"ć","Cap;":"⋒","cap;":"∩","capand;":"⩄","capbrcup;":"⩉","capcap;":"⩋","capcup;":"⩇","capdot;":"⩀","CapitalDifferentialD;":"ⅅ","caps;":"∩︀","caret;":"⁁","caron;":"ˇ","Cayleys;":"ℭ","ccaps;":"⩍","Ccaron;":"Č","ccaron;":"č","Ccedil;":"Ç",Ccedil:"Ç","ccedil;":"ç",ccedil:"ç","Ccirc;":"Ĉ","ccirc;":"ĉ","Cconint;":"∰","ccups;":"⩌","ccupssm;":"⩐","Cdot;":"Ċ","cdot;":"ċ","cedil;":"¸",cedil:"¸","Cedilla;":"¸","cemptyv;":"⦲","cent;":"¢",cent:"¢","CenterDot;":"·","centerdot;":"·","Cfr;":"ℭ","cfr;":"𝔠","CHcy;":"Ч","chcy;":"ч","check;":"✓","checkmark;":"✓","Chi;":"Χ","chi;":"χ","cir;":"○","circ;":"ˆ","circeq;":"≗","circlearrowleft;":"↺","circlearrowright;":"↻","circledast;":"⊛","circledcirc;":"⊚","circleddash;":"⊝","CircleDot;":"⊙","circledR;":"®","circledS;":"Ⓢ","CircleMinus;":"⊖","CirclePlus;":"⊕","CircleTimes;":"⊗","cirE;":"⧃","cire;":"≗","cirfnint;":"⨐","cirmid;":"⫯","cirscir;":"⧂","ClockwiseContourIntegral;":"∲","CloseCurlyDoubleQuote;":"”","CloseCurlyQuote;":"’","clubs;":"♣","clubsuit;":"♣","Colon;":"∷","colon;":":","Colone;":"⩴","colone;":"≔","coloneq;":"≔","comma;":",","commat;":"@","comp;":"∁","compfn;":"∘","complement;":"∁","complexes;":"ℂ","cong;":"≅","congdot;":"⩭","Congruent;":"≡","Conint;":"∯","conint;":"∮","ContourIntegral;":"∮","Copf;":"ℂ","copf;":"𝕔","coprod;":"∐","Coproduct;":"∐","COPY;":"©",COPY:"©","copy;":"©",copy:"©","copysr;":"℗","CounterClockwiseContourIntegral;":"∳","crarr;":"↵","Cross;":"⨯","cross;":"✗","Cscr;":"𝒞","cscr;":"𝒸","csub;":"⫏","csube;":"⫑","csup;":"⫐","csupe;":"⫒","ctdot;":"⋯","cudarrl;":"⤸","cudarrr;":"⤵","cuepr;":"⋞","cuesc;":"⋟","cularr;":"↶","cularrp;":"⤽","Cup;":"⋓","cup;":"∪","cupbrcap;":"⩈","CupCap;":"≍","cupcap;":"⩆","cupcup;":"⩊","cupdot;":"⊍","cupor;":"⩅","cups;":"∪︀","curarr;":"↷","curarrm;":"⤼","curlyeqprec;":"⋞","curlyeqsucc;":"⋟","curlyvee;":"⋎","curlywedge;":"⋏","curren;":"¤",curren:"¤","curvearrowleft;":"↶","curvearrowright;":"↷","cuvee;":"⋎","cuwed;":"⋏","cwconint;":"∲","cwint;":"∱","cylcty;":"⌭","Dagger;":"‡","dagger;":"†","daleth;":"ℸ","Darr;":"↡","dArr;":"⇓","darr;":"↓","dash;":"‐","Dashv;":"⫤","dashv;":"⊣","dbkarow;":"⤏","dblac;":"˝","Dcaron;":"Ď","dcaron;":"ď","Dcy;":"Д","dcy;":"д","DD;":"ⅅ","dd;":"ⅆ","ddagger;":"‡","ddarr;":"⇊","DDotrahd;":"⤑","ddotseq;":"⩷","deg;":"°",deg:"°","Del;":"∇","Delta;":"Δ","delta;":"δ","demptyv;":"⦱","dfisht;":"⥿","Dfr;":"𝔇","dfr;":"𝔡","dHar;":"⥥","dharl;":"⇃","dharr;":"⇂","DiacriticalAcute;":"´","DiacriticalDot;":"˙","DiacriticalDoubleAcute;":"˝","DiacriticalGrave;":"`","DiacriticalTilde;":"˜","diam;":"⋄","Diamond;":"⋄","diamond;":"⋄","diamondsuit;":"♦","diams;":"♦","die;":"¨","DifferentialD;":"ⅆ","digamma;":"ϝ","disin;":"⋲","div;":"÷","divide;":"÷",divide:"÷","divideontimes;":"⋇","divonx;":"⋇","DJcy;":"Ђ","djcy;":"ђ","dlcorn;":"⌞","dlcrop;":"⌍","dollar;":"$","Dopf;":"𝔻","dopf;":"𝕕","Dot;":"¨","dot;":"˙","DotDot;":"⃜","doteq;":"≐","doteqdot;":"≑","DotEqual;":"≐","dotminus;":"∸","dotplus;":"∔","dotsquare;":"⊡","doublebarwedge;":"⌆","DoubleContourIntegral;":"∯","DoubleDot;":"¨","DoubleDownArrow;":"⇓","DoubleLeftArrow;":"⇐","DoubleLeftRightArrow;":"⇔","DoubleLeftTee;":"⫤","DoubleLongLeftArrow;":"⟸","DoubleLongLeftRightArrow;":"⟺","DoubleLongRightArrow;":"⟹","DoubleRightArrow;":"⇒","DoubleRightTee;":"⊨","DoubleUpArrow;":"⇑","DoubleUpDownArrow;":"⇕","DoubleVerticalBar;":"∥","DownArrow;":"↓","Downarrow;":"⇓","downarrow;":"↓","DownArrowBar;":"⤓","DownArrowUpArrow;":"⇵","DownBreve;":"̑","downdownarrows;":"⇊","downharpoonleft;":"⇃","downharpoonright;":"⇂","DownLeftRightVector;":"⥐","DownLeftTeeVector;":"⥞","DownLeftVector;":"↽","DownLeftVectorBar;":"⥖","DownRightTeeVector;":"⥟","DownRightVector;":"⇁","DownRightVectorBar;":"⥗","DownTee;":"⊤","DownTeeArrow;":"↧","drbkarow;":"⤐","drcorn;":"⌟","drcrop;":"⌌","Dscr;":"𝒟","dscr;":"𝒹","DScy;":"Ѕ","dscy;":"ѕ","dsol;":"⧶","Dstrok;":"Đ","dstrok;":"đ","dtdot;":"⋱","dtri;":"▿","dtrif;":"▾","duarr;":"⇵","duhar;":"⥯","dwangle;":"⦦","DZcy;":"Џ","dzcy;":"џ","dzigrarr;":"⟿","Eacute;":"É",Eacute:"É","eacute;":"é",eacute:"é","easter;":"⩮","Ecaron;":"Ě","ecaron;":"ě","ecir;":"≖","Ecirc;":"Ê",Ecirc:"Ê","ecirc;":"ê",ecirc:"ê","ecolon;":"≕","Ecy;":"Э","ecy;":"э","eDDot;":"⩷","Edot;":"Ė","eDot;":"≑","edot;":"ė","ee;":"ⅇ","efDot;":"≒","Efr;":"𝔈","efr;":"𝔢","eg;":"⪚","Egrave;":"È",Egrave:"È","egrave;":"è",egrave:"è","egs;":"⪖","egsdot;":"⪘","el;":"⪙","Element;":"∈","elinters;":"⏧","ell;":"ℓ","els;":"⪕","elsdot;":"⪗","Emacr;":"Ē","emacr;":"ē","empty;":"∅","emptyset;":"∅","EmptySmallSquare;":"◻","emptyv;":"∅","EmptyVerySmallSquare;":"▫","emsp;":" ","emsp13;":" ","emsp14;":" ","ENG;":"Ŋ","eng;":"ŋ","ensp;":" ","Eogon;":"Ę","eogon;":"ę","Eopf;":"𝔼","eopf;":"𝕖","epar;":"⋕","eparsl;":"⧣","eplus;":"⩱","epsi;":"ε","Epsilon;":"Ε","epsilon;":"ε","epsiv;":"ϵ","eqcirc;":"≖","eqcolon;":"≕","eqsim;":"≂","eqslantgtr;":"⪖","eqslantless;":"⪕","Equal;":"⩵","equals;":"=","EqualTilde;":"≂","equest;":"≟","Equilibrium;":"⇌","equiv;":"≡","equivDD;":"⩸","eqvparsl;":"⧥","erarr;":"⥱","erDot;":"≓","Escr;":"ℰ","escr;":"ℯ","esdot;":"≐","Esim;":"⩳","esim;":"≂","Eta;":"Η","eta;":"η","ETH;":"Ð",ETH:"Ð","eth;":"ð",eth:"ð","Euml;":"Ë",Euml:"Ë","euml;":"ë",euml:"ë","euro;":"€","excl;":"!","exist;":"∃","Exists;":"∃","expectation;":"ℰ","ExponentialE;":"ⅇ","exponentiale;":"ⅇ","fallingdotseq;":"≒","Fcy;":"Ф","fcy;":"ф","female;":"♀","ffilig;":"ﬃ","fflig;":"ﬀ","ffllig;":"ﬄ","Ffr;":"𝔉","ffr;":"𝔣","filig;":"ﬁ","FilledSmallSquare;":"◼","FilledVerySmallSquare;":"▪","fjlig;":"fj","flat;":"♭","fllig;":"ﬂ","fltns;":"▱","fnof;":"ƒ","Fopf;":"𝔽","fopf;":"𝕗","ForAll;":"∀","forall;":"∀","fork;":"⋔","forkv;":"⫙","Fouriertrf;":"ℱ","fpartint;":"⨍","frac12;":"½",frac12:"½","frac13;":"⅓","frac14;":"¼",frac14:"¼","frac15;":"⅕","frac16;":"⅙","frac18;":"⅛","frac23;":"⅔","frac25;":"⅖","frac34;":"¾",frac34:"¾","frac35;":"⅗","frac38;":"⅜","frac45;":"⅘","frac56;":"⅚","frac58;":"⅝","frac78;":"⅞","frasl;":"⁄","frown;":"⌢","Fscr;":"ℱ","fscr;":"𝒻","gacute;":"ǵ","Gamma;":"Γ","gamma;":"γ","Gammad;":"Ϝ","gammad;":"ϝ","gap;":"⪆","Gbreve;":"Ğ","gbreve;":"ğ","Gcedil;":"Ģ","Gcirc;":"Ĝ","gcirc;":"ĝ","Gcy;":"Г","gcy;":"г","Gdot;":"Ġ","gdot;":"ġ","gE;":"≧","ge;":"≥","gEl;":"⪌","gel;":"⋛","geq;":"≥","geqq;":"≧","geqslant;":"⩾","ges;":"⩾","gescc;":"⪩","gesdot;":"⪀","gesdoto;":"⪂","gesdotol;":"⪄","gesl;":"⋛︀","gesles;":"⪔","Gfr;":"𝔊","gfr;":"𝔤","Gg;":"⋙","gg;":"≫","ggg;":"⋙","gimel;":"ℷ","GJcy;":"Ѓ","gjcy;":"ѓ","gl;":"≷","gla;":"⪥","glE;":"⪒","glj;":"⪤","gnap;":"⪊","gnapprox;":"⪊","gnE;":"≩","gne;":"⪈","gneq;":"⪈","gneqq;":"≩","gnsim;":"⋧","Gopf;":"𝔾","gopf;":"𝕘","grave;":"`","GreaterEqual;":"≥","GreaterEqualLess;":"⋛","GreaterFullEqual;":"≧","GreaterGreater;":"⪢","GreaterLess;":"≷","GreaterSlantEqual;":"⩾","GreaterTilde;":"≳","Gscr;":"𝒢","gscr;":"ℊ","gsim;":"≳","gsime;":"⪎","gsiml;":"⪐","GT;":">",GT:">","Gt;":"≫","gt;":">",gt:">","gtcc;":"⪧","gtcir;":"⩺","gtdot;":"⋗","gtlPar;":"⦕","gtquest;":"⩼","gtrapprox;":"⪆","gtrarr;":"⥸","gtrdot;":"⋗","gtreqless;":"⋛","gtreqqless;":"⪌","gtrless;":"≷","gtrsim;":"≳","gvertneqq;":"≩︀","gvnE;":"≩︀","Hacek;":"ˇ","hairsp;":" ","half;":"½","hamilt;":"ℋ","HARDcy;":"Ъ","hardcy;":"ъ","hArr;":"⇔","harr;":"↔","harrcir;":"⥈","harrw;":"↭","Hat;":"^","hbar;":"ℏ","Hcirc;":"Ĥ","hcirc;":"ĥ","hearts;":"♥","heartsuit;":"♥","hellip;":"…","hercon;":"⊹","Hfr;":"ℌ","hfr;":"𝔥","HilbertSpace;":"ℋ","hksearow;":"⤥","hkswarow;":"⤦","hoarr;":"⇿","homtht;":"∻","hookleftarrow;":"↩","hookrightarrow;":"↪","Hopf;":"ℍ","hopf;":"𝕙","horbar;":"―","HorizontalLine;":"─","Hscr;":"ℋ","hscr;":"𝒽","hslash;":"ℏ","Hstrok;":"Ħ","hstrok;":"ħ","HumpDownHump;":"≎","HumpEqual;":"≏","hybull;":"⁃","hyphen;":"‐","Iacute;":"Í",Iacute:"Í","iacute;":"í",iacute:"í","ic;":"⁣","Icirc;":"Î",Icirc:"Î","icirc;":"î",icirc:"î","Icy;":"И","icy;":"и","Idot;":"İ","IEcy;":"Е","iecy;":"е","iexcl;":"¡",iexcl:"¡","iff;":"⇔","Ifr;":"ℑ","ifr;":"𝔦","Igrave;":"Ì",Igrave:"Ì","igrave;":"ì",igrave:"ì","ii;":"ⅈ","iiiint;":"⨌","iiint;":"∭","iinfin;":"⧜","iiota;":"℩","IJlig;":"Ĳ","ijlig;":"ĳ","Im;":"ℑ","Imacr;":"Ī","imacr;":"ī","image;":"ℑ","ImaginaryI;":"ⅈ","imagline;":"ℐ","imagpart;":"ℑ","imath;":"ı","imof;":"⊷","imped;":"Ƶ","Implies;":"⇒","in;":"∈","incare;":"℅","infin;":"∞","infintie;":"⧝","inodot;":"ı","Int;":"∬","int;":"∫","intcal;":"⊺","integers;":"ℤ","Integral;":"∫","intercal;":"⊺","Intersection;":"⋂","intlarhk;":"⨗","intprod;":"⨼","InvisibleComma;":"⁣","InvisibleTimes;":"⁢","IOcy;":"Ё","iocy;":"ё","Iogon;":"Į","iogon;":"į","Iopf;":"𝕀","iopf;":"𝕚","Iota;":"Ι","iota;":"ι","iprod;":"⨼","iquest;":"¿",iquest:"¿","Iscr;":"ℐ","iscr;":"𝒾","isin;":"∈","isindot;":"⋵","isinE;":"⋹","isins;":"⋴","isinsv;":"⋳","isinv;":"∈","it;":"⁢","Itilde;":"Ĩ","itilde;":"ĩ","Iukcy;":"І","iukcy;":"і","Iuml;":"Ï",Iuml:"Ï","iuml;":"ï",iuml:"ï","Jcirc;":"Ĵ","jcirc;":"ĵ","Jcy;":"Й","jcy;":"й","Jfr;":"𝔍","jfr;":"𝔧","jmath;":"ȷ","Jopf;":"𝕁","jopf;":"𝕛","Jscr;":"𝒥","jscr;":"𝒿","Jsercy;":"Ј","jsercy;":"ј","Jukcy;":"Є","jukcy;":"є","Kappa;":"Κ","kappa;":"κ","kappav;":"ϰ","Kcedil;":"Ķ","kcedil;":"ķ","Kcy;":"К","kcy;":"к","Kfr;":"𝔎","kfr;":"𝔨","kgreen;":"ĸ","KHcy;":"Х","khcy;":"х","KJcy;":"Ќ","kjcy;":"ќ","Kopf;":"𝕂","kopf;":"𝕜","Kscr;":"𝒦","kscr;":"𝓀","lAarr;":"⇚","Lacute;":"Ĺ","lacute;":"ĺ","laemptyv;":"⦴","lagran;":"ℒ","Lambda;":"Λ","lambda;":"λ","Lang;":"⟪","lang;":"⟨","langd;":"⦑","langle;":"⟨","lap;":"⪅","Laplacetrf;":"ℒ","laquo;":"«",laquo:"«","Larr;":"↞","lArr;":"⇐","larr;":"←","larrb;":"⇤","larrbfs;":"⤟","larrfs;":"⤝","larrhk;":"↩","larrlp;":"↫","larrpl;":"⤹","larrsim;":"⥳","larrtl;":"↢","lat;":"⪫","lAtail;":"⤛","latail;":"⤙","late;":"⪭","lates;":"⪭︀","lBarr;":"⤎","lbarr;":"⤌","lbbrk;":"❲","lbrace;":"{","lbrack;":"[","lbrke;":"⦋","lbrksld;":"⦏","lbrkslu;":"⦍","Lcaron;":"Ľ","lcaron;":"ľ","Lcedil;":"Ļ","lcedil;":"ļ","lceil;":"⌈","lcub;":"{","Lcy;":"Л","lcy;":"л","ldca;":"⤶","ldquo;":"“","ldquor;":"„","ldrdhar;":"⥧","ldrushar;":"⥋","ldsh;":"↲","lE;":"≦","le;":"≤","LeftAngleBracket;":"⟨","LeftArrow;":"←","Leftarrow;":"⇐","leftarrow;":"←","LeftArrowBar;":"⇤","LeftArrowRightArrow;":"⇆","leftarrowtail;":"↢","LeftCeiling;":"⌈","LeftDoubleBracket;":"⟦","LeftDownTeeVector;":"⥡","LeftDownVector;":"⇃","LeftDownVectorBar;":"⥙","LeftFloor;":"⌊","leftharpoondown;":"↽","leftharpoonup;":"↼","leftleftarrows;":"⇇","LeftRightArrow;":"↔","Leftrightarrow;":"⇔","leftrightarrow;":"↔","leftrightarrows;":"⇆","leftrightharpoons;":"⇋","leftrightsquigarrow;":"↭","LeftRightVector;":"⥎","LeftTee;":"⊣","LeftTeeArrow;":"↤","LeftTeeVector;":"⥚","leftthreetimes;":"⋋","LeftTriangle;":"⊲","LeftTriangleBar;":"⧏","LeftTriangleEqual;":"⊴","LeftUpDownVector;":"⥑","LeftUpTeeVector;":"⥠","LeftUpVector;":"↿","LeftUpVectorBar;":"⥘","LeftVector;":"↼","LeftVectorBar;":"⥒","lEg;":"⪋","leg;":"⋚","leq;":"≤","leqq;":"≦","leqslant;":"⩽","les;":"⩽","lescc;":"⪨","lesdot;":"⩿","lesdoto;":"⪁","lesdotor;":"⪃","lesg;":"⋚︀","lesges;":"⪓","lessapprox;":"⪅","lessdot;":"⋖","lesseqgtr;":"⋚","lesseqqgtr;":"⪋","LessEqualGreater;":"⋚","LessFullEqual;":"≦","LessGreater;":"≶","lessgtr;":"≶","LessLess;":"⪡","lesssim;":"≲","LessSlantEqual;":"⩽","LessTilde;":"≲","lfisht;":"⥼","lfloor;":"⌊","Lfr;":"𝔏","lfr;":"𝔩","lg;":"≶","lgE;":"⪑","lHar;":"⥢","lhard;":"↽","lharu;":"↼","lharul;":"⥪","lhblk;":"▄","LJcy;":"Љ","ljcy;":"љ","Ll;":"⋘","ll;":"≪","llarr;":"⇇","llcorner;":"⌞","Lleftarrow;":"⇚","llhard;":"⥫","lltri;":"◺","Lmidot;":"Ŀ","lmidot;":"ŀ","lmoust;":"⎰","lmoustache;":"⎰","lnap;":"⪉","lnapprox;":"⪉","lnE;":"≨","lne;":"⪇","lneq;":"⪇","lneqq;":"≨","lnsim;":"⋦","loang;":"⟬","loarr;":"⇽","lobrk;":"⟦","LongLeftArrow;":"⟵","Longleftarrow;":"⟸","longleftarrow;":"⟵","LongLeftRightArrow;":"⟷","Longleftrightarrow;":"⟺","longleftrightarrow;":"⟷","longmapsto;":"⟼","LongRightArrow;":"⟶","Longrightarrow;":"⟹","longrightarrow;":"⟶","looparrowleft;":"↫","looparrowright;":"↬","lopar;":"⦅","Lopf;":"𝕃","lopf;":"𝕝","loplus;":"⨭","lotimes;":"⨴","lowast;":"∗","lowbar;":"_","LowerLeftArrow;":"↙","LowerRightArrow;":"↘","loz;":"◊","lozenge;":"◊","lozf;":"⧫","lpar;":"(","lparlt;":"⦓","lrarr;":"⇆","lrcorner;":"⌟","lrhar;":"⇋","lrhard;":"⥭","lrm;":"‎","lrtri;":"⊿","lsaquo;":"‹","Lscr;":"ℒ","lscr;":"𝓁","Lsh;":"↰","lsh;":"↰","lsim;":"≲","lsime;":"⪍","lsimg;":"⪏","lsqb;":"[","lsquo;":"‘","lsquor;":"‚","Lstrok;":"Ł","lstrok;":"ł","LT;":"<",LT:"<","Lt;":"≪","lt;":"<",lt:"<","ltcc;":"⪦","ltcir;":"⩹","ltdot;":"⋖","lthree;":"⋋","ltimes;":"⋉","ltlarr;":"⥶","ltquest;":"⩻","ltri;":"◃","ltrie;":"⊴","ltrif;":"◂","ltrPar;":"⦖","lurdshar;":"⥊","luruhar;":"⥦","lvertneqq;":"≨︀","lvnE;":"≨︀","macr;":"¯",macr:"¯","male;":"♂","malt;":"✠","maltese;":"✠","Map;":"⤅","map;":"↦","mapsto;":"↦","mapstodown;":"↧","mapstoleft;":"↤","mapstoup;":"↥","marker;":"▮","mcomma;":"⨩","Mcy;":"М","mcy;":"м","mdash;":"—","mDDot;":"∺","measuredangle;":"∡","MediumSpace;":" ","Mellintrf;":"ℳ","Mfr;":"𝔐","mfr;":"𝔪","mho;":"℧","micro;":"µ",micro:"µ","mid;":"∣","midast;":"*","midcir;":"⫰","middot;":"·",middot:"·","minus;":"−","minusb;":"⊟","minusd;":"∸","minusdu;":"⨪","MinusPlus;":"∓","mlcp;":"⫛","mldr;":"…","mnplus;":"∓","models;":"⊧","Mopf;":"𝕄","mopf;":"𝕞","mp;":"∓","Mscr;":"ℳ","mscr;":"𝓂","mstpos;":"∾","Mu;":"Μ","mu;":"μ","multimap;":"⊸","mumap;":"⊸","nabla;":"∇","Nacute;":"Ń","nacute;":"ń","nang;":"∠⃒","nap;":"≉","napE;":"⩰̸","napid;":"≋̸","napos;":"ŉ","napprox;":"≉","natur;":"♮","natural;":"♮","naturals;":"ℕ","nbsp;":" ",nbsp:" ","nbump;":"≎̸","nbumpe;":"≏̸","ncap;":"⩃","Ncaron;":"Ň","ncaron;":"ň","Ncedil;":"Ņ","ncedil;":"ņ","ncong;":"≇","ncongdot;":"⩭̸","ncup;":"⩂","Ncy;":"Н","ncy;":"н","ndash;":"–","ne;":"≠","nearhk;":"⤤","neArr;":"⇗","nearr;":"↗","nearrow;":"↗","nedot;":"≐̸","NegativeMediumSpace;":"​","NegativeThickSpace;":"​","NegativeThinSpace;":"​","NegativeVeryThinSpace;":"​","nequiv;":"≢","nesear;":"⤨","nesim;":"≂̸","NestedGreaterGreater;":"≫","NestedLessLess;":"≪","NewLine;":"\n","nexist;":"∄","nexists;":"∄","Nfr;":"𝔑","nfr;":"𝔫","ngE;":"≧̸","nge;":"≱","ngeq;":"≱","ngeqq;":"≧̸","ngeqslant;":"⩾̸","nges;":"⩾̸","nGg;":"⋙̸","ngsim;":"≵","nGt;":"≫⃒","ngt;":"≯","ngtr;":"≯","nGtv;":"≫̸","nhArr;":"⇎","nharr;":"↮","nhpar;":"⫲","ni;":"∋","nis;":"⋼","nisd;":"⋺","niv;":"∋","NJcy;":"Њ","njcy;":"њ","nlArr;":"⇍","nlarr;":"↚","nldr;":"‥","nlE;":"≦̸","nle;":"≰","nLeftarrow;":"⇍","nleftarrow;":"↚","nLeftrightarrow;":"⇎","nleftrightarrow;":"↮","nleq;":"≰","nleqq;":"≦̸","nleqslant;":"⩽̸","nles;":"⩽̸","nless;":"≮","nLl;":"⋘̸","nlsim;":"≴","nLt;":"≪⃒","nlt;":"≮","nltri;":"⋪","nltrie;":"⋬","nLtv;":"≪̸","nmid;":"∤","NoBreak;":"⁠","NonBreakingSpace;":" ","Nopf;":"ℕ","nopf;":"𝕟","Not;":"⫬","not;":"¬",not:"¬","NotCongruent;":"≢","NotCupCap;":"≭","NotDoubleVerticalBar;":"∦","NotElement;":"∉","NotEqual;":"≠","NotEqualTilde;":"≂̸","NotExists;":"∄","NotGreater;":"≯","NotGreaterEqual;":"≱","NotGreaterFullEqual;":"≧̸","NotGreaterGreater;":"≫̸","NotGreaterLess;":"≹","NotGreaterSlantEqual;":"⩾̸","NotGreaterTilde;":"≵","NotHumpDownHump;":"≎̸","NotHumpEqual;":"≏̸","notin;":"∉","notindot;":"⋵̸","notinE;":"⋹̸","notinva;":"∉","notinvb;":"⋷","notinvc;":"⋶","NotLeftTriangle;":"⋪","NotLeftTriangleBar;":"⧏̸","NotLeftTriangleEqual;":"⋬","NotLess;":"≮","NotLessEqual;":"≰","NotLessGreater;":"≸","NotLessLess;":"≪̸","NotLessSlantEqual;":"⩽̸","NotLessTilde;":"≴","NotNestedGreaterGreater;":"⪢̸","NotNestedLessLess;":"⪡̸","notni;":"∌","notniva;":"∌","notnivb;":"⋾","notnivc;":"⋽","NotPrecedes;":"⊀","NotPrecedesEqual;":"⪯̸","NotPrecedesSlantEqual;":"⋠","NotReverseElement;":"∌","NotRightTriangle;":"⋫","NotRightTriangleBar;":"⧐̸","NotRightTriangleEqual;":"⋭","NotSquareSubset;":"⊏̸","NotSquareSubsetEqual;":"⋢","NotSquareSuperset;":"⊐̸","NotSquareSupersetEqual;":"⋣","NotSubset;":"⊂⃒","NotSubsetEqual;":"⊈","NotSucceeds;":"⊁","NotSucceedsEqual;":"⪰̸","NotSucceedsSlantEqual;":"⋡","NotSucceedsTilde;":"≿̸","NotSuperset;":"⊃⃒","NotSupersetEqual;":"⊉","NotTilde;":"≁","NotTildeEqual;":"≄","NotTildeFullEqual;":"≇","NotTildeTilde;":"≉","NotVerticalBar;":"∤","npar;":"∦","nparallel;":"∦","nparsl;":"⫽⃥","npart;":"∂̸","npolint;":"⨔","npr;":"⊀","nprcue;":"⋠","npre;":"⪯̸","nprec;":"⊀","npreceq;":"⪯̸","nrArr;":"⇏","nrarr;":"↛","nrarrc;":"⤳̸","nrarrw;":"↝̸","nRightarrow;":"⇏","nrightarrow;":"↛","nrtri;":"⋫","nrtrie;":"⋭","nsc;":"⊁","nsccue;":"⋡","nsce;":"⪰̸","Nscr;":"𝒩","nscr;":"𝓃","nshortmid;":"∤","nshortparallel;":"∦","nsim;":"≁","nsime;":"≄","nsimeq;":"≄","nsmid;":"∤","nspar;":"∦","nsqsube;":"⋢","nsqsupe;":"⋣","nsub;":"⊄","nsubE;":"⫅̸","nsube;":"⊈","nsubset;":"⊂⃒","nsubseteq;":"⊈","nsubseteqq;":"⫅̸","nsucc;":"⊁","nsucceq;":"⪰̸","nsup;":"⊅","nsupE;":"⫆̸","nsupe;":"⊉","nsupset;":"⊃⃒","nsupseteq;":"⊉","nsupseteqq;":"⫆̸","ntgl;":"≹","Ntilde;":"Ñ",Ntilde:"Ñ","ntilde;":"ñ",ntilde:"ñ","ntlg;":"≸","ntriangleleft;":"⋪","ntrianglelefteq;":"⋬","ntriangleright;":"⋫","ntrianglerighteq;":"⋭","Nu;":"Ν","nu;":"ν","num;":"#","numero;":"№","numsp;":" ","nvap;":"≍⃒","nVDash;":"⊯","nVdash;":"⊮","nvDash;":"⊭","nvdash;":"⊬","nvge;":"≥⃒","nvgt;":">⃒","nvHarr;":"⤄","nvinfin;":"⧞","nvlArr;":"⤂","nvle;":"≤⃒","nvlt;":"<⃒","nvltrie;":"⊴⃒","nvrArr;":"⤃","nvrtrie;":"⊵⃒","nvsim;":"∼⃒","nwarhk;":"⤣","nwArr;":"⇖","nwarr;":"↖","nwarrow;":"↖","nwnear;":"⤧","Oacute;":"Ó",Oacute:"Ó","oacute;":"ó",oacute:"ó","oast;":"⊛","ocir;":"⊚","Ocirc;":"Ô",Ocirc:"Ô","ocirc;":"ô",ocirc:"ô","Ocy;":"О","ocy;":"о","odash;":"⊝","Odblac;":"Ő","odblac;":"ő","odiv;":"⨸","odot;":"⊙","odsold;":"⦼","OElig;":"Œ","oelig;":"œ","ofcir;":"⦿","Ofr;":"𝔒","ofr;":"𝔬","ogon;":"˛","Ograve;":"Ò",Ograve:"Ò","ograve;":"ò",ograve:"ò","ogt;":"⧁","ohbar;":"⦵","ohm;":"Ω","oint;":"∮","olarr;":"↺","olcir;":"⦾","olcross;":"⦻","oline;":"‾","olt;":"⧀","Omacr;":"Ō","omacr;":"ō","Omega;":"Ω","omega;":"ω","Omicron;":"Ο","omicron;":"ο","omid;":"⦶","ominus;":"⊖","Oopf;":"𝕆","oopf;":"𝕠","opar;":"⦷","OpenCurlyDoubleQuote;":"“","OpenCurlyQuote;":"‘","operp;":"⦹","oplus;":"⊕","Or;":"⩔","or;":"∨","orarr;":"↻","ord;":"⩝","order;":"ℴ","orderof;":"ℴ","ordf;":"ª",ordf:"ª","ordm;":"º",ordm:"º","origof;":"⊶","oror;":"⩖","orslope;":"⩗","orv;":"⩛","oS;":"Ⓢ","Oscr;":"𝒪","oscr;":"ℴ","Oslash;":"Ø",Oslash:"Ø","oslash;":"ø",oslash:"ø","osol;":"⊘","Otilde;":"Õ",Otilde:"Õ","otilde;":"õ",otilde:"õ","Otimes;":"⨷","otimes;":"⊗","otimesas;":"⨶","Ouml;":"Ö",Ouml:"Ö","ouml;":"ö",ouml:"ö","ovbar;":"⌽","OverBar;":"‾","OverBrace;":"⏞","OverBracket;":"⎴","OverParenthesis;":"⏜","par;":"∥","para;":"¶",para:"¶","parallel;":"∥","parsim;":"⫳","parsl;":"⫽","part;":"∂","PartialD;":"∂","Pcy;":"П","pcy;":"п","percnt;":"%","period;":".","permil;":"‰","perp;":"⊥","pertenk;":"‱","Pfr;":"𝔓","pfr;":"𝔭","Phi;":"Φ","phi;":"φ","phiv;":"ϕ","phmmat;":"ℳ","phone;":"☎","Pi;":"Π","pi;":"π","pitchfork;":"⋔","piv;":"ϖ","planck;":"ℏ","planckh;":"ℎ","plankv;":"ℏ","plus;":"+","plusacir;":"⨣","plusb;":"⊞","pluscir;":"⨢","plusdo;":"∔","plusdu;":"⨥","pluse;":"⩲","PlusMinus;":"±","plusmn;":"±",plusmn:"±","plussim;":"⨦","plustwo;":"⨧","pm;":"±","Poincareplane;":"ℌ","pointint;":"⨕","Popf;":"ℙ","popf;":"𝕡","pound;":"£",pound:"£","Pr;":"⪻","pr;":"≺","prap;":"⪷","prcue;":"≼","prE;":"⪳","pre;":"⪯","prec;":"≺","precapprox;":"⪷","preccurlyeq;":"≼","Precedes;":"≺","PrecedesEqual;":"⪯","PrecedesSlantEqual;":"≼","PrecedesTilde;":"≾","preceq;":"⪯","precnapprox;":"⪹","precneqq;":"⪵","precnsim;":"⋨","precsim;":"≾","Prime;":"″","prime;":"′","primes;":"ℙ","prnap;":"⪹","prnE;":"⪵","prnsim;":"⋨","prod;":"∏","Product;":"∏","profalar;":"⌮","profline;":"⌒","profsurf;":"⌓","prop;":"∝","Proportion;":"∷","Proportional;":"∝","propto;":"∝","prsim;":"≾","prurel;":"⊰","Pscr;":"𝒫","pscr;":"𝓅","Psi;":"Ψ","psi;":"ψ","puncsp;":" ","Qfr;":"𝔔","qfr;":"𝔮","qint;":"⨌","Qopf;":"ℚ","qopf;":"𝕢","qprime;":"⁗","Qscr;":"𝒬","qscr;":"𝓆","quaternions;":"ℍ","quatint;":"⨖","quest;":"?","questeq;":"≟","QUOT;":'"',QUOT:'"',"quot;":'"',quot:'"',"rAarr;":"⇛","race;":"∽̱","Racute;":"Ŕ","racute;":"ŕ","radic;":"√","raemptyv;":"⦳","Rang;":"⟫","rang;":"⟩","rangd;":"⦒","range;":"⦥","rangle;":"⟩","raquo;":"»",raquo:"»","Rarr;":"↠","rArr;":"⇒","rarr;":"→","rarrap;":"⥵","rarrb;":"⇥","rarrbfs;":"⤠","rarrc;":"⤳","rarrfs;":"⤞","rarrhk;":"↪","rarrlp;":"↬","rarrpl;":"⥅","rarrsim;":"⥴","Rarrtl;":"⤖","rarrtl;":"↣","rarrw;":"↝","rAtail;":"⤜","ratail;":"⤚","ratio;":"∶","rationals;":"ℚ","RBarr;":"⤐","rBarr;":"⤏","rbarr;":"⤍","rbbrk;":"❳","rbrace;":"}","rbrack;":"]","rbrke;":"⦌","rbrksld;":"⦎","rbrkslu;":"⦐","Rcaron;":"Ř","rcaron;":"ř","Rcedil;":"Ŗ","rcedil;":"ŗ","rceil;":"⌉","rcub;":"}","Rcy;":"Р","rcy;":"р","rdca;":"⤷","rdldhar;":"⥩","rdquo;":"”","rdquor;":"”","rdsh;":"↳","Re;":"ℜ","real;":"ℜ","realine;":"ℛ","realpart;":"ℜ","reals;":"ℝ","rect;":"▭","REG;":"®",REG:"®","reg;":"®",reg:"®","ReverseElement;":"∋","ReverseEquilibrium;":"⇋","ReverseUpEquilibrium;":"⥯","rfisht;":"⥽","rfloor;":"⌋","Rfr;":"ℜ","rfr;":"𝔯","rHar;":"⥤","rhard;":"⇁","rharu;":"⇀","rharul;":"⥬","Rho;":"Ρ","rho;":"ρ","rhov;":"ϱ","RightAngleBracket;":"⟩","RightArrow;":"→","Rightarrow;":"⇒","rightarrow;":"→","RightArrowBar;":"⇥","RightArrowLeftArrow;":"⇄","rightarrowtail;":"↣","RightCeiling;":"⌉","RightDoubleBracket;":"⟧","RightDownTeeVector;":"⥝","RightDownVector;":"⇂","RightDownVectorBar;":"⥕","RightFloor;":"⌋","rightharpoondown;":"⇁","rightharpoonup;":"⇀","rightleftarrows;":"⇄","rightleftharpoons;":"⇌","rightrightarrows;":"⇉","rightsquigarrow;":"↝","RightTee;":"⊢","RightTeeArrow;":"↦","RightTeeVector;":"⥛","rightthreetimes;":"⋌","RightTriangle;":"⊳","RightTriangleBar;":"⧐","RightTriangleEqual;":"⊵","RightUpDownVector;":"⥏","RightUpTeeVector;":"⥜","RightUpVector;":"↾","RightUpVectorBar;":"⥔","RightVector;":"⇀","RightVectorBar;":"⥓","ring;":"˚","risingdotseq;":"≓","rlarr;":"⇄","rlhar;":"⇌","rlm;":"‏","rmoust;":"⎱","rmoustache;":"⎱","rnmid;":"⫮","roang;":"⟭","roarr;":"⇾","robrk;":"⟧","ropar;":"⦆","Ropf;":"ℝ","ropf;":"𝕣","roplus;":"⨮","rotimes;":"⨵","RoundImplies;":"⥰","rpar;":")","rpargt;":"⦔","rppolint;":"⨒","rrarr;":"⇉","Rrightarrow;":"⇛","rsaquo;":"›","Rscr;":"ℛ","rscr;":"𝓇","Rsh;":"↱","rsh;":"↱","rsqb;":"]","rsquo;":"’","rsquor;":"’","rthree;":"⋌","rtimes;":"⋊","rtri;":"▹","rtrie;":"⊵","rtrif;":"▸","rtriltri;":"⧎","RuleDelayed;":"⧴","ruluhar;":"⥨","rx;":"℞","Sacute;":"Ś","sacute;":"ś","sbquo;":"‚","Sc;":"⪼","sc;":"≻","scap;":"⪸","Scaron;":"Š","scaron;":"š","sccue;":"≽","scE;":"⪴","sce;":"⪰","Scedil;":"Ş","scedil;":"ş","Scirc;":"Ŝ","scirc;":"ŝ","scnap;":"⪺","scnE;":"⪶","scnsim;":"⋩","scpolint;":"⨓","scsim;":"≿","Scy;":"С","scy;":"с","sdot;":"⋅","sdotb;":"⊡","sdote;":"⩦","searhk;":"⤥","seArr;":"⇘","searr;":"↘","searrow;":"↘","sect;":"§",sect:"§","semi;":";","seswar;":"⤩","setminus;":"∖","setmn;":"∖","sext;":"✶","Sfr;":"𝔖","sfr;":"𝔰","sfrown;":"⌢","sharp;":"♯","SHCHcy;":"Щ","shchcy;":"щ","SHcy;":"Ш","shcy;":"ш","ShortDownArrow;":"↓","ShortLeftArrow;":"←","shortmid;":"∣","shortparallel;":"∥","ShortRightArrow;":"→","ShortUpArrow;":"↑","shy;":"­",shy:"­","Sigma;":"Σ","sigma;":"σ","sigmaf;":"ς","sigmav;":"ς","sim;":"∼","simdot;":"⩪","sime;":"≃","simeq;":"≃","simg;":"⪞","simgE;":"⪠","siml;":"⪝","simlE;":"⪟","simne;":"≆","simplus;":"⨤","simrarr;":"⥲","slarr;":"←","SmallCircle;":"∘","smallsetminus;":"∖","smashp;":"⨳","smeparsl;":"⧤","smid;":"∣","smile;":"⌣","smt;":"⪪","smte;":"⪬","smtes;":"⪬︀","SOFTcy;":"Ь","softcy;":"ь","sol;":"/","solb;":"⧄","solbar;":"⌿","Sopf;":"𝕊","sopf;":"𝕤","spades;":"♠","spadesuit;":"♠","spar;":"∥","sqcap;":"⊓","sqcaps;":"⊓︀","sqcup;":"⊔","sqcups;":"⊔︀","Sqrt;":"√","sqsub;":"⊏","sqsube;":"⊑","sqsubset;":"⊏","sqsubseteq;":"⊑","sqsup;":"⊐","sqsupe;":"⊒","sqsupset;":"⊐","sqsupseteq;":"⊒","squ;":"□","Square;":"□","square;":"□","SquareIntersection;":"⊓","SquareSubset;":"⊏","SquareSubsetEqual;":"⊑","SquareSuperset;":"⊐","SquareSupersetEqual;":"⊒","SquareUnion;":"⊔","squarf;":"▪","squf;":"▪","srarr;":"→","Sscr;":"𝒮","sscr;":"𝓈","ssetmn;":"∖","ssmile;":"⌣","sstarf;":"⋆","Star;":"⋆","star;":"☆","starf;":"★","straightepsilon;":"ϵ","straightphi;":"ϕ","strns;":"¯","Sub;":"⋐","sub;":"⊂","subdot;":"⪽","subE;":"⫅","sube;":"⊆","subedot;":"⫃","submult;":"⫁","subnE;":"⫋","subne;":"⊊","subplus;":"⪿","subrarr;":"⥹","Subset;":"⋐","subset;":"⊂","subseteq;":"⊆","subseteqq;":"⫅","SubsetEqual;":"⊆","subsetneq;":"⊊","subsetneqq;":"⫋","subsim;":"⫇","subsub;":"⫕","subsup;":"⫓","succ;":"≻","succapprox;":"⪸","succcurlyeq;":"≽","Succeeds;":"≻","SucceedsEqual;":"⪰","SucceedsSlantEqual;":"≽","SucceedsTilde;":"≿","succeq;":"⪰","succnapprox;":"⪺","succneqq;":"⪶","succnsim;":"⋩","succsim;":"≿","SuchThat;":"∋","Sum;":"∑","sum;":"∑","sung;":"♪","Sup;":"⋑","sup;":"⊃","sup1;":"¹",sup1:"¹","sup2;":"²",sup2:"²","sup3;":"³",sup3:"³","supdot;":"⪾","supdsub;":"⫘","supE;":"⫆","supe;":"⊇","supedot;":"⫄","Superset;":"⊃","SupersetEqual;":"⊇","suphsol;":"⟉","suphsub;":"⫗","suplarr;":"⥻","supmult;":"⫂","supnE;":"⫌","supne;":"⊋","supplus;":"⫀","Supset;":"⋑","supset;":"⊃","supseteq;":"⊇","supseteqq;":"⫆","supsetneq;":"⊋","supsetneqq;":"⫌","supsim;":"⫈","supsub;":"⫔","supsup;":"⫖","swarhk;":"⤦","swArr;":"⇙","swarr;":"↙","swarrow;":"↙","swnwar;":"⤪","szlig;":"ß",szlig:"ß","Tab;":"	","target;":"⌖","Tau;":"Τ","tau;":"τ","tbrk;":"⎴","Tcaron;":"Ť","tcaron;":"ť","Tcedil;":"Ţ","tcedil;":"ţ","Tcy;":"Т","tcy;":"т","tdot;":"⃛","telrec;":"⌕","Tfr;":"𝔗","tfr;":"𝔱","there4;":"∴","Therefore;":"∴","therefore;":"∴","Theta;":"Θ","theta;":"θ","thetasym;":"ϑ","thetav;":"ϑ","thickapprox;":"≈","thicksim;":"∼","ThickSpace;":"  ","thinsp;":" ","ThinSpace;":" ","thkap;":"≈","thksim;":"∼","THORN;":"Þ",THORN:"Þ","thorn;":"þ",thorn:"þ","Tilde;":"∼","tilde;":"˜","TildeEqual;":"≃","TildeFullEqual;":"≅","TildeTilde;":"≈","times;":"×",times:"×","timesb;":"⊠","timesbar;":"⨱","timesd;":"⨰","tint;":"∭","toea;":"⤨","top;":"⊤","topbot;":"⌶","topcir;":"⫱","Topf;":"𝕋","topf;":"𝕥","topfork;":"⫚","tosa;":"⤩","tprime;":"‴","TRADE;":"™","trade;":"™","triangle;":"▵","triangledown;":"▿","triangleleft;":"◃","trianglelefteq;":"⊴","triangleq;":"≜","triangleright;":"▹","trianglerighteq;":"⊵","tridot;":"◬","trie;":"≜","triminus;":"⨺","TripleDot;":"⃛","triplus;":"⨹","trisb;":"⧍","tritime;":"⨻","trpezium;":"⏢","Tscr;":"𝒯","tscr;":"𝓉","TScy;":"Ц","tscy;":"ц","TSHcy;":"Ћ","tshcy;":"ћ","Tstrok;":"Ŧ","tstrok;":"ŧ","twixt;":"≬","twoheadleftarrow;":"↞","twoheadrightarrow;":"↠","Uacute;":"Ú",Uacute:"Ú","uacute;":"ú",uacute:"ú","Uarr;":"↟","uArr;":"⇑","uarr;":"↑","Uarrocir;":"⥉","Ubrcy;":"Ў","ubrcy;":"ў","Ubreve;":"Ŭ","ubreve;":"ŭ","Ucirc;":"Û",Ucirc:"Û","ucirc;":"û",ucirc:"û","Ucy;":"У","ucy;":"у","udarr;":"⇅","Udblac;":"Ű","udblac;":"ű","udhar;":"⥮","ufisht;":"⥾","Ufr;":"𝔘","ufr;":"𝔲","Ugrave;":"Ù",Ugrave:"Ù","ugrave;":"ù",ugrave:"ù","uHar;":"⥣","uharl;":"↿","uharr;":"↾","uhblk;":"▀","ulcorn;":"⌜","ulcorner;":"⌜","ulcrop;":"⌏","ultri;":"◸","Umacr;":"Ū","umacr;":"ū","uml;":"¨",uml:"¨","UnderBar;":"_","UnderBrace;":"⏟","UnderBracket;":"⎵","UnderParenthesis;":"⏝","Union;":"⋃","UnionPlus;":"⊎","Uogon;":"Ų","uogon;":"ų","Uopf;":"𝕌","uopf;":"𝕦","UpArrow;":"↑","Uparrow;":"⇑","uparrow;":"↑","UpArrowBar;":"⤒","UpArrowDownArrow;":"⇅","UpDownArrow;":"↕","Updownarrow;":"⇕","updownarrow;":"↕","UpEquilibrium;":"⥮","upharpoonleft;":"↿","upharpoonright;":"↾","uplus;":"⊎","UpperLeftArrow;":"↖","UpperRightArrow;":"↗","Upsi;":"ϒ","upsi;":"υ","upsih;":"ϒ","Upsilon;":"Υ","upsilon;":"υ","UpTee;":"⊥","UpTeeArrow;":"↥","upuparrows;":"⇈","urcorn;":"⌝","urcorner;":"⌝","urcrop;":"⌎","Uring;":"Ů","uring;":"ů","urtri;":"◹","Uscr;":"𝒰","uscr;":"𝓊","utdot;":"⋰","Utilde;":"Ũ","utilde;":"ũ","utri;":"▵","utrif;":"▴","uuarr;":"⇈","Uuml;":"Ü",Uuml:"Ü","uuml;":"ü",uuml:"ü","uwangle;":"⦧","vangrt;":"⦜","varepsilon;":"ϵ","varkappa;":"ϰ","varnothing;":"∅","varphi;":"ϕ","varpi;":"ϖ","varpropto;":"∝","vArr;":"⇕","varr;":"↕","varrho;":"ϱ","varsigma;":"ς","varsubsetneq;":"⊊︀","varsubsetneqq;":"⫋︀","varsupsetneq;":"⊋︀","varsupsetneqq;":"⫌︀","vartheta;":"ϑ","vartriangleleft;":"⊲","vartriangleright;":"⊳","Vbar;":"⫫","vBar;":"⫨","vBarv;":"⫩","Vcy;":"В","vcy;":"в","VDash;":"⊫","Vdash;":"⊩","vDash;":"⊨","vdash;":"⊢","Vdashl;":"⫦","Vee;":"⋁","vee;":"∨","veebar;":"⊻","veeeq;":"≚","vellip;":"⋮","Verbar;":"‖","verbar;":"|","Vert;":"‖","vert;":"|","VerticalBar;":"∣","VerticalLine;":"|","VerticalSeparator;":"❘","VerticalTilde;":"≀","VeryThinSpace;":" ","Vfr;":"𝔙","vfr;":"𝔳","vltri;":"⊲","vnsub;":"⊂⃒","vnsup;":"⊃⃒","Vopf;":"𝕍","vopf;":"𝕧","vprop;":"∝","vrtri;":"⊳","Vscr;":"𝒱","vscr;":"𝓋","vsubnE;":"⫋︀","vsubne;":"⊊︀","vsupnE;":"⫌︀","vsupne;":"⊋︀","Vvdash;":"⊪","vzigzag;":"⦚","Wcirc;":"Ŵ","wcirc;":"ŵ","wedbar;":"⩟","Wedge;":"⋀","wedge;":"∧","wedgeq;":"≙","weierp;":"℘","Wfr;":"𝔚","wfr;":"𝔴","Wopf;":"𝕎","wopf;":"𝕨","wp;":"℘","wr;":"≀","wreath;":"≀","Wscr;":"𝒲","wscr;":"𝓌","xcap;":"⋂","xcirc;":"◯","xcup;":"⋃","xdtri;":"▽","Xfr;":"𝔛","xfr;":"𝔵","xhArr;":"⟺","xharr;":"⟷","Xi;":"Ξ","xi;":"ξ","xlArr;":"⟸","xlarr;":"⟵","xmap;":"⟼","xnis;":"⋻","xodot;":"⨀","Xopf;":"𝕏","xopf;":"𝕩","xoplus;":"⨁","xotime;":"⨂","xrArr;":"⟹","xrarr;":"⟶","Xscr;":"𝒳","xscr;":"𝓍","xsqcup;":"⨆","xuplus;":"⨄","xutri;":"△","xvee;":"⋁","xwedge;":"⋀","Yacute;":"Ý",Yacute:"Ý","yacute;":"ý",yacute:"ý","YAcy;":"Я","yacy;":"я","Ycirc;":"Ŷ","ycirc;":"ŷ","Ycy;":"Ы","ycy;":"ы","yen;":"¥",yen:"¥","Yfr;":"𝔜","yfr;":"𝔶","YIcy;":"Ї","yicy;":"ї","Yopf;":"𝕐","yopf;":"𝕪","Yscr;":"𝒴","yscr;":"𝓎",
"YUcy;":"Ю","yucy;":"ю","Yuml;":"Ÿ","yuml;":"ÿ",yuml:"ÿ","Zacute;":"Ź","zacute;":"ź","Zcaron;":"Ž","zcaron;":"ž","Zcy;":"З","zcy;":"з","Zdot;":"Ż","zdot;":"ż","zeetrf;":"ℨ","ZeroWidthSpace;":"​","Zeta;":"Ζ","zeta;":"ζ","Zfr;":"ℨ","zfr;":"𝔷","ZHcy;":"Ж","zhcy;":"ж","zigrarr;":"⇝","Zopf;":"ℤ","zopf;":"𝕫","Zscr;":"𝒵","zscr;":"𝓏","zwj;":"‍","zwnj;":"‌"}},{}],125:[function(e,t,r){"use strict"
t.exports=function(e,t){var r,n=[]
if(!e.global)return r=e.exec(t),r?[r]:[]
for(;(r=e.exec(t))&&(n.push(r),""!=r[0]););return n}},{}],126:[function(e,t,r){"use strict"
t.exports=e("./lib/")},{"./lib/":140}],127:[function(e,t,r){"use strict"
t.exports={Aacute:"Á",aacute:"á",Abreve:"Ă",abreve:"ă",ac:"∾",acd:"∿",acE:"∾̳",Acirc:"Â",acirc:"â",acute:"´",Acy:"А",acy:"а",AElig:"Æ",aelig:"æ",af:"⁡",Afr:"𝔄",afr:"𝔞",Agrave:"À",agrave:"à",alefsym:"ℵ",aleph:"ℵ",Alpha:"Α",alpha:"α",Amacr:"Ā",amacr:"ā",amalg:"⨿",AMP:"&",amp:"&",And:"⩓",and:"∧",andand:"⩕",andd:"⩜",andslope:"⩘",andv:"⩚",ang:"∠",ange:"⦤",angle:"∠",angmsd:"∡",angmsdaa:"⦨",angmsdab:"⦩",angmsdac:"⦪",angmsdad:"⦫",angmsdae:"⦬",angmsdaf:"⦭",angmsdag:"⦮",angmsdah:"⦯",angrt:"∟",angrtvb:"⊾",angrtvbd:"⦝",angsph:"∢",angst:"Å",angzarr:"⍼",Aogon:"Ą",aogon:"ą",Aopf:"𝔸",aopf:"𝕒",ap:"≈",apacir:"⩯",apE:"⩰",ape:"≊",apid:"≋",apos:"'",ApplyFunction:"⁡",approx:"≈",approxeq:"≊",Aring:"Å",aring:"å",Ascr:"𝒜",ascr:"𝒶",Assign:"≔",ast:"*",asymp:"≈",asympeq:"≍",Atilde:"Ã",atilde:"ã",Auml:"Ä",auml:"ä",awconint:"∳",awint:"⨑",backcong:"≌",backepsilon:"϶",backprime:"‵",backsim:"∽",backsimeq:"⋍",Backslash:"∖",Barv:"⫧",barvee:"⊽",Barwed:"⌆",barwed:"⌅",barwedge:"⌅",bbrk:"⎵",bbrktbrk:"⎶",bcong:"≌",Bcy:"Б",bcy:"б",bdquo:"„",becaus:"∵",Because:"∵",because:"∵",bemptyv:"⦰",bepsi:"϶",bernou:"ℬ",Bernoullis:"ℬ",Beta:"Β",beta:"β",beth:"ℶ",between:"≬",Bfr:"𝔅",bfr:"𝔟",bigcap:"⋂",bigcirc:"◯",bigcup:"⋃",bigodot:"⨀",bigoplus:"⨁",bigotimes:"⨂",bigsqcup:"⨆",bigstar:"★",bigtriangledown:"▽",bigtriangleup:"△",biguplus:"⨄",bigvee:"⋁",bigwedge:"⋀",bkarow:"⤍",blacklozenge:"⧫",blacksquare:"▪",blacktriangle:"▴",blacktriangledown:"▾",blacktriangleleft:"◂",blacktriangleright:"▸",blank:"␣",blk12:"▒",blk14:"░",blk34:"▓",block:"█",bne:"=⃥",bnequiv:"≡⃥",bNot:"⫭",bnot:"⌐",Bopf:"𝔹",bopf:"𝕓",bot:"⊥",bottom:"⊥",bowtie:"⋈",boxbox:"⧉",boxDL:"╗",boxDl:"╖",boxdL:"╕",boxdl:"┐",boxDR:"╔",boxDr:"╓",boxdR:"╒",boxdr:"┌",boxH:"═",boxh:"─",boxHD:"╦",boxHd:"╤",boxhD:"╥",boxhd:"┬",boxHU:"╩",boxHu:"╧",boxhU:"╨",boxhu:"┴",boxminus:"⊟",boxplus:"⊞",boxtimes:"⊠",boxUL:"╝",boxUl:"╜",boxuL:"╛",boxul:"┘",boxUR:"╚",boxUr:"╙",boxuR:"╘",boxur:"└",boxV:"║",boxv:"│",boxVH:"╬",boxVh:"╫",boxvH:"╪",boxvh:"┼",boxVL:"╣",boxVl:"╢",boxvL:"╡",boxvl:"┤",boxVR:"╠",boxVr:"╟",boxvR:"╞",boxvr:"├",bprime:"‵",Breve:"˘",breve:"˘",brvbar:"¦",Bscr:"ℬ",bscr:"𝒷",bsemi:"⁏",bsim:"∽",bsime:"⋍",bsol:"\\",bsolb:"⧅",bsolhsub:"⟈",bull:"•",bullet:"•",bump:"≎",bumpE:"⪮",bumpe:"≏",Bumpeq:"≎",bumpeq:"≏",Cacute:"Ć",cacute:"ć",Cap:"⋒",cap:"∩",capand:"⩄",capbrcup:"⩉",capcap:"⩋",capcup:"⩇",capdot:"⩀",CapitalDifferentialD:"ⅅ",caps:"∩︀",caret:"⁁",caron:"ˇ",Cayleys:"ℭ",ccaps:"⩍",Ccaron:"Č",ccaron:"č",Ccedil:"Ç",ccedil:"ç",Ccirc:"Ĉ",ccirc:"ĉ",Cconint:"∰",ccups:"⩌",ccupssm:"⩐",Cdot:"Ċ",cdot:"ċ",cedil:"¸",Cedilla:"¸",cemptyv:"⦲",cent:"¢",CenterDot:"·",centerdot:"·",Cfr:"ℭ",cfr:"𝔠",CHcy:"Ч",chcy:"ч",check:"✓",checkmark:"✓",Chi:"Χ",chi:"χ",cir:"○",circ:"ˆ",circeq:"≗",circlearrowleft:"↺",circlearrowright:"↻",circledast:"⊛",circledcirc:"⊚",circleddash:"⊝",CircleDot:"⊙",circledR:"®",circledS:"Ⓢ",CircleMinus:"⊖",CirclePlus:"⊕",CircleTimes:"⊗",cirE:"⧃",cire:"≗",cirfnint:"⨐",cirmid:"⫯",cirscir:"⧂",ClockwiseContourIntegral:"∲",CloseCurlyDoubleQuote:"”",CloseCurlyQuote:"’",clubs:"♣",clubsuit:"♣",Colon:"∷",colon:":",Colone:"⩴",colone:"≔",coloneq:"≔",comma:",",commat:"@",comp:"∁",compfn:"∘",complement:"∁",complexes:"ℂ",cong:"≅",congdot:"⩭",Congruent:"≡",Conint:"∯",conint:"∮",ContourIntegral:"∮",Copf:"ℂ",copf:"𝕔",coprod:"∐",Coproduct:"∐",COPY:"©",copy:"©",copysr:"℗",CounterClockwiseContourIntegral:"∳",crarr:"↵",Cross:"⨯",cross:"✗",Cscr:"𝒞",cscr:"𝒸",csub:"⫏",csube:"⫑",csup:"⫐",csupe:"⫒",ctdot:"⋯",cudarrl:"⤸",cudarrr:"⤵",cuepr:"⋞",cuesc:"⋟",cularr:"↶",cularrp:"⤽",Cup:"⋓",cup:"∪",cupbrcap:"⩈",CupCap:"≍",cupcap:"⩆",cupcup:"⩊",cupdot:"⊍",cupor:"⩅",cups:"∪︀",curarr:"↷",curarrm:"⤼",curlyeqprec:"⋞",curlyeqsucc:"⋟",curlyvee:"⋎",curlywedge:"⋏",curren:"¤",curvearrowleft:"↶",curvearrowright:"↷",cuvee:"⋎",cuwed:"⋏",cwconint:"∲",cwint:"∱",cylcty:"⌭",Dagger:"‡",dagger:"†",daleth:"ℸ",Darr:"↡",dArr:"⇓",darr:"↓",dash:"‐",Dashv:"⫤",dashv:"⊣",dbkarow:"⤏",dblac:"˝",Dcaron:"Ď",dcaron:"ď",Dcy:"Д",dcy:"д",DD:"ⅅ",dd:"ⅆ",ddagger:"‡",ddarr:"⇊",DDotrahd:"⤑",ddotseq:"⩷",deg:"°",Del:"∇",Delta:"Δ",delta:"δ",demptyv:"⦱",dfisht:"⥿",Dfr:"𝔇",dfr:"𝔡",dHar:"⥥",dharl:"⇃",dharr:"⇂",DiacriticalAcute:"´",DiacriticalDot:"˙",DiacriticalDoubleAcute:"˝",DiacriticalGrave:"`",DiacriticalTilde:"˜",diam:"⋄",Diamond:"⋄",diamond:"⋄",diamondsuit:"♦",diams:"♦",die:"¨",DifferentialD:"ⅆ",digamma:"ϝ",disin:"⋲",div:"÷",divide:"÷",divideontimes:"⋇",divonx:"⋇",DJcy:"Ђ",djcy:"ђ",dlcorn:"⌞",dlcrop:"⌍",dollar:"$",Dopf:"𝔻",dopf:"𝕕",Dot:"¨",dot:"˙",DotDot:"⃜",doteq:"≐",doteqdot:"≑",DotEqual:"≐",dotminus:"∸",dotplus:"∔",dotsquare:"⊡",doublebarwedge:"⌆",DoubleContourIntegral:"∯",DoubleDot:"¨",DoubleDownArrow:"⇓",DoubleLeftArrow:"⇐",DoubleLeftRightArrow:"⇔",DoubleLeftTee:"⫤",DoubleLongLeftArrow:"⟸",DoubleLongLeftRightArrow:"⟺",DoubleLongRightArrow:"⟹",DoubleRightArrow:"⇒",DoubleRightTee:"⊨",DoubleUpArrow:"⇑",DoubleUpDownArrow:"⇕",DoubleVerticalBar:"∥",DownArrow:"↓",Downarrow:"⇓",downarrow:"↓",DownArrowBar:"⤓",DownArrowUpArrow:"⇵",DownBreve:"̑",downdownarrows:"⇊",downharpoonleft:"⇃",downharpoonright:"⇂",DownLeftRightVector:"⥐",DownLeftTeeVector:"⥞",DownLeftVector:"↽",DownLeftVectorBar:"⥖",DownRightTeeVector:"⥟",DownRightVector:"⇁",DownRightVectorBar:"⥗",DownTee:"⊤",DownTeeArrow:"↧",drbkarow:"⤐",drcorn:"⌟",drcrop:"⌌",Dscr:"𝒟",dscr:"𝒹",DScy:"Ѕ",dscy:"ѕ",dsol:"⧶",Dstrok:"Đ",dstrok:"đ",dtdot:"⋱",dtri:"▿",dtrif:"▾",duarr:"⇵",duhar:"⥯",dwangle:"⦦",DZcy:"Џ",dzcy:"џ",dzigrarr:"⟿",Eacute:"É",eacute:"é",easter:"⩮",Ecaron:"Ě",ecaron:"ě",ecir:"≖",Ecirc:"Ê",ecirc:"ê",ecolon:"≕",Ecy:"Э",ecy:"э",eDDot:"⩷",Edot:"Ė",eDot:"≑",edot:"ė",ee:"ⅇ",efDot:"≒",Efr:"𝔈",efr:"𝔢",eg:"⪚",Egrave:"È",egrave:"è",egs:"⪖",egsdot:"⪘",el:"⪙",Element:"∈",elinters:"⏧",ell:"ℓ",els:"⪕",elsdot:"⪗",Emacr:"Ē",emacr:"ē",empty:"∅",emptyset:"∅",EmptySmallSquare:"◻",emptyv:"∅",EmptyVerySmallSquare:"▫",emsp:" ",emsp13:" ",emsp14:" ",ENG:"Ŋ",eng:"ŋ",ensp:" ",Eogon:"Ę",eogon:"ę",Eopf:"𝔼",eopf:"𝕖",epar:"⋕",eparsl:"⧣",eplus:"⩱",epsi:"ε",Epsilon:"Ε",epsilon:"ε",epsiv:"ϵ",eqcirc:"≖",eqcolon:"≕",eqsim:"≂",eqslantgtr:"⪖",eqslantless:"⪕",Equal:"⩵",equals:"=",EqualTilde:"≂",equest:"≟",Equilibrium:"⇌",equiv:"≡",equivDD:"⩸",eqvparsl:"⧥",erarr:"⥱",erDot:"≓",Escr:"ℰ",escr:"ℯ",esdot:"≐",Esim:"⩳",esim:"≂",Eta:"Η",eta:"η",ETH:"Ð",eth:"ð",Euml:"Ë",euml:"ë",euro:"€",excl:"!",exist:"∃",Exists:"∃",expectation:"ℰ",ExponentialE:"ⅇ",exponentiale:"ⅇ",fallingdotseq:"≒",Fcy:"Ф",fcy:"ф",female:"♀",ffilig:"ﬃ",fflig:"ﬀ",ffllig:"ﬄ",Ffr:"𝔉",ffr:"𝔣",filig:"ﬁ",FilledSmallSquare:"◼",FilledVerySmallSquare:"▪",fjlig:"fj",flat:"♭",fllig:"ﬂ",fltns:"▱",fnof:"ƒ",Fopf:"𝔽",fopf:"𝕗",ForAll:"∀",forall:"∀",fork:"⋔",forkv:"⫙",Fouriertrf:"ℱ",fpartint:"⨍",frac12:"½",frac13:"⅓",frac14:"¼",frac15:"⅕",frac16:"⅙",frac18:"⅛",frac23:"⅔",frac25:"⅖",frac34:"¾",frac35:"⅗",frac38:"⅜",frac45:"⅘",frac56:"⅚",frac58:"⅝",frac78:"⅞",frasl:"⁄",frown:"⌢",Fscr:"ℱ",fscr:"𝒻",gacute:"ǵ",Gamma:"Γ",gamma:"γ",Gammad:"Ϝ",gammad:"ϝ",gap:"⪆",Gbreve:"Ğ",gbreve:"ğ",Gcedil:"Ģ",Gcirc:"Ĝ",gcirc:"ĝ",Gcy:"Г",gcy:"г",Gdot:"Ġ",gdot:"ġ",gE:"≧",ge:"≥",gEl:"⪌",gel:"⋛",geq:"≥",geqq:"≧",geqslant:"⩾",ges:"⩾",gescc:"⪩",gesdot:"⪀",gesdoto:"⪂",gesdotol:"⪄",gesl:"⋛︀",gesles:"⪔",Gfr:"𝔊",gfr:"𝔤",Gg:"⋙",gg:"≫",ggg:"⋙",gimel:"ℷ",GJcy:"Ѓ",gjcy:"ѓ",gl:"≷",gla:"⪥",glE:"⪒",glj:"⪤",gnap:"⪊",gnapprox:"⪊",gnE:"≩",gne:"⪈",gneq:"⪈",gneqq:"≩",gnsim:"⋧",Gopf:"𝔾",gopf:"𝕘",grave:"`",GreaterEqual:"≥",GreaterEqualLess:"⋛",GreaterFullEqual:"≧",GreaterGreater:"⪢",GreaterLess:"≷",GreaterSlantEqual:"⩾",GreaterTilde:"≳",Gscr:"𝒢",gscr:"ℊ",gsim:"≳",gsime:"⪎",gsiml:"⪐",GT:">",Gt:"≫",gt:">",gtcc:"⪧",gtcir:"⩺",gtdot:"⋗",gtlPar:"⦕",gtquest:"⩼",gtrapprox:"⪆",gtrarr:"⥸",gtrdot:"⋗",gtreqless:"⋛",gtreqqless:"⪌",gtrless:"≷",gtrsim:"≳",gvertneqq:"≩︀",gvnE:"≩︀",Hacek:"ˇ",hairsp:" ",half:"½",hamilt:"ℋ",HARDcy:"Ъ",hardcy:"ъ",hArr:"⇔",harr:"↔",harrcir:"⥈",harrw:"↭",Hat:"^",hbar:"ℏ",Hcirc:"Ĥ",hcirc:"ĥ",hearts:"♥",heartsuit:"♥",hellip:"…",hercon:"⊹",Hfr:"ℌ",hfr:"𝔥",HilbertSpace:"ℋ",hksearow:"⤥",hkswarow:"⤦",hoarr:"⇿",homtht:"∻",hookleftarrow:"↩",hookrightarrow:"↪",Hopf:"ℍ",hopf:"𝕙",horbar:"―",HorizontalLine:"─",Hscr:"ℋ",hscr:"𝒽",hslash:"ℏ",Hstrok:"Ħ",hstrok:"ħ",HumpDownHump:"≎",HumpEqual:"≏",hybull:"⁃",hyphen:"‐",Iacute:"Í",iacute:"í",ic:"⁣",Icirc:"Î",icirc:"î",Icy:"И",icy:"и",Idot:"İ",IEcy:"Е",iecy:"е",iexcl:"¡",iff:"⇔",Ifr:"ℑ",ifr:"𝔦",Igrave:"Ì",igrave:"ì",ii:"ⅈ",iiiint:"⨌",iiint:"∭",iinfin:"⧜",iiota:"℩",IJlig:"Ĳ",ijlig:"ĳ",Im:"ℑ",Imacr:"Ī",imacr:"ī",image:"ℑ",ImaginaryI:"ⅈ",imagline:"ℐ",imagpart:"ℑ",imath:"ı",imof:"⊷",imped:"Ƶ",Implies:"⇒","in":"∈",incare:"℅",infin:"∞",infintie:"⧝",inodot:"ı",Int:"∬","int":"∫",intcal:"⊺",integers:"ℤ",Integral:"∫",intercal:"⊺",Intersection:"⋂",intlarhk:"⨗",intprod:"⨼",InvisibleComma:"⁣",InvisibleTimes:"⁢",IOcy:"Ё",iocy:"ё",Iogon:"Į",iogon:"į",Iopf:"𝕀",iopf:"𝕚",Iota:"Ι",iota:"ι",iprod:"⨼",iquest:"¿",Iscr:"ℐ",iscr:"𝒾",isin:"∈",isindot:"⋵",isinE:"⋹",isins:"⋴",isinsv:"⋳",isinv:"∈",it:"⁢",Itilde:"Ĩ",itilde:"ĩ",Iukcy:"І",iukcy:"і",Iuml:"Ï",iuml:"ï",Jcirc:"Ĵ",jcirc:"ĵ",Jcy:"Й",jcy:"й",Jfr:"𝔍",jfr:"𝔧",jmath:"ȷ",Jopf:"𝕁",jopf:"𝕛",Jscr:"𝒥",jscr:"𝒿",Jsercy:"Ј",jsercy:"ј",Jukcy:"Є",jukcy:"є",Kappa:"Κ",kappa:"κ",kappav:"ϰ",Kcedil:"Ķ",kcedil:"ķ",Kcy:"К",kcy:"к",Kfr:"𝔎",kfr:"𝔨",kgreen:"ĸ",KHcy:"Х",khcy:"х",KJcy:"Ќ",kjcy:"ќ",Kopf:"𝕂",kopf:"𝕜",Kscr:"𝒦",kscr:"𝓀",lAarr:"⇚",Lacute:"Ĺ",lacute:"ĺ",laemptyv:"⦴",lagran:"ℒ",Lambda:"Λ",lambda:"λ",Lang:"⟪",lang:"⟨",langd:"⦑",langle:"⟨",lap:"⪅",Laplacetrf:"ℒ",laquo:"«",Larr:"↞",lArr:"⇐",larr:"←",larrb:"⇤",larrbfs:"⤟",larrfs:"⤝",larrhk:"↩",larrlp:"↫",larrpl:"⤹",larrsim:"⥳",larrtl:"↢",lat:"⪫",lAtail:"⤛",latail:"⤙",late:"⪭",lates:"⪭︀",lBarr:"⤎",lbarr:"⤌",lbbrk:"❲",lbrace:"{",lbrack:"[",lbrke:"⦋",lbrksld:"⦏",lbrkslu:"⦍",Lcaron:"Ľ",lcaron:"ľ",Lcedil:"Ļ",lcedil:"ļ",lceil:"⌈",lcub:"{",Lcy:"Л",lcy:"л",ldca:"⤶",ldquo:"“",ldquor:"„",ldrdhar:"⥧",ldrushar:"⥋",ldsh:"↲",lE:"≦",le:"≤",LeftAngleBracket:"⟨",LeftArrow:"←",Leftarrow:"⇐",leftarrow:"←",LeftArrowBar:"⇤",LeftArrowRightArrow:"⇆",leftarrowtail:"↢",LeftCeiling:"⌈",LeftDoubleBracket:"⟦",LeftDownTeeVector:"⥡",LeftDownVector:"⇃",LeftDownVectorBar:"⥙",LeftFloor:"⌊",leftharpoondown:"↽",leftharpoonup:"↼",leftleftarrows:"⇇",LeftRightArrow:"↔",Leftrightarrow:"⇔",leftrightarrow:"↔",leftrightarrows:"⇆",leftrightharpoons:"⇋",leftrightsquigarrow:"↭",LeftRightVector:"⥎",LeftTee:"⊣",LeftTeeArrow:"↤",LeftTeeVector:"⥚",leftthreetimes:"⋋",LeftTriangle:"⊲",LeftTriangleBar:"⧏",LeftTriangleEqual:"⊴",LeftUpDownVector:"⥑",LeftUpTeeVector:"⥠",LeftUpVector:"↿",LeftUpVectorBar:"⥘",LeftVector:"↼",LeftVectorBar:"⥒",lEg:"⪋",leg:"⋚",leq:"≤",leqq:"≦",leqslant:"⩽",les:"⩽",lescc:"⪨",lesdot:"⩿",lesdoto:"⪁",lesdotor:"⪃",lesg:"⋚︀",lesges:"⪓",lessapprox:"⪅",lessdot:"⋖",lesseqgtr:"⋚",lesseqqgtr:"⪋",LessEqualGreater:"⋚",LessFullEqual:"≦",LessGreater:"≶",lessgtr:"≶",LessLess:"⪡",lesssim:"≲",LessSlantEqual:"⩽",LessTilde:"≲",lfisht:"⥼",lfloor:"⌊",Lfr:"𝔏",lfr:"𝔩",lg:"≶",lgE:"⪑",lHar:"⥢",lhard:"↽",lharu:"↼",lharul:"⥪",lhblk:"▄",LJcy:"Љ",ljcy:"љ",Ll:"⋘",ll:"≪",llarr:"⇇",llcorner:"⌞",Lleftarrow:"⇚",llhard:"⥫",lltri:"◺",Lmidot:"Ŀ",lmidot:"ŀ",lmoust:"⎰",lmoustache:"⎰",lnap:"⪉",lnapprox:"⪉",lnE:"≨",lne:"⪇",lneq:"⪇",lneqq:"≨",lnsim:"⋦",loang:"⟬",loarr:"⇽",lobrk:"⟦",LongLeftArrow:"⟵",Longleftarrow:"⟸",longleftarrow:"⟵",LongLeftRightArrow:"⟷",Longleftrightarrow:"⟺",longleftrightarrow:"⟷",longmapsto:"⟼",LongRightArrow:"⟶",Longrightarrow:"⟹",longrightarrow:"⟶",looparrowleft:"↫",looparrowright:"↬",lopar:"⦅",Lopf:"𝕃",lopf:"𝕝",loplus:"⨭",lotimes:"⨴",lowast:"∗",lowbar:"_",LowerLeftArrow:"↙",LowerRightArrow:"↘",loz:"◊",lozenge:"◊",lozf:"⧫",lpar:"(",lparlt:"⦓",lrarr:"⇆",lrcorner:"⌟",lrhar:"⇋",lrhard:"⥭",lrm:"‎",lrtri:"⊿",lsaquo:"‹",Lscr:"ℒ",lscr:"𝓁",Lsh:"↰",lsh:"↰",lsim:"≲",lsime:"⪍",lsimg:"⪏",lsqb:"[",lsquo:"‘",lsquor:"‚",Lstrok:"Ł",lstrok:"ł",LT:"<",Lt:"≪",lt:"<",ltcc:"⪦",ltcir:"⩹",ltdot:"⋖",lthree:"⋋",ltimes:"⋉",ltlarr:"⥶",ltquest:"⩻",ltri:"◃",ltrie:"⊴",ltrif:"◂",ltrPar:"⦖",lurdshar:"⥊",luruhar:"⥦",lvertneqq:"≨︀",lvnE:"≨︀",macr:"¯",male:"♂",malt:"✠",maltese:"✠",Map:"⤅",map:"↦",mapsto:"↦",mapstodown:"↧",mapstoleft:"↤",mapstoup:"↥",marker:"▮",mcomma:"⨩",Mcy:"М",mcy:"м",mdash:"—",mDDot:"∺",measuredangle:"∡",MediumSpace:" ",Mellintrf:"ℳ",Mfr:"𝔐",mfr:"𝔪",mho:"℧",micro:"µ",mid:"∣",midast:"*",midcir:"⫰",middot:"·",minus:"−",minusb:"⊟",minusd:"∸",minusdu:"⨪",MinusPlus:"∓",mlcp:"⫛",mldr:"…",mnplus:"∓",models:"⊧",Mopf:"𝕄",mopf:"𝕞",mp:"∓",Mscr:"ℳ",mscr:"𝓂",mstpos:"∾",Mu:"Μ",mu:"μ",multimap:"⊸",mumap:"⊸",nabla:"∇",Nacute:"Ń",nacute:"ń",nang:"∠⃒",nap:"≉",napE:"⩰̸",napid:"≋̸",napos:"ŉ",napprox:"≉",natur:"♮",natural:"♮",naturals:"ℕ",nbsp:" ",nbump:"≎̸",nbumpe:"≏̸",ncap:"⩃",Ncaron:"Ň",ncaron:"ň",Ncedil:"Ņ",ncedil:"ņ",ncong:"≇",ncongdot:"⩭̸",ncup:"⩂",Ncy:"Н",ncy:"н",ndash:"–",ne:"≠",nearhk:"⤤",neArr:"⇗",nearr:"↗",nearrow:"↗",nedot:"≐̸",NegativeMediumSpace:"​",NegativeThickSpace:"​",NegativeThinSpace:"​",NegativeVeryThinSpace:"​",nequiv:"≢",nesear:"⤨",nesim:"≂̸",NestedGreaterGreater:"≫",NestedLessLess:"≪",NewLine:"\n",nexist:"∄",nexists:"∄",Nfr:"𝔑",nfr:"𝔫",ngE:"≧̸",nge:"≱",ngeq:"≱",ngeqq:"≧̸",ngeqslant:"⩾̸",nges:"⩾̸",nGg:"⋙̸",ngsim:"≵",nGt:"≫⃒",ngt:"≯",ngtr:"≯",nGtv:"≫̸",nhArr:"⇎",nharr:"↮",nhpar:"⫲",ni:"∋",nis:"⋼",nisd:"⋺",niv:"∋",NJcy:"Њ",njcy:"њ",nlArr:"⇍",nlarr:"↚",nldr:"‥",nlE:"≦̸",nle:"≰",nLeftarrow:"⇍",nleftarrow:"↚",nLeftrightarrow:"⇎",nleftrightarrow:"↮",nleq:"≰",nleqq:"≦̸",nleqslant:"⩽̸",nles:"⩽̸",nless:"≮",nLl:"⋘̸",nlsim:"≴",nLt:"≪⃒",nlt:"≮",nltri:"⋪",nltrie:"⋬",nLtv:"≪̸",nmid:"∤",NoBreak:"⁠",NonBreakingSpace:" ",Nopf:"ℕ",nopf:"𝕟",Not:"⫬",not:"¬",NotCongruent:"≢",NotCupCap:"≭",NotDoubleVerticalBar:"∦",NotElement:"∉",NotEqual:"≠",NotEqualTilde:"≂̸",NotExists:"∄",NotGreater:"≯",NotGreaterEqual:"≱",NotGreaterFullEqual:"≧̸",NotGreaterGreater:"≫̸",NotGreaterLess:"≹",NotGreaterSlantEqual:"⩾̸",NotGreaterTilde:"≵",NotHumpDownHump:"≎̸",NotHumpEqual:"≏̸",notin:"∉",notindot:"⋵̸",notinE:"⋹̸",notinva:"∉",notinvb:"⋷",notinvc:"⋶",NotLeftTriangle:"⋪",NotLeftTriangleBar:"⧏̸",NotLeftTriangleEqual:"⋬",NotLess:"≮",NotLessEqual:"≰",NotLessGreater:"≸",NotLessLess:"≪̸",NotLessSlantEqual:"⩽̸",NotLessTilde:"≴",NotNestedGreaterGreater:"⪢̸",NotNestedLessLess:"⪡̸",notni:"∌",notniva:"∌",notnivb:"⋾",notnivc:"⋽",NotPrecedes:"⊀",NotPrecedesEqual:"⪯̸",NotPrecedesSlantEqual:"⋠",NotReverseElement:"∌",NotRightTriangle:"⋫",NotRightTriangleBar:"⧐̸",NotRightTriangleEqual:"⋭",NotSquareSubset:"⊏̸",NotSquareSubsetEqual:"⋢",NotSquareSuperset:"⊐̸",NotSquareSupersetEqual:"⋣",NotSubset:"⊂⃒",NotSubsetEqual:"⊈",NotSucceeds:"⊁",NotSucceedsEqual:"⪰̸",NotSucceedsSlantEqual:"⋡",NotSucceedsTilde:"≿̸",NotSuperset:"⊃⃒",NotSupersetEqual:"⊉",NotTilde:"≁",NotTildeEqual:"≄",NotTildeFullEqual:"≇",NotTildeTilde:"≉",NotVerticalBar:"∤",npar:"∦",nparallel:"∦",nparsl:"⫽⃥",npart:"∂̸",npolint:"⨔",npr:"⊀",nprcue:"⋠",npre:"⪯̸",nprec:"⊀",npreceq:"⪯̸",nrArr:"⇏",nrarr:"↛",nrarrc:"⤳̸",nrarrw:"↝̸",nRightarrow:"⇏",nrightarrow:"↛",nrtri:"⋫",nrtrie:"⋭",nsc:"⊁",nsccue:"⋡",nsce:"⪰̸",Nscr:"𝒩",nscr:"𝓃",nshortmid:"∤",nshortparallel:"∦",nsim:"≁",nsime:"≄",nsimeq:"≄",nsmid:"∤",nspar:"∦",nsqsube:"⋢",nsqsupe:"⋣",nsub:"⊄",nsubE:"⫅̸",nsube:"⊈",nsubset:"⊂⃒",nsubseteq:"⊈",nsubseteqq:"⫅̸",nsucc:"⊁",nsucceq:"⪰̸",nsup:"⊅",nsupE:"⫆̸",nsupe:"⊉",nsupset:"⊃⃒",nsupseteq:"⊉",nsupseteqq:"⫆̸",ntgl:"≹",Ntilde:"Ñ",ntilde:"ñ",ntlg:"≸",ntriangleleft:"⋪",ntrianglelefteq:"⋬",ntriangleright:"⋫",ntrianglerighteq:"⋭",Nu:"Ν",nu:"ν",num:"#",numero:"№",numsp:" ",nvap:"≍⃒",nVDash:"⊯",nVdash:"⊮",nvDash:"⊭",nvdash:"⊬",nvge:"≥⃒",nvgt:">⃒",nvHarr:"⤄",nvinfin:"⧞",nvlArr:"⤂",nvle:"≤⃒",nvlt:"<⃒",nvltrie:"⊴⃒",nvrArr:"⤃",nvrtrie:"⊵⃒",nvsim:"∼⃒",nwarhk:"⤣",nwArr:"⇖",nwarr:"↖",nwarrow:"↖",nwnear:"⤧",Oacute:"Ó",oacute:"ó",oast:"⊛",ocir:"⊚",Ocirc:"Ô",ocirc:"ô",Ocy:"О",ocy:"о",odash:"⊝",Odblac:"Ő",odblac:"ő",odiv:"⨸",odot:"⊙",odsold:"⦼",OElig:"Œ",oelig:"œ",ofcir:"⦿",Ofr:"𝔒",ofr:"𝔬",ogon:"˛",Ograve:"Ò",ograve:"ò",ogt:"⧁",ohbar:"⦵",ohm:"Ω",oint:"∮",olarr:"↺",olcir:"⦾",olcross:"⦻",oline:"‾",olt:"⧀",Omacr:"Ō",omacr:"ō",Omega:"Ω",omega:"ω",Omicron:"Ο",omicron:"ο",omid:"⦶",ominus:"⊖",Oopf:"𝕆",oopf:"𝕠",opar:"⦷",OpenCurlyDoubleQuote:"“",OpenCurlyQuote:"‘",operp:"⦹",oplus:"⊕",Or:"⩔",or:"∨",orarr:"↻",ord:"⩝",order:"ℴ",orderof:"ℴ",ordf:"ª",ordm:"º",origof:"⊶",oror:"⩖",orslope:"⩗",orv:"⩛",oS:"Ⓢ",Oscr:"𝒪",oscr:"ℴ",Oslash:"Ø",oslash:"ø",osol:"⊘",Otilde:"Õ",otilde:"õ",Otimes:"⨷",otimes:"⊗",otimesas:"⨶",Ouml:"Ö",ouml:"ö",ovbar:"⌽",OverBar:"‾",OverBrace:"⏞",OverBracket:"⎴",OverParenthesis:"⏜",par:"∥",para:"¶",parallel:"∥",parsim:"⫳",parsl:"⫽",part:"∂",PartialD:"∂",Pcy:"П",pcy:"п",percnt:"%",period:".",permil:"‰",perp:"⊥",pertenk:"‱",Pfr:"𝔓",pfr:"𝔭",Phi:"Φ",phi:"φ",phiv:"ϕ",phmmat:"ℳ",phone:"☎",Pi:"Π",pi:"π",pitchfork:"⋔",piv:"ϖ",planck:"ℏ",planckh:"ℎ",plankv:"ℏ",plus:"+",plusacir:"⨣",plusb:"⊞",pluscir:"⨢",plusdo:"∔",plusdu:"⨥",pluse:"⩲",PlusMinus:"±",plusmn:"±",plussim:"⨦",plustwo:"⨧",pm:"±",Poincareplane:"ℌ",pointint:"⨕",Popf:"ℙ",popf:"𝕡",pound:"£",Pr:"⪻",pr:"≺",prap:"⪷",prcue:"≼",prE:"⪳",pre:"⪯",prec:"≺",precapprox:"⪷",preccurlyeq:"≼",Precedes:"≺",PrecedesEqual:"⪯",PrecedesSlantEqual:"≼",PrecedesTilde:"≾",preceq:"⪯",precnapprox:"⪹",precneqq:"⪵",precnsim:"⋨",precsim:"≾",Prime:"″",prime:"′",primes:"ℙ",prnap:"⪹",prnE:"⪵",prnsim:"⋨",prod:"∏",Product:"∏",profalar:"⌮",profline:"⌒",profsurf:"⌓",prop:"∝",Proportion:"∷",Proportional:"∝",propto:"∝",prsim:"≾",prurel:"⊰",Pscr:"𝒫",pscr:"𝓅",Psi:"Ψ",psi:"ψ",puncsp:" ",Qfr:"𝔔",qfr:"𝔮",qint:"⨌",Qopf:"ℚ",qopf:"𝕢",qprime:"⁗",Qscr:"𝒬",qscr:"𝓆",quaternions:"ℍ",quatint:"⨖",quest:"?",questeq:"≟",QUOT:'"',quot:'"',rAarr:"⇛",race:"∽̱",Racute:"Ŕ",racute:"ŕ",radic:"√",raemptyv:"⦳",Rang:"⟫",rang:"⟩",rangd:"⦒",range:"⦥",rangle:"⟩",raquo:"»",Rarr:"↠",rArr:"⇒",rarr:"→",rarrap:"⥵",rarrb:"⇥",rarrbfs:"⤠",rarrc:"⤳",rarrfs:"⤞",rarrhk:"↪",rarrlp:"↬",rarrpl:"⥅",rarrsim:"⥴",Rarrtl:"⤖",rarrtl:"↣",rarrw:"↝",rAtail:"⤜",ratail:"⤚",ratio:"∶",rationals:"ℚ",RBarr:"⤐",rBarr:"⤏",rbarr:"⤍",rbbrk:"❳",rbrace:"}",rbrack:"]",rbrke:"⦌",rbrksld:"⦎",rbrkslu:"⦐",Rcaron:"Ř",rcaron:"ř",Rcedil:"Ŗ",rcedil:"ŗ",rceil:"⌉",rcub:"}",Rcy:"Р",rcy:"р",rdca:"⤷",rdldhar:"⥩",rdquo:"”",rdquor:"”",rdsh:"↳",Re:"ℜ",real:"ℜ",realine:"ℛ",realpart:"ℜ",reals:"ℝ",rect:"▭",REG:"®",reg:"®",ReverseElement:"∋",ReverseEquilibrium:"⇋",ReverseUpEquilibrium:"⥯",rfisht:"⥽",rfloor:"⌋",Rfr:"ℜ",rfr:"𝔯",rHar:"⥤",rhard:"⇁",rharu:"⇀",rharul:"⥬",Rho:"Ρ",rho:"ρ",rhov:"ϱ",RightAngleBracket:"⟩",RightArrow:"→",Rightarrow:"⇒",rightarrow:"→",RightArrowBar:"⇥",RightArrowLeftArrow:"⇄",rightarrowtail:"↣",RightCeiling:"⌉",RightDoubleBracket:"⟧",RightDownTeeVector:"⥝",RightDownVector:"⇂",RightDownVectorBar:"⥕",RightFloor:"⌋",rightharpoondown:"⇁",rightharpoonup:"⇀",rightleftarrows:"⇄",rightleftharpoons:"⇌",rightrightarrows:"⇉",rightsquigarrow:"↝",RightTee:"⊢",RightTeeArrow:"↦",RightTeeVector:"⥛",rightthreetimes:"⋌",RightTriangle:"⊳",RightTriangleBar:"⧐",RightTriangleEqual:"⊵",RightUpDownVector:"⥏",RightUpTeeVector:"⥜",RightUpVector:"↾",RightUpVectorBar:"⥔",RightVector:"⇀",RightVectorBar:"⥓",ring:"˚",risingdotseq:"≓",rlarr:"⇄",rlhar:"⇌",rlm:"‏",rmoust:"⎱",rmoustache:"⎱",rnmid:"⫮",roang:"⟭",roarr:"⇾",robrk:"⟧",ropar:"⦆",Ropf:"ℝ",ropf:"𝕣",roplus:"⨮",rotimes:"⨵",RoundImplies:"⥰",rpar:")",rpargt:"⦔",rppolint:"⨒",rrarr:"⇉",Rrightarrow:"⇛",rsaquo:"›",Rscr:"ℛ",rscr:"𝓇",Rsh:"↱",rsh:"↱",rsqb:"]",rsquo:"’",rsquor:"’",rthree:"⋌",rtimes:"⋊",rtri:"▹",rtrie:"⊵",rtrif:"▸",rtriltri:"⧎",RuleDelayed:"⧴",ruluhar:"⥨",rx:"℞",Sacute:"Ś",sacute:"ś",sbquo:"‚",Sc:"⪼",sc:"≻",scap:"⪸",Scaron:"Š",scaron:"š",sccue:"≽",scE:"⪴",sce:"⪰",Scedil:"Ş",scedil:"ş",Scirc:"Ŝ",scirc:"ŝ",scnap:"⪺",scnE:"⪶",scnsim:"⋩",scpolint:"⨓",scsim:"≿",Scy:"С",scy:"с",sdot:"⋅",sdotb:"⊡",sdote:"⩦",searhk:"⤥",seArr:"⇘",searr:"↘",searrow:"↘",sect:"§",semi:";",seswar:"⤩",setminus:"∖",setmn:"∖",sext:"✶",Sfr:"𝔖",sfr:"𝔰",sfrown:"⌢",sharp:"♯",SHCHcy:"Щ",shchcy:"щ",SHcy:"Ш",shcy:"ш",ShortDownArrow:"↓",ShortLeftArrow:"←",shortmid:"∣",shortparallel:"∥",ShortRightArrow:"→",ShortUpArrow:"↑",shy:"­",Sigma:"Σ",sigma:"σ",sigmaf:"ς",sigmav:"ς",sim:"∼",simdot:"⩪",sime:"≃",simeq:"≃",simg:"⪞",simgE:"⪠",siml:"⪝",simlE:"⪟",simne:"≆",simplus:"⨤",simrarr:"⥲",slarr:"←",SmallCircle:"∘",smallsetminus:"∖",smashp:"⨳",smeparsl:"⧤",smid:"∣",smile:"⌣",smt:"⪪",smte:"⪬",smtes:"⪬︀",SOFTcy:"Ь",softcy:"ь",sol:"/",solb:"⧄",solbar:"⌿",Sopf:"𝕊",sopf:"𝕤",spades:"♠",spadesuit:"♠",spar:"∥",sqcap:"⊓",sqcaps:"⊓︀",sqcup:"⊔",sqcups:"⊔︀",Sqrt:"√",sqsub:"⊏",sqsube:"⊑",sqsubset:"⊏",sqsubseteq:"⊑",sqsup:"⊐",sqsupe:"⊒",sqsupset:"⊐",sqsupseteq:"⊒",squ:"□",Square:"□",square:"□",SquareIntersection:"⊓",SquareSubset:"⊏",SquareSubsetEqual:"⊑",SquareSuperset:"⊐",SquareSupersetEqual:"⊒",SquareUnion:"⊔",squarf:"▪",squf:"▪",srarr:"→",Sscr:"𝒮",sscr:"𝓈",ssetmn:"∖",ssmile:"⌣",sstarf:"⋆",Star:"⋆",star:"☆",starf:"★",straightepsilon:"ϵ",straightphi:"ϕ",strns:"¯",Sub:"⋐",sub:"⊂",subdot:"⪽",subE:"⫅",sube:"⊆",subedot:"⫃",submult:"⫁",subnE:"⫋",subne:"⊊",subplus:"⪿",subrarr:"⥹",Subset:"⋐",subset:"⊂",subseteq:"⊆",subseteqq:"⫅",SubsetEqual:"⊆",subsetneq:"⊊",subsetneqq:"⫋",subsim:"⫇",subsub:"⫕",subsup:"⫓",succ:"≻",succapprox:"⪸",succcurlyeq:"≽",Succeeds:"≻",SucceedsEqual:"⪰",SucceedsSlantEqual:"≽",SucceedsTilde:"≿",succeq:"⪰",succnapprox:"⪺",succneqq:"⪶",succnsim:"⋩",succsim:"≿",SuchThat:"∋",Sum:"∑",sum:"∑",sung:"♪",Sup:"⋑",sup:"⊃",sup1:"¹",sup2:"²",sup3:"³",supdot:"⪾",supdsub:"⫘",supE:"⫆",supe:"⊇",supedot:"⫄",Superset:"⊃",SupersetEqual:"⊇",suphsol:"⟉",suphsub:"⫗",suplarr:"⥻",supmult:"⫂",supnE:"⫌",supne:"⊋",supplus:"⫀",Supset:"⋑",supset:"⊃",supseteq:"⊇",supseteqq:"⫆",supsetneq:"⊋",supsetneqq:"⫌",supsim:"⫈",supsub:"⫔",supsup:"⫖",swarhk:"⤦",swArr:"⇙",swarr:"↙",swarrow:"↙",swnwar:"⤪",szlig:"ß",Tab:"	",target:"⌖",Tau:"Τ",tau:"τ",tbrk:"⎴",Tcaron:"Ť",tcaron:"ť",Tcedil:"Ţ",tcedil:"ţ",Tcy:"Т",tcy:"т",tdot:"⃛",telrec:"⌕",Tfr:"𝔗",tfr:"𝔱",there4:"∴",Therefore:"∴",therefore:"∴",Theta:"Θ",theta:"θ",thetasym:"ϑ",thetav:"ϑ",thickapprox:"≈",thicksim:"∼",ThickSpace:"  ",thinsp:" ",ThinSpace:" ",thkap:"≈",thksim:"∼",THORN:"Þ",thorn:"þ",Tilde:"∼",tilde:"˜",TildeEqual:"≃",TildeFullEqual:"≅",TildeTilde:"≈",times:"×",timesb:"⊠",timesbar:"⨱",timesd:"⨰",tint:"∭",toea:"⤨",top:"⊤",topbot:"⌶",topcir:"⫱",Topf:"𝕋",topf:"𝕥",topfork:"⫚",tosa:"⤩",tprime:"‴",TRADE:"™",trade:"™",triangle:"▵",triangledown:"▿",triangleleft:"◃",trianglelefteq:"⊴",triangleq:"≜",triangleright:"▹",trianglerighteq:"⊵",tridot:"◬",trie:"≜",triminus:"⨺",TripleDot:"⃛",triplus:"⨹",trisb:"⧍",tritime:"⨻",trpezium:"⏢",Tscr:"𝒯",tscr:"𝓉",TScy:"Ц",tscy:"ц",TSHcy:"Ћ",tshcy:"ћ",Tstrok:"Ŧ",tstrok:"ŧ",twixt:"≬",twoheadleftarrow:"↞",twoheadrightarrow:"↠",Uacute:"Ú",uacute:"ú",Uarr:"↟",uArr:"⇑",uarr:"↑",Uarrocir:"⥉",Ubrcy:"Ў",ubrcy:"ў",Ubreve:"Ŭ",ubreve:"ŭ",Ucirc:"Û",ucirc:"û",Ucy:"У",ucy:"у",udarr:"⇅",Udblac:"Ű",udblac:"ű",udhar:"⥮",ufisht:"⥾",Ufr:"𝔘",ufr:"𝔲",Ugrave:"Ù",ugrave:"ù",uHar:"⥣",uharl:"↿",uharr:"↾",uhblk:"▀",ulcorn:"⌜",ulcorner:"⌜",ulcrop:"⌏",ultri:"◸",Umacr:"Ū",umacr:"ū",uml:"¨",UnderBar:"_",UnderBrace:"⏟",UnderBracket:"⎵",UnderParenthesis:"⏝",Union:"⋃",UnionPlus:"⊎",Uogon:"Ų",uogon:"ų",Uopf:"𝕌",uopf:"𝕦",UpArrow:"↑",Uparrow:"⇑",uparrow:"↑",UpArrowBar:"⤒",UpArrowDownArrow:"⇅",UpDownArrow:"↕",Updownarrow:"⇕",updownarrow:"↕",UpEquilibrium:"⥮",upharpoonleft:"↿",upharpoonright:"↾",uplus:"⊎",UpperLeftArrow:"↖",UpperRightArrow:"↗",Upsi:"ϒ",upsi:"υ",upsih:"ϒ",Upsilon:"Υ",upsilon:"υ",UpTee:"⊥",UpTeeArrow:"↥",upuparrows:"⇈",urcorn:"⌝",urcorner:"⌝",urcrop:"⌎",Uring:"Ů",uring:"ů",urtri:"◹",Uscr:"𝒰",uscr:"𝓊",utdot:"⋰",Utilde:"Ũ",utilde:"ũ",utri:"▵",utrif:"▴",uuarr:"⇈",Uuml:"Ü",uuml:"ü",uwangle:"⦧",vangrt:"⦜",varepsilon:"ϵ",varkappa:"ϰ",varnothing:"∅",varphi:"ϕ",varpi:"ϖ",varpropto:"∝",vArr:"⇕",varr:"↕",varrho:"ϱ",varsigma:"ς",varsubsetneq:"⊊︀",varsubsetneqq:"⫋︀",varsupsetneq:"⊋︀",varsupsetneqq:"⫌︀",vartheta:"ϑ",vartriangleleft:"⊲",vartriangleright:"⊳",Vbar:"⫫",vBar:"⫨",vBarv:"⫩",Vcy:"В",vcy:"в",VDash:"⊫",Vdash:"⊩",vDash:"⊨",vdash:"⊢",Vdashl:"⫦",Vee:"⋁",vee:"∨",veebar:"⊻",veeeq:"≚",vellip:"⋮",Verbar:"‖",verbar:"|",Vert:"‖",vert:"|",VerticalBar:"∣",VerticalLine:"|",VerticalSeparator:"❘",VerticalTilde:"≀",VeryThinSpace:" ",Vfr:"𝔙",vfr:"𝔳",vltri:"⊲",vnsub:"⊂⃒",vnsup:"⊃⃒",Vopf:"𝕍",vopf:"𝕧",vprop:"∝",vrtri:"⊳",Vscr:"𝒱",vscr:"𝓋",vsubnE:"⫋︀",vsubne:"⊊︀",vsupnE:"⫌︀",vsupne:"⊋︀",Vvdash:"⊪",vzigzag:"⦚",Wcirc:"Ŵ",wcirc:"ŵ",wedbar:"⩟",Wedge:"⋀",wedge:"∧",wedgeq:"≙",weierp:"℘",Wfr:"𝔚",wfr:"𝔴",Wopf:"𝕎",wopf:"𝕨",wp:"℘",wr:"≀",wreath:"≀",Wscr:"𝒲",wscr:"𝓌",xcap:"⋂",xcirc:"◯",xcup:"⋃",xdtri:"▽",Xfr:"𝔛",xfr:"𝔵",xhArr:"⟺",xharr:"⟷",Xi:"Ξ",xi:"ξ",xlArr:"⟸",xlarr:"⟵",xmap:"⟼",xnis:"⋻",xodot:"⨀",Xopf:"𝕏",xopf:"𝕩",xoplus:"⨁",xotime:"⨂",xrArr:"⟹",xrarr:"⟶",Xscr:"𝒳",xscr:"𝓍",xsqcup:"⨆",xuplus:"⨄",xutri:"△",xvee:"⋁",xwedge:"⋀",Yacute:"Ý",yacute:"ý",YAcy:"Я",yacy:"я",Ycirc:"Ŷ",ycirc:"ŷ",Ycy:"Ы",ycy:"ы",yen:"¥",Yfr:"𝔜",yfr:"𝔶",YIcy:"Ї",yicy:"ї",Yopf:"𝕐",yopf:"𝕪",Yscr:"𝒴",yscr:"𝓎",YUcy:"Ю",yucy:"ю",Yuml:"Ÿ",yuml:"ÿ",Zacute:"Ź",zacute:"ź",Zcaron:"Ž",zcaron:"ž",Zcy:"З",zcy:"з",Zdot:"Ż",zdot:"ż",zeetrf:"ℨ",ZeroWidthSpace:"​",Zeta:"Ζ",zeta:"ζ",Zfr:"ℨ",zfr:"𝔷",ZHcy:"Ж",zhcy:"ж",zigrarr:"⇝",Zopf:"ℤ",zopf:"𝕫",Zscr:"𝒵",zscr:"𝓏",zwj:"‍",zwnj:"‌"}},{}],128:[function(e,t,r){"use strict"
var n={};["article","aside","button","blockquote","body","canvas","caption","col","colgroup","dd","div","dl","dt","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","iframe","li","map","object","ol","output","p","pre","progress","script","section","style","table","tbody","td","textarea","tfoot","th","tr","thead","ul","video"].forEach(function(e){n[e]=!0}),t.exports=n},{}],129:[function(e,t,r){"use strict"
function n(e,t){return e=e.source,t=t||"",function r(n,i){return n?(i=i.source||i,e=e.replace(n,i),r):new RegExp(e,t)}}var i=/[a-zA-Z_:][a-zA-Z0-9:._-]*/,o=/[^"'=<>`\x00-\x20]+/,s=/'[^']*'/,a=/"[^"]*"/,c=n(/(?:unquoted|single_quoted|double_quoted)/)("unquoted",o)("single_quoted",s)("double_quoted",a)(),u=n(/(?:\s+attr_name(?:\s*=\s*attr_value)?)/)("attr_name",i)("attr_value",c)(),l=n(/<[A-Za-z][A-Za-z0-9]*attribute*\s*\/?>/)("attribute",u)(),h=/<\/[A-Za-z][A-Za-z0-9]*\s*>/,f=/<!--([^-]+|[-][^-]+)*-->/,p=/<[?].*?[?]>/,d=/<![A-Z]+\s+[^>]*>/,g=/<!\[CDATA\[([^\]]+|\][^\]]|\]\][^>])*\]\]>/,m=n(/^(?:open_tag|close_tag|comment|processing|declaration|cdata)/)("open_tag",l)("close_tag",h)("comment",f)("processing",p)("declaration",d)("cdata",g)()
t.exports.HTML_TAG_RE=m},{}],130:[function(e,t,r){"use strict"
t.exports=["coap","doi","javascript","aaa","aaas","about","acap","cap","cid","crid","data","dav","dict","dns","file","ftp","geo","go","gopher","h323","http","https","iax","icap","im","imap","info","ipp","iris","iris.beep","iris.xpc","iris.xpcs","iris.lwz","ldap","mailto","mid","msrp","msrps","mtqp","mupdate","news","nfs","ni","nih","nntp","opaquelocktoken","pop","pres","rtsp","service","session","shttp","sieve","sip","sips","sms","snmp","soap.beep","soap.beeps","tag","tel","telnet","tftp","thismessage","tn3270","tip","tv","urn","vemmi","ws","wss","xcon","xcon-userid","xmlrpc.beep","xmlrpc.beeps","xmpp","z39.50r","z39.50s","adiumxtra","afp","afs","aim","apt","attachment","aw","beshare","bitcoin","bolo","callto","chrome","chrome-extension","com-eventbrite-attendee","content","cvs","dlna-playsingle","dlna-playcontainer","dtn","dvb","ed2k","facetime","feed","finger","fish","gg","git","gizmoproject","gtalk","hcp","icon","ipn","irc","irc6","ircs","itms","jar","jms","keyparc","lastfm","ldaps","magnet","maps","market","message","mms","ms-help","msnim","mumble","mvn","notes","oid","palm","paparazzi","platform","proxy","psyc","query","res","resource","rmi","rsync","rtmp","secondlife","sftp","sgn","skype","smb","soldat","spotify","ssh","steam","svn","teamspeak","things","udp","unreal","ut2004","ventrilo","view-source","webcal","wtai","wyciwyg","xfire","xri","ymsgr"]},{}],131:[function(e,t,r){"use strict"
function n(e){return Object.prototype.toString.call(e)}function i(e){return"[object String]"===n(e)}function o(e,t){return e?d.call(e,t):!1}function s(e){var t=[].slice.call(arguments,1)
return t.forEach(function(t){if(t){if("object"!=typeof t)throw new TypeError(t+"must be object")
Object.keys(t).forEach(function(r){e[r]=t[r]})}}),e}function a(e){return e.indexOf("\\")<0?e:e.replace(g,"$1")}function c(e){return e>=55296&&57343>=e?!1:e>=64976&&65007>=e?!1:65535===(65535&e)||65534===(65535&e)?!1:e>=0&&8>=e?!1:11===e?!1:e>=14&&31>=e?!1:e>=127&&159>=e?!1:e>1114111?!1:!0}function u(e){if(e>65535){e-=65536
var t=55296+(e>>10),r=56320+(1023&e)
return String.fromCharCode(t,r)}return String.fromCharCode(e)}function l(e,t){var r=0
return o(b,t)?b[t]:35===t.charCodeAt(0)&&v.test(t)&&(r="x"===t[1].toLowerCase()?parseInt(t.slice(2),16):parseInt(t.slice(1),10),c(r))?u(r):e}function h(e){return e.indexOf("&")<0?e:e.replace(m,l)}function f(e){return _[e]}function p(e){return y.test(e)?e.replace(w,f):e}var d=Object.prototype.hasOwnProperty,g=/\\([\\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g,m=/&([a-z#][a-z0-9]{1,31});/gi,v=/^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))/i,b=e("./entities"),y=/[&<>"]/,w=/[&<>"]/g,_={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}
r.assign=s,r.isString=i,r.has=o,r.unescapeMd=a,r.isValidEntityCode=c,r.fromCodePoint=u,r.replaceEntities=h,r.escapeHtml=p},{"./entities":127}],132:[function(e,t,r){"use strict"
t.exports={options:{html:!0,xhtmlOut:!0,breaks:!1,langPrefix:"language-",linkify:!1,linkTarget:"",typographer:!1,quotes:"“”‘’",highlight:null,maxNesting:20},components:{core:{rules:["block","inline","references","abbr2"]},block:{rules:["blockquote","code","fences","heading","hr","htmlblock","lheading","list","paragraph"]},inline:{rules:["autolink","backticks","emphasis","entity","escape","htmltag","links","newline","text"]}}}},{}],133:[function(e,t,r){"use strict"
t.exports={options:{html:!1,xhtmlOut:!1,breaks:!1,langPrefix:"language-",linkify:!1,linkTarget:"",typographer:!1,quotes:"“”‘’",highlight:null,maxNesting:20},components:{core:{rules:["block","inline","references","replacements","linkify","smartquotes","references","abbr2","footnote_tail"]},block:{rules:["blockquote","code","fences","heading","hr","htmlblock","lheading","list","paragraph","table"]},inline:{rules:["autolink","backticks","del","emphasis","entity","escape","footnote_ref","htmltag","links","newline","text"]}}}},{}],134:[function(e,t,r){"use strict"
t.exports={options:{html:!1,xhtmlOut:!1,breaks:!1,langPrefix:"language-",linkify:!1,linkTarget:"",typographer:!1,quotes:"“”‘’",highlight:null,maxNesting:20},components:{core:{},block:{},inline:{}}}},{}],135:[function(e,t,r){"use strict"
var n=e("../common/utils").replaceEntities
t.exports=function(e){var t=n(e)
try{t=decodeURI(t)}catch(r){}return encodeURI(t)}},{"../common/utils":131}],136:[function(e,t,r){"use strict"
t.exports=function(e){return e.trim().replace(/\s+/g," ").toUpperCase()}},{}],137:[function(e,t,r){"use strict"
var n=e("./normalize_link"),i=e("../common/utils").unescapeMd
t.exports=function(e,t){var r,o,s,a=t,c=e.posMax
if(60===e.src.charCodeAt(t)){for(t++;c>t;){if(r=e.src.charCodeAt(t),10===r)return!1
if(62===r)return s=n(i(e.src.slice(a+1,t))),e.parser.validateLink(s)?(e.pos=t+1,e.linkContent=s,!0):!1
92===r&&c>t+1?t+=2:t++}return!1}for(o=0;c>t&&(r=e.src.charCodeAt(t),32!==r)&&!(r>8&&14>r);)if(92===r&&c>t+1)t+=2
else{if(40===r&&(o++,o>1))break
if(41===r&&(o--,0>o))break
t++}return a===t?!1:(s=i(e.src.slice(a,t)),e.parser.validateLink(s)?(e.linkContent=s,e.pos=t,!0):!1)}},{"../common/utils":131,"./normalize_link":135}],138:[function(e,t,r){"use strict"
t.exports=function(e,t){var r,n,i,o=-1,s=e.posMax,a=e.pos,c=e.isInLabel
if(e.isInLabel)return-1
if(e.labelUnmatchedScopes)return e.labelUnmatchedScopes--,-1
for(e.pos=t+1,e.isInLabel=!0,r=1;e.pos<s;){if(i=e.src.charCodeAt(e.pos),91===i)r++
else if(93===i&&(r--,0===r)){n=!0
break}e.parser.skipToken(e)}return n?(o=e.pos,e.labelUnmatchedScopes=0):e.labelUnmatchedScopes=r-1,e.pos=a,e.isInLabel=c,o}},{}],139:[function(e,t,r){"use strict"
var n=e("../common/utils").unescapeMd
t.exports=function(e,t){var r,i=t,o=e.posMax,s=e.src.charCodeAt(t)
if(34!==s&&39!==s&&40!==s)return!1
for(t++,40===s&&(s=41);o>t;){if(r=e.src.charCodeAt(t),r===s)return e.pos=t+1,e.linkContent=n(e.src.slice(i+1,t)),!0
92===r&&o>t+1?t+=2:t++}return!1}},{"../common/utils":131}],140:[function(e,t,r){"use strict"
function n(e,t,r){this.src=t,this.env=r,this.options=e.options,this.tokens=[],this.inlineMode=!1,this.inline=e.inline,this.block=e.block,this.renderer=e.renderer,this.typographer=e.typographer}function i(e,t){"string"!=typeof e&&(t=e,e="default"),this.inline=new u,this.block=new c,this.core=new a,this.renderer=new s,this.ruler=new l,this.options={},this.configure(h[e]),this.set(t||{})}var o=e("./common/utils").assign,s=e("./renderer"),a=e("./parser_core"),c=e("./parser_block"),u=e("./parser_inline"),l=e("./ruler"),h={"default":e("./configs/default"),full:e("./configs/full"),commonmark:e("./configs/commonmark")}
i.prototype.set=function(e){o(this.options,e)},i.prototype.configure=function(e){var t=this
if(!e)throw new Error("Wrong `remarkable` preset, check name/content")
e.options&&t.set(e.options),e.components&&Object.keys(e.components).forEach(function(r){e.components[r].rules&&t[r].ruler.enable(e.components[r].rules,!0)})},i.prototype.use=function(e,t){return e(this,t),this},i.prototype.parse=function(e,t){var r=new n(this,e,t)
return this.core.process(r),r.tokens},i.prototype.render=function(e,t){return t=t||{},this.renderer.render(this.parse(e,t),this.options,t)},i.prototype.parseInline=function(e,t){var r=new n(this,e,t)
return r.inlineMode=!0,this.core.process(r),r.tokens},i.prototype.renderInline=function(e,t){return t=t||{},this.renderer.render(this.parseInline(e,t),this.options,t)},t.exports=i,t.exports.utils=e("./common/utils")},{"./common/utils":131,"./configs/commonmark":132,"./configs/default":133,"./configs/full":134,"./parser_block":141,"./parser_core":142,"./parser_inline":143,"./renderer":144,"./ruler":145}],141:[function(e,t,r){"use strict"
function n(){this.ruler=new i
for(var e=0;e<s.length;e++)this.ruler.push(s[e][0],s[e][1],{alt:(s[e][2]||[]).slice()})}var i=e("./ruler"),o=e("./rules_block/state_block"),s=[["code",e("./rules_block/code")],["fences",e("./rules_block/fences"),["paragraph","blockquote","list"]],["blockquote",e("./rules_block/blockquote"),["paragraph","blockquote","list"]],["hr",e("./rules_block/hr"),["paragraph","blockquote","list"]],["list",e("./rules_block/list"),["paragraph","blockquote"]],["footnote",e("./rules_block/footnote"),["paragraph"]],["heading",e("./rules_block/heading"),["paragraph","blockquote"]],["lheading",e("./rules_block/lheading")],["htmlblock",e("./rules_block/htmlblock"),["paragraph","blockquote"]],["table",e("./rules_block/table"),["paragraph"]],["deflist",e("./rules_block/deflist"),["paragraph"]],["paragraph",e("./rules_block/paragraph")]]
n.prototype.tokenize=function(e,t,r){for(var n,i,o=this.ruler.getRules(""),s=o.length,a=t,c=!1;r>a&&(e.line=a=e.skipEmptyLines(a),!(a>=r))&&!(e.tShift[a]<e.blkIndent);){for(i=0;s>i&&!(n=o[i](e,a,r,!1));i++);if(e.tight=!c,e.isEmpty(e.line-1)&&(c=!0),a=e.line,r>a&&e.isEmpty(a)){if(c=!0,a++,r>a&&"list"===e.parentType&&e.isEmpty(a))break
e.line=a}}}
var a=/[\n\t]/g,c=/\r[\n\u0085]|[\u2424\u2028\u0085]/g,u=/\u00a0/g
n.prototype.parse=function(e,t,r,n){var i,s=0,l=0
return e?(e=e.replace(u," "),e=e.replace(c,"\n"),e.indexOf("	")>=0&&(e=e.replace(a,function(t,r){var n
return 10===e.charCodeAt(r)?(s=r+1,l=0,t):(n="    ".slice((r-s-l)%4),l=r-s+1,n)})),i=new o(e,this,t,r,n),void this.tokenize(i,i.line,i.lineMax)):[]},t.exports=n},{"./ruler":145,"./rules_block/blockquote":147,"./rules_block/code":148,"./rules_block/deflist":149,"./rules_block/fences":150,"./rules_block/footnote":151,"./rules_block/heading":152,"./rules_block/hr":153,"./rules_block/htmlblock":154,"./rules_block/lheading":155,"./rules_block/list":156,"./rules_block/paragraph":157,"./rules_block/state_block":158,"./rules_block/table":159}],142:[function(e,t,r){"use strict"
function n(){this.options={},this.ruler=new i
for(var e=0;e<o.length;e++)this.ruler.push(o[e][0],o[e][1])}var i=e("./ruler"),o=[["block",e("./rules_core/block")],["abbr",e("./rules_core/abbr")],["references",e("./rules_core/references")],["inline",e("./rules_core/inline")],["footnote_tail",e("./rules_core/footnote_tail")],["abbr2",e("./rules_core/abbr2")],["replacements",e("./rules_core/replacements")],["smartquotes",e("./rules_core/smartquotes")],["linkify",e("./rules_core/linkify")]]
n.prototype.process=function(e){var t,r,n
for(n=this.ruler.getRules(""),t=0,r=n.length;r>t;t++)n[t](e)},t.exports=n},{"./ruler":145,"./rules_core/abbr":160,"./rules_core/abbr2":161,"./rules_core/block":162,"./rules_core/footnote_tail":163,"./rules_core/inline":164,"./rules_core/linkify":165,"./rules_core/references":166,"./rules_core/replacements":167,"./rules_core/smartquotes":168}],143:[function(e,t,r){"use strict"
function n(){this.ruler=new o
for(var e=0;e<c.length;e++)this.ruler.push(c[e][0],c[e][1])
this.validateLink=i}function i(e){var t=["vbscript","javascript","file"],r=e.trim().toLowerCase()
return r=a.replaceEntities(r),-1!==r.indexOf(":")&&-1!==t.indexOf(r.split(":")[0])?!1:!0}var o=e("./ruler"),s=e("./rules_inline/state_inline"),a=e("./common/utils"),c=[["text",e("./rules_inline/text")],["newline",e("./rules_inline/newline")],["escape",e("./rules_inline/escape")],["backticks",e("./rules_inline/backticks")],["del",e("./rules_inline/del")],["ins",e("./rules_inline/ins")],["mark",e("./rules_inline/mark")],["emphasis",e("./rules_inline/emphasis")],["sub",e("./rules_inline/sub")],["sup",e("./rules_inline/sup")],["links",e("./rules_inline/links")],["footnote_inline",e("./rules_inline/footnote_inline")],["footnote_ref",e("./rules_inline/footnote_ref")],["autolink",e("./rules_inline/autolink")],["htmltag",e("./rules_inline/htmltag")],["entity",e("./rules_inline/entity")]]
n.prototype.skipToken=function(e){var t,r,n=this.ruler.getRules(""),i=n.length,o=e.pos
if((r=e.cacheGet(o))>0)return void(e.pos=r)
for(t=0;i>t;t++)if(n[t](e,!0))return void e.cacheSet(o,e.pos)
e.pos++,e.cacheSet(o,e.pos)},n.prototype.tokenize=function(e){for(var t,r,n=this.ruler.getRules(""),i=n.length,o=e.posMax;e.pos<o;){for(r=0;i>r&&!(t=n[r](e,!1));r++);if(t){if(e.pos>=o)break}else e.pending+=e.src[e.pos++]}e.pending&&e.pushPending()},n.prototype.parse=function(e,t,r,n){var i=new s(e,this,t,r,n)
this.tokenize(i)},t.exports=n},{"./common/utils":131,"./ruler":145,"./rules_inline/autolink":169,"./rules_inline/backticks":170,"./rules_inline/del":171,"./rules_inline/emphasis":172,"./rules_inline/entity":173,"./rules_inline/escape":174,"./rules_inline/footnote_inline":175,"./rules_inline/footnote_ref":176,"./rules_inline/htmltag":177,"./rules_inline/ins":178,"./rules_inline/links":179,"./rules_inline/mark":180,"./rules_inline/newline":181,"./rules_inline/state_inline":182,"./rules_inline/sub":183,"./rules_inline/sup":184,"./rules_inline/text":185}],144:[function(e,t,r){"use strict"
function n(){this.rules=i.assign({},o),this.getBreak=o.getBreak}var i=e("./common/utils"),o=e("./rules")
t.exports=n,n.prototype.renderInline=function(e,t,r){for(var n=this.rules,i=e.length,o=0,s="";i--;)s+=n[e[o].type](e,o++,t,r,this)
return s},n.prototype.render=function(e,t,r){for(var n=this.rules,i=e.length,o=-1,s="";++o<i;)s+="inline"===e[o].type?this.renderInline(e[o].children,t,r):n[e[o].type](e,o,t,r,this)
return s}},{"./common/utils":131,"./rules":146}],145:[function(e,t,r){"use strict"
function n(){this.__rules__=[],this.__cache__=null}n.prototype.__find__=function(e){for(var t=this.__rules__.length,r=-1;t--;)if(this.__rules__[++r].name===e)return r
return-1},n.prototype.__compile__=function(){var e=this,t=[""]
e.__rules__.forEach(function(e){e.enabled&&e.alt.forEach(function(e){t.indexOf(e)<0&&t.push(e)})}),e.__cache__={},t.forEach(function(t){e.__cache__[t]=[],e.__rules__.forEach(function(r){r.enabled&&(t&&r.alt.indexOf(t)<0||e.__cache__[t].push(r.fn))})})},n.prototype.at=function(e,t,r){var n=this.__find__(e),i=r||{}
if(-1===n)throw new Error("Parser rule not found: "+e)
this.__rules__[n].fn=t,this.__rules__[n].alt=i.alt||[],this.__cache__=null},n.prototype.before=function(e,t,r,n){var i=this.__find__(e),o=n||{}
if(-1===i)throw new Error("Parser rule not found: "+e)
this.__rules__.splice(i,0,{name:t,enabled:!0,fn:r,alt:o.alt||[]}),this.__cache__=null},n.prototype.after=function(e,t,r,n){var i=this.__find__(e),o=n||{}
if(-1===i)throw new Error("Parser rule not found: "+e)
this.__rules__.splice(i+1,0,{name:t,enabled:!0,fn:r,alt:o.alt||[]}),this.__cache__=null},n.prototype.push=function(e,t,r){var n=r||{}
this.__rules__.push({name:e,enabled:!0,fn:t,alt:n.alt||[]}),this.__cache__=null},n.prototype.enable=function(e,t){e=Array.isArray(e)?e:[e],t&&this.__rules__.forEach(function(e){e.enabled=!1}),e.forEach(function(e){var t=this.__find__(e)
if(0>t)throw new Error("Rules manager: invalid rule name "+e)
this.__rules__[t].enabled=!0},this),this.__cache__=null},n.prototype.disable=function(e){e=Array.isArray(e)?e:[e],e.forEach(function(e){var t=this.__find__(e)
if(0>t)throw new Error("Rules manager: invalid rule name "+e)
this.__rules__[t].enabled=!1},this),this.__cache__=null},n.prototype.getRules=function(e){return null===this.__cache__&&this.__compile__(),this.__cache__[e]},t.exports=n},{}],146:[function(e,t,r){"use strict"
function n(e,t){return++t>=e.length-2?t:"paragraph_open"===e[t].type&&e[t].tight&&"inline"===e[t+1].type&&0===e[t+1].content.length&&"paragraph_close"===e[t+2].type&&e[t+2].tight?n(e,t+2):t}var i=e("./common/utils").has,o=e("./common/utils").unescapeMd,s=e("./common/utils").replaceEntities,a=e("./common/utils").escapeHtml,c={}
c.blockquote_open=function(){return"<blockquote>\n"},c.blockquote_close=function(e,t){return"</blockquote>"+u(e,t)},c.code=function(e,t){return e[t].block?"<pre><code>"+a(e[t].content)+"</code></pre>"+u(e,t):"<code>"+a(e[t].content)+"</code>"},c.fence=function(e,t,r,n,c){var l,h,f=e[t],p="",d=r.langPrefix,g=""
if(f.params){if(l=f.params.split(/\s+/g)[0],i(c.rules.fence_custom,l))return c.rules.fence_custom[l](e,t,r,n,c)
g=a(s(o(l))),p=' class="'+d+g+'"'}return h=r.highlight?r.highlight(f.content,g)||a(f.content):a(f.content),"<pre><code"+p+">"+h+"</code></pre>"+u(e,t)},c.fence_custom={},c.heading_open=function(e,t){return"<h"+e[t].hLevel+">"},c.heading_close=function(e,t){return"</h"+e[t].hLevel+">\n"},c.hr=function(e,t,r){return(r.xhtmlOut?"<hr />":"<hr>")+u(e,t)},c.bullet_list_open=function(){return"<ul>\n"},c.bullet_list_close=function(e,t){return"</ul>"+u(e,t)},c.list_item_open=function(){return"<li>"},c.list_item_close=function(){return"</li>\n"},c.ordered_list_open=function(e,t){var r=e[t],n=r.order>1?' start="'+r.order+'"':""
return"<ol"+n+">\n"},c.ordered_list_close=function(e,t){return"</ol>"+u(e,t)},c.paragraph_open=function(e,t){return e[t].tight?"":"<p>"},c.paragraph_close=function(e,t){var r=!(e[t].tight&&t&&"inline"===e[t-1].type&&!e[t-1].content)
return(e[t].tight?"":"</p>")+(r?u(e,t):"")},c.link_open=function(e,t,r){var n=e[t].title?' title="'+a(s(e[t].title))+'"':"",i=r.linkTarget?' target="'+r.linkTarget+'"':""
return'<a href="'+a(e[t].href)+'"'+n+i+">"},c.link_close=function(){return"</a>"},c.image=function(e,t,r){var n=' src="'+a(e[t].src)+'"',i=e[t].title?' title="'+a(s(e[t].title))+'"':"",o=' alt="'+(e[t].alt?a(s(e[t].alt)):"")+'"',c=r.xhtmlOut?" /":""
return"<img"+n+o+i+c+">"},c.table_open=function(){return"<table>\n"},c.table_close=function(){return"</table>\n"},c.thead_open=function(){return"<thead>\n"},c.thead_close=function(){return"</thead>\n"},c.tbody_open=function(){return"<tbody>\n"},c.tbody_close=function(){return"</tbody>\n"},c.tr_open=function(){return"<tr>"},c.tr_close=function(){return"</tr>\n"},c.th_open=function(e,t){var r=e[t]
return"<th"+(r.align?' style="text-align:'+r.align+'"':"")+">"},c.th_close=function(){return"</th>"},c.td_open=function(e,t){var r=e[t]
return"<td"+(r.align?' style="text-align:'+r.align+'"':"")+">"},c.td_close=function(){return"</td>"},c.strong_open=function(){return"<strong>"},c.strong_close=function(){return"</strong>"},c.em_open=function(){return"<em>"},c.em_close=function(){return"</em>"},c.del_open=function(){return"<del>"},c.del_close=function(){return"</del>"},c.ins_open=function(){return"<ins>"},c.ins_close=function(){return"</ins>"},c.mark_open=function(){return"<mark>"},c.mark_close=function(){return"</mark>"},c.sub=function(e,t){return"<sub>"+a(e[t].content)+"</sub>"},c.sup=function(e,t){return"<sup>"+a(e[t].content)+"</sup>"},c.hardbreak=function(e,t,r){return r.xhtmlOut?"<br />\n":"<br>\n"},c.softbreak=function(e,t,r){return r.breaks?r.xhtmlOut?"<br />\n":"<br>\n":"\n"},c.text=function(e,t){return a(e[t].content)},c.htmlblock=function(e,t){return e[t].content},c.htmltag=function(e,t){return e[t].content},c.abbr_open=function(e,t){return'<abbr title="'+a(s(e[t].title))+'">'},c.abbr_close=function(){return"</abbr>"},c.footnote_ref=function(e,t){var r=Number(e[t].id+1).toString(),n="fnref"+r
return e[t].subId>0&&(n+=":"+e[t].subId),'<sup class="footnote-ref"><a href="#fn'+r+'" id="'+n+'">['+r+"]</a></sup>"},c.footnote_block_open=function(e,t,r){var n=r.xhtmlOut?'<hr class="footnotes-sep" />\n':'<hr class="footnotes-sep">\n'
return n+'<section class="footnotes">\n<ol class="footnotes-list">\n'},c.footnote_block_close=function(){return"</ol>\n</section>\n"},c.footnote_open=function(e,t){var r=Number(e[t].id+1).toString()
return'<li id="fn'+r+'"  class="footnote-item">'},c.footnote_close=function(){return"</li>\n"},c.footnote_anchor=function(e,t){var r=Number(e[t].id+1).toString(),n="fnref"+r
return e[t].subId>0&&(n+=":"+e[t].subId),' <a href="#'+n+'" class="footnote-backref">↩</a>'},c.dl_open=function(){return"<dl>\n"},c.dt_open=function(){return"<dt>"},c.dd_open=function(){return"<dd>"},c.dl_close=function(){return"</dl>\n"},c.dt_close=function(){return"</dt>\n"},c.dd_close=function(){return"</dd>\n"}
var u=c.getBreak=function(e,t){return t=n(e,t),t<e.length&&"list_item_close"===e[t].type?"":"\n"}
t.exports=c},{"./common/utils":131}],147:[function(e,t,r){"use strict"
t.exports=function(e,t,r,n){var i,o,s,a,c,u,l,h,f,p,d,g=e.bMarks[t]+e.tShift[t],m=e.eMarks[t]
if(g>m)return!1
if(62!==e.src.charCodeAt(g++))return!1
if(e.level>=e.options.maxNesting)return!1
if(n)return!0
for(32===e.src.charCodeAt(g)&&g++,c=e.blkIndent,e.blkIndent=0,a=[e.bMarks[t]],e.bMarks[t]=g,g=m>g?e.skipSpaces(g):g,o=g>=m,s=[e.tShift[t]],e.tShift[t]=g-e.bMarks[t],h=e.parser.ruler.getRules("blockquote"),i=t+1;r>i&&(g=e.bMarks[i]+e.tShift[i],m=e.eMarks[i],!(g>=m));i++)if(62!==e.src.charCodeAt(g++)){if(o)break
for(d=!1,f=0,p=h.length;p>f;f++)if(h[f](e,i,r,!0)){d=!0
break}if(d)break
a.push(e.bMarks[i]),s.push(e.tShift[i]),e.tShift[i]=-1337}else 32===e.src.charCodeAt(g)&&g++,a.push(e.bMarks[i]),e.bMarks[i]=g,g=m>g?e.skipSpaces(g):g,o=g>=m,s.push(e.tShift[i]),e.tShift[i]=g-e.bMarks[i]
for(u=e.parentType,e.parentType="blockquote",e.tokens.push({type:"blockquote_open",lines:l=[t,0],level:e.level++}),e.parser.tokenize(e,t,i),e.tokens.push({type:"blockquote_close",level:--e.level}),e.parentType=u,l[1]=e.line,f=0;f<s.length;f++)e.bMarks[f+t]=a[f],e.tShift[f+t]=s[f]
return e.blkIndent=c,!0}},{}],148:[function(e,t,r){"use strict"
t.exports=function(e,t,r){var n,i
if(e.tShift[t]-e.blkIndent<4)return!1
for(i=n=t+1;r>n;)if(e.isEmpty(n))n++
else{if(!(e.tShift[n]-e.blkIndent>=4))break
n++,i=n}return e.line=n,e.tokens.push({type:"code",content:e.getLines(t,i,4+e.blkIndent,!0),block:!0,lines:[t,e.line],level:e.level}),!0}},{}],149:[function(e,t,r){"use strict"
function n(e,t){var r,n,i=e.bMarks[t]+e.tShift[t],o=e.eMarks[t]
return i>=o?-1:(n=e.src.charCodeAt(i++),126!==n&&58!==n?-1:(r=e.skipSpaces(i),i===r?-1:r>=o?-1:r))}function i(e,t){var r,n,i=e.level+2
for(r=t+2,n=e.tokens.length-2;n>r;r++)e.tokens[r].level===i&&"paragraph_open"===e.tokens[r].type&&(e.tokens[r+2].tight=!0,e.tokens[r].tight=!0,r+=2)}t.exports=function(e,t,r,o){var s,a,c,u,l,h,f,p,d,g,m,v,b,y
if(o)return e.ddIndent<0?!1:n(e,t)>=0
if(f=t+1,e.isEmpty(f)&&++f>r)return!1
if(e.tShift[f]<e.blkIndent)return!1
if(s=n(e,f),0>s)return!1
if(e.level>=e.options.maxNesting)return!1
h=e.tokens.length,e.tokens.push({type:"dl_open",lines:l=[t,0],level:e.level++}),c=t,a=f
e:for(;;){for(y=!0,b=!1,e.tokens.push({type:"dt_open",lines:[c,c],level:e.level++}),e.tokens.push({type:"inline",content:e.getLines(c,c+1,e.blkIndent,!1).trim(),level:e.level+1,lines:[c,c],children:[]}),e.tokens.push({type:"dt_close",level:--e.level});;){if(e.tokens.push({type:"dd_open",lines:u=[f,0],level:e.level++}),v=e.tight,d=e.ddIndent,p=e.blkIndent,m=e.tShift[a],g=e.parentType,e.blkIndent=e.ddIndent=e.tShift[a]+2,e.tShift[a]=s-e.bMarks[a],e.tight=!0,e.parentType="deflist",e.parser.tokenize(e,a,r,!0),(!e.tight||b)&&(y=!1),b=e.line-a>1&&e.isEmpty(e.line-1),e.tShift[a]=m,e.tight=v,e.parentType=g,e.blkIndent=p,e.ddIndent=d,e.tokens.push({type:"dd_close",level:--e.level}),u[1]=f=e.line,f>=r)break e
if(e.tShift[f]<e.blkIndent)break e
if(s=n(e,f),0>s)break
a=f}if(f>=r)break
if(c=f,e.isEmpty(c))break
if(e.tShift[c]<e.blkIndent)break
if(a=c+1,a>=r)break
if(e.isEmpty(a)&&a++,a>=r)break
if(e.tShift[a]<e.blkIndent)break
if(s=n(e,a),0>s)break}return e.tokens.push({type:"dl_close",level:--e.level}),l[1]=f,e.line=f,y&&i(e,h),!0}},{}],150:[function(e,t,r){"use strict"
t.exports=function(e,t,r,n){var i,o,s,a,c,u=!1,l=e.bMarks[t]+e.tShift[t],h=e.eMarks[t]
if(l+3>h)return!1
if(i=e.src.charCodeAt(l),126!==i&&96!==i)return!1
if(c=l,l=e.skipChars(l,i),o=l-c,3>o)return!1
if(s=e.src.slice(l,h).trim(),s.indexOf("`")>=0)return!1
if(n)return!0
for(a=t;(a++,!(a>=r))&&(l=c=e.bMarks[a]+e.tShift[a],h=e.eMarks[a],!(h>l&&e.tShift[a]<e.blkIndent));)if(e.src.charCodeAt(l)===i&&!(e.tShift[a]-e.blkIndent>=4||(l=e.skipChars(l,i),o>l-c||(l=e.skipSpaces(l),h>l)))){u=!0
break}return o=e.tShift[t],e.line=a+(u?1:0),e.tokens.push({type:"fence",params:s,content:e.getLines(t+1,a,o,!0),lines:[t,e.line],level:e.level}),!0}},{}],151:[function(e,t,r){"use strict"
t.exports=function(e,t,r,n){var i,o,s,a,c,u=e.bMarks[t]+e.tShift[t],l=e.eMarks[t]
if(u+4>l)return!1
if(91!==e.src.charCodeAt(u))return!1
if(94!==e.src.charCodeAt(u+1))return!1
if(e.level>=e.options.maxNesting)return!1
for(a=u+2;l>a;a++){if(32===e.src.charCodeAt(a))return!1
if(93===e.src.charCodeAt(a))break}return a===u+2?!1:a+1>=l||58!==e.src.charCodeAt(++a)?!1:n?!0:(a++,e.env.footnotes||(e.env.footnotes={}),e.env.footnotes.refs||(e.env.footnotes.refs={}),c=e.src.slice(u+2,a-2),e.env.footnotes.refs[":"+c]=-1,e.tokens.push({type:"footnote_reference_open",label:c,level:e.level++}),i=e.bMarks[t],o=e.tShift[t],s=e.parentType,e.tShift[t]=e.skipSpaces(a)-a,e.bMarks[t]=a,e.blkIndent+=4,e.parentType="footnote",e.tShift[t]<e.blkIndent&&(e.tShift[t]+=e.blkIndent,e.bMarks[t]-=e.blkIndent),e.parser.tokenize(e,t,r,!0),e.parentType=s,e.blkIndent-=4,e.tShift[t]=o,e.bMarks[t]=i,e.tokens.push({type:"footnote_reference_close",level:--e.level}),!0)}},{}],152:[function(e,t,r){"use strict"
t.exports=function(e,t,r,n){var i,o,s,a=e.bMarks[t]+e.tShift[t],c=e.eMarks[t]
if(a>=c)return!1
if(i=e.src.charCodeAt(a),35!==i||a>=c)return!1
for(o=1,i=e.src.charCodeAt(++a);35===i&&c>a&&6>=o;)o++,i=e.src.charCodeAt(++a)
return o>6||c>a&&32!==i?!1:n?!0:(c=e.skipCharsBack(c,32,a),s=e.skipCharsBack(c,35,a),s>a&&32===e.src.charCodeAt(s-1)&&(c=s),e.line=t+1,e.tokens.push({type:"heading_open",hLevel:o,lines:[t,e.line],level:e.level}),c>a&&e.tokens.push({type:"inline",content:e.src.slice(a,c).trim(),level:e.level+1,lines:[t,e.line],children:[]}),e.tokens.push({type:"heading_close",hLevel:o,level:e.level}),!0)}},{}],153:[function(e,t,r){"use strict"
t.exports=function(e,t,r,n){var i,o,s,a=e.bMarks[t],c=e.eMarks[t]
if(a+=e.tShift[t],a>c)return!1
if(i=e.src.charCodeAt(a++),42!==i&&45!==i&&95!==i)return!1
for(o=1;c>a;){if(s=e.src.charCodeAt(a++),s!==i&&32!==s)return!1
s===i&&o++}return 3>o?!1:n?!0:(e.line=t+1,e.tokens.push({type:"hr",lines:[t,e.line],level:e.level}),!0)}},{}],154:[function(e,t,r){"use strict"
function n(e){var t=32|e
return t>=97&&122>=t}var i=e("../common/html_blocks"),o=/^<([a-zA-Z]{1,15})[\s\/>]/,s=/^<\/([a-zA-Z]{1,15})[\s>]/
t.exports=function(e,t,r,a){var c,u,l,h=e.bMarks[t],f=e.eMarks[t],p=e.tShift[t]
if(h+=p,!e.options.html)return!1
if(p>3||h+2>=f)return!1
if(60!==e.src.charCodeAt(h))return!1
if(c=e.src.charCodeAt(h+1),33===c||63===c){if(a)return!0}else{if(47!==c&&!n(c))return!1
if(47===c){if(u=e.src.slice(h,f).match(s),!u)return!1}else if(u=e.src.slice(h,f).match(o),!u)return!1
if(i[u[1].toLowerCase()]!==!0)return!1
if(a)return!0}for(l=t+1;l<e.lineMax&&!e.isEmpty(l);)l++
return e.line=l,e.tokens.push({type:"htmlblock",level:e.level,lines:[t,e.line],content:e.getLines(t,l,0,!0)}),!0}},{"../common/html_blocks":128}],155:[function(e,t,r){"use strict"
t.exports=function(e,t,r){var n,i,o,s=t+1
return s>=r?!1:e.tShift[s]<e.blkIndent?!1:e.tShift[s]-e.blkIndent>3?!1:(i=e.bMarks[s]+e.tShift[s],o=e.eMarks[s],i>=o?!1:(n=e.src.charCodeAt(i),45!==n&&61!==n?!1:(i=e.skipChars(i,n),i=e.skipSpaces(i),o>i?!1:(i=e.bMarks[t]+e.tShift[t],e.line=s+1,e.tokens.push({type:"heading_open",hLevel:61===n?1:2,lines:[t,e.line],level:e.level}),e.tokens.push({type:"inline",content:e.src.slice(i,e.eMarks[t]).trim(),level:e.level+1,lines:[t,e.line-1],children:[]}),e.tokens.push({type:"heading_close",hLevel:61===n?1:2,level:e.level}),!0))))}},{}],156:[function(e,t,r){"use strict"
function n(e,t){var r,n,i
return n=e.bMarks[t]+e.tShift[t],i=e.eMarks[t],n>=i?-1:(r=e.src.charCodeAt(n++),42!==r&&45!==r&&43!==r?-1:i>n&&32!==e.src.charCodeAt(n)?-1:n)}function i(e,t){var r,n=e.bMarks[t]+e.tShift[t],i=e.eMarks[t]
if(n+1>=i)return-1
if(r=e.src.charCodeAt(n++),48>r||r>57)return-1
for(;;){if(n>=i)return-1
if(r=e.src.charCodeAt(n++),!(r>=48&&57>=r)){if(41===r||46===r)break
return-1}}return i>n&&32!==e.src.charCodeAt(n)?-1:n}function o(e,t){var r,n,i=e.level+2
for(r=t+2,n=e.tokens.length-2;n>r;r++)e.tokens[r].level===i&&"paragraph_open"===e.tokens[r].type&&(e.tokens[r+2].tight=!0,e.tokens[r].tight=!0,r+=2)}t.exports=function(e,t,r,s){var a,c,u,l,h,f,p,d,g,m,v,b,y,w,_,k,x,E,A,S,C,T,q=!0
if((d=i(e,t))>=0)y=!0
else{if(!((d=n(e,t))>=0))return!1
y=!1}if(e.level>=e.options.maxNesting)return!1
if(b=e.src.charCodeAt(d-1),s)return!0
for(_=e.tokens.length,y?(p=e.bMarks[t]+e.tShift[t],v=Number(e.src.substr(p,d-p-1)),e.tokens.push({type:"ordered_list_open",order:v,lines:x=[t,0],level:e.level++})):e.tokens.push({type:"bullet_list_open",lines:x=[t,0],level:e.level++}),a=t,k=!1,A=e.parser.ruler.getRules("list");!(!(r>a)||(w=e.skipSpaces(d),g=e.eMarks[a],m=w>=g?1:w-d,m>4&&(m=1),1>m&&(m=1),c=d-e.bMarks[a]+m,e.tokens.push({type:"list_item_open",lines:E=[t,0],level:e.level++}),l=e.blkIndent,h=e.tight,u=e.tShift[t],f=e.parentType,e.tShift[t]=w-e.bMarks[t],e.blkIndent=c,e.tight=!0,e.parentType="list",e.parser.tokenize(e,t,r,!0),(!e.tight||k)&&(q=!1),k=e.line-t>1&&e.isEmpty(e.line-1),e.blkIndent=l,e.tShift[t]=u,e.tight=h,e.parentType=f,e.tokens.push({type:"list_item_close",level:--e.level}),a=t=e.line,E[1]=a,w=e.bMarks[t],a>=r)||e.isEmpty(a)||e.tShift[a]<e.blkIndent);){for(T=!1,S=0,C=A.length;C>S;S++)if(A[S](e,a,r,!0)){T=!0
break}if(T)break
if(y){if(d=i(e,a),0>d)break}else if(d=n(e,a),0>d)break
if(b!==e.src.charCodeAt(d-1))break}return e.tokens.push({type:y?"ordered_list_close":"bullet_list_close",level:--e.level}),x[1]=a,e.line=a,q&&o(e,_),!0}},{}],157:[function(e,t,r){"use strict"
t.exports=function(e,t){var r,n,i,o,s,a,c=t+1
if(r=e.lineMax,r>c&&!e.isEmpty(c))for(a=e.parser.ruler.getRules("paragraph");r>c&&!e.isEmpty(c);c++)if(!(e.tShift[c]-e.blkIndent>3)){for(i=!1,o=0,s=a.length;s>o;o++)if(a[o](e,c,r,!0)){i=!0
break}if(i)break}return n=e.getLines(t,c,e.blkIndent,!1).trim(),e.line=c,n.length&&(e.tokens.push({type:"paragraph_open",tight:!1,lines:[t,e.line],level:e.level}),e.tokens.push({type:"inline",content:n,level:e.level+1,lines:[t,e.line],children:[]}),e.tokens.push({type:"paragraph_close",tight:!1,level:e.level})),!0}},{}],158:[function(e,t,r){"use strict"
function n(e,t,r,n,i){var o,s,a,c,u,l,h
for(this.src=e,this.parser=t,this.options=r,this.env=n,this.tokens=i,this.bMarks=[],this.eMarks=[],this.tShift=[],this.blkIndent=0,this.line=0,this.lineMax=0,this.tight=!1,this.parentType="root",this.ddIndent=-1,this.level=0,this.result="",s=this.src,l=0,h=!1,a=c=l=0,u=s.length;u>c;c++){if(o=s.charCodeAt(c),!h){if(32===o){l++
continue}h=!0}(10===o||c===u-1)&&(10!==o&&c++,this.bMarks.push(a),this.eMarks.push(c),this.tShift.push(l),h=!1,l=0,a=c+1)}this.bMarks.push(s.length),this.eMarks.push(s.length),this.tShift.push(0),this.lineMax=this.bMarks.length-1}n.prototype.isEmpty=function(e){return this.bMarks[e]+this.tShift[e]>=this.eMarks[e]},n.prototype.skipEmptyLines=function(e){for(var t=this.lineMax;t>e&&!(this.bMarks[e]+this.tShift[e]<this.eMarks[e]);e++);return e},n.prototype.skipSpaces=function(e){for(var t=this.src.length;t>e&&32===this.src.charCodeAt(e);e++);return e},n.prototype.skipChars=function(e,t){for(var r=this.src.length;r>e&&this.src.charCodeAt(e)===t;e++);return e},n.prototype.skipCharsBack=function(e,t,r){if(r>=e)return e
for(;e>r;)if(t!==this.src.charCodeAt(--e))return e+1
return e},n.prototype.getLines=function(e,t,r,n){var i,o,s,a,c,u=e
if(e>=t)return""
if(u+1===t)return o=this.bMarks[u]+Math.min(this.tShift[u],r),s=n?this.eMarks[u]+1:this.eMarks[u],this.src.slice(o,s)
for(a=new Array(t-e),i=0;t>u;u++,i++)c=this.tShift[u],c>r&&(c=r),0>c&&(c=0),o=this.bMarks[u]+c,s=t>u+1||n?this.eMarks[u]+1:this.eMarks[u],a[i]=this.src.slice(o,s)
return a.join("")},t.exports=n},{}],159:[function(e,t,r){"use strict"
function n(e,t){var r=e.bMarks[t]+e.blkIndent,n=e.eMarks[t]
return e.src.substr(r,n-r)}t.exports=function(e,t,r,i){var o,s,a,c,u,l,h,f,p,d
if(t+2>r)return!1
if(u=t+1,e.tShift[u]<e.blkIndent)return!1
if(a=e.bMarks[u]+e.tShift[u],a>=e.eMarks[u])return!1
if(o=e.src.charCodeAt(a),124!==o&&45!==o&&58!==o)return!1
if(s=n(e,t+1),!/^[-:| ]+$/.test(s))return!1
if(l=s.split("|"),2>=l)return!1
for(h=[],c=0;c<l.length;c++){if(f=l[c].trim(),!f){if(0===c||c===l.length-1)continue
return!1}if(!/^:?-+:?$/.test(f))return!1
58===f.charCodeAt(f.length-1)?h.push(58===f.charCodeAt(0)?"center":"right"):58===f.charCodeAt(0)?h.push("left"):h.push("")}if(s=n(e,t).trim(),-1===s.indexOf("|"))return!1
if(l=s.replace(/^\||\|$/g,"").split("|"),h.length!==l.length)return!1
if(i)return!0
for(e.tokens.push({type:"table_open",lines:p=[t,0],level:e.level++}),e.tokens.push({type:"thead_open",lines:[t,t+1],level:e.level++}),e.tokens.push({type:"tr_open",lines:[t,t+1],level:e.level++}),c=0;c<l.length;c++)e.tokens.push({type:"th_open",align:h[c],lines:[t,t+1],level:e.level++}),e.tokens.push({type:"inline",content:l[c].trim(),lines:[t,t+1],level:e.level,children:[]}),e.tokens.push({type:"th_close",level:--e.level})
for(e.tokens.push({type:"tr_close",level:--e.level}),e.tokens.push({type:"thead_close",level:--e.level}),e.tokens.push({type:"tbody_open",lines:d=[t+2,0],level:e.level++}),u=t+2;r>u&&!(e.tShift[u]<e.blkIndent)&&(s=n(e,u).trim(),-1!==s.indexOf("|"));u++){for(l=s.replace(/^\||\|$/g,"").split("|"),e.tokens.push({type:"tr_open",level:e.level++}),c=0;c<l.length;c++)e.tokens.push({type:"td_open",align:h[c],level:e.level++}),e.tokens.push({type:"inline",content:l[c].replace(/^\|? *| *\|?$/g,""),level:e.level,children:[]}),e.tokens.push({type:"td_close",level:--e.level})
e.tokens.push({type:"tr_close",level:--e.level})}return e.tokens.push({type:"tbody_close",level:--e.level}),e.tokens.push({type:"table_close",level:--e.level}),p[1]=d[1]=u,e.line=u,!0}},{}],160:[function(e,t,r){"use strict"
function n(e,t,r,n){var s,a,c,u,l,h
if(42!==e.charCodeAt(0))return-1
if(91!==e.charCodeAt(1))return-1
if(-1===e.indexOf("]:"))return-1
if(s=new i(e,t,r,n,[]),a=o(s,1),0>a||58!==e.charCodeAt(a+1))return-1
for(u=s.posMax,c=a+2;u>c&&10!==s.src.charCodeAt(c);c++);return l=e.slice(2,a),h=e.slice(a+2,c).trim(),0===h.length?-1:(n.abbreviations||(n.abbreviations={}),"undefined"==typeof n.abbreviations[":"+l]&&(n.abbreviations[":"+l]=h),c)}var i=e("../rules_inline/state_inline"),o=e("../helpers/parse_link_label")
t.exports=function(e){var t,r,i,o,s=e.tokens
if(!e.inlineMode)for(t=1,r=s.length-1;r>t;t++)if("paragraph_open"===s[t-1].type&&"inline"===s[t].type&&"paragraph_close"===s[t+1].type){for(i=s[t].content;i.length&&(o=n(i,e.inline,e.options,e.env),!(0>o));)i=i.slice(o).trim()
s[t].content=i,i.length||(s[t-1].tight=!0,s[t+1].tight=!0)}}},{"../helpers/parse_link_label":138,"../rules_inline/state_inline":182}],161:[function(e,t,r){"use strict"
function n(e){return e.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1")}var i=" \n()[]'\".,!?-"
t.exports=function(e){var t,r,o,s,a,c,u,l,h,f,p,d,g=e.tokens
if(e.env.abbreviations)for(e.env.abbrRegExp||(d="(^|["+i.split("").map(n).join("")+"])("+Object.keys(e.env.abbreviations).map(function(e){return e.substr(1)}).sort(function(e,t){return t.length-e.length}).map(n).join("|")+")($|["+i.split("").map(n).join("")+"])",e.env.abbrRegExp=new RegExp(d,"g")),f=e.env.abbrRegExp,r=0,o=g.length;o>r;r++)if("inline"===g[r].type)for(s=g[r].children,t=s.length-1;t>=0;t--)if(a=s[t],"text"===a.type){for(l=0,c=a.content,f.lastIndex=0,h=a.level,u=[];p=f.exec(c);)f.lastIndex>l&&u.push({type:"text",content:c.slice(l,p.index+p[1].length),level:h}),u.push({type:"abbr_open",title:e.env.abbreviations[":"+p[2]],level:h++}),u.push({type:"text",content:p[2],level:h}),u.push({type:"abbr_close",level:--h}),l=f.lastIndex-p[3].length
u.length&&(l<c.length&&u.push({type:"text",content:c.slice(l),level:h}),g[r].children=s=[].concat(s.slice(0,t),u,s.slice(t+1)))}}},{}],162:[function(e,t,r){"use strict"
t.exports=function(e){e.inlineMode?e.tokens.push({type:"inline",content:e.src.replace(/\n/g," ").trim(),level:0,lines:[0,1],children:[]}):e.block.parse(e.src,e.options,e.env,e.tokens)}},{}],163:[function(e,t,r){"use strict"
t.exports=function(e){var t,r,n,i,o,s,a,c,u,l=0,h=!1,f={}
if(e.env.footnotes&&(e.tokens=e.tokens.filter(function(e){return"footnote_reference_open"===e.type?(h=!0,c=[],u=e.label,!1):"footnote_reference_close"===e.type?(h=!1,f[":"+u]=c,!1):(h&&c.push(e),!h)}),e.env.footnotes.list)){for(s=e.env.footnotes.list,e.tokens.push({type:"footnote_block_open",level:l++}),t=0,r=s.length;r>t;t++){for(e.tokens.push({type:"footnote_open",id:t,level:l++}),s[t].tokens?(a=[],a.push({type:"paragraph_open",tight:!1,level:l++}),a.push({type:"inline",content:"",level:l,children:s[t].tokens}),a.push({type:"paragraph_close",tight:!1,level:--l})):s[t].label&&(a=f[":"+s[t].label]),e.tokens=e.tokens.concat(a),o="paragraph_close"===e.tokens[e.tokens.length-1].type?e.tokens.pop():null,i=s[t].count>0?s[t].count:1,n=0;i>n;n++)e.tokens.push({type:"footnote_anchor",id:t,subId:n,level:l})
o&&e.tokens.push(o),e.tokens.push({type:"footnote_close",level:--l})}e.tokens.push({type:"footnote_block_close",level:--l})}}},{}],164:[function(e,t,r){"use strict"
t.exports=function(e){var t,r,n,i=e.tokens
for(r=0,n=i.length;n>r;r++)t=i[r],"inline"===t.type&&e.inline.parse(t.content,e.options,e.env,t.children)}},{}],165:[function(e,t,r){"use strict"
function n(e){return/^<a[>\s]/i.test(e)}function i(e){return/^<\/a\s*>/i.test(e)}function o(){var e=[],t=new s({stripPrefix:!1,url:!0,email:!0,twitter:!1,replaceFn:function(t,r){switch(r.getType()){case"url":e.push({text:r.matchedText,url:r.getUrl()})
break
case"email":e.push({text:r.matchedText,url:"mailto:"+r.getEmail().replace(/^mailto:/i,"")})}return!1}})
return{links:e,autolinker:t}}var s=e("autolinker"),a=/www|@|\:\/\//
t.exports=function(e){var t,r,s,c,u,l,h,f,p,d,g,m,v,b=e.tokens,y=null
if(e.options.linkify)for(r=0,s=b.length;s>r;r++)if("inline"===b[r].type)for(c=b[r].children,g=0,t=c.length-1;t>=0;t--)if(u=c[t],"link_close"!==u.type){if("htmltag"===u.type&&(n(u.content)&&g>0&&g--,i(u.content)&&g++),!(g>0)&&"text"===u.type&&a.test(u.content)){if(y||(y=o(),m=y.links,v=y.autolinker),l=u.content,m.length=0,v.link(l),!m.length)continue
for(h=[],d=u.level,f=0;f<m.length;f++)e.inline.validateLink(m[f].url)&&(p=l.indexOf(m[f].text),p&&(d=d,h.push({type:"text",content:l.slice(0,p),level:d})),h.push({type:"link_open",href:m[f].url,title:"",level:d++}),h.push({type:"text",content:m[f].text,level:d}),h.push({type:"link_close",level:--d}),l=l.slice(p+m[f].text.length))
l.length&&h.push({type:"text",content:l,level:d}),b[r].children=c=[].concat(c.slice(0,t),h,c.slice(t+1))}}else for(t--;c[t].level!==u.level&&"link_open"!==c[t].type;)t--}},{autolinker:186}],166:[function(e,t,r){"use strict"
function n(e,t,r,n){var u,l,h,f,p,d,g,m,v
if(91!==e.charCodeAt(0))return-1
if(-1===e.indexOf("]:"))return-1
if(u=new i(e,t,r,n,[]),l=o(u,0),0>l||58!==e.charCodeAt(l+1))return-1
for(f=u.posMax,h=l+2;f>h&&(p=u.src.charCodeAt(h),32===p||10===p);h++);if(!s(u,h))return-1
for(g=u.linkContent,h=u.pos,d=h,h+=1;f>h&&(p=u.src.charCodeAt(h),32===p||10===p);h++);for(f>h&&d!==h&&a(u,h)?(m=u.linkContent,h=u.pos):(m="",h=d);f>h&&32===u.src.charCodeAt(h);)h++
return f>h&&10!==u.src.charCodeAt(h)?-1:(v=c(e.slice(1,l)),"undefined"==typeof n.references[v]&&(n.references[v]={title:m,href:g}),h)}var i=e("../rules_inline/state_inline"),o=e("../helpers/parse_link_label"),s=e("../helpers/parse_link_destination"),a=e("../helpers/parse_link_title"),c=e("../helpers/normalize_reference")
t.exports=function(e){var t,r,i,o,s=e.tokens
if(e.env.references=e.env.references||{},!e.inlineMode)for(t=1,r=s.length-1;r>t;t++)if("inline"===s[t].type&&"paragraph_open"===s[t-1].type&&"paragraph_close"===s[t+1].type){for(i=s[t].content;i.length&&(o=n(i,e.inline,e.options,e.env),!(0>o));)i=i.slice(o).trim()
s[t].content=i,i.length||(s[t-1].tight=!0,s[t+1].tight=!0)}}},{"../helpers/normalize_reference":136,"../helpers/parse_link_destination":137,"../helpers/parse_link_label":138,"../helpers/parse_link_title":139,"../rules_inline/state_inline":182}],167:[function(e,t,r){"use strict"
function n(e){return e.indexOf("(")<0?e:e.replace(o,function(e,t){return s[t.toLowerCase()]})}var i=/\+-|\.\.|\?\?\?\?|!!!!|,,|--/,o=/\((c|tm|r|p)\)/gi,s={c:"©",r:"®",p:"§",tm:"™"}
t.exports=function(e){var t,r,o,s,a
if(e.options.typographer)for(a=e.tokens.length-1;a>=0;a--)if("inline"===e.tokens[a].type)for(s=e.tokens[a].children,t=s.length-1;t>=0;t--)r=s[t],"text"===r.type&&(o=r.content,o=n(o),i.test(o)&&(o=o.replace(/\+-/g,"±").replace(/\.{2,}/g,"…").replace(/([?!])…/g,"$1..").replace(/([?!]){4,}/g,"$1$1$1").replace(/,{2,}/g,",").replace(/(^|[^-])---([^-]|$)/gm,"$1—$2").replace(/(^|\s)--(\s|$)/gm,"$1–$2").replace(/(^|[^-\s])--([^-\s]|$)/gm,"$1–$2")),r.content=o)}},{}],168:[function(e,t,r){"use strict"
function n(e,t){return 0>t||t>=e.length?!1:!a.test(e[t])}function i(e,t,r){return e.substr(0,t)+r+e.substr(t+1)}var o=/['"]/,s=/['"]/g,a=/[-\s()\[\]]/,c="’"
t.exports=function(e){var t,r,a,u,l,h,f,p,d,g,m,v,b,y,w,_,k
if(e.options.typographer)for(k=[],w=e.tokens.length-1;w>=0;w--)if("inline"===e.tokens[w].type)for(_=e.tokens[w].children,k.length=0,t=0;t<_.length;t++)if(r=_[t],"text"===r.type&&!o.test(r.text)){for(f=_[t].level,b=k.length-1;b>=0&&!(k[b].level<=f);b--);k.length=b+1,a=r.content,l=0,h=a.length
e:for(;h>l&&(s.lastIndex=l,u=s.exec(a));)if(p=!n(a,u.index-1),l=u.index+1,y="'"===u[0],d=!n(a,l),d||p){if(m=!d,v=!p)for(b=k.length-1;b>=0&&(g=k[b],!(k[b].level<f));b--)if(g.single===y&&k[b].level===f){g=k[b],y?(_[g.token].content=i(_[g.token].content,g.pos,e.options.quotes[2]),r.content=i(r.content,u.index,e.options.quotes[3])):(_[g.token].content=i(_[g.token].content,g.pos,e.options.quotes[0]),r.content=i(r.content,u.index,e.options.quotes[1])),k.length=b
continue e}m?k.push({token:t,pos:u.index,single:y,level:f}):v&&y&&(r.content=i(r.content,u.index,c))}else y&&(r.content=i(r.content,u.index,c))}}},{}],169:[function(e,t,r){"use strict"
var n=e("../common/url_schemas"),i=e("../helpers/normalize_link"),o=/^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/,s=/^<([a-zA-Z.\-]{1,25}):([^<>\x00-\x20]*)>/
t.exports=function(e,t){var r,a,c,u,l,h=e.pos
return 60!==e.src.charCodeAt(h)?!1:(r=e.src.slice(h),r.indexOf(">")<0?!1:(a=r.match(s))?n.indexOf(a[1].toLowerCase())<0?!1:(u=a[0].slice(1,-1),l=i(u),e.parser.validateLink(u)?(t||(e.push({type:"link_open",href:l,level:e.level}),e.push({type:"text",content:u,level:e.level+1}),e.push({type:"link_close",level:e.level})),e.pos+=a[0].length,!0):!1):(c=r.match(o),c?(u=c[0].slice(1,-1),l=i("mailto:"+u),e.parser.validateLink(l)?(t||(e.push({type:"link_open",href:l,level:e.level}),e.push({type:"text",content:u,level:e.level+1}),e.push({type:"link_close",level:e.level})),e.pos+=c[0].length,!0):!1):!1))}},{"../common/url_schemas":130,"../helpers/normalize_link":135}],170:[function(e,t,r){"use strict"
t.exports=function(e,t){var r,n,i,o,s,a=e.pos,c=e.src.charCodeAt(a)
if(96!==c)return!1
for(r=a,a++,n=e.posMax;n>a&&96===e.src.charCodeAt(a);)a++
for(i=e.src.slice(r,a),o=s=a;-1!==(o=e.src.indexOf("`",s));){for(s=o+1;n>s&&96===e.src.charCodeAt(s);)s++
if(s-o===i.length)return t||e.push({type:"code",content:e.src.slice(a,o).replace(/[ \n]+/g," ").trim(),block:!1,level:e.level}),e.pos=s,!0}return t||(e.pending+=i),e.pos+=i.length,!0}},{}],171:[function(e,t,r){"use strict"
t.exports=function(e,t){var r,n,i,o,s,a=e.posMax,c=e.pos
if(126!==e.src.charCodeAt(c))return!1
if(t)return!1
if(c+4>=a)return!1
if(126!==e.src.charCodeAt(c+1))return!1
if(e.level>=e.options.maxNesting)return!1
if(o=c>0?e.src.charCodeAt(c-1):-1,s=e.src.charCodeAt(c+2),126===o)return!1
if(126===s)return!1
if(32===s||10===s)return!1
for(n=c+2;a>n&&126===e.src.charCodeAt(n);)n++
if(n>c+3)return e.pos+=n-c,t||(e.pending+=e.src.slice(c,n)),!0
for(e.pos=c+2,i=1;e.pos+1<a;){if(126===e.src.charCodeAt(e.pos)&&126===e.src.charCodeAt(e.pos+1)&&(o=e.src.charCodeAt(e.pos-1),s=e.pos+2<a?e.src.charCodeAt(e.pos+2):-1,126!==s&&126!==o&&(32!==o&&10!==o?i--:32!==s&&10!==s&&i++,0>=i))){r=!0
break}e.parser.skipToken(e)}return r?(e.posMax=e.pos,e.pos=c+2,t||(e.push({type:"del_open",level:e.level++}),e.parser.tokenize(e),e.push({type:"del_close",level:--e.level})),e.pos=e.posMax+2,e.posMax=a,!0):(e.pos=c,!1)}},{}],172:[function(e,t,r){"use strict"
function n(e){return e>=48&&57>=e||e>=65&&90>=e||e>=97&&122>=e}function i(e,t){var r,i,o,s=t,a=!0,c=!0,u=e.posMax,l=e.src.charCodeAt(t)
for(r=t>0?e.src.charCodeAt(t-1):-1;u>s&&e.src.charCodeAt(s)===l;)s++
return s>=u&&(a=!1),o=s-t,o>=4?a=c=!1:(i=u>s?e.src.charCodeAt(s):-1,(32===i||10===i)&&(a=!1),(32===r||10===r)&&(c=!1),95===l&&(n(r)&&(a=!1),n(i)&&(c=!1))),{can_open:a,can_close:c,delims:o}}t.exports=function(e,t){var r,n,o,s,a,c,u,l=e.posMax,h=e.pos,f=e.src.charCodeAt(h)
if(95!==f&&42!==f)return!1
if(t)return!1
if(u=i(e,h),r=u.delims,!u.can_open)return e.pos+=r,t||(e.pending+=e.src.slice(h,e.pos)),!0
if(e.level>=e.options.maxNesting)return!1
for(e.pos=h+r,c=[r];e.pos<l;)if(e.src.charCodeAt(e.pos)!==f)e.parser.skipToken(e)
else{if(u=i(e,e.pos),n=u.delims,u.can_close){for(s=c.pop(),a=n;s!==a;){if(s>a){c.push(s-a)
break}if(a-=s,0===c.length)break
e.pos+=s,s=c.pop()}if(0===c.length){r=s,o=!0
break}e.pos+=n
continue}u.can_open&&c.push(n),e.pos+=n}return o?(e.posMax=e.pos,e.pos=h+r,t||((2===r||3===r)&&e.push({type:"strong_open",level:e.level++}),(1===r||3===r)&&e.push({type:"em_open",level:e.level++}),e.parser.tokenize(e),(1===r||3===r)&&e.push({type:"em_close",level:--e.level}),(2===r||3===r)&&e.push({type:"strong_close",level:--e.level})),e.pos=e.posMax+r,e.posMax=l,!0):(e.pos=h,!1)}},{}],173:[function(e,t,r){"use strict"
var n=e("../common/entities"),i=e("../common/utils").has,o=e("../common/utils").isValidEntityCode,s=e("../common/utils").fromCodePoint,a=/^&#((?:x[a-f0-9]{1,8}|[0-9]{1,8}));/i,c=/^&([a-z][a-z0-9]{1,31});/i
t.exports=function(e,t){var r,u,l,h=e.pos,f=e.posMax
if(38!==e.src.charCodeAt(h))return!1
if(f>h+1)if(r=e.src.charCodeAt(h+1),35===r){if(l=e.src.slice(h).match(a))return t||(u="x"===l[1][0].toLowerCase()?parseInt(l[1].slice(1),16):parseInt(l[1],10),e.pending+=s(o(u)?u:65533)),e.pos+=l[0].length,!0}else if(l=e.src.slice(h).match(c),l&&i(n,l[1]))return t||(e.pending+=n[l[1]]),e.pos+=l[0].length,!0
return t||(e.pending+="&"),e.pos++,!0}},{"../common/entities":127,"../common/utils":131}],174:[function(e,t,r){"use strict"
for(var n=[],i=0;256>i;i++)n.push(0)
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(e){n[e.charCodeAt(0)]=1}),t.exports=function(e,t){var r,i=e.pos,o=e.posMax
if(92!==e.src.charCodeAt(i))return!1
if(i++,o>i){if(r=e.src.charCodeAt(i),256>r&&0!==n[r])return t||(e.pending+=e.src[i]),e.pos+=2,!0
if(10===r){for(t||e.push({type:"hardbreak",level:e.level}),i++;o>i&&32===e.src.charCodeAt(i);)i++
return e.pos=i,!0}}return t||(e.pending+="\\"),e.pos++,!0}},{}],175:[function(e,t,r){"use strict"
var n=e("../helpers/parse_link_label")
t.exports=function(e,t){var r,i,o,s,a=e.posMax,c=e.pos
return c+2>=a?!1:94!==e.src.charCodeAt(c)?!1:91!==e.src.charCodeAt(c+1)?!1:e.level>=e.options.maxNesting?!1:(r=c+2,i=n(e,c+1),0>i?!1:(t||(e.env.footnotes||(e.env.footnotes={}),e.env.footnotes.list||(e.env.footnotes.list=[]),o=e.env.footnotes.list.length,e.pos=r,e.posMax=i,e.push({type:"footnote_ref",id:o,level:e.level}),e.linkLevel++,s=e.tokens.length,e.parser.tokenize(e),e.env.footnotes.list[o]={tokens:e.tokens.splice(s)},e.linkLevel--),e.pos=i+1,e.posMax=a,!0))}},{"../helpers/parse_link_label":138}],176:[function(e,t,r){"use strict"
t.exports=function(e,t){var r,n,i,o,s=e.posMax,a=e.pos
if(a+3>s)return!1
if(!e.env.footnotes||!e.env.footnotes.refs)return!1
if(91!==e.src.charCodeAt(a))return!1
if(94!==e.src.charCodeAt(a+1))return!1
if(e.level>=e.options.maxNesting)return!1
for(n=a+2;s>n;n++){if(32===e.src.charCodeAt(n))return!1
if(10===e.src.charCodeAt(n))return!1
if(93===e.src.charCodeAt(n))break}return n===a+2?!1:n>=s?!1:(n++,r=e.src.slice(a+2,n-1),"undefined"==typeof e.env.footnotes.refs[":"+r]?!1:(t||(e.env.footnotes.list||(e.env.footnotes.list=[]),e.env.footnotes.refs[":"+r]<0?(i=e.env.footnotes.list.length,e.env.footnotes.list[i]={label:r,count:0},e.env.footnotes.refs[":"+r]=i):i=e.env.footnotes.refs[":"+r],o=e.env.footnotes.list[i].count,e.env.footnotes.list[i].count++,e.push({type:"footnote_ref",id:i,subId:o,level:e.level})),e.pos=n,e.posMax=s,!0))}},{}],177:[function(e,t,r){"use strict"
function n(e){var t=32|e
return t>=97&&122>=t}var i=e("../common/html_re").HTML_TAG_RE
t.exports=function(e,t){var r,o,s,a=e.pos
return e.options.html?(s=e.posMax,60!==e.src.charCodeAt(a)||a+2>=s?!1:(r=e.src.charCodeAt(a+1),(33===r||63===r||47===r||n(r))&&(o=e.src.slice(a).match(i))?(t||e.push({type:"htmltag",content:e.src.slice(a,a+o[0].length),level:e.level}),e.pos+=o[0].length,!0):!1)):!1}},{"../common/html_re":129}],178:[function(e,t,r){"use strict"
t.exports=function(e,t){var r,n,i,o,s,a=e.posMax,c=e.pos
if(43!==e.src.charCodeAt(c))return!1
if(t)return!1
if(c+4>=a)return!1
if(43!==e.src.charCodeAt(c+1))return!1
if(e.level>=e.options.maxNesting)return!1
if(o=c>0?e.src.charCodeAt(c-1):-1,s=e.src.charCodeAt(c+2),43===o)return!1
if(43===s)return!1
if(32===s||10===s)return!1
for(n=c+2;a>n&&43===e.src.charCodeAt(n);)n++
if(n!==c+2)return e.pos+=n-c,t||(e.pending+=e.src.slice(c,n)),!0
for(e.pos=c+2,i=1;e.pos+1<a;){if(43===e.src.charCodeAt(e.pos)&&43===e.src.charCodeAt(e.pos+1)&&(o=e.src.charCodeAt(e.pos-1),s=e.pos+2<a?e.src.charCodeAt(e.pos+2):-1,43!==s&&43!==o&&(32!==o&&10!==o?i--:32!==s&&10!==s&&i++,0>=i))){r=!0
break}e.parser.skipToken(e)}return r?(e.posMax=e.pos,e.pos=c+2,t||(e.push({type:"ins_open",level:e.level++}),e.parser.tokenize(e),e.push({type:"ins_close",level:--e.level})),e.pos=e.posMax+2,e.posMax=a,!0):(e.pos=c,!1)}},{}],179:[function(e,t,r){"use strict"
var n=e("../helpers/parse_link_label"),i=e("../helpers/parse_link_destination"),o=e("../helpers/parse_link_title"),s=e("../helpers/normalize_reference")
t.exports=function(e,t){var r,a,c,u,l,h,f,p,d=!1,g=e.pos,m=e.posMax,v=e.pos,b=e.src.charCodeAt(v)
if(33===b&&(d=!0,b=e.src.charCodeAt(++v)),91!==b)return!1
if(e.level>=e.options.maxNesting)return!1
if(r=v+1,a=n(e,v),0>a)return!1
if(h=a+1,m>h&&40===e.src.charCodeAt(h)){for(h++;m>h&&(p=e.src.charCodeAt(h),32===p||10===p);h++);if(h>=m)return!1
for(v=h,i(e,h)?(u=e.linkContent,h=e.pos):u="",v=h;m>h&&(p=e.src.charCodeAt(h),32===p||10===p);h++);if(m>h&&v!==h&&o(e,h))for(l=e.linkContent,h=e.pos;m>h&&(p=e.src.charCodeAt(h),32===p||10===p);h++);else l=""
if(h>=m||41!==e.src.charCodeAt(h))return e.pos=g,!1
h++}else{if(e.linkLevel>0)return!1
for(;m>h&&(p=e.src.charCodeAt(h),32===p||10===p);h++);if(m>h&&91===e.src.charCodeAt(h)&&(v=h+1,h=n(e,h),h>=0?c=e.src.slice(v,h++):h=v-1),c||("undefined"==typeof c&&(h=a+1),c=e.src.slice(r,a)),f=e.env.references[s(c)],!f)return e.pos=g,!1
u=f.href,l=f.title}return t||(e.pos=r,e.posMax=a,d?e.push({type:"image",src:u,title:l,alt:e.src.substr(r,a-r),level:e.level}):(e.push({type:"link_open",href:u,title:l,level:e.level++}),e.linkLevel++,e.parser.tokenize(e),e.linkLevel--,e.push({type:"link_close",level:--e.level}))),e.pos=h,e.posMax=m,!0}},{"../helpers/normalize_reference":136,"../helpers/parse_link_destination":137,"../helpers/parse_link_label":138,"../helpers/parse_link_title":139}],180:[function(e,t,r){"use strict"
t.exports=function(e,t){var r,n,i,o,s,a=e.posMax,c=e.pos
if(61!==e.src.charCodeAt(c))return!1
if(t)return!1
if(c+4>=a)return!1
if(61!==e.src.charCodeAt(c+1))return!1
if(e.level>=e.options.maxNesting)return!1
if(o=c>0?e.src.charCodeAt(c-1):-1,s=e.src.charCodeAt(c+2),61===o)return!1
if(61===s)return!1
if(32===s||10===s)return!1
for(n=c+2;a>n&&61===e.src.charCodeAt(n);)n++
if(n!==c+2)return e.pos+=n-c,t||(e.pending+=e.src.slice(c,n)),!0
for(e.pos=c+2,i=1;e.pos+1<a;){if(61===e.src.charCodeAt(e.pos)&&61===e.src.charCodeAt(e.pos+1)&&(o=e.src.charCodeAt(e.pos-1),s=e.pos+2<a?e.src.charCodeAt(e.pos+2):-1,61!==s&&61!==o&&(32!==o&&10!==o?i--:32!==s&&10!==s&&i++,0>=i))){r=!0
break}e.parser.skipToken(e)}return r?(e.posMax=e.pos,e.pos=c+2,t||(e.push({type:"mark_open",level:e.level++}),e.parser.tokenize(e),e.push({type:"mark_close",level:--e.level})),e.pos=e.posMax+2,e.posMax=a,!0):(e.pos=c,!1)}},{}],181:[function(e,t,r){"use strict"
t.exports=function(e,t){var r,n,i=e.pos
if(10!==e.src.charCodeAt(i))return!1
for(r=e.pending.length-1,n=e.posMax,t||(r>=0&&32===e.pending.charCodeAt(r)?r>=1&&32===e.pending.charCodeAt(r-1)?(e.pending=e.pending.replace(/ +$/,""),e.push({type:"hardbreak",level:e.level})):(e.pending=e.pending.slice(0,-1),e.push({type:"softbreak",level:e.level})):e.push({type:"softbreak",level:e.level})),i++;n>i&&32===e.src.charCodeAt(i);)i++
return e.pos=i,!0}},{}],182:[function(e,t,r){"use strict"
function n(e,t,r,n,i){this.src=e,this.env=n,this.options=r,this.parser=t,this.tokens=i,this.pos=0,this.posMax=this.src.length,this.level=0,this.pending="",this.pendingLevel=0,this.cache=[],this.isInLabel=!1,this.linkLevel=0,this.linkContent="",this.labelUnmatchedScopes=0}n.prototype.pushPending=function(){this.tokens.push({type:"text",content:this.pending,level:this.pendingLevel}),this.pending=""},n.prototype.push=function(e){this.pending&&this.pushPending(),this.tokens.push(e),this.pendingLevel=this.level},n.prototype.cacheSet=function(e,t){for(var r=this.cache.length;e>=r;r++)this.cache.push(0)
this.cache[e]=t},n.prototype.cacheGet=function(e){return e<this.cache.length?this.cache[e]:0},t.exports=n},{}],183:[function(e,t,r){"use strict"
var n=/\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g
t.exports=function(e,t){var r,i,o=e.posMax,s=e.pos
if(126!==e.src.charCodeAt(s))return!1
if(t)return!1
if(s+2>=o)return!1
if(e.level>=e.options.maxNesting)return!1
for(e.pos=s+1;e.pos<o;){if(126===e.src.charCodeAt(e.pos)){r=!0
break}e.parser.skipToken(e)}return r&&s+1!==e.pos?(i=e.src.slice(s+1,e.pos),i.match(/(^|[^\\])(\\\\)*\s/)?(e.pos=s,!1):(e.posMax=e.pos,e.pos=s+1,t||e.push({type:"sub",level:e.level,content:i.replace(n,"$1")}),e.pos=e.posMax+1,e.posMax=o,!0)):(e.pos=s,!1)}},{}],184:[function(e,t,r){"use strict"
var n=/\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g
t.exports=function(e,t){var r,i,o=e.posMax,s=e.pos
if(94!==e.src.charCodeAt(s))return!1
if(t)return!1
if(s+2>=o)return!1
if(e.level>=e.options.maxNesting)return!1
for(e.pos=s+1;e.pos<o;){if(94===e.src.charCodeAt(e.pos)){r=!0
break}e.parser.skipToken(e)}return r&&s+1!==e.pos?(i=e.src.slice(s+1,e.pos),i.match(/(^|[^\\])(\\\\)*\s/)?(e.pos=s,!1):(e.posMax=e.pos,e.pos=s+1,t||e.push({type:"sup",level:e.level,content:i.replace(n,"$1")}),e.pos=e.posMax+1,e.posMax=o,!0)):(e.pos=s,!1)}},{}],185:[function(e,t,r){"use strict"
function n(e){switch(e){case 10:case 92:case 96:case 42:case 95:case 94:case 91:case 93:case 33:case 38:case 60:case 62:case 123:case 125:case 36:case 37:case 64:case 126:case 43:case 61:case 58:return!0
default:return!1}}t.exports=function(e,t){for(var r=e.pos;r<e.posMax&&!n(e.src.charCodeAt(r));)r++
return r===e.pos?!1:(t||(e.pending+=e.src.slice(e.pos,r)),e.pos=r,!0)}},{}],186:[function(e,t,r){!function(e,n){"function"==typeof define&&define.amd?define([],function(){return e.Autolinker=n()}):"object"==typeof r?t.exports=n():e.Autolinker=n()}(this,function(){var e=function(t){e.Util.assign(this,t)}
return e.prototype={constructor:e,urls:!0,email:!0,twitter:!0,newWindow:!0,stripPrefix:!0,truncate:void 0,className:"",htmlParser:void 0,matchParser:void 0,tagBuilder:void 0,link:function(e){for(var t=this.getHtmlParser(),r=t.parse(e),n=0,i=[],o=0,s=r.length;s>o;o++){var a=r[o],c=a.getType(),u=a.getText()
if("element"===c)"a"===a.getTagName()&&(a.isClosing()?n=Math.max(n-1,0):n++),i.push(u)
else if("entity"===c)i.push(u)
else if(0===n){var l=this.linkifyStr(u)
i.push(l)}else i.push(u)}return i.join("")},linkifyStr:function(e){return this.getMatchParser().replace(e,this.createMatchReturnVal,this)},createMatchReturnVal:function(t){var r
if(this.replaceFn&&(r=this.replaceFn.call(this,this,t)),"string"==typeof r)return r
if(r===!1)return t.getMatchedText()
if(r instanceof e.HtmlTag)return r.toString()
var n=this.getTagBuilder(),i=n.build(t)
return i.toString()},getHtmlParser:function(){var t=this.htmlParser
return t||(t=this.htmlParser=new e.htmlParser.HtmlParser),t},getMatchParser:function(){var t=this.matchParser
return t||(t=this.matchParser=new e.matchParser.MatchParser({urls:this.urls,email:this.email,twitter:this.twitter,stripPrefix:this.stripPrefix})),t},getTagBuilder:function(){var t=this.tagBuilder
return t||(t=this.tagBuilder=new e.AnchorTagBuilder({newWindow:this.newWindow,truncate:this.truncate,className:this.className})),t}},e.link=function(t,r){var n=new e(r)
return n.link(t)},e.match={},e.htmlParser={},e.matchParser={},e.Util={abstractMethod:function(){throw"abstract"},assign:function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])
return e},extend:function(t,r){var n=t.prototype,i=function(){}
i.prototype=n
var o
o=r.hasOwnProperty("constructor")?r.constructor:function(){n.constructor.apply(this,arguments)}
var s=o.prototype=new i
return s.constructor=o,s.superclass=n,delete r.constructor,e.Util.assign(s,r),o},ellipsis:function(e,t,r){return e.length>t&&(r=null==r?"..":r,e=e.substring(0,t-r.length)+r),e},indexOf:function(e,t){if(Array.prototype.indexOf)return e.indexOf(t)
for(var r=0,n=e.length;n>r;r++)if(e[r]===t)return r
return-1},splitAndCapture:function(e,t){if(!t.global)throw new Error("`splitRegex` must have the 'g' flag set")
for(var r,n=[],i=0;r=t.exec(e);)n.push(e.substring(i,r.index)),n.push(r[0]),i=r.index+r[0].length
return n.push(e.substring(i)),n}},e.HtmlTag=e.Util.extend(Object,{whitespaceRegex:/\s+/,constructor:function(t){e.Util.assign(this,t),this.innerHtml=this.innerHtml||this.innerHTML},setTagName:function(e){return this.tagName=e,this},getTagName:function(){return this.tagName||""},setAttr:function(e,t){var r=this.getAttrs()
return r[e]=t,this},getAttr:function(e){return this.getAttrs()[e]},setAttrs:function(t){var r=this.getAttrs()
return e.Util.assign(r,t),this},getAttrs:function(){return this.attrs||(this.attrs={})},setClass:function(e){return this.setAttr("class",e)},addClass:function(t){for(var r,n=this.getClass(),i=this.whitespaceRegex,o=e.Util.indexOf,s=n?n.split(i):[],a=t.split(i);r=a.shift();)-1===o(s,r)&&s.push(r)
return this.getAttrs()["class"]=s.join(" "),this},removeClass:function(t){for(var r,n=this.getClass(),i=this.whitespaceRegex,o=e.Util.indexOf,s=n?n.split(i):[],a=t.split(i);s.length&&(r=a.shift());){var c=o(s,r);-1!==c&&s.splice(c,1)}return this.getAttrs()["class"]=s.join(" "),this},getClass:function(){return this.getAttrs()["class"]||""},hasClass:function(e){return-1!==(" "+this.getClass()+" ").indexOf(" "+e+" ")},setInnerHtml:function(e){return this.innerHtml=e,this},getInnerHtml:function(){return this.innerHtml||""},toString:function(){var e=this.getTagName(),t=this.buildAttrsStr()
return t=t?" "+t:"",["<",e,t,">",this.getInnerHtml(),"</",e,">"].join("")},buildAttrsStr:function(){if(!this.attrs)return""
var e=this.getAttrs(),t=[]
for(var r in e)e.hasOwnProperty(r)&&t.push(r+'="'+e[r]+'"')
return t.join(" ")}}),e.AnchorTagBuilder=e.Util.extend(Object,{constructor:function(t){e.Util.assign(this,t)},build:function(t){var r=new e.HtmlTag({tagName:"a",attrs:this.createAttrs(t.getType(),t.getAnchorHref()),innerHtml:this.processAnchorText(t.getAnchorText())})
return r},createAttrs:function(e,t){var r={href:t},n=this.createCssClass(e)
return n&&(r["class"]=n),this.newWindow&&(r.target="_blank"),r},createCssClass:function(e){var t=this.className
return t?t+" "+t+"-"+e:""},processAnchorText:function(e){return e=this.doTruncate(e)},doTruncate:function(t){return e.Util.ellipsis(t,this.truncate||Number.POSITIVE_INFINITY)}}),e.htmlParser.HtmlParser=e.Util.extend(Object,{htmlRegex:function(){var e=/[0-9a-zA-Z][0-9a-zA-Z:]*/,t=/[^\s\0"'>\/=\x01-\x1F\x7F]+/,r=/(?:"[^"]*?"|'[^']*?'|[^'"=<>`\s]+)/,n=t.source+"(?:\\s*=\\s*"+r.source+")?"
return new RegExp(["(?:","<(!DOCTYPE)","(?:","\\s+","(?:",n,"|",r.source+")",")*",">",")","|","(?:","<(/)?","("+e.source+")","(?:","\\s+",n,")*","\\s*/?",">",")"].join(""),"gi")}(),htmlCharacterEntitiesRegex:/(&nbsp;|&#160;|&lt;|&#60;|&gt;|&#62;|&quot;|&#34;|&#39;)/gi,parse:function(e){for(var t,r,n=this.htmlRegex,i=0,o=[];null!==(t=n.exec(e));){var s=t[0],a=t[1]||t[3],c=!!t[2],u=e.substring(i,t.index)
u&&(r=this.parseTextAndEntityNodes(u),o.push.apply(o,r)),o.push(this.createElementNode(s,a,c)),i=t.index+s.length}if(i<e.length){var l=e.substring(i)
l&&(r=this.parseTextAndEntityNodes(l),o.push.apply(o,r))}return o},parseTextAndEntityNodes:function(t){for(var r=[],n=e.Util.splitAndCapture(t,this.htmlCharacterEntitiesRegex),i=0,o=n.length;o>i;i+=2){var s=n[i],a=n[i+1]
s&&r.push(this.createTextNode(s)),a&&r.push(this.createEntityNode(a))}return r},createElementNode:function(t,r,n){return new e.htmlParser.ElementNode({text:t,tagName:r.toLowerCase(),closing:n})},createEntityNode:function(t){return new e.htmlParser.EntityNode({text:t})},createTextNode:function(t){return new e.htmlParser.TextNode({text:t})}}),e.htmlParser.HtmlNode=e.Util.extend(Object,{text:"",constructor:function(t){e.Util.assign(this,t)},getType:e.Util.abstractMethod,getText:function(){return this.text}}),e.htmlParser.ElementNode=e.Util.extend(e.htmlParser.HtmlNode,{tagName:"",closing:!1,getType:function(){return"element"},getTagName:function(){return this.tagName},isClosing:function(){return this.closing}}),e.htmlParser.EntityNode=e.Util.extend(e.htmlParser.HtmlNode,{getType:function(){return"entity"}}),e.htmlParser.TextNode=e.Util.extend(e.htmlParser.HtmlNode,{getType:function(){return"text"}}),e.matchParser.MatchParser=e.Util.extend(Object,{urls:!0,email:!0,twitter:!0,stripPrefix:!0,matcherRegex:function(){var e=/(^|[^\w])@(\w{1,15})/,t=/(?:[\-;:&=\+\$,\w\.]+@)/,r=/(?:[A-Za-z][-.+A-Za-z0-9]+:(?![A-Za-z][-.+A-Za-z0-9]+:\/\/)(?!\d+\/?)(?:\/\/)?)/,n=/(?:www\.)/,i=/[A-Za-z0-9\.\-]*[A-Za-z0-9\-]/,o=/\.(?:international|construction|contractors|enterprises|photography|productions|foundation|immobilien|industries|management|properties|technology|christmas|community|directory|education|equipment|institute|marketing|solutions|vacations|bargains|boutique|builders|catering|cleaning|clothing|computer|democrat|diamonds|graphics|holdings|lighting|partners|plumbing|supplies|training|ventures|academy|careers|company|cruises|domains|exposed|flights|florist|gallery|guitars|holiday|kitchen|neustar|okinawa|recipes|rentals|reviews|shiksha|singles|support|systems|agency|berlin|camera|center|coffee|condos|dating|estate|events|expert|futbol|kaufen|luxury|maison|monash|museum|nagoya|photos|repair|report|social|supply|tattoo|tienda|travel|viajes|villas|vision|voting|voyage|actor|build|cards|cheap|codes|dance|email|glass|house|mango|ninja|parts|photo|shoes|solar|today|tokyo|tools|watch|works|aero|arpa|asia|best|bike|blue|buzz|camp|club|cool|coop|farm|fish|gift|guru|info|jobs|kiwi|kred|land|limo|link|menu|mobi|moda|name|pics|pink|post|qpon|rich|ruhr|sexy|tips|vote|voto|wang|wien|wiki|zone|bar|bid|biz|cab|cat|ceo|com|edu|gov|int|kim|mil|net|onl|org|pro|pub|red|tel|uno|wed|xxx|xyz|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)\b/,s=/[\-A-Za-z0-9+&@#\/%=~_()|'$*\[\]?!:,.;]*[\-A-Za-z0-9+&@#\/%=~_()|'$*\[\]]/
return new RegExp(["(",e.source,")","|","(",t.source,i.source,o.source,")","|","(","(?:","(",r.source,i.source,")","|","(?:","(.?//)?",n.source,i.source,")","|","(?:","(.?//)?",i.source,o.source,")",")","(?:"+s.source+")?",")"].join(""),"gi")}(),charBeforeProtocolRelMatchRegex:/^(.)?\/\//,constructor:function(t){e.Util.assign(this,t),this.matchValidator=new e.MatchValidator},replace:function(e,t,r){var n=this
return e.replace(this.matcherRegex,function(e,i,o,s,a,c,u,l,h){var f=n.processCandidateMatch(e,i,o,s,a,c,u,l,h)
if(f){var p=t.call(r,f.match)
return f.prefixStr+p+f.suffixStr}return e})},processCandidateMatch:function(t,r,n,i,o,s,a,c,u){var l,h=c||u,f="",p=""
if(r&&!this.twitter||o&&!this.email||s&&!this.urls||!this.matchValidator.isValidMatch(s,a,h))return null
if(this.matchHasUnbalancedClosingParen(t)&&(t=t.substr(0,t.length-1),p=")"),o)l=new e.match.Email({matchedText:t,email:o})
else if(r)n&&(f=n,t=t.slice(1)),l=new e.match.Twitter({matchedText:t,twitterHandle:i})
else{if(h){var d=h.match(this.charBeforeProtocolRelMatchRegex)[1]||""
d&&(f=d,t=t.slice(1))}l=new e.match.Url({matchedText:t,url:t,protocolUrlMatch:!!a,protocolRelativeMatch:!!h,stripPrefix:this.stripPrefix})}return{prefixStr:f,suffixStr:p,match:l}},matchHasUnbalancedClosingParen:function(e){var t=e.charAt(e.length-1)
if(")"===t){var r=e.match(/\(/g),n=e.match(/\)/g),i=r&&r.length||0,o=n&&n.length||0
if(o>i)return!0}return!1}}),e.MatchValidator=e.Util.extend(Object,{invalidProtocolRelMatchRegex:/^[\w]\/\//,hasFullProtocolRegex:/^[A-Za-z][-.+A-Za-z0-9]+:\/\//,uriSchemeRegex:/^[A-Za-z][-.+A-Za-z0-9]+:/,hasWordCharAfterProtocolRegex:/:[^\s]*?[A-Za-z]/,isValidMatch:function(e,t,r){return t&&!this.isValidUriScheme(t)||this.urlMatchDoesNotHaveProtocolOrDot(e,t)||this.urlMatchDoesNotHaveAtLeastOneWordChar(e,t)||this.isInvalidProtocolRelativeMatch(r)?!1:!0},isValidUriScheme:function(e){var t=e.match(this.uriSchemeRegex)[0].toLowerCase()
return"javascript:"!==t&&"vbscript:"!==t},urlMatchDoesNotHaveProtocolOrDot:function(e,t){return!(!e||t&&this.hasFullProtocolRegex.test(t)||-1!==e.indexOf("."))},urlMatchDoesNotHaveAtLeastOneWordChar:function(e,t){return e&&t?!this.hasWordCharAfterProtocolRegex.test(e):!1},isInvalidProtocolRelativeMatch:function(e){return!!e&&this.invalidProtocolRelMatchRegex.test(e)}}),e.match.Match=e.Util.extend(Object,{constructor:function(t){e.Util.assign(this,t)},getType:e.Util.abstractMethod,getMatchedText:function(){return this.matchedText},getAnchorHref:e.Util.abstractMethod,getAnchorText:e.Util.abstractMethod}),e.match.Email=e.Util.extend(e.match.Match,{getType:function(){return"email"},getEmail:function(){return this.email},getAnchorHref:function(){return"mailto:"+this.email},getAnchorText:function(){return this.email}}),e.match.Twitter=e.Util.extend(e.match.Match,{getType:function(){return"twitter"},getTwitterHandle:function(){return this.twitterHandle},getAnchorHref:function(){return"https://twitter.com/"+this.twitterHandle},getAnchorText:function(){return"@"+this.twitterHandle}}),e.match.Url=e.Util.extend(e.match.Match,{urlPrefixRegex:/^(https?:\/\/)?(www\.)?/i,protocolRelativeRegex:/^\/\//,protocolPrepended:!1,getType:function(){return"url"},getUrl:function(){var e=this.url
return this.protocolRelativeMatch||this.protocolUrlMatch||this.protocolPrepended||(e=this.url="http://"+e,this.protocolPrepended=!0),e},getAnchorHref:function(){var e=this.getUrl()
return e.replace(/&amp;/g,"&")},getAnchorText:function(){var e=this.getUrl()
return this.protocolRelativeMatch&&(e=this.stripProtocolRelativePrefix(e)),this.stripPrefix&&(e=this.stripUrlPrefix(e)),e=this.removeTrailingSlash(e)},stripUrlPrefix:function(e){return e.replace(this.urlPrefixRegex,"")},stripProtocolRelativePrefix:function(e){return e.replace(this.protocolRelativeRegex,"")},removeTrailingSlash:function(e){return"/"===e.charAt(e.length-1)&&(e=e.slice(0,-1)),e}}),e})},{}],187:[function(e,t,r){t.exports=function(e){var t=0
return e.reduce(function(e,r){var n=r.split("=",2),i=n.pop(),o=n.pop()||++t
return e[o]=i,e},{})}},{}],188:[function(e,t,r){"use strict"
t.exports=function(e,t){if("function"!=typeof e)throw new TypeError("Expected a function")
var r,n=!1,i=e.displayName||e.name||(/function ([^\(]+)/.exec(e.toString())||[])[1],o=function(){if(n){if(t===!0)throw i=i?i+"()":"Function",new Error(i+" can only be called once.")
return r}return n=!0,r=e.apply(this,arguments),e=null,r}
return o.displayName=i,o}},{}],189:[function(e,t,r){t.exports=function(){var e=(new Date).getTime()
return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var r=(e+16*Math.random())%16|0
return e=Math.floor(e/16),("x"==t?r:3&r|8).toString(16)})}},{}],190:[function(e,t,r){arguments[4][23][0].apply(r,arguments)},{dup:23}],191:[function(e,t,r){function n(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]
for(var n in r)i.call(r,n)&&(e[n]=r[n])}return e}t.exports=n
var i=Object.prototype.hasOwnProperty},{}],192:[function(e,t,r){!function(e,n){"object"==typeof r&&"undefined"!=typeof t?t.exports=n():"function"==typeof define&&define.amd?define(n):e.Ractive=n()}(this,function(){"use strict"
function e(e){var t
if(e&&"boolean"!=typeof e)return"undefined"!=typeof window&&document&&e?e.nodeType?e:"string"==typeof e&&(t=document.getElementById(e),!t&&document.querySelector&&(t=document.querySelector(e)),t&&t.nodeType)?t:e[0]&&e[0].nodeType?e[0]:null:null}function t(e){return e&&"unknown"!=typeof e.parentNode&&e.parentNode&&e.parentNode.removeChild(e),e}function r(e){return null!=e&&e.toString?e:""}function n(e){for(var t=arguments.length,r=Array(t>1?t-1:0),n=1;t>n;n++)r[n-1]=arguments[n]
for(var i,o;o=r.shift();)for(i in o)Ta.call(o,i)&&(e[i]=o[i])
return e}function i(e){for(var t=arguments.length,r=Array(t>1?t-1:0),n=1;t>n;n++)r[n-1]=arguments[n]
return r.forEach(function(t){for(var r in t)!t.hasOwnProperty(r)||r in e||(e[r]=t[r])}),e}function o(e){return"[object Array]"===qa.call(e)}function s(e){return ja.test(qa.call(e))}function a(e,t){return null===e&&null===t?!0:"object"==typeof e||"object"==typeof t?!1:e===t}function c(e){return!isNaN(parseFloat(e))&&isFinite(e)}function u(e){return e&&"[object Object]"===qa.call(e)}function l(e,t){return e.replace(/%s/g,function(){return t.shift()})}function h(e){for(var t=arguments.length,r=Array(t>1?t-1:0),n=1;t>n;n++)r[n-1]=arguments[n]
throw e=l(e,r),new Error(e)}function f(){Gy.DEBUG&&Aa.apply(null,arguments)}function p(e){for(var t=arguments.length,r=Array(t>1?t-1:0),n=1;t>n;n++)r[n-1]=arguments[n]
e=l(e,r),Sa(e,r)}function d(e){for(var t=arguments.length,r=Array(t>1?t-1:0),n=1;t>n;n++)r[n-1]=arguments[n]
e=l(e,r),La[e]||(La[e]=!0,Sa(e,r))}function g(){Gy.DEBUG&&p.apply(null,arguments)}function m(){Gy.DEBUG&&d.apply(null,arguments)}function v(e,t,r){var n=b(e,t,r)
return n?n[e][r]:null}function b(e,t,r){for(;t;){if(r in t[e])return t
if(t.isolated)return null
t=t.parent}}function y(e){return function(){return e}}function w(e){var t,r,n,i,o,s
for(t=e.split("."),(r=Fa[t.length])||(r=_(t.length)),o=[],n=function(e,r){return e?"*":t[r]},i=r.length;i--;)s=r[i].map(n).join("."),o.hasOwnProperty(s)||(o.push(s),o[s]=!0)
return o}function _(e){var t,r,n,i,o,s,a,c,u=""
if(!Fa[e]){for(n=[];u.length<e;)u+=1
for(t=parseInt(u,2),i=function(e){return"1"===e},o=0;t>=o;o+=1){for(r=o.toString(2);r.length<e;)r="0"+r
for(c=[],a=r.length,s=0;a>s;s++)c.push(i(r[s]))
n[o]=c}Fa[e]=n}return Fa[e]}function k(e,t,r,n){var i=e[t]
if(!i||!i.equalsOrStartsWith(n)&&i.equalsOrStartsWith(r))return e[t]=i?i.replace(r,n):n,!0}function x(e){var t=e.slice(2)
return"i"===e[1]&&c(t)?+t:t}function E(e){return null==e?e:(Ha.hasOwnProperty(e)||(Ha[e]=new Wa(e)),Ha[e])}function A(e,t){function r(t,r){var n,i,s
return r.isRoot?s=[].concat(Object.keys(e.viewmodel.data),Object.keys(e.viewmodel.mappings),Object.keys(e.viewmodel.computations)):(n=e.viewmodel.wrapped[r.str],i=n?n.get():e.viewmodel.get(r),s=i?Object.keys(i):null),s&&s.forEach(function(e){"_ractive"===e&&o(i)||t.push(r.join(e))}),t}var n,i,s
for(n=t.str.split("."),s=[$a];i=n.shift();)"*"===i?s=s.reduce(r,[]):s[0]===$a?s[0]=E(i):s=s.map(S(i))
return s}function S(e){return function(t){return t.join(e)}}function C(e){return e?e.replace(za,".$1"):""}function T(e,t,r){if("string"!=typeof t||!c(r))throw new Error("Bad arguments")
var n=void 0,i=void 0
if(/\*/.test(t))return i={},A(e,E(C(t))).forEach(function(t){var n=e.viewmodel.get(t)
if(!c(n))throw new Error(Ya)
i[t.str]=n+r}),e.set(i)
if(n=e.get(t),!c(n))throw new Error(Ya)
return e.set(t,+n+r)}function q(e,t){return Ka(this,e,void 0===t?1:+t)}function j(e){this.event=e,this.method="on"+e,this.deprecate=ec[e]}function O(e,t){var r=e.indexOf(t);-1===r&&e.push(t)}function L(e,t){for(var r=0,n=e.length;n>r;r++)if(e[r]==t)return!0
return!1}function R(e,t){var r
if(!o(e)||!o(t))return!1
if(e.length!==t.length)return!1
for(r=e.length;r--;)if(e[r]!==t[r])return!1
return!0}function I(e){return"string"==typeof e?[e]:void 0===e?[]:e}function N(e){return e[e.length-1]}function B(e,t){var r=e.indexOf(t);-1!==r&&e.splice(r,1)}function D(e){for(var t=[],r=e.length;r--;)t[r]=e[r]
return t}function P(e){setTimeout(e,0)}function M(e,t){return function(){for(var r;r=e.shift();)r(t)}}function U(e,t,r,n){var i
if(t===e)throw new TypeError("A promise's fulfillment handler cannot return the same promise")
if(t instanceof tc)t.then(r,n)
else if(!t||"object"!=typeof t&&"function"!=typeof t)r(t)
else{try{i=t.then}catch(o){return void n(o)}if("function"==typeof i){var s,a,c
a=function(t){s||(s=!0,U(e,t,r,n))},c=function(e){s||(s=!0,n(e))}
try{i.call(t,a,c)}catch(o){if(!s)return n(o),void(s=!0)}}else r(t)}}function F(e,t,r){var n
return t=C(t),"~/"===t.substr(0,2)?(n=E(t.substring(2)),H(e,n.firstKey,r)):"."===t[0]?(n=z(ac(r),t),n&&H(e,n.firstKey,r)):n=V(e,E(t),r),n}function z(e,t){var r
if(void 0!=e&&"string"!=typeof e&&(e=e.str),"."===t)return E(e)
if(r=e?e.split("."):[],"../"===t.substr(0,3)){for(;"../"===t.substr(0,3);){if(!r.length)throw new Error('Could not resolve reference - too many "../" prefixes')
r.pop(),t=t.substring(3)}return r.push(t),E(r.join("."))}return E(e?e+t.replace(/^\.\//,"."):t.replace(/^\.\/?/,""))}function V(e,t,r,n){var i,o,s,a,c
if(t.isRoot)return t
for(o=t.firstKey;r;)if(i=r.context,r=r.parent,i&&(a=!0,s=e.viewmodel.get(i),s&&("object"==typeof s||"function"==typeof s)&&o in s))return i.join(t.str)
return W(e.viewmodel,o)?t:e.parent&&!e.isolated&&(a=!0,r=e.component.parentFragment,o=E(o),c=V(e.parent,o,r,!0))?(e.viewmodel.map(o,{origin:e.parent.viewmodel,keypath:c}),t):n||a?void 0:(e.viewmodel.set(t,void 0),t)}function H(e,t){var r
!e.parent||e.isolated||W(e.viewmodel,t)||(t=E(t),(r=V(e.parent,t,e.component.parentFragment,!0))&&e.viewmodel.map(t,{origin:e.parent.viewmodel,keypath:r}))}function W(e,t){return""===t||t in e.data||t in e.computations||t in e.mappings}function G(e){e.teardown()}function $(e){e.unbind()}function K(e){e.unrender()}function Y(e){e.cancel()}function Z(e){e.detach()}function J(e){e.detachNodes()}function Q(e){!e.ready||e.outros.length||e.outroChildren||(e.outrosComplete||(e.parent?e.parent.decrementOutros(e):e.detachNodes(),e.outrosComplete=!0),e.intros.length||e.totalChildren||("function"==typeof e.callback&&e.callback(),e.parent&&e.parent.decrementTotal()))}function X(){for(var e,t,r;lc.ractives.length;)t=lc.ractives.pop(),r=t.viewmodel.applyChanges(),r&&dc.fire(t,r)
for(ee(),e=0;e<lc.views.length;e+=1)lc.views[e].update()
for(lc.views.length=0,e=0;e<lc.tasks.length;e+=1)lc.tasks[e]()
return lc.tasks.length=0,lc.ractives.length?X():void 0}function ee(){var e,t,r,n
for(e=pc.length;e--;)t=pc[e],t.keypath?pc.splice(e,1):(r=cc(t.root,t.ref,t.parentFragment))&&((n||(n=[])).push({item:t,keypath:r}),pc.splice(e,1))
n&&n.forEach(te)}function te(e){e.item.resolve(e.keypath)}function re(e,t,r){var n,i,o,s,a,c,u,l,h,f,p,d,g,m
if(n=new sc(function(e){return i=e}),"object"==typeof e){r=t||{},c=r.easing,u=r.duration,a=[],l=r.step,h=r.complete,(l||h)&&(p={},r.step=null,r.complete=null,f=function(e){return function(t,r){p[e]=r}})
for(o in e)e.hasOwnProperty(o)&&((l||h)&&(d=f(o),r={easing:c,duration:u},l&&(r.step=d)),r.complete=h?d:Oa,a.push(ne(this,o,e[o],r)))
return m={easing:c,duration:u},l&&(m.step=function(e){return l(e,p)}),h&&n.then(function(e){return h(e,p)}),m.complete=i,g=ne(this,null,null,m),a.push(g),n.stop=function(){for(var e;e=a.pop();)e.stop()
g&&g.stop()},n}return r=r||{},r.complete&&n.then(r.complete),r.complete=i,s=ne(this,e,t,r),n.stop=function(){return s.stop()},n}function ne(e,t,r,n){var i,o,s,c
return t&&(t=E(C(t))),null!==t&&(c=e.viewmodel.get(t)),bc.abort(t,e),a(c,r)?(n.complete&&n.complete(n.to),kc):(n.easing&&(i="function"==typeof n.easing?n.easing:e.easing[n.easing],"function"!=typeof i&&(i=null)),o=void 0===n.duration?400:n.duration,s=new wc({keypath:t,from:c,to:r,root:e,duration:o,easing:i,interpolator:n.interpolator,step:n.step,complete:n.complete}),bc.add(s),e._animations.push(s),s)}function ie(){return this.detached?this.detached:(this.el&&B(this.el.__ractive_instances__,this),this.detached=this.fragment.detach(),Ec.fire(this),this.detached)}function oe(e){return this.el?this.fragment.find(e):null}function se(e,t){var r
return r=this._isComponentQuery?!this.selector||e.name===this.selector:e.node?fa(e.node,this.selector):null,r?(this.push(e.node||e.instance),t||this._makeDirty(),!0):void 0}function ae(e){var t
return(t=e.parentFragment)?t.owner:e.component&&(t=e.component.parentFragment)?t.owner:void 0}function ce(e){var t,r
for(t=[e],r=ae(e);r;)t.push(r),r=ae(r)
return t}function ue(e,t,r,n){var i=[]
return ka(i,{selector:{value:t},live:{value:r},_isComponentQuery:{value:n},_test:{value:Sc}}),r?(ka(i,{cancel:{value:Cc},_root:{value:e},_sort:{value:jc},_makeDirty:{value:Oc},_remove:{value:Lc},_dirty:{value:!1,writable:!0}}),i):i}function le(e,t){var r,n
return this.el?(t=t||{},r=this._liveQueries,(n=r[e])?t&&t.live?n:n.slice():(n=Rc(this,e,!!t.live,!1),n.live&&(r.push(e),r["_"+e]=n),this.fragment.findAll(e,n),n)):[]}function he(e,t){var r,n
return t=t||{},r=this._liveComponentQueries,(n=r[e])?t&&t.live?n:n.slice():(n=Rc(this,e,!!t.live,!0),n.live&&(r.push(e),r["_"+e]=n),this.fragment.findAllComponents(e,n),n)}function fe(e){return this.fragment.findComponent(e)}function pe(e){return this.container?this.container.component&&this.container.component.name===e?this.container:this.container.findContainer(e):null}function de(e){return this.parent?this.parent.component&&this.parent.component.name===e?this.parent:this.parent.findParent(e):null}function ge(e,t){var r=void 0===arguments[2]?{}:arguments[2]
if(t){r.event?r.event.name=t:r.event={name:t,_noArg:!0}
var n=E(t).wildcardMatches()
me(e,n,r.event,r.args,!0)}}function me(e,t,r,n){var i,o,s=void 0===arguments[4]?!1:arguments[4],a=!0
for(Uc.enqueue(e,r),o=t.length;o>=0;o--)i=e._subs[t[o]],i&&(a=ve(e,i,r,n)&&a)
if(Uc.dequeue(e),e.parent&&a){if(s&&e.component){var c=e.component.name+"."+t[t.length-1]
t=E(c).wildcardMatches(),r&&(r.component=e)}me(e.parent,t,r,n)}}function ve(e,t,r,n){var i=null,o=!1
r&&!r._noArg&&(n=[r].concat(n)),t=t.slice()
for(var s=0,a=t.length;a>s;s+=1)t[s].apply(e,n)===!1&&(o=!0)
return r&&!r._noArg&&o&&(i=r.original)&&(i.preventDefault&&i.preventDefault(),i.stopPropagation&&i.stopPropagation()),!o}function be(e){var t={args:Array.prototype.slice.call(arguments,1)}
Fc(this,e,t)}function ye(e){var t
return e=E(C(e)),t=this.viewmodel.get(e,Hc),void 0===t&&this.parent&&!this.isolated&&cc(this,e.str,this.component.parentFragment)&&(t=this.viewmodel.get(e)),t}function we(t,r){if(!this.fragment.rendered)throw new Error("The API has changed - you must call `ractive.render(target[, anchor])` to render your Ractive instance. Once rendered you can use `ractive.insert()`.")
if(t=e(t),r=e(r)||null,!t)throw new Error("You must specify a valid target to insert into")
t.insertBefore(this.detach(),r),this.el=t,(t.__ractive_instances__||(t.__ractive_instances__=[])).push(this),this.detached=null,_e(this)}function _e(e){Gc.fire(e),e.findAllComponents("*").forEach(function(e){_e(e.instance)})}function ke(e,t,r){var n,i
return e=E(C(e)),n=this.viewmodel.get(e),o(n)&&o(t)?(i=gc.start(this,!0),this.viewmodel.merge(e,n,t,r),gc.end(),i):this.set(e,t,r&&r.complete)}function xe(e,t){var r,n
return r=A(e,t),n={},r.forEach(function(t){n[t.str]=e.get(t.str)}),n}function Ee(e,t,r,n){var i,o,s
t=E(C(t)),n=n||au,t.isPattern?(i=new ou(e,t,r,n),e.viewmodel.patternObservers.push(i),o=!0):i=new Zc(e,t,r,n),i.init(n.init),e.viewmodel.register(t,i,o?"patternObservers":"observers"),i.ready=!0
var a={cancel:function(){var r
s||(o?(r=e.viewmodel.patternObservers.indexOf(i),e.viewmodel.patternObservers.splice(r,1),e.viewmodel.unregister(t,i,"patternObservers")):e.viewmodel.unregister(t,i,"observers"),s=!0)}}
return e._observers.push(a),a}function Ae(e,t,r){var n,i,o,s
if(u(e)){r=t,i=e,n=[]
for(e in i)i.hasOwnProperty(e)&&(t=i[e],n.push(this.observe(e,t,r)))
return{cancel:function(){for(;n.length;)n.pop().cancel()}}}if("function"==typeof e)return r=t,t=e,e="",su(this,e,t,r)
if(o=e.split(" "),1===o.length)return su(this,e,t,r)
for(n=[],s=o.length;s--;)e=o[s],e&&n.push(su(this,e,t,r))
return{cancel:function(){for(;n.length;)n.pop().cancel()}}}function Se(e,t,r){var n=this.observe(e,function(){t.apply(this,arguments),n.cancel()},{init:!1,defer:r&&r.defer})
return n}function Ce(e,t){var r,n=this
if(e)r=e.split(" ").map(lu).filter(hu),r.forEach(function(e){var r,i;(r=n._subs[e])&&(t?(i=r.indexOf(t),-1!==i&&r.splice(i,1)):n._subs[e]=[])})
else for(e in this._subs)delete this._subs[e]
return this}function Te(e,t){var r,n,i,o=this
if("object"==typeof e){r=[]
for(n in e)e.hasOwnProperty(n)&&r.push(this.on(n,e[n]))
return{cancel:function(){for(var e;e=r.pop();)e.cancel()}}}return i=e.split(" ").map(lu).filter(hu),i.forEach(function(e){(o._subs[e]||(o._subs[e]=[])).push(t)}),{cancel:function(){return o.off(e,t)}}}function qe(e,t){var r=this.on(e,function(){t.apply(this,arguments),r.cancel()})
return r}function je(e,t,r){var n,i,o,s,a,c,u=[]
if(n=Oe(e,t,r),!n)return null
for(i=e.length,a=n.length-2-n[1],o=Math.min(i,n[0]),s=o+n[1],c=0;o>c;c+=1)u.push(c)
for(;s>c;c+=1)u.push(-1)
for(;i>c;c+=1)u.push(c+a)
return 0!==a?u.touchedFrom=n[0]:u.touchedFrom=e.length,u}function Oe(e,t,r){switch(t){case"splice":for(void 0!==r[0]&&r[0]<0&&(r[0]=e.length+Math.max(r[0],-e.length));r.length<2;)r.push(0)
return r[1]=Math.min(r[1],e.length-r[0]),r
case"sort":case"reverse":return null
case"pop":return e.length?[e.length-1,1]:[0,0]
case"push":return[e.length,0].concat(r)
case"shift":return[0,e.length?1:0]
case"unshift":return[0,0].concat(r)}}function Le(t,r){var n,i,o,s=this
if(o=this.transitionsEnabled,this.noIntro&&(this.transitionsEnabled=!1),n=gc.start(this,!0),gc.scheduleTask(function(){return Cu.fire(s)},!0),this.fragment.rendered)throw new Error("You cannot call ractive.render() on an already rendered instance! Call ractive.unrender() first")
if(t=e(t)||this.el,r=e(r)||this.anchor,this.el=t,this.anchor=r,!this.append&&t){var a=t.__ractive_instances__
a&&a.length&&Re(a),t.innerHTML=""}return this.cssId&&Au.apply(),t&&((i=t.__ractive_instances__)?i.push(this):t.__ractive_instances__=[this],r?t.insertBefore(this.fragment.render(),r):t.appendChild(this.fragment.render())),gc.end(),this.transitionsEnabled=o,n.then(function(){return Tu.fire(s)})}function Re(e){e.splice(0,e.length).forEach(G)}function Ie(e,t){for(var r=e.slice(),n=t.length;n--;)~r.indexOf(t[n])||r.push(t[n])
return r}function Ne(e,t){var r,n,i
return n='[data-ractive-css~="{'+t+'}"]',i=function(e){var t,r,i,o,s,a,c,u=[]
for(t=[];r=Iu.exec(e);)t.push({str:r[0],base:r[1],modifiers:r[2]})
for(o=t.map(De),c=t.length;c--;)a=o.slice(),i=t[c],a[c]=i.base+n+i.modifiers||"",s=o.slice(),s[c]=n+" "+s[c],u.push(a.join(" "),s.join(" "))
return u.join(", ")},r=Bu.test(e)?e.replace(Bu,n):e.replace(Ru,"").replace(Lu,function(e,t){var r,n
return Nu.test(t)?e:(r=t.split(",").map(Be),n=r.map(i).join(", ")+" ",e.replace(t,n))})}function Be(e){return e.trim?e.trim():e.replace(/^\s+/,"").replace(/\s+$/,"")}function De(e){return e.str}function Pe(e){e&&e.constructor!==Object&&("function"==typeof e||("object"!=typeof e?h("data option must be an object or a function, `"+e+"` is not valid"):g("If supplied, options.data should be a plain JavaScript object - using a non-POJO as the root object may work, but is discouraged")))}function Me(e,t){Pe(t)
var r="function"==typeof e,n="function"==typeof t
return t||r||(t={}),r||n?function(){var i=n?Ue(t,this):t,o=r?Ue(e,this):e
return Fe(i,o)}:Fe(t,e)}function Ue(e,t){var r=e.call(t)
if(r)return"object"!=typeof r&&h("Data function must return an object"),r.constructor!==Object&&m("Data function returned something other than a plain JavaScript object. This might work, but is strongly discouraged"),r}function Fe(e,t){if(e&&t){for(var r in t)r in e||(e[r]=t[r])
return e}return e||t}function ze(e){var t,r,n
return e.matchString("=")?(t=e.pos,e.allowWhitespace(),(r=e.matchPattern(Rl))?e.matchPattern(Il)?(n=e.matchPattern(Rl))?(e.allowWhitespace(),e.matchString("=")?[r,n]:(e.pos=t,null)):(e.pos=t,null):null:(e.pos=t,null)):null}function Ve(e){var t
return(t=e.matchPattern(Bl))?{t:dl,v:t}:null}function He(e){var t,r
if(e.interpolate[e.inside]===!1)return null
for(r=0;r<e.tags.length;r+=1)if(t=We(e,e.tags[r]))return t}function We(e,t){var r,n,i,o
if(r=e.pos,e.matchString("\\"+t.open)){if(0===r||"\\"!==e.str[r-1])return t.open}else if(!e.matchString(t.open))return null
if(n=Ll(e))return e.matchString(t.close)?(t.open=n[0],t.close=n[1],e.sortMustacheTags(),Pl):null
if(e.allowWhitespace(),e.matchString("/")){e.pos-=1
var s=e.pos
Nl(e)?e.pos=s:(e.pos=s-t.close.length,e.error("Attempted to close a section that wasn't open"))}for(o=0;o<t.readers.length;o+=1)if(i=t.readers[o],n=i(e,t))return t.isStatic&&(n.s=!0),e.includeLinePositions&&(n.p=e.getLinePos(r)),n
return e.pos=r,null}function Ge(e){var t
return(t=e.matchPattern(zl))?{t:ul,v:t}:null}function $e(e){var t=e.remaining()
return"true"===t.substr(0,4)?(e.pos+=4,{t:pl,v:"true"}):"false"===t.substr(0,5)?(e.pos+=5,{t:pl,v:"false"}):null}function Ke(e){var t
return(t=Yl(e))?Ql.test(t.v)?t.v:'"'+t.v.replace(/"/g,'\\"')+'"':(t=Fl(e))?t.v:(t=e.matchPattern(Zl))?t:void 0}function Ye(e){var t,r,n
return t=e.pos,e.allowWhitespace(),r=Jl(e),null===r?(e.pos=t,null):(e.allowWhitespace(),e.matchString(":")?(e.allowWhitespace(),n=Th(e),null===n?(e.pos=t,null):{t:ml,k:r,v:n}):(e.pos=t,null))}function Ze(e){var t,r,n,i
return t=e.pos,n=Xl(e),null===n?null:(r=[n],e.matchString(",")?(i=Ze(e),i?r.concat(i):(e.pos=t,null)):r)}function Je(e){function t(e){n.push(e)}var r,n,i,o
return r=e.pos,e.allowWhitespace(),i=Th(e),null===i?null:(n=[i],e.allowWhitespace(),e.matchString(",")&&(o=Je(e),null===o&&e.error(Ml),o.forEach(t)),n)}function Qe(e){return Fl(e)||Vl(e)||Yl(e)||th(e)||nh(e)||Nl(e)}function Xe(e){var t,r,n,i,o,s
return t=e.pos,n=e.matchPattern(/^@(?:keypath|index|key)/),n||(r=e.matchPattern(sh)||"",n=!r&&e.relaxedNames&&e.matchPattern(lh)||e.matchPattern(uh),n||"."!==r||(r="",n=".")),n?r||e.relaxedNames||!Wl.test(n)?!r&&Hl.test(n)?(i=Hl.exec(n)[0],e.pos=t+i.length,{t:gl,v:i}):(o=(r||"")+C(n),e.matchString("(")&&(s=o.lastIndexOf("."),-1!==s?(o=o.substr(0,s),e.pos=t+o.length):e.pos-=1),{t:vl,n:o.replace(/^this\./,"./").replace(/^this$/,".")}):(e.pos=t,null):null}function et(e){var t,r
return t=e.pos,e.matchString("(")?(e.allowWhitespace(),r=Th(e),r||e.error(Ml),e.allowWhitespace(),e.matchString(")")||e.error(Ul),{t:_l,x:r}):null}function tt(e){var t,r,n
if(t=e.pos,e.allowWhitespace(),e.matchString(".")){if(e.allowWhitespace(),r=e.matchPattern(Zl))return{t:bl,n:r}
e.error("Expected a property name")}return e.matchString("[")?(e.allowWhitespace(),n=Th(e),n||e.error(Ml),e.allowWhitespace(),e.matchString("]")||e.error("Expected ']'"),{t:bl,x:n}):null}function rt(e){var t,r,n,i
return(r=Sh(e))?(t=e.pos,e.allowWhitespace(),e.matchString("?")?(e.allowWhitespace(),n=Th(e),n||e.error(Ml),e.allowWhitespace(),e.matchString(":")||e.error('Expected ":"'),e.allowWhitespace(),i=Th(e),i||e.error(Ml),{t:kl,o:[r,n,i]}):(e.pos=t,r)):null}function nt(e){return Ch(e)}function it(e){function t(e){switch(e.t){case pl:case gl:case ul:case dl:return e.v
case ll:return JSON.stringify(String(e.v))
case hl:return"["+(e.m?e.m.map(t).join(","):"")+"]"
case fl:return"{"+(e.m?e.m.map(t).join(","):"")+"}"
case ml:return e.k+":"+t(e.v)
case wl:return("typeof"===e.s?"typeof ":e.s)+t(e.o)
case xl:return t(e.o[0])+("in"===e.s.substr(0,2)?" "+e.s+" ":e.s)+t(e.o[1])
case El:return t(e.x)+"("+(e.o?e.o.map(t).join(","):"")+")"
case _l:return"("+t(e.x)+")"
case yl:return t(e.x)+t(e.r)
case bl:return e.n?"."+e.n:"["+t(e.x)+"]"
case kl:return t(e.o[0])+"?"+t(e.o[1])+":"+t(e.o[2])
case vl:return"_"+r.indexOf(e.n)
default:throw new Error("Expected legal JavaScript")}}var r
return ot(e,r=[]),{r:r,s:t(e)}}function ot(e,t){var r,n
if(e.t===vl&&-1===t.indexOf(e.n)&&t.unshift(e.n),n=e.o||e.m)if(u(n))ot(n,t)
else for(r=n.length;r--;)ot(n[r],t)
e.x&&ot(e.x,t),e.r&&ot(e.r,t),e.v&&ot(e.v,t)}function st(e,t){var r
if(e){for(;e.t===_l&&e.x;)e=e.x
return e.t===vl?t.r=e.n:e.t===ul&&Oh.test(e.v)?t.r=e.v:(r=at(e))?t.rx=r:t.x=qh(e),t}}function at(e){for(var t,r=[];e.t===yl&&e.r.t===bl;)t=e.r,t.x?t.x.t===vl?r.unshift(t.x):r.unshift(qh(t.x)):r.unshift(t.n),e=e.x
return e.t!==vl?null:{r:e.n,m:r}}function ct(e,t){var r,n=Th(e)
return n?(e.matchString(t.close)||e.error("Expected closing delimiter '"+t.close+"'"),r={t:Yu},jh(n,r),r):null}function ut(e,t){var r,n
return e.matchString("&")?(e.allowWhitespace(),(r=Th(e))?(e.matchString(t.close)||e.error("Expected closing delimiter '"+t.close+"'"),n={t:Yu},jh(r,n),n):null):null}function lt(e,t){var r,n,i,o,s
return r=e.pos,e.matchString(">")?(e.allowWhitespace(),n=e.pos,e.relaxedNames=!0,i=Th(e),e.relaxedNames=!1,e.allowWhitespace(),o=Th(e),e.allowWhitespace(),i?(s={t:el},jh(i,s),e.allowWhitespace(),o&&(s={t:Zu,n:Tl,f:[s]},jh(o,s)),e.matchString(t.close)||e.error("Expected closing delimiter '"+t.close+"'"),s):null):null}function ht(e,t){var r
return e.matchString("!")?(r=e.remaining().indexOf(t.close),-1!==r?(e.pos+=r+t.close.length,{t:tl}):void 0):null}function ft(e,t){var r,n,i
if(r=e.pos,n=Th(e),!n)return null
for(i=0;i<t.length;i+=1)if(e.remaining().substr(0,t[i].length)===t[i])return n
return e.pos=r,oh(e)}function pt(e,t){var r,n,i,o
r=e.pos
try{n=Bh(e,[t.close])}catch(s){o=s}if(!n){if("!"===e.str.charAt(r))return e.pos=r,null
if(o)throw o}if(!e.matchString(t.close)&&(e.error("Expected closing delimiter '"+t.close+"' after reference"),!n)){if("!"===e.nextChar())return null
e.error("Expected expression or legal reference")}return i={t:Ku},jh(n,i),i}function dt(e,t){var r,n,i
return e.matchPattern(Mh)?(r=e.pos,n=e.matchPattern(/^[a-zA-Z_$][a-zA-Z_$0-9\-]*/),e.allowWhitespace(),e.matchString(t.close)||e.error("expected legal partial name"),i={t:sl},n&&(i.n=n),i):null}function gt(e,t){var r,n,i,o
return r=e.pos,e.matchString(t.open)?(e.allowWhitespace(),e.matchString("/")?(e.allowWhitespace(),n=e.remaining(),i=n.indexOf(t.close),-1!==i?(o={t:Qu,r:n.substr(0,i).split(" ")[0]},e.pos+=i,e.matchString(t.close)||e.error("Expected closing delimiter '"+t.close+"'"),o):(e.pos=r,null)):(e.pos=r,null)):null}function mt(e,t){var r=e.pos
return e.matchString(t.open)?e.matchPattern(zh)?(e.matchString(t.close)||e.error("Expected closing delimiter '"+t.close+"'"),{t:jl}):(e.pos=r,null):null}function vt(e,t){var r,n=e.pos
return e.matchString(t.open)?e.matchPattern(Hh)?(r=Th(e),e.matchString(t.close)||e.error("Expected closing delimiter '"+t.close+"'"),{t:Ol,x:r}):(e.pos=n,null):null}function bt(e,t){var r,n,i,o,s,a,c,u,l,h,f,p
if(r=e.pos,e.matchString("^"))i={t:Zu,f:[],n:Sl}
else{if(!e.matchString("#"))return null
i={t:Zu,f:[]},e.matchString("partial")&&(e.pos=r-e.standardDelimiters[0].length,e.error("Partial definitions can only be at the top level of the template, or immediately inside components")),(c=e.matchPattern(Yh))&&(p=c,i.n=Wh[c])}if(e.allowWhitespace(),n=Th(e),n||e.error("Expected expression"),f=e.matchPattern($h)){var d=void 0;(d=e.matchPattern(Kh))?i.i=f+","+d:i.i=f}e.allowWhitespace(),e.matchString(t.close)||e.error("Expected closing delimiter '"+t.close+"'"),e.sectionDepth+=1,s=i.f,l=[]
do if(o=Uh(e,t))p&&o.r!==p&&e.error("Expected "+t.open+"/"+p+t.close),e.sectionDepth-=1,h=!0
else if(o=Vh(e,t))i.n===Sl&&e.error("{{else}} not allowed in {{#unless}}"),a&&e.error("illegal {{elseif...}} after {{else}}"),u||(u=yt(n,i.n)),u.f.push({t:Zu,n:Al,x:qh(_t(l.concat(o.x))),f:s=[]}),l.push(wt(o.x))
else if(o=Fh(e,t))i.n===Sl&&e.error("{{else}} not allowed in {{#unless}}"),a&&e.error("there can only be one {{else}} block, at the end of a section"),a=!0,u?u.f.push({t:Zu,n:Al,x:qh(_t(l)),f:s=[]}):(u=yt(n,i.n),s=u.f)
else{if(o=e.read(ep),!o)break
s.push(o)}while(!h)
return u&&(i.n===Tl&&(i.n=ql),i.l=u),jh(n,i),i.f.length||delete i.f,i}function yt(e,t){var r
return t===Tl?(r={t:Zu,n:Al,f:[]},jh(wt(e),r)):(r={t:Zu,n:Sl,f:[]},jh(e,r)),r}function wt(e){return e.t===wl&&"!"===e.s?e.o:{t:wl,s:"!",o:kt(e)}}function _t(e){return 1===e.length?e[0]:{t:xl,s:"&&",o:[kt(e[0]),kt(_t(e.slice(1)))]}}function kt(e){return{t:_l,x:e}}function xt(e){var t,r,n,i,o
return t=e.pos,e.matchString(Jh)?(n=e.remaining(),i=n.indexOf(Qh),-1===i&&e.error("Illegal HTML - expected closing comment sequence ('-->')"),r=n.substr(0,i),e.pos+=i+3,o={t:tl,c:r},e.includeLinePositions&&(o.p=e.getLinePos(t)),o):null}function Et(e){return e.replace(kh,function(e,t){var r
return r="#"!==t[0]?wh[t]:"x"===t[1]?parseInt(t.substring(2),16):parseInt(t.substring(1),10),r?String.fromCharCode(At(r)):e})}function At(e){return e?10===e?32:128>e?e:159>=e?_h[e-128]:55296>e?e:57343>=e?65533:65535>=e?e:65533:65533}function St(e){return e.replace(Ah,"&amp;").replace(xh,"&lt;").replace(Eh,"&gt;")}function Ct(e){return"string"==typeof e}function Tt(e){return e.t===tl||e.t===rl}function qt(e){return(e.t===Zu||e.t===Ju)&&e.f}function jt(e,t,r,n,i){var s,a,c,u,l,h,f,p
for(uf(e),s=e.length;s--;)a=e[s],a.exclude?e.splice(s,1):t&&a.t===tl&&e.splice(s,1)
for(lf(e,n?df:null,i?gf:null),s=e.length;s--;){if(a=e[s],a.f){var d=a.t===Xu&&pf.test(a.e)
l=r||d,!r&&d&&lf(a.f,mf,vf),l||(c=e[s-1],u=e[s+1],(!c||"string"==typeof c&&gf.test(c))&&(h=!0),(!u||"string"==typeof u&&df.test(u))&&(f=!0)),jt(a.f,t,l,h,f)}if(a.l&&(jt(a.l.f,t,r,h,f),e.splice(s+1,0,a.l),delete a.l),a.a)for(p in a.a)a.a.hasOwnProperty(p)&&"string"!=typeof a.a[p]&&jt(a.a[p],t,r,h,f)
if(a.m&&jt(a.m,t,r,h,f),a.v)for(p in a.v)a.v.hasOwnProperty(p)&&(o(a.v[p].n)&&jt(a.v[p].n,t,r,h,f),o(a.v[p].d)&&jt(a.v[p].d,t,r,h,f))}for(s=e.length;s--;)"string"==typeof e[s]&&("string"==typeof e[s+1]&&(e[s]=e[s]+e[s+1],e.splice(s+1,1)),r||(e[s]=e[s].replace(ff," ")),""===e[s]&&e.splice(s,1))}function Ot(e){var t,r
return t=e.pos,e.matchString("</")?(r=e.matchPattern(yf))?e.inside&&r!==e.inside?(e.pos=t,null):{t:il,e:r}:(e.pos-=2,void e.error("Illegal closing tag")):null}function Lt(e){var t,r,n
return e.allowWhitespace(),(r=e.matchPattern(kf))?(t={name:r},n=Rt(e),null!=n&&(t.value=n),t):null}function Rt(e){var t,r,n,i
return t=e.pos,/[=\/>\s]/.test(e.nextChar())||e.error("Expected `=`, `/`, `>` or whitespace"),e.allowWhitespace(),e.matchString("=")?(e.allowWhitespace(),r=e.pos,n=e.sectionDepth,i=Bt(e,"'")||Bt(e,'"')||Nt(e),null===i&&e.error("Expected valid attribute value"),e.sectionDepth!==n&&(e.pos=r,e.error("An attribute value must contain as many opening section tags as closing section tags")),i.length?1===i.length&&"string"==typeof i[0]?Et(i[0]):i:""):(e.pos=t,null)}function It(e){var t,r,n,i,o
return t=e.pos,(r=e.matchPattern(xf))?(n=r,i=e.tags.map(function(e){return e.open}),-1!==(o=wf(n,i))&&(r=r.substr(0,o),e.pos=t+r.length),r):null}function Nt(e){var t,r
for(e.inAttribute=!0,t=[],r=Dl(e)||It(e);null!==r;)t.push(r),r=Dl(e)||It(e)
return t.length?(e.inAttribute=!1,t):null}function Bt(e,t){var r,n,i
if(r=e.pos,!e.matchString(t))return null
for(e.inAttribute=t,n=[],i=Dl(e)||Dt(e,t);null!==i;)n.push(i),i=Dl(e)||Dt(e,t)
return e.matchString(t)?(e.inAttribute=!1,n):(e.pos=r,null)}function Dt(e,t){var r,n,i,o
return r=e.pos,i=e.remaining(),o=e.tags.map(function(e){return e.open}),o.push(t),n=wf(i,o),-1===n&&e.error("Quoted attribute value must have a closing quote"),n?(e.pos+=n,i.substr(0,n)):null}function Pt(e){var t,r,n
return e.allowWhitespace(),(t=Jl(e))?(n={key:t},e.allowWhitespace(),e.matchString(":")?(e.allowWhitespace(),(r=e.read())?(n.value=r.v,n):null):null):null}function Mt(e,t){var r,n,i,o,s,a,c,u,l
if("string"==typeof e){if(n=Cf.exec(e)){var h=e.lastIndexOf(")")
return Tf.test(e)||t.error("Invalid input after method call expression '"+e.slice(h+1)+"'"),r={m:n[1]},o="["+e.slice(r.m.length+1,h)+"]",i=new Ef(o),r.a=qh(i.result[0]),r}if(-1===e.indexOf(":"))return e.trim()
e=[e]}if(r={},c=[],u=[],e){for(;e.length;)if(s=e.shift(),"string"==typeof s){if(a=s.indexOf(":"),-1!==a){a&&c.push(s.substr(0,a)),s.length>a+1&&(u[0]=s.substring(a+1))
break}c.push(s)}else c.push(s)
u=u.concat(e)}return c.length?u.length||"string"!=typeof c?(r={n:1===c.length&&"string"==typeof c[0]?c[0]:c},1===u.length&&"string"==typeof u[0]?(l=Af("["+u[0]+"]"),r.a=l?l.value:u[0].trim()):r.d=u):r=c:r="",r}function Ut(e){var t,r,n,i,o,s,a,c,u,l,h,f,p,d,g,m
if(t=e.pos,e.inside||e.inAttribute)return null
if(!e.matchString("<"))return null
if("/"===e.nextChar())return null
if(r={},e.includeLinePositions&&(r.p=e.getLinePos(t)),e.matchString("!"))return r.t=cl,e.matchPattern(/^doctype/i)||e.error("Expected DOCTYPE declaration"),r.a=e.matchPattern(/^(.+?)>/),r
if(r.t=Xu,r.e=e.matchPattern(jf),!r.e)return null
for(Of.test(e.nextChar())||e.error("Illegal tag name"),o=function(t,n){var i=n.n||n
If.test(i)&&(e.pos-=i.length,e.error("Cannot use reserved event names (change, reset, teardown, update, construct, config, init, render, unrender, detach, insert)")),r.v[t]=n},e.allowWhitespace();s=Dl(e)||_f(e);)s.name?(n=Nf[s.name])?r[n]=Sf(s.value,e):(i=Rf.exec(s.name))?(r.v||(r.v={}),a=Sf(s.value,e),o(i[1],a)):e.sanitizeEventAttributes&&Lf.test(s.name)||(r.a||(r.a={}),r.a[s.name]=s.value||(""===s.value?"":0)):(r.m||(r.m=[]),r.m.push(s)),e.allowWhitespace()
if(e.allowWhitespace(),e.matchString("/")&&(c=!0),!e.matchString(">"))return null
var v=r.e.toLowerCase(),b=e.preserveWhitespace
if(!c&&!yh.test(r.e)){e.elementStack.push(v),("script"===v||"style"===v)&&(e.inside=v),u=[],l=wa(null)
do if(d=e.pos,g=e.remaining(),Ft(v,g))if(m=bf(e)){p=!0
var y=m.e.toLowerCase()
if(y!==v&&(e.pos=d,!~e.elementStack.indexOf(y))){var w="Unexpected closing tag"
yh.test(y)&&(w+=" (<"+y+"> is a void element - it cannot contain children)"),e.error(w)}}else(f=Uh(e,{open:e.standardDelimiters[0],close:e.standardDelimiters[1]}))?(p=!0,e.pos=d):(f=e.read(tp))?(l[f.n]&&(e.pos=d,e.error("Duplicate partial definition")),hf(f.f,e.stripComments,b,!b,!b),l[f.n]=f.f,h=!0):(f=e.read(ep))?u.push(f):p=!0
else p=!0
while(!p)
u.length&&(r.f=u),h&&(r.p=l),e.elementStack.pop()}return e.inside=null,e.sanitizeElements&&-1!==e.sanitizeElements.indexOf(v)?Bf:r}function Ft(e,t){var r,n
return r=/^<([a-zA-Z][a-zA-Z0-9]*)/.exec(t),n=qf[e],r&&n?!~n.indexOf(r[1].toLowerCase()):!0}function zt(e){var t,r,n,i
return r=e.remaining(),i=e.inside?"</"+e.inside:"<",e.inside&&!e.interpolate[e.inside]?t=r.indexOf(i):(n=e.tags.map(function(e){return e.open}),n=n.concat(e.tags.map(function(e){return"\\"+e.open})),e.inAttribute===!0?n.push('"',"'","=","<",">","`"):e.inAttribute?n.push(e.inAttribute):n.push(i),t=wf(r,n)),t?(-1===t&&(t=r.length),e.pos+=t,e.inside?r.substr(0,t):Et(r.substr(0,t))):null}function Vt(e){return e.replace(Ff,"\\$&")}function Ht(e){var t=e.pos,r=e.standardDelimiters[0],n=e.standardDelimiters[1],i=void 0,o=void 0
if(!e.matchPattern(Vf)||!e.matchString(r))return e.pos=t,null
var s=e.matchPattern(Hf)
if(m("Inline partial comments are deprecated.\nUse this...\n  {{#partial "+s+"}} ... {{/partial}}\n\n...instead of this:\n  <!-- {{>"+s+"}} --> ... <!-- {{/"+s+"}} -->'"),!e.matchString(n)||!e.matchPattern(Wf))return e.pos=t,null
i=[]
var a=new RegExp("^<!--\\s*"+Uf(r)+"\\s*\\/\\s*"+s+"\\s*"+Uf(n)+"\\s*-->")
do e.matchPattern(a)?o=!0:(Df=e.read(ep),Df||e.error("expected closing comment ('<!-- "+r+"/"+s+n+" -->')"),i.push(Df))
while(!o)
return{t:al,f:i,n:s}}function Wt(e){var t,r,n,i,o
t=e.pos
var s=e.standardDelimiters
if(!e.matchString(s[0]))return null
if(!e.matchPattern($f))return e.pos=t,null
r=e.matchPattern(/^[a-zA-Z_$][a-zA-Z_$0-9\-]*/),r||e.error("expected legal partial name"),e.matchString(s[1])||e.error("Expected closing delimiter '"+s[1]+"'"),n=[]
do(i=Uh(e,{open:e.standardDelimiters[0],close:e.standardDelimiters[1]}))?("partial"===!i.r&&e.error("Expected "+s[0]+"/partial"+s[1]),o=!0):(i=e.read(ep),i||e.error("Expected "+s[0]+"/partial"+s[1]),n.push(i))
while(!o)
return{t:al,n:r,f:n}}function Gt(e){for(var t=[],r=wa(null),n=!1,i=e.preserveWhitespace;e.pos<e.str.length;){var o=e.pos,s=void 0,a=void 0;(a=e.read(tp))?(r[a.n]&&(e.pos=o,e.error("Duplicated partial definition")),hf(a.f,e.stripComments,i,!i,!i),r[a.n]=a.f,n=!0):(s=e.read(ep))?t.push(s):e.error("Unexpected template content")}var c={v:sa,t:t}
return n&&(c.p=r),c}function $t(e,t){return new Xf(e,t||{}).result}function Kt(e){var t=wa(sp)
return t.parse=function(t,r){return Yt(t,r||e)},t}function Yt(e,t){if(!Yf)throw new Error("Missing Ractive.parse - cannot parse template. Either preparse or use the version that includes the parser")
return Yf(e,t||this.options)}function Zt(e,t){var r
if(!Xs){if(t&&t.noThrow)return
throw new Error("Cannot retrieve template #"+e+" as Ractive is not running in a browser.")}if(Jt(e)&&(e=e.substring(1)),!(r=document.getElementById(e))){if(t&&t.noThrow)return
throw new Error("Could not find template element with id #"+e)}if("SCRIPT"!==r.tagName.toUpperCase()){if(t&&t.noThrow)return
throw new Error("Template element with id #"+e+", must be a <script> element")}return"textContent"in r?r.textContent:r.innerHTML}function Jt(e){return e&&"#"===e[0]}function Qt(e){return!("string"==typeof e)}function Xt(e){return e.defaults&&(e=e.defaults),op.reduce(function(t,r){return t[r]=e[r],t},{})}function er(e){var t,r=e._config.template
if(r&&r.fn)return t=tr(e,r.fn),t!==r.result?(r.result=t,t=nr(t,e)):void 0}function tr(e,t){var r=rr(ap.getParseOptions(e))
return t.call(e,r)}function rr(e){var t=wa(ap)
return t.parse=function(t,r){return ap.parse(t,r||e)},t}function nr(e,t){if("string"==typeof e)"#"===e[0]&&(e=ap.fromId(e)),e=Yf(e,ap.getParseOptions(t))
else{if(void 0==e)throw new Error("The template cannot be "+e+".")
if("number"!=typeof e.v)throw new Error("The template parser was passed a non-string template, but the template doesn't have a version.  Make sure you're passing in the template you think you are.")
if(e.v!==sa)throw new Error("Mismatched template version (expected "+sa+", got "+e.v+") Please ensure you are using the latest version of Ractive.js in your build process as well as in your app")}return e}function ir(e,t,r){if(t)for(var n in t)(r||!e.hasOwnProperty(n))&&(e[n]=t[n])}function or(e,t,r){if(!/_super/.test(r))return r
var n=function(){var e,i=sr(n._parent,t),o="_super"in this,s=this._super
return this._super=i,e=r.apply(this,arguments),o?this._super=s:delete this._super,e}
return n._parent=e,n._method=r,n}function sr(e,t){var r,n
return t in e?(r=e[t],n="function"==typeof r?r:function(){return r}):n=Oa,n}function ar(e,t,r){return"options."+e+" has been deprecated in favour of options."+t+"."+(r?" You cannot specify both options, please use options."+t+".":"")}function cr(e,t,r){if(t in e){if(r in e)throw new Error(ar(t,r,!0))
g(ar(t,r)),e[r]=e[t]}}function ur(e){cr(e,"beforeInit","onconstruct"),cr(e,"init","onrender"),cr(e,"complete","oncomplete"),cr(e,"eventDefinitions","events"),o(e.adaptors)&&cr(e,"adaptors","adapt")}function lr(e,t,r,n){bp(n)
for(var i in n)if(gp.hasOwnProperty(i)){var o=n[i]
"el"!==i&&"function"==typeof o?g(""+i+" is a Ractive option that does not expect a function and will be ignored","init"===e?r:null):r[i]=o}mp.forEach(function(i){i[e](t,r,n)}),ju[e](t,r,n),up[e](t,r,n),Mu[e](t,r,n),hr(t.prototype,r,n)}function hr(e,t,r){for(var n in r)if(!dp[n]&&r.hasOwnProperty(n)){var i=r[n]
"function"==typeof i&&(i=vp(e,n,i)),t[n]=i}}function fr(e){var t={}
return e.forEach(function(e){return t[e]=!0}),t}function pr(){this.dirtyValue=this.dirtyArgs=!0,this.bound&&"function"==typeof this.owner.bubble&&this.owner.bubble()}function dr(){var e
return 1===this.items.length?this.items[0].detach():(e=document.createDocumentFragment(),this.items.forEach(function(t){var r=t.detach()
r&&e.appendChild(r)}),e)}function gr(e){var t,r,n,i
if(this.items){for(r=this.items.length,t=0;r>t;t+=1)if(n=this.items[t],n.find&&(i=n.find(e)))return i
return null}}function mr(e,t){var r,n,i
if(this.items)for(n=this.items.length,r=0;n>r;r+=1)i=this.items[r],i.findAll&&i.findAll(e,t)
return t}function vr(e,t){var r,n,i
if(this.items)for(n=this.items.length,r=0;n>r;r+=1)i=this.items[r],i.findAllComponents&&i.findAllComponents(e,t)
return t}function br(e){var t,r,n,i
if(this.items){for(t=this.items.length,r=0;t>r;r+=1)if(n=this.items[r],n.findComponent&&(i=n.findComponent(e)))return i
return null}}function yr(e){var t,r=e.index
return t=this.items[r+1]?this.items[r+1].firstNode():this.owner===this.root?this.owner.component?this.owner.component.findNextNode():null:this.owner.findNextNode(this)}function wr(){return this.items&&this.items[0]?this.items[0].firstNode():null}function _r(e,t,r,n){return n=n||0,e.map(function(e){var i,o,s
return e.text?e.text:e.fragments?e.fragments.map(function(e){return _r(e.items,t,r,n)}).join(""):(i=r+"-"+n++,s=e.keypath&&(o=e.root.viewmodel.wrapped[e.keypath.str])?o.value:e.getValue(),t[i]=s,"${"+i+"}")}).join("")}function kr(){var e,t,r,n
return this.dirtyArgs&&(t=Tp(this.items,e={},this.root._guid),r=Af("["+t+"]",e),n=r?r.value:[this.toString()],this.argsList=n,this.dirtyArgs=!1),this.argsList}function xr(){var e=this
do if(e.pElement)return e.pElement.node
while(e=e.parent)
return this.root.detached||this.root.el}function Er(){var e,t,r,n
return this.dirtyValue&&(t=Tp(this.items,e={},this.root._guid),r=Af(t,e),n=r?r.value:this.toString(),this.value=n,this.dirtyValue=!1),this.value}function Ar(){this.registered&&this.root.viewmodel.unregister(this.keypath,this),this.resolver&&this.resolver.unbind()}function Sr(){return this.value}function Cr(e,t){for(var r,n=0;n<t.prop.length;n++)if(void 0!==(r=e[t.prop[n]]))return r}function Tr(e,t){var r,n,i,o,s,a={},c=!1
for(t||(a.refs=r={});e;){if((s=e.owner)&&(n=s.indexRefs)){if(t&&(i=s.getIndexRef(t)))return a.ref={fragment:e,ref:i},a
if(!t)for(o in n)i=n[o],r[i.n]||(c=!0,r[i.n]={fragment:e,ref:i})}!e.parent&&e.owner&&e.owner.component&&e.owner.component.parentFragment&&!e.owner.component.instance.isolated?(a.componentBoundary=!0,e=e.owner.component.parentFragment):e=e.parent}return c?a:void 0}function qr(e,t,r){var n
return"@"===t.charAt(0)?new Fp(e,t,r):(n=Hp(e.parentFragment,t))?new Vp(e,n,r):new Pp(e,t,r)}function jr(e,t){var r,n
if(Kp[e])return Kp[e]
for(n=[];t--;)n[t]="_"+t
return r=new Function(n.join(","),"return("+e+")"),Kp[e]=r,r}function Or(e){return e.call()}function Lr(e,t){return e.replace(/_([0-9]+)/g,function(e,r){var n,i
return+r>=t.length?"_"+r:(n=t[r],void 0===n?"undefined":n.isSpecial?(i=n.value,"number"==typeof i?i:'"'+i+'"'):n.str)})}function Rr(e){return E("${"+e.replace(/[\.\[\]]/g,"-").replace(/\*/,"#MUL#")+"}")}function Ir(e){return void 0!==e&&"@"!==e[0]}function Nr(e,t){var r,n,i
if(e.__ractive_nowrap)return e
if(n="__ractive_"+t._guid,r=e[n])return r
if(/this/.test(e.toString())){_a(e,n,{value:Yp.call(e,t),configurable:!0})
for(i in e)e.hasOwnProperty(i)&&(e[n][i]=e[i])
return t._boundFunctions.push({fn:e,prop:n}),e[n]}return _a(e,"__ractive_nowrap",{value:e}),e.__ractive_nowrap}function Br(e){return e.value}function Dr(e){return void 0!=e}function Pr(e){e.forceResolution()}function Mr(e,t){function r(t){e.resolve(t)}function n(t){var r=e.keypath
t!=r&&(e.resolve(t),void 0!==r&&e.fragments&&e.fragments.forEach(function(e){e.rebind(r,t)}))}var i,o,s
o=t.parentFragment,s=t.template,e.root=o.root,e.parentFragment=o,e.pElement=o.pElement,e.template=t.template,e.index=t.index||0,e.isStatic=t.template.s,e.type=t.template.t,e.registered=!1,(i=s.r)&&(e.resolver=Gp(e,i,r)),t.template.x&&(e.resolver=new Zp(e,o,t.template.x,n)),t.template.rx&&(e.resolver=new ed(e,t.template.rx,n)),e.template.n!==Sl||e.hasOwnProperty("value")||e.setValue(void 0)}function Ur(e){var t,r,n
return e&&e.isSpecial?(this.keypath=e,void this.setValue(e.value)):(this.registered&&(this.root.viewmodel.unregister(this.keypath,this),this.registered=!1,t=!0),this.keypath=e,void 0!=e&&(r=this.root.viewmodel.get(e),this.root.viewmodel.register(e,this),this.registered=!0),this.setValue(r),void(t&&(n=this.twowayBinding)&&n.rebound()))}function Fr(e,t){this.fragments&&this.fragments.forEach(function(r){return r.rebind(e,t)}),this.resolver&&this.resolver.rebind(e,t)}function zr(){this.parentFragment.bubble()}function Vr(){var e
return 1===this.fragments.length?this.fragments[0].detach():(e=document.createDocumentFragment(),this.fragments.forEach(function(t){e.appendChild(t.detach())}),e)}function Hr(e){var t,r,n
for(r=this.fragments.length,t=0;r>t;t+=1)if(n=this.fragments[t].find(e))return n
return null}function Wr(e,t){var r,n
for(n=this.fragments.length,r=0;n>r;r+=1)this.fragments[r].findAll(e,t)}function Gr(e,t){var r,n
for(n=this.fragments.length,r=0;n>r;r+=1)this.fragments[r].findAllComponents(e,t)}function $r(e){var t,r,n
for(r=this.fragments.length,t=0;r>t;t+=1)if(n=this.fragments[t].findComponent(e))return n
return null}function Kr(e){return this.fragments[e.index+1]?this.fragments[e.index+1].firstNode():this.parentFragment.findNextNode(this)}function Yr(){var e,t,r
if(e=this.fragments.length)for(t=0;e>t;t+=1)if(r=this.fragments[t].firstNode())return r
return this.parentFragment.findNextNode(this)}function Zr(e){var t,r,n,i,o,s,a,c=this
if(!this.shuffling&&!this.unbound&&this.currentSubtype===Cl){if(this.shuffling=!0,gc.scheduleTask(function(){return c.shuffling=!1}),t=this.parentFragment,o=[],e.forEach(function(e,t){var n,i,s,a,u
return e===t?void(o[e]=c.fragments[t]):(n=c.fragments[t],void 0===r&&(r=t),-1===e?(c.fragmentsToUnrender.push(n),void n.unbind()):(i=e-t,s=c.keypath.join(t),a=c.keypath.join(e),n.index=e,(u=n.registeredIndexRefs)&&u.forEach(Jr),n.rebind(s,a),void(o[e]=n)))}),i=this.root.viewmodel.get(this.keypath).length,void 0===r){if(this.length===i)return
r=this.length}for(this.length=this.fragments.length=i,this.rendered&&gc.addView(this),s={template:this.template.f,root:this.root,owner:this},n=r;i>n;n+=1)a=o[n],a||this.fragmentsToCreate.push(n),this.fragments[n]=a}}function Jr(e){e.rebind("","")}function Qr(){var e=this
return this.docFrag=document.createDocumentFragment(),this.fragments.forEach(function(t){return e.docFrag.appendChild(t.render())}),this.renderedFragments=this.fragments.slice(),this.fragmentsToRender=[],this.rendered=!0,this.docFrag}function Xr(e){var t,r,n=this
this.updating||(this.updating=!0,this.keypath&&(t=this.root.viewmodel.wrapped[this.keypath.str])&&(e=t.get()),this.fragmentsToCreate.length?(r={template:this.template.f||[],root:this.root,pElement:this.pElement,owner:this},this.fragmentsToCreate.forEach(function(e){var t
r.context=n.keypath.join(e),r.index=e,t=new by(r),n.fragmentsToRender.push(n.fragments[e]=t)}),this.fragmentsToCreate.length=0):tn(this,e)&&(this.bubble(),this.rendered&&gc.addView(this)),this.value=e,this.updating=!1)}function en(e,t,r){if(t===Cl&&e.indexRefs&&e.indexRefs[0]){var n=e.indexRefs[0];(r&&"i"===n.t||!r&&"k"===n.t)&&(r||(e.length=0,e.fragmentsToUnrender=e.fragments.slice(0),e.fragmentsToUnrender.forEach(function(e){return e.unbind()}))),n.t=r?"k":"i"}e.currentSubtype=t}function tn(e,t){var r={template:e.template.f||[],root:e.root,pElement:e.parentFragment.pElement,owner:e}
if(e.hasContext=!0,e.subtype)switch(e.subtype){case Al:return e.hasContext=!1,an(e,t,!1,r)
case Sl:return e.hasContext=!1,an(e,t,!0,r)
case Tl:return sn(e,r)
case ql:return on(e,t,r)
case Cl:if(u(t))return en(e,e.subtype,!0),nn(e,t,r)}return e.ordered=!!s(t),e.ordered?(en(e,Cl,!1),rn(e,t,r)):u(t)||"function"==typeof t?e.template.i?(en(e,Cl,!0),nn(e,t,r)):(en(e,Tl,!1),sn(e,r)):(en(e,Al,!1),e.hasContext=!1,an(e,t,!1,r))}function rn(e,t,r){var n,i,o
if(i=t.length,i===e.length)return!1
if(i<e.length)e.fragmentsToUnrender=e.fragments.splice(i,e.length-i),e.fragmentsToUnrender.forEach($)
else if(i>e.length)for(n=e.length;i>n;n+=1)r.context=e.keypath.join(n),r.index=n,o=new by(r),e.fragmentsToRender.push(e.fragments[n]=o)
return e.length=i,!0}function nn(e,t,r){var n,i,o,s,a,c
for(o=e.hasKey||(e.hasKey={}),i=e.fragments.length;i--;)s=e.fragments[i],s.key in t||(a=!0,s.unbind(),e.fragmentsToUnrender.push(s),e.fragments.splice(i,1),o[s.key]=!1)
for(i=e.fragments.length;i--;)s=e.fragments[i],s.index!==i&&(s.index=i,(c=s.registeredIndexRefs)&&c.forEach(ln))
i=e.fragments.length
for(n in t)o[n]||(a=!0,r.context=e.keypath.join(n),r.key=n,r.index=i++,s=new by(r),e.fragmentsToRender.push(s),e.fragments.push(s),o[n]=!0)
return e.length=e.fragments.length,a}function on(e,t,r){return t?sn(e,r):cn(e)}function sn(e,t){var r
return e.length?void 0:(t.context=e.keypath,t.index=0,r=new by(t),e.fragmentsToRender.push(e.fragments[0]=r),e.length=1,!0)}function an(e,t,r,n){var i,o,a,c,l
if(o=s(t)&&0===t.length,a=!1,!s(t)&&u(t)){a=!0
for(l in t){a=!1
break}}return i=r?o||a||!t:t&&!o&&!a,i?e.length?e.length>1?(e.fragmentsToUnrender=e.fragments.splice(1),e.fragmentsToUnrender.forEach($),!0):void 0:(n.index=0,c=new by(n),e.fragmentsToRender.push(e.fragments[0]=c),e.length=1,!0):cn(e)}function cn(e){return e.length?(e.fragmentsToUnrender=e.fragments.splice(0,e.fragments.length).filter(un),e.fragmentsToUnrender.forEach($),e.length=e.fragmentsToRender.length=0,!0):void 0}function un(e){return e.rendered}function ln(e){e.rebind("","")}function hn(e){var t,r,n
for(t="",r=0,n=this.length,r=0;n>r;r+=1)t+=this.fragments[r].toString(e)
return t}function fn(){var e=this
this.fragments.forEach($),this.fragmentsToRender.forEach(function(t){return B(e.fragments,t)}),this.fragmentsToRender=[],Np.call(this),this.length=0,this.unbound=!0}function pn(e){this.fragments.forEach(e?dn:gn),this.renderedFragments=[],this.rendered=!1}function dn(e){e.unrender(!0)}function gn(e){e.unrender(!1)}function mn(){var e,t,r,n,i,o,s
for(r=this.renderedFragments;e=this.fragmentsToUnrender.pop();)e.unrender(!0),r.splice(r.indexOf(e),1)
for(;e=this.fragmentsToRender.shift();)e.render()
for(this.rendered&&(i=this.parentFragment.getNode()),s=this.fragments.length,o=0;s>o;o+=1)e=this.fragments[o],t=r.indexOf(e,o),t!==o?(this.docFrag.appendChild(e.detach()),-1!==t&&r.splice(t,1),r.splice(o,0,e)):this.docFrag.childNodes.length&&(n=e.firstNode(),i.insertBefore(this.docFrag,n))
this.rendered&&this.docFrag.childNodes.length&&(n=this.parentFragment.findNextNode(this),i.insertBefore(this.docFrag,n)),this.renderedFragments=this.fragments.slice()}function vn(){var e,t
if(this.docFrag){for(e=this.nodes.length,t=0;e>t;t+=1)this.docFrag.appendChild(this.nodes[t])
return this.docFrag}}function bn(e){var t,r,n,i
for(r=this.nodes.length,t=0;r>t;t+=1)if(n=this.nodes[t],1===n.nodeType){if(fa(n,e))return n
if(i=n.querySelector(e))return i}return null}function yn(e,t){var r,n,i,o,s,a
for(n=this.nodes.length,r=0;n>r;r+=1)if(i=this.nodes[r],1===i.nodeType&&(fa(i,e)&&t.push(i),o=i.querySelectorAll(e)))for(s=o.length,a=0;s>a;a+=1)t.push(o[a])}function wn(){return this.rendered&&this.nodes[0]?this.nodes[0]:this.parentFragment.findNextNode(this)}function _n(e){return Od[e]||(Od[e]=ha(e))}function kn(e){var t,r,n
e&&"select"===e.name&&e.binding&&(t=D(e.node.options).filter(xn),e.getAttribute("multiple")?n=t.map(function(e){return e.value}):(r=t[0])&&(n=r.value),void 0!==n&&e.binding.setValue(n),e.bubble())}function xn(e){return e.selected}function En(){if(this.rendered)throw new Error("Attempted to render an item that was already rendered")
return this.docFrag=document.createDocumentFragment(),this.nodes=Ld(this.value,this.parentFragment.getNode(),this.docFrag),Rd(this.pElement),this.rendered=!0,this.docFrag}function An(e){var t;(t=this.root.viewmodel.wrapped[this.keypath.str])&&(e=t.get()),e!==this.value&&(this.value=e,this.parentFragment.bubble(),this.rendered&&gc.addView(this))}function Sn(){return void 0!=this.value?Et(""+this.value):""}function Cn(e){this.rendered&&e&&(this.nodes.forEach(t),this.rendered=!1)}function Tn(){var e,t
if(this.rendered){for(;this.nodes&&this.nodes.length;)e=this.nodes.pop(),e.parentNode.removeChild(e)
t=this.parentFragment.getNode(),this.nodes=Ld(this.value,t,this.docFrag),t.insertBefore(this.docFrag,this.parentFragment.findNextNode(this)),Rd(this.pElement)}}function qn(){var e,t=this.node
return t?((e=t.parentNode)&&e.removeChild(t),t):void 0}function jn(){return null}function On(){return this.node}function Ln(e){return this.attributes&&this.attributes[e]?this.attributes[e].value:void 0}function Rn(){var e=this.useProperty||!this.rendered?this.fragment.getValue():this.fragment.toString()
a(e,this.value)||("id"===this.name&&this.value&&delete this.root.nodes[this.value],this.value=e,"value"===this.name&&this.node&&(this.node._ractive.value=e),this.rendered&&gc.addView(this))}function In(e){var t=e.fragment.items
if(1===t.length)return t[0].type===Ku?t[0]:void 0}function Nn(e){return this.type=nl,this.element=e.element,this.root=e.root,og(this,e.name),this.isBoolean=bh.test(this.name),e.value&&"string"!=typeof e.value?(this.parentFragment=this.element.parentFragment,this.fragment=new by({template:e.value,root:this.root,owner:this}),this.value=this.fragment.getValue(),this.interpolator=sg(this),this.isBindable=!!this.interpolator&&!this.interpolator.isStatic,void(this.ready=!0)):void(this.value=this.isBoolean?!0:e.value||"")}function Bn(e,t){this.fragment&&this.fragment.rebind(e,t)}function Dn(e){var t
this.node=e,e.namespaceURI&&e.namespaceURI!==na.html||(t=lg[this.name]||this.name,void 0!==e[t]&&(this.propertyName=t),(this.isBoolean||this.isTwoway)&&(this.useProperty=!0),"value"===t&&(e._ractive.value=this.value)),this.rendered=!0,this.update()}function Pn(){var e=this,t=e.name,r=e.namespacePrefix,n=e.value,i=e.interpolator,o=e.fragment
if(("value"!==t||"select"!==this.element.name&&"textarea"!==this.element.name)&&("value"!==t||void 0===this.element.getAttribute("contenteditable"))){if("name"===t&&"input"===this.element.name&&i)return"name={{"+(i.keypath.str||i.ref)+"}}"
if(this.isBoolean)return n?t:""
if(o){if(1===o.items.length&&null==o.items[0].value)return""
n=o.toString()}return r&&(t=r+":"+t),n?t+'="'+Mn(n)+'"':t}}function Mn(e){return e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Un(){this.fragment&&this.fragment.unbind(),"id"===this.name&&delete this.root.nodes[this.value]}function Fn(){var e,t,r,n,i=this.value
if(!this.locked)for(this.node._ractive.value=i,e=this.node.options,n=e.length;n--;)if(t=e[n],r=t._ractive?t._ractive.value:t.value,r==i){t.selected=!0
break}}function zn(){var e,t,r,n,i=this.value
for(o(i)||(i=[i]),e=this.node.options,t=e.length;t--;)r=e[t],n=r._ractive?r._ractive.value:r.value,r.selected=L(i,n)}function Vn(){var e=this,t=e.node,r=e.value
t.checked=r==t._ractive.value}function Hn(){var e,t,r,n,i=this.node
if(e=i.checked,i.value=this.element.getAttribute("value"),i.checked=this.element.getAttribute("value")===this.element.getAttribute("name"),e&&!i.checked&&this.element.binding&&(r=this.element.binding.siblings,n=r.length)){for(;n--;){if(t=r[n],!t.element.node)return
if(t.element.node.checked)return gc.addRactive(t.root),t.handleChange()}this.root.viewmodel.set(t.keypath,void 0)}}function Wn(){var e,t,r=this,n=r.element,i=r.node,s=r.value,a=n.binding
if(e=n.getAttribute("value"),o(s)){for(t=s.length;t--;)if(e==s[t])return void(a.isChecked=i.checked=!0)
a.isChecked=i.checked=!1}else a.isChecked=i.checked=s==e}function Gn(){this.node.className=r(this.value)}function $n(){var e=this,t=e.node,r=e.value
this.root.nodes[r]=t,t.id=r}function Kn(){var e,t
e=this.node,t=this.value,void 0===t&&(t=""),e.style.setAttribute("cssText",t)}function Yn(){var e=this.value
void 0===e&&(e=""),this.locked||(this.node.innerHTML=e)}function Zn(){var e=this,t=e.node,r=e.value
t._ractive.value=r,this.locked||(t.value=void 0==r?"":r)}function Jn(){this.locked||(this.node[this.propertyName]=this.value)}function Qn(){var e=this,t=e.node,r=e.namespace,n=e.name,i=e.value,o=e.fragment
r?t.setAttributeNS(r,n,(o||i).toString()):this.isBoolean?i?t.setAttribute(n,""):t.removeAttribute(n):null==i?t.removeAttribute(n):t.setAttribute(n,(o||i).toString())}function Xn(){var e,t,r=this,n=r.name,i=r.element,o=r.node
"id"===n?t=yg:"value"===n?"select"===i.name&&"value"===n?t=i.getAttribute("multiple")?dg:pg:"textarea"===i.name?t=kg:null!=i.getAttribute("contenteditable")?t=_g:"input"===i.name&&(e=i.getAttribute("type"),t="file"===e?Oa:"radio"===e&&i.binding&&"name"===i.binding.name?mg:kg):this.isTwoway&&"name"===n?"radio"===o.type?t=gg:"checkbox"===o.type&&(t=vg):"style"===n&&o.style.setAttribute?t=wg:"class"!==n||o.namespaceURI&&o.namespaceURI!==na.html?this.useProperty&&(t=xg):t=bg,t||(t=Eg),this.update=t,this.update()}function ei(e,t){var r=t?"svg":"div"
return Cg.innerHTML="<"+r+" "+e+"></"+r+">",D(Cg.childNodes[0].attributes)}function ti(e,t){for(var r=e.length;r--;)if(e[r].name===t.name)return!1
return!0}function ri(e){for(;e=e.parent;)if("form"===e.name)return e}function ni(){this._ractive.binding.handleChange()}function ii(){var e
Bg.call(this),e=this._ractive.root.viewmodel.get(this._ractive.binding.keypath),this.value=void 0==e?"":e}function oi(){var e=this._ractive.binding,t=this
e._timeout&&clearTimeout(e._timeout),e._timeout=setTimeout(function(){e.rendered&&Bg.call(t),e._timeout=void 0},e.element.lazy)}function si(e,t,r){var n=e+t+r
return Fg[n]||(Fg[n]=[])}function ai(e){return e.isChecked}function ci(e){return e.element.getAttribute("value")}function ui(e){var t,r,n,i,o,s=e.attributes
return e.binding&&(e.binding.teardown(),e.binding=null),(e.getAttribute("contenteditable")||s.contenteditable&&li(s.contenteditable))&&li(s.value)?r=Mg:"input"===e.name?(t=e.getAttribute("type"),"radio"===t||"checkbox"===t?(n=li(s.name),i=li(s.checked),n&&i&&g("A radio input can have two-way binding on its name attribute, or its checked attribute - not both",{ractive:e.root}),n?r="radio"===t?Wg:$g:i&&(r="radio"===t?Vg:Yg)):"file"===t&&li(s.value)?r=tm:li(s.value)&&(r="number"===t||"range"===t?rm:Dg)):"select"===e.name&&li(s.value)?r=e.getAttribute("multiple")?Xg:Jg:"textarea"===e.name&&li(s.value)&&(r=Dg),r&&(o=new r(e))&&o.keypath?o:void 0}function li(e){return e&&e.isBindable}function hi(){var e=this.getAction()
e&&!this.hasListener?this.listen():!e&&this.hasListener&&this.unrender()}function fi(e){Fc(this.root,this.getAction(),{event:e})}function pi(){return this.action.toString().trim()}function di(e,t,r){var n,i,o,s=this
this.element=e,this.root=e.root,this.parentFragment=e.parentFragment,this.name=t,-1!==t.indexOf("*")&&(h('Only component proxy-events may contain "*" wildcards, <%s on-%s="..."/> is not valid',e.name,t),this.invalid=!0),r.m?(i=r.a.r,this.method=r.m,this.keypaths=[],this.fn=$p(r.a.s,i.length),this.parentFragment=e.parentFragment,o=this.root,this.refResolvers=[],i.forEach(function(e,t){var r=void 0;(r=cm.exec(e))?s.keypaths[t]={eventObject:!0,refinements:r[1]?r[1].split("."):[]}:s.refResolvers.push(Gp(s,e,function(e){return s.resolve(t,e)}))}),this.fire=gi):(n=r.n||r,"string"!=typeof n&&(n=new by({template:n,root:this.root,owner:this})),this.action=n,r.d?(this.dynamicParams=new by({template:r.d,root:this.root,owner:this.element}),this.fire=vi):r.a&&(this.params=r.a,this.fire=mi))}function gi(e){var t,r,n
if(t=this.root,"function"!=typeof t[this.method])throw new Error('Attempted to call a non-existent method ("'+this.method+'")')
r=this.keypaths.map(function(r){var n,i,o
if(void 0===r)return void 0
if(r.eventObject){if(n=e,i=r.refinements.length)for(o=0;i>o;o+=1)n=n[r.refinements[o]]}else n=t.viewmodel.get(r)
return n}),Uc.enqueue(t,e),n=this.fn.apply(null,r),t[this.method].apply(t,n),Uc.dequeue(t)}function mi(e){Fc(this.root,this.getAction(),{event:e,args:this.params})}function vi(e){var t=this.dynamicParams.getArgsList()
"string"==typeof t&&(t=t.substr(1,t.length-2)),Fc(this.root,this.getAction(),{event:e,args:t})}function bi(e){var t,r,n,i={}
t=this._ractive,r=t.events[e.type],(n=Hp(r.element.parentFragment))&&(i=Hp.resolve(n)),r.fire({node:this,original:e,index:i,keypath:t.keypath.str,context:t.root.viewmodel.get(t.keypath)})}function yi(){var e,t=this.name
if(!this.invalid){if(e=v("events",this.root,t))this.custom=e(this.node,wi(t))
else{if(!("on"+t in this.node||window&&"on"+t in window||ea))return void(fm[t]||m(Na(t,"event"),{node:this.node}))
this.node.addEventListener(t,um,!1)}this.hasListener=!0}}function wi(e){return hm[e]||(hm[e]=function(t){var r=t.node._ractive
t.index=r.index,t.keypath=r.keypath.str,t.context=r.root.viewmodel.get(r.keypath),r.events[e].fire(t)}),hm[e]}function _i(e,t){function r(r){r&&r.rebind(e,t)}var n
return this.method?(n=this.element.parentFragment,void this.refResolvers.forEach(r)):("string"!=typeof this.action&&r(this.action),void(this.dynamicParams&&r(this.dynamicParams)))}function ki(){this.node=this.element.node,this.node._ractive.events[this.name]=this,(this.method||this.getAction())&&this.listen()}function xi(e,t){this.keypaths[e]=t}function Ei(){return this.method?void this.refResolvers.forEach($):("string"!=typeof this.action&&this.action.unbind(),void(this.dynamicParams&&this.dynamicParams.unbind()))}function Ai(){this.custom?this.custom.teardown():this.node.removeEventListener(this.name,um,!1),this.hasListener=!1}function Si(){var e=this
this.dirty||(this.dirty=!0,gc.scheduleTask(function(){Ci(e),e.dirty=!1})),this.parentFragment.bubble()}function Ci(e){var t,r,n,i,o
t=e.node,t&&(i=D(t.options),r=e.getAttribute("value"),n=e.getAttribute("multiple"),void 0!==r?(i.forEach(function(e){var t,i
t=e._ractive?e._ractive.value:e.value,i=n?Ti(r,t):r==t,i&&(o=!0),e.selected=i}),o||(i[0]&&(i[0].selected=!0),e.binding&&e.binding.forceUpdate())):e.binding&&e.binding.forceUpdate())}function Ti(e,t){for(var r=e.length;r--;)if(e[r]==t)return!0}function qi(e,t){e.select=Oi(e.parent),e.select&&(e.select.options.push(e),t.a||(t.a={}),void 0!==t.a.value||t.a.hasOwnProperty("disabled")||(t.a.value=t.f),"selected"in t.a&&void 0!==e.select.getAttribute("value")&&delete t.a.selected)}function ji(e){e.select&&B(e.select.options,e)}function Oi(e){if(e)do if("select"===e.name)return e
while(e=e.parent)}function Li(e){var t,r,n,i,o,s,a
this.type=Xu,t=this.parentFragment=e.parentFragment,r=this.template=e.template,this.parent=e.pElement||t.pElement,this.root=n=t.root,this.index=e.index,this.key=e.key,this.name=ig(r.e),"option"===this.name&&qi(this,r),"select"===this.name&&(this.options=[],this.bubble=Si),"form"===this.name&&(this.formBindings=[]),a=rg(this,r),this.attributes=qg(this,r.a),this.conditionalAttributes=Lg(this,r.m),r.f&&(this.fragment=new by({template:r.f,root:n,owner:this,pElement:this,cssIds:null})),s=n.twoway,a.twoway===!1?s=!1:a.twoway===!0&&(s=!0),this.twoway=s,this.lazy=a.lazy,s&&(i=nm(this,r.a))&&(this.binding=i,o=this.root._twowayBindings[i.keypath.str]||(this.root._twowayBindings[i.keypath.str]=[]),o.push(i)),r.v&&(this.eventHandlers=wm(this,r.v)),r.o&&(this.decorator=new Am(this,r.o)),this.intro=r.t0||r.t1,this.outro=r.t0||r.t2}function Ri(e,t){function r(r){r.rebind(e,t)}var n,i,o,s
if(this.attributes&&this.attributes.forEach(r),this.conditionalAttributes&&this.conditionalAttributes.forEach(r),this.eventHandlers&&this.eventHandlers.forEach(r),this.decorator&&r(this.decorator),this.fragment&&r(this.fragment),o=this.liveQueries)for(s=this.root,n=o.length;n--;)o[n]._makeDirty()
this.node&&(i=this.node._ractive)&&k(i,"keypath",e,t)}function Ii(e){var t;(e.attributes.width||e.attributes.height)&&e.node.addEventListener("load",t=function(){var r=e.getAttribute("width"),n=e.getAttribute("height")
void 0!==r&&e.node.setAttribute("width",r),void 0!==n&&e.node.setAttribute("height",n),e.node.removeEventListener("load",t,!1)},!1)}function Ni(e){e.node.addEventListener("reset",Di,!1)}function Bi(e){e.node.removeEventListener("reset",Di,!1)}function Di(){var e=this._ractive.proxy
gc.start(),e.formBindings.forEach(Pi),gc.end()}function Pi(e){e.root.viewmodel.set(e.keypath,e.resetValue)}function Mi(e,t,r){var n,i,o
this.element=e,this.root=n=e.root,this.isIntro=r,i=t.n||t,("string"==typeof i||(o=new by({template:i,root:n,owner:e}),i=o.toString(),o.unbind(),""!==i))&&(this.name=i,t.a?this.params=t.a:t.d&&(o=new by({template:t.d,root:n,owner:e}),this.params=o.getArgsList(),o.unbind()),this._fn=v("transitions",n,i),this._fn||m(Na(i,"transition"),{ractive:this.root}))}function Ui(e){return e}function Fi(){tv.hidden=document[Jm]}function zi(){tv.hidden=!0}function Vi(){tv.hidden=!1}function Hi(){var e,t,r,n=this
return e=this.node=this.element.node,t=e.getAttribute("style"),this.complete=function(i){r||(!i&&n.isIntro&&Wi(e,t),e._ractive.transition=null,n._manager.remove(n),r=!0)},this._fn?void this._fn.apply(this.root,[this].concat(this.params)):void this.complete()}function Wi(e,t){t?e.setAttribute("style",t):(e.getAttribute("style"),e.removeAttribute("style"))}function Gi(){var e,t,r,n=this,i=this.root
return e=$i(this),t=this.node=ha(this.name,e),this.parentFragment.cssIds&&this.node.setAttribute("data-ractive-css",this.parentFragment.cssIds.map(function(e){return"{"+e+"}"}).join(" ")),_a(this.node,"_ractive",{value:{proxy:this,keypath:ac(this.parentFragment),events:wa(null),root:i}}),this.attributes.forEach(function(e){return e.render(t)}),this.conditionalAttributes.forEach(function(e){return e.render(t)}),this.fragment&&("script"===this.name?(this.bubble=fv,this.node.text=this.fragment.toString(!1),this.fragment.unrender=Oa):"style"===this.name?(this.bubble=hv,this.bubble(),this.fragment.unrender=Oa):this.binding&&this.getAttribute("contenteditable")?this.fragment.unrender=Oa:this.node.appendChild(this.fragment.render())),this.binding&&(this.binding.render(),this.node._ractive.binding=this.binding),this.eventHandlers&&this.eventHandlers.forEach(function(e){return e.render()}),"option"===this.name&&Ki(this),"img"===this.name?Ii(this):"form"===this.name?Ni(this):"input"===this.name||"textarea"===this.name?this.node.defaultValue=this.node.value:"option"===this.name&&(this.node.defaultSelected=this.node.selected),this.decorator&&this.decorator.fn&&gc.scheduleTask(function(){n.decorator.torndown||n.decorator.init()},!0),i.transitionsEnabled&&this.intro&&(r=new pv(this,this.intro,!0),gc.registerTransition(r),gc.scheduleTask(function(){return r.start()},!0),this.transition=r),this.node.autofocus&&gc.scheduleTask(function(){return n.node.focus()},!0),Yi(this),this.node}function $i(e){var t,r,n
return t=(r=e.getAttribute("xmlns"))?r:"svg"===e.name?na.svg:(n=e.parent)?"foreignObject"===n.name?na.html:n.node.namespaceURI:e.root.el.namespaceURI}function Ki(e){var t,r,n
if(e.select&&(r=e.select.getAttribute("value"),void 0!==r))if(t=e.getAttribute("value"),e.select.node.multiple&&o(r)){for(n=r.length;n--;)if(t==r[n]){e.node.selected=!0
break}}else e.node.selected=t==r}function Yi(e){var t,r,n,i,o
t=e.root
do for(r=t._liveQueries,n=r.length;n--;)i=r[n],o=r["_"+i],o._test(e)&&(e.liveQueries||(e.liveQueries=[])).push(o)
while(t=t.parent)}function Zi(e){var t,r,n
if(t=e.getAttribute("value"),void 0===t||!e.select)return!1
if(r=e.select.getAttribute("value"),r==t)return!0
if(e.select.getAttribute("multiple")&&o(r))for(n=r.length;n--;)if(r[n]==t)return!0}function Ji(e){var t,r,n,i
return t=e.attributes,r=t.type,n=t.value,i=t.name,r&&"radio"===r.value&&n&&i.interpolator&&n.value===i.interpolator.value?!0:void 0}function Qi(e){var t=e.toString()
return t?" "+t:""}function Xi(){this.fragment&&this.fragment.unbind(),this.binding&&this.binding.unbind(),this.eventHandlers&&this.eventHandlers.forEach($),"option"===this.name&&ji(this),this.attributes.forEach($),this.conditionalAttributes.forEach($)}function eo(e){var t,r,n;(n=this.transition)&&n.complete(),"option"===this.name?this.detach():e&&gc.detachWhenReady(this),this.fragment&&this.fragment.unrender(!1),(t=this.binding)&&(this.binding.unrender(),this.node._ractive.binding=null,r=this.root._twowayBindings[t.keypath.str],r.splice(r.indexOf(t),1)),this.eventHandlers&&this.eventHandlers.forEach(K),this.decorator&&gc.registerDecorator(this.decorator),this.root.transitionsEnabled&&this.outro&&(n=new pv(this,this.outro,!1),gc.registerTransition(n),gc.scheduleTask(function(){return n.start()})),this.liveQueries&&to(this),"form"===this.name&&Bi(this)}function to(e){var t,r,n
for(n=e.liveQueries.length;n--;)t=e.liveQueries[n],r=t.selector,t._remove(e.node)}function ro(e,t){var r=_v.exec(t)[0]
return null===e||r.length<e.length?r:e}function no(e,t,r){var n
if(n=io(e,t,r||{}))return n
if(n=ap.fromId(t,{noThrow:!0})){n=kv(n)
var i=ap.parse(n,ap.getParseOptions(e))
return e.partials[t]=i.t}}function io(e,t,r){var n=void 0,i=ao(t,r.owner)
if(i)return i
var o=b("partials",e,t)
if(o){if(i=o.partials[t],"function"==typeof i&&(n=i.bind(o),n.isOwner=o.partials.hasOwnProperty(t),i=n.call(e,ap)),!i&&""!==i)return void g(Ia,t,"partial","partial",{ractive:e})
if(!ap.isParsed(i)){var s=ap.parse(i,ap.getParseOptions(o))
s.p&&g("Partials ({{>%s}}) cannot contain nested inline partials",t,{ractive:e})
var a=n?o:oo(o,t)
a.partials[t]=i=s.t}return n&&(i._fn=n),i.v?i.t:i}}function oo(e,t){return e.partials.hasOwnProperty(t)?e:so(e.constructor,t)}function so(e,t){return e?e.partials.hasOwnProperty(t)?e:so(e._Parent,t):void 0}function ao(e,t){if(t){if(t.template&&t.template.p&&t.template.p[e])return t.template.p[e]
if(t.parentFragment&&t.parentFragment.owner)return ao(e,t.parentFragment.owner)}}function co(e,t){var r,n=b("components",e,t)
if(n&&(r=n.components[t],!r._Parent)){var i=r.bind(n)
if(i.isOwner=n.components.hasOwnProperty(t),r=i(),!r)return void g(Ia,t,"component","component",{ractive:e})
"string"==typeof r&&(r=co(e,r)),r._fn=i,n.components[t]=r}return r}function uo(){var e=this.instance.fragment.detach()
return Rv.fire(this.instance),e}function lo(e){return this.instance.fragment.find(e)}function ho(e,t){return this.instance.fragment.findAll(e,t)}function fo(e,t){t._test(this,!0),this.instance.fragment&&this.instance.fragment.findAllComponents(e,t)}function po(e){return e&&e!==this.name?this.instance.fragment?this.instance.fragment.findComponent(e):null:this.instance}function go(){return this.parentFragment.findNextNode(this)}function mo(){return this.rendered?this.instance.fragment.firstNode():null}function vo(e,t,r){function n(e){var r,n
e.value=t,e.updating||(n=e.ractive,r=e.keypath,e.updating=!0,gc.start(n),n.viewmodel.mark(r),gc.end(),e.updating=!1)}var i,o,s,a,c,u
if(i=e.obj,o=e.prop,r&&!r.configurable){if("length"===o)return
throw new Error('Cannot use magic mode with property "'+o+'" - object is not configurable')}r&&(s=r.get,a=r.set),c=s||function(){return t},u=function(e){a&&a(e),t=s?s():e,u._ractiveWrappers.forEach(n)},u._ractiveWrappers=[e],Object.defineProperty(i,o,{get:c,set:u,enumerable:!0,configurable:!0})}function bo(e,t){var r,n,i,o
if(this.adaptors)for(r=this.adaptors.length,n=0;r>n;n+=1)if(i=this.adaptors[n],i.filter(t,e,this.ractive))return o=this.wrapped[e]=i.wrap(this.ractive,t,e,wo(e)),void(o.value=t)}function yo(e,t){var r,n={}
if(!t)return e
t+="."
for(r in e)e.hasOwnProperty(r)&&(n[t+r]=e[r])
return n}function wo(e){var t
return nb[e]||(t=e?e+".":"",nb[e]=function(r,n){var i
return"string"==typeof r?(i={},i[t+r]=n,i):"object"==typeof r?t?yo(r,e):r:void 0}),nb[e]}function _o(e){var t,r,n=[$a]
for(t=e.length;t--;)for(r=e[t].parent;r&&!r.isRoot;)-1===e.indexOf(r)&&O(n,r),r=r.parent
return n}function ko(e,t,r){var n
Eo(e,t),r||(n=t.wildcardMatches(),n.forEach(function(r){xo(e,r,t)}))}function xo(e,t,r){var n,i,o
t=t.str||t,n=e.depsMap.patternObservers,i=n&&n[t],i&&i.forEach(function(t){o=r.join(t.lastKey),Eo(e,o),xo(e,t,o)})}function Eo(e,t){e.patternObservers.forEach(function(e){e.regex.test(t.str)&&e.update(t)})}function Ao(){function e(e){var n=e.key
e.viewmodel===s?(s.clearCache(n.str),e.invalidate(),r.push(n),t(n)):e.viewmodel.mark(n)}function t(r){var n,i
s.noCascade.hasOwnProperty(r.str)||((i=s.deps.computed[r.str])&&i.forEach(e),(n=s.depsMap.computed[r.str])&&n.forEach(t))}var r,n,i,o=this,s=this,a={}
return r=this.changes,r.length?(r.slice().forEach(t),n=ib(r),n.forEach(function(t){var n;-1===r.indexOf(t)&&(n=s.deps.computed[t.str])&&n.forEach(e)}),this.changes=[],this.patternObservers.length&&(n.forEach(function(e){return ob(o,e,!0)}),r.forEach(function(e){return ob(o,e)})),this.deps.observers&&(n.forEach(function(e){return So(o,null,e,"observers")}),To(this,r,"observers")),this.deps["default"]&&(i=[],n.forEach(function(e){return So(o,i,e,"default")}),i.length&&Co(this,i,r),To(this,r,"default")),r.forEach(function(e){a[e.str]=o.get(e)}),this.implicitChanges={},this.noCascade={},a):void 0}function So(e,t,r,n){var i,o;(i=qo(e,r,n))&&(o=e.get(r),i.forEach(function(e){t&&e.refineValue?t.push(e):e.setValue(o)}))}function Co(e,t,r){t.forEach(function(t){for(var n=!1,i=0,o=r.length,s=[];o>i;){var a=r[i]
if(a===t.keypath){n=!0
break}a.slice(0,t.keypath.length)===t.keypath&&s.push(a),i++}n&&t.setValue(e.get(t.keypath)),s.length&&t.refineValue(s)})}function To(e,t,r){function n(e){e.forEach(i),e.forEach(o)}function i(t){var n=qo(e,t,r)
n&&a.push({keypath:t,deps:n})}function o(t){var i;(i=e.depsMap[r][t.str])&&n(i)}function s(t){var r=e.get(t.keypath)
t.deps.forEach(function(e){return e.setValue(r)})}var a=[]
n(t),a.forEach(s)}function qo(e,t,r){var n=e.deps[r]
return n?n[t.str]:null}function jo(){this.captureGroups.push([])}function Oo(e,t){var r,n
if(t||(n=this.wrapped[e])&&n.teardown()!==!1&&(this.wrapped[e]=null),this.cache[e]=void 0,r=this.cacheMap[e])for(;r.length;)this.clearCache(r.pop())}function Lo(e,t){var r=t.firstKey
return!(r in e.data||r in e.computations||r in e.mappings)}function Ro(e,t){var r=new fb(e,t)
return this.ready&&r.init(this),this.computations[e.str]=r}function Io(e,t){var r,n,i,o,s,a=this.cache,c=e.str
if(t=t||mb,t.capture&&(o=N(this.captureGroups))&&(~o.indexOf(e)||o.push(e)),Ta.call(this.mappings,e.firstKey))return this.mappings[e.firstKey].get(e,t)
if(e.isSpecial)return e.value
if(void 0===a[c]?((n=this.computations[c])&&!n.bypass?(r=n.get(),this.adapt(c,r)):(i=this.wrapped[c])?r=i.value:e.isRoot?(this.adapt("",this.data),r=this.data):r=No(this,e),a[c]=r):r=a[c],!t.noUnwrap&&(i=this.wrapped[c])&&(r=i.get()),e.isRoot&&t.fullRootGet)for(s in this.mappings)r[s]=this.mappings[s].getValue()
return r===db?void 0:r}function No(e,t){var r,n,i,o
return r=e.get(t.parent),(o=e.wrapped[t.parent.str])&&(r=o.get()),null!==r&&void 0!==r?((n=e.cacheMap[t.parent.str])?-1===n.indexOf(t.str)&&n.push(t.str):e.cacheMap[t.parent.str]=[t.str],"object"!=typeof r||t.lastKey in r?(i=r[t.lastKey],e.adapt(t.str,i,!1),e.cache[t.str]=i,i):e.cache[t.str]=db):void 0}function Bo(){var e
for(e in this.computations)this.computations[e].init(this)}function Do(e,t){var r=this.mappings[e.str]=new yb(e,t)
return r.initViewmodel(this),r}function Po(e,t){var r,n=e.str
t&&(t.implicit&&(this.implicitChanges[n]=!0),t.noCascade&&(this.noCascade[n]=!0)),(r=this.computations[n])&&r.invalidate(),-1===this.changes.indexOf(e)&&this.changes.push(e)
var i=t?t.keepExistingWrapper:!1
this.clearCache(n,i),this.ready&&this.onchange()}function Mo(e,t,r,n){var i,o,s,a
if(this.mark(e),n&&n.compare){s=Fo(n.compare)
try{i=t.map(s),o=r.map(s)}catch(c){g('merge(): "%s" comparison failed. Falling back to identity checking',e),i=t,o=r}}else i=t,o=r
a=_b(i,o),this.smartUpdate(e,r,a,t.length!==r.length)}function Uo(e){return JSON.stringify(e)}function Fo(e){if(e===!0)return Uo
if("string"==typeof e)return xb[e]||(xb[e]=function(t){return t[e]}),xb[e]
if("function"==typeof e)return e
throw new Error("The `compare` option must be a function, or a string representing an identifying field (or `true` to use JSON.stringify)")}function zo(e,t){var r,n,i,o=void 0===arguments[2]?"default":arguments[2]
t.isStatic||((r=this.mappings[e.firstKey])?r.register(e,t,o):(n=this.deps[o]||(this.deps[o]={}),i=n[e.str]||(n[e.str]=[]),i.push(t),this.depsMap[o]||(this.depsMap[o]={}),e.isRoot||Vo(this,e,o)))}function Vo(e,t,r){for(var n,i,o;!t.isRoot;)n=e.depsMap[r],i=n[t.parent.str]||(n[t.parent.str]=[]),o=t.str,void 0===i["_"+o]&&(i["_"+o]=0,i.push(t)),i["_"+o]+=1,t=t.parent}function Ho(){return this.captureGroups.pop()}function Wo(e){this.data=e,this.clearCache("")}function Go(e,t){var r,n,i,o,s=void 0===arguments[2]?{}:arguments[2]
if(!s.noMapping&&(r=this.mappings[e.firstKey]))return r.set(e,t)
if(n=this.computations[e.str]){if(n.setting)return
n.set(t),t=n.get()}a(this.cache[e.str],t)||(i=this.wrapped[e.str],i&&i.reset&&(o=i.reset(t)!==!1,o&&(t=i.get())),n||o||$o(this,e,t),s.silent?this.clearCache(e.str):this.mark(e))}function $o(e,t,r){var n,i,o,s
o=function(){n.set?n.set(t.lastKey,r):(i=n.get(),s())},s=function(){i||(i=Jv(t.lastKey),e.set(t.parent,i,{silent:!0})),i[t.lastKey]=r},n=e.wrapped[t.parent.str],n?o():(i=e.get(t.parent),(n=e.wrapped[t.parent.str])?o():s())}function Ko(e,t,r){var n,i,o,s=this
if(i=r.length,r.forEach(function(t,r){-1===t&&s.mark(e.join(r),jb)}),this.set(e,t,{silent:!0}),(n=this.deps["default"][e.str])&&n.filter(Yo).forEach(function(e){return e.shuffle(r,t)}),i!==t.length){for(this.mark(e.join("length"),qb),o=r.touchedFrom;o<t.length;o+=1)this.mark(e.join(o))
for(o=t.length;i>o;o+=1)this.mark(e.join(o),jb)}}function Yo(e){return"function"==typeof e.shuffle}function Zo(){var e,t=this
for(Object.keys(this.cache).forEach(function(e){return t.clearCache(e)});e=this.unresolvedImplicitDependencies.pop();)e.teardown()}function Jo(e,t){var r,n,i,o=void 0===arguments[2]?"default":arguments[2]
if(!t.isStatic){if(r=this.mappings[e.firstKey])return r.unregister(e,t,o)
if(n=this.deps[o][e.str],i=n.indexOf(t),-1===i)throw new Error("Attempted to remove a dependant that was no longer registered! This should not happen. If you are seeing this bug in development please raise an issue at https://github.com/RactiveJS/Ractive/issues - thanks")
n.splice(i,1),e.isRoot||Qo(this,e,o)}}function Qo(e,t,r){for(var n,i;!t.isRoot;)n=e.depsMap[r],i=n[t.parent.str],i["_"+t.str]-=1,i["_"+t.str]||(B(i,t),i["_"+t.str]=void 0),t=t.parent}function Xo(e){this.hook=new rc(e),this.inProcess={},this.queue={}}function es(e,t){return e[t._guid]||(e[t._guid]=[])}function ts(e,t){var r=es(e.queue,t)
for(e.hook.fire(t);r.length;)ts(e,r.shift())
delete e.queue[t._guid]}function rs(e,t){var r,n={}
for(r in t)n[r]=ns(e,r,t[r])
return n}function ns(e,t,r){var n,i
return"function"==typeof r&&(n=os(r,e)),"string"==typeof r&&(n=is(e,r)),"object"==typeof r&&("string"==typeof r.get?n=is(e,r.get):"function"==typeof r.get?n=os(r.get,e):h("`%s` computation must have a `get()` method",t),"function"==typeof r.set&&(i=os(r.set,e))),{getter:n,setter:i}}function is(e,t){var r,n,i
return r="return ("+t.replace(Db,function(e,t){return n=!0,'__ractive.get("'+t+'")'})+");",n&&(r="var __ractive = this; "+r),i=new Function(r),n?i.bind(e):i}function os(e,t){return/this/.test(e.toString())?e.bind(t):e}function ss(t){var r,i,o=void 0===arguments[1]?{}:arguments[1],s=void 0===arguments[2]?{}:arguments[2]
if(Gy.DEBUG&&Ca(),us(t,s),_a(t,"data",{get:ls}),Pb.fire(t,o),zb.forEach(function(e){t[e]=n(wa(t.constructor[e]||null),o[e])}),i=new Ib({adapt:as(t,t.adapt,o),data:Fu.init(t.constructor,t,o),computed:Bb(t,n(wa(t.constructor.prototype.computed),o.computed)),mappings:s.mappings,ractive:t,onchange:function(){return gc.addRactive(t)}}),t.viewmodel=i,i.init(),yp.init(t.constructor,t,o),Mb.fire(t),Ub.begin(t),t.template){var a=void 0;(s.cssIds||t.cssId)&&(a=s.cssIds?s.cssIds.slice():[],t.cssId&&a.push(t.cssId)),t.fragment=new by({template:t.template,root:t,owner:t,cssIds:a})}if(Ub.end(t),r=e(t.el)){var c=t.render(r,t.append)
Gy.DEBUG_PROMISES&&c["catch"](function(e){throw m("Promise debugging is enabled, to help solve errors that happen asynchronously. Some browsers will log unhandled promise rejections, in which case you can safely disable promise debugging:\n  Ractive.DEBUG_PROMISES = false;"),g("An error happened during rendering",{ractive:t}),e.stack&&f(e.stack),e})}}function as(e,t,r){function n(t){return"string"==typeof t&&(t=v("adaptors",e,t),t||h(Na(t,"adaptor"))),t}var i,o,s
if(t=t.map(n),i=I(r.adapt).map(n),i=cs(t,i),o="magic"in r?r.magic:e.magic,s="modifyArrays"in r?r.modifyArrays:e.modifyArrays,o){if(!ra)throw new Error("Getters and setters (magic mode) are not supported in this browser")
s&&i.push(tb),i.push(eb)}return s&&i.push(Yv),i}function cs(e,t){for(var r=e.slice(),n=t.length;n--;)~r.indexOf(t[n])||r.push(t[n])
return r}function us(e,t){e._guid="r-"+Fb++,e._subs=wa(null),e._config={},e._twowayBindings=wa(null),e._animations=[],e.nodes={},e._liveQueries=[],e._liveComponentQueries=[],e._boundFunctions=[],e._observers=[],t.component?(e.parent=t.parent,e.container=t.container||null,e.root=e.parent.root,e.component=t.component,t.component.instance=e,e._inlinePartials=t.inlinePartials):(e.root=e,e.parent=e.container=null)}function ls(){throw new Error("Using `ractive.data` is no longer supported - you must use the `ractive.get()` API instead")}function hs(e,t,r){this.parentFragment=e.parentFragment,this.callback=r,this.fragment=new by({template:t,root:e.root,owner:this}),this.update()}function fs(e,t,r){var n
return t.r?n=Gp(e,t.r,r):t.x?n=new Zp(e,e.parentFragment,t.x,r):t.rx&&(n=new ed(e,t.rx,r)),n}function ps(e){return 1===e.length&&e[0].t===Ku}function ds(e,t){var r
for(r in t)t.hasOwnProperty(r)&&gs(e.instance,e.root,r,t[r])}function gs(e,t,r,n){"string"!=typeof n&&h("Components currently only support simple events - you cannot include arguments. Sorry!"),e.on(r,function(){var e,r
return arguments.length&&arguments[0]&&arguments[0].node&&(e=Array.prototype.shift.call(arguments)),r=Array.prototype.slice.call(arguments),Fc(t,n,{event:e,args:r}),!1})}function ms(e,t){var r,n
if(!t)throw new Error('Component "'+this.name+'" not found')
r=this.parentFragment=e.parentFragment,n=r.root,this.root=n,this.type=ol,this.name=e.template.e,this.index=e.index,this.indexRefBindings={},this.yielders={},this.resolvers=[],Wb(this,t,e.template.a,e.template.f,e.template.p),Gb(this,e.template.v),(e.template.t0||e.template.t1||e.template.t2||e.template.o)&&g('The "intro", "outro" and "decorator" directives have no effect on components',{ractive:this.instance}),$b(this)}function vs(e,t){function r(r){r.rebind(e,t)}var n
this.resolvers.forEach(r)
for(var i in this.yielders)this.yielders[i][0]&&r(this.yielders[i][0]);(n=this.root._liveComponentQueries["_"+this.name])&&n._makeDirty()}function bs(){var e=this.instance
return e.render(this.parentFragment.getNode()),this.rendered=!0,e.fragment.detach()}function ys(){return this.instance.fragment.toString()}function ws(){var e=this.instance
this.resolvers.forEach($),_s(this),e._observers.forEach(Y),e.fragment.unbind(),e.viewmodel.teardown(),e.fragment.rendered&&e.el.__ractive_instances__&&B(e.el.__ractive_instances__,e),Xb.fire(e)}function _s(e){var t,r
t=e.root
do(r=t._liveComponentQueries["_"+e.name])&&r._remove(e)
while(t=t.parent)}function ks(e){this.shouldDestroy=e,this.instance.unrender()}function xs(e){var t=this
this.owner=e.owner,this.parent=this.owner.parentFragment,this.root=e.root,this.pElement=e.pElement,this.context=e.context,this.index=e.index,this.key=e.key,this.registeredIndexRefs=[],this.cssIds="cssIds"in e?e.cssIds:this.parent?this.parent.cssIds:null,this.items=e.template.map(function(r,n){return Es({parentFragment:t,pElement:e.pElement,template:r,index:n})}),this.value=this.argsList=null,this.dirtyArgs=this.dirtyValue=!0,this.bound=!0}function Es(e){if("string"==typeof e.template)return new Ip(e)
switch(e.template.t){case sl:return new sy(e)
case Ku:return new sd(e)
case Zu:return new Sd(e)
case Yu:return new Hd(e)
case Xu:var t=void 0
return(t=Ov(e.parentFragment.root,e.template.e))?new ry(e,t):new yv(e)
case el:return new jv(e)
case tl:return new iy(e)
case cl:return new cy(e)
default:throw new Error("Something very strange happened. Please file an issue at https://github.com/ractivejs/ractive/issues. Thanks!")}}function As(e,t){(!this.owner||this.owner.hasContext)&&k(this,"context",e,t),this.items.forEach(function(r){r.rebind&&r.rebind(e,t)})}function Ss(){var e
return 1===this.items.length?e=this.items[0].render():(e=document.createDocumentFragment(),this.items.forEach(function(t){e.appendChild(t.render())})),this.rendered=!0,e}function Cs(e){return this.items?this.items.map(e?qs:Ts).join(""):""}function Ts(e){return e.toString()}function qs(e){return e.toString(!0)}function js(){this.bound&&(this.items.forEach(Os),this.bound=!1)}function Os(e){e.unbind&&e.unbind()}function Ls(e){if(!this.rendered)throw new Error("Attempted to unrender a fragment that was not rendered")
this.items.forEach(function(t){return t.unrender(e)}),this.rendered=!1}function Rs(e){var t,r,n,i,o
if(e=e||{},"object"!=typeof e)throw new Error("The reset method takes either no arguments, or an object containing new data")
for((r=this.viewmodel.wrapped[""])&&r.reset?r.reset(e)===!1&&this.viewmodel.reset(e):this.viewmodel.reset(e),n=yp.reset(this),i=n.length;i--;)if(wy.indexOf(n[i])>-1){o=!0
break}if(o){var s=void 0
this.viewmodel.mark($a),(s=this.component)&&(s.shouldDestroy=!0),this.unrender(),s&&(s.shouldDestroy=!1),this.fragment.template!==this.template&&(this.fragment.unbind(),this.fragment=new by({template:this.template,root:this,owner:this})),t=this.render(this.el,this.anchor)}else t=gc.start(this,!0),this.viewmodel.mark($a),gc.end()
return _y.fire(this,e),t}function Is(e){var t,r
up.init(null,this,{template:e}),t=this.transitionsEnabled,this.transitionsEnabled=!1,(r=this.component)&&(r.shouldDestroy=!0),this.unrender(),r&&(r.shouldDestroy=!1),this.fragment.unbind(),this.fragment=new by({template:this.template,root:this,owner:this}),this.render(this.el,this.anchor),this.transitionsEnabled=t}function Ns(e,t){var r,n
if(n=gc.start(this,!0),u(e)){r=e
for(e in r)r.hasOwnProperty(e)&&(t=r[e],Bs(this,e,t))}else Bs(this,e,t)
return gc.end(),n}function Bs(e,t,r){t=E(C(t)),t.isPattern?A(e,t).forEach(function(t){e.viewmodel.set(t,r)}):e.viewmodel.set(t,r)}function Ds(e,t){return Ka(this,e,void 0===t?-1:-t)}function Ps(){var e
return this.fragment.unbind(),this.viewmodel.teardown(),this._observers.forEach(Y),this.fragment.rendered&&this.el.__ractive_instances__&&B(this.el.__ractive_instances__,this),this.shouldDestroy=!0,e=this.fragment.rendered?this.unrender():sc.resolve(),Oy.fire(this),this._boundFunctions.forEach(Ms),e}function Ms(e){delete e.fn[e.prop]}function Us(e){var t=this
if("string"!=typeof e)throw new TypeError(Ra)
var r=void 0
return/\*/.test(e)?(r={},A(this,E(C(e))).forEach(function(e){r[e.str]=!t.viewmodel.get(e)}),this.set(r)):this.set(e,!this.get(e))}function Fs(){return this.fragment.toString(!0)}function zs(){var e,t
if(!this.fragment.rendered)return g("ractive.unrender() was called on a Ractive instance that was not rendered"),sc.resolve()
for(e=gc.start(this,!0),t=!this.component||this.component.shouldDestroy||this.shouldDestroy;this._animations[0];)this._animations[0].stop()
return this.fragment.unrender(t),B(this.el.__ractive_instances__,this),Ny.fire(this),gc.end(),e}function Vs(e){var t
return e=E(e)||$a,t=gc.start(this,!0),this.viewmodel.mark(e),gc.end(),Py.fire(this,e),t}function Hs(e,t){var r,n,i
if("string"!=typeof e||t){i=[]
for(n in this._twowayBindings)(!e||E(n).equalsOrStartsWith(e))&&i.push.apply(i,this._twowayBindings[n])}else i=this._twowayBindings[e]
return r=Ws(this,i),this.set(r)}function Ws(e,t){var r={},n=[]
return t.forEach(function(e){var t,i
if(!e.radioName||e.element.node.checked){if(e.checkboxName)return void(n[e.keypath.str]||e.changed()||(n.push(e.keypath),n[e.keypath.str]=e))
t=e.attribute.value,i=e.getValue(),R(t,i)||a(t,i)||(r[e.keypath.str]=i)}}),n.length&&n.forEach(function(e){var t,i,o
t=n[e.str],i=t.attribute.value,o=t.getValue(),R(i,o)||(r[e.str]=o)}),r}function Gs(e,t){return"function"==typeof t&&/_super/.test(e)}function $s(e){for(var t={};e;)Ks(e,t),Zs(e,t),e=e._Parent!==Gy?e._Parent:!1
return t}function Ks(e,t){mp.forEach(function(r){Ys(r.useDefaults?e.prototype:e,t,r.name)})}function Ys(e,t,r){var n,i=Object.keys(e[r])
i.length&&((n=t[r])||(n=t[r]={}),i.filter(function(e){return!(e in n)}).forEach(function(t){return n[t]=e[r][t]}))}function Zs(e,t){Object.keys(e.prototype).forEach(function(r){if("computed"!==r){var n=e.prototype[r]
if(r in t){if("function"==typeof t[r]&&"function"==typeof n&&t[r]._method){var i=void 0,o=n._method
o&&(n=n._method),i=Fy(t[r]._method,n),o&&(i._method=i),t[r]=i}}else t[r]=n._method?n._method:n}})}function Js(){for(var e=arguments.length,t=Array(e),r=0;e>r;r++)t[r]=arguments[r]
return t.length?t.reduce(Qs,this):Qs(this)}function Qs(e){var t,r,i=void 0===arguments[1]?{}:arguments[1]
return i.prototype instanceof Gy&&(i=zy(i)),t=function(e){return this instanceof t?void Vb(this,e):new t(e)},r=wa(e.prototype),r.constructor=t,ka(t,{defaults:{value:r},extend:{value:Js,writable:!0,configurable:!0},_Parent:{value:e}}),yp.extend(e,r,i),Fu.extend(e,r,i),i.computed&&(r.computed=n(wa(e.prototype.computed),i.computed)),t.prototype=r,t}var Xs,ea,ta,ra,na,ia,oa,sa=3,aa={el:void 0,append:!1,template:{v:sa,t:[]},preserveWhitespace:!1,sanitize:!1,stripComments:!0,delimiters:["{{","}}"],tripleDelimiters:["{{{","}}}"],interpolate:!1,data:{},computed:{},magic:!1,modifyArrays:!0,adapt:[],isolated:!1,twoway:!0,lazy:!1,noIntro:!1,transitionsEnabled:!0,complete:void 0,css:null,noCssTransform:!1},ca=aa,ua={linear:function(e){return e},easeIn:function(e){return Math.pow(e,3)},easeOut:function(e){return Math.pow(e-1,3)+1},easeInOut:function(e){return(e/=.5)<1?.5*Math.pow(e,3):.5*(Math.pow(e-2,3)+2)}}
Xs="object"==typeof document,ea="undefined"!=typeof navigator&&/jsDom/.test(navigator.appName),ta="undefined"!=typeof console&&"function"==typeof console.warn&&"function"==typeof console.warn.apply
try{Object.defineProperty({},"test",{value:0}),ra=!0}catch(la){ra=!1}na={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg",xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"},ia="undefined"==typeof document?!1:document&&document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1"),oa=["o","ms","moz","webkit"]
var ha,fa,pa,da,ga,ma,va,ba,ya
if(ha=ia?function(e,t){return t&&t!==na.html?document.createElementNS(t,e):document.createElement(e)}:function(e,t){if(t&&t!==na.html)throw"This browser does not support namespaces other than http://www.w3.org/1999/xhtml. The most likely cause of this error is that you're trying to render SVG in an older browser. See http://docs.ractivejs.org/latest/svg-and-older-browsers for more information"
return document.createElement(e)},Xs){for(pa=ha("div"),da=["matches","matchesSelector"],ya=function(e){return function(t,r){return t[e](r)}},va=da.length;va--&&!fa;)if(ga=da[va],pa[ga])fa=ya(ga)
else for(ba=oa.length;ba--;)if(ma=oa[va]+ga.substr(0,1).toUpperCase()+ga.substring(1),pa[ma]){fa=ya(ma)
break}fa||(fa=function(e,t){var r,n,i
for(n=e.parentNode,n||(pa.innerHTML="",n=pa,e=e.cloneNode(),pa.appendChild(e)),r=n.querySelectorAll(t),i=r.length;i--;)if(r[i]===e)return!0
return!1})}else fa=null
var wa,_a,ka,xa=null
try{Object.defineProperty({},"test",{value:0}),Xs&&Object.defineProperty(document.createElement("div"),"test",{value:0}),_a=Object.defineProperty}catch(Ea){_a=function(e,t,r){e[t]=r.value}}try{try{Object.defineProperties({},{test:{value:0}})}catch(Ea){throw Ea}Xs&&Object.defineProperties(ha("div"),{test:{value:0}}),ka=Object.defineProperties}catch(Ea){ka=function(e,t){var r
for(r in t)t.hasOwnProperty(r)&&_a(e,r,t[r])}}try{Object.create(null),wa=Object.create}catch(Ea){wa=function(){var e=function(){}
return function(t,r){var n
return null===t?{}:(e.prototype=t,n=new e,r&&Object.defineProperties(n,r),n)}}()}var Aa,Sa,Ca,Ta=Object.prototype.hasOwnProperty,qa=Object.prototype.toString,ja=/^\[object (?:Array|FileList)\]$/,Oa=function(){},La={}
ta?!function(){var e=["%cRactive.js %c0.7.3 %cin debug mode, %cmore...","color: rgb(114, 157, 52); font-weight: normal;","color: rgb(85, 85, 85); font-weight: normal;","color: rgb(85, 85, 85); font-weight: normal;","color: rgb(82, 140, 224); font-weight: normal; text-decoration: underline;"],t="You're running Ractive 0.7.3 in debug mode - messages will be printed to the console to help you fix problems and optimise your application.\n\nTo disable debug mode, add this line at the start of your app:\n  Ractive.DEBUG = false;\n\nTo disable debug mode when your app is minified, add this snippet:\n  Ractive.DEBUG = /unminified/.test(function(){/*unminified*/});\n\nGet help and support:\n  http://docs.ractivejs.org\n  http://stackoverflow.com/questions/tagged/ractivejs\n  http://groups.google.com/forum/#!forum/ractive-js\n  http://twitter.com/ractivejs\n\nFound a bug? Raise an issue:\n  https://github.com/ractivejs/ractive/issues\n\n"
Ca=function(){var r=!!console.groupCollapsed
console[r?"groupCollapsed":"log"].apply(console,e),console.log(t),r&&console.groupEnd(e),Ca=Oa},Sa=function(e,t){if(Ca(),"object"==typeof t[t.length-1]){var r=t.pop(),n=r?r.ractive:null
if(n){var i=void 0
n.component&&(i=n.component.name)&&(e="<"+i+"> "+e)
var o=void 0;(o=r.node||n.fragment&&n.fragment.rendered&&n.find("*"))&&t.push(o)}}console.warn.apply(console,["%cRactive.js: %c"+e,"color: rgb(114, 157, 52);","color: rgb(85, 85, 85);"].concat(t))},Aa=function(){console.log.apply(console,arguments)}}():Sa=Aa=Ca=Oa
var Ra="Bad arguments",Ia='A function was specified for "%s" %s, but no %s was returned',Na=function(e,t){return'Missing "'+e+'" '+t+" plugin. You may need to download a plugin via http://docs.ractivejs.org/latest/plugins#"+t+"s"},Ba=function(e,t,r,n){if(e===t)return y(t)
if(n){var i=v("interpolators",r,n)
if(i)return i(e,t)||y(t)
h(Na(n,"interpolator"))}return Ma.number(e,t)||Ma.array(e,t)||Ma.object(e,t)||y(t)},Da=Ba,Pa={number:function(e,t){var r
return c(e)&&c(t)?(e=+e,t=+t,r=t-e,r?function(t){return e+t*r}:function(){return e}):null},array:function(e,t){var r,n,i,s
if(!o(e)||!o(t))return null
for(r=[],n=[],s=i=Math.min(e.length,t.length);s--;)n[s]=Da(e[s],t[s])
for(s=i;s<e.length;s+=1)r[s]=e[s]
for(s=i;s<t.length;s+=1)r[s]=t[s]
return function(e){for(var t=i;t--;)r[t]=n[t](e)
return r}},object:function(e,t){var r,n,i,o,s
if(!u(e)||!u(t))return null
r=[],o={},i={}
for(s in e)Ta.call(e,s)&&(Ta.call(t,s)?(r.push(s),i[s]=Da(e[s],t[s])):o[s]=e[s])
for(s in t)Ta.call(t,s)&&!Ta.call(e,s)&&(o[s]=t[s])
return n=r.length,function(e){for(var t,s=n;s--;)t=r[s],o[t]=i[t](e)
return o}}},Ma=Pa,Ua=w,Fa={},za=/\[\s*(\*|[0-9]|[1-9][0-9]+)\s*\]/g,Va=/\*/,Ha={},Wa=function(e){var t=e.split(".")
this.str=e,"@"===e[0]&&(this.isSpecial=!0,this.value=x(e)),this.firstKey=t[0],this.lastKey=t.pop(),this.isPattern=Va.test(e),this.parent=""===e?null:E(t.join(".")),this.isRoot=!e}
Wa.prototype={equalsOrStartsWith:function(e){return e===this||this.startsWith(e)},join:function(e){return E(this.isRoot?String(e):this.str+"."+e)},replace:function(e,t){return this===e?t:this.startsWith(e)?null===t?t:E(this.str.replace(e.str+".",t.str+".")):void 0},startsWith:function(e){return e?e&&this.str.substr(0,e.str.length+1)===e.str+".":!1},toString:function(){throw new Error("Bad coercion")},valueOf:function(){throw new Error("Bad coercion")},wildcardMatches:function(){return this._wildcardMatches||(this._wildcardMatches=Ua(this.str))}}
var Ga,$a=E(""),Ka=T,Ya="Cannot add to a non-numeric value",Za=q
"undefined"==typeof window?Ga=null:(!function(e,t,r){var n,i
if(!r.requestAnimationFrame){for(n=0;n<e.length&&!r.requestAnimationFrame;++n)r.requestAnimationFrame=r[e[n]+"RequestAnimationFrame"]
r.requestAnimationFrame||(i=r.setTimeout,r.requestAnimationFrame=function(e){var r,n,o
return r=Date.now(),n=Math.max(0,16-(r-t)),o=i(function(){e(r+n)},n),t=r+n,o})}}(oa,0,window),Ga=window.requestAnimationFrame)
var Ja,Qa=Ga
Ja="undefined"!=typeof window&&window.performance&&"function"==typeof window.performance.now?function(){return window.performance.now()}:function(){return Date.now()}
var Xa=Ja,ec={construct:{deprecated:"beforeInit",replacement:"onconstruct"},render:{deprecated:"init",message:'The "init" method has been deprecated and will likely be removed in a future release. You can either use the "oninit" method which will fire only once prior to, and regardless of, any eventual ractive instance being rendered, or if you need to access the rendered DOM, use "onrender" instead. See http://docs.ractivejs.org/latest/migrating for more information.'},complete:{deprecated:"complete",replacement:"oncomplete"}}
j.prototype.fire=function(e,t){function r(r){return e[r]?(t?e[r](t):e[r](),!0):void 0}r(this.method),!e[this.method]&&this.deprecate&&r(this.deprecate.deprecated)&&(this.deprecate.message?g(this.deprecate.message):g('The method "%s" has been deprecated in favor of "%s" and will likely be removed in a future release. See http://docs.ractivejs.org/latest/migrating for more information.',this.deprecate.deprecated,this.deprecate.replacement)),t?e.fire(this.event,t):e.fire(this.event)}
var tc,rc=j,nc={},ic={},oc={}
"function"==typeof Promise?tc=Promise:(tc=function(e){var t,r,n,i,o,s,a=[],c=[],u=nc
n=function(e){return function(n){u===nc&&(t=n,u=e,r=M(u===ic?a:c,t),P(r))}},i=n(ic),o=n(oc)
try{e(i,o)}catch(l){o(l)}return s={then:function(e,t){var n=new tc(function(i,o){var s=function(e,t,r){"function"==typeof e?t.push(function(t){var r
try{r=e(t),U(n,r,i,o)}catch(s){o(s)}}):t.push(r)}
s(e,a,i),s(t,c,o),u!==nc&&P(r)})
return n}},s["catch"]=function(e){return this.then(null,e)},s},tc.all=function(e){return new tc(function(t,r){var n,i,o,s=[]
if(!e.length)return void t(s)
for(o=function(e,i){e&&"function"==typeof e.then?e.then(function(e){s[i]=e,--n||t(s)},r):(s[i]=e,--n||t(s))},n=i=e.length;i--;)o(e[i],i)})},tc.resolve=function(e){return new tc(function(t){t(e)})},tc.reject=function(e){return new tc(function(t,r){r(e)})})
var sc=tc,ac=function(e){do if(void 0!==e.context)return e.context
while(e=e.parent)
return $a},cc=F,uc=function(e,t){this.callback=e,this.parent=t,this.intros=[],this.outros=[],this.children=[],this.totalChildren=this.outroChildren=0,this.detachQueue=[],this.decoratorQueue=[],this.outrosComplete=!1,t&&t.addChild(this)}
uc.prototype={addChild:function(e){this.children.push(e),this.totalChildren+=1,this.outroChildren+=1},decrementOutros:function(){this.outroChildren-=1,Q(this)},decrementTotal:function(){this.totalChildren-=1,Q(this)},add:function(e){var t=e.isIntro?this.intros:this.outros
t.push(e)},addDecorator:function(e){this.decoratorQueue.push(e)},remove:function(e){var t=e.isIntro?this.intros:this.outros
B(t,e),Q(this)},init:function(){this.ready=!0,Q(this)},detachNodes:function(){this.decoratorQueue.forEach(G),this.detachQueue.forEach(Z),this.children.forEach(J)}}
var lc,hc,fc=uc,pc=[],dc=new rc("change")
hc={start:function(e,t){var r,n
return t&&(r=new sc(function(e){return n=e})),lc={previousBatch:lc,transitionManager:new fc(n,lc&&lc.transitionManager),views:[],tasks:[],ractives:[],instance:e},e&&lc.ractives.push(e),r},end:function(){X(),lc.transitionManager.init(),!lc.previousBatch&&lc.instance&&(lc.instance.viewmodel.changes=[]),lc=lc.previousBatch},addRactive:function(e){lc&&O(lc.ractives,e)},registerTransition:function(e){e._manager=lc.transitionManager,lc.transitionManager.add(e)},registerDecorator:function(e){lc.transitionManager.addDecorator(e)},addView:function(e){lc.views.push(e)},addUnresolved:function(e){pc.push(e)},removeUnresolved:function(e){B(pc,e)},detachWhenReady:function(e){lc.transitionManager.detachQueue.push(e)},scheduleTask:function(e,t){var r
if(lc){for(r=lc;t&&r.previousBatch;)r=r.previousBatch
r.tasks.push(e)}else e()}}
var gc=hc,mc=[],vc={tick:function(){var e,t,r
for(r=Xa(),gc.start(),e=0;e<mc.length;e+=1)t=mc[e],t.tick(r)||mc.splice(e--,1)
gc.end(),mc.length?Qa(vc.tick):vc.running=!1},add:function(e){mc.push(e),vc.running||(vc.running=!0,Qa(vc.tick))},abort:function(e,t){for(var r,n=mc.length;n--;)r=mc[n],r.root===t&&r.keypath===e&&r.stop()}},bc=vc,yc=function(e){var t
this.startTime=Date.now()
for(t in e)e.hasOwnProperty(t)&&(this[t]=e[t])
this.interpolator=Da(this.from,this.to,this.root,this.interpolator),this.running=!0,this.tick()}
yc.prototype={tick:function(){var e,t,r,n,i,o
return o=this.keypath,this.running?(n=Date.now(),e=n-this.startTime,e>=this.duration?(null!==o&&(gc.start(this.root),this.root.viewmodel.set(o,this.to),gc.end()),this.step&&this.step(1,this.to),this.complete(this.to),i=this.root._animations.indexOf(this),-1===i&&g("Animation was not found"),this.root._animations.splice(i,1),this.running=!1,!1):(t=this.easing?this.easing(e/this.duration):e/this.duration,null!==o&&(r=this.interpolator(t),gc.start(this.root),this.root.viewmodel.set(o,r),gc.end()),this.step&&this.step(t,r),!0)):!1},stop:function(){var e
this.running=!1,e=this.root._animations.indexOf(this),-1===e&&g("Animation was not found"),this.root._animations.splice(e,1)}}
var wc=yc,_c=re,kc={stop:Oa},xc=ie,Ec=new rc("detach"),Ac=oe,Sc=se,Cc=function(){var e,t,r
e=this._root[this._isComponentQuery?"liveComponentQueries":"liveQueries"],t=this.selector,r=e.indexOf(t),-1!==r&&(e.splice(r,1),e[t]=null)},Tc=function(e,t){var r,n,i,o,s,a,c,u,l,h
for(r=ce(e.component||e._ractive.proxy),n=ce(t.component||t._ractive.proxy),i=N(r),o=N(n);i&&i===o;)r.pop(),n.pop(),s=i,i=N(r),o=N(n)
if(i=i.component||i,o=o.component||o,l=i.parentFragment,h=o.parentFragment,l===h)return a=l.items.indexOf(i),c=h.items.indexOf(o),a-c||r.length-n.length
if(u=s.fragments)return a=u.indexOf(l),c=u.indexOf(h),a-c||r.length-n.length
throw new Error("An unexpected condition was met while comparing the position of two components. Please file an issue at https://github.com/RactiveJS/Ractive/issues - thanks!")},qc=function(e,t){var r
return e.compareDocumentPosition?(r=e.compareDocumentPosition(t),2&r?1:-1):Tc(e,t)},jc=function(){this.sort(this._isComponentQuery?Tc:qc),this._dirty=!1},Oc=function(){var e=this
this._dirty||(this._dirty=!0,gc.scheduleTask(function(){e._sort()}))},Lc=function(e){var t=this.indexOf(this._isComponentQuery?e.instance:e);-1!==t&&this.splice(t,1)},Rc=ue,Ic=le,Nc=he,Bc=fe,Dc=pe,Pc=de,Mc={enqueue:function(e,t){e.event&&(e._eventQueue=e._eventQueue||[],e._eventQueue.push(e.event)),e.event=t},dequeue:function(e){e._eventQueue&&e._eventQueue.length?e.event=e._eventQueue.pop():delete e.event}},Uc=Mc,Fc=ge,zc=be,Vc=ye,Hc={capture:!0,noUnwrap:!0,fullRootGet:!0},Wc=we,Gc=new rc("insert"),$c=ke,Kc=function(e,t,r,n){this.root=e,this.keypath=t,this.callback=r,this.defer=n.defer,this.context=n&&n.context?n.context:e}
Kc.prototype={init:function(e){this.value=this.root.get(this.keypath.str),e!==!1?this.update():this.oldValue=this.value},setValue:function(e){var t=this
a(e,this.value)||(this.value=e,this.defer&&this.ready?gc.scheduleTask(function(){return t.update()}):this.update())},update:function(){this.updating||(this.updating=!0,this.callback.call(this.context,this.value,this.oldValue,this.keypath.str),this.oldValue=this.value,this.updating=!1)}}
var Yc,Zc=Kc,Jc=xe,Qc=Array.prototype.slice
Yc=function(e,t,r,n){this.root=e,this.callback=r,this.defer=n.defer,this.keypath=t,this.regex=new RegExp("^"+t.str.replace(/\./g,"\\.").replace(/\*/g,"([^\\.]+)")+"$"),this.values={},this.defer&&(this.proxies=[]),this.context=n&&n.context?n.context:e},Yc.prototype={init:function(e){var t,r
if(t=Jc(this.root,this.keypath),e!==!1)for(r in t)t.hasOwnProperty(r)&&this.update(E(r))
else this.values=t},update:function(e){var t,r=this
if(e.isPattern){t=Jc(this.root,e)
for(e in t)t.hasOwnProperty(e)&&this.update(E(e))}else if(!this.root.viewmodel.implicitChanges[e.str])return this.defer&&this.ready?void gc.scheduleTask(function(){return r.getProxy(e).update()}):void this.reallyUpdate(e)},reallyUpdate:function(e){var t,r,n,i
return t=e.str,r=this.root.viewmodel.get(e),this.updating?void(this.values[t]=r):(this.updating=!0,a(r,this.values[t])&&this.ready||(n=Qc.call(this.regex.exec(t),1),i=[r,this.values[t],t].concat(n),this.values[t]=r,this.callback.apply(this.context,i)),void(this.updating=!1))},getProxy:function(e){var t=this
return this.proxies[e.str]||(this.proxies[e.str]={update:function(){return t.reallyUpdate(e)}}),this.proxies[e.str]}}
var Xc,eu,tu,ru,nu,iu,ou=Yc,su=Ee,au={},cu=Ae,uu=Se,lu=function(e){return e.trim()},hu=function(e){return""!==e},fu=Ce,pu=Te,du=qe,gu=je,mu=Array.prototype,vu=function(e){return function(t){for(var r=arguments.length,n=Array(r>1?r-1:0),i=1;r>i;i++)n[i-1]=arguments[i]
var s,a,c,u,l=[]
if(t=E(C(t)),s=this.viewmodel.get(t),a=s.length,!o(s))throw new Error("Called ractive."+e+"('"+t.str+"'), but '"+t.str+"' does not refer to an array")
return l=gu(s,e,n),u=mu[e].apply(s,n),c=gc.start(this,!0).then(function(){return u}),l?this.viewmodel.smartUpdate(t,s,l):this.viewmodel.mark(t),gc.end(),c}},bu=vu("pop"),yu=vu("push"),wu="/* Ractive.js component styles */\n",_u=[],ku=!1
Xs?(tu=document.createElement("style"),tu.type="text/css",ru=document.getElementsByTagName("head")[0],iu=!1,nu=tu.styleSheet,eu=function(){var e=wu+_u.map(function(e){return"\n/* {"+e.id+"} */\n"+e.styles}).join("\n")
nu?nu.cssText=e:tu.innerHTML=e,iu||(ru.appendChild(tu),iu=!0)},Xc={add:function(e){_u.push(e),ku=!0},apply:function(){ku&&(eu(),ku=!1)}}):Xc={add:Oa,apply:Oa}
var xu,Eu,Au=Xc,Su=Le,Cu=new rc("render"),Tu=new rc("complete"),qu={extend:function(e,t,r){t.adapt=Ie(t.adapt,I(r.adapt))},init:function(){}},ju=qu,Ou=Ne,Lu=/(?:^|\})?\s*([^\{\}]+)\s*\{/g,Ru=/\/\*.*?\*\//g,Iu=/((?:(?:\[[^\]+]\])|(?:[^\s\+\>\~:]))+)((?::[^\s\+\>\~\(]+(?:\([^\)]+\))?)?\s*[\s\+\>\~]?)\s*/g,Nu=/^@media/,Bu=/\[data-ractive-css~="\{[a-z0-9-]+\}"]/g,Du=1,Pu={name:"css",extend:function(e,t,r){if(r.css){var n=Du++,i=r.noCssTransform?r.css:Ou(r.css,n)
t.cssId=n,Au.add({id:n,styles:i})}},init:function(){}},Mu=Pu,Uu={name:"data",extend:function(e,t,r){var n=void 0,i=void 0
if(r.data&&u(r.data))for(n in r.data)i=r.data[n],i&&"object"==typeof i&&(u(i)||o(i))&&g("Passing a `data` option with object and array properties to Ractive.extend() is discouraged, as mutating them is likely to cause bugs. Consider using a data function instead:\n\n  // this...\n  data: function () {\n    return {\n      myObject: {}\n    };\n  })\n\n  // instead of this:\n  data: {\n    myObject: {}\n  }")
t.data=Me(t.data,r.data)},init:function(e,t,r){var n=Me(e.prototype.data,r.data)
return"function"==typeof n&&(n=n.call(t)),n||{}},reset:function(e){var t=this.init(e.constructor,e,e.viewmodel)
return e.viewmodel.reset(t),!0}},Fu=Uu,zu=/^\s+/
Eu=function(e){this.name="ParseError",this.message=e
try{throw new Error(e)}catch(t){this.stack=t.stack}},Eu.prototype=Error.prototype,xu=function(e,t){var r,n,i=0
for(this.str=e,this.options=t||{},this.pos=0,this.lines=this.str.split("\n"),this.lineEnds=this.lines.map(function(e){var t=i+e.length+1
return i=t,t},0),this.init&&this.init(e,t),r=[];this.pos<this.str.length&&(n=this.read());)r.push(n)
this.leftover=this.remaining(),this.result=this.postProcess?this.postProcess(r,t):r},xu.prototype={read:function(e){var t,r,n,i
for(e||(e=this.converters),t=this.pos,n=e.length,r=0;n>r;r+=1)if(this.pos=t,i=e[r](this))return i
return null},getLinePos:function(e){for(var t,r=0,n=0;e>=this.lineEnds[r];)n=this.lineEnds[r],r+=1
return t=e-n,[r+1,t+1,e]},error:function(e){var t=this.getLinePos(this.pos),r=t[0],n=t[1],i=this.lines[t[0]-1],o=0,s=i.replace(/\t/g,function(e,r){return r<t[1]&&(o+=1),"  "})+"\n"+new Array(t[1]+o).join(" ")+"^----",a=new Eu(""+e+" at line "+r+" character "+n+":\n"+s)
throw a.line=t[0],a.character=t[1],a.shortMessage=e,a},matchString:function(e){return this.str.substr(this.pos,e.length)===e?(this.pos+=e.length,e):void 0},matchPattern:function(e){var t
return(t=e.exec(this.remaining()))?(this.pos+=t[0].length,t[1]||t[0]):void 0},allowWhitespace:function(){this.matchPattern(zu)},remaining:function(){return this.str.substring(this.pos)},nextChar:function(){return this.str.charAt(this.pos)}},xu.extend=function(e){var t,r,n=this
t=function(e,t){xu.call(this,e,t)},t.prototype=wa(n.prototype)
for(r in e)Ta.call(e,r)&&(t.prototype[r]=e[r])
return t.extend=xu.extend,t}
var Vu,Hu,Wu,Gu=xu,$u=1,Ku=2,Yu=3,Zu=4,Ju=5,Qu=6,Xu=7,el=8,tl=9,rl=10,nl=13,il=14,ol=15,sl=16,al=17,cl=18,ul=20,ll=21,hl=22,fl=23,pl=24,dl=25,gl=26,ml=27,vl=30,bl=31,yl=32,wl=33,_l=34,kl=35,xl=36,El=40,Al=50,Sl=51,Cl=52,Tl=53,ql=54,jl=60,Ol=61,Ll=ze,Rl=/^[^\s=]+/,Il=/^\s+/,Nl=Ve,Bl=/^(\/(?:[^\n\r\u2028\u2029\/\\[]|\\.|\[(?:[^\n\r\u2028\u2029\]\\]|\\.)*])+\/(?:([gimuy])(?![a-z]*\2))*(?![a-zA-Z_$0-9]))/,Dl=He,Pl={t:rl,exclude:!0},Ml="Expected a JavaScript expression",Ul="Expected closing paren",Fl=Ge,zl=/^(?:[+-]?)0*(?:(?:(?:[1-9]\d*)?\.\d+)|(?:(?:0|[1-9]\d*)\.)|(?:0|[1-9]\d*))(?:[eE][+-]?\d+)?/,Vl=$e
Vu=/^(?=.)[^"'\\]+?(?:(?!.)|(?=["'\\]))/,Hu=/^\\(?:['"\\bfnrt]|0(?![0-9])|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|(?=.)[^ux0-9])/,Wu=/^\\(?:\r\n|[\u000A\u000D\u2028\u2029])/
var Hl,Wl,Gl=function(e){return function(t){var r,n,i,o
for(r=t.pos,n='"',i=!1;!i;)o=t.matchPattern(Vu)||t.matchPattern(Hu)||t.matchString(e),o?n+='"'===o?'\\"':"\\'"===o?"'":o:(o=t.matchPattern(Wu),o?n+="\\u"+("000"+o.charCodeAt(1).toString(16)).slice(-4):i=!0)
return n+='"',JSON.parse(n)}},$l=Gl('"'),Kl=Gl("'"),Yl=function(e){var t,r
return t=e.pos,e.matchString('"')?(r=Kl(e),e.matchString('"')?{t:ll,v:r}:(e.pos=t,null)):e.matchString("'")?(r=$l(e),e.matchString("'")?{t:ll,v:r}:(e.pos=t,null)):null},Zl=/^[a-zA-Z_$][a-zA-Z_$0-9]*/,Jl=Ke,Ql=/^[a-zA-Z_$][a-zA-Z_$0-9]*$/,Xl=Ye,eh=Ze,th=function(e){var t,r
return t=e.pos,e.allowWhitespace(),e.matchString("{")?(r=eh(e),e.allowWhitespace(),e.matchString("}")?{t:fl,m:r}:(e.pos=t,null)):(e.pos=t,null)},rh=Je,nh=function(e){var t,r
return t=e.pos,e.allowWhitespace(),e.matchString("[")?(r=rh(e),e.matchString("]")?{t:hl,m:r}:(e.pos=t,null)):(e.pos=t,null)},ih=Qe,oh=Xe,sh=/^(?:~\/|(?:\.\.\/)+|\.\/(?:\.\.\/)*|\.)/
Hl=/^(?:Array|console|Date|RegExp|decodeURIComponent|decodeURI|encodeURIComponent|encodeURI|isFinite|isNaN|parseFloat|parseInt|JSON|Math|NaN|undefined|null)\b/,Wl=/^(?:break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|var|void|while|with)$/
var ah,ch,uh=/^[a-zA-Z$_0-9]+(?:(?:\.[a-zA-Z$_0-9]+)|(?:\[[0-9]+\]))*/,lh=/^[a-zA-Z_$][-a-zA-Z_$0-9]*/,hh=et,fh=function(e){return ih(e)||oh(e)||hh(e)},ph=tt,dh=function(e){var t,r,n,i
if(r=fh(e),!r)return null
for(;r;)if(t=e.pos,n=ph(e))r={t:yl,x:r,r:n}
else{if(!e.matchString("("))break
e.allowWhitespace(),i=rh(e),e.allowWhitespace(),e.matchString(")")||e.error(Ul),r={t:El,x:r},i&&(r.o=i)}return r}
ch=function(e,t){return function(r){var n
return(n=t(r))?n:r.matchString(e)?(r.allowWhitespace(),n=Th(r),n||r.error(Ml),{s:e,o:n,t:wl}):null}},function(){var e,t,r,n,i
for(n="! ~ + - typeof".split(" "),i=dh,e=0,t=n.length;t>e;e+=1)r=ch(n[e],i),i=r
ah=i}()
var gh,mh,vh=ah
mh=function(e,t){return function(r){var n,i,o
if(i=t(r),!i)return null
for(;;){if(n=r.pos,r.allowWhitespace(),!r.matchString(e))return r.pos=n,i
if("in"===e&&/[a-zA-Z_$0-9]/.test(r.remaining().charAt(0)))return r.pos=n,i
if(r.allowWhitespace(),o=t(r),!o)return r.pos=n,i
i={t:xl,s:e,o:[i,o]}}}},function(){var e,t,r,n,i
for(n="* / % + - << >> >>> < <= > >= in instanceof == != === !== & ^ | && ||".split(" "),i=vh,e=0,t=n.length;t>e;e+=1)r=mh(n[e],i),i=r
gh=i}()
var bh,yh,wh,_h,kh,xh,Eh,Ah,Sh=gh,Ch=rt,Th=nt,qh=it,jh=st,Oh=/^[0-9][1-9]*$/,Lh=ct,Rh=ut,Ih=lt,Nh=ht,Bh=ft,Dh=pt,Ph=dt,Mh=/^yield\s*/,Uh=gt,Fh=mt,zh=/^\s*else\s*/,Vh=vt,Hh=/^\s*elseif\s+/,Wh={each:Cl,"if":Al,"if-with":ql,"with":Tl,unless:Sl},Gh=bt,$h=/^\s*:\s*([a-zA-Z_$][a-zA-Z_$0-9]*)/,Kh=/^\s*,\s*([a-zA-Z_$][a-zA-Z_$0-9]*)/,Yh=new RegExp("^("+Object.keys(Wh).join("|")+")\\b"),Zh=xt,Jh="<!--",Qh="-->"
bh=/^(allowFullscreen|async|autofocus|autoplay|checked|compact|controls|declare|default|defaultChecked|defaultMuted|defaultSelected|defer|disabled|enabled|formNoValidate|hidden|indeterminate|inert|isMap|itemScope|loop|multiple|muted|noHref|noResize|noShade|noValidate|noWrap|open|pauseOnExit|readOnly|required|reversed|scoped|seamless|selected|sortable|translate|trueSpeed|typeMustMatch|visible)$/i,yh=/^(?:area|base|br|col|command|doctype|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i,wh={quot:34,amp:38,apos:39,lt:60,gt:62,nbsp:160,iexcl:161,cent:162,pound:163,curren:164,yen:165,brvbar:166,sect:167,uml:168,copy:169,ordf:170,laquo:171,not:172,shy:173,reg:174,macr:175,deg:176,plusmn:177,sup2:178,sup3:179,acute:180,micro:181,para:182,middot:183,cedil:184,sup1:185,ordm:186,raquo:187,frac14:188,frac12:189,frac34:190,iquest:191,Agrave:192,Aacute:193,Acirc:194,Atilde:195,Auml:196,Aring:197,AElig:198,Ccedil:199,Egrave:200,Eacute:201,Ecirc:202,Euml:203,Igrave:204,Iacute:205,Icirc:206,Iuml:207,ETH:208,Ntilde:209,Ograve:210,Oacute:211,Ocirc:212,Otilde:213,Ouml:214,times:215,Oslash:216,Ugrave:217,Uacute:218,Ucirc:219,Uuml:220,Yacute:221,THORN:222,szlig:223,agrave:224,aacute:225,acirc:226,atilde:227,auml:228,aring:229,aelig:230,ccedil:231,egrave:232,eacute:233,ecirc:234,euml:235,igrave:236,iacute:237,icirc:238,iuml:239,eth:240,ntilde:241,ograve:242,oacute:243,ocirc:244,otilde:245,ouml:246,divide:247,oslash:248,ugrave:249,uacute:250,ucirc:251,uuml:252,yacute:253,thorn:254,yuml:255,OElig:338,oelig:339,Scaron:352,scaron:353,Yuml:376,fnof:402,circ:710,tilde:732,Alpha:913,Beta:914,Gamma:915,Delta:916,Epsilon:917,Zeta:918,Eta:919,Theta:920,Iota:921,Kappa:922,Lambda:923,Mu:924,Nu:925,Xi:926,Omicron:927,Pi:928,Rho:929,Sigma:931,Tau:932,Upsilon:933,Phi:934,Chi:935,Psi:936,Omega:937,alpha:945,beta:946,gamma:947,delta:948,epsilon:949,zeta:950,eta:951,theta:952,iota:953,kappa:954,lambda:955,mu:956,nu:957,xi:958,omicron:959,pi:960,rho:961,sigmaf:962,sigma:963,tau:964,upsilon:965,phi:966,chi:967,psi:968,omega:969,thetasym:977,upsih:978,piv:982,ensp:8194,emsp:8195,thinsp:8201,zwnj:8204,zwj:8205,lrm:8206,rlm:8207,ndash:8211,mdash:8212,lsquo:8216,rsquo:8217,sbquo:8218,ldquo:8220,rdquo:8221,bdquo:8222,dagger:8224,Dagger:8225,bull:8226,hellip:8230,permil:8240,prime:8242,Prime:8243,lsaquo:8249,rsaquo:8250,oline:8254,frasl:8260,euro:8364,image:8465,weierp:8472,real:8476,trade:8482,alefsym:8501,larr:8592,uarr:8593,rarr:8594,darr:8595,harr:8596,crarr:8629,lArr:8656,uArr:8657,rArr:8658,dArr:8659,hArr:8660,forall:8704,part:8706,exist:8707,empty:8709,nabla:8711,isin:8712,notin:8713,ni:8715,prod:8719,sum:8721,minus:8722,lowast:8727,radic:8730,prop:8733,infin:8734,ang:8736,and:8743,or:8744,cap:8745,cup:8746,"int":8747,there4:8756,sim:8764,cong:8773,asymp:8776,ne:8800,equiv:8801,le:8804,ge:8805,sub:8834,sup:8835,nsub:8836,sube:8838,supe:8839,oplus:8853,otimes:8855,perp:8869,sdot:8901,lceil:8968,rceil:8969,lfloor:8970,rfloor:8971,lang:9001,rang:9002,loz:9674,spades:9824,clubs:9827,hearts:9829,diams:9830},_h=[8364,129,8218,402,8222,8230,8224,8225,710,8240,352,8249,338,141,381,143,144,8216,8217,8220,8221,8226,8211,8212,732,8482,353,8250,339,157,382,376],kh=new RegExp("&(#?(?:x[\\w\\d]+|\\d+|"+Object.keys(wh).join("|")+"));?","g"),xh=/</g,Eh=/>/g,Ah=/&/g
var Xh,ef,tf,rf,nf,of,sf,af=/^\s*\r?\n/,cf=/\r?\n\s*$/,uf=function(e){var t,r,n,i,o
for(t=1;t<e.length;t+=1)r=e[t],n=e[t-1],i=e[t-2],Ct(r)&&Tt(n)&&Ct(i)&&cf.test(i)&&af.test(r)&&(e[t-2]=i.replace(cf,"\n"),e[t]=r.replace(af,"")),qt(r)&&Ct(n)&&cf.test(n)&&Ct(r.f[0])&&af.test(r.f[0])&&(e[t-1]=n.replace(cf,"\n"),r.f[0]=r.f[0].replace(af,"")),Ct(r)&&qt(n)&&(o=N(n.f),Ct(o)&&cf.test(o)&&af.test(r)&&(n.f[n.f.length-1]=o.replace(cf,"\n"),e[t]=r.replace(af,"")))
return e},lf=function(e,t,r){var n
t&&(n=e[0],"string"==typeof n&&(n=n.replace(t,""),n?e[0]=n:e.shift())),r&&(n=N(e),"string"==typeof n&&(n=n.replace(r,""),n?e[e.length-1]=n:e.pop()))},hf=jt,ff=/[ \t\f\r\n]+/g,pf=/^(?:pre|script|style|textarea)$/i,df=/^[ \t\f\r\n]+/,gf=/[ \t\f\r\n]+$/,mf=/^(?:\r\n|\r|\n)/,vf=/(?:\r\n|\r|\n)$/,bf=Ot,yf=/^([a-zA-Z]{1,}:?[a-zA-Z0-9\-]*)\s*\>/,wf=function(e,t){var r,n,i
for(r=t.length;r--;){if(n=e.indexOf(t[r]),!n)return 0;-1!==n&&(!i||i>n)&&(i=n)}return i||-1},_f=Lt,kf=/^[^\s"'>\/=]+/,xf=/^[^\s"'=<>`]+/
ef={"true":!0,"false":!1,undefined:void 0,"null":null},tf=new RegExp("^(?:"+Object.keys(ef).join("|")+")"),rf=/^(?:[+-]?)(?:(?:(?:0|[1-9]\d*)?\.\d+)|(?:(?:0|[1-9]\d*)\.)|(?:0|[1-9]\d*))(?:[eE][+-]?\d+)?/,nf=/\$\{([^\}]+)\}/g,of=/^\$\{([^\}]+)\}/,sf=/^\s*$/,Xh=Gu.extend({init:function(e,t){this.values=t.values,this.allowWhitespace()},postProcess:function(e){return 1===e.length&&sf.test(this.leftover)?{value:e[0].v}:null},converters:[function(e){var t
return e.values?(t=e.matchPattern(of),t&&e.values.hasOwnProperty(t)?{v:e.values[t]}:void 0):null},function(e){var t
return(t=e.matchPattern(tf))?{v:ef[t]}:void 0},function(e){var t
return(t=e.matchPattern(rf))?{v:+t}:void 0},function(e){var t,r=Yl(e)
return r&&(t=e.values)?{v:r.v.replace(nf,function(e,r){return r in t?t[r]:r})}:r},function(e){var t,r
if(!e.matchString("{"))return null
if(t={},e.allowWhitespace(),e.matchString("}"))return{v:t}
for(;r=Pt(e);){if(t[r.key]=r.value,e.allowWhitespace(),e.matchString("}"))return{v:t}
if(!e.matchString(","))return null}return null},function(e){var t,r
if(!e.matchString("["))return null
if(t=[],e.allowWhitespace(),e.matchString("]"))return{v:t}
for(;r=e.read();){if(t.push(r.v),e.allowWhitespace(),e.matchString("]"))return{v:t}
if(!e.matchString(","))return null
e.allowWhitespace()}return null}]})
var Ef,Af=function(e,t){var r=new Xh(e,{values:t})
return r.result},Sf=Mt,Cf=/^([a-zA-Z_$][a-zA-Z_$0-9]*)\(/,Tf=/\)\s*$/
Ef=Gu.extend({converters:[Th]})
var qf,jf=/^[a-zA-Z]{1,}:?[a-zA-Z0-9\-]*/,Of=/^[\s\n\/>]/,Lf=/^on/,Rf=/^on-([a-zA-Z\\*\\.$_][a-zA-Z\\*\\.$_0-9\-]+)$/,If=/^(?:change|reset|teardown|update|construct|config|init|render|unrender|detach|insert)$/,Nf={"intro-outro":"t0",intro:"t1",outro:"t2",decorator:"o"},Bf={exclude:!0}
qf={li:["li"],dt:["dt","dd"],dd:["dt","dd"],p:"address article aside blockquote div dl fieldset footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol p pre section table ul".split(" "),rt:["rt","rp"],rp:["rt","rp"],optgroup:["optgroup"],option:["option","optgroup"],thead:["tbody","tfoot"],tbody:["tbody","tfoot"],tfoot:["tbody"],tr:["tr","tbody"],td:["td","th","tr"],th:["td","th","tr"]}
var Df,Pf=Ut,Mf=zt,Uf=Vt,Ff=/[-\/\\^$*+?.()|[\]{}]/g,zf=Ht,Vf=/^<!--\s*/,Hf=/s*>\s*([a-zA-Z_$][-a-zA-Z_$0-9]*)\s*/,Wf=/\s*-->/,Gf=Wt,$f=/^#\s*partial\s+/,Kf=Gt,Yf=$t,Zf=[Ih,Rh,Gh,Ph,Dh,Nh],Jf=[Lh],Qf=[Rh,Gh,Dh],Xf=void 0,ep=[Dl,Zh,Pf,Mf],tp=[zf,Gf]
Xf=Gu.extend({init:function(e,t){var r=t.tripleDelimiters||["{{{","}}}"],n=t.staticDelimiters||["[[","]]"],i=t.staticTripleDelimiters||["[[[","]]]"]
this.standardDelimiters=t.delimiters||["{{","}}"],this.tags=[{isStatic:!1,isTriple:!1,open:this.standardDelimiters[0],close:this.standardDelimiters[1],readers:Zf},{isStatic:!1,isTriple:!0,open:r[0],close:r[1],readers:Jf},{isStatic:!0,isTriple:!1,open:n[0],close:n[1],readers:Qf},{isStatic:!0,isTriple:!0,open:i[0],close:i[1],readers:Jf}],this.sortMustacheTags(),this.sectionDepth=0,this.elementStack=[],this.interpolate={script:!t.interpolate||t.interpolate.script!==!1,style:!t.interpolate||t.interpolate.style!==!1},t.sanitize===!0&&(t.sanitize={elements:"applet base basefont body frame frameset head html isindex link meta noframes noscript object param script style title".split(" "),eventAttributes:!0}),this.stripComments=t.stripComments!==!1,this.preserveWhitespace=t.preserveWhitespace,this.sanitizeElements=t.sanitize&&t.sanitize.elements,this.sanitizeEventAttributes=t.sanitize&&t.sanitize.eventAttributes,this.includeLinePositions=t.includeLinePositions},postProcess:function(e){return e.length?(this.sectionDepth>0&&this.error("A section was left open"),hf(e[0].t,this.stripComments,this.preserveWhitespace,!this.preserveWhitespace,!this.preserveWhitespace),e[0]):{t:[],v:sa}},converters:[Kf],sortMustacheTags:function(){this.tags.sort(function(e,t){return t.open.length-e.open.length})}})
var rp,np,ip,op=["preserveWhitespace","sanitize","stripComments","delimiters","tripleDelimiters","interpolate"],sp={fromId:Zt,isHashedId:Jt,isParsed:Qt,getParseOptions:Xt,createHelper:Kt,parse:Yt},ap=sp,cp={name:"template",extend:function(e,t,r){var n
"template"in r&&(n=r.template,"function"==typeof n?t.template=n:t.template=nr(n,t))},init:function(e,t,r){var n,i
n="template"in r?r.template:e.prototype.template,"function"==typeof n&&(i=n,n=tr(t,i),t._config.template={fn:i,result:n}),n=nr(n,t),t.template=n.t,n.p&&ir(t.partials,n.p)},reset:function(e){var t,r=er(e)
return r?(t=nr(r,e),e.template=t.t,ir(e.partials,t.p,!0),!0):void 0}},up=cp
rp=["adaptors","components","computed","decorators","easing","events","interpolators","partials","transitions"],np=function(e,t){this.name=e,this.useDefaults=t},np.prototype={constructor:np,extend:function(e,t,r){this.configure(this.useDefaults?e.defaults:e,this.useDefaults?t:t.constructor,r)},init:function(){},configure:function(e,t,r){var n,i=this.name,o=r[i]
n=wa(e[i])
for(var s in o)n[s]=o[s]
t[i]=n},reset:function(e){var t=e[this.name],r=!1
return Object.keys(t).forEach(function(e){var n=t[e]
n._fn&&(n._fn.isOwner?t[e]=n._fn:delete t[e],r=!0)}),r}},ip=rp.map(function(e){return new np(e,"computed"===e)})
var lp,hp,fp,pp,dp,gp,mp=ip,vp=or,bp=ur
pp={adapt:ju,css:Mu,data:Fu,template:up},fp=Object.keys(ca),gp=fr(fp.filter(function(e){return!pp[e]})),dp=fr(fp.concat(mp.map(function(e){return e.name}))),hp=[].concat(fp.filter(function(e){return!mp[e]&&!pp[e]}),mp,pp.data,pp.template,pp.css),lp={extend:function(e,t,r){return lr("extend",e,t,r)},init:function(e,t,r){return lr("init",e,t,r)},reset:function(e){return hp.filter(function(t){return t.reset&&t.reset(e)}).map(function(e){return e.name})},order:hp}
var yp=lp,wp=pr,_p=dr,kp=gr,xp=mr,Ep=vr,Ap=br,Sp=yr,Cp=wr,Tp=_r,qp=kr,jp=xr,Op=Er,Lp=function(){return t(this.node)},Rp=function(e){this.type=$u,this.text=e.template}
Rp.prototype={detach:Lp,firstNode:function(){return this.node},render:function(){return this.node||(this.node=document.createTextNode(this.text)),this.node},toString:function(e){return e?St(this.text):this.text},unrender:function(e){return e?this.detach():void 0}}
var Ip=Rp,Np=Ar,Bp=Sr,Dp=function(e,t,r){var n
this.ref=t,this.resolved=!1,this.root=e.root,this.parentFragment=e.parentFragment,this.callback=r,n=cc(e.root,t,e.parentFragment),void 0!=n?this.resolve(n):gc.addUnresolved(this)}
Dp.prototype={resolve:function(e){this.keypath&&!e&&gc.addUnresolved(this),this.resolved=!0,this.keypath=e,this.callback(e)},forceResolution:function(){this.resolve(E(this.ref))},rebind:function(e,t){var r
void 0!=this.keypath&&(r=this.keypath.replace(e,t),void 0!==r&&this.resolve(r))},unbind:function(){this.resolved||gc.removeUnresolved(this)}}
var Pp=Dp,Mp=function(e,t,r){this.parentFragment=e.parentFragment,this.ref=t,this.callback=r,this.rebind()},Up={"@keypath":{prefix:"c",prop:["context"]},"@index":{prefix:"i",prop:["index"]},"@key":{prefix:"k",prop:["key","index"]}}
Mp.prototype={rebind:function(){var e,t=this.ref,r=this.parentFragment,n=Up[t]
if(!n)throw new Error('Unknown special reference "'+t+'" - valid references are @index, @key and @keypath')
if(this.cached)return this.callback(E("@"+n.prefix+Cr(this.cached,n)))
if(-1!==n.prop.indexOf("index")||-1!==n.prop.indexOf("key"))for(;r;){if(r.owner.currentSubtype===Cl&&void 0!==(e=Cr(r,n)))return this.cached=r,r.registerIndexRef(this),this.callback(E("@"+n.prefix+e))
r=!r.parent&&r.owner&&r.owner.component&&r.owner.component.parentFragment&&!r.owner.component.instance.isolated?r.owner.component.parentFragment:r.parent}else for(;r;){if(void 0!==(e=Cr(r,n)))return this.callback(E("@"+n.prefix+e.str))
r=r.parent}},unbind:function(){this.cached&&this.cached.unregisterIndexRef(this)}}
var Fp=Mp,zp=function(e,t,r){this.parentFragment=e.parentFragment,this.ref=t,this.callback=r,t.ref.fragment.registerIndexRef(this),this.rebind()}
zp.prototype={rebind:function(){var e,t=this.ref.ref
e="k"===t.ref.t?"k"+t.fragment.key:"i"+t.fragment.index,void 0!==e&&this.callback(E("@"+e))},unbind:function(){this.ref.ref.fragment.unregisterIndexRef(this)}}
var Vp=zp,Hp=Tr
Tr.resolve=function(e){var t,r,n={}
for(t in e.refs)r=e.refs[t],n[r.ref.n]="k"===r.ref.t?r.fragment.key:r.fragment.index
return n}
var Wp,Gp=qr,$p=jr,Kp={},Yp=Function.prototype.bind
Wp=function(e,t,r,n){var i,o=this
i=e.root,this.root=i,this.parentFragment=t,this.callback=n,this.owner=e,this.str=r.s,this.keypaths=[],this.pending=r.r.length,this.refResolvers=r.r.map(function(e,t){return Gp(o,e,function(e){o.resolve(t,e)})}),this.ready=!0,this.bubble()},Wp.prototype={bubble:function(){this.ready&&(this.uniqueString=Lr(this.str,this.keypaths),this.keypath=Rr(this.uniqueString),this.createEvaluator(),this.callback(this.keypath))},unbind:function(){for(var e;e=this.refResolvers.pop();)e.unbind()},resolve:function(e,t){this.keypaths[e]=t,this.bubble()},createEvaluator:function(){var e,t,r,n,i,o=this
n=this.keypath,e=this.root.viewmodel.computations[n.str],e?this.root.viewmodel.mark(n):(i=$p(this.str,this.refResolvers.length),t=this.keypaths.map(function(e){var t
return"undefined"===e?function(){return void 0}:e.isSpecial?(t=e.value,function(){return t}):function(){var t=o.root.viewmodel.get(e,{noUnwrap:!0,fullRootGet:!0})
return"function"==typeof t&&(t=Nr(t,o.root)),t}}),r={deps:this.keypaths.filter(Ir),getter:function(){var e=t.map(Or)
return i.apply(null,e)}},e=this.root.viewmodel.compute(n,r))},rebind:function(e,t){this.refResolvers.forEach(function(r){return r.rebind(e,t)})}}
var Zp=Wp,Jp=function(e,t,r){var n=this
this.resolver=t,this.root=t.root,this.parentFragment=r,this.viewmodel=t.root.viewmodel,"string"==typeof e?this.value=e:e.t===vl?this.refResolver=Gp(this,e.n,function(e){n.resolve(e)}):new Zp(t,r,e,function(e){n.resolve(e)})}
Jp.prototype={resolve:function(e){this.keypath&&this.viewmodel.unregister(this.keypath,this),this.keypath=e,this.value=this.viewmodel.get(e),this.bind(),this.resolver.bubble()},bind:function(){this.viewmodel.register(this.keypath,this)},rebind:function(e,t){this.refResolver&&this.refResolver.rebind(e,t)},setValue:function(e){this.value=e,this.resolver.bubble()},unbind:function(){this.keypath&&this.viewmodel.unregister(this.keypath,this),this.refResolver&&this.refResolver.unbind()},forceResolution:function(){this.refResolver&&this.refResolver.forceResolution()}}
var Qp=Jp,Xp=function(e,t,r){var n,i,o,s,a=this
this.parentFragment=s=e.parentFragment,this.root=n=e.root,this.mustache=e,this.ref=i=t.r,this.callback=r,this.unresolved=[],(o=cc(n,i,s))?this.base=o:this.baseResolver=new Pp(this,i,function(e){a.base=e,a.baseResolver=null,a.bubble()}),this.members=t.m.map(function(e){return new Qp(e,a,s)}),this.ready=!0,this.bubble()}
Xp.prototype={getKeypath:function(){var e=this.members.map(Br)
return!e.every(Dr)||this.baseResolver?null:this.base.join(e.join("."))},bubble:function(){this.ready&&!this.baseResolver&&this.callback(this.getKeypath())},unbind:function(){this.members.forEach($)},rebind:function(e,t){var r
if(this.base){var n=this.base.replace(e,t)
n&&n!==this.base&&(this.base=n,r=!0)}this.members.forEach(function(n){n.rebind(e,t)&&(r=!0)}),r&&this.bubble()},forceResolution:function(){this.baseResolver&&(this.base=E(this.ref),this.baseResolver.unbind(),this.baseResolver=null),this.members.forEach(Pr),this.bubble()}}
var ed=Xp,td=Mr,rd=Ur,nd=Fr,id={getValue:Bp,init:td,resolve:rd,rebind:nd},od=function(e){this.type=Ku,id.init(this,e)}
od.prototype={update:function(){this.node.data=void 0==this.value?"":this.value},resolve:id.resolve,rebind:id.rebind,detach:Lp,unbind:Np,render:function(){return this.node||(this.node=document.createTextNode(r(this.value))),this.node},unrender:function(e){e&&t(this.node)},getValue:id.getValue,setValue:function(e){var t
this.keypath&&(t=this.root.viewmodel.wrapped[this.keypath.str])&&(e=t.get()),a(e,this.value)||(this.value=e,this.parentFragment.bubble(),this.node&&gc.addView(this))},firstNode:function(){return this.node},toString:function(e){var t=""+r(this.value)
return e?St(t):t}}
var sd=od,ad=zr,cd=Vr,ud=Hr,ld=Wr,hd=Gr,fd=$r,pd=Kr,dd=Yr,gd=Zr,md=function(e,t){id.rebind.call(this,e,t)},vd=Qr,bd=Xr,yd=hn,wd=fn,_d=pn,kd=mn,xd=function(e){this.type=Zu,this.subtype=this.currentSubtype=e.template.n,this.inverted=this.subtype===Sl,this.pElement=e.pElement,this.fragments=[],this.fragmentsToCreate=[],this.fragmentsToRender=[],this.fragmentsToUnrender=[],e.template.i&&(this.indexRefs=e.template.i.split(",").map(function(e,t){return{n:e,t:0===t?"k":"i"}})),this.renderedFragments=[],this.length=0,id.init(this,e)}
xd.prototype={bubble:ad,detach:cd,find:ud,findAll:ld,findAllComponents:hd,findComponent:fd,findNextNode:pd,firstNode:dd,getIndexRef:function(e){if(this.indexRefs)for(var t=this.indexRefs.length;t--;){var r=this.indexRefs[t]
if(r.n===e)return r}},getValue:id.getValue,shuffle:gd,rebind:md,render:vd,resolve:id.resolve,setValue:bd,toString:yd,unbind:wd,unrender:_d,update:kd}
var Ed,Ad,Sd=xd,Cd=vn,Td=bn,qd=yn,jd=wn,Od={}
try{ha("table").innerHTML="foo"}catch(Ea){Ed=!0,Ad={TABLE:['<table class="x">',"</table>"],THEAD:['<table><thead class="x">',"</thead></table>"],TBODY:['<table><tbody class="x">',"</tbody></table>"],TR:['<table><tr class="x">',"</tr></table>"],SELECT:['<select class="x">',"</select>"]}}var Ld=function(e,t,r){var n,i,o,s,a,c=[]
if(null!=e&&""!==e){for(Ed&&(i=Ad[t.tagName])?(n=_n("DIV"),n.innerHTML=i[0]+e+i[1],n=n.querySelector(".x"),"SELECT"===n.tagName&&(o=n.options[n.selectedIndex])):t.namespaceURI===na.svg?(n=_n("DIV"),n.innerHTML='<svg class="x">'+e+"</svg>",n=n.querySelector(".x")):(n=_n(t.tagName),n.innerHTML=e,"SELECT"===n.tagName&&(o=n.options[n.selectedIndex]));s=n.firstChild;)c.push(s),r.appendChild(s)
if("SELECT"===t.tagName)for(a=c.length;a--;)c[a]!==o&&(c[a].selected=!1)}return c},Rd=kn,Id=En,Nd=An,Bd=Sn,Dd=Cn,Pd=Tn,Md=function(e){this.type=Yu,id.init(this,e)}
Md.prototype={detach:Cd,find:Td,findAll:qd,firstNode:jd,getValue:id.getValue,rebind:id.rebind,render:Id,resolve:id.resolve,setValue:Nd,toString:Bd,unbind:Np,unrender:Dd,update:Pd}
var Ud,Fd,zd,Vd,Hd=Md,Wd=function(){this.parentFragment.bubble()},Gd=qn,$d=function(e){return this.node?fa(this.node,e)?this.node:this.fragment&&this.fragment.find?this.fragment.find(e):void 0:null},Kd=function(e,t){t._test(this,!0)&&t.live&&(this.liveQueries||(this.liveQueries=[])).push(t),this.fragment&&this.fragment.findAll(e,t)},Yd=function(e,t){this.fragment&&this.fragment.findAllComponents(e,t)},Zd=function(e){return this.fragment?this.fragment.findComponent(e):void 0},Jd=jn,Qd=On,Xd=Ln,eg=/^true|on|yes|1$/i,tg=/^[0-9]+$/,rg=function(e,t){var r,n,i
return i=t.a||{},n={},r=i.twoway,void 0!==r&&(n.twoway=0===r||eg.test(r)),r=i.lazy,void 0!==r&&(0!==r&&tg.test(r)?n.lazy=parseInt(r):n.lazy=0===r||eg.test(r)),n},ng=Rn
Ud="altGlyph altGlyphDef altGlyphItem animateColor animateMotion animateTransform clipPath feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence foreignObject glyphRef linearGradient radialGradient textPath vkern".split(" "),Fd="attributeName attributeType baseFrequency baseProfile calcMode clipPathUnits contentScriptType contentStyleType diffuseConstant edgeMode externalResourcesRequired filterRes filterUnits glyphRef gradientTransform gradientUnits kernelMatrix kernelUnitLength keyPoints keySplines keyTimes lengthAdjust limitingConeAngle markerHeight markerUnits markerWidth maskContentUnits maskUnits numOctaves pathLength patternContentUnits patternTransform patternUnits pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits refX refY repeatCount repeatDur requiredExtensions requiredFeatures specularConstant specularExponent spreadMethod startOffset stdDeviation stitchTiles surfaceScale systemLanguage tableValues targetX targetY textLength viewBox viewTarget xChannelSelector yChannelSelector zoomAndPan".split(" "),zd=function(e){for(var t={},r=e.length;r--;)t[e[r].toLowerCase()]=e[r]
return t},Vd=zd(Ud.concat(Fd))
var ig=function(e){var t=e.toLowerCase()
return Vd[t]||t},og=function(e,t){var r,n
if(r=t.indexOf(":"),-1===r||(n=t.substr(0,r),"xmlns"===n))e.name=e.element.namespace!==na.html?ig(t):t
else if(t=t.substring(r+1),e.name=ig(t),e.namespace=na[n.toLowerCase()],e.namespacePrefix=n,!e.namespace)throw'Unknown namespace ("'+n+'")'},sg=In,ag=Nn,cg=Bn,ug=Dn,lg={"accept-charset":"acceptCharset",accesskey:"accessKey",bgcolor:"bgColor","class":"className",codebase:"codeBase",colspan:"colSpan",contenteditable:"contentEditable",datetime:"dateTime",dirname:"dirName","for":"htmlFor","http-equiv":"httpEquiv",ismap:"isMap",maxlength:"maxLength",novalidate:"noValidate",pubdate:"pubDate",readonly:"readOnly",rowspan:"rowSpan",tabindex:"tabIndex",usemap:"useMap"},hg=Pn,fg=Un,pg=Fn,dg=zn,gg=Vn,mg=Hn,vg=Wn,bg=Gn,yg=$n,wg=Kn,_g=Yn,kg=Zn,xg=Jn,Eg=Qn,Ag=Xn,Sg=function(e){this.init(e)}
Sg.prototype={bubble:ng,init:ag,rebind:cg,render:ug,toString:hg,unbind:fg,update:Ag}
var Cg,Tg=Sg,qg=function(e,t){var r,n,i=[]
for(r in t)"twoway"!==r&&"lazy"!==r&&t.hasOwnProperty(r)&&(n=new Tg({element:e,name:r,value:t[r],root:e.root}),i[r]=n,"value"!==r&&i.push(n))
return(n=i.value)&&i.push(n),i}
"undefined"!=typeof document&&(Cg=ha("div"))
var jg=function(e,t){this.element=e,this.root=e.root,this.parentFragment=e.parentFragment,this.attributes=[],this.fragment=new by({root:e.root,owner:this,template:[t]})}
jg.prototype={bubble:function(){this.node&&this.update(),this.element.bubble()},rebind:function(e,t){this.fragment.rebind(e,t)},render:function(e){this.node=e,this.isSvg=e.namespaceURI===na.svg,this.update()},unbind:function(){this.fragment.unbind()},update:function(){var e,t,r=this
e=this.fragment.toString(),t=ei(e,this.isSvg),this.attributes.filter(function(e){return ti(t,e)}).forEach(function(e){r.node.removeAttribute(e.name)}),t.forEach(function(e){r.node.setAttribute(e.name,e.value)}),this.attributes=t},toString:function(){return this.fragment.toString()}}
var Og=jg,Lg=function(e,t){return t?t.map(function(t){return new Og(e,t)}):[]},Rg=function(e){var t,r,n,i
if(this.element=e,this.root=e.root,this.attribute=e.attributes[this.name||"value"],t=this.attribute.interpolator,t.twowayBinding=this,r=t.keypath){if("}"===r.str.slice(-1))return m("Two-way binding does not work with expressions (`%s` on <%s>)",t.resolver.uniqueString,e.name,{ractive:this.root}),!1
if(r.isSpecial)return m("Two-way binding does not work with %s",t.resolver.ref,{ractive:this.root}),!1}else{var o=t.template.r?"'"+t.template.r+"' reference":"expression"
g("The %s being used for two-way binding is ambiguous, and may cause unexpected results. Consider initialising your data to eliminate the ambiguity",o,{ractive:this.root}),t.resolver.forceResolution(),r=t.keypath}this.attribute.isTwoway=!0,this.keypath=r,n=this.root.viewmodel.get(r),void 0===n&&this.getInitialValue&&(n=this.getInitialValue(),void 0!==n&&this.root.viewmodel.set(r,n)),(i=ri(e))&&(this.resetValue=n,i.formBindings.push(this))}
Rg.prototype={handleChange:function(){var e=this
gc.start(this.root),this.attribute.locked=!0,this.root.viewmodel.set(this.keypath,this.getValue()),gc.scheduleTask(function(){return e.attribute.locked=!1}),gc.end()},rebound:function(){var e,t,r
t=this.keypath,r=this.attribute.interpolator.keypath,t!==r&&(B(this.root._twowayBindings[t.str],this),this.keypath=r,e=this.root._twowayBindings[r.str]||(this.root._twowayBindings[r.str]=[]),e.push(this))},unbind:function(){}},Rg.extend=function(e){var t,r=this
return t=function(e){Rg.call(this,e),this.init&&this.init()},t.prototype=wa(r.prototype),n(t.prototype,e),t.extend=Rg.extend,t}
var Ig,Ng=Rg,Bg=ni
Ig=Ng.extend({getInitialValue:function(){return""},getValue:function(){return this.element.node.value},render:function(){var e,t=this.element.node,r=!1
this.rendered=!0,e=this.root.lazy,this.element.lazy===!0?e=!0:this.element.lazy===!1?e=!1:c(this.element.lazy)?(e=!1,r=+this.element.lazy):c(e||"")&&(r=+e,e=!1,this.element.lazy=r),this.handler=r?oi:Bg,t.addEventListener("change",Bg,!1),e||(t.addEventListener("input",this.handler,!1),t.attachEvent&&t.addEventListener("keyup",this.handler,!1)),t.addEventListener("blur",ii,!1)},unrender:function(){var e=this.element.node
this.rendered=!1,e.removeEventListener("change",Bg,!1),e.removeEventListener("input",this.handler,!1),e.removeEventListener("keyup",this.handler,!1),e.removeEventListener("blur",ii,!1)}})
var Dg=Ig,Pg=Dg.extend({getInitialValue:function(){return this.element.fragment?this.element.fragment.toString():""},getValue:function(){return this.element.node.innerHTML}}),Mg=Pg,Ug=si,Fg={},zg=Ng.extend({name:"checked",init:function(){this.siblings=Ug(this.root._guid,"radio",this.element.getAttribute("name")),this.siblings.push(this)},render:function(){var e=this.element.node
e.addEventListener("change",Bg,!1),e.attachEvent&&e.addEventListener("click",Bg,!1)},unrender:function(){var e=this.element.node
e.removeEventListener("change",Bg,!1),e.removeEventListener("click",Bg,!1)},handleChange:function(){gc.start(this.root),this.siblings.forEach(function(e){e.root.viewmodel.set(e.keypath,e.getValue())}),gc.end()},getValue:function(){return this.element.node.checked},unbind:function(){B(this.siblings,this)}}),Vg=zg,Hg=Ng.extend({name:"name",init:function(){this.siblings=Ug(this.root._guid,"radioname",this.keypath.str),this.siblings.push(this),this.radioName=!0},getInitialValue:function(){return this.element.getAttribute("checked")?this.element.getAttribute("value"):void 0},render:function(){var e=this.element.node
e.name="{{"+this.keypath.str+"}}",e.checked=this.root.viewmodel.get(this.keypath)==this.element.getAttribute("value"),e.addEventListener("change",Bg,!1),e.attachEvent&&e.addEventListener("click",Bg,!1)},unrender:function(){var e=this.element.node
e.removeEventListener("change",Bg,!1),e.removeEventListener("click",Bg,!1)},getValue:function(){var e=this.element.node
return e._ractive?e._ractive.value:e.value},handleChange:function(){this.element.node.checked&&Ng.prototype.handleChange.call(this)},rebound:function(e,t){var r
Ng.prototype.rebound.call(this,e,t),(r=this.element.node)&&(r.name="{{"+this.keypath.str+"}}")},unbind:function(){B(this.siblings,this)}}),Wg=Hg,Gg=Ng.extend({name:"name",getInitialValue:function(){return this.noInitialValue=!0,[]},init:function(){var e,t
this.checkboxName=!0,this.siblings=Ug(this.root._guid,"checkboxes",this.keypath.str),this.siblings.push(this),this.noInitialValue&&(this.siblings.noInitialValue=!0),this.siblings.noInitialValue&&this.element.getAttribute("checked")&&(e=this.root.viewmodel.get(this.keypath),t=this.element.getAttribute("value"),e.push(t))},unbind:function(){B(this.siblings,this)},render:function(){var e,t,r=this.element.node
e=this.root.viewmodel.get(this.keypath),t=this.element.getAttribute("value"),o(e)?this.isChecked=L(e,t):this.isChecked=e==t,r.name="{{"+this.keypath.str+"}}",r.checked=this.isChecked,r.addEventListener("change",Bg,!1),r.attachEvent&&r.addEventListener("click",Bg,!1)},unrender:function(){var e=this.element.node
e.removeEventListener("change",Bg,!1),e.removeEventListener("click",Bg,!1)},changed:function(){var e=!!this.isChecked
return this.isChecked=this.element.node.checked,this.isChecked===e},handleChange:function(){this.isChecked=this.element.node.checked,Ng.prototype.handleChange.call(this)},getValue:function(){return this.siblings.filter(ai).map(ci)}}),$g=Gg,Kg=Ng.extend({name:"checked",render:function(){var e=this.element.node
e.addEventListener("change",Bg,!1),e.attachEvent&&e.addEventListener("click",Bg,!1)},unrender:function(){var e=this.element.node
e.removeEventListener("change",Bg,!1),e.removeEventListener("click",Bg,!1)},getValue:function(){return this.element.node.checked}}),Yg=Kg,Zg=Ng.extend({getInitialValue:function(){var e,t,r,n,i=this.element.options
if(void 0===this.element.getAttribute("value")&&(t=e=i.length,e)){for(;t--;)if(i[t].getAttribute("selected")){r=i[t].getAttribute("value"),n=!0
break}if(!n)for(;++t<e;)if(!i[t].getAttribute("disabled")){r=i[t].getAttribute("value")
break}return void 0!==r&&(this.element.attributes.value.value=r),r}},render:function(){this.element.node.addEventListener("change",Bg,!1)},unrender:function(){this.element.node.removeEventListener("change",Bg,!1)},setValue:function(e){this.root.viewmodel.set(this.keypath,e)},getValue:function(){var e,t,r,n,i
for(e=this.element.node.options,r=e.length,t=0;r>t;t+=1)if(n=e[t],e[t].selected)return i=n._ractive?n._ractive.value:n.value},forceUpdate:function(){var e=this,t=this.getValue()
void 0!==t&&(this.attribute.locked=!0,gc.scheduleTask(function(){return e.attribute.locked=!1}),this.root.viewmodel.set(this.keypath,t))}}),Jg=Zg,Qg=Jg.extend({getInitialValue:function(){return this.element.options.filter(function(e){return e.getAttribute("selected")}).map(function(e){return e.getAttribute("value")})},render:function(){var e
this.element.node.addEventListener("change",Bg,!1),e=this.root.viewmodel.get(this.keypath),void 0===e&&this.handleChange()},unrender:function(){this.element.node.removeEventListener("change",Bg,!1)},setValue:function(){throw new Error("TODO not implemented yet")},getValue:function(){var e,t,r,n,i,o
for(e=[],t=this.element.node.options,n=t.length,r=0;n>r;r+=1)i=t[r],i.selected&&(o=i._ractive?i._ractive.value:i.value,e.push(o))
return e},handleChange:function(){var e,t,r
return e=this.attribute,t=e.value,r=this.getValue(),void 0!==t&&R(r,t)||Jg.prototype.handleChange.call(this),this},forceUpdate:function(){var e=this,t=this.getValue()
void 0!==t&&(this.attribute.locked=!0,gc.scheduleTask(function(){return e.attribute.locked=!1}),this.root.viewmodel.set(this.keypath,t))},updateModel:function(){void 0!==this.attribute.value&&this.attribute.value.length||this.root.viewmodel.set(this.keypath,this.initialValue)}}),Xg=Qg,em=Ng.extend({render:function(){this.element.node.addEventListener("change",Bg,!1)},unrender:function(){this.element.node.removeEventListener("change",Bg,!1)},getValue:function(){return this.element.node.files}}),tm=em,rm=Dg.extend({getInitialValue:function(){return void 0},getValue:function(){var e=parseFloat(this.element.node.value)
return isNaN(e)?void 0:e}}),nm=ui,im=hi,om=fi,sm=pi,am=di,cm=/^event(?:\.(.+))?/,um=bi,lm=yi,hm={},fm={touchstart:!0,touchmove:!0,touchend:!0,touchcancel:!0,touchleave:!0},pm=_i,dm=ki,gm=xi,mm=Ei,vm=Ai,bm=function(e,t,r){this.init(e,t,r)}
bm.prototype={bubble:im,fire:om,getAction:sm,init:am,listen:lm,rebind:pm,render:dm,resolve:gm,unbind:mm,unrender:vm}
var ym=bm,wm=function(e,t){var r,n,i,o,s=[]
for(n in t)if(t.hasOwnProperty(n))for(i=n.split("-"),r=i.length;r--;)o=new ym(e,i[r],t[n]),s.push(o)
return s},_m=function(e,t){var r,n,i,o=this
this.element=e,this.root=r=e.root,n=t.n||t,("string"==typeof n||(i=new by({template:n,root:r,owner:e}),n=i.toString(),i.unbind(),""!==n))&&(t.a?this.params=t.a:t.d&&(this.fragment=new by({template:t.d,root:r,owner:e}),this.params=this.fragment.getArgsList(),this.fragment.bubble=function(){this.dirtyArgs=this.dirtyValue=!0,o.params=this.getArgsList(),o.ready&&o.update()}),this.fn=v("decorators",r,n),this.fn||h(Na(n,"decorator")))}
_m.prototype={init:function(){var e,t,r
if(e=this.element.node,this.params?(r=[e].concat(this.params),t=this.fn.apply(this.root,r)):t=this.fn.call(this.root,e),!t||!t.teardown)throw new Error("Decorator definition must return an object with a teardown method")
this.actual=t,this.ready=!0},update:function(){this.actual.update?this.actual.update.apply(this.root,this.params):(this.actual.teardown(!0),this.init())},rebind:function(e,t){this.fragment&&this.fragment.rebind(e,t)},teardown:function(e){this.torndown=!0,this.ready&&this.actual.teardown(),!e&&this.fragment&&this.fragment.unbind()}}
var km,xm,Em,Am=_m,Sm=Li,Cm=Ri,Tm=Mi,qm=function(e){return e.replace(/-([a-zA-Z])/g,function(e,t){return t.toUpperCase()})}
Xs?(xm={},Em=ha("div").style,km=function(e){var t,r,n
if(e=qm(e),!xm[e])if(void 0!==Em[e])xm[e]=e
else for(n=e.charAt(0).toUpperCase()+e.substring(1),t=oa.length;t--;)if(r=oa[t],void 0!==Em[r+n]){xm[e]=r+n
break}return xm[e]}):km=null
var jm,Om,Lm=km
Xs?(Om=window.getComputedStyle||xa.getComputedStyle,jm=function(e){var t,r,n,i,s
if(t=Om(this.node),"string"==typeof e)return s=t[Lm(e)],"0px"===s&&(s=0),s
if(!o(e))throw new Error("Transition$getStyle must be passed a string, or an array of strings representing CSS properties")
for(r={},n=e.length;n--;)i=e[n],s=t[Lm(i)],"0px"===s&&(s=0),r[i]=s
return r}):jm=null
var Rm=jm,Im=function(e,t){var r
if("string"==typeof e)this.node.style[Lm(e)]=t
else for(r in e)e.hasOwnProperty(r)&&(this.node.style[Lm(r)]=e[r])
return this},Nm=function(e){var t
this.duration=e.duration,this.step=e.step,this.complete=e.complete,"string"==typeof e.easing?(t=e.root.easing[e.easing],t||(m(Na(e.easing,"easing")),t=Ui)):t="function"==typeof e.easing?e.easing:Ui,this.easing=t,this.start=Xa(),this.end=this.start+this.duration,this.running=!0,bc.add(this)}
Nm.prototype={tick:function(e){var t,r
return this.running?e>this.end?(this.step&&this.step(1),this.complete&&this.complete(1),!1):(t=e-this.start,r=this.easing(t/this.duration),this.step&&this.step(r),!0):!1},stop:function(){this.abort&&this.abort(),this.running=!1}}
var Bm,Dm,Pm,Mm,Um,Fm,zm,Vm,Hm=Nm,Wm=new RegExp("^-(?:"+oa.join("|")+")-"),Gm=function(e){return e.replace(Wm,"")},$m=new RegExp("^(?:"+oa.join("|")+")([A-Z])"),Km=function(e){var t
return e?($m.test(e)&&(e="-"+e),t=e.replace(/[A-Z]/g,function(e){return"-"+e.toLowerCase()})):""},Ym={},Zm={}
Xs?(Dm=ha("div").style,function(){void 0!==Dm.transition?(Pm="transition",Mm="transitionend",Um=!0):void 0!==Dm.webkitTransition?(Pm="webkitTransition",Mm="webkitTransitionEnd",Um=!0):Um=!1}(),Pm&&(Fm=Pm+"Duration",zm=Pm+"Property",Vm=Pm+"TimingFunction"),Bm=function(e,t,r,n,i){setTimeout(function(){var o,s,a,c,u
c=function(){s&&a&&(e.root.fire(e.name+":end",e.node,e.isIntro),i())},o=(e.node.namespaceURI||"")+e.node.tagName,e.node.style[zm]=n.map(Lm).map(Km).join(","),e.node.style[Vm]=Km(r.easing||"linear"),e.node.style[Fm]=r.duration/1e3+"s",u=function(t){var r
r=n.indexOf(qm(Gm(t.propertyName))),-1!==r&&n.splice(r,1),n.length||(e.node.removeEventListener(Mm,u,!1),a=!0,c())},e.node.addEventListener(Mm,u,!1),setTimeout(function(){for(var i,l,h,f,p,d=n.length,m=[];d--;)f=n[d],i=o+f,Um&&!Zm[i]&&(e.node.style[Lm(f)]=t[f],Ym[i]||(l=e.getStyle(f),Ym[i]=e.getStyle(f)!=t[f],Zm[i]=!Ym[i],Zm[i]&&(e.node.style[Lm(f)]=l))),(!Um||Zm[i])&&(void 0===l&&(l=e.getStyle(f)),h=n.indexOf(f),-1===h?g("Something very strange happened with transitions. Please raise an issue at https://github.com/ractivejs/ractive/issues - thanks!",{node:e.node}):n.splice(h,1),p=/[^\d]*$/.exec(t[f])[0],m.push({name:Lm(f),interpolator:Da(parseFloat(l),parseFloat(t[f])),suffix:p}))
m.length?new Hm({root:e.root,duration:r.duration,easing:qm(r.easing||""),step:function(t){var r,n
for(n=m.length;n--;)r=m[n],e.node.style[r.name]=r.interpolator(t)+r.suffix},complete:function(){s=!0,c()}}):s=!0,n.length||(e.node.removeEventListener(Mm,u,!1),a=!0,c())},0)},r.delay||0)}):Bm=null
var Jm,Qm,Xm,ev,tv,rv=Bm
if("undefined"!=typeof document){if(Jm="hidden",tv={},Jm in document)Xm=""
else for(ev=oa.length;ev--;)Qm=oa[ev],Jm=Qm+"Hidden",Jm in document&&(Xm=Qm)
void 0!==Xm?(document.addEventListener(Xm+"visibilitychange",Fi),Fi()):("onfocusout"in document?(document.addEventListener("focusout",zi),document.addEventListener("focusin",Vi)):(window.addEventListener("pagehide",zi),window.addEventListener("blur",zi),window.addEventListener("pageshow",Vi),window.addEventListener("focus",Vi)),tv.hidden=!1)}var nv,iv,ov,sv=tv
Xs?(iv=window.getComputedStyle||xa.getComputedStyle,nv=function(e,t,r){var n,i=this
if(4===arguments.length)throw new Error("t.animateStyle() returns a promise - use .then() instead of passing a callback")
if(sv.hidden)return this.setStyle(e,t),ov||(ov=sc.resolve())
"string"==typeof e?(n={},n[e]=t):(n=e,r=t),r||(m('The "%s" transition does not supply an options object to `t.animateStyle()`. This will break in a future version of Ractive. For more info see https://github.com/RactiveJS/Ractive/issues/340',this.name),r=this)
var o=new sc(function(e){var t,o,s,a,c,u,l
if(!r.duration)return i.setStyle(n),void e()
for(t=Object.keys(n),o=[],s=iv(i.node),c={},u=t.length;u--;)l=t[u],a=s[Lm(l)],"0px"===a&&(a=0),a!=n[l]&&(o.push(l),i.node.style[Lm(l)]=a)
return o.length?void rv(i,n,r,o,e):void e()})
return o}):nv=null
var av=nv,cv=function(e,t){return"number"==typeof e?e={duration:e}:"string"==typeof e?e="slow"===e?{duration:600}:"fast"===e?{duration:200}:{duration:400}:e||(e={}),i({},e,t)},uv=Hi,lv=function(e,t,r){this.init(e,t,r)}
lv.prototype={init:Tm,start:uv,getStyle:Rm,setStyle:Im,animateStyle:av,processParams:cv}
var hv,fv,pv=lv,dv=Gi
hv=function(){var e=this.node,t=this.fragment.toString(!1)
if(window&&window.appearsToBeIELessEqual8&&(e.type="text/css"),e.styleSheet)e.styleSheet.cssText=t
else{for(;e.hasChildNodes();)e.removeChild(e.firstChild)
e.appendChild(document.createTextNode(t))}},fv=function(){this.node.type&&"text/javascript"!==this.node.type||g("Script tag was updated. This does not cause the code to be re-evaluated!",{ractive:this.root}),this.node.text=this.fragment.toString(!1)}
var gv=function(){var e,t
return this.template.y?"<!DOCTYPE"+this.template.dd+">":(e="<"+this.template.e,e+=this.attributes.map(Qi).join("")+this.conditionalAttributes.map(Qi).join(""),"option"===this.name&&Zi(this)&&(e+=" selected"),"input"===this.name&&Ji(this)&&(e+=" checked"),e+=">","textarea"===this.name&&void 0!==this.getAttribute("value")?e+=St(this.getAttribute("value")):void 0!==this.getAttribute("contenteditable")&&(e+=this.getAttribute("value")||""),this.fragment&&(t="script"!==this.name&&"style"!==this.name,e+=this.fragment.toString(t)),yh.test(this.template.e)||(e+="</"+this.template.e+">"),e)},mv=Xi,vv=eo,bv=function(e){this.init(e)}
bv.prototype={bubble:Wd,detach:Gd,find:$d,findAll:Kd,findAllComponents:Yd,findComponent:Zd,findNextNode:Jd,firstNode:Qd,getAttribute:Xd,init:Sm,rebind:Cm,render:dv,toString:gv,unbind:mv,unrender:vv}
var yv=bv,wv=/^\s*$/,_v=/^\s*/,kv=function(e){var t,r,n,i
return t=e.split("\n"),r=t[0],void 0!==r&&wv.test(r)&&t.shift(),n=N(t),void 0!==n&&wv.test(n)&&t.pop(),i=t.reduce(ro,null),i&&(e=t.map(function(e){return e.replace(i,"")}).join("\n")),e},xv=no,Ev=function(e,t){var r
return t?r=e.split("\n").map(function(e,r){return r?t+e:e}).join("\n"):e},Av='Could not find template for partial "%s"',Sv=function(e){var t,r
t=this.parentFragment=e.parentFragment,this.root=t.root,this.type=el,this.index=e.index,this.name=e.template.r,this.rendered=!1,this.fragment=this.fragmentToRender=this.fragmentToUnrender=null,id.init(this,e),this.keypath||((r=xv(this.root,this.name,t))?(Np.call(this),this.isNamed=!0,this.setTemplate(r)):m(Av,this.name))}
Sv.prototype={bubble:function(){this.parentFragment.bubble()},detach:function(){return this.fragment.detach()},find:function(e){return this.fragment.find(e)},findAll:function(e,t){return this.fragment.findAll(e,t)},findComponent:function(e){return this.fragment.findComponent(e)},findAllComponents:function(e,t){return this.fragment.findAllComponents(e,t)},firstNode:function(){return this.fragment.firstNode()},findNextNode:function(){return this.parentFragment.findNextNode(this)},getPartialName:function(){return this.isNamed&&this.name?this.name:void 0===this.value?this.name:this.value},getValue:function(){return this.fragment.getValue()},rebind:function(e,t){this.isNamed||nd.call(this,e,t),this.fragment&&this.fragment.rebind(e,t)},render:function(){return this.docFrag=document.createDocumentFragment(),this.update(),this.rendered=!0,this.docFrag},resolve:id.resolve,setValue:function(e){var t;(void 0===e||e!==this.value)&&(void 0!==e&&(t=xv(this.root,""+e,this.parentFragment)),!t&&this.name&&(t=xv(this.root,this.name,this.parentFragment))&&(Np.call(this),this.isNamed=!0),t||m(Av,this.name,{ractive:this.root}),this.value=e,this.setTemplate(t||[]),this.bubble(),this.rendered&&gc.addView(this))},setTemplate:function(e){this.fragment&&(this.fragment.unbind(),this.rendered&&(this.fragmentToUnrender=this.fragment)),this.fragment=new by({template:e,root:this.root,owner:this,pElement:this.parentFragment.pElement}),this.fragmentToRender=this.fragment},toString:function(e){var t,r,n,i
return t=this.fragment.toString(e),r=this.parentFragment.items[this.index-1],r&&r.type===$u?(n=r.text.split("\n").pop(),(i=/^\s+$/.exec(n))?Ev(t,i[0]):t):t},unbind:function(){this.isNamed||Np.call(this),this.fragment&&this.fragment.unbind()},unrender:function(e){this.rendered&&(this.fragment&&this.fragment.unrender(e),this.rendered=!1)},update:function(){var e,t
this.fragmentToUnrender&&(this.fragmentToUnrender.unrender(!0),this.fragmentToUnrender=null),this.fragmentToRender&&(this.docFrag.appendChild(this.fragmentToRender.render()),this.fragmentToRender=null),this.rendered&&(e=this.parentFragment.getNode(),t=this.parentFragment.findNextNode(this),e.insertBefore(this.docFrag,t))}}
var Cv,Tv,qv,jv=Sv,Ov=co,Lv=uo,Rv=new rc("detach"),Iv=lo,Nv=ho,Bv=fo,Dv=po,Pv=go,Mv=mo,Uv=function(e,t,r,n){var i=e.root,o=e.keypath
n?i.viewmodel.smartUpdate(o,t,n):i.viewmodel.mark(o)},Fv=[],zv=["pop","push","reverse","shift","sort","splice","unshift"]
zv.forEach(function(e){var t=function(){for(var t=arguments.length,r=Array(t),n=0;t>n;n++)r[n]=arguments[n]
var i,o,s,a
for(i=gu(this,e,r),o=Array.prototype[e].apply(this,arguments),gc.start(),this._ractive.setting=!0,a=this._ractive.wrappers.length;a--;)s=this._ractive.wrappers[a],gc.addRactive(s.root),Uv(s,this,e,i)
return gc.end(),this._ractive.setting=!1,o}
_a(Fv,e,{value:t})}),Cv={},Cv.__proto__?(Tv=function(e){e.__proto__=Fv},qv=function(e){e.__proto__=Array.prototype}):(Tv=function(e){var t,r
for(t=zv.length;t--;)r=zv[t],_a(e,r,{value:Fv[r],configurable:!0})},qv=function(e){var t
for(t=zv.length;t--;)delete e[zv[t]]}),Tv.unpatch=qv
var Vv,Hv,Wv,Gv=Tv
Vv={filter:function(e){return o(e)&&(!e._ractive||!e._ractive.setting)},wrap:function(e,t,r){return new Hv(e,t,r)}},Hv=function(e,t,r){this.root=e,this.value=t,this.keypath=E(r),t._ractive||(_a(t,"_ractive",{value:{wrappers:[],instances:[],setting:!1},configurable:!0}),Gv(t)),t._ractive.instances[e._guid]||(t._ractive.instances[e._guid]=0,t._ractive.instances.push(e)),t._ractive.instances[e._guid]+=1,t._ractive.wrappers.push(this)},Hv.prototype={get:function(){return this.value},teardown:function(){var e,t,r,n,i
if(e=this.value,t=e._ractive,r=t.wrappers,n=t.instances,t.setting)return!1
if(i=r.indexOf(this),-1===i)throw new Error(Wv)
if(r.splice(i,1),r.length){if(n[this.root._guid]-=1,!n[this.root._guid]){if(i=n.indexOf(this.root),-1===i)throw new Error(Wv)
n.splice(i,1)}}else delete e._ractive,Gv.unpatch(this.value)}},Wv="Something went wrong in a rather interesting way"
var $v,Kv,Yv=Vv,Zv=/^\s*[0-9]+\s*$/,Jv=function(e){return Zv.test(e)?[]:{}}
try{Object.defineProperty({},"test",{value:0}),$v={filter:function(e,t,r){var n,i
return t?(t=E(t),(n=r.viewmodel.wrapped[t.parent.str])&&!n.magic?!1:(i=r.viewmodel.get(t.parent),o(i)&&/^[0-9]+$/.test(t.lastKey)?!1:i&&("object"==typeof i||"function"==typeof i))):!1},wrap:function(e,t,r){return new Kv(e,t,r)}},Kv=function(e,t,r){var n,i,o
return r=E(r),this.magic=!0,this.ractive=e,this.keypath=r,this.value=t,this.prop=r.lastKey,n=r.parent,this.obj=n.isRoot?e.viewmodel.data:e.viewmodel.get(n),i=this.originalDescriptor=Object.getOwnPropertyDescriptor(this.obj,this.prop),i&&i.set&&(o=i.set._ractiveWrappers)?void(-1===o.indexOf(this)&&o.push(this)):void vo(this,t,i)},Kv.prototype={get:function(){return this.value},reset:function(e){return this.updating?void 0:(this.updating=!0,this.obj[this.prop]=e,gc.addRactive(this.ractive),this.ractive.viewmodel.mark(this.keypath,{keepExistingWrapper:!0}),this.updating=!1,!0)},set:function(e,t){this.updating||(this.obj[this.prop]||(this.updating=!0,this.obj[this.prop]=Jv(e),this.updating=!1),this.obj[this.prop][e]=t)},teardown:function(){var e,t,r,n,i
return this.updating?!1:(e=Object.getOwnPropertyDescriptor(this.obj,this.prop),t=e&&e.set,void(t&&(n=t._ractiveWrappers,i=n.indexOf(this),-1!==i&&n.splice(i,1),n.length||(r=this.obj[this.prop],Object.defineProperty(this.obj,this.prop,this.originalDescriptor||{writable:!0,enumerable:!0,configurable:!0}),this.obj[this.prop]=r))))}}}catch(Ea){$v=!1}var Qv,Xv,eb=$v
eb&&(Qv={filter:function(e,t,r){return eb.filter(e,t,r)&&Yv.filter(e)},wrap:function(e,t,r){return new Xv(e,t,r)}},Xv=function(e,t,r){this.value=t,this.magic=!0,this.magicWrapper=eb.wrap(e,t,r),this.arrayWrapper=Yv.wrap(e,t,r)},Xv.prototype={get:function(){return this.value},teardown:function(){this.arrayWrapper.teardown(),this.magicWrapper.teardown()},reset:function(e){return this.magicWrapper.reset(e)}})
var tb=Qv,rb=bo,nb={},ib=_o,ob=ko,sb=Ao,ab=jo,cb=Oo,ub=function(e,t){this.computation=e,this.viewmodel=e.viewmodel,this.ref=t,this.root=this.viewmodel.ractive,this.parentFragment=this.root.component&&this.root.component.parentFragment}
ub.prototype={resolve:function(e){this.computation.softDeps.push(e),this.computation.unresolvedDeps[e.str]=null,this.viewmodel.register(e,this.computation,"computed")}}
var lb=ub,hb=function(e,t){this.key=e,this.getter=t.getter,this.setter=t.setter,this.hardDeps=t.deps||[],this.softDeps=[],this.unresolvedDeps={},this.depValues={},this._dirty=this._firstRun=!0}
hb.prototype={constructor:hb,init:function(e){var t,r=this
this.viewmodel=e,this.bypass=!0,t=e.get(this.key),e.clearCache(this.key.str),this.bypass=!1,this.setter&&void 0!==t&&this.set(t),this.hardDeps&&this.hardDeps.forEach(function(t){return e.register(t,r,"computed")})},invalidate:function(){this._dirty=!0},get:function(){var e,t,r=this,n=!1
if(this.getting){var i="The "+this.key.str+" computation indirectly called itself. This probably indicates a bug in the computation. It is commonly caused by `array.sort(...)` - if that's the case, clone the array first with `array.slice().sort(...)`"
return d(i),this.value}if(this.getting=!0,this._dirty){if(this._firstRun||!this.hardDeps.length&&!this.softDeps.length?n=!0:[this.hardDeps,this.softDeps].forEach(function(e){var t,i,o
if(!n)for(o=e.length;o--;)if(t=e[o],i=r.viewmodel.get(t),!a(i,r.depValues[t.str]))return r.depValues[t.str]=i,void(n=!0)}),n){this.viewmodel.capture()
try{this.value=this.getter()}catch(o){g('Failed to compute "%s"',this.key.str),f(o.stack||o),this.value=void 0}e=this.viewmodel.release(),t=this.updateDependencies(e),t&&[this.hardDeps,this.softDeps].forEach(function(e){e.forEach(function(e){r.depValues[e.str]=r.viewmodel.get(e)})})}this._dirty=!1}return this.getting=this._firstRun=!1,this.value},set:function(e){if(this.setting)return void(this.value=e)
if(!this.setter)throw new Error("Computed properties without setters are read-only. (This may change in a future version of Ractive!)")
this.setter(e)},updateDependencies:function(e){var t,r,n,i,o
for(r=this.softDeps,t=r.length;t--;)n=r[t],-1===e.indexOf(n)&&(i=!0,this.viewmodel.unregister(n,this,"computed"))
for(t=e.length;t--;)n=e[t],-1!==r.indexOf(n)||this.hardDeps&&-1!==this.hardDeps.indexOf(n)||(i=!0,Lo(this.viewmodel,n)&&!this.unresolvedDeps[n.str]?(o=new lb(this,n.str),e.splice(t,1),this.unresolvedDeps[n.str]=o,gc.addUnresolved(o)):this.viewmodel.register(n,this,"computed"))
return i&&(this.softDeps=e.slice()),i}}
var fb=hb,pb=Ro,db={FAILED_LOOKUP:!0},gb=Io,mb={},vb=Bo,bb=Do,yb=function(e,t){this.localKey=e,this.keypath=t.keypath,this.origin=t.origin,this.deps=[],this.unresolved=[],this.resolved=!1}
yb.prototype={forceResolution:function(){this.keypath=this.localKey,this.setup()},get:function(e,t){return this.resolved?this.origin.get(this.map(e),t):void 0},getValue:function(){return this.keypath?this.origin.get(this.keypath):void 0},initViewmodel:function(e){this.local=e,this.setup()},map:function(e){return void 0===typeof this.keypath?this.localKey:e.replace(this.localKey,this.keypath)},register:function(e,t,r){this.deps.push({keypath:e,dep:t,group:r}),this.resolved&&this.origin.register(this.map(e),t,r)},resolve:function(e){void 0!==this.keypath&&this.unbind(!0),this.keypath=e,this.setup()},set:function(e,t){this.resolved||this.forceResolution(),this.origin.set(this.map(e),t)},setup:function(){var e=this
void 0!==this.keypath&&(this.resolved=!0,this.deps.length&&(this.deps.forEach(function(t){var r=e.map(t.keypath)
if(e.origin.register(r,t.dep,t.group),t.dep.setValue)t.dep.setValue(e.origin.get(r))
else{if(!t.dep.invalidate)throw new Error("An unexpected error occurred. Please raise an issue at https://github.com/ractivejs/ractive/issues - thanks!")
t.dep.invalidate()}}),this.origin.mark(this.keypath)))},setValue:function(e){if(!this.keypath)throw new Error("Mapping does not have keypath, cannot set value. Please raise an issue at https://github.com/ractivejs/ractive/issues - thanks!")
this.origin.set(this.keypath,e)},unbind:function(e){var t=this
e||delete this.local.mappings[this.localKey],this.resolved&&(this.deps.forEach(function(e){t.origin.unregister(t.map(e.keypath),e.dep,e.group)}),this.tracker&&this.origin.unregister(this.keypath,this.tracker))},unregister:function(e,t,r){var n,i
if(this.resolved){for(n=this.deps,i=n.length;i--;)if(n[i].dep===t){n.splice(i,1)
break}this.origin.unregister(this.map(e),t,r)}}}
var wb=Po,_b=function(e,t){var r,n,i,o
return r={},n=0,i=e.map(function(e,i){var s,a,c
a=n,c=t.length
do{if(s=t.indexOf(e,a),-1===s)return o=!0,-1
a=s+1}while(r[s]&&c>a)
return s===n&&(n+=1),s!==i&&(o=!0),r[s]=!0,s})},kb=Mo,xb={},Eb=zo,Ab=Ho,Sb=Wo,Cb=Go,Tb=Ko,qb={implicit:!0},jb={noCascade:!0},Ob=Zo,Lb=Jo,Rb=function(e){var t,r,n=e.adapt,i=e.data,o=e.ractive,s=e.computed,a=e.mappings
this.ractive=o,this.adaptors=n,this.onchange=e.onchange,this.cache={},this.cacheMap=wa(null),this.deps={computed:wa(null),"default":wa(null)},this.depsMap={computed:wa(null),"default":wa(null)},this.patternObservers=[],this.specials=wa(null),this.wrapped=wa(null),this.computations=wa(null),this.captureGroups=[],this.unresolvedImplicitDependencies=[],this.changes=[],this.implicitChanges={},this.noCascade={},this.data=i,this.mappings=wa(null)
for(t in a)this.map(E(t),a[t])
if(i)for(t in i)(r=this.mappings[t])&&void 0===r.getValue()&&r.setValue(i[t])
for(t in s)a&&t in a&&h("Cannot map to a computed property ('%s')",t),this.compute(E(t),s[t])
this.ready=!0}
Rb.prototype={adapt:rb,applyChanges:sb,capture:ab,clearCache:cb,compute:pb,get:gb,init:vb,map:bb,mark:wb,merge:kb,register:Eb,release:Ab,reset:Sb,set:Cb,smartUpdate:Tb,teardown:Ob,unregister:Lb}
var Ib=Rb
Xo.prototype={constructor:Xo,begin:function(e){this.inProcess[e._guid]=!0},end:function(e){var t=e.parent
t&&this.inProcess[t._guid]?es(this.queue,t).push(e):ts(this,e),delete this.inProcess[e._guid]}}
var Nb=Xo,Bb=rs,Db=/\$\{([^\}]+)\}/g,Pb=new rc("construct"),Mb=new rc("config"),Ub=new Nb("init"),Fb=0,zb=["adaptors","components","decorators","easing","events","interpolators","partials","transitions"],Vb=ss,Hb=hs
hs.prototype={bubble:function(){this.dirty||(this.dirty=!0,gc.addView(this))},update:function(){this.callback(this.fragment.getValue()),this.dirty=!1},rebind:function(e,t){this.fragment.rebind(e,t)},unbind:function(){this.fragment.unbind()}}
var Wb=function(e,t,r,i,s){var a,c,u,l,h,f,p={},d={},m={},v=[]
for(c=e.parentFragment,u=e.root,s=s||{},n(p,s),s.content=i||[],p[""]=s.content,t.defaults.el&&g("The <%s/> component has a default `el` property; it has been disregarded",e.name),l=c;l;){if(l.owner.type===sl){h=l.owner.container
break}l=l.parent}return r&&Object.keys(r).forEach(function(t){var n,i,s=r[t]
if("string"==typeof s)n=Af(s),d[t]=n?n.value:s
else if(0===s)d[t]=!0
else{if(!o(s))throw new Error("erm wut")
ps(s)?(m[t]={origin:e.root.viewmodel,keypath:void 0},i=fs(e,s[0],function(e){e.isSpecial?f?a.set(t,e.value):(d[t]=e.value,delete m[t]):f?a.viewmodel.mappings[t].resolve(e):m[t].keypath=e})):i=new Hb(e,s,function(e){f?a.set(t,e):d[t]=e}),v.push(i)}}),a=wa(t.prototype),Vb(a,{el:null,append:!0,data:d,partials:s,magic:u.magic||t.defaults.magic,modifyArrays:u.modifyArrays,adapt:u.adapt},{parent:u,component:e,container:h,mappings:m,inlinePartials:p,cssIds:c.cssIds}),f=!0,e.resolvers=v,a},Gb=ds,$b=function(e){var t,r
for(t=e.root;t;)(r=t._liveComponentQueries["_"+e.name])&&r.push(e.instance),t=t.parent},Kb=ms,Yb=vs,Zb=bs,Jb=ys,Qb=ws,Xb=new rc("teardown"),ey=ks,ty=function(e,t){this.init(e,t)}
ty.prototype={detach:Lv,find:Iv,findAll:Nv,findAllComponents:Bv,findComponent:Dv,findNextNode:Pv,firstNode:Mv,init:Kb,rebind:Yb,render:Zb,toString:Jb,unbind:Qb,unrender:ey}
var ry=ty,ny=function(e){this.type=tl,this.value=e.template.c}
ny.prototype={detach:Lp,firstNode:function(){return this.node},render:function(){return this.node||(this.node=document.createComment(this.value)),this.node},toString:function(){return"<!--"+this.value+"-->"},unrender:function(e){e&&this.node.parentNode.removeChild(this.node)}}
var iy=ny,oy=function(e){var t,r
this.type=sl,this.container=t=e.parentFragment.root,this.component=r=t.component,this.container=t,this.containerFragment=e.parentFragment,this.parentFragment=r.parentFragment
var n=this.name=e.template.n||"",i=t._inlinePartials[n]
i||(g('Could not find template for partial "'+n+'"',{ractive:e.root}),i=[]),this.fragment=new by({owner:this,root:t.parent,template:i,pElement:this.containerFragment.pElement}),o(r.yielders[n])?r.yielders[n].push(this):r.yielders[n]=[this],gc.scheduleTask(function(){if(r.yielders[n].length>1)throw new Error("A component template can only have one {{yield"+(n?" "+n:"")+"}} declaration at a time")})}
oy.prototype={detach:function(){return this.fragment.detach()},find:function(e){return this.fragment.find(e)},findAll:function(e,t){return this.fragment.findAll(e,t)},findComponent:function(e){return this.fragment.findComponent(e)},findAllComponents:function(e,t){return this.fragment.findAllComponents(e,t)},findNextNode:function(){return this.containerFragment.findNextNode(this)},firstNode:function(){return this.fragment.firstNode()},getValue:function(e){return this.fragment.getValue(e)},render:function(){return this.fragment.render()},unbind:function(){this.fragment.unbind()},unrender:function(e){this.fragment.unrender(e),B(this.component.yielders[this.name],this)},rebind:function(e,t){this.fragment.rebind(e,t)},toString:function(){return this.fragment.toString()}}
var sy=oy,ay=function(e){this.declaration=e.template.a}
ay.prototype={init:Oa,render:Oa,unrender:Oa,teardown:Oa,toString:function(){return"<!DOCTYPE"+this.declaration+">"}}
var cy=ay,uy=xs,ly=As,hy=Ss,fy=Cs,py=js,dy=Ls,gy=function(e){this.init(e)}
gy.prototype={bubble:wp,detach:_p,find:kp,findAll:xp,findAllComponents:Ep,findComponent:Ap,findNextNode:Sp,firstNode:Cp,getArgsList:qp,getNode:jp,getValue:Op,init:uy,rebind:ly,registerIndexRef:function(e){var t=this.registeredIndexRefs;-1===t.indexOf(e)&&t.push(e)},render:hy,toString:fy,unbind:py,unregisterIndexRef:function(e){var t=this.registeredIndexRefs
t.splice(t.indexOf(e),1)},unrender:dy}
var my,vy,by=gy,yy=Rs,wy=["template","partials","components","decorators","events"],_y=new rc("reset"),ky=function(e,t){function r(t,n,i){i&&i.partials[e]||t.forEach(function(t){t.type===el&&t.getPartialName()===e&&n.push(t),t.fragment&&r(t.fragment.items,n,i),o(t.fragments)?r(t.fragments,n,i):o(t.items)?r(t.items,n,i):t.type===ol&&t.instance&&r(t.instance.fragment.items,n,t.instance),t.type===Xu&&(o(t.attributes)&&r(t.attributes,n,i),o(t.conditionalAttributes)&&r(t.conditionalAttributes,n,i))})}var n,i=[]
return r(this.fragment.items,i),this.partials[e]=t,n=gc.start(this,!0),i.forEach(function(t){t.value=void 0,t.setValue(e)}),gc.end(),n},xy=Is,Ey=vu("reverse"),Ay=Ns,Sy=vu("shift"),Cy=vu("sort"),Ty=vu("splice"),qy=Ds,jy=Ps,Oy=new rc("teardown"),Ly=Us,Ry=Fs,Iy=zs,Ny=new rc("unrender"),By=vu("unshift"),Dy=Vs,Py=new rc("update"),My=Hs,Uy={add:Za,animate:_c,detach:xc,find:Ac,findAll:Ic,findAllComponents:Nc,findComponent:Bc,findContainer:Dc,findParent:Pc,fire:zc,get:Vc,insert:Wc,merge:$c,observe:cu,observeOnce:uu,off:fu,on:pu,once:du,pop:bu,push:yu,render:Su,reset:yy,resetPartial:ky,resetTemplate:xy,reverse:Ey,set:Ay,shift:Sy,sort:Cy,splice:Ty,subtract:qy,teardown:jy,toggle:Ly,toHTML:Ry,toHtml:Ry,unrender:Iy,unshift:By,update:Dy,updateModel:My},Fy=function(e,t,r){return r||Gs(e,t)?function(){var r,n="_super"in this,i=this._super
return this._super=t,r=e.apply(this,arguments),n&&(this._super=i),r}:e},zy=$s,Vy=Js,Hy=function(e){var t,r,n={}
return e&&(t=e._ractive)?(n.ractive=t.root,n.keypath=t.keypath.str,n.index={},(r=Hp(t.proxy.parentFragment))&&(n.index=Hp.resolve(r)),n):n}
my=function(e){return this instanceof my?void Vb(this,e):new my(e)},vy={DEBUG:{writable:!0,value:!0},DEBUG_PROMISES:{writable:!0,value:!0},extend:{value:Vy},getNodeInfo:{value:Hy},parse:{value:Yf},Promise:{value:sc},svg:{value:ia},magic:{value:ra},VERSION:{value:"0.7.3"},adaptors:{writable:!0,value:{}},components:{writable:!0,value:{}},decorators:{writable:!0,value:{}},easing:{writable:!0,value:ua},events:{writable:!0,value:{}},interpolators:{writable:!0,value:Ma},partials:{writable:!0,value:{}},transitions:{writable:!0,value:{}}},ka(my,vy),my.prototype=n(Uy,ca),my.prototype.constructor=my,my.defaults=my.prototype
var Wy="function"
if(typeof Date.now!==Wy||typeof String.prototype.trim!==Wy||typeof Object.keys!==Wy||typeof Array.prototype.indexOf!==Wy||typeof Array.prototype.forEach!==Wy||typeof Array.prototype.map!==Wy||typeof Array.prototype.filter!==Wy||"undefined"!=typeof window&&typeof window.addEventListener!==Wy)throw new Error("It looks like you're attempting to use Ractive.js in an older browser. You'll need to use one of the 'legacy builds' in order to continue - see http://docs.ractivejs.org/latest/legacy-builds for more information.")
var Gy=my
return Gy})},{}],193:[function(e,t,r){var n=e("./leveldown"),i=e("levelup")
t.exports=function(e,r,o){return"object"!=typeof r||o?(o||(o={}),o.db=function(){return n(e,r,o)},i(o)):t.exports(e,null,r)}},{"./leveldown":194,levelup:25}],194:[function(e,t,r){(function(r){var n=e("util"),i=e("abstract-leveldown"),o=e("level-option-wrap"),s=new r([255]),a=function(e,t,n){return"string"==typeof t&&(n||t.length)?e+t:r.isBuffer(t)&&(n||t.length)?r.concat([new r(e),t]):t},c=function(e,t){this.iterator=e,this.prefix=t}
c.prototype.next=function(e){var t=this
this.iterator.next(e&&function(r,n,i){return r?e(r):(n&&(n=n.slice(t.prefix.length)),void e.apply(null,arguments))})},c.prototype.end=function(e){this.iterator.end(e)}
var u=function(e,t,n){if(!(this instanceof u))return new u(e,t,n)
"string"==typeof n&&(n={separator:n}),n||(n={})
var o=n.separator
t||(t=""),o||(o="!"),t[0]===o&&(t=t.slice(1)),t[t.length-1]===o&&(t=t.slice(0,-1)),this.db=e,this.leveldown=null,this.prefix=o+t+o,this._beforeOpen=n.open
var c=this
this._wrap={gt:function(e){return a(c.prefix,e||"",!0)},lt:function(e){return r.isBuffer(e)&&!e.length&&(e=s),a(c.prefix,e||"ÿ")}},i.AbstractLevelDOWN.call(this,"no-location")}
n.inherits(u,i.AbstractLevelDOWN),u.prototype.type="subdown",u.prototype._open=function(e,t){function r(e){return e||!n._beforeOpen?t(e):void n._beforeOpen(t)}var n=this
return this.db.isOpen()?("subdown"===this.db.db.type&&this.db.db.prefix?(this.prefix=this.db.db.prefix+this.prefix,this.leveldown=this.db.db.leveldown):this.leveldown=this.db.db,r()):void this.db.on("open",this.open.bind(this,e,r))},u.prototype.close=function(){this.leveldown.close.apply(this.leveldown,arguments)},u.prototype.setDb=function(){this.leveldown.setDb.apply(this.leveldown,arguments)},u.prototype.put=function(e,t,r,n){this.leveldown.put(a(this.prefix,e),t,r,n)},u.prototype.get=function(e,t,r){this.leveldown.get(a(this.prefix,e),t,r)},u.prototype.del=function(e,t,r){this.leveldown.del(a(this.prefix,e),t,r)},u.prototype.batch=u.prototype._batch=function(e,t,r){if(0===arguments.length)return new i.AbstractChainedBatch(this)
if(!Array.isArray(e))return this.leveldown.batch.apply(null,arguments)
for(var n=new Array(e.length),o=0;o<e.length;o++){var s=e[o]
n[o]={type:s.type,key:a(this.prefix,s.key),value:s.value}}this.leveldown.batch(n,t,r)},u.prototype.approximateSize=function(e,t,r){this.leveldown.approximateSize.apply(this.leveldown,arguments)},u.prototype.getProperty=function(){return this.leveldown.getProperty.apply(this.leveldown,arguments)},u.prototype.destroy=function(){return this.leveldown.destroy.apply(this.leveldown,arguments)},u.prototype.repair=function(){return this.leveldown.repair.apply(this.leveldown,arguments)}
var l=function(e,t){return e.keys=t.keys,e.values=t.values,e.createIfMissing=t.createIfMissing,e.errorIfExists=t.errorIfExists,e.keyEncoding=t.keyEncoding,e.valueEncoding=t.valueEncoding,e.compression=t.compression,e.db=t.db,e.limit=t.limit,e.keyAsBuffer=t.keyAsBuffer,e.valueAsBuffer=t.valueAsBuffer,e.reverse=t.reverse,e},h=function(e){return e.reverse&&(e.end||e.start)?{start:e.end,end:e.start}:e}
u.prototype.iterator=function(e){e||(e={})
var t=l(o(h(e),this._wrap),e)
return new c(this.leveldown.iterator(t),this.prefix)},t.exports=u}).call(this,e("buffer").Buffer)},{"abstract-leveldown":198,buffer:204,"level-option-wrap":201,util:231}],195:[function(e,t,r){arguments[4][28][0].apply(r,arguments)},{_process:211,dup:28}],196:[function(e,t,r){arguments[4][9][0].apply(r,arguments)},{_process:211,dup:9}],197:[function(e,t,r){(function(r,n){function i(e){if(!arguments.length||void 0===e)throw new Error("constructor requires at least a location argument")
if("string"!=typeof e)throw new Error("constructor requires a location string argument")
this.location=e,this.status="new"}var o=e("xtend"),s=e("./abstract-iterator"),a=e("./abstract-chained-batch")
i.prototype.open=function(e,t){var n=this,i=this.status
if("function"==typeof e&&(t=e),"function"!=typeof t)throw new Error("open() requires a callback argument")
"object"!=typeof e&&(e={}),e.createIfMissing=0!=e.createIfMissing,e.errorIfExists=!!e.errorIfExists,"function"==typeof this._open?(this.status="opening",this._open(e,function(e){return e?(n.status=i,t(e)):(n.status="open",void t())})):(this.status="open",r.nextTick(t))},i.prototype.close=function(e){var t=this,n=this.status
if("function"!=typeof e)throw new Error("close() requires a callback argument")
"function"==typeof this._close?(this.status="closing",this._close(function(r){return r?(t.status=n,e(r)):(t.status="closed",void e())})):(this.status="closed",r.nextTick(e))},i.prototype.get=function(e,t,n){var i
if("function"==typeof t&&(n=t),"function"!=typeof n)throw new Error("get() requires a callback argument")
return(i=this._checkKey(e,"key",this._isBuffer))?n(i):(this._isBuffer(e)||(e=String(e)),"object"!=typeof t&&(t={}),t.asBuffer=0!=t.asBuffer,"function"==typeof this._get?this._get(e,t,n):void r.nextTick(function(){n(new Error("NotFound"))}))},i.prototype.put=function(e,t,n,i){var o
if("function"==typeof n&&(i=n),"function"!=typeof i)throw new Error("put() requires a callback argument")
return(o=this._checkKey(e,"key",this._isBuffer))?i(o):(this._isBuffer(e)||(e=String(e)),null==t||this._isBuffer(t)||r.browser||(t=String(t)),"object"!=typeof n&&(n={}),"function"==typeof this._put?this._put(e,t,n,i):void r.nextTick(i))},i.prototype.del=function(e,t,n){var i
if("function"==typeof t&&(n=t),"function"!=typeof n)throw new Error("del() requires a callback argument")
return(i=this._checkKey(e,"key",this._isBuffer))?n(i):(this._isBuffer(e)||(e=String(e)),"object"!=typeof t&&(t={}),"function"==typeof this._del?this._del(e,t,n):void r.nextTick(n))},i.prototype.batch=function(e,t,n){if(!arguments.length)return this._chainedBatch()
if("function"==typeof t&&(n=t),"function"==typeof e&&(n=e),"function"!=typeof n)throw new Error("batch(array) requires a callback argument")
if(!Array.isArray(e))return n(new Error("batch(array) requires an array argument"))
t&&"object"==typeof t||(t={})
for(var i,o,s=0,a=e.length;a>s;s++)if(i=e[s],"object"==typeof i){if(o=this._checkKey(i.type,"type",this._isBuffer))return n(o)
if(o=this._checkKey(i.key,"key",this._isBuffer))return n(o)}return"function"==typeof this._batch?this._batch(e,t,n):void r.nextTick(n)},i.prototype.approximateSize=function(e,t,n){if(null==e||null==t||"function"==typeof e||"function"==typeof t)throw new Error("approximateSize() requires valid `start`, `end` and `callback` arguments")
if("function"!=typeof n)throw new Error("approximateSize() requires a callback argument")
return this._isBuffer(e)||(e=String(e)),this._isBuffer(t)||(t=String(t)),"function"==typeof this._approximateSize?this._approximateSize(e,t,n):void r.nextTick(function(){n(null,0)})},i.prototype._setupIteratorOptions=function(e){var t=this
return e=o(e),["start","end","gt","gte","lt","lte"].forEach(function(r){e[r]&&t._isBuffer(e[r])&&0===e[r].length&&delete e[r]}),e.reverse=!!e.reverse,e.keys=0!=e.keys,e.values=0!=e.values,e.limit="limit"in e?e.limit:-1,e.keyAsBuffer=0!=e.keyAsBuffer,e.valueAsBuffer=0!=e.valueAsBuffer,e},i.prototype.iterator=function(e){return"object"!=typeof e&&(e={}),e=this._setupIteratorOptions(e),"function"==typeof this._iterator?this._iterator(e):new s(this)},i.prototype._chainedBatch=function(){return new a(this)},i.prototype._isBuffer=function(e){return n.isBuffer(e)},i.prototype._checkKey=function(e,t){if(null===e||void 0===e)return new Error(t+" cannot be `null` or `undefined`")
if(this._isBuffer(e)){if(0===e.length)return new Error(t+" cannot be an empty Buffer")}else if(""===String(e))return new Error(t+" cannot be an empty String")},t.exports=i}).call(this,e("_process"),e("buffer").Buffer)},{"./abstract-chained-batch":195,"./abstract-iterator":196,_process:211,buffer:204,xtend:200}],198:[function(e,t,r){r.AbstractLevelDOWN=e("./abstract-leveldown"),r.AbstractIterator=e("./abstract-iterator"),r.AbstractChainedBatch=e("./abstract-chained-batch"),r.isLevelDOWN=e("./is-leveldown")},{"./abstract-chained-batch":195,"./abstract-iterator":196,"./abstract-leveldown":197,"./is-leveldown":199}],199:[function(e,t,r){function n(e){return e&&"object"==typeof e?Object.keys(i.prototype).filter(function(e){return"_"!=e[0]&&"approximateSize"!=e}).every(function(t){return"function"==typeof e[t]}):!1}var i=e("./abstract-leveldown")
t.exports=n},{"./abstract-leveldown":197}],200:[function(e,t,r){arguments[4][23][0].apply(r,arguments)},{dup:23}],201:[function(e,t,r){var n=e("defined")
t.exports=function(e,t){e||(e={}),t||(t={})
var r={},i=n(t.gte,t.ge,t.start),o=n(t.lte,t.le,t.end),s=n(e.gte,e.ge,e.start),a=n(e.lte,e.le,e.end)
return t.gt?void 0!==s?r.gte=t.gt(s):r.gt=t.gt(e.gt):i&&(void 0!==s?r.gte=i(s):r.gt=i(e.gt)),t.lt?void 0!==a?r.lte=t.lt(a):r.lt=t.lt(e.lt):o&&(void 0!==a?r.lte=o(a):r.lt=o(e.lt)),void 0!==t.limit?r.limit=t.limit(e.limit):void 0!==e.limit&&(r.limit=e.limit),r}},{defined:202}],202:[function(e,t,r){t.exports=function(){for(var e=0;e<arguments.length;e++)if(void 0!==arguments[e])return arguments[e]}},{}],203:[function(e,t,r){},{}],204:[function(e,t,r){function n(e){return this instanceof n?(this.length=0,this.parent=void 0,"number"==typeof e?i(this,e):"string"==typeof e?o(this,e,arguments.length>1?arguments[1]:"utf8"):s(this,e)):arguments.length>1?new n(e,arguments[1]):new n(e)}function i(e,t){if(e=f(e,0>t?0:0|p(t)),!n.TYPED_ARRAY_SUPPORT)for(var r=0;t>r;r++)e[r]=0
return e}function o(e,t,r){("string"!=typeof r||""===r)&&(r="utf8")
var n=0|g(t,r)
return e=f(e,n),e.write(t,r),e}function s(e,t){if(n.isBuffer(t))return a(e,t)
if(G(t))return c(e,t)
if(null==t)throw new TypeError("must start with number, buffer, array or string")
return"undefined"!=typeof ArrayBuffer&&t.buffer instanceof ArrayBuffer?u(e,t):t.length?l(e,t):h(e,t)}function a(e,t){var r=0|p(t.length)
return e=f(e,r),t.copy(e,0,0,r),e}function c(e,t){var r=0|p(t.length)
e=f(e,r)
for(var n=0;r>n;n+=1)e[n]=255&t[n]
return e}function u(e,t){var r=0|p(t.length)
e=f(e,r)
for(var n=0;r>n;n+=1)e[n]=255&t[n]
return e}function l(e,t){var r=0|p(t.length)
e=f(e,r)
for(var n=0;r>n;n+=1)e[n]=255&t[n]
return e}function h(e,t){var r,n=0
"Buffer"===t.type&&G(t.data)&&(r=t.data,n=0|p(r.length)),e=f(e,n)
for(var i=0;n>i;i+=1)e[i]=255&r[i]
return e}function f(e,t){n.TYPED_ARRAY_SUPPORT?e=n._augment(new Uint8Array(t)):(e.length=t,e._isBuffer=!0)
var r=0!==t&&t<=n.poolSize>>>1
return r&&(e.parent=K),e}function p(e){if(e>=$)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+$.toString(16)+" bytes")
return 0|e}function d(e,t){if(!(this instanceof d))return new d(e,t)
var r=new n(e,t)
return delete r.parent,r}function g(e,t){if("string"!=typeof e&&(e=String(e)),0===e.length)return 0
switch(t||"utf8"){case"ascii":case"binary":case"raw":return e.length
case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*e.length
case"hex":return e.length>>>1
case"utf8":case"utf-8":return P(e).length
case"base64":return F(e).length
default:return e.length}}function m(e,t,r,n){r=Number(r)||0
var i=e.length-r
n?(n=Number(n),n>i&&(n=i)):n=i
var o=t.length
if(o%2!==0)throw new Error("Invalid hex string")
n>o/2&&(n=o/2)
for(var s=0;n>s;s++){var a=parseInt(t.substr(2*s,2),16)
if(isNaN(a))throw new Error("Invalid hex string")
e[r+s]=a}return s}function v(e,t,r,n){return z(P(t,e.length-r),e,r,n)}function b(e,t,r,n){return z(M(t),e,r,n)}function y(e,t,r,n){return b(e,t,r,n)}function w(e,t,r,n){return z(F(t),e,r,n)}function _(e,t,r,n){return z(U(t,e.length-r),e,r,n)}function k(e,t,r){return 0===t&&r===e.length?H.fromByteArray(e):H.fromByteArray(e.slice(t,r))}function x(e,t,r){var n="",i=""
r=Math.min(e.length,r)
for(var o=t;r>o;o++)e[o]<=127?(n+=V(i)+String.fromCharCode(e[o]),i=""):i+="%"+e[o].toString(16)
return n+V(i)}function E(e,t,r){var n=""
r=Math.min(e.length,r)
for(var i=t;r>i;i++)n+=String.fromCharCode(127&e[i])
return n}function A(e,t,r){var n=""
r=Math.min(e.length,r)
for(var i=t;r>i;i++)n+=String.fromCharCode(e[i])
return n}function S(e,t,r){var n=e.length;(!t||0>t)&&(t=0),(!r||0>r||r>n)&&(r=n)
for(var i="",o=t;r>o;o++)i+=D(e[o])
return i}function C(e,t,r){for(var n=e.slice(t,r),i="",o=0;o<n.length;o+=2)i+=String.fromCharCode(n[o]+256*n[o+1])
return i}function T(e,t,r){if(e%1!==0||0>e)throw new RangeError("offset is not uint")
if(e+t>r)throw new RangeError("Trying to access beyond buffer length")}function q(e,t,r,i,o,s){if(!n.isBuffer(e))throw new TypeError("buffer must be a Buffer instance")
if(t>o||s>t)throw new RangeError("value is out of bounds")
if(r+i>e.length)throw new RangeError("index out of range")}function j(e,t,r,n){0>t&&(t=65535+t+1)
for(var i=0,o=Math.min(e.length-r,2);o>i;i++)e[r+i]=(t&255<<8*(n?i:1-i))>>>8*(n?i:1-i)}function O(e,t,r,n){0>t&&(t=4294967295+t+1)
for(var i=0,o=Math.min(e.length-r,4);o>i;i++)e[r+i]=t>>>8*(n?i:3-i)&255}function L(e,t,r,n,i,o){if(t>i||o>t)throw new RangeError("value is out of bounds")
if(r+n>e.length)throw new RangeError("index out of range")
if(0>r)throw new RangeError("index out of range")}function R(e,t,r,n,i){return i||L(e,t,r,4,3.4028234663852886e38,-3.4028234663852886e38),W.write(e,t,r,n,23,4),r+4}function I(e,t,r,n,i){return i||L(e,t,r,8,1.7976931348623157e308,-1.7976931348623157e308),W.write(e,t,r,n,52,8),r+8}function N(e){if(e=B(e).replace(Z,""),e.length<2)return""
for(;e.length%4!==0;)e+="="
return e}function B(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")}function D(e){return 16>e?"0"+e.toString(16):e.toString(16)}function P(e,t){t=t||1/0
for(var r,n=e.length,i=null,o=[],s=0;n>s;s++){if(r=e.charCodeAt(s),r>55295&&57344>r){if(!i){if(r>56319){(t-=3)>-1&&o.push(239,191,189)
continue}if(s+1===n){(t-=3)>-1&&o.push(239,191,189)
continue}i=r
continue}if(56320>r){(t-=3)>-1&&o.push(239,191,189),i=r
continue}r=i-55296<<10|r-56320|65536,i=null}else i&&((t-=3)>-1&&o.push(239,191,189),i=null)
if(128>r){if((t-=1)<0)break
o.push(r)}else if(2048>r){if((t-=2)<0)break
o.push(r>>6|192,63&r|128)}else if(65536>r){if((t-=3)<0)break
o.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(2097152>r))throw new Error("Invalid code point")
if((t-=4)<0)break
o.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return o}function M(e){for(var t=[],r=0;r<e.length;r++)t.push(255&e.charCodeAt(r))
return t}function U(e,t){for(var r,n,i,o=[],s=0;s<e.length&&!((t-=2)<0);s++)r=e.charCodeAt(s),n=r>>8,i=r%256,o.push(i),o.push(n)
return o}function F(e){return H.toByteArray(N(e))}function z(e,t,r,n){for(var i=0;n>i&&!(i+r>=t.length||i>=e.length);i++)t[i+r]=e[i]
return i}function V(e){try{return decodeURIComponent(e)}catch(t){return String.fromCharCode(65533)}}var H=e("base64-js"),W=e("ieee754"),G=e("is-array")
r.Buffer=n,r.SlowBuffer=d,r.INSPECT_MAX_BYTES=50,n.poolSize=8192
var $=1073741823,K={}
n.TYPED_ARRAY_SUPPORT=function(){try{var e=new ArrayBuffer(0),t=new Uint8Array(e)
return t.foo=function(){return 42},42===t.foo()&&"function"==typeof t.subarray&&0===new Uint8Array(1).subarray(1,1).byteLength}catch(r){return!1}}(),n.isBuffer=function(e){return!(null==e||!e._isBuffer)},n.compare=function(e,t){if(!n.isBuffer(e)||!n.isBuffer(t))throw new TypeError("Arguments must be Buffers")
if(e===t)return 0
for(var r=e.length,i=t.length,o=0,s=Math.min(r,i);s>o&&e[o]===t[o];)++o
return o!==s&&(r=e[o],i=t[o]),i>r?-1:r>i?1:0},n.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"raw":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0
default:return!1}},n.concat=function(e,t){if(!G(e))throw new TypeError("list argument must be an Array of Buffers.")
if(0===e.length)return new n(0)
if(1===e.length)return e[0]
var r
if(void 0===t)for(t=0,r=0;r<e.length;r++)t+=e[r].length
var i=new n(t),o=0
for(r=0;r<e.length;r++){var s=e[r]
s.copy(i,o),o+=s.length}return i},n.byteLength=g,n.prototype.length=void 0,n.prototype.parent=void 0,n.prototype.toString=function(e,t,r){var n=!1
if(t=0|t,r=void 0===r||r===1/0?this.length:0|r,e||(e="utf8"),0>t&&(t=0),r>this.length&&(r=this.length),t>=r)return""
for(;;)switch(e){case"hex":return S(this,t,r)
case"utf8":case"utf-8":return x(this,t,r)
case"ascii":return E(this,t,r)
case"binary":return A(this,t,r)
case"base64":return k(this,t,r)
case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return C(this,t,r)
default:if(n)throw new TypeError("Unknown encoding: "+e)
e=(e+"").toLowerCase(),n=!0}},n.prototype.equals=function(e){if(!n.isBuffer(e))throw new TypeError("Argument must be a Buffer")
return this===e?!0:0===n.compare(this,e)},n.prototype.inspect=function(){var e="",t=r.INSPECT_MAX_BYTES
return this.length>0&&(e=this.toString("hex",0,t).match(/.{2}/g).join(" "),this.length>t&&(e+=" ... ")),"<Buffer "+e+">"},n.prototype.compare=function(e){if(!n.isBuffer(e))throw new TypeError("Argument must be a Buffer")
return this===e?0:n.compare(this,e)},n.prototype.indexOf=function(e,t){function r(e,t,r){for(var n=-1,i=0;r+i<e.length;i++)if(e[r+i]===t[-1===n?0:i-n]){if(-1===n&&(n=i),i-n+1===t.length)return r+n}else n=-1
return-1}if(t>2147483647?t=2147483647:-2147483648>t&&(t=-2147483648),t>>=0,0===this.length)return-1
if(t>=this.length)return-1
if(0>t&&(t=Math.max(this.length+t,0)),"string"==typeof e)return 0===e.length?-1:String.prototype.indexOf.call(this,e,t)
if(n.isBuffer(e))return r(this,e,t)
if("number"==typeof e)return n.TYPED_ARRAY_SUPPORT&&"function"===Uint8Array.prototype.indexOf?Uint8Array.prototype.indexOf.call(this,e,t):r(this,[e],t)
throw new TypeError("val must be string, number or Buffer")},n.prototype.get=function(e){return console.log(".get() is deprecated. Access using array indexes instead."),this.readUInt8(e)},n.prototype.set=function(e,t){return console.log(".set() is deprecated. Access using array indexes instead."),this.writeUInt8(e,t)},n.prototype.write=function(e,t,r,n){if(void 0===t)n="utf8",r=this.length,t=0
else if(void 0===r&&"string"==typeof t)n=t,r=this.length,t=0
else if(isFinite(t))t=0|t,isFinite(r)?(r=0|r,void 0===n&&(n="utf8")):(n=r,r=void 0)
else{var i=n
n=t,t=0|r,r=i}var o=this.length-t
if((void 0===r||r>o)&&(r=o),e.length>0&&(0>r||0>t)||t>this.length)throw new RangeError("attempt to write outside buffer bounds")
n||(n="utf8")
for(var s=!1;;)switch(n){case"hex":return m(this,e,t,r)
case"utf8":case"utf-8":return v(this,e,t,r)
case"ascii":return b(this,e,t,r)
case"binary":return y(this,e,t,r)
case"base64":return w(this,e,t,r)
case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return _(this,e,t,r)
default:if(s)throw new TypeError("Unknown encoding: "+n)
n=(""+n).toLowerCase(),s=!0}},n.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}},n.prototype.slice=function(e,t){var r=this.length
e=~~e,t=void 0===t?r:~~t,0>e?(e+=r,0>e&&(e=0)):e>r&&(e=r),0>t?(t+=r,0>t&&(t=0)):t>r&&(t=r),e>t&&(t=e)
var i
if(n.TYPED_ARRAY_SUPPORT)i=n._augment(this.subarray(e,t))
else{var o=t-e
i=new n(o,void 0)
for(var s=0;o>s;s++)i[s]=this[s+e]}return i.length&&(i.parent=this.parent||this),i},n.prototype.readUIntLE=function(e,t,r){e=0|e,t=0|t,r||T(e,t,this.length)
for(var n=this[e],i=1,o=0;++o<t&&(i*=256);)n+=this[e+o]*i
return n},n.prototype.readUIntBE=function(e,t,r){e=0|e,t=0|t,r||T(e,t,this.length)
for(var n=this[e+--t],i=1;t>0&&(i*=256);)n+=this[e+--t]*i
return n},n.prototype.readUInt8=function(e,t){return t||T(e,1,this.length),this[e]},n.prototype.readUInt16LE=function(e,t){return t||T(e,2,this.length),this[e]|this[e+1]<<8},n.prototype.readUInt16BE=function(e,t){return t||T(e,2,this.length),this[e]<<8|this[e+1]},n.prototype.readUInt32LE=function(e,t){return t||T(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},n.prototype.readUInt32BE=function(e,t){return t||T(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},n.prototype.readIntLE=function(e,t,r){e=0|e,t=0|t,r||T(e,t,this.length)
for(var n=this[e],i=1,o=0;++o<t&&(i*=256);)n+=this[e+o]*i
return i*=128,n>=i&&(n-=Math.pow(2,8*t)),n},n.prototype.readIntBE=function(e,t,r){e=0|e,t=0|t,r||T(e,t,this.length)
for(var n=t,i=1,o=this[e+--n];n>0&&(i*=256);)o+=this[e+--n]*i
return i*=128,o>=i&&(o-=Math.pow(2,8*t)),o},n.prototype.readInt8=function(e,t){return t||T(e,1,this.length),128&this[e]?-1*(255-this[e]+1):this[e]},n.prototype.readInt16LE=function(e,t){t||T(e,2,this.length)
var r=this[e]|this[e+1]<<8
return 32768&r?4294901760|r:r},n.prototype.readInt16BE=function(e,t){t||T(e,2,this.length)
var r=this[e+1]|this[e]<<8
return 32768&r?4294901760|r:r},n.prototype.readInt32LE=function(e,t){return t||T(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},n.prototype.readInt32BE=function(e,t){return t||T(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},n.prototype.readFloatLE=function(e,t){return t||T(e,4,this.length),W.read(this,e,!0,23,4)},n.prototype.readFloatBE=function(e,t){return t||T(e,4,this.length),W.read(this,e,!1,23,4)},n.prototype.readDoubleLE=function(e,t){return t||T(e,8,this.length),W.read(this,e,!0,52,8)},n.prototype.readDoubleBE=function(e,t){return t||T(e,8,this.length),W.read(this,e,!1,52,8)},n.prototype.writeUIntLE=function(e,t,r,n){e=+e,t=0|t,r=0|r,n||q(this,e,t,r,Math.pow(2,8*r),0)
var i=1,o=0
for(this[t]=255&e;++o<r&&(i*=256);)this[t+o]=e/i&255
return t+r},n.prototype.writeUIntBE=function(e,t,r,n){e=+e,t=0|t,r=0|r,n||q(this,e,t,r,Math.pow(2,8*r),0)
var i=r-1,o=1
for(this[t+i]=255&e;--i>=0&&(o*=256);)this[t+i]=e/o&255
return t+r},n.prototype.writeUInt8=function(e,t,r){return e=+e,t=0|t,r||q(this,e,t,1,255,0),n.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),this[t]=e,t+1},n.prototype.writeUInt16LE=function(e,t,r){return e=+e,t=0|t,r||q(this,e,t,2,65535,0),n.TYPED_ARRAY_SUPPORT?(this[t]=e,this[t+1]=e>>>8):j(this,e,t,!0),t+2},n.prototype.writeUInt16BE=function(e,t,r){return e=+e,t=0|t,r||q(this,e,t,2,65535,0),n.TYPED_ARRAY_SUPPORT?(this[t]=e>>>8,this[t+1]=e):j(this,e,t,!1),t+2},n.prototype.writeUInt32LE=function(e,t,r){return e=+e,t=0|t,r||q(this,e,t,4,4294967295,0),n.TYPED_ARRAY_SUPPORT?(this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=e):O(this,e,t,!0),t+4},n.prototype.writeUInt32BE=function(e,t,r){return e=+e,t=0|t,r||q(this,e,t,4,4294967295,0),n.TYPED_ARRAY_SUPPORT?(this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=e):O(this,e,t,!1),t+4},n.prototype.writeIntLE=function(e,t,r,n){if(e=+e,t=0|t,!n){var i=Math.pow(2,8*r-1)
q(this,e,t,r,i-1,-i)}var o=0,s=1,a=0>e?1:0
for(this[t]=255&e;++o<r&&(s*=256);)this[t+o]=(e/s>>0)-a&255
return t+r},n.prototype.writeIntBE=function(e,t,r,n){if(e=+e,t=0|t,!n){var i=Math.pow(2,8*r-1)
q(this,e,t,r,i-1,-i)}var o=r-1,s=1,a=0>e?1:0
for(this[t+o]=255&e;--o>=0&&(s*=256);)this[t+o]=(e/s>>0)-a&255
return t+r},n.prototype.writeInt8=function(e,t,r){return e=+e,t=0|t,r||q(this,e,t,1,127,-128),n.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),0>e&&(e=255+e+1),this[t]=e,t+1},n.prototype.writeInt16LE=function(e,t,r){return e=+e,t=0|t,r||q(this,e,t,2,32767,-32768),n.TYPED_ARRAY_SUPPORT?(this[t]=e,this[t+1]=e>>>8):j(this,e,t,!0),t+2},n.prototype.writeInt16BE=function(e,t,r){return e=+e,t=0|t,r||q(this,e,t,2,32767,-32768),n.TYPED_ARRAY_SUPPORT?(this[t]=e>>>8,this[t+1]=e):j(this,e,t,!1),t+2},n.prototype.writeInt32LE=function(e,t,r){return e=+e,t=0|t,r||q(this,e,t,4,2147483647,-2147483648),n.TYPED_ARRAY_SUPPORT?(this[t]=e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24):O(this,e,t,!0),t+4},n.prototype.writeInt32BE=function(e,t,r){return e=+e,t=0|t,r||q(this,e,t,4,2147483647,-2147483648),0>e&&(e=4294967295+e+1),n.TYPED_ARRAY_SUPPORT?(this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=e):O(this,e,t,!1),t+4},n.prototype.writeFloatLE=function(e,t,r){return R(this,e,t,!0,r)},n.prototype.writeFloatBE=function(e,t,r){return R(this,e,t,!1,r)},n.prototype.writeDoubleLE=function(e,t,r){return I(this,e,t,!0,r)},n.prototype.writeDoubleBE=function(e,t,r){return I(this,e,t,!1,r)},n.prototype.copy=function(e,t,r,i){if(r||(r=0),i||0===i||(i=this.length),t>=e.length&&(t=e.length),t||(t=0),i>0&&r>i&&(i=r),i===r)return 0
if(0===e.length||0===this.length)return 0
if(0>t)throw new RangeError("targetStart out of bounds")
if(0>r||r>=this.length)throw new RangeError("sourceStart out of bounds")
if(0>i)throw new RangeError("sourceEnd out of bounds")
i>this.length&&(i=this.length),e.length-t<i-r&&(i=e.length-t+r)
var o=i-r
if(1e3>o||!n.TYPED_ARRAY_SUPPORT)for(var s=0;o>s;s++)e[s+t]=this[s+r]
else e._set(this.subarray(r,r+o),t)
return o},n.prototype.fill=function(e,t,r){if(e||(e=0),t||(t=0),r||(r=this.length),t>r)throw new RangeError("end < start")
if(r!==t&&0!==this.length){if(0>t||t>=this.length)throw new RangeError("start out of bounds")
if(0>r||r>this.length)throw new RangeError("end out of bounds")
var n
if("number"==typeof e)for(n=t;r>n;n++)this[n]=e
else{var i=P(e.toString()),o=i.length
for(n=t;r>n;n++)this[n]=i[n%o]}return this}},n.prototype.toArrayBuffer=function(){if("undefined"!=typeof Uint8Array){if(n.TYPED_ARRAY_SUPPORT)return new n(this).buffer
for(var e=new Uint8Array(this.length),t=0,r=e.length;r>t;t+=1)e[t]=this[t]
return e.buffer}throw new TypeError("Buffer.toArrayBuffer not supported in this browser")}
var Y=n.prototype
n._augment=function(e){return e.constructor=n,e._isBuffer=!0,e._set=e.set,e.get=Y.get,e.set=Y.set,e.write=Y.write,e.toString=Y.toString,e.toLocaleString=Y.toString,e.toJSON=Y.toJSON,e.equals=Y.equals,e.compare=Y.compare,e.indexOf=Y.indexOf,e.copy=Y.copy,e.slice=Y.slice,e.readUIntLE=Y.readUIntLE,e.readUIntBE=Y.readUIntBE,e.readUInt8=Y.readUInt8,e.readUInt16LE=Y.readUInt16LE,e.readUInt16BE=Y.readUInt16BE,e.readUInt32LE=Y.readUInt32LE,e.readUInt32BE=Y.readUInt32BE,e.readIntLE=Y.readIntLE,e.readIntBE=Y.readIntBE,e.readInt8=Y.readInt8,e.readInt16LE=Y.readInt16LE,e.readInt16BE=Y.readInt16BE,e.readInt32LE=Y.readInt32LE,e.readInt32BE=Y.readInt32BE,e.readFloatLE=Y.readFloatLE,e.readFloatBE=Y.readFloatBE,e.readDoubleLE=Y.readDoubleLE,e.readDoubleBE=Y.readDoubleBE,e.writeUInt8=Y.writeUInt8,e.writeUIntLE=Y.writeUIntLE,e.writeUIntBE=Y.writeUIntBE,e.writeUInt16LE=Y.writeUInt16LE,e.writeUInt16BE=Y.writeUInt16BE,e.writeUInt32LE=Y.writeUInt32LE,e.writeUInt32BE=Y.writeUInt32BE,e.writeIntLE=Y.writeIntLE,e.writeIntBE=Y.writeIntBE,e.writeInt8=Y.writeInt8,e.writeInt16LE=Y.writeInt16LE,e.writeInt16BE=Y.writeInt16BE,e.writeInt32LE=Y.writeInt32LE,e.writeInt32BE=Y.writeInt32BE,e.writeFloatLE=Y.writeFloatLE,e.writeFloatBE=Y.writeFloatBE,e.writeDoubleLE=Y.writeDoubleLE,e.writeDoubleBE=Y.writeDoubleBE,e.fill=Y.fill,e.inspect=Y.inspect,e.toArrayBuffer=Y.toArrayBuffer,e}
var Z=/[^+\/0-9A-z\-]/g},{"base64-js":205,ieee754:206,"is-array":207}],205:[function(e,t,r){var n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
!function(e){"use strict"
function t(e){var t=e.charCodeAt(0)
return t===s||t===h?62:t===a||t===f?63:c>t?-1:c+10>t?t-c+26+26:l+26>t?t-l:u+26>t?t-u+26:void 0}function r(e){function r(e){u[h++]=e}var n,i,s,a,c,u
if(e.length%4>0)throw new Error("Invalid string. Length must be a multiple of 4")
var l=e.length
c="="===e.charAt(l-2)?2:"="===e.charAt(l-1)?1:0,u=new o(3*e.length/4-c),s=c>0?e.length-4:e.length
var h=0
for(n=0,i=0;s>n;n+=4,i+=3)a=t(e.charAt(n))<<18|t(e.charAt(n+1))<<12|t(e.charAt(n+2))<<6|t(e.charAt(n+3)),r((16711680&a)>>16),r((65280&a)>>8),r(255&a)
return 2===c?(a=t(e.charAt(n))<<2|t(e.charAt(n+1))>>4,r(255&a)):1===c&&(a=t(e.charAt(n))<<10|t(e.charAt(n+1))<<4|t(e.charAt(n+2))>>2,r(a>>8&255),r(255&a)),u}function i(e){function t(e){return n.charAt(e)}function r(e){return t(e>>18&63)+t(e>>12&63)+t(e>>6&63)+t(63&e)}var i,o,s,a=e.length%3,c=""
for(i=0,s=e.length-a;s>i;i+=3)o=(e[i]<<16)+(e[i+1]<<8)+e[i+2],c+=r(o)
switch(a){case 1:o=e[e.length-1],c+=t(o>>2),c+=t(o<<4&63),c+="=="
break
case 2:o=(e[e.length-2]<<8)+e[e.length-1],c+=t(o>>10),c+=t(o>>4&63),c+=t(o<<2&63),c+="="}return c}var o="undefined"!=typeof Uint8Array?Uint8Array:Array,s="+".charCodeAt(0),a="/".charCodeAt(0),c="0".charCodeAt(0),u="a".charCodeAt(0),l="A".charCodeAt(0),h="-".charCodeAt(0),f="_".charCodeAt(0)
e.toByteArray=r,e.fromByteArray=i}("undefined"==typeof r?this.base64js={}:r)},{}],206:[function(e,t,r){r.read=function(e,t,r,n,i){var o,s,a=8*i-n-1,c=(1<<a)-1,u=c>>1,l=-7,h=r?i-1:0,f=r?-1:1,p=e[t+h]
for(h+=f,o=p&(1<<-l)-1,p>>=-l,l+=a;l>0;o=256*o+e[t+h],h+=f,l-=8);for(s=o&(1<<-l)-1,o>>=-l,l+=n;l>0;s=256*s+e[t+h],h+=f,l-=8);if(0===o)o=1-u
else{if(o===c)return s?NaN:(p?-1:1)*(1/0)
s+=Math.pow(2,n),o-=u}return(p?-1:1)*s*Math.pow(2,o-n)},r.write=function(e,t,r,n,i,o){var s,a,c,u=8*o-i-1,l=(1<<u)-1,h=l>>1,f=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,p=n?0:o-1,d=n?1:-1,g=0>t||0===t&&0>1/t?1:0
for(t=Math.abs(t),isNaN(t)||t===1/0?(a=isNaN(t)?1:0,s=l):(s=Math.floor(Math.log(t)/Math.LN2),t*(c=Math.pow(2,-s))<1&&(s--,c*=2),t+=s+h>=1?f/c:f*Math.pow(2,1-h),t*c>=2&&(s++,c/=2),s+h>=l?(a=0,s=l):s+h>=1?(a=(t*c-1)*Math.pow(2,i),s+=h):(a=t*Math.pow(2,h-1)*Math.pow(2,i),s=0));i>=8;e[r+p]=255&a,p+=d,a/=256,i-=8);for(s=s<<i|a,u+=i;u>0;e[r+p]=255&s,p+=d,s/=256,u-=8);e[r+p-d]|=128*g}},{}],207:[function(e,t,r){var n=Array.isArray,i=Object.prototype.toString
t.exports=n||function(e){return!!e&&"[object Array]"==i.call(e)}},{}],208:[function(e,t,r){function n(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function i(e){return"function"==typeof e}function o(e){return"number"==typeof e}function s(e){return"object"==typeof e&&null!==e}function a(e){return void 0===e}t.exports=n,n.EventEmitter=n,n.prototype._events=void 0,n.prototype._maxListeners=void 0,n.defaultMaxListeners=10,n.prototype.setMaxListeners=function(e){if(!o(e)||0>e||isNaN(e))throw TypeError("n must be a positive number")
return this._maxListeners=e,this},n.prototype.emit=function(e){var t,r,n,o,c,u
if(this._events||(this._events={}),"error"===e&&(!this._events.error||s(this._events.error)&&!this._events.error.length)){if(t=arguments[1],t instanceof Error)throw t
throw TypeError('Uncaught, unspecified "error" event.')}if(r=this._events[e],a(r))return!1
if(i(r))switch(arguments.length){case 1:r.call(this)
break
case 2:r.call(this,arguments[1])
break
case 3:r.call(this,arguments[1],arguments[2])
break
default:for(n=arguments.length,o=new Array(n-1),c=1;n>c;c++)o[c-1]=arguments[c]
r.apply(this,o)}else if(s(r)){for(n=arguments.length,o=new Array(n-1),c=1;n>c;c++)o[c-1]=arguments[c]
for(u=r.slice(),n=u.length,c=0;n>c;c++)u[c].apply(this,o)}return!0},n.prototype.addListener=function(e,t){var r
if(!i(t))throw TypeError("listener must be a function")
if(this._events||(this._events={}),this._events.newListener&&this.emit("newListener",e,i(t.listener)?t.listener:t),this._events[e]?s(this._events[e])?this._events[e].push(t):this._events[e]=[this._events[e],t]:this._events[e]=t,s(this._events[e])&&!this._events[e].warned){var r
r=a(this._maxListeners)?n.defaultMaxListeners:this._maxListeners,r&&r>0&&this._events[e].length>r&&(this._events[e].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[e].length),"function"==typeof console.trace&&console.trace())}return this},n.prototype.on=n.prototype.addListener,n.prototype.once=function(e,t){function r(){this.removeListener(e,r),n||(n=!0,t.apply(this,arguments))}if(!i(t))throw TypeError("listener must be a function")
var n=!1
return r.listener=t,this.on(e,r),this},n.prototype.removeListener=function(e,t){var r,n,o,a
if(!i(t))throw TypeError("listener must be a function")
if(!this._events||!this._events[e])return this
if(r=this._events[e],o=r.length,n=-1,r===t||i(r.listener)&&r.listener===t)delete this._events[e],this._events.removeListener&&this.emit("removeListener",e,t)
else if(s(r)){for(a=o;a-->0;)if(r[a]===t||r[a].listener&&r[a].listener===t){n=a
break}if(0>n)return this
1===r.length?(r.length=0,delete this._events[e]):r.splice(n,1),this._events.removeListener&&this.emit("removeListener",e,t)}return this},n.prototype.removeAllListeners=function(e){var t,r
if(!this._events)return this
if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[e]&&delete this._events[e],this
if(0===arguments.length){for(t in this._events)"removeListener"!==t&&this.removeAllListeners(t)
return this.removeAllListeners("removeListener"),this._events={},this}if(r=this._events[e],i(r))this.removeListener(e,r)
else for(;r.length;)this.removeListener(e,r[r.length-1])
return delete this._events[e],this},n.prototype.listeners=function(e){var t
return t=this._events&&this._events[e]?i(this._events[e])?[this._events[e]]:this._events[e].slice():[]},n.listenerCount=function(e,t){var r
return r=e._events&&e._events[t]?i(e._events[t])?1:e._events[t].length:0}},{}],209:[function(e,t,r){arguments[4][14][0].apply(r,arguments)},{dup:14}],210:[function(e,t,r){arguments[4][22][0].apply(r,arguments)},{dup:22}],211:[function(e,t,r){function n(){l=!1,a.length?u=a.concat(u):h=-1,u.length&&i()}function i(){if(!l){var e=setTimeout(n)
l=!0
for(var t=u.length;t;){for(a=u,u=[];++h<t;)a[h].run()
h=-1,t=u.length}a=null,l=!1,clearTimeout(e)}}function o(e,t){this.fun=e,this.array=t}function s(){}var a,c=t.exports={},u=[],l=!1,h=-1
c.nextTick=function(e){var t=new Array(arguments.length-1)
if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r]
u.push(new o(e,t)),1!==u.length||l||setTimeout(i,0)},o.prototype.run=function(){this.fun.apply(null,this.array)},c.title="browser",c.browser=!0,c.env={},c.argv=[],c.version="",c.versions={},c.on=s,c.addListener=s,c.once=s,c.off=s,c.removeListener=s,c.removeAllListeners=s,c.emit=s,c.binding=function(e){throw new Error("process.binding is not supported")},c.cwd=function(){return"/"},c.chdir=function(e){throw new Error("process.chdir is not supported")},c.umask=function(){return 0}},{}],212:[function(e,t,r){(function(e){!function(n){function i(e){throw RangeError(R[e])}function o(e,t){for(var r=e.length,n=[];r--;)n[r]=t(e[r])
return n}function s(e,t){var r=e.split("@"),n=""
r.length>1&&(n=r[0]+"@",e=r[1]),e=e.replace(L,".")
var i=e.split("."),s=o(i,t).join(".")
return n+s}function a(e){for(var t,r,n=[],i=0,o=e.length;o>i;)t=e.charCodeAt(i++),t>=55296&&56319>=t&&o>i?(r=e.charCodeAt(i++),56320==(64512&r)?n.push(((1023&t)<<10)+(1023&r)+65536):(n.push(t),i--)):n.push(t)
return n}function c(e){return o(e,function(e){var t=""
return e>65535&&(e-=65536,t+=B(e>>>10&1023|55296),e=56320|1023&e),t+=B(e)}).join("")}function u(e){return 10>e-48?e-22:26>e-65?e-65:26>e-97?e-97:k}function l(e,t){return e+22+75*(26>e)-((0!=t)<<5)}function h(e,t,r){var n=0
for(e=r?N(e/S):e>>1,e+=N(e/t);e>I*E>>1;n+=k)e=N(e/I)
return N(n+(I+1)*e/(e+A))}function f(e){var t,r,n,o,s,a,l,f,p,d,g=[],m=e.length,v=0,b=T,y=C
for(r=e.lastIndexOf(q),0>r&&(r=0),n=0;r>n;++n)e.charCodeAt(n)>=128&&i("not-basic"),g.push(e.charCodeAt(n))
for(o=r>0?r+1:0;m>o;){for(s=v,a=1,l=k;o>=m&&i("invalid-input"),f=u(e.charCodeAt(o++)),(f>=k||f>N((_-v)/a))&&i("overflow"),v+=f*a,p=y>=l?x:l>=y+E?E:l-y,!(p>f);l+=k)d=k-p,a>N(_/d)&&i("overflow"),a*=d
t=g.length+1,y=h(v-s,t,0==s),N(v/t)>_-b&&i("overflow"),b+=N(v/t),v%=t,g.splice(v++,0,b)}return c(g)}function p(e){var t,r,n,o,s,c,u,f,p,d,g,m,v,b,y,w=[]
for(e=a(e),m=e.length,t=T,r=0,s=C,c=0;m>c;++c)g=e[c],128>g&&w.push(B(g))
for(n=o=w.length,o&&w.push(q);m>n;){for(u=_,c=0;m>c;++c)g=e[c],g>=t&&u>g&&(u=g)
for(v=n+1,u-t>N((_-r)/v)&&i("overflow"),r+=(u-t)*v,t=u,c=0;m>c;++c)if(g=e[c],t>g&&++r>_&&i("overflow"),g==t){for(f=r,p=k;d=s>=p?x:p>=s+E?E:p-s,!(d>f);p+=k)y=f-d,b=k-d,w.push(B(l(d+y%b,0))),f=N(y/b)
w.push(B(l(f,0))),s=h(r,v,n==o),r=0,++n}++r,++t}return w.join("")}function d(e){return s(e,function(e){return j.test(e)?f(e.slice(4).toLowerCase()):e})}function g(e){return s(e,function(e){return O.test(e)?"xn--"+p(e):e})}var m="object"==typeof r&&r&&!r.nodeType&&r,v="object"==typeof t&&t&&!t.nodeType&&t,b="object"==typeof e&&e;(b.global===b||b.window===b||b.self===b)&&(n=b)
var y,w,_=2147483647,k=36,x=1,E=26,A=38,S=700,C=72,T=128,q="-",j=/^xn--/,O=/[^\x20-\x7E]/,L=/[\x2E\u3002\uFF0E\uFF61]/g,R={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},I=k-x,N=Math.floor,B=String.fromCharCode
if(y={version:"1.3.2",ucs2:{decode:a,encode:c},decode:f,encode:p,toASCII:g,toUnicode:d},"function"==typeof define&&"object"==typeof define.amd&&define.amd)define("punycode",function(){return y})
else if(m&&v)if(t.exports==m)v.exports=y
else for(w in y)y.hasOwnProperty(w)&&(m[w]=y[w])
else n.punycode=y}(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],213:[function(e,t,r){"use strict"
function n(e,t){return Object.prototype.hasOwnProperty.call(e,t)}t.exports=function(e,t,r,o){t=t||"&",r=r||"="
var s={}
if("string"!=typeof e||0===e.length)return s
var a=/\+/g
e=e.split(t)
var c=1e3
o&&"number"==typeof o.maxKeys&&(c=o.maxKeys)
var u=e.length
c>0&&u>c&&(u=c)
for(var l=0;u>l;++l){var h,f,p,d,g=e[l].replace(a,"%20"),m=g.indexOf(r)
m>=0?(h=g.substr(0,m),f=g.substr(m+1)):(h=g,f=""),p=decodeURIComponent(h),d=decodeURIComponent(f),n(s,p)?i(s[p])?s[p].push(d):s[p]=[s[p],d]:s[p]=d}return s}
var i=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)}},{}],214:[function(e,t,r){"use strict"
function n(e,t){if(e.map)return e.map(t)
for(var r=[],n=0;n<e.length;n++)r.push(t(e[n],n))
return r}var i=function(e){switch(typeof e){case"string":return e
case"boolean":return e?"true":"false"
case"number":return isFinite(e)?e:""
default:return""}}
t.exports=function(e,t,r,a){return t=t||"&",r=r||"=",null===e&&(e=void 0),"object"==typeof e?n(s(e),function(s){var a=encodeURIComponent(i(s))+r
return o(e[s])?n(e[s],function(e){return a+encodeURIComponent(i(e))}).join(t):a+encodeURIComponent(i(e[s]))}).join(t):a?encodeURIComponent(i(a))+r+encodeURIComponent(i(e)):""}
var o=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},s=Object.keys||function(e){var t=[]
for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.push(r)
return t}},{}],215:[function(e,t,r){"use strict"
r.decode=r.parse=e("./decode"),r.encode=r.stringify=e("./encode")},{"./decode":213,"./encode":214}],216:[function(e,t,r){t.exports=e("./lib/_stream_duplex.js")},{"./lib/_stream_duplex.js":217}],217:[function(e,t,r){arguments[4][39][0].apply(r,arguments)},{"./_stream_readable":219,"./_stream_writable":221,_process:211,"core-util-is":222,dup:39,inherits:209}],218:[function(e,t,r){arguments[4][40][0].apply(r,arguments)},{"./_stream_transform":220,"core-util-is":222,dup:40,inherits:209}],219:[function(e,t,r){arguments[4][41][0].apply(r,arguments)},{"./_stream_duplex":217,_process:211,buffer:204,"core-util-is":222,dup:41,events:208,inherits:209,isarray:210,stream:227,"string_decoder/":228,util:203}],220:[function(e,t,r){arguments[4][42][0].apply(r,arguments)},{"./_stream_duplex":217,"core-util-is":222,dup:42,inherits:209}],221:[function(e,t,r){arguments[4][43][0].apply(r,arguments)},{"./_stream_duplex":217,_process:211,buffer:204,"core-util-is":222,dup:43,inherits:209,stream:227}],222:[function(e,t,r){(function(e){function t(e){return Array.isArray(e)}function n(e){return"boolean"==typeof e}function i(e){return null===e}function o(e){return null==e}function s(e){return"number"==typeof e}function a(e){return"string"==typeof e}function c(e){return"symbol"==typeof e}function u(e){return void 0===e}function l(e){return h(e)&&"[object RegExp]"===v(e)}function h(e){return"object"==typeof e&&null!==e}function f(e){return h(e)&&"[object Date]"===v(e)}function p(e){return h(e)&&("[object Error]"===v(e)||e instanceof Error)}function d(e){return"function"==typeof e}function g(e){return null===e||"boolean"==typeof e||"number"==typeof e||"string"==typeof e||"symbol"==typeof e||"undefined"==typeof e}function m(t){return e.isBuffer(t)}function v(e){return Object.prototype.toString.call(e)}r.isArray=t,r.isBoolean=n,r.isNull=i,r.isNullOrUndefined=o,r.isNumber=s,r.isString=a,r.isSymbol=c,r.isUndefined=u,r.isRegExp=l,r.isObject=h,r.isDate=f,r.isError=p,r.isFunction=d,r.isPrimitive=g,r.isBuffer=m}).call(this,e("buffer").Buffer)},{buffer:204}],223:[function(e,t,r){t.exports=e("./lib/_stream_passthrough.js")},{"./lib/_stream_passthrough.js":218}],224:[function(e,t,r){arguments[4][47][0].apply(r,arguments)},{"./lib/_stream_duplex.js":217,"./lib/_stream_passthrough.js":218,"./lib/_stream_readable.js":219,"./lib/_stream_transform.js":220,"./lib/_stream_writable.js":221,dup:47,stream:227}],225:[function(e,t,r){t.exports=e("./lib/_stream_transform.js")},{"./lib/_stream_transform.js":220}],226:[function(e,t,r){t.exports=e("./lib/_stream_writable.js")},{"./lib/_stream_writable.js":221}],227:[function(e,t,r){function n(){i.call(this)}t.exports=n
var i=e("events").EventEmitter,o=e("inherits")
o(n,i),n.Readable=e("readable-stream/readable.js"),n.Writable=e("readable-stream/writable.js"),n.Duplex=e("readable-stream/duplex.js"),n.Transform=e("readable-stream/transform.js"),n.PassThrough=e("readable-stream/passthrough.js"),n.Stream=n,n.prototype.pipe=function(e,t){function r(t){e.writable&&!1===e.write(t)&&u.pause&&u.pause()}function n(){u.readable&&u.resume&&u.resume()}function o(){l||(l=!0,e.end())}function s(){l||(l=!0,"function"==typeof e.destroy&&e.destroy())}function a(e){if(c(),0===i.listenerCount(this,"error"))throw e}function c(){u.removeListener("data",r),e.removeListener("drain",n),u.removeListener("end",o),u.removeListener("close",s),u.removeListener("error",a),e.removeListener("error",a),u.removeListener("end",c),u.removeListener("close",c),e.removeListener("close",c)}var u=this
u.on("data",r),e.on("drain",n),e._isStdio||t&&t.end===!1||(u.on("end",o),u.on("close",s))
var l=!1
return u.on("error",a),e.on("error",a),u.on("end",c),u.on("close",c),e.on("close",c),e.emit("pipe",u),e}},{events:208,inherits:209,"readable-stream/duplex.js":216,"readable-stream/passthrough.js":223,"readable-stream/readable.js":224,"readable-stream/transform.js":225,"readable-stream/writable.js":226}],228:[function(e,t,r){arguments[4][46][0].apply(r,arguments)},{buffer:204,dup:46}],229:[function(e,t,r){function n(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}function i(e,t,r){if(e&&u(e)&&e instanceof n)return e
var i=new n
return i.parse(e,t,r),i}function o(e){return c(e)&&(e=i(e)),e instanceof n?e.format():n.prototype.format.call(e)}function s(e,t){return i(e,!1,!0).resolve(t)}function a(e,t){return e?i(e,!1,!0).resolveObject(t):t}function c(e){return"string"==typeof e}function u(e){return"object"==typeof e&&null!==e}function l(e){return null===e}function h(e){return null==e}var f=e("punycode")
r.parse=i,r.resolve=s,r.resolveObject=a,r.format=o,r.Url=n
var p=/^([a-z0-9.+-]+:)/i,d=/:[0-9]*$/,g=["<",">",'"',"`"," ","\r","\n","	"],m=["{","}","|","\\","^","`"].concat(g),v=["'"].concat(m),b=["%","/","?",";","#"].concat(v),y=["/","?","#"],w=255,_=/^[a-z0-9A-Z_-]{0,63}$/,k=/^([a-z0-9A-Z_-]{0,63})(.*)$/,x={javascript:!0,"javascript:":!0},E={javascript:!0,"javascript:":!0},A={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},S=e("querystring")
n.prototype.parse=function(e,t,r){if(!c(e))throw new TypeError("Parameter 'url' must be a string, not "+typeof e)
var n=e
n=n.trim()
var i=p.exec(n)
if(i){i=i[0]
var o=i.toLowerCase()
this.protocol=o,n=n.substr(i.length)}if(r||i||n.match(/^\/\/[^@\/]+@[^@\/]+/)){var s="//"===n.substr(0,2)
!s||i&&E[i]||(n=n.substr(2),this.slashes=!0)}if(!E[i]&&(s||i&&!A[i])){for(var a=-1,u=0;u<y.length;u++){var l=n.indexOf(y[u]);-1!==l&&(-1===a||a>l)&&(a=l)}var h,d
d=-1===a?n.lastIndexOf("@"):n.lastIndexOf("@",a),-1!==d&&(h=n.slice(0,d),n=n.slice(d+1),this.auth=decodeURIComponent(h)),a=-1
for(var u=0;u<b.length;u++){var l=n.indexOf(b[u]);-1!==l&&(-1===a||a>l)&&(a=l)}-1===a&&(a=n.length),this.host=n.slice(0,a),n=n.slice(a),this.parseHost(),this.hostname=this.hostname||""
var g="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1]
if(!g)for(var m=this.hostname.split(/\./),u=0,C=m.length;C>u;u++){var T=m[u]
if(T&&!T.match(_)){for(var q="",j=0,O=T.length;O>j;j++)q+=T.charCodeAt(j)>127?"x":T[j]
if(!q.match(_)){var L=m.slice(0,u),R=m.slice(u+1),I=T.match(k)
I&&(L.push(I[1]),R.unshift(I[2])),R.length&&(n="/"+R.join(".")+n),this.hostname=L.join(".")
break}}}if(this.hostname.length>w?this.hostname="":this.hostname=this.hostname.toLowerCase(),!g){for(var N=this.hostname.split("."),B=[],u=0;u<N.length;++u){var D=N[u]
B.push(D.match(/[^A-Za-z0-9_-]/)?"xn--"+f.encode(D):D)}this.hostname=B.join(".")}var P=this.port?":"+this.port:"",M=this.hostname||""
this.host=M+P,this.href+=this.host,g&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==n[0]&&(n="/"+n))}if(!x[o])for(var u=0,C=v.length;C>u;u++){var U=v[u],F=encodeURIComponent(U)
F===U&&(F=escape(U)),n=n.split(U).join(F)}var z=n.indexOf("#");-1!==z&&(this.hash=n.substr(z),n=n.slice(0,z))
var V=n.indexOf("?")
if(-1!==V?(this.search=n.substr(V),this.query=n.substr(V+1),t&&(this.query=S.parse(this.query)),n=n.slice(0,V)):t&&(this.search="",this.query={}),n&&(this.pathname=n),A[o]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){var P=this.pathname||"",D=this.search||""
this.path=P+D}return this.href=this.format(),this},n.prototype.format=function(){var e=this.auth||""
e&&(e=encodeURIComponent(e),e=e.replace(/%3A/i,":"),e+="@")
var t=this.protocol||"",r=this.pathname||"",n=this.hash||"",i=!1,o=""
this.host?i=e+this.host:this.hostname&&(i=e+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(i+=":"+this.port)),this.query&&u(this.query)&&Object.keys(this.query).length&&(o=S.stringify(this.query))
var s=this.search||o&&"?"+o||""
return t&&":"!==t.substr(-1)&&(t+=":"),this.slashes||(!t||A[t])&&i!==!1?(i="//"+(i||""),r&&"/"!==r.charAt(0)&&(r="/"+r)):i||(i=""),n&&"#"!==n.charAt(0)&&(n="#"+n),s&&"?"!==s.charAt(0)&&(s="?"+s),r=r.replace(/[?#]/g,function(e){return encodeURIComponent(e)}),s=s.replace("#","%23"),t+i+r+s+n},n.prototype.resolve=function(e){return this.resolveObject(i(e,!1,!0)).format()},n.prototype.resolveObject=function(e){if(c(e)){var t=new n
t.parse(e,!1,!0),e=t}var r=new n
if(Object.keys(this).forEach(function(e){r[e]=this[e]},this),r.hash=e.hash,""===e.href)return r.href=r.format(),r
if(e.slashes&&!e.protocol)return Object.keys(e).forEach(function(t){"protocol"!==t&&(r[t]=e[t])}),A[r.protocol]&&r.hostname&&!r.pathname&&(r.path=r.pathname="/"),r.href=r.format(),r
if(e.protocol&&e.protocol!==r.protocol){if(!A[e.protocol])return Object.keys(e).forEach(function(t){r[t]=e[t]}),r.href=r.format(),r
if(r.protocol=e.protocol,e.host||E[e.protocol])r.pathname=e.pathname
else{for(var i=(e.pathname||"").split("/");i.length&&!(e.host=i.shift()););e.host||(e.host=""),e.hostname||(e.hostname=""),""!==i[0]&&i.unshift(""),i.length<2&&i.unshift(""),r.pathname=i.join("/")}if(r.search=e.search,r.query=e.query,r.host=e.host||"",r.auth=e.auth,r.hostname=e.hostname||e.host,r.port=e.port,r.pathname||r.search){var o=r.pathname||"",s=r.search||""
r.path=o+s}return r.slashes=r.slashes||e.slashes,r.href=r.format(),r}var a=r.pathname&&"/"===r.pathname.charAt(0),u=e.host||e.pathname&&"/"===e.pathname.charAt(0),f=u||a||r.host&&e.pathname,p=f,d=r.pathname&&r.pathname.split("/")||[],i=e.pathname&&e.pathname.split("/")||[],g=r.protocol&&!A[r.protocol]
if(g&&(r.hostname="",r.port=null,r.host&&(""===d[0]?d[0]=r.host:d.unshift(r.host)),r.host="",e.protocol&&(e.hostname=null,e.port=null,e.host&&(""===i[0]?i[0]=e.host:i.unshift(e.host)),e.host=null),f=f&&(""===i[0]||""===d[0])),u)r.host=e.host||""===e.host?e.host:r.host,r.hostname=e.hostname||""===e.hostname?e.hostname:r.hostname,r.search=e.search,r.query=e.query,d=i
else if(i.length)d||(d=[]),d.pop(),d=d.concat(i),r.search=e.search,r.query=e.query
else if(!h(e.search)){if(g){r.hostname=r.host=d.shift()
var m=r.host&&r.host.indexOf("@")>0?r.host.split("@"):!1
m&&(r.auth=m.shift(),r.host=r.hostname=m.shift())}return r.search=e.search,r.query=e.query,l(r.pathname)&&l(r.search)||(r.path=(r.pathname?r.pathname:"")+(r.search?r.search:"")),r.href=r.format(),r}if(!d.length)return r.pathname=null,r.search?r.path="/"+r.search:r.path=null,r.href=r.format(),r
for(var v=d.slice(-1)[0],b=(r.host||e.host)&&("."===v||".."===v)||""===v,y=0,w=d.length;w>=0;w--)v=d[w],"."==v?d.splice(w,1):".."===v?(d.splice(w,1),y++):y&&(d.splice(w,1),y--)
if(!f&&!p)for(;y--;y)d.unshift("..")
!f||""===d[0]||d[0]&&"/"===d[0].charAt(0)||d.unshift(""),b&&"/"!==d.join("/").substr(-1)&&d.push("")
var _=""===d[0]||d[0]&&"/"===d[0].charAt(0)
if(g){r.hostname=r.host=_?"":d.length?d.shift():""
var m=r.host&&r.host.indexOf("@")>0?r.host.split("@"):!1
m&&(r.auth=m.shift(),r.host=r.hostname=m.shift())}return f=f||r.host&&d.length,f&&!_&&d.unshift(""),d.length?r.pathname=d.join("/"):(r.pathname=null,r.path=null),l(r.pathname)&&l(r.search)||(r.path=(r.pathname?r.pathname:"")+(r.search?r.search:"")),r.auth=e.auth||r.auth,r.slashes=r.slashes||e.slashes,r.href=r.format(),r},n.prototype.parseHost=function(){var e=this.host,t=d.exec(e)
t&&(t=t[0],":"!==t&&(this.port=t.substr(1)),e=e.substr(0,e.length-t.length)),e&&(this.hostname=e)}},{punycode:212,querystring:215}],230:[function(e,t,r){t.exports=function(e){return e&&"object"==typeof e&&"function"==typeof e.copy&&"function"==typeof e.fill&&"function"==typeof e.readUInt8}},{}],231:[function(e,t,r){(function(t,n){function i(e,t){var n={seen:[],stylize:s}
return arguments.length>=3&&(n.depth=arguments[2]),arguments.length>=4&&(n.colors=arguments[3]),g(t)?n.showHidden=t:t&&r._extend(n,t),_(n.showHidden)&&(n.showHidden=!1),_(n.depth)&&(n.depth=2),_(n.colors)&&(n.colors=!1),_(n.customInspect)&&(n.customInspect=!0),n.colors&&(n.stylize=o),c(n,e,n.depth)}function o(e,t){var r=i.styles[t]
return r?"["+i.colors[r][0]+"m"+e+"["+i.colors[r][1]+"m":e}function s(e,t){return e}function a(e){var t={}
return e.forEach(function(e,r){t[e]=!0}),t}function c(e,t,n){if(e.customInspect&&t&&S(t.inspect)&&t.inspect!==r.inspect&&(!t.constructor||t.constructor.prototype!==t)){var i=t.inspect(n,e)
return y(i)||(i=c(e,i,n)),i}var o=u(e,t)
if(o)return o
var s=Object.keys(t),g=a(s)
if(e.showHidden&&(s=Object.getOwnPropertyNames(t)),A(t)&&(s.indexOf("message")>=0||s.indexOf("description")>=0))return l(t)
if(0===s.length){if(S(t)){var m=t.name?": "+t.name:""
return e.stylize("[Function"+m+"]","special")}if(k(t))return e.stylize(RegExp.prototype.toString.call(t),"regexp")
if(E(t))return e.stylize(Date.prototype.toString.call(t),"date")
if(A(t))return l(t)}var v="",b=!1,w=["{","}"]
if(d(t)&&(b=!0,w=["[","]"]),S(t)){var _=t.name?": "+t.name:""
v=" [Function"+_+"]"}if(k(t)&&(v=" "+RegExp.prototype.toString.call(t)),E(t)&&(v=" "+Date.prototype.toUTCString.call(t)),A(t)&&(v=" "+l(t)),0===s.length&&(!b||0==t.length))return w[0]+v+w[1]
if(0>n)return k(t)?e.stylize(RegExp.prototype.toString.call(t),"regexp"):e.stylize("[Object]","special")
e.seen.push(t)
var x
return x=b?h(e,t,n,g,s):s.map(function(r){return f(e,t,n,g,r,b)}),e.seen.pop(),p(x,v,w)}function u(e,t){if(_(t))return e.stylize("undefined","undefined")
if(y(t)){var r="'"+JSON.stringify(t).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'"
return e.stylize(r,"string")}return b(t)?e.stylize(""+t,"number"):g(t)?e.stylize(""+t,"boolean"):m(t)?e.stylize("null","null"):void 0}function l(e){return"["+Error.prototype.toString.call(e)+"]"}function h(e,t,r,n,i){for(var o=[],s=0,a=t.length;a>s;++s)O(t,String(s))?o.push(f(e,t,r,n,String(s),!0)):o.push("")
return i.forEach(function(i){i.match(/^\d+$/)||o.push(f(e,t,r,n,i,!0))}),o}function f(e,t,r,n,i,o){var s,a,u
if(u=Object.getOwnPropertyDescriptor(t,i)||{value:t[i]},u.get?a=u.set?e.stylize("[Getter/Setter]","special"):e.stylize("[Getter]","special"):u.set&&(a=e.stylize("[Setter]","special")),O(n,i)||(s="["+i+"]"),a||(e.seen.indexOf(u.value)<0?(a=m(r)?c(e,u.value,null):c(e,u.value,r-1),a.indexOf("\n")>-1&&(a=o?a.split("\n").map(function(e){return"  "+e}).join("\n").substr(2):"\n"+a.split("\n").map(function(e){return"   "+e}).join("\n"))):a=e.stylize("[Circular]","special")),_(s)){if(o&&i.match(/^\d+$/))return a
s=JSON.stringify(""+i),s.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(s=s.substr(1,s.length-2),s=e.stylize(s,"name")):(s=s.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),s=e.stylize(s,"string"))}return s+": "+a}function p(e,t,r){var n=0,i=e.reduce(function(e,t){return n++,t.indexOf("\n")>=0&&n++,e+t.replace(/\u001b\[\d\d?m/g,"").length+1},0)
return i>60?r[0]+(""===t?"":t+"\n ")+" "+e.join(",\n  ")+" "+r[1]:r[0]+t+" "+e.join(", ")+" "+r[1]}function d(e){return Array.isArray(e)}function g(e){return"boolean"==typeof e}function m(e){return null===e}function v(e){return null==e}function b(e){return"number"==typeof e}function y(e){return"string"==typeof e}function w(e){return"symbol"==typeof e}function _(e){return void 0===e}function k(e){return x(e)&&"[object RegExp]"===T(e)}function x(e){return"object"==typeof e&&null!==e}function E(e){return x(e)&&"[object Date]"===T(e)}function A(e){return x(e)&&("[object Error]"===T(e)||e instanceof Error)}function S(e){return"function"==typeof e}function C(e){return null===e||"boolean"==typeof e||"number"==typeof e||"string"==typeof e||"symbol"==typeof e||"undefined"==typeof e}function T(e){return Object.prototype.toString.call(e)}function q(e){return 10>e?"0"+e.toString(10):e.toString(10)}function j(){var e=new Date,t=[q(e.getHours()),q(e.getMinutes()),q(e.getSeconds())].join(":")
return[e.getDate(),N[e.getMonth()],t].join(" ")}function O(e,t){return Object.prototype.hasOwnProperty.call(e,t)}var L=/%[sdj%]/g
r.format=function(e){if(!y(e)){for(var t=[],r=0;r<arguments.length;r++)t.push(i(arguments[r]))
return t.join(" ")}for(var r=1,n=arguments,o=n.length,s=String(e).replace(L,function(e){if("%%"===e)return"%"
if(r>=o)return e
switch(e){case"%s":return String(n[r++])
case"%d":return Number(n[r++])
case"%j":try{return JSON.stringify(n[r++])}catch(t){return"[Circular]"}default:return e}}),a=n[r];o>r;a=n[++r])s+=m(a)||!x(a)?" "+a:" "+i(a)
return s},r.deprecate=function(e,i){function o(){if(!s){if(t.throwDeprecation)throw new Error(i)
t.traceDeprecation?console.trace(i):console.error(i),s=!0}return e.apply(this,arguments)}if(_(n.process))return function(){return r.deprecate(e,i).apply(this,arguments)}
if(t.noDeprecation===!0)return e
var s=!1
return o}
var R,I={}
r.debuglog=function(e){if(_(R)&&(R=t.env.NODE_DEBUG||""),e=e.toUpperCase(),!I[e])if(new RegExp("\\b"+e+"\\b","i").test(R)){var n=t.pid
I[e]=function(){var t=r.format.apply(r,arguments)
console.error("%s %d: %s",e,n,t)}}else I[e]=function(){}
return I[e]},r.inspect=i,i.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},i.styles={special:"cyan",number:"yellow","boolean":"yellow",undefined:"grey","null":"bold",string:"green",date:"magenta",regexp:"red"},r.isArray=d,r.isBoolean=g,r.isNull=m,r.isNullOrUndefined=v,r.isNumber=b,r.isString=y,r.isSymbol=w,r.isUndefined=_,r.isRegExp=k,r.isObject=x,r.isDate=E,r.isError=A,r.isFunction=S,r.isPrimitive=C,r.isBuffer=e("./support/isBuffer")
var N=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
r.log=function(){console.log("%s - %s",j(),r.format.apply(r,arguments))},r.inherits=e("inherits"),r._extend=function(e,t){if(!t||!x(t))return e
for(var r=Object.keys(t),n=r.length;n--;)e[r[n]]=t[r[n]]
return e}}).call(this,e("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./support/isBuffer":230,_process:211,inherits:209}]},{},[2])
