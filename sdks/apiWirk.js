'use strict';

var util = require('util');
var restletUtils = require('../restletUtils');
var securityUtils = require('../securityUtils');

/**
 * @class ApiWirk
 * @param {string} [endpoint] - The API endpoint
 */
function ApiWirk(endpoint) {
  if (restletUtils.isDefined(endpoint) && (!restletUtils.isString(endpoint) || restletUtils.isString(endpoint) && endpoint.length === 0)) {
    throw new Error('endpoint parameter must be a non-empty string.');
  }

  this.globalSecurity = {};
  this.securityConfigurations = {};
  this.endpoint = restletUtils.stripTrailingSlash(endpoint || 'http://api.wirk.io/v1_0');
}

/**
 * Sets up the authentication to be performed through API token
 *
 * @method
 * @name ApiWirk#setApiToken
 * @param {string} tokenName - the name of the query parameter or header based on the location parameter.
 * @param {string} tokenValue - the value of the token
 * @param {string} location - the location of the token, either 'HEADER' or 'QUERY'.
 * If undefined it defaults to 'header'.
 */
ApiWirk.prototype.configureGlobalApiToken = function(tokenName, tokenValue, location) {
  if (restletUtils.isUndefined(location)) {
    util.log('No location defined, it defaults to \'HEADER\'');
    location = 'HEADER';
  }

  if (location.toUpperCase() !== 'HEADER' && location.toUpperCase() !== 'QUERY') {
    throw new Error('Unknown location: ' + location);
  }

  this.globalSecurity = {
    type: 'API_KEY',
    placement: location.toUpperCase(),
    name: tokenName,
    token: tokenValue
  };
};

/**
 * Sets up the authentication to be performed through oAuth2 protocol
 * meaning that the Authorization header will contain a Bearer token.
 *
 * @method
 * @param token - the oAuth token to use
 */
ApiWirk.prototype.configureGlobalOAuth2Token = function (token) {
  this.globalSecurity = {
    type: 'OAUTH2',
    token: 'Bearer ' + token
  };
};

/**
 * Sets up the authentication to be performed through basic auth.
 *
 * @method
 * @name ApiWirk#setBasicAuth
 * @param {string} username - the user's username
 * @param {string} key - the user's key or password
 */
ApiWirk.prototype.configureGlobalBasicAuthentication = function(username, key) {
  this.globalSecurity = {
    type: 'BASIC',
    token: 'Basic ' + new Buffer(username + ':' + key).toString('base64')
  };
};

ApiWirk.prototype.configureBasicauthenticationAuthentication = function (username, key) {
  this.securityConfigurations.Basicauthentication = {
    type: 'BASIC',
    token: 'Basic ' + new Buffer(username + ':' + key).toString('base64')
  };
};


/**
 * Get All Apps
 * @method
 * @name ApiWirk#getApp
 * @param {object} config - the configuration object containing the query parameters and additional headers.
 * @param {object} config.headers - headers to use for the request in addition to the default ones.
 * @param {object} config.queryParameters - query parameters to use for the request in addition to the default ones.
 * @param {Function} callback - the callback called after request completion with the following parameters:
 *  - error if any technical error occured or if the response's status does not belong to the 2xx range. In that case the error would have the following structure:
{
  status : 400,
  message : 'The request cannot be fulfilled due to XXX'
}
 *  - body of the response auto-extracted from the response if the status is in the 2xx range.
 *    - Status code : 200 - Payload :
[{
  "AppName" : "sample AppName",
  "HasInstruction" : false,
  "HasQuestionOptions" : false,
  "IdApp" : 1.1,
  "Qualities" : [ ],
  "TitleQuestionOptions" : "sample TitleQuestionOptions"
}]
 *  - response the technical (low-level) node response (c.f. https://nodejs.org/api/http.html#http_http_incomingmessage)
 */
ApiWirk.prototype.getApp = function(config, callback) {
  restletUtils.executeRequest.call(this, 'GET',
    this.endpoint + '/App',
    callback,
    securityUtils.addSecurityConfiguration(config, this.globalSecurity, this.securityConfigurations, '_NONE')
  );
};

