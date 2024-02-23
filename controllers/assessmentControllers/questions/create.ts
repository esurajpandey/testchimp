import prisma from "../../../utils/init/prisma";
import _ from "lodash";

import {
  errorResponse,
  successResponse,
  Request,
  Response,
} from "../../../utils/Response/response";


const questionSelectQuery = {
  id: true,
  title: true,
  description: true,
  duration: true,
  isPremium: true,
  isSample: true,
  lookingForAsnwer: true,
  questionRelevant: true,
  QuestionCategories: {
    select: {
      category: true,
    },
  },
  source: true,
  type: {
    select: {
      title: true,
    },
  },
  mcq: true,
  coding: true,
};

const create = async (body: any) => {
  return prisma.$transaction(async (tx) => {
    const { type, options, isShuffle, answer, assessmentId } = body;
    const heading = body?.heading ?? "";

    const details = _.pick(body, [
      "duration",
      "description",
      "isSample",
      "lookingForAsnwer",
      "questionRelevant",
      "source",
      "title",
    ]);

    // console.log("Bug",details)
    const categories = body?.categories;

    const question = await tx.question.create({
      data: {
        ...details,
        type: {
          connect: {
            title: type,
          },
        },
        heading: heading,
      },
      select: questionSelectQuery,
    });

    if (!question) throw { msg: "Unable to create question", errorCode: 422 };

    //question categories
    if (!Array.isArray(categories))
      throw { msg: "Categories must be array", errorCode: 400 };

    let mappedCategory = categories.map((category) => {
      return {
        categoryId: category?.id,
        questionId: question?.id,
      };
    });

    await tx.questionCategories.createMany({
      data: mappedCategory,
    });

    //here need modification for  adding more types of question
    /**===========Create MCQ question ===========**/
    if (type === "MCQ") {
      if (!Array.isArray(options))
        throw { msg: "Options should be array", errorCode: 400 };

      if (!options.includes(answer))
        throw { msg: "Answer must belongs to options", errorCode: 400 };

      //create
      const mcq = await tx.mCQ.create({
        data: {
          answer,
          options,
          isShuffle,
          Question: {
            connect: {
              id: question?.id,
            },
          },
        },
      });

      if (!mcq) throw { msg: "Unable to create mcq", errorCode: 422 };
    }else if(type === "CODE"){
      //work in progress
    }

    //add to the assessment
    const assessmentQuestion = await tx.assessmentQuestion.create({
      data: {
        assessmentId: assessmentId,
        questionId: question?.id,
      },
    });
    return question;
  });
};

const createQuestion = async (req: Request, resp: Response) => {
  try {
    const question = await create(req.body);
    resp.status(201).send(successResponse(question, "Question created"));
  } catch (err: any) {
    console.log(err);
    resp.status(err?.errorCode ?? 500).send(errorResponse(err));
  }
};

export { createQuestion, questionSelectQuery };
