<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="仓库号" prop="warehouseId">
      <el-input v-model="dataForm.warehouseId" placeholder="仓库号"></el-input>
    </el-form-item>
    <el-form-item label="架号" prop="shelfNo">
      <el-input v-model="dataForm.shelfNo" placeholder="架号"></el-input>
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
          warehouseId: '',
          shelfNo: '',
          isEmpty: '',
          createTime: '',
          createUser: '',
          updateUser: '',
          updataTime: ''
        },
        dataRule: {
          warehouseId: [
            { required: true, message: '仓库号不能为空', trigger: 'blur' }
          ],
          shelfNo: [
            { required: true, message: '架号不能为空', trigger: 'blur' }
          ],
          isEmpty: [
            { required: true, message: '是否有货不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          createUser: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          updateUser: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          updataTime: [
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
              url: this.$http.adornUrl(`/product/modelshelf/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.warehouseId = data.modelShelf.warehouseId    
                this.dataForm.shelfNo = data.modelshelf.shelfNo
                this.dataForm.isEmpty = data.modelshelf.isEmpty
                this.dataForm.createTime = data.modelshelf.createTime
                this.dataForm.createUser = data.modelshelf.createUser
                this.dataForm.updateUser = data.modelshelf.updateUser
                this.dataForm.updataTime = data.modelshelf.updataTime
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
              url: this.$http.adornUrl(`/product/modelshelf/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'warehouseId': this.dataForm.warehouseId,
                'shelfNo': this.dataForm.shelfNo,
                'isEmpty': this.dataForm.isEmpty,
                'createTime': this.dataForm.createTime,
                'createUser': this.dataForm.createUser,
                'updateUser': this.dataForm.updateUser,
                'updataTime': this.dataForm.updataTime
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
