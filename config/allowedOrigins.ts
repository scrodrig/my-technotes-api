const developmentOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://my-technotes-webapp.onrender.com',
];

const productionOrigins = ['https://my-technotes-webapp.onrender.com'];
const allowedOriginsNoBloock = process.env.NODE_ENV === 'development' ? developmentOrigins : productionOrigins;

module.exports = allowedOriginsNoBloock;
