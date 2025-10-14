
import styles from '../../styles/Header.module.css';

const Header = () => {
    const handleCreate = () => {
        window.location.href = '/';
    }
    const handleList = () => {
        window.location.href = '/list';
    }
    return (
        <div className={styles.header}>
            <h1>HỆ THỐNG QUẢN LÝ HÓA ĐƠN ĐIỆN TỬ</h1>
            <div className={styles.buttonsHeader}>
                <button onClick={handleCreate}>Tạo Hóa Đơn</button>
                <button onClick={handleList}>Danh sách hóa đơn</button>
            </div>
        </div>
    )
}

export default Header
