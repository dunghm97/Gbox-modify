console.log('Hello World!');
var initPhotoSwipeFromDOM = function(gallerySelector) {
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;
        for(var i = 0; i < numNodes; i++) {
            figureEl = thumbElements[i]; // <figure> element
            if(figureEl.nodeType !== 1) {
                continue;
            }
            linkEl = figureEl.children[0]; // <a> element
            size = linkEl.getAttribute('data-size').split('x');
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };
            if(figureEl.children.length > 1) {
                item.title = figureEl.children[1].innerHTML; 
            }
            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            } 
            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }
        return items;
    };
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        var eTarget = e.target || e.srcElement;
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });
        if(!clickedListItem) {
            return;
        }
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;
        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) { 
                continue; 
            }
            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }
        if(index >= 0) {
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};
        if(hash.length < 5) {
            return params;
        }
        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');  
            if(pair.length < 2) {
                continue;
            }           
            params[pair[0]] = pair[1];
        }
        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }
        return params;
    };
    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;
        items = parseThumbnailElements(galleryElement);
        options = {
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
            getThumbBoundsFn: function(index) {
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(); 

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            },
            showAnimationDuration : 0,
            hideAnimationDuration : 0
        };
        if(fromURL) {
            if(options.galleryPIDs) {
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }
        if( isNaN(options.index) ) {
            return;
        }
        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };
    var galleryElements = document.querySelectorAll( gallerySelector );
    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};

$(window).on('load',function () {
    initPhotoSwipeFromDOM('.carousel-img');
});

let logo = $('.logo .home');
logo.on('click',() => {
    let newHref = 'index.html';
    logo.attr('href',newHref);
})

let backHome = $('.backsite');
backHome.on('click', () => {
    let newHref = 'index.html';
    backHome.attr('href',newHref);
})

//menu
let menuItemLeft = $('.nav .nav-left li a');
menuItemLeft.on('click', (e) => {
    let href= 'about.html';
    menuItemLeft.attr("href",href);
})
let menuItemRight = $('.nav .nav-right li a');
menuItemRight.on('click', (e) => {
    let href= 'contact.html';
    menuItemRight.attr("href",href);
})
let menuItemCenter = $('.nav .nav-center li a');
menuItemCenter.on('click', (e) => {
    let indexItem = menuItemCenter.index(e.target);
    if(indexItem == 0) {
        console.log(indexItem);
        let href0 = 'studio.html';
        $(e.target).attr('href',href0);
    } else if (indexItem == 1) {
        console.log(indexItem);
        let href1 = 'rental.html';
        $(e.target).attr('href',href1);
    } else if (indexItem == 2) {
        let href2 = 'gbox-cafe.html';
        $(e.target).attr('href',href2);
    } else {
        console.log(indexItem);
        let href3 = 'allwork.html';
        $(e.target).attr('href',href3);
    }
})

//menuMobile 
let menuMobile = $('header .menuMobile');
let menuBtn = $('.header-top .logo .btnMobile')
menuBtn.on('click', (e) => {
    e.preventDefault();
    console.log("OK");
    menuMobile.toggleClass('active');
})

//Clicking nav in MenuMobile
let mobileItems = $('header .menuMobile li a');
mobileItems.on('click', (e) => {
    
    let indexItem = mobileItems.index(e.target);
    switch(indexItem){
        case 0: 
            let href = 'about.html';
            $(e.target).attr('href',href);
            break;
        case 1:
            let href1 = 'studio.html';
            $(e.target).attr('href',href1);
            break;
        case 2:
            let href2 = '';
            $(e.target).attr('href',href2);
            break;
        case 3:
            let href3 = 'gbox-cafe.html';
            $(e.target).attr('href',href3);
            break;
        case 4:
            let href4 = 'allwork.html';
            $(e.target).attr('href',href4);
            break;
        case 5:
            let href5 = 'contact.html';
            $(e.target).attr('href',href5);
            break;
        default:
            break;
    };
})
