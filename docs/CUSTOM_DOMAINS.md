# Custom Domains Feature Research

## Overview

Custom domains allow users to use their own branded domain for QR code short links instead of the default `q.is` domain. This is a critical enterprise feature that pairs naturally with Team Workspaces.

## Competitive Analysis

| Provider | Custom Domain Support | Pricing | Notes |
|----------|----------------------|---------|-------|
| **Bitly** | ✅ Yes | $199+/month (Premium plan) | Unlimited domains, SSL included |
| **Rebrandly** | ✅ Yes | $29-499/month | Domain management focus, DNS setup wizard |
| **QR Tiger** | ✅ Yes | $89+/month (Premium) | SSL auto-provisioned, up to 5 domains |
| **Scanova** | ✅ Yes | Enterprise only | Custom pricing, full white-label |
| **Short.io** | ✅ Yes | $19-149/month | Multiple domains per account |
| **Dub.co** | ✅ Yes | Free tier + paid | Open source, generous free tier |

## Key Findings

### Market Positioning
- **Entry tier** ($19-29/mo): 1 custom domain, basic SSL
- **Professional** ($49-89/mo): 3-5 domains, advanced DNS, team sharing
- **Enterprise** ($199+/mo): Unlimited domains, dedicated IP, SLA

### Technical Implementation

#### 1. DNS Configuration (User Side)
Users must configure a CNAME record pointing to our infrastructure:

```
qr.company.com → cname.quickqr.io
```

Or for root domains (A record):
```
company.com → 192.0.2.1
```

#### 2. SSL Certificate Provisioning
Options ranked by complexity:

| Approach | Complexity | Cost | User Experience |
|----------|-----------|------|-----------------|
| Let's Encrypt (automated) | Medium | Free | Seamless, 1-2 min delay |
| Cloudflare SSL | Low | $0-20/mo | Instant, requires Cloudflare |
| AWS ACM + ALB | High | ~$20/mo per domain | Complex, enterprise-grade |
| Manual upload | Low | $10-50/cert | Poor UX, expires management |

**Recommendation**: Let's Encrypt via cert-manager or similar, with Cloudflare as fallback for enterprise.

#### 3. Database Schema

```sql
-- New table: custom_domains
CREATE TABLE custom_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    domain VARCHAR(253) NOT NULL UNIQUE, -- max DNS label length
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, active, error, expired
    verification_token VARCHAR(64) NOT NULL, -- DNS TXT record for ownership
    ssl_status VARCHAR(20) DEFAULT 'pending', -- pending, provisioning, active, error
    ssl_certificate_path TEXT, -- path to cert files or ACM ARN
    ssl_expires_at TIMESTAMP,
    redirect_mode VARCHAR(20) DEFAULT 'proxy', -- proxy, redirect, 404
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- New table: domain_dns_checks (for tracking verification)
CREATE TABLE domain_dns_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID REFERENCES custom_domains(id) ON DELETE CASCADE,
    check_type VARCHAR(20) NOT NULL, -- cname, txt, a
    passed BOOLEAN NOT NULL,
    actual_value TEXT,
    expected_value TEXT,
    checked_at TIMESTAMP DEFAULT NOW()
);

-- Index for lookups
CREATE INDEX idx_custom_domains_domain ON custom_domains(domain);
CREATE INDEX idx_custom_domains_workspace ON custom_domains(workspace_id);

-- Modify links table to support custom domains
ALTER TABLE links ADD COLUMN custom_domain_id UUID REFERENCES custom_domains(id);
ALTER TABLE links ADD COLUMN short_path VARCHAR(50); -- override for custom domain (e.g., "sale" instead of "abc123")
```

#### 4. Request Flow Architecture

```
User scans QR → qr.company.com/abc123

Cloudflare/Edge Worker:
  ↓
Lookup domain (qr.company.com) in KV/cache
  ↓
Fetch link from API using (domain_id + short_code)
  ↓
Return 302 redirect to destination
```

