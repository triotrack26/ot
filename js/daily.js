let currentEmployee = null;


// ========================================
// INITIALIZE
// ========================================

async function initializeDailyPage() {

    currentEmployee =
        await checkLogin();


    if (!currentEmployee) {

        return;
    }


    document.getElementById(
        "employeeName"
    ).textContent =
        currentEmployee.name;


    const dateInput =
        document.getElementById(
            "date"
        );


    const savedDate =
        localStorage.getItem(
            "selectedOTDate"
        );


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    dateInput.value =
        savedDate || today;


    await loadDailyRecords();
}


// ========================================
// DATE CHANGE
// ========================================

document
    .getElementById("date")
    ?.addEventListener(
        "change",
        async function () {

            localStorage.setItem(
                "selectedOTDate",
                this.value
            );


            await loadDailyRecords();
        }
    );


// ========================================
// SAVE RECORD
// ========================================

async function saveDailyRecord() {

    if (!currentEmployee) {

        alert(
            "Employee not logged in."
        );

        return;
    }


    const date =
        document.getElementById(
            "date"
        ).value;


    const otHours =
        Number(
            document.getElementById(
                "otHours"
            ).value || 0
        );


    const extraDuty =
        document.getElementById(
            "extraDuty"
        ).value.trim();


    const extraHours =
        Number(
            document.getElementById(
                "extraHours"
            ).value || 0
        );


    const remarks =
        document.getElementById(
            "remarks"
        ).value.trim();


    if (!date) {

        alert(
            "Please select date."
        );

        return;
    }


    if (
        otHours <= 0 &&
        extraHours <= 0
    ) {

        alert(
            "Enter OT hours or Extra Duty hours."
        );

        return;
    }


    const record = {

        employeeId:
            currentEmployee.id,

        employeeCode:
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


    try {

        await addRecord(
            record
        );


        alert(
            "Record saved permanently."
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


        await loadDailyRecords();


    } catch (error) {

        console.error(error);

        alert(
            "Could not save record."
        );
    }
}


// ========================================
// LOAD DAILY RECORDS
// ========================================

async function loadDailyRecords() {

    if (!currentEmployee) {

        return;
    }


    const date =
        document.getElementById(
            "date"
        ).value;


    const allRecords =
        await getRecordsByDate(
            date
        );


    const records =
        allRecords.filter(
            record =>
                Number(
                    record.employeeId
                ) ===
                Number(
                    currentEmployee.id
                )
        );


    const table =
        document.getElementById(
            "dailyTable"
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
                    deleteDailyRecord(
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
            "totalOT"
        );


    const totalExtraElement =
        document.getElementById(
            "totalExtra"
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

async function deleteDailyRecord(id) {

    const confirmDelete =
        confirm(
            "Delete this OT record?"
        );


    if (!confirmDelete) {

        return;
    }


    await deleteRecord(
        id
    );


    await loadDailyRecords();
}


initializeDailyPage();
