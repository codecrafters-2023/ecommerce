import AdminSidebar from '../../components/Navbar';
import './index.css'

const AdminPanel = () => {
    

    return (
        <div className='admin-container'>
            {/* <h1>Admin Panel</h1>
            <p>Welcome {user?.email}</p>
            <button onClick={logout}>Logout</button> */}

            <div>
                <AdminSidebar />
            </div>
            <div>
                {/* <!-- Main Content --> */}
                <div>
                    <main class="main-content">
                        <h1>Dashboard</h1>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;