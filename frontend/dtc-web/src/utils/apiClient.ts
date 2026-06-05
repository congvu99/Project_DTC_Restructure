import axios from 'axios';
import { AlertService } from './alert';

// Khởi tạo instance của Axios với các cấu hình mặc định
const apiClient = axios.create({
  // baseURL được để trống để tự động lấy host hiện tại, sau đó Vite proxy sẽ tự forward sang /api
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Timeout 30 giây
});

// Request Interceptor: Tự động gắn Token vào mọi request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Nếu có token, nhét vào header Authorization
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Bắt lỗi chung của toàn hệ thống
apiClient.interceptors.response.use(
  (response) => {
    // Trả về thẳng data để code gọi ở các trang ngắn gọn hơn
    return response.data;
  },
  (error) => {
    // Xử lý các mã lỗi HTTP phổ biến
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        // Hết hạn token hoặc chưa đăng nhập -> Có thể ép văng ra trang Login
        AlertService.toastWarning("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        // window.location.href = '/login'; 
      } else if (status === 403) {
        AlertService.toastError("Bạn không có quyền truy cập chức năng này.");
      } else if (status === 500) {
        AlertService.error("Lỗi máy chủ", "Đã có lỗi xảy ra từ phía máy chủ (500).");
      }
      
      // Trả về message lỗi từ Server nếu có, nếu không thì lấy lỗi mặc định của Axios
      const serverMessage = error.response.data?.message || error.message;
      return Promise.reject(new Error(serverMessage));
    } else if (error.request) {
      // Server không phản hồi (chết API, rớt mạng...)
      AlertService.error("Lỗi kết nối", "Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng.");
      return Promise.reject(new Error("Lỗi kết nối tới máy chủ API. Vui lòng kiểm tra lại đường truyền."));
    } else {
      // Lỗi do code ở Frontend
      return Promise.reject(new Error(error.message));
    }
  }
);

export default apiClient;
