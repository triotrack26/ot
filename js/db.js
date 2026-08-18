const DB_NAME = "OfficeOTDatabase";
const DB_VERSION = 1;

let db;

function openDatabase() {

    return new Promise((resolve, reject) => {

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = function(event) {

            db = event.target.result;

            // Employee store
            if (!db.objectStoreNames.contains("employees")) {

                const employeeStore = db.createObjectStore(
                    "employees",
                    {
                        keyPath: "id",
                        autoIncrement: true
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

            // Daily OT records
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

                recordStore.createIndex(
                    "month",
                    "month",
                    {
                        unique: false
                    }
                );
            }

            // Admin settings
            if (!db.objectStoreNames.contains("settings")) {

                db.createObjectStore(
                    "settings",
                    {
                        keyPath: "key"
                    }
                );
            }
        };

        request.onsuccess = function(event) {

            db = event.target.result;

            resolve(db);
        };

        request.onerror = function() {

            reject(request.error);
        };
    });
}

openDatabase();


// ===============================
// EMPLOYEE FUNCTIONS
// ===============================

function addEmployee(employee) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                ["employees"],
                "readwrite"
            );

        const store =
            transaction.objectStore("employees");

        const request =
            store.add(employee);

        request.onsuccess = () => resolve(request.result);

        request.onerror = () => reject(request.error);
    });
}


function getEmployees() {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                ["employees"],
                "readonly"
            );

        const store =
            transaction.objectStore("employees");

        const request =
            store.getAll();

        request.onsuccess = () =>
            resolve(request.result);

        request.onerror = () =>
            reject(request.error);
    });
}


function deleteEmployee(id) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                ["employees"],
                "readwrite"
            );

        const store =
            transaction.objectStore("employees");

        const request =
            store.delete(id);

        request.onsuccess = () =>
            resolve();

        request.onerror = () =>
            reject(request.error);
    });
}


// ===============================
// DAILY RECORD FUNCTIONS
// ===============================

function addRecord(record) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                ["records"],
                "readwrite"
            );

        const store =
            transaction.objectStore("records");

        const request =
            store.add(record);

        request.onsuccess = () =>
            resolve(request.result);

        request.onerror = () =>
            reject(request.error);
    });
}


function getAllRecords() {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                ["records"],
                "readonly"
            );

        const store =
            transaction.objectStore("records");

        const request =
            store.getAll();

        request.onsuccess = () =>
            resolve(request.result);

        request.onerror = () =>
            reject(request.error);
    });
}


function getRecordsByDate(date) {

    return new Promise(async (resolve, reject) => {

        try {

            const records =
                await getAllRecords();

            const result =
                records.filter(
                    record => record.date === date
                );

            resolve(result);

        } catch(error) {

            reject(error);
        }
    });
}


function getRecordsByMonth(month) {

    return new Promise(async (resolve, reject) => {

        try {

            const records =
                await getAllRecords();

            const result =
                records.filter(
                    record => record.month === month
                );

            resolve(result);

        } catch(error) {

            reject(error);
        }
    });
}


function deleteRecord(id) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                ["records"],
                "readwrite"
            );

        const store =
            transaction.objectStore("records");

        const request =
            store.delete(id);

        request.onsuccess = () =>
            resolve();

        request.onerror = () =>
            reject(request.error);
    });
}


// ===============================
// SETTINGS
// ===============================

function saveSetting(key, value) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                ["settings"],
                "readwrite"
            );

        const store =
            transaction.objectStore("settings");

        const request =
            store.put({
                key: key,
                value: value
            });

        request.onsuccess = () =>
            resolve();

        request.onerror = () =>
            reject(request.error);
    });
}


function getSetting(key) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                ["settings"],
                "readonly"
            );

        const store =
            transaction.objectStore("settings");

        const request =
            store.get(key);

        request.onsuccess = function() {

            if (request.result) {

                resolve(request.result.value);

            } else {

                resolve(null);
            }
        };

        request.onerror = () =>
            reject(request.error);
    });
}
