import { useState } from 'react';
import '@progress/kendo-theme-default/dist/all.css';
import apiClient from '../../../utils/apiClient';
import { AlertService } from '../../../utils/alert';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Gọi API qua tầng apiClient dùng chung
      const data = await apiClient.post('/quan-tri/auth/login', { username, password }) as { token: string };

      localStorage.setItem('token', data.token);
      
      AlertService.toastSuccess('Đăng nhập thành công!');
      // Chuyển hướng sang trang Quản trị
      navigate('/admin/users');
      
    } catch (err: unknown) {
      console.error('Login error:', err);
      const msg = err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(msg);
      // Hiển thị thêm thông báo nhanh
      AlertService.toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <div className="k-card k-card-shadow" style={{ width: '400px', padding: '20px' }}>
        <h2 className="k-card-title k-text-center">Hệ thống Đầu Tư Công</h2>
        <h4 className="k-card-subtitle k-text-center">Đăng nhập</h4>
        <hr className="k-card-separator" />
        <div className="k-card-body">
          <form onSubmit={handleLogin} className="k-form k-form-horizontal">
            {error && <div className="k-messagebox k-messagebox-error" style={{ marginBottom: '15px' }}>{error}</div>}
            
            <div className="k-form-field">
              <label className="k-label" htmlFor="username">Tài khoản</label>
              <div className="k-form-field-wrap">
                <input 
                  id="username"
                  type="text" 
                  className="k-textbox k-input k-input-md k-rounded-md k-input-solid" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="k-form-field" style={{ marginTop: '15px' }}>
              <label className="k-label" htmlFor="password">Mật khẩu</label>
              <div className="k-form-field-wrap">
                <input 
                  id="password"
                  type="password" 
                  className="k-textbox k-input k-input-md k-rounded-md k-input-solid" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="k-form-buttons" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
              <button 
                type="submit" 
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                style={{ width: '100%' }}
                disabled={loading}
              >
                <span className="k-button-text">{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
