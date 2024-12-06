import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import UsersProductSales from "../components/UsersProductSales";
import ServiceProviders from "../components/ServiceProviders";

export default function DashboardPage() {
  const [activeComponent, setActiveComponent] = useState("Users");

  const renderComponent = () => {
    switch (activeComponent) {
      case "Users":
        return <UsersProductSales />;
      case "ServiceProviders":
        return <ServiceProviders />;
      default:
        return <UsersProductSales/>;
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
              className={ activeComponent === "Users Product Sales" ? "active" : "btn-outline"}
              onClick={() => setActiveComponent("Users Product Sales")}
            >
              Users Product Sales
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
