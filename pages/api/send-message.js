import fetch from "node-fetch";

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { channelId, message } = req.body;
  if (!channelId || !message) {
    return res
      .status(400)
      .json({ error: "channelId and message are required" });
  }

  try {
    const slackRes = await fetch("https://slack.com/api/chat.postMessage", {
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

    const data = await slackRes.json();

    if (!data.ok) {
      return res.status(500).json({ error: data.error || "Slack API error" });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to send message" });
  }
}
