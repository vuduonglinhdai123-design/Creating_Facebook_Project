function renderPost(user, content, likes, container) {
    const html = `<div class='card text-white bg-dark'  style='padding: 20px;margin:20px 0px 0px 0px;'>
        <h5>${user}</h5>
        <p>${content}</p>
        <i class="far fa-heart"></i><span>${likes}</span>
    </div>
    `
    container.innerHTML += html
}


export {
    renderPost
}
