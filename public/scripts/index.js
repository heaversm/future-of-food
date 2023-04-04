const init = () => {
  addEventListeners();
  console.log("init");
  //fetchOpenAI();
};

const addEventListeners = () => {
  document.getElementById("submit").addEventListener("click", handleFormSubmit);
};

const createImageGroups = (imageGroups) => {
  imageGroups.forEach((imageGroup, index) => {
    const imageEls = [];
    for (imageUrl of imageGroup) {
      const imageEl = document.createElement("img");
      imageEl.src = imageUrl;
      imageEls.push(imageEl);
      document.getElementById(`output-image${index}`).appendChild(imageEl);
    }

    for (image of imageEls) {
      image.addEventListener("click", (e) => {
        imageEls.forEach((unclickedImage) => {
          unclickedImage.classList.toggle("hidden", true);
          e.currentTarget.classList.toggle("hidden", false);
        });
      });
    }
  });
};

const createStories = (stories) => {
  stories.forEach((story, index) => {
    // const storyEl = document.createElement("p");
    // storyEl.innerHTML = story;
    // document.getElementById(`output-story${index}`).appendChild(storyEl);
    document.getElementById(`output-story${index}`).innerText = story;
  });
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  const form = document.getElementById("form");
  const formData = new URLSearchParams(new FormData(form));
  // console.log(formData);
  document.getElementById("status").innerHTML =
    "Generating the future takes a while. Please be patient...";

  fetch("api/generate", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.log(data.error);
        document.getElementById("status").innerHTML = data.error;
      } else {
        hideForm(true);
        // console.log(data);
        document.getElementById("status").innerHTML = data.message;
        const imageGroups = createImageGroups(data.imageGroups);
        const stories = createStories(data.storyCompletions);
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
