FROM node:14.16
WORKDIR /usr/src/app
COPY ./package.json ./
RUN npm install && npm cache clean --force
COPY . .
RUN npm run prebuild && npm run build
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80
CMD [ "npm", "run", "start:prod" ]
