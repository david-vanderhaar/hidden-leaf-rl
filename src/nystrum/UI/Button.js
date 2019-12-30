import React from 'react';

function Button(props) {
  let color = props['color'];
  if (!color) color = 'grey';
  return (
    <button
      onClick={props.onClick}
      className={`btn ${color} darken-3`}
    >
      {props.children}  
    </button>
  )
}

export default Button;
