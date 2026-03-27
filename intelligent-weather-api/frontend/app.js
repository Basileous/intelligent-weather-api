// ============================================
// Weather API Configuration
// ============================================

const API_URL = "http://localhost:8000";

// Prevent multiple load handlers
let pageLoadInitialized = false;

// DOM Elements
const weatherForm = document.getElementById("weatherForm");
const resultSection = document.getElementById("resultSection");
const errorSection = document.getElementById("errorSection");
const loadingSpinner = document.getElementById("loadingSpinner");
const rainContainer = document.getElementById("rainContainer");
const predictBtn = document.getElementById("predictBtn");

// ============================================
// Weather Status Functions
// ============================================

function getRainStatus(probability) {
    if (probability < 0.2) return "Clear skies";
    if (probability < 0.4) return "Minimal rain";
    if (probability < 0.6) return "Rain possible";
    if (probability < 0.8) return "Rain likely";
    return "Heavy rain";
}

function getTempStatus(temp) {
    if (temp < 0) return "Freezing";
    if (temp < 10) return "Very Cold";
    if (temp < 15) return "Cold";
    if (temp < 20) return "Cool";
    if (temp < 25) return "Mild";
    if (temp < 30) return "Warm";
    if (temp < 35) return "Hot";
    return "Very Hot";
}

function getWeatherEmoji(probability) {
    if (probability < 0.2) return "☀️";
    if (probability < 0.4) return "🌤️";
    if (probability < 0.6) return "⛅";
    if (probability < 0.8) return "🌦️";
    return "🌧️";
}

// ============================================
// GSAP Animation: Page Load
// ============================================

function animatePageLoad() {
    const tl = gsap.timeline();

    tl
        // Fade in animated background
        .to(".animated-bg", { opacity: 1, duration: 0.5 }, 0)
        
        // Card entrance with scale
        .from(".weather-card", {
            opacity: 0,
            scale: 0.85,
            y: 40,
            duration: 0.8,
            ease: "back.out"
        }, 0.1)

        // Title animation
        .from(".app-title", {
            opacity: 0,
            y: -30,
            duration: 0.6,
            ease: "power3.out"
        }, 0.3)

        // Subtitle animation
        .from(".app-subtitle", {
            opacity: 0,
            y: -20,
            duration: 0.5,
            ease: "power3.out"
        }, 0.5)

        // Section title
        .from(".section-title", {
            opacity: 0,
            x: -20,
            duration: 0.5,
            ease: "power2.out"
        }, 0.7)

        // Input wrappers - staggered
        .from(".input-wrapper", {
            opacity: 0,
            y: 20,
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.out"
        }, 0.9)

        // Button entrance
        .from(".predict-btn", {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            ease: "back.out"
        }, 1.5);
}

// ============================================
// GSAP Animation: Input Interactions
// ============================================

function setupInputAnimations() {
    const inputs = document.querySelectorAll(".input-wrapper input");

    inputs.forEach((input) => {
        // Focus animation
        input.addEventListener("focus", () => {
            gsap.to(input, {
                duration: 0.3,
                boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.25)",
                backgroundColor: "rgba(255, 255, 255, 1)",
                ease: "power2.out"
            });

            // Parent label animation
            gsap.to(input.closest(".input-wrapper").querySelector("label"), {
                duration: 0.3,
                color: "#667eea",
                ease: "power2.out"
            });
        });

        // Blur animation
        input.addEventListener("blur", () => {
            gsap.to(input, {
                duration: 0.3,
                boxShadow: "none",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                ease: "power2.out"
            });

            // Parent label animation
            gsap.to(input.closest(".input-wrapper").querySelector("label"), {
                duration: 0.3,
                color: "#555",
                ease: "power2.out"
            });
        });

        // Hover animation
        input.addEventListener("mouseenter", () => {
            gsap.to(input, {
                duration: 0.3,
                borderColor: "#667eea",
                ease: "power2.out"
            });
        });

        input.addEventListener("mouseleave", function() {
            if (document.activeElement !== this) {
                gsap.to(input, {
                    duration: 0.3,
                    borderColor: "#e0e0e0",
                    ease: "power2.out"
                });
            }
        });
    });
}

// ============================================
// GSAP Animation: Button Interactions
// ============================================

function setupButtonAnimations() {
    predictBtn.addEventListener("mouseenter", () => {
        const tl = gsap.timeline();

        tl
            .to(predictBtn, {
                duration: 0.3,
                scale: 1.05,
                ease: "back.out"
            }, 0)
            .to(".btn-icon", {
                duration: 0.3,
                x: 8,
                ease: "power2.out"
            }, 0);
    });

    predictBtn.addEventListener("mouseleave", () => {
        const tl = gsap.timeline();

        tl
            .to(predictBtn, {
                duration: 0.3,
                scale: 1,
                ease: "power2.out"
            }, 0)
            .to(".btn-icon", {
                duration: 0.3,
                x: 0,
                ease: "power2.out"
            }, 0);
    });

    predictBtn.addEventListener("click", () => {
        gsap.to(predictBtn, {
            duration: 0.1,
            scale: 0.98,
            ease: "power2.inOut",
            yoyo: true,
            repeat: 1
        });
    });
}

