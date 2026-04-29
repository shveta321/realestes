import React, { useState, useEffect } from "react";
import "../Buyingcommprope/Buyicommproperty.css";
import axios from "axios";


export default function InvestorForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    property_type: "",
    bhk: "",
    area: "",
    location: "",
    price_range: ""
  });
  const highlightMatch = (text, query) => {
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<b>$1</b>");
  };

  //  const [form, setForm] = useState({ location: "" });
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (query.length >= 1) {
        try {
          const res = await axios.get(
            `https://synamc.com/api/locations?search=${query}`
          );
          setSuggestions(res.data);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSuggestions([]);
      }
    }, 300); // ⏱ debounce

    return () => clearTimeout(delay);
  }, [query]);

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, location: value });
    setQuery(value);
  };

  const handleSelect = (loc) => {
    setForm({ ...form, location: loc });
    setSuggestions([]);
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://synamc.com/api/investors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      alert(data.msg);

      // reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        property_type: "",
        bhk: "",
        area: "",
        location: "",
        price_range: ""
      });

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <form className="investor-form" onSubmit={handleSubmit}>
        <h2>Your investment profile</h2>
        <div className="form-group">
          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="email" placeholder="Email ID" onChange={handleChange} />
        </div>

        <div className="form-group">
          <input
            name="phone"
            placeholder="Mobile Number"
            onChange={handleChange}
          />

          {/*  INPUT + DROPDOWN COMBO */}
          <input
            list="property-options"
            name="property_type"
            placeholder="Select or type property"
            value={form.property_type}
            onChange={handleChange}
          />

          <datalist id="property-options">
            <option value="Villa" />
            <option value="House" />
            <option value="Shop" />
            <option value="Office" />
            <option value="Industrial Plot" />
            <option value="Flat" />

          </datalist>
        </div>

        <div className="form-group">
          <input name="bhk" placeholder="BHK (e.g. 2 BHK)" onChange={handleChange} />
          <input name="area" placeholder="Area (Sq. Ft.)" onChange={handleChange} />
        </div>

        <div className="form-group" style={{ position: "relative" }}>
          <input
            name="location"
            placeholder="Preferred Location"
            value={form.location}
            onChange={handleLocationChange}
          />
          {suggestions.length > 0 && (
            <ul className="suggestion-box">
              {suggestions.map((item, index) => (
                <li key={index} onClick={() => handleSelect(item)}>
                  <div className="suggestion-item">

                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(item, query),
                      }}
                    />

                    <span className="tag">City</span>

                  </div>
                </li>

              ))}
            </ul>

          )}
          <input
            name="price_range"
            placeholder="Price"
            value={form.price_range}
            onChange={(e) =>
              setForm({ ...form, price_range: e.target.value })
            }
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}