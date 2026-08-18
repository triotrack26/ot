let reportEmployee = null;

let reportRecords = [];


// ========================================
// INITIALIZE
// ========================================

async function initializeReport() {

    reportEmployee =
        await checkLogin();


    if (!reportEmployee) {

        return;
    }


    const monthInput =
        document.getElementById(
            "month"
        );


    const today =
        new Date();


    const defaultMonth =
        today.getFullYear() +
        "-" +
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    monthInput.value =
        defaultMonth;


    await loadMonthlyReport();
}


// ========================================
// LOAD REPORT
// ========================================

async function loadMonthlyReport() {

    if (!reportEmployee) {

        return;
    }


    const month =
        document.getElementById(
            "month"
        ).value;


    if (!month) {

        alert(
            "Please select month."
        );

        return;
    }


    const records =
        await getRecordsByMonth(
            month
        );


    reportRecords =
        records.filter(
            record =>
                Number(
                    record.employeeId
                ) ===
                Number(
                    reportEmployee.id
                )
        );


    reportRecords.sort(
        (a, b) =>
            a.date.localeCompare(
                b.date
            )
    );


    const table =
        document.getElementById(
            "reportTable"
        );


    if (!table) {

        return;
    }


    table.innerHTML = "";


    let totalOT = 0;

    let totalExtra = 0;


    reportRecords.forEach(
        record => {

            totalOT +=
                Number(
                    record.otHours || 0
                );


            totalExtra +=
                Number(
                    record.extraHours || 0
                );


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${record.date}
                </td>

                <td>
                    ${record.otHours || 0}
                </td>

                <td>
                    ${record.extraDuty || "-"}
                </td>

                <td>
                    ${record.extraHours || 0}
                </td>

                <td>
                    ${record.remarks || "-"}
                </td>

            `;


            table.appendChild(
                row
            );

        }
    );


    document.getElementById(
        "totalOT"
    ).textContent =
        totalOT.toFixed(2);


    document.getElementById(
        "totalExtra"
    ).textContent =
        totalExtra.toFixed(2);
}


// ========================================
// EXCEL DOWNLOAD
// ========================================

function downloadExcel() {

    if (
        reportRecords.length === 0
    ) {

        alert(
            "No records found for this month."
        );

        return;
    }


    const month =
        document.getElementById(
            "month"
        ).value;


    let totalOT = 0;

    let totalExtra = 0;


    let rows = "";


    reportRecords.forEach(
        record => {

            totalOT +=
                Number(
                    record.otHours || 0
                );


            totalExtra +=
                Number(
                    record.extraHours || 0
                );


            rows += `

                <tr>

                    <td>
                        ${record.date}
                    </td>

                    <td>
                        ${reportEmployee.employeeId}
                    </td>

                    <td>
                        ${reportEmployee.name}
                    </td>

                    <td>
                        ${record.otHours || 0}
                    </td>

                    <td>
                        ${record.extraDuty || ""}
                    </td>

                    <td>
                        ${record.extraHours || 0}
                    </td>

                    <td>
                        ${record.remarks || ""}
                    </td>

                </tr>

            `;
        }
    );


    const html = `

    <html>

    <head>

        <meta charset="UTF-8">

        <style>

            table {

                border-collapse:
                    collapse;

                width:
                    100%;
            }


            th,
            td {

                border:
                    1px solid #000;

                padding:
                    8px;
            }


            th {

                font-weight:
                    bold;
            }

        </style>

    </head>


    <body>

        <h2>
            Office OT Register
        </h2>


        <p>
            Employee ID:
            ${reportEmployee.employeeId}
        </p>


        <p>
            Employee:
            ${reportEmployee.name}
        </p>


        <p>
            Month:
            ${month}
        </p>


        <table>

            <tr>

                <th>Date</th>

                <th>Employee ID</th>

                <th>Employee</th>

                <th>OT Hours</th>

                <th>Extra Duty</th>

                <th>Extra Hours</th>

                <th>Remarks</th>

            </tr>


            ${rows}


            <tr>

                <th colspan="3">
                    TOTAL
                </th>

                <th>
                    ${totalOT.toFixed(2)}
                </th>

                <th></th>

                <th>
                    ${totalExtra.toFixed(2)}
                </th>

                <th></th>

            </tr>

        </table>

    </body>

    </html>

    `;


    const blob =
        new Blob(
            [html],
            {
                type:
                    "application/vnd.ms-excel"
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


    link.href =
        url;


    link.download =
        `OT_${reportEmployee.employeeId}_${month}.xls`;


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


// ========================================
// MONTH CHANGE
// ========================================

document
    .getElementById(
        "month"
    )
    ?.addEventListener(
        "change",
        loadMonthlyReport
    );


initializeReport();
