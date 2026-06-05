import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './modules/QuanTri/pages/Login'
import AdminLayout from './modules/QuanTri/layouts/AdminLayout'
import UserList from './modules/QuanTri/pages/UserList'
import NotFound from './components/common/NotFound'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<UserList />} />
          {/* Catch-all route inside /admin */}
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        {/* Global catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
