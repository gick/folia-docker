module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps : [
  
     
      // Second application
      {
        name      : 'folia-server',
        script    : 'app.js',
        watch:true,
        env: {
          NODE_ENV: 'development',
          'FOLIA_PATH':'/home/gick/Dev/folia-backend/Debian8_x64/Algo_LIRIS_Debian_x64',
          'FOLIA_CWD':'/home/gick/Dev/folia-backend/Debian8_x64/'
    
        },
        env_production : {
          NODE_ENV: 'production',
          'FOLIA_PATH':'/usr/src/app/Debian8_x64/Algo_LIRIS_Debian_x64',
          'FOLIA_CWD':'/usr/src/app/Debian8_x64/'
        }
  
      }
    ]
  
    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */
  };
  