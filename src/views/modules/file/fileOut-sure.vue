<template>
  <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false">
    <el-form :model="dataForm" ref="fileRef" class="demo-ruleForm">
      <el-alert title="注意：请先上传转出证明，再进行转出操作！" type="warning">
      </el-alert>
      <el-form-item label="档案编号" prop="id">
        {{ dataForm.id }}
      </el-form-item>
      <el-form-item label="状态选择" prop="status">
        <span class="font-roll">转出</span>
      </el-form-item>
      <el-form-item prop="date" label="日期">
        <el-date-picker
          type="date"
          v-model="dataForm.date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker
      ></el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dataForm: {
        id: "",
        date: "",
      },
      status: 3,
      options: [
        {
          value: 0,
          label: "正常",
        },
        {
          value: 1,
          label: "开除",
        },
        {
          value: 2,
          label: "死亡",
        },
        {
          value: 3,
          label: "转出",
        },
        {
          value: 4,
          label: "删除",
        },
      ],
      dialogVisible: false,
    };
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
    },
    onOpen() {
      this.dialogVisible = true;
      //this.$message.warning('注意：请先上传转出材料，再进行转出操作！')
    },
    dataFormSubmit() {
      this.$http({
        url: this.$http.adornUrl(
          `/manage/file/filealter/${this.dataForm.id}/${this.status}/${this.dataForm.date}`
        ),
        method: "post",
        data: this.$http.adornData({
          id: this.dataForm.id,
          status: this.status,
          date: this.dataForm.date,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.dialogVisible = false;
              // 强制刷新
              location.reload();
            },
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
  },
};
</script>
<style>
.font-roll {
  font-size: 15px;
  color: orange;
}
</style>
