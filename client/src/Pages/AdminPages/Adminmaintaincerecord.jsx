import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Col, Row, Table, Modal } from 'react-bootstrap';
import AdminSideBar from '../../Components/AdminSideBar';

const AdminMaintenanceList = () => {
    const { state } = useContext(AuthContext);
    const [maintenanceList, setMaintenanceList] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchMaintenanceList = async () => {
            try {
                const response = await axios.get('/api/maintenance/all-maintenance-recordforadmin', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`
                    }
                });
                setMaintenanceList(response.data);
            } catch (error) {
                console.error('Error fetching maintenance records:', error);
            }
        };

        fetchMaintenanceList();
    }, [state.user.token]);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    return (
        <div>
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <AdminSideBar />
                </Col>

                <Col xs={12} sm={12} md={12} lg={10} xl={10}>
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10}>
                            <div style={{ marginTop: '95px' }}>
                                <h2 className='text-center'>Maintenance Records</h2>
                                <Table striped bordered hover responsive className='mb-5' >
                                    <thead style={{ backgroundColor: '#005f75' }} >
                                        <tr style={{ color: '#ffff' }} >
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
                                                <td>{maintenance.owner.name}</td>
                                                <td>{maintenance.property.name}</td>
                                                <td>{maintenance.floor.name}</td>
                                                <td>{maintenance.unit.unitNo} / {maintenance.unit.type}</td>
                                                <td>{maintenance.maintenanceType}</td>
                                                <td>{`${maintenance.amount} AED`} </td>
                                                <td>{new Date(maintenance.date).toLocaleDateString()}</td>
                                                <td>
                                                    {maintenance.image && (
                                                        <img
                                                            src={maintenance.image}
                                                            alt="Maintenance"
                                                            style={{ width: '50px', height: '50px', cursor: 'pointer' }}
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

            {/* Modal for displaying the selected image */}
            <Modal show={selectedImage !== null} onHide={handleCloseModal} size="md">
                <Modal.Header closeButton>
                    <Modal.Title>Maintenance Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={selectedImage} alt="Maintenance Image" style={{ maxWidth: '100%', height: '100%' }} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdminMaintenanceList;
