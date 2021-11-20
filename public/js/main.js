const ws = new WebSocket(`ws://${location.hostname}:3001`);

const eventHandlers = window.overlays.reduce(getOverlayHandlers, {});

ws.addEventListener('message', (event) => {
  const eventData = JSON.parse(event.data);

  const handler = eventHandlers[eventData.type][eventData.name];

  if (handler) {
    handler.run(eventData.data);
  }
});

function getFadeOutTime(time) {
  return Math.sqrt(1 - Math.pow(time, 2));
}

function getOverlayHandlers(overlayHandlers, overlay) {
  if (!overlayHandlers[overlay.type]) {
    overlayHandlers[overlay.type] = {};
  }

  overlayHandlers[overlay.type][overlay.name] = eval(overlay.handler);

  return overlayHandlers;
}
