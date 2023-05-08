<template>
  <el-dialog
    width="50%"
    title="拍照"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :visible.sync="innerVisible"
    append-to-body
  >
    <p>高拍仪功能：</p>
    视频设备列表:
    <select
      name="MainCamDevice"
      id="MainCamDevice"
      onchange="ChangeMainDevice()"
    >
    </select>
    分辨率:
    <select
      name="MainResolution"
      id="MainResolution"
      onchange="ChangeMainReso()"
    >
    </select>
    裁剪方式:
    <select name="CutType" id="CutType" onchange="ChangeCut()">
      <option value="0">自动裁剪</option>
      <option value="1">不裁剪</option>
    </select>
    <br /><br />
    <el-button id="ConnectServer" @click="ConnectServer()"
      >初始化服务
    </el-button>
    <el-button id="GetVideoDevice" @click="GetDeviceInfo()"
      >获取视频设备列表
    </el-button>
    <el-button id="StartScan" @click="Start()">开启视频 </el-button>
    <el-button id="CaptureFile" @click="Capture1()">拍照(文件) </el-button>
    <el-button id="CaptureBase64" @click="Capture2()">拍照(base64) </el-button>
    <el-button id="zoom1" @click="zoom1()">放大 </el-button>
    <el-button id="zoom2" @click="zoom2()">缩小 </el-button>
    <el-button id="StopScan" @click="Stop()">关闭视频 </el-button>
    <p>预览窗口、执行结果：</p>
    <hr />
    <img id="pic" style="background-color:black;width:320px;height:320px" />
    <textarea id="show" rows="9" cols="30"></textarea>
    <!--<img id="showPic" :src="require('E://456//001.jpg')" style="background-color:white;width:320px;height:320px" />-->
    <el-button type="primary" @click="innerVisible = false">关闭</el-button>
  </el-dialog>
</template>
<script>
import {
  ConnectServer,
  GetVideoDevices,
  SetSavePath,
  SetJPGQuality,
  SetColorType,
  SetBoardColor,
  StartVideo,
  CaptureFile,
  CaptureBase64,
  ZoomIn,
  ZoomOut,
  StopVideo,
} from "@/utils/highPic.js";
export default {
  data() {
    return {
      form: {
        eyes: "",
        remark: "",
      },
      headImgSrc: "",
      dialogCamera: false,
      camera: "",
      innerVisible: false,
    };
  },
  methods: {
    onOpen() {
      this.innerVisible = true;
      ConnectServer();
    },
    ConnectServer() {
      ConnectServer();
    },
    GetDeviceInfo() {
      GetVideoDevices(); //获取视频设备列表
      SetSavePath("E:\\456"); //设置图像保存路径，当采用文件方式拍照时必须设置，base64方式非必须设置
      SetJPGQuality(70); //jpg格式时有效
      SetColorType("彩色"); //指定图像色彩模式，“彩色”、“灰度”、“黑白”三个选项
      //SetWaterMark("这是测试水印", "宋体", 5, 150, 255, 128, 0, 0, 0.5, 1);
      SetBoardColor(0); //1灰色底板机型，0或其他值为黑色底板机型websocket服务器连接失败，请确保已运行跨浏览器服务
    },
    Start() {
      var camIndex = document.getElementById("MainCamDevice").selectedIndex;
      StartVideo(camIndex);
    },
    Capture1() {
      CaptureFile("001.jpg");
    },
    Capture2() {
      CaptureBase64(0);
    },
    zoom1() {
      ZoomIn();
    },
    zoom2() {
      ZoomOut();
    },
    Stop() {
      StopVideo();
    },
  },
};
</script>
<style scoped>
.camera-content {
  text-align: center;
}
</style>
