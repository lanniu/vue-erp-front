<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model.trim="dataForm.key"  placeholder="克数" clearable></el-input>
      </el-form-item>
       <el-form-item>
            <el-select v-model="dataForm.productId" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in productList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        <!-- <el-input v-model.trim="dataForm.productId"  placeholder="产品名称" clearable></el-input> -->
      </el-form-item> 
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <!-- <el-button
          v-if="isAuth('product:productorderdetail:save')"
          type="primary"
          @click="addOrUpdateHandle()"
        >新增</el-button> -->
        <el-button
          v-if="isAuth('product:productorderdetail:delete')"
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
      <el-table-column  header-align="center" align="center" label="序号" type="index"  width="70">
   
      </el-table-column>
      <el-table-column prop="productName" header-align="center" align="center" label="产品名称">
         <template slot-scope="scope">
            {{scope.row.productName}}
            <el-badge value="new" class="item" v-if="scope.row.isRead==0"></el-badge>
        </template>
      </el-table-column>
      <el-table-column prop="modelNo" header-align="center" align="center" label="模具编号"  ></el-table-column>
      <el-table-column prop="productWeight" header-align="center" align="center" label="克数" sortable ></el-table-column>
      <el-table-column prop="productNumber" header-align="center" align="center" label="订单数量(万)"></el-table-column>
      <el-table-column prop="boxSupplyWay" header-align="center" align="center" label="纸箱供应方式">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.boxSupplyWay=='0'">客供</el-tag>
          <el-tag type="success" v-if="scope.row.boxSupplyWay=='1'">自供</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="factoryName" header-align="center" align="center" label="纸箱厂"></el-table-column>
      <el-table-column prop="needBoxNumber" header-align="center" align="center" label="纸箱订单量"></el-table-column>

      <el-table-column prop="entryBoxNumber" header-align="center" align="center" label="纸箱入库数量" ></el-table-column>

      <el-table-column prop="employeeName" header-align="center" align="center" label="跟单人员"></el-table-column>
       <el-table-column
        prop="orderStatus"
        header-align="center"
        align="center"
        label="订单状态"
      >
       <template slot-scope="scope">
        
         <el-tag  v-if="scope.row.orderStatus=='1'">正常订单</el-tag>
         <el-tag type="warning"  v-if="scope.row.orderStatus=='0'">订单加急</el-tag>
         <el-tag type="info" v-if="scope.row.orderStatus=='2'">订单挂起</el-tag>
         <el-tag type="danger" v-if="scope.row.orderStatus=='3'">取消订单</el-tag>
         <el-tag type="success" v-if="scope.row.orderStatus=='4'">订单完成</el-tag>
       </template>
      </el-table-column>
      <el-table-column prop="remark" header-align="center" align="center" label="备注"></el-table-column>
      <el-table-column prop="status" header-align="center" align="center" label="生产状态 ">
        <!-- 0为等待生产，1为取消生产，2为生产中，3为生产完成 -->
         <template slot-scope="scope">
          <el-button round size="small" v-if="scope.row.status=='0'" @click="changeStatus(scope.row.id)">待生产</el-button>
          <el-button round size="small"  type="warning" v-if="scope.row.status=='1'"  @click="changeStatus(scope.row.id)">生产中</el-button>
          <el-button round size="small"  type="success" v-if="scope.row.status=='2'" >生产完成</el-button>
          <el-button round size="small"  type="danger" v-if="scope.row.status=='3'"  @click="changeStatus(scope.row.id)" >取消生产</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isRead==0" type="text" size="small" @click="remarkOrderMsgIsRead(scope.row.id)">已读</el-button>
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>

           <el-button type="success" size="small"  v-if="scope.row.status=='0'||scope.row.planId==''"
           @click="addPlanOrUpdateHandle(scope.row.id,scope.row.productId,scope.row.productWeight,scope.row.productNumber,scope.row.planId,scope.row.remark,scope.row.modelId)">
            制定生产
           </el-button>
           <el-button type="info" size="small"  v-if="scope.row.planId"
           @click="addPlanOrUpdateHandle(scope.row.id,scope.row.productId,scope.row.productWeight,scope.row.productNumber,scope.row.planId,scope.row.remark,scope.row.modelId)">
            查看生产
           </el-button>
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
    <add-plan-or-update v-if="addOrUpdateVisible" ref="addPlanOrUpdate" @refreshDataList="getDataList"></add-plan-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./productorderdetail-add-or-update";
