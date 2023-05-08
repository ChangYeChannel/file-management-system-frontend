<template>
  <div class="mod-user">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-row :gutter="20">
        <el-col :span="6"
          ><el-form-item prop="name">
            <el-input
              v-model="dataForm.name"
              placeholder="请输入姓名"
              clearable
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="6"
          ><el-form-item prop="idCard">
            <el-input
              v-model="dataForm.idCard"
              placeholder="请输入身份证号"
              clearable
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="6"
          ><el-form-item prop="sex">
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
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="6"
          ><el-form-item prop="partyBranchesId">
            <el-select
              v-model="dataForm.partyBranchesId"
              filterable
              placeholder="请选择所在党支部"
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
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10"
          ><el-form-item label="转出日期" prop="rolloutTime"
            ><el-date-picker
              v-model="dataForm.rolloutTime"
              type="daterange"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker></el-form-item
        ></el-col>
        <el-col :span="10"
          ><el-form-item>
            <el-button @click="getDataList()">查询</el-button>
          </el-form-item></el-col
        >
      </el-row>
    </el-form>
    <el-button type="primary" @click="getAllList()" style="margin-bottom:10px"
      >表格下载</el-button
    >
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="300"
        label="档案编号"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="姓名"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="rollout(scope.row.id)">{{
            scope.row.name
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="idCard"
        header-align="center"
        align="center"
        label="身份证号"
      >
      </el-table-column>
      <el-table-column
        prop="partyBranchesId"
        header-align="center"
        align="center"
        label="当前所在党支部"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="
              scope.row.partyBranchesId &&
                partyTree.find(
                  (role) => role.partyId == scope.row.partyBranchesId
                )
            "
            size="small"
            type="primary"
            >{{
              partyTree.find(
                (role) => role.partyId == scope.row.partyBranchesId
              ).partyName
            }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="joinTime"
        header-align="center"
        align="center"
        label="入党时间"
      >
      </el-table-column>
      <el-table-column
        prop="rolloutTime"
        header-align="center"
        align="center"
        label="转出时间"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="primary"
            >正常</el-tag
          >
          <el-tag v-else-if="scope.row.status === 1" size="small" type="warning"
            >开除</el-tag
          ><el-tag v-else-if="scope.row.status === 2" size="small" type="danger"
            >死亡</el-tag
          >
          <el-tag v-else size="small" type="info">转出</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="inboundTime"
        header-align="center"
        align="center"
        width="150"
        label="录入时间"
      >
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
    <rollout-sure ref="rolSure"></rollout-sure>
  </div>
</template>

<script>
import RolloutSure from "./rollout_sure.vue";
//树形结构扁平化
import { flat } from "@/utils/treeFlat";
export default {
  data() {
    return {
      dataForm: {
        id: "",
        name: "",
        idCard: "",
        sex: "",
        birthday: "",
        joinTime: "",
        rolloutTime: "",
        positiveTime: "",
        partyBranchesId: "",
        rolloutTimeStart: "",
        rolloutTimeEnd: "",
        status: 3,
      },
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
      partyTree: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
    };
  },
  components: {
    RolloutSure,
  },
  // 这里实现了页面刷新，自动执行函数
  activated() {
    this.getDataList();
    this.getPartyList();
  },
  updated() {
    // element-ui 日期选择器bug
    if (!this.dataForm.rolloutTime) {
      this.dataForm.rolloutTime = [];
    }
    if (
      typeof this.dataForm.rolloutTime !== "string" &&
      this.dataForm.rolloutTime !== 0
    ) {
      this.dataForm.rolloutTimeStart = this.dataForm.rolloutTime[0];
      this.dataForm.rolloutTimeEnd = this.dataForm.rolloutTime[1];
    }
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/manage/file/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          name: this.dataForm.name,
          idCard: this.dataForm.idCard,
          sex: this.dataForm.sex,
          birthday: this.dataForm.birthday,
          joinTime: this.dataForm.joinTime,
          positiveTime: this.dataForm.positiveTime,
          partyBranchesId: this.dataForm.partyBranchesId,
          rolloutTimeStart: this.dataForm.rolloutTimeStart,
          rolloutTimeEnd: this.dataForm.rolloutTimeEnd,
          status: this.dataForm.status,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 查看个人信息
    rollout(id) {
      this.$refs.rolSure.onOpen();
      this.$nextTick(() => {
        this.$refs.rolSure.init(id);
      });
    },
    //所有个人信息表格下载
    getAllList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/manage/file/excelbycondition"),
        method: "get",
        params: this.$http.adornParams({
          name: this.dataForm.name,
          idCard: this.dataForm.idCard,
          sex: this.dataForm.sex,
          birthday: this.dataForm.birthday,
          joinTime: this.dataForm.joinTime,
          positiveTime: this.dataForm.positiveTime,
          partyBranchesId: this.dataForm.partyBranchesId,
          status: this.dataForm.status,
        }),
        responseType: "blob",
      }).then((res) => {
        console.log(res.data);
        let excel = new Blob([res.data]);
        let url = URL.createObjectURL(excel);
        let a = document.createElement("a");
        a.href = url;
        a.download = `党员转出信息表.xlsx`;
        a.click();
        this.dataListLoading = false;
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
    //表格下载
    /*excelDown() {
      this.$http({
        url: this.$http.adornUrl(`/excel/write`),
        method: "post",
        data: this.dataAll,
        responseType: "blob",
      }).then((res) => {});
    },*/
  },
};
</script>
