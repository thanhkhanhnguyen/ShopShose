import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

const secretKey = "sjfifuldtzykjgzepydmsvdqgppmrrck";

export const getUserName = (token) => {
  if (token) {
    try {
      // Giải mã token sử dụng secret key (key được sử dụng khi tạo token)
      // const decoded = jwt.verify(token, secretKey);

      const decodedHeader = jwtDecode(token);

      // Lưu thông tin đã giải mã vào state
      return decodedHeader.Id;
    } catch (error) {
      // Xử lý lỗi khi giải mã token không thành công
      console.error("Error decoding token:", error.message);
    }
  }
};

export const getName = (token) => {
  if (token) {
    try {
      // Giải mã token sử dụng secret key (key được sử dụng khi tạo token)
      // const decoded = jwt.verify(token, secretKey);

      const decodedHeader = jwtDecode(token);
      const emailAddress =
        decodedHeader[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ];

      // Lưu thông tin đã giải mã vào state
      return emailAddress.split("@")[0];
    } catch (error) {
      // Xử lý lỗi khi giải mã token không thành công
      console.error("Error decoding token:", error.message);
    }
  }
};
