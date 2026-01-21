import React from "react";

const AdvisoryServices = () => {
  const services = [
    {
      title: "Property Advisory",
      desc: "Expert guidance to help you choose the right residential or commercial property.",
      icon: "🏠",
    },
    {
      title: "Investment Advisory",
      desc: "Maximize returns with smart real estate investment strategies.",
      icon: "📈",
    },
    {
      title: "Legal Advisory",
      desc: "End-to-end legal support including documentation and verification.",
      icon: "⚖️",
    },
    {
      title: "Valuation Advisory",
      desc: "Accurate property valuation backed by market insights.",
      icon: "💰",
    },
  ];

  return (
    <div className="advisory-page">
      {/* Header */}
      <div className="advisory-hero">
        <h1>Advisory Services</h1>
        <p>
          Professional real estate advisory services to help you make confident
          property decisions.
        </p>
      </div>

      {/* Services */}
      <div className="services-container">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvisoryServices;
