/* Role rotation texts shown in the hero section */
const roles = ["Web Developer", "Frontend Developer", "Backend Developer"];
let roleIndex = 0;
const roleText = document.getElementById("role-text");

/* Change the role text every 1.5 seconds with a fade effect */
if (roleText) {
  setInterval(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    roleText.style.opacity = "0";

    setTimeout(() => {
      roleText.textContent = roles[roleIndex];
      roleText.style.opacity = "1";
    }, 300);
  }, 1500);
}

/* Mobile navigation toggle button */
const menuBtn = document.getElementById("mobile-menu");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll("#nav-menu a");

if (menuBtn && navMenu) {
  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}

/* Smooth scrolling for in-page anchor links */
const pageAnchors = document.querySelectorAll("a[href^='#']");
pageAnchors.forEach((anchor) => {
  anchor.addEventListener("click", function (event) {
    event.preventDefault();
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);

    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }

    if (navMenu) {
      navMenu.classList.remove("active");
    }
  });
});

/* Animate skill donuts when they appear in the viewport */
const skillCharts = document.querySelectorAll(".skill-chart");
const skillChartObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const chart = entry.target;
        if (!chart.classList.contains("animated")) {
          chart.classList.add("animated");
          animateSkillChart(chart);
        }
      }
    });
  },
  { threshold: 0.4 },
);

function animateSkillChart(chart) {
  const targetValue = parseInt(chart.dataset.percent, 10) || 0;
  let currentValue = 0;
  const valueElement = chart.querySelector(".skill-value span");

  const step = () => {
    currentValue += 2;
    if (currentValue > targetValue) {
      currentValue = targetValue;
    }

    chart.style.setProperty("--percent", currentValue);
    if (valueElement) {
      valueElement.textContent = `${currentValue}%`;
    }

    if (currentValue < targetValue) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

skillCharts.forEach((chart) => skillChartObserver.observe(chart));

/* Highlight active navbar item and show/hide scroll-top button on scroll */
const sections = document.querySelectorAll("section");
const scrollTopBtn = document.getElementById("scrollTopBtn");
let isScrolling = false;

const updateOnScroll = () => {
  const scrolled = window.scrollY;

  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle("show", scrolled > 300);
  }

  let currentSection = "";
  sections.forEach((section) => {
    if (scrolled >= section.offsetTop - 160) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === `#${currentSection}`);
  });

  isScrolling = false;
};

window.addEventListener("scroll", () => {
  if (!isScrolling) {
    isScrolling = true;
    requestAnimationFrame(updateOnScroll);
  }
});

/* Scroll to top button action */
if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* Contact form validation and send */
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

/* Initialize EmailJS */
emailjs.init("BOHoJX9BQ-Ut_4HzO");

function setContactStatus(message, isError = false) {
  if (!contactStatus) return;

  contactStatus.textContent = message;
  contactStatus.style.color = isError ? "#ff7f7f" : "#b4f7a1";
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const submitButton = contactForm.querySelector(
      "button[type='submit']"
    );

    /* Validation */
    if (!name || !email || !message) {
      setContactStatus(
        "Please fill in all fields before sending your message.",
        true
      );
      return;
    }

    if (name.length < 2) {
      setContactStatus(
        "Name must be at least 2 characters.",
        true
      );
      return;
    }

    if (!validateEmail(email)) {
      setContactStatus(
        "Please enter a valid email address.",
        true
      );
      return;
    }

    if (message.length < 15) {
      setContactStatus(
        "Message should be at least 15 characters.",
        true
      );
      return;
    }

    /* Button loading state */
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    try {

      /* Send form using EmailJS */
      await emailjs.sendForm(
        "service_e7yfi9p",
        "template_tg1ioil",
        contactForm
      );

      setContactStatus(
        "Message sent successfully! Thank you."
      );

      contactForm.reset();

    } catch (error) {

      console.error(error);

      setContactStatus(
        "Could not send the message. Please try again later.",
        true
      );

    } finally {

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
      }

    }
  });
}
