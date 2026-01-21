import React from "react";
import plotImg from "../image/banner1.jpg"; // apni image import karo

const PlotTips = () => {
  return (
    <div className="plot-container">
      <h2 className="plot-title">Tips for Buying a Plot in India</h2>

      <p className="plot-desc">
        Buying a plot is considered one of the safest and most profitable real estate 
        investments in India. However, making the right decision requires awareness 
        and due diligence. Before purchasing, it is important to verify the location, 
        check the seller’s identity, and inspect all relevant documents to ensure a 
        secure and beneficial investment.
      </p>

      <p className="plot-desc">
        Here are some essential tips that help avoid financial and legal risks while 
        ensuring a sound and future-proof purchase.
      </p>

      <h3 className="plot-subtitle">⛳ Essential Tips to Buy Plots</h3>

      <ul className="plot-list">
        <li>✔ Verify land title & seller ownership</li>
        <li>✔ Check land use classification (residential/commercial/agricultural)</li>
        <li>✔ Inspect approvals & NOCs from authorities</li>
        <li>✔ Evaluate price & compare with surrounding areas</li>
        <li>✔ Ensure good location & future development prospects</li>
        <li>✔ Confirm road access and utility availability</li>
      </ul>

      {/* Image Section */}
      <div className="plot-img-box">
        <img src={plotImg} alt="Plot Buying Tips" className="plot-img" />
      </div>
    </div>
  );
};

export default PlotTips;
