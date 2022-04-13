/* */
import React from 'react'
import { TableOptions, useTable, useRowSelect } from 'react-table'

/* */
import styles from './styles.module.scss'
import { Checkbox, Loading } from '~/components'

interface Props<T extends any> extends TableOptions<any> {
  loading?: boolean
  useSelect?: boolean
  onRowClick?: (row: T) => any
}

function Table<T extends any>(props: Props<T>) {
  const {
    data = [] as any,
    columns = [] as any,
    loading = false,
    useSelect = false,
    onRowClick = () => {}
  } = props

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSelect && useRowSelect, (hooks) => {
      if (useSelect) {
        hooks.visibleColumns.push((columns) => [
          {
            id: 'selection',
            Header: ({ getToggleHideAllColumnsProps }) => (
              <div>
                <Checkbox />
              </div>
            ),
            Cell: ({ row }) => (
              <div>
                <Checkbox />
              </div>
            )
          },
          ...columns
        ])
      }
    })

  return (
    <div className={styles.wrapper}>
      <table {...getTableProps()} className={styles.table}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={headerGroup.getHeaderGroupProps().key}
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  key={column.getHeaderProps().key}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {loading ? (
            <Loading />
          ) : rows?.length ? (
            rows.map((row) => {
              prepareRow(row)
              return (
                <tr
                  {...row.getRowProps()}
                  key={row.getRowProps().key}
                  onClick={() => onRowClick((row as any).original)}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={cell.getCellProps().key}
                        title={cell.value?.value || cell?.value}
                      >
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            })
          ) : (
            <tr className={styles.empty}>
              <td colSpan={columns.length}>
                <div className={styles.empty}>
                  <span>No Data</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
