# QR Health Monitoring Feature Research

## Overview

QR Health Monitoring automatically checks that QR code destination URLs are accessible and alerts users when links become broken (404 errors, domain expiration, SSL issues, etc). This is a critical reliability feature for enterprise users managing hundreds or thousands of QR codes.

## Competitive Analysis

| Provider | Health Monitoring | Alerts | Dashboard | Auto-Fix |
|----------|-------------------|--------|-----------|----------|
| **Bitly** | ✅ Yes | Email, Slack | Link health page | ❌ No |
| **Rebrandly** | ✅ Yes | Email, Webhooks | Health reports | ❌ No |
| **Short.io** | ✅ Yes | Email, Slack | Link status | ❌ No |
| **QR Tiger** | ❌ No | - | - | - |
| **Scanova** | ❌ No | - | - | - |
| **Dub.co** | ✅ Partial | Email | Basic status | ❌ No |
| **unscan** | ✅ Yes | Email, Slack | Health reports | ❌ No |

### Key Findings

**Market Gap**: Most QR-specific tools lack health monitoring entirely. Link shorteners (Bitly, Rebrandly) have it but don't tailor it for QR use cases (e.g., checking if QR images themselves are accessible, not just the links).

**User Pain Points**:
1. Broken QR codes in printed materials (flyers, billboards, packaging) are costly to replace
2. No visibility into which links are failing until customers complain
3. SSL certificate expiration breaks QR codes without warning
4. Domain hijacking or expiration redirects QR codes to spam/malware

## Technical Implementation

### 1. Health Check System

#### Check Types

| Check | Frequency | Detection |
|-------|-----------|-----------|
| HTTP 200 OK | Daily | 404, 500, timeouts |
| SSL Certificate Valid | Daily | Expired, invalid, self-signed |
| Domain Resolution | Daily | DNS failures, NXDOMAIN |
| Redirect Chain | Weekly | Loops, excessive hops |
| Content Match | Weekly | Page content changed significantly |
| Response Time | Every check | >5s = warning, >10s = critical |

#### Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  Scheduler  │───▶│  Job Queue   │───▶│   Workers   │
│  (daily)    │    │  (Redis)     │    │  (checkers) │
└─────────────┘    └──────────────┘    └──────┬──────┘
                                              │
                       ┌──────────────────────┘
                       ▼
               ┌──────────────┐
               │   Results    │
               │   Database   │
               └──────────────┘
```

### 2. Database Schema

```sql
-- Health check results table
CREATE TABLE qr_health_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_code_id UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
    checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL, -- 'healthy', 'warning', 'critical'
    http_status INTEGER,
    response_time_ms INTEGER,
    ssl_valid BOOLEAN,
    ssl_expires_at TIMESTAMP WITH TIME ZONE,
    redirect_count INTEGER,
    final_url TEXT,
    error_message TEXT,
    error_type VARCHAR(50), -- 'timeout', 'dns_error', 'ssl_error', 'http_error'
    
    INDEX idx_qr_code_id_checked_at (qr_code_id, checked_at DESC)
);

-- Health check configuration per QR code
CREATE TABLE qr_health_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_code_id UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    check_frequency VARCHAR(20) NOT NULL DEFAULT 'daily', -- 'hourly', 'daily', 'weekly'
    alert_threshold VARCHAR(20) NOT NULL DEFAULT 'critical', -- 'any', 'warning', 'critical'
    content_match_enabled BOOLEAN DEFAULT FALSE,
    content_match_selector TEXT, -- CSS selector for key content
    content_match_expected TEXT,
    
    UNIQUE(qr_code_id)
);
```

### 3. Health Status Dashboard

#### API Endpoints

```
GET /api/v1/qr-codes/health
  Query params: status, limit, offset, workspace_id
  Response: {
    "healthy": 145,
    "warning": 3,
    "critical": 1,
    "total": 149,
    "items": [...]
  }

GET /api/v1/qr-codes/:id/health-history
  Query params: days (default 30)
  Response: {
    "history": [
      {"date": "2024-01-15", "status": "healthy", "response_time_ms": 234}
    ],
    "uptime_percentage": 99.7
  }

POST /api/v1/qr-codes/:id/health-check-now
  Trigger immediate health check

PUT /api/v1/qr-codes/:id/health-config
  Update health check settings
```

#### Frontend Components

1. **Health Status Badge** - Color-coded indicator on QR code list
2. **Health Dashboard** - Overview of all QR codes with filtering
3. **History Chart** - Line chart showing health over time
4. **Alert Settings** - Per-QR or workspace-wide configuration

### 4. Notification System

#### Alert Channels

| Channel | Priority | Use Case |
|---------|----------|----------|
| Email | All | Default notification |
| Slack | Warning+ | Team visibility |
| Webhook | Critical | Automated responses |
| In-app | All | Dashboard badges |
| SMS | Critical only | Urgent outages |

#### Alert Payload (Webhook)

```json
{
  "event": "qr.health.critical",
  "timestamp": "2024-01-15T10:30:00Z",
  "qr_code": {
    "id": "qr_123",
    "short_code": "abc123",
    "destination_url": "https://example.com/campaign",
    "workspace_id": "ws_456"
  },
  "health_check": {
    "status": "critical",
    "http_status": 404,
    "error_type": "http_error",
    "error_message": "Not Found",
    "checked_at": "2024-01-15T10:30:00Z"
  },
  "previous_status": "healthy",
  "status_changed_at": "2024-01-15T10:30:00Z"
}
```

### 5. Implementation Phases

#### Phase 1: Basic Health Checks (MVP - 2-3 days)
- [ ] Database schema for health checks
- [ ] HTTP status checker worker
- [ ] Daily scheduled job
- [ ] Basic health status in QR list API
- [ ] Health badge in QR code list UI

#### Phase 2: Dashboard & History (3-4 days)
- [ ] Health dashboard endpoint with stats
- [ ] History chart endpoint
- [ ] Frontend dashboard page
- [ ] Uptime percentage calculation

#### Phase 3: Alerts (2-3 days)
- [ ] Email notification templates
- [ ] Alert preference settings
- [ ] Slack webhook integration
- [ ] Status change detection & alerting

#### Phase 4: Advanced Checks (5-7 days)
- [ ] SSL certificate monitoring
- [ ] Content matching
- [ ] Redirect chain analysis
- [ ] Response time tracking & thresholds

## Business Value

### Pricing Strategy

| Plan | Health Monitoring |
|------|-------------------|
| Free | Basic status only (no alerts) |
| Starter | Daily checks, email alerts |
| Pro | Hourly checks, Slack + email |
| Enterprise | Real-time, all channels, API access |

### ROI for Users

- **Prevent campaign failures**: $X,000 saved per broken billboard/print run
- **Reduce manual checking**: 10+ hours/month for marketing teams
- **Brand protection**: Avoid QR hijacking or expired domain issues
- **Compliance**: SLA reporting for enterprise contracts

## Integration Points

### With Team Workspaces
- Workspace-wide health dashboard
- Shared alert channels per workspace
- Health SLA reporting for enterprise clients

### With Zapier
- Trigger: "QR Code Health Changed"
- Action: "Run Health Check Now"

### With API Platform
- `GET /api/v1/health` - List all QR health statuses
- Webhook events: `qr.health.changed`, `qr.health.critical`

## Open Questions

1. Should we cache health check results to reduce server load?
2. How to handle rate limiting from destination sites during checks?
3. Should we offer auto-redirect to backup URLs for critical failures?
4. Do we need geographic distributed checking (different locations may see different results)?
