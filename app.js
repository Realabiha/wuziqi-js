const http = require('http');
const express = require('express');
const app = express();
const hbs = require('hbs');

const server = http.createServer(app);
const IO = require('socket.io')(server);
const port = process.env.PORT || 8686;

const users = [];

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
        socket.$user = user;
        users.push({
            id: user,
        })
        socket.broadcast.emit('login', JSON.stringify(`${user}`))
    })
    socket.on('msg', msg => {
        socket.broadcast.emit('msg', msg);
    })
    socket.on('play', msg => {
        socket.broadcast.emit('play', msg);
    })
    socket.on('disconnect', _ => {
        socket.broadcast.emit('out', socket.$user);
    })
})








server.listen(port, _ => {
    console.log(`server is running at port ${port}!`)
})

IO.on('disconnect', socket => {
    // 调用api断开
})
