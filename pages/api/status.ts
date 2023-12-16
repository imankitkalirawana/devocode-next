// pages/api/status.js
import { NextApiRequest, NextApiResponse } from 'next';

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({ message: 'Server is online' });
};

export default handler;
