//  home page --- projet

function loadWorks() {
    fetch("http://localhost:5678/api/works")
        .then(res => res.json())
        .then(data => {
            const gallery = document.querySelector('.gallery');
            const newGallery = document.createElement('div');
            newGallery.classList.add('gallery');

            for (let i = 0; i < data.length; i++) {
                const work = data[i];
                console.log(work);
                const workElement = document.createElement('figure');
                const workImgElement = document.createElement('img');
                const workFigcaptionElement = document.createElement('figcaption');
            
                workElement.appendChild(workImgElement);
                workElement.appendChild(workFigcaptionElement);
            
                newGallery.appendChild(workElement);

                workImgElement.src = work.imageUrl;
                workImgElement.alt = work.title;
                workFigcaptionElement.innerText = work.title;
            }

            gallery.innerHTML = newGallery.innerHTML;
        });
}

loadWorks();
