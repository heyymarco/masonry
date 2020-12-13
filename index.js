"use strict";var __importDefault=this&&this.__importDefault||function(mod){return mod&&mod.__esModule?mod:{default:mod}};Object.defineProperty(exports,"__esModule",{value:!0});const element_1=__importDefault(require("@heymarco/element")),element_config_1=__importDefault(require("@heymarco/element-config")),imagesloaded_1=__importDefault(require("imagesloaded"));class Masonry extends element_1.default{constructor(selector=Masonry.config.class){super(selector)}updateLayout(){Masonry._lazy?Masonry._markLayoutInvalidate=!0:(Masonry._lazy=!0,setTimeout(()=>{Masonry._lazy=!1,Masonry._markLayoutInvalidate&&(Masonry._markLayoutInvalidate=!1,this.updateLayout())},300),this.updateLayoutNow())}updateLayoutNow(){this.each(function(){const singleMasonry=new element_1.default(this),spacerY=Number.parseFloat(singleMasonry.css("row-gap")),growHeight=Number.parseFloat(singleMasonry.css("grid-auto-rows"));singleMasonry.children().each(function(){const image=new element_1.default(this),dataAutoRow=`${Masonry.config.varPrefix}-auto-row`;switch(image.data(dataAutoRow)){case void 0:switch(image.css("grid-row-end")){case void 0:case null:case"":case"auto":image.data(dataAutoRow,!0);break;default:return void image.data(dataAutoRow,!1)}break;case!1:return}const style=this.style,prevAlign=style.alignSelf;style.alignSelf="start";const itemHeight=this.getBoundingClientRect().height;style.alignSelf=prevAlign;const rowSpan=Math.ceil((itemHeight+spacerY)/(growHeight+spacerY));style.gridRowEnd=`span ${rowSpan}`})})}static windowResizeHandler(){(new Masonry).updateLayout()}static imageLoadedHandler(img){const masonry=new element_1.default(img).parents(Masonry.config.class).first();masonry.length&&new Masonry(masonry).updateLayout()}static startup(){Masonry._startedUp=!0,element_1.default.window.on("resize",()=>Masonry.windowResizeHandler()),imagesloaded_1.default.makeJQueryPlugin(element_1.default.jQuery),element_1.default.document.imagesLoaded().progress((instance,image)=>Masonry.imageLoadedHandler(image.img)),(new Masonry).updateLayout()}}exports.default=Masonry,Masonry._lazy=!1,Masonry._markLayoutInvalidate=!1,Masonry._startedUp=!1,Masonry.config=new element_config_1.default(".masonry","masonry",null,()=>{Masonry._startedUp&&(new Masonry).updateLayout()},!1),element_1.default.startup(Masonry.startup);
