const toggle = document.querySelector("[data-menu-toggle]");
const links = document.querySelector("[data-nav-links]");

if (toggle && links) {
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

requestAnimationFrame(() => {
  document.querySelectorAll(".band, .page-hero, .site-footer").forEach((node) => {
    node.classList.add("reveal-ready");
  });
});

const isMobile = window.matchMedia("(max-width: 900px)").matches;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: isMobile ? 0.04 : 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".band, .page-hero, .site-footer").forEach((node) => {
  revealObserver.observe(node);
});

if (window.matchMedia("(pointer: fine)").matches) {
  const cursor = document.createElement("div");
  cursor.className = "interactive-cursor";
  document.body.append(cursor);

  let cursorX = 0;
  let cursorY = 0;
  let currentX = 0;
  let currentY = 0;

  const moveCursor = () => {
    currentX += (cursorX - currentX) * 0.22;
    currentY += (cursorY - currentY) * 0.22;
    cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(moveCursor);
  };

  window.addEventListener("pointermove", (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    cursor.classList.add("is-visible");
  });

  document.querySelectorAll("a, button, input, textarea, select, .work-item, .service-row, .thought-row, .blog-card, .related-work-card, .pii-card, .logo-cloud div").forEach((node) => {
    node.addEventListener("pointerenter", () => cursor.classList.add("is-hovering"));
    node.addEventListener("pointerleave", () => cursor.classList.remove("is-hovering"));
  });

  moveCursor();
}

const hero = document.querySelector("[data-hero]");

if (hero && window.matchMedia("(pointer: fine)").matches) {
  const orb = hero.querySelector("[data-cursor-orb]");
  const cards = [...hero.querySelectorAll("[data-float-card]")];
  const magneticItems = [...hero.querySelectorAll(".magnetic")];
  let pointerX = 0;
  let pointerY = 0;
  let orbX = 0;
  let orbY = 0;

  const animatePointer = () => {
    orbX += (pointerX - orbX) * 0.18;
    orbY += (pointerY - orbY) * 0.18;

    if (orb) {
      orb.style.transform = `translate3d(${orbX}px, ${orbY}px, 0) scale(1)`;
    }

    const rect = hero.getBoundingClientRect();
    const relX = (pointerX / Math.max(rect.width, 1) - 0.5) * 2;
    const relY = (pointerY / Math.max(rect.height, 1) - 0.5) * 2;

    cards.forEach((card, index) => {
      const strength = 10 + index * 5;
      card.style.translate = `${relX * strength}px ${relY * strength * 0.7}px`;
    });

    requestAnimationFrame(animatePointer);
  };

  hero.addEventListener("pointerenter", () => {
    hero.classList.add("is-active");
  });

  hero.addEventListener("pointerleave", () => {
    hero.classList.remove("is-active");
    magneticItems.forEach((item) => {
      item.style.transform = "";
    });
  });

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    pointerX = event.clientX - rect.left;
    pointerY = event.clientY - rect.top;
    hero.style.setProperty("--mx", `${pointerX}px`);
    hero.style.setProperty("--my", `${pointerY}px`);
  });

  magneticItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
    });

    item.addEventListener("pointerleave", () => {
      item.style.transform = "";
    });
  });

  animatePointer();
}

if (hero) {
  const heroImages = [
    'url("public/hero%20images/herobg3.png")',
    'url("public/hero%20images/_MG_9266%20(1).CR2")',
    'url("public/hero%20images/hero-bg.jpg")'
  ];
  let heroIndex = 0;

  setInterval(() => {
    heroIndex = (heroIndex + 1) % heroImages.length;
    hero.style.setProperty("--hero-image", heroImages[heroIndex]);
  }, 4200);
}

const canvas = document.querySelector("[data-hero-canvas]");

if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const context = canvas.getContext("2d");
  const particles = [];
  let width = 0;
  let height = 0;
  let mouseX = 0;
  let mouseY = 0;

  const resizeCanvas = () => {
    const ratio = window.devicePixelRatio || 1;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const seedParticles = () => {
    particles.length = 0;
    const count = Math.min(80, Math.max(34, Math.floor(width / 18)));
    for (let index = 0; index < count; index += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        size: Math.random() * 2.2 + 0.8
      });
    }
  };

  const drawParticles = () => {
    context.clearRect(0, 0, width, height);

    particles.forEach((particle, index) => {
      const dx = particle.x - mouseX;
      const dy = particle.y - mouseY;
      const distance = Math.hypot(dx, dy);

      if (distance < 150) {
        particle.vx += dx * 0.0009;
        particle.vy += dy * 0.0009;
      }

      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fillStyle = "rgba(255,255,255,0.62)";
      context.fill();

      for (let next = index + 1; next < particles.length; next += 1) {
        const other = particles[next];
        const lineDistance = Math.hypot(particle.x - other.x, particle.y - other.y);
        if (lineDistance < 118) {
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.strokeStyle = `rgba(255,255,255,${0.16 * (1 - lineDistance / 118)})`;
          context.stroke();
        }
      }
    });

    requestAnimationFrame(drawParticles);
  };

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
  });

  window.addEventListener("resize", () => {
    resizeCanvas();
    seedParticles();
  });

  resizeCanvas();
  seedParticles();
  drawParticles();
}

document.querySelectorAll(".work-item").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = (x / rect.width - 0.5) * 4;
    const rotateX = (0.5 - y / rect.height) * 4;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

const scrambleNode = document.querySelector("[data-scramble]");

if (scrambleNode) {
  const finalText = scrambleNode.dataset.scramble;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ/&+0123456789";
  let frame = 0;

  const scramble = () => {
    const output = finalText
      .split("")
      .map((char, index) => {
        if (char === " " || index < frame / 2.5) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join("");

    scrambleNode.textContent = output;
    frame += 1;

    if (frame < finalText.length * 2.5 + 10) {
      requestAnimationFrame(scramble);
    } else {
      scrambleNode.textContent = finalText;
    }
  };

  scramble();
}
