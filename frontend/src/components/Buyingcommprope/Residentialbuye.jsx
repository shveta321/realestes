import React from "react";
 import "../Buyingcommprope/Buyicommproperty.css";


 import residential from "../image/residential.jpg";
 import residential1 from "../image/residential1.jpg";

const Residentialbuye = () => {
  const properties = [
    {
      price: "₹45 Lac",
      area: "891 sqft",
      title: "3 Bedroom House in Sarangpur, Delhi",
      bhk: "3 BHK",
      status: "Ready To Move",
      owner: "Owner",
       image: residential,
    },
    {
      price: "₹55 Lac",
      area: "1020 sqft",
      title: "Independent House in Delhi South West",
      bhk: "3 BHK",
      status: "Verified",
      owner: "Owner",
       image: residential1,
    },
  ];

  return (
    <div className="listing-page">
      <h2 className="page-title">
        Property in Delhi South West for Sale
      </h2>

      <div className="listing-container">
        <aside className="filters">
          <h4>Applied Filters</h4>
          <button className="filter-btn">Owner ✕</button>
          <button className="filter-btn">₹40L - ₹60L ✕</button>
        </aside>

        <main className="properties">
          {properties.map((item, index) => (
            <div className="property-card" key={index}>
              <img src={item.image} alt={item.title} />

              <div className="property-info">
                <h3>{item.title}</h3>

                <div className="tags">
                  <span>{item.bhk}</span>
                  <span>{item.status}</span>
                </div>

                <p className="price">{item.price}</p>
                <p className="area">{item.area}</p>

                <div className="actions">
                  <button className="btn-outline">View Number</button>
                  <button className="btn-primary">Contact</button>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Residentialbuye;
