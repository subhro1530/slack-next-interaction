# Slack Messenger Web Application

This is a simple web application that lets you send messages directly to any public Slack channel in your workspace.

---

## Features

- Fetches and displays a list of your public Slack channels dynamically.
- Lets you select a channel from a dropdown.
- Allows you to type a message and send it instantly to the selected Slack channel.
- Simple, clean, and modern user interface.

---

## How to Set Up and Use

### 1. Create a Slack Workspace (If you don't have one)

- Go to [slack.com](https://slack.com/) and create a new workspace or use your existing one.

### 2. Create a Slack App

- Go to [https://api.slack.com/apps](https://api.slack.com/apps).
- Click **Create New App** and choose **From scratch**.
- Give it a name (e.g., "Slack Messenger") and select your workspace.

### 3. Configure OAuth & Permissions

- Inside your app settings, go to **OAuth & Permissions**.
- Under **Bot Token Scopes**, add these scopes:
  - `channels:read` (to read public channels)
  - `chat:write` (to send messages)
- Scroll up and click **Install to Workspace** or **Reinstall App**.
- Copy the **Bot User OAuth Access Token** (starts with `xoxb-`).

### 4. Invite your bot to Slack Channels

- In your Slack workspace, open each channel where you want to send messages.
- Type `/invite @YourBotName` in the message box and send.
- Your bot must be a member of the channel to send messages there.

### 5. Set Up the Web Application

- Clone this repository to your local machine.
- Create a file called `.env.local` in the project root.
- Paste your Slack Bot Token in the `.env.local` file like this:

