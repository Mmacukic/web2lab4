const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000; 

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Store comments and access control settings in memory
let comments = [];
let xssProtectionEnabled = false;
let accessControlEnabled = false;

// Middleware for access control
function accessControlMiddleware(req, res, next) {
  if (accessControlEnabled && req.query.user !== 'admin') {
    return res.send("Access Denied: Only admin can view this page.");
  }
  next();
}

// Route for homepage with XSS vulnerability
app.get('/', (req, res) => {
  res.render('index', { comments, xssProtectionEnabled, accessControlEnabled });
});

// Handle comment submissions
app.post('/add-comment', (req, res) => {
  let comment = req.body.comment;
  // Apply XSS protection if enabled
  if (xssProtectionEnabled) {
    comment = comment.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  comments.push(comment);
  res.redirect('/');
});
app.post('/remove-comments', (req, res) => {
  
  comments = [];
  res.redirect('/');
});

// Admin route with access control vulnerability
app.get('/admin', accessControlMiddleware, (req, res) => {
  res.send("Welcome to the admin panel. Only admin should see this!");
});

// Toggle XSS Protection
app.post('/toggle-xss', (req, res) => {
  xssProtectionEnabled = !xssProtectionEnabled;
  res.redirect('/');
});

// Toggle Access Control
app.post('/toggle-access-control', (req, res) => {
  accessControlEnabled = !accessControlEnabled;
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});