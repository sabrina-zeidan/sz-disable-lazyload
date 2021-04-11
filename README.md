# UI option to disable Lazyloading for Cover Block

*Why this is not a pull request:*

I wrapped this as a plugin now, as I feel that I lack the experience to make it a proper PR.
This feature may be expanded to support further Block types, images, and iframes, in the future. I feel like talking to other contributors would help to make it better. 
If that’s okay I’m eager to ask for feedback in Slack and get to the PR after — I believe this way it has more odds to become non-breaking change which adds functionality.
 
\
\
\
\
This feature adds an option to UI to disable lazyloading of an image inside Gutenberg Cover Block.  


## What problem does this address?
After 5.5 we have lazyloading for images [provided](https://make.wordpress.org/core/2020/07/14/lazy-loading-images-in-5-5/) out of the box using the native HTML `loading` attribute, which is applied to all images.
**Currently, the only way to disable lazy-loading for a specific image is programmatically** using `wp_img_tag_add_loading_attr` filter. 

**Why disable lazyloading at all? Isn’t it supposed to improve loading times**

While lazyloading images (and other assets)  brings tremendous improvement to loading times in general, there is a case when lazy-loading harms user experience: when images **above the fold** are lazyloaded too.

**Example when lazy-loading of an image harms loading times:**

Here is a typical page with a Cover Block on top (above the fold). To improve loading times we need to show above-the-fold content as soon as possible.

If we lazyload all images user will see a black rectangle first:

![image](https://user-images.githubusercontent.com/5646904/114310093-3eb8e580-9af2-11eb-9a51-675d347f4c86.png)

If we lazyload all images but! the first one, they will see it sooner:
![image](https://user-images.githubusercontent.com/5646904/114310218-be46b480-9af2-11eb-94c3-356fd3d6af95.png)

Links to compare live examples: 

[First image is lazyloaded (default behaviour)](https://utm.speedguard.pro/lazyload-enabled-for-all/)

[First image is not lazyloaded (disabled via this option)](https://utm.speedguard.pro/lazyload-disabled-for-cover/)


## What is your proposed solution?
Add an option to the Advanced section of Cover Block to disable Lazy-loading:
![image](https://user-images.githubusercontent.com/5646904/114306877-fc89a700-9ae5-11eb-8ad2-f5fd2eba1eaa.png)

### Behaviour

* If checked `loading="lazy"` attribute is removed and lazyloading is disabled for the image inside Cover Block
* The image is assigned "lazyload-disabled" class to have a mark why it is not lazyloaded
* This won't affect the way the image loads on other pages or on this very page but in a different place, it impacts the specified block only

### Why add another UI option instead of using a filter?
* *For developers:* it’s not handy to use filter every time to specify not only the image that needs to be excluded, but also specific conditions (to exclude it only if it is used on the specific page, but keep it lazyloaded elsewhere).
* *For not-developers:* this is especially important with upcoming Full Site Editing when not only developers but designers, marketers, and even my mom would have the opportunity to create a new website easily. 
*The fact that they don’t code doesn’t mean they don’t want their website to deliver as good user experience as possible.*

## Possible evaluation
`loading` attribute is a generic attribute and is actively expanded to support further elements in the future. (iframes are lazyloaded since [5.7](https://make.wordpress.org/core/2021/02/19/lazy-loading-iframes-in-5-7/) too). So this feature might be expanded to other block types too.

Possible cases when it might be necessary to disable lazy-loading for the elements and UI option for that would be handy:
* prevent lazyloading content above the fold: images (inside Image Block, Cover Block as per this feature or other blocks), iframes etc. 
* embeds that use iframes but have issues displaying (e.g. wordpress.org embed)
* iframes from advertising networks might have the same compatibility issues

