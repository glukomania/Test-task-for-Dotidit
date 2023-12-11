import * as React from 'react'
import { useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import client from '../apollo'
import Table from './Table'

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

const Main = () => {
  const [data, setData] = useState(null)
  // const [headers, setHeaders] = useState(null)


  const headers = [
    {
      Header: 'Name',
      accessor: 'name'
    },
    {
      Header: 'Items Count',
      accessor: 'itemsCount'
    },
    {
      Header: 'Archived',
      accessor: 'archived'
    },
    {
      Header: 'Icon',
      accessor: 'icon'
    },
    {
      Header: 'Last import',
      accessor: 'lastImport'
    },
    {
      Header: 'Last update',
      accessor: 'createdAt'
    },
  ]

  useEffect(() => {
    client
      .query({
        query: DATA_SOURCES_QUERY,
      })
      .then((response) => {
        response.data && console.log(response.data.collection.dataSources)
        setData(response.data && response.data.collection.dataSources)
      })
      .catch((error) => {
        console.error('GraphQL error:', error)
      })
  }, [])

  useEffect(() => {

  },[data])

  return (
    <div className="wrapper">
      {data && <Table columns={headers} data={data}/>}
    </div>
  )
}

export default Main