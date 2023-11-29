import { useContext, useState } from "react";
import AppContext from "../context/appContext";
import { Trip } from "../utils/types";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";

function CreateTrip({ email }) {
  const [error, setError] = useState<boolean>(false);
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedTomorrow = tomorrow.toISOString().split('T')[0];
  const navigate = useNavigate();
  const supabase = useContext(AppContext);
  const [trip, setTrip] = useState<Trip>({
    id: 0,
    description: "",
    name: "",
    start_date: today,
    end_date: formattedTomorrow,
    vehicle: "",
    start: "",
    destination: "",
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (trip) {
      setTrip({
        ...trip,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    console.log(trip)
    event.preventDefault();
    if (trip) {
      const startDate = dayjs(trip.start_date);
      const endDate = dayjs(trip.end_date);
      if (startDate > endDate) {
        setError(true);
        return;
      }
    }
    let { data, error } = await supabase
      .from("group")
      .insert({
        description: trip?.description,
        name: trip?.name,
        start_date: trip?.start_date,
        end_date: trip?.end_date,
        vehicle: trip?.vehicle,
        start: trip?.start,
        destination: trip?.destination,
      })
      .select();

    if (error) {
      console.error("Error inserting trip:", error);
    } else if (data) {
      console.log("Trip inserted successfully:", data);
    }

    const tripId = data[0].id;

    await supabase.from("trips").insert([{ group_id: tripId, user_id: email }]);

    navigate(`/`);
  };

  return (
    <>
    <div style={{display:"flex", flexDirection:"column", gap:"1rem", color:"white", alignItems:"center"}}>
      <h2>Create Trip</h2>
      <div style ={{display:"flex", flexDirection:"row", gap:"2rem"}}>
        <Input type="text" name="name" value={trip.name} label="Name" onChange={handleInputChange}/>
      </div>
      <div style ={{display:"flex", flexDirection:"row", gap:"2rem"}}>
        <Textarea placeholder="Insert your description" type="text" name="description" value={trip.description} label="Description" onChange={handleInputChange}/>
      </div>
      <div style ={{display:"flex", flexDirection:"row", gap:"2rem"}}>     
        <Input type="date" name="start_date" value={trip.start_date } isInvalid={error} label="Start Date" onChange={handleInputChange}/>
        <Input type="date" name="end_date" value={trip.end_date} isInvalid={error} errorMessage={error && "Start date must be before end date"} label="End Date" onChange={handleInputChange}/>
      </div>
      <div style ={{display:"flex", flexDirection:"row", gap:"2rem"}}>
        <Input type="text" name="start" value={trip.start} label="Start Location" onChange={handleInputChange}/>
        <Input type="text" name="destination" label="Destination" onChange={handleInputChange}/>
      </div>
      <div style ={{display:"flex", flexDirection:"row", gap:"2rem", width:"27%"}}>
        <Select label="Vehicle" name="vehicle" defaultSelectedKeys={[trip.vehicle]} onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => handleInputChange(event)}>
          <SelectItem key="Car" value="Car" style={{color:"white"}}>Car</SelectItem>
          <SelectItem key="Motorbike" value="Motorbike" style={{color:"white"}}>Motorbike</SelectItem>
          <SelectItem key="Bicycle" value="Bicycle" style={{color:"white"}} >Bicycle</SelectItem>
          <SelectItem key="On foot" value="On foot" style={{color:"white"}}>On foot</SelectItem>
          <SelectItem key="Airplane" value="Airplane" style={{color:"white"}}>Airplane</SelectItem>
          <SelectItem key="Train" value="Train" style={{color:"white"}}>Train</SelectItem>
        </Select>
        </div>
      <Button onClick={handleSubmit} value="Update Trip">Submit</Button>
    </div>
  </>
  );
}

export default CreateTrip;
