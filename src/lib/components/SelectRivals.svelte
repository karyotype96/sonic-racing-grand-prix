<script lang="ts">
    let { contestants, setRivalsErrorMessage, selectRival, submitRivals } = $props();

    import _ from "lodash";
</script>

<div id='select-rivals'>
    <header class='leaderboard-header'>
        Select Rivals
    </header>

    <div class='select-rivals-container'>
        <table>
            <tbody>
                {#each contestants as contestant, index}
                    <tr class='select-rivals-row'>
                        <td>{contestant.name}'s Rival: </td>
                        <td>
                            <select name="rival-{index}" onchange={(e) => {selectRival(index, e.currentTarget.value)}}>
                                <option value="">- Select Rival -</option>
                                {#each _.filter(contestants, (optionContestant) => 
                                    optionContestant.name != contestant.name) 
                                    as opt
                                }
                                    <option value={opt.name}>{opt.name}</option>
                                {/each}
                            </select>
                        </td>
                    </tr>
                {/each}
                <tr>
                    <td colspan='2'>
                        <button class='contestant-button-green' onclick={() => {submitRivals()}}>Select Cup</button>
                    </td>
                </tr>
                <tr>
                    <td colspan='2' class='error-message'>
                        {setRivalsErrorMessage}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>