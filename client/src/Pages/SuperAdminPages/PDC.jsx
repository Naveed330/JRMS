import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Col, Row } from 'react-bootstrap';
import SideBar from '../../Components/SideBar';

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
        setPaymentAmount(check.amount.toString());
        setCheckOrInvoice(check.checkNumber);
        setPaymentDate(new Date(check.date).toISOString().split('T')[0]);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleSave = () => {
        // Prepare updated payment data
        const updatedPaymentData = {
            paymentmethod: paymentMethod,
            paymentstatus: 'pending',
            amount: parseFloat(paymentAmount),
            date: paymentDate,
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
            
            // Fetch all tenants again to update the tenantData state
            return fetch('/api/tenants/alltenants');
        })
        .then(response => response.json())
        .then(data => {
            // Update tenantData state with new data
            setTenantData(data);
            setShowModal(false);
        })
        .catch(error => console.error('Error updating payment information:', error));
    };
    
    return (
        <>
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <div>
                        <SideBar />
                    </div>
                </Col>

                <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '90px' }} >
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10} >
                            <h2 className='text-center'>PDC Information</h2>
                            <Table striped bordered hover responsive >
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Property Name</th>
                                        <th>Floor Name</th>
                                        <th>Unit Name</th>
                                        <th>PDC Information</th>
                                        <th>Bank</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tenantData.map(tenant => (
                                        tenant.contractInfo.pdc.map((check, index) => (
                                            <tr key={`${tenant._id}-${index}`}>
                                                {index === 0 && (
                                                    <>
                                                        <td rowSpan={tenant.contractInfo.pdc.length}>{tenant.name || tenant.companyname}</td>
                                                        <td rowSpan={tenant.contractInfo.pdc.length}>{tenant.property.length > 0 ? tenant.property[0].name || tenant.property[0].buildingname : 'N/A'}</td>
                                                        <td rowSpan={tenant.contractInfo.pdc.length}>{tenant.floorId ? tenant.floorId.name : 'N/A'}</td>
                                                        <td rowSpan={tenant.contractInfo.pdc.length}>{tenant.unitId.length > 0 ? tenant.unitId[0].unitNo : 'N/A'}</td>
                                                    </>
                                                )}
                                                <td>{check.checkNumber && check.checkNumber}</td>
                                                <td>{check.bank}</td>
                                                <td>{new Date(check.date).toLocaleDateString()}</td>
                                                <td>{check.amount}</td>
                                                <td>
                                                    <Button onClick={() => handleEdit(tenant._id, check)}>Pay Now</Button>
                                                </td>
                                            </tr>
                                        ))
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Col>

            </Row>

            {/* Modal for Editing */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit PDC Information</Modal.Title>
                </Modal.Header>

                <form>
                    <Modal.Body>

                        <div>
                            <label>Select Payment By:</label>
                            <select value={paymentMethod} className='w-100 py-2' style={{  border: '1px solid #ebedf2' }} onChange={e => setPaymentMethod(e.target.value)}>
                                <option value="bank">Bank</option>
                                <option value="cash">Cash</option>
                            </select>
                        </div>

                        <div>
                            <label>Amount:</label>
                            <input type="text" value={paymentAmount} className="form-control" onChange={e => setPaymentAmount(e.target.value)} />
                        </div>

                        <div>
                            <label>Date:</label>
                            <input type="date" value={paymentDate} className="form-control" onChange={e => setPaymentDate(e.target.value)} />
                        </div>

                        <div>

                            <label>Check / Invoice:</label>
                            <input type="text" value={checkOrInvoice} className="form-control" onChange={e => setCheckOrInvoice(e.target.value)} />
                        </div>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
};

export default PDC;
