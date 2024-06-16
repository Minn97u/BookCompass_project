import React from 'react';
import styled from 'styled-components';

const Pagination = ({ reviewsPerPage, totalReviews, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalReviews / reviewsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Nav>
      <PaginationList>
        {pageNumbers.map((number) => (
          <PaginationItem key={number}>
            <PaginationLink onClick={() => paginate(number)} href='#!'>
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationList>
    </Nav>
  );
};

export default Pagination;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  padding: 1rem 0;
`;

const PaginationList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
`;

const PaginationItem = styled.li`
  margin: 0 0.5rem;
`;

const PaginationLink = styled.a`
  color: #000000;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
