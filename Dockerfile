FROM node:14.16
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
RUN npm install && npm cache clean --force && npm run prebuild && npm run build
COPY ./ /usr/src/app
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80
CMD [ "npm", "run", "start:prod" ]
