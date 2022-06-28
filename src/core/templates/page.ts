abstract class Page {
  protected container: HTMLElement;

  static TextObject = {};

  constructor(className: string) {
    this.container = document.createElement('main');
    this.container.className = className;
  }

  protected creatHeaderTitle(text: string) {
    const headerTitle = document.createElement('h1');
    headerTitle.textContent = text;
    return headerTitle;
  }

  render() {
    return this.container;
  }
}

export default Page;
