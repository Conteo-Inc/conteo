const sqlite = require('sqlite')
const sqlite3 = require('sqlite3')

async function openDB() {
    return sqlite.open({
        filename: './mydb.sqlite',
        driver: sqlite3.Database
    })
}

async function setup() {
    const db = await openDB()
    await db.migrate({ force: true });

    // const people = await db.all('SELECT * FROM Person');
    // console.log(JSON.stringify(people, null, 2))

    // const vehicles = await db.all('SELECT * FROM Vehicle');
    // console.log(JSON.stringify(vehicles, null, 2))
}

setup();