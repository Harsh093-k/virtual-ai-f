import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import bg from "../assests/bg.avif";
import {userDataContext} from '../context/Usercontext';
import Cookies from 'js-cookie';
function Login() {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
 const {serverUrl,userData,setUserData} =useContext(userDataContext)
  const [cookies, setCookie] = useCookies(['token']);
  const navigate = useNavigate();



useEffect(() => {
  const token = cookies.token;

  if (token) navigate('/');
}, [cookies.token, navigate]);


  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${serverUrl}/api/user/login`, {
        email: Email,
        password: Password,
      },{withCredentials:true});

       setCookie("token",res.data.token,{
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 3600 * 1000,
})
      setUserData(res.data.user);
   
      toast.success(res?.data.message);
    } catch (error) {
      setUserData(null);
      if (error.response) {
        toast.error(error.response.data.message || 'Incorrect username or password');
      } else if (error.request) {
        toast.error('No response from server. Please try again later.');
      } else {
        toast.error('An unexpected error occurred.');
      }
      console.error(error);
    } finally {
      setEmail('');
      setPassword('');
    }
  };
  
  return (
    <div className="w-full h-[100vh] bg-cover flex justify-center items-center"
         style={{ backgroundImage: `url(${bg})` }}>
      <form
        onSubmit={submit}
        className="w-[90%] h-[600px] max-w-[500px] bg-[#0000003d]
                   backdrop-blur shadow-black flex justify-center
                   items-center flex-col rounded-lg p-8"
      >
        <h1 className="text-3xl font-bold text-white">Login</h1>

        {/* Email */}
        <div className="w-full">
          <label htmlFor="email" className="text-white font-medium mb-1 block">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-[50px] mb-4 px-4 rounded-lg bg-transparent
                       border border-gray-300 text-white focus:outline-none focus:border-blue-500"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="w-full">
          <label htmlFor="password" className="text-white font-medium mb-1 block">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full h-[50px] mb-4 px-4 rounded-lg bg-transparent
                       border border-gray-300 text-white focus:outline-none focus:border-blue-500"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition mt-5"
        >
          Login
        </button>

        <p className="text-white mt-4">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-400 hover:underline">Sign up</a>
        </p>
        <p className="text-white mt-2">Or sign in with:</p>
      </form>
    </div>
  );
}

export default Login;

