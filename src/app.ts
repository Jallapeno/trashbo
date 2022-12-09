import express from 'express';
import cors from 'cors';
import { routes } from './routes';

const app = express();

app.use(express.json());
app.use(cors());

app.use(routes);

// Cath All
app.use((error: any, res: any) => {
    res.status(error.status || 500)
    res.json({
        error: error.message
    })
});

export { app }