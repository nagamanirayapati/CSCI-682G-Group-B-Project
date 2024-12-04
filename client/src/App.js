import Signup from './components/Signup';
import Signin from './components/Signin';
import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(null);
  return (
    <Router>
    <div className="App">
        <Routes>
        <Route path='/signup' element={user ? <Navigate to='/' /> : <Signup setUser={setUser} />} />
        <Route path='/signin' element={user ? <Navigate to='/' /> : <Signin setUser={setUser} />} />
        </Routes>
    </div>
    </Router>
  );
}

export default App;
