const path = require ('path');
const http = require ('http');
const express = require ('express');
const socketIO = require ('socket.io');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket) =>{
  console.log('new user has been connected');
//client side operation
  //socket.emit('newEmail', {
  //  from:'praveenkumarmco@gmail.com',
    //text:'hey man take it cool whoo whuooo',
    //createat:123123
    socket.emit('newMessage',{
      from:'john',
      text:'c u there',
      createdat:1231213
  });
  //server side operation
//  socket.on('createEmail', (newEmail) => {
  //  console.log('create email',newEmail);
  socket.on('createMessage',(message) => {
    console.log('create message', message);
  });

  socket.on('disconnect',() => {
    console.log('user was disconnected');
  });
});
server.listen(port, () => {
  console.log(`server is up on ${port}`);
});
