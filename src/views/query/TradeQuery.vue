<template>
    <div>
      <div>
        <h-form :model="formItem" :label-width="80">
          <h-row>
            <h-col span="7">
              <h-form-item label="流水编号">
                <h-input v-model="formItem.swiftNo" placeholder="请输入" ></h-input>
              </h-form-item>
            </h-col>
            <h-col span="7">
              <h-form-item label="客户姓名">
                <h-input v-model="formItem.customerName" placeholder="请输入" ></h-input>
              </h-form-item>
            </h-col>
          </h-row>
          <h-row>
            <h-col span="7">
              <h-form-item label="起止日期">
                <h-date-picker
                v-model="formItem.dates"
                format="yyyy-MM-dd"
                type="daterange"
                placement="bottom-end"
                placeholder="选择日期"
              ></h-date-picker>               
             </h-form-item>
            </h-col>
            <h-col span="7">
              <h-form-item label="客户ID">
                <h-input v-model="formItem.customerId" placeholder="请输入" ></h-input>
              </h-form-item>
            </h-col> 
            <h-col span="6">
              <h-form-item>
                <h-button type="primary" @click="handleSubmit">查询</h-button>
                <h-button type="ghost" @click="cancel" style="margin-left: 8px;">取消</h-button>
              </h-form-item> 
            </h-col>     
          </h-row>
        </h-form>
      </div>
      <div>
        <h-table
        border 
        :data="tData" 
        :columns="columns" 
        style="margin-bottom: 8px;"
        ></h-table>
        <h-page
        :total="totalNum"
        @on-change="dataChange"
        show-elevator
        show-total
        :page-size="10"
        ></h-page>
      </div>
    </div>
</template>

<script>
import core from "@hsui/core";

export default {
    data() {
        return {
          formItem: {
            swiftNo: "",
            customerName:"",
            customerId:"",
            dates: ["", ""],
          },
          data : [],
          columns : [
            {
              title: "交易流水编号",
              key: "swiftNo",
              width:150,
            },
            {
              title: "交易类型",
              key: "tradeType",
              filters: [
                {
                  label: "申购",
                  value: 1,
                },
                {
                  label: "赎回",
                  value: 2,
                },
                {
                  label: "撤回",
                  value: 3,
                }
              ],
              filterMultiple: false,
              filterMethod(value, row) {
                if (value === 1) {
                  return row.tradeType === "申购";
                } else if (value === 2) {
                  return row.tradeType === "赎回";
                }
                else{
                  return row.tradeType === "撤回";
                }
              },
            },
            {
              title: "金额/份额",
              key: "amount",
              sortable: true,
            },
            {
              title: "交易时间",
              key: "timestamp",
              width:150,
              sortable: true,
            },
            {
              title: "客户姓名",
              key: "customerName",
            },
            {
              title: "客户id",
              key: "customerId",
            },
            {
              title: "银行名称",
              key: "accountName",
            },
            {
              title: "银行卡号",
              key: "accountId",
            },
            {
              title: "基金名称",
              key: "productName",
            },
            {
              title: "基金代码",
              key: "productId",
            },
          ],
          tData: [],
          totalNum: 0,
     };
    },
    created() {
        console.log("query/TradeQuery")
    },
    beforeDestroy() {
    },
    methods: { 
      handleSubmit(){
        if(this.isFormItemEmpty()){
            this.$hMessage.info("请至少输入一项！");
            return 0;
        }
        const startDateStr = this.formatDateToYYYYMMDDHHmmss(this.formItem.dates[0]);
        const endDateStr = this.formatDateToYYYYMMDDHHmmss(this.formItem.dates[1]);
        console.log('表单数据：',this.formItem);
        let endDate = endDateStr ? parseInt(endDateStr) : ''; 
        let startDate = startDateStr ? parseInt(startDateStr) : ''; 
        //提交到api接口
        core.fetch({
          method: 'get',
          url: `/api/tquery/trade?swiftNo=${this.formItem.swiftNo}&customerName=${this.formItem.customerName}&customerId=${this.formItem.customerId}&startTime=${startDate}&endTime=${endDate}`,
          headers: {
            'Content-Type': 'application/json' // 确保服务器知道发送的是JSON数据
          },
        })
        .then(result => {
          // 处理响应数据
          this.$hMessage.info(result.msg);
            this.data=result.data;
            this.$nextTick(() => {
              // 遍历data中的每个数组元素
              this.data.forEach(item => {
                // 假设item有一个名为timestamp的属性
                item.timestamp = this.convertIntegerToDateTime(item.timestamp);
              });

              this.totalNum = this.data.length;
              this.tData = this.data.slice(0, 10);
            });
        })
        .catch(error => {
          // 处理错误
          console.error('提交失败:', error);
      });
      },
      cancel(){
        this.formItem.swifNo = "";
        this.formItem.dates = ["",""];
        this.formItem.customerName = "";
      },
      isFormItemEmpty() {
        // 检查 accountId 是否为空
        if (this.formItem.swifNo !== "") {
            return false;
        }
        if (this.formItem.customerName !== "") {
            return false;
        }
        
        // 检查 dates 数组中的每个元素是否为空
        if (!this.formItem.dates.every(date => date === "")) {
            return false;
        }
        // 如果所有字段都为空，则表单为空
        return true;
        },
      pageChange(index) {
        // console.log(index);
      },
      numChange(value) {
        console.log(value);
      },
      dataChange(i) {
        this.tData = data.slice((i - 1) * 10, i * 10);
      },
      formatDateToYYYYMMDDHHmmss(date) {
        if(date==null)return '';
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份是从0开始的
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
      },
      convertIntegerToDateTime(integer) {
        // 将整数转换为字符串
        const integerStr = integer.toString();

        // 检查字符串长度是否符合预期
        if (integerStr.length !== 14) {
          throw new Error('输入的整数长度必须为14位');
        }

        // 提取年、月、日、时、分、秒
        const year = integerStr.substring(0, 4);
        const month = integerStr.substring(4, 6);
        const day = integerStr.substring(6, 8);
        const hour = integerStr.substring(8, 10);
        const minute = integerStr.substring(10, 12);
        const second = integerStr.substring(12, 14);

        // 构建并返回日期时间字符串
        return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
      }
    },
  };
</script>

<style lang="less" scoped>
  
</style>