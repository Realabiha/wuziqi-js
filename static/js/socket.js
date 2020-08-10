const socket = io();
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
    socket.on('msg', msg => createMsgDiv(msg));
    socket.on('login', user => {
        const p = document.createElement('p');
        p.classList.add('broadcast');
        const temp = user.split('|');
        const txt = temp[1] === 'watcher' ? '开始观战' : '进入游戏';
        p.textContent = `${temp[0]}${txt}`;
        content.appendChild(p);
        localStorage.setItem('role', temp[1]);
    });
    socket.on('play', play => {
        console.log(play, 'play');
        const temp = play.split('|');
        playChess(temp[0], temp[1]);
    });
    socket.on('out', user => {
        const p = document.createElement('p');
        p.classList.add('broadcast');
        p.textContent = `${user}离开频道`;
        content.appendChild(p);
    })
    // 每次修改代码保存之后会触发重连
    socket.on('reconnect', _ => {
        console.log('reconnect');
    })
})

function scrollDown(){
    document.documentElement.scrollBottom = content.scrollHeight;
}
function createMsgDiv(msg){
    console.log(user, msg)
    const pos = user == msg.split(':')[0] ? 'right' : 'left';
    const div = document.createElement('div');
    div.classList.add('input');
    div.setAttribute('pos', pos);
    div.textContent = msg;
    content.appendChild(div);
}
socket.on('disconnect', _ => {
    // 调用api断开
})