
const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const BASE_URL = process.env.BASE_URL || "https://synamc.com";
const JWT_SECRET = process.env.JWT_SECRET || "SECRETKEY";

const jwt = require("jsonwebtoken");
const cors = require("cors");
const mysql = require("mysql2/promise");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.set("trust proxy", 1);

// MySQL Pool (uses .env: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "synx_platform",
  port: parseInt(process.env.DB_PORT || "3306", 10),
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
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


testDB();
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
app.use(cors({
 origin: ["http://localhost:3000", "https://synamc.com"],
  credentials: true
}));
app.use(express.json());
// Catch invalid JSON body (e.g. trailing comma, wrong quotes) – return 400 instead of crashing
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ msg: "Invalid JSON in request body" });
  }
  next(err);
});
// static uploads folder (important)
// app.use("/uploads", express.static("uploads"));
// Auth Middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
}
const tempUsers = {}; // temporary storage

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    // check DB me already hai ya nahi
    const [existing] = await db.execute(
      "SELECT * FROM userss WHERE email=?",
      [cleanEmail]
    );

    if (existing.length > 0) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    // mobile validation
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ msg: "Invalid mobile number" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ TEMP STORE (DB me nahi)
    tempUsers[cleanEmail] = {
      name,
      email: cleanEmail,
      password: hashed,
      role: role || "seller",
      phone,
      otp,
      createdAt: Date.now()
    };

    console.log("TEMP USER:", tempUsers[cleanEmail]);

    // mail send
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: cleanEmail,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    });

    res.json({ msg: "OTP sent successfully" });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});
