<template>
  <div>
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
          <!--/\d{4}-\d{1,2}-\d{1,2}/g.exec(dataForm.birthday)-->
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
              <span>{{ dataForm.volunteerBookId }}</span>
            </el-form-item></el-col
          >

          <el-col :span="10"
            ><el-form-item label="转正时间:" prop="positiveTime">
              <span> {{ timeFormat(dataForm.positiveTime) }}</span>
            </el-form-item></el-col
          >
        </el-row>
        <el-row :gutter="20"
          ><el-col :span="10"
            ><el-form-item label="入党介绍人（一）:" prop="referencesOne">
              <span> {{ dataForm.referencesOne }}</span>
            </el-form-item></el-col
          >
          <el-col :span="10"
            ><el-form-item label="入党介绍人（二）:" prop="referencesTwo">
              <span>{{ dataForm.referencesTwo }}</span>
            </el-form-item></el-col
          >
        </el-row>
        <el-row :gutter="20"
          ><el-col :span="10"
            ><el-form-item
              label="入党时所在党支部:"
              prop="joinPartyBranchesName"
            >
              <span>{{ dataForm.joinPartyBranchesName }}</span>
            </el-form-item></el-col
          >
          <el-col :span="10"
            ><el-form-item
              label="转正时所在党支部:"
              prop="positivePartyBranchesName"
            >
              <span>{{ dataForm.positivePartyBranchesName }}</span>
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
        <el-button type="primary" @click="dataFormSubmit()">关闭</el-button>
      </span>
      <hr />

      <el-button type="primary" @click.once="pdfSubmit()">下载pdf</el-button>
    </el-dialog>
    <!--pdf下载<el-dialog :close-on-click-modal="false" :visible.sync="pdfVisible">
      <el-form :model="typeForm" label-width="80px">
        <el-form-item label="档案编号" prop="id">
          <el-input
            v-model="this.dataForm.id"
            placeholder="档案编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片类型" prop="imgType">
          <el-select v-model="typeForm.imgType" filterable placeholder="请选择">
            <el-option
              v-for="item in picTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pdfVisible = false">关闭</el-button>
        <el-button type="primary" @click.once="pdfSubmit()">下载pdf</el-button>
      </span>
    </el-dialog>-->
  </div>
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
      imgList: [],
      dataList: [],
      dialogVisible: false,
      typeList: [],
      picTypeList: [],
      typeForm: {
        imgType: "",
      },
      pdfVisible: false,
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
      if (this.dataForm.id) {
        this.$http({
          url: this.$http.adornUrl(`/manage/file/info/${this.dataForm.id}`),
          method: "get",
        }).then(({ data }) => {
          console.log(data.fileAllInfo.fileImages);
          this.imgList = [];
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
            for (var item in data.fileAllInfo.fileImages) {
              //console.log(item,data.fileAllInfo.fileImages[item])
              for (var i in data.fileAllInfo.fileImages[item]) {
                //console.log(data.fileAllInfo.fileImages[item][i].imgPath)
                //console.log(i,data.fileAllInfo.fileImages[item][i].imgPath.replaceAll('\\','//'))
                this.imgList.push(
                  data.fileAllInfo.fileImages[item][i].imgPath.replaceAll(
                    "\\",
                    "//"
                  )
                );
                //console.log(this.imgList)
              }
            }
          }
        });
      }
    },
    onOpen() {
      this.dialogVisible = true;
    },
    dataFormSubmit() {
      this.dialogVisible = false;
      // 强制刷新
      location.reload();
    },
    // pdf下载
    pdfSearch() {
      this.pdfVisible = true;
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl(`/images/fileimages/type/${this.dataForm.id}`),
        method: "get",
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.typeList = data.typelist;
          var item = "";
          for (item of this.typeList) {
            this.picTypeList.push(this.options[item]);
          }
        }
        this.dataListLoading = false;
      });
    },
    pdfSubmit() {
      this.$http({
        method: "get",
        url: this.$http.adornUrl(`/pdf/write/${this.dataForm.id}`),
        responseType: "blob",
      }).then((res) => {
        let pdf = new Blob([res.data]);
        let url = URL.createObjectURL(pdf);
        let a = document.createElement("a");
        a.href = url;
        a.download = `个人资料-${this.dataForm.name}-${this.dataForm.idCard}.pdf`;
        a.click();
      });
    },
  },
};
</script>
