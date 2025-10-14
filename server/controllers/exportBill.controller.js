const exportModel = require("../models/export.model");


const createExportBillController = async (req, res) => {
    try {
        // Validate required fields
        const { customerName, customerPhone, items } = req.body;
        if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Customer name and items are required'
            });
        }
        if (!customerPhone || !/^\d{10}$/.test(customerPhone)) {
            return res.status(400).json({
                success: false,
                message: 'Valid customer phone number is required'
            });
        }

        const newBill = new exportModel(req.body);
        await newBill.save();
        res.status(201).json({
            success: true,
            message: 'Export bill created successfully',
            data: newBill
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}
const getExportBillController = async (req, res) => {
    try {
        const exportBills = await exportModel.find();
        res.status(200).json({
            success: true,
            message: 'Export bills fetched successfully',
            data: exportBills
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}
const getExportBillByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const exportBill = await exportModel.findById(id);
        if (!exportBill) {
            return res.status(404).json({
                success: false,
                message: 'Export bill not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Export bill fetched successfully',
            data: exportBill
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })

    }
}
const deleteExportBillController = async (req, res) => {
    try {
        const { id } = req.params;
        const exportBill = await exportModel.findByIdAndDelete(id);
        if (!exportBill) {
            return res.status(404).json({
                success: false,
                message: 'Export bill not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Export bill deleted successfully',

        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}
const updateExportBillController = async (req, res) => {
    try {
        const { id } = req.params;
        const { customerName, customerPhone, items } = req.body;
        if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Customer name and items are required'
            });
        }
        const update = await exportModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!update) {
            return res.status(404).json({
                success: false,
                message: 'Export bill not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Export bill updated successfully',
            data: update
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}
module.exports = {
    createExportBillController,
    getExportBillController,
    getExportBillByIdController,
    deleteExportBillController,
    updateExportBillController
};