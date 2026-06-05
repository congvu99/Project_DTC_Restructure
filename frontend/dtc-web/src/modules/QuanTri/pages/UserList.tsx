
import { useState } from 'react';
import styled from 'styled-components';
import { GridColumn as Column, type GridCellProps } from '@progress/kendo-react-grid';
import BaseGrid from '../../../components/common/BaseGrid';
import { Button, Input, SelectBox } from '../../../components/common/Form';

const PageContainer = styled.div`
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;


const FilterRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: flex-end; /* Căn dưới để nút bấm thẳng hàng với ô nhập liệu */
`;

const FilterItem = styled.div<{ $width?: string }>`
  width: ${({ $width }) => $width || '250px'};

  /* Ép Wrapper của các Form component mất đi margin-bottom mặc định để dùng chung trong hàng */
  & > div {
    margin-bottom: 0;
  }
`;

const GridWrapper = styled.div`
  flex: 1;
  min-height: 0;
`;

const StatusActive = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background-color: #d4edda;
  color: #155724;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const StatusInactive = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const SearchIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export default function UserList() {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [gridUrl, setGridUrl] = useState('/quan-tri/users');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('Keyword', keyword.trim());
    if (status !== '') params.append('Hieuluc', status); // True/False string
    
    const queryString = params.toString();
    setGridUrl(`/quan-tri/users${queryString ? '?' + queryString : ''}`);
  };

  return (
    <PageContainer className="k-card k-card-shadow">
      <FilterRow>
        <FilterItem $width="300px">
          <Input 
            label="Từ khóa tìm kiếm" 
            placeholder="Tài khoản, họ tên, email..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </FilterItem>
        
        <FilterItem $width="200px">
          <SelectBox 
            label="Trạng thái hoạt động"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: '', label: '-- Tất cả --' },
              { value: 'true', label: 'Đang hoạt động' },
              { value: 'false', label: 'Bị khóa' },
            ]}
          />
        </FilterItem>

        <Button onClick={handleSearch} leftIcon={SearchIcon} variant="primary">
          Tìm kiếm
        </Button>
      </FilterRow>

      <GridWrapper>
        <BaseGrid url={gridUrl}>
          <Column field="ID" title="ID" width="70px" />
          <Column field="UserName" title="Tài khoản" width="200px" />
          <Column field="Hoten" title="Họ và Tên" width="250px" />
          <Column field="Email" title="Email" />
          <Column field="Dienthoai" title="Điện thoại" width="150px" />
          <Column field="Hieuluc" title="Trạng thái" width="150px" cells={{ data: StatusCell }} />
        </BaseGrid>
      </GridWrapper>
    </PageContainer>
  );
}

const StatusCell = (props: GridCellProps) => {
  return (
    <td>
      {props.dataItem.Hieuluc ? 
        <StatusActive>Đang hoạt động</StatusActive> : 
        <StatusInactive>Bị khóa</StatusInactive>}
    </td>
  );
};
