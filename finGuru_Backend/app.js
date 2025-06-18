const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const userStocks = require('./routes/stockRecommendation');
const taxRoutes = require('./routes/tax');
const taxOptimizationRoutes = require('./routes/taxOptimization');
const classifyRoutes = require('./routes/classify'); 

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,

}));



app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/stock-recommendation', userStocks);
app.use('/api/user', taxRoutes);
app.use("/api/tax-optimization", taxOptimizationRoutes);
app.use('/api', classifyRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
