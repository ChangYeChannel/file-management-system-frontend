var url = "ws://127.0.0.1:8341";
var websocket;
var connected = false;
//初始化WebSocket连接
export function ConnectServer(callback, value) {
  if ("WebSocket" in window) {
    websocket = new WebSocket(url);
  } else if (window.WebSocket) {
    websocket = new WebSocket(url);
  } else if ("MozWebSocket" in window) {
    websocket = new MozWebSocket(url);
  } else {
    alert("浏览器版本太低！请使用Chrome、Firefox、IE10+浏览器！");
  }
  websocket.onopen = function () {
    connected = true;
    callback(value);
  };
  websocket.onclose = function (e) {
    connected = false;
    onMessage({ data: JSON.stringify({ FuncName: "Connect", result: 0 }) });
  };
  websocket.onmessage = function (e) {
    onMessage(e);
  };
  websocket.onerror = function (e) {
    //if (websocket.readyState != WebSocket.OPEN||websocket.readyState == WebSocket.CLOSED) {
    //    onMessage({ data: JSON.stringify({ FuncName: 'Connect', result: 0 }) });
    //}
  };
}

//接收服务器发送的信息
export function onMessage(event) {
  if (typeof event.data == "string") {
    var str = event.data;
    var jsonOBJ = JSON.parse(str);
    var name = jsonOBJ.FuncName;
    var re = jsonOBJ.result;
    if (name == "Connect" && re == 1) {
      connected = true;
    }
    produceMessage(name, re);
  }
}

//向服务器发送信息的共享方法
export function sendMessage(data) {
  if (websocket.readyState == 0) {
    setTimeout(function () {
      var jsData = JSON.stringify(data);
      websocket.send(jsData);
    }, 50);
  } else if (websocket.readyState == 1) {
    var jsData = JSON.stringify(data);
    websocket.send(jsData);
  } else {
    alert("未连接websocket服务器，请确保已运行服务端！");
  }
}
//设置保存路径
export function SetSavePath(savePath) {
  var data = { Func: "SetSavePath", arg: savePath };
  connected ? sendMessage(data) : ConnectServer(sendMessage, data);
}
//设置JPG图片压缩率
export function SetJPGQuality(quality) {
  var data = { Func: "SetJPGQuality", arg: quality };
  connected ? sendMessage(data) : ConnectServer(sendMessage, data);
}
//设置色彩模式
export function SetColorType(colorType) {
  var data = { Func: "SetColorType", arg: colorType };
  connected ? sendMessage(data) : ConnectServer(sendMessage, data);
}
//设置底板颜色
export function SetBoardColor(colorType) {
  var data = { Func: "SetBoardColor", arg: colorType };
  connected ? sendMessage(data) : ConnectServer(sendMessage, data);
}
export function GetVideoDevInfo() {
    var a = { Func: "GetVideoDevInfo", arg: 0 };
    connected ? sendMessage(a) : ConnectServer(sendMessage, a);
  }
export function CheckLicense() {
    var a = { Func: "CheckLicense", arg: 0 };
    connected ? sendMessage(a) : ConnectServer(sendMessage, a);
  }
export function GetSpecialFolder(index) {
    var a = { Func: "GetSpecialFolder", arg: index };
    connected ? sendMessage(a) : ConnectServer(sendMessage, a);
  }
export function GetCurrentResolutionIndex() {
    var a = { Func: "GetCurrentResolutionIndex", arg: 0 };
    connected ? sendMessage(a) : ConnectServer(sendMessage, a);
  }
  //打开视频窗口
export function StartVideo(camIndex) {
    var data = { Func: "StartVideo", arg: camIndex };
    connected ? sendMessage(data) : ConnectServer(sendMessage, data);
  }
  //打开主头视频窗口
export function StartRunMain() {
    var data = { Func: "StartRunMain", arg: 0 };
    connected ? sendMessage(data) : ConnectServer(sendMessage, data);
  }
  //打开副头视频窗口
export function StartRunSub() {
    var data = { Func: "StartRunSub", arg: 0 };
    connected ? sendMessage(data) : ConnectServer(sendMessage, data);
  }
  //按指定PID\VID打开设备
export function StartRunByID(vid, pid) {
    var data = { Func: "StartRunByID", arg: { VID: vid, PID: pid } };
    connected ? sendMessage(data) : ConnectServer(sendMessage, data);
  }
export function ZoomIn() {
    var data = { Func: "ZoomIn", arg: 0 };
    connected ? sendMessage(data) : ConnectServer(sendMessage, data);
  }
export function ZoomOut() {
    var data = { Func: "ZoomOut", arg: 0 };
    connected ? sendMessage(data) : ConnectServer(sendMessage, data);
  }
  //关闭视频窗口
export function StopVideo() {
    var data = { Func: "StopVideo", arg: 0 };
    connected ? sendMessage(data) : ConnectServer(sendMessage, data);
  }
  //获取视频设备列表
export function GetVideoDevices() {
    var data = { Func: "GetVideoDevices", arg: 0 };
    connected ? sendMessage(data) : ConnectServer(sendMessage, data);
  } 
  //切换视频设备
