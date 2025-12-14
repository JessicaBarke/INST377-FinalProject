# Developer Manual
# INST377 Final Project: Scheduling Navigator

## PROJECT OVERVIEW
This project contains:
- Frontend files in the "public" folder (HTML, CSS, JS)
- Backend logic in "server.js" that handles user data and API calls
- Environment file (.env) for storing private credentials
- Deployment configuration for Vercel

The Scheduling Navigator demonstrates how multiple APIs can be orchestrated to solve scheduling and availability problems using real calendar data.

## REQUIRED PROJECT FILES
This project requires the following files and folders to run correctly:
- public/
  - Contains all frontend code that runs in the browser
  - Includes HTML pages, shared CSS styling, and client-side JavaScript
- server.js
  - Main backend application file
  - Runs the Express server
  - Handles custom API endpoints and database connections (Supabase)
- package.json
  - Lists all required dependencies and development tools
- package-lock.json
  - Locks exact versions of all dependencies and sub-dependencies
- .env
  - Stores private credentials such as API keys and database URLs
  - Must be created manually by each developer
- vercel.json
  - Configuration file for deploying the project to Vercel

## SYSTEM ARCHITECTURE
- Frontend: HTML + CSS + JavaScript (Fetch API)
- Backend: Node.js + Express
#### External APIs:
- Google Calendar API (FreeBusy.query)
- Nager.Date (Public Holidays)
- Supabase (User Preferences)

## BACKEND CONFIGURATION (server.js)
#### Express server responsibilities:
- Serves static frontend files from /public
- Exposes custom API endpoints
- Acts as an orchestrator for external APIs
- BACKEND_RUNTIME="Node.js"
- BACKEND_FRAMEWORK="Express"
#### Custom API Endpoints
- API_USER_SETTINGS_ENDPOINT="/api/user_settings/:user_id"
- API_HOLIDAY_CHECK_ENDPOINT="/api/is_holiday?date=YYYY-MM-DD"
#### Supabase Usage (Backend Only)
- SUPABASE_USED_FOR="User scheduling preferences"
- SUPABASE_TABLE="user_settings

## SUPABASE CREDENTIALS (REQUIRED)
Used by server.js to fetch user preferences. If no record exists for a user, default values are returned.
- SUPABASE_URL="https://your-project-id.supabase.co"
- SUPABASE_ANON_KEY="your-anon-public-key"

## GOOGLE CALENDAR API CONFIGURATION
The Google Calendar API is called from the frontend using the Fetch API to demonstrate client-side API integration, as required by INST377.
- GOOGLE_API_PROVIDER="Google Calendar API"
- GOOGLE_API_ENDPOINT="https://www.googleapis.com/calendar/v3/freeBusy"
- GOOGLE_API_METHOD="POST"
- GOOGLE_API_FEATURE_USED="FreeBusy.query"
#### API authentication (for demo purposes only)
- GOOGLE_API_KEY="your-google-api-key"
#### Calendar used for availability checks
- PRIMARY_CALENDAR_ID="your-calendar-email@example.com"
#### Data returned by Google API:
- Busy time blocks within a specified time window
  - GOOGLE_API_RESPONSE_DATA="busy time intervals"

## NAGER.DATE API CONFIGURATION
Used to prevent meetings from being scheduled on U.S. public holidays.
- HOLIDAY_API_PROVIDER="Nager.Date"
- HOLIDAY_API_ENDPOINT="https://date.nager.at/api/v3/PublicHolidays/{year}/US"
- HOLIDAY_CHECK_TYPE="US Federal Holidays"

## FRONTEND FILES
### index.html
- Landing page for the application
- Displays weekly availability using Chart.js
- Conceptually references Google Calendar data
- FRONTEND_HOME_PAGE="index.html"
- FRONTEND_CHART_LIBRARY="Chart.js"
### find_time.html
- Core functionality page
- Runs full API sequence:
  - Supabase (custom backend API)
  - Nager.Date (holiday check)
  - Google Calendar FreeBusy (external API)
- FRONTEND_CORE_PAGE="find_time.html"
- FRONTEND_API_SEQUENCE="Supabase -> Holiday Check -> Google FreeBusy"
### about.html
- Explains problem domain and API usage
- Documents the purpose of each integrated API
- FRONTEND_DOCUMENTATION_PAGE="about.html"
### style.css
- Shared styling for all frontend pages
- Controls layout, colors, and typography
- FRONTEND_STYLESHEET="style.css"

## SETUP STEPS (LOCAL DEVELOPMENT)
To run this project locally:
1. Download or clone all project files.
2. Open a terminal in the root project directory.
3. Install dependencies by running:
  - npm install
  - This reads package.json and package-lock.json and installs all required packages into node_modules.
4. Create or verify the .env file in the project root.
  - Ensure Supabase credentials, Google API key, and port number are correct.
5. Start the server by running:
  - node server.js
6. Open a browser and navigate to:
  - http://localhost:3000


## LOCAL DEVELOPMENT SETTINGS
- Port used by Express server during local development:
  - PORT=3000
- Local URL once server is running:
  - LOCAL_SERVER_URL="http://localhost:3000"

## DEPENDENCIES (package.json)
#### Runtime dependencies:
- DEPENDENCY_EXPRESS="Web server framework"
- DEPENDENCY_DOTENV="Environment variable loader"
- DEPENDENCY_SUPABASE="Database client"
#### Development dependencies:
- DEV_DEPENDENCY_JEST="Testing framework (not used in final demo)"

## PACKAGE-LOCK.JSON EXPLANATION
- Automatically generated when dependencies are installed
- Not manually edited by the developer
- Contains exact versions of every dependency and sub-dependency
- Ensures the project runs consistently across different machines
- Prevents bugs caused by version mismatches

## DEPLOYMENT CONFIGURATION
Vercel configuration:
- Routes /api/* requests to server.js
- Routes all other requests to files in /public
- DEPLOYMENT_PLATFORM="Vercel"
- DEPLOYMENT_CONFIG_FILE="vercel.json"

## GOOGLE API SUMMARY (INST377 REQUIREMENT)
- External API Used: Google Calendar API
- Endpoint: FreeBusy.query
- Purpose:
  - Identify calendar conflicts
  - Support availability-based scheduling
- Integration Type:
  - Client-side Fetch API call

## KNOWN LIMITATIONS
- Single calendar demo
- API key exposed for demonstration purposes
- No OAuth authentication

## FUTURE IMPROVEMENTS
- OAuth-based Google login
- Automatic free-time slot generation
- Multi-user scheduling support
- Persistent calendar visualization
