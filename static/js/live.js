const getlLocalVideo = async function(){
  let stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
  console.log(stream);
  const localVideo = document.querySelector('.local');
  localVideo.getElementsByClassName.width = 360 + 'px';
  localVideo.srcObject = stream;
}
// getlLocalVideo();