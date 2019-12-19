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
      label-width="150px"
    >
      <el-form-item label="产品id" prop="productId">
        <el-input v-model="dataForm.productId" placeholder="产品id"  style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="订单id" prop="orderId">
        <el-input v-model="dataForm.orderId" placeholder="订单id"  style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="产品实际需求数量" prop="productRequireNumber">
        <el-input v-model="dataForm.productRequireNumber" placeholder="产品实际需求数量"  style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="纸箱id" prop="boxId">
        <el-input v-model="dataForm.boxId" placeholder="纸箱id"></el-input>
      </el-form-item>
      <el-form-item label="纸箱实际需求数量" prop="boxRequireNumber">
        <el-input v-model="dataForm.boxRequireNumber" placeholder="纸箱实际需求数量"  style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="模具id" prop="modelId">
        <el-input v-model="dataForm.modelId" placeholder="模具id"  style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="准备模具数量" prop="modelRequireNumber">
        <el-input v-model="dataForm.modelRequireNumber" placeholder="准备模具数量"  style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="产品生产状态" prop="productStatus">
        <el-input v-model="dataForm.productStatus" placeholder="产品生产状态"  style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="订单的状态" prop="orderStatus">
        <el-input v-model="dataForm.orderStatus" placeholder="订单的状态"  style="width:260px"></el-input>
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
          productId: '',
          orderId: '',
          productRequireNumber: '',
          boxId: '',
          boxRequireNumber: '',
          modelId: '',
          modelRequireNumber: '',
          productStatus: '',
          orderStatus: '',
          createUser: '',
          createTime: '',
          updateUser: '',
          updateTime: '',
          status: ''
        },
        dataRule: {
          productId: [
            { required: true, message: '产品id不能为空', trigger: 'blur' }
          ],
          orderId: [
            { required: true, message: '订单id不能为空', trigger: 'blur' }
          ],
          productRequireNumber: [
            { required: true, message: '产品实际需求数量不能为空', trigger: 'blur' }
          ],
          boxId: [
            { required: true, message: '纸箱id不能为空', trigger: 'blur' }
          ],
          boxRequireNumber: [
            { required: true, message: '纸箱实际需求数量不能为空', trigger: 'blur' }
          ],
          modelId: [
            { required: true, message: '模具id不能为空', trigger: 'blur' }
          ],
          modelRequireNumber: [
            { required: true, message: '准备模具数量不能为空', trigger: 'blur' }
          ],
          productStatus: [
            { required: true, message: '产品生产状态不能为空', trigger: 'blur' }
          ],
          orderStatus: [
            { required: true, message: '订单的状态不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/product/productrequire/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.productId = data.productRequire.productId
                this.dataForm.orderId = data.productRequire.orderId
                this.dataForm.productRequireNumber = data.productRequire.productRequireNumber
                this.dataForm.boxId = data.productRequire.boxId
                this.dataForm.boxRequireNumber = data.productRequire.boxRequireNumber
                this.dataForm.modelId = data.productRequire.modelId
                this.dataForm.modelRequireNumber = data.productRequire.modelRequireNumber
                this.dataForm.productStatus = data.productRequire.productStatus
                this.dataForm.orderStatus = data.productRequire.orderStatus
                this.dataForm.createUser = data.productRequire.createUser
                this.dataForm.createTime = data.productRequire.createTime
                this.dataForm.updateUser = data.productRequire.updateUser
                this.dataForm.updateTime = data.productRequire.updateTime
                this.dataForm.status = data.productRequire.status
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
              url: this.$http.adornUrl(`/product/productrequire/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'productId': this.dataForm.productId,
                'orderId': this.dataForm.orderId,
                'productRequireNumber': this.dataForm.productRequireNumber,
                'boxId': this.dataForm.boxId,
                'boxRequireNumber': this.dataForm.boxRequireNumber,
                'modelId': this.dataForm.modelId,
                'modelRequireNumber': this.dataForm.modelRequireNumber,
                'productStatus': this.dataForm.productStatus,
                'orderStatus': this.dataForm.orderStatus,
                'createUser': this.dataForm.createUser,
                'createTime': this.dataForm.createTime,
                'updateUser': this.dataForm.updateUser,
                'updateTime': this.dataForm.updateTime,
                'status': this.dataForm.status
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
