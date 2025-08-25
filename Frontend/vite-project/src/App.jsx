import { useState,Suspense,lazy } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';


const Dashboard=lazy(()=>import("./Pages/DrillSenseDashboard.jsx"))
const Drill3DPathPage=lazy(()=>import("./Pages/Drill3DPathPage.jsx"))
function App() {
    return (
      <BrowserRouter>
         <Suspense fallback={<div>Loading...</div>}></Suspense>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
         <Route path="/dashboard" element={<Drill3DPathPage/>}/>
      </Routes>
    </BrowserRouter>
    )
}

export default App
