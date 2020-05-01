export const renderNode = (html: string) =>
  new DOMParser().parseFromString(html, "text/html").body.firstChild;
