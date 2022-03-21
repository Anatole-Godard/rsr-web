/**
 * It takes a method and a URL, and returns a promise that resolves to the response of the request
 * @param {string} method - The HTTP method to use, such as GET, POST, PUT, DELETE, etc.
 * @param {string | URL} url - The URL to fetch.
 * @returns A promise.
 */
export const fetchXHR = async (method: string, url: string | URL) => {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText,
      });
    };
    xhr.send();
  });
};
