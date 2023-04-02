const init = () => {
  addEventListeners();
  console.log("init");
  //fetchOpenAI();
};

const addEventListeners = () => {
  document.getElementById("submit").addEventListener("click", handleFormSubmit);
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  const form = document.getElementById("form");
  const formData = new URLSearchParams(new FormData(form));
  // console.log(formData);
  document.getElementById("status").innerHTML = "Generating...";

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
        console.log(data);
        document.getElementById("status").innerHTML = data.message;
        //create an image element with a src of data.image_url0
        const imageEl0 = document.createElement("img");
        imageEl0.src = data.image_url0;
        document.getElementById("output-image1").appendChild(imageEl0);
        const imageEl1 = document.createElement("img");
        imageEl1.src = data.image_url1;
        document.getElementById("output-image1").appendChild(imageEl1);
        const imageEl2 = document.createElement("img");
        imageEl2.src = data.image_url2;
        document.getElementById("output-image1").appendChild(imageEl2);
        const imageEl3 = document.createElement("img");
        imageEl3.src = data.image_url3;
        document.getElementById("output-image1").appendChild(imageEl3);
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
      const imageEl = `<img src="${data.image_url}" />`;
      //insert imageEl into document body
      document.body.innerHTML = imageEl;
    });
};

window.addEventListener("DOMContentLoaded", function () {
  init();
});
