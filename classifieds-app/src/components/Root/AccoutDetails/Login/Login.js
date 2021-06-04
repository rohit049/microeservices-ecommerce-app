import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import Button from "#root/components/shared/Button";
import TextField from "#root/components/shared/TextField";
import { setSession } from "#root/store/ducks/session";

const Label = styled.label`
  display: block;

  :not(:first-child) {
    margin-top: 0.75rem;
  }
`;

const LabelText = styled.strong`
  display: block;
  color: #333;
  margin-bottom: 0.25rem;
`;

const OrSignUp = styled.span`
  color: blue;
  font-size: 0.9rem;
`;

const mutation = gql`
  mutation($email: String!, $password: String!) {
    createUserSession(email: $email, password: $password) {
      id
      user {
        email
        id
      }
    }
  }
`;

const Login = ({ onChangeToSignUp: pushChangeToSignUp }) => {
  const dispatch = useDispatch();
  const [createUserSession] = useMutation(mutation);

  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
  } = useForm();

  const onSubmit = handleSubmit(async ({ email, password }) => {
    const {
      data: { createUserSession: createdSession },
    } = await createUserSession({
      variables: { email, password },
    });
    dispatch(setSession(createdSession));
  });

  return (
    <form onSubmit={onSubmit}>
      <Label>
        <LabelText>Email</LabelText>
        <TextField
          disabled={isSubmitting}
          name="email"
          placeholder="Email"
          ref={register}
          type="email"
        />
      </Label>
      <Label>
        <LabelText>Password</LabelText>
        <TextField
          disabled={isSubmitting}
          name="password"
          placeholder="Password"
          ref={register}
          type="password"
        />
      </Label>
      <Button disabled={isSubmitting} type="submit">
        Login
      </Button>{" "}
      <OrSignUp>
        or{" "}
        <a
          href="#"
          onClick={(evt) => {
            evt.preventDefault();
            pushChangeToSignUp();
          }}
        >
          Sign up
        </a>
      </OrSignUp>
    </form>
  );
};

export default Login;
