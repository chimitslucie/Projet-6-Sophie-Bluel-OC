//  home page --- projet
let projects = null;
let categories = null;

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
                filterBtn.addEventListener("click", function () {
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
                });
            });
        });
}

loadCategories();

// modal
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

const modal = document.querySelector(".modal");
const modalWrapper = document.querySelector(".modal-wrapper");
const modifPortfolio = document.querySelector(".modif__link-portfolio");

function openModal() {
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
}

modifPortfolio.addEventListener("click", () => {
    openModal();
});

function createModal() {
    const closeModalLink = document.createElement("i");
    closeModalLink.classList.add("fa-solid", "fa-xmark");
    closeModalLink.addEventListener("click", closeModal);
    const galleryTitle = document.createElement("h3");
    galleryTitle.innerText = "Galerie Photo";
    galleryTitle.classList.add("modal-title");
    modalWrapper.appendChild(galleryTitle);
    const gallery = document.createElement("div");
    gallery.classList.add("modal-gallery");
    const modalPhotoContainer = document.createElement("div");
    modalPhotoContainer.classList.add("photo-container");
    const modalBorder = document.createElement("div");
    modalBorder.classList.add("border");
    const modalAddButton = document.createElement("button");
    modalAddButton.classList.add("addButton");
    modalAddButton.textContent = "Ajouter une photo";
    const modalRemoveButton = document.createElement("button");
    modalRemoveButton.classList.add("removeButton");
    modalRemoveButton.textContent = "Supprimer la galerie";

    for (let i = 0; i < projects.length; i++) {
        const work = projects[i];
        const workElement = document.createElement("figure");
        const workImgElement = document.createElement("img");
        const workFigcaptionElement = document.createElement("figcaption");
        workImgElement.src = work.imageUrl;
        workImgElement.alt = work.title;
        workFigcaptionElement.innerText = "éditer";

        workElement.appendChild(workImgElement);
        workElement.appendChild(workFigcaptionElement);
        modalPhotoContainer.appendChild(workElement);

        moveWorks(workElement);
        deleteWork(work, workElement);
    }

    modalWrapper.appendChild(closeModalLink);
    modalWrapper.appendChild(modalPhotoContainer);
    modalWrapper.appendChild(modalBorder);
    modalWrapper.appendChild(modalAddButton);
    modalWrapper.appendChild(modalRemoveButton);

    openAddWorks();
}

setTimeout(createModal, 500);

function moveWorks(workElement) {
    // On ajoute l'icône de déplacement
    const iconeMovePhoto = document.createElement("i");
    iconeMovePhoto.classList.add("fa-solid", "fa-up-down-left-right");
    workElement.appendChild(iconeMovePhoto);
}

function deleteWork(work, workElement) {
    // On ajoute l'icône de suppression
    const iconeTrashPhoto = document.createElement("i");
    iconeTrashPhoto.classList.add("fa-solid", "fa-trash-can");
    workElement.appendChild(iconeTrashPhoto);
    // On supprime le projet au clic sur l'icône
    iconeTrashPhoto.addEventListener("click", async () => {
        const token = localStorage.getItem("token");
        let id = work.id;

        try {
            const response = await fetch(
                `http://localhost:5678/api/works/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "*/*",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                // On met l'affichage à jour
                loadWorks();
            }
        } catch (error) {
            alert("problème de connexion au serveur");
        }
    });
}

function openAddWorks() {
    const addButton = document.querySelector(".addButton");
    // au clic, on appelle la modale
    addButton.addEventListener("click", () => {
        const modalWrapper = document.querySelector(".modal-wrapper");
        modalWrapper.innerHTML = "";
        createNewModal(modalWrapper);
    });
}

// Création de la modal ajout projects
function createNewModal(modalWrapper) {
    // au clic sur le bouton retour, on met à jour l'affichage et on recrée la modale galerie
    const iconeBack = document.createElement("i");
    iconeBack.classList.add("fa-solid", "fa-arrow-left");
    iconeBack.addEventListener("click", () => {
        modalWrapper.innerHTML = "";
        createModal();
    });
    // on crée la modale ajout de projet
    const closeModalLink = document.createElement("i");
    closeModalLink.classList.add("fa-solid", "fa-xmark");
    closeModalLink.addEventListener("click", closeModal);
    const modalAddTitle = document.createElement("h3");
    modalAddTitle.textContent = "Ajout photo";

    modalWrapper.appendChild(iconeBack);
    modalWrapper.appendChild(closeModalLink);
    modalWrapper.appendChild(modalAddTitle);

    // on ajoute le formulaire
    createForm(modalWrapper);
}

function createForm(modalWrapper) {
    const addForm = document.createElement("form");
    addForm.classList.add("addForm");
    const addBox = document.createElement("div");
    addBox.classList.add("addBox");
    const iconeImg = document.createElement("i");
    iconeImg.classList.add("fa-regular", "fa-image");
    const addImgButton = document.createElement("button");
    addImgButton.innerText = "+ Ajouter photo";
    addImgButton.classList.add("addImgButton");
    const inputFileBtn = document.createElement("input");
    inputFileBtn.type = "file";
    inputFileBtn.accept = ".jpg, .png";
    inputFileBtn.classList.add("inputFileBtn");
    const photoPreview = document.createElement("img");
    photoPreview.id = "photoPreview";
    const addImgText = document.createElement("p");
    addImgText.innerText = "jpg, png : 4mo max";
    const inputContainer = document.createElement("div");
    inputContainer.classList.add("input__container");
    const labelInputTitle = document.createElement("label");
    labelInputTitle.setAttribute("for", "Title");
    labelInputTitle.innerText = "Titre";
    const inputTitle = document.createElement("input");
    inputTitle.id = "Title";
    inputTitle.type = "text";
    const labelSelectCategory = document.createElement("label");
    labelSelectCategory.setAttribute("for", "category");
    labelSelectCategory.innerText = "Catégorie";
    const selectCategory = document.createElement("select");
    selectCategory.id = "category";
    const border = document.createElement("div");
    border.classList.add("border");
    const formSubmitButton = document.createElement("input");
    formSubmitButton.classList.add("formSubmitButton");
    formSubmitButton.type = "submit";
    formSubmitButton.value = "Valider";
    // formSubmitButton.disabled = true;

    modalWrapper.appendChild(addForm);
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

        // Validation du formulaire
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

    // On écoute l'envoi du nouveau projet
    formSubmitButton.addEventListener("click", (e) => {
        submitForm(inputFileBtn, inputTitle, selectCategory);
        e.preventDefault();
    });
}

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
    token = localStorage.getItem("token");

    if (!newWorkImg || !newWorkTitle || newWorkCategory === "0") {
        alert("Veuillez remplir tous les champs du formulaire.");
        return;
    }

    formData.append("image", newWorkImg);
    formData.append("title", newWorkTitle);
    formData.append("category", newWorkCategory);

    console.log(newWorkImg, newWorkTitle, newWorkCategory);

    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (response.ok) {
        loadWorks();
    } else {
        console.log(`une erreur lors de l'ajout`);
    }
}
