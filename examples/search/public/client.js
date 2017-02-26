var search = document.querySelector('[type=search]');
var code = document.querySelector('pre');

search.addEventListener('keyup', function(){
  var xhr = new XMLHttpRequest;
  xhr.open('GET', '/search/' + search.value, true);
  xhr.onreadystatechange = function(){
    if (4 == xhr.readyState) {
      code.textContent = xhr.responseText;
    }
  };
  xhr.send();
}, false);