async function loadDashboard() {

    const employee =
        await checkLogin();


    if (!employee) {

        return;
    }


    document.getElementById(
        "employeeName"
    ).textContent =
        employee.name;


    const records =
        await getEmployeeRecords(
            employee.id
        );


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    let totalOT = 0;

    let totalExtra = 0;


    records.forEach(record => {

        if (
            record.date === today
        ) {

            totalOT +=
                Number(
                    record.otHours || 0
                );


            totalExtra +=
                Number(
                    record.extraHours || 0
                );
        }

    });


    document.getElementById(
        "todayOT"
    ).textContent =
        totalOT.toFixed(2) +
        " hrs";


    document.getElementById(
        "todayExtra"
    ).textContent =
        totalExtra.toFixed(2) +
        " hrs";
}


loadDashboard();
