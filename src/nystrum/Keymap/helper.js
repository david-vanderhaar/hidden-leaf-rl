import { ALPHABET } from '../constants';

export const addAlphabeticallyToKeymap = (keymap, obj) => {
  let alphabetAllowed = ALPHABET.filter((letter) => {
    return !Object.keys(keymap).includes(letter);
  });
  keymap[alphabetAllowed[0]] = obj;
}

export const deactivateUIKeymap = (engine, visibleUIKey) => {
  let currentUiActor = engine.actors[engine.currentActor];
  engine.game.removeActor(currentUiActor);
  engine.game[visibleUIKey] = null;
}