// 自訂錯誤類型

class AppError extends Error {
  constructor(message, code = "APP_ERROR") {
    super(message)
    this.name = "AppError"
    this.code = code
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, "VALIDATION_ERROR")
    this.name = "ValidationError"
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, "NOT_FOUND")
    this.name = "NotFoundError"
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError
}
