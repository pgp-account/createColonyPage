function getStyle(obj,name){
  if(obj.currentStyle){   //判断浏览器是否拥有该方法    
    return obj.currentStyle[name];
  }else{
    return getComputedStyle(obj, null)[name];
  }
}

function nextFunction(obj){
  //显示的内容
  obj.parentNode.style = "display:none";
  var nextPage = obj.parentNode.nextElementSibling;
  nextPage.style = "display:block";
  //icon颜色变化
  var navLiActive = document.getElementsByClassName("nav-li-active")[0];
  navLiActive.className = '';
  var nextNavLiActive = navLiActive.nextElementSibling;
  nextNavLiActive.className = "nav-li-active";
  //横线颜色的变化
  var progressWithCircle = document.getElementsByClassName("progress-with-circle")[0];
  var backWidth = getStyle(progressWithCircle,"width");
  var progressBar = document.getElementsByClassName("progress-bar")[0];
  var oldWidth = getStyle(progressBar,"width");
  progressBar.style.width = parseInt(oldWidth) + parseInt(backWidth)/5 + "px";
}

function previousFunction(obj){
  //显示的内容
  obj.parentNode.style = "display:none";
  var nextPage = obj.parentNode.previousElementSibling;
  nextPage.style = "display:block";
  //icon颜色变化
  var navLiActive = document.getElementsByClassName("nav-li-active")[0];
  navLiActive.className = '';
  var previousNavLiActive = navLiActive.previousElementSibling;
  previousNavLiActive.className = "nav-li-active";
  //横线颜色的变化
  var progressWithCircle = document.getElementsByClassName("progress-with-circle")[0];
  var backWidth = getStyle(progressWithCircle,"width");
  var progressBar = document.getElementsByClassName("progress-bar")[0];
  var oldWidth = getStyle(progressBar,"width");
  progressBar.style.width = parseInt(oldWidth) - parseInt(backWidth)/5 + "px";
}

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

//clusterName改变后，验证clusterName是否重复
function checkClusterName(){
  var clusterName = document.getElementsByClassName("clusterName")[0].value;
  alert(clusterName);
  var request = createRequest();
  var url = "http://localhost:8088/cluster/check/"+clusterName;
  alert(url);
  request.open("GET",url,true);
  request.send();
  request.onreadystatechange = function(){
    if(request.readyState===4 && request.status===200){
      var result = JSON.parse(request.responseText);
      if(result===false){
        alert("clusterName不可用，请重新输入！");
      }
      else{
        alert(request.responseText); 
      }
    }
  }
}
//保存集群
function clusterSave(obj){
  var request = createRequest();
  var url = "http://localhost:8088/cluster/save";
  var userName = localStorage.getItem("userName");
  url = url + "/" + userName;
  var clustername = document.getElementsByClassName("clusterName")[0].value;
  window.localStorage.setItem("clusterName",clustername);
  var clusterDescription = document.getElementsByClassName("clusterDescription")[0].value;
  var dataObj = {clusterName:clustername,clusterDescribe:clusterDescription};
  var dataJSON = JSON.stringify(dataObj);
  alert(dataJSON);
  request.open("POST",url);
  request.setRequestHeader("Content-type","application/json");
  request.send(dataJSON);
  request.onreadystatechange = function(){
    if(request.readyState === 4){
      if(request.status === 200){
        var result = JSON.parse(request.responseText);
        alert(request.responseText);
        if(result.clusterName === clustername){
          nextFunction(obj);
        }
        else{
        alert("新建cluster出错！");
        }
      }
    }
  }
}

