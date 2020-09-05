export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 100;
    this.type = type;
    // TODO: throw error if user use "new Character()"
    if (new.target.name === 'Character') {
      throw new Error('Нельза создавать персонажа через new Character');
    }
  }

  static levelUp() {
    this.level += 1;
    this.attack = Math.round(Math.max(this.attack, (this.attack * (1.8 - this.health)) / 100));
    this.defence = Math.round(Math.max(this.defence, (this.defence * (1.8 - this.health)) / 100));
    this.health = (this.health + 80) > 100 ? 100 : this.health + 80;
  }
}
