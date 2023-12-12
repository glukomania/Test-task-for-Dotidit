import * as React from 'react'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { gql } from '@apollo/client'
import client from '../apollo'
import Table from './Table'
import Menu from './Menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons';


const Main = () => {
  const [data, setData] = useState(null)
  // const [headers, setHeaders] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const [headers, setHeaders] = useState([
    {
      Header: 'Name',
      accessor: 'name',
      isVisible: true
    },
    {
      Header: 'Items Count',
      accessor: 'itemsCount',
      isVisible: true
    },
    {
      Header: 'Archived',
      accessor: 'archived',
      isVisible: true
    },
    {
      Header: 'Icon',
      accessor: 'icon',
      isVisible: true
    },
    {
      Header: 'Last import',
      accessor: 'lastImport',
      isVisible: true
    },
    {
      Header: 'Last update',
      accessor: 'createdAt',
      isVisible: true
    },
  ])

  const [columns, setColumns] = useState(['name', 'archived', 'createdAt', 'icon', 'itemsCount', 'lastImport'])

  const DATA_SOURCES_QUERY = useMemo(() => gql`
  query DataSources {
    collection(page: 0, limit: 100, identifier: "organization", organizationId: 19952) {
      dataSources {
        ${columns.join('\n')}
      }
    }
  }
`, [columns])


  const handleIconPress = useCallback(() => {
    setIsMenuOpen(!isMenuOpen)
  }, [isMenuOpen])

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
  }, [columns])

  useEffect(() => {
    let newHeaders = headers.filter(header => header.isVisible).map(header => header.accessor)
    setColumns(newHeaders)
  },[headers])

  return (
    <div className="wrapper">
      <div className="table">
        <div className="table-title">
          <div className="table-title__text">Data Sources</div>
          <div className="table-title__menuIcon">
            <div className="burger-btn" onClick={handleIconPress}>
              <FontAwesomeIcon icon={faBars} />
            </div>
          </div>
        </div>
        {data && <Table columns={headers.filter(item=>item.isVisible)} data={data}/>}
        
        {isMenuOpen && <Menu header={'Choose columns:'} items={headers} setHeaders={setHeaders} headers={headers} setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen}/> }
      </div>
    </div>
  )
}

export default Main