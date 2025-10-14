const mongoose = require('mongoose');

const exportSchema = new mongoose.Schema({
    billNumber: {
        type: String,
        unique: true,
        default: function () {
            // Tạo mã hóa đơn: XB + timestamp + random
            return 'XB' + Date.now() + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        }
    },
    customerName: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); // Kiểm tra số điện thoại 10 chữ số
            },
            message: props => `${props.value} không phải là số điện thoại hợp lệ!`
        }
    },
    items: [{
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        total: {
            type: Number,
            default: 0
        }
    }],
    totalAmount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware tính toán tự động trước khi save
exportSchema.pre('save', function (next) {
    // Tính total cho từng item
    this.items.forEach(item => {
        item.total = item.price * item.quantity;
    });

    // Tính tổng tiền
    this.totalAmount = this.items.reduce((sum, item) => sum + item.total, 0);

    next();
});

const ExportBill = mongoose.model('Export', exportSchema);
module.exports = ExportBill;