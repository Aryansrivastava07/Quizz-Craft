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
window.onload = async() => {
    const loginStatus = await userloggedin();
    if(!loginStatus){
        let loggedin = document.getElementById("profile");
        loggedin.innerHTML = `<a href="/login">Login</a>`;
    }
};
async function userloggedin() {
    try {
        const response = await fetch("/checkLogin", {
            method: "GET"
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log(result);
            if(result.message === "User is logged in"){
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error("Error checking login status:", error);
        return false;
    }
}
function profile(){
    document.querySelector(".dropdown_profile").classList.toggle("dropdown_profile_show");
}

document.getElementById("logout").addEventListener("click", async (e) => {
    e.preventDefault();
    // console.log("Logout clicked");
    try {
        const response = await fetch("/logout", {
            method: "POST"
        });
        if (response.ok) {
            
            window.location.href = "/";
        } else {
            console.error("Logout failed:", response);
        }
    } catch (error) {
        console.error("Error logging out:", error);
    }
});