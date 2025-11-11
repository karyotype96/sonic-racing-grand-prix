<script lang="ts">
    import { MaxStrikes } from "$lib/utils/prix";
    import { getPlacementText } from "$lib/utils/helpers";
    import type IContestant from "$lib/utils/contestant";

    let { prix, resultsNextPage } = $props();
</script>

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
                            {#if ranking.justStruckOut }
                                <td class='rank-score'>{ranking.score+1} <span class='red-text'>- 1</span> pts</td>
                            {:else}
                                <td class='rank-score'>{ranking.score} pts</td>
                            {/if}
                            <td class='rank-rival'>Rival: {ranking.rival}</td>
                            {#if ranking.justStruckOut}
                                <td class='rank-strikes'>3 strikes</td>
                            {:else}
                                <td class='rank-strikes'>{ranking.strikeCount % MaxStrikes} strike{ranking.strikeCount % MaxStrikes != 1 ? 's' : ''}</td>
                            {/if}
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