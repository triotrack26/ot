// ======================================================
// OFFICE OT REGISTER
// INDEXEDDB DATABASE
// ======================================================

const DB_NAME = "OfficeOTRegisterDB";
const DB_VERSION = 1;

const EMPLOYEE_STORE = "employees";
const OT_STORE = "otRecords";
const SETTINGS_STORE = "settings";


// ======================================================
// OPEN DATABASE
// ======================================================

function openDatabase() {

    return new Promise((resolve, reject) => {

        const request =
            indexedDB.open(DB_NAME, DB_VERSION);


        request.onupgradeneeded = function (event) {

            const db = event.target.result;


            // ------------------------------------------
            // EMPLOYEES
            // ------------------------------------------

            if (!db.objectStoreNames.contains(
                EMPLOYEE_STORE
            )) {

                const employeeStore =
                    db.createObjectStore(
                        EMPLOYEE_STORE,
                        {
                            keyPath: "id",
                            autoIncrement: true
                        }
                    );


                employeeStore.createIndex(
                    "employeeId",
                    "employeeId",
                    {
                        unique: true
                    }
                );

            }


            // ------------------------------------------
            // OT RECORDS
            // ------------------------------------------

            if (!db.objectStoreNames.contains(
                OT_STORE
            )) {

                const otStore =
                    db.createObjectStore(
                        OT_STORE,
                        {
                            keyPath: "id",
                            autoIncrement: true
                        }
                    );


                otStore.createIndex(
                    "employeeId",
                    "employeeId",
                    {
                        unique: false
                    }
                );


                otStore.createIndex(
                    "date",
                    "date",
                    {
                        unique: false
                    }
                );


                otStore.createIndex(
                    "month",
                    "month",
                    {
                        unique: false
                    }
                );

            }


            // ------------------------------------------
            // SETTINGS
            // ------------------------------------------

            if (!db.objectStoreNames.contains(
                SETTINGS_STORE
            )) {

                db.createObjectStore(
                    SETTINGS_STORE,
                    {
                        keyPath: "id"
                    }
                );

            }

        };


        request.onsuccess = function () {

            resolve(request.result);

        };


        request.onerror = function () {

            console.error(
                "Database error:",
                request.error
            );

            reject(request.error);

        };

    });

}


// ======================================================
// ADD EMPLOYEE
// ======================================================

async function addEmployee(employee) {

    const db =
        await openDatabase();


    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                EMPLOYEE_STORE,
                "readwrite"
            );


        const store =
            transaction.objectStore(
                EMPLOYEE_STORE
            );


        const request =
            store.add(employee);


        request.onsuccess =
            () => resolve(request.result);


        request.onerror =
            () => reject(request.error);

    });

}


// ======================================================
// GET EMPLOYEE BY EMPLOYEE ID
// ======================================================

async function getEmployeeByEmployeeId(
    employeeId
) {

    const db =
        await openDatabase();


    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                EMPLOYEE_STORE,
                "readonly"
            );


        const store =
            transaction.objectStore(
                EMPLOYEE_STORE
            );


        const index =
            store.index(
                "employeeId"
            );


        const request =
            index.get(employeeId);


        request.onsuccess =
            () => resolve(request.result || null);


        request.onerror =
            () => reject(request.error);

    });

}


// ======================================================
// GET ALL EMPLOYEES
// ======================================================

async function getAllEmployees() {

    const db =
        await openDatabase();


    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                EMPLOYEE_STORE,
                "readonly"
            );


        const store =
            transaction.objectStore(
                EMPLOYEE_STORE
            );


        const request =
            store.getAll();


        request.onsuccess =
            () => resolve(request.result);


        request.onerror =
            () => reject(request.error);

    });

}


// ======================================================
// ADD OT RECORD
// ======================================================

async function addRecord(record) {

    const db =
        await openDatabase();


    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                OT_STORE,
                "readwrite"
            );


        const store =
            transaction.objectStore(
                OT_STORE
            );


        const request =
            store.add(record);


        request.onsuccess =
            () => resolve(request.result);


        request.onerror =
            () => reject(request.error);

    });

}


// ======================================================
// GET ALL OT RECORDS
// ======================================================

async function getAllRecords() {

    const db =
        await openDatabase();


    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                OT_STORE,
                "readonly"
            );


        const store =
            transaction.objectStore(
                OT_STORE
            );


        const request =
            store.getAll();


        request.onsuccess =
            () => resolve(request.result);


        request.onerror =
            () => reject(request.error);

    });

}


// ======================================================
// GET OT RECORD BY ID
// ======================================================

async function getRecordById(id) {

    const db =
        await openDatabase();


    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                OT_STORE,
                "readonly"
            );


        const store =
            transaction.objectStore(
                OT_STORE
            );


        const request =
            store.get(id);


        request.onsuccess =
            () => resolve(
                request.result || null
            );


        request.onerror =
            () => reject(request.error);

    });

}


// ======================================================
// DELETE OT RECORD
// ======================================================

async function deleteRecord(id) {

    const db =
        await openDatabase();


    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                OT_STORE,
                "readwrite"
            );


        const store =
            transaction.objectStore(
                OT_STORE
            );


        const request =
            store.delete(id);


        request.onsuccess =
            () => resolve(true);


        request.onerror =
            () => reject(request.error);

    });

}


// ======================================================
// SAVE ADMIN SETTINGS
// ======================================================

async function saveSettings(settings) {

    const db =
        await openDatabase();


    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                SETTINGS_STORE,
                "readwrite"
            );


        const store =
            transaction.objectStore(
                SETTINGS_STORE
            );


        const request =
            store.put(settings);


        request.onsuccess =
            () => resolve(true);


        request.onerror =
            () => reject(request.error);

    });

}


// ======================================================
// GET ADMIN SETTINGS
// ======================================================

async function getSettings() {

    const db =
        await openDatabase();


    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                SETTINGS_STORE,
                "readonly"
            );


        const store =
            transaction.objectStore(
                SETTINGS_STORE
            );


        const request =
            store.get("officeSettings");


        request.onsuccess =
            () => resolve(
                request.result || null
            );


        request.onerror =
            () => reject(request.error);

    });

}
