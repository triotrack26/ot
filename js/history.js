// ============================================
// OT HISTORY
// ============================================

let historyEmployee = null;


document.addEventListener(
    "DOMContentLoaded",
    async function () {

        historyEmployee =
            requireLogin();


        if (!historyEmployee) {
            return;
        }


        const name =
            document.getElementById(
                "employeeNameHistory"
            );


        if (name) {

            name.textContent =
                historyEmployee.name;

        }


        const monthInput =
            document.getElementById(
                "historyMonth"
            );


        if (monthInput) {

            monthInput.value =
                new Date()
                    .toISOString()
                    .substring(0, 7);

        }


        await loadHistory();

    }
);



// ============================================
// LOAD HISTORY
// ============================================

async function loadHistory() {

    try {

        const month =
            document.getElementById(
                "historyMonth"
            ).value;


        const records =
            await getAllRecords();


        let filtered =
            records.filter(
                record =>

                    String(
                        record.employeeId
                    ) === String(
                        historyEmployee.employeeId
                    )
            );


        if (month) {

            filtered =
                filtered.filter(
                    record =>
                        record.month === month
                );

        }


        filtered.sort(
            (a, b) =>
                b.date.localeCompare(
                    a.date
                )
        );


        displayHistory(
            filtered
        );


        calculateHistorySummary(
            filtered
        );

    }
    catch (error) {

        console.error(
            "History error:",
            error
        );

    }

}



// ============================================
// DISPLAY
// ============================================

function displayHistory(records) {

    const table =
        document.getElementById(
            "historyTable"
        );


    if (!table) {
        return;
    }


    table.innerHTML = "";


    if (records.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="6"
                    style="text-align:center;">

                    No records found.

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

                <td>

                    <button
                        onclick="deleteHistoryRecord(${record.id})">

                        Delete

                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );

}



// ============================================
// SUMMARY
// ============================================

function calculateHistorySummary(records) {

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
        "historyTotalOT"
    ).textContent =
        totalOT;


    document.getElementById(
        "historyTotalExtra"
    ).textContent =
        totalExtra;


    document.getElementById(
        "historyTotalRecords"
    ).textContent =
        records.length;

}



// ============================================
// DELETE
// ============================================

async function deleteHistoryRecord(id) {

    if (
        !confirm(
            "Delete this OT record?"
        )
    ) {

        return;

    }


    try {

        await deleteRecord(id);

        await loadHistory();

    }
    catch (error) {

        console.error(
            error
        );

        alert(
            "Unable to delete record."
        );

    }

}



// ============================================
// SHOW ALL
// ============================================

async function clearHistoryFilter() {

    document.getElementById(
        "historyMonth"
    ).value = "";


    await loadHistory();

}



// ============================================
// ESCAPE
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
