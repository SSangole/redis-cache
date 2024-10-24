import { deleteDataFromCache, getKeyForRequest } from "../middlewares/cache/cache.util.js";

// the user list retrieved with a query or an API call
let users = [
  { id: 1, email: "john.doe@example.com", name: "John Doe" },
  { id: 2, email: "jane.smith@example.com", name: "Jane Smith" },
  { id: 3, email: "alice.jones@example.com", name: "Alice Jones" },
  { id: 4, email: "bob.miller@example.com", name: "Bob Miller" },
  { id: 5, email: "sara.white@example.com", name: "Sara White" },
  { id: 6, email: "mike.jenkins@example.com", name: "Mike Jenkins" },
  { id: 7, email: "emily.clark@example.com", name: "Emily Clark" },
  { id: 8, email: "david.ross@example.com", name: "David Ross" },
  { id: 9, email: "lisa.hall@example.com", name: "Lisa Hall" },
  { id: 10, email: "alex.garcia@example.com", name: "Alex Garcia" },
];


const getAllUsers = async (req, res) => {
    // introduce time delay to retrieve the user list
    await new Promise((resolve) => setTimeout(resolve, 250));

    res.json({
    users: users,
    });
};

const getOneUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find((user) => user.id === id);
    if (user === undefined) {
        res.status(404).json({ message: `User with id ${id} not found` });
        return;
    }

    // introduce time delay to retrieve the user
    await new Promise((resolve) => setTimeout(resolve, 250));
    res.json({
        user: user,
        });
}

const updateUserById = async (req, res) => {
    const { id } = req.params;

    const user = users.filter((user) => user.id === parseInt(id));
    if (user.length === 0) {
        res.status(404).json({ message: `User with id ${id} not found` });
        return;
    }

    users = users.map((user) => {
        if (user.id === parseInt(id)) {
            return { ...user, ...req.body };
        }
        return user;
    });

    // delete the users cache from Redis since the one user is updated
    const reqObj = {
        params: {},
        query: {},
        body: {},
        path: '/api/v1/users',
    };
    const key = getKeyForRequest(reqObj);
    await deleteDataFromCache(key);

    res.json({
        message: `User with id ${id} updated`,
    });
}

export { getAllUsers, getOneUser, updateUserById }; 