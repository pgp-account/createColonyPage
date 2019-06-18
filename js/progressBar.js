//兼容IE6创建request
function createRequest(){
  var request;
  if(window.XMLHttpRequest){
    request = new XMLHttpRequest(); //IE7+,Firefox,Chrome,Opera,Safari...
  }
  else{
    request = new ActiveXObject("Microsoft.XMLHTTP");//IE6,IE5
  }
  return request;
}
window.onload = function(){
  var request = createRequest();
  var clusterName = localStorage.getItem("clusterName");
  var url = "http://localhost:8088/deploy/" + clusterName + "/status";
  request.open("GET",url);
  request.send();
  request.onreadystatechange = function(){
    if(request.readyState === 4){
      if(request.status === 200){
        var result = JSON.parse(request.responseText);
        console.log(request.responseText);
        var str="";
        var m = 0;
        for(let i in result){
          console.log(m);
          str += "<div class=\"each-bar-container\"> <span class=\"ip-name\">" + i + "</span><div class=\"progress-bar-container\"><div class=\"progress-bar-complete bar" + m + "\"></div></div></div>";
          m++;
        }
        console.log(str);
        document.getElementsByClassName("panel-body")[0].innerHTML = str;
        var n=0;
        for(let i in result){
          var bar = document.getElementsByClassName("bar" + n)[0];
          if(result[i].NODE_COMPLETE_SIZE){
            var width = result[i].NODE_COMPLETE_SIZE/result[i].NODE_ALL_SIZE*100;
            console.log(width);
            bar.style="width:" + width + "%;";
          }
          else{
            bar.style="width:0%";
          }
          n++;
        }        
      }
    }
  }
}

var timer=setInterval(showProgress,200);
var color = ["#5cb85c","#5bc0de","#f0ad4e","#d9534f"];
function showProgress(){
  var request = createRequest();
  var clusterName = localStorage.getItem("clusterName");
  var url = "http://localhost:8088/deploy/" + clusterName + "/status";
  request.open("GET",url);
  request.send();
  request.onreadystatechange = function(){
    if(request.readyState === 4){
      if(request.status === 200){
        var result = JSON.parse(request.responseText);
        console.log(request.responseText);
        var n = 0;
        for(let i in result){
          var bar = document.getElementsByClassName("bar" + n)[0];
          if(result[i].NODE_COMPLETE_SIZE){
            var width = result[i].NODE_COMPLETE_SIZE/result[i].NODE_ALL_SIZE*100;
            console.log(width);
            console.log("background-color:" + color[n%4]);
            bar.style="width:" + width +"%;background-color:" + color[n%4];
          }
          else{
            console.log("background-color:" + color[n%4]);
            bar.style="width:0%" + ";background-color:" + color[n%4];
          }
          n++;
        }
        
      }
    }
  }
}

function clear(){
  clearInterval(timer);
  document.getElementById("finish").style.visibility = "visible";
  document.getElementById("finish").addEventListener("click", function(){
    var clusterName = window.localStorage.getItem("clusterName");
    var request=new XMLHttpRequest();
    var url = "http://localhost:8088/deploy/"+clusterName+"/status/clear";
    request.open("GET",url,true);
    request.send(clusterName);
    request.onreadystatechange = function(){
      if(request.readyState == 4 && request.status == 200){
        alert(request.responseText);
      }
    }
    //window.location.href = "index.html";
  } );
}