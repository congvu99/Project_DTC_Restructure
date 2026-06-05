import Swal, { type SweetAlertOptions } from 'sweetalert2';

/**
 * Cấu hình chung cho Toast (Thông báo góc màn hình)
 */
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

/**
 * Common Alert Service tuân thủ Clean Code - Tái sử dụng toàn hệ thống
 */
export const AlertService = {
  // ==========================================
  // TOAST NOTIFICATIONS (Thông báo nhanh)
  // ==========================================
  
  toastSuccess: (title: string) => {
    return Toast.fire({
      icon: 'success',
      title: title
    });
  },

  toastError: (title: string) => {
    return Toast.fire({
      icon: 'error',
      title: title
    });
  },

  toastWarning: (title: string) => {
    return Toast.fire({
      icon: 'warning',
      title: title
    });
  },

  toastInfo: (title: string) => {
    return Toast.fire({
      icon: 'info',
      title: title
    });
  },

  // ==========================================
  // CONFIRMATION DIALOGS (Xác nhận hành động)
  // ==========================================

  /**
   * Popup xác nhận tiêu chuẩn (Ví dụ: Bạn có muốn tiếp tục?)
   */
  confirm: async (title: string, text: string = '', confirmButtonText: string = 'Đồng ý', cancelButtonText: string = 'Hủy') => {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1e40af', // --primary từ CSS
      cancelButtonColor: '#64748b',  // --text-muted
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      focusCancel: true
    });
    return result.isConfirmed;
  },

  /**
   * Popup xác nhận hành động nguy hiểm (Ví dụ: Xóa dữ liệu)
   */
  confirmDelete: async (title: string = 'Bạn có chắc chắn muốn xóa?', text: string = 'Hành động này không thể hoàn tác!') => {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626', // red-600
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Vâng, xóa nó!',
      cancelButtonText: 'Hủy',
      focusCancel: true
    });
    return result.isConfirmed;
  },

  // ==========================================
  // ALERTS (Thông báo tĩnh ở giữa màn hình)
  // ==========================================

  success: (title: string, text?: string) => {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonColor: '#10b981' // --secondary
    });
  },

  error: (title: string, text?: string) => {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonColor: '#dc2626'
    });
  },

  warning: (title: string, text?: string) => {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
      confirmButtonColor: '#f59e0b'
    });
  },

  /**
   * Custom Alert: Dùng khi cần cấu hình sâu hơn
   */
  custom: (options: SweetAlertOptions) => {
    return Swal.fire(options);
  }
};
