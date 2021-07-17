class Post {
    constructor(user, timestamp, content, likes, deleted) {
        this.user = user
        this.timestamp = timestamp
        this.content = content
        this.likes = likes
        this.deleted = deleted
    }
    render(container) {
        const div = document.createElement('div')

        div.innerHTML = `
        <p>${this.user}</p>
        <p>${this.timestamp}</p>
        <p>${this.content}</p>
        <p>${this.likes}</p>
        `
        container.appendChild(div)
    }
}

// db.collection('post').orderBy('timestamp', 'desc').get().then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//         const data = doc.data()
//         console.log(data);
//         let post = new Post(data.name, data.timestamp, data.content, data.likes, data.deleted)
//         post.render(document.querySelector('.all_posts'))
//     })
// })
export {
    Post
}