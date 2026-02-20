# PRD Examples

## Example 1: Coffee Roulette (Full PRD)

### Executive Summary

**Problem:** Remote employees lack spontaneous connections with colleagues, leading to isolation and team silos.

**Solution:** Web app that automatically matches two random colleagues weekly for coffee breaks, with on-demand matching option.

**Value:**
- Business: +15% employee engagement score in Q1
- Users: Reduced isolation, cross-team networking

### Background & Context

**Current situation:** Post-COVID remote culture. 500 employees across 8 time zones. No structured connection opportunities beyond scheduled meetings.

**Why now:** Employee survey shows 67% feel disconnected from colleagues outside their immediate team.

**Alternatives considered:** Slack channels (low engagement), mandatory social events (scheduling conflicts).

### Goals & Success Metrics

**Business Goals (Q1 2024):**
- 60% adoption (300/500 employees registered)
- 50 completed matches/week
- 4.0+ user satisfaction rating

**KPIs:**
| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Weekly active users | 0 | 200 | Analytics |
| Match completion rate | 0% | 70% | Event logs |
| Cross-team connections | Low | +40% | Survey |

**Non-Functional:**
- Performance: Page load <2s, API <500ms
- Security: JWT auth, GDPR compliant
- Scalability: Support 500 concurrent users

### User Personas

**Marco, Backend Developer**
- **Context:** Remote 100%, team of 8, uses Slack/Zoom
- **Pain Points:**
  - Doesn't know colleagues in other teams
  - Misses water cooler conversations
  - Feels isolated working from home
- **Goals:** Meet people across company, learn about other projects
- **Tech Level:** Expert

**Sara, Product Manager**
- **Context:** Hybrid (2 days office), team of 4, travels quarterly
- **Pain Points:**
  - Loses touch with remote colleagues
  - Hard to maintain relationships while traveling
  - Spontaneous connections only happen in office
- **Goals:** Stay connected regardless of location
- **Tech Level:** Intermediate

### User Stories

1. As an employee, I want to register with my company email so I can access the system
2. As an employee, I want to receive 1 automatic match/week so I don't forget to connect
3. As an employee, I want to see my match's name and photo so I can recognize them
4. As an employee, I want to request an on-demand match when I have 15min free
5. As an employee, I want to mark matches as completed to track my networking
6. As an employee, I want to pause matches when on vacation to avoid notifications

### Solution Overview

Web application with automatic weekly matching algorithm and manual on-demand requests. Backend handles user management, matching logic (random with anti-repeat), and scheduling. Frontend provides login, match viewing, and availability controls. Email notifications for new matches.

### Core User Flow

**Happy path:**
1. User visits app → Redirect to /login
2. Registration → Email + Password + Name
3. Dashboard → Shows current week's match (if Monday passed)
4. Match card → Avatar, name, role, "Schedule Coffee" button
5. After coffee → Click "Done!" → Match marked completed
6. Next Monday 9am → New match automatically created

**Edge cases:**
- No match available for on-demand → Show "No one available, try later"
- User already matched this week → Disable on-demand button
- User skips match → Re-matching allowed after 4 weeks

### Functional Requirements

**Must-Have (MVP - 6 weeks):**
- [ ] **Auth:** Login/register with company email
  - Why: Security, user identity
- [ ] **Weekly matching:** Cron job every Monday 9am
  - Why: Core value proposition
- [ ] **On-demand matching:** Request immediate match if available
  - Why: Flexibility for users
- [ ] **Profile:** Name, avatar, availability toggle
  - Why: User control over participation
- [ ] **Match history:** View past completed/skipped matches
  - Why: Track networking activity

**Should-Have (Post-MVP):**
- [ ] **Email notifications:** New match alerts
  - Impact: High, Effort: Medium
- [ ] **Feedback:** Rate match 1-5 stars
  - Impact: Medium, Effort: Small
- [ ] **Preferences:** Same office, same seniority filters
  - Impact: High, Effort: Large

**Won't-Have (Out of Scope):**
- ❌ **In-app chat:** Use Slack instead (focus, no reinventing)
- ❌ **Calendar integration:** Manual scheduling for MVP (complexity)
- ❌ **Mobile native app:** Web responsive only (resources)
- ❌ **Video calls:** Use Google Meet (not core value)

### Non-Functional Requirements

**Performance:**
- Page load <2s on 3G
- API response <500ms p95
- Weekly cron completes in <5min

**Security:**
- JWT with 15min access, 7d refresh
- Only @company.com emails allowed
- GDPR: Data export, deletion endpoints

**Scalability:**
- 500 concurrent users
- Database grows to 10K+ matches without degradation

### Open Questions

1. **Match frequency:** Is weekly too much? Test with 20-person pilot
2. **Notification timing:** Monday 9am or 10am post-standup?
3. **No-show handling:** Penalize users who accept but don't show?
4. **Privacy:** Show team/role or only name? (HR approval needed)

### Dependencies & Risks

**Dependencies:**
- Employee email list from HR (Google Workspace export)
- Privacy policy approval from Legal team

**Risks:**
- Low adoption without launch campaign → Mitigation: CEO announcement
- Match fatigue after 2-3 months → Mitigation: Add pause feature

---

## Example 2: Internal Dashboard (Lite PRD)

# Analytics Dashboard - PRD Lite

## Problem
Data team manually creates weekly reports by querying BigQuery and copying to Google Sheets. Takes 4 hours/week.

## Users & Scenarios
- **Data Analyst:** Needs revenue metrics every Monday
- **Product Manager:** Checks feature adoption weekly
- **Scenario:** Monday morning, need to present metrics in standup

## Solution
Web dashboard querying BigQuery with saved templates. One-click refresh for common reports (revenue, adoption, retention). Export to CSV.

## Features
**Must-have:**
- Login with Google SSO
- 3 saved query templates (revenue, adoption, retention)
- Date range picker (last 7d, 30d, 90d)
- CSV export

**Out of scope:**
- ❌ Custom queries (use BigQuery console - simplicity)
- ❌ Real-time updates (daily refresh sufficient - complexity)

## Success
- Time saved: 4h/week → 30min/week
- Usage: 5 team members use weekly
