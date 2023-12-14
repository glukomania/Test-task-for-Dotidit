import * as React from 'react'
import {useState, useMemo, useEffect} from 'react'
import {useTable, useCellEdit, useRowSelect} from 'react-table'
import getDate from './utils/getDate'

const RenderCell = ({ columnId, cellValue }) => {
  const [inputValue, setInputValue] = useState(cellValue);

  switch (columnId) {
    case 'name':
      return (
        <input
          className='inputText'
          type='text'
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
      );
    case 'archived':
      return (
        <input
          className='inputCheckbox'
          type='checkbox'
          checked={inputValue}
          onChange={(event) => setInputValue(event.target.checked)}
        />
      );
    case 'lastImport':
      return getDate(cellValue);
    case 'createdAt':
      return getDate(cellValue);
    default:
      return cellValue;
  }
};

const Table = ({ columns, data, setDataToSend }) => {
  const [editedRows, setEditedRows] = useState([]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useCellEdit, useRowSelect);


  const handleSave = () => {
    setEditedRows([]);

    const dataToSend = editedRows.map((id) => rows.find((row) => row.id === id).original);
    console.log('dataToSend', dataToSend)
    setDataToSend(dataToSend);
  };


  const renderColumns = (headers) => {   /// good
    return headers.map((header) => (
      <tr {...header.getHeaderGroupProps()}>
        {header.headers.map((column) => {
          return (column.id !== 'id' && <th {...column.getHeaderProps()}>{column.render('Header')}</th>
        )})}
      </tr>
    ))
  }

  const renderRows = (rows) => {
    return rows.map((row) => {
      prepareRow(row);
      return (
        <tr {...row.getRowProps()}>
          {row.cells.map((cell) => (
            cell.column.id !== 'id' && <td {...cell.getCellProps()}>
              {cell.value !== null && <RenderCell columnId={cell.column.id} cellValue={cell.value}/>}
            </td>
          ))}
        </tr>
      );
    })
  }

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

