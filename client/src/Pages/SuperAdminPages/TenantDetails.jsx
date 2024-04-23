import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Button, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import SideBar from '../../Components/SideBar';
import html2pdf from 'html2pdf.js';
const TenantDetails = () => {
    const { id } = useParams(); // Fetch tenantId from route parameters
    const [tenantDetails, setTenantDetails] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTenantDetails = async () => {
            try {
                const response = await axios.get(`/api/tenants/tenant/${id}`);
                setTenantDetails(response.data);
            } catch (error) {
                setError('Failed to fetch tenant details');
            }
        };
        fetchTenantDetails();
    }, [id]); // Depend on tenantId

    const downloadAsPdf = () => {
        const element = document.getElementById('table-to-download');
        const opt = {
            margin: 1,
            filename: 'tenant_details.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).toPdf().get('pdf').then(function (pdf) {
            var totalPages = pdf.internal.getNumberOfPages();
            for (var i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(10);
                pdf.text('Page ' + i + ' of ' + totalPages, pdf.internal.pageSize.getWidth() / 3, pdf.internal.pageSize.getHeight() - 0.5);
            }
        }).save();
    };

    if (!tenantDetails) {
        return <p>Loading...</p>;
    }

    const { contractInfo, ownerId, property } = tenantDetails;

    return (
        <div>
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <div>
                        <SideBar />
                    </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '20px' }} >
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10} >

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px', alignItems: 'center' }} >
                                <h3 className='text-center'>Tenant Details</h3>
                                <Button style={{ color: 'white', backgroundColor: '#d588ff', border: 'none', borderRadius: '10px' }} onClick={downloadAsPdf}>Download as PDF</Button>
                            </div>

                            {/* Contract Details Table */}
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: '10px' }}>
                                <Table id="table-to-download" striped hover responsive style={{ border: '1px solid black', marginTop: '10px' }} key={contractInfo._id}>
                                    <thead style={{ backgroundColor: '#005f75' }} >
                                        <th rowSpan={2} colspan={2} style={{ color: 'white' }} >CONTRACT DETAILS</th>
                                        <th rowSpan={2} colspan={2} style={{ display: 'flex', justifyContent: 'end', color: 'white' }}>CONTRACT DETAILS </th>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6' }} >Contract No .</td>
                                            <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{tenantDetails._id}</td>
                                            <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Contract No .</td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6' }} >Starting Date</td>
                                            <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{new Date(contractInfo.startingDate).toLocaleDateString()}</td>
                                            <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Starting Date</td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6' }} >End Date</td>
                                            <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{new Date(contractInfo.endDate).toLocaleDateString()}</td>
                                            <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >End Date</td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6' }} >Security Deposit</td>
                                            <td className='text-center' style={{ backgroundColor: '#ffffff' }} > {contractInfo.securitydeposite && contractInfo.securitydeposite} </td>
                                            <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Security Deposit</td>
                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6' }} >Grace Period (days)</td>
                                            <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.graceperiod && contractInfo.graceperiod}</td>
                                            <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Grace Period (days)</td>
                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6' }} >Number of Occupants</td>
                                            <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.numberofoccupants && contractInfo.numberofoccupants}</td>
                                            <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Number of Occupants</td>
                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6' }} >Water and Elec Bill</td>
                                            <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.Waterandelecbill && contractInfo.Waterandelecbill}</td>
                                            <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Water and Elec Bill</td>
                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6' }} >Usage</td>
                                            <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.usage && contractInfo.usage}</td>
                                            <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Usage</td>
                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6' }} >Total Contract Amount</td>
                                            <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.totalContractAmount && contractInfo.totalContractAmount}</td>
                                            <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Total Contract Amount</td>
                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6' }} >VAT (%)</td>
                                            <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.VAT && contractInfo.VAT}</td>
                                            <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >VAT (%)</td>
                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6' }} >Other Cost</td>
                                            <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.otherCost && contractInfo.otherCost}</td>
                                            <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Other Cost</td>
                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6' }} >Parking</td>
                                            <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.parking ? 'Yes' : 'No'}</td>
                                            <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Parking</td>
                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6' }} >Discount</td>
                                            <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.discount && contractInfo.discount}</td>
                                            <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Discount</td>
                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6' }} >Final Amount</td>
                                            <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.finalAmount && contractInfo.finalAmount}</td>
                                            <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Final Amount</td>
                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6' }} >Paid Amount</td>
                                            <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.paidAmount && contractInfo.paidAmount}</td>
                                            <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Paid Amount</td>
                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6' }} >Bank</td>
                                            <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.bank && contractInfo.bank}</td>
                                            <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Bank</td>
                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6' }} >Total Checks</td>
                                            <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.totalChecks && contractInfo.totalChecks}</td>
                                            <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Total Checks</td>
                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6' }} >National ID</td>
                                            <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{ownerId.nid && ownerId.nid}</td>
                                            <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >National ID</td>
                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6' }} >Email</td>
                                            <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{ownerId.email && ownerId.email}</td>
                                            <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Email</td>
                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6' }} >Contact</td>
                                            <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{ownerId.contact && ownerId.contact}</td>
                                            <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Contact</td>
                                        </tr>

                                        {
                                            property.map((item) => {
                                                console.log(item, 'itemproperty');
                                                return (
                                                    <>
                                                        {
                                                            item.zone === "Abu dhabi" ?
                                                                <tr>
                                                                    <td style={{ backgroundColor: '#e7e6e6' }}>Property Name</td>
                                                                    <td className='text-center' >{item?.name && item?.name}</td>
                                                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Property Name</td>
                                                                </tr>
                                                                : null
                                                        }

                                                        {
                                                            item.zone === "Abu dhabi" ?
                                                                <tr>
                                                                    <td style={{ backgroundColor: '#e7e6e6' }}>Description</td>
                                                                    <td className='text-center'>{item?.description && item?.description}</td>
                                                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Description</td>
                                                                </tr>
                                                                : null
                                                        }

                                                        {
                                                            item.zone === "Abu dhabi" ?
                                                                <tr>
                                                                    <td style={{ backgroundColor: '#e7e6e6' }} >Address</td>
                                                                    <td className='text-center'>{item?.address && item?.address}</td>
                                                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Address</td>
                                                                </tr>
                                                                : null
                                                        }

                                                        {
                                                            item.zone === "Abu dhabi" ?
                                                                <tr>
                                                                    <td style={{ backgroundColor: '#e7e6e6' }}>City</td>
                                                                    <td className='text-center'>{item?.city && item?.city}</td>
                                                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >City</td>
                                                                </tr>
                                                                : null
                                                        }

                                                        {
                                                            item.zone === "Abu dhabi" ?
                                                                <tr>
                                                                    <td style={{ backgroundColor: '#e7e6e6' }} >Property Type</td>
                                                                    <td className='text-center'>{item?.propertyType && item?.propertyType}</td>
                                                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Property Type</td>
                                                                </tr>
                                                                : null
                                                        }
                                                    </>
                                                )
                                            })
                                        }

                                        {/* <tr>
                                        <td style={{ backgroundColor: '#e7e6e6' }}>Property Image</td>
                                        <td className='text-center'><img src={property[0]?.propertyImage} alt="Property" style={{ width:'100px' }} /></td>
                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }}>Property Image</td>
                                    </tr> */}

                                    </tbody>
                                </Table>
                            </Col>

                            {/* FIRST PARTY (LESSOR) TABLE */}
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }} className='mb-3' >
                                    <h4>FIRST PARTY (LESSOR)</h4>
                                    <h4>FIRST PARTY (LESSOR) Arabic </h4>
                                </div>
                                <Table striped hover responsive style={{ border: '1px solid black' }} id="table-to-download" >
                                    <thead style={{ backgroundColor: '#005f75' }} >
                                        <th rowSpan={2} colspan={4} style={{ color: 'white' }} >CONTRACT DETAILS</th>
                                        <th rowSpan={2} colspan={2} style={{ display: 'flex', justifyContent: 'end', color: 'white' }}>CONTRACT DETAILS </th>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                <p>Email</p>
                                                <p>Email (Arabic) </p>
                                            </td>
                                            <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                <p>Mobile No.</p>
                                                <p>Mobile No. (Arabic)</p>
                                            </td>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                <p>Nationality</p>
                                                <p>Nationality (Arabic)</p>
                                            </td>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                <p>Emirates ID No.</p>
                                                <p>Emirates ID No. (Arabic)</p>
                                            </td>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                <p>Full Name</p>
                                                <p>Full Name (Arabic)</p>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                {ownerId.email && ownerId.email}
                                            </td>
                                            <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                {ownerId.contact && ownerId.contact}
                                            </td>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                <div  >
                                                    {ownerId.nationality && ownerId.nationality}
                                                </div>
                                                <div className='mt-2' >
                                                    {ownerId.nationality && ownerId.nationality}
                                                </div>
                                            </td>


                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                {ownerId.emid && ownerId.emid}
                                            </td>


                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                <div>
                                                    {ownerId.name && ownerId.name}
                                                </div>
                                                <div className='mt-2' >
                                                    {ownerId.name && ownerId.name}
                                                </div>
                                            </td>
                                        </tr>

                                    </tbody>
                                </Table>



                                <Table striped responsive style={{ border: '1px solid black' }} id="table-to-download">
                                    <thead style={{ backgroundColor: '#e7e6e6' }} >
                                        <th rowSpan={2} colspan={2} style={{ color: 'black', fontWeight: 'bold' }} >Contract Person</th>
                                        <th rowSpan={2} colspan={2} style={{ display: 'flex', justifyContent: 'end', color: 'black', fontWeight: 'bold' }}>Contract Person</th>
                                    </thead>


                                    <tbody>
                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                Full Name
                                            </td>
                                            {
                                                property.map((prop) => {
                                                    console.log(prop, 'propssssss');
                                                    return (
                                                        <>
                                                            <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >    <p style={{ textTransform: 'uppercase' }} > {prop.cname && prop.cname} </p></td>
                                                            <td colSpan={3} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                                <p style={{ textTransform: 'uppercase' }} >{prop.cname && prop.cname}</p>
                                                            </td>
                                                        </>
                                                    )
                                                })
                                            }

                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                <p>Mobile No.</p>
                                            </td>
                                            {
                                                property.map((prop) => {
                                                    console.log(prop, 'propssssss');
                                                    return (
                                                        <>
                                                            <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >    <p style={{ textTransform: 'uppercase' }} > {prop.ccontact && prop.ccontact} </p></td>
                                                            <td colSpan={3} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                                <p style={{ textTransform: 'uppercase' }} >{prop.ccontact && prop.ccontact}</p>
                                                            </td>
                                                        </>
                                                    )
                                                })
                                            }
                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >

                                                <p>Email</p>

                                            </td>
                                            {
                                                property.map((prop) => {
                                                    console.log(prop, 'propssssss');
                                                    return (
                                                        <>
                                                            <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >    <p style={{ textTransform: 'uppercase' }} > {prop.cemail && prop.cemail} </p></td>
                                                            <td colSpan={3} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                                <p style={{ textTransform: 'uppercase' }} >{prop.cemail && prop.cemail}</p>
                                                            </td>
                                                        </>
                                                    )
                                                })
                                            }
                                        </tr>



                                    </tbody>
                                </Table>
                            </Col>

                            {/* SECOND PARTY (TENANT) TABLE */}
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }} className='mb-3' >
                                    <h4 style={{ textTransform: 'uppercase' }} >SECOND PARTY (TENANT)</h4>
                                    <h4>SECOND PARTY (TENANT)</h4>
                                </div>
                                <Table striped hover responsive style={{ border: '1px solid black' }} >
                                    <thead style={{ backgroundColor: '#005f75' }} >
                                        <th rowSpan={2} colspan={4} style={{ color: 'white' }} >TENANT DETAILS</th>
                                        <th rowSpan={2} colspan={2} style={{ display: 'flex', justifyContent: 'end', color: 'white' }}>TENANT DETAILS </th>
                                    </thead>


                                    <tbody>
                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                Email
                                            </td>
                                            <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                Mobile No.
                                            </td>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                License No.
                                            </td>
                                            <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >

                                                Company Name
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                {tenantDetails.email && tenantDetails.email}
                                            </td>
                                            <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                {tenantDetails.contact && tenantDetails.contact}
                                            </td>
                                            <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                {tenantDetails.licenseno && tenantDetails.licenseno}
                                            </td>

                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                {tenantDetails.companyname && tenantDetails.companyname}
                                            </td>
                                        </tr>

                                    </tbody>
                                </Table>


                            </Col>


                            {/* PROPERTY DETAILS TABLE */}
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: '30px' }}>
                                <div>
                                    <Table striped responsive style={{ border: '1px solid black' }} >
                                        <thead style={{ backgroundColor: '#005f75' }} >
                                            <th rowSpan={2} colspan={2} style={{ color: 'white' }} >PROPERTY DETAILS</th>
                                            <th rowSpan={2} colspan={2} style={{ display: 'flex', justifyContent: 'end', color: 'white' }}>PROPERTY DETAILS </th>
                                        </thead>


                                        <tbody>
                                            <tr>
                                                {
                                                    property.map((item) => {
                                                        console.log(item, 'itemproperty');
                                                        return (
                                                            <>
                                                                <td style={{ backgroundColor: '#e7e6e6' }} >   {item?.zone === 'Abu dhabi' ? <>Municipality</> : <>City</>}</td>
                                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >
                                                                    {item?.zone === 'Abu dhabi' ?
                                                                        <>
                                                                            {item.municipality && item.municipality}
                                                                        </>
                                                                        :
                                                                        <>
                                                                            {item.city && item.city}
                                                                        </>
                                                                    }
                                                                </td>
                                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} > {item?.zone === 'Abu dhabi' ? <>Municipality</> : <>City</>}</td>
                                                            </>
                                                        )
                                                    })
                                                }


                                            </tr>
                                            <tr>
                                                {
                                                    property.map((item) => {
                                                        return (
                                                            <>
                                                                <td style={{ backgroundColor: '#e7e6e6' }} >
                                                                    {item?.zone === 'Abu dhabi' ? <>Zone</> : <>PropertyType</>}
                                                                </td>
                                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >
                                                                    {item?.zone === 'Abu dhabi' ?
                                                                        <>
                                                                            {item.zone && item.zone}

                                                                        </>
                                                                        :
                                                                        <>
                                                                            {item.propertyType && item.propertyType}
                                                                        </>
                                                                    }
                                                                </td>
                                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >  {item?.zone === 'Abu dhabi' ? <>Zone</> : <>PropertyType</>}</td>
                                                            </>
                                                        )
                                                    })
                                                }

                                            </tr>
                                            <tr>
                                                {
                                                    property.map((item) => {
                                                        console.log(item, 'itemproperty');
                                                        return (
                                                            <>
                                                                <td style={{ backgroundColor: '#e7e6e6' }} >   {item?.zone === 'Abu dhabi' ? <>Sector</> : <>NameandStreet</>}</td>
                                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >
                                                                    {item?.zone === 'Abu dhabi' ?
                                                                        <>
                                                                            {item.sector && item.sector}

                                                                        </>
                                                                        :
                                                                        <>
                                                                            {item.nameandstreet && item.nameandstreet}
                                                                        </>
                                                                    }
                                                                </td>
                                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} > {item?.zone === 'Abu dhabi' ? <>Sector</> : <>NameandStreet</>}</td>
                                                            </>
                                                        )
                                                    })
                                                }


                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Road Name</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >
                                                    {property.map((roadname) => (roadname?.roadName && roadname?.roadName))}
                                                </td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Road Name</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Plot No</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} > {property.map((plot) => (plot?.plotNo && plot?.plotNo))}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Plot No</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Plot Address</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{property.map((plotaddress) => (plotaddress?.plotAddress && plotaddress?.plotAddress))}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Plot Address</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Onwani Address</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{property.map((Onwani) => (Onwani?.onwaniAddress && Onwani?.onwaniAddress))}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Onwani Address</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Property No</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{property.map((propNo) => (propNo?.propertyNo && propNo?.propertyNo))}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Property No</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Property Registration No</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{property.map((regNo) => (regNo?.propertyRegistrationNo && regNo?.propertyRegistrationNo))}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Property Registration No</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Property Name</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{property.map((propName) => (propName?.name && propName?.name))}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Property Name</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Property Type</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{property.map((propType) => (propType?.propertyType && propType?.propertyType))}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Property Type</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>

                            {/* Fifth TABLE */}
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: '30px' }}>
                                <Table striped responsive style={{ border: '1px solid black' }} >
                                    <thead style={{ backgroundColor: '#005f75' }} >
                                        <th rowSpan={2} colspan={10} style={{ color: 'white' }} >Unit Details</th>
                                        <th rowSpan={2} colspan={2} style={{ display: 'flex', justifyContent: 'end', color: 'white' }}>Unit Details </th>
                                    </thead>


                                    <tbody>
                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                Premise No.
                                            </td>
                                            <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                Unit Usage
                                            </td>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >

                                                No.of rooms
                                            </td>
                                            <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                Area
                                            </td>

                                            <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                Unit Type
                                            </td>

                                            <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                Unit Reg No.
                                            </td>
                                            <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >

                                                Unit No.
                                            </td>
                                        </tr>

                                        {
                                            tenantDetails?.unitId && tenantDetails?.unitId.map((unitdetail) => {
                                                console.log(unitdetail, 'unitdetail');
                                                return (
                                                    <>
                                                        <tr>
                                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                                {unitdetail.premiseNo && unitdetail.premiseNo}
                                                            </td>
                                                            <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                                Commercial
                                                            </td>
                                                            <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                                __

                                                            </td>

                                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                                ___
                                                            </td>

                                                            <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                                {unitdetail.type && unitdetail.type}
                                                            </td>

                                                            <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                                {unitdetail.unitRegNo && unitdetail.unitRegNo}
                                                            </td>

                                                            <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                                {unitdetail.unitNo && unitdetail.unitNo}
                                                            </td>
                                                        </tr>
                                                    </>
                                                )
                                            })
                                        }


                                    </tbody>
                                </Table>


                            </Col>

                        </Col>
                    </Row>
                </Col>

            </Row>
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default TenantDetails;