'use strict';

import mongoose from "mongoose";
import Usuario from "../src/users/user.model.js";
import Course from "../src/courses/course.model.js";
import { hash } from "argon2";

export const dbConnection = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.log('Could not connect to MongoDB');
            mongoose.disconnect();
        });

        mongoose.connection.on('connecting', () => {
            console.log('Trying to connect...');
        });

        mongoose.connection.on('connected', async () => {
            console.log('Connected to MongoDB');

            try {
                const adminExists = await Usuario.findOne({ role: "ADMIN" });
                if (!adminExists) {
                    const adminPassword = await hash("12345678"); 
                    await Usuario.create({
                        name: "Admin",
                        surname: "User",
                        username: "admin",
                        email: "admin@gmail.com",
                        password: adminPassword,
                        role: "ADMIN"
                    });
                    console.log(" Usuario administrador creado");
                } else {
                }

                const defaultCourse = await Course.findOne({ name: "default" });
                if (!defaultCourse) {
                    await Course.create({ name: "default" });
                    console.log("Curso 'default' creado");
                } else {
                }

            } catch (error) {
                console.error("Error al verificar/crear el admin:", error);
            }
        });

        mongoose.connection.on('open', () => {
            console.log('Database connection open');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('Reconnected to MongoDB');
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Disconnected from MongoDB');
        });

        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50,
        });

    } catch (error) {
        console.log('Database connection failed:', error);
    }
};