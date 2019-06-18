//兼容IE6创建request
function createRequest(){
  var request;
  if(window.XMLHttpRequest){
    console.log(1);
    request = new XMLHttpRequest(); //IE7+,Firefox,Chrome,Opera,Safari...
  }
  else{
    request = new ActiveXObject("Microsoft.XMLHTTP");//IE6,IE5
  }
  return request;
}
//url添加参数
function addURLParam(url, name, value){
  url += (url.indexOf("?") == -1 ? "?" :"&");
  url += encodeURIComponent(name) + "=" +encodeURIComponent(value);
  return url;
}

function submitFunction(){
  var request = createRequest(); 
  var url = "http://localhost:8088/user/login";
  var username = document.getElementsByClassName("userName")[0].value;
  window.localStorage.setItem("userName",username);
  var userpassword = document.getElementsByClassName("userPassword")[0].value;
  var userObj = {userName:username,userPwd:userpassword};
  var userJSON = JSON.stringify(userObj);
  request.open("POST",url,true);
  request.setRequestHeader("Content-type","application/json");
  request.send(userJSON);
  request.onreadystatechange = function(){
    console.log(request.readyState);
    if (request.readyState===4) {
      console.log("status"+request.status);
      if (request.status===200) { 
        var data = JSON.parse(request.responseText);
        console.log(data.clusterSize);
        if(data.clusterSize===0){
          window.location.href = "create.html";
        }
        else{
          window.location.href = "create.html";
        }
      } 
    } 
  }
}