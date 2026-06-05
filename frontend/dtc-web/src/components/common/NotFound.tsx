import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--bg-color);
  text-align: center;
  padding: 20px;
`;

const ErrorCode = styled.h1`
  font-size: 120px;
  font-weight: 700;
  color: #0056b3;
  margin: 0;
  line-height: 1;
`;

const ErrorTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #212529;
  margin: 20px 0 10px 0;
`;

const ErrorMessage = styled.p`
  font-size: 16px;
  color: #6c757d;
  max-width: 500px;
  margin-bottom: 30px;
  line-height: 1.5;
`;

const BackButton = styled.button`
  background-color: #0056b3;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #004494;
  }
`;

const HomeIcon = styled.svg`
  width: 18px;
  height: 18px;
  margin-right: 8px;
`;

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container>
      <ErrorCode>404</ErrorCode>
      <ErrorTitle>Không tìm thấy trang</ErrorTitle>
      <ErrorMessage>
        Đường dẫn bạn đang cố truy cập không tồn tại hoặc không thuộc hệ thống Quản lý Đầu tư công. 
        Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
      </ErrorMessage>
      <BackButton onClick={handleGoHome}>
        <HomeIcon fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </HomeIcon>
        Quay về Trang chủ
      </BackButton>
    </Container>
  );
}
