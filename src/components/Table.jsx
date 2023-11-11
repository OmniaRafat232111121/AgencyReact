import  { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FiSearch } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import data from '../data.json'; // Import your local data file

const DataTableComponent = () => {
  const [filteredData, setFilteredData] = useState(data); // Use the imported data
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedTargetUrl, setSelectedTargetUrl] = useState(''); // Added state for target_url filter
  const navigate = useNavigate();

  const handleUpdate = () => {
    // Implement your update logic here
  };

  const handleDelete = () => {
    // Implement your delete logic here
  };

  // Extract unique target_url values from the data
   // Calculate unique target URLs with a regex filter using useMemo
   const uniqueTargetUrls = useMemo(() => {
    const uniqueUrls = new Set(data.map((item) => item.target_url.
    replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')));
    return [...uniqueUrls];
  }, [data]);

  // Function to handle target_url filter change
  const handleTargetUrlFilterChange = (e) => {
    const targetUrl = e.target.value;
    setSelectedTargetUrl(targetUrl);

    // Apply filter based on selected target_url
    filterData(searchQuery, selectedSource, targetUrl);
  };

  const columns = [
    {
      name: 'ID',
      selector: 'id',
      sortable: true,
    },
    {
      name: 'Keyword',
      cell: (row) => (
        <Link to={`/query/${row.id}/${encodeURIComponent(row.query)}`}>{row.query}</Link>
      ),
      sortable: true,
    },
    {
      name: 'Rank (Win)',
      selector: 'rank_win',
      sortable: true,
    },
    {
      name: 'Date',
      selector: 'date',
      sortable: true,
    },
    {
      name: 'Target URL',
      selector: 'target_url',
      cell: (row) => (
        <div>
          {row.target_url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')}
        </div>
      ),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: () => (
         <div>
          <button className="text-green-500 px-2 py-1 rounded-lg border border-green-500">
            Update
          </button>
          <button className="text-red-500 px-2 py-1 rounded-lg border border-red-500 ml-2">
            Delete
          </button>
        </div>
      ),
    
    },
  ];

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterData(query, selectedSource, selectedTargetUrl);
  };

  const filterData = (query, source, targetUrl) => {
    let filteredResult = [...data];

    if (query) {
      const queryRegex = new RegExp(query, 'i');
      filteredResult = filteredResult.filter((item) =>
        item.query.match(queryRegex) || item.target_url.match(queryRegex)
      );
    }

    if (source) {
      filteredResult = filteredResult.filter((item) =>
        item.source_url.toLowerCase().includes(source.toLowerCase())
      );
    }

    if (targetUrl) {
      const targetUrlRegex = new RegExp(targetUrl, 'i');
      filteredResult = filteredResult.filter((item) =>
        targetUrlRegex.test(item.target_url)
      );
    }

    setFilteredData(filteredResult);
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <div className="relative mb-4 mt-4">
  <input
    type="text"
    placeholder="Search for keyword"
    value={searchQuery}
    onChange={handleSearchInputChange}
    className="pl-10 pr-4 py-2 border rounded-md w-[40%] focus:outline-none focus:ring focus:border-blue-300"
  />
  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
    <FiSearch className="text-gray-700" />
  </div>
</div>
<div className="mb-4">
  <label className="mr-2">Filter by Target URL:</label>
  <select
    value={selectedTargetUrl}
    onChange={handleTargetUrlFilterChange}
    className="border rounded-md py-1 w-[70%]
     px-2 focus:outline-none focus:ring focus:border-blue-300"
  >
    <option value="">All Sources</option>
    {uniqueTargetUrls.map((url) => (
      <option key={url} value={url}>
        {url}
      </option>
    ))}
  </select>
</div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        striped
        onRowClicked={(row) => {
          navigate(`/query/${row.id}/${encodeURIComponent(row.query)}`, {
            state: { queryName: row.query },
          });
        }}
      />
    </div>
  );
};

export default DataTableComponent;

