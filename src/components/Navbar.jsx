import React from 'react'
import { NavLink } from 'react-router-dom'
import '../assets/styles/Navbar.css'


const Navbar = () => {
  return (
    <div className='navbar'>
      <ul className='navbar-list'>
        <li className='navbar-list__item'><NavLink className='navbar-list__item-link' to="/statement">Журнал</NavLink></li>
        <li className='navbar-list__item'><NavLink className='navbar-list__item-link' to="/map">Карта</NavLink></li>
      </ul>
    </div>
  )
}

export default Navbar
