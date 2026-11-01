(function () {
  "use strict";

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
    ["name", "email", "service", "message"].forEach((name) => setFieldError(name, ""));
    generalError.textContent = "";
  };

  const validate = () => {
    clearErrors();
    const fields = {
      name: form.elements.namedItem("name"),
      email: form.elements.namedItem("email"),
      service: form.elements.namedItem("service"),
      phone: form.elements.namedItem("phone"),
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
