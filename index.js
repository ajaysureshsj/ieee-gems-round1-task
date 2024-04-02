const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database("./database.db");

//Invitations table
db.run(`CREATE TABLE IF NOT EXISTS invitations (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  alternate_email TEXT,
  organization_name TEXT,
  role_in_organization TEXT,
  valid_till DATE
)`);

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT
)`);

// API: Invitation (private)
app.post("/invitation", (req, res) => {
  const { name, email, phone, alternate_email, organizations } = req.body;

  // Generate a unique ID for the invitation
  const invitationId = uuidv4();

  db.run(
    `INSERT INTO invitations (id, name, email, phone, alternate_email, organization_name, role_in_organization, valid_till) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      invitationId,
      name,
      email,
      phone,
      alternate_email,
      organizations?.organization_name,
      organizations?.role_in_organization,
      organizations?.valid_till,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      // Respond with the unique ID
      res.json({ id: invitationId });
    }
  );
});

// API: Sign up (public)
app.post("/signup", (req, res) => {
  const { id, password } = req.body;

  // Validate the invitation ID
  db.get("SELECT * FROM invitations WHERE id = ?", [id], (err, invitation) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!invitation) {
      return res.status(404).json({ error: "Invitation not found" });
    }

    // Create a new user account
    db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [invitation.email, password],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Sign up successful" });
      }
    );
  });
});

// API: Login (public)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Retrieve user details from the database
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check password
    if (user.password === password) {
      // Passwords match, login successful
      res.json({ message: "Login successful", user });
    } else {
      // Passwords do not match
      res.status(401).json({ error: "Invalid password" });
    }
  });
});

// API: Logout (private)
app.post("/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});

// API: Edit user (private)
app.put("/edit-user", (req, res) => {
  const { email, newPassword, newDetails } = req.body;

  // Update user's password if provided
  if (newPassword) {
    db.run(
      "UPDATE users SET password = ? WHERE email = ?",
      [newPassword, email],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
      }
    );
  }

  // Update user's details if provided
  if (newDetails) {
    const { name, phone, alternate_email } = newDetails;
    db.run(
      "UPDATE users SET name = ?, phone = ?, alternate_email = ? WHERE email = ?",
      [name, phone, alternate_email, email],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
      }
    );
  }

  res.json({ message: "User details updated successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
