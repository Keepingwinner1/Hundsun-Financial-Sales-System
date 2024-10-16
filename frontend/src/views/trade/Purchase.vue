<template>
    <div>  
    <h-form :model="formItem" :label-width="80">

      <h2>客户信息</h2>
      <div style="display: flex; align-items: center;">
        <h-form-item label="身份证号" style="margin-right: 10px;">
          <h-input v-model="formItem.inputCustomerId" placeholder="请输入客户身份证号"></h-input>
        </h-form-item>
        <h-form-item>
          <h-button type="ghost" @click="customerQuery">查询</h-button>
        </h-form-item>
      </div>
    
      <div style="display: flex; align-items: center;">
        <h-form-item label="客户姓名">
          <h-input v-model="customerInfo.name" disabled="disabled"></h-input>
        </h-form-item>
        <h-form-item label="客户性别">
          <h-input v-model="customerInfo.gender" disabled="disabled"></h-input>
        </h-form-item>
      </div>
      <div style="display: flex; align-items: center;">
        <h-form-item label="联系方式">
          <h-input v-model="customerInfo.contactInfo" disabled="disabled"></h-input>
        </h-form-item>
        <h-form-item label="风险等级">
          <h-input v-model="customerInfo.riskLevel" disabled="disabled"></h-input>
        </h-form-item>
      </div>
    </h-form>

    <h-form :model="formItem" :label-width="80">
      <h2>账户信息</h2>
      <h-form-item label="交易账户">
        <h-select v-model="formItem.selectAccount" placeholder="请选择">
          <h-option  v-for="item in accountInfo" :key="item.accountId" :value="item.accountId">
            银行卡号:{{ item.accountId }}
            银行名称:{{ item.bankName }}
            余额:{{item.balance}}
          </h-option>
        </h-select>
      </h-form-item>

      <h2>基金产品</h2>
      <div style="display: flex; align-items: center;">
        <h-form-item label="产品名称" style="margin-right: 10px;">
          <h-input v-model="formItem.inputProductName" placeholder="请输入产品名称"></h-input>
        </h-form-item>
        <h-form-item>
          <h-button type="ghost" @click="productQuery">查询</h-button>
        </h-form-item>
      </div>
      <h-form-item label="基金产品">
        <h-select v-model="formItem.selectProduct" placeholder="请选择">
          <h-option v-for="item in productInfo" :key="item.productId" :value="item.productId">
            产品Id:{{ item.productId }}
            产品名称:{{ item.productName }}
            产品类型:{{ item.productType }}
            风险等级:{{ item.riskLevel }}
          </h-option>
        </h-select>
      </h-form-item>

      <h2>交易信息</h2>
      <h-form-item label="申购金额">
        <h-input v-model="formItem.inputMoney" placeholder="请输入申购金额"></h-input>
      </h-form-item>
      <h-form-item>
        <h-button type="primary" @click="showConfirmBox = true">提交</h-button>
        <!-- <h-button type="ghost" style="margin-left: 8px;">取消</h-button> -->
      </h-form-item>
    </h-form>
    <h-msg-box
      v-model="showConfirmBox"
      :escClose="true"
      title="确认交易信息"
      @on-ok="finalSubmit"
    >
      <p>客户姓名:{{this.customerInfo.name}}</p>
      <p>基金Id:{{this.formItem.selectProduct}}</p>
      <p>银行卡号:{{this.formItem.selectAccount}}</p>
      <p>申购金额:{{this.formItem.inputMoney}}</p>
    </h-msg-box>

    <h-msg-box
      v-model="showSuccessBox"
      :escClose="false"
      title="交易结果"
    >
      <p>流水单号：{{ this.swiftNo }}</p>.
      <p>交易信息：{{ this.returnMsg }}</p>
      <p slot="footer">
        <!-- slot内可以放任意自定义内容 -->
        <!-- 点击取消和确定按钮时可实现自己的业务逻辑 -->
        <h-button type="primary" @click="showSuccessBox = false">继续申购</h-button>
        <h-button @click="showSuccessBox = false">打印凭证</h-button>
      </p>
    </h-msg-box>
  </div>
</template>

<script>
import core from "@hsui/core";

export default {
    data() {
        return {
            formItem: {
              inputCustomerId:"",
              inputProductName:"",
              inputMoney: 0,
              selectAccount:"",
              selectProduct:"",
            },
            // 客户信息
            customerInfo:{
              customerId:"",
              name:"",
              gender:"",
              contactInfo:"",
              riskLevel:"",
              accounts:[]
            },
            // 查到的账户信息
            accountInfo:[],
            // 查到的产品信息
            productInfo:[],
            // 最终提交信息 
            submitInfo:{
              customerId:"",
              accountId:"",
              productId:"",
              money: 11.2
            },
            // 弹框显示变量
            showConfirmBox: false,
            showSuccessBox: false,
            swiftNo:"",
            returnMsg:""
        };
    },
    created() {
        // console.log("trade/Purchase")
    },
    methods: {
      customerQuery(){
        console.log("customerQuery")
        core
        .fetch({
          method: "get",
          url: `/api/taccount/query?customerId=${this.formItem.inputCustomerId}`,
        })
        .then((res) => {
            console.log(res.data)
            this.customerInfo = res.data;
            this.accountInfo = res.data.accounts;
        })
        .catch(() => {
          this.$hMessage.error({
            content: `查询${this.formItem.inputCustomerId}失败`,
            durtion: 3,
            closable: true,
          });
        });
        
      },
      productQuery(){
        console.log("productQuery")
        console.log(this.formItem.selectAccount)
        core
        .fetch({
          method: "get",
          url: `/api/tproduct/select?productName=${this.formItem.inputProductName}`,
        })
        .then((res) => {
            console.log(res)
            this.productInfo = res.data;
            console.log(this.customerInfo)
        })
        .catch(() => {
          this.$hMessage.error({
            content: `查询${this.formItem.inputProductName}失败`,
            durtion: 3,
            closable: true,
          });
        });
      },
      finalSubmit(){
        console.log("finalSubmit")
        core
        .fetch({
          method: "post",
          url: `/api/ttrade/subscribe?accountId=${this.formItem.selectAccount}&productId=${this.formItem.selectProduct}&money=${this.formItem.inputMoney}&customerId=${this.customerInfo.customerId}`,
        })
        .then((res) => {
            console.log(res)
            this.showSuccessBox = true;
            this.swiftNo = res.data.swiftNo
            this.returnMsg = res.msg
        })
        .catch(() => {
          this.$hMessage.error({
            content: `申购失败`,
            durtion: 3,
            closable: true,
          });
        });
      }
    },
    beforeDestroy() {
    },
};
</script>

<style lang="less" scoped>
  
</style>