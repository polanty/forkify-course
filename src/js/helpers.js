import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';
// time out function
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await response.json();
    //check if response was succesful or not
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    // return the data so you can call it in other folders
    return data;
  } catch (err) {
    throw err;
  }
};

// export const getJSON = async function (url) {
//   // step 1: loading recipe
//   try {
//     const fetchPro = fetch(url);
//     const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const data = await response.json();
//     //check if response was succesful or not
//     if (!response.ok) throw new Error(`${data.message} (${response.status})`);

//     // return the data so you can call it in other folders
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   // step 1: loading recipe
//   try {
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(uploadData),
//     });
//     const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const data = await response.json();
//     //check if response was succesful or not
//     if (!response.ok) throw new Error(`${data.message} (${response.status})`);

//     // return the data so you can call it in other folders
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
