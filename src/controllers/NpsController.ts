import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepositary";

class NpsController {
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository); 

    const surveysUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull())
    });

    const detractors = surveysUsers.filter(survey => (survey.value >= 0 && survey.value <= 6)).length;
    const passives = surveysUsers.filter(survey => (survey.value >= 7 && survey.value <= 8)).length;
    const promoters = surveysUsers.filter(survey => (survey.value >= 9 && survey.value <= 10)).length;
    const totalAnswers = surveysUsers.length;

    const calculate = ((promoters - detractors) / totalAnswers) * 100;

    return response.json({
      detractors,
      passives,
      promoters,
      totalAnswers,
      nps: Number(calculate.toFixed(2))
    }); 
  }
}

export { NpsController }