function checkform(obj){
	var input =obj.value;
	if(input.length==0){
		alert("此处不能为空");
		return false;
	}else{
		return true;
	}
	
}
function isImage(){
  var jar = document.getElementsByClassName("cluster-jar-li");
  for(let i=0; i< jar.length; i++){
    jar[i].style="display:none";
  }    
}
function isJar(){
  var jar = document.getElementsByClassName("cluster-jar-li");
  for(let i=0; i< jar.length; i++){
    jar[i].style="display:block";
  }
}
//next按钮，检查jar
function checkhub(){
  var request = createRequest();
  var url = "http://localhost:8088/hub/check";
  var isJar = document.getElementsByClassName("cluster-li-radio")[0];
  var isImage = document.getElementsByClassName("cluster-li-radio")[1];
  var IP = document.getElementsByClassName("IP")[0].value;
  var localhubpath = document.getElementsByClassName("localHubPath")[0].value;
  var hubType = 0;
  if(isJar.checked){
    hubType = 0;
    var username = document.getElementsByClassName("userName")[0].value;
    var userPwd = document.getElementsByClassName("userPwd")[0].value;
    var logpath = document.getElementsByClassName("logPath")[0].value;
    var dataObj = {type:hubType,localHubPath:localhubpath,log:logpath,ip:IP,userName:username,userPassword:userPwd};
  }
  console.log(isImage.checked);
  if(isImage.checked){
    hubType = 1;
    var dataObj = {type:hubType,localHubPath:localhubpath,ip:IP};
  }
  var dataJSON = JSON.stringify(dataObj);
  alert(dataJSON);
  request.open("POST",url);
  request.setRequestHeader("Content-type","application/json");
  request.send(dataJSON);
  request.onreadystatechange = function(){
    if(request.readyState === 4){
      if(request.status === 200){
        var result = JSON.parse(request.responseText);
        if(result){
          document.getElementsByClassName("show-jar-container")[0].style="display:block";
          var str = "<h2 style=\"text-align: center;font-size:18px;\">Jar/Image</h2>";
          for(let i=0; i<result.length; i++){
            str = str + "<p class=\"show-jar-item\">" + result[i]+"</p>";
          }
          document.getElementById("show-jar-content").innerHTML = str;
        }
        else{
          alert("该路径下没有jar文件！");
        }
      }
    }
  }
}
//取消jar，返回jar填写页面
function cancelJar(){
  document.getElementById("show-jar-content").innerHTML = "";
  document.getElementsByClassName("show-jar-container")[0].style="display:none";
}

//保存jar，跳转页面
function saveJar(){
  var request = createRequest();
  var url = "http://localhost:8088/hub/save";
  var clusterName = localStorage.getItem("clusterName");
  url = url + "/"+clusterName;
  var isjar = document.getElementsByClassName("cluster-li-radio")[0];
  var isimage = document.getElementsByClassName("cluster-li-radio")[1];
  var IP = document.getElementsByClassName("IP")[0].value;
  var localhubpath = document.getElementsByClassName("localHubPath")[0].value;
  console.log("isJar.checked"+isjar.checked);
  if(isjar.checked){
    var username = document.getElementsByClassName("userName")[0].value;
    var userPwd = document.getElementsByClassName("userPwd")[0].value;
    var logpath = document.getElementsByClassName("logPath")[0].value;
    var dataObj = {localHubPath:localhubpath,log:logpath,ip:IP,userName:username,userPassword:userPwd};
  }
  console.log("isImage.checked"+isimage.checked);
  if(isimage.checked){
    var dataObj = {localHubPath:localhubpath,ip:IP};
  }
  var dataJSON = JSON.stringify(dataObj);
  request.open("POST",url);
  request.setRequestHeader("Content-type","application/json");
  request.send(dataJSON);
  request.onreadystatechange = function(){
    if(request.readyState === 4){
      if(request.status === 200){
        var result = JSON.parse(request.responseText);
        alert("保存结果："+result);
        console.log("保存结果："+result);
        if(result===true){
          var next = document.getElementById("next-button");
          nextFunction(next);
        }
        else{
          alert("保存失败，请重试！");
        }
      }
    }
  }
}

