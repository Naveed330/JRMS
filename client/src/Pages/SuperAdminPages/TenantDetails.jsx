import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Button, Col, Row } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import SideBar from '../../Components/SideBar';
import html2pdf from 'html2pdf.js';
import logo from '../../Components/logo.png'
import { AuthContext } from '../AuthContext';

const TenantDetails = () => {
    const { id } = useParams(); // Fetch tenantId from route parameters
    const [tenantDetails, setTenantDetails] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate()
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
    // Depend on tenantId

    // const downloadAsPdf = () => {

    //     const element = document.getElementById('table-to-download');
    //     console.log(element, 'element');
    //     const opt = {
    //         margin: 1,
    //         filename: 'tenant_details.pdf',
    //         image: { type: 'jpeg', quality: 0.98 },
    //         html2canvas: { scale: 2 },
    //         jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    //     };
    //     html2pdf().from(element).set(opt).toPdf().get('pdf').then(function (pdf) {
    //         var totalPages = pdf.internal.getNumberOfPages();
    //         for (var i = 1; i <= totalPages; i++) {
    //             pdf.setPage(i);
    //             pdf.setFontSize(10);
    //             pdf.text('Page ' + i + ' of ' + totalPages, pdf.internal.pageSize.getWidth() / 3, pdf.internal.pageSize.getHeight() - 0.5);
    //         }
    //     }).save();
    // };


    if (!tenantDetails) {
        return <p>Loading...</p>;
    }

    const { contractInfo, ownerId, property } = tenantDetails;
    console.log(tenantDetails, 'contractInfo');

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

                            <div id="table-to-download" style={{ marginTop: '90px' }} >

                                {/* <div style={{ marginTop: '70px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                <h4>Jovera Group A Complete Real-Estate and  Financial Solution </h4>
                                <img src={logo} alt="logo" style={{ width: '100px' }} />
                                <h4>Jovera Group حل عقاري ومالي متكامل</h4>
                            </div> */}

                                {/* <div className='mt-2' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                <h5 style={{ textTransform: 'uppercase' }} >Tenancy Contract & Tax Invoice</h5>
                            </div> */}

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', alignItems: 'center' }} >
                                    <h3 className='text-center'>Tenant Details</h3>
                                    {/* <Button style={{ color: 'white', backgroundColor: '#d588ff', border: 'none', borderRadius: '10px' }} onClick={downloadAsPdf}>Download as PDF</Button> */}
                                    <Button variant='success' style={{ color: 'white', border: 'none', borderRadius: '10px' }} onClick={() => navigate('/staticdata', { state: { tenantDetails } })}>Proceed to Download</Button>
                                </div>




                                {/* Contract Details Table */}
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: '10px' }}>
                                    <Table striped hover responsive style={{ border: '1px solid black', marginTop: '10px' }} key={contractInfo._id}>
                                        <thead style={{ backgroundColor: '#005f75' }} >
                                            <th rowSpan={2} colspan={2} style={{ color: 'white' }} >CONTRACT DETAILS</th>
                                            <th rowSpan={2} colspan={2} style={{ display: 'flex', justifyContent: 'end', color: 'white' }}>تفاصيل العقد</th>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Contract No .</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{tenantDetails.contractNo}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >رقم العقد</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Tenant Name</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{tenantDetails.name && tenantDetails.name || tenantDetails.companyname && tenantDetails.companyname}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >ضريبة القيمة المضافة (%)</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Issue Date</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{new Date(tenantDetails.updatedAt).toLocaleDateString()}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >تاريخ البدء</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Owner Name</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} > {tenantDetails.ownerId.name && tenantDetails.ownerId.name}  </td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >مبلغ التأمين</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Owner Contact</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} > {tenantDetails.ownerId.contact && tenantDetails.ownerId.contact}  </td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >مبلغ التأمين</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Owner Email</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} > {tenantDetails.ownerId.email && tenantDetails.ownerId.email}  </td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >مبلغ التأمين</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Property</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{property.name && property.name}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >فاتورة المياه والكهرباء</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Floor Name</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{tenantDetails.floorId.name && tenantDetails.floorId.name}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >فاتورة المياه والكهرباء</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Unit No</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{tenantDetails?.unitId[0]?.unitNo}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >فاتورة المياه والكهرباء</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Sector</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{tenantDetails.property.sector && tenantDetails.property.sector}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >إجمالي مبلغ العقد</td>
                                            </tr>

                                          


                                            {/* <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Plot No</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{tenantDetails.property.pilotno && tenantDetails.property.pilotno}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >الاستخدام</td>
                                            </tr> */}

                                            {/* <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Other Cost</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.otherCost && contractInfo.otherCost}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >تكلفة أخرى</td>
                                            </tr> */}

                                            {/* <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Parking</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.parking ? 'Yes' : 'No'}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >موقف سيارات</td>
                                            </tr> */}

                                            {/* <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Discount</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.discount && contractInfo.discount}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >تخفيض</td>
                                            </tr> */}

                                            {/* <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Final Amount</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.finalAmount && contractInfo.finalAmount} AED</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >القيمة النهائية</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Paid Amount</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.paidAmount && contractInfo.paidAmount} AED</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >المبلغ المدفوع</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Bank</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.bank && contractInfo.bank}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >بنك</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Total Checks</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{contractInfo.totalChecks && contractInfo.totalChecks}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >إجمالي الشيكات</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >National ID</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{ownerId.nid && ownerId.nid}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >الهوية الوطنية</td>
                                            </tr> */}

                                            {/* <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Email</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{ownerId.email && ownerId.email}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >بريد إلكتروني</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Contact</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{ownerId.contact && ownerId.contact}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >اتصال</td>
                                            </tr> */}

                                            {/* {
        property?.map((item) => {
            console.log(item, 'itemproperty');
            return (
                <> */}
                                            {
                                                property.zone === "Abu dhabi" ?
                                                    <tr>
                                                        <td style={{ backgroundColor: '#e7e6e6' }}>Property Name</td>
                                                        <td className='text-center' >{property?.name && property?.name}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >اسم الخاصية</td>
                                                    </tr>
                                                    : null
                                            }

                                            {
                                                property.zone === "Abu dhabi" ?
                                                    <tr>
                                                        <td style={{ backgroundColor: '#e7e6e6' }}>Description</td>
                                                        <td className='text-center'>{property?.description && property?.description}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >وصف</td>
                                                    </tr>
                                                    : null
                                            }

                                            {
                                                property.zone === "Abu dhabi" ?
                                                    <tr>
                                                        <td style={{ backgroundColor: '#e7e6e6' }} >Address</td>
                                                        <td className='text-center'>{property?.address && property?.address}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >عنوان</td>
                                                    </tr>
                                                    : null
                                            }

                                            {
                                                property.zone === "Abu dhabi" ?
                                                    <tr>
                                                        <td style={{ backgroundColor: '#e7e6e6' }}>City</td>
                                                        <td className='text-center'>{property?.city && property?.city}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >مدينة</td>
                                                    </tr>
                                                    : null
                                            }

                                            {
                                                property.zone === "Abu dhabi" ?
                                                    <tr>
                                                        <td style={{ backgroundColor: '#e7e6e6' }} >Property Type</td>
                                                        <td className='text-center'>{property?.propertyType && property?.propertyType}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >نوع الملكية</td>
                                                    </tr>
                                                    : null
                                            }
                                            {/* </>
            )
        })
    } */}

                                            {/* <tr>
    <td style={{ backgroundColor: '#e7e6e6' }}>Property Image</td>
    <td className='text-center'><img src={property[0]?.propertyImage} alt="Property" style={{ width:'100px' }} /></td>
    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }}>Property Image</td>
</tr> */}

                                        </tbody>
                                    </Table>
                                </Col>

                            </div>

                            {/* FIRST PARTY (LESSOR) TABLE */}
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }} className='mb-3' >
                                    <h4>FIRST PARTY (LESSOR)</h4>
                                    <h4>الطرف الأول (المؤجر) </h4>
                                </div>
                                <Table striped hover responsive style={{ border: '1px solid black' }} id="table-to-download" >
                                    <thead style={{ backgroundColor: '#005f75' }} >
                                        <th rowSpan={2} colspan={4} style={{ color: 'white' }} >CONTRACT DETAILS</th>
                                        <th rowSpan={2} colspan={2} style={{ display: 'flex', justifyContent: 'end', color: 'white' }}>تفاصيل العقد </th>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                Email
                                            </td>
                                            <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                Mobile No
                                            </td>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                Nationality
                                            </td>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                Emirates ID No
                                            </td>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                Full Name
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
                                                {ownerId.nationality && ownerId.nationality}
                                            </td>


                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                {ownerId.emid && ownerId.emid}
                                            </td>


                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                {ownerId.name && ownerId.name}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                بريد إلكتروني
                                            </td>
                                            <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                رقم المحمول
                                            </td>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                جنسية
                                            </td>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                رقم الهوية الإماراتية
                                            </td>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                الاسم الكامل
                                            </td>
                                        </tr>

                                    </tbody>
                                </Table>



                                <Table striped responsive style={{ border: '1px solid black', marginTop: '1px' }} id="table-to-download">
                                    <thead style={{ backgroundColor: '#e7e6e6' }} >
                                        <th rowSpan={2} colspan={2} style={{ color: 'black', fontWeight: 'bold' }} >Contract Person</th>
                                        <th rowSpan={2} colspan={2} style={{ display: 'flex', justifyContent: 'end', color: 'black', fontWeight: 'bold' }}>شخص عقد</th>
                                    </thead>


                                    <tbody>
                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                Full Name
                                            </td>
                                            {/* {
                                            property.map((prop) => {
                                                console.log(prop, 'propssssss');
                                                return (
                                                    <> */}
                                            <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >    <p style={{ textTransform: 'uppercase' }} > {property.cname && property.cname} </p></td>
                                            <td colSpan={3} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                <p style={{ textTransform: 'uppercase' }} >{property.cname && property.cname}</p>
                                            </td>
                                            {/* </>
                                                )
                                            })
                                        } */}

                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                <p>Mobile No.</p>
                                            </td>
                                            {/* {
                                            property.map((prop) => {
                                                console.log(prop, 'propssssss');
                                                return (
                                                    <> */}
                                            <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >    <p style={{ textTransform: 'uppercase' }} > {property.ccontact && property.ccontact} </p></td>
                                            <td colSpan={3} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                <p style={{ textTransform: 'uppercase' }} >{property.ccontact && property.ccontact}</p>
                                            </td>
                                            {/* </>
                                                )
                                            })
                                        } */}
                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >

                                                <p>Email</p>

                                            </td>
                                            {/* {
                                            property.map((prop) => {
                                                console.log(prop, 'propssssss');
                                                return (
                                                    <> */}
                                            <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >    <p style={{ textTransform: 'uppercase' }} > {property.cemail && property.cemail} </p></td>
                                            <td colSpan={3} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                <p style={{ textTransform: 'uppercase' }} >{property.cemail && property.cemail}</p>
                                            </td>
                                            {/* </>
                                                )
                                            })
                                        } */}
                                        </tr>



                                    </tbody>
                                </Table>
                            </Col>

                            {/* SECOND PARTY (TENANT) TABLE */}
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }} className='mb-3' >
                                    <h4 style={{ textTransform: 'uppercase' }} >SECOND PARTY (TENANT)</h4>
                                    <h4>الطرف الثاني (المستأجر)</h4>
                                </div>
                                <Table striped hover responsive style={{ border: '1px solid black' }} >
                                    <thead style={{ backgroundColor: '#005f75' }} >
                                        <th rowSpan={2} colspan={4} style={{ color: 'white' }} >TENANT DETAILS</th>
                                        <th rowSpan={2} colspan={2} style={{ display: 'flex', justifyContent: 'end', color: 'white' }}>تفاصيل المستأجر </th>
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
                                            <th rowSpan={2} colspan={2} style={{ display: 'flex', justifyContent: 'end', color: 'white' }}>تفاصيل اوضح </th>
                                        </thead>


                                        <tbody>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Property Name</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >
                                                    {property.name && property.name}
                                                    {/* {property.map((propName) => (propName?.name && propName?.name))} */}
                                                </td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >اسم الخاصية</td>
                                            </tr>
                                            <tr>
                                                {/* {
                                                property.map((item) => {
                                                    console.log(item, 'itemproperty');
                                                    return (
                                                        <> */}
                                                <td style={{ backgroundColor: '#e7e6e6' }} >
                                                    {/* {property?.zone === 'Abu dhabi' ?  */}
                                                    Municipality
                                                    {/* : <>City</>} */}
                                                </td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >
                                                    {/* {property?.zone === 'Abu dhabi' ?
                                                    <> */}
                                                    {property.municipality && property.municipality}
                                                    {/* </>
                                                    :
                                                    <>
                                                        {property.city && property.city}
                                                    </>
                                                } */}
                                                </td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >
                                                    {/* {property?.zone === 'Abu dhabi' ? 
                                                 <> */}
                                                    البلدية
                                                    {/* </> :
                                                  <>City</>} */}
                                                </td>
                                                {/* </>
                                                    )
                                                })
                                            } */}


                                            </tr>
                                            <tr>
                                                {/* {
                                                property.map((item) => {
                                                    return (
                                                        <> */}
                                                <td style={{ backgroundColor: '#e7e6e6' }} >
                                                    {/* {property?.zone === 'Abu dhabi' ?  */}
                                                    Zone
                                                    {/* : <>PropertyType</>} */}
                                                </td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >
                                                    {/* {property?.zone === 'Abu dhabi' ?
                                                    <> */}
                                                    {property.zone && property.zone}

                                                    {/* </>
                                                    :
                                                    <>
                                                        {property.propertyType && property.propertyType}
                                                    </>
                                                } */}
                                                </td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >
                                                    {/* {property?.zone === 'Abu dhabi' ?  */}
                                                    منطقة
                                                    {/* : <>PropertyType</>}. */}
                                                </td>
                                                {/* </>
                                                    )
                                                })
                                            } */}

                                            </tr>
                                            <tr>
                                                {/* {
                                                property.map((item) => {
                                                    console.log(item, 'itemproperty');
                                                    return (
                                                        <> */}
                                                <td style={{ backgroundColor: '#e7e6e6' }} >
                                                    {/* {property?.zone === 'Abu dhabi' ? */}
                                                    Sector
                                                    {/* : <>NameandStreet</>} */}
                                                </td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >
                                                    {/* {property?.zone === 'Abu dhabi' ?
                                                    <> */}
                                                    {property.sector && property.sector}

                                                    {/* </>
                                                    :
                                                    <>
                                                        {property.nameandstreet && property.nameandstreet}
                                                    </>
                                                } */}
                                                </td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >
                                                    {/* {property?.zone === 'Abu dhabi' ?  */}
                                                    قطاع
                                                    {/* : <>PropertyType</>}. */}
                                                </td>



                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Property Type</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >
                                                    {property.propertyType && property.propertyType}
                                                    {/* {property.map((propType) => (propType?.propertyType && propType?.propertyType))} */}
                                                </td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >نوع الملكية</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Onwani Address</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >
                                                    {property.onwaniAddress && property.onwaniAddress}
                                                    {/* {property.map((Onwani) => (Onwani?.onwaniAddress && Onwani?.onwaniAddress))} */}
                                                </td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >عنوان العنواني</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Plot Address</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >
                                                    {/* {property.map((plotaddress) => (plotaddress?.plotAddress && plotaddress?.plotAddress))} */}
                                                    {property.plotAddress && property.plotAddress}
                                                </td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >عنوان قطعة الأرض</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Plot No</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >
                                                    {/* {property.map((plot) => (plot?.plotNo && plot?.plotNo))} */}
                                                    {property.plotNo && property.plotNo}
                                                </td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >القطعة رقم</td>
                                            </tr>



                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Property No</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >
                                                    {/* {property.map((propNo) => (propNo?.propertyNo && propNo?.propertyNo))} */}
                                                    {property.propertyNo && property.propertyNo}
                                                </td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >رقم العقار</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Property Registration No</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >
                                                    {property.propertyRegistrationNo && property.propertyRegistrationNo}
                                                    {/* {property.map((regNo) => (regNo?.propertyRegistrationNo && regNo?.propertyRegistrationNo))} */}
                                                </td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >رقم تسجيل العقار</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Road Name</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >
                                                    {property.roadName && property.roadName}
                                                    {/* {property.map((roadname) => (roadname?.roadName && roadname?.roadName))} */}
                                                </td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >اسم الطريق</td>
                                            </tr>




                                        </tbody>
                                    </Table>
                                </div>
                            </Col>

                            {/* Fifth TABLE */}
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: '30px', marginBottom: '50px' }}>
                                <Table striped responsive style={{ border: '1px solid black' }} >
                                    <thead style={{ backgroundColor: '#005f75' }} >
                                        <th rowSpan={2} colspan={10} style={{ color: 'white' }} >Unit Details</th>
                                        <th rowSpan={2} colspan={2} style={{ display: 'flex', justifyContent: 'end', color: 'white' }}>تفاصيل الوحدة </th>
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