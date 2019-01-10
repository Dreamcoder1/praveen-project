const path = require ('path');
const http = require ('http');
const express = require ('express');
const socketIO = require ('socket.io');
const {generateMessage,generateLocationMessage} = require ('./utils/message');
const {isRealString} = require ('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection',(socket) =>{
  console.log('new user has been connected');
//for login users
socket.on('join',(params, callback)  => {
if(!isRealString (params.name)||!isRealString(params.room)) {
 return  callback('name and room name are required');
}
socket.join(params.room);
users.removeUser(socket.id);
users.addUser(socket.id, params.name, params.room);
io.to(params.room).emit('updateUserList',users.getUserList(params.room));
//io.emit -->> it will emit the all the users
//socket.broadcast.emit -->>it emit except current user
//socket.emit --->> it emit only specific user
socket.emit('newMessage',generateMessage ('admin','welcome to the chat app'));
socket.broadcast.to(params.room).emit('newMessage',generateMessage('admin',`${params.name}has joined`));
callback();
});

  //server side operation
  socket.on('createMessage', (message, call) => {
    var user = users.getUser(socket.id) ;
    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage',generateMessage(user.name, message.text));
    }
    //console.log('create message', message);

    call('this is from the server');
});
socket.on('createLocationMessage', (coords) => {
  var user = users.getUser(socket.id);
  if(user) {
    io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude));
  }

});

  socket.on('disconnect',() => {
    //console.log('user was disconnected');
    var user = users.removeUser(socket.id);
    if(user) {
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('admin',`${user.name}has left`));
    }
  });
});
server.listen(port, () => {
  console.log(`server is up on ${port}`);
});