// ============================================
// GSAP Animation: Rain Effect
// ============================================

function createRainAnimation() {
    const rainDropCount = 60;

    for (let i = 0; i < rainDropCount; i++) {
        const raindrop = document.createElement("div");
        raindrop.classList.add("rain-drop");

        const randomLeft = Math.random() * 100;
        const randomDelay = Math.random() * 2;
        const randomDuration = 0.5 + Math.random() * 0.5;
        const randomWind = (Math.random() - 0.5) * 100;
        const randomOpacity = 0.3 + Math.random() * 0.4;

        raindrop.style.left = randomLeft + "%";
        raindrop.style.top = "-10px";
        raindrop.style.animationDuration = randomDuration + "s";
        raindrop.style.animationDelay = randomDelay + "s";
        raindrop.style.setProperty("--wind-drift", randomWind + "px");
        raindrop.style.height = (8 + Math.random() * 4) + "px";
        raindrop.style.width = (1 + Math.random()) + "px";
        raindrop.style.opacity = randomOpacity;

        rainContainer.appendChild(raindrop);

        // Restart animation when it reaches bottom to create continuous effect
        const totalDuration = (randomDuration + randomDelay) * 1000;
        setInterval(() => {
            raindrop.style.animation = "none";
            setTimeout(() => {
                raindrop.style.animation = `falling ${randomDuration}s linear infinite`;
            }, 10);
        }, totalDuration);
    }
}

// ============================================
// GSAP Animation: Results Display
// ============================================

function animateResults(rainProbability, predictedTemp) {
    const tl = gsap.timeline();

    // Hide previous content and sections
    tl
        .to([resultSection, errorSection], {
            opacity: 0,
            duration: 0.2,
            pointerEvents: "none"
        }, 0)

        // Show loading
        .to(loadingSpinner, {
            opacity: 1,
            duration: 0.3,
            pointerEvents: "auto"
        }, 0.2)

        // Brief pause
        .to({}, { duration: 1 })

        // Hide loading and show results
        .to(loadingSpinner, {
            opacity: 0,
            duration: 0.3,
            pointerEvents: "none"
        })

        .to(resultSection, {
            opacity: 1,
            duration: 0.3,
            pointerEvents: "auto"
        }, "-=0.2");

    // Remove hidden class and set display to show results
    setTimeout(() => {
        resultSection.classList.remove("hidden");
        resultSection.style.display = "block";
        resultSection.style.opacity = "1";
        resultSection.style.visibility = "visible";
        
        // Show result cards with animation
        const resultCards = document.querySelectorAll(".result-card");
        resultCards.forEach((card, index) => {
            gsap.from(card, {
                opacity: 0,
                scale: 0.7,
                y: 30,
                duration: 0.5,
                delay: index * 0.15,
                ease: "back.out"
            });
        });

        // Progress section animation
        gsap.from(".progress-section", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            delay: 0.4,
            ease: "power2.out"
        });

        // Additional info animation
        gsap.from(".additional-info", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            delay: 0.5,
            ease: "power2.out"
        });
    }, 1200);

    // Animate number counting
    setTimeout(() => {
        animateNumberCount(rainProbability * 100, predictedTemp);
    }, 1200);

    // Animate progress bar fill
    setTimeout(() => {
        gsap.to("#rainFill", {
            width: rainProbability * 100 + "%",
            duration: 0.8,
            ease: "power2.out"
        });
    }, 1400);
}

// ============================================
// GSAP Animation: Number Counter
// ============================================

function animateNumberCount(rainPercentage, tempValue) {
    const rainElement = document.getElementById("rain_probability");
    const tempElement = document.getElementById("predicted_temp");

    // Rain probability counter
    gsap.to(
        { value: 0 },
        {
            value: rainPercentage,
            duration: 1,
            ease: "power2.out",
            onUpdate: function () {
                rainElement.textContent = this.targets()[0].value.toFixed(1);
            }
        }
    );

    // Temperature counter
    gsap.to(
        { value: 0 },
        {
            value: tempValue,
            duration: 1,
            ease: "power2.out",
            delay: 0.2,
            onUpdate: function () {
                tempElement.textContent = this.targets()[0].value.toFixed(1);
            }
        }
    );
}

// ============================================
// GSAP Animation: Error Display
// ============================================

function animateError(errorMessage) {
    const tl = gsap.timeline();

    // Ensure input section stays visible
    const inputSection = document.querySelector(".input-section");
    if (inputSection) {
        inputSection.style.display = "block";
        inputSection.style.opacity = "1";
    }

    // Hide loading
    tl.to(loadingSpinner, {
        opacity: 0,
        duration: 0.3,
        pointerEvents: "none"
    })

    // Show error with shake animation
    .to(errorSection, {
        opacity: 1,
        duration: 0.4,
        pointerEvents: "auto"
    }, 0.1)

    // Shake animation
    .to(".error-icon", {
        x: "random(-15, 15)",
        duration: 0.1,
        repeat: 5,
        ease: "power2.inOut"
    }, 0.1)

    .to(".error-icon", {
        x: 0,
        duration: 0.2
    });

    // Set error message
    document.getElementById("errorText").textContent = errorMessage;

    // Animate error details
    gsap.to(".error-section", {
        duration: 0.5,
        ease: "back.out"
    });
}

