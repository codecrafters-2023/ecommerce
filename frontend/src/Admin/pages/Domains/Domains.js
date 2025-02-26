import React from 'react'
import AdminSidebar from '../../components/Navbar'

const Domains = () => {
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
                    <h1>Domains</h1>
                </main>
            </div>
        </div>
    </div>
    )
}

export default Domains
