// AI Vision Logic using Teachable Machine Image Model

const URL = "https://teachablemachine.withgoogle.com/models/fmEk41nx-/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        // Load the model and metadata
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(400, 400, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // Append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        
        // Create result items for each class
        for (let i = 0; i < maxPredictions; i++) {
            const resultItem = document.createElement("div");
            resultItem.className = "result-item";
            resultItem.innerHTML = `
                <div class="result-header">
                    <span class="result-name">---</span>
                    <span class="result-value">0%</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: 0%"></div>
                </div>
            `;
            labelContainer.appendChild(resultItem);
        }

        // Hide loading overlay
        const loader = document.getElementById("loading-overlay");
        loader.style.opacity = "0";
        setTimeout(() => loader.style.display = "none", 500);

    } catch (error) {
        console.error("Initialization failed:", error);
        alert("카메라 권한을 허용하거나 모델을 불러오는 데 실패했습니다.");
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// Run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        const item = labelContainer.childNodes[i];
        const nameElement = item.querySelector(".result-name");
        const valueElement = item.querySelector(".result-value");
        const barElement = item.querySelector(".progress-bar-fill");
        
        nameElement.innerHTML = classPrediction;
        valueElement.innerHTML = probability + "%";
        barElement.style.width = probability + "%";
        
        // Highlight the most confident result
        if (prediction[i].probability > 0.5) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    }
}

// Start the application
window.addEventListener("DOMContentLoaded", init);
