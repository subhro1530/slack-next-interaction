import { useEffect, useState } from "react";

export default function Home() {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [message, setMessage] = useState("");
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchChannels() {
      setLoadingChannels(true);
      setError("");
      try {
        const res = await fetch("/api/channels");
        const data = await res.json();
        if (res.ok) {
          setChannels(data);
          if (data.length > 0) setSelectedChannel(data[0].id);
        } else {
          setError(data.error || "Failed to load channels");
        }
      } catch {
        setError("Network error while fetching channels");
      }
      setLoadingChannels(false);
    }
    fetchChannels();
  }, []);

  async function sendMessage() {
    setError("");
    setSuccess("");
    if (!message.trim()) {
      setError("Message cannot be empty");
      return;
    }
    setSending(true);

    try {
      const res = await fetch("/api/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: selectedChannel, message }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess("Message sent successfully!");
        setMessage("");
      } else {
        setError(data.error || "Failed to send message");
      }
    } catch {
      setError("Network error while sending message");
    }
    setSending(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-900 via-indigo-900 to-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-8">Slack Messenger</h1>

      {loadingChannels ? (
        <p>Loading channels...</p>
      ) : error ? (
        <p className="mb-4 text-red-400">{error}</p>
      ) : (
        <select
          value={selectedChannel}
          onChange={(e) => setSelectedChannel(e.target.value)}
          className="mb-6 p-3 rounded bg-indigo-800 text-white w-72"
        >
          {channels.map((channel) => (
            <option key={channel.id} value={channel.id}>
              #{channel.name}
            </option>
          ))}
        </select>
      )}

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        placeholder="Type your message here..."
        className="mb-6 p-3 rounded w-96 resize-none bg-indigo-800 text-white placeholder-indigo-300"
      ></textarea>

      <button
        onClick={sendMessage}
        disabled={sending || loadingChannels}
        className={`w-96 p-3 rounded font-semibold transition-colors ${
          sending || loadingChannels
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        }`}
      >
        {sending ? "Sending..." : "Send"}
      </button>

      {success && <p className="mt-4 text-green-400">{success}</p>}
      {error && !loadingChannels && (
        <p className="mt-4 text-red-400">{error}</p>
      )}
    </div>
  );
}
