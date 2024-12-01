import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Users from "../components/Users";
import ServiceProviders from "../components/ServiceProviders";

export default function DashboardPage() {
  const [activeComponent, setActiveComponent] = useState("Users");

  const renderComponent = () => {
    switch (activeComponent) {
      case "Users":
        return <Users />;
      case "ServiceProviders":
        return <ServiceProviders />;
      default:
        return <Users />;
    }
  };

  return (
    <div className="dashboard-container">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div className="sidebar">
        <h3>Dashboard</h3>
        <ul>
          <li>
            <button
              className={activeComponent === "Users" ? "active" : ""}
              onClick={() => setActiveComponent("Users")}
            >
              Users
            </button>
          </li>
          <li>
            <button
              className={activeComponent === "ServiceProviders" ? "active" : ""}
              onClick={() => setActiveComponent("ServiceProviders")}
            >
              Service Providers
            </button>
          </li>
        </ul>
      </div>
      <div className="main-content">{renderComponent()}</div>
    </div>
  );
}
