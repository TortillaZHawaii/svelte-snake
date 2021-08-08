<script lang="ts">
	import Grid from "./Grid.svelte";
import GridBox from "./GridBox.svelte";

</script>

<main>
	<h1>Svelte-snake</h1>
	<p>Use arrow keys to move. Enter to restart.</p>
	<Grid cellSize="1.5em" height={20} width={20} />

</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: none;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	/* @media (min-width: 640px) {
		main {
			max-width: none;
		}
	} */
</style>