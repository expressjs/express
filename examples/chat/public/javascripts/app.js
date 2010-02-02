
$(function(){
  // Send message
  $('form').submit(function(){
    var message = $('input[name=message]'),
        name = $('input[name=name]')
    if (message.val()) 
      $.post('/chat', { name: name.val(), message: message.val() }, function(){
        message.val('')
      })
    else
      message.css('border', '1px solid red')
    return false
  })
  
  // Longpoll
  ;(function poll(){
    $.getJSON('/chat/messages', function(messages){
      $('#messages').empty()
      $.each(messages, function(i, msg){
        $('#messages')
          .append('<li>' + msg + '</li>')
          .get(0).scrollTop = $('#messages').get(0).scrollHeight
      })
      poll()
    })
  })()
})