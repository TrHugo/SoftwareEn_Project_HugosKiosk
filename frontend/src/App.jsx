import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';

// Import des composants
import Header from './component/header';
import Footer from './component/Footer'; // N'oublie pas le footer qu'on a créé avant
import Home from './pages/Home'; // Notre nouvelle page d'accueil
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

import './App.css';

function App() {
  return (
    /* IMPORTANT : On enveloppe tout le routeur dans AuthProvider.
       C'est ça qui "allume" le contexte pour que Profile puisse l'utiliser.
    */
    <AuthProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home pageName="Home" />} />
          <Route path="/info" element={<Info pageName="info" />} />
          <Route path="/version" element={<Version pageName="version" />} />
          <Route path="/profile" element={<Profile pageName="MyProfile" />} />
          <Route path="/subscribe" element={<Subscription pageName="Subscription" />} />
          <Route path="/search" element={<SearchPage pageName="Search" />} />
          <Route path="/contacts" element={<Contacts pageName="OurGroup" />} />
          <Route path="/legal" element={<Legal pageName="Legal" />} />
          <Route path="/article/:id" element={<ArticleReader pageName="Article Reader" />} />
          <Route path="/login" element={<Login pageName="Log In" />} />
          <Route path="/register" element={<Register pageName="Register" />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;