import { NextApiRequest, NextApiResponse } from "next";
import openDB from "../../../../components/utils/db";

const getPersonById = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await openDB();

  if (req.method === "PUT") {
    //automatically sanitized
    const statement = await db.prepare(
      "update person set name = ?, email = ?, where id = ?"
    );

    const result = await statement.run(
      req.body.name,
      req.body.email,
      req.body.id
    );
    result.stmt.finalize();
  }

  const person = await db.get("select * from person where id = ?", [
    req.query.id,
  ]);
  res.json(person);
};

export default getPersonById;
