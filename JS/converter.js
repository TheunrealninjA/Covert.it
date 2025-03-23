document.addEventListener("DOMContentLoaded", () => {
  window.setDroppedFile = function (file) {
    droppedFile = file;
  };

  const fileForm = document.getElementById("fileForm");
  const button = document.getElementById("button");
  const convertButton = document.querySelector(".submit");
  if (!fileForm) return;

  fileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fileInput = document.getElementById("hiddenFileInput");
    const errorBox = document.getElementById("errorBox");
    const successBox = document.getElementById("successBox");

    if (!fileInput || !fileInput.files[0]) {
      successBox.innerHTML = ''; // Clear success message
      errorBox.innerHTML =
        '<img src="Images/Error.webp" alt="Error Icon" style="width:75px;"> No file selected!';
      errorBox.classList.add("show");
      setTimeout(() => {
        errorBox.classList.remove("show");
        errorBox.innerHTML = '<img src="Images/Error.webp" alt="Error Icon" style="width:75px;">';
      }, 3000);
      return;
    }

    const selectedFormat = document.getElementById("outputFormat").value;
    const formatMap = {
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      tiff: "image/tiff",
      ico: "image/x-icon"
    };
    const mimeType = formatMap[selectedFormat] || "image/jpeg";
    
    const quality = parseFloat(document.getElementById("qualitySlider").value) || 1.0;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const convertedData = canvas.toDataURL(mimeType, quality);
        const link = document.createElement("a");
        link.href = convertedData;
        link.download = fileInput.files[0].name.replace(/\.\w+$/, `.${selectedFormat}`);
        
        errorBox.innerHTML = ''; // Clear error message
        successBox.innerHTML =
          '<img src="Images/CheckMark.webp" alt="Success Icon" style="width:75px;"> Conversion successful!';

        const downloadButton = document.createElement("button");
        downloadButton.textContent = "Download";
        downloadButton.style.backgroundColor = "#4caf50";
        downloadButton.style.color = "white";
        downloadButton.style.border = "none";
        downloadButton.style.padding = "10px";
        downloadButton.style.width = "68%";
        downloadButton.style.fontSize = "16px";
        downloadButton.style.display = "inline-block";
        downloadButton.style.cursor = "pointer";
        downloadButton.onclick = () => {
          link.click();
        };

        const convertMoreButton = document.createElement("button");
        convertMoreButton.textContent = "Convert More";
        convertMoreButton.style.backgroundColor = "#808080";
        convertMoreButton.style.color = "white";
        convertMoreButton.style.border = "none";
        convertMoreButton.style.padding = "10px";
        convertMoreButton.style.width = "28%";
        convertMoreButton.style.marginLeft = "4%";
        convertMoreButton.style.fontSize = "16px";
        convertMoreButton.style.display = "inline-block";
        convertMoreButton.style.cursor = "pointer";
        convertMoreButton.onclick = () => {
          button.innerHTML = ''; // Clear buttons
          convertButton.style.display = "block"; // Show convert button
        };

        button.appendChild(downloadButton);
        button.appendChild(convertMoreButton);

        successBox.classList.add("show");
        convertButton.style.display = "none"; // Hide convert button

        setTimeout(() => {
          successBox.classList.remove("show");
          successBox.innerHTML = '<img src="Images/CheckMark.webp" alt="Success Icon" style="width:75px;">';
        }, 3000);
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
  });
});
