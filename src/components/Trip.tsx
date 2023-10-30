import { Outlet } from 'react-router-dom';

function Trip() {
    return (
        <div className="trip-layout">
            <div className="sidebar">
                {/* Sidebar content goes here */}
            </div>
            <div className="main-content">
                <Outlet /> {/* This will render the child routes */}
            </div>
        </div>
    );
}
export default Trip;