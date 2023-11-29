import { spotifyLogin, createSpotifyPlaylist } from "../API.js";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppContext from "../context/appContext.js";
import { Button, Input, Textarea } from "@nextui-org/react";
import { FaSpotify } from "react-icons/fa";

function Spotify() {
  const supabase = useContext(AppContext);
  const [url, setUrl] = useState("");
  const [logged, setLogged] = useState(false);
  const [playlist, setPlaylist] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { tripId } = useParams();

  useEffect(() => {
    const getPlaylist = async () => {
      const { data, error } = await supabase
        .from("group")
        .select("spotify_playlist")
        .eq("id", tripId);
      if (error) {
        console.error("Error fetching playlist:", error);
      } else if (data) {
        setPlaylist(data[0].spotify_playlist);
      }
    };

    const complete_url = spotifyLogin();
    setUrl(complete_url);
    if (localStorage.getItem("spotify_access_token")) {
      setLogged(true);
      getPlaylist();
    }
  }, [playlist]);

  const clearSpotifyTokens = () => {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    setLogged(false);
  };

  const createPlaylist = async () => {
    const url = await createSpotifyPlaylist(
      name,
      description,
      localStorage.getItem("spotify_access_token")
    );
    if (!url) {
      clearSpotifyTokens();
      localStorage.removeItem("spotify_access_token");
    } else {
      const { error } = await supabase
        .from("group")
        .update({ spotify_playlist: url })
        .eq("id", tripId);
      if (error) {
        console.error("Error updating playlist:", error);
      } else {
        setPlaylist(url);
      }
    }
  };

  const handleNameChange = (ev) => {
    setName(ev.target.value);
  };

  const handleDescriptionChange = (ev) => {
    setDescription(ev.target.value);
  };

  return (
    <>
      {!logged ? (
        <div style={{display:"flex", flexDirection:"column", alignItems:"center", minHeight:"80vh", justifyContent:"center"}}>
          <a href={url}>
            <Button color="success" variant="ghost">Login into Spotify<FaSpotify size="20px"/></Button>
          </a>
        </div>
      ) : (
        <>
        <div style={{color:"white",display:"flex", flexDirection:"column", alignItems:"center", minHeight:"80vh", justifyContent:"center", gap:"1rem"}}>
          {!playlist ? (
            <>
              <h3>Give a name to your playlist</h3>
              <div style={{display:"flex", flexDirection:"row", width:"25%", alignItems:"center"}}>
                <Input type="text" name="name" variant="underlined" value={name} onChange={handleNameChange}/>
              </div>
              <div style={{display:"flex", flexDirection:"row", width:"25%", alignItems:"center"}}>
                <Textarea placeholder="Add a description" type="text" name="description" value={description} onChange={handleDescriptionChange}/>
              </div>
              <div style={{display:"flex", flexDirection:"row", width:"25%", alignItems:"center", gap:"1rem", justifyContent:"center"}}>
              <Button variant="ghost" color="success" onClick={createPlaylist}>Create</Button>
              <Button variant="ghost" onClick={() => {setDescription(""); setName("");}}>Cancel</Button>
              </div>
            </>
          ) : (
              <a href={playlist} >
                  <Button color="success" variant="ghost">Go to playlist<FaSpotify size="20px"/></Button>
              </a>
          )}
          <Button  style={{marginTop:"5rem"}} color="danger" variant="ghost" onClick={clearSpotifyTokens}>Logout from Spotify</Button>
          </div>
        </>
      )}
    </>
  );
}

export default Spotify;
