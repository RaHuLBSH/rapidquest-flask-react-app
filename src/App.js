import React, { useState } from 'react';
import './App.css';
import { CLVByCohorts, GeographicalDistribution, NewCustomersOverTime, RepeatCustomersOverTime, SalesGrowthRateOverTime, SalesOverTime } from './Analytics';

function App() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalCharts = 6; // Number of charts

    const updateSlider = (newIndex) => {
        if (newIndex >= 0 && newIndex < totalCharts) {
            setCurrentIndex(newIndex);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <div className="slider-container">
                    <button className="slider-button left-button" onClick={() => updateSlider(currentIndex - 1)}>‹</button>
                    <div className="chart-wrapper" style={{ transform: `translateX(-${currentIndex * 100}vw)` }}>
                        <div className="chart-container-outer"><SalesOverTime /></div>
                        <div className="chart-container-outer"><SalesGrowthRateOverTime /></div>
                        <div className="chart-container-outer"><NewCustomersOverTime /></div>
                        <div className="chart-container-outer"><RepeatCustomersOverTime /></div>
                        <div className="chart-container-outer"><GeographicalDistribution /></div>
                        <div className="chart-container-outer"><CLVByCohorts /></div>
                    </div>
                    <button className="slider-button right-button" onClick={() => updateSlider(currentIndex + 1)}>›</button>
                </div>
            </header>
        </div>
    );
}

export default App;
