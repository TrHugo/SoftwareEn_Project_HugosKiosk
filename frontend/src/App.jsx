import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import './App.css'
import Header from './component/header'
import Info from './component/info'

function App() {
  const [message, setMessage] = useState('');
  // const [count, setCount] = useState(0)

  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(data => setMessage(data.message))
  },[])


  return (
    <BrowserRouter>
      <nav>
        <Link to="/">information</Link>
        <Link to="/info">version</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/info" element={<Info />} />
      </Routes>
    </BrowserRouter>
  );

}

export default App
