<script lang="ts">
    let { contestants, addNewContestant, removeContestant, beginPrix, errorMessage } = $props();
</script>

<div id='add_positions'>
    <header class='add-positions-header'>
        Who will be your contestants?
    </header>

    <table class='add-positions-table'>
        <tbody>
            {#each contestants as contestant, index}
                <tr>
                    <td id="contestant-row-{index}" class='add-positions-contestant'>
                        <p id='positions-label-{index}' class='add-positions-label'>Contestant #{index+1}: </p>
                        <input id='positions-input-{index}' class='add-positions-contestant-name' placeholder="Enter contestant name..." bind:value={contestant.name}>
                    </td>
                    <td id="button-row-{index}">
                        <button id='positions-remove-{index}' class='remove-contestant' onclick={() => {removeContestant(index)}}>Remove</button>
                    </td>
                </tr>
            {/each}
            {#if contestants.length < 12}
            <tr>
                <td colspan='2' class='contestant-button-td'>
                    <button class='contestant-button' onclick={addNewContestant}>+ Add Contestant</button>
                </td>
            </tr>
            {/if}
            <tr>
                <td colspan='2'>
                    <button class='contestant-button-green' onclick={beginPrix}>Begin Grand Prix</button>
                </td>
                <td class='error-message'>{errorMessage}</td>
            </tr>
        </tbody>
    </table>
</div>