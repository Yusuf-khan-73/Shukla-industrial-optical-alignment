const express = require('express');
const { authenticate } = require('../middleware/auth');
const companyController = require('../controllers/companyController');

const router = express.Router();

router.get('/company-info', companyController.getCompanyInfo);
router.get('/admin/company-info', authenticate, companyController.getAdminCompanyInfo);
router.put('/admin/company-info', authenticate, companyController.updateCompanyInfo);

module.exports = router;
