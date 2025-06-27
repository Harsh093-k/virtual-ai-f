// ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { userDataContext } from '../context/Usercontext';
import { useCookies } from 'react-cookie';

const ProtectedRoute = ({ children }) => {
    const [cookie,setCookie]=useCookies(["token"]);
  const token = cookie.token;
  

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
