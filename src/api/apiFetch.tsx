import { API_URL_BACKEND } from './index';

export function apiFetch(endpoint:any, options = {}, query = false) {
  let qs:any;

  if (query) {
    qs = JSON.stringify(query);
  }

  const getPromise = async () => {
    try {
      const fetchOptions = apiOptions(options);
      const fetchEndpoint = apiEndpoint(endpoint, qs);
      //debugger;
      const response = await fetch(fetchEndpoint, fetchOptions);
      console.log(response);
      if(response.status === 401){
        throw new Error("Credenciales incorrectas");
      }
      return response.json();
    } catch (e) {
      throw e;
    }
  };

  return getPromise();
}

export function apiEndpoint(endpoint:any, qs:any) {
  let query = '';

  if (qs) {
    query = `?${qs}`;
  }

  //let dato = `${API_URL_BACKEND}`;
  return `${API_URL_BACKEND}${endpoint}${query}`;
}

export function apiOptions(options:any = {}) {
  const dato = localStorage.getItem('dataUser')
  const accessToken = dato!=null?JSON.parse(dato).accessToken:""
  const {
    method = 'GET',
    headers = {
      'Content-Type': 'application/json'
    },
    body = false
  } = options;
  
  if (accessToken!="") {
    headers.accessToken = accessToken
  }
  
  const newOptions = {
    method,
    headers,
    body
  };

  if (body) {
    newOptions.body = headers['Content-Type'] ? JSON.stringify(body) : body;
  }

  if (!newOptions.body) {
    delete newOptions.body;
  }
  //const daton  = newOptions
  return newOptions;
}
