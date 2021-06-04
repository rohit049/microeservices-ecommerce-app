import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";

export const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  link: new HttpLink({
    credentials: "include",
    uri: process.env.SERVICES_URI + "/graphql",
  }),
});

export default client;

// @include (if: Boolean) -> Only include ths field if the argument is true
// @skip (if: Boolean) -> Skip this field if argument is true
