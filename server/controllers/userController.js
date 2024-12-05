import User from "../models/user.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    console.log("id: " + loggedInUserId);

    //_id: { _id: { $ne: loggedInUserId } } is used so the loggedIn user cannot send messages to him/herself.
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    // to find all users including the loggedInUser
    //const allUsers = await User.find()

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log(req);
    console.log("req.user: " + req.user);
    console.log("req.user._id: " + req.user._id);
    console.log("Error in getUsersForSidebars: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
