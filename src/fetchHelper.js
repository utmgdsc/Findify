export default async function fetcher(url, options) {
<<<<<<< HEAD
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
  
=======
  const token = localStorage.getItem("token");
  if (options === undefined || options === null) options = {};
  if (!options.hasOwnProperty("headers")) options["headers"] = {};
  options.headers = {
    ...options.headers,
    Authorization: `Token ${token}`,
  };
  return fetch(`http://localhost:3000/${url}`, {
    ...options,
  });
}
>>>>>>> 9005127b42abcc77431f4c1a61a0ed43b4ec9999
