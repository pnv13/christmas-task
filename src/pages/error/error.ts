import Page from '../../core/templates/page';

export const enum ErrorTypes {
  Error_404 = 404,
}

class ErrorPage extends Page {
  private errorType: ErrorTypes | string;

  static TextObject: { [prop: string]: string } = {
    '404': 'Error! The page was not found.',
  };

  constructor(id: string, errorType: ErrorTypes | string) {
    super(id);
    this.errorType = errorType;
  }

  render() {
    const title = this.creatHeaderTitle(ErrorPage.TextObject[this.errorType]);
    title.style.color = '#000';
    this.container.append(title);
    return this.container;
  }
}

export default ErrorPage;
