var socket = io();
socket.on('connect',function () {
  console.log('connected to server');
});
  socket.on('disconnect', function ()  {
    console.log('disconnected from the server');
  });
  socket.on('newMessage', function (message)  {
  console.log('newmessage', message);
});
socket.emit('createMessage',{
  from:'frank',
  text:'hi'
}, function (data) {
  console.log('got it mannn!!!',data);
});
