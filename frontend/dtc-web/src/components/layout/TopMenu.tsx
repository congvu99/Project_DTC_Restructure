import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MAIN_MENU, type MenuItemType } from './menuConfig';

const MenuWrapper = styled.div`
  background-color: #0056b3;
  padding: 0 20px;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const CustomMenuItem = styled.div`
  position: relative;
`;

interface TitleRowProps {
  $level: number;
  $isOpen: boolean;
}

const TitleRow = styled.div<TitleRowProps>`
  display: flex;
  align-items: center;
  padding: ${({ $level }) => ($level === 1 ? '14px 20px' : '10px 20px')};
  cursor: pointer;
  background-color: ${({ $isOpen, $level }) => ($isOpen && $level === 1 ? '#004494' : 'transparent')};
  color: ${({ $level }) => ($level === 1 ? 'white' : '#212529')};
  border-bottom: ${({ $level }) => ($level > 1 ? '1px solid #f1f3f5' : 'none')};
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: ${({ $level, $isOpen }) => {
      if ($level > 1) return '#e2eef9';
      if (!$isOpen) return '#004494';
      return '#004494'; // if level 1 and open, keep the color
    }};
  }
`;

const IconSvg = styled.svg`
  margin-right: 8px;
  width: 16px;
  height: 16px;
`;

const ChevronSvg = styled.svg<{ $isOpen: boolean; $level: number }>`
  margin-left: 8px;
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
  transform: ${({ $isOpen, $level }) => {
    if ($level === 1) return $isOpen ? 'rotate(180deg)' : 'none';
    return $isOpen ? 'rotate(90deg)' : 'none';
  }};
`;

const MenuText = styled.span<{ $level: number }>`
  font-weight: ${({ $level }) => ($level === 1 ? 500 : 400)};
  flex: 1;
`;

const SubMenuContainer = styled.div<{ $level: number }>`
  position: absolute;
  top: ${({ $level }) => ($level === 1 ? '100%' : '0')};
  left: ${({ $level }) => ($level === 1 ? '0' : '100%')};
  background-color: white;
  min-width: 250px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border: 1px solid #dee2e6;
  z-index: ${({ $level }) => 1000 + $level};
`;

export default function TopMenu() {
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenKeys([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item: MenuItemType, level: number, currentPath: string[], e: React.MouseEvent) => {
    e.stopPropagation();

    if (item.children && item.children.length > 0) {
      setOpenKeys((prev) => {
        const isCurrentlyOpen = prev.includes(item.id);
        if (isCurrentlyOpen) {
          // Đang mở -> Đóng nó lại (bằng cách chỉ giữ lại đường dẫn đến cha của nó)
          return currentPath.slice(0, -1);
        } else {
          // Đang đóng -> Mở nó ra. 
          // Việc set openKeys bằng đúng currentPath sẽ tự động đóng tất cả các nhánh khác không liên quan!
          return currentPath;
        }
      });
    } else if (item.path) {
      // It's a leaf node -> navigate and close menu
      navigate(item.path);
      setOpenKeys([]);
    }
  };

  const renderIcon = (item: MenuItemType, level: number) => {
    // Nếu có icon tùy chỉnh dạng chuỗi (cần svg tương ứng, tạm thời bỏ qua)
    if (level === 1) {
      return (
        <IconSvg fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 4h6v6H4V4zm8 0h8v6h-8V4zM4 14h6v6H4v-6zm8 0h8v6h-8v-6z" />
        </IconSvg>
      );
    }
    if (item.children && item.children.length > 0) {
      return (
        <IconSvg fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
        </IconSvg>
      );
    }
    return (
      <IconSvg fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
      </IconSvg>
    );
  };

  const renderChevron = (isOpen: boolean, level: number) => {
    const path = level === 1 
      ? "M7 10l5 5 5-5H7z" // down arrow
      : "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"; // right chevron

    return (
      <ChevronSvg $isOpen={isOpen} $level={level} fill="currentColor" viewBox="0 0 24 24">
        <path d={path} />
      </ChevronSvg>
    );
  };

  const renderMenuItems = (items: MenuItemType[], level: number = 1, parentPath: string[] = []) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = openKeys.includes(item.id);
      const currentPath = [...parentPath, item.id];

      return (
        <CustomMenuItem key={item.id} className={`level-${level}`}>
          <TitleRow 
            $level={level}
            $isOpen={isOpen}
            onClick={(e) => handleItemClick(item, level, currentPath, e)}
          >
            {renderIcon(item, level)}
            <MenuText $level={level}>{item.text}</MenuText>
            {hasChildren && renderChevron(isOpen, level)}
          </TitleRow>

          {hasChildren && isOpen && (
            <SubMenuContainer $level={level}>
              {renderMenuItems(item.children!, level + 1, currentPath)}
            </SubMenuContainer>
          )}
        </CustomMenuItem>
      );
    });
  };

  return (
    <MenuWrapper>
      <MenuContainer ref={menuRef}>
        {renderMenuItems(MAIN_MENU)}
      </MenuContainer>
    </MenuWrapper>
  );
}
