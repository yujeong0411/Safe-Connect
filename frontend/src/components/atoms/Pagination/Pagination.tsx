import { useMemo } from 'react';
import { PaginationProps } from './Pagination.types';
import Button from '../Button/Button';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) => {
  const pageNumbers = useMemo(() => {
    const range = (start: number, end: number) => {
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      return [...range(1, leftItemCount), '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      return [1, '...', ...range(totalPages - rightItemCount + 1, totalPages)];
    }

    return [1, '...', ...range(leftSiblingIndex, rightSiblingIndex), '...', totalPages];
  }, [currentPage, totalPages, siblingCount]);

  return (
    <nav className="flex justify-center gap-2">
      {pageNumbers.map((pageNumber, index) => (
        <Button
          key={index}
          variant={currentPage === pageNumber ? 'blue' : 'gray'}
          size="sm"
          onClick={() => pageNumber !== '...' && onPageChange(Number(pageNumber))}
          className={pageNumber === '...' ? 'cursor-default' : ''}
        >
          {pageNumber}
        </Button>
      ))}
    </nav>
  );
};

export default Pagination;
