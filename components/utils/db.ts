import { open } from "sqlite";
import sqlite from "sqlite3";

const openDB = async () => {
  return open({
    filename: "./mydb.sqlite",
    driver: sqlite.Database,
  });
};

export default openDB;
