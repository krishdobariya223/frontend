import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import '../AllCss/dashboard.css';

const Dashboard = () => {
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showupModal, setShowupModal] = useState(false);
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
    const [isChecked, setIsChecked] = useState(false);
    const [videoId, setVideoId] = useState(null);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleShowTokenModal = () => setShowTokenModal(true);
    const handleCloseTokenModal = () => setShowTokenModal(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchVideos();
        fetchTokens();
    }, []);


    // Get All Video
    const fetchVideos = async () => {
        try {
            const response = await axios.get('https://video-call-backend-production-4619.up.railway.app/api/videos/get-all-videos');
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
            const response = await axios.get('https://video-call-backend-production-4619.up.railway.app/api/token/getAllTokens');
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
            await axios.post('https://video-call-backend-production-4619.up.railway.app/api/videos/create-video', {
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

    const handleUpdate = (id, currentLink, currentType) => {
        setVideoId(id);
        setVideoLink(currentLink);
        setVideoType(currentType);
        setShowupModal(true);
    };


    const handleUpdateVideo = async () => {
        if (!videoLink || !videoType) {
            setMsg('Please provide both video link and type');
            return;
        }

        setIsLoading(true);
        try {
            await axios.put(`https://video-call-backend-production-4619.up.railway.app/api/videos/update-video/${videoId}`, {
                video_link: videoLink,
                type: videoType,
            });
            setMsg('Video updated successfully');
            setTimeout(() => {
                setMsg('');
            }, 1000);
            handleupCloseModal();
            fetchVideos();
            window.location.reload();
        } catch (error) {
            setMsg('Error updating video');
            setTimeout(() => {
                setMsg('');
            }, 2000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this video?')) {
            try {
                await axios.delete(`https://video-call-backend-production-4619.up.railway.app/api/videos/delete-video/${id}`);
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
                await axios.post('https://video-call-backend-production-4619.up.railway.app/api/token/create', { token_value: tokenValue });
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
            await axios.delete(`https://video-call-backend-production-4619.up.railway.app/api/token/deleteToken/${id}`);

            fetchTokens();
        } catch (error) {
            setMsg('Error deleting token');
            setTimeout(() => {
                setMsg('');
            }, 2000);
        }
    };

    const handleupCloseModal = () => {
        setShowupModal(false);
        setVideoLink('');
        setVideoType('');
    };

    useEffect(() => {
        const fetchToggleState = async () => {
            try {
                const response = await axios.get('https://video-call-backend-production-4619.up.railway.app/api/config/toggle-state');
                setIsChecked(response.data.toggle_state);
            } catch (error) {
                console.error("Error fetching toggle state", error);
            }
        };

        fetchToggleState();
    }, []);

    const handleToggle = async () => {
        const newState = !isChecked;

        setIsChecked(newState);

        try {
            const response = await axios.post('https://video-call-backend-production-4619.up.railway.app/api/config/toggle-state', { value: newState });

            if (response.status === 200) {
                console.log("Toggle state updated successfully on backend.");
            }
        } catch (error) {
            console.error("Error updating toggle state", error);
            setIsChecked(!newState);
        }
    };

    return (
        <div className="container-fluid p-4">
            <h2 className="text-center mb-4">Dashboard</h2>

            <div className="text-center mb-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-3 mb-2">
                        <Button variant="" className="fa-update w-100" onClick={handleShowModal}>
                            Upload Video
                        </Button>
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                        <Button variant="" className="fa-update w-100" onClick={handleShowTokenModal}>
                            Create Token
                        </Button>
                    </div>
                    <div className="col-12 col-md-3 mb-2">
                        <Button className="fa-update w-100" onClick={() => navigate('/response')}>
                            View Response
                        </Button>
                    </div>
                </div>

                <div className="mb-2 mt-1">
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="form-label attribute-name fs-5 me-2">
                            {isChecked ? 'ON' : 'OFF'}
                        </div>

                        <label className="switch">
                            <input type="checkbox" checked={isChecked} onChange={handleToggle} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>

                <div className="text-center mb-4 d-flex justify-content-center flex-wrap">
                    <Button variant={filteredType === 0 ? 'secondary' : 'primary'} onClick={() => handleFilterType(0)} className="me-2 mb-2" style={{ width: '120px' }}>
                        Show Type 0
                    </Button>
                    <Button variant={filteredType === 1 ? 'secondary' : 'primary'} className="me-2 mb-2" onClick={() => handleFilterType(1)} style={{ width: '120px' }}>
                        Show Type 1
                    </Button>
                    <Button variant={filteredType === 'all' ? 'secondary' : 'primary'} className="me-2 mb-2" onClick={() => handleFilterType('all')} style={{ width: '120px' }}>
                        All
                    </Button>
                </div>
            </div>

            {msg && <div className="alert alert-info mt-4 text-center">{msg}</div>}

            {/* Video Table */}
            <div className="table-container">
                <table className="table table-bordered">
                    <thead>
                        <tr className="text-center">
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
                                    <td className="text-center">{video.id}</td>
                                    <td className="text-center">{index + 1}.mp4</td>
                                    <td className="text-center">{video.type}</td>
                                    <td className="d-flex justify-content-center">
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
            <Modal show={showTokenModal} onHide={() => setShowTokenModal(false)} centered>
                <Modal.Header className='rounded-0' closeButton>
                    <Modal.Title>Create Token</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <button className="fa-update mb-3" type="button" onClick={addInputGroup} style={{ width: '37px', height: '37px' }}>
                        <i className="fa-solid fa-plus d-flex justify-content-center"></i>
                    </button>

                    {tokenValues.map((value, index) => (
                        <div key={index} className="mb-3">
                            <InputGroup className="mb-3">
                                <Form.Control className="rounded-2" type="text" placeholder="Enter token value" value={value} onChange={(e) => handleTokenValueChange(index, e.target.value)} />
                                <Button variant="danger" className="ms-2 rounded-2" onClick={() => removeInputGroup(index)} style={{ width: '30px', height: '30px', marginTop: '5px' }}>
                                    <i className="fa-solid fa-times d-flex justify-content-center"></i>
                                </Button>
                            </InputGroup>
                        </div>
                    ))}

                    {isSaveVisible && (
                        <Button variant="primary" className="mt-1 w-100 w-sm-auto d-flex justify-content-center" onClick={handleCreateToken} disabled={isTokenLoading || tokenValues.length === 0}>
                            {isTokenLoading ? 'Saving...' : 'Save'}
                        </Button>
                    )}
                </Modal.Body>

                <h5 className="p-1 ms-3">Tokens List</h5>
                {tokens.map((token) => (
                    <div key={token.id}>
                        <InputGroup className="mb-3">
                            <Form.Control type="text" value={token.token_value} placeholder="Value" className="ms-3" />
                            <Button type="button" className="btn btn-danger mx-2 rounded-2" onClick={() => handleDeleteToken(token.id)} style={{ width: '30px', height: '30px', marginTop: '5px' }}>
                                <i className="fa-solid fa-times d-flex justify-content-center"></i>
                            </Button>
                        </InputGroup>
                    </div>
                ))}

                <Modal.Footer>
                    <Button variant="danger" className="w-100 w-sm-auto" onClick={() => setShowTokenModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


            {/* Modal for Video Upload */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header className='rounded-0' closeButton>
                    <Modal.Title>Upload Video</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formVideoLink">
                            <Form.Label>Video Link</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter video link or choose a file"
                                value={videoLink}
                                onChange={(e) => setVideoLink(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formFile">
                            <Form.Label className="mt-2">Choose Video File</Form.Label>
                            <Form.Control
                                type="file"
                                accept="video/*"
                                onChange={handleFileSelect}
                            />
                        </Form.Group>
                        <Form.Group controlId="formVideoType">
                            <Form.Label className="mt-2">Video Type</Form.Label>
                            <div className="input-group">
                                <Form.Control
                                    as="select"
                                    value={videoType}
                                    onChange={(e) => setVideoType(e.target.value)}
                                    aria-label="Video Type"
                                    className="custom-select-with-icon"
                                >
                                    <option value="0">Type 0</option>
                                    <option value="1">Type 1</option>
                                </Form.Control>
                            </div>
                        </Form.Group>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex flex-column flex-md-row w-100">
                        <Button
                            variant="secondary"
                            className="w-100 mb-2 mb-md-0"
                            onClick={handleCloseModal}
                        >
                            Close
                        </Button>
                        <Button
                            variant="primary ms-0 ms-md-2 w-100 w-md-auto"
                            onClick={handleUpload}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>

            <Modal show={showupModal} onHide={handleupCloseModal} centered>
                <Modal.Header className="rounded-0" closeButton>
                    <Modal.Title>Update Video</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formVideoLink">
                            <Form.Label>Video Link</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter new video link"
                                value={videoLink}
                                onChange={(e) => setVideoLink(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formVideoType">
                            <Form.Label className="mt-2">Video Type</Form.Label>
                            <Form.Control
                                as="select"
                                value={videoType}
                                onChange={(e) => setVideoType(e.target.value)}
                            >
                                <option value="0">Type 0</option>
                                <option value="1">Type 1</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex flex-column flex-md-row w-100">
                        <Button
                            variant="secondary"
                            className="w-100 mb-2 mb-md-0"
                            onClick={handleupCloseModal}
                        >
                            Close
                        </Button>
                        <Button
                            variant="primary ms-0 ms-md-2 w-100 w-md-auto"
                            onClick={handleUpdateVideo}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Updating...' : 'Update'}
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>

    );
};

export default Dashboard;