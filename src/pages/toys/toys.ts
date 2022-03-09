import Page from '../../core/templates/page';
import './toys.css';
import data from '../../data';
import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import App from '../app/app';

export interface IObject {
  num: string;
  name: string;
  count: string;
  year: string;
  shape: string;
  color: string;
  size: string;
  favorite: boolean;
  [key: string]: string | boolean;
}

interface IConfig {
  className: string;
  text: string;
  options: string[];
}

interface IRangeFilterConfig {
  className: string;
  minValue: number;
  maxValue: number;
  title: string;
}

const enum CardItems {
  Card = 'card',
  CardTitle = 'card-title',
  CardImg = 'card-img',
  CardDescription = 'card-description',
  Ribbon = 'ribbon',
}
const enum FilterTitles {
  ToysFilter = 'Фильтры по значению',
  RangeFilter = 'Фильтры по диапазону',
  SortFilter = 'Сортировка',
}

class Toys extends Page {
  protected filteredArray: IObject[];
  protected favoriteArray: IObject[];
  protected rangeElements: IObject[];
  protected selectedElements: string[];
  protected countElements: number[];
  protected yearElements: number[];
  protected selectValue: string;

  public constructor(className: string) {
    super(className);
    this.filteredArray = [];
    this.favoriteArray = [];
    this.selectedElements = [];
    this.rangeElements = [];
    this.countElements = [];
    this.yearElements = [];
    this.selectValue = '';
  }

  private createFilterTitle(str: string) {
    const title = document.createElement('h3');
    title.className = 'filter-title';
    title.textContent = str;

    return title;
  }

  private getTemp() {
    return this.filteredArray.length ? this.filteredArray : data;
  }

  private createFavoriteToys() {
    const favorite = document.createElement('div');
    favorite.className = 'favorite-toys';
    favorite.textContent = 'Только любимые:';

    const form = document.createElement('div');
    form.className = 'form-group';

    const input = document.createElement('input');
    input.className = 'favorite-input';
    input.id = 'checkbox';
    input.type = 'checkbox';

    const label = document.createElement('label');
    label.className = 'favorite-input-label';
    label.setAttribute('for', 'checkbox');
    label.addEventListener('click', () => {
      if (!input.checked) {
        const res = data.filter(card => card.favorite === true);
        this.favoriteArray = res;
        this.startNewData();
      } else {
        this.favoriteArray = [];
        this.startNewData();
      }
      this.selectedCards();
    });

    form.append(input);
    form.append(label);
    favorite.append(form);

    return favorite;
  }

  private startNewData() {
    const someData = this.newData();
    const cardContainer = this.drawCards(someData);

    const deletedContainer = document.querySelector('.card-container');
    const parent = deletedContainer?.parentNode;
    deletedContainer?.remove();
    parent?.append(cardContainer);
  }

