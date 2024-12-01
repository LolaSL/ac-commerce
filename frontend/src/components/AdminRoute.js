import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from '../Store';

export default function AdminRoute({ children }) {
  // Access userInfo from the global state (Store context)
  const { state } = useContext(Store);
  const { userInfo } = state;

  // Check if the user is an admin in the state
  if (userInfo && userInfo.isAdmin) {
    return children;
  }

  // Check if serviceProviderInfo exists in local storage (and contains token)
  const serviceProviderInfo = localStorage.getItem('serviceProviderInfo')
    ? JSON.parse(localStorage.getItem('serviceProviderInfo'))
    : null;

  if (serviceProviderInfo && serviceProviderInfo.token) {
    // If serviceProviderInfo exists with a token, proceed to render children
    return children;
  }

  // Redirect to login if no admin or serviceProviderInfo exists
  return <Navigate to="/signin" />;
}
