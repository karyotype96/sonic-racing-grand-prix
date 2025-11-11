<script lang="ts">
    let { prix, positions, getPlacementText, moveSortableUp, moveSortableDown, advanceRace } = $props();
</script>

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
                            <td class='rank-rival'>Rival: {ranking.rival}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>