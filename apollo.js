const { ApolloClient, InMemoryCache, createHttpLink } = require('@apollo/client')
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: 'http://localhost:1337/graphql',
})

const authLink = setContext((_, { headers }) => {
  const token = '84e1694aa795ff75dd69d4233061ebdd'
  return {
    headers: {
      ...headers,
      authorization: token ? `ApiToken ${token}` : '',
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

export default client
