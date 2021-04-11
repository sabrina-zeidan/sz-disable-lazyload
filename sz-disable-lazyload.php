<?php
/**
 * Plugin Name: Disable Cover Block LazyLoading 
 * Description: Switch off LazyLoading for an image inside Cover Block in Gutenberg for better user experience.
 * Plugin URI:  
 * Version:     1.0
 * Author:      Sabrina Zeidan
 * Author URI:  https://sabrinazeidan.com
 * License:     GNU General Public License v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Requires PHP: 5.6
 *
 */
const SZ_DISABLE_LL_VERSION = '1.0';
add_action('enqueue_block_editor_assets', 'sz_gutenberg_block_scripts');
function sz_gutenberg_block_scripts(){
    $required_js_files = array('wp-blocks', 'wp-dom-ready', 'wp-edit-post');	
	wp_enqueue_script('sz-disable-lazyload', plugin_dir_url( __FILE__ ) . 'disable_ll_babel.js', $required_js_files, SZ_DISABLE_LL_VERSION); 
}

//Filter block output
add_filter( 'render_block', 'sz_assign_disable_ll_class', 10, 3);
function sz_assign_disable_ll_class( $block_content, $block ) { 
	if ( is_admin() ) { return $block_content; }	  
	if( "core/cover" !== $block['blockName']) { return $block_content; }
	//Fire only for Cover Block on Frontend
		if( !empty($block['attrs']['lazyloadDisabled']) && $block['attrs']['lazyloadDisabled'] === true ) {
			$document = new DOMDocument();
			libxml_use_internal_errors(true);
			$document->loadHTML($block_content);
			$imgs = $document->getElementsByTagName('img');
			foreach ($imgs as $img) {
				$classes = $img->getAttribute('class');
				$img->setAttribute('class', $classes . ' lazyload-disabled '); //add class to mark images
			}
			return $document->saveHTML();
		}
	return $block_content;
}

//Disable lazyloading for marked images
add_filter('wp_img_tag_add_loading_attr', 'sz_disable_ll', 10, 3);
function sz_disable_ll( $value, $image, $context ) {
        $disabled_class = 'lazyload-disabled';
		if ( false !== strpos( $image, $disabled_class) ) {			
			return false;
        }	
	return $value;
}