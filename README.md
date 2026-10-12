<h1 align="center">WealthTrack</h1>

<p align="center">
  <b>Invest Smart. Track Smarter. Grow Together.</b>
</p>

<p align="center">
  A portfolio management system for investment managers and their clients.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

## Overview

WealthTrack is a portfolio management platform with two logins: **Admin** (the portfolio manager) and **User** (the client). Clients see their own portfolio, and the admin manages all of them from one place.

It matters because managing many clients' investments by hand is slow and error-prone. WealthTrack gives the manager one easy way to place and close trades, track performance, and fairly distribute profits and stock quantities across clients.

## Screenshots

| Admin Dashboard | Client Dashboard |
|-----------------|------------------|
|(<img width="1920" height="1248" alt="image" src="https://github.com/user-attachments/assets/b953738c-d835-4947-a80e-446c4c73d20e" />|(<img width="1920" height="1248" alt="image" src="https://github.com/user-attachments/assets/90752c95-fb80-4d3b-a4b9-3d3dae335fe8" />|

## Features

### Admin (Portfolio Manager)

**Trades and holdings**
- Add trades and close them
- View open and closed holdings and how each one is performing
- Live updates on open holdings
- Full trade history, including stock-wise history

**Pooled portfolio**
- Combines all clients into one pooled portfolio with complete details
- Live portfolio charts, plus realised and unrealised profit
- Distributes profits and stock quantities according to each client's portfolio ratio
- Live view of the admin's own share alongside every client

**Client management**
- Add users, and activate or deactivate accounts
- View individual user profiles, portfolio status and trade history
- Record currency transfers to client portfolio amounts
- View system logs

**Communication**
- Edit investment notes that clients can read
- Send emails through the website's own messaging component
- Create and send notifications

**Admin workspace**
- Stock watchlist
- Portfolio and strategy analysis, to see how the strategy is working

### User (Client)

- Live portfolio value, open holdings and profits
- Live portfolio graph
- Closed trade history
- Transaction history for portfolio amounts
- Live values for everything, including profit and the manager's share
- Notes written by the portfolio manager
- Export reports by financial quarter

### For everyone

- Two-factor authentication through email OTP
- Profile updates and settings, including dark mode and notification settings
- Responsive design for both web and mobile

## Tech Stack

| Layer    | Technologies                  |
|----------|-------------------------------|
| Frontend | React, Tailwind CSS, Recharts |
| Backend  | Node.js, Express.js           |
| Database | PostgreSQL                    |

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Design

The UI was designed in Figma before development.

<a href="https://www.figma.com/design/lRtYuqbXs6lxZoMIkP5ztJ/Portfolio-Management?node-id=0-1&p=f&m=draw">
    <img width="1920" height="1248" alt="Image" src="https://github.com/user-attachments/assets/66b3ff92-4d92-4a1d-a308-883e57fa6b91" />
</a>

[View the full design in Figma](https://www.figma.com/design/lRtYuqbXs6lxZoMIkP5ztJ/Portfolio-Management?node-id=0-1&m=draw)

## Author

**Riya Bodke** · [GitHub](https://github.com/RiyaBodke)
