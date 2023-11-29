import { useContext, useEffect, useState } from "react";

import AppContext from "../context/appContext";
import { Trip } from "../utils/types";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
function EditTripInfo() {
  const navigate = useNavigate();
  const supabase = useContext(AppContext);
  const [err, setError] = useState<boolean>(false);
  const [trip, setTrip] = useState<Trip | null>();
  const { tripId } = useParams();
  useEffect(() => {
    const fetchTrip = async () => {
      const { data, error } = await supabase
        .from("group")
        .select("*")
        .eq("id", tripId);

      if (error) {
        console.error("Error fetching trip:", error);
      } else if (data) {
        setTrip(data[0]);
      }
    };

    fetchTrip();
  }, [tripId, supabase]);
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setError(false);
    if (trip) {
      setTrip({
        ...trip,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (trip) {
      const startDate = dayjs(trip.start_date);
      const endDate = dayjs(trip.end_date);
      if (startDate > endDate) {
        setError(true);
        return;
      }
    }
    const { data, error } = await supabase
      .from("group")
      .update(trip)
      .eq("id", tripId);

    if (error) {
      console.error("Error updating trip:", error);
    } else if (data) {
      console.log("Trip updated successfully:", data);
    }
    navigate(`/trips/${tripId}`);
  };

  if (!trip) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div style={{display:"flex", flexDirection:"column", gap:"1rem"}}>
        <div style ={{display:"flex", flexDirection:"row", gap:"2rem"}}>     
          <Input type="date" name="start_date" value={trip.start_date} isInvalid={err} label="Start Date" onChange={handleInputChange}/>
          <Input type="date" name="end_date" value={trip.end_date} isInvalid={err} errorMessage={err && "Start date must be before end date"} label="End Date" onChange={handleInputChange}/>
        </div>
        <div style ={{display:"flex", flexDirection:"row", gap:"2rem"}}>
          <Input type="text" name="start" value={trip.start} label="Start Location" onChange={handleInputChange}/>
          <Input type="text" name="destination" label="Destination" value={trip.destination} onChange={handleInputChange}/>
        </div>
          <Select label="Vehicle" name="vehicle" defaultSelectedKeys={[trip.vehicle]} onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => handleInputChange(event)}>
            <SelectItem key="Car" value="Car" style={{color:"white"}}>Car</SelectItem>
            <SelectItem key="Motorbike" value="Motorbike" style={{color:"white"}}>Motorbike</SelectItem>
            <SelectItem key="Bicycle" value="Bicycle" style={{color:"white"}} >Bicycle</SelectItem>
            <SelectItem key="On foot" value="On foot" style={{color:"white"}}>On foot</SelectItem>
            <SelectItem key="Airplane" value="Airplane" style={{color:"white"}}>Airplane</SelectItem>
            <SelectItem key="Train" value="Train" style={{color:"white"}}>Train</SelectItem>
          </Select>
        <Button onClick={handleSubmit} value="Update Trip">Submit</Button>
      </div>
    </>
  );
}

export default EditTripInfo;
