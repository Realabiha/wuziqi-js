const content = document.querySelector('.content');
const form = document.querySelector('form');
const text = document.querySelector('input[type=text]');
const chat = document.querySelector('.chat');

const handleSend = function(e){
    e.preventDefault();
    const msg = `${socket.id.substring(0, 4)}: ${text.value}`;
    socket.emit('msg', msg);
    createMsgDiv(msg)
    scrollDown();
    form.reset();
}
const handleFocus = function(){
    console.log('focus');
    scrollDown();
}
const handleScroll = function(){}

form.addEventListener('submit', handleSend, {});
text.addEventListener('focus', handleFocus, {});
content.addEventListener('scroll', handleScroll, {});


socket.on('msg', msg => createMsgDiv(msg, '../sound/ding.wav'));

function scrollDown(){
    content.scrollTop = content.scrollHeight;
}
function createMsgDiv(msg, src){
    const pos = socket.id.substring(0, 4) == msg.split(':')[0] ? 'right' : 'left';
    const div = document.createElement('div');
    div.classList.add('input');
    div.style.wordWrap = 'break-word';
    div.setAttribute('pos', pos);
    div.textContent = msg;
    src ? playMusic(src) : '';
    content.appendChild(div);
}







