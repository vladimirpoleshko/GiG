const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const staticPath = path.join(__dirname, 'public_html');

express()
  .use(express.static(staticPath))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