  private newData() {
    this.filteredArray = [];
    const keyValues: string[] = [];
    const values: string[] = [];
    let newDataColor: IObject[] = [];
    let newDataSize: IObject[] = [];
    let prevName = '';
    let count = 0;

    let tmp: IObject[];
    if (this.rangeElements.length && this.favoriteArray.length) {
      tmp = data.filter(
        card => this.rangeElements.includes(card) && this.favoriteArray.includes(card)
      );
    } else if (this.rangeElements.length && !this.favoriteArray.length) {
      tmp = this.rangeElements;
    } else if (!this.rangeElements.length && this.favoriteArray.length) {
      tmp = this.favoriteArray;
    } else {
      tmp = this.getTemp();
    }

    const active = document.querySelectorAll('button.active');
    if (active.length === 0) {
      if (this.selectValue === 'sort-name-max') {
        tmp = tmp.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.selectValue === 'sort-name-min') {
        tmp = tmp.sort((a, b) => a.name.localeCompare(b.name)).reverse();
      } else if (this.selectValue === 'sort-year-min') {
        tmp = tmp.sort((a, b) => a.year.localeCompare(b.year));
      } else if (this.selectValue === 'sort-year-max') {
        tmp = tmp.sort((a, b) => a.year.localeCompare(b.year)).reverse();
      } else {
        tmp = tmp.sort((a, b) => (+a.num > +b.num ? 1 : -1));
      }

      return tmp;
    }

    active.forEach(elem => {
      const value = elem.getAttribute('data-filter');
      const parentClass = elem.parentElement?.className;
      if (parentClass && value) {
        keyValues.push(parentClass);
        values.push(value);
      }
    });
    keyValues.forEach((el, index) => {
      if (prevName === el) {
        if (!count) {
          if (newDataSize.length === 0) {
            this.filteredArray.forEach(card => {
              if ((card[el] as keyof IObject) === values[index]) {
                newDataColor.push(card);
              }
            });
          } else {
            newDataColor.forEach(card => {
              if ((card[el] as keyof IObject) === values[index]) {
                newDataSize.push(card);
              }
            });
          }
        } else {
          tmp.forEach(card => {
            if ((card[el] as keyof IObject) === values[index]) {
              this.filteredArray.push(card);
            }
          });
        }
      }
      if (!index) {
        prevName = el;
        this.filteredArray = tmp.filter(card => (card[el] as keyof IObject) === values[index]);
        count += 1;
      }
      if (prevName !== el && this.filteredArray.length) {
        count = 0;
        prevName = el;
        if (newDataColor.length === 0) {
          newDataColor = this.filteredArray.filter(card => {
            if ((card[el] as keyof IObject) === values[index]) {
              return card;
            }
          });
          if (newDataColor.length === 0 && keyValues.length === index + 1) {
            this.filteredArray = [];
          }
        } else {
          newDataSize = newDataColor.filter(card => {
            if ((card[el] as keyof IObject) === values[index]) {
              return card;
            }
          });
        }
      }
    });

    if (newDataColor.length > 0 && newDataSize.length === 0) {
      this.filteredArray = newDataColor;
    } else if (newDataSize.length > 0) {
      this.filteredArray = newDataSize;
    }
    if (this.selectValue === 'sort-name-max') {
      this.filteredArray = this.filteredArray.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.selectValue === 'sort-name-min') {
      this.filteredArray = this.filteredArray
        .sort((a, b) => a.name.localeCompare(b.name))
        .reverse();
    } else if (this.selectValue === 'sort-year-min') {
      this.filteredArray = this.filteredArray.sort((a, b) => a.year.localeCompare(b.year));
    } else if (this.selectValue === 'sort-year-max') {
      this.filteredArray = this.filteredArray
        .sort((a, b) => a.year.localeCompare(b.year))
        .reverse();
    } else {
      this.filteredArray = this.filteredArray.sort((a, b) => (+a.num > +b.num ? 1 : -1));
    }

    return this.filteredArray;
  }

  private buildFilterContainer(config: IConfig) {
    const container = document.createElement('div');
    container.className = config.className;
    container.textContent = config.text;

    const innerOptions = config.options.map(option => {
      const optionBtn = document.createElement('button');
      optionBtn.setAttribute('data-filter', option);
      optionBtn.addEventListener('click', () => {
        optionBtn.classList.toggle('active');
        this.startNewData();
        this.selectedCards();
      });
      return optionBtn;
    });

    container.append(...innerOptions);

    return container;
  }

  private createToysFilter() {
    const toysFilter = document.createElement('div');
    toysFilter.className = 'toys-filter';

    const filterTitle = this.createFilterTitle(FilterTitles.ToysFilter);

    const shapeConfig: IConfig = {
      className: 'shape',
      text: 'Форма:',
      options: ['шар', 'колокольчик', 'шишка', 'снежинка', 'фигурка'],
    };
    const colorConfig: IConfig = {
      className: 'color',
      text: 'Цвет:',
      options: ['белый', 'желтый', 'красный', 'синий', 'зелёный'],
    };
    const sizeConfig: IConfig = {
      className: 'size',
      text: 'Размер:',
      options: ['большой', 'средний', 'малый'],
    };

    const shape = this.buildFilterContainer(shapeConfig);
    const color = this.buildFilterContainer(colorConfig);
    const size = this.buildFilterContainer(sizeConfig);

    const favorite = this.createFavoriteToys();

    toysFilter.append(filterTitle);
    toysFilter.append(shape);
    toysFilter.append(color);
    toysFilter.append(size);
    toysFilter.append(favorite);

    return toysFilter;
  }

  private rangeFilter() {
    const res = data.filter(
      card =>
        +card.count >= this.countElements[0] &&
        +card.count <= this.countElements[1] &&
        +card.year >= this.yearElements[0] &&
        +card.year <= this.yearElements[1]
    );
    this.rangeElements = res;

    this.startNewData();
    this.selectedCards();
  }

