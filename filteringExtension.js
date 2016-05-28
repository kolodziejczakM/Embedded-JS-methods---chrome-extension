// jyql_module

(function() {
  var IS_NODE, browser_fetch, jyql, nodejs_fetch, request;

  IS_NODE = typeof module !== 'undefined' && (module.exports != null);

  if (!IS_NODE) {
    browser_fetch = function(query, callback) {
      var addScript, callbackFunctionSource, randomName,
        _this = this;
      addScript = function(script, callback) {
        var headID, newScript,
          _this = this;
        headID = document.getElementsByTagName("head")[0];
        newScript = document.createElement('script');
        newScript.type = 'text/javascript';
        if ((script.match(/^http[\s\S]*/)) != null) {
          newScript.src = script;
          newScript.onload = function() {
            return callback(null);
          };
          headID.appendChild(newScript);
        } else {
          newScript.innerHTML = script;
          headID.appendChild(newScript);
          callback(null);
        }
        return null;
      };
      randomName = 'jyql_' + Math.random().toString(36).substr(2, 7);
      callbackFunctionSource = "var " + randomName + "_data = { };\nvar " + randomName + "_function = function (data) { " + randomName + "_data = data; };";
      return addScript(callbackFunctionSource, function() {
        var protocol, _ref, _ref1, _ref2;
        protocol = "https" || (typeof window !== "undefined" && window !== null ? (_ref = window.parent) != null ? (_ref1 = _ref.document) != null ? (_ref2 = _ref1.location) != null ? _ref2.protocol : void 0 : void 0 : void 0 : void 0);
        return addScript(protocol + "://query.yahooapis.com/v1/public/yql?format=json&callback=" + escape(randomName + '_function') + "&q=" + escape(query), function(err) {
          return callback(err, eval(randomName + '_data'));
        });
      });
    };
  }
  jyql = function(query, callback) {
    var processYQLOutput,
      _this = this;
    processYQLOutput = function(err, data) {
      if (!err && (data != null ? data.error : void 0)) {
        err = new Error(data.error.description);
      }
      return callback(err, data);
    };
    if (!(callback != null) || typeof callback !== 'function') {
      return null;
    }
    if (!(query != null) || query === '') {
      return callback(new Error('No query was specified'), null);
    }
    if (IS_NODE) {
      return nodejs_fetch(query, processYQLOutput);
    }
    return browser_fetch(query, processYQLOutput);
  };

  if (IS_NODE) {
    return module.exports = jyql;
  }

  this.jyql = jyql;

}).call(this);
// end of jyql_module

// controller_module

var md = document.getElementById('main_div');
name_div.innerHTML = "status: " + "Connecting to developer.mozilla.org";
invoke_div.innerHTML = "progress: " + "[22%]";

