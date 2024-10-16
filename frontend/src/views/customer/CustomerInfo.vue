<template>
    <div class="container">
    <!-- 用户查询功能 -->
      <h1>用户查询</h1>
      <div class="search-form">
        <h-input
          type="text"
          v-model="searchQuery"
          placeholder="请输入用户ID"
          class="search-input"
        />
        <h-button type="submit" @click ="searchCustomer" >搜索</h-button>
      </div>
      <br/>
    <!--客户信息展示  -->
    <div>
        <h-table :data="users" :loading="userLoading" :columns ="userColumns" height="300" style="width: 100%">
        </h-table>
    </div>
    <br/>

    <!-- 具体查询结果展示 -->
    <h1>客户详情</h1>
    <br/>
    <h2>已添加的银行卡</h2>
    <h-button class="btn btn-success" :disabled="isDisabled" @click="showModal = true">添加银行卡</h-button>
    <br/>
    <br/>
    <div class="cards-container">
      <div v-if="selectedCustomer && bankAccounts.length > 0">
        <div class="card" v-for="(account, index) in bankAccounts" :key="index">
        <div class="card-body">
          <p><strong>银行卡号:</strong> {{ account.accountId }}</p>
          <p><strong>银行名称:</strong> {{ account.bankName }}</p>
          <p><strong>账户余额:</strong> ¥{{ account.balance}}</p>
          <h-button class="btn btn-info" @click="openRechargeModal(index)">选择充值</h-button>
        </div>
        </div>
      </div>
      <div v-else-if="selectedCustomer">
        <p>当前用户暂无银行卡信息。</p>
      </div>
    </div>

     <!-- 添加银行卡弹窗 -->
      <h-msg-box v-model="showModal" width="800">
        <h3>添加银行卡</h3>
        <h-form >
          <div class="form-group">
            <h-label for="cardNumber">银行卡号:</h-label>
            <h-input type="text" v-model="newAccount.accountId" class="form-control" required />
          </div>
          <div class="form-group">
            <h-label for="bankName">银行名称:</h-label>
            <h-input type="text" v-model="newAccount.bankName" class="form-control" required />
          </div>
          <div class="form-group">
            <h-label for="cardHolder">开户人:</h-label>
            <h-input type="text" v-model="newAccount.cardHolder" class="form-control" required />
          </div>
        </h-form>
        <div slot="footer">
          <h-button @click="closeModal">取消</h-button>
          <h-button type="primary" @click="addBankAccount">确定</h-button>
        </div>
    </h-msg-box>
  
      <!-- 账户充值弹窗 -->
      <h-msg-box v-model="isModalOpen" width="400">
        <h3>账户充值</h3>
        <h-form >
          <p v-if="bankAccounts.length > 0 && selectedAccount < bankAccounts.length">
            当前选择的银行卡号: <strong>{{ bankAccounts[selectedAccount].accountId }}</strong>
          </p>
          <p v-else>
            暂无可选择的银行卡
          </p>
          <h-label for="amount">充值金额:</h-label>
          <h-input type="number" v-model="rechargeAmount" required />
        </h-form>
        <div slot="footer">
          <h-button @click="closeRechargeModal">取消</h-button>
          <h-button type="primary" @click="rechargeAccount">充值</h-button>
        </div>
    </h-msg-box>

    </div>
  </template>
  
  <script>
