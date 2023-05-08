<template>
  <div class="mod-user">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-row :gutter="20">
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
        <el-col :span="5"
          ><el-form-item prop="status">
            <el-select
              v-model="dataForm.status"
              filterable
              placeholder="请选择状态"
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
      <el-row :gutter="20">
        <el-col :span="10"
          ><el-form-item label="出生日期" prop="birthday"
            ><el-date-picker
              v-model="dataForm.birthday"
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
          ><el-form-item label="入党日期" prop="joinTime"
            ><el-date-picker
              v-model="dataForm.joinTime"
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
          ><el-form-item label="转正时间" prop="positiveTime"
            ><el-date-picker
              v-model="dataForm.positiveTime"
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
        <!--<template slot-scope="scope">
          <el-button type="text" size="small" @click="personal(scope.row.id)">{{
            scope.row.name
          }}</el-button>
        </template>-->
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
        prop="birthday"
        header-align="center"
        align="center"
        label="出生日期"
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
        prop="positiveTime"
        header-align="center"
        align="center"
        width="150"
        label="转正时间"
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
        sex: "",
        birthday: "",
        joinTime: "",
        positiveTime: "",
        birthdayStart: "",
        birthdayEnd: "",
        joinTimeStart: "",
        joinTimeEnd: "",
        positiveTimeStart: "",
        positiveTimeEnd: "",
        partyBranchesId: "",
        status: 0,
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
  // 这里实现了页面刷新，自动执行函数
  activated() {
    this.getDataList();
    this.getPartyList();
  },
  updated() {
    // element-ui 日期选择器bug
    if (!this.dataForm.birthday) {
      this.dataForm.birthday = [];
    }
    if (
      typeof this.dataForm.birthday !== "string" &&
      this.dataForm.birthday !== 0
    ) {
      this.dataForm.birthdayStart = this.dataForm.birthday[0];
      this.dataForm.birthdayEnd = this.dataForm.birthday[1];
    }
    if (!this.dataForm.joinTime) {
      this.dataForm.joinTime = [];
    }
    if (
      typeof this.dataForm.joinTime !== "string" &&
      this.dataForm.joinTime !== 0
    ) {
      this.dataForm.joinTimeStart = this.dataForm.joinTime[0];
      this.dataForm.joinTimeEnd = this.dataForm.joinTime[1];
    }
    if (!this.dataForm.positiveTime) {
      this.dataForm.positiveTime = [];
    }
    if (
      typeof this.dataForm.positiveTime !== "string" &&
      this.dataForm.positiveTime !== 0
    ) {
      this.dataForm.positiveTimeStart = this.dataForm.positiveTime[0];
      this.dataForm.positiveTimeEnd = this.dataForm.positiveTime[1];
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
          birthdayStart: this.dataForm.birthdayStart,
          joinTimeStart: this.dataForm.joinTimeStart,
          positiveTimeStart: this.dataForm.positiveTimeStart,
          birthdayEnd: this.dataForm.birthdayEnd,
          joinTimeEnd: this.dataForm.joinTimeEnd,
          positiveTimeEnd: this.dataForm.positiveTimeEnd,
          partyBranchesId: this.dataForm.partyBranchesId,
          status: this.dataForm.status,
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
    personal(id) {
      console.log(id);
    },
    // 获取党支部信息
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
        a.download = `党员基本信息表(${
          this.options[
            this.options.findIndex((role) => role.id == this.dataForm.status)
          ].label
        }).xlsx`;
        a.click();
        this.dataListLoading = false;
      });
    },
  },
};
</script>
