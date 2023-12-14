import * as React from 'react'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { gql, useMutation } from '@apollo/client'
import client from '../apollo'
import Table from './Table'
import Menu from './Menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons';


const Main = () => {
  const [data, setData] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const [dataToSend, setDataToSend] = useState()

  const [headers, setHeaders] = useState([
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

  const [columns, setColumns] = useState(['id', 'name', 'archived', 'createdAt', 'icon', 'itemsCount', 'lastImport'])

  const DATA_SOURCES_QUERY = useMemo(() => {
    return gql`
      query DataSources {
        collection(page: 0, limit: 100, identifier: "organization", organizationId: 19952) {
          dataSources {
            ${[...columns].join('\n')}
          }
        }
      }
    `;
  }, [columns]);

  const UPDATE_DATA_SOURCE_MUTATION = gql`
  mutation UpdateDataSource($id: String!, $name: String!, $archived: Boolean!) {
    updateDataSource(id: $id, name: $name, archived: $archived) {
      id
      name
      archived
    }
  }
`;

const [updateDataSource] = useMutation(UPDATE_DATA_SOURCE_MUTATION);

const handleUpdateDataSource = async (id, name, archived) => {
  try {
    const response = await updateDataSource({
      variables: {
        id,
        name,
        archived,
      },
    });
    console.log('Updated data source:', response.data.updateDataSource);
  } catch (error) {
    console.error('Error updating data source:', error.message);
  }
};

  const handleIconPress = useCallback(() => {
    setIsMenuOpen(!isMenuOpen)
  }, [isMenuOpen])

  useEffect(() => {
    console.log('columns', columns)

    if (columns.length > 0) {
      console.log('get data')
      try {
        client
          .query({
            query: DATA_SOURCES_QUERY,
          })
          .then((response) => {
            if (response?.data?.collection?.dataSources) {
              console.log('response', response.data.collection.dataSources);
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
  }, [columns])

  useEffect(() => {
    let newHeaders = headers.filter(header => header.isVisible).map(header => header.accessor)
    setColumns(newHeaders)
  },[headers])

  useEffect(() => {
    console.log('dataToSend', dataToSend)
    if (dataToSend) {
      const { id, name, archived } = dataToSend;
      handleUpdateDataSource(id, name, archived);
    }
  }, [dataToSend])

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
        {data && data.length > 0 && headers.filter(item=>item.isVisible).length > 0 && <Table columns={headers.filter(item=>item.isVisible)} data={data} setDataToSend={setDataToSend} />}
        
        {isMenuOpen && data && data.length > 0 && <Menu header={'Choose columns:'} setHeaders={setHeaders} headers={headers} setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen}/> }
        {!data && <div>To data</div>}
      </div>
    </div>
  )
}

export default Main