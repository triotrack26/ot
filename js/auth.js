// ============================================
// AUTHENTICATION
// ============================================


// ============================================
// REGISTER
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

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



// ============================================
// REGISTER EMPLOYEE
// ============================================

async function registerEmployee(event) {

    event.preventDefault();


    try {

        const employeeId =
            document.getElementById(
                "employeeId"
            ).value.trim().toUpperCase();


        const name =
            document.getElementById(
                "employeeName"
            ).value.trim();


        const department =
            document.getElementById(
                "department"
            ).value.trim();


        const designation =
            document.getElementById(
                "designation"
            ).value.trim();


        const pin =
            document.getElementById(
                "pin"
            ).value.trim();


        const confirmPin =
            document.getElementById(
                "confirmPin"
            ).value.trim();



        if (!employeeId || !name || !pin) {

            alert(
                "Please fill all required fields."
            );

            return;

        }



        if (pin !== confirmPin) {

            alert(
                "PIN and Confirm PIN do not match."
            );

            return;

        }



        if (!/^\d{4,8}$/.test(pin)) {

            alert(
                "PIN must contain 4 to 8 digits."
            );

            return;

        }



        // Check existing employee

        const existing =
            await findEmployee(
                employeeId
            );


        if (existing) {

            alert(
                "This Employee ID is already registered on this device."
            );

            return;

        }



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



        await addEmployee(
            employee
        );



        alert(
            "Employee registered successfully."
        );


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



// ============================================
// LOGIN
// ============================================

async function loginEmployee(event) {

    event.preventDefault();


    try {

        const employeeId =
            document.getElementById(
                "employeeId"
            ).value.trim().toUpperCase();


        const pin =
            document.getElementById(
                "pin"
            ).value.trim();



        if (!employeeId || !pin) {

            alert(
                "Please enter Employee ID and PIN."
            );

            return;

        }



        const employee =
            await findEmployee(
                employeeId
            );



        if (!employee) {

            alert(
                "Employee ID not found on this device."
            );

            return;

        }



        if (employee.pin !== pin) {

            alert(
                "Incorrect PIN."
            );

            return;

        }



        localStorage.setItem(
            "loggedInEmployee",
            JSON.stringify(employee)
        );



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



// ============================================
// GET CURRENT EMPLOYEE
// ============================================

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
    catch {

        return null;

    }

}



// ============================================
// LOGOUT
// ============================================

function logout() {

    localStorage.removeItem(
        "loggedInEmployee"
    );


    window.location.href =
        "login.html";

}



// ============================================
// PAGE PROTECTION
// ============================================

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