/**
 * 
 * @method
 * @name ApiWirk#getAppId
 * @param {long} Id - REQUIRED
 * @param {object} config - the configuration object containing the query parameters and additional headers.
 * @param {object} config.headers - headers to use for the request in addition to the default ones.
 * @param {object} config.queryParameters - query parameters to use for the request in addition to the default ones.
 * @param {long} config.queryParameters.{Id} - REQUIRED
 * @param {Function} callback - the callback called after request completion with the following parameters:
 *  - error if any technical error occured or if the response's status does not belong to the 2xx range. In that case the error would have the following structure:
{
  status : 400,
  message : 'The request cannot be fulfilled due to XXX'
}
 *  - body of the response auto-extracted from the response if the status is in the 2xx range.
 *    - Status code : 200 - Payload :
{
  "AppName" : "sample AppName",
  "HasInstruction" : false,
  "HasQuestionOptions" : false,
  "IdApp" : 1.1,
  "Qualities" : [ ],
  "TitleQuestionOptions" : "sample TitleQuestionOptions"
}
 *  - response the technical (low-level) node response (c.f. https://nodejs.org/api/http.html#http_http_incomingmessage)
 */
ApiWirk.prototype.getAppId = function(Id, config, callback) {
  restletUtils.checkPathVariables(Id, 'Id');

  restletUtils.executeRequest.call(this, 'GET',
    this.endpoint + '/App/' + Id + '',
    callback,
    securityUtils.addSecurityConfiguration(config, this.globalSecurity, this.securityConfigurations, '_NONE')
  );
};

/**
 * Get App Project
 * @method
 * @name ApiWirk#getAppProjectId
 * @param {long} Id - REQUIRED
 * @param {object} config - the configuration object containing the query parameters and additional headers.
 * @param {object} config.headers - headers to use for the request in addition to the default ones.
 * @param {object} config.queryParameters - query parameters to use for the request in addition to the default ones.
 * @param {string} config.queryParameters.{Id} - REQUIRED - Id of the AppProject
 * @param {Function} callback - the callback called after request completion with the following parameters:
 *  - error if any technical error occured or if the response's status does not belong to the 2xx range. In that case the error would have the following structure:
{
  status : 400,
  message : 'The request cannot be fulfilled due to XXX'
}
 *  - body of the response auto-extracted from the response if the status is in the 2xx range.
 *    - Status code : 200 - Payload :
{
  "AppName" : "sample AppName",
  "AppProjectState" : "sample AppProjectState",
  "CreationDate" : null,
  "Credit" : 1.1,
  "IdApp" : 1.1,
  "IdAppProject" : 1.1,
  "IdQuality" : 1.1,
  "Instruction" : "sample Instruction",
  "NbTaskClosed" : 1.1,
  "NbTotalTask" : 1.1,
  "QualityName" : "sample QualityName",
  "QuestionOptions" : [ "sample QuestionOptions" ],
  "Title" : "sample Title",
  "UrlNotification" : { }
}
 *  - response the technical (low-level) node response (c.f. https://nodejs.org/api/http.html#http_http_incomingmessage)
 */
ApiWirk.prototype.getAppProjectId = function(Id, config, callback) {
  restletUtils.checkPathVariables(Id, 'Id');

  restletUtils.executeRequest.call(this, 'GET',
    this.endpoint + '/AppProject/' + Id + '',
    callback,
    securityUtils.addSecurityConfiguration(config, this.globalSecurity, this.securityConfigurations, 'Basicauthentication')
  );
};

