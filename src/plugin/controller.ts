import diff from './utilDiff';

figma.showUI(__html__);

let lastSelection;

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
