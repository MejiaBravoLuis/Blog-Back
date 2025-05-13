import Publication from "./publication.model.js";
import Comment from "../comments/comments.model.js";
import Course from "../courses/course.model.js";

export const getPublication = async (req, res) => {
    try {
        const publications = await Publication.find({ status: true })
            .populate("user", "name username")
            .populate("course", "name")
            .populate({ path: "comments", select: "comment" });

        res.json({
            success: true,
            publications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to list the publications",
            error: error.message
        });
    }
};

export const addPublication = async (req, res) => {
    try {
        const { title, ppalText, courseName } = req.body;

        const course = await Course.findOne({ name: courseName });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: `Course ${courseName} not found`
            });
        }

        const newPublication = new Publication({
            title,
            ppalText,
            course: course._id,
            user: req.user._id
        });

        await newPublication.save();

        const populatedPublication = await Publication.findById(newPublication._id)
            .populate('user', 'username');

        res.status(201).json({
            success: true,
            message: "Publication added successfully",
            publication: populatedPublication
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to add a publication",
            error: error.message
        });
    }
};


export const updatePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, ppalText, courseName } = req.body;
        const userId = req.user._id;

        const publication = await Publication.findOne({ _id: id, user: userId });

        if (courseName) {
            const course = await Course.findOne({ name: courseName });
            publication.course = course._id;
        }

        if (title) publication.title = title;
        if (ppalText) publication.ppalText = ppalText;

        await publication.save();

        res.json({
            success: true,
            message: "Publication updated successfully!!!",
            publication
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to update the publication",
            error: error.message
        });
    }
};


export const deletePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const publication = await Publication.findOne({ _id: id, user: userId });
        if (!publication) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this publication or it doesn't exist"
            });
        }

        await Comment.deleteMany({ _id: { $in: publication.comments } });

        await Publication.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Publication and its comments deleted successfully",
            id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to delete the publication",
            error: error.message
        });
    }
};


export const addCommitTo = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        const authenticatedUser = req.user;

        const publication = await Publication.findById(id);

        const newCommit = new Comment({
            comment,
            user: authenticatedUser._id
        });

        await newCommit.save();

        publication.comments.push(newCommit._id);
        await publication.save();

        res.status(200).json({
            success: true,
            message: "You've just committed to this publication",
            comment: newCommit
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to commit the publication",
            error
        });
    }
};

export const getPublicationsByCourseName = async (req, res) => {
    try {
        const { name } = req.params;

        const course = await Course.findOne({ name: new RegExp(`^${name}$`, "i") });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: `Course "${name}" not found`
            });
        }

        const publications = await Publication.find({ course: course._id })
            .populate("user", "username")
            .populate("course", "name")
            .populate({
                path: "comments",
                select: "comment user status createdAt",
                populate: {
                    path: "user", 
                    select: "userName",
                },
            });

        res.status(200).json({
            success: true,
            message: `Publications for course "${course.name}"`,
            publications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to get the publications",
            error: error.message
        });
    }
};

