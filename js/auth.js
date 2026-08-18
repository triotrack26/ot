// ======================================================
// OFFICE OT REGISTER
// EMPLOYEE AUTHENTICATION
// ======================================================


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ----------------------------------------------
        // REGISTER PAGE
        // ----------------------------------------------

        const registerForm =
            document.getElementById(
                "registerForm"
            );


        if (registerForm) {

            registerForm.addEventListener(
                "submit",
                registerEmployee
            );

        }


        // ----------------------------------------------
        // LOGIN PAGE
        // ----------------------------------------------

        const loginForm =
            document.getElementById(
                "loginForm"
            );


        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                loginEmployee
            );

        }

    }
);


// ======================================================
// REGISTER EMPLOYEE
// ======================================================

async function registerEmployee(event) {

    event.preventDefault();


    try {

        // ----------------------------------------------
        // GET FORM VALUES
        // ----------------------------------------------

        const employeeId =
            document
                .getElementById("employeeId")
                .value
                .trim()
                .toUpperCase();


        const name =
            document
                .getElementById("employeeName")
                .value
                .trim();


        const department =
            document
                .getElementById("department")
                .value
                .trim();


        const designation =
            document
                .getElementById("designation")
                .value
                .trim();


        const pin =
            document
                .getElementById("pin")
                .value
                .trim();


        const confirmPin =
            document
                .getElementById("confirmPin")
                .value
                .trim();



        // ----------------------------------------------
        // VALIDATION
        // ----------------------------------------------

        if (!employeeId) {

            alert(
                "Please enter Employee ID."
            );

            return;
        }


        if (!name) {

            alert(
                "Please enter employee name."
            );

            return;
        }


        if (!pin) {

            alert(
                "Please create a PIN."
            );

            return;
        }


        if (pin.length < 4) {

            alert(
                "PIN must contain at least 4 digits."
            );

            return;
        }


        if (pin !== confirmPin) {

            alert(
                "PIN and Confirm PIN do not match."
            );

            return;
        }



        // ----------------------------------------------
        // CHECK EXISTING EMPLOYEE
        // ----------------------------------------------

        const existingEmployee =
            await getEmployeeByEmployeeId(
                employeeId
            );


        if (existingEmployee) {

            alert(
                "This Employee ID is already registered on this device."
            );

            return;
        }



        // ----------------------------------------------
        // CREATE EMPLOYEE
        // ----------------------------------------------

        const employee = {

            employeeId:
                employeeId,

            name:
                name,

            department:
                department,

            designation:
                designation,

            pin:
                pin,

            createdAt:
                new Date().toISOString()

        };



        // ----------------------------------------------
        // SAVE TO INDEXEDDB
        // ----------------------------------------------

        await addEmployee(
            employee
        );



        // ----------------------------------------------
        // SUCCESS
        // ----------------------------------------------

        alert(
            "Employee registered successfully."
        );


        // Go to login

        window.location.href =
            "login.html";

    }
    catch (error) {

        console.error(
            "Registration error:",
            error
        );


        alert(
            "Registration failed. Please try again."
        );

    }

}


// ======================================================
// LOGIN EMPLOYEE
// ======================================================

async function loginEmployee(event) {

    event.preventDefault();


    try {

        const employeeId =
            document
                .getElementById("employeeId")
                .value
                .trim()
                .toUpperCase();


        const pin =
            document
                .getElementById("pin")
                .value
                .trim();



        // ----------------------------------------------
        // VALIDATION
        // ----------------------------------------------

        if (!employeeId || !pin) {

            alert(
                "Please enter Employee ID and PIN."
            );

            return;
        }



        // ----------------------------------------------
        // FIND EMPLOYEE
        // ----------------------------------------------

        const employee =
            await getEmployeeByEmployeeId(
                employeeId
            );


        if (!employee) {

            alert(
                "Employee ID not found on this device."
            );

            return;
        }



        // ----------------------------------------------
        // CHECK PIN
        // ----------------------------------------------

        if (
            String(employee.pin) !==
            String(pin)
        ) {

            alert(
                "Incorrect PIN."
            );

            return;
        }



        // ----------------------------------------------
        // SAVE LOGIN SESSION
        // ----------------------------------------------

        const loginEmployeeData = {

            id:
                employee.id,

            employeeId:
                employee.employeeId,

            name:
                employee.name,

            department:
                employee.department,

            designation:
                employee.designation

        };


        localStorage.setItem(
            "loggedInEmployee",
            JSON.stringify(
                loginEmployeeData
            )
        );



        // ----------------------------------------------
        // GO TO DASHBOARD
        // ----------------------------------------------

        window.location.href =
            "dashboard.html";

    }
    catch (error) {

        console.error(
            "Login error:",
            error
        );


        alert(
            "Login failed. Please try again."
        );

    }

}


// ======================================================
// GET LOGGED-IN EMPLOYEE
// ======================================================

function getLoggedInEmployee() {

    const data =
        localStorage.getItem(
            "loggedInEmployee"
        );


    if (!data) {

        return null;
    }


    try {

        return JSON.parse(data);

    }
    catch (error) {

        console.error(
            "Session error:",
            error
        );

        return null;

    }

}


// ======================================================
// REQUIRE LOGIN
// ======================================================

function requireLogin() {

    const employee =
        getLoggedInEmployee();


    if (!employee) {

        window.location.href =
            "login.html";

        return null;
    }


    return employee;

}


// ======================================================
// LOGOUT
// ======================================================

function logout() {

    localStorage.removeItem(
        "loggedInEmployee"
    );


    window.location.href =
        "login.html";

}
