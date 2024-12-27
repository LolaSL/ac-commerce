import React, { useState, useEffect, useContext } from "react";
import Banner from "../components/Banner.jsx";
import Header1 from "../components/Header1.jsx";
import NotificationPopUp from "../components/NotificationPopUp"; 
import { Store } from "../Store"; 
import { useNavigate } from "react-router-dom";

export default function HomeBannerPage() {
  const [notification, setNotification] = useState(null);
  const { state } = useContext(Store); 
  const { userInfo } = state; 
  const navigate = useNavigate(); 

  const banners = [
    {
      title: "Welcome To AC Commerce",
      imageSrc: "/images/header2.jpg",
      paragraph: "Stay cool and comfortable all year and revolutionize climate with our advanced air conditioning.",
      linkTo: "/energy-saving",
      linkText: "Learn More",
    },
    {
      title: "Elevate your comfort:",
      imageSrc: "/images/banner.jpg",
      paragraph: "Discover the perfect fit for your needs",
      linkTo: "/air-conditioning",
      linkText: "Learn More",
    },
    {
      title: "Stay with AC Commerce",
      imageSrc: "/images/banner1.jpg",
      paragraph: "Design and project your own air conditioning at your property.",
      linkTo: "/uploadfile",
      linkText: "Design Now",
    },
    {
      title: "Featured Products",
      imageSrc: "/images/hero.jpg",
      paragraph: "Maximize the comfort of your apartment, office, or villa with our advanced air systems.",
      linkTo: "/products",
      linkText: "Explore Now",
    },
  ];

  useEffect(() => {
    if (userInfo) {
      const receivedNotification = {
        title: "Discount Offer",
        message: "Check out the latest discount offers!",
        type: "discount",
        recipientType: "user",
        isRead: false,
      };

      setNotification(receivedNotification);
      const timer = setTimeout(() => {
        setNotification(null);
      }, 20000); 

      return () => clearTimeout(timer);
    
    }
  }, [userInfo]); 

  const handleNotificationClick = () => {

    navigate("/offers"); 
    setNotification(null); 
  };

  return (
    <div className="container">
      {notification && (
        <NotificationPopUp
          notification={notification}
          onClose={() => setNotification(null)} 
          buttonText="Claim Offer" 
          onButtonClick={handleNotificationClick} 
        />
      )}
      {banners.map((banner, index) => (
        <Banner
          key={index}
          title={banner.title}
          imageSrc={banner.imageSrc}
          paragraph={banner.paragraph}
          linkTo={banner.linkTo}
          linkText={banner.linkText}
        >
          {index === 0 && <Header1 />}
        </Banner>
      ))}
    </div>
  );
}
