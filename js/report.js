// ============================================
// MONTHLY REPORT
// ============================================

let reportEmployee = null;
let currentReportRecords = [];



document.addEventListener(
    "DOMContentLoaded",
    async function () {

        reportEmployee =
            requireLogin();


        if (!reportEmployee) {
            return;
        }


        document.getElementById(
            "reportEmployeeName"
        ).textContent =
            reportEmployee.name;


        document.getElementById(
            "reportEmployeeId"
        ).textContent =
            reportEmployee.employeeId;


        const month =
            document.getElementById(
                "month"
            );


        if (month) {

            month.value =
                new Date()
                    .toISOString()
                    .substring(0, 7);

        }


        await loadMonthlyReport();

    }
);



// ============================================
// LOAD REPORT
// ============================================

async function loadMonthlyReport() {

    try {

        const month =
            document.getElementById(
                "month"
            ).value;


        if (!month) {

            alert(
                "Please select a month."
            );

            return;

        }


        const records =
            await getAllRecords();


        currentReportRecords =
            records.filter(
                record =>

                    String(
                        record.employeeId
                    ) === String(
                        reportEmployee.employeeId
                    )

                    &&

                    record.month === month
            );


        currentReportRecords.sort(
            (a, b) =>
                a.date.localeCompare(
                    b.date
                )
        );


        displayReport(
            currentReportRecords
        );


        calculateReportSummary(
            currentReportRecords
        );

    }
    catch (error) {

        console.error(
            "Report error:",
            error
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
        return;
    }


    table.innerHTML = "";


    if (records.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="5"
                    style="text-align:center;">

                    No records found for
                    selected month.

                </td>

            </tr>

        `;

        return;

    }



    records.forEach(
        record => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${record.date}
                </td>

                <td>
                    ${record.otHours}
                </td>

                <td>
                    ${escapeHTML(
                        record.extraDuty || "-"
                    )}
                </td>

                <td>
                    ${record.extraHours}
                </td>

                <td>
                    ${escapeHTML(
                        record.remarks || "-"
                    )}
                </td>

            `;


            table.appendChild(row);

        }
    );

}



// ============================================
// SUMMARY
// ============================================

function calculateReportSummary(
    records
) {

    let totalOT = 0;

    let totalExtra = 0;


    records.forEach(
        record => {

            totalOT +=
                Number(
                    record.otHours
                ) || 0;


            totalExtra +=
                Number(
                    record.extraHours
                ) || 0;

        }
    );


    document.getElementById(
        "totalOT"
    ).textContent =
        totalOT;


    document.getElementById(
        "totalExtra"
    ).textContent =
        totalExtra;


    document.getElementById(
        "totalRecords"
    ).textContent =
        records.length;

}



// ============================================
// DOWNLOAD EXCEL-COMPATIBLE CSV
// ============================================

function downloadExcel() {

    if (
        currentReportRecords.length === 0
    ) {

        alert(
            "Please load a report first."
        );

        return;

    }


    const month =
        document.getElementById(
            "month"
        ).value;


    const rows = [];


    rows.push([
        "Employee ID",
        "Employee Name",
        "Date",
        "OT Hours",
        "Extra Duty",
        "Extra Duty Hours",
        "Remarks"
    ]);


    currentReportRecords.forEach(
        record => {

            rows.push([

                record.employeeId,

                record.employeeName,

                record.date,

                record.otHours,

                record.extraDuty || "",

                record.extraHours,

                record.remarks || ""

            ]);

        }
    );


    const csv =
        rows
            .map(
                row =>
                    row.map(
                        value =>
                            csvEscape(value)
                    ).join(",")
            )
            .join("\n");


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
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href = url;


    link.download =
        `${reportEmployee.employeeId}_${month}_OT_Report.csv`;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}



// ============================================
// CSV ESCAPE
// ============================================

function csvEscape(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    const text =
        String(value);


    if (
        text.includes(",") ||
        text.includes('"') ||
        text.includes("\n")
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
