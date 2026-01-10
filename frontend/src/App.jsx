import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';

import Header from './component/header';
import Footer from './component/Footer';
import Home from './pages/Home';
import Info from './pages/info';
import Version from './component/version';
import WorkInProgress from './pages/WorkInProgress';
import Contacts from './pages/Contacts';
import Legal from './pages/Legal';
import ArticleReader from './pages/ArticleReader';
import SearchPage from './pages/SearchPage';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Subscription from './pages/Subscription';
import { ProtectedRoute } from './context/ProtectedRoute';
import Payment from './pages/Payment';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home pageName="Home" />} />
          <Route path="/info" element={<Info pageName="info" />} />
          <Route path="/version" element={<Version pageName="version" />} />
          <Route path="/profile" element={<ProtectedRoute><Profile pageName="MyProfile" /></ProtectedRoute>} />
          <Route path="/subscribe" element={<ProtectedRoute><Subscription pageName="Subscription" /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage pageName="Search" /></ProtectedRoute>} />
          <Route path="/contacts" element={<Contacts pageName="OurGroup" />} />
          <Route path="/legal" element={<Legal pageName="Legal" />} />
          <Route path="/article/:id" element={<ProtectedRoute><ArticleReader pageName="Article Reader" /></ProtectedRoute>} />
          <Route path="/login" element={<Login pageName="Log In" />} />
          <Route path="/register" element={<Register pageName="Register" />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
