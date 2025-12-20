import CryptoJS from "crypto-js";

// Hàm mã hóa số tiền
export function encryptAmount(amount, secretKey) {
    // Chuyển số tiền sang chuỗi
    const amountString = amount.toString();
    // Mã hóa bằng AES
    const encrypted = CryptoJS.AES.encrypt(amountString, secretKey).toString();
    return encrypted;
}

// // Ví dụ sử dụng
// const secretKey = "my-secret-key"; // Khóa bí mật (chia sẻ giữa frontend và backend)
// const amount = 12345.67; // Số tiền cần mã hóa
// const encryptedAmount = encryptAmount(amount, secretKey);
// console.log("Số tiền đã mã hóa:", encryptedAmount);
