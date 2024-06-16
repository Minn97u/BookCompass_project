import React from 'react';
import styled from 'styled-components';

const TagButtons = ({ activeTag, handleTagClick }) => (
  <BoardTags>
    {['전체', '추천 장소', '같이 해요'].map((tag) => (
      <Button
        key={tag}
        isActive={activeTag === tag}
        onClick={() => handleTagClick(tag)}
      >
        {tag}
      </Button>
    ))}
  </BoardTags>
);

const BoardTags = styled.div`
  display: flex;
  justify-content: flex-start;

  & > *:not(:first-child) {
    margin-left: 1rem;
  }
`;

const Button = styled.button`
  background-color: ${(props) => (props.isActive ? '#543D20' : 'white')};
  color: ${(props) => (props.isActive ? 'white' : '#8a5a2b')};
  border: 0.063rem solid #8a5a2b;
  padding: 0.5rem 1rem;
  border-radius: 1.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  margin-right: 0.325rem;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

export default TagButtons;
