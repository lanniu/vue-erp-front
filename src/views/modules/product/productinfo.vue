<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="输入名称" style="width:260px" clearable></el-input>
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
        <el-button @click="getDataList()" style="width:90px">查询</el-button>
        <el-button
          v-if="isAuth('product:productinfo:save')"
          type="primary"
          @click="addOrUpdateHandle()"
        >新增</el-button>
        <el-button
          v-if="isAuth('product:productinfo:delete')"
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
      <el-table-column type="selection" header-align="center" align="center" width="30"></el-table-column>
        <el-table-column
        header-align="center"
        align="center"
        label="序号"
        type="index"
         width="70">
      </el-table-column>
      <!-- <el-table-column prop="productNo" header-align="center" align="center" label="瓶子序号"></el-table-column> -->
      <el-table-column prop="productName" header-align="center" align="center" label="产品名称"></el-table-column>
      <el-table-column prop="productImageId" header-align="center" align="center" label="产品图片">
      <template slot-scope="scope">
          <el-popover
            placement="right"
            title=""
            trigger="hover" v-if="scope.row.productImageUrl">
            <img :src="imageUrl+scope.row.productImageUrl+ '?token='+token" alt="" style="height:600px;width:600px" />
            <img slot="reference" :src="imageUrl+scope.row.productImageUrl+ '?token='+token" alt="" style="height: 50px;width: 50px">
          </el-popover> 
        </template>
      </el-table-column>
      <el-table-column prop="modelName" header-align="center" align="center" label="模具编号"></el-table-column>
      <el-table-column prop="customerProductNo" header-align="center" align="center" label="客户编号"></el-table-column>
      <!-- <el-table-column prop="cartonId" header-align="center" align="center" label="纸箱编号"></el-table-column> -->
      <el-table-column prop="productCategory" header-align="center" align="center" label="类别">
        <template slot-scope="scope">
                  <el-tag v-if="scope.row.productCategory==0">膏霜</el-tag>
                  <el-tag v-if="scope.row.productCategory==1">乳液</el-tag>
                  <el-tag v-if="scope.row.productCategory==2">香水</el-tag>
                  <el-tag v-if="scope.row.productCategory==3">香薰</el-tag>
                  <el-tag v-if="scope.row.productCategory==4">调味瓶</el-tag>
                  <el-tag v-if="scope.row.productCategory==5">其它</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="productNum" header-align="center" align="center" label="库存数量"></el-table-column>
      <el-table-column prop="productWeight" header-align="center" align="center" label="克数"></el-table-column>
      <el-table-column prop="productVolume" header-align="center" align="center" label="容量"></el-table-column>
      <el-table-column prop="productBatch" header-align="center" align="center" label="生产批次"></el-table-column>
      <el-table-column prop="productQuestion" header-align="center" align="center" label="产品问题"></el-table-column>
      <el-table-column prop="productAssort" header-align="center" align="center" label="配件套">
        <template slot-scope="scope">
          {{scope.row.productAssort==1?'有':'无'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="productTrailingProcess"
        header-align="center"
        align="center"
        label="后续加工"
      ></el-table-column>
      <el-table-column prop="productRemark" header-align="center" align="center" label="备注"></el-table-column>
      <el-table-column prop="yield" header-align="center" align="center" label="成品率"></el-table-column>
      
      <el-table-column prop="productDrawingId" header-align="center" align="center" label="产品图纸">
           <template slot-scope="scope">
             <div v-if="scope.row.productDrawingId">
                <a :href="imageUrl+scope.row.productDrawingUrl+'?token='+token" target="_bank" >查看图纸</a>
             </div>
              <div v-if="!scope.row.productDrawingId">
                  无图纸
             </div>
            </template>
      </el-table-column>
      
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
           <!-- <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">出库详情</el-button>
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">入库详情</el-button> -->
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
import AddOrUpdate from "./productinfo-add-or-update";
export default {
  data() {
    return {
      dataForm: {
        key: "",
        rangeBefore:'',
        rangeAfter:''        
      },
      range:"",
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      token:null,
      imageUrl:null
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
      this.imageUrl=window.SITE_CONFIG.baseUrl+'/pub';
      this.token=this.$cookie.get('token');
      this.dataListLoading = true;
      if(this.range instanceof Array){
        this.dataForm.rangeBefore=this.range[0];
        this.dataForm.rangeAfter=this.range[1];
      }
      else{
        this.dataForm.rangeBefore='';
        this.dataForm.rangeAfter='';
      }
      this.$http({
        url: this.$http.adornUrl("/product/productinfo/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          rangeBefore: this.dataForm.rangeBefore,
          rangeAfter: this.dataForm.rangeAfter,
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
          url: this.$http.adornUrl("/product/productinfo/delete"),
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
