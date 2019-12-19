<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="辅料名称" prop="ingredientId">
      <el-input v-model="dataForm.ingredientId" placeholder="辅料名称"></el-input>
    </el-form-item>
    <el-form-item label="辅料合计" prop="ingredientNumber">
      <el-input v-model="dataForm.ingredientNumber" placeholder="辅料合计"></el-input>
    </el-form-item>
    <el-form-item label="吨数" prop="tunnage">
      <el-input v-model="dataForm.tunnage" placeholder="吨数"></el-input>
    </el-form-item>
    <el-form-item label="日期" prop="dayTime">
      <el-input v-model="dataForm.dayTime" placeholder="日期"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="creataTime">
      <el-input v-model="dataForm.creataTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="创建者" prop="creataUser">
      <el-input v-model="dataForm.creataUser" placeholder="创建者"></el-input>
    </el-form-item>
    <el-form-item label="更新者" prop="updateUser">
      <el-input v-model="dataForm.updateUser" placeholder="更新者"></el-input>
    </el-form-item>
    <el-form-item label="更新日期" prop="updateTime">
      <el-input v-model="dataForm.updateTime" placeholder="更新日期"></el-input>
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
          ingredientId: '',
          ingredientNumber: '',
          tunnage: '',
          dayTime: '',
          creataTime: '',
          creataUser: '',
          updateUser: '',
          updateTime: ''
        },
        dataRule: {
          ingredientId: [
            { required: true, message: '辅料名称不能为空', trigger: 'blur' }
          ],
          ingredientNumber: [
            { required: true, message: '辅料合计不能为空', trigger: 'blur' }
          ],
          tunnage: [
            { required: true, message: '吨数不能为空', trigger: 'blur' }
          ],
          dayTime: [
            { required: true, message: '日期不能为空', trigger: 'blur' }
          ],
          creataTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          creataUser: [
            { required: true, message: '创建者不能为空', trigger: 'blur' }
          ],
          updateUser: [
            { required: true, message: '更新者不能为空', trigger: 'blur' }
          ],
          updateTime: [
            { required: true, message: '更新日期不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/product/dayingredientcount/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.ingredientId = data.dayingredientcount.ingredientId
                this.dataForm.ingredientNumber = data.dayingredientcount.ingredientNumber
                this.dataForm.tunnage = data.dayingredientcount.tunnage
                this.dataForm.dayTime = data.dayingredientcount.dayTime
                this.dataForm.creataTime = data.dayingredientcount.creataTime
                this.dataForm.creataUser = data.dayingredientcount.creataUser
                this.dataForm.updateUser = data.dayingredientcount.updateUser
                this.dataForm.updateTime = data.dayingredientcount.updateTime
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
              url: this.$http.adornUrl(`/product/dayingredientcount/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'ingredientId': this.dataForm.ingredientId,
                'ingredientNumber': this.dataForm.ingredientNumber,
                'tunnage': this.dataForm.tunnage,
                'dayTime': this.dataForm.dayTime,
                'creataTime': this.dataForm.creataTime,
                'creataUser': this.dataForm.creataUser,
                'updateUser': this.dataForm.updateUser,
                'updateTime': this.dataForm.updateTime
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
