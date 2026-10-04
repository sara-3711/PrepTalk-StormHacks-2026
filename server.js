import express from "express";

import dotenv from "dotenv";

import {
    GoogleGenerativeAI
} from "@google/generative-ai";

import {
    generateQuestions
} from "./generateQuestions.js";

import "./feedback.js";


dotenv.config();


const app = express();

const PORT = 3000;



// MIDDLEWARE


app.use(express.json());

app.use(express.static("."));




// FEEDBACK LOGIC FROM PERSON 3


const FeedbackLogic =
    globalThis.FeedbackLogic;




// GEMINI SETUP FOR FEEDBACK


const genAI =
    new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY
    );


const feedbackModel =
    genAI.getGenerativeModel({

        model: "gemini-2.5-pro"

    });




// API: GENERATE QUESTIONS
// Person 2's code


app.post(
    "/api/questions",

    async (req, res) => {

        try {

            const {
                topic,
                audience
            } = req.body;


            if (!topic) {

                return res
                    .status(400)
                    .json({

                        error:
                            "Presentation topic is required."

                    });

            }


            const questions =
                await generateQuestions(
                    topic,
                    audience
                );


            if (
                !questions ||
                questions.length === 0
            ) {

                return res
                    .status(503)
                    .json({

                        error:
                            "AI could not generate questions."

                    });

            }


            res.json({
                questions
            });


        } catch (error) {

            console.error(
                "Question error:",
                error
            );


            res
                .status(500)
                .json({

                    error:
                        "Could not generate questions."

                });

        }

    }
);




// API: FEEDBACK
// Person 3's code + Gemini


app.post(
    "/api/feedback",

    async (req, res) => {

        try {

            const {

                topic,

                audience,

                question,

                answer

            } = req.body;



            const prompt =
                FeedbackLogic.createFeedbackPrompt({

                    question,

                    answer,

                    topic,

                    audience

                });



            const result =
                await feedbackModel.generateContent(
                    prompt
                );


            const rawText =
                result.response.text();



            const feedback =
                FeedbackLogic.parseFeedback(
                    rawText
                );



            res.json(
                feedback
            );


        } catch (error) {

            console.error(
                "Feedback error:",
                error
            );


            res
                .status(500)
                .json({

                    error:
                        error.message ||
                        "Could not generate feedback."

                });

        }

    }
);




// START SERVER


app.listen(
    PORT,

    () => {

        console.log(
            `PrepTalk is running at http://localhost:${PORT}`
        );

    }
);