import { NextApiRequest, NextApiResponse } from 'next';
import openDB from '../../components/utils/db';

const getAllVehicles = async (req:NextApiRequest, res:NextApiResponse) => {
    const db = await openDB();
    const vehicles = await db.all('select * from vehicle');
    res.json(vehicles)
}

export default getAllVehicles