import React, { useEffect, useState } from "react";
import "../Buyingcommprope/Buyicommproperty.css";

const Filter = () => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    property_type: "",
    property_subtype: "",
    minPrice: "",
    maxPrice: "",
    city: "",
    locality: "",
    postedBy: ""
  });


  /* Fetch properties when filters change */
  useEffect(() => {
    const params = new URLSearchParams();

    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });

    fetch(`http://localhost:5000/buyer/propertiess?${params.toString()}`)
      .then(res => res.json())
      .then(data => console.log("Filtered:", data))
      .catch(err => console.log(err));
  }, [filters]);

  /* 🔹 Indian Price Formatter */
  // const formatPrice = (price) => {
  //   if (price >= 10000000) return (price / 10000000).toFixed(2) + " Cr";
  //   if (price >= 100000) return (price / 100000).toFixed(2) + " Lakh";
  //   return price.toLocaleString("en-IN");
  // };

  /* 🔹 Clear All */
  const clearAll = () => {
    setFilters({
      property_type: "",
      property_subtype: "",
      minPrice: "",
      maxPrice: "",
      city: "",
      locality: "",
      postedBy: ""
    });
  };

  return (
    <div className="listing-page">
      {/* <h2 className="page-title">Properties for Sale</h2> */}

      <div className="listing-container">
        {/* ================= FILTER PANEL ================= */}
        <aside className="filters-panel">
          <div className="filters-header">
            <h4>Applied Filters</h4>
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
              <select
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value })
                }
              >
                <option value="">No Min</option>
                <option value="2000000">₹20 Lakh</option>
                <option value="4000000">₹40 Lakh</option>
                <option value="6000000">₹60 Lakh</option>
              </select>

              <select
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
              >
                <option value="">No Max</option>
                <option value="5000000">₹50 Lakh</option>
                <option value="10000000">₹1 Crore</option>
                <option value="20000000">₹2 Crore</option>
                <option value="600000000">₹60 cror</option>

              </select>
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

          <hr />

          {/* Posted By */}
          <div className="filter-block">
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
          </div>

          <hr />

          {/* Location Search */}
          <div className="filter-block">
            <h4>Location</h4>
            <input
              type="text"
              placeholder="Search city"
              onChange={(e) =>
                setFilters({ ...filters, city: e.target.value })
              }
            />

          </div>
        </aside>

        {/* ================= PROPERTIES ================= */}
        {/* <main className="properties">
          {properties.length > 0 ? (
            properties.map((item) => (
              <div className="property-card" key={item.id}>
                <img src={item.image_url} alt={item.title} />

                <div className="property-info">
                  <h3>{item.title}</h3>
                  <p className="location">{item.location}</p>

                  <p className="price">
                    ₹{formatPrice(item.estimated_price)}
                  </p>

                  <p className="desc">{item.description}</p>

                  <div className="actions">
                    <button className="btn-outline">
                      View Number
                    </button>
                    <button className="btn-primary">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No properties found</p>
          )}
        </main> */}
      </div>
    </div>
  );
};

export default Filter;
