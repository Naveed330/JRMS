import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { AuthContext } from '../Pages/AuthContext';
import axios from 'axios';
import Select from 'react-select';

const SuperadminPdc = () => {
    const [tenantData, setTenantData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('bank');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [checkOrInvoice, setCheckOrInvoice] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [selectedTenant, setSelectedTenant] = useState(null);
    const { state } = useContext(AuthContext);
    const [filteredTenantData, setFilteredTenantData] = useState([]);
    const navigate = useNavigate(); // Initialize navigate function

    useEffect(() => {
        const fetchTenantData = async () => {
            try {
                const response = await axios.get('/api/tenants/alltenants', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`
                    }
                });
                setTenantData(response.data);
                setFilteredTenantData(response.data); // Initialize filtered data with all data
            } catch (error) {
                console.error('Error fetching tenant data:', error);
            }
        };
        fetchTenantData();
    }, [state.user.token]);

    useEffect(() => {
        // Filter tenantData based on selectedTenant
        if (selectedTenant) {
            const filteredData = tenantData.filter(tenant => tenant.name === selectedTenant.label);
            setFilteredTenantData(filteredData);
        } else {
            setFilteredTenantData(tenantData);
        }
    }, [selectedTenant, tenantData]);

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
        axios.put(`/api/tenants/${editData.tenantId}/pdc/${editData.check._id}/payments`, updatedPaymentData, {
            headers: {
                Authorization: `Bearer ${state.user.token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('Payment information updated successfully:', response.data);

                // Fetch all tenants again to update the tenantData state
                return axios.get('/api/tenants/alltenants', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`
                    }
                });
            })
            .then(response => {
                setTenantData(response.data);
                setShowModal(false);
            })
            .catch(error => console.error('Error updating payment information:', error));
    };

    const today = new Date();
    const todayPayments = [];
    const upcomingPayments = [];
    const previousPayments = [];

    filteredTenantData.forEach(tenant => {
        tenant.contractInfo.pdc.forEach(check => {
            const paymentDate = new Date(check.date);
            if (paymentDate.toDateString() === today.toDateString()) {
                todayPayments.push({ tenant, check });
            } else if (paymentDate > today) {
                upcomingPayments.push({ tenant, check });
            } else {
                previousPayments.push({ tenant, check });
            }
        });
    });

    const tenantOptions = tenantData.map(tenant => ({ label: tenant.name || tenant.companyname, value: tenant._id }));

    return (
        <div>
            <div style={{ width: '100%', maxWidth: '500px' }}>
                <Select
                    placeholder="Search by tenant name"
                    value={selectedTenant}
                    onChange={setSelectedTenant}
                    options={tenantOptions}
                    isClearable
                />
            </div>

            <h3 className='mt-4'>Today's PDC</h3>
            <Table striped bordered hover responsive  >
                <thead style={{ backgroundColor: '#005f75' }}>
                    <tr style={{ color: '#ffff' }}>
                        <th >Name</th>
                        <th >Property Name</th>
                        <th>Floor Name</th>
                        <th>Unit NO</th>
                        <th>PDC Information</th>
                        <th>Bank</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {todayPayments.map(({ tenant, check }, index) => (
                        <tr key={`today-${index}`}>
                            <td>{tenant.name || tenant.companyname}</td>
                            <td>{tenant.property && tenant.property.name}</td>
                            <td>{tenant.floorId ? tenant.floorId.name : 'N/A'}</td>
                            <td>{tenant.unitId.length > 0 ? tenant.unitId[0].unitNo : 'N/A'}</td>
                            <td>{check.checkNumber && check.checkNumber} AED</td>
                            <td>{check.bank}</td>
                            <td>{new Date(check.date).toDateString()}</td>
                            <td>{check.amount} AED</td>
                            <td>
                                <Button onClick={() => handleEdit(tenant._id, check)}>Pay Now</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Upcoming Payments Table */}
            <h3 className='mt-4'>Upcoming PDC</h3>
            <Table striped bordered hover responsive>
                <thead style={{ backgroundColor: '#005f75' }}>
                    <tr>
                        <th style={{ color: '#ffff' }} >Name</th>
                        <th style={{ color: '#ffff' }}>Property Name</th>
                        <th style={{ color: '#ffff' }}>Floor Name</th>
                        <th style={{ color: '#ffff' }}>Unit NO</th>
                        <th style={{ color: '#ffff' }}>PDC Information</th>
                        <th style={{ color: '#ffff' }}>Bank</th>
                        <th style={{ color: '#ffff' }}>Date</th>
                        <th style={{ color: '#ffff' }}>Amount</th>
                        <th style={{ color: '#ffff' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {upcomingPayments.map(({ tenant, check }, index) => (
                        <tr key={`upcoming-${index}`}>
                            <td>{tenant.name || tenant.companyname}</td>
                            <td>{tenant.property && tenant.property.name}</td>
                            <td>{tenant.floorId ? tenant.floorId.name : 'N/A'}</td>
                            <td>{tenant.unitId.length > 0 ? tenant.unitId[0].unitNo : 'N/A'}</td>
                            <td>{check.checkNumber && check.checkNumber} AED</td>
                            <td>{check.bank}</td>
                            <td>{new Date(check.date).toDateString()}</td>
                            <td>{check.amount} AED</td>
                            <td>
                                <Button onClick={() => handleEdit(tenant._id, check)}>Pay Now</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Previous Payments Table */}
            <h3 className='mt-4'>Dues PDC</h3>
            <Table striped bordered hover responsive>
                <thead style={{ backgroundColor: '#005f75' }}>
                    <tr>
                        <th style={{ color: '#ffff' }} >Name</th>
                        <th style={{ color: '#ffff' }}>Property Name</th>
                        <th style={{ color: '#ffff' }}>Floor Name</th>
                        <th style={{ color: '#ffff' }}>Unit NO</th>
                        <th style={{ color: '#ffff' }}>PDC Information</th>
                        <th style={{ color: '#ffff' }}>Bank</th>
                        <th style={{ color: '#ffff' }}>Date</th>
                        <th style={{ color: '#ffff' }}>Amount</th>
                        <th style={{ color: '#ffff' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {previousPayments.map(({ tenant, check }, index) => (
                        <tr key={`previous-${index}`}>
                            <td>{tenant.name || tenant.companyname}</td>
                            <td>{tenant.property && tenant.property.name}</td>
                            <td>{tenant.floorId ? tenant.floorId.name : 'N/A'}</td>
                            <td>{tenant.unitId.length > 0 ? tenant.unitId[0].unitNo : 'N/A'}</td>
                            <td>{check.checkNumber && check.checkNumber} AED</td>
                            <td>{check.bank}</td>
                            <td>{new Date(check.date).toDateString()}</td>
                            <td>{check.amount} AED</td>
                            <td>
                                <Button onClick={() => handleEdit(tenant._id, check)}>Pay Now</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className='mb-5' style={{ display: 'flex', justifyContent: 'center', marginTop: '1em', marginBottom: '1em' }}>
                <Button onClick={() => navigate('/addadministrationfee')}>Add Administration Fee</Button>
            </div>

            {/* Modal for Editing */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit PDC Information</Modal.Title>
                </Modal.Header>

                <form>
                    <Modal.Body>

                        <div>
                            <label>Select Payment By:</label>
                            <select value={paymentMethod} className='w-100 py-2' style={{ border: '1px solid #ebedf2' }} onChange={e => setPaymentMethod(e.target.value)}>
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
        </div>
    );
};

export default SuperadminPdc;