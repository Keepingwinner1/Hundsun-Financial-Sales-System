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
    <h2>基金产品</h2>
      <div style="display: flex; align-items: center;">
        <h-form-item label="产品名称" style="margin-right: 10px;">
          <h-input v-model="formItem.inputProductName" placeholder="请输入产品名称"></h-input>
        </h-form-item>
        <h-form-item>
          <h-button type="ghost" @click="shareQuery">查询</h-button>
        </h-form-item>
      </div>
      <h-form-item label="基金份额">
        <h-select v-model="formItem.selectShareIndex" placeholder="请选择">
            <h-option v-for="(item, i) in sharesInfo" :key="i" :value="i">
            产品Id:{{ item.productId }}
            产品名称:{{ item.productName }}
            购入账户:{{ item.accountId }}
            银行名称:{{ item.accountName }}
            持有份额:{{ item.share }}
          </h-option>
        </h-select>
      </h-form-item>
    </h-form>

    <h-form :model="formItem" :label-width="80">
      <h2>交易信息</h2>
      <h-form-item label="赎回份额">
        <h-input v-model="formItem.inputShare" placeholder="请输入赎回份额"></h-input>
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
      <div>
        <p>客户姓名:{{this.customerInfo.name}}</p>
        <p>基金Id:{{this.sharesInfo[this.formItem.selectShareIndex].productId}}</p>
        <p>银行卡号:{{this.sharesInfo[this.formItem.selectShareIndex].accountId}}</p>
        <p>赎回份额:{{this.formItem.inputShare}}</p>
      </div>
    </h-msg-box>
    <h-msg-box
      v-model="showSuccessBox"
      :escClose="true"
      title="交易结果"
    >
      <p>流水单号：{{ this.swiftNo }}</p>.
      <p>交易信息：{{ this.returnMsg }}</p>
      <p slot="footer">
        <!-- slot内可以放任意自定义内容 -->
        <!-- 点击取消和确定按钮时可实现自己的业务逻辑 -->
        <h-button type="primary" @click="showSuccessBox = false" >继续赎回</h-button>
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
                inputShare:0,
                selectShareIndex:0,
            },
            customerInfo:{
              customerId:"",
              name:"",
              gender:"",
              contactInfo:"",
              riskLevel:"",
              accounts:[]
            },
            sharesInfo:[
                {
                    productId: "",
                    productName: "",
                    accountId: "",
                    accountName: "",
                    share: 0,
                },
            ],
            swiftNo:"",
            returnMsg:"",
            showConfirmBox:false,
            showSuccessBox:false,
        };
    },
    created() {
        // console.log("trade/Redeem")
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
            console.log(res)
            this.customerInfo = res.data;
            console.log(this.customerInfo)
        })
        .catch(() => {
          this.$hMessage.error({
            content: `查询${this.formItem.inputCustomerId}失败`,
            durtion: 3,
            closable: true,
          });
        });
    },
    shareQuery() {
        core
        .fetch({
          method: "get",
          url: `/api/tquery/fundshare?customerId=${this.formItem.inputCustomerId}&productName=${this.formItem.inputProductName}`,
        })
        .then((res) => {
            console.log(res)
            this.returnMsg = res.msg;
            this.sharesInfo = res.data;
        })
        .catch(() => {
          this.$hMessage.error({
            content: `查询${this.formItem.inputProductName}失败`,
            durtion: 3,
            closable: true,
          });
        });
    },
      finalSubmit() {
        console.log("finalSubmit")
        core
        .fetch({
          method: "post",
          url: `/api/ttrade/redeem?accountId=${this.sharesInfo[this.formItem.selectShareIndex].accountId}&productId=${this.sharesInfo[this.formItem.selectShareIndex].productId}&share=${this.formItem.inputShare}&customerId=${this.customerInfo.customerId}`,
        })
        .then((res) => {
            console.log(res)
            this.showSuccessBox = true;
            this.swiftNo = res.data.swiftNo
        })
        .catch(() => {
          this.showSuccessBox = true;
          this.$hMessage.error({
            content: `赎回失败`,
            durtion: 3,
            closable: true,
          });
        });
        },
    },
    beforeDestroy() {
    },
};
</script>

<style lang="less" scoped>
  
</style>