# PRODUCT REQUIREMENTS DOCUMENT

## EXECUTIVE SUMMARY

**Product Name:** Lighthouse

**Product Vision:** Lighthouse provides consulting executives and professionals with a curated, data-rich feed of the top ten AI market trends, enabling them to quickly understand emerging patterns, identify consulting opportunities, and advise clients on vertical-specific impacts.

**Core Purpose:** Eliminates the time-consuming process of aggregating and synthesizing AI market intelligence by delivering pre-analyzed trends with actionable consulting insights in a clean, organized interface.

**Target Users:** Consulting executives and professionals at boutique firms who need to stay current on AI market trends to advise clients and identify business opportunities.

**Key MVP Features:**
- User Authentication - System/Configuration
- Top Ten Trends Feed - User-Generated Content (admin-curated)
- Trend Detail View with Analysis - User-Generated Content
- Bookmark/Save Trends - User-Generated Content
- Search and Filter - System functionality
- Admin Content Management - Configuration

**Platform:** Web application (responsive design, accessible via browser on desktop, tablet, and mobile devices)

**Complexity Assessment:** Simple
- State Management: Backend database with frontend caching
- External Integrations: URL metadata fetching service (reduces complexity - simple HTTP call)
- Business Logic: Simple CRUD operations with filtering and search

**MVP Success Criteria:**
- Users can browse all ten current trends with full analysis
- Users can bookmark trends and access saved items
- Admin can curate and publish trends efficiently using URL fetch
- Responsive design functions on all device sizes
- Search and filter return accurate results

---

## 1. USERS & PERSONAS

**Primary Persona:**
- **Name:** Marcus the Boutique Consulting Partner
- **Context:** Partner at a 15-person AI consulting firm serving mid-market companies. Spends 10+ hours weekly reading newsletters, reports, and articles to stay current on AI trends. Needs to quickly identify which trends are relevant for client pitches and which verticals to target.
- **Goals:** Understand top AI trends quickly, identify consulting opportunities, advise clients with confidence, reduce research time from hours to minutes
- **Pain Points:** Information overload from multiple sources, difficulty connecting trends to specific industries, lack of actionable consulting angles, time wasted synthesizing scattered information

**Secondary Persona:**
- **Name:** Sarah the Strategy Consultant
- **Context:** Senior consultant who needs to brief partners on AI market movements and prepare client presentations. Requires credible, well-analyzed information she can reference in proposals.
- **Goals:** Access reliable trend analysis, save relevant trends for client work, search historical trends for proposal research
- **Pain Points:** Inconsistent information quality, difficulty finding trends by vertical or topic, no central repository for saved research

---

## 2. FUNCTIONAL REQUIREMENTS

### 2.1 Core MVP Features (Priority 0)

**FR-001: User Authentication**
- **Description:** Secure user registration, login, profile management, and session persistence
- **Entity Type:** System/Configuration
- **Operations:** Register, Login, View profile, Edit profile (name, email, password), Logout
- **Key Rules:** Email-based registration, secure password storage, persistent sessions across browser sessions
- **Acceptance:** Users can register with email/password, log in, update their profile, and maintain authenticated sessions

**FR-002: Top Ten Trends Feed**
- **Description:** Display current top ten AI market trends in a data-rich list view with key metadata visible
- **Entity Type:** User-Generated Content (admin-curated)
- **Operations:** View list, Filter by vertical/category, Sort by date added, Search by keyword, Navigate to detail
- **Key Rules:** Always shows exactly ten current trends; admin controls which trends are "current"; list view shows trend title, justification summary, affected verticals, and date added
- **Acceptance:** Users see ten trends in list format with filtering, sorting, and search capabilities; clicking a trend opens detail view

