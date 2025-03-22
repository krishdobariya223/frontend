import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AllCss/view.css'
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const ViewResponse = () => {
    const [videos, setVideos] = useState([]);
    const navigate = useNavigate();

    const fetchVideos = async () => {
        try {
            const response = await axios.get('https://backend-production-17db.up.railway.app/api/videos/get-all-videos');
            setVideos(response.data.videos);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    return (
        <div className="container-fluid-div ">
            <Button className="fa-update m-1 mb-3" style={{ width: "90px" }} onClick={() => navigate('/dashboard')}>
                Go Back
            </Button>
            <div className='view-div p-0'>
                <pre style={{ fontSize: '11px' }}>{JSON.stringify(videos, null, 2)}</pre>

            </div>
        </div>
    );
};

export default ViewResponse;
