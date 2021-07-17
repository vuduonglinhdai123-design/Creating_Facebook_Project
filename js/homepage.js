import { Post } from "./class/Post";
import { AddPost } from "./class/AddPost";

var addPostContainer = document.querySelector('.add_post')
var addPostForm = new AddPost()
addPostForm.render(addPostContainer)
