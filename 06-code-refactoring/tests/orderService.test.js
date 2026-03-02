// 單元測試：OrderService
const DataRepository = require("../src/dataRepository")
const ProductService = require("../src/productService")
const CustomerService = require("../src/customerService")
const OrderService = require("../src/orderService")
describe("OrderService", () => {
  let repo, ps, cs, os
  beforeEach(() => {
    repo = new DataRepository()
    ps = new ProductService(repo)
    cs = new CustomerService(repo)
    os = new OrderService(repo, ps, cs)
    // 商品 A：庫存 10，供一般/庫存不足測試使用
    ps.addProduct({ name: "A", price: 100, stock: 10, description: "這是一個合格的商品描述文字", category: "test" })
    // 商品 B：庫存 100，供 premium 折扣測試使用
    ps.addProduct({ name: "B", price: 100, stock: 100, description: "Premium 測試商品", category: "vip" })
  })
  it("應能正確下單並扣庫存", () => {
    const result = os.createOrder({
      productName: "A",
      quantity: 2,
      price: 100,
      customerType: "vip",
      customerName: "王小明",
      address: "台北市",
      phone: "0912345678"
    })
    expect(result.success).toBe(true)
    expect(repo.getProductByName("A").stock).toBe(8)
    expect(repo.getAllOrders().length).toBe(1)
  })
  it("應處理庫存不足情境", () => {
    const result = os.createOrder({
      productName: "A",
      quantity: 20,
      price: 100,
      customerType: "vip",
      customerName: "王小明",
      address: "台北市",
      phone: "0912345678"
    })
    expect(result.success).toBe(false)
    expect(result.message).toMatch(/庫存不足/)
  })
  it("應正確計算折扣與運費", () => {
    // premium 客戶 subtotal >= 2000 觸發額外 5% 折扣
    const result = os.createOrder({
      productName: "B",
      quantity: 20,
      price: 100,
      customerType: "premium",
      customerName: "李小華",
      address: "新北市",
      phone: "0987654321"
    })
    expect(result.success).toBe(true)
    expect(result.details.discount).toBeGreaterThan(0)
    expect(result.details.shipping).toBe(0)
  })
})
