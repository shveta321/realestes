import React from "react";

const Chooseadvertiser = () => {
  return (
    <div className="advertiser-wrapper">
      <div className="advertiser-card">
        {/* Left Section */}
        <div className="left-box">
          <h3>Plots/Land</h3>
          <p>posted by</p>
        </div>

        {/* Right Section */}
        <div className="right-box">
          <h2>Choose type of advertiser</h2>
          <p className="sub-text">Browse your choice of listing</p>

          <div className="option">
            <div className="option-text">
              <strong>Dealer</strong>
              <span>150+ Properties</span>
            </div>
            <span className="arrow">➜</span>
          </div>

          <div className="option">
            <div className="option-text">
              <strong>Owner</strong>
              <span>120+ Properties</span>
            </div>
            <span className="arrow">➜</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chooseadvertiser;