  private buildRangeFilterContainer(config: IRangeFilterConfig) {
    const div = document.createElement('div');
    div.className = config.className;

    const span = document.createElement('span');
    span.className = 'control-span';
    span.textContent = config.title;

    const sliderContainer = document.createElement('div');
    sliderContainer.className = `${config.className}-slider-container`;

    const outputMin = document.createElement('output');
    const outputMax = document.createElement('output');
    outputMin.className = 'slider-output';
    outputMax.className = 'slider-output';
    outputMin.textContent = config.minValue.toString();
    outputMax.textContent = config.maxValue.toString();

    const slider = document.createElement('div');
    slider.className = `${config.className}-slider`;

    if (config.className === 'count') {
      noUiSlider.create(slider, {
        start: [config.minValue, config.maxValue],
        snap: true,
        connect: true,
        range: {
          min: config.minValue,
          '9%': 2,
          '18%': 3,
          '27%': 4,
          '36%': 5,
          '45%': 6,
          '54%': 7,
          '63%': 8,
          '72%': 9,
          '81%': 10,
          '90%': 11,
          max: config.maxValue,
        },
      });
    } else {
      noUiSlider.create(slider, {
        start: [config.minValue, config.maxValue],
        snap: true,
        connect: true,
        range: {
          min: config.minValue,
          '12.5%': 1950,
          '25%': 1960,
          '37.5%': 1970,
          '50%': 1980,
          '62.5%': 1990,
          '75%': 2000,
          '87.5%': 2010,
          max: config.maxValue,
        },
      });
    }

    const minMax = [outputMin, outputMax];
    ((slider as noUiSlider.target).noUiSlider as noUiSlider.API).on(
      'update',
      (values, handle, unencoded) => {
        minMax[handle].innerHTML = unencoded[handle].toString();

        if (config.className === 'count') {
          this.countElements = unencoded;
        } else {
          this.yearElements = unencoded;
        }

        this.rangeFilter();
      }
    );

    sliderContainer.append(outputMin);
    sliderContainer.append(slider);
    sliderContainer.append(outputMax);

    div.append(span);
    div.append(sliderContainer);

    return div;
  }

  private createRangeFilter() {
    const rangeFilter = document.createElement('div');
    rangeFilter.className = 'range-filter';

    const filterTitle = this.createFilterTitle(FilterTitles.RangeFilter);

    const countConfig: IRangeFilterConfig = {
      className: 'count',
      minValue: 1,
      maxValue: 12,
      title: 'Количество экземпляров:',
    };
    const yearConfig: IRangeFilterConfig = {
      className: 'year',
      minValue: 1940,
      maxValue: 2020,
      title: 'Год приобретения:',
    };

    const count = this.buildRangeFilterContainer(countConfig);
    const year = this.buildRangeFilterContainer(yearConfig);

    rangeFilter.append(filterTitle);
    rangeFilter.append(count);
    rangeFilter.append(year);

    return rangeFilter;
  }

  private resetFilters() {
    App.renderNewPage('toys');
  }

  private createSelectOptions() {
    const select = document.createElement('select');
    select.className = 'sort-select';
    select.addEventListener('change', () => {
      this.selectValue = select.value;
      this.startNewData();
      this.selectedCards();
    });

    const option1 = document.createElement('option');
    option1.value = 'sort-name-max';
    option1.textContent = 'По названию от «А» до «Я»';

    const option2 = document.createElement('option');
    option2.value = 'sort-name-min';
    option2.textContent = 'По названию от «Я» до «А»';

    const option3 = document.createElement('option');
    option3.value = 'sort-year-min';
    option3.textContent = 'По году по возрастанию';

    const option4 = document.createElement('option');
    option4.value = 'sort-year-max';
    option4.textContent = 'По году по убыванию';

    select.append(option1);
    select.append(option2);
    select.append(option3);
    select.append(option4);

    return select;
  }

  private createSortFilter() {
    const sortFilter = document.createElement('div');
    sortFilter.className = 'sort-filter';

    const filterTitle = this.createFilterTitle(FilterTitles.SortFilter);
    const select = this.createSelectOptions();

    const button = document.createElement('button');
    button.className = 'reset';
    button.textContent = 'Сбросить фильтры';
    button.addEventListener('click', this.resetFilters);

    sortFilter.append(filterTitle);
    sortFilter.append(select);
    sortFilter.append(button);

    return sortFilter;
  }

