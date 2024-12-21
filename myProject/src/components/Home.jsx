import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const Home = () => {
  const location = useLocation(); // Get the current location object
  const [plantData, setPlantData] = useState(null); // State to store plant information
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors

  // Parse the plantId from the query string
  const plantId = new URLSearchParams(location.search).get('plantId');

  const fundingData = [
    { name: 'Received', value: 75000 },
    { name: 'Required', value: 25000 },
  ];

  const poolData = [
    { name: 'Reserved', value: 60000 },
    { name: 'Available', value: 40000 },
  ];

  const allocationData = [
    { name: 'Previous', amount: 50000 },
    { name: 'Current', amount: 75000 },
    { name: 'Next', amount: 100000 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Fetch plant data from backend
  useEffect(() => {
    const fetchPlantData = async () => {
      if (!plantId) {
        setError('No plantId provided in the query parameters.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/plants/${plantId}`); // Use plantId from query
        if (!response.ok) {
          throw new Error(`Error fetching plant data: ${response.statusText}`);
        }
        const data = await response.json();
        setPlantData(data); // Update the state with fetched plant data
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantData();
  }, [plantId]);

  return (
    <div className="grid gap-6 md:grid-cols-2 p-6">
      {/* Plant Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Plant Information</h2>
        {loading ? (
          <p>Loading plant information...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : plantData ? (
          <div>
            <p><strong>Plant Name:</strong> {plantData.plantName}</p>
            <p><strong>Plastic Type:</strong> {plantData.plasticType}</p>
            <p><strong>City:</strong> {plantData.cityName}</p>
            <p><strong>State:</strong> {plantData.stateName}</p>
            <p><strong>Country:</strong> {plantData.countryName}</p>
            <p><strong>Recycling Capacity:</strong> {plantData.recyclingCapacity} tons/year</p>
            <p><strong>Expected Recycling Capacity:</strong> {plantData.expectedRecyclingCapacity} tons/year</p>
            <p><strong>Funding Required:</strong> {plantData.requiredFunding} Cr</p>
            <p><strong>Funding Received:</strong> {plantData.fundingReceived} Cr</p>
          </div>
        ) : (
          <p>No plant data available.</p>
        )}
      </div>

      {/* Funding Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Funding Status</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={fundingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {fundingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pool Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Pool Status</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={poolData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {poolData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Allocation Periods */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Allocation Periods</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={allocationData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Home;