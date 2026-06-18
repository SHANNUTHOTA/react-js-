import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Default User Seed
const DEFAULT_USER = {
  name: 'shannuthota',
  phone: '8976543210',
  email: 'shannuthota',
  password: 'password123',
  company: 'Agency Co.',
  agency: 'yes',
  bio: 'Creative frontend developer and UI/UX enthusiast. Passionate about building clean, responsive, and user-friendly web experiences with React.',
  avatar: ''
};

const DEFAULT_AVATAR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%237C3AED"><circle cx="50" cy="50" r="50" fill="%23F5F3FF"/><path d="M50 50c11 0 20-9 20-20s-9-20-20-20-20 9-20 20 9 20 20 20zm0 8c-15 0-40 8-40 24v6h80v-6c0-16-25-24-40-24z" fill="%237C3AED"/></svg>`;

function App() {
  const [screen, setScreen] = useState('welcome');
  const [theme, setTheme] = useState(() => localStorage.getItem('popx_theme') || 'light');
  
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem('popx_users');
    let list = stored ? JSON.parse(stored) : null;
    
    if (list) {
      const hasShannu = list.some(u => u.email.toLowerCase() === 'shannuthota');
      if (!hasShannu) {
        list = [DEFAULT_USER, ...list];
        localStorage.setItem('popx_users', JSON.stringify(list));
      }
      return list;
    } else {
      const defaultList = [DEFAULT_USER];
      localStorage.setItem('popx_users', JSON.stringify(defaultList));
      return defaultList;
    }
  });

  const [activeUser, setActiveUser] = useState(() => {
    const stored = localStorage.getItem('popx_active_user');
    let user = stored ? JSON.parse(stored) : null;
    // Auto-update or transition active session to shannuthota if it was Marry Doe
    if (user && (user.email.toLowerCase() === 'marry@gmail.com' || user.email.toLowerCase() === 'marry@gmail.com')) {
      user = DEFAULT_USER;
      localStorage.setItem('popx_active_user', JSON.stringify(user));
    }
    return user;
  });

  // Toast notifications
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (message) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Theme configuration hook
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('popx_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    if (activeUser) {
      setScreen('profile');
    } else if (screen === 'profile') {
      setScreen('welcome');
    }
  }, [activeUser]);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState({});

  // Signup Form States
  const [signupData, setSignupData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    company: '',
    agency: 'no',
    bio: 'Hi, I am new to PopX! Excited to get started with this amazing platform.'
  });
  const [signupErrors, setSignupErrors] = useState({});

  // Profile Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    agency: 'no',
    bio: ''
  });
  const [editErrors, setEditErrors] = useState({});

  const fileInputRef = useRef(null);

  // Email/Username Validator
  const validateEmail = (email) => {
    if (!email.includes('@')) {
      return email.trim().length >= 3;
    }
    return /\S+@\S+\.\S+/.test(email);
  };


  // Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!loginEmail.trim()) {
      errors.email = 'Email address is required';
    } else if (!validateEmail(loginEmail)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!loginPassword) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    // Authenticate user
    const foundUser = users.find(
      (u) =>
        u.email.toLowerCase() === loginEmail.trim().toLowerCase() &&
        u.password === loginPassword
    );

    if (foundUser) {
      setLoginErrors({});
      setActiveUser(foundUser);
      localStorage.setItem('popx_active_user', JSON.stringify(foundUser));
      showToast('Welcome back, ' + foundUser.name + '!');
      setLoginEmail('');
      setLoginPassword('');
    } else {
      setLoginErrors({
        auth: 'Invalid email address or password'
      });
      showToast('Access Denied. Check your details.');
    }
  };

  // Signup Submit
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!signupData.name.trim()) {
      errors.name = 'Full name is required';
    }

    if (!signupData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(signupData.phone.trim())) {
      errors.phone = 'Phone number must be exactly 10 digits';
    }

    if (!signupData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!validateEmail(signupData.email)) {
      errors.email = 'Please enter a valid email address';
    } else {
      const emailExists = users.some(
        (u) => u.email.toLowerCase() === signupData.email.trim().toLowerCase()
      );
      if (emailExists) {
        errors.email = 'This email is already registered';
      }
    }

    if (!signupData.password) {
      errors.password = 'Password is required';
    } else if (signupData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
      showToast('Please check the highlighted fields');
      return;
    }

    setSignupErrors({});
    const newUser = {
      ...signupData,
      email: signupData.email.trim(),
      avatar: ''
    };

    const newUsersList = [...users, newUser];
    setUsers(newUsersList);
    localStorage.setItem('popx_users', JSON.stringify(newUsersList));

    setActiveUser(newUser);
    localStorage.setItem('popx_active_user', JSON.stringify(newUser));

    showToast('Registration successful! Setup complete.');
    setSignupData({
      name: '',
      phone: '',
      email: '',
      password: '',
      company: '',
      agency: 'no',
      bio: 'Hi, I am new to PopX! Excited to get started with this amazing platform.'
    });
  };

  // Start Editing Profile
  const startEditing = () => {
    setEditData({
      name: activeUser.name,
      phone: activeUser.phone,
      email: activeUser.email,
      company: activeUser.company || '',
      agency: activeUser.agency || 'no',
      bio: activeUser.bio || ''
    });
    setEditErrors({});
    setIsEditing(true);
  };

  // Save Profile Edit
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const errors = {};

    if (!editData.name.trim()) {
      errors.name = 'Full name is required';
    }

    if (!editData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(editData.phone.trim())) {
      errors.phone = 'Phone number must be exactly 10 digits';
    }

    if (!editData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!validateEmail(editData.email)) {
      errors.email = 'Please enter a valid email address';
    } else if (editData.email.toLowerCase() !== activeUser.email.toLowerCase()) {
      const emailExists = users.some(
        (u) => u.email.toLowerCase() === editData.email.trim().toLowerCase()
      );
      if (emailExists) {
        errors.email = 'This email is already registered';
      }
    }

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      showToast('Validation failed. Review values.');
      return;
    }

    setEditErrors({});

    const updatedUser = {
      ...activeUser,
      name: editData.name,
      phone: editData.phone,
      email: editData.email.trim(),
      company: editData.company,
      agency: editData.agency,
      bio: editData.bio
    };

    setActiveUser(updatedUser);
    localStorage.setItem('popx_active_user', JSON.stringify(updatedUser));

    const updatedUsersList = users.map((u) =>
      u.email.toLowerCase() === activeUser.email.toLowerCase() ? updatedUser : u
    );
    setUsers(updatedUsersList);
    localStorage.setItem('popx_users', JSON.stringify(updatedUsersList));

    setIsEditing(false);
    showToast('Account profile successfully updated!');
  };

  // Avatar Image Upload Action
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const updatedUser = { ...activeUser, avatar: base64String };

        setActiveUser(updatedUser);
        localStorage.setItem('popx_active_user', JSON.stringify(updatedUser));

        const updatedUsersList = users.map((u) =>
          u.email.toLowerCase() === activeUser.email.toLowerCase() ? updatedUser : u
        );
        setUsers(updatedUsersList);
        localStorage.setItem('popx_users', JSON.stringify(updatedUsersList));

        showToast('Profile photo updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Logout Action
  const handleLogout = () => {
    localStorage.removeItem('popx_active_user');
    setActiveUser(null);
    setIsEditing(false);
    setScreen('welcome');
    showToast('Securely logged out');
  };

  return (
    <div className="app-container">
      {/* Dynamic Theme Control Header Toggle */}
      <div className="app-header-controls">
        <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme mode">
          {theme === 'light' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>
      </div>

      {/* 1. WELCOME/LANDING SCREEN */}
      {screen === 'welcome' && (
        <div className="screen welcome-screen" id="screen-welcome">
          <div className="welcome-brand">
            <div className="welcome-logo">PopX</div>
          </div>

          <div className="screen-header" style={{ marginTop: '0', marginBottom: '35px' }}>
            <h1 className="screen-title" style={{ fontSize: '28px' }}>Welcome to PopX</h1>
            <p className="screen-desc" style={{ fontSize: '15px' }}>
              Create an account or login to customize settings, build your bio, and update your profile details.
            </p>
          </div>

          <div className="buttons-stack">
            <button
              id="welcome-create-btn"
              className="btn-purple"
              onClick={() => setScreen('signup')}
            >
              Create Account
            </button>
            <button
              id="welcome-login-btn"
              className="btn-lavender"
              onClick={() => setScreen('login')}
            >
              Already Registered? Login
            </button>
          </div>
        </div>
      )}

      {/* 2. LOGIN SCREEN */}
      {screen === 'login' && (
        <div className="screen login-screen" id="screen-login">
          <div className="screen-header">
            <h1 className="screen-title">Signin to your PopX account</h1>
            <p className="screen-desc">
              Please enter your email and password to access your dashboard settings.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            {loginErrors.auth && (
              <div className="error-message" style={{ marginBottom: '15px', fontSize: '13px', fontWeight: '600' }}>
                {loginErrors.auth}
              </div>
            )}

            <div className={`input-group-custom ${loginErrors.email ? 'error' : ''}`}>
              <input
                type="email"
                id="login-email"
                placeholder=" "
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <label htmlFor="login-email">Email Address</label>
              {loginErrors.email && <span className="error-message">{loginErrors.email}</span>}
            </div>

            <div className={`input-group-custom ${loginErrors.password ? 'error' : ''}`}>
              <input
                type="password"
                id="login-password"
                placeholder=" "
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <label htmlFor="login-password">Password</label>
              {loginErrors.password && <span className="error-message">{loginErrors.password}</span>}
            </div>

            <button
              type="submit"
              className="btn-purple"
              id="login-submit-btn"
              style={{ marginTop: '10px' }}
              disabled={!loginEmail || !loginPassword}
            >
              Login
            </button>

            <div className="toggle-screen-link" style={{ marginTop: 'auto', paddingBottom: '10px' }}>
              Don't have an account?{' '}
              <span id="goto-signup" onClick={() => { setScreen('signup'); setLoginErrors({}); }}>
                Register
              </span>
            </div>
          </form>
        </div>
      )}

      {/* 3. SIGNUP SCREEN */}
      {screen === 'signup' && (
        <div className="screen signup-screen" id="screen-signup">
          <div className="screen-header" style={{ marginBottom: '25px' }}>
            <h1 className="screen-title">Create your PopX account</h1>
          </div>

          <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <div className={`input-group-custom ${signupErrors.name ? 'error' : ''}`}>
              <input
                type="text"
                id="signup-name"
                placeholder=" "
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
              />
              <label htmlFor="signup-name">Full Name <span style={{ color: 'var(--error-color)' }}>*</span></label>
              {signupErrors.name && <span className="error-message">{signupErrors.name}</span>}
            </div>

            <div className={`input-group-custom ${signupErrors.phone ? 'error' : ''}`}>
              <input
                type="tel"
                id="signup-phone"
                placeholder=" "
                value={signupData.phone}
                onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
              />
              <label htmlFor="signup-phone">Phone number <span style={{ color: 'var(--error-color)' }}>*</span></label>
              {signupErrors.phone && <span className="error-message">{signupErrors.phone}</span>}
            </div>

            <div className={`input-group-custom ${signupErrors.email ? 'error' : ''}`}>
              <input
                type="email"
                id="signup-email"
                placeholder=" "
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              />
              <label htmlFor="signup-email">Email address <span style={{ color: 'var(--error-color)' }}>*</span></label>
              {signupErrors.email && <span className="error-message">{signupErrors.email}</span>}
            </div>

            <div className={`input-group-custom ${signupErrors.password ? 'error' : ''}`}>
              <input
                type="password"
                id="signup-password"
                placeholder=" "
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              />
              <label htmlFor="signup-password">Password <span style={{ color: 'var(--error-color)' }}>*</span></label>
              {signupErrors.password && <span className="error-message">{signupErrors.password}</span>}
            </div>

            <div className="input-group-custom">
              <input
                type="text"
                id="signup-company"
                placeholder=" "
                value={signupData.company}
                onChange={(e) => setSignupData({ ...signupData, company: e.target.value })}
              />
              <label htmlFor="signup-company">Company name</label>
            </div>

            <div className="radio-section-title">
              Are you an Agency? <span style={{ color: 'var(--error-color)' }}>*</span>
            </div>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="agency"
                  value="yes"
                  checked={signupData.agency === 'yes'}
                  onChange={() => setSignupData({ ...signupData, agency: 'yes' })}
                />
                <span className="radio-custom-dot"></span>
                Yes
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="agency"
                  value="no"
                  checked={signupData.agency === 'no'}
                  onChange={() => setSignupData({ ...signupData, agency: 'no' })}
                />
                <span className="radio-custom-dot"></span>
                No
              </label>
            </div>

            <button
              type="submit"
              className="btn-purple"
              id="signup-submit-btn"
              style={{ marginTop: 'auto', marginBottom: '10px' }}
            >
              Create Account
            </button>

            <div className="toggle-screen-link" style={{ marginTop: '10px', paddingBottom: '10px' }}>
              Already registered?{' '}
              <span id="goto-login" onClick={() => { setScreen('login'); setSignupErrors({}); }}>
                Login
              </span>
            </div>
          </form>
        </div>
      )}

      {/* 4. PROFILE SCREEN */}
      {screen === 'profile' && activeUser && (
        <div className="screen profile-screen" id="screen-profile">
          <div className="screen-header" style={{ borderBottom: '1.5px solid var(--border-color)', paddingBottom: '15px', marginBottom: '20px' }}>
            <h1 className="screen-title" style={{ fontSize: '18px', fontWeight: '700' }}>Account Settings</h1>
          </div>

          {!isEditing ? (
            // View Mode
            <>
              <div className="profile-card">
                <div className="avatar-wrapper" onClick={handleAvatarClick} title="Click to upload profile photo">
                  <img
                    className="avatar-image"
                    src={activeUser.avatar || DEFAULT_AVATAR_SVG}
                    alt={`${activeUser.name}'s avatar`}
                  />
                  <div className="camera-badge">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                  </div>
                </div>
                <div className="profile-info">
                  <div className="profile-name" id="profile-name-text">{activeUser.name}</div>
                  <div className="profile-email" id="profile-email-text">{activeUser.email}</div>
                  <button className="btn-edit-profile" id="profile-edit-toggle-btn" onClick={startEditing}>
                    Edit Settings
                  </button>
                </div>
              </div>

              <div className="profile-description-box" id="profile-bio-text">
                <div style={{ position: 'absolute', top: '-10px', left: '16px', background: 'var(--bg-card)', padding: '0 8px', fontSize: '11px', fontWeight: '700', color: 'var(--primary-purple)', borderRadius: '4px', border: '1px solid var(--border-color)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  User Bio
                </div>
                {activeUser.bio || 'No bio provided. Edit your profile settings to add a short biography.'}
              </div>

              <hr className="dashed-divider" />

              <div className="profile-details-list">
                <div className="detail-row">
                  <span className="detail-label">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-purple)' }}>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    Phone:
                  </span>
                  <span className="detail-val" id="profile-phone-val">{activeUser.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-purple)' }}>
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    Company:
                  </span>
                  <span className="detail-val" id="profile-company-val">{activeUser.company || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-purple)' }}>
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    Agency designation:
                  </span>
                  <span className="detail-val" id="profile-agency-val" style={{ textTransform: 'capitalize' }}>
                    {activeUser.agency === 'yes' ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                <button
                  className="btn-lavender"
                  id="profile-logout-btn"
                  onClick={handleLogout}
                  style={{ width: '100%' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout Session
                </button>
              </div>
            </>
          ) : (
            // Edit Mode Form
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <div className={`input-group-custom ${editErrors.name ? 'error' : ''}`}>
                <input
                  type="text"
                  id="edit-name"
                  placeholder=" "
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
                <label htmlFor="edit-name">Full Name *</label>
                {editErrors.name && <span className="error-message">{editErrors.name}</span>}
              </div>

              <div className={`input-group-custom ${editErrors.phone ? 'error' : ''}`}>
                <input
                  type="tel"
                  id="edit-phone"
                  placeholder=" "
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                />
                <label htmlFor="edit-phone">Phone number *</label>
                {editErrors.phone && <span className="error-message">{editErrors.phone}</span>}
              </div>

              <div className={`input-group-custom ${editErrors.email ? 'error' : ''}`}>
                <input
                  type="email"
                  id="edit-email"
                  placeholder=" "
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                />
                <label htmlFor="edit-email">Email address *</label>
                {editErrors.email && <span className="error-message">{editErrors.email}</span>}
              </div>

              <div className="input-group-custom">
                <input
                  type="text"
                  id="edit-company"
                  placeholder=" "
                  value={editData.company}
                  onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                />
                <label htmlFor="edit-company">Company name</label>
              </div>

              <div className="input-group-custom">
                <input
                  type="text"
                  id="edit-bio"
                  placeholder=" "
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                />
                <label htmlFor="edit-bio">Short Bio</label>
              </div>

              <div className="radio-section-title">Are you an Agency?</div>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="edit-agency"
                    value="yes"
                    checked={editData.agency === 'yes'}
                    onChange={() => setEditData({ ...editData, agency: 'yes' })}
                  />
                  <span className="radio-custom-dot"></span>
                  Yes
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="edit-agency"
                    value="no"
                    checked={editData.agency === 'no'}
                    onChange={() => setEditData({ ...editData, agency: 'no' })}
                  />
                  <span className="radio-custom-dot"></span>
                  No
                </label>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', paddingBottom: '10px' }}>
                <button
                  type="submit"
                  className="btn-purple"
                  id="profile-save-btn"
                  style={{ flex: 1 }}
                >
                  Save Settings
                </button>
                <button
                  type="button"
                  className="btn-lavender"
                  id="profile-cancel-edit-btn"
                  onClick={() => setIsEditing(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Hidden File Input for Avatar Upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* 5. TOAST NOTICE */}
      {toast && (
        <div className="toast-notice" id="toast-notification">
          <span>{toast}</span>
          <button className="toast-btn-dismiss" onClick={() => setToast(null)}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
