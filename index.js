"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0});const element_1=__importDefault(require("@heymarco/element")),element_config_1=__importDefault(require("@heymarco/element-config")),imagesloaded_1=__importDefault(require("imagesloaded"));class Masonry extends element_1.default{constructor(selector){super(selector)}updateLayout(){Masonry.lazy?Masonry.markLayoutInvalidate=!0:(Masonry.lazy=!0,setTimeout(()=>{Masonry.lazy=!1,Masonry.markLayoutInvalidate&&(Masonry.markLayoutInvalidate=!1,this.updateLayout())},300),this.updateLayoutNow())}updateLayoutNow(){this.each(function(){const singleMasonry=new element_1.default(this),spacerY=Number.parseFloat(singleMasonry.css("row-gap")),growHeight=Number.parseFloat(singleMasonry.css("grid-auto-rows"));singleMasonry.children().each(function(){const image=new element_1.default(this),dataAutoRow=`${Masonry.config.varPrefix}-auto-row`;switch(image.data(dataAutoRow)){case void 0:switch(image.css("grid-row-end")){case void 0:case null:case"":case"auto":image.data(dataAutoRow,!0);break;default:return void image.data(dataAutoRow,!1)}break;case!1:return}const style=this.style,prevAlign=style.alignSelf;style.alignSelf="start";const itemHeight=this.getBoundingClientRect().height;style.alignSelf=prevAlign;const rowSpan=Math.ceil((itemHeight+spacerY)/(growHeight+spacerY));style.gridRowEnd=`span ${rowSpan}`})})}static windowResizeHandler(){new Masonry(Masonry.config.class).updateLayout()}static imageLoadedHandler(img){const masonry=new element_1.default(img).parents(Masonry.config.class).first();masonry.length&&new Masonry(masonry).updateLayout()}static startup(){element_1.default.window.on("resize",()=>Masonry.windowResizeHandler()),imagesloaded_1.default.makeJQueryPlugin(element_1.default.jQuery),element_1.default.document.imagesLoaded().progress((instance,image)=>Masonry.imageLoadedHandler(image.img)),new Masonry(Masonry.config.class).updateLayout()}}exports.default=Masonry,Masonry.lazy=!1,Masonry.markLayoutInvalidate=!1,Masonry.config=new element_config_1.default(".masonry","masonry",null,()=>{new Masonry(Masonry.config.class).updateLayout()}),element_1.default.startup(Masonry.startup);