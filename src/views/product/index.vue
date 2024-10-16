<template>
    <div>
      <!-- 搜索栏 -->
      <div class="search-bar">
        <h-select v-model="searchType" placeholder="选择产品类型" style="width: 150px;">
          <h-option label="债券型基金" value="债券型基金"></h-option>
          <h-option label="股票型基金" value="股票型基金"></h-option>
          <h-option label="混合型基金" value="混合型基金"></h-option>
        </h-select>
        <h-select v-model="searchRiskLevel" placeholder="选择风险等级" style="width: 150px;">
          <h-option label="低风险" value=1></h-option>
          <h-option label="中低风险" value=2></h-option>
          <h-option label="中风险" value=3></h-option>
          <h-option label="中高风险" value=4></h-option>
          <h-option label="高风险" value=5></h-option>
        </h-select>
        <h-select v-model="searchState" placeholder="选择产品状态" style="width: 150px;">
          <h-option value="在售">在售</h-option>
          <h-option value="停售">停售</h-option>
          <h-option value="待售">待售</h-option>
        </h-select>
        <h-button type="primary" @click="fuzzySearch">模糊查询</h-button>
        <h-input v-model="exactProductId" placeholder="输入产品代码进行精确查询" style="width: 300px; margin-left: 10px;"></h-input>
        <h-button type="primary" @click="exactSearch">精确查询</h-button>
      </div>
      <br />

      <h-button @click="showAddProductModal = true" type="primary">
        新增产品
      </h-button>
      <br />
      <br />

      <!-- 产品列表 -->
      <div>
        <h-table :data="products" :loading="productLoading" :columns ="productColumns" style="width: 100%">
        </h-table>
      </div>
      <br />

    <!-- 分页 -->
    <h-page
      :total="totalProducts"
      :page-size="pagination.pageSize"
      :current-page="pagination.current"
      @on-change="handlePageChange"
      show-elevator
      show-sizer
    />
    
    <!-- 编辑产品弹窗 -->
    <h-msg-box v-model="showEditProductModal" width="800">
      <p slot="header" style="text-align: center;">
        <h-icon name="edit"></h-icon>
        <span>编辑产品</span>
      </p>
      <h-form ref="productForm" :model="product" label-width="120px">
        <h-form-item label="产品名称" required>
          <h-input v-model="product.productName" placeholder="请输入产品名称"></h-input>
        </h-form-item>

        <h-form-item label="产品类型" required>
          <h-select v-model="product.productType" placeholder="请选择产品类型">
            <h-option label="债券型基金" value="债券型基金"></h-option>
            <h-option label="股票型基金" value="股票型基金"></h-option>
            <h-option label="混合型基金" value="混合型基金"></h-option>
          </h-select>
        </h-form-item>

        <!-- 产品风险等级 -->
        <h-form-item label="产品风险" prop="riskLevel" required>
          <h-radio-group v-model="product.riskLevel">
            <h-radio label= 1>低风险</h-radio>
            <h-radio label= 2>中低风险</h-radio>
            <h-radio label= 3>中风险</h-radio>
            <h-radio label= 4>中高风险</h-radio>
            <h-radio label= 5>高风险</h-radio>
          </h-radio-group>
        </h-form-item>

        <!-- 产品状态 -->
        <h-form-item label="产品状态" prop="productState" required>
          <h-select v-model="product.productState" placeholder="请选择产品状态">
            <h-option value="在售">在售</h-option>
            <h-option value="停售">停售</h-option>
            <h-option value="待售">待售</h-option>
          </h-select>
        </h-form-item>
      </h-form>
      <div slot="footer">
        <h-button @click="cancelEditProduct">取消</h-button>
        <h-button type="primary" @click="confirmEditProduct">确定</h-button>
      </div>
    </h-msg-box>


      <!-- 新增产品弹窗 -->
      <h-msg-box v-model="showAddProductModal" width="800">
        <p slot="header" style="text-align: center;">
          <h-icon name="add"></h-icon>
          <span>新增产品</span>
        </p>
        <h-form ref="productForm" :model="product" label-width="120px">
          <h-form-item label="产品代码" required>
            <h-input v-model="product.productId" placeholder="请输入产品代码"></h-input>
          </h-form-item>
          <h-form-item label="产品名称" required>
            <h-input v-model="product.productName" placeholder="请输入产品名称"></h-input>
          </h-form-item>
  
          <h-form-item label="产品类型" required>
            <h-select v-model="product.productType" placeholder="请选择产品类型">
              <h-option label="债券型基金" value="债券型基金"></h-option>
              <h-option label="股票型基金" value="股票型基金"></h-option>
              <h-option label="混合型基金" value="混合型基金"></h-option>
            </h-select>
          </h-form-item>
  
          <!-- 产品风险等级 -->
          <h-form-item label="产品风险" prop="riskLevel" required>
            <h-radio-group v-model="product.riskLevel">
              <h-radio label=1>低风险</h-radio>
              <h-radio label=2>中低风险</h-radio>
              <h-radio label=3>中风险</h-radio>
              <h-radio label=4>中高风险</h-radio>
              <h-radio label=5>高风险</h-radio>
            </h-radio-group>
          </h-form-item>
  
          <!-- 产品状态 -->
          <h-form-item label="产品状态" prop="productState" required>
            <h-select v-model="product.productState" placeholder="请选择产品状态">
              <h-option value="在售">在售</h-option>
              <h-option value="停售">停售</h-option>
              <h-option value="待售">待售</h-option>
            </h-select>
          </h-form-item>
        </h-form>
        <div slot="footer">
          <h-button @click="cancelAddProduct">取消</h-button>
          <h-button type="primary" @click="confirmAddProduct">确定</h-button>
        </div>

      </h-msg-box>

    </div>
  </template>
  
  <script>
  import core from "@hsui/core";

  export default {
    data() {
      return {
        productLoading: true,
        showEditProductModal:false,
        showAddProductModal: false, // 控制弹窗显示
        searchType: '',
        searchRiskLevel: null,
        searchState: '',
        exactProductId: '',
        productColumns: [
        {
          title: "产品代码",
          key: "productId",
        },
        {
          title: "产品名称",
          key: "productName",
        },
        {
          title: "产品类型",
          key: "productType",
        },
        {
          title: "产品状态",
          key: "productState",
        },
        {
          title: "风险等级",
          key: "riskLevel",
        },
        {
          title: "操作",
          key: "action",
          width: 200,
          render(h, { row, row: { id, productName } = {} }) {
            return h("div", [
              h(
                "h-poptip",
                {
                  props: {
                    title: `确认删除${productName}?`,
                    confirm: true,
                    width: 200,
                    transfer: true,
                  },
                  on: {
                    "on-ok": () => {
                      that.delProduct(id, productName);
                    },
                    "on-cancel": () => {
                      that.$hMessage.info({
                        content: `取消删除${productName}`,
                        durtion: 3,
                        closable: true,
                      });
                    },
                  },
                },
                [
                  h(
                    "Button",
                    {
                      props: { type: "text", size: "small" },
                    },
                    "删除"
                  ),
                ]
              ),
              h(
                "Button",
                {
                  props: { type: "text", size: "small" },
                  on: {
                    click() {
                      this.showEditProductModal = true;
                    },
                  },
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: { type: "text", size: "small" },
                  on: {
                    click() {
                      router.push({
                        path: `/product/${id}`,
                      });
                    },
                  },
                },
                "查看"
              ),
            ]);
          },
        },
      ],
        products: [], // 产品列表数据
        product: {
          productId: '',
          productName: '',
          productType: '',
          riskLevel: null,
          productState: '',
        },
        //totalProducts: 0, // 总记录数
        pagination: {
            current: 1, // 当前页码
            pageSize: 10, // 每页显示条数
        },
      };
    },
  computed: {
    // 总记录数
    totalProducts() {
      return this.products.length;
    },
    // 计算当前页显示的数据
    currentPageData() {
      const start = (this.pagination.current - 1) * this.pagination.pageSize;
      const end = start + this.pagination.pageSize;
      return this.products.slice(start, end);
    }
  },
  created(){
    this.loadProducts(); // 初始化时加载产品列表
  },
  methods: {
    // 当页码或每页条数改变时触发
    handlePageChange(page) {
      this.pagination.current = page;
    },
    // 加载产品列表
    loadProducts() {
      this.productLoading = true;
      core
        .fetch({
          method: "get",
          url: "/api/tproduct/select", // /api/
        })
        .then((res) => {
          this.products = res.data;
          this.productLoading = false;
          console.log(res);
        })
        .catch( error => {
          console.error("加载产品列表失败:", error);
        });
    },

    // 模糊查询
    fuzzySearch() {
        const query = {
        productType: this.searchType,
        riskLevel: this.searchRiskLevel,
        productState: this.searchState,
      };
      console.log("模糊查询条件:", query);
      // 调用模糊查询API
      core
        .fetch({
          method: "get",
          url: `/api/tproduct/select?productType=${query.productType}&riskLevel=${query.riskLevel}&productState=${query.productState}`,
        })
        .then((res) => {
          this.$hMessage.success("模糊查询成功");
          this.products = [];
          this.products = res.data;
          console.log(res);
        })
        .catch((error) => {
          console.error("模糊查询失败:", error);
          this.$hMessage.error("模糊查询失败");
        });
      },

    // 精确查询
    exactSearch() {
      const query = {
        productId: this.exactProductId,
      };
      console.log("精确查询条件:", query);
      // 调用精确查询API
      core
        .fetch({
          method: "get",
          url: `/api/tproduct/query?productId=${query.productId}`,
        })
        .then((res) => {
          console.log(res);
          if(res.msg==='查询成功'){
            this.$hMessage.success("查询成功");
            this.products = [];
            this.product = res.data;
            this.products.push(this.product);
          }
          else{
            this.$hMessage.error("该产品不存在");
          }
        })
        .catch((error) => {
          console.error("精确查询失败:", error);
          this.$hMessage.error("精确查询失败");
        });
      },

    // 确定新增产品操作
    confirmAddProduct() {
      const currentTimestamp = new Date().getTime();
      console.log("新增产品数据：", this.product);
      // 调用API将数据提交到服务器
      core
        .fetch({
          method: "post",
          url: `/api/tproduct/add?productId=${this.product.productId}&productName=${this.product.productName}&productType=${this.product.productType}&riskLevel=${this.product.riskLevel}&productState=${this.product.productState}`,
        })
        .then((res) => {
          this.$hMessage.success("产品新增成功");
          this.showAddProductModal = false;
          this.$refs.productForm.resetFields(); // 重置表单
          this.loadProducts(); // 重新加载产品列表
          console.log(res);
        })
        .catch((error) => {
          console.error("产品新增失败:", error);
          this.$hMessage.error("产品新增失败");
        });
      },
    // 取消新增产品操作
    cancelAddProduct() {
        // 重置表单
        this.$refs.productForm.resetFields();
        // 关闭弹窗
        this.showAddProductModal = false;
      },

    // 填充编辑表单的初始数据
    editProduct(row) {
      this.product = { ...row };
      this.showEditProductModal = true; // 显示编辑弹窗
    },
    cancelEditProduct() {
      this.showEditProductModal = false; // 关闭编辑弹窗
    },
    // 提交编辑后的数据
    confirmEditProduct() {
      core
        .fetch({
          method: "post",
          url: `/api/tproduct/update`,
        })
        .then((res) => {
          if (response.data.success) {
            this.$hMessage.success('产品更新成功');
            this.showEditProductModal = false; // 关闭编辑弹窗
            this.loadProducts(); // 重新加载产品列表
          } else {
            this.$hMessage.error('产品更新失败');
          }
        })
        .catch((error) => {
          console.error("产品更新失败:", error);
          this.$hMessage.error("产品更新失败");
        });
      }
    }
  };
  </script>
  
