import { useState } from "react";
import { useSelector } from "react-redux";

const ProjectRanksTable = () => {
    const data = useSelector((state) => state.tableSlice.data); // Assuming your data is stored in Redux
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
  
    // Calculate the currently displayed rows
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    return (
      <>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Keywords</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Rank</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Best Rank</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRows.map((row, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{row.query}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.rank}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.best_rank}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{row.google_domain}</td>
                <td className="px-6 py-4 whitespace-nowrap">Action Buttons Here</td>
              </tr>
            ))}
          </tbody>
        </table>
  
        <div className="py-3">
          <nav className="block">
            <ul className="flex flex-wrap pl-0 list-none rounded">
              {[...Array(Math.ceil(data.length / rowsPerPage)).keys()].map(number => (
                <li key={number} className="flex w-full text-xs font-semibold first:ml-0">
                  <a href="!#" onClick={() => paginate(number + 1)} className="px-3 py-1 text-blue-500 bg-white rounded hover:text-blue-600">{number + 1}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </>
    );
  };
  
export default   ProjectRanksTable