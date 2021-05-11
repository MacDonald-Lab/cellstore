import React from 'react';
import {
  Delete16 as Delete,
  Save16 as Save,
  Download16 as Download,
  Upload16,
} from '@carbon/icons-react';

import { useQuery, gql } from '@apollo/client';

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
  Tag,
  Button,
  DataTableSkeleton,
  OverflowMenu,
  OverflowMenuItem,
} from 'carbon-components-react';

import { Link, useHistory } from 'react-router-dom';
import ModalStateManager from '../ModalStateManager'
import ExportCellModal from '../ExportCellModal';

const headerData = [
  {
    header: 'Joan Cell ID',
    key: 'joanCellId',
  },
  {
    header: 'Donor ID',
    key: 'donorId',
  },
  {
    header: 'Age',
    key: 'age',
  },
  {
    header: 'Sex',
    key: 'sex',
  },
  {
    header: 'Diabetes',
    key: 'diabetesStatus',
  },
];


const LIBRARY_QUERY = gql`
  query LIBRARY_QUERY {
    allRawDnas {
      nodes {
        donorId
        joanCellId
        yearsWithT2D
        age
        sex
        diabetesStatus
      }
    }
  }`;

const sexName = ["Female", "Male"]

const getRowItems = (rows) =>
  rows.map((row) => ({
    ...row,
    id: row.joanCellId,
    sex: sexName[row.sex],
    diabetesStatus: <Tag type={["gray", "purple", "green", "blue"][row.diabetesStatus]}>{["None", "Type 2", "Pre-diabetes", "Type 1"][row.diabetesStatus]}</Tag>,
    joanCellId: <Link to={`/library/cell/` + row.joanCellId}><Button kind="ghost">{row.joanCellId}</Button></Link>,
  }));

const LibraryTable = () => {

  const history = useHistory()

  const { loading, error, data } = useQuery(LIBRARY_QUERY)
  // Wait for the request to complete
  if (loading) return (
    <DataTableSkeleton showHeader={false} />
  );
  // Something went wrong with the data fetching
  if (error) return `Error! ${error.message}`;
  // If we're here, we've got our data!
  console.log(data.allRawDnas.nodes);

  // TODO add custom sorting for columns
  // TODO generalize modal launcher for multiple modals
  return (<>


    <DataTable isSortable rows={getRowItems(data.allRawDnas.nodes)} headers={headerData}>
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
              <TableBatchAction
                tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                renderIcon={Delete}
                onClick={() => console.log('clicked')}
              >
                Delete
          </TableBatchAction>
              <TableBatchAction
                tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                renderIcon={Save}
                onClick={() => console.log('clicked')}
              >
                Save
          </TableBatchAction>
              <TableBatchAction
                tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                renderIcon={Download}
                onClick={() => console.log('clicked')}
              >
                Download
          </TableBatchAction>
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
              {/* <AddRNAModal /> */}
              <Button onClick={() => history.push('/library/upload')} size="small" kind="primary" renderIcon={Upload16}>Upload to Library</Button>


              {/* <Button
            tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
            onClick={() => console.log('clicked')}
            size="small"
            kind="primary"
          >
            Add new
          </Button> */}
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
              {rows.map((row) => (
                <TableRow {...getRowProps({ row })}>
                  <TableSelectRow {...getSelectionProps({ row })} />
                  {row.cells.map((cell) => (<TableCell key={cell.id}>{cell.value}</TableCell>))}
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
                      {(modalProps) => <ExportCellModal {...modalProps} id={row.id} />}
                    </ModalStateManager>


                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  </>);
}






export default LibraryTable