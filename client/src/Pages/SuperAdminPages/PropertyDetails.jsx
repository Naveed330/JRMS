import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Card, Button, Table } from 'react-bootstrap';
import SideBar from '../../Components/SideBar';
import { BiArrowBack } from "react-icons/bi";
import { TiTick } from "react-icons/ti";
import { RxCross1 } from "react-icons/rx";
import './propertyDetail.css'

const PropertyDetails = () => {
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { state } = useContext(AuthContext);
    const { id } = useParams();

    console.log(property,'propery');

    // Floors Length
    const totalFloors = property?.floors ? property?.floors?.length : 0;

    // Units Length
    let totalUnits = 0;

    // Check if property exists and it has floors
    if (property && property.floors && Array.isArray(property.floors)) {
        // Iterate through each floor
        property.floors.forEach((floor) => {
            console.log(floor, 'floorlength');
            // Check if floor has units
            if (floor.units && Array.isArray(floor.units)) {
                // Add the number of units in this floor to the total 
                totalUnits += floor.units.length;
            }
        });
    }


    useEffect(() => {
        const fetchPropertyDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/properties/singleproperty/${id}`, {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`,
                    },
                });
                console.log(response.data, 'responsedatata');
                setProperty(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch property details');
                setLoading(false);
            }
        };
        fetchPropertyDetails();
    }, [state.user.token, id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!property) return <div>No property found</div>;

    return (
        <>
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2} style={{}} >
                    <div>
                        <SideBar />
                    </div>
                </Col>

                <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '80px' }}>

                    {/* Properties Owner and Contact Details Table */}
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={8} xl={8} style={{ backgroundColor: '' }} >
                            <Table striped hover bordered responsive  >
                                <thead style={{ backgroundColor: '#005f75' }} >
                                    <th colspan={6} style={{ color: 'white', }} >Property Details</th>
                                </thead>


                                <tbody>
                                    <tr>
                                        <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center', fontWeight: '700' }} >
                                            {/* {property?.zone === 'Sharjah' ? <>City</> : <>Municipality</>} */}
                                            Municipality
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {/* {property?.zone === 'Sharjah' ?
                                                <>
                                                    {property.city && property.city}
                                                </>
                                                :
                                                <> */}
                                                    {property.municipality && property.municipality}
                                                {/* </>
                                            } */}
                                        </td>

                                        <td colSpan={2} className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center', fontWeight: '700' }} >
                                            {/* {property?.zone === 'Sharjah' ? <>Area</> : <> */}
                                            Name
                                            {/* </>} */}
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {/* {property?.zone === 'Sharjah' ?
                                                <>
                                                    {property.area && property.area}
                                                </>
                                                :
                                                <> */}
                                                    {property.name && property.name}
                                                {/* </>
                                            } */}
                                        </td>
                                    </tr>

                                    {/* <tr> */}
                                    {/* <td colSpan={2} className='text-center' style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {property?.zone === 'Sharjah' ? <>Area</> : <>Name</>}
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {property?.zone === 'Sharjah' ?
                                                <>
                                                    {property.area && property.area}
                                                </>
                                                :
                                                <>
                                                    {property.name && property.name}
                                                </>
                                            }
                                        </td> */}
                                    {/* </tr> */}

                                    <tr>
                                        <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center', fontWeight: '700' }} >
                                            {/* {property?.zone === 'Sharjah' ? <>BondType</> : <> */}
                                            Onwani_Address
                                            {/* </>} */}
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {/* {property?.zone === 'Sharjah' ?
                                                <>
                                                    {property.bondtype && property.bondtype}
                                                </>
                                                :
                                                <> */}
                                                    {property.onwaniAddress && property.onwaniAddress}
                                                {/* </>
                                            } */}
                                        </td>

                                        <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center', fontWeight: '700' }} >
                                            {/* {property?.zone === 'Sharjah' ? <>BondNo</> : <> */}
                                            Plot_Address
                                            {/* </>} */}
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {/* {property?.zone === 'Sharjah' ?
                                                <>
                                                    {property.bondno && property.bondno}
                                                </>
                                                :
                                                <> */}
                                                    {property.plotAddress && property.plotAddress}
                                                {/* </>
                                            } */}
                                        </td>
                                    </tr>

                                    {/* <tr>
                                        <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {property?.zone === 'Sharjah' ? <>BondNo</> : <>Plot_Address</>}
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {property?.zone === 'Sharjah' ?
                                                <>
                                                    {property.bondno && property.bondno}
                                                </>
                                                :
                                                <>
                                                    {property.plotAddress && property.plotAddress}
                                                </>
                                            }
                                        </td>
                                    </tr> */}

                                    <tr>
                                        <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center', fontWeight: '700' }} >
                                            {/* {property?.zone === 'Sharjah' ? <>BondDate</> : <> */}
                                            Property_No
                                            {/* </>} */}
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {/* {property?.zone === 'Sharjah' ?
                                                <>
                                                    {property.bonddate && property.bonddate}
                                                </>
                                                :
                                                <> */}
                                                    {property.propertyNo && property.propertyNo}
                                                {/* </>
                                            } */}
                                        </td>

                                        <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center', fontWeight: '700' }} >
                                            {/* {property?.zone === 'Sharjah' ? <>Govermentalno</> : <> */}
                                            Property_No
                                            {/* </>} */}
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {/* {property?.zone === 'Sharjah' ?
                                                <>
                                                    {property.govermentalno && property.govermentalno}
                                                </>
                                                :
                                                <> */}
                                                    {property.propertyNo && property.propertyNo}
                                                {/* </>
                                            } */}
                                        </td>
                                    </tr>

                                    {/* <tr>
                                        <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {property?.zone === 'Sharjah' ? <>Govermentalno</> : <>Property_No</>}
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {property?.zone === 'Sharjah' ?
                                                <>
                                                    {property.govermentalno && property.govermentalno}
                                                </>
                                                :
                                                <>
                                                    {property.propertyNo && property.propertyNo}
                                                </>
                                            }
                                        </td>
                                    </tr> */}

                                    <tr>
                                        <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center', fontWeight: '700' }} >
                                            {/* {property?.zone === 'Sharjah' ? <>BuildingName</> : <> */}
                                            Property_No
                                            {/* </>} */}
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {/* {property?.zone === 'Sharjah' ?
                                                <>
                                                    {property.buildingname && property.buildingname}
                                                </>
                                                :
                                                <> */}
                                                    {property.propertyNo && property.propertyNo}
                                                {/* </>
                                            } */}
                                        </td>

                                        <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center', fontWeight: '700' }} >
                                            {/* {property?.zone === 'Sharjah' ? <>PilotNo</> : <> */}
                                            Property_No
                                            {/* </>} */}
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {/* {property?.zone === 'Sharjah' ?
                                                <>
                                                    {property.pilotno && property.pilotno}
                                                </>
                                                :
                                                <> */}
                                                    {property.propertyNo && property.propertyNo}
                                                {/* </>
                                            } */}
                                        </td>
                                    </tr>

                                    {/* <tr>
                                        <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {property?.zone === 'Sharjah' ? <>PilotNo</> : <>Property_No</>}
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {property?.zone === 'Sharjah' ?
                                                <>
                                                    {property.pilotno && property.pilotno}
                                                </>
                                                :
                                                <>
                                                    {property.propertyNo && property.propertyNo}
                                                </>
                                            }
                                        </td>
                                    </tr> */}

                                    <tr>
                                        <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center', fontWeight: '700' }} >
                                            {/* {property?.zone === 'Sharjah' ? <>NameandStreet</> : <> */}
                                            Sector
                                            {/* </>} */}
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {/* {property?.zone === 'Sharjah' ?
                                                <>
                                                    {property.nameandstreet && property.nameandstreet}
                                                </>
                                                :
                                                <> */}
                                                    {property.sector && property.sector}
                                                {/* </>
                                            } */}
                                        </td>

                                        <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center', fontWeight: '700' }} >
                                            {/* {property?.zone === 'Sharjah' ? <>PropertyType</> : <> */}
                                            Zone
                                            {/* </>} */}
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {/* {property?.zone === 'Sharjah' ?
                                                <>
                                                    {property.propertyType && property.propertyType}
                                                </>
                                                :
                                                <> */}
                                                    {property.zone && property.zone}
                                                {/* </>
                                            } */}
                                        </td>
                                    </tr>

                                    {/* <tr>
                                        <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {property?.zone === 'Sharjah' ? <>PropertyType</> : <>
                                            Zone
                                            </>}
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {property?.zone === 'Sharjah' ?
                                                <>
                                                    {property.propertyType && property.propertyType}
                                                </>
                                                :
                                                <>
                                                    {property.zone && property.zone}
                                                </>
                                            }
                                        </td>
                                    </tr> */}

                                    {/* <tr>
                                        <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center', fontWeight: '700' }} >
                                            {property?.zone === 'Sharjah' ? <>Description</> : null}
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {property?.zone === 'Sharjah' ?
                                                <>
                                                    {property.description && property.description}
                                                </>
                                                :
                                                null
                                            }
                                        </td>

                                        <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center', fontWeight: '700' }} >
                                            {property?.zone === 'Sharjah' ? <>PropertyNo</> : null}
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {property?.zone === 'Sharjah' ?
                                                <>
                                                    {property.propertyno && property.propertyno}
                                                </>
                                                :
                                                null
                                            }
                                        </td>
                                    </tr> */}

                                    {/* <tr>
                                        <td colSpan={2} style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {property?.zone === 'Sharjah' ? <>PropertyNo</> : null}
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {property?.zone === 'Sharjah' ?
                                                <>
                                                    {property.propertyno && property.propertyno}
                                                </>
                                                :
                                                null
                                            }
                                        </td>
                                    </tr> */}
                                </tbody>
                            </Table>
                        </Col>

                        <Col xs={12} sm={12} md={12} lg={3} xl={3} style={{ backgroundColor: '' }} >
                            <Table striped hover bordered responsive  >
                                <thead style={{ backgroundColor: '#005f75' }} >
                                    <th colspan={4} style={{ color: 'white', }} >Owner Details</th>
                                </thead>


                                <tbody>
                                    <tr>
                                        <td colSpan={3} style={{ backgroundColor: '#e7e6e6', textAlign: 'center', fontWeight: '700' }} >
                                            User Name
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {property?.user?.name && property?.user?.name}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colSpan={3} style={{ backgroundColor: '#e7e6e6', textAlign: 'center', fontWeight: '700' }} >
                                            Contact
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {property?.user?.contact && property?.user?.contact}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colSpan={3} style={{ backgroundColor: '#e7e6e6', textAlign: 'center', fontWeight: '700' }} >
                                            Email
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {property?.user?.email && property?.user?.email}
                                        </td>
                                    </tr>


                                </tbody>
                            </Table>

                            {/* Contact Person TABLE */}
                            <Table striped hover bordered responsive className='mt-3'  >
                                <thead style={{ backgroundColor: '#005f75' }} >
                                    <th colspan={4} style={{ color: 'white', }} >Contact Person Details</th>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={3} style={{ backgroundColor: '#e7e6e6', textAlign: 'center', width: '25%', fontWeight: '700' }} >
                                            Name
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {property?.cname && property?.cname}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colSpan={3} style={{ backgroundColor: '#e7e6e6', textAlign: 'center', fontWeight: '700' }} >
                                            Contact
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {property?.ccontact && property?.ccontact}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colSpan={3} style={{ backgroundColor: '#e7e6e6', textAlign: 'center', fontWeight: '700' }} >
                                            Email
                                        </td>
                                        <td style={{ backgroundColor: '#e7e6e6', textAlign: 'center' }} >
                                            {property?.cemail && property?.cemail}
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>



                    {/* Total Number of Floors and Units */}
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10} >
                            <div style={{ display: 'flex', justifyContent: 'space-evenly' }} className='mb-4' >
                                <h3> {`Total Floors : ${totalFloors && totalFloors}`} </h3>
                                <h3 >{`Total Units :  ${totalUnits && totalUnits ? totalUnits : 'Currently No Units Available'}`} </h3>
                            </div>
                        </Col>
                    </Row>

                    {/* Table of occupied and UnOccupied */}
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                            <h4>Occupied Units</h4>
                            <div>
                                <Table bordered>
                                    <thead>
                                        <tr>
                                            <th>Floor</th>
                                            <th>Type</th>
                                            <th>UnitReg_No</th>
                                            <th>Unit_No</th>
                                            <th>Premise_No</th>
                                            <th>Occupied</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Iterate through floors */}
                                        {property.floors.map((item) => {
                                            // Check if there are unoccupied units on this floor
                                            const hasUnoccupiedUnits = item.units.some(unit => unit.occupied);
                                            // If there are unoccupied units, render them
                                            if (hasUnoccupiedUnits) {
                                                return item.units
                                                    .filter(singleUnit => singleUnit.occupied)
                                                    .map(singleUnit => (
                                                        <tr key={singleUnit.unitRegNo && singleUnit.unitRegNo}>
                                                            <td>{item.name && item.name}</td>
                                                            <td>{singleUnit.type && singleUnit.type}</td>
                                                            <td>{singleUnit.unitRegNo && singleUnit.unitRegNo}</td>
                                                            <td>{singleUnit.unitNo && singleUnit.unitNo}</td>
                                                            <td>{singleUnit.premiseNo && singleUnit.premiseNo}</td>
                                                            <td><TiTick style={{ color: 'green', fontSize: '25px' }} /></td>
                                                        </tr>
                                                    ));
                                            }
                                            // If no unoccupied units, return null
                                            return null;
                                        })}
                                    </tbody>
                                </Table>

                            </div>
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={5} xl={5}>
                            <h4>Unoccupied Units</h4>
                            <div>
                                <Table bordered>
                                    <thead>
                                        <tr>
                                            <th>Floor</th>
                                            <th>Type</th>
                                            <th>UnitReg_No</th>
                                            <th>Unit_No</th>
                                            <th>Premise_No</th>
                                            <th>Occupied</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Iterate through floors */}
                                        {property.floors.map((item) => {
                                            // Check if there are unoccupied units on this floor
                                            const hasUnoccupiedUnits = item.units.some(unit => !unit.occupied);
                                            // If there are unoccupied units, render them
                                            if (hasUnoccupiedUnits) {
                                                return item.units
                                                    .filter(singleUnit => !singleUnit.occupied)
                                                    .map(singleUnit => (
                                                        <tr key={singleUnit.unitRegNo && singleUnit.unitRegNo}>
                                                            <td>{item.name && item.name}</td>
                                                            <td>{singleUnit.type && singleUnit.type}</td>
                                                            <td>{singleUnit.unitRegNo && singleUnit.unitRegNo}</td>
                                                            <td>{singleUnit.unitNo && singleUnit.unitNo}</td>
                                                            <td>{singleUnit.premiseNo && singleUnit.premiseNo}</td>
                                                            <td><RxCross1 style={{ color: 'red', fontSize: '25px' }} /></td>
                                                        </tr>
                                                    ));
                                            }
                                            // If no unoccupied units, return null
                                            return null;
                                        })}
                                    </tbody>
                                </Table>

                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default PropertyDetails;