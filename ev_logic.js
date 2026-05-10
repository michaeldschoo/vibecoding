/**
 * EV Charging Calculator Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Input Elements
    const batteryCapacityRange = document.getElementById('battery-capacity-range');
    const batteryCapacityInput = document.getElementById('battery-capacity-input');
    const currentLevelRange = document.getElementById('current-level-range');
    const currentLevelInput = document.getElementById('current-level-input');
    const targetLevelRange = document.getElementById('target-level-range');
    const targetLevelInput = document.getElementById('target-level-input');
    const chargerPowerInput = document.getElementById('charger-power-input');
    const electricityRateInput = document.getElementById('electricity-rate-input');
    const presetButtons = document.querySelectorAll('.preset-btn');

    // Display Elements
    const batteryFill = document.getElementById('battery-fill');
    const displayPercent = document.getElementById('display-percent');
    const energyNeededLabel = document.getElementById('energy-needed');
    const chargingTimeLabel = document.getElementById('charging-time');
    const totalCostLabel = document.getElementById('total-cost');
    const finishTimeLabel = document.getElementById('finish-time');

    // Synchronize Range and Number Inputs
    const syncInputs = (range, input, callback) => {
        range.addEventListener('input', () => {
            input.value = range.value;
            callback();
        });
        input.addEventListener('input', () => {
            range.value = input.value;
            callback();
        });
    };

    // Main Calculation Function
    const calculate = () => {
        const capacity = parseFloat(batteryCapacityInput.value) || 0;
        const current = parseFloat(currentLevelInput.value) || 0;
        let target = parseFloat(targetLevelInput.value) || 0;
        const power = parseFloat(chargerPowerInput.value) || 0;
        const rate = parseFloat(electricityRateInput.value) || 0;

        // Validation: Target cannot be less than current
        if (target < current) {
            target = current;
            targetLevelInput.value = target;
            targetLevelRange.value = target;
        }

        const energyNeeded = capacity * (target - current) / 100;
        const timeInHours = power > 0 ? energyNeeded / power : 0;
        const cost = energyNeeded * rate;

        // Update UI
        energyNeededLabel.textContent = energyNeeded.toFixed(1);
        
        const hours = Math.floor(timeInHours);
        const minutes = Math.round((timeInHours - hours) * 60);
        chargingTimeLabel.textContent = `${hours}h ${minutes}m`;
        
        totalCostLabel.textContent = cost.toFixed(2);

        // Calculate Finish Time
        if (timeInHours > 0) {
            const now = new Date();
            const finishDate = new Date(now.getTime() + timeInHours * 60 * 60 * 1000);
            const finishHours = finishDate.getHours().toString().padStart(2, '0');
            const finishMinutes = finishDate.getMinutes().toString().padStart(2, '0');
            finishTimeLabel.textContent = `${finishHours}:${finishMinutes}`;
        } else {
            finishTimeLabel.textContent = '--:--';
        }

        // Update Battery Visual
        batteryFill.style.width = `${target}%`;
        displayPercent.textContent = `${target}%`;
        
        // Color transition based on target level
        if (target < 20) batteryFill.style.background = 'var(--secondary-color)';
        else if (target < 80) batteryFill.style.background = 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))';
        else batteryFill.style.background = 'var(--accent-color)';
    };

    // Event Listeners for Presets
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            presetButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            chargerPowerInput.value = btn.dataset.value;
            calculate();
        });
    });

    // Initialize Sync and Listeners
    syncInputs(batteryCapacityRange, batteryCapacityInput, calculate);
    syncInputs(currentLevelRange, currentLevelInput, calculate);
    syncInputs(targetLevelRange, targetLevelInput, calculate);
    
    chargerPowerInput.addEventListener('input', calculate);
    electricityRateInput.addEventListener('input', calculate);

    // Initial Calculation
    calculate();
});
