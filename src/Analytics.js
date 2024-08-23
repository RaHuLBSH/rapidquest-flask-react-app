import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import L from 'leaflet';
import locationPointer from './location_pointer.png';

// Registering required scales and elements
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

const customMarkerIcon = new L.Icon({
    iconUrl: locationPointer,
    iconSize: [32, 32], // Adjust this size based on your image dimensions
    iconAnchor: [16, 32], // Adjust the anchor point to center the icon
    popupAnchor: [0, -32], // Adjust where the popup opens relative to the icon
  });
  
function SalesOverTime() {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Total Sales Over Time',
                data: [],
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.6)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    });
    const [interval, setInterval] = useState('daily');

    const fetchSalesData = (interval) => {
        fetch(`https://my-flask-project-1.onrender.com/sales_over_time?interval=${interval}`)
            .then((response) => response.text())
            .then((text) => {
                try {
                    const data = JSON.parse(text);
                    const dates = data.map((item) => item._id);
                    const sales = data.map((item) => item.totalSales);
          
                    setChartData({
                        labels: dates,
                        datasets: [
                            {
                                label: 'Total Sales Over Time',
                                data: sales,
                                fill: false,
                                backgroundColor: 'rgba(75,192,192,0.6)',
                                borderColor: 'rgba(75,192,192,1)',
                            },
                        ],
                    });
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            })
            .catch((error) => console.error('Error fetching data:', error));
    };

    useEffect(() => {
        fetchSalesData(interval);
    }, [interval]);

    const handleIntervalChange = (e) => {
        setInterval(e.target.value);
    };

    return (
        <div className="chart-container">
            <h2>Total Sales Over Time</h2>
            <div className="interval-selector">
                <label>
                    <input 
                        type="radio" 
                        value="daily" 
                        checked={interval === 'daily'} 
                        onChange={handleIntervalChange} 
                    />
                    Daily
                </label>
                <label>
                    <input 
                        type="radio" 
                        value="monthly" 
                        checked={interval === 'monthly'} 
                        onChange={handleIntervalChange} 
                    />
                    Monthly
                </label>
                <label>
                    <input 
                        type="radio" 
                        value="quarterly" 
                        checked={interval === 'quarterly'} 
                        onChange={handleIntervalChange} 
                    />
                    Quarterly
                </label>
                <label>
                    <input 
                        type="radio" 
                        value="yearly" 
                        checked={interval === 'yearly'} 
                        onChange={handleIntervalChange} 
                    />
                    Yearly
                </label>
            </div>
            <Line data={chartData} />
        </div>
    );
}

function SalesGrowthRateOverTime() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [interval, setInterval] = useState('daily');

  const fetchSalesData = (interval) => {
      fetch(`https://my-flask-project-1.onrender.com/sales_over_time?interval=${interval}&growth=True`)
          .then(response => response.json())
          .then(data => {
              const dates = data.map(item => item.date);
              const growthRates = data.map(item => item.growthRate);
              
              setChartData({
                  labels: dates,
                  datasets: [{
                      label: 'Sales Growth Rate Over Time',
                      data: growthRates,
                      fill: false,
                      backgroundColor: 'rgba(54, 162, 235, 0.6)',
                      borderColor: 'rgba(54, 162, 235, 1)',
                  }]
              });
          });
  };

  useEffect(() => {
      fetchSalesData(interval);
  }, [interval]);

  const handleIntervalChange = (e) => {
      setInterval(e.target.value);
  };
  return (
      <div className="chart-container">
          <h2>Total Sales Growth Over Time</h2>
          <div className="interval-selector">
              <label>
                  <input 
                      type="radio" 
                      value="daily" 
                      checked={interval === 'daily'} 
                      onChange={handleIntervalChange} 
                  />
                  Daily
              </label>
              <label>
                  <input 
                      type="radio" 
                      value="monthly" 
                      checked={interval === 'monthly'} 
                      onChange={handleIntervalChange} 
                  />
                  Monthly
              </label>
              <label>
                  <input 
                      type="radio" 
                      value="quarterly" 
                      checked={interval === 'quarterly'} 
                      onChange={handleIntervalChange} 
                  />
                  Quarterly
              </label>
              <label>
                  <input 
                      type="radio" 
                      value="yearly" 
                      checked={interval === 'yearly'} 
                      onChange={handleIntervalChange} 
                  />
                  Yearly
              </label>
          </div>
          <Line data={chartData} />
      </div>
  );
}

function NewCustomersOverTime() {
  const [chartData, setChartData] = useState({
      labels: [],
      datasets: [
          {
              label: 'New Customers Over Time',
              data: [],
              fill: false,
              backgroundColor: 'rgba(75,192,192,0.6)',
              borderColor: 'rgba(75,192,192,1)',
          },
      ],
  });
  const [interval, setInterval] = useState('daily');

  const fetchSalesData = (interval) => {
      fetch(`https://my-flask-project-1.onrender.com/new_customers?interval=${interval}`)
          .then((response) => response.text())
          .then((text) => {
              try {
                  const data = JSON.parse(text);
                  const dates = data.map((item) => item._id);
                  const newCustomers = data.map((item) => item.newCustomers);
        
                  setChartData({
                      labels: dates,
                      datasets: [
                          {
                              label: 'New Customers Over Time',
                              data: newCustomers,
                              fill: false,
                              backgroundColor: 'rgba(75,192,192,0.6)',
                              borderColor: 'rgba(75,192,192,1)',
                          },
                      ],
                  });
              } catch (error) {
                  console.error('Error parsing JSON:', error);
              }
          })
          .catch((error) => console.error('Error fetching data:', error));
  };

  useEffect(() => {
      fetchSalesData(interval);
  }, [interval]);

  const handleIntervalChange = (e) => {
      setInterval(e.target.value);
  };

  return (
      <div className="chart-container">
          <h2>New Customers Over Time</h2>
          <div className="interval-selector">
              <label>
                  <input 
                      type="radio" 
                      value="daily" 
                      checked={interval === 'daily'} 
                      onChange={handleIntervalChange} 
                  />
                  Daily
              </label>
              <label>
                  <input 
                      type="radio" 
                      value="monthly" 
                      checked={interval === 'monthly'} 
                      onChange={handleIntervalChange} 
                  />
                  Monthly
              </label>
              <label>
                  <input 
                      type="radio" 
                      value="quarterly" 
                      checked={interval === 'quarterly'} 
                      onChange={handleIntervalChange} 
                  />
                  Quarterly
              </label>
              <label>
                  <input 
                      type="radio" 
                      value="yearly" 
                      checked={interval === 'yearly'} 
                      onChange={handleIntervalChange} 
                  />
                  Yearly
              </label>
          </div>
          <Line data={chartData} />
      </div>
  );
}

