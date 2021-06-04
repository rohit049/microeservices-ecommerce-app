import React from "react";
import styled from "styled-components";

const ButtonSC = styled.button`
  background-color: #33aaff;
  border: 1px solid #33aaff;
  border-radius: 3px;
  color: #fff;
  display: inline-block;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  padding: 0.25rem;

  :hover {
    background-color: #1188ff;
    border: 1px solid #1188ff;
  }

  :disabled {
    color: #333;
    background-color: #999999;
    border: 1px solid #999999;
  }
`;

export default ButtonSC;
