const socket = io();

// 链接
socket.on('connect', _ => {
    console.log(socket.id, 'id');
})
// listen and emit event
socket.on('login', user => {
    const txt = `${user.substring(0, 4)}进入频道`;
    new MsgBox(txt, './sound/msg.mp3');
});
socket.on('out', user => {
    const txt = `${user.substring(0, 4)}离开频道`;
    new MsgBox(txt, './sound/msg.mp3');
})
// 重连
socket.on('reconnect', _ => {
    console.log('reconnect');
})
// 断开
socket.on('disconnect', _ => {
    console.log('disconnect');
})