function RepeatCustomersOverTime() {
  const [chartData, setChartData] = useState({
      labels: [],
      datasets: [
          {
              label: 'Repeat Customers Over Time',
              data: [],
              fill: false,
              backgroundColor: 'rgba(75,192,192,0.6)',
              borderColor: 'rgba(75,192,192,1)',
          },
      ],
  });
  const [interval, setInterval] = useState('daily');

  const fetchSalesData = (interval) => {
      fetch(`https://my-flask-project-1.onrender.com/repeat_customers?interval=${interval}`)
          .then((response) => response.text())
          .then((text) => {
              try {
                  const data = JSON.parse(text);
                  const dates = data.map((item) => item._id);
                  const repeatCustomers = data.map((item) => item.repeatCustomers);
        
                  setChartData({
                      labels: dates,
                      datasets: [
                          {
                              label: 'New Customers Over Time',
                              data: repeatCustomers,
                              fill: false,
                              backgroundColor: 'rgba(75,192,192,0.6)',
                              borderColor: 'rgba(75,192,192,1)',
                          },
                      ],
                  });
              } catch (error) {
                  console.error('Error parsing JSON:', error);
              }
          })
          .catch((error) => console.error('Error fetching data:', error));
  };

  useEffect(() => {
      fetchSalesData(interval);
  }, [interval]);

  const handleIntervalChange = (e) => {
      setInterval(e.target.value);
  };

  return (
      <div className="chart-container">
          <h2>Repeat Customers Over Time</h2>
          <div className="interval-selector">
              <label>
                  <input 
                      type="radio" 
                      value="daily" 
                      checked={interval === 'daily'} 
                      onChange={handleIntervalChange} 
                  />
                  Daily
              </label>
              <label>
                  <input 
                      type="radio" 
                      value="monthly" 
                      checked={interval === 'monthly'} 
                      onChange={handleIntervalChange} 
                  />
                  Monthly
              </label>
              <label>
                  <input 
                      type="radio" 
                      value="quarterly" 
                      checked={interval === 'quarterly'} 
                      onChange={handleIntervalChange} 
                  />
                  Quarterly
              </label>
              <label>
                  <input 
                      type="radio" 
                      value="yearly" 
                      checked={interval === 'yearly'} 
                      onChange={handleIntervalChange} 
                  />
                  Yearly
              </label>
          </div>
          <Line data={chartData} />
      </div>
  );
}

function GeographicalDistribution() {
    const [locations, setLocations] = useState([]);
    
    useEffect(() => {
      fetch('https://my-flask-project-1.onrender.com/customer_distribution')
        .then(response => response.json())
        .then(data => {
          // Ensure data contains latitude and longitude
          if (data.every(loc => loc.latitude && loc.longitude)) {
            setLocations(data);
          } else {
            console.error('Received data with missing latitude or longitude');
          }
        })
        .catch(error => console.error('Error fetching location data:', error));
    }, []);
  
    const defaultCenter = locations.length > 0 
      ? [locations[0].latitude, locations[0].longitude] 
      : [37.0902, -95.7129]; // Fallback to central USA coordinates
  
    return (
        <div className='chart-container'>
        <h2>Geographical Distribution</h2>
        <div className="map-container" style={{ height: '500px', width: '100%' }}>
          <MapContainer center={defaultCenter} zoom={4} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {locations.length > 0 ? (
              locations.map((location, index) => (
                <Marker key={index} position={[location.latitude, location.longitude]} icon={customMarkerIcon}>
                  <Popup>
                    {location.city}: {location.count} customers
                  </Popup>
                </Marker>
              ))
            ) : (
            <div className="no-locations">No locations available</div>
            )}
          </MapContainer>
        </div>
      </div>
    );
  }
  

function CLVByCohorts() {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        fetch('https://my-flask-project-1.onrender.com/clv_by_cohorts')
            .then(response => response.json())
            .then(data => {
                const cohorts = data.map(item => item._id);
                const lifetimeValues = data.map(item => item.lifetimeValue);
                
                setChartData({
                    labels: cohorts,
                    datasets: [{
                        label: 'Customer Lifetime Value by Cohorts',
                        data: lifetimeValues,
                        backgroundColor: 'rgba(255, 159, 64, 0.6)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 1,
                    }]
                });
            });
    }, []);

    return (
        <div className="chart-container">
          <h2>Customers Lifetime Value by Cohorts</h2>
          <Bar data={chartData} />;
        </div>
    )
}


export {SalesOverTime, SalesGrowthRateOverTime, NewCustomersOverTime, RepeatCustomersOverTime, GeographicalDistribution, CLVByCohorts};
