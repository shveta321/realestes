import React from "react";
import buyers from "../image/plot1.webp";
import "../Banner/Homep.css";

const Lookbuyer = () => {
  return (
    <div className="promo-page">
<div className="prom-head">
    <h1>Sell or Lease out your Plots/Land faster with Syn X Real Estate</h1>
</div>
      {/* Card 1 */}
      <div className="promo-card">
        <div className="promo-img">
          <img src={buyers} alt="Looking for Buyers" />
        </div>
        <div className="promo-content">
          <h2>Looking for Buyers for Plots / Land?</h2>
          <p>
            Connect with serious investors and verified buyers for residential,
            commercial, and industrial plots.
          </p>
          <button>Find Buyers</button>
        </div>
      </div>

     

    </div>
  );
};

export default Lookbuyer;
