const config = process.env.CONFIG || 'development'

const sqlite = {
  dialect: "sqlite",
  storage: "./db/db.sqlite",
  logging: false,
}

// Test
const test = {
  db: {
    dialect: "sqlite",
    storage: ":memory:",
  },
}

// Demo
const demo = {
  serverPort: 80,
  secureCookie: true,
  db: sqlite,
}

// Production
const production = {
  ...demo,
  db: {
    ...sqlite,
    storage: "./db/db.sqlite",
  },
}

// Development
const development = {
  serverPort: 9876,
  secureCookie: false,
  db: {
    ...sqlite,
    logging: true,
  },
}

export default { development, test, demo, production }[config]
