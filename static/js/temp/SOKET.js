const socket = io();
const content = document.querySelector('.content');
const form = document.querySelector('form');
const text = document.querySelector('input[type=text]');
const chat = document.querySelector('.chat');
const list = document.querySelector('.list');

const audio = document.querySelector('label[for=audio]');
const video = document.querySelector('label[for=video]');
const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
const RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
const RTCPC = new RTCPeerConnection();


// 当前在线用户
let users = [];
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


const handleMedia = async function(){
    let val = this.getAttribute('for');
    val === 'audio' ? liveConfig.video = false : '';
    if(liveConfig.isCalling || liveConfig.onLive)
    return new MsgBox('邀请或聊天中', '../sound/msg.mp3');
    const {player: to} = JSON.parse(localStorage.getItem('play'));
    const result = window.confirm(`是否邀请${to.substring(0, 4)}聊天？`);
    result ? await handleSure(to) : handleRefuse();
}


const handleScroll = function(){}
// 主动邀请
const handleInvite = function(){
    if(userConfig.AI || !userConfig.online) return new MsgBox('请开启线上模式关闭AI模式');
    if(playConfig.onPlay || playConfig.isInviting) return new MsgBox('邀请或游戏中', '../sound/msg.mp3');
    playConfig.player = this.dataset.id;
    const result = window.confirm(`是否邀请${this.dataset.id.substring(0, 4)}？`);
    result ? handleConfirm.call(this) : handleCancel.call(this);
}
const handleTrack = function(e){
    console.log(e, 'remote')
    console.log(RTCPC.signalingState, 'state'); //stable
    const v = document.querySelector('.online');
    const SRC_OBJECT = 'srcObject' in v ? "srcObject" :
        'mozSrcObject' in v ? "mozSrcObject" :
        'webkitSrcObject' in v ? "webkitSrcObject" : "srcObject";
    v[SRC_OBJECT] = e.streams[0];
}
form.addEventListener('submit', handleSend, {});
text.addEventListener('focus', handleFocus, {});
audio.addEventListener('change', handleMedia, {});
video.addEventListener('change', handleMedia, {});
content.addEventListener('scroll', handleScroll, {});
RTCPC.addEventListener('track', handleTrack, {});
delegate('click', list, '.list li', handleInvite);

// 链接
socket.on('connect', _ => {
    // console.log(socket.id, 'id');
})
// listen and emit event
socket.on('msg', msg => createMsgDiv(msg, '../sound/ding.wav'));
socket.on('login', user => {
    const txt = `${user.substring(0, 4)}进入频道`;
    new MsgBox(txt, '../sound/msg.mp3');
});
// 当前活动用户
socket.on('users', data => {
    users = JSON.parse(data);
    updateUserList(users);
})

// 游戏被邀请
socket.on('invite', msg => {
    if(playConfig.onPlay) return new MsgBox('你在柚子中', '../sound/msg.mp3');
    const temp = msg.split('|');
    const result = window.confirm(`${temp[0].substring(0, 4)}正在挑战你，是否接受？`)
    if(result){
        playConfig.player = temp[0];
        localStorage.setItem('play', JSON.stringify(playConfig));
        inviteConfirm(temp[0]); 
        playConfig.onPlay = true;
        return;
    }
    inviteCancel(temp[0])
})
// 游戏主动邀请结果
socket.on('answer', msg => {
    const temp = msg.split('|');
    playConfig.player = temp[0];
    temp[0] = temp[0].substring(0, 4);
    if(temp[2] === '1'){
        localStorage.setItem('play', JSON.stringify(playConfig));
        playConfig.onPlay = true;
        new MsgBox(`${temp[0]}已接受`, '../sound/msg.mp3') 
        return;
    }
    playConfig.isInviting = false;
    new MsgBox(`${temp[0]}已拒绝`, '../sound/msg.mp3') 
})
// 游戏线上模式对手落子
socket.on('play', play => {
    const temp = play.split('|');
    // playConfig.player = temp[2];
    playChess(temp[0], temp[1]);
});


