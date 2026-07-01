# Festo

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Shaurya9935/festo.git
cd festo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and copy the required variables from `.env.example`.

### 4. Start the Development Server

```bash
npm run dev
```

---

# 🗄️ Database

### Generate Migrations

Run this command whenever you make changes to the database schema.

```bash
npm run db:generate
```

### Apply Migrations

```bash
npm run db:migrate
```

### Open Drizzle Studio

View and manage your local database.

```bash
npm run db:studio
```

---

# 🤝 Collaboration Guide

Before starting work each day, always pull the latest changes from GitHub.

### 1. Get the Latest Changes

```bash
git pull origin main
```

### 2. Check the Status

```bash
git status
```

### 3. Stage Your Changes

Add all modified files:

```bash
git add .
```

Or add specific files:

```bash
git add <file-name>
```

### 4. Commit Your Changes

Write a meaningful commit message describing what you changed.

```bash
git commit -m "Add event registration page"
```

### 5. Push Your Changes

```bash
git push origin main
```

---

## 📌 Git Workflow

Whenever you start working:

```bash
git pull origin main
```

After completing your work:

```bash
git add .
git commit -m "Describe your changes"
git push origin main
```

---

## 💡 Best Practices

- Always **pull before you start coding** to avoid merge conflicts.
- Write clear and meaningful commit messages.
- Don't commit `.env` files or other sensitive information.
- Make sure the project runs successfully before pushing your changes.
- If you update the database schema, don't forget to run:
  ```bash
  npm run db:generate
  npm run db:migrate
  ```