// AI Vision Logic using Teachable Machine Image Model

const URL = "https://teachablemachine.withgoogle.com/models/fmEk41nx-/";

let model, webcam, labelContainer, maxPredictions;
let isModelLoaded = false;
let isLive = false;

// Preload the model when the page loads
async function preloadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    const loadingText = document.getElementById("loading-text");
    
    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        isModelLoaded = true;
        
        // Setup initial UI for results
        labelContainer = document.getElementById("label-container");
        createLabelItems();

        // Hide initial loading overlay
        const loader = document.getElementById("loading-overlay");
        loader.style.opacity = "0";
        setTimeout(() => loader.style.display = "none", 500);
        
        console.log("Model loaded successfully");
    } catch (error) {
        console.error("Model loading failed:", error);
        if (loadingText) loadingText.innerText = "모델 로드 실패. 인터넷 연결을 확인하세요.";
    }
}

function createLabelItems() {
    labelContainer.innerHTML = "";
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
}

// Setup the webcam and start recognition
async function startCamera() {
    if (!isModelLoaded) {
        alert("모델이 아직 로드되지 않았습니다. 잠시만 기다려주세요.");
        return;
    }

    const connectBtn = document.getElementById("connect-btn");
    const setupContainer = document.getElementById("setup-container");
    const loader = document.getElementById("loading-overlay");
    const loadingText = document.getElementById("loading-text");

    try {
        loadingText.innerText = "카메라 연결 중...";
        loader.style.display = "flex";
        loader.style.opacity = "1";
        connectBtn.disabled = true;

        const flip = true;
        webcam = new tmImage.Webcam(400, 400, flip);
        
        await webcam.setup();
        await webcam.play();
        isLive = true;
        window.requestAnimationFrame(loop);

        document.getElementById("webcam-container").innerHTML = "";
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        
        setupContainer.style.display = "none";
        loader.style.opacity = "0";
        setTimeout(() => loader.style.display = "none", 500);

    } catch (error) {
        console.error("Camera setup failed:", error);
        loader.style.display = "none";
        connectBtn.disabled = false;
        alert("카메라 연결에 실패했습니다. 권한 허용 여부를 확인해 주세요.");
    }
}

// Handle image upload and prediction
async function handleImageUpload(event) {
    if (!isModelLoaded) {
        alert("모델이 아직 로드되지 않았습니다.");
        return;
    }

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
            isLive = false; // Stop webcam loop if running
            
            const container = document.getElementById("webcam-container");
            container.innerHTML = "";
            container.appendChild(img);
            
            document.getElementById("setup-container").style.display = "none";
            
            await predict(img);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

async function loop() {
    if (isLive && webcam && webcam.canvas) {
        webcam.update();
        await predict(webcam.canvas);
        window.requestAnimationFrame(loop);
    }
}

// Run the image/canvas through the image model
async function predict(inputElement) {
    const prediction = await model.predict(inputElement);
    
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        const item = labelContainer.childNodes[i];
        if (!item) continue;

        const nameElement = item.querySelector(".result-name");
        const valueElement = item.querySelector(".result-value");
        const barElement = item.querySelector(".progress-bar-fill");
        
        nameElement.innerHTML = classPrediction;
        valueElement.innerHTML = probability + "%";
        barElement.style.width = probability + "%";
        
        if (prediction[i].probability > 0.5) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    }
}

// Event Listeners
window.addEventListener("DOMContentLoaded", () => {
    preloadModel();
    document.getElementById("connect-btn").addEventListener("click", startCamera);
    document.getElementById("image-upload").addEventListener("change", handleImageUpload);
});
