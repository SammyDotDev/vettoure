# Design Brief: Owner Dashboard Flow

## Problem
Property owners lack a centralized, efficient, and aesthetically pleasing interface to manage their property listings, track incoming inspection requests, and understand overall property performance at a glance. They need a tool that feels professional and responsive on both mobile and desktop.

## Solution
A highly functional, minimalist dashboard experience for property owners. The interface provides a bird's-eye view of listings and requests through quick stats, while offering direct, actionable lists for managing properties and inspection requests. A "New Listing" form is embedded directly into the desktop dashboard for rapid entry.

## Experience Principles
1. **Clarity over Density** -- Use generous whitespace and distinct typography (mixing sans and mono) to separate functional areas, ensuring the owner can digest information quickly without feeling overwhelmed.
2. **Action-Oriented** -- Primary actions (like confirming/rescheduling requests or adding a listing) should be prominent, requiring minimal clicks to accomplish.
3. **Responsive Focus** -- The mobile experience should prioritize immediate triage (requests first, then properties), while the desktop experience leverages screen real estate to show all sections simultaneously in a multi-column layout.

## Aesthetic Direction
- **Philosophy**: Dieter Rams (Functionalist) meets Swiss Typographic. Clean, rigid grid, high contrast, typography-led hierarchy.
- **Tone**: Professional, direct, efficient, calm.
- **Reference points**: Minimalist high-end real estate platforms, modern developer tools (Vercel, Linear), Swiss design posters (for the mono section headers).
- **Anti-references**: Cluttered legacy CRM systems, overly colorful consumer apps, generic Bootstrap admin templates.

## Existing Patterns
- Typography: `Plus Jakarta Sans` for body/headings, `JetBrains Mono` for section labels (e.g. `// INCOMING REQUESTS`).
- Colors: `globals.css` defines a primary color `#0f3d2e` (dark green). The sidebar in the design is very dark, likely using this primary color or a dark slate variant. Backgrounds use light gray `oklch(0.985 0 0)` for the wrapper and pure white for cards.
- Spacing: Tailwind default scale, rounded corners defined by `--radius` tokens (0.875rem).
- Components: Shadcn UI is installed. We have a `Sidebar` component which needs customization to match the dark theme in the design. Buttons, Inputs, Labels exist in `components/ui`.

## Component Inventory
| Component | Status | Notes |
| --------- | ------ | ----- |
| `AppSidebar` | Modify | Update to dark theme, new navigation items, bottom user profile |
| `StatCard` | New | Rounded light-gray box with large number and small label |
| `StatusBadge` | New | Small pill with specific background/text colors for NEW, CONFIRMED, PENDING, LIVE, DRAFT |
| `RequestItem` | New | Avatar, name, property details, time, status badge, action buttons |
| `PropertyItem` | New | Image placeholder, title, price, status badge |
| `NewListingForm` | New | Inputs for title, area, price, Buy/Rent toggle, drag-drop video area |
| `SectionHeader` | New | Monospace text with `//` prefix |

## Key Interactions
- **Confirm/Reschedule**: Action buttons on request items. (Will use dummy handlers for now).
- **Buy/Rent Toggle**: A segmented control in the New Listing form.
- **Video Upload Area**: Drag and drop zone with hover state.

## Responsive Behavior
- **Mobile (< 768px)**: Top navigation with logo and avatar. Greeting ("Hello, Name"). Stat cards in a 2-col grid. Full width "+ New listing" button. Stacked sections: Requests -> Properties.
- **Desktop (>= 768px)**: Dark left sidebar. Main content in a rounded white card over a light gray body background. Header with "Overview" and button. Stats in a 4-col row. 2-column content layout (Properties + Form on left, Requests on right).

## Accessibility Requirements
- High contrast for text.
- Keyboard navigable lists and forms.
- Screen reader friendly labels for buttons and inputs.

## Out of Scope
- Actual backend integration (Supabase calls) - using dummy data.
- Full functionality of the Drag & Drop area (just visual for now).
- Deep linking to individual property pages or detailed request views.
