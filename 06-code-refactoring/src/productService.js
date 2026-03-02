// ProductService 模組
// 專責商品查詢、驗證、庫存管理

/**
 * @typedef {import("./models").Product} Product
 */

class ProductService {
  /**
   * @param {import("./dataRepository")} dataRepository
   */
  constructor(dataRepository) {
    this.dataRepository = dataRepository
  }

  /**
   * 取得所有商品
   * @returns {Product[]}
   */
  getAllProducts() {
    return this.dataRepository.getAllProducts()
  }

  /**
   * 依名稱查詢商品
   * @param {string} name
   * @returns {Product|null}
   */
  getProductByName(name) {
    return this.dataRepository.getProductByName(name) || null
  }

  /**
   * 新增商品
   * @param {Product} product
   */
  addProduct(product) {
    // TODO: 可加驗證
    this.dataRepository.addProduct(product)
  }

  /**
   * 更新商品庫存
   * @param {string} name
   * @param {number} newStock
   */
  updateStock(name, newStock) {
    this.dataRepository.updateProductStock(name, newStock)
  }
}

module.exports = ProductService