export function ChangeVideoDevice(camIndex) {
    var data = { Func: "ChangeVideoDevice", arg: camIndex };
    connected ? sendMessage(data) : ConnectServer(sendMessage, data);
  }
  //切换视频分辨率
export function ChangeVideoResolution(resIndex) {
    var data = { Func: "ChangeVideoResolution", arg: resIndex };
    connected ? sendMessage(data) : ConnectServer(sendMessage, data);
  }
  //切换裁剪方式
export function ChangeCutType(type) {
    var data = { Func: "ChangeCutType", arg: type };
    connected ? sendMessage(data) : ConnectServer(sendMessage, data);
  }
  //获取高拍仪序列号
export function GetVideoDeviceSN() {
    var data = { Func: "GetVideoDeviceSN", arg: 0 };
    connected ? sendMessage(data) : ConnectServer(sendMessage, data);
  }
  
  //文件方式拍照
export function CaptureFile(fileName) {
    var data = { Func: "CaptureFile", arg: fileName };
    connected ? sendMessage(data) : ConnectServer(sendMessage, data);
  }
  //base64方式拍照
export function CaptureBase64(format) {
  var data = { Func: "CaptureBase64", arg: format };
  connected ? sendMessage(data) : ConnectServer(sendMessage, data);
}
function produceMessage(functionName, Result) {
    console.log(functionName, Result);
    if (functionName != "ShowVideo") {
        var obj = document.getElementById("show");
        obj.value = "指令名称:" + functionName + ";\r执行结果:" + Result;
    }

    if (functionName == "Connect") {
        if (Result == "0") {
            alert("websocket服务器连接失败，请确保已运行跨浏览器服务!");
        }
        else {
            //GetDeviceInfo();
            //OpenWebPage("http://www.baidu.com");
        }

    }
    else if (functionName == "ShowVideo") {
        var myimg = document.getElementById("pic");
        myimg.src = "data:image/jpeg;base64," + Result;
        return false;
    }

    else if (functionName == "GetVideoDevices") {
        if (Result != "none") {
            document.getElementById("MainCamDevice").innerHTML = "";
            var deviceArray = new Array();
            deviceArray = Result.split("|");
            for (var i = 0; i < deviceArray.length; i++) {
                var objOption = document.createElement("option");
                objOption.text = deviceArray[i];
                objOption.value = i;
                document.getElementById("MainCamDevice").options.add(objOption);
            }

        }
        else {
            var objOption = document.createElement("option");
            objOption.text = "未找到合适的设备";
            objOption.value = 0;
            document.getElementById("MainCamDevice").options.add(objOption);
        }
    }
    else if (functionName == "GetAudioDevices") {
        if (Result != "none") {
            document.getElementById("AudioDevice").innerHTML = "";
            var resolutionArray = new Array();
            resolutionArray = Result.split("|");
            for (var i = 0; i < resolutionArray.length; i++) {
                var objOption = document.createElement("option");
                objOption.text = resolutionArray[i];
                objOption.value = i;
                document.getElementById("AudioDevice").options.add(objOption);
            }

        }
        else {
            var objOption = document.createElement("option");
            objOption.text = "无麦克风设备";
            objOption.value = 0;
            document.getElementById("AudioDevice").options.add(objOption);
        }
    }
    else if (functionName == "StartVideo") {
        if (Result == 1) {
        }
    }
    else if (functionName == "GetResolution") {
        if (Result != "none") {
            document.getElementById("MainResolution").innerHTML = "";
            var resolutionArray = new Array();
            resolutionArray = Result.split("|");
            for (var i = 0; i < resolutionArray.length; i++) {
                var objOption = document.createElement("option");
                objOption.text = resolutionArray[i];
                objOption.value = i;
                document.getElementById("MainResolution").options.add(objOption);
            }

        }
        else {
            var objOption = document.createElement("option");
            objOption.text = "无分辨率";
            objOption.value = 0;
            document.getElementById("MainResolution").options.add(objOption);
        }
    }
    else if (functionName == "CaptureFile") {
        //alert(Result);
        var myimg = document.getElementById("showPic");
        myimg.src = Result;
        return false;
    }
    else if (functionName == "CaptureBase64") {
        //alert(Result);
        var myimg = document.getElementById("showPic");
        myimg.src = "data:image/jpeg;base64," + Result;
        return false;
    }
    else if (functionName == "CaptureTaxQR") {
        alert(Result);
    }
    else if (functionName == "VerifyFace") {
        alert(Result);
    }
    else if (functionName == "CapFingerBASE64") {
        base64FaceStr = Result;
        var myimg = document.getElementById("showPic");
        myimg.src = "data:image/jpeg;base64," + Result;
        return false;
    }
    //签字结果
    else if (functionName == "StartSign") {
        if (Result != "0") {
            var myimg = document.getElementById("showPic");
            myimg.src = "data:image/jpeg;base64," + Result;
            return false;
        }
    }
    else if (functionName == "ReadIDCard") {
        if (Result != "0") {
            var jsonOBJ = JSON.parse(Result);
            alert(jsonOBJ.Name);
            alert(jsonOBJ.ID);
            alert(jsonOBJ.Sex);
        }
    }
  }