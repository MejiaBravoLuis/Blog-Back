import User from '../users/user.model.js'
import Course from '../courses/course.model.js'

export const existenteEmail = async (email = '') => {
    
    const existeEmail = await User.findOne({ email });

    if(existeEmail){
        throw new Error(`El email ${ email } ya está en uso`);
    }
}

export const existUsername = async (username = '') => {
    const existenteUsername = await User.findOne({username});

    if (existenteUsername) {
        throw new Error(`El username ${ username } ya está en uso`)
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
