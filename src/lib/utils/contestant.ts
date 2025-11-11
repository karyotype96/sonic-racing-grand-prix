export default interface IContestant {
    name: string,
    score: number,
    rival: string | null,
    strikeCount: number;
    justStruckOut: boolean;
}