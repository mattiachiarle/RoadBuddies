import {Outlet, useNavigate, useParams} from 'react-router-dom';
import {Button} from "react-bootstrap";

function Trip() {
    const navigate = useNavigate();
    const { tripId } = useParams();

    return (
        <div className="trip-layout">
            <div className="sidebar">
                {/* Sidebar content goes here */}
                <Button onClick={() => navigate(`${tripId}/editInfo`)} variant="primary">Edit Info</Button>
                <Button onClick={() => navigate(`${tripId}/chat`)} variant="primary">Chat</Button>
                <Button onClick={() => navigate(`${tripId}/editToDo`)} variant="primary">Edit To-Do</Button>
            </div>
            <div className="main-content">
                <Outlet /> {/* This will render the child routes */}
            </div>
        </div>
    );
}


export default Trip;