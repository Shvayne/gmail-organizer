import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const FILE_PATH = "./user_data.json";

const readUserData = () => {
  if (fs.existsSync(FILE_PATH)) {
    const data = fs.readFileSync(FILE_PATH);
    return JSON.parse(data);
  }
  return {};
};

const writeUserData = (data) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

app.get("/user/:id/allowed-emails", (req, res) => {
  const data = readUserData();
  const user = data[req.params.id] || {};
  res.json(user.allowedEmails || []);
});

app.post("/user/:id/allowed-emails", (req, res) => {
  const { email } = req.body;
  const data = readUserData();
  const user = data[req.params.id] || { allowedEmails: [] };

  if (!user.allowedEmails.includes(email)) {
    user.allowedEmails.push(email);
    data[req.params.id] = user;
    writeUserData(data);
  }

  res.status(200).json(user.allowedEmails);
});

app.delete("/user/:id/allowed-emails", (req, res) => {
  const { email } = req.body;
  const data = readUserData();
  const user = data[req.params.id] || {};

  if (user) {
    user.allowedEmails = user.allowedEmails.filter(
      (allowedEmail) => allowedEmail !== email
    );
    data[req.params.id] = user;
    writeUserData(data);
    res.status(200).json(user.allowedEmails);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Add new category
app.post("/user/:id/categories", (req, res) => {
  const { categoryName } = req.body;
  const data = readUserData();
  const user = data[req.params.id];

  if (user) {
    if (!user.categories) {
      user.categories = [];
    }

    const newCategory = {
      name: categoryName,
      allowedEmails: [],
    };

    user.categories.push(newCategory);
    writeUserData(data);
    res.status(200).json(user.categories);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Add email address to a category
app.put("/user/:id/categories/:categoryName/emails", (req, res) => {
  const { email } = req.body;
  const data = readUserData();
  const user = data[req.params.id];

  if (user) {
    const category = user.categories.find(
      (cat) => cat.name === req.params.categoryName
    );
    if (category) {
      if (!category.allowedEmails.includes(email)) {
        category.allowedEmails.push(email);
      }
      writeUserData(data);
      res.status(200).json(category);
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Remove email address from a category
app.delete("/user/:id/categories/:categoryName/emails/:email", (req, res) => {
  const data = readUserData();
  const user = data[req.params.id];

  if (user) {
    const category = user.categories.find(
      (cat) => cat.name === req.params.categoryName
    );
    if (category) {
      category.allowedEmails = category.allowedEmails.filter(
        (email) => email !== req.params.email
      );
      writeUserData(data);
      res.status(200).json(category);
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Delete a category
app.delete("/user/:id/categories/:categoryName", (req, res) => {
  const data = readUserData();
  const user = data[req.params.id];

  if (user) {
    user.categories = user.categories.filter(
      (cat) => cat.name !== req.params.categoryName
    );
    writeUserData(data);
    res.status(200).json(user.categories);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.listen(5001, () => console.log("Server is listening on port 5001"));
