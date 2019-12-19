<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
         <el-select v-model="dataForm.key"
          clearable 
        default-first-option
        style="width:260px" filterable placeholder="请选择">
          <el-option
            v-for="item in productBoxList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
       <el-form-item>
       <el-date-picker
          v-model="range"
          type="daterange"
          value-format="yyyyMMdd"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button
          v-if="isAuth('product:productbox:save')"
          type="primary"
          @click="addOrUpdateHandle()"
        >新增</el-button>
        <el-button
          v-if="isAuth('product:productbox:delete')"
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
      <el-table-column prop="id" header-align="center" align="center" label="ID"></el-table-column>
      <el-table-column prop="boxNo" header-align="center" align="center" label="纸箱编号"></el-table-column>
      <el-table-column prop="body" header-align="center" align="center" label="箱体尺寸"></el-table-column>
      <el-table-column prop="bodyNumber" header-align="center" align="center" label="箱体数量"></el-table-column>
      <el-table-column prop="parry" header-align="center" align="center" label="格挡尺寸"></el-table-column>
      <el-table-column prop="parryNumber" header-align="center" align="center" label="格挡数量"></el-table-column>
      <el-table-column prop="spacer" header-align="center" align="center" label="垫片尺寸"></el-table-column>
      <el-table-column prop="spacerNumber" header-align="center" align="center" label="垫片数量"></el-table-column>
      <el-table-column prop="zhiShu" header-align="center" align="center" label="每箱只数"></el-table-column>
      <el-table-column prop="boxNumber" header-align="center" align="center" label="库存箱数">
          <template slot-scope="scope">
            <el-tag  type='success' v-if="scope.row.boxNumber">{{scope.row.boxNumber}}</el-tag>
          </template>
      </el-table-column>
      <el-table-column prop="boxPrice" header-align="center" align="center" label="纸箱价格"></el-table-column>
      <el-table-column prop="costomer" header-align="center" align="center" label="客户"></el-table-column>
      <el-table-column prop="location" header-align="center" align="center" label="位置"></el-table-column>
      <el-table-column prop="leaveNumber" header-align="center" align="center" label=" 出库数量">
         <template slot-scope="scope">
            <el-tag  type='danger' v-if="scope.row.leaveNumber">{{scope.row.leaveNumber}}</el-tag>
          </template>
       </el-table-column>
       <el-table-column prop="remark" header-align="center" align="center" label="备注"></el-table-column>
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
import AddOrUpdate from "./productbox-add-or-update";
export default {
  data() {
    return {
      dataForm: {
        key: "",
        rangeBefore:'',
        rangeAfter:'',
      },
      range:'',
      productBoxList:[],
      dataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      dataListLoading: false,
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
     getAllProductBoxList(){
            this.$http({
            url:this.$http.adornUrl(`/product/productbox/getAllProductBoxList`),
            method: "get"
        }).then(({data})=>{
          if(data &&data.code==0){
            this.productBoxList=data.productBoxList;
          //  alert(data.productBoxList);
          }else {
              this.$message.error(data.msg);
          }
        })
      },
    // 获取数据列表
    getDataList() {
      this.getAllProductBoxList();
        if(this.range instanceof Array){
        this.dataForm.rangeBefore=this.range[0];
        this.dataForm.rangeAfter=this.range[1];
      }
      else{
        this.dataForm.rangeBefore='';
        this.dataForm.rangeAfter='';
      }
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/product/productbox/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
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
          url: this.$http.adornUrl("/product/productbox/delete"),
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
  }
};
</script>
