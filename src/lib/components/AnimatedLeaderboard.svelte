<script lang="ts">
    import { MaxStrikes } from "$lib/utils/prix";
    import { getPlacementText } from "$lib/utils/helpers";

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