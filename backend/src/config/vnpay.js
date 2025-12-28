import crypto from 'crypto';
import querystring from 'querystring';

// VNPay Configuration
export const vnpayConfig = {
  vnp_TmnCode: 'X53UBDF2',
  vnp_HashSecret: 'H7C1GEAXW97BR5PQAJQJ55FN821MPAA6',
  vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnp_ReturnUrl: 'https://expo-ecommerce-wrd1.onrender.com/api/payment/vnpay/return'
};

/**
 * Sort object by key
 */
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach(key => {
    sorted[key] = obj[key];
  });
  return sorted;
}

/**
 * Create VNPay payment URL
 * @param {string} orderId - Order ID
 * @param {number} amount - Payment amount in VND
 * @param {string} orderInfo - Order description
 * @param {string} ipAddr - Client IP address
 * @returns {string} VNPay payment URL
 */
export function createVNPayUrl(orderId, amount, orderInfo, ipAddr) {
  const date = new Date();
  const createDate = formatDate(date);
  const expireDate = formatDate(new Date(date.getTime() + 15 * 60 * 1000)); // 15 minutes

  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: vnpayConfig.vnp_TmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: String(orderId),
    vnp_OrderInfo: String(orderInfo),
    vnp_OrderType: 'other',
    vnp_Amount: String(amount * 100), // VNPay requires amount in smallest unit (VND * 100)
    vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
    vnp_IpAddr: String(ipAddr),
    vnp_CreateDate: String(createDate),
    vnp_ExpireDate: String(expireDate)
  };

  // Sort params
  vnp_Params = sortObject(vnp_Params);

  // Create signature data string manually to ensure proper encoding
  const signDataArray = [];
  for (const key in vnp_Params) {
    if (vnp_Params.hasOwnProperty(key)) {
      signDataArray.push(`${key}=${encodeURIComponent(vnp_Params[key])}`);
    }
  }
  const signData = signDataArray.join('&');
  
  const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;

  // Create payment URL
  const urlParams = [];
  for (const key in vnp_Params) {
    if (vnp_Params.hasOwnProperty(key)) {
      urlParams.push(`${key}=${encodeURIComponent(vnp_Params[key])}`);
    }
  }
  const paymentUrl = vnpayConfig.vnp_Url + '?' + urlParams.join('&');
  
  console.log('🔍 VNPay Params:', vnp_Params);
  console.log('🔐 Sign Data:', signData);
  
  return paymentUrl;
}

/**
 * Verify VNPay return signature
 * @param {object} vnpParams - VNPay return parameters
 * @returns {boolean} True if signature is valid
 */
export function verifyVNPaySignature(vnpParams) {
  const secureHash = vnpParams['vnp_SecureHash'];
  delete vnpParams['vnp_SecureHash'];
  delete vnpParams['vnp_SecureHashType'];

  // Sort params
  const sortedParams = sortObject(vnpParams);
  
  // Create signature data string manually to match creation method
  const signDataArray = [];
  for (const key in sortedParams) {
    if (sortedParams.hasOwnProperty(key)) {
      signDataArray.push(`${key}=${encodeURIComponent(sortedParams[key])}`);
    }
  }
  const signData = signDataArray.join('&');
  
  const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  console.log('🔍 Verify - Sign Data:', signData);
  console.log('🔐 Verify - Expected:', secureHash);
  console.log('🔐 Verify - Calculated:', signed);
  console.log('✅ Verify - Match:', secureHash === signed);

  return secureHash === signed;
}

/**
 * Format date to VNPay format (yyyyMMddHHmmss) in Vietnam timezone
 */
function formatDate(date) {
  // Convert to Vietnam timezone (UTC+7)
  const vnDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  
  const year = vnDate.getFullYear();
  const month = String(vnDate.getMonth() + 1).padStart(2, '0');
  const day = String(vnDate.getDate()).padStart(2, '0');
  const hours = String(vnDate.getHours()).padStart(2, '0');
  const minutes = String(vnDate.getMinutes()).padStart(2, '0');
  const seconds = String(vnDate.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Get VNPay response message
 */
export function getVNPayResponseMessage(responseCode) {
  const messages = {
    '00': 'Giao dịch thành công',
    '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
    '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
    '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
    '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
    '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
    '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
    '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
    '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
    '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
    '75': 'Ngân hàng thanh toán đang bảo trì.',
    '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
    '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
  };
  
  return messages[responseCode] || 'Lỗi không xác định';
}
