/**
 * Enterprise SOC Dashboard Interactive Controls (Optimized)
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Audit Trail Live Search Filter (Debounced)
    const searchInput = document.getElementById("audit-search");
    const tableRows = document.querySelectorAll("#audit-table-body tr");

    if (searchInput && tableRows.length > 0) {
        let debounceTimer = null;
        searchInput.addEventListener("input", (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const query = e.target.value.toLowerCase().trim();
                tableRows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(query)) {
                        row.style.display = "";
                    } else {
                        row.style.display = "none";
                    }
                });
            }, 150); // 150ms debounce
        });
    }

    // 2. CSV Export Handler
    const exportBtn = document.getElementById("btn-export-csv");
    if (exportBtn) {
        exportBtn.addEventListener("click", exportAuditTrailToCSV);
    }
});

/**
 * Export Audit Trail Table to CSV File
 */
function exportAuditTrailToCSV() {
    const table = document.getElementById("audit-trail-table");
    if (!table) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    const rows = table.querySelectorAll("tr");

    rows.forEach(row => {
        const cols = row.querySelectorAll("th, td");
        const rowData = [];
        cols.forEach(col => {
            let text = col.innerText.replace(/"/g, '""').trim();
            rowData.push(`"${text}"`);
        });
        csvContent += rowData.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Security_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    NIDS.showToast("Export Complete", "Security audit trail exported to CSV.", "success");
}
