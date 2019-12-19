<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="130px"
    >

   
      <el-form-item  label="类别" prop="modelType">
         <template v-if="dataForm.id==''||dataForm.id==0" >
          <el-radio-group v-model="dataForm.modelType">
            <el-radio v-model="dataForm.modelType" :label="1">入库登记</el-radio>
            <el-radio v-model="dataForm.modelType" :label="0">模具拉出</el-radio>
            <el-radio v-model="dataForm.modelType" :label="2">新品打样</el-radio>
            <el-radio v-model="dataForm.modelType" :label="3">返厂维修</el-radio>
            <el-radio v-model="dataForm.modelType" :label="4">外来加工</el-radio>
          </el-radio-group>
          </template>

           <template v-if="dataForm.id!=''" >
          <el-radio-group v-model="dataForm.modelType">
            <el-radio  v-if="dataForm.modelType==1" :label="1">入库登记</el-radio>
            <el-radio  v-if="dataForm.modelType==0" :label="0">模具拉出</el-radio>
            <el-radio  v-if="dataForm.modelType==2" :label="2">新品打样</el-radio>
            <el-radio  v-if="dataForm.modelType==3" :label="3">返厂维修</el-radio>
            <el-radio  v-if="dataForm.modelType==4" :label="4">外来加工</el-radio>
          </el-radio-group>
          </template>
      </el-form-item>
    
      <template v-if="dataForm.modelType=='1'">
            <el-form-item label="模具编号" prop="modelName">
              <template>
              <el-select v-if="dataForm.id==''||dataForm.id==0"
              style="width:260px"
                v-model="dataForm.modelName"
                 @change=getModelInfoBymodelNo()
                filterable
                allow-create
                default-first-option
                placeholder="模具编号">
                <el-option
                  v-for="item in modelList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
              <el-input v-if="dataForm.id!=''" v-model="dataForm.modelName" disabled placeholder="模具编号" style="width:260px"></el-input>

            </template>
          </el-form-item>
      <el-form-item label="客户模具编号" prop="customerModelNo">
        <el-input v-model="dataForm.customerModelNo" placeholder="客户模具编号" style="width:260px"></el-input>
      </el-form-item> 
        <el-form-item label="仓库号" prop="depotId">
          <el-radio-group v-model="dataForm.depotId" >
            <el-radio :label="1">新第一仓库</el-radio>
            <el-radio :label="2">第二仓库</el-radio>
            <el-radio :label="3">第三仓库</el-radio>
            <el-radio :label="4">老第一仓库</el-radio>
          </el-radio-group>     
        </el-form-item>
        <el-form-item  v-if="dataForm.modelType=='1'" label="架号" prop="modelShelfId">
          
           <el-select v-if="!modelShelfNoFlag" v-model="dataForm.modelShelfId" filterable clearable placeholder="请选择"  style="width:260px">
            <el-option
              v-for="item in modelShelfIsEmptyList"
              :key="item.id"
              :label="item.shelfNo"
              :value="item.id"
            ></el-option>
          </el-select>
        <el-input v-if="modelShelfNoFlag" disabled  v-model="modelShelfNo" placeholder="架号" style="width:260px"></el-input>
       </el-form-item>
      </template>
      
        <template v-if="dataForm.modelType=='0'">
            <el-form-item label="模具编号" prop="modelNo">
            <!-- <el-input v-model="dataForm.modelNo" placeholder="模具编号" style="width:260px"></el-input> -->
              <template>
              <el-select 
              style="width:260px"
                v-model="dataForm.modelNo"
                filterable
                @change=getModelInfo()
                default-first-option
                placeholder="模具编号">
                <el-option
                  v-for="item in modelList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
      <el-form-item label="客户模具编号" prop="customerModelNo">
        <el-input v-model="dataForm.customerModelNo" disabled placeholder="客户模具编号" style="width:260px"></el-input>
      </el-form-item> 
        <el-form-item label="仓库号" prop="depotId" >
          <el-radio-group v-model="dataForm.depotId" disabled >
            <el-radio :label="1">新第一仓库</el-radio>
            <el-radio :label="2">第二仓库</el-radio>
            <el-radio :label="3">第三仓库</el-radio>
            <el-radio :label="4">老第一仓库</el-radio>
          </el-radio-group>     
        </el-form-item>
        <el-form-item  v-if="dataForm.modelType=='0'" label="架号" prop="modelShelfId">
            <el-select  v-if="!modelShelfNoFlag" v-model="dataForm.modelShelfId" filterable disabled placeholder="请选择"  style="width:260px">
            <el-option
              v-for="item in modelShelfIsEmptyList"
              :key="item.id"
              :label="item.shelfNo"
              :value="item.id"
            ></el-option>
          </el-select> 
 
          <el-input v-if="modelShelfNoFlag" disabled v-model="modelShelfNo" placeholder="架号" style="width:260px"></el-input>
          
       </el-form-item>
      </template>


        <el-form-item label="产品名称" prop="productId">
          <template v-if="dataForm.modelType!='0'">
         <el-select v-model="dataForm.productId" filterable clearable placeholder="请选择"  style="width:260px">
            <el-option
              v-for="item in productList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          </template>
          <template v-if="dataForm.modelType=='0'">
          <el-select v-model="dataForm.productId" filterable disabled placeholder="请选择"  style="width:260px">
            <el-option
              v-for="item in productList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          </template>
      </el-form-item>

      <el-form-item label="成模" prop="modelSuccessMo">
        <el-input v-model="dataForm.modelSuccessMo" placeholder="成模" style="width:260px">
                   <template slot="append">件</template>
        </el-input>
       <template v-if="dataForm.modelType==0&&dataForm.modelNo">
        剩余数量： <el-tag >{{modelNum.modelSuccessMo}} 件</el-tag>
      </template>
      </el-form-item>
      <el-form-item label="初模" prop="modelPrimaryMo">
        <el-input v-model="dataForm.modelPrimaryMo" placeholder="初模" style="width:260px">
                   <template slot="append">件</template>
        </el-input>
          <template v-if="dataForm.modelType=='0'&&dataForm.modelNo">
          剩余数量： <el-tag >{{modelNum.modelPrimaryMo}} 件</el-tag>
        </template>
      </el-form-item>
     
      <el-form-item label="闷头" prop="modelMenTou">
        <el-input v-model="dataForm.modelMenTou" placeholder="闷头" style="width:260px">
                   <template slot="append">件</template>
        </el-input>
         <template v-if="dataForm.modelType==0&&dataForm.modelNo">
            剩余数量： <el-tag >{{modelNum.modelMenTou}} 件</el-tag>
           </template>
      </el-form-item>
      <el-form-item label="漏斗" prop="modelFunnel">
        <el-input v-model="dataForm.modelFunnel" placeholder="漏斗" style="width:260px">
                   <template slot="append">件</template>
        </el-input>
         <template v-if="dataForm.modelType==0&&dataForm.modelNo">
            剩余数量： <el-tag >{{modelNum.modelFunnel}} 件</el-tag>
           </template>
      </el-form-item>
       <el-form-item label="口模" prop="modelMouthMo">
        <el-input v-model="dataForm.modelMouthMo" placeholder="口模" style="width:260px">
                   <template slot="append">件</template>
        </el-input>
          <template v-if="dataForm.modelType==0&&dataForm.modelNo">
            剩余数量： <el-tag >{{modelNum.modelMouthMo}} 件</el-tag>
           </template>
      </el-form-item>
      <el-form-item label="芯子" prop="modelCore">
        <el-input v-model="dataForm.modelCore" placeholder="芯子" style="width:260px">
                   <template slot="append">件</template>
        </el-input>
         <template v-if="dataForm.modelType==0&&dataForm.modelNo">
            剩余数量： <el-tag >{{modelNum.modelCore}} 件</el-tag>
           </template>
      </el-form-item>
      <el-form-item label="气头" prop="modelAirTou">
        <el-input v-model="dataForm.modelAirTou" placeholder="气头" style="width:260px">
                   <template slot="append">件</template>
        </el-input>
         <template v-if="dataForm.modelType==0&&dataForm.modelNo">
            剩余数量： <el-tag >{{modelNum.modelAirTou}} 件</el-tag>
           </template>
      </el-form-item>
        <el-form-item label="钳片" prop="modelClamp">
        <el-input v-model="dataForm.modelClamp" placeholder="钳片" style="width:260px">
                   <template slot="append">件</template>
        </el-input>
         <template v-if="dataForm.modelType==0&&dataForm.modelNo">
            剩余数量： <el-tag >{{modelNum.modelClamp}} 件</el-tag>
           </template>  
      </el-form-item>
      <el-form-item label="冷却" prop="modelCooling">
        <el-input v-model="dataForm.modelCooling" placeholder="冷却" style="width:260px">
                   <template slot="append">件</template>
        </el-input>
         <template v-if="dataForm.modelType==0&&dataForm.modelNo">
            剩余数量： <el-tag >{{modelNum.modelCooling}} 件</el-tag>
           </template>
      </el-form-item>
    

       <el-form-item label="瓶重" prop="bottleWeight">
        <el-input v-model="dataForm.bottleWeight" placeholder="瓶重"  style="width:260px">
            <template slot="append">克</template>
        </el-input>
      </el-form-item>
  
      <el-form-item label="模具经手人" prop="modelHandlingPeople">
        <el-input v-model="dataForm.modelHandlingPeople" placeholder="模具经手人" style="width:260px"></el-input>
      </el-form-item>
       <el-form-item  v-if="dataForm.modelType=='0'" label="审批人" prop="applyName">
        <el-input v-model="dataForm.applyName" placeholder="模具审批人" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="提货人名称" prop="customerName">
        <el-input v-model="dataForm.customerName" placeholder="提货人名称" style="width:260px"></el-input>
      </el-form-item>

       <el-form-item label="厂商" prop="factory">
        <el-input v-model="dataForm.factory" placeholder="厂商" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="modelRemark">
        <el-input v-model="dataForm.modelRemark" placeholder="备注" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="发货日期" prop="modelDeliveryTime" v-if="dataForm.modelType=='1'||dataForm.modelType=='3'">
        <el-date-picker
          v-model="dataForm.modelDeliveryTime"
          type="date"
          style="width:260px"
           value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="发货日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="收货日期" prop="modelReceiptTime" v-if="dataForm.modelType=='3'">
          <el-date-picker
          v-model="dataForm.modelReceiptTime"
          type="date"
          style="width:260px"
           value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="收货日期"
        ></el-date-picker>
      </el-form-item>
   
      <el-form-item label="退货原因"  v-if="dataForm.modelType=='3'" prop="reasonReturn">
        <el-input v-model="dataForm.reasonReturn" placeholder="退货原因"  style="width:260px"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<style>
  .el-select-dropdown__list{
   
    max-height: 150px;
   
  } 
