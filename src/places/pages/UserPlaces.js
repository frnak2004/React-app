import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PlaceList from '../components/PlaceList';

// import logo from "./OIP.jpeg";
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import { useHttpClient } from '../../shared/hooks/http-hook';

// const DUMMY_PLACES = [
// {
//   id: "p1",
//   title: "White House",
//   description: "one of the most famous buildings",
//   imageUrl: logo,
//   address: "1600 Pennsylvania Ave NW, Washington, DC 20006",
//   location: {
//     lat: 39.8750218,
//     lng: -31.1374551,
//   },
//   creator: "u1",
// },
// {
//   id: "p2",
//   title: "White House",
//   description: "one of the most famous buildings",
//   imageUrl: logo,
//   address: "1600 Pennsylvania Ave NW, Washington, DC 20006",
//   location: {
//     lat: 39.8750218,
//     lng: -31.1374551,
//   },
//   creator: "u2",
// },
// ];
export default function UserPlaces() {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);
  // to filter places by id we import useParams

  const placeDeletedHandler = deletedPlaceId => {
    setLoadedPlaces(prevPlaces =>
      prevPlaces.filter(place => place.id !== deletedPlaceId)
    );
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </>
  );
}
