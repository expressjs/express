'use strict'

module.exports = class Settings {
  #parent;
  settings;
  #setters;

  constructor (opts) {
    this.#parent = null;
    this.settings = Object.create(null);
    this.#setters = opts?.setters || Object.create(null);
  }

  set (setting, val) {
    if (arguments.length === 1) {
      return this.get(setting);
    }

    this.settings[setting] = val;

    if (typeof this.#setters[setting] === 'function') {
      this.#setters[setting].call(this, val);
    }

    return this;
  }

  get (setting) {
    const val = this.settings[setting];
    if (typeof val !== 'undefined') {
      return val;
    }
    if (this.#parent) {
      return this.#parent.get(setting);
    }
    return undefined;
  }

  enable (setting) {
    return this.set(setting, true);
  }

  disable (setting) {
    return this.set(setting, false);
  }

  enabled (setting) {
    return !!this.get(setting);
  }

  disabled (setting) {
    return !this.get(setting);
  }

  unset (setting) {
    this.settings[setting] = undefined;
    return this;
  }

  inheritFrom (parent) {
    this.#parent = parent;
  }
}
