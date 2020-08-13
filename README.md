## 项目运行
1. npm install 安装依赖 
2. npm run dev 本地运行

目录|比容
--|--
node_modules|依赖包(npm install)
static|静态资源(js/css/img/sound)
.env|环境变量(dotenv)
.gitignore|git提交忽略项
app.js|服务端代码
index.html|模板(hbs)
package.json|依赖包版本信息
readme.md|readme

***项目依赖Node环境***

---

## 五子棋游戏功能点
1. 基于原生js的AI对战
2. 基本的UI交互
3. 基于socket.io的在线对战
4. 基于socket.io的实时聊天
5. 基于socket.io及WebRTC的实时音视频流（feature还在更新）
6. 其他。。。

[Socket.io官网](https://socket.io/docs/)
[WebRTC API(MDN中文)](https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API)
>一个基本的RTCPeerConnection使用需要协调本地机器以及远端机器的连接，它可以通过在两台机器间生成Session Description的数据交换协议来实现。呼叫方发送一个offer(请求)，被呼叫方发出一个answer（应答）来回答请求。双方-呼叫方以及被呼叫方，最开始的时候都要建立他们各自的RTCPeerConnection对象。


---

## socket.io

# socket|通讯基础
- 网络通讯模型中，socket的是一个比较抽象的存在，它位于TCP上层
- 三次握手建立通道(TCP)
- 没有http的格式(行、头、空行、体)限制，双方随时都能向对方发送任意类型消息，一方断开通道销毁
- HTTP和WebSocket通讯实质上也是基于socket通讯

# websocket|实时通讯
- 三次握手建立通道
- client预先发一次特殊http格式的消息(请求切换协议)，server相应一个特殊http格式的消息
>HTTP/1.1 101 Switching Protocols
>Upgrade: websocket 
>Connection: Upgrade

- 双方按照WebSocket协议自由通讯
- 任意一方断开，通道销毁 

# http|稳定通讯？
1. 三次握手建立通道
2. client发起http格式消息，server响应http格式消息
3. 任意一方断开四次挥手，通道销毁
>http 轮询和长连接也能模拟实时通讯
**轮询**类似于在client设定一个定时器一直向服务器发送请求，消耗双方性能
**长连接**头信息里connection: keep-alive 双方通讯完成后不会立即断开

---

## 浏览器端模块化
1. 在浏览器中通过给script元素的设置**MIME type** type=module告知浏览器是一个模块
2. 模块中可以使用关键字import和export
3. 模块中自动使用严格模式并且会创建独立的作用域
4. 模块默认以defer形式加载，async对内嵌式script也生效
5. 模块加载有跨域限制，路径可以是完整路径或者以/ ./ ../开头的相对路径

---


**END**