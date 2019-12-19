<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="订单id" prop="orderDetailId">
      <el-input v-model="dataForm.orderDetailId" placeholder="订单id"></el-input>
    </el-form-item>
    <el-form-item label="人员id" prop="userId">
      <el-input v-model="dataForm.userId" placeholder="人员id"></el-input>
    </el-form-item>
    <el-form-item label="消息状态" prop="isRead">
      <el-input v-model="dataForm.isRead" placeholder="消息状态"></el-input>
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
          orderDetailId: '',
          userId: '',
          isRead: '',
          createTime: '',
          createUser: '',
          updateTime: '',
          updateUser: ''
        },
        dataRule: {
          orderDetailId: [
            { required: true, message: '订单id不能为空', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '人员id不能为空', trigger: 'blur' }
          ],
          isRead: [
            { required: true, message: '消息状态不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          createUser: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          updateTime: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          updateUser: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
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
              url: this.$http.adornUrl(`/product/ordermessage/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.orderDetailId = data.ordermessage.orderDetailId
                this.dataForm.userId = data.ordermessage.userId
                this.dataForm.isRead = data.ordermessage.isRead
                this.dataForm.createTime = data.ordermessage.createTime
                this.dataForm.createUser = data.ordermessage.createUser
                this.dataForm.updateTime = data.ordermessage.updateTime
                this.dataForm.updateUser = data.ordermessage.updateUser
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
              url: this.$http.adornUrl(`/product/ordermessage/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'orderDetailId': this.dataForm.orderDetailId,
                'userId': this.dataForm.userId,
                'isRead': this.dataForm.isRead,
                'createTime': this.dataForm.createTime,
                'createUser': this.dataForm.createUser,
                'updateTime': this.dataForm.updateTime,
                'updateUser': this.dataForm.updateUser
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