//查询ip串中的可用ip，并将其显示
function searchNode(obj){
  var request = createRequest();
  var clusterName = localStorage.getItem("clusterName");
  var url = "http://localhost:8088/node/search/" + clusterName;
  var IPString = document.getElementsByClassName("IPString")[0].value;
  request.open("POST",url);
  request.setRequestHeader("Content-type", "text/plain; charset=utf-8");
  alert(IPString);
  request.send(IPString);
  request.onreadystatechange = function(){
    if(request.readyState === 4){
      if(request.status === 200){
        var result = JSON.parse(request.responseText);
        window.localStorage.setItem("nodeResult",request.responseText);
        if(result.nodeList.length){
          var list = document.getElementById('add-ip-list');
          alert("nodeList:"+result.nodeList);
          console.log(result.nodeList);
          var str="";
         for(let i=0; i<result.nodeList.length; i++){
            console.log(result.nodeList[i]);
            str += "<div class=\"add-ip-content\"><div class=\"add-ip-left\"><img src=\"images/nodeMessage.png\" style=\"width:96%;\"></div>";
            str += "<div class=\"add-ip-right\"><div class=\"add-ip-row\" style=\"line-height: 30px; font-size: 20px; margin-left: 10px;\"><input class=\"node-li-checkbox\" type=\"checkbox\" value=\"" + result.nodeList[i].nodeIp + "\" ><span style=\"font-size: 15px;padding-left: 10px;\">";
            str += result.nodeList[i].nodeIp;
            str += "</span></div><div class=\"add-ip-row\"><span class=\"add-ip-item\">集群名称：" +  result.nodeList[i].clusterName + "</span>";
            str += "<span class=\"add-ip-item\">是否管理：" + result.nodeList[i].isManaged + "</span>";
            str += "<span class=\"add-ip-item\">节点状态：" + result.nodeList[i].nodeStatus + "</span>";
            str += "<span class=\"add-ip-item\">CPU核数：" + result.nodeList[i].nodeResource.cpuNums + "</span></div>";
            str += "<div class=\"add-ip-row\"><span class=\"add-ip-item\">内存：" + (result.nodeList[i].nodeResource.memorySize/1024/1024).toFixed(2) + "GB</span>";
            str += "<span class=\"add-ip-item\">交换区：" + (result.nodeList[i].nodeResource.swapSize/1024/1024).toFixed(2) + "GB</span>";
            str += "<span class=\"add-ip-item\">磁盘使用率：" + parseInt(result.nodeList[i].nodeResource.diskUsedSize/result.nodeList[i].nodeResource.diskSize*100) + "%</span>";
            str += "<span class=\"add-ip-item\">服务数量：" + result.nodeList[i].serviceSize + "</span></div>";
            str += "</div></div>"
          }
          list.innerHTML = str;
          nextFunction(obj);
        }
        else{
          alert("nodeList为空！");
        }
      }
    }
  }
}

//根据ip获取node信息
function searchValidNode(str){
  var nodeResult = JSON.parse(localStorage.getItem("nodeResult"));
  var nodeListObj = nodeResult.nodeList;
  for(let i=0; i<nodeListObj.length; i++){
    if(nodeListObj[i].nodeIp === str){
      console.log(nodeListObj[i]);
      return nodeListObj[i];
    }
  }
}

// add IP，获取所有被选中的复选框的值，发送给后台
function addIPFunction(obj){
  var request = createRequest();
  var url = "http://localhost:8088/node/save";
  var clusterName = localStorage.getItem("clusterName");
  url = url + "/" + clusterName;
  var checkboxElement = document.getElementsByClassName("node-li-checkbox");
  var checkedNodeObj = [];
  var m = 0;
  for(let i=0; i<checkboxElement.length; i++){
    if(checkboxElement[i].checked){
      var ipString = checkboxElement[i].value;
      console.log(ipString);
      checkedNodeObj[m] = searchValidNode(ipString);
      m++;
    }
  }
  var dataJSON = JSON.stringify(checkedNodeObj);
  window.localStorage.setItem("checkedNode",dataJSON);
  alert(dataJSON);
  console.log(dataJSON);
  request.open("POST",url);
  request.setRequestHeader("Content-type","application/json");
  request.send(dataJSON);
  request.onreadystatechange = function(){
    if(request.readyState === 4){
      if(request.status === 200){
        var result = JSON.parse(request.responseText);
        localStorage.setItem("serviceOption",request.responseText);
        alert(request.responseText);
        // if(result === true){
          nextFunction(obj);
        // }
        // else{
        // alert("创建节点出错！");
        // }
      }
    }
  }
}

