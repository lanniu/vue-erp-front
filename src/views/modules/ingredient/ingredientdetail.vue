<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
          <el-select
          style="width:260px"
            v-model="dataForm.key"
            clearable
            filterable
            default-first-option
            placeholder="原料名称">
            <el-option
              v-for="item in ingredientList"
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
        <el-button v-if="isAuth('product:ingredientdetail:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('product:ingredientdetail:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="序号"
        type="index"
         width="70">
      </el-table-column>
     
      <el-table-column
        prop="materialName"
        header-align="center"
        align="center"
        label="原料名称
">
      </el-table-column>
      <el-table-column
        prop="weight"
        header-align="center"
        align="center"
        label="吨数">
      </el-table-column>
        <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型">
        <!-- 0为入库，1为出库 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type==1" type='success'>入库</el-tag>
            <el-tag v-if='scope.row.type==0' type='danger'>出库</el-tag>
          </template>
      </el-table-column>
       <el-table-column
        prop="tickerNumber"
        header-align="center"
        align="center"
        label="票号">
      </el-table-column>

       <el-table-column
        prop="supplierName"
        header-align="center"
        align="center"
        label="供货商名称">
      </el-table-column>
      <el-table-column
        prop="price"
        header-align="center"
        align="center"
        label="价格">
      </el-table-column>
      <el-table-column
        prop="isPay"
        header-align="center"
        align="center"
        label="付款状态">
         <template slot-scope="scope">
            <el-tag v-if="scope.row.isPay=='1'" type='success'>已付款</el-tag>
            <el-tag v-if="scope.row.isPay=='0'" type='danger'>未付款</el-tag>
          </template>
      </el-table-column>
      <el-table-column
        prop="imageUrl"
        header-align="center"
        align="center"
        label="入库单留存">
          <template slot-scope="scope">
          <el-popover
            placement="left"
            title=""
            trigger="hover" v-if="scope.row.imageUrl">
            <img :src="imageUrl+scope.row.imageUrl+ '?token='+token" alt="" style="height:600px;width:600px" />
            <img slot="reference" :src="imageUrl+scope.row.imageUrl+ '?token='+token" alt="" style="height: 50px;width: 50px">
          </el-popover> 
        </template>
      </el-table-column>
     <el-table-column
        prop="detailTime"
        header-align="center"
        align="center"
        label="出入库时间">
          <template slot-scope="scope">
                  {{scope.row.detailTime|formateDate }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
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
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './ingredientdetail-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          key: '',
          rangeBefore:'',
          rangeAfter:'',
        },
        range:"",
        ingredientList:[],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        imageUrl:null,
        token:null
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {

       getAllIngredientList(){
            this.$http({
            url:this.$http.adornUrl(`/product/ingredient/getAllIngredientList`),
            method: "get"
        }).then(({data})=>{
          if(data &&data.code==0){
            this.ingredientList=data.ingredientList;
          }else {
              this.$message.error(data.msg);
          }
        })
      },

      // 获取数据列表
      getDataList () {
       if(this.range instanceof Array){
        this.dataForm.rangeBefore=this.range[0];
        this.dataForm.rangeAfter=this.range[1];
      }
      else{
        this.dataForm.rangeBefore='';
        this.dataForm.rangeAfter='';
      }
      this.dataListLoading = true
      this.getAllIngredientList();
      this.imageUrl=window.SITE_CONFIG.baseUrl+'/pub';
      this.token=this.$cookie.get('token');
        this.$http({
          url: this.$http.adornUrl('/product/ingredientdetail/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'rangeBefore': this.dataForm.rangeBefore,
            'rangeAfter': this.dataForm.rangeAfter,
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/product/ingredientdetail/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    },
   filters:{
    formateDate(value){

      if(value){
      return value.substring(0,10);
      }else{
        return "";
      }
    }
  }
  }
</script>
