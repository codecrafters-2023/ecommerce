// Create AddressBook.js component
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddressBook = () => {
    const [addresses, setAddresses] = useState([]);

    const refreshAddresses = async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/auth/addresses`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setAddresses(data.addresses);
    };

    const setPrimary = async (addressId) => {
        try {
            const { data } = await axios.put(
                `${process.env.REACT_APP_API_URL}/auth/addresses/${addressId}/primary`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setAddresses(data.addresses);
            toast.success('Primary address updated');
        } catch (error) {
            toast.error('Failed to set primary address');
        }
    };

    const deleteAddress = async (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                const { data } = await axios.delete(
                    `${process.env.REACT_APP_API_URL}/auth/addresses/${addressId}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                setAddresses(data.addresses);
                toast.success('Address deleted successfully');
            } catch (error) {
                toast.error('Failed to delete address');
            }
        }
    };

    useEffect(() => {
        refreshAddresses();
    }, []);


    return (
        <div className="address-book">
            <h2>Saved Addresses</h2>
            {addresses.map(address => (
                <div key={address._id} className="address-card">
                    <p>{address.address}</p>
                    <p>{address.city}, {address.state} {address.zip}</p>
                    <div className="address-actions">
                        <button onClick={() => setPrimary(address._id)}>
                            {address.isPrimary ? 'Primary' : 'Set Primary'}
                        </button>
                        <button
                            className="delete-button"
                            onClick={() => deleteAddress(address._id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AddressBook;