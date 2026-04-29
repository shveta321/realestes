import React, { useState } from "react";
import axios from "axios";
import "./sellerr.css";

export default function PropertyForm() {
  const [step, setStep] = useState(1);
  // const [properties, setProperties] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    looking_to: "",
    property_type: "",
    property_subtype: "",
    city: "",
    locality: "",
    sub_locality: "",

    society: "",
    house_no: "",
    pincode: "",
    bhk: "",
    bathrooms: "",
    balconies: "",
    carpet_area: "",
    builtup_area: "",
    super_builtup_area: "",
    area_unit: "sqft",
    floor_no: "",
    total_floors: "",
    furnishing: "",
    availability_status: "",
    ownership: null,
    property_age: "",
    expected_price: "",
    price_per_sqft: "",
    price_negotiable: 0,
    all_inclusive_price: 1,
    tax_excluded: 0,
    description: "",
    washrooms: null,
    distressed: null,
    amenities: [],

    // Commercial only
  });

  const [media, setMedia] = useState([]);
  const [mediaPreview, setMediaPreview] = useState([]);

  //   const formatNumber = (value) => {
  //   if (!value) return "";
  //   return Number(value).toLocaleString("en-IN");
  // };

  // const removeCommas = (value) => {
  //   return value.replace(/,/g, "");
  // };
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // const val = Number(value);
    const updatedForm = {
      ...form,
      [name]: value
    };

    const carpet = Number(
      name === "carpet_area" ? value : updatedForm.carpet_area
    );
    const builtup = Number(
      name === "builtup_area" ? value : updatedForm.builtup_area
    );
    const superBuiltup = Number(
      name === "super_builtup_area" ? value : updatedForm.super_builtup_area
    );

    let newErrors = {};

    //  Carpet vs Built-up
    if (carpet && builtup && builtup <= carpet) {
      newErrors.builtup_area =
        "Built-up area should be greater than Carpet area";
    }

    // Built-up vs Super Built-up
    if (builtup && superBuiltup && superBuiltup <= builtup) {
      newErrors.super_builtup_area =
        "Super Built-up area should be greater than Built-up area";
    }

    /* ======================
       FLOOR CONDITIONS
       ====================== */
    if (name === "total_floors") {
      const total = Number(value);
      if (form.floor_no > total) {
        updatedForm.floor_no = total;
      }
    }
    if (name === "floor_no") {
      const floor = Number(value);
      const total = Number(form.total_floors);
      if (floor < 0) return;
      if (total && floor > total) return;
    }

    const expectedPrice =
      name === "expected_price"
        ? Number(value)
        : Number(updatedForm.expected_price);

    if (expectedPrice > 0 && superBuiltup > 0) {
      updatedForm.price_per_sqft = Math.round(
        expectedPrice / superBuiltup
      );
    } else {
      updatedForm.price_per_sqft = "";
    }
    setForm(updatedForm);
    setErrors(newErrors);
  };
  const handleFileChange = e => {
    const files = Array.from(e.target.files);
    setMedia(prev => [...prev, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setMediaPreview(prev => [...prev, ...previews]);
  };

  const handleAmenitiesChange = e => {
    const { value, checked } = e.target;
    if (checked) {
      setForm(prev => ({ ...prev, amenities: [...prev.amenities, value] }));
    } else {
      setForm(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== value) }));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(form));

    media.forEach(file => {
      formData.append("media", file);
    });

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://synamc.com/api/seller/properties",
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,

          }
        }
      );

      alert("Property Added! ID: " + res.data.property_id);

      setStep(1);
      setForm({
        looking_to: "",
        property_type: "",
        property_subtype: "",
        city: "",
        locality: "",
        sub_locality: "",
        society: "",
        house_no: "",
        pincode: "",
        bhk: "",
        bathrooms: "",
        balconies: "",
        carpet_area: "",
        builtup_area: "",
        super_builtup_area: "",
        area_unit: "sqft",
        floor_no: "",
        total_floors: "",
        furnishing: "",
        availability_status: "",
        ownership: "",
        property_age: "",
        expected_price: "",
        price_per_sqft: "",
        price_negotiable: false,
        all_inclusive_price: false,
        tax_excluded: false,
        description: "",
        // Commercial only
        washrooms: "",
        distressed: null,
        amenities: []
      });

      setMedia([]);
      setMediaPreview([]);
    } catch (err) {
      console.error(err);
      alert(" Error uploading property");
    }
  };

  return (
    <div style={{ maxWidth: "882px", margin: "auto" }}>
      <h2>Post Your Property</h2>

      <div className="post-wrapper">
        <div className="post-container">

          {/* LEFT STEPS */}
          <div className="steps-panel">
            <h3>Post Property</h3>
            <ul>
              <li className={step >= 1 ? "active" : ""}>Basic Details</li>
              <li className={step >= 2 ? "active" : ""}>Location</li>
              <li className={step >= 3 ? "active" : ""}>Property Profile</li>
              <li className={step >= 4 ? "active" : ""}>Photos & Videos</li>
              <li className={step >= 5 ? "active" : ""}>Distressed </li>
              <li className={step >= 6 ? "active" : ""}>Amenities</li>

            </ul>
          </div>
          {/* RIGHT FORM */}
          <div className="form-panel">
            {step === 1 && (
              <div className="first-detal">
                <h3>Basic Details</h3>
                <select className="sel-detail" name="looking_to" value={form.looking_to} onChange={handleChange}>
                  <option value="">Looking To</option>
                  <option value="sell">Sell</option>
                  {/* <option value="pg">PG</option> */}
                </select>

                <select className="sel-detail" name="property_type" value={form.property_type} onChange={handleChange}>
                  <option value="">Property Type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="Land / Plot">Land / Plot </option>

                </select>

                <select
                  name="property_subtype"
                  className="sel-detail-1"
                  value={form.property_subtype}
                  onChange={handleChange}
                >
                  <option value="">Property Subtype</option>

                  {form.property_type === "residential" && (
                    <>
                      <option value="Flat/Apartment">Flat/Apartment</option>
                      <option value="Independent House / Villa">Independent House / Villa</option>
                      <option value="Builder Floor">Builder Floor</option>
                      <option value="RK/ Studio Apartment">RK/ Studio Apartment</option>
                      <option value="Serviced Apartment">Serviced Apartment</option>
                    </>
                  )}

                  {form.property_type === "commercial" && (
                    <>
                      <option value="Office Space">Office Space</option>
                      <option value="Shop/Showroom">Shop/Showroom</option>
                      {/* <option value="Commercial Land">Commercial Land</option> */}
                      <option value="Warehouse">Warehouse</option>
                      <option value="Industrial Building">Industrial Building</option>
                    </>
                  )}
                </select>
                <button onClick={() => setStep(2)}>Next</button>
              </div>
            )}

            {step === 2 && (
              <div className="locat-detail">
                <h3>Location Details</h3>
                <div className="sb-loct">
                  <input name="city" placeholder="City" className="sel-detail-2" value={form.city} onChange={handleChange} />
                  <input name="locality" placeholder="Locality" className="sel-detail-2" value={form.locality} onChange={handleChange} />
                </div>
                <div className="sb-loct">
                  <input name="sub_locality" placeholder="Sub-locality" className="sel-detail-2" value={form.sub_locality} onChange={handleChange} />
                  <input name="society" placeholder="Society" className="sel-detail-2" value={form.society} onChange={handleChange} />

                </div>
                <div className="sb-loct">
                  <input name="house_no" placeholder="House No" className="sel-detail-2" value={form.house_no} onChange={handleChange} />
                  <input name="pincode" placeholder="Pincode" className="sel-detail-2" value={form.pincode} onChange={handleChange} />
                </div>
                <button onClick={() => setStep(1)}>Back</button>
                <button onClick={() => setStep(3)}>Next</button>
              </div>
            )}
            {step === 3 && (

              <div className="thrired-detail">
                <h3>Property Profile</h3>
                {form.property_type === "residential" && (
                  <>
                    <div className="pro-det">
                      <div className="pro-det">
                        <input
                          type="number"
                          name="bhk"
                          placeholder="BHK"
                          className="sel-detail-2"
                          value={form.bhk}
                          onChange={handleChange}
                        />

                        {form.bhk && (
                          <small style={{ marginLeft: "8px" }}>
                            {form.bhk} BHK
                          </small>
                        )}
                      </div>

                      <input type="number" name="bathrooms" placeholder="Bathrooms" className="sel-detail-2" value={form.bathrooms} onChange={handleChange} />
                      <input type="number" name="balconies" placeholder="Balconies" className="sel-detail-2" value={form.balconies} onChange={handleChange} />
                    </div>
                    <div className="pro-det">
                      <div>
                        <input
                          type="number"
                          name="carpet_area"
                          placeholder="Carpet Area"
                          value={form.carpet_area}
                          onChange={handleChange}
                        />

                        {errors.builtup_area && (
                          <p className="error-text">{errors.builtup_area}</p>
                        )}
                      </div>

                      <div>
                        <input
                          type="number"
                          name="builtup_area"
                          placeholder="Built-up Area"
                          value={form.builtup_area}
                          onChange={handleChange}
                        />

                        {errors.super_builtup_area && (
                          <p className="error-text">{errors.super_builtup_area}</p>
                        )}
                      </div>
                      <div>

                        <input
                          type="number"
                          name="super_builtup_area"
                          placeholder="Super Built-up Area"
                          value={form.super_builtup_area}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <select name="area_unit" value={form.area_unit} onChange={handleChange}>
                          <option value="sqft">sqft</option>
                          <option value="sqyd">sqyd</option>
                          <option value="sqm">sqm</option>
                        </select>
                      </div>

                    </div>
                    <div className="pro-det">
                      <input
                        type="number"
                        name="floor_no"
                        placeholder="Floor No"
                        className="sel-detail-2"
                        value={form.floor_no}
                        min="0"
                        max={form.total_floors || 0}
                        onChange={handleChange}
                      />

                      <input
                        type="number"
                        name="total_floors"
                        placeholder="Total Floors"
                        className="sel-detail-2"
                        value={form.total_floors}
                        min="0"
                        onChange={handleChange}
                      />

                    </div>
                    <div className="pro-det">
                      <select name="furnishing" className="sel-detail-3" value={form.furnishing} onChange={handleChange}>
                        <option value="">Furnishing</option>
                        <option value="furnished">Furnished</option>
                        <option value="semi-furnished">Semi-furnished</option>
                        <option value="unfurnished">Unfurnished</option>
                      </select>

                      <select name="availability_status" className="sel-detail-3" value={form.availability_status} onChange={handleChange}>
                        <option value="">Availability</option>
                        <option value="ready to move">Ready to Move</option>
                        <option value="under construction">Under Construction</option>
                      </select>

                      <select name="ownership" className="sel-detail-3" value={form.ownership} onChange={handleChange}>
                        <option value="">Ownership</option>
                        <option value="freehold">Freehold</option>
                        <option value="leasehold">Leasehold</option>
                        <option value="co-operative society">Co-operative Society</option>
                        <option value="power of attorney">Power of Attorney</option>
                      </select>
                    </div>
                    <div className="pro-det">
                      <input type="number" className="sel-detail-2" name="property_age" placeholder="Property Age" value={form.property_age} onChange={handleChange} />
                      <input
                        type="number"
                        className="sel-detail-2"
                        name="expected_price"
                        placeholder="Expected Price"
                        value={form.expected_price}
                        onChange={handleChange}
                      />

                      <div className="price-sqft-wrapper">
                        <input
                          type="number"
                          className="sel-detail-2"
                          name="price_per_sqft"
                          placeholder="Price per sqft"
                          value={form.price_per_sqft}
                          readOnly
                        />
                        <span className="sqft-label">per sqft</span>
                      </div>

                    </div>
                    <div className="pro-det">
                      <label>
                        Price Negotiable
                        <input type="checkbox" name="price_negotiable" className="sel-detail-2" checked={form.price_negotiable} onChange={handleChange} />
                      </label>
                      <label>
                        All Inclusive
                        <input type="checkbox" name="all_inclusive_price" className="sel-detail-2" checked={form.all_inclusive_price} onChange={handleChange} />
                      </label>
                      <label>
                        Tax Excluded
                        <input type="checkbox" name="tax_excluded" className="sel-detail-2" checked={form.tax_excluded} onChange={handleChange} />
                      </label>
                    </div>
                    <textarea name="description" placeholder="Description" className="sel-detail-2" value={form.description} onChange={handleChange}></textarea>
                  </>


                )}

                {form.property_type === "commercial" && (
                  <>
                    <div className="pro-det">
                      <div>
                        <input
                          type="number"
                          name="carpet_area"
                          placeholder="Carpet Area"
                          value={form.carpet_area}
                          onChange={handleChange}
                        />

                        {errors.builtup_area && (
                          <p className="error-text">{errors.builtup_area}</p>
                        )}
                      </div>

                      <div>
                        <input
                          type="number"
                          name="builtup_area"
                          placeholder="Built-up Area"
                          value={form.builtup_area}
                          onChange={handleChange}
                        />

                        {errors.super_builtup_area && (
                          <p className="error-text">{errors.super_builtup_area}</p>
                        )}
                      </div>

                      <div>
                        <select name="area_unit" value={form.area_unit} onChange={handleChange}>
                          <option value="sqft">sqft</option>
                          <option value="sqyd">sqyd</option>
                          <option value="sqm">sqm</option>
                        </select>
                      </div>

                    </div>


                    <input type="number" name="bathrooms" placeholder="Private Bathrooms" value={form.bathrooms} onChange={handleChange} />
                    <input type="number" name="public_bathrooms" placeholder="Public Bathrooms" value={form.public_bathrooms} onChange={handleChange} />

                    <input type="number" name="floor_no" placeholder="Floor No" value={form.floor_no} onChange={handleChange} />
                    <input type="number" name="total_floors" placeholder="Total Floors" value={form.total_floors} onChange={handleChange} />

                    <div className="pro-det">
                      <input type="number" className="sel-detail-2" name="property_age" placeholder="Property Age" value={form.property_age} onChange={handleChange} />
                      <input
                        type="number"
                        className="sel-detail-2"
                        name="expected_price"
                        placeholder="Expected Price"
                        value={form.expected_price}
                        onChange={handleChange}
                      />

                      <div className="price-sqft-wrapper">
                        <input
                          type="number"
                          className="sel-detail-2"
                          name="price_per_sqft"
                          placeholder="Price per sqft"
                          value={form.price_per_sqft}
                          readOnly
                        />
                        <span className="sqft-label">per sqft</span>
                      </div>

                    </div>
                                        <textarea name="description" placeholder="Description" className="sel-detail-2" value={form.description} onChange={handleChange}></textarea>

                  </>
                )}

                <button onClick={() => setStep(2)}>Back</button>
                <button onClick={() => setStep(4)}>Next</button>
              </div>
            )}

            {step === 4 && (
              <div className="frouth-detail">
                <h3>Upload Photographs & Video</h3>
                <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} />
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {mediaPreview.map((url, i) => (
                    <img key={i} src={url} alt="preview" width="100" style={{ margin: "5px" }} />
                  ))}
                </div>

                <button onClick={() => setStep(3)}>Back</button>
                <button onClick={() => setStep(5)}>Next</button>
              </div>
            )}
            {step === 5 && (
              <div className="locat-detail">
                <h3>Distressed property</h3>
                <div className="sb-loct">
                  <select
                    name="distressed"
                    value={form.distressed || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select Type</option>
                    <option value="Distressed Property">Distressed Property</option>
                    <option value="Fair Market Valued">Fair Market Valued</option>
                  </select>            </div>

                <button onClick={() => setStep(4)}>Back</button>
                <button onClick={() => setStep(6)}>Next</button>
              </div>
            )}
            {step === 6 && (
              <div className="fith-dtail">
                <h2>Amenities</h2>
                {["Parking", "Lift", "Gym", "Swimming Pool", "Power Backup"].map(a => (
                  <label key={a} style={{ display: "block" }}>
                    <input
                      type="checkbox"
                      value={a}
                      checked={form.amenities.includes(a)}
                      onChange={handleAmenitiesChange}
                    />
                    {a}
                  </label>
                ))}

                <button onClick={() => setStep(4)}>Back</button>
                <button onClick={handleSubmit}>Submit Property</button>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}
