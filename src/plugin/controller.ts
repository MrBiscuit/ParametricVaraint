import { handleEvent } from './codeMessageHandler';
import diff from './utilDiff';

figma.showUI(__html__);

let lastSelection;

handleEvent("createComponentSet", () => {
    const comp = figma.createComponent();
    const componentSet = figma.combineAsVariants([comp],figma.currentPage);
    componentSet.name = "New Parametric Component Set";

    console.log("wiefjifwej")
    figma.currentPage.selection = [componentSet];
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
