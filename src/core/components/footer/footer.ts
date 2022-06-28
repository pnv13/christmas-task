import Component from '../../templates/components';

class Footer extends Component {
  public constructor(tagName: string, className: string) {
    super(tagName, className);
  }

  renderFooter() {
    const footer = document.createElement('div');
    footer.className = 'footer-container';
    const footerContent = `
      <div class="footer-data">
        <p class="copyright">©</p>
        <p class="year-made">2021</p>
        <p class="task-name">Christmas Tree</p>
        <a class="github-username" href="https://github.com/pnv13" target="_blank">PNV13</a>
      </div>
      <a class="rss-logo" href="https://rs.school/js/"></a>
    `;
    footer.insertAdjacentHTML('afterbegin', footerContent);
    this.container.append(footer);
  }

  render() {
    this.renderFooter();
    return this.container;
  }
}

export default Footer;
