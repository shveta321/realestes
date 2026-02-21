
const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mysql = require("mysql2/promise");
const multer = require("multer");
const path = require("path");
const fs = require('fs');


const app = express();

// MySQL Pool
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  // password: "",
  database: "synx_platform",
  //  port: 3306
});

// Check DB Connection
async function testDB() {
  try {
    const connection = await db.getConnection();
    console.log("✅ MySQL Connected!");
    connection.release();
  } catch (err) {
    console.log(" MySQL Connection Failed:", err);
  }
}

testDB();
// Storage
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const upload = multer({ storage });
// Middleware
app.use(cors());
app.use(express.json());
// static uploads folder (important)
app.use("/uploads", express.static("uploads"));
// Auth Middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, "SECRETKEY");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
}

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const [existing] = await db.execute("SELECT * FROM userss WHERE email=?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO userss (name, email, password, role) VALUES (?,?,?,?)",
      [name, email, hashed, role || "buyer"]
    );

    return res.json({ msg: "Registered successfully" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// LOGIN
app.post("/loging", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [user] = await db.execute("SELECT * FROM userss WHERE email=?", [email]);

    if (user.length === 0) return res.status(400).json({ msg: "User not found" });

    const valid = await bcrypt.compare(password, user[0].password);
    if (!valid) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user[0].id, role: user[0].role }, "SECRETKEY", { expiresIn: "7d" });

    return res.json({ msg: "Loging success", token, role: user[0].role, name: user[0].name });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// Protected Route Test
app.get("/admin-check", auth, (req, res) => {
  return res.json({ msg: "You are authenticated", user: req.user });
});
// GET ALL USERS
app.get("/admin/users", auth, async (req, res) => {
  try {
    const [users] = await db.execute(
      "SELECT id, name, email, role,  created_at FROM users ORDER BY id DESC"
    );

    return res.json(users);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

app.delete("/admin/users/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM users WHERE id = ?", [id]);
    return res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
});
app.put("/admin/users/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    await db.execute(
      "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
      [name, email, role, id]
    );
    return res.json({ msg: "User updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

app.post(
  "/property/add",
  auth,
  upload.fields([
    { name: "images", maxCount: 10 },    // multiple images
    { name: "documents", maxCount: 10 }  // multiple documents
  ]),
  async (req, res) => {
    try {
      const { title, type, subtype, description, estimated_price, location } = req.body;
      const seller_id = req.user.id;

      // ✅ Get all uploaded images
      const images = req.files.images ? req.files.images.map(f => f.filename) : [];

      // ✅ Documents
      const documents = req.files.documents ? req.files.documents.map(f => f.filename) : [];

      // Store images as JSON string in DB
      const [result] = await db.execute(
        `INSERT INTO propertie 
         (seller_id, title, type, subtype, description, estimated_price, location, images, status)
         VALUES (?,?,?,?,?,?,?,?, 'pending')`,
        [seller_id, title, type, subtype, description, estimated_price, location, JSON.stringify(images)]
      );

      return res.status(200).json({
        msg: "Property Added Successfully",
        id: result.insertId,
        images,
        docs: documents
      });

    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Server Error" });
    }
  }
);


//get  propertyadd
app.get("/property/my", auth, async (req, res) => {
  try {
    const seller_id = req.user.id;

    const [rows] = await db.execute(
      "SELECT * FROM propertie WHERE seller_id=? ORDER BY id DESC",
      [seller_id]
    );

    // prepend uploads path for frontend
    const data = rows.map(row => ({
      ...row,
      image_url: row.image ? `http://localhost:5000/uploads/${row.image}` : null
    }));

    return res.json(data);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
});
app.post("/investor/submit", async (req, res) => {
  try {
    const { name, address, email, phone, requirement, ticket_size } = req.body;

    await db.execute(
      "INSERT INTO investorss (name, address, email, phone, requirement, ticket_size) VALUES (?,?,?,?,?,?)",
      [name, address, email, phone, requirement, ticket_size]
    );

    return res.json({ msg: "Details Submitted, You can now view properties" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server Error" });
  }
});
app.get("/admin/investorss", auth, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM investorss ORDER BY id DESC");
    return res.json(rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server Error" });
  }
});

app.delete("/admin/investorss/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM investorss WHERE id=?", [id]);
    return res.json({ msg: "Investor Deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server Error" });
  }
});

app.post("/buyer-leads", async (req, res) => {
  try {
    let {
      property_id,
      name,
      phone,
      reason,
      isDealer,
      timeToBuy,
      homeLoan,
      siteVisit
    } = req.body;

    if (!property_id || !name || !phone) {
      return res.status(400).json({ msg: "Required fields missing" });
    }
    reason = reason === "selfuse" ? "selfuse" : "investment";
    isDealer = isDealer === "yes" ? "yes" : "no";
    timeToBuy = ["3months", "6months", "more"].includes(timeToBuy)
      ? timeToBuy
      : "3months";

    const sql = `
      INSERT INTO buyerleads
      (property_id, name, phone, reason, is_dealer, time_to_buy, home_loan, site_visit)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(sql, [
      property_id,
      name,
      phone,
      reason,
      isDealer,
      timeToBuy,
      Number(homeLoan),
      Number(siteVisit)
    ]);

    return res.status(201).json({ msg: "Buyer lead saved successfully" });

  } catch (error) {
    console.error("Buyer lead error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
});

app.get("/admin/inquiries", auth, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        bl.id,
        bl.property_id,
        bl.name,
        bl.phone,
        bl.reason,
        bl.is_dealer,
        bl.time_to_buy,
        bl.home_loan,
        bl.site_visit,
        
        bl.created_at,
        p.title AS property_title,
        u.name AS seller_name
      FROM buyerleads bl
      JOIN propertie p ON bl.property_id = p.id
      JOIN userss u ON p.seller_id = u.id
      ORDER BY bl.id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ================= ADMIN DASHBOARD ================= */

app.get("/api/admin/dashboard-stats", auth, async (req, res) => {
  try {

    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const [topSellers] = await db.execute(`
      SELECT u.id, u.name, COUNT(p.id) AS total_properties
      FROM userss u
      LEFT JOIN properties p ON p.seller_id = u.id
      WHERE u.role='seller'
      GROUP BY u.id
      ORDER BY total_properties DESC
    `);

    const [propertyTypes] = await db.execute(`
      SELECT property_type AS type, COUNT(*) AS count
      FROM properties
      GROUP BY property_type
    `);

    const [buyerInterest] = await db.execute(`
      SELECT COUNT(*) AS total FROM buyerleads
    `);

    const [monthlyLeads] = await db.execute(`
      SELECT MONTH(created_at) AS month, COUNT(*) AS count
      FROM buyerleads
      GROUP BY MONTH(created_at)
      ORDER BY month
    `);

    res.json({
      topSellers,
      propertyTypes,
      buyerInterest: buyerInterest[0].total,
      monthlyLeads
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Dashboard failed" });
  }
});


// /* ================= SELLER DASHBOARD ================= */

// app.get("/seller/dashboard-stats", auth, async (req, res) => {
//   try {

//     if (req.user.role !== "seller")
//       return res.status(403).json({ message: "Access denied" });

//     const sellerId = req.user.id;

//     const [totalProperties] = await db.execute(
//       "SELECT COUNT(*) AS total FROM properties WHERE seller_id=?",
//       [sellerId]
//     );

//     const [totalInquiries] = await db.execute(`
//       SELECT COUNT(*) AS total
//       FROM buyerleads bl
//       JOIN properties p ON bl.property_id=p.id
//       WHERE p.seller_id=?
//     `,[sellerId]);

//     const [propertyTypes] = await db.execute(`
//       SELECT property_type AS type, COUNT(*) AS count
//       FROM properties
//       WHERE seller_id=?
//       GROUP BY property_type
//     `,[sellerId]);

//     const [monthlyInquiries] = await db.execute(`
//       SELECT MONTH(bl.created_at) AS month, COUNT(*) AS count
//       FROM buyerleads bl
//       JOIN properties p ON bl.property_id=p.id
//       WHERE p.seller_id=?
//       GROUP BY MONTH(bl.created_at)
//       ORDER BY month
//     `,[sellerId]);

//     res.json({
//       totalProperties: totalProperties[0].total,
//       totalInquiries: totalInquiries[0].total,
//       propertyTypes,
//       monthlyInquiries
//     });

//   } catch (err) {
//     console.error("Seller Dashboard Error:", err);
//     res.status(500).json({ message: "Seller dashboard failed" });
//   }
// });

// ===== POST PROPERTY (TOKEN PROTECTED) =====
app.post(
  "/api/properties",
  auth,
  upload.array("media", 10),
  async (req, res) => {
    try {
      const data = JSON.parse(req.body.data);

      const media = req.files.map(f => "/uploads/" + f.filename);

      const sql = `
        INSERT INTO properties (
          looking_to, property_type, property_subtype,
          city, locality, sub_locality, society, house_no, pincode,
          bhk, bathrooms, balconies,
          carpet_area, builtup_area, super_builtup_area, area_unit,
          floor_no, total_floors, furnishing, availability_status,
          ownership, property_age, expected_price, price_per_sqft,
          price_negotiable, all_inclusive_price, tax_excluded,
          description, media, amenities, is_completed, status, seller_id
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `;

      const values = [
        data.looking_to,
        data.property_type,
        data.property_subtype,
        data.city,
        data.locality,
        data.sub_locality,
        data.society,
        data.house_no,
        data.pincode,
        data.bhk,
        data.bathrooms,
        data.balconies,
        data.carpet_area,
        data.builtup_area,
        data.super_builtup_area,
        data.area_unit,
        data.floor_no,
        data.total_floors,
        data.furnishing,
        data.availability_status,
        data.ownership,
        data.property_age,
        data.expected_price,
        data.price_per_sqft,
        data.price_negotiable,
        data.all_inclusive_price,
        data.tax_excluded,
        data.description,
        JSON.stringify(media),
        JSON.stringify(data.amenities),
        1,
        "pending",
        req.user.id
      ];

      const [result] = await db.query(sql, values);

      res.json({ success: true, property_id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


// ================= GET PROPERTIES =================
// app.get("/api/properties", async (req, res) => {
//   try {
//     const sql = `
//       SELECT 
//         id,
//         property_type,
//         property_subtype,
//         city,
//         locality,
//         expected_price,
//         description,
//         media
//       FROM properties
//       WHERE looking_to = 'sell'
//       ORDER BY created_at DESC
//     `;

//     const [rows] = await db.query(sql);

//     const properties = rows.map(p => ({
//       id: p.id,
//       type: p.property_type,
//       subtype: p.property_subtype,
//       location: `${p.locality}, ${p.city}`,
//       estimated_price: p.expected_price,
//       description: p.description,
//       images: p.media ? JSON.parse(p.media) : []
//     }));

//     res.json(properties);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });
// ================= GET PROPERTIES (SAFE VERSION) =================
// app.get("/api/properties", async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT 
//         id,
//         property_type,
//         property_subtype,
//         city,
//         locality,
//         expected_price,
//         description,
//         media
//       FROM properties
//       ORDER BY created_at DESC
//     `);

//     const properties = rows.map(p => {
//       let images = [];

//       try {
//         if (p.media) {
//           images = JSON.parse(p.media);
//         }
//       } catch (e) {
//         console.log("⚠️ Invalid media JSON for property:", p.id);
//         images = [];
//       }

//       return {
//         id: p.id,
//         type: p.property_type,
//         subtype: p.property_subtype,
//         location: `${p.locality || ""}, ${p.city || ""}`,
//         estimated_price: p.expected_price,
//         description: p.description,
//         images
//       };
//     });

//     res.json(properties);

//   } catch (err) {
//     console.error("❌ GET /api/properties ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });
// GET ALL PROPERTIES - For Residential Buyer Frontend
// Serve uploads folder publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/api/properties", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM properties
      WHERE is_completed = 1
      ORDER BY created_at DESC
    `);
    const safeParseMedia = (media) => {
      if (!media) return [];
      if (Array.isArray(media)) return media.map(m => ({ url: m, type: m.endsWith(".mp4") ? "video" : "image" }));

      try {
        const parsed = JSON.parse(media);
        if (Array.isArray(parsed)) {
          return parsed.map(m => ({ url: m, type: m.endsWith(".mp4") ? "video" : "image" }));
        }
        // fallback
        return [{ url: parsed, type: parsed.endsWith(".mp4") ? "video" : "image" }];
      } catch (err) {
        // If media is a plain string
        return [{ url: media, type: media.endsWith(".mp4") ? "video" : "image" }];
      }
    };
    const safeParseAmenities = (amenities) => {
      if (!amenities) return [];
      if (Array.isArray(amenities)) return amenities;

      try {
        return JSON.parse(amenities);
      } catch {
        return [];
      }
    };

    const data = rows.map(p => {
      const mediaArray = safeParseMedia(p.media).map(m => ({
        url: m.url.startsWith("/uploads") ? `http://localhost:5000${m.url}` : m.url,
        type: m.type || "image"
      }));

      return {
        id: p.id,
        property_type: p.property_type || "",
        subtype: p.property_subtype || "",
        city: p.city || "",
        locality: p.locality || "",
        sub_locality: p.sub_locality || "",

        society: p.society || "",
        pincode: p.pincode || "",

        bhk: p.bhk || "",
        price_per_sqft: p.price_per_sqft || "",
        area_unit: p.area_unit || "",
        type: p.type || "",
        furnishing: p.furnishing || "",
        amenities: p.amenities || "",
        super_builtup_area: p.super_builtup_area || "",
        property_subtype: p.property_subtype || "",



        description: p.description || "",
        location: `${p.locality || ""}, ${p.city || ""}`,
        estimated_price: p.expected_price || 0,
        media: mediaArray,
        amenities: safeParseAmenities(p.amenities),
        created_at: p.created_at
      };
    });

    res.json(data);
  } catch (err) {
    console.error("GET PROPERTIES ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// ADMIN - GET ALL PROPERTIES WITH SELLER INFO
app.get("/admin/properties", auth, async (req, res) => {
  try {
    // Admin check
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Fetch properties with seller info
    const [rows] = await db.query(`
      SELECT p.*,
             u.name AS seller_name,
             u.email AS seller_email
      FROM properties p
      LEFT JOIN userss u ON p.seller_id = u.id
      ORDER BY p.created_at DESC
    `);

    // Safe JSON parse helper
    const safeJsonParse = (str) => {
      if (!str) return [];
      if (Array.isArray(str)) return str;
      try {
        return JSON.parse(str);
      } catch (err) {
        console.warn("JSON parse error:", err.message, "Input:", str);
        return [str]; // fallback
      }
    };

    // Map rows to frontend-friendly format
    const data = rows.map((p) => ({
      id: p.id,
      title: p.title || "",
      type: p.property_subtype || "",
      subtype: p.property_subtype || "",
      description: p.description || "",
      location: `${p.locality || ""}, ${p.city || ""}`,
      price: p.expected_price || 0,
      status: p.status || "pending",
      seller_name: p.seller_name || "N/A",   // seller name from join
      seller_email: p.seller_email || "N/A", // seller email from join
      images: safeJsonParse(p.media),
      amenities: safeJsonParse(p.amenities),
      created_at: p.created_at,
    }));

    res.json(data);
  } catch (err) {
    console.error("ADMIN PROPERTIES ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
app.delete("/admin/properties/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;
    await db.query("DELETE FROM properties WHERE id = ?", [id]);

    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    console.error("DELETE PROPERTY ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.put("/admin/properties/:id/status", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;
    const [rows] = await db.query("SELECT status FROM properties WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ message: "Property not found" });

    const currentStatus = rows[0].status;
    let newStatus;

    if (currentStatus === "pending") newStatus = "approved";
    else if (currentStatus === "approved") newStatus = "pending";
    else newStatus = "pending"; // default for rejected

    await db.query("UPDATE properties SET status = ? WHERE id = ?", [newStatus, id]);

    res.json({ message: `Property status changed to ${newStatus}` });
  } catch (err) {
    console.error("TOGGLE PROPERTY STATUS ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// PUT /admin/properties/:id/approve
app.put("/admin/properties/:id/approve", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;

    await db.query("UPDATE properties SET status = 'approved' WHERE id = ?", [id]);

    res.json({ message: "Property approved" });
  } catch (err) {
    console.error("APPROVE PROPERTY ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT /admin/properties/:id/reject
app.put("/admin/properties/:id/reject", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;

    await db.query("UPDATE properties SET status = 'rejected' WHERE id = ?", [id]);

    res.json({ message: "Property rejected" });
  } catch (err) {
    console.error("REJECT PROPERTY ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// app.patch("/admin/property/approve/:id", auth, async (req, res) => {
//   const { id } = req.params;

//   console.log("===== APPROVE PROPERTY DEBUG =====");
//   console.log("Property ID:", id);

//   try {
//     const [check] = await db.execute(
//       "SELECT id, is_completed FROM properties WHERE id = ?",
//       [id]
//     );

//     console.log("Found Property:", check);

//     if (check.length === 0) {
//       return res.status(404).json({ msg: "Property not found" });
//     }

//     const [result] = await db.execute(
//       "UPDATE properties SET is_completed = 1 WHERE id = ?",
//       [id]
//     );

//     console.log("Update Result:", result);

//     res.json({
//       msg: "Property Approved",
//       property_id: id
//     });

//   } catch (err) {
//     console.error("APPROVE ERROR:", err);
//     res.status(500).json({
//       msg: "Server Error",
//       error: err.message
//     });
//   }
// });
// app.patch("/admin/property/reject/:id", auth, async (req, res) => {
//   const { id } = req.params;

//   console.log("===== REJECT PROPERTY DEBUG =====");
//   console.log("Property ID:", id);

//   try {
//     const [result] = await db.execute(
//       "UPDATE properties SET is_completed = 0 WHERE id = ?",
//       [id]
//     );

//     console.log("Reject Result:", result);

//     res.json({
//       msg: "Property Rejected",
//       property_id: id
//     });

//   } catch (err) {
//     console.error("REJECT ERROR:", err);
//     res.status(500).json({
//       msg: "Server Error",
//       error: err.message
//     });
//   }
// });
//   app.delete("/admin/property/delete/:id", auth, async (req, res) => {
//   const { id } = req.params;

//   console.log("===== DELETE PROPERTY DEBUG =====");
//   console.log("Property ID:", id);

//   try {
//     const [result] = await db.execute(
//       "DELETE FROM properties WHERE id = ?",
//       [id]
//     );

//     console.log("Delete Result:", result);

//     res.json({
//       msg: "Property Deleted",
//       property_id: id
//     });

//   } catch (err) {
//     console.error("DELETE ERROR:", err);
//     res.status(500).json({
//       msg: "Server Error",
//       error: err.message
//     });
//   }
// });


app.get("/api/properties/filter", async (req, res) => {
  try {
    const {
      property_type,
      property_subtype,
      bhk,
      city,
      locality,
      minPrice,
      maxPrice
    } = req.query;

    let sql = "SELECT * FROM properties WHERE status='approved'";
    let values = [];

    if (property_type) {
      sql += " AND property_type = ?";
      values.push(property_type);
    }
    if (property_subtype) {
      sql += " AND property_subtype = ?";
      values.push(property_subtype);
    }
  if (bhk) {
      sql += " AND bhk = ?";
      values.push(bhk);
    }
    if (city) {
      sql += " AND city LIKE ?";
      values.push(`%${city}%`);
    }
    
    if (locality) {
      sql += " AND locality LIKE ?";
      values.push(`%${locality}%`);
    }
    if (minPrice) {
      sql += " AND expected_price >= ?";
      values.push(minPrice);
    }
    if (maxPrice) {
      sql += " AND expected_price <= ?";
      values.push(maxPrice);
    }

    sql += " ORDER BY id DESC";

    const [rows] = await db.query(sql, values);

    // 🔥 SAME formatting as /api/properties
    const safeParseMedia = (media) => {
      if (!media) return [];
      if (Array.isArray(media)) return media;

      try {
        return JSON.parse(media);
      } catch {
        return [];
      }
    };

    const safeParseAmenities = (amenities) => {
      if (!amenities) return [];
      if (Array.isArray(amenities)) return amenities;

      try {
        return JSON.parse(amenities);
      } catch {
        return [];
      }
    };

    const data = rows.map(p => {
      const mediaArray = safeParseMedia(p.media).map(url => ({
        url: url.startsWith("/uploads")
          ? `http://localhost:5000${url}`
          : url,
        type: url.endsWith(".mp4") ? "video" : "image"
      }));

      return {
        ...p,
        media: mediaArray,
        amenities: safeParseAmenities(p.amenities)
      };
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Filter error" });
  }
});
app.get("/api/locations/suggest", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) return res.json([]);

    const sql = `
      SELECT DISTINCT city
      FROM properties
      WHERE status='approved'
        AND LOWER(city) LIKE LOWER(?)
      ORDER BY city
      LIMIT 10
    `;

    const [rows] = await db.query(sql, [`${q}%`]);

    res.json(rows.map(r => r.city));
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});
// SELLER - MY PROPERTIES
app.get("/seller/properties", auth, async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Access denied" });
    }

    const sellerId = req.user.id;

    const [rows] = await db.query(
      `SELECT *
       FROM properties
       WHERE seller_id = ?
       ORDER BY created_at DESC`,
      [sellerId]
    );

    const safeJsonParse = (str) => {
      if (!str) return [];
      if (Array.isArray(str)) return str;
      try {
        return JSON.parse(str);
      } catch {
        return [];
      }
    };

    const data = rows.map((p) => ({
      id: p.id,
      title: p.title,
      type: p.property_type,
      subtype: p.property_subtype,
      price: p.expected_price,
      location: `${p.locality}, ${p.city}`,
      status: p.status,
      images: safeJsonParse(p.media),
      created_at: p.created_at,
    }));

    res.json(data);
  } catch (err) {
    console.error("SELLER PROPERTIES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
