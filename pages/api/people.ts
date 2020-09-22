import { NextApiRequest, NextApiResponse } from 'next';
import openDB from '../../components/utils/db';

const getPeople = async (req:NextApiRequest, res:NextApiResponse) => {
    const db = await openDB();
    const people = await db.all('select * from person');
    res.json(people)
}

export default getPeople