// 效能測試：OrderService
const DataRepository = require("../src/dataRepository")
const ProductService = require("../src/productService")
const CustomerService = require("../src/customerService")
const OrderService = require("../src/orderService")
describe("OrderService 效能測試", () => {
  let repo, ps, cs, os
  beforeEach(() => {
    repo = new DataRepository()
    ps = new ProductService(repo)
    cs = new CustomerService(repo)
    os = new OrderService(repo, ps, cs)
    ps.addProduct({ name: "A", price: 100, stock: 10000 })
  })
  it("大量下單效能應優於 200ms", () => {
    const t0 = Date.now()
    for (let i = 0; i < 1000; i++) {
      os.createOrder({
        productName: "A",
        quantity: 1,
        price: 100,
        customerType: "regular",
        customerName: `user${i}`,
        address: "台北市",
        phone: "0912000000"
      })
    }
    const t1 = Date.now()
    expect(t1 - t0).toBeLessThan(200)
    expect(repo.getAllOrders().length).toBe(1000)
  })
})
