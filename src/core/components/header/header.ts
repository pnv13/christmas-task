import './header.css';
import Component from '../../templates/components';
import { PagesId } from '../../../pages/app/app';

const Buttons = [
  {
    id: PagesId.StartPage,
  },
  {
    id: PagesId.ToysPage,
    text: 'Игрушки',
  },
  {
    id: PagesId.TreePage,
    text: 'Ёлка',
  },
];

class Header extends Component {
  private idPage: string;
  public searchText: string;
  public constructor(tagName: string, className: string, idPage: string) {
    super(tagName, className);
    this.idPage = idPage;
    this.searchText = '';
  }

  private renderHeader() {
    const headerContent = document.createElement('div');
    headerContent.className = 'header-container';
    const headerNavigation = `
      <nav class="nav-bar">
        <a class="logo" href="#${Buttons[0].id}"></a>
        <a href="#${Buttons[1].id}">${Buttons[1].text}</a>
        <a href="#${Buttons[2].id}">${Buttons[2].text}</a>
      </nav>
    `;
    const headerControls = document.createElement('div');
    headerControls.className = 'header-controls';

    const input = document.createElement('input');
    input.className = 'search';
    input.type = 'search';
    input.placeholder = 'Найти игрушку';
    input.autofocus = true;
    input.oninput = () => {
      let result = true;
      this.searchText = input.value.trim();
      const cards = document.querySelectorAll('.card');
      if (this.searchText) {
        cards.forEach(card => {
          if (card.textContent?.toLowerCase()?.search(this.searchText.toLowerCase())) {
            card.classList.add('hide');
          }
        });
      } else {
        cards.forEach(card => {
          card.classList.remove('hide');
        });
      }
      cards.forEach(card => {
        if (!card.classList.contains('hide')) result = false;
      });
      const cardContainer = document.querySelector('.card-container') as HTMLDivElement;
      const error = document.createElement('h2');
      error.textContent = 'Извините, совпадений не обнаружено';
      if (result && cardContainer.lastElementChild?.classList.contains('card')) {
        cardContainer.append(error);
      } else if (!result) {
        cardContainer.lastElementChild?.remove();
      }
    };

    const div = document.createElement('div');
    div.className = 'select';

    const span = document.createElement('span');
    span.textContent = '0';

    div.append(span);
    headerControls.append(input);
    headerControls.append(div);
    headerContent.insertAdjacentHTML('afterbegin', headerNavigation);
    if (this.idPage !== 'start') {
      headerContent.append(headerControls);
    }
    this.container.append(headerContent);
  }

  render() {
    this.renderHeader();
    return this.container;
  }
}

export default Header;
