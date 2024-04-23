import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Pages/AuthContext';
import { Table } from 'react-bootstrap';

const OwnerBankReport = () => {
    const [tenants, setTenants] = useState([]);
    const { state } = useContext(AuthContext);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch all tenants for the owner by ownerId
        axios.get(`/api/tenants/tenants-by-owner/${state.user._id}`)
            .then(response => {
                setTenants(response.data);
            })
            .catch(error => {
                console.error('Error fetching tenants:', error);
                setError('Error fetching tenants');
            });
    }, [state.user._id]);

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
        <div className="row">
            <div className="col-12 grid-margin">
                <div className="card" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} >
                    <div className="card-body">
                        <h4 className="card-title">Bank Report</h4>
                        {error && <p className="text-danger">{error}</p>}
                        <div className="row">
                            <div className="col-md-6">
                                <h5>Total Bank Amount: {totalBankAmount}</h5>
                                <Table striped bordered hover responsive >
                                    <thead>
                                        <tr>
                                            <th>Property Name</th>
                                            <th>Check No's</th>
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
                                                        <td>{tenant.property[0].name}</td>
                                                        <td>{payment.checkorinvoice}</td>
                                                        <td>{new Date(payment.date).toLocaleDateString()}</td>
                                                        <td>{payment.amount}</td>
                                                    </tr>
                                                ))
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            <div className="col-md-6">
                                <h5>Total Cash Amount: {totalCashAmount}</h5>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Property Name</th>
                                            <th>Invoice NO's</th>
                                            <th>Date</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tenants.map(tenant => (
                                            tenant.contractInfo.payment
                                                .filter(payment => payment.paymentmethod === "cash")
                                                .map(payment => (
                                                    <tr key={payment._id}>
                                                        <td>{tenant.property[0].name}</td>
                                                        <td>{payment.checkorinvoice}</td>
                                                        <td>{new Date(payment.date).toLocaleDateString()}</td>
                                                        <td>{payment.amount}</td>
                                                    </tr>
                                                ))
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerBankReport;
