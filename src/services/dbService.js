import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("activities.db");

export const initializeDb = async () => {
    try {
        // ⚠️ DANGER: This deletes all data! Use only during development.
        // Uncomment the line below to reset the table structure:
        // await db.execAsync(`DROP TABLE IF EXISTS activities;`);
        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS activities (id TEXT PRIMARY KEY, name TEXT, description TEXT, latitude TEXT, longitude TEXT, rating TEXT, pictureLink TEXT, bookingLink TEXT, price TEXT, location TEXT);`
        );
        return true;
    } catch (error) {
        console.error("Db init error: ", error);
        return false;
    }
};

export const saveActivity = async (activity) => {
    try {
        console.log(activity);
        if (!activity) return;
        await db.runAsync(
            "INSERT INTO activities (id, name, description, latitude, longitude, rating, pictureLink, bookingLink, price, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
            activity.id,
            activity.name,
            activity.description,
            activity.geoCode.latitude,
            activity.geoCode.longitude,
            activity.rating,
            activity.pictures[0],
            activity.bookingLink,
            activity.price.amount,
            activity.location
        );
        console.log("Item added");
    } catch (error) {
        console.error("Could not add item", error);
    }
};

export const deleteActivity = async (id) => {
    try {
        await db.runAsync("DELETE FROM activities WHERE id=?", id);
        console.log("Item deleted");
    } catch (error) {
        console.error("Could not delete item", error);
    }
};

export const getAllActivities = async () => {
    try {
        return await db.getAllAsync("SELECT * from activities;");
    } catch (error) {
        console.error("Could not get items", error);
        return [];
    }
};

export const getActivityById = async (id) => {
    try {
        return await db.getAllAsync("SELECT * from activities WHERE id=?;", id);
    } catch (error) {
        console.error("Could not get items", error);
        return [];
    }
};
