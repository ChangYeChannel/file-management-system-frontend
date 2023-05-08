<template>
  <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false">
    <el-form :model="dataForm" ref="fileRef" class="demo-ruleForm">
      <el-form-item label="档案编号" prop="id">
        {{ dataForm.id }}
      </el-form-item>
      <!--<el-form-item
        label="转正时所在党支部"
        prop="positivePartyBranchesName"
      >
        <el-select
          v-model="dataForm.positivePartyBranchesName"
          filterable
          placeholder="请选择"
          disabled
        >
          <el-option
            v-for="item in partyTree"
            :key="item.partyId"
            :label="item.partyName"
            :value="item.partyId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="" label="转正时间">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          style="width: 100%;"
          readonly
        ></el-date-picker
      ></el-form-item>-->
      <el-form-item label="转出党支部" prop="positiveName">
        <el-select
          v-model="dataForm.positiveName"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in partyTree"
            :key="item.partyId"
            :label="item.partyName"
            :value="item.partyId"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { flat } from "@/utils/treeFlat";
export default {
  data() {
    return {
      dataForm: {
        id: "",
        positiveName: "",
      },
      partyTree: [],
      dialogVisible: false,
    };
  },
  // 这里实现了页面刷新，自动执行函数
  activated() {
    this.getPartyList();
  },
  methods: {
    getPartyList() {
      this.$http({
        url: this.$http.adornUrl(`/manage/party/list/tree`),
        method: "get",
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.partyTree = flat(data.tree);
        }
      });
    },
    init(id) {
      this.dataForm.id = id || 0;
    },
    onOpen() {
      this.dialogVisible = true;
    },
    dataFormSubmit() {
      this.$http({
        //POST /manage/file/partytweaks
        url: this.$http.adornUrl(`/manage/file/partytweaks`),
        method: "post",
        data: this.$http.adornData({
          baseIds: this.dataForm.id,
          partyId: this.dataForm.positiveName,
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
