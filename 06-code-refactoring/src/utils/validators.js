// 資料驗證與格式化工具
// 純函數，無副作用，便於測試

/**
 * 驗證 email 格式
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return typeof email === "string" && email.includes("@") && email.length >= 5
}

/**
 * 驗證密碼長度
 * @param {string} password
 * @returns {boolean}
 */
function isValidPassword(password) {
  return typeof password === "string" && password.length >= 6 && password.length <= 50
}

/**
 * 驗證姓名
 * @param {string} name
 * @returns {boolean}
 */
function isValidName(name) {
  return typeof name === "string" && name.trim().length >= 2 && name.trim().length <= 100
}

/**
 * 驗證電話號碼（10或11碼數字）
 * @param {string} phone
 * @returns {boolean}
 */
function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, "")
  return digits.length === 10 || digits.length === 11
}

/**
 * 驗證商品資料
 * @param {Object} product
 * @returns {{valid: boolean, errors: string[]}}
 */
function validateProduct(product) {
  const errors = []
  if (!product.name || typeof product.name !== "string" || product.name.trim().length < 3 || product.name.trim().length > 200) {
    errors.push("Product name must be between 3 and 200 characters")
  }
  if (typeof product.price !== "number" || isNaN(product.price) || product.price <= 0 || product.price > 999999) {
    errors.push("Product price must be a positive number less than 1,000,000")
  }
  if (!product.description || typeof product.description !== "string" || product.description.length < 10 || product.description.length > 2000) {
    errors.push("Product description must be between 10 and 2000 characters")
  }
  if (!product.category || typeof product.category !== "string") {
    errors.push("Product category is required")
  }
  if (product.sku && (typeof product.sku !== "string" || product.sku.length < 3 || product.sku.length > 50)) {
    errors.push("SKU must be between 3 and 50 characters")
  }
  if (product.weight && (typeof product.weight !== "number" || isNaN(product.weight) || product.weight <= 0 || product.weight > 1000)) {
    errors.push("Product weight must be between 0 and 1000 kg")
  }
  if (product.dimensions) {
    if (product.dimensions.length && (typeof product.dimensions.length !== "number" || isNaN(product.dimensions.length) || product.dimensions.length <= 0)) {
      errors.push("Invalid length dimension")
    }
    if (product.dimensions.width && (typeof product.dimensions.width !== "number" || isNaN(product.dimensions.width) || product.dimensions.width <= 0)) {
      errors.push("Invalid width dimension")
    }
    if (product.dimensions.height && (typeof product.dimensions.height !== "number" || isNaN(product.dimensions.height) || product.dimensions.height <= 0)) {
      errors.push("Invalid height dimension")
    }
  }
  return { valid: errors.length === 0, errors }
}

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidPhone,
  validateProduct
}
