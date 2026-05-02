# Team Workspaces Research Document

## Executive Summary

Team Workspaces is a collaboration feature enabling multiple users to share QR codes, collaborate on campaigns, and manage permissions within an organization. This document outlines the feature design, technical architecture, and implementation roadmap.

## Market Analysis

### Competitor Landscape

| Competitor | Team Features | Pricing Model | Notes |
|------------|---------------|---------------|-------|
| **Bitly** | Workspaces, roles, SSO | $199+/mo for teams | Enterprise-focused, limited free tier |
| **QR Tiger** | Multi-user, permissions | $89+/mo for teams | Good mid-market option |
| **Scanova** | Teams, shared assets | Custom enterprise pricing | Heavy focus on enterprise |
| **QRCode Monkey** | No team features | N/A | Individual use only |
| **Flowcode** | Teams, analytics sharing | $250+/mo for teams | Expensive, feature-rich |

### Gap Analysis

Most competitors either:
- Are too expensive for small teams ($89-250+/mo minimum)
- Lack granular permissions (all-or-nothing access)
- Don't integrate workspace context with API/webhooks
- Missing role templates for common use cases

**QuickQR opportunity**: Affordable team workspaces ($19-49/mo) with API-first design and Zapier integration for workspace-scoped operations.

## Feature Design

### Core Concepts

```
Organization (billing entity)
  └── Workspace (project/department context)
      ├── QR Codes (owned by workspace, not user)
      ├── Analytics (aggregate + per-member)
      ├── Settings (workspace-level defaults)
      └── Members (with roles)
```

### User Roles

| Role | Permissions | Use Case |
|------|-------------|----------|
| **Owner** | Full control, billing, delete workspace | Founder, admin |
| **Admin** | Manage members, all QR codes, settings | Team lead |
| **Editor** | Create/edit QR codes, view analytics | Marketing manager |
| **Viewer** | View QR codes and analytics, no edit | Stakeholder, client |
| **API** | API key access only, limited to workspace scope | Service accounts |

### Key Features

1. **Workspace Switching**
   - Personal workspace (default, free forever)
   - Join multiple workspaces
   - Quick switcher UI
   - Workspace-specific branding

2. **Shared Assets**
   - QR codes live in workspace context
   - Shared UTM templates
   - Shared domain configurations
   - Shared pixel/tracking IDs

3. **Collaboration**
   - Activity log (who created/modified what)
   - Real-time presence indicators
   - Comment threads on QR codes
   - @mentions for notifications

4. **Access Control**
   - Role-based permissions
   - IP allowlisting (enterprise)
   - SSO/SAML (enterprise tier)
   - API key scoping by workspace

5. **Billing**
   - Per-workspace billing or organization-level
   - Seat-based pricing
   - Usage pooling across workspace

## Technical Architecture

### Database Schema

```sql
-- Organizations (billing entities)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    billing_email VARCHAR(255),
    subscription_tier VARCHAR(50), -- free, starter, pro, enterprise
    subscription_status VARCHAR(50), -- active, past_due, canceled
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Workspaces (project contexts)
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    settings JSONB DEFAULT '{}',
    branding JSONB DEFAULT '{}', -- colors, logo, custom domain
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(organization_id, slug)
);

-- Workspace Memberships
CREATE TABLE workspace_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- owner, admin, editor, viewer
    invited_by UUID REFERENCES users(id),
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);

-- Organization Memberships (for cross-workspace admins)
CREATE TABLE organization_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- owner, admin, member
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- Invitations (pending joins)
CREATE TABLE workspace_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    invited_by UUID REFERENCES users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Activity Log
CREATE TABLE workspace_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL, -- qr.created, qr.updated, member.joined
    entity_type VARCHAR(50), -- qr_code, workspace, member
    entity_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Modify existing qr_codes table
ALTER TABLE qr_codes ADD COLUMN workspace_id UUID REFERENCES workspaces(id);
ALTER TABLE qr_codes ADD COLUMN created_by UUID REFERENCES users(id);
-- Migrate: personal workspace for existing users, then assign their QR codes
```

