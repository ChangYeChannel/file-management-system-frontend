<template>
  <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false">
    <el-form
      :model="dataForm"
      ref="fileRef"
      class="demo-ruleForm"
      :rules="rules"
      ><el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="档案编号" prop="id">
            <el-input
              v-model="dataForm.id"
              placeholder="请输入档案编号"
              clearable
              readonly
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10"
          ><el-form-item label="姓名" prop="name">
            <el-input
              v-model="dataForm.name"
              placeholder="请输入姓名"
              clearable
            ></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="性别" prop="sex">
            <el-select
              v-model="dataForm.sex"
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
              v-model="dataForm.birthday"
              style="width: 100%"
              value-format="yyyy-MM-dd"
              clearable
            ></el-date-picker></el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10"
          ><el-form-item label="身份证号" prop="idCard">
            <el-input
              v-model="dataForm.idCard"
              placeholder="请输入身份证号"
              clearable
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="10"
          ><el-form-item label="入党时间" prop="joinTime">
            <el-date-picker
              v-model="dataForm.joinTime"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
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
              v-model="dataForm.volunteerBookId"
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
                v-model="dataForm.positiveTime"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                clearable
              ></el-date-picker></el-form-item></el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20"
        ><el-col :span="10"
          ><el-form-item label="入党介绍人（一）" prop="referencesOne">
            <el-input
              v-model="dataForm.referencesOne"
              placeholder="请输入"
              clearable
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="10"
          ><el-form-item label="入党介绍人（二）" prop="referencesTwo">
            <el-input
              v-model="dataForm.referencesTwo"
              placeholder="请输入"
              clearable
            ></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20"
        ><el-col :span="10"
          ><el-form-item label="入党时所在党支部" prop="joinPartyBranchesName">
            <el-input
              v-model="dataForm.joinPartyBranchesName"
              placeholder="请输入"
              clearable
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="10"
          ><el-form-item
            label="转正时所在党支部"
            prop="positivePartyBranchesName"
          >
            <el-input
              v-model="dataForm.positivePartyBranchesName"
              placeholder="请输入"
              clearable
            ></el-input></el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10"
          ><el-form-item label="当前所在党支部" prop="partyBranchesId">
            <el-select
              v-model="dataForm.partyBranchesId"
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
              v-model="dataForm.inboundTime"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            ></el-date-picker></el-form-item></el-col
      ></el-row>
      <el-row :gutter="20"
        ><el-col :span="10"
          ><el-form-item label="状态:" prop="status">
            <el-select
              v-model="dataForm.status"
              filterable
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              >
              </el-option>
            </el-select> </el-form-item
        ></el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
//树形结构扁平化
import { flat } from "@/utils/treeFlat";
export default {
  data() {
    return {
      dataForm: {
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
        inboundTime: "",
        partyBranchesId: "",
        status: 0,
      },
      options: [
        {
          id: 0,
          label: "正常",
        },
        {
          id: 1,
          label: "开除",
        },
        {
          id: 2,
          label: "死亡",
        },
        {
          id: 3,
          label: "转出",
        },
      ],
      partyTree: [],
      sexList: [
        {
          id: 0,
          label: "女",
        },
        {
          id: 1,
          label: "男",
        },
      ],
      dataList: {},
      dialogVisible: false,
      rules: {
        idCard: [
          { required: true, message: "请填写证件号码", trigger: "blur" },
          {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: "证件号码格式有误！",
            trigger: "blur",
          },
        ],
      },
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
      /*this.$http({
        url: this.$http.adornUrl("/manage/file/list"),
        method: "get",
        params: this.$http.adornParams(),
      })
        .then(({ data }) => {
          this.roleList = data && data.code === 0 ? data.list : [];
        })
        /*.then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs["fileRef"].resetFields();
          });
        })
        .then(() => {*/
      if (this.dataForm.id) {
        this.$http({
          url: this.$http.adornUrl(`/manage/file/info/${this.dataForm.id}`),
          method: "get",
          //params: this.$http.adornParams(),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm.id = data.fileAllInfo.id;
            this.dataForm.name = data.fileAllInfo.name;
            this.dataForm.idCard = data.fileAllInfo.idCard;
            this.dataForm.joinTime = data.fileAllInfo.joinTime;
            this.dataForm.sex = data.fileAllInfo.sex;
            this.dataForm.birthday = data.fileAllInfo.birthday;
            this.dataForm.joinPartyBranchesName =
              data.fileAllInfo.joinPartyBranchesName;
            this.dataForm.positiveTime = data.fileAllInfo.positiveTime;
            this.dataForm.referencesOne = data.fileAllInfo.referencesOne;
            this.dataForm.referencesTwo = data.fileAllInfo.referencesTwo;
            this.dataForm.positivePartyBranchesName =
              data.fileAllInfo.positivePartyBranchesName;
            this.dataForm.volunteerBookId = data.fileAllInfo.volunteerBookId;
            this.dataForm.inboundTime = data.fileAllInfo.inboundTime;
            this.dataForm.partyBranchesId = data.fileAllInfo.partyBranchesId;
            this.dataForm.status = data.fileAllInfo.status;
          }
          this.dataList = JSON.parse(JSON.stringify(this.dataForm));
          console.log(this.dataList);
          console.log(
            JSON.stringify(this.dataList) === JSON.stringify(this.dataForm)
          );
        });
      }
      //});
    },
    onOpen() {
      this.dialogVisible = true;
    },
    dataFormSubmit() {
      if (JSON.stringify(this.dataList) !== JSON.stringify(this.dataForm)) {
        this.$http({
          url: this.$http.adornUrl(`/manage/file/fileupdate`),
          method: "post",
          data: this.$http.adornData({
            id: this.dataForm.id,
            name: this.dataForm.name,
            idCard: this.dataForm.idCard,
            joinTime: this.dataForm.joinTime,
            sex: this.dataForm.sex,
            birthday: this.dataForm.birthday,
            joinPartyBranchesName: this.dataForm.joinPartyBranchesName,
            positiveTime: this.dataForm.positiveTime,
            referencesOne: this.dataForm.referencesOne,
            referencesTwo: this.dataForm.referencesTwo,
            positivePartyBranchesName: this.dataForm.positivePartyBranchesName,
            volunteerBookId: this.dataForm.volunteerBookId,
            inboundTime: this.dataForm.inboundTime,
            partyBranchesId: this.dataForm.partyBranchesId,
            status: this.dataForm.status,
          }),
        }).then(({ data }) => {
          console.log(data);
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
      } else {
        this.dialogVisible = false;
      }
    },
  },
};
</script>
