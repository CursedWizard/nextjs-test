import {useCallback, useEffect, useMemo, useState} from "react";

export const usePaginatedData = <T>(
  {
    pageSize = 10,
    initialPage = 0,
    initialData = [],
    initialLoading = false,
    initialError = null,
  }: {
    pageSize?: number;
    initialPage?: number;
    initialData: T[];
    initialLoading?: boolean;
    initialError?: any;
  }
) => {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState(initialError);

  useEffect(() => {
    setData(
      initialData.slice(page * pageSize, (page + 1) * pageSize)
    );
  }, [initialData, pageSize, page]);

  const dataPaginationInfo = useMemo(() => {
    return {
      page,
      pageSize,
      totalPages: Math.ceil(initialData.length / pageSize),
    };
  }, [initialData, pageSize, page]);

  /**
   * When data is updated, reset page to 0
   */
  useEffect(() => {
    setPage(initialPage)
  }, [initialData]);

  const goToPage = useCallback(
    (page: number) => {
      setPage(page);
      setData(initialData.slice(page * pageSize, (page + 1) * pageSize));
    },
    [initialData, pageSize]
  );

  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const previousPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  const canNextPage = useMemo(() => {
    return dataPaginationInfo.totalPages > (page + 1);
  }, [initialData, page, pageSize]);

  const canPreviousPage = useMemo(() => {
    return page > 0;
  }, [page]);

  return {
    data,
    isLoading,
    error,
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage,
    paginationInfo: dataPaginationInfo,
  };
}

