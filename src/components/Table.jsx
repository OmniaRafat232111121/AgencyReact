/* eslint-disable react/prop-types */
import DataTable from 'react-data-table-component';

const DataTableComponent = ({ data }) => {
  const columns = [
    {
      name: 'ID',
      selector: 'id',
      sortable: true,
    },
    {
      name: 'Name',
      selector: 'name',
      sortable: true,
    },
    {
      name: 'Email',
      selector: 'email',
      sortable: true,
    },
    {
      name: 'Rank (Window)',
      selector: 'rankWindow',
      sortable: true,
    },
    {
      name: 'Rank (Mobile)',
      selector: 'rankMobile',
      sortable: true,
    },
    {
      name: 'Date Updated',
      selector: 'dateUpdated',
      sortable: true,
    },
    {
      name: 'Actions',
      cell: () => (
        <div>
          <button className="text-blue-500 px-2 py-1 rounded-lg border border-blue-500">
            Update
          </button>
          <button className="text-red-500 px-2 py-1 rounded-lg border border-red-500 ml-2">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      title="Data Table"
      columns={columns}
      data={data}
      pagination
    />
  );
};

export default DataTableComponent;
