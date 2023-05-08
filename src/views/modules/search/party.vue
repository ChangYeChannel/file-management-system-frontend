<template>
  <div class="mod-user">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <!--<el-form-item label="党支部编号:">
        <el-input
          v-model="dataForm.partyBranchesId"
          placeholder="党支部编号"
          style="width:100%"
          readonly
        ></el-input>
      </el-form-item>-->
      <el-form-item label="党支部:" prop="partyBranchesId">
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
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
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
          <el-button type="text" size="small" @click="party(scope.row.id)">{{
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
        prop="joinTime"
        header-align="center"
        align="center"
        label="入党时间"
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
    <party-sure ref="parSure"></party-sure>
  </div>
</template>

<script>
import PartySure from "./party_sure.vue";
//树形结构扁平化
import { flat } from "@/utils/treeFlat";
export default {
  data() {
    return {
      dataForm: {
        id: "",
        partyBranchesId: "",
        status: 0,
      },
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
    PartySure,
  },
  // 这里实现了页面刷新，自动执行函数
  activated() {
    this.getDataList();
    this.getPartyList();
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
          partyBranchesId: this.dataForm.partyBranchesId,
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
    party(id) {
      this.$refs.parSure.onOpen();
      this.$nextTick(() => {
        this.$refs.parSure.init(id);
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
