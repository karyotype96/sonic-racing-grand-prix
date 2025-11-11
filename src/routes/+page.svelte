<script lang="ts">
    import AnimatedLeaderboard from "$lib/components/AnimatedLeaderboard.svelte";
    import ContestantForm from "$lib/components/ContestantForm.svelte";
    import Leaderboard from "$lib/components/Leaderboard.svelte";
    import SelectCup from "$lib/components/SelectCup.svelte";
    import SelectRivals from "$lib/components/SelectRivals.svelte";
    import ShowWinners from "$lib/components/ShowWinners.svelte";
    import type IContestant from "$lib/utils/contestant";
    import { getPlacementText, GrandPrixAdvanceCode, GrandPrixPageState } from "$lib/utils/helpers";
    import type IPrix from "$lib/utils/prix";
    import GrandPrix, { MaxStrikes } from "$lib/utils/prix";

    import { animate, splitText, stagger } from "animejs";

    import _ from "lodash";

    const ChunkSize = 7;

    let contestants = $state(Array<IContestant>());

    let programState = $state(GrandPrixPageState.EnterContestants);
    let postRaceProgramState = $state(GrandPrixPageState.EnterContestants);

    let enterContestantsErrorMessage = $state("");
    let setRivalsErrorMessage = $state("");

    let prix: IPrix = $state(new GrandPrix());

    let positions: Array<string> = $state(new Array<string>());

    let animationLock = false;

    // play animations when page is entered
    $effect(() => {
        if (programState == GrandPrixPageState.PlayAnimation){
            animationLock = true;

            animate('.animated-row', {
                opacity: [0, 1],
                translateY: [50, 0],
                duration: 500,
                delay: stagger(400)
            }).then(() => {
                animationLock = false;
            })
        }

        if (programState == GrandPrixPageState.ShowWinners){
            animationLock = true;

            animate(".winner-name", {
                opacity: 0,
                duration: 0,
            });
            animate(".runner-up", {
                opacity: 0,
                duration: 0,
            });

            animate(".winner-text", {
                translateY: [-500, 0],
                duration: 500,
            }).then(() => {
                animate(".winner-name", {
                    opacity: [0, 1],
                    translateY: [50, 0],
                    duration: 500,
                }).then(() => {
                    animate(".runner-up", {
                        opacity: [0, 1],
                        translateY: [50, 0],
                        duration: 500,
                        delay: stagger(400),
                    }).then(() => {
                        animationLock = false;
                    })
                });
            });

            
        }
    });

    function addNewContestant(){
        let newContestant: IContestant = {
            name: "",
            score: 0,
            rival: null,
            strikeCount: 0,
            justStruckOut: false,
        };

        contestants.push(newContestant);
    }

    function removeContestant(index: number){
        contestants.splice(index, 1);
    }

    function beginPrix(){
        enterContestantsErrorMessage = "";

        for (let contestant of contestants){
            prix.contestants.push(contestant);
        }

        let dedupedContestants = [... new Set(contestants.map((value) => value.name))];

        if (contestants.length < 2){
            enterContestantsErrorMessage = "Entrant list should not have less than 1 entrant";
            return;
        }

        if (dedupedContestants.length != contestants.length){
            enterContestantsErrorMessage = "Please ensure each entrant has a unique name";
            return;
        }

        for (let contestant of contestants){
            if (contestant.name.trim() == ""){
                enterContestantsErrorMessage = "Please enter the names of all entrants";
                return;
            }
        };

        programState = GrandPrixPageState.SelectRivals;
    }

    function selectRival(contestantNumber: number, rivalName: string){
        console.log(`rivalName = ${rivalName}`);
        let contestant: IContestant = contestants.filter((_, index) => index == contestantNumber)[0];
        
        if (rivalName == ""){
            contestant.rival = null;
            return;
        }
        
        let rival: IContestant = contestants.filter((c, _) => c.name == rivalName)[0];

        contestant.rival = rival.name;
    }

    function submitRivals(){
        let contestantsWithNoRivals = contestants.filter((c, _) => c.rival == null);
        if (contestantsWithNoRivals.length > 0){
            setRivalsErrorMessage = "All contestants must have a rival selected";
            return;
        }

        programState = GrandPrixPageState.SelectCup;
    }

    function selectCup(cupNumber: number) {
        if (prix.cupsFinishedChecklist[cupNumber]) return;

        prix.setCup(cupNumber);

        programState = GrandPrixPageState.EnterPositions;

        resetPositions();

        console.log(prix.getCurrentRankings());
    }

    function resetPositions(){
        positions.splice(0, positions.length);

        for (let contestant of contestants){
            positions.push(contestant.name);
        }
    }

    function moveSortableUp(index: number){
        if (index == 0) return;

        if (!animationLock){
            animationLock = true;

            animate(`.box-${index-1}`, {
                translateY: [
                    {to: '43.5px', ease: 'inOutExpo', duration: 400},
                    {to: '0px', duration: 0}
                ]
            })

            animate(`.box-${index}`, {
                translateY: [
                    {to: '-43.5px', ease: 'inOutExpo', duration: 400},
                    {to: '0px', duration: 0}
                ]
            }).then(() => {
                let moving = positions.splice(index, 1)[0];
                positions.splice(index-1, 0, moving);
                animationLock = false;
            })
        }
    }

    function moveSortableDown(index: number){
        if (index > positions.length) return;

        if (!animationLock){
            animationLock = true;

            animate(`.box-${index+1}`, {
                translateY: [
                    {to: '-43.5px', ease: 'inOutExpo', duration: 400},
                    {to: '0px', duration: 0}
                ]
            });

            animate(`.box-${index}`, {
                translateY: [
                    {to: '43.5px', ease: 'inOutExpo', duration: 400},
                    {to: '0px', duration: 0}
                ]
            }).then(() => {
                let moving = positions.splice(index, 1)[0];
                positions.splice(index+1, 0, moving);
                animationLock = false;
            })
        }
    }

    function advanceRace(){
        if (animationLock) return;

        let code = prix.advancePrix(positions);

        switch (code){
            case GrandPrixAdvanceCode.NextCourse:
                postRaceProgramState = GrandPrixPageState.EnterPositions;
                programState = GrandPrixPageState.PlayAnimation;
                break;
            case GrandPrixAdvanceCode.EndCup:
                if (prix.cupsFinishedChecklist.filter((check) => !check).length > 0){
                    postRaceProgramState = GrandPrixPageState.SelectCup;
                } else {
                    postRaceProgramState = GrandPrixPageState.ShowWinners;
                }
                programState = GrandPrixPageState.PlayAnimation;
                break;
            case GrandPrixAdvanceCode.InvalidCourseError:
                console.log("Error: invalid course selected");
                break;
            case GrandPrixAdvanceCode.InvalidPlayerError:
                console.log("Error: invalid player or player values");
                break;
            case GrandPrixAdvanceCode.InvalidRivalError:
                console.log("Error: player has invalid rival");
        }
    }

    function resultsNextPage(){
        programState = postRaceProgramState;
    }
</script>

{#if programState == GrandPrixPageState.EnterContestants}
<ContestantForm 
    {contestants}
    {addNewContestant}
    {removeContestant}
    {beginPrix}
    errorMessage={enterContestantsErrorMessage}
/>
{/if}

{#if programState == GrandPrixPageState.SelectRivals}
<SelectRivals 
    {contestants}
    {setRivalsErrorMessage}
    {selectRival}
    {submitRivals}
/>
{/if}

{#if programState == GrandPrixPageState.SelectCup}
<SelectCup 
    {prix}
    {ChunkSize}
    {selectCup}
/>
{/if}

{#if programState == GrandPrixPageState.EnterPositions}
<Leaderboard 
    {prix}
    {positions}
    {getPlacementText}
    {moveSortableUp}
    {moveSortableDown}
    {advanceRace}
/>
{/if}

{#if programState == GrandPrixPageState.PlayAnimation}
<AnimatedLeaderboard 
    {prix}
    {resultsNextPage}
/>
{/if}

{#if programState == GrandPrixPageState.ShowWinners}
<ShowWinners
    {prix}
/>
{/if}