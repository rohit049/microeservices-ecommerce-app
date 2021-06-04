import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import styled from "styled-components";

import Button from "#root/components/shared/Button";
import Textarea from "#root/components/shared/Textarea";
import TextField from "#root/components/shared/TextField";

const Form = styled.form`
  background-color: ${(props) => props.theme.whiteSmoke};
  padding: 1rem;
  margin-top: 1rem;
`;

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

const mutation = gql`
  mutation($description: String!, $title: String!) {
    createListing(description: $description, title: $title) {
      id
    }
  }
`;

const AddListing = ({ onAddListing: pushAddListing }) => {
  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm();
  const session = useSelector((state) => state.session);
  const [createListing] = useMutation(mutation);

  const onSubmit = handleSubmit(async ({ description, title }) => {
    await createListing({ variables: { description, title } });
    reset();
    pushAddListing();
  });

  if (!session) return <p>Login to add Listing.</p>;

  return (
    <Form onSubmit={onSubmit}>
      <Label>
        <LabelText>Title</LabelText>
        <TextField
          disabled={isSubmitting}
          name="title"
          placeholder="Title"
          ref={register}
          type="text"
        />
      </Label>
      <Label>
        <LabelText>Description</LabelText>
        <Textarea
          disabled={isSubmitting}
          name="description"
          placeholder="Description"
          ref={register}
        />
      </Label>
      <Button disabled={isSubmitting} type="submit">
        Add Listing
      </Button>
    </Form>
  );
};

export default AddListing;
