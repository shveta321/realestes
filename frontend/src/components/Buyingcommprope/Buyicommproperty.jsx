import "../Buyingcommprope/Buyicommproperty.css";
import buycommer from "../image/buycommer.webp";
import Comproperty2 from "../image/Comproperty1.webp";

const Buyicommproperty = () => {
  const properties = [
    {
      price: "₹45 Lac",
      area: "891 sqft",
      title: "3 Bedroom House in Sarangpur, Delhi",
      bhk: "3 BHK",
      status: "Ready To Move",
      owner: "Owner",
      image: buycommer,
    },
    {
      price: "₹55 Lac",
      area: "1020 sqft",
      title: "Independent House in Delhi South West",
      bhk: "3 BHK",
      status: "Verified",
      owner: "Owner",
      image: Comproperty2,
    },
  ];

  return (
    <div className="listing-page">
      <h2 className="page-title">
        Property in Delhi South West for Sale
      </h2>

      <div className="listing-container">
        <aside className="filters-panel">

          {/* Header */}
          <div className="filters-header">
            <h4>Applied Filters</h4>
            <button className="clear-link">Clear All</button>
          </div>

          {/* Chips (Applied) */}
          <div className="chips-row">
            <span className="chip active">Residential Land ✕</span>
            <span className="chip active">Owner ✕</span>
          </div>

          <hr />

          {/* Toggle */}
          <div className="toggle-row">
            <span>Hide already seen</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>

          <hr />

          {/* Budget */}
          <div className="filter-block">
            <div className="block-header">
              <span>Budget</span>
            </div>

            <div className="dropdowns-row">
              <select className="dropdowns">
                <option>No min</option>
                <option>₹20 Lakh</option>
                <option>₹40 Lakh</option>
              </select>

              <select className="dropdowns">
                <option>No max</option>
                <option>₹50 Lakh</option>
                <option>₹1 Crore</option>
              </select>
            </div>
          </div>

          <hr />

          {/* Type of property */}
          <div className="filter-block">
            <div className="block-header">
              <span>Type of property</span>
              <button className="clear-link">Clear</button>
            </div>

            <div className="chips-list">
              <span className="chip">+ Independent/Builder Floor</span>
              <span className="chip">+ Independent House/Villa</span>
              <span className="chip">+ Residential Apartment</span>
              <span className="chip selected">✔ Residential Land</span>
              <span className="chip">+ Farm House</span>
            </div>
          </div>

          <hr />

          {/* Posted By */}
          <div className="filter-block">
            <div className="block-header">
              <span>Posted By</span>
              <button className="clear-link">Clear</button>
            </div>

            <div className="chips-list">
              <span className="chip selected">✔ Owner</span>
              <span className="chip">+ Builder</span>
              <span className="chip">+ Dealer</span>
              <span className="chip">+ Feature Dealer</span>
            </div>
          </div>

          <hr />

          {/* Localities */}
          <div className="filter-block">
            <div className="block-header">
              <span>Localities</span>
            </div>

            <ul className="locality-list">
              <li><input type="checkbox" /> Karol Bagh</li>
              <li><input type="checkbox" /> New Rajendra Nagar</li>
              <li><input type="checkbox" /> DaryaGanj</li>
              <li><input type="checkbox" /> Prithviraj Road</li>
              <li><input type="checkbox" /> Malcha Marg</li>
              <li className="more">More Localities</li>
            </ul>
          </div>

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

export default Buyicommproperty;
