let callbacks: {[nodeId: string]: () => void} = {};

export function clearCanvasButtonCallbacks() {
    callbacks = {};
}

export function handleCanvasButtonClick(node: FrameNode): boolean {
    if (!callbacks[node.id]) return false;
    callbacks[node.id]();
    return true;
}

export function createCanvasButton(text: string, callback: () => void): FrameNode {
    const frame = figma.createFrame();
    frame.fills = [
        {
            type: 'SOLID',
            color: {r: 0, g: 0, b: 0},
            opacity: 0.1,
        },
    ];
    frame.cornerRadius = 4;
    frame.strokes = [
        {
            type: 'SOLID',
            color: {r: 0, g: 0, b: 0},
            opacity: 0.1,
        },
    ];
    frame.layoutMode = 'HORIZONTAL';
    frame.counterAxisAlignItems = 'CENTER';
    frame.primaryAxisAlignItems = 'CENTER';
    frame.paddingLeft = 16;
    frame.paddingRight = 16;
    frame.paddingTop = 4;
    frame.paddingBottom = 4;
    figma.loadFontAsync({family: 'Inter', style: 'Medium'}).then(() => {
        const nodeText = figma.createText();
        nodeText.characters = text;
        nodeText.fontName = {family: 'Inter', style: 'Medium'};
        nodeText.fontSize = 12;
        frame.appendChild(nodeText);
    });
    callbacks[frame.id] = callback;
    return frame;
}
