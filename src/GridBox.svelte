<script lang="ts">
    export let size: string = "1em";

    export let color : string = "white";
</script>

<div style="--size: {size}; --color: {color}">

</div>

<style>
    div {
        width: var(--size);
        height: var(--size);
        border: 1px solid rgba(0, 0, 0, 0.178);
        background-color: var(--color);
    }
</style>