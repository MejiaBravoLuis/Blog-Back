import Comment from "./comments.model.js";
import Publication from "../publications/publication.model.js";

export const addCommitTo = async (req, res) => {
    try {
        const { comment, user } = req.body; 
        const { id } = req.params;

        if (!comment) {
            return res.status(400).json({
                success: false,
                message: "Comment is required"
            });
        }

        const publication = await Publication.findById(id);
        if (!publication) {
            return res.status(404).json({
                success: false,
                message: "Publication not found"
            });
        }

        const newComment = new Comment({
            comment,
            user: user || "Anonymous" 
        });

        await newComment.save();

        publication.comments.push(newComment._id);
        await publication.save();

        res.status(201).json({
            success: true,
            message: "You've added a new comment",
            data: newComment 
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
    const { comment, user } = req.body;

    console.log("Datos recibidos para actualización:", { comment, user });

    const commentToUpdate = await Comment.findById(id);
    if (!commentToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Comentario no encontrado",
      });
    }

    commentToUpdate.comment = comment || commentToUpdate.comment;
    commentToUpdate.user = user || commentToUpdate.user;

    await commentToUpdate.save(); 

    res.json({
      success: true,
      message: "Comentario actualizado con éxito",
      comment: commentToUpdate,
    });
  } catch (error) {
    console.error("Error en backend:", error);
    res.status(500).json({
      success: false,
      message: "Hubo un problema al actualizar el comentario",
      error: error.message,
    });
  }
};



export const deleteCommit = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comentario no encontrado"
            });
        }

        await Publication.updateOne(
            { "comments": id }, 
            { $pull: { comments: id } } 
        );

        res.status(200).json({
            success: true,
            message: "Comentario eliminado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Hubo un error al eliminar el comentario",
            error
        });
    }
};