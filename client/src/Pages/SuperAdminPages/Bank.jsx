import React, { useState, useEffect, useContext } from 'react';
import { Button, Col, Row, Modal } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import SideBar from '../../Components/SideBar';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import Select from 'react-select';

const Bank = () => {
    const [bankTenants, setBankTenants] = useState([]);
    const [selectedTenantId, setSelectedTenantId] = useState(null);
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);
    const { state } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('');

    // Define fetchBankPayments outside of useEffect
    const fetchBankPayments = async () => {
        try {
            const response = await axios.get('/api/tenants/alltenants', {
                headers: {
                    Authorization: `Bearer ${state.user.token}`
                }
            });
            const data = response.data;
            // Filter tenants who made payment by bank
            const bankPaymentsTenants = data.filter(tenant =>
                tenant.contractInfo.payment.some(payment => payment.paymentmethod === 'bank')
            );
            setBankTenants(bankPaymentsTenants);
        } catch (error) {
            console.error('Error fetching tenant data:', error);
        }
    };

    useEffect(() => {
        fetchBankPayments();
    }, [state.user.token]);

    const tenantOptions = bankTenants.map(tenant => ({
        label: tenant.name || tenant.companyname,
        value: tenant._id
    }));

    const handleModalClose = () => {
        setShowModal(false);
    };
 
    const handleSaveChanges = async () => {
        try {
            if (!selectedTenantId || !selectedPaymentId) {
                console.error('No tenant or payment selected.');
                return;
            }
            // Hit the API to update payment status
            const response = await axios.put(
                `/api/tenants/tenant/${selectedTenantId}/paymentstatus`,
                {
                    paymentId: selectedPaymentId,
                    paymentstatus: paymentStatus
                },
                {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`
                    }
                }
            );
            console.log(response.data);
            // Close modal
            setShowModal(false);
            // Refetch data
            fetchBankPayments();
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    };

    return (
        <>
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <div>
                        <SideBar />
                    </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '90px' }}>
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10}>
                            <h2 className='text-center'>Bank Payments</h2>
                            <div style={{ width: '100%', maxWidth: '500px' }} >
                                <Select
                                    placeholder="Search by tenant name"
                                    value={selectedTenantId}
                                    onChange={setSelectedTenantId}
                                    options={tenantOptions}
                                    isClearable
                                    className='mb-4'
                                />
                            </div>

                            <Table striped bordered hover responsive className='mb-5' >
                                <thead style={{ backgroundColor: '#005f75' }} >
                                    <tr>
                                        <th style={{ color: '#ffff' }} >Tenant Name</th>
                                        <th style={{ color: '#ffff' }}>Contact</th>
                                        <th style={{ color: '#ffff' }}>Property Name</th>
                                        <th style={{ color: '#ffff' }}>Floor Name</th>
                                        <th style={{ color: '#ffff' }}>Unit Name</th>
                                        <th style={{ color: '#ffff' }}>Amount</th>
                                        <th style={{ color: '#ffff' }}>Check NO</th>
                                        <th style={{ color: '#ffff' }}>Date</th>
                                        <th style={{ color: '#ffff' }}>Status</th>
                                        <th style={{ color: '#ffff' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bankTenants.map(tenant =>
                                        tenant.contractInfo.payment.map(payment => (
                                            payment.paymentmethod === 'bank' && (
                                                <tr key={payment._id}>
                                                    <td>{tenant.name || tenant.companyname}</td>
                                                    <td>{tenant.contact && tenant.contact}</td>
                                                    <td>{tenant.property && (tenant.property?.name || tenant.property?.buildingname)}</td>
                                                    <td>{tenant.floorId?.name}</td>
                                                    <td>
                                                        {tenant.unitId && tenant.unitId.map(unit => unit.type).join(', ')}
                                                    </td>
                                                    <td>{payment.amount && payment.amount} AED</td>
                                                    <td>{payment.checkorinvoice && payment.checkorinvoice} </td>
                                                    <td>{new Date(payment.date && payment.date).toLocaleDateString()}</td>
                                                    <td>{payment.paymentstatus && payment.paymentstatus}</td>
                                                    <td>
                                                        <Button onClick={() => {
                                                            setSelectedTenantId(tenant._id);
                                                            setSelectedPaymentId(payment._id);
                                                            setShowModal(true);
                                                        }}>Change Status</Button>
                                                    </td>
                                                </tr>
                                            )
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Modal */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Payment Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Select
                        placeholder={paymentStatus ? `Selected: ${paymentStatus}` : "Select payment status"}
                        options={[
                            { label: 'Paid', value: 'paid' },
                            { label: 'Pending', value: 'pending' },
                            { label: 'Return', value: 'return' },
                        ]}
                        value={paymentStatus}
                        onChange={(selectedOption) => setPaymentStatus(selectedOption.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
};

export default Bank;
