<script lang="ts">
	import { inView } from '$lib/toolkit/actions/onInView.svelte';
	import { onMount } from 'svelte';
	import { fly, slide } from 'svelte/transition';

	let expandedFeature = $state<string>('');

	interface Feature {
		name: string;
		extract: string;
		description: string;
		notes?: string[];
	}

	let ready1 = $state(false);
	let ready2 = $state(false);

	onMount(() => (ready1 = true));

	const currentFeatures: Feature[] = [
		{
			name: 'User Accounts',
			extract: 'Create an account to save your data',
			description:
				'With user accounts, you can save your data and access it from anywhere. This way, you can keep track of what you have at home, and what you need to buy, from anywhere.'
		},
		{
			name: 'Item Management',
			extract: 'Keep track of what you have at home',
			description:
				'With simple UI and easy to use features, you can keep track of what you have at home, and never forget what you have. Each item comes with the current quantity and the quantity at which you should buy more.'
		},
		{
			name: 'Receipt Scanning',
			extract: 'Scan your receipts to automatically add items to your inventory',
			description:
				'With the receipt scanning feature, you can scan your receipts and automatically add items to your inventory. This way, you can keep track of what you have bought and when you bought it, without needing to manually add each item.'
		},
		{
			name: 'Shopping List Generation',
			extract: 'Generate a shopping list based on what you need',
			description:
				'With the shopping list generation feature, you can generate a shopping list based on what you need. The app will automatically add items to your shopping list based on the quantity at which you should buy more and how much you have left.'
		},
		{
			name: 'Data Removal',
			extract: 'Remove data from the app',
			description:
				"We've made it easy to complete delete all your information from this app, in order to comply with data protection laws. You can delete all your data with a single click."
		}
		// {
		// 	name: 'Part of the Human First Labs (HFL) ecosystem',
		// 	extract: 'Built with and by Human First Labs (HFL)',
		// 	description:
		// 		'This app is part of the Human First Labs (HFL) ecosystem, and has been built with the Human First Labs (HFL) principles in mind. For more information, visit the Human First Labs (HFL) website from the footer.'
		// }
	];

	const upcomingFeatures: Feature[] = [
		{
			name: 'Data Export',
			extract: 'Export your data to a file',
			description:
				'With the data export feature, you can export your data to a file, in order to keep a backup of your data, or to use it in other applications.'
		},
		{
			name: 'Data Import',
			extract: 'Import your data from a file',
			description:
				'With the data import feature, you can import your data from a file, in order to migrate from another app, or to keep a backup of your data.'
		},
		{
			name: 'Household Feature',
			extract: 'Manage your household inventory',
			description:
				'With the household feature, you can manage your household inventory, and keep track of what each member of your household has at home, and what you need to buy.'
		},
		{
			name: 'Data Sharing',
			extract: 'Share your data with others',
			description:
				'With the data sharing feature, you can share your data with others, in order to collaborate on your inventory, or to share your shopping list with others.'
		},
		{
			name: 'Fully Offline Mode',
			extract: 'Use the app without an internet connection',
			description:
				'Switching to Fully Offline will download all your data to your device, and you will be able to use the app without an internet connection, and without any data being sent to the server*. This mode is ideal for users who are concerned about their privacy.',
			notes: [
				'*Some features may require an internet connection, and will ask for your permission to send data to the server in this mode.'
			]
		}
	];
</script>

<div class="section primary">
	{#if ready1}
		<div class="section-content" in:fly={{ x: -100, duration: 500 }}>
			<h1 class="contrast-text">HomeStock</h1>
			<div class="row gapping">
				<div class="column half-1">
					<div>
						<p class="big-text contrast-text">Waste Less</p>
						<p class="big-text contrast-text">Have More</p>
					</div>
					<h3 class="contrast-text">
						Know what you have at home, and always buy just what you need
					</h3>
					<a class="basic-a" href="/app">
						<button class="basic-button bigger-button"> Get started </button>
					</a>
				</div>
				<div class="column half-2">
					<!-- <img src="/placeholder-image.jpg" alt="Shopping App" /> -->
				</div>
			</div>
		</div>
	{/if}
</div>
<div class="section">
	<div class="section-content-2">
		<div
			class="content-2-marker"
			use:inView={{
				callbackFunction: () => {
					ready2 = true;
				},
				revertFunction: () => {
					ready2 = false;
				}
			}}
		></div>
		{#if ready2}
			<div
				class="row gapping"
				in:fly={{ y: -100, duration: 500 }}
				out:fly={{ y: -100, duration: 500 }}
				style="align-items: flex-start;"
			>
				<div class="column half">
					<h2>Features</h2>
					<div>
						{#each currentFeatures as point}
							<div class="column feature-row">
								<div class="row feature-row">
									<div class="feature-name">
										<h4>{point.name}</h4>
										<h5>{point.extract}</h5>
									</div>

									<button
										class="hidden-button"
										onclick={() =>
											(expandedFeature = expandedFeature === point.name ? '' : point.name)}
									>
										{expandedFeature === point.name ? 'Show Less' : 'Show More'}
									</button>
								</div>

								{#if expandedFeature === point.name}
									<div class="column" in:slide={{ duration: 500 }} out:slide={{ duration: 500 }}>
										<p>{point.description}</p>
										{#if point.notes}
											{#each point.notes as note}
												<small>{note}</small>
											{/each}
										{/if}
									</div>
								{/if}
								<hr class="basic-hr" />
							</div>
						{/each}
					</div>
				</div>

				<div class="column half">
					<h2>Upcoming Features</h2>
					<div>
						{#each upcomingFeatures as point}
							<div class="column feature-row">
								<div class="row feature-row">
									<div class="feature-name">
										<h4>{point.name}</h4>
										<h5>{point.extract}</h5>
									</div>

									<button
										class="hidden-button"
										onclick={() =>
											(expandedFeature = expandedFeature === point.name ? '' : point.name)}
									>
										{expandedFeature === point.name ? 'Show Less' : 'Show More'}
									</button>
								</div>

								{#if expandedFeature === point.name}
									<div class="column" in:slide={{ duration: 500 }} out:slide={{ duration: 500 }}>
										<p>{point.description}</p>
										{#if point.notes}
											{#each point.notes as note}
												<small>{note}</small>
											{/each}
										{/if}
									</div>
								{/if}
								<hr class="basic-hr" />
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.gapping {
		gap: 50px;
	}

	.feature-row {
		width: 100%;
	}

	.half-1 {
		flex: 1;
		justify-content: space-between;
		min-width: 300px;
		gap: 10px;
	}
	.half-2 {
		flex: 1;

		height: 400px;
		min-width: 300px;
	}
	.primary {
		background-color: var(--primary-color);
	}

	.contrast-text {
		color: var(--primary-contrast-color);
	}
	.section {
		justify-content: center;
		width: 100%;
		display: flex;
		padding: 50px 0;
		position: relative;
	}
	.section-content {
		width: 80%;
	}
	.section-content-2 {
		width: 100%;
		padding: 0 10%;
		min-height: 400px;
	}

	.big-text {
		font-size: 3em;
		font-weight: bold;
	}

	.bigger-button {
		font-size: 1.5em;
		padding: 10px 20px;
	}

	.feature-name {
		flex: 1;
	}

	.half {
		flex: 1;
		min-width: 300px;
		gap: 20px;
	}

	.feature-row {
		align-items: center;
	}

	.content-2-marker {
		position: absolute;
		top: 300px;
		width: 10px;
		height: 10px;
	}

	@media screen and (min-width: 1190px) {
		.big-text {
			font-size: 5em;
		}
	}
</style>