import AddPlanOrUpdate from "../product/productplannotice-add-or-update";
export default {
  data() {
    return {
      dataForm: {
        key: "",
        productId:"",
      },
      productList:[],
      dataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      token:null,
      imageUrl:null,
    };
  },
  computed: {
       updateOrderMsgCountNumber: {
        get () { return this.$store.state.user.orderMsgCountNumber },
        set (val) { this.$store.commit('user/updateOrderMsgCountNumber', val) }
      },
  },
  components: {
    AddOrUpdate,
    AddPlanOrUpdate
  },
  activated() {
    this.getDataList();
  },
  methods: {
    getProductList(){
      this.$http({
          url:this.$http.adornUrl(`/product/productinfo/getAllProductVoList`),
          method: "get"
      }).then(({data})=>{
        if(data &&data.code==0){
          this.productList=data.productList;
        }else {
              this.$message.error(data.msg);
         }
      })
    },

    changeStatus(orderDetailId){
         this.$prompt(`输入修改状态只能为：<p style="color:rgba(0, 206, 209, 1);" >0 为待生产</p><p style="color:rgba(250, 212, 0, 1)">1 为生产中</p><p style="color:green">2 为生产完成</p><p style="color:red">3 为取消生产</p>`, '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[0123]{1}$/,
          inputErrorMessage: '输入的状态不正确'
        }).then(({ value }) => {
       
            
          this.$http({
            url:this.$http.adornUrl(`/product/productorderdetail/updateOrderDetailStatus`),
            method:'post',
            data:
            this.$http.adornData({
              id:orderDetailId,
              status:value,
            })
          }).then(({data})=>{
                if (data && data.code === 0) {

                  this.getDataList();
            }


          })

          //  this.$message({
          //   type: 'success',
          //   message: '你输入的状态是: ' + value

          // });
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '取消输入'
          // });       
        });
    },

    remarkOrderMsgIsRead(orderDetailId){
       this.$http({
            url:this.$http.adornUrl(`/product/orderusermessage/save`),
            method:'post',
            data:
            this.$http.adornData({
              orderMsgId:orderDetailId,
              isRead:'1'
            })
          }).then(({data})=>{
                if (data && data.code === 0) {
                  this.getDataList();
                  this.getOrderMsgUserNumber();
            }


          })

    },

    getOrderMsgUserNumber(){
    
          this.$http({
                  url: this.$http.adornUrl('/product/orderusermessage/getUserMessageCount'),
                  method: 'get',
                  params: this.$http.adornParams()
                }).then(({data}) => {
                  if (data && data.code === 0) {
                    this.updateOrderMsgCountNumber = data.orderMsgCountNumber
                  }
          })
        
      },
    // 获取数据列表
    getDataList() {

      let reg =/^[0-9]*$/;
      if(this.dataForm.key!=''){
        if(!reg.test(this.dataForm.key)){  
          alert("你输入的有误,只能输入数字");
       return false;
      } 
    }
      this.getProductList();
      this.dataListLoading = true;
   
      this.$http({
        url: this.$http.adornUrl("/product/productorderdetail/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          productId: this.dataForm.productId
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
     //scope.row.id,scope.row.productId,scope.row.productWeight,scope.row.productNumber
     // 新增 生产计划 / 修改
    addPlanOrUpdateHandle(orderId,productId,productWeight,productNumber,planId,remark,modelId) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addPlanOrUpdate.addInit(orderId,productId,productWeight,productNumber,planId,remark,modelId);
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
          url: this.$http.adornUrl("/product/productorderdetail/delete"),
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
