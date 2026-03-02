/**
 * 測試輔助工具
 * 提供常用的 mock、資料工廠、重置等功能
 * @author Copilot
 */

/**
 * 重置所有 mock
 */
const resetAllMocks = () => {
  jest.clearAllMocks()
  jest.resetAllMocks()
  jest.restoreAllMocks()
}

/**
 * 延遲指定毫秒（for async 測試）
 * @param {number} ms
 * @returns {Promise<void>}
 */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = {
  resetAllMocks,
  delay
}
