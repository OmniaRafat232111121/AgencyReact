const AltQuery = ({ altData }) => {
    if (!altData) {
      return null;
    }
  
    return (
      <div className="overflow-x-auto mx-auto lg:w-[80%] md:w-full md:mt-[1rem] text-center
      shadow-none border-2 border-gray-200 rounded-2xl
       overflow-auto">
        <table className="min-w-full text-left table-auto">
          <thead className="text-black bg-white border-b-2 border-black">
            <tr>
              <th className="px-4 py-2">Alt</th>
              <th className="px-4 py-2">Count</th>
            </tr>
          </thead>
          <tbody>
            {altData.map((altItem, index) => (
              <tr key={index} className="bg-white border-b">
                <td className="px-4 py-2">{altItem.altText || altItem.alt}</td>
                <td className="px-4 py-2">{altItem.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default AltQuery;
  