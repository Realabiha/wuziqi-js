// 当前在线用户
let users = [];
// 主动邀请
const handleInvite = function(){
    if(userConfig.AI || !userConfig.online) return new MsgBox('当前模式AI');
    if(playConfig.onPlay || playConfig.isInviting) return new MsgBox('邀请或游戏中', './sound/msg.mp3');
    const { id: to } = this.dataset;
    const result = window.confirm(`是否邀请${to.substring(0, 4)}？`);
    result ? handleConfirm.call(this) : handleCancel.call(this);
}
delegate('click', list, '.list li', handleInvite);
// 当前活动用户
socket.on('users', data => {
    users = JSON.parse(data);
    updateUserList(users);
})
// 游戏被邀请
socket.on('invite', msg => {
    const { from, to } = JSON.parse(msg);
    if(playConfig.onPlay || playConfig.isInviting){
        const sessionData = sessionStorage.getItem('play');
        if(sessionData === null) return socket.emit('busy', msg);
        const { from: last } = JSON.parse(sessionData);
        if(last !== from) return socket.emit('busy', msg);
    } 
    const result = window.confirm(`${from.substring(0, 4)}正在挑战你，是否接受？`)
    result ? inviteConfirm({from, to}) : inviteCancel({from, to}); 
})
// 游戏主动邀请结果
socket.on('answer', msg => {
    const { from ,to, answer } = JSON.parse(msg);
    console.log(answer, 'answer');
    if(answer === 1){
        playConfig.onPlay = true;
        playConfig.from = from;
        playConfig.to = to;
        chess.classList.remove('hide');
        user.classList.remove('hidden');
        // audio.style.display = 'inline-block';
        video.style.display = 'inline-block';
        sessionStorage.setItem('play', JSON.stringify(playConfig));
        new MsgBox(`${to.substring(0, 4)}已接受`, './sound/msg.mp3') 
        return;
    }
    playConfig.onPlay = false;
    playConfig.isInviting = false;
    playConfig.from = '';
    playConfig.to = '';
    new MsgBox(`${to.substring(0, 4)}已拒绝`, './sound/msg.mp3') 
})
// 对方邀请或游戏中
socket.on('busy', msg => {
    playConfig.isInviting = false;
    playConfig.onPlay = false;
    const { from, to } = JSON.parse(msg);
    const txt = `${to.substring(0, 4)}邀请或游戏中`
    new MsgBox(txt, './sound/msg.mp3');
})
// 游戏线上模式对手落子
socket.on('play', play => {
    const temp = play.split('|');
    playChess(temp[0], temp[1]);
});
function updateUserList(users){
    list.innerHTML =  users
    .filter(u => u !== socket.id)
    // .map(u => u.substring(0, 4))
    .reduce((init, u) => init += `<li data-id=${u} title="点击邀请对战">${u.substring(0, 4)}</li>`, `<h4>在线${users.length}人</h4>`)
}
// 主动邀请确认
function handleConfirm(){
    playConfig.isInviting = true;
    const { id: from } = socket;
    const { id: to } = this.dataset;
    socket.emit('invite', JSON.stringify({from, to}));
}
function handleCancel(){
    playConfig.isInviting = false;
    const txt = '挑战已取消'; 
    new MsgBox(txt, './sound/msg.mp3');
}
// 应答他人邀请
function inviteConfirm({from, to}){
    playConfig.onPlay = true;
    playConfig.from = from;
    playConfig.to = to;
    chess.classList.remove('hide');
    user.classList.remove('hidden');
    // audio.style.display = 'inline-block';
    video.style.display = 'inline-block';
    console.dir(video, 'video');
    sessionStorage.setItem('play', JSON.stringify(playConfig));
    const txt = '挑战已接受'; 
    new MsgBox(txt, './sound/msg.mp3');
    socket.emit('answer', JSON.stringify({from, to, answer: 1}));
}
function inviteCancel(msg){
    playConfig.onPlay = false;
    playConfig.from = '';
    playConfig.to = '';
    msg.answer = 0;
    const txt = '挑战已拒绝'; 
    new MsgBox(txt, './sound/msg.mp3');
    socket.emit('answer', JSON.stringify(msg));
}
