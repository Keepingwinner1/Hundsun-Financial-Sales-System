<template>
    <div>
    <h-form :model="formItem" :label-width="80">
      <h2>撤单</h2>
      <div style="display: flex; align-items: center;">
        <h-form-item label="身份证号" style="margin-right: 10px;">
          <h-input v-model="formItem.inputCustomerId" placeholder="请输入客户身份证号"></h-input>
        </h-form-item>
        <h-form-item>
          <h-button type="ghost" @click="tradeQuery">查询</h-button>
        </h-form-item>
      </div>

      <h2>交易信息</h2>
      <h-form-item label="今日交易">
       <h-select v-model="formItem.swiftNo" placeholder="请选择">
            <h-option v-for="item in tradeInfo" :key="item.swiftNo" :value="item.swiftNo">
                交易类型:{{item.tradeType}}
                交易时间:{{item.timeStamp}}
                交易账户:{{item.accountId}}
                银行名称:{{item.accountName}}
                产品Id:{{item.productId}}
                产品名称:{{item.productName}}
                交易份额或金额:{{item.amount}}
            </h-option>
        </h-select>
      </h-form-item>
      <h-form-item>
        <h-button type="primary" @click="showConfirmBox = true">撤单</h-button>
      </h-form-item>
    </h-form>

    <h-msg-box
      v-model="showConfirmBox"
      :escClose="true"
      title="确认撤单？"
      @on-ok="finalSubmit"
    >
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
                swiftNo:"",
            },
            tradeInfo:[],
            showConfirmBox:false,
        };
    },
    created() {
        // console.log("trade/Cancellation")  
    },
    methods: {
        tradeQuery(){
            const now = new Date();
            const year = now.getFullYear();
            const month = ('0' + (now.getMonth() + 1)).slice(-2);
            const day = ('0' + now.getDate()).slice(-2);
            const formattedTime = year + month + day;
            const startTime = parseInt(formattedTime+"000000");
            const endTime = parseInt(year + month + day + "235959");

            core
            .fetch({
            method: "get",
            url: `/api/tquery/trade?customerId=${this.formItem.inputCustomerId}&startTime=${startTime}&endTime=${endTime}`,
            })
            .then((res) => {
                console.log(res)
                this.tradeInfo = res.data;
            })
            .catch(() => {
            this.$hMessage.error({
                content: `查询${this.formItem.inputCustomerId}失败`,
                durtion: 3,
                closable: true,
            });
            });
        },
        finalSubmit(){          
            core
            .fetch({
            method: "post",
            url: `/api/ttrade/cancelorder?swiftNo=${this.formItem.swiftNo}`,
            })
            .then((res) => {
                this.$hMessage.success({
                content: `撤单成功`,
                durtion: 3,
                closable: true,
            });
            })
            .catch(() => {
            this.$hMessage.error({
                content: `撤单失败`,
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