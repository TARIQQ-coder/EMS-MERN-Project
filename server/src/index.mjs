import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route.mjs';
import departmentRoutes from './routes/departments.route.mjs';
import connectDB from './db/db.mjs';
import cookieParser from 'cookie-parser';
import employeeRoutes from './routes/employee.route.mjs';

import leaveRoutes from './routes/leave.route.mjs';


const app = express();
connectDB();
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use("/api/leaves", leaveRoutes);

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}
);






















