// OrderService 模組
// 專責訂單處理、計算、狀態管理

const {
  TAX_RATE,
  SHIPPING_COST,
  VIP_DISCOUNT,
  PREMIUM_DISCOUNT,
  FREE_SHIPPING_THRESHOLD
} = require("./constants")

/**
 * @typedef {import("./models").Order} Order
 * @typedef {import("./models").Customer} Customer
 * @typedef {import("./models").Product} Product
 */

class OrderService {
  /**
   * @param {import("./dataRepository")} dataRepository
   * @param {import("./productService")} productService
   * @param {import("./customerService")} customerService
   */
  constructor(dataRepository, productService, customerService) {
    this.dataRepository = dataRepository
    this.productService = productService
    this.customerService = customerService
  }

  /**
   * 建立新訂單
   * @param {Object} params
   * @param {string} params.productName
   * @param {number} params.quantity
   * @param {number} params.price
   * @param {string} params.customerType
   * @param {string} params.customerName
   * @param {string} params.address
   * @param {string} params.phone
   * @returns {Object} 結果物件
   */
  createOrder({ productName, quantity, price, customerType, customerName, address, phone }) {
    // 輸入驗證（簡化版）
    if (!productName || typeof quantity !== "number" || typeof price !== "number" || !customerType) {
      return { success: false, message: "缺少必要參數" }
    }
    if (isNaN(quantity) || quantity <= 0) {
      return { success: false, message: "數量必須大於0" }
    }
    if (isNaN(price) || price <= 0) {
      return { success: false, message: "價格必須大於0" }
    }

    // 商品查詢與庫存檢查
    const product = this.productService.getProductByName(productName)
    if (!product) {
      return { success: false, message: `找不到商品：${productName}` }
    }
    if (product.stock < quantity) {
      return { success: false, message: `庫存不足，可用數量：${product.stock}` }
    }

    // 計算金額
    const subtotal = price * quantity
    const tax = subtotal * TAX_RATE
    let shipping = SHIPPING_COST
    let discount = 0

    if (customerType === "vip") {
      discount = subtotal * VIP_DISCOUNT
      shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : shipping * 0.5
    } else if (customerType === "premium") {
      discount = subtotal * PREMIUM_DISCOUNT
      shipping = 0
      // 修正：滿 2000 元（含）即額外 5% 折扣
      if (subtotal >= 2000) discount += subtotal * 0.05
    } else if (customerType === "regular") {
      if (subtotal > FREE_SHIPPING_THRESHOLD) shipping = 0
      if (subtotal < 200) shipping += 30
    } else {
      return { success: false, message: "無效的客戶類型" }
    }

    const total = subtotal + tax + shipping - discount

    // 扣庫存
    this.productService.updateStock(productName, product.stock - quantity)

    // 訂單物件
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const order = {
      id: orderId,
      productName,
      quantity,
      price,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      customerType,
      customerName,
      address,
      phone,
      status: "pending",
      createdAt: new Date(),
      estimatedDelivery: this.calculateDeliveryDate(customerType, address)
    }
    this.dataRepository.addOrder(order)

    // 客戶資料更新
    let customer = this.customerService.getCustomerByName(customerName)
    if (customer) {
      this.customerService.updateCustomer(customerName, c => {
        c.totalOrders += 1
        c.totalSpent += total
      })
    } else {
      this.customerService.addCustomer({
        name: customerName,
        type: customerType,
        phone,
        address,
        totalOrders: 1,
        totalSpent: total,
        joinDate: new Date()
      })
    }

    return {
      success: true,
      orderId,
      total,
      message: "訂單處理成功",
      details: { subtotal, tax, shipping, discount, estimatedDelivery: order.estimatedDelivery }
    }
  }

  /**
   * 計算預計到貨日
   * @param {string} customerType
   * @param {string} address
   * @returns {Date}
   */
  calculateDeliveryDate(customerType, address) {
    let deliveryDays = 7
    if (customerType === "premium") deliveryDays = 1
    else if (customerType === "vip") deliveryDays = 2
    if (address && (address.includes("台北") || address.includes("新北"))) deliveryDays -= 1
    else if (address && (address.includes("花蓮") || address.includes("台東"))) deliveryDays += 2
    else if (address && address.includes("離島")) deliveryDays += 5
    return new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000)
  }

  /**
   * 查詢訂單狀態
   * @param {string} orderId
   * @returns {string}
   */
  getOrderStatus(orderId) {
    const order = this.dataRepository.getOrderById(orderId)
    return order ? order.status : "Order not found"
  }

  /**
   * 更新訂單狀態
   * @param {string} orderId
   * @param {string} newStatus
   * @returns {boolean}
   */
  updateOrderStatus(orderId, newStatus) {
    const order = this.dataRepository.getOrderById(orderId)
    if (!order) return false
    order.status = newStatus
    return true
  }

  /**
   * 查詢客戶所有訂單
   * @param {string} customerName
   * @returns {Order[]}
   */
  getCustomerOrders(customerName) {
    return this.dataRepository.getAllOrders().filter(o => o.customerName === customerName)
  }

  /**
   * 取得前 N 名消費者
   * @param {number} n
   * @returns {Customer[]}
   */
  getTopCustomers(n = 10) {
    return this.dataRepository.getAllCustomers()
      .slice()
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, n)
  }
}

module.exports = OrderService
