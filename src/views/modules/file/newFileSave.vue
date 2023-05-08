<template>
  <div>
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1"> </el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>
    <el-form
      v-show="active === 0"
      :model="fileForm"
      :rules="rules"
      ref="fileRef"
      class="demo-ruleForm"
      @keyup.enter.native="getPartyList()"
      ><el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="档案编号" prop="id">
            <el-input
              v-model="fileForm.id"
              placeholder="请输入档案编号"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10"
          ><el-form-item label="姓名" prop="name">
            <el-input
              v-model="fileForm.name"
              placeholder="请输入姓名"
              clearable
            ></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="性别" prop="sex">
            <el-select
              v-model="fileForm.sex"
              filterable
              placeholder="请选择性别"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in sexList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10"
          ><el-form-item label="出生日期" prop="birthday">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="fileForm.birthday"
              style="width: 100%;"
              value-format="yyyy-MM-dd"
              clearable
            ></el-date-picker></el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10"
          ><el-form-item label="身份证号" prop="idCard">
            <el-input
              v-model="fileForm.idCard"
              placeholder="请输入身份证号"
              @blur="idCardRe"
              clearable
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="10"
          ><el-form-item label="入党时间" prop="joinTime">
            <el-date-picker
              v-model="fileForm.joinTime"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
              value-format="yyyy-MM-dd"
              clearable
            >
            </el-date-picker></el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10"
          ><el-form-item label="入党志愿书编号" prop="volunteerBookId">
            <el-input
              v-model="fileForm.volunteerBookId"
              placeholder="请输入"
              clearable
            ></el-input> </el-form-item
        ></el-col>

        <el-col :span="10"
          ><el-form-item label="转正时间"
            ><el-form-item prop="positiveTime">
              <el-date-picker
                placeholder="选择日期"
                type="date"
                v-model="fileForm.positiveTime"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
                clearable
              ></el-date-picker></el-form-item></el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20"
        ><el-col :span="10"
          ><el-form-item label="入党介绍人（一）" prop="referencesOne">
            <el-input
              v-model="fileForm.referencesOne"
              placeholder="请输入"
              clearable
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="10"
          ><el-form-item label="入党介绍人（二）" prop="referencesTwo">
            <el-input
              v-model="fileForm.referencesTwo"
              placeholder="请输入"
              clearable
            ></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10"
          ><el-form-item label="入党时所在党支部" prop="joinPartyBranchesName">
            <el-select
              v-model="fileForm.joinPartyBranchesName"
              filterable
              placeholder="请选择"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in partyTree"
                :key="item.partyId"
                :label="item.partyName"
                :value="item.partyName"
              >
              </el-option>
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="10"
          ><el-form-item
            label="转正时所在党支部"
            prop="positivePartyBranchesName"
          >
            <el-select
              v-model="fileForm.positivePartyBranchesName"
              filterable
              placeholder="请选择"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in partyTree"
                :key="item.partyId"
                :label="item.partyName"
                :value="item.partyName"
              >
              </el-option>
            </el-select> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10"
          ><el-form-item label="当前所在党支部" prop="partyBranchesId">
            <el-select
              v-model="fileForm.partyBranchesId"
              filterable
              placeholder="请选择"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in partyTree"
                :key="item.partyId"
                :label="item.partyName"
                :value="item.partyId"
              >
              </el-option>
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="10"
          ><el-form-item label="入库时间" prop="inboundTime">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="fileForm.inboundTime"
              style="width: 100%;"
              value-format="yyyy-MM-dd"
              clearable
            ></el-date-picker></el-form-item
        ></el-col>
      </el-row>
      <el-form-item label-width="1050px">
        <el-button type="primary" @click="submitForm('fileRef')"
          >立即创建</el-button
        >
        <el-button @click="resetForm('fileRef')">重置</el-button>
        <el-button v-if="false" @click="excelDown()">表格</el-button>
        <el-button v-if="false" @click="pdfDown()">下载pdf</el-button>
      </el-form-item>
    </el-form>
    <saveSure
      v-show="active === 1"
      :fileForm="fileForm"
      :partyTree="partyTree"
      :sexList="sexList"
      @next="next()"
      @prev="prev()"
      ref="saveSure"
    ></saveSure>
    <pic-input
      v-show="active === 2"
      ref="picInput"
      :fileForm="fileForm"
      @next="next()"
      @prev="prev()"
    ></pic-input>
    <el-button v-show="active === 3" style="margin-top: 12px;" @click="next"
      >下一步</el-button
    >
  </div>
