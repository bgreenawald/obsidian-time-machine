# Obsidian Time Machine Plugin

Obsidian Time Machine is a plugin for [Obsidian](https://obsidian.md) that helps you track, organize, and access your vault's files based on modification times. It provides a "time machine" modal that lets you quickly jump to files modified within specific intervals (e.g., today, yesterday, this week, etc.), and manages these efficiently using a custom min-heap data structure.

## Features

- **Time-based File Access:** Instantly view and open files modified within configurable time intervals (Today, Yesterday, This Week, etc.).
- **Customizable Settings:** Configure how many files to track per interval, which intervals to display, and directories to ignore.

## Getting Started

1. **Install the Plugin:**
   - Copy or clone this repository into your vault's `.obsidian/plugins/obsidian-time-machine` folder.
   - Run `npm install` to install dependencies.
   - Run `npm run build` or `npm run dev` to compile the plugin.
   - Enable "Time Machine" in Obsidian's Community Plugins settings.

2. **Using the Plugin:**
   - Open the Time Machine modal from the command palette or ribbon icon.
   - Browse files grouped by modification interval.
   - Adjust plugin settings in Obsidian's settings tab for Time Machine.

## Development

- **Requirements:** Node.js (v16+), npm
- **Install Dependencies:**
  ```bash
  npm install
  ```
- **Development Mode:**
  ```bash
  npm run dev
  ```
- **Build for Production:**
  ```bash
  npm run build
  ```
- **Testing:**
  ```bash
  npm test
  ```

### Linting & Code Quality

This project uses ESLint and TypeScript for code quality and consistency.

- **Run ESLint:**
  ```bash
  npx eslint ./src
  ```
- **Auto-fix Issues:**
  ```bash
  npx eslint ./src --fix
  ```

## Project Structure

- `src/heap.ts` — Min-heap implementation for tracking recent files.
- `src/timeInterval.ts` — Time interval management and logic.
- `src/settings.ts` — Plugin settings and UI.
- `src/modal.ts` — Time Machine modal UI and file navigation.
- `src/heap.test.ts` — Unit tests for heap logic.