### API Endpoints

```typescript
// Workspace Management
GET    /api/v1/workspaces                    // List my workspaces
POST   /api/v1/workspaces                    // Create workspace
GET    /api/v1/workspaces/:id                // Get workspace details
PATCH  /api/v1/workspaces/:id                // Update workspace
DELETE /api/v1/workspaces/:id                // Delete workspace (owner only)

// Members
GET    /api/v1/workspaces/:id/members         // List members
POST   /api/v1/workspaces/:id/invitations     // Invite by email
POST   /api/v1/workspaces/:id/members/:userId // Add member directly (existing user)
PATCH  /api/v1/workspaces/:id/members/:userId // Update role
DELETE /api/v1/workspaces/:id/members/:userId // Remove member

// Invitations
POST   /api/v1/invitations/:token/accept      // Accept invitation
DELETE /api/v1/invitations/:token             // Revoke/cancel invitation

// Activity
GET    /api/v1/workspaces/:id/activity        // Activity log (paginated)

// Scoped QR Operations (existing endpoints, workspace-scoped)
GET    /api/v1/workspaces/:id/qr-codes        // List workspace QR codes
POST   /api/v1/workspaces/:id/qr-codes      // Create in workspace
// ... all existing QR operations with workspace context

// Switching
POST   /api/v1/workspaces/:id/switch          // Set as active workspace (for session)
```

### Frontend Changes

```typescript
// New components needed:
- WorkspaceSwitcher       // Dropdown to switch between workspaces
- WorkspaceSettings     // Manage workspace details
- MembersManager        // Invite, roles, remove members
- ActivityFeed          // Recent workspace activity
- InvitationAccept      // Landing page for invite links
- OnboardingFlow        // First workspace creation

// Modified components:
- QRCodeList            // Filter by workspace, show creator
- CreateQR              // Default to active workspace
- Navigation            // Add workspace switcher
- UserMenu              // Add workspace management link
```

### Permission System

```typescript
// Permission matrix
const PERMISSIONS = {
  qr: {
    create: ['owner', 'admin', 'editor'],
    read:   ['owner', 'admin', 'editor', 'viewer'],
    update: ['owner', 'admin', 'editor'],
    delete: ['owner', 'admin'],
  },
  workspace: {
    update:   ['owner', 'admin'],
    delete:   ['owner'],
    invite:   ['owner', 'admin'],
    billing:  ['owner'],
  },
  analytics: {
    read: ['owner', 'admin', 'editor', 'viewer'],
    export: ['owner', 'admin', 'editor'],
  },
  members: {
    list:   ['owner', 'admin', 'editor'],
    update: ['owner', 'admin'],
    remove: ['owner', 'admin'],
  }
};

// Middleware implementation
function requirePermission(resource: string, action: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { workspaceId } = req.params;
    const userId = req.user.id;
    
    const membership = await getMembership(workspaceId, userId);
    if (!membership) throw new ForbiddenError();
    
    const allowed = PERMISSIONS[resource][action].includes(membership.role);
    if (!allowed) throw new ForbiddenError();
    
    req.workspace = membership;
    next();
  };
}
```

## Integration Points

### With Existing Features

| Feature | Workspace Integration |
|---------|----------------------|
| **Analytics** | Aggregate across workspace, filter by member, compare workspace vs personal |
| **Webhooks** | Subscribe to workspace-level events, workspace-scoped payloads |
| **Pixels** | Shared pixel configurations per workspace |
| **UTM Templates** | Workspace-default UTM templates |
| **Scan Limits** | Per-workspace or pooled across organization |
| **API Keys** | Scoped to workspace, separate rate limits |
| **Zapier** | Trigger on workspace events, actions scoped to workspace |

### Zapier Integration (Extends Existing Research)

New triggers:
- `New Member Joined` — When someone accepts workspace invite
- `Member Role Changed` — When permissions updated
- `Workspace Activity` — Generic activity stream trigger

