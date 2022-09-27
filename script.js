const form = document.getElementById("form");
const formSteps = [...document.getElementsByClassName("step")];
const stepsOverview = [...document.getElementsByClassName("form-step")];

// set current step to start form
let currentStep = 0;

// step 1 - inputs
const userName = document.getElementById("name");
const email = document.getElementById("email");

// step 2 - inputs
const serviceCheckboxes = document.querySelectorAll(`input[type="checkbox"]`);

// step 3 - inputs
const budgetRadios = document.querySelectorAll(`input[name="budget"]`);

// step 4 - inputs (final)
const phone = document.getElementById("phone");
const company = document.getElementById("company");

// initiate radio and checkbox listeners for steps 2 and 3
addRadioListeners();
addCheckboxListeners();

// listen for click in form
// only continue if click is on a next or previous button
form.addEventListener("click", (e) => {
  const next = e.target.classList.contains("next");
  const previous = e.target.classList.contains("previous");

  if (!next && !previous) return;

  if (previous) {
    currentStep -= 1;
    handleCurrentStep(currentStep);
    showCurrentStep();
    return;
  }

  // no need to call last step, as that is called through the Webflow.push function on page load, found below
  switch (true) {
    case currentStep === 0:
      validateStepOne();
      break;
    case currentStep === 1:
      validateStepTwo();
      break;
    case currentStep === 2:
      validateStepThree();
      break;
    default:
      break;
  }
});

// show current step in form
function showCurrentStep() {
  formSteps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });
}

// go to next step
function goToNextStep() {
  currentStep += 1;
  handleCurrentStep(currentStep);
  showCurrentStep();
}

// handle current step
function handleCurrentStep(liveStep) {
  stepsOverview.forEach((step, index) => {
    if (liveStep === index) {
      step.classList.add("current-step");
    } else {
      step.classList.remove("current-step");
    }
  });
}

// set error in each step
const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorMessage = inputControl.querySelector(".error-message");

  errorMessage.innerText = message;
  errorMessage.style.display = "block";

  if (
    element?.childNodes[0]?.type === "radio" ||
    element?.childNodes[0]?.type === "checkbox"
  )
    return;

  // only change input if text, email, textarea, phone, or number
  element.classList.add("input-error");
  element.classList.remove("input-success");
};

// set success in each step and remove error message
const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorMessage = inputControl.querySelector(".error-message");

  errorMessage.innerText = "";
  errorMessage.style.display = "none";
  element.classList.remove("input-error");

  if (
    element?.childNodes[0]?.type === "radio" ||
    element?.childNodes[0]?.type === "checkbox"
  )
    return;

  // only change input if text, email, textarea, phone, number
  element.classList.add("input-success");
};

// validation steps
function validateStepOne() {
  const checkName = validateNameInput();
  const checkEmail = validateEmailInput();

  if (!checkName || !checkEmail) return;

  goToNextStep();
}

function validateStepTwo() {
  const checkboxes = [...document.querySelectorAll('input[type="checkbox"]')];
  const checkAtLeastOne = checkboxes.some((input) => input.checked);

  if (checkAtLeastOne) {
    goToNextStep();
    setSuccess(budgetRadios[0].parentElement);
  } else {
    setError(checkboxes[0].parentElement, "Select at least one option");
  }
}

function validateStepThree() {
  const isItChecked = document.querySelector('input[name="budget"]:checked');

  if (isItChecked !== null) {
    setSuccess(budgetRadios[0].parentElement);
    goToNextStep();
    return;
  } else {
    setError(budgetRadios[0].parentElement, "Select a budget");
  }
}

// last step validation on form submit
Webflow.push(function () {
  $("form").submit(function () {
    const checkNumber = validatePhoneInput();
    if (!checkNumber) return false;
  });
});

// event listeners
function addRadioListeners() {
  for (radio in budgetRadios) {
    budgetRadios[radio].onclick = function () {
      if (this.value) {
        setSuccess(budgetRadios[0].parentElement);
      }
    };
  }
}

function addCheckboxListeners() {
  for (checkbox in serviceCheckboxes) {
    serviceCheckboxes[checkbox].onclick = function () {
      if (this.value) {
        setSuccess(serviceCheckboxes[0].parentElement);
      }
    };
  }
}

// validation on blur
userName.addEventListener("blur", validateNameInput);
email.addEventListener("blur", validateEmailInput);
phone.addEventListener("blur", validatePhoneInput);

// validation on keystroke only if input error class is active
userName.addEventListener(
  "input",
  () => inputHasError(userName) && validateNameInput()
);
phone.addEventListener(
  "input",
  () => inputHasError(phone) && validatePhoneInput()
);
email.addEventListener(
  "input",
  () => inputHasError(email) && validateEmailInput()
);

// utility functions to check if input has the input error class
function inputHasError(input) {
  return input.classList.contains("input-error");
}

// validation functions
function validateNameInput() {
  if (userName.value.trim() === "") {
    setError(userName, "Name is required");
    return false;
  } else if (userName.value.trim().length < 3) {
    setError(userName, "Name must be 3 characters or longer");
    return false;
  } else {
    setSuccess(userName);
    return true;
  }
}

function validateEmailInput() {
  const emailPattern =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const isEmailValid = emailPattern.test(email.value);

  if (!isEmailValid) {
    setError(email, "Enter a valid email address i.e., mail@me.com");
    return false;
  } else {
    setSuccess(email);
    return true;
  }
}

function validatePhoneInput() {
  const phonePattern = /^[0-9]*$/;
  const isPhoneValid = phonePattern.test(phone.value);

  if (!isPhoneValid) {
    setError(phone, "Enter numbers only");
    return false;
  } else if (phone.value.length < 10) {
    setError(phone, "Phone number must be 10 digits");
    return false;
  } else {
    setSuccess(phone);
    return true;
  }
}
