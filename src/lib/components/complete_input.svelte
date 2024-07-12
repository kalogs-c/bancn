<script lang="ts" generics="T extends object">
  export let values: T[];
  export let displayFunction: (v: T) => string;

  export let placeholder: string;
  export let label: string;

  let filteredValues: T[] = [];

  let inputValue = "";

  const filterValues = () => {
    const normalizeInput = inputValue.toLowerCase().normalize();

    filteredValues = values.filter((v) =>
      displayFunction(v).normalize().toLowerCase().match(normalizeInput),
    );
  };

  const onFocusOut = () => {
    filteredValues = [];
  };

  const onFocusIn = () => {
    filteredValues = filteredValues.length > 0 ? filteredValues : values;
  };

  const abreviateContent = (item: T) => {
    const formatted = displayFunction(item);

    return formatted.length > 40
      ? formatted.slice(0, 40).trim() + "..."
      : formatted;
  };
</script>

<section>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text"><strong>{label}</strong></span>
    </div>
    <input
      class="input input-bordered w-full max-w-xs"
      type="text"
      {placeholder}
      bind:value={inputValue}
      on:input={filterValues}
      on:focusout={onFocusOut}
      on:focusin={onFocusIn}
    />
  </label>

  {#if filteredValues.length > 0}
    <ul
      class="menu dropdown-content flex-row gap-2 rounded-box bg-base-300 w-full max-w-xs max-h-64 z-[10] m-2 absolute overflow-x-hidden"
    >
      {#each filteredValues as v}
        <li>
          <!-- svelte-ignore a11y-missing-attribute -->
          <a>{abreviateContent(v)}</a>
        </li>
      {/each}
    </ul>
  {/if}
</section>
