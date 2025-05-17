export default async function handler(req, res) {
  // TODO: Replace this mock with Slack API call
  const mockChannels = [
    { id: "C01", name: "general" },
    { id: "C02", name: "random" },
    { id: "C03", name: "development" },
  ];

  res.status(200).json(mockChannels);
}
