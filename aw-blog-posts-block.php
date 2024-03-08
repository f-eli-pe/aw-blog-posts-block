<?php

/**
 * Plugin Name:       Aw Blog Posts Block
 * Description:       AW Blog posts block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors & Felipe
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       aw-blog-posts-block
 *
 * @package           create-block
 */

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */

function aw_blog_posts_block_block_init()
{
	register_block_type(__DIR__ . '/build', array(
		'render_callback' => 'aw_blog_posts_block_render',
	));
}

add_action('init', 'aw_blog_posts_block_block_init');

function aw_blog_posts_block_render($attributes)
{
	$args = array(
		'posts_per_page' => $attributes['numberOfPosts'],
		'post_status'    => 'publish',
	);

	if (!empty($attributes['postCategory'])) {
		$args['cat'] = $attributes['postCategory'];
	}

	$displayPostThumbnail = $attributes['displayPostThumbnail'] ?? true;

	$query = new WP_Query($args);
	$posts = '';

	if ($query->have_posts()) {
		while ($query->have_posts()) {
			$query->the_post();
			$thumbnail = '';

			if ($displayPostThumbnail) {
				if (has_post_thumbnail()) {
					$thumbnail = get_the_post_thumbnail(null, $attributes['thumbnailSize'], array('style' => 'float: left; margin-right: 20px;'));
				} else {
					$thumbnail = '<div style="width: 150px; height: 150px; background-color: gray; float: left; margin-right: 20px;"></div>';
				}
			}

			$title = sprintf('<h4><a href="%s">%s</a></h4>', get_permalink(), get_the_title());
			$excerpt = $attributes['displayPostExcerpt'] ? '<p>' . get_the_excerpt() . '</p>' : '';

			$posts .= sprintf(
				'<div style="overflow: hidden; margin-bottom: 20px;">%s<div class="post-content">%s%s</div></div>',

				$thumbnail,
				$title,
				$excerpt
			);
		}
		wp_reset_postdata();
	}

	return sprintf('<div class="aw-blog-posts-block">%s</div>', $posts);
}