</template>
<script>
import saveSure from "./newFileSave-sure.vue";
import PicInput from "./picInput.vue";
//树形结构扁平化
import { flat } from "@/utils/treeFlat";
export default {
  data() {
    return {
      active: 0,
      fileForm: {
        id: "",
        name: "",
        idCard: "",
        joinTime: "",
        sex: "",
        birthday: "",
        joinPartyBranchesName: "",
        positiveTime: "",
        referencesOne: "",
        referencesTwo: "",
        positivePartyBranchesName: "",
        volunteerBookId: "",
        partyBranchesId: "",
        inboundTime: "",
        partyName: "",
        status: 0,
      },
      partyTree: [],
      /*defaultProps: {
        children: "children",
        label: "partyName",
        value: "partyId",
      },*/
      sexList: [
        {
          id: "0",
          label: "女",
        },
        {
          id: "1",
          label: "男",
        },
      ],
      visible: false,
      disabled: false,
      sure: false,
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        id: [
          { required: true, message: "请输入档案编号", trigger: "blur" },
          {
            pattern: /^[^\u4e00-\u9fa5]+$/,
            message: "档案编号不能为中文！",
            trigger: "blur",
          },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        birthday: [
          { required: true, message: "请选择日期", trigger: "change" },
        ],
        idCard: [
          { required: true, message: "请填写证件号码", trigger: "blur" },
          {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: "证件号码格式有误！",
            trigger: "blur",
          },
        ],
        joinTime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        partyBranchesId: [
          {
            required: true,
            message: "请选择当前所在党支部",
            trigger: "change",
          },
        ],
        inboundTime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
      },
    };
  },
  components: {
    saveSure,
    PicInput,
  },
  // 这里实现了页面刷新，自动执行函数
  activated() {
    this.getPartyList();
  },
  methods: {
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    prev() {
      if (this.active-- < 0) this.active = 0;
    },
    // 步骤条
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //this.$refs.saveSure.onOpen();
          this.next();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    picInput(id) {
      //this.$refs.picInput.onOpen();
      this.$nextTick(() => {
        this.$refs.picInput.init(id);
      });
    },
    idCardRe() {
      this.$http({
        url: this.$http.adornUrl(
          `/manage/file/checkidcard/${this.fileForm.idCard}`
        ),
        method: "post",
      }).then(({ data }) => {
        if (data && data.code === 500) {
          this.$message.error("该身份证号已存在！");
          this.fileForm.idCard = "";
        }
      });
    },
    /*//树形select选择joinPartyBranchesName
    handleNodeClick(partyTree) {
      //console.log(partyTree);
      this.fileForm.joinParty.partyId = partyTree.partyId;
      this.fileForm.joinParty.joinPartyBranchesName = partyTree.partyName;
      // 使 input 失去焦点，并隐藏下拉框
      this.$refs.selectTree.blur();
    },
    handleNodeClickPositive(partyTree) {
      //console.log(partyTree);
      this.fileForm.positiveParty.partyId = partyTree.partyId;
      this.fileForm.positiveParty.positivePartyBranchesName =
        partyTree.partyName;
      // 使 input 失去焦点，并隐藏下拉框
      this.$refs.select.blur();
    },
    handleNodeClickParty(partyTree) {
      //console.log(partyTree);
      this.fileForm.partyBranchesId = partyTree.partyId;
      this.fileForm.partyName = partyTree.partyName;
      console.log(this.fileForm.partyBranchesId);
      // 使 input 失去焦点，并隐藏下拉框
      this.$refs.selectParty.blur();
    },*/
    excelDown() {
      this.$http({
        method: "get",
        url: this.$http.adornUrl(`/excel/write`),
        responseType: "blob",
      }).then((res) => {
        let excel = new Blob([res.data]);
        let url = URL.createObjectURL(excel);
        let a = document.createElement("a");
        a.href = url;
        a.download = "党员基本信息表.xlsx";
        a.click();
      });
    },
    pdfDown() {
      this.$http({
        method: "get",
        url: this.$http.adornUrl(`/pdf/write`),
        responseType: "blob",
      }).then((res) => {
        let pdf = new Blob([res.data]);
        let url = URL.createObjectURL(pdf);
        let a = document.createElement("a");
        a.href = url;
        a.download = "xxx.pdf";
        a.click();
      });
    },
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
  },
};
</script>

<style scoped>
.demo-ruleForm {
  width: 1450px;
  margin: auto;
}
</style>
