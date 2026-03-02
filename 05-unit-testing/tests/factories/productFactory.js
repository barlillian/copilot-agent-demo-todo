/**
 * 商品資料工廠
 * 產生各種測試用的商品物件
 * @author Copilot
 */

const faker = require("@faker-js/faker").faker

const createProduct = (overrides = {}) => ({
  id: faker.datatype.uuid(),
  name: faker.commerce.productName(),
  price: faker.commerce.price(10, 1000),
  stock: faker.datatype.number({ min: 0, max: 100 }),
  ...overrides
})

const createProducts = (count = 5, overrides = {}) =>
  Array.from({ length: count }, () => createProduct(overrides))

module.exports = {
  createProduct,
  createProducts
}
