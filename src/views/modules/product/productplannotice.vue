<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button
          v-if="isAuth('product:productplannotice:save')"
          type="primary"
          @click="addOrUpdateHandle()"
        >新增</el-button>
        <el-button
          v-if="isAuth('product:productplannotice:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >批量删除</el-button>
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
        <el-table-column
        header-align="center"
        align="center"
        label="序号"
        type="index"
        width="70">
      </el-table-column>
      <el-table-column prop="deviceName" header-align="center" align="center" label="设备编号"></el-table-column>
      <el-table-column prop="productName" header-align="center" align="center" label="产品名称"></el-table-column>
      <el-table-column prop="groupNumber" header-align="center" align="center" label="生产组数"></el-table-column>
      <el-table-column prop="modelNo" header-align="center" align="center" label="模具编号"></el-table-column>
     <el-table-column prop="orderNumber" header-align="center" align="center" label="数量">
       <template slot-scope="scope">
         {{scope.row.orderNumber}}万
       </template>
     </el-table-column>
      <el-table-column prop="remark" header-align="center" align="center" label="备注"></el-table-column>
      <!-- <el-table-column prop="customerProductNo" header-align="center" align="center" label="客户编号"></el-table-column> -->
      <el-table-column prop="materialWeight" header-align="center" align="center" label="克数"></el-table-column>
      <el-table-column prop="volume" header-align="center" align="center" label="容量"></el-table-column>
      <el-table-column prop="orderNo" header-align="center" align="center" label="订单编号"></el-table-column>
      <el-table-column prop="isPriority" header-align="center" align="center" label="是否优先">
              <template slot-scope="scope">
                  <el-tag type="danger" v-if="scope.row.isPriority == '1' "> 优先</el-tag>
                  <el-tag type="success" v-if="scope.row.isPriority !='1'"> 正常</el-tag>
              </template>
          </el-table-column>
      <el-table-column prop="repertoryNumber" header-align="center" align="center" label="库存数量(万)"></el-table-column>
      <el-table-column prop="needNumber" header-align="center" align="center" label="实际需求数量(万)"></el-table-column>
      <el-table-column prop="customerProductSytle" header-align="center" align="center" label="客户样品">
           <template slot-scope="scope">
                  <el-tag  v-if="scope.row.customerProductSytle == '1'"> 有</el-tag>
                  <el-tag  v-if="scope.row.customerProductSytle =='0'"> 无</el-tag>
           </template>
      </el-table-column>
      <el-table-column prop="bottleCapSuit" header-align="center" align="center" label="瓶盖套装">
            <template slot-scope="scope">
                  <el-tag  v-if="scope.row.customerProductSytle == '1' "> 有</el-tag>
                  <el-tag  v-if="scope.row.customerProductSytle =='0'"> 无</el-tag>
            </template>
      </el-table-column>
      <el-table-column prop="followUpProcess" header-align="center" align="center" label="后续加工"></el-table-column>
      <el-table-column prop="packRequire" header-align="center" align="center" label="包装要求"></el-table-column>
      <el-table-column prop="boxId" header-align="center" align="center" label="纸箱编号"></el-table-column>
      <el-table-column prop="customerRequire" header-align="center" align="center" label="客户要求"></el-table-column>
      <el-table-column prop="bottleHight" header-align="center" align="center" label="瓶身总高度"></el-table-column>
      <el-table-column prop="bottleInDiameter" header-align="center" align="center" label="瓶口内径"></el-table-column>
      <el-table-column prop="headNeckHeight" header-align="center" align="center" label="头径高度"></el-table-column>
      <el-table-column prop="bottleOutDiameter" header-align="center" align="center" label="瓶口外径"></el-table-column>
      <el-table-column prop="facadeRequire" header-align="center" align="center" label="外观"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" width="100px" label="创建时间" sortable >
          <template slot-scope="scope">
                  {{scope.row.createTime|formateDate }}
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
import AddOrUpdate from "./productplannotice-add-or-update";
export default {
  data() {
    return {
      dataForm: {
        key: ""
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      dataListSelections: [],
      addOrUpdateVisible: false
    };
  },
  components: {
    AddOrUpdate
  },
  activated() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/product/productplannotice/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key
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
          url: this.$http.adornUrl("/product/productplannotice/delete"),
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
   filters:{
    formateDate(value){

      return value.substring(0,10);
    }
  }
};
</script>