var q = "select * from html where url='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Methods_Index' and xpath='//article[@id=\"wikiArticle\"]//ul'";
invoke_div.innerHTML = "progress: " + "[28%]";
function isEmptyObject(obj) {
  for(var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return true;
}

var fetch = new Promise(function(resolve,reject){
   jyql(q, function (err, data){
     if(err){
        md.style.border="2px dashed red";
        name_div.style.color = "darkred";
        invoke_div.style.color = "darkred";
        name_div.innerHTML = "status: " + "External server cannot be reached";
        invoke_div.innerHTML = "progress: " + "[0%]";
      }
    var downloaded = data.query.results.ul;
    name_div.innerHTML = "status: " + "Connected 2/2";
    invoke_div.innerHTML = "progress: " + "[45%]";
    var obj_filtered_dict =[];
    for(var i=0; i<downloaded.length;i++){  //iterates on downloaded array => ARRAY OF ARRAY CONTAIN OBJ.
     if (downloaded[i] !== null &&  typeof(downloaded[i]) === 'object'){
      for(var z=0; z<downloaded[i].li.length;z++){
        if(!isEmptyObject(downloaded[i].li[z])){
          obj_filtered_dict.push(downloaded[i].li[z]);
        }
      }
     }else{
        console.log("Letter rejected. It was empty.");
      }
    }
    if(obj_filtered_dict.length > 0){

      resolve(obj_filtered_dict);
    }else{
      reject("There was an error during download content from developer.mozilla.org website.");
    }
  });
});
fetch.then(function(filtered){
invoke_div.innerHTML = "progress: " + "[58%]";
var link =[], name =[], desc =[], invoke =[];
var counter = 0;
for(var g =0; g<filtered.length;g++){

    if(!filtered[g].hasOwnProperty("strong")){
      if(!filtered[g].hasOwnProperty("code")){
        counter++;
        filtered.splice(g,1);
      }
    }
      if(filtered[g].hasOwnProperty("a")){
        desc.push(filtered[g].content);
        if(filtered[g].a.length === undefined){

          name.push(filtered[g].a.code);
          link.push(filtered[g].a.href);
        }else{

          name.push(filtered[g].a[0].code);
          link.push(filtered[g].a[0].href);
        }
      }

      if(filtered[g].code && filtered[g].strong){
        if(filtered[g].strong.length === undefined){
            invoke.push(filtered[g].strong.code);
        }else if(!filtered[g].strong.length===undefined && typeof(filtered[g].strong) === 'object'){
            invoke.push(filtered[g].strong[0].code);
          }
        else{
            invoke.push(filtered[g].strong);
        }
      }else if(filtered[g].code && !filtered[g].strong){
        if(filtered[g].code.length>= 0){
              invoke.push(filtered[g].code[0].strong);
        }else{
              invoke.push(filtered[g].code.strong);
        }
      }else{
          if(filtered[g].strong && !filtered[g].code){
            if(filtered[g].strong.length === undefined){
                invoke.push(filtered[g].strong.code);
            }else{
                invoke.push(filtered[g].strong[0].code);
            }
          }
        }

}
  for(var k=0;k<invoke.length;k++){
    if(typeof(invoke[k])==='object'){
        invoke[k] = invoke[k].content;
    }
  }

  function myTrim(x) {
      return x.replace(/^\s+|\s+$/gm,'');
  }

  for(var p=0;p<desc.length;p++){
    var ind = desc[p].indexOf(":");
    desc[p] = desc[p].slice(ind);
  }

   function finish_filter (destiny){
     var amount = 1,
           lower_limit_index = 0,
           upper_limit_index = destiny.length - 1,
           array_of_results_index = [];
       var finished = [];

       if (amount < upper_limit_index) {
           while (array_of_results_index.length < amount) {
               var random_number = Math.round(Math.random() * (upper_limit_index - lower_limit_index) + lower_limit_index);
               if (array_of_results_index.indexOf(random_number) == -1) {
                   array_of_results_index.push(random_number);
               }
           }
           for (var k = 0; k < array_of_results_index.length; k++) {
               finished[k] = destiny[array_of_results_index[k]];
           }
           return {Table: finished, id: random_number};
       }
       else {
           console.log(".");
       }
 }
 var last_performance = finish_filter(name);
 invoke_div.innerHTML = "progress: " + "[95%]";
 var result_index = last_performance.id;

 var display_data = {
   result_name: last_performance.Table[0],
   result_link: "https://developer.mozilla.org" + link[result_index],
   result_invoke: invoke[result_index],
   result_description: desc[result_index]
 };

 // end of end up filter functions

 md.style.border="2px solid darkgray";

 name_div.style.color = "black";
 name_div.innerHTML = "<span style='color:darkgray;'>name: </span>" + display_data.result_name ;

 invoke_div.style.color = "black";
 invoke_div.innerHTML = "<span style='color:darkgray;'>invoking: </span>" + display_data.result_invoke;
 var link_div = document.createElement('div');
 link_div.style.padding = "3px";
 link_div.innerHTML = "<span style='color:darkgray;'>link: </span>" + '<a href="'+display_data.result_link+'">'+display_data.result_name+'</a>';
 md.appendChild(link_div);
 var desc_div = document.createElement('div');
 desc_div.style.padding = "3px";
 desc_div.innerHTML ="<span style='color:darkgray;'>description </span>" + display_data.result_description;
 md.appendChild(desc_div);



}).catch(function(reason){
  md.style.border="2px dashed red";
  name_div.style.color = "darkred";
  invoke_div.style.color = "darkred";
  name_div.innerHTML = "status: " + reason;
  invoke_div.innerHTML = "progress: " + "[0%]";
}
);
