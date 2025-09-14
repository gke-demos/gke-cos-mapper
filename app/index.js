const express = require('express');
const path = require('path');
const app = express();

// Define the port. Use the PORT environment variable provided by Cloud Run,
// or default to 8080 for local testing.
const PORT = process.env.PORT || 8080;

// Define the path to our static files. The Dockerfile will place the HTML file here.
const staticAssetsPath = path.join(__dirname, 'static');

// Serve static assets from the /static directory
app.use(express.static(staticAssetsPath));

// All other routes will serve the index.html file, allowing the app to load.
// This ensures that any request sends back our single-page application.
app.get('*', (req, res) => {
  res.sendFile(path.join(staticAssetsPath, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log('Serving static files from:', staticAssetsPath);
});
