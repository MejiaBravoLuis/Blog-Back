import User from '../users/user.model.js'
import Course from '../courses/course.model.js'

export const existenteEmail = async (email = '') => {
    
    const existeEmail = await User.findOne({ email });

    if(existeEmail){
        throw new Error(`El email ${ email } ya existe en la base de datos`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);

    if (!existeUsuario) {
        throw new Error(`El ID ${id} no existe`);
        
    }
}

export const existCourse = async (name = '') =>{
    const existenteCourse = await Course.findOne({ name });

    if(existenteCourse){
        throw new Error(` ${ name } already exists in db`);
    }
}
