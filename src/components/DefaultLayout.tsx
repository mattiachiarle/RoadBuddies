import { useEffect, useState } from 'react';
import {Row, Col, Card} from 'react-bootstrap';
import {useAppContext} from "../context/appContext.tsx";

// Initialize Supabase client
const {supabase} = useAppContext()

function DefaultLayout(props: { userEmail: string}) {
    const [trips, setTrips] = useState([]);
    const {userEmail} = props;
    useEffect(() => {
        // Function to fetch trips from the database
        const fetchTrips = async () => {
            if (userEmail) {
                try {
                    const { data: tripsData, error } = await supabase
                        .from('trips')
                        .select('group(name)')
                        .eq('user_id', userEmail);

                    if (error) throw error;

                    // Set the trip names in state
                    setTrips(tripsData.map((trip: { group: { name: any; }; }) => trip.group.name));
                } catch (error) {
                    console.error('Error fetching trips:', error);
                }
            }
        };

        fetchTrips();
    }, [userEmail]);

    return (
        <>
            <Row>
                <Col>
                    <h3>Your Trips</h3>
                    {trips.length > 0 ? (
                        trips.map((tripName, index) => (
                            <Card key={index} style={{ margin: '10px 0' }}>
                                <Card.Body>{tripName}</Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p>No trips found.</p>
                    )}
                </Col>
            </Row>
        </>
    );
}

export default DefaultLayout;
