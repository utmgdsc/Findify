export default async function fetcher(url, options) {
    const token = localStorage.getItem("token");
    if (options === undefined || options === null) options = {};
    if (!options.hasOwnProperty("headers")) options["headers"] = {};
    options.headers = {
      ...options.headers,
      Authorization: `Token ${token}`,
    };
    return fetch(`${process.env.REACT_APP_BACKEND_URL}/${url}`, {
      ...options,
    });
  }
  