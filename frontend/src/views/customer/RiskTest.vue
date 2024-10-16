<template>
  <div class="risk-assessment">
    <h2>风险测评信息</h2>
    <div class="progress-bar">
      <div class="progress" :style="{ width: progress + '%' }"></div>
    </div>
    <h-form class ="form">
      <div class="question-block" v-for="(question, index) in paginatedQuestions" :key="question.id">
        <h-form-item>
          <h4>Q{{ currentPageStartIndex + index + 1 }}: {{ question.question }}</h4>
          <h-radio-group v-model="answers[question.id-1]" size="small" vertical>
            <h-radio
              v-for="(option, idx) in question.options"
              :key="idx"
              :label="option.score"
              class="radio-option"
            >
              {{ option.label }}
            </h-radio>
          </h-radio-group>
        </h-form-item>
      </div>
      <div class="navigation-buttons">
        <h-button 
          type="button" 
          @click="prevPage" 
          :disabled="currentPage === 1">
          上一页
        </h-button>
        <h-button 
          type="button" 
          @click="nextPage" 
          :disabled="currentPage === totalPages">
          下一页
        </h-button>
        <h-button 
          type="submit" 
          @click="submitForm"
          v-if="currentPage === totalPages">
          提交
        </h-button>
      </div>
    </h-form>
    <!-- 提交成功界面 -->

    
  </div>
</template>

<script>
import core from "@hsui/core";

