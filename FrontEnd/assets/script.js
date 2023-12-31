//  home page --- projet
let projects = null;
let categories = null;

// ------- On récupère les différents projets dans l'API et on les affiche
function loadWorks() {
    fetch("http://localhost:5678/api/works")
        .then((res) => res.json())
        .then((data) => {
            const gallery = document.querySelector(".gallery");
            const newGallery = document.createElement("div");
            newGallery.classList.add("gallery");
            projects = data;

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

// ------- On récupère les catégories dans l'API, on crée les boutons et on filtre les projets
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
            filterElement.setAttribute("data-filter", "all");

            filterElement.innerText = "Tous";
            newFilters.appendChild(filterElement);
            categories = data;

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
                filterBtn.addEventListener("click", () => buttonFilters(filterBtn));
            });
        });
}
loadCategories();

function buttonFilters(filterBtn) {
    const id = filterBtn.getAttribute("data-filter");
    const works = document.querySelectorAll(".gallery figure");
    const btnActive = document.querySelector(
        ".btn__filter.active"
    );

    btnActive.classList.remove("active");
    filterBtn.classList.add("active");

    works.forEach(function (work) {
        const workId = work.getAttribute("data-filter");

        if (workId === id || id === "all") {
            work.style.display = "block";
        } else {
            work.style.display = "none";
        }
    });
}

// ----------- On vérifie le token et on affiche la page en mode édition
function checkConnexion() {
    const token = localStorage.getItem("token");
    const banner = document.querySelector(".banner");
    const login = document.querySelector(".login__link");
    const modifIntroduction = document.querySelector(
        ".modif__link-introduction"
    );
    const modifPortfolio = document.querySelector(".modif__link-portfolio");
    const portfolioTitle = document.querySelector(".portfolio__title");
    const portfolioHeader = document.querySelector(".protfolio__header");
    const filters = document.querySelector(".filters");

    if (token) {
        banner.style.display = "block";
        login.innerHTML = "logout";
        modifIntroduction.style.display = "block";
        modifPortfolio.style.display = "block";
        portfolioTitle.classList.add("edition");
        portfolioHeader.style.marginBottom = "40px";
        filters.style.display = "none";
        login.addEventListener("click", () => {
            localStorage.removeItem("token");
        });
    } else {
        banner.style.display = "none";
        login.innerHTML = "login";
        modifIntroduction.style.display = "none";
        modifPortfolio.style.display = "none";
        portfolioTitle.classList.remove("edition");
        portfolioHeader.style.marginBottom = "0px";
        filters.style.display = "block";
    }
}
checkConnexion();

// ---------- On crée la modal
const modal = document.querySelector(".modal");
const modalWrapper = document.querySelector(".modal-wrapper");
const modifPortfolio = document.querySelector(".modif__link-portfolio");

const modalPhotoContainer = document.createElement("div");
const modalGallery = document.createElement('div');
const modalForm = document.createElement('div');

function createModal() {
    createGalleryIntoModal();
    createFormIntoModal();
}
setTimeout(createModal, 500);


// ------- le contenu de la modal gallerie
function createGalleryIntoModal() {
    const closeModalLink = document.createElement("i");

    const galleryTitle = document.createElement("h3");
    const gallery = document.createElement("div");

    const modalBorder = document.createElement("div");
    const modalAddButton = document.createElement("button");
    const modalRemoveButton = document.createElement("button");

    modalGallery.classList.add('modal__wrapper-gallery');
    modalPhotoContainer.classList.add("photo-container");
    modalBorder.classList.add("border");
    modalAddButton.classList.add("addButton");
    modalRemoveButton.classList.add("removeButton");
    closeModalLink.classList.add("fa-solid", "fa-xmark");
    galleryTitle.classList.add("modal-title");
    gallery.classList.add("modal-gallery");

    galleryTitle.textContent = "Galerie Photo";
    modalAddButton.textContent = "Ajouter une photo";
    modalRemoveButton.textContent = "Supprimer la galerie";
    modalAddButton.type = "button";
    modalRemoveButton.type = "button";

    closeModalLink.addEventListener("click", closeModal);
    modalAddButton.addEventListener('click', () => show('form'))
    
    for (let i = 0; i < projects.length; i++) {
        loadOneWork(projects[i]);
    }

    modalWrapper.appendChild(modalGallery);
    modalGallery.appendChild(galleryTitle);
    modalGallery.appendChild(closeModalLink);
    modalGallery.appendChild(modalPhotoContainer);
    modalGallery.appendChild(modalBorder);
    modalGallery.appendChild(modalAddButton);
    modalGallery.appendChild(modalRemoveButton);
}

