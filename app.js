const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.render('googlemap.ejs');
});

app.listen(3000);