# Developer API Platform - Research Document

> Research conducted: 2026-05-01 14:30 PT  
> Status: Feature specification ready for implementation  
> Estimated MVP scope: 3-4 days

---

## Executive Summary

A RESTful API platform that allows third-party developers to programmatically create, manage, and track QR codes. This unlocks QuickQR as an infrastructure component for businesses, marketing platforms, and automation workflows.

**Key Value Propositions:**
- Enable integrations with CRMs, marketing automation, and e-commerce platforms
- Support bulk operations at scale (1000+ QR codes/minute)
- Programmatic access to analytics and scan data
- Webhook delivery for real-time scan events

---

## Competitive Analysis

| Provider | API Pricing | Rate Limits | Key Features |
|----------|-------------|-------------|--------------|
| **Bitly** | $199/mo+ | 1000-5000 req/min | Links + basic QR |
| **QRCode Monkey** | €79/mo+ | 100 req/min | Design API only |
| **Scanova** | $5/mo+ | 100 req/min | Basic create/fetch |
| **QR Tiger** | $7/mo+ | 500 req/min | Bulk creation, tracking |
| **QuickQR Opportunity** | Freemium tier | 100-10000 req/min | Full feature parity + webhooks |

**Gap Analysis:**
- Most competitors separate QR API from link management
- No competitor offers real-time webhook delivery for scans
- Limited support for dynamic QR content updates via API
- Weak analytics granularity (hourly vs. real-time)

---

## API Specification

### Authentication

```http
GET /api/v1/qrcodes
Authorization: Bearer {api_key}
X-Workspace-ID: {workspace_id}
```

**API Key Scopes:**
- `qrcodes:read` — List and fetch QR codes
- `qrcodes:write` — Create, update, delete QR codes
- `analytics:read` — Access scan analytics
- `webhooks:write` — Manage webhook endpoints

### Endpoints

#### QR Code Management

```http
# Create QR Code
POST /api/v1/qrcodes
Content-Type: application/json

{
  "type": "url",
  "content": "https://example.com",
  "slug": "custom-slug",           // optional
  "folder_id": "uuid",             // optional
  "design": {
    "dot_color": "#000000",
    "bg_color": "#ffffff",
    "dot_style": "rounded",
    "logo_url": "https://..."
  },
  "settings": {
    "scan_limit": 1000,              // optional
    "schedule": {                    // optional
      "start_at": "2026-06-01T00:00:00Z",
      "end_at": "2026-06-30T23:59:59Z"
    },
    "utm_template_id": "uuid"        // optional
  }
}

# Response
{
  "id": "uuid",
  "slug": "custom-slug",
  "short_url": "https://qr.io/s/custom-slug",
  "qr_image_url": "https://cdn.qr.io/qr/uuid.png",
  "svg_url": "https://cdn.qr.io/qr/uuid.svg",
  "created_at": "2026-05-01T21:30:00Z"
}
```

```http
# List QR Codes (paginated)
GET /api/v1/qrcodes?folder_id={uuid}&limit=50&cursor={cursor}

# Response
{
  "data": [...],
  "pagination": {
    "next_cursor": "...",
    "has_more": true
  }
}
```

```http
# Update QR Code (dynamic content)
PATCH /api/v1/qrcodes/{id}
{
  "content": "https://new-url.com",  // Can update without changing QR image
  "settings": {
    "scan_limit": 5000
  }
}

# Delete QR Code
DELETE /api/v1/qrcodes/{id}
```

#### Analytics

```http
# Get QR Code Stats
GET /api/v1/qrcodes/{id}/stats?start_date=2026-04-01&end_date=2026-05-01

# Response
{
  "total_scans": 15420,
  "unique_scans": 8932,
  "time_series": [
    {"date": "2026-04-01", "scans": 423, "unique": 301}
  ],
  "top_locations": [
    {"country": "US", "city": "San Francisco", "scans": 2341}
  ],
  "top_devices": [
    {"type": "iOS", "scans": 8921}
  ],
  "top_referrers": [...]
}

# Export Scan Data (CSV)
GET /api/v1/qrcodes/{id}/scans/export?format=csv&start_date=...&end_date=...
```

#### Bulk Operations

```http
# Bulk Create (up to 1000 per request)
POST /api/v1/qrcodes/bulk
{
  "qrcodes": [
    {"type": "url", "content": "..."},
    {"type": "url", "content": "..."}
  ],
  "folder_id": "uuid",
  "design": { "template": "default" }
}

# Response
{
  "job_id": "uuid",
  "status": "processing",
  "estimated_completion": "2026-05-01T21:35:00Z"
}

# Check Bulk Job Status
GET /api/v1/bulk-jobs/{job_id}

# Response
{
  "status": "completed",
  "total": 1000,
  "succeeded": 998,
  "failed": 2,
  "download_url": "https://cdn.qr.io/bulk/uuid.zip"  // CSV + QR images
}
```

#### Webhook Management

```http
# Register Webhook
POST /api/v1/webhooks
{
  "url": "https://myapp.com/webhooks/qr-scan",
  "events": ["scan.created", "qr.created", "qr.deleted"],
  "secret": "whsec_...",           // for HMAC signature
  "active": true
}

# Webhook Payload (scan.created)
{
  "event": "scan.created",
  "timestamp": "2026-05-01T21:30:00Z",
  "data": {
    "qr_id": "uuid",
    "slug": "custom-slug",
    "scan": {
      "id": "uuid",
      "ip": "192.168.1.1",
      "country": "US",
      "city": "San Francisco",
      "device": "iOS 17",
      "referrer": "https://instagram.com/...",
      "timestamp": "2026-05-01T21:30:00Z"
    }
  }
}
```

