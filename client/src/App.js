import React, {useEffect, useState} from 'react';

function App() {
    const [backendData, setBackendData] = useState([{}]);
  
    useEffect(() => {
      fetch("/api").then(
        response => response.json()
      ).then(
        data => {
          setBackendData(data)
        }
      )
    }, [])
  
    return (
      <div>
        {(typeof backendData.sums === 'undefined') ? (
          <p>Loading...</p>
        ) : (
          backendData.sums.map((sum, i) => (
            <p key={i}>{sum}</p>
          ))
  
        )}
      </div>
    )
  }
  
  export default App;
  