import Page from '../../core/templates/page';
import './start.css';

class Start extends Page {
  static TextObject = {
    MainTitle: 'Start Page',
  };

  public constructor(className: string) {
    super(className);
  }

  private renderStartPage() {
    const title = this.creatHeaderTitle('Новогодняя игра');
    title.className = 'start-page-title';

    const span = document.createElement('span');
    span.textContent = '«Наряди ёлку»';

    const link = document.createElement('a');
    link.className = 'start-page-btn';
    link.href = '#toys';
    link.textContent = 'Начать';

    title.append(span);
    this.container.append(title);
    this.container.append(link);
  }

  render() {
    this.renderStartPage();
    return this.container;
  }
}

export default Start;
