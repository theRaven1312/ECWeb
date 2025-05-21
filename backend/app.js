import express from 'express';
import mongoose, { mongo } from 'mongoose';
import 'dotenv/config';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import Product from './models/product.model.js';
import productsRouter from './routes/product.routes.js';
import cors from 'cors';


const app = express();
const api = process.env.API_URL;

app.use(cors());
app.options('*', cors());

// Middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));

// Routes
app.use(`${api}/products`, productsRouter)


// Database connection
mongoose.connect(process.env.DB_URI )
.then(() => {console.log('Database connection is ready')})
.catch((err) => {console.log(err)})

app.listen(3000, () => {
    console.log(api);
    console.log('Server is running http://localhost:3000');
})














// const dotenv = require('dotenv');
// const path = require('path');


// dotenv.config();

// require('./config/db');

// const authRoutes = require('./routes/auth');
// const productRoutes = require('./routes/products');
// const cartRoutes = require('./routes/cart');
// const orderRoutes = require('./routes/orders');
// const paymentRoutes = require('./routes/payments');
// const app = express();

// app.use(express.json());
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
// }

// app.use(helmet());

// app.use(cors());

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/payments', paymentRoutes);

// app.use(require('./middleware/errorHandler'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
// console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// });

// process.on('unhandledRejection', (err, promise) => {
//     console.log(`Error: ${err.message}`);
//     process.exit(1);
// });


