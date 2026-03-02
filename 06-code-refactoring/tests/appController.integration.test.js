// 整合測試：AppController
const AppController = require("../src/appController")
describe("AppController 業務流程整合測試", () => {
  let app
  beforeEach(() => { app = new AppController() })
  it("完整下單流程應正確執行並發送通知", () => {
    app.productService.addProduct({ name: "B", price: 200, stock: 5 })
    const result = app.processOrder({
      productName: "B",
      quantity: 2,
      price: 200,
      customerType: "vip",
      customerName: "王小明",
      address: "台北市",
      phone: "0912345678"
    })
    expect(result.success).toBe(true)
    expect(app.dataRepository.getProductByName("B").stock).toBe(3)
    expect(app.dataRepository.getAllOrders().length).toBe(1)
    expect(app.dataRepository.getCustomerByName("王小明")).not.toBeNull()
  })
  it("異常流程應正確回報錯誤", () => {
    const result = app.processOrder({
      productName: "X",
      quantity: 1,
      price: 100,
      customerType: "vip",
      customerName: "王小明",
      address: "台北市",
      phone: "0912345678"
    })
    expect(result.success).toBe(false)
    expect(result.message).toMatch(/找不到商品/)
  })
})
