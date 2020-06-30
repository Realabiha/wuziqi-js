const express = require('express');
const app = express();
const hbs = require('hbs');

// 设置模板引擎
app.set('view engine', 'html');
// 使用html后缀
app.engine('html', hbs.__express);
// 设置文件路径
app.set('views', __dirname);
// 设置静态资源路径
app.use(express.static('public'));


app.use('/', (req, res, next) => {
    res.render('index');
})

app.use('/*', (req, res) => {
    res.send('NOT FOUND');
})

app.listen(process.env.PORT || 8686, _ => {
    console.log('server is running!')
})