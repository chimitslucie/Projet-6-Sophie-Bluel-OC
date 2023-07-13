//  home page --- projet
function loadWorks() {
    fetch("http://localhost:5678/api/works")
        .then((res) => res.json())
        .then((data) => {
            const gallery = document.querySelector(".gallery");
            const newGallery = document.createElement("div");
            newGallery.classList.add("gallery");

            for (let i = 0; i < data.length; i++) {
                const work = data[i];
                const workElement = document.createElement("figure");
                const workImgElement = document.createElement("img");
                const workFigcaptionElement =
                    document.createElement("figcaption");

                workElement.setAttribute("data-filter", work.categoryId);
                workImgElement.src = work.imageUrl;
                workImgElement.alt = work.title;
                workFigcaptionElement.innerText = work.title;

                workElement.appendChild(workImgElement);
                workElement.appendChild(workFigcaptionElement);

                newGallery.appendChild(workElement);
            }

            gallery.innerHTML = newGallery.innerHTML;
        });
}

loadWorks();

// Filtres
function loadCategories() {
    fetch("http://localhost:5678/api/categories")
        .then((res) => res.json())
        .then((data) => {
            const filters = document.querySelector(".filters");
            const newFilters = document.createElement("div");
            newFilters.classList.add("filters");

            let filterElement = document.createElement("button");
            filterElement.classList.add("btn__filter");
            filterElement.classList.add("active");
            filterElement.setAttribute('data-filter', 'all');

            filterElement.innerText = "Tous";
            newFilters.appendChild(filterElement);

            for (let i = 0; i < data.length; i++) {
                const filter = data[i];
                const filterElement = document.createElement("button");
                filterElement.classList.add("btn__filter");

                filterElement.setAttribute("data-filter", filter.id);
                filterElement.innerText = filter.name;
                newFilters.appendChild(filterElement);
            }
            filters.innerHTML = newFilters.innerHTML;

            const filtersBtn = document.querySelectorAll(
                ".filters .btn__filter"
            );
            filtersBtn.forEach(function (filterBtn) {
                filterBtn.addEventListener("click", function () {
                    const id = filterBtn.getAttribute("data-filter");
                    const works = document.querySelectorAll(".gallery figure");
                    const btnActive = document.querySelector('.btn__filter.active');

                    btnActive.classList.remove('active');
                    filterBtn.classList.add('active');

                    works.forEach(function (work) {
                        const workId = work.getAttribute("data-filter");

                        if (workId === id || id === "all") {
                            work.style.display = "block";
                        } else {
                            work.style.display = "none";
                        }
                    });
                });
            });
        });
}

loadCategories();

// modal
const token = localStorage.getItem('token');

