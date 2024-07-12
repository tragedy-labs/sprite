/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/copyright/software-license-2023/
 *
 *   Simple accordion pattern example
 */

'use strict';

class Accordion {
  constructor(domNode) {
    this.root = domNode;
    this.button = this.root.querySelector('button[aria-expanded]');
    this.icon = this.root.querySelector('svg');
    const controlsId = this.button.getAttribute('aria-controls');
    this.content = document.getElementById(controlsId);

    this.open = this.button.getAttribute('aria-expanded') === 'true';

    // add event listeners
    this.button.addEventListener('click', this.onButtonClick.bind(this));
    this.toggle(false);
  }

  onButtonClick() {
    this.toggle(!this.open);
  }

  toggle(open) {
    // don't do anything if the open state doesn't change
    if (open === this.open) {
      return;
    }

    // update the internal state
    this.open = open;

    // handle DOM updates
    this.button.setAttribute('aria-expanded', `${open}`);
    if (open) {
      this.content.removeAttribute('hidden');
      this.icon.classList.add('open');
    } else {
      this.content.setAttribute('hidden', '');
      this.icon.classList.remove('open');
    }
  }

  // Add public open and close methods for convenience
  open() {
    this.toggle(true);
  }

  close() {
    this.toggle(false);
  }
}

const initializeAccordions = () => {
  // init accordions
  const accordions = document.querySelectorAll('.menuItem');
  accordions.forEach((accordionEl) => {
    new Accordion(accordionEl);
  });
};

document.addEventListener('DOMContentLoaded', initializeAccordions);
