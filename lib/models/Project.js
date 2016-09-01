'use babel';

import mobx, { observable, computed, extendObservable, action } from 'mobx';
import fs from 'fs';
import CSON from 'season';

export default class Project {
  @observable props = {
    title: '',
    paths: [],
    icon: 'icon-chevron-right',
    settings: {},
    group: null,
    devMode: false,
    template: null,
    source: null,
  }

  @computed get title() {
    return this.props.title;
  }

  @computed get paths() {
    return this.props.paths;
  }

  @computed get group() {
    return this.props.group;
  }

  @computed get rootPath() {
    return this.paths[0];
  }

  @computed get isCurrent() {
    const activePath = atom.project.getPaths()[0];

    if (activePath === this.rootPath) {
      return true;
    }

    return false;
  }

  constructor(props) {
    this.updateProps(props);
  }

  updateProps(props) {
    extendObservable(this.props, props);
  }

  getProps() {
    return mobx.toJS(this.props);
  }

  get lastModified() {
    let mtime = 0;
    try {
      const stats = fs.statSync(this.rootPath);
      mtime = stats.mtime;
    } catch (e) {
      mtime = new Date(0);
    }

    return mtime;
  }

  /**
   * Fetch settings that are saved locally with the project
   * if there are any.
   */
  @action fetchLocalSettings() {
    const file = `${this.rootPath}/project.cson`;
    CSON.readFile(file, (err, settings) => {
      if (err) {
        return;
      }

      extendObservable(this.props.settings, settings);
    });
  }
}