export default {
  data() {
    return {
"questions": [
  {
    id:1,
    "question": "您的年龄是？",
    "options": [
      {"label": "18-30岁", "score": 5},
      {"label": "31-45岁", "score": 4},
      {"label": "46-55岁", "score": 3},
      {"label": "56岁以上", "score": 2}
    ]
  },
  {
      id:2,
    "question": "您的年收入范围是？",
    "options": [
      {"label": "低于10万元", "score": 2},
      {"label": "10万-30万元", "score": 3},
      {"label": "30万-50万元", "score": 4},
      {"label": "50万元以上", "score": 5}
    ]
  },
  {
      id:3,
    "question": "您目前的储蓄状况如何？",
    "options": [
      {"label": "无存款或存款不足半年生活费", "score": 1},
      {"label": "存款能维持6-12个月的生活费", "score": 2},
      {"label": "存款能维持12-24个月的生活费", "score": 4},
      {"label": "存款能维持24个月以上的生活费", "score": 5}
    ]
  },
  {
      id:4,
    "question": "您的负债情况如何？",
    "options": [
      {"label": "负债超过总资产的50%", "score": 1},
      {"label": "负债在总资产的30%-50%之间", "score": 2},
      {"label": "负债在总资产的10%-30%之间", "score": 3},
      {"label": "无负债或负债少于总资产的10%", "score": 5}
    ]
  },
  {
      id:5,
    "question": "您目前的投资经验如何？",
    "options": [
      {"label": "无投资经验", "score": 1},
      {"label": "有少量投资经验", "score": 2},
      {"label": "有一定投资经验", "score": 3},
      {"label": "丰富的投资经验", "score": 4},
      {"label": "专业投资者", "score": 5}
    ]
  },
  {
      id:6,
    "question": "您对金融产品的了解程度如何？",
    "options": [
      {"label": "不了解，完全依赖他人建议", "score": 1},
      {"label": "有基本了解，但依赖专家建议", "score": 2},
      {"label": "有较多了解，可以独立判断", "score": 4},
      {"label": "非常了解，能够进行深度分析", "score": 5}
    ]
  },
  {
      id:7,
    "question": "您过去一年中常投资的金融产品是?",
    "options": [
      {"label": "银行储蓄", "score": 1},
      {"label": "保险产品", "score": 2},
      {"label": "股票、基金", "score": 3},
      {"label": "房地产", "score": 4},
      {"label": "期货、期权或其他衍生品", "score": 5}
    ]
  },
  {
      id:8,
    "question": "您过去一年中进行投资的频率如何？",
    "options": [
      {"label": "没有投资", "score": 1},
      {"label": "偶尔投资", "score": 2},
      {"label": "每季度进行投资", "score": 3},
      {"label": "每月进行投资", "score": 4},
      {"label": "每周进行投资", "score": 5}
    ]
  },
  {
      id:9,
    "question": "您能够承受的投资亏损金额是？",
    "options": [
      {"label": "不愿意承受任何亏损", "score": 1},
      {"label": "10%以内", "score": 2},
      {"label": "10%-20%", "score": 3},
      {"label": "20%-30%", "score": 4},
      {"label": "30%以上", "score": 5}
    ]
  },
  {
      id:10,
    "question": "您如何评估自己的风险承受能力？",
    "options": [
      {"label": "非常低", "score": 1},
      {"label": "较低", "score": 2},
      {"label": "中等", "score": 3},
      {"label": "较高", "score": 4},
      {"label": "非常高", "score": 5}
    ]
  },
  {
      id:11,
    "question": "如果您的投资在短期内出现亏损，您会怎么做？",
    "options": [
      {"label": "立刻卖出，避免进一步损失", "score": 1},
      {"label": "考虑卖出部分，减少损失", "score": 2},
      {"label": "持有观望，等待市场反弹", "score": 3},
      {"label": "继续买入，摊薄成本", "score": 4},
      {"label": "增加投资，认为这是低买的机会", "score": 5}
    ]
  },
  {
      id:12,
    "question": "您对未来市场的波动性有何看法？",
    "options": [
      {"label": "非常担心，不愿冒任何风险", "score": 1},
      {"label": "较为担心，希望风险尽量可控", "score": 2},
      {"label": "接受一定波动，追求相对收益", "score": 3},
      {"label": "可以承受较大波动，期待高收益", "score": 4},
      {"label": "完全不担心波动，认为这是投资机会", "score": 5}
    ]
  },
  {
      id:13,
    "question": "您计划投资的时间期限是？",
    "options": [
      {"label": "少于1年", "score": 2},
      {"label": "1-3年", "score": 3},
      {"label": "3-5年", "score": 4},
      {"label": "5年以上", "score": 5}
    ]
  },
  {
      id:14,
    "question": "您在投资时的主要目标是什么？",
    "options": [
      {"label": "保本增值", "score": 2},
      {"label": "稳定收益", "score": 3},
      {"label": "适度增长", "score": 4},
      {"label": "高风险高回报", "score": 5}
    ]
  },
  {
      id:15,
    "question": "您的投资回报期望是多少？",
    "options": [
      {"label": "不高于银行利率", "score": 1},
      {"label": "略高于银行利率", "score": 2},
      {"label": "高于通胀率", "score": 3},
      {"label": "明显高于通胀率", "score": 4},
      {"label": "超过市场平均水平", "score": 5}
    ]
  },
  {
      id:16,
    "question": "您如何选择投资产品？",
    "options": [
      {"label": "以安全性为主要考虑", "score": 1},
      {"label": "追求稳定的收益，风险可控", "score": 2},
      {"label": "追求收益和安全的平衡", "score": 3},
      {"label": "主要考虑收益，愿意承担一定风险", "score": 4},
      {"label": "高风险高回报是首要目标", "score": 5}
    ]
  }
],
      answers: [],
      currentPage: 1,
      questionsPerPage: 4,
      riskLevel:null,
      riskMessage: ''
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.questions.length / this.questionsPerPage);
    },
    currentPageStartIndex() {
      return (this.currentPage - 1) * this.questionsPerPage;
    },
    paginatedQuestions() {
      return this.questions.slice(this.currentPageStartIndex, this.currentPageStartIndex + this.questionsPerPage);
    },
    progress() {
      const answeredQuestions = Object.keys(this.answers).length;
      const totalQuestions = this.questions.length;
      return (answeredQuestions / totalQuestions) * 100;
    }
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    getResult(sum) {
    if (sum >= 20 && sum <= 34) {
      return 1;
    } else if (sum >= 35 && sum <= 46) {
      return 2;
    } else if (sum >= 47 && sum <= 58) {
      return 3;
    } else if (sum >= 59 && sum <= 70) {
      return 4;
    } else if (sum >= 71 && sum <= 80) {
      return 5;
    } else {
      return "Score out of range";
    }
  },
    submitForm() {
    console.log(this.answers);
    const sum = this.answers.reduce((total, answer) => {
    console.log(answer); // 输出每个 score 的值
    return total + (typeof answer === 'number' ? answer : 0); // 仅在 score 是数字时累加
}, 0);
    const riskLevel = this.getResult(sum);
    console.log("sum:", sum);
    console.log("riskLevel:", riskLevel);
    const sharedData = '123123200001012222';

    core
        .fetch({
          method: "post",
          url: `/api/taccount/updaterisk?customerId=${sharedData}&riskLevel=${riskLevel}` 
        })
        .then((response) => {
          console.log(response);
          this.riskLevel = response.data.riskLevel;
          this.riskMessage = response.msg;
        })
        .catch((error) => {
            console.log("风险测评错误：",error);
        });
    }
  }
};
</script>

<style>
.risk-assessment {
  width: 100%;
  height:80%;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.progress-bar {
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin-bottom: 20px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #007BFF;
  transition: width 0.3s ease;
}

.form{
  height: 600px;
  overflow-y: auto; /* 当内容超出时显示滚动条 */
}

.question-block {
  margin-bottom: 20px;
}

.option {
  font-size:xx-larger;
  margin: 10px 0;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
}

button {
  background-color: #007BFF;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
}

button:hover:enabled {
  background-color: #0056b3;
}
</style>
