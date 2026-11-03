(function () {
  "use strict";

  const tabs = Array.from(document.querySelectorAll(".form-tabs [role='tab']"));
  const activateTab = (tab, updateLocation) => {
    tabs.forEach((currentTab) => {
      const active = currentTab === tab;
      currentTab.classList.toggle("is-active", active);
      currentTab.setAttribute("aria-selected", String(active));
      currentTab.setAttribute("tabindex", active ? "0" : "-1");
      const panel = document.getElementById(currentTab.getAttribute("aria-controls"));
      if (panel) {
        panel.hidden = !active;
      }
    });

    if (updateLocation) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${tab.id}`);
    }
  };

  if (tabs.length) {
    const selectTabFromHash = () => {
      const tab = tabs.find((candidate) => candidate.id === window.location.hash.slice(1));
      if (tab) {
        activateTab(tab, false);
      }
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateTab(tab, true));
      tab.addEventListener("keydown", (event) => {
        let nextIndex;
        if (event.key === "ArrowRight") {
          nextIndex = (index + 1) % tabs.length;
        } else if (event.key === "ArrowLeft") {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = tabs.length - 1;
        }

        if (nextIndex !== undefined) {
          event.preventDefault();
          tabs[nextIndex].focus();
          activateTab(tabs[nextIndex], true);
        }
      });
    });

    selectTabFromHash();
    window.addEventListener("hashchange", selectTabFromHash);
  }

  const form = document.querySelector("#quote-form");
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  const submitButton = document.querySelector("#form-submit");
  const generalError = document.querySelector("#form-general-error");

  const setFieldError = (name, message) => {
    const input = form.elements.namedItem(name);
    const error = document.querySelector(`#${name}-error`);
    if (input instanceof HTMLElement && error) {
      const descriptions = (input.getAttribute("aria-describedby") || "")
        .split(/\s+/)
        .filter((id) => id && id !== error.id);
      if (message) {
        input.setAttribute("aria-invalid", "true");
        descriptions.push(error.id);
      } else {
        input.removeAttribute("aria-invalid");
      }
      if (descriptions.length) {
        input.setAttribute("aria-describedby", descriptions.join(" "));
      } else {
        input.removeAttribute("aria-describedby");
      }
      error.textContent = message;
    }
  };

  const clearErrors = () => {
    ["name", "email", "service", "phone", "premises", "location", "timeframe", "message"].forEach((name) => setFieldError(name, ""));
    generalError.textContent = "";
  };

  const validate = () => {
    clearErrors();
    const fields = {
      name: form.elements.namedItem("name"),
      email: form.elements.namedItem("email"),
      service: form.elements.namedItem("service"),
      phone: form.elements.namedItem("phone"),
      premises: form.elements.namedItem("premises"),
      location: form.elements.namedItem("location"),
      timeframe: form.elements.namedItem("timeframe"),
      message: form.elements.namedItem("message"),
      privacy: form.elements.namedItem("privacy_acknowledgement")
    };
    if (fields.phone instanceof HTMLInputElement) {
      fields.phone.value = fields.phone.value.trim();
    }
    let firstInvalid = null;

    const markInvalid = (name, message) => {
      setFieldError(name, message);
      firstInvalid ||= fields[name];
    };

    if (!(fields.name instanceof HTMLInputElement) || !fields.name.value.trim()) {
      markInvalid("name", "Enter your name.");
    }
    if (!(fields.email instanceof HTMLInputElement) || !fields.email.value.trim()) {
      markInvalid("email", "Enter your email address.");
    } else if (!fields.email.validity.valid) {
      markInvalid("email", "Enter an email address in the correct format.");
    }
    if (!(fields.service instanceof HTMLSelectElement) || !fields.service.value) {
      markInvalid("service", "Choose a cleaning category.");
    }
    if (!(fields.phone instanceof HTMLInputElement) || !fields.phone.value.trim()) {
      markInvalid("phone", "Enter your phone number.");
    }
    if (!(fields.premises instanceof HTMLInputElement) || !fields.premises.value.trim()) {
      markInvalid("premises", "Enter your property or premises type.");
    }
    if (!(fields.location instanceof HTMLInputElement) || !fields.location.value.trim()) {
      markInvalid("location", "Enter your town or postcode.");
    }
    if (!(fields.timeframe instanceof HTMLInputElement) || !fields.timeframe.value.trim()) {
      markInvalid("timeframe", "Enter when you would like the cleaning.");
    }
    if (!(fields.message instanceof HTMLTextAreaElement) || !fields.message.value.trim()) {
      markInvalid("message", "Tell us a little about the cleaning you need.");
    }
    if (!(fields.privacy instanceof HTMLInputElement) || !fields.privacy.checked) {
      generalError.textContent = "Please read the privacy notice and acknowledge how your enquiry details will be used.";
      firstInvalid ||= fields.privacy;
    }

    if (firstInvalid instanceof HTMLElement) {
      firstInvalid.focus();
      return false;
    }
    return true;
  };

  form.addEventListener("input", (event) => {
    if (event.target instanceof HTMLElement && event.target.hasAttribute("aria-invalid")) {
      event.target.removeAttribute("aria-invalid");
      const associatedError = event.target.id ? document.querySelector(`#${event.target.id}-error`) : null;
      if (associatedError) {
        associatedError.textContent = "";
      }
    }
  });

  form.addEventListener("submit", (event) => {
    if (!validate()) {
      event.preventDefault();
      return;
    }

    submitButton.disabled = true;
    submitButton.classList.add("is-loading");
    submitButton.setAttribute("aria-busy", "true");
    submitButton.textContent = "Sending enquiry…";
    generalError.textContent = "";
  });
})();
