// ============================================
// DASHBOARD
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        const employee =
            requireLogin();


        if (!employee) {
            return;
        }


        const name =
            document.getElementById(
                "employeeName"
            );


        const info =
            document.getElementById(
                "employeeInfo"
            );


        if (name) {

            name.textContent =
                employee.name;

        }


        if (info) {

            info.textContent =
                `${employee.employeeId} • ${
                    employee.department || "Employee"
                }`;

        }


        await loadTodaySummary();

    }
);



// ============================================
// TODAY SUMMARY
// ============================================

async function loadTodaySummary() {

    try {

        const employee =
            getLoggedInEmployee();


        if (!employee) {
            return;
        }


        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        const records =
            await getAllRecords();


        const todayRecords =
            records.filter(
                record =>

                    String(
                        record.employeeId
                    ) === String(
                        employee.employeeId
                    )

                    &&

                    record.date === today
            );


        let totalOT = 0;

        let totalExtra = 0;


        todayRecords.forEach(
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
                "todayOT"
            );


        const extraElement =
            document.getElementById(
                "todayExtra"
            );


        if (otElement) {

            otElement.textContent =
                totalOT;

        }


        if (extraElement) {

            extraElement.textContent =
                totalExtra;

        }

    }
    catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}
