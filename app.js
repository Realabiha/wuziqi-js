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
    // console.log(req.params.id);
    res.render('index', {title: '五子棋'});
})


IO.on('connection', socket => {
    const { id } = socket;
    listCheck(id) && users.push(id);
    socket.emit('users', `${JSON.stringify(users)}`);
    broadcastSocketMsg(socket, 'login', `${id}`);
    broadcastSocketMsg(socket, 'users', `${JSON.stringify(users)}`);

    // chat
    socket.on('msg', msg => {
        broadcastSocketMsg(socket, 'msg', msg);
    })

    // ganme
    socket.on('invite', msg => {
        const { from, to } = JSON.parse(msg);
        socket.to(to).emit('invite', msg);
    })
    socket.on('answer', msg => {
        const { from, to, answer } = JSON.parse(msg);
        socket.to(from).emit('answer', msg);
    })
    socket.on('busy', msg => {
        const { from, to } = JSON.parse(msg);
        socket.to(from).emit('busy', msg);
    })
    socket.on('play', msg => {
        const temp = msg.split('|');
        msg = `${temp[0]}|${temp[1]}|${socket.id}`
        socket.to(temp[2]).emit('play', msg);
    })

    // live
    socket.on('call', obj => {
        const {offer, from, to} = JSON.parse(obj);
        socket.to(to).emit('call', obj);
    })
    // response
    socket.on('response', obj => {
        const {answer, from, to} = JSON.parse(obj);
        console.log(to, 'to');
        socket.to(from).emit('response', obj);
    })

    // refresh or close fire disconnect
    socket.on('disconnect', function(){
        const { id } = socket;
        console.log('disconnect', id)
        users = getOnlineUsers(id)
        broadcastSocketMsg(socket, 'out', id);
        broadcastSocketMsg(socket, 'users', `${JSON.stringify(users)}`);
    })
})

IO.on('disconnect', socket => {
    // 调用api断开
})

server.listen(port, _ => {
    console.log(`server is running at port ${port}!`)
})



function getOnlineUsers(id){
    return users.filter(user => user !== id);
}
function broadcastSocketMsg(socket, type, msg){
    socket.broadcast.emit(type, msg);
}
function listCheck(id){
    return users.find(u => u === id) === undefined;
}


