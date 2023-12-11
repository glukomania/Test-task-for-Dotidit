import React, { useEffect } from 'react'
import { ApolloProvider, gql } from '@apollo/client'
import client from '../apollo'

const DATA_SOURCES_QUERY = gql`
  query DataSources {
    collection(page: 0, limit: 100, identifier: "organization", organizationId: 19952) {
      dataSources {
        name
        archived
        createdAt
        icon
        itemsCount
        lastImport
      }
    }
  }
`

const App = () => {
  useEffect(() => {
    client
      .query({
        query: DATA_SOURCES_QUERY,
      })
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.error('GraphQL error:', error)
      })
  }, [])

  return <div className="wrapper">I love you, world!</div>
}

const AppWithApollo = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)

export default AppWithApollo
