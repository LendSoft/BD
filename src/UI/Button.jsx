import React from 'react'
import '../assets/styles/Button.css'

const Button = (props) => {
  return (
    <button className='my-button' {...props}>
      {props.children}
    </button>
  )
}

export default Button
