<template>
	<div>
		<template v-if="$slots.activator">
			<div @click="openModal">
				<slot name="activator" />
			</div>
		</template>
		<button v-else @click="openModal" class="button is-block is-success is-light is-fullwidth">
			Update Info
		</button>
		<div :class="['modal', { 'is-active': isOpen }]">
			<div class="modal-background"></div>
			<div class="modal-card">
				<header class="modal-card-head">
					<p class="modal-card-title">{{ headerText }}</p>
					<button @click="closeModal" class="delete" aria-label="close"></button>
				</header>
				<section class="modal-card-body">
				<slot/>
				</section>
				<footer class="modal-card-foot">
					<template v-if="$slots.footerButtons">
						<slot name="footerButtons" />
					</template>
					<button v-else :disabled="isDisabled" @click="submitModal" type="button" class="button is-success">
						Save changes
					</button>
					<button @click="closeModal" class="button">Cancel</button>
				</footer>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		headerText: {
			type: String,
			default: "Confirmation Window"
		},
		onModalSubmit: {
			type: Function,
			required: false
		},

		isDisabled: {
			type: Boolean,
			default: false
		}
	},

    data() {
        return {
            isOpen: false,
        }
    },

	methods: {
		submitModal() {
			this.onModalSubmit({
				onSuccess: () => this.closeModal(),
			})
		},

		openModal() {
			this.isOpen = true
		},

		closeModal() {
			this.isOpen = false
		}
	}
}
</script>