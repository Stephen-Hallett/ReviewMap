import "./App.css";
import NavbarComponent from "./components/navbar";
import "mapbox-gl/dist/mapbox-gl.css";
import { Marker } from "react-map-gl";
import Pin from "./components/pin";

import { Map, FullscreenControl } from "react-map-gl";
import React, { useEffect, useState } from "react";

const TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN; // Set your mapbox token here
const backend_url = "http://127.0.0.1:8080";

function App() {
  const [viewState, setViewState] = useState({
    longitude: 174.7599,
    latitude: -36.8589,
    zoom: 10,
  });
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const endpoint = backend_url + "/category";

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setCategories(result);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      const endpoint = backend_url + "/location";

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setLocations(result);
    };
    fetchLocations();
  }, []);

  console.log(locations);

  return (
    <div className="App">
      <>
        <NavbarComponent />
        <div className="map-container">
          <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={TOKEN}
            onRender={(event) => event.target.resize()}
          >
            {locations.length > 0
              ? locations.map((item) => {
                  return (
                    <Marker
                      longitude={item.Longitude}
                      latitude={item.Latitude}
                      anchor="bottom"
                    >
                      <Pin colour="#46afc7" />
                    </Marker>
                  );
                })
              : null}
            <FullscreenControl />
          </Map>
        </div>
      </>
    </div>
  );
}

export default App;
