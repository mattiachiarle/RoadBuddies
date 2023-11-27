import { Button, Form, Row, Col } from "react-bootstrap";
import { spotifyLogin, createSpotifyPlaylist } from "../API.js";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppContext from "../context/appContext.js";

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

  const createPlaylist = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    const url = await createSpotifyPlaylist(
      name,
      description,
      localStorage.getItem("spotify_access_token")
    );
    if (!url) {
      clearSpotifyTokens();
    } else {
      const { data, error } = await supabase
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
        <a href={url}>
          <Button variant="primary">Login into Spotify</Button>
        </a>
      ) : (
        <>
          <div>You are logged in!</div>
          {!playlist ? (
            <Form onSubmit={createPlaylist}>
              <Row>
                <Col>
                  <Form.Group controlId="formName">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={name}
                      onChange={handleNameChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="formDescription">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control
                      type="text"
                      name="description"
                      value={description}
                      onChange={handleDescriptionChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button type="submit">Create playlist</Button>
            </Form>
          ) : (
            <a href={playlist}>
              <Button>Get playlist</Button>
            </a>
          )}
          <Button onClick={clearSpotifyTokens}>Logout from Spotify</Button>
        </>
      )}
    </>
  );
}

export default Spotify;