---

## Technical Architecture

### Database Schema Additions

```sql
-- API Keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,              -- bcrypt hash of key
  scopes TEXT[] NOT NULL DEFAULT '{}',
  rate_limit_tier TEXT NOT NULL DEFAULT 'standard', -- free, standard, enterprise
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_api_keys_hash ON api_keys USING hash(key_hash);
CREATE INDEX idx_api_keys_user ON api_keys(user_id) WHERE revoked_at IS NULL;

-- API Request Log (for rate limiting & analytics)
CREATE TABLE api_request_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  ip INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_logs_key_time ON api_request_logs(api_key_id, created_at);

-- Bulk Job Tracking
CREATE TABLE bulk_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id),
  workspace_id UUID REFERENCES workspaces(id),
  type TEXT NOT NULL,                  -- 'create', 'update', 'delete'
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  total INTEGER NOT NULL,
  succeeded INTEGER DEFAULT 0,
  failed INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]',
  result_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Workspaces (for team/organization isolation)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES profiles(id),
  tier TEXT NOT NULL DEFAULT 'free',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspace Members
CREATE TABLE workspace_members (
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member', -- owner, admin, member
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (workspace_id, user_id)
);
```

### Rate Limiting Strategy

| Tier | Requests/Min | Burst | Bulk Max | Price |
|------|--------------|-------|----------|-------|
| Free | 60 | 10 | 10 | $0 |
| Standard | 600 | 100 | 100 | $9/mo |
| Pro | 3000 | 500 | 500 | $29/mo |
| Enterprise | 10000 | 2000 | 1000 | Custom |

**Implementation:**
- Redis-backed sliding window counter
- Separate limits per API key per endpoint
- Burst allowance for traffic spikes
- `X-RateLimit-*` headers in all responses

### Security Considerations

1. **API Key Storage:**
   - Store only bcrypt hashes (not plaintext)
   - Show full key only once at creation
   - Support key rotation (create new, revoke old)

2. **Request Security:**
   - HTTPS only (HSTS enforced)
   - IP allowlist option for enterprise
   - Request signing option for webhooks

3. **Data Isolation:**
   - Workspace-scoped all queries
   - RLS policies enforced at database level
   - No cross-tenant data leakage possible

---

## Implementation Plan

### Phase 1: Foundation (2 days)

1. **Database migrations**
   - Create `workspaces`, `workspace_members` tables
   - Create `api_keys` table with proper indexing
   - Create `api_request_logs` table
   - Create `bulk_jobs` table

2. **Authentication middleware**
   - API key extraction from `Authorization: Bearer` header
   - Key validation against hashed store
   - Scope checking middleware
   - Rate limiting integration

3. **Core API endpoints**
   - `POST /api/v1/qrcodes` — Create
   - `GET /api/v1/qrcodes` — List
   - `GET /api/v1/qrcodes/:id` — Fetch
   - `PATCH /api/v1/qrcodes/:id` — Update
   - `DELETE /api/v1/qrcodes/:id` — Delete

### Phase 2: Analytics & Bulk (1 day)

1. **Analytics endpoints**
   - Stats aggregation queries
   - Time-series data for charts
   - Export functionality (CSV generation)

2. **Bulk operations**
   - Async job queue with Supabase background functions
   - Batch insert optimization
   - ZIP generation for bulk download

### Phase 3: Webhooks & Polish (1 day)

1. **Webhook system**
   - Endpoint registration/management
   - Event dispatch system
   - Retry logic with exponential backoff
   - Delivery logs

2. **Developer dashboard UI**
   - API key management page
   - Request log viewer
   - Webhook configuration
   - Usage analytics

---

## Pricing Integration

**Free Tier:**
- 1 API key
- 60 req/min
- Basic analytics
- No webhooks

**Standard ($9/mo):**
- 5 API keys
- 600 req/min
- Advanced analytics
- 3 webhooks
- Bulk operations (max 100)

**Pro ($29/mo):**
- 20 API keys
- 3000 req/min
- Real-time analytics
- 10 webhooks
- Bulk operations (max 500)
- Priority support

**Enterprise:**
- Unlimited keys
- 10000+ req/min
- Custom rate limits
- Dedicated infrastructure option
- SLA guarantee

---

## Success Metrics

**Adoption:**
- API keys created (target: 100 in first month)
- API requests per day (target: 10,000 avg)
- Webhook endpoints registered

**Engagement:**
- QR codes created via API vs UI (target: 30% API)
- Bulk job usage frequency
- Export feature usage

**Business:**
- API-driven upgrades to paid tiers
- Integration partners onboarded
- Support tickets (target: <5% of API users)

---

## Open Questions

1. Should we offer GraphQL in addition to REST?
2. Do we need SDKs (Node.js, Python, Go) at launch or post-MVP?
3. Should webhooks support signing for verification?
4. Do we need IP allowlisting for enterprise security?

---

## Related Documentation

- [QR Health Monitoring](./QR_HEALTH_MONITORING.md) — Can trigger API events for broken URL detection
- Abuse Detection — API keys should respect abuse scores and blocks
- Existing webhook system — Extend current implementation

---

*Document prepared for implementation consideration. No action taken during this research phase.*
