import React from "react";
import plotImg from "../image/Comproperty.webp";

const Commercialtips = () => {
  return (
    <div className="plot-container">
      
      <h2 className="plot-title">Tips for buying commercial land in India</h2>

      <p className="plot-desc">
        Over the last few years, investment in commercial land has gained
        prominence with price appreciation and diversification of portfolio
        acting as major propellers. Accessibility and varied choices have led
        to an increase in both small and large-scale investments. However, it
        is crucial to delve into essential tips before buying commercial land
        in India. 99acres gives an overview.
      </p>

      <p className="plot-desc">
        Here are some essential tips that help avoid financial and legal risks
        while ensuring a sound and future-proof purchase.
      </p>

      <h3 className="plot-subtitle">Essential Tips to Buy Commercial Plots</h3>

      <ul className="plot-list">
        <li>Verify land title & seller ownership</li>
        <li>Check land use classification (commercial/industrial/retail)</li>
        <li>Inspect approvals & required NOCs</li>
        <li>Evaluate price & compare with nearby zones</li>
        <li>Ensure location connectivity & future development</li>
        <li>Check utilities and infrastructure accessibility</li>
      </ul>

      {/* Image Section */}
      <div className="plot-img-box">
        <img src={plotImg} alt="Commercial Plot Tips" className="plot-img" />
      </div>

      {/* Table Section */}
      <h3 className="plot-subtitle" style={{ marginTop: "30px" }}>
        Types of Commercial Property
      </h3>

      <div className="plot-table">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Property Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Retail</td>
              <td>Malls, Shops, Retail Centres, Stores</td>
            </tr>
            <tr>
              <td>Industrial</td>
              <td>Factories, Warehouses, Manufacturing Plants</td>
            </tr>
            <tr>
              <td>Office Spaces</td>
              <td>Corporate Offices, IT Parks</td>
            </tr>
            <tr>
              <td>Hospitality</td>
              <td>Hotels, Motels, Tourism Agencies</td>
            </tr>
            <tr>
              <td>Institutional</td>
              <td>Schools, Colleges, Coaching Institutes</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Commercialtips;
