import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../utils/db";
import Subject from "./models/Subjects";

connectDB();

// get subject api

const getSubjects = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const subjects = await Subject.find({});
        res.status(200).json({ subjects });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching subjects' });
    }
};

export default getSubjects;