import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import OwnerSideBar from '../../Components/OwnerSideBar';
import { Col, Row, Table, Modal } from 'react-bootstrap';

const MaintenanceForOwner = () => {
    const { state } = useContext(AuthContext);
    const [maintenances, setMaintenances] = useState([]);
    const [error, setError] = useState(null);
    const [totalMaintenanceAmount, setTotalMaintenanceAmount] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchMaintenances = async () => {
            try {
                const response = await axios.get(`/api/maintenance/by-owner?ownerId=${state.user._id}`, {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`
                    }
                });
                setMaintenances(response.data);

                // Calculate total maintenance amount
                const totalAmount = response.data.reduce((total, maintenance) => total + maintenance.amount, 0);
                setTotalMaintenanceAmount(totalAmount);
            } catch (error) {
                console.error('Error fetching maintenance records:', error);
                setError('Error fetching maintenance records');
            }
        };

        fetchMaintenances();
    }, [state.user._id]);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    return (
        <>
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <OwnerSideBar />
                </Col>

                <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '90px' }}>
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10}>
                            <h3>Total Maintenance Amount: {totalMaintenanceAmount} AED</h3>
                            <div className="table-responsive">
                                <Table responsive striped bordered hover className='mt-3'>
                                    <thead>
                                        <tr>
                                            <th>Property</th>
                                            <th>Floor</th>
                                            <th>Unit No</th>
                                            <th>Maintenance Type</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                            <th>Image</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {maintenances.map((maintenance) => (
                                            <tr key={maintenance._id}>
                                                <td>{maintenance.property.name}</td>
                                                <td>{maintenance.floor.name}</td>
                                                <td>{maintenance.unit.unitNo}</td>
                                                <td>{maintenance.maintenanceType}</td>
                                                <td>{maintenance.amount} AED </td>
                                                <td>{new Date(maintenance.date).toLocaleDateString()} </td>
                                                <td>
                                                    <img
                                                        src={maintenance.image}
                                                        alt="Maintenance Image"
                                                        style={{ maxWidth: '100px', cursor: 'pointer' }}
                                                        onClick={() => handleImageClick(maintenance.image)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            {error && <p>{error}</p>}
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Modal for displaying the selected image */}
            <Modal show={selectedImage !== null} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Maintenance Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={selectedImage} alt="Selected Maintenance Image" style={{ maxWidth: '100%' }} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default MaintenanceForOwner;
