<script lang="ts">
    import ContestantForm from "$lib/components/ContestantForm.svelte";
    import SelectRivals from "$lib/components/SelectRivals.svelte";
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
<div id='select-cup'>
    <header class='leaderboard-header'>
        Select Cup
    </header>
    {#each _.chunk(prix.cups, ChunkSize) as cupChunk, chunkIndex}
    <div class='cup-container'>
        {#each cupChunk as cup, cupIndex}
            <button class='cup {prix.cupsFinishedChecklist[chunkIndex*ChunkSize + cupIndex] ? 'disabled' : ''}'
                onclick={(e) => { selectCup(chunkIndex*ChunkSize + cupIndex) }}
            >
                <img src='{cup.imgSrc}' alt='{cup.cupName}'/><div>{cup.cupName}</div>
            </button>
        {/each}
    </div>
    {/each}
</div>
{/if}

{#if programState == GrandPrixPageState.EnterPositions}
<div id='leaderboard'>
    <header class='leaderboard-header'>
        Leaderboards
    </header>

    <table class='current-race'>
        <tbody>
            <tr>
                <td colspan='2' class='current-course-display'>
                    <div class='label'>Current course: </div>
                    <div class='course-name'>{prix.getCurrentCourseName()}</div>
                    <div class='additional-info'>Course #{prix.currentCourse+1} of {prix.cups[prix.currentCup].cupName}</div>
                </td>
            </tr>
        </tbody>
    </table>

    <div class='leaderboard-main'>
        <div class='sortable-positions'>
            {#each positions as position, index}
                <div class='sortable-box box-{index}'>
                    <div class='label'>
                        {position}
                    </div>
                    <div class='placement-text'>{getPlacementText(index)}</div>
                    <div class='arrows'>
                        <div role='button'
                            tabindex={1}
                            class='up-arrow'
                            onclick={(e) => {moveSortableUp(index)}} 
                            onkeypress={(e) => {moveSortableUp(index)}}>
                        </div>
                        <div role='button'
                            tabindex={1}
                            class='down-arrow'
                            onclick={(e) => {moveSortableDown(index)}}
                            onkeypress={(e) => {moveSortableDown(index)}}
                        ></div>
                    </div>
                </div>
            {/each}
            <div class='button-container'>
                <button class='contestant-button complete-race' onclick={advanceRace}>Complete Race</button>
            </div>
        </div>
        <div class='big-leaderboard'>
            <table>
                <tbody>
                    {#each prix.getCurrentRankings() as ranking, index}
                        <tr class={index == 0 ? 'rank-top-row' : 'rank-row'}>
                            <td class='rank-pos {index == 0 ? 'rank-first' : index == 1 ? 'rank-second' : index == 2 ? 'rank-third' : ''}'>{getPlacementText(index)}</td>
                            <td class='rank-name'>{ranking.name}</td>
                            <td class='rank-score'>{ranking.score} pts</td>
                            <td class='rank-rival'>Rival: {ranking.rivalName}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
{/if}

{#if programState == GrandPrixPageState.PlayAnimation}
<div id='animated-leaderboard'>
    <header class='leaderboard-header'>
        Leaderboards
    </header>
    <div class='big-leaderboard-result'>
        {#each prix.getCurrentRankings() as ranking, index}
            <div class='{index == 0 ? 'rank-top-row' : 'rank-row'} animated-row'>
                <table>
                    <tbody>
                        <tr>
                            <td class='rank-pos {index == 0 ? 'rank-first' : index == 1 ? 'rank-second' : index == 2 ? 'rank-third' : ''}'>{getPlacementText(index)}</td>
                            <td class='rank-name'>{ranking.name}</td>
                            <td class='rank-score'>{ranking.score} pts</td>
                            <td class='rank-rival'>Rival: {ranking.rivalName}</td>
                            <td class='rank-strikes'>{ranking.strikes % MaxStrikes} strike{ranking.strikes % MaxStrikes != 1 ? 's' : ''}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
        {/each}
        <div class='button-container'>
            <button class='contestant-button next-page' onclick={resultsNextPage}>Next</button>
        </div>
    </div>
</div>
{/if}

{#if programState == GrandPrixPageState.ShowWinners}
<div class='show-winners'>
    <div class='winner-text'>Winner!</div>
    <div class='winner-name'>1st place: {prix.getCurrentRankings()[0].name} - {prix.getCurrentRankings()[0].score} pts</div>
    {#each prix.getCurrentRankings() as ranking, index}
        {#if index > 0}
            <div class='runner-up'>{getPlacementText(index)} place: {ranking.name} - {ranking.score} pts </div>
        {/if}
    {/each}
</div>
{/if}