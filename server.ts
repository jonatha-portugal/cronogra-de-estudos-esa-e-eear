import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, deleteDoc, doc, getDoc, onSnapshot } from "firebase/firestore";

const app = express();
const PORT = 3000;

app.use(express.json());

const firebaseConfig = {
  apiKey: "AIzaSyD-5ufxQew18rSqEAd2bWxc8TM0tkvEpeg",
  authDomain: "cronograma-edital-militar.firebaseapp.com",
  projectId: "cronograma-edital-militar",
  storageBucket: "cronograma-edital-militar.firebasestorage.app",
  messagingSenderId: "610837931907",
  appId: "1:610837931907:web:15d6e3672ed5c497fef8b6",
  measurementId: "G-16C82SPJRR"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const usersCollection = collection(db, "allowedUsers");

const ADMIN_EMAIL = 'jonathaportugal14@gmail.com';

app.post('/api/auth/login', async (req, res) => {
  const { email } = req.body;
  const emailLower = (email || '').toLowerCase().trim();
  
  if (!emailLower) {
    return res.status(400).json({ error: 'Email inválido', success: false });
  }

  if (emailLower === ADMIN_EMAIL) {
    return res.json({ success: true, user: { email: emailLower, role: 'admin' } });
  }

  try {
    const userDoc = await getDoc(doc(usersCollection, emailLower));
    if (userDoc.exists()) {
      const user = userDoc.data();
      const isExpired = new Date() > new Date(user.expiresAt);
      if (isExpired) {
        return res.status(403).json({ error: 'Sua assinatura expirou. Contate o administrador.', success: false });
      }
      return res.json({ success: true, user: { email: emailLower, role: 'student' } });
    }

    return res.status(403).json({ error: 'Seu email não tem permissão de acesso. Contate o administrador.', success: false });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: 'Erro no servidor de banco de dados.', success: false });
  }
});

app.get('/api/auth/stream', (req, res) => {
  const email = (req.query.email as string || '').toLowerCase().trim();
  if (!email) {
    return res.status(400).end();
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  if (email === ADMIN_EMAIL) {
    const interval = setInterval(() => {
      res.write(`data: ${JSON.stringify({ success: true })}\n\n`);
    }, 15000);
    req.on('close', () => clearInterval(interval));
    return;
  }

  const unsubscribe = onSnapshot(doc(usersCollection, email), (docSnap) => {
    if (!docSnap.exists()) {
      res.write(`data: ${JSON.stringify({ success: false, reason: 'removed' })}\n\n`);
    } else {
      const user = docSnap.data();
      const isExpired = new Date() > new Date(user.expiresAt);
      if (isExpired) {
        res.write(`data: ${JSON.stringify({ success: false, reason: 'expired' })}\n\n`);
      } else {
        res.write(`data: ${JSON.stringify({ success: true })}\n\n`);
      }
    }
  }, (error) => {
    console.error("Stream error:", error);
    res.write(`data: ${JSON.stringify({ success: false, reason: 'error' })}\n\n`);
  });

  req.on('close', () => {
    unsubscribe();
  });
});

// User progress endpoints
app.get('/api/user/progress', async (req, res) => {
  const email = req.headers['x-user-email'] as string;
  const emailLower = (email || '').toLowerCase().trim();
  if (!emailLower) return res.status(400).json({ error: 'Email inválido', success: false });

  try {
    const progressDoc = await getDoc(doc(db, "userProgress", emailLower));
    if (progressDoc.exists()) {
      return res.json({ 
        progress: progressDoc.data().progress || {}, 
        simulados: progressDoc.data().simulados || [],
        metas: progressDoc.data().metas || [],
        success: true 
      });
    }
    return res.json({ progress: {}, simulados: [], metas: [], success: true });
  } catch (error) {
    console.error("Get progress error:", error);
    return res.status(500).json({ error: 'Erro ao buscar progresso', success: false });
  }
});

app.post('/api/user/progress', async (req, res) => {
  const email = req.headers['x-user-email'] as string;
  const emailLower = (email || '').toLowerCase().trim();
  if (!emailLower) return res.status(400).json({ error: 'Email inválido', success: false });

  const { progress } = req.body;
  
  try {
    await setDoc(doc(db, "userProgress", emailLower), {
      progress: progress || {}
    }, { merge: true });
    
    return res.json({ success: true });
  } catch (error) {
    console.error("Save progress error:", error);
    return res.status(500).json({ error: 'Erro ao salvar progresso', success: false });
  }
});

app.post('/api/user/simulados', async (req, res) => {
  const email = req.headers['x-user-email'] as string;
  const emailLower = (email || '').toLowerCase().trim();
  if (!emailLower) return res.status(400).json({ error: 'Email inválido', success: false });

  const { simulados } = req.body;
  
  try {
    await setDoc(doc(db, "userProgress", emailLower), {
      simulados: simulados || []
    }, { merge: true });
    
    return res.json({ success: true });
  } catch (error) {
    console.error("Save simulados error:", error);
    return res.status(500).json({ error: 'Erro ao salvar simulados', success: false });
  }
});

app.post('/api/user/metas', async (req, res) => {
  const email = req.headers['x-user-email'] as string;
  const emailLower = (email || '').toLowerCase().trim();
  if (!emailLower) return res.status(400).json({ error: 'Email inválido', success: false });

  const { metas } = req.body;
  
  try {
    await setDoc(doc(db, "userProgress", emailLower), {
      metas: metas || []
    }, { merge: true });
    
    return res.json({ success: true });
  } catch (error) {
    console.error("Save metas error:", error);
    return res.status(500).json({ error: 'Erro ao salvar metas', success: false });
  }
});

app.get('/api/avisos', async (req, res) => {
  try {
    const avisosDoc = await getDoc(doc(db, "appData", "avisos"));
    if (avisosDoc.exists()) {
      return res.json({ avisos: avisosDoc.data().list || [], success: true });
    }
    return res.json({ avisos: [], success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar avisos', success: false });
  }
});

app.use('/api/admin', (req, res, next) => {
  const adminEmail = req.headers['x-admin-email'];
  if (adminEmail !== ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Acesso negado.', success: false });
  }
  next();
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const snapshot = await getDocs(usersCollection);
    const users = snapshot.docs.map(d => d.data());
    res.json({ users, success: true });
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ error: 'Erro ao buscar usuários', success: false });
  }
});

