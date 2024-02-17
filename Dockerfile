# pull official base image
FROM node:20-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY public package.json package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts serve -g --silent

# add app
COPY . ./

RUN npm run build

# start app
CMD ["serve", "-s",  "-l", "2048", "/app/build"]