// function searchService(str,obj){
//   var result = null;
//   console.log(obj);
//   for(let k in obj){
//     console.log(k);
//     if(str === k){
//       result = obj[k];
//       return result;
//     }
//   }
//   return result;
// }
//显示节点下的服务
function showServiceFunction(){
  var request = createRequest();
  var checkedNode = JSON.parse(localStorage.getItem("checkedNode"));
  console.log(checkedNode);
  var ipArray = [];
  var url = "http://localhost:8088/service/find";
  var clusterName = localStorage.getItem("clusterName");
  url = url + "/" + clusterName;
  for(let i=0; i<checkedNode.length; i++){
    console.log(checkedNode[i].nodeIp);
    ipArray[i] = checkedNode[i].nodeIp;
  }
  console.log("ipArray:" + ipArray);
  var dataJSON = JSON.stringify(ipArray);
  console.log(dataJSON);
  request.open("POST",url);
  request.setRequestHeader("Content-type","application/json");
  request.send(dataJSON);
  request.onreadystatechange = function(){
    if(request.readyState === 4){
      if(request.status === 200){
        var result = JSON.parse(request.responseText);
        console.log(result);
        window.localStorage.setItem("ipServices",request.responseText);
        var str = "";
        for(let i=0; i<ipArray.length; i++) {
          str += "<div class=\"each-ip-container\"><div class=\"ip-name\"><span class=\"ipSpan\" id=\"id" + i + "\"style=\"vertical-align: middle; padding-left: 3px;\">" + ipArray[i];
          str += "</span><img src=\"images/tianjia.png\" style=\"width:12%; display: inline-block; padding-left:5px; vertical-align: middle;\" onclick=\"addServiceFunction(this)\"></div><div class=\"ip-service-count\"></div></div>";
          // var nodeService = searchService(ipArray[i],result);
          // console.log(ipArray[i]);
          // console.log(nodeService);
          // if(nodeService){
          //   for(let j in nodeService){
          //     console.log("j:" + j);
          //       console.log("nodeService[j].num:" + nodeService[j].num);
          //       str += "<span><span class=\"ip" + i + "ServiceName\">" + j + ": </span><input type=\"number\" min=\"1\" max=\"10\"/ value=\""+ nodeService[j].num + "\" class=\"ip" + i + "ServiceNum\"/></span>";
          //   }
          //   str += "</div></div>";
          // }
          // else{
          //   str += "</div></div>";
          // }
        }
        document.getElementsByClassName("service-ip-container")[0].innerHTML = str;
      }
    }
  }
}


//根据ip找到对应的ip-service-count
function getNodeByIp(str){
  var eachIpContainer = document.querySelectorAll(".each-ip-container");
  for(let o=0; o<eachIpContainer.length; o++){
    var ip = eachIpContainer[o].querySelector(".ip-name >span").innerText;
    if(str === ip){
      return eachIpContainer[o].querySelector(".ip-service-count");
    }
  }
}

//添加服务弹窗
function addServiceFunction(obj){
  document.getElementsByClassName("add-service-container")[0].style = "display:block";
  var str = "";
  //将ip显示在页面上 h2
  var ip = obj.parentElement.firstElementChild.innerText;
  str += "<h2  style= \"color: #000;text-align: center;padding-top: 15px;font-size:18px;\">" + ip + "</h2>";
  var ipServices = JSON.parse(localStorage.getItem("ipServices"));
  
  console.log(ipServices);
  // var serviceOption = searchService("0",ipServices); 
  var ipServiceCount = getNodeByIp(ip);
  console.log(ipServiceCount);
  var serviceSpan = ipServiceCount.querySelectorAll("span > span");
  console.log("aaa");
  console.log(serviceSpan);
  var serviceHave = [];
  console.log(serviceHave);
 // var l = 0;
  if(serviceSpan!==[]){
    for(let m=0; m<serviceSpan.length; m++){
      console.log(serviceSpan[m]);
      // serviceHave[l] = m.innerText;
      // console.log(serviceHave[l]);
      var str000 = serviceSpan[m].innerText.replace(": ","");
      console.log(str000);
      serviceHave.push(str000);
      //l++;
    }
  }
  console.log(localStorage.getItem("serviceOption"));
  var serviceOption=JSON.parse(localStorage.getItem("serviceOption")).servicesList;
  //显示service
  console.log(serviceOption);
  console.log(serviceHave);
  if(serviceOption){
    for(let j=0; j<serviceOption.length;j++){
      console.log(serviceOption[j]);
      var flag = 0;
      console.log(flag);
      for(let n=0; n<serviceHave.length; n++){
        if(serviceOption[j].serviceName===serviceHave[n]){
          flag = 1;
        }
      }
      console.log(flag);
      console.log(serviceOption[j].serviceName);
      if(flag === 0){
        str += "<div class=\"add-service-item\"><input class=\"node-serviceOption-checkbox\" type=\"checkbox\" value=\"" + serviceOption[j].serviceName + "\" ><span calss=\"node-serviceOption-span\">" + serviceOption[j].serviceName +"</span></div>";
      }
    }
    // for(let j in serviceOption){
    //   console.log(j);
    //   var flag = 0;
    //   console.log(flag);
    //   for(let n=0; n<serviceHave.length; n++){
    //     if(j.serviceName===serviceHave[n]){
    //       flag = 1;
    //     }
    //   }
    //   console.log(flag);
    //   if(flag === 0){
    //     str += "<div class=\"add-service-item\"><input class=\"node-serviceOption-checkbox\" type=\"checkbox\" value=\"" + j.serviceName + "\" ><span calss=\"node-serviceOption-span\">" + j +"</span></div>";
    //   }
    // }
  }
  document.getElementsByClassName("add-service-content")[0].innerHTML = str;
}


