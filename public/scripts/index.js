const init = () => {
  console.log("init");
  fetchOpenAI();
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
