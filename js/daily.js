// ============================================
// DAILY OT MANAGEMENT
// ============================================

let currentEmployee = null;


// ============================================
// PAGE LOAD
// ============================================

document.addEventListener("DOMContentLoaded", async function () {

    try {

        // Get logged-in employee
        currentEmployee = getLoggedInEmployee();

        if (!currentEmployee) {

            window.location.href = "login.html";
            return;
        }


        // Show employee name
        const nameElement =
            document.getElementById("employeeName");

        if (nameElement) {

            nameElement.textContent =
                currentEmployee.name;
        }


        // Set today's date
        const dateInput =
            document.getElementById("date");

        if (dateInput) {

            const today =
                new Date()
                    .toISOString()
                    .split("T")[0];

            dateInput.value = today;

            dateInput.addEventListener(
                "change",
                loadSelectedDate
            );
        }


        // Load today's records
        await loadSelectedDate();

    }
    catch (error) {

        console.error(
            "Daily page error:",
            error
        );

        alert(
            "Unable to load daily OT page."
        );
    }

});


// ============================================
// GET LOGGED-IN EMPLOYEE
// ============================================

function getLoggedInEmployee() {

    const employee =
        localStorage.getItem(
            "loggedInEmployee"
        );

    if (!employee) {

        return null;
    }

    try {

        return JSON.parse(employee);

    }
    catch (error) {

        console.error(
            "Login data error:",
            error
        );

        return null;
    }
}


// ============================================
// SAVE DAILY RECORD
// ============================================

async function saveDailyRecord() {

    try {

        if (!currentEmployee) {

            alert(
                "Employee login required."
            );

            window.location.href =
                "login.html";

            return;
        }


        // ------------------------------
        // Get form values
        // ------------------------------

        const date =
            document.getElementById(
                "date"
            ).value;

        const otHours =
            parseFloat(
                document.getElementById(
                    "otHours"
                ).value
            ) || 0;

        const extraDuty =
            document.getElementById(
                "extraDuty"
            ).value.trim();

        const extraHours =
            parseFloat(
                document.getElementById(
                    "extraHours"
                ).value
            ) || 0;

        const remarks =
            document.getElementById(
                "remarks"
            ).value.trim();


        // ------------------------------
        // Validation
        // ------------------------------

        if (!date) {

            alert(
                "Please select a date."
            );

            return;
        }


        if (
            otHours < 0 ||
            extraHours < 0
        ) {

            alert(
                "Hours cannot be negative."
            );

            return;
        }


        if (
            otHours === 0 &&
            extraHours === 0
        ) {

            alert(
                "Please enter OT hours or Extra Duty hours."
            );

            return;
        }


        if (
            extraHours > 0 &&
            extraDuty === ""
        ) {

            alert(
                "Please enter Extra Duty details."
            );

            return;
        }


        // ------------------------------
        // Month
        // ------------------------------

        const month =
            date.substring(0, 7);


        // ------------------------------
        // Create record
        // ------------------------------

        const record = {

            employeeId:
                currentEmployee.employeeId,

            employeeName:
                currentEmployee.name,

            date:
                date,

            month:
                month,

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


        // ------------------------------
        // Save IndexedDB
        // ------------------------------

        await addRecord(record);


        // ------------------------------
        // Success
        // ------------------------------

        alert(
            "Daily OT record saved successfully."
        );


        // Clear fields
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


        // Reload records
        await loadSelectedDate();

    }
    catch (error) {

        console.error(
            "Save record error:",
            error
        );

        alert(
            "Failed to save OT record."
        );
    }
}


// ============================================
// LOAD SELECTED DATE
// ============================================

async function loadSelectedDate() {

    try {

        if (!currentEmployee) {
            return;
        }


        const date =
            document.getElementById(
                "date"
            ).value;


        if (!date) {
            return;
        }


        const allRecords =
            await getAllRecords();


        // Employee + date filter

        const records =
            allRecords.filter(
                record =>

                    String(
                        record.employeeId
                    ) === String(
                        currentEmployee.employeeId
                    )

                    &&

                    record.date === date
            );


        displayDailyRecords(records);


        calculateDailySummary(records);

    }
    catch (error) {

        console.error(
            "Load date error:",
            error
        );
    }
}


// ============================================
// DISPLAY DAILY RECORDS
// ============================================

function displayDailyRecords(records) {

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

                <td
                    colspan="6"
                    style="text-align:center;">

                    No records found for
                    this date.

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
                    ${formatDate(record.date)}
                </td>

                <td>
                    ${record.otHours} hrs
                </td>

                <td>
                    ${escapeHTML(
                        record.extraDuty || "-"
                    )}
                </td>

                <td>
                    ${record.extraHours} hrs
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
// DAILY SUMMARY
// ============================================

function calculateDailySummary(records) {

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


    const otElement =
        document.getElementById(
            "totalOT"
        );


    const extraElement =
        document.getElementById(
            "totalExtra"
        );


    if (otElement) {

        otElement.textContent =
            formatHours(totalOT);
    }


    if (extraElement) {

        extraElement.textContent =
            formatHours(totalExtra);
    }

}


// ============================================
// DELETE RECORD
// ============================================

async function deleteDailyRecord(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this OT record?"
        );


    if (!confirmation) {

        return;
    }


    try {

        await deleteRecord(id);


        alert(
            "Record deleted successfully."
        );


        await loadSelectedDate();

    }
    catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            "Unable to delete record."
        );
    }

}


// ============================================
// FORMAT DATE
// ============================================

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }


    const parts =
        dateString.split("-");


    if (parts.length !== 3) {

        return dateString;
    }


    return (
        parts[2] +
        "-" +
        parts[1] +
        "-" +
        parts[0]
    );

}


// ============================================
// FORMAT HOURS
// ============================================

function formatHours(hours) {

    const number =
        Number(hours) || 0;


    if (
        Number.isInteger(number)
    ) {

        return number.toString();
    }


    return number
        .toFixed(2)
        .replace(/\.00$/, "");

}


// ============================================
// SECURITY
// ============================================

function escapeHTML(value) {

    if (!value) {
        return "";
    }


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
