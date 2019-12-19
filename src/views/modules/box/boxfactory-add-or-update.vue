<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="130px">
    <el-form-item label="厂家名字" prop="factoryName">
      <el-input v-model="dataForm.factoryName" placeholder="厂家名字"  style="width:260px"></el-input>
    </el-form-item>
    <el-form-item label="负责人" prop="principal">
      <el-input v-model="dataForm.principal" placeholder="负责人"  style="width:260px"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="telephone">
      <el-input v-model="dataForm.telephone" placeholder="手机号"  style="width:260px"></el-input>
    </el-form-item>
    <el-form-item label="电话" prop="phone">
      <el-input v-model="dataForm.phone" placeholder="电话"  style="width:260px"></el-input>
    </el-form-item>
    <el-form-item label="备注"  >
      <el-input type="textarea" v-model="dataForm.remark" placeholder="备注" style="width:260px" ></el-input>
    </el-form-item>



    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          factoryName: '',
          principal: '',
          telephone: '',
          phone: '',
          remark: '',

        },
        dataRule: {
          factoryName: [
            { required: true, message: '厂家名字不能为空', trigger: 'blur' }
          ],
          principal: [
            { required: true, message: '负责人不能为空', trigger: 'blur' }
          ],
          telephone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' }
          ],

        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/product/boxfactory/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.factoryName = data.boxFactory.factoryName
                this.dataForm.principal   = data.boxFactory.principal
                this.dataForm.telephone   = data.boxFactory.telephone
                this.dataForm.phone       = data.boxFactory.phone
                this.dataForm.remark      = data.boxFactory.remark
                this.dataForm.status      = data.boxFactory.status
                this.dataForm.createUser  = data.boxFactory.createUser
                this.dataForm.createTime  = data.boxFactory.createTime
                this.dataForm.updateUser  = data.boxFactory.updateUser
                this.dataForm.updateTime  = data.boxFactory.updateTime
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
              url: this.$http.adornUrl(`/product/boxfactory/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id'         : this.dataForm.id || undefined,
                'factoryName': this.dataForm.factoryName,
                'principal'  : this.dataForm.principal,
                'telephone'  : this.dataForm.telephone,
                'phone'      : this.dataForm.phone,
                'remark'     : this.dataForm.remark,
                'status'     : this.dataForm.status,
                'createUser' : this.dataForm.createUser,
                'createTime' : this.dataForm.createTime,
                'updateUser' : this.dataForm.updateUser,
                'updateTime' : this.dataForm.updateTime
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
      }
    }
  }
</script>
