import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

const mockUsers = [
  { id: 1, username: "testuser", email: "test@test.com", password: "test123" },
];

const mockTokens = {
  accessToken: "mock_access_token_12345",
  refreshToken: "mock_refresh_token_67890",
};

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Mock server running" });
});

app.post("/api/users/register", (req, res) => {
  const { username, email, password } = req.body;

  console.log("Mock register request:", { username, email });

  const newUser = { id: Date.now(), username, email };
  mockUsers.push(newUser);

  res.status(201).json({
    message: "User registered successfully",
    user: { id: newUser.id, username, email },
    ...mockTokens,
  });
});

app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;

  console.log("Mock login request:", { email });

  const user = mockUsers.find((u) => u.email === email);

  if (!user || password !== "test123") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    message: "Login successful",
    user: { id: user.id, username: user.username, email: user.email },
    ...mockTokens,
  });
});

app.get("/api/users/profile", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  res.json({
    id: 1,
    username: "testuser",
    email: "test@test.com",
    createdAt: new Date().toISOString(),
  });
});

app.post("/api/users/refresh-token", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  res.json({
    accessToken: "new_mock_access_token_" + Date.now(),
  });
});

app.get("/api/weight", (req, res) => {
  res.json({
    entries: [
      {
        _id: "mock_id_1",
        id: 1,
        weight: 70,
        date: new Date().toISOString(),
        notes: "Test entry",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "mock_id_2",
        id: 2,
        weight: 72,
        date: new Date(Date.now() - 86400000).toISOString(),
        notes: "Yesterday entry",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    pagination: { page: 1, limit: 5, total: 2, pages: 1 },
  });
});

app.post("/api/weight", (req, res) => {
  const { weight, date, notes } = req.body;
  res.status(201).json({
    _id: "mock_id_" + Date.now(),
    id: Date.now(),
    weight,
    date,
    notes,
    createdAt: new Date().toISOString(),
  });
});

app.delete("/api/weight/:id", (req, res) => {
  const { id } = req.params;
  console.log("Mock delete request for ID:", id);

  if (!id || id === "undefined") {
    return res.status(400).json({ message: "Invalid ID provided" });
  }

  res.json({ message: "Weight entry deleted successfully", id });
});

app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
