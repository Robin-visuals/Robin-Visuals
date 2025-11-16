// ======================================
// 3D CAROUSEL (Homepage Only)
// ======================================

const carousel = document.querySelector(".carousel");

// Run carousel ONLY if carousel exists (homepage)
if (carousel) {
    const slides = Array.from(carousel.children);
    const carouselContainer = document.querySelector(".carousel-container");
    const dotsContainer = document.querySelector(".carousel-dots");

    let currentIndex = 0;
    let autoSlideInterval = null;

    // Create dots dynamically
    if (dotsContainer) {
        slides.forEach((_, index) => {
            const dot = document.createElement("div");
            dot.classList.add("dot");
            if (index === 0) dot.classList.add("active");

            dot.addEventListener("click", () => {
                goToSlide(index);
                resetAutoSlide();
            });

            dotsContainer.appendChild(dot);
        });
    }

    const dots = dotsContainer ? Array.from(dotsContainer.children) : [];

    function updateCarousel() {
        slides.forEach((slide, index) => {
            slide.classList.remove("prev", "next", "active");

            if (index === currentIndex) slide.classList.add("active");
            else if (index === (currentIndex - 1 + slides.length) % slides.length)
                slide.classList.add("prev");
            else if (index === (currentIndex + 1) % slides.length)
                slide.classList.add("next");
        });

        if (dots.length > 0) {
            dots.forEach((dot, index) =>
                dot.classList.toggle("active", index === currentIndex)
            );
        }
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    // Nav arrows (safe)
    const leftArrow = document.querySelector(".carousel-nav.left");
    const rightArrow = document.querySelector(".carousel-nav.right");

    if (leftArrow) {
        leftArrow.addEventListener("click", () => {
            prevSlide();
            resetAutoSlide();
        });
    }

    if (rightArrow) {
        rightArrow.addEventListener("click", () => {
            nextSlide();
            resetAutoSlide();
        });
    }

    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Pause on hover (safe)
    if (carouselContainer) {
        carouselContainer.addEventListener("mouseenter", () => {
            clearInterval(autoSlideInterval);
        });

        carouselContainer.addEventListener("mouseleave", () => {
            startAutoSlide();
        });
    }

    // Initialize carousel
    updateCarousel();
    startAutoSlide();
}



// ======================================
// HAMBURGER MENU (All Pages)
// ======================================

const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");
const dropdowns = document.querySelectorAll(".dropdown");

// Protect in case navbar is missing
if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
    });

    // Dropdown behavior for mobile
    dropdowns.forEach((dropdown) => {
        const link = dropdown.querySelector("a");

        if (link) {
            link.addEventListener("click", () => {
                if (window.innerWidth <= 1024) {
                    hamburger.classList.remove("active");
                    navLinks.classList.remove("active");
                }
            });
        }
    });
}


// -------------------------------------------
// HOMEPAGE CONTACT FORM (EmailJS Integration)
// Uses hidden success message div
// -------------------------------------------

document.addEventListener("DOMContentLoaded", function () {

    const homeForm = document.getElementById("contactForm");
    const successDiv = document.getElementById("successMessage");

    if (!homeForm || !successDiv) return; // Prevent errors on other pages

    // Initialize EmailJS
    emailjs.init("IUQLreWc2EP7IojqE");

    homeForm.addEventListener("submit", function (e) {
        e.preventDefault();

        emailjs.send("service_c6l22wg", "template_umj8ly7", {
            name: homeForm.name.value,
            email: homeForm.email.value,
            message: homeForm.message.value
        })
        .then(() => {

            // Hide the entire form
            homeForm.style.display = "none";

            // Show success message div
            successDiv.style.display = "block";

        })
        .catch((error) => {
            console.error("EmailJS Error:", error);

            // Optional: show error in the feedback <p>
            const feedback = homeForm.querySelector(".form-feedback");
            if(feedback){
                feedback.textContent = "Failed to send message. Please try again.";
                feedback.style.color = "red";
            }
        });
    });

});


