// CustomerService 模組
// 專責客戶查詢、註冊、消費統計

/**
 * @typedef {import("./models").Customer} Customer
 */

class CustomerService {
  /**
   * @param {import("./dataRepository")} dataRepository
   */
  constructor(dataRepository) {
    this.dataRepository = dataRepository
  }

  /**
   * 取得所有客戶
   * @returns {Customer[]}
   */
  getAllCustomers() {
    return this.dataRepository.getAllCustomers()
  }

  /**
   * 依名稱查詢客戶
   * @param {string} name
   * @returns {Customer|null}
   */
  getCustomerByName(name) {
    return this.dataRepository.getCustomerByName(name) || null
  }

  /**
   * 新增客戶
   * @param {Customer} customer
   */
  addCustomer(customer) {
    this.dataRepository.addCustomer(customer)
  }

  /**
   * 更新客戶統計
   * @param {string} name
   * @param {(customer: Customer) => void} updateFn
   */
  updateCustomer(name, updateFn) {
    this.dataRepository.updateCustomer(name, updateFn)
  }
}

module.exports = CustomerService
