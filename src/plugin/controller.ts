import { handleEvent } from './codeMessageHandler';
import diff from './utilDiff';

figma.showUI(__html__);

let lastSelection;
let padding = 32

const interval = setInterval(() => {
    updateLayout()
}, 100);

handleEvent("createComponentSet", () => {

    // 创建组件集
    const baseComponent = figma.createComponent();
    const componentSet = figma.combineAsVariants([baseComponent],figma.currentPage);
    baseComponent.y = padding

    // 组建集样式
    componentSet.name = "New Parametric Component Set";
    componentSet.effects = [{type:"INNER_SHADOW",color:{r:0.5921568870544434,g:0.27843138575553894,b:1,a:1},offset:{x:0,y:6},radius:0,spread:0,visible:!0,blendMode:"NORMAL"}]
    componentSet.fills = [{type:"SOLID",visible:!0,opacity:1,blendMode:"MULTIPLY",color:{r:1,g:1,b:1}}]
    
     // 组件集位置 在视窗中间
     componentSet.x = figma.viewport.center.x - componentSet.width / 2;
     componentSet.y = figma.viewport.center.y - componentSet.height / 2

    // 创建工具盒图层 尺寸保持与组件集等大
    const utilsFrame = figma.createFrame() // 辅助文本 最外层Frame
    utilsFrame.name = "" 
    utilsFrame.fills = [] 

    utilsFrame.x = componentSet.x
    utilsFrame.y = componentSet.y
    utilsFrame.resize(componentSet.width,componentSet.height)


    const baseDescriptionGroup = createVariantDescription(utilsFrame, baseComponent, "Base", "&Interactions");

    const descriptionGroup = figma.group([baseDescriptionGroup], utilsFrame);
    descriptionGroup.name = "Description"

    figma.currentPage.selection = [baseComponent];
    figma.viewport.scrollAndZoomIntoView([componentSet]);
});


figma.on('selectionchange', () => {
    const sel = figma.currentPage.selection[0];
    if (!sel) return;
    console.log(sel);
    /* if (sel.type === 'COMPONENT') {
        if (lastSelection) {
            console.log(diff(sel, lastSelection));
        }
        lastSelection = sel;
    } */
});

// 组件集辅助文本创建
function createVariantDescription(parentFrame:FrameNode, target: ComponentNode, title:string, subTitle:string):GroupNode {

    const titleText = figma.createText();
    const subTitleText = figma.createText();
    figma.loadFontAsync({family:"Inter",style:"Medium"}).then(() => {
        titleText.fontName = {family:"Inter",style:"Medium"}
        titleText.characters = title
        titleText.fontSize = 13
        titleText.textAlignHorizontal = "RIGHT"
    })
    figma.loadFontAsync({family:"Inter",style:"Regular"}).then(() => {
        subTitleText.fontName = {family:"Inter",style:"Regular"}
        subTitleText.characters = subTitle
        subTitleText.fontSize = 9
        subTitleText.textAlignHorizontal = "RIGHT"
    })
    const group = figma.group([titleText, subTitleText], parentFrame);
    subTitleText.y = titleText.y + titleText.height;
    titleText.x = subTitleText.x + subTitleText.width - titleText.width;
    
    group.name = title + " Description"

    return group;
}

function updateLayout() {

}