import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Popconfirm, message, Spin, Typography, Layout as AntLayout } from 'antd';
import Layout from '../components/Layout/Layout';
const API_URL = import.meta.env.VITE_API;

const { Title } = Typography;
const { Content } = AntLayout;

const ListInvoice = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchBills = async () => {
        try {
            const response = await fetch(`${API_URL}/api/v1/export`);
            const result = await response.json();

            if (result.success) {
                setBills(result.data);
            } else {
                message.error('Lỗi khi tải hóa đơn: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Có lỗi xảy ra khi tải hóa đơn.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, []);

    const deleteBill = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/v1/export/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (result.success) {
                setBills(bills.filter(bill => bill._id !== id));
                message.success('Đã xóa hóa đơn thành công!');
            } else {
                message.error('Lỗi: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Có lỗi xảy ra khi xóa hóa đơn');
        }
    };

    const handleViewBill = (bill) => {
        navigate(`/bill/${bill._id}`);
    };

    const columns = [
        {
            title: 'Mã hóa đơn',
            dataIndex: 'billNumber',
            key: 'billNumber',
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'customerPhone',
            key: 'customerPhone',
        },
        {
            title: 'Số sản phẩm',
            dataIndex: 'items',
            key: 'items',
            render: (items) => items.length,
            align: 'center',
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => `${amount.toLocaleString('vi-VN')} VND`,
            align: 'right',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString('vi-VN'),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <>
                    <Button
                        type="primary"
                        onClick={() => handleViewBill(record)}
                        style={{ marginRight: 8 }}
                    >
                        Xem
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa hóa đơn này?"
                        onConfirm={() => deleteBill(record._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <Layout>
            <Content style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
                <Title level={3}>Danh Sách Hóa Đơn</Title>
                {loading ? (
                    <Spin tip="Đang tải..." />
                ) : bills.length === 0 ? (
                    <p>Chưa có hóa đơn nào.</p>
                ) : (
                    <Table
                        dataSource={bills}
                        columns={columns}
                        rowKey="_id"
                        bordered
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: 800 }}
                    />
                )}
            </Content>
        </Layout>
    );
};

export default ListInvoice;