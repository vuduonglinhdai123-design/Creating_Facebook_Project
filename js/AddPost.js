class AddPost {
    constructor() {
        this.user = document.createElement('p')
        this.content = document.createElement('textarea')
        this.button = document.createElement('button')

        this.button.innerHTML = 'Submit'
        this.button.onclick = this.upload()
    }
    render(container) {
        const div = document.createElement('div')
        div.appendChild(this.content)
        div.appendChild(this.button)

        container.appendChild(div)
    }
    upload() {
        db.collection('post').doc().set({
            name: this.user,
            content: this.content,
            deleted: false,
            likes: 0,
            timestamp: Date.now()
        })
    }
}

let add_post_container = document.querySelector('.add_post')
let add_post_form = new AddPost()
add_post_form.render(add_post_container)