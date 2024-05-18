import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Button, Col, Row, Table } from 'react-bootstrap';
import SideBar from '../../Components/SideBar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Link } from 'react-router-dom';

const AdministrationRecord = () => {
    const [adminstractionRecord, setAdminstractionRecord] = useState([])

    const desiredKeys = [
        'contractIssuingFees',
        'ejariFee',
        'transferFees',
        'terminationFees',
        'contractExpiryFees',
        'maintenanceSecurityDeposit',
        'refundableGuarantee',
        'lateRenewalFees',
        'postponeChequeFees'
    ];



    useEffect(() => {
        axios.get('/api/adminstrationfees/all-administration-fees')
            .then(response => {
                setAdminstractionRecord(response.data);
            })
            .catch(error => {
                console.error('Error fetching tenants:', error);
            });
    }, [])

    const calculateAmount = (record) => {
        const amount = Object.values(record).filter(value => typeof value === 'number').reduce((acc, val) => acc + val, 0);
        return amount.toFixed(2);
    };

    const calculateTotalAmount = (record) => {
        const maintenanceDeposit = parseFloat(record.maintenanceSecurityDeposit) || 0;
        const refundableGuarantee = parseFloat(record.refundableGuarantee) || 0;
        return (maintenanceDeposit + refundableGuarantee).toFixed(2);
    };

    const downloadInvoice = (record) => {

        const amount = calculateAmount(record);
        const totalAmount = calculateTotalAmount(record);
        console.log(totalAmount, 'totalamount');

        const doc = new jsPDF();
        doc.text(`Tenant Name: ${record.tenantId.name}`, 10, 10);
        doc.text(`Contract Duration: ${record.tenantId.contractInfo.monthsDuration}`, 10, 20);
        doc.text('Services:', 10, 30);
        doc.text(`${Object.keys(record).filter(key => desiredKeys.includes(key)).join(', ')}`, 20, 40);
        doc.text(`Total Amount: ${amount}`, 10, 60);
        // doc.text(`Total Amount: ${totalAmount}`, 10, 70);
        doc.save(`${record.tenantId.name}_Invoice.pdf`);
    };


    return (
        <div>
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <div>
                        <SideBar />
                    </div>
                </Col>

                <Col xs={12} sm={12} md={12} lg={10} xl={10}  >
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10} >
                            <h3 className='text-center' style={{ marginTop: '100px' }} >Administration Record</h3>
                            <Table striped bordered hover responsive >
                                <thead style={{ backgroundColor: '#005f75' }} >
                                    <tr>
                                        <th style={{ color: '#ffff' }} >Tenant Name</th>
                                        <th style={{ color: '#ffff' }} >Contract Duration</th>
                                        <th style={{ color: '#ffff' }} >Services</th>
                                        <th style={{ color: '#ffff' }}>Total Amount</th>
                                        {/* <th>Total Amount</th> */}
                                        <th style={{ color: '#ffff' }}>Action</th>
                                    </tr>
                                </thead>


                                <tbody>
                                    {
                                        adminstractionRecord.map((record, index) => {
                                            const filteredKeys = Object.keys(record).filter(key => desiredKeys.includes(key));

                                            const totalAmount = [
                                                record.contractIssuingFees,
                                                record.ejariFee,
                                                record.transferFees,
                                                record.terminationFees,
                                                record.contractExpiryFees,
                                                record.maintenanceSecurityDeposit,
                                                record.refundableGuarantee,
                                                record.lateRenewalFees,
                                                record.postponeChequeFees
                                            ].reduce((acc, fee) => acc + (fee ? parseFloat(fee) : 0), 0);

                                            return (
                                                <>
                                                    <tr key={index} >
                                                        <td> {record?.tenantId?.name ? record?.tenantId?.name : ' N/A'} </td>
                                                        <td> {`${record?.tenantId?.contractInfo?.monthsDuration ? record?.tenantId?.contractInfo?.monthsDuration : 'N/A'} Months`} </td>
                                                        <td>
                                                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                {filteredKeys.map((key, keyIndex) => (
                                                                    <li key={keyIndex}>{key}</li>
                                                                ))}
                                                            </ul>

                                                        </td>
                                                        <td>{calculateAmount(record)} AED</td>
                                                        {/* <td>{calculateTotalAmount(record)}</td> */}

                                                        {/* <td> {totalAmount && totalAmount} </td> */}

                                                        {/* <td><Button onClick={() => downloadInvoice(record)}>Invoice</Button></td> */}
                                                        <td>
                                                            <Link
                                                                variant="primary"
                                                                to={`/administrationrecorddetail/${record._id}`}
                                                                style={{ backgroundColor: '#301bbe', color: 'white', textDecoration: 'none', borderRadius: '10px' }}
                                                                className='py-2 px-3'
                                                            >
                                                                View
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                </>
                                            )
                                        })
                                    }

                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default AdministrationRecord