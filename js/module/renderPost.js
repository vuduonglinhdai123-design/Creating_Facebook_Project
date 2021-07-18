function renderPost(data, container) {
    const html = `<div class='card text-white bg-dark'  style='padding: 20px;margin:20px 0px 0px 0px; text-align:left'>
        <h5>${data.username}</h5>
        <p style='color: grey'>${data.timestamp}</p>
        <p>${data.content}</p>
        <i class="far fa-heart" style='display: inline'></i><span>${data.likes} </span>
    </div>
    `
    container.innerHTML += html
}


export {
    renderPost
}
