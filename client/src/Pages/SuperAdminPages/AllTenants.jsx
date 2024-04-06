import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const AllTenants = () => {
    const [tenants, setTenants] = useState([]);
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const response = await axios.get('/api/tenants/alltenants');
                setTenants(response.data);
            } catch (error) {
                setError('Failed to fetch tenants');
            }
        };
        fetchTenants();
    }, []);

    const handleViewDetails = (tenant) => {
        setSelectedTenant(tenant);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <h2>All Tenants</h2>
            {error && <p>Error: {error}</p>}
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tenants.map(tenant => (
                        <tr key={tenant._id}>
                            <td>{tenant.name}</td>
                            <td>{tenant.email}</td>
                            <td>{tenant.contact}</td>
                            <td>
                                <Button variant="primary" onClick={() => handleViewDetails(tenant)}>View</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Tenant Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTenant && (
                        <div>
                            <p><strong>Name:</strong> {selectedTenant.name}</p>
                            <p><strong>Email:</strong> {selectedTenant.email}</p>
                            <p><strong>Contact:</strong> {selectedTenant.contact}</p>
                            <p><strong>NID:</strong> {selectedTenant.nid}</p>
                            <p><strong>Passport:</strong> {selectedTenant.passport}</p>
                            <p><strong>Address:</strong> {selectedTenant.address}</p>
                            <p><strong>Owner:</strong> {selectedTenant.ownerId.name}</p>
                            <p><strong>Property:</strong> {selectedTenant.property.map(prop => prop.name).join(', ')}</p>
                            <p><strong>Floor:</strong> {selectedTenant.floorId.name}</p>
                            <p><strong>Unit:</strong> {selectedTenant.unitId.name}</p>
                            <p><strong>Property Type:</strong> {selectedTenant.propertyType}</p>
                            <p><strong>Status:</strong> {selectedTenant.status}</p>
                            <p><strong>Bank Name:</strong> {selectedTenant.bankName}</p>
                            <p><strong>Total Checks:</strong> {selectedTenant.totalChecks}</p>
                            <p><strong>Starting Date:</strong> {selectedTenant.contractInfo.startingDate}</p>
                            <p><strong>Months Duration:</strong> {selectedTenant.contractInfo.monthsDuration}</p>
                            <p><strong>End Date:</strong> {selectedTenant.contractInfo.endDate}</p>
                            <p><strong>Total Contract Amount:</strong> {selectedTenant.contractInfo.totalContractAmount}</p>
                            <p><strong>VAT:</strong> {selectedTenant.contractInfo.VAT}</p>
                            <p><strong>Other Cost:</strong> {selectedTenant.contractInfo.otherCost}</p>
                            <p><strong>Parking:</strong> {selectedTenant.contractInfo.parking.toString()}</p>
                            <p><strong>Discount:</strong> {selectedTenant.contractInfo.discount}</p>
                            <p><strong>Final Amount:</strong> {selectedTenant.contractInfo.finalAmount}</p>
                            <p><strong>Checks:</strong></p>
                            {selectedTenant.contractInfo.pdc.map(check => (
                                <div key={check._id}>
                                    <p><strong>Check Number:</strong> {check.checkNumber}</p>
                                    <p><strong>Bank:</strong> {check.bank}</p>
                                    <p><strong>Date:</strong> {check.date}</p>
                                    <p><strong>Amount:</strong> {check.amount}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AllTenants;
