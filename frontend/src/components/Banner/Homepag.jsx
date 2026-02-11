import React from "react";
import { motion } from "framer-motion";
import banner from "../image/banner5.jpg";
import "../Banner/Homep.css";

const Homepag = () => {
  return (
    <div className="home">

      {/* Banner Section */}
      <section className="hero">

        {/* Animated Image */}
        <motion.img
          src={banner}
          alt="Home Banner"
          className="hero-img"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        />

        {/* Content */}
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Welcome to <br />
            Syn X Real Estate & Advisory
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Platform for Smart Investments
          </motion.p>

          {/* <motion.button
            className="hero-btn"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Properties
          </motion.button> */}
        </motion.div>

      </section>

    </div>
  );
};

export default Homepag;
