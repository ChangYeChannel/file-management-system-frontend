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
          ><el-form-item label="死亡日期" prop="deathTime"
            ><el-date-picker
              v-model="dataForm.deathTime"
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
        <el-col :span="6"
          ><el-form-item>
            <el-button @click="getDataList()">查询</el-button>
          </el-form-item></el-col
        >
      </el-row>
    </el-form>
    <el-button type="primary" @click="excelDown()" style="margin-bottom:10px"
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
          <el-button type="text" size="small" @click="die(scope.row.id)">{{
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
        prop="deathTime"
        header-align="center"
        align="center"
        label="死亡时间"
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
    <die-sure ref="dieSure"></die-sure>
  </div>
</template>

<script>
//树形结构扁平化
import DieSure from "./die_sure.vue";
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
        positiveTime: "",
        deathTime: "",
        deathTimeStart: "",
        deathTimeEnd: "",
        partyBranchesId: "",
        status: 2,
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
  components: { DieSure },
  // 这里实现了页面刷新，自动执行函数
  activated() {
    this.getDataList();
    this.getPartyList();
  },
  updated() {
    // element-ui 日期选择器bug
    if (!this.dataForm.deathTime) {
      this.dataForm.deathTime = [];
    }
    if (
      typeof this.dataForm.deathTime !== "string" &&
      this.dataForm.deathTime !== 0
    ) {
      this.dataForm.deathTimeStart = this.dataForm.deathTime[0];
      this.dataForm.deathTimeEnd = this.dataForm.deathTime[1];
    }
  },
  methods: {
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
          status: this.dataForm.status,
          idCard: this.dataForm.idCard,
          sex: this.dataForm.sex,
          birthday: this.dataForm.birthday,
          joinTime: this.dataForm.joinTime,
          positiveTime: this.dataForm.positiveTime,
          deathTimeStart: this.dataForm.deathTimeStart,
          deathTimeEnd: this.dataForm.deathTimeEnd,
          partyBranchesId: this.dataForm.partyBranchesId,
        }),
      }).then(({ data }) => {
        //console.log(data);
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
    die(id) {
      this.$refs.dieSure.onOpen();
      this.$nextTick(() => {
        this.$refs.dieSure.init(id);
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
    excelDown() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/manage/file/excelbycondition"),
        method: "get",
        params: this.$http.adornParams({
          name: this.dataForm.name,
          idCard: this.dataForm.idCard,
          status: this.dataForm.status,
          idCard: this.dataForm.idCard,
          sex: this.dataForm.sex,
          birthday: this.dataForm.birthday,
          joinTime: this.dataForm.joinTime,
          positiveTime: this.dataForm.positiveTime,
          partyBranchesId: this.dataForm.partyBranchesId,
        }),
        responseType: "blob",
      }).then((res) => {
        console.log(res.data);
        let excel = new Blob([res.data]);
        let url = URL.createObjectURL(excel);
        let a = document.createElement("a");
        a.href = url;
        a.download = `党员死亡信息表.xlsx`;
        a.click();
        this.dataListLoading = false;
      });
    },
  },
};
</script>