// ---- le contenu de la modal formulaire
function createFormIntoModal() {
    const iconeBack = document.createElement("i");
    const closeModalFormLink = document.createElement("i");
    const modalAddTitle = document.createElement("h3");
    const addForm = document.createElement("form");
    const addBox = document.createElement("div");
    const iconeImg = document.createElement("i");
    const addImgButton = document.createElement("button");
    const inputFileBtn = document.createElement("input");
    const photoPreview = document.createElement("img");
    const addImgText = document.createElement("p");
    const inputContainer = document.createElement("div");
    const labelInputTitle = document.createElement("label");
    const labelSelectCategory = document.createElement("label");
    const inputTitle = document.createElement("input");
    const selectCategory = document.createElement("select");
    const border = document.createElement("div");
    const formSubmitButton = document.createElement("input");

    modalForm.classList.add('modal__wrapper-form');
    iconeBack.classList.add("fa-solid", "fa-arrow-left");
    closeModalFormLink.classList.add("fa-solid", "fa-xmark");
    addForm.classList.add("addForm");
    addBox.classList.add("addBox");
    iconeImg.classList.add("fa-regular", "fa-image");
    addImgButton.classList.add("addImgButton");
    inputFileBtn.classList.add("inputFileBtn");
    inputContainer.classList.add("input__container");
    border.classList.add("border");
    labelInputTitle.setAttribute("for", "Title");
    labelSelectCategory.setAttribute("for", "category");
    formSubmitButton.classList.add("formSubmitButton");

    modalForm.style.display = 'none';
    modalAddTitle.textContent = "Ajout photo";
    addImgButton.innerText = "+ Ajouter photo";
    addImgText.innerText = "jpg, png : 4mo max";
    labelInputTitle.innerText = "Titre";
    labelSelectCategory.innerText = "Catégorie";
    inputFileBtn.type = "file";
    formSubmitButton.type = "submit";
    inputTitle.type = "text";
    inputFileBtn.accept = ".jpg, .png";
    photoPreview.id = "photoPreview";
    inputTitle.id = "Title";
    selectCategory.id = "category";
    formSubmitButton.value = "Valider";

    // au clic sur le bouton retour, on met à jour l'affichage et on recrée la modale galerie
    iconeBack.addEventListener('click', () => show('gallery'));
    closeModalFormLink.addEventListener("click", closeModal);

    modalForm.appendChild(iconeBack);
    modalForm.appendChild(closeModalFormLink);
    modalForm.appendChild(modalAddTitle);
    modalWrapper.appendChild(modalForm);
    modalForm.appendChild(addForm)
    addForm.appendChild(addBox);
    addBox.appendChild(iconeImg);
    addBox.appendChild(addImgButton);
    addBox.appendChild(inputFileBtn);
    addBox.appendChild(photoPreview);
    addBox.appendChild(addImgText);
    addForm.appendChild(inputContainer);
    inputContainer.appendChild(labelInputTitle);
    inputContainer.appendChild(inputTitle);
    inputContainer.appendChild(labelSelectCategory);
    inputContainer.appendChild(selectCategory);
    addForm.appendChild(border);
    addForm.appendChild(formSubmitButton);

    // on ajoute les catégories au sélecteur
    insertCategories(selectCategory);

    handleForm(inputFileBtn, inputTitle, selectCategory, addForm, addImgButton, photoPreview, formSubmitButton);
}

