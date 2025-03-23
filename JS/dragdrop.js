document.addEventListener("DOMContentLoaded", function () {
  const dragDropZone = document.getElementById("dragDropZone");
  let droppedFile = null;
  let dragEnabled = true;

  ["dragenter", "dragover"].forEach((evt) => {
    dragDropZone.addEventListener(evt, (e) => {
      if (!dragEnabled) return;
      e.preventDefault();
      dragDropZone.classList.add("highlight");
    });
  });

  ["dragleave", "drop"].forEach((evt) => {
    dragDropZone.addEventListener(evt, (e) => {
      if (!dragEnabled) return;
      e.preventDefault();
      dragDropZone.classList.remove("highlight");
    });
  });

  dragDropZone.addEventListener("drop", (e) => {
    if (!dragEnabled) return;
    e.preventDefault();
    dragDropZone.classList.remove("highlight");
    const file = e.dataTransfer.files[0];
    if (!file) return;
    dragEnabled = false;
    window.setDroppedFile(file); // set global file

    const reader = new FileReader();
    reader.onload = function (ev) {
      const fileName = file.name;
      const fileSize = file.size;
      const formattedSize = fileSize < 1024 ? fileSize + " bytes" : (fileSize/1024).toFixed(2) + " KB";
      dragDropZone.style.border = "none"; // hide border
      dragDropZone.innerHTML = `
        <div style="display: flex; align-items: center;">
          <div style="flex: 1; text-align: center;">
            <img src="${ev.target.result}" style="max-width: 100%; max-height: 100%;" />
          </div>
          <div style="flex: 1; padding-left: 20px; text-align: left;">
            <p>Filename: ${fileName}</p>
            <p>Size: ${formattedSize}</p>
          </div>
        </div>
      `;
    };
    reader.readAsDataURL(file);
  });

  dragDropZone.addEventListener("click", () => {
    if (!dragEnabled) return; // disable clicking after image is inserted
    document.getElementById("hiddenFileInput").click();
  });

  const hiddenFileInput = document.getElementById("hiddenFileInput");
  hiddenFileInput.addEventListener("change", () => {
    const file = hiddenFileInput.files[0];
    if (!file) return;
    dragEnabled = false;
    window.setDroppedFile(file); // set global file

    const reader = new FileReader();
    reader.onload = function (ev) {
      const fileName = file.name;
      const fileSize = file.size;
      const formattedSize = fileSize < 1024 ? fileSize + " bytes" : (fileSize/1024).toFixed(2) + " KB";
      dragDropZone.style.background = "none"; 
      dragDropZone.style.cursor = "default";
      dragDropZone.innerHTML = `
        <div style="display: flex; align-items: center;">
          <div style="flex: 1; text-align: center;">
            <img src="${ev.target.result}" style="width: 70%; height: 70%;" />
          </div>
          <div style="flex: 1; padding-left: 20px; text-align: left; color:rgb(215, 215, 215);">
            <p>Filename: ${fileName}</p>
            <p>Size: ${formattedSize}</p>
          </div>
        </div>
      `;
    };
    reader.readAsDataURL(file);
  });
});

