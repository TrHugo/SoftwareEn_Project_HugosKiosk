import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import './App.css'
import Header from './component/header'
import Info from './component/info'
import Version from './component/version'

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
        <Link to="/">main</Link>
        <Link to="/info">info</Link>
        <Link to="/version">version</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/info" element={<Info />} />
        <Route path="/version" element={<Version />} />
      </Routes>
    </BrowserRouter>
  );

}

export default App
