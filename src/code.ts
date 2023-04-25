import "./styles.scss";

import data from './data';

const BASE_URL = 'https://image.tmdb.org/t/p/';

const getSize = (node: SceneNode) => {
  const { width } = node;
  if (width < 186) {
    return 'w185';
  } else if (width < 343) {
    return 'w342';
  } else if (width < 501) {
    return 'w500';
  } else if (width < 781) {
    return 'w780';
  } else {
    return 'original';
  }
}

async function createTMDBImage(node: SceneNode, data: any) {

  const size = getSize(node);

  const image = await figma.createImageAsync(BASE_URL + size + data.src);
  const { width, height } = await image.getSizeAsync();
  const newNode = figma.createRectangle();
  newNode.resize(width, height);
  newNode.fills = [
    {
      type: 'IMAGE',
      imageHash: image.hash,
      scaleMode: 'FIT',
    }
  ];
  newNode.x = 0;
  newNode.y = 0;
  newNode.rescale(node.width / width);
  // @ts-ignore
  node.appendChild(newNode);
  figma.currentPage.selection = [newNode];
  return await newNode;
} 

if (figma?.editorType === 'figma') {
  figma.showUI(__html__, {
    width: 860,
    height: 640,
    title: "TMDB images",
    themeColors: true,
  });
  
  figma.ui.postMessage(data);
  
  // @ts-ignore
  figma.on('drop', (event: DropEvent) => {

    if(event.node.type !== 'FRAME') {
      figma.notify('Please select a frame to add the image to.');
      return;
    }
    
    createTMDBImage(event.node, event.dropMetadata);

  });

  // @ts-ignore
  figma.on('run', (event: DropEvent) => {
    console.log('run');
  });


  figma.ui.onmessage = (message) => {
    console.log(message);
    
    if (figma.currentPage.selection.length === 0) {
      figma.notify('Please select a frame to add the image to.');
      return;
    }

    if (message.event === 'click-image') {

      for (const node of figma.currentPage.selection) {
        createTMDBImage(node, message);
      }

    } else if (message.event === 'add-people') {

      for (const node of figma.currentPage.selection) {
        createTMDBImage(node, data.profiles[Math.floor(Math.random()*data.profiles.length)]);
      }

    } else if (message.event === 'add-posters') {

      for (const node of figma.currentPage.selection) {
        createTMDBImage(node, data.posters[Math.floor(Math.random()*data.posters.length)]);
      }

    } else if (message.event === 'add-backdrops') {

      for (const node of figma.currentPage.selection) {
        createTMDBImage(node, data.backdrops[Math.floor(Math.random()*data.backdrops.length)]);
      }

    }
  }
}
