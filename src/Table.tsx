import * as React from 'react';
import { useTable } from 'react-table';

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  const renderCellData = (columnId, cellValue) => {
    if (columnId === 'archived') {
      return cellValue ? 'True' : 'False';
    } else if (columnId === 'lastImport' || columnId === 'createdAt') {
      const date = new Date(cellValue);
      const minutesAgo = Math.round((Date.now() - date.getTime()) / (1000 * 60));
      return `${minutesAgo} minutes ago`;
    } else {
      return cellValue;
    }
  }

  const renderRows = (rows) => {
    return rows.map((row) => {
      prepareRow(row);
      return (
        <tr {...row.getRowProps()}>
          {row.cells.map((cell) => (
            <td {...cell.getCellProps()}>{renderCellData(cell.column.id, cell.value)}</td>
          ))}
        </tr>
      );
    })
  }

  const renderColumns = (headers) => {
    console.log(headers)
    return headers.map((header) => (
      <tr {...header.getHeaderGroupProps()}>
        {header.headers.map((column) => (
          <th {...column.getHeaderProps()}>{column.render('Header')}</th>
        ))}
      </tr>
    ))
  }

  return (
    <table {...getTableProps()}>
      <thead>
        {renderColumns(headerGroups)}
      </thead>
      <tbody {...getTableBodyProps()}>
        {renderRows(rows)}
      </tbody>
    </table>
  );
};


export default Table

