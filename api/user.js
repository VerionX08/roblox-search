export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Missing username" });
  }

  try {
    const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: false
      })
    });

    const userData = await userRes.json();

    if (!userData.data.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userData.data[0].id;

    const profileRes = await fetch(`https://users.roblox.com/v1/users/${userId}`);
    const profile = await profileRes.json();

    const avatarRes = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`
    );
    const avatarData = await avatarRes.json();

    res.status(200).json({
      id: userId,
      name: profile.name,
      displayName: profile.displayName,
      created: profile.created,
      avatar: avatarData.data[0].imageUrl
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
