import "./App.css";
import NavbarComponent from "./components/navbar";
import "mapbox-gl/dist/mapbox-gl.css";
import Pin from "./components/pin";

import { Map, FullscreenControl, Marker, Popup } from "react-map-gl";
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
  const [categories, setCategories] = useState({});
  const [popups, setPopups] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const endpoint = backend_url + "/category";

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      var categories_dict = {};
      function populate_dict(category) {
        categories_dict[category.partitionKey] = category;
      }
      result.forEach(populate_dict);

      setCategories(categories_dict);
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
      setPopups(Array(result.length).fill(false));
    };
    fetchLocations();
  }, []);

  const handleMove = (evt) => {
    setViewState(evt.viewState);
    setPopups(Array(locations.length).fill(false));
  }

  const handleMarkerClick = (index) => {
    console.log("Clicked!");
    const newPopups = [...popups];
    newPopups[index] = true;
    setPopups(newPopups);
  };

  console.log(categories);
  console.log(popups)

  return (
    <div className="App">
      <>
        <NavbarComponent />
        <div className="map-container">
          <Map
            {...viewState}
            onMove={(evt) => handleMove(evt)}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={TOKEN}
            onRender={(event) => event.target.resize()}
          >
            {locations.length > 0
              ? locations.map((item, index) => {
                console.log(popups[index])
                  return (
                    <React.Fragment key={item.rowKey}>
                      <Marker
                        longitude={item.Longitude}
                        latitude={item.Latitude}
                        anchor="bottom"
                        key={item.rowKey}
                        onClick={() => handleMarkerClick(index)}
                      >
                        <Pin colour={categories[item.partitionKey].Colour} />
                      </Marker>
                      {true && (<Popup
                      longitude={item.Longitude}
                      latitude={item.Latitude}
                      anchor="bottom"
                      offset={35}
                      >
                        Testing
                      </Popup>)}
                    </React.Fragment>
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