// ===== REVIEW PAGE FILTER JS =====
document.addEventListener('DOMContentLoaded', function() {
    // Make sure this code runs only on the review page
    const reviewPage = document.getElementById('review-page');
    if (!reviewPage) {
        console.log('Not on review page, review JS skipped.');
        return;
    }
    console.log('Review page detected, JS running.');

    const filterSelect = reviewPage.querySelector('#review-filter');
    const reviewCards = reviewPage.querySelectorAll('.review-card');

    if (!filterSelect) {
        console.error('Filter select not found!');
        return;
    }
    if (!reviewCards.length) {
        console.error('No review cards found!');
        return;
    }

    filterSelect.addEventListener('change', function() {
        const selectedRating = this.value;
        console.log('Filter changed to:', selectedRating);

        reviewCards.forEach(card => {
            const cardRating = card.getAttribute('data-rating');

            if (selectedRating === 'all' || cardRating === selectedRating) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});
// Pagination setup
// Wrap everything to run only if the review page exists
document.addEventListener("DOMContentLoaded", () => {
    const reviewPage = document.getElementById("review-page");
    if (!reviewPage) return; // Exit if not on review page

    // Pagination setup
    const reviewsPerPage = 5;
    const reviewGrid = document.getElementById("review-grid");
    const reviewCards = Array.from(reviewGrid.children);

    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const pageInfo = document.getElementById("page-info");

    let currentPage = 1;
    const totalPages = Math.ceil(reviewCards.length / reviewsPerPage);

    function showPage(page) {
        // Hide all cards
        reviewCards.forEach(card => card.style.display = "none");

        // Show only the cards for this page
        const start = (page - 1) * reviewsPerPage;
        const end = start + reviewsPerPage;
        reviewCards.slice(start, end).forEach(card => card.style.display = "flex");

        // Update page info
        pageInfo.textContent = `Page ${page} of ${totalPages}`;

        // Disable buttons when needed
        prevBtn.disabled = page === 1;
        nextBtn.disabled = page === totalPages;
    }

    // Button events
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
        }
    });

    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
        }
    });

    // Initialize first page
    showPage(currentPage);
});



//about-page section=================================================================

document.addEventListener("DOMContentLoaded", function() {
    const aboutPage = document.querySelector("#about-page");
    if (!aboutPage) return; // exit if not on About page

    /* ================= METRIC COUNTER ================= */
    const counters = aboutPage.querySelectorAll(".metric-number h3");
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target) || parseInt(counter.innerText.replace(/\D/g,''));
        let count = 0;
        const increment = Math.ceil(target / 100); 
        const interval = setInterval(() => {
            count += increment;
            if (count >= target) {
                counter.innerText = target + '+';
                clearInterval(interval);
            } else {
                counter.innerText = count + '+';
            }
        }, 20);
    });

    /* ================= TESTIMONIAL CAROUSEL ================= */
    const slider = aboutPage.querySelector(".testimonial-slider");
    if (slider) {
        const slides = slider.querySelectorAll(".slide");
        let currentIndex = 0;

        function showSlide(index) {
            slider.style.transform = `translateX(-${index * 100}%)`;
        }

        // Auto-rotate slides every 5 seconds
        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }, 5000);
    }

    /* ================= BEFORE & AFTER SLIDER ================= */
    const beforeAfterContainer = aboutPage.querySelector(".before-after-container");
    if (beforeAfterContainer) {
        const afterImg = beforeAfterContainer.querySelector(".after-img");

        beforeAfterContainer.addEventListener("mousemove", e => {
            const rect = beforeAfterContainer.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            let percent = (offsetX / rect.width) * 100;
            percent = Math.min(Math.max(percent, 0), 100);
            afterImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
        });

        beforeAfterContainer.addEventListener("mouseleave", () => {
            afterImg.style.clipPath = "inset(0 50% 0 0)"; // reset to center
        });
    }

    /* ================= SIMPLE SCROLL FADE-IN ================= */
    const scrollElements = aboutPage.querySelectorAll("[data-aos]");
    function handleScroll() {
        const triggerBottom = window.innerHeight * 0.85;
        scrollElements.forEach(el => {
            const top = el.getBoundingClientRect().top;
            if (top < triggerBottom) {
                el.classList.add("aos-animate");
            }
        });
    }
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check

});


// ===== CONTACT PAGE JS (Safe Wrapped) =====
(function () {

    // ensure it only runs on the contact page
    const form = document.getElementById("contactForm");
    const successBox = document.getElementById("contact-success");

    if (!form || !successBox) return;

    // initialize EmailJS
    emailjs.init("IUQLreWc2EP7IojqE"); // your public key

    // when user submits form
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Collect parameters
        const templateParams = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            subject: form.subject.value.trim(),
            message: form.message.value.trim()
        };

        // send using EmailJS
        emailjs.send("service_c6l22wg", "template_umj8ly7", templateParams)
            .then(() => {

                // hide form smoothly
                form.style.opacity = "0";
                form.style.transition = "0.5s";

                setTimeout(() => {
                    form.style.display = "none";

                    // show success message
                    successBox.style.display = "block";
                    successBox.style.opacity = "0";

                    setTimeout(() => {
                        successBox.style.opacity = "1";
                        successBox.style.transition = "0.5s";
                    }, 100);

                }, 400);

            })
            .catch((err) => {
                console.error("EmailJS Error:", err);
                alert("Message failed to send. Please try again.");
            });
    });

    // Input glow effects
    const inputs = form.querySelectorAll("input, textarea");
    inputs.forEach(input => {
        input.addEventListener("focus", () => {
            input.style.borderColor = "#ff00ff";
            input.style.boxShadow = "0 0 10px #ff00ff55";
        });
        input.addEventListener("blur", () => {
            input.style.borderColor = "#00ffea";
            input.style.boxShadow = "none";
        });
    });

})();

