<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
          <el-select 
              style="width:260px"
                v-model="dataForm.key"
                filterable
                clearable
                default-first-option
                placeholder="模具编号">
                <el-option
                  v-for="item in modelList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
          </el-select>
        <!-- <el-input v-model="dataForm.key" placeholder="名称" clearable></el-input> -->
      </el-form-item>
     
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button
          v-if="isAuth('product:productmodelout:save')"
          type="primary"
          @click="addOrUpdateHandle()"
        >新增</el-button>
        <el-button
          v-if="isAuth('product:productmodelout:delete')"
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
      <el-table-column prop="id" header-align="center" align="center" label="序号" type="index" width="70"></el-table-column>
      <el-table-column prop="depotId" header-align="center" align="center" label="仓库号"  width="120">
       <template slot-scope="scope">
              <el-tag v-if="scope.row.depotId=='1'">新第一仓库</el-tag>
              <el-tag v-if="scope.row.depotId=='2'">第二仓库</el-tag>
              <el-tag v-if="scope.row.depotId=='3'">第三仓库</el-tag>
              <el-tag v-if="scope.row.depotId=='4'">老第一仓库</el-tag>
          </template> 
      </el-table-column>
      <el-table-column prop="siteNo" header-align="center" align="center" label="架号"></el-table-column>
      <el-table-column prop="modelName" header-align="center" align="center" label="模具编号">
         <template slot-scope="scope">
            {{scope.row.modelName}}
            <el-badge value="new" class="item" v-if="scope.row.isRead==0"></el-badge>
        </template>

      </el-table-column>

      <el-table-column prop="customerModelNo" header-align="center" align="center" label="客户编号"></el-table-column>
         <el-table-column prop="modelType" header-align="center" align="center" label="类型" width="120">
        <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.modelType=='0'">模具拉出</el-tag>
              <el-tag  type='success' v-if="scope.row.modelType=='1'">入库登记</el-tag>
              <el-tag v-if="scope.row.modelType=='2'">新品打样</el-tag>
              <el-tag v-if="scope.row.modelType=='3'">返厂维修</el-tag>
              <el-tag v-if="scope.row.modelType=='4'">外来加工</el-tag>
        </template>

      </el-table-column>
      <el-table-column prop="productName" header-align="center" align="center" label="产品名称"></el-table-column>
      <el-table-column prop="modelSuccessMo" header-align="center" align="center" label="成模"></el-table-column>
      <el-table-column prop="modelPrimaryMo" header-align="center" align="center" label="初模"></el-table-column>
      <el-table-column prop="modelMenTou" header-align="center" align="center" label="闷头"></el-table-column>
      <el-table-column prop="modelFunnel" header-align="center" align="center" label="漏斗"></el-table-column>
      <el-table-column prop="modelMouthMo" header-align="center" align="center" label="口模"></el-table-column>
      <el-table-column prop="modelCore" header-align="center" align="center" label="芯子"></el-table-column>
      <el-table-column prop="modelAirTou" header-align="center" align="center" label="气头"></el-table-column>
      <el-table-column prop="modelClamp" header-align="center" align="center" label="钳片"></el-table-column>
      <el-table-column prop="modelCooling" header-align="center" align="center" label="冷却"></el-table-column>
      <el-table-column prop="bottleWeight" header-align="center" align="center" label="瓶重"></el-table-column>
      <el-table-column
        prop="modelHandlingPeople"
        header-align="center"
        align="center"
        label="模具经手人"
      ></el-table-column>
      <el-table-column prop="customerName" header-align="center" align="center" label="提货人名称"></el-table-column>
      <el-table-column prop="factory" header-align="center" align="center" label="厂商"></el-table-column>
      
      <el-table-column prop="modelRemark" header-align="center" align="center" label="备注"></el-table-column>
      <el-table-column prop="modelDeliveryTime" header-align="center" align="center" label="发货日期"></el-table-column>
      <el-table-column prop="modelReceiptTime" header-align="center" align="center" label="收货日期"></el-table-column>
   
      <el-table-column prop="reasonReturn" header-align="center" align="center" label="退货原因"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
         <el-button v-if="scope.row.isRead==0" type="text" size="small" @click="remarkModelMsgIsRead(scope.row.id)">已读</el-button>
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
import AddOrUpdate from "./productmodelout-add-or-update";
export default {
  data() {
    return {
      dataForm: {
        key: ""
      },
      dataList: [],
      modelList:[],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    };
  },
    computed: {
          updateModelMsgCountNumber: {
        get () { return this.$store.state.user.modelMsgCountNumber },
        set (val) { this.$store.commit('user/updateModelMsgCountNumber', val) }
      }
  },
  components: {
    AddOrUpdate
  },
  activated() {
    this.getDataList();
  },
  methods: {
     getModelListInfo(){
      this.$http({
          url:this.$http.adornUrl(`/product/productmodel/getModelVoList`),
          method: "get"
      }).then(({data})=>{
        if(data &&data.code==0){
          this.modelList=data.modelVoList;
        }else {
              this.$message.error(data.msg);
         }
      })
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.getModelListInfo();
      this.$http({
        url: this.$http.adornUrl("/product/productmodelout/list"),
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
          url: this.$http.adornUrl("/product/productmodelout/delete"),
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
    },
    remarkModelMsgIsRead(modelMsgId){
       this.$http({
            url:this.$http.adornUrl(`/product/modelusermessage/save`),
            method:'post',
            data:
            this.$http.adornData({
              modelMsgId:modelMsgId,
              isRead:'1'
            })
          }).then(({data})=>{
                if (data && data.code === 0) {
                  this.getDataList();
                  this.getModelMsgUserNumber();
            }


          })
    },
      getModelMsgUserNumber(){
       
          this.$http({
                  url: this.$http.adornUrl('/product/modelusermessage/getModelMsgUserNumber'),
                  method: 'get',
                  params: this.$http.adornParams()
                }).then(({data}) => {
                  if (data && data.code === 0) {
                    this.updateModelMsgCountNumber = data.msgCountNumber
                  }
                })
        
        
      },
  }
};
</script>
