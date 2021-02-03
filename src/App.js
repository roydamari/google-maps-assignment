import React, { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [ipDetails, setIpDetails] = useState({});
  const [error, setError] = useState('')



  useEffect(() => {
    (async () => {
      //Send the IpData HTTP request on load
      fetch(`https://api.ipdata.co/?api-key=${process.env.REACT_APP_IPDATA_API_KEY}`)
        .then(response => response.json())
        .then(data => {
          //Check for errors and save it
          if (data.message) setError(data.message)
          else setIpDetails(data)
        }).catch(e => {
          setError(e.message)
        })
    })();
  }, [])

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <iframe
        width="100%"
        height="100%"
        title="maps"
        frameBorder="0" style={{ border: 0 }}
        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${ipDetails.country_name ? ipDetails.country_name : ''},${ipDetails.city ? ipDetails.city : ''}`}
        allowFullScreen>
      </iframe>
      <div className='info'>
        {!error ? <>
          <div style={{ display: 'flex' }}>
            <img alt='flag' src={ipDetails.flag} height='30px' />
            <div className='country'>{ipDetails.country_name}, {ipDetails.city}</div>
          </div>
          <div><strong>Ip Address:</strong> {ipDetails.ip}</div>
          <div><strong>Continent: </strong>{ipDetails.continent_name}</div>
          <div><strong>Long, Lat: </strong>{ipDetails.longitude}, {ipDetails.latitude}</div>
          {ipDetails.time_zone && <div><strong>Time zone: </strong>{ipDetails.time_zone.abbr} {ipDetails.time_zone.offset}</div>}
          {ipDetails.currency && <div><strong>Currency: </strong>{ipDetails.currency.symbol} {ipDetails.currency.name}</div>}
          <strong>Languages:</strong>
          <ul>
            {ipDetails.languages && ipDetails.languages.map((language) => {
              return <li key={language.name}>{language.name}</li>
            })}
          </ul>
        </> : <p>You have exceeded your quota for this API, try again at a later time.</p>}
      </div>
    </div>
  );
}

export default App;
