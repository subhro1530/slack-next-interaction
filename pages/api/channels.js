export default async function handler(req, res) {
  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

  try {
    const response = await fetch(
      "https://slack.com/api/conversations.list?types=public_channel",
      {
        headers: {
          Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
        },
      }
    );
    const data = await response.json();

    if (!data.ok) {
      return res
        .status(500)
        .json({ error: data.error || "Failed to fetch channels" });
    }

    // Send back only id and name of channels for dropdown
    const channels = data.channels.map(({ id, name }) => ({ id, name }));

    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ error: "Network error" });
  }
}
