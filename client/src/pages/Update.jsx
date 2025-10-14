import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Table, InputNumber, Typography, Card, message, Row, Col, Spin } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Layout from "../components/Layout/Layout";
import toast from 'react-hot-toast';
const { Title } = Typography;
const API_URL = import.meta.env.VITE_API;

const UpdateInvoice = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [bill, setBill] = useState(null);

    useEffect(() => {
        fetchBillDetail();
    }, [id]);

    const fetchBillDetail = async () => {
        try {
            const response = await fetch(`${API_URL}/api/v1/export/${id}`);
            const result = await response.json();

            if (result.success) {
                const billData = result.data;
                setBill(billData);

                form.setFieldsValue({
                    customerName: billData.customerName,
                    customerPhone: billData.customerPhone
                });

                const itemsWithKeys = billData.items.map((item, index) => ({
                    ...item,
                    key: Date.now() + index,
                    total: item.price * item.quantity
                }));
                setItems(itemsWithKeys);
            } else {
                message.error('Không thể tải thông tin hóa đơn');
                navigate('/list');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Có lỗi xảy ra khi tải hóa đơn');
            navigate('/list');
        } finally {
            setLoading(false);
        }
    };

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
            width: '40%',
            render: (text, record) => (
                <Input
                    placeholder="Tên sản phẩm"
                    value={text}
                    required
                    size="small"
                    onChange={(e) => updateItem(record.key, 'name', e.target.value)}
                />
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            width: '25%',
            render: (text, record) => (
                <InputNumber
                    placeholder="0"
                    value={text}
                    required
                    min={0}
                    size="small"
                    onChange={(value) => updateItem(record.key, 'price', value || 0)}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    style={{ width: '100%' }}
                />
            ),
        },
        {
            title: 'SL',
            dataIndex: 'quantity',
            width: '15%',
            render: (text, record) => (
                <InputNumber
                    min={1}
                    required
                    value={text}
                    size="small"
                    onChange={(value) => updateItem(record.key, 'quantity', value || 1)}
                    style={{ width: '100%' }}
                />
            ),
        },
        {
            title: 'Tổng',
            dataIndex: 'total',
            width: '15%',
            render: (text) => (
                <strong style={{ fontSize: '13px' }}>
                    {text?.toLocaleString('vi-VN') || 0}
                </strong>
            ),
        },
        {
            title: '',
            key: 'action',
            width: '5%',
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
        }

        const hasInvalidPrices = items.some(item => !item.price || item.price <= 0);
        if (hasInvalidPrices) {
            message.error('Vui lòng nhập giá hợp lệ cho tất cả sản phẩm!');
            return;
        }

        const hasInvalidQuantities = items.some(item => !item.quantity || item.quantity <= 0);
        if (hasInvalidQuantities) {
            message.error('Vui lòng nhập số lượng hợp lệ cho tất cả sản phẩm!');
            return;
        }

        setSubmitting(true);
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

            const response = await fetch(`${API_URL}/api/v1/export/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(billData),
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Cập nhật hóa đơn thành công!');
                setTimeout(() => {
                    navigate(`/bill/${id}`);
                }, 500);
            } else {
                toast.error(result.message || 'Có lỗi xảy ra!');
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            message.error('Không thể kết nối server!');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" tip="Đang tải thông tin hóa đơn..." />
                </div>
            </Layout>
        );
    }

    return (
        <Layout title={'Chỉnh Sửa Hóa Đơn'}>
            <div style={{
                padding: '16px',
                maxWidth: '1200px',
                margin: '0 auto',
                minHeight: '100vh'
            }}>
                <Card style={{
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                        <Col>
                            <Title
                                level={3}
                                style={{
                                    margin: 0,
                                    fontSize: 'clamp(18px, 4vw, 24px)'
                                }}
                            >
                                Chỉnh Sửa Hóa Đơn {bill?.billNumber}
                            </Title>
                        </Col>
                        <Col>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={() => navigate(`/bill/${id}`)}
                            >
                                Quay lại
                            </Button>
                        </Col>
                    </Row>

                    <Form form={form} onFinish={handleSubmit} layout="vertical">
                        {/* Thông tin khách hàng */}
                        <Row gutter={[16, 0]}>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item
                                    label="Tên khách hàng"
                                    name="customerName"
                                    rules={[{ required: true, message: 'Nhập tên khách hàng!' }]}
                                >
                                    <Input
                                        placeholder="Nhập tên khách hàng"
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item
                                    label="Số điện thoại"
                                    name="customerPhone"
                                    rules={[
                                        { required: true, message: 'Nhập số điện thoại!' },
                                        {
                                            pattern: /^[0-9]{10,11}$/,
                                            message: 'Số điện thoại không hợp lệ (10-11 chữ số)!'
                                        }
                                    ]}
                                >
                                    <Input
                                        placeholder="Nhập số điện thoại"
                                        size="large"
                                        maxLength={11}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Danh sách sản phẩm */}
                        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                            <Col>
                                <strong style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>
                                    Danh sách sản phẩm
                                </strong>
                            </Col>
                            <Col>
                                <Button
                                    type="dashed"
                                    icon={<PlusOutlined />}
                                    onClick={addItem}
                                    size="middle"
                                    style={{ fontSize: '12px' }}
                                >
                                    Thêm
                                </Button>
                            </Col>
                        </Row>

                        <div style={{ overflowX: 'auto' }}>
                            <Table
                                columns={columns}
                                dataSource={items}
                                pagination={false}
                                size="small"
                                bordered
                                locale={{ emptyText: 'Chưa có sản phẩm' }}
                                style={{ marginBottom: 16, minWidth: '600px' }}
                                scroll={{ x: 600 }}
                            />
                        </div>

                        {/* Tổng tiền */}
                        {items.length > 0 && (
                            <Row justify="end" style={{ marginBottom: 16 }}>
                                <Col xs={24} sm={12} md={8}>
                                    <div style={{
                                        fontSize: 'clamp(14px, 3vw, 16px)',
                                        fontWeight: 'bold',
                                        padding: '5px 10px',
                                        backgroundColor: '#f0f0f0',
                                        borderRadius: 6,
                                        textAlign: 'center'
                                    }}>
                                        Tổng: {getTotalAmount().toLocaleString('vi-VN')} VNĐ
                                    </div>
                                </Col>
                            </Row>
                        )}

                        {/* Nút hành động */}
                        <Row justify="center" gutter={[16, 16]}>
                            <Col xs={24} sm={12} md={6}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={submitting}
                                    icon={<SaveOutlined />}
                                    size="middle"
                                    block
                                >
                                    Lưu thay đổi
                                </Button>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Button
                                    onClick={() => navigate(`/bill/${id}`)}
                                    size="middle"
                                    block
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

export default UpdateInvoice;