New actions:
- `Create Workspace` — Programmatic workspace creation
- `Invite Member` — Add user to workspace
- `Switch Workspace` — Change active context

### API Integration (Extends Existing Research)

All existing endpoints gain workspace scoping:
```
X-Workspace-ID: <workspace-id>  // Header for API requests
?workspace_id=<id>             // Query parameter alternative
```

Response includes:
```json
{
  "data": [...],
  "meta": {
    "workspace": {
      "id": "...",
      "name": "Marketing Team",
      "role": "editor"
    }
  }
}
```

## Pricing Strategy

### Tiers

| Tier | Price | Workspaces | Members/WS | Features |
|------|-------|------------|------------|----------|
| **Free** | $0 | 1 (personal only) | 1 | Personal use only |
| **Starter** | $19/mo | 3 | 5 | Basic collaboration, shared analytics |
| **Pro** | $49/mo | 10 | 20 | Advanced roles, API workspace scoping, webhooks |
| **Enterprise** | Custom | Unlimited | Unlimited | SSO, audit logs, custom contracts |

### Migration Strategy

Existing users (freemium):
- Auto-create personal workspace
- All existing QR codes moved to personal workspace
- Zero disruption, opt-in to upgrade

## Implementation Roadmap

### Phase 1: Foundation (Days 1-2)
- [ ] Database migrations (organizations, workspaces, memberships)
- [ ] Personal workspace auto-creation for existing users
- [ ] Workspace context middleware
- [ ] Update all QR queries to include workspace_id

### Phase 2: Core API (Days 3-4)
- [ ] Workspace CRUD endpoints
- [ ] Member invitation system
- [ ] Permission middleware
- [ ] Activity logging

### Phase 3: Frontend (Days 5-6)
- [ ] Workspace switcher component
- [ ] Settings page
- [ ] Members management UI
- [ ] Activity feed

### Phase 4: Integration (Days 7-8)
- [ ] Update QR list/create flows with workspace context
- [ ] Analytics filtering by workspace
- [ ] Webhook workspace scoping
- [ ] API key workspace binding

### Phase 5: Polish (Days 9-10)
- [ ] Onboarding flow
- [ ] Email templates for invitations
- [ ] Documentation
- [ ] Testing & bug fixes

**Total Estimate: 10 days for full feature**

**MVP Scope (5 days):**
- Database + personal workspace migration
- Basic workspace CRUD
- Simple member invitations (email only)
- Two roles: admin + editor
- Workspace-scoped QR codes only

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Data migration issues | Medium | High | Test migration on copy, rollback plan |
| Permission bugs | Medium | High | Comprehensive test suite, audit logging |
| Performance on large workspaces | Low | Medium | Pagination, query optimization, caching |
| User confusion (where are my QRs?) | Medium | Medium | Clear messaging, migration guide, support docs |
| Billing complexity | Low | High | Stripe customer portal, clear invoices |

## Success Metrics

- **Adoption**: 20% of active users create or join a workspace within 30 days
- **Engagement**: 3+ workspace members active weekly
- **Revenue**: 10% of workspaces convert to paid tier
- **Retention**: Workspace users have 2x higher retention than solo users
- **API Usage**: 50% of API calls include workspace context within 60 days

## Open Questions

1. Should personal workspaces be convertable to team workspaces?
2. How handle QR code ownership when member leaves? (Transfer vs archive)
3. Real-time collaboration needed immediately or can be v2?
4. Should we support workspace templates (e.g., "Marketing Campaign", "Event Planning")?

## Related Documents

- [ZAPIER_INTEGRATIONS.md](./ZAPIER_INTEGRATIONS.md) — Zapier integration design
- [API_DEVELOPER_PLATFORM.md](./API_DEVELOPER_PLATFORM.md) — API architecture

---

**Document Status**: Draft v1.0
**Last Updated**: 2026-05-02
**Author**: proactive-dev agent
