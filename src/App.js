import React, { useEffect } from 'react'
import { ApolloProvider, gql } from '@apollo/client'
import client from '../apollo'
import Main from './Main'

const AppWithApollo = () => (
  <ApolloProvider client={client}>
    <Main />
  </ApolloProvider>
)

export default AppWithApollo
