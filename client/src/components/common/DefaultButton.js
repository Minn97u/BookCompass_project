import { useState } from 'react';
import { useMutation } from 'react-query';
import styled from 'styled-components';

const DefaultButton = ({
  onClick,
  buttonText,
  initialDisabled = false,
  apiFn
}) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(initialDisabled);

  const mutateFunction = useMutation({
    mutationFn: async (data) => {
      const res = await apiFn(data);
      return res;
    },
    onSuccess: (res) => {
      console.log('성공', res);
    },
    onError: (error) => {
      console.error('실패:', error);
      alert('실패');
    },
    onSettled: () => {
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 500);
    }
  });

  const handleButtonClick = () => {
    setIsButtonDisabled(true);
    onClick(mutateFunction);
  };
  return (
    <Button
      disabled={isButtonDisabled || mutateFunction.isLoading}
      onClick={handleButtonClick}
    >
      {buttonText}
    </Button>
  );
};

const Button = styled.button`
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
  width: 3.3rem;
  padding: 5px 10px;
  border: none;
  border-radius: 10px;
  background-color: ${(props) => (props.disabled ? '#ccc' : '#563c0a')};
  align-self: flex-end;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  margin-bottom: 2px;
`;

export default DefaultButton;
