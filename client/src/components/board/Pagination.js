import React from 'react';
import { ReactComponent as ArrowLeft } from '../../assets/icons/arrowleft.svg';
import { ReactComponent as ArrowRight } from '../../assets/icons/arrowright.svg';
import { ReactComponent as DoubleArrowLeft } from '../../assets/icons/doublearrowleft.svg';
import { ReactComponent as DoubleArrowRight } from '../../assets/icons/doublearrowright.svg';
import styled from 'styled-components';

const PaginationButton = ({ isActive, onClick, children }) => {
  return (
    <StyledPaginationButton isActive={isActive} onClick={onClick}>
      {children}
    </StyledPaginationButton>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfMaxPagesToShow);
    let endPage = Math.min(totalPages, currentPage + halfMaxPagesToShow);

    if (currentPage <= halfMaxPagesToShow) {
      endPage = Math.min(totalPages, maxPagesToShow);
    }

    if (currentPage + halfMaxPagesToShow >= totalPages) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <PaginationButton key={1} onClick={() => onPageChange(1)}>
          1
        </PaginationButton>
      );
      if (startPage > 2) {
        pageNumbers.push(<span key='start-ellipsis'>...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationButton
          key={i}
          isActive={currentPage === i}
          onClick={() => onPageChange(i)}
        >
          {i}
        </PaginationButton>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key='end-ellipsis'>...</span>);
      }
      pageNumbers.push(
        <PaginationButton
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </PaginationButton>
      );
    }

    return pageNumbers;
  };

  return (
    <PaginationContainer>
      <PaginationButton onClick={() => onPageChange(1)}>
        <DoubleArrowLeft />
      </PaginationButton>
      <PaginationButton onClick={() => onPageChange(currentPage - 1)}>
        <ArrowLeft />
      </PaginationButton>
      {renderPageNumbers()}
      <PaginationButton onClick={() => onPageChange(currentPage + 1)}>
        <ArrowRight />
      </PaginationButton>
      <PaginationButton onClick={() => onPageChange(totalPages)}>
        <DoubleArrowRight />
      </PaginationButton>
    </PaginationContainer>
  );
};

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.25rem;
`;

const StyledPaginationButton = styled.button`
  background-color: ${(props) => (props.isActive ? '#543D20' : 'white')};
  color: ${(props) => (props.isActive ? 'white' : '#8a5a2b')};
  border: none;
  padding: 0.4rem 0.7rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.875rem;
  margin: 0 0.325rem;
`;

export default Pagination;