function handleForm(inputFileBtn, inputTitle, selectCategory, addForm, addImgButton, photoPreview, formSubmitButton) {
    // on affiche l'image à ajouter
    inputFileBtn.addEventListener("change", () => {
        const [file] = inputFileBtn.files;
        if (file) {
            photoPreview.src = URL.createObjectURL(file);
            addImgButton.classList.add("modalHide");
        }
    });

    // On écoute les événements de modification des champs
    inputFileBtn.addEventListener("change", validateForm);
    inputTitle.addEventListener("input", validateForm);
    selectCategory.addEventListener("change", validateForm);

    // On écoute l'envoi du nouveau projet
    addForm.addEventListener("submit", (e) => {
        e.preventDefault();
        submitForm(inputFileBtn, inputTitle, selectCategory);
    });

    function validateForm() {
        if (
            inputFileBtn.files.length > 0 &&
            inputTitle.value !== "" &&
            selectCategory.value !== "0"
        ) {
            formSubmitButton.style.backgroundColor = "#1d6154";
        } else {
            formSubmitButton.style.backgroundColor = "";
        }
    }
}

// On supprime un projet depuis la modal gallerie
function deleteWork(work, workElement) {
    // On ajoute l'icône de suppression
    const iconeTrashPhoto = document.createElement("i");
    iconeTrashPhoto.classList.add("fa-solid", "fa-trash-can");
    workElement.appendChild(iconeTrashPhoto);
    // On supprime le projet au clic sur l'icône
    iconeTrashPhoto.addEventListener("click", async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        let id = work.id;

        fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            if (response.ok) {
                loadWorks();
                workElement.remove();
                show('gallery');
            }
        }).catch((err) => alert("Erreur de réseau"));
    });
};

// On ajoute un projet avec la modal formulaire
function insertCategories(selectCategory) {
    const emptyOption = document.createElement("option");
    selectCategory.appendChild(emptyOption);

    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const option = document.createElement("option");

        option.innerHTML = category.name;
        option.value = category.id;
        selectCategory.appendChild(option);
    }
}

async function submitForm(inputFileBtn, inputTitle, selectCategory) {
    const formData = new FormData();
    const newWorkImg = inputFileBtn.files[0];
    const newWorkTitle = inputTitle.value;
    const newWorkCategory = selectCategory.value;
    const addImgButton = document.querySelector(".addImgButton");
    const photoPreview = document.getElementById("photoPreview");
    token = localStorage.getItem("token");

    if (!newWorkImg || !newWorkTitle || newWorkCategory === "0") {
        alert("Veuillez remplir tous les champs du formulaire.");
        return;
    }

    formData.append("image", newWorkImg);
    formData.append("title", newWorkTitle);
    formData.append("category", newWorkCategory);

    await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    }).then(response => {
        if (!response.ok) {
            alert("Erreur lors de l'ajout");
            return;
        }
        
        return response.json();
    }).then(data => {
        loadWorks();
        loadOneWork(data);
        show('gallery');

        inputFileBtn.value = '';
        addImgButton.classList.remove("modalHide");
        photoPreview.src = '';
        inputTitle.value = '';
        selectCategory.value = '';
    });
}

// ---- On affiche ou supprime un projet
function loadOneWork(work) {
    const workElement = document.createElement("figure");
    const workImgElement = document.createElement("img");
    const workFigcaptionElement = document.createElement("figcaption");
    const iconeMovePhoto = document.createElement("i");

    workImgElement.src = work.imageUrl;
    workImgElement.alt = work.title;
    workFigcaptionElement.innerText = "éditer";

    workElement.appendChild(workImgElement);
    workElement.appendChild(workFigcaptionElement);
    modalPhotoContainer.appendChild(workElement);

    iconeMovePhoto.classList.add("fa-solid", "fa-up-down-left-right");
    workElement.appendChild(iconeMovePhoto);

    deleteWork(work, workElement);
}

// On ouvre et ferme la modal
modifPortfolio.addEventListener("click", () => {
openModal();
});

function openModal() {
    modal.style.display = "flex";
}

window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
};

function closeModal() {
    modal.style.display = "none";
}

// On affiche la bonne modal
function show(modalName) {
    if (modalName == 'form') {
        modalGallery.style.display = "none";
        modalForm.style.display = "flex";
    } else {
        modalGallery.style.display = "flex";
        modalForm.style.display = "none";
    }
}