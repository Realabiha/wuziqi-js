const socket = io();
const content = document.querySelector('.content');
const form = document.querySelector('form');
const text = document.querySelector('input[type=text]');
const chat = document.querySelector('.chat');
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
const handleScroll = function(){}
form.addEventListener('submit', handleSend, {});
text.addEventListener('focus', handleFocus, {});
content.addEventListener('scroll', handleScroll, {});

socket.on('connect', _ => {
    console.log(socket.id, 'id');
    user = `${Date.now()}`;
    user = user.substring(user.length-4);
    socket.emit('login', user);
    socket.on('msg', msg => createMsgDiv(msg, '../sound/ding.wav'));
    socket.on('login', user => {
        const temp = user.split('|');
        const txt = `${temp[0]}${temp[1] === 'watcher' ? '开始观战' : '进入频道'}`;
        new MsgBox(txt, '../sound/msg.mp3');
        localStorage.setItem('role', temp[1]);
    });
    socket.on('play', play => {
        const temp = play.split('|');
        playChess(temp[0], temp[1]);
    });
    socket.on('out', user => {
        const txt = `${user}离开频道`;
        new MsgBox(txt, '../sound/msg.mp3');
    })
    // 每次修改代码保存之后会触发重连
    socket.on('reconnect', _ => {
        console.log('reconnect');
    })
})

function scrollDown(){
    content.scrollTop = content.scrollHeight;
}
function createMsgDiv(msg, src){
    const pos = user == msg.split(':')[0] ? 'right' : 'left';
    const div = document.createElement('div');
    div.classList.add('input');
    div.setAttribute('pos', pos);
    div.textContent = msg;
    src ? playMusic(src) : '';
    content.appendChild(div);
}
socket.on('disconnect', _ => {
    // 调用api断开
})