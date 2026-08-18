// ============================================
// DAILY OT
// ============================================

let currentEmployee = null;



document.addEventListener(
    "DOMContentLoaded",
    async function () {

        currentEmployee =
            requireLogin();


        if (!currentEmployee) {
            return;
        }


        const nameElement =
            document.getElementById(
                "employeeName"
            );


        if (nameElement) {

            nameElement.textContent =
                currentEmployee.name;

        }


        const dateInput =
            document.getElementById(
                "date"
            );


        if (dateInput) {

            const today =
                new Date()
                    .toISOString()
                    .split("T")[0];


            dateInput.value =
                today;


            dateInput.addEventListener(
                "change",
                loadSelectedDate
            );

        }


        const form =
            document.getElementById(
                "dailyForm"
            );


        if (form) {

            form.addEventListener(
                "submit",
                saveDailyRecord
            );

        }


        await loadSelectedDate();

    }
);



// ============================================
// SAVE
// ============================================

async function saveDailyRecord(event) {

    event.preventDefault();


    try {

        const date =
            document.getElementById(
                "date"
            ).value;


        const otHours =
            Number(
                document.getElementById(
                    "otHours"
                ).value
            ) || 0;


        const extraDuty =
            document.getElementById(
                "extraDuty"
            ).value.trim();


        const extraHours =
            Number(
                document.getElementById(
                    "extraHours"
                ).value
            ) || 0;


        const remarks =
            document.getElementById(
                "remarks"
            ).value.trim();



        if (!date) {

            alert(
                "Please select a date."
            );

            return;

        }



        if (otHours === 0 && extraHours === 0) {

            alert(
                "Enter OT hours or Extra Duty hours."
            );

            return;

        }



        if (otHours < 0 || extraHours < 0) {

            alert(
                "Hours cannot be negative."
            );

            return;

        }



        if (extraHours > 0 && !extraDuty) {

            alert(
                "Please enter Extra Duty details."
            );

            return;

        }



        const record = {

            employeeId:
                currentEmployee.employeeId,

            employeeName:
                currentEmployee.name,

            date:
                date,

            month:
                date.substring(0, 7),

            otHours:
                otHours,

            extraDuty:
                extraDuty,

            extraHours:
                extraHours,

            remarks:
                remarks,

            createdAt:
                new Date().toISOString()

        };


        await addRecord(record);


        alert(
            "Daily OT record saved successfully."
        );


        document.getElementById(
            "otHours"
        ).value = "";


        document.getElementById(
            "extraDuty"
        ).value = "";


        document.getElementById(
            "extraHours"
        ).value = "";


        document.getElementById(
            "remarks"
        ).value = "";


        await loadSelectedDate();

    }
    catch (error) {

        console.error(
            "Save error:",
            error
        );


        alert(
            "Unable to save record."
        );

    }

}



// ============================================
// LOAD DATE
// ============================================

async function loadSelectedDate() {

    try {

        const date =
            document.getElementById(
                "date"
            ).value;


        if (!date) {
            return;
        }


        const records =
            await getAllRecords();


        const filtered =
            records.filter(
                record =>

                    String(
                        record.employeeId
                    ) === String(
                        currentEmployee.employeeId
                    )

                    &&

                    record.date === date
            );


        displayRecords(
            filtered
        );


        updateSummary(
            filtered
        );

    }
    catch (error) {

        console.error(
            "Load error:",
            error
        );

    }

}



// ============================================
// DISPLAY
// ============================================

function displayRecords(records) {

    const table =
        document.getElementById(
            "dailyTable"
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
                        onclick="deleteDailyRecord(${record.id})">

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

function updateSummary(records) {

    let ot = 0;

    let extra = 0;


    records.forEach(
        record => {

            ot +=
                Number(
                    record.otHours
                ) || 0;


            extra +=
                Number(
                    record.extraHours
                ) || 0;

        }
    );


    document.getElementById(
        "totalOT"
    ).textContent = ot;


    document.getElementById(
        "totalExtra"
    ).textContent = extra;

}



// ============================================
// DELETE
// ============================================

async function deleteDailyRecord(id) {

    if (
        !confirm(
            "Delete this record?"
        )
    ) {

        return;

    }


    try {

        await deleteRecord(id);


        alert(
            "Record deleted."
        );


        await loadSelectedDate();

    }
    catch (error) {

        console.error(
            error
        );


        alert(
            "Delete failed."
        );

    }

}



// ============================================
// ESCAPE HTML
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
