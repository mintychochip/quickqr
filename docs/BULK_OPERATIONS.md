# Bulk QR Operations - Feature Research

## Overview
Research into bulk QR code creation and management features for quickqr. This would allow users to create, edit, and manage multiple QR codes simultaneously, saving time for power users and enterprise clients.

**Date Researched:** 2026-05-02

---

## Competitive Analysis

### Bitly
- Bulk link creation via CSV upload
- API supports batch operations (100 links per call)
- Bulk editing of link titles and tags
- No bulk QR generation specifically

### QRCode Monkey
- Bulk QR creation via CSV
- Supports up to 1000 QRs per batch
- Template-based bulk generation
- Limited post-creation bulk editing

### Scanova
- Bulk creation via spreadsheet upload
- Template system for consistent branding
- Bulk download as ZIP
- Pricing: $50/month for bulk features

### QR Tiger
- CSV/Excel bulk upload
- Up to 500 QRs per batch
- Bulk editing of destination URLs
- Analytics aggregation for bulk groups

---

## Key Feature Areas

### 1. Bulk Creation
- **CSV/Excel Upload:** Map columns to QR fields (URL, title, type, design)
- **Template-Based:** Apply saved templates to all created QRs
- **Dynamic Data:** Support for variables (serial numbers, dates, IDs)
- **Validation:** Pre-upload validation with error reporting
- **Preview:** Preview first 5 before full batch creation

### 2. Bulk Editing
- **Field Selection:** Choose which fields to update across selected QRs
- **Find & Replace:** Update URLs, titles, or metadata patterns
- **Category/Tag Management:** Add/remove tags in bulk
- **Status Changes:** Activate/pause/archive multiple QRs
- **Design Updates:** Apply new template to existing QRs

### 3. Bulk Operations
- **Export:** Download all data as CSV/Excel/JSON
- **Download:** Bulk download QR images (PNG/SVG) as ZIP
- **Delete:** Soft delete with confirmation
- **Move:** Transfer between workspaces/projects
- **Duplicate:** Clone existing QRs with modifications

### 4. Bulk Analytics
- **Aggregated Reports:** View combined stats for QR groups
- **Comparison:** Compare performance across bulk sets
- **Export Reports:** Download analytics as PDF/CSV

---

## Technical Implementation

### Database Schema

```sql
-- Bulk operations tracking
CREATE TABLE bulk_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    operation_type VARCHAR(50), -- 'create', 'update', 'delete'
    status VARCHAR(20), -- 'pending', 'processing', 'completed', 'failed'
    total_items INTEGER,
    processed_items INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    error_details JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Bulk operation items
CREATE TABLE bulk_operation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bulk_operation_id UUID REFERENCES bulk_operations(id),
    qr_id UUID REFERENCES qrs(id),
    status VARCHAR(20), -- 'pending', 'success', 'failed'
    error_message TEXT,
    input_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- QR groups for organizing bulk-created items
CREATE TABLE qr_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- QR to group mapping
CREATE TABLE qr_group_members (
    qr_id UUID REFERENCES qrs(id),
    group_id UUID REFERENCES qr_groups(id),
    added_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (qr_id, group_id)
);
```

### API Endpoints

```typescript
// Bulk creation
POST /api/v1/bulk/create
{
  "template_id": "uuid",
  "data_source": {
    "type": "csv" | "excel" | "json",
    "file_url": "string"
  },
  "mapping": {
    "url": "column_name",
    "title": "column_name",
    "tags": "column_name"
  },
  "options": {
    "skip_errors": boolean,
    "max_concurrent": number
  }
}

// Bulk update
PATCH /api/v1/bulk/update
{
  "qr_ids": ["uuid1", "uuid2"],
  "updates": {
    "title": "new title",
    "tags": ["add", "these"],
    "status": "active"
  }
}

// Bulk status check
GET /api/v1/bulk/:operation_id/status

// Bulk export
POST /api/v1/bulk/export
{
  "qr_ids": ["uuid1", "uuid2"],
  "format": "csv" | "excel" | "json",
  "include_analytics": boolean
}

// Download exported file
GET /api/v1/bulk/:operation_id/download
```

### Frontend Components

```typescript
// BulkUpload.tsx - CSV/Excel upload with preview
// BulkEditor.tsx - Multi-select grid for bulk editing
// BulkProgress.tsx - Real-time progress tracking
// BulkTemplates.tsx - Save/load bulk operation templates
// BulkAnalytics.tsx - Aggregated analytics view
```

### Processing Strategy

```typescript
// Background job processor (Bull/Redis)
interface BulkJobProcessor {
  // Process items in chunks to avoid overwhelming the system
  chunkSize: 50;
  
  // Progress tracking via WebSocket/SSE
  onProgress: (progress: BulkProgress) => void;
  
  // Error handling with partial success support
  onError: (item: BulkItem, error: Error) => void;
  
  // Continue processing even if some items fail
  skipErrors: boolean;
}
```

---

## Implementation Phases

### Phase 1: MVP (2-3 days)
- CSV upload for bulk creation
- Basic mapping interface (URL, title)
- Progress tracking
- Export as ZIP download
- Error reporting

### Phase 2: Enhanced Creation (3-4 days)
- Excel format support
- Template application during creation
- Validation rules (URL format checks)
- Preview first 10 before committing
- Duplicate detection

### Phase 3: Bulk Editing (4-5 days)
- Multi-select QR grid interface
- Bulk field updates
- Find & replace functionality
- Status changes (activate/pause)
- Tag management

### Phase 4: Advanced Features (4-5 days)
- QR groups/collections
- Scheduled bulk operations
- Bulk analytics aggregation
- API endpoints for bulk ops
- Webhook notifications for completion

**Total Estimated Time:** 13-17 days for full feature

---

## UI/UX Design

### Bulk Creation Flow
1. **Upload:** Drag-drop CSV/Excel or paste data
2. **Map:** Visual column-to-field mapping
3. **Preview:** Show first 5 QRs with sample data
4. **Process:** Background processing with progress bar
5. **Results:** Success/failure breakdown with download link

### Bulk Edit Interface
- Checkbox selection on QR grid
- "Edit Selected" floating action button
- Modal with field selection
- Preview changes before apply
- Undo support for recent bulk edits

---

## Business Considerations

### Pricing Strategy
- **Free Tier:** 10 QRs per batch max
- **Pro Tier ($10/mo):** 100 QRs per batch, CSV only
- **Business Tier ($30/mo):** 500 QRs per batch, Excel, templates
- **Enterprise:** Unlimited, API access, priority processing

### Competitive Differentiation
1. **Smart Templates:** Auto-apply best practices during bulk creation
2. **Real-time Preview:** See exactly what will be created before committing
3. **Undo Support:** Revert bulk operations within 24 hours
4. **Intelligent Validation:** Catch errors before processing starts
5. **Progress Persistence:** Resume interrupted bulk operations

---

## Open Questions

1. Should we support Google Sheets integration for live data sync?
2. What are the rate limiting considerations for bulk API operations?
3. How should we handle QR image storage for 1000+ bulk-created codes?
4. Should bulk operations be visible in audit logs?
5. What's the priority compared to other roadmap items?

---

## Related Documents
- See `TEAM_WORKSPACES.md` for workspace-based bulk organization
- See `API_DEVELOPER_PLATFORM.md` for bulk API design patterns
- See `ADVANCED_ANALYTICS.md` for bulk analytics reporting