<style lang="less" scoped >
/* 搜索栏样式 */
.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px; /* 增加组件间的间隔 */
}

.search-bar h-select,
.search-bar h-input {
  margin-right: 10px; /* 增加组件之间的右边距 */
  font-size: 16px; /* 增加字体大小 */
}

.search-bar h-button {
  margin-left: 10px; /* 精确查询按钮左边距 */
  font-size: 16px; /* 增加字体大小 */
  padding: 10px 20px; /* 增加按钮内边距 */
}

/* 产品列表样式 */
h-table {
  margin-top: 20px;
  font-size: 16px; /* 增加字体大小 */
}

h-table-column {
  padding: 10px; /* 增加表格列内边距 */
}

/* 分页样式 */
.pagination-wrap {
  text-align: center;
  margin-top: 20px;
}

h-page {
  font-size: 16px; /* 增加分页字体大小 */
}

/* 新增产品弹窗样式 */
h-msg-box {
  border-radius: 8px; /* 圆角效果 */
}

h-msg-box .h-msg-box__header {
  border-bottom: 1px solid #e8e8e8; /* 头部与内容的分隔线 */
  padding-bottom: 10px;
  font-size: 18px; /* 增加头部字体大小 */
}

h-msg-box .h-msg-box__footer {
  text-align: right; /* 右对齐 */
}

h-form-item {
  margin-bottom: 15px; /* 表单项的下边距 */
}

h-input {
  width: 100%; /* 输入框占满父容器宽度 */
  font-size: 16px; /* 增加字体大小 */
  padding: 12px; /* 增加内边距 */
}

h-select {
  width: 100%; /* 下拉框占满父容器宽度 */
  font-size: 16px; /* 增加字体大小 */
  padding: 12px; /* 增加内边距 */
}

h-radio-group {
  display: flex;
  gap: 10px; /* 单选按钮之间的间隔 */
}

h-radio {
  font-size: 16px; /* 增加单选按钮的字体大小 */
}
</style>


