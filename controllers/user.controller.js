const User = require("../models/user.model");
const jwt = require("jsonwebtoken");


exports.userProfile = async (req, res) => {
  const { bio, image } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.userId },
      { image, bio },
      { new: true }
    );
    res.status(202).json({ message: "user profile", user });
  } catch (error) {
    console.error("failed to get user profile", error);
    res.status(500).json({ error: "failed to get user" });
  }
};

exports.followUser = async (req, res) => {
    const currentUserId = req.userId;
    const targetUserId = req.params.id;
  
    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You can't follow yourself." });
    }
  
    try {
      const [targetUser, currentUser] = await Promise.all([
        User.findById(targetUserId),
        User.findById(currentUserId),
      ]);
  
      if (!targetUser || !currentUser) {
        return res.status(404).json({ message: "User not found." });
      }
  
      const isAlreadyFollowing = targetUser.followers.includes(currentUserId);
  
      if (isAlreadyFollowing) {
        return res.status(400).json({ message: "You already follow this user." });
      }
  
      // Add follow (efficiently with $addToSet to avoid duplicates)
      await Promise.all([
        User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } }),
        User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } }),
      ]);
  
      return res.status(200).json({ message: "User followed successfully." });
    } catch (error) {
      console.error("Follow error:", error);
      return res.status(500).json({ message: error.message });
    }
  };
  

exports.unfollowUser = async (req, res) => {
  const currentUserId = req.userId;
  const targetUserId = req.params.id;

  if (currentUserId === targetUserId) {
    res.status(400).json({ message: "you can't unfollow yourself" });
  }

  try {
    const [user, currentUser] = await Promise.all([
      User.findById(targetUserId),
      User.findById(currentUserId),
    ]);

    if (!user || !currentUser) {
      return res.status(400).json({ error: "user not found" });
    }

    // Check if current user is following the target user
    const isFollowing = user.followers.includes(currentUserId);

    if (!isFollowing) {
      return res.status(400).json({ error: "you are not following this user" });
    }

    await Promise.all([
      User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: currentUserId },
      }),
      User.findByIdAndUpdate(currentUserId, {
        $pull: { following: targetUserId },
      }),
    ]);
    return res.status(200).json({ message: "User unfollowed successfully." });
  } catch (error) {
    console.error("Unfollow error:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getUserFollowers = async (req, res) => {
    const {id} = req.params;
    try {
        const user = await User.findById(id).populate('followers','username email').exec();
        res.json(user.followers)
    } catch (error) {
        console.log(error)
        res.json(error)
    }
}