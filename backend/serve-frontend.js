const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.FRONTEND_PORT || 5173;

const distPath = path.join(__dirname, '../frontend/dist');

// Serve static assets
app.use(express.static(distPath));

// Fallback to index.html for React Router SPA routes
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` 💻 WaterWatch Frontend running at http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
