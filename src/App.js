// import { Routes, Route, useNavigate } from 'react-router-dom';
// import Signup from './pages/signup.js';
// import Login from './pages/Login.js';
// import {Toaster} from "react-hot-toast"
// import Customize from './pages/Customize.js';
// import { useContext } from 'react';
// import  { userDataContext } from './context/Usercontext.js';
// import Home from './pages/Home.js';
// import Customize2 from './pages/Customize2.js';

// function App() {
//   const {userData,setUserData}=useContext(userDataContext);
//   const Navigate=useNavigate()
//   return (
//     <>
//    <Routes>
//   <Route 
//     path="/" 
//     element={
//       (userData?.assistantImage && userData.assistantName) 
//         ? <Home /> 
//         : <Navigate to="/login" />
      
//     } 
//   />
//   <Route 
//     path="/customizeS" 
//     element={
//       userData? <Customize2 /> 
//         : <Navigate to="/signup" />
//     } 
//   />

//   <Route 
//     path="/signup" 
//     element={
//       !userData 
//         ? <Signup /> 
//         : <Navigate to="/" />
//     } 
//   />

//   <Route 
//     path="/login" 
//     element={
//       !userData 
//         ? <Login /> 
//         : <Navigate to="/" />
//     } 
//   />

//   <Route 
//     path="/customize" 
//     element={
//       userData 
//         ? <Customize /> 
//         : <Navigate to="/signup" />
//     } 
//   />
// </Routes>

// <Toaster />

//     </>
//   );
// }

// export default App;

// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from './pages/signup.js';
import Login from './pages/Login';
import Home from './pages/Home.js';
import Customize from './pages/Customize.js';
import Customize2 from './pages/Customize2.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customize"
          element={
            <ProtectedRoute>
              <Customize />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customizeS"
          element={
            <ProtectedRoute>
              <Customize2 />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;

