const http = require('http');
const express = require('express');
const app = express();
const hbs = require('hbs');

const server = http.createServer(app);
const IO = require('socket.io')(server);
const port = process.env.PORT || 8686;

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
    socket.emit('msg', 'hello client');
    socket.on('push', msg => {})
    socket.broadcast.emit('notice', 'who is comming')
    socket.on('disconnect', _ => {
        socket.broadcast.emit('notice', 'who is left')
    })
})
IO.on('disconnect', socket => {
})
server.listen(port, _ => {
    console.log(`server is running at port ${port}!`)
})
