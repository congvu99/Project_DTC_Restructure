import { Outlet, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import TopMenu from '../../../components/layout/TopMenu';
import AppBreadcrumb from '../../../components/layout/AppBreadcrumb';

const LayoutContainer = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
`;

const Header = styled.header`
  height: 50px;
  background-color: #004494;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
`;

const LogoutButton = styled.button`
  background-color: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ContentArea = styled.main`
  flex: 1;
  overflow: auto;
  background-color: var(--bg-color);
  display: flex;
  flex-direction: column;
`;


const OutletWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 15px 20px 20px 20px;
`;

export default function AdminLayout() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <LayoutContainer>
      {/* Topbar: Logo & Logout */}
      <Header>
        <Title>HỆ THỐNG QUẢN LÝ ĐẦU TƯ CÔNG</Title>
        <LogoutButton onClick={handleLogout} className="k-button k-button-md k-rounded-md k-button-solid">
          <span className="k-button-text">Đăng xuất</span>
        </LogoutButton>
      </Header>

      {/* Horizontal Menu Đa cấp */}
      <TopMenu />

      <MainContainer>
        {/* Main Content */}
        <ContentArea>
          {/* Breadcrumb chung cho toàn hệ thống - Đặt vào trong vùng màn hình */}
          <AppBreadcrumb />
          
          <OutletWrapper>
            <Outlet />
          </OutletWrapper>
        </ContentArea>
      </MainContainer>
    </LayoutContainer>
  );
}
