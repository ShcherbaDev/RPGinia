<template>
    <div class="editor">
        <Block className="layers" title="Layers" titleAddButton titleDeleteButton>
            <div class="layer_list">
                <LayerItem :number="1"></LayerItem>
                <LayerItem :number="2"></LayerItem>
            </div>
        </Block>
        
        <div class="block properties">
            <PropertiesBlock className="objects" title="Object list" titleAddButton titleDeleteButton>
                <p class="error_text">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed unde nihil explicabo consequatur, placeat atque vel? Suscipit distinctio quasi voluptas! Natus itaque cupiditate eaque exercitationem quae quis optio, tempore dignissimos, praesentium cumque consequatur possimus beatae aperiam omnis quia facere ut corrupti, dolore fuga in odit harum vero voluptates a. Similique itaque voluptatum enim consequatur excepturi dolorum nesciunt id ipsam architecto maiores vitae autem, cupiditate facere ea veniam. Modi ab provident blanditiis consequuntur hic animi, doloribus quae at ipsam, dolores voluptatibus? Facilis officiis, voluptatibus quas, numquam eaque aliquid cum voluptas aperiam unde iusto dolorum quasi. Iste, veritatis eaque. Perspiciatis reiciendis quis laborum natus doloribus distinctio suscipit provident labore dolor, aliquid commodi corporis similique cumque earum quae. Cumque nemo repellat quo esse, libero iure quae maxime est nobis dolorem illo itaque hic quaerat! Error quos tenetur sequi, eum corporis eveniet placeat sint optio libero quae illo mollitia nam ipsum cumque asperiores tempore fuga molestiae eos possimus. Libero sint vitae incidunt inventore adipisci deserunt ipsa, nobis, error doloribus natus voluptatibus deleniti dolorum repellendus? Voluptate, voluptatibus vitae cumque vel aliquam ab repudiandae libero incidunt quaerat tenetur debitis sapiente eveniet sint totam, laudantium maxime minima corporis iure. Nulla, aspernatur odio? Libero a perferendis ad. Numquam!
                </p>
            </PropertiesBlock>
            <PropertiesBlock className="object" title="Object properties">
                <p class="error_text">Object not selected.</p>
            </PropertiesBlock>
        </div>

        <Block className="playground" title="Playground">
            <div class="canvas_container">
                <canvas id="playground"></canvas>
            </div>
        </Block>
    </div>
</template>
<script>
import Block from './EditorBlocks/Block';
import PropertiesBlock from './EditorBlocks/PropertiesBlock';
import LayerItem from './EditorBlocks/LayerItem';

export default {
    name: 'editor',
    components: {
        Block, PropertiesBlock, LayerItem
    }
}
</script>
<style src="../assets/css/main.css"></style>
<style src="../assets/css/fonts.css"></style>
<style src="../assets/css/themes/dark.css"></style>
<style src="../assets/css/scrollbar.css"></style>
