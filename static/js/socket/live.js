const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
const RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
const RTCPC = new RTCPeerConnection();

// RTCPC.sctp()
// RTCPC = null

const handleMedia = function(){
    let val = this.getAttribute('for');
    liveConfig.video = !(val === 'audio'); 
    if(liveConfig.isCalling || liveConfig.onLive)
    return new MsgBox('邀请或聊天中', '../sound/msg.mp3');
    const sessionData = sessionStorage.getItem('play');
    let { from, to } = sessionData && JSON.parse(sessionData);
    to = to === socket.id ? from : to;
    const result = window.confirm(`是否邀请${to.substring(0, 4)}聊天？`);
    if(result){
        getLocalMedia(socket);
        handleSure(to)
        return;
    }
    handleRefuse();
}
const handleTrack = function(e){
    const sessionData = sessionStorage.getItem('play');
    let { from, to } = sessionData && JSON.parse(sessionData);
    to = to === socket.id ? from : to;
    const v = document.querySelector('.online');
    const stream = e.streams[0];
    v.style.width = '100%';
    if('srcObject' in v){
        v.srcObject = stream;
    }else{
        v.src = window.URL.createObjectURL(stream);
    }
}

// audio.addEventListener('change', handleMedia, {});
video.addEventListener('change', handleMedia, {});
RTCPC.addEventListener('track', handleTrack, {});

// 音视频被邀请
socket.on('call', obj => {
    obj = JSON.parse(obj)
    if(!liveConfig.isCalling && !liveConfig.onLive){
        const result = window.confirm(`${obj.from.substring(0, 4)}正在邀请你聊天？`)
        result ? callSure(obj) : callRefuse(obj);
    }
    callSure(obj);
})
socket.on('response', async obj => {
    liveConfig.onLive = true;
    live.classList.remove('hide');
    const {answer, from, to} = JSON.parse(obj);
    await RTCPC.setRemoteDescription(new RTCSessionDescription(answer));
    video.style.display = 'none';
    handleSure(to);
})
socket.on('busy', msg => {})

async function getLocalMedia(id){
    const v = document.querySelector('.local');
    const {audio, video} = liveConfig;
    if(navigator.mediaDevices.getUserMedia === undefined){
        navigator.mediaDevices = {};
        Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
            configurable: true,
            enumerable: true,
            get(){
                const getMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                return getMedia ? getMedia.bind(navigator, {audio, video}) : Promise.reject( '您的浏览器不支持getUserMedia接口');      
            },
            set(value){
                return value;
            }
        })
    }
    const stream = await navigator.mediaDevices.getUserMedia({audio, video});
    v.style.width = 360 + 'px';
    if('srcObject' in v){
        v.srcObject = stream;
    }else{
        v.src = window.URL.createObjectURL(stream);
    }
    stream.getTracks().forEach(track => RTCPC.addTrack(track, stream));
}
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
    !liveConfig.onLive && (liveConfig.onLive = true);
    live.classList.remove('hide');
    getLocalMedia();
    await RTCPC.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await RTCPC.createAnswer();
    await RTCPC.setLocalDescription(answer);
    socket.emit('response', JSON.stringify({answer, from, to}));
    video.style.display = 'none';
}   
function callRefuse(){
    liveConfig.onLive = false;   
    const txt = '已拒绝邀请'
    new MsgBox(txt, '../sound/msg.mp3');
}