import express from 'express';
import { admin, deleteEmployee, updateForm, updateEmployee, addEmployeeForm, addEmployee, assignReview } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/', admin);
router.get('/delete', deleteEmployee);
router.get('/updateForm', updateForm);
router.post('/update', updateEmployee);
router.get('/addEmployee', addEmployeeForm);
router.post('/createEmployee', addEmployee);
router.post('/assignReview', assignReview);

export default router;
