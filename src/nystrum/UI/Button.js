import React from 'react';

function Button(props) {
  return (
    <button
      onClick={props.onClick}
      className='btn grey darken-3'
    >
      {props.children}  
    </button>
  )
}

export default Button;