/**
 * Create App Project
 * @method
 * @name ApiWirk#postAppProject
 * @param {object} body - Description de l'app Project; is of type: anonymousRepresentation; has the following structure:
{ }
 * @param {object} config - the configuration object containing the query parameters and additional headers.
 * @param {object} config.headers - headers to use for the request in addition to the default ones.
 * @param {object} config.queryParameters - query parameters to use for the request in addition to the default ones.
 * @param {Function} callback - the callback called after request completion with the following parameters:
 *  - error if any technical error occured or if the response's status does not belong to the 2xx range. In that case the error would have the following structure:
{
  status : 400,
  message : 'The request cannot be fulfilled due to XXX'
}
 *  - body of the response auto-extracted from the response if the status is in the 2xx range.
 *    - Status code : 200 - Payload :
{
  "IdApp" : 1.1,
  "IdQuality" : 1.1,
  "Instruction" : "sample Instruction",
  "QuestionOptions" : [ "sample QuestionOptions" ],
  "Title" : "sample Title",
  "UrlNotification" : "sample UrlNotification"
}
 *  - response the technical (low-level) node response (c.f. https://nodejs.org/api/http.html#http_http_incomingmessage)
 */
ApiWirk.prototype.postAppProject = function(body, config, callback) {
  restletUtils.executeRequest.call(this, 'POST',
    this.endpoint + '/AppProject',
    callback,
    securityUtils.addSecurityConfiguration(config, this.globalSecurity, this.securityConfigurations, 'Basicauthentication'),
    body
  );
};

/**
 * Get Specified taskLine
 * @method
 * @name ApiWirk#getTaskLineId
 * @param {string} Id - REQUIRED
 * @param {object} config - the configuration object containing the query parameters and additional headers.
 * @param {object} config.headers - headers to use for the request in addition to the default ones.
 * @param {object} config.queryParameters - query parameters to use for the request in addition to the default ones.
 * @param {long} config.queryParameters.{Id} - REQUIRED - Id of the taskline
 * @param {Function} callback - the callback called after request completion with the following parameters:
 *  - error if any technical error occured or if the response's status does not belong to the 2xx range. In that case the error would have the following structure:
{
  status : 400,
  message : 'The request cannot be fulfilled due to XXX'
}
 *  - body of the response auto-extracted from the response if the status is in the 2xx range.
 *    - Status code : 200 - Payload :
{
  "IdAppProject" : 1.1,
  "IdTaskLine" : 1.1,
  "Inputs" : [ "sample Inputs" ],
  "Tasks" : {
    "IdTask" : 1.1,
    "Outputs" : { },
    "UpdateDate" : null
  }
}
 *  - response the technical (low-level) node response (c.f. https://nodejs.org/api/http.html#http_http_incomingmessage)
 */
ApiWirk.prototype.getTaskLineId = function(Id, config, callback) {
  restletUtils.checkPathVariables(Id, 'Id');

  restletUtils.executeRequest.call(this, 'GET',
    this.endpoint + '/TaskLine/' + Id + '',
    callback,
    securityUtils.addSecurityConfiguration(config, this.globalSecurity, this.securityConfigurations, 'Basicauthentication')
  );
};

/**
 * Create TaskLine
 * @method
 * @name ApiWirk#postTaskLine
 * @param {object} body - the payload; is of type: anonymousRepresentation2; has the following structure:
{ }
 * @param {object} config - the configuration object containing the query parameters and additional headers.
 * @param {object} config.headers - headers to use for the request in addition to the default ones.
 * @param {object} config.queryParameters - query parameters to use for the request in addition to the default ones.
 * @param {Function} callback - the callback called after request completion with the following parameters:
 *  - error if any technical error occured or if the response's status does not belong to the 2xx range. In that case the error would have the following structure:
{
  status : 400,
  message : 'The request cannot be fulfilled due to XXX'
}
 *  - body of the response auto-extracted from the response if the status is in the 2xx range.
 *    - Status code : 200 - Payload :
{
  "IdAppProject" : 1.1,
  "Inputs" : [ "sample Inputs" ]
}
 *  - response the technical (low-level) node response (c.f. https://nodejs.org/api/http.html#http_http_incomingmessage)
 */
ApiWirk.prototype.postTaskLine = function(body, config, callback) {
  restletUtils.executeRequest.call(this, 'POST',
    this.endpoint + '/TaskLine',
    callback,
    securityUtils.addSecurityConfiguration(config, this.globalSecurity, this.securityConfigurations, '_NONE', 'Basicauthentication'),
    body
  );
};

module.exports = ApiWirk;
