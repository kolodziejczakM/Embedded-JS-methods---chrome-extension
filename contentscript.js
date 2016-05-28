var xhttp = new XMLHttpRequest();
 xhttp.onreadystatechange = function() {
   if (xhttp.readyState == 4 && xhttp.status == 200) {
    var script = document.createElement("SCRIPT");
    script.innerHTML = xhttp.responseText;
    document.getElementsByTagName('head')[0].appendChild(script);
   }
 };
 xhttp.open("GET", "https://www.cubbyusercontent.com/pl/filteringExtension.js/_e579720588644459ba1d4ba90ff3777c", true);
 xhttp.send();
