// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const jwt = require("jsonwebtoken");
// const db = require("../db");

// // Storage for files
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
    
//     cb(null, "uploads/properties/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });
// router.post(
//   "/add",
//   verifySeller,
//   upload.array("documents", 10),
//   async (req, res) => {

//     const { title, type, subtype, description, estimated_price, location } = req.body;
//     const seller_id = req.user.id;

//     try {
//       const [result] = await db.execute(
//         `INSERT INTO properties 
//          (seller_id, title, type, subtype, description, estimated_price, location) 
//          VALUES (?, ?, ?, ?, ?, ?, ?)`,
//         [seller_id, title, type, subtype, description, estimated_price, location]
//       );

//       return res.json({
//         msg: "Property added successfully",
//         property_id: result.insertId,
//       });

//     } catch (err) {
//       console.log(err);
//       return res.status(500).json({ msg: "Server error" });
//     }
//   }
// );

// module.exports = router;
