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
      <el-form-item label="产品ID" prop="productId" >
        <el-select v-model="dataForm.productId" clearable filterable placeholder="请选择"  style="width:260px">
            <el-option
              v-for="item in productList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
       </el-select>
        <!-- <el-input v-model="dataForm.productId" placeholder="产品ID" style="width:260px"></el-input> -->
      </el-form-item>
      <el-form-item label="每箱只数" prop="zhiNumber">
        <el-input v-model.number="dataForm.zhiNumber" placeholder="每箱只数" style="width:260px"></el-input>
      </el-form-item>
      <!-- <el-form-item label="纸箱id" prop="boxId"> -->
      <el-form-item label="纸箱供应方式" prop="boxSupplyWay">
        <el-radio-group v-model="boxSupplyWay" style="width:260px">
              <el-radio :label="1">自供</el-radio>
              <el-radio :label="0">客供</el-radio>
          </el-radio-group>
      </el-form-item>
        <template>
          <el-form-item label="纸箱编号" prop="boxNo" v-if="boxSupplyWay==1">
            <!-- <el-select v-model="dataForm.boxId" 
            default-first-option
            style="width:260px" readonly filterable placeholder="请选择">
              <el-option
                v-for="item in productBoxList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select> -->
        <el-input v-model="boxNo" disabled placeholder="纸箱编号" style="width:260px"></el-input>
         </el-form-item>
        </template>
  
      <el-form-item label="箱数" prop="boxNumber">
        <el-input v-model.number="dataForm.boxNumber" placeholder="箱数" style="width:260px"></el-input>
  
      </el-form-item>
      <el-form-item label="入库数量" prop="productNumber">
        <el-tag>{{productNumber}}</el-tag> 
        <!-- <el-input v-model="dataForm.productNumber" placeholder="入库数量" style="width:260px"> </el-input> -->
      </el-form-item>
      <el-form-item label="入库时间" prop="putInTime">
         <el-date-picker
          v-model="dataForm.putInTime"
          type="date"
          style="width:260px"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="入库时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注" style="width:260px"></el-input>
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
      productBoxList:[],
      productList:[],
      boxSupplyWay:"",
      boxNo:"",
      dataForm: {
        id: 0,
        productId: "",
        zhiNumber: 0,
        boxId: "",
        boxNumber: 0,
        productNumber: "",
        putInTime: "",
        remark: "",
      
      },
      dataRule: {
        productId: [
          { required: true, message: "产品ID不能为空", trigger: "blur" }
        ],
        zhiNumber: [
          { required: true, message: "只数不能为空", trigger: "blur" }
        ],
        boxId: [{ required: true, message: "纸箱id不能为空", trigger: "blur" }],
        boxNumber: [
          { required: true, message: "箱数不能为空", trigger: "blur" }
        ],
        
        putInTime: [
          { required: true, message: "入库时间不能为空", trigger: "blur" }
        ],
      
      }
    };
  },
  methods: {
    //获取纸箱编号
    getProductBoxNo(){

          let _url=this.$http.adornUrl(`/product/productinfo/infoTwo/${this.dataForm.productId}`);
          if(this.dataForm.productId ==''){
           _url=this.$http.adornUrl(`/product/productinfo/infoTwo/0`)
          }
            this.$http({
            url:_url,
            method: "get"
        }).then(({data})=>{
          if(data &&data.code==0){
        
            this.dataForm.boxId=data.productInfo.cartonId;
            this.boxNo=data.productInfo.boxNo;
          //  alert(data.productBoxList);
          }else {
              this.$message.error(data.msg);
          }
        })
    },
  //获取所有的产品
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
    init(id) {
      this.getProductList();
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/product/productputinstorage/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.productId = data.productPutInStorage.productId;
              this.dataForm.zhiNumber = data.productPutInStorage.zhiNumber;
              this.dataForm.boxId = data.productPutInStorage.boxId;
              this.dataForm.boxNumber = data.productPutInStorage.boxNumber;
              this.dataForm.productNumber = data.productPutInStorage.productNumber;
              this.dataForm.putInTime = data.productPutInStorage.putInTime;
              this.dataForm.remark = data.productPutInStorage.remark;
            }
          });
        }
      });
    },
    
    // 表单提交
    dataFormSubmit() {

      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if(this.boxSupplyWay==0){
             this.dataForm.boxId='';
          }
          this.$http({
            url: this.$http.adornUrl(
              `/product/productputinstorage/${
                !this.dataForm.id ? "save" : "update"
              }`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              productId: this.dataForm.productId,
              zhiNumber: this.dataForm.zhiNumber,
              boxId: this.dataForm.boxId,
              boxNumber: this.dataForm.boxNumber,
              productNumber: this.productNumber,
              putInTime: this.dataForm.putInTime,
              remark: this.dataForm.remark,
              createTime: this.dataForm.createTime,
              createUser: this.dataForm.createUser,
              updateTime: this.dataForm.updateTime,
              updateUser: this.dataForm.updateUser,
              status: this.dataForm.status
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
     "dataForm.productId" (){
       this.getProductBoxNo();
        //console.log("111")
      },
     
  },
  computed:{
    productNumber:function(){
      return this.dataForm.zhiNumber*this.dataForm.boxNumber;
    }
  }



};
</script>
