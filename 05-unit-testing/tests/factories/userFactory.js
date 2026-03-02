/**
 * 使用者資料工廠
 * 產生各種測試用的使用者物件
 * @author Copilot
 */

const faker = require("@faker-js/faker").faker

/**
 * 產生單一使用者
 * @param {object} overrides 覆蓋欄位
 */
const createUser = (overrides = {}) => ({
  id: faker.datatype.uuid(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
  age: faker.datatype.number({ min: 18, max: 80 }),
  phone: faker.phone.number(),
  ...overrides
})

/**
 * 產生多個使用者
 * @param {number} count
 * @param {object} overrides
 */
const createUsers = (count = 5, overrides = {}) =>
  Array.from({ length: count }, () => createUser(overrides))

module.exports = {
  createUser,
  createUsers
}
