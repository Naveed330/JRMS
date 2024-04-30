import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Button, Card, Col, Row, Modal } from 'react-bootstrap';
import SideBar from '../../Components/SideBar';
import Table from 'react-bootstrap/Table';

const MaintenanceList = () => {
    const { state } = useContext(AuthContext);

    const [maintenanceList, setMaintenanceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        const fetchMaintenanceList = async () => {
            try {
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

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2} >
                    <div>
                        <SideBar />
                    </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={10} xl={10}  >
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10}>
                            <div style={{ marginTop: '95px' }} >
                                <h2 className='text-center' >Maintenance Records</h2>
                                <Table striped bordered hover responsive >
                                    <thead style={{ backgroundColor: '#005f75' }} >
                                        <tr>
                                            <th style={{ color: '#ffff' }} >Owner</th>
                                            <th style={{ color: '#ffff' }} >Property</th>
                                            <th style={{ color: '#ffff' }} >Floor</th>
                                            <th style={{ color: '#ffff' }} >Unit</th>
                                            <th style={{ color: '#ffff' }}>Maintenance Type</th>
                                            <th style={{ color: '#ffff' }}>Amount</th>
                                            <th style={{ color: '#ffff' }}>Date</th>
                                            <th style={{ color: '#ffff' }}>Image</th>
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
                                                <td>{maintenance.amount && maintenance.amount}</td>
                                                <td>{new Date(maintenance.date && maintenance.date).toLocaleDateString()}</td>
                                                <td>
                                                    {maintenance.image && (
                                                        <img
                                                            src={maintenance.image}
                                                            alt="Maintenance"
                                                            style={{ cursor: 'pointer', width: '50px', height: '50px' }}
                                                            onClick={() => handleImageClick(maintenance.image)}
                                                        />
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
            {/* Modal to display the image in larger view */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Body>
                    <img src={selectedImage} alt="Maintenance" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MaintenanceList;
