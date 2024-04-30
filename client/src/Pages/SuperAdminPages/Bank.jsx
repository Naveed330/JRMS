import React, { useState, useEffect, useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import SideBar from '../../Components/SideBar';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import Select from 'react-select';

const Bank = () => {
    const [bankTenants, setBankTenants] = useState([]);
    const [selectedTenant, setSelectedTenant] = useState(null);
    const { state } = useContext(AuthContext);

    useEffect(() => {
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
        fetchBankPayments();
    }, [state.user.token]);

    const tenantOptions = bankTenants.map(tenant => ({
        label: tenant.name || tenant.companyname,
        value: tenant._id
    }));

    // Filter bankTenants based on the selected tenant
    const filteredTenants = selectedTenant
        ? bankTenants.filter(tenant => tenant._id === selectedTenant.value)
        : bankTenants;

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
                            <div style={{width:'100%', maxWidth:'500px'}} >
                            <Select
                                placeholder="Search by tenant name"
                                value={selectedTenant}
                                onChange={setSelectedTenant}
                                options={tenantOptions}
                                isClearable
                                className='mb-4'
                            />
                            </div>
                           
                            <Table striped bordered hover responsive className='mb-5' >
                                <thead style={{ backgroundColor: '#005f75' }} >
                                    <tr>
                                        <th style={{ color: '#ffff' }} >Name</th>
                                        <th style={{ color: '#ffff' }}>Contact</th>
                                        <th style={{ color: '#ffff' }}>Property Name</th>
                                        <th style={{ color: '#ffff' }}>Floor Name</th>
                                        <th style={{ color: '#ffff' }}>Unit Name</th>
                                        <th style={{ color: '#ffff' }}>Amount</th>
                                        <th style={{ color: '#ffff' }}>Invoice</th>
                                        <th style={{ color: '#ffff' }}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTenants.map(tenant =>
                                        tenant.contractInfo.payment.map((payment, index) => (
                                            payment.paymentmethod === 'bank' && (
                                                <tr key={`${tenant._id}-${index}`}>
                                                    <td>{index === 0 ? (tenant.name || tenant.companyname) : ''}</td>
                                                    <td>{tenant.contact && tenant.contact}</td>
                                                    <td>{index === 0 ? (tenant.property && (tenant.property?.name || tenant.property?.buildingname)) : ''}</td>
                                                    <td>{index === 0 ? (tenant.floorId?.name && tenant.floorId?.name) : ''}</td>
                                                    <td>{index === 0 ? (tenant.unitId && tenant.unitId.map(unit => unit.type).join(', ')) : ''}</td>
                                                    <td>{payment.amount && payment.amount} AED</td>
                                                    <td>{payment.checkorinvoice && payment.checkorinvoice} AED</td>
                                                    <td>{new Date(payment.date && payment.date).toLocaleDateString()}</td>
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
        </>
    );
};

export default Bank;