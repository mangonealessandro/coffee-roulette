# PRD to Architecture Mapping Reference

## Feature to Module Mapping

### Authentication & User Management

**PRD signals:**
- "user registration", "login", "sign up"
- "account creation", "user profile"
- "authentication", "authorization"

**Maps to:**
```
Backend modules:
- auth/ (login, register, JWT strategy)
- users/ (CRUD, profile management)

Frontend pages:
- /login
- /register
- /profile

Database entities:
- users table
```

### Scheduling & Automation

**PRD signals:**
- "weekly", "daily", "scheduled"
- "automatic", "recurring"
- "background job", "at [time]"

**Maps to:**
```
Backend:
- Cron jobs or task schedulers
- Queue workers (if complex)
- Event emitters

Infrastructure:
- Cron configuration
- Job monitoring
```

### Real-time Features

**PRD signals:**
- "on-demand", "immediately", "live"
- "real-time", "instant", "push"
- "notification when"

**Maps to:**
```
Backend:
- WebSocket endpoints or Server-Sent Events
- Push notification service
- Event bus

Frontend:
- WebSocket client
- Event listeners
- Real-time UI updates
```

### Data Relationships

**PRD signals:**
- "X belongs to Y"
- "users can have multiple"
- "each X is associated with"

**Maps to:**
```
Database:
- Foreign keys
- One-to-many relationships
- Many-to-many join tables

Code:
- Entity relationships in ORM
- Nested data structures
```

## User Flow to Technical Flow

### Example: Coffee Roulette Login Flow

**PRD User Flow:**
```
1. User visits app
2. Clicks "Login"
3. Enters email + password
4. Sees dashboard with match
```

**Technical Flow:**

**Frontend:**
```
1. App route → Redirect unauthenticated to /login
2. LoginPage component renders form
3. Form submit → useAuth.login(email, password)
4. Success → Store tokens → Navigate to /matches
```

**Backend:**
```
POST /auth/login receives {email, password}
1. AuthService.validateUser(email, password)
   - Find user by email
   - Compare password hash
2. Generate JWT tokens (access + refresh)
3. Return {access_token, refresh_token}
```

**Database:**
```sql
SELECT id, email, password_hash, name
FROM users
WHERE email = $1;
```

### Example: Weekly Matching Flow

**PRD User Flow:**
```
Every Monday 9am:
1. System creates matches
2. Users see new match on dashboard
3. Users schedule coffee
```

**Technical Flow:**

**Backend:**
```
Cron: 0 9 * * 1 (Every Monday 9am)
MatchesService.createWeeklyMatches()
1. Get all available users
2. Shuffle and pair randomly
3. Check against recent matches (avoid repeats)
4. Create Match entities with type='weekly'
5. Trigger notification service (if implemented)
```

**Frontend:**
```
GET /matches on page load
1. Fetch matches for current user
2. Filter for status='pending'
3. Display in MatchCard components
```

## Non-Functional to Technical

### Performance Requirements

**PRD:** "Response time <500ms p95"

**Maps to:**
```
Backend:
- Database indexing on frequently queried columns
- Query optimization
- Connection pooling
- Caching layer (Redis if needed)

Monitoring:
- APM tool setup
- p95 latency tracking
```

**PRD:** "Support 500 concurrent users"

**Maps to:**
```
Infrastructure:
- Load testing configuration
- Horizontal scaling setup
- Connection pool sizing
- Rate limiting

Database:
- Connection limits
- Query optimization
- Proper indexing
```

### Security Requirements

**PRD:** "JWT authentication", "GDPR compliant"

**Maps to:**
```
Backend:
- JWT middleware with expiration
- Refresh token rotation
- Data export endpoint: GET /users/me/export
- Data deletion endpoint: DELETE /users/me
- Audit logging

Frontend:
- Secure token storage (httpOnly cookies preferred)
- CSRF protection
- XSS prevention
```

**PRD:** "Only @company.com emails"

**Maps to:**
```
Backend:
- Email validation in RegisterDto
- Custom validator checking domain

Frontend:
- Client-side validation (UX)
- Error message display
```

### Scalability Requirements

**PRD:** "Database grows to 10K+ matches"

**Maps to:**
```
Database:
- Composite indexes on FK columns
- Partitioning strategy (if needed)
- Archive old data strategy

Backend:
- Pagination on list endpoints
- Efficient query patterns
- N+1 query prevention
```

## Data Model Extraction

### From PRD Personas/Entities

**PRD mentions:**
```
Users have:
- Name
- Email
- Role
- Avatar

Matches have:
- Two users
- Date created
- Status (pending/completed)
- Type (weekly/on-demand)
```

**Database Schema:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50),
  avatar_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE matches (
  id UUID PRIMARY KEY,
  user_one_id UUID REFERENCES users(id),
  user_two_id UUID REFERENCES users(id),
  type VARCHAR(20) CHECK (type IN ('weekly', 'on_demand')),
  status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'skipped')),
  matched_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_matches_users ON matches(user_one_id, user_two_id);
CREATE INDEX idx_users_email ON users(email);
```

### Implicit vs Explicit Fields

**Explicit in PRD:**
- User name, email (mentioned directly)
- Match status (specified as pending/completed)

**Implicit (add for functionality):**
- user.id (primary key - always needed)
- user.created_at (audit trail - best practice)
- user.password_hash (mentioned "login" implies auth)
- match.matched_at (timestamp - for sorting/filtering)

**Inferred from requirements:**
- user.is_available (from "toggle availability" requirement)
- match.type (from "weekly" vs "on-demand" distinction)

## API Contract Generation

### From User Stories to Endpoints

**User Story:** "As a user, I want to see my match history"

**Maps to:**
```
GET /matches
Auth: Required
Response: Match[]

Implementation:
- Fetch matches where user_one_id OR user_two_id = current_user
- Include related user data
- Order by matched_at DESC
```

**User Story:** "As a user, I want to mark a match as complete"

**Maps to:**
```
PATCH /matches/:id/complete
Auth: Required
Response: Match

Implementation:
- Verify user is part of the match
- Update status to 'completed'
- Set completed_at timestamp
```

**User Story:** "As a user, I want to request an immediate match"

**Maps to:**
```
POST /matches/on-demand
Auth: Required
Response: Match

Implementation:
- Find available users (is_available = true)
- Exclude current user
- Exclude recently matched users (last 4 weeks)
- Random select
- Create match with type='on_demand'
```

## Success Metrics to Observability

**PRD Metric:** "Track completion rate"

**Technical Implementation:**
```
Backend:
- Event logging on match status changes
- Aggregate query: completed / total matches
- Daily/weekly analytics job

Monitoring:
- Dashboard showing completion rate trend
- Alerts if rate drops below threshold
```

**PRD Metric:** "Monitor adoption (active users)"

**Technical Implementation:**
```
Backend:
- Track login events
- Calculate DAU/WAU/MAU
- Retention cohort analysis

Frontend:
- Analytics integration (e.g., Amplitude, Mixpanel)
- User action tracking
```
