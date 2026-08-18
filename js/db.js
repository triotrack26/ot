const DB_NAME = "OfficeOTDatabase";
const DB_VERSION = 1;

const dbReady = new Promise((resolve, reject) => {

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = function (event) {

        const db = event.target.result;

        // EMPLOYEES
        if (!db.objectStoreNames.contains("employees")) {

            const employeeStore = db.createObjectStore(
                "employees",
                {
                    keyPath: "id",
                    autoIncrement: true
                }
            );

            employeeStore.createIndex(
                "employeeId",
                "employeeId",
                { unique: true }
            );

            employeeStore.createIndex(
                "name",
                "name",
                { unique: false }
            );
        }

        // DAILY OT RECORDS
        if (!db.objectStoreNames.contains("records")) {

            const recordStore = db.createObjectStore(
                "records",
                {
                    keyPath: "id",
                    autoIncrement: true
                }
            );

            recordStore.createIndex(
                "date",
                "date",
                { unique: false }
            );

            recordStore.createIndex(
                "month",
                "month",
                { unique: false }
            );

            recordStore.createIndex(
                "employeeId",
                "employeeId",
                { unique: false }
            );
        }

        // SETTINGS
        if (!db.objectStoreNames.contains("settings")) {

            db.createObjectStore(
                "settings",
                {
                    keyPath: "key"
                }
            );
        }
    };

    request.onsuccess = function (event) {

        console.log("IndexedDB connected");

        resolve(event.target.result);
    };

    request.onerror = function (event) {

        console.error(
            "IndexedDB Error:",
            event.target.error
        );

        reject(event.target.error);
    };
});


// ========================================
// EMPLOYEE FUNCTIONS
// ========================================

async function addEmployee(employee) {

    const db = await dbReady;

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(
            "employees",
            "readwrite"
        );

        const store = transaction.objectStore(
            "employees"
        );

        const request = store.add(employee);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}


async function getEmployees() {

    const db = await dbReady;

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(
            "employees",
            "readonly"
        );

        const store = transaction.objectStore(
            "employees"
        );

        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}


async function getEmployeeByEmployeeId(employeeId) {

    const db = await dbReady;

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(
            "employees",
            "readonly"
        );

        const store = transaction.objectStore(
            "employees"
        );

        const index = store.index(
            "employeeId"
        );

        const request = index.get(employeeId);

        request.onsuccess = () => {

            resolve(
                request.result || null
            );
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}


// ========================================
// RECORD FUNCTIONS
// ========================================

async function addRecord(record) {

    const db = await dbReady;

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(
            "records",
            "readwrite"
        );

        const store = transaction.objectStore(
            "records"
        );

        const request = store.add(record);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}


async function getAllRecords() {

    const db = await dbReady;

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(
            "records",
            "readonly"
        );

        const store = transaction.objectStore(
            "records"
        );

        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}


async function getEmployeeRecords(employeeId) {

    const records = await getAllRecords();

    return records.filter(
        record =>
            Number(record.employeeId) ===
            Number(employeeId)
    );
}


async function getRecordsByDate(date) {

    const records = await getAllRecords();

    return records.filter(
        record =>
            record.date === date
    );
}


async function getRecordsByMonth(month) {

    const records = await getAllRecords();

    return records.filter(
        record =>
            record.month === month
    );
}


async function deleteRecord(id) {

    const db = await dbReady;

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(
            "records",
            "readwrite"
        );

        const store = transaction.objectStore(
            "records"
        );

        const request = store.delete(
            Number(id)
        );

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}


// ========================================
// SETTINGS
// ========================================

async function saveSetting(key, value) {

    const db = await dbReady;

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(
            "settings",
            "readwrite"
        );

        const store = transaction.objectStore(
            "settings"
        );

        const request = store.put({
            key: key,
            value: value
        });

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}


async function getSetting(key) {

    const db = await dbReady;

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(
            "settings",
            "readonly"
        );

        const store = transaction.objectStore(
            "settings"
        );

        const request = store.get(key);

        request.onsuccess = () => {

            if (request.result) {

                resolve(
                    request.result.value
                );

            } else {

                resolve(null);
            }
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}
