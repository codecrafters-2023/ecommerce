// Create AddressBook.js component
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AddressBook.css';
import Header from '../header';

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
        <>
        <Header/>
        <div className="address-book">
            <h2>Saved Addresses</h2>
            {addresses.map(address => (
                <div
                    key={address._id}
                    className="address-card"
                    data-primary={address.isPrimary}
                >
                    <p>{address.address}</p>
                    <p>{address.city}, {address.state} {address.zip}</p>
                    <div className="address-actions">
                        <button
                            onClick={() => setPrimary(address._id)}
                            disabled={address.isPrimary}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                style={{ width: '1rem', height: '1rem' }}
                            >
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {address.isPrimary ? 'Primary Address' : 'Set as Primary'}
                        </button>
                        <button
                            className="delete-button"
                            onClick={() => deleteAddress(address._id)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                style={{ width: '1rem', height: '1rem' }}
                            >
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
        </>
    );
};

export default AddressBook;