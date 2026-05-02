# QR Studio Enhanced Branch Analysis

## Overview
Branch: `feature/qr-studio-enhanced`
Status: Unmerged, conflicts with master
Last Updated: April 8, 2026
Commits Ahead of Master: 2

## Commits

1. **cfa267e** - feat: add QR Studio with generate, scan, batch, and history
2. **9275c04** - feat: QR Studio with design templates and batch CSV variables

## Features in Branch

### Design Templates System
7 built-in templates with preset colors and styling:
- **Default**: White on black, rounded dots, square corners
- **Restaurant**: Teal (#14b8a6) on white, rounded dots, extra-rounded corners
- **Event**: Purple (#8b5cf6) on dark indigo (#1e1b4b), classy dots, extra-rounded corners
- **Minimal**: Dark gray (#1f2937) on light gray (#f9fafb), square everything
- **Bold**: Red (#dc2626) on white, dots style, extra-rounded corners
- **Neon**: Green (#00ff88) on near-black (#0a0a0f), rounded dots, extra-rounded corners
- **Gold**: Amber (#f59e0b) on dark gray (#1f1f1f), classy-rounded dots, extra-rounded corners

Template properties include:
- `fgColor`: Foreground/dot color
- `bgColor`: Background color  
- `dotType`: 'rounded' | 'square' | 'dots' | 'classy' | 'classy-rounded'
- `cornerType`: 'square' | 'rounded' | 'extra-rounded'

### Batch CSV Variables
- CSV file upload for bulk QR generation
- Variable substitution in QR content
- Download all generated QRs as zip

## Merge Conflicts with Master

### 1. astro.config.mjs
- **Master**: Has custom `fix-react-dom-server` plugin for SSR compatibility
- **Branch**: Has basic resolve.alias config only
- **Resolution**: Keep master's plugin configuration, add alias if needed

### 2. memory/proactive-strikes.json
- **Master**: Current proactive tracking (strikes: 0)
- **Branch**: Old state from April 7 (strikes: 1, task: "merge geolocation to master")
- **Resolution**: Keep master's current version

### 3. src/components/QRStudio.tsx
- **Master**: QR types include 'calendar' and 'event'
- **Branch**: QR types limited to 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard'
- **Resolution**: Keep master's full type set, merge template features

## Recommendation

**Status: DO NOT MERGE as-is**

The branch is stale (1 month old) and has significant conflicts. The features are valuable but need manual integration.

### Proposed Action Plan

1. **Evaluate Current QRStudio.tsx in Master**
   - Check if master already has template capabilities
   - Assess if batch CSV was implemented differently

2. **Manual Feature Port** (if features not in master)
   - Port design template system to current QRStudio.tsx
   - Port batch CSV functionality if not present
   - Preserve master's additional QR types ('calendar', 'event')
   - Preserve master's SSR plugin configuration

3. **Delete Branch** (after port or if obsolete)
   - Clean up stale branches to avoid confusion

## Estimated Work

- Manual merge/resolution: 2-3 hours
- Testing batch features: 1 hour
- Or: Delete branch and document features for future implementation: 15 minutes

## Decision Required

@mintychochip - Need decision on whether to:
- **A**: Spend time porting these features to master
- **B**: Delete the stale branch and document features for later
- **C**: Abandon the work (if features already exist in master in different form)
