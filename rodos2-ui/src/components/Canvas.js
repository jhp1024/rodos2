import React from 'react';
import Hexagon from './Hexagon';
import Circle from './Circle';
import '../styles/Canvas.css';

function HexagonWithCircles({ label }) {
    return (
        <div className="hexagon-group">
            <div className="hexagon-label">{label}</div>
            <div className="hexagon-canvas">
                <Hexagon size={180} color="#666" />
                <div className="circle-group">
                    <div className="circle-pos top"><Circle size={50} color="#bfa32a" /></div>
                    <div className="circle-pos left"><Circle size={50} color="#bfa32a" /></div>
                    <div className="circle-pos right"><Circle size={50} color="#bfa32a" /></div>
                </div>
            </div>
        </div>
    );
}

function Canvas() {
    return (
        <div className="hexagon-canvas-container">
            <HexagonWithCircles label="Jackal" />
            <HexagonWithCircles label="Turtlebot" />
        </div>
    );
}

export default Canvas; 