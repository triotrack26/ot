// ============================================
// ADMIN SETTINGS
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        const employee =
            requireLogin();


        if (!employee) {
            return;
        }


        await loadSettings();


        const form =
            document.getElementById(
                "settingsForm"
            );


        if (form) {

            form.addEventListener(
                "submit",
                saveOfficeSettings
            );

        }

    }
);



// ============================================
// LOAD SETTINGS
// ============================================

async function loadSettings() {

    try {

        const settings =
            await getSettings();


        if (!settings) {

            setDefaultSettings();

            return;

        }


        document.getElementById(
            "startTime"
        ).value =
            settings.startTime || "09:00";


        document.getElementById(
            "endTime"
        ).value =
            settings.endTime || "17:00";


        document.getElementById(
            "normalHours"
        ).value =
            settings.normalHours || 8;


        document.getElementById(
            "activeMonth"
        ).value =
            settings.activeMonth ||
            new Date()
                .toISOString()
                .substring(0, 7);


        const days =
            settings.workingDays || [];


        document
            .querySelectorAll(
                ".workingDay"
            )
            .forEach(
                checkbox => {

                    checkbox.checked =
                        days.includes(
                            checkbox.value
                        );

                }
            );


        displayCurrentSettings(
            settings
        );

    }
    catch (error) {

        console.error(
            "Settings load error:",
            error
        );

    }

}



// ============================================
// DEFAULT SETTINGS
// ============================================

function setDefaultSettings() {

    document.getElementById(
        "startTime"
    ).value = "09:00";


    document.getElementById(
        "endTime"
    ).value = "17:00";


    document.getElementById(
        "normalHours"
    ).value = 8;


    document.getElementById(
        "activeMonth"
    ).value =
        new Date()
            .toISOString()
            .substring(0, 7);


    document
        .querySelectorAll(
            ".workingDay"
        )
        .forEach(
            checkbox => {

                checkbox.checked =
                    checkbox.value !==
                    "Sunday";

            }
        );

}



// ============================================
// SAVE SETTINGS
// ============================================

async function saveOfficeSettings(event) {

    event.preventDefault();


    try {

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


        const activeMonth =
            document.getElementById(
                "activeMonth"
            ).value;


        const workingDays =
            Array.from(
                document.querySelectorAll(
                    ".workingDay:checked"
                )
            ).map(
                checkbox =>
                    checkbox.value
            );


        if (
            workingDays.length === 0
        ) {

            alert(
                "Select at least one working day."
            );

            return;

        }


        const settings = {

            id:
                "officeSettings",

            startTime:
                startTime,

            endTime:
                endTime,

            normalHours:
                normalHours,

            activeMonth:
                activeMonth,

            workingDays:
                workingDays,

            updatedAt:
                new Date().toISOString()

        };


        await saveSettings(
            settings
        );


        alert(
            "Office settings saved successfully."
        );


        displayCurrentSettings(
            settings
        );

    }
    catch (error) {

        console.error(
            "Save settings error:",
            error
        );


        alert(
            "Unable to save settings."
        );

    }

}



// ============================================
// DISPLAY SETTINGS
// ============================================

function displayCurrentSettings(
    settings
) {

    const box =
        document.getElementById(
            "currentSettings"
        );


    if (!box) {
        return;
    }


    box.innerHTML = `

        <p>
            <strong>Working Time:</strong>
            ${settings.startTime}
            -
            ${settings.endTime}
        </p>

        <p>
            <strong>Normal Hours:</strong>
            ${settings.normalHours}
        </p>

        <p>
            <strong>Active Month:</strong>
            ${settings.activeMonth}
        </p>

        <p>
            <strong>Working Days:</strong>
            ${
                (settings.workingDays || [])
                    .join(", ")
            }
        </p>

    `;

}