**FR-003: Trend Detail View with Analysis**
- **Description:** Full trend analysis including justification, consulting leverage opportunities, and vertical impacts
- **Entity Type:** User-Generated Content
- **Operations:** View full analysis, Bookmark/unbookmark, Share link, Return to feed
- **Key Rules:** Shows three analysis sections (Why It's a Trend, How Consultancies Leverage, Affected Verticals); includes source links and metadata; bookmark state persists
- **Acceptance:** Users can read complete trend analysis, bookmark the trend, and navigate back to feed; all three analysis sections display clearly

**FR-004: Bookmark Management**
- **Description:** Save trends for later reference and access saved collection
- **Entity Type:** User-Generated Content
- **Operations:** Create bookmark, View bookmarked trends, Remove bookmark, Search bookmarks, Export bookmark list
- **Key Rules:** Users can only bookmark/unbookmark their own items; bookmarks persist across sessions; bookmark count visible on trend cards
- **Acceptance:** Users can bookmark trends from feed or detail view, access "Saved Trends" page showing all bookmarks, remove bookmarks, and export list as CSV

**FR-005: Search and Filter**
- **Description:** Find trends by keyword, vertical, or date range
- **Entity Type:** System functionality
- **Operations:** Text search across titles and summaries, Filter by vertical tags, Filter by date range, Clear filters, Combine multiple filters
- **Key Rules:** Search is case-insensitive; filters apply immediately; multiple filters use AND logic; "Clear all" resets to full feed
- **Acceptance:** Users can search for keywords and see matching results; apply vertical and date filters; combine filters; clear filters to return to full feed

**FR-006: Admin Content Management**
- **Description:** Admin interface to curate the top ten trends with URL metadata fetching
- **Entity Type:** Configuration
- **Operations:** Create trend (with URL fetch), View all trends, Edit trend, Delete/archive trend, Set "current ten", Preview before publish
- **Key Rules:** Only admin users access this interface; URL fetch populates title and summary automatically; admin must manually add three analysis sections; only ten trends can be "current" at once
- **Acceptance:** Admin can add new trends by entering URL (auto-fetches metadata), manually complete analysis sections, edit existing trends, archive old trends, and designate which ten are current

---

## 3. USER WORKFLOWS

### 3.1 Primary Workflow: Discover and Save Relevant Trend

**Trigger:** User logs in to check latest AI market trends
**Outcome:** User identifies relevant trend, reads full analysis, and bookmarks for client work

**Steps:**
1. User logs in and lands on Top Ten Trends feed showing data-rich list view
2. User scans trend titles and justification summaries, applies "Financial Services" vertical filter
3. System displays filtered trends; user clicks on "Generative AI in Regulatory Compliance"
4. System shows full trend detail with three analysis sections (justification, consulting leverage, affected verticals)
5. User reads analysis, clicks bookmark icon, and returns to feed to continue browsing
6. System saves bookmark and updates user's "Saved Trends" collection

### 3.2 Key Supporting Workflows

**Register Account:** User clicks "Sign Up" → enters email, password, name → submits → receives confirmation → redirected to feed

**Search Trends:** User enters search term in search bar → system filters trends in real-time → user sees matching results

**Filter by Vertical:** User clicks vertical filter dropdown → selects "Healthcare" → system shows only healthcare-related trends

**View Saved Trends:** User clicks "Saved" in navigation → sees list of all bookmarked trends → clicks trend to view detail

**Admin Add Trend:** Admin enters article URL → system fetches title/summary → admin adds three analysis sections → sets as "current" → publishes to feed

**Admin Archive Trend:** Admin views current ten → selects trend to archive → confirms → system removes from "current" and adds to archive

---

## 4. BUSINESS RULES

### 4.1 Entity Lifecycle Rules

**User:**
- **Type:** System/Configuration
- **Creation:** Open public registration via email/password
- **Editing:** Owner only (can edit own profile: name, email, password)
- **Deletion:** Owner can delete account (soft delete - data archived for 30 days before permanent removal)

**Trend:**
- **Type:** User-Generated Content (admin-curated)
- **Creation:** Admin only via content management interface
- **Editing:** Admin only (can edit all fields including analysis sections)
- **Deletion:** Admin only - soft delete (archived, not permanently removed; can be restored)

**Bookmark:**
- **Type:** User-Generated Content
- **Creation:** Any authenticated user can bookmark any trend
- **Editing:** Not applicable (bookmark is binary: exists or doesn't)
- **Deletion:** Owner only (user can remove their own bookmarks; bookmarks deleted when user deletes account)

**Current Trends List:**
- **Type:** Configuration
- **Creation:** Admin designates exactly ten trends as "current"
- **Editing:** Admin can swap trends in/out of current list
- **Deletion:** Removing from "current" archives the trend but doesn't delete it

### 4.2 Data Validation Rules

**User:**
- **Required Fields:** email, password, name
- **Field Constraints:** Email must be valid format and unique; password minimum 8 characters; name minimum 2 characters, maximum 100 characters

**Trend:**
- **Required Fields:** title, justificationSummary, whyTrend, howConsultanciesLeverage, affectedVerticals, sourceUrl, dateAdded, status (current/archived)
- **Field Constraints:** Title minimum 10 characters, maximum 200 characters; each analysis section minimum 100 characters; sourceUrl must be valid URL; affectedVerticals must include at least one vertical tag; exactly ten trends can have status "current"

**Bookmark:**
- **Required Fields:** userId, trendId, createdAt
- **Field Constraints:** userId and trendId must reference existing records; one bookmark per user per trend (no duplicates)

### 4.3 Access & Process Rules
- Users can only view, bookmark, and search trends; cannot create or edit trends
- Admin users have full CRUD access to trends and can manage "current ten" designation
- Bookmarks are private to each user; users cannot see others' bookmarks
- Search and filter apply only to "current" trends by default; archived trends accessible via separate "Archive" view
- URL metadata fetch is admin-only feature; fetched data can be edited before publishing
- Maximum ten trends can be "current" simultaneously; admin must archive one before adding another to current list

---

## 5. DATA REQUIREMENTS

### 5.1 Core Entities

**User**
- **Type:** System/Configuration | **Storage:** Backend (MongoDB)
- **Key Fields:** id, email, passwordHash, name, role (user/admin), createdAt, updatedAt, lastLoginAt
- **Relationships:** has many Bookmarks
- **Lifecycle:** Full CRUD with account deletion (soft delete with 30-day retention)

**Trend**
- **Type:** User-Generated Content | **Storage:** Backend (MongoDB)
- **Key Fields:** id, title, justificationSummary, whyTrend, howConsultanciesLeverage, affectedVerticals (array), sourceUrl, status (current/archived), dateAdded, createdAt, updatedAt, createdBy (adminId)
- **Relationships:** has many Bookmarks, belongs to User (admin creator)
- **Lifecycle:** Admin-only CRUD with soft delete (archive); can be restored from archive

**Bookmark**
- **Type:** User-Generated Content | **Storage:** Backend (MongoDB)
- **Key Fields:** id, userId, trendId, createdAt
- **Relationships:** belongs to User, belongs to Trend
- **Lifecycle:** Create and Delete only (users add/remove bookmarks); cascade delete when user or trend deleted

**Vertical (Tag)**
- **Type:** Configuration | **Storage:** Backend (MongoDB)
- **Key Fields:** id, name, slug, description, createdAt
- **Relationships:** referenced by Trends (many-to-many via array field)
- **Lifecycle:** Admin-only CRUD; predefined list (e.g., Healthcare, Financial Services, Retail, Manufacturing, Technology, Legal, Education, Government, Energy, Media)

### 5.2 Data Storage Strategy
- **Primary Storage:** Backend MongoDB database for all entities
- **Capacity:** MongoDB supports unlimited trends and users; no artificial limits for MVP
- **Persistence:** All data persists permanently (except soft-deleted records after retention period)
- **Audit Fields:** All entities include createdAt, updatedAt; Trends include createdBy (admin user ID)
- **Indexing:** Text indexes on Trend title and justificationSummary for search; indexes on status, dateAdded, and affectedVerticals for filtering

---

## 6. INTEGRATION REQUIREMENTS

**URL Metadata Fetching Service:**
- **Purpose:** Auto-populate trend title and summary when admin enters source URL
- **Type:** Frontend API call to metadata extraction service (e.g., Open Graph scraper, Clearbit, or custom service)
- **Data Exchange:** Sends source URL, receives title, description/summary, publication date, author
- **Trigger:** Admin enters URL in "Add Trend" form and clicks "Fetch Metadata" button
- **Error Handling:** If fetch fails, admin can manually enter title and summary; display error message but allow form submission

---

## 7. VIEWS & NAVIGATION

### 7.1 Primary Views

**Login/Register** (`/login`, `/register`) - Authentication forms with email/password fields, validation, and error messages

**Top Ten Trends Feed** (`/`) - Data-rich list view showing ten current trends with title, justification summary, affected verticals, date added; includes search bar, vertical filter dropdown, and date range filter

**Trend Detail** (`/trends/:id`) - Full trend analysis with three sections (Why It's a Trend, How Consultancies Leverage, Affected Verticals), source link, metadata, and bookmark toggle button

**Saved Trends** (`/saved`) - List of user's bookmarked trends with same layout as main feed; includes search and filter; export button for CSV download

**User Profile** (`/profile`) - View and edit user name, email, password; account deletion option

**Admin Dashboard** (`/admin`) - Protected view showing all trends (current and archived), "Add Trend" button, edit/delete actions, "Set Current Ten" management interface

**Admin Add/Edit Trend** (`/admin/trends/new`, `/admin/trends/:id/edit`) - Form with URL input and "Fetch Metadata" button, three text areas for analysis sections, vertical tag selector, status toggle (current/archived)

### 7.2 Navigation Structure

**Main Nav (User):** Lighthouse logo (home) | Top Ten Trends | Saved | Profile | Logout
**Main Nav (Admin):** Lighthouse logo (home) | Top Ten Trends | Saved | Admin Dashboard | Profile | Logout
**Default Landing:** Top Ten Trends feed (`/`)
**Mobile:** Hamburger menu with same navigation items; responsive list view with stacked cards

---

## 8. MVP SCOPE & CONSTRAINTS

### 8.1 MVP Success Definition

The MVP is successful when:
- ✅ Users can register, log in, and browse ten curated AI trends
- ✅ Trend detail view displays all three analysis sections clearly
- ✅ Users can bookmark trends and access saved collection
- ✅ Search and filter return accurate, real-time results
- ✅ Admin can add trends using URL fetch and manage current ten
- ✅ Responsive design works on desktop, tablet, and mobile
- ✅ All data persists across sessions

### 8.2 In Scope for MVP

Core features included:
- FR-001: User Authentication (register, login, profile management)
- FR-002: Top Ten Trends Feed (list view with filters)
- FR-003: Trend Detail View (three analysis sections)
- FR-004: Bookmark Management (save, view saved, remove, export)
- FR-005: Search and Filter (keyword, vertical, date range)
- FR-006: Admin Content Management (CRUD with URL fetch)

### 8.3 Technical Constraints

- **Data Storage:** Backend MongoDB database (no storage limits for MVP)
- **Concurrent Users:** Expected 50-100 users during MVP validation phase
- **Performance:** Page loads <2 seconds, search/filter results instant (<500ms)
- **Browser Support:** Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile:** Responsive design, iOS Safari and Android Chrome support
- **Offline:** Not supported - requires internet connection for all features

### 8.4 Known Limitations

**For MVP:**
- Manual curation required - admin must add all trends (no automated scraping)
- URL metadata fetch may fail for some sources - admin must manually enter data
- No multi-user collaboration - single admin manages content
- No notification system - users must visit site to see new trends
- Export limited to CSV format for bookmarks

**Future Enhancements:**
- Automated trend detection from multiple sources
- AI-powered analysis generation for three sections
- Email notifications for new trends matching user preferences
- Collaborative bookmarking and team workspaces
- Advanced analytics on trend popularity and user engagement

---

## 9. ASSUMPTIONS & DECISIONS

### 9.1 Platform Decisions
- **Type:** Full-stack web application (frontend + backend)
- **Storage:** Backend MongoDB database for all entities
- **Auth:** JWT-based authentication with secure password hashing

### 9.2 Entity Lifecycle Decisions

**Trend:** Admin-only CRUD with soft delete (archive)
- **Reason:** Content quality control requires admin curation; archiving preserves historical trends for future reference

**Bookmark:** User create/delete only
- **Reason:** Bookmarks are simple binary relationships; no editing needed; users control their own saved items

**User:** Full CRUD with soft delete
- **Reason:** Users need profile management; account deletion with retention period protects against accidental deletion

**Vertical Tags:** Admin-only CRUD
- **Reason:** Controlled vocabulary ensures consistent filtering; predefined list prevents tag sprawl

### 9.3 Key Assumptions

1. **Admin curation is sustainable for MVP validation**
   - Reasoning: User stated success metric of "10-15 articles in under 2 hours weekly" indicates manual curation is acceptable for MVP; URL fetch reduces data entry time

2. **"Top Ten" is the optimal number for executive consumption**
   - Reasoning: Product name "Lighthouse" and "clean, organized feed" suggest curated, focused content; ten trends balance comprehensiveness with digestibility for busy executives

3. **Three analysis sections provide sufficient consulting value**
   - Reasoning: User specified "Why It's a Trend," "How Consultancies Leverage," and "Affected Verticals" as essential metadata; these directly address consulting use cases

4. **Data-rich list view prioritizes information density over visual appeal**
   - Reasoning: User chose "denser, data-rich list view" over magazine layout; consulting professionals prioritize quick scanning and information extraction

5. **Public registration is appropriate for MVP validation**
   - Reasoning: User confirmed open registration; enables faster user acquisition for testing hypothesis before implementing invite/waitlist system

### 9.4 Clarification Q&A Summary

**Q:** Visual density preference - magazine-style or data-rich list?
**A:** Denser, data-rich list view
**Decision:** Feed displays trends in compact list format with key metadata visible (title, summary, verticals, date) without large images; prioritizes information density for professional users

**Q:** Essential metadata fields for market intelligence?
**A:** Top Ten Trends with three analysis sections: Why It's a Trend, How Consultancies Leverage, Affected Verticals
**Decision:** Trend entity includes three required text fields for analysis sections; these become core value proposition and differentiate from generic news aggregators

**Q:** Access model - open registration or invite-only?
**A:** Open to public
**Decision:** No invite code or waitlist system for MVP; standard email/password registration enables faster user acquisition for validation

**Q:** Admin curation - manual entry or URL fetch?
**A:** Fetch metadata from URL
**Decision:** Admin interface includes URL input with "Fetch Metadata" button to auto-populate title and summary; reduces data entry time and improves curation efficiency

---

**PRD Complete - Ready for Development**
