const express = require('express');
const supabase = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServer = supabase.createClient(supabaseUrl, supabaseKey);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Assuming "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const { data, error } = await supabaseServer.auth.getUser(token);

  if (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = data;
  next();
};

app.get('/chat-sessions', authenticateUser, async (req, res) => {
  const user_id = req.user.id; 

  const { data, error } = await supabaseServer
    .from('chat_sessions')
    .select('*')
    //.eq('user_id', parseInt(user_id));
  //need to do linking - user id is not equal to the user id inside the db

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
});


app.post('/register', async (req, res) => {
  console.log("received");
  const { email, password } = req.body;
  const { user, error } = await supabaseServer.auth.signUp({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json({ message: 'Registration successful', user });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabaseServer.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: error.message });
    if (data && data.session && data.session.access_token) {
    return res.status(200).json({ message: 'Login successful', token: data.session.access_token });
  } else {
    return res.status(404).json({ message: 'Session or token not found' });
  }
});

