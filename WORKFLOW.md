# 🎮 Object Configuration Workflow

## Visual Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    ESCAPE ROOM BUILDER                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: Add Object to Canvas                                   │
│  ┌──────────────┐                                               │
│  │ Add Object ▼ │ ──> Select object type (KEY, LOCK, etc.)     │
│  └──────────────┘                                               │
│                                                                  │
│  Result: White object appears on canvas                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: Click Object on Canvas                                 │
│  ┌─────┐                                                        │
│  │ 🔑  │ ◄── Click here                                         │
│  └─────┘                                                        │
│                                                                  │
│  Trigger: handleObjectClick() → Opens modal                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: Configure Object Modal                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  ⚙️ Configure Object                                  [X] │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │  Question *                                               │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ What is the capital of France?                      │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  Correct Answer *                                         │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ Paris                                               │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  Hint (Optional)                                          │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ City of Light                                       │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  Points                                                   │ │
│  │  ┌────┐                                                  │ │
│  │  │ 50 │                                                  │ │
│  │  └────┘                                                  │ │
│  │                                                           │ │
│  │  [🗑️ Delete]         [Cancel]  [✓ Save]                  │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: Save Configuration                                     │
│                                                                  │
│  Action: handleSaveObjectConfig() → Updates state               │
│                                                                  │
│  Result: Object turns GREEN with checkmark badge ✓              │
│  ┌─────┐                                                        │
│  │ 🔑✓ │ ◄── Now configured                                    │
│  └─────┘                                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: Save Room to Database                                  │
│                                                                  │
│  Click [💾 Save Room] button                                    │
│                                                                  │
│  API Flow:                                                       │
│  1. POST /api/rooms → Create/Update room                        │
│  2. POST /api/rooms/${roomId}/objects → Save each object        │
│                                                                  │
│  Database: PostgreSQL (via Prisma)                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ RoomObject Table                                         │  │
│  ├────────┬──────┬────┬────┬──────────┬────────┬─────┬─────┤  │
│  │ roomId │ type │ x  │ y  │ question │ answer │hint │pts  │  │
│  ├────────┼──────┼────┼────┼──────────┼────────┼─────┼─────┤  │
│  │ abc123 │ KEY  │100 │150 │ What...  │ Paris  │City │ 50  │  │
│  └────────┴──────┴────┴────┴──────────┴────────┴─────┴─────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Data Flow

```
┌──────────────────┐
│ BuilderPage      │
│ (Parent)         │
└────────┬─────────┘
         │
         │ State Management:
         │ - objects[]
         │ - selectedObject
         │ - roomName, timer, theme
         │
         ├─────────────────────┐
         │                     │
         ▼                     ▼
┌──────────────────┐  ┌──────────────────────┐
│ BuilderCanvas    │  │ ObjectConfigModal    │
│                  │  │                      │
│ Props:           │  │ Props:               │
│ - objects[]      │  │ - objectId           │
│ - onObjectClick()│  │ - currentConfig      │
│ - onObjectMove() │  │ - onSave()           │
└──────────────────┘  │ - onDelete()         │
                      └──────────────────────┘

         │
         │ On Click:
         │ 1. setSelectedObject(obj)
         │ 2. Show Bootstrap Modal
         │
         ▼
┌──────────────────────────────────┐
│ Modal Opens                       │
│ - Pre-filled with object data    │
│ - User enters question/answer    │
│ - User clicks Save               │
└──────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ handleSaveObjectConfig()          │
│ - Updates objects[] state        │
│ - Object turns green             │
│ - Modal closes                   │
└──────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ handleSaveRoom()                  │
│ - Validates all objects          │
│ - POST to API endpoints          │
│ - Saves to PostgreSQL            │
└──────────────────────────────────┘
```

## Key Functions

### 1. **handleObjectClick**
```typescript
const handleObjectClick = (obj: RoomObject) => {
  setSelectedObject(obj);
  // Open Bootstrap modal
  const modal = new bootstrap.Modal(document.getElementById("objectConfigModal"));
  modal.show();
};
```

### 2. **handleSaveObjectConfig**
```typescript
const handleSaveObjectConfig = (config) => {
  setObjects(
    objects.map((obj) =>
      obj.id === selectedObject.id ? { ...obj, ...config } : obj
    )
  );
};
```

### 3. **handleSaveRoom**
```typescript
const handleSaveRoom = async () => {
  // 1. Validate objects have questions
  // 2. POST /api/rooms
  // 3. POST /api/rooms/${roomId}/objects for each object
};
```

## Visual Indicators

| State | Appearance | Badge |
|-------|------------|-------|
| Unconfigured | White background | ❌ None |
| Configured | Green background | ✅ Checkmark |
| Dragging | No background change | - |
| Hover | Cursor: grab | Tooltip |

---

**Component Files:**
- `app/builder/page.tsx` - Main logic
- `components/builder/BuilderCanvas.tsx` - Object rendering & click handling
- `components/builder/ObjectConfigModal.tsx` - Configuration form
- `app/api/rooms/[id]/objects/route.ts` - API endpoints
