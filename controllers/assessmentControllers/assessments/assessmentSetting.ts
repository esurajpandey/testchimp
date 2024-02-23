import prisma from "../../../utils/init/prisma";
import _ from 'lodash';
import { successResponse,errorResponse,Request,Response } from "../../../utils/Response/response";

export default async (req: Request,resp : Response) => {
    try{
        const assessmentId = req.params.assessmentId;

        const updateDetails = _.pick(req.body,[
            "extraTime",
            "isAntiCheatingEnabled",
            "isAccomodationForAbnormal",
            "isAccomodationForNonFluent",
        ])
        const assessment = await prisma.assessment.update({
            where : {
                id : assessmentId
            },
            data : {
                ...updateDetails
            }
        });
        
    }catch(err) {

    }
}