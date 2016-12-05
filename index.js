'use strict';

(function() {

  var UIOverlay = document.getElementById('UIOverlay');
  var UIPromptTextTemplate = '';

  var inventoryContainer = document.getElementById('inventoryContainer');
  var inventory = document.getElementById('inventory');
  var inventoryRect = null;

  var negativeButton = document.getElementById('UIPrompt-button-n');
  var positiveButton = document.getElementById('UIPrompt-button-y');
  var inputField = document.getElementById('UIPrompt-input');

  var dragStart = { x: 0, y: 0 };
  var isDragging = false;
  var className = 'js-handle';
  var item = null;
  var itemClone = null;
  var scaleRatio = 1;
  var cellSize = 57;

  window.addEventListener('resize', onWindowResize, false);
  onWindowResize();
  function onWindowResize() {
    let ratioTop = window.innerHeight / 1080;
    let ratioLeft = window.innerWidth / 1920;
    scaleRatio = Math.min(ratioTop, ratioLeft);

    inventoryContainer.style.top = `${(window.innerHeight - 1080 * scaleRatio) / 2}px`;
    inventoryContainer.style.left = `${(window.innerWidth - 1920 * scaleRatio) / 2}px`;
    inventoryContainer.style.transform = `scale(${scaleRatio})`;

    inventoryRect = inventory.getBoundingClientRect()
  }

  function repositionItem(element, event) {
    element.style.position = 'absolute';
    element.style.top = `${(event.clientY - inventoryRect.top) / scaleRatio}px`;
    element.style.left = `${(event.clientX - inventoryRect.left) / scaleRatio}px`;
    element.style.transform = `translate(-${25}px, -${25}px)`;
  }

  function openUIPrompt() {
    UIOverlay.classList.add('is-visible');
    UIPrompt.classList.add('is-visible');
  }

  function closeUIPrompt() {
    UIOverlay.classList.remove('is-visible');
    UIPrompt.classList.remove('is-visible');

    setTimeout(function() {
      positiveButton.setAttribute('disabled', true);
      inputField.value = '';
    }, 0);
  }

  negativeButton.addEventListener('click', function() {
    closeUIPrompt();
  }, false);

  positiveButton.addEventListener('click', function() {
    item.remove();
    closeUIPrompt();
  }, false);

  inputField.addEventListener('keyup', function() {
    if (inputField.value == item.dataset.name) {
      positiveButton.removeAttribute('disabled');
    } else {
      positiveButton.setAttribute('disabled', true);
    }
  }, false);

  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  document.addEventListener('mousedown', function(e) {
    if (e.which !== 1) {
      // Any `which` different than 1 is not a left click.
      return;
    }

    if (e.target.classList.contains(className)) {
      isDragging = true;
      dragStart = { x: e.clientX, y: e.clientY };

      item = e.target;
      itemClone = e.target.cloneNode(true);
      inventory.appendChild(itemClone);

      repositionItem(itemClone, e);
    }
  }, false);

  document.addEventListener('mousemove', function(e) {
    if ( ! isDragging) {
      return;
    }

    repositionItem(itemClone, e);
  }, false);

  document.addEventListener('mouseup', function(e) {
    if (e.which !== 1) {
      // Any `which` different than 1 is not a left click.
      return;
    }

    if ( ! isDragging) {
      return;
    }

    itemClone.remove();

    isDragging = false;

    if (event.clientX >= inventoryRect.left && event.clientX <= inventoryRect.right &&
        event.clientY >= inventoryRect.top && event.clientY <= inventoryRect.bottom) {

      let y = Math.floor((event.clientX - inventoryRect.left) / (cellSize * scaleRatio)) + 1;
      let x = Math.floor((event.clientY - inventoryRect.top) / (cellSize * scaleRatio)) + 1;

      let cell = document.getElementById(`${x}-${y}`);

      if (cell.firstChild) {
        let _y = Math.floor((dragStart.x - inventoryRect.left) / (cellSize * scaleRatio)) + 1;
        let _x = Math.floor((dragStart.y - inventoryRect.top) / (cellSize * scaleRatio)) + 1;
        document.getElementById(`${_x}-${_y}`).appendChild(cell.firstChild);
      }

      cell.appendChild(item);

    } else {
      openUIPrompt();

      let y = Math.floor((dragStart.x - inventoryRect.left) / (cellSize * scaleRatio)) + 1;
      let x = Math.floor((dragStart.y - inventoryRect.top) / (cellSize * scaleRatio)) + 1;
      document.getElementById(`${x}-${y}`).appendChild(item);

      if ( ! UIPromptTextTemplate) {
        UIPromptTextTemplate = document.getElementById('UIPrompt-text').innerHTML;
      }

      document.getElementById('UIPrompt-text').innerHTML = UIPromptTextTemplate
        .replace('[:color:]', item.dataset.color)
        .replace('[:legendary:]', item.dataset.name);
    }
  }, false);

})();
