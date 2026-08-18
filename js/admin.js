// ========================================
// LOAD ADMIN SETTINGS
// ========================================

async function loadAdminSettings() {

    const settings =
        await getSetting(
            "officeSettings"
        );


    if (!settings) {

        return;
    }


    const startTime =
        document.getElementById(
            "startTime"
        );


    const endTime =
        document.getElementById(
            "endTime"
        );


    const normalHours =
        document.getElementById(
            "normalHours"
        );


    if (startTime) {

        startTime.value =
            settings.startTime || "";
    }


    if (endTime) {

        endTime.value =
            settings.endTime || "";
    }


    if (normalHours) {

        normalHours.value =
            settings.normalHours || "";
    }


    document
        .querySelectorAll(
            ".workingDay"
        )
        .forEach(
            checkbox => {

                checkbox.checked =
                    settings
                        .workingDays
                        ?.includes(
                            checkbox.value
                        ) || false;
            }
        );
}


// ========================================
// SAVE SETTINGS
// ========================================

async function saveAdminSettings() {

    const startTime =
        document.getElementById(
            "startTime"
        ).value;


    const endTime =
        document.getElementById(
            "endTime"
        ).value;


    const normalHours =
        Number(
            document.getElementById(
                "normalHours"
            ).value
        );


    const workingDays = [];


    document
        .querySelectorAll(
            ".workingDay"
        )
        .forEach(
            checkbox => {

                if (
                    checkbox.checked
                ) {

                    workingDays.push(
                        checkbox.value
                    );
                }
            }
        );


    const settings = {

        startTime:
            startTime,

        endTime:
            endTime,

        normalHours:
            normalHours,

        workingDays:
            workingDays,

        updatedAt:
            new Date().toISOString()
    };


    await saveSetting(
        "officeSettings",
        settings
    );


    alert(
        "Admin settings saved."
    );
}


// ========================================
// FORM
// ========================================

document
    .getElementById(
        "settingsForm"
    )
    ?.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            await saveAdminSettings();
        }
    );


loadAdminSettings();
