<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select
          v-model="dataForm.key"
          clearable
          default-first-option
          style="width:260px"
          filterable
          placeholder="输入名称"
        >
          <el-option
            v-for="item in boxAddLeaveList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>

        <!-- <el-input v-model="dataForm.key" placeholder="输入名称" style="width:260px" clearable></el-input> -->
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="range"
          type="daterange"
          value-format="yyyyMMdd"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="type">
        <el-select v-model="dataForm.type" clearable filterable placeholder="请选择">
          <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button
          v-if="isAuth('product:boxaddleave:save')"
          type="primary"
          @click="addOrUpdateHandle()"
        >新增</el-button>
        <el-button
          v-if="isAuth('product:boxaddleave:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >批量删除</el-button>
        <el-button type="success" @click="getExcel()">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="boxNoName" header-align="center" align="center" label="纸箱编号"></el-table-column>
      <el-table-column prop="bodyNumber" header-align="center" align="center" label="箱体数量"></el-table-column>
      <el-table-column prop="parryNumber" header-align="center" align="center" label="格挡数量"></el-table-column>
      <el-table-column prop="spacerNumber" header-align="center" align="center" label="垫片数量"></el-table-column>
      <el-table-column prop="boxOrderImage" header-align="center" align="center" label="订单留存">
        <template slot-scope="scope">
          <el-popover placement="right" title trigger="hover" v-if="scope.row.boxOrderImage">
            <img
              :src="imageUrl+scope.row.boxOrderImage+ '?token='+token"
              alt
              style="height:600px;width:600px"
            >
            <img
              slot="reference"
              :src="imageUrl+scope.row.boxOrderImage+ '?token='+token"
              alt
              style="height: 50px;width: 50px"
            >
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="addBoxNumber" header-align="center" align="center" label="成品入库数量">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.addBoxNumber">{{scope.row.addBoxNumber}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="addBoxTime" header-align="center" align="center" label="入库时间">
        <template slot-scope="scope">{{scope.row.addBoxTime|formateDate }}</template>
      </el-table-column>

      <el-table-column prop="outBoxNumber" header-align="center" align="center" label="成品出库数量">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.outBoxNumber">{{scope.row.outBoxNumber}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="outBoxTime" header-align="center" align="center" label="出库时间">
        <template slot-scope="scope">{{scope.row.outBoxTime|formateDate }}</template>
      </el-table-column>

      <el-table-column prop="type" header-align="center" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type==1" type="success">入库</el-tag>
          <el-tag v-if="scope.row.type==0" type="danger">出库</el-tag>
        </template>
      </el-table-column>

      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
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
    ></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./boxaddleave-add-or-update";
export default {
  data() {
    return {
      dataForm: {
        key: "",
        rangeBefore: "",
        rangeAfter: "",
        type: ""
      },
      typeList: [
        {
          id: "1",
          name: "入库"
        },
        {
          id: "0",
          name: "出库"
        }
      ],
      boxAddLeaveList: [],
      range: "",
      dataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      token: null,
      imageUrl: null
    };
  },
  components: {
    AddOrUpdate
  },
  activated() {
    this.getDataList();
  },
  methods: {
    getAllBoxAddLeave() {
      this.$http({
        url: this.$http.adornUrl(`/product/boxaddleave/getAllBoxAddLeave`),
        method: "get"
      }).then(({ data }) => {
        if (data && data.code == 0) {
          this.boxAddLeaveList = data.boxAddLeaveList;
          //  alert(data.productBoxList);
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 获取数据列表
    getDataList() {
      this.getAllBoxAddLeave();
      if (this.range instanceof Array) {
        this.dataForm.rangeBefore = this.range[0];
        this.dataForm.rangeAfter = this.range[1];
      } else {
        this.dataForm.rangeBefore = "";
        this.dataForm.rangeAfter = "";
      }
      // if(this.dataForm.type==''){
      //   if(this.dataForm.key!=''&&this.dataForm.rangeBefore!=''){
      //   this.$message.error("必须选择状态，入库或出库");
      //     return false;
      //   }
      // }
      this.dataListLoading = true;
      this.imageUrl = window.SITE_CONFIG.baseUrl + "/pub";
      this.token = this.$cookie.get("token");
      this.$http({
        url: this.$http.adornUrl("/product/boxaddleave/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          type: this.dataForm.type,
          rangeBefore: this.dataForm.rangeBefore,
          rangeAfter: this.dataForm.rangeAfter
        })
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
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    getExcel() {
      this.token = this.$cookie.get("token");

      window.location.href =
        window.SITE_CONFIG.baseUrl +
        "/product/boxaddleave/getExcel" +
        "?token=" +
        this.token;
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.id;
          });
      this.$confirm(
        `确定对[id=${ids.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl("/product/boxaddleave/delete"),
          method: "post",
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getDataList();
              }
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    }
  },
  filters: {
    formateDate(value) {
      if (value) {
        return value.substring(0, 10);
      } else {
        return "";
      }
    }
  }
};
</script>