// ============================================
// GSAP Animation: Reset Form
// ============================================

function animateReset() {
    const tl = gsap.timeline();

    tl
        .to([resultSection, errorSection], {
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                resultSection.classList.add("hidden");
                errorSection.classList.add("hidden");
            }
        })

        .to(".input-wrapper", {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
        }, 0.1)

        .to(".predict-btn", {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        }, 0.1);
}

// ============================================
// Form Submission Handler
// ============================================

async function getPrediction() {
    // Prevent double submission
    predictBtn.disabled = true;

    const temperature = parseFloat(document.getElementById("temp").value);
    const humidity = parseFloat(document.getElementById("hum").value);
    const wind_speed = parseFloat(document.getElementById("wind").value);
    const pressure = parseFloat(document.getElementById("press").value);

    // Validate inputs
    if (!temperature || !humidity || !wind_speed || !pressure) {
        alert("Please fill all fields with valid numbers");
        predictBtn.disabled = false;
        return;
    }

    // Show loading state - Remove hidden and set display
    loadingSpinner.classList.remove("hidden");
    loadingSpinner.style.display = "block";
    loadingSpinner.style.opacity = "1";
    loadingSpinner.style.visibility = "visible";
    
    // Hide result and error sections
    resultSection.classList.add("hidden");
    resultSection.style.display = "none";
    errorSection.classList.add("hidden");
    errorSection.style.display = "none";

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                temperature,
                humidity,
                wind_speed,
                pressure
            }),
            mode: "cors"
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `API Error: ${response.status}`);
        }

        const data = await response.json();
        const rainProbability = data.rain_probability;
        const predictedTemp = data.predicted_temp;

        // Update DOM with predictions
        document.getElementById("rain_probability").textContent = "0.0";
        document.getElementById("predicted_temp").textContent = "0.0";
        document.getElementById("rainStatus").textContent = getRainStatus(rainProbability);
        document.getElementById("tempStatus").textContent = getTempStatus(predictedTemp);
        document.getElementById("weatherEmoji").textContent = getWeatherEmoji(rainProbability);

        // Update input display
        document.getElementById("inputTemp").textContent = `${temperature}°C`;
        document.getElementById("inputHumidity").textContent = `${humidity}%`;
        document.getElementById("inputWind").textContent = `${wind_speed} km/h`;
        document.getElementById("inputPressure").textContent = `${pressure} hPa`;

        // Animate results
        animateResults(rainProbability, predictedTemp);

    } catch (error) {
        console.error("Error fetching prediction:", error);
        loadingSpinner.classList.add("hidden");
        loadingSpinner.style.display = "none";
        errorSection.classList.remove("hidden");
        errorSection.style.display = "block";
        animateError(error.message || "Failed to get prediction. Please try again.");

    } finally {
        predictBtn.disabled = false;
    }
}

// ============================================
// Reset Form
// ============================================

function resetForm() {
    // Always show input section
    const inputSection = document.querySelector(".input-section");
    if (inputSection) {
        inputSection.classList.remove("hidden");
        inputSection.style.display = "block";
        inputSection.style.opacity = "1";
    }

    animateReset();
    
    setTimeout(() => {
        document.getElementById("temp").value = "25";
        document.getElementById("hum").value = "60";
        document.getElementById("wind").value = "10";
        document.getElementById("press").value = "1013";
        
        // Ensure input section is still visible
        if (inputSection) {
            inputSection.style.opacity = "1";
            inputSection.style.display = "block";
        }
    }, 300);
}

// ============================================
// Page Load & Initialization
// ============================================

window.addEventListener("load", async () => {
    if (pageLoadInitialized) return;
    pageLoadInitialized = true;

    // Ensure input section is always visible
    const inputSection = document.querySelector(".input-section");
    if (inputSection) {
        inputSection.classList.remove("hidden");
        inputSection.style.display = "block";
        inputSection.style.opacity = "1";
    }

    // Create rain effect
    createRainAnimation();

    // Setup animations
    setupInputAnimations();
    setupButtonAnimations();

    // Animate page load
    animatePageLoad();

    // Check API health
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        console.log("✅ API Connected:", data);

        // Pulse animation on successful connection
        gsap.to(".weather-card", {
            boxShadow: "0 40px 80px rgba(102, 126, 234, 0.4)",
            duration: 0.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 1
        });

    } catch (error) {
        console.error("❌ API connection failed:", error);
        // Still show the form even if API fails initially
        if (inputSection) {
            inputSection.classList.remove("hidden");
            inputSection.style.display = "block";
        }
    }
});

// ============================================
// Smooth scroll and additional polish
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    // Add smooth transitions for all elements
    gsap.set("*", { willChange: "auto" });

    // Prevent layout shift on scroll
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollBarWidth > 0) {
        document.body.style.paddingRight = scrollBarWidth + "px";
    }
});
