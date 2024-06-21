import { forwardRef, useEffect } from 'react';
import styled from 'styled-components';

export const LongInput = forwardRef(
  (
    {
      title,
      type,
      placeholder,
      value,
      onChange,
      checkText,
      handleEnter,
      height
    },
    inputRef
  ) => {
    useEffect(() => {
      if (inputRef) {
        inputRef.current.focus();
      }
    }, []);
    return (
      <InputContainer>
        <LabelContainer>
          {title && <Label>{title}</Label>}
          {checkText && <CheckText>{checkText}</CheckText>}
        </LabelContainer>
        <StyledInput
          ref={inputRef}
          label={title}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleEnter}
          height={height}
        />
      </InputContainer>
    );
  }
);

LongInput.displayName = 'LongInput';

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
