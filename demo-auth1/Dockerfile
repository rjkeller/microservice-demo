FROM node:12-alpine

# Set the working node directory inside the container
ENV APP_HOME /srv/nodeapp
WORKDIR $APP_HOME

# Copy code sources to APP_HOME
COPY . $APP_HOME

# This is required or else npm will crash occassionally.
RUN npm config set unsafe-perm true

# Do some cleanup and then a 'npm install'
RUN rm -rf $APP_HOME/node_modules $APP_HOME/.env 2> /dev/null
RUN cd $APP_HOME && \
  npm install --only=production
RUN cd $APP_HOME && ls && pwd

ENV NODE_ENV production
ENV JWT_SECRET_KEY 2ew80f9ds8f90ew823

ENTRYPOINT ["npm", "run", "prodstart"]
