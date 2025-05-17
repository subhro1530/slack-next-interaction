export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
  const { channelId, message } = req.body;

  if (!channelId || !message) {
    return res.status(400).json({ error: "Channel and message are required" });
  }

  try {
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: channelId,
        text: message,
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      return res
        .status(500)
        .json({ error: data.error || "Failed to send message" });
    }

    res.status(200).json({ ok: true, ts: data.ts });
  } catch (error) {
    res.status(500).json({ error: "Network error" });
  }
}
  