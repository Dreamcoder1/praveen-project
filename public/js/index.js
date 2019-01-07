var socket = io();
socket.on('connect',function () {
  console.log('connected to server');
// make emit fn to inform the createServer
//socket.emit('createEmail',{
//  to:'andrew@example.com',
//  text: 'hey this is praveen'


});
  socket.on('disconnect', function ()  {
    console.log('disconnected from the server');
  });
//socket.on('newEmail', function (email) {
  //console.log('you have a maill!!!!',email);
  socket.on('newMessage', function (message)  {
  console.log('newmessage', message);


});
