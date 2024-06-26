import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import * as model from '../models';

const auth = new Hono();

auth.get('/status', async (c) => {
  try {
    const token = getCookie(c, 'session_token');

    //! est-ce que je récup bien le cookie côté front ?
    console.log(token)

    if (!token) {
      console.log(token, "pas de cookie récupéré 😢")
      return c.json({ isAuthenticated: false });
    }
    
    const session = await model.getSessionByToken(token);

    if (!session || session.userID === null) {
      console.log(session, "l'utilisateur n'est pas connecté ! 🚫")
      return c.json({ message: "User not connected 🚫", isAuthenticated: false });
    }

    return c.json({ message: "User authenticated ✅", isAuthenticated: true });

  } catch (err) {
    console.error('Error checking authentication status:', err);
    return c.json({ isAuthenticated: false }, 500);
  }
});

export default auth;
