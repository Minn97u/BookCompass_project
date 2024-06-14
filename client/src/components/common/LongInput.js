import React from 'react';
import styled from 'styled-components';

export const LongInput = ({
  title,
  type,
  placeholder,
  value,
  onChange,
  checkText,
  height
}) => {
  return (
    <InputContainer>
      <LabelContainer>
        {title && <Label>{title}</Label>}
        {checkText && <CheckText>{checkText}</CheckText>}
      </LabelContainer>
      <StyledInput
        label={title}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        height={height}
      />
    </InputContainer>
  );
};

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: -7px;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.p`
  font-size: 0.9rem;
  color: #191619;
  margin-bottom: 3px;
`;

const CheckText = styled.p`
  font-size: 0.8rem;
  color: #ca3636;
  margin-bottom: 4px;
`;

const StyledInput = styled.input`
  width: 22rem;
  height: ${(props) => props.height || '2.1rem'};
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 5px 12px;
  margin-bottom: 7px;

  &::placeholder {
    color: #bababa;
  }
`;
