import { NextApiRequest, NextApiResponse } from 'next';
import openDB from '../../../../components/utils/db';

const getAllVehiclesByPersonId = async (req:NextApiRequest, res:NextApiResponse) => {
    const db = await openDB();
    const vehicles = await db.all('select * from vehicle where ownerId = ?', [req.query.id]);
    res.json(vehicles)
}

export default getAllVehiclesByPersonId