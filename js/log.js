// Rätt inloggningsuppgifter
const namn = "Kalle";
const losenord = "qwe123";

// Hämta elementen från HTML
const loginForm = document.getElementById("login-form");
const inloggning = document.getElementById("Inloggning");
const welcomeSida = document.getElementById("welcome-sida");
const message = document.getElementById("message");
const welcomeMessage = document.getElementById("welcome-message");
const logoutButton = document.getElementById("logout-button");

// När användaren trycker på "Logga in"
loginForm.addEventListener("submit", function(event) {

    //Förhindrar att sidan laddas om
    event.preventDefault();

    // Hämtar det användaren har skrivit
    const inmatatNamn = document.getElementById("name").value;
    const inmatatLosenord = document.getElementById("password").value;

    // Kontrollerar om namn och lösenord är rätt
    if (inmatatNamn === namn && inmatatLosenord === losenord) {

        // Visar välkomstmeddelandet
        welcomeMessage.textContent =
        `Välkommen ${inmatatNamn}, du är nu inloggad!`;

        // Sparar användarens namn i localStorage
        localStorage.setItem("inloggadAnvandare", inmatatNamn);
    
    // Gömmer inloggningen
        inloggning.classList.add("hidden");

        // Visar den inloggade sidan
        welcomeSida.classList.remove("hidden");

        // Tömmer formuläret
        loginForm.reset();

        // Tar bort eventuellt felmeddelande
        message.textContent = "";

    } else {

        // Visar felmeddelande
        message.textContent = "Felaktiga inloggningsuppgifter";

        // Tömmer lösenordsfältet
        document.getElementById("password").value = "";
    }
});

// När användaren trycker på "Logga ut"
logoutButton.addEventListener("click", function() {

    // Tar bort användaren från localStorage
    localStorage.removeItem("inloggadAnvandare");

    // Gömmer den inloggade sidan
    welcomeSida.classList.add("hidden");

    // Visar inloggningssidan
    inloggning.classList.remove("hidden");

    // Tömmer eventuellt felmeddelande
    message.textContent = "";
});

// Kollar om det redan finns en sparad användare
const sparadAnvandare = localStorage.getItem("inloggadAnvandare");

// Om det finns en sparad användare
// visas den inloggade sidan direkt
if (sparadAnvandare) {

    // Visar välkomstmeddelandet
    welcomeMessage.textContent =
    `Välkommen tillbaka ${sparadAnvandare}, du är nu inloggad!`;

    // Gömmer inloggningen
    inloggning.classList.add("hidden");

    // Visar den inloggade sidan
    welcomeSida.classList.remove("hidden");
}