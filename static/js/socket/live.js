const audio = document.querySelector('label[for=audio]');
const video = document.querySelector('label[for=video]');
const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
const RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
const RTCPC = new RTCPeerConnection();

// RTCPC.sctp()
// RTCPC = null

const handleMedia = async function(){
    let val = this.getAttribute('for');
    val === 'audio' ? liveConfig.video = false : '';
    if(liveConfig.isCalling || liveConfig.onLive)
    return new MsgBox('邀请或聊天中', '../sound/msg.mp3');
    const {player: to} = JSON.parse(localStorage.getItem('play'));
    const result = window.confirm(`是否邀请${to.substring(0, 4)}聊天？`);
    if(result){
        await getLocalMedia();
        handleSure(to)
        return;
    }
    handleRefuse();
}
const handleTrack = function(e){
    const v = document.querySelector('.online');
    const SRC_OBJECT = 'srcObject' in v ? "srcObject" :
        'mozSrcObject' in v ? "mozSrcObject" :
        'webkitSrcObject' in v ? "webkitSrcObject" : "srcObject";
    v.style.width = '100%';
    v[SRC_OBJECT] = e.streams[0];
}

// after getMedia addTrack fire
const handleNeed = async function(e){
    const { id: from} = socket;
    const {player: to} = JSON.parse(localStorage.getItem('play'));
    console.log(e, 'e');
    const offer = await RTCPC.createOffer();
    console.log(offer, 'offer');
    await RTCPC.setLocalDescription(new RTCSessionDescription(offer)); 
    socket.emit('call', JSON.stringify({offer, from, to}))

}
audio.addEventListener('change', handleMedia, {});
video.addEventListener('change', handleMedia, {});
RTCPC.addEventListener('track', handleTrack, {});
// RTCPC.addEventListener('negotiationneeded', handleNeed, {})

// 音视频被邀请
socket.on('call', obj => {
    obj = JSON.parse(obj)
    if(!liveConfig.isCalling){
        const result = window.confirm(`${obj.from.substring(0, 4)}正在邀请你聊天？`)
        result ? callSure(obj) : callRefuse(obj);
        return;
    }
    callSure(obj);
})
socket.on('response', async obj => {
    const {answer, from, to} = JSON.parse(obj);
    await RTCPC.setRemoteDescription(new RTCSessionDescription(answer));
    handleSure(to);
})

async function getLocalMedia(){
    const v = document.querySelector('.local');
    const SRC_OBJECT = 'srcObject' in v ? "srcObject" :
        'mozSrcObject' in v ? "mozSrcObject" :
        'webkitSrcObject' in v ? "webkitSrcObject" : "srcObject";
    const {audio, video} = liveConfig;
    console.log(video, 'video');
    const stream = await navigator.mediaDevices.getUserMedia({audio, video});
    v.style.width = 360 + 'px';
    v[SRC_OBJECT] = stream;
    stream.getTracks().forEach(track => RTCPC.addTrack(track, stream));
}
// getLocalMedia();
// 确认邀请
async function handleSure(to){
    !liveConfig.isCalling && (liveConfig.isCalling = true);
    const { id: from} = socket;
    const offer = await RTCPC.createOffer();
    await RTCPC.setLocalDescription(new RTCSessionDescription(offer)); 
    socket.emit('call', JSON.stringify({offer, from, to}))
}
function handleRefuse(){
    liveConfig.isCalling = false;
    const txt = '邀请已取消'; 
    new MsgBox(txt, '../sound/msg.mp3');
}
// 接受邀请
async function callSure({offer, from, to}){
    !liveConfig.isCalling && (liveConfig.isCalling = true);
    await getLocalMedia();
    await RTCPC.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await RTCPC.createAnswer();
    await RTCPC.setLocalDescription(answer);
    socket.emit('response', JSON.stringify({answer, from, to}));
}
function callRefuse(){
    liveConfig.onLive = false;   
    const txt = '已拒绝邀请'
    new MsgBox(txt, '../sound/msg.mp3');
}