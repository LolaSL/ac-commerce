import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  LoadScript,
  GoogleMap,
  StandaloneSearchBox,
  Marker,
} from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

const defaultLocation = { lat: 45.516, lng: -73.56 };
const libs = ['places'];

export default function MapPage() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [center, setCenter] = useState(defaultLocation);
  const [location, setLocation] = useState(center);

  const mapRef = useRef(null);
  const placeRef = useRef(null);
  const markerRef = useRef(null);

  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  };

  useEffect(() => {
    const fetchGoogleApiKey = async () => {
      try {
        const { data } = await axios('/api/keys/google', {
          headers: { Authorization: `BEARER ${userInfo.token}` },
        });
        setGoogleApiKey(data.key);
        getUserCurrentLocation();
      } catch (error) {
        console.error('Failed to fetch Google API key:', error);
      }
    };

    fetchGoogleApiKey();
    ctxDispatch({ type: 'SET_FULLBOX_ON' });
  }, [ctxDispatch, userInfo.token]);

  const onLoad = (map) => {
    mapRef.current = map;
  };

  const onIdle = () => {
    setLocation({
      lat: mapRef.current.center.lat(),
      lng: mapRef.current.center.lng(),
    });
  };

  const onLoadPlaces = (place) => {
    placeRef.current = place;
  };

  const onPlacesChanged = () => {
    const place = placeRef.current.getPlaces()[0].geometry.location;
    setCenter({ lat: place.lat(), lng: place.lng() });
    setLocation({ lat: place.lat(), lng: place.lng() });
  };

  const onMarkerLoad = (marker) => {
    markerRef.current = marker;
  };

  const onConfirm = () => {
    const places = placeRef.current.getPlaces() || [{}];
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS_MAP_LOCATION',
      payload: {
        lat: location.lat,
        lng: location.lng,
        address: places[0].formatted_address,
        name: places[0].name,
        vicinity: places[0].vicinity,
        googleAddressId: places[0].id,
      },
    });
    toast.success('Location selected successfully.');
    navigate('/shipping');
  };

  return (
    <div className="full-box" style={{ height: '100vh' }}>
      <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
        <GoogleMap
          id="sample-map"
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={center}
          zoom={15}
          onLoad={onLoad}
          onIdle={onIdle}
        >
          <StandaloneSearchBox
            onLoad={onLoadPlaces}
            onPlacesChanged={onPlacesChanged}
          >
            <div className="map-input-box">
              <input type="text" placeholder="Enter your address" />
              <Button className="btn btn-secondary" type="button" onClick={onConfirm}>
                Confirm
              </Button>
            </div>
          </StandaloneSearchBox>
          <Marker position={location} onLoad={onMarkerLoad} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
