/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType('create-block/aw-blog-posts-block', {
	title: 'AW Blog Posts',
	icon: 'admin-post',
	category: 'widgets',
	attributes: {
		numberOfPosts: {
			type: 'number',
			default: 5,
		},
		displayPostThumbnail: {
			type: 'boolean',
			default: true,
		},
		postCategory: {
			type: 'number',
			default: 0,
		},
	},
	edit: ({ attributes, setAttributes }) => {
		const { numberOfPosts, displayPostThumbnail, postCategory } = attributes;

		const categories = useSelect((select) =>
			select('core').getEntityRecords('taxonomy', 'category', { per_page: -1 })
			, []);

		return (
			<>
				<InspectorControls>
					<PanelBody title="Settings" initialOpen={true}>
						<RangeControl
							label="Number of posts"
							value={numberOfPosts}
							onChange={(value) => setAttributes({ numberOfPosts: value })}
							min={1}
							max={10}
						/>
						<ToggleControl
							label="Display post thumbnail"
							checked={displayPostThumbnail}
							onChange={(value) => setAttributes({ displayPostThumbnail: value })}
						/>
						<SelectControl
							label="Post Category"
							value={postCategory}
							options={[{ label: 'All Categories', value: '' }].concat(
								categories?.map((category) => ({
									label: category.name,
									value: category.id,
								})) || []
							)}
							onChange={(value) => setAttributes({ postCategory: parseInt(value, 10) })}
						/>
					</PanelBody>
				</InspectorControls>
				<div {...useBlockProps()}>
					<p>Displaying {numberOfPosts} posts {displayPostThumbnail ? 'with' : 'without'} thumbnails.</p>
				</div>
			</>
		);
	},
	save: () => null,
});
