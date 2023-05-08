<template>
  <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false">
    <el-form :model="dataForm" ref="fileRef" class="demo-ruleForm"
      ><el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="档案编号:" prop="id">
            <span>{{ dataForm.id }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10"
          ><el-form-item label="姓名:" prop="name">
            <span>{{ dataForm.name }}</span></el-form-item
          ></el-col
        >
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="性别:" prop="sex">
            <span
              v-if="
                sexList[
                  this.sexList.findIndex((role) => role.id == dataForm.sex)
                ]
              "
              >{{
                sexList[
                  this.sexList.findIndex((role) => role.id == dataForm.sex)
                ].label
              }}</span
            >
          </el-form-item>
        </el-col>
        <el-col :span="10"
          ><el-form-item label="出生日期:" prop="birthday">
            <span>{{ timeFormat(dataForm.birthday) }}</span>
          </el-form-item></el-col
        >
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10"
          ><el-form-item label="身份证号:" prop="idCard">
            <span>{{ dataForm.idCard }}</span></el-form-item
          ></el-col
        >
        <el-col :span="10"
          ><el-form-item label="入党时间:" prop="joinTime">
            <span>{{ timeFormat(dataForm.joinTime) }}</span></el-form-item
          ></el-col
        >
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10"
          ><el-form-item label="入党志愿书编号:" prop="volunteerBookId">
            <span v-if="dataList.volunteerBookId">{{
              dataForm.volunteerBookId
            }}</span>
            <el-input
              v-else
              v-model="dataForm.volunteerBookId"
              clearable
            ></el-input> </el-form-item
        ></el-col>

        <el-col :span="10"
          ><el-form-item label="转正时间:" prop="positiveTime">
            <span v-if="dataList.positiveTime">
              {{ timeFormat(dataForm.positiveTime) }}</span
            >
            <el-date-picker
              v-else
              type="date"
              placeholder="选择日期"
              v-model="dataForm.positiveTime"
              style="width: 100%;"
              value-format="yyyy-MM-dd"
              clearable
            ></el-date-picker></el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20"
        ><el-col :span="10"
          ><el-form-item label="入党介绍人（一）:" prop="referencesOne">
            <span v-if="dataList.referencesOne">
              {{ dataForm.referencesOne }}</span
            >
            <el-input
              v-else
              v-model="dataForm.referencesOne"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="10"
          ><el-form-item label="入党介绍人（二）:" prop="referencesTwo">
            <span v-if="dataList.referencesTwo">{{
              dataForm.referencesTwo
            }}</span>
            <el-input
              v-else
              v-model="dataForm.referencesTwo"
              clearable
            ></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20"
        ><el-col :span="10"
          ><el-form-item label="入党时所在党支部:" prop="joinPartyBranchesName">
            <span v-if="dataList.joinPartyBranchesName">{{
              dataForm.joinPartyBranchesName
            }}</span>
            <el-input
              v-else
              v-model="dataForm.joinPartyBranchesName"
              placeholder="请输入"
              clearable
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="10"
          ><el-form-item
            label="转正时所在党支部:"
            prop="positivePartyBranchesName"
          >
            <span v-if="dataList.positivePartyBranchesName">{{
              dataForm.positivePartyBranchesName
            }}</span>
            <el-input
              v-else
              v-model="dataForm.positivePartyBranchesName"
              placeholder="请输入"
              clearable
            ></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10"
          ><el-form-item label="当前所在党支部:" prop="partyBranchesId">
            <span
              v-if="
                partyTree[
                  this.partyTree.findIndex(
                    (role) => role.partyId == dataForm.partyBranchesId
                  )
                ]
              "
              >{{
                partyTree[
                  this.partyTree.findIndex(
                    (role) => role.partyId == dataForm.partyBranchesId
                  )
                ].partyName
              }}</span
            ></el-form-item
          ></el-col
        >
        <el-col :span="10"
          ><el-form-item label="入库时间:" prop="inboundTime">
            <span>{{ timeFormat(dataForm.inboundTime) }}</span>
          </el-form-item></el-col
        ></el-row
      >
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
      partyTree: [],
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
      dataList: [],
      dataObj: {},
      dialogVisible: false,
    };
  },
  // 这里实现了页面刷新，自动执行函数
  activated() {
    this.getPartyList();
  },
  methods: {
    // 时间格式化，去除时分秒
    timeFormat(date) {
      if (date) {
        let newDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(date);
        return newDate[0];
      } else {
        return "";
      }
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
          console.log(data);
          if (data && data.code === 0) {
            this.dataList = data.fileAllInfo;
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
          }
          this.dataObj = JSON.parse(JSON.stringify(this.dataForm));
        });
      }
      //});
    },
    onOpen() {
      this.dialogVisible = true;
    },
    dataFormSubmit() {
      if (JSON.stringify(this.dataObj) !== JSON.stringify(this.dataForm)) {
        this.$http({
          url: this.$http.adornUrl(`/manage/file/baseadd`),
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
            status: this.dataForm.status,
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
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
