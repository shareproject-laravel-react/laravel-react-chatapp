# SparkChat

A Laravel + React (Vite) real-time chat application. This repository demonstrates a development error related to Vite's React plugin.

---

## 🧰 Requirements

Make sure the following are installed:

| Tool        | Version     | Purpose             |
|-------------|-------------|---------------------|
| PHP         | 8.2.12      | Laravel backend     |
| Composer    | 2.8.6       | PHP dependencies    |
| Node.js     | 22.14.0     | React + Vite        |
| npm         | 10.9.2      | Node package manager|
| PostgreSQL  | 17.4        | Database            |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AishwaryaSatheCodes/SparkChat.git
cd sparkchat
```
2. Install dependencies
📦 Backend (Laravel)

If PHP and Composer are installed:
```bash
composer install
```
    ⚠️ If not, install them first:

        PHP: https://www.php.net/manual/en/install.php

        Composer: https://getcomposer.org/download/

🎨 Frontend (React + Vite)
```bash
npm install
```
3. Configure environment

Copy the .env file:
```bash
cp .env.example .env
```
A safe, local-development .env is included (no production secrets).

Then run:
```bash
php artisan key:generate
```
4. Set up database (PostgreSQL)

Ensure PostgreSQL is running.

    From .env:

    DB_DATABASE=sparkchat_db
    DB_USERNAME=postgres
    DB_PASSWORD=postgres

Create the database manually if needed, then run:
```bash
php artisan migrate
```
5. Run the project
🧩 Laravel backend
```bash
php artisan serve
```
⚡ Vite frontend
```bash
npm run dev
```
🐛 Reproducing the Vite Error

To see the Vite React plugin error:

    Start both servers (php artisan serve, php artisan reverb:start --debug and npm run dev)

    Open the app (http://localhost:8000)

    Open the browser console or terminal

You’ll see:

    @vitejs/plugin-react can't detect preamble

This seems related to the React plugin version or a Vite configuration issue in EventBus.jsx.
REVERB_HOST	localhost:8080


