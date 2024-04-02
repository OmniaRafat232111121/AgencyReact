import { useSelector } from "react-redux";

const CaptionQuery = ({ textContent }) => {
  const keywordData = useSelector((state) => state.querySlice.data);
    return (
      <div className="overflow-x-auto mx-auto lg:w-[80%] md:w-full md:mt-[1rem] text-center 
      shadow-none border-2 border-gray-200 rounded-2xl
       overflow-auto">
        <table className="min-w-full text-left table-auto">
          <thead className="text-black bg-white border-b-2 border-black">
            <tr>
              <th className="px-4 py-2">Caption Text</th>
            </tr>
          </thead>
          <tbody>
            {textContent.map((text, index) => (
              <tr key={index} className="bg-white border-b">
                <td className="px-4 py-2">{text.caption || text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default CaptionQuery;
  