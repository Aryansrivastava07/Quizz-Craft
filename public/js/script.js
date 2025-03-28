const nav = document.querySelector(".active");
const contact = document.querySelector(".nav_contact");
const heading = document.getElementById("heading");
const nav_observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            nav.className = "";
            contact.className = "active";
        } else {
            nav.className = "active";
            contact.className = "";
        }
    });
});
document.querySelectorAll(".contact").forEach(section => {
    nav_observer.observe(section);
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        } else {
            entry.target.classList.remove("show");
        }
    });
});
const aos = document.querySelectorAll(".aos");
aos.forEach((element) => {
    observer.observe(element);
});
window.onload = () => {
    if(userloggedin()){
        console.log("User Logged In");
        let loggedin = document.getElementById("profile");
        loggedin.innerHTML = `<a href="/login">Login</a>`;
    }
};
function userloggedin(){
    const chk = await(fetch("/checklogin",{
        method:"GET"
    }))
    // console.log(chk);
    return false;
}
function profile(){
    document.querySelector(".dropdown_profile").classList.toggle("dropdown_profile_show");
}