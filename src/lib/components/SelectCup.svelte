<script lang="ts">
    import GrandPrix from "$lib/utils/prix";
    import _ from "lodash";

    let { prix, ChunkSize, selectCup } : { prix: GrandPrix, ChunkSize: number, selectCup: Function } = $props();
</script>

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