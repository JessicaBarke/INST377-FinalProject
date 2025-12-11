import 'dotenv/config';
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import path from 'path'; // <-- NEW: Import the path utility

// Note: fetch is now native on Node 20+, so no import needed for it

const app = express();

// ------------------------------------------------------------------
// CRITICAL FIX: Serve files from the 'public' directory FIRST
app.use(express.static('public')); 

// OPTIONAL FIX: Explicitly route the root URL to index.html
app.get('/', (req, res) => {
    // __dirname is not available in ES Modules, so we use process.cwd()
    res.sendFile('index.html', { root: 'public' }); 
});
// ------------------------------------------------------------------

app.use(express.json());

// Add CORS headers for Front-End access
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// 1. Supabase Initialization (25 pts)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("FATAL: Supabase environment variables are not set.");
}

// NOTE: Ensure your .env file is correctly set up for this to work
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;


// --- CUSTOM API ENDPOINT 1: Retrieve Data from DB (12.5 pts) ---
// GET /api/user_settings/:user_id
app.get('/api/user_settings/:user_id', async (req, res) => {
    // ... (rest of your /api/user_settings code) ...
    if (!supabase) {
        return res.status(500).json({ error: 'Database connection failed. Check server configuration.' });
    }
    const userId = req.params.user_id;
    try {
        const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Supabase fetch error:', error);
            return res.status(500).json({ error: 'Failed to fetch settings from database.' });
        }
        
        // Handle 'no rows found' by returning defaults
        if (!data) {
             return res.status(200).json({
                user_id: userId,
                preferred_meeting_duration: 30,
                default_timezone: 'America/New_York',
                message: 'No custom settings found, returning defaults.'
            });
        }

        res.status(200).json(data);

    } catch (e) {
        console.error('API Error:', e);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// --- CUSTOM API ENDPOINT 2: Manipulate External Data (12.5 pts) ---
// GET /api/is_holiday
app.get('/api/is_holiday', async (req, res) => {
    // ... (rest of your /api/is_holiday code) ...
    const dateToCheck = req.query.date;
    if (!dateToCheck) {
        return res.status(400).json({ error: 'A query parameter "date" (YYYY-MM-DD) is required.' });
    }

    const year = new Date(dateToCheck).getFullYear();
    if (isNaN(year)) {
         return res.status(400).json({ error: 'Invalid date format provided.' });
    }

    const nagerUrl = `https://date.nager.at/api/v3/PublicHolidays/${year}/US`;

    try {
        // Now using native fetch
        const fetchRes = await fetch(nagerUrl);
        if (!fetchRes.ok) {
            throw new Error(`Nager.Date API error: ${fetchRes.status}`);
        }
        const holidays = await fetchRes.json();

        // Manipulation Logic: Filter the list of all holidays to see if the dateToCheck is present.
        const isPublicHoliday = holidays.some(holiday => holiday.date === dateToCheck);

        res.status(200).json({
            date: dateToCheck,
            is_holiday: isPublicHoliday,
            message: isPublicHoliday ? 'The date is a US public holiday.' : 'The date is NOT a US public holiday.'
        });

    } catch (e) {
        console.error('External API Orchestration Error:', e.message);
        res.status(500).json({ error: 'Failed to check holiday status via external API.' });
    }
});


// Local development server listener (always on when you run `node server.js`)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Export the app for Vercel to use as a serverless function
export default app;
