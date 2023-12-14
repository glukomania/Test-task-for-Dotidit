import * as React from 'react'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { gql, useMutation } from '@apollo/client'
// import client from '../apollo'
import Table from './Table'
import Menu from './Menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons';

interface DataType {
  id: string
  name: string
  archived: boolean
  itemsCount: string
  icon: string
  lastImport: string
  createdAt: string
}

interface Header {
  Header: string
  accessor: string
  isVisible: boolean
}
  
const Main = ({client}) => {
  const [data, setData] = useState<DataType[]>(null)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [dataToSend, setDataToSend] = useState<DataType[]>()
  const [columns, setColumns] = useState<string[]>(['id', 'name', 'archived', 'createdAt', 'icon', 'itemsCount', 'lastImport'])
  const [headers, setHeaders] = useState<Header[]>([
    {
      Header: 'Id',
      accessor: 'id',
      isVisible: true
    },
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


  const DATA_SOURCES_QUERY = useMemo(() => {
    return gql`
      query DataSources {
        collection(page: 0, limit: 100, identifier: "organization", organizationId: 19952) {
          dataSources {
            ${[...columns].join('\n')}
          }
        }
      }
    `
  }, [columns])


  const UPDATE_DATA_SOURCE_MUTATION = gql`
  mutation UpdateDataSource($id: BigInt!, $name: String!) {
    updateDataSource(id: $id, name: $name) {
      errors
      updateNotificationText
  }}`

  const UPDATE_DATA_SOURCE_MUTATION_ARCHIVED = gql`
  mutation UpdateDataSource($id: BigInt!, $name: String!, $archived: Boolean!) {
    updateDataSource(id: $id, name: $name, archived: $archived) {
      errors
      updateNotificationText
  }}`


const [updateDataSource] = useMutation(UPDATE_DATA_SOURCE_MUTATION);
const [updateDataSourceArchived] = useMutation(UPDATE_DATA_SOURCE_MUTATION_ARCHIVED);

const handleUpdateDataSource = useCallback(async (id: number, name: string, archived: boolean) => {

  try {
    if(archived !== undefined) {
      await updateDataSourceArchived({
        variables: {
          id,
          name,
          archived,
        },
      })
    } else {
      await updateDataSource({
        variables: {
          id,
          name,
        },
      })
    }

    handleGetData()
    
  } catch (error) {
    console.error('Error updating data source:', error.message);
  }
}, [])

const handleGetData = useCallback(() => {
  if (columns.length > 0) {
    try {
      client
        .query({
          query: DATA_SOURCES_QUERY,
        })
        .then((response) => {
          if (response?.data?.collection?.dataSources) {
            setData(response.data.collection.dataSources);
          }
        })
        .catch((error) => {
          console.error('GraphQL error:', error);
        });
    } catch (err) {
      console.log(err);
    }
  } else {
    setData(null);
  }
}, [])

  const handleIconPress = useCallback(() => {
    setIsMenuOpen(!isMenuOpen)
  }, [isMenuOpen])


  useEffect(() => {
    handleGetData()
  }, [columns])

  useEffect(() => {
    let newHeaders = headers.filter(header => header.isVisible).map(header => header.accessor)
    setColumns(newHeaders)
  },[headers])

  useEffect(() => {
    if (dataToSend) {
      dataToSend.forEach(item => {
        const { id, name, archived } = item;
        handleUpdateDataSource(Number(id), name, archived);
      })
    }
  }, [dataToSend])

  return (
    <div className="wrapper">
      <div className="table">
        <div className="table-title">
          <div className="table-title__text">Data Sources</div>
          <div className="table-title__menuIcon" onClick={handleIconPress}>
              <FontAwesomeIcon icon={faBars} style={{ height: "20px" }}/>
          </div>
        </div>
        {(data && data.length > 0 && headers.filter(item=>item.isVisible).length > 0) ? <Table columns={headers.filter(item=>item.isVisible)} data={data} setDataToSend={setDataToSend} /> : null}
        {(isMenuOpen && data && data.length > 0) ? <Menu header={'Choose columns:'} setHeaders={setHeaders} headers={headers} setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen}/> : null}
        
        {!data && <div>No data</div>}
      </div>
    </div>
  )
}

export default Main