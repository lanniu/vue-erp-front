<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      ref="dataForm"
      :model="dynamicValidateForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="130px"
      class="demo-dynamic"
    >
      <div
        v-for="(product, index) in dynamicValidateForm.domains"
        :key="product.key"
        :prop="'product.' + index + '.value'"
        ref="domain"
      >
        <el-form-item :label="(index+1)+'、产品ID'" prop="productId">
          <el-select v-model="product.productId" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="danger" @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-form-item
          label="只数"
          :prop="'domains.'+index+'.zhiNumber'"
          :rules="[{ required: true, message: '请输入只数', trigger: 'blur' },  
          { type: 'number', message: '必须为数字值', trigger: ['blur','change']},
         ]"
        >
          <el-input
            v-model.number="product.zhiNumber"
            placeholder="只数"
            maxlength="10"
            style="width:200px"
          ></el-input>
          <el-tag type="primary">产品库存数量：123</el-tag>
        </el-form-item>
        <el-form-item label="纸箱数" prop="boxNumber">
          <el-input v-model="product.boxNumber" placeholder="纸箱数" style="width:200px"></el-input>
          <el-tag type="primary">纸箱库存数量：123</el-tag>
          <el-tag type="primary">纸箱库存数量：123</el-tag>
        </el-form-item>
      </div>

      <!-- <el-form-item>
          <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
    
          <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
      </el-form-item>-->
    </el-form>

    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="130px"
    >
      <!-- <el-form-item label="产品ID" prop="productId">
      <el-input v-model="dataForm.productId" placeholder="产品ID"></el-input>
    </el-form-item>
    <el-form-item label="只数" prop="zhiNumber">
      <el-input v-model="dataForm.zhiNumber" placeholder="只数"></el-input>
    </el-form-item>
    <el-form-item label="箱数" prop="boxNumber">
      <el-input v-model="dataForm.boxNumber" placeholder="箱数"></el-input>
    </el-form-item>
    <el-form-item label="出库数量" prop="outNumber">
      <el-input v-model="dataForm.outNumber" type="number" placeholder="出库数量"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>-->
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button type="success" @click="addDomain">新增产品</el-button>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        productId: "",
        zhiNumber: "",
        boxNumber: "",
        outNumber: "",
        remark: "",
        createTime: "",
        createUser: "",
        updateTime: "",
        updateUser: ""
      },
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value8: "",
      dynamicValidateForm: {
        domains: [
          {
            value: "",
            productId: "",
            zhiNumber: "",
            boxNumber: "",
            outNumber: "",
            remark: "",
            createTime: "",
            createUser: "",
            updateTime: "",
            updateUser: ""
          }
        ]
      },
      dataRule: {
        productId: [
          { required: true, message: "产品ID不能为空", trigger: "blur" }
        ],
        zhiNumber: [
          { required: true, message: "只数不能为空", trigger: "blur" },
          { type: "number", message: "只数只能为为数字值" }
        ],
        boxNumber: [
          { required: true, message: "箱数不能为空", trigger: "blur" },
          { type: "number", message: "箱数只能为数字值" }
        ],
        outNumber: [
          { required: true, message: "出库数量不能为空", trigger: "blur" },
          { type: "number", message: "箱数只能为数字值" }
        ]
      }
    };
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/product/productsellout/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.productId = data.productsellout.productId;
              this.dataForm.zhiNumber = data.productsellout.zhiNumber;
              this.dataForm.boxNumber = data.productsellout.boxNumber;
              this.dataForm.outNumber = data.productsellout.outNumber;
              this.dataForm.remark = data.productsellout.remark;
            }
          });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/product/productsellout/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              productId: this.dataForm.productId,
              zhiNumber: this.dataForm.zhiNumber,
              boxNumber: this.dataForm.boxNumber,
              outNumber: this.dataForm.outNumber,
              remark: this.dataForm.remark
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: "",
        key: Date.now()
      });
    }
  }
};
</script>
