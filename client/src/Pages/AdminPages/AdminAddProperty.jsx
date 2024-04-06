import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Container, Form, Button } from 'react-bootstrap'; // Import Bootstrap components

function AddAdminProperty() {
    const { state } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        userId: '', 
        address: '',
        status: '',
        propertyType: '',
        contactinfo:'',
        image: null
    });

    const [owners, setOwners] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch all owners from the API
        axios.get('/api/users/all-owners-for-admin', {
            headers: {
                Authorization: `Bearer ${state.user.token}`
            }
        })
        .then(response => {
            console.log(response.data); // Check the data received from the API
            setOwners(response.data);
        })
        .catch(error => {
            console.error('Failed to fetch owners:', error);
            setError('Failed to fetch owners');
        });
    }, [state.user.token]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    //contactinfo
    const handleImageChange = e => {
        setFormData({
            ...formData,
            image: e.target.files[0]
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true); // Set loading state while submitting

        try {
            const formDataWithImage = new FormData(); 
            formDataWithImage.append('name', formData.name);
            formDataWithImage.append('userId', formData.userId);
            formDataWithImage.append('address', formData.address);
            formDataWithImage.append('status', formData.status);
            formDataWithImage.append('propertyType', formData.propertyType);
            formDataWithImage.append('contactinfo', formData.contactinfo);
            formDataWithImage.append('image', formData.image);

            await axios.post('/api/properties/addpropertybyadmin', formDataWithImage, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${state.user.token}`
                }
            });

            // Property added successfully, clear form data
            setFormData({
                name: '',
                userId: '',
                address: '',
                status: '',
                propertyType: '',
                contactinfo:'',
                image: null
            });

            // Optionally, show success message or redirect
        } catch (error) {
            console.error('Error adding property:', error);
            // Handle error
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <Container className="py-8">
            <div className="border p-4 mx-auto my-5 shadow-sm" style={{ maxWidth: 400 }}>
                <h2 className="text-center text-uppercase">Add Property</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name:</Form.Label>
                        <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Owner:</Form.Label>
                        <Form.Select name="userId" value={formData.userId} onChange={handleChange}>
                            <option value="">Select Owner</option>
                            {owners.map(owner => (
                                <option key={owner._id} value={owner._id}>{owner.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Address:</Form.Label>
                        <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Status:</Form.Label>
                        <Form.Control type="text" name="status" value={formData.status} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>contactinfo</Form.Label>
                        <Form.Control type="text" name="contactinfo" value={formData.contactinfo} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Property Type:</Form.Label>
                        <Form.Control type="text" name="propertyType" value={formData.propertyType} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Image:</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? 'Adding Property...' : 'Add Property'}
                    </Button>
                </Form>
                {error && <p className="text-danger">{error}</p>}
            </div>
        </Container>
    );
}

export default AddAdminProperty;
