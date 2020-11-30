import { Filter } from "./filter";

export class Structure extends Filter {
    value?: string;
    name?: string;
    areaType: string;
areaName: string;
areaCode: string;
date: string;
hash: string;
newCasesByPublishDate: string;
cumCasesByPublishDate: string;
cumCasesBySpecimenDateRate: string;
newCasesBySpecimenDate: string;

cumCasesBySpecimenDate: string;
maleCases: string;
femaleCases: string;
newPillarOneTestsByPublishDate: string;
cumPillarOneTestsByPublishDate: string;
newPillarTwoTestsByPublishDate: string;
cumPillarTwoTestsByPublishDate: string;
newPillarThreeTestsByPublishDate: string;
cumPillarThreeTestsByPublishDate: string;
newPillarFourTestsByPublishDate: string;
cumPillarFourTestsByPublishDate: string;
newAdmissions: string;
cumAdmissions: string;
cumAdmissionsByAge: string;
cumTestsByPublishDate: string;
newTestsByPublishDate: string;
covidOccupiedMVBeds: string;
hospitalCases: string;
plannedCapacityByPublishDate: string;
newDeaths28DaysByPublishDate: string;
cumDeaths28DaysByPublishDate: string;
cumDeaths28DaysByPublishDateRate: string;
newDeaths28DaysByDeathDate: string;
cumDeaths28DaysByDeathDate: string;
cumDeaths28DaysByDeathDateRate: string;

}
