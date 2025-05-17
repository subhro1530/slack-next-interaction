import { useEffect, useState } from "react";

export default function Home() {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  // Fetch channels from backend API
  useEffect(() => {
    async function fetchChannels() {
      try {
        const res = await fetch("/api/channels");
        const data = await res.json();

        // Make sure data is array
        if (Array.isArray(data)) {
          setChannels(data);
          if (data.length > 0) setSelectedChannel(data[0].id);
        } else {
          setChannels([]);
        }
      } catch (error) {
        setChannels([]);
      }
    }
    fetchChannels();
  }, []);

  // Handle sending message
  async function handleSend() {
    if (!message.trim() || !selectedChannel) return;
    setSending(true);
    setStatus(null);

    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: selectedChannel, message }),
      });
      const result = await res.json();

      if (res.ok) {
        setStatus({ success: true, message: "Message sent!" });
        setMessage("");
      } else {
        setStatus({
          success: false,
          message: result.error || "Failed to send",
        });
      }
    } catch (err) {
      setStatus({ success: false, message: "Network error" });
    }
    setSending(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-900 bg-opacity-80 rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center mb-4">Slack Messenger</h1>

        <label
          className="block text-sm font-semibold mb-1"
          htmlFor="channel-select"
        >
          Select Slack Channel
        </label>
        <select
          id="channel-select"
          className="w-full p-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6"
          value={selectedChannel}
          onChange={(e) => setSelectedChannel(e.target.value)}
        >
          {Array.isArray(channels) && channels.length > 0 ? (
            channels.map((channel) => (
              <option key={channel.id} value={channel.id}>
                #{channel.name}
              </option>
            ))
          ) : (
            <option disabled>No channels available</option>
          )}
        </select>

        <label
          className="block text-sm font-semibold mb-1"
          htmlFor="message-box"
        >
          Your Message
        </label>
        <textarea
          id="message-box"
          className="w-full p-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          rows="5"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <button
          onClick={handleSend}
          disabled={sending || !message.trim() || !selectedChannel}
          className={`w-full py-3 rounded-md font-semibold ${
            sending || !message.trim() || !selectedChannel
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          } transition-colors duration-200`}
        >
          {sending ? "Sending..." : "Send"}
        </button>

        {status && (
          <p
            className={`mt-4 text-center ${
              status.success ? "text-green-400" : "text-red-500"
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
}
