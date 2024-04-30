import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Col, Row, Table } from 'react-bootstrap';
import { AuthContext } from '../AuthContext';
import OwnerSideBar from '../../Components/OwnerSideBar';

const OwnerBank = () => {
    const [tenants, setTenants] = useState([]);
    const { state } = useContext(AuthContext);
    const [error, setError] = useState('');


    useEffect(() => {
        const fetchTenants = async () => {
            try {

                const response = await axios.get(`/api/tenants/tenants-by-ownerforowner/${state.user._id}`, {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`,
                    },
                });
                setTenants(response.data);
            } catch (error) {
                console.error('Error fetching tenants:', error);
                setError('Error fetching tenants');
            }
        };

        fetchTenants();
    }, [state.user._id, state.user.token]);


    // Calculate total amount for bank and cash payments
    const totalBankAmount = tenants.reduce((total, tenant) => {
        return total + tenant.contractInfo.payment
            .filter(payment => payment.paymentmethod === "bank")
            .reduce((sum, payment) => sum + payment.amount, 0);
    }, 0);

    const totalCashAmount = tenants.reduce((total, tenant) => {
        return total + tenant.contractInfo.payment
            .filter(payment => payment.paymentmethod === "cash")
            .reduce((sum, payment) => sum + payment.amount, 0);
    }, 0);
    return (
        <>
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <OwnerSideBar />
                </Col>

                <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '90px' }}>
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10} >
                            <h2 className='text-center'>Bank Report</h2>
                            {error && <p className="text-danger">{error}</p>}


                            <h4>Total Bank Amount: {`${totalBankAmount} AED`}</h4>
                            <Table striped bordered hover responsive className='mb-5' >
                                <thead style={{ backgroundColor: '#005f75' }} >
                                    <tr style={{ color: 'white' }} >
                                        <th>Property Name</th>
                                        <th>Check Number</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tenants.map(tenant => (
                                        tenant.contractInfo.payment
                                            .filter(payment => payment.paymentmethod === "bank")
                                            .map(payment => (
                                                <tr key={payment._id}>
                                                    <td>{tenant.property.name}</td>
                                                    <td>{`${payment.checkorinvoice} AED`}</td>
                                                    <td>{new Date(payment.date).toLocaleDateString()}</td>
                                                    <td>{`${payment.amount} AED`}</td>
                                                </tr>
                                            ))
                                    ))}
                                </tbody>
                            </Table>

                        </Col>
                    </Row>
                </Col>
            </Row>

        </>
    )
}

export default OwnerBank
