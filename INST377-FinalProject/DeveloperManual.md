# Developer Manual
# INST377 Final Project: Scheduling Navigator


## PROJECT OVERVIEW
This application demonstrates how multiple APIs can be orchestrated to solve scheduling problems.
The core external API used is the Google Calendar API.
#### The system:
1. Retrieves user preferences from Supabase
2. Filters out holidays using Nager.Date
3. Checks calendar conflicts using Google FreeBusy

## SYSTEM ARCHITECTURE
- Frontend: HTML + CSS + JavaScript (Fetch API)
- Backend: Node.js + Express
#### External APIs:
- Google Calendar API (FreeBusy.query)
- Nager.Date (Public Holidays)
- Supabase (User Preferences)

## BACKEND CONFIGURATION (server.js)
#### Express server that:
- Serves static files from /public
- Exposes custom API endpoints
- Acts as an orchestrator for external APIs

- BACKEND_RUNTIME="Node.js"
- BACKEND_FRAMEWORK="Express"

#### Custom API Endpoints
- API_USER_SETTINGS_ENDPOINT="/api/user_settings/:user_id"
- API_HOLIDAY_CHECK_ENDPOINT="/api/is_holiday?date=YYYY-MM-DD"

#### Supabase is used ONLY by the backend
- SUPABASE_USED_FOR="User scheduling preferences"
- SUPABASE_TABLE="user_settings"


## SUPABASE CREDENTIALS (REQUIRED)
- Used by server.js to fetch user preferences
- If no record exists, default values are returned

- SUPABASE_URL="https://your-project-id.supabase.co"
- SUPABASE_ANON_KEY="your-anon-public-key"

## GOOGLE CALENDAR API CONFIGURATION
- Google Calendar API is called from the FRONTEND
- using the Fetch API to demonstrate client-side
- API integration as required by INST377

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
- Landing page
- Displays weekly availability using Chart.js
- Conceptually references Google Calendar data

- FRONTEND_HOME_PAGE="index.html"
- FRONTEND_CHART_LIBRARY="Chart.js"

### find_time.html
- Core functionality page
- Runs full API sequence:
  - Supabase (custom API)
  - Nager.Date (custom orchestrator)
  - Google Calendar FreeBusy (external API)

- FRONTEND_CORE_PAGE="find_time.html"
- FRONTEND_API_SEQUENCE="Supabase -> Holiday Check -> Google FreeBusy"

### about.html
- Explains problem domain and API usage
  - FRONTEND_DOCUMENTATION_PAGE="about.html"

### style.css
- Shared styling for all pages
  - FRONTEND_STYLESHEET="style.css"

### LOCAL DEVELOPMENT SETTINGS
- Port used by Express server during local development
  - PORT=3000

### Local URL once server is running
- LOCAL_SERVER_URL="http://localhost:3000"

## DEPENDENCIES (package.json)
Runtime dependencies:
- DEPENDENCY_EXPRESS="Web server framework"
- DEPENDENCY_DOTENV="Environment variable loader"
- DEPENDENCY_SUPABASE="Database client"

- Development dependencies:
  - DEV_DEPENDENCY_JEST="Testing framework (not used in final demo)"

## DEPLOYMENT CONFIGURATION
Vercel configuration:
- Routes /api/* to server.js
- Routes all other requests to /public

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

# FUTURE IMPROVEMENTS
- OAuth-based Google login
- Automatic free-time slot generation
- Multi-user scheduling support
- Persistent calendar visualization
