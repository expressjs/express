var ajaxUrl = '/for-ajax';

$(document).ready(function() {

  $('#ajaxButton').click(function() {
    var sendData = {
      boxText: $('#ajaxInput').val()
    };
    
    $.ajax({
      type: 'POST',
      url: ajaxUrl,
      dataType: 'json',
      data: sendData,
      success: function(data) {
        console.log(JSON.stringify(data));
        $('#ajaxOutput').html(data.result);
      },
      error: function(jqXHR, textStatus, errThrown) {
        $('#ajaxOutput').html('Error!');
        console.log(jqXHR + ' ' + textStatus + ' ' + errThrown);
      }
    });
  })

}); 
