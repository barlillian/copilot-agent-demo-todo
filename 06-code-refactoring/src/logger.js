// Logger 模組
// 集中日誌管理，方便除錯與稽核

class Logger {
  constructor() {
    this.logs = []
  }

  /**
   * 記錄訊息
   * @param {string} level - 日誌等級（info, warn, error）
   * @param {string} message - 訊息內容
   * @param {Object} [meta] - 其他資料
   */
  log(level, message, meta = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta
    }
    this.logs.push(entry)
    if (level === "error") {
      console.error(`[${entry.timestamp}] [${level}] ${message}`)
    } else {
      console.log(`[${entry.timestamp}] [${level}] ${message}`)
    }
  }

  info(message, meta) {
    this.log("info", message, meta)
  }
  warn(message, meta) {
    this.log("warn", message, meta)
  }
  error(message, meta) {
    this.log("error", message, meta)
  }

  /**
   * 取得所有日誌
   */
  getLogs() {
    return [...this.logs]
  }

  /**
   * 清除日誌
   */
  clear() {
    this.logs = []
  }
}

module.exports = Logger
