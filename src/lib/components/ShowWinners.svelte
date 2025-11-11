<script lang="ts">
    let {prix} = $props();

    import { getPlacementText } from "$lib/utils/helpers";
</script>

<div class='show-winners'>
    <div class='winner-text'>Winner!</div>
    <div class='winner-name'>1st place: {prix.getCurrentRankings()[0].name} - {prix.getCurrentRankings()[0].score} pts</div>
    {#each prix.getCurrentRankings() as ranking, index}
        {#if index > 0}
            <div class='runner-up'>{getPlacementText(index)} place: {ranking.name} - {ranking.score} pts </div>
        {/if}
    {/each}
</div>