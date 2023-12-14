import * as React from 'react'
import {useState, useCallback, useEffect} from 'react'
import {useTable} from 'react-table'
import getDate from './utils/getDate'

const RenderCell = ({ columnId, cellValue, setEditedRows, row, editedRows }) => {
  const [inputValue, setInputValue] = useState(cellValue);

  const onChangeValue = (event, columnId) => {
    if (columnId === 'name') {

      if(!editedRows.find(item => item.id === row.values.id)){

        const newEditedRows = [...editedRows, {...row.values, [columnId]: event.target.value}]
        setEditedRows(newEditedRows)

      } else {

        const updatedRows = editedRows.map(item => {
          return item.id === row.values.id ? { ...item, [columnId]: event.target.value } : item
        })


        setEditedRows(updatedRows);
      }

      setInputValue(event.target.value)

    } else if (columnId ==='archived'){

      if(!editedRows.find(item => item.id === row.values.id)){
        const newEditedRows = [...editedRows, {...row.values, [columnId]: event.target.checked}]
        setEditedRows(newEditedRows)
      } else {
        
        const updatedRows = editedRows.map(item => {
          return item.id === row.values.id ? { ...item, [columnId]: event.target.checked } : item
        })

        setEditedRows(updatedRows);
      }

      setInputValue(event.target.checked)
      
    } else {
      console.log('unknowm columnId:', columnId)
    }
    
  }

  switch (columnId) {
    case 'name':
      return (
        <input
          className='inputText'
          type='text'
          value={inputValue}
          onChange={(event) => onChangeValue(event, columnId)}
        />
      );
    case 'archived':
      return (
        <input
          className='inputCheckbox'
          type='checkbox'
          checked={inputValue}
          onChange={(event) => onChangeValue(event, columnId)}
        />
      );
    case 'lastImport':
      return getDate(cellValue);
    case 'createdAt':
      return getDate(cellValue);
    default:
      return cellValue;
  }
}

const Table = ({ columns, data, setDataToSend }) => {
  const [editedRows, setEditedRows] = useState([])


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })


  const handleSave = useCallback(() => {
    if (editedRows.length > 0) {
      setDataToSend(editedRows);
      setEditedRows([])
    }
  }, [editedRows])


  const renderColumns = (headers) => {
    return headers.map((header) => (
      <tr {...header.getHeaderGroupProps()}>
        {header.headers.map((column) => {
          return (column.id !== 'id' && <th {...column.getHeaderProps()}>{column.render('Header')}</th>
        )})}
      </tr>
    ))
  }

  const renderRow = (row) => {
    return (
      row.cells.map((cell) => (
        cell.column.id !== 'id' && <td {...cell.getCellProps()}>
          {cell.value !== null && <RenderCell columnId={cell.column.id} cellValue={cell.value} setEditedRows={setEditedRows} row={row} editedRows={editedRows}/>}
        </td>
      ))
    )
  }

  const renderRows = (rows) => {
    return rows.map((row) => {
      prepareRow(row);
      return (
        <tr {...row.getRowProps()}>
          {renderRow(row)}
        </tr>
      );
    })
  }

  useEffect(()=> {
    console.log('editedRows', editedRows)
  }, [editedRows])

  return (
    headerGroups.length > 0 && 
    ( <div>
        <table {...getTableProps()}>
        <thead>
          {renderColumns(headerGroups)}
        </thead>
        <tbody {...getTableBodyProps()}>
          {renderRows(rows)}
        </tbody>
        </table>

        <div onClick={handleSave}>Save</div>
      </div>
    )
  );
};


export default Table

