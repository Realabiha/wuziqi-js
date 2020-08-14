const list = document.querySelector('.list');
// 当前在线用户
let users = [];
// 主动邀请
const handleInvite = function(){
    if(userConfig.AI || !userConfig.online) return new MsgBox('请开启线上模式关闭AI模式');
    if(playConfig.onPlay || playConfig.isInviting) return new MsgBox('邀请或游戏中', '../sound/msg.mp3');
    playConfig.player = this.dataset.id;
    const result = window.confirm(`是否邀请${this.dataset.id.substring(0, 4)}？`);
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
function updateUserList(users){
    list.innerHTML =  users
    .filter(u => u !== socket.id)
    // .map(u => u.substring(0, 4))
    .reduce((init, u) => init += `<li data-id=${u} title="点击邀请下棋">${u.substring(0, 4)}</li>`, `<h4>在线${users.length}人</h4>`)
}
// 主动邀请确认
function handleConfirm(){
    playConfig.isInviting = true;
    socket.emit('invite', `${socket.id}|${this.dataset.id}`)
}
function handleCancel(){
    playConfig.isInviting = false;
    const txt = '挑战已取消'; 
    new MsgBox(txt, '../sound/msg.mp3');
}
// 应答他人邀请
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
