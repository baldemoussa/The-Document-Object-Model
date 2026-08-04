# SBA The Document Object Model
## By Mamadou Moussa Balde

### Project Description
This is an Interactive Personal Blog Platform built with HTML, CSS (with Bootstrap 5), and vanilla JavaScript. The application allows users to create, read, update, and delete (CRUD) blog posts seamlessly on a single page. All data is saved persistently in the browser using Local Storage, ensuring that posts remain available even after refreshing the page.

### Instructions to Run
1. No backend server or complex environment setup is required.
2. Simply clone or download the repository files.
3. Open the `index.html` file in any modern web browser to start using the application.

### Development Process & Reflection
**Process:**
- Structured the application with HTML5 tags and Bootstrap for responsive styling and a clean UI.
- Used vanilla JavaScript to handle DOM manipulation, form event listeners, and data persistence via the `localStorage` API.
- Implemented **Event Delegation** on the recent posts container to efficiently manage "Edit" and "Delete" actions on dynamically created post elements.
- Created real-time form validation to provide immediate feedback to the user on title (5-200 characters) and content (10-1000 characters) requirements before form submission.

**Challenges & Solutions:**
- **Challenge:** Differentiating between creating a new post and editing an existing one using the same form.
  **Solution:** I introduced a global variable `editingPostId` to track the form's state. If an ID is present, the form submission updates the corresponding post object in the `posts` array; if it is `null`, it creates a brand new post.
- **Challenge:** Managing event listeners for dynamically added DOM elements (like delete and edit buttons).
  **Solution:** I utilized event delegation by attaching a single click event listener to the parent container (`.recent-posts`). This catches clicks on any dynamically generated buttons, making the code more efficient and robust.

### Known Issues & Future Features
- **Storage Limitations:** Data is stored strictly in the browser's `localStorage`, meaning posts are device/browser-specific and will be lost if the browser's data/cache is cleared.
- **Lack of Backend:** Currently, there is no database or user authentication system.
- **Future Enhancements:** Future plans could include adding image uploads, rich text editing functionality, pagination for displaying a large number of posts, and integrating a backend database for cross-device access.