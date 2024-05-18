import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import SideBar from '../../Components/SideBar';

const TenantReport = () => {
    const { id } = useParams(); // Fetch tenantId from route parameters
    const [tenantDetails, setTenantDetails] = useState(null);
    const [error, setError] = useState('');
    const { state } = useContext(AuthContext);

    useEffect(() => {
        const fetchTenantDetails = async () => {
            try {
                const response = await axios.get(`/api/tenants/tenant/${id}`, {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`
                    }
                });
                setTenantDetails(response.data);
            } catch (error) {
                setError('Failed to fetch tenant details');
            }
        };
        fetchTenantDetails();
    }, [id, state.user.token]);

    if (!tenantDetails) {
        return <p>Loading...</p>;
    }

    const { contractInfo } = tenantDetails;
    console.log(contractInfo.payment, 'tenantDetails')
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
                        <h3 style={{ textAlign: 'center' }} className='mt-3' >TENANT DETAILS</h3>
                        <Table striped hover responsive style={{ border: '1px solid black' }} >
                                 <thead style={{ backgroundColor: '#005f75' }} >
                                    <th style={{ color: 'white', textAlign: 'center' }} >Tenant Name</th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Email </th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>   Mobile No. </th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Emirates Id </th>
                                </thead>
                                    <tbody>
                                   
                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                {tenantDetails.companyname ? tenantDetails.companyname : tenantDetails.name && tenantDetails.name}
                                            </td>
                                            <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                {tenantDetails.email && tenantDetails.email}
                                            </td>
                                            <td  style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                {tenantDetails.contact && tenantDetails.contact}
                                            </td>

                                            <td  style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                {tenantDetails.licenseno && tenantDetails.licenseno || tenantDetails.nid && tenantDetails.nid}
                                            </td>
                                        </tr>

                                    </tbody>
                                </Table>
                            <h3 style={{ textAlign: 'center' }} className='mt-3' >PDC Information</h3>
                            <Table striped hover responsive style={{ border: '1px solid black' }}>
                                <thead style={{ backgroundColor: '#005f75' }} >
                                    <th style={{ color: 'white', textAlign: 'center' }} >Bank</th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Check Number </th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Amount </th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Date </th>
                                </thead>
                                <tbody>
                                    {

                                        contractInfo?.pdc[0]?.pdcstatus === 'ontime' && contractInfo?.pdc[0]?.type === 'full' ?
                                            <>
                                                {
                                                    contractInfo.pdc.map((checkDetails, index) => {
                                                        return (
                                                            checkDetails?.pdcstatus === 'ontime' && checkDetails?.type === 'full' ? (
                                                                <tr key={index}>
                                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                                        {checkDetails.bank && checkDetails.bank}
                                                                    </td>
                                                                    <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                                        {checkDetails.checkNumber && checkDetails.checkNumber}
                                                                    </td>
                                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                                        {checkDetails.amount && checkDetails.amount} AED
                                                                    </td>
                                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                                        {new Date(checkDetails.date && checkDetails.date).toDateString()}
                                                                    </td>
                                                                </tr>
                                                            ) : null
                                                        );
                                                    })
                                                }

                                            </>
                                            : null

                                    }
                                    {/* Render other payments */}
                                </tbody>



                            </Table>

                            <h3 style={{ textAlign: 'center' }} className='mt-5'  >Bank Paid Information</h3>
                            <Table striped hover responsive style={{ border: '1px solid black' }} >
                                <thead style={{ backgroundColor: '#005f75' }} >
                                    <th style={{ color: 'white', textAlign: 'center' }} >Bank</th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Amount </th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Payment Method</th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Payment Status</th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Check Invoice </th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Date </th>
                                </thead>
                                <tbody>
                                    {contractInfo?.payment.map((payment, index) => {
                                        if (payment.paymentstatus === 'paid' && payment.paymentmethod === 'bank') {
                                            return (
                                                <tr key={payment.id}>
                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {payment.bank}
                                                    </td>
                                                    <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {payment.amount} AED
                                                    </td>
                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {payment.paymentmethod}
                                                    </td>
                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {payment.paymentstatus}
                                                    </td>
                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {payment.checkorinvoice}
                                                    </td>
                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {new Date(payment.date).toDateString()}
                                                    </td>
                                                </tr>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                </tbody>


                            </Table>

                            <h3 style={{ textAlign: 'center' }} className='mt-5'  >Bank Pending Information</h3>
                            <Table striped hover responsive style={{ border: '1px solid black' }} >
                                <thead style={{ backgroundColor: '#005f75' }} >
                                    <th style={{ color: 'white', textAlign: 'center' }} >Bank</th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Amount </th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Payment Method</th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Payment Status</th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Check Invoice </th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Date</th>
                                </thead>
                                <tbody>
                                    {contractInfo?.payment.map((payment, index) => {
                                        if (payment.paymentstatus === 'pending' && payment.paymentmethod === 'bank') {
                                            return (
                                                <tr key={index}>
                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {payment.bank && payment.bank}
                                                    </td>
                                                    <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {payment.amount && payment.amount} AED
                                                    </td>
                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {payment.paymentmethod && payment.paymentmethod}
                                                    </td>
                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {payment.paymentstatus && payment.paymentstatus}
                                                    </td>
                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {payment.checkorinvoice && payment.checkorinvoice}
                                                    </td>
                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {new Date(payment.date && payment.date).toDateString()}
                                                    </td>
                                                </tr>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                </tbody>


                            </Table>

                            <h3 style={{ textAlign: 'center' }} className='mt-5'>Cash Paid Information</h3>
                            <Table striped hover responsive style={{ border: '1px solid black' }} >
                                <thead style={{ backgroundColor: '#005f75' }} >
                                    <th style={{ color: 'white', textAlign: 'center' }}>Payment Method</th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Amount </th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Payment Status</th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Check Invoice </th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Date</th>
                                </thead>
                                <tbody>
                                    {/* Mapping over payment entries */}
                                    {contractInfo?.payment.map((payment, index) => {
                                        // Display a row only if payment type is "full" and payment method is "cash"
                                        if (payment.type === "full" && payment.paymentmethod === 'cash') {
                                            return (
                                                <tr key={index}>
                                                    {/* Displaying payment data in table cells */}
                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {payment.paymentmethod && payment.paymentmethod}
                                                    </td>
                                                    <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {payment.amount && payment.amount} AED
                                                    </td>
                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {payment.paymentstatus && payment.paymentstatus}
                                                    </td>
                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {payment.checkorinvoice && payment.checkorinvoice}
                                                    </td>
                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {new Date(payment.date && payment.date).toDateString()}
                                                    </td>
                                                </tr>
                                            );
                                        } else {
                                            // If conditions are not met, return null to skip rendering this row
                                            return null;
                                        }
                                    })}
                                </tbody>
                            </Table>

                            <h3 style={{ textAlign: 'center' }} className='mt-5'>Cash Partial Information</h3>
                            <Table striped hover responsive style={{ border: '1px solid black' }} className='mb-5' >
                                <thead style={{ backgroundColor: '#005f75' }} >
                                    <th style={{ color: 'white', textAlign: 'center' }}>Payment Method</th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Amount </th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Payment Status</th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Check Invoice </th>
                                    <th style={{ color: 'white', textAlign: 'center' }}>Date </th>
                                </thead>
                                <tbody>
                                    {contractInfo?.payment.map((payment, index) => {
                                        // Check if payment type is "partial" and payment method is "cash"
                                        if (payment.type === "partial" && payment.paymentmethod === 'cash') {
                                            return (
                                                <tr key={index}>
                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {payment.bank && payment.bank}
                                                    </td>
                                                    <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {payment.amount && payment.amount} AED
                                                    </td>
                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {payment.paymentmethod && payment.paymentmethod}
                                                    </td>
                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {payment.paymentstatus && payment.paymentstatus}
                                                    </td>
                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {payment.checkorinvoice && payment.checkorinvoice}
                                                    </td>
                                                    <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }}>
                                                        {new Date(payment.date && payment.date).toDateString()}
                                                    </td>
                                                </tr>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                </tbody>
                            </Table>





                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};
export default TenantReport;