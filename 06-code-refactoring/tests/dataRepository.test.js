// 單元測試：DataRepository
const DataRepository = require("../src/dataRepository")
describe("DataRepository", () => {
  let repo
  beforeEach(() => { repo = new DataRepository() })
  it("應能新增/查詢商品", () => {
    repo.addProduct({ name: "A", price: 1, stock: 2 })
    expect(repo.getProductByName("A").price).toBe(1)
  })
  it("應能新增/查詢客戶", () => {
    repo.addCustomer({ name: "B", type: "vip" })
    expect(repo.getCustomerByName("B").type).toBe("vip")
  })
  it("應能新增/查詢訂單", () => {
    repo.addOrder({ id: "O1", productName: "A" })
    expect(repo.getOrderById("O1").productName).toBe("A")
  })
  it("應能更新商品庫存", () => {
    repo.addProduct({ name: "A", price: 1, stock: 2 })
    repo.updateProductStock("A", 5)
    expect(repo.getProductByName("A").stock).toBe(5)
  })
  it("clearAll 應清空所有資料", () => {
    repo.addProduct({ name: "A", price: 1, stock: 2 })
    repo.clearAll()
    expect(repo.getAllProducts().length).toBe(0)
  })
})
