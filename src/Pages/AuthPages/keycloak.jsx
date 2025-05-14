// import Keycloak from 'keycloak-js';

// const keycloak = new Keycloak({
//   url: "http://api.kriate.co.in:8346",
//   realm: "nishkaiv",
//   clientId: "nishkaiv-client",
// });

// let initialized = false;

// export const initializeKeycloak = () => {
//   if (!initialized) {
//     initialized = true; 
//     return keycloak.init({ onLoad: 'login-required' });
//   }
//   return Promise.resolve(keycloak.authenticated);
// };


// export default keycloak;


import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: "https://43.204.108.73:8347",
  // url: "http://13.200.189.76:8080",
  realm: "master",
  clientId: "nishkaiv-client",
});

let initialized = false;

export const initializeKeycloak = () => {
  if (!initialized) {
    initialized = true;
    console.log("Initializing Keycloak...");
    return keycloak.init({ onLoad: 'login-required' })
      .then(authenticated => {
        if (authenticated) {
          console.log("Keycloak initialized and user is authenticated.");
          console.log("Access Token:", keycloak.token);
          console.log("Refresh Token:", keycloak.refreshToken);
          console.log("User Info:", keycloak.tokenParsed);
        } else {
          console.warn("User is not authenticated!");
        }
        return authenticated;
      })
      .catch(error => {
        console.error("Failed to initialize Keycloak:", error);
        throw error;
      });
  }
  console.log("Keycloak already initialized.");
  return Promise.resolve(keycloak.authenticated);
};

// Exporting Keycloak instance
export default keycloak;