// 音视频被邀请
socket.on('call', async obj => {
    if(liveConfig.onLive) return new MsgBox('你在聊天中', '../sound/msg.mp3');
    obj = JSON.parse(obj)
    const result = window.confirm(`${obj.from.substring(0, 4)}正在邀请你聊天？`)
    result ? await callSure(obj) : callRefuse(obj);

})
socket.on('response', async obj => {
    const {answer, from, to} = JSON.parse(obj);
    console.log(RTCPC.signalingState, 'state')  // have-local-offer
    await RTCPC.setRemoteDescription(new RTCSessionDescription(answer));
})

socket.on('out', user => {
    const txt = `${user.substring(0, 4)}离开频道`;
    new MsgBox(txt, '../sound/msg.mp3');
})
// 重连
socket.on('reconnect', _ => {
    console.log('reconnect');
})
// 断开
socket.on('disconnect', _ => {
    console.log('disconnect');
})


function scrollDown(){
    content.scrollTop = content.scrollHeight;
}
function createMsgDiv(msg, src){
    const pos = socket.id.substring(0, 4) == msg.split(':')[0] ? 'right' : 'left';
    const div = document.createElement('div');
    div.classList.add('input');
    div.setAttribute('pos', pos);
    div.textContent = msg;
    src ? playMusic(src) : '';
    content.appendChild(div);
}
function updateUserList(users){
    list.innerHTML =  users
    .filter(u => u !== socket.id)
    // .map(u => u.substring(0, 4))
    .reduce((init, u) => init += `<li data-id=${u} title="点击邀请下棋">${u.substring(0, 4)}</li>`, `<h4>在线${users.length}人</h4>`)
}


async function getLocalMedia(){
    const GET_USER_MEDIA = navigator.getUserMedia ? "getUserMedia" :
        navigator.mozGetUserMedia ? "mozGetUserMedia" :
        navigator.webkitGetUserMedia ? "webkitGetUserMedia" : "getUserMedia";
    const v = document.querySelector('.local');
    const SRC_OBJECT = 'srcObject' in v ? "srcObject" :
        'mozSrcObject' in v ? "mozSrcObject" :
        'webkitSrcObject' in v ? "webkitSrcObject" : "srcObject";
    const {audio, video} = liveConfig;
    const stream = await navigator.mediaDevices[GET_USER_MEDIA]({audio, video});
    v.style.width = 360 + 'px';
    v.srcObject = stream;
    stream.getTracks().forEach(track => RTCPC.addTrack(track, stream));
}

// 确认邀请
function handleConfirm(){
    playConfig.isInviting = true;
    socket.emit('invite', `${socket.id}|${this.dataset.id}`)
}
function handleCancel(){
    playConfig.isInviting = false;
    const txt = '挑战已取消'; 
    new MsgBox(txt, '../sound/msg.mp3');
}
async function handleSure(to){
    console.log(to, 'to');
    liveConfig.isCalling = true;
    const { id: from} = socket;
    await getLocalMedia(to);
    const offer = await RTCPC.createOffer();
    await RTCPC.setLocalDescription(new RTCSessionDescription(offer)); 
    socket.emit('call', JSON.stringify({offer, from, to}))
}
function handleRefuse(){
    liveConfig.isCalling = false;
    const txt = '邀请已取消'; 
    new MsgBox(txt, '../sound/msg.mp3');
}

// 应答
function inviteConfirm(id){
    const txt = '挑战已接受'; 
    new MsgBox(txt, '../sound/msg.mp3');
    socket.emit('answer', `${socket.id}|${id}|1`)
}
function inviteCancel(id){
    const txt = '挑战已拒绝'; 
    new MsgBox(txt, '../sound/msg.mp3');
    socket.emit('answer', `${socket.id}|${id}|0`)
}
async function callSure({offer, from, to}){
    console.log(to === socket.id, 'to');
    liveConfig.onLive = true;
    await RTCPC.setRemoteDescription(new RTCSessionDescription(offer));
    console.log(RTCPC.signalingState) // have-remote-offer
    const answer = await RTCPC.createAnswer();
    await RTCPC.setLocalDescription(answer);
    socket.emit('response', JSON.stringify({answer, from, to}));
    const txt = '已接受邀请'
    new MsgBox(txt, '../sound/msg.mp3');
}
function callRefuse(){
    liveConfig.onLive = false;   
    const txt = '已拒绝邀请'
    new MsgBox(txt, '../sound/msg.mp3');
}