<template>
  <div>
    <el-form ref="fileRef" class="demo-ruleForm"
      ><el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="档案编号:" prop="id">
            <span>{{ fileForm.id }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10"
          ><el-form-item label="姓名:" prop="name">
            <span>{{ fileForm.name }}</span></el-form-item
          ></el-col
        >
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="性别:" prop="sex">
            <span
              v-if="
                sexList[
                  this.sexList.findIndex((role) => role.id == fileForm.sex)
                ]
              "
              >{{
                sexList[
                  this.sexList.findIndex((role) => role.id == fileForm.sex)
                ].label
              }}</span
            >
          </el-form-item>
        </el-col>
        <el-col :span="10"
          ><el-form-item label="出生日期:" prop="birthday">
            <span>{{ fileForm.birthday }}</span></el-form-item
          ></el-col
        >
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10"
          ><el-form-item label="身份证号:" prop="idCard">
            <span>{{ fileForm.idCard }}</span>
          </el-form-item></el-col
        >
        <el-col :span="10"
          ><el-form-item label="入党时间:" prop="joinTime">
            <span>{{ fileForm.joinTime }}</span></el-form-item
          ></el-col
        >
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10"
          ><el-form-item label="入党志愿书编号:" prop="volunteerBookId">
            <span>{{ fileForm.volunteerBookId }}</span>
          </el-form-item></el-col
        >
        <el-col :span="10">
          <el-form-item prop="positiveTime" label="转正时间:">
            <span>{{ fileForm.positiveTime }}</span></el-form-item
          ></el-col
        >
      </el-row>
      <el-row :gutter="20"
        ><el-col :span="10"
          ><el-form-item label="入党介绍人（一）:" prop="referencesOne">
            <span>{{ fileForm.referencesOne }}</span></el-form-item
          ></el-col
        >
        <el-col :span="10"
          ><el-form-item label="入党介绍人（二）:" prop="referencesTwo">
            <span>{{ fileForm.referencesTwo }}</span>
          </el-form-item></el-col
        >
      </el-row>
      <el-row :gutter="20"
        ><el-col :span="10"
          ><el-form-item label="入党时所在党支部:" prop="joinPartyBranchesName">
            <span>{{ fileForm.joinPartyBranchesName }}</span></el-form-item
          ></el-col
        >
        <el-col :span="10"
          ><el-form-item
            label="转正时所在党支部:"
            prop="positivePartyBranchesName"
          >
            <span>{{ fileForm.positivePartyBranchesName }}</span>
          </el-form-item></el-col
        >
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10"
          ><el-form-item label="当前所在党支部:" prop="partyBranchesId">
            <span
              v-if="
                partyTree[
                  this.partyTree.findIndex(
                    (role) => role.partyId == fileForm.partyBranchesId
                  )
                ]
              "
              >{{
                partyTree[
                  this.partyTree.findIndex(
                    (role) => role.partyId == fileForm.partyBranchesId
                  )
                ].partyName
              }}</span
            ></el-form-item
          ></el-col
        >
        <el-col :span="10"
          ><el-form-item label="入库时间:" prop="inboundTime">
            <span>{{ fileForm.inboundTime }}</span>
          </el-form-item></el-col
        >
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
    };
  },
  props: {
    fileForm: {
      type: Object,
    },
    partyTree: {
      type: Array,
    },
    sexList: {
      type: Array,
    },
  },
  methods: {
    onOpen() {
      this.visible = true;
    },
    cancel() {
      this.$emit("prev");
    },
    /*picOpen() {
      this.$refs.filePic.onOpen();
      this.$nextTick(() => {
        this.$refs.filePic.init(this.picId);
      });
    },*/
    dataFormSubmit() {
      this.$http({
        url: this.$http.adornUrl(`/manage/file/oldfilesave`),
        method: "post",
        data: this.$http.adornData({
          id: this.fileForm.id,
          name: this.fileForm.name,
          idCard: this.fileForm.idCard,
          joinTime: this.fileForm.joinTime,
          sex: this.fileForm.sex,
          birthday: this.fileForm.birthday,
          joinPartyBranchesName: this.fileForm.joinPartyBranchesName,
          positiveTime: this.fileForm.positiveTime,
          referencesOne: this.fileForm.referencesOne,
          referencesTwo: this.fileForm.referencesTwo,
          positivePartyBranchesName: this.fileForm.positivePartyBranchesName,
          volunteerBookId: this.fileForm.volunteerBookId,
          inboundTime: this.fileForm.inboundTime,
          partyBranchesId: this.fileForm.partyBranchesId,
          status: this.fileForm.status,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.$emit("next");
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
