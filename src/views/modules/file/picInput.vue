<template>
  <div>
    <el-form :model="dataForm" ref="dataForm" label-width="80px">
      <el-alert title="注意：请先选择资料类型，再进行上传操作！" type="warning">
      </el-alert>
      <el-form-item label="档案编号" prop="id">
        <el-input v-model="this.fileForm.id" placeholder="档案编号"></el-input>
      </el-form-item>
      <el-form-item label="资料类型" prop="imgType">
        <el-select v-model="dataForm.imgType" filterable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-upload
          ref="uploadfiles"
          class="upload-demo"
          action=""
          :multiple="true"
          :auto-upload="false"
          :before-upload="beforeAvatarUpload"
          :file-list="fileList"
          :on-change="handleChange"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <div slot="tip" class="el-upload__tip">
            只能上传jpg、bmp格式的图片,且图片大小不超过2M
          </div>
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="uploadForm()">上传</el-button>
      <!--<el-button @click="dataFormSubmit()">取消</el-button>-->
      <el-button type="primary" @click="dataFormSubmit()">关闭</el-button>
      <!--<el-button type="info" @click="handleCamera()">拍照</el-button>-->
    </span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fileList: [],
      options: [
        {
          value: "0",
          label: "入党志愿书",
        },
        {
          value: "1",
          label: "入党申请书",
        },
        {
          value: "2",
          label: "政治审查材料",
        },
        {
          value: "3",
          label: "转正申请书",
        },
        {
          value: "4",
          label: "全程纪实材料",
        },
        {
          value: "5",
          label: "转出证明",
        },
        {
          value: "6",
          label: "死亡证明",
        },
        {
          value: "7",
          label: "开除党籍证明",
        },
        {
          value: "8",
          label: "其他材料",
        },
      ],
      dataForm: {
        imgType: "",
      },
      dialogImageUrl: "",
      dialogVisible: false,
      /*rules: {
        imgType: [
          {
            required: true,
            message: "请选择资料类型",
            trigger: "change",
          },
        ],
      },*/
    };
  },
  props: {
    fileForm: {
      type: Object,
    },
  },
  methods: {
    //图片删除
    handleRemove(file) {
      this.fileList = this.fileList.filter((item) => item.name != file.name);
      console.log(file, this.fileList);
    },
    //图片大小不能超过2mb
    beforeAvatarUpload(file) {
      const isJpeg =
        file.raw.type === "image/jpeg" || file.raw.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJpeg) {
        this.$message.error("上传图片只能是 JPG/BMP 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJpeg && isLt2M;
    },
    // 选择文件时，往fileList里添加
    handleChange(file) {
      const x = this.beforeAvatarUpload(file);
      console.log(x);
      if (x) {
        this.fileList.push(file);
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    onOpen() {
      this.visible = true;
    },
    init(id) {
      this.dataForm.id = id || 0;
    },
    // 图片上传
    uploadForm() {
      if (this.fileList.length === 0) {
        this.$message.warning("请选取文件");
        return;
      }
      //this.$refs.uploadfiles.submit()
      const formData = new FormData();
      // 因为要传一个文件数组过去，所以要循环append
      this.fileList.forEach((file) => {
        formData.append("files", file.raw);
      });
      this.$http({
        url: this.$http.adornUrl(
          `/fileupload/${this.fileForm.id}/${this.dataForm.imgType}`
        ),
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 500,
          });
        } else {
          this.$message.error(data.msg);
        }
      });
      // 清空图片列表
      this.fileList = [];
    },
    // 表单提交\取消
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$refs["dataForm"].resetFields();
          this.$emit("next");
          //this.visible = false;
          this.$refs.uploadfiles.clearFiles();
          // 强制刷新
          location.reload();
        }
      });
    },
  },
};
</script>
