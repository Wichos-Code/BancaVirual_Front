import React from 'react'
import PropTypes from 'prop-types'
import logo from '../assets/img/LogoBF.png';

export const Logo = ({text}) => {
  return (
    <>
      <div>
      <img
        src={logo} 
        alt='logo' 
        style={{
          width: '150px', 
          height: '160px',
          marginBottom: '-25px'
        }}
      />
      </div>
      <span className="text-white font-bold text-2xl pb-4">{text}</span>
    </>
  )
}

Logo.propTypes = {
  text: PropTypes.string.isRequired
}