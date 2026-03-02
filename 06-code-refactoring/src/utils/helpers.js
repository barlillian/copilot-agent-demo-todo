// 共用工具函數（純函數）

/**
 * 深度複製物件（不處理特殊型別）
 * @param {any} obj
 * @returns {any}
 */
function deepCopy(obj) {
  if (obj === null || typeof obj !== "object") return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (Array.isArray(obj)) return obj.map(deepCopy)
  const copy = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepCopy(obj[key])
    }
  }
  return copy
}

/**
 * 日期格式化（YYYY-MM-DD HH:mm:ss）
 * @param {Date|string} date
 * @returns {string}
 */
function formatDate(date) {
  if (!date) date = new Date()
  if (typeof date === "string") date = new Date(date)
  const y = date.getFullYear()
  const m = (date.getMonth() + 1).toString().padStart(2, "0")
  const d = date.getDate().toString().padStart(2, "0")
  const h = date.getHours().toString().padStart(2, "0")
  const min = date.getMinutes().toString().padStart(2, "0")
  const s = date.getSeconds().toString().padStart(2, "0")
  return `${y}-${m}-${d} ${h}:${min}:${s}`
}

/**
 * 產生 SKU
 * @param {string} name
 * @param {string} category
 * @returns {string}
 */
function generateSKU(name, category) {
  // 保證 SKU 至少 10 字元
  const namePrefix = (name || "XXX").substring(0, 3).toUpperCase().replace(/[^A-Z]/g, "X").padEnd(3, "X")
  const categoryPrefix = (category || "XX").substring(0, 2).toUpperCase().replace(/[^A-Z]/g, "X").padEnd(2, "X")
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0")
  // namePrefix(3) + categoryPrefix(2) + timestamp(6) + random(4) = 15
  return namePrefix + categoryPrefix + timestamp + random
}

module.exports = {
  deepCopy,
  formatDate,
  generateSKU
}
