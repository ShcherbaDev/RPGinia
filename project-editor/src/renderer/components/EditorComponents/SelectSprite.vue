<template>
	<div class="sprite_select">
		<div class="sprite_sheet_list">
			<div
				v-for="spriteSheet in spriteSheets"
				:key="spriteSheet.file"
				class="sprite_sheet"
				:id="spriteSheet.file">
				
				<h2 class="sprite_sheet_path">{{ spriteSheet.file }}</h2>
				<div class="sprite_list">
					<div 
						v-for="sprite in spriteFilteredList(spriteSheet.sprites)"
						:key="sprite.name"
						class="sprite"
						:class="sprite.name || spriteSheet.file">

						<div class="sprite_preview_container">
							<div 
								class="sprite_preview"
								:style="spriteStyles(spriteSheet.file, sprite.rect || sprite.frames[0].rect)"></div> 
						</div>

						<p class="sprite_name">{{ sprite.name }}</p>
					
					</div>
				</div>

			</div>
		</div>
		<div class="sprite_search_settings">
			<h2>Search:</h2>
			<input type="text" v-model="spriteSearch">
		</div>
	</div>
</template>
<script>
	import '../../store/index.js';
	import { mapGetters } from 'vuex';

	export default {
		data() {
			return {
				spriteSearch: ''
			}
		},
		computed: mapGetters(['projectAppPath']),
		props: {
			spriteSheets: Array
		},
		methods: {
			spriteStyles(file, spriteCoordinations) {
				return {
					display: 'inline-block',
					backgroundImage: `url("file://${this.projectAppPath.replace(/\\/g, '/')}/${file}")`,
					backgroundPosition: `-${spriteCoordinations[0]}px -${spriteCoordinations[1]}px`,
					width: `${spriteCoordinations[2]}px`,
					height: `${spriteCoordinations[3]}px`
				}
			},

			spriteFilteredList(spritesInSpriteSheet) {
				return spritesInSpriteSheet.filter(sprite => {
			    	return sprite.name.toLowerCase().includes(this.spriteSearch.toLowerCase())
				});
			}
		}
	}
</script>

<style>
	.sprite_select {
		padding: 5px 10px;
		background-color: #222;
		border: 1px solid #555;
		border-radius: 5px;
		overflow: auto;
	}

	h2.sprite_sheet_path,
	.sprite > p.sprite_name {
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
	}

	.sprite > .sprite_preview_container {
		overflow: auto;
		background-color: #000;
	}

	.sprite > p.sprite_name {
		color: #fff;
		background: blue;
		padding: 4px 8px;
		border-radius: 0 0 2px 2px;
	}

	.sprite_preview_container > .sprite_preview {
		margin: 0 auto;
	}
</style>
