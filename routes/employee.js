import express from 'express';
import { employee, addReview } from '../controllers/employee.controller.js';

const router = express.Router();

router.get('/', employee);
router.post('/addReview', addReview);

export default router;
