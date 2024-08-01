<script lang="ts" generics="T">
  import type { Writable } from "svelte/store";

  export let values: T[];
  export let displayFunction: (v: T) => string;
  export let selectedFieldFunction: (v: T) => string;
  export let selectedStore: Writable<string[]>;

  export let width: string = "w-full";

  export let placeholder: string;
  export let label: string;

  let filteredValues: T[] = [];

  let inputValue = "";

  let openSelectedDropdown = false;

  let selected: string[] = [];
  selectedStore.subscribe((s) => (selected = s));

  const filterValues = () => {
    const normalizeInput = inputValue.toLowerCase().normalize();

    filteredValues = values.filter((v) =>
      displayFunction(v).normalize().toLowerCase().match(normalizeInput),
    );
  };

  const onFocusOut = () => {
    setTimeout(() => {
      filteredValues = [];
    }, 150);
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

  const onSelect = (item: T) => {
    const selectedField = selectedFieldFunction(item);

    selected = !selected.includes(selectedField)
      ? [...selected, selectedField]
      : selected;
  };

  const removeItem = (item: string) => {
    selected = selected.filter((i) => i != item);
  };

  $: selectedStore.set(selected);
</script>

<section>
  {#if openSelectedDropdown}
    <div class="relative z-[5]">
      <div
        class="menu dropdown-content flex-row gap-2 rounded-box flex-wrap max-w-52 bg-base-300 mb-5 absolute right-0 top-0"
      >
        {#each selected as s}
          <button
            class="badge hover:badge-error"
            on:click={() => removeItem(s)}
          >
            {s}
          </button>
        {/each}
      </div>
    </div>
  {/if}
  <label class={`form-control ${width} max-w-xs`}>
    <div class="label">
      <span class="label-text"><strong>{label}</strong></span>
    </div>

    <div class="indicator">
      {#if selected.length > 0}
        <button
          class={`indicator-item badge ${openSelectedDropdown ? "badge-error" : "badge-secondary"} transition-all`}
          on:click={() => (openSelectedDropdown = !openSelectedDropdown)}
          on:focusout={() => {
            setTimeout(() => (openSelectedDropdown = false), 150);
          }}
        >
          {selected.length}
        </button>
      {/if}

      <input
        class={`input input-bordered ${width} max-w-xs`}
        type="text"
        {placeholder}
        bind:value={inputValue}
        on:input={filterValues}
        on:focusin={onFocusIn}
        on:focusout={onFocusOut}
        disabled={values.length == 0}
      />
    </div>
  </label>

  {#if filteredValues.length > 0}
    <ul
      class="menu dropdown-content flex-row gap-2 rounded-box bg-base-300 w-full max-w-xs max-h-64 z-[10] m-2 absolute overflow-x-hidden"
    >
      {#each filteredValues as v}
        <li>
          <button on:click={() => onSelect(v)}>{abreviateContent(v)}</button>
        </li>
      {/each}
    </ul>
  {/if}
</section>
