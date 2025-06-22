# GitHub User Search App

This is a simple React + TypeScript application that allows users to search for GitHub usernames and display their public repositories using the GitHub REST API. The app uses Material UI (MUI) for styling and is powered by Vite for a fast development experience.

---

## 🚀 Features

- 🔍 Search GitHub users by username
- 📄 View a list of up to 5 matching users
- 📦 Expand each user to view their public repositories
- 🌟 Shows repository name, description, and star count
- 🔁 Handles loading and error states gracefully

---

## 📦 Tech Stack

- **React 19** + **TypeScript**
- **Vite** (build tool)
- **Material UI (MUI)** for components
- **Octokit** (GitHub REST API client)
- **ESLint** for linting

---

## 🧑‍💻 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/zamlahani/simple-github-search.git
cd simple-github-search
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with your GitHub token:

```env
GITHUB_TOKEN=your_personal_access_token
```

> 🔐 You can generate a token from [https://github.com/settings/tokens](https://github.com/settings/tokens) (no scopes needed for public data).

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Then open your browser to: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Testing (Planned)

TBA

## 🗂️ Folder Structure

```
src/
├── components/
│   └── MyListItem.tsx
├── service/
│   └── github.ts
├── types/
│   └── user.types.ts
├── App.tsx
├── App.css
└── main.tsx
```

---

## 📋 Notes

- API requests are limited to 60/hour without authentication. Use a GitHub token to avoid rate limiting.
- MUI Grid system ensures responsive layout.
- The app uses MUI Accordion to expand/collapse repositories per user.

---

## 📄 License

MIT License. Feel free to fork and adapt.
