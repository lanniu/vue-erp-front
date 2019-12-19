<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="员工编号" prop="employeNo">
      <el-input v-model="dataForm.employeNo" placeholder="员工编号"></el-input>
    </el-form-item>
    <el-form-item label="员工名称" prop="employeName">
      <el-input v-model="dataForm.employeName" placeholder="员工名称"></el-input>
    </el-form-item>
    <el-form-item label="部门" prop="departId">
      <el-input v-model="dataForm.departId" placeholder="部门"></el-input>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-input v-model="dataForm.status" placeholder="状态"></el-input>
    </el-form-item>
    <el-form-item label="创建者" prop="createUser">
      <el-input v-model="dataForm.createUser" placeholder="创建者"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="更新者" prop="updateUser">
      <el-input v-model="dataForm.updateUser" placeholder="更新者"></el-input>
    </el-form-item>
    <el-form-item label="更新时间" prop="updateTime">
      <el-input v-model="dataForm.updateTime" placeholder="更新时间"></el-input>
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
          employeNo: '',
          employeName: '',
          departId: '',
          status: '',
          createUser: '',
          createTime: '',
          updateUser: '',
          updateTime: ''
        },
        dataRule: {
          employeNo: [
            { required: true, message: '员工编号不能为空', trigger: 'blur' }
          ],
          employeName: [
            { required: true, message: '员工名称不能为空', trigger: 'blur' }
          ],
          departId: [
            { required: true, message: '部门不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
          ],
          createUser: [
            { required: true, message: '创建者不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          updateUser: [
            { required: true, message: '更新者不能为空', trigger: 'blur' }
          ],
          updateTime: [
            { required: true, message: '更新时间不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/product/employeinfo/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.employeNo = data.employeinfo.employeNo
                this.dataForm.employeName = data.employeinfo.employeName
                this.dataForm.departId = data.employeinfo.departId
                this.dataForm.status = data.employeinfo.status
                this.dataForm.createUser = data.employeinfo.createUser
                this.dataForm.createTime = data.employeinfo.createTime
                this.dataForm.updateUser = data.employeinfo.updateUser
                this.dataForm.updateTime = data.employeinfo.updateTime
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
              url: this.$http.adornUrl(`/product/employeinfo/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'employeNo': this.dataForm.employeNo,
                'employeName': this.dataForm.employeName,
                'departId': this.dataForm.departId,
                'status': this.dataForm.status,
                'createUser': this.dataForm.createUser,
                'createTime': this.dataForm.createTime,
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
