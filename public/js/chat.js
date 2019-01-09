var socket = io();

function scrollToBottom () {
  // selectors
  var messages = jQuery('#messages');
  var newMessage= messages.childern('li:last-child')

  //heights
var clientHeight = messages.prop('clientHeight');
var scrollTop = messages.prop('scrollTop');
var scrollHeight = messages.prop('scrollHeight');
var newMessageHeight = newMessage.innerHeight();
var lastMessageHeight = newMessage.prev().innerHeight();

if (clientHeight+ scrolltop+newMessageHeight+lastMessageHeight >= scrollHeight) {
  messages.scrollTop(scrollHeight);
}

}
socket.on('connect',function () {
  var params = jquery.deparam(window.location.search);
  socket.emit('join', params, function (err) {
    if (err) {
      alert(err)
      wndow.location.href='/';
    }else{
       console.log('no err');
    }
  });
  //console.log('connected to server');
});
  socket.on('disconnect', function ()  {
    console.log('disconnected from the server');
  });
  socket.on('newMessage', function (message)  {
     var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#messsage-template').html();
    var html = Mustache.render(template, {
      text:message.text,
      from:message.from,
      createdAt:formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
  });

socket.on('newLocationMessage', function (message)  {
   var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
      from:message.from,
      url:message.url,
      createdAt: formattedTime

    });
  jQuery('#messages').append(html);
  scrollToBottom();
});


jQuery('#message-form').on('submit', function (e)  {
  e.preventDefault();
  var messageTextBox = jQuery('[name=message]');
  socket.emit('createMessage', {
    from:'user',
    text: messageTextBox.val()
  }, function () {
     messageTextBox.val ('')
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if(!navigator.geolocation){
    return alert('geolocation is not supported by your browser');
  }
  locationButton.attr('disabled','disabled').text('sending location');
  navigator.geolocation.getCurrentPosition( function (position)  {
    locationButton.removeAttr('disabled').text('sended successfully');
    //console.log(position);
    socket.emit('createLocationMessage',{
      latitude:position.coords.latitude,
      longitude:position.coords.longitude
    });
  }, function ()  {
    locationButton.removeAttr('disabled').text('done boss');
    alert('unable to fetch the location');
  });
});
