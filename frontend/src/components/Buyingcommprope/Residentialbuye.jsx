import React, { useState, useEffect } from "react";
import "../Buyingcommprope/Buyicommproperty.css";
import Buyerleadform from "./Buyerleadform";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Residentialbuye = () => {
  const [properties, setProperties] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(4);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentProperties = properties.slice(indexOfFirstRow, indexOfLastRow);

  // Slider state for each property
  const [currentSlide, setCurrentSlide] = useState({});
  const [filters, setFilters] = useState({
    property_type: "",
    property_subtype: "",
    minPrice: "",
    maxPrice: "",
    bhk: "",
    city: "",
    locality: "",
    postedBy: "",
    distressed: ""
  });

  const query = new URLSearchParams(useLocation().search);
  const location = query.get("location");
  const type = query.get("type");

  useEffect(() => {
    axios.get("https://synamc.com/api/search", {
      params: {
        keyword: location,
        tab: type === "rent" ? "rent" : "buy"
      }
    }).then(res => setProperties(res.data));
  }, [location, type]);

  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    if (params.toString()) {
      fetch(`https://synamc.com/api/properties/filter?${params.toString()}`)
        .then(res => res.json())
        .then(data => setProperties(data))
        .catch(err => console.log(err));
    }
  }, [filters]);

  // const getMedia = item => item.media || [];

  useEffect(() => {
    fetch("https://synamc.com/api/properties?type=residential")
      .then(res => res.json())
      .then(data => setProperties(data))
      .catch(err => console.log(err));
  }, []);

  const formatPrice = (price) => {
    if (!price) return "";
    price = Number(price);

    if (price >= 10000000) return (price / 10000000).toFixed(2) + " Cr";
    if (price >= 100000) return (price / 100000).toFixed(2) + " Lakh";
    return price.toLocaleString("en-IN");
  };

  const getMedia = (item) => {
    if (!item.media) return [];
    if (Array.isArray(item.media)) return item.media;
    try {
      return JSON.parse(item.media);
    } catch {
      return [];
    }
  };

  const nextSlide = (id, length) => {
    setCurrentSlide(prev => ({
      ...prev,
      [id]: prev[id] === undefined ? 1 : (prev[id] + 1) % length
    }));
  };

  const prevSlide = (id, length) => {
    setCurrentSlide(prev => ({
      ...prev,
      [id]: prev[id] === undefined ? length - 1 : (prev[id] - 1 + length) % length
    }));
  };
  const clearAll = () => {
    setFilters({
      property_type: "",
      property_subtype: "",
      minPrice: "",
      maxPrice: "",
      bhk: "",
      city: "",
      locality: "",
      postedBy: "",
      distressed: ""
    });
    setCity("");
    setSuggestions([]);

    // fetch("https://synamc.com/api/properties")
    //   .then(res => res.json())
    //   .then(data => setProperties(data));

    fetch("https://synamc.com/api/properties?type=Residential")
      .then(res => res.json())
      .then(data => setProperties(data))
      .catch(err => console.log(err));
  };


  const defaultCity = "";
  const defaultLocality = "";
  const propertyCount = properties.length;

  const locationText =
    filters.locality
      ? `${filters.locality} ${filters.city || defaultCity}`
      : filters.city || `${defaultLocality} ${defaultCity}`;

  const propertyTypeText =
    filters.property_type === "Commercial"
      ? "Commercial Properties"
      : "Residential ";


  return (
    <>
      <div className="listing-page">
        <div className="listing-container">
          <aside className="filters-panel">
            <div className="filters-header">
              <h4> Filters</h4>
              <button className="clear-link" onClick={clearAll}>
                Clear All
              </button>
            </div>

            {/* Applied Filters Chips */}
            <div className="chips-row">
              {filters.subtype && (
                <span className="chip active">
                  {filters.property_subtype} ✕
                </span>
              )}
              {filters.postedBy && (
                <span className="chip active">
                  {filters.postedBy} ✕
                </span>
              )}
            </div>

            <hr />

            {/* Budget */}
            <div className="filter-block">
              <h4>Budget</h4>
              <div className="dropdowns-row">
                {/* MIN PRICE */}
                <select
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: e.target.value })
                  }
                >
                  <option value="">  Min</option>
                  <option value="500000">₹5 Lakh</option>
                  <option value="1000000">₹10 Lakh</option>
                  <option value="1500000">₹15 Lakh</option>
                  <option value="2000000">₹20 Lakh</option>
                  <option value="4000000">₹40 Lakh</option>
                  <option value="6000000">₹60 Lakh</option>
                </select>

                {/* MAX PRICE */}
                <select
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.target.value })
                  }
                >
                  <option value=""> Max</option>
                  <option value="500000">₹5 Lakh</option>
                  <option value="1000000">₹10 Lakh</option>
                  <option value="1500000">₹15 Lakh</option>
                  <option value="1700000">₹17 Lakh</option>
                  <option value="5000000">₹50 Lakh</option>
                  <option value="10000000">₹1 Crore</option>
                  <option value="200000000">₹20 Crore</option>
                  <option value="600000000">₹60 Crore</option>
                </select>
              </div>

            </div>

            <hr />

            {/* BHK */}
            <div className="filter-block">
              <h4>BHK</h4>
              <div className="chips-list">
                {[1, 2, 3, 4, 5].map((num) => (
                  <span
                    key={num}
                    className={`chip ${filters.bhk === num ? "selected" : ""}`}
                    onClick={() =>
                      setFilters({ ...filters, bhk: num })
                    }
                  >
                    {num} BHK
                  </span>
                ))}
              </div>
            </div>

            <hr />

            {/* Property Type */}
            <div className="filter-block">
              <h4>Type of Property</h4>
              <div className="chips-list">
                {["residential", "commercial"].map(type => (
                  <span
                    key={type}
                    className={`chip ${filters.property_type === type ? "selected" : ""}`}
                    onClick={() =>
                      setFilters({ ...filters, property_type: type })
                    }
                  >
                    {type}
                  </span>
                ))}
              </div>

            </div>
            <div className="filter-block">
              <h4>Distressed</h4>
              <div className="chips-list">

                {["Distressed Property", "Fair Market Valued"].map((type) => (
                  <span
                    key={type}
                    className={`chip ${filters.distressed === type ? "selected" : ""
                      }`}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        distressed: filters.distressed === type ? "" : type
                      })
                    }
                  >
                    {type}
                  </span>
                ))}

              </div>
            </div>
            <hr />

            {/* Posted By */}
            {/* <div className="filter-block">
              <h4>Posted By</h4>
              <div className="chips-list">
                {["Owner", "Builder", "Dealer"].map((role) => (
                  <span
                    key={role}
                    className={`chip ${filters.postedBy === role ? "selected" : ""
                      }`}
                    onClick={() =>
                      setFilters({ ...filters, postedBy: role })
                    }
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div> */}
            <hr />
            <div className="filter-block">
              <h4>Location</h4>
              <input
                type="text"
                placeholder="Enter Locality / Project / Society"
                value={city}
                onChange={(e) => {
                  const value = e.target.value;
                  setCity(value);

                  if (value.length === 0) {
                    setSuggestions([]);
                    return;
                  }

                  fetch(`https://synamc.com/api/locations/suggest?q=${value}`)
                    .then(res => res.json())
                    .then(data => setSuggestions(data));
                }}
              />

              {/*  Dropdown */}
              {suggestions.length > 0 && (
                <ul className="suggestion-box">
                  {suggestions.map((item, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        setCity(item);
                        setSuggestions([]);
                        setFilters({ ...filters, city: item });
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </aside>
          <div>
            <h2 className="page-title">
              {propertyCount > 0 ? propertyCount : "No"}  Results |  {propertyTypeText}property  for sale  {locationText}
            </h2>

            {properties.length > 0 ? (
              currentProperties.map(item => (
                <div key={item.id} className="property-card">
                  <div className="slider-container">
                    {getMedia(item).length > 0 ? (
                      <>
                        {getMedia(item)[currentSlide[item.id] || 0].type === "image" ? (
                          <img
                            src={getMedia(item)[currentSlide[item.id] || 0].url}
                            alt="property"
                            className="slider-img"
                          />
                        ) : (
                          <video
                            src={getMedia(item)[currentSlide[item.id] || 0].url}
                            controls
                            className="slider-img"
                          />
                        )}

                        {getMedia(item).length > 1 && (
                          <>
                            <button className="slider-btn prev" onClick={() => prevSlide(item.id, getMedia(item).length)}>❮</button>
                            <button className="slider-btn next" onClick={() => nextSlide(item.id, getMedia(item).length)}>❯</button>
                          </>
                        )}
                      </>
                    ) : (
                      <div>No Media</div>
                    )}
                  </div>


                  <div className="property-info">
                    <div className="property-loc">
                      {/* <span>{item.location}</span> */}
                      <span className="locat-pro">{item.city},</span>
                      <span className="locat-pro">{item.locality},</span>
                      <span className="locat-pro">{item.sub_locality},</span>
                      {/* <span className="subtype">{item.subtype}</span> */}
                      <span className="locat-pro">{item.society},</span>
                      <span className="locat-pro">{item.house_no},</span>
                      <span className="locat-pro">{item.pincode}</span>
                    </div>
                    <div className="property-loc">
                      <span className="subtype">{item.property_type}, </span>
                      <span className="subtype">{item.bhk} Bhk</span>
                      {/* <p>{item.bhk} BHK</p> */}



                    </div>
                    <div className="property-meta">
                      <div>
                        <span className="price">₹{formatPrice(item.expected_price || item.estimated_price)}</span>
                        {/* <span>{item.price_per_sqft}</span> */}
                      </div>
                      <div>
                        <span className="sqrll">{item.super_builtup_area}</span>
                        <span className="sqrlling">{item.area_unit}</span>
                      </div>
                      <span className="prosub">{item.property_subtype}</span>
                    </div>
                    <div className="property-distre">
                      <div className="property-distre">
                        {item.distressed && (
                          <span className="tex-dest">{item.distressed}</span>
                        )}                    </div>
                      <div className="property-fur">
                        <span>{item.furnishing}</span>
                        <span>{item.amenities}</span>
                      </div>
                    </div>

                    <div className="property-loc">
                      <span className="tex-dec">{item.description}</span>
                    </div>

                    <div className="info-footer">
                      <button
                        className="view-btn"
                        onClick={() => {
                          setSelectedProperty(item);
                          setShowPopup(true);
                        }}
                      >
                        Submit your particulars
                      </button>
                      {/* <button className="contact-btn">Contact</button> */}
                    </div>
                  </div>
                </div>
              ))

            ) : (
              <p>No properties found</p>
            )}

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ marginRight: "10px" }}
              >
                Prev
              </button>

              <span>
                Page {currentPage} of {Math.ceil(properties.length / rowsPerPage)}
              </span>

              <button
                onClick={() =>
                  setCurrentPage(
                    currentPage < Math.ceil(properties.length / rowsPerPage)
                      ? currentPage + 1
                      : currentPage
                  )
                }
                disabled={currentPage === Math.ceil(properties.length / rowsPerPage)}
                style={{ marginLeft: "10px" }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <Buyerleadform
          property={selectedProperty}
          onClose={() => setShowPopup(false)}
        />

      )}
    </>
  );
};

export default Residentialbuye;
