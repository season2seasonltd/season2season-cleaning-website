(function () {
  "use strict";

  const config = window.SITE_CONFIG;
  if (!config) {
    throw new Error("Site configuration is missing. Check that js/config.js is loaded before js/main.js.");
  }

  document.querySelectorAll("[data-company-name]").forEach((element) => {
    element.textContent = config.companyName;
  });

  const robotsTag = document.querySelector('meta[name="robots"]');
  if (robotsTag && document.body.dataset.page !== "thank-you") {
    robotsTag.content = config.allowIndexing ? "index,follow" : "noindex,nofollow";
  }

  const domain = config.websiteDomain.trim();
  if (domain) {
    let canonicalOrigin;
    try {
      const configuredDomain = new URL(domain);
      if (configuredDomain.protocol !== "https:" || configuredDomain.pathname !== "/" ||
          configuredDomain.search || configuredDomain.hash) {
        throw new Error("websiteDomain must be an HTTPS origin with no path, query or fragment.");
      }
      canonicalOrigin = configuredDomain.origin;
    } catch (error) {
      throw new Error(`Invalid websiteDomain in js/config.js: ${error.message}`);
    }
    const canonicalPath = window.location.pathname.replace(/index\.html$/, "");
    const canonicalUrl = new URL(canonicalPath, `${canonicalOrigin}/`).href;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.append(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;
    let openGraphUrl = document.querySelector('meta[property="og:url"]');
    if (!openGraphUrl) {
      openGraphUrl = document.createElement("meta");
      openGraphUrl.setAttribute("property", "og:url");
      document.head.append(openGraphUrl);
    }
    openGraphUrl.content = canonicalUrl;
  }
  let openGraphSiteName = document.querySelector('meta[property="og:site_name"]');
  if (!openGraphSiteName) {
    openGraphSiteName = document.createElement("meta");
    openGraphSiteName.setAttribute("property", "og:site_name");
    document.head.append(openGraphSiteName);
  }
  openGraphSiteName.content = config.companyName;

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === document.body.dataset.page) {
      link.setAttribute("aria-current", "page");
    }
  });

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-navigation");

  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        closeMenu();
        menuButton.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (menuButton.getAttribute("aria-expanded") === "true" &&
          event.target instanceof Node &&
          !menuButton.contains(event.target) &&
          !navigation.contains(event.target)) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 761px)").matches) {
        closeMenu();
      }
    });
  }

  const phone = config.phone.trim();
  document.querySelectorAll("[data-phone-display], [data-footer-phone]").forEach((element) => {
    if (phone) {
      const link = document.createElement("a");
      const digits = phone.replace(/\D/g, "");
      link.href = `tel:${phone.trim().startsWith("+") ? `+${digits}` : digits}`;
      link.textContent = phone;
      element.replaceWith(link);
    }
  });

  const whatsappNumber = phone.replace(/\D/g, "");
  if (whatsappNumber) {
    const whatsappLink = document.createElement("a");
    whatsappLink.className = "whatsapp-button";
    whatsappLink.href = `https://wa.me/${whatsappNumber}`;
    whatsappLink.target = "_blank";
    whatsappLink.rel = "noopener noreferrer";
    whatsappLink.setAttribute("aria-label", `Message ${config.companyName} on WhatsApp (opens in a new tab)`);
    whatsappLink.title = "Message us on WhatsApp";
    const whatsappIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    whatsappIcon.setAttribute("viewBox", "0 0 24 24");
    whatsappIcon.setAttribute("aria-hidden", "true");
    whatsappIcon.setAttribute("focusable", "false");
    whatsappIcon.classList.add("whatsapp-icon");
    const bubble = document.createElementNS("http://www.w3.org/2000/svg", "path");
    bubble.setAttribute("d", "M20.2 11.5a8.2 8.2 0 0 1-12.1 7.2L3.8 20l1.3-4.1a8.2 8.2 0 1 1 15.1-4.4Z");
    bubble.setAttribute("fill", "none");
    bubble.setAttribute("stroke", "currentColor");
    bubble.setAttribute("stroke-linecap", "round");
    bubble.setAttribute("stroke-linejoin", "round");
    bubble.setAttribute("stroke-width", "1.7");
    const handset = document.createElementNS("http://www.w3.org/2000/svg", "path");
    handset.setAttribute("d", "M8.3 7.8c.2-.4.5-.6.9-.6h.5c.2 0 .4.2.5.4l.7 1.7c.1.3 0 .5-.2.7l-.5.6c.6 1.1 1.5 2 2.7 2.6l.6-.5c.2-.2.4-.3.7-.2l1.7.7c.2.1.4.3.4.5v.5c0 .4-.2.7-.6.9-.6.3-1.5.4-2.7-.1-2.3-.9-4.1-2.7-5-5-.5-1.2-.4-2.1-.1-2.7Z");
    handset.setAttribute("fill", "currentColor");
    whatsappIcon.append(bubble, handset);
    whatsappLink.append(whatsappIcon);
    document.body.append(whatsappLink);
  }

  const email = config.email.trim();
  document.querySelectorAll("[data-email-display]").forEach((element) => {
    if (email) {
      const link = document.createElement("a");
      link.href = `mailto:${email}`;
      link.textContent = email;
      element.replaceWith(link);
    }
  });

  const locations = config.locations.filter((location) => location.trim());
  document.querySelectorAll("[data-locations-display]").forEach((element) => {
    if (locations.length) {
      element.textContent = locations.join(", ");
    }
  });

  document.querySelectorAll("[data-opening-hours]").forEach((element) => {
    if (config.openingHours.trim()) {
      element.textContent = config.openingHours;
    }
  });

  document.querySelectorAll("[data-address-display]").forEach((element) => {
    if (config.address.trim()) {
      element.textContent = config.address;
    } else {
      element.closest(".contact-method")?.remove();
    }
  });

  document.querySelectorAll("[data-address-map]").forEach((element) => {
    const address = config.address.trim();
    if (!address) {
      element.remove();
      return;
    }

    const mapUrl = new URL("https://www.google.com/maps");
    mapUrl.searchParams.set("q", address);
    mapUrl.searchParams.set("output", "embed");
    const mapFrame = element.querySelector("iframe");
    const mapLink = element.querySelector("[data-map-link]");
    if (!(mapFrame instanceof HTMLIFrameElement) || !(mapLink instanceof HTMLAnchorElement)) {
      throw new Error("Address map markup is incomplete.");
    }
    mapFrame.src = mapUrl.href;
    const linkUrl = new URL("https://www.google.com/maps/search/");
    linkUrl.searchParams.set("api", "1");
    linkUrl.searchParams.set("query", address);
    mapLink.href = linkUrl.href;
    element.hidden = false;
  });

  const socialNames = {
    facebook: "Facebook",
    instagram: "Instagram",
    linkedin: "LinkedIn"
  };
  document.querySelectorAll(".footer-brand").forEach((brand) => {
    const configuredSocials = Object.entries(socialNames).filter(([key]) => config.social[key]);
    if (!configuredSocials.length) {
      return;
    }
    const socialList = document.createElement("div");
    socialList.className = "footer-social";
    socialList.setAttribute("aria-label", "Social media");
    configuredSocials.forEach(([key, label]) => {
      const link = document.createElement("a");
      let socialUrl;
      try {
        socialUrl = new URL(config.social[key]);
      } catch {
        throw new Error(`Invalid ${key} URL in js/config.js.`);
      }
      if (socialUrl.protocol !== "https:") {
        throw new Error(`${key} URL in js/config.js must use HTTPS.`);
      }
      link.href = socialUrl.href;
      link.textContent = label;
      link.rel = "noopener noreferrer";
      link.target = "_blank";
      socialList.append(link);
    });
    brand.append(socialList);
  });

  const serviceSelect = document.querySelector("#service");
  if (serviceSelect && Array.isArray(config.services)) {
    const selectedService = new URLSearchParams(window.location.search).get("service");
    const approvedServices = new Set(config.services);
    const slugifyService = (service) => service.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    Array.from(serviceSelect.options).forEach((option) => {
      if (option.value && !approvedServices.has(option.value)) {
        option.remove();
      }
    });
    const requestedService = config.services.find((service) =>
      slugifyService(service) === selectedService ||
      (selectedService === "domestic" && service === "Domestic cleaning") ||
      (selectedService === "commercial" && service === "Commercial cleaning")
    );
    if (requestedService && approvedServices.has(requestedService)) {
      serviceSelect.value = requestedService;
    }
  }

  if (document.body.dataset.page === "home" &&
      "IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    document.documentElement.classList.add("has-scroll-reveal");
    document.querySelectorAll("[data-reveal]").forEach((element) => {
      revealObserver.observe(element);
    });
  }

  const footer = document.querySelector(".site-footer .container");
  if (footer) {
    const installControls = document.createElement("div");
    installControls.className = "pwa-install-controls";
    installControls.hidden = true;

    const installButton = document.createElement("button");
    installButton.className = "pwa-install-button";
    installButton.type = "button";
    installButton.textContent = "Install App";
    installControls.append(installButton);

    const headerInstallButton = document.querySelector("[data-install-app]");
    const userAgent = navigator.userAgent;
    const isIos = /iphone|ipad|ipod/i.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isAndroid = /android/i.test(userAgent);
    const isInstalled = () => window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: minimal-ui)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      navigator.standalone === true;
    let deferredInstallPrompt;
    let promotionTimer;

    const promotion = document.createElement("section");
    promotion.className = "pwa-promotion";
    promotion.id = "pwa-promotion";
    promotion.setAttribute("role", "dialog");
    promotion.setAttribute("aria-labelledby", "pwa-promotion-title");
    promotion.setAttribute("aria-modal", "false");
    promotion.hidden = true;

    const promotionTitle = document.createElement("h2");
    promotionTitle.id = "pwa-promotion-title";
    promotionTitle.textContent = "Take Season2Season with you";

    const promotionMessage = document.createElement("p");
    promotionMessage.textContent = "Add Season2Season to your phone’s home screen for easier access.";

    const markPromotionShown = () => {
      try {
        sessionStorage.setItem("season2season-pwa-promotion-shown", "true");
      } catch (error) {
        console.error("Could not save PWA promotion state:", error);
      }
    };

    const manualInstructions = document.createElement("ol");
    manualInstructions.hidden = true;

    const focusInstallOption = () => {
      if (window.matchMedia("(max-width: 760px)").matches) {
        menuButton?.focus();
      } else if (headerInstallButton && !headerInstallButton.hidden) {
        headerInstallButton.focus();
      } else {
        navigation?.querySelector("a")?.focus();
      }
    };

    const promotionActions = document.createElement("div");
    promotionActions.className = "pwa-promotion-actions";

    const promotionInstallButton = document.createElement("button");
    promotionInstallButton.className = "pwa-promotion-install";
    promotionInstallButton.type = "button";
    promotionInstallButton.textContent = "Install App";
    promotionInstallButton.setAttribute("aria-describedby", "pwa-promotion-message");

    promotionMessage.id = "pwa-promotion-message";
    const maybeLaterButton = document.createElement("button");
    maybeLaterButton.className = "pwa-promotion-later";
    maybeLaterButton.type = "button";
    maybeLaterButton.textContent = "Maybe Later";

    promotionActions.append(promotionInstallButton, maybeLaterButton);
    promotion.append(promotionTitle, promotionMessage, manualInstructions, promotionActions);
    document.body.append(promotion);

    const getManualSteps = () => {
      if (isIos) {
        return [
          "Open this website in Safari.",
          "Tap Share, then choose Add to Home Screen."
        ];
      }
      if (isAndroid) {
        return [
          "Open Google Chrome on your Android device.",
          "Visit this website in Chrome, then tap Install App or choose Install app / Add to Home screen from the menu."
        ];
      }
      return [];
    };

    const updatePromotionContent = () => {
      manualInstructions.hidden = true;
      if (isIos) {
        promotionTitle.textContent = "Add Season2Season to your iPhone";
        promotionMessage.textContent = "For the best installation experience, open this website in Safari and add it to your Home Screen.";
        promotionInstallButton.textContent = "Show Safari steps";
        maybeLaterButton.hidden = false;
      } else if (deferredInstallPrompt) {
        promotionTitle.textContent = "Take Season2Season with you";
        promotionMessage.textContent = "Install the app for easier access from your device.";
        promotionInstallButton.textContent = "Install App";
        maybeLaterButton.hidden = false;
      } else if (isAndroid) {
        promotionTitle.textContent = "Install Season2Season on Android";
        promotionMessage.textContent = "Google Chrome provides the best installation experience. Open this website in Chrome to add it to your Home Screen.";
        promotionInstallButton.textContent = "How to install in Chrome";
        maybeLaterButton.hidden = false;
      } else {
        promotionTitle.textContent = "Keep browsing Season2Season";
        promotionMessage.textContent = "This browser does not offer app installation here, but you can continue using the website as usual.";
        promotionInstallButton.textContent = "Continue browsing";
        maybeLaterButton.hidden = true;
      }
    };

    const showManualInstructions = () => {
      const steps = getManualSteps();
      if (!steps.length) {
        dismissPromotion(true);
        return;
      }

      manualInstructions.replaceChildren(...steps.map((step) => {
        const item = document.createElement("li");
        item.textContent = step;
        return item;
      }));
      manualInstructions.hidden = false;
      maybeLaterButton.focus();
    };

    const dismissPromotion = (rememberDismissal) => {
      promotion.hidden = true;
      window.clearTimeout(promotionTimer);
      markPromotionShown();
      if (rememberDismissal) {
        try {
          localStorage.setItem("season2season-pwa-dismissed-until", String(Date.now() + 7 * 24 * 60 * 60 * 1000));
        } catch (error) {
          console.error("Could not save PWA promotion dismissal:", error);
        }
      }
      focusInstallOption();
    };

    const openPromotion = () => {
      if (isInstalled()) {
        return;
      }
      window.clearTimeout(promotionTimer);
      markPromotionShown();
      updatePromotionContent();
      promotion.hidden = false;
      promotionInstallButton.focus();
    };

    if (isIos && !isInstalled()) {
      installButton.hidden = true;
      const instructions = document.createElement("p");
      instructions.textContent = "For iPhone or iPad, open this website in Safari, tap Share, then choose Add to Home Screen.";
      installControls.append(instructions);
      installControls.hidden = false;
    }

    const installFromPrompt = async () => {
      if (isInstalled()) {
        return;
      }
      if (!deferredInstallPrompt) {
        updatePromotionContent();
        openPromotion();
        if (isIos || isAndroid) {
          showManualInstructions();
        }
        return;
      }
      const promptEvent = deferredInstallPrompt;
      deferredInstallPrompt = undefined;
      installButton.hidden = true;
      promotion.hidden = true;
      if (headerInstallButton) {
        headerInstallButton.hidden = true;
      }
      markPromotionShown();
      try {
        await promptEvent.prompt();
        await promptEvent.userChoice;
      } catch (error) {
        console.error("App installation prompt failed:", error);
      }
    };

    installButton.addEventListener("click", installFromPrompt);
    promotionInstallButton.addEventListener("click", () => {
      if (deferredInstallPrompt) {
        installFromPrompt();
      } else if (isIos || isAndroid) {
        showManualInstructions();
      } else {
        dismissPromotion(true);
      }
    });
    maybeLaterButton.addEventListener("click", () => dismissPromotion(true));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !promotion.hidden) {
        dismissPromotion(false);
      }
    });

    headerInstallButton?.addEventListener("click", () => {
      if (menuButton && navigation) {
        menuButton.setAttribute("aria-expanded", "false");
        navigation.classList.remove("is-open");
      }
      openPromotion();
    });

    window.addEventListener("beforeinstallprompt", (event) => {
      if (isIos || isInstalled()) {
        return;
      }

      event.preventDefault();
      deferredInstallPrompt = event;
      installButton.hidden = false;
      installControls.hidden = false;
      if (headerInstallButton) {
        headerInstallButton.hidden = false;
      }
      if (!promotion.hidden) {
        updatePromotionContent();
      }
    });

    window.addEventListener("appinstalled", () => {
      deferredInstallPrompt = undefined;
      installButton.hidden = true;
      installControls.hidden = true;
      promotion.hidden = true;
      if (headerInstallButton) {
        headerInstallButton.hidden = true;
      }
    });

    if (!isInstalled()) {
      const now = Date.now();
      let visitCount = 1;
      let isReturningVisitor = false;
      let promotionAlreadyShown = false;
      let promotionDismissed = false;
      try {
        const lastVisit = Number(localStorage.getItem("season2season-pwa-last-visit")) || 0;
        visitCount = Number(localStorage.getItem("season2season-pwa-visit-count")) || 0;
        if (!lastVisit || now - lastVisit > 30 * 60 * 1000) {
          visitCount += 1;
        }
        isReturningVisitor = visitCount > 1;
        localStorage.setItem("season2season-pwa-last-visit", String(now));
        localStorage.setItem("season2season-pwa-visit-count", String(visitCount));
        promotionDismissed = Number(localStorage.getItem("season2season-pwa-dismissed-until")) > now;
        promotionAlreadyShown = sessionStorage.getItem("season2season-pwa-promotion-shown") === "true";
      } catch (error) {
        console.error("Could not read PWA promotion preferences:", error);
      }

      if (!promotionDismissed && !promotionAlreadyShown) {
        let meaningfulInteraction = false;
        const delay = isReturningVisitor ? 15000 : 30000;
        const showPromotion = () => {
          promotionTimer = undefined;
          let shownInThisSession = false;
          try {
            shownInThisSession = sessionStorage.getItem("season2season-pwa-promotion-shown") === "true";
          } catch (error) {
            console.error("Could not read PWA promotion state:", error);
          }
          if (isInstalled() || document.visibilityState === "hidden" || shownInThisSession) {
            return;
          }
          updatePromotionContent();
          promotion.hidden = false;
          markPromotionShown();
        };
        const startPromotionTimer = () => {
          if (meaningfulInteraction) {
            return;
          }
          meaningfulInteraction = true;
          window.removeEventListener("scroll", onScroll);
          document.removeEventListener("pointerdown", onPointerDown);
          document.removeEventListener("keydown", onKeyDown);
          promotionTimer = window.setTimeout(showPromotion, delay);
        };
        const onScroll = () => {
          if (window.scrollY >= 80) {
            startPromotionTimer();
          }
        };
        const onPointerDown = (event) => {
          if (event.target instanceof Element &&
              event.target.closest("main, .primary-navigation, .menu-toggle")) {
            startPromotionTimer();
          }
        };
        const onKeyDown = (event) => {
          if (["Enter", " ", "ArrowDown", "PageDown", "Tab"].includes(event.key)) {
            startPromotionTimer();
          }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
      }
    }

    const serviceWorker = () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" })
          .catch((error) => console.error("Service worker registration failed:", error));
      }
    };

    if (document.readyState === "complete") {
      serviceWorker();
    } else {
      window.addEventListener("load", serviceWorker, { once: true });
    }

    const footerBottom = footer.querySelector(".footer-bottom");
    if (footerBottom) {
      footerBottom.before(installControls);
    }
  }
})();
