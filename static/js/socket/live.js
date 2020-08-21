const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
const RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
let RTCPC = new RTCPeerConnection();

const handleMedia = function(e){
    const sessionData = sessionStorage.getItem('play');
    let { from, to } = sessionData && JSON.parse(sessionData);
    to = to === socket.id ? from : to;
    if(liveConfig.onLive){
        new MsgBox('你已挂断', './sound/msg.mp3');
        socket.emit('hangup', to);
        setTimeout(_ => {
            video.style.display = 'none';
            liveConfig.isCalling = false;
            liveConfig.onLive = false;        
            live.classList.add('hide');
        })
        return RTCPC.close();
    }
    const result = window.confirm(`是否邀请${to.substring(0, 4)}聊天？`);
    if(result){
        getLocalMedia();
        handleSure(to)
    }else{
        handleRefuse();
    }
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
const handleBtn = function(e){
        const link = document.createElement('a');
        const base64img = canvas.toDataURL('image/png');
        link.setAttribute('download', 'ctxtoimg');
        link.style.width = '50px';
        link.style.height = '50px';
        link.href = base64img;
        link.innerHTML = `<img src="${base64img}" />`
        tools.appendChild(link);
        playMusic('./sound/snap.mp3');
}

// audio.addEventListener('change', handleMedia, {});
video.addEventListener('change', handleMedia, {});
RTCPC.addEventListener('track', handleTrack, {});
canvas.addEventListener('click', handleBtn, {});


// 音视频被邀请
socket.on('call', obj => {
    console.log('call');
    obj = JSON.parse(obj)
    if(!liveConfig.isCalling && !liveConfig.onLive){
        const result = window.confirm(`${obj.from.substring(0, 4)}正在邀请你聊天？`)
        result ? callSure(obj) : callRefuse(obj);
    }
    if(liveConfig.onLive){
        callSure(obj);
    }
})
socket.on('response', async obj => {
    liveConfig.onLive = true;
    live.classList.remove('hide');
    const {answer, from, to} = JSON.parse(obj);
    await RTCPC.setRemoteDescription(new RTCSessionDescription(answer));
    handleSure(to);
})
socket.on('hangup', msg => {
    new MsgBox('对方已挂断', './sound/msg.mp3');
    setTimeout(_ => {
        live.classList.add('hide');
        video.style.display = 'none';
        liveConfig.isCalling = false;
        liveConfig.onLive = false;        
    })
    console.log('对方已挂断')
})

async function getLocalMedia(flag = true){
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
    v.style.width = 350 + 'px';
    if('srcObject' in v){
        v.srcObject = stream;
    }else{
        v.src = window.URL.createObjectURL(stream);
    }
    drawImage.call(v, 350, 265);
    
    stream.getTracks().forEach(track => {
        flag ? RTCPC.addTrack(track, stream) : track.stop();
    });
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
    new MsgBox(txt, './sound/msg.mp3');
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
    // video.style.display = 'none';
}
function callRefuse(){
    liveConfig.onLive = false;   
    const txt = '已拒绝邀请'
    new MsgBox(txt, './sound/msg.mp3');
}
function drawImage(x, y){
    ctx.drawImage(this, 0, 0, x, y);
    requestAnimationFrame(drawImage.bind(this, x, y));
}