// import DataTable from "./components/DataTable"
import DataTableComponent from "./components/Table"
import data from './data.json';


const App = () => {
  return (
    <div className="p-10">
      {/* <DataTable/> */}
      <DataTableComponent   data={data} />

    </div>
  )
}

export default App