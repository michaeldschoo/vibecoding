// Teachable Machine Image Model Logic
// URL은 사용자가 직접 교체할 수 있도록 자리표시자를 사용합니다.
const URL = "https://teachablemachine.withgoogle.com/models/I-q_G_u8u/"; // 예시 URL (교체 필요 시 이 부분을 수정하세요)

let model, webcam, labelContainer, maxPredictions;

async function init() {
    const startBtn = document.getElementById("start-btn");
    startBtn.disabled = true;
    startBtn.textContent = "모델 로딩 중...";

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        // 모델 로드
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // 웹캠 설정 (모바일 호환성을 위해 facingMode 설정 권장)
        const flip = true; // 전면 카메라인 경우 true
        webcam = new tmImage.Webcam(300, 300, flip); 
        
        // 모바일 브라우저 권한 요청 및 시작
        await webcam.setup({ facingMode: "user" }); // 'user'는 전면, 'environment'는 후면
        await webcam.play();
        window.requestAnimationFrame(loop);

        // UI 업데이트
        startBtn.style.display = "none";
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) {
            const div = document.createElement("div");
            div.className = "prediction-bar";
            div.innerHTML = `<span class="bar-name">-</span><span class="bar-value">0%</span>`;
            labelContainer.appendChild(div);
        }
    } catch (e) {
        console.error(e);
        alert("카메라를 시작할 수 없습니다. HTTPS 환경인지, 카메라 권한이 허용되었는지 확인해주세요.");
        startBtn.disabled = false;
        startBtn.textContent = "다시 시도하기";
    }
}

async function loop() {
    webcam.update(); // 웹캠 프레임 업데이트
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0) + "%";
        
        const bar = labelContainer.childNodes[i];
        bar.querySelector(".bar-name").textContent = classPrediction;
        bar.querySelector(".bar-value").textContent = probability;
        
        // 확률에 따른 강조 스타일 (선택 사항)
        if (prediction[i].probability > 0.5) {
            bar.style.background = "rgba(74, 144, 226, 0.2)";
        } else {
            bar.style.background = "rgba(255, 255, 255, 0.05)";
        }
    }
}

document.getElementById("start-btn").addEventListener("click", init);
