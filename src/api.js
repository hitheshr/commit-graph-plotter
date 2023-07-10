import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export const fetchGraphQL = (query, variables = {}, token) => {
  const client = new ApolloClient({
    uri: 'https://api.github.com/graphql',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    cache: new InMemoryCache()
  });

  return client.query({
    query: gql`${query}`,
    variables
  })
  .then(response => response.data);
}
