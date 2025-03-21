import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import '../AllCss/dashboard.css';

const Dashboard = () => {
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [videoLink, setVideoLink] = useState('');
    const [videoType, setVideoType] = useState('0');
    const [isLoading, setIsLoading] = useState(false);
    const [filteredType, setFilteredType] = useState('all');
    const [msg, setMsg] = useState('');
    const [showTokenModal, setShowTokenModal] = useState(false);
    const [tokenValues, setTokenValues] = useState([]);
    const [tokens, setTokens] = useState([]);
    const [isTokenLoading, setIsTokenLoading] = useState(false);
    const [isSaveVisible, setIsSaveVisible] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleShowTokenModal = () => setShowTokenModal(true);
    const handleCloseTokenModal = () => setShowTokenModal(false);

    useEffect(() => {
        fetchVideos();
        fetchTokens();
    }, []);

    // Get All Video
    const fetchVideos = async () => {
        try {
            const response = await axios.get('https://backend-production-17db.up.railway.app/api/videos/get-all-videos');
            setVideos(response.data.videos);
            setFilteredVideos(response.data.videos);
        } catch (error) {
            console.error(error);
            setMsg('Error fetching videos.');
            setTimeout(() => {
                setMsg('');
            }, 2000);
        }
    };

    // Get All Tokens
    const fetchTokens = async () => {
        try {
            const response = await axios.get('https://backend-production-17db.up.railway.app/api/token/getAllTokens');
            setTokens(response.data.tokens);
        } catch (error) {
            console.error(error);
            setMsg('Error fetching tokens.');
            setTimeout(() => {
                setMsg('');
            }, 2000);
        }
    };

    // View Video in Browser
    const handleViewVideo = (videoLink) => {
        if (videoLink) {
            window.open(videoLink, '_blank');
        } else {
            setMsg('Invalid video link');
            setTimeout(() => {
                setMsg('');
            }, 2000);
        }
    };

    // Create Video 
    const handleUpload = async () => {
        if (!videoLink || !videoType) {
            setMsg('Please provide a valid video link and type');
            setTimeout(() => {
                setMsg('');
            }, 2000);
            return;
        }

        setIsLoading(true);
        try {
            await axios.post('https://backend-production-17db.up.railway.app/api/videos/create-video', {
                video_link: videoLink,
                type: videoType,
            });
            setMsg('Video uploaded successfully');
            setTimeout(() => {
                setMsg('');
            }, 2000);

            setVideoLink('');
            setVideoType('0');
            fetchVideos();
            handleCloseModal();
        } catch (error) {
            setMsg('Error uploading video');
            setTimeout(() => {
                setMsg('');
            }, 2000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (id, videoLink, videoType) => {
        const newVideoLink = prompt("Enter new video link:", videoLink);
        const newType = prompt("Enter new type:", videoType);

        if (newVideoLink && newType) {
            try {
                await axios.put(`https://backend-production-17db.up.railway.app/api/videos/update-video/${id}`, {
                    video_link: newVideoLink,
                    type: newType,
                });
                setMsg('Video updated successfully');
                setTimeout(() => {
                    setMsg('');
                }, 2000);
                fetchVideos();
            } catch (error) {
                setMsg('Error updating video');
                setTimeout(() => {
                    setMsg('');
                }, 2000);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this video?')) {
            try {
                await axios.delete(`https://backend-production-17db.up.railway.app/api/videos/delete-video/${id}`);
                setMsg('Video deleted successfully');
                setTimeout(() => { setMsg(''); }, 2000);
                fetchVideos();
            } catch (error) {
                setMsg('Error deleting video');
                setTimeout(() => {
                    setMsg('');
                }, 2000);
            }
        }
    };

    // Show type 0,1,all
    const handleFilterType = (type) => {
        setFilteredType(type);
        if (type === 'all') {
            setFilteredVideos(videos);
        } else {
            setFilteredVideos(videos.filter(video => video.type === type));
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const videoUrl = URL.createObjectURL(file);
            setVideoLink(videoUrl);
        }
    };

    // Create Tokens
    const handleCreateToken = async () => {
        if (tokenValues.some((value) => !value)) {
            alert('Please provide valid token values for all input fields');
            return;
        }

        setIsTokenLoading(true);
        try {
            for (const tokenValue of tokenValues) {
                await axios.post('https://backend-production-17db.up.railway.app/api/token/create', { token_value: tokenValue });
            }

            setTokenValues([]);
            fetchTokens();
            setIsSaveVisible(false);
        } catch (error) {
            setMsg('Error creating token');
            setTimeout(() => {
                setMsg('');
            }, 2000);
        } finally {
            setIsTokenLoading(false);
        }
    };

    const handleTokenValueChange = (index, value) => {
        const updatedValues = [...tokenValues];
        updatedValues[index] = value;
        setTokenValues(updatedValues);
    };

    const addInputGroup = () => {
        setTokenValues([...tokenValues, '']);
        setIsSaveVisible(true);
    };

    const removeInputGroup = (index) => {
        const updatedValues = tokenValues.filter((_, i) => i !== index);
        setTokenValues(updatedValues);
    };

    const handleDeleteToken = async (id) => {
        try {
            await axios.delete(`https://backend-production-17db.up.railway.app/api/token/deleteToken/${id}`);

            fetchTokens();
        } catch (error) {
            setMsg('Error deleting token');
            setTimeout(() => {
                setMsg('');
            }, 2000);
        }
    };

    return (
        <div className="container-fluid p-4">
            <h2 className="text-center mb-4">Dashboard</h2>

            <div className="text-center mb-4">
                <Button variant="" className='fa-update' style={{ width: '150px' }} onClick={handleShowModal}>
                    Upload Video
                </Button>

                <Button variant="" className='fa-update ms-2' style={{ width: '150px' }} onClick={handleShowTokenModal}>
                    Create Token
                </Button>

                <div className="text-center mb-4 d-flex justify-content-end">
                    <Button variant={filteredType === 0 ? 'secondary' : 'primary'} onClick={() => handleFilterType(0)} style={{ width: '120px' }}>
                        Show Type 0
                    </Button>
                    <Button variant={filteredType === 1 ? 'secondary' : 'primary'} className="ms-2" onClick={() => handleFilterType(1)} style={{ width: '120px' }}>
                        Show Type 1
                    </Button>
                    <Button variant={filteredType === 'all' ? 'secondary' : 'primary'} className="ms-2 d-flex justify-content-center" onClick={() => handleFilterType('all')} style={{ width: '40px' }}>
                        All
                    </Button>
                </div>
            </div>

            {msg && <div className="alert alert-info mt-4 text-center">{msg}</div>}

            {/* Video Table */}
            <div className="table-container">
                <table className="table table-bordered">
                    <thead>
                        <tr className='text-center'>
                            <th style={{ width: '100px' }}>ID</th>
                            <th>Video</th>
                            <th>Type</th>
                            <th style={{ width: '150px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVideos.length > 0 ? (
                            filteredVideos.map((video, index) => (
                                <tr key={video.id}>
                                    <td className='text-center'>{video.id}</td>
                                    <td className='text-center'>{index + 1}.mp4</td>
                                    <td className='text-center'>{video.type}</td>
                                    <td className='d-flex justify-content-center'>
                                        <button className="btn fa-update" onClick={() => handleUpdate(video.id, video.video_link, video.type)}>
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button className="btn fa-delete ms-2" onClick={() => handleDelete(video.id)}>
                                            <i className="fa-solid fa-trash text-white"></i>
                                        </button>
                                        <button className="btn fa-view ms-2" onClick={() => handleViewVideo(video.video_link)}>
                                            <i className="fa-solid fa-eye text-white"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    No videos available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for token Create */}
            <Modal show={showTokenModal} onHide={() => setShowTokenModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Token</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Button to show input fields */}
                    <button className="fa-update mb-3" type="button" onClick={addInputGroup} style={{ width: '37px', height: '37px' }}>
                        <i className="fa-solid fa-plus d-flex justify-content-center"></i>
                    </button>

                    {/* Render input fields dynamically */}
                    {tokenValues.map((value, index) => (
                        <div key={index} className="mb-3">
                            <InputGroup className="mb-3">
                                <Form.Control className='rounded-2' type="text" placeholder="Enter token value" value={value} onChange={(e) => handleTokenValueChange(index, e.target.value)} />
                                <Button variant="danger" className="ms-2 rounded-2" onClick={() => removeInputGroup(index)} style={{ width: '30px', height: '30px', marginTop: '5px' }}>
                                    <i className="fa-solid fa-times d-flex justify-content-center"></i>
                                </Button>
                            </InputGroup>
                        </div>
                    ))}

                    {/* Save button */}
                    {isSaveVisible && (
                        <Button variant="primary" className="mt-1 w-25 d-flex justify-content-center" onClick={handleCreateToken} disabled={isTokenLoading || tokenValues.length === 0}>
                            {isTokenLoading ? 'Saving...' : 'Save'}
                        </Button>
                    )}
                </Modal.Body>

                <h5 className="p-1 ms-3">Tokens List</h5>
                {tokens.map((token) => (
                    <div key={token.id} className="">
                        <InputGroup className="mb-3">
                            <Form.Control type="text" value={token.token_value} placeholder="Value" className="ms-3" />
                            <Button type="button" className="btn btn-danger mx-2 rounded-2" onClick={() => handleDeleteToken(token.id)} style={{ width: '30px', height: '30px', marginTop: '5px' }}>
                                <i className="fa-solid fa-times d-flex justify-content-center"></i>
                            </Button>
                        </InputGroup>
                    </div>
                ))}

                <Modal.Footer>
                    <Button variant="danger" className="w-25" onClick={() => setShowTokenModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Video Upload */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Video</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formVideoLink">
                            <Form.Label>Video Link</Form.Label>
                            <Form.Control type="text" placeholder="Enter video link or choose a file" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="formFile">
                            <Form.Label className="mt-2">Choose Video File</Form.Label>
                            <Form.Control type="file" accept="video/*" onChange={handleFileSelect} />
                        </Form.Group>

                        <Form.Group controlId="formVideoType">
                            <Form.Label className="mt-2">Video Type</Form.Label>
                            <Form.Control as="select" value={videoType} onChange={(e) => setVideoType(e.target.value)}>
                                <option value="0">Type 0</option>
                                <option value="1">Type 1</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div className='d-flex'>
                        <Button variant="secondary" style={{ width: '230px' }} onClick={handleCloseModal}>Close</Button>
                        <Button variant="primary ms-2" style={{ width: '230px' }} onClick={handleUpload} disabled={isLoading}>
                            {isLoading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default Dashboard;