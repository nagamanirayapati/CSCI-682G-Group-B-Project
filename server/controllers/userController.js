import User from "../models/user-model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    //_id: { _id: { $ne: loggedInUserId } } is used so the loggedIn user cannot send messages to him/herself.
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    // to find all users including the loggedInUser
    //const allUsers = await User.find()

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebars: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
