import { initRouter, initRouterLayout } from '@hsui/core'

export default initRouter(
  [
    {
      path: '/',
      component: initRouterLayout((layout) => {
        return import('@/layouts/' + layout + '.vue')
      }),
      children: [
        {
          name: 'index',
          path: '',
          component: Index,
          children: [
            {
              name: 'index-home',
              path: 'home',
              component: IndexHome,
            },
          ],
        },
        {
          name: 'clear-index',
          path: 'clear',
          component: ClearIndex,
        },
        {
          name: 'product-index',
          path: 'product',
          component: ProductIndex,
        },
        {
          name: 'product-example-index',
          path: 'product-example',
          component: ProductExampleIndex,
        },
        {
          name: 'customer-BankCard',
          path: 'customer/BankCard',
          component: CustomerBankCard,
        },
        {
          name: 'customer-Create',
          path: 'customer/Create',
          component: CustomerCreate,
        },
        {
          name: 'customer-CustomerInfo',
          path: 'customer/CustomerInfo',
          component: CustomerCustomerInfo,
        },
        {
          name: 'customer-RiskTest',
          path: 'customer/RiskTest',
          component: CustomerRiskTest,
        },
        {
          name: 'query-BankQuery',
          path: 'query/BankQuery',
          component: QueryBankQuery,
        },
        {
          name: 'query-ShareQuery',
          path: 'query/ShareQuery',
          component: QueryShareQuery,
        },
        {
          name: 'query-TradeQuery',
          path: 'query/TradeQuery',
          component: QueryTradeQuery,
        },
        {
          name: 'trade-Cancellation',
          path: 'trade/Cancellation',
          component: TradeCancellation,
        },
        {
          name: 'trade-Purchase',
          path: 'trade/Purchase',
          component: TradePurchase,
        },
        {
          name: 'trade-Redeem',
          path: 'trade/Redeem',
          component: TradeRedeem,
        },
        {
          name: 'product-example-id',
          path: 'product-example/:id?',
          component: ProductExampleId,
        },
        {
          name: '__404__',
          path: '*',
          component: __404__,
        },
      ],
    },
  ],
  { base: '/', mode: 'hash' }
)

function Index() {
  return import(/* webpackChunkName: "index" */ '@/views/index.vue')
}
function IndexHome() {
  return import(/* webpackChunkName: "index-home" */ '@/views/index/home.vue')
}
function ClearIndex() {
  return import(/* webpackChunkName: "clear-index" */ '@/views/clear/index.vue')
}
function ProductIndex() {
  return import(
    /* webpackChunkName: "product-index" */ '@/views/product/index.vue'
  )
}
function ProductExampleIndex() {
  return import(
    /* webpackChunkName: "product-example-index" */ '@/views/product-example/index.vue'
  )
}
function CustomerBankCard() {
  return import(
    /* webpackChunkName: "customer-BankCard" */ '@/views/customer/BankCard.vue'
  )
}
function CustomerCreate() {
  return import(
    /* webpackChunkName: "customer-Create" */ '@/views/customer/Create.vue'
  )
}
function CustomerCustomerInfo() {
  return import(
    /* webpackChunkName: "customer-CustomerInfo" */ '@/views/customer/CustomerInfo.vue'
  )
}
function CustomerRiskTest() {
  return import(
    /* webpackChunkName: "customer-RiskTest" */ '@/views/customer/RiskTest.vue'
  )
}
function QueryBankQuery() {
  return import(
    /* webpackChunkName: "query-BankQuery" */ '@/views/query/BankQuery.vue'
  )
}
function QueryShareQuery() {
  return import(
    /* webpackChunkName: "query-ShareQuery" */ '@/views/query/ShareQuery.vue'
  )
}
function QueryTradeQuery() {
  return import(
    /* webpackChunkName: "query-TradeQuery" */ '@/views/query/TradeQuery.vue'
  )
}
function TradeCancellation() {
  return import(
    /* webpackChunkName: "trade-Cancellation" */ '@/views/trade/Cancellation.vue'
  )
}
function TradePurchase() {
  return import(
    /* webpackChunkName: "trade-Purchase" */ '@/views/trade/Purchase.vue'
  )
}
function TradeRedeem() {
  return import(
    /* webpackChunkName: "trade-Redeem" */ '@/views/trade/Redeem.vue'
  )
}
function ProductExampleId() {
  return import(
    /* webpackChunkName: "product-example-id" */ '@/views/product-example/_id.vue'
  )
}
function __404__() {
  return import(/* webpackChunkName: "__404__" */ '@/views/__404__.vue')
}
