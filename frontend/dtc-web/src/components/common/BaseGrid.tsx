import { Grid, type GridProps } from '@progress/kendo-react-grid';
import { useGridData } from '../../hooks/useGridData';
import LoadingOverlay from './LoadingOverlay';

interface BaseGridProps extends Omit<GridProps, 'data' | 'total' | 'skip' | 'take' | 'onPageChange'> {
  url: string;
}

export default function BaseGrid({ url, children, ...rest }: BaseGridProps) {
  // Hook dùng chung xử lý mọi logic fetch và phân trang
  const { data, total, skip, take, loading, onPageChange } = useGridData({ url });

  return (
    <LoadingOverlay active={loading} text="Đang lấy dữ liệu...">
      <Grid
        data={data}
        total={total}
        skip={skip}
        take={take}
        onPageChange={onPageChange}
        style={{ height: '100%' }}
        sortable={true}
        filterable={false} // Server-side paging thì thường kèm server-side filtering, tạm tắt client filter
        pageable={{
          buttonCount: 5,
          info: true,
          type: 'numeric',
          pageSizes: [10, 20, 50, 100],
          previousNext: true
        }}
        size="small"
        {...rest} // Cho phép override các prop khác
      >
        {children}
      </Grid>
    </LoadingOverlay>
  );
}
