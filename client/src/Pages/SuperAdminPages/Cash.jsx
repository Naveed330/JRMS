import React, { useState, useEffect, useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import SideBar from '../../Components/SideBar';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import Select from 'react-select';

const Cash = () => {
    const [cashTenants, setCashTenants] = useState([]);
    const [selectedTenant, setSelectedTenant] = useState(null);
    const { state } = useContext(AuthContext);

    useEffect(() => {
        const fetchCashPayments = async () => {
            try {
                const response = await axios.get('/api/tenants/alltenants', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`
                    }
                });
                const data = response.data;
                // Filter tenants who made payment by cash
                const cashPaymentsTenants = data.filter(tenant =>
                    tenant.contractInfo.payment.some(payment => payment.paymentmethod === 'cash')
                );
                setCashTenants(cashPaymentsTenants);
            } catch (error) {
                console.error('Error fetching tenant data:', error);
            }
        };
        fetchCashPayments();
    }, [state.user.token]);

    const tenantOptions = cashTenants.map(tenant => ({
        label: tenant.name || tenant.companyname,
        value: tenant._id
    }));

    // Filter cashTenants based on the selected tenant
    const filteredTenants = selectedTenant
        ? cashTenants.filter(tenant => tenant._id === selectedTenant.value)
        : cashTenants;

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
                            <h2 className='text-center'>Cash Payments</h2>
                            <div style={{ width: '100%', maxWidth: '500px' }} >
                                <Select
                                    placeholder="Search by tenant name"
                                    value={selectedTenant}
                                    onChange={setSelectedTenant}
                                    options={tenantOptions}
                                    isClearable
                                    className='mb-4'
                                />
                            </div>

                            <Table striped bordered hover responsive className='mb-5'>
                                <thead style={{ backgroundColor: '#005f75' }}>
                                    <tr>
                                        <th style={{ color: '#ffff' }}>Name</th>
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
                                            payment.paymentmethod === 'cash' && (
                                                <tr key={`${tenant._id}-${index}`}>
                                                     <td>{tenant.name || tenant.companyname}</td>
                                                     <td>{tenant.contact && tenant.contact}</td>
                                                     <td>{tenant.property && (tenant.property?.name || tenant.property?.buildingname)}</td>
                                                    <td>{tenant.property && (tenant.property?.name || tenant.property?.buildingname)}</td>
                                                    <td>
                                                        {tenant.unitId && tenant.unitId.map(unit => unit.type).join(', ')}
                                                    </td>
                                                    <td>{payment.amount && payment.amount} AED</td>
                                                    <td>{payment.checkorinvoice && payment.checkorinvoice} </td>
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

export default Cash;