import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { MAIN_MENU, type MenuItemType } from './menuConfig';

const BreadcrumbWrapper = styled.div`
  padding: 12px 20px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
`;

const BreadcrumbItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  font-family: var(--font-family);
`;

const HomeIcon = styled.svg`
  width: 14px;
  height: 14px;
  margin-right: 6px;
  color: #6c757d;
`;

const CurrentPageText = styled.span`
  color: #212529;
  font-weight: 600;
`;

const BreadcrumbLink = styled(Link)`
  color: #0056b3;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #004494;
    text-decoration: underline;
  }
`;

const NonClickableText = styled.span`
  color: #6c757d;
`;

const Separator = styled.span`
  margin: 0 10px;
  color: #adb5bd;
  font-size: 12px;
`;

// Helper tìm kiếm đường dẫn đệ quy từ Cây Menu tĩnh
const findPathInMenu = (menu: MenuItemType[], targetPath: string): MenuItemType[] | null => {
  for (const item of menu) {
    if (item.path && item.path.toLowerCase() === targetPath.toLowerCase()) {
      return [item];
    }
    if (item.children) {
      const childPath = findPathInMenu(item.children, targetPath);
      if (childPath) {
        return [item, ...childPath];
      }
    }
  }
  return null;
};

export default function AppBreadcrumb() {
  const location = useLocation();
  const pathData = findPathInMenu(MAIN_MENU, location.pathname);

  // Mặc định gốc của Breadcrumb luôn là Home
  const breadcrumbs = [{ id: 'home', text: 'Trang chủ', path: '/' }];

  if (pathData) {
    pathData.forEach(item => {
      // Bỏ qua item root nếu nó trùng path '/' để khỏi bị lặp 'Trang chủ'
      if (item.path !== '/') {
        breadcrumbs.push({ id: item.id, text: item.text, path: item.path || '#' });
      }
    });
  }

  return (
    <BreadcrumbWrapper>
      {breadcrumbs.map((bc, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isHome = index === 0;

        return (
          <BreadcrumbItem key={bc.id}>
            {/* Biểu tượng Home cho node đầu tiên */}
            {isHome && (
               <HomeIcon fill="currentColor" viewBox="0 0 24 24">
                 <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
               </HomeIcon>
            )}
            
            {/* Nếu là mục cuối cùng (đang đứng) thì in đậm, không thể click */}
            {isLast ? (
              <CurrentPageText>{bc.text}</CurrentPageText>
            ) : bc.path !== '#' ? (
              // Nếu là thư mục có đường dẫn thì cho phép click
              <BreadcrumbLink to={bc.path}>
                {bc.text}
              </BreadcrumbLink>
            ) : (
              // Nếu là thư mục rỗng (chỉ để nhóm menu) thì không click được
              <NonClickableText>{bc.text}</NonClickableText>
            )}

            {/* Dấu phân cách (/) */}
            {!isLast && (
              <Separator>/</Separator>
            )}
          </BreadcrumbItem>
        );
      })}
    </BreadcrumbWrapper>
  );
}
