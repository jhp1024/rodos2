import React from 'react';
import '../styles/Circle.css';

function Circle({ size = 10, color = '#4CAF50' }) {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color
  };

  return (
    <div className="circle-container">
      <div className="circle" style={style}></div>
    </div>
  );
}

export default Circle; 