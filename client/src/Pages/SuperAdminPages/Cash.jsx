import React, { useState, useEffect } from 'react';
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
        <div>
            <h1>Cash Payments</h1>
            <div>
                <SideBar />
            </div>
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
                            <td>{tenant.name}</td>

                            <td>{tenant.contact}</td>
                            <td>{tenant.property[0].name}</td>
                            <td>{tenant.floorId.name}</td>
                            <td>{tenant.unitId.name}</td>
                            {/* Display amount and check or invoice details */}
                            {tenant.contractInfo.payment.map(payment => (
                                <React.Fragment key={payment._id}>
                                    {payment.paymentmethod === 'cash' && (
                                        <>
                                            <td>{payment.amount}</td>
                                            <td>{payment.checkorinvoice}</td>
                                            <td>{payment.date}</td>
                                        </>
                                    )}
                                </React.Fragment>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Cash;