//将弹窗中所选内容增加到页面服务中
function addService(obj) {
  var ip = obj.parentElement.firstElementChild.firstElementChild.innerText
  var ipServiceCount = getNodeByIp(ip);
  var index = ipServiceCount.childElementCount;
  var checkboxElement = document.getElementsByClassName("node-serviceOption-checkbox");
//  var checkedServices = [];
//  var m = 0;
  for(let i=0; i<checkboxElement.length; i++){
    if(checkboxElement[i].checked){
      var outerSpan = document.createElement("span");
      var ipServiceName = document.createElement("span");
      ipServiceName.className = "ip" + index + "ServiceName";
      var inputElement = document.createElement("input");
      inputElement.setAttribute("type","number");
      inputElement.setAttribute("min",1);
      inputElement.setAttribute("max",10);
      inputElement.setAttribute("value",1);
      inputElement.setAttribute("class","ip"+index+"ServiceNum");
      outerSpan.appendChild(ipServiceName);
      outerSpan.appendChild(inputElement);
      ipServiceName.innerText = checkboxElement[i].value + ": ";
//     checkedServices[m] = checkboxElement[i].value;
//     m++;
      ipServiceCount.appendChild(outerSpan);    
    }
  }
  document.getElementsByClassName("add-service-container")[0].style = "display:none";
}

function cancelService() {
  document.getElementsByClassName("add-service-container")[0].style = "display:none";
}


//获取服务名，数量，部署
function deployFunction(){
  var request = createRequest();
  var clusterName = localStorage.getItem("clusterName");
  var url = "http://localhost:8088/deploy/" + clusterName + "/services";
  // {                 //requestObj
  //   "192.168.31.129": {     //propertyName1 : ipObj
  //     "register-eureka": {   //propertyName2 :  serviceObj
  //       "services": {    
  //         "serviceName": "register-eureka"
  //       },
  //       "num": 1           
  //     }
  //   },
  // "192.168.31.129": {
  //     "register-eureka": {
  //       "services": {
  //         "serviceName": "register-eureka"
  //       },
  //       "num": 1
  //     }
  //   }
  // }


  var requestObj = new Object();
  var nodes = document.getElementsByClassName("each-ip-container"); 
  console.log(nodes);
  for(let i=0; i<nodes.length; i++){
    var ipObj = new Object();
    var ipPropertyName = nodes[i].firstElementChild.firstElementChild.innerText;
    console.log(ipPropertyName);
    var serviceKinds = nodes[i].children[1].children.length;
    console.log(serviceKinds);  
    for(let j=0; j<serviceKinds; j++){
      var serviceObj = new Object();
      var servicePropertyName = nodes[i].children[1].children[j].firstElementChild.innerText.replace(": ","");
      var itemObj = new Object();
    
      itemObj.serviceName = servicePropertyName;
      serviceObj.services = itemObj;
      serviceObj.num = parseInt(nodes[i].children[1].firstElementChild.children[1].value);
      ipObj[servicePropertyName] = serviceObj;
    }
    requestObj[ipPropertyName] = ipObj;
  }
  console.log(JSON.stringify(ipObj));
  
  var dataJSON = JSON.stringify(requestObj);
  alert(dataJSON);
  request.open("POST",url);
  request.setRequestHeader("Content-type","application/json");
  request.send(dataJSON);
  request.onreadystatechange = function(){
    if(request.readyState === 4){
      if(request.status === 200){
         var result = JSON.parse(request.responseText);
         alert(request.responseText);
         if(result){
           window.location.href = "progressBar.html";
          }
         
      }
    }
  }
}