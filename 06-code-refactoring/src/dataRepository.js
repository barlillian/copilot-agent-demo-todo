// DataRepository 模組
// 提供記憶體型資料存取，未來可擴充為檔案或資料庫

/**
 * @typedef {import("./models").Product} Product
 * @typedef {import("./models").Customer} Customer
 * @typedef {import("./models").Order} Order
 */

class DataRepository {
  constructor() {
    /** @type {Product[]} */
    this.products = []
    /** @type {Customer[]} */
    this.customers = []
    /** @type {Order[]} */
    this.orders = []
  }

  // 產品操作
  getAllProducts() {
    return [...this.products]
  }
  getProductByName(name) {
    return this.products.find(p => p.name === name)
  }
  addProduct(product) {
    this.products.push(product)
  }
  updateProductStock(name, quantity) {
    const product = this.getProductByName(name)
    if (product) product.stock = quantity
  }

  // 客戶操作
  getAllCustomers() {
    return [...this.customers]
  }
  getCustomerByName(name) {
    return this.customers.find(c => c.name === name)
  }
  addCustomer(customer) {
    this.customers.push(customer)
  }
  updateCustomer(name, updateFn) {
    const customer = this.getCustomerByName(name)
    if (customer) updateFn(customer)
  }

  // 訂單操作
  getAllOrders() {
    return [...this.orders]
  }
  getOrderById(id) {
    return this.orders.find(o => o.id === id)
  }
  addOrder(order) {
    this.orders.push(order)
  }
  updateOrderStatus(id, status) {
    const order = this.getOrderById(id)
    if (order) order.status = status
  }

  // 清空所有資料（測試用）
  clearAll() {
    this.products = []
    this.customers = []
    this.orders = []
  }
}

module.exports = DataRepository
