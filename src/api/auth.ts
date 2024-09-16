import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import * as authModel from '../models/auth.model';
import * as crypto from 'crypto';

const auth = new Hono();

auth.get('/status', async (c) => {
  try {
    const token = getCookie(c, 'session_token');

    if (!token) {
      return c.json({ isAuthenticated: false });
    }
    
    const session = await authModel.getSessionByToken(token);

    if (!session || session.userID === null) {
      return c.json({ message: "User not connected 🚫", isAuthenticated: false });
    }

    return c.json({ message: "User authenticated ✅", isAuthenticated: true, id: session.userID });

  } catch (err) {
    console.error('Error checking authentication status:', err);
    return c.json({ isAuthenticated: false }, 500);
  }
});

auth.get('/google', (c) => {
  const url = new URL('https://accounts.google.com/o/oauth2/auth');
  url.searchParams.append('client_id', process.env.GOOGLE_CLIENT_ID!);
  url.searchParams.append('redirect_uri', process.env.GOOGLE_REDIRECT_URI!);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('scope', 'profile email');
  return c.redirect(url.toString());
});

auth.get('/google/callback', async (c) => {
  const { code } = c.req.query();

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Error fetching token:', await tokenResponse.text());
      return c.json({ message: 'Failed to fetch token' }, 500);
    }

    const tokenData = await tokenResponse.json();

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error('Error fetching user info:', await userInfoResponse.text());
      return c.json({ message: 'Failed to fetch user info' }, 500);
    }

    const userInfo = await userInfoResponse.json();

    let user = await authModel.getUserByEmail(userInfo.email);

    console.log(userInfo.name)
    // TODO If i want to update password with user google connect ? password: '' put ternari operator
    if (!user) {
      user = await authModel.createUser(userInfo.name, userInfo.email, userInfo.picture);
    }

    const token = crypto.randomUUID();
    const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await authModel.createSession({
      userID: user.userID,
      token,
      expirationTime,
    });

    setCookie(c, 'session_token', token, {
      httpOnly: true,
      expires: expirationTime,
    });

    return c.redirect(`${process.env.FRONT_REDIRECT_URL}`);
  } catch (err) {
    console.error('Error during Google callback:', err);
    return c.json({ message: 'Internal Server Error' }, 500);
  }
})

export default auth;

// import { Hono } from 'hono';
// import { getCookie } from 'hono/cookie';
// import * as model from '../models';

// const auth = new Hono();

// auth.get('/status', async (c) => {
//   try {
//     const token = getCookie(c, 'session_token');

//     //! est-ce que je récup bien le cookie côté front ?
//     console.log(token)

//     if (!token) {
//       console.log(token, "pas de cookie récupéré 😢")
//       return c.json({ isAuthenticated: false });
//     }
    
//     const session = await model.getSessionByToken(token);

//     if (!session || session.userID === null) {
//       console.log(session, "l'utilisateur n'est pas connecté ! 🚫")
//       return c.json({ message: "User not connected 🚫", isAuthenticated: false });
//     }

//     return c.json({ message: "User authenticated ✅", isAuthenticated: true, id: session.userID });

//   } catch (err) {
//     console.error('Error checking authentication status:', err);
//     return c.json({ isAuthenticated: false }, 500);
//   }
// });

// export default auth;
