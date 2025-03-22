// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Login from './Login/login';
import Dashboard from './Dashboard/dashboard';
import ViewResponse from './Response/view';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/response" element={<ViewResponse />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
