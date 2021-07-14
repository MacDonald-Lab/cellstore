import React, { useState } from 'react';
import {
  TrashCan16 as Delete,
  Download16 as Download,
  Upload16,
} from '@carbon/icons-react';

import {
  DataTable,
  Table,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
  TableToolbarSearch,
  TableToolbarMenu,
  Button,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
} from 'carbon-components-react';

import { Link, useHistory } from 'react-router-dom';
import ModalStateManager from '../ModalStateManager'
import ExportCellModal from '../ExportCellModal';
import ExportCellsModal from '../ExportCellsModal';
import DeleteCellsModal from '../DeleteCellsModal';
import FieldItemView from '../FieldItemView';

const getHeaderData = (library) => library.viewingTableColumns.map(columnId => ({
  header: library.fields.find(field => field.name === columnId).friendlyName,
  key: columnId
}))

const getRowItems = (library, libraryData) =>
{  
  const pkName = library.fields.find(field => field.primaryKey === true).name
  
  return libraryData.map((row) => ({
    ...row,
    id: row[pkName],
    [pkName]: <Link to={`/library/${library.name}/cell/${row[pkName]}`}>{row[pkName]}</Link>,
  }))};

const LibraryTable = ({library, libraryData}) => {

  const history = useHistory()
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10 })
  var min = (pageInfo.page - 1) * pageInfo.pageSize
  var max = (pageInfo.page * pageInfo.pageSize) - 1


  // TODO generalize modal launcher for multiple modals
  // FIXME pagination on filter
  return (<>


    <DataTable isSortable rows={getRowItems(library, libraryData)} headers={getHeaderData(library)}>
      {({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getSelectionProps,
        getBatchActionProps,
        onInputChange,
        selectedRows,
      }) => (
        <TableContainer>
          <TableToolbar>
            <TableBatchActions {...getBatchActionProps()}>
              <ModalStateManager renderLauncher={({ setOpen }) =>
                <TableBatchAction
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                  renderIcon={Delete}
                  onClick={() => setOpen(true)}
                >
                  Delete
              </TableBatchAction>
              }>
                {(modalProps) => <DeleteCellsModal {...modalProps} id={selectedRows} library={library}/>}
              </ModalStateManager>
              <ModalStateManager renderLauncher={({ setOpen }) =>
                <TableBatchAction
                  tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                  renderIcon={Download}
                  onClick={() => setOpen(true)}
                >
                  Export to CSV
                </TableBatchAction>
              }>
                {(modalProps) => <ExportCellsModal {...modalProps} id={selectedRows} library={library} />}
              </ModalStateManager>
            </TableBatchActions>
            <TableToolbarContent>
              <TableToolbarSearch
                tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                onChange={onInputChange}
              />
              <TableToolbarMenu
                tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
              >
                <TableToolbarAction primaryFocus onClick={() => alert('Alert 1')}>
                  Action 1
            </TableToolbarAction>
                <TableToolbarAction onClick={() => alert('Alert 2')}>
                  Action 2
            </TableToolbarAction>
                <TableToolbarAction onClick={() => alert('Alert 3')}>
                  Action 3
            </TableToolbarAction>
              </TableToolbarMenu>
              <Button onClick={() => history.push('/library/' + library.name + '/upload')} size="small" kind="primary" renderIcon={Upload16}>Upload to Library</Button>

            </TableToolbarContent>
          </TableToolbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableSelectAll {...getSelectionProps()} />
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
                <TableHeader />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.filter((element, i) => min <= i && i <= max).map((row) => <TableRow {...getRowProps({ row })}>
                <TableSelectRow {...getSelectionProps({ row })} />
                {row.cells.map((cell, j) => (<TableCell key={`${cell.id}-${j}`}> <FieldItemView field={library.fields.find(field => field.name === library.viewingTableColumns[j])} value={cell.value} /></TableCell>))}
                <TableCell className="bx--table-column-menu">

                  <ModalStateManager renderLauncher={({ setOpen }) =>
                    <OverflowMenu size="md" light flipped>
                      <OverflowMenuItem itemText="View" onClick={() => history.push('/library/cell/' + row.id)} />
                      <OverflowMenuItem itemText="Edit" />
                      <OverflowMenuItem itemText="Export as .csv" onClick={() => {
                        setOpen(true)
                      }} />
                      <OverflowMenuItem itemText="Delete" isDelete hasDivider />
                    </OverflowMenu>
                  }>
                    {(modalProps) => <ExportCellModal {...modalProps} id={row.id} library={library}/>}
                  </ModalStateManager>
                </TableCell>

              </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
    <Pagination
      backwardText="Previous page"
      forwardText="Next page"
      itemsPerPageText="Items per page:"
      page={pageInfo.page}
      pageNumberText="Page Number"
      pageSize={pageInfo.pageSize}
      onChange={(e) => setPageInfo(e)}
      pageSizes={[
        10,
        20,
        30,
        40,
        50
      ]}
      totalItems={libraryData.length}
    />
  </>);
}






export default LibraryTable