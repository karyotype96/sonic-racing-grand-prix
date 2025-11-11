export enum GrandPrixPageState {
    EnterContestants,
    SelectRivals,
    SelectCup,
    EnterPositions,
    PlayAnimation,
    ShowWinners
};

export enum GrandPrixAdvanceCode {
    NextCourse,
    EndCup,
    InvalidCourseError,
    InvalidPlayerError,
    InvalidRivalError,
}

export function getPlacementText(num: number) {
    let comparedNum = num + 1;

    switch (comparedNum % 10){
        case 1:
            return `${comparedNum}st`;
        case 2:
            return `${comparedNum}nd`;
        case 3:
            return `${comparedNum}rd`;
    }

    return `${comparedNum}th`;
}