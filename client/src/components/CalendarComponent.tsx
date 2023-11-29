import {useNavigate} from "react-router-dom";
import {Button} from "react-bootstrap";

export default function CalendarComponent() {
    const navigate = useNavigate();

    const handleCreateEventClick = () => {
        navigate(`../createEvent`);
    };
    const handleViewEventsClick = () => {
        navigate(`../events`);
    };

    return (
        <>

            <Button onClick={handleCreateEventClick}>Create Event</Button>
            <Button onClick={handleViewEventsClick}>Events</Button>
        </>
    );
}
