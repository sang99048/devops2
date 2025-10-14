const express = require('express');
const { createExportBillController, getExportBillController, getExportBillByIdController, deleteExportBillController, updateExportBillController } = require('../controllers/exportBill.controller');
const router = express.Router();

router.post('/export', createExportBillController);
router.get('/export', getExportBillController)
router.get('/export/:id', getExportBillByIdController);
router.delete('/export/:id', deleteExportBillController);
router.put('/export/:id', updateExportBillController);

module.exports = router;