import React, { useMemo, useState } from 'react';
import { useTable, useRowSelect, useCellEdit } from 'react-table';

const Table = ({ data, columns, setDataToSend }) => {
  const [editedRows, setEditedRows] = useState([]);

  const visibleColumns = useMemo(() => columns.filter((column) => column.isVisible), [columns]);

  const handleCellEdit = (row, columnId, value) => {
    const updatedRow = { ...row.original, [columnId]: value };
    setEditedRows((prevEditedRows) => {
      if (!prevEditedRows.includes(row.id)) {
        return [...prevEditedRows, row.id];
      }
      return prevEditedRows;
    });
    row.editCell(columnId, value);
    row.original = updatedRow;
  };
  
  const tableColumns = useMemo(
    () =>
      visibleColumns.map((column) => ({
        ...column,
        Cell: ({ row, value }) => {
          const isRowEdited = editedRows.includes(row.id);

          return isRowEdited && column.accessor === 'name' ? (
            <input
              type="text"
              value={value}
              onChange={(e) => handleCellEdit(row, column.accessor, e.target.value)}
            />
          ) : column.accessor === 'archived' ? (
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleCellEdit(row, column.accessor, e.target.checked)}
            />
          ) : (
            value
          );
        },
      })),
    [editedRows, handleCellEdit, visibleColumns]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns: tableColumns,
      data,
      autoResetSelectedRows: false,
      autoResetPage: false,
    },
    useCellEdit,
    useRowSelect
  );


  const handleSave = () => {
    // Do something with the editedRows data, e.g., send it to the server
    console.log('Edited Rows:', editedRows.map((id) => rows.find((r) => r.id === id).original));
    setEditedRows([]);

    // Prepare data to send
    const dataToSend = editedRows.map((id) => rows.find((r) => r.id === id).original);
    setDataToSend(dataToSend);
  };

  return (
    <div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr key={row.id}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Table;
