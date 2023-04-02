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
        // console.log(data);
        document.getElementById("status").innerHTML = data.message;
        //create an image element with a src of data.image_url0
        const imageGroups = createImageGroups(data.imageGroups);
        // const image1El0 = document.createElement("img");
        // image1El0.src = data.image1_url0;
        // document.getElementById("output-image1").appendChild(image1El0);
        // const image1El1 = document.createElement("img");
        // image1El1.src = data.image1_url1;
        // document.getElementById("output-image1").appendChild(image1El1);
        // const image1El2 = document.createElement("img");
        // image1El2.src = data.image1_url2;
        // document.getElementById("output-image1").appendChild(image1El2);
        // const image1El3 = document.createElement("img");
        // image1El3.src = data.image1_url3;
        // document.getElementById("output-image1").appendChild(image1El3);

        // const image1Array = [image1El0, image1El1, image1El2, image1El3];
        // for (img of image1Array) {
        //   img.addEventListener("click", (e) => {
        //     image1Array.forEach((img1) => {
        //       img1.classList.toggle("hidden", true);
        //       e.currentTarget.classList.toggle("hidden", false);
        //     });
        //   });
        // }
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
