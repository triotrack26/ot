let historyEmployee = null;


// ========================================
// LOAD HISTORY
// ========================================

async function loadHistory() {

    historyEmployee =
        await checkLogin();


    if (!historyEmployee) {

        return;
    }


    const records =
        await getEmployeeRecords(
            historyEmployee.id
        );


    records.sort(
        (a, b) =>
            b.date.localeCompare(
                a.date
            )
    );


    const table =
        document.getElementById(
            "historyTable"
        );


    if (!table) {

        return;
    }


    table.innerHTML = "";


    let totalOT = 0;

    let totalExtra = 0;


    records.forEach(record => {

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

            <td>

                <button
                    onclick="
                    deleteHistoryRecord(
                        ${record.id}
                    )
                    ">

                    Delete

                </button>

            </td>

        `;


        table.appendChild(
            row
        );

    });


    const totalOTElement =
        document.getElementById(
            "historyTotalOT"
        );


    const totalExtraElement =
        document.getElementById(
            "historyTotalExtra"
        );


    if (totalOTElement) {

        totalOTElement.textContent =
            totalOT.toFixed(2);
    }


    if (totalExtraElement) {

        totalExtraElement.textContent =
            totalExtra.toFixed(2);
    }
}


// ========================================
// DELETE
// ========================================

async function deleteHistoryRecord(id) {

    if (
        !confirm(
            "Delete this record permanently?"
        )
    ) {

        return;
    }


    await deleteRecord(
        id
    );


    await loadHistory();
}


loadHistory();
