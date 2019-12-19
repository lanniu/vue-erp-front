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
    
      <el-form-item label="产品编号" prop="productName">
        <el-input v-model="dataForm.productName" placeholder="产品编号"  style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="模具编号" prop="modelId">
       <el-select v-model="dataForm.modelId" 
        default-first-option
        clearable
        style="width:260px" filterable placeholder="请选择">
          <el-option
            v-for="item in modelList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品分类" prop="productCategory">
        <el-select v-model="dataForm.productCategory" clearable  default-first-option style="width:260px" filterable placeholder="请选择">
          <el-option
            v-for="item in productTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>  
        
       <!-- <el-input v-model="dataForm.productCategory" placeholder="产品分类" style="width:260px"></el-input> -->
      </el-form-item>
      <el-form-item label="客户编号" prop="customerProductNo">
        <el-input v-model="dataForm.customerProductNo" clearable placeholder="客户产品(模具)编号"  style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="纸箱编号" prop="cartonId">
         <el-select v-model="dataForm.cartonId" 
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
      
      <el-form-item label="库存数量" prop="productNum">
        <el-input v-model.number="dataForm.productNum" placeholder="库存数量"  style="width:260px">
           <template slot="append">件</template>
        </el-input>
      </el-form-item>
      <el-form-item label="产品克数" prop="productWeight"  >
        <el-input v-model.number="dataForm.productWeight" placeholder="产品克数" style="width:260px">
           <template slot="append">克</template>
        </el-input>
      </el-form-item>
       <el-form-item label="口径" prop="productCaliber">
            <el-input v-model="dataForm.productCaliber" placeholder="口径" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="产品容量" prop="productVolume">
        <el-input v-model.number="dataForm.productVolume" placeholder="产品容量"  style="width:260px">
             <template slot="append">毫升</template>
        </el-input>
      </el-form-item>
      <el-form-item label="长宽高" prop="lengthWeightHeight">
            <el-input v-model="dataForm.lengthWeightHeight" placeholder="长宽高" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="产品图片" prop="productImageId">
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
        <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="imageUrl" alt="">
        </el-dialog>
        
      </el-form-item>

      <el-form-item label="产品图纸" prop="productDrawingId">
      <el-upload
        ref="upload"
        class="upload-demo"
        drag
        :action="uploadDesignUrl"
        :on-success="handleDesignSuccess"
        :before-upload="beforeDesignUpload"
        :before-remove="beforeDesignRemove"
        :file-list="fileList"
        >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传PDF/DWG文件，且不超过10MB</div>
      </el-upload>
      </el-form-item>
      
      <el-form-item label="生产批次" prop="productBatch" v-if="dataForm.id">
   
      <el-input v-model="dataForm.productBatch" placeholder="产品批次" style="width:260px"></el-input>

      </el-form-item>

      <el-form-item label="产品问题" prop="productQuestion">
        <el-input v-model="dataForm.productQuestion" type="textarea" size='medium' placeholder="产品问题" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="配件套" prop="productAssort">
         <el-radio-group v-model="dataForm.productAssort" style="width:260px">
              <el-radio :label="1">有</el-radio>
              <el-radio :label="0">无</el-radio>
          </el-radio-group>
      </el-form-item>
      <el-form-item label="后续加工" prop="productTrailingProcess">
        <el-input v-model="dataForm.productTrailingProcess" placeholder="产品后续加工" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="productRemark">
        <el-input v-model="dataForm.productRemark" type="textarea" size='small' placeholder="产品备注" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="成品率" prop="yield" v-if="dataForm.id">
        <el-input v-model="dataForm.yield" placeholder="产品成品率" style="width:260px">
             <template slot="append">%</template>
        </el-input>
      </el-form-item>
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
  data() {
    return {
      visible: false,
      dialogImageUrl: '',
      dialogVisible: false,
      uploadDesignUrl: '',
      uploadImageUrl: '',
      imageUrl: "",
      oldImageUrl: "",
      designFileUrl:'',
      oldDesignFileUrl:'',
      fileList:[],
      modelList:[],
      productBoxList:[],
      productTypeList:[],
      dataForm: {
        id: 0,
        productNo: "",
        productName: "",
        modelId: "",
        customerProductNo: "",
        cartonId: "",
        productNum: "",
        productWeight: "",
        productVolume: "",
        productImageId: "",
        productDrawingId: "",
        productBatch: "",
        productQuestion: "",
        productAssort: "",
        productTrailingProcess: "",
        productRemark: "",
        yield: "",
        productCategory: "",
        productCaliber: '',
        lengthWeightHeight: '',
      },
      dataRule: {
      
        productName: [
          { required: true, message: "产品名称不能为空", trigger: "blur" }
        ],
        // modelNo: [
        //   { required: true, message: "模具编号不能为空", trigger: "blur" }
        // ],
        // cartonId: [
        //   { required: true, message: "纸箱编号不能为空", trigger: "blur" }
        // ],
        productWeight: [
          { required: true, message: "产品克数不能为空", trigger: "blur" }
        ],
        productVolume: [
          { required: true, message: "产品容量不能为空", trigger: "blur" }
        ],
        // productImageId: [
        //   { required: true, message: "产品图片不能为空", trigger: "blur" }
        // ],
        // productDrawingId: [
        //   { required: true, message: "产品图纸不能为空", trigger: "blur" }
        // ],
        // productBatch: [
        //   { required: true, message: "产品批次不能为空", trigger: "blur" }
        // ],
        productAssort: [
          { required: true, message: "产品组合套不能为空", trigger: "blur" }
        ],
      }
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
   getCustomerModelNo(){
     if(!this.dataForm.modelId){
       console.log(this.dataForm.modelId);
       return false;
     }     
      this.$http({
                url:this.$http.adornUrl(`/product/productmodel/getCustomerModelNo/${!this.dataForm.modelId?'0':this.dataForm.modelId}`),
                method: "get"
            }).then(({data})=>{
              if(data &&data.code==0){
                this.dataForm.customerProductNo=data.customerModelNo;
              
              }else {
                  this.$message.error(data.msg);
              }
            })
     },

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

    getProductType(){
          this.$http({
          url:this.$http.adornUrl(`/product/productinfo/getProductType`),
          method: "get"
      }).then(({data})=>{
        if(data &&data.code==0){
          this.productTypeList=data.productTypeList;
        }else {
             this.$message.error(data.msg);
         }
      })
    },


     handleRemove(file, fileList) {
        this.imageUrl=this.oldImageUrl;
        console.log(file, fileList);
      },
     
      // handlePictureCardPreview(file) {
      //   this.dialogImageUrl = file.url;
      //   this.dialogVisible = true;
      // },

      handleImageSuccess(res, file) {
         this.imageUrl = URL.createObjectURL(file.raw);
         this.dataForm.productImageId = res.imageId;
         console.log(this.dataForm.productImageId);
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
      handleDesignSuccess(res, file){
         this.dataForm.productDrawingId = res.drawingId;
         console.log(this.dataForm.productDrawingId);
      },
      beforeDesignRemove(file, fileList) {

      this.$http({
          url:this.$http.adornUrl(`/product/productinfo/deleteDesignId/`+this.dataForm.productDrawingId),
          method: "get"
      }).then(({data})=>{
        if(data &&data.code==0){
           this.dataForm.productDrawingId=null;
         return true;
        }else {
             this.$message.error(data.msg);
         }
      })
       

    
      },
      beforeDesignUpload(file) {
        console.log(file);
        const isPDF = file.type === 'application/pdf';
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
    
        const isLt10M = file.size / 1024 / 1024 <10;

      if (!(isJPG||isPNG||isPDF)) {
         this.$message.error('上传文件只能是PDF、 JPG 和 PNG 格式!');
       }

       if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!');
       }
      
      return (isJPG||isPNG||isPDF) && isLt10M;

    },
    init(id) {
    this.getModelListInfo();
    this.getAllProductBoxList();
    this.getProductType();
      this.imageUrl='';
      this.fileList=[];
      this.dataForm={
        id: 0,
        productNo: "",
        productName: "",
        modelId: "",
        customerProductNo: "",
        cartonId: "",
        productNum: "",
        productWeight: "",
        productVolume: "",
        productImageId: "",
        productDrawingId: "",
        productBatch: "",
        productQuestion: "",
        productAssort: "",
        productTrailingProcess: "",
        productRemark: "",
        yield: "",
        productCategory: "",
        productCaliber: '',
        lengthWeightHeight: '',
      },
      this.uploadImageUrl = this.$http.adornUrl(`/sys/oss/uploadImage?token=${this.$cookie.get('token')}`);
      this.uploadDesignUrl = this.$http.adornUrl(`/sys/oss/uploadDesignFile?token=${this.$cookie.get('token')}`);
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/product/productinfo/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.productNo              = data.productInfo.productNo;
              this.dataForm.productName            = data.productInfo.productName;
              this.dataForm.modelId                = data.productInfo.modelId;
              this.dataForm.customerProductNo      = data.productInfo.customerProductNo;
              this.dataForm.cartonId               = data.productInfo.cartonId;
              this.dataForm.productNum             = data.productInfo.productNum;
              this.dataForm.productWeight          = data.productInfo.productWeight;
              this.dataForm.productVolume          = data.productInfo.productVolume;
              this.dataForm.productImageId         = data.productInfo.productImageId;
              this.dataForm.productDrawingId       = data.productInfo.productDrawingId;
              this.dataForm.productBatch           = data.productInfo.productBatch;
              this.dataForm.productQuestion        = data.productInfo.productQuestion;
              this.dataForm.productAssort          = data.productInfo.productAssort;
              this.dataForm.productTrailingProcess = data.productInfo.productTrailingProcess;
              this.dataForm.productRemark          = data.productInfo.productRemark;
              this.dataForm.productCaliber         = data.productInfo.productCaliber;
              this.dataForm.lengthWeightHeight     = data.productInfo.lengthWeightHeight;
              this.dataForm.yield                  = data.productInfo.yield;
              this.dataForm.productCategory        = data.productInfo.productCategory;

              if(data.productInfo.productImageUrl!=null&&data.productInfo.productImageUrl!=''){
                this.oldImageUrl = window.SITE_CONFIG.baseUrl+'/pub'+data.productInfo.productImageUrl+'?token='+this.$cookie.get('token');
                this.imageUrl    = window.SITE_CONFIG.baseUrl+'/pub'+data.productInfo.productImageUrl+'?token='+this.$cookie.get('token');
             }else{
        
               this.imageUrl = '';
             }
             
            if(data.fileName!=''){
              this.fileList=[{
                name:'',
                url:''
              }];
            this.fileList[0].name=data.fileName;
            }else{
              this.fileList=[];
            }
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
              `/product/productinfo/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              productNo: this.dataForm.productNo,
              productName: this.dataForm.productName,
              modelId: this.dataForm.modelId,
              customerProductNo: this.dataForm.customerProductNo,
              cartonId: this.dataForm.cartonId,
              productNum: this.dataForm.productNum,
              productWeight: this.dataForm.productWeight,
              productVolume: this.dataForm.productVolume,
              productImageId: this.dataForm.productImageId,
              productDrawingId: this.dataForm.productDrawingId,
              productBatch: this.dataForm.productBatch,
              productQuestion: this.dataForm.productQuestion,
              productAssort: this.dataForm.productAssort,
              productTrailingProcess: this.dataForm.productTrailingProcess,
              productRemark: this.dataForm.productRemark,
              yield: this.dataForm.yield,
              'productCategory': this.dataForm.productCategory,
              'productCaliber': this.dataForm.productCaliber,
              'lengthWeightHeight': this.dataForm.lengthWeightHeight,
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
     "dataForm.modelId" (){
       this.getCustomerModelNo();
      },
     
  }
}
</script>
