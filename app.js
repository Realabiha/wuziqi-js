const http = require('http');
const express = require('express');
const app = express();
const hbs = require('hbs');

const server = http.createServer(app);
const IO = require('socket.io')(server);
const port = process.env.PORT || 8686;

let users = [];

// 设置模板引擎
app.set('view engine', 'html');
// 使用html后缀
app.engine('html', hbs.__express);
// 设置文件路径
app.set('views', __dirname);
// 设置静态资源路径

app.use(express.static('static'));

app.use('/', (req, res) => {
    res.render('index', {title: '五子棋'});
})


IO.on('connection', socket => {
    socket.on('login', user => {
        users.push({id: user})
        const len = users.length;
        socket.$user = user;
        socket.role = len > 2 ? 'watcher' : 'player';
        broadcastSocketMsg(socket, 'login', `${user}|${socket.role}`);
    })
    socket.on('msg', msg => {
        broadcastSocketMsg(socket, 'msg', msg);
    })
    socket.on('play', msg => {
        socket.role === 'player' && broadcastSocketMsg(socket, 'play', msg);
    })
    socket.on('disconnect', function(){
        const id = socket.$user;
        users = getOnlineUsers(id)
        broadcastSocketMsg(socket, 'out', id);
    })
})


function getOnlineUsers(id){
    return users.filter(user => user.id !== id);
}
function broadcastSocketMsg(socket, type, msg){
    socket.broadcast.emit(type, msg);
}

server.listen(port, _ => {
    console.log(`server is running at port ${port}!`)
})

IO.on('disconnect', socket => {
    // 调用api断开
})
