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

const resource = async (req, res) => {
  if (req.method === "GET") {
    const { resourceType, subjectId, resourceId } = req.query;

    if (resourceId) {
      if (!resourceType || !resourceId) {
        res.status(400).json({
          message:
            "resourceType and resourceId are required for getting resources.",
        });
        return;
      }
      if (resourceType === "ca") {
        const ca = await Ca.findById(resourceId);
        res.status(200).json(ca);
      } else if (resourceType === "endterm") {
        const endterm = await Endterm.findById(resourceId);
        res.status(200).json(endterm);
      } else if (resourceType === "link") {
        const link = await Link.findById(resourceId);
        res.status(200).json(link);
      } else if (resourceType === "mcqs") {
        const mcqs = await Mcqs.findById(resourceId);
        res.status(200).json(mcqs);
      } else if (resourceType === "midterm") {
        const midterm = await Midterm.findById(resourceId);
        res.status(200).json(midterm);
      } else if (resourceType === "moocs") {
        const moocs = await Moocs.findById(resourceId);
        res.status(200).json(moocs);
      } else if (resourceType === "notes") {
        const notes = await Notes.findById(resourceId);
        res.status(200).json(notes);
      } else if (resourceType === "reference") {
        const reference = await Reference.findById(resourceId);
        res.status(200).json(reference);
      } else if (resourceType === "syllabus") {
        const syllabus = await Syllabus.findById(resourceId);
        res.status(200).json(syllabus);
      } else {
        res.status(400).json({
          message: "resourceType is invalid.",
        });
      }
    } else {
      if (!resourceType || !subjectId) {
        res.status(400).json({
          message:
            "resourceType and subjectId are required for getting resources.",
        });
        return;
      }
      if (resourceType === "ca") {
        const ca = await Ca.find({ subject: subjectId });
        res.status(200).json(ca);
      } else if (resourceType === "endterm") {
        const endterm = await Endterm.find({ subject: subjectId });
        res.status(200).json(endterm);
      } else if (resourceType === "link") {
        const link = await Link.find({ subject: subjectId });
        res.status(200).json(link);
      } else if (resourceType === "mcqs") {
        const mcqs = await Mcqs.find({ subject: subjectId });
        res.status(200).json(mcqs);
      } else if (resourceType === "midterm") {
        const midterm = await Midterm.find({ subject: subjectId });
        res.status(200).json(midterm);
      } else if (resourceType === "moocs") {
        const moocs = await Moocs.find({ subject: subjectId });
        res.status(200).json(moocs);
      } else if (resourceType === "notes") {
        const notes = await Notes.find({ subject: subjectId });
        res.status(200).json(notes);
      } else if (resourceType === "reference") {
        const reference = await Reference.find({ subject: subjectId });
        res.status(200).json(reference);
      } else if (resourceType === "syllabus") {
        const syllabus = await Syllabus.find({ subject: subjectId });
        res.status(200).json(syllabus);
      } else {
        res.status(400).json({
          message: "resourceType is invalid.",
        });
      }
    }
  } else {
    verifyToken(req, res, async () => {
      if (req.method === "POST") {
        try {
          const { subjectId, resourceType } = req.query;
          let resourceData = null;
          switch (resourceType) {
            case "ca":
              resourceData = new Ca(req.body);
              break;
            case "endterm":
              resourceData = new Endterm(req.body);
              break;
            case "link":
              resourceData = new Link(req.body);
              break;
            case "mcqs":
              resourceData = new Mcqs(req.body);
              break;
              resourceData = new Endterm(req.body);
              break;
            case "midterm":
              resourceData = new Midterm(req.body);
              break;
            case "moocs":
              resourceData = new Moocs(req.body);
              break;
            case "notes":
              resourceData = new Notes(req.body);
              break;
            case "reference":
              resourceData = new Reference(req.body);
              break;
            case "syllabus":
              resourceData = new Syllabus(req.body);
              break;
            default:
              res.status(400).json({
                message: "resourceType is invalid.",
              });
              return;
          }
          resourceData.subject = subjectId;
          await resourceData.save();
          res.status(201).json(resourceData);
        } catch (error) {
          console.error("Error creating resource:", error);
          res.status(500).send("Internal Server Error");
        }
      } else if (req.method === "PUT") {
        try {
          const { resourceType, resourceId } = req.query;
          let resourceData = null;
          switch (resourceType) {
            // Handle each resource type
            case "ca":
              resourceData = await Ca.findByIdAndUpdate(resourceId, req.body, {
                new: true,
              });
              break;
            case "endterm":
              resourceData = await Endterm.findByIdAndUpdate(
                resourceId,
                req.body,
                {
                  new: true,
                }
              );
              break;
            case "link":
              resourceData = await Link.findByIdAndUpdate(
                resourceId,
                req.body,
                {
                  new: true,
                }
              );
              break;
            case "mcqs":
              resourceData = await Mcqs.findByIdAndUpdate(
                resourceId,
                req.body,
                {
                  new: true,
                }
              );
            case "midterm":
              resourceData = await Midterm.findByIdAndUpdate(
                resourceId,
                req.body,
                {
                  new: true,
                }
              );
              break;
            case "mcqs":
              resourceData = await Endterm.findByIdAndUpdate(
                resourceId,
                req.body,
                {
                  new: true,
                }
              );
              break;
            case "moocs":
              resourceData = await Moocs.findByIdAndUpdate(
                resourceId,
                req.body,
                {
                  new: true,
                }
              );
              break;
            case "notes":
              resourceData = await Notes.findByIdAndUpdate(
                resourceId,
                req.body,
                {
                  new: true,
                }
              );
              break;
            case "reference":
              resourceData = await Reference.findByIdAndUpdate(
                resourceId,
                req.body,
                {
                  new: true,
                }
              );
              break;
            case "syllabus":
              resourceData = await Syllabus.findByIdAndUpdate(
                resourceId,
                req.body,
                {
                  new: true,
                }
              );
              break;
            default:
              break;
          }

          res.status(200).json(resourceData);
        } catch (error) {
          console.error("Error updating resource:", error);
          res.status(500).send("Internal Server Error");
        }
      } else if (req.method === "DELETE") {
        try {
          const { resourceType, resourceId } = req.query;
          let resourceData = null;
          switch (resourceType) {
            // Handle each resource type
            case "ca":
              resourceData = await Ca.findByIdAndDelete(resourceId);
              break;
            case "endterm":
              resourceData = await Endterm.findByIdAndDelete(resourceId);
              break;
            case "link":
              resourceData = await Link.findByIdAndDelete(resourceId);
              break;
            case "mcqs":
              resourceData = await Mcqs.findByIdAndDelete(resourceId);
              break;
            case "midterm":
              resourceData = await Midterm.findByIdAndDelete(resourceId);
              break;
            case "moocs":
              resourceData = await Moocs.findByIdAndDelete(resourceId);
              break;
            case "notes":
              resourceData = await Notes.findByIdAndDelete(resourceId);
              break;
            case "reference":
              resourceData = await Reference.findByIdAndDelete(resourceId);
              break;
            case "syllabus":
              resourceData = await Syllabus.findByIdAndDelete(resourceId);
              break;
            default:
              break;
          }

          res.status(200).json(resourceData);
        } catch (error) {
          console.error("Error deleting resource:", error);
          res.status(500).send("Internal Server Error");
        }
      } else {
        res.status(400).json({
          message: "This API only supports GET method.",
        });
      }
    });
  }
};

export default resource;
