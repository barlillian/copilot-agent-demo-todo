// 資料模型定義
// 適用於訂單、客戶、商品

/**
 * @typedef {Object} Product
 * @property {string} name - 商品名稱
 * @property {number} price - 商品價格
 * @property {number} stock - 商品庫存
 * @property {string} [category] - 商品分類
 * @property {string} [sku] - 商品 SKU
 * @property {string} [description] - 商品描述
 * @property {number} [weight] - 商品重量
 * @property {Object} [dimensions] - 商品尺寸
 * @property {string[]} [tags] - 商品標籤
 */

/**
 * @typedef {Object} Customer
 * @property {string} name - 客戶名稱
 * @property {string} type - 客戶類型（regular/vip/premium）
 * @property {string} phone - 電話
 * @property {string} address - 地址
 * @property {number} totalOrders - 訂單數
 * @property {number} totalSpent - 累積消費
 * @property {Date} joinDate - 加入日期
 */

/**
 * @typedef {Object} Order
 * @property {string} id - 訂單編號
 * @property {string} productName - 商品名稱
 * @property {number} quantity - 數量
 * @property {number} price - 價格
 * @property {number} subtotal - 小計
 * @property {number} tax - 稅金
 * @property {number} shipping - 運費
 * @property {number} discount - 折扣
 * @property {number} total - 總金額
 * @property {string} customerType - 客戶類型
 * @property {string} customerName - 客戶名稱
 * @property {string} address - 地址
 * @property {string} phone - 電話
 * @property {string} status - 訂單狀態
 * @property {Date} createdAt - 建立時間
 * @property {Date} estimatedDelivery - 預計到貨日
 */

// 可依需求改為 class 或 TypeScript interface
