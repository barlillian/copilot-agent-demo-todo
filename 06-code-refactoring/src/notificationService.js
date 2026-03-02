// NotificationService 模組
// 專責發送 Email/SMS 通知，便於未來擴充

class NotificationService {
  /**
   * 發送 Email 通知
   * @param {string} toName
   * @param {string} subject
   * @param {string} content
   */
  sendEmail(toName, subject, content) {
    // 實際專案可整合第三方服務
    console.log(`📧 [Email] To: ${toName} | Subject: ${subject} | Content: ${content}`)
    return true
  }

  /**
   * 發送 SMS 通知
   * @param {string} phone
   * @param {string} message
   */
  sendSMS(phone, message) {
    // 實際專案可整合第三方服務
    console.log(`📱 [SMS] To: ${phone} | Message: ${message}`)
    return true
  }
}

module.exports = NotificationService
