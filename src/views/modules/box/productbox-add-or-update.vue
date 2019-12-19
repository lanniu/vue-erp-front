<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="1150px"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="130px"
    >

    <el-form-item label="产品编号" prop="productId">
       <el-select v-model="dataForm.productId" filterable placeholder="请选择" clearable style="width:260px">
            <el-option
              v-for="item in productList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
      </el-form-item>

      <el-form-item label="纸箱编号" prop="boxNo">
        <el-input v-model="dataForm.boxNo" placeholder="纸箱编号" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="箱体尺寸" prop="body">
        <el-input v-model="dataForm.body" placeholder="箱体规格" style="width:260px">
          <template slot="append">规格</template>
        </el-input>
      </el-form-item>
      <el-form-item label="格挡尺寸" prop="parry">
        <el-input v-model="dataForm.parry" placeholder="格挡规格" style="width:260px">
          <template slot="append">规格</template>
        </el-input>
      </el-form-item>
      <el-form-item label="垫片尺寸" prop="spacer">
        <el-input v-model="dataForm.spacer" placeholder="垫片规格" style="width:260px">
          <template slot="append">规格</template>
        </el-input>
      </el-form-item>
       <el-form-item label="每箱只数" prop="zhiShu">
        <el-input v-model.number="dataForm.zhiShu" placeholder="只数" style="width:260px">
          <template slot="append">件</template>
        </el-input>
      </el-form-item>
      <el-form-item label="库存箱数" prop="boxNumber">
        <el-input v-model.number="dataForm.boxNumber" placeholder="库存箱数" style="width:260px">
          <template slot="append">件</template>
        </el-input>
      </el-form-item>
      <el-form-item label="纸箱批次" prop="costomer">
        <!-- <el-input v-model="dataForm.costomer" placeholder="客户" style="width:260px"> </el-input> -->
        <!-- <el-button type="success" style="margin-left:50px;margin-bommon:-30px" @click="addDomain">添加纸箱批次</el-button> -->

      </el-form-item>
      <template >
        <div v-for="(factory, index) in boxFactory"
        :key="index"
        :prop="'factory.' + index + '.value'"
        ref="domain">

       <el-form-item :label="(index+1)+'、厂家'" prop="factoryId">

          <el-select v-model="factory.factoryId" filterable placeholder="请选择">
            <el-option
              v-for="item in productBoxFactoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item  style="margin-left:250px;margin-top:-60px"
                  label="价格"
                  prop="boxPrice"
                >
          <el-input
            v-model.number="factory.boxPrice"
            placeholder="价格"
            maxlength="10"
            style="width:150px">
            <template slot="append">元</template>
          </el-input>

          </el-form-item>
          
           <el-form-item  style="margin-left:500px;margin-top:-60px"
                  label="批次"
                  prop="boxBatch"
                >
                 <el-date-picker style="width:260px"
          v-model="factory.boxBatch"
          type="date"
          placeholder="请选择纸箱批次(按照日期)"
          value-format="yyyy-MM-dd">
        </el-date-picker>
          <el-button type="danger" style="margin-left:10px;" v-if="index!='0'"   @click.prevent="removeDomain(index)">删除</el-button>  
          </el-form-item>
        </div>
  
      </template>
        <!-- <el-form-item label="纸箱价格" prop="boxPrice">
        <el-input v-model.number="dataForm.boxPrice" placeholder="纸箱价格" style="width:260px">
          <template slot="append">元</template>
        </el-input>
      </el-form-item> -->
      
      <el-form-item label="位置" prop="location">
        <el-input v-model="dataForm.location" placeholder="位置" style="width:260px"></el-input>
      </el-form-item>
      <el-form-item label="出库数量" prop="leaveNumber">
        <el-input v-model.number="dataForm.leaveNumber" placeholder=" 出库数量" style="width:260px">
          <template slot="append">件</template>
        </el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注" style="width:260px"></el-input>
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
  data() {
    return {
      visible: false,
       boxFactory:[{
          factoryId:'',
          boxBatch:'',
          boxPrice:'',
        }],
      productList:[],  
      productBoxFactoryList:[],
      dataForm: {
        id: 0,
        boxNo: "",
        body: "",
        parry: "",
        spacer: "",
        boxNumber: "",
        zhiShu:'',
        boxPrice:'',
        costomer: "",
        location: "",
        remark: "",
        createTime: "",
        createUser: "",
        updateTime: "",
        updateUser: "",
        status: "",
        boxFactoryVoStr: "",
        leaveNumber: "",
        productId:"",
      },
      dataRule: {
        boxNo: [
          { required: true, message: "纸箱编号不能为空", trigger: "blur" }
        ],
        body: [{ required: true, message: "箱体不能为空", trigger: "blur" }],
        parry: [{ required: true, message: "格挡不能为空", trigger: "blur" }],
        spacer: [{ required: true, message: "垫片不能为空", trigger: "blur" }],
        zhiShu: [{ required: true, message: "每箱只数不能为空", trigger: "blur" }],
       

        location: [{ required: true, message: "位置不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
       getProductList(){
      this.$http({
          url:this.$http.adornUrl(`/product/productinfo/getAllProductVoList`),
          method: "get"
      }).then(({data})=>{
        if(data &&data.code==0){
          this.productList=data.productList;
        }else {
              this.$message.error(data.msg);
         }
      })
    },
      getAllBoxFactoryList(){
            this.$http({
            url:this.$http.adornUrl(`/product/boxfactory/getAllBoxFactoryList`),
            method: "get"
        }).then(({data})=>{
          if(data &&data.code==0){
            this.productBoxFactoryList=data.productBoxFactoryList;
          }else {
              this.$message.error(data.msg);
          }
        })
      },
    init(id) {
      this.getAllBoxFactoryList();
      this.getProductList();
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/product/productbox/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.boxNo = data.productBox.boxNo;
              this.dataForm.body = data.productBox.body;
              this.dataForm.parry = data.productBox.parry;
              this.dataForm.spacer = data.productBox.spacer;
              this.dataForm.boxNumber = data.productBox.boxNumber;
              this.dataForm.zhiShu = data.productBox.zhiShu;
              this.dataForm.costomer = data.productBox.costomer;
              this.dataForm.location = data.productBox.location;
              this.dataForm.remark = data.productBox.remark;
              this.dataForm.leaveNumber = data.productBox.leaveNumber;
              this.dataForm.boxPrice = data.productBox.boxPrice;
              this.boxFactory= data.productBox.boxFactoryVoList;
              this.productId= data.productBox.productId;
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
              `/product/productbox/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              boxNo: this.dataForm.boxNo,
              body: this.dataForm.body,
              parry: this.dataForm.parry,
              spacer: this.dataForm.spacer,
              boxNumber: this.dataForm.boxNumber,
              zhiShu: this.dataForm.zhiShu,
              costomer: this.dataForm.costomer,
              location: this.dataForm.location,
              remark: this.dataForm.remark,
              createTime: this.dataForm.createTime,
              createUser: this.dataForm.createUser,
              updateTime: this.dataForm.updateTime,
              updateUser: this.dataForm.updateUser,
              status: this.dataForm.status,
              leaveNumber: this.dataForm.leaveNumber,
              boxPrice: this.dataForm.boxPrice,
              productId: this.dataForm.productId,
              boxFactoryVoStr: JSON.stringify(this.dataForm.boxFactoryVoStr)
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
     removeDomain(index) {
    //var index = this.dynamicValidateForm.domains.indexOf(item);
    if (index !== -1) {
      this.boxFactory.splice(index, 1);
    }
  },

    addDomain() {
    this.boxFactory.push({
          factoryId:'',
          boxBatch:'',
          boxPrice:'',
    });
  }
  }
};
</script>
