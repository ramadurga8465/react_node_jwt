import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtTokens } from '../utils/jwt-helpers.js';
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
     
      const { email, password } = req.body;
      const users = await pool.query('SELECT * FROM users WHERE user_email = $1', [email]);
      if (users.rows.length === 0) return res.status(401).json({error:"Email is incorrect"});
    const validPassword = await bcrypt.compare(password, users.rows[0].user_password);
    console.log(password)
    console.log(validPassword)
     // if (!validPassword) {return res.status(401).json({error: "Incorrect password"});}
      let tokens = jwtTokens(users.rows[0]);
      res.cookie('refresh_token',tokens.refreshToken,{httpOnly:true});
      res.json(tokens);
      

    } catch (error) {
      res.status(401).json({error: error.message});
    }
  
  });

  router.get('/refresh_token', (req, res) => {
    try {
      const refreshToken = req.cookies.refresh_token;
      console.log(req.cookies);
      if (refreshToken === null) return res.sendStatus(401);
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
        if (error) return res.status(403).json({error:error.message});
        let tokens = jwtTokens(user);
        res.cookie('refresh_token', tokens.refreshToken, {...(process.env.COOKIE_DOMAIN && {domain: process.env.COOKIE_DOMAIN}) , httpOnly: true,sameSite: 'none', secure: true});
        return res.json(tokens);
      });
    } catch (error) {
      res.status(401).json({error: error.message});
    }
  });

  router.delete('/refresh_token', (req, res) => {
    try {
      res.clearCookie('refresh_token');
      return res.status(200).json({message:'Refresh token deleted.'});
    } catch (error) {
      res.status(401).json({error: error.message});
    }
  });






export default router;
