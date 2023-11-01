const url = "http://localhost:3000";

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

export { getPayingUser };
