const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

// MySQL Pool
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "synx_platform"
});

// Check DB Connection
async function testDB() {
  try {
    const connection = await db.getConnection();
    console.log("✅ MySQL Connected!");
    connection.release();
  } catch (err) {
    console.log("❌ MySQL Connection Failed:", err);
  }
}

testDB();

// Middleware
app.use(cors());
app.use(express.json());

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

    const [existing] = await db.execute("SELECT * FROM users WHERE email=?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)",
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
    const [user] = await db.execute("SELECT * FROM users WHERE email=?", [email]);

    if (user.length === 0) return res.status(400).json({ msg: "User not found" });

    const valid = await bcrypt.compare(password, user[0].password);
    if (!valid) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user[0].id, role: user[0].role }, "SECRETKEY", { expiresIn: "7d" });

    return res.json({ msg: "Loging success", token, role: user[0].role,name: user[0].name });
 

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
app.get("/admin/users", async (req, res) => {
  try {
    const [users] = await db.execute(
      "SELECT id, name, email, role, status, created_at FROM users ORDER BY id DESC"
    );

    return res.json(users);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
});
 


// Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
