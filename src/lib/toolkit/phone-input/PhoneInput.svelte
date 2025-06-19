<script lang="ts">
	import Icon from '@iconify/svelte';
	import { countryListRaw, type ICountry } from './countryData';
	import TargetDiv from '../TargetDiv.svelte';
	import { slide } from 'svelte/transition';
	import { clickOutside } from '../actions';

	export interface PhoneValue {
		code: string;
		number: string;
	}

	export interface PhoneInputProps {
		/** The name of the input */
		name?: string;
		/** The placeholder of the input */
		placeholder?: string;
		/** The value of the input */
		value?: PhoneValue;
	}

	const defaultCode = '+356';

	let { name, value = $bindable(), placeholder }: PhoneInputProps = $props();

	let ref: HTMLElement | null = $state(null);

	let derivedCountry: ICountry = $derived.by(() => {
		const country = countryListRaw.find(
			(country) => country.dialCode === (value?.code || defaultCode)
		);

		if (country) {
			return country;
		} else {
			throw new Error(`Country with dial code ${value?.code} not found`);
		}
	});

	// let derivedNumber: string = $derived.by(() => {
	// 	try {
	// 		const dialCode = value ? parsePhoneNumberWithError(value)?.nationalNumber : '';

	// 		return dialCode;
	// 	} catch (e) {
	// 		throw new Error(`Error 2`);
	// 	}
	// });

	let openDropdown = $state(false);
	let query = $state('');

	let visibleCountries = $derived.by(() => {
		if (!query) {
			return countryListRaw;
		}

		const lowerQuery = query.toLowerCase();

		return countryListRaw.filter((country) => {
			return (
				country.name.toLowerCase().includes(lowerQuery) ||
				country.dialCode.toLowerCase().includes(lowerQuery)
			);
		});
	});
</script>

<input {name} bind:value style="display: none" />
<div class="row basic-input" bind:this={ref}>
	<div class="column">
		<button
			class="basic-button country-button"
			onclick={() => (openDropdown = !openDropdown)}
			type="button"
		>
			<img src={derivedCountry?.img} class="circlar" alt="country-{derivedCountry?.name}" />
			<Icon icon="material-symbols:keyboard-arrow-down" font-size={14} />
		</button>
	</div>
	<input
		value={value?.number}
		class="hidden-input"
		type="number"
		oninput={(e) => {
			value = {
				code: derivedCountry?.dialCode,
				number: (e.target as HTMLInputElement).value || ''
			};
		}}
		placeholder={placeholder || 'Phone Number'}
	/>
</div>
{#if openDropdown && ref}
	<TargetDiv anchor={ref} matchParentWidth="exact">
		<div
			class="card column"
			in:slide={{ axis: 'y', duration: 300 }}
			out:slide={{ axis: 'y', duration: 300 }}
			use:clickOutside={{
				callbackFunction: () => {
					openDropdown = false;
				}
			}}
		>
			<div class="row basic-input">
				<div class="column">
					<Icon icon="material-symbols:search" font-size={18} />
				</div>
				<input class="hidden-input" bind:value={query} placeholder="Search Countries" />
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
			<hr />
			<div class="column scrollable">
				{#each visibleCountries as country}
					<button
						class="hidden-button"
						onclick={() => {
							value = {
								number: value?.number || '',
								code: country.dialCode
							};
							openDropdown = false;
						}}
						type="button"
					>
						<div class="row" style="gap: 10px; padding: 5px;">
							<img src={country.img} class="circlar" alt="country-{country.name}" />
							<p>{country.name} - {country.dialCode}</p>
						</div>
					</button>
				{/each}
			</div>
		</div>
	</TargetDiv>
{/if}

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

	.circlar {
		width: 14px;
		height: 14px;
		border-radius: 50%;
	}

	.country-button {
		padding: 5.13px;
		border-radius: 4px;
		gap: 5px;
	}

	hr {
		width: 100%;
	}
</style>
