const users = [];

const addUser = ({ id, username, room }) => {
  // clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    // validate the data
    return {
      error: "username and room required",
    };
  }
  // check for existing user
  const existingUser = users.find(
    (user) => user.room === room && user.username === username
  );

  if (existingUser) {
    return {
      error: "username in use!",
    };
  }

  // store username
  const user = { id, username, room };
  users.push(user);

  return { user };
};

const removeUser = (id) => {
    // faster then filter
    const index = users.findIndex(user => user.id === id)

    if (index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find(user => user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter(user => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
}