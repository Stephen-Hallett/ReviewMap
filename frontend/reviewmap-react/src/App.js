import './App.css';
import NavbarComponent from './components/navbar';
import "mapbox-gl/dist/mapbox-gl.css";



import {Map, FullscreenControl} from 'react-map-gl'
import React, {useState} from "react";

//const TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN; // Set your mapbox token here

const TOKEN = "pk.eyJ1Ijoic3RldmFsaW5pIiwiYSI6ImNsOGYwazg4czAzMmczbm5ndjRoZ3podXkifQ.8QQzHOriQiNkgg68Wswhpw";

function App() {
  const [viewState, setViewState] = useState({
    longitude: 174.7599,
    latitude: -36.8589,
    zoom: 10
  });

  return (
    <div className="App">
      <>
      <NavbarComponent/>
        <div className='map-container'>
          <Map 
          {...viewState} 
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={TOKEN}
          onRender={(event) => event.target.resize()}
          >
          <FullscreenControl />
          </Map>
        </div>
      </>
    </div>
  );
}

export default App;
