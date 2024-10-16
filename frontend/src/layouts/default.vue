<!--
 * @Author: liuhf35610 liuhf35610@hundsun.com
 * @Date: 2022-07-04 18:28:24
 * @LastEditors: liuhf35610 liuhf35610@hundsun.com
 * @LastEditTime: 2022-07-08 01:32:38
 * @FilePath: \code\day02-manage-platform\client\src\layouts\default.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="layout">
    <h-row name="flex" style="background-color: #43a7fd;height: 40px;">
      <h-col span="18">
        <h2 style="margin-left: 3%; margin-top: 5px;color:aliceblue">
          理财销售交易系统
        </h2>
      </h-col>
      <h-col span="6">
        <div style="margin-left: 50%; margin-top: 3px;">
          <div>
            <h-button v-if="!islogin" type="primary" @click="islogin=true">登录</h-button>
          </div>
          <div style="display: flex; align-items: center;">
            <h3 v-if="islogin" style="margin-right: 5px;">你好 user10000</h3>
            <h-button v-if="islogin" type="primary" @click="islogin=false">退出</h-button>
          </div>
        </div>
      </h-col>
    </h-row>

    <h-row name="flex">
      <h-col span="4" class="layout-menu-left">
        <h-menu active-name="1-2" theme="dark" width="auto" :open-names="['1']">
          <div class="layout-logo-left"></div>
          <h-menu-item name="home">
            <router-link to="/home">首页</router-link>
          </h-menu-item>
          <h-submenu name="product">
            <template v-slot:title>
              <h-icon name="social-buffer"></h-icon>
              产品管理
            </template>
            <h-menu-item name="product-1">
              <router-link to="/product">基金产品</router-link>
            </h-menu-item>
            <h-menu-item name="product-2">
              <router-link to="/product-example">基金产品-示例</router-link>
            </h-menu-item>
          </h-submenu>
          <h-submenu name="customer">
            <template v-slot:title>
              <h-icon name="person-stalker"></h-icon>
              客户管理
            </template>
            <h-menu-item name="customer-1">
              <router-link to="/customer/Create">开户</router-link>
            </h-menu-item>
            <h-menu-item name="customer-2">
              <router-link to="/customer/RiskTest">风险测评</router-link>
            </h-menu-item>
            <h-menu-item name="customer-3">
              <router-link to="/customer/BankCard">银行卡管理</router-link>
            </h-menu-item>
            <h-menu-item name="customer-4">
              <router-link to="/customer/CustomerInfo">客户信息查询</router-link>
            </h-menu-item>
          </h-submenu>
          <h-submenu name="trade">
            <template v-slot:title>
              <h-icon name="social-usd"></h-icon>
              交易管理
            </template>
            <h-menu-item name="trade-1">
              <router-link to="/trade/Purchase">申购</router-link>
            </h-menu-item>
            <h-menu-item name="trade-2">
              <router-link to="/trade/Redeem">赎回</router-link>
            </h-menu-item>
            <h-menu-item name="trade-3">
              <router-link to="/trade/Cancellation">撤单</router-link>
            </h-menu-item>
          </h-submenu>
          <h-submenu name="clear">
            <template v-slot:title>
              <h-icon name="clock_fill"></h-icon>
              日结清算
            </template>
            <h-menu-item name="clear-1">
              <router-link to="/clear">清算</router-link>
            </h-menu-item>
          </h-submenu>
          <h-submenu name="query">
            <template v-slot:title>
              <h-icon name="stealth_fill"></h-icon>
              业务查询
            </template>
            <h-menu-item name="query-1">
              <router-link to="/query/TradeQuery">交易查询</router-link>
            </h-menu-item>
            <h-menu-item name="query-2">
              <router-link to="/query/BankQuery">银行卡流水查询</router-link>
            </h-menu-item>
            <h-menu-item name="query-3">
              <router-link to="/query/ShareQuery">基金持有份额查询</router-link>
            </h-menu-item>
          </h-submenu>
        </h-menu>
      </h-col>
      <h-col span="19">
        <div class="layout-content">
          <div class="layout-content-main">
            <router-view />
          </div>
        </div>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import logo from "@/assets/logo.png";
export default {  
  data() {
    return {
      logo,
      islogin: true,
    };
  },
  method: {

  }
};
</script>

<style lang="less">
.h-menu-vertical {
  height: 100vh;
}

.h-menu-item-active {
  > a {
    color: #fff;
  }
}

.layout-content {
  height: calc(100vh - 30px);
}

.layout-content-main {
  padding: 24px;
}

.layout-footer {
  text-align: center;
  height: 30px;
}
</style>