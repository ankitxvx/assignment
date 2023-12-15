import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

function App() {
  const [location, setLocation] = useState('');
  const [outletIdentifier, setOutletIdentifier] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/getOutlet', { location });
      setOutletIdentifier(response.data.outletIdentifier);
    } catch (error) {
      console.error('Error fetching outlet identifier:', error);
    }
  };

  return (
    <div className="App">
      <h1>OUTLET FINDER</h1>
      <div>
        <label>
          Enter Customer Location:
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
        <button onClick={handleSubmit}>Find Outlet</button>
      </div>
      {outletIdentifier && (
        <div>
          <h2>Outlet Identifier:</h2>
          <p>{outletIdentifier}</p>
        </div>
      )}
    </div>
  );
}

export default App;