</style>

<script>
export default {
  data() {
    return {
      visible: false,
      modelShelfIsEmptyList:[],
      productList:[],
      modelShelfNoFlag:false,
      modelShelfNo:'',
      dataForm: {
        id: 0,
        modelNo: "",
        modelName: "",
        depotId: "1",
        siteNo:'',
        customerModelNo:'',
        productName: "",
        modelSuccessMo: 0,
        modelPrimaryMo: 0,
        modelMouthMo: 0,
        modelMenTou: 0,
        modelFunnel: 0,
        modelCore: 0,
        modelAirTou: 0,
        modelCooling: 0,
        modelClamp: 0,
        modelHandlingPeople: "黄小虎",
        customerName: "",
        modelRemark: "",
        modelDeliveryTime: "",
        modelReceiptTime: "",
        status: "",
        modelType: 1,
        applyName:'',
        bottleWeight: '',
        reasonReturn: '',
        factory:'',
        modelShelfId:'',
        productId:''

      },
      modelNum:{
        modelSuccessMo: 0,
        modelPrimaryMo: 0,
        modelMouthMo: 0,
        modelMenTou: 0,
        modelFunnel: 0,
        modelCore: 0,
        modelAirTou: 0,
        modelCooling: 0,
        modelClamp: 0,
      },
      modelList:[],
      dataRule: {
       
        modelSuccessMo: [
          { required: true, message: "成模不能为空", trigger: "blur" }
        ],
        modelPrimaryMo: [
          { required: true, message: "初模不能为空", trigger: "blur" }
        ],
        modelMouthMo: [
          { required: true, message: "口模不能为空", trigger: "blur" }
        ],
        modelMenTou: [
          { required: true, message: "闷头不能为空", trigger: "blur" }
        ],
        modelFunnel: [
          { required: true, message: "漏斗不能为空", trigger: "blur" }
        ],
        modelCore: [
          { required: true, message: "芯子不能为空", trigger: "blur" }
        ],
        modelAirTou: [
          { required: true, message: "气头不能为空", trigger: "blur" }
        ],
        modelCooling: [
          { required: true, message: "冷却不能为空", trigger: "blur" }
        ],
        modelClamp: [
          { required: true, message: "钳片不能为空", trigger: "blur" }
        ],
        modelHandlingPeople: [
          { required: true, message: "模具经手人不能为空", trigger: "blur" }
        ],
        // customerName: [
        //   { required: true, message: "提货人名称不能为空", trigger: "blur" }
        // ],
      }
    };
  },

  methods: {

      getIsEmptyList(){
          if(this.dataForm.depotId==''||this.dataForm.depotId==null){
            return false;
          }
          this.$http({
          url:this.$http.adornUrl(`/product/modelshelf/getIsEmptyList/`+this.dataForm.depotId),
          method: "get"
      }).then(({data})=>{
        if(data &&data.code==0){
          this.modelShelfIsEmptyList=data.modelShelfIsEmptyList;
        }else {
            this.$message.error(data.msg);
         }
      })
  
    },

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
   getModelInfoBymodelNo(){
         if(this.dataForm.modelName==''){
            return false;
          }
          if(this.dataForm.modelName==null){
            return false;
          }
         this.modelShelfNoFlag=false;
         this.modelShelfNo='';
          this.$http({
              url:this.$http.adornUrl(`/product/productmodel/infoByModelNo/`+this.dataForm.modelName),
              method: "get",
            
          }).then(({data})=>{
            if(data &&data.code==0){
              this.dataForm.customerModelNo=data.productModel.customerModelNo;
             // this.dataForm.modelName=data.productModel.modelNo;
              this.dataForm.depotId=data.productModel.depotId;
              this.dataForm.modelShelfId=data.productModel.modelShelfId;
              this.dataForm.productId=data.productModel.productId;

             if(data.productModel.modelShelfId&&data.productModel.modelShelfId!=null){
                this.modelShelfNoFlag=true;
                this.modelShelfNo=data.productModel.shelfNo;

              }
             
            }else {
                  this.$message.error(data.msg);
            }
          })
   },

    getModelInfo(){
      if(this.dataForm.modelNo==''){
        return false;
      }
       this.modelNum={
            modelSuccessMo: 0,
            modelPrimaryMo: 0,
            modelMouthMo: 0,
            modelMenTou: 0,
            modelFunnel: 0,
            modelCore: 0,
            modelAirTou: 0,
            modelCooling: 0,
            modelClamp: 0,
          },
         this.modelShelfNoFlag=false;
         this.modelShelfNo='';
       this.$http({
          url:this.$http.adornUrl(`/product/productmodel/info/`+this.dataForm.modelNo),
          method: "get"
      }).then(({data})=>{
        if(data &&data.code==0){
          this.dataForm.customerModelNo=data.productModel.customerModelNo;
          this.dataForm.modelName=data.productModel.modelNo;

          this.dataForm.depotId=data.productModel.depotId;
          this.dataForm.productId=data.productModel.productId;
          this.dataForm.modelShelfId=data.productModel.modelShelfId;

          this.modelNum.modelSuccessMo=data.productModel.modelSuccessMo;
          this.modelNum.modelPrimaryMo=data.productModel.modelPrimaryMo;
          this.modelNum.modelMouthMo=data.productModel.modelMouthMo;
          this.modelNum.modelMenTou=data.productModel.modelMenTou;
          this.modelNum.modelFunnel=data.productModel.modelFunnel;
          this.modelNum.modelCore=data.productModel.modelCore;
          this.modelNum.modelAirTou=data.productModel.modelAirTou;
          this.modelNum.modelCooling=data.productModel.modelCooling;
          this.modelNum.modelClamp=data.productModel.modelClamp;

        if(data.productModel.modelShelfId&&data.productModel.modelShelfId!=null){
          this.modelShelfNoFlag=true;
          this.modelShelfNo=data.productModel.shelfNo;
        }

        }else {
              this.$message.error(data.msg);
         }
      })
      console.log(this.dataForm.modelNo);
    },


    clearndataForm(){
        this.dataForm.modelNo='';
        this.dataForm.modelName='';
        this.dataForm.depotId=1;
        this.dataForm.customerModelNo='';
        this.dataForm.productName='';
        this.dataForm.modelSuccessMo=0;
        this.dataForm.modelPrimaryMo=0;
        this.dataForm.modelMenTou=0;
        this.dataForm.modelMouthMo=0;
        this.dataForm.modelFunnel=0;
        this.dataForm.modelCore=0;
        this.dataForm.modelAirTou=0;
        this.dataForm.modelCooling=0;
        this.dataForm.modelClamp=0;
        this.dataForm.modelHandlingPeople='黄小虎';
        this.dataForm.customerName='';
        this.dataForm.factory='';
        this.dataForm.applyName='';
        this.dataForm.modelShelfId='';
        this.dataForm.productId='';
        this.dataForm.modelType=1;

        this.modelShelfNoFlag=false;
        this.modelShelfNo='';
    
    },
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

    init(id) {
      this.dataForm.modelRemark="";
      this.dataForm.id = id || 0;
      this.clearndataForm();
      this.getIsEmptyList();
      this.getModelListInfo();
      this.getProductList();
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/product/productmodelout/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.modelNo = data.productModelOut.modelNo;
              this.dataForm.modelName = data.productModelOut.modelName;
              this.dataForm.customerModelNo = data.productModelOut.customerModelNo;
              this.dataForm.productName = data.productModelOut.productName;
              this.dataForm.modelSuccessMo = data.productModelOut.modelSuccessMo;
              this.dataForm.modelPrimaryMo = data.productModelOut.modelPrimaryMo;
              this.dataForm.modelMouthMo = data.productModelOut.modelMouthMo;
              this.dataForm.modelMenTou = data.productModelOut.modelMenTou;
              this.dataForm.modelFunnel = data.productModelOut.modelFunnel;
              this.dataForm.modelCore = data.productModelOut.modelCore;
              this.dataForm.modelAirTou = data.productModelOut.modelAirTou;
              this.dataForm.modelCooling = data.productModelOut.modelCooling;
              this.dataForm.modelClamp = data.productModelOut.modelClamp;
              this.dataForm.modelHandlingPeople =data.productModelOut.modelHandlingPeople;
              this.dataForm.customerName = data.productModelOut.customerName;
              this.dataForm.modelRemark = data.productModelOut.modelRemark;
              this.dataForm.modelDeliveryTime = data.productModelOut.modelDeliveryTime;
              this.dataForm.modelReceiptTime = data.productModelOut.modelReceiptTime;
               this.dataForm.status = data.productModelOut.status;
              this.dataForm.modelType = data.productModelOut.modelType;
              this.dataForm.bottleWeight = data.productModelOut.bottleWeight;
              this.dataForm.reasonReturn = data.productModelOut.reasonReturn;
              this.dataForm.factory = data.productModelOut.factory;
              this.dataForm.depotId = data.productModelOut.depotId;
              this.dataForm.siteNo = data.productModelOut.siteNo;
              this.dataForm.applyName = data.productModelOut.applyName;
              this.dataForm.modelShelfId = data.productModelOut.modelShelfId;
              this.dataForm.productId = data.productModelOut.productId;
            }
          });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/product/productmodelout/${
                !this.dataForm.id ? "save" : "update"
              }`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              modelNo: this.dataForm.modelNo,
              modelName: this.dataForm.modelName,
              customerModelNo: this.dataForm.customerModelNo,
              productName: this.dataForm.productName,
              modelSuccessMo: this.dataForm.modelSuccessMo,
              modelPrimaryMo: this.dataForm.modelPrimaryMo,
              modelMouthMo: this.dataForm.modelMouthMo,
              modelMenTou: this.dataForm.modelMenTou,
              modelFunnel: this.dataForm.modelFunnel,
              modelCore: this.dataForm.modelCore,
              modelAirTou: this.dataForm.modelAirTou,
              modelCooling: this.dataForm.modelCooling,
              modelClamp: this.dataForm.modelClamp,
              modelHandlingPeople: this.dataForm.modelHandlingPeople,
              customerName: this.dataForm.customerName,
              modelRemark: this.dataForm.modelRemark,
              modelDeliveryTime: this.dataForm.modelDeliveryTime,
              modelReceiptTime: this.dataForm.modelReceiptTime,
              createTime: this.dataForm.createTime,
              createUser: this.dataForm.createUser,
              updateTime: this.dataForm.updateTime,
              updateUser: this.dataForm.updateUser,
              status: this.dataForm.status,
              modelType: this.dataForm.modelType,
              bottleWeight: this.dataForm.bottleWeight,
              reasonReturn: this.dataForm.reasonReturn,
              factory: this.dataForm.factory,
              depotId: this.dataForm.depotId,
              siteNo: this.dataForm.siteNo,
              applyName: this.dataForm.applyName,
              modelShelfId: this.dataForm.modelShelfId,
              productId: this.dataForm.productId,
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  },
  
  watch:{
      "dataForm.depotId" (){
      this.getIsEmptyList();
    }
  }
};
</script>
