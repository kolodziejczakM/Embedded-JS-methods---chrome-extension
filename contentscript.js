var main_div = document.createElement('div');
main_div.id = 'main_div';
main_div.className='main_div';
document.getElementsByTagName('body')[0].appendChild(main_div);
var md = document.getElementById('main_div');
md.style.position ='fixed';
md.style.left='32.5%';
md.style.top='4%';
md.style.border="2px solid darkgray";
md.style.width = "35%";
md.style.height = "100px";
md.style.maxHeight = "130px";
md.style.borderRadius ="15px 15px";
md.style.padding ="15px";
md.style.overflow="auto";
var name_div = document.createElement('div');
name_div.innerHTML = "status: " + "Connecting with external server" ;
name_div.style.color = "darkgray";
name_div.style.padding = "3px";
name_div.style.paddingTop = "0px";
name_div.id = "name_div";
md.appendChild(name_div);
var invoke_div = document.createElement('div');
invoke_div.innerHTML = "progress: " + "[0%]";
invoke_div.style.color ="darkgray";
invoke_div.style.padding = "3px";
invoke_div.id = "invoke_div";
md.appendChild(invoke_div);


var xhttp = new XMLHttpRequest();
 xhttp.onreadystatechange = function() {
   if (xhttp.readyState == 4 && xhttp.status == 200 & xhttp.getResponseHeader("Content-type") == "application/octet-stream") {
    console.log(xhttp.status);
    md.style.border="2px solid lightgreen";
    name_div.innerHTML = "status: " + "Connected with controller";
    name_div.style.color = "lightgreen";
    invoke_div.style.color ="lightgreen";
    invoke_div.innerHTML = "progress: " + "[12%]";
    var script = document.createElement("SCRIPT");
    script.innerHTML = xhttp.responseText;
    document.getElementsByTagName('head')[0].appendChild(script);
   }
    if(xhttp.readyState == 4 && (xhttp.status >= 400 || xhttp.status == 0 || xhttp.getResponseHeader("Content-type") !== "application/octet-stream")){
     md.style.border="2px dashed red";
     name_div.style.color = "darkred";
     invoke_div.style.color = "darkred";
     name_div.innerHTML = "status: " + "There was a problem with connection to external server. Try again later.";
     invoke_div.innerHTML = "progress: " + "[0%]";
    }
  };
 xhttp.open("GET", "https://www.cubbyusercontent.com/pl/filteringExtension.js/_e579720588644459ba1d4ba90ff3777c", true);
// xhttp.setRequestHeader("Content-Type", "application/octet-stream");
 xhttp.send();
