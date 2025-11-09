import useFetch from './useFetch';

const useFetchHot = (url) =>
  useFetch(url, {
    transformResponse: (payload) => payload,
  });

export default useFetchHot;