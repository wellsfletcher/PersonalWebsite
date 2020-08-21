/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			// $body.on('click', function(event) { // or here...
			$('#wrapper').on('click', function(event) {
			// $body.children('#wrapper').children('#main').children('.modal').find('img').on('click', function(event) {

				// Article visible? Hide. // make sure this doesn't include the lightbox
					var $modal = $('.modal');
					var isModalLocked = $modal[0]._locked;
					var isModalVisible = $modal.hasClass('visible');
					// make it so you can only exit to the main menu if the article is visable and (the modal is not visible and is not locked)
					if ($body.hasClass('is-article-visible') && !isModalVisible && !isModalLocked)
					// if ($body.hasClass('is-article-visible') && !($modal.hasClass('visible')))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							var modalIsVisible = $('.modal').hasClass('visible');

							if (modalIsVisible) {
								$('body .modal').trigger('click');
							} else if ($body.hasClass('is-article-visible')) {
								$main._hide(true);
							}

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});














					/* XXX_GALLERY_XXX */




					function AddVideoAttributes ($frame) {
						$frame.attr ('frameborder', '0');
						$frame.attr ('allow', 'accelerometer; encrypted-media; gyroscope; picture-in-picture');
						$frame.attr ('allowfullscreen', '');
					}

					function getCappedElementWidth (targetWidth, targetHeight, maxWidth, maxHeight) {
						var imageWidth = targetWidth;
						var imageHeight = targetHeight;

						var ASPECT_RATIO = imageWidth / imageHeight;
						var MAKE_WIDTH_PROPORTIONAL_FACTOR = ASPECT_RATIO;
						var MAKE_HEIGHT_PROPORTIONAL_FACTOR = 1 / ASPECT_RATIO;

						var iframeWidth = imageWidth;
						var iframeHeight = imageHeight;

						iframeWidth = Math.min (imageWidth, maxWidth);
						iframeHeight = iframeWidth * MAKE_HEIGHT_PROPORTIONAL_FACTOR;
						iframeHeight = Math.min (iframeHeight, maxHeight);
						iframeWidth = iframeHeight * MAKE_WIDTH_PROPORTIONAL_FACTOR;

						return iframeWidth;
					}

					function getCappedElementHeight (targetWidth, targetHeight, maxWidth, maxHeight) {
						var imageWidth = targetWidth;
						var imageHeight = targetHeight;

						var ASPECT_RATIO = imageWidth / imageHeight;
						var MAKE_WIDTH_PROPORTIONAL_FACTOR = ASPECT_RATIO;
						var MAKE_HEIGHT_PROPORTIONAL_FACTOR = 1 / ASPECT_RATIO;

						var iframeWidth = imageWidth;
						var iframeHeight = imageHeight;

						iframeWidth = Math.min (imageWidth, maxWidth);
						iframeHeight = iframeWidth * MAKE_HEIGHT_PROPORTIONAL_FACTOR;
						iframeHeight = Math.min (iframeHeight, maxHeight);
						iframeWidth = iframeHeight * MAKE_WIDTH_PROPORTIONAL_FACTOR;

						return iframeHeight;
					}



					// Gallery.
						// find gallery class elements and do the following on them:
						$('.gallery')
							// wrap all the elements within the gallery element inside the the div class="inner" element
							.wrapInner('<div class="inner"></div>')
							// add the forward and backward arrows to the gallery element (~except not if on mobile)
							.prepend(browser.mobile ? '' : '<div class="forward"></div><div class="backward"></div>')
							// ~add listeners for setting gallery to active/inactive depending on if they are within view of the scroll
							.scrollex({
								top:		'30vh',
								bottom:		'30vh',
								delay:		50,
								initialize:	function() {
									$(this).addClass('is-inactive');
								},
								terminate:	function() {
									$(this).removeClass('is-inactive');
								},
								enter:		function() {
									$(this).removeClass('is-inactive');
								},
								leave:		function() {

									var $this = $(this);

									if ($this.hasClass('onscroll-bidirectional'))
										$this.addClass('is-inactive');

								}
							})
							.children('.inner')
								//.css('overflow', 'hidden')
								.css('overflow-y', browser.mobile ? 'visible' : 'hidden')
								.css('overflow-x', browser.mobile ? 'scroll' : 'hidden')
								.scrollLeft(0);

						// Style #1.
							// ...

						// Style #2.
							// find gallery class elements and do the following on them:
							$('.gallery')
								// ~add scrolling functionality
								.on('wheel', '.inner', function(event) {

									var	$this = $(this),
										delta = (event.originalEvent.deltaX * 10);

									// Cap delta.
										if (delta > 0)
											delta = Math.min(25, delta);
										else if (delta < 0)
											delta = Math.max(-25, delta);

									// Scroll.
										$this.scrollLeft( $this.scrollLeft() + delta );

								})
								.on('mouseenter', '.forward, .backward', function(event) {

									var $this = $(this),
										$inner = $this.siblings('.inner'),
										direction = ($this.hasClass('forward') ? 1 : -1);

									// Clear move interval.
										clearInterval(this._gallery_moveIntervalId);

									// Start interval.
										this._gallery_moveIntervalId = setInterval(function() {
											$inner.scrollLeft( $inner.scrollLeft() + (5 * direction) ); // 'speed' * direction
										}, 10);

								})
								.on('mouseleave', '.forward, .backward', function(event) {

									// Clear move interval.
										clearInterval(this._gallery_moveIntervalId);

								});

					// lightbox
						// find all elements of class gallery and lightbox and do the following on them:
						$('.lightbox a, a.lightbox')
							// if the "a" child element is clicked on, then perform the following function
							.on('click', function(event) { /* .on('click', 'a', function(event) { */
								var isImage = false;
								var isVideo = false;

								// set $a to the "a" element that was clicked on
								var $a = $(this),
									// set $gallery to the parent gallery element
									$gallery = $a.parents('.gallery'),
									// set $modal to the modal of the lightbox (the dark screen that contains the lightbox element and appears in front of everything),
									// which is located as the child of the element with the ID "wrapper", which is a child of the body element
									// $modal = $gallery.children('.modal'),
									$modal = $body.children('#wrapper').children('.modal'),
									// set %modalImg to the "img" element within the modal
									$modalImg = $modal.find('iframe'), // changed to iframe element
									// set href to the value of the "a" element's "href" attribute (which is a string)
									href = $a.attr('href');

								// Not an image? Bail.
									// check if href url ends with a valid extension
									if (href.match(/\.(jpg|gif|png|mp4)$/)) {
										isImage = true;
									}
									// check if the $a element has a video link
									if ($a.attr('data-type') === 'video') {
										isVideo = true;
									}

								// Prevent default.
									event.preventDefault();
									event.stopPropagation();

								// Locked? Bail.
									if ($modal[0]._locked)
										return;

								// Lock.
									$modal[0]._locked = true;

									// if it is a video add video attributes before setting the source
									if (isVideo) {
										AddVideoAttributes ($modalImg);
									}

								// Set src.
									// set the source path for the lightbox image element
									$modalImg.attr('src', href);

									if (isImage) {
										// get dimensions of iframe
										var tempImg = new Image ();
										tempImg.src = href;
										// tempImg.ready = function () {
										tempImg.onload = function () {

											var imageWidth = tempImg.width;
											var imageHeight = tempImg.height;
											var maxWidth = $window.width ();
											var maxHeight = $window.height ();

											/*
											var ASPECT_RATIO = imageWidth / imageHeight;
											var MAKE_WIDTH_PROPORTIONAL_FACTOR = ASPECT_RATIO;
											var MAKE_HEIGHT_PROPORTIONAL_FACTOR = 1 / ASPECT_RATIO;

											var iframeWidth = imageWidth;
											var iframeHeight = imageHeight;

											iframeWidth = Math.min (imageWidth, maxWidth);
											iframeHeight = iframeWidth * MAKE_HEIGHT_PROPORTIONAL_FACTOR;
											iframeHeight = Math.min (iframeHeight, maxHeight);
											iframeWidth = iframeHeight * MAKE_WIDTH_PROPORTIONAL_FACTOR;
											*/

											iframeWidth = getCappedElementWidth (imageWidth, imageHeight, maxWidth, maxHeight);
											iframeHeight = getCappedElementHeight (imageWidth, imageHeight, maxWidth, maxHeight);

											// console.log ("Image src = " + tempImg.src + ", width = " + tempImg.width);
											console.log ("Image width = " + maxWidth + ", height = " + maxHeight);

											// set the dimensions of the iframe
											// $modalImg.attr('width', imageWidth);
											// $modalImg.attr('height', imageHeight);
											$modalImg.attr('width', iframeWidth);
										  $modalImg.attr('height', iframeHeight);
											$modalImg.attr('scrolling', 'no');
											// $modalImg.css('transform', 'scale(.5)');

											// suh, this is a test comment
											console.log ("Size change yes.");
											/*
											do {
												$iframeImg = $modalImg.contents ().find ("img");
												console.log ($iframeImg);
											}  while (!$iframeImg.length); // keep on repeating until the img element exists
											*/
											/*
											$.when (function () {
												$iframeImg = $modalImg.contents ().find ("img");
												console.log ("oi");
												return $iframeImg.length > 0;
											}).then (function (x) {
												console.log ("mmmmm");
												$iframeImg = $modalImg.contents ().find ("img");
												console.log ($iframeImg);
											});
											*/

											setTimeout(function() {

												// console.log ($modalImg.height ());
												$iframeImg = $modalImg.contents ().find ("img");
												$iframeImg.attr ("style", "width: 100%;");
												// console.log ($iframeImg);

											}, 1000);

											$iframeImg = $modalImg.contents ().find ("img");
											// console.log ($iframeImg);
											// $iframeImg.attr ("style", "width: 30px; height: 30px");
											$iframeImg.attr ("style", "width: 100%;");
										};
									} else {
										var targetWidth = $a.attr('data-frame-width');
										var targetHeight = $a.attr('data-frame-height');
										var maxWidth = $window.width ();
										var maxHeight = $window.height ();

										iframeWidth = getCappedElementWidth (targetWidth, targetHeight, maxWidth, maxHeight);
										iframeHeight = getCappedElementHeight (targetWidth, targetHeight, maxWidth, maxHeight);

										// var iframeWidth = $a.attr('data-frame-width');
										// var iframeHeight = $a.attr('data-frame-height');

										// $modalImg.attr('width', '500px');
										// $modalImg.attr('height', '400px');
										$modalImg.attr('width', iframeWidth);
										$modalImg.attr('height', iframeHeight);

										// $modalImg.removeAttr ('scrolling'); // remove scrolling attribute in case ut was still there fir sine reaspn
										$modalImg.attr('scrolling', 'yes');
									}

									/*
									$modalImg.load (function () {
										console.log ('iframe loaded successfully');
									});
									*/
									// console.log ($modalImg);
									/*
									$modalImg.on ('load', function (event) {
										console.log ("iframe loaded successfully");
										var $modalImage = $(this);
									  console.log ($modalImg);

										var $iframeImg = $modalImage.contents ().find ("img");
										console.log ($iframeImg);
										// $iframeImg.attr ("style", "width: 30px; height: 30px;");
										$iframeImg.attr ("data-why-tho", "hey");
									});
									*/

								// Set visible.
									$modal.addClass('visible');

								// Focus.
									$modal.focus();

								// Delay.
									setTimeout(function() {

										// Unlock.
											$modal[0]._locked = false;

									}, 600);

							});
							// position: fixed; justify-content: center; z-index=1000000;
							// find the child of the body element with the ID "wrapper"
							$body.children('#wrapper') // .children('#main')
								// make container for image element have style="border-radius: 4px;" (or all the imediate children elements within it some how
								// add the following modal, image element, and other lightbox stuff to within the wrapper element
								.prepend('<div class="modal" tabIndex="-1"><div class="inner"><iframe src="" /></div></div>') // changed img to iframe
								// ~the image element within the modal
								.find('iframe') // changed img to iframe
									// ~once the image element and all of its subelements have completely loaded, do the following:
									.on('load', function(event) {

										var $modalImg = $(this),
											$modal = $modalImg.parents('.modal');

										setTimeout(function() {

											// No longer visible? Bail.
												// exit the function if the modal is not visible
												if (!$modal.hasClass('visible'))
													return;

											// Set loaded.
												// add the class "loaded to the modal" to indicate that the modal has loaded
												$modal.addClass('loaded');

										}, 275);

									});
								// if the modal child element of the body is clicked on, then do the following (~to presumably exit out of the lightbox):
								// $body.on('click', '.modal img', function(event) {
								$body.on('click', '.modal', function(event) {

										var $modal = $('.modal'),
											$modalImg = $modal.find('iframe'); // changed img to iframe

										// Locked? Bail.
											// ~if the modal is considered "locked", exit the function
											if ($modal[0]._locked)
												return;

										// Already hidden? Bail.
											// if the modal is not visible, then exit the function
											if (!$modal.hasClass('visible'))
												return;

										// Lock.
											// make the modal be considered locked
											$modal[0]._locked = true;

										// Clear visible, loaded.
											// make the modal not be considered loaded
											$modal
												.removeClass('loaded')

										// Delay.
											// add a function to be called after a certain delay
											setTimeout(function() {

												// make the modal not be considered visible
												$modal
													.removeClass('visible')

												// add another function to be called after a certain delay
												setTimeout(function() {

													// Clear src.
														// set the source path of the image element to the empty string (to effectively clear it)
														$modalImg.attr('src', '');

													// Unlock.
														// make the modal no longer be considered locked
														$modal[0]._locked = false;

													// Focus.
														// call the focus function to 'focus' on the body elment (which I think effects tab order and that sort of thing) and execute any user defined function associated with the focus event (though I don't user-defined function is specified)
														$body.focus();

												}, 475); // effects how long until the light box can be opened again (after it is closed)

											}, 125); // effects how long the dark part of the lightbox lingers

									});
									/*
									// $window.on('keypress', '.modal', function(event) {
										$body.on('keypress', '.modal', function(event) {

										// var $modal = $(this);
										var $modal = $('.modal');

										// Escape? Hide modal.
											if (event.keyCode == 27) // this isn't being added in the write place currently
												$('body .modal').trigger('click');
												// $modal.trigger('click');

									});
									*/



})(jQuery);
