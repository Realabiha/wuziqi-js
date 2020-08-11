export default {
  data() {
    return {
      audioCtx: new AudioContext(), // for get stream from mic and send via socket
      audioC: new AudioContext(), // for receive data from socket and translate and play
    };
  },
  created() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (navigator.getUserMedia) {
      console.log('getUserMedia supported.');
      navigator.getUserMedia({ audio: true }, success(stream), (err) => console.error(err));
    }
  },
  success(stream) {
    return stream => {
      var source = this.audioCtx.createMediaStreamSource(stream);
      var processor = this.audioCtx.createScriptProcessor(2048, 1, 1);
      source.connect(processor);
      processor.connect(this.audioCtx.destination);
      processor.onaudioprocess = (e) => {
        this.$store.state.mic.Emit(
          'Voice',
          e.inputBuffer.getChannelData(0)
        );
      };
      this.$store.state.mic.On('Voice', (msg) => {
        let fbu = new Float32Array(Object.values(JSON.parse(msg)));
        //console.log(fbu)
        var audioBuffer = this.audioC.createBuffer(
          1,
          2048,
          this.audioC.sampleRate
        );
        audioBuffer.getChannelData(0).set(fbu);
        let sourceNode = new AudioBufferSourceNode(this.audioC, {
          buffer: audioBuffer,
        });
        sourceNode.connect(this.audioC.destination);
        sourceNode.start(0);
      });
      this.audioC.resume();
    }
  },
};


// server.js
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var users = [];

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

  socket.on('add user', function (user_id) {
    users.push(user_id);
  });

  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });
  socket.on('voice sent', function (msg) {
    io.emit('voice received', msg);
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});

// client.js
$(function () {
  var socket = io();
  var user_id = Math.random();

  socket.emit('add user', user_id);

  $('form').submit(function () {
    socket.emit('chat message', { "message": $('#m').val(), "user": user_id });
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function (msg) {
    if (msg.user == user_id) {
      $('#messages').append($('<li class="mine">').text(msg.message));
    }
    else {
      $('#messages').append($('<li>').text(msg.message));
    }

  });

  socket.on('voice received', function (msg) {
    var audio = document.querySelector('audio');
    audio.src = window.URL.createObjectURL(stream);
  });

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  if (navigator.getUserMedia) {
    console.log('getUserMedia supported.');
    navigator.getUserMedia({ audio: true }, successCallback, errorCallback);
  } else {
    console.log('getUserMedia not supported on your browser!');
  }

  function successCallback(stream) {
    socket.emit('voice sent', stream);
  }

  function errorCallback(error) {
    console.error('An error occurred: [CODE ' + error.code + ']');
  }
});
