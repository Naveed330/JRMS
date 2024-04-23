import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import AdminSideBar from '../../Components/AdminSideBar';

const Adminbank = () => {
    const [bankTenants, setBankTenants] = useState([]);

    useEffect(() => {
        fetch('/api/tenants/alltenants')
            .then(response => response.json())
            .then(data => {
                // Filter tenants who made payment by bank
                const bankPaymentsTenants = data.filter(tenant =>
                    tenant.contractInfo.payment.some(payment => payment.paymentmethod === 'bank')
                );
                setBankTenants(bankPaymentsTenants);
            })
            .catch(error => console.error('Error fetching tenant data:', error));
    }, []);

    return (
        <>
        <Row>
            <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                <div>
                    <AdminSideBar />
                </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '90px' }} >
                <Row xs={1} md={2} lg={3}>
                    <Col xs={12} sm={12} md={12} lg={10} xl={10} >
                        <h2 className='text-center' >Bank Payments</h2>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Contact</th>
                                    <th>Property Name</th>
                                    <th>Floor Name</th>
                                    <th>Unit Name</th>
                                    <th>Amount</th>
                                    <th>Invoice</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bankTenants.map(tenant => (
                                    tenant.contractInfo.payment.map((payment, index) => (
                                        payment.paymentmethod === 'bank' && (
                                            <tr key={`${tenant._id}-${index}`}>
                                                <td>{index === 0 ? (tenant.name || tenant.companyname) : ''}</td>
                                                <td>{index === 0 ? (tenant.email && tenant.email) : ''}</td>
                                                <td>{index === 0 ? (tenant.contact && tenant.contact) : ''}</td>
                                                <td>{index === 0 ? (tenant.property && (tenant.property[0]?.name || tenant.property[0]?.buildingname)) : ''}</td>
                                                <td>{index === 0 ? (tenant.floorId?.name && tenant.floorId?.name) : ''}</td>
                                                <td>{index === 0 ? (tenant.unitId && tenant.unitId.map(unit => unit.type).join(', ')) : ''}</td>
                                                <td>{payment.amount && payment.amount}</td>
                                                <td>{payment.checkorinvoice && payment.checkorinvoice}</td>
                                                {/* <td>{payment.date && payment.date}</td> */}
                                                <td>{new Date(payment.date && payment.date).toLocaleDateString()}</td>
                                            </tr>
                                        )
                                    ))
                                ))}
                            </tbody>
                        </Table>

                    </Col>
                </Row>
            </Col>

        </Row>
    </>
);
};

export default Adminbank;