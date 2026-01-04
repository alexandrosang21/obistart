# Obistart

A minimal, distraction-free start page for your browser. Focus on what matters with a clean interface designed to help you start your day with intention.

## Features

- **Large Clock Display** - Prominent time display with personalized greeting
- **Daily Focus** - Set your main goal for the day with subtask support
- **Top Stories** - Curated news feed from Hacker News and dev.to
- **Pomodoro Timer** - Stay focused with customizable work sessions
- **Sound Player** - Ambient sounds and radio streaming for background audio
- **Daily Widget** - Shows current date with special international days and motivational quotes
- **Dark/Light Theme** - Automatic theme switching with manual override
- **Local Storage** - All your data stays in your browser

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - High-quality React components built on Radix UI
- **Lucide Icons** - Beautiful icon set
- **next-themes** - Theme management

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your start page.

## Usage

### First Visit

You'll be prompted to enter your name. This is stored locally and used for personalized greetings.

### Daily Focus

Type your main focus for the day and press Enter. You can add subtasks by clicking the "+" button. Click tasks to mark them complete.

### News Feed

Scroll through top tech stories from Hacker News and dev.to. Click "Show more" to expand the list.

### Pomodoro Timer

Set your focus duration and start the timer. A sound will play when the session is complete.

### Sound Player

Choose from ambient sounds or radio streams for background audio while you work.

### Settings

Click the settings icon to:
- Change your name
- Toggle dark/light mode

## Data Storage

All data is stored in your browser's local storage. Nothing is sent to external servers (except for the news feeds which are fetched from public APIs).

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=readme):

```bash
npm run build
```

Or connect your Git repository to Vercel for automatic deployments.

## License

MIT
