<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="130px">
    
    <template>
        <el-form-item label="类型" prop="type">
            <el-radio-group v-if="dataForm.id==''||dataForm.id==0" v-model="dataForm.type">
              <el-radio-button label="1">入库</el-radio-button>
              <el-radio-button label="0">出库</el-radio-button>
            </el-radio-group>
            <el-radio-group v-if="dataForm.id!=''" v-model="dataForm.type">
              <el-radio-button v-if="dataForm.type==1" label="1">入库</el-radio-button>
              <el-radio-button v-if="dataForm.type==0" label="0">出库</el-radio-button>
            </el-radio-group>
          </el-form-item>

    </template>

    <el-form-item label="供货商名称" v-if="dataForm.type==1" prop="supplierId">  
        <el-select v-model="dataForm.supplierId" 
        default-first-option
        style="width:260px" clearabled filterable placeholder="请选择">
          <el-option
            v-for="item in supplierList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
    </el-form-item>

   <el-form-item label="原料名称" prop="materialName">
      <template v-if="dataForm.type==1">
 <el-select
          style="width:260px"
            v-model="dataForm.materialName"
            filterable
            allow-create
            clearable
            default-first-option
            placeholder="原料名称">
            <el-option
              v-for="item in ingredientList"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>

      </template>
       <template v-if="dataForm.type==0">
         <el-select
          style="width:260px"
            v-model="dataForm.materialName"
            filterable
            @change="getResidueWeight()"
            default-first-option
            placeholder="原料名称">
            <el-option
              v-for="item in ingredientList"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>

      </template>
      
    </el-form-item> 
    <el-form-item label="吨数" prop="weight">
      <el-input v-model="dataForm.weight" placeholder="吨数"   style="width:260px">
          <template slot="append">吨</template>
      </el-input>
      <template v-if="dataForm.type==0&&dataForm.materialName">
        剩余数量： <el-tag >{{residueWeight}} 吨</el-tag>
      </template>
 
    </el-form-item>
    <el-form-item label="价格" prop="price" v-if="dataForm.type==1">
      <el-input v-model="dataForm.price" placeholder="价格"   style="width:260px">
          <template slot="append">元</template>
      </el-input>
    </el-form-item>
    <el-form-item label="票号" prop="tickerNumber">
      <el-input v-model="dataForm.tickerNumber" placeholder="票号"   style="width:260px"></el-input>
    </el-form-item>
 
  

   <template v-if="dataForm.type==1">
         <el-form-item label="入库日期" prop="detailTime" >
              <el-date-picker  style="width:260px"
                v-model="dataForm.detailTime"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期">
              </el-date-picker>
        </el-form-item> 

        <el-form-item label="付款状态" prop="isPay" >
              <el-radio v-model="dataForm.isPay" label="0" border>未付款</el-radio>
              <el-radio v-model="dataForm.isPay" label="1" border>已付款</el-radio>
        </el-form-item>
        <el-form-item label="入库单留存" prop="imageUrl" >
            <el-upload
                class="avatar-uploader"  
                accept="image/*"
                :action="uploadImageUrl"
                :on-remove="handleRemove"
                :on-success="handleImageSuccess"
                :before-upload="beforeImageUpload"
                :show-file-list="false"
              >
              
            <img v-if="imageUrl" alt="" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
     
  
    </template>
  
   
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<style>  
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 260px;
    height: 260px;
    line-height: 260px;
    text-align: center;
  }
  .avatar {
    width: 260px;
    height: 260px;
    display: block;
  }
 .el-textarea__inner{
    height: 99px;
  }
  .el-upload-dragger{
    width: 260px;
  }
  .el-select-dropdown__list{
   
    max-height: 150px;
   
  }  
</style>
<script>
  export default {
    data () {
      return {
        visible: false,
        supplierList:[],
        ingredientList:[],
        uploadImageUrl: '',
        residueWeight:'',
        dataForm: {
          id: 0,
          supplierId: '',
          ingredientId: '',
          weight: '',
          price: '',
          type:"1",
          tickerNumber: '',
          imageUrl: '',
          materialName:"",
          detailTime:"",
          isPay:"0",
        },
        imageUrl:'',
        dataRule: {
         
          ingredientId: [
            { required: true, message: '原料名称不能为空', trigger: 'blur' }
          ],
          weight: [
            { required: true, message: '吨数不能为空', trigger: 'blur' }
          ],
       

     
        }
      }
    },
    methods: {
      getResidueWeight(){
        this.residueWeight='';
        if(this.dataForm.materialName==''){
            return ;
        }
         this.$http({
              url: this.$http.adornUrl(`/product/ingredient/residueWeightByMaterialName`),
              method: 'post',
              data: this.$http.adornData({
                'materialName': this.dataForm.materialName,
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                  
                  this.residueWeight=data.residueWeight;
              } else {
                this.$message.error(data.msg)
              }
            })
      },
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
      getAllSupplierList(){
            this.$http({
            url:this.$http.adornUrl(`/product/supplierinfo/getAllSupplierList`),
            method: "get"
        }).then(({data})=>{
          if(data &&data.code==0){
            this.supplierList=data.supplierList;
          }else {
              this.$message.error(data.msg);
          }
        })
      },
      init (id) {
         this.dataForm={
          supplierId: '',
          ingredientId: '',
          weight: '',
          price: '',
          type:"1",
          tickerNumber: '',
          imageUrl: '',
          materialName:"",
          detailTime:"",
          isPay:"0",
        },
        this.getAllIngredientList(),
        this.getAllSupplierList(),
        this.dataForm.id = id || 0,
        this.uploadImageUrl = this.$http.adornUrl(`/sys/oss/uploadSupplierImage?token=${this.$cookie.get('token')}`);
        this.imageUrl='',
       
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/product/ingredientdetail/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.supplierId = data.ingredientDetail.supplierId
                this.dataForm.ingredientId = data.ingredientDetail.ingredientId
                this.dataForm.weight = data.ingredientDetail.weight
                this.dataForm.price = data.ingredientDetail.price
                this.dataForm.tickerNumber = data.ingredientDetail.tickerNumber
                this.dataForm.type = data.ingredientDetail.type
                this.dataForm.imageUrl = data.ingredientDetail.imageUrl
                this.dataForm.materialName = data.ingredientDetail.materialName
                this.dataForm.detailTime = data.ingredientDetail.detailTime
                this.dataForm.isPay = data.ingredientDetail.isPay
                if(this.dataForm.imageUrl){
                   this.imageUrl =  window.SITE_CONFIG.baseUrl+'/pub'+this.dataForm.imageUrl+'?token='+this.$cookie.get('token');

                }
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/product/ingredientdetail/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'supplierId': this.dataForm.supplierId,
                'ingredientId': this.dataForm.ingredientId,
                'weight': this.dataForm.weight,
                'price': this.dataForm.price,
                'tickerNumber': this.dataForm.tickerNumber,
                'type': this.dataForm.type,
                'imageUrl': this.dataForm.imageUrl,
                'materialName': this.dataForm.materialName,
                'detailTime': this.dataForm.detailTime,
                'isPay': this.dataForm.isPay,
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
        handleRemove(file, fileList) {
        console.log(file, fileList);
      },
    
      handleImageSuccess(res, file) {
         this.imageUrl = URL.createObjectURL(file.raw);
         this.dataForm.imageUrl = res.imageUrl;
      },
      beforeImageUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt5M = file.size / 1024 / 1024 <5;

        if (!(isJPG||isPNG)) {
          this.$message.error('上传图片只能是 JPG 和 PNG 格式!');
        }
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 5MB!');
        }
        return (isJPG||isPNG) && isLt5M;
      },
    }
  }
</script>
