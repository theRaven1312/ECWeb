import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import "dotenv/config";
import productsRouter from './routes/product.routes.js';
import cors from 'cors';


const app = express();
const api = process.env.API_URL;

app.use(cors({
    origin: '*'
}));

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
