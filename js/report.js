// ============================================
// OFFICE OT REGISTER - MONTHLY REPORT
// ============================================

let reportEmployee = null;
let currentReportRecords = [];


// ============================================
// PAGE LOAD
// ============================================

document.addEventListener("DOMContentLoaded", async function () {

    reportEmployee = requireLogin();

    if (!reportEmployee) {
        return;
    }

    // Employee name
    const employeeName =
        document.getElementById("reportEmployeeName");

    if (employeeName) {
        employeeName.textContent =
            reportEmployee.name;
    }


    // Employee ID
    const employeeId =
        document.getElementById("reportEmployeeId");

    if (employeeId) {
        employeeId.textContent =
            reportEmployee.employeeId;
    }


    // Month
    const month =
        document.getElementById("month");

    if (month) {

        month.value =
            new Date()
                .toISOString()
                .substring(0, 7);

    }


    // Load report
    await loadMonthlyReport();

});


// ============================================
// LOAD MONTHLY REPORT
// ============================================

async function loadMonthlyReport() {

    try {

        if (!reportEmployee) {
            return;
        }


        const monthElement =
            document.getElementById("month");


        if (!monthElement) {

            console.error(
                "Month input not found."
            );

            return;
        }


        const selectedMonth =
            monthElement.value;


        if (!selectedMonth) {

            alert(
                "Please select a month."
            );

            return;
        }


        // Get all saved OT records
        const allRecords =
            await getAllRecords();


        // Filter employee + month
        currentReportRecords =
            allRecords.filter(function (record) {

                return (

                    String(record.employeeId) ===
                    String(reportEmployee.employeeId)

                    &&

                    record.month ===
                    selectedMonth

                );

            });


        // Sort by date
        currentReportRecords.sort(
            function (a, b) {

                return a.date.localeCompare(
                    b.date
                );

            }
        );


        // Display
        displayReport(
            currentReportRecords
        );


        // Calculate totals
        calculateReportSummary(
            currentReportRecords
        );

    }
    catch (error) {

        console.error(
            "Monthly report error:",
            error
        );

        alert(
            "Unable to load monthly report."
        );

    }

}


// ============================================
// DISPLAY REPORT
// ============================================

function displayReport(records) {

    const table =
        document.getElementById(
            "reportTable"
        );


    if (!table) {

        console.error(
            "reportTable not found."
        );

        return;
    }


    table.innerHTML = "";


    // No records
    if (records.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="5"
                    style="text-align:center;">

                    No OT records found
                    for this month.

                </td>

            </tr>

        `;

        return;
    }


    // Create rows
    records.forEach(function (record) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(record.date)}
            </td>

            <td>
                ${Number(record.otHours) || 0}
            </td>

            <td>
                ${escapeHTML(
                    record.extraDuty || "-"
                )}
            </td>

            <td>
                ${Number(record.extraHours) || 0}
            </td>

            <td>
                ${escapeHTML(
                    record.remarks || "-"
                )}
            </td>

        `;


        table.appendChild(row);

    });

}


// ============================================
// CALCULATE SUMMARY
// ============================================

function calculateReportSummary(records) {

    let totalOT = 0;
    let totalExtra = 0;


    records.forEach(function (record) {

        totalOT +=
            Number(record.otHours) || 0;


        totalExtra +=
            Number(record.extraHours) || 0;

    });


    // Total OT
    const totalOTElement =
        document.getElementById(
            "totalOT"
        );


    if (totalOTElement) {

        totalOTElement.textContent =
            totalOT;

    }


    // Total Extra
    const totalExtraElement =
        document.getElementById(
            "totalExtra"
        );


    if (totalExtraElement) {

        totalExtraElement.textContent =
            totalExtra;

    }


    // Total Records
    const totalRecordsElement =
        document.getElementById(
            "totalRecords"
        );


    if (totalRecordsElement) {

        totalRecordsElement.textContent =
            records.length;

    }

}


// ============================================
// DOWNLOAD EXCEL REPORT
// ============================================

function downloadExcel() {

    if (
        !currentReportRecords ||
        currentReportRecords.length === 0
    ) {

        alert(
            "No records available to download."
        );

        return;
    }


    const monthElement =
        document.getElementById(
            "month"
        );


    const selectedMonth =
        monthElement
            ? monthElement.value
            : "";


    const rows = [];


    // Header
    rows.push([

        "Employee ID",
        "Employee Name",
        "Department",
        "Designation",
        "Date",
        "OT Hours",
        "Extra Duty",
        "Extra Duty Hours",
        "Remarks"

    ]);


    // Data
    currentReportRecords.forEach(
        function (record) {

            rows.push([

                record.employeeId || "",

                record.employeeName || "",

                reportEmployee.department || "",

                reportEmployee.designation || "",

                record.date || "",

                Number(record.otHours) || 0,

                record.extraDuty || "",

                Number(record.extraHours) || 0,

                record.remarks || ""

            ]);

        }
    );


    // Convert to CSV
    const csv =
        rows
            .map(function (row) {

                return row
                    .map(function (value) {

                        return csvEscape(value);

                    })
                    .join(",");

            })
            .join("\n");


    // Create file
    const blob =
        new Blob(
            [
                "\uFEFF" + csv
            ],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    // Create download link
    const link =
        document.createElement("a");


    link.href = url;


    link.download =
        `${reportEmployee.employeeId}_${selectedMonth}_OT_Report.csv`;


    document.body.appendChild(link);


    link.click();


    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}


// ============================================
// CSV ESCAPE
// ============================================

function csvEscape(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    const text =
        String(value);


    // If comma, quote or new line exists
    if (
        text.includes(",") ||
        text.includes('"') ||
        text.includes("\n") ||
        text.includes("\r")
    ) {

        return (
            '"' +
            text.replace(
                /"/g,
                '""'
            ) +
            '"'
        );

    }


    return text;

}


// ============================================
// HTML ESCAPE
// ============================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
