module.exports = function formatPage(htmlPage, data) {
    return htmlPage.replace(/\{%(\w+)%\}/g, (_, placeholderName) => {
      return data[placeholderName.toLowerCase()];
    });
}