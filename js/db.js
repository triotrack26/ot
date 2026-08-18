// ============================================
// OFFICE OT REGISTER - INDEXEDDB
// ============================================

const DB_NAME = "OfficeOTDatabase";
const DB_VERSION = 1;

const EMPLOYEE_STORE = "employees";
const OT_STORE = "otRecords";
const SETTINGS_STORE = "settings";

let dbInstance = null;


// ============================================
// OPEN DATABASE
// ============================================

function openDatabase() {

    return new Promise((resolve, reject) => {

        if (dbInstance) {
            resolve(dbInstance);
            return;
        }

        const request =
            indexedDB.open(DB_NAME, DB_VERSION);


        request.onupgradeneeded = function (event) {

            const db = event.target.result;


            // ------------------------------
            // EMPLOYEES
            // ------------------------------

            if (!db.objectStoreNames.contains(EMPLOYEE_STORE)) {

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


            // ------------------------------
            // OT RECORDS
            // ------------------------------

            if (!db.objectStoreNames.contains(OT_STORE)) {

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


            // ------------------------------
            // SETTINGS
            // ------------------------------

            if (!db.objectStoreNames.contains(SETTINGS_STORE)) {

                db.createObjectStore(
                    SETTINGS_STORE,
                    {
                        keyPath: "id"
                    }
                );

            }

        };


        request.onsuccess = function (event) {

            dbInstance =
                event.target.result;

            resolve(dbInstance);

        };


        request.onerror = function () {

            reject(
                request.error
            );

        };

    });

}



// ============================================
// ADD EMPLOYEE
// ============================================

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


        request.onsuccess = function () {

            resolve(
                request.result
            );

        };


        request.onerror = function () {

            reject(
                request.error
            );

        };

    });

}



// ============================================
// FIND EMPLOYEE
// ============================================

async function findEmployee(employeeId) {

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


        request.onsuccess = function () {

            resolve(
                request.result || null
            );

        };


        request.onerror = function () {

            reject(
                request.error
            );

        };

    });

}



// ============================================
// GET ALL EMPLOYEES
// ============================================

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


        request.onsuccess = function () {

            resolve(
                request.result || []
            );

        };


        request.onerror = function () {

            reject(
                request.error
            );

        };

    });

}



// ============================================
// ADD OT RECORD
// ============================================

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


        request.onsuccess = function () {

            resolve(
                request.result
            );

        };


        request.onerror = function () {

            reject(
                request.error
            );

        };

    });

}



// ============================================
// GET ALL OT RECORDS
// ============================================

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


        request.onsuccess = function () {

            resolve(
                request.result || []
            );

        };


        request.onerror = function () {

            reject(
                request.error
            );

        };

    });

}



// ============================================
// DELETE OT RECORD
// ============================================

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


        request.onsuccess = function () {

            resolve(true);

        };


        request.onerror = function () {

            reject(
                request.error
            );

        };

    });

}



// ============================================
// SAVE SETTINGS
// ============================================

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


        request.onsuccess = function () {

            resolve(true);

        };


        request.onerror = function () {

            reject(
                request.error
            );

        };

    });

}



// ============================================
// GET SETTINGS
// ============================================

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


        request.onsuccess = function () {

            resolve(
                request.result || null
            );

        };


        request.onerror = function () {

            reject(
                request.error
            );

        };

    });

}
