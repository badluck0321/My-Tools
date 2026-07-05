document.addEventListener("DOMContentLoaded", () => {
    const password = document.getElementById("password");
    const button = document.querySelector(".mytools-eye-btn");

    if (!password || !button) return;

    button.addEventListener("click", () => {
        password.type =
            password.type === "password" ? "text" : "password";
    });
});