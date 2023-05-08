<template>
  <div>
    <!--图片删除-->
    <el-dialog :close-on-click-modal="false" :visible.sync="deleteVisible">
      <el-form :model="dataForm" ref="typeForm" label-width="80px">
        <el-form-item label="档案编号" prop="id">
          <el-input v-model="dataForm.id" placeholder="档案编号"></el-input>
        </el-form-item>
        <el-form-item label="资料类型" prop="imgType">
          <el-select v-model="dataForm.imgType" filterable placeholder="请选择">
            <el-option
              v-for="item in delTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteClose()">关闭</el-button>
        <el-button type="primary" @click="submit()">删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      typeList: [],
      delTypeList: [],
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
        id: 0,
        imgType: "",
      },
      deleteVisible: false,
    };
  },
  methods: {
    onOpen() {
      this.deleteVisible = true;
    },
    init(id) {
      this.delTypeList = [];
      this.getPicList(id);
      this.dataForm.id = id || 0;
    },
    //获取该用户已有的图片类型
    getPicList(id) {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl(`/images/fileimages/type/${id}`),
        method: "get",
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.typeList = data.typelist;
          var item = "";
          for (item of this.typeList) {
            this.delTypeList.push(this.options[item]);
          }
          this.typeList = [];
          console.log(this.delTypeList);
        }
        this.dataListLoading = false;
      });
    },
    // 图片删除关闭按钮
    deleteClose() {
      this.$refs["typeForm"].validate((valid) => {
        if (valid) {
          this.$refs["typeForm"].resetFields();
          this.deleteVisible = false;
        }
      });
    },
    // 图片删除
    submit() {
      this.$http({
        url: this.$http.adornUrl(
          `/images/fileimages/delete/${this.dataForm.id}/${this.dataForm.imgType}`
        ),
        method: "post",
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              // 强制刷新
              //location.reload();
              this.$refs["typeForm"].resetFields();
              this.deleteVisible = false;
            },
          });
        } else {
          this.$message.error(data.msg);
          setTimeout(() => {
            location.reload();
          }, 1500);
        }
      });
    },
  },
};
</script>
