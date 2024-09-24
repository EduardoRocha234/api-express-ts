export interface PaginationInput {
    page: number;
    pageSize: number;
}

export interface PaginationOutput {
    totalPages: number;
    currentPage: number;
    nextPage: number | null;
    previousPage: number | null;
    isLastPage: boolean;
}