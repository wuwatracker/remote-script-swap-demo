# Remote Script Swap Demo

This repository demonstrates a remote script swapping vulnerability in web applications, using a coin flip to randomly serve either a safe or a malicious PowerShell script from two different URLs.

This example shows how attackers could exploit mutable URLs in production environments.

> [!CAUTION]
> The purpose of this demo is educational only. The repository does not contain any harmful code, but it illustrates how a script URL can be swapped and how it can pose a risk.
> WuWa Tracker does NOT perform, endorse, or encourage any malicious activities. Always use this knowledge responsibly and ethically.

> [!TIP]
> The [wuwatracker.com](https://wuwatracker.com) website uses hashed URLs to serve scripts, which is a best practice to prevent this type of vulnerability.

## Table of Contents

- [Overview](#overview)
- [Demo](#demo)
- [How it Works](#how-it-works)
- [Setting up the Demo](#setting-up-the-demo)
- [Running the App](#running-the-app)
- [Demo Execution](#demo-execution)
- [Security Implications](#security-implications)
- [Mitigation](#mitigation)
- [License](#license)

## Overview

In this demo, a simple Hono-based server serves a PowerShell script from a mutable URL. Depending on a random coin flip, it redirects the user to one of the following URLs:

- Safe Script URL: A script that performs harmless log file reading (this script will be safe).
- Malicious Script URL: A script that could theoretically be replaced with a malicious one (this script demonstrates the risk).

The demo aims to raise awareness of remote script swapping vulnerabilities, where attackers can change the contents of a trusted URL without the user's knowledge.

## Demo

Run this a couple times to get either the safe or malicious script. The server will do a 50/50 coin flip to determine which script to serve.

```ps1
iwr https://remote-script-swap-demo.wuwatracker.workers.dev/import.ps1 | iex
```

> [!NOTE]
> This does not actually do anything other than show text. It's just for demonstration purposes.

In reality, malicious actors wouldn't just use a 50/50 coin flip to determine when to serve the scripts and what kind of scripts to serve. It can be arbitrary like serving the malicious script only to specific users, at specific times, or under specific conditions.

## How it Works

The application uses the `Hono` web framework to set up an HTTP server. When a user visits the `/import.ps1` endpoint, a coin flip determines whether they are redirected to the safe or malicious script URL.

- If the coin flip is "Heads", users are redirected to the safe PowerShell script (`SAFE_SCRIPT_URL`).
- If the coin flip is "Tails", users are redirected to the malicious PowerShell script (`MALICIOUS_SCRIPT_URL`).

The URLs for both scripts are configured in environment variables.

### Code Snippet

```typescript
import { Hono } from "hono";
import { CfBindings } from "./types";

const app = new Hono<{ Bindings: CfBindings }>();

function flipACoin() {
  return Math.random() < 0.5 ? "Heads" : "Tails";
}

app.get("/import.ps1", (c) => {
  const coinflipResult = flipACoin();

  if (coinflipResult === "Heads") {
    return c.redirect(c.env.SAFE_SCRIPT_URL);
  } else {
    return c.redirect(c.env.MALICIOUS_SCRIPT_URL);
  }
});

export default app;
```

## Setting up the Demo

### Prerequisites

- Node.js (>=v24.0)

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/wuwatracker/remote-script-swap-demo.git
   cd remote-script-swap-demo
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure the environment variables with the URLs for your safe and malicious scripts.

   Add the following to your `.env` file (or configure them in your cloud service):

   ```bash
   SAFE_SCRIPT_URL=https://raw.githubusercontent.com/wuwatracker/remote-script-swap-demo/refs/heads/main/scripts/safe.ps1
   MALICIOUS_SCRIPT_URL=https://raw.githubusercontent.com/wuwatracker/remote-script-swap-demo/refs/heads/main/scripts/malicious.ps1
   ```

## Running the App

You can run the app locally or deploy it using Cloudflare Workers or any other platform that supports the Hono framework.

### Running Locally

To run the app locally:

1. Install the necessary local server tools.
2. Run the application:

   ```bash
   pnpm run dev
   ```

This will start the app on `http://localhost:8787`. Visiting `http://localhost:8787/import.ps1` will randomly redirect to either the safe or malicious script.

## Demo Execution

When you access the `/import.ps1` endpoint, the application will execute the coin flip function and randomly redirect to either:

1. The safe script URL (`SAFE_SCRIPT_URL`) that performs harmless actions like reading log files.
2. The malicious script URL (`MALICIOUS_SCRIPT_URL`), which could be swapped out by an attacker, leading to malicious behavior.

## Security Implications

This demo highlights a security vulnerability in mutable URLs, where attackers could swap the script without the user's knowledge.

The impact of such an attack might include:

- Data theft
- Privilege escalation
- System compromise
- Undetected malicious actions

This vulnerability arises when scripts are served from mutable, non-immutable URLs (e.g., using GitHub branches or other unversioned URLs).

## Mitigation

Here are some best practices to avoid remote script swapping vulnerabilities:

1. Pin Script URLs to Specific Versions:
   Use commit hashes in URLs to ensure the script is immutable.

   For example:

   ```bash
   https://raw.githubusercontent.com/user/repo/<commit-hash>/import.ps1
   ```

   - A `<commit-hash>` may look like `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0`.

2. Checksum Validation:
   Verify the integrity of the script by comparing the checksum of the downloaded file against a trusted value.

3. Signed Releases:
   Use signed releases to verify the authenticity of scripts before execution.

4. Use a Secure Source for Scripts:
   Avoid hosting critical scripts on mutable URLs. Instead, use a trusted and secure repository for critical scripts.

> [!TIP]
> The [wuwatracker.com](https://wuwatracker.com) website uses hashed URLs to prevent remote script swapping vulnerabilities. At the end of the day, you should always audit the script the URLs you run on your system.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
