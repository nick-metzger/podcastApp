import { trigger, state, style, animate, transition } from '@angular/animations';

export const loadingAnimation = trigger('loadingState', [
  state('loading', style({
    opacity: 1
  })),
  state('loaded', style({
    opacity: 0
  })),
  transition('loading => loaded', [
    animate('0.3s')
  ]),
  transition('loaded => loading', [
    animate('0.3s')
  ])
]); 