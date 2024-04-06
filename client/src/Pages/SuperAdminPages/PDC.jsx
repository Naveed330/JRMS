import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const PDC = () => {
    const [tenantData, setTenantData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('bank');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [checkOrInvoice, setCheckOrInvoice] = useState('');
    const [paymentDate, setPaymentDate] = useState('');

    useEffect(() => {
        fetch('/api/tenants/alltenants')
            .then(response => response.json())
            .then(data => setTenantData(data))
            .catch(error => console.error('Error fetching tenant data:', error));
    }, []);

    const handleEdit = (tenantId, check) => {
        setEditData({ tenantId, check });
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleSave = () => {
        // Prepare updated payment data
        const updatedPaymentData = {
            paymentmethod: paymentMethod,
            paymentstatus: 'pending', // Assuming payment status needs to be set
            amount: paymentAmount,
            date: paymentDate, // Include payment date
            checkorinvoice: checkOrInvoice
        };

        // Send PUT request to update payment information
        fetch(`/api/tenants/${editData.tenantId}/pdc/${editData.check._id}/payments`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPaymentData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update payment information');
            }
            return response.json();
        })
        .then(data => {
            console.log('Payment information updated successfully:', data);
            // Update tenantData state to reflect changes
            const updatedTenantData = tenantData.map(tenant => {
                if (tenant._id === editData.tenantId) {
                    const updatedPDC = tenant.contractInfo.pdc.filter(pdc => pdc._id !== editData.check._id);
                    return {
                        ...tenant,
                        contractInfo: {
                            ...tenant.contractInfo,
                            pdc: updatedPDC
                        }
                    };
                }
                return tenant;
            });
            setTenantData(updatedTenantData);
            setShowModal(false);
        })
        .catch(error => console.error('Error updating payment information:', error));
    };
    return (
        <div>
            <h1>PDC Information</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Property Name</th>
                        <th>Floor Name</th>
                        <th>Unit Name</th>
                        <th>PDC Information</th>
                    </tr>
                </thead>
                <tbody>
                    {tenantData.map(tenant => (
                        tenant.contractInfo.pdc.map((check, index) => (
                            <tr key={`${tenant._id}-${index}`}>
                                {index === 0 && (
                                    <>
                                        <td rowSpan={tenant.contractInfo.pdc.length}>{tenant.name}</td>
                                        <td rowSpan={tenant.contractInfo.pdc.length}>{tenant.property[0].name}</td>
                                        <td rowSpan={tenant.contractInfo.pdc.length}>{tenant.floorId.name}</td>
                                        <td rowSpan={tenant.contractInfo.pdc.length}>{tenant.unitId.name}</td>
                                    </>
                                )}
                                <td>Check Number: {check.checkNumber}</td>
                                <td>Bank: {check.bank}</td>
                                <td>Date: {new Date(check.date).toLocaleDateString()}</td>
                                <td>Amount: {check.amount}</td>
                                <td>
                                    <button onClick={() => handleEdit(tenant._id, check)}>Edit</button>
                                </td>
                            </tr>
                        ))
                    ))}
                </tbody>
            </Table>

            {/* Modal for Editing */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit PDC Information</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {/* Form for editing */}
                    <label>Select Payment By:</label>
                    <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                        <option value="bank">Bank</option>
                        <option value="cash">Cash</option>
                    </select>
                    <br />
                    <label>Amount:</label>
                    <input type="text" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
                    <br />
                    <label>Date:</label>
                    <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} />
                    <br />
                    <label>Check / Invoice:</label>
                    <input type="text" value={checkOrInvoice} onChange={e => setCheckOrInvoice(e.target.value)} />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PDC;