  private createControls() {
    const controls = document.createElement('div');
    controls.className = 'controls';

    const toysFilter = this.createToysFilter();
    const rangeFilter = this.createRangeFilter();
    const sortFilter = this.createSortFilter();

    controls.append(toysFilter);
    controls.append(rangeFilter);
    controls.append(sortFilter);

    return controls;
  }

  private createCard(obj: IObject) {
    const card = document.createElement('div');
    card.className = CardItems.Card;
    card.setAttribute('data-num', obj.num);

    const cardTitle = document.createElement('h2');
    cardTitle.className = CardItems.CardTitle;
    cardTitle.textContent = `${obj.name}`;

    const img = document.createElement('img');
    img.className = CardItems.CardImg;
    img.src = `../../assets/toys/${obj.num}.webp`;
    img.alt = 'toy';

    const cardDescription = document.createElement('div');
    cardDescription.className = CardItems.CardDescription;

    const Paragraph = [
      {
        class: 'count',
        text: 'Количество:',
        span: obj.count,
      },
      {
        class: 'year',
        text: 'Год покупки:',
        span: obj.year,
      },
      {
        class: 'shape',
        text: 'Форма:',
        span: obj.shape,
      },
      {
        class: 'color',
        text: 'Цвет:',
        span: obj.color,
      },
      {
        class: 'size',
        text: 'Размер:',
        span: obj.size,
      },
      {
        class: 'favorite',
        text: 'Любимая:',
        span: obj.favorite,
      },
    ];

    Paragraph.forEach(p => {
      const paragraph = document.createElement('p');
      paragraph.className = p.class;
      paragraph.textContent = p.text;

      const span = document.createElement('span');
      if (typeof p.span === 'boolean') {
        span.textContent = p.span ? 'да' : 'нет';
      } else {
        span.textContent = p.span;
      }

      paragraph.append(span);
      cardDescription.append(paragraph);
    });

    const ribbon = document.createElement('div');
    ribbon.className = CardItems.Ribbon;

    card.append(cardTitle);
    card.append(img);
    card.append(cardDescription);
    card.append(ribbon);

    return card;
  }

  private selectedCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(cardEl => {
      const cardNum = cardEl.getAttribute('data-num') as string;
      if (this.selectedElements.includes(cardNum)) {
        cardEl.classList.add('active');
      }
    });
  }

  private drawCards(cardsData: IObject[]) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';
    if (cardsData.length) {
      cardsData.forEach(obj => {
        const card = this.createCard(obj);
        card.addEventListener('click', () => {
          if (!this.selectedElements.includes(obj.num) && this.selectedElements.length < 20) {
            this.selectedElements.push(obj.num);
          } else if (this.selectedElements.includes(obj.num)) {
            card.classList.remove('active');
            const index = this.selectedElements.indexOf(obj.num);
            this.selectedElements.splice(index, 1);
          } else {
            const body = document.body;
            const popup = `
              <div class="popup">
                <div class="popup-content">"Извините, все слоты заполнены"</div>
              </div>
            `;
            body.insertAdjacentHTML('afterbegin', popup);
            setTimeout(() => (body.firstElementChild as HTMLDivElement).remove(), 3000);
          }

          const selectedCardsValue = document.querySelector('.select > span') as HTMLSpanElement;
          if (this.selectedElements.length <= 20) {
            selectedCardsValue.textContent = this.selectedElements.length.toString();
          }
          this.selectedCards();
        });
        cardContainer.append(card);
      });
    } else {
      const error = document.createElement('h2');
      error.textContent = 'Извините, совпадений не обнаружено';
      cardContainer.append(error);
    }

    return cardContainer;
  }

  private renderToysPage() {
    const blur = document.createElement('div');
    blur.className = 'blur';

    const controls = document.createElement('div');
    controls.className = 'controls';

    const controlsContent = this.createControls();
    const cardContainer = this.drawCards(data);

    blur.append(controlsContent);
    blur.append(cardContainer);
    this.container.append(blur);
  }

  render() {
    this.renderToysPage();
    return this.container;
  }
}

export default Toys;
