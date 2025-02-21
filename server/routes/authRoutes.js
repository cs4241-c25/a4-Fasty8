const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });

        await newUser.save();
        res.json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/fail'
}));

router.get('/success', (req, res) => {
    res.json({ message: "Login successful", user: req.user });
});

router.get('/fail', (req, res) => {
    res.status(401).json({ error: "Login failed" });
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: "Logout error" });
        res.json({ message: "Logged out successfully" });
    });
});

router.get('/checkAuth', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false });
    }
});

module.exports = router;
