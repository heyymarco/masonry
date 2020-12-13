import Element from "@heymarco/element";
import ElementConfig from "@heymarco/element-config";

import ImagesLoaded from "imagesloaded";



/**
 * Creates a "masonry" grid layout for making beautiful (image or other) gallery.
 */
export default class Masonry extends Element {
    constructor(selector : Selector = Masonry.config.class) {
        super(selector);
    }



    // static global variable across class Masonry instances
    private static lazy = false;
    private static markLayoutInvalidate = false;
    updateLayout() {
        if (Masonry.lazy) {
            // when in lazy mode, just marking layout as invalidate, but not performing the actual updateLayoutNow
            Masonry.markLayoutInvalidate = true;
            return;
        }


        // set timer going to lazy mode:
        Masonry.lazy = true; // now i'm lazy mode
        setTimeout(() => {
            Masonry.lazy = false; // now i'm not lazy

            // perform the delayed updateLayoutNow
            if (Masonry.markLayoutInvalidate) {
                Masonry.markLayoutInvalidate = false; // mark as done

                this.updateLayout(); // performing the actual updateLayout
            }
        }, 300);



        this.updateLayoutNow();
    }
    updateLayoutNow() {
        this.each(function(){
            const singleMasonry = new Element(this);
            const spacerY = Number.parseFloat(singleMasonry.css("row-gap"));
            const growHeight = Number.parseFloat(singleMasonry.css("grid-auto-rows"));
    
            singleMasonry.children().each(function(){
                const image = new Element(this);
                const dataAutoRow = `${Masonry.config.varPrefix}-auto-row`;
                switch(image.data(dataAutoRow)) {
                    case undefined:
                        switch (image.css("grid-row-end")) {
                            case undefined:
                            case null:
                            case "":
                            case "auto":
                                image.data(dataAutoRow, true);
                                break;
                            
                            default:
                                image.data(dataAutoRow, false);
                                return;
                        } // switch
                        break;
    
                    case false:
                        return;
                } // switch
                
                
                const style = this.style;
                const prevAlign = style.alignSelf;
                style.alignSelf = "start";
                const itemHeight = this.getBoundingClientRect().height;
                style.alignSelf = prevAlign;
    
                const rowSpan = Math.ceil((itemHeight + spacerY) / (growHeight + spacerY));
                style.gridRowEnd = `span ${rowSpan}`;
            });
        });
    }



    /**
     * A function to be executed when the browser's window resized.
     */
    static windowResizeHandler() {
        // masonry's layout might be broken if browser's window resized, so it need to be re-update:
        new Masonry().updateLayout();
    }

    /**
     * A function to be executed when any image was loaded or reloaded on the html document.
     */
    static imageLoadedHandler(img : HTMLElement) {
        // if any image inside the .masonry was loaded / reloaded, the masonry's layout might be broken, so it need to be re-update

        // find the masonry owning this img:
        const masonry = new Element(img).parents(Masonry.config.class).first();

        // if found, the masonry's layout need to be updated
        if (masonry.length) new Masonry(masonry).updateLayout();
    }



    static config = new ElementConfig(
        /* className    = */ ".masonry",
        /* varPrefix    = */ "masonry",
        /* deconfigure  = */ null,
        /* configure    = */ () => {
            // masonry's layout need to be updated when the .masonry class or verPrefix was changed:
            new Masonry().updateLayout();
        },
        /* configFirst  = */ false // do not apply the config immediately. I'll apply it at startup time.
    );

    static startup() : void {
        // watch the resize event of browser's window.
        Element.window
        .on("resize", () => Masonry.windowResizeHandler())
        ;


        // set up the imagesLoaded plugin
        // @ts-ignore
        ImagesLoaded.makeJQueryPlugin(Element.jQuery);

        // watch the image's load event on whole document.
        Element.document.imagesLoaded().progress((instance, image) => Masonry.imageLoadedHandler(image.img as HTMLElement));


        // update all masonry(es) for the first time;
        new Masonry().updateLayout();
    }
}
Element.startup(Masonry.startup);