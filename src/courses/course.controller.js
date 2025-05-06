import Course from "./course.model.js";

export const listCourses = async (req, res) => {
    try {
        const cateories = await Course.find({ status: true })
        res.json({
            success: true,
            cateories
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to get the Courses",
            error
        })
    }
}

export const addCourse = async (req, res) => {
    try {

        const { name } = req.body;
        const course = new Course({ name })
        await course.save()

        res.status(200).json({
            success: true,
            message: `Course ${name} created succesfully`,
            Course
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to create the Course",
            error
        })
    }
}

export const updateCourse = async (req, res) => {
    try {
        
        const { id } = req.params;

        const updatedCourse = await Course.findByIdAndUpdate(id, req.body, { new: true })
        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Could not find the Course"
            });
        }

        res.json({
            success: true,
            message: "You've just updated the Course successfully!!!",
            Course: updatedCourse
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "Ups, something went wrong trying to update the Course",
            error: error.message,
        })
    }
}

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params
        const course = await Course.findByIdAndUpdate( id, { status: false }, { new : true });

        res.status(200).json({
            success: true,
            message: "Course deactivated succesfully",
            course
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            message: "Ups, something went wrong trying to deactivate the Course",
            error
        })
    }
}