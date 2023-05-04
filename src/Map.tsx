import { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import getDistance from "geolib/es/getPreciseDistance";

type LatLng = { lat: number; lng: number };

const containerStyle = {
  width: "400px",
  height: "400px",
};

// watchPosition 동작 원리

function Map() {
  const [currentLocation, setCurrentLocation] = useState<LatLng | undefined>(
    undefined
  );
  const [locations, setLocations] = useState<LatLng[]>([]);
  console.log(locations);

  // useEffect(() => {
  //   navigator.geolocation.watchPosition(
  //     (position) => {
  //       const location = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude,
  //       };

  //       // 처음 위치인 경우 무조건 추가
  //       // if (locations.length === 0) {
  //       // setLocations([location]);
  //       // } else {
  //       // 이전 위치와 새 위치의 거리 계산
  //       // const lastLocation = locations[locations.length - 1];
  //       // const distance = getDistance(location, lastLocation);

  //       // 5m 이상 이동한 경우에만 새로운 위치 추가
  //       // if (distance > 5) {
  //       // setLocations([...locations, location]);
  //       // }
  //       // }
  //       setLocations([...locations, location]);
  //       setCurrentLocation(location);
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }, [locations]);
  useEffect(() => {
    // const interval = setInterval(() => {
    console.log("useEffect 실행됨");
    navigator.geolocation.watchPosition(
      (position) => {
        console.log("position.coords : ", position.coords);
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setCurrentLocation(location);

        if (locations.length === 0) {
          setLocations([location]);
        }
        if (
          locations.length >= 1 &&
          locations[locations.length - 1].lat === location.lat
        ) {
          setLocations((prev) => [...prev, location]);
        }
      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 3000, // 3초마다 위치 정보 갱신 시도
      }
    );
  }, [locations]);

  function getLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        position &&
          console.log(position.coords.latitude, position.coords.longitude);
      },
      function (error) {
        alert("Error occurred. Error code: " + error.code);
      },
      { timeout: 5000 }
    );
  }

  return (
    // <div>1</div>
    <>
      <LoadScript
        googleMapsApiKey="AIzaSyCJFM2M5yR4aFo9nob0ohdJxIDMLsvhGPk"
        onLoad={() => console.log("Loaded!")}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentLocation}
          zoom={14}
          options={{
            styles: [
              {
                // 색상
                featureType: "all",
                stylers: [
                  {
                    saturation: -100,
                  },
                ],
              },
              {
                // 물 색상
                featureType: "water",
                stylers: [
                  {
                    color: "#7dcdcd",
                  },
                ],
              },
              {
                // 건물 이름 가리기
                featureType: "all",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },

              {
                // 지도 단순화하기
                featureType: "road",
                elementType: "geometry",
                stylers: [
                  { visibility: "simplified" },
                  { hue: "#000000" },
                  { saturation: -50 },
                  { lightness: -15 },
                  { weight: 1.5 },
                ],
              },
            ],
          }}
        >
          {currentLocation && <Marker position={currentLocation} />}

          {locations.length > 1 && (
            <Polyline
              path={locations}
              options={{
                strokeColor: "#76dd72",
                strokeOpacity: 1,
                strokeWeight: 3,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
      <button onClick={getLocation}>현재나의위치</button>
    </>
  );
}

export default Map;
