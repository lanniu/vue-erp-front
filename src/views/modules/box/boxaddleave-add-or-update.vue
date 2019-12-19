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
    <template >
      <el-form-item label="类型" prop="type">
        <el-radio-group v-if="dataForm.id==''||dataForm.id==0" v-model="dataForm.type">
          <el-radio-button label="1">入库</el-radio-button>
          <el-radio-button label="0">出库</el-radio-button>
        </el-radio-group>
         <el-radio-group v-if="dataForm.id!=''" v-model="dataForm.type" >
          <el-radio-button v-if="dataForm.type==1" label="1">入库</el-radio-button>
          <el-radio-button v-if="dataForm.type==0" label="0">出库</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </template>
     <el-form-item label="纸箱编号" prop="boxNo">
         <el-select v-model="dataForm.boxNo"  default-first-option clearable  style="width:260px" filterable placeholder="请选择">
          <el-option
            v-for="item in productBoxList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="箱体数量" prop="bodyNumber">
        <el-input v-model="dataForm.bodyNumber" placeholder="箱体数量"  style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="格挡数量" prop="parryNumber">
        <el-input v-model="dataForm.parryNumber" placeholder="格挡数量"  style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="垫片数量" prop="spacerNumber">
        <el-input v-model="dataForm.spacerNumber" placeholder="垫片数量"  style="width:260px"></el-input>
      </el-form-item>
      <template v-if="dataForm.type=='1'">
      <el-form-item label="纸箱入库数量" prop="addBoxNumber">
        <el-input v-model="dataForm.addBoxNumber" placeholder="纸箱入库数量"  style="width:260px"></el-input>
      </el-form-item>
       <el-form-item label="入库时间" prop="addBoxTime">
        <el-date-picker
          v-model="dataForm.addBoxTime"
          type="date"
          style="width:260px"
           value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="入库时间"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="供货商" prop="factoryId">
         <el-select v-model="dataForm.factoryId" 
        default-first-option
        style="width:260px" filterable placeholder="请选择">
          <el-option
            v-for="item1 in productBoxFactoryList"
            :key="item1.id"
            :label="item1.name"
            :value="item1.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="单价" prop="boxPrice">
        <el-input v-model="dataForm.boxPrice" placeholder="单价"  style="width:260px"></el-input>
      </el-form-item>
       <el-form-item label="纸箱订单留存" prop="boxOrderImage">
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
      </template>

   

      <template v-if="dataForm.type=='0'">
      <el-form-item label="纸箱出库数量" prop="outBoxNumber">
        <el-input v-model="dataForm.outBoxNumber" placeholder="纸箱出库数量"  style="width:260px"></el-input>
      </el-form-item>
       <el-form-item label="出库时间" prop="outBoxTime">
        <el-date-picker
          v-model="dataForm.outBoxTime"
          type="date"
          style="width:260px"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="出库时间"
        ></el-date-picker>
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
      dialogVisible: false,
       visible:false,
       uploadImageUrl: '',
       productBoxFactoryList:[],
       productBoxList:[],
        boxFactory:[{
          factoryId:'',
          boxBatch:'',
          boxPrice:'',
        }],
        imageUrl:'',
        dataForm: {
          id: 0,
          boxNo: '',
          bodyNumber: '',
          parryNumber: '',
          spacerNumber: '',
          addBoxNumber: '',
          outBoxNumber: '',
          createUser: '',
          createTime: '',
          updateUser: '',
          updateTime: '',
          status:'',
          addBoxTime:'',
          outBoxTime:'',
          boxPrice:'',
          factoryId:'',
          type:'1',
          boxOrderImage:'',
        },
        dataRule: {
          boxNo: [
            { required: true, message: '纸箱编号不能为空', trigger: 'blur' }
          ],
          bodyNumber: [
            { required: true, message: '箱体数量不能为空', trigger: 'blur' }
          ],
          parryNumber: [
            { required: true, message: '格挡数量不能为空', trigger: 'blur' }
          ],
          // spacerNumber: [
          //   { required: true, message: '垫片数量不能为空', trigger: 'blur' }
          // ],
         
        }
      }
    },
    methods: {
          getAllBoxFactoryList(){
            this.$http({
            url:this.$http.adornUrl(`/product/boxfactory/getAllBoxFactoryList`),
            method: "get"
        }).then(({data})=>{
          if(data &&data.code==0){
            this.productBoxFactoryList=data.productBoxFactoryList;
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
          }else {
              this.$message.error(data.msg);
          }
        })
      },
      init (id) {
        this.getAllProductBoxList();
        this.getAllBoxFactoryList();
        this.uploadImageUrl = this.$http.adornUrl(`/sys/oss/uploadBoxImage?token=${this.$cookie.get('token')}`);
        this.imageUrl='',
        this.dataForm= {
          boxNo: '',
          bodyNumber: '',
          parryNumber: '',
          spacerNumber: '',
          addBoxNumber: '',
          outBoxNumber: '',
          addBoxTime:'',
          outBoxTime:'',
          factoryId:'',
          boxPrice:'',
          type:'1',
          boxOrderImage:'',
        },
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/product/boxaddleave/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.boxNo = data.boxAddLeave.boxNo
                this.dataForm.bodyNumber = data.boxAddLeave.bodyNumber
                this.dataForm.parryNumber = data.boxAddLeave.parryNumber
                this.dataForm.spacerNumber = data.boxAddLeave.spacerNumber
                this.dataForm.addBoxNumber = data.boxAddLeave.addBoxNumber
                this.dataForm.outBoxNumber = data.boxAddLeave.outBoxNumber
                this.dataForm.createUser = data.boxAddLeave.createUser
                this.dataForm.createTime = data.boxAddLeave.createTime
                this.dataForm.updateUser = data.boxAddLeave.updateUser
                this.dataForm.updateTime = data.boxAddLeave.updateTime
                this.dataForm.status = data.boxAddLeave.status
                this.dataForm.type = data.boxAddLeave.type
                this.dataForm.addBoxTime = data.boxAddLeave.addBoxTime
                this.dataForm.outBoxTime = data.boxAddLeave.outBoxTime
                this.dataForm.boxPrice = data.boxAddLeave.boxPrice
                this.dataForm.factoryId = data.boxAddLeave.factoryId
                this.dataForm.boxOrderImage = data.boxAddLeave.boxOrderImage
                if(this.dataForm.boxOrderImage){
                this.imageUrl =  window.SITE_CONFIG.baseUrl+'/pub'+this.dataForm.boxOrderImage+'?token='+this.$cookie.get('token');
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
              url: this.$http.adornUrl(`/product/boxaddleave/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'boxNo': this.dataForm.boxNo,
                'bodyNumber': this.dataForm.bodyNumber,
                'parryNumber': this.dataForm.parryNumber,
                'spacerNumber': this.dataForm.spacerNumber,
                'addBoxNumber': this.dataForm.addBoxNumber,
                'outBoxNumber': this.dataForm.outBoxNumber,
                'createUser': this.dataForm.createUser,
                'createTime': this.dataForm.createTime,
                'updateUser': this.dataForm.updateUser,
                'updateTime': this.dataForm.updateTime,
                'outBoxTime': this.dataForm.outBoxTime,
                'addBoxTime': this.dataForm.addBoxTime,
                'status': this.dataForm.status,
                'type': this.dataForm.type,
                'boxPrice': this.dataForm.boxPrice,
                'boxOrderImage': this.dataForm.boxOrderImage,
                'factoryId': this.dataForm.factoryId
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
   removeDomain(index) {
    //var index = this.dynamicValidateForm.domains.indexOf(item);
    if (index !== -1) {
      this.boxFactory.splice(index, 1);
    }
  },
     handleRemove(file, fileList) {
        console.log(file, fileList);
      },
    
      handleImageSuccess(res, file) {
         this.imageUrl = URL.createObjectURL(file.raw);
         this.dataForm.boxOrderImage = res.imageUrl;
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
     
    addDomain() {
    this.boxFactory.push({
          factoryId:'',
          boxBatch:'',
          boxPrice:'',
          
    });
  }
    }
  }
</script>
