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
 * Internal dependencies
 */
// import Edit from './edit';
// import save from './save';
// import metadata from './block.json';

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
		thumbnailSize: {
			type: 'string',
			default: 'medium',
		},
		displayPostExcerpt: {
			type: 'boolean',
			default: false,
		},
		postCategory: {
			type: 'number',
			default: 0,
		},
	},
	edit: ({ attributes, setAttributes }) => {
		const { numberOfPosts, displayPostThumbnail, thumbnailSize, displayPostExcerpt, postCategory } = attributes;

		const categories = useSelect((select) =>
			select('core').getEntityRecords('taxonomy', 'category', { per_page: -1 })
			, []);

		const selectedCategory = categories?.find(category => category.id === postCategory);

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
							label="Thumbnail size"
							value={thumbnailSize}
							options={[
								{ label: 'Thumbnail', value: 'thumbnail' },
								{ label: 'Medium', value: 'medium' },
								{ label: 'Large', value: 'large' },
							]}
							onChange={(value) => setAttributes({ thumbnailSize: value })}
						/>
						<ToggleControl
							label="Display post excerpt"
							checked={displayPostExcerpt}
							onChange={(value) => setAttributes({ displayPostExcerpt: value })}
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
					<p>Displaying {numberOfPosts} {numberOfPosts === 1 ? 'post' : 'posts'} from {selectedCategory ? selectedCategory.name : 'All Categories'} {displayPostThumbnail ? 'with' : 'without'} thumbnails.</p>
				</div>
			</>
		);
	},
	save: () => null,
});
