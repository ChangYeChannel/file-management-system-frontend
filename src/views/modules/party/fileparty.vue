<template>
  <div class="mod-config">
    <el-switch
      v-model="draggable"
      active-text="开启拖拽"
      inactive-text="关闭拖拽"
    ></el-switch>
    <el-button type="primary" plain @click="createOne"
      >新增一级党组织信息</el-button
    >
    <el-button type="danger" plain @click="batchDelete">批量删除</el-button>
    <el-tree
      :data="partyList"
      :props="defaultProps"
      :expand-on-click-node="false"
      :draggable="draggable"
      show-checkbox
      node-key="partyId"
      :default-expanded-keys="expandedKey"
      ref="partyTree"
      @node-drop="handleDrop"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button type="text" size="mini" @click="() => append(data)"
            >新增党支部</el-button
          >
          <el-button type="text" size="mini" @click="edit(data)"
            >修改</el-button
          >
          <el-button
            v-if="node.childNodes.length == 0"
            type="text"
            size="mini"
            @click="() => remove(node, data)"
            >删除</el-button
          >
        </span>
      </span>
    </el-tree>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="party">
        <el-form-item
          label="党支部编号"
          v-if="showPartyId == true"
          :error="errorMsg1"
        >
          <el-input
            v-model="party.partyId"
            autocomplete="off"
            @blur="checkId"
            placeholder="请输入编号（限数字）"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input>
        </el-form-item>
        <el-form-item label="党支部名称" :error="errorMsg2">
          <el-input
            v-model="party.partyName"
            autocomplete="off"
            @blur="checkName"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      draggable: false, //是否开启拖拽
      errorMsg1: "", //党支部编号唯一性验证错误信息
      errorMsg2: "", //党支部名称唯一性验证错误信息
      showPartyId: true, //表单是否显示党支部编号，修改时不显示
      title: "", //对话框标题
      dialogType: "", //对话框属性
      party: {
        partyId: null,
        partyName: "",
        parentId: null,
      }, //新增修改对象
      dialogVisible: false, //对话框是否显示
      partyList: [], //树形数据
      expandedKey: [], //展开树形数据
      defaultProps: {
        children: "children",
        label: "partyName",
      }, //节点属性值
    };
  },
  created() {
    this.getPartyList();
  },
  methods: {
    //新增一级党组织信息
    createOne() {
      this.dialogType = "add";
      this.title = "添加支部信息";
      this.dialogVisible = true;
      this.showPartyId = true;
      this.party.partyId = null;
      this.party.partyName = "";
      //新增一级党组织信息，不显示上级党组织编号，默认为一级党组织编号
      this.party.parentId = 0;
    },

    //节点拖拽完成之后触发的事件
    handleDrop(draggingNode, dropNode, dropType) {
      console.log("handleDrop: ", draggingNode, dropNode, dropType);
      //1、当前节点最新的父节点id
      let pId = 0;
      if (dropType == "before" || dropType == "after") {
        pId =
          dropNode.parent.data.partyId == undefined
            ? 0
            : dropNode.parent.data.partyId;
      } else {
        pId = dropNode.data.partyId;
      }
      draggingNode.data.parentId = pId;
      var { partyId, partyName, parentId } = draggingNode.data;
      this.$http({
        url: this.$http.adornUrl("/manage/party/update"),
        method: "post",
        data: this.$http.adornData({ partyId, partyName, parentId }, false),
      }).then(({ data }) => {
        if (data.code === 0) {
          this.$message({
            message: "信息修改成功",
            type: "success",
          });
          //恢复默认标记
          this.dialogVisible = false;
          this.showPartyId = true;
          //刷新出新的党组织信息
          this.getPartyList();
          //设置需要默认展开的菜单
          this.expandedKey = [draggingNode.data.partyId];
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    //批量删除数据
    batchDelete() {
      let partyIds = [];
      let checkedNodes = this.$refs.partyTree.getCheckedNodes();
      if (checkedNodes.length > 0) {
        for (let i = 0; i < checkedNodes.length; i++) {
          partyIds.push(checkedNodes[i].partyId);
        }
        this.$confirm(`是否批量删除党组织信息?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl("/manage/party/checkremove"),
            method: "post",
            data: this.$http.adornData(partyIds, false),
          }).then(({ data }) => {
            if (data.code === 0) {
              this.$http({
                url: this.$http.adornUrl("/manage/party/delete"),
                method: "delete",
                data: this.$http.adornData(partyIds, false),
              }).then(({ data }) => {
                if (data.code === 0) {
                  this.$message({
                    message: "信息删除成功",
                    type: "success",
                  });
                  //刷新出新的党组织信息
                  this.getPartyList();
                  //设置需要默认展开的菜单
                  this.expandedKey = [node.parent.data.partyId];
                } else {
                  this.$message.error(data.msg);
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        });
      } else {
        this.$message({
          message: "请先选择要删除的节点",
          type: "error",
        });
      }
    },

    //获取党支部树形数据和所有党支部列表数据
    getPartyList() {
      this.$http({
        url: this.$http.adornUrl("/manage/party/list/tree"),
        method: "get",
      }).then(({ data }) => {
        this.partyList = data.tree;
      });
    },

    //填写验证（党支部编号唯一性验证）
    checkId() {
      this.errorMsg1 = "";
      this.$http({
        url: this.$http.adornUrl("/manage/party/checkidandname"),
        method: "post",
        params: this.$http.adornParams({
          partyId: this.party.partyId,
        }),
      }).then(({ data }) => {
        if (data.code === 500) {
          this.errorMsg1 = data.msg;
        }
      });
    },

    //填写验证（党支部名称唯一性验证）
    checkName() {
      this.errorMsg2 = "";
      this.$http({
        url: this.$http.adornUrl("/manage/party/checkidandname"),
        method: "post",
        params: this.$http.adornParams({
          partyName: this.party.partyName,
        }),
      }).then(({ data }) => {
        if (data.code === 500) {
          this.errorMsg2 = data.msg;
        }
      });
    },

    //修改当前节点数据
    edit(data) {
      this.dialogType = "edit";
      this.title = "修改党组织信息";
      this.dialogVisible = true;
      //修改时，不显示党支部编号
      this.showPartyId = false;
      //发送请求获取当前节点最新的数据
      this.$http({
        url: this.$http.adornUrl(`/manage/party/info/${data.partyId}`),
        method: "get",
      }).then(({ data }) => {
        if (data.code === 0) {
          //请求成功
          this.party.partyId = data.data.partyId;
          this.party.partyName = data.data.partyName;
          this.party.parentId = data.data.parentId;
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    //追加当前节点子节点
    append(data) {
      this.dialogType = "add";
      this.title = "添加支部信息";
      this.dialogVisible = true;
      this.showPartyId = true;
      this.party.partyId = null;
      this.party.partyName = "";
      //新增时，不显示上级党支部编号，默认上级编号为当前节点编号
      this.party.parentId = data.partyId;
    },

    //新增或修改对话框提交
    submitData() {
      if (this.dialogType == "add") {
        this.addParty();
      }
      if (this.dialogType == "edit") {
        this.editParty();
      }
    },

    //修改
    editParty() {
      var { partyId, partyName, parentId } = this.party;
      this.$http({
        url: this.$http.adornUrl("/manage/party/update"),
        method: "post",
        data: this.$http.adornData({ partyId, partyName, parentId }, false),
      }).then(({ data }) => {
        if (data.code === 0) {
          this.$message({
            message: "信息修改成功",
            type: "success",
          });
          //恢复默认标记
          this.dialogVisible = false;
          this.showPartyId = true;
          //刷新出新的党组织信息
          this.getPartyList();
          //设置需要默认展开的菜单
          this.expandedKey = [this.party.partyId];
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    //追加
    addParty() {
      this.$http({
        url: this.$http.adornUrl("/manage/party/save"),
        method: "post",
        data: this.$http.adornData(this.party, false),
      }).then(({ data }) => {
        if (data.code === 0) {
          this.$message({
            message: "信息保存成功",
            type: "success",
          });
          //恢复默认标记
          this.dialogVisible = false;
          this.showPartyId = true;
          //刷新出新的党组织信息
          this.getPartyList();
          //设置需要默认展开的菜单
          this.expandedKey = [this.party.partyId];
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    //删除当前节点
    remove(node, data) {
      var ids = [data.partyId];
      this.$confirm(`是否删除【${data.partyName}】?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl("/manage/party/checkremove"),
          method: "post",
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          if (data.code === 0) {
            this.$http({
              url: this.$http.adornUrl("/manage/party/delete"),
              method: "delete",
              data: this.$http.adornData(ids, false),
            }).then(({ data }) => {
              if (data.code === 0) {
                this.$message({
                  message: "信息删除成功",
                  type: "success",
                });
                //刷新出新的党组织信息
                this.getPartyList();
                //设置需要默认展开的菜单
                this.expandedKey = [node.parent.data.partyId];
              } else {
                this.$message.error(data.msg);
              }
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
  },
};
</script>
