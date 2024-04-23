import React from 'react'
import { Col, Row, Table } from 'react-bootstrap'

const Contract = () => {
    return (
        <>
            <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                {/* First TABLE */}
                <Col xs={12} sm={12} md={12} lg={8} xl={8} style={{ marginTop: '80px' }}>
                    <div>
                        <Table striped responsive style={{ border: '1px solid black' }} >
                            <thead style={{ backgroundColor: '#005f75' }} >
                                <th rowSpan={2} colspan={2} style={{ color: 'white' }} >CONTRACT DETAILS</th>
                                <th rowSpan={2} colspan={2} style={{ display: 'flex', justifyContent: 'end', color: 'white' }}>CONTRACT DETAILS </th>
                            </thead>


                            <tbody>
                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Contract No .</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >2024202420249355</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Contract No .</td>
                                </tr>
                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Issue Date</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >2024-03-09</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Issue Date</td>
                                </tr>
                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Start Date</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >2024-03-09</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Start Date</td>
                                </tr>
                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >End Date</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >2025-03-02</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >End Date</td>
                                </tr>
                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Annual Rent</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >52,000,00</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Annual Rent</td>
                                </tr>

                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Contract Value</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >52,000,00</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Contract Value</td>
                                </tr>

                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Security Deposit</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >____</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Security Deposit</td>
                                </tr>

                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Contract Type</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >Commercial</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Contract Type</td>
                                </tr>

                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Grace Period</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >17 Days</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Grace Period</td>
                                </tr>

                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Contract Term</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >1 Year 17 Days</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Contract Term</td>
                                </tr>

                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Payment Method</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >Cash and Cheque</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Payment Method</td>
                                </tr>

                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Number of Payments</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >12</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Number of Payments</td>
                                </tr>

                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Number of Occupants</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >0</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Number of Occupants</td>
                                </tr>

                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Water and Electricty Bill</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >TENANT</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Water and Electricty Bill</td>
                                </tr>

                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Pets Allowed</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >No</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Pets Allowed</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </Col>

                {/* Second TABLE */}
                <Col xs={12} sm={12} md={12} lg={8} xl={8} style={{ marginTop: '50px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }} className='mb-3' >
                        <h4>FIRST PARTY (LESSOR)</h4>
                        <h4>FIRST PARTY (LESSOR)</h4>
                    </div>
                    <Table striped responsive style={{ border: '1px solid black' }} >
                        <thead style={{ backgroundColor: '#005f75' }} >
                            <th rowSpan={2} colspan={4} style={{ color: 'white' }} >CONTRACT DETAILS</th>
                            <th rowSpan={2} colspan={2} style={{ display: 'flex', justifyContent: 'end', color: 'white' }}>CONTRACT DETAILS </th>
                        </thead>


                        <tbody>
                            <tr>
                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                    <p>Email</p>
                                    <p>Email</p>
                                </td>
                                <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                    <p>Mobile No.</p>
                                    <p>Mobile No.</p>
                                </td>
                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                    <p>Nationality</p>
                                    <p>Nationality</p>
                                </td>
                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                    <p>Emirates ID No.</p>
                                    <p>Emirates ID No.</p>
                                </td>
                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                    <p>Full Name</p>
                                    <p>Full Name</p>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                    ___
                                </td>
                                <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >

                                    ___
                                </td>
                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                    <p>United Arab Emirates</p>
                                    <p>United Arab Emirates</p>
                                </td>
                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >

                                    789456123369712

                                </td>
                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                    <p style={{ textTransform: 'uppercase' }} >Senan khadam Rashed almheiri</p>
                                    <p style={{ textTransform: 'uppercase' }} >Full Name</p>
                                </td>
                            </tr>

                        </tbody>
                    </Table>

                    <Table striped responsive style={{ border: '1px solid black' }} >
                        <thead style={{ backgroundColor: '#e7e6e6' }} >
                            <th rowSpan={2} colspan={4} style={{ color: 'black', fontWeight: 'bold' }} >Contract Person</th>
                            <th rowSpan={2} colspan={2} style={{ display: 'flex', justifyContent: 'end', color: 'black', fontWeight: 'bold' }}>Contract Person</th>
                        </thead>


                        <tbody>
                            <tr>
                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                        <p>Full Name</p>
                                </td>
                                <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                        <p style={{ textTransform: 'uppercase' }} >SENAN KHADAM RASHED ALMHEIRI</p>
                                    </td>
                                <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                        <p style={{ textTransform: 'uppercase' }} >SENAN KHADAM RASHED ALMHEIRI</p>
                                    </td>

                                <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                        <p style={{ textTransform: 'uppercase' }} >SENAN KHADAM RASHED ALMHEIRI</p>
                                  </td>
                            </tr>
                            <tr>
                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                        <p>Mobile No.</p>
                                </td>
                                <td colSpan={3} className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                        <p>971452367895</p>
                                    </td>
                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                        <p>United Arab Emirates</p>
                                    </td>
                            </tr>

                            <tr>
                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                    
                                        <p>Email</p>
                                   
                                </td>
                                <td colSpan={3} className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                        <p>senanalhermi@gmail.com</p>
                                   </td>
                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                        <p>senanalhermi@gmail.com</p>
                                    </td>
                            </tr>



                        </tbody>
                    </Table>
                </Col>

                {/* Third TABLE */}
                <Col xs={12} sm={12} md={12} lg={8} xl={8} style={{ marginTop: '50px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }} className='mb-3' >
                        <h4 style={{ textTransform: 'uppercase' }} >SECOND PARTY (TENANT)</h4>
                        <h4>SECOND PARTY (TENANT)</h4>
                    </div>
                    <Table striped responsive style={{ border: '1px solid black' }} >
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
                                    a.5alama@gmail.com
                                </td>
                                <td className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                    0503221456
                                </td>
                                <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                    CN-1854888

                                </td>

                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                    Jovera Group
                                </td>
                            </tr>

                        </tbody>
                    </Table>


                </Col>

                {/* Fourth TABLE */}
                <Col xs={12} sm={12} md={12} lg={8} xl={8} style={{ marginTop: '80px' }}>
                    <div>
                        <Table striped responsive style={{ border: '1px solid black' }} >
                            <thead style={{ backgroundColor: '#005f75' }} >
                                <th rowSpan={2} colspan={2} style={{ color: 'white' }} >PROPERTY DETAILS</th>
                                <th rowSpan={2} colspan={2} style={{ display: 'flex', justifyContent: 'end', color: 'white' }}>PROPERTY DETAILS </th>
                            </thead>


                            <tbody>
                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Municipality</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >Abu Dhabi City</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Municipality</td>
                                </tr>
                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Zone</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >AL-Zahiyah </td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Zone</td>
                                </tr>
                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Sector</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >E14</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Sector</td>
                                </tr>

                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Road Name</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >__</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Road Name</td>
                                </tr>
                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Plot No</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >C14</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Plot No</td>
                                </tr>

                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Plot Address</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >000-014-000-C14</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Plot Address</td>
                                </tr>

                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Onwani Address</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >At Taqaleed St, Al Zahiyah, 5 Abu Dhabi 22211</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Onwani Address</td>
                                </tr>

                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Property No</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >PRP2679</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Property No</td>
                                </tr>

                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Property Registration No</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >PRP2679</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Property Registration No</td>
                                </tr>

                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Property Name</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >Senan Khadam Rashed Al Muhairi</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Property Name</td>
                                </tr>

                                <tr>
                                    <td style={{ backgroundColor: '#e7e6e6' }} >Property Type</td>
                                    <td className='text-center' style={{ backgroundColor: '#ffffff' }} >Building</td>
                                    <td style={{ display: 'flex', justifyContent: 'end', backgroundColor: '#e7e6e6' }} >Property Type</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </Col>

                {/* Fifth TABLE */}
                <Col xs={12} sm={12} md={12} lg={8} xl={8} style={{ marginTop: '50px' }}>
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
                            <tr>
                                <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                    2440710832
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
                                    OFFICE
                                </td>

                                <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                    UNT50515
                                </td>

                                <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                    UNT50515
                                </td>
                            </tr>

                        </tbody>
                    </Table>


                </Col>


                <Col xs={12} sm={12} md={12} lg={8} xl={8} style={{ marginTop: '50px' }}>
                    <div>
                        <ul>
                            <li>
                                <h5>This Contract was registered in the <span style={{ color: '#ff0b42' }} > (Rental Registry) </span> </h5>
                            </li>
                            <li>
                                <h5> Any deletion, amendment, or addition to the content of this document shall render it null and void </h5>
                            </li>
                            <li>
                                <h5>This Contract is electronically generated, and it can be verified via: <span> <a href="https://www.dari.ae/en/app/verify-tenant-contract">https://www.dari.ae/en/app/verify-tenant-contract</a>  </span> </h5>
                            </li>
                            <li>
                                <h5>Contract No. : 20240099355 </h5>
                            </li>
                        </ul>
                    </div>


                </Col>
            </Row>
        </>)
}
export default Contract