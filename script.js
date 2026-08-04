//Global Variables to store data
let posts = []; // Array to store posts
//Select all necessary DOM elements
let newPostForm = document.getElementById('post-form');
let titleInput = document.getElementById('post-title');
let contentInput = document.getElementById('post-content');
let recentPostsContainer = document.querySelector('.recent-posts');
let titleError = document.getElementById('titleError');
let contentError = document.getElementById('contentError');
let titleRecentPosts = document.getElementById('title-recent-posts');
let editingPostId = null; // Variable to store the ID of the post being edited



//load posts from local storage when the page loads
window.addEventListener('load', () => {
    // Retrieve posts from local storage
    let storedPosts = localStorage.getItem('posts');
    // If there are stored posts, parse them and display them
    if (storedPosts) {
        posts = JSON.parse(storedPosts);
        displayPosts(posts);
    }
});

//Adding a new post when the form is submitted
newPostForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the form from submitting normally
    let title = titleInput.value.trim();
    let content = contentInput.value.trim();

    // 1. Re-run title validation
    let isTitleValid = true;
    if (title === '') {
        titleError.textContent = 'Title is required';
        isTitleValid = false;
    } else if (title.length < 5) {
        titleError.textContent = 'Title must be at least 5 characters long';
        isTitleValid = false;
    } else if (title.length > 200) {
        titleError.textContent = 'Title must be no more than 200 characters long';
        isTitleValid = false;
    } else {
        titleError.textContent = '';
    }
    // 2. Re-run content validation
    let isContentValid = true;
    if (content === '') {
        contentError.textContent = 'Content is required';
        isContentValid = false;
    } else if (content.length < 10) {
        contentError.textContent = 'Content must be at least 10 characters long';
        isContentValid = false;
    } else if (content.length > 1000) {
        contentError.textContent = 'Content must be no more than 1000 characters long';
        isContentValid = false;
    } else {
        contentError.textContent = '';
    }
    // 3. Stop submission if anything is invalid
    if (!isTitleValid || !isContentValid) {
        return;
    }
    // 4. Proceed with submitting the valid data!
    if (editingPostId) {
        let postToEdit = posts.find(p => p.id === editingPostId);
        if (postToEdit) {
            postToEdit.title = title;
            postToEdit.content = content;
            savePostsToLocalStorage();
            displayPosts(posts);
        }
        editingPostId = null;
        newPostForm.reset();
    } else {
        addPost(title, content);
    }
});

//Real-time validation for title and content inputs
titleInput.addEventListener('input', () => {
    if (titleInput.value.trim() === '') {
        titleError.textContent = 'Title is required';
    } else if (titleInput.value.trim().length < 5) {
        titleError.textContent = 'Title must be at least 5 characters long';
    } else if (titleInput.value.trim().length > 200) {
        titleError.textContent = 'Title must be no more than 200 characters long';
    } else {
        titleError.textContent = '';
    }
});
//Real-time validation for content input
contentInput.addEventListener('input', () => {
    if (contentInput.value.trim() === '') {
        contentError.textContent = 'Content is required';
    } else if (contentInput.value.trim().length < 10) {
        contentError.textContent = 'Content must be at least 10 characters long';
    } else if (contentInput.value.trim().length > 1000) {
        contentError.textContent = 'Content must be no more than 1000 characters long';
    } else {
        contentError.textContent = '';
    }
});

//Function to add a new post (add the new post to the array, saves to local storage and updates the display)
function addPost(title, content) {
    let post = {
        id: crypto.randomUUID(), // Generate a unique ID for each post
        title: title,
        content: content,
        timestamp: new Date().toISOString(), // Store the timestamp of when the post was created
    };
    posts.push(post);
    savePostsToLocalStorage();
    displayPosts(posts);
    newPostForm.reset();
}

//save the post to local storage converting the posts array to a JSON string and storing it in local storage
function savePostsToLocalStorage() {
    localStorage.setItem('posts', JSON.stringify(posts));
}

//Render Posts Function:
function displayPosts(postsToDisplay = posts) {
    //check if there are no posts and display a message if so
    if (posts.length === 0) {
        titleRecentPosts.textContent = 'No posts available';
    } else {
        titleRecentPosts.textContent = `You have ${posts.length} post${posts.length > 1 ? 's' : ''} in your blog`;
    }
    
    recentPostsContainer.innerHTML = ''; // Clear existing posts
    // Render each post
    postsToDisplay.forEach((post) => {
        let postElement = document.createElement('div'); // Create a new post element
        postElement.classList.add('post'); // Add a class for styling
        // Add Bootstrap classes for styling
        postElement.classList.add('card'); 
        postElement.classList.add('mb-3'); 
        postElement.dataset.postId = post.id;
        postElement.innerHTML = `
            <div class="card-header">${post.title}</div>
            <div class="card-body">${post.content}</div>
            <div class="card-footer d-flex justify-content-end">
                <button class="btn btn-danger btn-sm delete-post me-2">Delete</button>
                <button class="btn btn-primary btn-sm edit-post me-2 px-3">Edit</button>
            </div>
        `;
        //display the post at the top of the recent posts container
        recentPostsContainer.prepend(postElement);
    });
}


//deleting a post by event delegation
//add an event listener to the recentPostsContainer to listen for clicks on delete buttons
recentPostsContainer.addEventListener('click', (event) => {
    //check if the clicked element is a delete button by checking if it has the class 'delete-post'
    if (event.target.classList.contains('delete-post')) {
        //if it is, get the ID of the post to delete
        let postId = event.target.closest('.post').dataset.postId;
        //call the deletePost function with the ID
        deletePost(postId);
    }
});

//function to delete a post from the posts array, save the updated array to local storage, and update the display
function deletePost(postId) {
    //filter the posts array to remove the post with the given ID
    posts = posts.filter(post => post.id !== postId);
    savePostsToLocalStorage();
    displayPosts(posts);
}

//editing a post by event delegation
//add an event listener to the recentPostsContainer to listen for clicks on edit buttons
recentPostsContainer.addEventListener('click', (event) => {
    //check if the clicked element is an edit button by checking if it has the class 'edit-post'
    if (event.target.classList.contains('edit-post')) {
        //if it is, get the ID of the post to edit
        let postId = event.target.closest('.post').dataset.postId;
        //call the editPost function with the ID
        editPost(postId);
    }
});

//function to edit a post by finding the post in the posts array, populating the form with its data, and setting the editingPostId variable
function editPost(postId) {
    //find the post in the posts array with the given ID
    let postToEdit = posts.find(post => post.id === postId);
    //if the post is found, populate the form with its data and set the editingPostId variable
    let postAction = document.getElementById('post-action');
    //if the post is found, populate the form with its data and set the editingPostId variable
    if (postToEdit) {
        titleInput.value = postToEdit.title;
        contentInput.value = postToEdit.content;
        editingPostId = postId;
        postAction.textContent = 'Edit';
    }
}
