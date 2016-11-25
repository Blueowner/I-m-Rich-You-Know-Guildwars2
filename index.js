'use strict';

(function() {

  var UIOverlay = document.getElementById('UIOverlay');
  var UIPromptTextTemplate = '';

  var inventoryContainer = document.getElementById('inventoryContainer');
  var inventory = document.getElementById('inventory');
  var inventoryRect = null;

  var dragStart = { x: 0, y: 0 };
  var isDragging = false;
  var className = 'js-handle';
  var item = null;
  var scaleRatio = 1;

  window.addEventListener('resize', onWindowResize, false);
  onWindowResize();
  function onWindowResize() {
    let computed = getComputedStyle(document.body);
    let bodyRect = document.body.getBoundingClientRect();

    // let fullHDTop = 197;
    // let fullHDLeft = 315;
    let ratioTop = parseInt(computed.height.replace('px', '')) / 1080;
    let ratioLeft = parseInt(computed.width.replace('px', '')) / 1920;
    scaleRatio = Math.min(ratioTop, ratioLeft);

    console.log(ratioTop, ratioLeft);

    inventoryContainer.style.top = `${(bodyRect.height - 1080 * scaleRatio) / 2}px`;
    inventoryContainer.style.left = `${(bodyRect.width - 1920 * scaleRatio) / 2}px`;
    inventoryContainer.style.transform = `scale(${scaleRatio})`;

    inventoryRect = inventory.getBoundingClientRect()
  }

  function repositionItem(item, event) {
    item.style.position = 'absolute';
    item.style.top = `${(event.pageY - inventoryRect.top) / scaleRatio}px`;
    item.style.left = `${(event.pageX - inventoryRect.left) / scaleRatio}px`;
    item.style.transform = `translate(-${25}px, -${25}px)`;
  }

  document.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains(className)) {
      isDragging = true;
      dragStart = { x: e.pageX, y: e.pageY };

      item = e.target;

      repositionItem(item, e);
    }
  }, false);

  document.addEventListener('mousemove', function(e) {
    if ( ! isDragging) {
      return;
    }

    repositionItem(item, e);
  }, false);

  document.addEventListener('mouseup', function(e) {
    if ( ! isDragging) {
      return;
    }

    isDragging = false;

    if (event.pageX >= inventoryRect.left && event.pageX <= inventoryRect.right &&
        event.pageY >= inventoryRect.top && event.pageY <= inventoryRect.bottom) {

      let y = Math.floor((event.pageX - inventoryRect.left) / (52 * scaleRatio)) + 1;
      let x = Math.floor((event.pageY - inventoryRect.top) / (52 * scaleRatio)) + 1;

      console.log(x, y);

      let cell = document.getElementById(`${x}-${y}`);

      if ( ! cell) {
        return console.warn('No cell at', { x, y });
      }

      if (cell.firstChild) {
        let _y = Math.floor((dragStart.x - inventoryRect.left) / (52 * scaleRatio)) + 1;
        let _x = Math.floor((dragStart.y - inventoryRect.top) / (52 * scaleRatio)) + 1;
        console.log(_x, _y);
        document.getElementById(`${_x}-${_y}`).appendChild(cell.firstChild);
      }

      cell.appendChild(item);
      item.style.position = 'static';
      item.style.transform = '';

    } else {
      UIOverlay.classList.add('is-visible');
      UIPrompt.classList.add('is-visible');

      let y = Math.floor((dragStart.x - inventoryRect.left) / (52 * scaleRatio)) + 1;
      let x = Math.floor((dragStart.y - inventoryRect.top) / (52 * scaleRatio)) + 1;
      document.getElementById(`${x}-${y}`).appendChild(item);

      item.style.position = 'static';
      item.style.transform = '';

      if ( ! UIPromptTextTemplate) {
        UIPromptTextTemplate = document.getElementById('UIPrompt-text').innerHTML;
      }

      document.getElementById('UIPrompt-text').innerHTML = UIPromptTextTemplate
        .replace('[:color:]', item.dataset.color)
        .replace('[:legendary:]', item.dataset.name);

      // var response = prompt('Type "The Juggernaut" to delete');
      // if (response == 'The Juggernaut') {
      //   console.log('delete');
      //   UIOverlay.classList.remove('is-visible');
      // } else {
      //   console.log('error');
      //   UIOverlay.classList.remove('is-visible');
      // }
    }
  }, false);

})();
