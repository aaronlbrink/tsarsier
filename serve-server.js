/* A static content website server serve script.
 * Created by Aaron Brink.
 * August 13, 2018
 */
var express = require('express');
var app = express();
var path = require('path');

const buildDirPath = path.join(__dirname, '/build/');
app.use(express.static(buildDirPath));

const indexPath = path.join(buildDirPath, 'index.html');
app.get('*', (req, res) => {
  // Um, unfortunately we don’t know how to validate routes within
  // the application. We should fix this to provide a proper 404
  // someday especially if we ever get server-side rendering which
  // really should replace what we have here.
  res.sendFile(indexPath);
});

app.listen(3000);
