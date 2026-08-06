/**
 * Academic Training Progress Handler & Chart Renderer (Optimized)
 */

let pollInterval = null;
let metricsChart = null;

const epochLabels = [];
const lossData = [];
const valLossData = [];
const accData = [];
const valAccData = [];

function initTrainingChart() {
    const ctx = document.getElementById('trainingChart');
    if (!ctx) return;

    metricsChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: epochLabels,
            datasets: [
                {
                    label: 'Train Loss',
                    data: lossData,
                    borderColor: '#DC2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.05)',
                    tension: 0.15,
                    fill: false,
                    pointRadius: 3
                },
                {
                    label: 'Val Loss',
                    data: valLossData,
                    borderColor: '#D97706',
                    borderDash: [4, 4],
                    tension: 0.15,
                    fill: false,
                    pointRadius: 3
                },
                {
                    label: 'Train Accuracy',
                    data: accData,
                    borderColor: '#16A34A',
                    backgroundColor: 'rgba(22, 163, 74, 0.05)',
                    tension: 0.15,
                    fill: false,
                    pointRadius: 3
                },
                {
                    label: 'Val Accuracy',
                    data: valAccData,
                    borderColor: '#1D4ED8',
                    borderDash: [4, 4],
                    tension: 0.15,
                    fill: false,
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false, // Instant render without lag
            scales: {
                x: {
                    grid: { color: '#E5E7EB' },
                    ticks: { color: '#4B5563' }
                },
                y: {
                    grid: { color: '#E5E7EB' },
                    ticks: { color: '#4B5563' },
                    suggestedMin: 0,
                    suggestedMax: 1
                }
            },
            plugins: {
                legend: { labels: { color: '#1F2937' } }
            }
        }
    });
}

function pollTrainingStatus() {
    if (pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(async () => {
        try {
            const res = await NIDS.apiFetch('/api/model/status');
            if (!res.ok) return;

            const status = await res.json();
            updateUIWithStatus(status);

            if (status.status === "Completed") {
                clearInterval(pollInterval);
                NIDS.showToast("Success", "Model training completed!", "success");
                document.getElementById("btn-view-report").classList.remove("d-none");
            } else if (status.status === "Failed") {
                clearInterval(pollInterval);
                NIDS.showToast("Error", status.message || "Training failed.", "danger");
            }
        } catch (err) {
            console.error("Status poll error:", err);
        }
    }, 1500);
}

function updateUIWithStatus(status) {
    const epochElem = document.getElementById("stat-epoch");
    const accElem = document.getElementById("stat-acc");
    const lossElem = document.getElementById("stat-loss");
    const valAccElem = document.getElementById("stat-val-acc");
    const etaElem = document.getElementById("stat-eta");
    const progressBar = document.getElementById("training-progress-bar");
    const statusText = document.getElementById("status-text");

    if (epochElem) epochElem.textContent = `${status.current_epoch} / ${status.total_epochs}`;
    if (accElem) accElem.textContent = `${(status.accuracy * 100).toFixed(2)}%`;
    if (lossElem) lossElem.textContent = status.loss;
    if (valAccElem) valAccElem.textContent = `${(status.val_accuracy * 100).toFixed(2)}%`;
    if (etaElem) etaElem.textContent = status.estimated_time_remaining;
    if (statusText) statusText.textContent = status.status;

    if (progressBar && status.total_epochs > 0) {
        const pct = Math.round((status.current_epoch / status.total_epochs) * 100);
        progressBar.style.width = `${pct}%`;
        progressBar.textContent = `${pct}%`;
    }

    if (metricsChart && status.current_epoch > 0) {
        const lastEpochInChart = epochLabels[epochLabels.length - 1];
        if (lastEpochInChart !== `Epoch ${status.current_epoch}`) {
            epochLabels.push(`Epoch ${status.current_epoch}`);
            lossData.push(status.loss);
            valLossData.push(status.val_loss);
            accData.push(status.accuracy);
            valAccData.push(status.val_accuracy);
            metricsChart.update('none'); // Update without canvas transition animation lag
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initTrainingChart();
});
