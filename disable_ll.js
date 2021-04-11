/**
 * WordPress Dependencies 
 */
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { Fragment }	= wp.element;
const { InspectorAdvancedControls }	=  wp.blockEditor;
const { createHigherOrderComponent } = wp.compose;
const { ToggleControl } = wp.components;

//restrict to specific block names, later this can be adjusted to disable lazyload for iframes, videos, images
const allowedBlocks = [ 'core/cover' ]; 

/**
 * Add custom attribute for disabling Lazyload.
 *
 * @param {Object} settings Settings for the block.
 *
 * @return {Object} settings Modified settings.
 */
function addAttributes( settings ) {
	//check if object exists for old Gutenberg version compatibility
	if( typeof settings.attributes !== 'undefined' && allowedBlocks.includes( settings.name ) ){	
		settings.attributes = Object.assign( settings.attributes, {
			lazyloadDisabled:{ 
				type: 'boolean',
				default: false
			}
		});    
	}
	return settings;
}

/**
 * Add the control on Advanced Block Panel.
 *
 * @param {function} BlockEdit Block edit component.
 *
 * @return {function} BlockEdit Modified block edit component.
 */
const withAdvancedControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const {
			name,
			attributes,
			setAttributes,
			isSelected,
		} = props;
		const {
			lazyloadDisabled,
		} = attributes;				
		return (
			<Fragment>
				<BlockEdit {...props} />
				{ isSelected && allowedBlocks.includes( name ) &&
					<InspectorAdvancedControls>
						<ToggleControl
							label={ __( 'Disable Lazy-loading' ) }
							checked={ !! lazyloadDisabled } //Unset by default, meaning no changes to lazyloading are applied
							onChange={ () => setAttributes( {  lazyloadDisabled: ! lazyloadDisabled } ) }
							help={ !! lazyloadDisabled ? __( 'Native Lazy-loading disabled for this element' ) : __( 'Native Lazy-loading enabled for this element by default' ) }
						/>
					</InspectorAdvancedControls>
				}
			</Fragment>
		);
	};
}, 'withAdvancedControls');

addFilter('blocks.registerBlockType', 'sz/disableLazyLoad/customAttribute', addAttributes);
addFilter('editor.BlockEdit', 'sz/disableLazyLoad/customAttributeControls', withAdvancedControls);