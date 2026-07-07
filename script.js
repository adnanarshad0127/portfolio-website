// GSAP Animations and Interactions

gsap.registerPlugin(ScrollTrigger);

// 1. Smooth Scroll Setup (if desired, or just let CSS scroll-behavior handle it, but GSAP can do cool things)
// Here we just use standard smooth scrolling behavior in CSS, but let's animate elements on reveal.

document.addEventListener("DOMContentLoaded", (event) => {
    
    // Typing Effect for Hero Section
    const typingText = document.getElementById("typing-text");
    if (typingText) {
        // We actually hardcoded "CODER" in HTML for SEO and layout, 
        // but if we wanted to type it out, we'd do it here.
        // Let's just add a simple pulse to it with GSAP.
        gsap.to(".main-title", {
            scale: 1.05,
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    }

    // Scroll Reveal Animations
    const revealElements = document.querySelectorAll(".gs-reveal");
    revealElements.forEach((elem) => {
        gsap.fromTo(elem, 
            { autoAlpha: 0, y: 50 }, 
            {
                autoAlpha: 1, 
                y: 0, 
                duration: 1, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Timeline Animation
    const timelineLine = document.getElementById("timeline-progress");
    const timelineEntries = document.querySelectorAll(".timeline-entry");

    if (timelineLine) {
        // Animate the line growing
        gsap.to(timelineLine, {
            height: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: "#experience",
                start: "top center",
                end: "bottom center",
                scrub: true
            }
        });
    }

    // Animate Timeline Dots pulsing when they come into view
    const timelineDots = document.querySelectorAll(".timeline-dot");
    timelineDots.forEach((dot) => {
        gsap.fromTo(dot,
            { scale: 0, boxShadow: "0 0 0 rgba(168,85,247,0)" },
            {
                scale: 1,
                boxShadow: "0 0 20px rgba(168,85,247,1)",
                duration: 0.5,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: dot,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Stagger Skill Cards
    gsap.fromTo(".skill-card", 
        { autoAlpha: 0, scale: 0.8, y: 30 },
        {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "back.out(1.5)",
            scrollTrigger: {
                trigger: "#skills",
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        }
    );
    // Email Popup Logic
    const emailBtn = document.getElementById("email-btn");
    const emailPopup = document.getElementById("email-popup");
    const closeEmailPopup = document.getElementById("close-email-popup");
    const copyEmailBtn = document.getElementById("copy-email-btn");
    const emailText = document.getElementById("email-text");

    if (emailBtn && emailPopup) {
        emailBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (emailPopup.classList.contains("hidden")) {
                emailPopup.classList.remove("hidden");
                emailPopup.classList.add("flex");
                setTimeout(() => {
                    emailPopup.classList.remove("opacity-0");
                    emailPopup.classList.add("opacity-100");
                }, 10);
            } else {
                closePopup();
            }
        });

        const closePopup = () => {
            emailPopup.classList.remove("opacity-100");
            emailPopup.classList.add("opacity-0");
            setTimeout(() => {
                emailPopup.classList.remove("flex");
                emailPopup.classList.add("hidden");
            }, 300);
        };

        closeEmailPopup.addEventListener("click", (e) => {
            e.preventDefault();
            closePopup();
        });

        copyEmailBtn.addEventListener("click", (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(emailText.innerText).then(() => {
                const originalHTML = copyEmailBtn.innerHTML;
                copyEmailBtn.innerHTML = '<i class="fa-solid fa-check mr-2"></i> <span>Copied!</span>';
                copyEmailBtn.classList.replace("bg-brand-purple/20", "bg-green-600");
                copyEmailBtn.classList.replace("hover:bg-brand-purple", "hover:bg-green-500");
                copyEmailBtn.classList.replace("border-brand-purple/50", "border-green-500");
                
                setTimeout(() => {
                    copyEmailBtn.innerHTML = originalHTML;
                    copyEmailBtn.classList.replace("bg-green-600", "bg-brand-purple/20");
                    copyEmailBtn.classList.replace("hover:bg-green-500", "hover:bg-brand-purple");
                    copyEmailBtn.classList.replace("border-green-500", "border-brand-purple/50");
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            const container = document.getElementById('email-popup-container');
            if (container && !container.contains(e.target)) {
                if (!emailPopup.classList.contains("hidden")) {
                    closePopup();
                }
            }
        });
    }
});
