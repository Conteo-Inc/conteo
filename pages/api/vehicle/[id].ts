import { NextApiRequest, NextApiResponse } from 'next';
import openDB from '../../../components/utils/db';

const getVehicleById = async (req:NextApiRequest, res:NextApiResponse) => {
    const db = await openDB();
    const vehicles = await db.get('select * from vehicle where id = ?', [req.query.id]);
    res.json(vehicles)
}

export default getVehicleById