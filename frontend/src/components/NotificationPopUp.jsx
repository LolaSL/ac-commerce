import React from "react";

const NotificationPopUp = ({ notification, buttonText, onButtonClick }) => {
  return (
    <div className="notification-popup">
      <h3>{notification.title}</h3>
      <p>{notification.message}</p>
      <button onClick={onButtonClick}>{buttonText || "Close"}</button>
    </div>
  );
};

export default NotificationPopUp;
