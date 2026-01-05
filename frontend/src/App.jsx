import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Header from './component/header'
import Info from './component/info'
import Version from './component/version'

//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'

function App() {
  //const [count, setCount] = useState(0)
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(data => setMessage(data.message))
  },[])

  /*return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )*/

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
