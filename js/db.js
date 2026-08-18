const DB_NAME = "OfficeOTDatabase";
const DB_VERSION = 1;

let db = null;


// ======================================
// OPEN DATABASE
// ======================================

const dbReady = new Promise((resolve, reject) => {

    const request =
        indexedDB.open(
            DB_NAME,
            DB_VERSION
        );


    request.onupgradeneeded = function(event) {

        const database =
            event.target.result;


        // ==================================
        // EMPLOYEES
        // ==================================

        if (
            !database.objectStoreNames
                .contains("employees")
        ) {

            const employeeStore =
                database.createObjectStore(
                    "employees",
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


            employeeStore.createIndex(
                "name",
                "name",
                {
                    unique: false
                }
            );

        }


        // ==================================
        // OT RECORDS
        // ==================================

        if (
            !database.objectStoreNames
                .contains("records")
        ) {

            const recordStore =
                database.createObjectStore(
                    "records",
                    {
                        keyPath: "id",
                        autoIncrement: true
                    }
                );


            recordStore.createIndex(
                "date",
                "date",
                {
                    unique: false
                }
            );


            recordStore.createIndex(
                "month",
                "month",
                {
                    unique: false
                }
            );


            recordStore.createIndex(
                "employeeId",
                "employeeId",
                {
                    unique: false
                }
            );

        }


        // ==================================
        // SETTINGS
        // ==================================

        if (
            !database.objectStoreNames
                .contains("settings")
        ) {

            database.createObjectStore(
                "settings",
                {
                    keyPath: "key"
                }
            );

        }

    };


    request.onsuccess = function(event) {

        db =
            event.target.result;

        console.log(
            "IndexedDB connected"
        );

        resolve(db);

    };


    request.onerror = function(event) {

        console.error(
            "Database error:",
            event.target.error
        );

        reject(
            event.target.error
        );

    };

});


// ======================================
// EMPLOYEE
// ======================================

async function addEmployee(employee) {

    const database =
        await dbReady;


    return new Promise(
        (resolve, reject) => {

            const transaction =
                database.transaction(
                    "employees",
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    "employees"
                );


            const request =
                store.add(employee);


            request.onsuccess =
                () => resolve(
                    request.result
                );


            request.onerror =
                () => reject(
                    request.error
                );

        }
    );

}


async function getEmployees() {

    const database =
        await dbReady;


    return new Promise(
        (resolve, reject) => {

            const transaction =
                database.transaction(
                    "employees",
                    "readonly"
                );


            const store =
                transaction.objectStore(
                    "employees"
                );


            const request =
                store.getAll();


            request.onsuccess =
                () => resolve(
                    request.result
                );


            request.onerror =
                () => reject(
                    request.error
                );

        }
    );

}


async function getEmployeeByEmployeeId(
    employeeId
) {

    const database =
        await dbReady;


    return new Promise(
        (resolve, reject) => {

            const transaction =
                database.transaction(
                    "employees",
                    "readonly"
                );


            const store =
                transaction.objectStore(
                    "employees"
                );


            const index =
                store.index(
                    "employeeId"
                );


            const request =
                index.get(
                    employeeId
                );


            request.onsuccess =
                () => resolve(
                    request.result || null
                );


            request.onerror =
                () => reject(
                    request.error
                );

        }
    );

}


// ======================================
// OT RECORD
// ======================================

async function addRecord(record) {

    const database =
        await dbReady;


    return new Promise(
        (resolve, reject) => {

            const transaction =
                database.transaction(
                    "records",
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    "records"
                );


            const request =
                store.add(record);


            request.onsuccess =
                () => resolve(
                    request.result
                );


            request.onerror =
                () => reject(
                    request.error
                );

        }
    );

}


async function getAllRecords() {

    const database =
        await dbReady;


    return new Promise(
        (resolve, reject) => {

            const transaction =
                database.transaction(
                    "records",
                    "readonly"
                );


            const store =
                transaction.objectStore(
                    "records"
                );


            const request =
                store.getAll();


            request.onsuccess =
                () => resolve(
                    request.result
                );


            request.onerror =
                () => reject(
                    request.error
                );

        }
    );

}


async function getEmployeeRecords(
    employeeId
) {

    const records =
        await getAllRecords();


    return records.filter(
        record =>
            Number(record.employeeId) ===
            Number(employeeId)
    );

}


async function deleteRecord(id) {

    const database =
        await dbReady;


    return new Promise(
        (resolve, reject) => {

            const transaction =
                database.transaction(
                    "records",
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    "records"
                );


            const request =
                store.delete(
                    Number(id)
                );


            request.onsuccess =
                () => resolve();


            request.onerror =
                () => reject(
                    request.error
                );

        }
    );

}


// ======================================
// SETTINGS
// ======================================

async function saveSetting(
    key,
    value
) {

    const database =
        await dbReady;


    return new Promise(
        (resolve, reject) => {

            const transaction =
                database.transaction(
                    "settings",
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    "settings"
                );


            const request =
                store.put({
                    key: key,
                    value: value
                });


            request.onsuccess =
                () => resolve();


            request.onerror =
                () => reject(
                    request.error
                );

        }
    );

}


async function getSetting(key) {

    const database =
        await dbReady;


    return new Promise(
        (resolve, reject) => {

            const transaction =
                database.transaction(
                    "settings",
                    "readonly"
                );


            const store =
                transaction.objectStore(
                    "settings"
                );


            const request =
                store.get(key);


            request.onsuccess =
                () => {

                    if (
                        request.result
                    ) {

                        resolve(
                            request.result.value
                        );

                    } else {

                        resolve(null);

                    }

                };


            request.onerror =
                () => reject(
                    request.error
                );

        }
    );

}
