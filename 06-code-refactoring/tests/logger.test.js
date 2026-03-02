// 單元測試：Logger
const Logger = require("../src/logger")
describe("Logger", () => {
  let logger
  beforeEach(() => { logger = new Logger() })
  it("應能記錄 info/warn/error", () => {
    logger.info("info")
    logger.warn("warn")
    logger.error("error")
    const logs = logger.getLogs()
    expect(logs.length).toBe(3)
    expect(logs[0].level).toBe("info")
    expect(logs[2].level).toBe("error")
  })
  it("clear 應清空日誌", () => {
    logger.info("a")
    logger.clear()
    expect(logger.getLogs().length).toBe(0)
  })
})
