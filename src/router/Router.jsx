import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { routes } from './routes'

const Router = () => {
  return (
    <div className="main">
      <Routes>
        {
          routes.map(route => <Route key={route.path} path={route.path} element={route.element}/>)
        }
        <Route path="/" element={<Navigate to="/statement" />}/>
      </Routes>
    </div>
  )
}

export default Router
 