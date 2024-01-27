const expresss = require('express');
const app = expresss();
const path = require('path');
const { logger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;


app.use(logger)

app.use(expresss.json())

app.use('/', expresss.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root.js'))

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not found' })
  } else {
    res.type('txt').send('404 Not found')
  }
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
