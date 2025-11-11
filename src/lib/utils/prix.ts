import type IContestant from "./contestant";
import type ICup from "./cup";
import { AllCups } from "./cup";
import { getPlacementText, GrandPrixAdvanceCode } from "./helpers";

export const MaxStrikes = 3;
export const MaxCourses = 3;

export default class GrandPrix {
    contestants: IContestant[];
    cups: Array<ICup>;
    // once each cup is finished, the corresponding boolean will
    // be set to true
    cupsFinishedChecklist: Array<boolean>;
    currentCup: number;
    currentCourse: number;

    constructor()
    {
        this.contestants = [];
        this.cups = AllCups,
        this.cupsFinishedChecklist = Array<boolean>(AllCups.length).fill(false);
        this.currentCup = -1;
        this.currentCourse = -1;
    }

    advancePrix(placements: string[]): GrandPrixAdvanceCode {
        console.log(`contestants: ${JSON.stringify(this.contestants)}`);

        if (this.currentCourse == -1){
            return GrandPrixAdvanceCode.InvalidCourseError;
        }

        for (let i = 0; i < this.contestants.length; i++){
        //for (let contestant of this.contestants){
            let contestant = this.contestants[i];
            let contestantPlace = placements.indexOf(contestant.name);
            if (contestant.rival == null){
                return GrandPrixAdvanceCode.InvalidRivalError;
            }

            let rivalPlace = placements.indexOf(contestant.rival);
            console.log(`contestant ${contestant.name} placed ${getPlacementText(contestantPlace)} and their rival placed ${getPlacementText(rivalPlace)}`);
            if (contestantPlace > rivalPlace){
                contestant.strikeCount = (contestant.strikeCount + 1);
                if (contestant.strikeCount % MaxStrikes == 0 && contestant.strikeCount > 0){
                    contestant.score -= 1;
                }
            }

            contestant.score += placements.length - contestantPlace;

            if (contestantPlace == -1){
                return GrandPrixAdvanceCode.InvalidPlayerError;
            }
        }

        this.currentCourse += 1;
        if (this.currentCourse == MaxCourses){
            this.currentCourse = -1;
            this.cupsFinishedChecklist[this.currentCup] = true;
            return GrandPrixAdvanceCode.EndCup;
        }

        return GrandPrixAdvanceCode.NextCourse;
    }

    setCup(cupNumber: number) {
        this.currentCup = cupNumber;
        this.currentCourse = 0;
    }
    
    getCurrentCourseName(): string {
        if (this.currentCup < 0 || this.currentCup >= AllCups.length){
            return "N/A";
        }
        if (this.currentCourse < 0) {
            return "N/A";
        }
        if (this.currentCourse >= 3){
            return "Next cup..."
        }

        return this.cups[this.currentCup].courses[this.currentCourse];
    }

    getCurrentRankings(): {name: string, score: number, rivalName: string | null, strikes: number }[] {
        
        let ranks = this.contestants.map((contestant) => {
            return { 
                name: contestant.name,
                score: contestant.score,
                rivalName: contestant.rival,
                strikes: contestant.strikeCount,
            };
        });

        ranks.sort((a, b) => b.score - a.score);

        return ranks;
    }
}