import bodyParser from "body-parser";
import express from "express";

const app = express();
const port = 3000;

// Array to store blog titles
var blogTitles = [];
var blogPosts = [];
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    // Pass the entire array of titles to the EJS file
    res.render("index.ejs", { blogTitles: blogTitles });
});

app.post("/submit", (req, res) => {
    const title = req.body["title"];
    const essay = req.body["blogContent"];
    
    // Add the new title to the array
    blogTitles.push(title);
    blogPosts.push(essay);

    // Render the index page with the updated list of titles
    res.render("index.ejs", {
        blogTitles: blogTitles 
    });
});

// send the user to each indivual post

app.get("/post/:postId", (req, res) => {
    const postId = parseInt(req.params.postId, 10);

    // Check if the requested post exists based on the shared index
    if (postId >= 0 && postId < blogTitles.length) {
        const title = blogTitles[postId];
        const content = blogPosts[postId];
        // Render a page to display the title and content of the blog post
        res.render("content.ejs", {
            title: title,  // Changed from blogTitles to title
            content: content, // Changed from blogPosts to content
            postId: postId,
        });
        
    } else {
        // If the post doesn't exist, send a 404 response
        res.status(404).send("Post not found.");
    }
});

app.post("/delete-post", (req, res) => {
    const postId = parseInt(req.body.postId, 10);
    if (postId >= 0 && postId < blogTitles.length) {
        blogTitles.splice(postId, 1);
        blogPosts.splice(postId, 1);
        res.redirect("/");
    } else {
        res.status(404).send("Post not found.");
    }
});

app.post("/edit-post", (req, res) => {
    const postId = parseInt(req.body.postId, 10);
    if (postId >= 0 && postId < blogTitles.length) {
        res.render("content-edit.ejs", {
            title: blogTitles[postId],
            content: blogPosts[postId],
            postId: postId,
        });
    } else {
        res.status(404).send("Post not found.");
    }
    
});

app.post("/update", (req, res) => {
    const postId = parseInt(req.body.postId, 10);
    if (postId >= 0 && postId < blogTitles.length) {
        const title = req.body["title"];
        const essay = req.body["blogContent"];
        blogTitles[postId] = title;
        blogPosts[postId] = essay;
        res.redirect("/");
    } else {
        res.status(404).send("Post not found.");
    }
});



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
