// click
// 2 = 黑棋 |  1 = 白棋  
const socket = io();
const GRIDROW = 16, GRIDCOLUMN = 16;
const chess = document.querySelector('.chess');
let grids = [], 
    count = 1, 
    result = false,  
    AI = false, 
    online = false, 
    done = false; // 对手回合是否落子
const handleClick = function(e){
    const {$x, $y} = this;
    if(this.$value) return;
    if(online){
        socket.emit('play', `${$x}|${$y}`);
        if(done) return;
        done = true;
    }
    // Ai下棋
    if(count % 2 + 1 === 1 && AI) return;
    
    playChess.call(this, $x, $y, 0);
}

for(let i = 0; i < GRIDROW; i ++){
    grids[i] = [];
    for(let j = 0; j < GRIDCOLUMN; j ++){
        grids[i][j] = createGrid(i, j);
        chess.appendChild(grids[i][j]);
        grids[i][j].addEventListener('click', handleClick, {once: true});
    }
}

function createGrid(x, y){
    let grid = document.createElement('div');
    grid.classList.add('light');
    grid.style.left = `${y*60 + 30}px`;
    grid.style.top = `${x*60 + 30}px`;
    grid.$value = 0;
    grid.$y = y;
    grid.$x = x;
    return grid;
}
function playChess(x, y, socket = 1){
    count = online ? localStorage.getItem('count') : count;
    const flag = count % 2 + 1;
    renderGrid(grids, x, y, flag);
    count ++;
    if(socket){
        localStorage.setItem('count', count);
        done = false;
    }
    result = checkResult(grids, GRIDROW, GRIDCOLUMN);
    if(result){
        console.log('比赛结束') 
    }else{
        // miniMax(grids, GRIDROW, GRIDCOLUMN, 1, false);
        
    }
}


// socket
const content = document.querySelector('.content');
const form = document.querySelector('form');
const text = document.querySelector('input[type=text]');
let user;
const handleSend = function(e){
    e.preventDefault();
    const msg = `${user}: ${text.value}`;
    socket.emit('msg', msg);
    createMsgDiv(msg)
    scrollDown();
    form.reset();
}
const handleFocus = function(){
    scrollDown();
}

form.addEventListener('submit', handleSend, {});
text.addEventListener('focus', handleFocus, {});

socket.on('connect', _ => {
    user = Date.now();
    socket.emit('login', user);
    socket.on('msg', msg => {
       createMsgDiv(msg);           
    });
    socket.on('login', user => {
        const p = document.createElement('p');
        p.classList.add('broadcast');
        p.innerHTML = `${JSON.parse(user)}进入了游戏`;
        content.appendChild(p);
    });
    socket.on('play', play => {
        console.log(play, 'play');
        const temp = play.split('|');
        playChess(temp[0], temp[1]);
    });
    socket.on('out', user => {
        const p = document.createElement('p');
        p.classList.add('broadcast');
        p.innerHTML = `${user}离开了游戏`;
        content.appendChild(p);
    })
    // 每次修改代码保存之后会触发重连
    socket.on('reconnect', _ => {
        console.log('reconnect');
    })
})

function scrollDown(){
    document.documentElement.scrollTop = content.scrollHeight;
}
function createMsgDiv(msg){
    console.log(user, msg)
    const pos = user == msg.split(':')[0] ? 'right' : 'left';
    const div = document.createElement('div');
    div.classList.add('input');
    div.setAttribute('pos', pos);
    div.innerHTML = msg;
    content.appendChild(div);
}

socket.on('disconnect', _ => {
    // 调用api断开
})
