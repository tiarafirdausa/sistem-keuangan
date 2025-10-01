const csrf = require("csurf");

// Setup CSRF pakai cookie
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,                       // cookie tidak bisa diakses JS
    secure: process.env.NODE_ENV === "production", // hanya https di production
    sameSite: "strict",                   // cegah lintas domain
  },
});

module.exports = csrfProtection;
