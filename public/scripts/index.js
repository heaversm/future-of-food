const init = () => {
  addEventListeners();
  console.log("init");
  //fetchOpenAI();
};

const gotoSection = (sectionID) => {
  const currentButton = document.querySelector(`.form-group-button.active`);
  const currentID = parseInt(currentButton.dataset.id);
  const currentSection = document.querySelector(
    `.form-group[data-id="${currentID}"]`
  );

  const nextSection = document.querySelector(
    `.form-group[data-id="${sectionID}"]`
  );
  const nextButton = document.querySelector(
    `.form-group-button[data-id="${sectionID}"]`
  );
  nextButton.classList.toggle("active", true);
  currentButton.classList.toggle("active", false);
  currentSection.classList.toggle("hidden", true);
  nextSection.classList.toggle("hidden", false);
};

const gotoNextSection = (currentID) => {
  const currentSection = document.querySelector(
    `.form-group[data-id="${currentID}"]`
  );

  const curNavButton = document.querySelector(
    `.form-group-button[data-id="${currentID}"]`
  );
  const nextSection = document.querySelector(
    `.form-group[data-id="${currentID + 1}"]`
  );
  const nextNavButton = document.querySelector(
    `.form-group-button[data-id="${currentID + 1}"]`
  );
  if (nextSection) {
    currentSection.classList.toggle("hidden", true);
    nextSection.classList.toggle("hidden", false);
    curNavButton.classList.toggle("active", false);
    if (nextNavButton) {
      nextNavButton.classList.toggle("active", true);
    } else {
      console.log("end");
    }
  }

  const doSubmit = currentSection.dataset.submit === "false" ? false : true;
  if (doSubmit) {
    const curForm = currentSection.closest("form");
    console.log(curForm);
    handleFormSubmit(curForm);
  }
};

const addEventListeners = () => {
  document.getElementById("submit").addEventListener("click", (e) => {
    e.preventDefault();
    handleFormSubmit(e.target.closest(".prompt-form"), true);
  });
  const nextButtons = document.querySelectorAll(".next");
  nextButtons.forEach((nextButton) => {
    nextButton.addEventListener("click", (e) => {
      e.preventDefault();
      gotoNextSection(parseInt(e.target.closest(".form-group").dataset.id));
    });
  });
  const navButtons = document.querySelectorAll(".form-group-button");
  navButtons.forEach((navButton) => {
    navButton.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionNumber = parseInt(e.target.dataset.id);
      gotoSection(sectionNumber);
    });
  });
};

const createImageGroup = (imageGroup, index) => {
  const imageEls = [];
  for (imageUrl of imageGroup) {
    const imageEl = document.createElement("img");
    imageEl.src = imageUrl;
    imageEls.push(imageEl);
    document.getElementById(`output-image${index}`).appendChild(imageEl);
  }

  for (image of imageEls) {
    image.addEventListener("click", (e) => {
      const currentImage = e.currentTarget;
      imageEls.forEach((unclickedImage) => {
        unclickedImage.classList.toggle("hidden", true);
        currentImage.classList.toggle("hidden", false);
      });
      const instructionEl =
        currentImage.closest(".output-group").firstElementChild;
      instructionEl.classList.toggle("hidden", true);
    });
  }
};

const createStory = (story, index) => {
  document.getElementById(`output-story${index}`).innerText = story;
};

const handleFormSubmit = (form, isFinal = false) => {
  //const form = document.getElementById("form");
  console.log(form);
  const formData = new FormData(form);
  const formID = form.dataset.id;
  formData.append("formID", formID);
  const formBody = new URLSearchParams(formData);

  document.getElementById("status").innerHTML =
    "Generating the future takes a while. Please be patient...";

  fetch("api/generate", {
    method: "POST",
    body: formBody,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.log(data.error);
        document.getElementById("status").innerHTML = data.error;
      } else {
        //hideForm(true);
        console.log(data);
        const { imageArray, storyResponse, formID, message } = data;
        document.getElementById("status").innerHTML = message;
        const imageGroup = createImageGroup(imageArray, formID);
        const story = createStory(storyResponse, formID);
        if (isFinal) {
          hideForm(true);
        }
      }
    })
    .catch((error) => {
      // Handle any errors that occur during the API request
      console.error("Error submitting form:", error);
      document.getElementById("status").innerHTML = "Error submitting form";
    });
};

const hideForm = (doHide = false) => {
  document.getElementById("section-form").classList.toggle("hidden", doHide);
  document.getElementById("section-output").classList.toggle("hidden", !doHide);
};

const fetchOpenAI = (e) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(`/api/generate/`, options)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const image1El = `<img src="${data.image_url}" />`;
      //insert image1El into document body
      document.body.innerHTML = image1El;
    });
};

window.addEventListener("DOMContentLoaded", function () {
  init();
});
