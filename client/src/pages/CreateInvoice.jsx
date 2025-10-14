import { useState } from 'react';
import { Form, Input, Button, Table, InputNumber, Space, Typography, Card, message, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Layout from "../components/Layout/Layout";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API;

const { Title } = Typography;

const CreateInvoice = () => {
    const [form] = Form.useForm();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const addItem = () => {
        const newItem = {
            key: Date.now(),
            name: '',
            price: 0,
            quantity: 1,
            total: 0
        };
        setItems([...items, newItem]);
    };

    const removeItem = (key) => {
        setItems(items.filter(item => item.key !== key));
    };

    const updateItem = (key, field, value) => {
        const newItems = items.map(item => {
            if (item.key === key) {
                const updatedItem = { ...item, [field]: value };
                if (field === 'price' || field === 'quantity') {
                    updatedItem.total = updatedItem.price * updatedItem.quantity;
                }
                return updatedItem;
            }
            return item;
        });
        setItems(newItems);
    };

    const getTotalAmount = () => {
        return items.reduce((sum, item) => sum + (item.total || 0), 0);
    };

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            render: (text, record) => (
                <Input
                    placeholder="Tên sản phẩm"
                    value={text}
                    required
                    onChange={(e) => updateItem(record.key, 'name', e.target.value)}
                />
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            width: 120,
            render: (text, record) => (
                <InputNumber
                    placeholder="0"
                    value={text}
                    required
                    min={0}
                    onChange={(value) => updateItem(record.key, 'price', value || 0)}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    style={{ width: '100%' }}
                />
            ),
        },
        {
            title: 'SL',
            dataIndex: 'quantity',
            width: 100,
            render: (text, record) => (
                <InputNumber
                    min={1}
                    required
                    value={text}
                    onChange={(value) => updateItem(record.key, 'quantity', value || 1)}
                    style={{ width: '100%' }}
                />
            ),
        },
        {
            title: 'Tổng',
            dataIndex: 'total',
            width: 100,
            render: (text) => (
                <strong>{text?.toLocaleString('vi-VN') || 0}</strong>
            ),
        },
        {
            title: '',
            key: 'action',
            width: 50,
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeItem(record.key)}
                    size="small"
                />
            ),
        },
    ];

    const handleSubmit = async (values) => {
        if (items.length === 0) {
            message.error('Vui lòng thêm sản phẩm!');
            return;
        }

        const hasEmptyNames = items.some(item => !item.name.trim());
        if (hasEmptyNames) {
            toast.error('Vui lòng nhập tên sản phẩm!');
            return;
        } const hasInvalidPrices = items.some(item => !item.price || item.price <= 0);
        if (hasInvalidPrices) {
            message.error('Vui lòng nhập giá hợp lệ cho tất cả sản phẩm!');
            return;
        }
        const hasInvalidQuantities = items.some(item => !item.quantity || item.quantity <= 0);
        if (hasInvalidQuantities) {
            message.error('Vui lòng nhập số lượng hợp lệ cho tất cả sản phẩm!');
            return;
        }

        setLoading(true);
        try {
            const billData = {
                customerName: values.customerName,
                customerPhone: values.customerPhone,
                items: items.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                }))
            };

            const response = await fetch(`${API_URL}/api/v1/export`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(billData),
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Tạo hóa đơn thành công!');
                form.resetFields();
                setItems([]);
                setTimeout(() => {
                    navigate(`/bill/${result.data._id}`);
                }, 500);
            } else {
                // message.error(result.message || 'Có lỗi xảy ra!');
                toast.error(result.message || 'Có lỗi xảy ra!');
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            message.error('Không thể kết nối server!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
                <Card>
                    <Title level={3} style={{ marginBottom: 20, textAlign: 'center' }}>
                        Tạo Hóa Đơn
                    </Title>

                    <Form form={form} onFinish={handleSubmit} layout="vertical">
                        {/* Thông tin khách hàng */}
                        <Form.Item
                            label="Tên khách hàng"
                            name="customerName"
                            rules={[{ required: true, message: 'Nhập tên khách hàng!' }]}
                        >
                            <Input placeholder="Nhập tên khách hàng" />
                        </Form.Item>
                        <Form.Item
                            label="Số điện thoại khách hàng"
                            name="customerPhone"
                            rules={[
                                { required: true, message: 'Nhập số điện thoại khách hàng!' },
                                {
                                    pattern: /^[0-9]{10,11}$/,
                                    message: 'Số điện thoại không hợp lệ (10-11 chữ số)!'
                                }
                            ]}
                        >
                            <Input placeholder="Nhập số điện thoại khách hàng" />
                        </Form.Item>

                        {/* Danh sách sản phẩm */}
                        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                            <Col>
                                <strong>Danh sách sản phẩm</strong>
                            </Col>
                            <Col>
                                <Button
                                    type="dashed"
                                    icon={<PlusOutlined />}
                                    onClick={addItem}
                                    size="middle"
                                >
                                    Thêm
                                </Button>
                            </Col>
                        </Row>

                        <Table
                            columns={columns}
                            dataSource={items}
                            pagination={false}
                            size="small"
                            bordered
                            locale={{ emptyText: 'Chưa có sản phẩm' }}
                            style={{ marginBottom: 16 }}
                        />

                        {/* Tổng tiền */}
                        {items.length > 0 && (
                            <Row justify="end" style={{ marginBottom: 16 }}>
                                <Col>
                                    <div style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        padding: '8px 16px',
                                        backgroundColor: '#f0f0f0',
                                        borderRadius: 4
                                    }}>
                                        Tổng: {getTotalAmount().toLocaleString('vi-VN')} VNĐ
                                    </div>
                                </Col>
                            </Row>
                        )}

                        {/* Nút hành động */}
                        <Row justify="center" gutter={16}>
                            <Col>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                >
                                    Tạo Hóa Đơn
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    onClick={() => {
                                        form.resetFields();
                                        setItems([]);
                                    }}
                                >
                                    Hủy
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </div>
        </Layout>
    );
};

export default CreateInvoice;