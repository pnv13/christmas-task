import Page from '../../core/templates/page';

class Tree extends Page {
  static TextObject = {
    MainTitle: 'Tree',
  };

  public constructor(className: string) {
    super(className);
  }

  render() {
    const title = this.creatHeaderTitle(Tree.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}

export default Tree;
