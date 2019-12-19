<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="机号" prop="machineNo">
      <el-input v-model="dataForm.machineNo" placeholder="机号"></el-input>
    </el-form-item>
    <el-form-item label="班次" prop="classNo">
      <el-input v-model="dataForm.classNo" placeholder="班次"></el-input>
    </el-form-item>
    <el-form-item label="吨数" prop="tunnage">
      <el-input v-model="dataForm.tunnage" placeholder="吨数"></el-input>
    </el-form-item>
    <el-form-item label="合计" prop="total">
      <el-input v-model="dataForm.total" placeholder="合计"></el-input>
    </el-form-item>
    <el-form-item label="总计" prop="account">
      <el-input v-model="dataForm.account" placeholder="总计"></el-input>
    </el-form-item>
    <el-form-item label="日期" prop="time">
      <el-input v-model="dataForm.time" placeholder="日期"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="创建者" prop="createUser">
      <el-input v-model="dataForm.createUser" placeholder="创建者"></el-input>
    </el-form-item>
    <el-form-item label="更新时间" prop="updateTime">
      <el-input v-model="dataForm.updateTime" placeholder="更新时间"></el-input>
    </el-form-item>
    <el-form-item label="更新者" prop="updateUser">
      <el-input v-model="dataForm.updateUser" placeholder="更新者"></el-input>
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
          machineNo: '',
          classNo: '',
          tunnage: '',
          total: '',
          account: '',
          time: '',
          createTime: '',
          createUser: '',
          updateTime: '',
          updateUser: ''
        },
        dataRule: {
          machineNo: [
            { required: true, message: '机号不能为空', trigger: 'blur' }
          ],
          classNo: [
            { required: true, message: '班次不能为空', trigger: 'blur' }
          ],
          tunnage: [
            { required: true, message: '吨数不能为空', trigger: 'blur' }
          ],
          total: [
            { required: true, message: '合计不能为空', trigger: 'blur' }
          ],
          account: [
            { required: true, message: '总计不能为空', trigger: 'blur' }
          ],
          time: [
            { required: true, message: '日期不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          createUser: [
            { required: true, message: '创建者不能为空', trigger: 'blur' }
          ],
          updateTime: [
            { required: true, message: '更新时间不能为空', trigger: 'blur' }
          ],
          updateUser: [
            { required: true, message: '更新者不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/product/monthproductcount/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.machineNo = data.monthproductcount.machineNo
                this.dataForm.classNo = data.monthproductcount.classNo
                this.dataForm.tunnage = data.monthproductcount.tunnage
                this.dataForm.total = data.monthproductcount.total
                this.dataForm.account = data.monthproductcount.account
                this.dataForm.time = data.monthproductcount.time
                this.dataForm.createTime = data.monthproductcount.createTime
                this.dataForm.createUser = data.monthproductcount.createUser
                this.dataForm.updateTime = data.monthproductcount.updateTime
                this.dataForm.updateUser = data.monthproductcount.updateUser
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
              url: this.$http.adornUrl(`/product/monthproductcount/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'machineNo': this.dataForm.machineNo,
                'classNo': this.dataForm.classNo,
                'tunnage': this.dataForm.tunnage,
                'total': this.dataForm.total,
                'account': this.dataForm.account,
                'time': this.dataForm.time,
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
