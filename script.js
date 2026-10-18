const API_URL = "http://localhost:8080/api/queue";

const queueForm = document.getElementById("queueForm");
const studentNameInput = document.getElementById("studentName");
const serviceSelect = document.getElementById("service");
const tokenResult = document.getElementById("tokenResult");
const tokenNumber = document.getElementById("tokenNumber");
const tokenMessage = document.getElementById("tokenMessage");
const refreshQueueButton = document.getElementById("refreshQueue");
const lastUpdated = document.getElementById("lastUpdated");

queueForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const studentName = studentNameInput.value.trim();
    const selectedService = serviceSelect.value;

    if (studentName === "" || selectedService === "") {
        alert("Please enter your name and select a service.");
        return;
    }

    const submitButton = queueForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "Generating token...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                studentName: studentName,
                serviceName: selectedService
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Server could not create the token.");
        }

        const token = await response.json();

        tokenNumber.textContent = "DQ" + String(token.tokenNumber).padStart(3, "0");
        tokenMessage.textContent =
            "Thank you, " + token.studentName +
            "! Your service is " + token.serviceName +
            ". Status: " + token.status + ".";

        tokenResult.querySelector(".token-label").textContent = "YOUR QUEUE TOKEN";
        tokenResult.querySelector(".demo-note").textContent =
            "Your token has been saved to the queue database.";

        tokenResult.hidden = false;
        tokenResult.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

        studentNameInput.value = "";
        serviceSelect.value = "";
    } catch (error) {
        console.error("Token generation failed:", error);
        alert(
            "Could not connect to the Java backend. Make sure your Spring Boot app is running at " +
            API_URL + ". Details: " + error.message
        );
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});

/*
 * The queue-status cards still show demo values.
 * The Refresh button is intentionally labelled as demo until the backend
 * has endpoints for current-serving token and waiting-time calculations.
 */
const refreshQueueButtonOriginalText = refreshQueueButton.textContent;
refreshQueueButton.addEventListener("click", function () {
    alert("Token booking is connected to the database. The queue-status cards are still demo values.");
    lastUpdated.textContent = "Token booking connected; queue status cards are demo values.";
    refreshQueueButton.textContent = refreshQueueButtonOriginalText;
});
