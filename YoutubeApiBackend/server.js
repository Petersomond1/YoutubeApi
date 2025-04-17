import express from 'express';
import dotenv from 'dotenv';
import mediaRoutes from './routes/mediaRoutes';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/media', mediaRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
