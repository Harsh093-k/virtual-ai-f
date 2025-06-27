import React, { useContext, useEffect, useState } from 'react';
import bg from '../assests/bg.avif';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { userDataContext } from '../context/Usercontext';
import axios from 'axios';

function Signup() {
  const navigate = useNavigate();
  const {serverUrl,setUserData}=useContext(userDataContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) navigate('/');
  }, [navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await axios.post(`${serverUrl}/api/user/signup`,{
          name: formData.username,
          email: formData.email,
          password: formData.password,
        },{
          withCredentials:true,
        });
      
      if (!res.ok) {
        throw new Error(res.data.message || 'Signup failed');
      }
      
      Cookies.set('token', res.data.token, { expires: 7 });
      setUserData(res.data.newUser);
      navigate('/customize');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message);
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="w-[90%] h-[600px] max-w-[500px] bg-[#0000003d] backdrop-blur shadow-black flex justify-center items-center flex-col rounded-lg p-8"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-white">Sign Up</h1>
        <p className="text-white/80">Create a new account</p>

        <div className="w-full">
          <label htmlFor="username" className="block text-white font-medium mb-1">Username</label>
          <input
            id="username" name="username" type="text" required
            className="w-full h-[50px] mb-4 px-4 rounded-lg bg-transparent border border-gray-300 text-white focus:outline-none focus:border-blue-500"
            placeholder="Enter your username"
            value={formData.username} onChange={handleChange}
          />
        </div>

        <div className="w-full">
          <label htmlFor="email" className="block text-white font-medium mb-1">Email</label>
          <input
            id="email" name="email" type="email" required
            className="w-full h-[50px] mb-4 px-4 rounded-lg bg-transparent border border-gray-300 text-white focus:outline-none focus:border-blue-500"
            placeholder="Enter your email"
            value={formData.email} onChange={handleChange}
          />
        </div>

        <div className="w-full">
          <label htmlFor="password" className="block text-white font-medium mb-1">Password</label>
          <input
            id="password" name="password" type="password" required
            className="w-full h-[50px] mb-4 px-4 rounded-lg bg-transparent border border-gray-300 text-white focus:outline-none focus:border-blue-500"
            placeholder="Enter your password"
            value={formData.password} onChange={handleChange}
          />
        </div>

        <div className="w-full">
          <label htmlFor="confirmPassword" className="block text-white font-medium mb-1">Confirm Password</label>
          <input
            id="confirmPassword" name="confirmPassword" type="password" required
            className="w-full h-[50px] mb-4 px-4 rounded-lg bg-transparent border border-gray-300 text-white focus:outline-none focus:border-blue-500"
            placeholder="Confirm your password"
            value={formData.confirmPassword} onChange={handleChange}
          />
        </div>

        {error && <p className="text-red-400 mt-2">{error}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition mt-5"
        >
          Sign Up
        </button>

        <p className="text-white mt-4">
          Already have an account? <a href="/login" className="text-blue-400 hover:underline">Login</a>
        </p>

        <p className="text-white mt-2">Or sign up with:</p>
      </form>
    </div>
  );
}

export default Signup;

