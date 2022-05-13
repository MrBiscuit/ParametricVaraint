import { handleEvent } from './codeMessageHandler';
import diff from './utilDiff';

figma.showUI(__html__);

let lastSelection;

handleEvent("createComponentSet", () => {

    // 创建组件集
    const baseComponent = figma.createComponent();
    const componentSet = figma.combineAsVariants([baseComponent],figma.currentPage);
    
    // 组建集样式
    componentSet.name = "New Parametric Component Set";
    componentSet.effects = [{type:"INNER_SHADOW",color:{r:0.5921568870544434,g:0.27843138575553894,b:1,a:1},offset:{x:0,y:6},radius:0,spread:0,visible:!0,blendMode:"NORMAL"}]
    componentSet.fills = [{type:"SOLID",visible:!0,opacity:1,blendMode:"MULTIPLY",color:{r:1,g:1,b:1}}]
    
    // 组件集辅助文本创建
    const baseTitle = figma.createText();
    const baseSubTitle = figma.createText();
    figma.loadFontAsync({family:"Inter",style:"Medium"}).then(() => {
        baseTitle.fontName = {family:"Inter",style:"Medium"}
        baseTitle.characters = "Base";
        baseTitle.fontSize = 13
        baseTitle.textAlignHorizontal = "RIGHT"
    })
    figma.loadFontAsync({family:"Inter",style:"Regular"}).then(() => {
        baseSubTitle.fontName = {family:"Inter",style:"Regular"}
        baseSubTitle.characters = "&Interactions";
        baseSubTitle.fontSize = 9
        baseTitle.textAlignHorizontal = "RIGHT"
    })

    // 组件集辅助文本布局
    const descriptionFrame = figma.createFrame() // 辅助文本 最外层Frame
    descriptionFrame.name = "" 
    descriptionFrame.fills = [] 

    figma.group([baseTitle,baseSubTitle],descriptionFrame)
    baseSubTitle.y = baseTitle.y + baseTitle.height
    baseTitle.x = baseSubTitle.x + baseSubTitle.width - baseTitle.width
    
    descriptionFrame.x = componentSet.x
    descriptionFrame.y = componentSet.y
    descriptionFrame.resize(componentSet.width,componentSet.height)

    // 组件集位置
    componentSet.x = figma.viewport.center.x - componentSet.width / 2;
    componentSet.y = figma.viewport.center.y - componentSet.height / 2
    figma.currentPage.selection = [baseComponent];
    figma.viewport.scrollAndZoomIntoView([componentSet]);
});


figma.on('selectionchange', () => {
    const sel = figma.currentPage.selection[0];
    if (!sel) return;
    console.log(sel);
    if (sel.type === 'COMPONENT') {
        if (lastSelection) {
            console.log(diff(sel, lastSelection));
        }
        lastSelection = sel;
    }
});
