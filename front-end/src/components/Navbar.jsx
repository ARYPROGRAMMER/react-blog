import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Model from './Model';

const Navbar = ({ theme, toggleTheme }) => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');

  const navigate = useNavigate();

  const login = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login', { username, password });
      const token = response.data.token;
      localStorage.setItem('token', `Bearer ${token}`);
      setIsLoggedIn(true);
      setUser(username);
      handleClose();
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred during login');
    }
  };

  const register = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/register', { username, email, password });
      const token = response.data.token;
      localStorage.setItem('token', `Bearer ${token}`);
      setIsLoggedIn(true);
      setUser(username);
      handleClose();
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred during registration');
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleLogin = () => {
    setIsLogin(!isLogin);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:8080/api/profile')
        .then((response) => {
          setUser(response.data.username);
          setIsLoggedIn(true);
        })
        .catch(() => {
          setIsLoggedIn(false);
        });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <>
      <nav className="border-b-4 border-green-700 text-center fixed top-0 bg-green-900 font-bold w-full text-lg text-white">
        <ul>
          <li className="inline-block py-4">
            <Link to="/" className="pl-6 pr-8">
              Home
            </Link>
          </li>
          <li className="inline-block py-4">
            <Link to="/about" className="pl-6 pr-8">
              About
            </Link>
          </li>
          <li className="inline-block py-4">
            <Link to="/article-list" className="pl-6 pr-8">
              Articles
            </Link>
          </li>
          <li className="inline-block py-4">
            {isLoggedIn ? (
              <div>
                <p className="inline-block mr-4" onClick={handleProfileClick}>
                  {user}
                </p>
                <button onClick={logout}>Logout</button>
              </div>
            ) : (
              <button type="button" onClick={handleOpen}>
                Login/Register
              </button>
            )}
          </li>
          <li className="inline-block py-4">
            <button className="theme-toggler" onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </li>
        </ul>
      </nav>

      <Model isOpen={open} onClose={handleClose}>
        <>
          <div className="login-container">
            <div className="login-header text-slate-900">
              <h2>{isLogin ? 'Login' : 'Register'}</h2>
            </div>
            <form onSubmit={isLogin ? login : register} className="login-form" style={{ display: 'flex', flexDirection: 'column' }}>
              <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} className="input-field" placeholder="Username" required />
              {isLogin ? null : <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="input-field" placeholder="Email" required />}
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="input-field" placeholder="Password" required />
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <button
                className="login-button"
                style={{
                  background: '#44bb44',
                  width: '100%',
                  height: 40,
                }}
              >
                {isLogin ? 'Login' : 'Register'}
              </button>
              <p onClick={toggleLogin} style={{ cursor: 'pointer', color: 'blue' }}>
                {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
              </p>
            </form>
          </div>
        </>
      </Model>
    </>
  );
};

export default Navbar;
