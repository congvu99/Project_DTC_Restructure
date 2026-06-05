import { useState, useEffect } from 'react';
import type { GridPageChangeEvent } from '@progress/kendo-react-grid';
import apiClient from '../utils/apiClient';
import { AlertService } from '../utils/alert';

interface UseGridDataProps {
  url: string;
  initialTake?: number;
}

export function useGridData({ url, initialTake = 20 }: UseGridDataProps) {
  const [data, setData] = useState<unknown[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageState, setPageState] = useState({ skip: 0, take: initialTake });

  const loadData = async () => {
    try {
      setLoading(true);
      const pageNumber = (pageState.skip / pageState.take) + 1;
      const pageSize = pageState.take;

      // Xử lý query param thông minh: Nếu url đã có '?' thì nối thêm '&', ngược lại dùng '?'
      const separator = url.includes('?') ? '&' : '?';
      const endpoint = `${url}${separator}PageNumber=${pageNumber}&PageSize=${pageSize}`;

      const response = await apiClient.get(endpoint) as { data: unknown[], totalCount: number };
      
      setData(response.data);
      setTotal(response.totalCount);
    } catch (err: unknown) {
      if (err instanceof Error) {
        AlertService.toastError("Lỗi tải dữ liệu: " + err.message);
      } else {
        AlertService.toastError("Lỗi tải dữ liệu");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageState, url]);

  const onPageChange = (event: GridPageChangeEvent) => {
    setPageState({
      skip: event.page.skip,
      take: event.page.take
    });
  };

  const refresh = () => {
    loadData();
  };

  return {
    data,
    total,
    loading,
    skip: pageState.skip,
    take: pageState.take,
    onPageChange,
    refresh
  };
}
