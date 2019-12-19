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
    
    <el-form-item label="配件名称" prop="partName">
      <el-select
          style="width:260px"
            v-model="dataForm.partName"
            filterable
            allow-create
            clearable
            default-first-option
            placeholder="配件名称">
            <el-option
              v-for="item in partInfoList"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
    </el-form-item>
    <el-form-item label="配件数量" prop="partNumber">
      <el-input v-model="dataForm.partNumber" placeholder="配件数量" style="width:260px">
         <template slot="append">件</template>
      </el-input>
    </el-form-item>
     
    <el-form-item label="入库单留存" prop="imageUrl" v-if="dataForm.type==1" >
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
    
 
    <el-form-item label="采购人员" prop="purchaseName" v-if="dataForm.type==1">
      <el-input v-model="dataForm.purchaseName" placeholder="采购人员" style="width:260px"></el-input>
    </el-form-item>
    <el-form-item label="采购日期" prop="purchaseTime" v-if="dataForm.type==1">
      <el-date-picker 
        v-model="dataForm.purchaseTime"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="date"
        style="width:260px"
        placeholder="采购日期">
      </el-date-picker>
      <!-- <el-input v-model="dataForm.purchaseTime" placeholder="采购日期" style="width:260px"></el-input> -->
    </el-form-item>
    <el-form-item label="使用人员" prop="userName" v-if="dataForm.type==0">
      <el-input v-model="dataForm.userName" placeholder="使用人员" style="width:260px"></el-input>
    </el-form-item>
    <el-form-item label="使用日期" prop="userTime" v-if="dataForm.type==0">
        <el-date-picker
        v-model="dataForm.userTime"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="date"
        style="width:260px"
        placeholder="使用日期">
      </el-date-picker>
      <!-- <el-input v-model="dataForm.userTime" placeholder="使用日期" style="width:260px"></el-input> -->
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
    data () {
      return {
        visible: false,
        partInfoList:[],
        imageUrl:'',
        uploadImageUrl: '',
        dataForm: {
          id: 0,
          partId: '',
          partName: '',
          partNumber: '',
          type: '1',
          imageUrl: '',
          purchaseName: '',
          purchaseTime: '',
          userName: '',
          userTime: '',
          
        },
        dataRule: {
          partId: [
            { required: true, message: '配件名称不能为空', trigger: 'blur' }
          ],
          partNumber: [
            { required: true, message: '配件数量不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '配件的方式不能为空', trigger: 'blur' }
          ],
          
          
        }
      }
    },
    methods: {
         getAllPartList(){
            this.$http({
            url:this.$http.adornUrl(`/product/partinfo/getAllPartList`),
            method: "get"
        }).then(({data})=>{
          if(data &&data.code==0){
            this.partInfoList=data.partInfoList;
          }else {
              this.$message.error(data.msg);
          }
        })
      },


      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.uploadImageUrl = this.$http.adornUrl(`/sys/oss/uploadPartImage?token=${this.$cookie.get('token')}`);
        this.imageUrl='',
        this.getAllPartList();
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/product/partdetail/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.partId = data.partdetail.partId
                this.dataForm.partName = data.partdetail.partName
                this.dataForm.partNumber = data.partdetail.partNumber
                this.dataForm.type = data.partdetail.type
                this.dataForm.imageUrl = data.partdetail.imageUrl
                this.dataForm.purchaseName = data.partdetail.purchaseName
                this.dataForm.purchaseTime = data.partdetail.purchaseTime
                this.dataForm.userName = data.partdetail.userName
                this.dataForm.userTime = data.partdetail.userTime
                
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
              url: this.$http.adornUrl(`/product/partdetail/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'partId': this.dataForm.partId,
                'partName': this.dataForm.partName,
                'partNumber': this.dataForm.partNumber,
                'type': this.dataForm.type,
                'imageUrl': this.dataForm.imageUrl,
                'purchaseName': this.dataForm.purchaseName,
                'purchaseTime': this.dataForm.purchaseTime,
                'userName': this.dataForm.userName,
                'userTime': this.dataForm.userTime,
              
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
