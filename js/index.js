//列表隐藏或显示
function isHidden(obj){
  console.log(obj);
  var ulElement = obj.nextElementSibling; 
  console.log(ulElement);
  console.log(ulElement.style.display);
  if(ulElement.style.display === "none"){
    ulElement.style.display = "block";
    console.log(ulElement.style.display);
  }
  else if(ulElement.style.display === "block"){
    ulElement.style.display = "none";
    console.log(ulElement.style.display);
  }
  else{
    console.log(ulElement.style.display);
  }
}

window.onload = function (){
  //列表的高度
  console.log(window.screen.availHeight);
  document.getElementsByClassName("cluster-list-container")[0].style.height = (parseInt(window.screen.availHeight)-200)+"px";
  //点击实例外的区域，实例隐藏
  document.addEventListener("click",function(){
    var instanceDiv = document.getElementsByClassName("instance-div")[0];  
    if(instanceDiv===undefined){
        console.log("未创建instanceDiv");
    }
    else{
      instanceDiv.parentElement.removeChild(instanceDiv);
    }
  });
}

//点击服务弹出实例
function showInstance(obj){
  var instanceElement = document.createElement("div");
  instanceElement.className = "instance-div";
  obj.appendChild(instanceElement);
  var str="<ul class=\"instance-container\"><li class=\"instance-name\"><span>实例1.1.1.1</span></li><li class=\"instance-name\"><span>实例1.1.1.2</span></li></ul>";
  instanceElement.innerHTML = str;
  event.stopPropagation();
}


//集群监控平台

//全部节点状态饼图
var allNodeStatusPieDiv = echarts.init(document.getElementById("cluster-nodeStatus-div"));
var allNodeStatusPie = {
  backgroundColor: '#1a1a1a',
  tooltip : {
    trigger: 'item',
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  
  series : [
    {
      name:'全部节点状态',
      type:'pie',
      radius : '80%',
      center: ['50%', '50%'],
      data:[
          {value:3, name:'正常'},
          {value:2, name:'未监控'},
          {value:1, name:'宕机'}
      ],
      label: {
          normal: {
              textStyle: {
                  fontSize: '15',
                
              }
          }
      },
      labelLine: {
          normal: {
              lineStyle: {
                width: 2,
              },
          }
      }
    }
  ]
};
allNodeStatusPieDiv.setOption(allNodeStatusPie);

//集群质量折线图
var clusterQualityLineDiv = echarts.init(document.getElementById("cluster-quality-div"));
var clusterQualityLine = {
  backgroundColor: '#1a1a1a',
  grid: {
    left: '2%',
    right: '5%',
    bottom: '3%',
    top: '5%',
    containLabel: true
  },
  tooltip : {},
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['15:00:00', '15:00:01', '15:00:02', '15:00:03', '15:00:04', '15:00:05', '15:00:06'],
    splitLine: {
      lineStyle: {color: '#fff',},
    },
    axisLabel: {color: '#fff',},
    axisLine: {
      lineStyle: {color: '#fff',},
    },
    axisTick: {inside: true,},
  },
  yAxis: {
    type: 'value',
    axisLine: {show:false},
    axisLabel: {color: '#fff',},
    axisTick: {show: false,},
  },
  series: [{
    data: [50, 92, 80, 85, 90, 80, 62],
    smooth: true,
    type: 'line',
    color: '#2F7AA1',
    lineStyle: {},
    areaStyle: {}
  }]
};
clusterQualityLineDiv.setOption(clusterQualityLine);