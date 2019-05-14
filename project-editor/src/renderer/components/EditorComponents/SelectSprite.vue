<template>
	<div class="sprite_select">
		<div class="sprite_sheet_list">
			<div
				v-for="(spriteSheet, spriteSheetIndex) in projectSpriteSheets.data"
				:key="`${spriteSheet.file}/${spriteSheetIndex}`"
				class="sprite_sheet"
				:id="spriteSheet.file"
			>
				<h2 class="sprite_sheet_path">{{ spriteSheet.file }}</h2> 
				<div class="sprite_list">
					<div 
						v-for="(sprite, spriteIndex) in spriteFilteredList(spriteSheetIndex)"
						:key="`${spriteSheet.file}/${spriteSheetIndex}/${spriteIndex}`"
						class="sprite"
						:id="sprite.name"
						:class="{ selected: isSpriteSelected(sprite) }"
						@click="selectSprite(sprite)"
					>
						<div class="sprite_preview_container">
							<div
								class="sprite_preview"
								:style="spriteStyles(spriteSheet.file, sprite.rect || sprite.frames[0].rect)"
							></div>
						</div>
						<p class="sprite_name">{{ sprite.name }}</p>
						<div 
							class="selected_sprite_background" 
							v-if="isSpriteSelected(sprite)"
						></div>
					</div>
				</div>
			</div>
		</div>
		<div class="sprite_search_settings">
			<h2>Search sprite:</h2>

			<CustomInput
				type="text"
				id="spriteName"
				label="Sprite name:"
				v-model="spriteSearch" />
		</div>
	</div>
</template>
<script>
	import CustomInputs from '../CustomInputs';

	import '../../store/index.js';
	import { mapGetters } from 'vuex';

	export default {
		data() {
			return {
				spriteSearch: '',
				selectedSpriteSheetIndex: 0,
				selectedSpriteIndex: 0,
				spriteList: [],
				spriteSheetPathsList: []
			}
		},
		computed: mapGetters(['projectAppPath', 'projectSpriteSheets']),
		components: { CustomInput: CustomInputs },
		methods: {
			spriteStyles(file, spriteCoordinations) {
				return {
					backgroundImage: `url("file://${this.projectAppPath.replace(/\\/g, '/')}/${file}")`,
					backgroundPosition: `-${spriteCoordinations[0]}px -${spriteCoordinations[1]}px`,
					width: `${spriteCoordinations[2]}px`,
					height: `${spriteCoordinations[3]}px`
				}
			},

			spriteFilteredList(spriteSheetIndex) {
				return this.spriteList.filter(sprite => {	
					return sprite.spriteSheetIndex === spriteSheetIndex && sprite.name.toLowerCase().includes(this.spriteSearch.toLowerCase());
				});
			},

			selectSprite(sprite) {
				const {spriteSheetIndex, spriteIndex} = sprite;
				this.selectedSpriteSheetIndex = spriteSheetIndex;
				this.selectedSpriteIndex = spriteIndex;

				this.$emit('select', {
					spriteSheetIndex: this.selectedSpriteSheetIndex, 
					spriteIndex: this.selectedSpriteIndex
				});
			},

			isSpriteSelected(sprite) {
				const {spriteSheetIndex, spriteIndex} = sprite;

				return this.selectedSpriteSheetIndex === spriteSheetIndex 
					&& this.selectedSpriteIndex === spriteIndex;
			}
		},

		mounted() {
			console.log(this.projectSpriteSheets)
			this.projectSpriteSheets.data.forEach((spriteSheet, spriteSheetNum) => {
				const {file, sprites} = spriteSheet;

				sprites.forEach((sprite, spriteNum) => {
					let settings = {
						...sprite,
						spriteSheetIndex: spriteSheetNum,
						spriteIndex: spriteNum
					}

					this.spriteList.push(settings);
				});
			});
		}
	}
</script>

<style>
	.sprite_select {
		width: 93.43%;
		position: relative;
	}

	.sprite_sheet_list {
		background-color: #222;
		border: 1px solid #555;
		border-bottom: 0;
		border-radius: 5px 5px 0 0;
		overflow-y: auto;
		padding: 8px 10px;
		max-height: 500px;
	}

	.sprite_search_settings {
		background-color: #333;
		border: 1px solid #555;
		border-top: 0;
		border-radius: 0 0 5px 5px;
		position: absolute;
		left: 0;
		right: 0;
		padding: 10px 15px 15px 15px;
		margin-bottom: 14px;
	}

	h2.sprite_sheet_path,
	.sprite > .sprite_name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	h2.sprite_sheet_path {
		margin-bottom: 10px;
	}

	.sprite_sheet:not(:first-child) > h2.sprite_sheet_path {
		margin-top: 15px;
	}

	.sprite_list {
		display: grid; 
		grid-template-columns: repeat(auto-fill, 256px); 
		grid-auto-rows: 256px;
		grid-gap: 5px;
	}

	.sprite_list > .sprite {
		width: 100%; 
		height: 100%; 
		display: grid; 
		grid-template-rows: 90% 10%;
		cursor: pointer;
		user-select: none;
		position: relative;
		z-index: 1;
	}

	.sprite > .sprite_preview_container {
		overflow: auto;
		background-color: #000;
	}

	.sprite > .sprite_name {
		color: #fff;
		background: blue;
		padding: 4px 8px;
	}

	.selected_sprite_background {
		position: absolute;
		left: -2px;
		top: -2px;
		width: calc(100% + 2px * 2);
		height: calc(100% + 2px * 2);
		background-color: #444;
		z-index: -1;
	}
	
	.sprite.selected > .sprite_name {
		background-color: red;
	}

	.sprite_preview_container > .sprite_preview {
		margin: 0 auto;
	}
</style>
