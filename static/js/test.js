function RtcExtend(opts){
  const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  const RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

  const {socket = null, from = null, to = null} = opts;
  this.socket = socket;
  this.from = from;
  this.to = to;
  this.init = function(){
    getLocalMedia.call(this);
  }
  Object.defineProperties(RtcExtend.prototype, {
      connection: {
          value: new RTCPeerConnection()
      }
  })
  socket.emit('call', JSON.stringify({from, to}));
  function getLocalMedia(){
    if(navigator.mediaDevices.getUserMedia === undefined){
      navigator.mediaDevices = {};
      Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
        get(){
            const getMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            return getMedia ? getMedia.bind(navigator, {audio, video}) : Promise.reject( '您的浏览器不支持getUserMedia接口');      
        },
      })
    }
    navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(
      stream => {
        stream.getTracks().forEach(track => {
          console.log(this, track, stream);
          this.connection.addTrack(track, stream);
        })
      }
    )
  }
  function description(para){
    return new RTCSessionDescription(para);
  }
}
const rtc = new RtcExtend({});