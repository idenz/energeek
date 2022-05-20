/**
 *
 * @type {Start Application Server}
 */

//
const app = require("./Applications/app");
const config = require("./Helpers/config.helper");

//server start
  app.listen(config.port, () => {
    
    console.log(`server started at port ${config.port}: Restful API`);

  });

