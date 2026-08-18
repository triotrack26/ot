// ========================================
// REGISTER
// ========================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        registerEmployee
    );
}


async function registerEmployee(event) {

    event.preventDefault();

    const employeeId =
        document.getElementById(
            "employeeId"
        ).value.trim();

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
        ).value;


    if (
        !employeeId ||
        !name ||
        !pin
    ) {

        alert(
            "Please fill all required fields."
        );

        return;
    }


    try {

        const existing =
            await getEmployeeByEmployeeId(
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


        const id =
            await addEmployee(
                employee
            );


        localStorage.setItem(
            "loggedInEmployeeId",
            id
        );


        alert(
            "Registration successful."
        );


        window.location.href =
            "dashboard.html";


    } catch (error) {

        console.error(error);

        alert(
            "Registration failed."
        );
    }
}


// ========================================
// LOGIN
// ========================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        loginEmployee
    );
}


async function loginEmployee(event) {

    event.preventDefault();


    const employeeId =
        document.getElementById(
            "employeeId"
        ).value.trim();

    const pin =
        document.getElementById(
            "pin"
        ).value;


    try {

        const employee =
            await getEmployeeByEmployeeId(
                employeeId
            );


        if (!employee) {

            alert(
                "Employee not found on this device."
            );

            return;
        }


        if (
            employee.pin !== pin
        ) {

            alert(
                "Incorrect PIN."
            );

            return;
        }


        localStorage.setItem(
            "loggedInEmployeeId",
            employee.id
        );


        window.location.href =
            "dashboard.html";


    } catch (error) {

        console.error(error);

        alert(
            "Login failed."
        );
    }
}


// ========================================
// GET LOGGED EMPLOYEE
// ========================================

async function getLoggedEmployee() {

    const id =
        localStorage.getItem(
            "loggedInEmployeeId"
        );


    if (!id) {

        return null;
    }


    const employees =
        await getEmployees();


    return employees.find(
        employee =>
            Number(employee.id) ===
            Number(id)
    ) || null;
}


// ========================================
// CHECK LOGIN
// ========================================

async function checkLogin() {

    const employee =
        await getLoggedEmployee();


    if (!employee) {

        window.location.href =
            "login.html";

        return null;
    }


    return employee;
}


// ========================================
// LOGOUT
// ========================================

function logout() {

    localStorage.removeItem(
        "loggedInEmployeeId"
    );


    window.location.href =
        "login.html";
}