#### 5. Required API Endpoints

**Domain Management (new)**
- `POST /api/v1/workspaces/:id/domains` - Add custom domain
- `GET /api/v1/workspaces/:id/domains` - List domains
- `GET /api/v1/workspaces/:id/domains/:id` - Get domain details
- `DELETE /api/v1/workspaces/:id/domains/:id` - Remove domain
- `POST /api/v1/workspaces/:id/domains/:id/verify` - Trigger DNS verification
- `GET /api/v1/workspaces/:id/domains/:id/dns-records` - Get required DNS records

**Link Creation (modification)**
- Add `custom_domain_id` and `short_path` to existing link creation endpoints
- Validate short_path uniqueness per domain

#### 6. Frontend Components Needed

1. **Domain Setup Wizard**
   - Step 1: Enter domain name
   - Step 2: Show DNS records to configure (CNAME/TXT)
   - Step 3: Verify propagation (poll DNS)
   - Step 4: SSL provisioning status
   - Step 5: Test & activate

2. **Domain Management Dashboard**
   - List all domains with status badges
   - SSL expiry warnings
   - Quick actions (verify, delete, test)
   - DNS record reference

3. **Link Creation Flow Update**
   - Domain selector dropdown (default → custom domains)
   - Short path customization (optional vanity URLs)

## Implementation Phases

### Phase 1: MVP (3-4 days)
- Database schema + migrations
- Basic domain CRUD API
- Simple DNS TXT verification
- SSL via Let's Encrypt (manual or semi-automated)
- Frontend: basic domain list + add form
- Edge: wildcard fallback for unconfigured domains

### Phase 2: Production-Ready (5-7 additional days)
- Automated SSL provisioning/renewal
- Real-time DNS propagation checking
- Domain setup wizard UI
- Link creation with custom domain selection
- Health monitoring for SSL expiry
- Rate limiting on domain additions

### Phase 3: Enterprise Features (3-4 days)
- Multiple domains per workspace
- Root domain support (A record)
- Custom redirect rules (404 page, path forwarding)
- Domain activity logs
- Bulk domain import

## Integration Points

### With Team Workspaces
- Domains are workspace-scoped (not user-scoped)
- Workspace owners/admins can add domains
- Domain usage counts toward workspace limits

### With Zapier Integration
- "Custom Domain Added" trigger
- Action to create link with specific domain

### With API Platform
- Domain management endpoints in public API
- Domain-scoped API keys (enterprise feature)

## Pricing Recommendations

| Tier | Domains | SSL | Price Point |
|------|---------|-----|-------------|
| Free | 0 | - | $0 |
| Starter | 1 | Auto SSL | $19/mo |
| Professional | 3 | Auto SSL | $49/mo |
| Enterprise | Unlimited | Custom certs + dedicated IP | Custom |

## Security Considerations

1. **Domain verification**: Must verify ownership via DNS TXT record before activating
2. **SSL security**: Auto-renewal must handle failures gracefully
3. **Subdomain takeover**: Monitor for expired domains pointing to us
4. **Rate limiting**: Prevent abuse of free SSL generation
5. **Phishing protection**: Consider domain reputation checking

## Open Questions

1. Should we support wildcard certificates (*.company.com)?
2. Do we need geographic load balancing for edge nodes?
3. Should custom domain links have separate analytics views?
4. How do we handle domain migration (user changes domains)?

## Related Documents

- [TEAM_WORKSPACES.md](./TEAM_WORKSPACES.md) - Workspace scoping context
- [API_DEVELOPER_PLATFORM.md](./API_DEVELOPER_PLATFORM.md) - API design patterns
- [ZAPIER_INTEGRATIONS.md](./ZAPIER_INTEGRATIONS.md) - Automation triggers

---

*Research conducted: May 2, 2026*
*Estimated MVP scope: 3-4 days*
*Full feature scope: 10-14 days*
