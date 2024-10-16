import hCore from "@hsui/core";
import Vue from 'vue'
import "./reset.css";
import * as echarts from 'echarts';
import hui from 'h_ui';
import 'h_ui/dist/h_ui.min.css'

Vue.use(hui)
Vue.prototype.$echarts = echarts;
const app = hCore();

app.start();
