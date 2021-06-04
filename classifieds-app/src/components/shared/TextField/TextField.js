import styled from "styled-components";

const TextField = styled.input`
  border: 1px solid ${(props) => props.theme.veryLightGrey};
  border-radius: 3px;
  color: #333;
  display: block;
  font-size: 0.9rem;
  padding: 0.25rem;
  width: 100%;
`;

export default TextField;
