// keep any puerile jokes to yourself, pal.
export default interface ICup {
    cupName: string,
    courses: string[],
    imgSrc: string,
}

export const SelectCourseString = "[select course]";

export const AllCups: Array<ICup> = [
    {
        cupName: "Donpa Grand Prix",
        courses: ["E-Stadium", "Rainbow Garden", "Water Palace"],
        imgSrc: "/images/Donpa.png",
    }, {
        cupName: "Wisp Grand Prix",
        courses: ["Metal Harbor", "Sand Road", "Colorful Mall"],
        imgSrc: "/images/Wisp.webp",
    }, {
        cupName: "Boom Boo Grand Prix",
        courses: ["Mystic Jungle", "Apotos", "Wonder Museum"],
        imgSrc: "/images/BoomBoo.webp",
    }, {
        cupName: "Pumpkin Grand Prix",
        courses: ["Crystal Mine", "Ocean View", "Pumpkin Mansion"],
        imgSrc: "/images/Pumpkin.webp",
    }, {
        cupName: "Coral Grand Prix",
        courses: ["Urban Canyon", "Market Street", "Coral Town"],
        imgSrc: "/images/Coral.webp",
    }, {
        cupName: "Crystal Grand Prix",
        courses: ["Blizzard Valley", "Radical Highway", "Chao Park"],
        imgSrc: "/images/Crystal.webp",
    }, {
        cupName: "Egg Grand Prix",
        courses: ["Donpa Factory", "Aqua Forest", "Egg Expo"],
        imgSrc: "/images/Egg.webp",
    }, {
        cupName: "Secret Grand Prix",
        courses: ["Kronos Island", "Northstar Islands", "White Space"],
        imgSrc: "/images/Secret.webp",
    }, {
        cupName: "Crossover Grand Prix 1",
        courses: ["Minecraft World", SelectCourseString, SelectCourseString],
        imgSrc: "/images/Collab_Crossover_1.webp",
    }
]