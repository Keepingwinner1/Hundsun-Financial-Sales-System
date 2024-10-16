<template>
  <div>
    <!-- 表格操作 -->
    <div class="product-action-bar">
      <h-button type="primary" @click="addProduct">新增</h-button>
    </div>
    <!-- 表格 -->
    <h-table
      :loading="productLoading"
      :columns="productColumns"
      :data="productList"
    ></h-table>
    <!-- 分页 -->
    <div v-show="pagination.total > 0" class="pagination-wrap">
      <h-page v-bind="pagination" @on-change="changePagination"></h-page>
    </div>
    <!-- 弹框-产品新增/编辑 -->
    <h-msg-box
      v-model="productMsgBoxVisible"
      footerHide
      :escClose="true"
      :title="
        productFormMsgBoxData.id
          ? `编辑${productFormMsgBoxData.productName}`
          : '新增'
      "
      :beforeEscClose="productMsgBoxBeforeEscClose"
      @on-close="productMsgBoxClose"
    >
      <h-form
        ref="productForm"
        :model="productFormData"
        :rules="productRuleValidate"
        :label-width="80"
      >
        <h-form-item label="产品名称" prop="productName" required>
          <h-input
            v-model="productFormData.productName"
            placeholder="请输入产品名称"
          />
        </h-form-item>
        <h-form-item label="产品类型" prop="productType" required cols="2">
          <h-radio-group v-model="productFormData.productType">
            <h-radio
              v-for="(productType, key) in productTypeOrm"
              :key="key"
              style="margin-right: 24px"
              :label="key"
            >
              {{ productType }}
            </h-radio>
          </h-radio-group>
        </h-form-item>
        <h-form-item label="产品状态" prop="productStatus" required cols="2">
          <h-radio-group v-model="productFormData.productStatus">
            <h-radio
              v-for="(productStatus, key) in productStatusOrm"
              :key="key"
              style="margin-right: 24px"
              :label="key"
            >
              {{ productStatus }}
            </h-radio>
          </h-radio-group>
        </h-form-item>
        <h-form-item label="产品大类" prop="productCategory">
          <h-input
            v-model="productFormData.productCategory"
            placeholder="请输入产品大类"
          />
        </h-form-item>
        <h-form-item style="text-align: right">
          <h-button type="ghost" @click="productFormCancel"> 取消 </h-button>
          <h-button type="ghost" @click="productFormReset"> 重置 </h-button>
          <h-button type="primary" @click="productFormOk"> 提交 </h-button>
        </h-form-item>
      </h-form>
    </h-msg-box>
  </div>
</template>

<script>
import core from "@hsui/core";
import { PRODUCT_TYPE_ORM, PRODUCT_STATUS_ORM } from "../../constant";

export default {
  data() {
    this.timer = null;
    this.productTypeOrm = PRODUCT_TYPE_ORM;
    this.productStatusOrm = PRODUCT_STATUS_ORM;
    const router = this.$router;
    const that = this;
    return {
      productLoading: true,
      productMsgBoxVisible: false,
      productFormMsgBoxData: {},
      productFormData: {},
      productRuleValidate: {
        productName: [
          {
            required: true,
            message: "产品名称不能为空",
            trigger: "blur",
          },
        ],
        productStatus: [
          {
            required: true,
            message: "请选择产品状态",
            trigger: "change",
          },
        ],
        productType: [
          {
            required: true,
            message: "请选择产品类型",
            trigger: "change",
          },
        ],
      },
      productColumns: [
        {
          title: "产品代码",
          key: "id",
          render: (h, { row: { id } }) => h("span", {}, id.slice(-10)),
        },
        {
          title: "产品名称",
          key: "productName",
        },
        {
          title: "产品类型",
          key: "productType",
          render: (h, { row: { productType } }) => {
            return h("span", {}, this.productTypeOrm[productType]);
          },
        },
        {
          title: "产品状态",
          key: "productStatus",
          render: (h, { row: { productStatus } }) => {
            return h("span", {}, this.productStatusOrm[productStatus]);
          },
        },
        {
          title: "证件大类",
          key: "productCategory",
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
                      that.productMsgBoxVisible = true;
                      that.productFormMsgBoxData = { ...row };
                      that.productFormData = { ...row };
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
      productList: [],
      pagination: {
        current: 1,
        "page-size": 2,
        total: 0,
      },
    };
  },
  created() {
    // 获取产品列表;
    this.getProductList();
  },
  methods: {
    addProduct() {
      this.timer = null;
      this.productMsgBoxVisible = true;
    },
    delProduct(id, productName) {
      core
        .fetch({
          method: "post",
          url: "/testapi/product/del",
          data: {
            id,
          },
        })
        .then((res) => {
          if (res.code === 1) {
            this.$hMessage.success(`删除${productName}成功！`);
            this.getProductList();
          }
        })
        .catch(() => {
          this.$hMessage.error({
            content: `删除${productName}失败`,
            durtion: 3,
            closable: true,
          });
        });
    },
    getProductList() {
      core
        .fetch({
          method: "get",
          url: "/testapi/product",
          data: {
            current: 1,
            pageSize: 2,
          },
        })
        .then((res) => {
          const { code, data, pagination } = res;
          if (code === 1) {
            this.productLoading = false;
            this.productList = data;
            this.pagination = {
              ...pagination,
            };
          }
        });
    },
    createProduct() {
      core
        .fetch({
          method: "post",
          url: "/testapi/product/add",
          data: { ...this.productFormData },
        })
        .then((res) => {
          if (res.code === 1) {
            this.getProductList();
            this.resetProductFormMsgBoxData();
            this.resetProductFormData();
          }
        });
    },
    updateProduct() {
      core
        .fetch({
          method: "post",
          url: "/testapi/product",
          data: { ...this.productFormData },
        })
        .then((res) => {
          if (res.code === 1) {
            this.getProductList();
            this.resetProductFormMsgBoxData();
            this.resetProductFormData();
          }
        });
    },
    productFormOk() {
      this.$refs["productForm"].validate((valid) => {
        if (valid) {
          if (this.productFormData.id) {
            this.updateProduct();
          } else {
            this.createProduct();
          }
        } else {
          this.$Message.error("表单验证失败!");
          return;
        }
      });
    },
    productFormCancel() {
      this.resetProductFormMsgBoxData();
      this.resetProductFormData();
    },
    productFormReset() {
      this.resetProductFormData();
    },
    productMsgBoxBeforeEscClose() {
      this.resetProductFormMsgBoxData();
      this.resetProductFormData();
      return ture;
    },
    productMsgBoxClose() {
      this.resetProductFormMsgBoxData();
      this.resetProductFormData();
    },
    resetProductFormMsgBoxData() {
      this.productMsgBoxVisible = false;
      this.productFormMsgBoxData = {};
    },
    resetProductFormData() {
      this.productFormData = {};
      this.timer = setTimeout(() => {
        this.$refs["productForm"].resetValidate();
      }, 0);
    },
    changePagination(page) {
      core
        .fetch({
          method: "get",
          url: "/testapi/product",
          data: {
            current: page,
            pageSize: 2,
          },
        })
        .then((res) => {
          const { code, data, pagination } = res;
          if (code === 1) {
            this.productLoading = false;
            this.productList = data;
            this.pagination = {
              ...pagination,
            };
          }
        });
    },
  },
  beforeDestroy() {
    this.timer = null;
  },
};
</script>

<style lang="less" scoped>
.product-action-bar {
  margin-bottom: 12px;
}

.pagination-wrap {
  margin-top: 12px;
  text-align: right;
}
</style>
