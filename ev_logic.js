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
    const startTimeInput = document.getElementById('start-time-input');
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    // Rate Inputs
    const ratePeakInput = document.getElementById('rate-peak');
    const rateShoulderInput = document.getElementById('rate-shoulder');
    const rateOffPeakInput = document.getElementById('rate-off-peak');
    const rateNightSaverInput = document.getElementById('rate-night-saver');

    // Display Elements
    const batteryFill = document.getElementById('battery-fill');
    const displayPercent = document.getElementById('display-percent');
    const energyNeededLabel = document.getElementById('energy-needed');
    const chargingTimeLabel = document.getElementById('charging-time');
    const totalCostLabel = document.getElementById('total-cost');
    const finishTimeLabel = document.getElementById('finish-time');
    const tipText = document.getElementById('tip-text');

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

    // ToU Helper: Get rate for a specific hour
    const getRateForHour = (hour) => {
        const peak = parseFloat(ratePeakInput.value);
        const shoulder = parseFloat(rateShoulderInput.value);
        const offPeak = parseFloat(rateOffPeakInput.value);
        const nightSaver = parseFloat(rateNightSaverInput.value);

        // Night Saver: 12am - 6am
        if (hour >= 0 && hour < 6) return nightSaver;
        // Shoulder (Midday Solar Soak): 10am - 2pm
        if (hour >= 10 && hour < 14) return shoulder;
        // Peak: 4pm - 8pm
        if (hour >= 16 && hour < 20) return peak;
        // Off-Peak: 6am-10am, 2pm-4pm, 8pm-12am
        return offPeak;
    };

    // Calculate cost for a duration starting at a specific time
    const calculateCostForSession = (startHour, startMin, durationHours) => {
        let totalCost = 0;
        let remainingDuration = durationHours;
        let currentHour = startHour;
        let currentMin = startMin;

        // Calculate for the first partial hour
        const firstHourFraction = (60 - currentMin) / 60;
        const consumeInFirstHour = Math.min(remainingDuration, firstHourFraction);
        totalCost += consumeInFirstHour * getRateForHour(currentHour);
        
        remainingDuration -= consumeInFirstHour;
        currentHour = (currentHour + 1) % 24;

        // Calculate for subsequent full hours
        while (remainingDuration >= 1) {
            totalCost += 1 * getRateForHour(currentHour);
            remainingDuration -= 1;
            currentHour = (currentHour + 1) % 24;
        }

        // Calculate for the last partial hour
        if (remainingDuration > 0) {
            totalCost += remainingDuration * getRateForHour(currentHour);
        }

        return totalCost;
    };

    // Main Calculation Function
    const calculate = () => {
        const capacity = parseFloat(batteryCapacityInput.value) || 0;
        const current = parseFloat(currentLevelInput.value) || 0;
        let target = parseFloat(targetLevelInput.value) || 0;
        const power = parseFloat(chargerPowerInput.value) || 0;
        const startTimeStr = startTimeInput.value;

        // Validation: Target cannot be less than current
        if (target < current) {
            target = current;
            targetLevelInput.value = target;
            targetLevelRange.value = target;
        }

        const energyNeeded = capacity * (target - current) / 100;
        const timeInHours = power > 0 ? energyNeeded / power : 0;
        
        // Time & Cost Calculation
        const [startH, startM] = startTimeStr.split(':').map(Number);
        
        // Power is energy per hour, so cost per hour is power * rate
        // But we need (energy per session) * average rate.
        // sessionCost = calculateCostForSession(...) * power
        const cost = calculateCostForSession(startH, startM, timeInHours) * power;

        // Update UI
        energyNeededLabel.textContent = energyNeeded.toFixed(1);
        
        const hours = Math.floor(timeInHours);
        const minutes = Math.round((timeInHours - hours) * 60);
        chargingTimeLabel.textContent = `${hours}h ${minutes}m`;
        
        totalCostLabel.textContent = cost.toFixed(2);

        // Calculate Finish Time
        if (timeInHours > 0) {
            const now = new Date();
            const startDateTime = new Date();
            startDateTime.setHours(startH, startM, 0, 0);
            
            const finishDate = new Date(startDateTime.getTime() + timeInHours * 60 * 60 * 1000);
            const finishHours = finishDate.getHours().toString().padStart(2, '0');
            const finishMinutes = finishDate.getMinutes().toString().padStart(2, '0');
            finishTimeLabel.textContent = `${finishHours}:${finishMinutes}`;
            
            // Smart Tip: Compare current cost with starting at 12am (Night Saver)
            const nightCost = calculateCostForSession(0, 0, timeInHours) * power;
            if (startH !== 0 && cost > nightCost + 0.1) {
                const savings = cost - nightCost;
                tipText.innerHTML = `Start at <strong>12:00 AM</strong> to save <strong>$${savings.toFixed(2)}</strong> (Night Saver rate)`;
            } else if (startH >= 16 && startH < 20) {
                tipText.innerHTML = `You are charging during <strong>Peak hours</strong>. Try after 8pm to save.`;
            } else {
                tipText.innerHTML = `You've chosen a good time to charge!`;
            }
        } else {
            finishTimeLabel.textContent = '--:--';
            tipText.innerHTML = `Adjust settings to see charging recommendations.`;
        }

        // Update Battery Visual
        batteryFill.style.width = `${target}%`;
        displayPercent.textContent = `${target}%`;
        
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
    startTimeInput.addEventListener('input', calculate);
    [ratePeakInput, rateShoulderInput, rateOffPeakInput, rateNightSaverInput].forEach(input => {
        input.addEventListener('input', calculate);
    });

    // Initial Calculation
    calculate();
});
