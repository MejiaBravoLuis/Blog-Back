import Comment from "./comments.model.js";
import Publication from "../publications/publication.model.js";

export const addCommitTo = async (req, res) => {
    try {
        const { comment, user } = req.body; // Aseguramos que estamos desestructurando correctamente
        const { id } = req.params;

        // Validar que el comentario no esté vacío
        if (!comment) {
            return res.status(400).json({
                success: false,
                message: "Comment is required"
            });
        }

        // Comprobamos si la publicación existe
        const publication = await Publication.findById(id);
        if (!publication) {
            return res.status(404).json({
                success: false,
                message: "Publication not found"
            });
        }

        // Creamos el nuevo comentario
        const newComment = new Comment({
            comment,
            user: user || "Anonymous"  // Si no se pasa un user, ponemos "Anonymous"
        });

        await newComment.save();

        // Asociamos el comentario con la publicación
        publication.comments.push(newComment._id);
        await publication.save();

        res.status(201).json({
            success: true,
            message: "You've added a new comment",
            comment: newComment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to add a comment",
            error: error.message
        });
    }
};

export const listMyCommit = async (req, res) => {
    try {
        const userId = req.user._id;

        const comments = await Comment.find({ user: userId });

        res.json({
            success: true,
            comments
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Ups, something went wrong trying to get the comments"
        })
    }
}

export const updtateCommit = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const comment = await Comment.findOne({ _id : id, user : userId });

        if (!comment) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to edit this comment"
            });
        }
        const updatedComment = await Comment.findByIdAndUpdate(id, req.body, { new : true });

        res.json({
            success: true,
            message: "You've updated your commit successfully!!",
            commit: updatedComment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to update the commit"
        });
    }
}

export const deleteCommit = async (req, res) => {
    try {

        const { id } = req.params;
        const userId = req.user._id;
        
        const comment = await Comment.findOne({ _id: id, user: userId });

        if (!comment) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this commit"
            });
        }
        await Comment.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "You've deleted this commit successfully!!!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to delete the commit",
            error
        })
    }
}