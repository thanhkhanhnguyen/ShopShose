import jwt from "jsonwebtoken";

export const getUserName = (token) => {
  if (token) {
    try {
      // Giải mã token sử dụng secret key (key được sử dụng khi tạo token)
      const decoded = jwt.verify(token, "your-secret-key");

      // Lưu thông tin đã giải mã vào state
      return decoded;
    } catch (error) {
      // Xử lý lỗi khi giải mã token không thành công
      console.error("Error decoding token:", error.message);
    }
  }
};
