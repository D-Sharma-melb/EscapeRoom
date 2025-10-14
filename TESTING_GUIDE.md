# 🧪 Escape Room Builder - Testing Guide

## ✅ Testing Object Configuration

### Prerequisites
1. Make sure Docker is running: `docker compose up -d`
2. Start the development server: `npm run dev`
3. Sign in to the Builder page

### Step-by-Step Testing

#### 1. **Add Objects to Canvas**
   - Click the "Add Object" dropdown
   - Select an object type (KEY, LOCK, DOOR, CHEST, PUZZLE, CODE)
   - Object should appear on the canvas with a white background

#### 2. **Configure an Object**
   - Click on any object on the canvas
   - A modal should appear with the title "Configure Object"
   - Fill in the following fields:
     - **Question**: "What is the capital of France?"
     - **Correct Answer**: "Paris"
     - **Hint**: "It's known as the City of Light" (optional)
     - **Points**: 50
   - Click "Save"

#### 3. **Visual Confirmation**
   - After saving, the object should:
     - Have a green tinted background
     - Show a green checkmark badge at the top-right corner
     - Show tooltip "Configured ✓" on hover

#### 4. **Edit Configuration**
   - Click the same object again
   - The modal should open with your previously saved data
   - Modify any field and save
   - Changes should persist

#### 5. **Delete Object**
   - Click on an object
   - In the modal, click the red "Delete" button
   - Object should be removed from the canvas

#### 6. **Drag Objects**
   - Click and hold an object
   - Drag it to a new position
   - Release to place it
   - Note: Modal should only open on click, not after dragging

#### 7. **Save Room**
   - Configure at least 2-3 objects with questions
   - Click "Room Details" button
   - Enter room name and description
   - Click "Save Room" button at the bottom
   - You should see "Room saved successfully! ✅"

#### 8. **Verify in Database**
   - Objects should be saved in the PostgreSQL database
   - Check using Prisma Studio: `npx prisma studio`
   - Navigate to "RoomObject" table
   - You should see your configured objects with:
     - roomId
     - type
     - x, y positions
     - question, correctAnswer, hint, points

## 🐛 Common Issues & Solutions

### Issue: Modal doesn't open when clicking object
**Solution**: Refresh the page to ensure Bootstrap JavaScript is loaded

### Issue: Objects don't show green after configuration
**Solution**: Make sure you entered a question and correct answer, then clicked Save

### Issue: Dragging opens the modal
**Solution**: This is now fixed - modal only opens on click, not after drag

### Issue: Configuration doesn't persist
**Solution**: Check browser console for errors, ensure the state is updating correctly

## 📊 Expected Behavior Summary

| Action | Expected Result |
|--------|----------------|
| Add object | White icon appears on canvas |
| Click object | Modal opens with configuration form |
| Save config with data | Object turns green with checkmark badge |
| Drag object | Position updates, modal doesn't open |
| Delete object | Object removed from canvas |
| Save room | All objects saved to database via API |

## 🔍 API Endpoints Used

- **POST** `/api/rooms/${roomId}/objects` - Creates object in database
- **GET** `/api/rooms/${roomId}/objects` - Retrieves objects for a room
- **DELETE** `/api/rooms/${roomId}/objects` - Deletes all objects for a room

## ✨ Visual Indicators

- **White background**: Unconfigured object
- **Green background + checkmark**: Configured object
- **Tooltip on hover**: Shows object type and configuration status
- **Cursor**: Changes to "grab" when hovering over objects

---

**Last Updated**: October 14, 2025
