import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";

import Button from "#root/components/shared/Button";
import TextField from "#root/components/shared/TextField";

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

const OrLogin = styled.span`
  color: blue;
  font-size: 0.9rem;
`;

const mutation = gql`
  mutation($email: String!, $password: String!) {
    createUser(email: $email, password: $password) {
      id
    }
  }
`;

const useYupValidationResolver = (validationSchema) =>
  React.useCallback(
    async (data) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });
        return {
          values,
          errors: {},
        };
      } catch (errors) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? "validation",
                message: currentError.message,
              },
            }),
            {},
          ),
        };
      }
    },
    [validationSchema],
  );

const validationSchema = yup.object().shape({
  email: yup.string().required(),
  password: yup
    .string()
    .required()
    .test(
      "sameAsPasswordConfirm",
      "${path} is not the same as the confirmation password",
      function () {
        return this.parent.password === this.parent.confirmPassword;
      },
    ),
});

const SignUp = ({ onChangeToLogin: pushChangeToLogin }) => {
  const [createUser] = useMutation(mutation);
  const resolver = useYupValidationResolver(validationSchema);
  const {
    formState: { isSubmitting, isValid },
    handleSubmit,
    register,
    reset,
  } = useForm({
    mode: "onChange",
    resolver,
  });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    await createUser({ variables: { email, password } });
    reset();
    pushChangeToLogin();
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
      <Label>
        <LabelText>Confirm Password</LabelText>
        <TextField
          disabled={isSubmitting}
          name="confirmPassword"
          placeholder="Confirm Password"
          ref={register}
          type="password"
        />
      </Label>
      <Button disabled={isSubmitting || !isValid} type="submit">
        Sign up
      </Button>{" "}
      <OrLogin>
        or{" "}
        <a
          href="#"
          onClick={(evt) => {
            evt.preventDefault();
            pushChangeToLogin();
          }}
        >
          Login
        </a>
      </OrLogin>
    </form>
  );
};

export default SignUp;
