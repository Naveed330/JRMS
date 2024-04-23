import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import SideBar from '../../Components/SideBar';

const Cash = () => {
    const [cashTenants, setCashTenants] = useState([]);

    useEffect(() => {
        fetch('/api/tenants/alltenants')
            .then(response => response.json())
            .then(data => {
                // Filter tenants who made payment by cash
                const cashPaymentsTenants = data.filter(tenant =>
                    tenant.contractInfo.payment.some(payment => payment.paymentmethod === 'cash')
                );
                setCashTenants(cashPaymentsTenants);
            })
            .catch(error => console.error('Error fetching tenant data:', error));
    }, []);

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
                            <h2 className='text-center' >Cash Payments</h2>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Name</th>
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
                                    {cashTenants.map(tenant => (
                                        <tr key={tenant._id}>
                                            <td>{tenant.name || tenant.companyname}</td>
                                            <td>{tenant.contact && tenant.contact}</td>
                                            <td>{tenant.property && (tenant.property[0]?.name || tenant.property[0]?.buildingname)}</td>
                                            <td>{tenant.floorId?.name}</td>
                                            <td>
                                                {tenant.unitId && tenant.unitId.map(unit => unit.type).join(', ')}
                                            </td>
                                            {tenant.contractInfo.payment.map(payment => (
                                                payment.paymentmethod === 'cash' && (
                                                    <React.Fragment key={payment._id}>
                                                        <td>{payment.amount && payment.amount}</td>
                                                        <td>{payment.checkorinvoice && payment.checkorinvoice}</td>
                                                        {/* <td>{payment.date && payment.date}</td> */}
                                                        <td>{new Date(payment.date).toLocaleDateString()}</td>
                                                    </React.Fragment>
                                                )
                                            ))}
                                        </tr>
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

export default Cash;