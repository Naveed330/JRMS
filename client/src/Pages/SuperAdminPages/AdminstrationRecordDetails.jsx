import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import SideBar from '../../Components/SideBar'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import jsPDF from 'jspdf';

const AdministrationRecordDetail = () => {
    const [adminstractionRecordDetails, setAdminstractionRecordDetails] = useState({})
    const { id } = useParams()

    // console.log(adminstractionRecordDetails.tenantId.contractNo
    //     , 'paramsid');

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

    const filteredKeys = Object.keys(adminstractionRecordDetails).filter(key => desiredKeys.includes(key));
    console.log(filteredKeys, 'filteredKeysfilteredKeys');


    useEffect(() => {
        axios.get(`/api/adminstrationfees/administration-fee/${id}`)
            .then(response => {
                setAdminstractionRecordDetails(response.data);
            })
            .catch(error => {
                console.error('Error fetching tenants:', error);
            });
    }, [])


    const calculateTotalAmount = () => {
        let total = 0;
        desiredKeys.forEach(key => {
            total += adminstractionRecordDetails[key] ? parseFloat(adminstractionRecordDetails[key]) : 0;
        });
        return total;
    };

    // const downloadInvoice = () => {
    //     const doc = new jsPDF();
    //     doc.text(`Tenant Name: ${adminstractionRecordDetails?.tenantId?.name}`, 10, 10);
    //     doc.text(`Contract Duration: ${adminstractionRecordDetails?.tenantId?.contractInfo?.monthsDuration}`, 10, 20);
    //     doc.text(`property Name: ${adminstractionRecordDetails?.tenantId?.property?.name}`, 10, 30);
    //     doc.text(`Floor Name: ${adminstractionRecordDetails?.tenantId?.floorId?.name}`, 10, 40);
    //     // doc.text(`UnitNo . : ${adminstractionRecordDetails.tenantId.unitId && adminstractionRecordDetails.tenantId.unitId.map((a) => a?.unitNo ? a?.unitNo : null)}`, 10, 50);
    //     doc.text(`Contract No . : ${adminstractionRecordDetails?.tenantId?.contractNo}`, 10, 60);
    //     doc.text('Services:', 10, 30);
    //     desiredKeys.forEach((key, index) => {
    //         const value = adminstractionRecordDetails[key] || 'N/A';
    //         doc.text(`${key}: ${value}`, 20, 40 + (index * 10));
    //     });
    //     doc.text(`Total Amount: ${calculateTotalAmount()}`, 10, 150);
    //     doc.save(`${adminstractionRecordDetails?.tenantId?.name}_Invoice.pdf`);
    // };

    const downloadInvoice = () => {
        const doc = new jsPDF();
        doc.text(`Tenant Name: ${adminstractionRecordDetails?.tenantId?.name}`, 10, 10);
        doc.text(`Contract Duration: ${adminstractionRecordDetails?.tenantId?.contractInfo?.monthsDuration}`, 10, 20);
        doc.text(`Property Name: ${adminstractionRecordDetails?.tenantId?.property?.name}`, 10, 30);
        doc.text(`Floor Name: ${adminstractionRecordDetails?.tenantId?.floorId?.name}`, 10, 40);
        // doc.text(`Unit No.: ${adminstractionRecordDetails.tenantId.unitId && adminstractionRecordDetails.tenantId.unitId.map((a) => a?.unitNo ? a?.unitNo : null)}`, 10, 50);
        doc.text(`Contract No.: ${adminstractionRecordDetails?.tenantId?.contractNo}`, 10, 50);
        doc.text('Services:', 10, 60);
        desiredKeys.forEach((key, index) => {
            const value = adminstractionRecordDetails[key] || 'N/A';
            doc.text(`${key}: ${value}`, 20, 80 + (index * 10), { align: 'left' });
        });
        doc.text(`Total Amount: ${calculateTotalAmount()}`, 10, 180, { align: 'left' });
        doc.save(`${adminstractionRecordDetails?.tenantId?.name}_Invoice.pdf`);
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
                                        <th style={{ color: '#ffff' }}>Property Name</th>
                                        <th style={{ color: '#ffff' }}>Floor Name</th>
                                        {/* <th>UnitNo .</th> */}
                                        <th style={{ color: '#ffff' }}>Contract No.</th>
                                        <th style={{ color: '#ffff' }}>Services</th>
                                        <th style={{ color: '#ffff' }}>Total Amount</th>
                                        <th style={{ color: '#ffff' }}>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <>
                                        <tr>

                                            <td> {adminstractionRecordDetails?.tenantId?.name && adminstractionRecordDetails?.tenantId?.name} </td>
                                            <td> {adminstractionRecordDetails?.tenantId?.contractInfo?.monthsDuration && adminstractionRecordDetails?.tenantId?.contractInfo?.monthsDuration} </td>
                                            <td> {adminstractionRecordDetails?.tenantId?.property?.name && adminstractionRecordDetails?.tenantId?.property?.name} </td>
                                            <td> {adminstractionRecordDetails?.tenantId?.floorId?.name && adminstractionRecordDetails?.tenantId?.floorId?.name} </td>
                                            {/* <td>  {adminstractionRecordDetails.tenantId.unitId && adminstractionRecordDetails.tenantId.unitId.map((a) => a?.unitNo ? a?.unitNo : null)} </td> */}
                                            <td> {adminstractionRecordDetails?.tenantId?.contractNo && adminstractionRecordDetails?.tenantId?.contractNo} </td>
                                            <td>
                                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    {filteredKeys.map((key, keyIndex) => (
                                                        <li key={keyIndex}>{key}</li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td>{calculateTotalAmount()} AED</td>
                                            <td><Button onClick={() => downloadInvoice()}>Download Invoice</Button></td>

                                        </tr>
                                    </>
                                </tbody>



                                {/* <tbody>
                                    {
                                        adminstractionRecordDetails.map((record, index) => {
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
                                                        <td> {record.tenantId.name && record.tenantId.name} </td>
                                                        <td> {record.tenantId.contractInfo.monthsDuration && record.tenantId.contractInfo.monthsDuration} </td>
                                                        <td>
                                                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                {filteredKeys.map((key, keyIndex) => (
                                                                    <li key={keyIndex}>{key}</li>
                                                                ))}
                                                            </ul>

                                                        </td>
                                                        <td>{calculateAmount(record)}</td>
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

                                </tbody> */}
                            </Table>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default AdministrationRecordDetail