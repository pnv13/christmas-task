import Page from '../../core/templates/page';
import Start from '../start/start';
import Toys from '../toys/toys';
import Tree from '../tree/tree';
import Header from '../../core/components/header/header';
import Footer from '../../core/components/footer/footer';
import ErrorPage, { ErrorTypes } from '../error/error';

export const enum PagesId {
  StartPage = 'start',
  ToysPage = 'toys',
  TreePage = 'tree',
  DefaultPage = 'page',
}

class App {
  private static container = document.body;
  private initialPage: Start;
  private header: Header;
  private footer: Footer;

  static renderNewPage(idPage: string) {
    while (App.container.firstElementChild) {
      App.container.firstElementChild.remove();
    }

    let page: Page | null = null;
    let header: Header | null = null;
    let footer: Footer | null = null;

    if (idPage === PagesId.StartPage) {
      page = new Start(`${PagesId.DefaultPage} ${idPage}`);
      header = new Header('header', 'header', idPage);
      footer = new Footer('footer', 'footer');
    } else if (idPage === PagesId.ToysPage) {
      page = new Toys(`${PagesId.DefaultPage} ${idPage}`);
      header = new Header('header', 'header', idPage);
      footer = new Footer('footer', 'footer');
    } else if (idPage === PagesId.TreePage) {
      page = new Tree(`${PagesId.DefaultPage} ${idPage}`);
      header = new Header('header', 'header', idPage);
      footer = new Footer('footer', 'footer');
    } else {
      page = new ErrorPage(idPage, ErrorTypes.Error_404);
    }

    if (page) {
      const pageHTML = page.render();
      App.container.insertAdjacentElement('afterbegin', pageHTML);
    }
    if (header) {
      const headerHTML = header.render();
      App.container.insertAdjacentElement('afterbegin', headerHTML);
    }
    if (footer) {
      const footerHTML = footer.render();
      App.container.append(footerHTML);
    }
  }

  private enableRouteChange() {
    window.location.hash = '#start';
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      App.renderNewPage(hash);
    });
  }

  constructor() {
    this.initialPage = new Start('start');
    this.header = new Header('header', 'header', 'start');
    this.footer = new Footer('footer', 'footer');
  }

  start() {
    App.container.append(this.header.render());
    App.container.append(this.footer.render());
    App.renderNewPage('start');
    this.enableRouteChange();
  }
}

export default App;
