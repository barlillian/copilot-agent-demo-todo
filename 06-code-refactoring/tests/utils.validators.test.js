// 單元測試：validators.js
const v = require("../src/utils/validators")
describe("validators.js 驗證工具", () => {
  it("isValidEmail 應驗證 email 格式", () => {
    expect(v.isValidEmail("a@b.com")).toBe(true)
    expect(v.isValidEmail("abc")).toBe(false)
  })
  it("isValidPassword 應驗證密碼長度", () => {
    expect(v.isValidPassword("123456")).toBe(true)
    expect(v.isValidPassword("123")).toBe(false)
  })
  it("isValidName 應驗證姓名長度", () => {
    expect(v.isValidName("王小明")).toBe(true)
    expect(v.isValidName("")).toBe(false)
  })
  it("isValidPhone 應驗證電話格式", () => {
    expect(v.isValidPhone("0912345678")).toBe(true)
    expect(v.isValidPhone("123")).toBe(false)
  })
  it("validateProduct 應驗證商品資料", () => {
    const valid = v.validateProduct({
      name: "商品A",
      price: 100,
      description: "這是一個合格的商品描述文字",
      category: "test"
    })
    expect(valid.valid).toBe(true)
    const invalid = v.validateProduct({ name: "A", price: -1, description: "短", category: 1 })
    expect(invalid.valid).toBe(false)
    expect(invalid.errors.length).toBeGreaterThan(0)
  })
})
