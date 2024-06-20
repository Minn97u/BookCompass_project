import styled from 'styled-components';

const DefaultButton = ({ children, ...rest }) => {
  return <Button {...rest}> {children}</Button>;
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