import core from "@hsui/core";
  
  export default {
    data() {
      return {
        isDisabled: true, // 默认初始状态为禁用
        userLoading:false,
        users:[],
        userColumns: [
          {
            title: '客户ID',
            key: 'customerId',
          },
          {
            title: '姓名',
            key: 'name',
          },
          {
            title: '性别',
            key: 'gender',
          },
          {
            title: '风险等级',
            key: 'riskLevel',
          },
          {
            title: '联系方式',
            key: 'contactInfo',
          },
        ],
        customerId: '',
        bankAccounts: [], // 已添加的银行卡账户列表
        newAccount: { // 新添加的银行卡信息
          accountId: "",
          bankName: "",
          balance: 0,
        },
        selectedCustomer: {
            customerId:"-1",
            name:"",
            gender:"",
            contactInfo:"",
            riskLevel:null,
        }, // 当前查询的客户信息
        searchQuery: "", //搜索输入
        selectedAccount: 0, // 当前选择充值的银行卡
        rechargeAmount: 0, // 充值金额
        isModalOpen: false, // 控制弹窗显示的状态
        showModal: false, // 控制添加银行卡弹窗显示的状态
      };
    },
    methods: {
    // 加载用户列表
    loadUsers() {
      console.log("加载用户列表");
      this.userLoading = true;
      core
        .fetch({
          method: "post",
          url: "/api/taccount/select"
        })
        .then((res) => {
          this.users = res.data;
          this.userLoading = false;
          console.log(res);
        })
        .catch( error => {
          console.error("加载用户列表失败:", error);
        });
    },
    searchCustomer() {
      if(this.searchQuery===''){
         // 清空已有的银行卡信息
        this.bankAccounts = [];
        this.loadUsers();
      }
      else{
        // 调用用户查询接口
        core
        .fetch({
          method: "get",
          url: `/api/taccount/query?customerId=${this.searchQuery}`, 
        })
        .then((response) => {
          console.log(response);
          if (response.msg === '查询成功') {
            // 查找到用户后设置selectedCustomer
            this.selectedCustomer.name = response.data.name;
            this.selectedCustomer.gender = response.data.gender;
            this.selectedCustomer.riskLevel = response.data.riskLevel;
            this.selectedCustomer.contactInfo = response.data.contactInfo;
            this.selectedCustomer.customerId = response.data.customerId;
            this.users=[];
            this.users.push(this.selectedCustomer);
            this.isDisabled = false;
            // 清空已有的银行卡信息
            this.bankAccounts = [];
            //获取银行卡信息
            this.bankAccounts =response.data.accounts;
          } else {
            alert('未找到匹配的用户');
          }
        })
        .catch( error => {
          console.error("查询用户失败:", error);
        });
      }
      },
      addBankAccount() {
        // 调用添加银行卡接口
        core
        .fetch({
          method: "post",
          url: `/api/taccount/addcard?customerId=${this.selectedCustomer.customerId}&accountId=${this.newAccount.accountId}&bankName=${this.newAccount.bankName}`,
        })
        .then((response) => {
          console.log(response);
          if (response.msg === '银行卡添加成功') {
            // 添加成功后将新账户添加到列表
            this.bankAccounts.push({
                ...this.newAccount
            });
            this.showModal = false;
            this.$hMessage.success('银行卡添加成功');
            // 清空输入表单
            this.newAccount = {
                  accountId: "",
                  bankName: "",
                  cardHolder: "",
            };
          } 
          else {this.$hMessage.error('无添加银行卡');}
        });
       
      },
      openRechargeModal(index) {
        // 打开充值弹窗
        this.selectedAccount = index;
        this.isModalOpen = true;
      },
      closeRechargeModal() {
        // 关闭充值弹窗
        this.isModalOpen = false;
      },
      closeModal() {
      this.showModal = false;
     },
     rechargeAccount() {
        if (this.selectedAccount !== null && this.rechargeAmount > 0){
          const selectedCard = this.bankAccounts[this.selectedAccount];
        // 调用虚拟充值接口
        core
        .fetch({
          method: "post",
          url: `/api/taccount/recharge?customerId=${this.selectedCustomer.customerId}&accountId=${selectedCard.accountId}&amount=${this.rechargeAmount}`,
        })
        .then((response) => {
          console.log(response);
          if (response.msg === "充值成功") {
              // 充值成功后更新账户余额
              selectedCard.balance = response.data.newBalance;
              alert('充值成功');
              // 清空充值金额并关闭弹窗
              this.rechargeAmount = 0;
              this.isModalOpen = false;
            } else {
              alert(response.msg); // 显示错误信息
            }
           });
        }
        else {
          alert('请输入有效的充值金额');
        };
      },

    },
    mounted(){
        this.loadUsers();
    },
  };
  </script>
  
<style scoped>
  .container {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.search-form{
  display: flex;
  align-items: center;
}

.customer-details-card, .cards-container {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  max-height:200px;
  overflow-y: auto; /* 当内容超出时显示滚动条 */
}

.customer-info p {
  margin: 5px 0;
}

.card {
  margin-bottom: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.card-body p {
  margin: 5px 0;
}

.btn-info {
  padding: 8px 15px;
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-info:hover {
  background-color: #117a8b;
}
  .btn {
    margin-top: 10px;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: white;
  }
  
  .btn-success {
    background-color: #28a745;
    color: white;
  }
  
  .btn-warning {
    background-color: #ffc107;
    color: black;
  }

 
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    font-weight: bold;
  }
  
  input.form-control {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border-radius: 4px;
    border: 1px solid #ced4da;
  }

.btn-secondary {
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-commit {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-comit:hover {
  background-color: #217234;
}

  .modal {
    display: block;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
  }
  
  .modal-content {
    background-color: white;
    margin: 10% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 500px
    ;
}

.modal-content h3 {
  margin-top: 0;
}


.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}



</style>
  