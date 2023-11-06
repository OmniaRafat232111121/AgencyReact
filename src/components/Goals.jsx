// /* eslint-disable react/prop-types */
// // // import { useEffect, useState } from "react";

// const { useEffect } = require("react");

// // // const Goals = () => {
// // //   const [user, setUser] = useState({ data: [] }); // Initialize with an empty data array

// // //   const fetchData = () => {
// // //     fetch('https://jsonplaceholder.typicode.com/posts')
// // //       .then((response) => response.json())
// // //       .then((data) => setUser({ data }));
// // //   }

// // //   useEffect(() => {
// // //     fetchData();
// // //   }, []);

// // //   return (
// // //     <div>
// // //       <h1>{user.data.length > 0 ? user.data[0].title : ''}</h1>
// // //     </div>
// // //   );
// // // }

// // // export default Goals;


// // import { useReducer } from "react";

// // const reducer = (state, action) => {
// //   if (action.type === 'Buy_cake') {
// //     return {
// //       money: state.money + 10
// //     };
// //   }

// //   if (action.type === 'Buy_icecream') {
// //     return {
// //       money: state.money - 10
// //     };
// //   }
// // };

// // const Goals = () => {
// //   const initialState = { money: 10 };
// //   const [state, dispatch] = useReducer(reducer, initialState);

// //   return (
// //     <div>
// //       <h1>wallet: {state.money}</h1>
// //       <button onClick={() => dispatch({ type: 'Buy_cake' })}>Shop for dessert cake</button>
// //       <button onClick={() => dispatch({ type: 'Buy_icecream' })}>Shop for ice cream</button>
// //     </div>
// //   );
// // }

// // export default Goals;





// const HighComponent = (WrappedComponent) => {
//   return function HighComponent({ text, ...restProps }) {
//     const upperCase = text.toUpperCase();
//     return <WrappedComponent text={upperCase} {...restProps} />;
//   };
// };

// const OriginalComponent = ({ text }) => {
//   return <div>{text}</div>;
// };

// const ComponentWithUpperCase = HighComponent(OriginalComponent);

// function App() {
//   return (
//     <div>
//       <OriginalComponent text="Hello, World" />
//       <ComponentWithUpperCase text="Hello, World" />
//     </div>
//   );
// }

// export default App;


import { useState,useEffect } from "react";
const DataFetcher=({render,url})=>{
  const [data,setData]=useState([]);
  useEffect(()=>{
    if(url.includes("desserts")){
      setData(['cake','icecream','pie'])
    }
    else{
      setData(['water','soda','juice']);
    }

  },[])
  return render(data)
}

const DessertsCount=()=>{
  return(
    <DataFetcher
    url="https://littlelemon/desserts"
    render={(data)=><p>{data.length} deseerts</p>}
    />
  )
}
export default DessertsCount