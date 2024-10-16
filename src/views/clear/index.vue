<template>
    <div>
        <h-row>
            <h-col span="3">
                <div style="margin-left: 50px;">
                    <h-button type="primary" @click="next">清算</h-button>
                    <br><br><br>
                    <h-button type="primary" @click="reprocess">重新清算</h-button>  
                </div>
            </h-col>
            <h-col span="8">
                <div style="margin-top: 10px; margin-left: 180px;">
                    <h-steps
                        :current="current"
                        processIcon="ios-ctoloud-download"
                        direction="vertical"
                        waitIcon="more"
                        finishIcon="android-cloud-done">
                        <h-step icon="android-sunny">
                            <div>
                                <h-card style="width: 150px;height: 90px;" :bordered="false">
                                    <p slot="title">日初始化</p>
                                    <p style="font-size: 12px;">系统准备就绪</p>
                                </h-card>
                            </div>
                        </h-step>
                        <h-step>
                            <div>
                                <h-card style="width: 150px;height: 90px;" :bordered="false">
                                    <p slot="title">接受行情</p>
                                    <p style="font-size: 12px;">获取市场价格信息</p>
                                </h-card>
                            </div>
                        </h-step>
                        <h-step icon="social-usd">
                            <div>
                                <h-card style="width: 150px;height: 90px;" :bordered="false">
                                    <p slot="title">停止当日交易</p>
                                    <p style="font-size: 12px;">进行结算</p>
                                </h-card>
                            </div>
                        </h-step>
                        <h-step icon="android-exit">
                            <div>
                                <h-card style="width: 150px;height: 90px;" :bordered="false">
                                    <p slot="title">导出申请数据</p>
                                    <p style="font-size: 12px;">为结算提供交易记录</p>
                                </h-card>
                            </div>  
                        </h-step>
                        <h-step icon="activity_fill">
                            <div>
                                <h-card style="width: 150px;height: 90px;" :bordered="false">
                                    <p slot="title">数据汇总</p>
                                    <p style="font-size: 12px;">计算基金当日净值</p>
                                </h-card>
                            </div>
                        </h-step>
                    </h-steps>
                </div>
            </h-col>
            <h-col span="7" style="margin-left: 250px;width: 350px;">
                <div style="background-color: #f7f7f7;">
                    <div>
                        <h-row>
                            <h-col span="5" style="padding-top: 5px;" >
                                <span style="font-size: 14px;color: #464c5b;font-weight: 700; margin-left: 10px;">
                                    清算日志
                                </span>
                            </h-col>
                            <h-col span="8" style="margin-left: 30px;">
                                <h-date-picker
                                v-model="date"
                                format="yyyy/MM/dd"
                                type="date"
                                placeholder="选择日期"
                                ></h-date-picker>
                            </h-col>
                            <h-col span="2" style="margin-left: 20px;">
                                <h-button type="primary" shape="circle" icon="search" @click="search"></h-button>
                            </h-col>
                        </h-row> 
                    </div>
                    <div>
                        <h-table 
                        :data="tData" 
                        :columns="columns" 
                        no-data-text="本日还未做清算"
                        style="margin-bottom: 8px;height: 280px;"
                        ></h-table>
                        <h-page
                        :total="totalNum"
                        @on-change="dataChange"
                        show-elevator
                        show-total
                        :page-size="6"
                        ></h-page>
                    </div>
                </div>   
            </h-col>
        </h-row>   
    </div>
</template>

<script>
import core from "@hsui/core";

export default {
    data() {
        return {
            data:[],
            columns :[
                {
                    title: "操作",
                    key: "log_type",
                },
                {
                    title: "结果",
                    key: "log_content",
                },
                {
                    title: "执行时间",
                    key: "log_time",
                    sortable: true,
                },
            ],
            tData: [],
            totalNum: 0,
            current: 0,
            date: this.getCurrentDate(),
        };
    },
    created() {
        console.log("clear/index");
        this.searchlog(this.convertToYyyymmdd(this.date));
    },
    methods: {
        next() {
            if(this.current==4){
                this.$hMessage.info('今日已清算');
                return 0;
            }
            core.fetch({
                method: 'post',
                url: "/api/tclear/settlement",
            })
            .then(result => {
                this.searchlog(this.formatDateToYYYYMMDD(this.date));
                // 处理响应数据
                console.log('提交成功:', result );
                this.$hMessage.info(result.msg);
                this.$nextTick(() => {
                    this.current=4;
                });         
                // this.data=result.data;
            })
            .catch(error => {
                // 处理错误
                console.error('提交失败:', error);
            });   
        },
        reprocess(){
            if(this.current==0){
                this.$hMessage.info('今日已重新清算');
                return 0;
            }
            core.fetch({
                method: 'post',
                url: "/api/tclear/reprocess",
            })
            .then(result => {
                this.searchlog(this.formatDateToYYYYMMDD(this.date));
                // 处理响应数据
                console.log('提交成功:', result );
                this.$hMessage.info(result.msg);
                this.$nextTick(() => {
                    this.current=0;
                }); 
                // this.data=result.data;
            })
            .catch(error => {
                // 处理错误
                console.error('提交失败:', error);
            }); 
        },
        search(){
            if(this.date===""){
                this.$hMessage.info("请输入日期");
                return 0;
            }
            const dates = this.formatDateToYYYYMMDD(this.date);
            this.searchlog(dates);
        },
        searchlog(date){
            core.fetch({
                method: 'get',
                url: `/api/tclear/select?timestamp=${date}`,
            })
            .then(result => {
                // 处理响应数据
                console.log('提交成功:', result );
                this.$hMessage.info(result.msg);
                this.data=result.data.logsList;
                this.$nextTick(() => {
                    this.totalNum = this.data.length;
                    this.tData = this.data.slice(0, 6);
                });  
            })
            .catch(error => {
                // 处理错误
                console.error('提交失败:', error);
            }); 
        },
        pageChange(index) {
        // console.log(index);
        },
        numChange(value) {
            console.log(value);
        },
        dataChange(i) {
            this.tData = this.data.slice((i - 1) * 6, i * 6);
        },
        formatDateToYYYYMMDD(date) {
            if(date==null)return '';
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份是从0开始的
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}${month}${day}`;
        },
        getCurrentDate() {
            // 获取当前日期并格式化为yyyy/MM/dd格式
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}/${month}/${day}`;
        },
        convertToYyyymmdd(dateString) {
            if (!dateString || dateString.length !== 10) {
                return 'Invalid date string';
            }

            const [year, month, day] = dateString.split('/');
            return `${year}${month}${day}`;
        }
    },
    beforeDestroy() {
    },
};
</script>

<style lang="less" scoped>
  
</style>