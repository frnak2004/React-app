import React, { useMemo } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
//RENDERING A MAP
import './Map.css';
// export default function Map(props) {
//   const mapRef = useRef();
//   const { center, zoom } = props;
//   useEffect(() => {
//     const map = new window.google.maps.Map(mapRef.current, {
//       center: center,
//       zoom: zoom,
//     });
//     new window.google.maps.Marker({
//       position: center,
//       map: map,
//     });
//   }, [center, zoom]);

//   return (
//     <div
//       ref={mapRef}
//       className={`map ${props.className} `}
//       style={props.style}
//     ></div>
//   );
// }

export default function Home() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });
  if (!isLoaded) return <div>Loading ....</div>;
  return <Map />;
}

function Map(params) {
  const center = useMemo(() => ({ lat: 44, lng: -89 }), []);
  return (
    <GoogleMap zoom={16} center={center} mapContainerClassName="map-container">
      <MarkerF position={center} />
    </GoogleMap>
  );
}
/*  const center = useMemo(() => ({ lat: 44, lng: -89 }), []);*/
