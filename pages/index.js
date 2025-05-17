// pages/index.js
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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-10">
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-8 w-full max-w-lg shadow-xl">
        <h1 className="text-4xl font-bold mb-6 text-center">Slack Messenger</h1>

        {loadingChannels ? (
          <p className="text-center">Loading channels...</p>
        ) : error ? (
          <p className="mb-4 text-red-400 text-center">{error}</p>
        ) : (
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="mb-6 p-3 rounded bg-black border border-white/20 text-white w-full hover:bg-gray-900 focus:outline-none"
          >
            {channels.map((channel) => (
              <option
                key={channel.id}
                value={channel.id}
                className="bg-black text-white"
              >
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
          className="mb-6 p-3 rounded w-full resize-none bg-black border border-white/20 text-white placeholder-gray-400 focus:outline-none"
        ></textarea>

        <button
          onClick={sendMessage}
          disabled={sending || loadingChannels}
          className={`w-full p-3 rounded font-semibold transition-all duration-200 ${
            sending || loadingChannels
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          }`}
        >
          {sending ? "Sending..." : "Send"}
        </button>

        {success && (
          <p className="mt-4 text-green-400 text-center">{success}</p>
        )}
        {error && !loadingChannels && (
          <p className="mt-4 text-red-400 text-center">{error}</p>
        )}
      </div>

      <footer className="mt-12 text-gray-500 text-sm text-center">
        <p>
          © {new Date().getFullYear()} Shaswata Saha •{" "}
          <a
            href="mailto:shaswata.ssaha@gmail.com"
            className="underline hover:text-gray-300"
          >
            shaswata.ssaha@gmail.com
          </a>
        </p>
        <p>
          <a
            href="https://github.com/subhro1530/slack-next-interaction"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-300"
          >
            View Source on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
