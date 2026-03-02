// AppController 模組
// 統一協調各服務，作為應用進入點

const DataRepository = require("./dataRepository")
const ProductService = require("./productService")
const CustomerService = require("./customerService")
const OrderService = require("./orderService")
const NotificationService = require("./notificationService")
const Logger = require("./logger")

class AppController {
  constructor() {
    this.dataRepository = new DataRepository()
    this.productService = new ProductService(this.dataRepository)
    this.customerService = new CustomerService(this.dataRepository)
    this.orderService = new OrderService(
      this.dataRepository,
      this.productService,
      this.customerService
    )
    this.notificationService = new NotificationService()
    this.logger = new Logger()
  }

  /**
   * 下單流程
   * @param {Object} params
   */
  processOrder(params) {
    try {
      const result = this.orderService.createOrder(params)
      if (result.success) {
        // 通知發送
        if (["vip", "premium"].includes(params.customerType)) {
          this.notificationService.sendEmail(
            params.customerName,
            "您的訂單已確認",
            `訂單編號：${result.orderId}`
          )
        } else {
          this.notificationService.sendSMS(
            params.phone,
            `訂單確認：${result.orderId}`
          )
        }
        this.logger.info("訂單處理成功", { orderId: result.orderId })
      } else {
        this.logger.warn("訂單處理失敗", { message: result.message })
      }
      return result
    } catch (err) {
      this.logger.error("訂單處理例外", { error: err.message })
      return { success: false, message: "系統錯誤，請稍後再試" }
    }
  }

  // 其他協調方法可依需求擴充
}

module.exports = AppController
