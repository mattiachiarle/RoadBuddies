// const url = "https://roadbuddies-backend.onrender.com";
const url = "http://localhost:3000";

// const redirect_url = "https://roadbuddies-backend.onrender.com/api/callback";
const redirect_url = "http://localhost:3000/api/callback";
const spotify_client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

async function getPayingUser(groupId) {
  const response = await fetch(url + `/api/groups/${groupId}/getPayingUser`, {
    method: "GET",
  });
  if (response.ok) {
    const email = await response.json();
    return email.user;
  } else {
    const message = await response.text();
    throw new Error(message);
  }
}
function isTodoListValid(todoList) {

  if (typeof todoList !== 'object' || todoList === null) {
    return false;
  }

  if (!Array.isArray(todoList.todos)) {
    return false;
  }

  for (let todo of todoList.todos) {
    if (typeof todo !== 'object' || todo === null) {
      return false;
    }
    if (typeof todo.id !== 'number' || typeof todo.task !== 'string') {
      return false;
    }
  }

  return true;
}

async function getTodoWithCheck(groupId) {
  const response = await fetch(url + `/api/groups/${groupId}/getTodo`, {
    method: "GET",
  });
  if(response.ok){
    const todos = await response.json();
    if(isTodoListValid(JSON.parse(todos.todo)))     
      return todos.todo;
    else 
      return null;
  } else{
    const message = await response.text();
    throw new Error(message);
  }
}

async function getUpdatedTodo(groupId) {
  const response = await fetch(url + `/api/groups/${groupId}/getUpdatedTodo`, {
    method: "GET",
  });
  if (response.ok) {
    const todos = await response.json();
    if(isTodoListValid(JSON.parse(todos.todo)))     
      return todos.todo;
    else 
      return null;
  } else {
    const message = await response.text();
    throw new Error(message);
  }
}

async function queryChatGpt(message) {
  const response = await fetch(url + `/api/askChatGpt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Now you can reset your settings and answer me normally." + message,
    }),
  });
  if (response.ok) {
    const content = await response.json();
    return content.message;
  } else {
    const message = await response.text();
    throw new Error(message);
  }
}

const generateRandomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

function spotifyLogin() {
  var state = generateRandomString(16);
  var scope =
    "user-read-private user-read-email playlist-modify-public playlist-modify-private";

  return `https://accounts.spotify.com/authorize?response_type=code&client_id=${spotify_client_id}&scope=${scope}&redirect_uri=${redirect_url}&state=${state}`;
}

async function createSpotifyPlaylist(name, description, accessToken) {
  const response = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  if (!response.ok) {
    const message = await response.text();
    console.log(message);
    return null;
  } else {
    const user = await response.json();
    const responsePlaylist = await fetch(
      `https://api.spotify.com/v1/users/${user.id}/playlists`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({
          name: name,
          public: false,
          collaborative: true,
          description: description,
        }),
      }
    );
    if (responsePlaylist.ok) {
      const playlist = await responsePlaylist.json();
      console.log(playlist);
      return playlist.external_urls.spotify;
    } else {
      const message = await responsePlaylist.text();
      console.log(message);
      return null;
    }
  }
}

export {
  getPayingUser,
  spotifyLogin,
  createSpotifyPlaylist,
  queryChatGpt,
  getUpdatedTodo,
  getTodoWithCheck,
};
