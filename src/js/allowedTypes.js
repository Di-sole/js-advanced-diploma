import Swordsman from './characters/Swordsman';
import Bowman from './characters/Bowman';
import Magician from './characters/Magician';
import Daemon from './characters/Daemon';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';

const computerTypes = [
  Daemon,
  Undead,
  Vampire,
];

const playerTypes = [
  Swordsman,
  Bowman,
  Magician,
];

export { computerTypes, playerTypes };
