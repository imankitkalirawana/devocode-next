import Ca from "@/models/Ca";
import Endterm from "@/models/Endterm";
import Link from "@/models/Link";
import Midterm from "@/models/Midterm";
import Mcqs from "@/models/Mcqs";
import Moocs from "@/models/Moocs";
import Notes from "@/models/Notes";
import Reference from "@/models/Reference";
import Syllabus from "@/models/Syllabus";
import { connectDB } from "@/utils/db";
import verifyToken from "@/middleware/verifyToken";

connectDB();

const resourceWithCode = async () => {
  if (req.method === "GET") {
    const { subjectCode, resourceType, resourceId } = req.query;
    if (!resourceId) {
      if (!resourceType || !subjectCode) {
        res.status(400).json({
          message:
            "Subject code and resource type are required for getting resources.",
        });
        return;
      }
    }
  }
};

export default resourceWithCode;
