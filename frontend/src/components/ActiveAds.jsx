import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActiveAds = () => {
  const [ads, setAds] = useState([]);
  
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const { data } = await axios.get('/api/ads');
        console.log("Fetched Ads:", data);
        setAds(data);
      } catch (error) {
        console.error('Error fetching ads', error);
      }
    };

    fetchAds();
  }, []);
  
  return (
    <div>
      <h2>Active Ads</h2>
      {ads.map((ad) => (
        <div key={ad._id}>
          <h3>{ad.title}</h3>
          <img src={ad.image} alt={ad.title} width="100" />
          <p>{ad.price} USD</p>
          <p>{ad.status}</p>
        </div>
      ))}
    </div>
  );
};

export default ActiveAds;
