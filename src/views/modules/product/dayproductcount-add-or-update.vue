<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="机器名称" prop="machineName">
      <el-input v-model="dataForm.machineName" placeholder="机器名称"></el-input>
    </el-form-item>
    <el-form-item label="班别" prop="classNo">
      <el-input v-model="dataForm.classNo" placeholder="班别"></el-input>
    </el-form-item>
    <el-form-item label="机号" prop="machineNo">
      <el-input v-model="dataForm.machineNo" placeholder="机号"></el-input>
    </el-form-item>
    <el-form-item label="产品名称" prop="productId">
      <el-input v-model="dataForm.productId" placeholder="产品名称"></el-input>
    </el-form-item>
    <el-form-item label="箱只" prop="boxPieceNumber">
      <el-input v-model="dataForm.boxPieceNumber" placeholder="箱只"></el-input>
    </el-form-item>
    <el-form-item label="入库箱数" prop="inStorageBoxNumber">
      <el-input v-model="dataForm.inStorageBoxNumber" placeholder="入库箱数"></el-input>
    </el-form-item>
    <el-form-item label="入库总只数" prop="inSotrageProductNumber">
      <el-input v-model="dataForm.inSotrageProductNumber" placeholder="入库总只数"></el-input>
    </el-form-item>
    <el-form-item label="产品单只重量" prop="singleWeight">
      <el-input v-model="dataForm.singleWeight" placeholder="产品单只重量"></el-input>
    </el-form-item>
    <el-form-item label="总重量" prop="countWeight">
      <el-input v-model="dataForm.countWeight" placeholder="总重量"></el-input>
    </el-form-item>
    <el-form-item label="分计" prop="dividingWeight">
      <el-input v-model="dataForm.dividingWeight" placeholder="分计"></el-input>
    </el-form-item>
    <el-form-item label="滴料" prop="dripLiquid">
      <el-input v-model="dataForm.dripLiquid" placeholder="滴料"></el-input>
    </el-form-item>
    <el-form-item label="时间" prop="timeNumber">
      <el-input v-model="dataForm.timeNumber" placeholder="时间"></el-input>
    </el-form-item>
    <el-form-item label="成品率" prop="successRate">
      <el-input v-model="dataForm.successRate" placeholder="成品率"></el-input>
    </el-form-item>
    <el-form-item label="生产日期" prop="productTime">
      <el-input v-model="dataForm.productTime" placeholder="生产日期"></el-input>
    </el-form-item>
    <el-form-item label="创建日期" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建日期"></el-input>
    </el-form-item>
    <el-form-item label="创建人员" prop="createUser">
      <el-input v-model="dataForm.createUser" placeholder="创建人员"></el-input>
    </el-form-item>
    <el-form-item label="更新人员" prop="updateUser">
      <el-input v-model="dataForm.updateUser" placeholder="更新人员"></el-input>
    </el-form-item>
    <el-form-item label="更新时间" prop="updateTime">
      <el-input v-model="dataForm.updateTime" placeholder="更新时间"></el-input>
    </el-form-item>
    <el-form-item label="员工编号" prop="employeId">
      <el-input v-model="dataForm.employeId" placeholder="员工编号"></el-input>
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
          machineName: '',
          classNo: '',
          machineNo: '',
          productId: '',
          boxPieceNumber: '',
          inStorageBoxNumber: '',
          inSotrageProductNumber: '',
          singleWeight: '',
          countWeight: '',
          dividingWeight: '',
          dripLiquid: '',
          timeNumber: '',
          successRate: '',
          productTime: '',
          createTime: '',
          createUser: '',
          updateUser: '',
          updateTime: '',
          employeId: ''
        },
        dataRule: {
          machineName: [
            { required: true, message: '机器名称不能为空', trigger: 'blur' }
          ],
          classNo: [
            { required: true, message: '班别不能为空', trigger: 'blur' }
          ],
          machineNo: [
            { required: true, message: '机号不能为空', trigger: 'blur' }
          ],
          productId: [
            { required: true, message: '产品名称不能为空', trigger: 'blur' }
          ],
          boxPieceNumber: [
            { required: true, message: '箱只不能为空', trigger: 'blur' }
          ],
          inStorageBoxNumber: [
            { required: true, message: '入库箱数不能为空', trigger: 'blur' }
          ],
          inSotrageProductNumber: [
            { required: true, message: '入库总只数不能为空', trigger: 'blur' }
          ],
          singleWeight: [
            { required: true, message: '产品单只重量不能为空', trigger: 'blur' }
          ],
          countWeight: [
            { required: true, message: '总重量不能为空', trigger: 'blur' }
          ],
          dividingWeight: [
            { required: true, message: '分计不能为空', trigger: 'blur' }
          ],
          dripLiquid: [
            { required: true, message: '滴料不能为空', trigger: 'blur' }
          ],
          timeNumber: [
            { required: true, message: '时间不能为空', trigger: 'blur' }
          ],
          successRate: [
            { required: true, message: '成品率不能为空', trigger: 'blur' }
          ],
          productTime: [
            { required: true, message: '生产日期不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建日期不能为空', trigger: 'blur' }
          ],
          createUser: [
            { required: true, message: '创建人员不能为空', trigger: 'blur' }
          ],
          updateUser: [
            { required: true, message: '更新人员不能为空', trigger: 'blur' }
          ],
          updateTime: [
            { required: true, message: '更新时间不能为空', trigger: 'blur' }
          ],
          employeId: [
            { required: true, message: '员工编号不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/product/dayproductcount/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.machineName = data.dayproductcount.machineName
                this.dataForm.classNo = data.dayproductcount.classNo
                this.dataForm.machineNo = data.dayproductcount.machineNo
                this.dataForm.productId = data.dayproductcount.productId
                this.dataForm.boxPieceNumber = data.dayproductcount.boxPieceNumber
                this.dataForm.inStorageBoxNumber = data.dayproductcount.inStorageBoxNumber
                this.dataForm.inSotrageProductNumber = data.dayproductcount.inSotrageProductNumber
                this.dataForm.singleWeight = data.dayproductcount.singleWeight
                this.dataForm.countWeight = data.dayproductcount.countWeight
                this.dataForm.dividingWeight = data.dayproductcount.dividingWeight
                this.dataForm.dripLiquid = data.dayproductcount.dripLiquid
                this.dataForm.timeNumber = data.dayproductcount.timeNumber
                this.dataForm.successRate = data.dayproductcount.successRate
                this.dataForm.productTime = data.dayproductcount.productTime
                this.dataForm.createTime = data.dayproductcount.createTime
                this.dataForm.createUser = data.dayproductcount.createUser
                this.dataForm.updateUser = data.dayproductcount.updateUser
                this.dataForm.updateTime = data.dayproductcount.updateTime
                this.dataForm.employeId = data.dayproductcount.employeId
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
              url: this.$http.adornUrl(`/product/dayproductcount/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'machineName': this.dataForm.machineName,
                'classNo': this.dataForm.classNo,
                'machineNo': this.dataForm.machineNo,
                'productId': this.dataForm.productId,
                'boxPieceNumber': this.dataForm.boxPieceNumber,
                'inStorageBoxNumber': this.dataForm.inStorageBoxNumber,
                'inSotrageProductNumber': this.dataForm.inSotrageProductNumber,
                'singleWeight': this.dataForm.singleWeight,
                'countWeight': this.dataForm.countWeight,
                'dividingWeight': this.dataForm.dividingWeight,
                'dripLiquid': this.dataForm.dripLiquid,
                'timeNumber': this.dataForm.timeNumber,
                'successRate': this.dataForm.successRate,
                'productTime': this.dataForm.productTime,
                'createTime': this.dataForm.createTime,
                'createUser': this.dataForm.createUser,
                'updateUser': this.dataForm.updateUser,
                'updateTime': this.dataForm.updateTime,
                'employeId': this.dataForm.employeId
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
