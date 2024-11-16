const modal = document.querySelector(".modal");
document.getElementById("form").addEventListener("submit", (e) => {
    document.querySelector(".loader").classList.add("loader_active");
    setInterval(() => {
        modal.showModal();
    }, 100);
});