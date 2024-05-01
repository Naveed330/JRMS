import React, { useState } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import SideBar from '../Components/SideBar';
import logo from './logo.png'
import html2pdf from 'html2pdf.js';
import { useNavigate } from 'react-router-dom';
import AdminSideBar from './AdminSideBar';
const StaticTenantData = () => {
    const [isDownloadClicked, setIsDownloadClicked] = useState(false);
    const [marginTop, setMarginTop] = useState('70px');
    const location = useLocation();
    const state = location.state;
    const navigate = useNavigate()

    const { contractInfo, ownerId, property } = state.tenantDetails;

    const downloadAsPdf = () => {
        setIsDownloadClicked(true);
        setMarginTop('-19px');
        const element = document.getElementById('table-to-download');

        const tableWidth = element.offsetWidth;

        const numberOfColumns = 4;

        const columnWidth = tableWidth / numberOfColumns;

        const scale = 1 / (columnWidth / 700);

        const opt = {
            margin: 1,
            filename: 'tenant_details.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: scale },
            jsPDF: { unit: 'cm', format: 'legal', orientation: 'portrait' }
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

    return (
        <div  >
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <div>
                        <AdminSideBar />
                    </div>
                </Col>

                <Col xs={12} sm={12} md={12} lg={10} xl={10}  >
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10} >
                            <div id="table-to-download" style={{ marginTop: marginTop }}>

                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                    <h4>Jovera Group </h4>
                                    <img src={logo} alt="logo" style={{ width: '100px' }} />
                                    <h4>Jovera Group </h4>
                                </div>

                                <div className='mt-2' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                    <h3 style={{ textTransform: 'uppercase' }} >Tenancy Contract & Tax Invoice</h3>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', alignItems: 'center' }} >
                                    <h3 className='text-center'>Tenant Details</h3>
                                    {/* <Button style={{ color: 'white', backgroundColor: '#d588ff', border: 'none', borderRadius: '10px' }} onClick={downloadAsPdf}>Download as PDF</Button> */}
                                    {!isDownloadClicked && (
                                        <Button variant="danger" style={{ color: 'white', border: 'none', borderRadius: '10px' }} onClick={downloadAsPdf} >Download as PDF</Button>
                                    )}                                </div>




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
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{state.tenantDetails.contractNo}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >رقم العقد</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Issue Date</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{new Date(state.tenantDetails.updatedAt).toLocaleDateString()}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >تاريخ البدء</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Starting Date</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{new Date(state.tenantDetails.contractInfo.startingDate).toLocaleDateString()}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >تاريخ البدء</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Ending Date</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{new Date(state.tenantDetails.contractInfo.endDate).toLocaleDateString()}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >تاريخ البدء</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Duration</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{`${state.tenantDetails.contractInfo.monthsDuration} Months`}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >تاريخ البدء</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Final Amount</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{`${state.tenantDetails.contractInfo.finalAmount} AED`}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >تاريخ البدء</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Total checks</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{`${state.tenantDetails.contractInfo.totalChecks}`}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >تاريخ البدء</td>
                                            </tr>


                                           
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

                                                <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Floor Name</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{state.tenantDetails.floorId.name && state.tenantDetails.floorId.name}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >فاتورة المياه والكهرباء</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >Unit No</td>
                                                <td className='text-center' style={{ backgroundColor: '#ffffff' }} >{state.tenantDetails?.unitId[0]?.unitNo}</td>
                                                <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >فاتورة المياه والكهرباء</td>
                                            </tr>





                                            </tbody>
                                        </Table>
                                    </div>
                                </Col>

                                                          {/* FIRST PARTY (LESSOR) TABLE */}
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: '50px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }} className='mb-3' >
                                    <h4>FIRST PARTY (LESSOR)</h4>
                                    <h4>الطرف الأول (المؤجر) </h4>
                                </div>
                                <Table striped hover responsive style={{ border: '1px solid black' }} id="table-to-download" >
                                    <thead style={{ backgroundColor: '#005f75' }} >
                                        <th rowSpan={2} colspan={4} style={{ color: 'white' }} >LandLord</th>
                                        <th rowSpan={2} colspan={2} style={{ display: 'flex', justifyContent: 'end', color: 'white' }}>تفاصيل العقد </th>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                Full Name
                                            </td>
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

                                        </tr>

                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                {ownerId.name && ownerId.name}
                                            </td>
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
                                    <thead style={{ backgroundColor: '#005f75' }} >
                                        <th rowSpan={2} colspan={2} style={{ color: 'white', }} >Contract Person</th>
                                        <th rowSpan={2} colspan={2} style={{ display: 'flex', justifyContent: 'end', color: 'white', }}>شخص عقد</th>
                                    </thead>


                                    <tbody>
                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                Full Name
                                            </td>
                                     
                                            <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >    <p > {property.cname && property.cname} </p></td>
                                            <td colSpan={3} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                <p >{property.cname && property.cname}</p>
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
                                 
                                            <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >    <p  > {property.ccontact && property.ccontact} </p></td>
                                            <td colSpan={3} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                <p  >{property.ccontact && property.ccontact}</p>
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
                                       
                                            <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >    <p  > {property.cemail && property.cemail} </p></td>
                                            <td colSpan={3} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                <p  >{property.cemail && property.cemail}</p>
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
                                                {state.tenantDetails.companyname && state.tenantDetails.companyname ? 'Company Name' : 'Tenant Name'}
                                            </td>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                Email
                                            </td>
                                            <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                Mobile No.
                                            </td>
                                            <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                {state.tenantDetails.licenseno && state.tenantDetails.licenseno ? 'License No' : 'Emirates Id'}
                                            </td>

                                        </tr>
                                        <tr>
                                            <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                {state.tenantDetails.companyname ? state.tenantDetails.companyname : state.tenantDetails.name && state.tenantDetails.name}
                                            </td>
                                            <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                {state.tenantDetails.email && state.tenantDetails.email}
                                            </td>
                                            <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                {state.tenantDetails.contact && state.tenantDetails.contact}
                                            </td>

                                            <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                                {state.tenantDetails.licenseno && state.tenantDetails.licenseno || state.tenantDetails.nid && state.tenantDetails.nid}
                                            </td>
                                        </tr>

                                    </tbody>
                                </Table>


                            </Col>

                                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <h4 style={{ textTransform: 'uppercase' }} className='mt-4'> Administration Fees </h4>
                                    <Table striped hover responsive style={{ border: '1px solid black', marginTop: '10px' }} key={contractInfo._id}>
                                        <thead style={{ backgroundColor: '#005f75' }} >
                                            <th style={{ color: 'white', textAlign: 'start' }} >Fees Description</th>
                                            <th style={{ color: 'white', textAlign: 'start' }}>Amount </th>
                                            <th style={{ color: 'white', textAlign: 'start' }}>كمية</th>
                                            <th style={{ color: 'white', textAlign: 'start' }}>وصف الرسوم </th>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6' }} >
                                                    Contract issuing <br />
                                                    fees
                                                    <p> (New-Renewal)</p>
                                                </td>
                                                <td className='text-start' style={{ backgroundColor: '#ffffff' }} >AED 210</td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >درهم 210 </td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'start' }} >رسوم إصدار <br />العقود (التجديد الجديد) </td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >Ejari fee</td>
                                                <td className='text-start' style={{ backgroundColor: '#ffffff' }} >AED 200</td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >درهم 200</td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'start' }} >رسوم إيجاري</td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >Lease agreement <br /> transfer fee   <p>(Residential and <br /> commercial)</p></td>
                                                <td className='text-start' style={{ backgroundColor: '#ffffff' }} >AED 525</td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >درهم 525</td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'start' }} >رسوم نقل  <br />عقد الإيجار (السكنية <br />والتجارية) </td>
                                            </tr>
                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >Early termination<br /> fees of the lease <br /> agreement <br /> (Residential <br /> and commercial)</td>
                                                <td className='text-start' style={{ backgroundColor: '#ffffff' }} > Deduct two (2) <br /> months of the <br /> rental value </td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >خصم شهرين (2) <br /> من القيمة  <br />الإيجارية</td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'start' }} >رسوم الإنهاء<br /> المبكر لعقد الإيجار <br />(السكني والتجاري)</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >Non-Renewal without <br /> prior written notice <br /> 60 days prior to contract <br /> expiry  (Residentail <br /> Properties)  90 days <br /> prior to contract expiry <br /> Commercial properties </td>
                                                <td className='text-start' style={{ backgroundColor: '#ffffff' }} >AED 1,050</td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >درهم 1,050</td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'start' }} >عدم التجديد دون إشعار كتابي مسبق قبل 60<br /> يومًا من انتهاء العقد <br /> (العقارات السكنية) قبل 90 يومًا من انتهاء  <br />العقد العقارات التجارية</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >Termination fees of <br /> lease  agreement <br /> after the date of <br />completion <br /> (residential and commercial) </td>
                                                <td className='text-start' style={{ backgroundColor: '#ffffff' }} >Rental Fee for <br /> the occupied period <br /> plus Two Months <br /> of the rental value </td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >رسوم الإيجار للفترة <br />المشغولة <br /> بالإضافة إلى شهرين من <br />القيمة الإيجارية</td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'start' }} >رسوم إنهاء عقد <br />الإيجار بعد تاريخ الانتهاء <br />(السكني والتجاري)</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >Maintenance Security <br /> deposit</td>
                                                <td className='text-start' style={{ backgroundColor: '#ffffff' }} > 5% of total rental amount. <br /> minimum of AED 3,000 </td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >5% من إجمالي مبلغ الإيجار. <br /> الحد الأدنى 3000 درهم</td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'start' }} >وديعة تأمين الصيانة</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >Refundable Guarantee <br /> Checque to <br /> acquire Permission to <br /> Vacate  (To return to the <br /> tenant upon submission <br /> of DEWA, chiller, and gas <br />clearance) or to change <br /> furniture during contract <br />period </td>
                                                <td className='text-start' style={{ backgroundColor: '#ffffff' }} >AED 5,000  ( Apartments)
                                                    <p>AED 10,000 <br /> (Villas and commercial) </p>
                                                </td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >
                                                    شقق سكنية درهم(5,000)
                                                    <p> 10,000 درهم (فلل وتجارية) </p>
                                                </td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'start' }} >شيك ضمان قابل للاسترداد <br /> للحصول على إذن الإخلاء <br /> (للإرجاع إلى المستأجر عند <br /> تقديم تخليص هيئة كهرباء <br />ومياه دبي والمبرد وتخليص الغاز) أو لتغيير <br /> الأثاث خلال فترة العقد</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >Late Renewal fees</td>
                                                <td className='text-start' style={{ backgroundColor: '#ffffff' }} >AED 10.5 per day effective <br /> 8 days after the expiry of <br />the lease agreement </td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >10.5 درهم إماراتي في اليوم <br />اعتبارًا من 8 أيام <br />بعد انتهاء عقد الإيجار <br /></td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'start' }} >رسوم التجديد المتأخر</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >Returned cheque fees</td>
                                                <td className='text-start' style={{ backgroundColor: '#ffffff' }} >AED 262.5 per cheque</td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >262.5 درهماً إماراتياً لكل شيك</td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'start' }} >رسوم الشيكات المرتجعة</td>
                                            </tr>

                                            <tr>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >Postpone cheque fees <br /> (maximum 1 month)</td>
                                                <td className='text-start' style={{ backgroundColor: '#ffffff' }} >AED 525 per cheque</td>
                                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'start' }} >525 درهماً إماراتياً لكل شيك</td>
                                                <td style={{ backgroundColor: '#ffffff', textAlign: 'start' }} >رسوم تأجيل الشيك <br />(بحد أقصى شهر واحد)</td>
                                            </tr>

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
                                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Property Name</td>
                                                    </tr>
                                                    : null
                                            }

                                            {
                                                property.zone === "Abu dhabi" ?
                                                    <tr>
                                                        <td style={{ backgroundColor: '#e7e6e6' }}>Description</td>
                                                        <td className='text-center'>{property?.description && property?.description}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Description</td>
                                                    </tr>
                                                    : null
                                            }

                                            {
                                                property.zone === "Abu dhabi" ?
                                                    <tr>
                                                        <td style={{ backgroundColor: '#e7e6e6' }} >Address</td>
                                                        <td className='text-center'>{property?.address && property?.address}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Address</td>
                                                    </tr>
                                                    : null
                                            }

                                            {
                                                property.zone === "Abu dhabi" ?
                                                    <tr>
                                                        <td style={{ backgroundColor: '#e7e6e6' }}>City</td>
                                                        <td className='text-center'>{property?.city && property?.city}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >City</td>
                                                    </tr>
                                                    : null
                                            }

                                            {
                                                property.zone === "Abu dhabi" ?
                                                    <tr>
                                                        <td style={{ backgroundColor: '#e7e6e6' }} >Property Type</td>
                                                        <td className='text-center'>{property?.propertyType && property?.propertyType}</td>
                                                        <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Property Type</td>
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

                                    <Table striped hover responsive bordered style={{ marginBottom: '30px' }} >
                                        <thead style={{ backgroundColor: '#005f75' }} >
                                            <th style={{ color: 'white', textAlign: 'center' }} >* Above Prices are included VAT</th>
                                            <th style={{ textAlign: 'center', color: 'white' }}>* الأسعار المذكورة أعلاه شاملة ضريبة القيمة المضافة</th>
                                        </thead>
                                        <tr>
                                            <td style={{ textAlign: 'center', paddingTop: '50px', }}>
                                                Prepared By : Jovera Group (Signature)
                                            </td>
                                            <td style={{ textAlign: 'center', paddingTop: '50px' }} >
                                                Approved By : Tenant (Signature)
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ textAlign: 'center' }}>Dated:</td>
                                            <td style={{ textAlign: 'center' }} >Dated:</td>
                                        </tr>
                                    </Table>
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: '45px' }} className='mb-5'>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                                        <div style={{ width: '100%', maxWidth: '700px' }} >
                                            <h3>Terms and Conditions</h3>
                                            The following terms and conditions govern all use of the Wiki Education Foundation (“Wiki Ed”) website and all content, services,
                                            and products available at or through the website, including, but not limited to, dashboard.wikiedu.org, ask.wikiedu.org, playlist.wiki,
                                            and wikiedu.org (taken together, the “Sites” or the “Services”). Our Services are offered subject to your acceptance without modification
                                            of all of the terms and conditions contained herein and all other operating rules, policies (including, without limitation, Wiki Ed’s Privacy Policy)
                                            and procedures that may be published from time to time by Wiki
                                            Ed (collectively, the “Agreement”). You agree that we may automatically upgrade our Services, and these terms will apply to any upgrades.
                                            <br />  <br />
                                            1. Acceptance of this Agreement
                                            Please read this Agreement carefully before accessing or using our Services. By accessing or using any part of our Services, you agree to become
                                            bound by the terms and conditions of this Agreement. If you do not agree to all the terms and conditions of this Agreement, then you may not access or use
                                            any of our Services.
                                            If these terms and conditions are considered an offer by Wiki Ed, acceptance is expressly limited to these terms.
                                            <br />  <br />
                                            2. Eligibility
                                            In order to use our Services you need to (1) be 18 or older, or be 13 or older and have your parent or guardian’s consent to the Agreement, and (2) have
                                            the power to enter a binding contract with us and not be barred from doing so under any applicable laws. You also promise that any registration information
                                            that you submit to Wiki Ed is true, accurate,
                                            and complete, and you agree to keep it that way at all times.
                                            <br />  <br />
                                            3. Prohibited Uses.
                                            When using Wiki Ed’s Services, you agree not to:
                                            <br />
                                            Publish material or engage in activity that is illegal under applicable law, such as the U.S. Copyright Act, the Lanham (Trademark) Act, the Communications
                                            Decency Act (“CDA”) or the
                                            Digital Millennium Copyright Act (“DMCA”);
                                            Use the Services to overburden Wiki Ed’s systems, as determined by us in our sole discretion;
                                            Disclose the sensitive personal information of others without their permission;
                                            Send spam or bulk unsolicited messages;
                                            Interfere with, disrupt, or attack the Services or Wiki Ed’s network; or
                                            Distribute material that is or enables malware, spyware, adware, or other malicious code.
                                          
                                        </div>

                                        <div style={{ width: '100%', maxWidth: '700px' }} >
                                            <h3>الشروط والأحكام</h3>
                                            تحكم الشروط والأحكام التالية جميع استخدامات موقع Wiki Education Foundation ("Wiki Ed") وجميع المحتويات والخدمات
                                            والمنتجات المتاحة على الموقع الإلكتروني أو من خلاله، بما في ذلك، على سبيل المثال لا الحصر، Dashboard.wikiedu.org، وask.wikiedu.org، وplaylist.wiki،
                                            و wikiedu.org (يُشار إليهما معًا باسم "المواقع" أو "الخدمات"). يتم تقديم خدماتنا بناءً على موافقتك دون تعديل
                                            لجميع الشروط والأحكام الواردة هنا وجميع قواعد التشغيل والسياسات الأخرى (بما في ذلك، على سبيل المثال لا الحصر، سياسة الخصوصية الخاصة بـ Wiki Ed)
                                            والإجراءات التي قد يتم نشرها من وقت لآخر بواسطة ويكي
                                            إد (يُشار إليها إجمالاً باسم "الاتفاقية"). أنت توافق على أنه يجوز لنا ترقية خدماتنا تلقائيًا، وسيتم تطبيق هذه الشروط على أي ترقيات.
                                            <br /> <br />

                                            1. قبول هذه الاتفاقية
                                            يرجى قراءة هذه الاتفاقية بعناية قبل الوصول إلى خدماتنا أو استخدامها. من خلال الوصول إلى أي جزء من خدماتنا أو استخدامها، فإنك توافق على أن تصبح
                                            ملزمة بشروط وأحكام هذه الاتفاقية. إذا كنت لا توافق على جميع شروط وأحكام هذه الاتفاقية، فلا يجوز لك الوصول إليها أو استخدامها
                                            أي من خدماتنا.
                                            إذا كانت هذه الشروط والأحكام تعتبر عرضًا من Wiki Ed، فإن القبول يقتصر صراحةً على هذه الشروط.
                                            <br /> <br />

                                            2. الأهلية لتتمكن من استخدام خدماتنا، يجب أن (1) تبلغ من العمر 18 عامًا أو أكثر، أو تبلغ من العمر 13 عامًا أو أكثر وأن تحصل على موافقة والديك أو ولي أمرك على الاتفاقية، و(2) تتمتع بصلاحية إبرام عقد ملزم معنا. وألا يُمنع من القيام بذلك بموجب أي قوانين معمول بها. كما تتعهد بأن أي معلومات تسجيل ترسلها إلى Wiki Ed هي معلومات صحيحة ودقيقة وكاملة، وتوافق على الاحتفاظ بها بهذه الطريقة في جميع
                                            الأوقات.
                                            <br /> <br />
                                            3. الاستخدامات المحظورة.
                                            عند استخدام خدمات Wiki Ed، فإنك توافق على عدم القيام بما يلي:
                                            <br />
                                            نشر مواد أو المشاركة في نشاط غير قانوني بموجب القانون المعمول به، مثل قانون حقوق الطبع والنشر الأمريكي، وقانون لانهام (العلامات التجارية)، وقانون الاتصالات
                                            قانون الآداب ("CDA") أو
                                            قانون الألفية الجديدة لحقوق طبع ونشر المواد الرقمية ("DMCA")؛
                                            استخدام الخدمات لإثقال كاهل أنظمة Wiki Ed، على النحو الذي نحدده وفقًا لتقديرنا الخاص؛
                                            الكشف عن المعلومات الشخصية الحساسة للآخرين دون إذنهم؛
                                            إرسال رسائل غير مرغوب فيها أو رسائل مجمعة غير مرغوب فيها؛
                                            التدخل في الخدمات أو شبكة Wiki Ed أو تعطيلها أو مهاجمتها؛ أو
                                            توزيع المواد التي تمثل أو تمكّن البرامج الضارة أو برامج التجسس أو برامج الإعلانات المتسللة أو غيرها من التعليمات البرمجية الضارة.
                                            <br /> <br />
                                            نشر مواد أو المشاركة في نشاط غير قانوني بموجب القانون المعمول به، مثل قانون حقوق الطبع والنشر الأمريكي، وقانون لانهام (العلامات التجارية)، وقانون الاتصالات
                                            قانون الآداب ("CDA") أو
                                            قانون الألفية الجديدة لحقوق طبع ونشر المواد الرقمية ("DMCA")؛
                                            استخدام الخدمات لإثقال كاهل أنظمة Wiki Ed، على النحو الذي نحدده وفقًا لتقديرنا الخاص؛
                                            الكشف عن المعلومات الشخصية الحساسة للآخرين دون إذنهم؛
                                            إرسال رسائل غير مرغوب فيها أو رسائل مجمعة غير مرغوب فيها؛
                                            التدخل في الخدمات أو شبكة Wiki Ed أو تعطيلها أو مهاجمتها؛ أو
                                            توزيع المواد التي تمثل أو تمكّن البرامج الضارة أو برامج التجسس أو برامج الإعلانات المتسللة أو غيرها من التعليمات البرمجية الضارة.
                                           
                                        </div>
                                    </div>
                                </Col>


                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default StaticTenantData