app.post('/api/admin/avisos', async (req, res) => {
  const { avisos } = req.body;
  try {
    await setDoc(doc(db, "appData", "avisos"), {
      list: avisos || []
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Save avisos error:", error);
    res.status(500).json({ error: 'Erro ao salvar avisos', success: false });
  }
});

app.post('/api/admin/users', async (req, res) => {
  const { email, months = 1 } = req.body;
  const emailLower = (email || '').toLowerCase().trim();
  if (!emailLower) return res.status(400).json({ error: 'Email inválido', success: false });

  try {
    let newExpiresAt = new Date();
    let addedAt = new Date().toISOString();
    
    const userDocRef = doc(usersCollection, emailLower);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const currentUser = userDoc.data();
      addedAt = currentUser.addedAt || addedAt;
      const currentExpires = new Date(currentUser.expiresAt);
      const baseDate = currentExpires > new Date() ? currentExpires : new Date();
      baseDate.setMonth(baseDate.getMonth() + months);
      newExpiresAt = baseDate;
    } else {
      newExpiresAt.setMonth(newExpiresAt.getMonth() + months);
    }
    
    await setDoc(userDocRef, {
      email: emailLower,
      addedAt: addedAt,
      expiresAt: newExpiresAt.toISOString()
    });

    const snapshot = await getDocs(usersCollection);
    const users = snapshot.docs.map(d => d.data());
    res.json({ users, success: true });
  } catch (error) {
    console.error("Add user error:", error);
    res.status(500).json({ error: 'Erro ao salvar usuário no banco', success: false });
  }
});

app.delete('/api/admin/users/:email', async (req, res) => {
  const { email } = req.params;
  const emailLower = (email || '').toLowerCase().trim();
  
  try {
    await deleteDoc(doc(usersCollection, emailLower));
    
    const snapshot = await getDocs(usersCollection);
    const users = snapshot.docs.map(d => d.data());
    res.json({ users, success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: 'Erro ao remover usuário', success: false });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // app.use must explicitly cast Vite's connect instance to typical Express middleware since types differ slightly in new versions
    app.use(vite.middlewares as express.RequestHandler);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
