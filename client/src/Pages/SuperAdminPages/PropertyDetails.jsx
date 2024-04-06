import React, { useEffect, useState } from 'react'
import { Button, Row, Col, Card } from 'react-bootstrap';
import SideBar from '../../Components/SideBar';
import { useLocation, useParams } from 'react-router-dom';

const PropertyDetails = () => {
    const { state } = useLocation();
    const { id } = useParams()
    const [item, setItem] = useState([]);
    console.log(item, 'itemsdata');

    useEffect(() => {
        // Check if state and id are available
        if (state && id) {
            // Filter the data array from state based on the id
            const filteredItem = state.properties.filter(item => item.id === id);
            console.log(filteredItem,'filteritems');
            setItem(filteredItem);
        }
    }, [state, id]);

    console.log(state, 'iduseprams');

    return (
        <>
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <div>
                        <SideBar />
                    </div>
                </Col>

                <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '70px' }} >
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10} >
                            <h1 className='text-center' >Property Details</h1>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px', gap: '30px', flexWrap: 'wrap' }} >
                                {
                                    state.properties.map((details, id) => {
                                        return (
                                            <>
                                                <Card style={{ width: 'auto', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>

                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px' }}>
                                                        <Card.Img variant="top" src={details.propertyImage && details.propertyImage} alt='changepassword' style={{ width: '150px' }} />
                                                    </div>

                                                    <Card.Body>
                                                        <Card.Title> {details.municipality && details.municipality} </Card.Title>
                                                        <Card.Text>
                                                            <p>Contact No : {details.contactinfo && details.contactinfo} </p>
                                                            <p>Address : {details.address && details.address} </p>
                                                            <p>onwaniAddress : {details.onwaniAddress && details.onwaniAddress} </p>
                                                            <p>plotAddress : {details.plotAddress && details.plotAddress} </p>
                                                            <p>plotNo : {details.plotNo && details.plotNo} </p>
                                                            <p>sector : {details.sector && details.sector} </p>
                                                            <p>propertyRegistrationNo : {details.propertyRegistrationNo && details.propertyRegistrationNo} </p>
                                                            <p>propertyNo : {details.propertyNo && details.propertyNo} </p>
                                                            {details.floors.map((floor, id) => {
                                                                return (
                                                                    <>
                                                                        <p>Floor Name : {floor.name && floor.name} </p>
                                                                        {
                                                                            floor.units.map((unit, id) => {
                                                                                return (
                                                                                    <>
                                                                                        <p> Occupied :  {unit.occupied && unit.occupied} </p>
                                                                                        <p> PremiseNo :  {unit.premiseNo && unit.premiseNo} </p>
                                                                                        <p> Type : {unit.type && unit.type} </p>
                                                                                        <p> UnitNo : {unit.unitNo && unit.unitNo} </p>
                                                                                        <p> unitRegNo : {unit.unitRegNo && unit.unitRegNo} </p>
                                                                                    </>
                                                                                )
                                                                            })
                                                                        }
                                                                    </>
                                                                )
                                                            })}
                                                        </Card.Text>
                                                        <Button variant="primary">Delete</Button>
                                                    </Card.Body>
                                                </Card>
                                            </>
                                        )
                                    })
                                }

                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default PropertyDetails