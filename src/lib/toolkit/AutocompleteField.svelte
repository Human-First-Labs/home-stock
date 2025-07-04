<script lang="ts">
	import Icon from '@iconify/svelte';
	import TargetDiv from './TargetDiv.svelte';
	import { fade } from 'svelte/transition';
	import { clickOutside } from './actions';
	import { convertMalteseFonts } from './utils';

	export interface AutocompleteOption {
		id: string;
		label: string;
	}

	export interface AutocompleteFieldProps {
		id?: string;
		/** The name of the input */
		name?: string;
		/** The placeholder of the input */
		placeholder: string;
		/** The value of the input */
		value?: AutocompleteOption | string;
		/** The options of the input */
		options: AutocompleteOption[];
		/** The function to call when an option is selected */
		onselect?: (value: AutocompleteOption) => void;
		/** The function to call when a new option is created */
		oncreatenew?: () => void;
	}

	let {
		id,
		name,
		value = $bindable(),
		placeholder,
		options,
		onselect,
		oncreatenew
	}: AutocompleteFieldProps = $props();

	let ref: HTMLElement | null = $state(null);

	let openDropdown = $state(false);
	let query = $state('');

	let visibleOptions = $derived.by(() => {
		if (!query) {
			return options;
		}

		const lowerQuery = query.toLowerCase();

		return options.filter((option) => {
			return (
				convertMalteseFonts(option.label).toLowerCase().includes(lowerQuery) ||
				convertMalteseFonts(option.id).toLowerCase().includes(lowerQuery)
			);
		});
	});

	const getValue = () => {
		if (typeof value === 'string') {
			return options.find((option) => option.id === value)?.label;
		}

		return value?.label;
	};

	const checkIfSelected = (option: AutocompleteOption) => {
		if (typeof value === 'string') {
			return value === option.id;
		}

		return value?.id === option.id;
	};
</script>

<div
	use:clickOutside={{
		callbackFunction: () => {
			openDropdown = false;
		}
	}}
	style="flex: 1"
>
	<input {id} {name} bind:value style="display: none" />
	<div class="row basic-input" bind:this={ref}>
		<input
			{placeholder}
			value={getValue() || ''}
			class="hidden-input"
			onfocus={() => {
				openDropdown = true;
			}}
			readonly
		/>
		{#if value}
			<div class="column">
				<button
					class="hidden-button"
					onclick={() => {
						value = undefined;
						onselect && onselect(undefined as any);
					}}
					style="flex: 1"
					type="button"
				>
					<Icon icon="material-symbols:close" font-size={18} />
				</button>
			</div>
		{/if}
	</div>
	{#if openDropdown && ref}
		<TargetDiv anchor={ref} matchParentWidth="exact" preferredPosition="bottom-start">
			<div class="card column" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
				<div class="row basic-input">
					<input class="hidden-input" bind:value={query} placeholder="Search" />
					{#if query}
						<div class="column">
							<button
								class="hidden-button"
								onclick={() => {
									query = '';
								}}
								style="flex: 1"
								type="button"
							>
								<Icon icon="material-symbols:close" font-size={18} />
							</button>
						</div>
					{/if}
				</div>
				{#if oncreatenew}
					<button
						class="hidden-button"
						onclick={() => {
							oncreatenew && oncreatenew();
							openDropdown = false;
						}}
						type="button"
						style="padding-top: 0.5em;"
					>
						<div class="row" style="gap: 10px; padding: 5px;">
							<Icon icon="material-symbols:add" font-size={18} />
							<p>Create New</p>
						</div>
					</button>
				{/if}
				<hr />
				<div class="column scrollable">
					{#if visibleOptions.length === 0}
						<p style="padding: 5px;">No results</p>
					{:else}
						{#each visibleOptions as option}
							<button
								class={['hidden-button', checkIfSelected(option) ? 'selected' : '', 'option']}
								onclick={() => {
									value = option.id;
									openDropdown = false;

									onselect && onselect(option);
								}}
								type="button"
							>
								<div class="row" style="gap: 10px; padding: 5px;">
									<p>{option.label}</p>
								</div>
							</button>
						{/each}
					{/if}
				</div>
			</div>
		</TargetDiv>
	{/if}
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		background-color: var(--background-color);
		box-shadow:
			0 4px 8px 0 rgba(0, 0, 0, 0.2),
			0 6px 20px 0 rgba(0, 0, 0, 0.19);
		border-radius: 16px;
		padding: 10px;
	}

	.scrollable {
		overflow: auto;
		max-height: 300px;
		gap: 10px;
	}

	input {
		flex: 1;
	}

	.option {
		border-radius: 8px;
	}

	.selected {
		background-color: var(--grey-background-color);
	}

	hr {
		width: 100%;
	}

	.basic-input {
		width: 100%;
	}
</style>
