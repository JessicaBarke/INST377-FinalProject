// server.js
import 'dotenv/config';
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ------------------------------
// Basic Express Setup
// ------------------------------
const app = express();

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (for local development)
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

// Simple CORS so the front-end can talk to the API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ------------------------------
// Supabase Initialization
// ------------------------------
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'FATAL: SUPABASE_URL or SUPABASE_ANON_KEY is not set in the environment.'
  );
}

const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// ------------------------------
// API ENDPOINT 1
// GET /api/user_settings/:user_id
// - Reads user preferences from Supabase
// - If no row exists, returns sensible defaults
// ------------------------------
app.get('/api/user_settings/:user_id', async (req, res) => {
  const userId = req.params.user_id;

  if (!supabase) {
    return res
      .status(500)
      .json({ error: 'Supabase client not configured on server.' });
  }

  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Real error
    if (error && error.code !== 'PGRST116') {
      console.error('Supabase fetch error:', error);
      return res
        .status(500)
        .json({ error: 'Failed to fetch settings from database.' });
    }

    // No row found: return default settings
    if (!data) {
      return res.status(200).json({
        user_id: userId,
        preferred_meeting_duration: 30,
        default_timezone: 'America/New_York',
        message: 'No custom settings found, returning defaults.',
      });
    }

    // Found row
    return res.status(200).json(data);
  } catch (e) {
    console.error('API Error in /api/user_settings:', e);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// ------------------------------
// API ENDPOINT 2
// GET /api/is_holiday?date=YYYY-MM-DD
// - Calls Nager.Date external API
// - Checks whether the provided date is a US public holiday
// ------------------------------
app.get('/api/is_holiday', async (req, res) => {
  const dateToCheck = req.query.date;

  if (!dateToCheck) {
    return res
      .status(400)
      .json({ error: 'Missing required query parameter: date' });
  }

  const year = new Date(dateToCheck).getFullYear();
  if (isNaN(year)) {
    return res.status(400).json({ error: 'Invalid date format provided.' });
  }

  const nagerUrl = `https://date.nager.at/api/v3/PublicHolidays/${year}/US`;

  try {
    const fetchRes = await fetch(nagerUrl);
    if (!fetchRes.ok) {
      throw new Error(`Nager.Date API error: ${fetchRes.status}`);
    }

    const holidays = await fetchRes.json();

    const isPublicHoliday = holidays.some(
      (holiday) => holiday.date === dateToCheck
    );

    return res.status(200).json({
      date: dateToCheck,
      is_holiday: isPublicHoliday,
      message: isPublicHoliday
        ? 'The date is a US public holiday.'
        : 'The date is NOT a US public holiday.',
    });
  } catch (e) {
    console.error('External API Orchestration Error:', e.message);
    return res.status(500).json({
      error: 'Failed to check holiday status via external API.',
    });
  }
});

// ------------------------------
// Local Dev Server
// (Vercel will ignore app.listen and just use "export default app")
// ------------------------------
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Export for Vercel
export default app;