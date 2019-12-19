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
      <template>
      <el-form-item label="类别" prop="modelType" >
          <el-radio-group v-model="dataForm.modelType" v-if="dataForm.id==0||dataForm.id==''">
            <el-radio :label="1">入库登记</el-radio>
            <el-radio :label="0">模具拉出</el-radio>
            <el-radio :label="2">新品打样</el-radio>
            <el-radio :label="3">返厂维修</el-radio>
            <el-radio :label="4">外来加工</el-radio>
          </el-radio-group>
          <el-radio-group  v-if="dataForm.id!=''" v-model="dataForm.modelType">
            <el-radio :label="1" v-if="dataForm.modelType=='1'">入库登记</el-radio>
            <el-radio :label="0" v-if="dataForm.modelType=='0'">模具拉出</el-radio>
            <el-radio :label="2" v-if="dataForm.modelType=='2'">新品打样</el-radio>
            <el-radio :label="3" v-if="dataForm.modelType=='3'">返厂维修</el-radio>
            <el-radio :label="4" v-if="dataForm.modelType=='4'">外来加工</el-radio>
          </el-radio-group>
      </el-form-item>

     </template>

      <template v-if="dataForm.modelType=='0'||dataForm.modelType=='1'">
        <el-form-item label="仓库号" prop="depotId">
          <el-radio-group v-model="dataForm.depotId">
            <el-radio :label="1">新第一仓库</el-radio>
            <el-radio :label="2">第二仓库</el-radio>
            <el-radio :label="3">第三仓库</el-radio>
            <el-radio :label="4">老第一仓库</el-radio>
          </el-radio-group>     
        </el-form-item>
        <el-form-item  v-if="dataForm.modelType=='1'" label="架号" prop="modelShelfId">
          
           <el-select v-model="dataForm.modelShelfId" filterable placeholder="请选择"  style="width:260px">
            <el-option
              v-for="item in modelShelfIsEmptyList"
              :key="item.id"
              :label="item.shelfNo"
              :value="item.id"
            ></el-option>
          </el-select>
        <!-- <el-input v-model="dataForm.modelShelfId" placeholder="架号" style="width:260px"></el-input> -->
      </el-form-item>
     
      </template>
     


      <el-form-item label="模具编号" prop="modelNo">
        <!-- <el-input v-model="dataForm.modelNo" placeholder="模具编号" style="width:260px"></el-input> -->

           <template>
          <el-select
          style="width:260px"
            v-model="dataForm.modelNo"
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
        </template>
      </el-form-item>

     

      <el-form-item label="客户模具编号" prop="customerModelNo">
        <el-input v-model="dataForm.customerModelNo" placeholder="客户模具编号" style="width:260px"></el-input>
      </el-form-item>

        
        
      <el-form-item label="产品名称" prop="productId">
         <el-select v-model="dataForm.productId" filterable clearable placeholder="请选择"  style="width:260px">
            <el-option
              v-for="item in productList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
      </el-form-item>
      <!-- <el-form-item label="成模" prop="modelSuccessMo">
        <el-input v-model="dataForm.modelSuccessMo" placeholder="成模" style="width:260px">
          <template slot="append">件</template>
        </el-input>
      </el-form-item>
      <el-form-item label="初模" prop="modelPrimaryMo">
        <el-input v-model="dataForm.modelPrimaryMo" placeholder="初模" style="width:260px">
          <template slot="append">件</template>
        </el-input>
      </el-form-item>
     
      <el-form-item label="闷头" prop="modelMenTou">
        <el-input v-model="dataForm.modelMenTou" placeholder="闷头 " style="width:260px">
          <template slot="append">件</template>
        </el-input>
      </el-form-item>
      <el-form-item label="漏斗" prop="modelFunnel">
        <el-input v-model="dataForm.modelFunnel" placeholder="漏斗" style="width:260px">
          <template slot="append">件</template>
        </el-input>
      </el-form-item>
       <el-form-item label="口模" prop="modelMouthMo">
        <el-input v-model="dataForm.modelMouthMo" placeholder="口模" style="width:260px">
          <template slot="append">件</template>
        </el-input>
      </el-form-item>
      <el-form-item label="芯子" prop="modelCore">
        <el-input v-model="dataForm.modelCore" placeholder="芯子" style="width:260px">
          <template slot="append">件</template>
        </el-input>
      </el-form-item>
      <el-form-item label="气头" prop="modelAirTou">
        <el-input v-model="dataForm.modelAirTou" placeholder="气头" style="width:260px">
          <template slot="append">件</template>
        </el-input>
      </el-form-item>
      <el-form-item label="钳片" prop="modelClamp">
        <el-input v-model="dataForm.modelClamp" placeholder="钳片" style="width:260px">
          <template slot="append">件</template>
        </el-input>
      </el-form-item>
      <el-form-item label="冷却" prop="modelCooling">
        <el-input v-model="dataForm.modelCooling" placeholder="冷却" style="width:260px">
          <template slot="append">件</template>
        </el-input>
      </el-form-item>
      
      <el-form-item label="容量" prop="modelVolume">
        <el-input v-model="dataForm.modelVolume" placeholder="容量" style="width:260px">
          <template slot="append">毫升</template>
        </el-input>
      </el-form-item>
      <el-form-item label="瓶重" prop="bottleWeight">
        <el-input v-model="dataForm.bottleWeight" placeholder="瓶重" style="width:260px">
          <template slot="append">克</template>
        </el-input>
      </el-form-item> -->
      <el-form-item label="经手人" prop="modelHandlingPeople">
        <el-input v-model="dataForm.modelHandlingPeople" placeholder="经手人" style="width:260px"></el-input>
      </el-form-item>
      <template>
        <div v-if="dataForm.modelType=='1'||dataForm.modelType=='3'">
          <el-form-item label="发货日期" prop="modelDeliveryTime">
            <el-date-picker
              v-model="dataForm.modelDeliveryTime"
              type="datetime"
              style="width:260px"
              placeholder="发货日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </div>
      </template>
      <template v-if="dataForm.modelType=='3'">
        <el-form-item label="收货日期" prop="modelReceiptTime">
          <el-date-picker
            v-model="dataForm.modelReceiptTime"
            type="datetime"
            style="width:260px"
            placeholder="收货日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
      </template>
      <el-form-item label="客户名称" prop="customerName">
        <el-input v-model="dataForm.customerName" placeholder="客户名称" style="width:260px"></el-input>
      </el-form-item>
       <el-form-item label="厂商" prop="factory">
        <el-input v-model="dataForm.factory" placeholder="厂商" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="是否在库" prop="state">
        <el-radio-group v-model="dataForm.state">
          <el-radio :label="0">是</el-radio>
          <el-radio :label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="modelRemark">
        <el-input v-model="dataForm.modelRemark" placeholder="备注" style="width:260px"></el-input>
      </el-form-item>
      <!-- <el-form-item label="模具状态" prop="status">
         <template>
      <el-radio-group v-model="dataForm.status">
        <el-radio :label="0">启用</el-radio>
        <el-radio :label="1">禁用</el-radio>
      </el-radio-group>
      </template>
      </el-form-item>-->
      <template v-if="dataForm.modelType=='3'">
        <el-form-item label="退货原因" prop="reasonReturn">
          <el-input
            v-model="dataForm.reasonReturn"
            placeholder="退货原因"
            type="textarea"
            style="width:260px"
          ></el-input>
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      visible: false,
      productList:[],
      modelList:[],
      modelShelfIsEmptyList:[],
      dataForm: {
        id: 0,
        siteNo: "",
        depotId:1,
        modelNo: "",
        customerModelNo:"",
        productName: "",
        modelSuccessMo: "",
        modelPrimaryMo: "",
        modelMouthMo: "",
        modelMenTou: "",
        modelFunnel: "",
        modelCore: "",
        modelAirTou: "",
        modelCooling: "",
        modelClamp: "",
        modelVolume: "",
        modelHandlingPeople: "",
        modelDeliveryTime: "",
        modelReceiptTime: "",
        customerName: "",
        state: "",
        modelRemark: "",
        status: "",
        modelType: "",
        bottleWeight: "",
        reasonReturn: "",
        factory:'',
        modelShelfId:'',
        productId:'',
        modelName:''
      },
      dataRule: {
        siteNo: [{ required: true, message: "架号不能为空", trigger: "blur" }],
        modelNo: [
          { required: true, message: "模具编号不能为空", trigger: "blur" }
        ],
        productName: [
          { required: true, message: "产品名称不能为空", trigger: "blur" }
        ],
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
        modelVolume: [
          { required: true, message: "容量不能为空", trigger: "blur" }
        ],
        modelHandlingPeople: [
          { required: true, message: "经手人不能为空", trigger: "blur" }
        ],
        customerName: [
          { required: true, message: "客户名称不能为空", trigger: "blur" }
        ]
      },
      modelType: [
        {
          required: true,
          message:
            "0为入库，1为出库，2为新品打样，3为返厂维修记录，4为外来加工不能为空",
          trigger: "blur"
        }
      ],
    };
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
    getIsEmptyList(){
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
    init(id) {
      this.dataForm.id = id || 0;
      this.getModelListInfo();
      this.getIsEmptyList();
      this.getProductList();
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/product/productmodel/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.siteNo = data.productModel.siteNo;
              this.dataForm.modelNo = data.productModel.modelNo;
              this.dataForm.customerModelNo = data.productModel.customerModelNo;
              this.dataForm.productName = data.productModel.productName;
              this.dataForm.modelSuccessMo = data.productModel.modelSuccessMo;
              this.dataForm.modelPrimaryMo = data.productModel.modelPrimaryMo;
              this.dataForm.modelMouthMo = data.productModel.modelMouthMo;
              this.dataForm.modelMenTou = data.productModel.modelMenTou;
              this.dataForm.modelFunnel = data.productModel.modelFunnel;
              this.dataForm.modelCore = data.productModel.modelCore;
              this.dataForm.modelAirTou = data.productModel.modelAirTou;
              this.dataForm.modelCooling = data.productModel.modelCooling;
              this.dataForm.modelClamp = data.productModel.modelClamp;
              this.dataForm.modelVolume = data.productModel.modelVolume;
              this.dataForm.modelHandlingPeople =data.productModel.modelHandlingPeople;
              this.dataForm.modelDeliveryTime =data.productModel.modelDeliveryTime;
              this.dataForm.modelReceiptTime =data.productModel.modelReceiptTime;
              this.dataForm.customerName = data.productModel.customerName;
              this.dataForm.state = data.productModel.state;
              this.dataForm.modelRemark = data.productModel.modelRemark;
              this.dataForm.createTime = data.productModel.createTime;
              this.dataForm.createUser = data.productModel.createUser;
              this.dataForm.updateTime = data.productModel.updateTime;
              this.dataForm.updateUser = data.productModel.updateUser;
              this.dataForm.status = data.productModel.status;
              this.dataForm.modelType = data.productModel.modelType;
              this.dataForm.bottleWeight = data.productModel.bottleWeight;
              this.dataForm.reasonReturn = data.productModel.reasonReturn;
              this.dataForm.factory = data.productModel.factory;
              this.dataForm.depotId = data.productModel.depotId;
              this.dataForm.modelShelfId = data.productModel.modelShelfId;
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
              `/product/productmodel/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              siteNo: this.dataForm.siteNo,
              modelNo: this.dataForm.modelNo,
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
              modelVolume: this.dataForm.modelVolume,
              modelHandlingPeople: this.dataForm.modelHandlingPeople,
              modelDeliveryTime: this.dataForm.modelDeliveryTime,
              modelReceiptTime: this.dataForm.modelReceiptTime,
              customerName: this.dataForm.customerName,
              state: this.dataForm.state,
              modelRemark: this.dataForm.modelRemark,
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
              modelShelfId: this.dataForm.modelShelfId,
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
    },
     
  },

};
</script>
