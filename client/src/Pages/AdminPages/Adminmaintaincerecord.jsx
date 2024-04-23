import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Button, Card, Col, Row } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import AdminSideBar from '../../Components/AdminSideBar';

const AdminmaintenanceList = () => {
    const { state } = useContext(AuthContext);

    const [maintenanceList, setMaintenanceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMaintenanceList = async () => {
            try {
                // Get the token from localStorage or wherever you store it

                const response = await axios.get('/api/maintenance/all-maintenance-record', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`
                    }
                });

                setMaintenanceList(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch maintenance records');
                setLoading(false);
            }
        };

        fetchMaintenanceList();
    }, [state.token]);

    // if (loading) {
    //     return <p>Loading...</p>;
    // }

    // if (error) {
    //     return <p>{error}</p>;
    // }

    return (
        <div>

            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2} >
                    <div>
                        <AdminSideBar />
                    </div>
                </Col>

                <Col xs={12} sm={12} md={12} lg={10} xl={10}  >
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10}>
                            <div style={{ marginTop: '95px' }} >
                                <h2 className='text-center' >Maintenance Records</h2>
                                <Table striped bordered hover responsive >
                                    <thead>
                                        <tr>
                                            <th>Owner</th>
                                            <th>Property</th>
                                            <th>Floor</th>
                                            <th>Unit</th>
                                            <th>Maintenance Type</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                            <th>Image</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {maintenanceList.map((maintenance) => (
                                            <tr key={maintenance._id}>
                                                <td>{maintenance.owner.name && maintenance.owner.name}</td>
                                                <td>{maintenance.property.name && maintenance.property.name}</td>
                                                <td>{maintenance.floor.name && maintenance.floor.name}</td>
                                                <td>{maintenance.unit.unitNo && maintenance.unit.unitNo} / {maintenance.unit.type && maintenance.unit.type}</td>
                                                <td>{maintenance.maintenanceType && maintenance.maintenanceType}</td>
                                                <td>${maintenance.amount && maintenance.amount}</td>
                                                <td>{new Date(maintenance.date && maintenance.date).toLocaleDateString()}</td>
                                                <td>
                                                    {maintenance.image && (
                                                        <img src={maintenance.image} alt="Maintenance" style={{ width: '50px', height: '50px' }} />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default AdminmaintenanceList;