app.post("/api/loging", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [user] = await db.execute("SELECT * FROM userss WHERE email=?", [email]);

    if (user.length === 0) return res.status(400).json({ msg: "User not found" });

    const valid = await bcrypt.compare(password, user[0].password);
    if (!valid) return res.status(400).json({ msg: "Invalid credentials" });

    if (!user[0].is_verified) {
      return res.status(400).json({ msg: "Please verify email first" });
    }

    const token = jwt.sign({ id: user[0].id, role: user[0].role }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({ msg: "Loging success", token, role: user[0].role, name: user[0].name });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

app.post("/api/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const [existing] = await db.execute(
      "SELECT * FROM userss WHERE email=?",
      [email]
    );

    if (existing.length === 0) {
      return res.status(400).json({ msg: "Please signup first" });
    }

    const [result] = await db.execute(
      "UPDATE userss SET otp=? WHERE email=?",
      [otp, email]
    );

    console.log("UPDATE RESULT:", result);

    //  DEBUG (important)
    console.log("Sending OTP:", otp);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    });

    res.json({ msg: "OTP sent" });

  } catch (err) {
    console.log(" SEND OTP ERROR:", err); //  yeh dekhna
    res.status(500).json({ msg: "Error sending OTP" });
  }
});
app.post("/api/verify-register", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = tempUsers[email];

    if (!user) {
      return res.status(400).json({ msg: "No registration found" });
    }

    // OTP expiry (5 min)
    if (Date.now() - user.createdAt > 5 * 60 * 1000) {
      delete tempUsers[email];
      return res.status(400).json({ msg: "OTP expired" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    // ✅ FINAL DB INSERT
    await db.execute(
      "INSERT INTO userss (name, email, password, role, phone, is_verified) VALUES (?,?,?,?,?,1)",
      [user.name, user.email, user.password, user.role, user.phone]
    );

    // ✅ temp delete
    delete tempUsers[email];

    res.json({ msg: "Signup complete ✅" });

  } catch (err) {
    console.log("VERIFY ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});
// import crypto from "crypto";
app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const [user] = await db.execute(
      "SELECT * FROM userss WHERE email=?",
      [email]
    );

    if (user.length === 0) {
      return res.status(400).json({ msg: "Email not found ❌" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await db.execute(
      "UPDATE userss SET otp=? WHERE email=?",
      [otp, email]
    );

    await transporter.sendMail({
      to: email,
      subject: "Reset OTP",
      text: `Your OTP is ${otp}`,
    });

    res.json({ msg: "OTP sent ✅" });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});
app.post("/api/reset-password", async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await db.execute(
    "UPDATE userss SET password=?, otp=NULL WHERE email=?",
    [hashed, email]
  );

  res.json({ msg: "Password updated ✅" });
});
app.post("/api/verify-forgot-otp", async (req, res) => {
  const { email, otp } = req.body;

  const [user] = await db.execute(
    "SELECT * FROM userss WHERE email=? AND otp=?",
    [email, otp]
  );

  if (user.length === 0) {
    return res.status(400).json({ msg: "Invalid OTP ❌" });
  }

  res.json({ msg: "OTP verified ✅" });
});
app.get("/admin-check", auth, (req, res) => {
  return res.json({ msg: "You are authenticated", user: req.user });
});
app.get("/api/admin/users", auth, async (req, res) => {
  try {
    const [users] = await db.execute(
      "SELECT id, name, email, role,  created_at FROM userss ORDER BY id DESC"
    );

    return res.json(users);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
});
app.delete("/api/admin/users/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM userss WHERE id = ?", [id]);
    return res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
});
app.put("/api/admin/users/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    await db.execute(
      "UPDATE userss SET name = ?, email = ?, role = ? WHERE id = ?",
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
    { name: "images", maxCount: 10 },
    { name: "documents", maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      const { title, type, subtype, description, estimated_price, location } = req.body;
      const seller_id = req.user.id;

      const images = req.files.images ? req.files.images.map(f => f.filename) : [];

      const documents = req.files.documents ? req.files.documents.map(f => f.filename) : [];
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
// app.get("/property/my", auth, async (req, res) => {
//   try {
//     const seller_id = req.user.id;

//     const [rows] = await db.execute(
//       "SELECT * FROM propertie WHERE seller_id=? ORDER BY id DESC",
//       [seller_id]
//     );

//     // prepend uploads path for frontend
//     const data = rows.map(row => ({
//       ...row,
//       image_url: row.image ? `${BASE_URL}/uploads/${row.image}` : null
//     }));

//     return res.json(data);

//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ msg: "Server error" });
//   }
// });
app.post("/api/investors", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      property_type,
      bhk,
      area,
      location,
      price_range
    } = req.body;

    await db.execute(
      `INSERT INTO investorss 
      (name, email, phone, property_type, bhk, area, location, price_range)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, property_type, bhk, area, location, price_range]
    );

    res.json({ msg: "saved successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});
app.get("/api/locations", async (req, res) => {
  try {
    const search = req.query.search || "";

    const [rows] = await db.execute(
      `
      SELECT location FROM (
        SELECT DISTINCT location FROM investorss
        UNION
        SELECT DISTINCT CONCAT(city, ', ', locality) AS location FROM properties
      ) AS all_locations
      WHERE location LIKE ?
      
      ORDER BY 
        CASE 
          WHEN location LIKE ? THEN 1   -- starts with (top)
          WHEN location LIKE ? THEN 2   -- word match
          ELSE 3
        END,
        location ASC

      LIMIT 7
      `,
      [
        `%${search}%`,     // contains
        `${search}%`,      // starts with
        `% ${search}%`     // word match (like "Sector 62")
      ]
    );

    res.json(rows.map(r => r.location));

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error" });
  }
});
app.get("/api/admin/investorss", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM investorss ORDER BY created_at DESC"
    );

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching investors" });
  }
});
app.delete("/api/admin/investorss/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute("DELETE FROM investorss WHERE id = ?", [id]);

    res.json({ msg: "Investor deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Delete error" });
  }
});
app.post("/api/buyer-leads", async (req, res) => {
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
app.delete("/api/inquiries/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute("DELETE FROM buyerleads WHERE id = ?", [id]);

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/api/inquiries", auth, async (req, res) => {
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
        p.property_type AS property_title,
        u.name AS seller_name
      FROM buyerleads bl
      JOIN properties p ON bl.property_id = p.id
      JOIN userss u ON p.seller_id = u.id
      ORDER BY bl.id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
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
app.get("/api/seller/dashboard-stats", auth, async (req, res) => {
  try {

    if (req.user.role !== "seller")
      return res.status(403).json({ message: "Access denied" });

    const sellerId = req.user.id;

    const [totalProperties] = await db.execute(
      "SELECT COUNT(*) AS total FROM properties WHERE seller_id=?",
      [sellerId]
    );

    const [totalInquiries] = await db.execute(`
      SELECT COUNT(*) AS total
      FROM buyerleads bl
      JOIN properties p ON bl.property_id=p.id
      WHERE p.seller_id=?
    `, [sellerId]);

    const [propertyTypes] = await db.execute(`
      SELECT property_type AS type, COUNT(*) AS count
      FROM properties
      WHERE seller_id=?
      GROUP BY property_type
    `, [sellerId]);

    const [monthlyInquiries] = await db.execute(`
      SELECT MONTH(bl.created_at) AS month, COUNT(*) AS count
      FROM buyerleads bl
      JOIN properties p ON bl.property_id=p.id
      WHERE p.seller_id=?
      GROUP BY MONTH(bl.created_at)
      ORDER BY month
    `, [sellerId]);

    res.json({
      totalProperties: totalProperties[0].total,
      totalInquiries: totalInquiries[0].total,
      propertyTypes,
      monthlyInquiries
    });

  } catch (err) {
    console.error("Seller Dashboard Error:", err);
    res.status(500).json({ message: "Seller dashboard failed" });
  }
});
app.post(
  "/api/seller/properties",
  auth,
  upload.array("media", 10),
  async (req, res) => {
    try {
      const data = JSON.parse(req.body.data || "{}");
      const media = req.files?.map(f => "/uploads/" + f.filename) || [];
      const cleanData = {
        ownership:
          data.ownership && data.ownership.trim() !== ""
            ? data.ownership
            : "freehold", // default value

        washrooms:
          data.washrooms && data.washrooms !== ""
            ? data.washrooms
            : null,
        distressed:
          data.distressed && data.distressed !== ""
            ? data.distressed
            : null,

        //  Convert booleans properly
        price_negotiable: data.price_negotiable ? 1 : 0,
        all_inclusive_price:
          data.all_inclusive_price === "on" || data.all_inclusive_price === true
            ? 1
            : 0,
        tax_excluded: data.tax_excluded ? 1 : 0,
      };

      const sql = `
        INSERT INTO properties (
          looking_to, property_type, property_subtype,
          city, locality, sub_locality, society, house_no, pincode,
          bhk, bathrooms, balconies,
          carpet_area, builtup_area, super_builtup_area, area_unit,
          floor_no, total_floors, furnishing, availability_status,
          ownership, property_age, expected_price, price_per_sqft,
          price_negotiable, all_inclusive_price, tax_excluded,
          description, media, amenities, washrooms, distressed, is_completed, status, seller_id
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `;

      const values = [
        data.looking_to || "sell",
        // data.looking_to || null,
        data.property_type || null,
        data.property_subtype || null,
        data.city || null,
        data.locality || null,
        data.sub_locality || null,
        data.society || null,
        data.house_no || null,
        data.pincode || null,
        data.bhk || null,
        data.bathrooms || null,
        data.balconies || null,
        data.carpet_area || null,
        data.builtup_area || null,
        data.super_builtup_area || null,
        data.area_unit || null,
        data.floor_no || null,
        data.total_floors || null,
        data.furnishing || null,
        data.availability_status || null,

        //  FIXED ownership
        cleanData.ownership,

        data.property_age || null,
        data.expected_price || null,
        data.price_per_sqft || null,

        //  FIXED booleans
        cleanData.price_negotiable,
        cleanData.all_inclusive_price,
        cleanData.tax_excluded,

        data.description || null,

        JSON.stringify(media),
        JSON.stringify(data.amenities || []),
        cleanData.washrooms,
        cleanData.distressed,

        1,
        "pending",
        req.user.id
      ];

      const [result] = await db.execute(sql, values);

      res.json({ success: true, property_id: result.insertId });

    } catch (err) {
      console.error("Property Insert Error:", err); 
      res.status(500).json({ error: err.message });
    }
  }
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/api/properties", async (req, res) => {
  try {
    const { type } = req.query; // residential | commercial

    let sql = `
      SELECT *
      FROM properties
      WHERE is_completed = 1
    `;

    const params = [];
    // filter by property type
    if (type) {
      sql += " AND property_type = ?";
      params.push(type);
    }
    sql += " ORDER BY created_at DESC";
    const [rows] = await db.execute(sql, params);
    /* ---------- MEDIA PARSER SAFE ---------- */
    const safeParseMedia = (media) => {
      if (!media) return [];

      // if already array
      if (Array.isArray(media)) {
        return media.map(m => ({
          url: m.startsWith("/uploads") ? `${BASE_URL}${m}` : m,
          type: m.endsWith(".mp4") ? "video" : "image"
        }));
      }

      // if string
      if (typeof media === "string") {
        try {
          const parsed = JSON.parse(media);

          if (Array.isArray(parsed)) {
            return parsed.map(m => ({
              url: m.startsWith("/uploads") ? `${BASE_URL}${m}` : m,
              type: m.endsWith(".mp4") ? "video" : "image"
            }));
          }

        } catch {
          return [{
            url: media.startsWith("/uploads") ? `${BASE_URL}${media}` : media,
            type: media.endsWith(".mp4") ? "video" : "image"
          }];
        }
      }

      return [];
    };

    /* ---------- AMENITIES PARSER ---------- */
    const safeParseAmenities = (a) => {
      if (!a) return [];
      if (Array.isArray(a)) return a;
      try { return JSON.parse(a); }
      catch { return []; }
    };

    /* ---------- FINAL RESPONSE ---------- */
    const data = rows.map(p => ({
      id: p.id,
      property_type: p.property_type,
      property_subtype: p.property_subtype,
      city: p.city,
      locality: p.locality,
      sub_locality: p.sub_locality,
      society: p.society,
      house_no: p.house_no,
      pincode: p.pincode,
      bhk: p.bhk,
      bathrooms: p.bathrooms,
      washrooms: p.washrooms,
      super_builtup_area: p.super_builtup_area,
      area_unit: p.area_unit,
      expected_price: p.expected_price,
      description: p.description,
      furnishing: p.furnishing,
        distressed: p.distressed,
      media: safeParseMedia(p.media),
      amenities: safeParseAmenities(p.amenities),
      created_at: p.created_at
    }));

    res.json(data);

  } catch (err) {
    console.error("GET PROPERTIES ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
app.get("/api/admin/properties", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const [rows] = await db.execute(`
      SELECT p.*, 
             u.name AS seller_name, 
             u.email AS seller_email
      FROM properties p
      LEFT JOIN userss u ON p.seller_id = u.id
      ORDER BY p.created_at DESC
    `);
    // const safeParse = (val) => {
    //   try {
    //     return val ? JSON.parse(val) : [];
    //   } catch {
    //     return [];
    //   }
    // };
    const safeParse = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;

      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    };
    const data = rows.map((p) => ({
      id: p.id,
      looking_to: p.looking_to,
      property_type: p.property_type,
      property_subtype: p.property_subtype,

      location: [

        p.city,
        p.locality,
        p.sub_locality,
        p.society,
        p.house_no

      ]
        .filter(Boolean)
        .join(", "),
      pincode: p.pincode,

      bhk: p.bhk,
      bathrooms: p.bathrooms,
      balconies: p.balconies,

      carpet_area: p.carpet_area,
      builtup_area: p.builtup_area,
      super_builtup_area: p.super_builtup_area,
      area_unit: p.area_unit,

      floor_no: p.floor_no,
      total_floors: p.total_floors,

      furnishing: p.furnishing,
      availability_status: p.availability_status,
      ownership: p.ownership,
      property_age: p.property_age,

      expected_price: p.expected_price,
      price_per_sqft: p.price_per_sqft,

      price_negotiable: p.price_negotiable,
      all_inclusive_price: p.all_inclusive_price,
      tax_excluded: p.tax_excluded,

      description: p.description,

      media: safeParse(p.media),
      amenities: safeParse(p.amenities),

      washrooms: p.washrooms,
      distressed: p.distressed,
      status: p.status,
      created_at: p.created_at,

      seller_name: p.seller_name || "N/A",
      seller_email: p.seller_email || "N/A"
    }));
    res.json(data);
  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
app.delete("/api/admin/properties/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;
    await db.execute("DELETE FROM properties WHERE id = ?", [id]);

    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    console.error("DELETE PROPERTY ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
app.delete("/api/seller/properties/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;
    await db.execute("DELETE FROM properties WHERE id = ?", [id]);

    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    console.error("DELETE PROPERTY ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
app.put("/api/admin/properties/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      property_type, property_subtype, expected_price, description, city,
      locality,
      sub_locality,
      society,
      house_no,
      looking_to,
      pincode,
      price_per_sqft,
      bhk,
      bathrooms,
      balconies,
      carpet_area,
      builtup_area,
      super_builtup_area,
      area_unit,
      floor_no,
      total_floors,
      furnishing,
      availability_status,
      ownership,
      property_age,
      washrooms,
      distressed,
      status
    } = req.body;

    await db.execute(
      `UPDATE properties SET 
      
        property_type=?,
        property_subtype=?,
                expected_price=?,
                 description=?,
          city=?,
  locality=?,
  sub_locality=?,
  society=?,
  house_no=?,
        looking_to=?,
        pincode=?,
        price_per_sqft=?,
        bhk=?,
        bathrooms=?,
        balconies=?,
        carpet_area=?,
        builtup_area=?,
        super_builtup_area=?,
        area_unit=?,
        floor_no=?,
        total_floors=?,
        furnishing=?,
        availability_status=?,
        ownership=?,
        property_age=?,
        washrooms=?,
        distressed=?,
        status=?
        
      WHERE id=?`,
      [

        property_type, property_subtype, expected_price, description, city,
        locality,
        sub_locality,
        society,
        house_no,
        looking_to,
        pincode,
        price_per_sqft,
        bhk,
        bathrooms,
        balconies,
        carpet_area,
        builtup_area,
        super_builtup_area,
        area_unit,
        floor_no,
        total_floors,
        furnishing,
        availability_status,
        ownership,
        property_age,
        washrooms,
        distressed,
        status,
        id
      ]
    );

    res.json({ msg: "Updated Successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error" });
  }
});
app.put("/api/admin/properties/:id/status", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;
    const [rows] = await db.execute("SELECT status FROM properties WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ message: "Property not found" });

    const currentStatus = rows[0].status;
    let newStatus;

    if (currentStatus === "pending") newStatus = "approved";
    else if (currentStatus === "approved") newStatus = "pending";
    else newStatus = "pending"; // default for rejected

    await db.execute("UPDATE properties SET status = ? WHERE id = ?", [newStatus, id]);

    res.json({ message: `Property status changed to ${newStatus}` });
  } catch (err) {
    console.error("TOGGLE PROPERTY STATUS ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
app.put("/api/admin/properties/:id/approve", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;

    await db.execute("UPDATE properties SET status = 'approved' WHERE id = ?", [id]);

    res.json({ message: "Property approved" });
  } catch (err) {
    console.error("APPROVE PROPERTY ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
app.put("/api/admin/properties/:id/reject", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;

    await db.execute("UPDATE properties SET status = 'rejected' WHERE id = ?", [id]);

    res.json({ message: "Property rejected" });
  } catch (err) {
    console.error("REJECT PROPERTY ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
app.get("/api/properties/filter", async (req, res) => {
  try {
    const {
      property_type,
      property_subtype,
      bhk,
       distressed,
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
 if (distressed) {
  sql += " AND distressed = ?";
  values.push(distressed);
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

    const [rows] = await db.execute(sql, values);

    // SAME formatting as /api/properties
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
          ? `${BASE_URL}${url}`
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

    const [rows] = await db.execute(sql, [`${q}%`]);

    res.json(rows.map(r => r.city));
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});
app.get("/api/seller/properties", auth, async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Access denied" });
    }
    const sellerId = req.user.id;
    const [rows] = await db.execute(
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
      property_type: p.property_type,
      property_subtype: p.property_subtype,

      location: [

        p.city,
        p.locality,
        p.sub_locality,
        p.society,
        p.house_no

      ]
        .filter(Boolean)
        .join(", "), pincode: p.pincode,
      price_per_sqft: p.price_per_sqft,
      bhk: p.bhk,
      bathrooms: p.bathrooms,
      balconies: p.balconies,
      carpet_area: p.carpet_area,
      builtup_area: p.builtup_area,
      super_builtup_area: p.super_builtup_area,
      area_unit: p.area_unit,
      floor_no: p.floor_no,
      total_floors: p.total_floors,
      furnishing: p.furnishing,
      availability_status: p.availability_status,
      ownership: p.ownership,
      property_age: p.property_age,

      expected_price: p.expected_price,
      price_per_sqft: p.price_per_sqft,

      price_negotiable: p.price_negotiable,
      all_inclusive_price: p.all_inclusive_price,
      tax_excluded: p.tax_excluded,
      description: p.description,
      media: safeJsonParse(p.media),

      washrooms: p.washrooms,
distressed: p.distressed,

      status: p.status,
      media: safeJsonParse(p.media),
      created_at: p.created_at,
    }));

    res.json(data);
  } catch (err) {
    console.error("SELLER PROPERTIES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
const frontendBuildPath =
  process.env.FRONTEND_BUILD_PATH || path.join(__dirname, "public");
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

app.post("/api/admin/media", upload.single("video"), async (req, res) => {
  try {
    const {
      service_name,
      title,
      description,
      type,
      textContent
    } = req.body;

    // Validation
    if (!service_name || !title || !type) {
      return res.status(400).json({
        msg: "Service, Title aur Type required hai"
      });
    }

    let mediaUrl = null;

    if (type === "video") {
      if (!req.file) {
        return res.status(400).json({
          msg: "Video file required"
        });
      }
      mediaUrl = "/uploads/" + req.file.filename;
    }
    const textData = type === "text" ? textContent : null;
    await db.execute(
      `INSERT INTO adviservices 
      (service_name, title, description, type, text_content, media_url) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [service_name, title, description, type, textData, mediaUrl]
    );

    res.json({ msg: "✅ Uploaded Successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: " Server Error" });
  }
});
app.get("/api/admin/media", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM adviservices ORDER BY id DESC"
    );

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});
app.get("/api/media", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM adviservices ORDER BY created_at DESC"
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});
app.get("/api/advisory/:name", async (req, res) => {
  try {
    const service = decodeURIComponent(req.params.name);

    const [rows] = await db.execute(
      "SELECT * FROM adviservices WHERE service_name = ?",
      [service]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ msg: "All required fields missing" });
    }
    const sql = `
      INSERT INTO contact (name, email, phone, message)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      name.trim(),
      email.trim(),
      phone ? phone.trim() : null,
      message.trim()
    ]);

    console.log("Contact Saved ID:", result.insertId);

    res.status(201).json({
      msg: "Message saved successfully ✅"
    });

  } catch (err) {
    console.error(" Contact API Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});
app.get("/api/contact", async (req, res) => {
  try {
    const sql = "SELECT * FROM contact ORDER BY id DESC";

    const [rows] = await db.execute(sql);

    res.status(200).json(rows);

  } catch (err) {
    console.error("GET Contact Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});
app.delete("/api/contact/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute("DELETE FROM contact WHERE id = ?", [id]);

    res.json({ msg: "Deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Delete failed" });
  }
});
app.post("/api/search", async (req, res) => {
  try {
    const { keyword = "", propertyType = "" } = req.body;

    let sql = `
      SELECT id, property_type, property_subtype, city, locality, expected_price
      FROM properties
      WHERE status='approved'
      AND (
        city LIKE ? 
        OR locality LIKE ?
        OR sub_locality LIKE ?
        OR property_type LIKE ?
        OR property_subtype LIKE ?
      )
    `;

    let params = [
      `%${keyword}%`,
      `%${keyword}%`,
      `%${keyword}%`,
      `%${keyword}%`,
      `%${keyword}%`
    ];

    if (propertyType) {
      sql += ` AND property_type = ?`;
      params.push(propertyType);
    }

    sql += ` ORDER BY created_at DESC`;

    const [rows] = await db.execute(sql, params);

    res.json({ success: true, data: rows });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/search", async (req, res) => {
  try {
    const { keyword = "", tab = "" } = req.query;

    let sql = `
      SELECT *
      FROM properties
      WHERE status = 'approved'
      AND (
        city LIKE ? 
        OR locality LIKE ?
        OR sub_locality LIKE ?
        OR property_type LIKE ?   -- ✅ ADD
        OR property_subtype LIKE ?
      )
    `;

    let params = [
      `%${keyword}%`,
      `%${keyword}%`,
      `%${keyword}%`,
      `%${keyword}%`,
      `%${keyword}%`
    ];

    if (tab === "buy") {
      sql += " AND property_type = 'residential'";
    }

    if (tab === "commercial") {
      sql += " AND property_type = 'commercial'";
    }

    if (tab === "rent") {
      sql += " AND looking_to = 'rent/lease'";
    }

    if (tab === "plots") {
      sql += " AND property_subtype LIKE '%plot%'";
    }

    sql += " ORDER BY created_at DESC";

    const [data] = await db.execute(sql, params);

    res.json(data);

  } catch (err) {
    console.error(" ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message || err);
  if (!res.headersSent) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Server
const PORT = process.env.PORT || 5000;

// app.listen(PORT, "127.0.0.1", () => {
//   console.log(`Backend running on port ${PORT}`);
// });
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));