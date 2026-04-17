function showLogin(){
    document.getElementById("loginPage").style.display="block";
    document.getElementById("registerPage").style.display="none";
    document.getElementById("loginTab").classList.add("active");
    document.getElementById("registerTab").classList.remove("active");
}
function showRegister(){
    document.getElementById("loginPage").style.display="none";
    document.getElementById("registerPage").style.display="block";
    document.getElementById("registerTab").classList.add("active");
    document.getElementById("loginTab").classList.remove("active");
}
function register(){

    let fname = document.getElementById("fname").value.trim();
    let lname = document.getElementById("lname").value.trim();
    let email = document.getElementById("email").value.trim();
    let pass = document.getElementById("pass").value;
    let pass2 = document.getElementById("pass2").value;

    let valid = true;

    // RESET ERRORS
    document.getElementById("nameErr").innerText="";
    document.getElementById("emailErr").innerText="";
    document.getElementById("passErr").innerText="";
    document.getElementById("pass2Err").innerText="";

    // 🔹 NAME VALIDATION (ONLY ALPHABETS)
    let nameRegex = /^[A-Za-z]+$/;

    if(!nameRegex.test(fname) || !nameRegex.test(lname)){
        document.getElementById("nameErr").innerText = "Only alphabets allowed";
        valid = false;
    }

    // 🔹 EMAIL VALIDATION (PROPER FORMAT)
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        document.getElementById("emailErr").innerText = "Invalid email format";
        valid = false;
    }
    if(pass.length < 6){
        document.getElementById("passErr").innerText = "Password must be at least 6 characters";
        valid = false;
    }
    if(pass !== pass2){
        document.getElementById("pass2Err").innerText = "Passwords do not match";
        valid = false;
    }
    if(valid){
        localStorage.setItem("email", email);
        localStorage.setItem("password", pass);
        showLogin();
    }
}
function login(){
    let email = document.getElementById("loginEmail").value.trim();
    let pass = document.getElementById("loginPass").value;
    let valid = true;
    document.getElementById("loginEmailErr").innerText="";
    document.getElementById("loginPassErr").innerText="";
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        document.getElementById("loginEmailErr").innerText = "Invalid email format";
        valid = false;
    }
    if(pass.length < 6){
        document.getElementById("loginPassErr").innerText = "Password must be at least 6 characters";
        valid = false;
    }
    if(!valid) return;
    let storedEmail = localStorage.getItem("email");
    let storedPass = localStorage.getItem("password");
    if(email !== storedEmail){
        document.getElementById("loginEmailErr").innerText = "Email not registered";
        return;
    }
    if(pass !== storedPass){
        document.getElementById("loginPassErr").innerText = "Incorrect password";
        return;
    }
    let name = email.split("@")[0];
    localStorage.setItem("username", name);
    window.location.href = "dashboard.html";
}